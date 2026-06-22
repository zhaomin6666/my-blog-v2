import { describe, expect, it, vi } from 'vitest';
import type { BlogRepository } from '@/lib/blog/blog-repository';
import type { ProjectRepository } from '@/lib/projects/project-repository';

vi.mock('@/lib/content/contentSource', () => ({
  getBlogRepository: () => ({ getAllPosts: async () => [] }),
  getProjectRepository: () => ({ getAllProjects: async () => [] }),
}));

import { BlogService } from '@/lib/blog/blog-service';
import { ProjectService } from '@/lib/projects/project-service';

const emptyBlogRepository: BlogRepository = {
  getAllPosts: async () => [],
  getPostBySlug: async () => null,
  getPostsByTag: async () => [],
  getAllTags: async () => [],
  getAllTagsDetailed: async () => [],
  getAllSeries: async () => [],
  getPostsBySeries: async () => [],
};

const emptyProjectRepository: ProjectRepository = {
  getAllProjects: async () => [],
  getProjectBySlug: async () => null,
};

describe('empty database content services', () => {
  it('keeps empty blog collections as empty results', async () => {
    const service = new BlogService(emptyBlogRepository);

    await expect(service.getPublishedPosts()).resolves.toEqual([]);
    await expect(service.getAllTagsDetailed()).resolves.toEqual([]);
    await expect(service.getAllSeries()).resolves.toEqual([]);
  });

  it('keeps empty project collections as empty results', async () => {
    const service = new ProjectService(emptyProjectRepository);

    await expect(service.getPublishedProjects()).resolves.toEqual([]);
    await expect(service.getFeaturedProjects()).resolves.toEqual([]);
  });
});
