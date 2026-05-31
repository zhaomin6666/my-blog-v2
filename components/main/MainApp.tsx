'use client';

import { Lang, StylePreset } from '@/lib/types';
import { HeroOverview } from './HeroOverview';
import { AboutSection } from './AboutSection';
import { SkillsSection } from './SkillsSection';
import { ProjectsSection } from './ProjectsSection';
import { BlogSection } from './BlogSection';
import { ContactSection } from './ContactSection';

interface MainAppProps {
  lang: Lang;
  stylePreset: StylePreset;
}

export function MainApp({ lang, stylePreset }: MainAppProps) {
  const isMacos = stylePreset === 'macos';

  return (
    <div className={`h-full overflow-y-auto os-scrollbar ${isMacos ? 'p-4 md:p-8' : 'p-4 md:p-6'}`}>
      <div className="max-w-5xl mx-auto space-y-6">
        <HeroOverview lang={lang} stylePreset={stylePreset} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <AboutSection lang={lang} stylePreset={stylePreset} />
          </div>
          <div>
            <SkillsSection lang={lang} stylePreset={stylePreset} />
          </div>
        </div>
        <ProjectsSection lang={lang} stylePreset={stylePreset} />
        <BlogSection lang={lang} stylePreset={stylePreset} />
        <ContactSection lang={lang} stylePreset={stylePreset} />
      </div>
    </div>
  );
}
