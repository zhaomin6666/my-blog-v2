import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

vi.mock('@/lib/admin/admin-auth', () => ({
  requireAdminSession: vi.fn(),
}));

vi.mock('@/lib/admin/blog-admin-service', () => ({
  blogAdminService: {
    softDeleteBlogPost: vi.fn(),
  },
}));

vi.mock('@/lib/admin/content-transfer', () => ({
  MAX_MARKDOWN_IMPORT_FILE_BYTES: 1024 * 1024,
  MAX_MARKDOWN_IMPORT_FILES: 20,
  contentTransferService: {
    importMarkdownFiles: vi.fn(),
  },
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`NEXT_REDIRECT:${path}`);
  }),
}));

const { requireAdminSession } = await import('@/lib/admin/admin-auth');
const { blogAdminService } = await import('@/lib/admin/blog-admin-service');
const { revalidatePath } = await import('next/cache');
const { softDeleteBlogPostAction } = await import('./actions');

const requireAdminSessionMock = vi.mocked(requireAdminSession);
const softDeleteBlogPostMock = vi.mocked(blogAdminService.softDeleteBlogPost);
const revalidatePathMock = vi.mocked(revalidatePath);

function deleteFormData(id = 'post-id'): FormData {
  const formData = new FormData();
  formData.set('id', id);
  return formData;
}

describe('softDeleteBlogPostAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireAdminSessionMock.mockResolvedValue({
      username: 'admin',
      issuedAt: 1,
      expiresAt: 2,
    });
    softDeleteBlogPostMock.mockResolvedValue({
      id: 'post-id',
      title: 'Deleted post',
      slug: 'deleted-post',
      summary: '',
      contentMarkdown: '',
      status: 'published',
      lang: 'zh',
      cover: '',
      seoTitle: '',
      seoDescription: '',
      tags: [],
      series: '',
      seriesSlug: '',
      seriesOrder: null,
      date: '2026-06-25',
      publishedAt: '2026-06-25',
      createdAt: '2026-06-25',
      updatedAt: '2026-06-25',
    });
  });

  it('requires an admin session before soft deleting', async () => {
    requireAdminSessionMock.mockRejectedValue(new Error('unauthorized'));

    await expect(softDeleteBlogPostAction(deleteFormData())).rejects.toThrow('unauthorized');

    expect(softDeleteBlogPostMock).not.toHaveBeenCalled();
  });

  it('soft deletes a post and revalidates admin and public blog paths', async () => {
    await expect(softDeleteBlogPostAction(deleteFormData())).rejects.toThrow(
      'NEXT_REDIRECT:/admin/blog',
    );

    expect(softDeleteBlogPostMock).toHaveBeenCalledWith('post-id');
    expect(revalidatePathMock).toHaveBeenCalledWith('/admin/blog');
    expect(revalidatePathMock).toHaveBeenCalledWith('/blog');
    expect(revalidatePathMock).toHaveBeenCalledWith('/blog/search');
    expect(revalidatePathMock).toHaveBeenCalledWith('/blog/tags');
    expect(revalidatePathMock).toHaveBeenCalledWith('/blog/series');
    expect(revalidatePathMock).toHaveBeenCalledWith('/rss.xml');
    expect(revalidatePathMock).toHaveBeenCalledWith('/sitemap.xml');
    expect(revalidatePathMock).toHaveBeenCalledWith('/blog/deleted-post');
  });

  it('redirects with a safe error marker when deletion fails', async () => {
    softDeleteBlogPostMock.mockRejectedValue(new Error('database stack trace'));

    await expect(softDeleteBlogPostAction(deleteFormData())).rejects.toThrow(
      'NEXT_REDIRECT:/admin/blog?error=delete-failed',
    );
  });
});
