import 'server-only';

const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 5;

const attempts = new Map<string, { count: number; resetAt: number }>();

export interface AdminLoginRateLimitResult {
  allowed: boolean;
  retryAfterSeconds?: number;
}

export function checkAdminLoginRateLimit(identifier: string): AdminLoginRateLimitResult {
  const now = Date.now();
  const existing = attempts.get(identifier);

  if (!existing || existing.resetAt <= now) {
    attempts.set(identifier, {
      count: 1,
      resetAt: now + WINDOW_MS,
    });
    return { allowed: true };
  }

  if (existing.count >= MAX_ATTEMPTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  existing.count++;
  return { allowed: true };
}

export function clearAdminLoginRateLimit(identifier: string): void {
  attempts.delete(identifier);
}
