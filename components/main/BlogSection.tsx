'use client';

import { useSettings } from '@/lib/settings-context';
import { getStyleTokens } from '@/lib/stylePresets';
import { t } from '@/lib/translations';
import { blogs } from '@/data/blogs';

export function BlogSection() {
  const { lang, stylePreset } = useSettings();
  const tokens = getStyleTokens(stylePreset);
  const isMacos = stylePreset === 'macos';

  return (
    <div className={`p-6 ${tokens.cardBg} ${tokens.cardBorder} ${tokens.cardBorderRadius} ${tokens.cardShadow}`}>
      {/* Section header like a log viewer */}
      <div className="flex items-center gap-2 mb-5">
        <div className={`w-1 h-5 rounded-full ${isMacos ? 'bg-orange-500' : 'bg-zinc-900 dark:bg-zinc-100'}`} />
        <h2 className={`${isMacos ? 'text-lg font-semibold' : 'text-xs font-mono font-bold uppercase tracking-wider'} ${tokens.textPrimary}`}>
          {t('blog.title', lang)}
        </h2>
        <span className={`ml-auto text-[10px] px-2 py-0.5 ${tokens.tagBg} ${tokens.tagText} ${tokens.tagBorder} ${tokens.tagBorderRadius}`}>
          logs/
        </span>
      </div>

      {/* Log entries */}
      <div className="space-y-2">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className={`${tokens.nestedCardBg} ${tokens.nestedCardBorder} ${tokens.nestedCardBorderRadius} p-4 transition-all hover:opacity-90`}
          >
            {/* Log header: timestamp + level */}
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] ${tokens.textMuted} ${isMacos ? '' : 'font-mono'}`}>
                [{blog.date}]
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${isMacos ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 font-mono'}`}>
                {t('blog.logLevel', lang)}
              </span>
            </div>

            {/* Log title */}
            <h3 className={`mb-1.5 ${isMacos ? 'text-sm font-medium' : 'text-xs font-mono font-bold'} ${tokens.textPrimary}`}>
              {blog.title[lang]}
            </h3>

            {/* Log summary */}
            <p className={`mb-2.5 ${isMacos ? 'text-xs leading-relaxed' : 'text-[11px] font-mono leading-relaxed'} ${tokens.textSecondary}`}>
              {blog.summary[lang]}
            </p>

            {/* Log tags */}
            <div className="flex flex-wrap gap-1">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className={`text-[10px] px-1.5 py-0.5 ${tokens.tagBg} ${tokens.tagText} ${tokens.tagBorder} ${tokens.tagBorderRadius} ${isMacos ? '' : 'font-mono'}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
