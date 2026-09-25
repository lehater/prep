# Screen / View Design

## Purpose

Define the minimum implementation-independent view responsibilities for the accepted target-centric learner workflow and global reusable Library curation.

Target-scope authorship remains unresolved by Q-TARGET-SCOPE-AUTHORSHIP; therefore the Scope interaction contract is intentionally incomplete while the rest of the view model is revalidated.

## Application shell

Primary global navigation exposes:

- **Targets**;
- **Library**.

A secondary integration/status/settings affordance may expose configured external-runtime state.

Study and Statistics are not primary global destinations. Import is entered from Library context.

## Targets workspace

Purpose: find, create and resume LearningTargets.

Capabilities:

- browse/open existing targets;
- create a target;
- expose enough target identity/definition to choose the intended work context.

Opening a target enters the learner Target workspace.

## Target workspace

Purpose: keep one LearningTarget as the learner's working context while available material is explored, sent to the external runtime and later reviewed through factual statistics.

The workspace contains semantic sections below. They may be realized as tabs, nested routes, panels or another accessible composition.

### Overview

Shows:

- target identity/definition;
- selected scope summary;
- currently resolved Knowledge count/summary;
- currently resolvable Question count;
- Study Set empty/non-empty state;
- factual ReviewObservation summary for currently relevant Questions when available.

It does not show inferred mastery, readiness, retention, automatic priority or Question-coverage percentage.

Detailed curation-quality diagnostics belong to Library.

### Scope

Shows the target's selected Requirements/RequirementSets.

Exactly how scope is established is blocked by Q-TARGET-SCOPE-AUTHORSHIP. The view must not yet assume one of these alternatives:

- learner directly selects individual reusable Requirements;
- learner selects a curated target/profile whose scope is predefined;
- curation/system logic establishes scope through another accepted operation.

### Knowledge

Shows KnowledgeNodes reached from the target's current Requirement-to-Knowledge alignments.

Learner capabilities:

- browse/read target-derived Knowledge;
- open canonical Knowledge detail in learner context;
- navigate accepted relations;
- optionally switch to a target-scoped graph projection.

Knowledge creation/editing, relation maintenance and alignment repair are Library curation capabilities.

### Questions

Shows currently available Questions reached through target-resolved KnowledgeNodes.

Learner capabilities:

- browse/open target-relevant Questions;
- inspect question/direct-answer content according to the learning interaction;
- navigate to relevant Knowledge.

Question creation/editing, alignment and semantic coverage-quality work are Library curation capabilities.

### Study

Builds and shows the Study Set derived from all currently resolvable Questions for the current target.

Capabilities:

- request/build Study Set without a corpus-completeness gate;
- represent valid empty result when no Questions resolve;
- inspect resulting Questions;
- export/reconcile Questions through the configured external runtime;
- display per-Question export/reconciliation outcomes;
- retry recoverable external-runtime failures without losing target context.

The view must not claim that a non-empty Study Set completely covers the target.

### Statistics

Shows Question-level ReviewObservations and factual aggregates for Questions currently resolved into the target context.

It provides navigation to canonical Question detail/history and does not label observations as target mastery, readiness, proficiency or retention.

If target composition later changes, this remains a current projection rather than immutable historical target attribution.

## Library workspace

Purpose: maintain reusable canonical corpora independently of any target.

Library provides curation contexts for:

- Knowledge;
- Requirements/RequirementSets;
- Questions.

These are semantic subareas of one reusable Library; they are not required to be three peer global destinations.

### Knowledge collection/detail

Collection: browse/search/create KnowledgeNodes, access contextual Knowledge import and optionally switch to a broader graph projection.

Curation detail/editor: inspect/edit semantic kind/content and manage typed incoming/outgoing KnowledgeRelations through canonical selection.

### Requirements collection/detail

Collection: browse/search/create Requirements and RequirementSets and access contextual requirements import.

Requirement detail/editor: edit accepted content and Knowledge alignments.

RequirementSet detail/editor: edit accepted content and membership; cycle rejection remains visible and preserves editing state.

### Questions collection/detail

Collection: browse/search Questions using only query semantics actually supported upstream, create/open Questions and access contextual question import.

Question detail/editor: edit question/direct answer, Knowledge alignments and factual review history when available.

Structural diagnostics such as unaligned Questions or Knowledge with no Questions may be shown when backed by accepted queries.

Future semantic Question-set coverage adequacy belongs to curation, but no numeric/graded UI is defined until Q-QUESTION-COVERAGE-ADEQUACY is resolved.

## Knowledge graph projection

Graph is a projection of accepted KnowledgeNodes/KnowledgeRelations in either global-Library or target-derived scope.

Selecting a node opens the same canonical Knowledge identity used by list/search. Dragging, camera movement or layout manipulation changes presentation state only.

All core maintenance/navigation remains possible without the graph. 2D versus 3D remains deliberately unresolved pending demonstrated task benefit.

### Future learner-state overlay

A target-scoped graph may later visualize inferred KnowledgeNode state so the learner can compare target-required knowledge with evidence-backed progress.

This view is not currently implementable as learner-state truth because no accepted Question -> KnowledgeNode state inference exists. Raw review counts/ratings must not be encoded as "degree learned."

## Import flow

Import begins from the relevant Library data kind.

It accepts the supported prepared-data document and reports total/applied/rejected outcomes, per-item rejection identity/reason and created/updated/duplicate-skipped/rejected outcomes where supplied by the machine contract.

## Integration/configuration

A compact status/settings view may expose configured external-runtime endpoint/status for the single-user deployment. Secrets are not echoed after entry.

Infrastructure-specific diagnostics remain downstream.

## Common states and navigation invariants

Server-backed views distinguish loading, empty, loaded, validation-rejected, recoverable-failure and unavailable/degraded states.

Curation editors preserve recoverable input.

Target-derived references and Library entries preserve canonical object identity while exposing context-appropriate actions.

No learner operation requires raw IDs, semantic curation or graph manipulation.

## Current unresolved screen contract

Q-TARGET-SCOPE-AUTHORSHIP blocks final composition of Target -> Scope and potentially the first-use Target workflow.

All other current Screen/View responsibilities are revalidated against the learner/curator separation.

## Deliberately unconstrained

Exact routes, tab/sidebar/panel mechanics, modal versus page editors, responsive layouts, table columns, graph library/physics, component library, typography, colors, animation and future progress-overlay encoding remain downstream.
