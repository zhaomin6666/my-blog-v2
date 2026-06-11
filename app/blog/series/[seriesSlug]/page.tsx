import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blogService } from '@/lib/blog';
import { projectService } from '@/lib/projects';
import { buildMetadata } from '@/lib/seo';
import { BlogSeriesDetailPageClient } from './BlogSeriesDetailPageClient';

interface BlogSeriesDetailPageProps {
  params: Promise<{ seriesSlug: string }>;
}

export async function generateStaticParams(): Promise<Array<{ seriesSlug: string }>> {
  const series = await blogService.getAllSeries();
  return series.map((item) => ({ seriesSlug: item.slug }));
}

export async function generateMetadata({ params }: BlogSeriesDetailPageProps): Promise<Metadata> {
  const { seriesSlug } = await params;
  const series = (await blogService.getAllSeries()).find((item) => item.slug === seriesSlug);

  if (!series) {
    return {
      title: 'Not Found',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return buildMetadata({
    title: series.title,
    description: `${series.title} series with ${series.count} published engineering logs.`,
    path: `/blog/series/${series.slug}`,
  });
}

export default async function BlogSeriesDetailPage({ params }: BlogSeriesDetailPageProps) {
  const { seriesSlug } = await params;
  const series = (await blogService.getAllSeries()).find((item) => item.slug === seriesSlug);

  if (!series) {
    notFound();
  }

  const posts = await blogService.getPostsBySeries(seriesSlug);
  const relatedProjects = await projectService.getProjectsByRelatedSeries(seriesSlug);

  return (
    <BlogSeriesDetailPageClient
      series={series}
      posts={posts}
      relatedProjects={relatedProjects}
    />
  );
}
