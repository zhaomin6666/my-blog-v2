import 'server-only';
import { queryPostgres } from '@/lib/db/postgres';
import type { DbJsonValue } from '@/lib/db/dbTypes';
import type {
  PageConfig,
  PageConfigKey,
  PageConfigLanguage,
  PageConfigRepository,
} from './page-config-types';

const PAGE_CONFIG_KEYS = ['projects', 'blog'] as const;
const PAGE_CONFIG_LANGS = ['zh', 'en'] as const;

interface PageConfigRow {
  [column: string]: unknown;
  key: string;
  title: string | null;
  subtitle: string | null;
  footer: string | null;
  seo_title: string | null;
  seo_description: string | null;
  data: DbJsonValue;
  published: boolean;
  lang: string;
}

function isPageConfigKey(value: unknown): value is PageConfigKey {
  return PAGE_CONFIG_KEYS.includes(value as PageConfigKey);
}

function isPageConfigLanguage(value: unknown): value is PageConfigLanguage {
  return PAGE_CONFIG_LANGS.includes(value as PageConfigLanguage);
}

function getLanguageFallbacks(
  preferredLang: PageConfigLanguage,
): PageConfigLanguage[] {
  return Array.from(new Set([preferredLang, 'en', 'zh']));
}

function mapRowToPageConfig(row: PageConfigRow): PageConfig | null {
  if (!isPageConfigKey(row.key) || !isPageConfigLanguage(row.lang)) {
    return null;
  }

  return {
    key: row.key,
    title: row.title ?? '',
    subtitle: row.subtitle ?? '',
    footer: row.footer ?? '',
    seoTitle: row.seo_title ?? '',
    seoDescription: row.seo_description ?? '',
    data: row.data ?? {},
    published: row.published,
    lang: row.lang,
  };
}

export class DatabasePageConfigRepository implements PageConfigRepository {
  async getPageConfig(
    key: PageConfigKey,
    preferredLang: PageConfigLanguage = 'zh',
  ): Promise<PageConfig | null> {
    if (!isPageConfigKey(key) || !isPageConfigLanguage(preferredLang)) {
      return null;
    }

    for (const lang of getLanguageFallbacks(preferredLang)) {
      const result = await queryPostgres<PageConfigRow>(
        `
          select
            key,
            title,
            subtitle,
            footer,
            seo_title,
            seo_description,
            data,
            published,
            lang
          from page_configs
          where deleted_at is null
            and published = true
            and key = $1
            and lang = $2
          limit 1
        `,
        [key, lang],
      );

      const row = result.rows[0];
      const config = row ? mapRowToPageConfig(row) : null;
      if (config) return config;
    }

    return null;
  }
}
