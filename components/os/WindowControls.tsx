'use client';

import { X, Minimize2, Maximize2 } from 'lucide-react';
import { StylePreset } from '@/lib/types';
import { getStyleTokens } from '@/lib/stylePresets';

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

  if (isMacos) {
    return (
      <div className="flex gap-2 w-20 group/controls">
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className={`${tokens.controlSize} rounded-full ${tokens.controlClose} flex items-center justify-center transition-opacity`}
          aria-label="Close"
        >
          <span className="opacity-0 group-hover/controls:opacity-100 text-[#990000] text-[8px] font-bold leading-none">✕</span>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onMinimize(); }}
          className={`${tokens.controlSize} rounded-full ${tokens.controlMinimize} flex items-center justify-center transition-opacity`}
          aria-label="Minimize"
        >
          <span className="opacity-0 group-hover/controls:opacity-100 text-[#995500] text-[8px] font-bold leading-none">−</span>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onMaximize(); }}
          className={`${tokens.controlSize} rounded-full ${tokens.controlMaximize} flex items-center justify-center transition-opacity`}
          aria-label="Maximize"
        >
          <span className="opacity-0 group-hover/controls:opacity-100 text-[#006500] text-[8px] font-bold leading-none">＋</span>
        </button>
      </div>
    );
  }

  // Vercel style
  return (
    <div className="flex gap-2 w-20">
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className={`${tokens.controlSize} rounded-full ${tokens.controlClose} flex items-center justify-center group`}
        aria-label="Close"
      >
        <X size={8} className="opacity-0 group-hover:opacity-100" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onMinimize(); }}
        className={`${tokens.controlSize} rounded-full ${tokens.controlMinimize} flex items-center justify-center group`}
        aria-label="Minimize"
      >
        <Minimize2 size={8} className="opacity-0 group-hover:opacity-100" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onMaximize(); }}
        className={`${tokens.controlSize} rounded-full ${tokens.controlMaximize} flex items-center justify-center group`}
        aria-label="Maximize"
      >
        {isMaximized ? (
          <Minimize2 size={8} className="opacity-0 group-hover:opacity-100" />
        ) : (
          <Maximize2 size={8} className="opacity-0 group-hover:opacity-100" />
        )}
      </button>
    </div>
  );
}
