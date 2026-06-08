import Link from 'next/link';
import { ArrowUpRight, BookOpen, Calendar, Clock, FileText } from 'lucide-react';
import type { BlogPostMeta, BlogSeries } from '@/lib/blog/blog-types';
import { formatBlogDate } from '@/lib/blog/markdown';
import { getStyleTokens } from '@/lib/stylePresets';
import { t } from '@/lib/translations';
import type { Lang, StylePreset } from '@/lib/types';

interface BlogSeriesPageProps {
  series: BlogSeries;
  posts: BlogPostMeta[];
  stylePreset: StylePreset;
  lang: Lang;
}

export function BlogSeriesPage({ series, posts, stylePreset, lang }: BlogSeriesPageProps) {
  const tokens = getStyleTokens(stylePreset);

  return (
    <div className="space-y-5">
      <section className={`${tokens.cardBg} ${tokens.cardBorder} ${tokens.cardBorderRadius} ${tokens.cardShadow} p-5 md:p-7`}>
        <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] text-zinc-400 dark:text-zinc-500">
          <span className="inline-flex items-center gap-1">
            <BookOpen size={11} />
            {t('blog.seriesLabel', lang)}
          </span>
          <span className="inline-flex items-center gap-1">
            <FileText size={11} />
            {series.count} {t('blog.count', lang)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar size={11} />
            {t('blog.seriesLatest', lang)} {formatBlogDate(series.latestUpdatedAt, lang)}
          </span>
        </div>

        <h1 className={`mb-3 text-2xl font-bold md:text-3xl ${tokens.textPrimary}`}>
          {series.title}
        </h1>
        <p className={`text-sm leading-relaxed md:text-base ${tokens.textSecondary}`}>
          {t('blog.seriesDetailSubtitle', lang)}
        </p>
      </section>

      <div className="space-y-3">
        {posts.map((post, index) => (
          <article
            key={post.slug}
            className={`group ${tokens.cardBg} ${tokens.cardBorder} ${tokens.cardBorderRadius} transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}
          >
            <Link href={`/blog/${post.slug}`} className="grid gap-4 p-4 sm:grid-cols-[44px_1fr_auto] sm:items-start md:p-5">
              <div className={`flex h-9 w-9 items-center justify-center rounded-md text-xs font-semibold ${tokens.tagBg} ${tokens.tagText} ${tokens.tagBorder}`}>
                {String(post.seriesOrder ?? index + 1).padStart(2, '0')}
              </div>

              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-zinc-400 dark:text-zinc-500">
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={11} />
                    {formatBlogDate(post.date, lang)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock size={11} />
                    {t('blog.readingTimeShort', lang, String(post.readingTimeMinutes))}
                  </span>
                </div>
                <h2 className={`mb-2 text-base font-semibold md:text-lg ${tokens.textPrimary}`}>
                  {post.title}
                </h2>
                <p className={`text-sm leading-relaxed ${tokens.textSecondary}`}>
                  {post.summary}
                </p>
              </div>

              <span className={`inline-flex items-center gap-1 text-xs ${tokens.textMuted} sm:justify-self-end`}>
                {t('blog.readMore', lang)}
                <ArrowUpRight size={12} />
              </span>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
