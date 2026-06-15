import type { LocalizedText } from "@/lib/types";

export function normalizeSearchText(value: string): string {
  return value.toLowerCase().trim();
}

export function splitSearchTerms(query: string): string[] {
  return normalizeSearchText(query)
    .split(/\s+/)
    .map((term) => term.trim())
    .filter(Boolean);
}

export function stripMarkdown(value: string): string {
  return value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/[#>*_~|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function truncateText(value: string, maxLength = 280): string {
  const normalized = value.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) return normalized;

  return `${normalized.slice(0, maxLength).trim()}...`;
}

export function pickLocalizedText(value: LocalizedText, locale: "zh" | "en"): string {
  return value[locale] || value.zh || value.en;
}

export function scoreTextMatch(query: string, values: string[]): number {
  const terms = splitSearchTerms(query);
  const haystack = normalizeSearchText(values.filter(Boolean).join(" "));

  if (!terms.length) return 0;

  return terms.reduce((score, term) => {
    if (haystack.includes(term)) return score + 2;
    return score;
  }, 0);
}
