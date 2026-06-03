import type { BlogRepository } from './blog-repository';
import type {
  BlogPost,
  BlogPostLanguage,
  BlogPostMeta,
  BlogPostQueryOptions,
} from './blog-types';
import { FileBlogRepository } from './file-blog-repository';

/**
 * BlogService is the unified entry point for all blog data access.
 *
 * Pages, components, and Console commands must use BlogService — never
 * read content/blog/*.md directly.
 *
 * BlogService delegates to a BlogRepository implementation. Currently
 * this is FileBlogRepository (server-side Markdown). In the future,
 * swapping the repository allows migration to a database or CMS without
 * touching pages or components.
 */
export class BlogService {
  constructor(private readonly repository: BlogRepository) {}

  /**
   * Get published posts, sorted by date descending.
   * Drafts are excluded by default.
   */
  async getPublishedPosts(options?: Omit<BlogPostQueryOptions, 'includeDrafts'>): Promise<BlogPostMeta[]> {
    return this.repository.getAllPosts({ ...options, includeDrafts: false });
  }

  /**
   * Get all posts including drafts.
   * Use sparingly — intended for admin / preview contexts.
   */
  async getAllPosts(options?: Omit<BlogPostQueryOptions, 'includeDrafts'>): Promise<BlogPostMeta[]> {
    return this.repository.getAllPosts({ ...options, includeDrafts: true });
  }

  /**
   * Get a single full post by slug.
   */
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    return this.repository.getPostBySlug(slug);
  }

  /**
   * Get posts filtered by a specific tag.
   */
  async getPostsByTag(
    tag: string,
    options?: Omit<BlogPostQueryOptions, 'includeDrafts'>,
  ): Promise<BlogPostMeta[]> {
    return this.repository.getPostsByTag(tag, { ...options, includeDrafts: false });
  }

  /**
   * Get all unique tags across published posts.
   */
  async getAllTags(): Promise<string[]> {
    return this.repository.getAllTags();
  }

  /**
   * Get posts filtered by language.
   */
  async getPostsByLang(
    lang: BlogPostLanguage,
    options?: Omit<BlogPostQueryOptions, 'lang' | 'includeDrafts'>,
  ): Promise<BlogPostMeta[]> {
    return this.repository.getAllPosts({ ...options, lang, includeDrafts: false });
  }

  /**
   * Get posts belonging to a specific series.
   */
  async getPostsBySeries(
    series: string,
    options?: Omit<BlogPostQueryOptions, 'series' | 'includeDrafts'>,
  ): Promise<BlogPostMeta[]> {
    return this.repository.getAllPosts({ ...options, series, includeDrafts: false });
  }
}

/**
 * Singleton BlogService instance using the file-based repository.
 *
 * Import this for use in Server Components, API routes, and
 * server-side data fetching.
 */
export const blogService = new BlogService(new FileBlogRepository());
