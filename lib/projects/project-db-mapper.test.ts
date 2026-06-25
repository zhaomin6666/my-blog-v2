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

  it("maps object links from Projects Admin into public link data", () => {
    const row: ProjectRow = {
      id: "project-2",
      title: "Admin Project",
      slug: "admin-project",
      subtitle: "",
      summary: "",
      content_markdown: "",
      status: "mvp",
      type: "",
      role: [],
      timeline: "",
      featured: false,
      display_order: 1,
      tech_stack: [],
      features: [],
      highlights: [],
      links: {
        github: "https://github.com/example/repo",
        live: "https://example.com",
        case: "/projects/admin-project",
      },
      related_posts: [],
      related_series_slug: "",
      published: true,
      lang: "en",
      seo_title: "",
      seo_description: "",
    };

    const project = mapProjectRowToProject(row);

    expect(project.links).toEqual([
      {
        label: "github",
        href: "https://github.com/example/repo",
        type: "github",
      },
      {
        label: "live",
        href: "https://example.com",
        type: "live",
      },
      {
        label: "case",
        href: "/projects/admin-project",
        type: "live",
      },
    ]);
  });
});
