import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blogService, extractBlogToc, renderMarkdownToHtml } from '@/lib/blog';
import { projectService } from '@/lib/projects';
import { buildMetadata } from '@/lib/seo';
import { siteConfigService } from '@/lib/site-config';
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
  const [post, siteConfig] = await Promise.all([
    blogService.getPublishedPostBySlug(slug),
    siteConfigService.getSiteConfig(),
  ]);

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
  }, siteConfig);
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const post = await blogService.getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const htmlContent = await renderMarkdownToHtml(post.content);
  const toc = extractBlogToc(post.content);
  const adjacentPosts = await blogService.getAdjacentPosts(post.slug);
  const relatedProjects = post.seriesSlug
    ? await projectService.getProjectsByRelatedSeries(post.seriesSlug)
    : [];

  return (
    <BlogArticlePageClient
      post={post}
      htmlContent={htmlContent}
      toc={toc}
      adjacentPosts={adjacentPosts}
      relatedProjects={relatedProjects}
    />
  );
}
