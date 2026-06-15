# Implementation Plan — Personal Dev OS

## Phase 1: Project Foundation & OS Shell ✅ COMPLETED
- Initialize Next.js / Tailwind / TypeScript
- Create base directory structure
- Implement System Status Bar
- Implement Main App window
- Implement Console App bottom window
- Implement Desktop placeholder
- Implement window state management
- Migrate to pnpm
- Phase 1 visual calibration (layout, contrast, responsive)

## Phase 2: Global Settings ✅ COMPLETED
- ✅ Implement theme: light / dark
- ✅ Implement language: zh / en
- ✅ Implement stylePreset: macos / vercel
- ✅ Save to localStorage
- ✅ Extract translations
- ✅ Extract style tokens
- ✅ Unified SettingsContext + useSettings hook
- ✅ Light mode visual optimization across presets
- ✅ Type-safe translations with TranslationKey

## Phase 3: Main Content READY FOR REVIEW
- Hero / Overview - Dashboard widget with badge, title, subtitle, CTA buttons
- About - Profile panel / profile.json style with info fields
- Skills - Skill Matrix / stack.config style with module headers
- Projects - Service modules / app cards with status badges and tech stacks
- Blog / Engineering Logs - Log entries with timestamp, level, tags
- Contact - Contact channel / endpoint panel with endpoint labels
- Main App internal navigation - App-tab style with smooth scroll
- Unified bilingual data structure (LocalizedText)
- Stable section ids: overview, about, skills, projects, blog, contact
- Awaiting user review before marking completed

## Phase 3.5: Developer OS Window Behavior Calibration COMPLETED
- User manually reviewed and accepted Phase 3.5.
- Main App opens maximized by default on first load.
- Console App is closed by default on first load.
- Main App Open Terminal enters the Main + Console dual-window working state.
- macos Main App background readability was improved while preserving the glass OS concept.
- Top status bar and Desktop entries can open, restore, and activate the corresponding app.
- Active app state determines foreground window stacking.
- Switching to Portfolio while Console is maximized restores Console to its dock state so Main App is visible.

## Phase 4: CLI Command System ✅ COMPLETED
- Command parser with trim and case-insensitive matching
- Command history with Up / Down arrow navigation
- Implement: help, about, skills, projects, blog, contact, resume, clear, classic, whoami, sudo hire me
- Command aliases: stack → skills, logs → blog, articles → blog, mail → contact, hire → sudo hire me
- Unknown command handling with localized not-found prompt
- Link to Main App scroll or highlight
- Console maximized pure terminal mode (no linkage)
- Terminal prompt: visitor@dev-os:~ $
- Input caret polish (native caret, no custom block cursor)

### Phase 4.1 / 4.2: Basic CLI Skeleton & Text Outputs COMPLETED
- Console App accepts typed commands and executes on Enter.
- Console App renders command history and plain-text command output.
- Basic parser supports: help, about, skills, projects, blog, contact, resume, clear, classic, whoami, sudo hire me.
- Command outputs support zh / en via centralized translations.
- skills / projects / blog commands reuse local mock data.
- clear and unknown command handling are implemented.

### Phase 4.3: CLI-to-Main-App Section Linkage COMPLETED
- about / skills / projects / blog / contact / sudo hire me can scroll Main App to the matching section when linkage conditions are met.
- classic can activate Main App and scroll to overview when Main App is already open and not minimized.
- Linkage only runs when Main App is open and not minimized, and Console App is not maximized.
- Console maximized mode remains pure terminal output with no Main App linkage.
- Linked sections receive a brief lightweight highlight.

### Phase 4.4: CLI Experience Polish COMPLETED
- Command input is trimmed before execution.
- Command recognition is case-insensitive.
- Added command aliases: stack, logs, articles, mail, hire.
- Added keyboard command history navigation with Up / Down arrows.
- Console input focuses on mount and refocuses after command submission.
- Console output auto-scrolls to bottom on new output.

### Phase 4.4.1: Console Prompt & Cursor Polish COMPLETED
- Replaced generic prefix with structured terminal prompt: `visitor@dev-os:~ $`.
- Prompt segments use semantic colors (accent for user/host, secondary for path).
- Removed custom block cursor; using native caret with emerald color.
- Input field stripped of default border, background, outline, and shadow.
- Command history output renders the same prompt prefix.

## Phase 5: Visual Polish ✅ COMPLETED
- Visual consistency audit and targeted fixes
- macOS / Vercel preset refinement for clearer style boundary
- light / dark theme refinement for readable hierarchy across all combinations
- Responsive optimization for 360px / 390px / 430px / 768px
- Subtle motion and interaction feedback (window enter, active switching, hover/focus, Console output, reduced motion support)
- No functional changes, no CLI changes, no window behavior changes

### Phase 5.1: Visual Consistency Audit & Fixes COMPLETED
- System Status Bar hover colors softened (black/white → zinc-900/zinc-100)
- System Status Bar time display dark variant added
- AppWindow maximized state retains border for visual hierarchy
- AppWindow dark content background respects preset (macOS slate vs vercel transparent)
- MainAppNav WebKit scrollbar hidden for cross-browser consistency
- Settings toggle hover backgrounds unified with subtle opacity
- No functional changes, no new features, no token expansion

### Phase 5.2: macOS / Vercel Preset Polish COMPLETED
- macOS window background opacity increased (88% → 92%) for stronger window presence
- macOS window shadow strengthened in light mode for better floating effect
- macOS content background opacity increased (80% → 92%) for clearer content readability
- macOS card background opacity increased (94% → 98%) for crisper cards
- macOS nested card background opacity increased (58% → 75%) to fix excessive transparency
- macOS card shadow softened and reduced for subtler depth
- macOS status bar background opacity increased (60% → 70%) for more solid toolbar feel
- Vercel card background changed to zinc-50/zinc-950 for subtle hierarchy against window
- Vercel nested card background changed to solid zinc-100/zinc-900 for flatter panel look
- Vercel window shadow refined to ultra-subtle 1px depth
- Status bar toggle hover colors fully unified (previous 5.1 fix completed for theme/lang buttons)
- No component duplication, no structural changes, no new features

### Phase 5.3: light / dark Theme Polish COMPLETED
- macOS light card borders: `border-white/60` → `border-zinc-200/40` for visible card boundaries on light backgrounds
- macOS light nested card borders: `border-white/50` → `border-zinc-200/30` for visible nested panel boundaries
- macOS dark nested card background: `bg-slate-950/55` → `bg-slate-950/70` to fix overly transparent nested panels in dark mode
- macOS dark status bar: `dark:bg-black/50` → `dark:bg-black/60` for more solid toolbar in dark mode
- Vercel dark card borders: `border-zinc-800` → `border-zinc-700` for clearer panel edges in dark mode
- Vercel dark nested card borders: `border-zinc-800` → `border-zinc-700` for clearer nested panel edges
- Vercel dark title bar: `bg-zinc-900/50` → `bg-zinc-900` (solid) and border `zinc-800` → `zinc-700` for crisper window chrome
- Vercel dark status bar border: `border-zinc-800` → `border-zinc-700` for clearer top bar separation
- No component changes, no structural changes, no new features

### Phase 5.4: Responsive / Mobile Optimization COMPLETED
- System Status Bar: added mobile-visible Portfolio/Console entry buttons (xs text, compact layout)
- Console prompt shortened on mobile: `dev-os:~ $` instead of `visitor@dev-os:~ $`
- Console output history prompt also shortened on mobile
- AppWindow title bar: added `truncate` and `min-w-0` to prevent title overflow on small screens
- HeroOverview title: added `sm:` breakpoint so mobile uses smaller font (`text-2xl` macOS, `text-xl` vercel)
- Desktop icons: preserved left-side layout on mobile for macOS preset
- MainAppNav: already had `overflow-x-auto` and `scrollbar-hide` for mobile scrolling
- Main content sections: grid layouts already collapse to single column on mobile
- Contact section endpoint labels already hidden on mobile (`hidden sm:block`)
- No structural changes, no window behavior changes, no CLI changes

### Phase 5.5: Motion & Interaction Feedback COMPLETED
- Window open/close/minimize/maximize: subtle fade-in-scale mount animation (`os-window-enter`, 200ms ease-out)
- Active window switching: smoother `transition-[opacity,transform,box-shadow,border-radius]` with `ease-out`
- Inactive window title bar: `transition-[opacity,filter]` for graceful fade-to-gray
- Window control buttons: `hover:scale-110 active:scale-95` tactile feedback (150ms)
- Console output lines: framer-motion `opacity + translateY` fade-in for new lines (120ms)
- Desktop icons: `hover:-translate-y-1` lift effect alongside existing scale
- Content cards (Projects, Blog, Contact, About, Skills): `hover:-translate-y-0.5 hover:shadow-md` on hover
- System Status Bar buttons: `active:scale-95` on all interactive buttons
- MainAppNav buttons: `active:scale-95` on all nav items
- Settings toggles: `active:scale-95` on theme/lang/preset switches
- Hero CTA buttons: `active:scale-95` click feedback
- Global `prefers-reduced-motion` support: CSS media query disables all animations/transitions
- No window behavior changes, no CLI changes, no new features, no new dependencies

## Phase 6: Blog Publishing System + SEO + Deployment COMPLETED
- Blog Publishing System
- CMS-ready Blog Architecture
- Blog Pages
- Main App / Console Blog Data Alignment
- SEO metadata
- sitemap / robots / RSS
- Deployment readiness

### Phase 6.1: CMS-ready Blog Content Architecture COMPLETED
- File-based Markdown blog (`content/blog/*.md`)
- `BlogPost` / `BlogPostMeta` / `BlogPostFrontmatter` types
- `BlogRepository` interface (abstracts storage mechanism)
- `FileBlogRepository` (server-side Markdown parser)
- `BlogService` (unified API for pages, components, CLI)
- Future-ready: swapping repository enables DB / CMS migration
- Homepage Main App Blog section now uses real blog metadata via `BlogService`
- Console blog command now uses server-provided published metadata via Phase 6.3

### Phase 6.2: Blog List / Article Reader ✅ COMPLETED
- `/blog` listing page with Engineering Logs aesthetic
- `/blog/[slug]` detail page with Markdown rendering
- `BlogLayout` — OS-style top bar with theme/lang/preset toggles
- `BlogList` / `BlogCard` — log entry cards with date, tags, series, lang
- `BlogArticle` — article reader with meta info and reading time
- Markdown rendering via `remark` + `remark-html`
- Article typography styles in `globals.css`
- `generateStaticParams` + `generateMetadata`
- `notFound()` for missing slugs
- Public article detail route is published-only; draft slugs return 404
- Blog page UI copy and aria labels are localized through `lib/translations.ts`
- Preserves light/dark, macos/vercel, mobile responsive
- Homepage Main App Blog section integration completed in Phase 6.2.1
- Console blog command integration completed in Phase 6.3

### Phase 6.3: Console Blog Command Integration COMPLETED
- Console `blog` command now consumes server-provided `BlogPostMeta[]`
- `logs` / `articles` aliases resolve to the same real published post output
- Console blog output is aligned with `/blog` and the Main App Blog section
- Legacy `data/blogs.ts` mock data removed because no runtime consumers remain
- Client components still do not read `content/blog`, `fs`, `path`, or `FileBlogRepository`

### Phase 6.4: SEO Metadata / Sitemap / Robots / RSS COMPLETED
- Centralized SEO config in `lib/seo.ts`
- Site-wide metadata with title template, description, authors, robots, Open Graph, and Twitter card
- Homepage metadata aligned with Personal Developer OS positioning
- `/blog` metadata for Engineering Logs
- `/blog/[slug]` metadata uses published-only article data with seoTitle / seoDescription fallbacks
- `sitemap.xml` includes `/`, `/blog`, and published blog posts only
- `robots.txt` allows public pages, reserves `/admin` and `/api/preview`, and points to sitemap
- `rss.xml` includes published blog posts only with absolute URLs
- Production deployments should set `NEXT_PUBLIC_SITE_URL`; local fallback is `http://localhost:3000`
- No deployment, CMS, DB, search, Console, or window-system changes

### Phase 6.5: Deployment Prep / Production Configuration COMPLETED
- Added `.env.example` with `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
- Added README with project positioning, tech stack, local commands, blog architecture, and deployment-doc link
- Added `docs/DEPLOYMENT.md` with environment variable guidance and pre-deployment checklist
- Confirmed site URL is centralized in `lib/seo.ts`
- Confirmed sitemap / robots / RSS use the shared site URL config
- Confirmed `pnpm lint` and `pnpm build` pass
- Confirmed public SEO outputs exclude drafts
- No business feature, CMS, DB, search, Console, CLI, or window-system changes

### Phase 6.6: Final Phase 6 Archive COMPLETED
- Confirmed Phase 6.1 through Phase 6.5 are complete
- Archived Phase 6 as completed
- Re-ran `pnpm lint` and `pnpm build`
- Rechecked public blog routes, sitemap, robots, RSS, and draft safety
- No business feature, CMS, DB, search, Console, CLI, or window-system changes

## Phase 7: Self-hosted Production Deployment COMPLETED
- Docker deployment configuration
- GitHub remote repository setup
- Server Docker runtime on CentOS 9
- Next.js standalone output in Docker
- Docker Nginx reverse proxy
- Domain DNS setup
- Let's Encrypt HTTPS
- Production validation
- Post-release operations archive

### Phase 7.1: Docker Deployment Configuration COMPLETED
- Added multi-stage Dockerfile for Next.js standalone runtime
- Added `.dockerignore`, `.npmrc`, `docker-compose.yml`, and stable `public` directory placeholder
- Configured standalone output and traced `content/blog` for server-side Markdown access
- Preserved published-only blog, Console, window system, and UI behavior

### Phase 7.2: Production URL Build Args / SEO Output Fix COMPLETED
- Passed `NEXT_PUBLIC_SITE_URL` into Docker build args before `pnpm build`
- Kept `NEXT_PUBLIC_SITE_URL` available at container runtime
- Ensured sitemap, RSS, robots, and metadata use the production origin after rebuild

### Phase 7.3 - 7.6: Server Release Path COMPLETED
- Set up GitHub remote repository flow for server clone / pull updates
- Deployed on self-owned Korea cloud server with CentOS 9
- Ran the app via Docker Compose and Next.js standalone server
- Configured Docker Nginx reverse proxy
- Connected `oli6666.top` DNS to production
- Configured Let's Encrypt HTTPS
- Redirected `www.oli6666.top` to `oli6666.top`
- Validated production routes, SEO outputs, HTTPS redirects, and mobile baseline

### Phase 7.7: Post-release Operations Archive COMPLETED
- Archived production URL, directory layout, environment variable requirements, update flow, log checks, Nginx reload, certificate renewal, rollback, and online validation checklist
- Phase 7 is completed with no business feature, UI, Console / CLI, window-system, or blog-system changes

## Phase 8: Content & Career Launch COMPLETED
- Publish real blog content around the Personal Developer OS build process
- Use the site as a personal brand, job-search showcase, and technical writing archive
- Keep Phase 8 content-first: no blog-system, UI, Console / CLI, window-system, or deployment-config changes unless separately planned
- Completed scope:
  - Blog content and the Personal Developer OS article series
  - Blog reading experience and content organization
  - Projects portfolio and project case studies
  - File-based Projects content source
  - Projects and Blog content linkage
  - Profile content system
  - Contact / CTA optimization
  - Content workflow documentation
  - Final Phase 8 acceptance

### Phase 8.1: Release Archive & Version Tag COMPLETED
- Archived the v1.0.0 production release and version milestone
- Production URL: `https://oli6666.top`
- Phase 1-7 completed before content launch work

### Phase 8.2: Real Blog Content Series COMPLETED
- Established and completed the seven-article series: `从 Hexo 到 Personal Developer OS`.
- Published the full series covering site rebuild motivation, Developer OS design, Phase 1-7 implementation, Markdown blog architecture, SEO/RSS, deployment, and production operations.
- Polished the first three articles to reduce AI-generated phrasing while preserving the personal developer voice.
- Fixed the blog reading experience with long-form article scrolling plus static word count / reading time metadata.
- Organized the series under `content/blog/personal-developer-os/` with stable public slugs.
- Added `/blog/series` and `/blog/series/[seriesSlug]` for published-only series discovery.
- Preserved homepage Blog section, `/blog`, `/blog/[slug]`, Console blog metadata, sitemap, RSS, Main App, Console / CLI, window system, and deployment configuration.

### Phase 8.2.1: Blog Copywriting Polish / 去 AI 味文字润色 COMPLETED
- Polished the first three articles in the `从 Hexo 到 Personal Developer OS` series
- Reduced AI-generated phrasing and template-style sentence patterns
- Preserved personal developer voice: real reflection tone, no marketing language, no fabricated facts
- Kept technical accuracy, phase structure, and frontmatter fields intact
- No blog-system code, Console / CLI, window system, UI, or deployment configuration changes

### Phase 8.2.2: Personal Developer OS Series Back Half COMPLETED
- Added four published articles to complete the back half of the `从 Hexo 到 Personal Developer OS` series:
  - `building-cli-for-personal-developer-os`
  - `visual-polish-and-responsive-design`
  - `markdown-blog-seo-rss-system`
  - `nextjs-docker-nginx-https-deployment`
- Covered CLI implementation, visual polish, responsive design, Markdown blog architecture, SEO, RSS, deployment readiness, Docker self-hosting, Nginx reverse proxy, HTTPS, and production operations.
- Kept the same series name, `published` status, `zh` language, and complete frontmatter for all four articles.
- The series now has seven published articles.
- No blog-system code, Console / CLI code, window system, UI, sitemap / RSS code, or deployment configuration changes.

### Phase 8.2.3: Blog Reading Experience Fix COMPLETED
- Fixed `/blog/[slug]` long-article scrolling by giving the standalone blog layout its own vertical scroll container while preserving the global Developer OS overflow model.
- Added build-time static reading stats from Markdown body content:
  - `wordCount`
  - `readingTimeMinutes`
- Reading time uses mixed-content estimation: CJK characters / 450 + English / number units / 220, rounded up with a 1-minute minimum.
- Article detail pages now show localized reading stats:
  - zh: `约 X 分钟阅读 · Y 字`
  - en: `X min read · Y words`
- Blog list cards and homepage Blog section show a lightweight reading-time hint.
- No reading views, database, analytics service, Console / CLI changes, window-system changes, deployment configuration changes, search, comments, tags page, or series page were added.

### Phase 8.2.4: Blog Series & Content Organization COMPLETED
- Moved the seven `从 Hexo 到 Personal Developer OS` series articles into `content/blog/personal-developer-os/` with numbered filenames.
- Kept public article URLs unchanged by continuing to resolve `/blog/[slug]` from `frontmatter.slug`.
- Updated `FileBlogRepository` to recursively scan Markdown files under `content/blog`.
- Added optional series metadata fields:
  - `seriesSlug`
  - `seriesOrder`
- Added published-only series APIs through BlogService:
  - `getAllSeries()`
  - `getPostsBySeries(seriesSlug)`
- Added `/blog/series` and `/blog/series/[seriesSlug]` pages using the existing Engineering Logs / Developer OS style.
- Added a lightweight series entry point from `/blog`.
- Added sitemap entries for series pages while keeping RSS article-only.
- No Console / CLI logic, window-system behavior, deployment configuration, database, CMS, search, comments, reading views, or tag detail page changes.

### Phase 8.3: Projects / AI Agent Demo Showcase Strengthening COMPLETED
- Strengthen Projects as a career-facing portfolio module inside the existing Main App.
- Keep this phase focused on project information architecture and restrained presentation.
- Do not add project detail pages, search, filters, CMS, database, Agent API, Console / CLI changes, window-system changes, or deployment configuration changes unless separately planned.
- Completed scope:
  - Projects information structure refactor
  - Project case study pages
  - File-based Projects content source
  - AI Agent Demo content strengthening
  - Projects and Blog content linkage
  - Projects showcase final acceptance

### Phase 8.3.1: Projects Information Structure Refactor COMPLETED
- Refactored `Project` data into a richer portfolio structure with subtitle, type, status label, highlights, features, role, links, related posts, featured flag, and order.
- Promoted `Personal Developer OS` to the first featured project and connected it to the live site, GitHub repository, `/blog/series/personal-developer-os`, and selected existing series articles.
- Added `AI Agent Demo` as the second featured project, clearly positioned as an in-progress learning / showcase project rather than a mature production product.
- Kept `Bidding System Platform` as supporting backend enterprise-system experience.
- Updated the Projects section to show featured portfolio cards with tech stack, engineering notes, current scope, roles, links, and related logs while keeping supporting projects compact.
- No Console / CLI logic, window-system behavior, blog core logic, blog article content, deployment configuration, database, CMS, search, filters, or Agent API changes.

### Phase 8.3.2: Project Case Study Pages COMPLETED
- Added public project routes:
  - `/projects`
  - `/projects/personal-developer-os`
  - `/projects/ai-agent-demo`
- Extended the shared `Project` data model with stable `slug`, timeline, overview, problem/background, solution/design, architecture, development process, AI collaboration, challenges, learnings, related series, and future plans.
- Reused the same project data for the homepage Projects section, `/projects` list page, and `/projects/[slug]` case study pages.
- Added restrained Developer OS / Engineering Logs style project list and detail pages with metadata, theme switching, language switching, and style preset switching.
- Added homepage Projects card entry points for case studies.
- Added project list and detail pages to `sitemap.xml`.
- Kept RSS blog-article-only.
- No Console / CLI logic, window-system behavior, blog core logic, blog article content, deployment configuration, database, CMS, search, filters, online chat, or Agent API changes.

#### Phase 8.3.2-fix: Projects Data Source Refactor COMPLETED
- Refactored Projects data from code configuration into file-based Markdown content under `content/projects/**/*.md`.
- Added `ProjectRepository`, `FileProjectRepository`, and `ProjectService` under `lib/projects`.
- Project URLs now come from `frontmatter.slug`, not folder names.
- `FileProjectRepository` recursively scans `content/projects`, ignores non-Markdown files, filters unpublished projects from public consumers, and fails early on duplicate slugs.
- Homepage Projects, `/projects`, `/projects/[slug]`, Console project output, and sitemap now consume project data through `ProjectService` or server-provided `ProjectMeta[]`.
- Project detail pages render Markdown body content by reusing the existing Markdown renderer.
- Kept `/projects`, `/projects/personal-developer-os`, and `/projects/ai-agent-demo` paths unchanged.
- Kept RSS blog-article-only.
- No Console / CLI behavior, window-system behavior, blog core logic, blog article content, deployment configuration, database, CMS, search, filters, online chat, or Agent API changes.

### Phase 8.3.3: AI Agent Demo Showcase Content Strengthening COMPLETED
- Strengthened `AI Agent Demo` project content in `content/projects/ai-agent-demo/index.md`.
- Clarified the project as an `In Progress / Learning Project`, not a mature production product.
- Repositioned the case study around enterprise knowledge base and business workflow understanding.
- Added a more grounded Java backend-to-AI Agent background, covering enterprise systems, documents, interfaces, workflow context, and delivery scenarios.
- Expanded the learning route around TypeScript, LangChain.js, LangGraph.js, Zod, Prompt Messages, Structured Output, Intent Classifier, Tool Calling, Agent Executor, RAG, Agent State, Persistence, and future MCP / OAuth / enterprise integration.
- Kept `relatedPosts` empty because no published AI Agent learning series exists yet.
- Preserved file-based Projects content architecture, `slug: ai-agent-demo`, `published: true`, `featured: true`, and `order: 2`.
- No ProjectService / FileProjectRepository, Projects UI, Blog system, Console / CLI, window-system behavior, deployment configuration, database, CMS, online chat, or real Agent API changes.

### Phase 8.3.4: Projects & Blog Content Linkage COMPLETED
- Added lightweight content linkage between project case studies, blog series pages, and blog article pages.
- `Personal Developer OS` project detail page now resolves `relatedSeriesSlug: personal-developer-os` through `BlogService` and displays the related series, article count, series link, and series article links.
- Blog series detail pages now resolve published projects through `ProjectService.getProjectsByRelatedSeries(seriesSlug)` and show related project entries when available.
- Blog article detail pages now show a lightweight related project entry when the article belongs to a series matched by a published project's `relatedSeriesSlug`.
- Added centralized zh / en translation keys for related writing, related project, related series, project detail links, and series article labels.
- `AI Agent Demo` still does not link to nonexistent blog posts or series.
- No new routes, sitemap changes, RSS changes, Console / CLI changes, window-system behavior changes, deployment configuration changes, database, CMS, comments, search, online chat, or Agent API changes.

### Phase 8.3.5: Projects Showcase Final Acceptance COMPLETED
- Completed final acceptance for Phase 8.3 Projects showcase work.
- Confirmed Projects data comes from `content/projects/**/*.md` through `ProjectService` and `FileProjectRepository`.
- Confirmed adding a future project should only require adding a Markdown file with valid frontmatter and published status.
- Confirmed `/projects`, `/projects/personal-developer-os`, and `/projects/ai-agent-demo` build normally.
- Confirmed homepage Projects cards, project ordering, status labels, tech stacks, highlights, and detail links work from server-provided project metadata.
- Confirmed `Personal Developer OS` is positioned as a production v1.0 project and linked to the `personal-developer-os` blog series.
- Confirmed `AI Agent Demo` remains an honest `In Progress / Learning Project` with no fabricated users, production results, or nonexistent blog links.
- Confirmed sitemap includes published project pages and RSS remains blog-article-only.
- Small fix: homepage project case-study entry is always visible even when a project has no extra external links.
- Small fix: removed the generic `/blog` link from `AI Agent Demo` until a real AI Agent blog series exists.
- No Console / CLI, window-system behavior, Blog article body content, deployment configuration, database, CMS, search, online chat, or Agent API changes.

### Phase 8.4: About / Resume / Contact 求职转化优化 COMPLETED
- Phase 8 was still in progress at this subphase; it is now closed by Phase 8.6.
- Completed the career conversion content work around About, Resume, Contact, and System Stack.
- Completed scope:
  - About content structure optimization
  - Profile Content System
  - Contact / CTA contact entry optimization
  - Profile i18n & content mapping polish
  - About / Profile / Contact final acceptance
- Keep this phase content-first: no Console / CLI, window-system, deployment-config, database, CMS, online chat, or fake resume-download changes unless separately planned.

### Phase 8.4.1: About Content Structure Optimization COMPLETED
- Optimized the homepage About / Profile section to clarify the author's positioning as a Java backend developer transitioning into AI Agent and TypeScript full-stack development.
- Added structured About content for current focus, enterprise-system background, what is being built, work style, and career direction.
- Extracted the main About content into `lib/profile.ts` as centralized bilingual profile data for easier maintenance.
- Linked the About section to real existing entries:
  - `/projects/personal-developer-os`
  - `/projects/ai-agent-demo`
  - `/blog`
  - `/blog/series/personal-developer-os`
- Preserved the Personal Developer OS shell, Main App / Console App model, Desktop fallback, System Status Bar, Blog system, Projects system, and deployment configuration.
- No Resume download, database, CMS, Agent API, online chat, Console / CLI behavior, window-system behavior, or deployment config changes.

### Phase 8.4.2: Profile Content System COMPLETED
- Added a lightweight file-based Profile content system under `content/profile`.
- Added Profile content source files:
  - `content/profile/profile.md`
  - `content/profile/contact-channels.md`
  - `content/profile/system-stack.md`
- Added Profile content architecture:
  - `ProfileRepository`
  - `FileProfileRepository`
  - `ProfileService`
- Homepage data assembly now fetches `PublicProfile` through `ProfileService` and passes serializable data into the Main App client components.
- About / Profile, Contact Channels, and System Stack homepage sections now render from ProfileService-provided content instead of maintaining full content in components.
- Kept Profile as a public, privacy-friendly personal profile rather than a full online resume or PDF download feature.
- Preserved anonymized enterprise-system experience, Java backend positioning, AI Agent / full-stack direction, Personal Developer OS and AI Agent Demo project links, and resume privacy note.
- Future CMS / database / admin sources can replace the repository implementation without rewriting page or component rendering.
- No real resume PDF, phone number, WeChat, address, real employer name, real client name, buyer name, sensitive project details, database, CMS, admin, Console / CLI behavior, window-system behavior, or deployment config changes.

### Phase 8.4.3: Contact / CTA 联系入口优化 COMPLETED
- Contact / CTA optimization is treated as completed before the current fix.
- Keep contact entry points privacy-friendly and avoid public resume PDF download links.
- Phase 8 was still in progress at this subphase; it is now closed by Phase 8.6.

#### Phase 8.4.3-fix: Merge Career Snapshot into Profile COMPLETED
- Removed the independent Career Snapshot / Resume Summary homepage module.
- Kept Profile as the unified public personal profile entry.
- Merged required career information into the Profile display:
  - Java backend background
  - AI Agent / TypeScript full-stack direction
  - anonymized enterprise-system experience
  - active project direction
  - career direction
  - resume privacy note
- Renamed the Profile content source from `content/profile/career-snapshot.md` to `content/profile/profile.md`.
- Updated ProfileService semantics from `getCareerSnapshot()` to `getProfile()` while preserving `getPublicProfile()`.
- Preserved System Stack, Contact Channels, Projects, Blog, Main App, Console App, Desktop fallback, and System Status Bar.
- No real resume PDF, resume download link, phone number, WeChat, address, real employer name, real client name, buyer name, Console / CLI, window-system behavior, or deployment config changes.

#### Phase 8.4.3-fix: Profile i18n & Content Mapping Polish COMPLETED
- Fixed Main App navigation labels that were still English in Chinese mode.
- Overview / Profile / Stack / Services / Logs / Contact now display localized labels through the existing `lib/translations.ts` i18n system.
- Added non-rendered HTML maintenance comments to `content/profile/profile.md` explaining how frontmatter fields and the Markdown body map to the current frontend.
- Clarified that `summary` is currently reserved as content metadata / CMS preview / future card or SEO summary text, not directly rendered on the homepage.
- Clarified that Career Snapshot remains merged into Profile and is not restored as a standalone module.
- Added maintenance comments to `content/profile/contact-channels.md` and `content/profile/system-stack.md` for visible channels, privacy rules, stack groups, and Learning / Exploring semantics.
- No ProfileService, PublicProfile shape, Console / CLI command system, window system, Blog core logic, Projects core logic, or deployment configuration changes.

### Phase 8.4.4: About / Profile / Contact Final Acceptance COMPLETED
- Completed final acceptance for Phase 8.4 About / Profile / Contact / System Stack work.
- Confirmed Profile / Contact Channels / System Stack are loaded through `ProfileService` and passed into the Main App as serializable `PublicProfile` data.
- Confirmed the independent Career Snapshot / Resume Summary module remains removed; career positioning is merged into Profile.
- Confirmed Profile naturally covers Java backend background, anonymized enterprise-system experience, AI Agent / TypeScript full-stack direction, Personal Developer OS, AI Agent Demo, career direction, and resume privacy note.
- Confirmed Main App tabs support bilingual labels: Overview / Profile / Stack / Services / Logs / Contact and the corresponding zh labels.
- Confirmed `content/profile/profile.md`, `content/profile/contact-channels.md`, and `content/profile/system-stack.md` include non-rendered maintenance comments for content-to-frontend mapping.
- Confirmed `summary` fields are reserved for metadata / CMS preview / future card or SEO summary use and are not rendered directly on the homepage.
- Confirmed Contact CTAs stay focused on public routes: `/blog`, `/projects`, `/projects/personal-developer-os`, and `/projects/ai-agent-demo`.
- Confirmed no real resume PDF was uploaded or linked.
- Confirmed phone number, WeChat ID, address, birthday, ID number, real employer names, real client names, buyer names, and sensitive project details are not publicly displayed.
- Confirmed unit / client / buyer information remains anonymized.
- Confirmed Learning / Exploring stack items are represented as learning areas rather than mature production expertise.
- No Console / CLI changes were made.
- No window-system behavior changes were made.
- No Blog or Projects core logic changes were made.
- No deployment configuration changes were made.

### Phase 8.5: Blog & Content Workflow Documentation COMPLETED
- Added bilingual content workflow documentation:
  - `docs/CONTENT_WORKFLOW.md`
  - `docs/CONTENT_WORKFLOW.zh-CN.md`
- Documented the maintenance workflow for the three file-based content sources:
  - Blog content in `content/blog`
  - Project content in `content/projects`
  - Profile content in `content/profile`
- Documented frontmatter usage for Blog, Project, and Profile content.
- Documented how `published`, `draft`, `featured`, `order`, `seriesSlug`, and `seriesOrder` affect public output.
- Documented local validation, commit workflow, production deployment, sitemap / RSS checks, privacy rules, and future CMS / DB repository migration direction.
- Added README and docs index links to the English and Chinese workflow documents.
- Phase 8.5 was completed before the final Phase 8.6 acceptance.

### Phase 8.6: Phase 8 Final Review / Content & Career Launch Acceptance COMPLETED
- Completed final acceptance for Phase 8 content and career-launch work.
- Confirmed the `从 Hexo 到 Personal Developer OS` series exists with seven published articles ordered by `seriesOrder`.
- Confirmed `/blog`, `/blog/series`, `/blog/series/personal-developer-os`, and published article pages are available.
- Confirmed blog article pages include reading stats and can link to related projects.
- Confirmed Projects use `content/projects` through `ProjectService`, and `/projects`, `/projects/personal-developer-os`, and `/projects/ai-agent-demo` are available.
- Confirmed `Personal Developer OS` links to the related blog series and `AI Agent Demo` remains an honest in-progress learning project.
- Confirmed Profile / Contact / System Stack use `content/profile` through `ProfileService`.
- Confirmed Career Snapshot remains merged into Profile and no standalone duplicate module is shown.
- Confirmed bilingual Content Workflow documentation exists and is linked from README / docs index.
- Confirmed sitemap includes published blog posts, series pages, and published project pages.
- Confirmed RSS includes published blog posts only and does not include project pages.
- Confirmed robots.txt points to sitemap.
- Confirmed privacy boundaries remain intact: no real resume PDF, phone number, WeChat ID, address, real employer names, real client names, buyer names, secrets, or fabricated metrics were added.
- No Console / CLI changes were made.
- No window-system behavior changes were made.
- No deployment configuration changes were made.

## Phase 9: Blog System Enhancement COMPLETED
- Blog system improvements for better content discovery and reading experience.
- Completed scope:
  - Blog Tag Pages
  - Article TOC
  - Previous / Next Navigation
  - Blog Search
  - Blog UX Final Polish

### Phase 9.1: Blog Tag Pages COMPLETED
- Added `BlogTag` type and `tagToSlug()` utility for stable tag-to-slug conversion.
- Extended `BlogRepository` with `getAllTagsDetailed()` and `BlogService` with `getAllTagsDetailed()`, `getTagBySlug()`, `getPostsByTagSlug()`.
- Added public tag listing page at `/blog/tags` with tag name, post count, latest updated date.
- Added public tag detail page at `/blog/tags/[tagSlug]` with post list sorted by date descending.
- Tags in `BlogCard` and `BlogArticle` are now clickable links to `/blog/tags/[tagSlug]`.
- Added "View tags" / "查看标签" entry on the `/blog` page.
- Sitemap includes `/blog/tags` and all tag detail pages.
- RSS remains blog-article-only.
- Draft posts are excluded from tag pages.
- Tag slug not found returns `notFound()`.
- No Console / CLI, window-system, deployment, Projects, or Profile changes.

### Phase 9.2: Article TOC COMPLETED
- Added automatic table of contents generation for `/blog/[slug]` article pages.
- TOC items are extracted from Markdown `h2` / `h3` headings only; page-level `h1` remains represented by the article title.
- Heading ids are generated through a shared stable slug utility that supports Chinese, English, numbers, spaces, and symbols.
- Duplicate heading ids receive numeric suffixes such as `project-background-2`.
- Code fences are ignored during TOC extraction, so `#` markers inside code blocks are not treated as headings.
- Markdown-rendered article headings receive matching `id` attributes for anchor navigation.
- TOC is hidden when an article has fewer than 2 supported headings.
- Mobile uses an in-flow TOC block before the body content, with no fixed sidebar or scroll obstruction.
- Active heading highlighting was intentionally not implemented in this phase.
- Sitemap and RSS remain unchanged.
- No Console / CLI, window-system, deployment, Projects core logic, or Profile core logic changes.

#### Phase 9.2-fix: Article TOC Layout & Active Reading State COMPLETED
- Moved desktop article TOC from the in-flow block to a left sidebar on `/blog/[slug]`.
- Added a wide article-detail layout while keeping blog list, series, tag, and project pages on their existing widths.
- The desktop TOC uses `position: sticky` with bounded height and internal scrolling for long TOCs.
- Mobile keeps the lightweight in-flow TOC before the article body, avoiding a forced sidebar and horizontal overflow.
- Added `ArticleToc` as a focused Client Component for active heading state only.
- Active heading is detected against the blog page scroll container with `IntersectionObserver` plus a lightweight scroll fallback.
- The active TOC item is highlighted and rendered with semibold text; h2 / h3 indentation is preserved.
- TOC anchor links still use stable heading ids generated by Phase 9.2 and jump to the corresponding headings.
- TOC styling reuses existing style tokens and supports light / dark plus macos / vercel presets.
- No TOC generation logic rewrite, BlogService, BlogRepository, content source, Console / CLI, window-system, deployment, Projects core logic, or Profile core logic changes.

#### Phase 9.2-fix-2: Floating Article TOC Sidebar COMPLETED
- Replaced the desktop article TOC's sticky layout with a true fixed floating sidebar on `/blog/[slug]`.
- The desktop TOC is fixed to the left side of the viewport with top and bottom offsets, so it remains visible while the article scrolls.
- The fixed TOC has bounded height and internal overflow scrolling for long tables of contents.
- Article content now reserves left-side desktop space with responsive padding so the floating TOC does not cover the reading column.
- The fixed sidebar is shown only on sufficiently wide desktop screens; smaller screens keep the existing in-flow TOC to avoid horizontal overflow.
- Active heading highlighting and semibold active text remain intact.
- TOC anchor clicks still jump to the stable heading ids generated by Phase 9.2.
- Styling continues to reuse existing tokens and supports light / dark plus macos / vercel presets.
- No TOC generation logic rewrite, BlogService, BlogRepository, content source, Console / CLI, window-system, deployment, Projects core logic, or Profile core logic changes.

### Phase 9.3: Previous / Next Navigation COMPLETED
- Added previous / next article navigation on `/blog/[slug]` detail pages after the article body.
- Added `BlogAdjacentPosts` and `BlogService.getAdjacentPosts(slug)` for published-only adjacent-post lookup.
- Series posts use the same published `getPostsBySeries(seriesSlug)` order, so `seriesOrder` controls reading sequence.
- Series navigation falls back to date ordering only when individual series entries lack `seriesOrder`.
- Non-series posts fall back to the global published-post date order.
- Draft posts are excluded from adjacent navigation.
- First series article shows only the next post, middle articles show previous and next, and the last article shows only the previous post.
- Added a lightweight `BlogAdjacentNav` component with desktop two-column layout and mobile stacked layout.
- Added zh / en translation keys for previous, next, continue-series, back-to-blog, and empty labels.
- Sitemap, RSS, article URLs, metadata, tag pages, and series pages remain unchanged.
- No Console / CLI, window-system, deployment, Projects core logic, or Profile core logic changes.

### Phase 9.4: Blog Search COMPLETED
- Added a public `/blog/search` route with metadata.
- Search data is fetched at build/server render time through `BlogService.getPublishedPosts()`.
- Search runs in a focused Client Component with local input state only.
- Search matches published posts by title, summary, tags, and series.
- Body content is intentionally not shipped to the client for this phase.
- Query handling is case-insensitive, trims leading/trailing spaces, and tolerates repeated spaces.
- Empty query shows recent posts; no-result query shows a lightweight empty state.
- Results reuse `BlogCard`, so result cards link to `/blog/[slug]` and keep the existing blog list style.
- Added a lightweight search entry on `/blog` beside the tags and series entries.
- Sitemap includes `/blog/search`.
- RSS remains blog-article-only and does not include the search page.
- Draft posts are excluded from search.
- No Console / CLI, window-system, deployment, Projects core logic, or Profile core logic changes.

### Phase 9.5: Blog UX Final Polish COMPLETED
- Completed final acceptance for the Phase 9 Blog enhancement work.
- Reviewed `/blog`, `/blog/search`, `/blog/tags`, `/blog/tags/[tagSlug]`, `/blog/series`, `/blog/series/personal-developer-os`, and `/blog/[slug]`.
- Confirmed Blog lists, tag pages, series pages, Article TOC, previous / next navigation, Blog Search, metadata, sitemap, RSS, and robots remain aligned.
- Confirmed published-only behavior for public Blog routes, sitemap, and RSS.
- Small fix: kept the inline Article TOC visible until the fixed floating desktop TOC breakpoint, avoiding a no-TOC gap on medium desktop widths.
- Confirmed Blog enhancements did not require Console / CLI, window-system, Projects core logic, Profile core logic, or deployment configuration changes.

## Phase 10: AI Agent Demo Integration IN PROGRESS
- Goal: upgrade `AI Agent Demo` from a project introduction page into a real, interactive, read-only Agent Demo.
- The demo must stay scope-limited to public site content: Profile, public stack, published Projects, published Blog content, AI Agent learning journey, and Personal Developer OS implementation notes.
- The demo must not become a general chatbot, execute commands, write files, access private data, expose secrets, or fabricate private experience / business metrics.

### Phase 10.1: Agent Demo Architecture & Safety Foundation COMPLETED
- Added isolated Agent Demo foundation under `features/agent-demo`.
- Added type definitions for request, response, trace steps, sources, usage info, validation results, and scope results.
- Added static configuration for supported locales, max input length, max sources, trace steps, public project slugs, and scope categories.
- Added reusable input validation:
  - `question` must be a string.
  - Trimmed question cannot be empty.
  - Input is limited to 800 characters.
  - Obvious abnormal payloads are rejected.
  - `locale` is limited to `zh` / `en`.
- Added trace helpers for the standard Agent Demo flow:
  - `input_validation`
  - `rate_limit_check`
  - `scope_check`
  - `retrieve_context`
  - `generate_answer`
- Added safety policy and scope policy constants documenting allowed / blocked scope and forbidden tools.
- Added a foundation-only service response for future route integration.
- Added `docs/AGENT_DEMO_ARCHITECTURE.md` with first-version goals, public scope, forbidden scope, API contract, safety boundary, tool permissions, rate-limit strategy, trace / sources contract, and future phases.
- No real model integration was added.
- No Redis integration was added.
- No `/api/agent-demo` route was added.
- No `/agent-demo` UI was added.
- No Blog / Projects / Profile core logic was changed.
- No Console / CLI changes were made.
- No window-system behavior changes were made.
- No Docker / Nginx / deployment configuration changes were made.

### Phase 10.2: Read-only Knowledge Tools & Scope Classifier COMPLETED
- Added read-only Agent Demo tools under `features/agent-demo/tools`.
- Added Blog knowledge tools:
  - `searchBlogPosts(query)`
  - `getBlogPostBySlug(slug)`
  - `getRecentBlogPosts(limit)`
- Added Project knowledge tools:
  - `searchProjects(query)`
  - `getProjectBySlug(slug)`
  - `getPublishedProjectSummaries(limit)`
- Added Profile knowledge tools:
  - `getPublicProfile(locale)`
  - `getSystemStack(locale)`
  - `getPublicContact(locale)`
- Added a rule-based `scopeClassifier` for allowed and blocked categories.
- Added `publicKnowledgeRetriever` that calls only public Blog / Projects / Profile tools according to the scope category.
- Retriever returns bounded `contextText`, public `sources`, and trace updates.
- Draft Blog / Project content remains excluded through published-only service methods.
- No real model integration was added.
- No `/api/agent-demo` route was added.
- No `/agent-demo` UI was added.
- No Redis integration was added.
- No Console / CLI changes were made.
- No window-system behavior changes were made.
- No Docker / Nginx / deployment configuration changes were made.

### Phase 10.2.1: Agent Demo Unit Test Foundation COMPLETED
- Added Vitest as the focused unit test runner for Agent Demo foundation work.
- Added `test` and `test:watch` pnpm scripts.
- Added `vitest.config.ts` with the existing `@` path alias and Node test environment.
- Added focused tests for:
  - Agent Demo input validation.
  - Rule-based scope classification.
  - Text utility helpers.
  - Public knowledge retrieval routing, blocked-scope behavior, trace status, and source deduplication.
- Kept this as a test-only subphase before Phase 10.3.
- No real model integration was added.
- No `/api/agent-demo` route was added.
- No `/agent-demo` UI was added.
- No Redis integration was added.
- No Console / CLI changes were made.
- No window-system behavior changes were made.
- No Docker / Nginx / deployment configuration changes were made.
- Verification: `pnpm test`, `pnpm lint`, and `pnpm build` passed.

### Phase 10.3: Read-only Agent API MVP COMPLETED
- Added `POST /api/agent-demo`.
- Added server-only model adapter using an OpenAI-compatible Chat Completions API through native `fetch`.
- Added explicit server-only environment configuration:
  - `AGENT_DEMO_MODEL_API_URL`
  - `AGENT_DEMO_MODEL_API_KEY`
  - `AGENT_DEMO_MODEL`
- Upgraded `agentDemoService` into the shared API pipeline:
  - input validation
  - scope classification
  - public knowledge retrieval
  - model answer generation
- Added safe refusal for blocked categories before retrieval or model generation.
- Added safe no-context and model-error responses without exposing stack traces, raw upstream errors, secrets, or environment values.
- API responses preserve `answer`, `allowed`, `category`, `trace`, `sources`, `usage`, and optional `error`.
- Added service-level unit tests for validation failure, blocked scope, successful model generation, and safe model unavailable handling.
- Kept `rate_limit_check` as a passed placeholder with Phase 10.4 explicitly responsible for persistent rate limiting.
- No `/agent-demo` UI was added.
- No Redis integration was added.
- No Console / CLI changes were made.
- No window-system behavior changes were made.
- No Docker / Nginx deployment files were changed.
- Verification: `pnpm test`, `pnpm lint`, and `pnpm build` passed.

### Phase 10.4: Rate Limit, Timeout & Abuse Protection COMPLETED
- Added in-process fixed-window rate limiting for `POST /api/agent-demo`.
- Added client identifier detection from `x-forwarded-for`, `x-real-ip`, `cf-connecting-ip`, then `local` fallback.
- Added `429` responses with `Retry-After` for rate-limited requests.
- Added configurable protection environment variables:
  - `AGENT_DEMO_MODEL_TIMEOUT_MS`
  - `AGENT_DEMO_RATE_LIMIT_WINDOW_MS`
  - `AGENT_DEMO_RATE_LIMIT_MAX_REQUESTS`
- Added model request timeout via `AbortController`.
- Added safe `upstream_timeout` handling without exposing upstream details.
- Added context and output length limits while preserving existing input and source limits.
- Extended `usage` with output length and rate-limit metadata.
- Added focused unit tests for rate limiting, service short-circuiting, model timeout, output clamp, and context clamp.
- Redis-backed distributed rate limiting remains deferred until multi-instance production needs it.
- No `/agent-demo` UI was added.
- No Console / CLI changes were made.
- No window-system behavior changes were made.
- No Docker / Nginx deployment files were changed.

### Phase 10.5: Agent Demo UI & Trace Display COMPLETED
- Added public `/agent-demo` page.
- Added an OS-style Agent Demo tool surface using the existing Project layout and settings toggles.
- Added question input, submit button, character counter, sample questions, loading state, network error state, model error state, and rate-limit state.
- Added answer display with preserved line breaks.
- Added trace display for input validation, rate-limit check, scope check, retrieval, and generation.
- Added public sources display with source type, title, excerpt, and internal links.
- Added a scope notice that keeps the demo framed as public read-only.
- Added `/agent-demo` to sitemap.
- Added a lightweight `/agent-demo` entry point from the AI Agent Demo project frontmatter.
- Preserved server-only knowledge retrieval boundaries by importing only client-safe Agent Demo types/config in the UI.
- No Console / CLI changes were made.
- No window-system behavior changes were made.
- No Docker / Nginx deployment files were changed.

### Phase 10.6: Production Deployment & Safety Verification COMPLETED
- Added Agent Demo production environment variable guidance to the deployment docs.
- Documented production recommendations for:
  - `AGENT_DEMO_MODEL_API_URL`
  - `AGENT_DEMO_MODEL_API_KEY`
  - `AGENT_DEMO_MODEL`
  - `AGENT_DEMO_MODEL_TIMEOUT_MS`
  - `AGENT_DEMO_RATE_LIMIT_WINDOW_MS`
  - `AGENT_DEMO_RATE_LIMIT_MAX_REQUESTS`
  - `AGENT_DEMO_LOG_LEVEL`
  - `AGENT_DEMO_RUN_LIVE_TEST`
- Documented recommended production log-level usage: `info` by default, `debug` only during short troubleshooting windows, `silent` only after the feature is stable.
- Added Nginx `limit_req_zone` / `limit_req` guidance for `/api/agent-demo`.
- Added online validation commands for safe public questions, blocked secret questions, log checks, and rate-limit behavior.
- Added Agent Demo production safety verification notes to the architecture document.
- No runtime code changes were made.
- No Console / CLI changes were made.
- No window-system behavior changes were made.
- No Docker / Nginx tracked config files were changed.

### Phase 10.7: Phase 10 Final Review PLANNED
- Planned: final acceptance for the first public Agent Demo version.
