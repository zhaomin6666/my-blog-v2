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
  BlogPostStatus,
} from './blog-types';
import { calculateReadingStats } from './reading-stats';
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
 * ONLY runs on the server. Reads Markdown files from content/blog/*.md,
 * parses frontmatter, and filters/sorts results.
 *
 * This is the current implementation. In the future it can be swapped
 * for a database-backed repository without changing pages or components.
 */
export class FileBlogRepository implements BlogRepository {
  private async readPostFiles(): Promise<
    Array<{ slug: string; filePath: string }>
  > {
    try {
      const entries = await fs.readdir(BLOG_DIR, { withFileTypes: true });
      return entries
        .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
        .map((entry) => ({
          slug: entry.name.replace(/\.md$/, ''),
          filePath: path.join(BLOG_DIR, entry.name),
        }));
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
      const { slug, title, summary, date, updatedAt, tags, series, status, lang, cover, seoTitle, seoDescription, wordCount, readingTimeMinutes } = post;
      return { slug, title, summary, date, updatedAt, tags, series, status, lang, cover, seoTitle, seoDescription, wordCount, readingTimeMinutes };
    });
  }

  async getPostBySlug(
    slug: string,
    options?: BlogPostLookupOptions,
  ): Promise<BlogPost | null> {
    const filePath = path.join(BLOG_DIR, `${slug}.md`);
    const post = await this.parseFile(filePath, slug);

    if (!post) return null;

    // If the file exists but its frontmatter declares a different slug,
    // trust the frontmatter slug for lookup.
    if (post.slug !== slug) {
      return null;
    }

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
}
