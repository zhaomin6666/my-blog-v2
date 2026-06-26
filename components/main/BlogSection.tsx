'use client';

import Link from 'next/link';
import { ArrowUpRight, BookOpen, Clock, Globe } from 'lucide-react';
import type { BlogPostMeta } from '@/lib/blog/blog-types';
import { formatBlogDate } from '@/lib/blog/markdown';
import { useSettings } from '@/lib/settings-context';
import { getStyleTokens } from '@/lib/stylePresets';
import { t } from '@/lib/translations';

interface BlogSectionProps {
  posts: BlogPostMeta[];
}

export function BlogSection({ posts }: BlogSectionProps) {
  const { lang, stylePreset } = useSettings();
  const tokens = getStyleTokens(stylePreset);
  const isMacos = stylePreset === 'macos';

  return (
    <div className={`p-6 ${tokens.cardBg} ${tokens.cardBorder} ${tokens.cardBorderRadius} ${tokens.cardShadow}`}>
      <div className="flex items-center gap-2 mb-5">
        <div className={`w-1 h-5 rounded-full ${isMacos ? 'bg-orange-500' : 'bg-zinc-900 dark:bg-zinc-100'}`} />
        <h2 className={`${isMacos ? 'text-lg font-semibold' : 'text-xs font-mono font-bold uppercase tracking-wider'} ${tokens.textPrimary}`}>
          {t('blog.logs', lang)}
        </h2>
        <span className={`ml-auto text-[10px] px-2 py-0.5 ${tokens.tagBg} ${tokens.tagText} ${tokens.tagBorder} ${tokens.tagBorderRadius}`}>
          logs/
        </span>
      </div>

      <div className="space-y-2">
        {posts.length === 0 ? (
          <div className={`${tokens.nestedCardBg} ${tokens.nestedCardBorder} ${tokens.nestedCardBorderRadius} p-5`}>
            <p className={`text-sm ${tokens.textSecondary}`}>{t('blog.empty', lang)}</p>
          </div>
        ) : (
          posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className={`group block ${tokens.nestedCardBg} ${tokens.nestedCardBorder} ${tokens.nestedCardBorderRadius} p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:opacity-95 cursor-pointer`}
            >
              <div className="flex items-start gap-2 mb-2">
                <div className="min-w-0 flex flex-wrap items-center gap-2">
                  <span className={`text-[10px] ${tokens.textMuted} ${isMacos ? '' : 'font-mono'}`}>
                    [{formatBlogDate(post.date, lang)}]
                  </span>
                  <span className={`inline-flex items-center gap-1 text-[10px] ${tokens.textMuted} ${isMacos ? '' : 'font-mono'}`}>
                    <Clock size={10} />
                    {t('blog.readingTimeShort', lang, String(post.readingTimeMinutes))}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${isMacos ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 font-mono'}`}>
                    {t('blog.logLevel', lang)}
                  </span>
                  <span className={`inline-flex items-center gap-1 text-[10px] ${tokens.textMuted} ${isMacos ? '' : 'font-mono'}`}>
                    <Globe size={10} />
                    {post.lang.toUpperCase()}
                  </span>
                  {post.series && (
                    <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 ${tokens.tagBg} ${tokens.tagText} ${tokens.tagBorder} ${tokens.tagBorderRadius} ${isMacos ? '' : 'font-mono'}`}>
                      <BookOpen size={10} />
                      {post.series}
                    </span>
                  )}
                </div>
                <ArrowUpRight size={12} className="ml-auto mt-0.5 shrink-0 text-zinc-400 dark:text-zinc-500 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>

              <h3 className={`mb-1.5 ${isMacos ? 'text-sm font-medium' : 'text-xs font-mono font-bold'} ${tokens.textPrimary}`}>
                {post.title}
              </h3>

              <p className={`mb-2.5 ${isMacos ? 'text-xs leading-relaxed' : 'text-[11px] font-mono leading-relaxed'} ${tokens.textSecondary}`}>
                {post.summary}
              </p>

              <div className="flex flex-wrap gap-1">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`text-[10px] px-1.5 py-0.5 ${tokens.tagBg} ${tokens.tagText} ${tokens.tagBorder} ${tokens.tagBorderRadius} ${isMacos ? '' : 'font-mono'}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-zinc-200/40 dark:border-zinc-800/40">
        <Link
          href="/blog"
          className={`inline-flex items-center gap-1.5 text-xs ${tokens.textSecondary} hover:text-zinc-900 dark:hover:text-white transition-colors active:scale-95`}
        >
          {t('blog.viewAll', lang)}
          <ArrowUpRight size={12} />
        </Link>
      </div>
    </div>
  );
}
