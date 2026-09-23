# Logical Interface Boundaries

## Purpose

Define externally visible command/query/port responsibilities without choosing REST, GraphQL, RPC, CLI or framework technology.

## Human-facing query interface

Supports:

- graph search/subgraph/neighborhood/detail;
- semantic filters and relation toggles;
- content/plan/learner overlays;
- TargetScope/Curriculum/LearningPlan inspection;
- curation/sync diagnostic views subject to authorization.

Queries return purpose-built views, not persistence entities.

## Learner command interface

Supports intents such as:

- create/revise target and plan;
- request subject-specific learning material;
- change desired publication set;
- request runtime reconciliation;
- submit source/feedback.

It does not expose generic CRUD for canonical graph semantics.

## Curation command interface

Supports:

- inspect candidate/proposed GraphChangeSet;
- accept/reject/defer proposals;
- resolve identity conflicts;
- request controlled registry changes;
- merge/retire through explicit semantic commands.

No direct database-style node/edge editing bypasses Graph Admission.

## External ports

Logical outbound/inbound capabilities include:

- source/material acquisition;
- semantic model/agent analysis;
- subject-context learning-material production;
- Study Runtime publication/observation;
- media/ASR for English Listening;
- persistence/read projection mechanisms.

Ports belong to the application/core that needs them; sharing follows semantic equivalence, not adapter similarity.

## Interface invariants

- every mutation is expressed as domain/application intent;
- authorization context is explicit at the boundary;
- idempotency/retry identity exists for externally repeatable commands;
- long-running/external effects expose accepted/pending/failed/conflict status rather than pretending to be synchronous atomic work;
- interface DTOs may evolve independently of canonical domain representation.
