# Knowledge Graph domain

## Responsibility

The Knowledge Graph is the semantic core of Prep. It owns stable knowledge identities and accepted semantic relations independently of learning plans, Anki state and visualization.

## Core model

```text
KnowledgeNode
  <- first-class typed Relation ->
KnowledgeNode

+ Classification
+ Evidence / provenance
```

A node is one stable semantic referent. A relation is one accepted semantic assertion between two stable node identities.

## Node identity

Identity is an immutable repository-owned ID. Names, aliases, wording, source location and UI position do not define identity.

Two records with similar labels are not the same node until identity resolution establishes semantic equivalence. A rename does not create a new node.

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
- Do not create `question`, `exercise`, `card` or `review` kinds in the semantic graph; those belong to learning/runtime contexts.
- Do not create a generic `solution` kind when a more informative form such as `pattern`, `mechanism`, `practice` or `technology` is known.
- `construct` is the narrow fallback for legitimate semantic referents that do not yet fit a more useful kind. It must not become an unreviewed dumping category.
- Extending the registry requires a demonstrated recurring referent form and a clear boundary from existing kinds.

## Classification

Classification supports orthogonal navigation without replacing semantic relations:

```text
kind    -> broad referent form
areas   -> subject membership
facets  -> controlled area-specific dimensions
```

The same node may belong to several areas. Area/facet membership does not create duplicate semantic identities.

## Relations

Relations are first-class directional assertions with a controlled extensible type registry. Their canonical semantics are owned by [relation-registry.md](relation-registry.md).

A free-form `related_to` relation is intentionally absent because it hides meaning and makes graph filtering/analysis weak.

## Evidence

Concept and relation admission retains sufficient provenance to answer why the semantic fact entered the graph and which sources/observations support it.

Evidence is not itself truth: source popularity, embedding similarity or model confidence cannot silently establish identity or relations.

## Admission boundary

Canonical graph mutation is controlled by [graph-admission.md](graph-admission.md). Source ingestion produces candidates and proposed graph deltas; only accepted semantic changes enter the canonical graph.

## Learning and view overlays

The Knowledge Graph does not own learner progress, plan state or view layout.

```text
Semantic Graph + Learning Overlay -> personal progress view
Semantic Graph + View State       -> filtered/clustered visualization
```

Learning overlays may refer to nodes and relations, but deleting/recomputing an overlay cannot change semantic graph truth.
