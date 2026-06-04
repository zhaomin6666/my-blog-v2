import type { Metadata } from 'next';
import { DeveloperOS } from '@/components/os/DeveloperOS';
import { blogService } from '@/lib/blog/blog-service';
import { buildMetadata, seoConfig } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: seoConfig.siteName,
  description: seoConfig.defaultDescription,
  path: '/',
});

export default async function Home() {
  const blogPosts = await blogService.getPublishedPosts();

  return <DeveloperOS blogPosts={blogPosts} />;
}
