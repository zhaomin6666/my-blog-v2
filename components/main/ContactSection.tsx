'use client';

import { Mail, Github, Linkedin, FileDown } from 'lucide-react';
import { useSettings } from '@/lib/settings-context';
import { getStyleTokens } from '@/lib/stylePresets';
import { t } from '@/lib/translations';

export function ContactSection() {
  const { lang, stylePreset } = useSettings();
  const tokens = getStyleTokens(stylePreset);
  const isMacos = stylePreset === 'macos';

  const contacts = [
    { icon: Mail, label: 'Email', value: 'your@email.com', href: 'mailto:your@email.com' },
    { icon: Github, label: 'GitHub', value: 'github.com/yourname', href: 'https://github.com/yourname' },
    { icon: Linkedin, label: 'LinkedIn', value: 'linkedin.com/in/yourname', href: 'https://linkedin.com/in/yourname' },
    { icon: FileDown, label: t('contact.resumeLabel', lang), value: t('contact.downloadPdf', lang), href: '#' },
  ];

  return (
    <div className={`p-6 ${tokens.cardBg} ${tokens.cardBorder} ${tokens.cardBorderRadius} ${tokens.cardShadow}`}>
      <h2 className={`mb-4 ${isMacos ? 'text-xl font-semibold' : 'text-sm font-mono font-bold uppercase tracking-wider'} ${tokens.textPrimary}`}>
        {t('section.contact', lang)}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {contacts.map((contact) => (
          <a
            key={contact.label}
            href={contact.href}
            target={contact.href.startsWith('http') ? '_blank' : undefined}
            rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className={`flex items-center gap-3 p-3 ${isMacos ? `${tokens.nestedCardBg} ${tokens.nestedCardBorder} ${tokens.nestedCardBorderRadius} hover:bg-white/60 dark:hover:bg-black/30 transition-colors` : `${tokens.nestedCardBg} ${tokens.nestedCardBorder} ${tokens.nestedCardBorderRadius} hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors`}`}
          >
            <contact.icon size={isMacos ? 20 : 16} className={tokens.textSecondary} />
            <div>
              <div className={`${isMacos ? 'text-sm font-medium' : 'text-xs font-mono font-bold'} ${tokens.textPrimary}`}>{contact.label}</div>
              <div className={`${isMacos ? 'text-xs' : 'text-xs font-mono'} ${tokens.textMuted}`}>{contact.value}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
