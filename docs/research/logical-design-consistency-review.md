# Logical Design Consistency Review

Date: 2026-09-23
Status: accepted review for LOGICAL-DESIGN

## Scope

Review all providers required by the Harness `LOGICAL-DESIGN` consumer for ownership ambiguity, hidden coupling, inconsistent consistency models and accidental technology commitments.

## Findings resolved

### Single ownership of publication state

The earlier wording could be read as dual ownership of `PublicationBinding`.

Resolved boundary:

```text
Learning Coordination -> desired publication intent
Study Runtime Integration -> PublicationBinding / RuntimeBinding / observed runtime state
```

### Logical dependencies were too weak

Harness dependencies now require:

- graph read-model design to consume the graph-interface concept;
- privacy/access design to consume actual logical use cases;
- consistency/reliability design to consume ingestion, study-runtime and data-ownership contracts.

This prevents downstream artifacts from being structurally complete while ignoring the behavior they constrain.

### Authoritative versus derived state

The layer now consistently treats:

- semantic graph, plans, raw evidence and runtime identity mappings as authoritative state in their owning contexts;
- learner state, search/index/layout/cluster/progress views as derived/rebuildable;
- UI state as personal/non-semantic.

### External-runtime consistency

No document requires a distributed transaction with Anki/other study runtimes. Desired/observed reconciliation is consistently the boundary.

### Curation versus canonical graph

Candidate analysis and semantic review remain staged state. Canonical semantic writes happen only through accepted GraphChangeSet -> GraphRevision.

## Cross-artifact invariants

The logical layer agrees on these invariants:

1. one semantic state item has one logical owner;
2. Graph Core has a single controlled write path through admission;
3. subject contexts own learning-object semantics;
4. Learning Coordination owns learner intent/evidence, not runtime mappings;
5. Runtime Integration owns external identity/reconciliation, not mastery;
6. read models never become sources of truth;
7. personal learner state is separable from shared knowledge;
8. retries/replay must be semantically idempotent at external boundaries;
9. large graph interaction uses bounded/query projections, not mandatory whole-graph loading;
10. concrete storage/API/framework/deployment choices remain unresolved by design.

## Deferred to next depth

These are not blockers for logical closure:

- physical persistence and graph representation;
- exact machine API/protocol style;
- concrete 3D/frontend technology;
- deployable process/runtime topology;
- authentication provider and concrete authorization mechanism;
- capacity/performance budgets;
- concrete backup/retention/migration mechanisms;
- detailed Anki/AnkiWeb/AnkiConnect deployment integration;
- executable test contracts.

## Harness result

GitHub Actions run `35885404858` evaluated:

```text
TOP-LEVEL-DESIGN: COMPLETE
LOGICAL-DESIGN:   COMPLETE
```

No unresolved Harness Question blocks this design depth.

## Conclusion

The logical layer is coherent enough to descend one level. The next phase should again proceed breadth-first across physical data, interfaces, presentation, components, external dependencies, runtime topology, security, reliability/performance, operability and test design before implementation.
