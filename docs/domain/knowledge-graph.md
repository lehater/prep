# Knowledge Graph domain

## Responsibility

The Knowledge Graph is the semantic core of Prep. It owns stable knowledge identities and accepted semantic relations independently of learning plans, Anki state and visualization.

## Core model

```text
Concept/Knowledge Node
  <- first-class typed Relation ->
Concept/Knowledge Node

+ Classification
+ Evidence / provenance
```

### Node

A node represents one stable semantic referent. Identity is an immutable repository-owned ID; names, aliases, display labels and storage locations do not define identity.

Initial controlled `kind` vocabulary is seeded from prior project evidence and may evolve through an explicit registry:

```text
artifact
construct
mechanism
model
pattern
practice
problem
property
result
structure
technology
```

`kind` is classification metadata, not a different runtime class hierarchy.

### Relation

A relation is a first-class directional semantic assertion between two node identities. Relation type is selected from a controlled extensible registry; arbitrary `related_to` is not a fallback.

Initial admitted seed:

```text
uses
specializes
part_of
depends_on
realizes
produces
derives_from
enables
```

The data model must permit additional well-defined relation types without redesigning the graph core.

### Classification

Classification supports orthogonal navigation without replacing semantic relations:

```text
kind    -> broad referent form
areas   -> subject membership
facets  -> controlled area-specific dimensions
```

### Evidence

Concept and relation admission must retain enough provenance/evidence to review why semantic truth was accepted. Evidence does not make source popularity or model confidence equivalent to truth.

## Admission boundary

Semantic mutation follows a controlled pipeline:

```text
source/import
  -> candidate extraction
  -> identity resolution
  -> relation/classification validation
  -> graph delta
  -> deterministic structural checks
  -> accepted graph
```

Agents may propose semantic changes. Deterministic code owns stable IDs, structural validation and persistence. Ordinary users may report issues or propose changes but do not directly author accepted nodes/relations.

## Overlays

The Knowledge Graph does not own learner progress or view state.

```text
Semantic Graph + Learning Overlay -> personal progress view
Semantic Graph + View State       -> filtered/clustered visualization
```

Learning and presentation data must be removable/recomputable without changing semantic graph truth.
