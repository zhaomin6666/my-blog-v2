import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ProjectAdminRepository } from './project-admin-repository';
import type {
  AdminProject,
  AdminProjectInput,
  AdminProjectListParams,
} from './project-admin-types';
import { AdminProjectValidationError } from './project-admin-validation';

vi.mock('server-only', () => ({}));

vi.mock('@/lib/db/dbConfig', () => ({
  hasPersonalSiteDatabaseConfig: vi.fn(() => true),
}));

const { hasPersonalSiteDatabaseConfig } = await import('@/lib/db/dbConfig');
const { ProjectAdminDatabaseConfigError, ProjectAdminService } = await import('./project-admin-service');
const hasDatabaseConfigMock = vi.mocked(hasPersonalSiteDatabaseConfig);

const baseInput: AdminProjectInput = {
  title: 'Projects Admin MVP',
  slug: 'projects-admin-mvp',
  subtitle: 'Database-backed project editor',
  summary: 'Admin editing flow for projects',
  contentMarkdown: '## Project\nContent',
  status: 'building',
  type: 'Admin CMS',
  role: ['Owner'],
  timeline: '2026',
  published: false,
  featured: false,
  displayOrder: 10,
  techStack: ['Next.js', 'PostgreSQL'],
  features: ['Markdown editing'],
  highlights: ['Scoped database admin'],
  links: { live: 'https://example.com' },
  relatedPosts: [{ title: 'Build log', slug: 'build-log' }],
  relatedSeriesSlug: 'admin-cms',
  lang: 'zh',
  seoTitle: '',
  seoDescription: '',
};

function makeProject(input: AdminProjectInput, id = 'project-1'): AdminProject {
  return {
    id,
    title: input.title,
    slug: input.slug,
    subtitle: input.subtitle,
    summary: input.summary,
    contentMarkdown: input.contentMarkdown,
    status: input.status,
    type: input.type,
    role: input.role,
    timeline: input.timeline,
    published: input.published,
    featured: input.featured,
    displayOrder: input.displayOrder,
    techStack: input.techStack,
    features: input.features,
    highlights: input.highlights,
    links: input.links,
    relatedPosts: input.relatedPosts,
    relatedSeriesSlug: input.relatedSeriesSlug,
    lang: input.lang,
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription,
    createdAt: '2026-06-24',
    updatedAt: '2026-06-24',
  };
}

class MemoryProjectAdminRepository implements ProjectAdminRepository {
  projects: AdminProject[] = [];

  async list(params: AdminProjectListParams = {}): Promise<AdminProject[]> {
    return this.projects.filter((project) => {
      if (params.published !== undefined && project.published !== params.published) return false;
      if (params.featured !== undefined && project.featured !== params.featured) return false;
      if (params.lang && project.lang !== params.lang) return false;
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase();
        return [project.title, project.slug, project.summary].some((value) =>
          value.toLowerCase().includes(keyword),
        );
      }
      return true;
    });
  }

  async getById(id: string): Promise<AdminProject | null> {
    return this.projects.find((project) => project.id === id) ?? null;
  }

  async findBySlug(slug: string): Promise<AdminProject | null> {
    return this.projects.find((project) => project.slug === slug) ?? null;
  }

  async create(input: AdminProjectInput): Promise<AdminProject> {
    const project = makeProject(input, `project-${this.projects.length + 1}`);
    this.projects.push(project);
    return project;
  }

  async update(id: string, input: AdminProjectInput): Promise<AdminProject> {
    const index = this.projects.findIndex((project) => project.id === id);
    if (index < 0) throw new Error('Project not found.');

    const next = {
      ...makeProject(input, id),
      createdAt: this.projects[index].createdAt,
    };
    this.projects[index] = next;
    return next;
  }

  async setPublished(id: string, published: boolean): Promise<AdminProject> {
    const project = this.projects.find((item) => item.id === id);
    if (!project) throw new Error('Project not found.');
    project.published = published;
    return project;
  }
}

describe('ProjectAdminService', () => {
  beforeEach(() => {
    hasDatabaseConfigMock.mockReturnValue(true);
  });

  it('returns an empty list for an empty database repository', async () => {
    const service = new ProjectAdminService(new MemoryProjectAdminRepository());

    await expect(service.listAdminProjects()).resolves.toEqual([]);
  });

  it('creates unpublished projects by default through the input contract', async () => {
    const service = new ProjectAdminService(new MemoryProjectAdminRepository());

    const project = await service.createProject(baseInput);

    expect(project).toMatchObject({
      title: 'Projects Admin MVP',
      slug: 'projects-admin-mvp',
      published: false,
      featured: false,
      contentMarkdown: '## Project\nContent',
    });
  });

  it('updates project metadata, JSON fields, and markdown content', async () => {
    const service = new ProjectAdminService(new MemoryProjectAdminRepository());
    const project = await service.createProject(baseInput);

    const updated = await service.updateProject(project.id, {
      ...baseInput,
      title: 'Updated Projects Admin',
      contentMarkdown: 'Line one\nLine two',
      featured: true,
      displayOrder: 1,
      techStack: ['Next.js', 'TypeScript', 'PostgreSQL'],
    });

    expect(updated.title).toBe('Updated Projects Admin');
    expect(updated.featured).toBe(true);
    expect(updated.displayOrder).toBe(1);
    expect(updated.techStack).toEqual(['Next.js', 'TypeScript', 'PostgreSQL']);
  });

  it('rejects duplicate slugs while allowing the current project slug during edit', async () => {
    const service = new ProjectAdminService(new MemoryProjectAdminRepository());
    const first = await service.createProject(baseInput);
    await service.createProject({ ...baseInput, slug: 'second-project', title: 'Second' });

    await expect(
      service.updateProject(first.id, { ...baseInput, slug: 'second-project' }),
    ).rejects.toBeInstanceOf(AdminProjectValidationError);

    await expect(service.updateProject(first.id, baseInput)).resolves.toMatchObject({
      slug: 'projects-admin-mvp',
    });
  });

  it('publishes and unpublishes projects', async () => {
    const service = new ProjectAdminService(new MemoryProjectAdminRepository());
    const project = await service.createProject(baseInput);

    await expect(service.publishProject(project.id)).resolves.toMatchObject({
      published: true,
    });
    await expect(service.unpublishProject(project.id)).resolves.toMatchObject({
      published: false,
    });
  });

  it('throws a clear database configuration error when database url is missing', async () => {
    hasDatabaseConfigMock.mockReturnValue(false);
    const service = new ProjectAdminService(new MemoryProjectAdminRepository());

    await expect(service.listAdminProjects()).rejects.toBeInstanceOf(
      ProjectAdminDatabaseConfigError,
    );
  });
});
