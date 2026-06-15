# Personal Developer OS

A browser-based Personal Developer OS for a backend developer building AI-era products, engineering logs, and portfolio projects.

This is not a generic portfolio template. The site is a lightweight desktop OS with a Main App, Console App, system status bar, desktop fallback, theme switching, language switching, and `macos` / `vercel` visual presets.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Markdown blog content

## Local Development

```bash
pnpm install
pnpm dev
```

The local development URL is usually:

```text
http://localhost:3000
```

## Common Commands

```bash
pnpm dev
pnpm lint
pnpm build
```

## Blog Content

Blog Markdown files live in:

```text
content/blog
```

The public blog data flow is:

```text
content/blog/*.md -> FileBlogRepository -> BlogService -> pages/components/SEO outputs
```

Public pages, sitemap, RSS, and Console blog output use published blog metadata only. Draft posts must not appear in public outputs.

## Environment Variables

Copy `.env.example` for local configuration when needed:

```text
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For production, set `NEXT_PUBLIC_SITE_URL` to the real site origin, for example `https://example.com`. Canonical URLs, Open Graph URLs, `sitemap.xml`, `robots.txt`, and `rss.xml` all depend on this value.

Do not commit `.env.local` or real secret values.

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for the deployment checklist and production configuration notes.

## Documentation

- [Content Workflow](docs/CONTENT_WORKFLOW.md) / [内容发布流程](docs/CONTENT_WORKFLOW.zh-CN.md)
- [Deployment Guide](docs/DEPLOYMENT.md) / [部署手册](docs/DEPLOYMENT.zh-CN.md)
- [Agent Demo Architecture](docs/AGENT_DEMO_ARCHITECTURE.md) / [Agent Demo 架构说明](docs/AGENT_DEMO_ARCHITECTURE.zh-CN.md)
