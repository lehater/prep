# Frontend Verification Design

## Purpose

Define evidence required before the mock-first frontend can be treated as a conforming
realization of the accepted Product, Human Interface, Machine Interface and frontend
architecture contracts.

Verification observes user/task semantics and public consumer boundaries. Existing code,
provider features and legacy UI areas are not independent oracles.

### FV-01 — Product/interface traceability

Verify every user-visible behavior traces to an accepted Product Capability plus
Task/Interaction/Screen responsibility. Provider/template/resource features do not
create new product behavior.

### FV-02 — Complete preparation workflow

Verify against deterministic mocks that the learner can:

- compare multiple plausible Targets when direction is unresolved;
- continue with one Target and establish/refine it;
- understand required performance and unresolved requirement meaning;
- inspect current demonstrated/challenged/unknown state;
- inspect gaps/uncertainty and their basis;
- choose or revise an explicit Next focus;
- inspect relevant Knowledge and/or suitable support;
- perform one accepted activity attempt;
- review resulting evidence/change, including no-change/challenge/uncertainty;
- continue with the current focus, return to Current position, inspect Knowledge or
  refine the Target as allowed by topology.

The flow preserves active Target/focus across views and never turns navigation,
comparison or activity completion into learner-state evidence.

### FV-03 — Contextual preparation-support boundary

Verify:

- a missing Target/support prerequisite has an explicit learner request/review path;
- motivating Target/focus/source context is preserved;
- accepted partial support remains distinguishable from unresolved/rejected remainder;
- dependency-unavailable/stale outcomes expose a resumable/reconsiderable continuation;
- completion returns to the originating preparation work;
- learner flow does not expose corpus/import/schema/item-repair responsibilities.

### FV-04 — Frontend port/outcome fidelity

Verify adapters preserve accepted Machine Interface operation inputs, representations,
semantic basis/currentness and outcome distinctions. UI code does not independently
derive Target satisfaction, Gap, learner claims, Change or PreparationRequest meaning.

### FV-05 — Dependency direction

Verify:

- task-feature internals remain independent;
- features depend on consumer-owned contracts rather than concrete mock/transport
  adapters;
- shared presentation code does not own task-feature mutable state;
- responsibilities accepted as shared presentation/interaction primitives are not reimplemented inside task features; features compose them through their public contracts;
- provider/renderer/transport types do not leak into semantic ports/models;
- no legacy Curation/Import/Progress/Diagnostics module is required by an accepted
  frontend dependency edge.

### FV-06 — Representation isolation

Verify mock fixtures and future transport DTOs terminate inside adapters and map to
frontend-owned semantic projections without changing accepted identity or meaning.

### FV-07 — Optional spatial-renderer isolation and semantic preservation

Verify:

- Knowledge query/result/detail remains task-complete without a spatial renderer;
- when a spatial renderer is present, canonical Knowledge refs, proposition meaning and
  semantic scope survive renderer-neutral projection;
- selection/scope remain semantic interaction state while geometry/camera/layout remain
  renderer state;
- renderer failure/degradation preserves the non-spatial task path.

No 2D/3D renderer is required by this verification check.

### FV-08 — State ownership and lifetime

Verify:

- PreparationShell owns navigation/active-child state only;
- PreparationContext owns active Target/focus continuity only;
- candidate comparison, Target input, current/gap/focus interaction, Knowledge
  selection, ActivityAttempt UI state, evidence/change review and PreparationRequest UI
  state remain with their owning task feature/provider cache;
- canonical Target/Knowledge/learner/application truth is not promoted into general
  mutable browser state.

### FV-09 — Evidence/state/gap integrity

Verify raw Performance/Observation facts, accepted evidence arguments/claims,
target-relative current state and Gap/uncertainty remain distinguishable.

Missing/insufficient evidence is uncertainty rather than failure. Activity completion
alone is not gap closure or learner capability evidence.

### FV-10 — Contextual Evidence/change integrity

Verify `VIEW-EVIDENCE-CHANGE` is entered from a completed/reviewable Activity result or
an equivalent direct link carrying reviewed activity/evidence context. It presents
post-activity change/no-change/challenge/increased-uncertainty outcomes with supporting
evidence/provenance and current-state-after context.

Ordinary why-this-state inspection remains inside Current position. Learner-evidence
change remains distinct from Target-information refinement. No generic progress score or
positive-only success interpretation is introduced.

### FV-11 — Presentation evidence closure

Verify every applicable Presentation Verification obligation has evidence, including:

- one dominant task surface for each state-dependent Screen/View composition variant;
- bounded application-frame ownership on capable wide surfaces, with persistent preparation navigation and child-region overflow that does not turn the whole interface into document scrolling;
- Knowledge wide composition keeps the declared task-complete nonspatial path available alongside an enabled relationship overview, and directed relations remain source/target-distinguishable;
- context continuity and responsive semantic order;
- keyboard/non-spatial task completion;
- preparation-support request/result/recovery;
- conditional spatial semantic fidelity/usability only when a spatial view is present.

### FV-12 — Harness currentness

Verify frontend closure is rerun whenever accepted prerequisites change. Stale or
lifecycle-unknown frontend knowledge cannot be treated as semantically current merely
because documents compile, tests pass or the prototype renders.

### FV-13 — Target-purpose isolation

Verify related professional-role and selection/interview Targets preserve separate
requirements/provenance. Sharing a CapabilitySpecification is allowed, but a
Target-specific requirement never enters another Target through comparison, UI
projection, adapter mapping or relation alone.

### FV-14 — Composition-variant integrity

Verify Screen/View composition variants are presentation states of one accepted view,
not hidden routes/modes/domain states.

For each variant:

- the declared dominant work region is perceptibly primary;
- supporting regions do not compete for task primacy;
- transition between variants follows accepted Interaction/Machine outcomes;
- Target/focus/context and recoverable user input are preserved according to the
  accepted view contract.

## Completion meaning

Acceptance means verification obligations are explicit and traceable. It does not claim
representative-user evidence is already complete, does not select a production spatial
renderer and does not repair missing Harness lifecycle acceptance evidence.
