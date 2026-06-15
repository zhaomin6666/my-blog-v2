import { describe, expect, it } from "vitest";
import { AGENT_DEMO_MAX_INPUT_LENGTH } from "./agentDemoConfig";
import { validateAgentDemoRequest } from "./inputValidator";

describe("validateAgentDemoRequest", () => {
  it("trims a valid question and defaults locale to zh", () => {
    const result = validateAgentDemoRequest({ question: "  who are you?  " });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.request).toEqual({
      question: "who are you?",
      locale: "zh",
    });
  });

  it("accepts explicit en locale", () => {
    const result = validateAgentDemoRequest({
      question: "Tell me about AI Agent Demo",
      locale: "en",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.request.locale).toBe("en");
  });

  it("rejects empty questions", () => {
    const result = validateAgentDemoRequest({ question: "   " });

    expect(result).toMatchObject({
      ok: false,
      code: "empty_question",
    });
  });

  it("rejects unsupported locale values", () => {
    const result = validateAgentDemoRequest({
      question: "hello",
      locale: "fr",
    });

    expect(result).toMatchObject({
      ok: false,
      code: "invalid_locale",
    });
  });

  it("rejects questions over the configured max length", () => {
    const result = validateAgentDemoRequest({
      question: "a".repeat(AGENT_DEMO_MAX_INPUT_LENGTH + 1),
    });

    expect(result).toMatchObject({
      ok: false,
      code: "question_too_long",
    });
  });

  it("rejects unexpected payload keys", () => {
    const result = validateAgentDemoRequest({
      question: "hello",
      role: "admin",
    });

    expect(result).toMatchObject({
      ok: false,
      code: "invalid_payload",
    });
  });
});
