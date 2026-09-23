# Logical Application Use Cases

## Responsibility

Define the application-level commands and queries that coordinate accepted domain semantics without choosing transport, process boundaries or persistence technology.

## Command families

### Knowledge curation

- submit/register a source observation or structured import;
- request semantic extraction/analysis;
- inspect proposed graph changes;
- accept/reject/defer a curation proposal according to graph admission policy;
- apply an accepted GraphChangeSet and expose the resulting GraphRevision.

### Learning intent

- define/revise a TargetScope;
- select/adapt a Curriculum;
- create/revise/archive a learner-specific LearningPlan;
- request domain-specific learning material for plan subjects;
- select which learning material is desired in a Study Runtime.

### Study/runtime coordination

- publish/reconcile desired learning material with a bound Study Runtime;
- inspect synchronization/drift/conflict state;
- ingest review/attempt evidence;
- recompute or refresh learner-state projections.

## Query families

- explore/search/filter a graph snapshot;
- inspect one node/relation and its evidence-backed semantic detail;
- inspect TargetScope/Curriculum/LearningPlan;
- inspect content coverage and learner-state overlays;
- inspect curation queue/conflicts;
- inspect runtime publication/evidence status.

## Application invariants

- Application orchestration does not invent semantic graph truth.
- Graph mutation goes only through Graph Admission.
- Subject contexts own their learning-object semantics; application workflows coordinate references, not a universal Exercise model.
- Queries do not become backdoor write paths.
- Derived views/overlays are rebuildable and not authoritative semantic state.
- External side effects are coordinated through ports and may complete asynchronously; application state must represent incomplete/retryable work explicitly.
