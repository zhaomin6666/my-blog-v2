import { FileBlogRepository } from '@/lib/blog/file-blog-repository';
import type { BlogRepository } from '@/lib/blog/blog-repository';
import { DatabaseBlogRepository } from '@/lib/blog/database-blog-repository';
import { FileProjectRepository } from '@/lib/projects/file-project-repository';
import type { ProjectRepository } from '@/lib/projects/project-repository';
import { DatabaseProjectRepository } from '@/lib/projects/database-project-repository';
import { FileProfileRepository } from '@/lib/profile/file-profile-repository';
import type { ProfileRepository } from '@/lib/profile/profile-repository';
import { DatabaseProfileRepository } from '@/lib/profile/database-profile-repository';
import { getPersonalSiteDatabaseUrl } from '@/lib/db/dbConfig';
import {
  assertDatabaseContentSourceConfig,
  getContentSource,
  type ContentDomain,
  type ContentSource,
} from './contentSourceConfig';

export { getContentSource };
export type { ContentDomain, ContentSource };

function assertDatabaseConfig(domain: ContentDomain): void {
  assertDatabaseContentSourceConfig(domain, getPersonalSiteDatabaseUrl());
}

export function getBlogRepository(): BlogRepository {
  const source = getContentSource('blog');

  if (source === 'database') {
    assertDatabaseConfig('blog');
    return new DatabaseBlogRepository();
  }

  return new FileBlogRepository();
}

export function getProjectRepository(): ProjectRepository {
  const source = getContentSource('project');

  if (source === 'database') {
    assertDatabaseConfig('project');
    return new DatabaseProjectRepository();
  }

  return new FileProjectRepository();
}

export function getProfileRepository(): ProfileRepository {
  const source = getContentSource('profile');

  if (source === 'database') {
    assertDatabaseConfig('profile');
    return new DatabaseProfileRepository();
  }

  return new FileProfileRepository();
}
