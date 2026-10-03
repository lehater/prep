# Knowledge Model

## Purpose

Define the reusable **Subject Knowledge** semantics of Prep independently of one learner, preparation target, capability requirement, practice event, storage model, graph layout, or interface representation.

The model preserves subject meaning. It does not decide how that meaning is rendered, filtered, ranked, persisted, or used to infer learner capability.

## Core semantic family

### Knowledge

`Knowledge` is the semantic family of reusable subject meaning.

The minimal model has two independently addressable forms:

```text
Knowledge
  = KnowledgeObject
  | KnowledgeProposition
```

This split is semantic, not a storage or UI schema.

### KnowledgeObject

A `KnowledgeObject` is a coherent reusable subject-semantic object with stable semantic identity.

Examples:

- Idempotency
- Linux cgroups
- Resource isolation
- CPU performance troubleshooting
- Quadratic equations
- DCF valuation

A KnowledgeObject may carry an optional open `knowledge_form` classification such as:

- concept
- mechanism
- procedure
- strategy
- model
- property

The vocabulary is intentionally open and non-exhaustive. A semantic form is descriptive classification, not a mandatory entity subtype.

Relational roles are distinct from semantic form. For example:

- `A --addresses--> B` may make A a solution/response relative to problem B;
- `A --realizes--> B` may make A a concrete realization relative to abstraction B.

Those roles do not permanently turn A or B into global `Solution`, `Problem`, `Implementation`, or `Abstraction` types.

### KnowledgeProposition

A `KnowledgeProposition` is an independently addressable reusable subject proposition.

Conceptually:

```text
KnowledgeProposition
    participants?
    conditions?
    predicate / conclusion
    provenance_or_support?
```

Examples:

- CPU quota constrains runnable CPU time.
- A payment timeout does not imply payment failure.
- A right triangle satisfies a² + b² = c².

A proposition may be relational or non-relational.

Provenance/support may justify acceptance or later correction, but source location, document path, or source identity does not by itself define Knowledge identity.

## Relational Subject Knowledge

Relational subject meaning is represented as a `KnowledgeProposition`, not as a generic graph edge entity.

`docs/domain/relation-classification-catalog.yaml` provides the reusable predicate vocabulary and classifier for relational propositions.

A relational proposition conceptually contains:

```text
KnowledgeProposition
    predicate
    participants
    conditions?
    provenance_or_support?
```

The predicate is vocabulary. The proposition is the asserted subject meaning.

Therefore:

- registering `causes`, `part_of`, `realizes`, or another predicate does not assert a relation;
- relation direction and inference properties belong to that predicate's semantics;
- no family-level label creates automatic necessity, sufficiency, symmetry, transitivity, or composition;
- unsupported relations produce no proposition;
- a supported relation without a fitting accepted leaf remains a classification candidate rather than being forced into a generic edge.

## Identity

Knowledge identity is semantic, not representational.

The following do **not** by themselves create new Knowledge identity:

- wording, label, alias, or language;
- source file or source location;
- learner;
- preparation target;
- Capability or CapabilitySpecification that references the Knowledge;
- Task, Performance, Observation, or assessment event;
- graph position, cluster, coordinates, dimensionality, or visual layout;
- current filter, selected scope, focus, or interface route;
- external study-system/card identity.

A material change in reusable subject meaning may create new semantic identity.

## Scope, overview, and depth

The accepted product requires overview, meaningful scope changes, and movement between orientation and deeper detail. These do not require additional fundamental Knowledge entities.

### Overview

A high-level overview is a projection over selected KnowledgeObjects and KnowledgePropositions that preserves enough semantic relationships to explain how the selected subject area fits together.

It is not a separate `KnowledgeOverview` truth object.

### Scope

A considered knowledge scope is a contextual selection/projection over reusable Knowledge.

The same Knowledge may participate in many scopes. Narrowing or expanding a scope does not clone or mutate Knowledge.

"Relevant" and "important" are contextual judgments supplied by Preparation Direction/Application behavior; they are not intrinsic immutable properties of Knowledge.

### Depth

Overview-versus-detail is not a universal global level attached to every Knowledge object.

Moving deeper may disclose:

- more specific KnowledgeObjects;
- additional propositions;
- partitive/taxonomic/causal or other accepted semantic relationships;
- richer conditions or explanatory detail.

Moving upward may hide detail while preserving surrounding semantic context.

The exact disclosure/navigation mechanism belongs downstream to interface/presentation design.

## Boundary with Capability & Performance

Subject Knowledge and Capability & Performance are separate model languages.

Capability/performance semantics may reference Knowledge that an expected performance concerns, explains, applies, reasons about, or otherwise focuses on.

That cross-context relationship is **not** a Subject Knowledge predicate merely because one endpoint is Knowledge.

In particular, Prep must not encode target requirements, Capability-to-Knowledge focus, support-fit, learner evidence, or learner-state claims as relational KnowledgePropositions in order to reuse the Knowledge graph.

The owning Capability & Performance / translation semantics define those cross-context links.

## Boundary with learner evidence

Learner success, failure, observations, confidence, ratings, or inferred state cannot mutate reusable Subject Knowledge truth.

An Observation may reference Knowledge for context, but that does not make the Observation a KnowledgeProposition.

## Bootstrap and correction

Fragmented sources may produce candidate KnowledgeObjects, KnowledgePropositions, relation classifications, aliases, or corrections.

Acceptance into Subject Knowledge requires preserving semantic identity and relation meaning. A correction that materially changes reusable meaning may require a new semantic identity rather than silently rewriting historical meaning.

Bootstrap mechanics and source extraction do not become owners of accepted Knowledge truth.

## Graph boundary

A graph is one possible projection of Subject Knowledge relationships.

The domain model does **not** require:

- a graph database;
- a universal `KnowledgeNode` carrier;
- a first-class generic `KnowledgeRelation` entity;
- 2D or 3D rendering;
- spatial coordinates;
- one graph as the universal product interface.

A graph UI remains available as a downstream presentation hypothesis because the underlying semantics preserve addressable objects and meaningful relationships.

## Invariants

- reusable subject meaning does not change because one learner succeeds or fails;
- KnowledgeObject and KnowledgeProposition are distinct semantic forms;
- semantic form and relation-derived role are distinct;
- a predicate is vocabulary; an asserted relation is a KnowledgeProposition;
- absence of a proposition is not evidence for its negation;
- relation-specific inference rules are never inherited merely from a family;
- cross-context structural links are not reclassified as Subject Knowledge relations;
- scope/focus/depth changes do not mutate Knowledge identity;
- graph/layout/presentation changes do not mutate Knowledge identity;
- source provenance may support acceptance but does not define semantic identity;
- Knowledge remains reusable beyond one target, learner, task, performance, or interface representation.

## Not fundamental in the current model

The following are not current fundamental Subject Knowledge entities:

- KnowledgeNode as a universal undifferentiated carrier;
- KnowledgeRelation as a generic edge entity;
- KnowledgeAssertion separate from KnowledgeProposition;
- KnowledgeRequirement;
- KnowledgeUseRequirement;
- KnowledgeSupportProfile;
- KnowledgePattern;
- KnowledgeSchema;
- KnowledgeOverview;
- KnowledgeDepthLevel;
- target-relative KnowledgeImportance;
- graph coordinates or clusters;
- mandatory closed Concept/Mechanism/Procedure/Strategy entity hierarchy.

A future accepted counterexample may justify adding a distinction when the minimal model causes material semantic loss.
