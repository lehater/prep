# Prep research workspace

This directory is a **shared, noncanonical research workspace**. Any contributor or agent can add questions, investigate them, review findings, and leave enough context for someone else to continue without the original conversation. No dedicated research roles, task tracker, fixed schema, or coordinator is required.

Research notes are **not** approved product/domain decisions, Harness Core Questions, acceptance evidence, or a second source of engineering truth. Read [AGENTS.md](../../AGENTS.md) first. For claims about current Prep semantics, check the canonical artifacts and current Harness/Publication state on the relevant branch; never promote a research recommendation by editing Core or Publication directly.

## Find or start a topic

- Check existing folders under `docs/research/` before creating a new topic; continue the closest related topic rather than duplicating it.
- Keep related questions and findings in one descriptive topic directory (for example, `capability-goal-semantics/`).
- Prefer a topic `README.md` for a short handoff, `open-questions.md` for outstanding questions, and one or more research notes for substantial findings. These are convenient names, **not a mandatory format**. Existing topic layouts can remain as they are.
- In the topic README, point readers to the latest useful findings and the next unresolved question. Record the branch/revision when findings depend on repository state.

## Bounded experimental checks (optional)

A research topic may keep `open-experiments.md` alongside `open-questions.md` when several bounded hypotheses need reproducible checks. Keep the list local to its topic: question IDs link to experimental checks; experiment records link to their fixture/conditions, falsification criteria, results, limitations and owner decision needed. Do not use this as a parallel task tracker, engineering decision registry or Harness acceptance record.

An experiment may be performed with counterexample tables or structured fixtures and **does not require code or a UI**. Use `experiments/<name>/` for an independent runnable experiment only when execution materially improves validity or reproducibility. Do not create an empty scaffold or shared framework in advance. No universal scheduling order is required, but record prerequisites explicitly. Closing a test means the check has been run and documented, **not** that its linked Core/Authority Questions have been approved.

## Work on a topic

1. **Read:** inspect the topic's handoff, open questions and relevant findings. Look for previous answers and conflicting evidence before starting new work.
2. **Choose the useful next action:**
   - **Capture a question:** describe what is unknown, why it matters, and what evidence or decision could settle it.
   - **Investigate:** use concrete examples, counterexamples and sources; add conclusions and limits to existing research notes, or create a new note when warranted.
   - **Review or continue:** challenge earlier assumptions, document contradictions and update the next questions. Do not silently delete a competing interpretation.
3. **Leave a handoff:** update open questions to distinguish questions needing investigation from questions sufficiently researched and awaiting owner decision. Point to the findings instead of copying them. Refresh the topic README when its next action or navigation changes.
4. **Save:** work in the branch appropriate to the task, inspect the latest changes before writing/pushing, reconcile concurrent edits, and commit a coherent group of updates. No commit is needed for every conversational turn.

## What to preserve

- The question and its relevance to a user or engineering decision.
- The key findings, rationale, counterexamples, material uncertainty and supporting source links or exact repository references.
- Whether a statement is **evidence, hypothesis, recommendation, owner-approved input, or Harness-accepted knowledge**. Only the owning Authority and Harness procedures can establish the last status.
- What the next contributor can investigate or put to the owner.

**Stop researching when there is enough evidence to frame a bounded decision and its trade-offs.** Remaining uncertainty can be an explicit question; a research conclusion is not an approval.

## Minimal handoff example

One contributor adds to `open-questions.md`: “Does capability composition imply execution order? Distinguish ability structure from a procedure; test with a strict protocol.”

Another contributor reads that question and existing findings, tests examples and counterexamples, records the result in the topic's research notes, then updates the question: “Investigated; composition alone does not establish order. Whether Prep needs a separate procedure model awaits an owner/product decision.” The topic README points to this result.

This is a **way of working**, not a prescribed ontology or a claim that the example conclusion has been adopted by Prep.
