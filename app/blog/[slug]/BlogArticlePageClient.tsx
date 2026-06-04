'use client';

import { useSettings } from '@/lib/settings-context';
import type { BlogPost } from '@/lib/blog/blog-types';
import { BlogLayout, BlogArticle } from '@/components/blog';
import { t } from '@/lib/translations';

interface BlogArticlePageClientProps {
  post: BlogPost;
  htmlContent: string;
}

export function BlogArticlePageClient({ post, htmlContent }: BlogArticlePageClientProps) {
  const { stylePreset, lang } = useSettings();

  return (
    <BlogLayout backHref="/blog" backLabel={t('blog.logs', lang)}>
      <BlogArticle
        post={post}
        htmlContent={htmlContent}
        stylePreset={stylePreset}
        lang={lang}
      />
    </BlogLayout>
  );
}
