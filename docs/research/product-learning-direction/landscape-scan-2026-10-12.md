# Learning domain and product landscape — initial desk review

**Date:** 2026-10-12. **Status:** NONCANONICAL EVIDENCE REVIEW, NOT AN EXPERIMENT, PRODUCT CHOICE OR CANONICAL REQUIREMENT.
**Purpose:** Understand what people do when preparing to acquire knowledge/abilities, which established learning mechanisms matter, how existing products intervene, and which *questions* Prep must answer. Sources were checked through public published original research/reviews and vendor documentation (links below); no learner interviews, user experiment or software comparison under identical conditions was performed.

## 1. Reframe the question without prejudging the solution

Overly narrow: "How should Goal be related to Capability and Knowledge?" This asks about a data model before identifying the job. Also too narrow: "Which exercise should Prep show next?" That assumes its chief value is a trainer.

**Candidate foundational question:** *In a real learning/preparation situation, what prevents a person from becoming able to do what they intend, and which observable actions should Prep support so that their next preparation decision or learning outcome improves?*

Keep separate:
1. **Desired external outcome** (pass interview, earn certificate, complete work, understand topic). It is not always identical to gaining an ability.
2. **Learning outcome** (remember, explain, solve, perform, transfer to different conditions). A goal may be incomplete or vaguely specified.
3. **Subject knowledge** (reusable content/meaning). Its *presence in a workspace* is not personal possession or proof of recall.
4. **Capability/performance** (what a person can do under relevant conditions). Having read content or completed one exercise is not a universal competence claim.
5. **Learning action** (read explanation, study worked example, retrieve from memory, practise, perform task, seek feedback, reflect).
6. **Evidence and feedback** (observed attempt, mistake, delayed recall, external feedback, evaluation), with different validity limits.
7. **Agency/decision** (what to do next and why; learner, teacher, algorithm or agreed mix).

This is an **analytical lens**, not a mandatory ontology, normalized schema, stage-gate or proposed list of Product Capabilities. Learning is often iterative, not sequential.

## 2. Learning-science evidence relevant to product questions

| Finding with evidence | Product question (not instruction to implement) | Limit / caution |
| --- | --- | --- |
| Dunlosky et al. 2013 reviewed ten study techniques; practice testing and distributed practice showed high general utility; mere rereading/highlighting was less robust | Should Prep help the user *actively retrieve* learned Knowledge, or at least connect external retrieval practice back to their Goal? | Recall benefit does not mean all complex skills reduce to flashcards; transfer needs separate consideration |
| US Institute of Education Sciences / What Works Clearinghouse 2007 recommends delayed/spaced instruction, interleaving examples and problem solving, testing, explanation prompts | Is the learner struggling to remember, comprehend, or apply? Which kind of material/task fits that need? | Guide covers specified educational contexts; no turnkey universal schedule |
| National Research Council 2012 describes deeper learning as developing usable, transferable understanding; far transfer is hard, and understanding principles and their application matters | What would count as applying Knowledge to a *new* problem and developing Capability? | Does not make successful isolated practice a guarantee of generalized expertise |
| Biggs 1996 constructive alignment relates intended learning outcomes, learning activities and evidence/assessment | Should a goal/capability be expressed in learner-visible outcome terms *before* selecting practice? | Educational design principle, not required Prep entities or a mandated order |
| OECD 2025 review of formative assessment describes goal→elicited thinking/attempt→feedback→adjusted action loop | Should Prep surface *specific observed difficulties* and help a person respond? | A recorded result is not automatically validated diagnostic feedback or learner mastery |
| EEF 2025 review on metacognition and self-regulation discusses planning, monitoring and evaluating learning | Is a learner-run reflection/next-choice interface sufficient for some users even without machine-assessed mastery? | Strongest evidence concerns teaching/pupil contexts; transfer to independent adult learners must be tested |

Primary/authority references:
- [Dunlosky et al., Psychological Science in the Public Interest 2013](https://www.psychologicalscience.org/publications/journals/pspi/learning-techniques.html).
- [IES/WWC Organizing Instruction and Study 2007](https://ies.ed.gov/ncee/WWC/PracticeGuide/1).
- [National Research Council, Education for Life and Work (2012), deeper learning and transfer](https://www.nationalacademies.org/read/13398/chapter/6).
- [Biggs, Enhancing teaching through constructive alignment (1996)](https://doi.org/10.1007/BF00138871).
- [OECD, Using formative assessment and feedback (2025)](https://www.oecd.org/en/publications/unlocking-high-quality-teaching_f5b82176-en/full-report/using-formative-assessment-and-feedback_189fb6dc.html).
- [EEF, Metacognition and self-regulation evidence review (2025)](https://educationendowmentfoundation.org.uk/education-evidence/evidence-reviews/metacognition-and-self-regulation-guidance-report).

**Synthesis (research interpretation):** "Learning" is not a single object/action. A person can acquire a correct mental model, repeatedly retrieve facts, practise a particular task, fail to transfer on a novel task, or misjudge their competence. None of these can be collapsed into storing Knowledge/Capability or counting completed exercises. This does **not** establish that Prep must implement an embedded tutor or assessment.

## 3. Existing product design patterns — feature evidence, not outcome benchmarking

| Pattern / reference product | Observable design choice reported by producer | What this probes for Prep | Key limitation |
| --- | --- | --- | --- |
| **Knowledge organization: Obsidian** | Notes, links and graph navigation; material is user organized | Value of exploring connected Knowledge independent of any training engine | Graph visibility is **not** evidence a person learned |
| **Recall and retention: Anki** | Active recall + scheduled spaced repetition on cards | Memory-focused practice for facts/concepts; may complement external Prep activities | Recall of cards alone does not guarantee applied performance |
| **Connected notes and recall: RemNote** | Notes can become flashcards; SRS and task-specific review | An example bridging reusable Knowledge and direct learning in one workspace | Vendor's efficacy claims are not independently established by its docs |
| **Sequenced language learning: Duolingo** | Designed lesson path mixes skills, explanations and personalized revision | Reduced "what next?" burden through expert curriculum and review | Highly constrained language domain does not generalize automatically |
| **Interactive concept learning: Brilliant** | Guided paths, explanations plus interactive exercises/checkpoints | Learning Knowledge through reasoning, not merely storing exercise links | Requires authored curriculum and quality feedback |
| **Course and skill practice: Khan Academy** | Practice/tests/challenges with a per-skill "familiar/proficient/mastered" mastery system | A way to link visible attempts to progression claims | "Mastered" is a product-specific measurement definition, not a general competence fact |
| **Competency demonstration: WGU** | Outcome/competency-based education with assessments that demonstrate knowledge/skills | Competence claims require performance criterion and adequate assessment | Institution, standards and assessor context differ from personal self-study |
| **Integrated learning & feedback: CMU OLI** | Guided course content, interactive exercises and immediate feedback | Tight content, attempt, feedback and revision loop | Authoring and evaluation infrastructure has substantial cost |

Vendor sources checked:
- [Obsidian graph / links](https://obsidian.md/help/plugins/graph)
- [Anki manual, Background](https://docs.ankiweb.net/background.html)
- [RemNote flashcard basics (updated 2026)](https://help.remnote.com/en/articles/8663109-flashcard-basics)
- [Duolingo current learning workflow](https://blog.duolingo.com/duolingo-101-how-to-learn-a-language-on-duolingo/)
- [Brilliant learning paths (updated 2026)](https://brilliant.org/help/features/what-are-learning-paths/)
- [Khan Academy mastery](https://support.khanacademy.org/hc/en-us/articles/115002552631-What-are-Course-and-Unit-Mastery)
- [WGU competency-based approach](https://www.wgu.edu/about/story/cbe/what-is-cbe.html)
- [CMU Open Learning Initiative](https://oli.cmu.edu/about/)

**Important:** this is not an exhaustive market assessment, pricing/feature certification, user outcome study, or vendor recommendation. Product site docs mainly verify that their product *describes* a feature. They cannot show which architecture is effective for Prep's users.

## 4. Avoid a false A/B/C trilemma: independent product dimensions

Prep may combine subsets; do not select one slogan prematurely.

| Dimension | Smaller intervention | Larger intervention | New cost/risk when larger |
| --- | --- | --- | --- |
| Guidance: who decides next? | Learner-led navigation and reflection | Curated path / adaptive recommendation | Validity of route, personalization and user autonomy |
| Knowledge use | Explore/select/read externally | Explain, retrieve, review directly | Content quality, evaluation and review interaction |
| Capability practice | Link/select external exercise | Interactive applied task + feedback | Authoring, grading, scenario representativeness |
| Detecting gaps | Show *missing information or actual errors* | Infer competence, readiness or mastery | Assessment validity, bias, false certainty |
| Context/history | Record what was done and when | Model change over time and counterfactual next-best actions | Longitudinal learner state and trust |
| Breadth | Serve one user's narrow domain | Cover any goal, skill and content domain | Content sourcing, generality, calibration |

This makes "organizer vs trainer vs tutor" a **product-service spectrum**, not three mutually exclusive business choices. If a lightweight organizer solves a real problem, it may be valuable without assessment; if goal-oriented practice is essential, it may need active support. These are hypotheses to test.

## 5. Knowledge examples that expose different needs

| User Goal | Knowledge role | Capability/performance role | Suitable learning action (illustrative, not required) | Risk of an oversimplified model |
| --- | --- | --- | --- | --- |
| Retain anatomy vocabulary for exam | Primary factual/relational content | Ability to retrieve and distinguish terms under test conditions | Explanation + self-test + delayed review | A generic applied-work exercise adds friction |
| Explain caching tradeoffs at interview | Understanding mechanisms, consistency/staleness and when to apply | Defend design decisions under uncertainty | Study explanation, then novel design case with feedback | Card recall alone may not transfer |
| Personally perform a measurement protocol | Safety/measurement principles and operational instructions | Execute safely/accurately under concrete conditions | Observe example + supervised practice and feedback | A list of Knowledge or unordered subskills cannot validate protocol execution |
| Obtain externally issued certification | Exam blueprint and relevant knowledge | Some competence may be necessary, but third-party credential is a separate outcome | Study, practise, take externally controlled assessment | External success cannot always be reduced to a necessary personal ability |

**Caution:** each row is an analytic counterexample, not empirical user evidence or a decision about a required universal Goal→Capability→Knowledge→Material chain. The owner-approved **Capability-oriented primary Goal-first direction** remains a real product input; its exact observable promise is subject to Product Requirements alignment.

## 6. Current Prep commitments versus product research

At 2026-10-12 the integration branch's [accepted Product Intent](https://github.com/lehater/prep/blob/mvp-vertical-slice/.harness/knowledge/product-intent.yaml) and [Product Capabilities](https://github.com/lehater/prep/blob/mvp-vertical-slice/.harness/knowledge/product-capabilities.yaml) commit to:
- explore Knowledge, Goals, Capabilities, PracticeMaterial, related Activity/Results and available relationships from different perspectives;
- select information/material for study **outside Prep** and make that selection available;
- bring back recorded Activity/Results, examine temporal and subject context;
- user full CRUD + bulk load of every admitted MVP kind.

They do **not** currently approve a built-in SRS, adaptive study plan, internal assessment, automated deficiency detection, learner mastery, mandatory curriculum, fixed C–C decomposition, or provenance verification. New directions would need explicit Product Requirements/Authority review. Conversely, accepted **external-use** capability is not proof all learning must stay external forever.

Distinguish these semantic claims:
1. "Knowledge K is in Prep" — information access.
2. "K is linked to Capability C" — a *potential* subject relation, not yet admitted.
3. "User studied/attempted K" — an observable recorded activity.
4. "User answered an item correctly" — a result under a particular task/context.
5. "User can reliably recall K later" — requires delayed evidence.
6. "User can perform C in novel conditions" — requires appropriate performance evidence.
7. "User achieved Goal G" — may involve an external criterion not reducible to C.

Do **not** infer each stronger claim from the weaker one.

## 7. Research findings, non-findings and next question

**Findings from this desk scan:**
- There are established, different mechanisms for comprehension, retention, applied skill and self-regulation; a single exercise-driven workflow omits important learning activities.
- Existing products specialize in genuinely different parts of these mechanisms; linked notes, cards, guided paths and validated assessments are not interchangeable.
- A Knowledge-centered task and a performance-centered task can have different suitable preparation actions. A one-way Goal→Capability→Knowledge→Material pipeline may be useful as navigation without being an objective general learning order.

**NOT established:** the best target user of Prep; relative frequency/urgency of bottlenecks; willingness to use Prep instead of current tools; that any proposed product variant outperforms another; whether integrated recall/feedback is desirable or economical; whether authentic competence can be automatically diagnosed; which relationship kinds enter MVP.

**Next evidence question (open, not automatically assigned):** "Describe an actual recent learning goal. How did the person decide what to study, which Knowledge mattered, what exercise to do, how to evaluate the result, and what to do next? Where was the biggest consequential breakdown?" See [questions](open-questions.md) and [proposed experiments](open-experiments.md).

**Stop condition for this review:** product/learning-domain option scan sufficient to formulate alternative learner jobs and testable questions. **Do not escalate this review into a product direction change or new canonical model.**
