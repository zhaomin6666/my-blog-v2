# Admin Security Audit

## Scope

This audit covers the current Admin CMS security baseline for the open-source Personal Developer OS / AI Native Portfolio CMS project.

- `/admin` pages
- Admin Server Actions
- Admin Route Handlers
- Login flow
- Session Cookie
- Admin environment variables
- Production deployment documentation

## Current Security Model

The current Admin security model is intentionally small and deployment-friendly:

- Single administrator account
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD_HASH`
- `ADMIN_SESSION_SECRET`
- Signed session cookie
- Session cookie scoped with `Path=/admin`
- Admin pages and Admin operations are protected by `requireAdminSession`
- `/admin/login` is the public entry point

## Completed Hardening

- [x] Audited Admin permission boundaries
- [x] Added `pnpm security:admin` permission-boundary check script
- [x] Scoped the Admin session cookie to `/admin`
- [x] Made logout clear both `/admin` and historical `/` path cookies
- [x] Added login rate-limit client identifier support for `cf-connecting-ip`, `x-real-ip`, and `x-forwarded-for`
- [x] Removed specific environment variable names from login error messages
- [x] Ensured `ADMIN_AUTH_DEBUG` is ineffective in production
- [x] Added `pnpm admin:secrets` for generating `ADMIN_PASSWORD_HASH` and `ADMIN_SESSION_SECRET`
- [x] Added Admin security notes to `.env.example`
- [x] Added an Admin Security Checklist to the production deployment documentation
- [x] Synchronized the Admin Security Checklist into the Chinese production deployment documentation

## Known Limitations

The following limitations are accepted for the current phase:

- Only one administrator account is supported
- No RBAC
- No 2FA
- Login rate limiting uses an in-process `Map`, which is not suitable as a shared limiter across multiple instances
- `pnpm security:admin` is still required to prevent newly added Admin entry points from accidentally missing authorization

## Rules for Future Admin Features

Future Admin work must follow these rules:

- New `app/admin` pages must call `requireAdminSession`
- New `app/admin` route handlers must call `requireAdminSession`
- New Server Actions must call `requireAdminSession` or reuse an existing protected helper
- Run `pnpm security:admin` after adding Admin files
- Do not expose secrets, environment variable names, or database connection details in frontend error messages
- Do not commit real `.env` files, hashes, secrets, or database URLs to the repository

## Optional Future Improvements

The following improvements are intentionally deferred and can be considered in later phases:

- Redis-based rate limit
- 2FA
- Multiple admin users
- RBAC
- Audit log
- CSRF token hardening
- Middleware-level `/admin` fallback protection
