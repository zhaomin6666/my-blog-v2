import type { Project, ProjectMeta, ProjectQueryOptions } from './project-types';

export interface ProjectLookupOptions {
  includeDrafts?: boolean;
}

/**
 * ProjectRepository abstracts project content storage.
 *
 * Current implementation reads Markdown files from content/projects.
 * Future implementations can use a CMS or database without changing pages.
 */
export interface ProjectRepository {
  getAllProjects(options?: ProjectQueryOptions): Promise<ProjectMeta[]>;

  getProjectBySlug(
    slug: string,
    options?: ProjectLookupOptions,
  ): Promise<Project | null>;
}
