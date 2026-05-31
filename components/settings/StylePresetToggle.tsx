'use client';

import { Monitor, Terminal } from 'lucide-react';
import { StylePreset } from '@/lib/types';

interface StylePresetToggleProps {
  stylePreset: StylePreset;
  toggleStylePreset: () => void;
}

export function StylePresetToggle({ stylePreset, toggleStylePreset }: StylePresetToggleProps) {
  const isMacos = stylePreset === 'macos';

  return (
    <button
      onClick={toggleStylePreset}
      className="flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-sm"
      aria-label="Toggle style preset"
    >
      {isMacos ? (
        <>
          <Monitor size={14} />
          <span className="text-xs font-medium">macOS</span>
        </>
      ) : (
        <>
          <Terminal size={14} />
          <span className="text-xs font-medium">Vercel</span>
        </>
      )}
    </button>
  );
}
