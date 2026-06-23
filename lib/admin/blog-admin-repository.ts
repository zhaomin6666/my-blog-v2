import 'server-only';

import { queryPostgres } from '@/lib/db/postgres';
import type { BlogPostRow } from '@/lib/db/dbTypes';
import type {
  AdminBlogListParams,
  AdminBlogPost,
  AdminBlogPostInput,
  AdminBlogStatus,
} from './blog-admin-types';

const ADMIN_BLOG_COLUMNS = `
  id,
  title,
  slug,
  summary,
  content_markdown,
  status,
  lang,
  cover,
  seo_title,
  seo_description,
  tags,
  series,
  series_slug,
  series_order,
  date,
  published_at,
  created_at,
  updated_at
`;

function dateToInputValue(value: unknown): string {
  if (!value) return '';
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

function nullableText(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function mapAdminBlogPostRow(row: BlogPostRow): AdminBlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    summary: nullableText(row.summary),
    contentMarkdown: nullableText(row.content_markdown),
    status: row.status === 'published' ? 'published' : 'draft',
    lang: row.lang === 'en' ? 'en' : 'zh',
    cover: nullableText(row.cover),
    seoTitle: nullableText(row.seo_title),
    seoDescription: nullableText(row.seo_description),
    tags: Array.isArray(row.tags) ? row.tags : [],
    series: nullableText(row.series),
    seriesSlug: nullableText(row.series_slug),
    seriesOrder: row.series_order ?? null,
    date: dateToInputValue(row.date),
    publishedAt: dateToInputValue(row.published_at),
    createdAt: dateToInputValue(row.created_at),
    updatedAt: dateToInputValue(row.updated_at),
  };
}

function isUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

function assertUuid(id: string): void {
  if (!isUuid(id)) {
    throw new Error('Invalid blog post id.');
  }
}

export interface BlogAdminRepository {
  list(params?: AdminBlogListParams): Promise<AdminBlogPost[]>;
  getById(id: string): Promise<AdminBlogPost | null>;
  findBySlug(slug: string): Promise<AdminBlogPost | null>;
  create(input: AdminBlogPostInput): Promise<AdminBlogPost>;
  update(id: string, input: AdminBlogPostInput): Promise<AdminBlogPost>;
  setStatus(id: string, status: AdminBlogStatus): Promise<AdminBlogPost>;
}

export class PostgresBlogAdminRepository implements BlogAdminRepository {
  async list(params: AdminBlogListParams = {}): Promise<AdminBlogPost[]> {
    const where = ['deleted_at is null'];
    const values: unknown[] = [];

    if (params.status) {
      values.push(params.status);
      where.push(`status = $${values.length}`);
    } else {
      where.push("status in ('draft', 'published')");
    }

    if (params.lang) {
      values.push(params.lang);
      where.push(`lang = $${values.length}`);
    }

    if (params.keyword?.trim()) {
      values.push(`%${params.keyword.trim()}%`);
      where.push(`(title ilike $${values.length} or slug ilike $${values.length} or summary ilike $${values.length})`);
    }

    values.push(Math.min(Math.max(params.limit ?? 50, 1), 100));

    const result = await queryPostgres<BlogPostRow>(
      `
        select ${ADMIN_BLOG_COLUMNS}
        from blog_posts
        where ${where.join(' and ')}
        order by updated_at desc, created_at desc
        limit $${values.length}
      `,
      values,
    );

    return result.rows.map(mapAdminBlogPostRow);
  }

  async getById(id: string): Promise<AdminBlogPost | null> {
    if (!isUuid(id)) return null;

    const result = await queryPostgres<BlogPostRow>(
      `
        select ${ADMIN_BLOG_COLUMNS}
        from blog_posts
        where id = $1 and deleted_at is null
        limit 1
      `,
      [id],
    );

    const row = result.rows[0];
    return row ? mapAdminBlogPostRow(row) : null;
  }

  async findBySlug(slug: string): Promise<AdminBlogPost | null> {
    const result = await queryPostgres<BlogPostRow>(
      `
        select ${ADMIN_BLOG_COLUMNS}
        from blog_posts
        where slug = $1 and deleted_at is null
        limit 1
      `,
      [slug],
    );

    const row = result.rows[0];
    return row ? mapAdminBlogPostRow(row) : null;
  }

  async create(input: AdminBlogPostInput): Promise<AdminBlogPost> {
    const result = await queryPostgres<BlogPostRow>(
      `
        insert into blog_posts (
          title,
          slug,
          summary,
          content_markdown,
          status,
          lang,
          cover,
          seo_title,
          seo_description,
          tags,
          series,
          series_slug,
          series_order,
          date,
          published_at
        )
        values (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8,
          $9,
          $10,
          $11,
          $12,
          $13,
          $14,
          case when $5 = 'published' then now() else null end
        )
        returning ${ADMIN_BLOG_COLUMNS}
      `,
      [
        input.title,
        input.slug,
        input.summary,
        input.contentMarkdown,
        input.status,
        input.lang,
        input.cover,
        input.seoTitle,
        input.seoDescription,
        input.tags,
        input.series,
        input.seriesSlug,
        input.seriesOrder,
        input.date,
      ],
    );

    return mapAdminBlogPostRow(result.rows[0]);
  }

  async update(id: string, input: AdminBlogPostInput): Promise<AdminBlogPost> {
    assertUuid(id);

    const result = await queryPostgres<BlogPostRow>(
      `
        update blog_posts
        set
          title = $2,
          slug = $3,
          summary = $4,
          content_markdown = $5,
          status = $6,
          lang = $7,
          cover = $8,
          seo_title = $9,
          seo_description = $10,
          tags = $11,
          series = $12,
          series_slug = $13,
          series_order = $14,
          date = $15,
          published_at = case
            when $6 = 'published' and published_at is null then now()
            else published_at
          end
        where id = $1 and deleted_at is null
        returning ${ADMIN_BLOG_COLUMNS}
      `,
      [
        id,
        input.title,
        input.slug,
        input.summary,
        input.contentMarkdown,
        input.status,
        input.lang,
        input.cover,
        input.seoTitle,
        input.seoDescription,
        input.tags,
        input.series,
        input.seriesSlug,
        input.seriesOrder,
        input.date,
      ],
    );

    const row = result.rows[0];
    if (!row) throw new Error('Blog post not found.');

    return mapAdminBlogPostRow(row);
  }

  async setStatus(id: string, status: AdminBlogStatus): Promise<AdminBlogPost> {
    assertUuid(id);

    const result = await queryPostgres<BlogPostRow>(
      `
        update blog_posts
        set
          status = $2,
          published_at = case
            when $2 = 'published' and published_at is null then now()
            else published_at
          end
        where id = $1 and deleted_at is null
        returning ${ADMIN_BLOG_COLUMNS}
      `,
      [id, status],
    );

    const row = result.rows[0];
    if (!row) throw new Error('Blog post not found.');

    return mapAdminBlogPostRow(row);
  }
}
