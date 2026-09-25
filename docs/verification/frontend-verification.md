# Frontend Verification Design

## Purpose

Define the evidence required before the production frontend can be treated as a conforming realization of accepted Prep product, interface, machine-contract and frontend-architecture knowledge.

This artifact owns verification obligations only. It does not redefine product behavior, screen semantics, machine contracts, architecture boundaries or implementation structure.

## Accepted sources

This verification design is derived from:

- `docs/vision/product-capabilities.md`;
- `docs/verification/presentation-verification.md`;
- `docs/architecture/frontend-system-architecture.md`;
- `docs/interface/machine-interface.md`.

The downstream Test Design may refine TEST obligations into executable preconditions, actions and observable oracles. Implementation code remains evidence, not semantic authority.

## Verification strategy

### FV-01 — Product capability traceability

**Verifies**

Every production frontend behavior exposed to the user is traceable to an accepted Prep product capability and to the accepted interface/view responsibility that realizes it.

The frontend must not gain product behavior merely because a UI/provider component supports it.

**Method:** INSPECTION.

**Evidence requirement**

A generated or reviewable trace from implemented frontend entry points/actions to accepted Product Capability + Screen/View responsibility. Any implemented user-visible capability with no accepted source is a failure.

### FV-02 — Accepted functional/view behavior

**Verifies**

Representative Learning and Curation workflows realize accepted view responsibilities and material states, including:

- Learning/Curation mode selection;
- target context preservation;
- list/search/detail Knowledge access;
- Question -> Knowledge navigation;
- accepted loading/empty/recoverable-failure/unavailable states;
- Curation collection/editor responsibilities;
- contextual Import and runtime-status presentation where applicable.

**Method:** DEMONSTRATION + TEST.

**Evidence requirement**

Rendered/browser scenarios proving the accepted flows and outcomes. Exact executable scenarios are owned by Frontend Test Design.

Presentation-specific evidence from `PRESENTATION-VERIFICATION` is reused rather than duplicated.

### FV-03 — Machine-contract mapping fidelity

**Verifies**

Frontend adapters preserve the accepted Machine Interface contract:

- requests use only accepted operations/inputs;
- response identity/semantics survive transport mapping;
- accepted collection metadata such as exact `total_count` survives mapping when required by the accepted view, while opaque cursors remain transport/query mechanics;
- validation/conflict/unavailable/recoverable outcomes map to corresponding frontend states;
- provider/transport-specific failures do not leak as product semantics;
- the browser does not invent unsupported backend query/filter behavior.

**Method:** TEST + INSPECTION.

**Evidence requirement**

Adapter contract tests or equivalent deterministic evidence for representative success and failure outcomes, plus review showing feature code does not reinterpret raw transport status/payloads.

### FV-04 — Frontend dependency direction

**Verifies**

The accepted frontend architecture dependency rules are preserved:

- Learning and Curation internals do not depend on one another;
- feature modules depend on frontend-owned contracts, not concrete HTTP/mock adapters;
- feature modules do not import the concrete graph renderer library;
- shared presentation code does not own feature state or canonical business truth.

**Method:** TEST/ANALYSIS.

**Evidence requirement**

Deterministic dependency/import validation where practical, backed by source-structure inspection for boundaries that tooling cannot express reliably.

### FV-05 — Transport DTO isolation

**Verifies**

Raw browser/backend DTOs terminate inside the HTTP adapter boundary and are mapped into frontend-owned semantic/read models before reaching feature logic.

**Method:** TEST + INSPECTION.

**Evidence requirement**

Import-boundary evidence and mapper/adapter tests proving canonical Prep identities, accepted distinctions and accepted collection metadata are preserved across representative operations while raw DTO/cursor representation remains adapter-private.

### FV-06 — Renderer isolation

**Verifies**

The graph renderer remains a replaceable presentation adapter:

- concrete renderer/Three.js objects stay inside the renderer adapter;
- coordinates, camera, physics and drag state never become canonical Knowledge fields;
- feature code consumes renderer-neutral GraphScene / GraphRenderer contracts;
- click-without-drag activation and other renderer mechanics cannot mutate Knowledge semantics directly.

**Method:** TEST + INSPECTION.

**Evidence requirement**

Boundary/import evidence plus renderer contract tests using renderer-neutral scenes/events.

Exact layout coordinates are never verification oracles.

### FV-07 — Mock / HTTP contract substitutability

**Verifies**

Mock and HTTP realizations satisfy the same consumer-owned frontend query contracts and produce equivalent frontend semantic/read-model shapes for equivalent accepted data.

**Method:** TEST.

**Evidence requirement**

Shared contract fixtures/tests applied to both adapter families for the operations used by the selected frontend slice.

The test does not require mock and HTTP transport internals to resemble each other.

### FV-08 — State ownership and lifetime

**Verifies**

Frontend state follows accepted ownership:

- shell owns top-level mode/navigation context;
- Learning owns selected target/workspace context;
- KnowledgeExplorer owns semantic filters/selection/focus intent;
- renderer owns camera/layout/physics/transient gesture state;
- server query/cache state remains in the feature/data-access boundary;
- canonical business truth is not promoted into a global frontend mutable store.

**Method:** INSPECTION + TEST where state transitions are observable.

**Evidence requirement**

Source-structure review plus focused component/integration tests proving representative ownership boundaries and context preservation.

### FV-09 — Presentation evidence closure

**Verifies**

All applicable obligations in `docs/verification/presentation-verification.md` have evidence before production frontend closure is claimed, including:

- shared presentation-pattern consistency;
- provider-neutral semantic fidelity;
- coherent theme/token roles;
- accessibility/non-graph access;
- 3D task-value evaluation where the 3D projection is included.

**Method:** ANALYSIS.

**Evidence requirement**

A trace to the concrete presentation evidence produced by prototype/production realization. Missing rendered evidence remains an implementation/evidence gap; it must not be replaced with invented semantics.

### FV-10 — Upstream-change revalidation

**Verifies**

Changes to accepted Product Capability, Machine Interface, Presentation/Screen/View or Frontend System Architecture knowledge cannot leave production frontend verification silently current.

**Method:** ANALYSIS + INSPECTION.

**Evidence requirement**

Harness strict semantic/currentness evaluation remains part of the frontend implementation closure, and frontend verification/test evidence is rerun or explicitly revalidated when its accepted prerequisite baseline changes.

This check proves revalidation discipline; it is not a project-management gate.

## Requirement / source trace

| Accepted source | Verification checks |
|---|---|
| Product Capabilities | FV-01, FV-02 |
| Presentation Verification | FV-02, FV-09 |
| Machine Interface | FV-03, FV-05 |
| Frontend System Architecture | FV-04, FV-05, FV-06, FV-07, FV-08 |
| prerequisite-baseline currentness | FV-10 |

## Completion meaning

`prep.frontend-verification` is accepted when the verification obligations above are explicit and traceable to accepted sources.

It does **not** mean the implementation evidence already exists. Evidence is produced by later implementation/test work and must satisfy these obligations before production implementation closure is claimed.

## Out of scope

Frontend Verification Design does not decide:

- exact test framework or fixture syntax;
- individual test-case implementation;
- exact file/module layout;
- concrete UI provider or renderer version;
- pixel-perfect snapshots as canonical truth;
- product/domain/interface behavior absent from upstream canonical knowledge.

## Harness semantic acceptance

This artifact satisfies the `verification-strategy` ownership check:

- **verification-not-semantic-owner** — every check proves accepted upstream behavior/structure and introduces no new product, interface, machine or architecture semantics.
