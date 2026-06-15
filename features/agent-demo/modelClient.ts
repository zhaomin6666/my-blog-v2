import { AGENT_DEMO_MAX_SOURCES } from "./agentDemoConfig";
import type {
  AgentDemoLocale,
  AgentScopeCategory,
  AgentSource,
} from "./agentDemoTypes";

const OPENAI_RESPONSES_API_URL = "https://api.openai.com/v1/responses";
const AGENT_DEMO_MAX_OUTPUT_TOKENS = 700;

export interface GenerateAgentDemoModelAnswerParams {
  question: string;
  locale: AgentDemoLocale;
  category: AgentScopeCategory;
  contextText: string;
  sources: AgentSource[];
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
        | "missing_model"
        | "upstream_error"
        | "invalid_response"
        | "empty_answer";
      message: string;
    };

interface OpenAIOutputText {
  type: "output_text";
  text: string;
}

interface OpenAIResponseOutputMessage {
  type?: string;
  content?: unknown;
}

interface OpenAIResponsePayload {
  output_text?: unknown;
  output?: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isOutputText(value: unknown): value is OpenAIOutputText {
  return (
    isRecord(value) &&
    value.type === "output_text" &&
    typeof value.text === "string"
  );
}

function getAgentDemoModel(): string | null {
  return process.env.AGENT_DEMO_MODEL?.trim() || null;
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
    "You are the read-only AI Agent Demo for the Personal Developer OS website.",
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

function extractOutputText(payload: OpenAIResponsePayload): string | null {
  if (typeof payload.output_text === "string") {
    return payload.output_text;
  }

  if (!Array.isArray(payload.output)) {
    return null;
  }

  const parts: string[] = [];

  for (const item of payload.output as OpenAIResponseOutputMessage[]) {
    if (!isRecord(item) || !Array.isArray(item.content)) continue;

    for (const contentItem of item.content) {
      if (isOutputText(contentItem)) {
        parts.push(contentItem.text);
      }
    }
  }

  return parts.length ? parts.join("\n") : null;
}

export async function generateAgentDemoModelAnswer(
  params: GenerateAgentDemoModelAnswerParams,
): Promise<AgentModelClientResult> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (!apiKey) {
    return {
      ok: false,
      code: "missing_api_key",
      message: "Agent Demo model API key is not configured.",
    };
  }

  const model = getAgentDemoModel();

  if (!model) {
    return {
      ok: false,
      code: "missing_model",
      message: "Agent Demo model is not configured.",
    };
  }

  try {
    const response = await fetch(OPENAI_RESPONSES_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        instructions: buildInstructions(params.locale),
        input: buildInput(params),
        max_output_tokens: AGENT_DEMO_MAX_OUTPUT_TOKENS,
        store: false,
      }),
    });

    if (!response.ok) {
      return {
        ok: false,
        code: "upstream_error",
        message: "Agent Demo model request failed.",
      };
    }

    const payload = (await response.json()) as OpenAIResponsePayload;
    const answer = extractOutputText(payload)?.trim();

    if (!answer) {
      return {
        ok: false,
        code: "empty_answer",
        message: "Agent Demo model returned an empty answer.",
      };
    }

    return {
      ok: true,
      answer,
      model,
    };
  } catch {
    return {
      ok: false,
      code: "upstream_error",
      message: "Agent Demo model request failed.",
    };
  }
}
