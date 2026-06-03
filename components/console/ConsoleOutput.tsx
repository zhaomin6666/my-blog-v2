'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '@/lib/settings-context';
import { ConsoleOutputLine } from '@/lib/types';
import { getStyleTokens } from '@/lib/stylePresets';

interface ConsoleOutputProps {
  lines: ConsoleOutputLine[];
}

function TerminalPrompt({ isMacos }: { isMacos: boolean }) {
  const accentClass = isMacos
    ? '!text-emerald-500 dark:!text-emerald-400'
    : '!text-emerald-600 dark:!text-emerald-400';

  return (
    <span className="select-none">
      <span className={accentClass}>
        <span className="hidden sm:inline">visitor</span>
        <span className="sm:hidden">dev-os</span>
      </span>
      <span className="hidden sm:inline !text-zinc-500 dark:!text-zinc-400">@dev-os</span>
      <span className="!text-zinc-400 dark:!text-zinc-500">:~</span>
      <span className={accentClass}>{' $'}</span>
      <span>{' '}</span>
    </span>
  );
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
          <motion.div
            key={line.id}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
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
            {line.type === 'input' && <TerminalPrompt isMacos={isMacos} />}
            {line.content}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
