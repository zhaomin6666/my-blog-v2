'use client';

import { useRef, useEffect } from 'react';
import { useSettings } from '@/lib/settings-context';
import { getStyleTokens } from '@/lib/stylePresets';

interface ConsoleInputProps {
  input: string;
  setInput: (s: string) => void;
  onSubmit: () => void;
  onHistoryPrevious: () => void;
  onHistoryNext: () => void;
}

export function ConsoleInput({
  input,
  setInput,
  onSubmit,
  onHistoryPrevious,
  onHistoryNext,
}: ConsoleInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { stylePreset } = useSettings();
  const tokens = getStyleTokens(stylePreset);
  const isMacos = stylePreset === 'macos';

  useEffect(() => {
    const focusInput = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

    return () => window.clearTimeout(focusInput);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSubmit();
      window.setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      onHistoryPrevious();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      onHistoryNext();
    }
  };

  const accentClass = isMacos
    ? 'text-emerald-500 dark:text-emerald-400'
    : 'text-emerald-600 dark:text-emerald-400';

  return (
    <div className={`flex-none px-4 py-3 border-t ${isMacos ? 'border-zinc-800/50' : 'border-zinc-200 dark:border-zinc-800'} ${tokens.consoleFont}`}>
      <div className="max-w-4xl mx-auto flex items-center gap-2">
        <span className="shrink-0 select-none">
          <span className={accentClass}>visitor</span>
          <span className="text-zinc-500 dark:text-zinc-400">@dev-os</span>
          <span className="text-zinc-400 dark:text-zinc-500">:~</span>
          <span className={accentClass}>{' $'}</span>
        </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`flex-1 min-h-5 leading-5 bg-transparent border-0 outline-none shadow-none focus:ring-0 p-0 m-0 caret-emerald-500 dark:caret-emerald-300 ${
            isMacos ? 'text-zinc-100' : 'text-zinc-900 dark:text-zinc-100'
          }`}
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
        />
      </div>
    </div>
  );
}
