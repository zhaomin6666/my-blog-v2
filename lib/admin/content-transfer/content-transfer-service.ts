import 'server-only';

import JSZip from 'jszip';
import { hasPersonalSiteDatabaseConfig } from '@/lib/db/dbConfig';
import type { BlogPostRow, DbJsonValue, ProjectRow } from '@/lib/db/dbTypes';
import type {
  BlogMarkdownInput,
  ContentTransferType,
  ExportScope,
  ExportedMarkdownFile,
  ImportAction,
  ImportFileResult,
  ImportMode,
  MarkdownUploadFile,
  ProjectMarkdownInput,
  SlugLookupResult,
} from './content-transfer-types';
import {
  type ContentTransferRepository,
  PostgresContentTransferRepository,
} from './content-transfer-repository';
import { markdownDownloadFilename, safeFilename } from './filename-utils';
import { buildImportReport } from './import-report';
import { MarkdownParseError, parseMarkdownFile } from './markdown-parser';
import { serializeMarkdown } from './markdown-serializer';
import { validateBlogMarkdown, validateProjectMarkdown } from './frontmatter-validators';

export const MAX_MARKDOWN_IMPORT_FILES = 20;
export const MAX_MARKDOWN_IMPORT_FILE_BYTES = 1024 * 1024;
export const MAX_MARKDOWN_EXPORT_ROWS = 100;

export class ContentTransferDatabaseConfigError extends Error {
  constructor() {
    super('PERSONAL_SITE_DATABASE_URL is required for Admin content import/export.');
    this.name = 'ContentTransferDatabaseConfigError';
  }
}

function assertDatabaseConfigured(): void {
  if (!hasPersonalSiteDatabaseConfig()) {
    throw new ContentTransferDatabaseConfigError();
  }
}

function unknownToSafeMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    if (/database|connection|string|password|secret|stack/i.test(error.message)) {
      return 'Database operation failed. Check server configuration and migration status.';
    }
    return error.message.slice(0, 180);
  }
  return 'Operation failed.';
}

function actionFor(mode: ImportMode, lookup: SlugLookupResult): ImportAction {
  if (lookup.activeCount > 1) return 'invalid';

  const exists = Boolean(lookup.activeId);
  if (mode === 'dry-run') return exists ? 'would_update' : 'would_create';
  if (mode === 'create_only') return exists ? 'skipped' : 'created';
  if (mode === 'update_by_slug') return exists ? 'updated' : 'skipped';
  return exists ? 'updated' : 'created';
}

function addLookupWarnings(lookup: SlugLookupResult, warnings: string[]): void {
  if (lookup.deletedCount > 0) {
    warnings.push('A soft-deleted row with the same slug exists; it will not be restored.');
  }
}

async function maybeWriteBlog(
  repository: ContentTransferRepository,
  mode: ImportMode,
  input: BlogMarkdownInput,
  lookup: SlugLookupResult,
): Promise<void> {
  if (mode === 'dry-run') return;
  if (mode === 'create_only' && lookup.activeId) return;
  if (mode === 'update_by_slug' && !lookup.activeId) return;

  await repository.upsertBlog(input, lookup.activeId);
}

async function maybeWriteProject(
  repository: ContentTransferRepository,
  mode: ImportMode,
  input: ProjectMarkdownInput,
  lookup: SlugLookupResult,
): Promise<void> {
  if (mode === 'dry-run') return;
  if (mode === 'create_only' && lookup.activeId) return;
  if (mode === 'update_by_slug' && !lookup.activeId) return;

  await repository.upsertProject(input, lookup.activeId);
}

function formatDate(value: unknown): string {
  if (!value) return '';
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

function nullableString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function stringArrayFromJson(value: DbJsonValue): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function linksFromJson(value: DbJsonValue): Record<string, string> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const result: Record<string, string> = {};
  for (const [key, href] of Object.entries(value)) {
    if (typeof href === 'string') result[key] = href;
  }
  return result;
}

function relatedPostsFromJson(value: DbJsonValue): Array<{ title: string; slug: string }> {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) return null;
      const record = item as Record<string, unknown>;
      if (typeof record.title !== 'string' || typeof record.slug !== 'string') return null;
      return {
        title: record.title,
        slug: record.slug,
      };
    })
    .filter((item): item is { title: string; slug: string } => item !== null);
}

function compactFrontmatter(frontmatter: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(frontmatter).filter(([, value]) => {
      if (value === null || value === undefined) return false;
      if (typeof value === 'string') return value.trim().length > 0;
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object') return Object.keys(value).length > 0;
      return true;
    }),
  );
}

function blogRowToMarkdownFile(row: BlogPostRow): ExportedMarkdownFile {
  const slug = row.slug || 'blog-post';

  return {
    filename: markdownDownloadFilename(slug),
    content: serializeMarkdown(
      compactFrontmatter({
        title: row.title,
        slug,
        summary: nullableString(row.summary),
        date: formatDate(row.date),
        updatedAt: formatDate(row.updated_at),
        tags: Array.isArray(row.tags) ? row.tags : [],
        series: nullableString(row.series),
        seriesSlug: nullableString(row.series_slug),
        seriesOrder: row.series_order,
        status: row.status || 'draft',
        lang: row.lang || 'zh',
        cover: nullableString(row.cover),
        seoTitle: nullableString(row.seo_title),
        seoDescription: nullableString(row.seo_description),
      }),
      nullableString(row.content_markdown),
    ),
  };
}

function projectRowToMarkdownFile(row: ProjectRow): ExportedMarkdownFile {
  const slug = row.slug || 'project';

  return {
    filename: markdownDownloadFilename(slug),
    content: serializeMarkdown(
      compactFrontmatter({
        title: row.title,
        slug,
        subtitle: nullableString(row.subtitle),
        summary: nullableString(row.summary),
        status: nullableString(row.status) || 'building',
        type: nullableString(row.type),
        role: stringArrayFromJson(row.role),
        timeline: nullableString(row.timeline),
        featured: row.featured,
        order: row.display_order ?? 0,
        techStack: stringArrayFromJson(row.tech_stack),
        features: stringArrayFromJson(row.features),
        highlights: stringArrayFromJson(row.highlights),
        links: linksFromJson(row.links),
        relatedPosts: relatedPostsFromJson(row.related_posts),
        relatedSeriesSlug: nullableString(row.related_series_slug),
        published: row.published,
        lang: row.lang || 'zh',
        seoTitle: nullableString(row.seo_title),
        seoDescription: nullableString(row.seo_description),
      }),
      nullableString(row.content_markdown),
    ),
  };
}

export class ContentTransferService {
  constructor(private readonly repository: ContentTransferRepository) {}

  async importMarkdownFiles(
    contentType: ContentTransferType,
    mode: ImportMode,
    files: MarkdownUploadFile[],
  ) {
    assertDatabaseConfigured();

    const results: ImportFileResult[] = [];

    for (const file of files) {
      try {
        const parsed = parseMarkdownFile(file);
        const validation =
          contentType === 'blog' ? validateBlogMarkdown(parsed) : validateProjectMarkdown(parsed);

        if (!validation.ok || !validation.input) {
          results.push({
            filename: file.filename,
            slug: '',
            title: '',
            action: 'invalid',
            warnings: validation.warnings,
            errors: validation.errors,
          });
          continue;
        }

        const lookup =
          contentType === 'blog'
            ? await this.repository.findBlogSlug(validation.input.slug)
            : await this.repository.findProjectSlug(validation.input.slug);
        const warnings = [...validation.warnings];
        addLookupWarnings(lookup, warnings);

        if (lookup.activeCount > 1) {
          results.push({
            filename: file.filename,
            slug: validation.input.slug,
            title: validation.input.title,
            action: 'invalid',
            warnings,
            errors: ['Multiple active rows have the same slug. Resolve the conflict manually.'],
          });
          continue;
        }

        const action = actionFor(mode, lookup);

        try {
          if (contentType === 'blog') {
            await maybeWriteBlog(this.repository, mode, validation.input as BlogMarkdownInput, lookup);
          } else {
            await maybeWriteProject(
              this.repository,
              mode,
              validation.input as ProjectMarkdownInput,
              lookup,
            );
          }

          results.push({
            filename: file.filename,
            slug: validation.input.slug,
            title: validation.input.title,
            action,
            warnings:
              action === 'skipped'
                ? [...warnings, 'Skipped by selected import mode and slug state.']
                : warnings,
            errors: [],
          });
        } catch (error) {
          results.push({
            filename: file.filename,
            slug: validation.input.slug,
            title: validation.input.title,
            action: 'failed',
            warnings,
            errors: [unknownToSafeMessage(error)],
          });
        }
      } catch (error) {
        results.push({
          filename: file.filename,
          slug: '',
          title: '',
          action: 'invalid',
          warnings: [],
          errors: [
            error instanceof MarkdownParseError
              ? error.message
              : 'Markdown file could not be parsed.',
          ],
        });
      }
    }

    return buildImportReport(contentType, mode, results);
  }

  async exportSingleMarkdown(
    contentType: ContentTransferType,
    id: string,
  ): Promise<ExportedMarkdownFile | null> {
    assertDatabaseConfigured();

    if (contentType === 'blog') {
      const row = await this.repository.getBlogPostForExport(id);
      return row ? blogRowToMarkdownFile(row) : null;
    }

    const row = await this.repository.getProjectForExport(id);
    return row ? projectRowToMarkdownFile(row) : null;
  }

  async exportMarkdownZip(contentType: ContentTransferType, scope: ExportScope = 'all') {
    assertDatabaseConfigured();

    const rows =
      contentType === 'blog'
        ? await this.repository.listBlogPostsForExport(scope, MAX_MARKDOWN_EXPORT_ROWS)
        : await this.repository.listProjectsForExport(scope, MAX_MARKDOWN_EXPORT_ROWS);
    const files = rows.map((row) =>
      contentType === 'blog'
        ? blogRowToMarkdownFile(row as BlogPostRow)
        : projectRowToMarkdownFile(row as ProjectRow),
    );
    const zip = new JSZip();

    for (const file of files) {
      const folder = contentType === 'blog' ? 'blog' : 'projects';
      zip.file(`${folder}/${safeFilename(file.filename, 'content.md')}`, file.content);
    }

    return {
      files,
      buffer: await zip.generateAsync({ type: 'arraybuffer' }),
    };
  }
}

export const contentTransferService = new ContentTransferService(
  new PostgresContentTransferRepository(),
);
