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
- Chinese and English copy must be centralized in translations.
- No hardcoded strings scattered in components.
- Mock data should also consider bilingual structure.

## 5. Theme & Style Rules
- `theme` controls light / dark.
- `stylePreset` controls macos / vercel.
- Do NOT mix theme and stylePreset together.
- Do NOT write completely independent components for a single theme.

## 6. Package Manager Rules
- Use **pnpm** as the only package manager.
- Do NOT use npm, yarn, or bun for dependency operations.
- Do NOT commit `package-lock.json`, `yarn.lock`, or `bun.lockb`.
- `pnpm-lock.yaml` is the single source of truth for lockfile.
- Always run `pnpm install` after pulling changes that may update dependencies.

## 7. Quality Rules
- Run `pnpm lint` after meaningful changes.
- Run `pnpm build` when possible.
- Fix TypeScript errors.
- Avoid `any`.
- Avoid unnecessary third-party libraries.
- Use animations sparingly.
