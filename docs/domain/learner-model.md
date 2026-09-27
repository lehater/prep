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

`actual_conditions` record what is known about the real execution conditions. Unknown conditions remain unknown; missing context must not be fabricated merely to fit a CapabilitySpecification.

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

Learner state is a projection over accepted Claims and their supporting/challenging arguments, not a separate mutable `CapabilityState` entity. Incompatible claims or arguments remain explicit when their scope/time/provenance does not justify reconciliation; downstream consumers must not silently choose one as truth.

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

This is one concrete inferential application of an EvidentialWarrant to an actual observation set concerning one learner-capability claim.

The token is retained because inferential provenance has independent meaning: the same observations and target claim may be assessed under different accepted warrants, model versions or procedures, and supporting and challenging arguments may coexist.

A valid CapabilityEvidenceArgument requires:

```text
observations satisfy warrant.evidence_pattern

claim.CapabilitySpecification
    == warrant.target_claim.capability_specification

claim.polarity
    == warrant.target_claim.polarity

claim.time_scope
    satisfies warrant.claim_time_scope_rule

warrant.applicability_conditions
    hold
```

The argument inherits `supports | challenges` from its warrant.

A supporting argument may justify accepting or retaining the Claim according to accepted policy.

A challenging argument weakens or contests the Claim but does not itself assert the opposite polarity.

Model-specific confidence, posterior, likelihood or uncertainty output belongs in `inference_result`, not in LearnerCapabilityClaim.

## Evidence role

PREP does not materialize a universal `Evidence` entity.

An Observation becomes evidential in the context of a CapabilityEvidenceArgument under an EvidentialWarrant.

The same Observation may participate in several arguments. Observations may be dependent; repeated or near-identical observations are not automatically independent evidence.

## Question and external-runtime compatibility

Question-specific review records are integration representations, not the canonical learner model.

When a supported review interaction can be interpreted faithfully:

- the presented/reviewed prompt may correspond to a Task derived from a TaskSpecification;
- the concrete review interaction is a Performance;
- the learner response, correctness/rating, latency or other recorded result may become one or more Observations with runtime provenance;
- any unavailable execution context remains unknown rather than being invented;
- a runtime rating or successful review is not itself a LearnerCapabilityClaim.

This allows Anki-style review facts to enter the general model without making Question or a runtime rating the universal evidence subject.

If an imported record lacks enough semantics to construct a faithful Performance/Observation mapping, PREP must preserve it only at the integration boundary until a supported translation exists.

## Individual and collaborative performance

A group Performance does not automatically support an individual Capability claim.

Individual claims require observation targets/provenance that attribute relevant behavior or work product to the learner and a warrant whose applicability permits that inference.

## Temporal semantics

Skill degradation and changing conditions are handled by explicit Claim time scope and warrant temporal rules.

Old evidence does not automatically license a present-time Claim. A current Claim does not automatically apply indefinitely.

## Invariants

- Performance is an event; Task is a goal/specification-side object;
- repeated execution creates a new Performance;
- unknown actual conditions remain unknown;
- Observation has token identity and provenance;
- Observation is not Evidence by itself;
- Observation does not imply a LearnerCapabilityClaim without an applicable warrant and valid evidence argument;
- a challenging argument does not imply the opposite claim;
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

Integration-specific review logs are translated into Performance/Observation semantics only when their actual meaning and provenance support that translation.
