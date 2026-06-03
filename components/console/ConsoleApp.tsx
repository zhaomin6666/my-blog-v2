'use client';

import { useState, useCallback } from 'react';
import { useSettings } from '@/lib/settings-context';
import { ConsoleOutputLine } from '@/lib/types';
import { generateId } from '@/lib/utils';
import { t } from '@/lib/translations';
import { CommandResult, executeCommand } from '@/lib/commands';
import { getStyleTokens } from '@/lib/stylePresets';
import { ConsoleOutput } from './ConsoleOutput';
import { ConsoleInput } from './ConsoleInput';

interface ConsoleAppProps {
  onCommandResult?: (result: CommandResult) => void;
}

export function ConsoleApp({ onCommandResult }: ConsoleAppProps) {
  const { lang, stylePreset } = useSettings();
  const [input, setInput] = useState('');
  const [lines, setLines] = useState<ConsoleOutputLine[]>(() => {
    const isMacos = stylePreset === 'macos';
    const welcomeLines: ConsoleOutputLine[] = [
      {
        id: generateId(),
        type: 'system',
        content: isMacos
          ? t('console.macosWelcome', lang, new Date().toLocaleString())
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

    const nextLines: ConsoleOutputLine[] = [
      { id: generateId(), type: 'input', content: trimmed },
    ];

    const result = executeCommand(trimmed, lang);

    if (result.action === 'clear') {
      setLines([]);
      setInput('');
      return;
    }

    if (result.output) {
      nextLines.push({
        id: generateId(),
        type: result.isError ? 'error' : 'output',
        content: result.output,
      });
    }

    setLines((prev) => [...prev, ...nextLines]);
    onCommandResult?.(result);
    setInput('');
  }, [input, lang, onCommandResult]);

  return (
    <div className={`h-full w-full min-h-0 overflow-hidden flex flex-col ${tokens.consoleFont} ${
      stylePreset === 'macos' ? 'text-zinc-100' : 'bg-white dark:bg-black text-zinc-900 dark:text-zinc-100'
    }`}>
      <ConsoleOutput lines={lines} />
      <ConsoleInput
        input={input}
        setInput={setInput}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
