import Link from 'next/link';
import { Calendar, Clock, Tag, FileText } from 'lucide-react';
import type { BlogPostMeta, BlogTag } from '@/lib/blog/blog-types';
import { formatBlogDate } from '@/lib/blog/markdown';
import { getStyleTokens } from '@/lib/stylePresets';
import { t } from '@/lib/translations';
import type { Lang, StylePreset } from '@/lib/types';

interface BlogTagPageProps {
  tag: BlogTag;
  posts: BlogPostMeta[];
  stylePreset: StylePreset;
  lang: Lang;
}

export function BlogTagPage({
  tag,
  posts,
  stylePreset,
  lang,
}: BlogTagPageProps) {
  const tokens = getStyleTokens(stylePreset);

  return (
    <div className="space-y-5">
      <section className={`${tokens.cardBg} ${tokens.cardBorder} ${tokens.cardBorderRadius} ${tokens.cardShadow} p-5 md:p-7`}>
        <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] text-zinc-400 dark:text-zinc-500">
          <span className="inline-flex items-center gap-1">
            <Tag size={11} />
            {t('blog.tags', lang)}
          </span>
          <span className="inline-flex items-center gap-1">
            <FileText size={11} />
            {tag.count} {t('blog.tagPosts', lang)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar size={11} />
            {t('blog.tagLatest', lang)} {formatBlogDate(tag.latestUpdatedAt, lang)}
          </span>
        </div>

        <h1 className={`mb-3 text-2xl font-bold md:text-3xl ${tokens.textPrimary}`}>
          {tag.name}
        </h1>
        <p className={`text-sm leading-relaxed md:text-base ${tokens.textSecondary}`}>
          {t('blog.tagDetailSubtitle', lang)}
        </p>
      </section>

      {posts.length > 0 ? (
        <div className="space-y-3">
          {posts.map((post) => (
            <article
              key={post.slug}
              className={`group ${tokens.cardBg} ${tokens.cardBorder} ${tokens.cardBorderRadius} transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}
            >
              <Link href={`/blog/${post.slug}`} className="block p-4 md:p-5">
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
                <h2 className={`mb-2 text-base font-semibold md:text-lg ${tokens.textPrimary} transition-colors group-hover:text-zinc-600 dark:group-hover:text-zinc-300`}>
                  {post.title}
                </h2>
                <p className={`text-sm leading-relaxed ${tokens.textSecondary}`}>
                  {post.summary}
                </p>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className={`flex flex-col items-center justify-center py-16 ${tokens.textSecondary}`}>
          <FileText size={32} className="mb-3 opacity-40" />
          <p className="text-sm">{t('blog.empty', lang)}</p>
        </div>
      )}
    </div>
  );
}
