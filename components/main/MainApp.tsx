'use client';

import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { useSettings } from '@/lib/settings-context';
import { getStyleTokens } from '@/lib/stylePresets';
import { MainSectionId } from '@/lib/types';
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

export interface MainAppHandle {
  scrollToSection: (sectionId: MainSectionId) => void;
}

export const MainApp = forwardRef<MainAppHandle, MainAppProps>(function MainApp(
  { onOpenTerminal },
  ref
) {
  const { stylePreset } = useSettings();
  const tokens = getStyleTokens(stylePreset);
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sectionRefs = useRef<Record<MainSectionId, HTMLDivElement | null>>({
    overview: null,
    about: null,
    skills: null,
    projects: null,
    blog: null,
    contact: null,
  });
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [highlightedSection, setHighlightedSection] = useState<MainSectionId | null>(null);

  const scrollToSection = useCallback((sectionId: MainSectionId) => {
    const element = sectionRefs.current[sectionId];
    const container = scrollContainerRef.current;
    if (element && container) {
      const containerTop = container.scrollTop;
      const elementTop = element.offsetTop;
      container.scrollTo({
        top: elementTop - containerTop + container.scrollTop - 16,
        behavior: 'smooth',
      });
      setHighlightedSection(sectionId);
      if (highlightTimerRef.current) {
        clearTimeout(highlightTimerRef.current);
      }
      highlightTimerRef.current = setTimeout(() => {
        setHighlightedSection(null);
      }, 1500);
    }
  }, []);

  useImperativeHandle(ref, () => ({
    scrollToSection,
  }), [scrollToSection]);

  const setSectionRef = useCallback((id: MainSectionId) => (el: HTMLDivElement | null) => {
    sectionRefs.current[id] = el;
  }, []);

  const sectionClassName = useCallback((id: MainSectionId, className = '') => {
    const isHighlighted = highlightedSection === id;
    const highlightClass = stylePreset === 'macos'
      ? 'ring-2 ring-sky-400/60 dark:ring-sky-300/50 bg-sky-50/35 dark:bg-sky-400/10'
      : 'ring-2 ring-zinc-900/25 dark:ring-zinc-100/35 bg-zinc-900/[0.03] dark:bg-zinc-100/[0.04]';

    return [
      'rounded-xl transition-[background-color,box-shadow] duration-300',
      isHighlighted ? highlightClass : 'ring-0 bg-transparent',
      className,
    ].filter(Boolean).join(' ');
  }, [highlightedSection, stylePreset]);

  return (
    <div
      ref={scrollContainerRef}
      className={`h-full overflow-y-auto os-scrollbar relative ${tokens.contentBg}`}
    >
      <MainAppNav onNavigate={scrollToSection} />

      <div className={`${tokens.contentPadding} pt-0`}>
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Overview */}
          <div ref={setSectionRef('overview')} className={sectionClassName('overview')}>
            <HeroOverview
              onOpenTerminal={onOpenTerminal}
              onNavigate={scrollToSection}
            />
          </div>

          {/* About + Skills */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div ref={setSectionRef('about')} className={sectionClassName('about', 'md:col-span-2')}>
              <AboutSection />
            </div>
            <div ref={setSectionRef('skills')} className={sectionClassName('skills')}>
              <SkillsSection />
            </div>
          </div>

          {/* Projects */}
          <div ref={setSectionRef('projects')} className={sectionClassName('projects')}>
            <ProjectsSection />
          </div>

          {/* Blog */}
          <div ref={setSectionRef('blog')} className={sectionClassName('blog')}>
            <BlogSection />
          </div>

          {/* Contact */}
          <div ref={setSectionRef('contact')} className={sectionClassName('contact')}>
            <ContactSection />
          </div>
        </div>
      </div>
    </div>
  );
});
