# Logical Data Ownership

## Purpose

Define authoritative state owners and atomic consistency boundaries before choosing physical persistence.

## Ownership map

| State | Logical owner | Authority |
|---|---|---|
| KnowledgeNode, KnowledgeAssertion, Relation, classification | Knowledge Graph Core | canonical semantic truth |
| accepted EvidenceRef associations on graph claims | Knowledge Graph Core | canonical support links |
| Source/SourceRevision observations used for curation | Knowledge Curation | canonical provenance input |
| candidate extraction, unresolved identity, proposed GraphChangeSet | Knowledge Curation | staged, non-canonical semantics |
| TargetScope, Curriculum | Learning Coordination | canonical learning design |
| LearningPlan | Learning Coordination, scoped by LearnerId | canonical personal intent |
| Question, ListeningSegment, future subject objects | subject bounded context | canonical inside that context |
| desired publication set | Learning Coordination | canonical learner intent |
| PublicationBinding / RuntimeBinding / observed runtime state | Study Runtime Integration | canonical integration state |
| raw review/attempt evidence | Learning Coordination | canonical learner evidence |
| LearnerState / progress aggregates | Learning Coordination | derived |
| graph exploration/read projection | Graph Read Projection | derived |
| SavedView/layout/camera/filter state | personal interface state | personal, non-semantic |

No row has two semantic owners. Integration contracts connect owners through stable IDs.

## Atomic consistency boundaries

### GraphChangeSet -> GraphRevision

Applying one accepted GraphChangeSet is atomic with respect to the canonical semantic graph. The resulting GraphRevision cannot expose half-applied identity/relation/assertion changes.

### LearningPlan revision

One LearningPlan revision is an atomic learner-intent change and records the graph/curriculum revision context it was based on.

### Evidence event

One accepted runtime/assessment observation is atomic by its event identity. Derived learner state may update later.

### Publication binding

Mapping one Prep learning-object identity to an external representation is durable state owned by Study Runtime Integration. Batch synchronization need not be globally atomic.

## Cross-boundary rule

Do not create a transaction boundary spanning:

- Knowledge Curation + canonical graph commit before admission;
- Knowledge Graph + external Study Runtime;
- LearningPlan + external Study Runtime;
- raw evidence + all derived read models.

Use durable intent/evidence plus explicit reconciliation.

## Derived data

Search indexes, graph layout, clusters, progress aggregates and UI read models are disposable projections. They must be rebuildable from authoritative state and expose enough revision metadata to diagnose staleness.
