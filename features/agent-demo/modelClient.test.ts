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

  it("requires OPENAI_API_KEY", async () => {
    delete process.env.OPENAI_API_KEY;
    process.env.AGENT_DEMO_MODEL = "test-model";

    const result = await generateAgentDemoModelAnswer(params());

    expect(result).toMatchObject({
      ok: false,
      code: "missing_api_key",
    });
  });

  it("requires AGENT_DEMO_MODEL", async () => {
    process.env.OPENAI_API_KEY = "test-key";
    delete process.env.AGENT_DEMO_MODEL;

    const result = await generateAgentDemoModelAnswer(params());

    expect(result).toMatchObject({
      ok: false,
      code: "missing_model",
    });
  });

  it("returns output_text from a successful Responses API payload", async () => {
    process.env.OPENAI_API_KEY = "test-key";
    process.env.AGENT_DEMO_MODEL = "test-model";
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        output_text: "Answer from public context.",
      }),
    }));
    vi.stubGlobal("fetch", fetchMock);

    const result = await generateAgentDemoModelAnswer(params());

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.openai.com/v1/responses",
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

  it("returns a safe upstream error without exposing raw details", async () => {
    process.env.OPENAI_API_KEY = "test-key";
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
