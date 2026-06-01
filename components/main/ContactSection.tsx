'use client';

import { Mail, Github, Linkedin, FileDown } from 'lucide-react';
import { useSettings } from '@/lib/settings-context';
import { getStyleTokens } from '@/lib/stylePresets';
import { t } from '@/lib/translations';

export function ContactSection() {
  const { lang, stylePreset } = useSettings();
  const tokens = getStyleTokens(stylePreset);
  const isMacos = stylePreset === 'macos';

  const channels = [
    {
      icon: Mail,
      key: 'contact.email' as const,
      value: 'placeholder@example.com',
      href: 'mailto:placeholder@example.com',
      endpoint: 'GET /email',
    },
    {
      icon: Github,
      key: 'contact.github' as const,
      value: 'github.com/',
      href: 'https://github.com/',
      endpoint: 'GET /github',
    },
    {
      icon: Linkedin,
      key: 'contact.linkedin' as const,
      value: 'linkedin.com/',
      href: 'https://linkedin.com/',
      endpoint: 'GET /linkedin',
    },
    {
      icon: FileDown,
      key: 'contact.resume' as const,
      value: t('contact.comingSoon', lang),
      href: '#',
      endpoint: 'GET /resume',
      disabled: true,
    },
  ];

  return (
    <div className={`p-6 ${tokens.cardBg} ${tokens.cardBorder} ${tokens.cardBorderRadius} ${tokens.cardShadow}`}>
      {/* Section header like an API endpoint panel */}
      <div className="flex items-center gap-2 mb-5">
        <div className={`w-1 h-5 rounded-full ${isMacos ? 'bg-teal-500' : 'bg-zinc-900 dark:bg-zinc-100'}`} />
        <h2 className={`${isMacos ? 'text-lg font-semibold' : 'text-xs font-mono font-bold uppercase tracking-wider'} ${tokens.textPrimary}`}>
          {t('contact.title', lang)}
        </h2>
        <span className={`ml-auto text-[10px] px-2 py-0.5 ${tokens.tagBg} ${tokens.tagText} ${tokens.tagBorder} ${tokens.tagBorderRadius}`}>
          endpoints/
        </span>
      </div>

      {/* Contact channels like API endpoints */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {channels.map((channel) => (
          <a
            key={channel.key}
            href={channel.disabled ? undefined : channel.href}
            target={channel.href.startsWith('http') ? '_blank' : undefined}
            rel={channel.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className={`group flex items-center gap-3 p-4 ${tokens.nestedCardBg} ${tokens.nestedCardBorder} ${tokens.nestedCardBorderRadius} transition-all ${
              channel.disabled
                ? 'opacity-60 cursor-not-allowed'
                : isMacos
                  ? 'hover:bg-white/60 dark:hover:bg-black/30'
                  : 'hover:border-zinc-400 dark:hover:border-zinc-600'
            }`}
          >
            <channel.icon size={isMacos ? 18 : 16} className={tokens.textSecondary} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`${isMacos ? 'text-sm font-medium' : 'text-xs font-mono font-bold'} ${tokens.textPrimary}`}>
                  {t(channel.key, lang)}
                </span>
                {channel.disabled && (
                  <span className={`text-[9px] px-1.5 py-0.5 ${tokens.tagBg} ${tokens.tagText} ${tokens.tagBorder} ${tokens.tagBorderRadius}`}>
                    {t('contact.comingSoon', lang)}
                  </span>
                )}
              </div>
              <div className={`truncate ${isMacos ? 'text-xs' : 'text-[11px] font-mono'} ${tokens.textMuted}`}>
                {channel.value}
              </div>
            </div>
            {/* Endpoint label */}
            <span className={`hidden sm:block text-[10px] ${tokens.textMuted} ${isMacos ? '' : 'font-mono'}`}>
              {channel.endpoint}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
