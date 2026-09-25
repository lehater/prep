# Frontend Prototype Realization Note

## Status

This file is a downstream prototype realization note. It is **not** a canonical semantic source.

Canonical user-facing semantics come from:

- `docs/interface/interface-topology.yaml`;
- `docs/interface/screen-view-design.md`;
- `docs/interface/presentation-system.md`;
- `docs/interface/interaction-design.yaml`;
- `docs/interface/machine-interface.md`.

The current goal is to exercise those contracts with static/mock data before production frontend/backend implementation is designed and accepted.

## Prototype stack

Initial skeleton:

- React 19;
- TypeScript;
- Vite;
- React Router for prototype route/layout ownership.

Do not add a server-state library in the mock-only slice. Add TanStack Query only when the prototype starts consuming the accepted browser/backend contract.

Do not add the 3D renderer to the shell slice. Add `react-force-graph-3d` behind a narrow Knowledge projection boundary when the Knowledge slice is implemented.

A presentation provider such as MUI is an implementation detail and must not authorize product behavior absent from Screen/View contracts.

## Prototype route projection

Routes are a replaceable projection of the canonical topology, not semantic truth.

```text
/learning
  -> L-01 Target Selection

/learning/:targetId/overview
  -> F-LT Target Workspace + L-02 Overview

/learning/:targetId/knowledge
  -> F-LT Target Workspace + L-03 Knowledge

/learning/:targetId/study
  -> F-LT Target Workspace + L-04 Study

/learning/:targetId/statistics
  -> F-LT Target Workspace + L-05 Statistics

/curation/targets
  -> F-C Curation Workspace + C-11 Target Collection
/curation/targets/:targetId
  -> C-12 Target Editor

/curation/knowledge
  -> F-C Curation Workspace + C-21 Knowledge Workspace
/curation/knowledge/:knowledgeId
  -> C-22 Knowledge Editor

/curation/requirements
  -> F-C Curation Workspace + C-31 Requirements Collection
/curation/requirements/:requirementId
  -> C-32 Requirement Editor
/curation/requirement-sets/:requirementSetId
  -> C-33 RequirementSet Editor

/curation/questions
  -> F-C Curation Workspace + C-41 Questions Collection
/curation/questions/:questionId
  -> C-42 Question Editor

/curation/:area/import
  -> S-02 Contextual Import Flow

/runtime
  -> S-01 External Runtime Status
```

The Application Shell is the root layout and explicitly switches between Learning and Curation.

There is no v1 authentication route, learner-progress route, plan workspace or browser secret/settings editor.

## Mock-state ownership

### URL

Owns shareable navigation context:

- mode;
- selected LearningTarget;
- current workspace section;
- selected canonical object when represented as a route;
- Knowledge focus/query parameters required for cross-view transitions.

The Study transition `Question -> Show in Knowledge Map` navigates to the current target Knowledge route with aligned Knowledge identity encoded in URL/search state.

### Local React state

Owns prototype-only transient state:

- search input when it need not be shareable;
- open/closed detail presentation;
- graph camera/hover/drag state;
- unsaved mock editor input.

### Static fixture layer

Owns mock LearningTargets, Knowledge, Requirements, Questions, ReviewObservations and runtime/import outcomes.

Fixtures must preserve canonical identities and relations used by multiple views; individual screens must not invent contradictory copies.

## First skeleton slice

The first implementation slice proves navigability and responsibility coverage, not visual polish.

Required result:

1. root Application Shell with explicit Learning/Curation switch and runtime-status access;
2. Target Selection plus one mock target;
3. Target Workspace with Overview, Knowledge, Study and Statistics;
4. Curation Workspace with Targets, Knowledge, Requirements and Questions collections;
5. skeletal editors for target, Knowledge, Requirement, RequirementSet and Question;
6. contextual Import flow;
7. mock common states where material: loaded, empty, unavailable/recoverable;
8. Study Question -> Knowledge transition preserving target context;
9. no mastery/readiness/coverage percentages;
10. no production backend calls.

Knowledge in this slice must already be accessible by list/search/detail. The 3D canvas may remain a clearly marked placeholder until the next focused Knowledge slice.

## Reuse from the previous 3D experiment

The branch `experiments/knowledge-representation-3d` is evidence, not a base architecture.

Potentially reusable implementation techniques after semantic adaptation:

- click-without-drag versus node drag separation;
- orbit/pan/zoom and camera reset/focus behavior;
- renderer idle/pause optimization;
- node search and focus;
- detail overlay without discarding graph state;
- bounded renderer abstraction/performance instrumentation.

Do not carry forward its old product semantics, route model, relation taxonomy, graph-first application structure or Storybook tuning UI as product behavior.
