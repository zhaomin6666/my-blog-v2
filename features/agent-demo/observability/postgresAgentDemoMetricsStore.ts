import { Pool } from "pg";
import type {
  AgentDemoEventRecord,
  AgentDemoFeedbackRecord,
  AgentDemoMetricsStore,
} from "./agentDemoMetricsTypes";

let pool: Pool | undefined;

function getDatabaseUrl(): string | undefined {
  return process.env.AGENT_DEMO_DATABASE_URL?.trim();
}

function getPool(): Pool | undefined {
  const connectionString = getDatabaseUrl();
  if (!connectionString) return undefined;

  if (!pool) {
    pool = new Pool({
      connectionString,
      max: 3,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    });
  }

  return pool;
}

export function hasAgentDemoDatabaseConfig(): boolean {
  return Boolean(getDatabaseUrl());
}

export class PostgresAgentDemoMetricsStore implements AgentDemoMetricsStore {
  async insertEvent(record: AgentDemoEventRecord): Promise<void> {
    const activePool = getPool();
    if (!activePool) return;

    await activePool.query(
      `
        insert into agent_demo_events (
          request_id,
          event_type,
          allowed,
          category,
          locale,
          latency_ms,
          source_count,
          trace_step_count,
          trace_ok,
          error_type,
          question_hash,
          ip_hash
        )
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      `,
      [
        record.requestId,
        record.eventType,
        record.allowed,
        record.category,
        record.locale,
        record.latencyMs,
        record.sourceCount,
        record.traceStepCount,
        record.traceOk,
        record.errorType ?? null,
        record.questionHash ?? null,
        record.ipHash ?? null,
      ],
    );
  }

  async hasEvent(requestId: string): Promise<boolean> {
    const activePool = getPool();
    if (!activePool) return false;

    const result = await activePool.query<{ exists: boolean }>(
      "select exists(select 1 from agent_demo_events where request_id = $1) as exists",
      [requestId],
    );

    return Boolean(result.rows[0]?.exists);
  }

  async insertFeedback(record: AgentDemoFeedbackRecord): Promise<void> {
    const activePool = getPool();
    if (!activePool) return;

    await activePool.query(
      `
        insert into agent_demo_feedback (
          request_id,
          feedback,
          category,
          ip_hash
        )
        values ($1, $2, $3, $4)
        on conflict (request_id) do update set
          feedback = excluded.feedback,
          category = excluded.category,
          ip_hash = excluded.ip_hash
      `,
      [
        record.requestId,
        record.feedback,
        record.category ?? null,
        record.ipHash ?? null,
      ],
    );
  }
}

const defaultStore = new PostgresAgentDemoMetricsStore();

export function getAgentDemoMetricsStore(): AgentDemoMetricsStore {
  return defaultStore;
}
