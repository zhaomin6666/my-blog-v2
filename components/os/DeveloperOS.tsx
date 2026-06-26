'use client';

import { useCallback, useRef } from 'react';
import { Layout, Terminal } from 'lucide-react';
import type { BlogPostMeta } from '@/lib/blog/blog-types';
import type { HomepageSection } from '@/lib/homepage/homepage-types';
import type { ProjectMeta } from '@/lib/projects';
import type { PublicProfile } from '@/lib/profile';
import { useSettings } from '@/lib/settings-context';
import { useWindowManager } from '@/hooks/useWindowManager';
import { t } from '@/lib/translations';
import { CommandResult } from '@/lib/commands';
import { SystemStatusBar } from './SystemStatusBar';
import { Desktop } from './Desktop';
import { AppWindow } from './AppWindow';
import { MainApp, MainAppHandle } from '@/components/main/MainApp';
import { ConsoleApp } from '@/components/console/ConsoleApp';

interface DeveloperOSProps {
  blogPosts: BlogPostMeta[];
  homepageSections: HomepageSection[];
  projects: ProjectMeta[];
  profile: PublicProfile;
}

export function DeveloperOS({ blogPosts, homepageSections, projects, profile }: DeveloperOSProps) {
  const { lang, stylePreset, mounted } = useSettings();
  const {
    main,
    console: consoleState,
    active,
    setMainState,
    setConsoleState,
    openMain,
    openConsole,
    openConsoleFromMain,
    focusWindow,
    activateMain,
  } = useWindowManager();
  const mainAppRef = useRef<MainAppHandle>(null);

  const canLinkConsoleCommand = main !== 'closed' && main !== 'minimized' && consoleState !== 'maximized';

  const handleConsoleCommandResult = useCallback((result: CommandResult) => {
    if (!result.navigationTarget || !canLinkConsoleCommand) {
      return;
    }

    mainAppRef.current?.scrollToSection(result.navigationTarget);

    if (result.activateMain) {
      activateMain();
    }
  }, [activateMain, canLinkConsoleCommand]);

  // Prevent hydration mismatch: don't render dynamic content until mounted
  if (!mounted) {
    return (
      <div className="h-screen w-screen overflow-hidden flex flex-col bg-white dark:bg-black" />
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col transition-colors duration-200 bg-white dark:bg-black text-black dark:text-white">
      <SystemStatusBar
        openMain={openMain}
        openConsole={openConsole}
      />
      <div className="flex-1 relative overflow-hidden">
        <Desktop
          openMain={openMain}
          openConsole={openConsole}
        />

        {consoleState !== 'maximized' && (
          <AppWindow
            title={t('window.main.title', lang)}
            icon={<Layout size={12} />}
            state={main}
            setState={setMainState}
            isActive={active === 'main'}
            onFocus={() => focusWindow('main')}
            stylePreset={stylePreset}
            defaultClasses={
              stylePreset === 'macos'
                ? 'top-4 left-4 right-4 bottom-[280px] md:left-[10%] md:right-[10%] md:top-[5%] md:bottom-[360px]'
                : 'top-4 left-4 right-4 bottom-[280px] md:left-8 md:right-8 md:top-6 md:bottom-[340px]'
            }
            maxClasses="inset-0"
          >
            <MainApp
              ref={mainAppRef}
              onOpenTerminal={openConsoleFromMain}
              blogPosts={blogPosts}
              homepageSections={homepageSections}
              projects={projects}
              profile={profile}
            />
          </AppWindow>
        )}

        <AppWindow
          title={
            stylePreset === 'macos'
              ? t('window.console.title.macos', lang)
              : t('window.console.title.vercel', lang)
          }
          icon={<Terminal size={12} />}
          state={consoleState}
          setState={setConsoleState}
          isActive={active === 'console'}
          onFocus={() => focusWindow('console')}
          stylePreset={stylePreset}
          defaultClasses={
            stylePreset === 'macos'
              ? 'bottom-4 left-4 right-4 h-[240px] md:bottom-8 md:left-[15%] md:right-[15%] md:h-[300px]'
              : 'bottom-0 left-0 right-0 h-[240px] border-b-0 rounded-b-none md:bottom-4 md:left-8 md:right-8 md:h-[300px] md:rounded-b-md md:border-b'
          }
          maxClasses="inset-0"
          isDarkContent={stylePreset === 'macos'}
        >
          <ConsoleApp
            blogPosts={blogPosts}
            profile={profile}
            projects={projects}
            onCommandResult={handleConsoleCommandResult}
          />
        </AppWindow>
      </div>
    </div>
  );
}
