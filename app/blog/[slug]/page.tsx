import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blogService, renderMarkdownToHtml } from '@/lib/blog';
import { buildMetadata } from '@/lib/seo';
import { BlogArticlePageClient } from './BlogArticlePageClient';

interface BlogArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const posts = await blogService.getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await blogService.getPublishedPostBySlug(slug);

  if (!post) {
    return {
      title: 'Not Found',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return buildMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.summary,
    path: `/blog/${post.slug}`,
    type: 'article',
    publishedTime: post.date,
    modifiedTime: post.updatedAt,
    tags: post.tags,
  });
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const post = await blogService.getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const htmlContent = await renderMarkdownToHtml(post.content);

  return (
    <BlogArticlePageClient
      post={post}
      htmlContent={htmlContent}
    />
  );
}
