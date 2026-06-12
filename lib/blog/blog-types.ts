/**
 * Blog content architecture types.
 *
 * Designed to be close to a future database model so that migration
 * to an online CMS or database is straightforward.
 */

export type BlogPostStatus = 'published' | 'draft';
export type BlogPostLanguage = 'zh' | 'en';

/**
 * Raw frontmatter as declared in Markdown files.
 * All fields are optional at parse time; validation happens in the repository.
 */
export interface BlogPostFrontmatter {
  title?: string;
  slug?: string;
  summary?: string;
  date?: string;
  updatedAt?: string;
  tags?: string[] | string;
  series?: string;
  seriesSlug?: string;
  seriesOrder?: number;
  status?: string;
  lang?: string;
  cover?: string;
  seoTitle?: string;
  seoDescription?: string;
}

/**
 * Lightweight metadata for listing pages.
 * Does not include the full content body.
 */
export interface BlogPostMeta {
  slug: string;
  title: string;
  summary: string;
  date: string;
  updatedAt: string;
  tags: string[];
  series: string | null;
  seriesSlug: string | null;
  seriesOrder: number | null;
  status: BlogPostStatus;
  lang: BlogPostLanguage;
  cover: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  wordCount: number;
  readingTimeMinutes: number;
}

/**
 * Full blog post including rendered / raw content.
 */
export interface BlogPost extends BlogPostMeta {
  content: string;
  rawContent: string;
}

/**
 * Aggregated metadata for a published blog series.
 */
export interface BlogSeries {
  title: string;
  slug: string;
  count: number;
  latestUpdatedAt: string;
  posts: BlogPostMeta[];
}

/**
 * Aggregated metadata for a published tag.
 */
export interface BlogTag {
  name: string;
  slug: string;
  count: number;
  latestUpdatedAt: string;
}

/**
 * Table of contents item extracted from Markdown article headings.
 */
export interface BlogTocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

/**
 * Query options for listing posts.
 */
export interface BlogPostQueryOptions {
  /** Include draft posts in results. Default: false. */
  includeDrafts?: boolean;
  /** Filter by language. If omitted, returns all languages. */
  lang?: BlogPostLanguage;
  /** Filter by series name. */
  series?: string;
  /** Filter by series slug. */
  seriesSlug?: string;
  /** Maximum number of posts to return. */
  limit?: number;
  /** Number of posts to skip (for future pagination). */
  offset?: number;
}
