/**
 * Tag slug generation utility.
 *
 * Converts human-readable tag names into URL-safe slugs for
 * `/blog/tags/[tagSlug]` routes.
 *
 * Rules:
 * - Lowercase
 * - Replace spaces and dots with hyphens
 * - Collapse consecutive hyphens
 * - Strip leading/trailing hyphens
 * - Keep alphanumeric and hyphens only
 *
 * Examples:
 *   "Next.js"        -> "next-js"
 *   "AI Agent"       -> "ai-agent"
 *   "Vibe Coding"    -> "vibe-coding"
 *   "LangGraph.js"   -> "langgraph-js"
 *   "Docker"         -> "docker"
 */

export function tagToSlug(tag: string): string {
  return tag
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')  // replace non-alphanumeric runs with hyphen
    .replace(/^-+|-+$/g, '');      // strip leading/trailing hyphens
}

/**
 * Build a reverse-lookup map from slug -> original tag name.
 *
 * If two different tags produce the same slug, the first tag encountered
 * (by alphabetical order) wins. A warning is logged in development.
 */
export function buildTagSlugMap(tags: string[]): Map<string, string> {
  const slugToName = new Map<string, string>();

  // Sort alphabetically for deterministic conflict resolution
  const sorted = [...tags].sort();

  for (const tag of sorted) {
    const slug = tagToSlug(tag);
    if (!slugToName.has(slug)) {
      slugToName.set(slug, tag);
    } else if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `[tag-slug] Duplicate slug "${slug}" from tags "${slugToName.get(slug)}" and "${tag}". Using the first.`,
      );
    }
  }

  return slugToName;
}
