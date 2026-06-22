import { afterEach, describe, expect, it, vi } from "vitest";
import {
  assertDatabaseContentSourceConfig,
  getContentSource,
} from "./contentSourceConfig";

describe("contentSource", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("defaults each content domain to file mode", () => {
    vi.stubEnv("CONTENT_SOURCE", "");
    vi.stubEnv("BLOG_CONTENT_SOURCE", "");

    expect(getContentSource("blog")).toBe("file");
    expect(getContentSource("project")).toBe("file");
    expect(getContentSource("profile")).toBe("file");
  });

  it("uses the global source when a domain source is absent", () => {
    vi.stubEnv("CONTENT_SOURCE", "database");
    vi.stubEnv("BLOG_CONTENT_SOURCE", "");

    expect(getContentSource("blog")).toBe("database");
  });

  it("lets the domain source override the global source", () => {
    vi.stubEnv("CONTENT_SOURCE", "database");
    vi.stubEnv("PROJECT_CONTENT_SOURCE", "file");

    expect(getContentSource("project")).toBe("file");
  });

  it("rejects invalid source values", () => {
    vi.stubEnv("PROFILE_CONTENT_SOURCE", "cms");

    expect(() => getContentSource("profile")).toThrow(
      'PROFILE_CONTENT_SOURCE must be "file" or "database"',
    );
  });

  it("rejects database mode when the connection string is missing", () => {
    expect(() => assertDatabaseContentSourceConfig("profile", "")).toThrow(
      'PROFILE_CONTENT_SOURCE or CONTENT_SOURCE selected "database", but PERSONAL_SITE_DATABASE_URL is not configured.',
    );
  });

  it("does not require a database connection string for file mode", () => {
    vi.stubEnv("CONTENT_SOURCE", "file");
    vi.stubEnv("PERSONAL_SITE_DATABASE_URL", "");

    expect(getContentSource("profile")).toBe("file");
  });
});
