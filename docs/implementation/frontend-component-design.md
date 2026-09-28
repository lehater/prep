# Frontend Component Design

## Purpose

Define implementation-facing feature components, consumer-owned ports, semantic view models and renderer seams for the complete user-centered frontend slice.

## Public feature responsibilities

### FrontendCompositionRoot

Wires shell, target-work features, curation features, mock/future transport adapters, graph renderer and shared presentation provider.

### AppShell

Owns top-level Target Work / Curation navigation and runtime-status placement.

### TargetContext

Owns only cross-view navigation state:

- active target id;
- active focus id/intention where needed.

It does not own canonical target/gap/evidence truth.

### TargetSelectionFeature

Owns target search/selection and explicit transition to target preparation.

### TargetOverviewFeature

Owns target context and required capability presentation.

### LearnerStateFeature

Owns:

- target-relative current-state projection;
- evidence-basis inspection;
- diagnostic-opportunity entry.

### GapFocusFeature

Owns:

- gap collection/detail;
- satisfied/unresolved/challenged presentation;
- focus selection and rationale.

### LearningFeature

Owns:

- support discovery for current focus;
- learning/practice activity initiation;
- compatibility Study Set / external-study path.

### DiagnosticEvidenceFeature

Owns:

- diagnostic opportunity discovery;
- evidence sync/import UI;
- Performance/Observation and accepted claim/argument inspection.

### ProgressFeature

Owns target-relative change comparison and adaptation actions.

### KnowledgeExplorer

Reusable by target-work and Curation.

Owns search/filter/selection/focus, renderer-neutral graph projection and task-complete non-spatial access.

### Curation features

Independent feature ownership:

- TargetCurationFeature;
- CapabilityCurationFeature;
- KnowledgeCurationFeature;
- LearningSupportCurationFeature;
- AssessmentCurationFeature;
- ImportFeature;
- CorpusQualityFeature.

## Consumer-owned ports

One adapter may implement multiple ports.

### TargetPort

- list/search targets;
- get target detail.

### LearnerStatePort

- get target-relative state;
- get gaps;
- get current focus;
- set focus;
- get progress comparison.

### DiagnosticPort

- list diagnostic opportunities;
- start diagnostic/activity context.

### LearningSupportPort

- list support for target/focus;
- start learning/practice activity;
- compatibility Study Set build/export where applicable.

### EvidencePort

- get target evidence;
- sync supported external evidence.

### KnowledgePort

- list/search Knowledge for target/focus/global scope;
- get semantic projection/detail;
- curation create/update where owned by Curation adapter surface.

### TargetCurationPort

- list/get/create/update target definitions and RequirementExpressions.

### CapabilityCurationPort

- list/get/create/update reusable capabilities.

### LearningSupportCurationPort

- list/get/create/update reusable support.

### AssessmentCurationPort

- list/get/create/update assessment/evidence design.

### ImportPort

- get import contract/examples;
- validate prepared document;
- apply validated/current document.

### CorpusQualityPort

- get supported corpus diagnostics.

### RuntimeStatusPort

- get external-runtime reachability/compatibility.

## Frontend semantic models

Required models include:

- `TargetModel`;
- `TargetRequirementModel`;
- `CapabilityModel`;
- `TargetStateModel`;
- `GapModel`;
- `LearningFocusModel`;
- `KnowledgeObjectModel`;
- `KnowledgePropositionModel`;
- `LearningSupportModel`;
- `DiagnosticOpportunityModel`;
- `EvidenceFactModel`;
- `LearnerClaimModel`;
- `ProgressComparisonModel`;
- `ImportContractModel`;
- `ImportValidationModel`;
- `ImportApplyResultModel`;
- `RuntimeStatusModel`.

Models preserve accepted distinctions and never introduce a generic proficiency/mastery scalar.

## Representation mapping

```text
Mock fixture OR future transport DTO
        -> adapter mapper
        -> frontend-owned models/outcomes
        -> feature components
```

Rules:

- fixtures/DTOs never leak into feature contracts;
- canonical identity and semantic distinctions are preserved;
- opaque tokens remain opaque;
- incompatible input becomes explicit adapter failure.

## Knowledge graph boundary

`GraphProjectionBuilder` transforms Knowledge models plus explicit target/focus scope and filters into renderer-neutral `GraphScene`.

Renderer owns coordinates, camera, force, drag/hover, batching and diagnostics.

Graph scene may carry presentation overlays for accepted target/focus context but cannot invent learner-state semantics.

## MockFrontendAdapter

Current implementation priority.

Fixtures must cover one coherent end-to-end target, e.g. Python backend with fintech/card-payments specialization:

- target requirements;
- satisfied + unresolved + challenged state;
- evidence basis;
- gaps;
- active focus;
- relevant Knowledge;
- learning support;
- missing support;
- diagnostic opportunity;
- evidence update;
- changed progress;
- mixed import validation/apply outcomes.

Mocks are test/prototype data, not canonical product truth.

## State ownership

| State | Owner |
|---|---|
| top-level mode/navigation | AppShell |
| active target/focus ids | TargetContext |
| current-state query/selection | LearnerStateFeature |
| gap/focus interaction | GapFocusFeature |
| learning activity UI state | LearningFeature |
| diagnostic/evidence UI state | DiagnosticEvidenceFeature |
| progress comparison state | ProgressFeature |
| curation drafts | owning Curation feature |
| import document/validation/apply state | ImportFeature |
| Knowledge query/filter/selection/focus | KnowledgeExplorer |
| graph camera/layout/physics | renderer adapter |

## Forbidden dependencies

- feature -> concrete mock/transport adapter;
- feature -> raw DTO;
- feature -> concrete graph package;
- target-work feature -> another feature's private mutable state;
- target-work internals <-> Curation internals;
- renderer -> machine DTOs;
- shared UI primitives -> feature task state;
- presentation code -> learner-state inference;
- graph geometry -> semantic priority/gap/mastery.

## Structural verification

Must be testably possible to prove:

- all mock ports satisfy the current contracts;
- a future transport adapter can satisfy the same contracts;
- active target/focus persists across feature navigation;
- target state/gap/progress is consumed rather than re-derived inconsistently in UI;
- Knowledge identity/proposition meaning survives graph projection;
- selection and focus remain distinct;
- renderer unavailable path leaves Knowledge task-complete;
- bulk import validate/apply separation is preserved;
- Curation and target-work internals remain independent.

## Implementation freedoms

Private component split, hooks/classes/functions, exact TypeScript signatures, router/query library, local helper names and physical file paths remain downstream until Implementation Design fixes realization.
