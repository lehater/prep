# Learner Model

## Purpose

Define the learner-specific **Learner Evidence & State** semantics of actual performance, observations, explicit evidential reasoning, and capability conclusions.

This model preserves the distinction between:

- what actually happened;
- what was observed;
- what conclusion is being considered;
- why the observations bear on that conclusion;
- what remains unknown or challenged.

It does not redefine reusable Capability & Performance, Preparation Target, Subject Knowledge, practice design, application workflow, or UI presentation.

## Performance

```text
Performance
    participants*
    temporal_extent
    actual_conditions
    actions_or_trace*
    work_products*
    expressed_reasoning?
    provenance
```

A `Performance` is one concrete historical execution event: what actually happened.

Repeated execution creates a new Performance even when the same person performs under apparently similar conditions.

`actual_conditions` records what is known about the real conditions. Unknown conditions remain unknown.

A Performance may be:

- individual;
- collaborative;
- tool-mediated;
- long-running;
- incomplete;
- produced inside Prep;
- produced in a supported external runtime;
- produced by natural work outside any prepared task.

A Performance is not a Capability and does not by itself establish that a learner possesses or lacks a Capability.

Internal reasoning is not directly observable. Only expressed reasoning, actions, traces, work products, and other externally attributable features may become Observation subjects.

## Observation

```text
Observation
    performance
    about: 1..*
    assertion_or_value
    observed_at?
    provenance
    semantic_context_refs*
```

An `Observation` is an attributed observation token about one Performance or part of it.

`about` may identify:

- the Performance as a whole;
- a participant;
- an attributed action;
- a trace segment;
- a work product;
- part of a work product;
- expressed reasoning.

Two raters or evaluation procedures may create distinct Observations even when their assertions are textually identical.

An Observation is not a truth oracle.

It does not by itself imply:

- Capability possession;
- Capability absence;
- target readiness;
- durable retention;
- transfer;
- a learner-state classification.

`semantic_context_refs` may point to reusable Capability or Subject Knowledge identities for interpretation. Those references do not mutate the referenced semantics.

## LearnerCapabilityClaim

```text
LearnerCapabilityClaim
    learner
    capability_scope
    polarity: positive | negative
    time_scope
```

A `LearnerCapabilityClaim` is an explicit learner-specific proposition about reusable Capability & Performance meaning.

`capability_scope` identifies the Capability semantics, relevant condition scope, and required standard or quality scope to which the claim applies.

A positive claim means the learner possesses the specified Capability within that scope and time.

A negative claim means the learner does not possess the specified Capability within that scope and time.

A claim is admissible only when at least one accepted `CapabilityEvidenceArgument` supports that exact claim.

Absence of a claim is not a negative claim.

A learner claim has no intrinsic:

- confidence score;
- posterior probability;
- generic mastery percentage;
- proficiency scalar;
- `unknown` polarity.

Uncertainty is represented by the state of available evidence and arguments, not by fabricating a claim.

## CapabilityEvidenceArgument

```text
CapabilityEvidenceArgument
    observations: 1..*
    claim
    bearing: supports | challenges

    applicability:
        capability_relevance
        observed_vs_claim_conditions
        temporal_applicability
        coverage_or_transfer_limits?
        dependence_considerations?
        target_relevance?

    reasoning
    provenance
    created_at
    procedure_or_model_ref?
```

A `CapabilityEvidenceArgument` is one inspectable inferential application connecting actual Observations to one LearnerCapabilityClaim.

It is a token with its own provenance because the same observations may be interpreted differently under different accepted procedures, assumptions, model versions, or contexts.

### Why there is no fundamental EvidentialWarrant

Current accepted upstream semantics require inspectable justification, but do not establish an independent reusable Assessment/Evidence Design context.

Therefore the core learner model records the justification **directly on the evidence argument** rather than requiring a reusable `EvidentialWarrant` entity.

If stable warrant/pattern/sampling rules later gain independent lifecycle and consumers, Model Context Strategy must be reopened before promoting those rules into their own reusable model language.

### Validity conditions

An accepted evidence argument must make inspectable:

1. which Observations it uses;
2. which exact learner-capability claim it bears on;
3. whether it supports or challenges that claim;
4. why the observed performance is relevant to the Capability semantics;
5. how observed conditions compare with the claim's condition scope;
6. why the evidence is temporally applicable to the claim's time scope;
7. material coverage, transfer, dependence, or provenance limitations;
8. any target-relative relevance used in the interpretation.

Unknown or unsupported applicability remains explicit.

No missing condition or contextual fact may be invented merely to make an argument fit.

### Supporting and challenging arguments

A supporting argument permits the corresponding claim to exist when the argument is accepted.

A challenging argument contests a claim but does not automatically establish the opposite claim.

Supporting and challenging arguments may coexist.

Conflicting arguments remain inspectable rather than being silently collapsed into one scalar score.

## Learner-state projection

Learner state is a projection over currently applicable claims and evidence arguments, not a separate mutable `CapabilityState` truth object.

For a capability scope relevant to the current preparation target, the product may project:

### demonstrated

There is currently applicable accepted support for the relevant positive claim, with no unresolved challenge that prevents using that claim for the current decision.

### challenged

Accepted evidence materially challenges the relevant positive claim, or an applicable supported negative claim exists.

`challenged` does not mean globally incapable.

### unknown

Current applicable evidence is insufficient to establish either a usable positive or negative conclusion for the required scope.

Unknown includes cases such as:

- no evidence;
- stale evidence;
- insufficient condition coverage;
- unresolved conflict;
- unknown execution conditions;
- transfer mismatch;
- evidence relevant to a different Capability scope.

A projection may expose more detailed argument structure; these three states are not universal stored enum identity.

## Temporal semantics, retention, and transfer

Performance time, Observation time, argument creation time, and claim time scope are distinct.

Old evidence does not automatically establish current capability.

A current capability claim does not automatically apply indefinitely.

Retention and transfer require explicit evidential applicability:

- evidence from one occasion does not automatically establish consistency over time;
- repeated observations are not automatically independent;
- performance in one condition scope does not automatically generalize to another;
- familiar-task evidence does not automatically establish novel-task performance;
- successful practice immediately after learning does not automatically establish delayed retention.

An evidence argument that supports durable or transferable capability must make the temporal and condition-generalization basis inspectable.

## Target relevance

Learner capability claims are about the learner and reusable Capability semantics, not intrinsically about one Preparation Target.

Preparation Direction may project accepted claims against target requirements.

Evidence arguments may record target relevance when that relevance affects interpretation, but target changes do not rewrite historical Performance, Observation, or Claim identity.

A role-capability target and an interview target may therefore consume the same learner evidence differently when their required performance scopes differ.

## Individual and collaborative performance

A group Performance does not automatically support an individual learner Capability claim.

An individual claim requires:

- attributable learner behavior, trace, work product, or expressed reasoning;
- enough provenance to identify the attribution;
- an evidence argument whose applicability supports individual inference.

The mere fact that the learner participated in a successful group outcome is insufficient.

## Knowledge boundary

Performance and Observation may reference Subject Knowledge for semantic context.

They cannot:

- modify reusable Knowledge truth;
- convert learner error into a Knowledge proposition;
- convert confidence/familiarity into a Knowledge property;
- encode Capability claims as Subject Knowledge relations.

## Practice and application boundary

Learning/practice/diagnostic execution may produce Performances and Observations.

The learner model does not own:

- reusable task/practice design;
- concrete application task flow;
- session/navigation state;
- external-runtime orchestration;
- screen or interaction design.

Imported runtime records become canonical Performance/Observation semantics only when their actual meaning, attribution, conditions, time, and provenance can be preserved faithfully.

Otherwise they remain integration-boundary records until a supported translation exists.

## Evidence role

Prep does not require a universal `Evidence` entity.

An Observation becomes evidence **for a claim** only through an accepted CapabilityEvidenceArgument.

The same Observation may participate in multiple arguments.

This permits one historical event to bear differently on:

- different Capability scopes;
- different condition scopes;
- different time scopes;
- different target purposes.

## Invariants

- Performance is a historical event, not a Capability state;
- repeated execution creates a new Performance;
- unknown actual conditions remain unknown;
- Observation has token identity and provenance;
- Observation is not a Capability claim;
- Observation is not evidence for a particular claim without an explicit evidence argument;
- every LearnerCapabilityClaim has at least one accepted supporting CapabilityEvidenceArgument;
- a challenging argument does not automatically establish the opposite claim;
- absence of a claim is not a negative claim;
- finite evidence does not automatically justify broader condition scope;
- old evidence does not automatically justify current capability;
- repeated evidence is not automatically independent evidence;
- group success does not automatically establish individual capability;
- activity completion does not establish capability;
- target relevance does not mutate historical learner evidence;
- learner evidence cannot redefine reusable Capability or Subject Knowledge semantics;
- learner state is a projection over evidence-backed claims and arguments, not an intrinsic scalar mastery property.

## Not fundamental in the current model

The following are not current fundamental learner constructs:

- mutable CapabilityState entity;
- intrinsic mastery/readiness/proficiency score;
- CapabilityEstimate as the canonical learner truth;
- universal Evidence entity;
- reusable EvidentialWarrant;
- reusable EvidencePattern;
- AssessmentResult as a universal evidence carrier;
- Question-specific ReviewObservation;
- Question as the canonical evidence subject;
- Attempt as a universal event type.

A future accepted counterexample may justify adding a distinction when the current model causes material semantic loss.
