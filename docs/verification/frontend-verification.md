# Frontend Verification Design

## Purpose

Define evidence required before the frontend-first implementation can be treated as a conforming realization of accepted product/interface/frontend-architecture contracts.

Mock-backed realization is a valid first implementation target. HTTP/backend implementation is not required for frontend semantic closure; when added later it must satisfy the same ports.

## FV-01 — Product/interface traceability

**Method:** INSPECTION.

Verify every user-visible behavior traces to Product Capability plus Screen/View responsibility and no provider feature creates new product behavior.

## FV-02 — Accepted frontend workflows

**Method:** TEST.

Verify representative Learning/Curation workflows:

- select prepared target;
- preserve active target across Overview/Knowledge/Study/Statistics;
- inspect target requirements/support diagnostics;
- search/select/explore Knowledge;
- build valid empty/non-empty Study Set preview and recover from stale preview;
- inspect factual evidence;
- curate Targets, Knowledge, Capabilities and Question-compatible Study Material;
- import prepared input and inspect outcomes;
- inspect runtime status.

Evidence: executable browser/component scenarios over deterministic mock ports.

## FV-03 — Frontend port/outcome fidelity

**Method:** TEST.

Verify adapters preserve accepted operation inputs/results and distinct outcomes: success, validation rejection, conflict/staleness, runtime unavailable/incompatible, partial external failure and operational failure.

Opaque tokens remain opaque; canonical identity and semantic distinctions survive mapping.

## FV-04 — Dependency direction

**Method:** TEST.

Verify:

- Learning/Curation internals do not import each other;
- features do not import concrete mock/transport adapters;
- features do not import the concrete graph renderer;
- shared presentation code does not own feature mutable state;
- renderer/provider types do not leak into frontend semantic ports/models.

## FV-05 — Representation isolation

**Method:** TEST.

Verify mock fixtures and future transport DTOs terminate inside adapters and map to the same frontend-owned models. Mock fixture convenience fields must not become feature contracts.

## FV-06 — Renderer isolation and semantic preservation

**Method:** TEST.

Verify:

- GraphScene uses canonical Knowledge refs and relational KnowledgeProposition refs/predicate metadata;
- coordinates/camera/physics/library objects stay adapter-private;
- click-without-drag activation cannot mutate Knowledge;
- selection and explicit focus remain distinct;
- profile/degradation changes preserve semantic membership/identity/proposition meaning;
- renderer unavailable leaves non-spatial Knowledge access usable;
- idle rendering becomes demand-driven when settled.

Hardware FPS/capacity evidence is supplied separately under Presentation Verification.

## FV-07 — Mock/future transport substitutability

**Method:** TEST.

Verify the current MockFrontendAdapter satisfies the same consumer-owned ports expected from a later transport adapter. Feature behavior and models do not branch on adapter kind.

A future transport adapter must pass the same shared port contract suite before replacing mocks.

## FV-08 — State ownership/lifetime

**Method:** TEST.

Verify:

- shell owns mode/navigation;
- Learning owns active target;
- feature/editor/query state stays with its feature;
- KnowledgeExplorer owns query/filter/selection/focus;
- renderer owns camera/layout/force/drag/hover;
- selecting detail inside unchanged semantic scope does not recreate graph query/renderer lifetime;
- no canonical domain/application truth is promoted into general frontend mutable state.

## FV-09 — Presentation evidence closure

**Method:** ANALYSIS.

Verify all applicable PV checks have evidence before production closure, especially keyboard/non-spatial access, 3D semantic fidelity/task suitability, responsive hierarchy, semantic-preserving degradation and hardware workload evidence.

## FV-10 — Harness currentness

**Method:** ANALYSIS.

Verify frontend closure is rerun when accepted prerequisites change; stale canonical frontend knowledge cannot be treated as current merely because code still builds.

## Completion meaning

Acceptance of this artifact means verification obligations are explicit and traceable. It does not claim all prototype/production evidence already exists.

## Out of scope

Backend service topology, persistence, exact test framework syntax, provider internals, pixel-perfect snapshots and unaccepted learner-state inference.
