# Qualified research findings — current

| Topic | Evidence/result | Limit and disposition |
| --- | --- | --- |
| Goal/Capability semantics (EX-GF-01) | Bounded desk semantic check supports incomplete Goals, reusable CapabilityDescription identity, and separation of structural C–C assertions from procedures or ordering. | Does not admit specific G–C, C–K or C–C predicates. No actual-user evaluation. |
| Knowledge orientation / external material | Synthetic study-loop transport and selection checks show a feasible *mechanism*; public-user proxy examined 16 reported episodes (7 full threads, 9 excerpts). | No comparative measured user value, human understanding or source-quality proof. |
| Subject model (EX-PLD-10) | Owner research direction now selects ordinary G–C M:N and context-independent, unambiguous C; C–C composition deferred. C–K and K–M M:N desk hypotheses exercised on an 11/11 synthetic G–C–K–M path. | Not an accepted ontology. K–M reachability is topical, not proof of ability-specific suitability. Full corrected fixture, K–K semantics and model/lifecycle choices remain open. |
| Universal workspace (EX-PLD-11) | Independent read-only four-pane concept and final self-contained state/projection test: **25/25 synthetic assertions**. A generic collection/related-records/details/optional-graph shell worked for tested cases with typed role-aware related entries and extension points. | Unlimited descriptor-only universality **does not work**; unknown media/behavior requires extensions. No validated production UI or human usability result. |
| Graph representation | Can show eligible typed binary assertions without changing source meaning. | The case for a default 2D/3D graph versus a good relation table is **not established**. |
| Cross-track integration | A projection must preserve source record identity, named roles, predicate, direction/conditions and explicit absence. Multi-role records must not create invented binary source relations. | Subject-model → workspace compatibility with a **corrected** EX-PLD-10 corpus remains **unrun**. |

## EX-PLD-10 — current G–C–K–M MVP research slice (2026-10-13)

**Evidence level:** owner-confirmed research directions plus bounded **synthetic desk checks**; not a Harness admission, user study or approved complete ontology. The scope is subject semantics and navigation; no persistence/UI schema was specified.

### Owner-confirmed research direction

- **Goal ↔ CapabilityDescription:** one ordinary **M:N** association for the MVP. The domain intent is membership of a capability description in the Goal's recorded preparation scope. No need for *per-link typed predicates* has been shown; reconsider only against a concrete use case. A Goal may have zero C.
- **CapabilityDescription:** one unambiguous, independently identified description of an ability to perform a task. It retains its meaning across Goals; if ambiguous, refine or separate descriptions.
- **C–C composition:** potentially useful for complex abilities, explicitly **deferred from the initial MVP slice**.
- **Knowledge:** heterogeneous subject information; includes concepts, models, procedures, strategies and ways of combining them. Describing how to perform a task (K) and describing the ability to perform it (C) retain distinct responsibilities; not separated by arbitrary complexity.
- The MVP research still does **not** infer a person's competence, knowledge attainment, an exhaustive curriculum, or data completeness.

**Evidence retained from G–C standards review:** [CTDL-ASN](https://www.credreg.org/ctdlasn/terms), [1EdTech CASE](https://www.imsglobal.org/sites/default/files/spec/case/v1p1/information_model/caseservicev1p1_infomodelv1p0.html) and [ESCO](https://esco.ec.europa.eu/en/about-esco/escopedia/escopedia/two-pillar-structure-esco) show that other domains distinguish inclusion, alignment and necessity. Their vocabularies do not establish a need for multiple G–C predicates in Prep. `targets`, `requires` and `focusesOn` remain **non-selected** candidates, not approved link types.

### Working hypotheses (not yet owner-admitted)

- **C ↔ K: M:N.** K contributes subject content relevant to the task described by C. Its meaning does not change by Goal. C and K remain independently reusable; a knowledge link does not prove a complete or sufficient foundation.
- **K ↔ StudyMaterial: M:N.** M covers or works with identifiable K. Multiple K may appear in one material, and a K may have several materials. The absence of a link is not an assertion of irrelevance.
- **Direct C–M: deferred**, pending demonstrated need to assert a material's purpose or suitability for a particular ability. A C→K→M path identifies **topic-related candidates**, not certified material suitability.

### Bounded synthetic end-to-end check: 11/11 PASS

**Fixture (research-only, simplified):**
- Goals: G1 *architecture interview*, G2 *architecture review*, G3 *empty draft*.
- Abilities: C1 *explain replication properties*, C2 *choose a consistency model for requirements*, C3 *justify architecture trade-offs*, C4 *unassigned ability*.
- Knowledge: K1 *consistency models*, K2 *replication properties*, K3 *method of trade-off analysis*, K4 *operational risk analysis*, K5 *TCP handshake (off-scope)*.
- Materials: M1 *definitions card* (K1); M2 *consistency-choice case* (K1,K3); M3 *replication cards* (K2); M4 *architecture-review case* (K3,K4); M5 *risk notes* (K4); M6 *TCP card* (K5); M7 *unlinked draft*.
- **G–C:** G1→{C1,C2}; G2→{C2,C3}; G3→∅.
- **C–K:** C1→{K1,K2}; C2→{K1,K3}; C3→{K3,K4}.
- **K–M:** K1→{M1,M2}; K2→{M3}; K3→{M2,M4}; K4→{M4,M5}; K5→{M6}.

**Expected reachability:** G1→{C1,C2}→{K1,K2,K3}→{M1,M2,M3,M4}; G2→{C2,C3}→{K1,K3,K4}→{M1,M2,M4,M5}; G3→empty. M6 and M7 do not appear for G1/G2. C2 is shared between G1/G2, and K1 between C1/C2. Removing G1→C2 preserves C2 in G2; removing material M2 does not change C/K identities.

**Executed checks (11/11):** endpoint integrity; shared C across Goals; shared K across C; multi-K material; exact reachability for G1, G2 and empty G3; off-scope/draft exclusion; no inference of C-specific material suitability; change to G1 scope without changing G2 or C2; deletion of M2 without changing C/K.

**Semantic counterexample:** a definitions card (M1) is reachable from C2 *choose a consistency model* through K1 but does not thereby become an appropriate exercise for choosing a model. **Outcome:** the candidate-discovery journey works, but an automatic claim that the material trains a specific C is unsupported.

**Limits:** no user validation, completeness or semantic-quality certification; no direct C–M decision; no full versioned EX-PLD-10 fixture for typed K–K, relationship identity/conditions, material association alternatives or all mutation/deletion cases. Older G–K bypass prototypes remain inadmissible evidence for this topology.

**Next decision gate:** is presenting topic-related materials for **manual** inspection and selection sufficient for the MVP? If yes, keep K–M minimal and advance to the remaining EX-PLD-10 consistency cases rather than inventing C–M or typed G–C links.

## Universal-workspace candidate, not a product decision

The bounded read-only shell has four surfaces: **[1] collection**, **[2] related records with named roles and an inspectable source assertion**, **[3] own details and optional type-specific extension**, **[4] optional bounded graph of eligible *actual* binary assertions**.

Track selection, current kind, focus, graph scope, filters, origin/return navigation and panel layout separately; report selections outside a filtered view honestly. Reverse navigation does **not** invert the stored predicate. Neither any graph edge nor any visual route establishes a new subject fact.

Reproduction: `node experiments/universal_entity_workspace/ex-pld-11-interaction-check.mjs`. This is a pure assertion check of a synthetic projection contract, **not** a working browser prototype.

## Modeling stop condition

Do not reintroduce a direct Goal–Knowledge study-intent shortcut or declare material/depth relationships merely because they simplify an export, view, or fixture. Close EX-PLD-10 only after a revised versioned test corpus represents valid owner-chosen semantics faithfully, includes counterexamples, and the owner reviews unresolved alternatives.
