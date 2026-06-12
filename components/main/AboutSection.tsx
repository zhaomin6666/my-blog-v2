'use client';

import Link from 'next/link';
import { ArrowUpRight, BriefcaseBusiness, CheckCircle2, Compass, FileText, FolderGit2, LockKeyhole, Sparkles, Target } from 'lucide-react';
import type { ProfileContent } from '@/lib/profile';
import { useSettings } from '@/lib/settings-context';
import { getStyleTokens } from '@/lib/stylePresets';
import { t } from '@/lib/translations';
import type { Lang, LocalizedText } from '@/lib/types';

function text(value: LocalizedText, lang: Lang) {
  return value[lang];
}

interface AboutSectionProps {
  profile: ProfileContent;
}

export function AboutSection({ profile }: AboutSectionProps) {
  const { lang, stylePreset } = useSettings();
  const tokens = getStyleTokens(stylePreset);
  const isMacos = stylePreset === 'macos';

  const profileIcons = [BriefcaseBusiness, Compass, Target];

  return (
    <div className={`p-6 ${tokens.cardBg} ${tokens.cardBorder} ${tokens.cardBorderRadius} ${tokens.cardShadow}`}>
      <div className="flex items-center gap-2 mb-5">
        <div className={`w-1 h-5 rounded-full ${isMacos ? 'bg-blue-500' : 'bg-zinc-900 dark:bg-zinc-100'}`} />
        <h2 className={`${isMacos ? 'text-lg font-semibold' : 'text-xs font-mono font-bold uppercase tracking-wider'} ${tokens.textPrimary}`}>
          {t('nav.profile', lang)}
        </h2>
        <span className={`ml-auto text-[10px] px-2 py-0.5 ${tokens.tagBg} ${tokens.tagText} ${tokens.tagBorder} ${tokens.tagBorderRadius}`}>
          profile/career
        </span>
      </div>

      <p className={`mb-5 ${isMacos ? 'text-sm leading-relaxed' : 'text-xs font-mono leading-relaxed'} ${tokens.textSecondary}`}>
        {text(profile.intro, lang)}
      </p>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {profile.fields.map((field, index) => {
          const Icon = profileIcons[index] ?? Target;

          return (
            <div
              key={field.labelKey}
              className={`flex min-w-0 items-start gap-3 p-3 ${tokens.nestedCardBg} ${tokens.nestedCardBorder} ${tokens.nestedCardBorderRadius} transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm`}
            >
              <Icon size={isMacos ? 16 : 14} className={`mt-0.5 shrink-0 ${tokens.textMuted}`} />
              <div className="flex-1 min-w-0">
                <div className={`text-[10px] ${tokens.textMuted} ${isMacos ? 'uppercase tracking-wider' : 'font-mono uppercase'}`}>
                  {t(field.labelKey, lang)}
                </div>
                <div className={`${isMacos ? 'text-sm font-medium leading-snug' : 'text-xs font-mono leading-snug'} ${tokens.textPrimary}`}>
                  {text(field.value, lang)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <div className={`mb-2 flex items-center gap-1.5 text-[10px] ${tokens.textMuted} ${isMacos ? 'uppercase tracking-wider' : 'font-mono uppercase'}`}>
            <Sparkles size={12} />
            {t('about.currentFocus', lang)}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {profile.focus.map((item) => (
              <span
                key={text(item, lang)}
                className={`px-2 py-1 text-[10px] ${tokens.projectTagBg} ${tokens.projectTagText} ${tokens.tagBorderRadius} ${isMacos ? '' : 'font-mono'}`}
              >
                {text(item, lang)}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className={`mb-2 flex items-center gap-1.5 text-[10px] ${tokens.textMuted} ${isMacos ? 'uppercase tracking-wider' : 'font-mono uppercase'}`}>
            <BriefcaseBusiness size={12} />
            {t('about.background', lang)}
          </div>
          <div className="space-y-2">
            {profile.background.map((item) => (
              <p key={text(item, lang)} className={`flex gap-2 ${isMacos ? 'text-xs leading-relaxed' : 'text-[11px] font-mono leading-relaxed'} ${tokens.textSecondary}`}>
                <CheckCircle2 size={13} className={`mt-0.5 shrink-0 ${isMacos ? 'text-blue-500 dark:text-blue-300' : tokens.textMuted}`} />
                <span>{text(item, lang)}</span>
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5">
        <div className={`mb-2 flex items-center gap-1.5 text-[10px] ${tokens.textMuted} ${isMacos ? 'uppercase tracking-wider' : 'font-mono uppercase'}`}>
          <FolderGit2 size={12} />
          {t('about.building', lang)}
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {profile.building.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`group flex min-w-0 items-start gap-3 p-3 ${tokens.nestedCardBg} ${tokens.nestedCardBorder} ${tokens.nestedCardBorderRadius} transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm`}
            >
              <ArrowUpRight size={14} className={`mt-0.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${tokens.textMuted}`} />
              <span className="min-w-0">
                <span className={`block ${isMacos ? 'text-sm font-medium' : 'text-xs font-mono font-bold'} ${tokens.textPrimary}`}>
                  {text(link.label, lang)}
                </span>
                <span className={`mt-1 block ${isMacos ? 'text-xs leading-relaxed' : 'text-[11px] font-mono leading-relaxed'} ${tokens.textSecondary}`}>
                  {text(link.description, lang)}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <div className={`mb-2 text-[10px] ${tokens.textMuted} ${isMacos ? 'uppercase tracking-wider' : 'font-mono uppercase'}`}>
            {t('about.workStyle', lang)}
          </div>
          <div className="space-y-1.5">
            {profile.workStyle.map((item) => (
              <p key={text(item, lang)} className={`${isMacos ? 'text-xs leading-relaxed' : 'text-[11px] font-mono leading-relaxed'} ${tokens.textSecondary}`}>
                {text(item, lang)}
              </p>
            ))}
          </div>
        </div>

        <div>
          <div className={`mb-2 text-[10px] ${tokens.textMuted} ${isMacos ? 'uppercase tracking-wider' : 'font-mono uppercase'}`}>
            {t('about.careerDirection', lang)}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {profile.careerDirection.map((item) => (
              <span
                key={text(item, lang)}
                className={`px-2 py-1 text-[10px] ${tokens.tagBg} ${tokens.tagText} ${tokens.tagBorder} ${tokens.tagBorderRadius} ${isMacos ? '' : 'font-mono'}`}
              >
                {text(item, lang)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className={`mt-5 grid grid-cols-1 gap-3 sm:grid-cols-[0.8fr_1.2fr]`}>
        <div className={`flex items-center gap-2 px-3 py-2 ${tokens.nestedCardBg} ${tokens.nestedCardBorder} ${tokens.nestedCardBorderRadius}`}>
          <FileText size={14} className={tokens.textMuted} />
          <span className={`${isMacos ? 'text-xs leading-relaxed' : 'text-[11px] font-mono leading-relaxed'} ${tokens.textSecondary}`}>
            {text(profile.status, lang)}
          </span>
        </div>
        <div className={`flex items-start gap-2 px-3 py-2 ${tokens.nestedCardBg} ${tokens.nestedCardBorder} ${tokens.nestedCardBorderRadius}`}>
          <LockKeyhole size={14} className={`mt-0.5 shrink-0 ${tokens.textMuted}`} />
          <span className={`${isMacos ? 'text-xs leading-relaxed' : 'text-[11px] font-mono leading-relaxed'} ${tokens.textSecondary}`}>
            {text(profile.privacyNote, lang)}
          </span>
        </div>
      </div>
    </div>
  );
}
