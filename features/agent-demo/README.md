# AI Agent Demo Foundation

This directory contains the Phase 10 foundation for the public AI Agent Demo.

The demo is intentionally designed as a read-only, scope-limited agent for the
Personal Developer OS website. It is not a general chatbot.

## Current Phase

Phase 10.1 defines:

- Request / response / trace / source types
- Static configuration
- Input validation
- Trace construction helpers
- Safety and scope policy constants
- A foundation-only service response for future route integration

Phase 10.2 adds:

- Read-only Blog knowledge tools
- Read-only Project knowledge tools
- Read-only Profile knowledge tools
- A conservative rule-based scope classifier
- A public knowledge retriever that returns bounded context, public sources, and trace updates

Phase 10.3 adds:

- `POST /api/agent-demo`
- A shared Agent Demo service pipeline:
  - input validation
  - scope classification
  - public knowledge retrieval
  - server-only model answer generation
- Safe refusal for blocked scope
- Safe model configuration and upstream error handling
- Unit tests for the API service pipeline

Phase 10.4 adds:

- In-process fixed-window rate limiting for `POST /api/agent-demo`
- Client identifier detection from common proxy headers
- `429` responses with `Retry-After` when the rate limit is exceeded
- Configurable model request timeout
- Bounded context and answer output lengths
- Focused tests for rate limiting, timeout handling, and truncation

Phase 10.5 adds:

- `/agent-demo` as the public interactive demo page
- Question input, sample questions, loading, error, and rate-limit states
- Answer, trace, and public source display
- A scope notice for the public read-only boundary
- A project-page entry point through the AI Agent Demo project frontmatter

Phase 10.6 adds:

- Production environment variable guidance
- Recommended production log-level usage
- Nginx route-level rate-limit guidance for `/api/agent-demo`
- Online validation commands for safe questions, blocked questions, logs, and rate limiting

Phase 10.7 closes the first public version:

- Final acceptance for `/agent-demo` and `POST /api/agent-demo`
- English and Chinese architecture / deployment documentation alignment
- Confirmation that the first version remains read-only and public-content-only

Required server-only environment variables:

- `AGENT_DEMO_MODEL_API_URL`
- `AGENT_DEMO_MODEL_API_KEY`
- `AGENT_DEMO_MODEL`

Optional protection variables:

- `AGENT_DEMO_MODEL_TIMEOUT_MS` (default: `10000`)
- `AGENT_DEMO_RATE_LIMIT_WINDOW_MS` (default: `60000`)
- `AGENT_DEMO_RATE_LIMIT_MAX_REQUESTS` (default: `10`)
- `AGENT_DEMO_LOG_LEVEL` (default: `info`; allowed: `info`, `debug`, `silent`)

Live model tests are skipped by default. To run them locally, set:

- `AGENT_DEMO_RUN_LIVE_TEST=true`

When diagnosing upstream model latency or timeout issues, keep
`AGENT_DEMO_LOG_LEVEL=info` or use `debug` for extra payload-size summaries.
Logs intentionally avoid API keys, full prompts, full retrieved context, and raw
upstream response bodies.

## Safety Boundary

The future agent may only answer from public site content:

- Public profile content
- Public technical stack
- Published projects
- Published blog posts and metadata
- AI Agent learning journey
- Personal Developer OS design, development, deployment, and content-system notes

The agent must not:

- Access private files
- Read environment variables or secrets
- Execute commands
- Write files or databases
- Access arbitrary external URLs
- Return draft or private content
- Invent experience, project outcomes, users, revenue, or commercial metrics

## Deferred Work

The following are intentionally not implemented yet:

- Redis-backed distributed rate limiting for multi-instance production
- Optional richer evaluation / monitoring beyond the current focused tests
- Optional standalone `agent-api` service if the demo grows beyond the Next.js app
