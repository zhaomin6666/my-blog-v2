type AgentDemoLogLevel = "silent" | "info" | "debug";

type AgentDemoLogMeta = Record<
  string,
  string | number | boolean | null | undefined
>;

const LOG_PREFIX = "[agent-demo]";

function getLogLevel(): AgentDemoLogLevel {
  const configuredLevel = process.env.AGENT_DEMO_LOG_LEVEL?.trim().toLowerCase();

  if (configuredLevel === "silent" || configuredLevel === "debug") {
    return configuredLevel;
  }

  return "info";
}

function sanitizeMeta(meta: AgentDemoLogMeta): Record<string, string | number | boolean | null> {
  return Object.fromEntries(
    Object.entries(meta)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [key, value ?? null]),
  );
}

function shouldLog(level: Exclude<AgentDemoLogLevel, "silent">): boolean {
  const configuredLevel = getLogLevel();

  if (configuredLevel === "silent") return false;
  if (level === "debug") return configuredLevel === "debug";
  return true;
}

export function createAgentDemoRequestId(): string {
  const randomPart = Math.random().toString(36).slice(2, 8);
  return `agent-${Date.now().toString(36)}-${randomPart}`;
}

export function logAgentDemoInfo(event: string, meta: AgentDemoLogMeta = {}): void {
  if (!shouldLog("info")) return;

  console.info(LOG_PREFIX, event, sanitizeMeta(meta));
}

export function logAgentDemoDebug(event: string, meta: AgentDemoLogMeta = {}): void {
  if (!shouldLog("debug")) return;

  console.debug(LOG_PREFIX, event, sanitizeMeta(meta));
}

export function logAgentDemoWarn(event: string, meta: AgentDemoLogMeta = {}): void {
  if (!shouldLog("info")) return;

  console.warn(LOG_PREFIX, event, sanitizeMeta(meta));
}
