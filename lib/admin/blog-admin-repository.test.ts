import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { QueryResult, QueryResultRow } from 'pg';

vi.mock('server-only', () => ({}));

vi.mock('@/lib/db/postgres', () => ({
  queryPostgres: vi.fn(async () => emptyQueryResult()),
}));

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
const { PostgresBlogAdminRepository } = await import('./blog-admin-repository');

describe('PostgresBlogAdminRepository soft delete', () => {
  beforeEach(() => {
    queryPostgresMock.mockClear();
    queryPostgresMock.mockResolvedValue(emptyQueryResult());
  });

  it('lists only non-deleted admin posts', async () => {
    const repository = new PostgresBlogAdminRepository();

    await repository.list();

    const [sql] = queryPostgresMock.mock.calls[0];
    expect(sql).toContain('deleted_at is null');
  });

  it('uses a parameterized soft delete update instead of hard delete', async () => {
    const repository = new PostgresBlogAdminRepository();

    await expect(
      repository.softDelete('11111111-1111-4111-8111-111111111111'),
    ).rejects.toThrow('Blog post not found.');

    const [sql, values] = queryPostgresMock.mock.calls[0];
    expect(sql).toContain('update blog_posts');
    expect(sql).toContain('set deleted_at = now()');
    expect(sql).toContain('where id = $1 and deleted_at is null');
    expect(sql.toLowerCase()).not.toContain('delete from blog_posts');
    expect(values).toEqual(['11111111-1111-4111-8111-111111111111']);
  });
});
