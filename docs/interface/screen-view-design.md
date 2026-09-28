# Screen / View Design

## Purpose

Define implementation-independent composition for the accepted frontend topology. Every view inherits `PREP-PRESENTATION-SYSTEM` and consumes only accepted interaction/machine contracts.

## Shared rules

- Active target persists across all target-work views.
- Active focus persists across Gaps, Learning, Diagnostics, Knowledge and Progress.
- Curation collections are search/browse-first; editors preserve recoverable draft state.
- Loading, empty, validation/conflict, unavailable/degraded and recoverable failure states remain distinguishable where supported.
- Responsive reflow preserves semantic/focus order.
- Graph state is presentation state only.
- Current Question terminology appears only inside compatibility learning/runtime flows.

## [F-00-APPLICATION-SHELL]

**Purpose:** preserve global task context and runtime-status access.

Regions:
- global navigation — primary;
- active target context when present — supporting;
- active workspace — primary;
- runtime status — secondary.

Responsive:
- wide: persistent left rail;
- narrow: compact accessible navigation disclosure;
- focus/read order: navigation → target context → workspace → runtime status.

## [F-LT-TARGET-WORKSPACE]

**Purpose:** preserve one active target across the full target-relative loop.

Regions:
- target identity/context — primary;
- target-local navigation — primary;
- current focus summary — secondary;
- active child view — primary.

Target-local navigation:
Overview / State / Gaps / Learning / Diagnostics / Knowledge / Progress.

## [L-01-TARGETS]

**Task:** `TASK-L-ESTABLISH-TARGET`

Reads: `learning.targets.list`, `learning.targets.get`.

Regions:
- search/browse controls — secondary;
- target collection — primary;
- selected target requirement summary — primary;
- prepare-new-target affordance — secondary.

States: loading, empty, ready, failure.

Primary action: activate suitable target.

Empty state explicitly routes to target preparation.

Responsive: controls precede collection; detail follows selection.

## [L-02-TARGET-OVERVIEW]

**Task:** `TASK-L-UNDERSTAND-TARGET`

Reads: `learning.targets.get`, `learning.target.knowledge.list`.

Regions:
- target context/definition — primary;
- requirement/capability structure — primary;
- standards/conditions — supporting;
- related Knowledge entry points — secondary;
- preparation issue indicator — secondary.

Primary action: continue to State.

Responsive: target context → requirement structure → supporting details.

## [L-03-TARGET-STATE]

**Task:** `TASK-L-ESTABLISH-CURRENT-STATE`

Reads: `learning.target.state.get`, `learning.target.evidence.get`, `learning.target.diagnostics.list`.

Regions:
- state summary — primary;
- requirement-state projection — primary;
- evidence basis/detail — secondary;
- unresolved/diagnostic opportunities — secondary.

States: loading, ready, insufficient-evidence, conflicting-evidence, failure.

Required semantic distinctions: satisfied / unresolved / challenged.

Primary actions:
- inspect basis;
- gather evidence for unresolved area;
- continue to Gaps.

Responsive: state projection remains first; evidence/diagnostics follow or move to drawers.

## [L-04-TARGET-GAPS]

**Tasks:** `TASK-L-REVIEW-GAPS`, `TASK-L-CHOOSE-NEXT-FOCUS`

Reads/commands: `learning.target.gaps.get`, `learning.target.focus.get`, `learning.target.focus.set`.

Regions:
- gap collection/requirement structure — primary;
- selected gap detail and basis — primary;
- current focus/rationale — secondary;
- next-action choices — primary;
- support-availability warning — secondary.

Primary actions:
- choose learning focus;
- choose diagnostic focus;
- inspect Knowledge;
- route to Curation for missing support.

No scalar proficiency score is introduced.

Responsive: gap list/structure → selected detail → next actions.

## [L-05-TARGET-LEARNING]

**Task:** `TASK-L-LEARN-OR-PRACTISE`

Reads/commands: `learning.target.support.list`, `learning.target.activity.start`, runtime status.

Regions:
- active focus — primary;
- available learning material — primary;
- practice/task opportunities — primary;
- support diagnostics — secondary;
- runtime/delegation controls — secondary.

States: loading, empty-support, ready, activity-active, runtime-unavailable, failure.

Question-compatible Study Set/export may be presented as one support profile inside this view, not as the view's organizing model.

Responsive: focus → material/tasks → diagnostics → delegation.

## [L-06-TARGET-DIAGNOSTICS]

**Task:** `TASK-L-COLLECT-EVIDENCE`

Reads/commands: `learning.target.diagnostics.list`, `learning.target.activity.start`, `learning.evidence.sync`, `learning.target.evidence.get`.

Regions:
- diagnostic target/focus — primary;
- diagnostic opportunities — primary;
- active/performed task context — primary;
- observations/provenance — primary;
- derived claims/arguments — secondary;
- sync/runtime status — secondary.

States: loading, empty, ready, activity-active, syncing, partial-failure, runtime-unavailable, failure.

Raw observation facts and inferred claims remain visually distinct.

## [L-07-TARGET-KNOWLEDGE]

**Task:** `TASK-L-EXPLORE-RELEVANT-KNOWLEDGE`

Reads: `learning.target.knowledge.list`, `learning.target.knowledge.projection`.

Regions:
- search/filter/control band — secondary;
- bounded semantic results — supporting;
- 3D graph on capable environments — primary;
- selected Knowledge detail — supporting;
- non-spatial access — primary fallback/equivalent path.

Controls:
search; semantic filters; relation-predicate filters; Focus/Clear focus; Fit; Reset; graph settings.

Selection never implicitly changes scope. Explicit focus is reversible.

Responsive:
- wide: optional results + dominant graph + detail;
- compact: graph dominant, detail below/drawer;
- narrow: full-width graph or non-spatial access, results/detail disclosures.

Renderer degradation preserves task-complete non-spatial access.

## [L-08-TARGET-PROGRESS]

**Task:** `TASK-L-REVIEW-PROGRESS`

Reads: `learning.target.progress.get`, state/gaps/focus projections.

Regions:
- comparison summary — primary;
- changed target fragments — primary;
- unchanged/unresolved/challenged fragments — supporting;
- new evidence basis — secondary;
- gap/focus change summary — primary;
- next adaptation action — primary.

States: loading, no-change, changed, increased-uncertainty, failure.

Primary actions:
- continue focus;
- choose another gap;
- gather more evidence.

## [F-C-CURATION-WORKSPACE]

**Purpose:** preserve corpus-authoring context.

Destinations:
Targets / Capabilities / Knowledge / Learning Support / Assessment / Import / Quality.

## [C-11-TARGET-COLLECTION]

**Task:** `TASK-C-MAINTAIN-TARGETS`

Reads/commands: target collection operations + capability lookup.

Regions:
- search/browse — primary;
- target results — primary;
- create-target action — secondary;
- bulk-import entry — secondary.

Primary action: open an existing target or start a new target profile.

## [C-12-TARGET-EDITOR]

**Task:** `TASK-C-MAINTAIN-TARGETS`

Reads/commands: target detail/update operations + capability lookup.

Regions:
- target context/definition — primary;
- required CapabilitySpecification selection/composition — primary;
- validation/conflict — secondary;
- save/cancel — primary;
- Target Work preview/return — secondary.

RequirementExpression semantics remain upstream; the editor must not flatten accepted boolean semantics into an inaccurate list when richer composition is present.

## [C-21-CAPABILITY-COLLECTION]

**Task:** `TASK-C-MAINTAIN-CAPABILITIES`

Regions:
- search/browse — primary;
- reusable capability results — primary;
- create/import entry — secondary.

Learner-specific state is excluded.

## [C-22-CAPABILITY-EDITOR]

**Task:** `TASK-C-MAINTAIN-CAPABILITIES`

Regions:
- capability identity/title — primary;
- PerformanceExpectation — primary;
- condition space — primary;
- criterion dimensions/constraints and required standard where applicable — primary;
- Knowledge focus — supporting;
- validation/conflict — secondary;
- save/cancel — primary.

The editor defines reusable capability semantics and never embeds one learner's evidence, gap or priority.

## [C-31-KNOWLEDGE-WORKSPACE]

**Task:** `TASK-C-MAINTAIN-KNOWLEDGE`

Uses the same 3D-default + task-complete non-spatial guardrails as target Knowledge, with global/corpus scope.

Regions:
- search/filter controls — secondary;
- bounded Knowledge results — supporting;
- 3D graph on capable environments — primary;
- selected Knowledge detail — supporting;
- compact create/import entry — secondary.

Authoring actions remain compact until explicitly invoked.

## [C-32-KNOWLEDGE-EDITOR]

**Task:** `TASK-C-MAINTAIN-KNOWLEDGE`

Regions:
- KnowledgeObject/KnowledgeProposition identity/content — primary;
- proposition predicate/participants/conditions where applicable — primary;
- semantic relationship context — supporting;
- validation/conflict — secondary;
- save/cancel — primary.

Editing preserves accepted proposition semantics; renderer geometry is never persisted as Knowledge meaning.

## [C-41-LEARNING-SUPPORT-COLLECTION]

**Task:** `TASK-C-MAINTAIN-LEARNING-SUPPORT`

Reads: `curation.learning_support.list/get`.

Regions:
- search/browse — primary;
- support results and kind — primary;
- create/import entry — secondary;
- explicit support diagnostics where defined — supporting.

Artifact count is never rendered as adequacy.

## [C-42-LEARNING-SUPPORT-EDITOR]

**Task:** `TASK-C-MAINTAIN-LEARNING-SUPPORT`

Commands: `curation.learning_support.create/update`.

Regions:
- support kind/content — primary;
- intended CapabilitySpecification — primary;
- related Knowledge — supporting;
- explicit support diagnostics where defined — secondary;
- validation/conflict — secondary;
- save/cancel — primary.

Saving support records design intent only; it does not create learner evidence.

## [C-51-ASSESSMENT-COLLECTION]

**Task:** `TASK-C-MAINTAIN-ASSESSMENT-DESIGN`

Reads: `curation.assessment_design.list/get`.

Regions:
- search/browse — primary;
- assessment-design results — primary;
- target capability summary — supporting;
- create/import entry — secondary.

## [C-52-ASSESSMENT-EDITOR]

**Task:** `TASK-C-MAINTAIN-ASSESSMENT-DESIGN`

Commands: `curation.assessment_design.create/update`.

Regions:
- target CapabilitySpecifications — primary;
- TaskSpecifications — primary;
- ObservationSpecifications — primary;
- EvidencePatterns/EvidentialWarrants — primary;
- SamplingSpecification where applicable — supporting;
- semantic validation — secondary;
- save/cancel — primary.

Incomplete design cannot produce a learner capability conclusion.

## [C-61-IMPORT]

**Tasks:** `TASK-C-PREPARE-BULK-DATA`, `TASK-C-IMPORT-BULK-DATA`

Reads/commands: `curation.import.contract.get`, `curation.import.validate`, `curation.import.apply`.

Regions:
1. schema/version and supported data kinds — primary;
2. external-agent/tool preparation example — primary;
3. input document selection — primary;
4. validation summary — primary;
5. per-item validation outcomes — supporting;
6. explicit Apply action — primary;
7. apply result and per-item terminal outcomes — primary.

Validation never silently applies data.

States: idle, contract-ready, validating, validation-rejected, ready-to-apply, applying, applied, partially-applied, failure.

## [C-71-QUALITY]

Read: `curation.quality.get`.

Regions:
- known diagnostics — primary;
- owning semantic area — secondary;
- navigate-to-fix action — primary.

Empty diagnostics means only “no known reported issue”, not proven completeness.

## [S-01-RUNTIME-STATUS]

Read: `integration.external_runtime.status.get`.

Shows reachable/unavailable, compatible/incompatible and non-secret profile summary.

## Knowledge visualization verification obligations

The 3D-default Knowledge views must verify:

- search → selection/focus works;
- selection and focus differ;
- relation predicate/direction is inspectable without geometry alone;
- off-camera/occluded Knowledge remains discoverable;
- non-spatial search/list/detail completes core Knowledge tasks;
- target/focus scoping is preserved;
- renderer degradation never alters semantic truth;
- wide/compact/narrow reflow preserves target/focus and focus order.

## Deliberately unconstrained

Exact routes, DOM hierarchy, component split, CSS mechanics, drawer/modal choice, framework primitives, graph library internals and private renderer tuning remain downstream.
