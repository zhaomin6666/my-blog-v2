import type { ProjectLookupOptions, ProjectRepository } from './project-repository';
import type { Project, ProjectMeta, ProjectQueryOptions } from './project-types';
import { getProjectRepository } from '@/lib/content/contentSource';

export class ProjectService {
  constructor(private readonly repository: ProjectRepository) {}

  async getPublishedProjects(
    options?: Omit<ProjectQueryOptions, 'includeDrafts'>,
  ): Promise<ProjectMeta[]> {
    return this.repository.getAllProjects({ ...options, includeDrafts: false });
  }

  async getFeaturedProjects(): Promise<ProjectMeta[]> {
    return this.repository.getAllProjects({
      includeDrafts: false,
      featured: true,
    });
  }

  async getAllProjects(
    options?: Omit<ProjectQueryOptions, 'includeDrafts'>,
  ): Promise<ProjectMeta[]> {
    return this.repository.getAllProjects({ ...options, includeDrafts: true });
  }

  async getProjectBySlug(
    slug: string,
    options?: ProjectLookupOptions,
  ): Promise<Project | null> {
    return this.repository.getProjectBySlug(slug, {
      includeDrafts: options?.includeDrafts ?? true,
    });
  }

  async getPublishedProjectBySlug(slug: string): Promise<Project | null> {
    return this.repository.getProjectBySlug(slug, { includeDrafts: false });
  }

  async getProjectsByRelatedSeries(seriesSlug: string): Promise<ProjectMeta[]> {
    const projects = await this.getPublishedProjects();
    return projects.filter((project) => project.relatedSeriesSlug === seriesSlug);
  }
}

export const projectService = new ProjectService(getProjectRepository());
