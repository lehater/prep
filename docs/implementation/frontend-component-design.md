# Frontend Component Design

## Purpose

Define implementation-facing frontend components, consumer-owned ports, semantic view models, renderer seam and dependency rules for the complete current frontend slice.

The design consumes frontend architecture, engineering policy, Screen/View contracts, Machine Interface and performance constraints. Backend implementation is not required.

## Decision-governance review

### Responsibility boundaries

Options:

1. feature/task-owned components with a reusable KnowledgeExplorer capability and explicit composition root;
2. screen files as the primary ownership boundary, sharing state/adapters ad hoc;
3. technical-layer megamodules (all queries, all forms, all graph behavior) owning cross-feature behavior.

Review:

- option 1 — **VIABLE**;
- option 2 — **REJECTED**, ownership becomes screen/incidental and cross-view semantics drift;
- option 3 — **REJECTED**, low cohesion and ambiguous task ownership.

Disposition: **DETERMINED — feature/task ownership**.

### Provider seams

Options:

1. narrow seams only at actual substitution/external boundaries: frontend ports, graph renderer, shared provider/theme mapping;
2. wrap every framework/provider primitive;
3. allow feature contracts to expose concrete mock/HTTP/renderer/provider APIs.

Review:

- option 1 — **VIABLE**;
- option 2 — **REJECTED**, ceremonial abstraction/YAGNI;
- option 3 — **REJECTED**, violates dependency inversion and substitution requirement.

Disposition: **DETERMINED — narrow meaningful seams**.

### State ownership

Options:

1. lifecycle-local state: shell, owning feature/query boundary, KnowledgeExplorer and renderer;
2. one application-wide mutable store;
3. renderer/provider state promoted as shared application state.

Review:

- option 1 — **VIABLE**;
- option 2 — **REJECTED**, no accepted shared-lifecycle driver;
- option 3 — **REJECTED**, presentation mechanics would leak into application meaning.

Disposition: **DETERMINED — lifecycle-local ownership**.

## Public component responsibilities

### FrontendCompositionRoot

Wires:

- shell;
- Learning/Curation feature entry points;
- mock or future transport adapters;
- graph renderer adapter;
- shared presentation provider/theme.

Construction only; no task state.

### AppShell

Owns mode/navigation composition and runtime-status placement.

### LearningWorkspace

Owns active LearningTarget context and composes:

- TargetSelection;
- TargetOverview;
- TargetKnowledge;
- TargetStudy;
- TargetStatistics.

No target authorship.

### CurationWorkspace

Composes:

- TargetCollection / TargetEditor;
- KnowledgeWorkspace / KnowledgeEditor;
- CapabilityCollection / CapabilityEditor;
- StudyMaterialCollection / StudyMaterialEditor;
- ImportFlow.

No Learning-internal imports.

### KnowledgeExplorer

Reusable by Learning and Curation.

Owns:

- search/filter;
- selected Knowledge identity;
- explicit focus intent;
- coordination of non-spatial result/detail and spatial projection;
- renderer-neutral performance/preferences.

Consumes `KnowledgePort` and `GraphRenderer`.

### Screen components

Each Screen/View subject has one feature-owned composition component or equivalent composition function. Private subcomponents are implementation freedom; public cross-feature contracts are not inferred from file count.

## Consumer-owned frontend ports

One concrete adapter may implement several ports; one wrapper/object per port is not required.

### LearningTargetPort

- list/search prepared targets;
- get target detail with read-only RequirementExpression.

### TargetCurationPort

- list/get/create/update prepared targets;
- submit complete accepted RequirementExpression<CapabilitySpecification>.

### KnowledgePort

- list/search Knowledge for explicit target/global scope;
- get Knowledge detail;
- get renderer-neutral source projection;
- create/update Knowledge in Curation.

### CapabilityPort

- list/get/create/update reusable Capability definitions.

### StudyMaterialPort

- list/get/create/update current Question-compatible material;
- maintain supported Knowledge mappings;
- build Study Set preview;
- export exact materialization.

### EvidencePort

- get target/item evidence;
- explicitly synchronize supported external-runtime evidence.

### ImportPort

- apply prepared input and return aggregate/per-item outcomes.

### RuntimeStatusPort

- get external-runtime reachability/compatibility projection.

Ports use frontend-owned models/outcomes and preserve Machine Interface distinctions.

## Frontend semantic/read models

### LearningTargetModel

Contains stable target identity, readable definition and read-only/curation-appropriate RequirementExpression projection.

### CapabilityModel

Contains reusable performance expectation and only condition/criterion/Knowledge-focus information required by current Curation views.

### KnowledgeModel

Discriminated frontend representation:

```text
KnowledgeObjectModel
  id
  content
  knowledge_form?

KnowledgePropositionModel
  id
  content/conclusion
  predicate?
  participants?
  conditions?
```

The frontend does not define `KnowledgeNodeModel` or `KnowledgeRelationModel` as domain-shaped truth.

### StudyMaterialModel

Current Question-compatible projection with stable compatibility identity, prompt/response content and supported Knowledge references.

### StudySetPreviewModel

Contains:

- target id;
- study profile;
- exact material subset;
- preparation diagnostics;
- opaque materialization token.

### EvidenceFactModel

Contains factual Observation value/assertion plus relevant time/provenance/Performance/task context exposed by the contract.

### RuntimeStatusModel

Reachability, compatibility and non-secret profile summary.

## Representation mapping

```text
Mock fixture OR future transport DTO
        -> adapter mapper
        -> frontend models/outcomes
        -> feature components
```

Rules:

- mock fixtures and transport DTOs never enter feature contracts directly;
- mapping preserves canonical identity and semantic distinctions;
- opaque cursor/materialization tokens stay opaque;
- incompatible input becomes explicit adapter/contract failure, not silent reinterpretation.

## Graph projection

### GraphProjectionBuilder

Transforms Knowledge models plus current semantic scope/filter/focus into `GraphScene`.

A visual node references one canonical Knowledge identity.

A visual edge references the relational `KnowledgeProposition` it represents and carries only predicate/direction/display metadata needed by the renderer.

No visual edge becomes a `KnowledgeRelation` domain entity.

### GraphScene

Renderer-neutral, containing:

- visible nodes;
- visual edges/proposition refs;
- selection/focus/highlight presentation flags;
- labels/classification cues;
- no concrete 3D objects/camera/force data.

### GraphRenderer port

Inputs:

- GraphScene;
- profile/preferences;
- fit/reset/focus commands;
- optional opaque renderer-owned viewport snapshot.

Outputs:

- Knowledge activation;
- opaque viewport update where needed;
- renderer unavailable/failure.

Renderer owns coordinates, camera, force simulation, drag/hover, library objects, batching/instancing, pixel ratio, idle-loop strategy and diagnostics.

## Adapters

### MockFrontendAdapter

Current implementation priority.

- deterministic normal/empty/failure/conflict fixtures;
- current semantic models;
- small plus 60/250/1000 and larger stress Knowledge scenes where useful;
- no backend DTO assumptions.

### Future TransportAdapter

Implements the same ports from the accepted Machine Interface.

Owns wire DTOs, serialization, status mapping and transport mechanics. Its addition must not change feature contracts.

### Graph3DAdapter

Implements `GraphRenderer`.

Eligible donor mechanics from the existing experiment:

- orbit/pan/zoom;
- click-vs-drag;
- node drag;
- fit/reset/focus;
- demand-driven idle rendering;
- instanced nodes/batched links;
- diagnostics and stress-fixture techniques.

PaymentGraph/legacy semantic models, routes and experiment application state are excluded.

## Shared presentation/provider boundary

Shared public presentation responsibilities may cover:

- shell/navigation framing;
- collection/search framing;
- feedback/loading/empty/error;
- editor action framing;
- focus/accessibility roles.

Do not create one wrapper per provider primitive. Provider-specific props/types remain local unless a stable cross-feature project contract requires otherwise.

## State ownership

| State | Owner |
|---|---|
| mode / top-level navigation | AppShell |
| active target | LearningWorkspace |
| feature query/editor state | owning feature |
| Knowledge search/filter/selection/focus | KnowledgeExplorer |
| Study preview/currentness/export state | TargetStudy |
| evidence/sync state | TargetStatistics |
| graph profile/preferences | KnowledgeExplorer |
| camera/layout/physics/drag/hover | Graph3DAdapter |
| mock/transport query cache | adapter/query layer |

No mandatory global store.

## Forbidden dependencies

- feature -> concrete mock/transport adapter;
- feature -> raw DTO/wire types;
- feature -> concrete graph package;
- Learning internals <-> Curation internals;
- Graph3DAdapter -> machine DTOs;
- shared UI primitives -> feature mutable state;
- presentation state -> canonical domain mutation.

## Structural verification

Must be mechanically/testably possible to prove:

- mock adapter satisfies current ports;
- future transport adapter can satisfy the same ports;
- no raw DTO/provider/renderer leakage across forbidden boundaries;
- GraphProjectionBuilder preserves Knowledge identity and proposition predicate/direction;
- selection does not implicitly mutate focus/membership;
- profile/degradation changes preserve GraphScene semantic references;
- renderer unavailable path leaves non-spatial Knowledge access task-complete;
- Learning/Curation boundaries remain independent.

## Implementation freedoms

Private component split, functions/hooks/classes, exact TypeScript syntax, route/query library, local helper names, file names and internal provider composition remain implementation choices until Implementation Design fixes repository realization.
