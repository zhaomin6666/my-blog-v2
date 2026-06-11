'use client';

import { BlogLayout, BlogSeriesPage } from '@/components/blog';
import type { BlogPostMeta, BlogSeries } from '@/lib/blog/blog-types';
import type { ProjectMeta } from '@/lib/projects';
import { useSettings } from '@/lib/settings-context';
import { t } from '@/lib/translations';

interface BlogSeriesDetailPageClientProps {
  series: BlogSeries;
  posts: BlogPostMeta[];
  relatedProjects: ProjectMeta[];
}

export function BlogSeriesDetailPageClient({
  series,
  posts,
  relatedProjects,
}: BlogSeriesDetailPageClientProps) {
  const { stylePreset, lang } = useSettings();

  return (
    <BlogLayout backHref="/blog/series" backLabel={t('blog.seriesTitle', lang)}>
      <BlogSeriesPage
        series={series}
        posts={posts}
        relatedProjects={relatedProjects}
        stylePreset={stylePreset}
        lang={lang}
      />
    </BlogLayout>
  );
}
