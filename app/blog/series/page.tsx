import type { Metadata } from 'next';
import { blogService } from '@/lib/blog';
import { buildMetadata } from '@/lib/seo';
import { BlogSeriesListPageClient } from './BlogSeriesListPageClient';

export const metadata: Metadata = buildMetadata({
  title: 'Blog Series',
  description:
    'Organized engineering log series from the Personal Developer OS.',
  path: '/blog/series',
});

export default async function BlogSeriesIndexPage() {
  const series = await blogService.getAllSeries();

  return <BlogSeriesListPageClient series={series} />;
}
