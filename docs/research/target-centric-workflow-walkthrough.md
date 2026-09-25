# Target-centric workflow walkthrough: Python Backend Interview

Status: UX evidence for Human Interface revalidation. This document does not define domain semantics.

## Purpose

Stress-test the accepted **target-centric learner workflow + global reusable Library curation** against one concrete end-to-end scenario before frontend/component design.

The example target name and subject examples are illustrative; they do not become canonical subject data.

## Scenario

Learner goal: prepare for a **Python Backend Interview** using the reusable material currently available in Prep, study the resulting Questions in Anki, and later inspect recorded review facts.

A separate curation task may maintain the reusable corpus. In v1 the same physical person may perform both tasks, but they are not one workflow.

## Learner walkthrough

| Step | Learner intent | Interaction context | Canonical effect / output | UX finding |
|---|---|---|---|---|
| 1 | Start preparing for the interview | Targets | Create/open LearningTarget Python Backend Interview | Target is the natural persistent learner context. |
| 2 | Establish/use target scope | Target -> Scope | Use selected reusable Requirements/RequirementSets | Who establishes this scope is still unresolved; do not force raw Requirement curation onto a novice learner. |
| 3 | Understand relevant subject structure | Target -> Knowledge | Project currently aligned KnowledgeNodes | Learner reads/explores reusable knowledge; missing semantic maintenance is not an implicit learner task. |
| 4 | Explore relationships when useful | Target -> Knowledge -> graph | Presentation-only navigation | Target-scoped graph has a concrete structural-exploration task. 2D/3D remains unproven. |
| 5 | See available retrieval material | Target -> Questions | Project currently aligned Questions | Learner consumes the available corpus; semantic coverage adequacy is a separate curation concern. |
| 6 | Prepare material for learning | Target -> Study | Build Study Set from all currently resolvable Questions | Incomplete curation does not block learning; empty is a valid explicit result and non-empty does not claim completeness. |
| 7 | Send material to Anki | Target -> Study | Backend exports/reconciles each Study Set Question through ExternalStudyRuntimePort/AnkiConnectAdapter | Runtime status and per-Question result belong in Study context; browser never talks to AnkiConnect directly. |
| 8 | Study in Anki | External runtime | External learning activity | Prep does not need to mimic Anki study UI. |
| 9 | Bring back review facts | Target -> Statistics / Question detail | Record Question-level ReviewObservations | Statistics remain Question-attributable facts, not inferred target mastery. |

## Separate curation walkthrough

| Curator intent | Context | Result |
|---|---|---|
| Maintain subject truth | Library -> Knowledge | Create/edit KnowledgeNodes and KnowledgeRelations |
| Maintain target requirements | Library -> Requirements | Create/edit Requirements/RequirementSets and Knowledge alignments |
| Maintain retrieval material | Library -> Questions | Create/edit Questions and Knowledge alignments |
| Inspect structural incompleteness | Library | Find missing alignments / Knowledge with no Questions where supported |
| Judge semantic Question coverage | Library/future quality surface | Future capability; exact semantics unresolved by Q-QUESTION-COVERAGE-ADEQUACY |

## Resulting IA evidence

~~~text
Prep
├── Targets                       learner context
│   └── Target workspace
│       ├── Overview
│       ├── Scope
│       ├── Knowledge
│       ├── Questions
│       ├── Study
│       └── Statistics
└── Library                       curation context
    ├── Knowledge
    ├── Requirements
    └── Questions
~~~

Import is contextual to Library data kinds. External-runtime configuration/status is a secondary application concern.

The Target workspace items are semantic sections, not proof that six routes/screens are required.

## Knowledge Graph hypotheses

Current supported use case:

- target-scoped or global structural exploration of KnowledgeNodes/KnowledgeRelations.

Future hypothesis:

- overlay evidence-backed learner state on the target-scoped graph so required knowledge and learned/uncertain areas can be compared visually.

The future overlay is blocked by missing Question -> KnowledgeNode learner-state inference semantics. It must not be approximated by raw review counts presented as mastery.

## Important interaction invariants

- learner Target flow consumes reusable corpus; Library curates it;
- same v1 user may switch contexts, but curation is not an implicit learner step;
- Target Knowledge and Questions are projections through accepted alignments, not target-owned copies;
- canonical identity is shared across learner and Library contexts;
- Study Set is target-derived application materialization of the currently resolvable subset;
- a Study Set does not assert semantic completeness;
- Question-set coverage adequacy is curation quality, not learner progress;
- target statistics are current projections over Question-level observations, not historical target-state evidence;
- graph manipulation is presentation-only and all core tasks have non-graph paths.

## Unresolved decision discovered by the walkthrough

A learner may know the desired outcome without knowing the correct reusable Requirements that define it.

Current domain/application semantics allow a LearningTarget to select Requirements/RequirementSets, but the interaction owner of that selection is not sufficiently established.

Before final Target -> Scope design, decide whether:

1. the learner directly selects reusable Requirements;
2. the learner selects a curated target/profile whose Requirement scope is prepared by curation;
3. another hybrid/system-assisted model is needed.

This is an Application Design / journey decision, not a component-layout choice.
