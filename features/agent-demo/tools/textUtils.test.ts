import { describe, expect, it } from "vitest";
import {
  scoreTextMatch,
  splitSearchTerms,
  stripMarkdown,
  truncateText,
} from "./textUtils";

describe("textUtils", () => {
  it("splits repeated whitespace into search terms", () => {
    expect(splitSearchTerms("  AI   Agent Demo  ")).toEqual([
      "ai",
      "agent",
      "demo",
    ]);
  });

  it("strips common markdown syntax", () => {
    expect(stripMarkdown("## Title\n[Link](/x) and `code`")).toBe(
      "Title Link and code",
    );
  });

  it("truncates long text with an ellipsis", () => {
    expect(truncateText("abcdef", 3)).toBe("abc...");
  });

  it("scores matching terms", () => {
    expect(scoreTextMatch("agent demo", ["AI Agent Demo project"])).toBe(4);
  });
});
