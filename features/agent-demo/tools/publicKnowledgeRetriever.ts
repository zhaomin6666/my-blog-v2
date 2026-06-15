import { AGENT_DEMO_MAX_SOURCES } from "../agentDemoConfig";
import type {
  AgentDemoLocale,
  AgentKnowledgeItem,
  AgentKnowledgeRetrieverResult,
  AgentScopeResult,
} from "../agentDemoTypes";
import { createAgentTrace, updateAgentTraceStep } from "../traceBuilder";
import { isAllowedScopeCategory } from "../scopePolicy";
import {
  getBlogPostBySlug,
  getRecentBlogPosts,
  searchBlogPosts,
} from "./blogKnowledgeTool";
import {
  getProjectBySlug,
  getPublishedProjectSummaries,
  searchProjects,
} from "./projectKnowledgeTool";
import {
  getPublicContact,
  getPublicProfile,
  getSystemStack,
} from "./profileKnowledgeTool";

function uniqueKnowledgeItems(items: AgentKnowledgeItem[]): AgentKnowledgeItem[] {
  const seen = new Set<string>();
  const unique: AgentKnowledgeItem[] = [];

  for (const item of items) {
    const key = `${item.source.type}:${item.source.url ?? item.source.title}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(item);
  }

  return unique;
}

function buildContextText(items: AgentKnowledgeItem[]): string {
  return items
    .map((item, index) => `Source ${index + 1}\n${item.context}`)
    .join("\n\n---\n\n");
}

async function retrieveAllowedContext(
  question: string,
  scopeResult: ScopeResultForRetriever,
  locale: AgentDemoLocale,
): Promise<AgentKnowledgeItem[]> {
  switch (scopeResult.category) {
    case "profile":
      return [await getPublicProfile(locale), await getSystemStack(locale)];
    case "contact_public":
      return [await getPublicContact(locale)];
    case "project": {
      const projectMatches = await searchProjects(question, AGENT_DEMO_MAX_SOURCES);
      if (projectMatches.length) return projectMatches;

      return getPublishedProjectSummaries(AGENT_DEMO_MAX_SOURCES);
    }
    case "blog": {
      const blogMatches = await searchBlogPosts(question, AGENT_DEMO_MAX_SOURCES);
      if (blogMatches.length) return blogMatches;

      return getRecentBlogPosts(AGENT_DEMO_MAX_SOURCES);
    }
    case "agent_learning": {
      const agentProject = await getProjectBySlug("ai-agent-demo");
      const blogMatches = await searchBlogPosts(question, 2);
      return [agentProject, ...blogMatches].filter(
        (item): item is AgentKnowledgeItem => item !== null,
      );
    }
    case "website": {
      const osProject = await getProjectBySlug("personal-developer-os");
      const blogMatches = await searchBlogPosts(question, 3);
      return [osProject, ...blogMatches].filter(
        (item): item is AgentKnowledgeItem => item !== null,
      );
    }
    default:
      return [];
  }
}

type ScopeResultForRetriever = AgentScopeResult & { allowed: true };

export async function retrievePublicKnowledge(
  question: string,
  scopeResult: AgentScopeResult,
  locale: AgentDemoLocale = "zh",
): Promise<AgentKnowledgeRetrieverResult> {
  let trace = createAgentTrace(locale);
  trace = updateAgentTraceStep(trace, "input_validation", "passed");
  trace = updateAgentTraceStep(trace, "rate_limit_check", "pending", "Deferred to Phase 10.4.");

  if (!scopeResult.allowed || !isAllowedScopeCategory(scopeResult.category)) {
    trace = updateAgentTraceStep(trace, "scope_check", "blocked", scopeResult.reason);
    trace = updateAgentTraceStep(trace, "retrieve_context", "blocked", "Scope is not allowed.");

    return {
      contextText: "",
      sources: [],
      trace,
    };
  }

  trace = updateAgentTraceStep(trace, "scope_check", "passed", scopeResult.reason);

  const items = uniqueKnowledgeItems(
    await retrieveAllowedContext(question, scopeResult as ScopeResultForRetriever, locale),
  ).slice(0, AGENT_DEMO_MAX_SOURCES);

  if (!items.length) {
    trace = updateAgentTraceStep(
      trace,
      "retrieve_context",
      "failed",
      "No enough public context was found for this question.",
    );

    return {
      contextText: "",
      sources: [],
      trace,
    };
  }

  trace = updateAgentTraceStep(
    trace,
    "retrieve_context",
    "passed",
    `Retrieved ${items.length} public source(s).`,
  );
  trace = updateAgentTraceStep(
    trace,
    "generate_answer",
    "pending",
    "Model answer generation is deferred to Phase 10.3.",
  );

  return {
    contextText: buildContextText(items),
    sources: items.map((item) => item.source),
    trace,
  };
}
