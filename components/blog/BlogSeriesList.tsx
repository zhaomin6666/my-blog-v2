import Link from 'next/link';
import { ArrowUpRight, BookOpen, Calendar, FileText } from 'lucide-react';
import type { BlogSeries } from '@/lib/blog/blog-types';
import { formatBlogDate } from '@/lib/blog/markdown';
import { getStyleTokens } from '@/lib/stylePresets';
import { t } from '@/lib/translations';
import type { Lang, StylePreset } from '@/lib/types';

interface BlogSeriesListProps {
  series: BlogSeries[];
  stylePreset: StylePreset;
  lang: Lang;
}

export function BlogSeriesList({ series, stylePreset, lang }: BlogSeriesListProps) {
  const tokens = getStyleTokens(stylePreset);

  if (series.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-20 ${tokens.textSecondary}`}>
        <BookOpen size={40} className="mb-4 opacity-40" />
        <p className="text-sm">{t('blog.seriesEmpty', lang)}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-sky-500" />
            <h1 className={`text-xl font-bold md:text-2xl ${tokens.textPrimary}`}>
              {t('blog.seriesTitle', lang)}
            </h1>
          </div>
          <p className={`max-w-2xl text-sm leading-relaxed ${tokens.textSecondary}`}>
            {t('blog.seriesSubtitle', lang)}
          </p>
        </div>
        <span className={`text-xs ${tokens.textMuted}`}>
          {series.length} {t('blog.seriesCount', lang)}
        </span>
      </div>

      {series.map((item) => {
        const firstPost = item.posts[0];

        return (
          <article
            key={item.slug}
            className={`group ${tokens.cardBg} ${tokens.cardBorder} ${tokens.cardBorderRadius} ${tokens.cardShadow} transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}
          >
            <Link href={`/blog/series/${item.slug}`} className="block p-5 md:p-6">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-zinc-400 dark:text-zinc-500">
                  <span className="inline-flex items-center gap-1">
                    <FileText size={11} />
                    {item.count} {t('blog.count', lang)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={11} />
                    {t('blog.seriesLatest', lang)} {formatBlogDate(item.latestUpdatedAt, lang)}
                  </span>
                </div>
                <span className={`inline-flex items-center gap-1 text-[11px] ${tokens.textMuted}`}>
                  {t('blog.seriesOpen', lang)}
                  <ArrowUpRight size={11} />
                </span>
              </div>

              <h2 className={`mb-2 text-lg font-semibold md:text-xl ${tokens.textPrimary}`}>
                {item.title}
              </h2>

              {firstPost && (
                <p className={`text-sm leading-relaxed ${tokens.textSecondary}`}>
                  {firstPost.summary}
                </p>
              )}
            </Link>
          </article>
        );
      })}
    </div>
  );
}
