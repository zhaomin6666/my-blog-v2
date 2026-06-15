import { projectService, type Project, type ProjectMeta } from "@/lib/projects";
import type { AgentKnowledgeItem } from "../agentDemoTypes";
import { scoreTextMatch, stripMarkdown, truncateText } from "./textUtils";

function projectMetaToKnowledgeItem(project: ProjectMeta, score = 0): AgentKnowledgeItem {
  return {
    source: {
      type: "project",
      title: project.title,
      url: `/projects/${project.slug}`,
      excerpt: truncateText(project.summary),
    },
    context: [
      `Project: ${project.title}`,
      `Summary: ${project.summary}`,
      `Status: ${project.statusLabel}`,
      `Type: ${project.type}`,
      `Tech Stack: ${project.techStack.join(", ")}`,
      project.highlights.length
        ? `Highlights: ${project.highlights.join(" ")}`
        : "Highlights: none",
    ].join("\n"),
    score,
  };
}

function fullProjectToKnowledgeItem(project: Project): AgentKnowledgeItem {
  const excerpt = truncateText(stripMarkdown(project.rawContent), 360);

  return {
    source: {
      type: "project",
      title: project.title,
      url: `/projects/${project.slug}`,
      excerpt,
    },
    context: [
      `Project: ${project.title}`,
      `Summary: ${project.summary}`,
      `Status: ${project.statusLabel}`,
      `Type: ${project.type}`,
      `Role: ${project.role.join(", ")}`,
      `Tech Stack: ${project.techStack.join(", ")}`,
      project.features.length ? `Features: ${project.features.join(" ")}` : "Features: none",
      project.highlights.length
        ? `Highlights: ${project.highlights.join(" ")}`
        : "Highlights: none",
      `Excerpt: ${excerpt}`,
    ].join("\n"),
    score: 10,
  };
}

export async function searchProjects(
  query: string,
  limit = 3,
): Promise<AgentKnowledgeItem[]> {
  const projects = await projectService.getPublishedProjects();

  return projects
    .map((project) => ({
      project,
      score: scoreTextMatch(query, [
        project.title,
        project.subtitle,
        project.summary,
        project.statusLabel,
        project.type,
        project.techStack.join(" "),
        project.features.join(" "),
        project.highlights.join(" "),
        project.slug,
      ]),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ project, score }) => projectMetaToKnowledgeItem(project, score));
}

export async function getProjectBySlug(
  slug: string,
): Promise<AgentKnowledgeItem | null> {
  const project = await projectService.getPublishedProjectBySlug(slug);
  if (!project) return null;

  return fullProjectToKnowledgeItem(project);
}

export async function getPublishedProjectSummaries(
  limit = 3,
): Promise<AgentKnowledgeItem[]> {
  const projects = await projectService.getPublishedProjects();
  return projects.slice(0, limit).map((project) => projectMetaToKnowledgeItem(project));
}
