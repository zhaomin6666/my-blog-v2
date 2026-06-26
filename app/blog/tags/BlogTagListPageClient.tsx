'use client';

import { BlogLayout, BlogTagList } from '@/components/blog';
import type { BlogTag } from '@/lib/blog/blog-types';
import { useSettings } from '@/lib/settings-context';
import { t } from '@/lib/translations';

interface BlogTagListPageClientProps {
  tags: BlogTag[];
}

export function BlogTagListPageClient({ tags }: BlogTagListPageClientProps) {
  const { stylePreset, lang } = useSettings();

  return (
    <BlogLayout backHref="/blog" backLabel={t('blog.backToBlog', lang)}>
      <BlogTagList tags={tags} stylePreset={stylePreset} lang={lang} />
    </BlogLayout>
  );
}
