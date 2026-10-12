# EX-PLD-06 — Goal/Capability/Knowledge to external-study desk preflight

**2026-10-12 | NONCANONICAL SYNTHETIC TECHNICAL / LOGICAL CHECK | NO HUMAN PARTICIPANTS | NO PRODUCT TEST.**

Protocol: [EX-PLD-06](open-experiments.md#ex-pld-06--goal--capability--knowledge--external-theoretical-study-loop). Owner research assumptions: [current framing](research-framing.md). **The original human value experiment has not been run**; this check is a bounded preparatory experiment using a fabricated, explicitly user-supplied fixture. No new canon, UI design, production export API or content verification service is proposed.

## 1. Frozen hypothesis, input, controls and falsifiers

**Question for this preflight:** is a minimal Goal → optional Capability lens → reusable Knowledge → selected pre-existing material → external study packet chain logically expressible with one self-contained dataset *without* implying exhaustive knowledge, personal competence or independently editorially verified content? Can candidate notes be serialized without modifying selected questions/answers? **This is narrower than observing user value.**

**Input (no vacancy):** hypothetical user goal "Подготовить теоретическое объяснение HTTP-кэширования для API"; two Capability descriptions, ten Knowledge topics, 14 context-relative K–C scope edges with differing objectives, twelve supplied study items. The task is to choose material relevant to **conditional revalidation and 304** rather than review the entire corpus. Technical reference selected as source data: [RFC 9111 — HTTP Caching](https://www.rfc-editor.org/rfc/rfc9111.html), including links and simplified explanations. All items are **fixture assumptions**, not verified teaching outcomes.

**Machine-readable frozen data:** [fixture.json](../../../experiments/prep_study_loop/fixture.json); [candidate Anki text output](../../../experiments/prep_study_loop/sample-anki.tsv); [reproducible fixture check](../../../experiments/prep_study_loop/check.py).

**Before-check criteria:** (i) unique referentially valid IDs and complete internal links, (ii) K04 reused under C01 and C02 with different study objectives, (iii) a narrow task chooses 4 suitable cards + 1 longer *theoretical* scenario and rejects unrelated provided items, (iv) no scenario forced into flashcards, (v) UTF-8 TSV fields preserved byte-for-field when parsed, (vi) no claim about exhaustive scope, performance or actual trainer import. **Falsifiers:** broken links, loss of content/metadata on text export, cannot select without mandatory C interpretation, output includes off-goal cards, shared Knowledge must be duplicated to model distinct objectives, open scenario silently converted to a factual card. Fixture answer keys are authored by the same researcher and must be hidden during any subsequent user study.

## 2. Frozen comparison: identical data, different affordances (desk walkthrough, not an A/B test)

| Arm | Same source data available | Walkthrough: can the task logically be completed? | Distinguishing workflow / cost hypothesis, **not measured** |
| --- | --- | --- | --- |
| **D existing tools** | Full raw notes, prompts, metadata and scenario plus ordinary AI/notes/Anki; no informational handicap | Yes: filter the raw items and import via the external tool | May already be entirely sufficient; user's restructuring and transfer effort unknown |
| **C selection without navigator** | Same twelve source items and explanatory metadata presented in a flat collection | Yes: choose M04/M05/M07/M08 and preserve M10 separately | Might capture nearly all material-selection value; no demonstrated C vs B difference |
| **A contextual orientation** | Same source content through Goal + optional C01/C02 + shared K edges | Yes: locate K04/K05/K07/K08/K09 and explain how objective changes with scope; not automatically export | Orientation may or may not justify navigation complexity |
| **B context + selection** | Same data as A with selection/packaging affordance | Yes: select the four notes for TSV; preserve scenario as an external written task | No unique subject facts or guaranteed time saving vs D/C; workflow continuity remains to test |

**Data parity qualification:** D/C must get the same Knowledge explanations, item text, context assumptions and relationships *in accessible raw form*; A/B differ in presentation and operations, not privileged correctness. During actual user trial the baseline must be allowed to use realistic AI and note features, but any new content it generates is to be recorded. This paper table is a **possibility analysis**, not an observed human trace or quantified reduction in effort.

## 3. Recorded task outputs and discriminating cases

- **Task T1:** user seeks to explain conditional validation. Candidate study subset = **M04** (no-cache vs no-store), **M05** (Vary), **M07** (ETag / If-None-Match), **M08** (304). Related conceptual nodes = K04/K05/K07/K08/K09; overlapping dependencies do not imply a complete canonical syllabus. **M10** remains an open written scenario with distinct assessment needs, not an Anki card.
- **Negative control:** M11 (TCP handshake) and M12 (CSS specificity) are *not false*, but irrelevant to this specific selected Goal/C02 task. M09 (unsafe-method invalidation) is on-topic within wider C02 yet out of scope of *this narrower selection*. Thus an off-goal exclusion must be task-relative, not a global claim that K10 is unimportant.
- **Cross-context reuse:** K04 appears in C01 with an objective about why reuse requires validation and C02 with an objective about sequencing actual conditional revalidation. A single Knowledge entity is reused; intent attaches to the **contextual scope edge**, not an inherent "learner mastery depth" field. Whether users prefer this navigation is unknown.
- **Material fidelity:** text packet contains exactly M04/M05/M07/M08 Q/A pairs with origin tags; separate scenario M10 remains in the controlled fixture. Headers follow [official Anki text-import documentation](https://docs.ankiweb.net/importing/text-files.html) (`#separator:Tab`, `#columns`, UTF-8). These are candidate notes; **Anki itself was not available to import/review them**. Stable source item tags are *context annotations*, not Anki internal GUIDs or bidirectional sync.
- **Unknowns displayed:** fixture scope is deliberately incomplete; no employer, profession, competency, certification or completeness promise. A user can skip the Capability lens in a more direct Knowledge-first journey; mandatory traversal is neither needed for the representability check nor tested for usability.

## 4. Actual executed checks and evidence level

A structural and transport check was run in the connected tool environment on the frozen fixture and candidate export, validating counts/IDs, edge references, K04 objectives, excluded controls, card-versus-scenario type, and all four question/answer/tag fields after delimiter parsing. **All assertions passed (12 structural/export checks, grouped).** Source files include a small offline Python check for rerun with `python experiments/prep_study_loop/check.py`; it makes no dependency on Prep product code.

**Confirmed at this evidence level:** a small existing user-provided corpus can express contextual K reuse and distinct study objectives without cloning K; four candidate study notes can be separated from scenario and off-goal items; an Anki-compatible plain-text payload can retain selected front/back/tag strings exactly through a tab-delimited parse.

**Disconfirmed as general necessity:** a vacancy is required to start a Goal; every Knowledge item must become a card; exporting all available material is equivalent to selecting for a task; Capability has to store demonstrated individual proficiency. This is a representational counterexample, **not** a validated final domain ontology.

**Unmeasured:** real person can orient faster or correctly; time/mental effort; desirability of C perspectives; credible relative D/C/A/B costs; real Anki import; real external review; subject/content sufficiency; real user's authentic goal or participant decisions. No human interview or observation occurred. No prep-vs-tools user-value hypothesis was confirmed.

**Critical counterargument retained:** D and C can generate the *same* correct packet with the identical input. The primary potential differentiator is repeated **contextual navigation and continuity**, not a unique ability to create cards. Without human comparison, B has **no demonstrated incremental value** over C or D. A UI that merely exposes extra relation selection may add friction.

## 5. Next evidence step

The original EX-PLD-06 **remains not run**. Use the fixture only as a smoke-test input; for a real value study, replace the synthetic Goal with a participant's own task (keeping input parity), give D/C/A/B comparable access to the corpus, precommit observable orientation/selection/transfer tasks, counterbalance order or use separate participants, record elapsed time/errors/corrections and observe first actual external review where relevant. Report any inability to carry out a fair comparison, rather than inventing participant behavior. **Do not start product development or an additional editorial-verification program from this preflight.**
