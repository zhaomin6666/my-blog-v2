import type {
  AgentAllowedCategory,
  AgentBlockedCategory,
  AgentDemoLocale,
  AgentTraceStepId,
} from "./agentDemoTypes";

export const AGENT_DEMO_DEFAULT_LOCALE: AgentDemoLocale = "zh";

export const AGENT_DEMO_SUPPORTED_LOCALES = ["zh", "en"] as const;

export const AGENT_DEMO_MAX_INPUT_LENGTH = 800;

export const AGENT_DEMO_MAX_SOURCES = 5;

export const AGENT_DEMO_TRACE_STEPS: AgentTraceStepId[] = [
  "input_validation",
  "rate_limit_check",
  "scope_check",
  "retrieve_context",
  "generate_answer",
];

export const AGENT_DEMO_ALLOWED_CATEGORIES: AgentAllowedCategory[] = [
  "profile",
  "project",
  "blog",
  "agent_learning",
  "website",
  "contact_public",
];

export const AGENT_DEMO_BLOCKED_CATEGORIES: AgentBlockedCategory[] = [
  "out_of_scope",
  "privacy",
  "security",
  "server_internal",
  "dangerous_action",
  "high_risk_advice",
];

export const AGENT_DEMO_ALLOWED_SOURCE_TYPES = [
  "blog",
  "project",
  "profile",
  "system",
] as const;

export const AGENT_DEMO_PUBLIC_PROJECT_SLUGS = [
  "personal-developer-os",
  "ai-agent-demo",
] as const;

export const AGENT_DEMO_CONFIG = {
  defaultLocale: AGENT_DEMO_DEFAULT_LOCALE,
  supportedLocales: AGENT_DEMO_SUPPORTED_LOCALES,
  maxInputLength: AGENT_DEMO_MAX_INPUT_LENGTH,
  maxSources: AGENT_DEMO_MAX_SOURCES,
  publicProjectSlugs: AGENT_DEMO_PUBLIC_PROJECT_SLUGS,
} as const;
