# Screen / View Design

## Purpose

Define the minimum implementation-independent view responsibilities for the accepted two-mode product: target-centric Learning and reusable-data/target-profile Curation.

## Application shell

The shell provides an explicit way to enter/switch between:

- **Learning**;
- **Curation**.

A secondary integration/status affordance may expose configured external-runtime state via `integration.external_runtime.status.get`.

Study and Statistics remain inside Learning target context. Import is entered from Curation/Library context.

## Learning target selection

Purpose: choose the prepared learning profile to study.

Capabilities:

- browse/search existing curated LearningTargets;
- open/select one target;
- expose enough target identity/definition/scope summary to choose the intended learning context.

Learning mode does not create, edit or recompose LearningTargets.

Opening a target enters the learner Target workspace.

## Target workspace

Purpose: keep one LearningTarget as the learner's working context while available material is explored, sent to the external runtime and later reviewed through factual statistics.

The workspace contains semantic sections below. They may be realized as tabs, nested routes, panels or another accessible composition.

### Overview

Shows:

- target identity/definition;
- curated Requirements/RequirementSets as inspectable read-only scope;
- currently resolved Knowledge count/summary;
- currently resolvable Question count;
- Study Set empty/non-empty state;
- factual ReviewObservation summary for currently relevant Questions when available.

The learner may navigate from scope entries to readable related context but cannot mutate target composition.

It does not show inferred mastery, readiness, retention, automatic priority or learning-material coverage percentage.

Detailed curation-quality diagnostics belong to Curation.

### Knowledge

Shows KnowledgeNodes reached from the target's current Requirement-to-Knowledge alignments.

Learner capabilities:

- browse/read target-derived Knowledge;
- open canonical Knowledge detail in learner context;
- navigate accepted relations;
- optionally switch to a target-scoped graph projection.

Knowledge creation/editing, relation maintenance and alignment repair are Library curation capabilities.

### Study

Owns the learner-facing target Question collection and builds/shows the Study Set derived from all currently resolvable Questions for the current target.

Regions/capabilities:

- Question/material summary for the current target;
- browse/open the currently resolvable Questions;
- inspect question/direct-answer content and navigate to relevant Knowledge;
- request/build Study Set without a corpus-completeness gate;
- represent valid empty result when no Questions resolve;
- inspect the exact previewed Question set;
- export/reconcile that preview through the configured external runtime;
- display per-Question export/reconciliation outcomes;
- retry recoverable external-runtime failures without losing target context.

The view must not claim that a non-empty Study Set completely covers the target.

### Statistics

Shows Question-level ReviewObservations and factual aggregates for Questions currently resolved into the target context.

It provides navigation to canonical Question detail/history and does not label observations as target mastery, readiness, proficiency or retention.

If target composition later changes, this remains a current projection rather than immutable historical target attribution.

## Curation workspace

Purpose: maintain prepared target profiles and reusable canonical learning data independently of the learner workflow.

Curation provides contexts for:

- LearningTargets;
- Knowledge;
- Requirements/RequirementSets;
- Questions.

### LearningTarget collection/detail

Collection: browse/search/create prepared LearningTargets.

Detail/editor: edit target definition and compose its scope from reusable Requirements/RequirementSets. These operations define what Learning mode later exposes as a selectable prepared target/profile.

### Library

Knowledge, Requirements/RequirementSets and Questions form the reusable Library within Curation. They are semantic subareas, not necessarily peer global destinations.

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

Future semantic learning-material/evidence coverage belongs to Curation, but no numeric/graded UI is defined until Q-LEARNING-COVERAGE-MODEL is resolved.

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

## Integration status

A compact status view may expose reachability/compatibility and a non-secret summary of the configured external-runtime endpoint/profile.

Endpoint/bind/API-key editing remains deployment configuration in v1 and is not invented as a browser product workflow.

Infrastructure-specific diagnostics remain downstream.

## Machine-operation bindings

Concrete browser/server views bind to the accepted operation IDs below.

| View/context | Read operations | Command operations |
|---|---|---|
| Learning target selection | `learning.targets.list` | — |
| Target Overview | `learning.targets.get`, `learning.target.statistics.get` | `learning.reviews.sync` when the user explicitly refreshes review facts |
| Target Knowledge list | `learning.target.knowledge.list` | — |
| Target Knowledge graph | `learning.target.knowledge.graph` | — |
| Target Study | `learning.target.questions.list`, `learning.target.study_set.build` | `learning.target.study_set.export` |
| Target Statistics | `learning.target.statistics.get` | `learning.reviews.sync` |
| Question review history | `learning.question.reviews.get` | — |
| Curation Targets | `curation.targets.list`, `curation.targets.get` | `curation.targets.create`, `curation.targets.update`, `curation.targets.scope.add`, `curation.targets.scope.remove` |
| Curation Knowledge | `curation.knowledge.list`, `curation.knowledge.get`, `curation.knowledge.graph` | `curation.knowledge.create`, `curation.knowledge.update`, relation add/remove |
| Curation Requirements | `curation.requirements.list`, requirement/set get | requirement/set create/update, membership add/remove, Knowledge align/unalign |
| Curation Questions | `curation.questions.list`, `curation.questions.get` | create/update, Knowledge align/unalign |
| Curation Import | — | `curation.import.apply` |
| Runtime status | `integration.external_runtime.status.get` | — |

Search/filter controls on server-backed collections use the corresponding backend collection operation. Client-only filtering over an arbitrary partial page is not a supported primary catalogue behavior.

Study Set preview uses `materialization_token`; stale preview at export maps to a visible recoverable conflict state requiring rebuild/reinspection.

Review ingestion is explicitly user-triggerable via `learning.reviews.sync` in v1; the UI must not imply continuous/background synchronization that the accepted architecture does not provide.

## Common states and navigation invariants

Server-backed views distinguish loading, empty, loaded, validation-rejected, recoverable-failure and unavailable/degraded states.

Curation editors preserve recoverable input.

Target-derived references and Library entries preserve canonical object identity while exposing context-appropriate actions.

No learner operation requires raw IDs, semantic curation or graph manipulation.

## Current status

Low-fidelity task validation reduced learner navigation to four sections: Overview, Knowledge, Study and Statistics.

Scope is part of Overview; Questions are part of Study. This removes two learner destinations that had no independent v1 task while preserving all accepted semantics.

The broader learning-material/evidence coverage research does not block the current Question-first learner slice and must not be represented as a fake completeness percentage.

## Deliberately unconstrained

Exact routes, tab/sidebar/panel mechanics, modal versus page editors, responsive layouts, table columns, graph library/physics, component library, typography, colors, animation and future progress-overlay encoding remain downstream.
