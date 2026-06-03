# AI Development Changelog

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
