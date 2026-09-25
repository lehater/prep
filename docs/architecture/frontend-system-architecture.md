# Frontend System Architecture

## Purpose

Define the frontend-scoped structural architecture needed to realize the accepted Prep interface without allowing prototype code, transport DTOs or a concrete 3D renderer to become accidental architectural authority.

This refines the accepted whole-system architecture. It does not redefine product, domain, application, machine-interface or Screen/View semantics.

## Architectural drivers

The selected frontend scope must satisfy these accepted constraints:

- one browser frontend realizes both Learning and Curation task contexts;
- the same canonical Knowledge identity is reused across global Curation and target-scoped Learning projections;
- list/search/detail and graph are coordinated representations, not separate semantic models;
- the current Knowledge graph is an experimental projection whose 3D renderer may be replaced or demoted;
- canonical mutations remain behind backend machine contracts;
- the immediate prototype may use mock/static data, while production uses the same frontend-facing boundaries with an HTTP/API adapter;
- graph camera, layout, focus, filters and selection are presentation state and must not leak into canonical Knowledge semantics.

No accepted driver requires a frontend microfrontend topology, plugin system, event bus or global application store.

## Module topology

The frontend is decomposed into architectural modules by responsibility, not by screen file.

### Application Shell

Owns:

- bootstrapping/composition;
- Learning/Curation mode context;
- top-level navigation context;
- access to global runtime-status presentation.

The shell composes feature modules but does not own their task state or canonical data.

### Learning

Owns learner-facing realization for:

- target selection;
- target workspace context;
- Overview;
- target-scoped Knowledge exploration;
- Study;
- Statistics.

It owns the currently selected LearningTarget context for learner navigation. It does not own canonical target composition.

### Curation

Owns authoring/maintenance realization for:

- LearningTargets;
- Knowledge;
- Requirements/RequirementSets;
- Questions;
- contextual Import.

It does not expose its internal editor or collection state to Learning.

### Knowledge Exploration

Owns the reusable frontend capability for coordinated Knowledge list/search/detail and graph exploration over a supplied Knowledge scope.

The supplied scope may be:

- global/reusable Knowledge for Curation;
- target-derived Knowledge for Learning.

This module owns interaction/presentation state needed for exploration, but not canonical Knowledge truth.

It contains a renderer-neutral graph projection boundary. Concrete 3D/2D renderer libraries remain downstream adapters.

### Frontend Data Access

Owns the browser-side boundary through which feature modules obtain accepted application projections and submit commands.

It provides feature-facing query/command contracts and isolates transport representation from frontend semantic/read models.

Two realization modes are allowed behind the same boundary:

- mock/repository-derived adapters for the current prototype;
- HTTP/API adapters for production integration.

Feature modules must not branch on whether data comes from mock or HTTP.

## Dependency direction

Allowed dependency direction:

```text
composition/bootstrap
        |
        v
application shell
        |
        +-------------------+
        v                   v
     Learning            Curation
        \                   /
         \                 /
          v               v
        Knowledge Exploration
                |
                v
      frontend semantic/read models
                ^
                |
       feature-facing data contracts
                ^
        +-------+--------+
        |                |
   mock adapter      HTTP/API adapter

graph projection contract
        ^
        |
concrete renderer adapter
```

Rules:

- Learning and Curation do not import each other's internal implementation.
- Feature modules depend on frontend-owned semantic/read models and feature-facing data contracts, not raw transport DTOs.
- Mock and HTTP adapters depend on the consuming frontend contracts; feature modules do not depend on adapter implementation.
- A concrete graph renderer depends on the renderer-neutral graph projection boundary; Knowledge Exploration does not depend directly on a renderer package API.
- Shared presentation primitives may be consumed by features, but they must not become a cross-feature owner of task state or domain semantics.
- Cross-feature behavior is coordinated through shell/navigation context or accepted shared frontend models, not arbitrary component imports.

## Representation boundaries

### Transport DTO -> frontend semantic/read model

Machine-interface DTOs terminate at the Frontend Data Access boundary.

Adapters translate transport representation into frontend-owned models shaped for accepted UI tasks. Accepted collection metadata required by views, such as an exact `total_count` for the current query/scope, may cross the adapter as part of a frontend-owned collection result. Transport-specific pagination tokens, status-code mappings and serialization details do not leak into feature state.

Frontend models preserve canonical Prep identities and accepted semantic distinctions. They may omit data irrelevant to the selected UI task but must not invent new domain meaning.

Exact TypeScript types and mapper functions belong to Component Design.

### Frontend Knowledge model -> graph projection

Knowledge Exploration transforms frontend Knowledge models into a renderer-neutral graph projection containing only data needed to render and interact with accepted nodes/relations.

The projection preserves:

- canonical Knowledge identity;
- accepted semantic kind;
- accepted relation identity/type/direction;
- current global or target scope.

It may additionally carry presentation-only projection metadata.

Renderer coordinates, forces, camera position, hover state and transient layout state remain outside canonical Knowledge and outside transport DTOs.

Exact `GraphRenderer` and projection mapper contracts belong to Component Design.

## State ownership

Architectural state ownership is:

| State | Owner |
|---|---|
| current Learning/Curation mode and top-level route context | Application Shell |
| selected LearningTarget and learner workspace context | Learning |
| collection/editor draft state | owning Curation feature |
| server/query state and cache | owning feature data-access boundary |
| Knowledge search/filter/selected-node/focus scope | Knowledge Exploration |
| graph camera/layout/drag/hover state | renderer adapter / Knowledge Exploration presentation state |
| canonical Knowledge/Requirement/Question/Target truth | backend/domain, never frontend presentation state |
| external-runtime reachability projection | data-access query result, displayed by the relevant feature/shell surface |

There is no default global mutable store. State is promoted upward only when multiple architectural modules require the same lifecycle and ownership.

## Mock/API adapter boundary

The prototype must exercise the same feature-facing contracts that production HTTP integration will consume.

Mock data may be static or repository-derived, but it must be adapted into the same frontend semantic/read models as API data.

This prevents prototype-only fixture shapes from becoming implicit product contracts and allows the backend adapter to replace the mock adapter without rewriting feature semantics.

## Renderer boundary

The current 3D implementation is a replaceable presentation adapter.

Architectural invariant:

```text
accepted Knowledge semantics
        -> frontend Knowledge model
        -> renderer-neutral graph projection
        -> renderer adapter
        -> concrete library objects / coordinates
```

Renderer library objects, callbacks, physics state and coordinates must not cross back into canonical frontend models.

Old experimental renderer code may be reused only below this boundary after Component/Implementation Design verifies that it does not import stale routing, state ownership or graph-first product semantics.

## Composition and navigation

The shell composes Learning and Curation.

Learning composes its target workspace and learner sections while preserving selected-target context.

Curation composes its collection/editor contexts while preserving explicit Curation mode.

Knowledge Exploration is reused by both contexts with explicit scope input. Reuse is by stable public contract, not by sharing feature-internal state.

Exact router library, route strings, React component tree and provider nesting remain downstream.

## Structural verification obligations

Later Verification/Component Design must make it possible to check at least:

- feature code does not import concrete transport DTOs outside adapters;
- feature code does not import the concrete 3D renderer package directly;
- Learning and Curation internals do not depend on each other;
- renderer objects/coordinates do not enter canonical frontend models;
- mock and HTTP adapters satisfy the same frontend-facing data contracts;
- graph/list/detail resolve the same canonical Knowledge identities.

The concrete lint/test mechanisms are downstream.

## Explicit non-goals

This architecture does not choose:

- React component boundaries;
- exact `GraphRenderer` method signatures;
- exact DTO/view-model TypeScript types;
- concrete state-management library;
- router library or route strings;
- directory/file layout;
- concrete test framework;
- exact 3D graph library;
- reuse/adapt/discard decisions for individual legacy source files.

Those decisions belong to Component Design or Implementation Design.

## Reopening conditions

Revisit this architecture if accepted requirements introduce:

- independently deployable frontend applications;
- offline-first/local-first synchronization;
- multiple simultaneous users/sessions with browser-side authorization consequences;
- server-driven UI composition;
- a renderer that must own canonical editing semantics rather than consume a projection;
- materially different frontend/backend transport boundaries.

## Harness semantic acceptance

The artifact satisfies the required `system-architecture` review intent:

- **architecture-not-product-requirement** — it only constrains technical/frontend structure derived from accepted interface/application contracts;
- **dependency-topology-explicit-where-material** — module boundaries, state ownership, adapter boundaries and dependency direction are explicit wherever implementation would otherwise need to invent them.
