# Frontend Verification Strategy

## Purpose

Verify that the production frontend realization preserves accepted Prep product behavior, interface semantics, frontend architecture boundaries and current quality scope.

This strategy defines correctness evidence. It does not select component structure, test framework, renderer library, frontend framework or numeric performance targets.

## Scope

Accepted inputs:

- `docs/vision/vision.md`
- `docs/vision/product-capabilities.md`
- `docs/verification/interface-verification.md`
- `docs/verification/presentation-verification.md`
- `docs/architecture/system-architecture.md`
- `docs/architecture/frontend-system-architecture.md`
- `docs/interface/machine-interface.md`
- `docs/architecture/performance-capacity.md`

## Verification checks

### FV-01 Product-capability trace closure

**Verifies:** frontend behavior claimed by the current slice traces to accepted Product Capabilities rather than to legacy screens or implementation convenience.

**Method:** ANALYSIS

**Required evidence:**

- Learning target selection/preparation/export traces to PC-01/PC-04/PC-06;
- Knowledge finding/relationship exploration traces to PC-03;
- Curation authoring/import paths trace to PC-02/PC-10 where applicable;
- review evidence inspection/sync traces to PC-07;
- no UI claim introduces automatic prioritization, inferred retention/mastery or adaptive replanning that remains deferred upstream.

### FV-02 Frontend dependency-boundary enforcement

**Verifies:** production dependencies follow the accepted frontend ports/adapters architecture.

**Method:** ANALYSIS

**Required evidence:** automated dependency/static checks or equivalent reviewable evidence proving:

- feature/public models do not depend on raw transport DTO/status/route semantics;
- feature/public models do not depend on 3D renderer scene/node/link/camera types;
- renderer adapter does not issue independent canonical backend mutations;
- browser code does not call the external study runtime directly;
- technical provider dependencies remain outside frontend semantic contracts.

The exact module paths are supplied later by Component/Implementation Design.

### FV-03 Knowledge semantic access and 3D projection

**Verifies:** the selected 3D projection is useful as local relational presentation without becoming the only semantic access path.

**Method:** TEST

**Required evidence:** end-to-end or component/integration-level behavior proves:

- global and target-relevant Knowledge scopes are distinguishable;
- search/filter can establish results without renderer interaction;
- textual result selection establishes canonical focus;
- focused detail exposes identity/content/semantic kind;
- relation type and direction are explicitly readable;
- following a relation changes focus while preserving explicit scope;
- 3D selection/focus maps to the same semantic identities;
- disabling/failing the renderer leaves textual Knowledge access functional.

### FV-04 Curation canonical-state and recovery semantics

**Verifies:** frontend editing preserves backend canonical authority and accepted validation/conflict behavior.

**Method:** TEST

**Required evidence:** representative Target, Requirement/RequirementSet, Question and Knowledge mutations prove:

- proposed input remains distinguishable from canonical accepted state;
- accepted outcome updates visible canonical state;
- validation rejection preserves entered intent for correction;
- conflict does not silently apply last-writer-wins in the UI;
- reload/reconciliation exposes current canonical state before deliberate retry;
- Learning context does not silently enable Curation mutations.

### FV-05 Study preview/export and evidence behavior

**Verifies:** the learner-facing production flow preserves accepted preview/export fidelity and factual evidence semantics.

**Method:** TEST

**Required evidence:**

- target selection loads read-only prepared scope;
- Study Set build returns current material or explicit empty result;
- export uses the reviewed materialization;
- stale materialization produces conflict/rebuild behavior;
- external runtime failure preserves reviewable local context;
- partial external export failure remains item-distinguishable;
- review sync can refresh factual ReviewObservations;
- absence of evidence is not rendered as mastery failure.

### FV-06 Responsive and keyboard task continuity

**Verifies:** concrete frontend realization preserves Screen/View responsive semantics and non-spatial accessibility paths.

**Method:** TEST

**Required evidence:**

- wide Curation master/detail can become a narrow focused substate without changing semantic view identity;
- returning from narrow detail restores meaningful originating context/focus;
- wide Knowledge gives 3D spatial priority while retaining textual/detail access;
- narrow Knowledge makes textual search/detail primary and exposes 3D as an explicit mode;
- Knowledge search, result selection, focus and relation traversal are keyboard-operable;
- renderer interaction cannot trap keyboard focus;
- semantic status is not conveyed by color alone.

No exact breakpoint is part of the oracle.

### FV-07 Browser/backend and external-runtime boundary

**Verifies:** browser behavior uses accepted backend machine operations and preserves their outcome semantics.

**Method:** ANALYSIS

**Required evidence:**

- server-backed collection search/filter uses backend query semantics rather than filtering an arbitrary partial page as if complete;
- frontend mappings preserve success, not-found, validation-rejected, conflict, external-runtime-unavailable, partial-external-failure and operational-failure distinctions where applicable;
- no browser-direct Anki/AnkiConnect integration exists;
- external runtime credentials/configuration do not become browser product state.

### FV-08 Failure isolation

**Verifies:** local frontend/provider failures do not unnecessarily collapse independent user work.

**Method:** TEST

**Required evidence:**

- 3D renderer initialization/runtime failure is contained to the projection and exposes textual Knowledge access;
- recoverable backend request failure is contained to the affected task/view when safe;
- external-runtime outage affects only operations requiring it;
- already confirmed local display/context is retained when accepted recovery permits it;
- fatal shell-level failure handling is not used as a substitute for feature recovery semantics.

### FV-09 Quality-target discipline

**Verifies:** production acceptance does not reinstate unaccepted historical graph performance numbers.

**Method:** INSPECTION

**Required evidence:**

- no release gate requires an FPS, node/edge count, draw-call, triangle or layout-settle threshold absent from current Quality Design;
- 3D benchmarks may run as diagnostic evidence;
- optimization/fallback preserves canonical identity, relation semantics and textual Knowledge access;
- worker/offscreen/remote-renderer complexity is not required solely by an unaccepted benchmark target.

### FV-10 Current-chain traceability

**Verifies:** production frontend evidence is evaluated against the rebuilt CURRENT chain rather than obsolete accepted UI artifacts.

**Method:** ANALYSIS

**Required evidence:**

- implementation/component/test design references current acceptance ids/providers;
- topology/screen subject validation passes for the rebuilt `V-*` view set;
- no correctness oracle depends on obsolete screen identifiers/composition;
- CI revalidates semantic/currentness closure after material design changes.

## Verification gate

`prep.frontend-verification` is satisfied when FV-01 through FV-10 have explicit current evidence requirements and the downstream Frontend Test Design supplies executable coverage for behavior-oriented checks.

The following checks require executable test contracts downstream:

- FV-03;
- FV-04;
- FV-05;
- FV-06;
- FV-08.

The following should have automated/static evidence where practical:

- FV-02;
- FV-07;
- FV-10.

FV-01 and FV-09 may remain analysis/inspection gates because their purpose is semantic scope discipline rather than runtime behavior.

## Out of scope

- selecting component decomposition;
- selecting frontend/test frameworks;
- selecting exact file/module paths;
- defining new product/domain/interface behavior;
- setting numeric performance targets;
- proving backend/domain internals beyond observable machine-boundary behavior.

## Unresolved Questions

None introduced by Frontend Verification.
