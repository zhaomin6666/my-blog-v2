import 'server-only';
import { Pool, type QueryResult, type QueryResultRow } from 'pg';
import { getPersonalSiteDatabaseUrl, PERSONAL_SITE_DATABASE_URL_ENV } from './dbConfig';

let pool: Pool | undefined;

export function getPostgresPool(): Pool {
  const connectionString = getPersonalSiteDatabaseUrl();

  if (!connectionString) {
    throw new Error(
      `${PERSONAL_SITE_DATABASE_URL_ENV} is required when database content source is enabled.`,
    );
  }

  if (!pool) {
    pool = new Pool({
      connectionString,
      max: 5,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    });
  }

  return pool;
}

export async function queryPostgres<T extends QueryResultRow>(
  text: string,
  values: unknown[] = [],
): Promise<QueryResult<T>> {
  return getPostgresPool().query<T>(text, values);
}
