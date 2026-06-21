import { afterEach, describe, expect, it, vi } from "vitest";
import { createAgentTrace, updateAgentTraceStep } from "../traceBuilder";
import type { AgentDemoResponse } from "../agentDemoTypes";
import {
  buildAgentDemoEventRecord,
  recordAgentDemoEvent,
} from "./agentDemoEventLogger";
import type { AgentDemoMetricsStore } from "./agentDemoMetricsTypes";

const requestId = "11111111-1111-4111-8111-111111111111";

function responseFixture(): AgentDemoResponse {
  return {
    requestId,
    answer: "Full model answer should never be stored.",
    allowed: true,
    category: "profile",
    trace: updateAgentTraceStep(createAgentTrace("en"), "generate_answer", "passed", "detail"),
    sources: [
      {
        type: "profile",
        title: "Profile",
        excerpt: "Source excerpt",
      },
    ],
  };
}

describe("agent demo event logger", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("builds a minimal event record without storing full question, answer, trace detail, or IP", () => {
    vi.stubEnv("AGENT_DEMO_HASH_SALT", "salt");

    const record = buildAgentDemoEventRecord({
      response: responseFixture(),
      question: "What is your phone number?",
      locale: "en",
      clientIdentifier: "203.0.113.1",
      latencyMs: 123,
    });

    expect(record).toMatchObject({
      requestId,
      eventType: "request_completed",
      allowed: true,
      category: "profile",
      locale: "en",
      latencyMs: 123,
      sourceCount: 1,
      traceStepCount: 5,
      traceOk: true,
    });
    expect(JSON.stringify(record)).not.toContain("What is your phone number?");
    expect(JSON.stringify(record)).not.toContain("Full model answer");
    expect(JSON.stringify(record)).not.toContain("203.0.113.1");
    expect(JSON.stringify(record)).not.toContain("detail");
    expect(record.questionHash).toHaveLength(64);
    expect(record.ipHash).toHaveLength(64);
  });

  it("does not call the store when observability is disabled", async () => {
    vi.stubEnv("AGENT_DEMO_OBSERVABILITY_ENABLED", "false");
    vi.stubEnv("AGENT_DEMO_DATABASE_URL", "postgres://example");
    const store: AgentDemoMetricsStore = {
      insertEvent: vi.fn(),
      hasEvent: vi.fn(),
      insertFeedback: vi.fn(),
    };

    await recordAgentDemoEvent(
      buildAgentDemoEventRecord({
        response: responseFixture(),
        latencyMs: 1,
      }),
      store,
    );

    expect(store.insertEvent).not.toHaveBeenCalled();
  });

  it("swallows store write failures", async () => {
    vi.stubEnv("AGENT_DEMO_OBSERVABILITY_ENABLED", "true");
    vi.stubEnv("AGENT_DEMO_DATABASE_URL", "postgres://example");
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const store: AgentDemoMetricsStore = {
      insertEvent: vi.fn(async () => {
        throw new Error("db unavailable");
      }),
      hasEvent: vi.fn(),
      insertFeedback: vi.fn(),
    };

    await expect(
      recordAgentDemoEvent(
        buildAgentDemoEventRecord({
          response: responseFixture(),
          latencyMs: 1,
        }),
        store,
      ),
    ).resolves.toBeUndefined();
    expect(warnSpy).toHaveBeenCalledWith(
      "[agent-demo]",
      "observability_event_write_failed",
      expect.objectContaining({
        requestId,
      }),
    );
  });
});
