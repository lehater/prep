# Logical Operability and Diagnostics

## Purpose

Make semantic curation, publication/reconciliation and evidence ingestion diagnosable before selecting logging/metrics infrastructure.

## Correlation identities

Operational records must be traceable through stable identifiers such as:

- SourceObservation / ingestion run;
- candidate / proposed GraphChangeSet;
- GraphRevision;
- LearnerId / LearningPlan revision;
- learning-object identity;
- PublicationBinding / synchronization run;
- runtime review/attempt event.

A single technology-specific trace ID is optional; domain correlation IDs are not.

## Required diagnostic states

### Curation

Expose:

- extraction/analysis status;
- identity ambiguity;
- validation failure;
- review-required reason;
- accepted/rejected/no-change outcome;
- resulting GraphRevision.

### Runtime synchronization

Expose desired/observed counts and per-object status:

- aligned;
- missing;
- drifted;
- conflicted;
- retryable failure;
- orphaned/runtime-only.

### Evidence ingestion

Expose:

- source runtime/binding;
- accepted/deduplicated/rejected event counts;
- invalid/unresolvable references;
- learner-state projection freshness.

## Auditability

Semantic admission, node merge/retirement, registry changes and manual conflict resolution require inspectable audit records linking actor/decision/input/result.

Personal study review events are evidence history, not administrative audit records; the two should not be conflated.

## Health model

Operational health distinguishes at least:

- canonical write path health;
- curation backlog/review backlog;
- read projection freshness;
- external runtime connectivity/sync backlog;
- evidence ingestion/projection freshness.

## Recovery principle

Every retryable operation declares enough stable identity to be replayed safely. Operators should repair by replay/reconcile/rebuild where possible, not by manual database mutation.
