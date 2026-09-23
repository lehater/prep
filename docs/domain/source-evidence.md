# Source and Evidence boundary

## Responsibility

Define the minimum shared provenance contract needed to explain where graph knowledge and learning material came from without forcing every bounded context into one universal source model.

## Distinction

```text
Source
  -> an identifiable origin

SourceRevision / Observation
  -> the concrete state/version of that origin that was observed

EvidenceRef
  -> a bounded reference to support used for one semantic proposal/assertion
```

A URL string alone is not sufficient evidence identity because mutable sources can change.

## Source identity

A source identity represents continuity of an origin, for example:

- an RFC/specification;
- a repository/document;
- a book/article;
- a film/episode;
- an imported question corpus.

Domain-specific contexts may own richer source entities. For example, English Listening keeps `MediaSource` and transcript/acoustic provenance. The shared boundary requires only that such sources can expose a stable reference when their evidence supports cross-context semantic knowledge.

## Revision / observation

When reproducibility matters, evidence identifies the observed source state by whatever immutable/versioned coordinates the source can provide:

```text
commit/revision
publication/version
content fingerprint/snapshot
retrieved-at + preserved excerpt when no immutable revision exists
media/transcript version
```

The exact representation is adapter/source-specific and deferred.

## Evidence reference

Evidence is an association between a semantic proposal/assertion and source support.

At minimum it must preserve enough context to answer:

- which source/revision was used;
- what part/occurrence supports the claim;
- what semantic claim the support was used for.

Evidence may support node identity, classification, relation admission, retirement/obsolescence or learning-content generation.

## Invariants

- Source authority/popularity does not automatically decide truth.
- Model confidence is not evidence.
- Arrival order does not establish supersession.
- Conflicting evidence is preserved for review rather than silently overwritten.
- Evidence must remain traceable after node rename/merge/retirement.
- Subject-specific provenance remains owned by its bounded context; the shared contract is an integration reference, not a replacement domain model.
