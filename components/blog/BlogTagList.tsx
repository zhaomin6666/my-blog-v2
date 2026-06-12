import Link from 'next/link';
import { ArrowUpRight, Calendar, FileText, Tag } from 'lucide-react';
import type { BlogTag } from '@/lib/blog/blog-types';
import { formatBlogDate } from '@/lib/blog/markdown';
import { getStyleTokens } from '@/lib/stylePresets';
import { t } from '@/lib/translations';
import type { Lang, StylePreset } from '@/lib/types';

interface BlogTagListProps {
  tags: BlogTag[];
  stylePreset: StylePreset;
  lang: Lang;
}

export function BlogTagList({ tags, stylePreset, lang }: BlogTagListProps) {
  const tokens = getStyleTokens(stylePreset);

  if (tags.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-20 ${tokens.textSecondary}`}>
        <Tag size={40} className="mb-4 opacity-40" />
        <p className="text-sm">{t('blog.tagEmpty', lang)}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            <h1 className={`text-xl font-bold md:text-2xl ${tokens.textPrimary}`}>
              {t('blog.tagTitle', lang)}
            </h1>
          </div>
          <p className={`max-w-2xl text-sm leading-relaxed ${tokens.textSecondary}`}>
            {t('blog.tagSubtitle', lang)}
          </p>
        </div>
        <span className={`text-xs ${tokens.textMuted}`}>
          {tags.length} {t('blog.tagCount', lang)}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {tags.map((tag) => (
          <article
            key={tag.slug}
            className={`group ${tokens.cardBg} ${tokens.cardBorder} ${tokens.cardBorderRadius} ${tokens.cardShadow} transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}
          >
            <Link href={`/blog/tags/${tag.slug}`} className="block p-4 md:p-5">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] ${tokens.tagBg} ${tokens.tagText} ${tokens.tagBorder} ${tokens.tagBorderRadius}`}>
                    <Tag size={10} />
                    {tag.name}
                  </span>
                </div>
                <span className={`inline-flex items-center gap-1 text-[11px] ${tokens.textMuted}`}>
                  {t('blog.tagOpen', lang)}
                  <ArrowUpRight size={11} />
                </span>
              </div>
              <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] ${tokens.textMuted}`}>
                <span className="inline-flex items-center gap-1">
                  <FileText size={11} />
                  {tag.count} {t('blog.tagPosts', lang)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar size={11} />
                  {t('blog.tagLatest', lang)} {formatBlogDate(tag.latestUpdatedAt, lang)}
                </span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
