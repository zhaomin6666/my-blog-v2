import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { checkAdminEnv, MIN_ADMIN_SESSION_SECRET_LENGTH } from './admin-env-check';

function sha256(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

describe('checkAdminEnv', () => {
  it('rejects missing ADMIN_USERNAME', () => {
    const result = checkAdminEnv({
      ADMIN_PASSWORD_HASH: sha256('safe-password'),
      ADMIN_SESSION_SECRET: 'x'.repeat(MIN_ADMIN_SESSION_SECRET_LENGTH),
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toContain('ADMIN_USERNAME is required for Admin login.');
  });

  it('rejects missing ADMIN_PASSWORD_HASH', () => {
    const result = checkAdminEnv({
      ADMIN_USERNAME: 'owner',
      ADMIN_SESSION_SECRET: 'x'.repeat(MIN_ADMIN_SESSION_SECRET_LENGTH),
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toContain('ADMIN_PASSWORD_HASH is required for Admin login.');
  });

  it('rejects missing ADMIN_SESSION_SECRET', () => {
    const result = checkAdminEnv({
      ADMIN_USERNAME: 'owner',
      ADMIN_PASSWORD_HASH: sha256('safe-password'),
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toContain('ADMIN_SESSION_SECRET is required for Admin sessions.');
  });

  it('rejects short ADMIN_SESSION_SECRET', () => {
    const result = checkAdminEnv({
      ADMIN_USERNAME: 'owner',
      ADMIN_PASSWORD_HASH: sha256('safe-password'),
      ADMIN_SESSION_SECRET: 'short',
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toContain('ADMIN_SESSION_SECRET must be at least 32 characters.');
  });

  it('rejects a known default password hash', () => {
    const result = checkAdminEnv({
      ADMIN_USERNAME: 'owner',
      ADMIN_PASSWORD_HASH: sha256('password'),
      ADMIN_SESSION_SECRET: 'x'.repeat(MIN_ADMIN_SESSION_SECRET_LENGTH),
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toContain('ADMIN_PASSWORD_HASH must not match a known default password.');
  });

  it('allows admin as a username while still requiring a non-default password hash', () => {
    const result = checkAdminEnv({
      ADMIN_USERNAME: 'admin',
      ADMIN_PASSWORD_HASH: sha256('a long local admin password'),
      ADMIN_SESSION_SECRET: 'x'.repeat(MIN_ADMIN_SESSION_SECRET_LENGTH),
    });

    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('accepts complete non-default credentials', () => {
    const result = checkAdminEnv({
      ADMIN_USERNAME: 'owner',
      ADMIN_PASSWORD_HASH: sha256('a long local admin password'),
      ADMIN_SESSION_SECRET: 'x'.repeat(MIN_ADMIN_SESSION_SECRET_LENGTH),
    });

    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
  });
});
