import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

vi.mock('@/lib/admin/admin-auth', () => ({
  requireAdminSession: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('@/lib/admin/content-transfer', () => ({
  MAX_MARKDOWN_IMPORT_FILE_BYTES: 1024 * 1024,
  MAX_MARKDOWN_IMPORT_FILES: 20,
  contentTransferService: {
    importMarkdownFiles: vi.fn(),
  },
}));

const { contentTransferService } = await import('@/lib/admin/content-transfer');
const { runMarkdownImportAction } = await import('./markdown-import-actions');

const importMarkdownFilesMock = vi.mocked(contentTransferService.importMarkdownFiles);

function createFormData(filename = 'sample.md'): FormData {
  const formData = new FormData();
  formData.set('mode', 'dry-run');
  formData.set(
    'files',
    new File(['---\ntitle: Sample\nslug: sample\n---\n\nBody'], filename, {
      type: 'text/markdown',
    }),
  );
  return formData;
}

describe('runMarkdownImportAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    importMarkdownFilesMock.mockResolvedValue({
      contentType: 'blog',
      mode: 'dry-run',
      summary: {
        scanned: 1,
        valid: 1,
        invalid: 0,
        created: 0,
        updated: 0,
        skipped: 0,
        wouldCreate: 1,
        wouldUpdate: 0,
        wouldSkip: 0,
        warnings: 0,
        failed: 0,
      },
      files: [],
    });
  });

  it('uses the fixed Blog content type instead of reading contentType from form data', async () => {
    const formData = createFormData();
    formData.set('contentType', 'projects');

    await runMarkdownImportAction('blog', formData);

    expect(importMarkdownFilesMock).toHaveBeenCalledWith(
      'blog',
      'dry-run',
      expect.arrayContaining([expect.objectContaining({ filename: 'sample.md' })]),
    );
  });

  it('uses the fixed Projects content type instead of reading contentType from form data', async () => {
    const formData = createFormData('project.md');
    formData.set('contentType', 'blog');

    await runMarkdownImportAction('projects', formData);

    expect(importMarkdownFilesMock).toHaveBeenCalledWith(
      'projects',
      'dry-run',
      expect.arrayContaining([expect.objectContaining({ filename: 'project.md' })]),
    );
  });
});
