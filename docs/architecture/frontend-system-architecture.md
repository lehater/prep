# Frontend System Architecture

## Purpose

Define the browser-side structural architecture needed to realize the accepted frontend independently of backend runtime topology.

The frontend depends on accepted Application semantics and transport-neutral Machine Interface ports. Mock adapters are the first realization; a future HTTP/backend adapter may replace them without changing feature semantics.

## Architecture drivers

Accepted drivers:

- one browser application realizes Learning and Curation;
- target/capability/Knowledge/study/evidence semantics are already owned upstream;
- the frontend must work against mock data before backend realization;
- the same frontend ports must support a later transport adapter;
- 3D Knowledge is the production-default spatial presentation but list/search/detail remains task-complete;
- Knowledge renderer state is noncanonical;
- ordinary/stress graph workload and idle/degradation constraints come from Frontend Performance/Capacity;
- Learning and Curation have distinct task state while sharing stable semantic identities.

No accepted driver requires microfrontends, a plugin runtime, event bus, frontend-owned canonical persistence or a general global mutable store.

## Decision-governance review

Alternatives were formed per architecture axis before selection.

### Runtime boundaries

- single browser application with internal feature/adapter boundaries — **VIABLE**;
- independently running/microfrontend feature runtimes — **REJECTED**, no independent deployment/runtime driver;
- renderer as the semantic application runtime — **REJECTED**, violates presentation/domain boundary.

Disposition: **DETERMINED — single browser runtime**.

### Deployment topology

- one frontend deployable — **VIABLE**;
- separate Learning/Curation deployables — **REJECTED**, adds deployment boundary without accepted need.

Disposition: **DETERMINED — one frontend deployable**.

### Interaction model

- direct in-process feature composition plus asynchronous consumer ports for external data/actions — **VIABLE**;
- application-wide event bus as primary coordination — **REJECTED**, unnecessary indirection and ownership ambiguity;
- direct feature access to backend/provider APIs — **REJECTED**, violates adapter boundary.

Disposition: **DETERMINED — feature composition + ports**.

### State placement

- shell context + feature-local state + query/adapter state + renderer-local presentation state — **VIABLE**;
- one general global client store — **REJECTED**, unnecessary shared ownership/coupling;
- renderer/provider state as canonical frontend state — **REJECTED**, leaks presentation mechanics.

Disposition: **DETERMINED — lifecycle-local ownership**.

### Dependency direction

- features depend on consumer-owned ports/models; adapters depend inward on those contracts — **VIABLE**;
- features import concrete HTTP/mock/renderer providers — **REJECTED**;
- shared UI layer owns product/task state — **REJECTED**.

Disposition: **DETERMINED — inward adapter dependency**.

### Failure isolation

- data/runtime/renderer failure is isolated to affected feature capability with accepted degraded/non-spatial paths — **VIABLE**;
- any provider/renderer failure collapses the whole application — **REJECTED**, conflicts with accepted recovery/degradation semantics.

Disposition: **DETERMINED — feature/provider isolation**.

No unknown alternatives remain for the current frontend scope.

## Module topology

### Composition Root / Application Shell

Owns:

- application bootstrap;
- adapter/provider selection;
- Learning/Curation mode and top-level navigation context;
- global runtime-status placement.

It composes features but does not own their canonical/task data.

### Learning

Owns frontend task realization for:

- target selection;
- active target context;
- Overview;
- target Knowledge;
- Study;
- Statistics/evidence.

It consumes prepared target scope and never authors `RequirementExpression`.

### Curation

Owns frontend task realization for:

- Targets;
- Knowledge;
- Capabilities;
- Question-compatible Study Material;
- contextual Import.

Learning and Curation do not import each other's internal feature state.

### Knowledge Exploration

Reusable frontend capability consumed by Learning and Curation.

Owns:

- search/filter/selection/focus interaction state;
- renderer-neutral spatial projection;
- non-spatial result/detail coordination;
- user-visible performance profile/preferences.

It does not own `KnowledgeObject`/`KnowledgeProposition` truth.

### Frontend Ports / Data Access

Consumer-owned contracts for accepted read/command operations and read models.

Realizations:

- **Mock adapters** — current frontend-first implementation;
- **Transport adapter** — later backend integration.

Feature code does not branch by adapter type.

### Graph Renderer Adapter

Consumes a renderer-neutral `GraphScene`/projection and owns:

- concrete 3D library objects;
- coordinates/camera/force/drag/hover state;
- batching/instancing/pixel-ratio/idle-loop strategies;
- renderer diagnostics.

It emits semantic interaction events using canonical Knowledge identities only.

## Dependency direction

```text
Composition Root
      |
      +--> Shell
      +--> Learning --------+
      +--> Curation --------+--> frontend semantic/read models
      |                     +--> consumer-owned ports
      |                               ^
      |                         +-----+------+
      |                         |            |
      |                      Mock         Transport
      |
      +--> Knowledge Exploration --> renderer-neutral GraphScene
                                      ^
                                      |
                                  3D Renderer
```

Rules:

- features do not import concrete adapters;
- adapters implement feature/consumer-owned ports;
- raw transport DTOs stay inside a future transport adapter;
- graph-library types stay inside renderer adapter;
- shared presentation primitives do not own feature/task state;
- cross-feature coordination uses shell/navigation context or explicit shared contracts.

## Frontend semantic/read-model boundary

Frontend read models preserve only distinctions required by accepted UI tasks:

- LearningTarget + read-only RequirementExpression projection;
- Capability/CapabilitySpecification summaries needed for target curation;
- KnowledgeObject / KnowledgeProposition;
- Question-compatible Study Material projection;
- Study Set subset + diagnostics/currentness identity;
- factual Observation/Performance context;
- RuntimeStatus.

They preserve canonical IDs where identity matters but are not persistence models.

## Graph projection boundary

```text
KnowledgeObject / KnowledgeProposition read models
        -> GraphProjectionBuilder
        -> GraphScene
        -> GraphRenderer port
        -> 3D adapter
```

`GraphScene` may contain visual nodes/edges for rendering, but an edge is only a projection of relational KnowledgeProposition semantics.

Coordinates, camera/depth, force state and visual quality settings are never canonical meaning.

## State ownership

| State | Owner |
|---|---|
| current mode / top-level navigation | Shell |
| active LearningTarget | Learning |
| target Overview/Study/Evidence query state | owning Learning feature |
| Curation collection/editor drafts | owning Curation feature |
| Knowledge query/filter/selection/focus | Knowledge Exploration |
| graph quality/preferences | Knowledge Exploration |
| camera/layout/force/drag/hover | renderer adapter |
| adapter/query cache | data-access realization |
| canonical domain/application truth | external to frontend; consumed through ports |

A general global store is not part of the initial architecture.

## Mock-first composition

The first executable frontend uses deterministic mock adapters implementing the same ports that later transport adapters must implement.

Mock fixtures:

- model current semantic read models, not legacy backend DTOs;
- include loading/empty/failure/conflict/degraded cases where meaningful;
- include deterministic small and stress Knowledge projections;
- remain test/prototype data, never canonical product truth.

## Failure isolation

- query failure preserves shell/target context and exposes retry;
- external runtime failure affects runtime-dependent Study/Evidence actions without erasing local accepted facts;
- 3D renderer failure activates non-spatial Knowledge access;
- validation/conflict preserves relevant editor/preview context.

## Structural verification obligations

Verify:

- Learning/Curation internals do not import each other;
- features do not import concrete adapters;
- renderer package/types do not escape renderer adapter;
- mock and future transport adapters satisfy the same ports;
- semantic projection preserves Knowledge identity and KnowledgeProposition meaning;
- renderer degradation cannot change semantic result set;
- non-spatial Knowledge path remains usable without renderer;
- 1k/2k/5k fixtures can exercise renderer boundaries without changing feature models.

## Non-goals

This architecture does not decide:

- backend runtime/service topology;
- HTTP routes/controllers/status codes;
- database/persistence;
- concrete React component split;
- exact TypeScript port signatures;
- router/query/component libraries;
- concrete file paths;
- exact 3D library;
- private renderer tuning.

## Reopening conditions

Reopen if accepted requirements require independent frontend deployables, offline/local-first canonical state, browser-side authorization boundaries, server-driven UI, canonical renderer-owned editing semantics, or a materially different frontend/application boundary.
