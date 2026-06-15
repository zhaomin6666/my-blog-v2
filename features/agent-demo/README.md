# AI Agent Demo Foundation

This directory contains the Phase 10.1 foundation for the public AI Agent Demo.

The demo is intentionally designed as a read-only, scope-limited agent for the
Personal Developer OS website. It is not a general chatbot.

## Current Phase

Phase 10.1 only defines:

- Request / response / trace / source types
- Static configuration
- Input validation
- Trace construction helpers
- Safety and scope policy constants
- A foundation-only service response for future route integration

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

- Model API integration
- Redis rate limiting
- `/api/agent-demo`
- `/agent-demo` UI
- Read-only knowledge tools
- Rule-based scope classifier
- Production deployment changes
