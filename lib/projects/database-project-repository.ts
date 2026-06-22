import 'server-only';
import { queryPostgres } from '@/lib/db/postgres';
import type { ProjectRow } from '@/lib/db/dbTypes';
import type { ProjectLookupOptions, ProjectRepository } from './project-repository';
import type { Project, ProjectMeta, ProjectQueryOptions } from './project-types';
import { mapProjectRowToMeta, mapProjectRowToProject } from './project-db-mapper';

const PROJECT_COLUMNS = `
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
  seo_description
`;

export class DatabaseProjectRepository implements ProjectRepository {
  async getAllProjects(options?: ProjectQueryOptions): Promise<ProjectMeta[]> {
    const where = ['deleted_at is null'];
    const values: unknown[] = [];

    if (!options?.includeDrafts) {
      where.push('published = true');
    }

    if (options?.featured !== undefined) {
      values.push(options.featured);
      where.push(`featured = $${values.length}`);
    }

    if (options?.lang) {
      values.push(options.lang);
      where.push(`lang = $${values.length}`);
    }

    const result = await queryPostgres<ProjectRow>(
      `
        select ${PROJECT_COLUMNS}
        from projects
        where ${where.join(' and ')}
        order by display_order asc nulls last, created_at desc
      `,
      values,
    );

    return result.rows.map(mapProjectRowToMeta);
  }

  async getProjectBySlug(
    slug: string,
    options?: ProjectLookupOptions,
  ): Promise<Project | null> {
    const publishedFilter = options?.includeDrafts ? '' : 'and published = true';

    const result = await queryPostgres<ProjectRow>(
      `
        select ${PROJECT_COLUMNS}
        from projects
        where deleted_at is null
          and slug = $1
          ${publishedFilter}
        limit 1
      `,
      [slug],
    );

    const row = result.rows[0];
    return row ? mapProjectRowToProject(row) : null;
  }
}
