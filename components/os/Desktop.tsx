'use client';

import { Layout, Terminal } from 'lucide-react';
import { WindowState } from '@/lib/types';
import { useSettings } from '@/lib/settings-context';
import { getStyleTokens } from '@/lib/stylePresets';
import { t } from '@/lib/translations';

interface DesktopProps {
  setMainState: (s: WindowState) => void;
  setConsoleState: (s: WindowState) => void;
  focusWindow: (win: 'main' | 'console') => void;
}

export function Desktop({
  setMainState,
  setConsoleState,
  focusWindow,
}: DesktopProps) {
  const { lang, stylePreset } = useSettings();
  const tokens = getStyleTokens(stylePreset);
  const isMacos = stylePreset === 'macos';

  const handleOpenMain = () => {
    setMainState('open');
    focusWindow('main');
  };

  const handleOpenConsole = () => {
    setConsoleState('open');
    focusWindow('console');
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Background */}
      {isMacos ? (
        <div className={`absolute inset-0 ${tokens.desktopBg}`}>
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-blue-400/30 dark:bg-indigo-600/30 blur-[120px] mix-blend-multiply dark:mix-blend-screen pointer-events-none" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[80%] rounded-full bg-purple-400/30 dark:bg-fuchsia-600/30 blur-[120px] mix-blend-multiply dark:mix-blend-screen pointer-events-none" />
        </div>
      ) : (
        <div className={`absolute inset-0 ${tokens.desktopBg}`}>
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-50" />
        </div>
      )}

      {/* Desktop Icons */}
      <div className={`absolute top-8 ${tokens.desktopIconPosition === 'top-right' ? 'left-8 sm:left-auto sm:right-8' : 'left-8'} flex flex-col gap-6 z-10`}>
        <button
          onDoubleClick={handleOpenMain}
          className="flex flex-col items-center gap-1.5 w-24 group outline-none"
        >
          <div className={`${tokens.desktopIconSize} ${isMacos ? 'bg-white/20 dark:bg-black/20 border border-white/40 dark:border-white/10 backdrop-blur-md shadow-lg' : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm'} flex items-center justify-center group-hover:scale-105 transition-all`}>
            <Layout size={isMacos ? 32 : 20} className={`${isMacos ? 'text-zinc-800 dark:text-zinc-200 drop-shadow-md' : 'text-zinc-600 dark:text-zinc-400'}`} />
          </div>
          <span className={`${tokens.desktopIconLabel} ${isMacos ? 'text-zinc-900 dark:text-zinc-100 drop-shadow-md' : 'text-zinc-600 dark:text-zinc-400'}`}>
            {t('desktop.openMain', lang)}
          </span>
        </button>
        <button
          onDoubleClick={handleOpenConsole}
          className="flex flex-col items-center gap-1.5 w-24 group outline-none"
        >
          <div className={`${tokens.desktopIconSize} ${isMacos ? 'bg-white/20 dark:bg-black/20 border border-white/40 dark:border-white/10 backdrop-blur-md shadow-lg' : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm'} flex items-center justify-center group-hover:scale-105 transition-all`}>
            <Terminal size={isMacos ? 32 : 20} className={`${isMacos ? 'text-zinc-800 dark:text-zinc-200 drop-shadow-md' : 'text-zinc-600 dark:text-zinc-400'}`} />
          </div>
          <span className={`${tokens.desktopIconLabel} ${isMacos ? 'text-zinc-900 dark:text-zinc-100 drop-shadow-md' : 'text-zinc-600 dark:text-zinc-400'}`}>
            {t('desktop.openConsole', lang)}
          </span>
        </button>
      </div>
    </div>
  );
}
