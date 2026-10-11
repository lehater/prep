# Open experiments — Capability / Goal semantics

**Classification:** NONCANONICAL RESEARCH CHECKS ONLY (2026-10-12). This is not an engineering backlog, an alternative Core Question register, a Product Requirements artifact, a Harness acceptance/currentness claim, or an authority decision. See [open questions](open-questions.md) for the actual research questions and [topic handoff](HANDOFF.md) for the current project context.

## How to use this list

Pick a bounded check when its prerequisites are satisfied; there is **no mandated global order**. One experiment can inform multiple questions, and a question can require more than one test. Set the inputs, competing hypotheses and falsification criteria **before** testing; preserve results, including failures and inconclusive outcomes, as linked research evidence. Do not change the hypothesis mid-run to produce a favourable result. A completed experiment does **not** close an owner/Authority decision.

Use a dedicated note for meaningful results; use `experiments/<name>/` only for runnable code that is genuinely necessary. Do not create a frontend for semantic tests by default. Keep every record sufficient for another chat/contributor to resume.

## EX-GF-01 — Goal-first domain-model stress test

- **Status:** PROPOSED / NOT RUN. Contract and concrete scenario assertions to be frozen immediately before execution.
- **Priority / scope:** P0 semantic feasibility, with bounded P1 composition cases.
- **Related open questions:** [GD-00..05, CD-01..06](open-questions.md). This test informs them but cannot select owner-governed predicates.
- **Decision being informed:** What is the smallest consistent set of product-visible behaviours and domain assertions needed to represent a complete Goal-first preparation cycle through Capabilities, without inventing a workflow/Procedure or learner-mastery tracker?
- **Alternative models to compare:** (A) individual Capabilities, no C–C decomposition; (B) same instances plus optional C–C composition with precisely stated candidate semantics. Separately compare unordered composition with an attempted child sequence **only where the strict-protocol counterexample demands examining execution order**. Treat relation predicates as hypotheses, not adopted canonical types.
- **Common fixture scenarios:** (S1) Goal initially has no Capabilities, then Goal/Capability/Material/Activity/Result can be examined together after practice; (S2) a Capability initially has no known children, then is refined with nested Capabilities without automatically changing instance identity; (S3) a Capability reused by two Goals, with distinct activity/result context; (S4) architecture or communication ability with flexible ordering versus execution of a strict measurement protocol whose operational steps have required order.
- **Method:** Freeze named instances, candidate propositions, edits/deletions and expected user/semantic questions. Represent them in Markdown tables first; use structured YAML or a tiny checker only if necessary to expose a logical/state-transition ambiguity. Run the **same factual scenario** through alternatives A and B and record exact expressible facts, counterexamples, unwanted inferences and missing semantics.
- **Potential falsifiers:** A model requires a fictional mandatory competence when Goal is incomplete; silently treats same-text records as the same identity; cannot retain Goal-specific recorded history without false fact conflation; implies all child skills mastered or a child execution order without grounds; represents required protocol step order only by falsely treating steps as ordered Capability components.
- **Out of scope:** UX preferences, click metrics, full UI/frontend, backend, production storage, complete ontology, mandatory ordered learning path, auto mastery/readiness/goal completion, selecting new accepted relation kinds.
- **Stop condition / evidence:** Record each S1–S4 as REPRESENTABLE, COUNTEREXAMPLE or INCONCLUSIVE, with a trace of assumptions and evidence; list minimal needed semantic assertions and a compact P0/P1 owner-decision packet. Unresolved meaning is an explicit result, not permission to extend scope automatically.
- **Next artifact:** a linked `experiment-01-goal-first-model-stress-test.md` with frozen input/alternatives, findings and limitations. **No results exist yet.**

## EX-GF-02 — Goal-return and flat-versus-composed user workflow

- **Status:** DEFERRED / NOT RUN. Human observations do not yet exist; [Iteration 03](iteration-03-capability-description-composition-and-context.md) is **only a desk-designed comparison**.
- **Priority:** P1, conditional on a concrete user-value decision need after EX-GF-01 or a separate owner request.
- **Related open questions:** [GD-00, GD-02, CD-02, CD-05](open-questions.md).
- **Decision being informed:** Does seeing saved Goal/Capability context and optional composition materially help a user return after practice and select the next action versus a flat representation on the **same records**?
- **Method if triggered:** Freeze a common Goal, Capabilities, PracticeMaterials, Activity and Result; compare flat/composed and, if justified, persisted/unpersisted focus under the same task. Observe ability to reconstruct context, choice rationale, wrong necessity/mastery assumptions and extra interaction burden. Start with a lightweight mock or paper prototype; frontend only if interaction is the actual variable under test.
- **Potential falsifiers:** Composition adds no discernible utility in the observed task, creates confusion that all children are mandatory, or purported context recovery requires facts not actually retained by the model.
- **Out of scope:** Using theoretical semantic representability as a substitute for human observation, redesign of overall frontend, 3D/UI styling choices, or treating an observed preference as formal acceptance of a C–C relation.
- **Stop condition / evidence:** Store observed task protocol, anonymized results, limitations and owner decision options; if no user test occurs, leave status DEFERRED, never mark passed.
- **Next artifact:** only upon execution; do not create runnable code or empty experiment directory now.

## Boundary and handoff

**Research status** describes whether a bounded test has been performed. **Owner decision status** is separate. **Harness currentness/acceptance** is managed only through the routed authoritative process. Do not infer approval of a new relation, CRUD rule or product promise from either a fixture or a successful prototype.

Current starting point: review [Iterations 01–03](README.md), freeze EX-GF-01 conditions, then perform the scenario stress test. Work on other independent research questions in any useful order and link them to results where relevant.
