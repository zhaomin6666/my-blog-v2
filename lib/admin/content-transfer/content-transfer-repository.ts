import 'server-only';

import { getPostgresPool, queryPostgres } from '@/lib/db/postgres';
import type { BlogPostRow, ProjectRow } from '@/lib/db/dbTypes';
import type {
  BlogMarkdownInput,
  ExportScope,
  ProjectMarkdownInput,
  SlugLookupResult,
} from './content-transfer-types';

const BLOG_EXPORT_COLUMNS = `
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

const PROJECT_EXPORT_COLUMNS = `
  id,
  title,
  slug,
  subtitle,
  summary,
  content_markdown,
  status,
  type,
  role,
  timeline,
  featured,
  display_order,
  tech_stack,
  features,
  highlights,
  links,
  related_posts,
  related_series_slug,
  published,
  lang,
  seo_title,
  seo_description,
  created_at,
  updated_at
`;

export interface ContentTransferRepository {
  findBlogSlug(slug: string): Promise<SlugLookupResult>;
  findProjectSlug(slug: string): Promise<SlugLookupResult>;
  upsertBlog(input: BlogMarkdownInput, existingId: string | null): Promise<void>;
  upsertProject(input: ProjectMarkdownInput, existingId: string | null): Promise<void>;
  listBlogPostsForExport(scope?: ExportScope, limit?: number): Promise<BlogPostRow[]>;
  listProjectsForExport(scope?: ExportScope, limit?: number): Promise<ProjectRow[]>;
  getBlogPostForExport(id: string): Promise<BlogPostRow | null>;
  getProjectForExport(id: string): Promise<ProjectRow | null>;
}

async function lookupSlug(table: 'blog_posts' | 'projects', slug: string): Promise<SlugLookupResult> {
  const result = await queryPostgres<{ id: string; deleted_at: Date | string | null }>(
    `
      select id, deleted_at
      from ${table}
      where slug = $1
    `,
    [slug],
  );

  const activeRows = result.rows.filter((row) => row.deleted_at === null);
  const deletedCount = result.rows.length - activeRows.length;

  return {
    activeId: activeRows.length === 1 ? activeRows[0].id : null,
    activeCount: activeRows.length,
    deletedCount,
  };
}

export class PostgresContentTransferRepository implements ContentTransferRepository {
  findBlogSlug(slug: string): Promise<SlugLookupResult> {
    return lookupSlug('blog_posts', slug);
  }

  findProjectSlug(slug: string): Promise<SlugLookupResult> {
    return lookupSlug('projects', slug);
  }

  async upsertBlog(input: BlogMarkdownInput, existingId: string | null): Promise<void> {
    const pool = getPostgresPool();
    const client = await pool.connect();

    try {
      await client.query('begin');

      if (existingId) {
        await client.query(
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
                when $6 = 'published' and published_at is null then coalesce($15::date::timestamp with time zone, now())
                when $6 <> 'published' then null
                else published_at
              end
            where id = $1 and deleted_at is null
          `,
          [
            existingId,
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
      } else {
        await client.query(
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
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
              case when $5 = 'published' then coalesce($14::date::timestamp with time zone, now()) else null end
            )
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
      }

      await client.query('commit');
    } catch (error) {
      await client.query('rollback');
      throw error;
    } finally {
      client.release();
    }
  }

  async upsertProject(input: ProjectMarkdownInput, existingId: string | null): Promise<void> {
    const pool = getPostgresPool();
    const client = await pool.connect();

    try {
      await client.query('begin');

      const values = [
        input.title,
        input.slug,
        input.subtitle,
        input.summary,
        input.contentMarkdown,
        input.status,
        input.type,
        JSON.stringify(input.role),
        input.timeline,
        input.featured,
        input.displayOrder,
        JSON.stringify(input.techStack),
        JSON.stringify(input.features),
        JSON.stringify(input.highlights),
        JSON.stringify(input.links),
        JSON.stringify(input.relatedPosts),
        input.relatedSeriesSlug,
        input.published,
        input.lang,
        input.seoTitle,
        input.seoDescription,
      ];

      if (existingId) {
        await client.query(
          `
            update projects
            set
              title = $2,
              slug = $3,
              subtitle = $4,
              summary = $5,
              content_markdown = $6,
              status = $7,
              type = $8,
              role = $9::jsonb,
              timeline = $10,
              featured = $11,
              display_order = $12,
              tech_stack = $13::jsonb,
              features = $14::jsonb,
              highlights = $15::jsonb,
              links = $16::jsonb,
              related_posts = $17::jsonb,
              related_series_slug = $18,
              published = $19,
              lang = $20,
              seo_title = $21,
              seo_description = $22
            where id = $1 and deleted_at is null
          `,
          [existingId, ...values],
        );
      } else {
        await client.query(
          `
            insert into projects (
              title,
              slug,
              subtitle,
              summary,
              content_markdown,
              status,
              type,
              role,
              timeline,
              featured,
              display_order,
              tech_stack,
              features,
              highlights,
              links,
              related_posts,
              related_series_slug,
              published,
              lang,
              seo_title,
              seo_description
            )
            values (
              $1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9, $10, $11,
              $12::jsonb, $13::jsonb, $14::jsonb, $15::jsonb, $16::jsonb,
              $17, $18, $19, $20, $21
            )
          `,
          values,
        );
      }

      await client.query('commit');
    } catch (error) {
      await client.query('rollback');
      throw error;
    } finally {
      client.release();
    }
  }

  async listBlogPostsForExport(scope: ExportScope = 'all', limit = 100): Promise<BlogPostRow[]> {
    const where = ['deleted_at is null'];
    const values: unknown[] = [];

    if (scope === 'published') where.push("status = 'published'");
    if (scope === 'draft') where.push("status in ('draft', 'archived')");

    values.push(Math.min(Math.max(limit, 1), 200));

    const result = await queryPostgres<BlogPostRow>(
      `
        select ${BLOG_EXPORT_COLUMNS}
        from blog_posts
        where ${where.join(' and ')}
        order by date desc nulls last, updated_at desc
        limit $${values.length}
      `,
      values,
    );

    return result.rows;
  }

  async listProjectsForExport(scope: ExportScope = 'all', limit = 100): Promise<ProjectRow[]> {
    const where = ['deleted_at is null'];
    const values: unknown[] = [];

    if (scope === 'published') where.push('published = true');
    if (scope === 'draft') where.push('published = false');

    values.push(Math.min(Math.max(limit, 1), 200));

    const result = await queryPostgres<ProjectRow>(
      `
        select ${PROJECT_EXPORT_COLUMNS}
        from projects
        where ${where.join(' and ')}
        order by display_order asc nulls last, updated_at desc
        limit $${values.length}
      `,
      values,
    );

    return result.rows;
  }

  async getBlogPostForExport(id: string): Promise<BlogPostRow | null> {
    const result = await queryPostgres<BlogPostRow>(
      `
        select ${BLOG_EXPORT_COLUMNS}
        from blog_posts
        where id = $1 and deleted_at is null
        limit 1
      `,
      [id],
    );

    return result.rows[0] ?? null;
  }

  async getProjectForExport(id: string): Promise<ProjectRow | null> {
    const result = await queryPostgres<ProjectRow>(
      `
        select ${PROJECT_EXPORT_COLUMNS}
        from projects
        where id = $1 and deleted_at is null
        limit 1
      `,
      [id],
    );

    return result.rows[0] ?? null;
  }
}
