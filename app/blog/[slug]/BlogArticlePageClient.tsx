'use client';

import { useSettings } from '@/lib/settings-context';
import type { BlogPost } from '@/lib/blog/blog-types';
import type { ProjectMeta } from '@/lib/projects';
import { BlogLayout, BlogArticle } from '@/components/blog';
import { t } from '@/lib/translations';

interface BlogArticlePageClientProps {
  post: BlogPost;
  htmlContent: string;
  relatedProjects: ProjectMeta[];
}

export function BlogArticlePageClient({
  post,
  htmlContent,
  relatedProjects,
}: BlogArticlePageClientProps) {
  const { stylePreset, lang } = useSettings();

  return (
    <BlogLayout backHref="/blog" backLabel={t('blog.logs', lang)}>
      <BlogArticle
        post={post}
        htmlContent={htmlContent}
        relatedProjects={relatedProjects}
        stylePreset={stylePreset}
        lang={lang}
      />
    </BlogLayout>
  );
}
