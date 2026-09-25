# Frontend Production Implementation

## Goal

Implement the canonical production frontend in dependency order without reopening accepted product/domain/interface semantics inside code.

Authority: `docs/implementation/frontend-implementation-design.md` plus its declared upstream canonical frontend artifacts.

## Constraints

- Work only in `research/problem-space-revalidation`.
- Do not merge or squash into `main` without explicit user authorization.
- Treat FI-01..FI-07 as implementation slices, not Harness stages/gates.
- Route any discovered semantic/ownership/dependency change back to the owning Authority before continuing that affected slice.
- Keep MUI replaceable and keep transport/renderer provider types behind their adapters.
- Prove FI-02 on mock adapters before production 3D renderer adoption.

## Execution

- [x] FI-01 — production frontend foundation.
- [x] FI-02 — minimum vertical Knowledge path.
- [x] FI-03 — 3D renderer adapter.
- [x] FI-04 — Learning workspace.
- [x] FI-05 — Curation workspace.
- [x] FI-06 — HTTP adapters and query cache.
- [x] FI-07 — verification evidence and deployable frontend.

## FI-01 scope

- fresh `web/` package with Node 24 / npm;
- React 19 / TypeScript 6 / Vite 8 boot;
- composition root, AppShell and routing skeleton;
- MUI ThemeProvider through `src/ui/theme`;
- Vitest, Playwright and oxlint;
- deterministic source-boundary checker with checker self-tests;
- production build and Dockerfile;
- CI commands based on `npm ci`;
- committed production `package-lock.json`.

## FI-01 validation

Verified by the FI-01 bootstrap workflow with Node 24, frontend unit/browser/build/container checks, Prep validators, strict semantic baseline and pinned Harness integration.

## CI cadence

Implementation feedback is intentionally tiered to avoid repeating expensive proof on every commit:

- non-`main` pushes that touch `web/**` run `frontend-fast`: reproducible install + typecheck + lint + boundary checks + Vitest;
- a newer push cancels an obsolete in-progress fast run for the same branch;
- pull requests to `main`, pushes to `main`, and manual validation are merge-candidate checkpoints;
- merge-candidate validation always runs repository/Harness checks;
- `frontend-full` runs at a merge-candidate checkpoint only when `web/**` or frontend CI rules changed, and adds production build + Playwright + Docker evidence;
- `test:e2e` assumes an already-built frontend so the host production build is not repeated inside the same full check.

During an FI slice, use targeted local tests while coding, rely on `frontend-fast` for branch-level feedback, and run the full merge-candidate validation only at a coherent slice checkpoint or before integration.

## FI-02 scope

- explicit Learning/Curation shell switch with one prepared LearningTarget context;
- target-scoped and global `KnowledgeScope` realization without changing canonical Knowledge identity;
- frontend-owned Knowledge models plus `KnowledgeQueryPort` and `TargetQueryPort`;
- `MockKnowledgeAdapter` / `MockTargetAdapter` as composition-root providers;
- server-style list/search by explicit scope, readable detail and non-graph keyboard access;
- loading, empty, unavailable and recoverable-failure presentation paths;
- URL-owned search/filter/selection/focus state so readable detail open/close preserves exploration context;
- renderer-neutral `GraphScene` / `buildGraphScene` projection and injected `GraphRenderer` contract;
- non-3D placeholder renderer only; no `react-force-graph-3d` or Three.js adoption before FI-03.

## FI-02 validation

The coherent FI-02 checkpoint at `16325a898233a8eeea32449accee167a2eb8b690` passed:

- TypeScript, oxlint and deterministic source-boundary checks;
- 4 Vitest files / 7 tests, including mock-port, route-context and graph-projection contracts;
- production Vite build;
- 4 Playwright browser tests covering shell boot, mode switching, target-context preservation, keyboard list/detail access, empty state and renderer-neutral fallback;
- production Docker image build;
- strict semantic baseline: 29/29 CURRENT-capable;
- pinned Harness integration with `FRONTEND-IMPLEMENTATION` COMPLETE, Engineering Coverage `completion_ready=true`, zero remaining work/questions, and strict semantic/currentness COMPLETE;
- documentation, architecture, question-bank validators and 28 Python unit tests.

No frontend semantic/ownership/dependency change was required during implementation, so no upstream Authority was reopened.

## FI-03 scope

- pinned `react-force-graph-3d@1.29.1`, `three@0.180.0` and matching `@types/three`;
- concrete provider imports confined to `src/adapters/graph-rfg3d/**`;
- renderer-private graph-data mapping so provider coordinates/forces/Three.js objects cannot mutate or escape into `GraphScene`;
- explicit relation direction/type through directional arrows and relation labels;
- semantic node identity preserved while layout geometry remains adapter-owned;
- deterministic click-without-drag versus drag gesture boundary using the experiment's proven pointer-threshold approach;
- drag mutates presentation coordinates only and never emits semantic activation;
- WebGL2 preflight and runtime error boundary with list/search/detail still available;
- opaque renderer-family viewport snapshots represented only as numeric camera/target data;
- trackball damping plus idle/visibility pause behavior adapted from experiment evidence to avoid permanent rendering load;
- no experimental PaymentGraph fixtures, routes, Storybook state ownership, instanced nodes or batched-link layers imported into production.

## FI-03 validation

The coherent FI-03 checkpoint at `6750bb491013f90dee2c78cc44ce1c9054ac6354` passed:

- TypeScript, oxlint and deterministic provider-boundary checks;
- 6 Vitest files / 12 tests, including renderer semantic-isolation and click-vs-drag contracts;
- production Vite build;
- 4 Playwright browser tests with the real RFG3D adapter or its WebGL fallback while non-graph Knowledge access remains usable;
- production Docker image build;
- npm audit: 0 vulnerabilities;
- strict semantic baseline: 29/29 CURRENT-capable;
- pinned Harness integration with `FRONTEND-IMPLEMENTATION` COMPLETE, Engineering Coverage `completion_ready=true`, zero remaining work/questions, and strict semantic/currentness COMPLETE;
- documentation, architecture, question-bank validators and 28 Python unit tests.

No upstream Authority was reopened. The historical experiment remains implementation evidence only.

## FI-04 scope

- prepared LearningTarget search/selection with no Learning-side target mutation;
- persistent target context with Overview, Knowledge, Study and Statistics sections;
- read-only Requirement/RequirementSet scope plus exact current Knowledge/Question material counts;
- consumer-owned Target, Question, Study and Learning Statistics ports with mock adapters;
- target Question browse/detail plus Question -> Knowledge navigation preserving the target and focusing every aligned canonical Knowledge id;
- Study Set build, exact inspected preview, materialization-token export, partial/conflict/unavailable/failure outcomes and retry/rebuild context preservation;
- factual ReviewObservation aggregates/history plus explicit user-triggered review sync, with no mastery/readiness/retention inference;
- Machine Interface collection result refinement to expose exact `total_count` for the current semantic query/scope while keeping opaque cursor representation transport-private.

## FI-04 validation

FI-04 completion evidence is intentionally split to avoid repeating expensive checks after a selector-only browser-test repair:

- repository/Harness checkpoint `2107fef0360532393c4f33623086990c274bcc32` proved the implementation and the initial Machine Interface refinement against repository validators;
- frontend recheck `0b2277ff8c979efb6f42c6d83dbfa38b88654f3f` passed typecheck, oxlint, deterministic boundary checks, 9 Vitest files / 19 tests, production Vite build, 9 Playwright browser tests, Docker build and npm audit with zero vulnerabilities;
- the Machine Interface acceptance identity change was propagated through its Engineering Graph dependency frontier: 16 affected capability reviews were explicitly revalidated, with downstream Verification/Test/Implementation contracts clarified where `total_count` crosses the adapter boundary;
- lifecycle recheck `66628a1c261a9ee17ddce11299c14f447f76b03b` passed strict semantic baseline with 29/29 CURRENT-capable lifecycle assertions, pinned Harness integration with `FRONTEND-IMPLEMENTATION` COMPLETE and `completion_ready=true`, documentation/architecture/question validators and all 28 Python tests.

No Learning implementation exposes Curation mutation behavior. The only upstream semantic change was the accepted collection-count contract needed by the already-canonical Overview responsibility; dependent capabilities were revalidated rather than silently left current.

## FI-05 scope

- dedicated Curation-owned frontend models and consumer ports for LearningTargets, Knowledge mutation, Requirements/RequirementSets, Questions and prepared-data Import; no Curation dependency on Learning internals;
- one composition-root mock state shared by Curation and learner/query adapters so accepted Curation mutations are observable through the same canonical Learning/Knowledge identities;
- learner material is derived from the current target -> Requirement/RequirementSet -> Knowledge -> Question chain rather than frozen target fixture lists;
- Targets collection/editor with search, create/update, Requirement/RequirementSet scope composition and Preview in Learning;
- Knowledge collection/graph plus create/update, semantic-kind editing, typed relation add/remove and contextual Import;
- Requirements/RequirementSets collection/editors with definition/content ownership, deterministic display labels, Requirement-to-Knowledge alignment and acyclic RequirementSet membership;
- Questions collection/editor with accepted structural aligned/unaligned filtering, direct-answer editing and explicit Knowledge alignment;
- contextual prepared-data document intake with aggregate/item outcomes, validation preservation and representative typed KnowledgeRelation import behavior;
- recoverable validation/operation feedback preserves current input/editor context;
- no mastery/readiness/coverage-grade semantics introduced by Curation.

## FI-05 validation

FI-05 used tiered validation so expensive proof was not repeated after every implementation commit:

- data-boundary and UI iterations used the permanent `frontend-fast` path; the final semantic-alignment fast run passed after deriving learner material from current Curation state and removing the unaccepted independent Requirement title field;
- repository/Harness checkpoint `846307c5b1c0719536b3c3e4769364ec9c73eea8` passed strict semantic baseline with 29/29 CURRENT-capable lifecycle assertions, pinned Harness integration with `FRONTEND-IMPLEMENTATION` COMPLETE and `completion_ready=true`, documentation/architecture/question validators and all 28 Python tests;
- no canonical product/domain/interface/architecture knowledge changed during the later code-only FI-05 fixes, so the repository/Harness semantic checkpoint remained applicable and was not rerun;
- final frontend recheck `f28791c82332b36e49c91add3fb52315cd770c04` passed typecheck, oxlint, deterministic boundary checks, 10 Vitest files / 25 tests, production Vite build, all 15 Playwright browser tests, Docker build and npm audit with zero vulnerabilities.

Semantic audit before completion corrected three implementation defects rather than promoting them into authority: lost operation feedback after Knowledge detail refresh, frozen learner material that ignored Curation scope/alignment changes, and an independently editable Requirement title absent from the accepted Requirement contract.

## FI-06 scope

- pinned `@tanstack/react-query@5.103.2` behind the HTTP data-access boundary, with query keys based on Machine Interface operation identity plus semantic input;
- versioned `HttpOperationClient` that executes accepted Machine Interface operation IDs while keeping concrete HTTP path/verb and cache mechanics implementation-local;
- adapter-private DTO definitions and runtime-validating DTO -> frontend-model mappers; incompatible enum/relationship representation becomes frontend failure rather than silent coercion;
- exact collection `total_count` preserved as consumer-owned `totalCount`, while opaque `next_cursor` is validated and terminated inside the HTTP boundary;
- production HTTP implementations for Learning Target, Knowledge, Question, Study, Statistics, Curation Target/Knowledge/Requirement/Question/Import and external-runtime status ports;
- accepted machine outcomes translated into existing frontend-owned success/not-found/validation/conflict/unavailable/partial/failure states, including semantic envelopes returned with non-2xx HTTP status;
- successful mutations invalidate cached machine reads coarsely and safely; recoverable non-success query outcomes are not retained as reusable cached success;
- composition-root-only provider selection between mock and HTTP implementations through `VITE_PREP_DATA_PROVIDER` / `VITE_PREP_API_BASE_URL`;
- shell runtime-status affordance backed by the accepted `integration.external_runtime.status.get` operation;
- production Docker build defaults to the HTTP provider while deterministic host/browser evidence retains the mock provider;
- Knowledge list input narrowed to the already-accepted single active `semantic_kind`, avoiding client-side union/filtering of arbitrary partial server pages.

## FI-06 validation

The coherent FI-06 checkpoint at `6447acd92ef0fecd26a0f69f5a6b18b8fca8ab75` passed:

- TypeScript, oxlint and deterministic source-boundary checks;
- 11 Vitest files / 32 tests, including DTO identity/`total_count`, cursor isolation, mock/HTTP substitutability for Knowledge/Target/Question/runtime status, cache invalidation, accepted machine-outcome translation, partial external failure and incompatible-semantic rejection;
- production Vite build;
- all 15 Playwright browser tests, including the shell external-runtime status affordance;
- production Docker image build with the HTTP provider as the container-build default;
- npm audit: zero vulnerabilities;
- strict semantic baseline: 29/29 CURRENT-capable;
- pinned Harness integration with `FRONTEND-IMPLEMENTATION` COMPLETE, Engineering Coverage `completion_ready=true`, zero remaining work/questions, and strict semantic/currentness COMPLETE;
- Frontend UX closure ACCEPTED with 19 topology views and Frontend Test Design ACCEPTED with 13 executable contracts;
- documentation, architecture, question-bank validators and all 28 Python tests.

The FI-06 implementation did not change canonical product/domain/interface/architecture meaning. Concrete HTTP serialization/routing, query-key construction and coarse cache invalidation remained implementation freedoms; the single-kind Knowledge query shape was aligned to the existing Machine Interface rather than reopening that Authority.

## FI-07 scope

- close every applicable Frontend Verification / Frontend Test Design / Presentation Verification obligation with concrete implementation evidence rather than new semantics;
- add a real Tab/Enter-only Knowledge browser scenario with visible-focus assertions;
- add an HTTP-provider browser scenario for loading, loaded, empty, recoverable operational failure/retry/context preservation and external-runtime unavailable/recovery states;
- preserve the permanent authoritative release gate while adding dependency audit and image identity verification;
- pin Node/nginx container bases by immutable digest and record the frontend commit identity in an OCI image label;
- record neutral 3D-vs-list task evidence, explicitly separating automated correctness/action-count proxies from unmeasured human time/disorientation;
- audit and remove prototype-only diagnostics/settings/Storybook/PaymentGraph/snapshot-sync residue from the production module inventory;
- keep `Q-KNOWLEDGE-GRAPH-3D-VALUE` unresolved because current evidence does not establish a human task-performance advantage.

## FI-07 validation

The final FI-07 checkpoint at `260a614df945164f51f7f72474e9007a99339412` (workflow run `36197719886`) passed:

- permanent `frontend-fast` on the same commit passed reproducible install, typecheck, oxlint, deterministic source-boundary checks and Vitest;
- 11 Vitest files / 32 tests passed;
- npm audit reported zero vulnerabilities;
- production Vite build passed;
- 17/17 Playwright browser tests passed across mock-provider and production-HTTP-provider projects, including real Tab/Enter-only Knowledge access with `:focus-visible` assertions and deterministic server-backed loading/loaded/failure-retry/empty/runtime-unavailable states;
- digest-pinned production Docker image built successfully and embedded OCI revision `260a614df945164f51f7f72474e9007a99339412`; built image id was `sha256:3c3d1e4fafbfbaa4a28705e95e6a9bd89ef77d42851664ae99fee215180d3d7a`;
- strict semantic baseline passed with 29/29 CURRENT-capable lifecycle assertions;
- Frontend UX closure remained ACCEPTED with 19 topology views and Frontend Test Design remained ACCEPTED with 13 executable contracts;
- pinned Harness integration reported `CURRENT-REVALIDATION`, `FRONTEND-PROTOTYPE` and `FRONTEND-IMPLEMENTATION` COMPLETE; `FRONTEND-IMPLEMENTATION` Engineering Coverage remained `completion_ready=true`, `remaining_work=0`, `questions=0`, with strict semantic/currentness COMPLETE;
- documentation validation passed for 158 Markdown files, architecture validation passed, question-bank validation passed, and all 28 Python tests passed;
- production-tree residue audit found no PaymentGraph, KnowledgeGraphSnapshot/source-sync, Storybook tuning, diagnostics/settings workspace or experiment-named production module.

FI-01 through FI-07 are complete on this branch. The 3D renderer remains a first-class but non-exclusive presentation hypothesis: current automated evidence proves semantic correctness and equivalent canonical access, but does not establish a human task-performance advantage, so `Q-KNOWLEDGE-GRAPH-3D-VALUE` remains intentionally unresolved.
