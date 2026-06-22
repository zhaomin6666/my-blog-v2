import { describe, expect, it } from "vitest";
import type { ProjectRow } from "@/lib/db/dbTypes";
import { mapProjectRowToProject } from "./project-db-mapper";

describe("project-db-mapper", () => {
  it("maps jsonb fields and publication metadata to project domain objects", () => {
    const row: ProjectRow = {
      id: "project-1",
      title: "Personal Dev OS",
      slug: "personal-dev-os",
      subtitle: "Browser desktop",
      summary: "Developer OS project",
      content_markdown: "Project body",
      status: "production",
      type: "product",
      role: ["owner", "developer"],
      timeline: "2026",
      featured: true,
      display_order: 2,
      tech_stack: ["Next.js", "PostgreSQL"],
      features: ["Blog", "Projects"],
      highlights: ["OS shell"],
      links: [{ label: "Live", href: "/", type: "live" }],
      related_posts: [{ title: "Build log", slug: "build-log" }],
      related_series_slug: "personal-developer-os",
      published: true,
      lang: "zh",
      seo_title: "",
      seo_description: "SEO description",
    };

    const project = mapProjectRowToProject(row);

    expect(project).toMatchObject({
      title: "Personal Dev OS",
      slug: "personal-dev-os",
      status: "production",
      statusLabel: "production",
      order: 2,
      featured: true,
      techStack: ["Next.js", "PostgreSQL"],
      links: [{ label: "Live", href: "/", type: "live" }],
      relatedPosts: [{ title: "Build log", slug: "build-log" }],
      relatedSeriesSlug: "personal-developer-os",
      seoTitle: null,
      seoDescription: "SEO description",
      content: "Project body",
    });
  });
});
