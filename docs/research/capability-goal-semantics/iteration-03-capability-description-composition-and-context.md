# Iteration 03 — Capability semantics, recursion, and Goal-context

**2026-10-12 · NONCANONICAL RESEARCH, NOT OWNER DECISIONS OR HARNESS ACCEPTANCE.** Desk study of CD-01..05. The prior four owner inputs remain unchanged: instance-based information identity, distinct concepts, instance-based relation identity, selectively admitted kinds. GD-00..05 are also unapproved. Research branch last known head before this checkpoint: 4983f7333ccf6b15fdf7caa2042e51c6abeedfe3; MVP head: 781f6aad64f0c98b165ffcdbde3e87f81952920d; PR #101 stays draft/unmerged @ 336b97969e964b30640f2367fcd2cb8488ff6e67. A concurrent research-only docs/research/README.md addition must be preserved. Read AGENTS.md before canonical/Harness changes; no such changes are made here.

## CD-01: CapabilityDescription and its boundary

**Candidate:** an individually identified description of a **repeatable ability class**: an actor performs meaningful action(s) concerning an object/situation toward an expected outcome, under relevant conditions. It describes *what one may be capable of doing*, never asserts that the learner has already demonstrated or possesses this ability. Different textual descriptions can be equivalent, and identical ones can still be distinct instances under approved identity policy.

**Authoring lenses**, not mandatory schema columns, semantic equality keys or CRUD admission gates: Action, Object, Outcome; optional Context and Criteria. Incomplete records are allowed; progressive clarification is not the same as changing identity.

Examples and falsifiers:
- **Architecture:** "Defend a backend architecture choice under a workload, reliability and cost tradeoff" is capability-like. "Architecture" is only a topic; "read about scalability" is an action plan/activity, and a single past architecture review is a Recorded Activity.
- **Communication:** "Respond to an objection with a defensible tradeoff" is capability-like. "Good communicator" is too vague to select targeted practice. A performed conversation is an occurrence, not an ability class.
- **Protocol:** "Personally execute measurement protocol X within its defined safety/accuracy conditions" is capability-like. Its ordered operations form a **Procedure**; receiving certification through an outside laboratory is a **Goal**, not the same personal ability.

**Failure of weak definition:** a label like "SQL" does not answer whether a result concerns remembering SQL syntax (Knowledge), composing a JOIN correctly (Capability), taking a SQL quiz (Activity), or solving interview questions (Goal). Refine the meaning if needed; do not force five rigid fields. No new compulsory mastery/proficiency system is justified.

External caveat: CTDL-ASN's `Competency` covers knowledge/skill/ability and broad goal-like declarations. It is **not** a one-to-one type replacement for Prep's narrower `CapabilityDescription`. NIST NICE separates Task (work to accomplish), Knowledge (concepts) and Skill (observable action capacity); this is a useful category check, not accepted Prep semantics.

## CD-03: do not confuse five C–C relationships

| Parent / candidate child | Most plausible distinction | Falsification |
| --- | --- | --- |
| Justify scalable architecture / estimate peak load | Possible **constitutive performance aspect** | Someone else can provide load estimates; the ability to justify a design does not universally require personally estimating traffic. |
| Design systems / design distributed systems | **Specialization** of application domain | A narrower application of the same ability need not be executed as a constituent step of the broader one. |
| Deploy service / use Git | **Workflow dependency**, not stable constitutive ability | Deploying a prebuilt artifact or using a non-Git workflow does not require Git. |
| Negotiate objections / listen and paraphrase | Plausible reusable **aspect** of performance | A child may be useful across several parents without being strictly necessary in every execution. |
| Execute protocol X / measure with instrument Y | Possibly required **operation ability** under protocol conditions | Equipment or actor may differ; ordered individual steps are Procedure, not Capability composition. |
| Resolve problem / check answer | Often ordered **activity step** rather than stable ability | Can instead describe "validate computed results" as an independent repeatable capability. |

Four practical classification tests: (1) a narrower *case* of the same ability → specialization; (2) a discernible aspect of *performing* the parent → possible composition; (3) something done *before*, or an execution step → prerequisite/procedure; (4) merely useful → relevance, not proof of inclusion.

**New central ambiguity:** the word composition spans **different predicate strengths**.
- **Meaning-encompasses:** parent includes part of the child's *meaning*. CTDL-ASN `ceasn:comprisedOf` defines exactly broad semantic inclusion "in whole or in part" (Competency→Competency). It does **not** assert universal indispensability of a subskill or necessarily an executable partonomy. Weak inclusion can overlap in both directions.
- **Substantive performance aspect:** child describes an identifiable aspect that may constitute a competent performance of parent, in applicable contexts. This is the *narrower Prep research hypothesis*, not an exact synonym for CTDL-ASN. It does not automatically entail necessity, proficiency transfer, completion or order.
- **Universally necessary subability:** every successful performance of the parent in a specified context requires child. This is a **stronger distinct claim**, actor/context-sensitive and falsified by valid alternative performance routes.

**Recommendation for investigation, NOT approval:** prefer clearly scoped *performance-aspect* over vague broad meaning inclusion if user navigation genuinely needs C–C. Do not admit any of the above without Owner selection and confirmed benefit.

## CD-02: flat vs recursively composed — controlled experiment design

**Keep identical records and activities** for both variants. Only add the C–C edges in B. No hidden difference in material search, the quality of text descriptions, LLM recommendations or UI styling.

Constant fixture:
- Goal G: "Prepare to justify a high-traffic backend design in a mock interview" (no assumed approved G–C predicate).
- Capability C0: "Justify backend design against reliability and workload conditions".
- C1: "Estimate peak request rate from traffic assumptions".
- C2: "Translate peak traffic into capacity/burst-handling constraints".
- C3: "Explain tradeoffs of queueing, caching and scaling under failures".
- Materials M1: peak-load calculation exercise; M2: capacity case; M3: scaling tradeoff mock interview.
- Knowledge K1: peak-vs-average workload concepts.
- Recorded Activity A: the same external mock interview at the same timestamp; Result E: "Burst load was underestimated; queue choice was poorly defended." This says what happened; it does not prove lack of mastery.
- User question: "Which material should I practise next and why?"

**Fixture A, flat:** C0–C3 exist as individually searchable descriptions. The user inspects E, finds C1/C2 from E's words by search or exploration, chooses M1/M2. Whatever material-discovery/selection mechanism exists is identical in B.

**Fixture B, composed:** all the same records; optionally add `C0 has-performance-aspect C2`, `C2 has-performance-aspect C1`, and `C0 has-performance-aspect C3` **only if the exact parent definitions justify each**. Starting from C0, a user can navigate to C1 and then find M1 via the *same* material discovery as A. This is a candidate extra discovery path, not an automatic practice recommendation.

**Desk outcome:** both variants can logically support a defensible next choice. C–C decomposition is therefore **not a prerequisite for the first minimal human-directed E2E**. However, this does not prove A is equally usable; B may aid discovery when child terminology is unfamiliar and parent context is clear. Equally, B may add unnecessary clicks/clutter, editing burden, and wrong belief that every child is required or child success proves parent success. This is **reasoned hypothesis, not measured UX evidence**.

**Smallest discriminating observed test (not performed):** show the same data to users in flat and composed mock UIs, counterbalance order if possible. Ask them to reopen G, interpret the same E and select/explain M1 or M2. Capture (a) first defensible decision according to an agreed rubric, (b) number of actions/time, (c) discovery errors or missing context, (d) false logical inference "all children mandatory" or "passed child means Goal done", (e) authoring effort to add/refine C1. Test first with a small moderated sample, not an invented success rate. A static mock is sufficient; no backend.

**Cost:** every newly admitted C–C relation kind entails complete manual create/read/update/delete and bulk-load support under accepted Product Capabilities, plus endpoint validity, import semantics, cycle/collision choices and historical-context coordination. The value must exceed that scope.

**Research alternatives:** A = flat-first; B = optional functional composition upon observed benefit; C = full nested/context-based ontology. A is the **research preference for cheapest experiment**, not Owner decision to exclude composition from MVP.

## CD-04: graph and lifecycle consequences, conditional on predicate

An optional, incomplete **DAG with shared children** is a plausible topology **only if** composition means *strictly proper structural part*:
- Zero children means unexplored/undecomposed, **not** a declaration of atomicity or completeness.
- C1 can be a child of C0 and another parent without cloning its identity, if both claims independently make sense.
- `C0→C1` is directed by parent/child roles; navigation back from C1 does not require a second inverse record.
- Self-edge and `C0→C2→C0` contradict a *strict proper-part* interpretation. Under **weak meaning overlap**, cycles can be coherent: hence no universal DAG invariant until CD-03 predicate is chosen.
- A path `C0→C2→C1` yields **reachability**. It does not automatically add a direct `C0→C1` asserted relation, entail that C1 is mandatory, or infer learner competence. Transitivity is an explicit property of a chosen predicate, not a graph implementation side effect.
- Child order for display is not learning order or a Procedure.

Conditional mutation tests (nothing implemented):
1. Create C0 with no children; refine with C2/C1 later without requiring complete decomposition.
2. Attach one C1 under two different parent capabilities; check whether the same child identity remains reusable.
3. Try self-link and cycle by manual edit and bulk import; evaluate based on *chosen* predicate strength.
4. Traverse two edges; show indirect path without inventing a direct stored fact.
5. Delete one C–C edge: both capabilities and other edges remain.
6. Delete C2 with parent/child/M2 associations and a recorded Activity about C2: DS-01 links vs DS-02 subject-history integrity must be resolved separately (GD-05).
7. Recreate a same-text C2 with a new instance identity: no automatic old-edge relinking or identity restoration.
8. Bulk-load nodes and forward-referencing edges in non-topological order: validate against proposed final state; atomic/partial policy belongs to consistency design.
9. Visually reorder children without changing domain facts.
10. Record a successful exercise targeting C1: never infer C1/C0 mastery or Goal achievement.
11. Two separate edge record IDs with same kind/participants: do not equate record identity with two independent domain truths; GD-04 remains open.

## CD-05: global vs Goal-qualified composition

**Working hypothesis:** a stable C0 description has the same meaning across Goals, while Goals alter *which aspects the learner currently examines, selects or considers important*. A goal-specific selection does not automatically change truth of a structural C0–C2 relation.

Test stable C0 "Justify architecture choices under workload and business constraints", C2 "Evaluate burst-load/capacity limits".
- Goal A: "Prepare high-availability backend design". C2 is often salient.
- Goal B: "Prepare simple low-cost internal service". C2 may be less salient.
- If composition says C2 is a *possible substantive aspect* of C0, the global relation can remain true under both Goals. Different **relevance** is not contradictory truth.

**Adversarial example:** C0 "Deliver a technical presentation"; child CX "Operate an on-site projector"; in-person vs remote presentation. Under the **universally mandatory child** reading, CX is false for the remote route; under a **possible aspect** reading, the broader composition can still hold. This exposes *predicate/context ambiguity* rather than proving a new Goal-specific C–C entity is needed.

Demand for a context-qualified C–C model must show the **same C0 identity and stable meaning**, same CX identity and stable meaning, and two contexts where the *same precisely chosen relation proposition* differs in truth, not merely priority or execution choice; also show that clarifying C0, Goal-specific selection/focus or Procedure variants fails. **No decisive real-world counterexample has been shown.** Defer Goal-scoped composition and its additional CRUD/bulk burden.

## Owner cards and sequencing

- **CD-01 (P1)**: choose whether the repeatable, meaningful ability-description candidate is sufficient; no five-column mandatory schema.
- **CD-02 (P1)**: flat-first A vs optional B vs more complex C; observe the same-data test before including C–C in MVP. **Owner choice OPEN**.
- **CD-03 (P1)**: choose exactly which of meaning-encompasses, substantive performance aspect or universal necessary subability is claimed; no aliasing composition to specialization/prerequisite/procedure. **OPEN**.
- **CD-04 (P1)**: only after CD-03 decide cycles, self-links, sharing, direct vs indirect assertions, duplicates, mutations and import policy. **OPEN**.
- **CD-05 (P1)**: default test global composition + Goal-relative focus; require falsifying same-pair case before context qualification. **OPEN**.
- **P0 gates remain upstream:** GD-00 Goal-return/focus product behavior, GD-01/02 scoped Goal predicates, and GD-05 integrity with Recorded Activity/Result semantics. Do not canonicalize this research or declare a Harness Question closed.

## Primary precedents independently checked 2026-10-12

- [NIST NICE Getting Started](https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center/getting-started) and [Glossary](https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center/nice-framework-glossary-terms): Skill vs Knowledge vs Task/Competency Area distinctions.
- [CTDL-ASN terms](https://www.credreg.org/ctdlasn/terms): `ceasn:comprisedOf` competency→competency refers to semantic inclusion **in whole or in part**, not universal performance necessity.
- [CaSS relation docs](https://docs.cassproject.org/v1.5/dev/fundamentals/cass-objects/relation/): `narrows` vs `requires` vs `equivalent`. CaSS `requires` is pre-acquisition necessity, distinct from Prep's research Goal-level outcome necessity.
- [1EdTech CASE 1.1 associations](https://www.imsglobal.org/sites/default/files/spec/case/v1p1/information_model/caseservicev1p1_infomodelv1p0.html): `isChildOf`, `isPartOf`, `precedes` are separate semantics.
- [W3C SKOS](https://www.w3.org/TR/skos-reference/): direct `broader/narrower` separated from inferred transitive closure, an analogy for path-vs-asserted relation.
These are independent external precedents, not adopted Prep domain semantics, interoperable mappings or empirical UX results.

## Next action

Perform one **minimal observed Goal-return/next-practice task with flat capabilities**; add only optional C–C navigation for A/B comparison. In parallel obtain Owner decisions on GD-00/01/02 and GD-05 DS-02 consequences; only if recursive composition demonstrates benefit should CD-03/04/05 be promoted through governed Harness semantics. Stop at a bounded decision package rather than inventing a comprehensive ontology.
