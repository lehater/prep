# Plan: Harness-guided Prep revalidation

## Goal

Re-establish Prep's canonical engineering knowledge from the accepted problem space downward, without carrying earlier graph-centered, Anki-centered or implementation-centered assumptions forward unless current evidence supports them.

## Working rule

Follow the pinned canonical `Lehater/harness` dependency model. Upstream changes require downstream revalidation/reconciliation before later design is treated as current.

Historical artifacts are not canonical merely because they remain in Git history.

## Current canonical knowledge

Revalidated project knowledge currently includes:

- Problem Space, Product Vision and Product Capabilities;
- Domain Strategy and Model Context Strategy;
- Knowledge Model, Learning Design and Learner Model;
- Application Design, Task Model and User Journeys;
- Conceptual Interface Model;
- Information Architecture;
- Interaction Design;
- Interface Topology;
- Presentation System and Screen/View Design;
- Machine Interface;
- Import Consistency;
- Interface/Presentation Verification;
- System Architecture and Data Design.

The broad `prep.human-interface` capability is no longer part of the project Engineering Graph. Human-interface knowledge is represented by the granular contracts above.

## Accepted product / interaction direction

Prep has two explicit task modes:

- **Learning** — select an existing curated LearningTarget/profile and learn; target scope is read-only.
- **Curation** — create/edit LearningTargets and their Requirement scope; maintain reusable Knowledge, Requirements/RequirementSets, Questions and alignments.

These are task contexts, not authentication roles in v1.

Learning uses a target-scoped workflow. Curation owns reusable corpus and target composition.

Study Set construction uses all currently resolvable Questions and is not blocked by incomplete semantic coverage.

## Interface structure

Canonical interface completeness is owned by:

```text
Task Model
  -> User Journeys
      -> Conceptual Interface Model
          -> Information Architecture
          -> Interaction Design
              -> Interface Topology
                  -> Presentation System
                      -> Screen/View Design
```

Information Architecture and Interaction Design are independently addressable and are mapped together by Interface Topology.

`docs/interface/site-map.md` is a human review projection of the canonical topology and Screen/View knowledge. It does not own interface semantics.

The current topology includes shared structural frames plus Learning, Curation and secondary views. Stable Screen/View subject ids are embedded in `docs/interface/screen-view-design.md` and are checked against topology by the pinned Harness integration.

## Browser/backend contract closure

The browser/backend machine boundary defines stable operations for:

- LearningTarget selection and read-only scope;
- target Knowledge/graph/Question projections;
- Study Set build/export with stale-preview detection;
- factual statistics and explicit review sync;
- Curation CRUD/alignment/composition;
- contextual bulk import;
- external-runtime status.

Anki endpoint/API-key remain deployment configuration; v1 UI exposes runtime status rather than a secret/config editor.

## Active research

### Learning/evidence coverage

`docs/research/learning-coverage-research.md` remains active evidence for `Q-LEARNING-COVERAGE-MODEL`.

Current constraints:

- coverage is not Question count;
- learning-support coverage and assessment/evidence coverage are distinct;
- content breadth, cognitive/performance depth and context/transfer variability may matter;
- no scalar coverage percentage is accepted;
- curator/human semantic judgment remains authoritative until an automated model is validated.

This question does not block the current Knowledge inspection / graph prototype.

### Learner state / graph overlay

`docs/research/learner-state-graph-overlay.md` remains active future work.

A target-scoped Knowledge Graph may eventually visualize learner state, but ReviewObservation → Question → Knowledge/Requirement inference semantics are not accepted yet.

### 3D Knowledge Graph

`docs/research/3d-knowledge-graph-learning-research.md` supports 3D as a first-class **prototype hypothesis**, not as a proven superior representation.

The prototype must preserve list/search/detail alternatives and test whether 3D materially improves relational learning/exploration tasks.

## Frontend-first development rule

Do not start production backend implementation merely because machine contracts exist.

The immediate implementation goal is **not** end-to-end Learning -> Study Set -> Anki closure. The current prototype should first make the accepted Knowledge model and representative corpus directly inspectable so model/data defects and graph UX assumptions can be evaluated before downstream study/export work receives implementation effort.

Use static/mock or repository-derived representative data. The prototype remains evidence: it does not redefine canonical domain/interface semantics.

Keep a non-graph baseline for every core Knowledge inspection task. The question is not whether a 3D graph can be rendered, but whether it makes specific relational tasks or model/data defects easier to understand than list/search/detail.

## Current frontier

The current frontier is no longer direct frontend coding. Harness reconciliation after the implementation-consumer investigation separates three targets:

- `CURRENT-REVALIDATION` — the accepted top-level design baseline; its completion does not authorize coding;
- `FRONTEND-PROTOTYPE` — the noncanonical Knowledge-visualization experiment; because this prototype intends to reuse non-trivial 3D renderer mechanics, its closure includes frontend System Architecture and Component Design so experimental structure does not become accidental production architecture;
- `FRONTEND-IMPLEMENTATION` — the production coding target; it additionally requires frontend Verification Design, Test Design and Implementation Design.

The immediate engineering-knowledge frontier is therefore frontend-scoped System Architecture, followed by Component Design. G0 code work starts only after the `FRONTEND-PROTOTYPE` Consumer exposes no missing architecture/component knowledge.

The research/code frontier after that closure remains:

> **Knowledge visualization as model/data inspection and UX-validation prototype.**

Two distinct uses must remain explicit:

1. **Curation / global Knowledge inspection** — inspect the reusable Knowledge corpus and reveal suspicious structure, relations, isolation, excessive connectivity, duplication candidates or granularity problems.
2. **Learning / target-scoped Knowledge exploration** — inspect the Knowledge projection relevant to one LearningTarget and evaluate whether the 3D representation improves relational understanding.

The 3D graph is therefore the primary research surface for the next implementation work, but not a product invariant and not the sole Knowledge access mechanism.

Study Set export, full Statistics realization and end-to-end Anki integration are intentionally deferred until Knowledge data/model quality and the graph interaction model have been exercised.

The active branch remains a revalidation/development line; it is not yet a project-wide `main` canonicalization candidate while open domain/interface research remains.

## Frontend code audit

Audit against the accepted Interface Topology found no current frontend application in `research/problem-space-revalidation`: the branch contains no React/Vite/Storybook package or screen/component implementation.

The previous `experiments/knowledge-representation-3d` branch remains implementation evidence. It contains useful renderer and interaction mechanics, but also stale graph-first product semantics. Reuse must therefore be selective.

Potentially reusable mechanics:

- click-without-drag versus node dragging;
- orbit/pan/zoom and inertial camera behavior;
- node search/focus;
- detail overlay without losing graph context;
- renderer idle/pause optimization;
- performance instrumentation;
- graph fit/reset behavior.

Do not inherit from that experiment:

- old route structure;
- graph-first whole-product composition;
- old relation taxonomy;
- old authentication/settings/progress assumptions;
- Storybook tuning controls as product UI;
- any semantic meaning implied by geometry.

## Graph-first research implementation plan

### G0 — Minimal Knowledge prototype shell

Purpose:

Establish only the minimum product context needed to keep the graph connected to accepted interface semantics.

Input:

- Interface Topology;
- Presentation System;
- Screen/View Design;
- representative Knowledge data.

Output:

- Application Shell with explicit Learning / Curation mode context;
- Curation / Knowledge entry;
- Learning / Knowledge entry with one selectable mock LearningTarget;
- shared canonical Knowledge identities across both contexts;
- list/search/detail baseline beside the graph surface.

Acceptance:

- the graph is not a detached demo;
- global and target-scoped Knowledge are visibly different contexts;
- Knowledge remains accessible without graph manipulation;
- no Study/Anki/backend implementation is required.

### G1 — Global Knowledge inspection graph

Purpose:

Make the canonical Knowledge corpus visually inspectable for model/data validation.

Required interactions:

- search KnowledgeNodes;
- select node by click without accidental drag;
- drag node independently from click selection;
- orbit, pan and zoom;
- open readable node detail without discarding graph state;
- filter by Knowledge kind;
- filter by accepted relation type;
- inspect relation type and direction explicitly;
- focus a selected node with bounded neighborhood;
- reset/home/fit graph;
- preserve camera/filter/focus state while inspecting detail.

Inspection diagnostics should make it practical to notice at least:

- isolated nodes/components;
- unexpectedly high-degree nodes;
- suspiciously dense clusters;
- relation-direction anomalies;
- duplicate/granularity candidates;
- unexpected cross-area connections.

These are inspection aids, not automatic semantic judgments.

Acceptance:

- a curator can inspect structure without reading raw source files;
- geometry is never treated as semantic truth;
- relation semantics remain explicit;
- the graph stays usable when the representative dataset becomes materially larger than a toy fixture.

### G2 — Representative data validation

Purpose:

Test the graph against data realistic enough to expose model and visualization problems.

Data should include:

- multiple Knowledge kinds;
- multiple accepted relation types;
- connected and disconnected regions;
- nodes with low, medium and high degree;
- at least one dense neighborhood;
- enough nodes to reveal occlusion/performance/navigation problems;
- canonical identities reused by Questions and target projections where available.

The preferred source is current/reusable Prep Knowledge data. Previous experiment fixtures may fill gaps only where they can be mapped to current canonical semantics.

Acceptance:

- obvious fixture artifacts do not dominate conclusions;
- performance and readability problems can be observed at realistic density;
- model/data anomalies discovered during inspection are recorded separately from renderer defects.

### G3 — Target-scoped Knowledge projection

Purpose:

Verify that LearningTarget scope produces a coherent learner-facing Knowledge projection.

Output:

- select one LearningTarget;
- derive/show its target-relevant Knowledge subset;
- preserve target context while searching, focusing and opening detail;
- distinguish global Curation graph from target Learning graph;
- provide a clear way to return from focused/local neighborhood to the whole target scope.

Acceptance:

- target graph contains only the intended target-derived Knowledge projection;
- canonical Knowledge identity is preserved between global and target views;
- user can understand current scope without inferring semantics from coordinates.

### G4 — Question -> Knowledge Map bridge

Purpose:

Verify the most important cross-representation transition before implementing the whole Study workflow.

Output:

- minimal representative Question detail/list;
- `Show in Knowledge Map`;
- navigation to the current target Knowledge graph;
- all aligned KnowledgeNodes highlighted/focused;
- target/filter/camera context handled predictably.

Acceptance:

- the user can answer "what Knowledge supports this Question?";
- multiple aligned nodes remain distinguishable;
- the transition does not require Question editing or Study Set export.

### G5 — Task-based 3D value evaluation

Purpose:

Collect evidence for `Q-KNOWLEDGE-GRAPH-3D-VALUE`.

Compare 3D graph with the list/search/detail baseline on the same tasks:

1. find a known KnowledgeNode;
2. identify its direct neighbors and relation directions/types;
3. explain the local relational context of one node;
4. detect an isolated or unexpectedly connected node;
5. move from a Question to supporting Knowledge;
6. filter to one Knowledge kind/relation type and recover the intended structure;
7. return to a previously inspected area without excessive disorientation.

Observe:

- correctness;
- completion effort/time;
- navigation errors;
- loss of orientation;
- information missed because of occlusion/clutter;
- cases where list/search/detail is clearly simpler;
- cases where 3D exposes structure materially better.

Result:

- retain, narrow or demote the 3D graph based on observed task value;
- record any required changes to Knowledge data/model separately from presentation findings.

## Deferred until graph/data validation

The following work remains accepted but is not the immediate implementation priority:

- complete Target Selection / Overview polish;
- full Study Set preview/build/export states;
- end-to-end Anki handoff;
- detailed Statistics presentation;
- broad Curation editor completion;
- production browser/backend integration;
- production frontend Test Design and Implementation Design closure.

Frontend System Architecture refinement and Component Design are no longer deferred because the current prototype intends to reuse non-trivial renderer mechanics and therefore must not invent those boundaries inside experimental code.

After G5, use the collected evidence to decide whether to continue with the broader Learning slice, revise Knowledge semantics/data, or change the graph interaction approach.
