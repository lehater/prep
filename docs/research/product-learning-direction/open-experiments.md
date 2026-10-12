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

## EX-PLD-05 — Does integrated Capability need its own semantics beyond a Knowledge-depth overlay?

- **Status:** PROPOSED / NOT RUN. [Desk alternatives and counterexamples](iteration-01-knowledge-space-and-applied-capability.md) are **not** user experiments or a selected model.
- **Question:** Can a user distinguish "I have enough coverage/depth on all listed topics" from "I have demonstrated their coordinated application for this particular professional task"?
- **Freeze before execution:** build one small stable Knowledge set (e.g. API, transactions, idempotency, retries), two distinct applied Capabilities (e.g. implement payment intent; explain distributed failure tradeoffs), and two Goals with different constraints. Include a user who can describe individual K's but has failed an integrated task, and a separate unobserved K (unknown, not zero). Describe one technically valid alternative approach with a different K-support set.
- **Compare:** H-A fixed K bundle-depth projection; H-B action/outcome/conditions with conditional K role relations; H-C independent scalar 'K application' depth. Same facts and task prompt; no exclusive hints.
- **Falsifiers:** required K lists imply universal necessity despite alternatives; full individual K coverage incorrectly predicts successful C; an unobserved K is shown as inability; a C assertion loses what activity was actually performed for which Goal; model merely renames execution step ordering as C parts.
- **Measure:** for each case, can one (i) identify the intended C performance, (ii) explain why these K's are selected *under these conditions*, (iii) distinguish what has been observed from what remains unknown, (iv) select a specific next learning or integrative-practice action? Mark logical representability separately from usefulness observed with people.
- **Stop:** compare outputs/counterexamples and report insufficient evidence honestly; do **not** write Harness Domain Model, grant relation authority, infer personal competence, or implement UI before needed.

**EX-PLD-05 research input (2026-10-12):** [Iteration 02](iteration-02-knowledge-skill-capability-reducibility.md) adds checked references for philosophical knowing-how, ACT/procedural learning, 4C/ID, EQF, competence-based knowledge spaces and evidence-centered assessment. It completes a **desk literature / synthetic-case check only**, **not** EX-PLD-05; retain **PROPOSED / NOT RUN**. In the later comparison explicitly distinguish a K topic's explanatory depth from a person's demonstrated performance on task conditions, and allow alternative K-support bundles for the same outcome.

## EX-PLD-06 — Goal → Capability → Knowledge → external study loop

- **Status:** PROPOSED / NOT RUN; depends on credible curated materials and a real learner's task. [Scenario and alternatives](iteration-03-goal-capability-knowledge-external-retrieval-loop.md).
- **Question:** Does a scoped Knowledge map plus target-depth-based *selection and ready-to-use questions* enable a person to move from unfamiliar job requirements into useful preparation, independently of automatic competence assessment?
- **Frozen fixture before test:** one concrete vacancy, two Capability descriptions, 8–12 Knowledge topics with explicit conditional relevance, target-depth descriptions and 8–16 **reviewed, usable prompts**, including at least one deliberately unsuitable card to test detection. Include a knowledge item appearing in two Capability scopes and incomplete requirements.
- **Compare increments:** A map+links, B map+one-way importable external review items, C B+clearly labeled optional review outcomes (synthetic unless actual user authorized exchange). Keep underlying subject facts and requirements the same.
- **Observe:** can the learner explain the domain/scope, identify what is and is not known about the vacancy, select and export meaningful practice rather than a random pile of cards, import into an existing tool, and distinguish activity statistics from mastery/real performance? Track friction, errors and time to a sensible first study action; do not equate satisfaction with retention.
- **Falsifiers:** no useful question coverage; target depth and question depth mismatch; selection overwhelming; external app workflow faster without Prep; review records cannot be traced back to original selected items; user infers K mastered or C attained from counts.
- **Stop:** technical import demonstrated, specific user value/limitations recorded, Owner alternatives packet prepared. Does **not** prescribe Anki integration, two-way sync or a universal level model. Distinguish desk demo from actual user observation.

## Boundary

The current [landscape scan](landscape-scan-2026-10-12.md) is a **literature and product-feature review**, not a completed controlled experiment. Product pages are evidence that a feature is described, *not* independent evidence of product efficacy. Keep research observation distinct from an Owner decision and from Harness accepted scope.
