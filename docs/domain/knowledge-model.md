# Knowledge Model

## Purpose

Define reusable subject semantics independently of one learner, learning target, task execution, assessment design, storage model or presentation.

## Core concepts

### Knowledge

`Knowledge` is the semantic family of reusable subject meaning. The current minimal model has two independently addressable forms.

### KnowledgeObject

A reusable coherent subject-semantic object with stable semantic identity.

Examples:

- Idempotency
- Linux cgroups
- Resource isolation
- Quadratic equations
- CPU performance troubleshooting
- DCF valuation

A KnowledgeObject may have an optional open `knowledge_form` classification such as:

- `mechanism`
- `procedure`
- `strategy`

The classification is open and non-exhaustive. `concept` and `model` are not mandatory semantic kinds.

### KnowledgeProposition

An independently addressable reusable proposition.

A proposition may contain:

```text
KnowledgeProposition
    participants?
    conditions?
    predicate / conclusion
```

Examples:

- CPU quota constrains runnable CPU time.
- A payment timeout does not imply payment failure.
- A right triangle satisfies a² + b² = c².

Relational knowledge is represented by the same construct:

```text
KnowledgeProposition
    predicate
    participants
    conditions?
```

Relation predicates such as `causes`, `part_of`, `represents` and `realizes` are vocabulary/schema-level semantics. They are not separate Knowledge entities.

## Relation vocabulary

`docs/domain/relation-classification-catalog.yaml` is a predicate vocabulary and classification aid for relational KnowledgePropositions.

A registered predicate does not create an assertion by itself. A relational proposition exists only when the proposition has independently supported semantic content.

Predicate metadata may specify direction, symmetry or transitivity. No relation inherits transitivity, necessity, sufficiency or composition semantics merely because another relation has them.

## Boundary with capability semantics

Knowledge may be the direct semantic object of a performance expectation. That cross-model relation is owned by Learning Design as `focuses_on`.

Knowledge may also be useful in one or more competent realizations of a Capability. PREP does not model that as a structural `KnowledgeUse` edge on Capability. When such reusable domain meaning matters, it is expressed as a KnowledgeProposition, for example:

```text
Knowledge K can support realization of Capability C
in role R under conditions A.
```

This does not imply that K is necessary, sufficient, memorized, used in every performance, or the only valid realization strategy.

## Identity

Knowledge identity is semantic, not representational.

Changing presentation, target, learner, task instance, external study-system identity or graph position does not create new Knowledge.

A material change in the reusable subject meaning may create new Knowledge identity.

## Invariants

- reusable subject meaning does not change because one learner succeeds or fails;
- learner observations cannot mutate reusable subject truth;
- KnowledgeObject and KnowledgeProposition are distinct semantic forms;
- a relational predicate is vocabulary, while a relational assertion is a KnowledgeProposition;
- a relation is not transitively inherited unless its own semantics explicitly support that inference;
- `part_of`, `causes`, `represents`, `realizes` and other predicates keep their own distinct semantics;
- absence of a relation assertion is not evidence for its negation;
- Knowledge is reusable beyond one concrete Task, Performance, learner or LearningTarget.

## Removed from the core model

The following are not current fundamental Knowledge entities:

- KnowledgeNode as a universal undifferentiated carrier;
- KnowledgeRelation as a Knowledge entity;
- KnowledgeAssertion;
- KnowledgeRequirement;
- KnowledgeUseRequirement;
- KnowledgeSupportProfile;
- KnowledgePattern;
- KnowledgeSchema;
- mandatory `Concept` or `Model` semantic kinds.

They may reappear only if a future counterexample demonstrates an independently necessary semantic distinction.
