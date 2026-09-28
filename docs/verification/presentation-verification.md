# Presentation Verification

## Purpose

Verify the accepted Presentation System and Screen/View Design, including the 3D-default Knowledge experience, non-spatial task completion, responsive hierarchy and semantic-preserving degradation.

## PV-01 — Topology / Screen coverage

**Verifies:** every Interface Topology view/frame has one stable Screen/View subject.

**Method:** TEST.

**Evidence:** pinned Harness topology -> Screen/View subject coverage.

## PV-02 — Shared presentation consistency

**Verifies:** representative Learning and Curation views reuse the same hierarchy, feedback, collection, edit, loading/empty/failure and focus role system.

**Method:** INSPECTION.

**Evidence:** rendered representative views plus theme/presentation-role mapping; pixel identity is not required.

## PV-03 — Provider neutrality

**Verifies:** UI/provider capabilities do not introduce product actions/states absent from Screen/View contracts.

**Method:** INSPECTION.

**Evidence:** trace representative controls to accepted screen/presentation responsibilities.

## PV-04 — Accessibility and non-spatial completion

**Verifies:** core navigation/actions are keyboard accessible with visible focus; semantic state is not color-only; core Knowledge tasks remain completable through search/list/detail without camera manipulation.

**Method:** DEMONSTRATION.

**Evidence:** browser keyboard walkthrough plus applicable automated accessibility checks.

## PV-05 — 3D semantic fidelity

**Verifies:** the production-default 3D projection preserves canonical Knowledge identity and KnowledgeProposition predicate/participant meaning; geometry, depth and camera state never become semantic truth; selection and explicit focus remain distinct.

**Method:** TEST.

**Evidence:** deterministic projection/interaction tests plus rendered representative evidence.

## PV-06 — 3D task suitability

**Verifies:** representative relation inspection, neighborhood/context exploration, search-to-focus and Study-material-to-Knowledge navigation remain understandable in the 3D-default experience and a non-spatial path remains available when it is simpler or required.

**Method:** DEMONSTRATION.

**Evidence:** task walkthroughs recording correctness, disorientation/errors and qualitative usability. This evidence may justify later presentation revision but does not redefine Knowledge semantics.

## PV-07 — Responsive spatial closure

**Verifies:** wide layout gives the Knowledge surface the majority of flexible workspace; compact layout preserves primary spatial work while moving secondary detail appropriately; narrow layout avoids horizontal overflow and keeps required controls/non-spatial access reachable.

**Method:** TEST.

**Evidence:** rendered wide/compact/narrow browser cases with robust structural/range assertions rather than pixel-perfect snapshots.

## PV-08 — Performance degradation without semantic loss

**Verifies:** Auto/Quality/Performance and allowed renderer degradation affect presentation cost only; semantic result set, selection/focus intent, Knowledge identity, proposition predicate/direction and non-spatial access remain preserved; renderer becomes demand-driven when idle.

**Method:** TEST.

**Evidence:** deterministic semantic-preservation/profile tests plus separate hardware-accelerated measurements required by Frontend Performance/Capacity.

## PV-09 — Hardware workload evidence

**Verifies:** the selected production renderer has recorded evidence for 1k / 2k / 5k visual-item workloads and the ordinary supported envelope is evaluated against the accepted approximately-30-FPS target on a named reference environment.

**Method:** DEMONSTRATION.

**Evidence:** browser/device-identified runs recording active RAF/FPS, idle activity, layout settle behavior, responsiveness and available renderer diagnostics. Headless runs alone do not satisfy this check.

## Current evidence state

Available immediately:

- topology -> Screen/View subject coverage;
- canonical traceability of all checks to Presentation/Screen/Quality contracts.

Required from the frontend prototype:

- rendered shared-role consistency;
- keyboard/non-spatial walkthrough;
- 3D semantic/task evidence;
- wide/compact/narrow composition evidence;
- semantic-preserving degradation tests;
- hardware workload measurements.

## Out of scope

Backend transport/persistence, source-code dependency direction, exact provider token names, exact font package, exact colors, pixel-perfect coordinates and learner-state inference are outside this verification artifact.
