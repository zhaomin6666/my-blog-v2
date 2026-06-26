'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  clearAdminLoginRateLimit,
  checkAdminLoginRateLimit,
} from '@/lib/admin/admin-login-rate-limit';
import {
  clearAdminSessionCookie,
  getAdminCredentialsConfig,
  logAdminAuth,
  requireAdminSession,
  setAdminSessionCookie,
  verifyAdminPassword,
} from '@/lib/admin/admin-auth';

function cleanHeaderValue(value: string | null): string {
  return value?.trim() || '';
}

function getAdminClientIdentifier(headerStore: Headers): string {
  const cloudflareIp = cleanHeaderValue(headerStore.get('cf-connecting-ip'));
  if (cloudflareIp) return cloudflareIp;

  const realIp = cleanHeaderValue(headerStore.get('x-real-ip'));
  if (realIp) return realIp;

  const forwardedFor = cleanHeaderValue(headerStore.get('x-forwarded-for')?.split(',')[0] ?? null);
  if (forwardedFor) return forwardedFor;

  return 'local';
}

export async function loginAction(formData: FormData): Promise<void> {
  const headerStore = await headers();
  const identifier = getAdminClientIdentifier(headerStore);
  const rateLimit = checkAdminLoginRateLimit(identifier);

  logAdminAuth('login.rate_limit', {
    identifier,
    rateLimitAllowed: rateLimit.allowed,
    retryAfterSeconds: rateLimit.retryAfterSeconds ?? null,
  });

  if (!rateLimit.allowed) {
    redirect(`/admin/login?error=rate-limited&retryAfter=${rateLimit.retryAfterSeconds ?? 60}`);
  }

  const config = getAdminCredentialsConfig();
  if (!config) {
    logAdminAuth('login.config_missing', {
      identifier,
      usernamePresent: Boolean(String(formData.get('username') || '').trim()),
      rateLimitAllowed: rateLimit.allowed,
    });
    redirect('/admin/login?error=not-configured');
  }

  const username = String(formData.get('username') || '').trim();
  const password = String(formData.get('password') || '');
  const usernameMatches = username === config.username;
  const passwordValid = verifyAdminPassword(password, config.passwordHash);

  logAdminAuth('login.credentials_checked', {
    identifier,
    usernamePresent: Boolean(username),
    usernameMatches,
    passwordValid,
    rateLimitAllowed: rateLimit.allowed,
  });

  if (!usernameMatches || !passwordValid) {
    redirect('/admin/login?error=invalid');
  }

  clearAdminLoginRateLimit(identifier);
  await setAdminSessionCookie(config.username);

  const nextPath = String(formData.get('next') || '/admin');
  redirect(nextPath.startsWith('/admin') ? nextPath : '/admin');
}

export async function logoutAction(): Promise<void> {
  await requireAdminSession();
  await clearAdminSessionCookie();
  redirect('/admin/login');
}
