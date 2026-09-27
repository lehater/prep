# Frontend Component Design

## Purpose

Define implementation-facing frontend component and provider boundaries for the rebuilt Prep interface without selecting framework, file layout or private helper structure.

The design groups ownership by accepted user work and semantic responsibility, keeps transport and 3D provider APIs behind narrow seams, and makes frontend state ownership explicit.

## Component boundary principles

1. Public boundaries follow stable task/semantic responsibilities, not visual fragments or backend resource tables.
2. A Screen/View subject is a composition contract, not automatically a standalone module boundary.
3. Reuse is extracted only for stable repeated product/presentation responsibilities.
4. Provider seams exist where transport/renderer/platform types would otherwise leak across feature boundaries.
5. Canonical server data is never re-owned by frontend component state.
6. Private decomposition remains implementation freedom.

## Public component inventory

### App composition

#### AppCompositionRoot

**Responsibility:** construct the browser application dependency graph and mount the root work-context shell.

Consumes:

- feature roots for Learning, Knowledge and Curation;
- backend operation provider;
- Knowledge 3D renderer provider;
- browser/platform services required by accepted implementation.

Owns no product state beyond construction/lifecycle.

#### WorkContextShell

**Responsibility:** realize the shared shell for root Learning / Knowledge / Curation navigation and continuity of accepted cross-view context.

Owns:

- selected root work context;
- the active LearningTarget reference needed to preserve Learning ↔ target-scoped Knowledge continuity;
- composition of current topology view.

Does not own:

- canonical target content;
- feature-specific drafts;
- Knowledge renderer scene state.

### Learning feature

The Learning feature owns the three accepted Learning task views.

#### LearningTargetSurface

Realizes `V-LEARN-TARGET`.

Responsibilities:

- target search/list interaction;
- target selection;
- read-only selected target summary/scope;
- transitions to Study, Evidence and target-scoped Knowledge.

Consumes a Learning target query contract shaped from:

- `learning.targets.list`;
- `learning.targets.get`.

#### StudyPreparationSurface

Realizes `V-LEARN-STUDY`.

Responsibilities:

- build/rebuild Study Set preview;
- display preview/currentness/empty state;
- export the reviewed materialization;
- expose accepted preparation diagnostics and recovery.

Consumes a Study Preparation contract shaped from:

- `learning.target.study_set.build`;
- `learning.target.study_set.export`.

Owns transient reviewed-preview interaction state only. Canonical material resolution remains backend-owned.

#### ReviewEvidenceSurface

Realizes `V-LEARN-EVIDENCE`.

Responsibilities:

- target evidence summary;
- Question review history;
- explicit review sync;
- factual evidence/no-observation/external-failure states.

Consumes an Evidence contract shaped from:

- `learning.target.statistics.get`;
- `learning.question.reviews.get`;
- `learning.reviews.sync`.

### Knowledge feature

#### KnowledgeExplorerSurface

Realizes `V-KNOWLEDGE` and is the public composition owner for Knowledge exploration.

Responsibilities:

- global vs target-relevant scope;
- search/filter;
- canonical focus;
- relationship traversal;
- textual access/detail;
- composition of the optional local 3D projection;
- enabling accepted mutation actions only under explicit Curation context.

It owns Knowledge interaction state but not renderer internals or canonical Knowledge state.

#### KnowledgeTextProjection

**Responsibility:** renderer-independent searchable/result/detail presentation of canonical Knowledge.

Input is a Knowledge view model containing canonical references, readable content, semantic kind and explicit relationship semantics.

Required behavior remains usable without any 3D provider.

#### KnowledgeProjectionPort

**Owner:** Knowledge feature.

**Responsibility:** smallest provider-neutral seam needed to realize the accepted spatial projection.

Input contract conceptually contains:

- visible/focused Knowledge identities;
- presentation-safe labels/content needed by the projection;
- semantic kind;
- accepted relation identity/type/direction;
- current focus;
- bounded projection membership.

Output intents conceptually contain:

- focus Knowledge identity;
- follow accepted relation / connected identity;
- projection-local reframe/reset intent where relevant.

The port does not expose scene objects, meshes, cameras, shaders or force-engine types.

#### ThreeDKnowledgeProjectionAdapter

**Responsibility:** implement `KnowledgeProjectionPort` with the selected 3D renderer/provider.

Owns:

- provider scene realization;
- camera and renderer lifecycle;
- provider event translation;
- renderer-local hover/visual state;
- resource cleanup.

The existing 3D experiment should be adapted here when compatible. Donor renderer mechanics remain inside this adapter.

A 3D failure must be expressible to `KnowledgeExplorerSurface` as a projection failure without invalidating textual Knowledge state.

#### KnowledgeCurationActions

**Responsibility:** expose accepted Knowledge/relationship mutation intents only when the surrounding work context is explicit Curation.

It does not create a second Knowledge feature. It composes Curation command capabilities around the shared Knowledge surface.

### Curation feature

The Curation feature owns intentional canonical-data maintenance.

#### CurationTargetsSurface

Realizes `V-CURATE-TARGETS`.

Responsibilities:

- target finder/collection;
- focused target draft/edit;
- prepared-scope maintenance;
- validation/conflict recovery.

Consumes coherent target query/command contracts rather than one wrapper per backend operation.

#### CurationRequirementsSurface

Realizes `V-CURATE-REQUIREMENTS`.

Responsibilities:

- Requirement/RequirementSet finder;
- focused definition editing;
- set membership;
- Requirement ↔ Knowledge alignment;
- validation/conflict recovery.

#### CurationQuestionsSurface

Realizes `V-CURATE-QUESTIONS`.

Responsibilities:

- Question finder;
- question/direct-answer editing;
- Question ↔ Knowledge alignment;
- contextual evidence link;
- validation/conflict recovery.

#### CurationImportSurface

Realizes `V-CURATE-IMPORT`.

Responsibilities:

- prepared-data source input;
- apply command;
- aggregate result;
- item-level result/rejection display;
- navigation to affected canonical identities.

#### CurationDiagnosticsSurface

Realizes `V-CURATE-DIAGNOSTICS`.

Responsibilities:

- supported structural diagnostics;
- focused diagnostic context;
- explicit navigation into owning repair surface.

It does not calculate semantic coverage quality.

## Shared presentation patterns

Shared components are permitted only where the repeated responsibility is stable across real consumers.

### EntityTaskSurfaceFrame

A presentation/composition primitive for collection/search + focused task work.

Current consumers:

- Targets;
- Requirements;
- Questions.

It may provide slots/regions for:

- finder/results;
- focused detail/editor;
- validation/conflict feedback;
- secondary contextual actions.

It does **not** own entity fetching, mutation semantics, field definitions or canonical state.

### OperationFeedback

A small presentation contract for accepted loading/success/rejection/conflict/operational outcomes where multiple features need consistent feedback.

It receives semantic outcome/view state from its consumer. It does not interpret raw transport statuses.

### ContextualDisclosure

A presentation primitive for secondary context that becomes disclosed/sequential under constrained space.

It does not own responsive product rules; consumers pass accepted priority/content semantics.

No generic “CRUD framework”, universal entity editor or generic repository-backed screen abstraction is introduced.

## Backend provider seams

### Backend operation provider

A single technical backend provider may implement several consumer-shaped frontend contracts.

Consumers may define narrow contracts such as:

- Learning target queries;
- Study preparation commands;
- Review evidence queries/sync;
- Knowledge queries;
- Knowledge Curation commands;
- Target Curation;
- Requirements Curation;
- Questions Curation;
- Import.

These are consumer-facing contracts, not mandatory runtime objects/classes.

The implementation may realize them through one shared HTTP client/operation mapper as long as raw transport representation does not leak into feature public contracts.

### Mapping boundary

Transport DTO/status/route representation is mapped at the backend adapter.

Feature components consume:

- accepted identities;
- feature/view values;
- semantic operation outcomes.

They do not switch on raw HTTP codes as product semantics.

## State ownership

### App-wide context

Only state that must preserve continuity across accepted root/task transitions belongs above features:

- root work context;
- active target reference needed by Learning and target-scoped Knowledge.

Do not promote feature-local selection, drafts or renderer state into app-global state.

### Server representation/query state

Backend canonical data is represented through replaceable query/cache state associated with its consuming feature contracts.

The exact cache/query library and normalization strategy remain implementation freedom.

Do not create a mutable client-domain store that becomes an independent source of truth.

### Feature interaction state

Examples:

- Learning target search;
- Study preview inspection;
- Evidence focused Question;
- Knowledge search/filter/scope/focus;
- Curation focused entity and draft;
- local operation pending/recovery.

Own state in the narrowest feature/view responsible for its lifetime.

### Renderer state

Camera, scene resources, transient hover and provider lifecycle remain inside `ThreeDKnowledgeProjectionAdapter`.

Canonical focus may be reflected into the renderer, but the renderer does not own canonical focus identity.

## Decision review consequences

### Responsibility boundaries

Selected boundary: task/feature ownership.

- Learning, Knowledge and Curation are coherent feature boundaries.
- Topology views are public compositions inside those features.
- technical horizontal modules exist only as adapters or stable presentation utilities.

This prevents a structure dominated by generic `components / hooks / services` ownership where no feature clearly owns behavior.

### Provider seams

Selected seam strategy: narrow consumer-owned contracts at backend and 3D provider boundaries.

Do not wrap every framework/provider primitive.

A provider primitive may be used locally when it does not cross a public feature boundary.

### State ownership

Selected strategy: minimal app context + feature-local interaction state + replaceable server query/cache state + renderer-local state.

A universal mutable global store is not a default component.

## Collaboration traces

### Knowledge search → 3D focus

```text
KnowledgeExplorerSurface
  -> Knowledge query contract
  -> canonical results
  -> Knowledge interaction focus
  -> renderer-neutral projection model
  -> KnowledgeProjectionPort
  -> ThreeDKnowledgeProjectionAdapter

renderer focus intent
  -> canonical Knowledge identity
  -> KnowledgeExplorerSurface
  -> same focus/detail semantics as textual selection
```

### Curation mutation

```text
Curation*Surface
  -> local draft
  -> consumer command contract
  -> backend adapter
  -> accepted semantic outcome
  -> query/cache reconciliation
  -> visible canonical state or recovery
```

### Learning Study export

```text
StudyPreparationSurface
  -> build preview
  -> inspect current materialization
  -> export materialization token
  -> accepted success/conflict/external failure
  -> preserve/rebuild according to interaction contract
```

## Forbidden dependencies

- Learning/Curation public components -> 3D provider types;
- feature components -> raw HTTP route/status/DTO semantics as their public model;
- renderer adapter -> direct canonical mutation orchestration;
- feature local state -> redefinition of canonical backend identity/state;
- Curation generic editor abstraction -> ownership of domain validation;
- shared presentation primitives -> feature-owned mutable product state;
- 3D donor code -> root app/navigation/product ownership.

## Structural verification obligations

Downstream implementation must be able to prove:

- renderer/provider imports are contained to the renderer adapter boundary;
- backend transport imports are contained to backend provider/mapping boundaries;
- no browser-direct external-runtime client exists;
- feature boundaries do not cyclically own one another;
- Knowledge semantic access can be constructed without the 3D adapter;
- shared presentation primitives contain no feature/domain mutation behavior.

Exact lint/static tooling is implementation freedom.

## Implementation freedoms

Not fixed here:

- framework/component API syntax;
- directory/file names;
- router;
- state/query library;
- dependency injection mechanism;
- class vs function/module representation;
- exact component split below the public boundaries above;
- renderer library;
- styling system;
- exact caching strategy;
- exact lazy-loading/code-splitting mechanics.
