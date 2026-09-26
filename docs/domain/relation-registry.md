# Knowledge Graph Relation Registry

## Responsibility

Define the semantic meaning and direction of first-class Knowledge Graph edges. The registry is controlled but extensible: new relation types are admitted by explicit semantics, not invented ad hoc during ingestion.

## Core rules

Every accepted relation has:

```text
relation_id
type
from_node_id
to_node_id
evidence/provenance
```

The edge direction is part of its meaning. UI arrows and graph traversal must follow the canonical direction.

The registry describes semantic truth, not visualization. Colors, line styles and visibility toggles are view concerns derived from `type`.

## Canonical registry

### Structural / taxonomic

**`specializes`**

```text
A --specializes--> B
```

A is a narrower/specialized form of B.

Example: `Snapshot Isolation --specializes--> Isolation Model`.

**`part_of`**

```text
A --part_of--> B
```

A is a constituent part of B.

Example: `Capture --part_of--> Payment Lifecycle`.

**`depends_on`**

```text
A --depends_on--> B
```

A's semantics/operation materially require B. This is a domain dependency, not automatically a learner ordering rule.

Example: `Idempotent Payment Retry --depends_on--> Stable Operation Identity`.

### Operational / realization

**`uses`**

A employs B as part of how it works.

Example: `Idempotency Implementation --uses--> Unique Constraint`.

**`realizes`**

A concrete mechanism/pattern/technology provides a realization of B.

Example: `Idempotency Key Reservation --realizes--> Idempotency`.

**`produces`**

A causes/creates B as an output or result.

Example: `Authorization --produces--> Authorization Result`.

**`derives_from`**

A is semantically obtained/defined from B.

Example: a derived learning concept or result may derive from a more fundamental model/result.

**`enables`**

A makes B possible or practically achievable without meaning that B structurally depends on A in every realization.

Example: `Unique Constraint --enables--> Concurrency-safe Deduplication`.

### Problem / solution

**`addresses`**

```text
A --addresses--> B
```

A solution-form referent mitigates/solves/handles problem B.

Example: `Transactional Outbox --addresses--> Database-to-Broker Dual Write Problem`.

This relation is intentionally separate from `realizes`: “addresses a problem” and “realizes a property/model” are different claims.

## Evaluated but not admitted

The historical Knowledge Graph relation study considered additional meanings including `verifies`, `consumes`, `supersedes`, `instance_of`, `monitors`, `alternative_to` and other software-architecture-specific candidates. They are not canonical Prep relations now because the source study did not establish enough representative evidence or a sufficiently safe boundary for admission.

Prep-specific candidates `constrains` and `precedes` also remain deferred. They have plausible semantics but were not part of the independently evaluated Knowledge Graph admission set used for this change. They can be reconsidered through the normal admission rule below rather than being smuggled into the frontend contract.

A generic `related_to` remains forbidden as a fallback.

## Admission of a new relation type

A new type requires:

1. one-sentence directional semantics;
2. examples and counterexamples;
3. distinction from all existing types;
4. declaration of symmetry/asymmetry;
5. whether self-edges are meaningful;
6. whether transitivity may be inferred (default: no);
7. demonstrated use in more than one isolated ingestion case, unless the missing type blocks a high-value domain model.

No ingestion agent may create free-form edge labels as an escape hatch.
