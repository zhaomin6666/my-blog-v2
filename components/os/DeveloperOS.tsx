'use client';

import { Layout, Terminal } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';
import { useStylePreset } from '@/hooks/useStylePreset';
import { useWindowManager } from '@/hooks/useWindowManager';
import { t } from '@/lib/translations';
import { SystemStatusBar } from './SystemStatusBar';
import { Desktop } from './Desktop';
import { AppWindow } from './AppWindow';
import { MainApp } from '@/components/main/MainApp';
import { ConsoleApp } from '@/components/console/ConsoleApp';

export function DeveloperOS() {
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang } = useLanguage();
  const { stylePreset, toggleStylePreset } = useStylePreset();
  const {
    main,
    console: consoleState,
    active,
    setMainState,
    setConsoleState,
    focusWindow,
  } = useWindowManager();

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col transition-colors duration-200 bg-white dark:bg-black text-black dark:text-white">
      <SystemStatusBar
        theme={theme}
        setTheme={(t) => t !== theme && toggleTheme()}
        lang={lang}
        setLang={(l) => l !== lang && toggleLang()}
        stylePreset={stylePreset}
        setStylePreset={(s) => s !== stylePreset && toggleStylePreset()}
        setMainState={setMainState}
        setConsoleState={setConsoleState}
        focusWindow={focusWindow}
      />
      <div className="flex-1 relative overflow-hidden">
        <Desktop
          stylePreset={stylePreset}
          lang={lang}
          setMainState={setMainState}
          setConsoleState={setConsoleState}
          focusWindow={focusWindow}
        />

        {consoleState !== 'maximized' && (
          <AppWindow
            title={t('window.main.title', lang)}
            icon={<Layout size={12} />}
            state={main}
            setState={setMainState}
            isActive={active === 'main'}
            onFocus={() => focusWindow('main')}
            stylePreset={stylePreset}
            defaultClasses={
              stylePreset === 'macos'
                ? 'top-4 left-4 right-4 bottom-[280px] md:left-[10%] md:right-[10%] md:top-[5%] md:bottom-[360px]'
                : 'top-4 left-4 right-4 bottom-[280px] md:left-8 md:right-8 md:top-6 md:bottom-[340px]'
            }
            maxClasses="inset-0"
          >
            <MainApp lang={lang} stylePreset={stylePreset} />
          </AppWindow>
        )}

        <AppWindow
          title={
            stylePreset === 'macos'
              ? t('window.console.title.macos', lang)
              : t('window.console.title.vercel', lang)
          }
          icon={<Terminal size={12} />}
          state={consoleState}
          setState={setConsoleState}
          isActive={active === 'console'}
          onFocus={() => focusWindow('console')}
          stylePreset={stylePreset}
          defaultClasses={
            stylePreset === 'macos'
              ? 'bottom-4 left-4 right-4 h-[240px] md:bottom-8 md:left-[15%] md:right-[15%] md:h-[300px]'
              : 'bottom-0 left-0 right-0 h-[240px] border-b-0 rounded-b-none md:bottom-4 md:left-8 md:right-8 md:h-[300px] md:rounded-b-md md:border-b'
          }
          maxClasses="inset-0"
          isDarkContent={stylePreset === 'macos'}
        >
          <ConsoleApp stylePreset={stylePreset} lang={lang} />
        </AppWindow>
      </div>
    </div>
  );
}
