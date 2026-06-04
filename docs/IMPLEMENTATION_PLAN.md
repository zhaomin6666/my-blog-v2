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

## Phase 6: Blog Publishing System + SEO + Deployment 🚧 IN PROGRESS

### Phase 6.1: CMS-ready Blog Content Architecture 🚧 IN PROGRESS
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

### Phase 6.6: Final Production Polish (Deferred)
- favicon / icons
- final deployment smoke check
