# Plan: Harness-guided Prep revalidation

## Goal

Re-establish Prep's canonical engineering knowledge from the accepted problem space downward, without carrying earlier graph-centered, Anki-centered or implementation-centered assumptions forward unless current evidence supports them.

## Working rule

Follow the pinned canonical `Lehater/harness` dependency model. Upstream changes require downstream revalidation/reconciliation before later design is treated as current.

Historical artifacts are not canonical merely because they remain in Git history.

## Current canonical knowledge

Revalidated project knowledge currently includes:

- Problem Space, Product Vision and Product Capabilities;
- Domain Strategy and Model Context Strategy;
- Knowledge Model, Learning Design and Learner Model;
- Application Design, Task Model and User Journeys;
- Conceptual Interface Model;
- Information Architecture;
- Interaction Design;
- Interface Topology;
- Presentation System and Screen/View Design;
- Machine Interface;
- Import Consistency;
- Interface/Presentation Verification;
- System Architecture and Data Design.

The broad `prep.human-interface` capability is no longer part of the project Engineering Graph. Human-interface knowledge is represented by the granular contracts above.

## Accepted product / interaction direction

Prep has two explicit task modes:

- **Learning** — select an existing curated LearningTarget/profile and learn; target scope is read-only.
- **Curation** — create/edit LearningTargets and their Requirement scope; maintain reusable Knowledge, Requirements/RequirementSets, Questions and alignments.

These are task contexts, not authentication roles in v1.

Learning uses a target-scoped workflow. Curation owns reusable corpus and target composition.

Study Set construction uses all currently resolvable Questions and is not blocked by incomplete semantic coverage.

## Interface structure

Canonical interface completeness is owned by:

```text
Task Model
  -> User Journeys
      -> Conceptual Interface Model
          -> Information Architecture
          -> Interaction Design
              -> Interface Topology
                  -> Presentation System
                      -> Screen/View Design
```

Information Architecture and Interaction Design are independently addressable and are mapped together by Interface Topology.

`docs/interface/site-map.md` is a human review projection of the canonical topology and Screen/View knowledge. It does not own interface semantics.

The current topology includes shared structural frames plus Learning, Curation and secondary views. Stable Screen/View subject ids are embedded in `docs/interface/screen-view-design.md` and are checked against topology by the pinned Harness integration.

## Browser/backend contract closure

The browser/backend machine boundary defines stable operations for:

- LearningTarget selection and read-only scope;
- target Knowledge/graph/Question projections;
- Study Set build/export with stale-preview detection;
- factual statistics and explicit review sync;
- Curation CRUD/alignment/composition;
- contextual bulk import;
- external-runtime status.

Anki endpoint/API-key remain deployment configuration; v1 UI exposes runtime status rather than a secret/config editor.

## Active research

### Learning/evidence coverage

`docs/research/learning-coverage-research.md` remains active evidence for `Q-LEARNING-COVERAGE-MODEL`.

Current constraints:

- coverage is not Question count;
- learning-support coverage and assessment/evidence coverage are distinct;
- content breadth, cognitive/performance depth and context/transfer variability may matter;
- no scalar coverage percentage is accepted;
- curator/human semantic judgment remains authoritative until an automated model is validated.

This question does not block the current Knowledge inspection / graph prototype.

### Learner state / graph overlay

`docs/research/learner-state-graph-overlay.md` remains active future work.

A target-scoped Knowledge Graph may eventually visualize learner state, but ReviewObservation → Question → Knowledge/Requirement inference semantics are not accepted yet.

### 3D Knowledge Graph

`docs/research/3d-knowledge-graph-learning-research.md` supports 3D as a first-class **prototype hypothesis**, not as a proven superior representation.

The prototype must preserve list/search/detail alternatives and test whether 3D materially improves relational learning/exploration tasks.

## Frontend-first development rule

Do not start production backend implementation merely because machine contracts exist.

The immediate implementation goal is **not** end-to-end Learning -> Study Set -> Anki closure. The current prototype should first make the accepted Knowledge model and representative corpus directly inspectable so model/data defects and graph UX assumptions can be evaluated before downstream study/export work receives implementation effort.

Use static/mock or repository-derived representative data. The prototype remains evidence: it does not redefine canonical domain/interface semantics.

Keep a non-graph baseline for every core Knowledge inspection task. The question is not whether a 3D graph can be rendered, but whether it makes specific relational tasks or model/data defects easier to understand than list/search/detail.

## Current frontier

The current frontier is no longer direct frontend coding. Harness reconciliation after the implementation-consumer investigation separates three targets:

- `CURRENT-REVALIDATION` — the accepted top-level design baseline; its completion does not authorize coding;
- `FRONTEND-PROTOTYPE` — the noncanonical Knowledge-visualization experiment; because this prototype intends to reuse non-trivial 3D renderer mechanics, its closure includes frontend System Architecture and Component Design so experimental structure does not become accidental production architecture;
- `FRONTEND-IMPLEMENTATION` — the production coding target; it additionally requires frontend Verification Design, Test Design and Implementation Design.

Frontend-scoped System Architecture is accepted in `docs/architecture/frontend-system-architecture.md`. Frontend Engineering Policy is accepted in `docs/engineering/frontend-engineering-policy.md`, and frontend Component Design has been revalidated against it in `docs/implementation/frontend-component-design.md`. The `FRONTEND-PROTOTYPE` Consumer therefore has the architecture/component/policy knowledge needed for G0 without requiring production Test/Implementation Design. Production frontend closure continues independently through frontend Verification Design, Test Design and Implementation Design.

The research/code frontier after that closure remains:

> **Knowledge visualization as model/data inspection and UX-validation prototype.**

Two distinct uses must remain explicit:

1. **Curation / global Knowledge inspection** — inspect the reusable Knowledge corpus and reveal suspicious structure, relations, isolation, excessive connectivity, duplication candidates or granularity problems.
2. **Learning / target-scoped Knowledge exploration** — inspect the Knowledge projection relevant to one LearningTarget and evaluate whether the 3D representation improves relational understanding.

The 3D graph is therefore the primary research surface for the next implementation work, but not a product invariant and not the sole Knowledge access mechanism.

Study Set export, full Statistics realization and end-to-end Anki integration are intentionally deferred until Knowledge data/model quality and the graph interaction model have been exercised.

The active branch remains a revalidation/development line; it is not yet a project-wide `main` canonicalization candidate while open domain/interface research remains.

## Frontend code audit

Audit against the accepted Interface Topology found no current frontend application in `research/problem-space-revalidation`: the branch contains no React/Vite/Storybook package or screen/component implementation.

The previous `experiments/knowledge-representation-3d` branch remains implementation evidence. It contains useful renderer and interaction mechanics, but also stale graph-first product semantics. Reuse must therefore be selective.

Potentially reusable mechanics:

- click-without-drag versus node dragging;
- orbit/pan/zoom and inertial camera behavior;
- node search/focus;
- detail overlay without losing graph context;
- renderer idle/pause optimization;
- performance instrumentation;
- graph fit/reset behavior.

Do not inherit from that experiment:

- old route structure;
- graph-first whole-product composition;
- old relation taxonomy;
- old authentication/settings/progress assumptions;
- Storybook tuning controls as product UI;
- any semantic meaning implied by geometry.

## Graph-first research implementation plan

### G0 — Minimal Knowledge prototype shell

Purpose:

Establish only the minimum product context needed to keep the graph connected to accepted interface semantics.

Input:

- Interface Topology;
- Presentation System;
- Screen/View Design;
- representative Knowledge data.

Output:

- Application Shell with explicit Learning / Curation mode context;
- Curation / Knowledge entry;
- Learning / Knowledge entry with one selectable mock LearningTarget;
- shared canonical Knowledge identities across both contexts;
- list/search/detail baseline beside the graph surface.

Acceptance:

- the graph is not a detached demo;
- global and target-scoped Knowledge are visibly different contexts;
- Knowledge remains accessible without graph manipulation;
- no Study/Anki/backend implementation is required.

### G1 — Global Knowledge inspection graph

Purpose:

Make the canonical Knowledge corpus visually inspectable for model/data validation.

Required interactions:

- search KnowledgeNodes;
- select node by click without accidental drag;
- drag node independently from click selection;
- orbit, pan and zoom;
- open readable node detail without discarding graph state;
- filter by Knowledge kind;
- filter by accepted relation type;
- inspect relation type and direction explicitly;
- focus a selected node with bounded neighborhood;
- reset/home/fit graph;
- preserve camera/filter/focus state while inspecting detail.

Inspection diagnostics should make it practical to notice at least:

- isolated nodes/components;
- unexpectedly high-degree nodes;
- suspiciously dense clusters;
- relation-direction anomalies;
- duplicate/granularity candidates;
- unexpected cross-area connections.

These are inspection aids, not automatic semantic judgments.

Acceptance:

- a curator can inspect structure without reading raw source files;
- geometry is never treated as semantic truth;
- relation semantics remain explicit;
- the graph stays usable when the representative dataset becomes materially larger than a toy fixture.

### G2 — Representative data validation

Purpose:

Test the graph against data realistic enough to expose model and visualization problems.

Data should include:

- multiple Knowledge kinds;
- multiple accepted relation types;
- connected and disconnected regions;
- nodes with low, medium and high degree;
- at least one dense neighborhood;
- enough nodes to reveal occlusion/performance/navigation problems;
- canonical identities reused by Questions and target projections where available.

The preferred source is current/reusable Prep Knowledge data. Previous experiment fixtures may fill gaps only where they can be mapped to current canonical semantics.

Acceptance:

- obvious fixture artifacts do not dominate conclusions;
- performance and readability problems can be observed at realistic density;
- model/data anomalies discovered during inspection are recorded separately from renderer defects.

### G3 — Target-scoped Knowledge projection

Purpose:

Verify that LearningTarget scope produces a coherent learner-facing Knowledge projection.

Output:

- select one LearningTarget;
- derive/show its target-relevant Knowledge subset;
- preserve target context while searching, focusing and opening detail;
- distinguish global Curation graph from target Learning graph;
- provide a clear way to return from focused/local neighborhood to the whole target scope.

Acceptance:

- target graph contains only the intended target-derived Knowledge projection;
- canonical Knowledge identity is preserved between global and target views;
- user can understand current scope without inferring semantics from coordinates.

### G4 — Question -> Knowledge Map bridge

Purpose:

Verify the most important cross-representation transition before implementing the whole Study workflow.

Output:

- minimal representative Question detail/list;
- `Show in Knowledge Map`;
- navigation to the current target Knowledge graph;
- all aligned KnowledgeNodes highlighted/focused;
- target/filter/camera context handled predictably.

Acceptance:

- the user can answer "what Knowledge supports this Question?";
- multiple aligned nodes remain distinguishable;
- the transition does not require Question editing or Study Set export.

### G5 — Task-based 3D value evaluation

Purpose:

Collect evidence for `Q-KNOWLEDGE-GRAPH-3D-VALUE`.

Compare 3D graph with the list/search/detail baseline on the same tasks:

1. find a known KnowledgeNode;
2. identify its direct neighbors and relation directions/types;
3. explain the local relational context of one node;
4. detect an isolated or unexpectedly connected node;
5. move from a Question to supporting Knowledge;
6. filter to one Knowledge kind/relation type and recover the intended structure;
7. return to a previously inspected area without excessive disorientation.

Observe:

- correctness;
- completion effort/time;
- navigation errors;
- loss of orientation;
- information missed because of occlusion/clutter;
- cases where list/search/detail is clearly simpler;
- cases where 3D exposes structure materially better.

Result:

- retain, narrow or demote the 3D graph based on observed task value;
- record any required changes to Knowledge data/model separately from presentation findings.

## Deferred until graph/data validation

The following work remains accepted but is not the immediate implementation priority:

- complete Target Selection / Overview polish;
- full Study Set preview/build/export states;
- end-to-end Anki handoff;
- detailed Statistics presentation;
- broad Curation editor completion;
- production browser/backend integration;
- production frontend Test Design and Implementation Design closure.

Frontend System Architecture refinement and Component Design are no longer deferred because the current prototype intends to reuse non-trivial renderer mechanics and therefore must not invent those boundaries inside experimental code.

After G5, use the collected evidence to decide whether to continue with the broader Learning slice, revise Knowledge semantics/data, or change the graph interaction approach.


## Downstream reconciliation after frontend Engineering Policy canonicalization

The Harness engineering-policy guidance was canonicalized and Prep was repinned to Harness `92ea428780b3df284d1f3937c937aa859b3eda48`.

Impact closure was traced from the changed `PRESENTATION-SYSTEM` capability and the new `FRONTEND-ENGINEERING-POLICY` capability through declared Core/Engineering Graph dependencies.

Revalidation result:

- **Presentation System — revised/accepted baseline.** Added the rule that recurring presentation roles map through one coherent provider/theme/token boundary without requiring one wrapper per provider primitive.
- **Screen/View Design — revalidated, no semantic change required.** Existing view responsibilities are provider-neutral and do not depend on a concrete UI library or style token syntax.
- **Presentation Verification — revised.** The previous artifact only proved topology -> Screen/View subject coverage. It now also defines evidence obligations for reusable presentation-pattern consistency, provider-neutral semantic fidelity, coherent theme/token roles, accessibility/non-graph access and 3D task-value evaluation.
- **Frontend System Architecture — revalidated, no semantic change required.** Existing module topology, state ownership, DTO boundary and replaceable renderer/provider direction remain compatible with the revised Presentation System.
- **Frontend Engineering Policy — current by construction against the revised Presentation System + Frontend System Architecture.**
- **Frontend Component Design — revalidated/revised against Engineering Policy.** It already contains reusable UI/provider boundaries, consumer-owned contracts and explicit non-rules preventing one-to-one provider wrappers.
- **Legacy ADR/solution residue — corrected.** ADR index no longer labels every historical ADR as current, and ADR-014 is explicitly historical/superseded as normative frontend authority.

No change propagates into Problem Space, Product Requirements, Domain models, Application semantics, Machine Interface, Import Consistency or Data Design because the revised knowledge adds realization discipline without changing their owned semantics.

### Currentness limitation and coding boundary

Prep does not yet persist strict semantic-admission evaluations and Capability Lifecycle assertions for the existing canonical closure. Therefore structural target status is not full lifecycle/currentness proof.

Before `FRONTEND-IMPLEMENTATION` can be treated as implementation-documentation complete, Prep integration must fail closed unless strict semantic/currentness closure is present and `CURRENT`. This is integration evidence work, not a new semantic Authority or workflow stage.


### Engineering Coverage reconciliation

Canonical Harness Engineering Coverage was run for `FRONTEND-IMPLEMENTATION/frontend` after repinning.

The initial diagnostic exposed 40 work items. Most were not missing engineering documents; they were missing semantic-claim bindings because Prep's graph predated the canonical concern/proof model.

Reconciliation therefore:

- maps accepted Product Requirements to `intent.scope` / `intent.behavior`;
- maps Application Design to use-case/orchestration/failure concerns;
- maps User Journeys and granular Human Interface providers to the corresponding human-interface claims;
- maps Machine Interface to contract/error/compatibility claims;
- maps Import Consistency to consistency/idempotency claims;
- maps System Architecture to structure/boundary claims;
- maps Engineering Policy and Component Design to engineering-principle/component/code-quality/maintainability/error-handling claims;
- maps existing Interface/Presentation Verification to their verification concerns;
- declares the future Frontend Verification and Implementation Design production contracts for the verification/delivery concerns they must satisfy;
- explicitly defers i18n and multi-breakpoint responsiveness because no current product requirement makes them normative;
- declares subject inventory NOT_APPLICABLE for this frontend scope because completeness is already partitioned by explicit canonical view/module/capability contracts.

These mappings do not make strict semantic admission unnecessary. Claims that Harness marks as requiring semantic evaluation remain unresolved until strict semantic/currentness evidence is produced.


### Semantic revalidation evidence

Migration-mode semantic evaluations are now recorded in `.harness/semantic-evaluations.yaml` for the granular frontend capabilities that have been explicitly revalidated:

- Conceptual Interface Model;
- Information Architecture;
- Interaction Design;
- Interface Topology;
- Presentation System;
- Screen/View Design;
- Presentation Verification.

These evaluations are intentionally **not** strict semantic admission. They let Engineering Coverage distinguish "semantically reviewed" from "missing claim evidence" during migration, while the production fail-closed check still requires strict admission metadata plus Capability Lifecycle currentness before implementation-documentation closure can be claimed.


### Strict semantic/currentness baseline migration

Prep now persists one project-owned capability-level semantic baseline in `.harness/semantic-baseline.yaml`.

For every current Core provider it records:

- an explicit human/agent semantic revalidation basis;
- a capability-local revision number;
- an opaque acceptance identity derived from baseline + CapabilityId + that revision.

`tools/semantic_baseline.py` uses the pinned Harness strict-admission contract to derive, in dependency order:

- strict semantic-admission evaluations;
- exact prerequisite acceptance baselines;
- Capability Lifecycle assertions.

The derivation uses current Core providers and direct Engineering Graph prerequisites as the canonical read boundary, performs the knowledge-kind required semantic-review checks and uses `changed_paths=[]` because migration revalidation does not rewrite the accepted artifact.

The generated evidence is deliberately derived rather than persisted as a second truth. Adding/removing a Core provider without adding/removing its baseline review is a hard failure. Revalidating one capability requires bumping only that capability's semantic revision.

The integration check now requires strict semantic/currentness `COMPLETE` for both `CURRENT-REVALIDATION` and `FRONTEND-PROTOTYPE`. Production frontend will use the same evidence and remains fail-closed until its future capabilities are strictly admitted as they are created.


### Frontend Verification Design

After strict semantic/currentness baseline migration, `prep.frontend-verification` became the sole actionable production frontend CREATE.

The production contract was corrected before acceptance to include direct inputs required by its claims:

- `prep.product-capabilities` for product/requirement traceability;
- `prep.presentation-verification` for accepted presentation evidence obligations;
- `prep.frontend-system-architecture` for architecture/dependency/state boundaries;
- `prep.machine-interfaces` for machine-contract verification.

`docs/verification/frontend-verification.md` now defines evidence obligations for product traceability, functional/view behavior, machine-contract mapping, dependency direction, DTO isolation, renderer isolation, mock/HTTP substitutability, state ownership, presentation evidence closure and upstream-change revalidation.

The artifact owns verification requirements only. Executable test preconditions/actions/oracles remain Frontend Test Design work.


### Frontend Test Design

`prep.frontend-test-design` became actionable after Frontend Verification was accepted.

The canonical `docs/verification/frontend-test-design.yaml` uses Harness `test-design/v1` and refines the TEST-bearing `FV-02..FV-09` obligations into executable contracts with explicit:

- preconditions;
- controlled operations;
- observable oracles;
- verification references.

The contracts cover navigation/context preservation, Question -> Knowledge navigation, recoverable-failure behavior, machine-outcome mapping, forbidden dependency edges, DTO identity mapping, renderer click-vs-drag and semantic isolation, mock/HTTP substitutability, keyboard/non-graph Knowledge access, graph/list semantic equivalence and common view states.

Framework/test-file/fixture mechanics remain implementation freedom. Exact renderer coordinates, private component state, provider component trees and pixel snapshots are explicitly forbidden as semantic oracles.

Prep CI now validates the Harness schema and verifies that every TEST-bearing Frontend Verification id has at least one Test Design contract.
