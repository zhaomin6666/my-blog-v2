# AI Native Portfolio CMS

[中文说明](README.zh-CN.md)

A developer portfolio and technical blog starter with a desktop-style UI, Markdown content mode, optional PostgreSQL-backed Admin CMS, and an Agent Demo.

This project is a Personal Developer OS starter, not a generic hero/about/projects template. The public site keeps a browser-based desktop shell with a System Status Bar, Main App, Console App, Desktop fallback, theme switching, language switching, and `macos` / `vercel` style presets.

## Features

- Desktop-style portfolio UI with Main App, Console App, and Desktop fallback.
- Blog posts and project case studies.
- File-based content mode through Markdown and local content files.
- Optional database-backed Admin CMS with PostgreSQL.
- Site, Page, Hero, Profile, Stack, and Contact configuration.
- SEO metadata, sitemap, robots, and RSS.
- Agent Demo architecture for a scoped public AI assistant experience.
- Docker-friendly deployment with Next.js standalone output.

## Quick Start

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open:

```text
http://localhost:3000
```

For the first setup path, read [Getting Started](docs/GETTING_STARTED.md).

## Content Modes

### File Mode

File mode is the default and does not require PostgreSQL. Content is maintained under:

```text
content/site
content/homepage
content/pages
content/profile
content/blog
content/projects
```

### Database Mode

Database mode uses the Admin CMS and PostgreSQL:

```text
/admin/site
/admin/hero
/admin/pages
/admin/profile
/admin/stack
/admin/contact
/admin/blog
/admin/projects
```

See [Content Workflow](docs/CONTENT_WORKFLOW.md) for day-to-day content maintenance and [Database Content Source](docs/DATABASE_CONTENT_SOURCE.md) for database mode.

## Deployment

For a simple static/content-file deployment, start with file mode.

For Admin CMS, enable PostgreSQL, run the database migrations manually, configure Admin auth, and switch content sources only after the database content has been reviewed.

`NEXT_PUBLIC_SITE_URL` controls canonical URLs, Open Graph URLs, `sitemap.xml`, `robots.txt`, and `rss.xml`. Set it to the production origin before building.

Recommended reading order:

1. [Getting Started](docs/GETTING_STARTED.md)
2. [Deployment](docs/DEPLOYMENT.md)
3. [Database Content Source](docs/DATABASE_CONTENT_SOURCE.md)

## Documentation

### User-Facing Docs

- [Getting Started](docs/GETTING_STARTED.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Content Workflow](docs/CONTENT_WORKFLOW.md)
- [Database Content Source](docs/DATABASE_CONTENT_SOURCE.md)

### Development Notes

- [Implementation Plan](docs/IMPLEMENTATION_PLAN.md)
- [AI Changelog](docs/CHANGELOG_AI.md)
- [Admin CMS Design](docs/ADMIN_CMS_DESIGN.md)
- [Agent Demo Architecture](docs/AGENT_DEMO_ARCHITECTURE.md)
- [Development Rules](docs/DEVELOPMENT_RULES.md)

## Common Commands

```bash
pnpm dev
pnpm lint
pnpm build
pnpm security:admin
pnpm admin:secrets
```

## License

See [LICENSE](LICENSE).
