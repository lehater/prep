# Frontend Release Evidence

> **Status: FRC-01 COMPLETE.** The pre-FRC-01 FI-07 material below remains historical context. Current code/CI evidence plus physical GPU qualification satisfy the revised responsive, graph-control, semantic-preservation, stress, idle-resource and ordinary 2k/10k performance obligations.

## Status and role

This document records implementation/release evidence originally produced for FI-07. It is not a canonical semantic artifact and is intentionally not registered in `.harness/core.yaml`.

The accepted obligations remain owned by:

- `docs/verification/presentation-verification.md`;
- `docs/verification/frontend-verification.md`;
- `docs/verification/frontend-test-design.yaml`;
- `docs/implementation/frontend-implementation-design.md`.

This evidence records how the production `web/` realization satisfies those obligations without promoting tests, providers, rendered details or release mechanics into product/domain/interface truth.

## Frontend Verification evidence

| Check | Concrete evidence |
|---|---|
| FV-01 Product capability traceability | Production routes/actions are limited to the accepted Learning/Curation shell, target workspace sections, Curation entity workspaces, contextual Import and runtime status in `web/src/app/routing/AppRouter.tsx` plus the corresponding feature views. No Settings, graph-only product route, diagnostics workspace or provider-created product command exists in the production route tree. |
| FV-02 Accepted functional/view behavior | `web/e2e/learning.spec.ts`, `curation.spec.ts`, `knowledge.spec.ts`, `foundation.spec.ts` and `http-states.spec.ts` exercise representative Learning/Curation navigation, target context, Knowledge list/search/detail, Question -> Knowledge, Study/Statistics, Curation editing/import, runtime status and accepted material states. |
| FV-03 Machine-contract mapping fidelity | `web/src/adapters/http/HttpAdapters.test.ts` proves canonical identity, exact `total_count`, cursor isolation, semantic outcome mapping, partial external failure, invalid DTO rejection and cache invalidation; HTTP adapter source uses only accepted Machine Interface operation IDs. |
| FV-04 Frontend dependency direction | `web/scripts/check-boundaries.mjs` + self-tests reject feature -> adapter, Learning <-> Curation, renderer-provider leakage, DTO leakage, provider imports in model/ports/projection and shared-UI -> feature-state edges. |
| FV-05 Transport DTO isolation | DTO declarations/mappers live only under `web/src/adapters/http/**`; the boundary checker rejects DTO imports outside that root; mapper tests prove identity/semantic/count preservation. |
| FV-06 Renderer isolation | `nodeGesture.test.ts`, `rendererGraphData.test.ts`, `graphScene.test.ts` and the renderer import boundary prove click-vs-drag, semantic isolation, direction/type preservation and noncanonical geometry ownership. |
| FV-07 Mock / HTTP substitutability | `HttpAdapters.test.ts` applies equivalent consumer contracts to Knowledge, Target, Question and runtime-status mock/HTTP realizations. |
| FV-08 State ownership and lifetime | Route-state tests, Learning route tests, Study flow tests and browser target/detail context tests demonstrate ownership by router/feature/renderer boundaries without a general-purpose mutable global store. |
| FV-09 Presentation evidence closure | The Presentation Verification section below records pattern, provider, theme, keyboard/non-graph and 3D-vs-baseline evidence. |
| FV-10 Upstream-change revalidation | The permanent repository gate runs strict semantic baseline + pinned Harness integration before integration; FI checkpoints revalidate affected canonical baselines rather than treating code as authority. |

## Frontend Test Design trace

| Test contract | Executable evidence |
|---|---|
| FTD-MODE-WORKSPACE-NAVIGATION | `learning.spec.ts: selects a prepared target and preserves it across learner sections`; `knowledge.spec.ts: switches explicit Learning and Curation Knowledge contexts`; `curation.spec.ts: Curation exposes accepted sections without Learning editing internals`. |
| FTD-TARGET-CONTEXT-PRESERVATION | `knowledge.spec.ts: preserves target search context while readable detail opens and closes`; `explorerRouteState.test.ts`. |
| FTD-QUESTION-TO-KNOWLEDGE | `learning.spec.ts: Question to Knowledge navigation preserves target and focuses all alignments`; `learningRoutes.test.ts`. |
| FTD-RECOVERABLE-FAILURE-PRESERVES-CONTEXT | `curation.spec.ts` validation/cycle cases; `studyFlow.test.ts`; HTTP-rendered retry in `http-states.spec.ts`. |
| FTD-MACHINE-OUTCOME-MAPPING | `HttpAdapters.test.ts: maps accepted validation, conflict, unavailable and operational outcomes...` plus partial-external-failure case. |
| FTD-FORBIDDEN-DEPENDENCY-EDGES | `scripts/check-boundaries.mjs` and `check-boundaries.test.mjs`. |
| FTD-DTO-MAPPING-IDENTITY | `HttpAdapters.test.ts: preserves canonical Knowledge identity and exact total_count while hiding cursor representation`. |
| FTD-RENDERER-CLICK-VS-DRAG | `adapters/graph-rfg3d/nodeGesture.test.ts`. |
| FTD-RENDERER-SEMANTIC-ISOLATION | `rendererGraphData.test.ts` + `features/knowledge-explorer/projection/graphScene.test.ts`. |
| FTD-MOCK-HTTP-SUBSTITUTABILITY | `HttpAdapters.test.ts` equivalence cases for Knowledge/Target/Question/runtime status. |
| FTD-KEYBOARD-KNOWLEDGE-ACCESS | `knowledge.spec.ts: completes core Knowledge access with keyboard interaction only`; it reaches Search, list item and Close detail via Tab/Enter and asserts `:focus-visible`. |
| FTD-GRAPH-FALLBACK-EQUIVALENCE | `knowledge.spec.ts: keeps a non-graph empty-state path...`; `graphScene.test.ts` preserves the same canonical node/relation identity independently of geometry. |
| FTD-COMMON-VIEW-STATES | `http-states.spec.ts` renders Target Selection loading, loaded, operational failure + retry/context preservation, empty and external-runtime unavailable/recovered states through the production HTTP provider; Curation browser tests cover validation-rejected and cycle conflict/recovery. |

## Presentation Verification evidence

### PV-PATTERN-CONSISTENCY

The production frontend uses one shared feedback/state pattern boundary, `web/src/ui/patterns/ViewState.tsx`, for repeated loading/empty/failure treatment across Learning, Knowledge and representative Curation collections. Curation operation-result messages use the same MUI Alert family where the state is operation-specific rather than a collection/view state.

Rendered browser coverage includes:

- Learning: Target selection/Overview/Knowledge/Study/Statistics;
- Curation: Targets/Knowledge/Requirements/Questions/Import;
- HTTP-rendered Target Selection: loading, loaded, failure/retry and empty;
- global external runtime: unavailable -> retry -> reachable.

The obligation is consistency of role meaning, not pixel identity.

### PV-PROVIDER-NEUTRALITY

Representative provider-backed controls trace to accepted Screen/View responsibilities:

| Production control | Accepted responsibility |
|---|---|
| Learning/Curation navigation | F-00 Application shell |
| Target search/open | L-01 Target Selection |
| Knowledge search/kind/relation/focus/detail | L-03 and C-21/C-22 Knowledge responsibilities |
| Build/Export Study Set | L-04 Study |
| Sync reviews | L-05 Statistics |
| Curation create/update/alignment/membership/import actions | C-11..C-42 and contextual Import responsibilities |
| Anki status/retry | F-00 secondary runtime-status affordance |

MUI contributes rendering primitives only. No MUI-only feature such as provider-specific sorting, paid grid behavior or hidden settings becomes a Prep command.

### PV-THEME-COHERENCE

There is one application `ThemeProvider` in `FrontendApp.tsx` and one production theme boundary in `src/ui/theme/appTheme.ts`. Feature-local MUI primitives consume that single theme rather than declaring competing global themes. Shared view-state roles are centralized under `src/ui/patterns`.

The accepted Presentation System deliberately leaves exact palette, font family and spacing values unconstrained, so the default provider token values are implementation details rather than missing semantics.

### PV-ACCESSIBILITY-BASELINE

Evidence:

- core Knowledge access has an actual Tab/Enter-only Playwright flow;
- the test asserts browser `:focus-visible` on the focused Search, Knowledge item and Close-detail controls;
- list/search/detail remains available with the 3D renderer present or unavailable;
- semantic kinds/relation types and operation states are expressed by readable labels/text, not color alone;
- normal buttons/links/selects/text fields retain native/provider keyboard semantics.

### PV-GRAPH-TASK-VALUE

The 3D projection is evaluated against the non-graph baseline without claiming unmeasured human benefits.

| Representative task/data | Baseline correctness | Graph correctness | Effort/time evidence | Navigation error / disorientation evidence | Simpler representation under current evidence |
|---|---|---|---|---|---|
| Find and inspect `Linux cgroups` | Browser test completes search -> list activation -> readable detail and relation text with keyboard only. | Renderer contract can activate the same canonical node id; geometry is not needed for identity. | Deterministic baseline interaction sequence is exercised. No valid human elapsed-time comparison has been collected. | Automated route/identity assertions: zero observed errors. Human disorientation was not measured. | List/search/detail for exact lookup. |
| Inspect `linux-cgroups —realizes→ resource-isolation` | Readable detail exposes source/type/target text. | GraphScene/renderer tests preserve source/type/target and directional presentation metadata independently of coordinates. | Exact relation inspection requires no spatial inference in the baseline. Human task time was not collected for either representation. | Automated semantic assertions pass; human viewpoint/occlusion errors were not measured. | Readable detail for exact semantic inspection; graph remains useful only as a visual context hypothesis. |
| Move from Question to all aligned Knowledge items | Each aligned canonical id remains accessible through normal Knowledge list/detail paths. | Question -> Knowledge Map deep-link focuses all aligned ids in the same target scope and the graph projection can show their local context. | Automated flow proves one accepted deep-link transition rather than repeated manual lookup. This is an interaction-count proxy, not a measured human time benefit. | Automated focus/route assertions: zero observed identity/navigation errors. Human disorientation was not measured. | Graph/focus may reduce repeated lookup for neighborhood overview, but material task-value superiority is not established. |

Result: current evidence supports keeping 3D non-exclusive and semantically replaceable. It does **not** resolve `Q-KNOWLEDGE-GRAPH-3D-VALUE`: no user-task timing or human disorientation study has established a material 3D advantage. That Question remains valid future evidence work rather than being silently answered by implementation.

## Deployable frontend evidence

The production frontend image is built from committed inputs with:

- Node build image pinned to `node:24.21.0-alpine@sha256:ebfe2f90462722a7a4de65e91990e97fe0d401c70e0e762c5b53302f905ec1c1`;
- nginx runtime image pinned to `nginx:1.28.0-alpine@sha256:30f1c0d78e0ad60901648be663a710bdadf19e4c10ac6782c235200619158284`;
- committed npm lockfile and `npm ci`;
- production HTTP provider as the container-build default;
- OCI `org.opencontainers.image.revision` label supplied from the release/CI Git SHA;
- authoritative `Validate` workflow building/tagging the image by commit SHA and verifying the embedded revision identity.

Rollback remains redeployment of a previously accepted image. The frontend owns no canonical durable business data, so frontend rollback requires no data migration transaction.

## Prototype-only residue audit

Production `web/` inventory contains no file/module path matching:

- PaymentGraph;
- KnowledgeGraphSnapshot;
- repository Knowledge sync machinery;
- Storybook story/tuning controls;
- prototype diagnostics/settings workspace;
- experiment-named production module.

Direct inspection of the production router/composition/shell contains no graph-first route, diagnostics/settings product surface or experiment product semantics. The only `snapshot` terminology retained in the renderer is the accepted opaque `GraphViewportSnapshot` presentation contract.

The renderer provider remains confined to `adapters/graph-rfg3d/**`; transport DTOs remain confined to `adapters/http/**`.

## Final checkpoint

FI-07 was verified at commit `260a614df945164f51f7f72474e9007a99339412` by workflow run `36197719886`:

- repository/Harness validation: PASS;
- strict semantic baseline: 29/29 CURRENT-capable;
- Frontend UX closure: 19 topology views ACCEPTED;
- Frontend Test Design: 13 executable contracts ACCEPTED;
- `FRONTEND-IMPLEMENTATION`: COMPLETE, `completion_ready=true`, no remaining work/questions, strict semantic/currentness COMPLETE;
- frontend deterministic checks: PASS, 11 Vitest files / 32 tests;
- dependency audit: zero vulnerabilities;
- production build: PASS;
- browser verification: 17/17 Playwright tests;
- digest-pinned Docker build: PASS;
- OCI image revision check: PASS, revision `260a614df945164f51f7f72474e9007a99339412`;
- Docker image id: `sha256:3c3d1e4fafbfbaa4a28705e95e6a9bd89ef77d42851664ae99fee215180d3d7a`;
- repository validators: 158 Markdown files, architecture/question validation and 28 Python tests PASS.

This evidence closes FI-07 implementation verification. It does not convert `Q-KNOWLEDGE-GRAPH-3D-VALUE` into an answered semantic decision.

## Post-FI-07 responsive workspace evidence

Manual interface evaluation exposed an implementation-only presentation defect: the production shell retained a maximum container width, the Knowledge workspace distributed width too evenly across list/graph/detail, and the renderer imposed its own viewport-relative height. The result under wide desktop viewports was excessive unused horizontal space, an undersized graph canvas and unnecessary vertical extension.

The correction keeps accepted view semantics unchanged:

- the application shell now consumes the available viewport width with responsive edge padding;
- primary and Curation navigation collapse vertically only when the viewport requires it;
- the Knowledge workspace uses explicit responsive grid areas rather than equal flex columns;
- on wide desktop, list/detail remain bounded side regions and the graph consumes the remaining width;
- on tablet, list + graph remain side-by-side while detail moves below;
- on mobile, list -> graph -> detail becomes one column with no horizontal overflow;
- the graph renderer fills the layout area assigned by its consumer instead of imposing its own fixed `62vh` window;
- Curation Knowledge authoring/import controls were compacted without changing their responsibilities.

Executable evidence lives in `web/e2e/responsive-layout.spec.ts`. It verifies a 1920x1080 wide layout, a 1024x768 tablet reflow, a 390x844 mobile stack, graph/list/detail width relationships and absence of horizontal overflow.

Responsive browser checkpoint workflow run `36199163419` passed production Vite build and all 19 Playwright tests.

## FRC-01 renewed responsive/performance evidence

Checkpoint `240dc04f14f9b1a853aa3917e5a545989aa91b5f`, workflow run `36205548385`, verifies the revised frontend realization.

### Spatial and control realization

- Knowledge uses a graph-primary wide composition with bounded list/detail supporting panes.
- Compact layout keeps list + graph and moves supporting detail below.
- Narrow layout presents the graph first at full content width, followed by supporting list/detail regions without horizontal page overflow.
- Curation Knowledge keeps New/Import as compact on-demand actions; the selected Knowledge editor occupies the right detail pane rather than a permanent block below the graph.
- Toolbar includes semantic kind, multi-select relation filtering, focus/clear focus, Fit graph, Reset camera and Graph settings.
- Graph settings expose Auto / Quality / Performance plus advanced labels, arrowheads, particles, live-physics and node-detail degradation preferences.
- renderer-private instancing/batching strategy names are not exposed as product vocabulary.

### Renderer performance realization

The production `graph-rfg3d` adapter now supports:

- automatic/explicit optimized strategy selection;
- instanced node rendering;
- batched relation rendering;
- deterministic adapter-private initial geometry;
- reduced node detail/pixel ratio/effects in the Performance path;
- semantic-preserving arrow/label/physics degradation;
- demand-driven pause after settle/idle;
- Fit/Reset commands;
- renderer-private diagnostics for draw calls, triangles, WebGL identity, settle timing and idle state.

The same renderer-neutral `GraphScene` remains the source of canonical node/relation identity. Performance profiles do not mutate Knowledge ids, relation source/target/type, target/global scope or equivalent list/detail access.

### Automated evidence

- strict semantic baseline: **30/30 CURRENT-capable**;
- Frontend Test Design: **17 contracts ACCEPTED**;
- Vitest: **14 files / 41 tests PASS**;
- Playwright: **21/21 PASS**;
- dependency audit: zero vulnerabilities;
- build + production Docker + OCI revision identity: PASS;
- repository validators + **28 Python tests**: PASS.

### 1k / 2k / 5k stress evidence

GitHub runner evidence used:

`ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero)), SwiftShader driver)`

Therefore it validates the optimized stress path and idle behavior but **not** the hardware FPS requirement.

| Scene | Strategy | Draw calls | Triangles | Settle | Sampled software FPS | Idle |
|---|---|---:|---:|---:|---:|---|
| 1k nodes / 5k edges | optimized | 2 | 36,000 | ~5.25s | ~38.5 | paused |
| 2k nodes / 10k edges | optimized | 2 | 72,000 | ~5.34s | ~16.7 | paused |
| 5k nodes / 25k edges | optimized | 2 | 180,000 | ~5.52s | ~7.45 | paused |

### Hardware qualification — PASS

The strict hardware command was executed in a headed GPU-backed Chromium session after the launcher was corrected to reject Node versions other than 24, software WebGL, missing Linux graphical sessions and sub-30-FPS ordinary-envelope results.

Observed renderer:

`ANGLE (VMware Inc., SVGA3D; build: RELEASE; LLVM;, OpenGL ES 3.0)`

`softwareRenderer=false`.

| Scene | Strategy | Draw calls | Triangles | Settle | Sampled hardware FPS | Idle |
|---|---|---:|---:|---:|---:|---|
| 1k nodes / 5k edges | optimized | 2 | 36,000 | not required for acceptance | ~56.5 | paused |
| 2k nodes / 10k edges | optimized | 2 | 72,000 | ~5.48s | **~57.1** | paused |
| 5k nodes / 25k edges | optimized | 2 | 180,000 | ~5.48s | ~23.8 | paused |

The accepted ordinary 2k/10k hardware target of approximately 30 FPS or better is satisfied. The 5k/25k result is retained as stress evidence and does not violate the ordinary-envelope requirement.

FRC-01 physical qualification is complete.
