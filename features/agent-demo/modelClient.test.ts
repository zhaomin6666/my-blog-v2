import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { generateAgentDemoModelAnswer } from "./modelClient";

const originalEnv = process.env;

function params() {
  return {
    question: "Who are you?",
    locale: "en" as const,
    category: "profile" as const,
    contextText: "Public profile context",
    sources: [
      {
        type: "profile" as const,
        title: "Profile",
        url: "/",
        excerpt: "Public profile excerpt",
      },
    ],
  };
}

describe("generateAgentDemoModelAnswer", () => {
  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    process.env = originalEnv;
  });

  it("requires AGENT_DEMO_MODEL_API_URL", async () => {
    delete process.env.AGENT_DEMO_MODEL_API_URL;
    process.env.AGENT_DEMO_MODEL_API_KEY = "test-key";
    process.env.AGENT_DEMO_MODEL = "test-model";

    const result = await generateAgentDemoModelAnswer(params());

    expect(result).toMatchObject({
      ok: false,
      code: "missing_api_url",
    });
  });

  it("requires AGENT_DEMO_MODEL_API_KEY", async () => {
    process.env.AGENT_DEMO_MODEL_API_URL = "https://example.com/v1/chat/completions";
    delete process.env.AGENT_DEMO_MODEL_API_KEY;
    delete process.env.OPENAI_API_KEY;
    process.env.AGENT_DEMO_MODEL = "test-model";

    const result = await generateAgentDemoModelAnswer(params());

    expect(result).toMatchObject({
      ok: false,
      code: "missing_api_key",
    });
  });

  it("requires AGENT_DEMO_MODEL", async () => {
    process.env.AGENT_DEMO_MODEL_API_URL = "https://example.com/v1/chat/completions";
    process.env.AGENT_DEMO_MODEL_API_KEY = "test-key";
    delete process.env.AGENT_DEMO_MODEL;

    const result = await generateAgentDemoModelAnswer(params());

    expect(result).toMatchObject({
      ok: false,
      code: "missing_model",
    });
  });

  it("returns content from a successful chat completions payload", async () => {
    process.env.AGENT_DEMO_MODEL_API_URL = "https://example.com/v1";
    process.env.AGENT_DEMO_MODEL_API_KEY = "test-key";
    process.env.AGENT_DEMO_MODEL = "test-model";
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: "Answer from public context.",
            },
          },
        ],
      }),
    }));
    vi.stubGlobal("fetch", fetchMock);

    const result = await generateAgentDemoModelAnswer(params());

    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.com/v1/chat/completions",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer test-key",
        }),
      }),
    );
    expect(result).toEqual({
      ok: true,
      answer: "Answer from public context.",
      model: "test-model",
    });
  });

  it("keeps a full chat completions URL unchanged", async () => {
    process.env.AGENT_DEMO_MODEL_API_URL =
      "https://example.com/v1/chat/completions";
    process.env.AGENT_DEMO_MODEL_API_KEY = "test-key";
    process.env.AGENT_DEMO_MODEL = "test-model";
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: "OK",
            },
          },
        ],
      }),
    }));
    vi.stubGlobal("fetch", fetchMock);

    await generateAgentDemoModelAnswer(params());

    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.com/v1/chat/completions",
      expect.any(Object),
    );
  });

  it("returns a safe upstream error without exposing raw details", async () => {
    process.env.AGENT_DEMO_MODEL_API_URL = "https://example.com/v1/chat/completions";
    process.env.AGENT_DEMO_MODEL_API_KEY = "test-key";
    process.env.AGENT_DEMO_MODEL = "test-model";
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: false,
        status: 500,
        json: async () => ({ error: { message: "raw upstream detail" } }),
      })),
    );

    const result = await generateAgentDemoModelAnswer(params());

    expect(result).toEqual({
      ok: false,
      code: "upstream_error",
      message: "Agent Demo model request failed.",
    });
  });
});
