# Screen / View Design

## Purpose

Define implementation-independent composition for the accepted frontend topology. Every view inherits `PREP-PRESENTATION-SYSTEM` semantics from Presentation System and consumes only accepted interaction/machine contracts.

## Decision-governance revalidation

### View composition

Options were formed from the current topology before selection:

1. topology-aligned task views inside structural Learning/Curation shells;
2. one large Learning view and one large Curation view with all work mixed into panels;
3. split every conceptual sub-object into additional dedicated views beyond the accepted topology.

Review:

- option 1 — **VIABLE**: preserves one primary responsibility per topology view and shared context in structural shells;
- option 2 — **REJECTED**: mixes independent tasks and would erase accepted topology responsibilities;
- option 3 — **REJECTED**: invents navigation/view identities not required by current tasks.

Disposition: **DETERMINED — option 1**.

### Detail/edit placement

Options:

1. always inline/in-context;
2. always dedicated detail/edit views;
3. context-sensitive placement: learner inspection remains in-context where continuity matters, while accepted Curation editors use dedicated task views.

Review:

- option 1 — **REJECTED**: conflicts with accepted dedicated Curation editor views;
- option 2 — **REJECTED**: would break Knowledge exploration continuity for learner inspection;
- option 3 — **VIABLE**.

Disposition: **DETERMINED — option 3**.

### Responsive composition

Options:

1. semantic reflow/disclosure preserving primary work surface, actions and focus order;
2. fixed desktop composition with horizontal scrolling/scaling;
3. hide secondary required information/actions at narrow widths.

Review:

- option 1 — **VIABLE**;
- option 2 — **REJECTED** for usability/accessibility and graph-workspace constraints;
- option 3 — **REJECTED** because required task capabilities would disappear.

Disposition: **DETERMINED — option 1**.

## Shared composition rules

- Learning and Curation remain explicit modes.
- Learning target context persists across Overview, Knowledge, Study and Statistics.
- Curation collections are search/browse-first; editors are focused task contexts.
- Loading, empty, validation/conflict, unavailable/degraded and recoverable failure states remain visually distinguishable where supported by bound operations.
- Recoverable editor input is preserved.
- Responsive reflow preserves semantic order and focus order.
- Knowledge spatial rendering is presentation state only; canonical Knowledge identity/proposition meaning remains available through non-spatial search/list/detail access.
- Current Question terminology may appear only inside the supported Question-compatible study-material workflow.

## [F-00-APPLICATION-SHELL] Application shell

**Purpose:** preserve global mode and runtime-status context.

Regions:

- persistent/compact navigation: Learning, Curation;
- mode-local destinations;
- runtime status affordance;
- active workspace.

Wide: persistent left rail. Narrow: accessible compact disclosure/drawer preserving the same hierarchy.

## [F-LT-TARGET-WORKSPACE] Target workspace

**Purpose:** preserve one active LearningTarget across learner task views.

Persistent context:

- target identity and concise definition;
- Overview / Knowledge / Study / Statistics navigation;
- change-target action.

No target-scope mutation is exposed in Learning mode.

## [L-01-TARGET-SELECTION] Learning target selection

**Purpose:** find and select a prepared target.

Reads: `learning.targets.list`, `learning.targets.get`.

Regions:

- search/browse controls;
- bounded target results with total context;
- concise target definition/scope summary;
- loading/empty/failure states.

Primary action: select target.

Responsive: results reflow to one readable column; search remains first in focus/read order.

## [L-02-TARGET-OVERVIEW] Target overview

**Purpose:** explain the active target, its required capability scope, support status and factual evidence context.

Reads: `learning.targets.get`, `learning.target.study_set.build`, `learning.target.evidence.get`.

Regions:

1. target identity/definition;
2. read-only `RequirementExpression<CapabilitySpecification>`;
3. current support/material summary;
4. preparation diagnostics;
5. factual evidence summary.

The view does not infer mastery/readiness or expose target-scope editing.

Responsive: sections stack in semantic order; diagnostics remain adjacent to the requirement fragment they qualify where practical.

## [L-03-TARGET-KNOWLEDGE] Target Knowledge

**Purpose:** explore target-relevant `KnowledgeObject` and `KnowledgeProposition` semantics.

Reads: `learning.target.knowledge.list`, `learning.target.knowledge.projection`.

Composition:

- compact search/filter/control band;
- bounded search/results access;
- **primary 3D spatial Knowledge surface** on capable environments;
- selected Knowledge detail as supporting context;
- explicit non-spatial search/list/detail path.

Accepted controls inherit Presentation System:

- search;
- Knowledge form/type filter;
- relation-predicate filter;
- explicit Focus / Clear focus;
- Fit;
- Reset camera/view;
- Graph settings / performance profile.

Selection opens/updates detail without implicitly changing semantic membership. Explicit focus is reversible. Camera/depth/layout never imply semantic importance.

Degradation: renderer failure/capability limits preserve task-complete non-spatial access to the same semantic scope.

Responsive:

- wide: optional bounded results + dominant graph + supporting detail;
- compact: graph remains dominant; detail moves below or to disclosure;
- narrow: graph uses full content width; results/detail become ordered disclosures and non-spatial access remains fully usable.

## [L-04-TARGET-STUDY] Target Study

**Purpose:** inspect the current supported-profile material and exact Study Set preview, then export the inspected materialization.

Reads/commands: `learning.target.questions.list`, `learning.target.study_set.build`, `learning.target.study_set.export`.

Regions:

1. Question-compatible study-material results;
2. selected material detail/supporting Knowledge links;
3. exact Study Set subset;
4. preparation diagnostics;
5. preview-currentness state;
6. external-runtime/export outcomes.

States include valid empty, preview ready, stale/conflict, exporting, partial external failure and runtime unavailable.

Primary action: export the currently inspected preview only. Stale conflict requires rebuild/reinspection.

Responsive: preview/diagnostics remain readable before export actions; per-item outcomes become stacked records when narrow.

## [L-05-TARGET-STATISTICS] Target Statistics

**Purpose:** inspect factual learning evidence.

Reads/commands: `learning.target.evidence.get`, `learning.question.evidence.get`, `learning.evidence.sync`.

Regions:

- factual aggregate summary;
- Observation history with relevant context/provenance;
- optional Question-compatible item context;
- explicit sync status/outcomes.

No raw rating/history is labeled as mastery, retention, Gap or LearningPriority.

Responsive: history becomes stacked labeled records; sync action remains reachable without hiding existing evidence during failure.

## [F-C-CURATION-WORKSPACE] Curation workspace

**Purpose:** preserve explicit semantic-authoring context.

Destinations:

- Targets;
- Knowledge;
- Capabilities;
- Study Material.

Import is contextual and may be entered from relevant Curation areas.

## [C-11-TARGET-COLLECTION] LearningTarget collection

**Purpose:** find/create prepared targets.

Reads/commands: `curation.targets.list`, `curation.targets.create`.

Regions: search, bounded results, create action, loading/empty/failure states.

Opening a target enters `C-12-TARGET-EDITOR`.

## [C-12-TARGET-EDITOR] LearningTarget editor

**Purpose:** edit one target and its complete prepared `RequirementExpression<CapabilitySpecification>`.

Reads/commands: `curation.targets.get`, `curation.targets.update`, `curation.capabilities.list`.

Regions:

- target definition;
- requirement-expression composition;
- CapabilitySpecification selector/detail;
- validation/conflict feedback;
- save/cancel.

No learner-mode override is created here.

Responsive: expression editor and capability selector stack while preserving current draft and focus.

## [C-21-KNOWLEDGE-WORKSPACE] Curation Knowledge workspace

**Purpose:** find/explore reusable Knowledge and enter semantic editing.

Reads/commands: `curation.knowledge.list`, `curation.knowledge.projection`, `curation.knowledge.create`.

Uses the same 3D-default spatial presentation and non-spatial access guardrails as Target Knowledge, but with broader Curation scope.

New Knowledge and Import are compact task actions rather than permanently expanded forms.

## [C-22-KNOWLEDGE-EDITOR] Knowledge editor

**Purpose:** edit one `KnowledgeObject` or `KnowledgeProposition`.

Reads/commands: `curation.knowledge.get`, `curation.knowledge.update`.

For KnowledgeObject: coherent content plus optional open knowledge-form classification.

For KnowledgeProposition: proposition content plus predicate/participants/conditions where applicable. Predicate vocabulary is not edited as if it were an asserted relation entity.

Validation preserves draft context.

Responsive: editor may be a bounded pane on wide Knowledge workspace and a focused drawer/stacked region on compact/narrow layouts, while preserving semantic selection context.

## [C-31-CAPABILITY-COLLECTION] Capability collection

**Purpose:** find/create reusable Capability definitions.

Reads/commands: `curation.capabilities.list`, `curation.capabilities.create`.

Regions: search/results, concise performance expectation summary, create action, common collection states.

## [C-32-CAPABILITY-EDITOR] Capability editor

**Purpose:** edit reusable Capability semantics used by target specifications.

Reads/commands: `curation.capabilities.get`, `curation.capabilities.update`, `curation.knowledge.list`.

Regions:

- PerformanceExpectation;
- condition space / criterion dimensions / constitutive constraints as supported;
- Knowledge focus selector;
- validation/conflict feedback;
- save/cancel.

The editor does not display learner-specific capability state as part of reusable Capability definition.

## [C-41-STUDY-MATERIAL-COLLECTION] Study Material collection

**Purpose:** find/create material for the current supported Question-compatible profile.

Reads/commands: `curation.questions.list`, `curation.questions.create`.

Presentation uses the broader label **Study Material**; Question wording may appear inside item/profile detail.

No material-count-based adequacy score is shown.

## [C-42-STUDY-MATERIAL-EDITOR] Study Material editor

**Purpose:** edit one Question-compatible material item and supported Knowledge mappings.

Reads/commands: `curation.questions.get`, `curation.questions.update`, `curation.questions.knowledge.align`, `curation.questions.knowledge.unalign`.

Regions:

- prompt/response compatibility fields;
- Knowledge mapping selector;
- mapping/validation state;
- save/cancel.

The editor does not imply that Question is the universal learning-material model.

## [S-02-IMPORT-FLOW] Import flow

**Purpose:** apply supported prepared input and inspect outcomes.

Command: `curation.import.apply`.

Regions:

- input selection;
- validation/application state;
- aggregate counts;
- per-item created/updated/duplicate/rejected outcomes;
- rejection reason and retry/correction path.

Backend decoding/storage mechanics are not exposed as UI semantics.

## [S-01-RUNTIME-STATUS] Integration status

**Purpose:** inspect external-runtime reachability and compatibility.

Read: `integration.external_runtime.status.get`.

Shows reachable/unavailable, compatible/incompatible and non-secret profile summary.

Deployment endpoint/API-key editing is not part of this frontend slice.

## Knowledge visualization verification obligations

The 3D-default Knowledge views must verify:

- search -> selection/focus remains usable;
- selection and focus are distinct;
- relation predicate/direction is inspectable without geometry alone;
- required Knowledge remains discoverable when off-camera/occluded;
- non-spatial search/list/detail path completes core Knowledge tasks;
- wide/compact/narrow reflow preserves semantic state and focus order;
- accepted performance/capacity degradation never changes canonical Knowledge/proposition meaning;
- renderer failure preserves task-complete semantic access.

## Deliberately unconstrained

Implementation remains free to choose exact routes, DOM hierarchy, CSS Grid/Flexbox mechanics, component split, frontend framework primitives, drawer/modal mechanics, graph library internals and private renderer tuning, provided the contracts above remain true.
