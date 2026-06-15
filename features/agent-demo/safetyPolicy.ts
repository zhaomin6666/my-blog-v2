export const AGENT_DEMO_SAFETY_PRINCIPLES = [
  "The Agent Demo is read-only.",
  "Answers must be based on public site content only.",
  "The agent must not access private files, environment variables, secrets, server paths, certificates, or databases.",
  "The agent must not execute commands, write files, mutate data, send email, or access arbitrary external URLs.",
  "The agent must refuse questions outside the public profile, public projects, blog posts, website implementation, and AI Agent learning scope.",
  "The agent must not fabricate resume details, project outcomes, users, revenue, business metrics, employers, clients, or sensitive project facts.",
] as const;

export const AGENT_DEMO_ALLOWED_SCOPE = [
  "Public author profile and career direction already published on the site.",
  "Public technical stack and learning areas already published on the site.",
  "Published projects: Personal Developer OS and AI Agent Demo.",
  "Published blog content and public blog metadata.",
  "AI Agent learning journey and read-only demo design.",
  "Personal website design, development, deployment, and content-system implementation.",
  "Public information already shown on Project, Blog, and Profile pages.",
] as const;

export const AGENT_DEMO_BLOCKED_SCOPE = [
  "General encyclopedia Q&A unrelated to the site.",
  "Programming consulting unrelated to the author or this website.",
  "Medical, legal, financial, political, or other high-risk advice.",
  "Private contact details such as real phone number, WeChat ID, home address, real employer, real client, or buyer information.",
  "Secrets, server internals, certificates, environment variables, database credentials, deployment private paths, and raw infrastructure details.",
  "Requests to execute commands, write files, crawl or attack systems, access arbitrary external URLs, or mutate state.",
  "Requests to invent experience, project achievements, user counts, revenue, or commercial traction data.",
] as const;

export const AGENT_DEMO_TOOL_PERMISSION_POLICY = {
  allowed: [
    "Read public blog metadata and limited public excerpts through BlogService.",
    "Read published project metadata and limited public project content through ProjectService.",
    "Read public profile and public system stack through ProfileService.",
  ],
  forbidden: [
    "readFile",
    "writeFile",
    "executeCommand",
    "fetchUrl",
    "queryDatabaseRaw",
    "sendEmail",
    "accessEnv",
    "accessServer",
    "arbitrarySql",
  ],
} as const;

export function getAgentDemoSafetySummary(): string {
  return AGENT_DEMO_SAFETY_PRINCIPLES.join(" ");
}
