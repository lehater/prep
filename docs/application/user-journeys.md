# User Journeys

## Purpose

Define task-oriented interaction before screen or navigation decisions. These journeys consume accepted application/domain semantics and do not prescribe UI realization.

## Actor and task contexts

The first version has one Prep user/data scope. Multi-user identity, authentication, authorization and tenant separation are not part of the current journeys.

Within that single-user scope, Prep distinguishes two task contexts:

- **learner context** — the person chooses or works within a LearningTarget, studies available material and inspects recorded review facts;
- **curation context** — the person maintains reusable Knowledge, Requirements/RequirementSets, Questions, alignments and learning-material quality.

These are not security roles. In v1 the same person may perform both. Future multi-user operation may assign such responsibilities to different people, but that requires explicit later product/security design.

## Maintain knowledge

Context: curation.

Goal: add or maintain reusable subject knowledge.

Entry: the curator intends to record accepted subject knowledge.

Interactions:
1. Curator chooses to create knowledge manually or supply prepared bulk input.
2. For manual authoring, curator supplies the KnowledgeNode semantic kind and content.
3. System validates domain-required structure and creates or updates the KnowledgeNode.
4. Curator may select existing nodes and create or remove a typed KnowledgeRelation.
5. System preserves stable identities and accepted relation semantics.

Recovery: invalid structure or relation semantics are rejected without partially applying the affected operation. Bulk-input representation and per-record reporting are downstream interface concerns.

Completion: accepted KnowledgeNodes/KnowledgeRelations are available to learning and other Prep flows.

## Maintain learning requirements

Context: curation.

Goal: record reusable learning requirements and compositions.

Interactions:
1. Curator creates/edits Requirements or supplies prepared bulk input.
2. Curator creates/edits RequirementSets and adds/removes Requirements or nested RequirementSets.
3. System rejects composition that violates acyclicity.
4. Curator may align/un-align Requirements with existing KnowledgeNodes.

Completion: accepted requirements, compositions and knowledge alignments are available for target definition.

## Maintain questions

Context: curation.

Goal: build and maintain the reusable question corpus independently of a particular learner target.

Interactions:
1. Curator creates/edits a Question with direct answer or supplies prepared bulk input.
2. Curator identifies one or more existing KnowledgeNodes relevant to the Question.
3. System records or removes Question-to-Knowledge alignments.
4. Question may exist before alignment; unaligned Questions remain distinguishable so curation can be completed later.
5. Any future assessment of whether the full Question set adequately covers a KnowledgeNode belongs to curation/system quality work, not to the learner's study-progress workflow.

Completion: Questions and their accepted knowledge alignments are available for Study Set construction.

## Define learning target

Context: learner.

Goal: describe what the learner intends to become capable of.

Interactions:
1. Learner creates/edits a LearningTarget.
2. Learner selects from reusable Requirements and/or RequirementSets available to the target.
3. System records target-requirement selection without changing reusable Requirement semantics.

Completion: target has an accepted scope that can be used for learning preparation.

This journey does not require the learner to repair missing reusable Knowledge or Question coverage. In the current single-user product the same person may later switch to curation work when desired.

## Prepare study

Context: learner.

Goal: obtain the currently available Questions relevant to a selected LearningTarget.

Interactions:
1. Learner selects a LearningTarget.
2. System resolves selected Requirements/RequirementSets.
3. System follows currently available Requirement-to-Knowledge alignments.
4. System selects currently available Questions aligned with that knowledge.
5. System presents the resulting Study Set for inspection, including an explicit valid-empty result when no Questions currently resolve.
6. Learner may proceed with export of the available Study Set to a supported external learning runtime.

Incomplete curation does not block the learner workflow merely because some requirements, knowledge aspects or future semantic coverage criteria are not complete. Detailed curation diagnostics belong to the curation context; learner interaction may communicate only the limitation necessary to explain unavailable/empty material.

Completion: a Study Set exists as an application materialization of the currently resolvable corpus.

## Study externally

Context: learner.

Goal: use a prepared Study Set in a supported external learning runtime.

Interactions:
1. Learner chooses export for the Study Set.
2. System materializes runtime-specific study representation.
3. System sends it through the supported external interface.
4. External runtime conducts learning.
5. Prep later receives supported review results.
6. System resolves results to canonical Questions and records ReviewObservations.

Failure/recovery semantics specific to transport, external identity reconciliation, duplicates and partial synchronization require the downstream machine-interface contract.

Completion: study material is available externally and/or returned ReviewObservations have been recorded.

## Inspect learning statistics

Context: learner.

Goal: inspect recorded review history/statistics without treating them as inferred mastery.

Interactions:
1. Learner selects the relevant learning/question context.
2. System retrieves recorded Question-level ReviewObservations/statistics.
3. System presents recorded facts without claiming mastery, readiness, retention or priority.

Completion: learner can inspect recorded statistics.

## Deliberately deferred journeys

No current journey automatically interprets statistics into KnowledgeNode state, overlays degrees of learned knowledge on the graph, reprioritizes learning, regenerates a plan, extracts knowledge from arbitrary sources, generates questions, semantically judges Question-set coverage adequacy, or validates imported source content automatically.
