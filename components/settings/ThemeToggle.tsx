'use client';

import { Moon, Sun } from 'lucide-react';
import { Theme } from '@/lib/types';

interface ThemeToggleProps {
  theme: Theme;
  toggleTheme: () => void;
}

export function ThemeToggle({ theme, toggleTheme }: ThemeToggleProps) {
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
