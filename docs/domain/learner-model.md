# Learner Model

## Purpose

Define learner-specific actual performance, observation and capability-claim semantics while preserving the distinction between observed facts and inferential conclusions.

## Performance

```text
Performance                          // EVENT
    participants*
    temporal_extent
    actual_conditions

    actor-attributed actions / trace
    work_products*
    expressed_reasoning?
    actual_bindings?

    -- responds_to -->
        Task*
```

Performance is one concrete execution event: what actually happened.

Task states what was required or self-adopted. Repeating the same Task creates a new Performance.

`responds_to` has cardinality `0..*`. Natural work can produce a Performance without a previously materialized Task.

Performance may be individual, collaborative, tool-mediated, long-running or incomplete.

Internal reasoning is not directly observable. Only expressed reasoning, actions, traces and work products can become observation targets.

## Observation

```text
Observation                          // TOKEN
    Performance
    about: 1..*
    assertion/value
    provenance

    -- conforms_to -->
        ObservationSpecification*
```

Observation has token identity. Two independent raters may create distinct Observations with the same assertion.

`about` may identify the Performance, participant, actor-attributed action, work product or part of a work product.

`Observation -- conforms_to --> ObservationSpecification` is classificatory with cardinality `0..*`. Opportunistic observations may exist without a prior specification, and one Observation may satisfy more than one compatible specification.

An Observation records an attributed assertion/value with provenance. It is not a truth oracle and is not itself a capability claim.

## LearnerCapabilityClaim

```text
LearnerCapabilityClaim
    learner
    CapabilitySpecification
    polarity: positive | negative
    time_scope
```

It is an evidence-backed proposition that the learner possesses or does not possess the specified Capability in the stated time scope.

The Claim has no intrinsic:

- confidence;
- posterior probability;
- standard error;
- proficiency value;
- generic `unknown` polarity.

Absence of a Claim is not a negative Claim.

`time_scope` states the time about which capability is asserted. It is distinct from Observation timestamp, Performance temporal extent and inference creation time.

## CapabilityEvidenceArgument

```text
CapabilityEvidenceArgument           // TOKEN
    observations: 1..*
    warrant: EvidentialWarrant
    claim: LearnerCapabilityClaim

    inference_result?
    provenance
    created_at
```

This is the concrete inferential argument that applies one warrant to an actual observation set and concerns one Claim.

Independent executions over the same Observations, warrant and Claim may remain distinct arguments when model/version/provenance differs.

A valid CapabilityEvidenceArgument requires:

```text
observations satisfy warrant.evidence_pattern

claim.CapabilitySpecification
    == warrant.target_capability_specification

claim.polarity
    == warrant.target_polarity

claim.time_scope
    satisfies warrant.claim_time_scope_rule

warrant.applicability_conditions
    hold
```

Model-specific confidence, posterior, likelihood or uncertainty output belongs in `inference_result`, not in LearnerCapabilityClaim.

## Evidence role

PREP does not materialize a universal `Evidence` entity.

An Observation becomes evidential in the context of a CapabilityEvidenceArgument under an EvidentialWarrant.

The same Observation may participate in several arguments. Observations may be dependent; repeated or near-identical observations are not automatically independent evidence.

## Individual and collaborative performance

A group Performance does not automatically support an individual Capability claim.

Individual claims require observation targets/provenance that attribute relevant behavior or work product to the learner and a warrant whose applicability permits that inference.

## Temporal semantics

Skill degradation and changing conditions are handled by explicit Claim time scope and warrant temporal rules.

Old evidence does not automatically license a present-time Claim. A current Claim does not automatically apply indefinitely.

## Invariants

- Performance is an event; Task is a goal/specification-side object;
- repeated execution creates a new Performance;
- Observation has token identity and provenance;
- Observation is not Evidence by itself;
- Observation does not imply a LearnerCapabilityClaim without an applicable warrant and valid evidence argument;
- finite observations do not automatically justify broad generalization;
- failure does not automatically justify a negative capability claim;
- multiple raters do not automatically make evidence independent;
- group Performance does not automatically imply individual capability;
- absence of Claim is not negative Claim;
- learner-specific evidence cannot redefine reusable Knowledge or Capability semantics.

## Removed from the core model

The following are not current fundamental learner constructs:

- ReviewObservation as a Question-specific universal observation type;
- Question as the canonical evidence subject;
- CapabilityState;
- intrinsic mastery/readiness/proficiency state;
- CapabilityEstimate as core;
- EvidentialBearing as an identity-less qualified relation;
- universal Evidence entity.

Integration-specific review logs may later be translated into Performance/Observation semantics when their provenance and meaning justify that mapping.
