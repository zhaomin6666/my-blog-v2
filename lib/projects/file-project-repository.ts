import 'server-only';
import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { ProjectStatus } from '@/lib/types';
import type { ProjectLookupOptions, ProjectRepository } from './project-repository';
import type {
  Project,
  ProjectFrontmatter,
  ProjectLanguage,
  ProjectLinkData,
  ProjectMeta,
  ProjectQueryOptions,
  ProjectRelatedPostData,
} from './project-types';

const PROJECTS_DIR = path.join(process.cwd(), 'content', 'projects');

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string');
  }

  if (typeof value === 'string') {
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }

  return [];
}

function toBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return fallback;
}

function toNumber(value: unknown, fallback: number): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function toStatus(value: unknown): ProjectStatus {
  if (value === 'production' || value === 'mvp') {
    return value;
  }

  return 'building';
}

function toLang(value: unknown): ProjectLanguage {
  if (value === 'en') return 'en';
  return 'zh';
}

function toLinks(value: unknown): ProjectLinkData[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const candidate = item as Partial<ProjectLinkData>;
      if (!candidate.href || !candidate.label) return null;

      return {
        label: String(candidate.label),
        href: String(candidate.href),
        type: candidate.type === 'github' || candidate.type === 'blog' || candidate.type === 'series'
          ? candidate.type
          : 'live',
      };
    })
    .filter((item): item is ProjectLinkData => item !== null);
}

function toRelatedPosts(value: unknown): ProjectRelatedPostData[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const candidate = item as Partial<ProjectRelatedPostData>;
      if (!candidate.slug || !candidate.title) return null;

      return {
        title: String(candidate.title),
        slug: String(candidate.slug),
      };
    })
    .filter((item): item is ProjectRelatedPostData => item !== null);
}

function normalizeFrontmatter(raw: ProjectFrontmatter, fileSlug: string): ProjectMeta {
  const slug = raw.slug?.trim() || fileSlug;
  const title = raw.title?.trim() || slug;
  const subtitle = raw.subtitle?.trim() || '';
  const summary = raw.summary?.trim() || subtitle;
  const status = toStatus(raw.status);
  const statusLabel = raw.statusLabel?.trim() || status;
  const type = raw.type?.trim() || '';
  const role = toStringArray(raw.role);
  const timeline = raw.timeline?.trim() || null;
  const featured = toBoolean(raw.featured);
  const order = toNumber(raw.order, 999);
  const techStack = toStringArray(raw.techStack);
  const features = toStringArray(raw.features);
  const highlights = toStringArray(raw.highlights);
  const links = toLinks(raw.links);
  const relatedPosts = toRelatedPosts(raw.relatedPosts);
  const relatedSeriesSlug = raw.relatedSeriesSlug?.trim() || null;
  const published = toBoolean(raw.published, true);
  const lang = toLang(raw.lang);
  const seoTitle = raw.seoTitle?.trim() || null;
  const seoDescription = raw.seoDescription?.trim() || null;

  return {
    title,
    slug,
    subtitle,
    summary,
    status,
    statusLabel,
    type,
    role,
    timeline,
    featured,
    order,
    techStack,
    features,
    highlights,
    links,
    relatedPosts,
    relatedSeriesSlug,
    published,
    lang,
    seoTitle,
    seoDescription,
  };
}

export class FileProjectRepository implements ProjectRepository {
  private async readProjectFiles(): Promise<Array<{ fileSlug: string; filePath: string }>> {
    const walk = async (dir: string): Promise<Array<{ fileSlug: string; filePath: string }>> => {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      const files = await Promise.all(
        entries.map(async (entry) => {
          const entryPath = path.join(dir, entry.name);

          if (entry.isDirectory()) {
            return walk(entryPath);
          }

          if (entry.isFile() && entry.name.endsWith('.md')) {
            return [{
              fileSlug: entry.name.replace(/\.md$/, ''),
              filePath: entryPath,
            }];
          }

          return [];
        }),
      );

      return files.flat();
    };

    try {
      return walk(PROJECTS_DIR);
    } catch {
      return [];
    }
  }

  private async parseFile(filePath: string, fileSlug: string): Promise<Project | null> {
    try {
      const raw = await fs.readFile(filePath, 'utf-8');
      const parsed = matter(raw);
      const meta = normalizeFrontmatter(parsed.data as ProjectFrontmatter, fileSlug);

      return {
        ...meta,
        content: parsed.content,
        rawContent: raw,
      };
    } catch {
      return null;
    }
  }

  private assertUniqueSlugs(projects: Project[]): void {
    const seen = new Set<string>();
    const duplicates = new Set<string>();

    for (const project of projects) {
      if (seen.has(project.slug)) {
        duplicates.add(project.slug);
      }
      seen.add(project.slug);
    }

    if (duplicates.size > 0) {
      throw new Error(`Duplicate project slug(s): ${Array.from(duplicates).join(', ')}`);
    }
  }

  private async getAllParsedProjects(): Promise<Project[]> {
    const files = await this.readProjectFiles();
    const projects = await Promise.all(
      files.map((file) => this.parseFile(file.filePath, file.fileSlug)),
    );
    const parsedProjects = projects.filter((project): project is Project => project !== null);
    this.assertUniqueSlugs(parsedProjects);
    return parsedProjects;
  }

  private applyOptions(projects: Project[], options?: ProjectQueryOptions): Project[] {
    const includeDrafts = options?.includeDrafts ?? false;
    const featured = options?.featured;
    const lang = options?.lang;

    let result = projects;

    if (!includeDrafts) {
      result = result.filter((project) => project.published);
    }

    if (featured !== undefined) {
      result = result.filter((project) => project.featured === featured);
    }

    if (lang) {
      result = result.filter((project) => project.lang === lang);
    }

    return [...result].sort((a, b) => a.order - b.order);
  }

  async getAllProjects(options?: ProjectQueryOptions): Promise<ProjectMeta[]> {
    const projects = await this.getAllParsedProjects();
    const filtered = this.applyOptions(projects, options);

    return filtered.map((project) => {
      const {
        title,
        slug,
        subtitle,
        summary,
        status,
        statusLabel,
        type,
        role,
        timeline,
        featured,
        order,
        techStack,
        features,
        highlights,
        links,
        relatedPosts,
        relatedSeriesSlug,
        published,
        lang,
        seoTitle,
        seoDescription,
      } = project;

      return {
        title,
        slug,
        subtitle,
        summary,
        status,
        statusLabel,
        type,
        role,
        timeline,
        featured,
        order,
        techStack,
        features,
        highlights,
        links,
        relatedPosts,
        relatedSeriesSlug,
        published,
        lang,
        seoTitle,
        seoDescription,
      };
    });
  }

  async getProjectBySlug(
    slug: string,
    options?: ProjectLookupOptions,
  ): Promise<Project | null> {
    const projects = await this.getAllParsedProjects();
    const project = projects.find((candidate) => candidate.slug === slug) ?? null;

    if (!project) return null;

    if (!options?.includeDrafts && !project.published) {
      return null;
    }

    return project;
  }
}
