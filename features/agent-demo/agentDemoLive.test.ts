import { existsSync, readFileSync } from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { createAgentDemoResponse } from "./agentDemoService";
import { createAgentTrace, updateAgentTraceStep } from "./traceBuilder";
import type { AgentKnowledgeRetrieverResult } from "./agentDemoTypes";

const liveEnvKeys = [
  "AGENT_DEMO_MODEL_API_URL",
  "AGENT_DEMO_MODEL_API_KEY",
  "AGENT_DEMO_MODEL",
] as const;

function loadDotenvLocalForLiveTest(): void {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;

  const lines = readFileSync(envPath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith("#")) continue;

    const separatorIndex = trimmedLine.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const value = trimmedLine
      .slice(separatorIndex + 1)
      .trim()
      .replace(/^["']|["']$/g, "");

    if (liveEnvKeys.includes(key as (typeof liveEnvKeys)[number])) {
      process.env[key] ??= value;
    }
  }
}

function hasLiveModelConfig(): boolean {
  return liveEnvKeys.every((key) => Boolean(process.env[key]?.trim()));
}

function tinyRetrievedContext(): AgentKnowledgeRetrieverResult {
  let trace = createAgentTrace("zh");
  trace = updateAgentTraceStep(trace, "input_validation", "passed");
  trace = updateAgentTraceStep(trace, "scope_check", "passed", "live model test");
  trace = updateAgentTraceStep(
    trace,
    "retrieve_context",
    "passed",
    "Retrieved 1 tiny public source.",
  );

  return {
    contextText: "AI Agent Demo 是个人网站里的只读演示，只回答公开内容。",
    sources: [
      {
        type: "project",
        title: "AI Agent Demo",
        url: "/projects/ai-agent-demo",
        excerpt: "只读公开内容演示。",
      },
    ],
    trace,
  };
}

loadDotenvLocalForLiveTest();

const liveIt = hasLiveModelConfig() ? it : it.skip;

describe("Agent Demo live model call", () => {
  liveIt(
    "calls the configured model with a controlled tiny prompt",
    async () => {
      const response = await createAgentDemoResponse(
        {
          question: "AI Agent Demo 是什么？",
          locale: "zh",
        },
        {
          classifyScope: () => ({
            allowed: true,
            category: "agent_learning",
            reason: "live model test",
          }),
          retrieveKnowledge: async () => tinyRetrievedContext(),
        },
      );

      expect(response.allowed).toBe(true);
      expect(response.error).toBeUndefined();
      expect(response.answer.trim().length).toBeGreaterThan(0);
      expect(response.sources).toHaveLength(1);
      expect(response.trace).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            step: "generate_answer",
            status: "passed",
          }),
        ]),
      );
    },
    20_000,
  );
});
