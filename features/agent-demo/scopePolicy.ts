import {
  AGENT_DEMO_ALLOWED_CATEGORIES,
  AGENT_DEMO_BLOCKED_CATEGORIES,
} from "./agentDemoConfig";
import type {
  AgentAllowedCategory,
  AgentBlockedCategory,
  AgentScopeCategory,
  AgentScopeResult,
} from "./agentDemoTypes";

export const AGENT_DEMO_SCOPE_CATEGORY_DESCRIPTIONS: Record<
  AgentScopeCategory,
  string
> = {
  profile: "Public author profile, background, work style, and career direction.",
  project: "Published project pages and public project metadata.",
  blog: "Published blog posts, tags, series, summaries, and public article excerpts.",
  agent_learning: "AI Agent Demo scope and public AI Agent learning journey.",
  website: "AI Native Portfolio CMS starter design, implementation, deployment, and content system.",
  contact_public: "Public contact channels and privacy-safe contact guidance.",
  out_of_scope: "Questions unrelated to the author, website, public projects, or blog content.",
  privacy: "Requests for private personal, employer, client, buyer, or contact information.",
  security: "Requests for secrets, keys, credentials, certificates, or exploitable security details.",
  server_internal: "Requests for private server paths, environment variables, infrastructure internals, or raw logs.",
  dangerous_action: "Requests to execute commands, write files, attack systems, crawl arbitrary URLs, or mutate state.",
  high_risk_advice: "Medical, legal, financial, political, or other high-risk advice outside this demo.",
};

export function isAllowedScopeCategory(
  category: AgentScopeCategory,
): category is AgentAllowedCategory {
  return AGENT_DEMO_ALLOWED_CATEGORIES.includes(category as AgentAllowedCategory);
}

export function isBlockedScopeCategory(
  category: AgentScopeCategory,
): category is AgentBlockedCategory {
  return AGENT_DEMO_BLOCKED_CATEGORIES.includes(category as AgentBlockedCategory);
}

export function createDeferredScopeResult(): AgentScopeResult {
  return {
    allowed: false,
    category: "out_of_scope",
    reason:
      "Phase 10.1 only defines scope categories. Rule-based scope classification is deferred to Phase 10.2.",
  };
}
