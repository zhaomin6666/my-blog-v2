import { describe, expect, it } from "vitest";
import { mapBlogPostRowToPost } from "./blog-db-mapper";
import type { BlogPostRow } from "@/lib/db/dbTypes";

describe("blog-db-mapper", () => {
  it("maps snake_case rows to blog domain posts", () => {
    const row: BlogPostRow = {
      id: "post-1",
      title: "Database Content Source",
      slug: "database-content-source",
      summary: "CMS foundation",
      content_markdown: "## Intro\nDatabase-backed content.",
      status: "published",
      lang: "en",
      cover: "",
      seo_title: "SEO title",
      seo_description: "SEO description",
      tags: ["CMS", "PostgreSQL"],
      series: "Admin CMS",
      series_slug: "admin-cms",
      series_order: 1,
      date: "2026-06-21",
      published_at: "2026-06-21T00:00:00.000Z",
      created_at: "2026-06-20T00:00:00.000Z",
      updated_at: "2026-06-21T12:00:00.000Z",
    };

    const post = mapBlogPostRowToPost(row);

    expect(post).toMatchObject({
      slug: "database-content-source",
      status: "published",
      lang: "en",
      tags: ["CMS", "PostgreSQL"],
      seriesSlug: "admin-cms",
      seriesOrder: 1,
      seoTitle: "SEO title",
      seoDescription: "SEO description",
      content: "## Intro\nDatabase-backed content.",
      rawContent: "## Intro\nDatabase-backed content.",
    });
    expect(post.readingTimeMinutes).toBeGreaterThanOrEqual(1);
  });
});
