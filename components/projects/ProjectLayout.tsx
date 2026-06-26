'use client';

import Link from 'next/link';
import { ArrowLeft, Layout, Monitor, Moon, Sun } from 'lucide-react';
import { useSettings } from '@/lib/settings-context';
import { getStyleTokens } from '@/lib/stylePresets';
import { t } from '@/lib/translations';

interface ProjectLayoutProps {
  children: React.ReactNode;
  backHref?: string;
  backLabel?: string;
  footerText?: string;
}

export function ProjectLayout({
  children,
  backHref = '/',
  backLabel,
  footerText,
}: ProjectLayoutProps) {
  const { theme, lang, stylePreset, toggleTheme, toggleLang, toggleStylePreset, mounted } = useSettings();

  if (!mounted) {
    return <div className="min-h-screen bg-white dark:bg-black" />;
  }

  const tokens = getStyleTokens(stylePreset);
  const backText = backLabel || t('projects.backHome', lang);

  return (
    <div className={`h-screen overflow-y-auto overscroll-contain transition-colors duration-200 ${tokens.desktopBg} ${tokens.bodyFont}`}>
      <header className={`sticky top-0 z-50 ${tokens.statusBarHeight} ${tokens.statusBarClass} ${tokens.statusBarFont} flex items-center justify-between px-3 md:px-5`}>
        <div className="flex min-w-0 items-center gap-2 md:gap-3">
          <Link
            href={backHref}
            aria-label={backText}
            className="flex shrink-0 items-center gap-1.5 text-zinc-700 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
          >
            <ArrowLeft size={14} />
            <span className="hidden text-xs sm:inline">{backText}</span>
          </Link>
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          <Link
            href="/"
            className="flex min-w-0 items-center gap-1.5 text-zinc-700 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
          >
            <Layout size={12} className="shrink-0" />
            <span className="truncate text-xs font-medium">{t('desktop.welcome', lang)}</span>
          </Link>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <button
            onClick={toggleTheme}
            className="rounded-md p-1.5 transition-colors hover:bg-zinc-100/70 active:scale-95 dark:hover:bg-zinc-800/70"
            aria-label={theme === 'dark' ? t('blog.ariaToggleThemeToLight', lang) : t('blog.ariaToggleThemeToDark', lang)}
          >
            {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
          </button>

          <button
            onClick={toggleLang}
            className="rounded-md p-1.5 text-[11px] font-medium transition-colors hover:bg-zinc-100/70 active:scale-95 dark:hover:bg-zinc-800/70"
            aria-label={t('blog.ariaToggleLanguage', lang)}
          >
            {t(`lang.${lang}`, lang)}
          </button>

          <button
            onClick={toggleStylePreset}
            className="rounded-md p-1.5 transition-colors hover:bg-zinc-100/70 active:scale-95 dark:hover:bg-zinc-800/70"
            aria-label={t('blog.ariaToggleStyle', lang)}
          >
            <Monitor size={13} />
          </button>
        </div>
      </header>

      <main className="px-4 py-6 md:px-8 md:py-10">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>

      <footer className={`${tokens.statusBarHeight} ${tokens.statusBarClass} ${tokens.statusBarFont} flex items-center justify-center px-4`}>
        {footerText ? (
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500">{footerText}</span>
        ) : null}
      </footer>
    </div>
  );
}
