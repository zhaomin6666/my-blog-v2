'use client';

import { useSettings } from '@/lib/settings-context';
import type { BlogAdjacentPosts, BlogPost, BlogTocItem } from '@/lib/blog/blog-types';
import type { ProjectMeta } from '@/lib/projects';
import { BlogLayout, BlogArticle } from '@/components/blog';
import { t } from '@/lib/translations';

interface BlogArticlePageClientProps {
  post: BlogPost;
  htmlContent: string;
  toc: BlogTocItem[];
  adjacentPosts: BlogAdjacentPosts;
  relatedProjects: ProjectMeta[];
}

export function BlogArticlePageClient({
  post,
  htmlContent,
  toc,
  adjacentPosts,
  relatedProjects,
}: BlogArticlePageClientProps) {
  const { stylePreset, lang } = useSettings();

  return (
    <BlogLayout backHref="/blog" backLabel={t('blog.logs', lang)} contentWidth="wide">
      <BlogArticle
        post={post}
        htmlContent={htmlContent}
        toc={toc}
        adjacentPosts={adjacentPosts}
        relatedProjects={relatedProjects}
        stylePreset={stylePreset}
        lang={lang}
      />
    </BlogLayout>
  );
}
