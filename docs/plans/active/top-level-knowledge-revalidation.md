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

## Current frontier

Revalidate:

- `docs/interface/presentation-system.md`;
- `docs/interface/screen-view-design.md`.

The current documents are structural hypotheses, not permission to proceed directly to final frontend/component design.

The revalidation must start from concrete user tasks and information needs, then decide:

- primary workspace/IA;
- required views and transitions;
- where creation/editing/linking/search belong;
- how Knowledge, Requirements, Questions, Targets, Study and Statistics relate in the user's workflow;
- the role of catalogues, detail contexts and editors;
- the concrete task served by Knowledge Graph and whether 3D adds enough value;
- Study Set preparation and Anki interaction;
- representation of alignment/incomplete/error/statistics states.

## Stop condition

Continue autonomously until a material UX/product choice cannot be derived from accepted canonical truth. Represent that choice explicitly rather than selecting it from legacy UI assumptions.
