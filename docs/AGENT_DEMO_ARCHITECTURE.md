# Agent Demo Architecture

## First Version Goal

Phase 10 upgrades `AI Agent Demo` from a project introduction into a real,
interactive, read-only Agent Demo. The first version must stay tightly scoped:
it answers only from public website content and exposes its trace and sources
to make the boundary understandable.

Phase 10.1 added the safety foundation. Phase 10.2 added read-only knowledge
tools, a rule-based scope classifier, and a public knowledge retriever. Phase
10.2.1 added focused unit tests. Phase 10.3 adds the read-only API MVP with a
server-only model adapter. Phase 10.4 adds in-process rate limiting, model
timeouts, and bounded context / output controls. Phase 10.5 adds the public
`/agent-demo` UI with answer, trace, sources, scope notice, loading, error, and
rate-limit states. Phase 10.6 adds production environment, log-level, Nginx
rate-limit, and online safety verification guidance. Phase 10.7 completes the
first-version public acceptance review. The demo still does not connect Redis
or change tracked Docker / Nginx deployment files.

Phase 11.1 adds privacy-safe observability and feedback. The API now returns a
random UUID `requestId`, records a minimal PostgreSQL event summary when
observability is enabled, and exposes a button-only feedback API. It still does
not store full questions, full answers, raw prompts, raw retrieved context, raw
trace details, plaintext IPs, or raw request headers.

## Public Scope

The demo may answer questions about:

- Public author profile and career direction already shown on the site.
- Public technical stack and learning areas.
- Published projects: `Personal Developer OS` and `AI Agent Demo`.
- Published blog posts, series, tags, summaries, and limited excerpts.
- AI Agent learning journey and the design of this read-only demo.
- Personal website design, development, deployment, SEO, RSS, and content system.
- Public information already present on Project, Blog, and Profile pages.

## Forbidden Scope

The demo must refuse:

- General encyclopedia questions unrelated to the site.
- Programming consulting unrelated to the author or this website.
- Medical, legal, financial, political, or other high-risk advice.
- Private contact information such as real phone number, WeChat ID, home address,
  real employer, real client, or buyer information.
- Secrets, certificates, environment variables, database credentials, server
  paths, raw logs, or infrastructure internals.
- Requests to execute commands, write files, crawl arbitrary URLs, attack systems,
  send email, or mutate state.
- Requests to invent experience, project outcomes, user counts, revenue, or
  commercial traction.

## API Design

The API route is:

```text
POST /api/agent-demo
```

Request body:

```json
{
  "question": "string",
  "locale": "zh"
}
```

Response body:

```json
{
  "requestId": "11111111-1111-4111-8111-111111111111",
  "answer": "string",
  "allowed": true,
  "category": "project",
  "trace": [],
  "sources": [],
  "usage": {
    "inputLength": 24,
    "maxInputLength": 800,
    "sourceCount": 2,
    "maxSources": 5
  }
}
```

The route handler should only parse the request, call shared validators and the
agent service, then return JSON. Business logic should stay in
`features/agent-demo`.

Phase 10.3 implements this route at `app/api/agent-demo/route.ts`.

Feedback route:

```text
POST /api/agent-demo/feedback
```

Request body:

```json
{
  "requestId": "11111111-1111-4111-8111-111111111111",
  "feedback": "helpful"
}
```

Allowed `feedback` values are `helpful` and `not_helpful`. Free-text fields
such as `reason`, `message`, or `text` are rejected. Successful responses return
`{ "ok": true }`; failures return a safe `{ "ok": false, "error": "..." }`
without database details.

## Safety Boundary

The agent is read-only:

- It can use only public knowledge tools.
- It cannot call write tools.
- It cannot access private files.
- It cannot read environment variables except server-side model configuration:
  `AGENT_DEMO_MODEL_API_URL`, `AGENT_DEMO_MODEL_API_KEY`, and `AGENT_DEMO_MODEL`.
- It cannot fetch arbitrary external URLs.
- It cannot store full conversations.
- It cannot expose raw errors, stack traces, secrets, or infrastructure details.

## Tool Permissions

Allowed tools:

- `BlogService`: published posts and limited public excerpts only.
- `ProjectService`: published projects only.
- `ProfileService`: public profile and public system stack only.

Phase 10.2 implements wrappers around those services under
`features/agent-demo/tools`. The wrappers return bounded context snippets and
public `sources`; they do not expose raw file paths or draft content.

Forbidden tools:

- `readFile`
- `writeFile`
- `executeCommand`
- `fetchUrl`
- `queryDatabaseRaw`
- `sendEmail`
- `accessEnv`
- `accessServer`
- `arbitrarySql`

## Rate Limit Strategy

Phase 10.4 implements the first application-level protection layer:

- Fixed-window per-client limits using `x-forwarded-for`, `x-real-ip`, `cf-connecting-ip`, then `local` fallback.
- In-process buckets for the current self-hosted / single-instance shape.
- Configurable model call timeout through `AGENT_DEMO_MODEL_TIMEOUT_MS`.
- Configurable rate-limit window and max requests through `AGENT_DEMO_RATE_LIMIT_WINDOW_MS` and `AGENT_DEMO_RATE_LIMIT_MAX_REQUESTS`.
- Input length limit, currently defined as 800 characters.
- Context length limit, currently defined as 6000 characters.
- Output length limit, currently defined as 1800 characters.
- Source count limit, currently defined as 5 sources.
- `429` response with `Retry-After` when the API is rate limited.
- Server-side diagnostic logs controlled by `AGENT_DEMO_LOG_LEVEL`.

Redis-backed persistent / distributed rate limiting is intentionally deferred
until the demo needs multi-instance production behavior.

## Diagnostic Logging

Agent Demo server logs use the `[agent-demo]` prefix and are controlled by:

- `AGENT_DEMO_LOG_LEVEL=info` (default): request lifecycle, scope category,
  retrieval source count / context length, model request duration, upstream
  status, timeout, and safe error code.
- `AGENT_DEMO_LOG_LEVEL=debug`: includes additional payload-size summaries.
- `AGENT_DEMO_LOG_LEVEL=silent`: disables Agent Demo logs.

Logs must not include API keys, full prompts, full retrieved context, full model
answers, raw upstream response bodies, private environment values, or server
paths.

## Observability And Feedback

Phase 11.1 uses PostgreSQL for minimal event and feedback storage. The app does
not auto-migrate tables; run the SQL manually in production before enabling
storage.

Environment variables:

```text
AGENT_DEMO_OBSERVABILITY_ENABLED=true
AGENT_DEMO_HASH_SALT=<server-side-random-salt>
AGENT_DEMO_DATABASE_URL=postgres://...
```

If observability is disabled, `AGENT_DEMO_DATABASE_URL` is missing, or
PostgreSQL is unavailable, the Agent Demo still returns its normal response.
The failure is recorded only as a safe server log.

Stored event fields:

- `request_id`
- `event_type`: `request_completed`, `request_blocked`, `request_rate_limited`, or `request_error`
- `allowed`
- `category`
- `locale`
- `latency_ms`
- `source_count`
- `trace_step_count`
- `trace_ok`
- `error_type`
- `question_hash`
- `ip_hash`

Stored feedback fields:

- `request_id`
- `feedback`: `helpful` or `not_helpful`
- `category`
- `ip_hash`

Never store:

- full `question`
- full `answer`
- plaintext IP
- raw User-Agent or raw headers
- prompt or retrieved context
- full trace detail
- secrets, environment values, server paths, private contact data, employer names, client names, or buyer names

PostgreSQL schema:

```sql
create table if not exists agent_demo_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  request_id uuid not null,
  event_type text not null check (
    event_type in (
      'request_completed',
      'request_blocked',
      'request_rate_limited',
      'request_error'
    )
  ),
  allowed boolean not null,
  category text not null,
  locale text not null,
  latency_ms integer not null,
  source_count integer not null,
  trace_step_count integer not null,
  trace_ok boolean not null,
  error_type text,
  question_hash text,
  ip_hash text
);

create unique index if not exists agent_demo_events_request_id_idx
  on agent_demo_events (request_id);

create index if not exists agent_demo_events_created_at_idx
  on agent_demo_events (created_at desc);

create index if not exists agent_demo_events_category_idx
  on agent_demo_events (category);

create table if not exists agent_demo_feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  request_id uuid not null references agent_demo_events(request_id) on delete cascade,
  feedback text not null check (feedback in ('helpful', 'not_helpful')),
  category text,
  ip_hash text
);

create unique index if not exists agent_demo_feedback_request_id_idx
  on agent_demo_feedback (request_id);

create index if not exists agent_demo_feedback_created_at_idx
  on agent_demo_feedback (created_at desc);
```

## Production Safety Verification

Before enabling `/agent-demo` publicly, verify:

- `.env.production` contains model API URL, API key, model name, timeout, rate
  limit, and log-level values.
- `.env.production` is not tracked by Git.
- `AGENT_DEMO_LOG_LEVEL=info` is used by default in production.
- The Nginx reverse proxy applies a route-level limit to `/api/agent-demo`.
- Safe public questions return `allowed: true` and include trace / sources.
- Private, secret, server-internal, dangerous-action, and high-risk-advice
  questions return a refusal before model generation.
- Repeated requests eventually return `429`.
- Upstream timeout returns `upstream_timeout` / HTTP `504` without raw upstream
  details.
- Logs contain `[agent-demo]` request IDs and safe stage summaries only.
- Sitemap includes `/agent-demo`, while RSS remains blog-post-only.

## Final Acceptance

Phase 10.7 closes the first public Agent Demo version with the following
acceptance result:

- `/agent-demo` exists as a public interactive page.
- `POST /api/agent-demo` exists and returns the stable Agent Demo response
  shape.
- The demo stays limited to public Profile, stack, Projects, Blog, AI Agent
  learning, and Personal Developer OS implementation content.
- Private data, secrets, server internals, dangerous actions, and high-risk
  advice are refused before model generation.
- The model adapter uses server-only OpenAI-compatible Chat Completions
  configuration.
- Input validation, source limits, context limits, output limits, timeout
  handling, app-level rate limiting, and Nginx rate-limit guidance are
  documented.
- Safe logs are controlled by `AGENT_DEMO_LOG_LEVEL`.
- API and UI expose trace steps and public sources.
- Sitemap includes `/agent-demo`; RSS remains blog-post-only.
- Live model testing remains opt-in through `AGENT_DEMO_RUN_LIVE_TEST=true`.
- English and Chinese docs now cover the architecture, safety boundary,
  deployment configuration, and final acceptance checklist.

## Phase 11.1 Acceptance

Phase 11.1 was accepted on 2026-06-21 as the baseline for Agent Demo
observability and feedback:

- `POST /api/agent-demo` returns a UUID `requestId` on every response path.
- Minimal PostgreSQL events and button-only feedback are documented and wired.
- Stored data stays limited to privacy-safe event metadata, hashes, and feedback
  values.
- Full questions, answers, prompts, context, trace details, raw headers, and
  plaintext IP addresses are intentionally not stored.
- Observability failures degrade to safe server logs and do not block Agent Demo
  answers.
- Console / CLI, the window system, the Agent answer scope, and tracked
  Docker / Nginx config remain unchanged.

## Trace Contract

Every response should include trace steps:

- `input_validation`
- `rate_limit_check`
- `scope_check`
- `retrieve_context`
- `generate_answer`

Each step has:

- `step`
- `label`
- `status`: `pending`, `passed`, `blocked`, or `failed`
- optional `detail`

## Sources Contract

Sources must be public and bounded:

- `type`: `blog`, `project`, `profile`, or `system`
- `title`
- optional `url`
- optional short `excerpt`

Sources must not include draft content, private paths, raw Markdown file paths,
or private infrastructure data.

## Scope Classifier

Phase 10.2 uses a rule-based keyword classifier. It returns:

- `allowed`
- `category`
- `reason`

Allowed categories:

- `profile`
- `project`
- `blog`
- `agent_learning`
- `website`
- `contact_public`

Blocked categories:

- `out_of_scope`
- `privacy`
- `security`
- `server_internal`
- `dangerous_action`
- `high_risk_advice`

This classifier is intentionally conservative and can be replaced or augmented
later, but model-based classification is not required for Phase 10.2.

## Future Phases

- Phase 10.2: Read-only knowledge tools and rule-based scope classifier. Completed.
- Phase 10.2.1: Agent Demo unit test foundation. Completed.
- Phase 10.3: Read-only Agent API MVP with model integration. Completed.
- Phase 10.4: Rate limit, timeout, and abuse protection. Completed.
- Phase 10.5: Agent Demo UI and trace display. Completed.
- Phase 10.6: Production deployment and safety verification guide. Completed.
- Phase 10.7: Final Phase 10 review. Completed.
- Phase 11.1: Agent Demo observability and feedback. Completed.
- Phase 11.2: Admin / CMS architecture design. Completed in
  `docs/ADMIN_CMS_DESIGN.md`. Agent Demo keeps reading public content through
  BlogService / ProjectService / ProfileService.
- Later Agent Demo quality, suggested-question, and trace UX improvements are
  deferred until they are planned separately from the Admin / CMS migration.

## Standalone Agent API Option

The first implementation can live inside the Next.js app because it is small and
read-only. If usage or operational complexity grows, the agent can later be split
into a separate `agent-api` service with its own rate limiting, logging, model
configuration, and deployment lifecycle.
