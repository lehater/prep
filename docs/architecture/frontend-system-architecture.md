# Frontend System Architecture

## Purpose

Define the browser-side runtime, dependency and failure-isolation architecture that realizes the accepted Prep System Architecture and rebuilt Presentation/Screen contracts.

The frontend architecture preserves one backend canonical source of truth, keeps interaction state browser-local, isolates the selected 3D Knowledge projection from semantic access, and leaves component decomposition/framework mechanics downstream.

## Architecture driver closure

| Concern | State | Frontend decision | Basis |
| --- | --- | --- | --- |
| execution-mode | RESOLVED | One interactive browser application invokes foreground backend operations; 3D projection work is local presentation work. | System Architecture, Interaction Design |
| consumers | RESOLVED | One user performs Learning, Knowledge and Curation tasks through the same browser application. | Screen/View Design |
| load-volume-frequency | RESOLVED | Collections use backend search/pagination; Knowledge projection is bounded/focus-progressive rather than full-corpus mandatory. | Machine Interfaces, Presentation System, Quality Design |
| latency-freshness | RESOLVED | Server-backed reads/mutations are request/outcome interactions; preview/export currentness remains backend-authoritative. No client eventual-consistency contract is introduced. | Machine Interfaces, System Architecture |
| availability | RESOLVED | 3D renderer failure must not remove textual Knowledge access. External runtime failures arrive through backend outcomes and do not collapse unrelated frontend tasks. | Presentation System, Screen/View Design |
| recovery-durability | RESOLVED | Unsaved interaction/form context may be preserved locally during recoverable failure; canonical durability belongs to backend storage. | Interaction Design, System Architecture |
| growth-horizon | RESOLVED | Current browser architecture supports bounded projections and paginated/searchable collections; no microfrontend or independently scaled browser subsystem is required. | Quality Design, Machine Interfaces |
| deployment-environment | RESOLVED | One browser bundle/application is delivered for the current Prep server deployment. 3D renderer code executes within the browser boundary. | System Architecture |
| concurrency | RESOLVED | Frontend never resolves canonical write conflicts itself; it surfaces accepted conflict outcomes and reload/reconciliation flows. | Interaction Design, Machine Interfaces |
| integration-boundaries | RESOLVED | Browser talks only to Prep backend machine operations. The 3D renderer consumes browser-side projection/view-model data and does not call backend/external runtime independently. | Machine Interfaces, System Architecture |
| persistence-history | RESOLVED | Browser persistence is not a canonical history store. Review history and canonical data remain backend-owned. | System Architecture, Data Design |
| security-trust-boundary | RESOLVED | Deployment secrets and external-runtime credentials remain outside browser state. No new frontend authorization model is invented. | System Architecture, Machine Interfaces |

No current frontend driver requires another browser runtime, microfrontend deployment or background worker.

## Runtime topology

```text
Browser application runtime
|
+-- shell / navigation context
+-- feature/application-facing UI orchestration
+-- server-state query/mutation boundary
|     |
|     +--> HTTP/backend adapter --> Prep backend machine operations
|
+-- browser-local interaction state
|     +-- active target/context
|     +-- search/filter/focus
|     +-- unsaved form state
|     +-- responsive/disclosure state
|
+-- Knowledge presentation boundary
      +-- textual/search/detail projection
      +-- 3D projection adapter
             +-- renderer-local camera/scene/interaction state
```

The textual and 3D projections consume the same canonical/view-model semantics. Neither owns Knowledge identity or relation meaning.

## Browser application boundary

One browser application runtime is sufficient for the current scope.

It owns technical coordination of:

- navigation/work-context continuity;
- backend request lifecycles;
- browser-local interaction state;
- mapping backend operation results into accepted screen states;
- presentation projection/view-model construction;
- activation/deactivation of the 3D renderer.

It does not own:

- canonical domain state;
- persistent learner history;
- import reconciliation;
- external-runtime credentials or calls;
- semantic conflict resolution.

## Backend interaction boundary

All server-backed behavior goes through the accepted machine operation contract.

The frontend architecture uses a transport adapter that maps application-facing frontend requests to those operation IDs and maps machine outcomes back into view/application states.

Feature/view code must not depend on raw HTTP route strings, status-code interpretation or transport DTO shape as semantic truth.

No browser-direct Anki/AnkiConnect path is allowed.

## Server state and browser state

### Backend-authoritative state

Backend-owned canonical/server state includes:

- LearningTargets and prepared scopes;
- Knowledge and accepted relationships;
- Requirements/RequirementSets and alignments;
- Questions and alignments;
- ReviewObservations/statistics;
- import outcomes/canonical results.

Frontend caches may retain representations of these values for interaction efficiency, but cache contents remain replaceable and non-authoritative.

### Browser-local interaction state

Browser-local state includes:

- selected root work context;
- active target reference used by Learning context;
- current search/filter text;
- current Knowledge exploration scope;
- Knowledge focus;
- disclosure/panel state;
- unsaved editor input;
- transient loading/recovery state;
- 3D camera/scene interaction state.

Browser-local interaction state may survive local re-render/navigation where useful, but persistence across sessions is not a semantic requirement.

## Knowledge projection architecture

### Projection model boundary

Knowledge presentation consumes a renderer-neutral projection model containing only presentation-safe semantics required by the selected scope, such as:

- Knowledge identity;
- readable content/label;
- semantic kind;
- accepted relationship identity/type/direction;
- current focus;
- current bounded visible membership.

Renderer geometry/camera objects do not enter canonical/domain or general feature state.

### Textual projection

Search/list/focused detail is a first-class frontend projection, not a fallback implementation afterthought.

It must remain usable when:

- 3D is disabled;
- renderer initialization fails;
- rendering is unsuitable for the current viewport/device;
- the user chooses textual traversal.

### 3D projection adapter

The selected 3D relational projection is behind a dedicated browser presentation adapter/seam.

The adapter owns only renderer-specific concerns:

- node/link scene realization;
- camera/viewpoint state;
- renderer event translation;
- renderer resource lifecycle;
- mapping selected/focused projection identities back to renderer-neutral frontend intents.

It must not:

- issue independent canonical mutations;
- decide Knowledge membership/type/direction;
- become the source of selection/focus identity;
- require feature/domain code to import renderer-specific object types.

The existing 3D experiment should be reused through this boundary where its mechanics match the accepted projection contract.

## Renderer execution alternatives

The current architecture does **not** require a Web Worker, OffscreenCanvas, separate process or remote renderer.

A same-browser-runtime adapter is the smallest topology satisfying accepted inputs because no numeric performance target currently justifies a second execution boundary.

Worker/offscreen execution remains an implementation/evolution option if representative evidence later shows main-thread contention that materially harms accepted tasks.

## Dependency direction

```text
screen/view realization
      |
      v
frontend feature/use-case boundary
      |
      +--> backend operation port --> HTTP adapter
      |
      +--> projection model
              |
              +--> textual projection
              +--> 3D renderer port --> renderer adapter/library
```

Allowed direction is inward toward frontend semantic/view contracts.

Forbidden dependency inversions include:

- feature/view-model semantics importing renderer scene object types;
- feature semantics importing raw transport DTOs as their public model;
- renderer adapter calling backend APIs directly;
- HTTP adapter deciding presentation states;
- screen components re-owning canonical conflict/domain rules.

## Frontend module responsibilities

The architecture requires responsibility boundaries, not exact directories.

### App composition

Owns:

- startup;
- root work-context/navigation composition;
- dependency wiring;
- global error boundary/fallback placement.

### Learning frontend

Owns UI orchestration for:

- target selection;
- study preview/build/export;
- evidence inspection.

### Knowledge frontend

Owns UI orchestration for:

- scope/search/filter/focus;
- relation traversal;
- textual detail;
- activation of selected 3D projection;
- Curation-only mutation entry when explicit Curation context exists.

### Curation frontend

Owns UI orchestration for:

- Targets;
- Requirements/RequirementSets;
- Questions;
- prepared-data import;
- diagnostics.

Shared canonical Knowledge rendering/search semantics are not duplicated into a second Curation Knowledge implementation; work context changes allowed actions.

### Adapters

Own technical provider integration:

- backend transport;
- 3D renderer;
- browser/platform APIs.

## Data fetching and mutation

Collection search/filter must use accepted backend query semantics where machine operations provide them; arbitrary client-only filtering of partial pages cannot redefine collection results.

Mutations follow:

```text
user intent
 -> frontend command
 -> backend operation
 -> accepted outcome
 -> cache/query reconciliation
 -> visible state
```

Optimistic presentation is allowed only when it cannot be mistaken for canonical acceptance. Validation rejection/conflict must restore or reload authoritative state according to the accepted interaction contract.

## Failure isolation

### Renderer failure

Failure boundary: 3D projection adapter.

Required result:

- textual Knowledge search/list/detail stays usable;
- current semantic scope/focus is preserved when possible;
- renderer-specific failure does not become global application failure.

### Backend request failure

Failure is scoped to the affected screen/task region where possible. Existing confirmed context remains visible if safe.

### External runtime failure

Arrives through backend machine outcomes and affects only export/sync/status interactions that require it.

### Frontend fatal composition failure

A top-level error boundary may protect the shell/application from one view failure, but it must not invent recovery guarantees beyond what can be safely retried/reloaded.

## Deployment topology

Current frontend deployment is one browser application bundle associated with the Prep server deployment.

No accepted driver requires:

- microfrontends;
- independently deployed Learning/Knowledge/Curation bundles;
- renderer as a remote service;
- separate browser workers as architectural units.

Code splitting/lazy loading remains implementation freedom and is especially reasonable for the optional-heavy 3D renderer, but bundle splitting does not create semantic/runtime ownership.

## Reopening conditions

Revisit architecture when accepted evidence requires:

- independent frontend deployment/scaling;
- multi-user live collaboration/server push;
- durable offline-first canonical writes;
- background job UI with persistent job lifecycle;
- main-thread renderer isolation to meet an accepted quality target;
- multiple renderer technologies with independent lifecycle;
- a new trust/authentication boundary.

## Consequences

The rebuilt frontend architecture is simpler than a graph-centered application architecture: 3D is isolated as one presentation adapter inside a task-oriented browser application.

This keeps the nearly complete 3D donor reusable while preventing its renderer/library model from shaping Learning, Curation, routing, canonical state or backend integration.
