import 'server-only';
import { queryPostgres } from '@/lib/db/postgres';
import type { BlogPostRow } from '@/lib/db/dbTypes';
import type {
  BlogPost,
  BlogPostMeta,
  BlogPostQueryOptions,
  BlogSeries,
  BlogTag,
} from './blog-types';
import type { BlogPostLookupOptions, BlogRepository } from './blog-repository';
import { mapBlogPostRowToMeta, mapBlogPostRowToPost } from './blog-db-mapper';
import { tagToSlug } from './tag-slug';

const BLOG_POST_COLUMNS = `
  id,
  title,
  slug,
  summary,
  content_markdown,
  status,
  lang,
  cover,
  seo_title,
  seo_description,
  tags,
  series,
  series_slug,
  series_order,
  date,
  published_at,
  created_at,
  updated_at
`;

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

export class DatabaseBlogRepository implements BlogRepository {
  async getAllPosts(options?: BlogPostQueryOptions): Promise<BlogPostMeta[]> {
    const where = ['deleted_at is null'];
    const values: unknown[] = [];

    if (options?.includeDrafts) {
      where.push("status in ('draft', 'published')");
    } else {
      where.push("status = 'published'");
    }

    if (options?.lang) {
      values.push(options.lang);
      where.push(`lang = $${values.length}`);
    }

    if (options?.series) {
      values.push(options.series);
      where.push(`series = $${values.length}`);
    }

    if (options?.seriesSlug) {
      values.push(options.seriesSlug);
      where.push(`series_slug = $${values.length}`);
    }

    let limitOffset = '';
    if (options?.limit !== undefined && options.limit >= 0) {
      values.push(options.limit);
      limitOffset += ` limit $${values.length}`;
    }

    if (options?.offset !== undefined && options.offset > 0) {
      values.push(options.offset);
      limitOffset += ` offset $${values.length}`;
    }

    const result = await queryPostgres<BlogPostRow>(
      `
        select ${BLOG_POST_COLUMNS}
        from blog_posts
        where ${where.join(' and ')}
        order by date desc nulls last, published_at desc nulls last, updated_at desc
        ${limitOffset}
      `,
      values,
    );

    return result.rows.map(mapBlogPostRowToMeta);
  }

  async getPostBySlug(
    slug: string,
    options?: BlogPostLookupOptions,
  ): Promise<BlogPost | null> {
    const includeDrafts = options?.includeDrafts ?? false;
    const statusFilter = includeDrafts
      ? "status in ('draft', 'published')"
      : "status = 'published'";

    const result = await queryPostgres<BlogPostRow>(
      `
        select ${BLOG_POST_COLUMNS}
        from blog_posts
        where deleted_at is null
          and slug = $1
          and ${statusFilter}
        limit 1
      `,
      [slug],
    );

    const row = result.rows[0];
    return row ? mapBlogPostRowToPost(row) : null;
  }

  async getPostsByTag(
    tag: string,
    options?: BlogPostQueryOptions,
  ): Promise<BlogPostMeta[]> {
    const normalizedTag = tag.toLowerCase();
    const posts = await this.getAllPosts(options);
    return posts.filter((post) =>
      post.tags.some((item) => item.toLowerCase() === normalizedTag),
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
        if (b.count !== a.count) return b.count - a.count;
        return a.name.localeCompare(b.name);
      });
  }

  async getAllSeries(): Promise<BlogSeries[]> {
    const posts = await this.getAllPosts({ includeDrafts: false });
    const seriesMap = new Map<string, BlogPostMeta[]>();

    for (const post of posts) {
      if (!post.series || !post.seriesSlug) continue;

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

          if (Number.isNaN(postTime)) return latest;
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

  async getPostsBySeries(seriesSlug: string): Promise<BlogPostMeta[]> {
    const posts = await this.getAllPosts({
      includeDrafts: false,
      seriesSlug,
    });

    return sortSeriesPosts(posts);
  }
}
