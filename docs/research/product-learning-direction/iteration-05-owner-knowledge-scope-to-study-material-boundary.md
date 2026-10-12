# Iteration 05 — Owner clarification: Knowledge scope → fit-for-recall materials

**2026-10-12 | NONCANONICAL PRODUCT-DIRECTION RESEARCH / OWNER-STATED HYPOTHESIS (NOT A FORMAL PRODUCT REQUIREMENTS APPROVAL)**

Related: [EX-PLD-01 public episodes](experiment-01-public-forum-episode-review.md), [Iteration 03 external review-loop hypothesis](iteration-03-goal-capability-knowledge-external-retrieval-loop.md), [Iteration 04 competitive/goal examples](iteration-04-goal-to-useful-action-market-and-scenarios.md), [open questions](open-questions.md), [open experiments](open-experiments.md).

## 1. Owner clarification (source input, not a new formal acceptance)

Owner has clarified the primary value proposed for Prep. The product **helps a person navigate the content that may be needed for a chosen preparation Goal and construct appropriate learning/retrieval material for external study**. It is **not** expected to teach the whole target curriculum internally, guarantee that material was learned, conduct applied professional practice, or measure demonstrated competence/readiness.

Two proposed independently valuable user outcomes:

1. **Knowledge orientation** — inspect a relevant knowledge scope, its breadth, cross-topic relations, heterogeneous concepts/knowledge kinds, interactions and applicable detail/depth, using Goal and Capability as meaningful viewpoints.
2. **External learning material preparation** — select all/some scoped Knowledge, link fit-for-purpose practice material (potentially one or more prompts/cards per item/objective), package/transfer for a memory/retrieval tool such as Anki, thereby avoiding substantial manual selection/card-writing labor.

Owner regards Capability as a **semantic scope** for selecting Knowledge and its intended depth. It is **not** an assertion about a particular learner. Product value may arise from exploration alone even when the person does not start or complete external study. External history data are optional as a research direction; repeated-card statistics do not validate personal competence.

**Candidate user job statement — RESEARCH SYNTHESIS, not Owner wording:** “Given a concrete preparation goal, let me see what knowledge is plausibly relevant, how it is connected, and which depth/objectives matter; let me transform a chosen subset into reliable material I can actually import and review, without manually reconstructing both the syllabus and the cards.”

## 2. Responsibility boundary: actual input → output

| Stage | Input | Prep's proposed action | Outcome / what is NOT implied |
| --- | --- | --- | --- |
| Goal | Chosen goal or external statement (e.g. vacancy) | Context for exploration | A target, not a verified assessment specification |
| Capability description | Plausible action/outcome required by Goal context | Organize relevant Knowledge and target learning objectives | No statement that the person possesses the Capability |
| Knowledge space | Existing subject topics, their content, relations and applicability | Orient across breadth, relations and *intended* depth; allow subset selection | No proof of completeness, personal understanding or task ability |
| Practice material | Existing/reviewed candidate questions, answers, explanations, scenarios | Associate material with specific selectable Knowledge/objectives and produce externally usable selection | Not every K yields useful card; generation/quality require separate evidence |
| External trainer | Prepared selected material and applicable transfer format | Make usable outside Prep (Anki one example) | External tool performs reviews; export does not prove study, remembering or competence |
| Optional recorded Activity/Result | Source-authorized recorded review/practice events if later obtained | Relate existing observed records to preparation context and date | No automatic inference that Knowledge/Capability is mastered |

**Important acceptance tension:** accepted Product Intent/Capabilities in `mvp-vertical-slice` already require recorded activity/results intake, examination of history, and CRUD/bulk for all admitted kinds. The Owner's “main product stops at material handoff” is compatible with history being a secondary supporting capability, **but cannot itself retire or cancel those accepted Product Requirements**. A true scope reduction, if intended, requires explicit Owner / Product Requirements / Harness process. This note does not edit them.

## 3. Re-reading EX-PLD-01 under this narrower product job

**Evidence available:** [the deliberately selected 16 publicly self-reported episodes, 2024–2026](experiment-01-public-forum-episode-review.md). Specifically primary friction was coded NAV (2), RET (3), FEED (7), external expectation UNC (2), TIME (1), DATA (1); counts are **sampling artifacts**, NOT frequencies or comparative importance in the market. Seven cases were based on accessible full threads; nine on search excerpts. Posters were never interviewed or observed in Prep.

| User evidence category | Product relevance after narrowing | Strength / limitation |
| --- | --- | --- |
| NAV (L01 and I01) | **Directly compatible:** uncertainty about which subjects, methods, scope and depth make sense for the goal | Anecdotal problem evidence, not demonstration that Prep or C-based navigation helps |
| RET (A01–A03) | **Directly compatible:** manual authoring/review load can be the bottleneck; selective good items could save preparation effort | Authors mention existing AI and Anki workflows; automatic export alone is not the hard part; overproduction of cards may harm |
| FEED (L02, L04, I02, C01–C04) | **Outside primary product promise:** ability to build software, solve lab tasks or succeed in mock interviews needs applied activity | Does **not refute** a deliberately scoped Knowledge/material product. It **limits** which learning outcomes its material can honestly address |
| UNC (I03/I04) | **Constraint on the map:** even recruiter-guided interview content may differ from eventual tasks | Prep cannot assert “all required knowledge for this vacancy” without well-bounded provenance, context and explicit unknowns |
| TIME/DATA (L03/A04) | Possible auxiliary usefulness in reducing card/selection effort, or interop | Neither demonstrates a standalone history/sync product need |

Additional corroborating naturally occurring cases retrieved 2026-10-12:
- [First-year pathology resident reports spending more time making Anki decks than studying](https://www.reddit.com/r/Anki/comments/1njhx4p/does_making_anki_decks_always_take_this_much_time/) — a real reported material authoring burden, but not evidence that externally generated deck is equally effective.
- [C++ learner asks whether to study engine, fundamentals or project next](https://www.reddit.com/r/learnprogramming/comments/1r3sizn/am_i_stuck_in_tuturial_hell/) — a real reported goal-to-scope uncertainty, possibly solvable by a course/community instead.
- [Anki learner reports fatigue at 150–200 cards/day](https://www.reddit.com/r/Anki/comments/1nv2g6y/doing_flashcards_is_too_tiring/) — **counterexample** to generating *more* cards as success; relevance and minimality matter.
- [Anki official manual on effective learning](https://docs.ankiweb.net/editing.html) warns against memorizing material without understanding and recommends short reviewable prompts. Content selection, card suitability and comprehension-before-review must remain explicit. The manual is product advice, not a causal test of Prep.

**Updated research synthesis:** earlier “we should possibly build an applied-practice coach” was an unjustified scope expansion from observed problems outside the Owner's narrow job. The evidence is consistent with a smaller **orientation + preparation-material pipeline**. The evidence does NOT yet validate adoption, trust, competitive superiority, learning outcomes or market size.

## 4. Internal tensions to resolve before promising “all necessary Knowledge”

### P0 — 'Necessary' vs 'plausibly relevant'

For an open-ended goal (vacancy, role, broad profession), scope completeness and universal necessity cannot be assumed; an employer's interview may not map one-to-one to a job posting. The same Capability can be approached through alternative strategies and tool stacks. Safer **candidate** product promise: “transparent, context-dependent suggested scope with explicit omissions/unknowns”, unless authoritative examination/curriculum criteria are available. Data presence in Prep is not coverage evidence.

### P1 — 'Capability determines Knowledge depth' requires an explicit context

The statement is a usable shorthand for the product hypothesis, but a bare reusable Capability name (“design an API”) cannot set a single required depth universally. A job's seniority, constraints, target task and user purpose may change which aspects need detailed explanation, comparison or applied reasoning. Different Knowledge items may have **different, noncomparable** learning objectives. Three distinct interpretations must stay separate:
- depth/detail of material presented about a subject;
- target cognitive/learning objective **for this Capability in this Goal/context**;
- a person's actual recall/understanding/competence (NOT derived by Prep).

No requirement here for a single numerical depth scale or proof of knowledge.

### P1 — Subject knowledge vs review item

A Knowledge concept/page may contain definitions, causal mechanisms, tradeoffs and connections. A card/task materializes **some testable part** of that content: a definition, example, distinction, explanation or response to a bounded scenario. “K appears in C scope” does not imply all content is covered by cards or that a recall prompt measures C execution. High-quality human review or clear sourcing is an **experiment input**, not a silently admitted product obligation.

### P1 — Minimality vs card volume

Prep is useful if selected learning prompts are **relevant and reviewable**, rather than numerous. More cards raise review cost and may distract from comprehension or external applied learning. The proposed pipeline needs a negative example where a misleading or unnecessary card must be rejected; avoid card count as a success metric.

### P2 — External runtime is illustrative

Anki is a useful first example, not a necessary universal training channel. The minimal technical feasibility of UTF-8 imports was established earlier. A two-way sync or competency estimate is not a consequence of exporting a card file.

## 5. Product concept alternatives, still unselected

| Hypothesis | Complete user result | What could invalidate it |
| --- | --- | --- |
| A — Orientation only | Understand relevant Knowledge, its relations, different possible required depths, select next focus | A roadmap, employer criteria, course index or AI prompt already does this with less effort |
| B — Orientation + reviewed study-material package | Same orientation **plus** externally usable, targeted retrieval materials (without manual card-by-card authoring) | Available content is thin/incorrect, chosen prompts mismatch intended objective, an AI-to-Anki baseline is faster, exported deck is an excessive burden |
| C — Material preparation without extensive conceptual navigator | User enters well-defined scope/content and gets high-quality Anki-ready material | May outperform B if navigation is friction and the core pain is just card authoring; threatens the case for a full Knowledge/Capability explorer |
| D — External course/mentor/AI + Anki directly | No Prep; existing tools used to select material and create cards | Valid competitive baseline: design of Prep must show incremental value over it |

**Recommendation, not choice:** compare D→C→A→B under the *same* authentic goal/material corpus when feasible. This includes the critical lean counterfactual **C (card generator alone)**, which prior A/B/C progression obscured. No product direction is selected.

## 6. Minimal end-to-end value check, not a software roadmap

**Bounded desk fixture:** one concrete hiring/interview preparation aim and two plausible Capability descriptions, 8–12 conditionally relevant knowledge topics, links/short explanations, and ~10 reviewed practice prompts. Explicitly mark uncertain requirements, one unsuitable prompt, one K relevant to two C contexts, and different intended depths. Have at least one scenario-style “explain why” item alongside simpler factual recall.

Compare:
1. **D baseline:** applicant annotates goal and creates review material using course/AI/notes/Anki as usual.
2. **C:** knowledge/questions supplied in small form, selective export without Capability navigation.
3. **A:** goal-relative scope/relation/depth orientation and selection, without preprepared prompts.
4. **B:** A plus chosen usable practice prompts and one-way Anki import.

Freeze equal source facts and same independently checked content. Desk check can establish **logical task completion** (can select relevant subject items, see missing/unknown, reject an unsuitable prompt, import selected material) and technical feasibility. It **cannot** establish human time saved, usability, trust or willingness to switch; that still requires participants or later real use.

Potential outcomes to collect once human behavior is available: independently assessed **scope relevance**, material quality/fit, **effort from given goal to review-ready packet** vs baseline, editing/correction overhead, and *whether orientation is separately valuable*. Keep actual learning/retention outside this first product proof. Existing [EX-PLD-06](open-experiments.md) and [EX-PLD-07](open-experiments.md) remain unrun.

## 7. Owner questions, no implicit approvals

1. **P0 product promise:** does “scope” mean *suggested relevant* (in open contexts) or *complete necessary* (only with an authoritative externally supplied blueprint)? The absolute wording is ungrounded for vacancies.
2. **P0 minimum product value:** is orientation independently valuable enough to test A, or can a card-preparation-only C solve the same core pain cheaper? Compare before choosing.
3. **P1 depth:** should targeted study depth be relative to **Goal × Capability × Knowledge × conditions** rather than solely to a reusable C? Avoid defining a domain relation here.
4. **P1 content quality:** who provides a reviewed subject corpus and cards for the first end-to-end check? If none exists, “generate cards” is not a self-explanatory learning-quality solution.
5. **P1 acceptance tension:** is recorded Activity/Result import still part of accepted MVP while optional in the headline user job? Only the formal Product Requirements authority can decide changes.

**No Product Requirements, domain model, UX, Anki integration, Harness currentness or capability-assessment decisions were made by this research note.**
