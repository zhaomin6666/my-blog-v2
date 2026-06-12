import Link from 'next/link';
import { BookOpen, FileText, Tags } from 'lucide-react';
import type { BlogPostMeta } from '@/lib/blog/blog-types';
import { getStyleTokens } from '@/lib/stylePresets';
import { t } from '@/lib/translations';
import type { StylePreset, Lang } from '@/lib/types';
import { BlogCard } from './BlogCard';

interface BlogListProps {
  posts: BlogPostMeta[];
  stylePreset: StylePreset;
  lang: Lang;
}

export function BlogList({ posts, stylePreset, lang }: BlogListProps) {
  const tokens = getStyleTokens(stylePreset);

  if (posts.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-20 ${tokens.textSecondary}`}>
        <FileText size={40} className="mb-4 opacity-40" />
        <p className="text-sm">{t('blog.empty', lang)}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <h1 className={`text-xl md:text-2xl font-bold ${tokens.textPrimary}`}>
            {t('blog.title', lang)}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/blog/tags"
            className={`inline-flex items-center gap-1.5 text-xs ${tokens.textMuted} transition-colors hover:text-zinc-700 dark:hover:text-zinc-300`}
          >
            <Tags size={12} />
            {t('blog.viewTags', lang)}
          </Link>
          <Link
            href="/blog/series"
            className={`inline-flex items-center gap-1.5 text-xs ${tokens.textMuted} transition-colors hover:text-zinc-700 dark:hover:text-zinc-300`}
          >
            <BookOpen size={12} />
            {t('blog.viewSeries', lang)}
          </Link>
          <span className={`text-xs ${tokens.textMuted}`}>
            {posts.length} {t('blog.count', lang)}
          </span>
        </div>
      </div>

      {posts.map((post) => (
        <BlogCard key={post.slug} post={post} stylePreset={stylePreset} lang={lang} />
      ))}
    </div>
  );
}
