'use client';

import { useState } from 'react';
import type { AdminHomepageSection } from '@/lib/admin';
import { HeroSectionForm } from './HeroSectionForm';

interface HeroAdminPanelProps {
  zhSection: AdminHomepageSection;
  enSection: AdminHomepageSection;
}

type HeroLanguage = 'zh' | 'en';

const languageOptions: Array<{ value: HeroLanguage; label: string }> = [
  { value: 'zh', label: 'zh' },
  { value: 'en', label: 'en' },
];

export function HeroAdminPanel({ zhSection, enSection }: HeroAdminPanelProps) {
  const [activeLanguage, setActiveLanguage] = useState<HeroLanguage>('zh');
  const activeSection = activeLanguage === 'zh' ? zhSection : enSection;

  return (
    <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="space-y-2">
          {languageOptions.map((option) => {
            const isActive = option.value === activeLanguage;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setActiveLanguage(option.value)}
                className={`flex w-full items-center justify-between rounded-md px-3 py-3 text-left text-sm font-medium transition ${
                  isActive
                    ? 'bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950'
                    : 'bg-transparent text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50'
                }`}
              >
                <span>{option.label}</span>
                <span className={`text-xs ${isActive ? 'text-inherit' : 'text-zinc-400 dark:text-zinc-500'}`}>
                  Language
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      <div className="min-w-0">
        <HeroSectionForm key={activeSection.lang} section={activeSection} />
      </div>
    </div>
  );
}
