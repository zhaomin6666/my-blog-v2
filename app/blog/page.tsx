import { blogService } from '@/lib/blog';
import { pageConfigService } from '@/lib/page-config';
import { buildMetadata } from '@/lib/seo';
import { BlogPageClient } from './BlogPageClient';

export async function generateMetadata() {
  const pageConfig = await pageConfigService.getPageConfig('blog');

  return buildMetadata({
    title: pageConfig.seoTitle || pageConfig.title,
    description: pageConfig.seoDescription || pageConfig.subtitle,
    path: '/blog',
  });
}

export default async function BlogPage() {
  const [posts, pageConfigZh, pageConfigEn] = await Promise.all([
    blogService.getPublishedPosts(),
    pageConfigService.getPageConfig('blog', 'zh'),
    pageConfigService.getPageConfig('blog', 'en'),
  ]);

  return (
    <BlogPageClient
      posts={posts}
      pageConfig={{ zh: pageConfigZh, en: pageConfigEn }}
    />
  );
}
