'use client';

import { useRef, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { useSettings } from '@/lib/settings-context';
import { getStyleTokens } from '@/lib/stylePresets';

interface ConsoleInputProps {
  input: string;
  setInput: (s: string) => void;
  onSubmit: () => void;
}

export function ConsoleInput({ input, setInput, onSubmit }: ConsoleInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { stylePreset } = useSettings();
  const tokens = getStyleTokens(stylePreset);
  const isMacos = stylePreset === 'macos';

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <div className={`flex-none px-4 py-3 border-t ${isMacos ? 'border-zinc-800/50' : 'border-zinc-200 dark:border-zinc-800'} ${tokens.consoleFont}`}>
      <div className="max-w-4xl mx-auto flex items-center gap-2">
        {isMacos ? (
          <span className="text-green-500 dark:text-green-400 shrink-0">{tokens.consolePrompt}</span>
        ) : (
          <ChevronRight size={14} className="text-zinc-400 shrink-0" />
        )}
        <div className="relative flex-1 flex min-h-5 items-center leading-5">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`w-full bg-transparent outline-none absolute inset-0 h-full leading-5 ${
              isMacos ? 'text-zinc-100' : 'text-zinc-900 dark:text-zinc-100'
            }`}
            autoFocus
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
          />
          <div className="pointer-events-none flex whitespace-pre items-center h-full">
            <span>{input}</span>
            <span
              className={`inline-block animate-pulse ml-[1px] ${tokens.consoleCursor}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
