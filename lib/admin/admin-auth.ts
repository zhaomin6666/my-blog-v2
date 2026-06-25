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

export function getAdminCredentialsConfig(): AdminCredentialsConfig | null {
  const check = checkAdminEnv();
  if (!check.ok) return null;

  const username = process.env[ADMIN_USERNAME_ENV]?.trim();
  const passwordHash = process.env[ADMIN_PASSWORD_HASH_ENV]?.trim();
  const sessionSecret = process.env[ADMIN_SESSION_SECRET_ENV]?.trim();

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
  if (!config) return null;

  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  return verifySignedSessionToken(token, config.sessionSecret);
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
  const token = await createSignedSessionToken(
    createAdminSessionPayload(username),
    config.sessionSecret,
  );

  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/admin',
    maxAge: getAdminSessionMaxAgeSeconds(),
  });
}

export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/admin',
    maxAge: 0,
  });
}
