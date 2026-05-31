# Project Instructions for Claude Code

## Must read before every task
Before editing code, read:
- `docs/DESIGN_BRIEF.md`
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/DEVELOPMENT_RULES.md`
- `docs/CHANGELOG_AI.md`

## Project identity
This project is a **browser-based Personal Developer OS** for a backend developer building AI-era products.

It is **not** a generic portfolio, not a normal blog, and not a resume template.

## Design constraints
Claude must preserve:
- Developer OS shell
- macOS-like System Status Bar
- Main App window
- Bottom Dock-style Console App
- Desktop placeholder when both apps are closed
- `macos` / `vercel` visual presets
- `light` / `dark` themes
- `zh` / `en` language switching

## Development behavior
- Prefer small, reviewable changes.
- Do not rewrite unrelated files.
- Do not duplicate existing components.
- Do not create a second implementation path for the same feature.
- Do not hardcode Chinese and English text inside components.
- Use translations config for copy.
- Use shared style tokens for visual presets.
- Keep `reference/` read-only.
- Update `docs/CHANGELOG_AI.md` after major work.

## Design priority
If asked to optimize UI, improve within the existing **Personal Developer OS** concept.
Never simplify it back into a generic landing page.
