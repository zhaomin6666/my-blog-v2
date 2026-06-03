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

## Phase 5: Visual Polish 🔄 IN PROGRESS

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

### Phase 5.3: light / dark Theme Polish IN PROGRESS
- macOS light card borders: `border-white/60` → `border-zinc-200/40` for visible card boundaries on light backgrounds
- macOS light nested card borders: `border-white/50` → `border-zinc-200/30` for visible nested panel boundaries
- macOS dark nested card background: `bg-slate-950/55` → `bg-slate-950/70` to fix overly transparent nested panels in dark mode
- macOS dark status bar: `dark:bg-black/50` → `dark:bg-black/60` for more solid toolbar in dark mode
- Vercel dark card borders: `border-zinc-800` → `border-zinc-700` for clearer panel edges in dark mode
- Vercel dark nested card borders: `border-zinc-800` → `border-zinc-700` for clearer nested panel edges
- Vercel dark title bar: `bg-zinc-900/50` → `bg-zinc-900` (solid) and border `zinc-800` → `zinc-700` for crisper window chrome
- Vercel dark status bar border: `border-zinc-800` → `border-zinc-700` for clearer top bar separation
- No component changes, no structural changes, no new features

### Phase 5.4: Responsive / Mobile Optimization IN PROGRESS
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

## Phase 6: SEO & Deployment Prep
- metadata
- openGraph
- twitter card
- favicon / icons
- build check
- deployment check
