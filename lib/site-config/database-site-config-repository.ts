import 'server-only';
import type { DatabaseError } from 'pg';
import { queryPostgres } from '@/lib/db/postgres';
import type { DbJsonValue } from '@/lib/db/dbTypes';
import type {
  SiteConfig,
  SiteConfigLanguage,
  SiteConfigRepository,
} from './site-config-types';

const SITE_CONFIG_LANGS = ['zh', 'en'] as const;
const fallbackSiteUrl = 'http://localhost:3000';

interface SiteConfigRow {
  [column: string]: unknown;
  key: string;
  site_name: string | null;
  default_title: string | null;
  default_description: string | null;
  author: string | null;
  twitter_handle: string | null;
  default_locale: string | null;
  data: DbJsonValue;
  published: boolean;
  lang: string;
}

function normalizeSiteUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

function getConfiguredSiteUrl(): string {
  return normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL || fallbackSiteUrl);
}

function isSiteConfigLanguage(value: unknown): value is SiteConfigLanguage {
  return SITE_CONFIG_LANGS.includes(value as SiteConfigLanguage);
}

function getLanguageFallbacks(
  preferredLang: SiteConfigLanguage,
): SiteConfigLanguage[] {
  return Array.from(new Set([preferredLang, 'en', 'zh']));
}

function mapRowToSiteConfig(row: SiteConfigRow): SiteConfig | null {
  if (row.key !== 'default' || !isSiteConfigLanguage(row.lang)) {
    return null;
  }

  return {
    key: 'default',
    siteName: row.site_name ?? '',
    siteUrl: getConfiguredSiteUrl(),
    defaultTitle: row.default_title ?? '',
    defaultDescription: row.default_description ?? '',
    author: row.author ?? '',
    twitterHandle: row.twitter_handle ?? '',
    defaultLocale: row.default_locale || 'en_US',
    data: row.data ?? {},
    published: row.published,
    lang: row.lang,
  };
}

function isMissingSiteConfigsTable(error: unknown): error is DatabaseError {
  return (
    typeof error === 'object'
    && error !== null
    && 'code' in error
    && (error as DatabaseError).code === '42P01'
  );
}

export class DatabaseSiteConfigRepository implements SiteConfigRepository {
  async getSiteConfig(
    preferredLang: SiteConfigLanguage = 'en',
  ): Promise<SiteConfig | null> {
    if (!isSiteConfigLanguage(preferredLang)) {
      return null;
    }

    for (const lang of getLanguageFallbacks(preferredLang)) {
      try {
        const result = await queryPostgres<SiteConfigRow>(
          `
            select
              key,
              site_name,
              default_title,
              default_description,
              author,
              twitter_handle,
              default_locale,
              data,
              published,
              lang
            from site_configs
            where deleted_at is null
              and published = true
              and key = 'default'
              and lang = $1
            limit 1
          `,
          [lang],
        );

        const row = result.rows[0];
        const config = row ? mapRowToSiteConfig(row) : null;
        if (config) return config;
      } catch (error) {
        if (isMissingSiteConfigsTable(error)) {
          return null;
        }

        throw error;
      }
    }

    return null;
  }
}
