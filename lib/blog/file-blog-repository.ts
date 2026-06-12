import 'server-only';
import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type {
  BlogPost,
  BlogPostFrontmatter,
  BlogPostLanguage,
  BlogPostMeta,
  BlogPostQueryOptions,
  BlogSeries,
  BlogPostStatus,
  BlogTag,
} from './blog-types';
import { calculateReadingStats } from './reading-stats';
import { tagToSlug } from './tag-slug';
import type {
  BlogPostLookupOptions,
  BlogRepository,
} from './blog-repository';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((v): v is string => typeof v === 'string');
  }
  if (typeof value === 'string') {
    return value.split(',').map((s) => s.trim());
  }
  return [];
}

function toStatus(value: unknown): BlogPostStatus {
  if (value === 'draft') return 'draft';
  return 'published';
}

function toLang(value: unknown): BlogPostLanguage {
  if (value === 'en') return 'en';
  return 'zh';
}

function toNumberOrNull(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function normalizeFrontmatter(
  raw: BlogPostFrontmatter,
  fileSlug: string,
): Omit<BlogPostMeta, 'wordCount' | 'readingTimeMinutes'> {
  const slug = raw.slug?.trim() || fileSlug;
  const title = raw.title?.trim() || slug;
  const summary = raw.summary?.trim() || '';
  const date = raw.date?.trim() || '';
  const updatedAt = raw.updatedAt?.trim() || date;
  const tags = toStringArray(raw.tags);
  const series = raw.series?.trim() || null;
  const seriesSlug = raw.seriesSlug?.trim() || null;
  const seriesOrder = toNumberOrNull(raw.seriesOrder);
  const status = toStatus(raw.status);
  const lang = toLang(raw.lang);
  const cover = raw.cover?.trim() || null;
  const seoTitle = raw.seoTitle?.trim() || null;
  const seoDescription = raw.seoDescription?.trim() || null;

  return {
    slug,
    title,
    summary,
    date,
    updatedAt,
    tags,
    series,
    seriesSlug,
    seriesOrder,
    status,
    lang,
    cover,
    seoTitle,
    seoDescription,
  };
}

/**
 * File-based blog repository.
 *
 * ONLY runs on the server. Reads Markdown files recursively from content/blog,
 * parses frontmatter, and filters/sorts results.
 *
 * This is the current implementation. In the future it can be swapped
 * for a database-backed repository without changing pages or components.
 */
export class FileBlogRepository implements BlogRepository {
  private async readPostFiles(): Promise<
    Array<{ slug: string; filePath: string }>
  > {
    const walk = async (dir: string): Promise<Array<{ slug: string; filePath: string }>> => {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      const files = await Promise.all(
        entries.map(async (entry) => {
          const entryPath = path.join(dir, entry.name);

          if (entry.isDirectory()) {
            return walk(entryPath);
          }

          if (entry.isFile() && entry.name.endsWith('.md')) {
            return [{
              slug: entry.name.replace(/\.md$/, ''),
              filePath: entryPath,
            }];
          }

          return [];
        }),
      );

      return files.flat();
    };

    try {
      return walk(BLOG_DIR);
    } catch {
      return [];
    }
  }

  private async parseFile(
    filePath: string,
    fileSlug: string,
  ): Promise<BlogPost | null> {
    try {
      const raw = await fs.readFile(filePath, 'utf-8');
      const parsed = matter(raw);
      const meta = normalizeFrontmatter(
        parsed.data as BlogPostFrontmatter,
        fileSlug,
      );
      const readingStats = calculateReadingStats(parsed.content);

      return {
        ...meta,
        ...readingStats,
        content: parsed.content,
        rawContent: raw,
      };
    } catch {
      return null;
    }
  }

  private async getAllParsedPosts(): Promise<BlogPost[]> {
    const files = await this.readPostFiles();
    const posts = await Promise.all(
      files.map((f) => this.parseFile(f.filePath, f.slug)),
    );
    return posts.filter((p): p is BlogPost => p !== null);
  }

  private applyOptions(
    posts: BlogPost[],
    options?: BlogPostQueryOptions,
  ): BlogPost[] {
    const includeDrafts = options?.includeDrafts ?? false;
    const lang = options?.lang;
    const series = options?.series;
    const seriesSlug = options?.seriesSlug;
    const limit = options?.limit;
    const offset = options?.offset ?? 0;

    let result = posts;

    if (!includeDrafts) {
      result = result.filter((p) => p.status === 'published');
    }

    if (lang) {
      result = result.filter((p) => p.lang === lang);
    }

    if (series) {
      result = result.filter((p) => p.series === series);
    }

    if (seriesSlug) {
      result = result.filter((p) => p.seriesSlug === seriesSlug);
    }

    // Sort by date descending
    result = result.sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      if (Number.isNaN(da) && Number.isNaN(db)) return 0;
      if (Number.isNaN(da)) return 1;
      if (Number.isNaN(db)) return -1;
      return db - da;
    });

    // Apply offset and limit
    result = result.slice(offset);
    if (limit !== undefined && limit >= 0) {
      result = result.slice(0, limit);
    }

    return result;
  }

  async getAllPosts(options?: BlogPostQueryOptions): Promise<BlogPostMeta[]> {
    const posts = await this.getAllParsedPosts();
    const filtered = this.applyOptions(posts, options);
    return filtered.map((post) => {
      const { slug, title, summary, date, updatedAt, tags, series, seriesSlug, seriesOrder, status, lang, cover, seoTitle, seoDescription, wordCount, readingTimeMinutes } = post;
      return { slug, title, summary, date, updatedAt, tags, series, seriesSlug, seriesOrder, status, lang, cover, seoTitle, seoDescription, wordCount, readingTimeMinutes };
    });
  }

  async getPostBySlug(
    slug: string,
    options?: BlogPostLookupOptions,
  ): Promise<BlogPost | null> {
    const posts = await this.getAllParsedPosts();
    const post = posts.find((candidate) => candidate.slug === slug) ?? null;

    if (!post) return null;

    if (!options?.includeDrafts && post.status !== 'published') {
      return null;
    }

    return post;
  }

  async getPostsByTag(
    tag: string,
    options?: BlogPostQueryOptions,
  ): Promise<BlogPostMeta[]> {
    const normalizedTag = tag.toLowerCase();
    const all = await this.getAllPosts(options);
    return all.filter((p) =>
      p.tags.some((t) => t.toLowerCase() === normalizedTag),
    );
  }

  async getAllTags(): Promise<string[]> {
    const posts = await this.getAllPosts();
    const tagSet = new Set<string>();
    for (const post of posts) {
      for (const tag of post.tags) {
        tagSet.add(tag);
      }
    }
    return Array.from(tagSet).sort();
  }

  async getAllTagsDetailed(): Promise<BlogTag[]> {
    const posts = await this.getAllPosts();
    const tagMap = new Map<string, { count: number; latestUpdatedAt: string }>();

    for (const post of posts) {
      for (const tag of post.tags) {
        const existing = tagMap.get(tag);
        const postTime = new Date(post.updatedAt || post.date).getTime();

        if (existing) {
          existing.count++;
          const existingTime = new Date(existing.latestUpdatedAt).getTime();
          if (!Number.isNaN(postTime) && (Number.isNaN(existingTime) || postTime > existingTime)) {
            existing.latestUpdatedAt = post.updatedAt || post.date;
          }
        } else {
          tagMap.set(tag, {
            count: 1,
            latestUpdatedAt: post.updatedAt || post.date,
          });
        }
      }
    }

    return Array.from(tagMap.entries())
      .map(([name, data]) => ({
        name,
        slug: tagToSlug(name),
        count: data.count,
        latestUpdatedAt: data.latestUpdatedAt,
      }))
      .sort((a, b) => {
        // Sort by count descending, then name ascending for stability
        if (b.count !== a.count) return b.count - a.count;
        return a.name.localeCompare(b.name);
      });
  }

  async getPostsBySeries(seriesSlug: string): Promise<BlogPostMeta[]> {
    const posts = await this.getAllPosts({
      includeDrafts: false,
      seriesSlug,
    });

    return sortSeriesPosts(posts);
  }

  async getAllSeries(): Promise<BlogSeries[]> {
    const posts = await this.getAllPosts({ includeDrafts: false });
    const seriesMap = new Map<string, BlogPostMeta[]>();

    for (const post of posts) {
      if (!post.series || !post.seriesSlug) {
        continue;
      }

      const current = seriesMap.get(post.seriesSlug) || [];
      current.push(post);
      seriesMap.set(post.seriesSlug, current);
    }

    return Array.from(seriesMap.entries())
      .map(([slug, seriesPosts]) => {
        const sortedPosts = sortSeriesPosts(seriesPosts);
        const latestUpdatedAt = sortedPosts.reduce((latest, post) => {
          const latestTime = new Date(latest).getTime();
          const postTime = new Date(post.updatedAt || post.date).getTime();

          if (Number.isNaN(postTime)) {
            return latest;
          }

          if (Number.isNaN(latestTime) || postTime > latestTime) {
            return post.updatedAt || post.date;
          }

          return latest;
        }, sortedPosts[0]?.updatedAt || sortedPosts[0]?.date || '');

        return {
          title: sortedPosts[0]?.series || slug,
          slug,
          count: sortedPosts.length,
          latestUpdatedAt,
          posts: sortedPosts,
        };
      })
      .sort((a, b) => {
        const da = new Date(a.latestUpdatedAt).getTime();
        const db = new Date(b.latestUpdatedAt).getTime();
        if (Number.isNaN(da) && Number.isNaN(db)) return 0;
        if (Number.isNaN(da)) return 1;
        if (Number.isNaN(db)) return -1;
        return db - da;
      });
  }
}

function sortSeriesPosts(posts: BlogPostMeta[]): BlogPostMeta[] {
  return [...posts].sort((a, b) => {
    if (a.seriesOrder !== null && b.seriesOrder !== null) {
      return a.seriesOrder - b.seriesOrder;
    }

    if (a.seriesOrder !== null) return -1;
    if (b.seriesOrder !== null) return 1;

    const da = new Date(a.date).getTime();
    const db = new Date(b.date).getTime();
    if (Number.isNaN(da) && Number.isNaN(db)) return 0;
    if (Number.isNaN(da)) return 1;
    if (Number.isNaN(db)) return -1;
    return da - db;
  });
}
