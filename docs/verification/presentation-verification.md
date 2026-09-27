# Presentation Verification Strategy

## Purpose

Verify that the rebuilt Presentation System and Screen/View Design realize the accepted Prep interface semantics without reintroducing presentation choices as product/domain truth.

This strategy verifies the current presentation contract. It does not introduce numeric performance targets, new product behavior, renderer requirements beyond the accepted local 3D Knowledge projection, or frontend implementation mechanics.

## Scope

Accepted inputs:

- `docs/interface/conceptual-interface-model.yaml`
- `docs/architecture/performance-capacity.md`
- `docs/interface/information-architecture.yaml`
- `docs/interface/interaction-design.yaml`
- `docs/interface/interface-topology.yaml`
- `docs/verification/interface-verification.md`
- `docs/interface/presentation-system.md`
- `docs/interface/screen-view-design.md`

## Verification checks

### PV-01 — Topology-to-screen closure

**Verifies:** every topology view that requires a screen/view has exactly one Screen/View subject, while structural-only topology nodes do not force empty screens.

**Method:** ANALYSIS

**Required evidence:**

- deterministic extraction of topology view ids;
- deterministic extraction of Screen/View subject ids;
- exact coverage of:
  - `V-LEARN-TARGET`
  - `V-LEARN-STUDY`
  - `V-LEARN-EVIDENCE`
  - `V-KNOWLEDGE`
  - `V-CURATE-TARGETS`
  - `V-CURATE-REQUIREMENTS`
  - `V-CURATE-QUESTIONS`
  - `V-CURATE-IMPORT`
  - `V-CURATE-DIAGNOSTICS`;
- `V-CURATE` remains structural and does not require an otherwise empty landing screen;
- zero missing or unexpected Screen/View subjects.

### PV-02 — Root work-context clarity

**Verifies:** Learning, Knowledge and Curation remain recognizable root intents and that Curation mutation affordances never appear as an implicit side effect of ordinary Learning work.

**Method:** DEMONSTRATION

**Required evidence:** a rendered prototype or equivalent screen walkthrough showing:

1. root access to Learning, Knowledge and Curation;
2. visible current work context;
3. target context retained when moving from Learning into target-scoped Knowledge;
4. Curation context made explicit before canonical mutation actions become available;
5. no duplicated canonical Knowledge identity across Learning/Curation presentation.

This refines Interface Verification IV-03 and IV-06 at the concrete presentation level.

### PV-03 — Knowledge dual-access contract

**Verifies:** the selected local 3D projection improves relational exploration without becoming the only way to access Knowledge semantics.

**Method:** DEMONSTRATION

**Required evidence:** the Knowledge view demonstrates all of the following:

- search can find Knowledge independently of spatial navigation;
- textual results can establish the canonical focus;
- focused detail exposes readable identity/content and semantic kind;
- incoming/outgoing relationship type and direction are explicitly inspectable;
- following a relationship can move focus without relying on geometry alone;
- the 3D projection consumes the same canonical focus/scope semantics;
- disabling or failing the renderer leaves textual search/focus/detail usable.

The check does not require every canonical node or relation to be rendered simultaneously.

### PV-04 — Wide and narrow Knowledge composition

**Verifies:** the accepted responsive priority changes presentation without changing Knowledge semantics.

**Method:** DEMONSTRATION

**Required evidence:**

**Wide composition**
- 3D relational projection receives the largest work region;
- search/filter/scope controls remain discoverable;
- textual Knowledge access and focused detail remain reachable without leaving the semantic Knowledge view.

**Narrow composition**
- textual search/results/focused detail become the primary access path;
- 3D becomes an explicit full-width mode/disclosure;
- switching presentation mode preserves current scope/focus when technically possible;
- no semantic capability disappears solely because the viewport is narrow.

No exact breakpoint is part of the oracle.

### PV-05 — Context-preserving Curation composition

**Verifies:** Targets, Requirements and Questions use one topology task view each rather than recreating separate collection/editor product destinations.

**Method:** DEMONSTRATION

**Required evidence:** for each of `V-CURATE-TARGETS`, `V-CURATE-REQUIREMENTS` and `V-CURATE-QUESTIONS`:

- collection/search context can establish a focused canonical object;
- wide composition may keep finder and focused work together;
- narrow composition may move focused work to a full-width substate;
- returning restores meaningful collection/search context;
- validation rejection retains proposed input;
- conflict keeps accepted canonical state distinguishable from stale/proposed input.

A modal may support bounded secondary selection but is not the mandatory container for primary canonical editing.

### PV-06 — Responsive focus and reading order

**Verifies:** responsive reflow follows semantic priority and does not create keyboard/focus traps or destroy task continuity.

**Method:** TEST

**Required evidence:** representative responsive interaction tests show:

- focus moves to the meaningful focused region when entering a narrow detail/edit substate;
- returning restores focus to the originating result when available;
- validation failures move attention to actionable error information while preserving input;
- disclosures remain keyboard reachable;
- entering/leaving the 3D projection cannot trap keyboard focus;
- secondary context is disclosed/reflowed before information access is removed.

### PV-07 — Factual feedback semantics

**Verifies:** visual states preserve the accepted factual meaning of empty, error, conflict and success conditions.

**Method:** INSPECTION

**Required evidence:** screen-state review confirms:

- no target/search match is not presented as a product/domain failure;
- empty Study Set materialization is not learner failure;
- no review observations is not “not mastered”;
- no diagnostics is not a semantic coverage score;
- validation rejection/conflict does not look like accepted mutation;
- external-runtime failure is distinguishable from local canonical-data failure;
- success appears only after an accepted operation outcome.

### PV-08 — Non-spatial accessibility path

**Verifies:** 3D remains an enhancement to Knowledge exploration rather than a pointer-only semantic dependency.

**Method:** TEST

**Required evidence:**

- visible keyboard focus;
- keyboard operation for Knowledge search, result selection, focus and relationship traversal;
- readable non-spatial relation type/direction;
- status meaning not encoded by color alone;
- primary Learning/Curation actions reachable without spatial gestures;
- renderer-local camera/direct-manipulation gestures are not required to complete the accepted semantic traversal.

This check verifies the accepted Presentation System contract; it does not claim conformance to an unstated external accessibility standard.

### PV-09 — Performance evidence is diagnostic until accepted

**Verifies:** current implementation/prototype work does not silently turn historical 3D benchmarks into MVP acceptance gates.

**Method:** INSPECTION

**Required evidence:**

- no pass/fail gate requires a specific FPS, visible node count, edge count, draw-call budget, triangle count or force-layout settle time;
- available 3D stress fixtures/measurements may be retained as engineering diagnostics;
- any future numeric gate traces to a later accepted Quality Design revision;
- presentation degradation, when exercised, preserves canonical identity, relation semantics and textual Knowledge access.

## Evidence gate

`prep.presentation-verification` is satisfied when PV-01 through PV-09 have current evidence against the same accepted Presentation System and Screen/View Design baselines.

A historical result becomes stale whenever either accepted upstream presentation artifact changes materially.

## Out of scope

These belong downstream or upstream:

- deciding whether 3D should exist — already owned by accepted Presentation System;
- renderer library/component structure;
- exact routes, CSS mechanics and breakpoints;
- numeric performance/capacity thresholds not accepted by Quality Design;
- backend/domain correctness;
- frontend module/component dependency enforcement;
- executable test-framework implementation details.

## Unresolved Questions

None introduced by Presentation Verification.
