import type { Metadata } from 'next';
import { blogService } from '@/lib/blog';
import { buildMetadata } from '@/lib/seo';
import { siteConfigService } from '@/lib/site-config';
import { BlogTagListPageClient } from './BlogTagListPageClient';

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await siteConfigService.getSiteConfig();

  return buildMetadata({
    title: 'Tags',
    description: 'Browse published blog posts by topic tag.',
    path: '/blog/tags',
  }, siteConfig);
}

export default async function BlogTagsIndexPage() {
  const tags = await blogService.getAllTagsDetailed();

  return <BlogTagListPageClient tags={tags} />;
}
