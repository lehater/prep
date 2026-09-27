# Model Context Strategy

## Purpose

Define where Prep's independently modeled domain languages apply and how they relate, without re-owning tactical internals, application orchestration or technical realization.

## Contexts

### Knowledge Model

Owns reusable subject meaning independent of one learner, target, task execution or presentation.

Its tactical vocabulary includes KnowledgeObject, KnowledgeProposition and schema-level relation predicates.

### Learning Design

Owns reusable semantics for capability expectations, capability scope/standard, task and observation design, evidence requirements/warrants, assessment design and target capability profiles.

Its tactical vocabulary includes Capability, CapabilitySpecification, TaskSpecification, Task, ObservationSpecification, EvidencePattern, EvidentialWarrant, SamplingSpecification, AssessmentDesign, LearningTarget and RequirementExpression.

This context specifies what competent performance and admissible evidence mean. It does not own actual learner performance or learner-specific capability claims.

### Learner Model

Owns learner-specific actual events, observations and evidence-backed claims.

Its tactical vocabulary includes Performance, Observation, CapabilityEvidenceArgument and LearnerCapabilityClaim.

It records the distinction between observed facts and inferential conclusions rather than treating external review statistics as direct learner state.

## Relationships

- Knowledge Model provides reusable subject semantics to Learning Design.
- Learning Design may define PerformanceExpectations that directly `focuses_on` reusable Knowledge without taking ownership of Knowledge identity.
- Learning Design defines reusable Capability and evidence/assessment semantics consumed by Learner Model.
- Learner Model records actual Performance and Observation and may form Claims only through applicable EvidentialWarrants.
- Learner Model does not mutate reusable Knowledge, Capability, TaskSpecification or assessment semantics.
- LearningTarget is normative; LearnerCapabilityClaim is epistemic.
- external runtimes may execute work or provide observations, but they do not own these model semantics.

## Boundary invariants

- reusable subject truth and learner-specific epistemic state remain distinct;
- normative target semantics and descriptive/inferential learner semantics remain distinct;
- design-time Task/Observation/EvidencePattern semantics and actual Performance/Observation semantics remain distinct;
- context boundaries describe semantic ownership, not deployable-service boundaries;
- translation across contexts preserves participating identities rather than collapsing them.

## Current boundary decision

The three-context split remains sufficient for the current conceptual model.

Assessment semantics do not require a fourth Assessment Model context yet. Design-side assessment constructs participate in the same reusable question: what capability is targeted, what performance opportunity is created and what evidence pattern licenses an inference. They therefore remain in Learning Design.

Actual performance, observation and learner-specific inferential arguments have independent token identity and lifecycle; they remain in Learner Model.

A later split is justified only if assessment or another semantic family develops independently changing language/invariants that cannot be owned coherently by these contexts.

## Reopening conditions

Reassess the boundaries if:

- assessment design gains an independent lifecycle and consumers that change separately from Capability/Task semantics;
- actual evidence must be shared across materially different learner-state models with incompatible semantics;
- new learning-material semantics require independently owned identity/invariants rather than being Task or presentation concerns.
