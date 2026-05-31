'use client';

import { useSettings } from '@/lib/settings-context';
import { getStyleTokens } from '@/lib/stylePresets';
import { HeroOverview } from './HeroOverview';
import { AboutSection } from './AboutSection';
import { SkillsSection } from './SkillsSection';
import { ProjectsSection } from './ProjectsSection';
import { BlogSection } from './BlogSection';
import { ContactSection } from './ContactSection';

export function MainApp() {
  const { stylePreset } = useSettings();
  const tokens = getStyleTokens(stylePreset);

  return (
    <div className={`h-full overflow-y-auto os-scrollbar ${tokens.contentPadding}`}>
      <div className="max-w-5xl mx-auto space-y-6">
        <HeroOverview />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <AboutSection />
          </div>
          <div>
            <SkillsSection />
          </div>
        </div>
        <ProjectsSection />
        <BlogSection />
        <ContactSection />
      </div>
    </div>
  );
}
