'use client';

import { useSettings } from '@/lib/settings-context';
import type { BlogPostMeta } from '@/lib/blog/blog-types';
import { BlogLayout, BlogList } from '@/components/blog';
import { t } from '@/lib/translations';

interface BlogPageClientProps {
  posts: BlogPostMeta[];
}

export function BlogPageClient({ posts }: BlogPageClientProps) {
  const { stylePreset, lang } = useSettings();

  return (
    <BlogLayout backHref="/" backLabel={t('blog.home', lang)}>
      <BlogList posts={posts} stylePreset={stylePreset} lang={lang} />
    </BlogLayout>
  );
}
