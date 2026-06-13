'use client';

import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { BlogPostMeta } from '@/lib/blog/blog-types';
import { BlogCard, BlogLayout } from '@/components/blog';
import { useSettings } from '@/lib/settings-context';
import { getStyleTokens } from '@/lib/stylePresets';
import { t } from '@/lib/translations';

interface BlogSearchPageClientProps {
  posts: BlogPostMeta[];
}

function normalizeQuery(value: string): string[] {
  return value
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

function buildSearchText(post: BlogPostMeta): string {
  return [
    post.title,
    post.summary,
    post.series ?? '',
    ...post.tags,
  ].join(' ').toLowerCase();
}

export function BlogSearchPageClient({ posts }: BlogSearchPageClientProps) {
  const { stylePreset, lang } = useSettings();
  const [query, setQuery] = useState('');
  const tokens = getStyleTokens(stylePreset);
  const terms = useMemo(() => normalizeQuery(query), [query]);
  const isSearching = terms.length > 0;
  const recentPosts = useMemo(() => posts.slice(0, 5), [posts]);
  const filteredPosts = useMemo(() => {
    if (!isSearching) {
      return recentPosts;
    }

    return posts.filter((post) => {
      const searchText = buildSearchText(post);
      return terms.every((term) => searchText.includes(term));
    });
  }, [isSearching, posts, recentPosts, terms]);

  return (
    <BlogLayout backHref="/blog" backLabel={t('blog.backToBlog', lang)}>
      <div className="space-y-5">
        <section className={`${tokens.cardBg} ${tokens.cardBorder} ${tokens.cardBorderRadius} ${tokens.cardShadow} p-5 md:p-6`}>
          <div className="mb-4 flex items-center gap-2">
            <Search size={16} className="text-zinc-400 dark:text-zinc-500" />
            <h1 className={`text-xl font-bold md:text-2xl ${tokens.textPrimary}`}>
              {t('blog.searchTitle', lang)}
            </h1>
          </div>
          <label className="sr-only" htmlFor="blog-search-input">
            {t('blog.searchTitle', lang)}
          </label>
          <div className="relative">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
            />
            <input
              id="blog-search-input"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('blog.searchPlaceholder', lang)}
              className="w-full rounded-md border border-zinc-200/70 bg-white/80 py-2.5 pl-9 pr-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-800/80 dark:bg-zinc-950/60 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
            />
          </div>
          <p className={`mt-3 text-xs ${tokens.textMuted}`}>
            {isSearching
              ? `${filteredPosts.length} ${t('blog.searchResults', lang)}`
              : t('blog.searchHint', lang)}
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className={`text-sm font-semibold ${tokens.textPrimary}`}>
              {isSearching ? t('blog.searchResults', lang) : t('blog.recentPosts', lang)}
            </h2>
            {!isSearching && (
              <span className={`text-xs ${tokens.textMuted}`}>
                {recentPosts.length} {t('blog.count', lang)}
              </span>
            )}
          </div>

          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <BlogCard key={post.slug} post={post} stylePreset={stylePreset} lang={lang} />
            ))
          ) : (
            <div className={`flex flex-col items-center justify-center rounded-md border border-dashed border-zinc-200/70 py-16 text-center dark:border-zinc-800/80 ${tokens.textSecondary}`}>
              <Search size={34} className="mb-3 opacity-35" />
              <p className={`text-sm font-medium ${tokens.textPrimary}`}>
                {t('blog.searchEmpty', lang)}
              </p>
              <p className={`mt-1 text-xs ${tokens.textMuted}`}>
                {t('blog.searchTryAnother', lang)}
              </p>
            </div>
          )}
        </section>
      </div>
    </BlogLayout>
  );
}
