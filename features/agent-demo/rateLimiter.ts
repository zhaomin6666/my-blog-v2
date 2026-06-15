import {
  AGENT_DEMO_DEFAULT_RATE_LIMIT_MAX_REQUESTS,
  AGENT_DEMO_DEFAULT_RATE_LIMIT_WINDOW_MS,
} from "./agentDemoConfig";

export interface AgentDemoRateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  windowMs: number;
}

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, RateLimitBucket>();

function parsePositiveInteger(value: string | undefined, fallback: number): number {
  if (!value) return fallback;

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function getAgentDemoRateLimitConfig() {
  return {
    windowMs: parsePositiveInteger(
      process.env.AGENT_DEMO_RATE_LIMIT_WINDOW_MS,
      AGENT_DEMO_DEFAULT_RATE_LIMIT_WINDOW_MS,
    ),
    maxRequests: parsePositiveInteger(
      process.env.AGENT_DEMO_RATE_LIMIT_MAX_REQUESTS,
      AGENT_DEMO_DEFAULT_RATE_LIMIT_MAX_REQUESTS,
    ),
  };
}

export function getAgentDemoClientIdentifier(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const firstForwardedIp = forwardedFor?.split(",")[0]?.trim();

  return (
    firstForwardedIp ||
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("cf-connecting-ip")?.trim() ||
    "local"
  );
}

export function checkAgentDemoRateLimit(
  identifier: string,
  now = Date.now(),
): AgentDemoRateLimitResult {
  const { maxRequests, windowMs } = getAgentDemoRateLimitConfig();
  const existing = buckets.get(identifier);

  if (!existing || existing.resetAt <= now) {
    buckets.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });

    return {
      allowed: true,
      limit: maxRequests,
      remaining: Math.max(0, maxRequests - 1),
      resetAt: now + windowMs,
      windowMs,
    };
  }

  if (existing.count >= maxRequests) {
    return {
      allowed: false,
      limit: maxRequests,
      remaining: 0,
      resetAt: existing.resetAt,
      windowMs,
    };
  }

  existing.count += 1;

  return {
    allowed: true,
    limit: maxRequests,
    remaining: Math.max(0, maxRequests - existing.count),
    resetAt: existing.resetAt,
    windowMs,
  };
}

export function resetAgentDemoRateLimitForTests(): void {
  buckets.clear();
}
