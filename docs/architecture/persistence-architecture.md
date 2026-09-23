# Persistence Architecture

## Selected platform

PostgreSQL 18+ is the single authoritative database for v1. See ADR-011.

## Physical model families

### Semantic graph

Use explicit relational records:

```text
graph_node
graph_node_version
knowledge_assertion
knowledge_assertion_version
graph_relation
graph_relation_version
source
source_revision
evidence_ref
graph_revision
graph_revision_change
node_redirect
```

Stable identity tables are separated conceptually from revisioned semantic payload/status so historical GraphRevision references remain reconstructable.

A GraphChangeSet is committed in one PostgreSQL transaction and creates exactly one GraphRevision.

### Learning/personal state

Separate tables/aggregate storage for:

```text
learner
target_scope
curriculum
learning_plan + plan_revision
raw_learning_evidence
publication_intent
learner_state_projection
saved_view
```

### Runtime integration

```text
runtime_binding
publication_binding
runtime_observation
sync_run
```

These are not graph nodes.

## Graph querying

- adjacency is represented by indexed relation endpoint columns;
- recursive CTEs implement bounded neighborhood/path traversal;
- relation type, lifecycle status, area/facet and revision predicates are indexed;
- `ltree` may be used for hierarchical classification paths, not for arbitrary semantic relations;
- graph-specific query logic stays behind query/repository ports.

## Vector similarity

Use pgvector embeddings only for candidate discovery, search ranking and derived clustering.

Vector similarity cannot auto-merge identities or create accepted Relations.

## Read projections

Search/overlay/cluster projections may use materialized/cache tables in PostgreSQL initially. They are rebuildable and never authoritative.

## Escalation rule

Consider Apache AGE or a native graph database only if representative benchmarks show that accepted graph query/capacity requirements cannot be met cleanly with PostgreSQL while preserving acceptable operational simplicity.
