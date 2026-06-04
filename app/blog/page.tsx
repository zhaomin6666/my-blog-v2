import type { Metadata } from 'next';
import { blogService } from '@/lib/blog';
import { BlogPageClient } from './BlogPageClient';

export const metadata: Metadata = {
  title: 'Engineering Logs — Personal Dev OS',
  description: 'Technical logs, engineering notes, and development insights.',
};

export default async function BlogPage() {
  const posts = await blogService.getPublishedPosts();

  return <BlogPageClient posts={posts} />;
}
