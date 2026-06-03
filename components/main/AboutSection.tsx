'use client';

import { User, MapPin, Target } from 'lucide-react';
import { useSettings } from '@/lib/settings-context';
import { getStyleTokens } from '@/lib/stylePresets';
import { t } from '@/lib/translations';

export function AboutSection() {
  const { lang, stylePreset } = useSettings();
  const tokens = getStyleTokens(stylePreset);
  const isMacos = stylePreset === 'macos';

  const profileFields = [
    {
      icon: User,
      label: t('about.role', lang),
      value: lang === 'zh' ? '后端开发者 / AI 应用探索者' : 'Backend Developer / AI Explorer',
    },
    {
      icon: MapPin,
      label: t('about.location', lang),
      value: lang === 'zh' ? '远程 / 全球' : 'Remote / Global',
    },
    {
      icon: Target,
      label: t('about.focus', lang),
      value: lang === 'zh' ? '可靠系统 · AI 原生应用 · 独立产品' : 'Reliable Systems · AI-Native Apps · Indie Products',
    },
  ];

  return (
    <div className={`p-6 ${tokens.cardBg} ${tokens.cardBorder} ${tokens.cardBorderRadius} ${tokens.cardShadow}`}>
      {/* Section header like a system panel header */}
      <div className="flex items-center gap-2 mb-5">
        <div className={`w-1 h-5 rounded-full ${isMacos ? 'bg-blue-500' : 'bg-zinc-900 dark:bg-zinc-100'}`} />
        <h2 className={`${isMacos ? 'text-lg font-semibold' : 'text-xs font-mono font-bold uppercase tracking-wider'} ${tokens.textPrimary}`}>
          {t('nav.profile', lang)}
        </h2>
        <span className={`ml-auto text-[10px] px-2 py-0.5 ${tokens.tagBg} ${tokens.tagText} ${tokens.tagBorder} ${tokens.tagBorderRadius}`}>
          profile.json
        </span>
      </div>

      {/* Profile description */}
      <p className={`mb-5 ${isMacos ? 'text-sm leading-relaxed' : 'text-xs font-mono leading-relaxed'} ${tokens.textSecondary}`}>
        {t('about.description', lang)}
      </p>

      {/* Profile fields like system info entries */}
      <div className="space-y-2">
        {profileFields.map((field) => (
          <div
            key={field.label}
            className={`flex items-center gap-3 p-3 ${tokens.nestedCardBg} ${tokens.nestedCardBorder} ${tokens.nestedCardBorderRadius} transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm`}
          >
            <field.icon size={isMacos ? 16 : 14} className={tokens.textMuted} />
            <div className="flex-1 min-w-0">
              <div className={`text-[10px] ${tokens.textMuted} ${isMacos ? 'uppercase tracking-wider' : 'font-mono uppercase'}`}>
                {field.label}
              </div>
              <div className={`truncate ${isMacos ? 'text-sm font-medium' : 'text-xs font-mono'} ${tokens.textPrimary}`}>
                {field.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
