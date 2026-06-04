import type { MetadataRoute } from 'next';
import { blogService } from '@/lib/blog';
import { getAbsoluteUrl } from '@/lib/seo';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await blogService.getPublishedPosts();

  return [
    {
      url: getAbsoluteUrl('/'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: getAbsoluteUrl('/blog'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: getAbsoluteUrl(`/blog/${post.slug}`),
      lastModified: new Date(post.updatedAt || post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
