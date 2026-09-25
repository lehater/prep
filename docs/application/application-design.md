# Application Design

## Purpose

Define Prep's application-level composition of accepted product and domain behavior without re-owning domain semantics, external machine contracts, persistence, UI composition or runtime topology.

Canonical data is maintained through application use cases. Human interfaces and bulk-import interfaces invoke these use cases; neither writes directly to persistence.

## Canonical data maintenance

### Knowledge

Application operations:

- create and edit a KnowledgeNode;
- create and remove a typed KnowledgeRelation between KnowledgeNodes;
- load prepared KnowledgeNodes and KnowledgeRelations in bulk.

Automatic extraction, derivation or validation of source material is outside the current scope.

### Learning requirements

Application operations:

- create and edit a Requirement;
- create and edit a RequirementSet;
- add or remove Requirements and nested RequirementSets from a RequirementSet while preserving the domain acyclicity invariant;
- align or unalign a Requirement with KnowledgeNodes;
- load prepared Requirements, RequirementSets, composition and alignments in bulk.

The application does not infer requirements automatically from source material.

### Questions

Application operations:

- create and edit a Question and its direct answer;
- align or unalign a Question with one or more KnowledgeNodes;
- load prepared Questions and, when supplied, their knowledge alignments in bulk.

Question import does not require alignment to be known at import time. Alignment can be completed as a separate curation activity.

### Learning targets

Application operations:

- create and edit a LearningTarget;
- assign or remove Requirements and RequirementSets for a LearningTarget;
- optionally load prepared target definitions and assignments when a machine interface supports them.

### Learner statistics

ReviewObservations are normally recorded from learning-runtime results rather than manually authored canonical data.

The current application contract provides recording and retrieval of Question-level review history/statistics. It does not interpret those statistics into learner state.

## Task-context distinction

The current single-user product supports two different classes of work without introducing authentication roles:

- **learning workflow** — choose/work within a LearningTarget, build study material, study externally and inspect recorded review facts;
- **curation workflow** — maintain reusable Knowledge, Requirements/RequirementSets, Questions, alignments and learning-material quality.

The same person may perform both in v1. The distinction is semantic/task-oriented, not a user/permission model.

A learning workflow consumes the currently curated reusable corpus. It is not responsible for repairing semantic completeness of that corpus before useful study can proceed.

## Learning preparation

### Build Study Set

Resolve a LearningTarget through its selected Requirements/RequirementSets and their existing knowledge alignments to relevant KnowledgeNodes, then select all currently resolvable Questions aligned to that knowledge.

The resulting Study Set is an application-level materialization: a selected set of canonical Questions for a particular learning preparation flow. It does not become reusable subject truth and does not introduce a new tactical domain entity.

Study Set construction does **not** require proof that the reusable question corpus completely covers every KnowledgeNode or every aspect of a target. Question-coverage adequacy is a separate curation/learning-material quality concern.

Incomplete reusable material therefore does not create a learner-facing preparation gate. The application builds the currently resolvable subset. Missing Requirement-to-Knowledge alignment, Knowledge with no Questions and any future question-coverage quality assessment may be exposed as curation diagnostics, but they do not redefine the Study Set as complete.

A target with no currently resolvable Questions yields an explicit empty Study Set/result rather than an invented semantic rejection.

For the current slice, dependency-sensitive ordering, automatic prioritization from learner statistics and evidence-based filtering are deferred.

## External study

### Materialize for External Study

Transform a Study Set into the representation required by a selected external learning runtime.

A runtime-specific card is a derived representation of a Question, not a canonical Prep domain object. The concrete external representation and protocol are owned downstream by machine-interface/technical design.

### Export Study Material

Send the materialized study representation to an external learning runtime.

Application Design owns the orchestration intent. External API/protocol contracts and technical transport are not owned here.

### Import Review Results

Receive review results from an external learning runtime, resolve them back to canonical Questions, and record ReviewObservations in the Learner Model.

The mapping and external representation needed to identify corresponding external items are downstream machine-interface/technical concerns.

### Record Learning Statistics

Record accepted Question-level ReviewObservations so review history and statistics can be reproduced.

The current flow stops at recording statistics. Interpretation into learner state, retention, mastery, gaps, priorities or automatic replanning is deferred.

## Composition

```text
Canonical data maintenance / curation

Human authoring --------+
                        |
Bulk prepared input ----+--> application use cases
                              |
                              +--> KnowledgeNodes / KnowledgeRelations
                              +--> Requirements / RequirementSets
                              +--> Requirement <-> Knowledge alignments
                              +--> Questions
                              +--> Question <-> Knowledge alignments
                              +--> LearningTargets / target requirements


Learning preparation

LearningTarget
  -> Requirements / RequirementSets
  -> currently aligned KnowledgeNodes
  -> currently aligned Questions
  -> Study Set (resolvable subset)


External study

Study Set
  -> materialize for external runtime
  -> export
  -> external learning activity
  -> import review results
  -> record Question-level ReviewObservations
```

Canonical-data maintenance flows are independent. Curation may happen before, after or separately from a learner's target workflow.

## Ownership boundaries

Application Design owns:

- canonical-data authoring and maintenance orchestration;
- bulk-input orchestration after an input representation has been decoded;
- RequirementSet composition operations;
- Requirement-to-Knowledge and Question-to-Knowledge alignment operations;
- LearningTarget composition operations;
- target-to-requirement-to-knowledge-to-question traversal used to prepare study;
- Study Set materialization from the currently resolvable corpus;
- orchestration of export and result-import flows;
- coordination of accepted domain models without redefining them.

Application Design does not own:

- KnowledgeNode, KnowledgeRelation, Requirement, RequirementSet, LearningTarget, Question or ReviewObservation semantics;
- semantic judgment of whether a Question set fully covers a KnowledgeNode;
- forms, screens, graph editors or other human interaction design;
- file/API/message representation contracts;
- external-runtime card schemas or API semantics;
- external-item mapping representation;
- database/storage schema;
- runtime/component topology.

## Downstream interface needs

Human Interface Design must distinguish learner-target work from reusable-corpus curation without requiring different authenticated users in v1.

Machine Interface Design must define representation contracts for supported bulk input and external-learning-system interaction. The initial format is not selected by Application Design.

Data Design must preserve accepted domain identities, relationships, compositions, alignments, targets and ReviewObservations without becoming the owner of their semantics.

## Deferred behavior

- interpretation of review statistics into learner state;
- evidence-strength/confidence models;
- retention/decay interpretation;
- propagation of inferred learner state onto KnowledgeNodes/Requirements;
- automatic reprioritization or replanning from review statistics;
- dependency-aware question ordering;
- semantic assessment of Question-set coverage adequacy for a KnowledgeNode;
- generalized study representations beyond requirements demonstrated by concrete learning runtimes;
- automatic extraction, generation or semantic validation of imported source content.
