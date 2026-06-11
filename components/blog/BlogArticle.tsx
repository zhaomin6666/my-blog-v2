import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, BookOpen, Calendar, Clock, FolderKanban, Globe, Tag } from 'lucide-react';
import type { BlogPost } from '@/lib/blog/blog-types';
import { formatBlogDate } from '@/lib/blog/markdown';
import type { ProjectMeta } from '@/lib/projects';
import { getStyleTokens } from '@/lib/stylePresets';
import { t } from '@/lib/translations';
import type { StylePreset, Lang } from '@/lib/types';

interface BlogArticleProps {
  post: BlogPost;
  htmlContent: string;
  relatedProjects: ProjectMeta[];
  stylePreset: StylePreset;
  lang: Lang;
}

export function BlogArticle({
  post,
  htmlContent,
  relatedProjects,
  stylePreset,
  lang,
}: BlogArticleProps) {
  const tokens = getStyleTokens(stylePreset);

  return (
    <article className={`${tokens.cardBg} ${tokens.cardBorder} ${tokens.cardBorderRadius} ${tokens.cardShadow}`}>
      <div className="border-b border-zinc-200/60 p-5 dark:border-zinc-800/60 md:p-8">
        <Link
          href="/blog"
          className={`mb-4 inline-flex items-center gap-1.5 text-xs ${tokens.textMuted} transition-colors hover:text-zinc-700 dark:hover:text-zinc-300`}
        >
          <ArrowLeft size={12} />
          {t('blog.backToLogs', lang)}
        </Link>

        <h1 className={`mb-4 text-2xl md:text-3xl font-bold ${tokens.textPrimary}`}>
          {post.title}
        </h1>

        {post.summary && (
          <p className={`mb-5 text-sm md:text-base leading-relaxed ${tokens.textSecondary}`}>
            {post.summary}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="inline-flex items-center gap-1">
            <Calendar size={12} />
            {formatBlogDate(post.date, lang)}
          </span>
          {post.updatedAt !== post.date && (
            <span className="inline-flex items-center gap-1">
              <Calendar size={12} />
              {t('blog.updated', lang)}: {formatBlogDate(post.updatedAt, lang)}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Clock size={12} />
            {t(
              'blog.readingStats',
              lang,
              String(post.readingTimeMinutes),
              String(post.wordCount),
            )}
          </span>
          <span className="inline-flex items-center gap-1">
            <Globe size={12} />
            {post.lang.toUpperCase()}
          </span>
        </div>

        {(post.series || post.tags.length > 0) && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {post.series && post.seriesSlug && (
              <Link
                href={`/blog/series/${post.seriesSlug}`}
                className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] ${tokens.tagBg} ${tokens.tagText} ${tokens.tagBorder} ${tokens.tagBorderRadius} transition-colors hover:text-zinc-700 dark:hover:text-zinc-200`}
              >
                <BookOpen size={10} />
                {post.series}
              </Link>
            )}
            {post.series && !post.seriesSlug && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] ${tokens.tagBg} ${tokens.tagText} ${tokens.tagBorder} ${tokens.tagBorderRadius}`}>
                <BookOpen size={10} />
                {post.series}
              </span>
            )}
            {post.tags.map((tag) => (
              <span
                key={tag}
                className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] ${tokens.tagBg} ${tokens.tagText} ${tokens.tagBorder} ${tokens.tagBorderRadius}`}
              >
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div
        className="blog-article-body p-5 md:p-8"
        // Content originates from local Markdown files.
        // Future CMS phase should add sanitize step before rendering.
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      {relatedProjects.length > 0 && (
        <div className="border-t border-zinc-200/60 p-5 dark:border-zinc-800/60 md:p-8">
          <h2 className={`mb-3 text-sm font-semibold ${tokens.textPrimary}`}>
            {t('projects.relatedProject', lang)}
          </h2>
          <div className="grid grid-cols-1 gap-2">
            {relatedProjects.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className={`flex min-h-11 items-center gap-3 rounded-md border border-zinc-200/60 px-3 py-2 text-xs transition-colors hover:bg-zinc-50 dark:border-zinc-800/70 dark:hover:bg-zinc-900 ${tokens.textSecondary}`}
              >
                <FolderKanban size={14} className="shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className={`block truncate font-medium ${tokens.textPrimary}`}>
                    {project.title}
                  </span>
                  <span className={`block truncate ${tokens.textMuted}`}>
                    {t('projects.viewProjectDetail', lang)}
                  </span>
                </span>
                <ArrowUpRight size={12} className="shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
