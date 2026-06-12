'use client';

import { BookOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { BlogTocItem } from '@/lib/blog/blog-types';
import { getStyleTokens } from '@/lib/stylePresets';
import { t } from '@/lib/translations';
import type { Lang, StylePreset } from '@/lib/types';

interface ArticleTocProps {
  toc: BlogTocItem[];
  stylePreset: StylePreset;
  lang: Lang;
  variant?: 'sidebar' | 'inline';
}

export function ArticleToc({
  toc,
  stylePreset,
  lang,
  variant = 'sidebar',
}: ArticleTocProps) {
  const tokens = getStyleTokens(stylePreset);
  const [activeId, setActiveId] = useState(toc[0]?.id ?? '');

  useEffect(() => {
    if (toc.length === 0) {
      return;
    }

    const headings = toc
      .map((item) => document.getElementById(item.id))
      .filter((heading): heading is HTMLElement => Boolean(heading));

    if (headings.length === 0) {
      return;
    }

    const scrollRoot = document.querySelector<HTMLElement>('[data-blog-scroll-container]');

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visibleEntries[0]?.target.id) {
          setActiveId(visibleEntries[0].target.id);
        }
      },
      {
        root: scrollRoot,
        rootMargin: '-18% 0px -65% 0px',
        threshold: [0, 1],
      },
    );

    headings.forEach((heading) => observer.observe(heading));

    const updateActiveHeading = () => {
      const currentHeading = [...headings]
        .reverse()
        .find((heading) => heading.getBoundingClientRect().top <= 120);

      setActiveId(currentHeading?.id ?? headings[0].id);
    };

    updateActiveHeading();
    const scrollTarget: HTMLElement | Window = scrollRoot ?? window;
    scrollTarget.addEventListener('scroll', updateActiveHeading, { passive: true });

    return () => {
      observer.disconnect();
      scrollTarget.removeEventListener('scroll', updateActiveHeading);
    };
  }, [toc]);

  const containerClass =
    variant === 'sidebar'
      ? `sticky top-14 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-xl p-3 ${tokens.nestedCardBg} ${tokens.nestedCardBorder} ${tokens.nestedCardBorderRadius}`
      : 'border-b border-zinc-200/60 p-5 dark:border-zinc-800/60 md:p-8';

  return (
    <nav aria-label={t('blog.tocJumpToSection', lang)} className={containerClass}>
      <div className={`mb-3 flex items-center gap-2 text-xs font-medium ${tokens.textMuted}`}>
        <BookOpen size={13} />
        {t('blog.tocOnThisPage', lang)}
      </div>
      <h2 className={`mb-4 text-sm font-semibold ${tokens.textPrimary}`}>
        {t('blog.tocTitle', lang)}
      </h2>
      <ol className={variant === 'sidebar' ? 'space-y-1.5' : 'grid grid-cols-1 gap-1.5 sm:grid-cols-2'}>
        {toc.map((item) => {
          const isActive = item.id === activeId;

          return (
            <li key={item.id} className={item.level === 3 ? 'pl-4' : undefined}>
              <a
                href={`#${item.id}`}
                className={`block rounded-md border-l-2 px-3 py-2 text-xs leading-relaxed transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-zinc-100 ${
                  isActive
                    ? 'border-blue-500 bg-blue-50/70 font-semibold text-blue-700 dark:border-blue-400 dark:bg-blue-950/30 dark:text-blue-300'
                    : `border-transparent font-normal ${item.level === 3 ? tokens.textMuted : tokens.textSecondary}`
                }`}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
