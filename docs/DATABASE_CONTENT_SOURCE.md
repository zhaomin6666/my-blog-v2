# Database Content Source

Phase 11.3 adds the foundation for optional PostgreSQL-backed content while
keeping file content as the default production-safe source.

## Goal

The public site still reads content through services:

```text
BlogService    -> BlogRepository    -> FileBlogRepository | DatabaseBlogRepository
ProjectService -> ProjectRepository -> FileProjectRepository | DatabaseProjectRepository
ProfileService -> ProfileRepository -> FileProfileRepository | DatabaseProfileRepository
```

Pages, sitemap, RSS, Blog Search, Tags, Series, Projects, Profile, and Agent
Demo continue to call the service layer. They do not query PostgreSQL directly.

## Environment Variables

```text
PERSONAL_SITE_DATABASE_URL=
CONTENT_SOURCE=file
BLOG_CONTENT_SOURCE=
PROJECT_CONTENT_SOURCE=
PROFILE_CONTENT_SOURCE=
```

Source precedence:

1. Domain-specific source, such as `BLOG_CONTENT_SOURCE`.
2. Global `CONTENT_SOURCE`.
3. Default: `file`.

Allowed source values are `file` and `database`.

Examples:

```text
CONTENT_SOURCE=file
```

```text
CONTENT_SOURCE=file
BLOG_CONTENT_SOURCE=database
PROJECT_CONTENT_SOURCE=file
PROFILE_CONTENT_SOURCE=file
```

When a source is set to `database`, `PERSONAL_SITE_DATABASE_URL` must be
configured. File mode does not require a database connection and should continue
to build normally without PostgreSQL.

## Migration

Migration files:

```text
database/migrations/001_create_cms_tables.sql
database/migrations/002_add_translation_keys_to_contact_and_stack.sql
database/migrations/003_reset_contact_channels_single_source.sql
database/migrations/004_reset_system_stack_single_source.sql
```

Migrations are not executed automatically. Run them manually against the
dedicated personal-site database when database-mode testing begins:

```bash
psql "$PERSONAL_SITE_DATABASE_URL" -f database/migrations/001_create_cms_tables.sql
psql "$PERSONAL_SITE_DATABASE_URL" -f database/migrations/002_add_translation_keys_to_contact_and_stack.sql
psql "$PERSONAL_SITE_DATABASE_URL" -f database/migrations/003_reset_contact_channels_single_source.sql
psql "$PERSONAL_SITE_DATABASE_URL" -f database/migrations/004_reset_system_stack_single_source.sql
```

Production rules:

- Migration filenames must use increasing numeric prefixes.
- Append new migration files; do not modify migrations that have already run in
  production.
- Back up PostgreSQL before running migrations.
- Record migration execution in release notes or an operations log.
- `pnpm build` must not require a database connection.
- The app must not run migrations automatically at startup.

See `docs/PRODUCTION_CMS_DEPLOYMENT.md` for the production migration workflow.

## Tables

The MVP schema includes:

- `blog_posts`
- `blog_series`
- `projects`
- `profile_pages`
- `contact_channels`
- `system_stack_groups`
- `system_stack_items`
- `homepage_sections`

The migration also adds common indexes for public reads, including slug,
published/status, language, display order, soft delete, series, and blog tag GIN
indexes. All MVP tables with mutable public content have an `updated_at` trigger.

## Repository Switching

Repository selection lives in `lib/content/contentSource.ts` and the pure env
resolver lives in `lib/content/contentSourceConfig.ts`.

Factory methods:

- `getBlogRepository()`
- `getProjectRepository()`
- `getProfileRepository()`

The service singletons use those factories:

- `blogService`
- `projectService`
- `profileService`

Public route code remains unchanged at the service boundary.

## File Fallback

Default mode remains `file`.

File mode:

- Reads from `content/blog`, `content/projects`, and `content/profile`.
- Does not require `PERSONAL_SITE_DATABASE_URL`.
- Does not create a PostgreSQL Pool.
- Keeps current public URLs and rendering behavior.

## Blog Admin Writes

Phase 11.5 adds Blog Admin writes to PostgreSQL `blog_posts`.

Important boundaries:

- `/admin/blog` manages database content only.
- Public Blog pages read database posts only when `BLOG_CONTENT_SOURCE=database`
  or `CONTENT_SOURCE=database`.
- If public pages still run in file mode, newly created database posts will not
  appear on `/blog`; this is expected.
- The phase does not automatically switch production content source.
- The phase does not import old Markdown files from `content/blog`.
- The phase does not delete or overwrite file-based content.

Status behavior:

- `draft` database posts are visible in Admin, but excluded from public
  published-only queries.
- `published` database posts are included by `DatabaseBlogRepository` public
  reads when database mode is active.
- Unpublish changes the post back to `draft`, so public database-mode reads stop
  returning it.
- Soft-deleted rows remain excluded from both Admin list results and public
  reads.
- `/admin/blog` Delete sets `blog_posts.deleted_at = now()` only. It does not
  run `DELETE FROM blog_posts`, does not remove Markdown files, and does not add
  recycle-bin, restore, or bulk-delete flows in this phase.

Admin save, publish, unpublish, and soft-delete actions call `revalidatePath()`
for `/blog`, Blog Search, Tags, Series, sitemap, RSS, and the affected article
path when the slug is known. In file mode this does not make database posts
public; it only keeps the cache behavior ready for database mode.

## Hero / Profile Admin Writes

Phase 11.6 adds Homepage / Profile Admin writes to PostgreSQL.

Important boundaries:

- `/admin/hero` manages homepage Hero content in `homepage_sections`.
- `/admin/profile` manages `profile_pages` with `key = 'profile'`.
- `/admin/contact` manages `contact_channels`.
- `/admin/stack` manages `system_stack_groups` and `system_stack_items`.
- Public pages still read through services. Admin pages and Client Components do
  not query PostgreSQL directly.
- The phase does not migrate, delete, import, or overwrite `content/profile`.
- Content Import / Export remains deferred.

Public database-mode behavior:

- `profile_pages key='profile'` feeds the public Profile section through
  `ProfileService`.
- Profile Admin is aligned to the homepage About section fields that are
  actually rendered; unused generic metadata is no longer exposed in the
  visible editor.
- `contact_channels` feeds the public Contact section directly in database mode.
- `system_stack_groups` and `system_stack_items` feed the public Stack section,
  ordered by `display_order`.
- `homepage_sections.visible = true` rows feed the lightweight
  `HomepageService`, ordered by `display_order`.
- The Hero mapping now reads only the `hero` key for the Main App Hero title /
  subtitle. `overview` and other legacy keys may remain in the table, but they
  are not used by the public homepage Hero.
- Homepage logs continue to come from published Blog content through
  `BlogService`, not from `homepage_sections`.
- Contact is now a single global dataset and no longer depends on `lang` or
  `profile_pages('contact-channels')`.
- Stack is now a single global dataset and no longer depends on `lang`,
  `translation_key`, or `profile_pages('system-stack')`.
- Soft-deleted Contact and Stack rows are excluded from public reads.

Admin save actions revalidate `/`, `/agent-demo`, `/projects/ai-agent-demo`,
and `sitemap.xml` so database-mode public content can refresh after edits. File
mode remains independent from these database rows.

## Projects Admin Writes

Phase 11.7 adds author-only Projects Admin writes to PostgreSQL `projects`.

Admin routes:

- `/admin/projects`
- `/admin/projects/new`
- `/admin/projects/[id]`

Important boundaries:

- Projects Admin writes database rows only. It does not read, migrate, delete,
  overwrite, import, or export `content/projects`.
- Public project pages still read through `ProjectService`.
- File mode continues reading `content/projects` through `FileProjectRepository`.
- Database mode reads PostgreSQL through `DatabaseProjectRepository` only when
  `PROJECT_CONTENT_SOURCE=database` or `CONTENT_SOURCE=database`.
- Database mode does not automatically fall back to file content.

Public database-mode project rules:

- `published = true` and `deleted_at is null` projects enter `/projects`,
  `/projects/[slug]`, sitemap, and Agent Demo public project retrieval.
- `published = false` projects are excluded from all public project reads.
- Homepage Featured Projects require `published = true`, `featured = true`, and
  `deleted_at is null`.
- Project ordering uses `display_order asc` with recent rows as a secondary
  ordering signal.
- `/projects/[slug]` allows dynamic params so newly published database projects
  can be served after Admin saves.

Admin save, publish, and unpublish actions revalidate `/`, `/projects`,
`/sitemap.xml`, `/agent-demo`, and the affected `/projects/[slug]` path when
known.

## Database Mode Notes

Database repositories are read-only for Phase 11.3.

Current status:

- `DatabaseBlogRepository`: implemented for published/draft reads, tags, series,
  search-compatible metadata, RSS, sitemap, and article lookup.
- `DatabaseProjectRepository`: implemented for published/featured/order reads and
  project detail lookup.
- `DatabaseProfileRepository`: implemented for public profile, visible contact
  channels, and system stack reads.

Database mode excludes soft-deleted rows and keeps public reads published-only or
visible-only.

## Empty Database Behavior

An empty database after running the migration is a valid state, not a content
source failure.

- Blog posts, tags, and series return empty collections. Blog pages render their
  existing empty states; RSS contains channel metadata without article items;
  sitemap contains no post, tag, or series detail URLs.
- Projects return empty collections. Homepage and `/projects` render lightweight
  empty states; unknown project slugs continue to use `notFound()`.
- Profile, Contact Channels, and System Stack return a centralized safe empty
  `PublicProfile` object in database mode, allowing the homepage to render empty
  states without fabricated content.
- Database mode does not automatically fall back to Markdown files when queries
  succeed with no rows.

Only successful queries with no matching content use empty results. Missing
`PERSONAL_SITE_DATABASE_URL`, connection failures, missing tables, invalid SQL,
and schema mismatches still throw explicit errors. File mode keeps its existing
strict profile validation and does not require or initialize PostgreSQL.

The Phase 11.3-fix smoke test applies the migration to an empty local PostgreSQL
database and verifies both `CONTENT_SOURCE=database` and an invalid-database-URL
`CONTENT_SOURCE=file` production build.

## Production Recommendations

Use an isolated PostgreSQL setup for the personal site:

- Dedicated database.
- Dedicated database user.
- Least-privilege permissions.
- Do not reuse the `sub2api` business database.
- Do not commit real connection strings.
- Keep `.env.production` outside Git.

## Backups

Recommended backup baseline:

- Run scheduled `pg_dump`.
- Store backups outside the repository.
- Restrict backup directory permissions.
- Test restore on a non-production database.
- Document restore commands before relying on the database as the primary source.

The full backup and restore runbook is in `docs/POSTGRES_BACKUP_RESTORE.md`.

## Production Source Switch And Rollback

File mode remains the safe default:

```text
CONTENT_SOURCE=file
BLOG_CONTENT_SOURCE=file
PROJECT_CONTENT_SOURCE=file
PROFILE_CONTENT_SOURCE=file
```

Database mode can be enabled gradually:

```text
CONTENT_SOURCE=file
BLOG_CONTENT_SOURCE=database
PROJECT_CONTENT_SOURCE=file
PROFILE_CONTENT_SOURCE=file
```

Before switching a production domain to `database`, confirm PostgreSQL
connectivity, migrations, backup, Admin content review, local or staging build,
and `.env.production` values. After switching, rebuild or restart and verify
public pages, sitemap, RSS, and Agent Demo sources.

Rollback to file mode uses:

```text
CONTENT_SOURCE=file
BLOG_CONTENT_SOURCE=file
PROJECT_CONTENT_SOURCE=file
PROFILE_CONTENT_SOURCE=file
```

Rollback does not delete database rows. Public pages return to the old
`content/blog`, `content/projects`, and `content/profile` files. See
`docs/PRODUCTION_CMS_DEPLOYMENT.md` for the detailed checklist.

## Admin Markdown Import / Export

Phase 11.8 added database-backed Markdown import/export. Phase 11.8-fix moved
the workflow into the matching content admin pages and removed standalone
`/admin/content` access.

- Blog Posts can be imported from `.md` files into PostgreSQL `blog_posts`.
- Projects can be imported from `.md` files into PostgreSQL `projects`.
- Blog import/export now lives in `/admin/blog`.
- Project import/export now lives in `/admin/projects`.
- Imports support `dry-run`, `create_only`, `update_by_slug`, and
  `create_or_update`.
- Dry-run is the default and does not write to the database.
- Non-dry-run imports require explicit Admin confirmation.
- Blog Posts and Projects can be exported as single Markdown files or bulk zip
  downloads from active database rows.
- Deleted Blog rows are excluded from ordinary Admin lists, public Blog, RSS,
  sitemap, and Markdown export scopes because those flows read active rows only.

Important boundaries:

- No local import/export scripts were added.
- No `pnpm content:*` commands were added.
- `content/blog` and `content/projects` are not deleted, migrated, or
  overwritten.
- `CONTENT_SOURCE`, `BLOG_CONTENT_SOURCE`, and `PROJECT_CONTENT_SOURCE` are not
  changed automatically.
- Profile, Contact, and Stack import/export remain out of scope.
