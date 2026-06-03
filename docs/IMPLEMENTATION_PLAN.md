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

## Phase 5: Visual Polish
- macos preset visual optimization
- vercel preset visual optimization
- light / dark individual optimization
- Responsive optimization
- Animation optimization

## Phase 6: SEO & Deployment Prep
- metadata
- openGraph
- twitter card
- favicon / icons
- build check
- deployment check
