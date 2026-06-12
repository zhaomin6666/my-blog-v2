'use client';

import { BlogLayout, BlogTagPage } from '@/components/blog';
import type { BlogPostMeta, BlogTag } from '@/lib/blog/blog-types';
import { useSettings } from '@/lib/settings-context';
import { t } from '@/lib/translations';

interface BlogTagDetailPageClientProps {
  tag: BlogTag;
  posts: BlogPostMeta[];
}

export function BlogTagDetailPageClient({
  tag,
  posts,
}: BlogTagDetailPageClientProps) {
  const { stylePreset, lang } = useSettings();

  return (
    <BlogLayout backHref="/blog/tags" backLabel={t('blog.tagTitle', lang)}>
      <BlogTagPage tag={tag} posts={posts} stylePreset={stylePreset} lang={lang} />
    </BlogLayout>
  );
}
