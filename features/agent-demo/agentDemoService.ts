import { AGENT_DEMO_MAX_INPUT_LENGTH, AGENT_DEMO_MAX_SOURCES } from "./agentDemoConfig";
import { validateAgentDemoRequest } from "./inputValidator";
import {
  generateAgentDemoModelAnswer,
  type AgentModelClientResult,
  type GenerateAgentDemoModelAnswerParams,
} from "./modelClient";
import { buildFoundationTrace, createAgentTrace, updateAgentTraceStep } from "./traceBuilder";
import type {
  AgentDemoLocale,
  AgentDemoResponse,
  AgentKnowledgeRetrieverResult,
  AgentScopeResult,
  AgentSource,
  AgentScopeCategory,
} from "./agentDemoTypes";
import { classifyAgentDemoScope } from "./tools/scopeClassifier";

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

interface AgentDemoServiceOptions {
  classifyScope?: (question: string) => AgentScopeResult;
  retrieveKnowledge?: (
    question: string,
    scopeResult: AgentScopeResult,
    locale: AgentDemoLocale,
  ) => Promise<AgentKnowledgeRetrieverResult>;
  generateModelAnswer?: (
    params: GenerateAgentDemoModelAnswerParams,
  ) => Promise<AgentModelClientResult>;
}

const blockedAnswers: Record<AgentDemoLocale, string> = {
  zh: "这个问题超出了 AI Agent Demo 的公开只读范围。我只能回答公开 Profile、技术栈、已发布项目、已发布博客、AI Agent 学习路线和这个网站实现相关的问题。",
  en: "That question is outside the public read-only scope of this AI Agent Demo. I can only answer questions about the public profile, stack, published projects, published blog posts, AI Agent learning journey, and this website implementation.",
};

const noContextAnswers: Record<AgentDemoLocale, string> = {
  zh: "这个问题属于允许范围，但我没有在当前公开站点内容里找到足够上下文，所以不能可靠回答。",
  en: "This question is in scope, but I could not find enough context in the current public site content to answer it reliably.",
};

const modelErrorAnswers: Record<AgentDemoLocale, string> = {
  zh: "这个问题已通过范围检查，也找到了公开上下文，但模型生成暂时不可用。请稍后再试。",
  en: "This question passed the scope check and public context was found, but model generation is temporarily unavailable. Please try again later.",
};

function buildUsage(
  question: string,
  sources: AgentSource[],
) {
  return {
    inputLength: question.length,
    maxInputLength: AGENT_DEMO_MAX_INPUT_LENGTH,
    sourceCount: sources.length,
    maxSources: AGENT_DEMO_MAX_SOURCES,
  };
}

function createBlockedTrace(
  locale: AgentDemoLocale,
  scopeResult: AgentScopeResult,
) {
  let trace = createAgentTrace(locale);
  trace = updateAgentTraceStep(trace, "input_validation", "passed");
  trace = updateAgentTraceStep(
    trace,
    "rate_limit_check",
    "passed",
    "Phase 10.4 will add persistent rate limiting.",
  );
  trace = updateAgentTraceStep(trace, "scope_check", "blocked", scopeResult.reason);
  trace = updateAgentTraceStep(trace, "retrieve_context", "blocked", "Scope is not allowed.");
  trace = updateAgentTraceStep(trace, "generate_answer", "blocked", "Refused before model generation.");
  return trace;
}

function normalizeRetrieverTrace(
  trace: AgentKnowledgeRetrieverResult["trace"],
): AgentKnowledgeRetrieverResult["trace"] {
  let normalizedTrace = updateAgentTraceStep(trace, "input_validation", "passed");
  normalizedTrace = updateAgentTraceStep(
    normalizedTrace,
    "rate_limit_check",
    "passed",
    "Phase 10.4 will add persistent rate limiting.",
  );
  return normalizedTrace;
}

async function retrievePublicKnowledgeLazily(
  question: string,
  scopeResult: AgentScopeResult,
  locale: AgentDemoLocale,
): Promise<AgentKnowledgeRetrieverResult> {
  const { retrievePublicKnowledge } = await import(
    "./tools/publicKnowledgeRetriever"
  );

  return retrievePublicKnowledge(question, scopeResult, locale);
}

export async function createAgentDemoResponse(
  payload: unknown,
  options: AgentDemoServiceOptions = {},
): Promise<AgentDemoResponse> {
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
  const classifyScope = options.classifyScope ?? classifyAgentDemoScope;
  const retrieveKnowledge =
    options.retrieveKnowledge ?? retrievePublicKnowledgeLazily;
  const generateModelAnswer =
    options.generateModelAnswer ?? generateAgentDemoModelAnswer;

  const scopeResult = classifyScope(question);

  if (!scopeResult.allowed) {
    return {
      answer: blockedAnswers[locale],
      allowed: false,
      category: scopeResult.category,
      trace: createBlockedTrace(locale, scopeResult),
      sources: [],
      usage: buildUsage(question, []),
    };
  }

  const retrieval = await retrieveKnowledge(question, scopeResult, locale);
  let trace = normalizeRetrieverTrace(retrieval.trace);

  if (!retrieval.contextText || retrieval.sources.length === 0) {
    trace = updateAgentTraceStep(
      trace,
      "generate_answer",
      "blocked",
      "No public context was available for model generation.",
    );

    return {
      answer: noContextAnswers[locale],
      allowed: true,
      category: scopeResult.category,
      trace,
      sources: retrieval.sources,
      usage: buildUsage(question, retrieval.sources),
    };
  }

  const modelResult = await generateModelAnswer({
    question,
    locale,
    category: scopeResult.category as AgentScopeCategory,
    contextText: retrieval.contextText,
    sources: retrieval.sources,
  });

  if (!modelResult.ok) {
    trace = updateAgentTraceStep(trace, "generate_answer", "failed", modelResult.message);

    return {
      answer: modelErrorAnswers[locale],
      allowed: true,
      category: scopeResult.category,
      trace,
      sources: retrieval.sources,
      usage: buildUsage(question, retrieval.sources),
      error: modelResult.code,
    };
  }

  trace = updateAgentTraceStep(
    trace,
    "generate_answer",
    "passed",
    `Generated with ${modelResult.model}.`,
  );

  return {
    answer: modelResult.answer,
    allowed: true,
    category: scopeResult.category,
    trace,
    sources: retrieval.sources,
    usage: buildUsage(question, retrieval.sources),
  };
}
