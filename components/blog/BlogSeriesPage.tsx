import Link from 'next/link';
import { ArrowUpRight, BookOpen, Calendar, Clock, FileText, FolderKanban } from 'lucide-react';
import type { BlogPostMeta, BlogSeries } from '@/lib/blog/blog-types';
import { formatBlogDate } from '@/lib/blog/markdown';
import type { ProjectMeta } from '@/lib/projects';
import { getStyleTokens } from '@/lib/stylePresets';
import { t } from '@/lib/translations';
import type { Lang, StylePreset } from '@/lib/types';

interface BlogSeriesPageProps {
  series: BlogSeries;
  posts: BlogPostMeta[];
  relatedProjects: ProjectMeta[];
  stylePreset: StylePreset;
  lang: Lang;
}

export function BlogSeriesPage({
  series,
  posts,
  relatedProjects,
  stylePreset,
  lang,
}: BlogSeriesPageProps) {
  const tokens = getStyleTokens(stylePreset);

  return (
    <div className="space-y-5">
      <section className={`${tokens.cardBg} ${tokens.cardBorder} ${tokens.cardBorderRadius} ${tokens.cardShadow} p-5 md:p-7`}>
        <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] text-zinc-400 dark:text-zinc-500">
          <span className="inline-flex items-center gap-1">
            <BookOpen size={11} />
            {t('blog.seriesLabel', lang)}
          </span>
          <span className="inline-flex items-center gap-1">
            <FileText size={11} />
            {series.count} {t('blog.count', lang)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar size={11} />
            {t('blog.seriesLatest', lang)} {formatBlogDate(series.latestUpdatedAt, lang)}
          </span>
        </div>

        <h1 className={`mb-3 text-2xl font-bold md:text-3xl ${tokens.textPrimary}`}>
          {series.title}
        </h1>
        <p className={`text-sm leading-relaxed md:text-base ${tokens.textSecondary}`}>
          {t('blog.seriesDetailSubtitle', lang)}
        </p>
      </section>

      {relatedProjects.length > 0 && (
        <section className={`${tokens.cardBg} ${tokens.cardBorder} ${tokens.cardBorderRadius} ${tokens.cardShadow} p-5 md:p-6`}>
          <h2 className={`mb-4 text-lg font-semibold ${tokens.textPrimary}`}>
            {t('projects.relatedProject', lang)}
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {relatedProjects.map((project) => (
              <article
                key={project.slug}
                className={`rounded-lg border border-zinc-200/60 p-4 dark:border-zinc-800/70 ${stylePreset === 'macos' ? 'bg-white/35 dark:bg-white/5' : 'bg-zinc-50 dark:bg-zinc-950'}`}
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className={`mb-2 flex flex-wrap items-center gap-2 text-[11px] ${tokens.textMuted}`}>
                      <span className="inline-flex items-center gap-1">
                        <FolderKanban size={12} />
                        {project.statusLabel || t(`projects.status.${project.status}` as const, lang)}
                      </span>
                    </div>
                    <h3 className={`text-base font-semibold ${tokens.textPrimary}`}>
                      {project.title}
                    </h3>
                    <p className={`mt-2 text-sm leading-relaxed ${tokens.textSecondary}`}>
                      {project.summary}
                    </p>
                    {project.techStack.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {project.techStack.slice(0, 5).map((tech) => (
                          <span
                            key={`${project.slug}-${tech}`}
                            className={`px-2 py-1 text-[10px] ${tokens.projectTagBg} ${tokens.projectTagText} ${tokens.tagBorderRadius}`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <Link
                    href={`/projects/${project.slug}`}
                    className={`inline-flex min-h-9 shrink-0 items-center justify-center gap-2 rounded-md border border-zinc-200/60 px-3 py-2 text-xs transition-colors hover:bg-zinc-50 dark:border-zinc-800/70 dark:hover:bg-zinc-900 ${tokens.textSecondary}`}
                  >
                    {t('projects.viewProjectDetail', lang)}
                    <ArrowUpRight size={12} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <div className="space-y-3">
        {posts.map((post, index) => (
          <article
            key={post.slug}
            className={`group ${tokens.cardBg} ${tokens.cardBorder} ${tokens.cardBorderRadius} transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}
          >
            <Link href={`/blog/${post.slug}`} className="grid gap-4 p-4 sm:grid-cols-[44px_1fr_auto] sm:items-start md:p-5">
              <div className={`flex h-9 w-9 items-center justify-center rounded-md text-xs font-semibold ${tokens.tagBg} ${tokens.tagText} ${tokens.tagBorder}`}>
                {String(post.seriesOrder ?? index + 1).padStart(2, '0')}
              </div>

              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-zinc-400 dark:text-zinc-500">
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={11} />
                    {formatBlogDate(post.date, lang)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock size={11} />
                    {t('blog.readingTimeShort', lang, String(post.readingTimeMinutes))}
                  </span>
                </div>
                <h2 className={`mb-2 text-base font-semibold md:text-lg ${tokens.textPrimary}`}>
                  {post.title}
                </h2>
                <p className={`text-sm leading-relaxed ${tokens.textSecondary}`}>
                  {post.summary}
                </p>
              </div>

              <span className={`inline-flex items-center gap-1 text-xs ${tokens.textMuted} sm:justify-self-end`}>
                {t('blog.readMore', lang)}
                <ArrowUpRight size={12} />
              </span>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
