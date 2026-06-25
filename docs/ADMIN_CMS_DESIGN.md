# Admin / CMS Architecture Design

Phase 11.2 designs the future author-only Admin / CMS architecture for Personal
Dev OS. This phase is documentation only: no `/admin` pages, database tables,
migrations, repository code, deployment config, Console / CLI changes, window
system changes, content migration, or Agent Demo scope changes are implemented.

## Goals

The current site already has a CMS-ready shape:

```text
content/blog      -> FileBlogRepository    -> BlogService    -> pages
content/projects  -> FileProjectRepository -> ProjectService -> pages
content/profile   -> FileProfileRepository -> ProfileService -> pages
```

The target shape keeps the same application boundary while changing the primary
content source:

```text
PostgreSQL -> DatabaseBlogRepository    -> BlogService    -> pages
PostgreSQL -> DatabaseProjectRepository -> ProjectService -> pages
PostgreSQL -> DatabaseProfileRepository -> ProfileService -> pages
```

The main goals are:

- Move long-lived content editing out of the website repository.
- Let the author manage Blog, Projects, Profile, Homepage, and public contact
  content through a private backend.
- Make PostgreSQL the production content source while keeping FileRepository as
  fallback and import source.
- Keep public URLs stable wherever possible.
- Keep sitemap, RSS, Blog Search, Tags, Series, Projects, Profile, and Agent
  Demo working through existing services.
- Keep the backend author-only. This is not a public user system.

## Why Move Beyond File Content

File-based Markdown works well for versioned launch content, but it becomes
awkward once the site is used as a long-term writing and career system:

- Publishing every content update through Git and Docker rebuilds is slow.
- Blog drafts may live in an external writing directory or content repository
  rather than the Next.js app repository.
- Homepage, Profile, Contact, and Project content should be editable without
  touching code.
- PostgreSQL allows validation, draft state, soft delete, backup, import/export,
  and future admin workflows.
- The existing Service / Repository boundary already gives the project a clean
  migration point.

## Admin Scope

The first Admin / CMS version should manage only content owned by the author.

### Blog Posts

Fields:

- `title`
- `slug`
- `summary`
- `date`
- `updatedAt`
- `tags`
- `series`
- `seriesSlug`
- `seriesOrder`
- `status`
- `lang`
- `cover`
- `seoTitle`
- `seoDescription`
- `content_markdown`
- `published` / `draft`
- `createdAt`
- `updatedAt`

### Blog Series

Fields:

- `title`
- `slug`
- `summary`
- `description`
- `order`
- `lang`
- `published`
- `relatedProjectSlug`

### Projects

Fields:

- `title`
- `slug`
- `subtitle`
- `summary`
- `status`
- `type`
- `role`
- `timeline`
- `featured`
- `order`
- `techStack`
- `features`
- `highlights`
- `links`
- `relatedPosts`
- `relatedSeriesSlug`
- `published`
- `lang`
- `seoTitle`
- `seoDescription`
- `content_markdown`

### Profile

Managed content:

- Main profile content
- Career direction
- Focus areas
- Public summary
- Privacy note
- Public resume note

### Contact Channels

Fields:

- `label`
- `type`
- `href`
- `visible`
- `order`
- `description`

### System Stack

Fields:

- Group name
- Group order
- Item name
- Item order

### Homepage Content

Managed content:

- Overview copy
- Hero title / subtitle
- Services
- Logs
- CTA
- Featured projects order
- Featured posts order

## Non-goals For The First Admin Version

The first Admin / CMS version must not include:

- Public user registration
- Multi-user collaboration
- Complex RBAC
- Comments
- Likes
- Online image upload, except external URL fields
- Rich text editor; Markdown textarea is enough for v1
- AI article generation
- Scheduled publishing
- Complex approval workflows
- Full revision diff
- Third-party CMS integration
- Server file upload
- Content monetization
- Any Agent Demo answer-scope expansion

## PostgreSQL Data Model Draft

The model intentionally stays close to current Markdown frontmatter so import,
fallback, and service compatibility are straightforward.

### MVP Tables

#### `blog_posts`

```text
id uuid primary key
title text not null
slug text not null unique
summary text not null
content_markdown text not null
status text not null check (status in ('draft', 'published'))
lang text not null check (lang in ('zh', 'en'))
tags text[] not null default '{}'
series text
series_slug text
series_order integer
cover text
seo_title text
seo_description text
date timestamptz not null
published_at timestamptz
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
deleted_at timestamptz
```

Recommended indexes:

- unique index on `slug` where `deleted_at is null`
- index on `status`
- index on `lang`
- GIN index on `tags`
- index on `series_slug, series_order`
- index on `date desc`

#### `blog_series`

```text
id uuid primary key
title text not null
slug text not null unique
summary text
description text
lang text not null check (lang in ('zh', 'en'))
display_order integer not null default 0
published boolean not null default false
related_project_slug text
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

#### `projects`

```text
id uuid primary key
title text not null
slug text not null unique
subtitle text
summary text not null
content_markdown text not null
status text not null
type text
role jsonb not null default '{}'::jsonb
timeline text
featured boolean not null default false
display_order integer not null default 0
tech_stack jsonb not null default '[]'::jsonb
features jsonb not null default '[]'::jsonb
highlights jsonb not null default '[]'::jsonb
links jsonb not null default '[]'::jsonb
related_posts jsonb not null default '[]'::jsonb
related_series_slug text
published boolean not null default false
lang text not null check (lang in ('zh', 'en'))
seo_title text
seo_description text
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
deleted_at timestamptz
```

#### `profile_pages`

```text
id uuid primary key
key text not null
title text
summary text
content_markdown text
data jsonb not null default '{}'::jsonb
lang text not null check (lang in ('zh', 'en'))
updated_at timestamptz not null default now()
unique (key, lang)
```

#### `contact_channels`

```text
id uuid primary key
label text not null
type text not null
href text not null
description text
visible boolean not null default true
display_order integer not null default 0
lang text not null check (lang in ('zh', 'en'))
updated_at timestamptz not null default now()
```

#### `system_stack_groups`

```text
id uuid primary key
name text not null
description text
display_order integer not null default 0
lang text not null check (lang in ('zh', 'en'))
```

#### `system_stack_items`

```text
id uuid primary key
group_id uuid not null references system_stack_groups(id) on delete cascade
name text not null
description text
level text
status text
display_order integer not null default 0
```

#### `homepage_sections`

```text
id uuid primary key
key text not null
title text
subtitle text
content_markdown text
data jsonb not null default '{}'::jsonb
visible boolean not null default true
display_order integer not null default 0
lang text not null check (lang in ('zh', 'en'))
updated_at timestamptz not null default now()
unique (key, lang)
```

### Later Enhancement Tables

#### `admin_users`

```text
id uuid primary key
username text not null unique
password_hash text not null
display_name text
role text not null default 'owner'
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
last_login_at timestamptz
enabled boolean not null default true
```

For v1, environment-variable credentials are simpler. `admin_users` becomes
valuable when multi-admin, password rotation UI, audit logs, or role separation
are needed.

#### `content_revisions`

```text
id uuid primary key
content_type text not null
content_id uuid not null
snapshot jsonb not null
created_at timestamptz not null default now()
created_by text
```

This is useful for rollback and diff workflows, but it is not required for the
first implementation.

### Tags Model Choice

Option A: `blog_posts.tags text[]`

- Simpler.
- Matches current frontmatter.
- Good enough for tag pages, search, sitemap, and Agent Demo retrieval.
- Recommended for v1.

Option B: `tags` + `blog_post_tags`

- Better normalization.
- Easier to add tag descriptions, aliases, and admin metadata.
- More tables and UI complexity.
- Better as a later enhancement.

### Series Model Choice

Option A: keep `series`, `series_slug`, and `series_order` on `blog_posts`

- Closest to current frontmatter.
- Simple ordering for `/blog/series/[seriesSlug]`.
- Recommended for v1.

Option B: add `blog_post_series`

- More normalized.
- Useful only if one post can belong to multiple series.
- Not needed for the current site.

## Repository Migration Plan

Pages and client components must never query the database directly. The public
application should continue to use service methods.

Recommended configuration:

```text
BLOG_CONTENT_SOURCE=file | database
PROJECT_CONTENT_SOURCE=file | database
PROFILE_CONTENT_SOURCE=file | database
```

A global `CONTENT_SOURCE=file | database` can exist as a convenience fallback,
but per-domain variables make staged migration safer.

Recommended factory shape:

```text
createBlogRepository()
  -> DatabaseBlogRepository when BLOG_CONTENT_SOURCE=database
  -> FileBlogRepository otherwise
```

Migration sequence:

1. Keep existing repository interfaces stable.
2. Add database repositories behind the same interfaces.
3. Expand interfaces only where the public product already needs it.
4. Keep FileRepository as fallback and import source.
5. Add import tooling that reads Markdown frontmatter and writes database rows.
6. Switch one content domain at a time through environment variables.
7. Keep public pages, sitemap, RSS, search, tags, series, and Agent Demo calling
   Service methods.

## Admin Routes

Full route design:

```text
/admin/login
/admin
/admin/blog
/admin/blog/new
/admin/blog/[id]
/admin/series
/admin/projects
/admin/projects/new
/admin/projects/[id]
/admin/profile
/admin/contact
/admin/stack
/admin/homepage
/admin/settings
/admin/import-export
```

Recommended MVP routes:

```text
/admin/login
/admin
/admin/blog
/admin/blog/new
/admin/blog/[id]
/admin/projects
/admin/projects/new
/admin/projects/[id]
/admin/profile
/admin/hero
/admin/contact
/admin/stack
```

Projects Admin is implemented as the Phase 11.7 database-backed MVP.

## Admin Authentication

### Option A: Environment-variable Admin

Environment variables:

```text
ADMIN_USERNAME=
ADMIN_PASSWORD_HASH=
ADMIN_SESSION_SECRET=
```

Flow:

1. `/admin/login` accepts username and password.
2. Password is compared against `ADMIN_PASSWORD_HASH`.
3. Success creates a signed HttpOnly session cookie.
4. Middleware protects `/admin/*`, except `/admin/login`.
5. Login failures return a generic error.
6. Basic login rate limiting protects brute-force attempts.

Cookie settings:

- `httpOnly: true`
- `secure: true` in production
- `sameSite: 'lax'`
- reasonable `maxAge`, for example 8 hours

This is recommended for v1 because the backend is author-only.

### Option B: `admin_users` Table

Use this when the site needs multiple admins, admin status toggles, password
rotation UI, or audit logs. It has better long-term flexibility but requires
more implementation and operational care.

## Content Publishing Flow

### Blog

1. Create draft.
2. Edit frontmatter-equivalent fields.
3. Edit Markdown body.
4. Save draft.
5. Preview rendered article.
6. Publish.
7. Published posts enter `/blog`, `/blog/[slug]`, tags, series, sitemap, RSS,
   search, and Agent Demo public retrieval.

### Projects

1. Create project.
2. Edit Markdown and structured fields.
3. Set `featured`, `published`, and display order.
4. Published projects enter `/projects`, `/projects/[slug]`, homepage featured
   projects, sitemap, and Agent Demo public retrieval.

### Profile / Homepage

1. Edit content.
2. Save.
3. Public pages read the latest visible content or refresh cache.
4. No rebuild is required for content-only changes after database migration.

## Rendering And Cache Strategy

Option A: dynamic SSR database reads

- Pros: content updates are immediately visible.
- Cons: each request can hit the database unless cached.

Option B: ISR / revalidate

- Pros: better public-page performance.
- Cons: publishing needs cache invalidation.

Option C: Admin publish triggers cache invalidation

- Pros: combines performance with controlled freshness.
- Cons: needs `revalidatePath` or `revalidateTag` wiring.

Recommended v1:

- Use database reads through services with reasonable cache boundaries.
- On publish, trigger `revalidatePath` or `revalidateTag` for affected pages.
- If this is too much for the first implementation, start with dynamic rendering
  and optimize cache later.

After database migration, content publishing should not require Docker rebuild.
Only code changes require redeployment. Sitemap and RSS should read published
database content through services.

## External Blog Content Directory

Future blog writing can happen outside the Next.js repository. The Admin / CMS
should support importing Markdown from an external directory or content
repository, then persisting it to PostgreSQL.

Proposed importer:

```text
ExternalBlogImporter
```

Input:

- Directory path
- Import mode:
  - `create_only`
  - `update_by_slug`
  - `create_or_update`
- Status mode:
  - `keep`
  - `force_draft`
  - `force_published`

Output:

- Imported count
- Skipped count
- Errors

Rules:

- Validate frontmatter before import.
- Detect slug conflicts.
- Let the author choose overwrite or create new draft.
- Never require imported articles to remain inside the app repository.
- Export database posts back to Markdown for backup and offline editing.

This phase only designs the importer; it does not implement it.

## Search, Tags, Series, Sitemap, RSS

All public discovery surfaces should continue to call service methods:

- `/blog` and `/blog/[slug]`: `BlogService`
- `/blog/tags`: published-only tag methods
- `/blog/series`: published-only series methods
- `/blog/search`: published metadata from `BlogService`
- `sitemap.xml`: published Blog / Project service methods
- `rss.xml`: published Blog posts only

Database repositories must preserve published-only filtering so drafts never
enter public routes, sitemap, RSS, search, tags, series, or Agent Demo.

## Agent Demo Adaptation

Agent Demo must not query PostgreSQL directly. It should keep using:

- `BlogService` for published Blog content.
- `ProjectService` for published Projects.
- `ProfileService` for visible public Profile, Contact, and System Stack data.

Rules:

- Draft content is excluded.
- Hidden Profile or Contact content is excluded.
- Source excerpts stay bounded.
- The answer scope does not expand.
- The demo remains read-only and public-content-only.

## Security Boundary

Admin security requirements:

- `/admin/*` requires login.
- Admin passwords are never stored as plaintext.
- `ADMIN_SESSION_SECRET` is never committed.
- `.env.production` is never committed.
- Admin cannot upload executable files.
- Admin cannot execute shell commands.
- Admin cannot access arbitrary server paths.
- Markdown rendering must handle XSS safely.
- Slugs are validated before save.
- User-facing fields have length limits.
- Deletes are soft deletes by default.
- Production database is backed up.
- Admin pages are not indexed by search engines.
- Admin routes use `noindex` metadata or robots protection.

## Deployment And Backup

PostgreSQL already exists on the server for other work, but the personal site
should not directly reuse another application's business database.

Recommended production setup:

- Create a dedicated PostgreSQL database for the personal site.
- Create a dedicated PostgreSQL user with only needed privileges.
- Use a separate environment variable name to avoid conflict:

```text
PERSONAL_SITE_DATABASE_URL=
ADMIN_USERNAME=
ADMIN_PASSWORD_HASH=
ADMIN_SESSION_SECRET=
CONTENT_SOURCE=database
```

`DATABASE_URL` is acceptable in an isolated app, but
`PERSONAL_SITE_DATABASE_URL` is safer if the server already hosts other apps.

Backup rules:

- Run periodic `pg_dump`.
- Keep backup files outside Git.
- Restrict backup directory permissions.
- Document restore commands.
- Test restore on a non-production database before relying on the backup plan.

## Phase 11.3 Implementation Result

Phase 11.3 added the database content-source foundation without turning database
mode on by default.

Added runtime foundation:

- PostgreSQL access layer in `lib/db/postgres.ts`.
- Database config helpers in `lib/db/dbConfig.ts`.
- Shared row types in `lib/db/dbTypes.ts`.
- Repository source selection in `lib/content/contentSource.ts`.
- Pure env resolver in `lib/content/contentSourceConfig.ts`.
- Service singletons now select repositories through the factory.

Added migration:

- `database/migrations/001_create_cms_tables.sql`

The migration defines the MVP CMS tables for Blog Posts, Blog Series, Projects,
Profile Pages, Contact Channels, System Stack Groups, System Stack Items, and
Homepage Sections. It also includes indexes and `updated_at` triggers.

Content-source env design:

```text
PERSONAL_SITE_DATABASE_URL=
CONTENT_SOURCE=file
BLOG_CONTENT_SOURCE=
PROJECT_CONTENT_SOURCE=
PROFILE_CONTENT_SOURCE=
```

Selection order is domain-specific env, then `CONTENT_SOURCE`, then `file`.
The default remains `file`, so current builds do not need PostgreSQL.

DatabaseRepository status:

- `DatabaseBlogRepository` is implemented for read-only Blog public paths.
- `DatabaseProjectRepository` is implemented for read-only Project public paths.
- `DatabaseProfileRepository` is implemented for read-only Profile, Contact, and
  System Stack public paths.

No Admin UI, `/admin` route, login page, real content migration, content
deletion, Agent Demo scope change, Console / CLI change, window-system change,
Docker change, or Nginx change was added in Phase 11.3.

Detailed usage lives in `docs/DATABASE_CONTENT_SOURCE.md` and
`docs/DATABASE_CONTENT_SOURCE.zh-CN.md`.

## Future Implementation Phases

### Phase 11.3: Database Schema & Repository Refactor Plan - Completed

- Added the database schema migration.
- Added read-only DatabaseRepository implementations.
- Added repository factory and content-source env selection.
- Kept FileRepository as the default source and fallback.
- Do not build Admin UI yet.

### Phase 11.4: Admin Auth Foundation - Implemented

Implemented foundation:

- `/admin/login`
- `/admin`
- Signed HttpOnly session cookie.
- Middleware protection for `/admin/*`, with `/admin/login` excluded.
- Environment-variable credentials through `ADMIN_USERNAME`,
  `ADMIN_PASSWORD_HASH`, and `ADMIN_SESSION_SECRET`.
- Basic in-process login rate limiting.
- `noindex` metadata for Admin routes.

The first version still intentionally avoids public registration,
multi-admin user management, `admin_users`, audit logs, and role separation.

### Phase 11.5: Blog Admin MVP - Implemented

Implemented routes:

- `/admin/blog`
- `/admin/blog/new`
- `/admin/blog/[id]`

Implemented backend boundary:

- Blog Admin uses `lib/admin/blog-admin-service.ts`.
- SQL is centralized in `lib/admin/blog-admin-repository.ts`.
- Pages and Client Components do not connect to PostgreSQL directly.
- All SQL uses parameterized queries.

Data-source rules:

- Blog Admin manages PostgreSQL `blog_posts`.
- Public Blog pages read these posts only when `BLOG_CONTENT_SOURCE=database`
  or `CONTENT_SOURCE=database`.
- The default file content source remains unchanged.
- This phase does not migrate, import, delete, or overwrite `content/blog`.

Supported editing scope:

- title
- slug
- summary
- status: `draft` / `published`
- lang: `zh` / `en`
- date
- comma-separated tags saved as `text[]`
- series
- series slug
- series order
- cover
- SEO title
- SEO description
- Markdown content through a plain `textarea`

Publishing rules:

- New posts default to `draft`.
- Draft posts do not appear on public database-mode Blog pages.
- Publishing sets `status = 'published'` and fills `published_at` only when it
  was empty.
- Unpublishing sets `status = 'draft'` and keeps `published_at` as historical
  release metadata.
- Save / publish / unpublish revalidates public Blog, Search, Tags, Series,
  Sitemap, RSS, and the affected article path when the slug is known.

Slug rules:

- Slug is required.
- Slug must be globally unique among active database posts.
- Edits may keep the post's current slug.
- Slug accepts lowercase letters, numbers, and hyphens only.
- Spaces, Chinese characters, slashes, query characters, and other URL-special
  characters are rejected.

Not included in this MVP:

- Projects Admin.
- Profile / Homepage Admin.
- Content import / export.
- Image upload.
- Rich text editor.
- AI writing.
- Comments.
- Console / CLI changes.
- Window-system changes.
- Docker / Nginx deployment config changes.

### Phase 11.6: Homepage / Profile Admin - Implemented

Implemented routes:

- `/admin/hero`
- `/admin/profile`
- `/admin/contact`
- `/admin/stack`

Implemented backend boundary:

- Homepage / Profile Admin uses `lib/admin/profile-admin-service.ts`.
- SQL is centralized in `lib/admin/profile-admin-repository.ts`.
- Pages and Client Components do not connect to PostgreSQL directly.
- All SQL uses parameterized queries.
- Write actions re-check the admin session through `requireAdminSession()`.

Managed database tables:

- `/admin/hero` manages `homepage_sections`.
- `/admin/profile` manages `profile_pages` with `key = 'profile'`.
- `/admin/contact` manages `contact_channels`.
- `/admin/stack` manages `system_stack_groups` and `system_stack_items`.

Current admin UX boundary after the Phase 11.6 follow-up tightening:

- `/admin/hero` manages only homepage Hero copy.
- `/admin/profile` manages structured homepage About/Profile content with a
  language-scoped two-column editor.
- `/admin/contact` manages single-source global contact channels.
- `/admin/stack` manages single-source global stack groups and stack items.
- Homepage logs remain part of Blog Admin / `BlogService`, not Hero Admin.

Public content-source behavior:

- Database-mode Profile, Contact, and Stack continue to be read through
  `ProfileService` and `DatabaseProfileRepository`.
- Database-mode homepage now reads visible `homepage_sections` through the new
  lightweight `HomepageService`.
- The public homepage Hero now reads only the `hero` section for the Main App
  Hero title / subtitle while preserving the Developer OS window structure.
- Legacy `overview`, `logs`, `services`, and `cta` rows may still exist in
  PostgreSQL, but they are no longer shown in Hero Admin and do not affect the
  public homepage Hero.
- `/admin/profile` is now aligned to the homepage About section and no longer
  exposes unused generic page metadata in the visible editor.
- File mode continues to read `content/profile` and ignores database admin rows.
- Empty database tables and partial data remain safe and render empty states or
  existing fallback copy without falling back to files in database mode.

Not included in this MVP:

- Content import / export.
- Migration, deletion, or overwrite of `content/profile`.
- Image upload or file upload.
- Rich text editor.
- AI-generated homepage/profile content.
- Agent Demo answer-scope changes.
- Console / CLI changes.
- Window-system changes.
- Docker / Nginx deployment config changes.

### Phase 11.7: Projects Admin

- Added `/admin/projects`, `/admin/projects/new`, and `/admin/projects/[id]`.
- Projects Admin writes only to PostgreSQL `projects`.
- Supported list, search, published / featured / language filters, create, edit,
  save, publish, and unpublish.
- Supported fields include title, slug, subtitle, summary, status, type,
  timeline, language, published, featured, display order, Markdown content,
  role, tech stack, features, highlights, links, related posts, related series
  slug, SEO title, and SEO description.
- JSON fields are managed with plain textareas and validated before database
  writes. Markdown content uses a plain textarea.
- Slug format and active-project uniqueness are validated at the admin service
  boundary.
- Published database projects enter `/projects`, `/projects/[slug]`, homepage
  Featured Projects, sitemap, and Agent Demo public project retrieval only when
  the project content source is `database`.
- File mode continues reading `content/projects`; no project Markdown files are
  migrated, deleted, overwritten, imported, or exported in this phase.
- No Agent Demo answer-scope, Console / CLI, window-system, Docker, or Nginx
  deployment config changes were made.

### Phase 11.8: Content Import / Export

- External blog directory import.
- Markdown export.
- JSON backup.

### Phase 11.9: Backup & Deployment Hardening

- `pg_dump`.
- Rollback documentation.
- Production checklist.

### Phase 11.10: Phase 11 Final Review

- Full Admin / CMS review.
- Confirm public routes, sitemap, RSS, search, Agent Demo, and deployment safety.
