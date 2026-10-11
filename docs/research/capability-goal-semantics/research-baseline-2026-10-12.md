# Research baseline — CapabilityDescription and Goal-first semantics

**Checkpoint:** 2026-10-12.
**Classification:** RESEARCH ONLY; facts drawn from previously inspected repo artifacts are checkpointed, hypotheses remain UNAPPROVED. Reverify external sources before relying on precise term semantics, release versions, licences, or API guarantees.

## 1. Initial questions and research scope

Investigate (a) what a CapabilityDescription denotes, (b) instance identity vs semantic equivalence, (c) optional/fractal recursive composition, (d) inclusion vs specialization vs prerequisite vs ordered procedure, (e) Goal-first minimum E2E and Goal–Capability relation, (f) admitted relation meanings, endpoint rules, multiplicity, edit/delete semantics, and (g) external precedents, to avoid inventing a new competency ontology. Include software architecture, communication, and strict-protocol counterexamples. Preserve unresolved questions and investigate one conceptual distinction at a time.

## 2. Authoritative constraints versus historical owner inputs

### Canonical upstream evidence at the checkpoint

Accepted Discovery Problem Evidence describes a Capability in the problem space as something a person needs to be able to do to achieve a Goal; Knowledge is information about a subject; PracticeMaterial can be used for study/practice; Recorded Activity documents that activity took place. These are not prescribed tactical entities.

Product Intent and Product Capabilities support: inspection/exploration of knowledge, Goal, capabilities, practice materials, relationships, recorded activity/results; multiple perspectives; selecting a subset for study outside Prep; bringing back recorded activity/results and understanding their subject/time context; manual create/read/update/delete and bulk-load of **every kind actually admitted in MVP**, including relation instances and activity/results. Adding a new admitted kind imposes the full operational scope. Product Requirements do not fix a knowledge taxonomy, cross-kind topology, cardinalities, import format, provenance, or progress/mastery algorithms.

Domain Strategy DS-01 = Preparation Information (CORE); DS-02 = Recorded Activity and Results (CORE). They are separate semantic responsibilities, not automatically separate bounded contexts. Recorded results do not assert that a person possesses a Capability.

### Owner-confirmed but not Harness-admitted tactical decisions

1. IDENTITY = INSTANCE. Equal descriptions can identify different information items; edit continuity does not depend on exact text; no automatic merge/deduplication/import matching.
2. STRUCTURE = DISTINCT-CONCEPTS. Knowledge, Goal, CapabilityDescription, PracticeMaterial carry distinct meanings; not four mutable roles of an undifferentiated item.
3. RELATION-IDENTITY = INSTANCE. Every subsequently admitted relation record has its own identity, independent of a pair+predicate fingerprint; this does **not** decide parallel multiplicity.
4. D1 = SELECTIVE-ADMISSIBILITY. Each relation kind requires justified meaning and explicit endpoint roles; no arbitrary generic links by default. No specific relation kind approved yet.

Additionally the owner chose Goal-first as the primary MVP scenario. This is an upstream Product Requirements input, not approved relation/admission, new plan or goal-progress tracker.

## 3. CapabilityDescription: working definition

Analytical candidate: an identifiable description of a subject's ability to execute a meaningful **class of actions**, concerning an object/situation, for an expected result under relevant context and conditions. A CapabilityDescription is NOT a statement about this particular learner's possessed skills, and is distinct from Knowledge, Goal, one Task, an Activity occurrence, Procedure and PracticeMaterial.

Working semantic signature: Action + Object + Expected Outcome, refined where needed by Context and Criteria/Constraints. These are analytical lenses, **not five mandatory fields** and not a uniqueness key. Simple partial textual descriptions must remain possible.

Examples:
- software architecture: «justify a scalable system architecture under stated workload»;
- communication: «respond to objections with defensible arguments»;
- protocol work: «perform a measurement according to protocol X» (ability to perform the protocol is distinct from the ordered steps of a procedure).

Identity of a record is independent of semantic equivalence. Same text does not mean same instance; different phrasing can express equivalent ability. Semantic equivalence, specialization and overlap are distinct comparisons; no automatic semantic deduplication mandated.

## 4. Recursive composition: results and boundaries

Candidate CD-COMP-01: one Capability can be disclosed through another independently identified, more specific ability which forms a **substantive aspect of performing** the parent ability. This is optional, can be incomplete and extend to several levels. One child may be relevant to several parents without duplication. The existence of a child does not assert a complete decomposition, necessity in every context, or sufficiency to perform the parent.

Important counterexample: «work with Git» may be useful for software architecture but is not automatically a constitutive aspect of the ability to design scalable systems. Likewise «design distributed systems» is usually a **specialization** of «design systems», not a component analogous to «evaluate peak load».

Distinguish:
- composition/constitutive aspect (candidate CTDL-ASN comprisedOf analogue);
- specialization/more-specific kind (CaSS narrows / semantic alignment);
- classification/framework hierarchy (CASE isChildOf);
- prerequisite for learning/application (CaSS requires / CTDL-ASN prerequisiteAlignment);
- task/activity breakdown (NIST NICE distinguishes Skill and Task);
- order of learning, applying, executing, or merely displaying elements (all different).

Composition should not itself specify an execution order or become a Procedure. A strict protocol may have steps that must occur in sequence, but the capabilities to perform that protocol need not be ordered subcompetencies. Do not introduce a Procedure entity in MVP without a justified user problem.

For a **strict structural** composition, self-inclusion and cycles are logically suspect; a DAG with shared children is a candidate, not a confirmed normative rule. Reachability/transitive paths in a graph do not automatically create direct domain relation assertions. Whether composite semantics are genuinely transitive and how edits/removal affect composition are open.

## 5. Goal–Capability: key insight from iterations 8–10

Three distinguishable candidate relations:
- Goal requires Capability: C is asserted necessary for achieving G under its stated context/constraints. Does **not** mean C is currently possessed, sufficient, or needed **before starting preparation**. The status/validity of the assertion is separate from its semantic predicate. Alternative acceptable routes to G can invalidate an unconditional requires claim.
- Goal targets Capability: developing/demonstrating C itself forms a desired outcome of G. This need not be the same as a prerequisite for some external outcome.
- Goal preparationFocus Capability: the user currently chooses C as an area to work on toward G. This is not a claim of objective necessity or the ultimate learning outcome.

Earlier hypothesis «identifiesAsNeeded» is now considered a potentially confused mixture of predicate and assertion provenance; do not treat it as adopted.

Candidate recommendation: test narrow «Goal requires Capability» first for Goal-first because it captures the question «What must I be able to do to achieve this goal?». But it does **not** cover all Goals, particularly an explicit intention to develop a skill, nor does it imply an approved model kind. Test whether «targets» is essential before admitting the MVP relation catalogue.

Semantic truth is not certified by Prep. Incomplete Goal/requirement lists are permitted: **no assertion ≠ an assertion of no requirement** (open-world reading, without RDF/OWL implementation).

Illustrative conceptual rule only: Achieved(G) implies CanPerform(C) **when** C is truly necessary in G's context; neither CanPerform(C) implies Achieved(G) nor stored requires implies CanPerformNow(C). There is no mastery engine.

## 6. Interaction of Goal requirements with capability composition

Given G requires C1 and C1 comprisedOf C2:
- user can navigate/explore C2 within the context of G;
- **do not automatically assert G requires C2**, C2 must be learned first, C2 mastery ⇒ C1 mastery, or that practice of C2 proves G is achieved;
- different Goals can select/reuse the same C1 without cloning its identity.

A globally meaningful C1–C2 composition may be navigated differently under different Goals. Different relevance/visibility alone does not establish a need for Goal-specific composition. Context-qualified models (for example CTDL CompetencyComponent) should be deferred until a concrete counterexample requires separate context-dependent truth claims and cannot be modeled with more precisely defined Capability descriptions.

## 7. Goal-first minimal E2E (proposed scenario, not accepted flow)

1. Start with an incomplete specific Goal G (for example «prepare for a system-design interview»).
2. Investigate expected outcome/constraints and relevant Capability C1, Knowledge and PracticeMaterial. Any particular link type must be separately admitted.
3. Select material for external practice; work outside Prep.
4. Bring a Recorded Activity and Result into Prep with subject/time context.
5. User inspects the result, notices a possible weakness and chooses the next action.
6. Optional refinement: decompose C1 through a more focused C2/C3 to choose a targeted next practice.

Concrete example: C1 «justify scalable architecture», C2 «estimate workload», C3 «evaluate peak request rate»; result notes peak load was overlooked; user opts for a specific workload exercise. The recorded result does not automatically establish missing mastery. The same cycle can be completed with **flat capabilities and no composition**. Thus composition improves navigation/granularity only if independently demonstrated, and is not logically necessary for the first E2E.

Product distinction: existing accepted Product Capabilities do not explicitly require goal-first onboarding, automatic next-step recommendation, automatic goal-completion tracking, or progress percentage. Goal-first is owner-confirmed product direction to reconcile through PRODUCT-REQUIREMENTS before injecting new UI/domain promises.

## 8. Core semantic counterexamples to preserve

| Test | Situation | Required distinction |
| --- | --- | --- |
| A | Goal «create a web service», with allowed routes via self-development or contractor | «can help» is not unconditional «requires» |
| B | Goal «learn to defend architectural decisions» / Capability of defending decisions | target outcome versus ability possessed before preparation |
| C | Goal «obtain calibration certificate» through an accredited lab | ability to personally calibrate may not be required |
| D | Goal «personally execute protocol X» | ability to execute may be necessary; ordered operation sequence belongs to Procedure |
| E | «design distributed systems» vs «design systems» | specialization is not automatically functional composition |
| F | «estimate load» vs «design scalable system» | possible constitutive aspect, incomplete and not universally necessary |
| G | «use Git» vs «design architecture» | useful external skill does not automatically become part of the ability |
| H | C1 comprisedOf C2 and C2 comprisedOf C3 | transitive reachability ≠ auto-created assertion |
| I | one C2 used under two parents or Goals | shared identity; context relevance is distinct from instance cloning |
| J | deleting an endpoint or relationship | independent identity does not dictate cascade/tombstone/reintroduction semantics |
| K | two identical endpoint/predicate links | distinct record IDs do not prove two distinct meaningful domain facts |

A cheap A/B walkthrough (flat vs recursive representation using identical material and activity/results) can test whether composition actually makes finding the next practice more reliable. No empirical user test has yet been performed.

## 9. External models reviewed (research references, not adopted standards)

Primary entry points and implementations:
- [CaSS Relation docs](https://cass.credentialengine.org/docs/dev/fundamentals/cass-objects/relation/), [CaSS repository](https://github.com/cassproject/CASS): independent competency/relation/framework concepts, narrows, requires, equivalent links, and the risk of assuming complete decomposition.
- [Credential Engine CTDL-ASN terms](https://www.credreg.org/ctdlasn/terms): comprisedOf versus hierarchical, alignment and prerequisite relationships; inspect predicate ranges/directions in the live term definitions.
- [1EdTech CASE 1.1](https://standards.1edtech.org/case/), [OpenCASE](https://github.com/1EdTech/OpenCASE), [OpenSALT](https://github.com/opensalt/opensalt): separately identifiable item, association and framework; isPartOf and isChildOf are not equivalent.
- [W3C SKOS](https://www.w3.org/TR/skos-reference/): broader/narrower/matches; basic broader is not itself the transitive closure relation.
- [NIST NICE Framework](https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center): distinguish Task, Skill, Knowledge and Competency Area.
- [iStar 2.0](https://arxiv.org/abs/1605.07767): goals vs tasks, alternative achievement paths and AND/OR refinement; a conceptual precedent, not Prep's required goal model.
- [Schema.org LearningResource](https://schema.org/LearningResource): teaches, assesses, competencyRequired; purposes of material differ from necessary conditions for outcomes.
- [Credential Engine CTDL](https://credreg.net/ctdl/terms): contextual competency representations and resource-specific qualifications require precise range checks before any mapping.
- [ESCO](https://esco.ec.europa.eu/en/classification/skill-main), [O*NET](https://www.onetcenter.org/database.html), [SFIA](https://sfia-online.org/en/the-sfia-framework): existing competency vocabularies useful as test cases and possible data donors, not mandatory Prep canonical taxonomy. Check licenses before copying datasets.

**Do not naively map** CaSS narrows = CTDL-ASN comprisedOf = CASE isPartOf = CASE isChildOf. They differ by meaning, endpoint constraints and direction. Do not infer an API/importer commitment from conceptual similarity. We inspected sources/repositories in earlier research, not ran the systems or empirically measured UX.

## 10. Research conclusion at the checkpoint

A mature ecosystem already defines reusable abilities, separate relationship assertions, semantic inclusion, hierarchies, prerequisites and competency alignments. Prep need not invent a broad ontology. The distinctive problem is an **incomplete, user-driven Goal-first preparation cycle** in which ability descriptions can be refined in response to externally performed practice without automatic learner evaluation. Select the smallest typed relations serving that cycle; resist premature graph completeness, procedure orchestration and mastery estimation.

**Next step:** [Open questions](open-questions.md), starting with GD-01 (semantic roles of Goal–Capability), while preserving the separate upstream Product Requirements reconciliation and the three candidate Core blockers.
