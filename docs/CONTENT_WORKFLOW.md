# Content Workflow

This document explains how to maintain the file-based content sources for the Personal Developer OS.

The current site has three content sources:

```text
content/blog      -> BlogRepository -> FileBlogRepository -> BlogService
content/projects  -> ProjectRepository -> FileProjectRepository -> ProjectService
content/profile   -> ProfileRepository -> FileProfileRepository -> ProfileService
```

Keep this document close to daily publishing work. It is intentionally practical: where to put files, which frontmatter fields matter, how public routes are generated, and how to validate before release.

## 1. Content Architecture Overview

Content data is separated from UI components.

Pages and client components should not read Markdown files directly. Server-side services load content through repository interfaces, normalize frontmatter, filter unpublished content, and pass serializable data into pages and components.

Key principles:

- Content files are the current storage layer.
- Public URLs come from `frontmatter.slug`, not from folder or file names.
- Published-only queries power public pages, sitemap, RSS, SEO output, and Console metadata.
- Repository interfaces should stay stable so future CMS or database implementations can replace file repositories.
- Do not duplicate Blog, Project, or Profile data inside React components.

## 2. Blog Workflow

Blog files live under:

```text
content/blog
```

The repository scans Markdown files recursively, so series can be organized in subdirectories:

```text
content/blog/personal-developer-os/08-v1-review.md
content/blog/ai-agent-learning/01-intent-classifier.md
```

The public article URL is decided by `slug`:

```text
/blog/[slug]
```

Moving a file between folders does not change the public URL as long as `slug` stays the same.

### Add A Standalone Post

1. Create a Markdown file under `content/blog`.
2. Fill in frontmatter.
3. Write the Markdown body below the closing `---`.
4. Set `status: "draft"` while drafting.
5. Change to `status: "published"` only when ready.
6. Run `pnpm lint` and `pnpm build`.

Minimal example:

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

### Add A Series Post

Use a subdirectory for readability and add `series`, `seriesSlug`, and `seriesOrder`.

Example path:

```text
content/blog/ai-agent-learning/01-intent-classifier.md
```

Example frontmatter additions:

```yaml
series: "AI Agent Learning"
seriesSlug: "ai-agent-learning"
seriesOrder: 1
```

Rules:

- `series` is the display name.
- `seriesSlug` controls the series page route: `/blog/series/[seriesSlug]`.
- `seriesOrder` controls article order inside the series.
- Keep `seriesSlug` stable once public.
- Do not reuse a `slug` that already exists in another post.

### Blog Frontmatter

| Field | Purpose |
| --- | --- |
| `title` | Article title. |
| `slug` | Public URL segment for `/blog/[slug]`. Must be unique. |
| `summary` | List card, metadata fallback, and preview text. |
| `date` | Original publish date. Use `YYYY-MM-DD`. |
| `updatedAt` | Last meaningful content update. Use `YYYY-MM-DD`. |
| `tags` | Tag labels shown on blog cards and article pages. |
| `series` | Optional series display name. |
| `seriesSlug` | Optional series route segment. |
| `seriesOrder` | Optional numeric order inside a series. |
| `status` | `published` or `draft`. Drafts are excluded from public outputs. |
| `lang` | `zh` or `en`. |
| `cover` | Reserved image field. Empty string is allowed. |
| `seoTitle` | Optional SEO title override. |
| `seoDescription` | Optional SEO description override. |

Reading time and word count are generated at build time from the Markdown body. Do not maintain them manually.

### Blog Public Outputs

Published posts can appear in:

- `/blog`
- `/blog/[slug]`
- `/blog/series`
- `/blog/series/[seriesSlug]`
- homepage Blog section
- Console `blog`, `logs`, and `articles` output
- `/sitemap.xml`
- `/rss.xml`
- SEO metadata

Draft posts should not appear in public pages, sitemap, RSS, or metadata.

## 3. Project Workflow

Project files live under:

```text
content/projects
```

Recommended path for a new project:

```text
content/projects/my-new-project/index.md
```

The public project URL is decided by `slug`:

```text
/projects/[slug]
```

### Add A Project

1. Create a folder under `content/projects`.
2. Add `index.md`.
3. Fill in frontmatter.
4. Write the case-study body below the frontmatter.
5. Use `published: false` until the project is ready for public display.
6. Use `featured: true` only for projects that should appear on the homepage Projects section.
7. Run `pnpm lint` and `pnpm build`.

Minimal example:

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
  - "Backend Development"
  - "AI-assisted Development"
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

### Project Frontmatter

| Field | Purpose |
| --- | --- |
| `title` | Project title. |
| `slug` | Public URL segment for `/projects/[slug]`. Must be unique. |
| `subtitle` | Short supporting line. |
| `summary` | Project cards and metadata fallback. |
| `status` | Internal normalized status, such as `building`, `production`, or `mvp`. |
| `statusLabel` | Human-readable status label. |
| `type` | Project category. |
| `role` | Role list. Can be an array or comma-separated string. |
| `timeline` | Time period or phase note. |
| `featured` | `true` shows the project in the homepage Projects section. |
| `order` | Sorting order. Lower numbers appear earlier. |
| `techStack` | Stack tags. |
| `features` | Current scope or user-visible capabilities. |
| `highlights` | Engineering notes and design decisions. |
| `links` | Link objects with `label`, `href`, and `type`. |
| `relatedPosts` | Related blog post references with `title` and `slug`. |
| `relatedSeriesSlug` | Connects the project to a blog series. |
| `published` | `true` makes the project public. |
| `lang` | `zh` or `en`. |
| `seoTitle` | Optional SEO title override. |
| `seoDescription` | Optional SEO description override. |

### Project Public Outputs

Published projects can appear in:

- `/projects`
- `/projects/[slug]`
- homepage Projects section when `featured: true`
- Console `projects` output
- `/sitemap.xml`
- related project blocks on blog series and article pages

Do not hardcode project data inside React components. Add or edit Markdown content instead.

## 4. Profile Workflow

Profile content lives under:

```text
content/profile/profile.md
content/profile/contact-channels.md
content/profile/system-stack.md
```

All three files are loaded through `ProfileService` and passed into the Main App as `PublicProfile`.

### profile.md

Use this file to maintain the public profile:

- Java backend background
- AI Agent / full-stack direction
- anonymized enterprise-system experience
- current focus
- work style
- active projects
- career direction
- resume privacy note

The file already contains non-rendered HTML comments explaining how frontmatter maps to the current frontend. Keep those comments private to editors; do not convert them into visible page text.

Do not add:

- phone number
- WeChat ID
- address
- birthday
- ID number
- real employer names
- real client names
- buyer names
- sensitive project details
- real resume PDF links

### contact-channels.md

Use this file to maintain public contact and CTA entries.

Rules:

- `visible: true` means the channel can appear publicly.
- `visible: false` hides the channel.
- Empty `href` should not become an active link.
- `disabled: true` shows availability/status without navigation.
- Keep the Contact section focused. Avoid turning it into a large marketing link list.
- Do not publish private email, phone, WeChat, address, or resume PDF links unless the privacy policy changes.

### system-stack.md

Use this file to maintain stack groups.

Current groups include:

- Backend
- Frontend / Full-stack
- AI Agent
- DevOps / Deployment
- Learning / Exploring

Keep learning-stage items in `Learning / Exploring`. Do not present exploratory topics as mature production expertise.

## 5. Local Validation

Run these after meaningful content changes:

```bash
pnpm lint
pnpm build
```

Recommended route checks:

```text
/
/blog
/blog/series
/blog/series/personal-developer-os
/projects
/projects/personal-developer-os
/projects/ai-agent-demo
/sitemap.xml
/rss.xml
```

Because this project uses file-based content sources, content changes require a rebuild before production output changes.

For a production-like local server after `pnpm build`, use the standalone output:

```bash
PORT=3100 node .next/standalone/server.js
```

Then visit:

```text
http://localhost:3100
```

On Windows PowerShell:

```powershell
$env:PORT="3100"; node .next/standalone/server.js
```

## 6. Commit Workflow

Before committing:

```bash
git status
pnpm lint
pnpm build
```

Commit only the intended files:

```bash
git add docs/CONTENT_WORKFLOW.md docs/CONTENT_WORKFLOW.zh-CN.md
git commit -m "docs: add content workflow"
git push
```

Do not commit local env files, generated logs, certificates, private keys, server IPs, or private resume files.

## 7. Deployment Workflow

Production update path:

```bash
cd /opt/apps/personal-dev-os
git pull
docker compose --env-file .env.production up -d --build
```

Important notes:

- `NEXT_PUBLIC_SITE_URL` must be available at build time and runtime.
- Changing `NEXT_PUBLIC_SITE_URL`, SEO, sitemap, RSS, or domain settings requires a rebuild.
- Content changes also require a rebuild because content is read from files at build/server runtime.
- If Docker cache keeps old metadata, rebuild without cache:

```bash
docker compose --env-file .env.production build --no-cache
docker compose --env-file .env.production up -d
```

Online checks:

```text
https://oli6666.top
https://oli6666.top/blog
https://oli6666.top/projects
https://oli6666.top/sitemap.xml
https://oli6666.top/rss.xml
```

Confirm sitemap and RSS use `https://oli6666.top` and do not expose draft content.

## 8. Privacy Rules

Do not commit or publish:

- `.env.production`
- `.env.local`
- certificate files
- private keys
- server IPs
- deployment secrets
- real resume PDF
- phone number
- WeChat ID
- address
- ID number
- birthday
- real employer name
- real client name
- buyer name
- sensitive project details
- fabricated user counts, revenue, traffic, or production outcomes

Allowed public wording should stay anonymized, such as:

- enterprise bidding system
- e-procurement platform
- supplier management
- expert management
- procurement planning
- enterprise system integration
- public resource transaction service platform
- enterprise digital service team
- large enterprise client

## 9. Future CMS / Admin / Database Migration

Current implementations:

```text
FileBlogRepository
FileProjectRepository
FileProfileRepository
```

Future implementations can replace them:

```text
CmsBlogRepository
CmsProjectRepository
CmsProfileRepository

DatabaseBlogRepository
DatabaseProjectRepository
DatabaseProfileRepository
```

Pages should continue to use:

```text
BlogService
ProjectService
ProfileService
```

Migration rules:

- Do not let pages query a database directly.
- Do not let client components depend on a CMS SDK.
- Keep repository interfaces stable.
- Keep public `slug` values stable.
- Preserve the meaning of `published`, `draft`, `featured`, `order`, `seriesSlug`, and `seriesOrder`.
- Keep sitemap and RSS published-only.

