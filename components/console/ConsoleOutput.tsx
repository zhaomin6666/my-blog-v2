'use client';

import { useRef, useEffect } from 'react';
import { StylePreset } from '@/lib/types';
import { ConsoleOutputLine } from '@/lib/types';
import { getStyleTokens } from '@/lib/stylePresets';

interface ConsoleOutputProps {
  lines: ConsoleOutputLine[];
  stylePreset: StylePreset;
}

export function ConsoleOutput({ lines, stylePreset }: ConsoleOutputProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
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
      className={`flex-1 overflow-y-auto os-scrollbar p-4 ${tokens.consoleFont}`}
    >
      <div className="max-w-4xl mx-auto space-y-1 pb-4">
        {lines.map((line) => (
          <div
            key={line.id}
            className={`whitespace-pre-wrap break-words ${
              line.type === 'input'
                ? `${tokens.consolePrompt}`
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
