# Qualified research findings — current

| Topic | Evidence/result | Limit and disposition |
| --- | --- | --- |
| Goal/Capability semantics (EX-GF-01) | Bounded desk semantic check supports incomplete Goals, reusable CapabilityDescription identity, and separation of structural C–C assertions from procedures or ordering. | Does not admit specific G–C, C–K or C–C predicates. No actual-user evaluation. |
| Knowledge orientation / external material | Synthetic study-loop transport and selection checks show a feasible *mechanism*; public-user proxy examined 16 reported episodes (7 full threads, 9 excerpts). | No comparative measured user value, human understanding or source-quality proof. |
| Subject model (EX-PLD-10) | The accepted **input constraints** are distinct G/C/K/M instance identities, instance-identified relations, selective relation admissibility, no direct G–K fact, Capability-mediated Goal scope, and explicit K–K types. | **Open**: a coherent corrected fixture, exact predicates, depth, material relationships, mutations and owner model choice. No accepted subject schema. |
| Universal workspace (EX-PLD-11) | Independent read-only four-pane concept and final self-contained state/projection test: **25/25 synthetic assertions**. A generic collection/related-records/details/optional-graph shell worked for tested cases with typed role-aware related entries and extension points. | Unlimited descriptor-only universality **does not work**; unknown media/behavior requires extensions. No validated production UI or human usability result. |
| Graph representation | Can show eligible typed binary assertions without changing source meaning. | The case for a default 2D/3D graph versus a good relation table is **not established**. |
| Cross-track integration | A projection must preserve source record identity, named roles, predicate, direction/conditions and explicit absence. Multi-role records must not create invented binary source relations. | Subject-model → workspace compatibility with a **corrected** EX-PLD-10 corpus remains **unrun**. |

## EX-PLD-10 — G → CapabilityDescription semantic desk review (2026-10-13)

**Evidence level:** primary-standard desk comparison plus synthetic counterexamples. **Disposition:** competing hypothesis check; **no established need for individually typed G–C predicates**, not an owner decision or completed EX-PLD-10 model experiment. Scoped strictly to G–C; no C–K, K–K, material or implementation decision.

### Existing approaches and limits

| Primary source | Observed semantics | Boundary for Prep |
| --- | --- | --- |
| [CTDL-ASN, Credential Engine](https://www.credreg.org/ctdl/handbook) ([term definitions](https://www.credreg.org/ctdlasn/terms)) | Framework membership (`isPartOf`) is distinct from competency alignments and `prerequisiteAlignment`. | A user Goal is not inherently a competency framework, structural part-whole, or a prerequisite claim. |
| [1EdTech CASE 1.1](https://www.imsglobal.org/sites/default/files/spec/case/v1p1/information_model/caseservicev1p1_infomodelv1p0.html) ([guide](https://www.imsglobal.org/node/218298)) | `isPartOf` indicates containment; `isRelatedTo` is generic; extensible associations are allowed. | Neither establishes what it means for a personal Goal to select a C for preparation. |
| [ESCO, European Commission](https://esco.ec.europa.eu/en/about-esco/escopedia/escopedia/two-pillar-structure-esco) | Occupation–skill links expressly distinguish `essential` from `optional`. | Occupational requirement judgments cannot be inherited by user-authored Goal scope; optional capabilities must remain representable. |
| [CTDL targetCompetency usage](https://www.credreg.org/quickstart/ctdlexplorer) | In credential/learning-opportunity condition profiles, referenced competencies may be **required** for completion or attainment. | This is stronger than Prep's selection of a preparation target. |
| [Schema.org / LRMI AlignmentObject](https://schema.org/AlignmentObject) | `requires` is an alignment type between a learning resource/program context and a framework node. | Its domain is not Goal–C; prerequisite semantics should not transfer merely because the word matches. |

### First decision: does G–C need per-link relation kinds at all?

**Current hypothesis H0 (minimal):** a single reusable Goal–CapabilityDescription association with many-to-many cardinality is sufficient. Its *domain meaning* is that C belongs to the currently recorded preparation scope of G. G may refer to zero or more C; a C may participate in zero or more G. The association does **not** claim necessity, exhaustiveness, real-world competency, attainment or assessment. Absence means that no scope membership has been recorded; it is not evidence of irrelevance.

**Clarification:** M:N specifies cardinality, not predicate meaning. The endpoint roles already establish a domain-specific *kind* of association; the unresolved question is whether separate **predicate variants on individual G–C links** have justified value. A single domain association with one inherent meaning is not equivalent to a free-form, semantically meaningless edge.

**Competing hypothesis H1:** G–C has multiple independently meaningful relation kinds (or context qualifiers) that a single association cannot faithfully express. The burden of proof is a real scenario with two necessary, different interpretations, preferably changing meaningful user understanding or behavior. Being able to name `targets`, `requires`, `focusesOn` is not such evidence. An obligation/priority/status distinction, if justified, might instead be an association attribute or separately scoped state: do not assume it must be a new relation type.

### Adversarial scenarios for H0

| Scenario | Does one M:N association preserve the needed meaning? |
| --- | --- |
| Interview Goal links “explain consistency trade-offs” and “design an API” | **Yes:** one G may include many C; no exhaustive syllabus implied. |
| Interview and architecture-review Goals link the same “explain consistency trade-offs” | **Yes:** C has one independent identity, can be selected by multiple G. |
| Newly drafted Goal has zero C | **Yes:** incomplete Goal allowed; absence is not a negative fact. |
| Optional “explain CQRS” is linked to an interview Goal | **Yes:** selection does not make C mandatory for success. |
| An author removes a CQRS link and adds “evaluate caching choices” | **Yes:** scope membership changes without redefining C. |
| A job posting merely mentions CQRS, without an accepted association in the recorded preparation scope | **No link inferred:** mere relevance does not establish membership. |
| A reader concludes a linked C is mandatory, attained or exhaustively covering G | **Invalid inference:** H0 does not entail these claims. |

**Current desk result:** none of the above cases falsifies H0. There is **no evidenced requirement for per-link G–C typing**. This is a **qualified research hypothesis**, not owner approval of an implementation or final subject model.

### Predicate names: deferred unless H1 survives

- `targets` may be an English label for the **single association's meaning**; calling the link `targets` does *not* establish a need for per-link predicate variants.
- `requires` adds necessity not warranted by optional selections.
- `focusesOn` adds emphasis/priority absent from an ordinary inclusion.
- `includes` / `contains` may overstate structural part–whole containment; use a precise scope-membership definition instead.
- `addresses` / `alignsWith` / `relatesTo` can express broader relevance than recorded goal scope.
- `covers` / `achieves` / `assesses` risk unsupported completeness, outcome or evaluation implications.

**Existing standards (above):** prove that various domains *can* distinguish relation meanings; they do **not** prove Prep *needs* per-link G–C predicate typing. ESCO's essential/optional distinction is an external occupation–skill judgment, not necessarily part of Prep's Goal–C scope association.

**Falsifier for H0:** identify a concrete and valid Prep scenario where the *same Goal–C association* must represent more than one independent semantic role and where omitting that role loses essential subject meaning. Test whether an attribute or another existing domain fact suffices **before** introducing types.

**Open for owner decision:** (1) is simple scope membership the intended G–C meaning? (2) do candidate/relevant C need to be represented as links before being selected? (3) does any actual Goal scenario require necessity, priority or another distinct G–C claim? Only after such evidence should individual predicate variants be evaluated. EX-PLD-10's broader corrected fixture and owner admission remain pending.

## Universal-workspace candidate, not a product decision

The bounded read-only shell has four surfaces: **[1] collection**, **[2] related records with named roles and an inspectable source assertion**, **[3] own details and optional type-specific extension**, **[4] optional bounded graph of eligible *actual* binary assertions**.

Track selection, current kind, focus, graph scope, filters, origin/return navigation and panel layout separately; report selections outside a filtered view honestly. Reverse navigation does **not** invert the stored predicate. Neither any graph edge nor any visual route establishes a new subject fact.

Reproduction: `node experiments/universal_entity_workspace/ex-pld-11-interaction-check.mjs`. This is a pure assertion check of a synthetic projection contract, **not** a working browser prototype.

## Modeling stop condition

Do not reintroduce a direct Goal–Knowledge study-intent shortcut or declare material/depth relationships merely because they simplify an export, view, or fixture. Close EX-PLD-10 only after a revised versioned test corpus represents valid owner-chosen semantics faithfully, includes counterexamples, and the owner reviews unresolved alternatives.
