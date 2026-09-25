# Plan: Harness-guided Prep revalidation

## Goal

Re-establish Prep's canonical engineering knowledge from the accepted problem space downward, without carrying previous graph-centered, Anki-centered or implementation-centered assumptions into new design unless current evidence supports them.

## Working rule

Follow the current `Lehater/harness` dependency graph. A changed upstream capability requires downstream revalidation/reconciliation before later design is treated as current.

Legacy artifacts remain evidence unless explicitly accepted into the current Core realization.

## Completed current revalidation

Canonical knowledge has been re-established for:

- Problem Space;
- Product Vision and Product Capabilities;
- Domain Strategy and Model Context Strategy;
- Knowledge Model, Learning Design and Learner Model;
- Application Design and User Journeys;
- Human Interface baseline;
- Machine Interface;
- Import Consistency;
- System Architecture;
- Data Design;
- Architecture Driver Closure for the current scope.

The Harness realization has been reconciled against the current Harness Authority catalog and current canonical artifacts.

## Accepted interaction direction

Human Interface revalidation has accepted:

- **target-centric workflow + global reusable Library**;
- primary global locations are Targets and Library;
- Study and target-context Statistics continue the selected Target workflow;
- Import is contextual to the relevant Library data kind;
- Target-derived Knowledge/Requirements/Questions remain reusable global canonical objects;
- Knowledge Graph is an optional projection, with target-scoped exploration now having a concrete use case; 2D versus 3D remains unproven.

The decision was stress-tested with the Python Backend Interview walkthrough in docs/research/target-centric-workflow-walkthrough.md.

## Accepted learner/curation separation

The hybrid IA is refined into two task contexts:

- **Targets** — learner workflow;
- **Library** — reusable corpus curation.

They are not authentication roles in v1; one person may perform both.

Study Set construction now uses all currently resolvable Questions and is not blocked by incomplete semantic coverage. Q-STUDY-SET-PREPARATION-GATE is resolved in APPLICATION-DESIGN.

Question-set coverage adequacy is a separate curation/learning-material quality concern. Exact semantics remain unresolved as Q-QUESTION-COVERAGE-ADEQUACY and do not block the initial learner workflow.

The future target-scoped Knowledge Graph learner-state overlay is recorded in docs/research/learner-state-graph-overlay.md and remains blocked by deferred learner-state inference semantics.

## Accepted mode separation

Prep now has two explicit task modes:

- **Learning** — select an existing curated LearningTarget/profile and learn; target scope is read-only.
- **Curation** — create/edit LearningTargets and compose their scopes; maintain reusable Knowledge, Requirements/RequirementSets, Questions and alignments.

They are not authentication roles in v1; the same physical person may switch modes.

Q-TARGET-SCOPE-AUTHORSHIP is resolved in APPLICATION-DESIGN: learner selects a prepared target/profile and does not edit its Requirement composition.

## Coverage research

The earlier Question-only coverage framing was too narrow. Dedicated research is captured in `docs/research/learning-coverage-research.md`.

Current direction from research:

- do not equate coverage with Question count;
- distinguish learning-support coverage from assessment/evidence coverage;
- consider content breadth, cognitive/performance depth and transfer/context variability;
- keep human/curator semantic judgment authoritative until an accepted automated inference model exists;
- do not broaden the v1 domain beyond Question solely because the research identifies future material/activity types.

The unresolved semantic question is now Q-LEARNING-COVERAGE-MODEL. It does not block the current Question-first learner slice.

## Browser/backend contract closure

The browser/backend machine boundary is now explicitly defined with stable operation IDs for:

- Learning target selection and read-only target scope;
- target Knowledge/graph/Questions projections;
- Study Set build/export with stale-preview detection;
- factual statistics and explicit v1 review sync;
- Curation CRUD/alignment/composition operations;
- contextual bulk import;
- external-runtime status.

SCREEN-VIEW-DESIGN now directly depends on MACHINE-INTERFACES and binds server-backed views to these operations.

Anki endpoint/API-key remain deployment configuration; v1 UI exposes status rather than inventing a secret/config editor.

## Current frontier

The canonical revalidation closure required before frontend realization is now structurally complete for the current Question-first slice: Data Design and Screen/View Design both have their required upstream contracts.

Q-LEARNING-COVERAGE-MODEL and the future learner-state graph overlay remain deliberate non-blocking research/deferred semantics.

The next useful activity is **low-fidelity interface validation**: reduce the accepted semantic view inventory into the smallest practical Learning and Curation screen flows, then test them against the Python Backend Interview scenario before choosing visual styling/components or implementing frontend code.
