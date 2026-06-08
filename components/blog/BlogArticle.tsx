import Link from 'next/link';
import { Calendar, Clock, Tag, BookOpen, Globe, ArrowLeft } from 'lucide-react';
import type { BlogPost } from '@/lib/blog/blog-types';
import { formatBlogDate } from '@/lib/blog/markdown';
import { getStyleTokens } from '@/lib/stylePresets';
import { t } from '@/lib/translations';
import type { StylePreset, Lang } from '@/lib/types';

interface BlogArticleProps {
  post: BlogPost;
  htmlContent: string;
  stylePreset: StylePreset;
  lang: Lang;
}

export function BlogArticle({ post, htmlContent, stylePreset, lang }: BlogArticleProps) {
  const tokens = getStyleTokens(stylePreset);

  return (
    <article className={`${tokens.cardBg} ${tokens.cardBorder} ${tokens.cardBorderRadius} ${tokens.cardShadow}`}>
      <div className="border-b border-zinc-200/60 p-5 dark:border-zinc-800/60 md:p-8">
        <Link
          href="/blog"
          className={`mb-4 inline-flex items-center gap-1.5 text-xs ${tokens.textMuted} transition-colors hover:text-zinc-700 dark:hover:text-zinc-300`}
        >
          <ArrowLeft size={12} />
          {t('blog.backToLogs', lang)}
        </Link>

        <h1 className={`mb-4 text-2xl md:text-3xl font-bold ${tokens.textPrimary}`}>
          {post.title}
        </h1>

        {post.summary && (
          <p className={`mb-5 text-sm md:text-base leading-relaxed ${tokens.textSecondary}`}>
            {post.summary}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="inline-flex items-center gap-1">
            <Calendar size={12} />
            {formatBlogDate(post.date, lang)}
          </span>
          {post.updatedAt !== post.date && (
            <span className="inline-flex items-center gap-1">
              <Calendar size={12} />
              {t('blog.updated', lang)}: {formatBlogDate(post.updatedAt, lang)}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Clock size={12} />
            {t(
              'blog.readingStats',
              lang,
              String(post.readingTimeMinutes),
              String(post.wordCount),
            )}
          </span>
          <span className="inline-flex items-center gap-1">
            <Globe size={12} />
            {post.lang.toUpperCase()}
          </span>
        </div>

        {(post.series || post.tags.length > 0) && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {post.series && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] ${tokens.tagBg} ${tokens.tagText} ${tokens.tagBorder} ${tokens.tagBorderRadius}`}>
                <BookOpen size={10} />
                {post.series}
              </span>
            )}
            {post.tags.map((tag) => (
              <span
                key={tag}
                className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] ${tokens.tagBg} ${tokens.tagText} ${tokens.tagBorder} ${tokens.tagBorderRadius}`}
              >
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div
        className="blog-article-body p-5 md:p-8"
        // Content originates from local Markdown files.
        // Future CMS phase should add sanitize step before rendering.
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </article>
  );
}
