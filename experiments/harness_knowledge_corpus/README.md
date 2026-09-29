# Harness Knowledge Corpus Spike v0

Status: experimental; isolated fixture/projection spike.

## Purpose

Test whether the real `lehater/harness` domain can replace synthetic Knowledge
fixtures as a realistic Prep corpus without changing the Prep Knowledge domain
model or inventing a Harness-specific ontology.

The spike intentionally separates:

1. source-backed Harness semantic knowledge;
2. Prep's current frontend read-model;
3. projection loss between them.

It does not make the fixture a second Harness source of truth.

## Baselines

Prep:

```text
branch   fix/user-centered-product-flow
commit   593a2b5e3822d34860d48821ad5e89db3de0aa0e
```

Spike branch:

```text
experiment/harness-knowledge-corpus-spike
```

Harness source baseline:

```text
lehater/harness
main @ bdec95ddf2e5fb9f4a5359c93ceb285917237f3b
```

The Prep baseline already pins this same Harness revision through
`.harness-version`.

## Fixture boundary

The spike uses semantic concepts/mechanisms/procedures as Knowledge and keeps
implementation files, specs and research documents as provenance.

Examples:

```text
Semantic Derivation
    -> Knowledge

spec/semantic-derivation/semantic-derivation-v1.yaml
    -> canonical source/provenance

semantic_derivation.py
    -> implementation evidence
```

A Python module, class, YAML file or Scenario Suite scenario is not converted
into a Knowledge node merely because it exists.

## Corpus

Fixture:

`web/src/adapters/mock/mockHarnessKnowledgeFixture.ts`

Current corpus:

```text
Knowledge objects     36
semantic relations    64
unique Harness paths  33
```

All 33 referenced source paths were checked against the pinned Harness commit
and exist there.

Representative groups:

- Harness/Core;
- Engineering Graph and target-state;
- managed knowledge / artifact production;
- semantic acceptance/admission/derivation/currentness;
- source-set/boundary/coverage assurance;
- Engineering Coverage;
- Decision Governance;
- Scenario Suite;
- Graph Doctor;
- Human Documentation Projection;
- frontend design model.

The fixture stores stable semantic IDs such as:

```text
harness.core.authority
harness.engineering-graph
harness.semantic.derivation
harness.source.boundary
harness.scenario-suite
```

Git revision is snapshot provenance and is not part of semantic identity.

## Relation evidence

Every relation records:

```text
sourceId
predicate
targetId
evidenceMode = extracted | curated
sources[]
condition?
sourceNativePredicate?
projectionType?
```

`extracted` means the relation follows directly from the selected Harness
source.

`curated` means a human semantic normalization/classification was required.

Example:

```text
Harness:
CanonicalArtifact provides CapabilityId

Prep classification:
CanonicalArtifact realizes CapabilityId

evidenceMode: curated
sourceNativePredicate: provides
predicate: realizes
```

The native statement remains visible instead of being silently rewritten.

## Current Prep projection result

The existing frontend relation model is:

```text
addresses
uses
specializes
part_of
depends_on
realizes
produces
derives_from
enables
```

The spike projects a Harness relation only when the current representation can
express it without semantic substitution and when no proposition condition
would be lost.

Result:

```text
source relations        64
projected relations     15
explicit projection loss 49
```

Projected predicates:

```text
part_of
realizes
produces
```

Important unrepresentable predicates include:

```text
requires
evaluates
represents
owns
blocks
addressed_to
tests
```

Conditional propositions are also rejected from the flat edge projection.

Examples:

```text
Semantic Derivation
    requires Semantic Judgement
    IF semantic_judgement.required == true

Engineering Coverage
    requires Subject Obligation
    IF subject_inventory == REQUIRED
```

The current edge shape cannot preserve these conditions.

## Why legacy relations are not used as fallbacks

The spike deliberately does not map:

```text
requires     -> depends_on
tests        -> uses
blocks       -> enables
represents   -> derives_from
```

Prep's canonical relation-classification catalog already marks broad
`uses`, `depends_on`, `enables` and `derives_from` as legacy/family-level
vocabulary rather than preferred precise leaves.

Using them here would make the graph visually fuller while making its semantics
less correct.

## End-to-end current-contract test

Test:

`web/src/adapters/mock/mockHarnessKnowledgeFixture.test.ts`

The test injects the projected fixture into an empty `MockCurationStore` and
runs the existing `MockKnowledgeAdapter`.

It verifies:

- stable unique semantic node identities;
- source-backed relations;
- explicit extracted/curated distinction;
- explicit projection-loss accounting;
- global list/search;
- detail lookup;
- graph projection;
- graph focus;
- target-scoped exploration;
- focus-scoped exploration.

The target test deliberately creates a Prep learner capability:

```text
cap-harness-semantic-assurance
```

rather than reusing Harness `CapabilityId`.

This proves the required boundary:

```text
Harness CapabilityId
    = subject knowledge inside the Harness domain

Prep Capability
    = learner performance expectation
```

The two models must not be merged by name.

## Domain-model result

The spike does not expose a need for a new universal Prep `KnowledgeNode`.

The existing canonical distinction remains sufficient:

```text
KnowledgeObject
KnowledgeProposition
```

The real loss occurs later, in the current frontend projection:

```text
canonical KnowledgeProposition
        ↓
flat KnowledgeRelationModel
        ↓
{ sourceId, targetId, enum type }
```

The read-model currently drops:

- predicates outside its small enum;
- proposition conditions;
- proposition-level provenance;
- extracted/curated evidence status;
- source-native predicate information.

Therefore changing the domain model before improving the projection would solve
the wrong problem.

## Source-of-truth boundary

The intended dependency is:

```text
Harness repository @ pinned revision
        ↓
derived source-backed fixture
        ↓
Prep Knowledge projection
```

The fixture does not establish Harness truth.

Harness may later validate reproducibility/loss of this derivation, but such a
check proves only integrity of the representation relative to the selected
source baseline.

It cannot be used as self-certification that Harness itself is correct.

## Findings

### P0 — Preserve proposition semantics before widening UI

A production Harness corpus must not be persisted only as the current flat
frontend edge model. The current projection loses 49 of 64 relations in this
representative corpus.

### P0 — Do not use legacy broad predicates as compatibility aliases

Doing so would hide the exact semantic gap demonstrated by the spike.

### P1 — Rich provenance belongs to a projection/read contract

The current Knowledge domain model already has the correct semantic boundary.
Repository/commit/path/source evidence should be exposed through an enriched
read projection rather than added as universal Knowledge semantics.

### P1 — Conditional relations are a real requirement

Harness immediately supplies real examples where relation truth depends on a
condition. A future relation projection must preserve that information or make
the loss explicit.

### P1 — Harness and Prep Capability have different responsibilities

Harness CapabilityIds belong to the corpus being learned. Prep Capabilities
describe what a learner must be able to perform.

### P2 — Import is not the first integration boundary

The current mock import contract is not needed to prove corpus value. Direct
fixture projection is smaller and avoids mixing import identity questions into
the semantic experiment.

## Spike verdict

The real Harness corpus is useful and materially more discriminating than the
existing synthetic fixtures.

It validates the original hypothesis but changes the location of the next
problem:

```text
NOT:
Prep needs a richer universal Knowledge domain model

BUT:
Prep needs a less lossy Knowledge proposition/read projection
if real semantic corpora are to be represented faithfully.
```

No Harness change is justified.

No Prep domain-model change is justified by this spike.

## Next experiment

Before changing production contracts, define the smallest read projection that
can preserve one real `KnowledgeProposition`:

```text
id
predicate
participants/source+target
conditions?
provenance
classification/evidence mode
```

Then project the same 64 Harness relations again.

Success criterion:

- the richer read projection represents the corpus without semantic aliases;
- list/search/detail/graph still derive from the same canonical Knowledge
  identities;
- the 3D renderer receives only presentation fields;
- non-spatial detail exposes proposition meaning and provenance;
- no new universal domain entity is introduced.
