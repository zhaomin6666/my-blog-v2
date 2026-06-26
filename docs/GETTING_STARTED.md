# Getting Started

This is the first document to read after cloning the project. It explains what the project is, which content mode to choose, and where the next setup details live.

## What This Project Is

AI Native Portfolio CMS is a Next.js starter for a developer portfolio, technical blog, Admin CMS, and Agent Demo inside a desktop-style Personal Developer OS shell.

The public UI is built around:

- System Status Bar
- Main App
- Console App
- Desktop fallback
- `macos` / `vercel` style presets
- `light` / `dark` themes
- `zh` / `en` language switching

## Choose A Content Mode

### File Mode

Use file mode if you want the simplest path.

- Default mode.
- No database required.
- Content is maintained in `content/**`.
- Best for static or Git-based publishing.

### Database Mode

Use database mode if you want Admin CMS editing.

- Requires PostgreSQL.
- Requires manual migration execution.
- Requires Admin auth environment variables.
- Public content comes from Admin-managed database rows after you switch the relevant content source variables.

## Local Development

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open:

```text
http://localhost:3000
```

## Minimal Environment Variables

For file mode:

```text
NEXT_PUBLIC_SITE_URL=http://localhost:3000
CONTENT_SOURCE=file
BLOG_CONTENT_SOURCE=file
PROJECT_CONTENT_SOURCE=file
PROFILE_CONTENT_SOURCE=file
```

For database mode, also configure:

```text
PERSONAL_SITE_DATABASE_URL=<postgres-connection-url>
ADMIN_USERNAME=<admin_username>
ADMIN_PASSWORD_HASH=<sha256_password_hash>
ADMIN_SESSION_SECRET=<random_32_chars_or_longer>
```

Generate Admin secret values with:

```bash
pnpm admin:secrets
```

## File Mode Content Map

```text
content/site      -> Site identity and default SEO
content/homepage  -> Homepage Hero
content/pages     -> Blog / Projects page config
content/profile   -> Profile, Contact, Stack
content/blog      -> Blog posts
content/projects  -> Project case studies
```

## Database Mode Admin Map

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

## Production Deployment

Start with [Deployment](DEPLOYMENT.md) for the normal deployment path.

For PostgreSQL-backed content, read [Database Content Source](DATABASE_CONTENT_SOURCE.md) before switching any public source to `database`.

Advanced production CMS operations are documented in [Production CMS Deployment](PRODUCTION_CMS_DEPLOYMENT.md).

## Next Documents

- [Content Workflow](CONTENT_WORKFLOW.md): maintain file-mode content.
- [Database Content Source](DATABASE_CONTENT_SOURCE.md): enable database-backed content.
- [Deployment](DEPLOYMENT.md): build and deploy the app.
- [Agent Demo Architecture](AGENT_DEMO_ARCHITECTURE.md): understand the public AI demo boundary.
