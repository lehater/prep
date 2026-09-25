# Screen / View Design

## Purpose

Define the minimum implementation-independent view responsibilities for the accepted target-centric workflow and global reusable Library. This artifact is currently blocked from final acceptance by the unresolved Study Set preparation-gate semantics recorded in Core.

## Application shell

Primary global navigation exposes:

- **Targets**;
- **Library**.

A secondary integration/status/settings affordance may expose configured external-runtime state.

Study, Statistics and Import are not required as primary global destinations.

## Targets workspace

Purpose: find, create and resume LearningTargets.

Capabilities:

- browse/open existing targets;
- create a target;
- expose enough target identity/definition to choose the intended work context.

Opening a target enters the Target workspace.

## Target workspace

Purpose: keep one LearningTarget as the working context while the user prepares learning material, sends it to the external runtime and inspects returned review facts.

The workspace contains semantic sections below. They may be realized as tabs, nested routes, panels or another accessible composition; that realization remains downstream.

### Overview

Shows:

- target identity/definition;
- selected Requirement/RequirementSet count/list;
- factual missing Requirement-to-Knowledge alignment;
- target-resolved Knowledge count/list;
- resolved Knowledge with no aligned Questions;
- target-resolved Question count;
- factual ReviewObservation summary for currently relevant Questions when available.

It does not show inferred mastery, readiness, retention or automatic priority.

### Scope

Shows selected Requirements/RequirementSets and supports add/remove assignment.

The user selects existing reusable Library objects through searchable canonical selection. Creating a missing Requirement from this context creates a reusable Library object and returns to the target assignment flow.

RequirementSet composition remains canonical RequirementSet editing and preserves cycle-rejection behavior.

### Knowledge

Shows KnowledgeNodes reached from the target's currently selected requirements through accepted alignment.

Capabilities:

- browse/search within the target-derived Knowledge set as supported;
- open canonical Knowledge detail;
- navigate relationships;
- align a Requirement to existing Knowledge where the underlying application operation is available;
- create missing reusable Knowledge and then align it;
- optionally switch to a target-scoped graph projection.

Missing alignment remains explicit.

### Questions

Shows Questions reached through target-resolved KnowledgeNodes.

Capabilities:

- browse/open target-relevant Questions;
- open canonical Question detail;
- create a reusable Question and align it to Knowledge;
- expose target-relevant Knowledge for which no aligned Questions exist.

Questions remain global reusable objects, not children owned by the target.

### Study

Shows the Study Set derived for the current target, including canonical Question identities/content and missing-preparation diagnostics supplied by the accepted application behavior.

Capabilities:

- request/build the Study Set when allowed by accepted preparation semantics;
- inspect resulting Questions;
- export/reconcile Questions through the configured external runtime;
- display per-Question export/reconciliation outcomes;
- retry recoverable external-runtime failures without losing the Study Set context.

The exact action availability/behavior when preparation is incomplete is unresolved by Q-STUDY-SET-PREPARATION-GATE.

### Statistics

Shows Question-level ReviewObservations and factual aggregates for Questions currently resolved into the target context.

It provides navigation to canonical Question detail/history and does not label observations as target mastery, readiness, proficiency or retention.

If target composition later changes, this view remains a current projection rather than claiming immutable historical target attribution.

## Library workspace

Purpose: maintain reusable canonical corpora independently of any target.

Library provides entity contexts for:

- Knowledge;
- Requirements/RequirementSets;
- Questions.

These are semantic subareas of one reusable Library; they are not required to be three peer global application destinations.

### Knowledge collection/detail

Collection: browse/search/create KnowledgeNodes, access contextual Knowledge import and optionally switch to a broader graph projection.

Detail/editor: inspect/edit semantic kind/content and manage typed incoming/outgoing KnowledgeRelations through canonical selection.

### Requirements collection/detail

Collection: browse/search/create Requirements and RequirementSets and access contextual requirements import.

Requirement detail/editor: edit accepted content and Knowledge alignments.

RequirementSet detail/editor: edit accepted content and membership; cycle rejection remains visible and preserves editing state.

### Questions collection/detail

Collection: browse/search Questions using only query semantics actually supported upstream, create/open Questions and access contextual question import.

Question detail/editor: edit question/direct answer, Knowledge alignments and factual review history when available.

## Knowledge graph projection

Graph is a projection of accepted KnowledgeNodes/KnowledgeRelations in either global-Library or target-derived scope.

Selecting a node opens the same canonical Knowledge detail used by list/search. Dragging, camera movement or layout manipulation changes presentation state only.

All core maintenance/navigation remains possible without the graph. 2D versus 3D remains deliberately unresolved pending demonstrated task benefit.

## Import flow

Import begins from the relevant Library data kind.

It accepts the supported prepared-data document and reports total/applied/rejected outcomes, per-item rejection identity/reason and created/updated/duplicate-skipped/rejected outcomes where supplied by the machine contract.

Import is a contextual flow rather than a mandatory persistent workspace.

## Integration/configuration

A compact status/settings view may expose configured external-runtime endpoint/status for the single-user deployment. Secrets are not echoed after entry.

Infrastructure-specific diagnostics remain downstream.

## Common states and navigation invariants

Server-backed views distinguish loading, empty, loaded, validation-rejected, recoverable-failure and unavailable/degraded states.

Editors preserve recoverable input.

Target-derived references navigate to canonical global detail while preserving a return path to the active target.

Graph selection and Library selection resolve to the same Knowledge detail identity.

No core operation requires raw IDs or graph manipulation.

## Unresolved screen contract

The Study section cannot be finalized until Application Design decides:

- the exact condition for sufficient preparation of a LearningTarget;
- whether insufficient preparation disables Study Set construction or allows construction with explicit missing-preparation diagnostics.

## Deliberately unconstrained

Exact routes, tab/sidebar/panel mechanics, modal versus page editors, responsive layouts, table columns, graph library/physics, component library, typography, colors and animation remain downstream.
