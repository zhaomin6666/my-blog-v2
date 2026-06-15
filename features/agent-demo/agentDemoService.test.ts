import { afterEach, describe, expect, it, vi } from "vitest";
import { createAgentTrace, updateAgentTraceStep } from "./traceBuilder";
import { createAgentDemoResponse } from "./agentDemoService";
import type {
  AgentDemoLocale,
  AgentKnowledgeRetrieverResult,
  AgentScopeResult,
} from "./agentDemoTypes";

function retrievedContext(locale: AgentDemoLocale): AgentKnowledgeRetrieverResult {
  let trace = createAgentTrace(locale);
  trace = updateAgentTraceStep(trace, "input_validation", "passed");
  trace = updateAgentTraceStep(trace, "scope_check", "passed", "allowed");
  trace = updateAgentTraceStep(trace, "retrieve_context", "passed", "Retrieved 1 public source.");

  return {
    contextText: "Public profile context",
    sources: [
      {
        type: "profile",
        title: "Profile",
        url: "/",
        excerpt: "Public profile excerpt",
      },
    ],
    trace,
  };
}

describe("createAgentDemoResponse", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns validation errors without calling retrieval or model generation", async () => {
    const retrieveKnowledge = vi.fn();
    const generateModelAnswer = vi.fn();

    const response = await createAgentDemoResponse(
      { question: "   " },
      {
        retrieveKnowledge,
        generateModelAnswer,
      },
    );

    expect(response).toMatchObject({
      allowed: false,
      category: "error",
      error: "empty_question",
    });
    expect(retrieveKnowledge).not.toHaveBeenCalled();
    expect(generateModelAnswer).not.toHaveBeenCalled();
  });

  it("refuses blocked scope before retrieval and model generation", async () => {
    const blockedScope: AgentScopeResult = {
      allowed: false,
      category: "privacy",
      reason: "private info",
    };
    const retrieveKnowledge = vi.fn();
    const generateModelAnswer = vi.fn();

    const response = await createAgentDemoResponse(
      {
        question: "What is your real company?",
        locale: "en",
      },
      {
        classifyScope: () => blockedScope,
        retrieveKnowledge,
        generateModelAnswer,
      },
    );

    expect(response.allowed).toBe(false);
    expect(response.category).toBe("privacy");
    expect(response.trace).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          step: "generate_answer",
          status: "blocked",
        }),
      ]),
    );
    expect(retrieveKnowledge).not.toHaveBeenCalled();
    expect(generateModelAnswer).not.toHaveBeenCalled();
  });

  it("short-circuits before scope classification when rate limited", async () => {
    const classifyScope = vi.fn();
    const retrieveKnowledge = vi.fn();
    const generateModelAnswer = vi.fn();

    const response = await createAgentDemoResponse(
      {
        question: "Who are you?",
        locale: "en",
      },
      {
        classifyScope,
        retrieveKnowledge,
        generateModelAnswer,
        checkRateLimit: () => ({
          allowed: false,
          limit: 1,
          remaining: 0,
          resetAt: 2000,
          windowMs: 1000,
        }),
      },
    );

    expect(response).toMatchObject({
      allowed: false,
      category: "error",
      error: "rate_limited",
    });
    expect(response.trace).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          step: "rate_limit_check",
          status: "blocked",
        }),
      ]),
    );
    expect(classifyScope).not.toHaveBeenCalled();
    expect(retrieveKnowledge).not.toHaveBeenCalled();
    expect(generateModelAnswer).not.toHaveBeenCalled();
  });

  it("retrieves public context and returns a model answer for allowed scope", async () => {
    const allowedScope: AgentScopeResult = {
      allowed: true,
      category: "profile",
      reason: "allowed",
    };
    const retrieveKnowledge = vi.fn(async () => retrievedContext("en"));
    const generateModelAnswer = vi.fn(async () => ({
      ok: true as const,
      answer: "Model answer from public context.",
      model: "test-model",
    }));

    const response = await createAgentDemoResponse(
      {
        question: "Who are you?",
        locale: "en",
      },
      {
        classifyScope: () => allowedScope,
        retrieveKnowledge,
        generateModelAnswer,
        checkRateLimit: () => ({
          allowed: true,
          limit: 10,
          remaining: 9,
          resetAt: 2000,
          windowMs: 1000,
        }),
      },
    );

    expect(retrieveKnowledge).toHaveBeenCalledWith("Who are you?", allowedScope, "en");
    expect(generateModelAnswer).toHaveBeenCalledWith(
      expect.objectContaining({
        question: "Who are you?",
        locale: "en",
        category: "profile",
        contextText: "Public profile context",
      }),
    );
    expect(response).toMatchObject({
      answer: "Model answer from public context.",
      allowed: true,
      category: "profile",
    });
    expect(response.usage).toMatchObject({
      outputLength: "Model answer from public context.".length,
      rateLimitRemaining: 9,
    });
    expect(response.sources).toHaveLength(1);
    expect(response.trace).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          step: "generate_answer",
          status: "passed",
        }),
      ]),
    );
  });

  it("writes safe service summary logs without exposing full question or context", async () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    const allowedScope: AgentScopeResult = {
      allowed: true,
      category: "profile",
      reason: "allowed",
    };

    await createAgentDemoResponse(
      {
        question: "Who are you?",
        locale: "en",
      },
      {
        requestId: "agent-test",
        classifyScope: () => allowedScope,
        retrieveKnowledge: async () => retrievedContext("en"),
        generateModelAnswer: async () => ({
          ok: true,
          answer: "Model answer from public context.",
          model: "test-model",
        }),
        checkRateLimit: () => ({
          allowed: true,
          limit: 10,
          remaining: 9,
          resetAt: 2000,
          windowMs: 1000,
        }),
      },
    );

    expect(infoSpy).toHaveBeenCalledWith(
      "[agent-demo]",
      "service_context_retrieved",
      expect.objectContaining({
        requestId: "agent-test",
        sourceCount: 1,
        contextLength: "Public profile context".length,
      }),
    );
    expect(infoSpy).not.toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({
        question: "Who are you?",
      }),
    );
  });

  it("returns a safe error when model generation is unavailable", async () => {
    const response = await createAgentDemoResponse(
      {
        question: "Who are you?",
        locale: "en",
      },
      {
        classifyScope: () => ({
          allowed: true,
          category: "profile",
          reason: "allowed",
        }),
        retrieveKnowledge: async () => retrievedContext("en"),
        generateModelAnswer: async () => ({
          ok: false,
          code: "missing_model",
          message: "Agent Demo model is not configured.",
        }),
      },
    );

    expect(response.allowed).toBe(true);
    expect(response.error).toBe("missing_model");
    expect(response.answer).toBe(
      "This question passed the scope check and public context was found, but model generation is temporarily unavailable. Please try again later.",
    );
    expect(response.trace).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          step: "generate_answer",
          status: "failed",
        }),
      ]),
    );
  });
});
