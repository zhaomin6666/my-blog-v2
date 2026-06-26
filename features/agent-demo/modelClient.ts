import {
  AGENT_DEMO_DEFAULT_MODEL_TIMEOUT_MS,
  AGENT_DEMO_MAX_OUTPUT_LENGTH,
  AGENT_DEMO_MAX_SOURCES,
} from "./agentDemoConfig";
import type {
  AgentDemoLocale,
  AgentScopeCategory,
  AgentSource,
} from "./agentDemoTypes";
import {
  logAgentDemoDebug,
  logAgentDemoInfo,
  logAgentDemoWarn,
} from "./agentDemoLogger";

const AGENT_DEMO_MAX_OUTPUT_TOKENS = 700;

export interface GenerateAgentDemoModelAnswerParams {
  question: string;
  locale: AgentDemoLocale;
  category: AgentScopeCategory;
  contextText: string;
  sources: AgentSource[];
  timeoutMs?: number;
  requestId?: string;
}

export type AgentModelClientResult =
  | {
      ok: true;
      answer: string;
      model: string;
    }
  | {
      ok: false;
      code:
        | "missing_api_key"
        | "missing_api_url"
        | "missing_model"
        | "upstream_error"
        | "upstream_timeout"
        | "invalid_response"
        | "empty_answer";
      message: string;
    };

interface ChatCompletionPayload {
  choices?: unknown;
}

interface ChatCompletionChoice {
  message?: unknown;
}

interface ChatCompletionMessage {
  content?: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getAgentDemoModel(): string | null {
  return process.env.AGENT_DEMO_MODEL?.trim() || null;
}

function getAgentDemoModelApiUrl(): string | null {
  const rawUrl = process.env.AGENT_DEMO_MODEL_API_URL?.trim();
  if (!rawUrl) return null;

  return rawUrl.endsWith("/chat/completions")
    ? rawUrl
    : `${rawUrl.replace(/\/+$/, "")}/chat/completions`;
}

function getAgentDemoModelApiKey(): string | null {
  return (
    process.env.AGENT_DEMO_MODEL_API_KEY?.trim() ||
    process.env.OPENAI_API_KEY?.trim() ||
    null
  );
}

function getAgentDemoModelTimeoutMs(timeoutMs?: number): number {
  if (typeof timeoutMs === "number" && Number.isFinite(timeoutMs) && timeoutMs > 0) {
    return timeoutMs;
  }

  const configuredTimeout = Number.parseInt(
    process.env.AGENT_DEMO_MODEL_TIMEOUT_MS ?? "",
    10,
  );

  return Number.isFinite(configuredTimeout) && configuredTimeout > 0
    ? configuredTimeout
    : AGENT_DEMO_DEFAULT_MODEL_TIMEOUT_MS;
}

function getSafeUrlSummary(apiUrl: string): string {
  try {
    const url = new URL(apiUrl);
    return `${url.origin}${url.pathname}`;
  } catch {
    return "invalid_url";
  }
}

function buildSourceList(sources: AgentSource[]): string {
  return sources
    .slice(0, AGENT_DEMO_MAX_SOURCES)
    .map((source, index) => {
      const url = source.url ? ` (${source.url})` : "";
      const excerpt = source.excerpt ? ` - ${source.excerpt}` : "";
      return `${index + 1}. [${source.type}] ${source.title}${url}${excerpt}`;
    })
    .join("\n");
}

function buildInstructions(locale: AgentDemoLocale): string {
  const languageRule =
    locale === "zh"
      ? "用中文回答，语气自然、克制、像个人网站上的只读 AI Demo。"
      : "Answer in English with a concise, natural tone suitable for a read-only personal website AI demo.";

  return [
    "You are the read-only AI Agent Demo for the AI Native Portfolio CMS starter site.",
    languageRule,
    "Answer only from the provided public context and public source list.",
    "If the context is insufficient, say that the public site content does not provide enough information.",
    "Do not invent private experience, employers, clients, buyer names, revenue, user counts, metrics, secrets, server paths, credentials, or deployment internals.",
    "Do not claim to execute commands, browse arbitrary URLs, write files, send messages, or mutate state.",
    "Keep the answer focused. Prefer 2-5 short paragraphs or a compact list when useful.",
  ].join("\n");
}

function buildInput({
  question,
  locale,
  category,
  contextText,
  sources,
}: GenerateAgentDemoModelAnswerParams): string {
  return [
    `Locale: ${locale}`,
    `Scope category: ${category}`,
    "",
    "User question:",
    question,
    "",
    "Public sources:",
    buildSourceList(sources),
    "",
    "Public context:",
    contextText,
  ].join("\n");
}

function extractChatCompletionText(payload: ChatCompletionPayload): string | null {
  if (!Array.isArray(payload.choices)) {
    return null;
  }

  const firstChoice = payload.choices[0] as ChatCompletionChoice | undefined;
  if (!isRecord(firstChoice) || !isRecord(firstChoice.message)) {
    return null;
  }

  const message = firstChoice.message as ChatCompletionMessage;
  return typeof message.content === "string" ? message.content : null;
}

function clampAnswer(answer: string): string {
  if (answer.length <= AGENT_DEMO_MAX_OUTPUT_LENGTH) return answer;

  return `${answer.slice(0, AGENT_DEMO_MAX_OUTPUT_LENGTH - 3).trim()}...`;
}

export async function generateAgentDemoModelAnswer(
  params: GenerateAgentDemoModelAnswerParams,
): Promise<AgentModelClientResult> {
  const apiUrl = getAgentDemoModelApiUrl();
  const apiKey = getAgentDemoModelApiKey();
  const startedAt = Date.now();

  if (!apiUrl) {
    logAgentDemoWarn("model_config_missing", {
      requestId: params.requestId,
      missing: "api_url",
    });
    return {
      ok: false,
      code: "missing_api_url",
      message: "Agent Demo model API URL is not configured.",
    };
  }

  if (!apiKey) {
    logAgentDemoWarn("model_config_missing", {
      requestId: params.requestId,
      missing: "api_key",
      apiUrl: getSafeUrlSummary(apiUrl),
    });
    return {
      ok: false,
      code: "missing_api_key",
      message: "Agent Demo model API key is not configured.",
    };
  }

  const model = getAgentDemoModel();

  if (!model) {
    logAgentDemoWarn("model_config_missing", {
      requestId: params.requestId,
      missing: "model",
      apiUrl: getSafeUrlSummary(apiUrl),
    });
    return {
      ok: false,
      code: "missing_model",
      message: "Agent Demo model is not configured.",
    };
  }

  const controller = new AbortController();
  let didTimeout = false;
  const timeoutMs = getAgentDemoModelTimeoutMs(params.timeoutMs);
  const timeout = setTimeout(() => {
    didTimeout = true;
    controller.abort();
  }, timeoutMs);

  try {
    logAgentDemoInfo("model_request_start", {
      requestId: params.requestId,
      apiUrl: getSafeUrlSummary(apiUrl),
      model,
      locale: params.locale,
      category: params.category,
      sourceCount: params.sources.length,
      questionLength: params.question.length,
      contextLength: params.contextText.length,
      timeoutMs,
    });

    logAgentDemoDebug("model_request_payload_summary", {
      requestId: params.requestId,
      maxTokens: AGENT_DEMO_MAX_OUTPUT_TOKENS,
      maxOutputLength: AGENT_DEMO_MAX_OUTPUT_LENGTH,
    });

    const response = await fetch(apiUrl, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: buildInstructions(params.locale),
          },
          {
            role: "user",
            content: buildInput(params),
          },
        ],
        max_tokens: AGENT_DEMO_MAX_OUTPUT_TOKENS,
      }),
    });

    if (!response.ok) {
      logAgentDemoWarn("model_request_failed", {
        requestId: params.requestId,
        status: response.status,
        statusText: response.statusText,
        durationMs: Date.now() - startedAt,
      });

      return {
        ok: false,
        code: "upstream_error",
        message: "Agent Demo model request failed.",
      };
    }

    const payload = (await response.json()) as ChatCompletionPayload;
    const answer = extractChatCompletionText(payload)?.trim();

    if (!answer) {
      logAgentDemoWarn("model_response_empty", {
        requestId: params.requestId,
        status: response.status,
        durationMs: Date.now() - startedAt,
      });

      return {
        ok: false,
        code: "empty_answer",
        message: "Agent Demo model returned an empty answer.",
      };
    }

    logAgentDemoInfo("model_request_success", {
      requestId: params.requestId,
      status: response.status,
      durationMs: Date.now() - startedAt,
      answerLength: answer.length,
      clamped: answer.length > AGENT_DEMO_MAX_OUTPUT_LENGTH,
    });

    return {
      ok: true,
      answer: clampAnswer(answer),
      model,
    };
  } catch (error) {
    if (
      didTimeout ||
      (isRecord(error) && error.name === "AbortError")
    ) {
      logAgentDemoWarn("model_request_timeout", {
        requestId: params.requestId,
        durationMs: Date.now() - startedAt,
        timeoutMs,
        errorName: isRecord(error) && typeof error.name === "string" ? error.name : "unknown",
      });

      return {
        ok: false,
        code: "upstream_timeout",
        message: "Agent Demo model request timed out.",
      };
    }

    logAgentDemoWarn("model_request_error", {
      requestId: params.requestId,
      durationMs: Date.now() - startedAt,
      errorName: isRecord(error) && typeof error.name === "string" ? error.name : "unknown",
    });

    return {
      ok: false,
      code: "upstream_error",
      message: "Agent Demo model request failed.",
    };
  } finally {
    clearTimeout(timeout);
  }
}
