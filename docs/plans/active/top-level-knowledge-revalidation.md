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

## Current frontier

Q-TARGET-SCOPE-AUTHORSHIP now blocks final USER-JOURNEYS / Target Scope interaction:

- does the learner directly select reusable Requirements/RequirementSets;
- does the learner choose a curated target/profile whose scope is prepared by curation;
- or is another system-assisted composition model required?

Do not finalize Target Scope screen composition or descend into frontend implementation until this application-level behavior is resolved.
