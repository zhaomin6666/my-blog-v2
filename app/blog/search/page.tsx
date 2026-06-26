import type { Metadata } from 'next';
import { blogService } from '@/lib/blog';
import { buildMetadata } from '@/lib/seo';
import { siteConfigService } from '@/lib/site-config';
import { BlogSearchPageClient } from './BlogSearchPageClient';

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await siteConfigService.getSiteConfig();

  return buildMetadata({
    title: 'Search posts',
    description: 'Search published technical writing by title, tag, series, or summary.',
    path: '/blog/search',
  }, siteConfig);
}

export default async function BlogSearchPage() {
  const posts = await blogService.getPublishedPosts();

  return <BlogSearchPageClient posts={posts} />;
}
