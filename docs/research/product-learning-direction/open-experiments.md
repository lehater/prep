# Open experiments — product learning direction

**RESEARCH PROPOSALS ONLY (2026-10-12).** No human interviews, usability observations or learning-outcome measurements have yet been performed. These are not Harness tests, implementation tasks, approved UX scope or release gates. Perform only a check that addresses a live uncertainty; no required global execution order.

## EX-PLD-01 — Reconstruct actual recent preparation episodes

- **Status:** PROPOSED / NOT RUN.
- **Question:** What do people actually do and struggle with when moving from a learning outcome to the next useful action? Is the main bottleneck missing content, poor retention, lack of practice/feedback, uncertainty about gaps, or coordination across tools?
- **Sample (not quota):** purposively seek 3–5 contrasting recent episodes, ideally at least one recall-intensive and one application/performance-intensive scenario; preserve non-user availability as a limitation.
- **Freeze before interview:** same prompt ("Walk through a real recent preparation goal: what did you use, how did you decide what was necessary, what did you do, how did you tell whether it worked, what happened next?"), observable artifacts/timestamps where voluntarily available, coding categories for confusion and tool-switching. Do not ask leading questions about desired Prep features.
- **Potential falsifiers:** users already have a reliable next-action process; lack of content or expert feedback dominates instead of organization; a learning action does not start with Capability; goal may be externally determined.
- **Stop/evidence:** anonymized episode traces, counterexamples and explicit uncertainty; no automatic Owner scope decision.

## EX-PLD-02 — Same-goal contrast of Prep roles

- **Status:** PROPOSED / NOT RUN; conditional on EX-PLD-01 or equivalent authentic user need.
- **Question:** Which direct support, if any, meaningfully changes the user's behavior beyond navigation?
- **Common task and data:** same user Goal and subject knowledge, materials and observed exercise failure; compare three deliberately small *paper/mock* interaction descriptions: A external learning organizer, B adds in-product knowledge retrieval/feedback, C adds applied task/feedback guidance. Keep available Knowledge and Activity/Result facts identical; do not give one version exclusive extra hints.
- **Observable outcome:** user can tell what to do next and why, whether they can recover goal context, whether they correctly distinguish coverage from skill deficit; if actually teaching, measure delayed/new-task outcomes separately.
- **Potential falsifiers:** added teaching feature does not change useful decisions, adds friction, or leads to unsupported mastery interpretation; pure organizer remains insufficient to act.
- **Stop/evidence:** task observation, errors, rationale and limitations, not preference polling. Does not approve a product variant.

## EX-PLD-03 — Knowledge-first versus ability-first edge cases

- **Status:** PROPOSED / NOT RUN.
- **Question:** When does a mandatory Goal→Capability→Knowledge→Material journey misrepresent a learner's real task?
- **Freeze cases:** (1) memorize legal/medical terminology; (2) explain and apply caching tradeoffs; (3) demonstrate a strict physical protocol; (4) attain an external credential through variable routes. Compare the **same meaning** under Knowledge-first, Capability-first and activity-first task descriptions, without inventing universal prerequisites.
- **Potential falsifier:** a case requires fabricating a Capability assertion, or a practical ability involves tacit feedback that cannot be addressed by listing Knowledge.
- **Stop/evidence:** a concise counterexample matrix. Desk representability does not prove real-world preference.

## EX-PLD-04 — Feedback and assessment claim validity

- **Status:** PROPOSED / NOT RUN; only if an automatic gap-detection proposition is under consideration.
- **Question:** What can responsibly be concluded from a recorded attempt, test answer, self-report or external assessment?
- **Compare:** "attempted exercise, made error E", "learner wants to revisit concept K", "K is missing from selected material", and "learner lacks capability C." For each, record evidence required, valid statement, unwarranted inference and alternative explanation.
- **Potential falsifier:** repeated high performance on a familiar item fails to generalize to novel task; absence of a node in system falsely treated as inability; wrong answer caused by ambiguous prompt rather than lack of knowledge.
- **Stop/evidence:** bounded product-claim contract; **no new mastery model** without explicit product authority and valid assessment design.

## Boundary

The current [landscape scan](landscape-scan-2026-10-12.md) is a **literature and product-feature review**, not a completed controlled experiment. Product pages are evidence that a feature is described, *not* independent evidence of product efficacy. Keep research observation distinct from an Owner decision and from Harness accepted scope.
