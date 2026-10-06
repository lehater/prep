# Frontend Implementation Design

## Purpose

Translate the accepted frontend architecture, component contracts, verification
obligations and executable test design into bounded implementation work for the next
Prep learner-facing frontend.

This artifact plans realization only. It does not redefine Product, Domain,
Application, Human Interface, Machine Interface or Quality semantics.

## Pre-implementation baseline

The production frontend baseline is intentionally empty.

The repository contains no production frontend source tree, frontend dependency
manifest/lockfile, frontend packaging, frontend CI or production renderer dependency.
Historical implementations and experiments are evidence only and are not implementation
inputs by default.

Therefore the next implementation is a fresh realization of current accepted semantics,
not a migration, refactor or continuation of deleted code.

No framework, package, folder name, adapter shape, component API, route structure, state
library, renderer library or test runner is inherited merely because it existed before
this baseline.

## Decision basis and semantic status

Request-bound pre-choice implementation exploration for this revision is recorded in
`.harness/candidates/frontend-implementation-design-exploration.yaml`.

Selected implementation direction:

- establish a minimal reproducible frontend tool/build/test environment before product
  source;
- choose concrete dependencies from current accepted constraints rather than deleted
  implementation history;
- realize public ownership through task-feature boundaries;
- establish consumer-owned contracts before dependent views;
- keep Knowledge task-complete without a spatial renderer;
- establish deterministic fast validation before substantial feature growth and use an
  explicit heavy prototype checkpoint.

The revision must pass strict semantic admission and preserve complete
`FRONTEND-PROTOTYPE` / `FRONTEND-IMPLEMENTATION` Harness closure.

## Implementation boundary

In scope:

- establish the new frontend package/source root and reproducible tool environment;
- realize the accepted Preparation Shell and task views against deterministic mock
  adapters;
- preserve active Target and optional Next-focus continuity;
- implement consumer-owned semantic models/ports for the current Machine Interface;
- establish mechanical source-boundary enforcement from the accepted Component Design;
- keep optional spatial rendering outside the required initial production dependency
  set;
- add executable verification from the accepted Frontend Test Design.

Out of scope:

- recovering or porting deleted frontend code for its own sake;
- backend/persistence implementation;
- new inference algorithms;
- reusable corpus-authoring/curation UI not present in accepted learner tasks;
- new import workflow UI;
- authentication/multi-user behavior;
- production 2D/3D renderer selection;
- invented latency/FPS/item-count targets.

## FI-00 — Fresh implementation bootstrap

Before product feature source is added:

1. Select the smallest browser-frontend toolchain that satisfies current System
   Architecture, Frontend Engineering Policy and Frontend Verification/Test Design.
2. Pin the runtime and dependency versions in versioned repository inputs.
3. Create one production frontend source/package root and one composition root.
4. Establish build, static/type checking as applicable, lint/format policy as applicable,
   unit/contract test execution and browser E2E execution.
5. Establish a deterministic dependency-boundary check for the public task-feature
   ownership defined by Component Design.
6. Establish versioned CI with a fast deterministic gate and an explicit heavy prototype
   gate.
7. Record applicable dependency/license/supply-chain evidence once concrete
   dependencies exist.

Completion:

- the repository can build/test an empty or minimal shell reproducibly;
- no product semantics have been invented by the bootstrap;
- no dependency or source is copied from deleted implementation merely for reuse;
- the chosen toolchain is justified by current needs and locked from versioned inputs.

The physical package/source-root name is implementation freedom. Semantic ownership
inside it must map to:

```text
app
  preparation-shell
  preparation-context
  composition

features
  target-direction
  target
  current-position
  knowledge-explorer
  activity
  evidence-change
  preparation-support

adapters
  mock
  transport        # only when introduced
  spatial          # optional; absent from the required initial path

ui                # shared presentation primitives only
test-support
```

Exact internal component/hook/value-file splits are implementation freedom.
Feature-private state and contracts do not become shared merely to reduce file count.

## FI-01 — Semantic frontend foundation and deterministic scenario

Create frontend-owned values and consumer ports for:

- Target comparison;
- Target establishment/requirements;
- Current state / Evidence / Gap / FocusDecisionContext / Focus;
- Knowledge projection;
- Support;
- ActivityAttempt and evidence-cycle completion outcome;
- Change;
- PreparationRequest and explicit remainder.

Build one deterministic mock scenario containing:

- at least two plausible candidate Targets over one learner evidence basis;
- shared and Target-specific requirements/uncertainty;
- one established Target;
- demonstrated, challenged and unknown current-state areas;
- multiple gaps plus focus-decision context;
- one accepted focus;
- Knowledge in target/focus/Required-Capability scope;
- suitable support plus one missing-support case;
- one activity attempt and attributable completion;
- evidence/change outcomes including no-change or increased uncertainty;
- one PreparationRequest with accepted partial support plus unresolved/rejected
  remainder.

Completion:

- mock adapters satisfy current consumer contracts;
- no view derives target/learner/gap/change truth from raw fixtures;
- raw fixture/provider shapes do not leak into task features.

## FI-02 — Preparation Shell, context and Target direction

Implement:

- structural preparation navigation;
- active-child composition;
- narrow PreparationContext for active Target/focus;
- missing-context routing according to Interface Topology;
- VIEW-TARGETS candidate-selection and comparison-ready variants.

Completion:

- comparison uses one learner evidence basis;
- candidate choice does not activate Target until explicit continuation;
- active Target is absent/optional before establishment;
- shell/context do not become semantic data stores.

## FI-03 — Target establishment and requirements

Implement VIEW-TARGET:

- target-setup and target-established variants;
- establish/refine command state and safe input preservation;
- requirement/provenance inspection;
- Knowledge-focus navigation;
- contextual Prepare Support entry.

Completion:

- unresolved/rejected/stale outcomes preserve safe context;
- Target requirements remain separate from learner state and Knowledge;
- direction reconsideration returns to Targets.

## FI-04 — Current position and Next focus

Implement VIEW-CURRENT as one cohesive task feature:

- current-state projection;
- gaps/uncertainty;
- evidence-basis detail;
- focus-decision context;
- set/revise-focus behavior.

Completion:

- demonstrated/challenged/unknown remain explicit;
- unknown is not rendered as failure;
- no universal mastery/readiness score is created;
- stale/rejected focus changes preserve the inspected decision context.

## FI-05 — Knowledge exploration

Implement the current Knowledge contract from scratch:

- semantic query/scope;
- optional Required-Capability scope;
- bounded results;
- selected detail;
- relation inspection;
- task-complete keyboard/non-spatial path.

No production spatial dependency is required for this slice. A future optional spatial
provider may be added only through the accepted provider seam and must not become
semantic state.

Completion:

- the complete accepted Knowledge task works without a spatial renderer;
- target/focus/scope survives navigation and degradation.

## FI-06 — Activity

Implement VIEW-ACTIVITY:

- support-selection variant;
- support-fit basis/limitations;
- start-attempt command;
- attempt-active variant;
- completion/submission;
- evidence-processing variant.

Completion:

- one accepted ActivityAttempt identity correlates the occurrence;
- completion alone cannot mark capability demonstrated or close a gap;
- pending completion prevents accidental duplicate submission;
- stale/dependency outcomes preserve accepted context.

## FI-07 — Evidence & changes

Implement contextual post-Activity VIEW-EVIDENCE-CHANGE:

- reviewed Activity/result context;
- evidence facts, argument/claim basis, provenance and limitations;
- changed/no-change/challenged/increased-uncertainty outcomes;
- explicit continuation actions.

Completion:

- ordinary why-this-state inspection remains inside Current position;
- observation is not collapsed into learner conclusion;
- Target-information refinement remains distinct from learner-evidence change;
- no generic Progress feature is introduced.

## FI-08 — Contextual preparation support

Implement VIEW-PREPARE-SUPPORT:

- request-input variant;
- source/provenance input;
- request command;
- result-review variant;
- accepted owner-scoped support;
- explicit remainder;
- continuation-recovery variant;
- return to originating work.

Completion:

- partial accepted results survive unresolved/rejected peers;
- dependency-unavailable/stale context is recoverable as allowed;
- learner is not exposed to import schema, corpus CRUD or item repair;
- originating Target/focus/task context is restored on return.

## FI-09 — Prototype verification closure

After the representative paths exist:

- enforce accepted task-feature dependency boundaries mechanically;
- remove any temporary bootstrap shortcuts that violate current ownership;
- ensure unused provider dependencies are absent;
- complete component/unit/contract/browser tests required by Frontend Test Design;
- run applicable accessibility and Harness/currentness checks.

Completion:

- source boundaries match Component Design;
- no production dependency exists on historical/experimental implementation;
- optional providers remain replaceable/removable;
- all applicable current Frontend Verification checks have evidence.

## Dependency ordering

Required ordering:

1. The clean repository baseline precedes all new implementation.
2. FI-00 precedes product source so dependencies, package layout and validation are
   explicit rather than inherited implicitly.
3. FI-01 precedes features consuming semantic contracts/mock scenarios.
4. FI-02 precedes feature slices requiring stable cross-view Target/focus continuity.
5. FI-03/FI-04/FI-05 may proceed after foundation/shell with ordinary contract
   coordination.
6. FI-06 requires accepted active Target/focus and support contracts.
7. FI-07 requires Activity and evidence/change integration.
8. FI-08 requires return-context plus preparation-request contracts.
9. FI-09 closes the prototype after replacement paths exist.

This is dependency ordering, not a mandatory methodology phase sequence.

## Verification enforcement

The new implementation establishes its own versioned verification tooling. Nothing is
inherited from deleted frontend scripts by default.

Fast validation must cover the deterministic checks selected in FI-00, including
architecturally significant dependency boundaries and local contract/unit behavior.

The explicit heavy prototype checkpoint adds applicable production build, browser E2E,
task-flow/accessibility evidence and full Harness/currentness checks. Conditional
renderer/performance evidence applies only when a selected provider or accepted Quality
boundary makes it relevant.

A green fast path does not replace required heavy evidence.

## State realization

Regardless of framework choice:

- shell/router state owns current preparation destination/active child;
- PreparationContext owns active Target and accepted Next-focus identity/intention;
- task-feature state owns selections, safe drafts/input and interaction variants;
- adapter/query state owns provider result/pending state;
- any future renderer-local state owns geometry/camera/layout/physics/hover only.

No general-purpose global semantic store is introduced without a new accepted
implementation need.

## Mock-first rule

The first useful prototype must allow a representative user to complete, without a
backend:

```text
compare Targets when needed
-> establish/refine Target
-> understand requirements
-> inspect Current position and gaps
-> choose Next focus
-> inspect Knowledge and/or choose support
-> perform one Activity
-> review evidence/change
-> choose the next valid continuation
```

and enter/return from contextual Prepare Support when required.

## Prototype completion criteria

1. Every current VIEW-* has an implemented task path or intentional structural shell.
2. Multi-target comparison uses one learner evidence basis and does not mutate Target or
   learner state.
3. Active Target/focus survive accepted navigation.
4. Current-state/gap/evidence/change semantics come from consumer ports, not UI
   inference.
5. Knowledge is task-complete without a spatial renderer.
6. Activity completion alone does not fabricate evidence or learner progress.
7. Evidence/change review supports no-change/challenge/increased uncertainty.
8. Prepare Support supports partial/remainder/recovery/return without corpus/import UI.
9. Mock adapters satisfy consumer-owned ports.
10. Selected deterministic fast and browser-heavy checks pass.
11. No production source or dependency relies on deleted legacy implementation or on
    experiments as authority.
12. Responsive composition preserves dominant task regions and context.
13. Keyboard/non-spatial/reduced-motion obligations remain task-complete where
    applicable.
14. Newly discovered semantic gaps are routed upstream rather than decided in code.

Meeting these criteria means READY FOR REPRESENTATIVE-USABILITY VALIDATION, not
automatic production UI authority.

## Production implementation gate

Production UI may treat the accepted UX/presentation package as authority only after:

- representative-user evidence has been collected for the target mental model,
  multi-target comparison, state/gap/focus flow and empty/incomplete preparation
  recovery;
- blocking/major findings have been routed to their owning artifacts and material fixes
  retested;
- critical learner vocabulary/state labels have been validated or revised;
- applicable accessibility evidence is collected;
- any production spatial-renderer/default decision is supported by user/quality evidence
  rather than historical code or owner preference;
- unresolved/deferred UX decisions are explicit;
- Harness lifecycle/currentness for production frontend closure is restored.

Until then, implementation code is prototype/evidence, not upstream semantic authority.

## Release and rollback semantics

The clean baseline contains no deployable production frontend and no frontend-specific
persistent migration/coexistence state.

The first deployable frontend is therefore introduced as a whole replaceable artifact
with versioned contracts/configuration. If future implementation introduces mixed
versions, persistent browser migrations or irreversible transition state, reopen
Change/Transition Design before relying on this plan.
