# Frontend System Architecture

## Purpose

Define the browser-side structural architecture needed to realize the accepted Prep
preparation interface independently of backend runtime topology.

The frontend consumes accepted Application semantics through transport-neutral Machine
Interface operations. Mock adapters are the first realization; a future transport
adapter may replace them without changing task-feature semantics.

This revision removes legacy frontend architectural assumptions that are no longer
present in the accepted Task Model, Information Architecture, Interface Topology or
Machine Interface. In particular, Curation/Import workspaces, a separate Progress
feature, a separate Diagnostics surface and a 3D-default Knowledge requirement are not
frontend architecture drivers.

## Decision basis

Pre-choice exploration and review for this revision are recorded as noncanonical draft
evidence:

- `.harness/candidates/frontend-system-architecture-exploration-draft.yaml`
- `.harness/candidates/frontend-system-architecture-decision-review-draft.yaml`

All six system-architecture decision axes retain the existing minimal structural model:
one browser runtime/deployable, consumer-owned ports, external canonical truth,
inward-facing contracts and task-local failure isolation.

Formal semantic admission remains blocked because the legacy accepted provider has no
current Harness lifecycle assertion/acceptance identity. The architecture below is
therefore a draft revision until lifecycle-backed revalidation is performed.

## Architecture drivers

Accepted drivers:

- Prep is one browser-delivered learner preparation interface over the accepted
  frontend/backend runtime boundary.
- Current learner work is organized around Targets comparison, Target
  establishment/requirements, Current position, Knowledge exploration, Activity,
  Evidence & changes, and contextual Prepare Support.
- active Target and optional Next focus are cross-view interaction context; navigation
  does not silently change either.
- target/capability/Knowledge/evidence/gap/focus semantics are owned upstream.
- frontend code consumes accepted machine operations/read models instead of deriving
  learner or target truth locally.
- the same consumer-owned ports must support deterministic mock adapters and later
  transport adapters.
- Knowledge must remain task-complete through non-spatial query/result/detail access;
  a spatial view is optional and 3D remains experimental presentation freedom.
- provider/renderer state is presentation state, never canonical Knowledge or learner
  meaning.
- contextual missing-preparation support is a learner request/review/return flow, not a
  global corpus/import workspace.

No accepted driver requires microfrontends, a frontend-wide event bus, frontend-owned
canonical persistence, a general global mutable store, a global Curation mode, or an
independently deployed renderer.

## Runtime and deployment decisions

- single browser runtime — retained;
- one frontend deployable/container — retained;
- feature composition + consumer-owned asynchronous ports — retained;
- lifecycle-local/transient state ownership — retained;
- adapters depend inward on consumer contracts — retained;
- provider/renderer failures are isolated to the affected task capability — retained.

The whole-system browser/frontend/backend deployment boundary remains owned by
`docs/architecture/system-architecture.md`.

## Module topology

### Composition Root / Preparation Shell

Owns:

- application bootstrap;
- provider/adapter selection;
- preparation navigation composition;
- active-child composition;
- recovery when a required Target/focus context is missing.

The shell composes accepted task features. It does not own canonical Target, learner,
Knowledge or support truth.

### Preparation Context

Small cross-view frontend context.

Owns only:

- active Target identity when established;
- current accepted Next-focus identity/intention when one exists;
- navigation continuity required to preserve those identities.

It does not cache or reinterpret Target requirements, learner state, gaps, evidence or
Knowledge as canonical truth.

### Target Direction

Realizes `VIEW-TARGETS / IX-TARGET-DIRECTION`.

Owns browser interaction for:

- candidate Target selection;
- comparison of target-specific requirement/state/gap projections over one learner
  evidence basis;
- choosing a candidate to continue with or leaving direction unresolved.

It consumes `prep.targets.compare` and never activates a Target as a side effect of
comparison.

### Target

Realizes `VIEW-TARGET / IX-TARGET`.

Owns browser interaction for:

- Target/source context input;
- Target establishment/refinement;
- requirement and direct Knowledge-focus inspection;
- contextual missing-support entry.

It consumes `prep.target.establish` and `prep.target.requirements.get`.

### Current Position

Realizes `VIEW-CURRENT / IX-DIRECTION`.

Owns browser interaction for:

- current demonstrated/challenged/unknown projection;
- gaps and uncertainty;
- evidence-basis inspection;
- explicit Next-focus selection/revision.

It consumes current-state, evidence, gap and focus operations. It does not infer
proficiency, gap closure or focus automatically.

### Knowledge Exploration

Realizes `VIEW-KNOWLEDGE / IX-KNOWLEDGE`.

Owns browser interaction for:

- semantic query and reversible scope;
- optional Required-Capability scope;
- bounded results and selected Knowledge detail;
- meaningful relationship inspection;
- optional renderer-neutral spatial overview.

Task-critical behavior remains usable without a spatial renderer.

### Activity

Realizes `VIEW-ACTIVITY / IX-ACTIVITY`.

Owns browser interaction for:

- support-fit inspection and support selection;
- activity-attempt start;
- active attempt interaction state;
- submit/complete state and evidence-processing status.

It consumes `prep.support.list`, `prep.activity.start` and
`prep.activity.complete`. Activity completion does not itself become learner
capability evidence.

### Evidence & Change

Realizes `VIEW-EVIDENCE-CHANGE` for both `IX-DIRECTION` and `IX-ACTIVITY`.

Owns browser interaction for:

- explaining a selected current-state conclusion from evidence;
- reviewing post-activity change/no-change/challenge/increased-uncertainty outcomes;
- preserving distinction between evidence, learner-state change and Target-information
  refinement;
- choosing an explicit continuation.

It consumes `prep.evidence.get`, `prep.change.get` and supporting current-state
projection where required. It is inspect/review interaction, not an independent
"progress" domain or frontend owner.

### Preparation Support

Realizes `VIEW-PREPARE-SUPPORT / IX-PREP-SUPPORT`.

Owns contextual browser interaction for:

- preserving the motivating Target/focus/missing-support context;
- supplying fragmented source/provenance context;
- requesting preparation;
- reviewing independently accepted support plus explicit unresolved/rejected remainder;
- recovery/resume and return to the originating work.

It consumes `prep.support.prepare.request` and `prep.support.prepare.get`.
It does not expose corpus/import/schema maintenance as learner work.

### Frontend Ports / Data Access

Task features depend on narrow consumer-owned contracts shaped by the accepted machine
operations they consume. One adapter may implement several ports; one runtime object per
port is not required.

Realizations:

- deterministic Mock adapter(s) for prototype/usability work;
- future Transport adapter(s) for backend integration.

Features never branch on adapter type and raw transport/provider DTOs do not cross the
adapter boundary.

### Optional Spatial Renderer Adapter

When a spatial Knowledge overview is enabled, a renderer adapter consumes a
renderer-neutral semantic projection and owns only presentation mechanics such as:

- coordinates/layout;
- camera/pan/zoom;
- force/physics when selected;
- pointer/hover/direct-manipulation mechanics;
- batching/virtualization/rendering diagnostics.

It emits semantic selection/scope events using canonical Knowledge identities.

No 2D/3D renderer is required by architecture. A renderer failure must preserve the
task-complete non-spatial Knowledge path.

## Dependency direction

```text
Composition Root / Preparation Shell
        |
        +--> Preparation Context
        |
        +--> Target Direction --------+
        +--> Target ------------------+
        +--> Current Position --------+
        +--> Knowledge Exploration ---+--> consumer-owned ports/read models
        +--> Activity ----------------+              ^
        +--> Evidence & Change -------+         Mock / Transport adapters
        +--> Preparation Support -----+
        |
        +--> optional Spatial Renderer Adapter
                  ^
                  |
          renderer-neutral projection
```

Rules:

- task features do not import concrete mock/transport adapters;
- task features do not depend on another feature's private mutable state;
- Preparation Context contains only cross-view navigation identity/intention;
- adapters implement consumer-owned ports;
- raw DTO/provider types remain inside adapters;
- renderer-library types remain inside the renderer adapter;
- shared presentation primitives do not own task/domain state;
- module boundaries follow accepted task/interaction responsibilities rather than
  backend resources or domain-entity CRUD groupings.

## Frontend semantic/read-model boundary

Accepted frontend projections include, as needed by the task features:

- Target comparison representation over one learner evidence basis;
- Target identity/context and requirement structure;
- current target-relative state projection;
- evidence representation and limitations;
- Gap representation plus focus-decision context;
- accepted Focus/PreparationIntent projection;
- Knowledge semantic projection/detail;
- support representation with fit basis/limitations;
- ActivityAttempt representation and consumer-visible processing outcome;
- evidence/change review representation;
- PreparationRequest representation with accepted support and explicit remainder.

These are frontend-consumed semantic projections, not persistence models. The frontend
does not invent a generic Progress, Import, Curation or RuntimeStatus model when no
accepted machine/interface responsibility requires one.

## State ownership

| State | Owner |
|---|---|
| preparation navigation / active child | Preparation Shell |
| active Target identity | Preparation Context |
| active Next-focus identity/intention | Preparation Context |
| candidate comparison selection/projection state | Target Direction |
| Target setup/refinement interaction state | Target |
| current-state/gap/focus interaction state | Current Position |
| Knowledge query/scope/selection/detail | Knowledge Exploration |
| activity support selection / attempt UI state | Activity |
| evidence/change review selection | Evidence & Change |
| preparation-request/source/recovery interaction state | Preparation Support |
| optional spatial camera/layout/physics | Spatial Renderer Adapter |
| canonical domain/application truth | external to frontend through accepted ports |

A general application-wide mutable store is not part of the architecture.

## Mock-first prototype

Representative deterministic mocks must cover the accepted user-facing semantic
contracts, including:

- two or more plausible candidate Targets over one learner evidence basis;
- one Target with requirements and unresolved Target information;
- demonstrated, challenged and unknown current-state areas;
- visible gaps/uncertainty and a selectable Next focus;
- Knowledge in target/focus/Required-Capability scope;
- suitable support for at least one focus and one missing-support case;
- one activity attempt with evidence-processing outcome;
- evidence/change review including at least one changed/no-change/challenged or
  increased-uncertainty result;
- one contextual preparation request with partial or unresolved remainder and return
  to originating work.

Mocks realize current semantic contracts rather than legacy backend DTOs or obsolete UI
features.

## Failure isolation

- query failure preserves active Target/focus and current task context where safe;
- missing/insufficient evidence remains explicit uncertainty rather than application
  failure;
- missing suitable support affects the relevant focus and exposes Preparation Support;
- activity/evidence dependency failure preserves the attempt/context allowed by the
  accepted interaction contract;
- preparation-support partial/unavailable outcomes preserve already accepted results and
  resumable context;
- optional renderer failure preserves non-spatial Knowledge access;
- a localized provider failure does not invalidate unrelated preparation views.

## Structural verification obligations

Verify:

- task-feature internals do not cross-import private state;
- no task feature imports concrete adapters or provider DTOs;
- current-state/gap/evidence/change views consume accepted projections rather than
  re-deriving learner semantics;
- mock and future transport adapters can satisfy the same consumer-owned ports;
- active Target/focus survive accepted view transitions;
- Knowledge renderer types remain isolated;
- spatial projection does not alter Knowledge identity/scope/relationship meaning;
- renderer degradation preserves semantic result/detail and non-spatial completion;
- no legacy Curation/Import/Progress/Diagnostics module is required merely because an
  older frontend realization contained one.

## Non-goals

This architecture does not decide:

- backend service/runtime topology;
- HTTP routes/controllers;
- persistence;
- exact React component split;
- exact TypeScript signatures;
- router/query/component libraries;
- file paths;
- exact graph/spatial-renderer library;
- whether an experimental 3D view is worth keeping after usability validation;
- reusable corpus authoring/curation UI that is not present in accepted learner tasks.

## Reopening conditions

Reopen if accepted requirements introduce:

- independently deployable frontend surfaces;
- learner/curator roles or a canonical Curation workspace;
- offline canonical browser state;
- browser-side authorization/trust boundaries;
- server-driven UI;
- renderer-owned canonical editing semantics;
- a required spatial-only interaction unavailable through the non-spatial path;
- new task responsibilities that cannot remain coherent inside the current feature
  boundaries.
