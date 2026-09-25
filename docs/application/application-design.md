# Application Design

## Purpose

Define Prep's application-level composition of accepted product and domain behavior without re-owning domain semantics, external machine contracts, persistence, UI composition or runtime topology.

## Application flows

### Import Knowledge

Load prepared subject knowledge into the Knowledge Model.

The application flow accepts prepared input and creates or updates KnowledgeNodes and KnowledgeRelations according to Knowledge Model semantics. Automatic extraction, derivation or validation of source material is outside the current scope.

### Import Requirements

Load prepared Requirements and RequirementSets into Learning Design.

The application coordinates input with the accepted Learning Design model; it does not infer requirements automatically from source material.

### Import Questions

Load prepared Questions into Learning Design.

A Question remains the canonical learning/diagnostic artifact owning its question text and direct answer.

### Align Questions to Knowledge

Associate existing Questions with the KnowledgeNodes they exercise or concern.

Alignment is an explicit preparation activity. Importing a Question does not imply that its knowledge alignment is already known.

### Define Learning Target

Create or select a LearningTarget and associate the Requirements or RequirementSets that define what the learner needs to achieve.

### Build Study Set

Resolve the current learning target through its requirements to relevant KnowledgeNodes and select the Questions aligned to that knowledge.

The resulting Study Set is an application-level materialization: a selected set of canonical Questions for a particular learning preparation flow. It does not become reusable subject truth and does not introduce a new tactical domain entity.

For the current slice, dependency-sensitive ordering, automatic prioritization from learner statistics and evidence-based filtering are deferred.

### Materialize for External Study

Transform a Study Set into the representation required by a selected external learning runtime.

A runtime-specific card is a derived representation of a Question, not a canonical Prep domain object. The concrete external representation and protocol are owned downstream by machine-interface/technical design.

### Export Study Material

Send the materialized study representation to an external learning runtime.

Application Design owns the orchestration intent. External API/protocol contracts and technical transport are not owned here.

### Import Review Results

Receive review results from an external learning runtime, resolve them back to canonical Questions, and record ReviewObservations in the Learner Model.

The mapping and external representation needed to identify corresponding external items are downstream machine-interface/integration concerns.

### Record Learning Statistics

Persist the accepted Question-level ReviewObservations so review history and statistics can be reproduced.

The current application flow stops at recording statistics. Interpretation into learner state, retention, mastery, gaps, priorities or automatic replanning is deferred.

## Composition

```text
Data preparation

Import Knowledge
Import Requirements
Import Questions
Align Questions to Knowledge


Learning preparation

Define Learning Target
  -> resolve Requirements
  -> resolve KnowledgeNodes
  -> select aligned Questions
  -> Study Set


External study

Study Set
  -> materialize for external runtime
  -> export
  -> external learning activity
  -> import review results
  -> record Question-level ReviewObservations
```

These are independent application flows. Data preparation is not required to happen as one pipeline and each kind of canonical data may be populated separately.

## Ownership boundaries

Application Design owns:

- orchestration of the independent import/preparation flows;
- target-to-requirement-to-knowledge-to-question traversal used to prepare study;
- Study Set materialization;
- orchestration of export and result-import flows;
- coordination of accepted domain models without redefining them.

Application Design does not own:

- KnowledgeNode, Requirement, Question or ReviewObservation semantics;
- file/API/message representation contracts;
- external-runtime card schemas or API semantics;
- external-item mapping representation;
- database/storage schema;
- human-interface composition;
- runtime/component topology.

## Deferred behavior

- interpretation of review statistics into learner state;
- evidence-strength/confidence models;
- retention/decay interpretation;
- automatic reprioritization or replanning from review statistics;
- dependency-aware question ordering;
- generalized study representations beyond requirements demonstrated by concrete learning runtimes.
