# Logical Data Ownership

## Purpose

Define authoritative state owners and atomic consistency boundaries before choosing physical persistence.

## Ownership map

| State | Logical owner | Authority |
|---|---|---|
| KnowledgeNode, KnowledgeAssertion, Relation, classification | Knowledge Graph Core | canonical |
| Source/SourceRevision/EvidenceRef used by graph | provenance boundary / Graph Core | canonical support |
| candidate extraction, unresolved identity, proposed GraphChangeSet | Knowledge Curation | staged, non-canonical |
| TargetScope, Curriculum | Learning Coordination | canonical learning intent/design |
| LearningPlan | Learning Coordination / learner | canonical personal intent |
| Question, ListeningSegment, future subject objects | subject bounded context | canonical inside that context |
| PublicationBinding / RuntimeBinding | Learning Coordination + runtime integration | canonical integration state |
| raw review/attempt evidence | Learning Coordination | canonical learner evidence |
| LearnerState / progress aggregates | Learning Coordination | derived |
| graph exploration/read projection | read-model owner | derived |
| SavedView/layout/camera/filter state | learner/interface state | personal, non-semantic |

## Atomic consistency boundaries

### GraphChangeSet -> GraphRevision

Applying one accepted GraphChangeSet is atomic with respect to the canonical semantic graph. The resulting GraphRevision cannot expose half-applied identity/relation/assertion changes.

### LearningPlan revision

One LearningPlan revision is an atomic learner-intent change and records the graph/curriculum revision context it was based on.

### Evidence event

One accepted runtime/assessment observation is atomic by its event identity. Derived learner state may update later.

### Publication binding

Mapping one Prep learning-object identity to an external representation is durable integration state. Batch synchronization need not be globally atomic.

## Cross-boundary rule

Do not create a transaction boundary spanning:

- Knowledge Graph + external Study Runtime;
- LearningPlan + external Study Runtime;
- raw evidence + all derived read models.

Use durable intent/evidence plus reconciliation instead.

## Derived data

Search indexes, graph layout, clusters, progress aggregates and UI read models are disposable projections. They must be rebuildable from authoritative state and expose enough revision metadata to diagnose staleness.
