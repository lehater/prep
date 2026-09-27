# Data Design

## Purpose

Define the smallest durable representation and persistence constraints that preserve Prep's accepted Knowledge, Learning Design, Learner Model, import-consistency and System Architecture semantics.

Data Design owns physical storage shape and integrity realization. It does not redefine semantic identity, invent learner-state interpretation, select a frontend representation, or turn technical storage records into domain concepts.

## Persistence ownership

The Prep backend is the sole write owner of canonical durable state.

Persistence adapters implement backend/application-facing ports. Browser state, visual projections and the external study runtime are not independent canonical stores.

Durable state is partitioned by semantic ownership even when a single physical database is used:

- Knowledge Model records;
- Learning Design records;
- Learner Model review-history records;
- technical import-identity/idempotency records.

A shared physical store does not create shared semantic ownership.

## Durable Knowledge representation

### KnowledgeNode

Persist at least:

- stable canonical KnowledgeNode identity;
- accepted semantic kind;
- accepted content.

Identity remains independent of label wording, source location, target, learner, visualization position and external-system identity.

### KnowledgeRelation

Persist at least:

- stable relation identity;
- canonical relation predicate/type identifier;
- source KnowledgeNode identity;
- target KnowledgeNode identity.

Source and target are directional and must reference existing KnowledgeNodes.

The persisted predicate must preserve the relation value admitted by Knowledge Model. Storage must not coerce an accepted relation into a generic `related_to` or into another broader predicate merely because a database enum is smaller.

The current classifier distinguishes preferred, candidate and legacy-only vocabulary. Data storage preserves already accepted canonical/runtime relation values; admission of a new relation remains a semantic responsibility upstream.

No graph coordinates, layout, camera, visual edge style or renderer state belongs to canonical Knowledge persistence.

## Durable Learning Design representation

### Requirement

Persist:

- stable Requirement identity;
- accepted Requirement definition/content.

### RequirementSet

Persist:

- stable RequirementSet identity;
- accepted set definition/content where present.

Represent composition with explicit association records:

- RequirementSet → Requirement membership;
- RequirementSet → child RequirementSet membership.

Membership pairs are unique. Direct self-membership is forbidden physically.

The accepted acyclicity invariant for recursive RequirementSet composition must be checked inside the same mutation transaction before a new child-set membership is committed. A storage FK alone is insufficient to establish acyclicity.

### Requirement-to-Knowledge alignment

Persist explicit many-to-many alignment records containing:

- Requirement identity;
- KnowledgeNode identity.

Both identities remain independently owned. The association must not merge or duplicate either semantic object.

### LearningTarget

Persist:

- stable LearningTarget identity;
- accepted target definition/content.

Represent target scope with explicit associations to:

- Requirements;
- RequirementSets.

Target assignment does not copy the owned Requirement/RequirementSet contents into target-owned storage.

### Question

Persist:

- stable Question identity;
- question text;
- direct answer text.

Represent Question-to-Knowledge references as explicit many-to-many associations.

A Question may validly have zero Knowledge alignments. Persistence must not invent a non-null alignment requirement.

Question count, aligned-Question count and similar aggregates are derived facts and are not persisted as semantic coverage judgments.

## Durable Learner Model representation

### ReviewObservation

Persist every accepted ReviewObservation as an append-oriented historical record attributable to exactly one canonical Question.

The durable representation preserves:

- observation identity;
- Question identity;
- occurred-at value;
- rating;
- previous interval;
- next interval;
- duration;
- review phase.

Accepted historical observations are not rewritten in place.

Absence of observations remains absence of evidence. Storage does not materialize inferred mastery, readiness, retention, KnowledgeNode state, Requirement state, gap or priority because those semantics are not accepted in the current Learner Model.

If a future model introduces derived learner state, that state requires its own accepted semantics before persistence is added.

## Technical import identity and idempotency

Import consistency requires repeated delivery of one logical import unit not to create duplicate canonical objects.

Persist technical import-identity evidence sufficient to enforce the accepted resolution hierarchy after the import/application boundary has formed the applicable identity:

1. canonical Prep identity when supplied;
2. stable producer/import identity when supplied;
3. deterministic technical fingerprint fallback.

A practical physical representation may store an opaque normalized import-identity token plus:

- canonical object kind;
- canonical object identity;
- identity method/version where required to interpret the token;
- last accepted representation fingerprint when needed to distinguish duplicate delivery from conflicting changed content.

The exact producer-key namespace/canonicalization algorithm remains owned by the import representation/implementation contract. Data Design requires only that the resulting technical identity be durable and unique at the accepted idempotency boundary.

A technical fingerprint is duplicate-control evidence, not semantic identity.

## Uniqueness and referential integrity

Required physical constraints include:

- unique canonical identity for every canonical object;
- unique KnowledgeRelation identity;
- valid KnowledgeRelation source/target references;
- unique RequirementSet membership pair;
- unique Requirement-to-Knowledge alignment pair;
- unique Question-to-Knowledge alignment pair;
- unique LearningTarget-to-Requirement assignment pair;
- unique LearningTarget-to-RequirementSet assignment pair;
- every ReviewObservation references an existing Question;
- technical import identity is unique for the object-kind/idempotency boundary it represents.

Association records must use canonical identities rather than copies of mutable display content.

Foreign keys or equivalent storage guarantees are appropriate where they preserve these accepted reference constraints. They do not transfer semantic ownership to Data Design.

## Transaction boundaries

### Canonical single-item mutation

One accepted canonical object mutation and the owner-local association changes required to keep that same operation valid commit atomically.

A rejected mutation leaves the prior accepted durable state intact.

### Bulk prepared input

The bulk container is not one transaction.

After envelope acceptance, each import item is its own transaction:

- the item commits completely, or
- the item is rejected without partial durable application.

Failure of one peer item does not roll back already accepted independent peers.

References that are required for an item must resolve before that item commits.

### Concurrent import identity

Concurrent attempts to create the same resolved technical identity must be serialized by a uniqueness/locking mechanism so both cannot create canonical duplicates.

When the same stable identity is concurrently presented with incompatible content, storage must provide enough atomic compare/read-write behavior for the application/import layer to surface a conflict instead of silently applying last-writer-wins.

The concrete mechanism may be a uniqueness constraint, transactional lock, compare-and-swap revision or another database-supported primitive; the semantic requirement is conflict visibility, not a mandated database feature.

## Technical revision/version fields

A storage implementation may use opaque row revisions or equivalent concurrency tokens to detect stale writes.

Such values are technical concurrency evidence only:

- they are not domain identity;
- they do not become user-visible semantic versions unless another accepted contract says so;
- they must not replace the accepted conflict semantics.

## Derived/query data

Indexes, search structures, materialized projections and caches are allowed when they can be rebuilt from canonical durable state and do not become a second semantic source of truth.

Examples include:

- text-search indexes;
- relation traversal indexes;
- target-resolution query indexes;
- aggregate review-statistic projections.

A cached or materialized projection must not turn:

- graph geometry into Knowledge semantics;
- Question count into learning coverage;
- review statistics into mastery/readiness;
- visual selection/focus into canonical state.

## Persistence history and deletion

ReviewObservation history is append-oriented because accepted learner evidence is historical and must not be rewritten.

The authorized read set does not define a general retention, archival, backup or deletion policy for other canonical data. Data Design therefore does not invent one.

Implementations must not silently introduce semantic deletion/expiry behavior. If product/security/operability requirements later require retention or erasure policy, that policy must be accepted by the owning Authority before Data Design changes its lifecycle rules.

## Schema evolution

Concrete database technology, ORM, migration framework and physical storage types are implementation freedoms.

Schema evolution must preserve:

- canonical identities;
- relationship direction/type;
- RequirementSet acyclicity;
- explicit alignments/assignments;
- historical ReviewObservation attribution;
- import idempotency/conflict evidence.

The current architecture has no accepted mixed-version coexistence or distributed schema-transition requirement. If a future release requires a materially observable coexistence/migration window, that transition semantics must be routed to its owning design boundary before implementation.

## Physical model sketch

The following names are descriptive physical responsibilities, not mandated SQL identifiers:

```text
knowledge_node
knowledge_relation

requirement
requirement_set
requirement_set_requirement
requirement_set_child_set
requirement_knowledge_alignment

learning_target
target_requirement
target_requirement_set

question
question_knowledge_alignment

review_observation

import_identity
```

A single relational store can satisfy the current invariants, but no concrete database engine is selected here. Another storage technology is acceptable only if it preserves the same identity, reference, transaction and history constraints.

## Reopening conditions

Revisit Data Design when accepted semantics introduce any of:

- learner-state or retention inference requiring durable derived state;
- semantic coverage judgments;
- provenance/source ownership requiring durable records;
- multi-user ownership or authorization;
- cross-item import transactions;
- distributed/multi-writer canonical storage;
- accepted deletion/retention obligations;
- mixed-version schema coexistence;
- a new learning-artifact family with independent durable identity.

## Consequences

The persistence model stays close to accepted semantic identities and relationships while keeping technical aids—indexes, revisions, import fingerprints and caches—explicitly non-semantic.

Frontend and visualization work can project the same canonical data in different forms without causing storage to privilege graph layout or any other presentation choice.
