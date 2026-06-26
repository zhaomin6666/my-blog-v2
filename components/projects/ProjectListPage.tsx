'use client';

import Link from 'next/link';
import { ArrowUpRight, BookOpen, CheckCircle2, ExternalLink, Github } from 'lucide-react';
import { getStyleTokens } from '@/lib/stylePresets';
import type { PageConfig } from '@/lib/page-config/page-config-types';
import type { ProjectLinkData, ProjectMeta } from '@/lib/projects';
import type { Lang } from '@/lib/types';
import { t } from '@/lib/translations';

interface ProjectListPageProps {
  projects: ProjectMeta[];
  pageConfig: PageConfig;
  stylePreset: 'macos' | 'vercel';
  lang: Lang;
}

function getLinkIcon(type: ProjectLinkData['type']) {
  switch (type) {
    case 'github':
      return Github;
    case 'blog':
    case 'series':
      return BookOpen;
    case 'live':
    default:
      return ExternalLink;
  }
}

function isExternalLink(href: string) {
  return href.startsWith('http://') || href.startsWith('https://');
}

function QuickLink({ link, isMacos }: { link: ProjectLinkData; isMacos: boolean }) {
  const Icon = getLinkIcon(link.type);
  const className = `inline-flex items-center gap-1.5 text-[11px] transition-colors ${isMacos ? 'text-indigo-600 hover:text-indigo-800 dark:text-indigo-300 dark:hover:text-indigo-200' : 'font-mono text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white'}`;
  const content = (
    <>
      <Icon size={12} />
      <span>{link.label}</span>
      <ArrowUpRight size={11} />
    </>
  );

  if (isExternalLink(link.href)) {
    return (
      <a href={link.href} target="_blank" rel="noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={link.href} className={className}>
      {content}
    </Link>
  );
}

export function ProjectListPage({
  projects,
  pageConfig,
  stylePreset,
  lang,
}: ProjectListPageProps) {
  const tokens = getStyleTokens(stylePreset);
  const isMacos = stylePreset === 'macos';

  return (
    <div className="space-y-5">
      <section className={`${tokens.cardBg} ${tokens.cardBorder} ${tokens.cardBorderRadius} ${tokens.cardShadow} p-5 md:p-6`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className={`mb-2 text-[11px] uppercase ${tokens.textMuted} ${isMacos ? 'tracking-wider' : 'font-mono'}`}>
              projects/
            </div>
            <h1 className={`${isMacos ? 'text-2xl font-semibold md:text-3xl' : 'font-mono text-xl font-bold uppercase md:text-2xl'} ${tokens.textPrimary}`}>
              {pageConfig.title}
            </h1>
            {pageConfig.subtitle ? (
              <p className={`mt-3 max-w-2xl ${isMacos ? 'text-sm leading-relaxed' : 'font-mono text-xs leading-relaxed'} ${tokens.textSecondary}`}>
                {pageConfig.subtitle}
              </p>
            ) : null}
          </div>
          <span className={`w-fit px-2.5 py-1 text-[11px] ${tokens.tagBg} ${tokens.tagText} ${tokens.tagBorder} ${tokens.tagBorderRadius}`}>
            {projects.length} {t('projects.count', lang)}
          </span>
        </div>
      </section>

      {projects.length === 0 ? (
        <div className={`flex min-h-48 items-center justify-center ${tokens.cardBg} ${tokens.cardBorder} ${tokens.cardBorderRadius} ${tokens.cardShadow} p-6`}>
          <p className={`text-sm ${tokens.textSecondary}`}>{t('projects.empty', lang)}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {projects.map((project) => (
          <article
            key={project.slug}
            className={`${tokens.cardBg} ${tokens.cardBorder} ${tokens.cardBorderRadius} ${tokens.cardShadow} overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}
          >
            <div className={`px-4 py-3 ${isMacos ? 'bg-white/35 dark:bg-white/5' : 'bg-zinc-100/60 dark:bg-zinc-900/50'}`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className={`mb-1 text-[10px] uppercase ${tokens.textMuted} ${isMacos ? 'tracking-wider' : 'font-mono'}`}>
                    {project.type}
                  </div>
                  <h2 className={`${isMacos ? 'text-lg font-semibold' : 'font-mono text-sm font-bold'} ${tokens.textPrimary}`}>
                    {project.title}
                  </h2>
                  <p className={`mt-1 ${isMacos ? 'text-xs' : 'font-mono text-[11px]'} ${tokens.textSecondary}`}>
                    {project.subtitle}
                  </p>
                </div>
                <span className={`w-fit shrink-0 rounded-full px-2 py-1 text-[10px] font-medium ${project.status === 'building' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'} ${isMacos ? '' : 'font-mono'}`}>
                  {project.statusLabel || t(`projects.status.${project.status}` as const, lang)}
                </span>
              </div>
            </div>

            <div className="space-y-4 p-4">
              <p className={`${isMacos ? 'text-sm leading-relaxed' : 'font-mono text-xs leading-relaxed'} ${tokens.textSecondary}`}>
                {project.summary}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {project.techStack.map((tech) => (
                  <span key={tech} className={`px-2 py-1 text-[10px] ${tokens.projectTagBg} ${tokens.projectTagText} ${tokens.tagBorderRadius} ${isMacos ? '' : 'font-mono'}`}>
                    {tech}
                  </span>
                ))}
              </div>

              <ul className="space-y-2">
                {project.highlights.slice(0, 3).map((highlight) => (
                  <li key={highlight} className="flex gap-2">
                    <CheckCircle2 size={14} className={`mt-0.5 shrink-0 ${isMacos ? 'text-indigo-500 dark:text-indigo-300' : 'text-zinc-700 dark:text-zinc-300'}`} />
                    <span className={`${isMacos ? 'text-xs leading-relaxed' : 'font-mono text-[11px] leading-relaxed'} ${tokens.textSecondary}`}>
                      {highlight}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-zinc-200/50 pt-3 dark:border-zinc-800/60">
                <Link
                  href={`/projects/${project.slug}`}
                  className={`inline-flex min-h-8 items-center gap-1.5 px-2.5 py-1 text-[11px] transition-all active:scale-95 ${tokens.tagBg} ${tokens.tagText} ${tokens.tagBorder} ${tokens.tagBorderRadius} hover:text-zinc-900 dark:hover:text-white ${isMacos ? '' : 'font-mono'}`}
                >
                  <span>{t('projects.openProject', lang)}</span>
                  <ArrowUpRight size={11} />
                </Link>
                {project.links?.slice(0, 2).map((link) => (
                  <QuickLink key={`${project.slug}-${link.href}`} link={link} isMacos={isMacos} />
                ))}
              </div>
            </div>
          </article>
          ))}
        </div>
      )}
    </div>
  );
}
