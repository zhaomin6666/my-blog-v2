import type { Metadata } from 'next';
import { blogService } from '@/lib/blog';
import { buildMetadata } from '@/lib/seo';
import { BlogPageClient } from './BlogPageClient';

export const metadata: Metadata = buildMetadata({
  title: 'Engineering Logs',
  description:
    'Technical blog posts, AI Agent learning logs, project retrospectives, and engineering notes.',
  path: '/blog',
});

export default async function BlogPage() {
  const posts = await blogService.getPublishedPosts();

  return <BlogPageClient posts={posts} />;
}
