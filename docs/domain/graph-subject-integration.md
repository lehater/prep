# Subject Context to Knowledge Graph integration

## Responsibility

Define how subject-specific bounded contexts reference canonical Knowledge Graph semantics without importing graph implementation types or duplicating reusable knowledge truth.

## GraphSubjectRef

The shared integration value identifies a canonical graph subject:

```text
GraphSubjectRef =
  NodeId
  | RelationId
```

Bounded contexts exchange IDs/contracts, not Knowledge Graph domain objects.

## Interview Preparation

Interview `Question` and related learning objects should reference canonical graph subjects when they test reusable semantic knowledge.

Current legacy `Concept`/question-bank identifiers remain valid until migrated deliberately. The target direction is:

```text
Question
  -> GraphSubjectRef(s)
  + interview-specific LearningTask / assessment semantics
```

Interview Preparation remains owner of Question, Attempt, Assessment and interview-gap semantics. It must not own a second definition of `Idempotency`, `MVCC`, etc. once those referents are canonical graph nodes.

## English Listening

A `LexicalTarget` or other semantic target may optionally map to a graph node when it denotes reusable knowledge.

A `ListeningSegment`, transcript occurrence, timestamp/alignment and acoustic policy remain local English Listening entities. They are not graph nodes merely because they participate in learning.

## Mapping outcomes

A subject-context object may be:

- `mapped` — one canonical graph subject is established;
- `unresolved` — mapping is ambiguous/insufficient;
- `local_only` — the object is intentionally context-specific and has no canonical graph subject.

No context may invent a graph ID to avoid unresolved mapping.

## Dependency boundary

Subject contexts can operate with local objects even when mapping is unresolved. Graph analytics only include mappings that have been accepted through normal graph identity/admission rules.
