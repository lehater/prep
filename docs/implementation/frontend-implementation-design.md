# Frontend Implementation Design

## Purpose

Translate the accepted/draft frontend architecture, component contracts, verification
obligations and executable test design into bounded implementation work for the current
Prep learner-facing frontend.

This artifact plans realization only. It does not redefine Product, Domain,
Application, Human Interface, Machine Interface or Quality semantics.

The current repository still contains legacy `curation`, `learning` and
3D-oriented realization from an older UI model. Those directories are implementation
evidence, not authority over the current task/view/component boundaries.

## Decision basis and semantic status

Pre-choice implementation exploration and review for this revision are recorded as
noncanonical draft evidence:

- `.harness/candidates/frontend-implementation-design-exploration-draft.yaml`
- `.harness/candidates/frontend-implementation-design-decision-review-draft.yaml`

Selected implementation direction:

- feature-capability slices;
- semantic foundation before dependent feature slices;
- task-feature source roots rather than legacy resource/mode roots;
- current base frontend toolchain retained;
- consumer-owned handwritten TypeScript contracts;
- optional spatial renderer isolated behind its provider seam;
- existing fast automatic / explicit heavy validation split retained.

Formal semantic admission remains blocked by the legacy Harness lifecycle gap and by
upstream frontend architecture/component revisions that have not yet received
lifecycle-backed revalidation. This file is therefore a draft implementation revision
until that closure exists.

## Implementation boundary

In scope:

- realize the accepted Preparation Shell and task views against deterministic mock
  adapters;
- preserve active Target and optional Next-focus continuity;
- implement consumer-owned semantic models/ports for the current Machine Interface;
- migrate reusable code from legacy roots only when it satisfies the new owner contract;
- isolate optional spatial Knowledge rendering behind the current non-spatial
  task-complete Knowledge feature;
- update source-boundary checks and executable tests to current feature ownership;
- remove obsolete learner-facing Curation/Import/Progress/Diagnostics behavior from
  primary frontend behavior.

Out of scope:

- backend/persistence implementation;
- new inference algorithms;
- reusable corpus-authoring/curation UI not present in accepted learner tasks;
- new import workflow UI;
- authentication/multi-user behavior;
- provider/framework replacement;
- production 2D/3D renderer selection;
- invented latency/FPS/item-count targets.

## Selected toolchain

Retain the currently versioned frontend toolchain while correcting semantics and module
ownership:

- React 19;
- TypeScript 6;
- Vite 8;
- React Router 7;
- MUI 9;
- TanStack React Query 5;
- Vitest 5;
- Playwright 1.63;
- existing dependency-boundary checker.

Existing Three / react-force-graph-3d packages may remain only while a retained optional
spatial adapter/prototype path consumes them. They are not a required/default product
path and should be removed as ordinary dependency cleanup once no retained path needs
them.

No state-management framework, event bus, code-generation pipeline or replacement UI
provider is introduced.

## Repository realization

Target public source ownership:

```text
web/src/
  app/
    preparation-shell/
    preparation-context/
    composition/
  features/
    target-direction/
    target/
    current-position/
    knowledge-explorer/
    activity/
    evidence-change/
    preparation-support/
  adapters/
    mock/
    http/
    spatial/              # optional provider boundary; exact library subdir may vary
  ui/
    ...                   # shared presentation primitives/pattern mappings only
  test-support/
    ...
```

Within a feature root, the exact split into components/hooks/value modules is
implementation freedom. Consumer-owned port/model contracts should remain colocated
with or immediately owned by their consuming feature unless a genuinely repeated
stable value type merits a neutral shared contract module.

### Legacy-root transition

Current repository evidence includes:

- `web/src/features/curation/`;
- `web/src/features/learning/`;
- `web/src/features/knowledge-explorer/`;
- `web/src/adapters/graph-rfg3d/`.

Disposition:

- `knowledge-explorer` may be retained and adapted to the new
  `KnowledgeExplorerFeature` contract;
- useful support/activity code in `learning` may migrate into `activity` when it
  satisfies the accepted Activity responsibility;
- `curation` is not retained as a public learner feature boundary; code is deleted,
  archived outside production source, or migrated only when a current task feature has
  an accepted responsibility for it;
- `graph-rfg3d` may remain as the optional spatial provider adapter during prototype
  evidence collection, but task features must not import it directly.

There is no runtime/data coexistence or special migration protocol. Changes are
integrated through the task branch and delivered as ordinary whole-frontend artifact
replacement.

## Implementation slices

### FI-01 — Semantic frontend foundation and deterministic scenario

Create/update frontend-owned values and consumer ports for:

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
- evidence/change outcomes including a valid no-change or increased-uncertainty case;
- one PreparationRequest with accepted partial support plus unresolved/rejected
  remainder.

Completion:

- mock adapter satisfies current consumer contracts;
- no view derives target/learner/gap/change truth from raw fixtures;
- raw fixture/transport shapes do not leak into task features.

### FI-02 — Preparation Shell, context and Target direction

Implement:

- structural preparation navigation;
- active-child composition;
- narrow `PreparationContext` for active Target/focus;
- missing-context routing according to Interface Topology;
- `VIEW-TARGETS` including candidate-selection and comparison-ready variants.

Completion:

- comparison uses one learner evidence basis;
- candidate choice does not activate Target until explicit continuation;
- active Target is absent/optional before establishment;
- dependency checks prevent shell/context from becoming semantic data stores.

### FI-03 — Target establishment and requirements

Implement `VIEW-TARGET`:

- target-setup variant;
- establish/refine command state and input preservation;
- target-established variant;
- requirement/provenance inspection;
- direct Knowledge-focus navigation;
- contextual Prepare Support entry.

Completion:

- unresolved/rejected/stale outcomes preserve safe user/source context;
- Target requirement semantics remain separate from learner state and Knowledge;
- Target can navigate back to Targets for direction reconsideration.

### FI-04 — Current position and Next focus

Implement `VIEW-CURRENT` as one cohesive task feature:

- current-state projection;
- gaps/uncertainty;
- evidence-basis detail;
- focus-decision context;
- set/revise-focus behavior.

Completion:

- demonstrated/challenged/unknown remain explicit;
- unknown is not rendered as failure;
- no universal mastery/readiness score is created;
- evidence basis is inspectable without forcing cross-view recall;
- stale/rejected focus changes preserve the inspected decision context.

### FI-05 — Knowledge exploration

Adapt `knowledge-explorer` to the current contract:

- semantic query/scope;
- optional Required-Capability scope;
- bounded results;
- selected detail;
- relation inspection;
- task-complete keyboard/non-spatial path.

Optional spatial realization:

- consumes renderer-neutral projection only;
- preserves semantic selection/scope;
- may use the existing 3D adapter as prototype evidence;
- is not required/default and may be absent/degraded.

Completion:

- the complete accepted Knowledge task works with the spatial provider disabled;
- spatial geometry/camera never becomes semantic state;
- target/focus/scope survives entry/exit and degradation.

### FI-06 — Activity

Implement `VIEW-ACTIVITY`:

- support-selection variant;
- support-fit basis/limitations;
- start-attempt command;
- attempt-active variant;
- completion/submission;
- evidence-processing variant.

Completion:

- one accepted ActivityAttempt identity correlates the occurrence;
- activity completion alone cannot mark capability demonstrated or close a gap;
- pending completion prevents accidental duplicate submission;
- stale/dependency outcomes preserve context according to Interaction Design.

### FI-07 — Evidence & changes

Implement shared `VIEW-EVIDENCE-CHANGE` behavior:

- current-state-evidence variant entered from Current;
- post-activity-change variant entered from Activity/direct review link;
- evidence facts, argument/claim basis, provenance and limitations;
- changed/no-change/challenged/increased-uncertainty outcomes;
- explicit continuation actions including Target refinement where allowed.

Completion:

- current-state explanation does not fabricate a Change;
- post-activity review does not collapse observation into learner conclusion;
- Target-information refinement remains distinct from learner-evidence change;
- no generic Progress score/feature is introduced.

### FI-08 — Contextual preparation support

Implement `VIEW-PREPARE-SUPPORT`:

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

### FI-09 — Legacy-boundary cleanup and verification closure

After current task features have replacements:

- remove obsolete primary navigation/routes to learner-facing Curation/Import/Progress/
  standalone Diagnostics;
- remove or relocate legacy code that has no current owner;
- update boundary rules to the accepted feature roots;
- remove unused renderer dependencies if no retained optional spatial prototype uses
  them;
- update component/unit/E2E tests to `frontend-test-design.yaml`;
- verify stale legacy modules cannot re-enter task-feature dependencies.

Completion:

- source tree public boundaries match Component Design;
- no task path depends on Curation/Import/Progress/Diagnostics legacy modules;
- optional spatial provider remains replaceable/removable;
- all applicable current Frontend Verification checks have evidence.

## Dependency ordering

Required ordering:

1. FI-01 before any feature that consumes the new semantic contracts/mock scenario.
2. FI-02 before feature slices that require stable PreparationContext/Shell navigation.
3. FI-03/FI-04/FI-05 may proceed after foundation/shell with ordinary contract
   coordination.
4. FI-06 requires accepted active Target/focus and support contracts from FI-01/02.
5. FI-07 requires evidence/change contracts and Activity integration path.
6. FI-08 requires shell return-context plus preparation-request contracts.
7. FI-09 runs after replacement paths exist.

This is dependency ordering, not a mandatory methodology phase sequence.

## Verification enforcement

### Fast validation

Keep the current independently runnable fast checks:

- TypeScript typecheck;
- lint;
- dependency-boundary checks;
- unit/component/contract tests;
- lightweight repository/Harness structural checks where provided.

Fast checks should fail before expensive work and remain ordinary development feedback.

### Heavy validation

At the explicit final large-branch checkpoint run the versioned heavy workflow that
includes applicable:

- fast checks;
- production build;
- browser E2E;
- current task-flow/accessibility evidence;
- full Harness/graph checks available to the project;
- renderer/browser workload evidence only when a selected presentation/Quality boundary
  makes it applicable;
- container/artifact checks already required by project delivery.

A green fast path does not replace required heavy evidence.

## State realization

- router/shell: current preparation destination/active child;
- `PreparationContext`: active Target and accepted Next-focus identity/intention;
- feature-local state: selections, safe drafts/input, local interaction variants;
- adapter/query state: fetched semantic projections and pending outcomes;
- optional renderer-local state: geometry/camera/layout/physics/hover.

No general-purpose global semantic store is introduced.

## Mock-first rule

The prototype is useful only when a representative user can complete, without a
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

and can enter/return from contextual Prepare Support when required.

## Prototype completion criteria

1. Every current `VIEW-*` has an implemented task path or intentional structural shell.
2. Multi-target comparison uses one learner evidence basis and does not mutate Target or
   learner state.
3. Active Target/focus survive accepted navigation.
4. Current-state/gap/evidence/change semantics come from mock ports, not UI inference.
5. Knowledge is task-complete without a spatial renderer.
6. Activity completion alone does not fabricate evidence or learner progress.
7. Evidence/change review supports no-change/challenge/increased uncertainty.
8. Prepare Support supports partial/remainder/recovery/return without corpus/import UI.
9. Mock adapters satisfy consumer-owned ports.
10. Boundary/type/unit/browser checks required by the selected validation tier pass.
11. Old Curation/Import/Progress/Diagnostics behavior is absent from primary learner
    navigation and public task-feature dependencies.
12. Responsive composition preserves dominant task regions and context.
13. Keyboard/non-spatial/reduced-motion obligations remain task-complete.
14. Newly discovered semantic gaps are routed upstream rather than decided in code.

Meeting these criteria means **READY FOR REPRESENTATIVE-USABILITY VALIDATION**, not
automatic production UI authority.

## Production implementation gate

Production UI may treat the accepted UX/presentation package as authority only after:

- representative-user evidence has been collected for the target mental model,
  multi-target comparison, state/gap/focus flow and empty/incomplete preparation
  recovery;
- blocking/major findings have been routed to their owning artifacts and material fixes
  retested;
- critical learner vocabulary/state labels have been validated or revised;
- applicable accessibility evidence from Presentation/Frontend Verification is
  collected;
- any production spatial-renderer/default decision is supported by user/quality
  evidence rather than existing dependency presence or owner preference;
- unresolved/deferred UX decisions are explicit;
- Harness lifecycle/currentness for the production frontend closure has been restored
  and affected capabilities have explicit semantic revalidation.

Until then, `web/` remains coded prototype/implementation evidence. It is not the
authority from which upstream UI semantics are reconstructed.

## Rollback / release semantics

Current accepted deployment uses whole-frontend artifact replacement and has no
frontend-specific data migration/coexistence contract.

Rollback therefore restores the previous deployable frontend artifact together with its
compatible versioned contracts/configuration. If future implementation introduces
mixed-version coexistence, persistent browser migrations or irreversible transition
state, reopen Change/Transition Design before relying on this plan.
