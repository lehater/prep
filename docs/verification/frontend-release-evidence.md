# Frontend Release Evidence

## Status and role

This document is implementation/release evidence for FI-07. It is not a canonical semantic artifact and is intentionally not registered in `.harness/core.yaml`.

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
