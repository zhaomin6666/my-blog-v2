/**
 * Blog content architecture — unified exports.
 *
 * Usage:
 *   import { blogService } from '@/lib/blog';
 *   const posts = await blogService.getPublishedPosts();
 *
 * For type imports:
 *   import type { BlogPost, BlogPostMeta } from '@/lib/blog';
 */

export * from './blog-types';
export type { BlogRepository } from './blog-repository';
export { BlogService, blogService } from './blog-service';
export { FileBlogRepository } from './file-blog-repository';
export { extractExcerpt, formatBlogDate, renderMarkdownToHtml, estimateReadingTime } from './markdown';
