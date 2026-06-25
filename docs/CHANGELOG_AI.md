# AI Development Changelog

### 2026-06-25 - Codex
**Summary:** Phase 11.9 completed. Hardened CMS backup, restore, deployment, Admin env, and import/export limits.

**Phase 11.9 scope:**
- Added `docs/PRODUCTION_CMS_DEPLOYMENT.md` and `docs/PRODUCTION_CMS_DEPLOYMENT.zh-CN.md`.
- Added `docs/POSTGRES_BACKUP_RESTORE.md` and `docs/POSTGRES_BACKUP_RESTORE.zh-CN.md`.
- Documented PostgreSQL `pg_dump` backups for host/external databases and Docker PostgreSQL.
- Documented `pg_restore` recovery to a test database and cautious production restore flow.
- Documented migration rules: ordered numeric filenames, append-only migrations, backup before migration, manual execution, no build-time database dependency, and no startup migration runner.
- Documented file mode -> database mode production switching, domain-level gradual switching, and database mode -> file mode rollback.
- Added Admin env safety checks for required `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_SECRET`, minimum 32-character session secret, placeholder values, and known default password hashes.
- Added a safe database health-check helper that returns status only and does not expose database URLs or usernames.
- Centralized Admin Markdown limit names and documented `.md` only, 20 files per request, 1MB per file, no zip/URL/image import, and 100-record bulk export limit.
- Bulk Markdown zip export now fails clearly when more than 100 active rows match, instead of silently returning a partial zip.
- Documented Nginx `client_max_body_size 2m` handling for Admin Markdown import 413 errors.
- Updated `.env.example` with placeholder Admin values only.

**Scope guard:**
- No new Admin business module was added.
- No automatic backup job, migration runner, or production `CONTENT_SOURCE` switching was added.
- No public page UI was changed.
- No Agent Demo answer-scope, Console / CLI, window-system, Docker, or tracked Nginx deployment config changes were made.
- No real env, secrets, database URLs, or backup dump files were committed.

**Verification:**
- Added focused tests for Admin env checks, database health-check behavior, import file-count/file-size limits, and bulk export record limits.
- `pnpm test`, `pnpm lint`, and `pnpm build` are the final release checks for this phase.

### 2026-06-25 - Codex
**Summary:** Added Blog Admin soft delete and improved `/admin/blog` row actions.

**Fix scope:**
- Added `/admin/blog` row-level Delete for database Blog Posts.
- Delete uses soft delete by setting `blog_posts.deleted_at`; no hard delete is performed.
- Delete requires browser confirmation and a Server Action that re-checks the Admin session.
- Deleted rows disappear from the normal Blog Admin list.
- Public database Blog reads already require `deleted_at is null`, so deleted published posts stay out of `/blog`, RSS, sitemap, tags, series, and search.
- Revalidated Admin Blog, public Blog, search, tags, series, sitemap, RSS, and the affected article slug after deletion.
- Improved `/admin/blog` row actions with wrapping button layout and danger styling for Delete.

**Scope guard:**
- No `content/blog` files were modified, deleted, or migrated.
- No hard delete, recycle bin, restore flow, or bulk delete was added.
- No Projects Admin delete behavior was added.
- No import/export core service behavior was changed.
- No public Blog UI, Agent Demo, Console / CLI, window-system, Docker, or Nginx deployment config changes were made.

**Verification:**
- Targeted Vitest coverage for Blog Admin soft delete, SQL shape, action auth/revalidation, and public repository deleted-row filtering passed.
- `pnpm test`, `pnpm lint`, and `pnpm build` are the final release checks for this phase.

### 2026-06-25 - Codex
**Summary:** Phase 11.8-fix completed with Option B. Removed `/admin/content` access and moved Markdown transfer into Blog / Projects Admin.

**Fix scope:**
- Moved Blog Markdown import/export UI into `/admin/blog`.
- Moved Project Markdown import/export UI into `/admin/projects`.
- Removed the standalone `/admin/content` page and old `/admin/content/export/*` route handlers.
- Added replacement export routes under `/admin/blog/export*` and `/admin/projects/export*`.
- Removed Admin navigation and dashboard links to `/admin/content`.
- Kept the existing `lib/admin/content-transfer` service behavior unchanged.
- Removed the Content Type selector from import UI; Blog and Project import now use fixed content types.

**Scope guard:**
- No `content/blog` or `content/projects` files were deleted or migrated.
- No automatic `CONTENT_SOURCE` switching was added.
- No public Blog / Projects content-source logic was changed.
- No Agent Demo, Console / CLI, window-system, Docker, or Nginx deployment config changes were made.

**Verification:**
- `pnpm test`
- `pnpm lint`
- `pnpm build`

### 2026-06-25 - Codex
**Summary:** Fixed Admin Blog Markdown export/import round-trip and hardened export download links.

**Fix scope:**
- Fixed Blog Markdown export so nullable and empty optional frontmatter fields are omitted instead of being serialized as `null` or empty values.
- This specifically fixes self-exported Blog files failing re-import validation when `seriesOrder` is absent in the source row.
- Switched Admin Content export controls from `next/link` to plain anchor downloads so export requests use normal file GET navigation.
- Added a regression test covering Blog export -> import round-trip.

**Verification:**
- `pnpm vitest run lib/admin/content-transfer/content-transfer-service.test.ts`
- `pnpm lint`

### 2026-06-25 - Codex
**Summary:** Phase 11.8 completed. Added Admin Markdown import/export for Blog Posts and Projects.

**Phase 11.8 scope:**
- Added protected `/admin/content`.
- Added Markdown import for Blog Posts into PostgreSQL `blog_posts`.
- Added Markdown import for Projects into PostgreSQL `projects`.
- Added dry-run preview as the default import mode.
- Added formal import modes: `create_only`, `update_by_slug`, and `create_or_update`.
- Required explicit Admin confirmation before any non-dry-run import writes to PostgreSQL.
- Added upload validation: `.md` only, 20 files per request, 1MB per file.
- Added Blog frontmatter validation, slug checks, and field mapping.
- Added Project frontmatter validation, slug checks, and field mapping.
- Added per-file import reports with summary counts and warnings/errors.
- Added single Markdown export routes for Blog Posts and Projects.
- Added bulk zip export routes for active Blog Posts and Projects.
- Added `lib/admin/content-transfer` service layer and focused unit tests.
- Added `docs/ADMIN_CONTENT_TRANSFER.md` and `docs/ADMIN_CONTENT_TRANSFER.zh-CN.md`.

**Scope guard:**
- No local migration scripts were added.
- No `pnpm content:*` commands were added.
- No `content/blog` or `content/projects` files were deleted, migrated, or overwritten.
- No automatic `CONTENT_SOURCE` switching was added.
- No Profile / Contact / Stack import/export was added.
- No Agent Demo answer-scope change was made.
- No Console / CLI change was made.
- No window-system change was made.
- No Docker / Nginx deployment config change was made.

**Verification:**
- Added focused tests for frontmatter validation, filename safety, import modes, dry-run behavior, and Markdown export.
- `pnpm vitest run lib/admin/content-transfer` passed.
- `pnpm lint` passed.
- `pnpm test` and `pnpm build` are the final release checks for this phase.

### 2026-06-24 - Codex
**Summary:** Phase 11.7 completed. Added PostgreSQL-backed Projects Admin MVP.

**Phase 11.7 scope:**
- Added `/admin/projects`, `/admin/projects/new`, and `/admin/projects/[id]`.
- Added Project Admin service, repository, validation, Server Actions, list page, create page, edit page, and admin form.
- Projects Admin writes to PostgreSQL `projects`.
- Supported list, search, published / featured / language filters, empty state, create, edit, save, publish, and unpublish.
- Supported editable fields: title, slug, subtitle, summary, status, type, timeline, language, published, featured, display order, Markdown content, role, tech stack, features, highlights, links, related posts, related series slug, SEO title, and SEO description.
- JSON fields are edited with plain textareas and validated before writes.
- Markdown content is edited with a plain textarea.
- Added slug format validation and active database project slug uniqueness checks.
- Database-mode public Projects continue through `ProjectService` / `DatabaseProjectRepository`, with published-only reads for `/projects`, `/projects/[slug]`, sitemap, and Agent Demo project retrieval.
- Homepage Featured Projects in database mode require `published=true`, `featured=true`, and `deleted_at is null`.
- `/projects/[slug]` now allows dynamic params so newly published database projects can be served after Admin saves.
- File mode remains unchanged and continues to read `content/projects`.

**Scope guard:**
- No Content Import / Export was added.
- No `content/projects` migration, deletion, overwrite, or import was performed.
- No Agent Demo answer-scope change was made.
- No Console / CLI change was made.
- No window-system change was made.
- No Docker / Nginx deployment config change was made.

**Verification:**
- Added focused Project Admin service, Project Admin validation, and project database mapper tests.
- `pnpm test`, `pnpm lint`, and `pnpm build` are the release checks for this phase.

### 2026-06-24 - Codex
**Summary:** Fixed Profile database-mode rendering gaps and tightened Profile Admin to match the homepage About section.

**Profile follow-up scope:**
- Checked the local PostgreSQL `profile_pages` data used by `.env.local` and confirmed the homepage Profile test values were being stored.
- Fixed database-mode Profile mapping so admin-managed nested localized fields like `intro`, `role`, `status`, `privacyNote`, and `building` now render correctly on the homepage even when only one language side is filled.
- Preserved the homepage About rendering structure and clarified the real data flow instead of expanding unused UI fields into the public page.
- Simplified `/admin/profile` by removing the unused `title` and `summary` editors from the visible form while preserving their stored values through hidden inputs.
- Added a clearer `Building` input placeholder and note so homepage-visible entries include the required link field.
- Added focused mapper regression coverage for admin-managed nested localized Profile data.

**Verification:**
- `pnpm vitest run lib/profile/profile-db-mapper.test.ts`
- `pnpm lint`
- `pnpm build`

### 2026-06-24 - Codex
**Summary:** Rebuilt Stack Admin and homepage Stack into a single global stack configuration with simplified group/item editing.

**Phase 11.6.4 scope:**
- Reset `system_stack_groups` and `system_stack_items` away from the old localized `zh/en` + `translation_key` model into a single global stack configuration model.
- Added `database/migrations/004_reset_system_stack_single_source.sql` to recreate Stack tables with group `name` / `display_order` and item `name` / `display_order`.
- Refactored `/admin/stack` into a single global Stack Admin panel with left-side group selection and right-side group/item editing.
- Removed Stack language switching, translation pairing, description, level, and status editing from the admin flow.
- Added group and item up/down ordering actions so Stack Admin no longer exposes raw order inputs.
- Removed database-mode Stack dependence on `profile_pages('system-stack')` and switched public Stack reads to direct `system_stack_groups` / `system_stack_items` queries.
- Simplified file-mode `content/profile/system-stack.md` to the same single-source group/item structure used by database mode.
- Updated homepage Stack rendering and Agent Demo stack summary to consume one shared group/item dataset in both `zh` and `en`.

**Verification:**
- `pnpm vitest run lib/profile/profile-db-mapper.test.ts lib/profile/profile-service.test.ts lib/admin/profile-admin-service.test.ts lib/admin/profile-admin-validation.test.ts`
- `pnpm lint`
- `pnpm build`

### 2026-06-24 - Codex
**Summary:** Rebuilt Contact Admin and homepage Contact into a single global contact configuration with preset platform icons and direct database-mode rendering.

**Phase 11.6.3 scope:**
- Reset `contact_channels` away from the old localized `zh/en` row model into a single global contact configuration model.
- Added `database/migrations/003_reset_contact_channels_single_source.sql` to recreate `contact_channels` with `platform`, `custom_label`, `value`, `href_override`, and `display_order`.
- Refactored `/admin/contact` into a single global contact manager with configured-method list, preset platform creation, custom entries, and up/down ordering.
- Removed Contact language switching, localized label/value editing, and public footer meta copy from the homepage Contact flow.
- Added shared contact platform metadata and icon mapping with `react-icons` plus `lucide-react` fallback icons.
- Tightened Contact Admin validation around platform type, email / URL format, custom-label requirements, and override-link validation.
- Added non-`custom` platform uniqueness protection in the Contact admin service.
- Removed Contact localization-merging logic for database mode and switched homepage Contact rendering to a single-source `platform / label / value / href / displayOrder` model.
- Kept file-mode Contact support, but updated `content/profile/contact-channels.md` to the new simplified structure.
- Updated the Agent Demo profile knowledge tool to summarize the new Contact shape.
- Applied the new Contact reset migration to the local PostgreSQL database used in `.env.local`.

**Verification:**
- `pnpm vitest run lib/profile/profile-db-mapper.test.ts lib/profile/profile-service.test.ts lib/admin/profile-admin-service.test.ts lib/admin/profile-admin-validation.test.ts`
- `pnpm lint`
- `pnpm build`

### 2026-06-24 - Codex
**Summary:** Fixed Phase 11.6.2 Contact / Stack admin save failures caused by invalid translation key format.

**Fix scope:**
- Changed new `contact` / `stack` admin records to generate plain UUID `translationKey` values instead of prefixed strings like `contact-<uuid>`.
- Tightened Profile Admin validation so `contact`, `stack group`, and `stack item` translation keys must be valid UUIDs before any PostgreSQL write is attempted.
- Updated focused admin service and validation tests to use valid UUID fixtures.
- Added a regression test that rejects legacy prefixed translation key strings before they reach the database layer.

**Verification:**
- `pnpm vitest run lib/profile/profile-db-mapper.test.ts lib/profile/profile-service.test.ts lib/admin/profile-admin-service.test.ts lib/admin/profile-admin-validation.test.ts`
- `pnpm lint`
- `pnpm build`

### 2026-06-24 - Codex
**Summary:** Tightened Phase 11.6 Profile / Contact / Stack Admin into Hero-style language panels and fixed database-mode homepage localization for those sections.

**Phase 11.6.2 scope:**
- Refactored `/admin/profile`, `/admin/contact`, and `/admin/stack` into two-column admin pages with a left-side `zh` / `en` language switch and a right-side single-language editor.
- Removed the old descriptive copy blocks from these pages so the admin surface is focused on editing.
- Replaced the broken old `ProfilePageForm` wiring with a new `ProfileAdminPanel` and structured single-language `Profile` editor.
- Tightened `Profile Admin` around the homepage About-facing structured fields instead of exposing a generic page form.
- Tightened `Contact Admin` so channel create/edit/delete now happens inside the current language context.
- Tightened `System Stack Admin` so group/item create/edit/delete now happens inside the current language context.
- Updated database-mode profile mappers so homepage About, Contact, and Stack build localized display objects from zh/en admin rows.
- Updated homepage Stack rendering to use localized item text so site language switching reflects admin-managed database content.

**Verification:**
- `pnpm vitest run lib/profile/profile-db-mapper.test.ts lib/profile/profile-service.test.ts lib/admin/profile-admin-service.test.ts lib/admin/profile-admin-validation.test.ts`
- `pnpm lint`
- `pnpm build`

### 2026-06-24 - Codex
**Summary:** Tightened Phase 11.6 Homepage Admin into Hero Admin so the admin boundary matches the real homepage data flow.

**Phase 11.6.1 scope:**
- Added `/admin/hero` as the primary Hero Admin route.
- Removed the old `/admin/homepage` route.
- Updated the Admin navigation and dashboard card from Homepage Admin to Hero Admin.
- Tightened Hero Admin to manage only `homepage_sections.key = 'hero'`.
- Removed `displayOrder`, `data`, custom key creation, and multi-section defaults from the Hero Admin UI flow.
- Replaced the old “create default homepage sections” behavior with per-language Hero initialization.
- Tightened admin validation so non-`hero` homepage keys are rejected.
- Tightened homepage runtime Hero selection so it reads only `hero` and no longer falls back to `overview`.
- Kept legacy `overview/services/logs/cta` rows in PostgreSQL untouched, but they are no longer shown in Hero Admin and do not affect the public Hero.
- Confirmed homepage logs remain sourced from published Blog content through `BlogService`.

**Verification:**
- `pnpm vitest run lib/admin/profile-admin-validation.test.ts lib/admin/profile-admin-service.test.ts lib/homepage/homepage-service.test.ts`
- `pnpm lint`
- `pnpm build`

### 2026-06-23 - Codex
**Summary:** Phase 11.6 completed. Added Homepage / Profile Admin MVP for PostgreSQL-backed public profile content.

**Phase 11.6 scope:**
- Added `/admin/homepage`, `/admin/profile`, `/admin/contact`, and `/admin/stack`.
- Added `lib/admin` Homepage / Profile Admin service, repository, validation, and tests.
- Homepage Admin writes to `homepage_sections`.
- Profile Admin writes to `profile_pages` with `key = 'profile'`.
- Contact Admin writes to `contact_channels`, including visible, display order, language, and soft delete.
- Stack Admin writes to `system_stack_groups` and `system_stack_items`, including display order and soft delete.
- Added a lightweight `HomepageService` for database-mode visible homepage sections.
- Database-mode public homepage can read admin-saved `hero` / `overview` content for the Main App Hero.
- Database-mode public Profile, Contact, and Stack continue to read through `ProfileService`.
- File mode remains unchanged and continues to read `content/profile`.

**Scope guard:**
- No Projects Admin was added.
- No Content Import / Export was added.
- No `content/profile` migration, deletion, overwrite, or import was performed.
- No Agent Demo answer-scope change was made.
- No Console / CLI change was made.
- No window-system change was made.
- No Docker / Nginx deployment config change was made.

**Verification:**
- Added focused tests for Profile Admin validation, service behavior, homepage database/file mode, and existing public profile empty-state behavior.
- `pnpm test` passed.
- `pnpm lint` passed.
- `pnpm build` passed.

### 2026-06-23 - Codex
**Summary:** Phase 11.5 completed. Added Blog Admin MVP for PostgreSQL `blog_posts`.

**Phase 11.4 / 11.5 scope:**
- Added minimal Admin Auth foundation because the current workspace did not yet contain Phase 11.4 runtime code.
- Added `/admin/login`, `/admin`, middleware protection for `/admin/*`, signed HttpOnly admin session cookies, environment-variable credentials, basic login rate limiting, and Admin `noindex`.
- Added `/admin/blog`, `/admin/blog/new`, and `/admin/blog/[id]`.
- Added Blog Admin service, repository, validation, and Server Actions under `lib/admin` and `app/admin/blog`.
- Blog Admin writes to PostgreSQL `blog_posts`.
- Supported list, empty state, search, status/language filters, create, edit, save draft, publish, unpublish, and Markdown textarea editing.
- Supported fields: title, slug, summary, status, lang, date, tags, series, series slug, series order, cover, SEO title, SEO description, and Markdown content.
- Added slug format validation and active-post uniqueness checks.
- Added cache revalidation for Blog, Search, Tags, Series, sitemap, RSS, and affected article paths.

**Data-source guard:**
- Public Blog reads database posts only when `BLOG_CONTENT_SOURCE=database` or `CONTENT_SOURCE=database`.
- Default file content source remains unchanged.
- No `content/blog` files were migrated, deleted, imported, or overwritten.
- No Agent Demo scope, Console / CLI, window-system, Docker, or Nginx config changes were made.

**Verification:**
- Added focused tests for Blog Admin service, validation, and public DatabaseBlogRepository visibility.
- `pnpm test`, `pnpm lint`, and `pnpm build` are the release checks for this phase.

### 2026-06-22 - Codex
**Summary:** Phase 11.3-fix completed. Database content sources now handle empty tables safely.

**Fix scope:**
- Fixed the database-mode homepage build failure caused by missing Profile content.
- Added centralized empty Profile, Contact Channels, System Stack, and `PublicProfile` values for database mode.
- Added lightweight empty states for homepage content modules and the public Projects list.
- Kept Blog, tags, series, RSS, sitemap, and Projects empty collections safe.
- Kept database mode from automatically falling back to file content.
- Kept configuration, connection, table, SQL, and schema errors explicit.
- Kept file mode strict and independent from PostgreSQL.
- Added service/config tests for empty content and error boundaries.

**Verification:**
- `pnpm test`: 16 files and 65 tests passed; 1 existing live test skipped.
- `pnpm lint` passed.
- `pnpm build` passed in file mode with an invalid database URL.
- Local PostgreSQL 18.1 empty-table smoke build passed in database mode.
- Migration succeeded and Blog, Projects, and Profile tables were confirmed empty.

**Scope guard:**
- No Admin UI or `/admin` route was added.
- No real content was migrated.
- No deployment, Nginx, Agent Demo scope, Console / CLI, or window-system changes were made.

### 2026-06-21 - Codex
**Summary:** Phase 11.3 completed. Added database content-source foundation.

**Phase 11.3 scope:**
- Added PostgreSQL CMS schema migration at `database/migrations/001_create_cms_tables.sql`.
- Added MVP tables for Blog Posts, Blog Series, Projects, Profile Pages, Contact Channels, System Stack, and Homepage Sections.
- Added indexes for common public reads and `updated_at` triggers.
- Added PostgreSQL access helpers under `lib/db`.
- Added read-only DatabaseRepository implementations for Blog, Projects, and Profile.
- Added database row-to-domain mappers and focused mapper/source tests.
- Added repository factory and content-source env selection under `lib/content`.
- Wired `BlogService`, `ProjectService`, and `ProfileService` through the factory.
- Added `.env.example` placeholders for database content-source configuration.
- Added `docs/DATABASE_CONTENT_SOURCE.md` and `docs/DATABASE_CONTENT_SOURCE.zh-CN.md`.
- Updated Admin / CMS design docs and implementation plans.

**Scope guard:**
- Default content source remains `file`.
- File mode does not require PostgreSQL.
- No Admin UI, `/admin` route, or login page was added.
- No real content was migrated, moved, deleted, or overwritten.
- `content/blog`, `content/projects`, and `content/profile` remain in place.
- No Agent Demo scope, Console / CLI, window-system, Docker, or Nginx changes were made.

**Verification:**
- `pnpm test` passed.
- `pnpm lint` passed.
- `pnpm build` passed.

### 2026-06-21 - Codex
**Summary:** Phase 11.2 completed. Added Admin / CMS architecture design documentation.

**Phase 11.2 scope:**
- Added `docs/ADMIN_CMS_DESIGN.md` and `docs/ADMIN_CMS_DESIGN.zh-CN.md`.
- Documented why content should gradually move from file-based repositories to PostgreSQL.
- Defined the first Admin / CMS management scope for Blog Posts, Blog Series, Projects, Profile, Contact Channels, System Stack, and Homepage Content.
- Drafted PostgreSQL content models and marked MVP tables versus later enhancement tables.
- Designed the migration path from FileRepository to DatabaseRepository while preserving Service boundaries.
- Designed Admin login, security, publishing, import/export, external blog directory, backup, deployment, and rollback boundaries.
- Clarified that Agent Demo will continue reading public content through BlogService / ProjectService / ProfileService and will not expand its answer scope.
- Updated the Phase 11 plan to make Phase 11.3 through Phase 11.10 the follow-up Admin / CMS implementation phases.

**Scope guard:**
- No Admin code was implemented.
- No database tables or migrations were added.
- No content was migrated, moved, or deleted.
- No Blog / Projects / Profile core logic was changed.
- No Agent Demo logic, Console / CLI, window system, or tracked deployment config was changed.

**Verification:**
- `pnpm lint` passed.
- `pnpm build` passed after syncing the already-declared dependencies with `pnpm install`.

### 2026-06-21 - Codex
**Summary:** Phase 11.1 accepted. Documentation updated and current version prepared for commit.

**Acceptance scope:**
- Recorded user acceptance for Phase 11.1 Agent Demo observability and feedback.
- Confirmed the accepted baseline keeps the privacy-safe minimal event model, UUID `requestId`, PostgreSQL feedback storage, and button-only feedback flow.
- Kept the scope guard unchanged: no Agent answer-scope expansion, no write tools, no Console / CLI changes, no window-system changes, and no tracked Docker / Nginx config changes.

**Verification:**
- `pnpm test`, `pnpm lint`, and `pnpm build` are the release checks for this acceptance commit.

### 2026-06-17 - Codex
**Summary:** Phase 11.1 completed. Added privacy-safe Agent Demo observability and feedback.

**Phase 11.1 scope:**
- Added PostgreSQL-backed minimal Agent Demo event logging under `features/agent-demo/observability`.
- Added random UUID `requestId` to all `POST /api/agent-demo` responses.
- Added SHA-256 + server-side salt hashing for question and IP summaries.
- Added minimal event records for completed, blocked, rate-limited, and error responses.
- Added `POST /api/agent-demo/feedback` for button-only `helpful` / `not_helpful` feedback.
- Added Helpful / Not helpful controls to `/agent-demo` after successful answers.
- Added `.env.example` placeholders for `AGENT_DEMO_OBSERVABILITY_ENABLED`, `AGENT_DEMO_HASH_SALT`, and `AGENT_DEMO_DATABASE_URL`.
- Added PostgreSQL table SQL, privacy notes, disable instructions, and minimal statistics queries to deployment and architecture docs.
- Updated implementation plans with Phase 11.1 completed and Phase 11.2 through Phase 11.5 planned.

**Privacy guard:**
- Full questions are not stored.
- Full answers are not stored.
- Plaintext IPs are not stored.
- Raw headers, prompts, retrieved context, and trace details are not stored.
- Observability write failures are logged safely and do not affect Agent Demo responses.

**Scope guard:**
- No Agent answer scope changes were made.
- No write tools were added to the Agent.
- No Console / CLI changes were made.
- No window-system behavior changes were made.
- No tracked Docker / Nginx config files were changed.

**Verification:**
- `pnpm test` passed.

### 2026-06-15 - Codex
**Summary:** Phase 10.7 completed. Final acceptance and documentation closure for the first public Agent Demo version.

**Phase 10.7 scope:**
- Completed final acceptance for `/agent-demo` and `POST /api/agent-demo`.
- Added `docs/AGENT_DEMO_ARCHITECTURE.zh-CN.md` as the Chinese architecture counterpart.
- Updated the English architecture document with Phase 10.6 / 10.7 completion and final acceptance criteria.
- Updated Agent Demo README to record Phase 10.6 / 10.7 and remove stale deferred work.
- Updated English and Chinese implementation plans to mark Phase 10 completed.
- Updated README and the Chinese docs index with Agent Demo architecture links.
- Expanded the Chinese deployment guide with Agent Demo model environment variables, production log-level guidance, Nginx rate limiting, online validation commands, and safe log checks.
- Rechecked that the public demo scope remains read-only and limited to public Profile, stack, published Projects, published Blog, AI Agent learning, and Personal Developer OS implementation notes.

**Acceptance checks:**
- `/agent-demo` is the public interactive UI.
- `POST /api/agent-demo` returns the scoped Agent Demo response shape.
- Private data, secrets, server internals, dangerous actions, and high-risk advice are refused before model generation.
- Trace and public sources are part of the API / UI contract.
- Sitemap includes `/agent-demo`; RSS remains blog-post-only.
- Live model tests remain opt-in with `AGENT_DEMO_RUN_LIVE_TEST=true`.

**Scope guard:**
- No runtime Agent Demo behavior was changed.
- No Console / CLI changes were made.
- No window-system behavior changes were made.
- No tracked Docker / Nginx config files were changed.

**Verification:**
- `pnpm test` passed.
- `pnpm lint` passed.
- `pnpm build` passed.

### 2026-06-15 - Codex
**Summary:** Phase 10.6 completed. Added Agent Demo production deployment and safety verification guidance.

**Phase 10.6 scope:**
- Added Agent Demo production environment variable guidance to `docs/DEPLOYMENT.md`.
- Documented production recommendations for model API URL, API key, model name, timeout, app rate limit, log level, and live-test flag.
- Documented recommended production log levels: `info` by default, `debug` only for short troubleshooting windows, `silent` after the feature is stable if logs become too noisy.
- Added Nginx `limit_req_zone` and `/api/agent-demo` `limit_req` examples.
- Added online validation commands for safe public questions and blocked secret questions.
- Added log validation guidance for `[agent-demo]` request IDs and safe summaries.
- Added Agent Demo production safety verification notes to the architecture document.
- Updated English and Chinese implementation plans to mark Phase 10.6 as completed.

**Scope guard:**
- No runtime code changes were made.
- No Console / CLI changes were made.
- No window-system behavior changes were made.
- No Docker / Nginx tracked config files were changed.

**Verification:**
- `pnpm test` passed.
- `pnpm lint` passed.
- `pnpm build` passed.

### 2026-06-15 - Codex
**Summary:** Added safe Agent Demo diagnostic logging for upstream timeout investigation.

**Scope:**
- Added `features/agent-demo/agentDemoLogger.ts` with `info`, `debug`, and `silent` log levels.
- Added server-side request lifecycle logs in the Agent Demo route.
- Added service-level logs for validation, rate-limit checks, scope classification, context retrieval, model failures, and completion.
- Added model-client logs for configuration misses, request start, upstream status failures, empty responses, success, timeout, and unknown fetch errors.
- Added `requestId` propagation across route, service, and model client.
- Added `.env.example` entries for `AGENT_DEMO_LOG_LEVEL` and `AGENT_DEMO_RUN_LIVE_TEST`.
- Made live model tests opt-in with `AGENT_DEMO_RUN_LIVE_TEST=true` so normal unit tests are not blocked by external model latency.
- Documented diagnostic logging in Agent Demo README and architecture docs.

**Safety guard:**
- Logs intentionally avoid API keys, full prompts, full retrieved context, full model answers, raw upstream response bodies, private environment values, and server paths.

**Verification:**
- `pnpm test` passed, with the live model test skipped by default.
- `pnpm lint` passed.
- `pnpm build` passed.

### 2026-06-15 - Codex
**Summary:** Phase 10.5 completed. Added the public Agent Demo UI and trace display.

**Phase 10.5 scope:**
- Added `/agent-demo` as the public interactive Agent Demo page.
- Built the page as an OS-style tool surface using the existing Project layout.
- Added question input, character counter, submit action, and sample questions.
- Added loading, network error, model error, and rate-limit states.
- Added answer rendering, trace step display, and public source display.
- Added a public read-only scope notice.
- Added `/agent-demo` to sitemap.
- Added the `/agent-demo` entry point to the AI Agent Demo project frontmatter.
- Kept UI imports client-safe so server-only knowledge tools are not bundled into the browser.

**Scope guard:**
- No Console / CLI changes were made.
- No window-system behavior changes were made.
- No Docker / Nginx deployment files were changed.

**Verification:**
- `pnpm test` passed.
- `pnpm lint` passed.
- `pnpm build` passed.
- A direct hidden dev-server smoke check did not connect in this shell session; build verification confirmed `/agent-demo` is generated.

### 2026-06-15 - Codex
**Summary:** Phase 10.4 completed. Added Agent Demo rate limiting, timeout handling, and abuse protection.

**Phase 10.4 scope:**
- Added in-process fixed-window rate limiting for `POST /api/agent-demo`.
- Added client identifier detection from common proxy headers.
- Added `429` responses with `Retry-After` when requests exceed the configured window.
- Added optional protection environment variables: `AGENT_DEMO_MODEL_TIMEOUT_MS`, `AGENT_DEMO_RATE_LIMIT_WINDOW_MS`, and `AGENT_DEMO_RATE_LIMIT_MAX_REQUESTS`.
- Added model request timeout via `AbortController`.
- Added safe `upstream_timeout` handling.
- Added context and output length clamps while preserving existing input and source limits.
- Extended `usage` with output length and rate-limit metadata.
- Added tests for rate limiting, service short-circuiting, model timeout, output clamp, and context clamp.

**Scope guard:**
- Redis-backed distributed rate limiting remains deferred until multi-instance production needs it.
- No `/agent-demo` UI was added.
- No Console / CLI changes were made.
- No window-system behavior changes were made.
- No Docker / Nginx deployment files were changed.

**Verification:**
- Agent Demo focused tests passed: `pnpm vitest run features/agent-demo`.
- `pnpm test` passed.
- `pnpm lint` passed.
- `pnpm build` passed.

### 2026-06-15 - Codex
**Summary:** Phase 10.3 completed. Added the read-only Agent API MVP.

**Phase 10.3 scope:**
- Added `POST /api/agent-demo`.
- Added a server-only OpenAI-compatible Chat Completions model adapter using native `fetch`.
- Added explicit server-only environment variables to `.env.example`: `AGENT_DEMO_MODEL_API_URL`, `AGENT_DEMO_MODEL_API_KEY`, and `AGENT_DEMO_MODEL`.
- Upgraded `agentDemoService` into the shared validation, scope, retrieval, and model-generation pipeline.
- Added safe refusal for blocked scope before retrieval or model generation.
- Added safe no-context and model-error responses.
- Added service-level unit tests for validation failure, blocked scope, successful generation, and model-unavailable handling.
- Updated Agent Demo README, architecture docs, and implementation plans.

**Scope guard:**
- No `/agent-demo` UI was added.
- No Redis integration was added.
- No persistent rate limiting was added; Phase 10.4 remains responsible for that.
- No Console / CLI command system changes were made.
- No window-system behavior changes were made.
- No Docker / Nginx deployment files were changed.

**Verification:**
- `pnpm test` passed.
- `pnpm lint` passed.
- `pnpm build` passed.

### 2026-06-15 - Codex
**Summary:** Phase 10.2.1 completed. Added the Agent Demo unit test foundation.

**Phase 10.2.1 scope:**
- Added Vitest as the focused unit test runner.
- Added `test` and `test:watch` scripts to `package.json`.
- Added `vitest.config.ts` with the existing `@` alias and Node test environment.
- Added tests for Agent Demo input validation.
- Added tests for the rule-based scope classifier.
- Added tests for text utility helpers.
- Added tests for public knowledge retrieval routing, blocked-scope behavior, trace status, and source deduplication.
- Updated implementation plans to mark Phase 10.2.1 as completed while keeping Phase 10.3 planned.

**Scope guard:**
- No model integration was added.
- No `/api/agent-demo` route was added.
- No `/agent-demo` UI was added.
- No Redis integration was added.
- No Blog / Projects / Profile core service behavior was changed.
- No Console / CLI command system changes were made.
- No window-system behavior changes were made.
- No Docker / Nginx / deployment configuration changes were made.

**Verification:**
- `pnpm test` passed.
- `pnpm lint` passed.
- `pnpm build` passed.

### 2026-06-15 - Codex
**Summary:** Phase 10.2 completed. Added read-only Agent Demo knowledge tools and scope classifier.

**Phase 10.2 scope:**
- Added `features/agent-demo/tools`.
- Added Blog read-only tools using `BlogService` published-only methods:
  - `searchBlogPosts(query)`
  - `getBlogPostBySlug(slug)`
  - `getRecentBlogPosts(limit)`
- Added Project read-only tools using `ProjectService` published-only methods:
  - `searchProjects(query)`
  - `getProjectBySlug(slug)`
  - `getPublishedProjectSummaries(limit)`
- Added Profile read-only tools using `ProfileService` public methods:
  - `getPublicProfile(locale)`
  - `getSystemStack(locale)`
  - `getPublicContact(locale)`
- Added rule-based `scopeClassifier` for allowed and blocked categories.
- Added `publicKnowledgeRetriever` that routes allowed categories to public tools and returns bounded `contextText`, public `sources`, and trace updates.
- Extended Agent Demo types with `AgentKnowledgeItem` and `AgentKnowledgeRetrieverResult`.
- Updated Agent Demo architecture docs and README.
- Updated implementation plans to mark Phase 10.2 as completed and Phase 10.3 as planned.

**Scope guard:**
- No model integration was added.
- No `/api/agent-demo` route was added.
- No `/agent-demo` UI was added.
- No Redis integration was added.
- No Blog / Projects / Profile core service behavior was changed.
- No Console / CLI command system changes were made.
- No window-system behavior changes were made.
- No Docker / Nginx / deployment configuration changes were made.

**Verification:**
- `pnpm lint` passed.
- `pnpm build` passed.

### 2026-06-15 - Codex
**Summary:** Phase 10.1 completed. Added the AI Agent Demo architecture and safety foundation.

**Phase 10.1 scope:**
- Added an isolated foundation under `features/agent-demo`.
- Added request / response / trace / source / usage / validation / scope types.
- Added static configuration for locales, input length, source limits, trace steps, public project slugs, and scope categories.
- Added reusable input validation for `question` and `locale`.
- Added trace helpers for `input_validation`, `rate_limit_check`, `scope_check`, `retrieve_context`, and `generate_answer`.
- Added safety policy constants for the read-only public-content boundary.
- Added scope policy constants for allowed and blocked categories.
- Added a foundation-only service response for future API route integration.
- Added `docs/AGENT_DEMO_ARCHITECTURE.md` covering first-version goals, public scope, forbidden scope, API contract, safety boundary, tool permissions, rate-limit strategy, trace / sources contract, and future phases.
- Updated `docs/IMPLEMENTATION_PLAN.md` and `docs/IMPLEMENTATION_PLAN.zh-CN.md` to mark Phase 10 as in progress, Phase 10.1 as completed, and Phase 10.2 through Phase 10.7 as planned.

**Scope guard:**
- No real model integration was added.
- No Redis integration was added.
- No `/api/agent-demo` route was added.
- No `/agent-demo` UI was added.
- No Blog / Projects / Profile core logic was changed.
- No Console / CLI command system changes were made.
- No window-system behavior changes were made.
- No Docker / Nginx / deployment configuration changes were made.

**Verification:**
- `pnpm lint` passed.
- `pnpm build` passed.

### 2026-06-13 - Codex
**Summary:** Phase 9.5 completed. Final acceptance and closure for Phase 9 Blog UX polish.

**Phase 9.5 acceptance scope:**
- Reviewed the Phase 9 Blog discovery and reading experience end to end:
  - `/blog`
  - `/blog/search`
  - `/blog/tags`
  - `/blog/tags/[tagSlug]`
  - `/blog/series`
  - `/blog/series/personal-developer-os`
  - `/blog/why-rebuild-my-personal-blog`
- Confirmed Blog list, Tag Pages, Series Pages, Article TOC, Previous / Next Navigation, and Blog Search remain consistent.
- Confirmed Blog SEO outputs remain aligned:
  - `sitemap.xml` includes Blog, Search, Tags, Series, published posts, Projects, and published project pages.
  - `rss.xml` remains blog-post-only.
  - `robots.txt` points to the sitemap.
- Confirmed draft posts remain excluded from public Blog pages, tag pages, search, sitemap, RSS, and static params.
- Confirmed light / dark, macos / vercel, zh / en, and mobile-responsive behavior remain supported through existing settings and style tokens.
- Updated `docs/IMPLEMENTATION_PLAN.md` to mark Phase 9 and Phase 9.5 as completed.
- Added Phase 10 as planned only: `AI Agent Demo Integration`.

**Small fix:**
- Updated the article detail inline TOC visibility from `lg:hidden` to `xl:hidden`, so the in-flow TOC remains visible until the fixed floating TOC appears at the `xl` breakpoint.
- This avoids a medium desktop width gap where no Article TOC was visible.

**Files changed:**
- `components/blog/BlogArticle.tsx`
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/CHANGELOG_AI.md`
- `docs/CHANGELOG_AI.zh-CN.md`

**Scope guard:**
- No new Blog feature was added.
- No Blog content source structure or published article body content was changed.
- No Console / CLI command system changes were made.
- No window-system behavior changes were made.
- No Projects or Profile core logic was changed.
- No deployment, Docker, Nginx, or environment configuration was changed.
- No database, CMS, third-party search service, comments, reading views, likes, or analytics were added.

**Verification:**
- `pnpm lint` passed.
- `pnpm build` passed.
- Local standalone route checks passed for `/`, `/blog`, `/blog/search`, `/blog/tags`, `/blog/tags/developer-os`, `/blog/series`, `/blog/series/personal-developer-os`, `/blog/why-rebuild-my-personal-blog`, `/projects`, `/projects/personal-developer-os`, `/projects/ai-agent-demo`, `/sitemap.xml`, `/rss.xml`, and `/robots.txt`.
- Sitemap contains `/blog/search`, `/blog/tags`, `/blog/tags/developer-os`, `/blog/series`, `/blog/series/personal-developer-os`, `/projects/personal-developer-os`, and `/projects/ai-agent-demo`.
- RSS contains published Blog posts and does not contain `/blog/search`, `/blog/tags`, `/blog/series`, or `/projects`.

### 2026-06-13 - Codex
**Summary:** Phase 9.4 completed. Added lightweight Blog Search at `/blog/search`.

**Phase 9.4 scope:**
- Added the public `/blog/search` route with SEO metadata.
- Search data is loaded through `BlogService.getPublishedPosts()`, so only published posts are included.
- Added a focused client search page that keeps only query state in the browser and filters server-provided post metadata.
- Search matches `title`, `summary`, `tags`, and `series`.
- Full article body content is intentionally not shipped to the client in this phase.
- Query matching is case-insensitive, trims leading/trailing spaces, and supports multiple terms separated by repeated spaces.
- Empty query shows recent posts; no-result query shows a lightweight empty state.
- Search results reuse `BlogCard`, so cards preserve the existing blog style and link to `/blog/[slug]`.
- Added a `/blog` search entry beside the existing tags and series entries.
- Added zh / en translation keys for search title, placeholder, hint, results, empty state, retry copy, and recent posts.
- Added `/blog/search` to `sitemap.xml`.
- RSS remains unchanged and blog-post-only.

**Scope guard:**
- No database, CMS, third-party search service, or server-side full-text index was added.
- Blog content source structure and published article body content were not changed.
- No Console / CLI command system changes were made.
- No window-system behavior changes were made.
- No deployment configuration changes were made.
- No Projects or Profile core logic was changed.
- No large dependencies were introduced.

**Verification:**
- `pnpm lint` passed with zero warnings or errors.
- `pnpm build` passed. Static pages generated for `/blog/search`, `/blog/[slug]`, `/blog`, `/blog/series`, `/blog/tags`, `/projects`, `/sitemap.xml`, and `/rss.xml`.
- Local production route checks passed for `/`, `/blog`, `/blog/search`, `/blog/why-rebuild-my-personal-blog`, `/blog/series`, `/blog/series/personal-developer-os`, `/blog/tags`, `/projects`, `/sitemap.xml`, and `/rss.xml`.
- Sitemap contains `/blog/search`; RSS does not contain `/blog/search`.

### 2026-06-13 - Codex
**Summary:** Phase 9.3 completed. Added previous / next navigation for blog article detail pages.

**Phase 9.3 scope:**
- Added `BlogAdjacentPosts` and `BlogService.getAdjacentPosts(slug)` for public article navigation.
- Series articles now resolve adjacent posts through published `getPostsBySeries(seriesSlug)` results, preserving `seriesOrder` reading order.
- If series entries lack `seriesOrder`, the existing series sorting falls back to ascending post date.
- Non-series articles fall back to global published-post date order.
- Draft posts are excluded from adjacent navigation.
- Added `components/blog/BlogAdjacentNav.tsx` and rendered it after the article body on `/blog/[slug]`, before related project links.
- The first series article shows only the next post, middle articles show previous and next, and the last article shows only the previous post.
- Desktop renders adjacent navigation in two columns; mobile stacks the cards vertically without affecting the fixed floating TOC.
- Added zh / en translation keys for previous, next, continue-series, back-to-blog, and no-adjacent labels.

**Scope guard:**
- Sitemap and RSS were not changed.
- Article URLs and metadata were not changed.
- Blog series pages and tag pages were not changed.
- No Console / CLI command system changes were made.
- No window-system behavior changes were made.
- No deployment configuration changes were made.
- No Projects or Profile core logic was changed.
- No large dependencies were introduced.

**Verification:**
- `pnpm lint` passed with zero warnings or errors.
- `pnpm build` passed. Static pages generated for `/blog/[slug]`, `/blog`, `/blog/series`, `/blog/tags`, `/projects`, `/sitemap.xml`, and `/rss.xml`.
- Local production route checks passed for `/`, `/blog`, `/blog/why-rebuild-my-personal-blog`, `/blog/series`, `/blog/series/personal-developer-os`, `/blog/tags`, `/projects`, `/sitemap.xml`, and `/rss.xml`.

### 2026-06-12 - Codex
**Summary:** Phase 9.2-fix-2 completed. Converted the desktop Article TOC into a fixed floating sidebar.

**Phase 9.2-fix-2 scope:**
- Replaced the desktop article TOC's sticky sidebar with a true `position: fixed` floating sidebar on `/blog/[slug]`.
- Fixed the TOC to the left side of the viewport with top and bottom offsets so it stays visible while the article scrolls.
- Removed sticky positioning from `ArticleToc`; the component now focuses on TOC rendering, internal scrolling, and active heading state.
- Added desktop left-side spacing around the article content so the fixed TOC does not cover the reading column.
- Kept the existing mobile in-flow TOC and hid the fixed sidebar below the wide desktop breakpoint to avoid horizontal overflow.
- Preserved active heading highlighting, semibold active text, h2 / h3 indentation, and TOC anchor jumping.
- Kept light / dark and macos / vercel preset compatibility through the existing style tokens.

**Scope guard:**
- TOC generation logic was not rewritten.
- BlogService, BlogRepository, and `content/blog` structure were not changed.
- Blog article body content was not modified.
- Sitemap and RSS were not changed.
- No Console / CLI command system changes were made.
- No window-system behavior changes were made.
- No deployment configuration changes were made.
- No Projects or Profile core logic was changed.
- No large dependencies were introduced.

### 2026-06-12 - Codex
**Summary:** Phase 9.2-fix completed. Improved Article TOC layout and active reading state.

**Phase 9.2-fix scope:**
- Moved desktop article TOC from the article-top block to a left sidebar on `/blog/[slug]`.
- Added a `contentWidth="wide"` option to `BlogLayout` for article detail pages only; list, series, tags, and project pages keep their existing layouts.
- Added `components/blog/ArticleToc.tsx` as a focused Client Component for sticky TOC display and active heading state.
- Desktop TOC uses sticky positioning, bounded viewport height, and internal overflow scrolling for long TOCs.
- Mobile keeps the existing in-flow TOC before the article body to avoid forced sidebars and horizontal overflow.
- Active heading detection uses `IntersectionObserver` against the blog scroll container, with a lightweight scroll fallback.
- Active TOC items are highlighted and rendered with semibold text; h2 / h3 indentation remains visible.
- TOC links continue to use the stable heading ids generated by Phase 9.2.
- TOC styling reuses existing style tokens and supports light / dark plus macos / vercel presets.

**Scope guard:**
- TOC generation logic was not rewritten.
- BlogService, BlogRepository, and `content/blog` structure were not changed.
- Blog article body content was not modified.
- Sitemap and RSS were not changed.
- No Console / CLI command system changes were made.
- No window-system behavior changes were made.
- No deployment configuration changes were made.
- No Projects or Profile core logic was changed.
- No large dependencies were introduced.

### 2026-06-12 - Codex
**Summary:** Phase 9.2 completed. Added automatic Article TOC for blog detail pages.

**Phase 9.2 scope:**
- Added `lib/blog/toc.ts` with stable heading slug generation, duplicate-id handling, and Markdown TOC extraction.
- Extracted TOC items from Markdown `h2` / `h3` headings only.
- Ignored fenced code blocks during TOC extraction so code examples containing `#` are not treated as headings.
- Updated Markdown rendering so article `h2` / `h3` headings receive stable `id` attributes matching the TOC.
- Added `BlogTocItem` type to `lib/blog/blog-types.ts`.
- Passed TOC data through `/blog/[slug]` server and client components into `BlogArticle`.
- Rendered a lightweight in-flow TOC section on article detail pages when at least 2 supported headings exist.
- Added localized TOC copy for zh / en in `lib/translations.ts`.
- Added `scroll-margin-top` for article headings to keep anchor jumps readable.

**Scope guard:**
- Active heading highlighting was not implemented in this phase.
- Sitemap and RSS were not changed.
- No Console / CLI command system changes were made.
- No window-system behavior changes were made.
- No deployment configuration changes were made.
- No blog article body content or content source structure was changed.
- No Projects or Profile core logic was changed.
- No large dependencies were introduced.

**Verification:**
- `pnpm lint` passed with zero warnings or errors.
- `pnpm build` passed. Static pages generated for `/blog/[slug]`, `/blog`, `/blog/series`, `/blog/tags`, `/projects`, `/sitemap.xml`, and `/rss.xml`.

### 2026-06-12 - Claude Code
**Summary:** Phase 9.1 completed. Added Blog Tag Pages for browsing published posts by topic.

**Phase 9.1 scope:**
- Added `BlogTag` type to `lib/blog/blog-types.ts` with `name`, `slug`, `count`, and `latestUpdatedAt` fields.
- Added `tagToSlug()` utility in `lib/blog/tag-slug.ts` for stable tag-to-slug conversion (e.g., "Next.js" → "next-js", "AI Agent" → "ai-agent").
- Extended `BlogRepository` interface with `getAllTagsDetailed()` returning `BlogTag[]`.
- Implemented `getAllTagsDetailed()` in `FileBlogRepository` with count aggregation and latest-updated-at tracking. Tags are sorted by count descending, then name ascending.
- Extended `BlogService` with `getAllTagsDetailed()`, `getTagBySlug(tagSlug)`, and `getPostsByTagSlug(tagSlug)` methods.
- Added public tag listing page at `/blog/tags` with tag name, post count, latest updated date, and links to tag detail pages.
- Added public tag detail page at `/blog/tags/[tagSlug]` with tag name, post count, and the list of published posts under that tag.
- Added `generateStaticParams` for tag detail pages, generating all tag slugs from published posts.
- Added `generateMetadata` for both tag listing and tag detail pages using `buildMetadata` from `lib/seo.ts`.
- Tag pages use `notFound()` when a tag slug does not match any published tag.
- Added "View tags" / "查看标签" entry link on the `/blog` page (next to the existing "View series" link).
- Made tags clickable in `BlogCard` and `BlogArticle` components, linking to `/blog/tags/[tagSlug]`. Tags use `stopPropagation` in `BlogCard` to avoid triggering the parent card link.
- Added 12 new translation keys for tag pages in both `zh` and `en` (tagTitle, tagSubtitle, viewTags, tagCount, tagPosts, tagLatest, tagOpen, backToTags, tagEmpty, tagDetailSubtitle).
- Added `/blog/tags` index and all `/blog/tags/[tagSlug]` detail pages to `sitemap.xml`.
- RSS remains blog-article-only and does not include tag pages.
- Draft posts do not appear in tag pages.

**Files changed:**
- `lib/blog/blog-types.ts` — added `BlogTag` interface
- `lib/blog/tag-slug.ts` — new: `tagToSlug()` and `buildTagSlugMap()`
- `lib/blog/blog-repository.ts` — added `getAllTagsDetailed()` to interface
- `lib/blog/file-blog-repository.ts` — implemented `getAllTagsDetailed()`
- `lib/blog/blog-service.ts` — added `getAllTagsDetailed()`, `getTagBySlug()`, `getPostsByTagSlug()`
- `lib/blog/index.ts` — added `tagToSlug` export
- `lib/translations.ts` — added 12 tag-related translation keys for zh and en
- `app/blog/tags/page.tsx` — new: tag listing page
- `app/blog/tags/BlogTagListPageClient.tsx` — new: client wrapper for tag listing
- `app/blog/tags/[tagSlug]/page.tsx` — new: tag detail page with static params and metadata
- `app/blog/tags/[tagSlug]/BlogTagDetailPageClient.tsx` — new: client wrapper for tag detail
- `components/blog/BlogTagList.tsx` — new: tag listing component
- `components/blog/BlogTagPage.tsx` — new: tag detail component
- `components/blog/index.ts` — added `BlogTagList` and `BlogTagPage` exports
- `components/blog/BlogList.tsx` — added "View tags" link with `Tags` icon
- `components/blog/BlogCard.tsx` — tags are now clickable links to `/blog/tags/[tagSlug]`
- `components/blog/BlogArticle.tsx` — tags are now clickable links to `/blog/tags/[tagSlug]`
- `app/sitemap.ts` — added `/blog/tags` and all tag detail pages
- `docs/IMPLEMENTATION_PLAN.md` — updated Phase 9 status
- `docs/CHANGELOG_AI.md` — this entry
- `docs/CHANGELOG_AI.zh-CN.md` — Chinese companion entry

**Scope guard:**
- No Console / CLI command system changes were made.
- No window-system behavior changes were made.
- No deployment configuration changes were made.
- No blog article body content was modified.
- No blog content source structure was changed.
- No Projects or Profile core logic was changed.
- No database, CMS, search, comments, or Agent API was added.
- No large dependencies were introduced.

**Verification:**
- `pnpm lint` passed with zero warnings or errors.
- `pnpm build` passed. Static pages generated for `/blog/tags`, all 18 tag detail pages, `/blog/series`, `/blog`, `/blog/[slug]`, `/projects`, and `/`.
- Sitemap contains `/blog/tags`, `/blog/tags/[tagSlug]` for all 18 tags, series pages, project pages, and blog post pages.
- RSS does not contain tag pages.
- Tag slug generation produces stable slugs: "Next.js" → "next-js", "Developer OS" → "developer-os", "Vibe Coding" → "vibe-coding", etc.

### 2026-06-12 - Codex
**Summary:** Phase 8.6 completed. Final acceptance and closure for Phase 8 Content & Career Launch.

**Phase 8.6 acceptance scope:**
- Completed final review for Phase 8.
- Confirmed Blog content work is complete for the current phase:
  - Seven published articles in the `从 Hexo 到 Personal Developer OS` series.
  - Series pages and article detail pages are available.
  - Article detail pages include reading stats and related project links where applicable.
- Confirmed Projects portfolio work is complete for the current phase:
  - `Personal Developer OS` project case study is published and linked to the related blog series.
  - `AI Agent Demo` remains positioned as an in-progress learning project, not a mature production product.
  - Projects are loaded through the file-based ProjectService architecture.
- Confirmed Profile / Contact career-conversion work is complete for the current phase:
  - Profile / Contact Channels / System Stack are loaded through ProfileService.
  - Career Snapshot remains merged into Profile.
  - Contact stays privacy-friendly and does not expose private channels.
- Confirmed bilingual Content Workflow documentation is complete and linked from README / docs index.
- Confirmed sitemap, RSS, and robots outputs are available and aligned with published-only content rules.
- Confirmed public content does not include real resume PDF, phone number, WeChat ID, address, real employer names, real client names, buyer names, deployment secrets, or fabricated metrics.
- Updated `docs/IMPLEMENTATION_PLAN.md` to mark Phase 8 and Phase 8.6 as completed and add Phase 9 as planned.

**Scope guard:**
- No Console / CLI command system changes were made.
- No window-system behavior changes were made.
- No deployment configuration changes were made.
- No Blog, Projects, or Profile core logic changes were made.
- No new feature, CMS, database, admin, search, comments, online chat, or Agent API was added.

**Verification:**
- `pnpm build` passed.
- Local standalone route checks passed for `/`, `/blog`, `/blog/series`, `/blog/series/personal-developer-os`, `/blog/why-rebuild-my-personal-blog`, `/projects`, `/projects/personal-developer-os`, `/projects/ai-agent-demo`, `/sitemap.xml`, `/rss.xml`, and `/robots.txt`.
- Sitemap contains the published blog series and project pages.
- RSS contains published blog posts and does not contain project pages.
- Robots output points to sitemap.
- `pnpm lint` passed.
- `pnpm build` passed after documentation updates.

### 2026-06-12 - Codex
**Summary:** Phase 8.5 completed. Added bilingual Blog / Projects / Profile content workflow documentation.

**Phase 8.5 scope:**
- Added `docs/CONTENT_WORKFLOW.md`.
- Added `docs/CONTENT_WORKFLOW.zh-CN.md`.
- Documented content maintenance workflows for:
  - Blog content under `content/blog`
  - Project content under `content/projects`
  - Profile content under `content/profile`
- Documented frontmatter fields and public-output behavior for `published`, `draft`, `featured`, `order`, `seriesSlug`, and `seriesOrder`.
- Documented local validation, commit workflow, production deployment, sitemap / RSS checks, privacy rules, and future CMS / DB repository migration direction.
- Added documentation entry links in `README.md` and `docs/README.zh-CN.md`.
- Updated `docs/IMPLEMENTATION_PLAN.md` to mark Phase 8.5 as completed and add Phase 8.6 as the next planned review phase.

**Scope guard:**
- No Console / CLI command system changes were made.
- No window-system behavior changes were made.
- No deployment configuration changes were made.
- No Blog, Projects, or Profile core logic changes were made.
- No private contact information or real resume PDF was added.

**Verification:**
- `pnpm lint` passed.
- `pnpm build` passed.

### 2026-06-12 - Codex
**Summary:** Phase 8.4.4 completed. Final acceptance for About / Profile / Contact / System Stack and closed Phase 8.4.

**Phase 8.4.4 acceptance scope:**
- Completed final acceptance for About / Profile / Contact / System Stack.
- Confirmed Career Snapshot / Resume Summary remains merged into Profile and is not shown as an independent homepage module.
- Confirmed Profile / Contact Channels / System Stack are all loaded through `ProfileService`.
- Confirmed Main App tabs support bilingual labels through `lib/translations.ts`.
- Confirmed `content/profile` includes non-rendered maintenance comments for field-to-frontend mapping.
- Confirmed the full resume is available on request only; no real resume PDF was uploaded or linked.
- Confirmed phone number, WeChat ID, address, birthday, ID number, real employer names, real client names, buyer names, and sensitive project details are not publicly displayed.
- Confirmed unit / client / buyer information remains anonymized.

**Small fix:**
- Added focused Contact CTA entries for `/projects/personal-developer-os` and `/projects/ai-agent-demo` in `content/profile/contact-channels.md`.
- Kept Contact privacy-friendly and did not add private email, phone, WeChat, address, or resume PDF links.

**Scope guard:**
- No Console / CLI command system changes were made.
- No window-system behavior changes were made.
- No deployment configuration changes were made.
- No Blog core logic changes were made.
- No Projects core logic changes were made.
- No ProfileService or PublicProfile shape changes were made.

**Verification:**
- `pnpm lint` passed.
- `pnpm build` passed.
- Local route checks passed for `/`, `/projects`, `/projects/personal-developer-os`, `/projects/ai-agent-demo`, `/blog`, `/blog/series`, `/blog/series/personal-developer-os`, `/sitemap.xml`, and `/rss.xml`.

### 2026-06-12 - Codex
**Summary:** Phase 8.4.3-fix completed. Polished Profile i18n and documented Profile content-to-frontend mapping.

**Phase 8.4.3-fix scope:**
- Fixed Main App labels that were English-only in Chinese mode.
- Localized the Main App labels through the existing `lib/translations.ts` i18n system:
  - Overview / 概览
  - Profile / 个人档案
  - Stack / 技术栈
  - Services / 服务
  - Logs / 日志
  - Contact / 联系
- Added non-rendered HTML maintenance comments to `content/profile/profile.md` explaining the mapping between frontmatter fields, Markdown body, and current frontend modules.
- Clarified that `summary` is currently reserved as content metadata / CMS preview / future card or SEO summary text and is not directly rendered on the homepage.
- Clarified that Career Snapshot remains merged into Profile and is not restored as a standalone module.
- Added maintenance comments to `content/profile/contact-channels.md` and `content/profile/system-stack.md`.

**Scope guard:**
- No Console / CLI command system changes were made.
- No window-system behavior changes were made.
- No deployment configuration changes were made.
- No Blog core logic changes were made.
- No Projects core logic changes were made.
- No ProfileService or PublicProfile shape changes were made.

**Verification:**
- `pnpm lint` passed.
- `pnpm build` passed.

### 2026-06-12 - Codex
**Summary:** Phase 8.4.3-fix completed. Merged Career Snapshot into the Profile section to remove repeated public-facing content.

**Phase 8.4.3-fix scope:**
- Removed the independent Career Snapshot / Resume Summary module from the homepage Main App.
- Kept Profile as the unified public personal profile entry.
- Merged the required career information into Profile:
  - Java backend background
  - AI Agent / TypeScript full-stack direction
  - anonymized enterprise-system experience
  - active project direction
  - career direction
  - resume privacy note
- Renamed the profile content source:
  - from `content/profile/career-snapshot.md`
  - to `content/profile/profile.md`
- Updated Profile repository/service semantics:
  - `getProfile()`
  - `getContactChannels()`
  - `getSystemStack()`
  - `getPublicProfile()`
- Removed UI translation keys for the deleted Career Snapshot module.
- Preserved System Stack and Contact Channels as separate profile-backed sections.

**Privacy guard:**
- No real resume PDF was uploaded.
- No real resume download link was added.
- No phone number, WeChat ID, address, birthday, ID number, real employer name, real client name, buyer name, or sensitive project details were added.
- Enterprise experience remains anonymized.

**Scope guard:**
- No Console / CLI behavior changes were made.
- No window-system behavior changes were made.
- No deployment configuration changes were made.
- No Blog core logic changes were made.
- No Projects core logic changes were made.

**Verification:**
- `pnpm lint` passed.
- `pnpm build` passed.

### 2026-06-12 - Codex
**Summary:** Phase 8.4.2 completed. Established a file-based Profile content system for career, contact, and stack content.

**Phase 8.4.2 scope:**
- Added `content/profile` as the file-based public profile content source.
- Added Profile Markdown files:
  - `content/profile/profile.md`
  - `content/profile/contact-channels.md`
  - `content/profile/system-stack.md`
- Added Profile repository architecture:
  - `lib/profile/profile-types.ts`
  - `lib/profile/profile-repository.ts`
  - `lib/profile/file-profile-repository.ts`
  - `lib/profile/profile-service.ts`
  - `lib/profile/index.ts`
- Homepage `app/page.tsx` now reads `PublicProfile` through `ProfileService`.
- Main App receives server-provided profile content and passes it into:
  - About / Profile section
  - System Stack section
  - Contact Channels section
- Removed the transitional hardcoded `lib/profile.ts` data file and replaced it with the repository-backed `lib/profile` module directory.
- Preserved the existing Developer OS UI structure while moving career/contact/stack content out of components.
- Kept future CMS / database / admin replacement path open through the repository boundary.

**Privacy guard:**
- No real resume PDF was uploaded.
- No real resume download link was added.
- No phone number, WeChat ID, address, birthday, ID number, real employer name, real client name, buyer name, or sensitive project details were added.
- Enterprise experience is described with anonymized project categories such as bidding, e-procurement, supplier management, expert management, procurement planning, and enterprise system integration.

**Scope guard:**
- No Console / CLI behavior changes were made.
- No window-system behavior changes were made.
- No deployment configuration changes were made.
- No Blog repository or core logic changes were made.
- No Project repository or core logic changes were made.
- No database, CMS, admin page, online editor, Agent API, fake metrics, or fabricated experience was added.

**Verification:**
- `pnpm lint` passed.
- `pnpm build` passed.

### 2026-06-11 - Codex
**Summary:** Phase 8.4.1 completed. Optimized the About / Profile content structure for career-facing positioning.

**Phase 8.4.1 scope:**
- Optimized the homepage About / Profile section content structure.
- Clarified the personal positioning as a Java backend developer transitioning into AI Agent and TypeScript full-stack development.
- Added concise bilingual content for:
  - current focus
  - enterprise-system background
  - what is being built
  - work style
  - career direction
- Added real entry links from About to:
  - `Personal Developer OS` project: `/projects/personal-developer-os`
  - `AI Agent Demo` project: `/projects/ai-agent-demo`
  - Blog: `/blog`
  - `Personal Developer OS` series: `/blog/series/personal-developer-os`
- Extracted the main About content into `lib/profile.ts` as centralized bilingual profile data.
- Kept UI restrained inside the existing Developer OS / Main App card style.

**Scope guard:**
- No Console / CLI behavior changes were made.
- No window-system behavior changes were made.
- No deployment configuration changes were made.
- No Blog core logic changes were made.
- No Projects core logic changes were made.
- No Resume download, database, CMS, Agent API, online chat, fake metrics, or fabricated experience was added.

**Verification:**
- `pnpm lint` passed.
- `pnpm build` passed.

### 2026-06-11 - Codex
**Summary:** Phase 8.3.5 completed. Final acceptance and documentation closure for the Projects showcase.

**Phase 8.3.5 acceptance scope:**
- Completed final acceptance for the Phase 8.3 Projects showcase work.
- Confirmed Projects use the file-based content source under `content/projects/**/*.md`.
- Confirmed Projects data access flows through `ProjectService` / `FileProjectRepository`.
- Confirmed `/projects` and `/projects/[slug]` are backed by published project metadata/content.
- Confirmed homepage Projects cards use server-provided project metadata.
- Confirmed project ordering keeps `Personal Developer OS` before `AI Agent Demo`.
- Confirmed `Personal Developer OS` presents:
  - Production / v1.0 status
  - Developer OS homepage concept
  - Main App / Console App / Desktop / Status Bar
  - CLI, Markdown Blog, Blog Series, SEO, sitemap, robots, RSS
  - Docker / Nginx / HTTPS self-hosted deployment
  - related `personal-developer-os` blog series
- Confirmed `AI Agent Demo` remains an honest `In Progress / Learning Project` and does not claim mature production usage.
- Confirmed Projects and Blog linkage works:
  - Project detail to related series
  - Blog series to related project
  - Blog article to related project
- Confirmed sitemap includes published project pages.
- Confirmed RSS remains blog-article-only and does not include project pages.

**Small fixes:**
- Homepage project cards now always show the case-study entry even when a project has no extra links.
- Removed the generic `/blog` link from `AI Agent Demo` until a real AI Agent blog series exists.

**Scope guard:**
- No Console / CLI changes were made.
- No window-system behavior changes were made.
- No deployment configuration changes were made.
- No blog article body content was modified.
- No database, CMS, search, online chat, or real Agent API was added.
- No fabricated project results, production users, traffic, revenue, or enterprise adoption were added.

**Verification:**
- `pnpm lint` passed.
- `pnpm build` passed.

### 2026-06-10 - Codex
**Summary:** Phase 8.3.4 completed. Added lightweight Projects and Blog content linkage.

**Phase 8.3.4 scope:**
- Added Project-to-Blog linkage on project detail pages:
  - `Personal Developer OS` resolves `relatedSeriesSlug: personal-developer-os` through `BlogService`.
  - The project detail page now shows related writing, the series title, article count, a series page link, and series article links.
- Added Blog Series-to-Project linkage:
  - Blog series detail pages query published projects through `ProjectService.getProjectsByRelatedSeries(seriesSlug)`.
  - `/blog/series/personal-developer-os` can show `Personal Developer OS` as the related project entry.
- Added Blog Article-to-Project linkage:
  - Blog article detail pages query related projects by the article `seriesSlug`.
  - Articles in the `personal-developer-os` series can show a lightweight related project link.
- Added centralized translation keys for related writing, related project, related series, project detail links, series article labels, and coming-soon copy.
- Kept `AI Agent Demo` without fabricated blog links because no published AI Agent learning series exists yet.

**Scope guard:**
- No blog article body content was modified.
- No nonexistent blog slugs were added.
- No sitemap or RSS logic was modified.
- No Console / CLI changes were made.
- No window-system behavior changes were made.
- No deployment configuration changes were made.
- No database, CMS, comments, project search, blog search, tag page, online chat, or real Agent API was added.

**Verification:**
- `pnpm lint` passed.
- `pnpm build` passed.

### 2026-06-10 - Codex
**Summary:** Phase 8.3.3 completed. Strengthened the AI Agent Demo project content for career-facing Agent learning showcase.

**Phase 8.3.3 scope:**
- Updated `content/projects/ai-agent-demo/index.md`.
- Clarified `AI Agent Demo` as an `In Progress / Learning Project`, not a mature production product.
- Repositioned the project as an AI Agent learning project for enterprise knowledge base and business workflow understanding.
- Strengthened the Java backend-to-AI Agent background:
  - enterprise system development
  - bidding / supplier / expert / procurement workflow scenarios
  - documents, interfaces, requirements communication, delivery context, and business process understanding
- Expanded the learning route around:
  - TypeScript
  - LangChain.js
  - LangGraph.js
  - Zod
  - Prompt Messages
  - Structured Output
  - Intent Classifier
  - Tool Calling
  - Agent Executor
  - RAG
  - Agent State
  - Persistence
  - future MCP / OAuth / enterprise system integration
- Kept `relatedPosts` empty because no published AI Agent learning series exists yet.
- Preserved `slug: ai-agent-demo`, `published: true`, `featured: true`, and `order: 2`.

**Scope guard:**
- No ProjectService or FileProjectRepository changes were made.
- No Projects UI changes were made.
- No Blog system changes were made.
- No Console / CLI changes were made.
- No window-system behavior changes were made.
- No deployment configuration changes were made.
- No database, CMS, online chat, real Agent API, RAG online demo, or fabricated project outcomes were added.

**Verification:**
- `pnpm lint` passed.
- `pnpm build` passed.

### 2026-06-10 - Codex
**Summary:** Phase 8.3.2-fix completed. Refactored Projects data into a file-based content source.

**Phase 8.3.2-fix scope:**
- Moved Projects content out of code configuration and into `content/projects/**/*.md`.
- Added Markdown files:
  - `content/projects/personal-developer-os/index.md`
  - `content/projects/ai-agent-demo/index.md`
- Added Project content architecture:
  - `ProjectRepository`
  - `FileProjectRepository`
  - `ProjectService`
- Project metadata now comes from Markdown frontmatter and detail content comes from Markdown body.
- Project URLs now come from `frontmatter.slug`, not folder names.
- `FileProjectRepository` recursively scans `content/projects`, ignores non-Markdown files, filters unpublished projects from public pages, and throws on duplicate slugs.
- Reused the existing `/projects` and `/projects/[slug]` pages instead of rebuilding the UI.
- Homepage Projects now receives featured projects from `ProjectService`.
- Console `projects` command now uses server-provided project metadata from the same content source.
- `sitemap.xml` now gets published project pages through `ProjectService`.
- RSS remains blog-article-only.

**Scope guard:**
- No Console / CLI behavior was modified.
- No window-system behavior was modified.
- No deployment configuration was modified.
- No blog core logic or existing blog article content was modified.
- No database, CMS, search, filters, online chat, or Agent API was added.
- No fabricated project metrics, users, production adoption, or commercial results were added.

**Verification:**
- `pnpm lint` passed.
- `pnpm build` passed.

### 2026-06-09 - Codex
**Summary:** Phase 8.3.2 completed. Added project case study pages for the portfolio showcase.

**Phase 8.3.2 scope:**
- Added the project list page `/projects`.
- Added `Personal Developer OS` case study page at `/projects/personal-developer-os`.
- Added `AI Agent Demo` case study page at `/projects/ai-agent-demo`.
- Extended the shared `Project` data model with stable `slug`, timeline, overview, problem/background, solution/design, architecture, development process, AI collaboration, challenges, learnings, related series, and future plans.
- Reused the same project data across the homepage Projects section, `/projects`, and `/projects/[slug]`.
- Added homepage Projects card entry points: `View case study` / `查看项目详情`.
- Project detail pages now include tech stack, background, engineering highlights, AI-assisted development notes, related posts, and future plans.
- Added project list/detail routes to `sitemap.xml`.
- Kept RSS limited to blog posts.

**Scope guard:**
- No Console / CLI logic was modified.
- No window-system behavior was modified.
- No deployment configuration was modified.
- No blog core logic or existing blog article content was modified.
- No database, CMS, search, filters, online chat, or Agent API was added.
- No fabricated project metrics, users, production adoption, or commercial results were added.

**Verification:**
- `pnpm lint` passed.
- `pnpm build` passed.

### 2026-06-09 - Codex
**Summary:** Phase 8.3.1 completed. Refactored Projects into a stronger career-facing portfolio module.

**Phase 8.3.1 scope:**
- Refactored project data from simple project cards into a richer portfolio structure:
  - `subtitle`
  - `type`
  - `statusLabel`
  - `highlights`
  - `features`
  - `role`
  - `links`
  - `relatedPosts`
  - `featured`
  - `order`
- Promoted `Personal Developer OS` to the first featured project.
- Added live site, GitHub, related series, and selected related article links for `Personal Developer OS`.
- Added `AI Agent Demo` as the second featured project and clearly positioned it as an in-progress learning / showcase project.
- Kept `Bidding System Platform` as supporting enterprise backend experience.
- Updated the Projects section UI to render featured portfolio cards with tech stacks, engineering notes, current scope, project roles, links, and related logs.
- Projects now better supports job-search portfolio presentation while staying inside the Main App / Developer OS model.

**Scope guard:**
- No Console / CLI logic was modified.
- No window-system behavior was modified.
- No deployment configuration was modified.
- No blog core logic or existing blog article content was modified.
- No project detail pages, search, filters, CMS, database, Agent API, or online chat feature was added.

**Verification:**
- `pnpm lint` passed.
- `pnpm build` passed.

### 2026-06-08 - Codex
**Summary:** Phase 8.2 fully completed. Archived the finished "从 Hexo 到 Personal Developer OS" blog series and reading experience work.

**Phase 8.2 final scope:**
- Published and polished the complete seven-article `从 Hexo 到 Personal Developer OS` series.
- Fixed long-form article reading scroll and added static word count / reading time metadata.
- Organized the series under `content/blog/personal-developer-os/`.
- Added published-only series discovery pages and sitemap entries.
- Confirmed `/blog`, `/blog/[slug]`, homepage Blog section, Console-provided blog metadata, sitemap, and RSS remain aligned through `BlogService`.

**Scope guard:**
- No Console / CLI logic was modified.
- No window-system behavior was modified.
- No deployment configuration was modified.
- No database, CMS, comments, search, reading views, or analytics were added.

**Verification:**
- `pnpm lint` passed.
- `pnpm build` passed.

### 2026-06-08 - Codex
**Summary:** Phase 8.2.4 completed. Organized blog content into a series directory and added public series pages.

**Phase 8.2.4 scope:**
- Moved the seven "从 Hexo 到 Personal Developer OS" articles into `content/blog/personal-developer-os/` with numbered filenames.
- Kept every public article URL unchanged by continuing to use `frontmatter.slug` for `/blog/[slug]`.
- Updated `FileBlogRepository` to recursively scan Markdown files under `content/blog`.
- Added series metadata fields to blog types and published series articles:
  - `seriesSlug`
  - `seriesOrder`
- Added published-only series query capabilities through `BlogRepository` / `BlogService`:
  - `getAllSeries()`
  - `getPostsBySeries(seriesSlug)`
- Added public series pages:
  - `/blog/series`
  - `/blog/series/[seriesSlug]`
- Added a lightweight `/blog` entry to the series index and linked article detail series chips to the series page.
- Added sitemap entries for the series index and series detail pages.
- Kept RSS article-only.

**Scope guard:**
- No reading views, comments, search, tag detail page, CMS, database, or analytics were added.
- No Console / CLI logic was modified.
- No window-system behavior was modified.
- No deployment configuration was modified.

**Verification:**
- `pnpm lint` passed.
- `pnpm build` passed.
- Local route checks passed for `/`, `/blog`, `/blog/[slug]`, `/blog/series`, `/blog/series/personal-developer-os`, `/sitemap.xml`, and `/rss.xml`.
- RSS still contains article items only.

### 2026-06-08 - Codex
**Summary:** Phase 8.2.3 completed. Fixed blog article reading scroll and added static reading stats.

**Phase 8.2.3 scope:**
- Fixed `/blog/[slug]` long-form article scrolling by giving `BlogLayout` an independent vertical scroll container.
- Preserved the global Developer OS `html/body overflow-hidden` behavior used by the homepage window system.
- Added static build-time reading stats to blog metadata:
  - `wordCount`
  - `readingTimeMinutes`
- Added `calculateReadingStats()` for Markdown body content. It strips common Markdown syntax, counts CJK characters plus English / numeric units, and estimates reading time as CJK / 450 + English / numeric units / 220 with a 1-minute minimum.
- Article detail pages now show localized stats:
  - zh: `约 X 分钟阅读 · Y 字`
  - en: `X min read · Y words`
- Blog list cards and the homepage Blog section show lightweight reading-time hints.

**Scope guard:**
- No reading views were added.
- No database, analytics service, comments, search, tag page, or series page was added.
- No Console / CLI logic was modified.
- No window-system behavior was modified.
- No deployment configuration was modified.

**Verification:**
- `pnpm lint` passed.
- `pnpm build` passed.

### 2026-06-08 - Codex
**Summary:** Phase 8.2.2 completed. Added the back half of the "从 Hexo 到 Personal Developer OS" article series.

**Phase 8.2.2 content scope:**
- Added four published Chinese blog articles under `content/blog`:
  - `building-cli-for-personal-developer-os` — Phase 4 Console App CLI implementation, command linkage, aliases, history, prompt, and AI command parsing deferral.
  - `visual-polish-and-responsive-design` — Phase 5 visual consistency, macos / vercel preset polish, light / dark refinements, mobile responsiveness, and restrained interaction feedback.
  - `markdown-blog-seo-rss-system` — Phase 6 Markdown blog architecture, BlogRepository / FileBlogRepository / BlogService layering, blog pages, homepage and Console data alignment, draft safety, SEO, sitemap, robots, RSS, and deployment prep.
  - `nextjs-docker-nginx-https-deployment` — Phase 7 self-hosted deployment with Next.js standalone, Docker, Docker Compose, Nginx reverse proxy, shared Docker network, `NEXT_PUBLIC_SITE_URL`, domain DNS, Let's Encrypt HTTPS, online SEO checks, renewal, rollback, and deployment documentation.
- The `从 Hexo 到 Personal Developer OS` series now has seven published articles.
- All four new articles use complete frontmatter with unique slugs, `published` status, `zh` language, and the shared series name.
- No old placeholder posts were present in `content/blog`, so none were deleted.

**Scope guard:**
- No blog-system code was modified.
- No BlogService, BlogRepository, FileBlogRepository, `/blog`, `/blog/[slug]`, sitemap / RSS, homepage Main App, Console / CLI, window-system, UI, Docker, Nginx, or deployment configuration changes were made.

**Verification:**
- `pnpm lint` passed.
- `pnpm build` passed.

### 2026-06-08 - Codex
**Summary:** Added Chinese documentation companions under `docs`, with special focus on the production deployment manual.

**Documentation scope:**
- Added `docs/README.zh-CN.md` as the Chinese docs entry point.
- Added `docs/DESIGN_BRIEF.zh-CN.md`.
- Added `docs/IMPLEMENTATION_PLAN.zh-CN.md`.
- Added `docs/DEVELOPMENT_RULES.zh-CN.md`.
- Added `docs/DEPLOYMENT.zh-CN.md`.
- Added `docs/CHANGELOG_AI.zh-CN.md`.

**Deployment documentation focus:**
- Rewrote the deployment guide in Chinese as an operational release manual.
- Highlighted that `NEXT_PUBLIC_SITE_URL` is required at both Docker build time and runtime.
- Documented the current Docker Compose topology: app service on the external `web-proxy` network, with Nginx proxying to `personal-dev-os:3000`.
- Added Chinese release, no-cache rebuild, log check, Nginx reload, certificate renewal, online validation, and rollback guidance.
- Corrected the English deployment guide to match the current `docker-compose.yml` network topology.

**Scope guard:**
- Documentation-only change.
- No application code, UI, blog system, Console / CLI, window system, or deployment config was changed.

**Verification:**
- Reviewed docs against `docker-compose.yml`, `Dockerfile`, `next.config.ts`, and `.env.example`.
- No lint/build run because this was documentation-only.

### 2026-06-08 - Claude Code
**Summary:** Phase 8.2.1 completed. Polished the first three blog articles in the "从 Hexo 到 Personal Developer OS" series to reduce AI-generated phrasing.

**Phase 8.2.1 scope:**
- Polished Chinese copy in three published blog articles:
  - `why-rebuild-my-personal-blog` — softened transitions, reduced template phrasing, made motivation narrative more personal.
  - `designing-personal-developer-os` — reduced "不是A，而是B" patterns, made design decision narrative feel less structured-product-pitch, more personal reflection.
  - `building-os-shell-and-main-app` — increased dev-log feel, reduced summarizing conclusions, kept phase-by-phase structure but with more natural transitions.
- Key changes across all three articles:
  - Removed overused AI patterns: "在这个过程中，我深刻认识到", "这不仅...更是...", "更重要的是", etc.
  - Reduced over-neat parallel structures and abstract buzzwords.
  - Kept technical expressions, phase names, component names, and project facts.
  - Preserved slug, date, updatedAt, status, lang, series frontmatter fields.
  - Made tone more like a real Java backend developer's development journal.

**Scope guard:**
- No blog-system code was modified.
- No Main App code was modified.
- No Console / CLI code was modified.
- No window-system code was modified.
- No UI or deployment configuration was modified.

**Verification:**
- `pnpm lint` passed.
- `pnpm build` passed.

### 2026-06-08 - Codex
**Summary:** Phase 8.2 completed. Established the first real blog content series for the Personal Developer OS.

**Phase 8.2 content scope:**
- Established the series `从 Hexo 到 Personal Developer OS`.
- Added three published Chinese blog articles:
  - `why-rebuild-my-personal-blog` — why the old Hexo blog was rebuilt into a new personal site.
  - `designing-personal-developer-os` — why the personal site uses the Developer OS product concept.
  - `building-os-shell-and-main-app` — Phase 1-3 implementation record from OS Shell to Main App modules.
- Replaced the previous short sample posts:
  - `building-personal-developer-os`
  - `ai-agent-learning-log`
- Kept all new posts under the same series with complete frontmatter, `published` status, `zh` language, and requested backdated publication dates.

**Scope guard:**
- No blog-system code was modified.
- No Main App code was modified.
- No Console / CLI code was modified.
- No window-system code was modified.
- No UI or deployment configuration was modified.

**Verification:**
- `pnpm lint` passed.
- `pnpm build` passed.

### 2026-06-08 - Codex
**Summary:** Phase 7 completed. Archived the production release and post-release operations for the Personal Developer OS.

**Phase 7 completed scope:**
- Completed production release on a self-owned Korea cloud server running CentOS 9.
- Deployed the Next.js standalone app with Docker and Docker Compose.
- Added Docker Nginx reverse proxy for public traffic.
- Brought `https://oli6666.top` online as the primary domain.
- Configured `www.oli6666.top` to redirect to `oli6666.top`.
- Configured Let's Encrypt HTTPS.
- Confirmed sitemap, robots, and RSS are available online.
- Confirmed production SEO outputs use `https://oli6666.top`.
- Archived server directory layout, update flow, logs, Nginx reload, certificate renewal, rollback, and online validation checklist in `docs/DEPLOYMENT.md`.

**Scope guard:**
- No business feature, UI, blog-system, Console / CLI, or window-system changes were added.
- No `.env.production`, certificate files, private keys, server IPs, or private deployment secrets were committed.

**Verification:**
- Production deployment was accepted by user review.
- `pnpm lint` passed.
- `pnpm build` passed.

### 2026-06-08 - Codex
**Summary:** Phase 7.2 deployment fix. Passed `NEXT_PUBLIC_SITE_URL` into Docker build args so public SEO outputs use the production origin.

**Fix details:**
- Added `ARG NEXT_PUBLIC_SITE_URL` and matching `ENV` in the Docker build stage before `pnpm build`.
- Changed Docker Compose build config to pass `NEXT_PUBLIC_SITE_URL` as a build arg.
- Kept `.env.production` and runtime `NEXT_PUBLIC_SITE_URL` support for the running standalone server.
- Updated deployment docs to explain build-time and runtime environment requirements, rebuild after `.env.production` changes, and no-cache rebuild commands.

**Scope guard:**
- No business feature, blog architecture, Console / CLI, window-system, or UI changes were made.

**Verification:**
- `pnpm lint` passed.
- `pnpm build` passed.
- Docker Compose runtime verification should be performed on the server because this workspace does not have Docker installed.

### 2026-06-08 - Codex
**Summary:** Phase 7.1.1 started. Added Docker self-hosting preparation for the Personal Developer OS on a CentOS 9 server.

**Phase 7.1.1 deliverables:**
- Added a multi-stage `Dockerfile` using Node LTS, Corepack, pnpm frozen lockfile install, `pnpm build`, and Next.js standalone runtime output.
- Added `.dockerignore` to keep dependencies, build outputs, git data, debug logs, and local env files out of the Docker build context while preserving `content/blog`.
- Added `docker-compose.yml` with the `personal-dev-os` service bound to `127.0.0.1:3000:3000`, `restart: unless-stopped`, and `.env.production` support for `NEXT_PUBLIC_SITE_URL`.
- Switched `next.config.ts` from static export to standalone output for Docker / Node server deployment.
- Included `content/blog` in Next output tracing so the Markdown-backed BlogService can read published posts inside the standalone container.
- Added `.npmrc` with hoisted pnpm linking so standalone tracing can complete reliably on Windows and in Docker.
- Added `public/.gitkeep` so the Docker runner can consistently copy the required `public` directory.
- Updated `.gitignore` to prevent committing `.env.production`.
- Updated `docs/DEPLOYMENT.md` with CentOS 9 + Docker Compose deployment steps, env setup, localhost checks, Nginx reverse-proxy notes, and rollback guidance.

**Scope guard:**
- No business feature, blog content, Console / CLI, window-system, or UI changes were added.
- Nginx configuration and HTTPS certificate setup remain deferred to Phase 7.2.

**Verification:**
- `pnpm lint` passed.
- `pnpm build` passed with standalone output.
- Standalone output includes `content/blog` Markdown files for the current `FileBlogRepository`.
- Local `docker build` could not run in this Windows workspace because the `docker` command is not installed.

### 2026-06-04 - Codex
**Summary:** Phase 6 completed. Final archive for the Blog Publishing System, SEO, RSS, sitemap, and deployment-readiness work.

**Phase 6 completed scope:**
- Phase 6.1 established the CMS-ready blog content architecture with `content/blog/*.md`, `BlogRepository`, `FileBlogRepository`, `BlogService`, and future DB / CMS repository swap points.
- Phase 6.2 added `/blog`, `/blog/[slug]`, Markdown rendering, blog page localization cleanup, published-only article routing, homepage Blog section alignment, article links, and the "View all logs" entry.
- Phase 6.3 connected Console `blog`, `logs`, and `articles` commands to the same server-provided published blog metadata used by `/blog` and the homepage.
- Phase 6.4 added site-wide metadata, homepage metadata, blog metadata, article metadata, `sitemap.xml`, `robots.txt`, and `rss.xml`.
- Phase 6.5 added `.env.example`, README, `docs/DEPLOYMENT.md`, production `NEXT_PUBLIC_SITE_URL` guidance, and deployment-prep checks.

**Architecture archive:**
- Current blog source: `content/blog/*.md`.
- Upper layers consume blog data through `BlogService`.
- `FileBlogRepository` remains the current storage implementation.
- Future CMS / DB upgrades should add or swap a repository implementation, such as `DbBlogRepository`, without rewriting page, Console, or SEO consumers.
- Public pages, homepage Blog section, Console blog commands, sitemap, and RSS all use published posts only.
- Draft posts do not appear in public pages, Console output, sitemap, RSS, static params, or public metadata.

**Files touched for final archive:**
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/DEVELOPMENT_RULES.md`
- `docs/CHANGELOG_AI.md`

**Verification:**
- `README.md`, `docs/DEPLOYMENT.md`, and `.env.example` are present and complete for Phase 6 deployment readiness.
- `pnpm lint` passed.
- `pnpm build` passed.
- Static export generated `/`, `/blog`, two published article pages, `/sitemap.xml`, `/robots.txt`, and `/rss.xml`.
- Sitemap and RSS contain the two published posts and do not contain `draft`.
- No CMS, DB, search, pagination, tag detail page, comments, analytics, Console/CLI core changes, or window-system changes were added.

### 2026-06-04 - Codex
**Summary:** Phase 6.5 completed. Added deployment-prep documentation and production configuration guidance for the Personal Developer OS.

**Phase 6.5 deliverables:**
- Added `.env.example` with `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.
- Added `README.md` with project positioning, tech stack, local commands, blog content location, BlogService architecture summary, environment variable notes, and deployment-doc link.
- Added `docs/DEPLOYMENT.md` with local development, local checks, static export notes, `NEXT_PUBLIC_SITE_URL` guidance, pre-deployment checklist, and platform-neutral deployment notes.
- Confirmed `lib/seo.ts` centralizes `siteUrl` from `process.env.NEXT_PUBLIC_SITE_URL` with `http://localhost:3000` fallback.
- Confirmed sitemap, robots, RSS, canonical URLs, and Open Graph URLs reuse the shared site URL config.
- Re-ran deployment-prep checks with `pnpm lint` and `pnpm build`.
- Rechecked public outputs for draft safety.
- Did not add business features, CMS, DB, search, comments, analytics, Console/CLI changes, or window-system changes.

**Files changed:**
- `.env.example`
- `README.md`
- `docs/DEPLOYMENT.md`
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/CHANGELOG_AI.md`

**Verification:**
- `pnpm lint` passed.
- `pnpm build` passed.
- Static export generated `/`, `/blog`, published article pages, `/sitemap.xml`, `/robots.txt`, and `/rss.xml`.
- Sitemap and RSS include the two published posts and do not contain `draft`.
- `BlogService.getPublishedPosts()` remains the source for homepage, `/blog`, sitemap, RSS, and Console blog metadata.
- `BlogService.getPublishedPostBySlug()` remains the published-only article lookup for public article pages and metadata.

### 2026-06-04 - Codex
**Summary:** Phase 6.4 completed. Added foundational SEO metadata and site discovery outputs for the Personal Developer OS and published blog system.

**Phase 6.4 deliverables:**
- Added centralized SEO config in `lib/seo.ts` with `siteName`, `siteUrl`, default title/description, author, `getAbsoluteUrl()`, and metadata helpers.
- Added site-wide metadata in `app/layout.tsx`: `metadataBase`, title template, default description, authors, creator, robots, Open Graph, and Twitter card.
- Added homepage metadata in `app/page.tsx`.
- Rebuilt `/blog` metadata around Engineering Logs.
- Expanded `/blog/[slug]` metadata to use `post.seoTitle || post.title`, `post.seoDescription || post.summary`, canonical URL, article Open Graph fields, published/modified time, and tags.
- Added `app/sitemap.ts` for `/`, `/blog`, and all published blog posts.
- Added `app/robots.ts` allowing public pages, reserving `/admin` and `/api/preview`, and pointing to `sitemap.xml`.
- Added `app/rss.xml/route.ts` for published-post RSS with absolute post URLs, summaries, dates, and categories.
- RSS and sitemap fetch posts through `BlogService.getPublishedPosts()`; article metadata uses `BlogService.getPublishedPostBySlug()`.
- Draft posts are excluded from sitemap, RSS, article static params, public article pages, and public metadata.
- Did not enter deployment, CMS, DB, search, comments, Console, CLI, or window-system work.

**Files changed:**
- `app/layout.tsx`
- `app/page.tsx`
- `app/blog/page.tsx`
- `app/blog/[slug]/page.tsx`
- `app/sitemap.ts`
- `app/robots.ts`
- `app/rss.xml/route.ts`
- `lib/seo.ts`
- `docs/DEVELOPMENT_RULES.md`
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/CHANGELOG_AI.md`

**Architecture impact:**
- Site URL is centralized through `NEXT_PUBLIC_SITE_URL` with a local fallback of `http://localhost:3000`; production deployments should set the real domain.
- Public SEO outputs remain layered through `BlogService` and do not read `content/blog` directly.
- Phase 6 remains in progress because deployment prep is still deferred.

**Verification:**
- `pnpm lint` passed.
- `pnpm build` passed.
- Static export generated `/sitemap.xml`, `/robots.txt`, and `/rss.xml`.
- UTF-8 XML parsing passed for sitemap and RSS.
- Sitemap and RSS contain the two published posts and do not contain `draft`.

### 2026-06-04 - Codex
**Summary:** Phase 6.3 completed. Console blog commands now use the same published Markdown blog metadata as `/blog` and the Main App Blog section.

**Phase 6.3 deliverables:**
- Passed `blogPosts` from `app/page.tsx` / `DeveloperOS` into `ConsoleApp`.
- Updated `executeCommand()` to accept a serializable command context with `lang` and `blogPosts`.
- Updated the `blog` command to render real `BlogPostMeta[]` entries: title, summary, date, tags, series, and `/blog/[slug]` route.
- Kept `logs` and `articles` aliases mapped to the same `blog` command output.
- Preserved existing command behavior for `help`, `clear`, `whoami`, `skills`, `projects`, `contact`, `resume`, `classic`, and `sudo hire me`.
- Removed the legacy `data/blogs.ts` mock file because no runtime consumers remained.
- Did not add CMS, DB, RSS, sitemap, search, pagination, terminal routing, or new open-post commands.

**Files changed:**
- `components/os/DeveloperOS.tsx`
- `components/console/ConsoleApp.tsx`
- `lib/commands.ts`
- `lib/types.ts`
- `docs/DEVELOPMENT_RULES.md`
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/CHANGELOG_AI.md`
- `data/blogs.ts` (removed)

**Architecture impact:**
- The Console now follows the same data flow as the homepage: Server Component reads via `BlogService`, client components receive serializable blog metadata, and command execution only consumes that context.
- Client components still do not import `fs`, `path`, `FileBlogRepository`, or `content/blog` directly.
- `commands.ts` does not read Markdown files and no longer imports legacy blog mock data.

**Verification:**
- `pnpm lint` passed.
- `pnpm build` passed.
- Local homepage and `/blog` responses both include the two published routes: `/blog/building-personal-developer-os` and `/blog/ai-agent-learning-log`.

### 2026-06-04 - Codex
**Summary:** Phase 6.2.2.2 completed. Fixed public draft visibility and blog-page localization gaps blocking Phase 6.2 acceptance.

**Phase 6.2.2.2 deliverables:**
- Updated `BlogRepository.getPostBySlug()` to accept lookup options with `includeDrafts`.
- Updated `FileBlogRepository.getPostBySlug()` so public lookups return `null` for non-published posts unless `includeDrafts: true` is explicitly requested.
- Updated `BlogService` with a public-safe `getPublishedPostBySlug()` method for blog pages.
- Updated `app/blog/[slug]/page.tsx` so the detail page and `generateMetadata()` both read published-only posts.
- Preserved `generateStaticParams()` as published-only.
- Rebuilt blog page UI copy to use centralized translation keys in `lib/translations.ts`.
- Updated `BlogLayout`, `BlogList`, `BlogCard`, `BlogArticle`, and blog not-found UI to consume translations instead of hardcoded visible copy and aria labels.
- Added `BlogNotFoundClient` so the not-found page also respects `zh / en` via `useSettings()`.
- Did not enter Phase 6.3 and did not modify the Console `blog` command.
- Verified `pnpm lint` and `pnpm build` both pass.

**Files changed:**
- `app/blog/BlogPageClient.tsx`
- `app/blog/[slug]/page.tsx`
- `app/blog/[slug]/BlogArticlePageClient.tsx`
- `app/blog/[slug]/not-found.tsx`
- `components/blog/BlogLayout.tsx`
- `components/blog/BlogList.tsx`
- `components/blog/BlogCard.tsx`
- `components/blog/BlogArticle.tsx`
- `components/blog/BlogNotFoundClient.tsx`
- `components/blog/index.ts`
- `lib/blog/blog-repository.ts`
- `lib/blog/blog-service.ts`
- `lib/blog/file-blog-repository.ts`
- `lib/translations.ts`
- `docs/CHANGELOG_AI.md`

**Architecture impact:**
- Public blog pages now use a published-only lookup path, preventing direct access to draft slugs and preventing draft metadata leakage from `generateMetadata()`.
- Repository layering is preserved; pages still do not read `content/blog` directly.
- Preview/admin-style draft access remains extensible through `includeDrafts: true`, but is not exposed through public pages.

**Follow-up notes:**
- Console `blog` command remains unchanged and still uses legacy mock data until Phase 6.3.
- Phase 6 remains in progress; do not mark it completed yet.

### 2026-06-04 - Codex
**Summary:** Phase 6.2.1 completed. Aligned the homepage Main App blog section with `BlogService` so it now renders the same published Markdown posts as `/blog`.

**Phase 6.2.1 deliverables:**
- Updated `app/page.tsx` to remain a Server Component and fetch published posts via `blogService.getPublishedPosts()`.
- Updated `components/os/DeveloperOS.tsx` to accept serializable `blogPosts` props from the server page and pass them into the Main App.
- Updated `components/main/MainApp.tsx` to pass real blog metadata into `BlogSection`.
- Rebuilt `components/main/BlogSection.tsx` to render `BlogPostMeta[]` instead of `data/blogs.ts`.
- Homepage blog cards now render published post metadata from `content/blog` through `BlogService`: title, summary, date, tags, series, and lang.
- Homepage blog cards now link to `/blog/[slug]` with Next.js `Link`.
- Preserved the existing Engineering Logs / Developer OS visual style while adding a localized empty state.
- Preserved the homepage `View all logs` entry linking to `/blog`.
- Left `data/blogs.ts` in place for backward compatibility because the Console `blog` command still depends on the legacy mock; that migration remains deferred to Phase 6.3.
- Verified `pnpm lint` and `pnpm build` both pass.

**Files changed:**
- `app/page.tsx`
- `components/os/DeveloperOS.tsx`
- `components/main/MainApp.tsx`
- `components/main/BlogSection.tsx`
- `lib/translations.ts`
- `docs/CHANGELOG_AI.md`

**Architecture impact:**
- Homepage Main App blog content now uses the same `BlogService -> FileBlogRepository -> content/blog` data flow as the `/blog` page.
- Client components still do not read `fs`, `path`, `FileBlogRepository`, or `content/blog` directly.
- The homepage no longer depends on `data/blogs.ts` for its blog list, eliminating the prior mismatch where `/blog` showed 2 published posts but the homepage still showed 4 mock entries.

**Follow-up notes:**
- Console `blog` command intentionally remains unchanged in this phase.
- Phase 6 remains in progress; do not mark it completed yet.

### 2026-06-03 — Claude Code
**Summary:** Phase 5 completed. Final acceptance and documentation archive for the entire Visual Polish phase.

**Phase 5 completed scope:**

**Phase 5.1 — Visual Consistency Audit & Fixes:**
- System Status Bar hover colors softened across all buttons.
- AppWindow maximized state retains border for visual hierarchy.
- AppWindow dark content background respects preset (macOS slate vs vercel transparent).
- MainAppNav WebKit scrollbar hidden for cross-browser consistency.
- Settings toggle hover backgrounds unified.

**Phase 5.2 — macOS / Vercel Preset Refinement:**
- macOS window background opacity increased (88% → 92%) for stronger glass window presence.
- macOS card and nested card opacity increased to fix excessive transparency.
- macOS window shadow strengthened in light mode for floating depth.
- Vercel card background changed to zinc-50/zinc-950 for subtle hierarchy.
- Vercel nested card changed to solid zinc-100/zinc-900 for flatter panel look.
- Both presets maintain clear visual identity through the same component set.

**Phase 5.3 — light / dark Theme Refinement:**
- macOS light card borders changed to `border-zinc-200/40` for visible boundaries.
- macOS dark nested card background increased to `bg-slate-950/70` for readability.
- Vercel dark borders upgraded to `border-zinc-700` for clearer panel edges.
- Vercel dark title bar changed to solid `bg-zinc-900` for crisper window chrome.

**Phase 5.4 — Responsive / Mobile Optimization:**
- Mobile-visible Portfolio/Console entry buttons added to System Status Bar.
- Console prompt shortened on mobile (`dev-os:~ $` vs full `visitor@dev-os:~ $`).
- AppWindow title bar uses `truncate` to prevent overflow.
- Hero title sizes use `sm:` breakpoints for mobile-safe font scaling.
- All grid layouts collapse to single column on mobile.

**Phase 5.5 — Motion & Interaction Feedback:**
- Window mount animation: subtle fade-in-scale (`os-window-enter`, 200ms).
- Active/inactive window transitions smoothed.
- Window control buttons: `hover:scale-110 active:scale-95`.
- Console output lines: framer-motion fade-in (120ms).
- Desktop icons: hover lift effect.
- Content cards: `hover:-translate-y-0.5 hover:shadow-md`.
- Global `active:scale-95` on all interactive buttons.
- `prefers-reduced-motion` fully supported via CSS media query and framer-motion auto-detection.

**Cross-phase invariants preserved:**
- No functional changes.
- No CLI command system changes.
- No window behavior logic changes.
- No new dependencies.
- `macos` / `vercel`, `light` / `dark`, `zh` / `en` all verified.
- Desktop / tablet / mobile all verified.
- Console docked and maximized states both verified.
- `pnpm lint` and `pnpm build` pass.

**Files changed in Phase 5 (cumulative):**
- `lib/stylePresets.ts`
- `app/globals.css`
- `components/os/AppWindow.tsx`
- `components/os/WindowControls.tsx`
- `components/os/SystemStatusBar.tsx`
- `components/os/Desktop.tsx`
- `components/console/ConsoleInput.tsx`
- `components/console/ConsoleOutput.tsx`
- `components/main/MainAppNav.tsx`
- `components/main/HeroOverview.tsx`
- `components/main/AboutSection.tsx`
- `components/main/SkillsSection.tsx`
- `components/main/ProjectsSection.tsx`
- `components/main/BlogSection.tsx`
- `components/main/ContactSection.tsx`
- `components/settings/ThemeToggle.tsx`
- `components/settings/LanguageToggle.tsx`
- `components/settings/StylePresetToggle.tsx`
- `docs/DEVELOPMENT_RULES.md`
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/CHANGELOG_AI.md`

**Design impact:**
- The Personal Developer OS now has a refined, consistent visual system across all four preset/theme combinations.
- Mobile experience is fully functional down to 360px.
- Subtle motion reinforces the OS feel without being distracting.
- Reduced-motion users experience a static but fully functional interface.

**Follow-up notes:**
- Phase 5 is now completed. Ready to proceed to Phase 6 (SEO & Deployment Prep) when explicitly requested.
- No further Phase 5 work unless critical visual bugs are found.

### 2026-06-03 — Claude Code
**Summary:** Phase 5.5 only. Added restrained motion and interaction feedback animations across the Personal Developer OS shell.

**Phase 5.5 deliverables:**

**Window animations:**
- Added `os-window-enter` CSS keyframe animation: subtle `opacity 0 → 1` + `scale(0.97) → scale(1)` + `translateY(6px) → 0`, 200ms ease-out.
- AppWindow outer container now uses `transition-[opacity,transform,box-shadow,border-radius] duration-300 ease-out` for smoother state transitions.
- Inactive window title bar now transitions `opacity` and `filter` (grayscale) over 300ms.

**Window control button feedback:**
- macOS traffic lights and Vercel control buttons: `hover:scale-110 active:scale-95` with `transition-all duration-150`.
- Replaces plain `transition-opacity` with tactile scale feedback.

**Console output animation:**
- New output lines fade in via framer-motion: `initial={{ opacity: 0, y: 3 }}` → `animate={{ opacity: 1, y: 0 }}`, 120ms ease-out.
- Existing lines (stable keys) do not re-animate.
- Keeps auto-scroll behavior intact.

**Desktop icon hover:**
- Added `group-hover:-translate-y-1` lift effect alongside existing `group-hover:scale-105`.
- Transition refined to `duration-200 ease-out`.

**Content card hover feedback:**
- Projects cards: `hover:-translate-y-0.5 hover:shadow-md hover:opacity-95`.
- Blog log entries: `hover:-translate-y-0.5 hover:shadow-md hover:opacity-95`.
- Contact channel cards: `hover:-translate-y-0.5`.
- About profile fields: `hover:-translate-y-0.5 hover:shadow-sm`.
- Skills modules: `hover:-translate-y-0.5 hover:shadow-sm`.
- All use `transition-all duration-200`.

**Interactive button feedback (global):**
- System Status Bar: all buttons (`Portfolio`, `Terminal`, `Theme`, `Lang`, `Style`) get `active:scale-95` + `transition-all duration-150`.
- MainAppNav: all nav items get `active:scale-95`.
- Settings toggles (ThemeToggle, LanguageToggle, StylePresetToggle): `active:scale-95`.
- HeroOverview CTA buttons: `active:scale-95`.

**Reduced motion support:**
- Global `@media (prefers-reduced-motion: reduce)` rule in `globals.css` disables all animations and transitions.
- Framer-motion automatically respects system reduced-motion preference.
- `.os-window-enter` and `.console-line-in` explicitly overridden to `animation: none` under reduced motion.

**Files changed:**
- `app/globals.css`
- `components/os/AppWindow.tsx`
- `components/os/WindowControls.tsx`
- `components/os/SystemStatusBar.tsx`
- `components/os/Desktop.tsx`
- `components/console/ConsoleOutput.tsx`
- `components/main/MainAppNav.tsx`
- `components/main/HeroOverview.tsx`
- `components/main/AboutSection.tsx`
- `components/main/SkillsSection.tsx`
- `components/main/ProjectsSection.tsx`
- `components/main/BlogSection.tsx`
- `components/main/ContactSection.tsx`
- `components/settings/ThemeToggle.tsx`
- `components/settings/LanguageToggle.tsx`
- `components/settings/StylePresetToggle.tsx`
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/CHANGELOG_AI.md`

**Design impact:**
- Window open/close/maximize now feels more like a real OS window appearing.
- Console output gains subtle life without slowing down command execution.
- Cards and buttons provide clearer tactile feedback on hover and click.
- All animations are under 250ms and do not block interaction.
- Reduced-motion users experience no animations.

**Follow-up notes:**
- Phase 5 remains in progress.
- No Phase 6 work has started.

### 2026-06-03 — Claude Code
**Summary:** Phase 5.4 only. Responsive and mobile optimization for the Personal Developer OS shell.

**Phase 5.4 deliverables:**

**System Status Bar mobile:**
- Added mobile-visible Portfolio/Console entry buttons (`flex md:hidden`) with compact `text-xs` styling — app launchers are no longer hidden on small screens.
- Left section gap tightened on mobile: `gap-3 sm:gap-5`.

**Console mobile:**
- Input prompt shortened on mobile (`sm:hidden`): `dev-os:~ $` instead of `visitor@dev-os:~ $`.
- Full prompt preserved on desktop (`hidden sm:inline`): `visitor@dev-os:~ $`.
- Output history prompt also shortened on mobile for consistency.
- Input field kept `flex-1` with `min-w-0` so it never pushes the prompt out of the container.

**AppWindow mobile:**
- Title bar text now uses `truncate` + `min-w-0` to prevent long window titles from breaking the title bar layout on small screens.
- Icon wrapper given `shrink-0` to prevent squishing.

**HeroOverview mobile:**
- macOS title: `text-3xl md:text-4xl` → `text-2xl sm:text-3xl md:text-4xl` — avoids oversized heading on 360px screens.
- Vercel title: `text-2xl md:text-3xl` → `text-xl sm:text-2xl md:text-3xl` — same treatment for minimal preset.

**Already-responsive areas verified:**
- MainAppNav: `overflow-x-auto` + `scrollbar-hide` enables horizontal scroll for nav tabs on mobile.
- Main content grids: `grid-cols-1 md:grid-cols-*` already collapses to single column on mobile.
- Contact endpoint labels: `hidden sm:block` hides API-style labels on mobile.
- Desktop icons: `sm:left-auto sm:right-8` keeps icons left-aligned on mobile to avoid overlap.
- Console dock height: `h-[240px] md:h-[300px]` is already mobile-first.

**Files changed:**
- `components/os/SystemStatusBar.tsx`
- `components/os/AppWindow.tsx`
- `components/console/ConsoleInput.tsx`
- `components/console/ConsoleOutput.tsx`
- `components/main/HeroOverview.tsx`
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/CHANGELOG_AI.md`

**Design impact:**
- 360px–430px screens no longer hide critical app entry points.
- Console prompt no longer squeezes the input field on narrow screens.
- Window titles no longer overflow the title bar on mobile.
- Desktop layout, Main App grids, and section cards remain single-column and readable on mobile.

**Follow-up notes:**
- Phase 5 remains in progress.
- No Phase 6 work has started.

### 2026-06-03 — Claude Code
**Summary:** Phase 5.3 only. Refined light / dark theme borders and backgrounds for clearer hierarchy and readability across both presets.

### 2026-06-03 — Claude Code
**Summary:** Phase 5.3 only. Refined light / dark theme borders and backgrounds for clearer hierarchy and readability across both presets.

**Phase 5.3 deliverables:**

**macOS light improvements:**
- Card border changed: `border-white/60` → `border-zinc-200/40` — cards now have visible boundaries against the light background instead of invisible white-on-white borders.
- Nested card border changed: `border-white/50` → `border-zinc-200/30` — nested panels now have subtle but visible edges.

**macOS dark improvements:**
- Nested card background opacity increased: `bg-slate-950/55` → `bg-slate-950/70` — fixes the most impactful readability issue where nested panels were nearly see-through in dark mode.
- Status bar background opacity increased: `dark:bg-black/50` → `dark:bg-black/60` — more solid toolbar feel in dark mode.

**Vercel dark improvements:**
- Card border changed: `dark:border-zinc-800` → `dark:border-zinc-700` — panel edges are now visible against dark backgrounds.
- Nested card border changed: `dark:border-zinc-800` → `dark:border-zinc-700` — nested panel edges clearer.
- Title bar background changed: `dark:bg-zinc-900/50` → `dark:bg-zinc-900` (solid) — title bar no longer semi-transparent, crisper window chrome.
- Title bar border changed: `dark:border-zinc-800` → `dark:border-zinc-700` — cleaner separation from window content.
- Status bar border changed: `dark:border-zinc-800` → `dark:border-zinc-700` — top bar separation more visible.

**Files changed:**
- `lib/stylePresets.ts`
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/CHANGELOG_AI.md`

**Design impact:**
- Light mode cards and nested panels now have visible boundaries, preventing the "white-on-white" invisible border problem.
- Dark mode nested panels are no longer distractingly transparent.
- Vercel dark mode window chrome (title bar, status bar, borders) is crisper and more structured.
- All four combinations (macOS+light, macOS+dark, vercel+light, vercel+dark) have improved visual hierarchy.

**Follow-up notes:**
- Phase 5 remains in progress. Further polish (e.g. individual section hover states, responsive micro-adjustments) may follow.
- No Phase 6 work has started.

### 2026-06-03 — Claude Code
**Summary:** Phase 5.2 only. Refined macOS and Vercel preset visual tokens for clearer style boundary and improved readability.

### 2026-06-03 — Claude Code
**Summary:** Phase 5.2 only. Refined macOS and Vercel preset visual tokens for clearer style boundary and improved readability.

**Phase 5.2 deliverables:**

**macOS preset polish:**
- Window background opacity increased: `bg-white/88` → `bg-white/92`, `dark:bg-slate-950/86` → `dark:bg-slate-950/90` — stronger window presence without losing glass character.
- Window shadow strengthened in light mode: `shadow-[0_8px_32px_rgba(0,0,0,0.08)]` → `shadow-[0_16px_48px_rgba(0,0,0,0.10)]` — better floating depth against the desktop.
- Content background opacity increased: `bg-white/[0.80]` → `bg-white/[0.92]` — content no longer affected by desktop background bleed-through.
- Card background opacity increased: `bg-white/[0.94]` → `bg-white/[0.98]` — crisper cards inside the window.
- Nested card background opacity increased: `bg-white/58` → `bg-white/75`, `dark:bg-slate-950/38` → `dark:bg-slate-950/55` — fixes the most impactful transparency issue where nested panels were nearly see-through.
- Card shadow softened: `shadow-[0_12px_30px_...]` → `shadow-[0_4px_16px_...]` — subtler depth, less visual noise.
- Status bar background opacity increased: `bg-white/60` → `bg-white/70` — more solid system toolbar feel.

**Vercel preset polish:**
- Card background changed: `bg-white dark:bg-black` → `bg-zinc-50 dark:bg-zinc-950` — creates subtle hierarchy against the window background (`bg-white dark:bg-black`).
- Nested card background changed: `bg-zinc-50 dark:bg-zinc-900/20` → `bg-zinc-100 dark:bg-zinc-900` — solid flat panels instead of semi-transparent layers.
- Window shadow refined: `shadow-sm` → `shadow-[0_1px_3px_rgba(0,0,0,0.06)]` — ultra-subtle depth, consistent with minimal tool aesthetic.

**Cross-cutting fix:**
- SystemStatusBar theme and language toggle hover colors now use `zinc-900/zinc-100` (completing the 5.1 fix that only covered app launcher buttons).

**Files changed:**
- `lib/stylePresets.ts`
- `components/os/SystemStatusBar.tsx`
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/CHANGELOG_AI.md`

**Design impact:**
- macOS preset now reads as a denser, more refined desktop application window. Nested panels are no longer distractingly transparent.
- Vercel preset now reads as a flatter, more structured SaaS/developer tool dashboard. Cards have clear层级 against their container.
- Both presets maintain their distinct identity: macOS keeps glass/blur, Vercel stays flat and solid.

**Follow-up notes:**
- Phase 5 remains in progress. Further preset-specific polish (e.g. individual section styling, responsive tweaks) may follow.
- No Phase 6 work has started.

### 2026-06-03 — Claude Code
**Summary:** Phase 5.1 only. Visual consistency audit and targeted fixes across the OS shell.

### 2026-06-03 — Claude Code
**Summary:** Phase 5.1 only. Visual consistency audit and targeted fixes across the OS shell.

**Phase 5.1 deliverables:**
- System Status Bar hover colors softened: `hover:text-black dark:hover:text-white` → `hover:text-zinc-900 dark:hover:text-zinc-100` for less jarring transitions.
- System Status Bar time display now uses `text-zinc-500 dark:text-zinc-400` for dark-mode consistency.
- AppWindow maximized state no longer strips border (`border-0` removed); rounded corners are removed but border stays for visual hierarchy against the desktop.
- AppWindow `isDarkContent` background now respects the style preset: macOS uses `bg-slate-950/90`, vercel lets ConsoleApp handle its own `bg-white dark:bg-black`.
- MainAppNav WebKit scrollbar hidden via `.scrollbar-hide` utility in `globals.css` for cross-browser consistency.
- Settings toggles (Theme, Language, StylePreset) unified with `hover:bg-zinc-100/70 dark:hover:bg-zinc-800/70` for subtler hover feedback.
- No functional changes. No new features. No CLI modifications. No token expansion.

**Files changed:**
- `components/os/SystemStatusBar.tsx`
- `components/os/AppWindow.tsx`
- `components/main/MainAppNav.tsx`
- `components/settings/ThemeToggle.tsx`
- `components/settings/LanguageToggle.tsx`
- `components/settings/StylePresetToggle.tsx`
- `app/globals.css`
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/CHANGELOG_AI.md`

**Design impact:**
- Hover states are less visually aggressive across light and dark themes.
- Maximizing a window no longer causes it to visually merge with the desktop background.
- Cross-browser scrollbar behavior is now consistent in the Main App nav strip.
- The macOS / vercel style boundary remains intact; vercel does not gain glass effects, macOS does not lose its windowed aesthetic.

**Follow-up notes:**
- Phase 5 remains in progress; further preset-specific or theme-specific polish may follow.
- No Phase 6 (SEO / deployment) work has started.

### 2026-06-03 - Claude Code
**Summary:** Phase 4 completion & acceptance. Full CLI command system accepted and documented.

**Phase 4 completed scope:**
- Console App accepts typed commands and executes them on Enter.
- Command parser supports: help, about, skills, projects, blog, contact, resume, clear, classic, whoami, sudo hire me.
- Command input is trimmed and case-insensitive (`HELP`, `Help`, and `help` all resolve).
- Command aliases: `stack → skills`, `logs → blog`, `articles → blog`, `mail → contact`, `hire → sudo hire me`.
- Unknown commands render a localized not-found prompt.
- Command outputs support zh / en via centralized `lib/translations.ts`.
- skills, projects, and blog command outputs reuse local mock data.
- clear clears Console output.
- CLI-to-Main-App linkage scrolls or highlights matching sections when Main App is open and Console is not maximized.
- Console maximized mode stays pure terminal with no Main App linkage.
- Command history navigation with Up / Down arrows.
- Console input focuses on mount and refocuses after submission.
- Console output auto-scrolls to bottom.
- Terminal prompt format: `visitor@dev-os:~ $` with semantic segment colors.
- Native caret color (emerald) in both light and dark themes.
- Input field stripped of default form styling.

**Deferred to future phases:**
- Real filesystem navigation (`cd`, `ls`, `pwd`, etc.)
- Dynamic path changes in the terminal prompt
- AI natural language command parsing
- Autocomplete / tab completion
- Structured card output in Console

**Files changed:**
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/CHANGELOG_AI.md`
- `docs/DEVELOPMENT_RULES.md`

**Design impact:**
- Console App now functions as a complete lightweight terminal within the Personal Developer OS.
- Phase 4 CLI system is accepted as the current command-line baseline.

**Follow-up notes:**
- Phase 4 is now completed. Ready to proceed to Phase 5 when explicitly requested.
- No further Phase 4 work unless bugs are found.

### 2026-06-03 - Claude Code
**Summary:** Phase 4.4.1 only. Polished Console input prompt and caret for a more authentic terminal aesthetic.

**Phase 4.4.1 deliverables:**
- Console input line now displays a structured terminal prompt: `visitor@dev-os:~ $`.
- Prompt segments use distinct semantic colors:
  - `visitor` — accent (emerald)
  - `@dev-os` — secondary text (zinc)
  - `:~` — muted text (zinc)
  - `$` — accent (emerald)
- Input field stripped of default form styling: no border, no background, no outline, no shadow, no ring.
- Native caret color set to `caret-emerald-500 dark:caret-emerald-300` for a terminal-like cursor in both themes.
- Command history output now renders the same `visitor@dev-os:~ $` prompt prefix before each user-typed command.
- Removed the legacy custom block-cursor overlay; caret is now the browser-native caret only.
- Static prompt — no real filesystem, no `cd`/`ls`/`pwd`, no dynamic path changes.
- All command logic, CLI-to-Main-App linkage, window behavior, and settings context remain untouched.

**Files changed:**
- `components/console/ConsoleInput.tsx`
- `components/console/ConsoleOutput.tsx`
- `lib/translations.ts`
- `docs/CHANGELOG_AI.md`

**Design impact:**
- Console input now reads as a real terminal prompt rather than a styled form field.
- Light and dark modes both present the prompt and caret clearly.
- `macos` and `vercel` presets both keep a restrained terminal aesthetic.

**Follow-up notes:**
- Full Phase 4 remains in progress, not completed.
- Real filesystem navigation and dynamic path updates remain deferred to a later phase.

### 2026-06-03 - Codex
**Summary:** Phase 4.4 only. Added lightweight CLI experience improvements for Console App without adding AI parsing or structured output.

**Phase 4.4 deliverables:**
- Console command execution keeps trimming input before running commands.
- Command recognition is case-insensitive, so `HELP`, `Help`, and `help` resolve to the same command.
- Added aliases: `stack -> skills`, `logs -> blog`, `articles -> blog`, `mail -> contact`, and `hire -> sudo hire me`.
- Added keyboard command history navigation with Up / Down arrows.
- Console input focuses on mount and refocuses after command submission as much as the browser allows.
- Console output continues to auto-scroll to the bottom whenever command output changes.
- `clear` still clears Console output normally.

**Files changed:**
- `lib/commands.ts`
- `components/console/ConsoleApp.tsx`
- `components/console/ConsoleInput.tsx`
- `docs/CHANGELOG_AI.md`

**Design impact:**
- Console remains a plain-text terminal dock / maximized terminal.
- Phase 4.3 Main App section linkage rules remain unchanged.
- No Main App content modules, settings context, window dragging, backend APIs, real blog system, AI natural language parsing, autocomplete, or structured cards were added.

**Follow-up notes:**
- Full Phase 4 remains in progress, not completed.

### 2026-06-03 - Codex
**Summary:** Phase 4.3 only. Added conditional CLI-to-Main-App section linkage while preserving Console pure terminal behavior.

**Phase 4.3 deliverables:**
- CLI command results can now carry a typed Main App section target without directly touching the DOM from `lib/commands.ts`.
- DeveloperOS decides whether linkage is allowed: Main App must be open and not minimized, and Console App must not be maximized.
- about, skills, projects, blog, contact, and sudo hire me keep Console active while scrolling Main App to the matching section.
- classic can activate Main App and scroll to overview when Main App is already available.
- Console maximized mode only outputs text and does not scroll or highlight Main App.
- Main App sections now receive a brief lightweight highlight after command-driven navigation.

**Files changed:**
- `lib/types.ts`
- `lib/commands.ts`
- `hooks/useWindowManager.ts`
- `components/os/DeveloperOS.tsx`
- `components/main/MainApp.tsx`
- `components/main/MainAppNav.tsx`
- `components/main/HeroOverview.tsx`
- `components/console/ConsoleApp.tsx`
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/CHANGELOG_AI.md`

**Design impact:**
- Console now works as a navigation entry point for the Personal Developer OS without turning the page into a generic website.
- The Main App / Console App window model, Desktop fallback, settings system, and preset/theme/language switching remain unchanged.

**Follow-up notes:**
- Full Phase 4 is still in progress, not completed.
- Autocomplete, arrow-key command history, aliases, AI natural language command parsing, and structured card output remain out of scope for this step.

### 2026-06-03 - Codex
**Summary:** Phase 4.1 / 4.2 only. Added the basic CLI command skeleton and plain-text command output for Console App.

**Phase 4.1 / 4.2 deliverables:**
- Console App now accepts typed commands and executes them with Enter.
- Console output now records command history and command results.
- Added basic command parsing for help, about, skills, projects, blog, contact, resume, clear, classic, whoami, and sudo hire me.
- Command output supports zh / en through centralized translation keys.
- skills, projects, and blog command output reuse `data/skills.ts`, `data/projects.ts`, and `data/blogs.ts`.
- clear clears the Console output.
- Unknown commands render the configured not-found prompt.

**Files changed:**
- `lib/commands.ts`
- `lib/translations.ts`
- `components/console/ConsoleApp.tsx`
- `components/console/ConsoleInput.tsx`
- `components/console/ConsoleOutput.tsx`
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/CHANGELOG_AI.md`

**Design impact:**
- Console App now behaves like a basic terminal while preserving the Personal Developer OS shell.
- Console remains a pure terminal in docked and maximized states.
- No Main App content cards, window behavior, settings context, or large visual structure were rewritten.

**Follow-up notes:**
- Full Phase 4 is not completed.
- Main App scroll / highlight linkage remains deferred to Phase 4.3.
- Autocomplete, command aliases, arrow-key history, real AI command parsing, backend APIs, and structured card output remain out of scope for this step.

### 2026-06-03 - User Acceptance
**Summary:** Phase 3.5 was manually reviewed and accepted by the user. Marked Phase 3.5 as completed in the implementation plan.

**Completed Phase 3.5 scope:**
- Main App opens maximized by default on first load.
- Console App is closed by default on first load.
- Main App Open Terminal enters the Main + Console dual-window working state.
- macos Main App background readability was improved while preserving the Personal Developer OS concept.
- Top status bar and Desktop entries support opening, restoring, and activating Portfolio / Console.
- Active app state determines which app is shown in the foreground.
- Fixed the edge case where switching to Portfolio while Console is maximized failed to reveal Main App.

**Files changed:**
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/CHANGELOG_AI.md`

**Design impact:**
- Phase 3.5 now has an accepted OS-window behavior baseline.
- No feature, code, CLI command, data, translation, or visual implementation changes were made in this update.

**Follow-up notes:**
- Phase 4 remains not started.
- Future work may proceed to Phase 4 only when explicitly requested.

### 2026-06-03 - Codex
**Summary:** Phase 3.5 Step 4.1 only. Fixed the Portfolio activation edge case when Console App is maximized.

**Step 4.1 deliverables:**
- Updated the shared `openMain()` window manager action to cancel Console `maximized` state before activating Main App.
- Status bar and Desktop Portfolio entries now restore Console to its normal open dock state when switching away from a maximized Console.
- Kept user-triggered Console maximize behavior unchanged.
- Kept Main App internal Open Terminal behavior unchanged.
- Did not enter Phase 4 or add CLI command-system work.

**Files changed:**
- `hooks/useWindowManager.ts`
- `docs/CHANGELOG_AI.md`

**Design impact:**
- Portfolio activation now takes priority over a fullscreen Console presentation.
- Active app stacking remains governed by the existing active `z-index` rule.

**Follow-up notes:**
- This is only Phase 3.5 Step 4.1.
- Do not mark Phase 3.5 completed from this change alone.

### 2026-06-03 - Codex
**Summary:** Phase 3.5 Step 4 only. Optimized app open and active-window rules so Portfolio and Console entries behave more like a lightweight OS launcher.

**Step 4 deliverables:**
- Added `openMain()` for Portfolio entry points to open or restore Main App without changing Console App state.
- Kept status bar and Desktop Console entry points as normal Console open / restore actions that do not force Main App out of maximized state.
- Split Main App internal Open Terminal into a dedicated action that preserves the Step 2 behavior: Main exits maximized, Console opens as the bottom dock, and Console becomes active.
- Let active app state decide window stacking through the existing active `z-index` rule.
- Did not add extra maximized stacking special cases or enter Phase 4 CLI work.

**Files changed:**
- `hooks/useWindowManager.ts`
- `components/os/DeveloperOS.tsx`
- `components/os/SystemStatusBar.tsx`
- `components/os/Desktop.tsx`
- `docs/CHANGELOG_AI.md`

**Design impact:**
- Status bar and Desktop app entries now behave as OS launchers/focus controls instead of forcing a dual-window workflow.
- Main and Console can naturally move above each other based on active app state.
- The Personal Developer OS shell, status bar, Desktop fallback, presets, theme switching, and language switching are preserved.

**Follow-up notes:**
- This is only Phase 3.5 Step 4.
- Do not mark Phase 3.5 completed from this change alone.

### 2026-06-03 - Codex
**Summary:** Refactored the current macos Main App visual treatment back into the style token system while preserving the existing rendered look as closely as possible.

**Refactor deliverables:**
- Moved the Main App body background back to `tokens.contentBg`.
- Moved the section panel backgrounds back to `tokens.cardBg`.
- Removed duplicated preset-specific background classes from individual Main App sections.
- Preserved the current Step 3 visual intent while making future maintenance easier.

**Files changed:**
- `lib/stylePresets.ts`
- `components/main/MainApp.tsx`
- `components/main/HeroOverview.tsx`
- `components/main/AboutSection.tsx`
- `components/main/SkillsSection.tsx`
- `components/main/ProjectsSection.tsx`
- `components/main/BlogSection.tsx`
- `components/main/ContactSection.tsx`
- `docs/CHANGELOG_AI.md`

**Design impact:**
- No intended product or interaction change.
- The current macos look is now primarily token-driven again instead of being scattered across section components.

**Follow-up notes:**
- Verify in-browser that the refactored token values still match the current accepted macos visual result.

### 2026-06-02 - Codex
**Summary:** Phase 3.5 Step 3 only. Increased the macos Main App surface density so the window keeps a glass character without letting desktop icons noticeably interfere with reading.

**Step 3 deliverables:**
- Thickened the macos window background with higher-opacity light and dark translucent surfaces.
- Increased macos section card and nested card opacity to improve readability inside the window.
- Kept the existing window structure and behavior unchanged.
- Left the vercel / minimal preset untouched.

**Files changed:**
- `lib/stylePresets.ts`
- `docs/CHANGELOG_AI.md`

**Design impact:**
- macos Main App now reads as a denser app window instead of a nearly transparent sheet.
- Light mode remains a pale glass surface; dark mode remains a dark glass surface without turning into a white panel.
- Maximized and windowed Main App states continue to share the same macos visual language because the change is token-based.

**Follow-up notes:**
- This is only Phase 3.5 Step 3.
- Do not mark Phase 3.5 completed from this change alone.
- A later step should separately evaluate active app z-index / focus stacking so the selected app can visually sit on top when Main and Console are both open.
- After browser verification feedback, moved the macos Main App surface emphasis onto the Main App content container itself and removed that surface from the internal nav wrapper so the background reads at app-body scope rather than only around the nav strip.

### 2026-06-02 - Codex
**Summary:** Phase 3.5 Step 2 only. Unified the user-triggered Console open behavior so opening Terminal enters the dual-window working state without changing the existing visual system.

**Step 2 deliverables:**
- Added a dedicated `openConsole()` window manager action for user-triggered Console entry points.
- When Terminal is opened while Main App is maximized, Main App now returns to normal window state.
- Console App opens in its default dock panel state instead of maximized mode.
- Active window switches to `console` for the newly opened Terminal session.
- Wired the same behavior into the status bar Terminal entry, Hero / Overview Open Terminal button, and Desktop Open Console entry.

**Files changed:**
- `hooks/useWindowManager.ts`
- `components/os/DeveloperOS.tsx`
- `components/os/SystemStatusBar.tsx`
- `components/os/Desktop.tsx`
- `docs/CHANGELOG_AI.md`

**Design impact:**
- Opening Terminal now reliably transitions the OS from single-window focus into the intended Main + Console dual-window workflow.
- No window chrome, background, preset, theme, or content styling was changed in this step.

**Follow-up notes:**
- This is only Phase 3.5 Step 2.
- Do not mark Phase 3.5 completed from this change alone.

### 2026-06-01 - Codex
**Summary:** Phase 3.5 Step 1 only. Adjusted the default window initialization so first load opens Main App maximized, keeps Console App closed, and preserves the existing OS shell behavior.

**Step 1 deliverables:**
- Updated the default window manager state for first page load.
- Main App now initializes as `maximized`.
- Console App now initializes as `closed`.
- Active window remains `main`.
- No style, background, preset, theme, or content module changes were made.

**Files changed:**
- `lib/constants.ts`
- `docs/CHANGELOG_AI.md`

**Design impact:**
- First load now lands in a focused single-window Main App view while preserving the Personal Developer OS structure.
- System Status Bar, Desktop fallback, and Console reopen entry points remain part of the existing shell.

**Follow-up notes:**
- This is only Phase 3.5 Step 1.
- Do not mark Phase 3.5 completed from this change alone.

### 2026-05-31 - Claude Code
**Summary:** Phase 3 ready for review. Main Content modules fully implemented with Developer OS / Dashboard / Application Window aesthetic. All skeleton placeholders replaced with rich bilingual content.

**Phase 3 deliverables:**
- Unified bilingual data structure via `LocalizedText` type.
- Projects, blogs, and skills data updated with bilingual Phase 3 content.
- Main App internal navigation added with stable section ids: overview, about, skills, projects, blog, contact.
- Hero, About, Skills, Projects, Blog, and Contact sections rewritten as Developer OS dashboard modules.
- Hero terminal CTA opens the existing Console App without adding the Phase 4 CLI command system.

**Files changed:**
- `lib/types.ts`
- `lib/translations.ts`
- `data/projects.ts`
- `data/blogs.ts`
- `data/skills.ts`
- `components/main/MainAppNav.tsx`
- `components/main/MainApp.tsx`
- `components/main/HeroOverview.tsx`
- `components/main/AboutSection.tsx`
- `components/main/SkillsSection.tsx`
- `components/main/ProjectsSection.tsx`
- `components/main/BlogSection.tsx`
- `components/main/ContactSection.tsx`
- `components/os/DeveloperOS.tsx`
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/CHANGELOG_AI.md`

**Design impact:**
- Main App content now reads as a true Developer OS dashboard, not a generic portfolio page.
- App-tab navigation reinforces the application-window concept.
- Bilingual content is unified through typed local data and translations.

**Follow-up notes:**
- Phase 3 is ready for user review.
- Phase 4 can later implement CLI-to-Main-App linkage.

## Purpose
This file records major changes made by AI coding tools such as Codex and Claude Code.

Every major change should include:
- Date
- Tool used
- Summary
- Files changed
- Design impact
- Follow-up notes

### 2026-05-31 — Claude Code
**Summary:** Phase 2 completed. Global settings system established with React Context, unified settings management, centralized translations, and enhanced style tokens.

**Phase 2 deliverables:**
- Created `lib/settings-context.tsx` with `SettingsProvider` and `useSettings` hook
- `SettingsContext` is the single source of truth for theme, lang, stylePreset
- Existing `useTheme`, `useLanguage`, `useStylePreset` refactored as delegation wrappers
- All localStorage logic centralized in SettingsContext; no duplicate reads/writes
- Hydration mismatch prevention via `mounted` flag in context
- Root `app/layout.tsx` wrapped with `SettingsProvider`
- `lib/translations.ts` expanded with full coverage of all UI copy and command outputs
- `t()` function now type-safe with `TranslationKey`
- All components refactored to use `t()` — no hardcoded zh/en strings in components
- `lib/commands.ts` fully translated, no inline `lang === 'zh'` conditionals
- `lib/stylePresets.ts` expanded with comprehensive tokens (cardBg, cardBorder, textPrimary, tagBg, etc.)
- macOS light mode enhanced with glass/blur质感 and softer shadows
- Vercel light mode enhanced with ultra-minimal, high-contrast tool aesthetic
- `app/globals.css` extended with CSS variable palette for OS chrome

**Files changed:**
- `lib/settings-context.tsx` — new: SettingsContext + Provider + useSettings
- `lib/types.ts` — cleaned TranslationDict type
- `lib/translations.ts` — expanded keys, type-safe TranslationKey, function support for dynamic strings
- `lib/stylePresets.ts` — expanded token set, light mode optimization
- `lib/commands.ts` — fully translated command outputs
- `app/layout.tsx` — added SettingsProvider wrapper
- `app/globals.css` — extended CSS variables
- `hooks/useTheme.ts` — delegation wrapper to useSettings
- `hooks/useLanguage.ts` — delegation wrapper to useSettings
- `hooks/useStylePreset.ts` — delegation wrapper to useSettings
- `components/os/DeveloperOS.tsx` — uses useSettings, hydration guard
- `components/os/SystemStatusBar.tsx` — uses useSettings, translated labels
- `components/os/WindowControls.tsx` — translated aria-labels
- `components/os/AppWindow.tsx` — uses style tokens
- `components/os/Desktop.tsx` — uses useSettings
- `components/settings/ThemeToggle.tsx` — uses useSettings
- `components/settings/LanguageToggle.tsx` — uses useSettings
- `components/settings/StylePresetToggle.tsx` — uses useSettings
- `components/main/MainApp.tsx` — simplified props
- `components/main/HeroOverview.tsx` — translated, uses tokens
- `components/main/AboutSection.tsx` — translated, uses tokens
- `components/main/SkillsSection.tsx` — uses tokens
- `components/main/ProjectsSection.tsx` — uses tokens
- `components/main/BlogSection.tsx` — uses tokens
- `components/main/ContactSection.tsx` — translated, uses tokens
- `components/console/ConsoleApp.tsx` — translated welcome, uses tokens
- `components/console/ConsoleInput.tsx` — uses tokens
- `components/console/ConsoleOutput.tsx` — uses tokens
- `docs/IMPLEMENTATION_PLAN.md` — marked Phase 2 as completed
- `docs/CHANGELOG_AI.md` — this entry

**Design impact:**
- Theme, language, and style preset now share a single source of truth via React Context.
- All UI copy is centralized; switching language is instant with no orphaned strings.
- Light mode is now a first-class citizen with distinct visual质感 for both macos and vercel presets.
- Style token system is extensible; adding new presets or theme variants only requires updating tokens.

**Follow-up notes:**
- Ready to proceed to Phase 3: Replace skeleton placeholders with rich content.
- Phase 4: Implement CLI-to-Main-App scroll/linkage.
- Phase 5: Fine-tune individual preset + theme combinations.

### 2026-05-31 — Claude Code
**Summary:** Phase 2 self-audit. Verified all 7 check items passed; one minor fix applied.

**Audit results:**

| # | Check item | Result | Notes |
|---|-----------|--------|-------|
| 1 | SettingsContext is the single source of truth | ✅ Pass | All theme/lang/stylePreset state lives in `lib/settings-context.tsx`; no other useState or localStorage for these three exists |
| 2 | Legacy hooks are pure delegation wrappers | ✅ Pass | `useTheme.ts`, `useLanguage.ts`, `useStylePreset.ts` only destructure from `useSettings()` and return; no useState/localStorage/matchMedia |
| 3 | No hardcoded zh/en UI copy in components | ✅ Pass | grep found only data-layer field selections (`blog.title/titleEn`, `skill.categoryZh`, `project.titleZh`) and one language-code label; all UI copy uses `t()` |
| 4 | macos/vercel via tokens only, no duplicated components | ✅ Pass | Visual differences come from `getStyleTokens()` and Tailwind class strings; zero duplicated components |
| 5 | All 6 combinations preserve Phase 1 OS shell | ✅ Pass | Status Bar, Main App, Console App, Desktop all render correctly under any combo; layout classes adapt per preset |
| 6 | No hydration mismatch risk | ✅ Pass | `layout.tsx` has `suppressHydrationWarning`; `DeveloperOS.tsx` guards with `if (!mounted)` returning static placeholder; Console welcome uses lazy init |
| 7 | pnpm lint & pnpm build pass | ✅ Pass | Both clean |

**Fix applied during audit:**
- `SystemStatusBar.tsx:103` — moved the `EN`/`ZH` language-code label from inline ternary into `lib/translations.ts` under keys `lang.en`/`lang.zh` for full centralization.

**Files unchanged by audit (verified correct):**
- `lib/settings-context.tsx`, `hooks/useTheme.ts`, `hooks/useLanguage.ts`, `hooks/useStylePreset.ts`
- All `components/main/*`, `components/os/*`, `components/console/*`, `components/settings/*`

**No Phase 3 content added.**

## Current design baseline
The project baseline is **Personal Developer OS**:
- System Status Bar
- Main App
- Console App
- Desktop fallback
- macos / vercel style presets
- light / dark themes
- zh / en language switching

### 2026-05-31 — Claude Code
**Summary:** Phase 1 completed. Developer OS shell established and visually calibrated.

**Phase 1 deliverables:**
- Developer OS shell created
- System Status Bar implemented
- Main App window implemented
- Console App dock window implemented
- Desktop fallback implemented
- pnpm migration completed
- Basic style preset / theme / language structure prepared

**Files changed:**
- `docs/IMPLEMENTATION_PLAN.md` — marked Phase 1 as completed
- `docs/CHANGELOG_AI.md` — this entry
- All Phase 1 files listed in previous entries

**Design impact:**
- The Personal Developer OS product concept is now structurally sound.
- All core OS primitives (Status Bar, Main App, Console App, Desktop) are functional.
- Visual calibration ensures the shell reads as an OS, not a generic website.

**Follow-up notes:**
- Ready to proceed to Phase 2: Global Settings refinement.
- Phase 3: Replace skeleton placeholders with rich content.
- Phase 4: Implement CLI-to-Main-App scroll/linkage.

## Entries

### 2026-05-31 — Claude Code
**Summary:** Project initialization. Established cross-tool spec files and Phase 1 skeleton.

**Files changed:**
- `AGENTS.md`
- `CLAUDE.md`
- `docs/DESIGN_BRIEF.md`
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/DEVELOPMENT_RULES.md`
- `docs/CHANGELOG_AI.md`
- `package.json`
- `tailwind.config.ts`
- `tsconfig.json`
- `next.config.ts`
- `postcss.config.mjs`
- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`
- `components/os/DeveloperOS.tsx`
- `components/os/SystemStatusBar.tsx`
- `components/os/Desktop.tsx`
- `components/os/AppWindow.tsx`
- `components/os/WindowControls.tsx`
- `components/main/MainApp.tsx`
- `components/main/HeroOverview.tsx`
- `components/main/AboutSection.tsx`
- `components/main/SkillsSection.tsx`
- `components/main/ProjectsSection.tsx`
- `components/main/BlogSection.tsx`
- `components/main/ContactSection.tsx`
- `components/console/ConsoleApp.tsx`
- `components/console/ConsoleInput.tsx`
- `components/console/ConsoleOutput.tsx`
- `components/settings/ThemeToggle.tsx`
- `components/settings/LanguageToggle.tsx`
- `components/settings/StylePresetToggle.tsx`
- `hooks/useTheme.ts`
- `hooks/useLanguage.ts`
- `hooks/useStylePreset.ts`
- `hooks/useWindowManager.ts`
- `lib/types.ts`
- `lib/translations.ts`
- `lib/commands.ts`
- `lib/constants.ts`
- `lib/stylePresets.ts`
- `lib/utils.ts`
- `data/projects.ts`
- `data/blogs.ts`
- `data/skills.ts`

**Design impact:**
- Established the complete OS shell structure.
- Created the window management system (open/minimized/maximized/closed).
- Implemented style token switching between macos and vercel presets.
- Set up theme and language state management.

### 2026-05-31 — Claude Code
**Summary:** Phase 1 visual calibration. Optimized layout, contrast, and responsive behavior for the Developer OS shell.

**Files changed:**
- `lib/stylePresets.ts` — increased macOS window opacity (70% → 85%), improved light-mode shadows, adjusted Vercel desktop bg
- `components/os/DeveloperOS.tsx` — fixed mobile overlap (Console 240px mobile / 300px desktop), Main App hides when Console maximized
- `components/os/AppWindow.tsx` — inactive windows now fade to 90% opacity
- `components/os/SystemStatusBar.tsx` — mobile-safe layout: style switcher abbreviates to single letter on small screens, time width responsive
- `components/os/Desktop.tsx` — desktop icons always start on the left on mobile (sm: restores preset position)
- `components/console/ConsoleInput.tsx` — input bar border now adapts to light/dark and preset
- `hooks/useWindowManager.ts` — closing a window auto-focuses the other open window

**Design impact:**
- Mobile layout no longer has overlapping windows.
- Console maximized properly enters pure terminal mode (Main App hidden).
- Inactive windows now visually recede.
- Status bar no longer overflows on narrow viewports.

**Follow-up notes:**
- Phase 2 should continue refining light-mode polish across all sections.

### 2026-05-31 — Claude Code
**Summary:** Migrated package manager from npm to pnpm.

**Files changed:**
- `package.json` — added `packageManager: "pnpm@10.33.0"`
- `.gitignore` — added lockfiles and pnpm debug logs
- `docs/CHANGELOG_AI.md` — this entry
- `docs/DEVELOPMENT_RULES.md` — added package manager rule
- Deleted `package-lock.json`
- Generated `pnpm-lock.yaml`

**Design impact:**
- No design impact. Infrastructure-only change.

**Follow-up notes:**
- All future dependency operations must use `pnpm` only.
- Do not reintroduce `package-lock.json`, `yarn.lock`, or `bun.lockb`.

### 2026-06-03 — Claude Code
**Summary:** Phase 6.1 started. CMS-ready blog content architecture established.

**Phase 6.1 deliverables:**
- Created `content/blog/` directory with 2 sample Markdown posts:
  - `building-personal-developer-os.md` — project design rationale and architecture
  - `ai-agent-learning-log.md` — AI Agent learning path and tool chain
- Created `lib/blog/blog-types.ts` — type definitions for `BlogPost`, `BlogPostMeta`, `BlogPostFrontmatter`, `BlogPostStatus`, `BlogPostLanguage`, `BlogPostQueryOptions`
- Created `lib/blog/blog-repository.ts` — `BlogRepository` interface abstracting storage mechanism (file, DB, CMS)
- Created `lib/blog/file-blog-repository.ts` — server-only implementation reading `content/blog/*.md`, parsing frontmatter with `gray-matter`, filtering drafts, sorting by date descending
- Created `lib/blog/blog-service.ts` — `BlogService` class providing unified API: `getPublishedPosts`, `getAllPosts`, `getPostBySlug`, `getPostsByTag`, `getAllTags`, `getPostsByLang`, `getPostsBySeries`
- Created `lib/blog/markdown.ts` — `extractExcerpt` and `formatBlogDate` utilities for Phase 6.2 rendering
- Created `lib/blog/index.ts` — barrel export for clean imports
- Installed `gray-matter` dependency via pnpm
- Updated `docs/IMPLEMENTATION_PLAN.md` — Phase 6 marked as in progress, Phase 6.1–6.4 defined
- Updated `docs/CHANGELOG_AI.md` — this entry
- Updated `docs/DEVELOPMENT_RULES.md` — added Blog Architecture rules section

**Architecture impact:**
- Pages, components, and Console commands are no longer allowed to read `content/blog/*.md` directly.
- All blog data access must go through `BlogService`, which delegates to a `BlogRepository` implementation.
- Current `FileBlogRepository` can be swapped for `DbBlogRepository` or `CmsBlogRepository` in the future without touching pages or components.
- `data/blogs.ts` is preserved for backward compatibility; Phase 6.3 will migrate Main App and CLI to use `BlogService`.

**Files changed:**
- `content/blog/building-personal-developer-os.md` — new
- `content/blog/ai-agent-learning-log.md` — new
- `lib/blog/blog-types.ts` — new
- `lib/blog/blog-repository.ts` — new
- `lib/blog/file-blog-repository.ts` — new
- `lib/blog/blog-service.ts` — new
- `lib/blog/markdown.ts` — new
- `lib/blog/index.ts` — new
- `package.json` — added `gray-matter`
- `pnpm-lock.yaml` — updated
- `docs/IMPLEMENTATION_PLAN.md` — updated
- `docs/CHANGELOG_AI.md` — updated
- `docs/DEVELOPMENT_RULES.md` — updated

**Follow-up notes:**
- Phase 6.1 is complete. Ready for Phase 6.2 (blog pages) when explicitly requested.
- Phase 6.3 will integrate BlogService into Main App Blog section and Console `blog` command.
- Phase 6.4 will handle SEO, RSS, sitemap, and deployment.

### 2026-06-03 — Claude Code
**Summary:** Phase 6.2.1 completed. Added homepage blog entry links to connect Main App with blog pages.

**Phase 6.2.1 deliverables:**
- Updated `data/blogs.ts` — added `slug` field to `Blog` type and aligned first two entries with `content/blog/*.md` articles (`building-personal-developer-os`, `ai-agent-learning-log`).
- Updated `lib/types.ts` — added optional `slug?: string` to `Blog` interface with documentation.
- Updated `lib/translations.ts` — added `blog.viewAll` key (`查看全部日志` / `View all logs`).
- Updated `components/main/BlogSection.tsx`:
  - Each blog card with a `slug` is now wrapped in a Next.js `Link` to `/blog/[slug]`.
  - Cards without a `slug` remain as static divs (no broken links).
  - Hover state: subtle lift (`hover:-translate-y-0.5 hover:shadow-md`), arrow icon appears on hover for linked cards.
  - Added "View all logs" footer link that navigates to `/blog`.
  - Preserved existing Engineering Logs visual style (log viewer aesthetic).

**Files changed:**
- `data/blogs.ts` — updated
- `lib/types.ts` — updated
- `lib/translations.ts` — updated
- `components/main/BlogSection.tsx` — updated
- `docs/CHANGELOG_AI.md` — updated

**Follow-up notes:**
- Phase 6.2.1 is complete. Main App now has natural entry points into the blog system.
- Phase 6.3 will formally integrate Main App Blog section with `BlogService` and update Console `blog` command.

### 2026-06-03 — Claude Code
**Summary:** Phase 6.2 completed. Blog list and article reader pages implemented.

**Phase 6.2 deliverables:**
- Created `app/blog/page.tsx` — blog listing page (Server Component), fetches data via `blogService.getPublishedPosts()`
- Created `app/blog/BlogPageClient.tsx` — client wrapper reading `useSettings()` and rendering `BlogList`
- Created `app/blog/[slug]/page.tsx` — article detail page with `generateStaticParams`, `generateMetadata`, and `notFound()`
- Created `app/blog/[slug]/BlogArticlePageClient.tsx` — client wrapper for article rendering
- Created `app/blog/[slug]/not-found.tsx` — 404 page for missing articles
- Created `components/blog/BlogLayout.tsx` — OS-style layout with top bar, home link, theme/lang/preset toggles, footer
- Created `components/blog/BlogList.tsx` — engineering logs list with entry count and empty state
- Created `components/blog/BlogCard.tsx` — log entry card: title, summary, date, updatedAt, tags, series, lang badge
- Created `components/blog/BlogArticle.tsx` — article reader: back link, title, summary, meta (date, reading time, lang), tags, series, rendered HTML body
- Created `components/blog/index.ts` — barrel export for blog components
- Updated `lib/blog/markdown.ts` — added `renderMarkdownToHtml()` via `remark` + `remark-html`, added `estimateReadingTime()`
- Updated `lib/blog/index.ts` — exports `renderMarkdownToHtml` and `estimateReadingTime`
- Updated `app/globals.css` — added `.blog-article-body` typography styles: h1/h2/h3, paragraphs, lists, blockquotes, code blocks, inline code, links, tables, images
- Installed `remark` and `remark-html` dependencies via pnpm
- Fixed `server-only` import chain issue by having client components import types from `blog-types` directly instead of through the barrel export

**Architecture impact:**
- Blog pages strictly use `BlogService` for data access; no direct file system reads in pages or components.
- Server Components (`page.tsx`) fetch data; Client Components (`*Client.tsx`) read settings and render UI.
- Static generation pre-renders all blog pages at build time.

**Files changed:**
- `app/blog/page.tsx` — new
- `app/blog/BlogPageClient.tsx` — new
- `app/blog/[slug]/page.tsx` — new
- `app/blog/[slug]/BlogArticlePageClient.tsx` — new
- `app/blog/[slug]/not-found.tsx` — new
- `components/blog/BlogLayout.tsx` — new
- `components/blog/BlogList.tsx` — new
- `components/blog/BlogCard.tsx` — new
- `components/blog/BlogArticle.tsx` — new
- `components/blog/index.ts` — new
- `lib/blog/markdown.ts` — updated
- `lib/blog/index.ts` — updated
- `app/globals.css` — updated
- `package.json` — added `remark`, `remark-html`
- `pnpm-lock.yaml` — updated
- `docs/IMPLEMENTATION_PLAN.md` — updated
- `docs/CHANGELOG_AI.md` — updated

**Follow-up notes:**
- Phase 6.2 is complete. Ready for Phase 6.3 (Main App / Console integration) when explicitly requested.
- Phase 6.4 will handle SEO, RSS, sitemap, and deployment.

## Previous Entries

### 2026-05-31 — Claude Code
**Summary:** Project initialization. Established cross-tool spec files and Phase 1 skeleton.

**Files changed:**
- `AGENTS.md`
- `CLAUDE.md`
- `docs/DESIGN_BRIEF.md`
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/DEVELOPMENT_RULES.md`
- `docs/CHANGELOG_AI.md`
- `package.json`
- `tailwind.config.ts`
- `tsconfig.json`
- `next.config.ts`
- `postcss.config.mjs`
- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`
- `components/os/DeveloperOS.tsx`
- `components/os/SystemStatusBar.tsx`
- `components/os/Desktop.tsx`
- `components/os/AppWindow.tsx`
- `components/os/WindowControls.tsx`
- `components/main/MainApp.tsx`
- `components/main/HeroOverview.tsx`
- `components/main/AboutSection.tsx`
- `components/main/SkillsSection.tsx`
- `components/main/ProjectsSection.tsx`
- `components/main/BlogSection.tsx`
- `components/main/ContactSection.tsx`
- `components/console/ConsoleApp.tsx`
- `components/console/ConsoleInput.tsx`
- `components/console/ConsoleOutput.tsx`
- `components/settings/ThemeToggle.tsx`
- `components/settings/LanguageToggle.tsx`
- `components/settings/StylePresetToggle.tsx`
- `hooks/useTheme.ts`
- `hooks/useLanguage.ts`
- `hooks/useStylePreset.ts`
- `hooks/useWindowManager.ts`
- `lib/types.ts`
- `lib/translations.ts`
- `lib/commands.ts`
- `lib/constants.ts`
- `lib/stylePresets.ts`
- `lib/utils.ts`
- `data/projects.ts`
- `data/blogs.ts`
- `data/skills.ts`

**Design impact:**
- Established the complete OS shell structure.
- Created the window management system (open/minimized/maximized/closed).
- Implemented style token switching between macos and vercel presets.
- Set up theme and language state management.

**Follow-up notes:**
- Phase 2 should implement full translations for all UI copy.
- Phase 3 should replace skeleton placeholders with real content.
- Phase 4 should implement the CLI command system.
