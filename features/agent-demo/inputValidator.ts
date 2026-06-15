import {
  AGENT_DEMO_DEFAULT_LOCALE,
  AGENT_DEMO_MAX_INPUT_LENGTH,
  AGENT_DEMO_SUPPORTED_LOCALES,
} from "./agentDemoConfig";
import type {
  AgentDemoLocale,
  AgentDemoRequest,
  AgentInputValidationResult,
} from "./agentDemoTypes";

const allowedRequestKeys = new Set(["question", "locale"]);
const unsafeControlCharsPattern = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
const repeatedCharacterPattern = /(.)\1{199,}/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isAgentDemoLocale(value: unknown): value is AgentDemoLocale {
  return (
    typeof value === "string" &&
    AGENT_DEMO_SUPPORTED_LOCALES.includes(value as AgentDemoLocale)
  );
}

function hasOnlyAllowedKeys(payload: Record<string, unknown>): boolean {
  return Object.keys(payload).every((key) => allowedRequestKeys.has(key));
}

function containsAbnormalQuestionPayload(question: string): boolean {
  return (
    unsafeControlCharsPattern.test(question) ||
    repeatedCharacterPattern.test(question)
  );
}

export function validateAgentDemoRequest(
  payload: unknown,
): AgentInputValidationResult {
  if (!isRecord(payload) || !hasOnlyAllowedKeys(payload)) {
    return {
      ok: false,
      code: "invalid_payload",
      error: "Agent Demo request must be an object with question and optional locale.",
    };
  }

  const rawQuestion = payload.question;

  if (typeof rawQuestion !== "string") {
    return {
      ok: false,
      code: "invalid_question",
      error: "Question must be a string.",
    };
  }

  const question = rawQuestion.trim();

  if (question.length === 0) {
    return {
      ok: false,
      code: "empty_question",
      error: "Question cannot be empty.",
    };
  }

  if (question.length > AGENT_DEMO_MAX_INPUT_LENGTH) {
    return {
      ok: false,
      code: "question_too_long",
      error: `Question must be ${AGENT_DEMO_MAX_INPUT_LENGTH} characters or fewer.`,
    };
  }

  if (containsAbnormalQuestionPayload(question)) {
    return {
      ok: false,
      code: "abnormal_payload",
      error: "Question contains abnormal payload characters.",
    };
  }

  const rawLocale = payload.locale;
  const locale =
    rawLocale === undefined || rawLocale === null
      ? AGENT_DEMO_DEFAULT_LOCALE
      : rawLocale;

  if (!isAgentDemoLocale(locale)) {
    return {
      ok: false,
      code: "invalid_locale",
      error: "Locale must be zh or en.",
    };
  }

  return {
    ok: true,
    request: {
      question,
      locale,
    },
  };
}

export function createAgentDemoRequest(
  question: string,
  locale: AgentDemoLocale = AGENT_DEMO_DEFAULT_LOCALE,
): AgentDemoRequest {
  return {
    question,
    locale,
  };
}
