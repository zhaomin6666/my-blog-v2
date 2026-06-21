import type {
  AgentDemoLocale,
  AgentDemoResponse,
} from "../agentDemoTypes";
import {
  logAgentDemoDebug,
  logAgentDemoWarn,
} from "../agentDemoLogger";
import type {
  AgentDemoEventRecord,
  AgentDemoEventType,
  AgentDemoMetricsStore,
} from "./agentDemoMetricsTypes";
import {
  hashAgentDemoValue,
  isAgentDemoObservabilityEnabled,
} from "./hashUtils";
import {
  getAgentDemoMetricsStore,
  hasAgentDemoDatabaseConfig,
} from "./postgresAgentDemoMetricsStore";

function getEventType(response: AgentDemoResponse): AgentDemoEventType {
  if (response.error === "rate_limited") return "request_rate_limited";
  if (response.error) return "request_error";
  if (!response.allowed) return "request_blocked";
  return "request_completed";
}

function isTraceOk(response: AgentDemoResponse): boolean {
  if (response.error) return false;
  return response.trace.every((step) => step.status !== "failed");
}

export function buildAgentDemoEventRecord(params: {
  response: AgentDemoResponse;
  question?: string;
  locale?: AgentDemoLocale;
  clientIdentifier?: string;
  latencyMs: number;
}): AgentDemoEventRecord {
  const { response } = params;

  return {
    requestId: response.requestId,
    eventType: getEventType(response),
    allowed: response.allowed,
    category: response.category,
    locale: params.locale ?? "unknown",
    latencyMs: params.latencyMs,
    sourceCount: response.sources.length,
    traceStepCount: response.trace.length,
    traceOk: isTraceOk(response),
    errorType: response.error,
    questionHash: hashAgentDemoValue(params.question),
    ipHash: hashAgentDemoValue(params.clientIdentifier),
  };
}

export async function recordAgentDemoEvent(
  record: AgentDemoEventRecord,
  store: AgentDemoMetricsStore = getAgentDemoMetricsStore(),
): Promise<void> {
  if (!isAgentDemoObservabilityEnabled()) {
    logAgentDemoDebug("observability_event_skipped_disabled", {
      requestId: record.requestId,
      eventType: record.eventType,
    });
    return;
  }

  if (!hasAgentDemoDatabaseConfig()) {
    logAgentDemoDebug("observability_event_skipped_no_database", {
      requestId: record.requestId,
      eventType: record.eventType,
    });
    return;
  }

  try {
    await store.insertEvent(record);
  } catch {
    logAgentDemoWarn("observability_event_write_failed", {
      requestId: record.requestId,
      eventType: record.eventType,
    });
  }
}
