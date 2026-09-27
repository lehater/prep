# Context Map

## Purpose

Define the strategic domain decomposition for Prep from the accepted Problem Space, Product Vision and Product Capabilities.

This map owns semantic responsibility boundaries and relationships. It does not imply tactical entities, services, processes, databases, UI surfaces, storage models or deployment units.

## Research basis

The decomposition is informed by established adaptive-learning and competency-modeling patterns:

- adaptive-learning literature commonly separates a domain model, learner model and instructional/adaptation responsibility;
- Knowledge Space Theory separates discipline knowledge structure from an individual's knowledge state;
- 1EdTech CASE models reusable competencies, learning outcomes, relationships and rubrics independently of learner records and delivery systems;
- learner-model research treats learner-specific evidence and state as distinct from reusable subject meaning and instructional policy.

These precedents are evidence for separation of responsibilities, not prescribed implementation models.

## Core bounded contexts

### Knowledge Model

Owns reusable subject knowledge semantics independently of any particular learner, learning target or learning mechanism.

Its responsibility is the identity, meaning, distinctions, relationships and coherence of represented subject knowledge.

It does not own desired learner capability, target-relative learning policy, learner observations or learner-specific state.

The representation is deliberately undecided. This context is not synonymous with a graph, ontology, hierarchy or document model.

### Learning Design

Owns normative and target-relative learning semantics: what the learner is expected to know or be able to do, the material scope/conditions/standard of that expectation, what learning/practice/assessment opportunities and evidence are appropriate, which target-relative gaps matter, and what should receive attention next.

It consumes reusable subject knowledge from Knowledge Model and evidence-backed learner-specific state from Learner Model.

It does not redefine subject knowledge and does not own actual learner performance, observations or learner-specific evidential conclusions.

Learning, practice and assessment design remain together strategically while they share one target-relative responsibility: define the desired outcome, the opportunities to develop or demonstrate it, and the evidence needed to judge progress. A later split requires evidence of independently changing language, lifecycle or consumers.

### Learner Model

Owns learner-specific descriptive and epistemic semantics: actual learner performance and observations, their provenance/context, and evidence-backed interpretation of what can currently be concluded about that learner, including material uncertainty and temporal scope.

It does not redefine reusable subject truth, define the desired target, or decide what the learner should work on next.

The exact inference model, confidence representation and tactical structures are downstream decisions.

## Context relationships

```text
Knowledge Model
      |
      | reusable subject semantics
      v
Learning Design
      |
      | target / learning / practice / assessment intent
      | evidence expectations
      v
learning / practice / assessment execution
      |
      | actual performance / observations
      v
Learner Model
      |
      | evidence-backed learner-specific state / uncertainty
      +-----------------------------------------------> Learning Design
```

The diagram shows semantic information flow, not a required runtime pipeline.

## Supporting and external boundaries

### Authoring and input

People create and maintain Prep's modeled data through user-facing interfaces. Prepared data may also be loaded through an input interface.

Authoring and loading do not create new semantic ownership: each bounded context continues to own the meaning assigned to its data. Automatic source preparation, extraction, derivation, validation and conflict resolution are outside the current product scope unless separately accepted.

### Learning / practice / assessment execution

Actual activity may be executed inside Prep or delegated to external systems. Anki, assessment engines and other runtimes are mechanisms outside the strategic core unless future evidence establishes independently owned product semantics.

External execution can supply observations but does not define Prep's subject, target or learner-state semantics.

### Subject specialization

Technical subjects and future domains may require specialized vocabulary or invariants. They remain specializations/subdomains until such differences cannot be expressed cleanly within the core contexts.

### Quality

Quality rules remain with the context whose truth they protect: knowledge quality with Knowledge Model, learning-design quality with Learning Design, and learner-evidence/state quality with Learner Model. No independent Quality bounded context is currently justified.

## Relationship rules

- Knowledge Model owns reusable subject semantics; learner evidence cannot redefine them.
- Learning Design owns desired learner outcomes, evidence requirements, target-relative gaps, priorities and adaptation decisions.
- Learner Model owns learner-specific observations and evidence-backed conclusions; observations and conclusions remain distinguishable.
- Learner-specific state may inform Learning Design but cannot redefine reusable Knowledge or the target itself.
- A gap exists only relative to a target and learner-specific evidence/state or explicit uncertainty; it is not intrinsic subject knowledge.
- Learning Design references Knowledge Model rather than copying ownership of subject meaning.
- External runtimes do not define Prep's domain semantics.
- No bounded context is automatically a deployable service.

## Strategic uncertainties

The following remain explicit reopening conditions rather than unresolved tactical details:

- split Learning Design only if target/planning, learning/practice or assessment semantics acquire independently changing language, lifecycle or consumers;
- split Learner Model only if raw observation and learner-state interpretation acquire independently valuable public contracts or independent change lifecycles;
- add subject-specific contexts only when specialization can no longer be expressed coherently within the existing boundaries.

Exact capability, task, observation, evidence, inference, gap and priority structures belong to Tactical Domain Design.

## Research references

- ALEKS, Knowledge Space Theory: https://www.aleks.com/about_aleks/knowledge_space_theory
- 1EdTech, Competencies and Academic Standards Exchange (CASE): https://www.1edtech.org/standards/case
- Böck et al., "Learner models: design, components, structure, and modelling", systematic literature review, 2025: https://link.springer.com/article/10.1007/s11257-025-09434-4
- Normadhi et al., "Identification of personal traits in adaptive learning environment: Systematic literature review", Computers & Education 130 (2019): https://www.sciencedirect.com/science/article/pii/S0360131518303026
