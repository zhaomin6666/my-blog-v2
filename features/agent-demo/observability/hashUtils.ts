import { createHash } from "node:crypto";

export function isAgentDemoObservabilityEnabled(): boolean {
  const configuredValue = process.env.AGENT_DEMO_OBSERVABILITY_ENABLED;
  return configuredValue?.trim().toLowerCase() !== "false";
}

export function hashAgentDemoValue(value: string | undefined | null): string | undefined {
  const normalizedValue = value?.trim();
  if (!normalizedValue) return undefined;

  const salt = process.env.AGENT_DEMO_HASH_SALT ?? "";
  return createHash("sha256")
    .update(`${salt}:${normalizedValue}`)
    .digest("hex");
}

export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}
