'use client';

import { useSettings } from '@/lib/settings-context';
import type { BlogPostMeta } from '@/lib/blog/blog-types';
import { BlogLayout, BlogList } from '@/components/blog';
import type { PageConfig } from '@/lib/page-config/page-config-types';
import { t } from '@/lib/translations';
import type { Lang } from '@/lib/types';

interface BlogPageClientProps {
  posts: BlogPostMeta[];
  pageConfig: Record<Lang, PageConfig>;
}

export function BlogPageClient({ posts, pageConfig }: BlogPageClientProps) {
  const { stylePreset, lang } = useSettings();
  const currentPageConfig = pageConfig[lang];

  return (
    <BlogLayout
      backHref="/"
      backLabel={t('blog.home', lang)}
      footerText={currentPageConfig.footer}
    >
      <BlogList
        posts={posts}
        pageConfig={currentPageConfig}
        stylePreset={stylePreset}
        lang={lang}
      />
    </BlogLayout>
  );
}
