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

## Phase 4: CLI Command System IN PROGRESS
- Command parser
- Command history
- Implement: help, about, skills, projects, blog, contact, resume, clear, classic, whoami, sudo hire me
- Link to Main App scroll or highlight
- Console maximized pure terminal mode

### Phase 4.1 / 4.2: Basic CLI Skeleton & Text Outputs COMPLETED
- Console App accepts typed commands and executes on Enter.
- Console App renders command history and plain-text command output.
- Basic parser supports: help, about, skills, projects, blog, contact, resume, clear, classic, whoami, sudo hire me.
- Command outputs support zh / en.
- skills / projects / blog commands reuse local mock data.
- clear and unknown command handling are implemented.
- Main App linkage remains deferred to a later Phase 4 step.

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
