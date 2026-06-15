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

Required server-only environment variables:

- `AGENT_DEMO_MODEL_API_URL`
- `AGENT_DEMO_MODEL_API_KEY`
- `AGENT_DEMO_MODEL`

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

The following are intentionally not implemented in Phase 10.1:

- Redis rate limiting
- `/agent-demo` UI
- Production deployment changes
