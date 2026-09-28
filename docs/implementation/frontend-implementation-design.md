# Frontend Implementation Design

## Purpose

Translate accepted frontend architecture, component contracts, verification obligations and test design into bounded implementation work for the user-centered prototype.

This artifact does not redefine Product, Domain, Application, Interface or Machine Interface semantics.

## Implementation boundary

In scope:

- realize the complete target-relative frontend loop against deterministic mock adapters;
- preserve Target Work / Curation separation;
- implement consumer-owned ports/models required by target, state, gaps, focus, learning, diagnostics, progress, Knowledge and import;
- retain the existing 3D Knowledge renderer behind its renderer adapter;
- keep Question/Anki behavior as a compatibility subflow;
- provide representative mock data for one coherent technical-career target.

Out of scope:

- backend/persistence;
- arbitrary source extraction;
- automatic corpus generation;
- new learner-state inference algorithms;
- new domain semantics;
- authentication/multi-user behavior.

## Selected toolchain

Keep the existing production `web/` toolchain and provider choices unless implementation evidence requires reopening them:

- React / TypeScript / Vite;
- React Router;
- MUI;
- Vitest;
- Playwright;
- existing 3D renderer adapter.

No tool/provider change is required for this user-centered correction.

## Repository realization

Target-work features are organized by responsibility:

```text
web/src/features/
  target/
  learner-state/
  gaps/
  learning/
  diagnostics/
  progress/
  knowledge-explorer/
  curation/
```

Exact file split is implementation freedom. Existing `features/learning/**` code may be incrementally refactored rather than physically moved when doing so preserves the accepted boundaries.

Adapters remain under:

```text
web/src/adapters/
  mock/
  http/
  graph-rfg3d/
```

## Implementation slices

### FI-UC-01 — Semantic models and mock scenario

Create frontend-owned models/fixtures sufficient for one target:

`Python Backend Developer — Fintech / Card Payments`.

Fixture must include:

- target context and requirement tree;
- capabilities covering Python/backend/distributed systems/databases/payments/card processing/idempotency/reconciliation/security/observability;
- satisfied, unresolved and challenged target fragments;
- evidence basis;
- current gaps;
- one active learning focus;
- target/focus-scoped Knowledge;
- available learning support for some gaps;
- one missing-support case;
- one diagnostic opportunity;
- one evidence update that changes target-relative state;
- import contract plus mixed valid/rejected sample import results.

Completion:

- mock adapter exposes the new consumer contracts;
- no view derives target satisfaction/gaps locally.

### FI-UC-02 — Target / State / Gaps shell

Implement:

- target selection;
- target overview;
- current state;
- gaps;
- focus selection;
- persistent active-target/current-focus context.

Completion:

- end-to-end navigation works against mocks;
- satisfied/unresolved/challenged remain distinct;
- unresolved is not shown as failure or zero proficiency.

### FI-UC-03 — Learning / Diagnostics / Progress

Implement:

- learning support by current focus;
- diagnostic opportunity flow;
- evidence update/sync mock;
- progress comparison;
- adaptation back to gap/focus selection.

Question/Study Set compatibility may remain nested inside Learning.

Completion:

- one evidence update causes a justified visible state/gap change;
- valid no-change handling is testable;
- activity completion alone does not close gaps.

### FI-UC-04 — Knowledge context integration

Adapt current Knowledge Explorer so it can operate in:

- target scope;
- current-focus scope;
- Curation/global scope.

Preserve:

- 3D default on capable environments;
- selection vs explicit focus;
- list/search/detail fallback;
- renderer isolation.

Completion:

- current target/focus remains visible while entering/leaving Knowledge;
- scope changes do not redefine canonical Knowledge semantics.

### FI-UC-05 — Curation + Import correction

Align Curation navigation and surfaces to:

- Targets;
- Capabilities;
- Knowledge;
- Learning Support;
- Assessment;
- Import;
- Quality.

Import must expose:

`contract/examples -> validate -> apply`.

Completion:

- validation never applies data;
- mixed accepted/rejected outcomes remain inspectable;
- incremental editors remain distinct from bulk import.

### FI-UC-06 — Verification closure

Implement/update browser and component tests for the current Frontend Test Design and Presentation Verification obligations.

CI realization is deliberately tiered:

- **fast** — frontend typecheck, lint, dependency-boundary checks and unit tests; lightweight semantic/Harness/document closure in a separate repository-fast workflow;
- **heavy** — full Harness revalidation, maintained reference suites, dependency audit, production build, Playwright E2E, graph stress evidence and container identity verification.

Heavy validation is manually dispatched on the large branch being finalized; ordinary feature pushes, PR updates and `main` pushes do not trigger it implicitly.

Completion:

- fast typecheck/lint/boundary/unit checks pass during implementation;
- final heavy validation passes before the large branch is treated as fully verified;
- applicable mock-first FTD contracts pass;
- old Overview/Knowledge/Study/Statistics-only navigation is removed from product behavior;
- no frontend code invents domain/application semantics.

## State realization

- router/shell: active mode + active target identity;
- target context: active focus identity/intention;
- feature-local state: selections/drafts/transient interactions;
- adapters/query state: fetched semantic projections;
- renderer-local state: camera/layout/physics/hover.

No general-purpose global store is introduced.

## Mock-first rule

The frontend prototype is considered useful only when the representative user can complete:

```text
select target
-> understand requirements
-> inspect current state
-> inspect gaps
-> choose focus
-> learn or diagnose
-> obtain new evidence
-> inspect changed progress
```

with no backend.

## Prototype completion criteria

1. Current Task Model is traceable to implemented target-work and curation surfaces.
2. Active target/focus survive navigation.
3. State/gap/progress semantics come from mock ports, not UI inference.
4. Knowledge remains usable through 3D and non-spatial paths.
5. Import exposes contract, validation and apply as distinct steps.
6. Target Work does not silently mutate reusable corpus semantics.
7. Mock adapters satisfy consumer-owned ports.
8. Frontend boundary/type/build tests pass.
9. Old Study/Statistics-centered IA is absent from primary navigation.
10. Any newly discovered semantic gap is routed upstream rather than decided in code.
11. Completely empty-corpus bootstrap is demonstrable end to end.
12. Learning practice can be performed without activity completion fabricating evidence.
13. Reduced-motion and non-spatial Knowledge paths remain task-complete.

Meeting these criteria means **READY FOR USABILITY VALIDATION**, not ready for production UI implementation.

## Production implementation gate

Production implementation may treat the accepted UX/presentation package as authority only after:

- representative-user evidence has been collected for the target mental model and empty-system bootstrap;
- BLOCKING/MAJOR findings have been routed to their owning artifacts and material fixes retested;
- the 3D-vs-non-spatial production-default decision has human evidence rather than only feasibility/owner preference;
- critical learner vocabulary/state labels have been validated or revised;
- accessibility evidence required by Presentation Verification has been collected for supported core flows;
- unresolved/deferred UX decisions are explicitly separated from accepted handoff decisions.

Until then, `web/` is a coded interactive prototype and implementation evidence source, not the authority from which upstream UX semantics are reconstructed.
