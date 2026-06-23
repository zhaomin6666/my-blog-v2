import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { QueryResult, QueryResultRow } from 'pg';

vi.mock('@/lib/db/postgres', () => ({
  queryPostgres: vi.fn(async () => emptyQueryResult()),
}));

vi.mock('server-only', () => ({}));

function emptyQueryResult<T extends QueryResultRow>(): QueryResult<T> {
  return {
    command: 'SELECT',
    rowCount: 0,
    oid: 0,
    fields: [],
    rows: [],
  };
}

const { queryPostgres } = await import('@/lib/db/postgres');
const queryPostgresMock = vi.mocked(queryPostgres);
const { DatabaseBlogRepository } = await import('./database-blog-repository');

describe('DatabaseBlogRepository public visibility', () => {
  beforeEach(() => {
    queryPostgresMock.mockClear();
    queryPostgresMock.mockResolvedValue(emptyQueryResult());
  });

  it('queries published posts only by default', async () => {
    const repository = new DatabaseBlogRepository();

    await repository.getAllPosts();

    const [sql] = queryPostgresMock.mock.calls[0];
    expect(sql).toContain("status = 'published'");
    expect(sql).toContain('deleted_at is null');
  });

  it('allows draft lookup only when includeDrafts is explicit', async () => {
    const repository = new DatabaseBlogRepository();

    await repository.getPostBySlug('draft-post', { includeDrafts: true });

    const [sql, values] = queryPostgresMock.mock.calls[0];
    expect(sql).toContain("status in ('draft', 'published')");
    expect(sql).toContain('deleted_at is null');
    expect(values).toEqual(['draft-post']);
  });
});
