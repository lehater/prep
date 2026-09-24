# Context Map

## Purpose

Define the initial strategic domain decomposition for Prep: which meanings and business rules belong together, and how those areas relate. This map does not imply services, processes, databases, UI surfaces or implementation components.

The boundaries are intentionally provisional at this stage. They should be refined only when modeling a context reveals a semantic boundary that this map does not capture.

## Core bounded contexts

### Knowledge Acquisition

Owns the transition from source material or other knowledge inputs to reviewable candidate knowledge.

Its language concerns sources, source context, extracted claims/candidates, uncertainty and evidence about what the source says.

It does not decide the canonical structure of subject knowledge and does not own learner state.

### Knowledge Modeling

Owns the reusable representation of subject knowledge independently of any particular learner or learning mechanism.

Its language concerns knowledge identity, concepts or other knowledge units, distinctions, properties, relationships, explanatory content and the coherence/quality of the represented subject.

The exact representation is deliberately undecided. This context is not synonymous with a graph.

### Learning Design

Owns the interpretation of a learning target into what should be learned and what learning or evidence forms are appropriate for the intended depth.

Its language concerns learning targets, required knowledge, expected learner capability, gaps relevant to the target, learning material and practice/assessment intent.

It may reference knowledge owned by Knowledge Modeling but does not redefine that subject knowledge.

### Learning State

Owns evidence about an individual learner and the changing interpretation of that evidence over time.

Its language concerns attempts/retrieval/performance evidence, current evidence-backed state, retention uncertainty, progress and priorities for subsequent learning.

It references learning targets and modeled knowledge but does not mutate their semantic truth.

## Context relationships

```text
sources / inputs
      |
      v
Knowledge Acquisition
      |
      | candidate knowledge + source evidence
      v
Knowledge Modeling
      |
      | reusable subject knowledge
      v
Learning Design
      |
      | target-specific learning intent
      v
Learning State
      |
      +---- evidence / changed priorities ----+
                    |                         |
                    +------> Learning Design -+
```

The diagram shows the main semantic flow, not a required runtime pipeline.

## Relationship rules

- Knowledge Acquisition may propose knowledge; Knowledge Modeling decides how accepted subject knowledge is represented.
- Knowledge Modeling owns subject semantic truth independently of learner progress and study-tool state.
- Learning Design references subject knowledge rather than copying ownership of it.
- Learning State owns learner-specific evidence and derived state, not subject knowledge.
- Evidence from Learning State may change target-specific priorities without changing the meaning of the underlying knowledge.
- No bounded context is automatically a deployable service.
- Integration identities and contracts are downstream design concerns; this map establishes ownership only.

## Cross-cutting concerns not yet promoted to bounded contexts

### Quality control

Quality exists inside each semantic area: source/extraction quality, knowledge-model quality, learning-material quality and learner-evidence quality. Current evidence does not justify a separate Quality bounded context.

### Subject specialization

Technical interview preparation, English listening and future subjects can require specialized learning semantics. At this strategic level they are treated as potential specializations or subdomains rather than automatically as top-level bounded contexts.

A separate subject bounded context should be introduced only when the subject owns vocabulary and invariants that cannot be expressed cleanly within the core contexts.

### External study systems

Anki and other study runtimes are external mechanisms, not bounded contexts in the core domain. Whether Prep executes learning directly or delegates some activity through adapters is an architecture decision.

## Strategic uncertainties

The following boundaries require validation during domain modeling:

- whether Knowledge Acquisition is sufficiently rich to remain a bounded context rather than an application capability around Knowledge Modeling;
- whether Learning Design should later split target/planning semantics from learning-material design;
- where prioritization belongs when it combines target requirements with learner evidence;
- which subject-specific semantics justify their own bounded contexts;
- whether retention scheduling is owned by Learning State or delegated to an external learning runtime.

These uncertainties are explicit so that downstream modeling can refine the map rather than treating the current decomposition as permanent.
