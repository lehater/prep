# Logical Knowledge Ingestion Workflow

## Purpose

Turn source material into trustworthy canonical graph changes while keeping candidate analysis separate from accepted graph state.

## Workflow

```text
Source / SourceRevision
  -> register observation
  -> extract candidate entities/assertions/relations
  -> resolve candidate identities
  -> validate kinds/relation types/evidence
  -> build proposed GraphChangeSet
  -> admission decision
       -> ACCEPT
       -> REVIEW
       -> REJECT
       -> NO_CHANGE
  -> accepted GraphChangeSet applied atomically
  -> new GraphRevision
```

## Ownership

- Source acquisition owns obtaining material; it cannot decide semantic truth.
- Semantic analysis may be agent/model-assisted and produces proposals only.
- Graph Admission owns whether a proposal is acceptable.
- Knowledge Graph Core owns the resulting canonical revision.
- Curation/review owns ambiguous/conflicting cases.

## Logical contracts

### Input identity

An ingestion attempt references a stable Source plus a concrete SourceRevision/Observation. Retrying the same observation must not duplicate canonical meaning.

### Candidate space

Candidates retain source coordinates and analysis context. Candidate identifiers are processing identities, not canonical NodeIds.

### GraphChangeSet

A proposed change groups mutually dependent semantic mutations that must be accepted/rejected as one consistency unit when partial application would violate meaning.

### Outcomes

- `ACCEPTED` — canonical graph revision created;
- `REVIEW_REQUIRED` — ambiguity/conflict/registry extension needs semantic judgment;
- `REJECTED` — proposal is unsupported/invalid;
- `NO_CHANGE` — equivalent meaning is already represented.

## Failure/retry rules

- Agent/model failure cannot partially mutate the canonical graph.
- Deterministic validation failure cannot partially mutate it.
- Applying the same accepted change twice must have one semantic effect.
- A newer source revision is new evidence; it is not automatically a replacement for earlier truth.
- Curation state is separate from canonical graph state and may be retried/reprocessed.
