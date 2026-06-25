import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

vi.mock('./dbConfig', () => ({
  hasPersonalSiteDatabaseConfig: vi.fn(),
}));

vi.mock('./postgres', () => ({
  queryPostgres: vi.fn(),
}));

const { checkDatabaseHealth } = await import('./database-health-check');
const { hasPersonalSiteDatabaseConfig } = await import('./dbConfig');
const { queryPostgres } = await import('./postgres');

const hasDatabaseConfigMock = vi.mocked(hasPersonalSiteDatabaseConfig);
const queryPostgresMock = vi.mocked(queryPostgres);

describe('checkDatabaseHealth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns not_configured without querying PostgreSQL', async () => {
    hasDatabaseConfigMock.mockReturnValue(false);

    await expect(checkDatabaseHealth()).resolves.toEqual({
      status: 'not_configured',
      errorType: 'configuration',
    });
    expect(queryPostgresMock).not.toHaveBeenCalled();
  });

  it('returns connected for select 1 success', async () => {
    hasDatabaseConfigMock.mockReturnValue(true);
    queryPostgresMock.mockResolvedValue({ rows: [{ ok: 1 }] } as never);

    await expect(checkDatabaseHealth()).resolves.toEqual({ status: 'connected' });
  });

  it('returns a safe unavailable result without leaking connection details', async () => {
    hasDatabaseConfigMock.mockReturnValue(true);
    queryPostgresMock.mockRejectedValue(
      new Error('password authentication failed for user "postgres" at postgres://secret@host/db'),
    );

    const result = await checkDatabaseHealth();

    expect(result).toEqual({ status: 'unavailable', errorType: 'connection' });
    expect(JSON.stringify(result)).not.toContain('secret');
    expect(JSON.stringify(result)).not.toContain('postgres://');
  });
});

