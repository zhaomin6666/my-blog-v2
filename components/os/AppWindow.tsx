'use client';

import React from 'react';
import { StylePreset, WindowState } from '@/lib/types';
import { getStyleTokens } from '@/lib/stylePresets';
import { WindowControls } from './WindowControls';

interface AppWindowProps {
  title: string;
  icon: React.ReactNode;
  state: WindowState;
  setState: (s: WindowState) => void;
  isActive: boolean;
  onFocus: () => void;
  stylePreset: StylePreset;
  defaultClasses: string;
  maxClasses: string;
  children: React.ReactNode;
  isDarkContent?: boolean;
}

export function AppWindow({
  title,
  icon,
  state,
  setState,
  isActive,
  onFocus,
  stylePreset,
  defaultClasses,
  maxClasses,
  children,
  isDarkContent,
}: AppWindowProps) {
  const tokens = getStyleTokens(stylePreset);

  if (state === 'closed' || state === 'minimized') return null;

  const isMax = state === 'maximized';
  const posClasses = isMax ? maxClasses : defaultClasses;
  const zIndex = isActive ? 'z-40' : 'z-30';

  return (
    <div
      onMouseDown={onFocus}
      className={`absolute flex flex-col overflow-hidden os-window-enter transition-[opacity,transform,box-shadow,border-radius] duration-300 ease-out ${tokens.windowBg} ${tokens.windowBackdrop} ${tokens.windowBorder} ${tokens.windowShadow} ${posClasses} ${zIndex} ${isMax ? 'rounded-none' : tokens.windowBorderRadius} ${isActive ? 'opacity-100' : 'opacity-90'}`}
    >
      {/* Title Bar */}
      <div
        className={`${tokens.titleBarHeight} flex-none flex items-center justify-between px-4 select-none transition-[opacity,filter] duration-300 ease-out ${tokens.titleBarClass} ${isActive ? 'opacity-100' : stylePreset === 'macos' ? 'opacity-60' : 'opacity-50 grayscale'}`}
      >
        <WindowControls
          stylePreset={stylePreset}
          onClose={() => setState('closed')}
          onMinimize={() => setState('minimized')}
          onMaximize={() => setState(isMax ? 'open' : 'maximized')}
          isMaximized={isMax}
        />
        <div className={`flex-1 text-center flex items-center justify-center gap-2 min-w-0 ${tokens.titleBarFont} text-zinc-700 dark:text-zinc-300`}>
          <span className="opacity-60 shrink-0">{icon}</span>
          <span className="truncate">{title}</span>
        </div>
        <div className="w-20" />
      </div>

      {/* Content */}
      <div className={`flex-1 overflow-hidden relative ${isDarkContent ? (stylePreset === 'macos' ? 'bg-slate-950/90' : 'bg-black dark:bg-black') : 'bg-transparent'}`}>
        {children}
      </div>
    </div>
  );
}
