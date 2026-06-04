# Deployment Guide

## Project

Personal Developer OS is a browser-based developer desktop experience built with Next.js, React, TypeScript, Tailwind CSS, and a Markdown-backed blog architecture.

The production deployment should preserve the Developer OS structure:

- System Status Bar
- Main App
- Console App
- Desktop fallback
- `macos` / `vercel` visual presets
- `light` / `dark` themes
- `zh` / `en` language switching

## Local Development

```bash
pnpm install
pnpm dev
```

Local URL:

```text
http://localhost:3000
```

## Local Checks

Run these before deployment:

```bash
pnpm lint
pnpm build
```

The project currently uses static export settings in `next.config.ts`:

```text
output: export
distDir: dist
```

After `pnpm build`, static output is generated in `dist/`.

## Environment Variables

Required public production setting:

```text
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

Local fallback:

```text
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`NEXT_PUBLIC_SITE_URL` is used by:

- canonical metadata
- Open Graph URLs
- `sitemap.xml`
- `robots.txt`
- `rss.xml`

Production deployments must set this to the real site origin. Do not commit `.env.local` or any private deployment secrets.

## Pre-Deployment Checklist

- Set the production `NEXT_PUBLIC_SITE_URL`.
- Run `pnpm lint`.
- Run `pnpm build`.
- Confirm `/` renders the Personal Developer OS shell.
- Confirm `/blog` renders published posts.
- Confirm a published article route renders, for example `/blog/building-personal-developer-os`.
- Confirm draft article routes return 404.
- Confirm `/sitemap.xml` is available and does not include drafts.
- Confirm `/robots.txt` points to the production sitemap URL.
- Confirm `/rss.xml` is available, uses absolute post URLs, and does not include drafts.
- Confirm mobile layout still shows app entry points and does not overflow.
- Confirm `light` / `dark` and `macos` / `vercel` still work.
- Confirm Console commands still work, especially `blog`, `logs`, and `articles`.

## Recommended Platforms

Use any platform that supports Next.js App Router and static export output. Vercel is a natural option, but the project can also be hosted by any static hosting provider that serves the generated `dist/` directory.

Do not add platform-specific account IDs, private project names, access tokens, or deployment secrets to the repository.
