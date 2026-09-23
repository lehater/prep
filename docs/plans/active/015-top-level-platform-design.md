# Plan 015 — Top-level graph-centered platform design

## Goal

Establish a coherent breadth-first top-level design for Prep before deeper implementation work.

## Scope

Cover the full product/domain/architecture surface at black-box/semantic level while keeping physical storage, APIs, components, deployment and detailed implementation below the current boundary.

## Completed top-level foundation

- [x] Harness direct-declaration integration and immutable pin
- [x] problem-space and product-capability baseline
- [x] strategic context map
- [x] Knowledge Graph and Learning Coordination boundaries
- [x] top-level user journeys and graph-first interface
- [x] quality drivers and black-box system landscape
- [x] node-kind vocabulary
- [x] controlled relation registry
- [x] learner-state aggregation semantics
- [x] graph admission/curation policy
- [x] Source/Evidence provenance boundary
- [x] TargetScope / Curriculum / LearningPlan semantics
- [x] graph revision/rename/merge/retirement guarantees
- [x] subject-context -> canonical graph identity integration
- [x] learner/personal-state boundary
- [x] Area / DerivedCluster / SavedView / TargetScope distinction

## Remaining breadth review

- [ ] run a cross-artifact semantic consistency review over all TOP-LEVEL-DESIGN providers
- [ ] identify unresolved top-level Questions; add Harness blockers instead of inventing answers
- [ ] decide whether the top-level baseline is coherent enough to open the next design depth

## Next depth only after review

Candidates for the next design depth include persistence representation, graph/query API, component/module boundaries, ingestion workflow mechanics, sync/runtime topology and executable verification. None is authorized by this plan until the breadth review is complete.

## Stop rule

Do not descend while unresolved top-level semantics can materially change lower-level choices.
