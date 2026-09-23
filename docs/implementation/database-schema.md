# Database Schema Contract

## Stack

PostgreSQL 18+, SQLAlchemy 2.x, psycopg 3, Alembic. Application persistence is synchronous by default.

PostgreSQL generates stable UUIDv7 identifiers with `uuidv7()`.

## Revision model

`graph_revision`

- `seq bigint generated always as identity primary key`;
- `revision_id uuid unique not null default uuidv7()`;
- `change_set_id uuid unique not null`;
- `created_at timestamptz not null`;
- `actor_kind text not null`;
- `actor_ref text null`.

Graph version tables use `valid_from_seq bigint not null`, `valid_to_seq bigint null`. Current rows have `valid_to_seq is null`. One GraphChangeSet closes/creates all affected versions and inserts one revision in one transaction.

## Semantic graph

Identity tables:

- `graph_node(node_id uuid PK default uuidv7(), created_seq, retired_seq nullable)`;
- `knowledge_assertion(assertion_id uuid PK default uuidv7(), node_id FK, created_seq, retired_seq nullable)`;
- `graph_relation(relation_id uuid PK default uuidv7(), from_node_id FK, to_node_id FK, created_seq, retired_seq nullable)`.

Version tables:

- `graph_node_version(node_id, valid_from_seq, valid_to_seq, canonical_label, kind, status, areas jsonb, facets jsonb)`;
- `node_alias(alias_id uuid PK default uuidv7(), node_id FK, alias_text, normalized_alias, created_seq, retired_seq nullable)`;
- `knowledge_assertion_version(assertion_id, valid_from_seq, valid_to_seq, statement, applicability jsonb, status)`;
- `graph_relation_version(relation_id, valid_from_seq, valid_to_seq, relation_type, status, applicability jsonb)`.

Required constraints/indexes:

- PK over `(id, valid_from_seq)` in each version table;
- partial unique current-version index where `valid_to_seq is null`;
- B-tree relation indexes `(from_node_id, relation_type)`, `(to_node_id, relation_type)`;
- indexes for current node `kind/status`;
- GIN only where measured query shapes justify JSONB indexing.

`node_redirect(old_node_id PK, surviving_node_id FK, merged_seq, reason)` preserves merged references. Redirect chains must be collapsed/validated so resolution terminates.

## Provenance

- `source(source_id uuid PK, source_type, canonical_ref, title, visibility)`;
- `source_revision(source_revision_id uuid PK, source_id FK, immutable_ref nullable, content_hash, observed_at, metadata jsonb)`;
- `evidence_ref(evidence_id uuid PK, source_revision_id FK, locator jsonb, excerpt_hash nullable, purpose)`;
- association tables `node_evidence`, `alias_evidence`, `assertion_evidence`, `relation_evidence`.

Evidence rows are append-oriented. A semantic retirement does not delete supporting provenance.

## Authentication state

- `app_user(user_id uuid PK default uuidv7(), username text unique, password_hash text, learner_id uuid FK, capabilities text[], status, password_changed_at, created_at)`;
- `auth_session(session_id uuid PK default uuidv7(), user_id FK, session_token_hash bytea unique, csrf_token_hash bytea, created_at, last_seen_at, idle_expires_at, absolute_expires_at, revoked_at nullable)`.

Raw session/CSRF secrets are never persisted.

## Learning/personal state

- `learner(learner_id uuid PK, created_at, status)`;
- `target_scope(target_scope_id uuid PK, owner_learner_id nullable, name, graph_revision_seq, definition jsonb, version int)`;
- `curriculum(curriculum_id uuid PK, name, target_scope_id FK, version int, policy jsonb)`;
- `learning_plan(learning_plan_id uuid PK, learner_id FK, status, current_version int)`;
- `learning_plan_revision(learning_plan_id, version, graph_revision_seq, curriculum_id nullable, definition jsonb, created_at)`;
- `raw_learning_evidence(evidence_event_id uuid PK, learner_id FK, subject_kind, subject_id uuid, learning_object_ref, source_kind, source_binding_id, source_event_id, occurred_at, payload jsonb)`;
- unique `(source_binding_id, source_event_id)`;
- `learner_state_projection(learner_id, subject_kind, subject_id, state, computed_at, source_watermark, payload jsonb)`;
- `saved_view(saved_view_id uuid PK, learner_id FK, name, definition jsonb, version int)`.

`subject_kind` is constrained to node/relation until extended by an accepted contract.

## Runtime integration

- `runtime_binding(runtime_binding_id uuid PK, learner_id FK, runtime_type, profile_ref, status, token_hash, lease_owner nullable, lease_until nullable, last_seen_at)`;
- `publication_intent(publication_intent_id uuid PK, learner_id FK, learning_object_type, learning_object_id, runtime_binding_id FK, desired_state, content_version, unique(runtime_binding_id, learning_object_type, learning_object_id))`;
- `publication_binding(publication_binding_id uuid PK, runtime_binding_id FK, learning_object_type, learning_object_id, external_object_ref, observed_content_version, status, unique(runtime_binding_id, learning_object_type, learning_object_id), unique(runtime_binding_id, external_object_ref))`;
- `runtime_observation(observation_id uuid PK, runtime_binding_id FK, external_event_ref, observed_at, payload jsonb, unique(runtime_binding_id, external_event_ref))`;
- `sync_run(sync_run_id uuid PK, runtime_binding_id FK, started_at, finished_at nullable, status, counters jsonb, error jsonb nullable)`.

## Curation

- `ingestion_run(ingestion_run_id uuid PK, source_revision_id FK, status, created_at, finished_at nullable, analyzer_metadata jsonb)`;
- `curation_proposal(proposal_id uuid PK, ingestion_run_id FK, proposal_kind, status, candidate_payload jsonb, diagnostic jsonb, decided_at nullable, decided_by nullable)`;
- `graph_change_set(change_set_id uuid PK, proposal_id nullable, status, mutations jsonb, content_hash, accepted_at nullable)`.

Candidate payload is staged evidence, not canonical graph structure.

## Durable jobs

`job` contract is defined by [job-protocol.md](job-protocol.md). Job/outbox tables reside in the same database but outside semantic aggregates.

## Migration rules

- Alembic revisions are immutable once merged to `main`;
- CI upgrades an empty database to head and checks metadata/schema expectations;
- destructive migration requires explicit data transition and rollback/restore statement;
- production startup does not auto-run migrations from every API/worker instance.
