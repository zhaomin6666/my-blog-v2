# Development Rules — Personal Dev OS

## 1. Cross-Tool Collaboration Rules
- Both Codex and Claude must read docs before starting.
- Do NOT rewrite without understanding the existing structure.
- Do NOT duplicate existing functionality.
- For large changes, explain the scope of impact first.
- After large changes, update `docs/CHANGELOG_AI.md`.

## 2. Design Consistency Rules
- All UI optimizations must strengthen the Developer OS concept.
- Do NOT weaken the window system into normal webpage sections.
- Do NOT remove the System Status Bar.
- Do NOT remove the Console App.
- Do NOT remove the Desktop fallback.
- `macos` / `vercel` may only change visual质感, not product structure.

## 3. Code Structure Rules
```
components/os/      → OS shell components
components/main/    → Main App content components
components/console/ → Console App components
components/settings/→ Settings toggle components
hooks/              → State logic hooks
lib/                → Types, commands, translations, style tokens
data/               → Mock data
```

## 4. Copy Rules
- Chinese and English copy must be centralized in `lib/translations.ts`.
- No hardcoded strings scattered in components.
- Use `t(key, lang)` from `@/lib/translations` for all user-facing text.
- Mock data should also consider bilingual structure.

## 5. Settings Rules
- All global settings (theme, lang, stylePreset) must come from `useSettings()` in `@/lib/settings-context`.
- Do NOT create new localStorage reads/writes outside of `SettingsContext`.
- The legacy hooks (`useTheme`, `useLanguage`, `useStylePreset`) are compatibility wrappers only.
- Always check `mounted` from `useSettings()` before rendering theme-dependent UI to avoid hydration mismatch.

## 6. Theme & Style Rules
- `theme` controls light / dark.
- `stylePreset` controls macos / vercel.
- Do NOT mix theme and stylePreset together.
- Do NOT write completely independent components for a single theme.
- Use `getStyleTokens(preset)` from `@/lib/stylePresets` for all visual token lookups.
- Add new visual differences via style tokens, CSS variables, or Tailwind class mapping — never by duplicating components.

## 6. Package Manager Rules
- Use **pnpm** as the only package manager.
- Do NOT use npm, yarn, or bun for dependency operations.
- Do NOT commit `package-lock.json`, `yarn.lock`, or `bun.lockb`.
- `pnpm-lock.yaml` is the single source of truth for lockfile.
- Always run `pnpm install` after pulling changes that may update dependencies.

## 7. CLI / Console Rules
- All CLI command outputs must support zh / en through `lib/translations.ts`.
- CLI prompt is currently static: `visitor@dev-os:~ $`.
- Dynamic path changes, real filesystem commands (`cd`, `ls`, `pwd`), and AI natural language parsing are deferred to future phases.
- Console App must remain a plain-text terminal in both docked and maximized states.
- Console maximized mode stays pure terminal with no Main App linkage.

## 8. Blog Architecture Rules
- Pages, components, and Console commands must NOT read `content/blog/*.md` directly.
- All blog data access must go through `BlogService` (`@/lib/blog`).
- `BlogService` delegates to a `BlogRepository` implementation; upper layers do not know the storage mechanism.
- Current implementation: `FileBlogRepository` (reads Markdown files, server-side only).
- Future implementations: `DbBlogRepository`, `CmsBlogRepository` — swap at `BlogService` constructor.
- Markdown frontmatter fields must stay close to a future database model for easy migration.
- Console blog commands must not maintain independent mock blog data.
- Blog metadata displayed by the Console must come from `BlogService` and be passed into client components as serializable props.
- Client components may consume server-provided `BlogPostMeta[]`, but must not import `fs`, `path`, `FileBlogRepository`, or Markdown files directly.

## 9. SEO / Site Discovery Rules
- Public SEO outputs (`metadata`, `sitemap.xml`, `robots.txt`, `rss.xml`) must not expose draft content.
- Sitemap and RSS must fetch blog entries through `BlogService.getPublishedPosts()`.
- Article metadata must fetch entries through `BlogService.getPublishedPostBySlug()` or another published-only service method.
- Site URL and default SEO copy must be centralized in `lib/seo.ts`; production deployments should set `NEXT_PUBLIC_SITE_URL`.
- Future CMS / DB upgrades should add or swap a `BlogRepository` implementation instead of rewriting page, Console, or SEO consumers.

## 9.1 Project Content Architecture Rules
- Pages and components must NOT read `content/projects/**/*.md` directly.
- All project data access must go through `ProjectService` (`@/lib/projects`) on the server, then pass serializable project metadata/content into Client Components.
- `ProjectService` delegates to a `ProjectRepository` implementation; upper layers do not know the storage mechanism.
- Current implementation: `FileProjectRepository` (reads Markdown files, server-side only).
- Future implementations: `DbProjectRepository`, `CmsProjectRepository` — swap at the service/repository boundary instead of rewriting pages.
- Project public URLs must come from `frontmatter.slug`, not folder or file names.
- Public pages and sitemap must use published-only project queries.
- RSS remains blog-only and must not include project pages.

## 10. Production Maintenance Rules
- Changing `NEXT_PUBLIC_SITE_URL` requires a fresh production build because Next.js inlines `NEXT_PUBLIC_*` values at build time.
- SEO, sitemap, RSS, or domain changes must be rechecked online after deployment.
- Production updates use `git pull` plus `docker compose --env-file .env.production up -d --build`.
- Run `pnpm lint` and `pnpm build` before release when possible.
- Do not commit `.env.production`, `.env.local`, certificate files, private keys, server IPs, or private deployment secrets.

## 11. Quality Rules
- Run `pnpm lint` after meaningful changes.
- Run `pnpm build` when possible.
- Fix TypeScript errors.
- Avoid `any`.
- Avoid unnecessary third-party libraries.
- Use animations sparingly.

## 12. Visual Maintenance Rules
- Any visual change must be verified under **both** `macos` and `vercel` presets.
- Any color or background change must be verified under **both** `light` and `dark` themes.
- Any layout change must be checked on **desktop, tablet (768px), and mobile (360px–430px)**.
- Do NOT weaken the Personal Developer OS into a generic portfolio page or normal blog template.
- Prefer style-token-driven changes in `lib/stylePresets.ts` over hardcoding preset-specific classes in components.
- Hover and active feedback should be subtle (scale ≤ 1.1, translate ≤ 4px, duration ≤ 250ms).
- All animations must respect `prefers-reduced-motion`.
