'use client';

import Link from 'next/link';
import { ArrowUpRight, BookOpen, ExternalLink, Github } from 'lucide-react';
import { getStyleTokens } from '@/lib/stylePresets';
import type { Project, ProjectLinkData } from '@/lib/projects';
import type { Lang } from '@/lib/types';
import { t } from '@/lib/translations';

interface ProjectDetailPageProps {
  project: Project;
  htmlContent: string;
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

function ProjectActionLink({ link, isMacos }: { link: ProjectLinkData; isMacos: boolean }) {
  const Icon = getLinkIcon(link.type);
  const className = `inline-flex min-h-9 items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-all active:scale-95 ${isMacos ? 'border-indigo-200 bg-white/60 text-indigo-700 hover:bg-white dark:border-indigo-400/30 dark:bg-white/10 dark:text-indigo-200' : 'border-zinc-300 bg-zinc-50 font-mono text-zinc-800 hover:bg-white dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800'}`;
  const content = (
    <>
      <Icon size={14} />
      <span>{link.label}</span>
      <ArrowUpRight size={12} />
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

export function ProjectDetailPage({ project, htmlContent, stylePreset, lang }: ProjectDetailPageProps) {
  const tokens = getStyleTokens(stylePreset);
  const isMacos = stylePreset === 'macos';

  return (
    <article className="space-y-5">
      <section className={`${tokens.cardBg} ${tokens.cardBorder} ${tokens.cardBorderRadius} ${tokens.cardShadow} overflow-hidden`}>
        <div className={`px-5 py-5 md:px-6 md:py-6 ${isMacos ? 'bg-white/35 dark:bg-white/5' : 'bg-zinc-100/60 dark:bg-zinc-900/50'}`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className={`mb-2 text-[11px] uppercase ${tokens.textMuted} ${isMacos ? 'tracking-wider' : 'font-mono'}`}>
                {project.type}
              </div>
              <h1 className={`${isMacos ? 'text-3xl font-semibold md:text-4xl' : 'font-mono text-2xl font-bold uppercase md:text-3xl'} ${tokens.textPrimary}`}>
                {project.title}
              </h1>
              <p className={`mt-3 max-w-3xl ${isMacos ? 'text-base leading-7' : 'font-mono text-sm leading-7'} ${tokens.textSecondary}`}>
                {project.summary}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2 lg:max-w-64 lg:justify-end">
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${project.status === 'building' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'} ${isMacos ? '' : 'font-mono'}`}>
                {project.statusLabel || t(`projects.status.${project.status}` as const, lang)}
              </span>
              {project.timeline && (
                <span className={`rounded-full px-2.5 py-1 text-[11px] ${tokens.tagBg} ${tokens.tagText} ${tokens.tagBorder} ${isMacos ? '' : 'font-mono'}`}>
                  {project.timeline}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-5 p-5 md:p-6">
          <div>
            <div className={`mb-2 text-[10px] uppercase ${tokens.textMuted} ${isMacos ? 'tracking-wider' : 'font-mono'}`}>
              {t('projects.techStack', lang)}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech) => (
                <span key={tech} className={`px-2 py-1 text-[10px] ${tokens.projectTagBg} ${tokens.projectTagText} ${tokens.tagBorderRadius} ${isMacos ? '' : 'font-mono'}`}>
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {project.links && project.links.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.links.map((link) => (
                <ProjectActionLink key={`${project.slug}-${link.href}`} link={link} isMacos={isMacos} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className={`${tokens.cardBg} ${tokens.cardBorder} ${tokens.cardBorderRadius} ${tokens.cardShadow} p-5 md:p-6`}>
        <div
          className={`blog-article-body ${isMacos ? 'text-sm' : 'font-mono text-xs'}`}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </section>

      {project.relatedPosts && project.relatedPosts.length > 0 && (
        <section className={`${tokens.cardBg} ${tokens.cardBorder} ${tokens.cardBorderRadius} ${tokens.cardShadow} p-5 md:p-6`}>
          <h2 className={`${isMacos ? 'text-lg font-semibold' : 'font-mono text-sm font-bold uppercase'} ${tokens.textPrimary}`}>
            {t('projects.relatedPosts', lang)}
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-2">
            {project.relatedPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className={`flex items-center gap-2 rounded-md border border-zinc-200/60 px-3 py-2 text-xs transition-colors hover:bg-zinc-50 dark:border-zinc-800/70 dark:hover:bg-zinc-900 ${tokens.textSecondary}`}
              >
                <BookOpen size={13} className="shrink-0" />
                <span className="min-w-0 flex-1 truncate">{post.title}</span>
                <ArrowUpRight size={11} className="shrink-0" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {project.relatedSeriesSlug && (
        <section className={`${tokens.cardBg} ${tokens.cardBorder} ${tokens.cardBorderRadius} ${tokens.cardShadow} p-5 md:p-6`}>
          <h2 className={`${isMacos ? 'text-lg font-semibold' : 'font-mono text-sm font-bold uppercase'} ${tokens.textPrimary}`}>
            {t('blog.seriesLabel', lang)}
          </h2>
          <Link
            href={`/blog/series/${project.relatedSeriesSlug}`}
            className={`mt-4 inline-flex items-center gap-2 rounded-md border border-zinc-200/60 px-3 py-2 text-xs transition-colors hover:bg-zinc-50 dark:border-zinc-800/70 dark:hover:bg-zinc-900 ${tokens.textSecondary}`}
          >
            <BookOpen size={13} className="shrink-0" />
            <span className="min-w-0 flex-1 truncate">{project.relatedSeriesSlug}</span>
            <ArrowUpRight size={11} className="shrink-0" />
          </Link>
        </section>
      )}

      <div className="flex justify-center">
        <Link
          href="/projects"
          className={`inline-flex min-h-9 items-center gap-2 px-3 py-1.5 text-xs transition-all active:scale-95 ${tokens.tagBg} ${tokens.tagText} ${tokens.tagBorder} ${tokens.tagBorderRadius} hover:text-zinc-900 dark:hover:text-white ${isMacos ? '' : 'font-mono'}`}
        >
          {t('projects.backToProjects', lang)}
        </Link>
      </div>
    </article>
  );
}
