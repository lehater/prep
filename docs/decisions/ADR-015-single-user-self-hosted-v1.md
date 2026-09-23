# ADR-015 — Use a single-user self-hosted-first v1 deployment posture

Status: Accepted

## Context

Prep is initially a personal learning platform with learner-specific plans/evidence and local desktop dependencies such as AnkiConnect. A public multi-tenant SaaS architecture would add identity, tenant isolation and operations complexity before it is required.

The domain already retains LearnerId and ownership boundaries so future multi-user hosting does not require redefining learning semantics.

## Decision

- v1 targets one authenticated user/learner per self-hosted Prep deployment.
- Docker Compose is the reference central deployment envelope.
- LearnerId, authorization checks and scoped runtime bindings remain explicit rather than relying on a process-global singleton.
- Multi-user hosting is a future deployment/product mode, not a v1 requirement.
- The Local Bridge remains separately authenticated even in single-user deployments.

## Consequences

- Security and operations can remain simple enough for personal deployment.
- Database schemas and APIs must not assume that learner-owned rows need no owner ID.
- A future hosted/multi-user mode requires a new security/deployment review rather than a domain rewrite.
