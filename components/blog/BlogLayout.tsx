'use client';

import Link from 'next/link';
import { ArrowLeft, Layout, Moon, Sun, Monitor } from 'lucide-react';
import { useSettings } from '@/lib/settings-context';
import { t } from '@/lib/translations';
import { getStyleTokens } from '@/lib/stylePresets';

interface BlogLayoutProps {
  children: React.ReactNode;
  backHref?: string;
  backLabel?: string;
  contentWidth?: 'default' | 'wide';
  footerText?: string;
}

export function BlogLayout({
  children,
  backHref = '/',
  backLabel,
  contentWidth = 'default',
  footerText,
}: BlogLayoutProps) {
  const { theme, lang, stylePreset, toggleTheme, toggleLang, toggleStylePreset, mounted } = useSettings();

  if (!mounted) {
    return <div className="min-h-screen bg-white dark:bg-black" />;
  }

  const tokens = getStyleTokens(stylePreset);
  const backText = backLabel || t('blog.back', lang);

  return (
    <div
      data-blog-scroll-container
      className={`h-screen overflow-y-auto overscroll-contain transition-colors duration-200 ${tokens.desktopBg} ${tokens.bodyFont}`}
    >
      <header className={`sticky top-0 z-50 ${tokens.statusBarHeight} ${tokens.statusBarClass} ${tokens.statusBarFont} flex items-center justify-between px-3 md:px-5`}>
        <div className="flex items-center gap-2 md:gap-3">
          <Link
            href={backHref}
            aria-label={t('blog.ariaBackHome', lang)}
            className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline text-xs">{backText}</span>
          </Link>
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <Layout size={12} />
            <span className="text-xs font-medium">{t('desktop.welcome', lang)}</span>
          </Link>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-md hover:bg-zinc-100/70 dark:hover:bg-zinc-800/70 transition-colors active:scale-95"
            aria-label={theme === 'dark' ? t('blog.ariaToggleThemeToLight', lang) : t('blog.ariaToggleThemeToDark', lang)}
          >
            {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
          </button>

          <button
            onClick={toggleLang}
            className="p-1.5 rounded-md hover:bg-zinc-100/70 dark:hover:bg-zinc-800/70 transition-colors active:scale-95 text-[11px] font-medium"
            aria-label={t('blog.ariaToggleLanguage', lang)}
          >
            {t(`lang.${lang}`, lang)}
          </button>

          <button
            onClick={toggleStylePreset}
            className="p-1.5 rounded-md hover:bg-zinc-100/70 dark:hover:bg-zinc-800/70 transition-colors active:scale-95"
            aria-label={t('blog.ariaToggleStyle', lang)}
          >
            <Monitor size={13} />
          </button>
        </div>
      </header>

      <main className="px-4 py-6 md:px-8 md:py-10">
        <div className={contentWidth === 'wide' ? 'mx-auto max-w-6xl' : 'mx-auto max-w-3xl'}>
          {children}
        </div>
      </main>

      <footer className={`${tokens.statusBarHeight} ${tokens.statusBarClass} ${tokens.statusBarFont} flex items-center justify-center px-4`}>
        {footerText ? (
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500">{footerText}</span>
        ) : null}
      </footer>
    </div>
  );
}
