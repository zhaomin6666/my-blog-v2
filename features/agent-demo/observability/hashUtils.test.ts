import { afterEach, describe, expect, it, vi } from "vitest";
import { hashAgentDemoValue, isUuid } from "./hashUtils";

describe("agent demo hash utils", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("hashes values with the server-side salt without returning the original value", () => {
    vi.stubEnv("AGENT_DEMO_HASH_SALT", "test-salt");

    const firstHash = hashAgentDemoValue("secret question");
    const secondHash = hashAgentDemoValue("secret question");

    expect(firstHash).toBe(secondHash);
    expect(firstHash).toHaveLength(64);
    expect(firstHash).not.toBe("secret question");
  });

  it("returns undefined for empty values", () => {
    expect(hashAgentDemoValue("  ")).toBeUndefined();
    expect(hashAgentDemoValue(undefined)).toBeUndefined();
  });

  it("validates UUID values", () => {
    expect(isUuid("11111111-1111-4111-8111-111111111111")).toBe(true);
    expect(isUuid("agent-not-a-uuid")).toBe(false);
  });
});
