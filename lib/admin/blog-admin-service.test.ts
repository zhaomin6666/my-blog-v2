import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { BlogAdminRepository } from './blog-admin-repository';
import type {
  AdminBlogListParams,
  AdminBlogPost,
  AdminBlogPostInput,
  AdminBlogStatus,
} from './blog-admin-types';
import { AdminBlogValidationError } from './blog-admin-validation';

vi.mock('server-only', () => ({}));

vi.mock('@/lib/db/dbConfig', () => ({
  hasPersonalSiteDatabaseConfig: vi.fn(() => true),
}));

const { hasPersonalSiteDatabaseConfig } = await import('@/lib/db/dbConfig');
const { BlogAdminService, BlogAdminDatabaseConfigError } = await import('./blog-admin-service');
const hasDatabaseConfigMock = vi.mocked(hasPersonalSiteDatabaseConfig);

const baseInput: AdminBlogPostInput = {
  title: 'Blog Admin MVP',
  slug: 'blog-admin-mvp',
  summary: 'Admin editing flow',
  contentMarkdown: '## Hello\nContent',
  status: 'draft',
  lang: 'en',
  cover: '',
  seoTitle: '',
  seoDescription: '',
  tags: ['CMS'],
  series: 'Admin CMS',
  seriesSlug: 'admin-cms',
  seriesOrder: 1,
  date: '2026-06-23',
};

function makePost(input: AdminBlogPostInput, id = 'post-1'): AdminBlogPost {
  return {
    id,
    title: input.title,
    slug: input.slug,
    summary: input.summary,
    contentMarkdown: input.contentMarkdown,
    status: input.status,
    lang: input.lang,
    cover: input.cover,
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription,
    tags: input.tags,
    series: input.series,
    seriesSlug: input.seriesSlug,
    seriesOrder: input.seriesOrder,
    date: input.date || '',
    publishedAt: input.status === 'published' ? '2026-06-23' : '',
    createdAt: '2026-06-23',
    updatedAt: '2026-06-23',
  };
}

class MemoryBlogAdminRepository implements BlogAdminRepository {
  posts: AdminBlogPost[] = [];

  async list(params: AdminBlogListParams = {}): Promise<AdminBlogPost[]> {
    return this.posts.filter((post) => {
      if (params.status && post.status !== params.status) return false;
      if (params.lang && post.lang !== params.lang) return false;
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase();
        return [post.title, post.slug, post.summary].some((value) =>
          value.toLowerCase().includes(keyword),
        );
      }
      return true;
    });
  }

  async getById(id: string): Promise<AdminBlogPost | null> {
    return this.posts.find((post) => post.id === id) ?? null;
  }

  async findBySlug(slug: string): Promise<AdminBlogPost | null> {
    return this.posts.find((post) => post.slug === slug) ?? null;
  }

  async create(input: AdminBlogPostInput): Promise<AdminBlogPost> {
    const post = makePost(input, `post-${this.posts.length + 1}`);
    this.posts.push(post);
    return post;
  }

  async update(id: string, input: AdminBlogPostInput): Promise<AdminBlogPost> {
    const index = this.posts.findIndex((post) => post.id === id);
    if (index < 0) throw new Error('Blog post not found.');

    const next = {
      ...makePost(input, id),
      createdAt: this.posts[index].createdAt,
      publishedAt:
        input.status === 'published'
          ? this.posts[index].publishedAt || '2026-06-23'
          : this.posts[index].publishedAt,
    };
    this.posts[index] = next;
    return next;
  }

  async setStatus(id: string, status: AdminBlogStatus): Promise<AdminBlogPost> {
    const post = this.posts.find((item) => item.id === id);
    if (!post) throw new Error('Blog post not found.');

    post.status = status;
    if (status === 'published' && !post.publishedAt) {
      post.publishedAt = '2026-06-23';
    }
    return post;
  }
}

describe('BlogAdminService', () => {
  beforeEach(() => {
    hasDatabaseConfigMock.mockReturnValue(true);
  });

  it('returns an empty list for an empty database repository', async () => {
    const repository = new MemoryBlogAdminRepository();
    const service = new BlogAdminService(repository);

    await expect(service.listAdminBlogPosts()).resolves.toEqual([]);
  });

  it('creates draft posts', async () => {
    const repository = new MemoryBlogAdminRepository();
    const service = new BlogAdminService(repository);

    const post = await service.createBlogPost(baseInput);

    expect(post).toMatchObject({
      title: 'Blog Admin MVP',
      slug: 'blog-admin-mvp',
      status: 'draft',
      contentMarkdown: '## Hello\nContent',
    });
  });

  it('updates post metadata and markdown content', async () => {
    const repository = new MemoryBlogAdminRepository();
    const service = new BlogAdminService(repository);
    const post = await service.createBlogPost(baseInput);

    const updated = await service.updateBlogPost(post.id, {
      ...baseInput,
      title: 'Updated Admin MVP',
      contentMarkdown: 'Line one\nLine two',
      tags: ['CMS', 'PostgreSQL'],
    });

    expect(updated.title).toBe('Updated Admin MVP');
    expect(updated.contentMarkdown).toBe('Line one\nLine two');
    expect(updated.tags).toEqual(['CMS', 'PostgreSQL']);
  });

  it('rejects duplicate slugs while allowing the current post slug during edit', async () => {
    const repository = new MemoryBlogAdminRepository();
    const service = new BlogAdminService(repository);
    const first = await service.createBlogPost(baseInput);
    await service.createBlogPost({ ...baseInput, slug: 'second-post', title: 'Second' });

    await expect(
      service.updateBlogPost(first.id, { ...baseInput, slug: 'second-post' }),
    ).rejects.toBeInstanceOf(AdminBlogValidationError);

    await expect(service.updateBlogPost(first.id, baseInput)).resolves.toMatchObject({
      slug: 'blog-admin-mvp',
    });
  });

  it('publishes and unpublishes posts without clearing publishedAt', async () => {
    const repository = new MemoryBlogAdminRepository();
    const service = new BlogAdminService(repository);
    const post = await service.createBlogPost(baseInput);

    const published = await service.publishBlogPost(post.id);
    expect(published.status).toBe('published');
    expect(published.publishedAt).toBe('2026-06-23');

    const draft = await service.unpublishBlogPost(post.id);
    expect(draft.status).toBe('draft');
    expect(draft.publishedAt).toBe('2026-06-23');
  });

  it('throws a clear database configuration error when database url is missing', async () => {
    hasDatabaseConfigMock.mockReturnValue(false);
    const service = new BlogAdminService(new MemoryBlogAdminRepository());

    await expect(service.listAdminBlogPosts()).rejects.toBeInstanceOf(
      BlogAdminDatabaseConfigError,
    );
  });
});
