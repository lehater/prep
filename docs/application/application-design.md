# Application Design

## Purpose

Define Prep's application-level composition of accepted product and domain behavior without re-owning domain semantics, external machine contracts, persistence, UI composition or runtime topology.

Application Design supports the user-centered loop established by the Task Model:

```text
target
  -> current evidence-backed state
  -> target-relative gaps / uncertainty
  -> next focus
  -> learning / practice / diagnosis
  -> new evidence
  -> updated target-relative state
```

A parallel curation lifecycle bootstraps and maintains the reusable corpus required by that loop.

## Task contexts

The current product has two semantic work contexts, not security roles:

- **Learning/target work** — establish/refine a target, inspect current state and gaps, choose the next focus, learn/practise/diagnose, collect evidence and reassess progress.
- **Curation work** — prepare and maintain targets, capabilities, knowledge, learning support, assessment design and structured bulk data.

The same physical person may self-curate, but this is not assumed. Curation may instead be performed by a curator/operator or external agent/system workflow. A learner-facing bootstrap need therefore does not imply that the learner should understand import schemas or maintain reusable semantic corpus data. When required target/support data does not exist, learning preserves the motivating context while preparation is delegated or entered explicitly.

## Target application use cases

### Select or establish target

Application operations:

- list/search prepared LearningTargets;
- open one prepared target as active context;
- identify target purpose, especially role-capability versus selection/interview performance;
- preserve/refine role, level, vacancy, company and interview-loop context as additional information arrives;
- relate overlapping target purposes without copying requirements from one target into another;
- route to target preparation when no suitable target exists;
- return to learning with the newly prepared/refined target active.

Target creation/editing remains a curation operation. Learning does not silently mutate a prepared target. Recruiter/interview/company information may trigger an explicit selection/interview-target refinement; information about interview mechanics must not silently redefine professional-role capability. Earlier target context/provenance is preserved rather than rewritten.

### Inspect target profile

Project the target context and RequirementExpression<CapabilitySpecification> in a user-consumable form, including relevant capability definitions and currently resolvable target-relevant Knowledge references where requested.

The application preserves RequirementExpression boolean semantics and does not flatten them into an inaccurate checklist.

## Learner-state and gap use cases

### Establish current state

For the active target:

1. resolve the target's required CapabilitySpecifications;
2. retrieve accepted LearnerCapabilityClaims and their supporting/challenging CapabilityEvidenceArguments;
3. determine which target requirement fragments are currently established as satisfied;
4. preserve unresolved or conflicting evidence as uncertainty;
5. expose supported diagnostic/assessment opportunities for material unresolved areas.

Missing evidence is not converted into a negative capability claim.

### Derive target-relative gaps

Use accepted Learning Design target-satisfaction and Gap semantics to derive:

- satisfied requirement fragments;
- unresolved gaps;
- challenged gaps;
- basis for each conclusion.

The application does not create a scalar proficiency score unless a separately accepted domain/product model defines one.

### Choose current learning/diagnostic focus

Application operations may create or select current LearningPriority/LearningIntent values for one or more gaps/uncertainties.

The application must preserve:

- target identity, purpose and current target layer/context;
- focused gap(s)/uncertainty;
- rationale, including target relevance/current state plus material deadline/interview-stage/time/cost constraints;
- whether the intent is learning/practice or diagnostic uncertainty reduction.

Automatic ranking is optional downstream policy. Human selection remains valid. A focus need not be explained by gap severity alone.

## Knowledge exploration

Queries support:

- global Knowledge exploration for curation;
- target-scoped Knowledge exploration;
- current-focus/gap-scoped Knowledge exploration where accepted capability-to-knowledge semantics allow it;
- list/search/detail and semantic relationship traversal over the same canonical Knowledge identities.

Graph/list/detail are projections, not separate semantic models.

## Learning, practice and diagnosis

### Resolve support for current focus

Given an active target and selected LearningIntent/diagnostic focus, resolve currently available:

- LearningMaterial;
- TaskSpecifications / Tasks;
- applicable LearningSupportRequirements;
- supported external-runtime compatibility representations.

Missing or inadequate support is returned as explicit preparation diagnostics.

### Execute or delegate activity

Activity may execute:

- inside Prep;
- through a supported external runtime.

Application Design owns orchestration intent and correlation with target/focus. Transport and runtime representation belong to Machine Interface Design.

### Question-compatible Study Set

A Study Set remains a compatibility materialization for the supported Question/Anki slice.

It is not the primary product workflow and is not a domain entity.

For this profile the application:

1. resolves currently representable support for the selected target/focus;
2. materializes an exact preview with diagnostics and current-state identity;
3. detects stale previews before export;
4. exports only the inspected materialization.

A valid empty or partial subset remains possible and must not be described as adequate unless accepted LearningSupportRequirement semantics justify that claim.

## Evidence application use cases

### Record performance and observations

Supported local or external activity may produce Performance and Observation facts with provenance.

Application operations:

- record accepted Performance facts;
- record accepted Observations;
- preserve unsupported/incomplete integration records at the integration boundary until faithful translation exists.

### Derive learner capability claims

Where accepted EvidentialWarrants apply, evaluate observation sets against EvidencePatterns and create/update accepted CapabilityEvidenceArguments and LearnerCapabilityClaims according to Learner Model invariants.

The application never treats a raw runtime rating, one correct answer or activity completion as a broad learner capability claim by itself.

### Reassess target state

After new evidence/information is accepted, whether or not it changes target satisfaction:

1. separate learner-performance evidence from new information about target expectations and identify which target purpose/context that information affects;
2. recompute target satisfaction and Gap values from accepted learner evidence;
3. where recruiter/interview/company information changes expected scope/depth, trigger explicit target refinement rather than treating that information as learner evidence;
4. expose material changes from the previous target-relative projection;
5. allow current priority/focus to be preserved or revised.

No-change, increased uncertainty and newly challenged state are valid outcomes.

## Corpus bootstrap and curation

### Choose preparation path

When a learner reaches target work without reusable data needed for a usable target/capability/support/assessment context, the application exposes that preparation is incomplete without assuming the learner must perform corpus engineering.

Preparation may be fulfilled by:

- system/external-agent bulk preparation where source material can be structured automatically;
- curator/operator bulk import or incremental curation;
- learner self-curation when the learner explicitly chooses that role;
- a mixed path.

The learner-facing contract is to preserve the motivating target/source context and eventually expose a trustworthy reviewable preparation scope/support. Import schema, item-level correction and corpus-quality work belong to the curation context unless the learner chooses to enter it.

### Structured bulk input

Bulk input is a first-class curation workflow.

Application Design owns orchestration after a machine-interface representation has been decoded:

1. receive decoded prepared records plus schema/data-kind identity;
2. validate semantic references/invariants through owning domain operations;
3. apply valid independent items according to import consistency policy;
4. return aggregate and per-item outcomes.

The concrete file/envelope schema, versioning and serialization belong to Machine Interface Design.

For the frontend-first prototype, representative corpus data may be supplied by mock adapters. This does not remove the bulk-import product requirement.

### Incremental curation

Application operations support incremental creation/editing of:

- LearningTargets and RequirementExpressions;
- reusable Capabilities and CapabilitySpecifications used by targets;
- Knowledge;
- LearningMaterial and TaskSpecifications;
- ObservationSpecifications, EvidencePatterns, EvidentialWarrants, SamplingSpecifications and AssessmentDesigns where supported.

Incremental UI curation complements bulk import; it is not required to be the efficient path for mass authoring.

### Quality diagnostics

Expose accepted structural/semantic preparation problems such as unresolved references, target requirements without usable support, or incomplete assessment semantics.

The application does not invent a universal corpus-quality score.

## Browser-facing query groups

### Target/learning queries

- list/search targets;
- read target capability profile;
- read current target-relative state;
- read satisfied/unresolved/challenged requirement fragments;
- read gap basis/evidence references;
- read current priorities/intents;
- read available diagnostic opportunities;
- read target/focus-scoped Knowledge;
- read available learning/practice support;
- read evidence/progress history.

### Curation queries

- list/search/retrieve targets;
- list/search/retrieve capabilities;
- list/search/retrieve Knowledge;
- list/search/retrieve learning/practice support;
- list/search/retrieve assessment/evidence design;
- inspect import outcomes and corpus diagnostics.

Exact transport/query shapes remain downstream.

## Composition

```text
Prepared target/corpus data -----------+
Incremental curation ------------------+--> canonical reusable corpus
                                             |
                                             v
                                      active LearningTarget
                                             |
                         +-------------------+-------------------+
                         |                                       |
                         v                                       v
              accepted learner evidence                 target requirements
                         |                                       |
                         +-------------------+-------------------+
                                             v
                                  target-relative state
                               satisfied / gap / uncertain
                                             |
                                             v
                                  LearningPriority/Intent
                                             |
                         +-------------------+-------------------+
                         |                                       |
                         v                                       v
                 learning/practice                         diagnosis
                         |                                       |
                         +-------------------+-------------------+
                                             v
                                  Performance/Observation
                                             |
                                             v
                               evidence-backed claims
                                             |
                                             +----> reassess target
```

## Ownership boundaries

Application Design owns orchestration of accepted domain semantics and user task support.

It does not own:

- Knowledge, Capability, LearningTarget, Gap, LearningPriority, LearningIntent, Performance, Observation, evidence-warrant or learner-claim semantics;
- import file representation/schema;
- graph/view/screen composition;
- persistence schema;
- external-runtime protocols;
- frontend component/runtime topology.

## Downstream needs

Human Interface Design must support the complete target-relative loop rather than only prepared-target study.

Machine Interface Design must define stable representation contracts for:

- target/state/gap/evidence reads needed by the frontend;
- curation commands;
- structured bulk import, including a documented externally preparable schema;
- supported external-runtime learning/evidence exchange.

The first frontend prototype may use mocks for these contracts while preserving the same semantic boundaries.
