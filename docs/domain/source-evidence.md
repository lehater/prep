# Source and Evidence boundary

## Responsibility

Define the minimum shared provenance contract needed to explain where graph knowledge and learning material came from without forcing every bounded context into one universal source model.

## Distinction

```text
Source
  -> identifiable origin

SourceRevision / Observation
  -> concrete state/version of that origin that was observed

EvidenceRef
  -> bounded reference to support used for one semantic claim/decision
```

A URL string alone is insufficient evidence identity because mutable sources can change.

## Source identity

A source identity represents continuity of an origin, for example an RFC, repository document, book/article, film/episode or imported corpus.

Domain-specific contexts may own richer source entities. English Listening keeps `MediaSource` and transcript/acoustic provenance; it exposes a stable reference only when that evidence supports cross-context semantic knowledge.

## Revision / observation

When reproducibility matters, evidence identifies the observed source state by immutable/versioned coordinates where available:

```text
commit/revision
publication/version
content fingerprint/snapshot
retrieved-at + preserved support when no immutable revision exists
media/transcript version
```

Representation remains source/adapter-specific.

## EvidenceRef

An EvidenceRef supports a specific semantic use:

- identity resolution/classification;
- one KnowledgeAssertion;
- one Relation;
- retirement/obsolescence decision;
- generated learning material.

It preserves enough context to answer:

- which source/revision was used;
- which part/occurrence was relied upon;
- which semantic claim/decision it supported.

## Invariants

- Source authority/popularity does not automatically decide truth.
- Model confidence is not evidence.
- Arrival order does not establish supersession.
- Conflicting evidence is preserved for review rather than silently overwritten.
- Evidence remains traceable after rename/merge/retirement.
- Subject-specific provenance stays owned by its bounded context; the shared contract is an integration reference, not a replacement domain model.
