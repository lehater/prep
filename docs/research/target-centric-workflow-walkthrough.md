# Target-centric workflow walkthrough: Python Backend Interview

Status: UX evidence for Human Interface revalidation. This document does not define domain semantics.

## Purpose

Stress-test the accepted **target-centric workflow + global reusable Library** against one concrete end-to-end learning-preparation scenario before frontend/component design.

The example target name and subject examples are illustrative; they do not become canonical subject data.

## Scenario

User goal: prepare for a **Python Backend Interview** using reusable Prep knowledge, requirements and questions, study the resulting Questions in Anki, and later inspect recorded review facts.

## Walkthrough

| Step | User intent | Interaction context | Canonical effect / output | UX finding |
|---|---|---|---|---|
| 1 | Start preparing for the interview | Targets | Create/open LearningTarget Python Backend Interview | Target is the natural persistent work context. |
| 2 | Define what the target requires | Target -> Scope | Select reusable Requirements/RequirementSets; create a missing reusable Requirement when necessary | Requirements must remain global/reusable even when created from target context. |
| 3 | See what knowledge supports the scope | Target -> Knowledge | Resolve Requirement-to-Knowledge alignments | Missing alignments should be shown as factual preparation gaps, not hidden behind another workspace. |
| 4 | Inspect/complete subject knowledge | Target -> Knowledge / canonical Knowledge detail | Edit/create reusable KnowledgeNodes and KnowledgeRelations; align them to Requirements | Target-specific projection and global canonical detail must coexist. |
| 5 | Check question coverage | Target -> Questions | Resolve Questions through Knowledge alignments; create/align missing reusable Questions | Questions remain a global corpus; target context explains why a subset is relevant. |
| 6 | Inspect relationships when useful | Target -> Knowledge -> graph projection | No domain mutation from navigation/layout | A target-scoped graph has a concrete task: understand relationships inside the current target without loading the whole corpus. Dimensionality remains unproven. |
| 7 | Prepare material for learning | Target -> Study | Build/inspect Study Set from target -> requirements -> knowledge -> questions | Study naturally belongs to the target workflow rather than global navigation. Exact incomplete-preparation gate is not currently defined. |
| 8 | Send material to Anki | Target -> Study | Backend exports/reconciles each Study Set Question through ExternalStudyRuntimePort/AnkiConnectAdapter | Runtime status and per-Question result belong in Study context; browser never talks to AnkiConnect directly. |
| 9 | Study in Anki | External runtime | External learning activity | Prep does not need to mimic Anki study UI. |
| 10 | Bring back review facts | Target -> Statistics / Question detail | Record Question-level ReviewObservations | Statistics can be viewed in target context but remain Question-attributable facts, not inferred target mastery. |
| 11 | Maintain reusable material outside one goal | Library | Search/edit/import Knowledge, Requirements and Questions independently | A global Library is necessary because reusable knowledge has future use cases beyond any current LearningTarget. |

## Resulting IA evidence

The scenario supports two primary global locations:

~~~text
Prep
├── Targets
│   └── Target workspace
│       ├── Overview
│       ├── Scope
│       ├── Knowledge
│       ├── Questions
│       ├── Study
│       └── Statistics
└── Library
    ├── Knowledge
    ├── Requirements
    └── Questions
~~~

Import is contextual to Library data kinds. External-runtime configuration/status is a secondary application concern.

The six Target workspace items are semantic sections. This walkthrough does not prove that they require six routes or six separate screens.

## Important interaction invariants

- A Target selects/references reusable Requirements; it does not own private copies.
- Target Knowledge and Questions are projections through accepted alignments, not target-owned duplicates.
- Creating Knowledge/Requirement/Question from target context creates a reusable canonical Library object.
- Canonical detail is shared across Target, Library and graph entry points.
- Navigation may preserve Target context without changing canonical object identity.
- Study Set is target-derived application materialization, not reusable domain truth.
- Target statistics are current projections over Question-level observations, not historical target-state evidence.
- Graph manipulation is presentation-only and all core tasks have non-graph paths.

## Unresolved decision discovered by the walkthrough

Current upstream semantics say Study Set construction requires sufficient preparation and that missing alignment must be reported, but do not define the exact gate.

Before final Screen/View acceptance, Application Design must decide:

1. What exact condition makes a target sufficiently prepared to build a Study Set?
2. If preparation is incomplete, is Build Study Set disabled, or can the user build the resolvable subset while Prep reports explicit missing-preparation diagnostics?

This is a product/application behavior decision, not a visual-component decision.
