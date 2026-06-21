import type { AgentDemoLocale } from "../agentDemoTypes";

export type AgentDemoEventType =
  | "request_completed"
  | "request_blocked"
  | "request_rate_limited"
  | "request_error";

export type AgentDemoFeedbackValue = "helpful" | "not_helpful";

export interface AgentDemoEventRecord {
  requestId: string;
  eventType: AgentDemoEventType;
  allowed: boolean;
  category: string;
  locale: AgentDemoLocale | "unknown";
  latencyMs: number;
  sourceCount: number;
  traceStepCount: number;
  traceOk: boolean;
  errorType?: string;
  questionHash?: string;
  ipHash?: string;
}

export interface AgentDemoFeedbackRecord {
  requestId: string;
  feedback: AgentDemoFeedbackValue;
  category?: string;
  ipHash?: string;
}

export interface AgentDemoMetricsStore {
  insertEvent(record: AgentDemoEventRecord): Promise<void>;
  hasEvent(requestId: string): Promise<boolean>;
  insertFeedback(record: AgentDemoFeedbackRecord): Promise<void>;
}
