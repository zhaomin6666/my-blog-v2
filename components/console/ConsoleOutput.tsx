'use client';

import { useRef, useEffect } from 'react';
import { useSettings } from '@/lib/settings-context';
import { ConsoleOutputLine } from '@/lib/types';
import { getStyleTokens } from '@/lib/stylePresets';

interface ConsoleOutputProps {
  lines: ConsoleOutputLine[];
}

export function ConsoleOutput({ lines }: ConsoleOutputProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { stylePreset } = useSettings();
  const tokens = getStyleTokens(stylePreset);
  const isMacos = stylePreset === 'macos';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div
      ref={scrollRef}
      className={`min-h-0 flex-1 overflow-y-auto os-scrollbar p-4 ${tokens.consoleFont}`}
    >
      <div className="max-w-4xl mx-auto space-y-1 pb-4">
        {lines.map((line) => (
          <div
            key={line.id}
            className={`whitespace-pre-wrap break-words ${
              line.type === 'input'
                ? isMacos
                  ? 'text-green-400'
                  : 'text-zinc-700 dark:text-zinc-300'
                : line.type === 'error'
                ? 'text-red-400'
                : line.type === 'system'
                ? isMacos
                  ? 'text-zinc-400'
                  : 'text-zinc-500 dark:text-zinc-400'
                : isMacos
                ? 'text-zinc-100'
                : 'text-zinc-900 dark:text-zinc-100'
            }`}
          >
            {line.type === 'input' && (
              <span>{tokens.consolePrompt} </span>
            )}
            {line.content}
          </div>
        ))}
      </div>
    </div>
  );
}
