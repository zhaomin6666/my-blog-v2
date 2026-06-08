'use client';

import { BlogLayout, BlogSeriesPage } from '@/components/blog';
import type { BlogPostMeta, BlogSeries } from '@/lib/blog/blog-types';
import { useSettings } from '@/lib/settings-context';
import { t } from '@/lib/translations';

interface BlogSeriesDetailPageClientProps {
  series: BlogSeries;
  posts: BlogPostMeta[];
}

export function BlogSeriesDetailPageClient({ series, posts }: BlogSeriesDetailPageClientProps) {
  const { stylePreset, lang } = useSettings();

  return (
    <BlogLayout backHref="/blog/series" backLabel={t('blog.seriesTitle', lang)}>
      <BlogSeriesPage
        series={series}
        posts={posts}
        stylePreset={stylePreset}
        lang={lang}
      />
    </BlogLayout>
  );
}
