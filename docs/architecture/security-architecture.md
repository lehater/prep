# Security Architecture

## Initial deployment posture

v1 is single-user/self-hosted-first while preserving LearnerId and authorization boundaries so multi-user hosting is not encoded out of the domain.

## Web access

- authenticate the application user before personal/admin endpoints;
- use secure HTTP-only session cookies for browser sessions;
- password credentials, when locally managed, are stored only as modern password hashes;
- deployments exposed beyond localhost require TLS, typically at the deployment/reverse-proxy boundary.

A future OIDC provider may replace local authentication without changing learner/domain identity.

## Authorization

Separate capabilities:

- learner personal-state access;
- semantic curation/admin operations;
- runtime bridge integration.

Graph curation authority does not imply access to another learner's evidence in future multi-user mode.

## Local Bridge

Each bridge uses a revocable scoped token tied to one learner/runtime binding.

The bridge makes outbound authenticated HTTPS requests to Prep and calls AnkiConnect only on localhost.

AnkiConnect API-key support may be enabled locally, but the Prep service never stores/exposes an unauthenticated network-facing AnkiConnect endpoint.

## Secrets

Model-provider keys, bridge tokens and database credentials are deployment secrets, never graph/source content.

## External model privacy

Only task-required source/candidate data is sent to configured model providers. Personal review history is excluded unless a specific accepted workflow needs it.
