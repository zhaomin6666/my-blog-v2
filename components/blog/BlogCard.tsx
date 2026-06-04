import Link from 'next/link';
import { Calendar, Tag, BookOpen, Globe } from 'lucide-react';
import type { BlogPostMeta } from '@/lib/blog/blog-types';
import { formatBlogDate } from '@/lib/blog/markdown';
import { getStyleTokens } from '@/lib/stylePresets';
import { t } from '@/lib/translations';
import type { StylePreset, Lang } from '@/lib/types';

interface BlogCardProps {
  post: BlogPostMeta;
  stylePreset: StylePreset;
  lang: Lang;
}

export function BlogCard({ post, stylePreset, lang }: BlogCardProps) {
  const tokens = getStyleTokens(stylePreset);

  return (
    <article
      className={`group relative ${tokens.cardBg} ${tokens.cardBorder} ${tokens.cardBorderRadius} ${tokens.cardShadow} transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}
    >
      <Link href={`/blog/${post.slug}`} className="block p-5 md:p-6">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] text-zinc-400 dark:text-zinc-500">
            <span className="inline-flex items-center gap-1">
              <Calendar size={11} />
              {formatBlogDate(post.date, lang)}
            </span>
            {post.updatedAt !== post.date && (
              <span className="hidden sm:inline text-zinc-300 dark:text-zinc-600">
                · {t('blog.updated', lang).toLowerCase()} {formatBlogDate(post.updatedAt, lang)}
              </span>
            )}
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400 dark:text-zinc-500">
            <Globe size={11} />
            {post.lang.toUpperCase()}
          </span>
        </div>

        <h2 className={`mb-2 text-lg md:text-xl font-semibold ${tokens.textPrimary} transition-colors group-hover:text-zinc-600 dark:group-hover:text-zinc-300`}>
          {post.title}
        </h2>

        <p className={`mb-4 text-sm leading-relaxed ${tokens.textSecondary}`}>
          {post.summary}
        </p>

        <div className="flex flex-wrap items-center gap-2">
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
      </Link>
    </article>
  );
}
