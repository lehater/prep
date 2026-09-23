# Plan 015 — Top-level graph-centered platform design

## Goal

Establish a coherent breadth-first top-level design for Prep before deeper implementation work.

## Scope

- connect Prep to the pinned universal Harness;
- capture the problem space and product capability map;
- make Knowledge Graph and Learning Coordination explicit platform responsibilities;
- preserve Interview Preparation and English Listening as separate bounded contexts;
- define top-level learner/operator journeys;
- define the graph-first UI concept;
- define the black-box system landscape and quality drivers;
- keep physical storage, APIs, components, deployment and detailed exercise generation below the current design boundary.

## Completed top-level foundation

- [x] Harness direct-declaration integration and immutable pin
- [x] problem-space baseline
- [x] product-capability baseline
- [x] strategic context-map update
- [x] Knowledge Graph domain boundary
- [x] Learning Platform boundary
- [x] top-level user journeys
- [x] graph-first interface concept
- [x] quality drivers
- [x] black-box system landscape
- [x] review node-kind vocabulary against current interview/learning cases
- [x] define controlled relation registry and extension rules
- [x] define minimum learner-state aggregation semantics for graph overlays
- [x] define graph admission/curation acceptance rules

## Next top-level questions

- [ ] define canonical Source/Evidence identity and provenance boundary for imported knowledge
- [ ] define Target Scope / Curriculum / Learning Plan semantics and their differences
- [ ] define semantic graph versioning, retirement and historical-reference guarantees
- [ ] define integration identity between subject-context concepts/targets and canonical graph nodes
- [ ] define learner/account boundary for personal evidence, saved views and plans
- [ ] review whether knowledge clusters are canonical semantics, derived graph analytics or user-saved views

## Stop rule

Do not descend into database choice, API contracts, component design, deployment topology or implementation tickets while unresolved top-level semantics can still change those choices materially.
