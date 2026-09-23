# Data Lifecycle Design

## Schema evolution

Use versioned database migrations. The implementation default is Alembic for the Python/PostgreSQL stack.

Migrations must preserve:

- NodeId/relation/learning-object identities;
- GraphRevision history required by plans/evidence;
- node merge redirects;
- runtime bindings needed to preserve Anki scheduling continuity.

Destructive migrations require an explicit export/restore path or proven irrelevance of retired data.

## Semantic history

Graph revisions and historical versions referenced by LearningPlans/generated material/evidence are retained. Routine graph evolution marks semantic records non-current rather than physically rewriting history.

## Backups

PostgreSQL is the authoritative backup unit.

Required policy:

- automated logical/physical database backups appropriate to deployment;
- backup copies stored outside the primary database host/storage;
- periodic restore verification;
- bridge/Anki state is recoverable by reconciliation and is not a replacement for Prep backups.

Exact schedule/storage provider is deployment configuration.

## Personal data lifecycle

Learner plans/evidence/runtime bindings are logically separable by LearnerId. Export/delete workflows must be possible without deleting shared graph truth.

Initial retention is preserve-until-explicit-delete; later product policy may introduce bounded retention.

## Derived state

Read projections, embeddings, clusters and learner-state aggregates may be rebuilt. Backups need not treat them as irreplaceable if rebuild inputs are protected.
