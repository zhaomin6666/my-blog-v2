import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blogService } from '@/lib/blog';
import { buildMetadata } from '@/lib/seo';
import { siteConfigService } from '@/lib/site-config';
import { BlogTagDetailPageClient } from './BlogTagDetailPageClient';

interface BlogTagDetailPageProps {
  params: Promise<{ tagSlug: string }>;
}

export async function generateStaticParams(): Promise<Array<{ tagSlug: string }>> {
  const tags = await blogService.getAllTagsDetailed();
  return tags.map((tag) => ({ tagSlug: tag.slug }));
}

export async function generateMetadata({ params }: BlogTagDetailPageProps): Promise<Metadata> {
  const { tagSlug } = await params;
  const [result, siteConfig] = await Promise.all([
    blogService.getPostsByTagSlug(tagSlug),
    siteConfigService.getSiteConfig(),
  ]);

  if (!result) {
    return {
      title: 'Not Found',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return buildMetadata({
    title: result.tag.name,
    description: `${result.tag.count} published posts tagged "${result.tag.name}".`,
    path: `/blog/tags/${result.tag.slug}`,
  }, siteConfig);
}

export default async function BlogTagDetailPage({ params }: BlogTagDetailPageProps) {
  const { tagSlug } = await params;
  const result = await blogService.getPostsByTagSlug(tagSlug);

  if (!result) {
    notFound();
  }

  return (
    <BlogTagDetailPageClient tag={result.tag} posts={result.posts} />
  );
}
