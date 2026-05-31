'use client';

import { Lang, StylePreset } from '@/lib/types';
import { t } from '@/lib/translations';
import { blogs } from '@/data/blogs';

interface BlogSectionProps {
  lang: Lang;
  stylePreset: StylePreset;
}

export function BlogSection({ lang, stylePreset }: BlogSectionProps) {
  const isMacos = stylePreset === 'macos';

  return (
    <div className={`p-6 ${isMacos ? 'bg-white/50 dark:bg-black/30 border border-white/40 dark:border-white/5 rounded-2xl shadow-sm' : 'border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black rounded-md'}`}>
      <h2 className={`mb-4 ${isMacos ? 'text-xl font-semibold' : 'text-sm font-mono font-bold uppercase tracking-wider'}`}>
        {t('section.blog', lang)}
      </h2>
      <div className="space-y-3">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className={`p-4 ${isMacos ? 'bg-white/30 dark:bg-black/20 border border-white/30 dark:border-white/5 rounded-xl' : 'border border-zinc-200 dark:border-zinc-800 rounded bg-zinc-50 dark:bg-zinc-900/20'}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className={`mb-1 ${isMacos ? 'font-medium' : 'font-mono font-bold text-sm'}`}>
                  {lang === 'zh' ? blog.title : (blog as unknown as { titleEn: string }).titleEn || blog.title}
                </h3>
                <p className={`${isMacos ? 'text-sm text-zinc-600 dark:text-zinc-400' : 'text-xs font-mono text-zinc-500 dark:text-zinc-400'}`}>
                  {lang === 'zh' ? blog.excerpt : (blog as unknown as { excerptEn: string }).excerptEn || blog.excerpt}
                </p>
              </div>
              <span className={`shrink-0 ${isMacos ? 'text-xs text-zinc-400' : 'text-xs font-mono text-zinc-500'}`}>
                {blog.date}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
