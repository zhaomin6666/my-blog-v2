import 'server-only';

import { queryPostgres } from '@/lib/db/postgres';
import type { DbDateValue, DbJsonValue } from '@/lib/db/dbTypes';
import type {
  AdminSiteConfig,
  AdminSiteConfigInput,
  AdminSiteConfigLanguage,
} from './site-config-admin-types';

const SITE_CONFIG_COLUMNS = `
  id,
  key,
  site_name,
  default_title,
  default_description,
  author,
  twitter_handle,
  default_locale,
  data,
  published,
  lang,
  created_at,
  updated_at
`;

interface SiteConfigAdminRow {
  [column: string]: unknown;
  id: string;
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
  created_at?: DbDateValue;
  updated_at?: DbDateValue;
}

function nullableText(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function dateToText(value: unknown): string {
  if (!value) return '';
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

function toLang(value: string): AdminSiteConfigLanguage {
  return value === 'zh' ? 'zh' : 'en';
}

function mapSiteConfigRow(row: SiteConfigAdminRow): AdminSiteConfig {
  return {
    id: row.id,
    key: 'default',
    siteName: nullableText(row.site_name),
    defaultTitle: nullableText(row.default_title),
    defaultDescription: nullableText(row.default_description),
    author: nullableText(row.author),
    twitterHandle: nullableText(row.twitter_handle),
    defaultLocale: nullableText(row.default_locale) || 'en_US',
    data: row.data ?? {},
    published: row.published,
    lang: toLang(row.lang),
    createdAt: dateToText(row.created_at),
    updatedAt: dateToText(row.updated_at),
  };
}

export interface SiteConfigAdminRepository {
  listSiteConfigs(): Promise<AdminSiteConfig[]>;
  getSiteConfig(lang: AdminSiteConfigLanguage): Promise<AdminSiteConfig | null>;
  upsertSiteConfig(input: AdminSiteConfigInput): Promise<AdminSiteConfig>;
}

export class PostgresSiteConfigAdminRepository implements SiteConfigAdminRepository {
  async listSiteConfigs(): Promise<AdminSiteConfig[]> {
    const result = await queryPostgres<SiteConfigAdminRow>(
      `
        select ${SITE_CONFIG_COLUMNS}
        from site_configs
        where deleted_at is null
          and key = 'default'
          and lang in ('zh', 'en')
        order by lang desc
      `,
    );

    return result.rows.map(mapSiteConfigRow);
  }

  async getSiteConfig(lang: AdminSiteConfigLanguage): Promise<AdminSiteConfig | null> {
    const result = await queryPostgres<SiteConfigAdminRow>(
      `
        select ${SITE_CONFIG_COLUMNS}
        from site_configs
        where key = 'default'
          and lang = $1
          and deleted_at is null
        limit 1
      `,
      [lang],
    );

    const row = result.rows[0];
    return row ? mapSiteConfigRow(row) : null;
  }

  async upsertSiteConfig(input: AdminSiteConfigInput): Promise<AdminSiteConfig> {
    const result = await queryPostgres<SiteConfigAdminRow>(
      `
        insert into site_configs (
          key,
          site_name,
          default_title,
          default_description,
          author,
          twitter_handle,
          default_locale,
          data,
          published,
          lang,
          deleted_at
        )
        values ('default', $1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9, null)
        on conflict (key, lang) do update set
          site_name = excluded.site_name,
          default_title = excluded.default_title,
          default_description = excluded.default_description,
          author = excluded.author,
          twitter_handle = excluded.twitter_handle,
          default_locale = excluded.default_locale,
          data = excluded.data,
          published = excluded.published,
          deleted_at = null
        returning ${SITE_CONFIG_COLUMNS}
      `,
      [
        input.siteName,
        input.defaultTitle,
        input.defaultDescription,
        input.author,
        input.twitterHandle,
        input.defaultLocale,
        JSON.stringify(input.data ?? {}),
        input.published,
        input.lang,
      ],
    );

    return mapSiteConfigRow(result.rows[0]);
  }
}
