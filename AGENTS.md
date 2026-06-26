# Project Instructions for Codex

## Must read before every task
Before making changes, read:
- `docs/DESIGN_BRIEF.md`
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/DEVELOPMENT_RULES.md`
- `docs/CHANGELOG_AI.md`

## Project identity
This is an **AI Native Portfolio CMS** with a Developer OS starter shell, not a normal portfolio template.

The page is a lightweight browser-based desktop OS containing exactly two apps:
- **Main App**: The primary content window
- **Console App**: A terminal/console dock panel

When both apps are closed, a **Desktop** placeholder is shown.

## Non-negotiable design guards
- Keep the Developer OS concept.
- Keep the System Status Bar.
- Keep the Main App and Console App model.
- Keep the Desktop fallback state.
- Keep stylePreset switching: `macos` / `vercel`.
- Keep theme switching: `light` / `dark`.
- Keep language switching: `zh` / `en`.
- Do not turn this into a generic Hero + About + Projects website.

## Engineering rules
- Do not import from `reference/`.
- Do not put all code into `app/page.tsx`.
- Keep components modular.
- Use local mock data first.
- Preserve TypeScript type safety.
- Run lint/build after meaningful changes.
- Update `docs/CHANGELOG_AI.md` after major changes.

## First principle
When design and implementation conflict, preserve the **AI Native Portfolio CMS** product concept and Developer OS starter shell first.
