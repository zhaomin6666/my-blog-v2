'use client';

import { useState, useCallback, useRef } from 'react';
import type { BlogPostMeta } from '@/lib/blog/blog-types';
import type { ProjectMeta } from '@/lib/projects';
import { useSettings } from '@/lib/settings-context';
import { ConsoleOutputLine } from '@/lib/types';
import { generateId } from '@/lib/utils';
import { t } from '@/lib/translations';
import { CommandResult, executeCommand } from '@/lib/commands';
import { getStyleTokens } from '@/lib/stylePresets';
import { ConsoleOutput } from './ConsoleOutput';
import { ConsoleInput } from './ConsoleInput';

interface ConsoleAppProps {
  blogPosts: BlogPostMeta[];
  projects: ProjectMeta[];
  onCommandResult?: (result: CommandResult) => void;
}

export function ConsoleApp({ blogPosts, projects, onCommandResult }: ConsoleAppProps) {
  const { lang, stylePreset } = useSettings();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const draftInputRef = useRef('');
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

    setHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(null);
    draftInputRef.current = '';

    const nextLines: ConsoleOutputLine[] = [
      { id: generateId(), type: 'input', content: trimmed },
    ];

    const result = executeCommand(trimmed, { lang, blogPosts, projects });

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
  }, [blogPosts, input, lang, onCommandResult, projects]);

  const handleHistoryPrevious = useCallback(() => {
    if (history.length === 0) return;

    setHistoryIndex((currentIndex) => {
      if (currentIndex === null) {
        draftInputRef.current = input;
        const nextIndex = history.length - 1;
        setInput(history[nextIndex]);
        return nextIndex;
      }

      const nextIndex = Math.max(0, currentIndex - 1);
      setInput(history[nextIndex]);
      return nextIndex;
    });
  }, [history, input]);

  const handleHistoryNext = useCallback(() => {
    if (history.length === 0 || historyIndex === null) return;

    const nextIndex = historyIndex + 1;

    if (nextIndex >= history.length) {
      setHistoryIndex(null);
      setInput(draftInputRef.current);
      return;
    }

    setHistoryIndex(nextIndex);
    setInput(history[nextIndex]);
  }, [history, historyIndex]);

  return (
    <div className={`h-full w-full min-h-0 overflow-hidden flex flex-col ${tokens.consoleFont} ${
      stylePreset === 'macos' ? 'text-zinc-100' : 'bg-white dark:bg-black text-zinc-900 dark:text-zinc-100'
    }`}>
      <ConsoleOutput lines={lines} />
      <ConsoleInput
        input={input}
        setInput={setInput}
        onSubmit={handleSubmit}
        onHistoryPrevious={handleHistoryPrevious}
        onHistoryNext={handleHistoryNext}
      />
    </div>
  );
}
