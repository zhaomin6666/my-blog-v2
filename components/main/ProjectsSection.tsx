'use client';

import Link from 'next/link';
import { ArrowUpRight, BookOpen, CheckCircle2, ExternalLink, Github } from 'lucide-react';
import { useSettings } from '@/lib/settings-context';
import { getStyleTokens } from '@/lib/stylePresets';
import type { ProjectLinkData, ProjectMeta } from '@/lib/projects';
import { ProjectStatus } from '@/lib/types';
import { t } from '@/lib/translations';

function getStatusColor(status: ProjectStatus, isMacos: boolean): string {
  switch (status) {
    case 'building':
      return isMacos
        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
        : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400';
    case 'production':
      return isMacos
        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
        : 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400';
    case 'mvp':
      return isMacos
        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
        : 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400';
    default:
      return '';
  }
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

interface ProjectLinkItemProps {
  link: ProjectLinkData;
  isMacos: boolean;
  tokens: ReturnType<typeof getStyleTokens>;
}

function ProjectLinkItem({ link, isMacos, tokens }: ProjectLinkItemProps) {
  const Icon = getLinkIcon(link.type);
  const className = `inline-flex min-h-8 items-center gap-1.5 px-2.5 py-1 text-[11px] transition-all duration-200 active:scale-95 ${tokens.tagBg} ${tokens.tagText} ${tokens.tagBorder} ${tokens.tagBorderRadius} hover:text-zinc-900 dark:hover:text-white ${isMacos ? '' : 'font-mono'}`;
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

interface FeaturedProjectCardProps {
  project: ProjectMeta;
  isMacos: boolean;
  tokens: ReturnType<typeof getStyleTokens>;
  lang: 'zh' | 'en';
}

function FeaturedProjectCard({ project, isMacos, tokens, lang }: FeaturedProjectCardProps) {
  return (
    <article className={`group ${tokens.nestedCardBg} ${tokens.nestedCardBorder} ${tokens.nestedCardBorderRadius} overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:opacity-95`}>
      <div className={`px-4 py-3 ${isMacos ? 'bg-white/35 dark:bg-white/5' : 'bg-zinc-100/50 dark:bg-zinc-900/30'}`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className={`mb-1 text-[10px] uppercase ${tokens.textMuted} ${isMacos ? 'tracking-wider' : 'font-mono'}`}>
              {project.type}
            </div>
            <h3 className={`${isMacos ? 'text-base font-semibold' : 'text-sm font-mono font-bold'} ${tokens.textPrimary}`}>
              {project.title}
            </h3>
            <p className={`mt-1 ${isMacos ? 'text-xs' : 'text-[11px] font-mono'} ${tokens.textSecondary}`}>
              {project.subtitle}
            </p>
          </div>
          <span className={`w-fit shrink-0 text-[10px] px-2 py-1 rounded-full font-medium ${getStatusColor(project.status, isMacos)} ${isMacos ? '' : 'font-mono'}`}>
            {project.statusLabel || t(`projects.status.${project.status}` as const, lang)}
          </span>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        <p className={`${isMacos ? 'text-sm leading-relaxed' : 'text-[12px] font-mono leading-relaxed'} ${tokens.textSecondary}`}>
          {project.summary}
        </p>

        <div>
          <div className={`text-[10px] mb-2 ${tokens.textMuted} ${isMacos ? 'uppercase tracking-wider' : 'font-mono uppercase'}`}>
            {t('projects.highlights', lang)}
          </div>
          <ul className="space-y-2">
            {project.highlights.slice(0, 4).map((highlight) => (
              <li key={highlight} className="flex gap-2">
                <CheckCircle2 size={14} className={`mt-0.5 shrink-0 ${isMacos ? 'text-indigo-500 dark:text-indigo-300' : 'text-zinc-700 dark:text-zinc-300'}`} />
                <span className={`${isMacos ? 'text-xs leading-relaxed' : 'text-[11px] font-mono leading-relaxed'} ${tokens.textSecondary}`}>
                  {highlight}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {project.features && project.features.length > 0 && (
          <div className={`p-3 ${isMacos ? 'rounded-xl bg-white/45 dark:bg-white/[0.04]' : 'rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950'}`}>
            <div className={`text-[10px] mb-2 ${tokens.textMuted} ${isMacos ? 'uppercase tracking-wider' : 'font-mono uppercase'}`}>
              {t('projects.features', lang)}
            </div>
            <div className="space-y-1.5">
              {project.features.slice(0, 3).map((feature) => (
                <p key={feature} className={`${isMacos ? 'text-xs leading-relaxed' : 'text-[11px] font-mono leading-relaxed'} ${tokens.textSecondary}`}>
                  {feature}
                </p>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <div className={`text-[10px] mb-1.5 ${tokens.textMuted} ${isMacos ? 'uppercase tracking-wider' : 'font-mono uppercase'}`}>
              {t('projects.techStack', lang)}
            </div>
            <div className="flex flex-wrap gap-1">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className={`px-1.5 py-0.5 text-[10px] ${tokens.projectTagBg} ${tokens.projectTagText} ${tokens.tagBorderRadius} ${isMacos ? '' : 'font-mono'}`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className={`text-[10px] mb-1.5 ${tokens.textMuted} ${isMacos ? 'uppercase tracking-wider' : 'font-mono uppercase'}`}>
              {t('projects.role', lang)}
            </div>
            <div className="flex flex-wrap gap-1">
              {project.role.map((role) => (
                <span
                  key={role}
                  className={`px-1.5 py-0.5 text-[10px] ${tokens.tagBg} ${tokens.tagText} ${tokens.tagBorder} ${tokens.tagBorderRadius} ${isMacos ? '' : 'font-mono'}`}
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>

        {project.links && project.links.length > 0 && (
          <div>
            <div className={`text-[10px] mb-1.5 ${tokens.textMuted} ${isMacos ? 'uppercase tracking-wider' : 'font-mono uppercase'}`}>
              {t('projects.links', lang)}
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/projects/${project.slug}`}
                className={`inline-flex min-h-8 items-center gap-1.5 px-2.5 py-1 text-[11px] transition-all duration-200 active:scale-95 ${tokens.tagBg} ${tokens.tagText} ${tokens.tagBorder} ${tokens.tagBorderRadius} hover:text-zinc-900 dark:hover:text-white ${isMacos ? '' : 'font-mono'}`}
              >
                <BookOpen size={12} />
                <span>{t('projects.caseStudy', lang)}</span>
                <ArrowUpRight size={11} />
              </Link>
              {project.links.map((link) => (
                <ProjectLinkItem
                  key={`${project.slug}-${link.href}`}
                  link={link}
                  isMacos={isMacos}
                  tokens={tokens}
                />
              ))}
            </div>
          </div>
        )}

        {project.relatedPosts && project.relatedPosts.length > 0 && (
          <div className="border-t border-zinc-200/40 pt-3 dark:border-zinc-800/40">
            <div className={`text-[10px] mb-2 ${tokens.textMuted} ${isMacos ? 'uppercase tracking-wider' : 'font-mono uppercase'}`}>
              {t('projects.relatedPosts', lang)}
            </div>
            <div className="space-y-1.5">
              {project.relatedPosts.slice(0, 3).map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className={`group/post flex items-center gap-2 text-[11px] ${tokens.textSecondary} hover:text-zinc-900 dark:hover:text-white transition-colors`}
                >
                  <BookOpen size={12} className="shrink-0" />
                  <span className="min-w-0 flex-1 truncate">{post.title}</span>
                  <ArrowUpRight size={11} className="shrink-0 opacity-0 transition-opacity group-hover/post:opacity-100" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

interface CompactProjectCardProps {
  project: ProjectMeta;
  isMacos: boolean;
  tokens: ReturnType<typeof getStyleTokens>;
  lang: 'zh' | 'en';
}

function CompactProjectCard({ project, isMacos, tokens, lang }: CompactProjectCardProps) {
  return (
    <article className={`group ${tokens.nestedCardBg} ${tokens.nestedCardBorder} ${tokens.nestedCardBorderRadius} overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:opacity-95`}>
      <div className={`px-4 py-3 ${isMacos ? 'bg-white/30 dark:bg-white/5' : 'bg-zinc-100/50 dark:bg-zinc-900/30'} flex items-start justify-between gap-3`}>
        <div className="min-w-0">
          <h3 className={`${isMacos ? 'text-sm font-semibold' : 'text-xs font-mono font-bold'} ${tokens.textPrimary}`}>
            {project.title}
          </h3>
          <p className={`mt-1 ${isMacos ? 'text-xs' : 'text-[11px] font-mono'} ${tokens.textSecondary}`}>
            {project.subtitle}
          </p>
        </div>
        <span className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(project.status, isMacos)} ${isMacos ? '' : 'font-mono'}`}>
          {project.statusLabel || t(`projects.status.${project.status}` as const, lang)}
        </span>
      </div>

      <div className="px-4 py-3 space-y-3">
        <p className={`${isMacos ? 'text-xs leading-relaxed' : 'text-[11px] font-mono leading-relaxed'} ${tokens.textSecondary}`}>
          {project.summary}
        </p>

        <div className="space-y-1.5">
          {project.highlights.slice(0, 2).map((highlight) => (
            <p
              key={highlight}
              className={`${isMacos ? 'text-xs leading-relaxed' : 'text-[11px] font-mono leading-relaxed'} ${tokens.textSecondary}`}
            >
              {highlight}
            </p>
          ))}
        </div>

        <div>
          <div className={`text-[10px] mb-1.5 ${tokens.textMuted} ${isMacos ? 'uppercase tracking-wider' : 'font-mono uppercase'}`}>
            {t('projects.techStack', lang)}
          </div>
          <div className="flex flex-wrap gap-1">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className={`px-1.5 py-0.5 text-[10px] ${tokens.projectTagBg} ${tokens.projectTagText} ${tokens.tagBorderRadius} ${isMacos ? '' : 'font-mono'}`}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <Link
          href={`/projects/${project.slug}`}
          className={`inline-flex min-h-8 w-fit items-center gap-1.5 px-2.5 py-1 text-[11px] transition-all duration-200 active:scale-95 ${tokens.tagBg} ${tokens.tagText} ${tokens.tagBorder} ${tokens.tagBorderRadius} hover:text-zinc-900 dark:hover:text-white ${isMacos ? '' : 'font-mono'}`}
        >
          <BookOpen size={12} />
          <span>{t('projects.caseStudy', lang)}</span>
          <ArrowUpRight size={11} />
        </Link>
      </div>
    </article>
  );
}

interface ProjectsSectionProps {
  projects: ProjectMeta[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const { lang, stylePreset } = useSettings();
  const tokens = getStyleTokens(stylePreset);
  const isMacos = stylePreset === 'macos';
  const featuredProjects = projects.filter((project) => project.featured);
  const supportingProjects = projects.filter((project) => !project.featured);

  return (
    <div className={`p-6 ${tokens.cardBg} ${tokens.cardBorder} ${tokens.cardBorderRadius} ${tokens.cardShadow}`}>
      <div className="flex items-center gap-2 mb-5">
        <div className={`w-1 h-5 rounded-full ${isMacos ? 'bg-indigo-500' : 'bg-zinc-900 dark:bg-zinc-100'}`} />
        <h2 className={`${isMacos ? 'text-lg font-semibold' : 'text-xs font-mono font-bold uppercase tracking-wider'} ${tokens.textPrimary}`}>
          {t('projects.title', lang)}
        </h2>
        <span className={`ml-auto text-[10px] px-2 py-0.5 ${tokens.tagBg} ${tokens.tagText} ${tokens.tagBorder} ${tokens.tagBorderRadius}`}>
          services/
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {featuredProjects.map((project) => (
          <FeaturedProjectCard
            key={project.slug}
            project={project}
            isMacos={isMacos}
            tokens={tokens}
            lang={lang}
          />
        ))}
      </div>

      {supportingProjects.length > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {supportingProjects.map((project) => (
            <CompactProjectCard
              key={project.slug}
              project={project}
              isMacos={isMacos}
              tokens={tokens}
              lang={lang}
            />
          ))}
        </div>
      )}
    </div>
  );
}
