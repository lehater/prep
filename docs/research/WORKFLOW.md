# Research workflow

This document contains working instructions for noncanonical research under `docs/research/`. See [the agent index](AGENTS.md) and the root [AGENTS.md](../../AGENTS.md) for routing to repository-level requirements.

Research is a **shared evidence workspace**, not a second source of product/domain truth, engineering acceptance, project status or an alternative workflow to Harness. Any contributor may add questions, investigate, review and hand off work; no dedicated role, coordinator or rigid schema is required.

## Find or start a topic

1. Check existing topics before creating a new one; continue the closest topic rather than duplicating it.
2. Group related questions and findings in one descriptive topic directory.
3. Use the topic `README.md` for **navigation only**; use `HANDOFF.md` for concise reading pointers needed between sessions, not for repeated hypotheses, question/experiment states or accumulated findings. Where the current Owner-supplied research premise/boundary has changed, designate **one topic research-framing file** to own that noncanonical working scope and link to it. A research framing file is **not** a parallel canonical Product Requirements or a product decision register.
4. Keep question and experiment states in their corresponding lists (`open-questions.md`, `open-experiments.md`) where those exist. The handoff points to the lists instead of reproducing an independent state ledger.
5. These names are convenient patterns, not required formats for every topic; do not reorganize unrelated historical research solely for uniformity.

## Research and experiments

1. Read the topic's current research-framing source (if designated), related question/experiment register entries, relevant evidence and current branch instructions before drawing conclusions. Earlier desk reports cannot silently redirect the currently Owner-supplied research scope.
2. Choose a **bounded** next action: capture an unknown, investigate alternatives, challenge assumptions, or run a reproducible check.
3. When running an experiment, fix the hypothesis, comparison, input conditions and falsification criteria before testing. Record counterexamples, failures and inconclusive findings as well as positive results. Do not silently revise assumptions to force a pass.
4. A test may use Markdown tables, structured fixtures or a small checker. Build code under repository `experiments/<name>/` only if execution materially improves validity or reproducibility. Do not create UI scaffolds or a shared framework speculatively.
5. Investigations and experiments may proceed in any useful order once prerequisites are known. A completed research test does **not** approve the corresponding domain/Authority question.
6. Stop a bounded investigation when it can support a concrete decision with alternatives and limitations; preserve remaining uncertainty as a question rather than widening scope automatically.

## Record findings and hand off

- Preserve the relevant question, hypotheses, evidence and links, counterexamples, limitations, and the next decision needed.
- Distinguish explicitly between **research evidence**, **hypothesis**, **recommendation**, **owner-confirmed input** and **Harness-accepted knowledge**. Only the owning Authority and routed Harness process determine the last category.
- Keep statuses **only** in the appropriate question/experiment register; report evidence/results in dated records and point to them. README and HANDOFF link to these sources instead of summarizing statuses or adopting recommendations. If a study suggests changing the research question, record the proposal and require an explicit Owner clarification before updating the current framing.
- Work on the task's selected branch, check for concurrent changes before writing, and commit coherent groups of updates. No mechanical per-conversation commit is needed.
- Do not reconstruct authoritative product semantics from research history or promote findings by directly editing Harness Core/Publication. For Harness-controlled work, follow [root instructions](../../AGENTS.md) and the pinned procedure.
