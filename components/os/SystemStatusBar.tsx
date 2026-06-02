'use client';

import { useState, useEffect } from 'react';
import { Wifi, Battery, Search, Hash } from 'lucide-react';
import { WindowState } from '@/lib/types';
import { useSettings } from '@/lib/settings-context';
import { getStyleTokens } from '@/lib/stylePresets';
import { formatTime } from '@/lib/utils';
import { t } from '@/lib/translations';

interface SystemStatusBarProps {
  setMainState: (s: WindowState) => void;
  openConsole: () => void;
  focusWindow: (win: 'main' | 'console') => void;
}

export function SystemStatusBar({
  setMainState,
  openConsole,
  focusWindow,
}: SystemStatusBarProps) {
  const [time, setTime] = useState<Date | null>(null);
  const { theme, toggleTheme, lang, toggleLang, stylePreset, toggleStylePreset } = useSettings();
  const tokens = getStyleTokens(stylePreset);
  const isMacos = stylePreset === 'macos';

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOpenMain = () => {
    setMainState('open');
    focusWindow('main');
  };

  const handleOpenConsole = () => {
    openConsole();
  };

  return (
    <div
      className={`${tokens.statusBarHeight} flex-none px-4 flex items-center justify-between z-50 select-none ${tokens.statusBarClass} ${tokens.statusBarFont}`}
    >
      {/* Left */}
      <div className="flex items-center gap-5">
        <div className="font-bold flex items-center gap-2 cursor-default">
          {isMacos ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
              <path d="M10 2c1 .5 2 2 2 5h-2c0-3-1-4-2-5Z" />
            </svg>
          ) : (
            <Hash size={12} />
          )}
          <span className="hidden sm:inline">DevOS</span>
        </div>
        <div className="hidden md:flex gap-4">
          <button
            className={`hover:text-black dark:hover:text-white transition-colors ${isMacos ? 'font-semibold' : ''}`}
            onClick={handleOpenMain}
          >
            {isMacos ? t('status.portfolio', lang) : `[${t('status.portfolio', lang)}]`}
          </button>
          <button
            className="hover:text-black dark:hover:text-white transition-colors"
            onClick={handleOpenConsole}
          >
            {isMacos ? t('status.terminal', lang) : `[${t('status.terminal', lang)}]`}
          </button>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={toggleStylePreset}
          className={`hidden sm:inline transition-colors ${isMacos ? 'text-blue-600 dark:text-blue-400' : 'text-emerald-600 dark:text-emerald-400'}`}
        >
          {isMacos ? t('status.switchToMinimal', lang) : `[${t('status.switchToMacos', lang)}]`}
        </button>
        <button
          onClick={toggleStylePreset}
          className={`sm:hidden transition-colors ${isMacos ? 'text-blue-600 dark:text-blue-400' : 'text-emerald-600 dark:text-emerald-400'}`}
          title={isMacos ? t('status.switchToMinimal', lang) : t('status.switchToMacos', lang)}
        >
          {isMacos ? t('status.stylePresetAbbrevVercel', lang) : t('status.stylePresetAbbrevMacos', lang)}
        </button>
        <button
          onClick={toggleTheme}
          className="hover:text-black dark:hover:text-white transition-colors"
        >
          {isMacos
            ? (theme === 'dark' ? t('theme.light', lang) : t('theme.dark', lang))
            : (theme === 'dark' ? t('theme.lightAbbrev', lang) : t('theme.darkAbbrev', lang))}
        </button>
        <button
          onClick={toggleLang}
          className="hover:text-black dark:hover:text-white transition-colors"
        >
          {t(lang === 'zh' ? 'lang.en' : 'lang.zh', lang)}
        </button>
        {isMacos && (
          <div className="hidden sm:flex items-center gap-3 ml-2">
            <Wifi size={14} />
            <Search size={14} />
            <Battery size={14} />
          </div>
        )}
        <div className={`text-right ml-1 sm:ml-2 ${isMacos ? 'w-14 sm:w-24 drop-shadow-sm' : 'w-12 text-zinc-500'}`}>
          {time ? formatTime(time) : '--:--'}
        </div>
      </div>
    </div>
  );
}
