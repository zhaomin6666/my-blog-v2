import { afterEach, describe, expect, it, vi } from "vitest";
import { resetAgentDemoRateLimitForTests } from "../rateLimiter";
import { submitAgentDemoFeedback } from "./agentDemoFeedbackService";
import type { AgentDemoMetricsStore } from "./agentDemoMetricsTypes";

const requestId = "11111111-1111-4111-8111-111111111111";

describe("submitAgentDemoFeedback", () => {
  afterEach(() => {
    resetAgentDemoRateLimitForTests();
    vi.unstubAllEnvs();
  });

  it("rejects invalid request ids and feedback values", async () => {
    await expect(
      submitAgentDemoFeedback({
        requestId: "not-a-uuid",
        feedback: "helpful",
      }),
    ).resolves.toEqual({ ok: false, error: "invalid_request_id" });

    await expect(
      submitAgentDemoFeedback({
        requestId,
        feedback: "free text",
      }),
    ).resolves.toEqual({ ok: false, error: "invalid_feedback" });

    await expect(
      submitAgentDemoFeedback({
        requestId,
        feedback: "helpful",
        reason: "free text is not accepted",
      }),
    ).resolves.toEqual({ ok: false, error: "invalid_feedback" });
  });

  it("stores minimal feedback when the original request exists", async () => {
    vi.stubEnv("AGENT_DEMO_OBSERVABILITY_ENABLED", "true");
    vi.stubEnv("AGENT_DEMO_DATABASE_URL", "postgres://example");
    vi.stubEnv("AGENT_DEMO_HASH_SALT", "salt");
    const store: AgentDemoMetricsStore = {
      insertEvent: vi.fn(),
      hasEvent: vi.fn(async () => true),
      insertFeedback: vi.fn(),
    };

    const result = await submitAgentDemoFeedback(
      {
        requestId,
        feedback: "helpful",
        category: "profile",
      },
      {
        clientIdentifier: "203.0.113.10",
        store,
      },
    );

    expect(result).toEqual({ ok: true });
    expect(store.insertFeedback).toHaveBeenCalledWith({
      requestId,
      feedback: "helpful",
      category: "profile",
      ipHash: expect.stringMatching(/^[a-f0-9]{64}$/),
    });
    expect(JSON.stringify((store.insertFeedback as ReturnType<typeof vi.fn>).mock.calls)).not.toContain(
      "203.0.113.10",
    );
  });

  it("requires an existing request when observability storage is available", async () => {
    vi.stubEnv("AGENT_DEMO_OBSERVABILITY_ENABLED", "true");
    vi.stubEnv("AGENT_DEMO_DATABASE_URL", "postgres://example");
    const store: AgentDemoMetricsStore = {
      insertEvent: vi.fn(),
      hasEvent: vi.fn(async () => false),
      insertFeedback: vi.fn(),
    };

    const result = await submitAgentDemoFeedback(
      {
        requestId,
        feedback: "not_helpful",
      },
      {
        store,
      },
    );

    expect(result).toEqual({ ok: false, error: "request_not_found" });
    expect(store.insertFeedback).not.toHaveBeenCalled();
  });
});
