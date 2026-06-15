import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  checkAgentDemoRateLimit,
  getAgentDemoClientIdentifier,
  resetAgentDemoRateLimitForTests,
} from "./rateLimiter";

const originalEnv = process.env;

describe("rateLimiter", () => {
  beforeEach(() => {
    process.env = {
      ...originalEnv,
      AGENT_DEMO_RATE_LIMIT_WINDOW_MS: "1000",
      AGENT_DEMO_RATE_LIMIT_MAX_REQUESTS: "2",
    };
    resetAgentDemoRateLimitForTests();
  });

  afterEach(() => {
    resetAgentDemoRateLimitForTests();
    process.env = originalEnv;
  });

  it("allows requests within the configured window limit", () => {
    const first = checkAgentDemoRateLimit("client-a", 1000);
    const second = checkAgentDemoRateLimit("client-a", 1100);

    expect(first).toMatchObject({
      allowed: true,
      remaining: 1,
      limit: 2,
    });
    expect(second).toMatchObject({
      allowed: true,
      remaining: 0,
      limit: 2,
    });
  });

  it("blocks requests after the configured window limit", () => {
    checkAgentDemoRateLimit("client-a", 1000);
    checkAgentDemoRateLimit("client-a", 1100);

    const blocked = checkAgentDemoRateLimit("client-a", 1200);

    expect(blocked).toMatchObject({
      allowed: false,
      remaining: 0,
      limit: 2,
      resetAt: 2000,
    });
  });

  it("resets the bucket after the window expires", () => {
    checkAgentDemoRateLimit("client-a", 1000);
    checkAgentDemoRateLimit("client-a", 1100);

    const nextWindow = checkAgentDemoRateLimit("client-a", 2000);

    expect(nextWindow).toMatchObject({
      allowed: true,
      remaining: 1,
      resetAt: 3000,
    });
  });

  it("uses the first forwarded IP as the client identifier", () => {
    const request = new Request("https://example.com/api/agent-demo", {
      headers: {
        "x-forwarded-for": "203.0.113.10, 10.0.0.1",
      },
    });

    expect(getAgentDemoClientIdentifier(request)).toBe("203.0.113.10");
  });
});
