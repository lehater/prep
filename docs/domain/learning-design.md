# Learning Design

## Purpose

Define reusable capability, task, observation, evidence-warrant, assessment and target semantics. This context owns what competent performance means and what evidence configuration can justify capability claims; it does not own actual learner performances or learner-specific claims.

## Capability

### Capability

`Capability` is a reusable capability kind/specification, not a concrete disposition of one learner.

```text
Capability
    PerformanceExpectation
    condition_space
    criterion_dimensions
    constitutive_constraints

    PerformanceExpectation -- focuses_on --> Knowledge*
```

Capability identity is the semantic identity of one performance contract. `PerformanceExpectation × conditions × criteria` is not a mechanical composite key.

### PerformanceExpectation

Answers:

> What should a person be capable of doing?

Examples include diagnosing CPU saturation, constructing a proof, evaluating an investment and adapting a known method to a novel situation.

### condition_space

Describes the admissible conditions under which the capability applies. It may include situation/input class, environment, information, tools/resources, assistance, constraints and performer-relative properties.

`novel`, `unfamiliar` and `not previously practiced` may be performer-relative conditions.

### constitutive constraints and criterion dimensions

A constitutive constraint determines whether a performance is an instance of the Capability at all.

A criterion dimension measures quality of an otherwise admissible performance.

Example:

```text
Construct proof

constitutive:
    logical validity

criterion dimensions:
    completeness
    clarity
    economy
```

### focuses_on

```text
PerformanceExpectation -- focuses_on --> Knowledge
```

The relation is true when Knowledge is a direct semantic object of the expected performance.

Examples:

- Explain CAP theorem -> focuses_on CAP theorem.
- Recall Pythagorean theorem -> focuses_on Pythagorean theorem.
- Compare TCP and UDP -> focuses_on TCP and UDP.

Semantics:

- cardinality: `0..*`;
- modality: constitutive semantic relation;
- symmetric: no;
- transitive: no;
- automatic inheritance through Knowledge composition: no.

`focuses_on(K)` does not imply that K is required as a method, sufficient, memorized or used in every Performance.

## CapabilitySpecification

```text
CapabilitySpecification              // VALUE
    capability
    condition_scope?
    capability_standard?
```

It means:

> Capability C in condition scope S at required standard Q.

`condition_scope` is a predicate/refinement over `Capability.condition_space`, not necessarily an enumerated set.

If absent, the specification concerns the full condition space of the Capability.

### CapabilityStandard

```text
CapabilityStandard                   // VALUE
    performance_thresholds?
    consistency_requirement?
```

Performance thresholds may constrain dimensions such as accuracy, quality, speed, safety or completeness.

`consistency_requirement` constrains stable realization across admissible occasions.

Capability consistency is an ontic/normative requirement. Confidence in an estimate is epistemic and is not part of CapabilityStandard.

Absence of a standard means only constitutive Capability semantics are required. It does not mean success in every condition.

## Task semantics

### TaskSpecification

```text
TaskSpecification
    task_constraints
    variable_dimensions*
    response_affordances

    -- affords_observation_of -->
        ObservationSpecification*
```

A TaskSpecification is one constraint-defined class of Tasks with one semantics of admissible variability.

`response_affordances` describe what a conforming Task makes available for performance and observation, including required work products, permitted interaction, traces, response channels and required exposure of reasoning when applicable.

### affords_observation_of

`TaskSpecification affords_observation_of ObservationSpecification` means the specification provides an opportunity to establish the target feature when a conforming Task is performed and the performer manifests that feature.

It is a design-modal relation. It does not imply:

- that the learner manifests the feature;
- that an Observation will exist;
- that the Observation has a particular value;
- that the target Capability is possessed.

### Task

```text
Task
    concrete_expectation
    prescribed_conditions

    -- conforms_to -->
        TaskSpecification*
```

Task is a concrete prescribed or self-adopted goal under concrete conditions.

`Task -- conforms_to --> TaskSpecification` is classificatory and semantically derived from satisfaction of specification constraints. Cardinality is `0..*`. A Task may conform to overlapping specifications.

Changing the semantics of a TaskSpecification creates a new semantic specification identity rather than retroactively reclassifying history.

There is no fundamental `Task -- demands --> Capability` relation in the minimal core.

## Observation design

### ObservationSpecification

```text
ObservationSpecification
    target_feature
    identification/evaluation_method?
```

It specifies which feature of a Performance should be established and, when necessary, how it is identified or evaluated.

Changing an evaluation method creates a new ObservationSpecification only when the semantic meaning of the observable changes. A different rater alone usually does not.

## Evidence semantics

### EvidencePattern

```text
EvidencePattern                     // VALUE
    observation_constraints
    task/performance coverage
    diversity constraints
    temporal constraints
    dependence constraints
    rater/method constraints?
```

EvidencePattern defines the evidence configuration sufficient for a particular admissible inferential transition. It is semantic constraint, not a psychometric DSL.

No IRT, BKT, cognitive-diagnosis, Bayesian or confidence formula is part of the core.

### EvidentialWarrant

```text
EvidentialWarrant
    evidence_pattern
    target_capability_specification
    target_polarity
    bearing: supports | challenges
    claim_time_scope_rule
    applicability_conditions?
```

A warrant is reusable justification for why an EvidencePattern permits a directed inference concerning a CapabilitySpecification.

Positive and negative inferences are not assumed symmetric. A warrant licenses exactly the polarity/bearing semantics it states.

Statistical confidence is not part of warrant identity.

## Sampling and assessment design

### SamplingSpecification

```text
SamplingSpecification
    sampling_dimensions
    coverage_constraints

    -- aims_to_satisfy -->
        EvidencePattern*
```

EvidencePattern states what evidence configuration is required. SamplingSpecification states how an AssessmentDesign intends to obtain it. Intention does not guarantee actual evidence.

### AssessmentDesign

```text
AssessmentDesign
    targets: CapabilitySpecification*
    TaskSpecification*
    ObservationSpecification*
    EvidentialWarrant*
    SamplingSpecification*
```

AssessmentDesign is reusable design-time semantics. It is distinct from assessment events, sessions and actual Performance.

Valid evidence may arise from natural work without any AssessmentDesign.

## LearningTarget

```text
LearningTarget
    target_context
    requirements:
        RequirementExpression<CapabilitySpecification>
```

A LearningTarget normatively describes the desired capability profile in an external target context, such as a role, interview, certification or language standard.

Two targets may have equivalent requirements but different target contexts.

### RequirementExpression

The minimal expression is recursive:

```text
RequirementExpression =
    CapabilitySpecification
    | all_of(RequirementExpression*)
    | any_of(RequirementExpression*)
```

`optional` is not a requirement operator because it does not affect target satisfaction. Prerequisites are distinct semantics and are not final target requirements.

`at_least_n` is not part of the core until a strong use case requires it.

## Allowed inference

The following local inferences are valid:

- Task conforms_to TaskSpecification -> Task satisfies that specification's constraints;
- RequirementExpression `all_of` -> all children are required;
- RequirementExpression `any_of` -> at least one child is sufficient for that branch;
- a set of Observations may be tested against EvidencePattern as a derived predicate.

## Forbidden inference

The model does not allow:

- `focuses_on(K)` -> K is required as a realization method;
- a domain proposition that K can support C -> K is necessary or sufficient for C;
- Task conformance -> Capability possession;
- TaskSpecification affordance -> Observation exists;
- successful Performance -> broad Capability;
- failed Performance -> negative Capability claim;
- narrow condition scope -> broader condition scope;
- familiar-task Capability -> novel-task Capability;
- repeated evidence -> independent evidence.

## Removed from the core model

The following are not current fundamental constructs:

- Requirement;
- RequirementSet;
- TargetRequirement;
- Question as a fundamental domain entity;
- CapabilityState;
- CapabilityEstimate as core;
- CapabilityRealization;
- Task.demands;
- Capability.composed_of;
- PerformanceSpecification entity;
- PerformanceCriterion entity;
- Evidence entity;
- EvidenceRequirement;
- CoverageSpecification;
- ActualCoverage;
- AssessmentTarget;
- AssessmentEpisode;
- TaskFamily;
- TaskTemplate;
- TaskInstance;
- Attempt.

A future use case may reintroduce a distinction only when removing it causes material semantic loss.
