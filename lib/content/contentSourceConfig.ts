import { PERSONAL_SITE_DATABASE_URL_ENV } from '@/lib/db/dbConfig';

export type ContentSource = 'file' | 'database';
export type ContentDomain = 'blog' | 'project' | 'profile';

export const contentDomainEnv: Record<ContentDomain, string> = {
  blog: 'BLOG_CONTENT_SOURCE',
  project: 'PROJECT_CONTENT_SOURCE',
  profile: 'PROFILE_CONTENT_SOURCE',
};

function normalizeContentSource(value: string | undefined, envName: string): ContentSource | undefined {
  const normalized = value?.trim().toLowerCase();
  if (!normalized) return undefined;

  if (normalized === 'file' || normalized === 'database') {
    return normalized;
  }

  throw new Error(`${envName} must be "file" or "database". Received "${value}".`);
}

export function getContentSource(domain: ContentDomain): ContentSource {
  const domainSource = normalizeContentSource(
    process.env[contentDomainEnv[domain]],
    contentDomainEnv[domain],
  );
  const globalSource = normalizeContentSource(
    process.env.CONTENT_SOURCE,
    'CONTENT_SOURCE',
  );

  return domainSource ?? globalSource ?? 'file';
}

export function assertDatabaseContentSourceConfig(
  domain: ContentDomain,
  databaseUrl: string | undefined,
): void {
  if (databaseUrl?.trim()) return;

  throw new Error(
    `${contentDomainEnv[domain]} or CONTENT_SOURCE selected "database", but ${PERSONAL_SITE_DATABASE_URL_ENV} is not configured.`,
  );
}
