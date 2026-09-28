# Learning Design

## Purpose

Define reusable capability, learning-support, task, observation, evidence, assessment, target, gap, priority and learning-intent semantics. This context owns normative and target-relative learning design; it does not own actual learner performances, observations or learner-specific evidential conclusions.

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

### focuses_on

```text
PerformanceExpectation -- focuses_on --> Knowledge
```

The relation is true when Knowledge is a direct semantic object of the expected performance.

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

One CapabilitySpecification does not automatically satisfy another merely because it appears narrower, broader, stronger or weaker. Such entailment requires accepted semantics for the relevant condition scopes and standards.

## Learning support

### LearningMaterial

```text
LearningMaterial
    learner_facing_content

    -- presents --> Knowledge*
    -- intended_to_support --> CapabilitySpecification*
```

LearningMaterial is a reusable learner-facing artifact such as an explanation, worked example, reference note or other material that does not itself require a learner response.

Its content may present reusable Knowledge without becoming the canonical owner of that subject meaning.

`intended_to_support` is a design-intent relation. It does not imply that exposure causes learning, that the material is sufficient, or that the learner possesses the Capability.

When an artifact requires a learner response or performance, that behavioral demand is modeled as Task/TaskSpecification rather than being hidden inside LearningMaterial.

### LearningSupportRequirement

```text
LearningSupportRequirement            // VALUE
    target: CapabilitySpecification
    support_constraints
    coverage_constraints
```

LearningSupportRequirement states what kinds and coverage of learning/practice opportunities are required before Learning Design may claim that support is adequately prepared for a CapabilitySpecification.

The constraints may refer to LearningMaterial, TaskSpecification, relevant condition coverage or other accepted learning-support properties. The model does not prescribe a universal taxonomy of learning methods.

A set of support artifacts/opportunities may satisfy a LearningSupportRequirement as a derived predicate.

Important:

- adequacy is relative to an explicit LearningSupportRequirement;
- artifact count alone has no adequacy semantics;
- satisfying support requirements does not imply that learning occurred;
- assessment EvidencePattern and learning-support adequacy are distinct questions.

This resolves learning-support coverage without introducing a universal coverage score.

### LearningIntent

```text
LearningIntent                       // VALUE
    target: LearningTarget
    capability_focus: CapabilitySpecification*
    addresses: Gap*
    purpose
```

LearningIntent is a target-relative normative statement of what change or reinforcement should be pursued next.

`purpose` is open semantic content. Examples may include acquisition, reconstruction, retrieval practice, application practice, transfer preparation or retention support; these examples are not a closed enumeration.

LearningIntent may be realized through LearningMaterial, TaskSpecifications or other accepted learning/practice opportunities. It does not itself assert that the intended change occurred.

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

`response_affordances` describe what a conforming Task permits or requires from the performer, including work products, interaction, traces, response channels and required exposure of reasoning when applicable.

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
    response_affordances

    -- conforms_to -->
        TaskSpecification*
```

Task is a concrete prescribed or self-adopted goal under concrete conditions.

Its concrete response affordances are part of what the performer is actually permitted or required to produce. A Task conforms to a TaskSpecification only when its expectation, conditions and response affordances satisfy the specification constraints.

`Task -- conforms_to --> TaskSpecification` is classificatory with cardinality `0..*`. A Task may conform to overlapping specifications.

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
    target_claim:
        capability_specification
        polarity
    bearing: supports | challenges
    claim_time_scope_rule
    applicability_conditions?
```

A warrant is reusable justification for why an EvidencePattern permits a directed evidential bearing on a particular kind of learner-capability claim.

The nested `target_claim` removes ambiguity between claim polarity and evidential direction.

A warrant that challenges a positive claim does not thereby support the corresponding negative claim. Positive and negative claims require their own warranted semantics.

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
    task_specifications: TaskSpecification*
    observation_specifications: ObservationSpecification*
    warrants: EvidentialWarrant*
    sampling_specifications: SamplingSpecification*
```

AssessmentDesign is reusable design-time semantics that groups a coherent assessment intent. It is distinct from assessment events, sessions and actual Performance.

The grouping is meaningful because the same TaskSpecification or ObservationSpecification may participate in different assessment designs with different targets, warrants or sampling requirements.

Valid evidence may arise from natural work without any AssessmentDesign.

## LearningTarget

```text
LearningTarget
    target_context
    target_purpose
    related_targets: LearningTarget*
    requirements:
        RequirementExpression<CapabilitySpecification>
```

A LearningTarget normatively describes the desired capability profile for one explicit target purpose in an external target context.

`target_purpose` states why the capability profile exists. Important initial purposes include **role-capability** (perform the professional role) and **selection/interview** (perform within a hiring/selection process); the field remains extensible for other target kinds such as certification.

`related_targets` may associate targets that matter to the same real-world goal, for example a backend-role target and a company interview target. The relation provides context only: it does **not** imply requirement inheritance, equivalence, satisfaction transfer or that an interview-specific task is a professional-role requirement.

Two targets may have equivalent requirements but different target contexts or purposes.

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

## Target-relative gap and priority

### Target satisfaction

Target satisfaction is derived from the RequirementExpression and accepted learner-specific state.

A leaf CapabilitySpecification is established as satisfied only when a positive LearnerCapabilityClaim matches or is explicitly known to entail the required specification and that Claim is backed by at least one valid supporting CapabilityEvidenceArgument.

A positive Claim with an unresolved valid challenging argument does not by itself establish target satisfaction.

No broadening across condition scope, standard or time is automatic.

For composites:

- `all_of` is satisfied only when every child is satisfied;
- `any_of` is satisfied when at least one child is satisfied.

Absence of a satisfying claim means satisfaction is not established. It does not create a negative learner claim.

### Gap

```text
Gap                                  // DERIVED VALUE
    target: LearningTarget
    requirement_fragment
    kind: unresolved | challenged
    basis
```

A Gap is a target-relative requirement fragment whose satisfaction is not currently established.

- `unresolved`: available learner state is absent, conflicting or otherwise insufficient to establish satisfaction;
- `challenged`: accepted learner-specific evidence/state materially challenges satisfaction.

Its `basis` may reference the relevant learner claims/arguments or the explicit absence of sufficient supporting state. The Gap does not copy or re-own those learner facts.

A Gap is not an intrinsic property of Knowledge or Capability.

The Boolean structure of RequirementExpression must be respected. An unsatisfied alternative inside an already satisfied `any_of` branch is not automatically a target Gap.

### LearningPriority

```text
LearningPriority                     // VALUE / DECISION
    target: LearningTarget
    focuses_on: Gap+
    rationale
```

LearningPriority records which target-relative gaps deserve attention next and why.

Priority is not an intrinsic property of Knowledge, Capability or Gap. It may be human-authored or algorithmically derived, but any algorithm is downstream policy and must preserve target/evidence semantics.

Reducing uncertainty may itself justify priority even when no negative learner claim exists.

## Question compatibility profile

`Question` is not a fundamental domain entity.

A current-slice question can be represented as a convenience profile over the general model:

- the prompt and expected response behavior belong to TaskSpecification/Task;
- a direct/reference answer used to evaluate a response belongs to ObservationSpecification evaluation semantics;
- explanatory/reference content shown for learning may be LearningMaterial;
- the learner's actual response is part of Performance;
- ratings, correctness judgments or other recorded results are Observations with provenance.

This permits Question-based workflows without making Question the universal learning or evidence model.

## Allowed inference

The following local inferences are valid:

- Task conforms_to TaskSpecification -> Task satisfies that specification's expectation, condition and response-affordance constraints;
- RequirementExpression `all_of` -> all children are required;
- RequirementExpression `any_of` -> at least one child is sufficient for that branch;
- a set of Observations may be tested against EvidencePattern as a derived predicate;
- a set of learning materials/opportunities may be tested against an explicit LearningSupportRequirement;
- target satisfaction and Gap may be derived only using the accepted RequirementExpression and learner-state semantics above.

## Forbidden inference

The model does not allow:

- `focuses_on(K)` -> K is required as a realization method;
- `intended_to_support(C)` -> the learner acquired C;
- learning-support adequacy -> learner Capability;
- a domain proposition that K can support C -> K is necessary or sufficient for C;
- Task conformance -> Capability possession;
- TaskSpecification affordance -> Observation exists;
- successful Performance -> broad Capability;
- failed Performance -> negative Capability claim;
- a warrant challenging a positive claim -> support for a negative claim;
- narrow condition scope -> broader condition scope;
- familiar-task Capability -> novel-task Capability;
- repeated evidence -> independent evidence;
- absence of a satisfying claim -> negative learner claim;
- artifact count -> learning-support adequacy;
- priority -> intrinsic importance of Knowledge.

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
- universal CoverageSpecification;
- ActualCoverage;
- AssessmentTarget;
- AssessmentEpisode;
- TaskFamily;
- TaskTemplate;
- TaskInstance;
- Attempt;
- LearningSupportDesign as a separate aggregate.

A future use case may reintroduce a distinction only when removing it causes material semantic loss.
