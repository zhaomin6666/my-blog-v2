import type { Metadata } from 'next';
import { blogService } from '@/lib/blog';
import { buildMetadata } from '@/lib/seo';
import { BlogSearchPageClient } from './BlogSearchPageClient';

export const metadata: Metadata = buildMetadata({
  title: 'Search posts',
  description: 'Search published engineering logs by title, tag, series, or summary.',
  path: '/blog/search',
});

export default async function BlogSearchPage() {
  const posts = await blogService.getPublishedPosts();

  return <BlogSearchPageClient posts={posts} />;
}
