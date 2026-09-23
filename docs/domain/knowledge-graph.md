# Knowledge Graph domain

## Responsibility

The Knowledge Graph is the semantic core of Prep. It owns canonical representations of reusable knowledge: semantic entities, accepted assertions about them, typed relations, classification and supporting evidence.

It is independent of learning plans, Anki state and visualization.

## Core model

```text
Semantic Entity
      |
      v
KnowledgeNode (canonical representation)
      |
      +-- KnowledgeAssertion*
      |
      <- first-class typed Relation ->
                  KnowledgeNode

+ Classification
+ Evidence / provenance
```

## Semantic identity and NodeId

Keep two concepts distinct:

```text
semantic identity
    = continuity of the real conceptual referent

NodeId
    = stable system-owned identifier of its canonical graph representation
```

Names, aliases, wording, source location, UI position and NodeId do not *define* semantic identity. The system uses a stable NodeId after identity resolution so every other domain can reference the canonical representation reliably.

Two similar labels are not one entity until identity resolution establishes semantic equivalence. Rename preserves semantic identity and NodeId.

Historical continuity/retirement is defined by [graph-lifecycle.md](graph-lifecycle.md).

## KnowledgeNode

A node carries identity-facing semantic metadata:

- stable NodeId;
- canonical label;
- supported aliases;
- kind;
- areas/facets;
- lifecycle state;
- references to accepted assertions/evidence.

The node is what the 3D graph renders as a point.

## KnowledgeAssertion

A node needs inspectable semantic content beyond its label and kind.

A `KnowledgeAssertion` is an accepted statement about one semantic entity, with enough applicability context and evidence to be reviewed independently.

Examples:

```text
"Idempotency means repeated execution does not multiply the intended effect."
"Snapshot Isolation allows concurrent transactions to read from a consistent snapshot."
"Outbox removes the need for one atomic transaction spanning a database and broker."
```

Assertions are **not 3D graph nodes by default**. They form the semantic content shown in the node detail/card and provide a claim-level boundary for provenance, conflict and obsolescence.

The exact taxonomy of assertion aspects (definition, purpose, mechanism, trade-off, constraint, etc.) remains a later refinement; assertions must not be forced into one giant unversioned Markdown blob.

## Node kind

All semantic nodes use one structural entity, `KnowledgeNode`. `kind` classifies what sort of referent the node denotes; it does not create a class hierarchy or different persistence model.

Initial controlled registry:

| kind | semantic intent | examples |
|---|---|---|
| `artifact` | durable created information object | ADR, API specification |
| `construct` | named conceptual/domain construct not better classified below | transaction, event loop |
| `mechanism` | mechanism that explains how an effect is achieved | MVCC, locking, retry |
| `model` | explanatory/analytical model | isolation model, actor model |
| `pattern` | reusable solution structure | Outbox, Saga |
| `practice` | repeatable way of working | continuous integration |
| `problem` | problem/challenge requiring analysis or mitigation | dual-write problem, distributed consensus |
| `property` | semantic/system property or guarantee | idempotency, atomicity |
| `result` | established result/theorem/consequence | FLP result |
| `structure` | structural/data organization | B-tree, Bloom filter |
| `technology` | concrete language/library/product/protocol/platform | PostgreSQL, asyncio |
| `process` | ordered activity/lifecycle whose progression matters | payment lifecycle, reconciliation process |

Rules:

- `kind` answers “what sort of referent is this?”, not “how should it be learned?”.
- Do not create `question`, `exercise`, `card` or `review` kinds in the semantic graph.
- Do not create generic `solution` when a more informative form such as `pattern`, `mechanism`, `practice` or `technology` is known.
- `construct` is the narrow fallback for legitimate semantic referents that do not fit a more useful kind.
- Extending the registry requires a demonstrated recurring referent form and a clear boundary from existing kinds.

## Classification

```text
kind    -> broad referent form
areas   -> subject membership
facets  -> controlled area-specific dimensions
```

The same node may belong to several areas. Area/facet membership does not create duplicate semantic identities.

## Cluster boundary

`cluster` is not a canonical semantic node type by default.

```text
Area           -> accepted classification
DerivedCluster -> computed grouping from topology/embedding/analytics
SavedView      -> user-selected/filter/layout projection
TargetScope    -> explicit learning intent over graph subjects
```

A derived cluster becomes canonical knowledge only if it represents an independently meaningful semantic referent and passes ordinary graph admission.

## Relations

Relations are first-class directional assertions between node identities with a controlled extensible type registry. Their canonical semantics are owned by [relation-registry.md](relation-registry.md).

A free-form `related_to` relation is intentionally absent.

A Relation is already a structured graph assertion between two nodes; it is not duplicated as a `KnowledgeAssertion`.

## Evidence

Node identity/classification, KnowledgeAssertions and Relations retain sufficient provenance to explain why they were accepted.

The shared provenance boundary is defined by [source-evidence.md](source-evidence.md).

Source popularity, embedding similarity or model confidence cannot silently establish identity or truth.

## Admission boundary

Canonical graph mutation is controlled by [graph-admission.md](graph-admission.md). Source ingestion produces candidates and proposed graph deltas; only accepted semantic changes enter the canonical graph.

## Learning and view overlays

The Knowledge Graph does not own learner progress, plan state or view layout.

```text
Semantic Graph + Learning Overlay -> personal progress view
Semantic Graph + View State       -> filtered/clustered visualization
```

Learning overlays may refer to nodes and relations, but deleting/recomputing an overlay cannot change semantic graph truth.
