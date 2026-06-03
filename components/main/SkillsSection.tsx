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
      {/* Section header like a system config panel */}
      <div className="flex items-center gap-2 mb-5">
        <div className={`w-1 h-5 rounded-full ${isMacos ? 'bg-purple-500' : 'bg-zinc-900 dark:bg-zinc-100'}`} />
        <h2 className={`${isMacos ? 'text-lg font-semibold' : 'text-xs font-mono font-bold uppercase tracking-wider'} ${tokens.textPrimary}`}>
          {t('skills.title', lang)}
        </h2>
        <span className={`ml-auto text-[10px] px-2 py-0.5 ${tokens.tagBg} ${tokens.tagText} ${tokens.tagBorder} ${tokens.tagBorderRadius}`}>
          stack.config
        </span>
      </div>

      {/* Skill modules like config sections */}
      <div className="space-y-3">
        {skills.map((skill) => (
          <div
            key={skill.category.en}
            className={`${tokens.nestedCardBg} ${tokens.nestedCardBorder} ${tokens.nestedCardBorderRadius} overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm`}
          >
            {/* Module header */}
            <div className={`flex items-center gap-2 px-3 py-2 ${isMacos ? 'bg-white/30 dark:bg-white/5' : 'bg-zinc-100/50 dark:bg-zinc-900/30'}`}>
              <span className={`text-[10px] ${tokens.textMuted} ${isMacos ? 'uppercase tracking-wider font-medium' : 'font-mono uppercase'}`}>
                {t('skills.module', lang)}
              </span>
              <span className={`text-xs ${isMacos ? 'font-semibold' : 'font-mono font-bold'} ${tokens.textPrimary}`}>
                {skill.category[lang]}
              </span>
            </div>
            {/* Config entries */}
            <div className="px-3 py-2">
              <div className="flex flex-wrap gap-1.5">
                {skill.items.map((item) => (
                  <span
                    key={item}
                    className={`px-2 py-0.5 text-[11px] ${tokens.tagBg} ${tokens.tagText} ${tokens.tagBorder} ${tokens.tagBorderRadius} ${isMacos ? '' : 'font-mono'}`}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
