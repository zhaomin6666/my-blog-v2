import type { BlogPost, BlogPostLanguage, BlogPostMeta, BlogPostStatus } from './blog-types';
import { calculateReadingStats } from './reading-stats';
import type { BlogPostRow, DbDateValue } from '@/lib/db/dbTypes';

function dateToString(value: DbDateValue, fallback = ''): string {
  if (!value) return fallback;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10) || fallback;
}

function nullableText(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function toStatus(value: string): BlogPostStatus {
  return value === 'published' ? 'published' : 'draft';
}

function toLang(value: string): BlogPostLanguage {
  return value === 'en' ? 'en' : 'zh';
}

export function mapBlogPostRowToMeta(row: BlogPostRow): BlogPostMeta {
  const content = row.content_markdown ?? '';
  const date = dateToString(row.date, dateToString(row.published_at, dateToString(row.created_at)));
  const updatedAt = dateToString(row.updated_at, date);

  return {
    slug: row.slug,
    title: row.title,
    summary: row.summary ?? '',
    date,
    updatedAt,
    tags: Array.isArray(row.tags) ? row.tags : [],
    series: nullableText(row.series),
    seriesSlug: nullableText(row.series_slug),
    seriesOrder: row.series_order ?? null,
    status: toStatus(row.status),
    lang: toLang(row.lang),
    cover: nullableText(row.cover),
    seoTitle: nullableText(row.seo_title),
    seoDescription: nullableText(row.seo_description),
    ...calculateReadingStats(content),
  };
}

export function mapBlogPostRowToPost(row: BlogPostRow): BlogPost {
  const content = row.content_markdown ?? '';

  return {
    ...mapBlogPostRowToMeta(row),
    content,
    rawContent: content,
  };
}
