'use server';

import { revalidatePath } from 'next/cache';
import { requireAdminSession } from '@/lib/admin/admin-auth';
import {
  contentTransferService,
  MAX_MARKDOWN_IMPORT_FILE_BYTES,
  MAX_MARKDOWN_IMPORT_FILES,
  type ContentTransferType,
  type ImportMode,
  type ImportReport,
  type MarkdownUploadFile,
} from '@/lib/admin/content-transfer';

export interface ContentImportActionState {
  ok: boolean;
  message: string;
  report: ImportReport | null;
}

function readContentType(value: FormDataEntryValue | null): ContentTransferType {
  return value === 'projects' ? 'projects' : 'blog';
}

function readImportMode(value: FormDataEntryValue | null): ImportMode {
  if (value === 'create_only' || value === 'update_by_slug' || value === 'create_or_update') {
    return value;
  }
  return 'dry-run';
}

function revalidateContentPaths(contentType: ContentTransferType): void {
  if (contentType === 'blog') {
    revalidatePath('/admin/blog');
    revalidatePath('/blog');
    revalidatePath('/blog/search');
    revalidatePath('/blog/tags');
    revalidatePath('/blog/series');
    revalidatePath('/rss.xml');
  } else {
    revalidatePath('/');
    revalidatePath('/admin/projects');
    revalidatePath('/projects');
    revalidatePath('/agent-demo');
  }

  revalidatePath('/sitemap.xml');
}

async function readMarkdownUploads(formData: FormData): Promise<MarkdownUploadFile[]> {
  const entries = formData.getAll('files');
  const files = entries.filter((entry): entry is File => entry instanceof File && entry.size > 0);

  if (files.length === 0) {
    throw new Error('Upload at least one Markdown file.');
  }

  if (files.length > MAX_MARKDOWN_IMPORT_FILES) {
    throw new Error(`Upload at most ${MAX_MARKDOWN_IMPORT_FILES} Markdown files at a time.`);
  }

  const uploads: MarkdownUploadFile[] = [];

  for (const file of files) {
    if (!file.name.toLowerCase().endsWith('.md')) {
      throw new Error('Only .md files are supported.');
    }

    if (file.size > MAX_MARKDOWN_IMPORT_FILE_BYTES) {
      throw new Error('Each Markdown file must be 1MB or smaller.');
    }

    uploads.push({
      filename: file.name,
      size: file.size,
      text: await file.text(),
    });
  }

  return uploads;
}

export async function importMarkdownAction(
  _previousState: ContentImportActionState,
  formData: FormData,
): Promise<ContentImportActionState> {
  await requireAdminSession();

  const contentType = readContentType(formData.get('contentType'));
  const mode = readImportMode(formData.get('mode'));
  const confirmed = formData.get('confirmWrite') === 'on';

  if (mode !== 'dry-run' && !confirmed) {
    return {
      ok: false,
      message: 'Confirm the PostgreSQL write before running a non-dry-run import.',
      report: null,
    };
  }

  try {
    const files = await readMarkdownUploads(formData);
    const report = await contentTransferService.importMarkdownFiles(contentType, mode, files);

    if (mode !== 'dry-run') {
      revalidateContentPaths(contentType);
    }

    return {
      ok: true,
      message: mode === 'dry-run' ? 'Dry-run completed.' : 'Import completed.',
      report,
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : 'Unable to import Markdown. Check the upload and database configuration.',
      report: null,
    };
  }
}
