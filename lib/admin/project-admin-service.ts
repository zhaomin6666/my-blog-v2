import 'server-only';

import { hasPersonalSiteDatabaseConfig } from '@/lib/db/dbConfig';
import {
  type ProjectAdminRepository,
  PostgresProjectAdminRepository,
} from './project-admin-repository';
import type {
  AdminProject,
  AdminProjectInput,
  AdminProjectListParams,
} from './project-admin-types';
import { AdminProjectValidationError, validateAdminProjectInput } from './project-admin-validation';

export class ProjectAdminDatabaseConfigError extends Error {
  constructor() {
    super('PERSONAL_SITE_DATABASE_URL is required for Projects Admin.');
    this.name = 'ProjectAdminDatabaseConfigError';
  }
}

export class ProjectAdminService {
  constructor(private readonly repository: ProjectAdminRepository) {}

  private assertDatabaseConfigured(): void {
    if (!hasPersonalSiteDatabaseConfig()) {
      throw new ProjectAdminDatabaseConfigError();
    }
  }

  async listAdminProjects(params?: AdminProjectListParams): Promise<AdminProject[]> {
    this.assertDatabaseConfigured();
    return this.repository.list(params);
  }

  async getAdminProjectById(id: string): Promise<AdminProject | null> {
    this.assertDatabaseConfigured();
    return this.repository.getById(id);
  }

  async createProject(input: AdminProjectInput): Promise<AdminProject> {
    this.assertDatabaseConfigured();
    validateAdminProjectInput(input);
    await this.assertSlugUnique(input.slug);
    return this.repository.create(input);
  }

  async updateProject(id: string, input: AdminProjectInput): Promise<AdminProject> {
    this.assertDatabaseConfigured();
    validateAdminProjectInput(input);
    await this.assertSlugUnique(input.slug, id);
    return this.repository.update(id, input);
  }

  async publishProject(id: string): Promise<AdminProject> {
    this.assertDatabaseConfigured();
    return this.repository.setPublished(id, true);
  }

  async unpublishProject(id: string): Promise<AdminProject> {
    this.assertDatabaseConfigured();
    return this.repository.setPublished(id, false);
  }

  private async assertSlugUnique(slug: string, currentId?: string): Promise<void> {
    const existing = await this.repository.findBySlug(slug);
    if (existing && existing.id !== currentId) {
      throw new AdminProjectValidationError('Slug is already used by another project.', {
        slug: 'Slug is already used by another project.',
      });
    }
  }
}

export const projectAdminService = new ProjectAdminService(new PostgresProjectAdminRepository());
