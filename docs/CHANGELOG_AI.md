# AI Development Changelog

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
