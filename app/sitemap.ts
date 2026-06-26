import type { MetadataRoute } from 'next';
import { blogService } from '@/lib/blog';
import { projectService } from '@/lib/projects';
import { getAbsoluteUrl } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await blogService.getPublishedPosts();
  const series = await blogService.getAllSeries();
  const tags = await blogService.getAllTagsDetailed();
  const projects = await projectService.getPublishedProjects();

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
    {
      url: getAbsoluteUrl('/blog/search'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: getAbsoluteUrl('/blog/series'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: getAbsoluteUrl('/blog/tags'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: getAbsoluteUrl('/projects'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: getAbsoluteUrl('/agent-demo'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...projects.map((project) => ({
      url: getAbsoluteUrl(`/projects/${project.slug}`),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: project.featured ? 0.75 : 0.55,
    })),
    ...series.map((item) => ({
      url: getAbsoluteUrl(`/blog/series/${item.slug}`),
      lastModified: new Date(item.latestUpdatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    })),
    ...tags.map((tag) => ({
      url: getAbsoluteUrl(`/blog/tags/${tag.slug}`),
      lastModified: new Date(tag.latestUpdatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    })),
    ...posts.map((post) => ({
      url: getAbsoluteUrl(`/blog/${post.slug}`),
      lastModified: new Date(post.updatedAt || post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
