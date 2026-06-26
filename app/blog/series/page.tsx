import type { Metadata } from 'next';
import { blogService } from '@/lib/blog';
import { buildMetadata } from '@/lib/seo';
import { siteConfigService } from '@/lib/site-config';
import { BlogSeriesListPageClient } from './BlogSeriesListPageClient';

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await siteConfigService.getSiteConfig();

  return buildMetadata({
    title: 'Blog Series',
    description: 'Organized technical writing series.',
    path: '/blog/series',
  }, siteConfig);
}

export default async function BlogSeriesIndexPage() {
  const series = await blogService.getAllSeries();

  return <BlogSeriesListPageClient series={series} />;
}
