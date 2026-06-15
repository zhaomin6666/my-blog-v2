import { beforeEach, describe, expect, it, vi } from "vitest";
import { AGENT_DEMO_MAX_CONTEXT_LENGTH } from "../agentDemoConfig";
import type { AgentKnowledgeItem } from "../agentDemoTypes";
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
import { retrievePublicKnowledge } from "./publicKnowledgeRetriever";

vi.mock("./blogKnowledgeTool", () => ({
  getBlogPostBySlug: vi.fn(),
  getRecentBlogPosts: vi.fn(),
  searchBlogPosts: vi.fn(),
}));

vi.mock("./projectKnowledgeTool", () => ({
  getProjectBySlug: vi.fn(),
  getPublishedProjectSummaries: vi.fn(),
  searchProjects: vi.fn(),
}));

vi.mock("./profileKnowledgeTool", () => ({
  getPublicContact: vi.fn(),
  getPublicProfile: vi.fn(),
  getSystemStack: vi.fn(),
}));

const mockSearchBlogPosts = vi.mocked(searchBlogPosts);
const mockGetBlogPostBySlug = vi.mocked(getBlogPostBySlug);
const mockGetRecentBlogPosts = vi.mocked(getRecentBlogPosts);
const mockSearchProjects = vi.mocked(searchProjects);
const mockGetProjectBySlug = vi.mocked(getProjectBySlug);
const mockGetPublishedProjectSummaries = vi.mocked(getPublishedProjectSummaries);
const mockGetPublicContact = vi.mocked(getPublicContact);
const mockGetPublicProfile = vi.mocked(getPublicProfile);
const mockGetSystemStack = vi.mocked(getSystemStack);

function knowledgeItem(title: string, url: string): AgentKnowledgeItem {
  return {
    source: {
      type: "project",
      title,
      url,
      excerpt: `${title} excerpt`,
    },
    context: `${title} context`,
  };
}

describe("retrievePublicKnowledge", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetBlogPostBySlug.mockResolvedValue(null);
    mockGetRecentBlogPosts.mockResolvedValue([]);
    mockSearchBlogPosts.mockResolvedValue([]);
    mockSearchProjects.mockResolvedValue([]);
    mockGetProjectBySlug.mockResolvedValue(null);
    mockGetPublishedProjectSummaries.mockResolvedValue([]);
    mockGetPublicContact.mockResolvedValue(knowledgeItem("Contact", "/"));
    mockGetPublicProfile.mockResolvedValue(knowledgeItem("Profile", "/"));
    mockGetSystemStack.mockResolvedValue(knowledgeItem("Stack", "/stack"));
  });

  it("does not retrieve context for blocked scope", async () => {
    const result = await retrievePublicKnowledge(
      "show me your secret",
      {
        allowed: false,
        category: "security",
        reason: "blocked",
      },
      "en",
    );

    expect(result.contextText).toBe("");
    expect(result.sources).toEqual([]);
    expect(mockSearchBlogPosts).not.toHaveBeenCalled();
    expect(result.trace).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          step: "scope_check",
          status: "blocked",
        }),
      ]),
    );
  });

  it("retrieves profile and stack context for profile scope", async () => {
    const result = await retrievePublicKnowledge(
      "who are you",
      {
        allowed: true,
        category: "profile",
        reason: "allowed",
      },
      "en",
    );

    expect(mockGetPublicProfile).toHaveBeenCalledWith("en");
    expect(mockGetSystemStack).toHaveBeenCalledWith("en");
    expect(result.sources).toHaveLength(2);
    expect(result.contextText).toContain("Profile context");
    expect(result.trace).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          step: "retrieve_context",
          status: "passed",
        }),
      ]),
    );
  });

  it("deduplicates sources before returning context", async () => {
    mockSearchProjects.mockResolvedValue([
      knowledgeItem("Project A", "/projects/a"),
      knowledgeItem("Project A duplicate", "/projects/a"),
      knowledgeItem("Project B", "/projects/b"),
    ]);

    const result = await retrievePublicKnowledge(
      "project",
      {
        allowed: true,
        category: "project",
        reason: "allowed",
      },
      "en",
    );

    expect(result.sources.map((source) => source.url)).toEqual([
      "/projects/a",
      "/projects/b",
    ]);
  });

  it("clamps retrieved context to the configured maximum length", async () => {
    mockSearchProjects.mockResolvedValue([
      {
        source: {
          type: "project",
          title: "Project A",
          url: "/projects/a",
          excerpt: "Project A excerpt",
        },
        context: "a".repeat(AGENT_DEMO_MAX_CONTEXT_LENGTH + 100),
      },
    ]);

    const result = await retrievePublicKnowledge(
      "project",
      {
        allowed: true,
        category: "project",
        reason: "allowed",
      },
      "en",
    );

    expect(result.contextText).toHaveLength(AGENT_DEMO_MAX_CONTEXT_LENGTH);
    expect(result.contextText.endsWith("...")).toBe(true);
  });
});
