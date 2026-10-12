# EX-PLD-06 — interactive prototype implementation handoff

**Purpose:** implement a disposable, local interactive instrument for the existing [EX-PLD-06 experiment](../../docs/research/product-learning-direction/open-experiments.md#ex-pld-06--goal--capability--knowledge--external-theoretical-study-loop). This is **prototype construction / technical preparation**, **not** the human user-value experiment, a new experiment ID, a selected product architecture, or an approved UX/Domain Model.

## Read authoritative working context first

- Repository and local research instructions: [root AGENTS](../../AGENTS.md), [research AGENTS](../../docs/research/AGENTS.md), [WORKFLOW](../../docs/research/WORKFLOW.md).
- Current scope, which supersedes old reports: [research-framing.md](../../docs/research/product-learning-direction/research-framing.md).
- Experiment hypotheses/controls/arm definitions/status: [EX-PLD-06 register](../../docs/research/product-learning-direction/open-experiments.md#ex-pld-06--goal--capability--knowledge--external-theoretical-study-loop).
- Completed *desk* preflight and caveats: [experiment-06-external-study-loop-preflight.md](../../docs/research/product-learning-direction/experiment-06-external-study-loop-preflight.md).
- Source of supplied example data: [fixture.json](fixture.json), [candidate TSV](sample-anki.tsv), [existing checker](check.py). Follow the **latest repository state**, not hard-coded counts here.

Do not copy these sources into new documents. If any proposed prototype behavior conflicts with current framing or experiment controls, follow those sources and report the conflict instead of silently changing the experiment.

## Bounded build task

Create one **small standalone browser application** under `experiments/prep_study_loop/prototype/`, reusing the existing fixture rather than defining a new ontology or obtaining additional sources. React + Vite + TypeScript is suitable (the repository already uses it), but keep dependencies and scaffolding minimal. Do **not** modify the production `frontend/`, `.harness/`, Core, Publication, or canonical product/domain/interface artifacts. Work on a **separate task branch based on the current research branch**, not `main`.

Expose three operator-selected modes with stable URLs (for example `?arm=A`, `?arm=B`, `?arm=C`). Do **not** show a participant an in-task mode switcher that exposes other experimental treatments. All modes must use the **same source facts and accessible supplied content**; they vary navigation and selection affordances, not truth, knowledge depth or privileged answer data:

- **A — orientation only:** browse supplied Goal, optionally focus by Capability Description, inspect Knowledge and relations, distinguish contextual learning objectives (including a shared K linked to two C), see uncertainty/incompleteness; no special packet-export control. Let a user access Knowledge without a compulsory Capability hop.
- **B — orientation + packet:** the same navigational capabilities as A, plus inspect, explicitly choose and remove supplied study material; download only user-selected appropriate **card-type** items in Anki-compatible tab-separated UTF-8 format. Non-card scenarios remain visible/distinguishable but are **not silently flattened into recall cards**.
- **C — flat material preparation:** from the *same supplied information*, inspect and manually select/remove items and export with equivalent format, without a Goal/Capability/Knowledge **navigator**. Accessible notes/metadata must not be artificially censored to disadvantage C. No automated card generation is required.
- **D — current existing-tools baseline:** **not** a fake degraded fourth UI. Human comparison uses ordinary external tools with the same underlying source facts. Provide a neutral, non-Prep-format handout or easy-to-inspect raw source representation only if needed for information parity; do not treat D as simulated user evidence.

Render all user-facing prompts/UI in Russian or preserve their supplied Russian wording. A simple responsive desktop-oriented list/detail/relationships explorer is sufficient; **no 3D, graph renderer, backend, login, remote service, AI authoring, analytics pipeline, sync, or production design system** is needed for the initial instrument. Use a real browser-download interaction for TSV. A graph representation is a later hypothesis, not a prerequisite.

## Experimental validity and hidden controls

- The fixture contains **research answer keys** (`tasks[].expected_*` and `exclude`) and `materials[].relevance` controls. These **must not appear** in participant-facing text, visual labels, default selection, or auto-recommended answers. Separate participant display data from answer-key validation logic; do not predetermine the task's correct selections in application behavior.
- The participant chooses the material; the UI does not silently use `expected_cards` or `relevance` to filter/export for them. Preserve source item identities and field text in the export; use the existing TSV as a reference **only for a controlled selection**, not a universal default.
- Never claim the supplied Knowledge covers a profession, that linked C is a measured human ability, or that a selected/reviewed card proves learning.
- Provide task prompts for the experiment operator **separately from participant view**; avoid revealing ground truth. UI accessibility and comprehensible relation meaning matter more than visual embellishment.
- No collection or upload of participant personal data; do not fabricate participant observations, elapsed times, usability scores or learning results. Keep any technical smoke-test results distinct from a future actual participant trial.

## Delivery checks and handoff

1. Document exact local run/build commands in the prototype directory and run them; ensure another agent can start it from a fresh checkout.
2. Verify A/B/C URLs, fixture loading, Knowledge reuse with distinct context objectives, cross-links/navigation, manual selection/deselection, rejection of accidental unwanted items, and actual downloaded TSV fields (Front/Back/Tags). Do not claim real Anki import unless actually done.
3. Run `python experiments/prep_study_loop/check.py` and any added focused prototype tests. Preserve the fixture and reference TSV unless a separately justified correction is needed.
4. Keep the result a **technical prototype**, not an execution of the EX-PLD-06 human comparison. Do not mark the experiment completed; leave research states in the register unless new real evidence warrants a change.
5. Commit code, minimal run instructions, and concise verification notes to the **prototype task branch**. Report what actually worked, what was not tested, and the branch/commit URL. No merge to `main` or to the research branch without explicit authorization.

**Stop rule:** once the minimum task can be performed interactively and the export can be verified, stop. Do not expand toward a full Prep application or conduct simulated user validation.
