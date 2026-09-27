# Frontend Engineering Policy

## Purpose

Define the cross-cutting engineering obligations that keep the rebuilt Prep frontend aligned with its accepted interface and frontend architecture while preserving implementation freedom.

This policy is intentionally small. It applies KISS and explicit dependency ownership where they prevent known frontend failure modes; it does not mandate patterns, abstractions or libraries without demonstrated need.

## Applicability

This policy applies to frontend component and implementation design and to production frontend code that realizes:

- Learning;
- Knowledge;
- Curation;
- backend machine-operation access;
- the textual Knowledge projection;
- the selected 3D Knowledge projection.

## P1 — Preserve accepted semantic boundaries

Frontend code must express accepted Prep concepts and task/view semantics rather than exposing transport, renderer or framework vocabulary as the public model of a feature.

Reviewable obligations:

- feature/view-facing models use accepted concepts such as target, Knowledge focus, exploration scope, Question material, review evidence and change outcome;
- raw backend DTO/status/route mechanics stop at the backend adapter/mapping boundary;
- renderer scene/node/link/camera object types stop at the 3D renderer adapter;
- Anki/AnkiConnect concepts do not become frontend product/domain concepts;
- screen/component code does not recreate domain validation, conflict or relation semantics already owned upstream.

## P1 — Dependency direction follows frontend ports/adapters

Dependencies point from technical providers toward frontend-owned contracts, not from feature semantics toward provider APIs.

Required seams exist only where provider leakage would otherwise cross feature/public boundaries:

- backend machine-operation adapter;
- 3D renderer adapter;
- browser/platform adapters when a platform API would otherwise become a feature contract.

A wrapper around every library primitive is not required.

Feature modules may use ordinary framework primitives locally when those primitives do not become cross-feature semantic contracts.

## P1 — One canonical server authority

Backend-owned canonical data remains authoritative.

Frontend caches and local representations are replaceable projections.

Required behavior:

- mutation success is not committed in UI semantics until the accepted backend outcome permits it;
- validation rejection and conflict keep proposed input distinguishable from canonical state;
- stale/failed requests do not silently overwrite newer confirmed canonical state;
- browser persistence is not introduced as a second canonical store without a new accepted architecture decision.

## P1 — 3D remains an optional presentation dependency

The Knowledge feature must remain semantically usable without successful 3D renderer initialization.

Required behavior:

- textual search, focus, detail and relationship traversal do not import renderer-specific APIs;
- renderer activation consumes a renderer-neutral Knowledge projection model;
- renderer events translate back into frontend intents/identities;
- renderer failure is handled at the projection boundary and preserves textual Knowledge access;
- direct renderer interaction is never the only path for an accepted semantic task.

Existing 3D experiment code should be reused when it satisfies these boundaries. Reuse is preferred over rebuilding equivalent mechanics, but donor code must be adapted rather than allowed to redefine the accepted architecture.

## P1 — State ownership is explicit

Before adding frontend state, classify its owner/lifetime.

### Server representation state

Examples:

- targets;
- Knowledge;
- Requirements;
- Questions;
- review observations;
- import outcomes.

These values mirror backend-authoritative state and belong to query/cache handling, not feature-owned canonical stores.

### Interaction state

Examples:

- current work context;
- active target reference;
- search/filter;
- Knowledge scope/focus;
- editor draft;
- disclosure;
- pending operation/recovery state.

Keep interaction state as local as practical to the feature/view that owns it. Promote it only when multiple accepted views require shared continuity.

### Renderer-local state

Examples:

- camera;
- scene resources;
- transient hover;
- renderer lifecycle.

Keep it inside the renderer adapter/presentation boundary unless an accepted frontend semantic state explicitly requires promotion.

## P1 — Feature ownership follows accepted work responsibilities

Use cohesive feature ownership around accepted frontend responsibilities:

- app composition/shell;
- Learning;
- Knowledge;
- Curation;
- provider adapters.

Do not split code merely to mirror every screen region or backend resource.

Do not duplicate shared Knowledge semantics into separate Learning-Knowledge and Curation-Knowledge implementations. Work context controls available actions around the same canonical Knowledge responsibility.

## P1 — KISS over speculative abstraction

Introduce an abstraction when it has a present responsibility:

- protects an accepted boundary;
- supports more than one real consumer;
- enables a required provider substitution;
- removes stable repeated product/engineering knowledge.

Do not introduce abstractions solely because a future alternative can be imagined.

Examples of non-rules:

- no mandatory repository class for every backend operation;
- no CQRS frontend architecture requirement;
- no event bus by default;
- no microfrontend boundary;
- no generic form/table/list framework required;
- no wrapper for every design-system or renderer primitive;
- no universal global state store.

## P2 — Composition before inheritance

Use composition for UI/presentation collaboration unless a true substitutable subtype relationship exists.

Shared behavior should be extracted around stable repeated responsibilities rather than deep inheritance hierarchies.

This is especially important for:

- entity finder/focused-detail patterns;
- loading/error/empty feedback;
- backend operation state;
- Knowledge projection controls.

## P1 — Task behavior is tested at public boundaries

Default tests target accepted observable behavior and consumer-owned contracts.

Prefer tests of:

- task/view states and transitions;
- operation mapping/outcome handling;
- renderer-neutral projection contracts;
- adapter boundaries;
- semantic fallback behavior;
- responsive/focus behavior when it is an accepted view contract.

Avoid coupling correctness tests to private component structure, exact DOM nesting or renderer internals unless those mechanics are themselves the failure boundary under test.

## P1 — Accessibility paths are architectural obligations

Implementation must preserve the accepted non-spatial semantic path:

- keyboard search/result selection/focus;
- relationship traversal without pointer-only spatial gestures;
- visible focus;
- readable semantic status;
- relation type/direction outside geometry.

The selected 3D projection may add direct manipulation; it may not replace these paths.

## P2 — Progressive disclosure over permanent control density

Screen/View Design already establishes task priority and responsive transformations.

Implementation should therefore:

- keep primary task controls discoverable;
- move projection tuning and secondary information behind contextual disclosure;
- avoid permanently allocating large shell/chrome areas to controls that are not part of the current task;
- preserve semantic context when master/detail becomes sequential on narrow layouts.

## P2 — Error handling is regional where accepted

Recoverable operation or renderer failures should be contained by the owning task/presentation boundary.

Do not convert a local failure into a whole-application error state unless the application cannot safely continue.

A global error boundary may protect the shell from fatal composition failures; it is not a substitute for accepted feature recovery states.

## P2 — Performance work follows evidence

There is no current MVP numeric FPS/node/edge/rendering acceptance target.

Engineering may measure and optimize, especially around the reused 3D renderer, but:

- diagnostic benchmark thresholds are not release gates unless Quality Design later accepts them;
- optimization must not remove textual Knowledge access or semantic relation meaning;
- do not introduce a worker/remote renderer/microfrontend solely for speculative performance.

## Forbidden dependency patterns

The following are policy violations:

- feature semantics importing raw transport DTO/status-code contracts as their public model;
- Learning/Curation feature code importing 3D renderer scene types;
- renderer adapter issuing canonical backend mutations independently of the Knowledge feature/application flow;
- browser code calling the external study runtime directly;
- feature-owned mutable global state duplicating backend canonical state;
- renderer or visual geometry defining Knowledge identity/relation semantics;
- hidden optimistic mutation presented as accepted canonical state;
- production task behavior depending on numeric graph targets that are not accepted quality constraints.

## Explicit non-rules

This policy does not mandate:

- React, Vue or another framework;
- a particular state/query library;
- a particular router;
- a particular CSS/design-system implementation;
- Clean Architecture folder names;
- use-case/repository classes for every operation;
- microfrontends;
- Web Workers/OffscreenCanvas;
- a generic component library beyond what downstream component design demonstrates is useful;
- exact bundle/chunk structure.

## Downstream consumption

`prep.frontend-component-design` must translate these obligations into concrete component/provider boundaries.

`prep.frontend-implementation-design` must translate them into repository/module realization and verification gates.

A downstream choice may vary internally as long as these observable dependency and ownership obligations remain satisfied.
