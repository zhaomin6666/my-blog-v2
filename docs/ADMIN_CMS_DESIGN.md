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
- Items
- Level / status
- Order

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
/admin/profile
/admin/homepage
```

Projects Admin can wait until Blog, Profile, and Homepage editing are stable.

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

## Future Implementation Phases

### Phase 11.3: Database Schema & Repository Refactor Plan

- Design and implement database schema.
- Add DatabaseRepository implementations.
- Keep FileRepository fallback.
- Do not build Admin UI yet.

### Phase 11.4: Admin Auth Foundation

- Add `/admin/login`.
- Add signed session cookie.
- Add middleware protection.
- Add Admin layout shell.

### Phase 11.5: Blog Admin MVP

- Blog list.
- Create / edit draft.
- Publish / unpublish.
- Markdown editor.
- Slug validation.

### Phase 11.6: Homepage / Profile Admin

- Profile editor.
- Contact editor.
- System Stack editor.
- Homepage sections editor.

### Phase 11.7: Projects Admin

- Project list.
- Create / edit project.
- Featured / order / published controls.

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

