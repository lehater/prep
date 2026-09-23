# Top-level design consistency review

Date: 2026-09-23
Status: reviewed against current TOP-LEVEL-DESIGN providers

## Scope

Cross-check the graph-centered top-level artifacts before opening a deeper design layer.

## P0 findings fixed

### Semantic identity was conflated with NodeId

Earlier wording treated the immutable ID as identity itself. The corrected model distinguishes conceptual continuity from the stable system-owned identifier of the canonical representation.

### Node semantic content was missing

Nodes had label/kind/relations/evidence but no explicit owner for definition/explanation claims shown in the UI. `KnowledgeAssertion` now owns independently reviewable evidence-backed node content.

### Repository authority was over-broad

The engineering repository is authoritative for project design/executable artifacts. It is not preselected as the production database for runtime graph/learner state.

### Interview Concept duplicated emerging Knowledge Graph ownership

Interview Preparation now treats existing local Concept IDs as compatibility artifacts and defines GraphSubjectRef as the target integration boundary.

## P1 findings fixed

- Area, DerivedCluster, SavedView and TargetScope now have separate meanings.
- content coverage, plan membership and learner state are separate projections.
- graph lifecycle preserves historical plan/evidence references across rename/merge/retirement.
- evidence references source revisions/observations rather than mutable URLs alone.
- learner state can target relations as well as nodes.

## Deferred without blocking current depth

- concrete assertion aspect taxonomy;
- numeric learner-state aggregation thresholds;
- source authority/ranking policy;
- persistence/data structures;
- API/component/deployment choices;
- multi-tenant/account security realization.

These are downstream refinements because their current uncertainty does not change the accepted top-level ownership boundaries.

## Conclusion

No unresolved semantic gap currently blocks the TOP-LEVEL-DESIGN consumer after the fixes above.

The next phase may descend one level to logical application/data/system boundaries, but should continue breadth-first across that level before choosing concrete technologies.
