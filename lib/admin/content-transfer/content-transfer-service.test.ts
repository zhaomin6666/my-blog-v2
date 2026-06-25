import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { BlogPostRow, ProjectRow } from '@/lib/db/dbTypes';
import type {
  BlogMarkdownInput,
  ProjectMarkdownInput,
  SlugLookupResult,
} from './content-transfer-types';
import type { ContentTransferRepository } from './content-transfer-repository';

vi.mock('server-only', () => ({}));

vi.mock('@/lib/db/dbConfig', () => ({
  hasPersonalSiteDatabaseConfig: vi.fn(() => true),
}));

const { ContentTransferService } = await import('./content-transfer-service');
const { hasPersonalSiteDatabaseConfig } = await import('@/lib/db/dbConfig');
const hasDatabaseConfigMock = vi.mocked(hasPersonalSiteDatabaseConfig);

class MemoryContentTransferRepository implements ContentTransferRepository {
  blog = new Map<string, BlogMarkdownInput>();
  projects = new Map<string, ProjectMarkdownInput>();
  deletedSlugs = new Set<string>();

  async findBlogSlug(slug: string): Promise<SlugLookupResult> {
    return {
      activeId: this.blog.has(slug) ? slug : null,
      activeCount: this.blog.has(slug) ? 1 : 0,
      deletedCount: this.deletedSlugs.has(slug) ? 1 : 0,
    };
  }

  async findProjectSlug(slug: string): Promise<SlugLookupResult> {
    return {
      activeId: this.projects.has(slug) ? slug : null,
      activeCount: this.projects.has(slug) ? 1 : 0,
      deletedCount: this.deletedSlugs.has(slug) ? 1 : 0,
    };
  }

  async upsertBlog(input: BlogMarkdownInput): Promise<void> {
    this.blog.set(input.slug, input);
  }

  async upsertProject(input: ProjectMarkdownInput): Promise<void> {
    this.projects.set(input.slug, input);
  }

  async listBlogPostsForExport(): Promise<BlogPostRow[]> {
    return Array.from(this.blog.values()).map((post) => ({
      id: post.slug,
      title: post.title,
      slug: post.slug,
      summary: post.summary,
      content_markdown: post.contentMarkdown,
      status: post.status,
      lang: post.lang,
      cover: post.cover,
      seo_title: post.seoTitle,
      seo_description: post.seoDescription,
      tags: post.tags,
      series: post.series,
      series_slug: post.seriesSlug,
      series_order: post.seriesOrder,
      date: post.date,
      published_at: post.status === 'published' ? post.date : null,
      created_at: '2026-06-25',
      updated_at: '2026-06-25',
    }));
  }

  async listProjectsForExport(): Promise<ProjectRow[]> {
    return Array.from(this.projects.values()).map((project) => ({
      id: project.slug,
      title: project.title,
      slug: project.slug,
      subtitle: project.subtitle,
      summary: project.summary,
      content_markdown: project.contentMarkdown,
      status: project.status,
      type: project.type,
      role: project.role,
      timeline: project.timeline,
      featured: project.featured,
      display_order: project.displayOrder,
      tech_stack: project.techStack,
      features: project.features,
      highlights: project.highlights,
      links: project.links,
      related_posts: project.relatedPosts,
      related_series_slug: project.relatedSeriesSlug,
      published: project.published,
      lang: project.lang,
      seo_title: project.seoTitle,
      seo_description: project.seoDescription,
      created_at: '2026-06-25',
      updated_at: '2026-06-25',
    }));
  }

  async getBlogPostForExport(id: string): Promise<BlogPostRow | null> {
    return (await this.listBlogPostsForExport()).find((row) => row.id === id) ?? null;
  }

  async getProjectForExport(id: string): Promise<ProjectRow | null> {
    return (await this.listProjectsForExport()).find((row) => row.id === id) ?? null;
  }
}

const blogMarkdown = `---
title: Imported Post
slug: imported-post
summary: Imported summary
date: "2026-06-25"
tags: ["CMS"]
status: published
lang: zh
---

Imported body`;

describe('ContentTransferService', () => {
  beforeEach(() => {
    hasDatabaseConfigMock.mockReturnValue(true);
  });

  it('does not write during dry-run', async () => {
    const repository = new MemoryContentTransferRepository();
    const service = new ContentTransferService(repository);

    const report = await service.importMarkdownFiles('blog', 'dry-run', [
      { filename: 'imported-post.md', size: blogMarkdown.length, text: blogMarkdown },
    ]);

    expect(report.summary.wouldCreate).toBe(1);
    expect(repository.blog.size).toBe(0);
  });

  it('skips existing slugs in create_only mode', async () => {
    const repository = new MemoryContentTransferRepository();
    const service = new ContentTransferService(repository);
    await service.importMarkdownFiles('blog', 'create_only', [
      { filename: 'imported-post.md', size: blogMarkdown.length, text: blogMarkdown },
    ]);

    const report = await service.importMarkdownFiles('blog', 'create_only', [
      { filename: 'imported-post.md', size: blogMarkdown.length, text: blogMarkdown },
    ]);

    expect(report.summary.skipped).toBe(1);
    expect(repository.blog.size).toBe(1);
  });

  it('updates existing slugs and skips missing slugs in update_by_slug mode', async () => {
    const repository = new MemoryContentTransferRepository();
    const service = new ContentTransferService(repository);

    const missingReport = await service.importMarkdownFiles('blog', 'update_by_slug', [
      { filename: 'imported-post.md', size: blogMarkdown.length, text: blogMarkdown },
    ]);
    expect(missingReport.summary.skipped).toBe(1);

    await service.importMarkdownFiles('blog', 'create_only', [
      { filename: 'imported-post.md', size: blogMarkdown.length, text: blogMarkdown },
    ]);
    const updatedMarkdown = blogMarkdown.replace('Imported summary', 'Updated summary');
    const report = await service.importMarkdownFiles('blog', 'update_by_slug', [
      { filename: 'imported-post.md', size: updatedMarkdown.length, text: updatedMarkdown },
    ]);

    expect(report.summary.updated).toBe(1);
    expect(repository.blog.get('imported-post')?.summary).toBe('Updated summary');
  });

  it('exports single blog Markdown', async () => {
    const repository = new MemoryContentTransferRepository();
    const service = new ContentTransferService(repository);
    await service.importMarkdownFiles('blog', 'create_only', [
      { filename: 'imported-post.md', size: blogMarkdown.length, text: blogMarkdown },
    ]);

    const file = await service.exportSingleMarkdown('blog', 'imported-post');

    expect(file?.filename).toBe('imported-post.md');
    expect(file?.content).toContain('title: Imported Post');
    expect(file?.content).toContain('Imported body');
  });

  it('round-trips exported blog Markdown back into import validation', async () => {
    const repository = new MemoryContentTransferRepository();
    const service = new ContentTransferService(repository);

    await service.importMarkdownFiles('blog', 'create_only', [
      { filename: 'imported-post.md', size: blogMarkdown.length, text: blogMarkdown },
    ]);

    const exported = await service.exportSingleMarkdown('blog', 'imported-post');
    expect(exported).not.toBeNull();

    repository.blog.clear();

    const report = await service.importMarkdownFiles('blog', 'create_only', [
      {
        filename: exported!.filename,
        size: exported!.content.length,
        text: exported!.content,
      },
    ]);

    expect(report.summary.created).toBe(1);
    expect(report.summary.invalid).toBe(0);
    expect(repository.blog.get('imported-post')?.title).toBe('Imported Post');
  });

  it('throws a clear configuration error when database config is missing', async () => {
    hasDatabaseConfigMock.mockReturnValue(false);
    const service = new ContentTransferService(new MemoryContentTransferRepository());

    await expect(service.importMarkdownFiles('blog', 'dry-run', [])).rejects.toThrow(
      'PERSONAL_SITE_DATABASE_URL is required',
    );
  });
});
