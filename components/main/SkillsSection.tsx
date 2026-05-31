'use client';

import { useSettings } from '@/lib/settings-context';
import { getStyleTokens } from '@/lib/stylePresets';
import { t } from '@/lib/translations';
import { skills } from '@/data/skills';

export function SkillsSection() {
  const { lang, stylePreset } = useSettings();
  const tokens = getStyleTokens(stylePreset);
  const isMacos = stylePreset === 'macos';

  return (
    <div className={`p-6 ${tokens.cardBg} ${tokens.cardBorder} ${tokens.cardBorderRadius} ${tokens.cardShadow}`}>
      <h2 className={`mb-4 ${isMacos ? 'text-xl font-semibold' : 'text-sm font-mono font-bold uppercase tracking-wider'} ${tokens.textPrimary}`}>
        {t('section.skills', lang)}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <div key={skill.category} className="space-y-2">
            <h3 className={`${isMacos ? 'text-sm font-medium' : 'text-xs font-mono font-bold uppercase'} ${tokens.textPrimary}`}>
              {lang === 'zh' ? skill.categoryZh || skill.category : skill.category}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {skill.items.map((item) => (
                <span
                  key={item}
                  className={`px-2 py-0.5 text-xs ${tokens.tagBg} ${tokens.tagText} ${tokens.tagBorder} ${tokens.tagBorderRadius}`}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
