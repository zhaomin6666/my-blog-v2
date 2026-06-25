import 'server-only';

import { queryPostgres } from '@/lib/db/postgres';
import type { DbJsonValue, ProjectRow } from '@/lib/db/dbTypes';
import type {
  AdminProject,
  AdminProjectInput,
  AdminProjectListParams,
} from './project-admin-types';

const ADMIN_PROJECT_COLUMNS = `
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

function nullableText(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function dateToInputValue(value: unknown): string {
  if (!value) return '';
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

function toStringArray(value: DbJsonValue): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}

function toLinksObject(value: DbJsonValue): Record<string, string> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const links: Record<string, string> = {};
    for (const [label, href] of Object.entries(value)) {
      if (typeof href === 'string') links[label] = href;
    }
    return links;
  }

  if (Array.isArray(value)) {
    const links: Record<string, string> = {};
    for (const item of value) {
      if (!item || typeof item !== 'object' || Array.isArray(item)) continue;
      const record = item as Record<string, unknown>;
      if (typeof record.label === 'string' && typeof record.href === 'string') {
        links[record.label] = record.href;
      }
    }
    return links;
  }

  return {};
}

function toRelatedPosts(value: DbJsonValue): AdminProject['relatedPosts'] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) return null;
      const record = item as Record<string, unknown>;
      if (typeof record.title !== 'string' || typeof record.slug !== 'string') return null;
      return {
        title: record.title,
        slug: record.slug,
      };
    })
    .filter((item): item is { title: string; slug: string } => item !== null);
}

function mapAdminProjectRow(row: ProjectRow): AdminProject {
  const status = row.status === 'production' || row.status === 'mvp' ? row.status : 'building';

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    subtitle: nullableText(row.subtitle),
    summary: nullableText(row.summary),
    contentMarkdown: nullableText(row.content_markdown),
    status,
    type: nullableText(row.type),
    role: toStringArray(row.role),
    timeline: nullableText(row.timeline),
    published: row.published,
    featured: row.featured,
    displayOrder: row.display_order ?? 0,
    techStack: toStringArray(row.tech_stack),
    features: toStringArray(row.features),
    highlights: toStringArray(row.highlights),
    links: toLinksObject(row.links),
    relatedPosts: toRelatedPosts(row.related_posts),
    relatedSeriesSlug: nullableText(row.related_series_slug),
    lang: row.lang === 'en' ? 'en' : 'zh',
    seoTitle: nullableText(row.seo_title),
    seoDescription: nullableText(row.seo_description),
    createdAt: dateToInputValue(row.created_at),
    updatedAt: dateToInputValue(row.updated_at),
  };
}

function isUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

function assertUuid(id: string): void {
  if (!isUuid(id)) {
    throw new Error('Invalid project id.');
  }
}

export interface ProjectAdminRepository {
  list(params?: AdminProjectListParams): Promise<AdminProject[]>;
  getById(id: string): Promise<AdminProject | null>;
  findBySlug(slug: string): Promise<AdminProject | null>;
  create(input: AdminProjectInput): Promise<AdminProject>;
  update(id: string, input: AdminProjectInput): Promise<AdminProject>;
  setPublished(id: string, published: boolean): Promise<AdminProject>;
}

export class PostgresProjectAdminRepository implements ProjectAdminRepository {
  async list(params: AdminProjectListParams = {}): Promise<AdminProject[]> {
    const where = ['deleted_at is null'];
    const values: unknown[] = [];

    if (params.published !== undefined) {
      values.push(params.published);
      where.push(`published = $${values.length}`);
    }

    if (params.featured !== undefined) {
      values.push(params.featured);
      where.push(`featured = $${values.length}`);
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

    const result = await queryPostgres<ProjectRow>(
      `
        select ${ADMIN_PROJECT_COLUMNS}
        from projects
        where ${where.join(' and ')}
        order by display_order asc nulls last, updated_at desc
        limit $${values.length}
      `,
      values,
    );

    return result.rows.map(mapAdminProjectRow);
  }

  async getById(id: string): Promise<AdminProject | null> {
    if (!isUuid(id)) return null;

    const result = await queryPostgres<ProjectRow>(
      `
        select ${ADMIN_PROJECT_COLUMNS}
        from projects
        where id = $1 and deleted_at is null
        limit 1
      `,
      [id],
    );

    const row = result.rows[0];
    return row ? mapAdminProjectRow(row) : null;
  }

  async findBySlug(slug: string): Promise<AdminProject | null> {
    const result = await queryPostgres<ProjectRow>(
      `
        select ${ADMIN_PROJECT_COLUMNS}
        from projects
        where slug = $1 and deleted_at is null
        limit 1
      `,
      [slug],
    );

    const row = result.rows[0];
    return row ? mapAdminProjectRow(row) : null;
  }

  async create(input: AdminProjectInput): Promise<AdminProject> {
    const result = await queryPostgres<ProjectRow>(
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
        returning ${ADMIN_PROJECT_COLUMNS}
      `,
      [
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
      ],
    );

    return mapAdminProjectRow(result.rows[0]);
  }

  async update(id: string, input: AdminProjectInput): Promise<AdminProject> {
    assertUuid(id);

    const result = await queryPostgres<ProjectRow>(
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
        returning ${ADMIN_PROJECT_COLUMNS}
      `,
      [
        id,
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
      ],
    );

    const row = result.rows[0];
    if (!row) throw new Error('Project not found.');

    return mapAdminProjectRow(row);
  }

  async setPublished(id: string, published: boolean): Promise<AdminProject> {
    assertUuid(id);

    const result = await queryPostgres<ProjectRow>(
      `
        update projects
        set published = $2
        where id = $1 and deleted_at is null
        returning ${ADMIN_PROJECT_COLUMNS}
      `,
      [id, published],
    );

    const row = result.rows[0];
    if (!row) throw new Error('Project not found.');

    return mapAdminProjectRow(row);
  }
}
