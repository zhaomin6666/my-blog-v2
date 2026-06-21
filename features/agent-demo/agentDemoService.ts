import {
  AGENT_DEMO_MAX_INPUT_LENGTH,
  AGENT_DEMO_MAX_OUTPUT_LENGTH,
  AGENT_DEMO_MAX_SOURCES,
} from "./agentDemoConfig";
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
import {
  checkAgentDemoRateLimit,
  type AgentDemoRateLimitResult,
} from "./rateLimiter";
import {
  createAgentDemoRequestId,
  logAgentDemoDebug,
  logAgentDemoInfo,
  logAgentDemoWarn,
} from "./agentDemoLogger";
import {
  buildAgentDemoEventRecord,
  recordAgentDemoEvent,
} from "./observability/agentDemoEventLogger";
import type { AgentDemoEventRecord } from "./observability/agentDemoMetricsTypes";

const foundationAnswers = {
  zh: "AI Agent Demo 的安全基础已经建立：当前阶段只定义只读 Agent 的类型、输入校验、trace 契约、安全边界和文档，不接入模型、不开放 API、不读取私有数据。",
  en: "The AI Agent Demo safety foundation is in place: this phase defines the read-only agent types, input validation, trace contract, safety boundary, and documentation without connecting a model, exposing an API, or reading private data.",
} as const;

export function createAgentDemoFoundationResponse(
  payload: unknown,
): AgentDemoResponse {
  const requestId = createAgentDemoRequestId();
  const validation = validateAgentDemoRequest(payload);

  if (!validation.ok) {
    const trace = updateAgentTraceStep(
      createAgentTrace(),
      "input_validation",
      "failed",
      validation.error,
    );

    return {
      requestId,
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
    requestId,
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
  checkRateLimit?: (identifier: string) => AgentDemoRateLimitResult;
  recordEvent?: (record: AgentDemoEventRecord) => Promise<void>;
  rateLimitIdentifier?: string;
  clientIdentifier?: string;
  requestId?: string;
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

const rateLimitAnswers: Record<AgentDemoLocale, string> = {
  zh: "请求有点频繁了。请稍后再试，AI Agent Demo 会限制短时间内的连续调用。",
  en: "Too many requests. Please try again later; the AI Agent Demo limits repeated calls in a short window.",
};

function buildUsage(
  question: string,
  sources: AgentSource[],
  options: {
    answer?: string;
    rateLimit?: AgentDemoRateLimitResult;
  } = {},
) {
  return {
    inputLength: question.length,
    maxInputLength: AGENT_DEMO_MAX_INPUT_LENGTH,
    sourceCount: sources.length,
    maxSources: AGENT_DEMO_MAX_SOURCES,
    outputLength: options.answer?.length,
    maxOutputLength: AGENT_DEMO_MAX_OUTPUT_LENGTH,
    rateLimitRemaining: options.rateLimit?.remaining,
    rateLimitResetAt: options.rateLimit?.resetAt,
  };
}

function getQuestionForHash(payload: unknown): string | undefined {
  if (!payload || typeof payload !== "object") return undefined;
  const question = (payload as { question?: unknown }).question;
  return typeof question === "string" ? question : undefined;
}

async function finalizeAgentDemoResponse(
  response: AgentDemoResponse,
  options: {
    question?: string;
    locale?: AgentDemoLocale;
    clientIdentifier?: string;
    startedAt: number;
    recordEvent?: (record: AgentDemoEventRecord) => Promise<void>;
  },
): Promise<AgentDemoResponse> {
  const record = buildAgentDemoEventRecord({
    response,
    question: options.question,
    locale: options.locale,
    clientIdentifier: options.clientIdentifier,
    latencyMs: Date.now() - options.startedAt,
  });

  try {
    await (options.recordEvent ?? recordAgentDemoEvent)(record);
  } catch {
    logAgentDemoWarn("observability_event_recorder_failed", {
      requestId: response.requestId,
      category: response.category,
    });
  }

  return response;
}

function createBlockedTrace(
  locale: AgentDemoLocale,
  scopeResult: AgentScopeResult,
  rateLimit: AgentDemoRateLimitResult,
) {
  let trace = createAgentTrace(locale);
  trace = updateAgentTraceStep(trace, "input_validation", "passed");
  trace = updateAgentTraceStep(
    trace,
    "rate_limit_check",
    "passed",
    `Remaining requests in current window: ${rateLimit.remaining}.`,
  );
  trace = updateAgentTraceStep(trace, "scope_check", "blocked", scopeResult.reason);
  trace = updateAgentTraceStep(trace, "retrieve_context", "blocked", "Scope is not allowed.");
  trace = updateAgentTraceStep(trace, "generate_answer", "blocked", "Refused before model generation.");
  return trace;
}

function normalizeRetrieverTrace(
  trace: AgentKnowledgeRetrieverResult["trace"],
  rateLimit: AgentDemoRateLimitResult,
): AgentKnowledgeRetrieverResult["trace"] {
  let normalizedTrace = updateAgentTraceStep(trace, "input_validation", "passed");
  normalizedTrace = updateAgentTraceStep(
    normalizedTrace,
    "rate_limit_check",
    "passed",
    `Remaining requests in current window: ${rateLimit.remaining}.`,
  );
  return normalizedTrace;
}

function createRateLimitedTrace(
  locale: AgentDemoLocale,
  rateLimit: AgentDemoRateLimitResult,
) {
  let trace = createAgentTrace(locale);
  trace = updateAgentTraceStep(trace, "input_validation", "passed");
  trace = updateAgentTraceStep(
    trace,
    "rate_limit_check",
    "blocked",
    `Rate limit exceeded. Try again after ${new Date(rateLimit.resetAt).toISOString()}.`,
  );
  trace = updateAgentTraceStep(trace, "scope_check", "blocked", "Rate limited before scope classification.");
  trace = updateAgentTraceStep(trace, "retrieve_context", "blocked", "Rate limited before retrieval.");
  trace = updateAgentTraceStep(trace, "generate_answer", "blocked", "Rate limited before model generation.");
  return trace;
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
  const requestId = options.requestId ?? createAgentDemoRequestId();
  const startedAt = Date.now();
  const validation = validateAgentDemoRequest(payload);

  if (!validation.ok) {
    logAgentDemoWarn("service_validation_failed", {
      requestId,
      code: validation.code,
      durationMs: Date.now() - startedAt,
    });

    const trace = updateAgentTraceStep(
      createAgentTrace(),
      "input_validation",
      "failed",
      validation.error,
    );

    return finalizeAgentDemoResponse(
      {
        requestId,
        answer: validation.error,
        allowed: false,
        category: "error",
        trace,
        sources: [],
        error: validation.code,
      },
      {
        question: getQuestionForHash(payload),
        clientIdentifier: options.clientIdentifier,
        startedAt,
        recordEvent: options.recordEvent,
      },
    );
  }

  const { question, locale } = validation.request;
  logAgentDemoInfo("service_request_validated", {
    requestId,
    locale,
    inputLength: question.length,
  });

  const classifyScope = options.classifyScope ?? classifyAgentDemoScope;
  const retrieveKnowledge =
    options.retrieveKnowledge ?? retrievePublicKnowledgeLazily;
  const generateModelAnswer =
    options.generateModelAnswer ?? generateAgentDemoModelAnswer;
  const rateLimit = (options.checkRateLimit ?? checkAgentDemoRateLimit)(
    options.rateLimitIdentifier ?? "local",
  );
  logAgentDemoDebug("service_rate_limit_checked", {
    requestId,
    allowed: rateLimit.allowed,
    remaining: rateLimit.remaining,
    resetAt: rateLimit.resetAt,
  });

  if (!rateLimit.allowed) {
    logAgentDemoWarn("service_rate_limited", {
      requestId,
      limit: rateLimit.limit,
      resetAt: rateLimit.resetAt,
      durationMs: Date.now() - startedAt,
    });

    return finalizeAgentDemoResponse(
      {
        requestId,
        answer: rateLimitAnswers[locale],
        allowed: false,
        category: "error",
        trace: createRateLimitedTrace(locale, rateLimit),
        sources: [],
        usage: buildUsage(question, [], {
          answer: rateLimitAnswers[locale],
          rateLimit,
        }),
        error: "rate_limited",
      },
      {
        question,
        locale,
        clientIdentifier: options.clientIdentifier,
        startedAt,
        recordEvent: options.recordEvent,
      },
    );
  }

  const scopeResult = classifyScope(question);
  logAgentDemoInfo("service_scope_classified", {
    requestId,
    allowed: scopeResult.allowed,
    category: scopeResult.category,
  });

  if (!scopeResult.allowed) {
    logAgentDemoInfo("service_scope_blocked", {
      requestId,
      category: scopeResult.category,
      durationMs: Date.now() - startedAt,
    });

    return finalizeAgentDemoResponse(
      {
        requestId,
        answer: blockedAnswers[locale],
        allowed: false,
        category: scopeResult.category,
        trace: createBlockedTrace(locale, scopeResult, rateLimit),
        sources: [],
        usage: buildUsage(question, [], { answer: blockedAnswers[locale], rateLimit }),
      },
      {
        question,
        locale,
        clientIdentifier: options.clientIdentifier,
        startedAt,
        recordEvent: options.recordEvent,
      },
    );
  }

  const retrievalStartedAt = Date.now();
  const retrieval = await retrieveKnowledge(question, scopeResult, locale);
  logAgentDemoInfo("service_context_retrieved", {
    requestId,
    category: scopeResult.category,
    sourceCount: retrieval.sources.length,
    contextLength: retrieval.contextText.length,
    durationMs: Date.now() - retrievalStartedAt,
  });
  let trace = normalizeRetrieverTrace(retrieval.trace, rateLimit);

  if (!retrieval.contextText || retrieval.sources.length === 0) {
    logAgentDemoWarn("service_context_empty", {
      requestId,
      category: scopeResult.category,
      durationMs: Date.now() - startedAt,
    });

    trace = updateAgentTraceStep(
      trace,
      "generate_answer",
      "blocked",
      "No public context was available for model generation.",
    );

    return finalizeAgentDemoResponse(
      {
        requestId,
        answer: noContextAnswers[locale],
        allowed: true,
        category: scopeResult.category,
        trace,
        sources: retrieval.sources,
        usage: buildUsage(question, retrieval.sources, {
          answer: noContextAnswers[locale],
          rateLimit,
        }),
      },
      {
        question,
        locale,
        clientIdentifier: options.clientIdentifier,
        startedAt,
        recordEvent: options.recordEvent,
      },
    );
  }

  const modelResult = await generateModelAnswer({
    question,
    locale,
    category: scopeResult.category as AgentScopeCategory,
    contextText: retrieval.contextText,
    sources: retrieval.sources,
    requestId,
  });

  if (!modelResult.ok) {
    logAgentDemoWarn("service_model_failed", {
      requestId,
      code: modelResult.code,
      category: scopeResult.category,
      durationMs: Date.now() - startedAt,
    });

    trace = updateAgentTraceStep(trace, "generate_answer", "failed", modelResult.message);

    return finalizeAgentDemoResponse(
      {
        requestId,
        answer: modelErrorAnswers[locale],
        allowed: true,
        category: scopeResult.category,
        trace,
        sources: retrieval.sources,
        usage: buildUsage(question, retrieval.sources, {
          answer: modelErrorAnswers[locale],
          rateLimit,
        }),
        error: modelResult.code,
      },
      {
        question,
        locale,
        clientIdentifier: options.clientIdentifier,
        startedAt,
        recordEvent: options.recordEvent,
      },
    );
  }

  trace = updateAgentTraceStep(
    trace,
    "generate_answer",
    "passed",
    `Generated with ${modelResult.model}.`,
  );

  logAgentDemoInfo("service_request_completed", {
    requestId,
    category: scopeResult.category,
    sourceCount: retrieval.sources.length,
    answerLength: modelResult.answer.length,
    durationMs: Date.now() - startedAt,
  });

  return finalizeAgentDemoResponse(
    {
      requestId,
      answer: modelResult.answer,
      allowed: true,
      category: scopeResult.category,
      trace,
      sources: retrieval.sources,
      usage: buildUsage(question, retrieval.sources, {
        answer: modelResult.answer,
        rateLimit,
      }),
    },
    {
      question,
      locale,
      clientIdentifier: options.clientIdentifier,
      startedAt,
      recordEvent: options.recordEvent,
    },
  );
}
