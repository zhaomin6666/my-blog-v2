'use client';

import { Mail, Github, Linkedin, FileDown } from 'lucide-react';
import { Lang, StylePreset } from '@/lib/types';
import { t } from '@/lib/translations';

interface ContactSectionProps {
  lang: Lang;
  stylePreset: StylePreset;
}

export function ContactSection({ lang, stylePreset }: ContactSectionProps) {
  const isMacos = stylePreset === 'macos';

  const contacts = [
    { icon: Mail, label: 'Email', value: 'your@email.com', href: 'mailto:your@email.com' },
    { icon: Github, label: 'GitHub', value: 'github.com/yourname', href: 'https://github.com/yourname' },
    { icon: Linkedin, label: 'LinkedIn', value: 'linkedin.com/in/yourname', href: 'https://linkedin.com/in/yourname' },
    { icon: FileDown, label: lang === 'zh' ? '简历' : 'Resume', value: lang === 'zh' ? '下载 PDF' : 'Download PDF', href: '#' },
  ];

  return (
    <div className={`p-6 ${isMacos ? 'bg-white/50 dark:bg-black/30 border border-white/40 dark:border-white/5 rounded-2xl shadow-sm' : 'border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black rounded-md'}`}>
      <h2 className={`mb-4 ${isMacos ? 'text-xl font-semibold' : 'text-sm font-mono font-bold uppercase tracking-wider'}`}>
        {t('section.contact', lang)}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {contacts.map((contact) => (
          <a
            key={contact.label}
            href={contact.href}
            target={contact.href.startsWith('http') ? '_blank' : undefined}
            rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className={`flex items-center gap-3 p-3 ${isMacos ? 'bg-white/30 dark:bg-black/20 border border-white/30 dark:border-white/5 rounded-xl hover:bg-white/50 dark:hover:bg-black/30 transition-colors' : 'border border-zinc-200 dark:border-zinc-800 rounded hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors'}`}
          >
            <contact.icon size={isMacos ? 20 : 16} className={isMacos ? 'text-zinc-600 dark:text-zinc-400' : 'text-zinc-500 dark:text-zinc-400'} />
            <div>
              <div className={`${isMacos ? 'text-sm font-medium' : 'text-xs font-mono font-bold'}`}>{contact.label}</div>
              <div className={`${isMacos ? 'text-xs text-zinc-500 dark:text-zinc-500' : 'text-xs font-mono text-zinc-500'}`}>{contact.value}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
