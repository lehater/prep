# Screen / View Design

## Purpose

Define the minimum implementation-independent view responsibilities for the accepted two-mode product: target-centric Learning and reusable-data/target-profile Curation.

The whole-product page/frame topology and coarse low-fidelity frames are maintained in `docs/interface/site-map.md`. That map is a projection of this contract and exists to keep screen responsibilities and transitions explicit before visual design or frontend implementation.

## [F-00-APPLICATION-SHELL] Application shell

The shell provides an explicit way to enter/switch between:

- **Learning**;
- **Curation**.

A secondary integration/status affordance may expose configured external-runtime state via `integration.external_runtime.status.get`.

Study and Statistics remain inside Learning target context. Import is entered from Curation/Library context.

## [L-01-TARGET-SELECTION] Learning target selection

Purpose: choose the prepared learning profile to study.

Capabilities:

- browse/search existing curated LearningTargets;
- open/select one target;
- expose enough target identity/definition/scope summary to choose the intended learning context.

Learning mode does not create, edit or recompose LearningTargets.

Opening a target enters the learner Target workspace.

## [F-LT-TARGET-WORKSPACE] Target workspace

Purpose: keep one LearningTarget as the learner's working context while available material is explored, sent to the external runtime and later reviewed through factual statistics.

The workspace contains semantic sections below. They may be realized as tabs, nested routes, panels or another accessible composition.

### [L-02-TARGET-OVERVIEW] Overview

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

### [L-03-TARGET-KNOWLEDGE] Knowledge

Shows KnowledgeNodes reached from the target's current Requirement-to-Knowledge alignments.

Learner capabilities:

- browse/search target-derived Knowledge;
- explore the same nodes in an interactive target-scoped graph;
- open canonical Knowledge detail in learner context;
- navigate accepted relations;
- filter graph nodes by semantic kind;
- toggle accepted relation types;
- focus a node/local neighborhood;
- preserve graph camera/filter/focus state while opening and closing readable detail.

Knowledge creation/editing, relation maintenance and alignment repair are Library curation capabilities.

### [L-04-TARGET-STUDY] Study

Owns the learner-facing target Question collection and builds/shows the Study Set derived from all currently resolvable Questions for the current target.

Regions/capabilities:

- Question/material summary for the current target;
- browse/open the currently resolvable Questions;
- inspect question/direct-answer content and navigate to relevant Knowledge;
- **Show in Knowledge Map** for a Question, opening Target Knowledge with all aligned KnowledgeNodes focused/highlighted and current target scope preserved;
- request/build Study Set without a corpus-completeness gate;
- represent valid empty result when no Questions resolve;
- inspect the exact previewed Question set;
- export/reconcile that preview through the configured external runtime;
- display per-Question export/reconciliation outcomes;
- retry recoverable external-runtime failures without losing target context.

The view must not claim that a non-empty Study Set completely covers the target.

### [L-05-TARGET-STATISTICS] Statistics

Shows Question-level ReviewObservations and factual aggregates for Questions currently resolved into the target context.

It provides navigation to canonical Question detail/history and does not label observations as target mastery, readiness, proficiency or retention.

If target composition later changes, this remains a current projection rather than immutable historical target attribution.

## [F-C-CURATION-WORKSPACE] Curation workspace

Purpose: maintain prepared target profiles and reusable canonical learning data independently of the learner workflow.

Curation provides contexts for:

- LearningTargets;
- Knowledge;
- Requirements/RequirementSets;
- Questions.

### [C-11-TARGET-COLLECTION] LearningTarget collection

Browse/search/create prepared LearningTargets.

### [C-12-TARGET-EDITOR] LearningTarget detail / editor

Edit target definition and compose its scope from reusable Requirements/RequirementSets. These operations define what Learning mode later exposes as a selectable prepared target/profile.

### Library

Knowledge, Requirements/RequirementSets and Questions form the reusable Library within Curation. They are semantic subareas, not necessarily peer global destinations.

### [C-21-KNOWLEDGE-WORKSPACE] Knowledge workspace

Browse/search/create KnowledgeNodes, access contextual Knowledge import and optionally switch to a broader graph projection.

### [C-22-KNOWLEDGE-EDITOR] Knowledge detail / editor

Inspect/edit semantic kind/content and manage typed incoming/outgoing KnowledgeRelations through canonical selection.

### [C-31-REQUIREMENTS-COLLECTION] Requirements collection

Browse/search/create Requirements and RequirementSets and access contextual requirements import.

### [C-32-REQUIREMENT-EDITOR] Requirement detail / editor

Edit accepted content and Knowledge alignments.

### [C-33-REQUIREMENTSET-EDITOR] RequirementSet detail / editor

Edit accepted content and membership; cycle rejection remains visible and preserves editing state.

### [C-41-QUESTIONS-COLLECTION] Questions collection

Browse/search Questions using only query semantics actually supported upstream, create/open Questions and access contextual question import.

### [C-42-QUESTION-EDITOR] Question detail / editor

Edit question/direct answer, Knowledge alignments and factual review history when available.

Structural diagnostics such as unaligned Questions or Knowledge with no Questions may be shown when backed by accepted queries.

Future semantic learning-material/evidence coverage belongs to Curation, but no numeric/graded UI is defined until Q-LEARNING-COVERAGE-MODEL is resolved.

## Knowledge graph projection

Graph is a projection of accepted KnowledgeNodes/KnowledgeRelations in either Curation-global or Learning-target scope.

### Prototype composition

The frontend prototype includes a 3D graph canvas with coordinated supporting regions:

```text
Knowledge
┌─────────────────────────────────────────────────────────────┐
│ Search   [semantic kinds]   [relation types]   [reset/focus]│
├───────────────────────────────────────┬─────────────────────┤
│                                       │ selected Knowledge  │
│              3D graph                 │ readable detail     │
│                                       │ relations           │
│                                       │ [open full detail]  │
└───────────────────────────────────────┴─────────────────────┘
```

Required interactions:

- orbit/pan/zoom the 3D projection;
- click without drag selects a node and opens in-context detail;
- drag/rotate manipulates presentation only;
- focus selected node and a bounded local neighborhood;
- toggle accepted relation types, initially `addresses` and `realizes`;
- filter semantic kinds Concept / Mechanism / Procedure / Strategy;
- preserve graph state while inspecting detail;
- restore target/global scope after focus;
- enter from Study Question with all aligned KnowledgeNodes focused/highlighted.

Relation type/direction must remain inspectable via labels, legend, interaction or another explicit encoding; geometric position alone is insufficient.

All core access remains possible through list/search/detail. The prototype must compare 3D against a simpler baseline for the same tasks rather than assuming visual appeal implies learning value.

### Evaluation tasks

At minimum test:

1. identify what is directly connected to a concept and by what relation;
2. explain the relational context of one selected KnowledgeNode;
3. move from a Study Question to the supporting Knowledge and describe its neighborhood;
4. filter the graph to one relation type and recover the intended structure;
5. return to a previously inspected node without excessive disorientation.

Observe task correctness, completion time, navigation errors/disorientation and qualitative usefulness. 3D remains a product hypothesis until this evidence is collected.

### Future learner-state overlay

A target-scoped graph may later visualize inferred KnowledgeNode state so the learner can compare target-required knowledge with evidence-backed progress.

This view is not currently implementable as learner-state truth because no accepted Question -> KnowledgeNode state inference exists. Raw review counts/ratings must not be encoded as "degree learned."

## [S-02-IMPORT-FLOW] Import flow

Import begins from the relevant Library data kind.

It accepts the supported prepared-data document and reports total/applied/rejected outcomes, per-item rejection identity/reason and created/updated/duplicate-skipped/rejected outcomes where supplied by the machine contract.

## [S-01-RUNTIME-STATUS] Integration status

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
| Target Study | `learning.target.questions.list`, `learning.target.study_set.build` | `learning.target.study_set.export`; Question -> Knowledge Map is local navigation using existing question knowledge references |
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
