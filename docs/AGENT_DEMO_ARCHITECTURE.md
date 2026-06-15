# Agent Demo Architecture

## First Version Goal

Phase 10 upgrades `AI Agent Demo` from a project introduction into a real,
interactive, read-only Agent Demo. The first version must stay tightly scoped:
it answers only from public website content and exposes its trace and sources
to make the boundary understandable.

Phase 10.1 added the safety foundation. Phase 10.2 added read-only knowledge
tools, a rule-based scope classifier, and a public knowledge retriever. Phase
10.2.1 added focused unit tests. Phase 10.3 adds the read-only API MVP with a
server-only model adapter. The demo still does not add UI, connect Redis, or
change Docker / Nginx deployment files.

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

## Safety Boundary

The agent is read-only:

- It can use only public knowledge tools.
- It cannot call write tools.
- It cannot access private files.
- It cannot read environment variables except server-side model configuration:
  `OPENAI_API_KEY` and `AGENT_DEMO_MODEL`.
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

Phase 10.1 only documents the contract. Later phases should add:

- Fixed-window per-IP limits.
- Short request timeout.
- Model call timeout.
- Input length limit, currently defined as 800 characters.
- Output length limit.
- Source count limit, currently defined as 5 sources.
- Safe failure when rate-limit infrastructure is unavailable.

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
- Phase 10.4: Rate limit, timeout, and abuse protection.
- Phase 10.5: Agent Demo UI and trace display.
- Phase 10.6: Production deployment and safety verification guide.
- Phase 10.7: Final Phase 10 review.

## Standalone Agent API Option

The first implementation can live inside the Next.js app because it is small and
read-only. If usage or operational complexity grows, the agent can later be split
into a separate `agent-api` service with its own rate limiting, logging, model
configuration, and deployment lifecycle.
