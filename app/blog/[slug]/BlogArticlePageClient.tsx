'use client';

import { useSettings } from '@/lib/settings-context';
import type { BlogPost, BlogTocItem } from '@/lib/blog/blog-types';
import type { ProjectMeta } from '@/lib/projects';
import { BlogLayout, BlogArticle } from '@/components/blog';
import { t } from '@/lib/translations';

interface BlogArticlePageClientProps {
  post: BlogPost;
  htmlContent: string;
  toc: BlogTocItem[];
  relatedProjects: ProjectMeta[];
}

export function BlogArticlePageClient({
  post,
  htmlContent,
  toc,
  relatedProjects,
}: BlogArticlePageClientProps) {
  const { stylePreset, lang } = useSettings();

  return (
    <BlogLayout backHref="/blog" backLabel={t('blog.logs', lang)} contentWidth="wide">
      <BlogArticle
        post={post}
        htmlContent={htmlContent}
        toc={toc}
        relatedProjects={relatedProjects}
        stylePreset={stylePreset}
        lang={lang}
      />
    </BlogLayout>
  );
}
