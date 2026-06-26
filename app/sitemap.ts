import type { MetadataRoute } from 'next';
import { blogService } from '@/lib/blog';
import { projectService } from '@/lib/projects';
import { getAbsoluteUrl } from '@/lib/seo';
import { siteConfigService } from '@/lib/site-config';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, series, tags, projects, siteConfig] = await Promise.all([
    blogService.getPublishedPosts(),
    blogService.getAllSeries(),
    blogService.getAllTagsDetailed(),
    projectService.getPublishedProjects(),
    siteConfigService.getSiteConfig(),
  ]);

  return [
    {
      url: getAbsoluteUrl('/', siteConfig),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: getAbsoluteUrl('/blog', siteConfig),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: getAbsoluteUrl('/blog/search', siteConfig),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: getAbsoluteUrl('/blog/series', siteConfig),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: getAbsoluteUrl('/blog/tags', siteConfig),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: getAbsoluteUrl('/projects', siteConfig),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: getAbsoluteUrl('/agent-demo', siteConfig),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...projects.map((project) => ({
      url: getAbsoluteUrl(`/projects/${project.slug}`, siteConfig),
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: project.featured ? 0.75 : 0.55,
    })),
    ...series.map((item) => ({
      url: getAbsoluteUrl(`/blog/series/${item.slug}`, siteConfig),
      lastModified: new Date(item.latestUpdatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    })),
    ...tags.map((tag) => ({
      url: getAbsoluteUrl(`/blog/tags/${tag.slug}`, siteConfig),
      lastModified: new Date(tag.latestUpdatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    })),
    ...posts.map((post) => ({
      url: getAbsoluteUrl(`/blog/${post.slug}`, siteConfig),
      lastModified: new Date(post.updatedAt || post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
