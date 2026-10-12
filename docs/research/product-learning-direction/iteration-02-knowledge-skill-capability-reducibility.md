# Iteration 02 — Is an applied Capability reducible to Knowledge?

**2026-10-12 | NONCANONICAL PRODUCT RESEARCH | BOUNDED LITERATURE + SYNTHETIC COUNTEREXAMPLE CHECK | NO OWNER/DOMAIN DECISION**

## 0. What was investigated

Owner's central question: if conceptual "building blocks" are Knowledge, then knowledge of how to assemble those blocks can itself be Knowledge. Does this mean **any Capability** is ultimately only some Knowledge at sufficient breadth/depth, or is a separate notion of **being able to carry out a task** required? Test on designing an API, implementing software, diagnosing faults and a bodily skill. Preserve the prior [Iteration 01](iteration-01-knowledge-space-and-applied-capability.md) alternatives instead of silently adopting one.

**Question needs scope.** "Knowledge" has at least three non-interchangeable meanings:
- **K-content**: an independently describable/inspectable body of subject matter, relations, principles, procedures and design strategies in Prep. Accepted Problem Evidence uses *this* sense: information about a subject; mere presence does **not** assert that a person knows it.
- **K-person**: what an actual person knows/understands/retains, with uncertainty about its evidence and retention.
- **Know-how or skill**: practical ability/disposition to select, coordinate and execute an action under some conditions, which may involve cognition, timing, perception, motor control, tools and context. Whether this is philosophically a type of knowledge is *contested*; do not redefine K-content until all human skills are tautologically called Knowledge.

And distinguish **C-specification** ("can design payment API under failure and review constraints") from **C-person assertion** ("this particular person can reliably do it"), and **Task-instance** ("design this API with this provider, constraints and artifacts"), and **Activity/Result** ("specific attempt and outcome"). These have different truth conditions and evidence burdens.

## 1. Literature findings, strengths and boundaries

### Philosophy: knowing-that vs knowing-how is unresolved

[Stanford Encyclopedia of Philosophy, Knowledge How](https://plato.stanford.edu/entries/knowledge-how/) surveys Gilbert Ryle's objection to collapsing knowing-how into knowing-that and later intellectualist arguments, including [Stanley & Williamson (2001)](https://doi.org/10.2307/2678403). E.g., being told a correct way to swim does not entail being able to swim; proponents of intellectualism may reply that knowing how requires a distinctive *practical mode* of grasping a proposition. Also, physical incapacity can prevent someone who retains know-how from *performing now*. Thus both "**all skill is just theoretical knowledge**" and "**no skill can be a kind of knowledge**" overstate the evidence. **For Prep:** prefer operationally distinct descriptions and claims, not a purported settlement of metaphysics.

### Cognitive psychology: instruction and embodied performance are not interchangeable

[Anderson, Acquisition of Cognitive Skill (Psychological Review, 1982; ERIC record)](https://eric.ed.gov/?id=EJ270567) proposes declarative and procedural phases and a process of knowledge compilation. This gives a mechanism for turning explicitly represented methods into executable skill, rather than merely adding one more text concept. It is a theory, not proof all skills always pass through these phases.

[Squire, Memory systems of the brain (2004)](https://pubmed.ncbi.nlm.nih.gov/15464402/) reviews dissociation between conscious declarative memory and other learning. [Cavaco et al., The scope of preserved procedural memory in amnesia (2004)](https://pubmed.ncbi.nlm.nih.gov/15215216/) tested ten amnesic patients and 25 matched controls on perceptual-motor tasks: acquisition and retention of some skills occurred despite impaired declarative memory about tasks. This supports **partial independence of the learning mechanisms**, not an argument that professional design skills are all nondeclarative or that Knowledge cannot include methods.

### Complex skills: coordinated whole-task practice matters

[Frerejean et al., Designing instruction for complex learning: 4C/ID in higher education (2019)](https://doi.org/10.1111/ejed.12363) and [Janssen-Noordman et al., Design of integrated practice for learning professional competences (2006)](https://pubmed.ncbi.nlm.nih.gov/16973459/) show why isolated part-learning is often not equivalent to competent performance on complex tasks. 4C/ID integrates **whole learning tasks**, supportive information, just-in-time procedural information and part-task practice. Some skills are routinized through repeated components; nonroutine coordination and decisions need varied integrated tasks. **For Prep:** a coverage view over all separately described subject topics may be a useful *learning aid*, but is insufficient evidence that the person can coordinate them.

### Qualification models deliberately distinguish knowledge, skills and responsibility

[European Qualifications Framework (EQF, 2017)](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32017H0615%2801%29) defines knowledge as factual/theoretical; skill as using knowledge/know-how to accomplish tasks; and responsibility/autonomy as a separate dimension. **For Prep:** profiles of professional requirements plausibly need not be a single Knowledge-depth scale. The framework is a *classification decision for qualifications*, not an ontological proof.

### Competence-based Knowledge Space Theory: a close formal precedent, with a warning

[Hockemeyer et al., Applying Competence Prerequisite Structures for eLearning and Skill Management](https://www.jucs.org/jucs_9_12/applying_competence_prerequisite_structures/Hockemeyer_C.html) links test/problem items and skill prerequisites. [On the assessment of learning in competence-based knowledge space theory, Journal of Mathematical Psychology 80 (2017)](https://www.sciencedirect.com/science/article/pii/S0022249617301694) uses two distinct *levels*: competence states (sets of inferred skills) and performance states (sets of solved tasks). Its **skill function** can assign a problem a collection of *alternative minimally sufficient skill sets*: the same task may be solved by different combinations. The paper expressly warns **no guaranteed one-to-one correspondence** between competence and performance; even changes in competence may not become visible in observed task results.

Very important terminology trap: classical **Knowledge Space Theory** often operationalizes a "knowledge state" as a set of *test items/problems the individual can solve*, **not** as Prep's reusable subject Knowledge graph. It is false to cite KST as proof that all professional capability is reducible to semantic knowledge content. Its mathematical maps could inspire comparisons, but importing them would add unsupported assessment assumptions.

### Evidence is not the same as claimed attainment

[Mislevy, Almond & Lukas, A Brief Introduction to Evidence-Centered Design (ETS, 2003)](https://www.ets.org/research/policy_research_reports/publications/report/2003/hsgs.html): assessment requires mapping intended claims to observable evidence and tasks that can elicit that evidence. One successful task does not universally validate a repeatable Capability, and one failure need not prove a Knowledge deficiency. Prep does not currently have accepted automatic mastery/readiness assessment.

## 2. Main conceptual test: does "knowledge of assembly" solve the problem?

Suppose K1 = "HTTP API", K2 = "transactions", K3 = "idempotency", K4 = "failure handling". Introduce K5 = "how to design their integration under constraints".

**What this legitimately adds:** K5 can be content about strategies, patterns, tradeoffs, order of design inquiry and typical failure modes; a user can explore K5 at overview/deeper levels; K5 may refer to K1-K4 without being identical to their sum.

**What it cannot establish by itself:** whether a specific person can select the strategy for an unfamiliar case, coordinate constraints, make tradeoffs, produce a valid design, communicate/defend it, or do so reliably and autonomously. Possessing a K5 page in Prep cannot establish that even if K5 is called "procedural Knowledge". A person who can recite K5 may fail the task; a person may perform a narrow routine successfully with limited explicit articulation of K5.

**Recursion:** one can introduce K6 = "how to apply K5 in this special context", then K7 ... This does not make demonstrated ability disappear; it continuously adds **content descriptions** while retaining an independent question about **actual execution**. The recursion is a problem for an operational data model, not a philosophical impossibility proof.

**Strong reductionist reply (must be preserved):** a philosopher could argue that *genuinely* knowing a practical way (not merely being able to recite rules) already includes the relevant know-how. This is compatible with operationally storing K-content and C-performance **separately**. Therefore synthetic failure cases falsify the naive "list of declarative K-depth thresholds ⇒ C" model, **not** every sophisticated thesis that know-how is a kind of knowledge.

## 3. Four frozen thought experiments — analytical checks, NOT human experiments

| Case | Subject Knowledge that is available/understood | Intended performance | Counterexample to simplistic reduction |
| --- | --- | --- | --- |
| D1. **Design a payment API** (no code) | HTTP contract, transaction boundaries, idempotency, provider failures, strategy/principles of design | Produce defensible contract, state transitions, retry/idempotency behavior and failure analysis under specified conditions | Can explain every concept and canned design recipe but choose an inconsistent boundary on new requirements; other architecture can be valid using different mechanisms. Cannot infer C from all-listed K depth |
| D2. **Implement code** | Language syntax, algorithms, debugging methods, test principles | Produce and debug a working program under repository, tool and time constraints | Fluent explanation of algorithms does not guarantee reliable integration/testing/working memory management in a novel task; written successful tutorial copy does not prove transfer |
| D3. **Diagnose a fault** | System architecture, metrics, hypothesis testing, failure modes | Identify likely cause with limited signals and choose useful tests under uncertainty | Two agents share reference knowledge but differ in strategy, contextual cue recognition and response to false positives; actual observations matter |
| D4. **Execute a physical protocol** | Mechanics, safety rules, explicit ordered steps and "how" description | Repeatable safe motor execution under changing sensorimotor conditions | Accurate verbal instructions do not ensure timing/coordination; skill may improve without corresponding explicit recall, as seen in limited procedural-memory research |

**Desk conclusion:** D1-D4 are *logically plausible* negative cases of fixed-K-list sufficiency. D4 is also consistent with the distinct memory-system evidence; we have **not** observed these specific personas or measured any actual Prep users. Complex professional capabilities often depend on *composition AND the act of applying*, not only stored descriptions of composition.

## 4. Alternative models and falsification targets

| Hypothesis | Ontology / user-facing meaning | What it captures | Failure / ambiguity | Status |
| --- | --- | --- | --- | --- |
| **H1. Pure Knowledge thresholds** | C fully defined as K-set plus required depth per K; a person satisfying them is assumed C-capable | Coverage, goal-required topics, a simple gap view | Cannot infer novel performance; alternatives/change of context violate fixed universal bundle; knowledge-depth not necessarily ordered scalar | **Not sufficient as an evidence rule**; may still be useful as a *preparation projection* |
| **H2. Knowledge includes assembly strategy, C still a performance specification** | K can contain concepts + K-about-interactions/procedures/strategies; C is task/action/outcome/conditions and may use several K | Preserve subject-space unity without equating it to proof of real-world skill | Exact K–C link type, scope and performance criteria unresolved | **Analytically coherent candidate; not selected** |
| **H3. All know-how is some knowledge, no separate C** | Redefine "knowledge" broadly enough to encompass successful practical ability | Philosophically possible under intellectualist accounts | Prep's accepted K-content meaning is then lost; actual ability still needs person/task/context/evidence, even if renamed | **Philosophically open; operationally weak unless demonstrates equal user clarity and evidence integrity** |
| **H4. Capability adds third scalar "application level" to each K** | Practical depth of a single K separate from conceptual depth | A readable visual progress proxy | Integration is a many-part relation plus conditions; a scalar cannot explain which task, joint selection, substitutes or evidence | **Not sufficient alone**; possible supplementary view |

**Critical distinction:** H2 makes a **Capability-description** independent from Knowledge content. It does **not** assert that a human Capability can exist without relevant knowledge, that relevant Knowledge is universally necessary, or that automatic proficiency measures are available.

## 5. A small reproducible conceptual fixture (not a schema)

- Goal G1: interview with payment API design case; G2: operate a production payment gateway.
- Subject knowledge: K_HTTP, K_TX, K_IDEMP, K_RETRY, K_DESIGN, K_PROVIDER.
- Applied capability: C_DESIGN = design reliable payment-intent contract under provider failure and review constraints; C_OPERATE = diagnose and safely respond to partial payment failures under live operational constraints.
- Case/person P_A: explains each K (including K_DESIGN) but produces an incomplete idempotency contract for a novel provider behavior.
- Case/person P_B: operates a delegated-provider integration successfully in a narrow tested environment while unable to explain some broader transaction-theory topics.
- P_C: has no observed activity on K_TX; **UNKNOWN**, not insufficient.

**Candidate predictions:**
- H1's threshold view risks marking P_A ready and P_B deficient for C_DESIGN and/or conflating G1/G2.
- H4's K-by-K application scores still do not identify joint end-to-end success or alternative technique.
- H2 can *state* separate C_DESIGN and C_OPERATE and retain K relevance while distinguishing observed P_A failure and narrow P_B success, **but must not automatically infer general proficiency**.
- H3 can encode all the facts if "knowledge" is widened to include person-specific performance; at that point it is no longer the same concept as Prep's currently accepted *subject Knowledge*. Compare terms/UX explicitly before admitting.

**If one chooses to run an actual controlled test:** freeze two Task instances with different provider failure assumptions; assign the same knowledge content and credentials; capture a concrete artifact, explanation, result and alternative solution; then ask if the proposed interface allows navigation to what to study *without asserting unobserved mastery*. See the pre-existing [EX-PLD-05](open-experiments.md). This note did not run it.

## 6. Implications for width/depth and learning sequences

A **Knowledge breadth × depth** display remains a *plausible projection* for navigating content and target requirements. It need not be a Euclidean geometric space; "breadth" may be a set/graph, depth may be topic-specific or incomparable, and overview detail differs from required level and personal evidence-backed attainment.

Applied C can be a **different relation/profile over Knowledge**, not another orthogonal coordinate. A task may call for K1 AND K2 plus EITHER K3 OR K4; conditions may add K5. A skill map/hyperedge is one **analytical visualization**, not automatically a domain structure. Practical integration itself can be learned with whole-task exercises and can involve teachable subject content K_DESIGN and embodied/automatized performance.

Proposed separation **for research only**:
- **K-space:** reusable content including concepts, relations, methods, procedures, strategies and assembly principles.
- **C-spec:** intended kind of action + object/result + conditions/success criteria (not a person-state).
- **C–K applicability:** selected **conditional** assertions about potentially relevant knowledge, possibly with alternative bundles; relation catalog not decided.
- **Goal context:** which performance/knowledge is relevant under requirements; unknown ≠ false.
- **Person evidence:** actual attempt, artifact, result and conditions. Inference to "learner can do C" requires valid assessment design and authority, currently out of scope.

This partition is a coherent *research interpretation*, not a binding model, mandated five-entity ontology, accepted relation taxonomy or prioritization decision.

## 7. Decision packet — what can and cannot be concluded

**Supported within present research:**
1. Subject-matter Knowledge can include the teachable principles/methods **of combining** other Knowledge.
2. Mere subject coverage, inclusion of procedural descriptions, or individual recall/proficiency labels **does not warrant** a general claim of Capability performance.
3. A person can be assessed on **what they did under particular conditions** rather than merely on the list of content they studied; however assessment remains qualified and may be ambiguous.
4. Profession/education literature commonly distinguishes knowledge, skill/performance and autonomy; mathematical competence models sometimes allow **alternative** sets of requisite component skills.

**Not established:** metaphysical irreducibility of knowing-how to knowing-that; universally valid Knowledge depth ladder; a fixed "all components required" C–K fact; automatic personal gap detection; preferred application architecture; superiority of H2 over H1 in real Prep workflows.

**Narrow unresolved owner/product inquiry:** Must the first meaningful Prep journey *display and navigate an applied Capability separately from the Knowledge-space coverage projection*? If yes, what observable learner decision benefits, and does the user need actual performance evidence or merely task definitions? Resolve at product level **before** drafting detailed C–K predicates, graph topology, adaptive scoring or new UI features.

**Suggested next bounded evidence, not assigned as a mandatory step:** use [EX-PLD-05](open-experiments.md) and the two payment tasks to compare one visually simple Knowledge-only view and one Knowledge-plus-Capability view using identical information. Ask a learner which unknown they intend to study and how they distinguish a missing topic from a failed integrated task. Run with an actual user if available; a desk demonstration cannot prove usability.

## 8. Authority and traceability

- This is **noncanonical research** and makes **no Owner or Harness acceptance claim**.
- Existing accepted [Problem Evidence](https://github.com/lehater/prep/blob/mvp-vertical-slice/docs/discovery/problem-evidence.yaml) defines Knowledge as **information about a subject**, not a learner's attainment. [Product Capabilities](https://github.com/lehater/prep/blob/mvp-vertical-slice/.harness/knowledge/product-capabilities.yaml) support exploration, external selection and recorded activity/results; **no accepted mastery model**.
- Reuse Q-PLD-11, Q-PLD-12 and EX-PLD-05; avoid duplicating research queues.
- No changes to Canonical Core, Publication, downstream Tactical acceptance, Goal–Capability approved inputs, or branch protection.
