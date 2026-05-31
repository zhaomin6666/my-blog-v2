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
      <h2 className={`mb-4 ${isMacos ? 'text-xl font-semibold' : 'text-sm font-mono font-bold uppercase tracking-wider'} ${tokens.textPrimary}`}>
        {t('section.blog', lang)}
      </h2>
      <div className="space-y-3">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className={`p-4 ${tokens.nestedCardBg} ${tokens.nestedCardBorder} ${tokens.nestedCardBorderRadius}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className={`mb-1 ${isMacos ? 'font-medium' : 'font-mono font-bold text-sm'} ${tokens.textPrimary}`}>
                  {lang === 'zh' ? blog.title : blog.titleEn || blog.title}
                </h3>
                <p className={`${isMacos ? 'text-sm' : 'text-xs font-mono'} ${tokens.textSecondary}`}>
                  {lang === 'zh' ? blog.excerpt : blog.excerptEn || blog.excerpt}
                </p>
              </div>
              <span className={`shrink-0 ${isMacos ? 'text-xs' : 'text-xs font-mono'} ${tokens.textMuted}`}>
                {blog.date}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
