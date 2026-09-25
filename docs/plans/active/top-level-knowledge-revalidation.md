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

## Current frontier

HUMAN-INTERFACE and PRESENTATION-SYSTEM have been revalidated against the hybrid interaction model.

SCREEN-VIEW-DESIGN has been reworked to that model but final acceptance is blocked by Q-STUDY-SET-PREPARATION-GATE.

The blocking Application Design question is:

- what exact condition makes a LearningTarget sufficiently prepared to build a Study Set;
- when preparation is incomplete, whether Study Set construction is blocked or allowed for the resolvable subset with explicit diagnostics.

Do not descend into final frontend/component implementation until this upstream behavior is resolved and Screen/View Design is revalidated against it.
