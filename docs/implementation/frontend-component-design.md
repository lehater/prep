# Frontend Component Design

## Purpose

Define implementation-facing frontend component, port, mapping and dependency boundaries for the current Prep frontend scope so coding can begin without inventing major structure.

This artifact consumes the accepted frontend System Architecture, Frontend Engineering Policy, Screen/View Design and Machine Interface. It does not redefine product, domain, application or interface semantics.

The immediate detailed scope is the Knowledge visualization prototype plus the stable seams it shares with later production frontend realization. Other feature internals may remain private until their implementation slice is selected, but they must obey the same public dependency rules.

## Public component inventory

### FrontendCompositionRoot

Responsibility:

- choose concrete adapters/providers at application startup;
- compose the Application Shell and feature entry points;
- wire mock or HTTP data adapters;
- wire the selected graph renderer adapter.

It contains construction/wiring only. It owns no user task state or product semantics.

### AppShell

Responsibility:

- realize explicit Learning/Curation mode context;
- host top-level navigation composition;
- expose the global runtime-status entry point.

Public inputs are feature entry points and shell navigation state. It does not reach into feature-internal stores/components.

### LearningWorkspace

Responsibility:

- own the active LearningTarget context;
- compose learner sections for the selected target;
- supply target scope to target-aware feature entry points such as Knowledge exploration.

It receives canonical target identity through frontend models and does not own target composition semantics.

### CurationWorkspace

Responsibility:

- compose Curation collection/editor feature entry points;
- provide global Knowledge exploration scope;
- keep authoring state inside the owning Curation feature.

It does not share editor internals with Learning.

### KnowledgeExplorer

Responsibility:

- coordinate Knowledge list/search/detail and graph representations over one explicit scope;
- own semantic filters, selected Knowledge identity and focus/neighborhood intent;
- preserve exploration context while readable detail opens/closes;
- translate renderer events into frontend interaction intent.

KnowledgeExplorer consumes frontend Knowledge models and a renderer-neutral graph contract. It never consumes raw API DTOs or concrete renderer objects.

### KnowledgeQueryPort

Consumer-owned data-access contract for KnowledgeExplorer and related Knowledge surfaces.

Required semantic operations for the current scope:

- list/search Knowledge for an explicit global or target scope;
- load one canonical Knowledge item/detail;
- load the accepted Knowledge graph projection for an explicit global or target scope.

Inputs/outputs use frontend-owned models defined below. Concrete transport method/path/pagination representation is adapter-private.

### TargetQueryPort

Consumer-owned data-access contract needed by the prototype shell/learner context.

Required operations:

- list/search prepared LearningTargets;
- load one target summary/detail sufficient to establish learner workspace context.

The port does not expose target mutation in Learning.

### QuestionQueryPort

Consumer-owned read contract used by the Question -> Knowledge Map prototype bridge.

Required operation:

- load representative/current Questions with canonical Knowledge references needed for navigation into KnowledgeExplorer.

Full Study Set behavior remains outside the immediate prototype slice, but later production realization may extend this port or introduce narrower Study ports when the corresponding slice is selected.

### RuntimeStatusPort

Read-only consumer contract for current external-runtime status projection.

The prototype may provide a mock implementation. Production uses the accepted machine operation.

## Frontend semantic/read models

Frontend models are task-facing representations, not copies of transport DTOs and not a second domain model.

### KnowledgeNodeModel

Minimum stable fields:

- canonical Prep Knowledge id;
- accepted semantic kind;
- readable content/summary needed by current views.

Feature-local derived labels may be added when they are deterministic presentation derivations.

### KnowledgeRelationModel

Minimum stable fields:

- canonical/stable relation identity when supplied;
- source Knowledge id;
- target Knowledge id;
- accepted relation type.

Direction is represented by source/target identity, not geometric orientation.

### KnowledgeScope

Represents one explicit exploration scope:

- global Curation scope; or
- target scope identified by canonical LearningTarget id.

The same KnowledgeNode identity remains stable across scopes.

### KnowledgeGraphModel

Contains:

- KnowledgeScope;
- KnowledgeNodeModel collection;
- KnowledgeRelationModel collection.

It contains no renderer coordinates, force-engine objects or camera state.

### LearningTargetModel

Contains only task-relevant target identity/definition/scope summary required by selected Learning screens.

### QuestionModel

Contains canonical Question identity, readable question/answer content needed by the current surface and canonical aligned Knowledge ids.

## Transport adaptation

Concrete browser/backend DTOs are adapter-private.

The mapping direction is:

```text
Machine Interface response
        ↓
transport DTO
        ↓
HTTP adapter mapper
        ↓
frontend semantic/read model
        ↓
feature components
```

Rules:

- DTO types are declared inside the HTTP adapter boundary and are not imported by feature modules.
- Cursor/status-code/wire-format details terminate in the adapter.
- Mapping preserves canonical Prep identity and accepted enum/relationship semantics.
- Unknown or incompatible transport representation becomes an adapter failure/outcome; features do not reinterpret it silently.
- Mock fixtures are mapped into the same frontend models rather than becoming a second model shape.

Exact TypeScript type syntax is an implementation freedom.

## Graph projection boundary

### GraphProjectionBuilder

Responsibility:

- transform KnowledgeGraphModel plus current KnowledgeExplorer intent into a renderer-neutral GraphScene;
- preserve canonical Knowledge ids and accepted relation source/target/type;
- derive visibility/highlight/focus metadata from current semantic filters and focus intent;
- keep all geometric/layout state out of the semantic model.

It does not call a renderer library.

### GraphScene

Renderer-neutral input containing the visible node/edge projection and presentation metadata required by accepted interactions.

A node projection contains at least:

- canonical Knowledge id;
- readable label/content fragment as required by the view;
- semantic kind;
- selected/focused/highlighted flags when applicable.

An edge projection contains at least:

- source Knowledge id;
- target Knowledge id;
- accepted relation type;
- presentation metadata needed to make type/direction inspectable.

It does not contain concrete Three.js/renderer object references.

## GraphRenderer contract

### Responsibility

Render and manipulate a GraphScene while owning renderer-specific visual/physics state.

### Inputs

The logical contract accepts:

- current GraphScene;
- optional opaque viewport snapshot previously emitted by the same renderer family;
- presentation commands such as fit/reset/focus when requested by KnowledgeExplorer.

Exact synchronous/reactive method shape is an implementation choice.

### Outputs/events

The renderer exposes interaction events sufficient for KnowledgeExplorer to receive:

- node activation after click-without-drag;
- viewport/camera state change as an opaque presentation snapshot when preservation is required;
- explicit failure/unavailable outcome when the renderer cannot realize the supplied scene.

Drag/rotate/zoom/physics activity does not emit semantic Knowledge mutation.

### Ownership

The renderer owns:

- coordinates;
- force simulation state;
- camera/orbit state;
- drag gesture tracking;
- hover/transient visual state;
- concrete library node/link objects.

KnowledgeExplorer owns:

- selected canonical Knowledge id;
- semantic kind/relation filters;
- focus/neighborhood intent;
- current KnowledgeScope;
- decision to open/close readable detail.

Click-versus-drag discrimination belongs inside the renderer adapter because it depends on concrete pointer/renderer mechanics. Only a completed activation event crosses the port.

### Forbidden leakage

The renderer contract must not expose:

- Three.js objects;
- `react-force-graph-3d` node/link instances;
- coordinates as canonical Knowledge fields;
- raw renderer callbacks to feature code.

## Renderer adapter

A concrete renderer adapter implements GraphRenderer.

The current experiment may adapt mechanics from the historical 3D prototype, but only renderer-local behavior is eligible for reuse:

- click-without-drag discrimination;
- node dragging;
- orbit/pan/zoom;
- inertial camera behavior;
- focus/fit/reset mechanics;
- idle/pause optimization;
- renderer performance instrumentation.

The adapter must translate those mechanics into the current GraphRenderer contract.

Do not reuse experimental:

- route structure;
- global stores/state ownership;
- graph-first whole-product composition;
- relation/domain models;
- authentication/settings/progress assumptions;
- Storybook control state as product state.

A legacy source file that mixes reusable renderer mechanics with stale semantic/routing assumptions must be adapted or split rather than copied wholesale.

## Mock and HTTP adapters

### MockKnowledgeAdapter

Implements the same frontend-owned query ports using representative static/repository-derived data.

It may additionally expose deterministic fixtures useful for graph/data inspection, but fixture-only metadata must not enter frontend semantic models unless production machine contracts can represent equivalent accepted semantics.

### HttpKnowledgeAdapter

Implements the same query ports through accepted Machine Interface operations.

It owns:

- request construction;
- transport DTO definitions;
- response validation/mapping;
- transport/outcome translation.

KnowledgeExplorer cannot tell which adapter is active.

Equivalent contract expectations apply to Target, Question and RuntimeStatus adapters.

## State ownership

### AppShell state

- current mode;
- top-level navigation context.

### LearningWorkspace state

- active LearningTarget identity;
- learner workspace navigation context.

### KnowledgeExplorer state

- KnowledgeScope;
- search query;
- semantic-kind filter;
- relation-type filter;
- selected Knowledge id;
- focused Knowledge ids/neighborhood intent;
- readable-detail open/closed state;
- opaque renderer viewport snapshot only when preservation across remounts requires it.

### Renderer adapter state

- camera;
- coordinates;
- physics;
- drag/hover/transient renderer interaction.

### Feature data state

Query/cache/loading/error state belongs to the consuming feature/data-access boundary. There is no mandatory global store.

Unsaved editor form state remains local to the owning Curation feature.

## Dependency graph

```text
FrontendCompositionRoot
        |
        +--> AppShell
        |      +--> LearningWorkspace
        |      |      +--> KnowledgeExplorer
        |      +--> CurationWorkspace
        |             +--> KnowledgeExplorer
        |
        +--> Mock/HTTP adapters
        +--> concrete GraphRenderer adapter

KnowledgeExplorer
        +--> KnowledgeQueryPort
        +--> GraphProjectionBuilder
        +--> GraphRenderer
        +--> frontend Knowledge models

Mock/HTTP adapters
        --> implement feature-owned query ports

Concrete renderer adapter
        --> implements GraphRenderer
```

Forbidden dependencies:

- feature modules -> concrete HTTP client/DTO package;
- feature modules -> concrete graph-renderer library;
- renderer adapter -> Machine Interface DTOs;
- Learning internals <-> Curation internals;
- presentation components -> backend/domain persistence structures;
- shared UI primitives -> feature stores or canonical business state.

## Reusable UI and provider boundary

Reusable UI code is organized around stable project presentation patterns rather than one-to-one wrappers around a concrete UI library.

Current reusable pattern responsibilities include:

- shell/mode framing;
- collection search/filter controls;
- detail framing;
- loading/empty/failure feedback;
- form action framing;
- confirmation treatment when accepted actions require it;
- shared focus/accessibility presentation behavior.

These contracts must remain provider-neutral at their public boundary when provider types would otherwise leak across features.

A concrete UI provider may implement those patterns using its own primitives, theme and composition internally. Local feature code may also use provider primitives directly when the use is private/local and does not create a cross-feature public contract.

Do not create wrappers such as one project component per provider `Box`, `Stack`, `Typography` or equivalent primitive solely for theoretical replaceability.

If MUI is selected downstream, it is treated as one concrete provider implementation under these rules rather than as the owner of Prep UI semantics.

Shared style roles that recur across features map through one provider/theme/token boundary. Exact palette, fonts, spacing values and provider token syntax remain downstream until explicitly selected.

## Engineering Policy compliance

This design applies the accepted Frontend Engineering Policy:

- abstractions exist only for current public responsibilities, multiple consumers or meaningful replacement seams;
- composition is preferred for assembling independent responsibilities;
- provider and transport APIs terminate at their adapters;
- shared presentation code does not own feature state or canonical business truth;
- no global mutable store is introduced by default;
- public contracts are consumer-shaped rather than vendor-shaped;
- reusable UI contracts represent stable product presentation patterns, not vendor primitive aliases.

## View/component boundaries

Screen/View contracts map to feature-owned view compositions.

For the current prototype the material component boundaries are:

- shell/mode composition;
- Learning target selection/workspace composition;
- Curation Knowledge workspace entry;
- KnowledgeExplorer composition;
- Knowledge list/search surface;
- Knowledge graph surface;
- Knowledge readable detail surface;
- minimal Question surface for Question -> Knowledge Map navigation.

These are responsibilities, not mandatory one-file React components. A framework component may realize more than one private subcomponent when responsibilities remain coherent.

## Structural verification boundaries

Later test/verification work should be able to prove:

- transport DTO imports are confined to HTTP adapters;
- concrete renderer imports are confined to renderer adapter modules;
- KnowledgeExplorer can run against both mock and HTTP port implementations;
- GraphProjectionBuilder preserves canonical ids and relation direction/type;
- GraphRenderer emits activation only for click-without-drag;
- renderer viewport state can be preserved without entering canonical frontend models;
- Learning and Curation do not import each other's internal modules.

Contract tests should target public ports/models rather than concrete provider internals.

## Implementation freedoms

Left intentionally open to coding/Implementation Design:

- exact directory/file names;
- React component/function/class representation;
- state-management library or plain React state/query cache;
- routing library and route strings;
- HTTP client library;
- exact GraphRenderer method signatures/reactive shape;
- exact 3D renderer library/version;
- styling/component provider;
- private helpers and local component decomposition.

## Harness semantic acceptance

The artifact satisfies the required `component-design` review intent:

- **component-not-upstream-owner** — all public components/ports consume accepted upstream semantics and do not redefine them;
- **implementation-facing-boundaries-complete-for-scope** — the selected prototype can be implemented without inventing module ownership, DTO/model mapping, renderer abstraction, state ownership, mock/API dependency direction or the reusable UI/provider boundary.
