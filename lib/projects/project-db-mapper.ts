import type { ProjectStatus } from '@/lib/types';
import type { DbJsonValue, ProjectRow } from '@/lib/db/dbTypes';
import type {
  Project,
  ProjectLanguage,
  ProjectLinkData,
  ProjectLinkType,
  ProjectMeta,
  ProjectRelatedPostData,
} from './project-types';

function textOrNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function toStringArray(value: DbJsonValue): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}

function toStatus(value: string | null): ProjectStatus {
  if (value === 'production' || value === 'mvp') return value;
  return 'building';
}

function toLang(value: string): ProjectLanguage {
  return value === 'en' ? 'en' : 'zh';
}

function toProjectLinkType(value: unknown): ProjectLinkType {
  if (value === 'github' || value === 'blog' || value === 'series') return value;
  return 'live';
}

function toLinks(value: DbJsonValue): ProjectLinkData[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) return null;
      const record = item as Record<string, unknown>;
      if (typeof record.label !== 'string' || typeof record.href !== 'string') return null;

      return {
        label: record.label,
        href: record.href,
        type: toProjectLinkType(record.type),
      };
    })
    .filter((item): item is ProjectLinkData => item !== null);
}

function toRelatedPosts(value: DbJsonValue): ProjectRelatedPostData[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) return null;
      const record = item as Record<string, unknown>;
      if (typeof record.title !== 'string' || typeof record.slug !== 'string') return null;

      return {
        title: record.title,
        slug: record.slug,
      };
    })
    .filter((item): item is ProjectRelatedPostData => item !== null);
}

export function mapProjectRowToMeta(row: ProjectRow): ProjectMeta {
  const status = toStatus(row.status);

  return {
    title: row.title,
    slug: row.slug,
    subtitle: row.subtitle ?? '',
    summary: row.summary ?? row.subtitle ?? '',
    status,
    statusLabel: row.status?.trim() || status,
    type: row.type ?? '',
    role: toStringArray(row.role),
    timeline: textOrNull(row.timeline),
    featured: row.featured,
    order: row.display_order ?? 999,
    techStack: toStringArray(row.tech_stack),
    features: toStringArray(row.features),
    highlights: toStringArray(row.highlights),
    links: toLinks(row.links),
    relatedPosts: toRelatedPosts(row.related_posts),
    relatedSeriesSlug: textOrNull(row.related_series_slug),
    published: row.published,
    lang: toLang(row.lang),
    seoTitle: textOrNull(row.seo_title),
    seoDescription: textOrNull(row.seo_description),
  };
}

export function mapProjectRowToProject(row: ProjectRow): Project {
  const content = row.content_markdown ?? '';

  return {
    ...mapProjectRowToMeta(row),
    content,
    rawContent: content,
  };
}
