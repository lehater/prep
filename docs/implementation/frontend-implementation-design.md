# Frontend Implementation Design

## Purpose

Translate the rebuilt Prep frontend knowledge chain into bounded implementation work without reopening accepted Product, Interface, Architecture, Component or Verification decisions.

This artifact is an implementation plan, not authorization to merge or deploy. Production frontend changes begin only after this design is CURRENT and are performed against the accepted rebuilt chain.

## Implementation boundary

Implement the current frontend slice that realizes:

- root Learning / Knowledge / Curation work contexts;
- accepted topology views and Screen/View compositions;
- backend machine-operation access through frontend-owned contracts;
- textual Knowledge search/focus/detail/relationship traversal;
- selected local 3D Knowledge projection through the accepted renderer seam;
- Curation task surfaces and recovery semantics;
- accepted frontend verification/test contracts.

Excluded from this implementation:

- new product/domain semantics;
- learner mastery/readiness inference;
- semantic coverage scoring;
- numeric graph performance targets;
- browser-direct external-runtime integration;
- microfrontends;
- worker/remote-renderer architecture not justified by accepted evidence;
- redesign of accepted backend machine contracts;
- merge/deployment authorization.

## Repository realization

The accepted logical ownership maps to one frontend source root.

Exact existing project root names are resolved during coding against the repository build structure, but the following module ownership is normative:

```text
<frontend-source-root>/
  app/
    composition/
    work-context/

  features/
    learning/
      target/
      study/
      evidence/

    knowledge/
      explorer/
      textual/
      detail/
      curation-actions/
      projection/

    curation/
      targets/
      requirements/
      questions/
      import/
      diagnostics/

  shared/
    presentation/
      entity-task-surface/
      operation-feedback/
      contextual-disclosure/

  adapters/
    backend/
    knowledge-3d/

  verification/
    architecture-boundaries/
```

This is an ownership map, not a requirement for one file or directory per line.

### Composition root

One application composition root constructs:

- backend technical provider;
- Knowledge 3D projection provider;
- feature roots;
- root work-context state;
- shell/navigation composition.

Features do not create their own competing provider/composition roots.

### Generated/provider source

No generated source is required by the accepted design.

If implementation uses generated transport/provider artifacts, they stay inside the relevant adapter/provider boundary and are not imported as feature public models.

Generated/provider code must identify its regeneration/source mechanism where applicable.

## Implementation slices

### Slice I0 — Frontend boundary foundation

**Goal:** establish the smallest implementation skeleton needed for later vertical slices without rewriting user behavior yet.

Implement:

- application composition root;
- root WorkContext shell boundary;
- backend adapter/mapping boundary;
- consumer-facing feature contract shapes required by current slices;
- architecture/dependency boundary verification;
- renderer-neutral Knowledge projection value contract;
- 3D provider interface/seam with a no-renderer/test implementation.

Does not implement:

- full Learning/Curation screens;
- the production 3D donor integration;
- speculative shared UI frameworks.

**Completion evidence:**

- frontend can compose feature placeholders through the accepted root boundaries;
- feature code does not need raw transport or renderer types;
- structural dependency checks can detect forbidden provider leakage.

### Slice I1 — Knowledge semantic backbone

**Goal:** implement the semantic/accessibility path before spatial rendering.

Implement `V-KNOWLEDGE` with:

- global / target-relevant scope;
- backend-driven search/filter;
- textual result access;
- canonical focus;
- readable focused detail;
- explicit incoming/outgoing relationship type/direction;
- relationship traversal;
- renderer-neutral projection model generation;
- textual behavior when no 3D provider is active.

**Dependencies:** I0.

**Completion evidence:**

- FTD-02 textual Knowledge path passes with renderer unavailable;
- FTD-12 keyboard relation traversal passes;
- accepted scope/focus semantics are independent of spatial geometry.

### Slice I2 — 3D Knowledge donor integration

**Goal:** reuse the existing 3D experiment behind the accepted projection adapter without importing its product assumptions.

Implement:

- `ThreeDKnowledgeProjectionAdapter`;
- mapping from renderer-neutral projection model to donor renderer input;
- mapping of donor focus/relation interaction back to canonical Knowledge intents;
- renderer lifecycle/resource cleanup;
- projection failure → textual fallback;
- wide Knowledge composition with 3D as largest relational work region;
- narrow explicit 3D mode/disclosure;
- only accepted projection-local controls such as fit/reframe/reset where useful.

Remove or disable donor behavior that:

- owns navigation/product shell;
- invents Knowledge semantics;
- requires renderer-specific identity;
- exposes obsolete Performance/Quality tuning as product vocabulary;
- requires every node/relation to render simultaneously.

**Dependencies:** I1.

**Completion evidence:**

- FTD-03 focus parity passes;
- FTD-10 renderer failure isolation passes;
- wide/narrow presentation verification passes;
- renderer/provider imports remain inside the adapter boundary.

### Slice I3 — Learning vertical flow

**Goal:** implement the learner workflow end to end against accepted machine operations.

Implement:

- `V-LEARN-TARGET`;
- `V-LEARN-STUDY`;
- `V-LEARN-EVIDENCE`;
- active target continuity into target-scoped Knowledge;
- Study preview/build/export currentness and stale recovery;
- factual ReviewObservation display/sync states;
- accepted external-runtime failure/partial-failure presentation.

**Dependencies:** I0; target-scoped Knowledge transition consumes I1 when available but Learning target/study/evidence behavior does not depend on the 3D adapter.

**Completion evidence:**

- FTD-05 materialization fidelity passes;
- FTD-06 evidence facts-not-mastery passes;
- Learning/Curation mutation separation remains intact.

### Slice I4 — Curation core

**Goal:** implement intentional maintenance of reusable canonical data with context-preserving task surfaces.

Implement:

- `V-CURATE-TARGETS`;
- `V-CURATE-REQUIREMENTS`;
- `V-CURATE-QUESTIONS`;
- explicit Curation Knowledge mutation actions around the shared Knowledge feature;
- collection/search + focused edit composition;
- validation rejection/conflict recovery;
- RequirementSet membership and accepted alignments through machine operations.

**Dependencies:** I0; Knowledge alignment/focus interactions consume I1.

**Completion evidence:**

- FTD-04 mutation rejection/conflict passes;
- FTD-07 responsive Curation continuity passes;
- feature state remains local except accepted shared target/work context.

### Slice I5 — Import and diagnostics

**Goal:** complete remaining Curation topology.

Implement:

- `V-CURATE-IMPORT`;
- aggregate and item-level import outcomes;
- `V-CURATE-DIAGNOSTICS`;
- diagnostic → owning repair navigation while preserving implicated identity/context.

**Dependencies:** I4 for repair destinations.

**Completion evidence:**

- created/updated/duplicate-skipped/rejected outcomes remain distinguishable;
- no semantic coverage score or automatic repair is invented;
- diagnostic-to-repair navigation preserves accepted Curation context.

### Slice I6 — Verification closure and obsolete realization removal

**Goal:** prove the rebuilt frontend before removing obsolete realization paths.

Complete:

- all FTD contracts;
- frontend dependency/static checks;
- topology-to-screen subject checks;
- presentation/keyboard/responsive verification;
- quality non-gate inspection;
- full repository CI;
- removal of obsolete frontend paths/components only after their accepted replacement is evidenced.

**Dependencies:** I1–I5 as applicable.

This slice does not add behavior. It closes evidence and removes superseded realization.

## Slice dependency order

```text
I0 boundary foundation
 |
 +--> I1 Knowledge semantic backbone
 |      |
 |      +--> I2 3D donor integration
 |      |
 |      +--> I4 Curation core --> I5 Import/diagnostics
 |
 +--> I3 Learning vertical flow

I1..I5 --> I6 verification closure / obsolete realization removal
```

I2 does not block I3. A usable Learning frontend can progress while 3D adaptation is refined.

## Why this slicing

The plan deliberately separates Knowledge semantic access from the 3D donor.

This gives the donor a clear acceptance boundary:

- if integration works, existing implementation value is reused;
- if renderer adaptation fails, the product still has a correct Knowledge path;
- renderer problems cannot force the rest of the frontend back into graph-centered architecture.

A “3D first, then rebuild semantics around it” sequence is rejected because it would let implementation evidence re-own accepted interface architecture.

A one-shot whole-frontend rewrite is also rejected because it weakens verification/rollback boundaries without an accepted need.

## Provider/tooling realization

### Backend adapter

Implement one technical backend provider capable of satisfying the accepted consumer-facing feature contracts.

Do not create one runtime wrapper/object per machine operation merely for abstraction symmetry.

Mapping responsibilities:

- request input → machine operation representation;
- transport response → accepted semantic outcome/value;
- pagination/query metadata → frontend contract values.

### 3D provider

Implement the existing donor behind `KnowledgeProjectionPort`.

No donor provider type appears in:

- Learning feature;
- Curation feature;
- Knowledge semantic public state;
- test oracles outside adapter-specific integration tests.

### Dependency-boundary enforcement

Add a deterministic repository-owned architecture check to CI that verifies at minimum:

- renderer-provider imports are confined to the 3D adapter/provider area;
- transport-provider/raw machine representation imports are confined to backend adapter/mapping areas;
- no browser external-runtime client is introduced;
- feature modules do not create prohibited cross-feature cycles;
- shared presentation modules do not import feature mutation/state ownership.

The exact parser/lint package is an implementation freedom if it proves the same versioned rule deterministically and adds no runtime dependency.

### Test tooling

Use the repository’s selected frontend test/build environment to realize `FRONTEND-TEST-DESIGN`.

Do not add a second test framework solely because a test contract was introduced.

If an existing environment cannot express one required oracle, add the smallest compatible capability needed for that oracle rather than replacing the test stack wholesale.

## Migration / transition applicability

No independent migration/transition contract is applicable to the current frontend implementation scope.

The current `web/` code is implementation evidence, not a semantic baseline or a concurrently supported product contract. The rebuilt frontend remains one browser artifact: this plan introduces no data/schema migration, mixed-version coexistence window, irreversible intermediate production state, live dual-UI compatibility requirement or transition-specific runtime recovery protocol.

Implementation slices may replace internal modules incrementally inside the implementation branch because that improves bounded verification. That development sequencing is not a user-visible migration state and does not create a second canonical frontend.

Production merge/deployment remains outside this artifact's authority. If a future release introduces mixed-version coexistence, staged irreversible rollout, data/schema migration, live compatibility window or transition-specific rollback semantics, reopen Change/Transition Design before implementation invents such behavior.

## Verification enforcement

### Structural gates

Automate:

- component/provider dependency rules;
- topology/screen subject consistency;
- managed test-design traceability;
- Harness semantic/currentness checks.

### Behavioral gates

Automate accepted test contracts where executable behavior is required:

- Knowledge textual/3D parity and fallback;
- Curation rejection/conflict;
- Study materialization fidelity;
- evidence semantics;
- responsive/focus continuity;
- backend outcome mapping;
- renderer failure isolation.

### Diagnostic-only evidence

3D benchmark measurements may run and be retained, but do not fail the release based on unaccepted numeric FPS/node/edge/rendering thresholds.

## Delivery gate

The authoritative implementation gate is repository CI from versioned project inputs.

For a frontend implementation change, CI must reproduce at least:

- Harness semantic/currentness validation;
- frontend build/type/static validation applicable to the selected stack;
- dependency-boundary structural checks;
- executable frontend test contracts;
- existing repository integration/revalidation checks affected by the change.

Local/pre-commit commands may provide fast feedback but do not replace CI.

This artifact does not authorize merging a draft PR or merging into `main`.

## Completion criteria

`prep.frontend-implementation-design` is realized by production implementation only when all of the following are true:

1. root Learning / Knowledge / Curation context is implemented from rebuilt topology;
2. every non-structural `V-*` view has a production realization;
3. textual Knowledge access works independently of 3D;
4. 3D donor is contained behind `KnowledgeProjectionPort` and satisfies focus/fallback contracts;
5. backend canonical authority and operation outcomes are preserved;
6. no browser-direct external-runtime path exists;
7. Curation collection/edit state preserves accepted validation/conflict semantics;
8. responsive wide/narrow composition preserves accepted task priorities and keyboard paths;
9. FTD contracts required by current frontend verification pass;
10. dependency-boundary checks pass;
11. repository full CI is green;
12. obsolete frontend paths that conflict with rebuilt topology are removed or explicitly isolated from production entry;
13. no unaccepted numeric graph benchmark is a correctness/release gate.

## Risks

### Donor 3D integration mismatch

The donor may encode old product assumptions, identity shapes or shell behavior.

Mitigation: adapt only through renderer-neutral projection input/intents; reject donor semantics outside the adapter.

### Legacy frontend coupling

Existing implementation may have transport/provider/global-state coupling that conflicts with new boundaries.

Mitigation: cut over by vertical slices; use structural checks before deleting old paths.

### Overgeneralization during rewrite

Entity-heavy Curation screens can tempt a generic CRUD platform.

Mitigation: implement current feature surfaces first; extract only repeated stable presentation patterns already accepted by Component Design.

### Test coupling to old UI structure

Existing tests may encode obsolete screen ids/layout.

Mitigation: migrate or replace their oracle with the rebuilt FV/FTD contracts; implementation structure is not correctness truth.

## Implementation freedoms

Coding may choose, consistent with accepted project/build constraints:

- exact framework APIs;
- router/state/query/test libraries;
- exact file names under the logical ownership roots;
- styling/token implementation;
- code-splitting/lazy-loading mechanics;
- 3D renderer library integration details;
- exact architecture-check tool;
- internal helper/function/class representation.

These choices must not cross the accepted semantic/component boundaries.

## Unresolved Questions

None block implementation planning.
