import 'server-only';

import { createHash, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionPayload,
  createSignedSessionToken,
  getAdminSessionMaxAgeSeconds,
  verifySignedSessionToken,
  type AdminSessionPayload,
} from './admin-session';
import {
  ADMIN_PASSWORD_HASH_ENV,
  ADMIN_SESSION_SECRET_ENV,
  ADMIN_USERNAME_ENV,
  checkAdminEnv,
  normalizeAdminPasswordHash,
} from './admin-env-check';

export { ADMIN_PASSWORD_HASH_ENV, ADMIN_SESSION_SECRET_ENV, ADMIN_USERNAME_ENV };

export interface AdminCredentialsConfig {
  username: string;
  passwordHash: string;
  sessionSecret: string;
}

type AdminAuthLogValue = string | number | boolean | null | undefined;
type AdminAuthLogData = Record<string, AdminAuthLogValue>;

export function isAdminAuthDebugEnabled(): boolean {
  return process.env.ADMIN_AUTH_DEBUG === 'true';
}

export function logAdminAuth(event: string, data: AdminAuthLogData = {}): void {
  if (!isAdminAuthDebugEnabled()) return;

  console.info('[admin-auth]', event, data);
}

export function getAdminCredentialsConfig(): AdminCredentialsConfig | null {
  const check = checkAdminEnv();

  const username = process.env[ADMIN_USERNAME_ENV]?.trim();
  const passwordHash = process.env[ADMIN_PASSWORD_HASH_ENV]?.trim();
  const sessionSecret = process.env[ADMIN_SESSION_SECRET_ENV]?.trim();
  const normalizedPasswordHash = passwordHash
    ? normalizeAdminPasswordHash(passwordHash).toLowerCase()
    : '';

  logAdminAuth('credentials.config', {
    ok: check.ok,
    usernamePresent: Boolean(username),
    usernameLength: username?.length ?? 0,
    passwordHashPresent: Boolean(passwordHash),
    passwordHashLength: passwordHash?.length ?? 0,
    normalizedPasswordHashLength: normalizedPasswordHash.length,
    passwordHashFormatValid: /^[a-f0-9]{64}$/.test(normalizedPasswordHash),
    sessionSecretPresent: Boolean(sessionSecret),
    sessionSecretLength: sessionSecret?.length ?? 0,
    errorCount: check.errors.length,
    warningCount: check.warnings.length,
  });

  if (!check.ok) return null;

  if (!username || !passwordHash || !sessionSecret) {
    return null;
  }

  return {
    username,
    passwordHash,
    sessionSecret,
  };
}

export function verifyAdminPassword(password: string, expectedHash: string): boolean {
  const normalizedHash = normalizeAdminPasswordHash(expectedHash).toLowerCase();
  if (!/^[a-f0-9]{64}$/.test(normalizedHash)) return false;

  const actualHash = createHash('sha256').update(password, 'utf8').digest('hex');
  const actual = Buffer.from(actualHash, 'hex');
  const expected = Buffer.from(normalizedHash, 'hex');

  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  const config = getAdminCredentialsConfig();
  if (!config) {
    logAdminAuth('session.read', {
      configPresent: false,
      cookiePresent: false,
      cookieLength: 0,
      sessionValid: false,
    });
    return null;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const session = await verifySignedSessionToken(token, config.sessionSecret);

  logAdminAuth('session.read', {
    configPresent: true,
    cookiePresent: Boolean(token),
    cookieLength: token?.length ?? 0,
    sessionValid: Boolean(session),
  });

  return session;
}

export async function hasAdminSession(): Promise<boolean> {
  return Boolean(await getAdminSession());
}

export async function requireAdminSession(): Promise<AdminSessionPayload> {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  return session;
}

export async function setAdminSessionCookie(username: string): Promise<void> {
  const config = getAdminCredentialsConfig();
  if (!config) {
    throw new Error('Admin credentials are not configured.');
  }

  const cookieStore = await cookies();
  const legacyCookieOptions = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/admin',
    maxAge: 0,
  };
  const token = await createSignedSessionToken(
    createAdminSessionPayload(username),
    config.sessionSecret,
  );
  const cookieOptions = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: getAdminSessionMaxAgeSeconds(),
  };

  cookieStore.set(ADMIN_SESSION_COOKIE, '', legacyCookieOptions);
  logAdminAuth('session.clear_legacy_cookie', {
    path: legacyCookieOptions.path,
    secure: legacyCookieOptions.secure,
    sameSite: legacyCookieOptions.sameSite,
    maxAge: legacyCookieOptions.maxAge,
  });
  logAdminAuth('session.set_cookie', {
    cookieLength: token.length,
    path: cookieOptions.path,
    secure: cookieOptions.secure,
    sameSite: cookieOptions.sameSite,
    maxAge: cookieOptions.maxAge,
  });

  cookieStore.set(ADMIN_SESSION_COOKIE, token, cookieOptions);
}

export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  const cookieOptions = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  };
  const legacyCookieOptions = {
    ...cookieOptions,
    path: '/admin',
  };

  logAdminAuth('session.clear_cookie', {
    path: cookieOptions.path,
    secure: cookieOptions.secure,
    sameSite: cookieOptions.sameSite,
    maxAge: cookieOptions.maxAge,
  });

  cookieStore.set(ADMIN_SESSION_COOKIE, '', cookieOptions);
  cookieStore.set(ADMIN_SESSION_COOKIE, '', legacyCookieOptions);
  logAdminAuth('session.clear_legacy_cookie', {
    path: legacyCookieOptions.path,
    secure: legacyCookieOptions.secure,
    sameSite: legacyCookieOptions.sameSite,
    maxAge: legacyCookieOptions.maxAge,
  });
}
