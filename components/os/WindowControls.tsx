'use client';

import { X, Minimize2, Maximize2 } from 'lucide-react';
import { StylePreset } from '@/lib/types';
import { getStyleTokens } from '@/lib/stylePresets';
import { useSettings } from '@/lib/settings-context';
import { t } from '@/lib/translations';

interface WindowControlsProps {
  stylePreset: StylePreset;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  isMaximized: boolean;
}

export function WindowControls({
  stylePreset,
  onClose,
  onMinimize,
  onMaximize,
  isMaximized,
}: WindowControlsProps) {
  const tokens = getStyleTokens(stylePreset);
  const isMacos = stylePreset === 'macos';
  const { lang } = useSettings();

  if (isMacos) {
    return (
      <div className="flex gap-2 w-20">
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className={`${tokens.controlSize} rounded-full ${tokens.controlClose} flex items-center justify-center transition-all duration-150 hover:scale-110 active:scale-95`}
          aria-label={t('window.aria.close', lang)}
        >
          <span className="opacity-70 hover:opacity-100 text-[#990000] text-[8px] font-bold leading-none">✕</span>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onMinimize(); }}
          className={`${tokens.controlSize} rounded-full ${tokens.controlMinimize} flex items-center justify-center transition-all duration-150 hover:scale-110 active:scale-95`}
          aria-label={t('window.aria.minimize', lang)}
        >
          <span className="opacity-70 hover:opacity-100 text-[#995500] text-[8px] font-bold leading-none">−</span>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onMaximize(); }}
          className={`${tokens.controlSize} rounded-full ${tokens.controlMaximize} flex items-center justify-center transition-all duration-150 hover:scale-110 active:scale-95`}
          aria-label={t('window.aria.maximize', lang)}
        >
          <span className="opacity-70 hover:opacity-100 text-[#006500] text-[8px] font-bold leading-none">＋</span>
        </button>
      </div>
    );
  }

  // Vercel style
  return (
    <div className="flex gap-2 w-20">
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className={`${tokens.controlSize} rounded-full ${tokens.controlClose} flex items-center justify-center transition-all duration-150 hover:scale-110 active:scale-95`}
        aria-label={t('window.aria.close', lang)}
      >
        <X size={8} className="opacity-60 hover:opacity-100" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onMinimize(); }}
        className={`${tokens.controlSize} rounded-full ${tokens.controlMinimize} flex items-center justify-center transition-all duration-150 hover:scale-110 active:scale-95`}
        aria-label={t('window.aria.minimize', lang)}
      >
        <Minimize2 size={8} className="opacity-60 hover:opacity-100" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onMaximize(); }}
        className={`${tokens.controlSize} rounded-full ${tokens.controlMaximize} flex items-center justify-center transition-all duration-150 hover:scale-110 active:scale-95`}
        aria-label={t('window.aria.maximize', lang)}
      >
        {isMaximized ? (
          <Minimize2 size={8} className="opacity-60 hover:opacity-100" />
        ) : (
          <Maximize2 size={8} className="opacity-60 hover:opacity-100" />
        )}
      </button>
    </div>
  );
}
