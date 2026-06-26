# Release Checklist

This checklist is for maintainers before tagging or publishing an open-source release.

It covers file mode, database mode documentation, public docs, environment examples, Admin safety, and sensitive information scans.

## 1. Required Commands

```bash
pnpm lint
pnpm build
pnpm security:admin
pnpm security:public
pnpm release:check
```

## 2. File Mode Checks

- `.env.example` supports file mode.
- `CONTENT_SOURCE=file` works without PostgreSQL.
- Public pages build without `PERSONAL_SITE_DATABASE_URL`.
- Sitemap, robots, and RSS are generated from public content only.

## 3. Database Mode Checks

- Migrations are documented and manual.
- Admin auth env variables are documented.
- Database mode does not auto-switch public content sources.
- Admin routes remain protected.
- Empty database fallback behavior is documented.

## 4. Documentation Checks

- `README.md` and `README.zh-CN.md` are current.
- Getting Started docs are first-run oriented.
- Deployment docs are concise and current.
- Content Workflow reflects the current file/database source matrix.
- Development history docs are secondary references.

## 5. Sensitive Information Checks

Confirm no private data appears in public release files:

- real production secrets
- real database URLs
- private `.env` files
- real server IPs
- real backup dump paths
- private account names
- private business/client information
- private contact information

## 6. Release Notes

- Summarize major user-facing changes.
- Mention migration requirements if any.
- Mention whether database migrations changed.
- Mention known limitations.

## 7. Tagging

```bash
git status
git tag vX.Y.Z
git push origin vX.Y.Z
```
