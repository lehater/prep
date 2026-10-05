# Frontend Component Design

## Purpose

Define implementation-facing frontend feature boundaries, consumer-owned ports,
semantic view models and optional renderer seams for the accepted Prep preparation UI.

This artifact realizes current Screen/View and Machine Interface responsibilities. It
does not recreate legacy Curation/Import/Progress/Diagnostics feature boundaries that
are absent from the accepted learner interface.

## Decision basis

Pre-choice exploration and review for this revision are recorded as noncanonical draft
evidence:

- `.harness/candidates/frontend-component-design-exploration-draft.yaml`
- `.harness/candidates/frontend-component-design-decision-review-draft.yaml`

The selected public boundaries follow accepted view responsibilities. Narrow
consumer-owned ports are retained as the smallest useful provider seams; one concrete
adapter may implement several ports. Active Target/focus continuity is the only shared
cross-view mutable context.

Formal semantic admission remains blocked by the legacy lifecycle gap and by the
upstream frontend-system-architecture revision still awaiting lifecycle-backed
revalidation.

## Public feature responsibilities

### FrontendCompositionRoot

Wires:

- PreparationShell;
- PreparationContext;
- task features;
- mock or future transport adapters;
- shared presentation provider;
- optional spatial Knowledge renderer.

It owns construction/composition only and no task/domain state.

### PreparationShell

Realizes the structural `FRAME-PREPARATION`.

Owns:

- preparation navigation;
- active-child composition;
- missing Target/focus routing/recovery according to Interface Topology.

It reads active context from `PreparationContext` but does not own canonical Target,
focus, learner or Knowledge meaning.

### PreparationContext

Owns only cross-view interaction continuity:

- active Target ref when established;
- active Next-focus ref/intention when accepted;
- the minimum navigation context needed to preserve those identities.

It does not own Target requirements, learner state, gaps, evidence, Knowledge,
ActivityAttempt or PreparationRequest semantics.

### TargetDirectionFeature

Realizes `VIEW-TARGETS`.

Owns:

- candidate Target selection;
- comparison-query state;
- TargetComparison presentation model;
- choose-candidate/leave-unresolved UI action state.

It consumes `TargetDirectionPort` and never activates a Target locally.

### TargetFeature

Realizes `VIEW-TARGET`.

Owns:

- Target/source input and unresolved input preservation;
- establish/refine pending/result state;
- Target requirements inspection;
- direct Knowledge-focus navigation intent;
- contextual preparation-support entry.

It consumes `TargetPort`.

### CurrentPositionFeature

Realizes `VIEW-CURRENT`.

Owns one cohesive decision surface:

- current-state projection selection/detail;
- gaps/uncertainty selection;
- evidence-basis inspection;
- focus-decision context;
- set/revise-focus pending/rejected/stale interaction state.

It consumes `CurrentPositionPort`.

State, Gap and focus may be decomposed into private subcomponents, but are not separate
public features because the accepted view requires them to collaborate in one decision
context.

### KnowledgeExplorerFeature

Realizes `VIEW-KNOWLEDGE`.

Owns:

- query;
- semantic scope;
- optional Required-Capability scope;
- bounded result selection;
- selected Knowledge detail;
- relationship inspection;
- optional renderer-neutral spatial projection state.

It consumes `KnowledgePort`. Spatial rendering is optional; all task-critical behavior
has a non-spatial path.

### ActivityFeature

Realizes `VIEW-ACTIVITY`.

Owns:

- support option selection and fit inspection;
- start-attempt pending/outcome state;
- active ActivityAttempt interaction state;
- attempt completion/submission state;
- evidence-processing status until a reviewable continuation is available.

It consumes `ActivityPort`.

Learning/practice/diagnostic/retention/transfer activity distinctions remain accepted
support/activity semantics; they do not require separate public frontend feature
owners unless a future interaction contract gives them independently changing UI
responsibilities.

### EvidenceChangeFeature

Realizes `VIEW-EVIDENCE-CHANGE`.

Owns:

- selected review subject;
- evidence explanation/detail inspection;
- optional post-activity ChangeRepresentation;
- current-state supporting context where required;
- continuation choice.

It consumes `EvidenceChangePort`.

The feature does not own a generic Progress concept and never treats Target-information
refinement as learner-state progress.

### PreparationSupportFeature

Realizes `VIEW-PREPARE-SUPPORT`.

Owns:

- preserved motivating Target/focus/missing-support context;
- source/provenance input;
- preparation-request pending/current state;
- independently accepted support results;
- unresolved/rejected remainder;
- resume/recovery and return-to-origin state.

It consumes `PreparationSupportPort`.

It does not expose import schemas, corpus editors or reusable semantic maintenance as
learner responsibilities.

## Consumer-owned ports

Ports are shaped by the consuming task feature. A single adapter implementation may
satisfy multiple ports; component design does not require one runtime object per port.

### TargetDirectionPort

- compare candidate Targets using `prep.targets.compare`.

Input/output preserve `TargetComparisonRepresentation`, semantic basis and accepted
outcome semantics.

### TargetPort

- establish/refine Target using `prep.target.establish`;
- get Target requirements using `prep.target.requirements.get`.

### CurrentPositionPort

- get current state using `prep.current_state.get`;
- get evidence detail using `prep.evidence.get`;
- get gaps plus `FocusDecisionContext` using `prep.gaps.get`;
- set/revise focus using `prep.focus.set`.

### KnowledgePort

- query Knowledge using `prep.knowledge.query`.

The port exposes semantic query/scope and `KnowledgeProjection`; it has no graph
coordinates, renderer types or curation mutation operations.

### ActivityPort

- list support using `prep.support.list`;
- start activity using `prep.activity.start`;
- complete activity using `prep.activity.complete`.

Completion results preserve accepted evidence-cycle outcomes. The port never exposes a
"mark learned" or "close gap" operation.

### EvidenceChangePort

- get evidence detail using `prep.evidence.get`;
- get change review using `prep.change.get`;
- get current-state supporting projection using `prep.current_state.get` when needed.

### PreparationSupportPort

- request preparation support using `prep.support.prepare.request`;
- continue/read request state using `prep.support.prepare.get`.

## Frontend semantic models

Frontend-owned models are consumer projections of the accepted machine representations,
not persistence models and not alternative domain truth.

Required model families include:

- `TargetComparisonModel`;
- `TargetModel`;
- `TargetRequirementModel`;
- `CurrentStateModel`;
- `EvidenceModel`;
- `GapModel`;
- `FocusDecisionContextModel`;
- `FocusModel`;
- `KnowledgeProjectionModel`;
- `SupportModel`;
- `ActivityAttemptModel`;
- `ChangeModel`;
- `PreparationRequestModel`;
- common semantic outcome/currentness envelopes.

Model mapping must preserve demonstrated/challenged/unknown, supports/challenges,
Target-vs-learner-change, explicit remainder, provenance/limitations and opaque semantic
basis refs. No generic proficiency/mastery/progress scalar is introduced.

## Representation mapping

```text
Mock fixture OR future transport DTO
        -> adapter mapper
        -> frontend-owned semantic models/outcomes
        -> task feature
```

Rules:

- fixtures/transport DTOs terminate at adapter mappers;
- accepted canonical identities and semantic distinctions are preserved;
- opaque basis/correlation refs remain opaque;
- incompatible input becomes explicit adapter/operational failure;
- feature code does not infer accepted learner or Target conclusions from raw facts.

## Optional spatial Knowledge boundary

`SpatialKnowledgeProjectionBuilder` may transform `KnowledgeProjectionModel` plus
current semantic scope into a renderer-neutral scene/projection when a spatial
presentation is enabled.

The optional `SpatialKnowledgeRenderer` provider owns only rendering mechanics:

- coordinates/layout;
- pan/zoom/camera;
- optional force/physics;
- pointer/hover/direct manipulation;
- batching/virtualization and renderer diagnostics.

The renderer emits semantic events using canonical Knowledge identities.

Renderer types never cross into `KnowledgePort` or task-semantic models. The
Knowledge feature remains task-complete when the renderer is absent or unavailable.

## MockFrontendAdapter

The first provider realization may implement all consumer ports in one deterministic
mock adapter.

Fixtures must cover:

- candidate Target comparison over one evidence basis;
- Target establishment and requirement inspection;
- demonstrated/challenged/unknown current-state projections;
- evidence explanations and limitations;
- gaps plus focus-decision context;
- Knowledge query/scope/detail;
- support-fit alternatives;
- one ActivityAttempt and evidence-processing outcome;
- post-activity change/no-change/challenge/increased-uncertainty review;
- one preparation request with partial/unresolved remainder and recovery.

Mocks are prototype/test evidence. They do not become canonical product truth.

## State ownership

| State | Owner |
|---|---|
| active child/navigation state | PreparationShell |
| active Target/focus identities | PreparationContext |
| candidate selection/comparison UI state | TargetDirectionFeature |
| Target input/pending/refinement UI state | TargetFeature |
| current-state/gap/focus decision UI state | CurrentPositionFeature |
| Knowledge query/scope/selection/detail | KnowledgeExplorerFeature |
| support selection/activity-attempt UI state | ActivityFeature |
| evidence/change review selection | EvidenceChangeFeature |
| preparation request/source/recovery UI state | PreparationSupportFeature |
| optional spatial camera/layout/physics | Spatial renderer provider |
| fetched projection cache | adapter/query provider, never canonical domain owner |
| canonical domain/application truth | outside frontend behind accepted machine operations |

A general global store is not required. If the selected UI/query provider internally
uses shared caching, that cache remains provider state and does not become semantic
ownership.

## Dependency direction

```text
PreparationShell
      |
      +--> PreparationContext
      |
      +--> task features ---> consumer-owned ports
                                 ^
                                 |
                          Mock/Transport adapter

KnowledgeExplorerFeature ---> optional renderer-neutral seam
                                      ^
                                      |
                            Spatial renderer provider
```

Rules:

- feature -> its consumer-owned port/model contracts;
- provider adapter -> consumer contracts;
- no feature -> concrete adapter/provider;
- no feature -> another feature's private mutable state;
- no feature -> raw transport DTO;
- no task feature -> concrete renderer package;
- shared presentation primitives -> no task/domain mutable state.

## Forbidden public components / ports without reopened upstream scope

Do not retain or introduce the following as public frontend responsibilities merely
because older code/design used them:

- Curation workspace/features;
- Import feature/port;
- Progress feature/model/port;
- separate Diagnostics feature/port;
- RuntimeStatus feature/port;
- generic corpus CRUD ports;
- generic resource repository/client shaped around backend endpoints.

If a future accepted Task/Interaction/Machine Interface introduces one of these
responsibilities, Component Design must be reopened.

## Structural verification

It must be mechanically or analytically possible to prove:

- task features consume only their declared consumer contracts;
- concrete adapter/provider and raw DTO types do not leak into feature contracts;
- one adapter can be replaced without rewriting task semantics;
- active Target/focus continuity is isolated in `PreparationContext`;
- task-specific transient state does not leak into a global semantic store;
- current-state/gap/evidence/change semantics are consumed, not reconstructed
  inconsistently in UI code;
- Activity completion alone cannot update learner capability state;
- preparation-support partial/recovery state preserves accepted results and motivating
  context;
- renderer unavailable leaves Knowledge task-complete;
- no obsolete Curation/Import/Progress/Diagnostics public dependency edge is required.

## Implementation freedoms

The following remain downstream:

- private component/subcomponent split;
- React hooks/classes/functions;
- exact TypeScript interface syntax;
- whether several narrow ports are implemented by one object;
- router/query/form provider;
- local cache mechanics;
- physical source file paths;
- exact spatial renderer/library;
- whether the experimental spatial view is enabled in a given prototype.

These freedoms may vary without changing public responsibilities or accepted UI
semantics.
