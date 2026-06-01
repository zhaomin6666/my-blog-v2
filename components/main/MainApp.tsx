'use client';

import { useRef, useCallback } from 'react';
import { useSettings } from '@/lib/settings-context';
import { getStyleTokens } from '@/lib/stylePresets';
import { MainAppNav } from './MainAppNav';
import { HeroOverview } from './HeroOverview';
import { AboutSection } from './AboutSection';
import { SkillsSection } from './SkillsSection';
import { ProjectsSection } from './ProjectsSection';
import { BlogSection } from './BlogSection';
import { ContactSection } from './ContactSection';

interface MainAppProps {
  onOpenTerminal?: () => void;
}

export function MainApp({ onOpenTerminal }: MainAppProps) {
  const { stylePreset } = useSettings();
  const tokens = getStyleTokens(stylePreset);

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    const container = scrollContainerRef.current;
    if (element && container) {
      const containerTop = container.scrollTop;
      const elementTop = element.offsetTop;
      container.scrollTo({
        top: elementTop - containerTop + container.scrollTop - 16,
        behavior: 'smooth',
      });
    }
  }, []);

  const setSectionRef = useCallback((id: string) => (el: HTMLDivElement | null) => {
    sectionRefs.current[id] = el;
  }, []);

  return (
    <div ref={scrollContainerRef} className={`h-full overflow-y-auto os-scrollbar`}>
      <MainAppNav onNavigate={scrollToSection} />

      <div className={`${tokens.contentPadding} pt-0`}>
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Overview */}
          <div ref={setSectionRef('overview')}>
            <HeroOverview
              onOpenTerminal={onOpenTerminal}
              onNavigate={scrollToSection}
            />
          </div>

          {/* About + Skills */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div ref={setSectionRef('about')} className="md:col-span-2">
              <AboutSection />
            </div>
            <div ref={setSectionRef('skills')}>
              <SkillsSection />
            </div>
          </div>

          {/* Projects */}
          <div ref={setSectionRef('projects')}>
            <ProjectsSection />
          </div>

          {/* Blog */}
          <div ref={setSectionRef('blog')}>
            <BlogSection />
          </div>

          {/* Contact */}
          <div ref={setSectionRef('contact')}>
            <ContactSection />
          </div>
        </div>
      </div>
    </div>
  );
}
