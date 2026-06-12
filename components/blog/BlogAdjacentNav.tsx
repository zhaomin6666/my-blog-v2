import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calendar } from 'lucide-react';
import type { BlogAdjacentPosts, BlogPostMeta } from '@/lib/blog/blog-types';
import { formatBlogDate } from '@/lib/blog/markdown';
import { getStyleTokens } from '@/lib/stylePresets';
import { t } from '@/lib/translations';
import type { Lang, StylePreset } from '@/lib/types';

interface BlogAdjacentNavProps {
  adjacentPosts: BlogAdjacentPosts;
  isSeriesNavigation: boolean;
  stylePreset: StylePreset;
  lang: Lang;
}

interface AdjacentCardProps {
  post: BlogPostMeta;
  direction: 'previous' | 'next';
  stylePreset: StylePreset;
  lang: Lang;
}

function AdjacentCard({
  post,
  direction,
  stylePreset,
  lang,
}: AdjacentCardProps) {
  const tokens = getStyleTokens(stylePreset);
  const isPrevious = direction === 'previous';

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group flex min-h-32 flex-col justify-between rounded-md border border-zinc-200/60 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-50 dark:border-zinc-800/70 dark:hover:bg-zinc-900 ${tokens.textSecondary}`}
    >
      <div>
        <div className={`mb-3 flex items-center gap-2 text-xs font-medium ${tokens.textMuted}`}>
          {isPrevious && <ArrowLeft size={13} className="shrink-0" />}
          <span>{t(isPrevious ? 'blog.previousPost' : 'blog.nextPost', lang)}</span>
          {!isPrevious && <ArrowRight size={13} className="shrink-0" />}
        </div>
        <h3 className={`line-clamp-2 text-sm font-semibold leading-snug ${tokens.textPrimary} group-hover:text-zinc-900 dark:group-hover:text-zinc-100`}>
          {post.title}
        </h3>
        {post.summary && (
          <p className={`mt-2 line-clamp-2 text-xs leading-relaxed ${tokens.textMuted}`}>
            {post.summary}
          </p>
        )}
      </div>
      <div className={`mt-4 inline-flex items-center gap-1 text-[11px] ${tokens.textMuted}`}>
        <Calendar size={11} />
        {formatBlogDate(post.date, lang)}
      </div>
    </Link>
  );
}

export function BlogAdjacentNav({
  adjacentPosts,
  isSeriesNavigation,
  stylePreset,
  lang,
}: BlogAdjacentNavProps) {
  const tokens = getStyleTokens(stylePreset);
  const hasAdjacentPost = Boolean(adjacentPosts.previous || adjacentPosts.next);

  if (!hasAdjacentPost) {
    return null;
  }

  return (
    <nav
      aria-label={t('blog.adjacentNavLabel', lang)}
      className="border-t border-zinc-200/60 p-5 dark:border-zinc-800/60 md:p-8"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className={`text-sm font-semibold ${tokens.textPrimary}`}>
          {isSeriesNavigation ? t('blog.continueSeries', lang) : t('blog.continueReading', lang)}
        </h2>
        <Link
          href="/blog"
          className={`text-xs ${tokens.textMuted} transition-colors hover:text-zinc-700 dark:hover:text-zinc-300`}
        >
          {t('blog.backToBlog', lang)}
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {adjacentPosts.previous ? (
          <AdjacentCard
            post={adjacentPosts.previous}
            direction="previous"
            stylePreset={stylePreset}
            lang={lang}
          />
        ) : (
          <div aria-hidden="true" className="hidden md:block" />
        )}
        {adjacentPosts.next && (
          <AdjacentCard
            post={adjacentPosts.next}
            direction="next"
            stylePreset={stylePreset}
            lang={lang}
          />
        )}
      </div>
    </nav>
  );
}
