import { checkAgentDemoRateLimit } from "../rateLimiter";
import { logAgentDemoDebug, logAgentDemoWarn } from "../agentDemoLogger";
import type {
  AgentDemoFeedbackValue,
  AgentDemoMetricsStore,
} from "./agentDemoMetricsTypes";
import {
  hashAgentDemoValue,
  isAgentDemoObservabilityEnabled,
  isUuid,
} from "./hashUtils";
import {
  getAgentDemoMetricsStore,
  hasAgentDemoDatabaseConfig,
} from "./postgresAgentDemoMetricsStore";

export interface AgentDemoFeedbackResponse {
  ok: boolean;
  error?: string;
}

export interface AgentDemoFeedbackInput {
  requestId?: unknown;
  feedback?: unknown;
  category?: unknown;
  reason?: unknown;
  message?: unknown;
  text?: unknown;
}

function isFeedbackValue(value: unknown): value is AgentDemoFeedbackValue {
  return value === "helpful" || value === "not_helpful";
}

export async function submitAgentDemoFeedback(
  input: AgentDemoFeedbackInput,
  options: {
    clientIdentifier?: string;
    store?: AgentDemoMetricsStore;
  } = {},
): Promise<AgentDemoFeedbackResponse> {
  const requestId = typeof input.requestId === "string" ? input.requestId : "";
  const category = typeof input.category === "string" ? input.category : undefined;
  const feedback = input.feedback;

  if (!requestId || !isUuid(requestId)) {
    return { ok: false, error: "invalid_request_id" };
  }

  if (!isFeedbackValue(feedback)) {
    return { ok: false, error: "invalid_feedback" };
  }

  if (
    typeof input.reason === "string" ||
    typeof input.message === "string" ||
    typeof input.text === "string"
  ) {
    return { ok: false, error: "invalid_feedback" };
  }

  const rateLimit = checkAgentDemoRateLimit(
    `feedback:${options.clientIdentifier ?? "local"}`,
  );

  if (!rateLimit.allowed) {
    return { ok: false, error: "rate_limited" };
  }

  if (!isAgentDemoObservabilityEnabled()) {
    logAgentDemoDebug("observability_feedback_skipped_disabled", {
      requestId,
      feedback,
    });
    return { ok: true };
  }

  if (!hasAgentDemoDatabaseConfig()) {
    logAgentDemoDebug("observability_feedback_skipped_no_database", {
      requestId,
      feedback,
    });
    return { ok: true };
  }

  const store = options.store ?? getAgentDemoMetricsStore();

  try {
    const eventExists = await store.hasEvent(requestId);
    if (!eventExists) {
      return { ok: false, error: "request_not_found" };
    }

    await store.insertFeedback({
      requestId,
      feedback,
      category,
      ipHash: hashAgentDemoValue(options.clientIdentifier),
    });
    return { ok: true };
  } catch {
    logAgentDemoWarn("observability_feedback_write_failed", {
      requestId,
      feedback,
    });
    return { ok: false, error: "feedback_unavailable" };
  }
}
