export const PERSONAL_SITE_DATABASE_URL_ENV = 'PERSONAL_SITE_DATABASE_URL';

export function getPersonalSiteDatabaseUrl(): string | undefined {
  const value = process.env[PERSONAL_SITE_DATABASE_URL_ENV]?.trim();
  return value || undefined;
}

export function hasPersonalSiteDatabaseConfig(): boolean {
  return Boolean(getPersonalSiteDatabaseUrl());
}
