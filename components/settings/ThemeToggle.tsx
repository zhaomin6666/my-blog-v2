'use client';

import { Moon, Sun } from 'lucide-react';
import { useSettings } from '@/lib/settings-context';

export function ThemeToggle() {
  const { theme, toggleTheme } = useSettings();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun size={16} className="text-zinc-100" />
      ) : (
        <Moon size={16} className="text-zinc-900" />
      )}
    </button>
  );
}
