# Application Design

## Purpose

Define Prep's application-level composition of accepted product and domain behavior without re-owning domain semantics, external machine contracts, persistence, UI composition or runtime topology.

Canonical data is maintained through application use cases. Human interfaces and bulk-import interfaces invoke these use cases; neither writes directly to persistence.

## Canonical data maintenance

### Knowledge

Application operations:

- create and edit a KnowledgeNode;
- create and remove a typed KnowledgeRelation between KnowledgeNodes;
- load prepared KnowledgeNodes and KnowledgeRelations in bulk.

Automatic extraction, derivation or validation of source material is outside the current scope.

### Learning requirements

Application operations:

- create and edit a Requirement;
- create and edit a RequirementSet;
- add or remove Requirements and nested RequirementSets from a RequirementSet while preserving the domain acyclicity invariant;
- align or unalign a Requirement with KnowledgeNodes;
- load prepared Requirements, RequirementSets, composition and alignments in bulk.

The application does not infer requirements automatically from source material.

### Questions

Application operations:

- create and edit a Question and its direct answer;
- align or unalign a Question with one or more KnowledgeNodes;
- load prepared Questions and, when supplied, their knowledge alignments in bulk.

Question import does not require alignment to be known at import time. Alignment can be completed as a separate curation activity.

### Learning targets

LearningTarget composition is a **curation operation**.

Curation operations:

- create and edit a LearningTarget;
- assign or remove reusable Requirements and RequirementSets for a LearningTarget;
- optionally load prepared target definitions and assignments when a machine interface supports them.

Learning-mode operation:

- select/open an existing curated LearningTarget for study.

Learning mode does not create, edit or recompose the selected target scope. A target is consumed as a prepared learning profile; changing its Requirements/RequirementSets requires an explicit switch to curation work.

### Learner statistics

ReviewObservations are normally recorded from learning-runtime results rather than manually authored canonical data.

The current application contract provides recording and retrieval of Question-level review history/statistics. It does not interpret those statistics into learner state.

## Task-context distinction

The current single-user product supports two different classes of work without introducing authentication roles:

- **learning workflow** — choose an existing curated LearningTarget, build study material, study externally and inspect recorded review facts;
- **curation workflow** — maintain reusable LearningTargets and their scopes, Knowledge, Requirements/RequirementSets, Questions, alignments and learning-material quality.

The same person may perform both in v1. The distinction is semantic/task-oriented, not a user/permission model.

A learning workflow consumes the currently curated reusable corpus. It is not responsible for repairing semantic completeness of that corpus before useful study can proceed.

## Browser-facing queries

The browser frontend needs stable application queries in addition to mutation/use-case commands.

Learning-mode queries:

- list/search existing curated LearningTargets;
- retrieve one LearningTarget with its read-only Requirement/RequirementSet scope;
- project KnowledgeNodes currently relevant to a LearningTarget;
- project the accepted KnowledgeRelations among a selected global or target-relevant node set;
- project Questions currently relevant to a LearningTarget;
- retrieve Question-level ReviewObservations/statistics in target or Question context.

Curation-mode queries:

- list/search and retrieve LearningTargets;
- list/search and retrieve KnowledgeNodes;
- list/search and retrieve Requirements/RequirementSets;
- list/search and retrieve Questions;
- retrieve structural alignment facts needed by curation, including unaligned Questions and KnowledgeNodes with no aligned Questions where requested.

These queries expose current canonical state. They do not infer mastery, coverage adequacy, readiness or priority.

Text search is an application query capability over human-readable canonical content. Exact indexing/ranking technology is not application semantics.

## Learning preparation

### Build Study Set

A Study Set is a current-state application materialization for a supported study profile. It is not a tactical domain entity and does not assert learning-support adequacy or learner capability.

For the current Question-compatible profile, the application resolves the selected LearningTarget's RequirementExpression into its required CapabilitySpecification leaves and selects the currently available learning/practice artifacts that can be represented by that profile under accepted Learning Design semantics.

A question-shaped item is therefore an application compatibility bundle over the general model rather than a new canonical domain kind: prompt/response expectations are backed by TaskSpecification/Task semantics, learner-facing reference content may be LearningMaterial, and evaluation semantics are backed by ObservationSpecification where applicable.

#### Preparation gate

Study Set construction is allowed when:

1. the selected LearningTarget exists;
2. its RequirementExpression is structurally valid;
3. every referenced CapabilitySpecification needed to interpret that expression is resolvable; and
4. the requested study profile itself is supported by the application.

These are interpretation/execution preconditions, not completeness requirements.

The application does **not** require every target requirement to have learning support before building a Study Set. It materializes the currently resolvable subset.

For each relevant requirement fragment, the result may also expose preparation diagnostics such as:

- no currently resolvable support;
- available support does not satisfy an explicit LearningSupportRequirement;
- support adequacy is not specified because no LearningSupportRequirement applies;
- candidate support exists but cannot be represented by the requested study profile.

If an explicit LearningSupportRequirement exists, adequacy is evaluated using that domain semantics. The application does not replace it with artifact count, Question count or its own coverage heuristic.

An unsatisfied LearningSupportRequirement is a **diagnostic**, not a Study Set construction failure in the current flow. It means the application must not describe the subset as adequate/complete.

A valid target with no currently representable material yields an explicit empty Study Set plus its diagnostics.

Construction fails rather than returning a misleading subset only when the target cannot be interpreted coherently (for example, an invalid RequirementExpression or unresolved required CapabilitySpecification reference) or the requested preparation profile is unsupported.

#### Materialization consistency

A Study Set preview records the exact resolved materialization identity needed to detect change before export.

When a user exports a previously previewed set, the application must detect if target requirements or the resolved material changed since that preview rather than silently exporting a different set.

For the current slice, dependency-sensitive ordering, automatic prioritization from learner state and adaptive evidence-based filtering are not part of Build Study Set unless separately accepted.

## External study

### Materialize for External Study

Transform a Study Set into the representation required by a selected external learning runtime.

A runtime-specific card is a derived representation of a Question, not a canonical Prep domain object. The concrete external representation and protocol are owned downstream by machine-interface/technical design.

### Export Study Material

Send the materialized study representation to an external learning runtime.

Application Design owns the orchestration intent. External API/protocol contracts and technical transport are not owned here.

### Import Review Results

Receive review results from an external learning runtime, resolve them back to canonical Questions, and record ReviewObservations in the Learner Model.

The mapping and external representation needed to identify corresponding external items are downstream machine-interface/technical concerns.

### Record Learning Statistics

Record accepted Question-level ReviewObservations so review history and statistics can be reproduced.

The current flow stops at recording statistics. Interpretation into learner state, retention, mastery, gaps, priorities or automatic replanning is deferred.

## Composition

```text
Canonical data maintenance / curation

Human authoring --------+
                        |
Bulk prepared input ----+--> application use cases
                              |
                              +--> KnowledgeNodes / KnowledgeRelations
                              +--> Requirements / RequirementSets
                              +--> Requirement <-> Knowledge alignments
                              +--> Questions
                              +--> Question <-> Knowledge alignments
                              +--> LearningTargets / target requirements


Learning preparation

selected curated LearningTarget
  -> RequirementExpression<CapabilitySpecification>
  -> currently resolvable learning/practice support
  -> requested supported study profile
  -> Study Set (exact resolvable subset + preparation diagnostics)


External study

Study Set
  -> materialize for external runtime
  -> export
  -> external learning activity
  -> import review results
  -> record Question-level ReviewObservations
```

Canonical-data maintenance flows are independent. Curation may happen before, after or separately from a learner's target workflow.

## Ownership boundaries

Application Design owns:

- canonical-data authoring and maintenance orchestration;
- bulk-input orchestration after an input representation has been decoded;
- RequirementSet composition operations;
- Requirement-to-Knowledge and Question-to-Knowledge alignment operations;
- curation of LearningTarget composition;
- selection of an existing curated LearningTarget for the learner workflow;
- interpretation of a selected LearningTarget for study preparation;
- resolution of currently available learning/practice support into a supported study profile;
- Study Set materialization as the exact resolvable subset with explicit preparation diagnostics;
- enforcement of the Study Set preparation gate without inventing a completeness requirement;
- orchestration of export and result-import flows;
- coordination of accepted domain models without redefining them.

Application Design does not own:

- KnowledgeNode, KnowledgeRelation, Requirement, RequirementSet, LearningTarget, Question or ReviewObservation semantics;
- LearningSupportRequirement semantics or any universal learning-support coverage heuristic;
- forms, screens, graph editors or other human interaction design;
- file/API/message representation contracts;
- external-runtime card schemas or API semantics;
- external-item mapping representation;
- database/storage schema;
- runtime/component topology.

## Downstream interface needs

Human Interface Design must distinguish Learning mode from Curation mode without requiring different authenticated users in v1. Learning mode selects prepared LearningTargets and must not expose target-scope editing as part of the learner workflow.

Machine Interface Design must define representation contracts for supported bulk input and external-learning-system interaction. The initial format is not selected by Application Design.

Data Design must preserve accepted domain identities, relationships, compositions, alignments, targets and ReviewObservations without becoming the owner of their semantics.

## Deferred behavior

- interpretation of review statistics into learner state;
- evidence-strength/confidence models;
- retention/decay interpretation;
- propagation of inferred learner state onto KnowledgeNodes/Requirements;
- automatic reprioritization or replanning from review statistics;
- dependency-aware question ordering;
- automatic invention of learning-support adequacy when no LearningSupportRequirement exists;
- generalized study representations beyond requirements demonstrated by concrete learning runtimes;
- automatic extraction, generation or semantic validation of imported source content.
