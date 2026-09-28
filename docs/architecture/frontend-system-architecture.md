# Frontend System Architecture

## Purpose

Define the browser-side structural architecture needed to realize the accepted user-centered frontend independently of backend runtime topology.

The frontend depends on accepted Application semantics and transport-neutral Machine Interface ports. Mock adapters are the first realization; a future transport adapter may replace them without changing feature semantics.

## Architecture drivers

Accepted drivers:

- one browser application realizes Target Work and Curation;
- target/capability/Knowledge/evidence/gap/priority semantics are owned upstream;
- the primary learner loop is target -> state -> gaps -> focus -> learning/diagnostics -> evidence -> progress;
- the frontend must validate this loop against representative mock data before backend realization;
- the same consumer-owned ports must support later transport adapters;
- bulk import and incremental curation are separate user workflows;
- 3D Knowledge is the preferred spatial projection while list/search/detail remains task-complete;
- active target and active learning focus must persist across learner features;
- renderer and provider state remain noncanonical.

No accepted driver requires microfrontends, an application-wide event bus, frontend-owned canonical persistence or a general global mutable store.

## Runtime and deployment decisions

- single browser runtime — accepted;
- one frontend deployable — accepted;
- feature composition + consumer-owned asynchronous ports — accepted;
- lifecycle-local state ownership — accepted;
- adapters depend inward on consumer contracts — accepted;
- provider/renderer failures are isolated to affected capability — accepted.

## Module topology

### Composition Root / Application Shell

Owns:

- application bootstrap;
- provider/adapter selection;
- Target Work / Curation top-level navigation;
- global runtime-status placement;
- active-target routing context.

It composes features but does not own canonical target/learner/corpus truth.

### Target Context

Small shared frontend context owned by target-work composition.

Owns only:

- active target identity;
- current accepted focus identity/intention where needed across views;
- navigation continuity.

It does not cache or reinterpret target requirements, learner state or gaps as canonical truth.

### Target Selection / Overview

Owns frontend realization for:

- target search/selection;
- target context/requirement understanding;
- transition to explicit Curation when a target must be prepared or repaired.

### Learner State / Gaps

Owns:

- current target-relative state projection;
- evidence-basis inspection;
- satisfied/unresolved/challenged presentation;
- gap inspection;
- explicit next-focus selection.

State/Gaps consumes upstream projections; it does not infer proficiency locally.

### Learning

Owns:

- available learning/practice support for the active focus;
- activity initiation;
- compatibility Study Set/Anki flow where applicable;
- missing-support routing.

Question-compatible Study Set logic is a compatibility subfeature, not the feature boundary itself.

### Diagnostics / Evidence

Owns:

- supported diagnostic opportunity selection;
- evidence synchronization/import initiation;
- factual Performance/Observation inspection;
- accepted learner-claim/argument projection where exposed.

It does not perform hidden inference in presentation code.

### Progress

Owns:

- current-vs-prior target-relative comparison;
- changed/unchanged gap presentation;
- adaptation entry back to focus selection.

### Knowledge Exploration

Reusable capability consumed by:

- Target Overview;
- State/Gaps;
- Learning;
- Diagnostics;
- Curation.

Owns:

- search/filter/selection/focus;
- target/focus scope presentation state;
- renderer-neutral spatial projection;
- non-spatial result/detail coordination;
- user-visible renderer preferences.

It does not own Knowledge truth, target semantics or learner state.

### Curation

Curation is decomposed by semantic responsibility:

- Targets;
- Capabilities;
- Knowledge;
- Learning Support;
- Assessment/Evidence Design;
- Import;
- Quality Diagnostics.

These features share canonical identities through ports, not each other's private state.

### Import

Owns the distinct bulk-ingestion workflow:

- retrieve/display import contract/examples;
- validate prepared data;
- display per-item outcomes;
- apply accepted records;
- preserve correction/retry context.

It does not own file-format semantics; Machine Interface Design owns the contract.

### Frontend Ports / Data Access

Consumer-owned contracts for target, state, gaps, focus, support, evidence, progress, curation, import and integration operations.

Realizations:

- Mock adapters — frontend-first realization;
- future Transport adapters.

Feature code never branches on adapter type.

### Graph Renderer Adapter

Consumes renderer-neutral graph scene/projection and owns only concrete rendering mechanics:

- camera/layout/force/drag/hover;
- library objects;
- batching/instancing/pixel-ratio;
- idle/degradation strategies;
- renderer diagnostics.

It emits semantic events using canonical identities.

## Dependency direction

```text
Composition Root / Shell
        |
        +--> Target Context
        |
        +--> Target Selection / Overview --+
        +--> Learner State / Gaps ---------+
        +--> Learning ---------------------+
        +--> Diagnostics / Evidence -------+--> consumer-owned ports/read models
        +--> Progress ---------------------+              ^
        +--> Curation / Import ------------+         Mock / Transport adapters
        |
        +--> Knowledge Exploration --> renderer-neutral projection
                                           ^
                                           |
                                      3D Renderer Adapter
```

Rules:

- features do not import concrete adapters;
- features do not import another feature's private state;
- shared Target Context contains only cross-view navigation identity/state;
- adapters implement consumer-owned ports;
- raw DTOs remain inside transport adapters;
- graph-library types remain inside renderer adapter;
- shared UI primitives do not own task/domain state.

## Frontend semantic/read-model boundary

Read models required by accepted tasks include:

- Target summary/detail + requirement structure;
- Capability summary/detail;
- target-relative state projection;
- Gap projection + basis;
- current LearningPriority/LearningIntent projection;
- Knowledge semantic models/projections;
- learning/practice support;
- diagnostic opportunities;
- Performance/Observation facts;
- accepted learner claim/argument projections;
- progress comparison;
- import contract/validation/apply result;
- RuntimeStatus.

These are frontend semantic models, not persistence models.

## State ownership

| State | Owner |
|---|---|
| top-level Target Work / Curation mode | Shell |
| active target identity | Target Context |
| active focus identity/intention | Target Context |
| target list/overview query state | Target Selection / Overview |
| state/gap selection and query state | Learner State / Gaps |
| active learning activity UI state | Learning |
| diagnostic/evidence UI state | Diagnostics / Evidence |
| progress comparison selection | Progress |
| curation collection/editor drafts | owning Curation feature |
| import document/validation/apply UI state | Import |
| Knowledge query/filter/selection/focus | Knowledge Exploration |
| graph camera/layout/physics | Renderer Adapter |
| canonical domain/application truth | external to frontend through ports |

A general global store is not part of the initial architecture.

## Mock-first prototype

Representative deterministic mock fixtures must cover one coherent target, e.g. Python backend with optional fintech/card-payments specialization.

The fixture set must support:

- non-empty target requirement structure;
- some satisfied capabilities;
- unresolved uncertainty;
- challenged gaps;
- visible current focus;
- learning support for some gaps;
- missing support for at least one gap;
- diagnostic opportunity and evidence update;
- progress/reassessment changing at least one target-relative state;
- target/focus-scoped Knowledge;
- bulk-import contract + mixed validation outcomes.

Mocks model current semantic contracts, not legacy backend DTOs.

## Failure isolation

- query failure preserves active target/focus;
- missing evidence remains unresolved rather than failing the entire target;
- missing learning support affects the relevant gap only;
- runtime failure affects delegated operations without erasing local evidence;
- import partial rejection preserves accepted independent outcomes;
- renderer failure preserves non-spatial Knowledge access.

## Structural verification obligations

Verify:

- feature internals do not cross-import;
- no feature imports concrete adapters;
- state/gap/progress views consume accepted projections rather than re-derive semantics inconsistently;
- mock and future transport adapters satisfy the same ports;
- active target/focus survives route/view changes;
- Knowledge renderer types remain isolated;
- target/focus-scoped graph projection does not alter Knowledge truth;
- renderer degradation preserves semantic result set and non-spatial completion.

## Non-goals

This architecture does not decide:

- backend service/runtime topology;
- HTTP routes/controllers;
- persistence;
- exact React component split;
- exact TypeScript signatures;
- router/query/component libraries;
- file paths;
- exact graph library;
- private renderer tuning.

## Reopening conditions

Reopen if accepted requirements introduce independent frontend deployables, offline canonical state, browser-side authorization boundaries, server-driven UI, or renderer-owned canonical editing semantics.
