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

## Revalidation status

The registry below is the **current compatibility baseline**, not the accepted final relation design.

Deeper relation-model research found that `uses`, `depends_on`, `enables` and generic `derives_from` are too broad to serve reliably as human-facing leaf predicates. They collapse materially different assertions and can create opposite-looking edges that do not add explanatory value.

The next vocabulary migration MUST be based on:

- `docs/research/relation-ontology-theory-selection.md` — theory/standards selection and the exact 20-predicate candidate set;
- ISO 704 concept-relation methodology;
- OWL/Relation Ontology definition discipline;
- ArchiMate technical/system relations;
- PROV-O provenance/derivation semantics;
- the concept-map proposition test for visible edge quality.

Until corpus validation and migration are complete:

- existing runtime types remain supported for compatibility;
- no new relation type should be added merely by analogy to the current nine-type enum;
- new broad `uses` / `depends_on` / `enables` assertions should not be treated as evidence that those predicates are semantically adequate;
- inverse wording should be derived from one canonical relation where possible rather than stored as a second opposite edge.

## Machine-readable classifier contract

Agent classification MUST use `docs/domain/relation-classification-catalog.yaml`.

The classifier is not limited to the currently registered runtime enum. It must return exactly one of:

1. `matched` — an existing leaf predicate precisely fits the assertion;
2. `candidate_needed` — a real relation is supported, but no registered leaf fits without semantic loss; propose a new leaf using the standard relation-pattern catalogue and provide definition, roles, inverse and evidence;
3. `insufficient_evidence` — no precise semantic assertion is supported; create no edge.

The classifier must prefer the most specific supported leaf and must not coerce an assertion into `uses`, `depends_on`, `enables` or another broad legacy type merely to avoid introducing a new candidate.

Inverse wording is presentation, not a second fact: one canonical edge may expose a derived inverse label.

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
