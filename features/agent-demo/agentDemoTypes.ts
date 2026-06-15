export type AgentDemoLocale = "zh" | "en";

export type AgentTraceStepId =
  | "input_validation"
  | "rate_limit_check"
  | "scope_check"
  | "retrieve_context"
  | "generate_answer";

export type AgentTraceStepStatus = "pending" | "passed" | "blocked" | "failed";

export type AgentSourceType = "blog" | "project" | "profile" | "system";

export type AgentAllowedCategory =
  | "profile"
  | "project"
  | "blog"
  | "agent_learning"
  | "website"
  | "contact_public";

export type AgentBlockedCategory =
  | "out_of_scope"
  | "privacy"
  | "security"
  | "server_internal"
  | "dangerous_action"
  | "high_risk_advice";

export type AgentScopeCategory = AgentAllowedCategory | AgentBlockedCategory;

export interface AgentDemoRequest {
  question: string;
  locale?: AgentDemoLocale;
}

export interface AgentTraceStep {
  step: AgentTraceStepId;
  label: string;
  status: AgentTraceStepStatus;
  detail?: string;
}

export interface AgentSource {
  type: AgentSourceType;
  title: string;
  url?: string;
  excerpt?: string;
}

export interface AgentUsageInfo {
  inputLength: number;
  maxInputLength: number;
  sourceCount: number;
  maxSources: number;
}

export interface AgentDemoResponse {
  answer: string;
  allowed: boolean;
  category: AgentScopeCategory | "foundation" | "error";
  trace: AgentTraceStep[];
  sources: AgentSource[];
  usage?: AgentUsageInfo;
  error?: string;
}

export interface AgentInputValidationSuccess {
  ok: true;
  request: Required<AgentDemoRequest>;
}

export interface AgentInputValidationFailure {
  ok: false;
  error: string;
  code:
    | "invalid_payload"
    | "invalid_question"
    | "empty_question"
    | "question_too_long"
    | "abnormal_payload"
    | "invalid_locale";
}

export type AgentInputValidationResult =
  | AgentInputValidationSuccess
  | AgentInputValidationFailure;

export interface AgentScopeResult {
  allowed: boolean;
  category: AgentScopeCategory;
  reason: string;
}
