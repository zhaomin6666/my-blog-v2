import 'server-only';

import { hasPersonalSiteDatabaseConfig } from './dbConfig';
import { queryPostgres } from './postgres';

export type DatabaseHealthStatus = 'connected' | 'unavailable' | 'not_configured';

export interface DatabaseHealthCheckResult {
  status: DatabaseHealthStatus;
  errorType?: 'configuration' | 'connection' | 'query';
}

export async function checkDatabaseHealth(): Promise<DatabaseHealthCheckResult> {
  if (!hasPersonalSiteDatabaseConfig()) {
    return {
      status: 'not_configured',
      errorType: 'configuration',
    };
  }

  try {
    await queryPostgres('select 1 as ok');
    return { status: 'connected' };
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    const errorType = /connect|timeout|econn|password|auth|database/i.test(message)
      ? 'connection'
      : 'query';

    return {
      status: 'unavailable',
      errorType,
    };
  }
}

