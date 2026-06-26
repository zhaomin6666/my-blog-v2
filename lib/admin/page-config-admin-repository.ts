import 'server-only';

import { queryPostgres } from '@/lib/db/postgres';
import type { DbDateValue, DbJsonValue } from '@/lib/db/dbTypes';
import type {
  AdminPageConfig,
  AdminPageConfigInput,
  AdminPageConfigKey,
  AdminPageConfigLanguage,
} from './page-config-admin-types';

const PAGE_CONFIG_COLUMNS = `
  id,
  key,
  title,
  subtitle,
  footer,
  seo_title,
  seo_description,
  data,
  published,
  lang,
  created_at,
  updated_at
`;

interface PageConfigAdminRow {
  [column: string]: unknown;
  id: string;
  key: string;
  title: string | null;
  subtitle: string | null;
  footer: string | null;
  seo_title: string | null;
  seo_description: string | null;
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

function toKey(value: string): AdminPageConfigKey {
  return value === 'blog' ? 'blog' : 'projects';
}

function toLang(value: string): AdminPageConfigLanguage {
  return value === 'en' ? 'en' : 'zh';
}

function mapPageConfigRow(row: PageConfigAdminRow): AdminPageConfig {
  return {
    id: row.id,
    key: toKey(row.key),
    title: nullableText(row.title),
    subtitle: nullableText(row.subtitle),
    footer: nullableText(row.footer),
    seoTitle: nullableText(row.seo_title),
    seoDescription: nullableText(row.seo_description),
    data: row.data ?? {},
    published: row.published,
    lang: toLang(row.lang),
    createdAt: dateToText(row.created_at),
    updatedAt: dateToText(row.updated_at),
  };
}

export interface PageConfigAdminRepository {
  listPageConfigs(): Promise<AdminPageConfig[]>;
  getPageConfig(
    key: AdminPageConfigKey,
    lang: AdminPageConfigLanguage,
  ): Promise<AdminPageConfig | null>;
  upsertPageConfig(input: AdminPageConfigInput): Promise<AdminPageConfig>;
}

export class PostgresPageConfigAdminRepository implements PageConfigAdminRepository {
  async listPageConfigs(): Promise<AdminPageConfig[]> {
    const result = await queryPostgres<PageConfigAdminRow>(
      `
        select ${PAGE_CONFIG_COLUMNS}
        from page_configs
        where deleted_at is null
          and key in ('projects', 'blog')
          and lang in ('zh', 'en')
        order by key desc, lang desc
      `,
    );

    return result.rows.map(mapPageConfigRow);
  }

  async getPageConfig(
    key: AdminPageConfigKey,
    lang: AdminPageConfigLanguage,
  ): Promise<AdminPageConfig | null> {
    const result = await queryPostgres<PageConfigAdminRow>(
      `
        select ${PAGE_CONFIG_COLUMNS}
        from page_configs
        where key = $1
          and lang = $2
          and deleted_at is null
        limit 1
      `,
      [key, lang],
    );

    const row = result.rows[0];
    return row ? mapPageConfigRow(row) : null;
  }

  async upsertPageConfig(input: AdminPageConfigInput): Promise<AdminPageConfig> {
    const result = await queryPostgres<PageConfigAdminRow>(
      `
        insert into page_configs (
          key,
          title,
          subtitle,
          footer,
          seo_title,
          seo_description,
          data,
          published,
          lang,
          deleted_at
        )
        values ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9, null)
        on conflict (key, lang) do update set
          title = excluded.title,
          subtitle = excluded.subtitle,
          footer = excluded.footer,
          seo_title = excluded.seo_title,
          seo_description = excluded.seo_description,
          data = excluded.data,
          published = excluded.published,
          deleted_at = null
        returning ${PAGE_CONFIG_COLUMNS}
      `,
      [
        input.key,
        input.title,
        input.subtitle,
        input.footer,
        input.seoTitle,
        input.seoDescription,
        JSON.stringify(input.data ?? {}),
        input.published,
        input.lang,
      ],
    );

    return mapPageConfigRow(result.rows[0]);
  }
}
