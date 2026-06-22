'use client';

import { BookOpen, BriefcaseBusiness, FileText, Github, Linkedin, Mail } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ContactChannelData, ContactChannels, ContactChannelType } from '@/lib/profile';
import { useSettings } from '@/lib/settings-context';
import { getStyleTokens } from '@/lib/stylePresets';
import { t } from '@/lib/translations';
import { EmptySectionCard } from './EmptySectionCard';

interface ContactSectionProps {
  contactChannels: ContactChannels;
}

function getContactIcon(type: ContactChannelType): LucideIcon {
  switch (type) {
    case 'github':
      return Github;
    case 'linkedin':
      return Linkedin;
    case 'blog':
      return BookOpen;
    case 'projects':
      return BriefcaseBusiness;
    case 'resume':
      return FileText;
    case 'email':
    default:
      return Mail;
  }
}

function isExternalLink(href: string) {
  return href.startsWith('http://') || href.startsWith('https://');
}

export function ContactSection({ contactChannels }: ContactSectionProps) {
  const { lang, stylePreset } = useSettings();
  const tokens = getStyleTokens(stylePreset);
  const isMacos = stylePreset === 'macos';

  const channels = contactChannels.channels.filter((channel) => channel.visible);

  if (channels.length === 0) {
    return (
      <EmptySectionCard
        titleKey="contact.title"
        emptyKey="contact.empty"
        tag="endpoints/"
        macosAccent="bg-teal-500"
      />
    );
  }

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
        {channels.map((channel: ContactChannelData) => {
          const Icon = getContactIcon(channel.type);
          const href = channel.disabled || !channel.href ? undefined : channel.href;

          return (
          <a
            key={`${channel.type}-${channel.endpoint}`}
            href={href}
            target={href && isExternalLink(href) ? '_blank' : undefined}
            rel={href && isExternalLink(href) ? 'noopener noreferrer' : undefined}
            className={`group flex items-center gap-3 p-4 ${tokens.nestedCardBg} ${tokens.nestedCardBorder} ${tokens.nestedCardBorderRadius} transition-all duration-200 hover:-translate-y-0.5 ${
              channel.disabled
                ? 'opacity-60 cursor-not-allowed'
                : isMacos
                  ? 'hover:bg-white/60 dark:hover:bg-black/30'
                  : 'hover:border-zinc-400 dark:hover:border-zinc-600'
            }`}
          >
            <Icon size={isMacos ? 18 : 16} className={tokens.textSecondary} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`${isMacos ? 'text-sm font-medium' : 'text-xs font-mono font-bold'} ${tokens.textPrimary}`}>
                  {channel.label[lang]}
                </span>
                {channel.disabled && (
                  <span className={`text-[9px] px-1.5 py-0.5 ${tokens.tagBg} ${tokens.tagText} ${tokens.tagBorder} ${tokens.tagBorderRadius}`}>
                    {t('contact.comingSoon', lang)}
                  </span>
                )}
              </div>
              <div className={`truncate ${isMacos ? 'text-xs' : 'text-[11px] font-mono'} ${tokens.textMuted}`}>
                {channel.value[lang]}
              </div>
            </div>
            {/* Endpoint label */}
            <span className={`hidden sm:block text-[10px] ${tokens.textMuted} ${isMacos ? '' : 'font-mono'}`}>
              {channel.endpoint}
            </span>
          </a>
          );
        })}
      </div>

      <p className={`mt-4 ${isMacos ? 'text-xs leading-relaxed' : 'text-[11px] font-mono leading-relaxed'} ${tokens.textMuted}`}>
        {contactChannels.privacyNote[lang]} {contactChannels.resumeNote[lang]}
      </p>
    </div>
  );
}
