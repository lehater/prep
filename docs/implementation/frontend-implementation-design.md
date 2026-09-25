# Frontend Implementation Design

## Purpose

Translate the accepted Prep frontend architecture, component contracts, verification obligations and executable test contracts into bounded production implementation work.

This artifact is the final design boundary before production frontend coding. It owns repository realization, tool/provider selection, implementation slicing and completion criteria. It does not redefine Product, Domain, Application, Interface, Machine Interface, System Architecture, Engineering Policy, Component Design, Verification Design or Test Design semantics.

## Implementation boundary

In scope:

- create the production `web/` frontend package from the current repository, which has no canonical production frontend source tree;
- realize the accepted Application Shell, Learning, Curation and Knowledge Exploration responsibilities;
- implement consumer-owned frontend models/ports and mock/HTTP adapters;
- realize the reusable presentation/provider layer using a replaceable UI provider;
- implement the renderer-neutral graph projection and concrete 3D renderer adapter;
- adapt eligible mechanics from `experiments/knowledge-representation-3d` without promoting its product semantics;
- implement the accepted frontend test contracts and verification evidence;
- package the frontend as the separate Docker runtime required by System Architecture.

Out of scope:

- backend implementation;
- persistence implementation;
- new Product/Domain/Application semantics;
- authentication/multi-user behavior;
- new background synchronization;
- learning mastery/readiness inference;
- graph semantics not present in canonical Knowledge Model;
- provider features not authorized by accepted Screen/View contracts.

## Selected frontend toolchain

Current production realization selects:

- Node.js 24.x LTS for the frontend build/test environment;
- npm with a committed `package-lock.json`; CI/build uses `npm ci`;
- React 19;
- TypeScript 6;
- Vite 8;
- React Router for route realization;
- TanStack Query for server/query-cache state once HTTP adapters are active;
- MUI Material community/free package (`@mui/material`) as the initial presentation provider;
- `react-force-graph-3d` + Three.js as the initial 3D renderer provider;
- Vitest for unit/contract/component-level executable contracts;
- Playwright for browser end-to-end contracts;
- oxlint for frontend linting;
- Storybook as an optional presentation/renderer review surface and experiment host, not semantic authority.

Exact package versions are pinned by the first production `web/package-lock.json`. The experiment package/lockfile is evidence for a known-working combination, not a production lockfile to copy unchanged.

No MUI X Pro/Premium or other paid provider capability is required by the accepted scope. Introducing a paid/provider-specific feature later requires an explicit implementation/dependency decision and must not change public Prep semantics.

## Provider realization

MUI is a concrete implementation provider, not a frontend contract owner.

Rules:

- one application-level MUI `ThemeProvider` is composed at the frontend composition root;
- repeated Presentation System roles map through `web/src/ui/theme/**`;
- reusable product presentation patterns live under `web/src/ui/patterns/**`;
- project pattern props/contracts use Prep/React/plain TypeScript types rather than exported MUI-specific types;
- feature-local use of MUI primitives is allowed when it remains private/local and does not create a cross-feature public contract;
- do not create one project wrapper per `Box`, `Stack`, `Typography`, `Button` or other provider primitive;
- replacing MUI is expected to change theme/provider/pattern realization, not frontend semantic models, feature ports or Screen/View meaning.

## Repository realization

The production frontend root is:

```text
web/
  package.json
  package-lock.json
  tsconfig*.json
  vite.config.ts
  Dockerfile

  scripts/
    check-boundaries.mjs

  src/
    app/
      composition/
      routing/
      shell/
      config/

    features/
      learning/
      curation/
      knowledge-explorer/
        model/
        ports/
        projection/
        ui/

    adapters/
      http/
      mock/
      graph-rfg3d/

    ui/
      theme/
      patterns/

    test-support/

  e2e/
```

These are architectural/module roots, not a requirement for one class/file per box.

Private helper files, hook decomposition and component filenames remain implementation freedom as long as they preserve the accepted public boundaries.

### Semantic-to-physical mapping

| Accepted responsibility | Physical home |
|---|---|
| FrontendCompositionRoot | `web/src/app/composition/**` |
| AppShell + top-level mode/nav | `web/src/app/shell/**`, `web/src/app/routing/**` |
| LearningWorkspace | `web/src/features/learning/**` |
| CurationWorkspace | `web/src/features/curation/**` |
| KnowledgeExplorer | `web/src/features/knowledge-explorer/ui/**` |
| Knowledge frontend models / scope / graph model | `web/src/features/knowledge-explorer/model/**` |
| KnowledgeQueryPort / GraphRenderer-facing contracts | `web/src/features/knowledge-explorer/ports/**` |
| GraphProjectionBuilder / GraphScene | `web/src/features/knowledge-explorer/projection/**` |
| HTTP transport DTOs/mappers/client implementations | `web/src/adapters/http/**` |
| mock query implementations/fixtures | `web/src/adapters/mock/**` |
| react-force-graph-3d / Three.js adapter | `web/src/adapters/graph-rfg3d/**` |
| shared presentation roles/theme | `web/src/ui/theme/**` |
| stable repeated product presentation patterns | `web/src/ui/patterns/**` |
| reusable test builders/fakes | `web/src/test-support/**` |
| browser end-to-end contracts | `web/e2e/**` |

Do not introduce a generic `shared/` dumping-ground module. Promote a dependency to a shared root only when the accepted Engineering Policy reuse criteria are met.

## Dependency enforcement

`web/scripts/check-boundaries.mjs` is the project-owned deterministic source-boundary check.

It must fail when:

- `features/**` imports concrete `adapters/**`;
- Learning feature internals import Curation internals or vice versa;
- `react-force-graph-3d`, `three` or `three-spritetext` are imported outside `src/adapters/graph-rfg3d/**`;
- raw HTTP DTO modules are imported outside `src/adapters/http/**`;
- renderer adapter code imports Machine Interface DTO modules directly;
- frontend model/port/projection modules import MUI/provider implementation types;
- a cross-feature UI pattern imports feature-owned mutable state.

The checker should operate on versioned source imports and path rules, not generated editor state.

TypeScript compilation additionally enforces public type boundaries; oxlint handles ordinary code-quality rules.

## State realization

Use:

- React/router state for navigation and shareable route context;
- local React state/reducer state for feature-local transient UI state;
- TanStack Query for server/query-cache state once the HTTP adapter is active;
- renderer-local refs/state for camera, force simulation, drag and hover mechanics.

Do not add a general-purpose global client store in the initial production frontend.

If later code demonstrates cross-feature mutable state whose lifecycle cannot be owned by shell/router/query cache, reopen Component/Implementation Design rather than introducing a store silently.

## Implementation slices

Slices are dependency-ordered only where necessary. They are not project stages.

### FI-01 — Production frontend foundation

Creates:

- fresh `web/` package and committed lockfile;
- React/TypeScript/Vite boot;
- composition root;
- MUI provider/theme root;
- route shell;
- Vitest/Playwright configuration;
- oxlint/typecheck/build scripts;
- deterministic boundary checker;
- frontend CI/release commands.

Completion:

- `npm ci`, typecheck, lint, boundary check, empty smoke test and production build pass;
- no product/domain behavior is invented to fill the shell.

### FI-02 — Minimum vertical Knowledge path

Depends on FI-01.

Creates a useful production-structured vertical slice with mock data:

- Learning/Curation shell switch;
- one prepared target context;
- frontend Knowledge models;
- consumer-owned Knowledge query port;
- MockKnowledgeAdapter;
- Knowledge list/search/detail path;
- loading/empty/failure presentation patterns;
- route/context preservation;
- GraphRenderer contract + renderer-neutral GraphScene/GraphProjectionBuilder with a non-3D placeholder.

This is the first visible end-to-end slice and proves the architecture before importing experimental renderer code.

Completion:

- applicable FTD contracts for navigation/context, DTO-independent models and non-graph Knowledge access pass against mock adapters;
- no concrete graph package is imported outside the future graph adapter root.

### FI-03 — 3D renderer adapter

Depends on FI-02.

Creates `adapters/graph-rfg3d/**` and adapts eligible experimental renderer mechanics to the current GraphRenderer/GraphScene contract.

Completion:

- click-without-drag vs drag behavior passes FTD contract;
- camera/layout/force/library objects do not cross the renderer boundary;
- list/search/detail remains fully usable if WebGL/renderer is unavailable;
- experiment product fixtures/routes/state are absent from production modules.

### FI-04 — Learning workspace

Depends on FI-01 and shared frontend contracts from FI-02.

Implements accepted Learning Target Selection, Overview, Knowledge, Study and Statistics responsibilities against mock/consumer ports first.

Completion:

- accepted target context, Question -> Knowledge navigation, common states and recoverable failure behavior pass relevant FTD contracts;
- no curation mutation behavior is exposed from Learning.

### FI-05 — Curation workspace

Depends on FI-01 and shared frontend contracts from FI-02.

Implements accepted Targets, Knowledge, Requirements/RequirementSets, Questions and contextual Import Curation responsibilities.

Completion:

- editors/collections expose only accepted commands and machine outcomes;
- recoverable input state is preserved;
- Learning internals are not imported.

FI-04 and FI-05 may proceed in parallel after their shared contracts are stable.

### FI-06 — Production HTTP adapters and query cache

Depends on accepted consumer ports and the relevant feature surfaces.

Creates:

- versioned HTTP client boundary;
- adapter-private DTO definitions;
- DTO -> frontend-model mappers;
- TanStack Query integration;
- runtime-status integration;
- accepted success/conflict/validation/unavailable/partial/operational outcome translation.

Mock adapters remain available for deterministic tests and local evidence.

Completion:

- mock/HTTP substitutability and machine-outcome mapping FTD contracts pass;
- feature modules are unchanged by provider selection except composition wiring;
- no client-only filtering over arbitrary partial server pages is introduced.

### FI-07 — Verification evidence and deployable frontend

Depends on all selected production slices.

Completes:

- browser E2E scenarios;
- keyboard/focus/non-graph access evidence;
- Presentation Verification evidence;
- 3D-vs-baseline task evidence;
- Docker frontend image;
- authoritative frontend release gate;
- cleanup of prototype-only diagnostics/settings not accepted as product behavior.

Completion is the full checklist in the final section below.

## Experimental 3D reuse policy

The branch `experiments/knowledge-representation-3d` is evidence/donor code only.

| Experimental asset | Disposition | Production rule |
|---|---|---|
| `R2GraphSpike.tsx` | EXTRACT/ADAPT ONLY | Never copy as production component. Extract renderer-local mechanics into `graph-rfg3d`; discard mixed MUI shell, fixtures, Storybook tuning and old semantic state. |
| click-without-drag / drag tracking inside spike | ADAPT | Move behind GraphRenderer adapter; emit only canonical node activation after completed click. |
| camera fit/focus/orbit damping/inertia mechanics | ADAPT | Keep renderer-local; expose only accepted commands/opaque viewport state. |
| idle pause/resume + renderer diagnostics mechanics | ADAPT | Keep adapter-local; diagnostics remain non-product evidence unless separately accepted. |
| `r2GraphConfig.ts` | ADAPT | Keep camera/physics/renderer tuning under adapter. Move reusable presentation roles/colors/spacing to current theme/Presentation System realization. |
| `r2InstancedNodeRenderer.ts` | ADAPT CANDIDATE | Replace PaymentGraph types with renderer-neutral GraphScene node projections. |
| `r2InstancedInteractionLayer.ts` | ADAPT CANDIDATE | Preserve performance/interaction technique only; no experimental semantic model leakage. |
| `r2BatchedLinkRenderer.ts` | ADAPT CANDIDATE | Consume accepted GraphScene edges; relation meaning comes from canonical projection. |
| `r2DensityFixture.ts` | TEST-ONLY ADAPT | May become a synthetic renderer performance fixture; never production Knowledge truth. |
| `R2GraphSpike.stories.tsx` | REWRITE | Reuse scenario ideas only. New stories/tests reference current GraphRenderer/KnowledgeExplorer contracts and FTD verification intent. |
| `KnowledgeCardDetail.tsx` | REWRITE | Current detail uses KnowledgeNodeModel/accepted Screen/View responsibilities; old concept-card semantics are not copied. |
| `paymentGraphFixture.ts` and payment-specific fixtures | DISCARD FROM PRODUCT | Optional synthetic test data only after removing old semantic assumptions. |
| `knowledgeGraphSnapshot*` | DISCARD FROM PRODUCT | External Knowledge Graph snapshot shape is not the Prep frontend model. |
| `sync-knowledge-graph.mjs` | DISCARD | Production data comes from Mock/HTTP adapters, not a repository-sync script. |
| experiment MUI theme / CSS | EVIDENCE ONLY | Current Presentation System + centralized production theme own visual roles. |
| experiment `package.json` / `package-lock.json` | VERSION EVIDENCE | Create fresh production package; use tested versions as candidates and pin the accepted set in the new lockfile. |

Any donor file that still imports experimental PaymentGraph/KnowledgeGraphSnapshot semantics after adaptation is not eligible for production reuse.

## Test realization

Map `docs/verification/frontend-test-design.yaml` contracts as follows:

- Vitest: pure model/projection/mapper/adapter contracts, import-boundary helpers and renderer-neutral behavior where browser rendering is unnecessary;
- Vitest browser/component tests: component/view state and renderer adapter contracts requiring DOM/browser APIs;
- Playwright: cross-view routing, keyboard/focus, common states and end-to-end user-visible contracts;
- Storybook: optional rendered evidence and manual/automated presentation review, but not the only correctness gate.

Do not use exact force coordinates, provider component trees, CSS class names or private React state as oracles.

## Authoritative frontend gate

The production frontend gate is reproducible from versioned repository inputs.

At minimum CI must run from `web/`:

```text
npm ci
npm run typecheck
npm run lint
npm run check:boundaries
npm run test
npm run build
npm run test:e2e
```

A convenience `npm run check` may compose the fast deterministic subset, but the authoritative PR/release gate remains CI.

Storybook build and renderer performance diagnostics may be additional evidence. They are not correctness gates unless a later accepted verification obligation makes them mandatory.

## Build and delivery

The frontend Docker build consumes the committed `package-lock.json` with `npm ci` and produces static browser assets.

A multi-stage container may use a Node build stage plus a minimal static-serving runtime. The exact static server image is implementation-local unless deployment constraints make it architecture-significant; pin the selected image/version in Docker/lock configuration.

The frontend container contains no canonical mutable business data.

### Release

Release evidence requires:

- authoritative frontend CI gate green;
- reproducible Docker image build from committed inputs;
- image/version identity recorded by the deployment mechanism;
- no uncommitted generated frontend source required for supported behavior.

### Rollback

Frontend rollback is redeployment of the previously accepted frontend image/artifact.

No frontend data migration or rollback transaction exists in this scope because canonical durable data is backend-owned.

If a future frontend release requires a backend contract transition that is not backward compatible, that compatibility/rollout decision must be accepted upstream before implementation.

## Configuration

Application composition selects Mock or HTTP adapters explicitly.

Production configuration may provide backend endpoint/runtime configuration through the accepted deployment mechanism, but secrets and Anki configuration do not become browser-editable product state.

Do not hard-code local-only Docker hostnames into feature code. Transport endpoint mechanics stay inside composition/config + HTTP adapter boundaries.

## Completion criteria

Production frontend implementation is complete only when all of the following hold:

1. `FRONTEND-IMPLEMENTATION` is structurally COMPLETE under the pinned Harness.
2. Engineering Coverage reports `completion_ready=true`, zero remaining work and no blocking Questions.
3. Strict semantic/currentness closure is COMPLETE for the production Consumer.
4. The production `web/` package uses a committed lockfile and reproducible `npm ci` environment.
5. TypeScript, lint, architecture-boundary checks and production build pass.
6. Every applicable FTD Test Design contract is implemented and green.
7. Frontend Verification obligations have concrete evidence, including presentation evidence required by PV checks.
8. Product behavior is traceable to accepted Screen/View/Machine contracts; provider capability has not introduced extra product behavior.
9. Raw HTTP DTOs remain confined to HTTP adapters.
10. `react-force-graph-3d` / Three.js imports remain confined to the graph adapter.
11. Learning and Curation feature internals remain independent.
12. Mock and HTTP adapters satisfy the same consumer-owned contracts.
13. Knowledge list/search/detail remains usable without graph manipulation.
14. The 3D renderer uses canonical GraphScene identity/relation semantics and keeps coordinates/physics/camera state noncanonical.
15. MUI types do not become public domain/application/feature-port contracts.
16. No old graph-first routes, PaymentGraph semantics, Storybook tuning controls or legacy source-sync machinery enters production behavior.
17. Frontend Docker image builds reproducibly and rollback to the prior image is possible without data migration.
18. Any implementation-discovered semantic gap has been routed back to its owning Authority rather than silently decided in code.

## Explicit implementation freedoms

Coding agents remain free to choose:

- private React component decomposition;
- function vs hook vs small class representation;
- local helper names;
- exact test-file placement within the declared roots;
- CSS technique inside accepted provider/theme boundaries;
- internal TanStack Query key construction;
- private mapper/helper decomposition;
- exact static-server runtime image;
- renderer tuning values that do not become accepted usability/performance semantics.

These choices do not require upstream design changes unless they alter public contracts, ownership, dependency direction or observable behavior.

## Harness semantic acceptance

This artifact satisfies the `implementation-design` review intent:

- **implementation-not-upstream-owner** — all slices and choices realize accepted upstream contracts without redefining them;
- **implementation-slices-explicit** — FI-01 through FI-07 are bounded, dependency-ordered realization slices with completion criteria;
- **repository-realization-derived-from-accepted-boundaries** — physical module roots, adapters, provider mapping, tests and enforcement directly realize Frontend System Architecture, Engineering Policy, Component Design, Verification and Test Design.
