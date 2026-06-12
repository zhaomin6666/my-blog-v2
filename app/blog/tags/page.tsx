import type { Metadata } from 'next';
import { blogService } from '@/lib/blog';
import { buildMetadata } from '@/lib/seo';
import { BlogTagListPageClient } from './BlogTagListPageClient';

export const metadata: Metadata = buildMetadata({
  title: 'Tags',
  description:
    'Browse published blog posts by topic tag from the Personal Developer OS.',
  path: '/blog/tags',
});

export default async function BlogTagsIndexPage() {
  const tags = await blogService.getAllTagsDetailed();

  return <BlogTagListPageClient tags={tags} />;
}
