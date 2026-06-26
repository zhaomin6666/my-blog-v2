# Content Workflow

This is a user-facing content maintenance guide. It explains where content lives, how public routes are generated, and what to check before release.

For database-backed editing, see [Database Content Source](DATABASE_CONTENT_SOURCE.md).

## Content Source Matrix

File mode:

```text
content/site      -> Site identity and default SEO
content/homepage  -> Homepage Hero
content/pages     -> Blog / Projects page config
content/profile   -> Profile / Stack / Contact
content/blog      -> Blog posts
content/projects  -> Project case studies
```

Database mode:

```text
/admin/site      -> site_configs
/admin/hero      -> homepage_sections
/admin/pages     -> page_configs
/admin/profile   -> profile_pages
/admin/stack     -> system_stack_groups / system_stack_items
/admin/contact   -> contact_channels
/admin/blog      -> blog_posts / blog_series
/admin/projects  -> projects
```

## General Rules

- Public pages read content through services, not directly from Markdown files or PostgreSQL.
- Public URLs come from `slug` fields, not file names.
- Draft or unpublished content must stay out of public pages, sitemap, RSS, and metadata.
- `NEXT_PUBLIC_SITE_URL` controls canonical, sitemap, robots, and RSS URLs.
- `lib/translations.ts` is for UI labels, buttons, empty states, aria labels, validation messages, and command prompts. Website content belongs in content sources.

## Site, Homepage, And Page Config

File-mode files:

```text
content/site/settings.en.md
content/site/settings.zh.md
content/homepage/hero.en.md
content/homepage/hero.zh.md
content/pages/blog.en.md
content/pages/blog.zh.md
content/pages/projects.en.md
content/pages/projects.zh.md
```

Ownership:

- `content/site`: site identity and default SEO.
- `content/homepage`: homepage Hero title, subtitle, badge, and supporting data.
- `content/pages`: Blog and Projects page titles, subtitles, footer copy, and default metadata.
- `NEXT_PUBLIC_SITE_URL`: deployment URL only; do not treat it as editable content.

## Blog Posts

Blog files live under:

```text
content/blog
```

The repository scans Markdown files recursively, so series can be organized in subdirectories:

```text
content/blog/my-series/01-first-post.md
```

Public article route:

```text
/blog/[slug]
```

Moving a file does not change the public route as long as `slug` stays the same.

Minimal post:

```md
---
title: "Building an Intent Classifier"
slug: "building-intent-classifier"
summary: "A practical note about building an intent classifier for an AI Agent workflow."
date: "2026-06-12"
updatedAt: "2026-06-12"
tags: ["AI Agent", "LangChain.js"]
status: "draft"
lang: "en"
cover: ""
seoTitle: "Building an Intent Classifier"
seoDescription: "A practical AI Agent development note about intent classification."
---

# Building an Intent Classifier

Write the article here.
```

Series fields:

```yaml
series: "AI Agent Learning"
seriesSlug: "ai-agent-learning"
seriesOrder: 1
```

Blog frontmatter:

| Field | Purpose |
| --- | --- |
| `title` | Article title. |
| `slug` | Public URL segment for `/blog/[slug]`. Must be unique. |
| `summary` | List card, metadata fallback, and preview text. |
| `date` | Original publish date, `YYYY-MM-DD`. |
| `updatedAt` | Last meaningful content update, `YYYY-MM-DD`. |
| `tags` | Tags shown on cards and article pages. |
| `series` | Optional series display name. |
| `seriesSlug` | Optional series route segment. |
| `seriesOrder` | Optional numeric order inside a series. |
| `status` | `published` or `draft`. |
| `lang` | `zh` or `en`. |
| `cover` | Reserved image field. Empty string is allowed. |
| `seoTitle` | Optional SEO title override. |
| `seoDescription` | Optional SEO description override. |

Published posts can appear in `/blog`, `/blog/[slug]`, series pages, homepage Blog, Console blog commands, sitemap, RSS, and SEO metadata.

## Projects

Project files live under:

```text
content/projects
```

Recommended path:

```text
content/projects/my-new-project/index.md
```

Public project route:

```text
/projects/[slug]
```

Minimal project:

```md
---
title: "My New Project"
slug: "my-new-project"
subtitle: "A short one-line project description."
summary: "A concise project summary for cards and metadata."
status: "building"
statusLabel: "Building"
type: "Learning Project"
role:
  - "Engineering"
timeline: "2026"
featured: false
order: 10
techStack:
  - "Next.js"
  - "TypeScript"
features:
  - "Feature currently in scope."
highlights:
  - "Engineering note or design decision."
links: []
relatedPosts: []
relatedSeriesSlug: ""
published: false
lang: "en"
seoTitle: "My New Project"
seoDescription: "A short SEO description for the project."
---

## Background

Write the case study here.
```

Project frontmatter:

| Field | Purpose |
| --- | --- |
| `title` | Project title. |
| `slug` | Public URL segment for `/projects/[slug]`. Must be unique. |
| `subtitle` | Short supporting line. |
| `summary` | Project cards and metadata fallback. |
| `status` | Normalized status, such as `building`, `production`, or `mvp`. |
| `statusLabel` | Human-readable status label. |
| `type` | Project category. |
| `role` | Role list. |
| `timeline` | Time period or phase note. |
| `featured` | `true` shows the project on the homepage. |
| `order` | Sorting order. Lower numbers appear earlier. |
| `techStack` | Stack tags. |
| `features` | Current scope or user-visible capabilities. |
| `highlights` | Engineering notes and design decisions. |
| `links` | Link objects with `label`, `href`, and `type`. |
| `relatedPosts` | Related blog post references. |
| `relatedSeriesSlug` | Connects the project to a blog series. |
| `published` | `true` makes the project public. |
| `lang` | `zh` or `en`. |
| `seoTitle` | Optional SEO title override. |
| `seoDescription` | Optional SEO description override. |

Published projects can appear in `/projects`, `/projects/[slug]`, homepage Projects, Console projects output, sitemap, and related project blocks.

## Profile, Contact, And Stack

File-mode profile files:

```text
content/profile/profile.md
content/profile/contact-channels.md
content/profile/system-stack.md
```

Guidelines:

- Keep public profile copy accurate and privacy-safe.
- Use `visible: true` only for contact channels that should appear publicly.
- Empty contact `href` values should not become active links.
- Keep stack groups honest about current capability and learning status.
- Do not publish private contact details, private resume files, secrets, private client names, or sensitive project details.

## Validation

After meaningful content changes:

```bash
pnpm lint
pnpm build
```

Recommended route checks:

```text
/
/blog
/blog/series
/projects
/sitemap.xml
/rss.xml
```

Because file-mode content is read at build/server runtime, production updates require a rebuild.
