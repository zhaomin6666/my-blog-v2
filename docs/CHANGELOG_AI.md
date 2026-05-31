# AI Development Changelog

## Purpose
This file records major changes made by AI coding tools such as Codex and Claude Code.

Every major change should include:
- Date
- Tool used
- Summary
- Files changed
- Design impact
- Follow-up notes

## Current design baseline
The project baseline is **Personal Developer OS**:
- System Status Bar
- Main App
- Console App
- Desktop fallback
- macos / vercel style presets
- light / dark themes
- zh / en language switching

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
