# Qualified research findings — current

| Topic | Evidence/result | Limit and disposition |
| --- | --- | --- |
| Goal/Capability semantics (EX-GF-01) | Bounded desk semantic check supports incomplete Goals, reusable CapabilityDescription identity, and separation of structural C–C assertions from procedures or ordering. | Does not admit specific G–C, C–K or C–C predicates. No actual-user evaluation. |
| Knowledge orientation / external material | Synthetic study-loop transport and selection checks show a feasible *mechanism*; public-user proxy examined 16 reported episodes (7 full threads, 9 excerpts). | No comparative measured user value, human understanding or source-quality proof. |
| Subject model (EX-PLD-10) | Owner research direction: G–C M:N, context-independent/unambiguous C, C–C deferred. Qualified C–K and K–M M:N hypotheses: 11/11 initial synthetic path checks, 20/20 subsequent bounded integrity/lifecycle desk checks. | Not an accepted ontology or reusable complete fixture. K–M reachability is topical, not proof of C-specific material suitability. K–K vocabulary, relation equivalence/lifecycle and several semantic choices remain open. |
| Universal workspace (EX-PLD-11) | Independent read-only four-pane concept and final self-contained state/projection test: **25/25 synthetic assertions**. A generic collection/related-records/details/optional-graph shell worked for tested cases with typed role-aware related entries and extension points. | Unlimited descriptor-only universality **does not work**; unknown media/behavior requires extensions. No validated production UI or human usability result. |
| Graph representation | Can show eligible typed binary assertions without changing source meaning. | The case for a default 2D/3D graph versus a good relation table is **not established**. |
| Cross-track integration | A projection must preserve source **entity** identity, endpoint roles, predicate, direction/conditions when present, and explicit absence. View/graph edge keys are a UI concern, not domain relation-instance IDs. Multi-role content must not create invented binary subject relations. | Subject-model → workspace compatibility with a **corrected** EX-PLD-10 corpus remains **unrun**. |

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

**Limits:** no user validation, completeness or semantic-quality certification; no direct C–M decision; no full versioned EX-PLD-10 fixture for typed K–K, qualified-claim semantics if needed, material association alternatives or all mutation/deletion cases. Older G–K bypass prototypes remain inadmissible evidence for this topology.

**Current scope boundary:** K–M supplies topic-related candidates for **manual** inspection and selection. A direct C–M relation remains an open alternative only if a concrete user workflow requires asserting C-specific study purpose. Do not invent C–M or new G–C kinds from graph reachability.

### Integrity and lifecycle follow-up — bounded synthetic check (2026-10-13)

**Evidence:** 20/20 **in-session, in-memory desk assertions** passed on a deliberately limited extension of the above corpus; the checking script is **not persisted as a reproducible experiment artifact**. This was a historical fixture using relation-instance IDs; the later owner decision rejects that requirement. The count remains historical evidence, **not** validation of a corrected ID-free model, production behavior or lifecycle closure.

- Validated endpoint role/kind consistency; stable, independently reusable C and K; multi-K material; exact navigation for two nonempty Goals and an empty Goal; off-scope and unlinked material exclusion; and absence of a direct G–K fact.
- Verified that removing one G–C link leaves C reusable in another Goal; removing one C–K link preserves other uses of K; late material linking changes discovery without reidentifying M; deleting M with its links does not delete C or K.
- Negative cases detected dangling endpoint references, inverted endpoint roles, missing type on an asserted K–K edge and unsupported direct G–K relation. One historical relation-ID collision test relied on the now-rejected instance-identity assumption and is not a requirement for the revised model.
- A typed and directed **sample K–K assertion** was included only for a minimal constraint check; its chosen illustrative predicate is **not** an adopted vocabulary. K–K links must not silently materialize extra G–C, C–K, or Goal–Knowledge assertions.
- In the revised simple-association model, repeated input of the same unqualified G–C endpoint pair does not create multiple independently identified subject links. Import reconciliation remains an open operational policy; contextual or contradictory claims need separate justification rather than automatic relation-instance IDs.
- Renaming C without changing its task meaning may preserve identity; substantively changing the ability's meaning needs a domain identity policy, not automatic treatment as a cosmetic rename.
- Removing a K still referenced by C or M creates dangling relations. The desk check detected the problem; it **did not** select a cascade/reject/detach behavior. No storage/API mechanism is implied.

**Boundary cases still unresolved (P1 unless needed earlier):** handling duplicate inputs for the same unqualified link; how material changes in a CapabilityDescription affect its identity and existing links; semantics of removing shared objects; whether any actual MVP use case needs to distinguish an author's intended C-specific material from learner-selected topical material. These do not warrant adding relation entities or new entity kinds by default.

**Stage disposition:** preserve the G–C M:N owner decision and C–K/K–M qualified simple-association hypotheses as the **initial MVP research baseline**. EX-PLD-10 is **not complete**. Advance to a corrected *versioned* corpus, then check its fidelity under the separate EX-PLD-11 read-only presentation contract. Do not infer the UI projection's edges are new subject facts.

## Owner layout reference recovered (2026-10-13)

The owner provided **two prior interactive-layout screenshots** showing an adjustable persistent L0 sidebar and an L1 workspace whose **specified pane positions** are 1 collection (upper left), 3 details (upper right), 2 related entities (lower left), 4 graph (lower right), plus heading/search/context bars and footer. **This exact layout had not been recorded in research notes or verified in the later standalone prototype.** The previous 25/25 independent interface assertions and 31/31 compatibility assertions therefore say nothing about matching that physical arrangement. A later assistant-drafted 2×2 interpretation that ignored the owner-provided placement was wrong. Restore fidelity before UX review; see [owner layout reference](interface-layout.md). No subject relation, Harness contract, or owner-approved product UI is inferred from a screenshot.

## Universal-workspace candidate, not a product decision

The bounded read-only shell has four surfaces: **[1] collection**, **[2] related records with named roles and an inspectable source assertion**, **[3] own details and optional type-specific extension**, **[4] optional bounded graph of eligible *actual* binary assertions**.

Track selection, current kind, focus, graph scope, filters, origin/return navigation and panel layout separately; report selections outside a filtered view honestly. Reverse navigation does **not** invert the stored predicate. Neither any graph edge nor any visual route establishes a new subject fact.

Reproduction: `node experiments/universal_entity_workspace/ex-pld-11-interaction-check.mjs`. This is a pure assertion check of a synthetic projection contract, **not** a working browser prototype.

## Modeling stop condition

Do not reintroduce a direct Goal–Knowledge study-intent shortcut or declare material/depth relationships merely because they simplify an export, view, or fixture. Close EX-PLD-10 only after a revised versioned test corpus represents valid owner-chosen semantics faithfully, includes counterexamples, and the owner reviews unresolved alternatives.

## EX-PLD-10 — K–K semantic relation review (2026-10-13)

**Evidence level:** standards comparison and synthetic examples/counterexamples only. This is **noncanonical research**: no Harness acceptance, approved complete predicate vocabulary, production tests, actual-user validation, or completed EX-PLD-10. No engineering model/authority artifacts are changed.

### Boundary and proposed minimal model

The owner-confirmed research invariant is: **every asserted K–K subject relation has an explicit meaningful type**, not “every pair of Knowledge objects must be linked.” A predicate means a domain assertion about reusable subject referents, not a graph shortcut, tag, display filter, study plan, material source or a capability requirement. Goal–CapabilityDescription, CapabilityDescription–Knowledge and Knowledge–StudyMaterial remain the previously chosen simple M:N research links (C–K/K–M still qualified hypotheses): adding K–K predicates does **not** retaxonomize them or imply G–K/C–M facts.

Minimal conceptual K–K relation (not a persistence/API schema):

    source Knowledge | meaningful predicate | target Knowledge

**Owner decision (2026-10-13): relation-instance identity is not required and must not be implemented without demonstrated need.** A simple unqualified link is expressed by its endpoint roles, and for K–K also its predicate. Repeating the same unqualified statement does not create additional relationship objects; different predicates may hold between the same two Knowledge entities. This is not a general equality rule for condition-qualified claims, which are deferred pending evidence. Unsupported propositions remain unknown/candidates, not untyped or defaulted to `related_to`. Inverse navigation displays the **same** relation from the other endpoint; it does not create another subject fact. If contextual or multi-role claims are justified later, preserve their meaning without inventing binary edges or assuming relation IDs.

### Standards comparison

| Source | Useful distinction | Limit for Prep |
| --- | --- | --- |
| [ISO 704:2022](https://www.iso.org/standard/79077.html) | Generic/kind, partitive and associative/causal relations reflect different concept structures. | Term-system methodology does not determine K–K learning order or a domain ontology. |
| [W3C SKOS Reference](https://www.w3.org/TR/skos-reference/) | `broader/narrower` versus symmetric `related`; directly asserted `broader` is **not** transitive while `broaderTransitive` is. Direct source facts and inferred closure differ. | SKOS `broader` can reflect broad topic hierarchy, not necessarily strict subclass `is_a`; `related` is semantically too generic for authored K–K truth. |
| [W3C OWL 2 Primer](https://www.w3.org/TR/owl-primer/) | Inverses, symmetry, asymmetry, irreflexivity, transitivity are **predicate-specific** characteristics. | A full logical ontology/reasoner is not prerequisite to Prep's first subject-navigation slice. |
| [1EdTech CASE 1.1](https://www.imsglobal.org/sites/default/files/spec/case/v1p1/information_model/caseservicev1p1_infomodelv1p0.html) and [implementation guide](https://www.imsglobal.org/spec/CASE/v1p1/impl) | `isChildOf`, `isPartOf`, `precedes`, `exactMatchOf` and extensible vocabulary are distinct. | Framework associations, including its default `isRelatedTo`, are not automatically reusable subject K–K truth. |
| [CTDL-ASN prerequisiteAlignment](https://www.credreg.org/ctdlasn/terms) | Explicit prerequisite alignment; the **referenced** resource is prerequisite of the source competency. | Competency/educational prerequisites may vary with curriculum, target and learner: not automatically intrinsic Knowledge dependence, nor the same canonical arrow convention. |
| [W3C PROV-O](https://www.w3.org/TR/prov-o/) | Qualification/provenance of assertions, derivation/lineage. | Provenance `wasDerivedFrom` is not synonymous with subject `causes` or `part_of`. |

**Existing Prep comparison evidence:** `.harness/candidates/knowledge-relation-classification.yaml` already sketches `specializes`, `part_of`, `realizes`, `requires`, `causes`, `addresses` and other families. Reuse its precise conceptual distinctions rather than recreate a competing registry. Its internal “preferred” flags are **candidate-document status only** here: `.harness/core.yaml` does not publish that Tactical classifier/model in the examined branch.

### Proposed predicate boundaries

Arrow means stored **subject roles** from source to target, not visual navigation. Transitivity refers to entailment only, never generic multi-hop reachability.

| Family / possible leaf | A -> B semantics | Symmetric? | Transitive? | Priority |
| --- | --- | --- | --- | --- |
| Kind / `specializes` (strict version of ambiguous `is_a`) | A is a narrower **kind** of B; every instance of A-kind is an instance of B-kind. Distinguish **instance-of** from **subclass-of**. | No; directional/asymmetric in consistent taxonomy | Yes for kind-level subclass semantics; inferred indirect links must be marked derived, not authored | First-slice test |
| Composition / `part_of` | A is a genuine constituent part of the defined whole B, not merely in the same topic or collection. | No | Conditional: only homogeneous parthood with compatible granularity; never arbitrary nesting | First-slice test |
| Abstraction / `realizes` | Concrete A embodies or implements an independently defined abstraction/specification B. | No | No general closure | First-slice test |
| Strict dependency / `requires` | Subject behavior or validity A is impossible without B **under stated conditions**. | No | No default closure across varying conditions | Conditional candidate |
| Causal / `causes` | Event/mechanism A causally produces B in specified circumstances, with supporting evidence. | No | No default closure | Conditional candidate |
| Representation / `represents` | Description/model/symbol A stands for referent B; does not necessarily implement B. | No | No | Deferred |
| Problem/response / `addresses` | Solution A solves or mitigates problem B, not merely discusses it. | No | No | Deferred |
| Ordering / `precedes` | Stage/event A occurs earlier than B **in the modeled process**. | No | Only in one consistent ordering domain, not automatically across different processes | Deferred |
| Contrast/equivalence | `contrasts_with` = competing or opposed in a specified comparison; `equivalent_to` = strict same meaning, not mere similarity. | Yes | Contrast no; strict equivalence yes only if identity criterion supports it | Deferred; consider aliases instead of duplicate K |
| Generic association | `related_to`, `uses`, `depends_on`, `enables`: ambiguous without the mechanism and roles. | Not safely prescribed | Not safely prescribed | **Not** a default subject K–K predicate; “related” can be a UI grouping |

### Example/counterexample corpus — semantic desk check

1. **`specializes`/`is_a`:** “Raft consensus algorithm” is a kind of “consensus algorithm”; Raft is not a *part* of the class of all consensus algorithms. Calling a particular protocol an *instance* of the algorithm kind versus a *subkind* requires referent disambiguation.
2. **`part_of`:** “leader-election subprotocol of Raft” is a part of “Raft protocol”. But “consistency models” is not a constituent part of “distributed systems” just because the former is a topic under the latter; that is classification/navigation, not strict mereology.
3. **`realizes`:** “Raft protocol” realizes an explicitly stated “distributed-consensus specification” **under the protocol's assumptions and obligations**. But “Raft uses leader election” does not mean Raft *realizes* leader election: use/containment is not implementation of that as the target abstraction. `realizes` is also not a synonym for `specializes`.
4. **`prerequisite` versus `requires`:** “Quorum-based write acknowledgement” strictly requires “a sufficient voting quorum” in that configuration; “distributed consensus requires Raft” is false because alternative protocols exist. “Learn matrix multiplication before eigenvectors” is a contingent pedagogy recommendation, **not** a universal subject fact; a learning prerequisite would need its own explicit context/predicate, outside unqualified K–K.
5. **`causes`:** “Loss of write quorum” causes “write unavailability” in the specified quorum-based configuration without an alternative quorum. “Network partition causes all reads to become unavailable” is too strong: it ignores consistency policy, read path and available replicas. A mere `precedes` statement cannot imply `causes`.
6. **`represents` versus `realizes`:** A diagram of the Raft state machine *represents* the protocol; the diagram does not implement the protocol. Document-to-K source provenance is likewise not intrinsically a K–K causal edge.
7. **Independent predicates on one pair:** An event A may both `precedes` B and `causes` B given **independent support**. It is valid to have multiple predicates for the same two K referents; the pair is not a one-to-one single-edge slot.
8. **Repeated or supported claims:** Two sources can support the same unqualified (A, predicate, B) relation without creating two Prep relation instances. Different conditions or contrary claims, if needed, would require an explicitly justified claim/evidence model rather than mandatory IDs for ordinary links.
9. **Direction and absence:** `has_part(B,A)` is an inverse *view* of `part_of(A,B)`, never an independent assertion. No K–K record means *unknown/not asserted*, not “false”; K–K traversal never constructs C–K, G–C, Goal–K or certifies C-specific material suitability.
10. **Cycle/identity guard:** Taxonomic A -> B -> A or `part_of(A,A)` signals sense mismatch, mistaken identity or invalid strict hierarchy; flag for review rather than silently adding/merging/deleting Knowledge records.

**Inference:** Only predicate-specific entailment may be computed, labeled **derived** and kept distinct from directly authored subject assertions. For the smallest slice, the source of truth can contain only direct K–K assertions, with **no inference engine**. Test conditional transitivity/cycles in a later, justified iteration.

### Options, risks, pending owner choices

- **R1 recommended as research fixture strategy:** selective typed predicates; initially discriminate `specializes`, `part_of` and `realizes`; conditionally test `requires` and `causes` on evidence-backed cases; keep the vocabulary open to new *justified* leaves. This offers explainable navigation without a large ontology. Risk: uncategorized statements must stay candidate/unknown instead of being forced into `related_to`.
- **R2 small SKOS/CASE-like generic graph:** easy import/visualization, but `broader/related` may collapse kind, part, implementation and strict dependency. Useful interoperability vocabulary, weak subject-semantics contract.
- **R3 full OWL/rich registry:** formal inference, but too much semantic/authoring/governance cost before Prep user-value evidence.
- **R4 untyped links:** acceptable UI grouping only; fails owner input for asserted subject K–K predicates.

**Decisions needed from owner before model-fixture promotion (not answered by this review):**
- Confirm/adjust the **research-only** minimal semantic slice `specializes` (strict kind-of), `part_of` and `realizes`; this is **not** Tactical admission.
- Determine whether `requires` must denote only strict, context-qualified **subject dependency**, while learner/curriculum prerequisites remain separate; demand a counterexample if an intrinsic K–K learning prerequisite is proposed.
- Decide whether `causes` is needed in the corrected first fixture or can remain a qualified candidate.
- Specify duplicate-import, unlink and referenced-entity deletion behavior for ordinary ID-free links. Investigate qualified/contrary claims only if a concrete workflow requires them; do not reintroduce relation-instance identity by default.

**Falsifier/stop:** If concrete K referents cannot be distinguished, or the proposed three leaves cannot be reliably discriminated in realistic subject cases, do not promote the selected vocabulary. Next gate remains the corrected versioned EX-PLD-10 fixture, then the independent EX-PLD-11 view compatibility check; do not mix engineering approval with research.
