# Research documentation audit — 2026-10-13

**Type:** dated documentation audit and cleanup evidence, not a new project-status register, experiment result, product decision or adopted model/interface contract.

## Scope examined

Reviewed the research instructions/index/handoff, current product-learning framing, Q-PLD and EX-PLD registers, EX-PLD-10 model/fixture protocol, EX-PLD-11 Universal Entity Workspace contract, the four-pane layout candidate, and the 2026-10-13 exploratory UI checkpoint. Read the relevant Goal/Capability research references and the EX-PLD-06 prototype brief/verification as context. This audit is of the **research branch only**; no Harness procedure, engineering validation, user experiment or model/interface study was executed.

## Findings and disposition

| Priority | Finding | Disposition |
| --- | --- | --- |
| P1 | The parallel model-versus-presentation plan was recorded repeatedly in questions, experiments, handoff, checkpoint and layout documents | **Consolidated:** questions own unknowns/closure; experiment register owns states and bounded outcome contracts; protocols own details; handoff links instead of reproducing plans; dated checkpoint preserves the original rationale |
| P1 | Research handoff and some working documents pointed to Harness as if it were a live research gate | **Clarified:** research runs autonomously; Harness is a separate later engineering-transfer path |
| P1 | Q-PLD-16/17/18 repeated EX-PLD-09/10/11 input matrices, scenarios and checklists | **Shortened:** Q entries now state the unresolved question, boundaries, evidence needed and corresponding experiment links |
| P2 | EX-PLD-10/11 descriptions repeated their specialist protocols | **Shortened:** register keeps status/hypothesis/falsifiers/deliverables and points to the owning model or UI research document |
| P2 | Four-pane layout candidate repeated the downstream research sequence | **Shortened:** the file now owns layout/mechanics only |
| P2 | Topic README mixed executable working references with dated background reports | **Reindexed:** current investigation documents are separated from historical evidence |

## Confirmed research separation

**Parallel upstream streams (both proposed and not yet run):**

- **EX-PLD-10 / Q-PLD-17 — subject data model:** own semantic alternatives, entities/relations and adversarial *meaningful* fixture; do not design it solely to fit four panels. Protocol: [model/fixture](model-fixture-investigation-brief-2026-10-13.md).
- **EX-PLD-11 / Q-PLD-18 — generic view/presentation:** own the metadata-driven four-pane contract and contrasting neutral data/view cases; do not decide semantic admissibility or invent missing relations. Contract: [Universal Entity Workspace](universal-entity-workspace-hypothesis-2026-10-13.md). Specific pane behavior: [layout candidate](../../../experiments/prep_study_loop/prototype/WORKSPACE_LAYOUT_CANDIDATE.md).

**Single join checkpoint:** apply the *same* candidate view contract to EX-PLD-10's independently prepared facts. Record **descriptor-only / adapter needed / specialized extension / redesign or semantic loss**, including cases where a justified relation cannot be shown. Model facts must not be changed just to make the generic UI succeed.

**Downstream, distinct responsibilities:** [EX-PLD-09](open-experiments.md) tests integrated, connected Goal–Capability–Knowledge–Material journeys on the compatible fixture; a coherent browser prototype is built and checked *after* the conceptual check; [EX-PLD-06](open-experiments.md) later tests real comparative user value. [EX-PLD-08](open-experiments.md) separately addresses graph-versus-table, 2D-versus-3D benefit and is not a prerequisite.

None of these checkpoints makes the research corpus exhaustive, proves user capability or imposes a production architecture. A future owner-selected research outcome may be transferred to Harness through a separate engineering task, **after** validation of the intended product.

## Deliberately not merged or rewritten

- **Q-PLD-14 / EX-PLD-08** (added value of a graph) and **Q-PLD-18 / EX-PLD-11** (generic view expressiveness) test different hypotheses.
- **Q-PLD-16 / EX-PLD-09** (integrated journey) is downstream of, not a duplicate of, EX-PLD-10/11.
- Historical experiment reports, prior owner checkpoints and accepted engineering artifacts retain their original evidence meaning. Documentation cleanup is **not evidence** that EX-PLD-09/10/11 or the human EX-PLD-06 have run.

## Residual checks

When the two parallel experiments produce actual outputs, validate their shared fixture/contract with explicit data IDs and counterexamples; update only the corresponding experiment/question registers and link dated findings. Avoid creating a second roadmap, making the layout a domain graph model, or coding the browser app before a coherent full journey is demonstrated.
