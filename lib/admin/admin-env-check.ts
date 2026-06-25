import { createHash } from 'node:crypto';

export const ADMIN_USERNAME_ENV = 'ADMIN_USERNAME';
export const ADMIN_PASSWORD_HASH_ENV = 'ADMIN_PASSWORD_HASH';
export const ADMIN_SESSION_SECRET_ENV = 'ADMIN_SESSION_SECRET';
export const MIN_ADMIN_SESSION_SECRET_LENGTH = 32;

export interface AdminEnvCheckResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
}

export interface AdminEnvValues {
  username?: string;
  passwordHash?: string;
  sessionSecret?: string;
}

const placeholderValues = new Set([
  'changeme',
  'change_me',
  'change-me',
  'replace_me',
  'replace-me',
  'todo',
  'example',
  'password',
  'admin',
  'secret',
]);

const defaultPasswordHashes = new Set(
  ['admin', 'password', 'changeme', 'change-me', '123456', 'admin123', 'password123'].map(
    (password) => createHash('sha256').update(password, 'utf8').digest('hex'),
  ),
);

export function normalizeAdminPasswordHash(value: string): string {
  if (value.startsWith('sha256:')) return value.slice('sha256:'.length);
  if (value.startsWith('$sha256$')) return value.slice('$sha256$'.length);
  return value;
}

function readAdminEnvValues(env: NodeJS.ProcessEnv = process.env): AdminEnvValues {
  return {
    username: env[ADMIN_USERNAME_ENV]?.trim(),
    passwordHash: env[ADMIN_PASSWORD_HASH_ENV]?.trim(),
    sessionSecret: env[ADMIN_SESSION_SECRET_ENV]?.trim(),
  };
}

function isPlaceholder(value: string | undefined): boolean {
  if (!value) return false;
  return placeholderValues.has(value.trim().toLowerCase());
}

export function checkAdminEnv(env: NodeJS.ProcessEnv = process.env): AdminEnvCheckResult {
  const { username, passwordHash, sessionSecret } = readAdminEnvValues(env);
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!username) {
    errors.push(`${ADMIN_USERNAME_ENV} is required for Admin login.`);
  } else if (isPlaceholder(username)) {
    errors.push(`${ADMIN_USERNAME_ENV} must not use a placeholder value.`);
  }

  if (!passwordHash) {
    errors.push(`${ADMIN_PASSWORD_HASH_ENV} is required for Admin login.`);
  } else {
    const normalizedHash = normalizeAdminPasswordHash(passwordHash).toLowerCase();
    if (!/^[a-f0-9]{64}$/.test(normalizedHash)) {
      errors.push(`${ADMIN_PASSWORD_HASH_ENV} must be a sha256 hex digest.`);
    } else if (defaultPasswordHashes.has(normalizedHash)) {
      errors.push(`${ADMIN_PASSWORD_HASH_ENV} must not match a known default password.`);
    }
  }

  if (!sessionSecret) {
    errors.push(`${ADMIN_SESSION_SECRET_ENV} is required for Admin sessions.`);
  } else if (isPlaceholder(sessionSecret)) {
    errors.push(`${ADMIN_SESSION_SECRET_ENV} must not use a placeholder value.`);
  } else if (sessionSecret.length < MIN_ADMIN_SESSION_SECRET_LENGTH) {
    errors.push(
      `${ADMIN_SESSION_SECRET_ENV} must be at least ${MIN_ADMIN_SESSION_SECRET_LENGTH} characters.`,
    );
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
  };
}

