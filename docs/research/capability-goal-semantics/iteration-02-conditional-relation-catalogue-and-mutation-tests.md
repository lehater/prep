# Iteration 02 — Conditional relation catalogue and mutation tests

**Checkpoint:** 2026-10-12. **Status:** NONCANONICAL RESEARCH. Analytical follow-up for GD-03, GD-04 and GD-05; no Owner choice, approved catalogue, active domain invariant, Core Question resolution, Harness acceptance/currentness or change to Product Requirements.

**Repository checkpoint rechecked:** `research/prep-capability-goal-semantics` @ `405da0dceaed2fb3f581547bd81992bb60bfe27d`, `mvp-vertical-slice` @ `781f6aad64f0c98b165ffcdbde3e87f81952920d`; PR #101 (`prep/preparation-information-model-candidate`) open/draft/unmerged @ `336b97969e964b30640f2367fcd2cb8488ff6e67`. The existing four Owner inputs — information identity INSTANCE, distinct preparation concepts, relation identity INSTANCE, D1 selective admissibility — are unchanged. GD-00 (persisted Goal-relative return/focus) and GD-01/02 (which G–C predicate and scope to admit) remain **owner-OPEN**.

## 0. Explicit scope boundary

This iteration **researches conditional consequences without selecting them**. Because GD-00/01/02 are unapproved, GD-03/04/05 cannot be *governance-closed* yet; their proposed cases are review/test material. Follow `AGENTS.md` and the task-branch pinned Harness before any canonical admission.

Current accepted [Product Intent](https://github.com/lehater/prep/blob/781f6aad64f0c98b165ffcdbde3e87f81952920d/.harness/knowledge/product-intent.yaml) and [Product Capabilities](https://github.com/lehater/prep/blob/781f6aad64f0c98b165ffcdbde3e87f81952920d/.harness/knowledge/product-capabilities.yaml) require exploring admitted relationships, selecting material externally, understanding recorded activity/results over time and in subject context, and **CRUD plus bulk loading for every kind admitted**. They do not prescribe that every Goal has a G–C link, a specific relationship vocabulary, a fixed journey, a proof of mastery or a durable focus property.

**Critical tension:** Completing one manually guided task with zero G–C links does **not** prove that a relationless complete MVP satisfies the accepted relationship-exploration product outcome. Distinguish an **experiment fixture** from an approved minimum model.

## 1. End-to-end comparison — specific queries, not graph aesthetics

The user-facing acceptance question is: *after practice and a recorded result, can the user identify a defensible next activity in the same Goal context, without Prep inventing necessity, mastery, a plan or completion?*

Common records (all hypothetical): G1 "learn to justify backend architecture tradeoffs in a written review", G2 "pass a system-design interview with unknown question set", G3 "personally execute protocol X without delegation", G4 "obtain a certificate through an accredited outside laboratory"; CapabilityDescriptions C1 "justify backend architecture tradeoffs", C2 "explain availability/consistency tradeoffs", C3 "personally execute protocol X", C4 "personally calibrate equipment"; PracticeMaterial M1 "written architecture decision exercise", M2 "availability tradeoffs exercise", M3 "protocol X practice sheet"; Knowledge K1 "tradeoff analysis information"; an Activity A2 and Result R2 about practising C2, recorded at a known time. Here `R2` means **Result** and is not the `requires` predicate.

Compare conditional variations:

| Fixture | Additional preparation assertions/selection | Query that actually needs to be answered | Expected meaningful distinction |
| --- | --- | --- | --- |
| E0 / flat/manual | None of G–C or M–C typed; user manually selects M2 and records A2/Result R2 | "What next after this result?" | User can inspect records and select M2 or another item manually. **Task-level baseline only**, not a proposal for no admitted relations anywhere in the product. |
| E1 / target | Hypothetical `G1 targets C1`; optionally `M1 designated-for-practice C1` | "What ability am I trying to develop, and which material works on it?" | T preserves goal meaning beyond title; M–C only adds value if capability-based material discovery is expected. |
| E2 / focus | Hypothetical Goal-relative **user selection** of C2, with or without persistent `G2 focus C2`; optionally `M2 designated-for-practice C2` | "When I reopen G2, what did I choose to work on?" | Persisted F helps **only** if Goal-scoped return is a product requirement and selection context is not already recoverable through existing behavior. Does not claim C2 is necessary. |
| E3 / strict outcome | Hypothetical `G3 requires C3`, with actor and success condition stated | "Which ability is indispensable for this personal execution?" | Strong R can be meaningful here; an ordered protocol and actual mastery still do not follow. |
| E4 / alternate route | No `G4 requires C4` | "Can obtaining the certificate happen without personal C4?" | The permitted external-lab route defeats the unconditional R; a generic "helpful" relation would misrepresent the fact. |

**Experimental controls:** same Goal wording, materials, Activity and Result in A/B; vary **only** the relevant saved assertion or persistent selection. Evaluate the exact query **after reopening** G2, not just immediately after selecting material. Observe false "mandatory" interpretations, next-practice choice, missing context, extra actions. This is a test design, **no participants or measurements have been collected**.

## 2. GD-03 — semantic admission candidates

**D1 admission gate per type:** 1) user question; 2) independently meaningful proposition; 3) valid endpoint roles; 4) positive and falsifying case; 5) difference from existing selection, Activity or other relation; 6) observable result of removal/edit; 7) all-kind CRUD/bulk cost. A type may remain optional for an item even if admitted in the catalogue.

| Candidate (not admitted) | Asserted semantics and endpoint roles | Positive / falsifying case | First-slice obligation |
| --- | --- | --- | --- |
| `Goal targets CapabilityDescription` | The goal's **intended outcome includes acquiring or demonstrating** the described ability; G outcome role -> C target role. Developing and demonstrating are different success conditions, possibly expressed in exact Goal text. | G1; fails for G4 because certification through a lab does not itself target personal C4. | Conditional on preserving explicit capability outcome beyond free-text G1. |
| `Goal requires CapabilityDescription` | For every permitted success path **in G's stated context/actor/criteria**, the capability is necessary **at the relevant time**, not a requirement that learner already possess it. G condition role -> C necessary-ability role. | G3; falsified by G4's permitted outside-lab path. Unknown for G2. | Conditional on a real necessary-condition question; **never mandatory for all Goals**. |
| `Goal current-preparation-focus CapabilityDescription` | Goal-relative **current learner intention**, not outcome truth or necessity. G context role -> C selected-focus role. | Chosen C2 for G2; absent until explicit selection; replaced/cleared if learner refocuses. | **Product gate GD-00:** may instead be an Application selection state or no persisted focus at all. |
| `PracticeMaterial intended-for-practice CapabilityDescription` | Ambiguous until deciding **whose intention**: material's designed purpose, user's characterization, or current learner designation; M purpose role -> C practise-ability role. | M2 problem set for C2; mere SQL reference article on JOINs is not necessarily designed for JOIN practice. | Conditional; cannot use vague `supports` as a shortcut. |
| `PracticeMaterial covers Knowledge` | M substantively addresses the **information represented by K**, not necessarily verified true/complete; M coverage role -> K subject-information role. | K1 explained in an article; a quiz merely mentioning K1 may not cover it. | Defer unless a Knowledge-first discovery query fails without it. |
| `CapabilityDescription uses Knowledge` | C performance depends on/uses the **information represented by K** under relevant conditions; C performance role -> K information role. Avoid conflating Knowledge item with source/document/subject taxonomy. | Reading error budgets may be relevant to justifying availability decisions; C does not invariably require consulting a given K record. | Defer unless C→K navigation solves a concrete first-slice task. |

### Important newly exposed ambiguity: author intent vs learner designation

For M2, these are three different statements:

- **Designed for practice:** the material's intended pedagogical purpose is to practice C2; a curator may describe that purpose without Prep verifying authorship or source.
- **Selected to practice now:** this particular learner has chosen to use M2 to work on C2, possibly within G2. This may be Application selection rather than intrinsic M–C meaning.
- **Proven effective:** using M2 actually improves C2. This implies evaluation/causality not in the accepted MVP.

Do **not** name a relation "intended for" until its intentional subject and scope are settled. A user may select a general reference for an exercise even when that reference was not designed for exercise. The same material can be designed to teach *and* assess, with distinct purposes; this is not a license for undifferentiated duplicates.

Similarly, `Capability uses Knowledge` often smuggles the ambiguity between **subject knowledge**, **a particular stored information item**, and **pre-existing learner knowledge**. Never equate these without a query that discriminates them.

### Conditional smallest useful sets (no approvals)

- **Set A — minimal task validation:** no *new* prep G–C predicate; explicitly test existing accepted manual exploration, selection, external use, Activity/Result subject context. This is an **experiment**, not adoption of zero relation kinds.
- **Set B — skill-acquisition Goal:** consider T alone as the first capability-target semantic; admit M–C **only if** finding material by capability is measurably needed.
- **Set C — uncertain external Goal:** consider saved F or equivalent Goal-scoped selection **only after GD-00 Product review**; do not swap in R for convenience.
- **Set D — strict personal-performance Goal:** R may be admitted for a bounded necessary-condition use, independently from T/F.

There is **no evidence-based single universal catalogue** across A–D yet. Every admitted type increases edit, remove, inspect, create and bulk-load obligations; avoid admitting all types simply because they are conceivable.

## 3. GD-04 — direction, identity and multiplicity (conditional analysis)

**Semantic roles, not graph arrows:** T/R/F have distinct G and C endpoint roles; M–C has distinct M and C roles. User exploration may traverse either direction without storing a reverse proposition or a second relation. If the types are separate, a G–C self-link is type-impossible. If C–C composition is admitted later, explicit self/cycle rules require separate review; no blanket global self-link policy is justified now.

**Relation instance identity (already Owner approved) ≠ proposition identity:**

- Two distinct link records (`r1`, `r2`) with identical endpoint instance IDs, predicate, and material conditions often express **one proposition twice**, not two independent facts. Independent record IDs alone cannot prove parallel semantic multiplicity.
- Two different reasons/sources supporting one necessity claim are **not necessarily two requirement relations**. Provenance is not a mandatory accepted product subsystem.
- Two different conditions can generate **different propositions**. If the current predicate only accepts bare endpoints, silently pretending these are the same unconditional proposition is wrong; decide whether exact Goal descriptions already differentiate context or whether qualified claims deserve explicit modeling.
- Two relation kinds (T and R) on the same G/C pair are potentially **different propositions**, but for an "learn C" goal they may be logically redundant in use. Test the independent user question before persisting both.
- Two external practice occurrences using M2 belong to DS-02 recorded Activity, not repeated preparation assertions.
- `UNIQUE` as a physical index is not the semantic decision; `PARALLEL` because import tools might duplicate rows is not one either. If a semantic uniqueness invariant is eventually adopted, user operations must surface conflicts coherently rather than silently merge independent instances.

**Edit distinction:** changing a link's description while keeping endpoints may preserve its instance under approved `RELATION-IDENTITY=INSTANCE`. Changing its endpoint or predicate changes *which proposition it asserts*, even if an authorized editing policy preserves record identity. Whether such retargeting is valid as update versus replacement needs an explicit domain rule; do not infer it from database ID stability.

**Candidate test cases:** (M1) `r1=G1 targets C1` and `r2=G1 targets C1` same scope; ask what new true assertion r2 adds. (M2) `G1 targets C1` and `G1 requires C1`; ask separate user question. (M3) `G2 focus C2` then learner switches to C1; test whether old focus can remain "current". (M4) same M2/C2 pair described as "designed for" versus "selected for G2"; confirm different intentional actors. (M5) reimport of an existing relation with a fresh ID; no automatic match by text/fingerprint.

## 4. GD-05 — deletion and endpoint integrity (conditional analysis)

**User-level requirement:** remove any admitted information/relationship kind from the working set; existing Product Requirements do not require immutable history/tombstones or forbid deletion. Structural deletion consequences belong to Tactical; transactional semantics and partial bulk outcomes to Consistency/Application; DS-02 owns interpretation of recorded Activity/Result history.

| Operation fixture | Preparation links affected if present | Critical integrity question |
| --- | --- | --- |
| Delete Goal G2 with `G2 focus C2` and Activity A2 referring to G2 | G2–C2 | Can the user remove G2 and its preparation link without wrongly deleting A2? How can A2's subject remain interpretable if G2 no longer exists? **Cross-model DS-02 question**, not automatically solved by DS-01 cascade. |
| Delete Capability C2 linked from G2 and M2 | G2–C2 and M2–C2 (plus any C2–K1 if admitted) | Does the working set eliminate invalid preparation links together? What happens to recorded Activity A2 about C2? |
| Delete PracticeMaterial M2 used in A2 | M2–C2 or M2–K1 | Does A2 survive and still identify its historical subject as required by accepted recorded-context behavior? DS-02 must decide its own representation; no implicit cascade. |
| Delete Knowledge K1 | C1–K1 and/or M1–K1 | Should incident DS-01 assertions be removed or transformed? Other Goal/Capability/Material instances persist. |
| Remove just relation `r1` | Only r1 | Both endpoints remain. Its absence must not assert its logical negation. |
| Recreate identical text as a *new* C2 item after deleting C2 | Old incident links must not silently attach by identical wording | Instance identity is not semantic equivalence; explicit restore/reuse of an identifier is a separate unapproved operation. |
| Bulk-load G, C and G–C together in any row order | References may point to new batch members | Validation should reason over the proposed resulting set rather than depend on row order; choose atomicity/partial-result policy through the proper owner, not here. |
| Bulk-load link with missing/deleted/invalid-kind endpoint, or duplicate proposition | Potential dangling/duplicate assertions | Define explicit failure/outcome and recovery; never silently invent an endpoint, revive deleted ID, or merge unrelated instances. |

### Alternatives that remain open to the Owner

- **Deletion alternative D5-A:** a user removes an endpoint; incident **DS-01 preparation relations** are removed coherently from the working set. Small working-set model, but other DS-02 recorded subjects may need independent treatment and UX disclosure. No approval.
- **D5-B:** removed endpoint is unavailable for active use but can still be referenced through an explicit unavailable/retained-reference mechanism. Requires a justified extra status/identity and read/edit rules; not accepted just because it preserves links. No approval.
- **D5-C:** refuse to let the user remove a referenced endpoint. **Conflicts** with accepted unconditional user-facing remove capability unless the product requirement is expressly reconsidered; not recommended as a silent Tactical decision.

Do not assume that **all** references are the same kind. A DS-01 descriptive relationship and a DS-02 record that an exercise happened about a subject carry different obligations. The major **blocking integration risk** is a false invariant: "delete an item → automatically delete every Activity/Result mentioning it." That would silently undermine the independently accepted recorded-history behavior.

**Reintroduction test:** after delete + ordinary create, the new information instance has fresh identity under a straightforward instance reading; an explicit restoration of the former identity would need separate policy. No text-similarity reattachment. This is a candidate operational consequence, *not* an Owner-approved identity-reuse rule.

## 5. Small, executable-in-principle acceptance fixtures (not implemented)

Use the following neutral test inputs after the Owner decides which types are admissible; do **not** turn these into a storage schema prematurely.

| Test ID | Input/action | Expected semantic observation (conditional) | Owning concern |
| --- | --- | --- | --- |
| T-01 | Create G2 only; inspect relationships | Empty G–C set means **unexplored**, not "no capabilities required" | Tactical / Human Interface |
| T-02 | Record a `requires` claim for G4/C4 despite external-lab route | Demonstrate why claim is unjustified; no automatic verifier or rejection required | Tactical semantics / human judgement |
| T-03 | Create `G1 targets C1` and a second equal link with new record ID | No additional **proposition** from duplicate ID; choose policy only after meaning settled | Tactical / Import |
| T-04 | Attempt material "designed for C2" vs "learner selected for G2/C2" | Ask who intends use; do not collapse different scopes | Tactical / Application |
| T-05 | Remove C2 referenced by Goal, Material and A2 | DS-01 consistent and A2 treatment explicitly deferred to DS-02 | Tactical / Recorded History |
| T-06 | Bulk-load [link G1–C1, C1, G1] out of order | Validity over complete batch; persistence atomicity separately selected | Tactical / Consistency |
| T-07 | Delete C2 then create equal-text C2'; inspect old link | No automatic old-identity restoration or string-based relinking | Tactical / Application |
| T-08 | Traverse hypothetical `M2 practice C2` from C2 | Reverse **query** works without inverse stored assertion | Application/View |

These tests are conditional *semantic oracles*, not passed tests or admitted acceptance criteria.

## 6. Decision gates, risk ranking and next iteration

**P0 / Product Requirements (GD-00):** decide whether Goal-centered **return with persisted learner-selected focus** is a required observable behavior. Without it, F may be needless stored state; with it, define observable criteria before Tactical/API/UI design.

**P0 / Tactical (GD-01/02/03):** decide one user-facing question for the first G–C meaning (targeted learning, scoped necessity, saved focus, or none in experimental path); preserve incomplete Goals and no learner-state inference. Each type demands full CRUD and bulk.

**P0 / Tactical + Recorded Activity/Result design (GD-05):** decide endpoint-removal effect on preparation links **separately** from continuity of recorded Activity/Result subject context. Neither "delete all" nor "retain forever" may be silently chosen for DS-02.

**P1 / Tactical (GD-04):** per admitted predicate, check asymmetric roles, materially equivalent duplicates, edit retargeting and context qualification; do not derive multiplicity from instance IDs or relational storage.

**P1 / Domain research:** resolve C–C composition (CD-01..05) independently. It does not follow from admitting T/R/F or material-purpose links. Test flat vs recursive capabilities using exactly the same result and materials before paying full CRUD/bulk overhead for composition.

**Next practical experiment:** one Goal-first return scenario (G2/C2/M2/A2/Result R2) with A: manual nonpersistent selection vs B: explicitly retained Goal-scoped user focus. Measure whether B changes the user's ability to resume or select the next exercise. In parallel, prepare CD-01..05 counterexamples, but **do not choose** owner-governed P0 predicates or deletion policy.

## 7. Source comparisons (not adopted semantics)

- [Schema.org `teaches`](https://schema.org/teaches), [`assesses`](https://schema.org/assesses), [`educationalAlignment`](https://schema.org/educationalAlignment): teaching purpose, assessment purpose and formal framework alignment have different meanings; they are not proof of material efficacy or learner skill. Verified 2026-10-12.
- [1EdTech CASE](https://standards.1edtech.org/case/): competency definitions and associations are separately exchangeable constructs; an exchange format does not prescribe Prep's product commitments or CRUD semantics. Verified 2026-10-12.
- [W3C SKOS Reference](https://www.w3.org/TR/skos-reference/): distinguishes direct broader/narrower and transitive properties; a presentation traversal is not a newly entered relationship record. Verified 2026-10-12.
- [CTDL-ASN terms](https://www.credreg.net/ctdlasn/terms): distinct competency relationship properties include prerequisite and inclusion; do not map automatically to Goal requires or Prep composition. Verified schema index 2026-10-12; exact `comprisedOf` property page not independently re-fetched in this iteration.
