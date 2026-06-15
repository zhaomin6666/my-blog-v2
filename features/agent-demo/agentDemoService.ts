import { AGENT_DEMO_MAX_INPUT_LENGTH, AGENT_DEMO_MAX_SOURCES } from "./agentDemoConfig";
import { validateAgentDemoRequest } from "./inputValidator";
import { buildFoundationTrace, createAgentTrace, updateAgentTraceStep } from "./traceBuilder";
import type { AgentDemoResponse } from "./agentDemoTypes";

const foundationAnswers = {
  zh: "AI Agent Demo 的安全基础已经建立：当前阶段只定义只读 Agent 的类型、输入校验、trace 契约、安全边界和文档，不接入模型、不开放 API、不读取私有数据。",
  en: "The AI Agent Demo safety foundation is in place: this phase defines the read-only agent types, input validation, trace contract, safety boundary, and documentation without connecting a model, exposing an API, or reading private data.",
} as const;

export function createAgentDemoFoundationResponse(
  payload: unknown,
): AgentDemoResponse {
  const validation = validateAgentDemoRequest(payload);

  if (!validation.ok) {
    const trace = updateAgentTraceStep(
      createAgentTrace(),
      "input_validation",
      "failed",
      validation.error,
    );

    return {
      answer: validation.error,
      allowed: false,
      category: "error",
      trace,
      sources: [],
      error: validation.code,
    };
  }

  const { question, locale } = validation.request;

  return {
    answer: foundationAnswers[locale],
    allowed: false,
    category: "foundation",
    trace: buildFoundationTrace(locale),
    sources: [],
    usage: {
      inputLength: question.length,
      maxInputLength: AGENT_DEMO_MAX_INPUT_LENGTH,
      sourceCount: 0,
      maxSources: AGENT_DEMO_MAX_SOURCES,
    },
  };
}
