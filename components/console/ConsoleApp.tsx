'use client';

import { useState, useCallback } from 'react';
import { StylePreset, Lang, ConsoleOutputLine } from '@/lib/types';
import { generateId } from '@/lib/utils';
import { t } from '@/lib/translations';
import { executeCommand } from '@/lib/commands';
import { getStyleTokens } from '@/lib/stylePresets';
import { ConsoleOutput } from './ConsoleOutput';
import { ConsoleInput } from './ConsoleInput';

interface ConsoleAppProps {
  stylePreset: StylePreset;
  lang: Lang;
  onNavigate?: (target: string) => void;
}

export function ConsoleApp({ stylePreset, lang, onNavigate }: ConsoleAppProps) {
  const [input, setInput] = useState('');
  const [lines, setLines] = useState<ConsoleOutputLine[]>(() => {
    const isMacos = stylePreset === 'macos';
    const welcomeLines: ConsoleOutputLine[] = [
      {
        id: generateId(),
        type: 'system',
        content: isMacos
          ? `Last login: ${new Date().toLocaleString()} on ttys001\nDevOS:~ visitor$ welcome`
          : t('console.welcome', lang),
      },
      {
        id: generateId(),
        type: 'system',
        content: t('console.help', lang),
      },
    ];
    return welcomeLines;
  });

  const tokens = getStyleTokens(stylePreset);

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const newLines: ConsoleOutputLine[] = [
      { id: generateId(), type: 'input', content: trimmed },
    ];

    const result = executeCommand(trimmed, lang);

    if (result.action === 'clear') {
      setLines([]);
      setInput('');
      return;
    }

    if (result.output) {
      newLines.push({
        id: generateId(),
        type: result.action === 'none' && trimmed.toLowerCase() === 'help' ? 'system' : 'output',
        content: result.output,
      });
    }

    if (result.action === 'scroll' && result.target && onNavigate) {
      onNavigate(result.target);
    }

    setLines((prev) => [...prev, ...newLines]);
    setInput('');
  }, [input, lang, onNavigate]);

  return (
    <div className={`h-full w-full flex flex-col ${tokens.consoleFont} ${
      stylePreset === 'macos' ? 'text-zinc-100' : 'bg-white dark:bg-black text-zinc-900 dark:text-zinc-100'
    }`}>
      <ConsoleOutput lines={lines} stylePreset={stylePreset} />
      <ConsoleInput
        input={input}
        setInput={setInput}
        onSubmit={handleSubmit}
        stylePreset={stylePreset}
      />
    </div>
  );
}
