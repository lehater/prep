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

This question does not block the current Question-first learner slice.

### Learner state / graph overlay

`docs/research/learner-state-graph-overlay.md` remains active future work.

A target-scoped Knowledge Graph may eventually visualize learner state, but ReviewObservation → Question → Knowledge/Requirement inference semantics are not accepted yet.

### 3D Knowledge Graph

`docs/research/3d-knowledge-graph-learning-research.md` supports 3D as a first-class **prototype hypothesis**, not as a proven superior representation.

The prototype must preserve list/search/detail alternatives and test whether 3D materially improves relational learning/exploration tasks.

## Frontend-first development rule

Do not start production backend implementation merely because machine contracts exist.

The next implementation work should use static/mock data to exercise:

- Learning/Curation mode separation;
- target selection and the four-section learner workspace;
- Knowledge list/search/detail + 3D graph coordination;
- Question → Knowledge Map transition;
- Study Set preview/export states;
- Statistics presentation.

Backend production implementation follows after material frontend interaction choices have been exercised and accepted.

## Current frontier

Use canonical Interface Topology and `docs/interface/site-map.md` as the prototype skeleton.

Implement frame shells with mock/static data first, then deepen the Knowledge / 3D graph frame and Question → Knowledge Map transition while leaving non-critical frames skeletal.

The active branch remains a revalidation/development line; it is not yet a project-wide `main` canonicalization candidate while open domain/interface research remains.


## Frontend code audit and first prototype slice

Audit against the accepted Interface Topology found no current frontend application in `research/problem-space-revalidation`: the branch contains no React/Vite/Storybook package or screen/component implementation. Therefore current topology coverage in executable frontend code is 0/19 material view/frame subjects.

The previous `experiments/knowledge-representation-3d` branch is retained as evidence. It contains useful 3D renderer/interaction experiments, but it covers only Knowledge-oriented behavior and carries stale graph-first semantics. It is not a base application to merge wholesale.

Before prototype code is added, current repository guidance is aligned as follows:

- the mock frontend is explicitly a prototype/evidence surface, not production frontend closure;
- canonical semantics remain in Interface Topology, Presentation System and Screen/View Design;
- old graph-first routes/auth/settings/progress assumptions are retired from the active prototype realization note.

### Slice 1 — navigable mock skeleton

Input:

- accepted 19-subject Interface Topology;
- Screen/View responsibilities;
- Presentation System;
- static/mock canonical identities.

Output:

- one browser prototype that can traverse the whole accepted product topology;
- a complete Learning path from Target Selection through Overview, Knowledge, Study and Statistics;
- skeletal Curation collections/editors and contextual Import;
- runtime-status surface;
- Question -> Knowledge navigation preserving target context.

Acceptance:

- every topology subject is represented by a reachable view or structural layout;
- Learning and Curation are explicit task contexts;
- LearningTarget scope is read-only in Learning;
- Knowledge has non-graph list/search/detail access;
- Study can navigate a Question to related Knowledge;
- Statistics use factual observation language only;
- no auth/multi-user, backup/HA, mastery/readiness/coverage percentage, browser AnkiConnect call or production backend dependency is introduced.

### Slice 2 — Knowledge hypothesis

After Slice 1 is navigable, deepen `L-03-TARGET-KNOWLEDGE` with coordinated list/search/detail plus the 3D graph projection. Reuse only compatible renderer mechanics from the old experiment, then exercise `Q-KNOWLEDGE-GRAPH-3D-VALUE` with the accepted task scenarios.
