'use client';

import Link from 'next/link';
import { useSettings } from '@/lib/settings-context';
import { t } from '@/lib/translations';
import { BlogLayout } from './BlogLayout';

export function BlogNotFoundClient() {
  const { lang } = useSettings();

  return (
    <BlogLayout backHref="/blog" backLabel={t('blog.logs', lang)}>
      <div className="flex flex-col items-center justify-center py-20 text-zinc-500 dark:text-zinc-400">
        <h2 className="mb-4 text-4xl font-bold text-zinc-300 dark:text-zinc-600">404</h2>
        <p className="mb-6">{t('blog.notFoundDescription', lang)}</p>
        <Link
          href="/blog"
          className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        >
          {t('blog.returnToLogs', lang)}
        </Link>
      </div>
    </BlogLayout>
  );
}
