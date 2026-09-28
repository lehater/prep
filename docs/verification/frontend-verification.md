# Frontend Verification Design

## Purpose

Define evidence required before the mock-first frontend can be treated as a conforming realization of the accepted user-centered product/interface/frontend-architecture contracts.

## FV-01 — Product/interface traceability

Verify every user-visible behavior traces to Product Capability plus Task/Screen responsibility; provider features do not create new product behavior.

## FV-02 — Complete target-relative workflow

Verify against deterministic mocks:

- select or establish target;
- understand required capabilities;
- inspect current evidence-backed state;
- distinguish satisfied / unresolved / challenged;
- inspect target-relative gaps;
- choose learning or diagnostic focus;
- perform learning/diagnostic activity;
- accept new evidence;
- inspect progress and changed gaps/focus.

The flow must preserve active target/focus across views.

## FV-03 — Corpus bootstrap and curation

Verify:

- missing target/corpus data has an explicit preparation path;
- import contract/examples are inspectable;
- validate and apply are separate;
- mixed valid/rejected outcomes remain actionable;
- incremental Curation covers Targets, Capabilities, Knowledge, Learning Support and Assessment.

## FV-04 — Frontend port/outcome fidelity

Verify adapters preserve accepted operation inputs/results and outcome distinctions. UI code does not derive target satisfaction, Gap or learner claims independently.

## FV-05 — Dependency direction

Verify:

- target-work/Curation feature internals remain independent;
- features do not import concrete adapters/renderers;
- shared presentation code does not own feature mutable state;
- provider/renderer types do not leak into semantic ports/models.

## FV-06 — Representation isolation

Verify mock fixtures/future transport DTOs terminate inside adapters and map to frontend-owned models.

## FV-07 — Renderer isolation and semantic preservation

Verify canonical Knowledge refs/proposition meaning survive GraphScene projection; selection and focus remain distinct; renderer unavailable preserves non-spatial completion.

## FV-08 — State ownership/lifetime

Verify shell/TargetContext owns only active target/focus navigation state; feature/editor/query state remains feature-local; canonical learner/target truth is not promoted into general mutable UI state.

## FV-09 — Evidence/state/gap integrity

Verify raw observations, accepted claims, target-relative state and Gap remain distinguishable. Missing evidence is uncertainty, not failure; activity completion is not gap closure.

## FV-10 — Progress integrity

Verify progress is derived from accepted before/after target-relative projections and supports changed, unchanged and increased-uncertainty outcomes.

## FV-11 — Presentation evidence closure

Verify all applicable Presentation Verification checks have evidence, including keyboard/non-spatial access, responsive target-work hierarchy, import usability and 3D semantic fidelity.

## FV-12 — Harness currentness

Verify frontend closure is rerun whenever accepted prerequisites change; stale frontend knowledge/code cannot be treated as current merely because it builds.

## Completion meaning

Acceptance means verification obligations are explicit and traceable. It does not by itself claim every prototype evidence item is already green.
