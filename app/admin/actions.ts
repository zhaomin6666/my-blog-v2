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
  requireAdminSession,
  setAdminSessionCookie,
  verifyAdminPassword,
} from '@/lib/admin/admin-auth';

function getClientIdentifier(headerStore: Headers): string {
  return (
    headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headerStore.get('x-real-ip')?.trim() ||
    'local'
  );
}

export async function loginAction(formData: FormData): Promise<void> {
  const headerStore = await headers();
  const identifier = getClientIdentifier(headerStore);
  const rateLimit = checkAdminLoginRateLimit(identifier);

  if (!rateLimit.allowed) {
    redirect(`/admin/login?error=rate-limited&retryAfter=${rateLimit.retryAfterSeconds ?? 60}`);
  }

  const config = getAdminCredentialsConfig();
  if (!config) {
    redirect('/admin/login?error=not-configured');
  }

  const username = String(formData.get('username') || '').trim();
  const password = String(formData.get('password') || '');

  if (username !== config.username || !verifyAdminPassword(password, config.passwordHash)) {
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
