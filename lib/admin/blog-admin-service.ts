import 'server-only';

import { hasPersonalSiteDatabaseConfig } from '@/lib/db/dbConfig';
import type {
  AdminBlogListParams,
  AdminBlogPost,
  AdminBlogPostInput,
} from './blog-admin-types';
import {
  type BlogAdminRepository,
  PostgresBlogAdminRepository,
} from './blog-admin-repository';
import { AdminBlogValidationError, validateAdminBlogInput } from './blog-admin-validation';

export class BlogAdminDatabaseConfigError extends Error {
  constructor() {
    super('PERSONAL_SITE_DATABASE_URL is required for Blog Admin.');
    this.name = 'BlogAdminDatabaseConfigError';
  }
}

export class BlogAdminService {
  constructor(private readonly repository: BlogAdminRepository) {}

  private assertDatabaseConfigured(): void {
    if (!hasPersonalSiteDatabaseConfig()) {
      throw new BlogAdminDatabaseConfigError();
    }
  }

  async listAdminBlogPosts(params?: AdminBlogListParams): Promise<AdminBlogPost[]> {
    this.assertDatabaseConfigured();
    return this.repository.list(params);
  }

  async getAdminBlogPostById(id: string): Promise<AdminBlogPost | null> {
    this.assertDatabaseConfigured();
    return this.repository.getById(id);
  }

  async createBlogPost(input: AdminBlogPostInput): Promise<AdminBlogPost> {
    this.assertDatabaseConfigured();
    validateAdminBlogInput(input);
    await this.assertSlugUnique(input.slug);

    return this.repository.create(input);
  }

  async updateBlogPost(id: string, input: AdminBlogPostInput): Promise<AdminBlogPost> {
    this.assertDatabaseConfigured();
    validateAdminBlogInput(input);
    await this.assertSlugUnique(input.slug, id);

    return this.repository.update(id, input);
  }

  async publishBlogPost(id: string): Promise<AdminBlogPost> {
    this.assertDatabaseConfigured();
    return this.repository.setStatus(id, 'published');
  }

  async unpublishBlogPost(id: string): Promise<AdminBlogPost> {
    this.assertDatabaseConfigured();
    return this.repository.setStatus(id, 'draft');
  }

  private async assertSlugUnique(slug: string, currentId?: string): Promise<void> {
    const existing = await this.repository.findBySlug(slug);
    if (existing && existing.id !== currentId) {
      throw new AdminBlogValidationError('Slug is already used by another post.', {
        slug: 'Slug is already used by another post.',
      });
    }
  }
}

export const blogAdminService = new BlogAdminService(new PostgresBlogAdminRepository());
