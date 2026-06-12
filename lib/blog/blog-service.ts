import type {
  BlogPostLookupOptions,
  BlogRepository,
} from './blog-repository';
import type {
  BlogAdjacentPosts,
  BlogPost,
  BlogPostLanguage,
  BlogPostMeta,
  BlogPostQueryOptions,
  BlogSeries,
  BlogTag,
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
   * By default this includes drafts for future preview/admin contexts.
   */
  async getPostBySlug(
    slug: string,
    options?: BlogPostLookupOptions,
  ): Promise<BlogPost | null> {
    return this.repository.getPostBySlug(slug, {
      includeDrafts: options?.includeDrafts ?? true,
    });
  }

  /**
   * Get a single published post by slug for public pages.
   * Drafts are never returned.
   */
  async getPublishedPostBySlug(slug: string): Promise<BlogPost | null> {
    return this.repository.getPostBySlug(slug, { includeDrafts: false });
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
   * Get all tags with aggregated metadata (slug, count, latestUpdatedAt).
   * Sorted by count descending, then name ascending.
   */
  async getAllTagsDetailed(): Promise<BlogTag[]> {
    return this.repository.getAllTagsDetailed();
  }

  /**
   * Get a single tag by its slug.
   * Returns null if no tag produces this slug.
   */
  async getTagBySlug(tagSlug: string): Promise<BlogTag | null> {
    const tags = await this.repository.getAllTagsDetailed();
    return tags.find((tag) => tag.slug === tagSlug) ?? null;
  }

  /**
   * Get published posts that have a tag matching the given slug.
   * Returns null if no tag produces this slug.
   */
  async getPostsByTagSlug(
    tagSlug: string,
    options?: Omit<BlogPostQueryOptions, 'includeDrafts'>,
  ): Promise<{ tag: BlogTag; posts: BlogPostMeta[] } | null> {
    const tags = await this.repository.getAllTagsDetailed();
    const tag = tags.find((t) => t.slug === tagSlug);
    if (!tag) return null;

    const posts = await this.repository.getPostsByTag(tag.name, {
      ...options,
      includeDrafts: false,
    });

    return { tag, posts };
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
    seriesSlug: string,
  ): Promise<BlogPostMeta[]> {
    return this.repository.getPostsBySeries(seriesSlug);
  }

  /**
   * Get adjacent published posts for the public article reader.
   *
   * Series posts use the series reading order first. Non-series posts use
   * the published post list sorted by date descending.
   */
  async getAdjacentPosts(slug: string): Promise<BlogAdjacentPosts> {
    const post = await this.getPublishedPostBySlug(slug);
    if (!post) return {};

    if (post.seriesSlug) {
      const seriesPosts = await this.getPostsBySeries(post.seriesSlug);
      const currentIndex = seriesPosts.findIndex((item) => item.slug === slug);

      if (currentIndex >= 0) {
        return {
          previous: seriesPosts[currentIndex - 1],
          next: seriesPosts[currentIndex + 1],
        };
      }
    }

    const posts = await this.getPublishedPosts();
    const currentIndex = posts.findIndex((item) => item.slug === slug);

    if (currentIndex < 0) return {};

    return {
      previous: posts[currentIndex + 1],
      next: posts[currentIndex - 1],
    };
  }

  /**
   * Get all published series.
   */
  async getAllSeries(): Promise<BlogSeries[]> {
    return this.repository.getAllSeries();
  }
}

/**
 * Singleton BlogService instance using the file-based repository.
 *
 * Import this for use in Server Components, API routes, and
 * server-side data fetching.
 */
export const blogService = new BlogService(new FileBlogRepository());
