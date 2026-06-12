import type {
  BlogPost,
  BlogPostMeta,
  BlogPostQueryOptions,
  BlogSeries,
  BlogTag,
} from './blog-types';

export interface BlogPostLookupOptions {
  includeDrafts?: boolean;
}

/**
 * BlogRepository interface.
 *
 * Abstracts the source of blog content (files, database, CMS API, etc.)
 * so that upper layers (pages, components, Console commands) never depend
 * on a specific storage mechanism.
 *
 * Current implementation: FileBlogRepository (reads content/blog/*.md)
 * Future implementations: DbBlogRepository, CmsBlogRepository, etc.
 */
export interface BlogRepository {
  /**
   * Get all post metadata matching the given options.
   * Default: only published posts, sorted by date descending.
   */
  getAllPosts(options?: BlogPostQueryOptions): Promise<BlogPostMeta[]>;

  /**
   * Get a single full post by its unique slug.
   * Returns null if not found.
   */
  getPostBySlug(
    slug: string,
    options?: BlogPostLookupOptions,
  ): Promise<BlogPost | null>;

  /**
   * Get all posts that include the given tag.
   */
  getPostsByTag(
    tag: string,
    options?: BlogPostQueryOptions,
  ): Promise<BlogPostMeta[]>;

  /**
   * Get a list of all unique tags across published posts.
   */
  getAllTags(): Promise<string[]>;

  /**
   * Get all tags with aggregated metadata (slug, count, latestUpdatedAt).
   * Sorted by count descending, then name ascending.
   */
  getAllTagsDetailed(): Promise<BlogTag[]>;

  /**
   * Get all published series with their published posts.
   */
  getAllSeries(): Promise<BlogSeries[]>;

  /**
   * Get published posts belonging to a specific series slug.
   */
  getPostsBySeries(seriesSlug: string): Promise<BlogPostMeta[]>;
}
