---
title: "Example AI Native Portfolio"
slug: "example-ai-native-portfolio"
subtitle: "A neutral example project for the Personal Developer OS / AI Native Portfolio CMS starter."
summary: "An example portfolio project that demonstrates how homepage modules, projects, blog posts, profile content, contact channels, and stack groups can be managed through file mode or database mode."
status: "mvp"
statusLabel: "Example Project"
type: "Example Project"
role:
  - "Product Structure"
  - "Content Modeling"
  - "Full-stack Starter"
  - "CMS-ready Architecture"
timeline: "2026 · Example starter"
featured: true
order: 1
techStack:
  - "Next.js"
  - "React"
  - "TypeScript"
  - "Tailwind CSS"
  - "Markdown"
  - "PostgreSQL"
  - "Docker"
features:
  - "Personal Developer OS homepage with Main App, Console App, Desktop, and System Status Bar."
  - "Content modules for portfolio homepage, projects, blog, profile, contact, and stack."
  - "File-mode Markdown content for Git-based examples and database-mode content for Admin CMS editing."
  - "SEO-ready public pages, published-only content queries, sitemap, robots, and RSS support."
highlights:
  - "Shows how a portfolio can be organized as a lightweight browser-based OS instead of a generic landing page."
  - "Keeps content access behind service and repository boundaries so file mode and database mode can share the same public UI."
  - "Provides minimal example content that can be replaced with real articles, projects, profile data, and contact channels."
  - "Documents safe content practices: use placeholders in the repository and keep production configuration out of Markdown files."
links:
  - label: "Example Site"
    href: "https://example.com"
    type: "live"
  - label: "Example Repository"
    href: "https://github.com/example/ai-native-portfolio-cms"
    type: "github"
relatedPosts:
  - title: "Building an AI Native Portfolio CMS"
    slug: "building-ai-native-portfolio-cms"
relatedSeriesSlug: "example-content"
published: true
lang: "en"
seoTitle: "Example AI Native Portfolio Project"
seoDescription: "A neutral example project for a Personal Developer OS / AI Native Portfolio CMS starter, covering file-mode content, database-mode CMS editing, and safe placeholder content."
---

## Project Overview

This is an example project for the file-mode project content source. It exists so a fresh clone of the starter can render a working project page without requiring private portfolio data, production credentials, or a database.

The project describes an AI Native Portfolio CMS organized as a Personal Developer OS. It is intentionally neutral and should be replaced with your own real project once you customize the site.

## What The Starter Can Show

The starter can present a portfolio homepage with a Main App, Console App, Desktop fallback, and System Status Bar. Inside that OS shell, it can show projects, blog posts, profile content, contact channels, and stack groups.

This example project is meant to demonstrate the content model rather than claim a real deployment, user base, employer, client, or commercial result.

## File Mode

File mode stores content as Markdown in the repository. This is useful for open-source examples, pull-request based editing, and local development without external services.

In file mode, project pages can be versioned through Git. Reviewers can inspect frontmatter changes, Markdown body edits, and linked example posts before merging.

## Database Mode

Database mode is designed for production CMS usage. In that setup, project content can be created and edited through the Admin CMS, then stored in the configured database.

The public project pages should continue to read through the same project service layer. The content source decides whether the project comes from Markdown files or database records.

## Replacing This Example

When you adapt the starter, replace this example with your own project. Keep the frontmatter shape stable so project lists, detail pages, SEO metadata, sitemap output, and related blog links can continue to work.

You can also update the related post to point at your own published article, or leave it empty until your writing is ready.

## Safety Notes

Do not commit secrets, API keys, real production configuration, private deployment notes, server IP addresses, database connection strings, or confidential client information into project Markdown.

Use placeholders for repository examples, keep production values in environment variables, and only publish project information that is safe to share publicly.
