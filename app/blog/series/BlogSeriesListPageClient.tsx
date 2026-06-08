'use client';

import { BlogLayout, BlogSeriesList } from '@/components/blog';
import type { BlogSeries } from '@/lib/blog/blog-types';
import { useSettings } from '@/lib/settings-context';
import { t } from '@/lib/translations';

interface BlogSeriesListPageClientProps {
  series: BlogSeries[];
}

export function BlogSeriesListPageClient({ series }: BlogSeriesListPageClientProps) {
  const { stylePreset, lang } = useSettings();

  return (
    <BlogLayout backHref="/blog" backLabel={t('blog.logs', lang)}>
      <BlogSeriesList series={series} stylePreset={stylePreset} lang={lang} />
    </BlogLayout>
  );
}
