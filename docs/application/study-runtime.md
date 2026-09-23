# Logical Study Runtime Coordination

## Purpose

Coordinate domain-specific learning material with external study runtimes while preserving Prep identity, runtime scheduler history and learner evidence.

## Publication flow

```text
LearningPlan
  -> required graph subjects/evidence dimensions
  -> subject bounded context selects/generates learning objects
  -> desired publication set
  -> Study Runtime projection
  -> reconcile desired vs observed
  -> runtime material + runtime scheduler state
```

The shared layer does not own Question/ListeningSegment semantics.

## Stable publication identity

Every published learning object has a Prep-owned stable identity plus a RuntimeBinding/PublicationBinding to its external representation.

Updating wording/presentation for the same logical learning object should update the existing external object when compatible, not silently create a duplicate and lose scheduler history.

## Desired versus observed state

Prep owns desired publication intent. The runtime owns its native scheduling/review state.

Reconciliation classifies at least:

- missing externally;
- present and aligned;
- content/config drift;
- runtime-only/orphaned object;
- conflict requiring policy/review;
- external system unavailable.

Externally edited semantic content is drift, not a new canonical source of Prep truth.

## Evidence ingestion

Runtime reviews/attempt observations are imported as learner evidence.

Requirements:

- each event has stable runtime provenance or another deduplication identity;
- replaying the same observation has one semantic effect;
- device/runtime origin is provenance, not learner identity;
- evidence is retained independently from the current derived learner-state projection;
- scheduler metadata may be stored as evidence but does not define Prep mastery.

## Consistency boundary

No distributed transaction is required between Prep and an external runtime.

Publication is intentionally convergent:

```text
desired state
  -> side effect may partially succeed/fail
  -> observe
  -> reconcile
  -> converge
```

A failed publish does not roll back the LearningPlan. A repeated reconcile must be safe.
