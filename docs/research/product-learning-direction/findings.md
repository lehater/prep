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

**Evidence level:** primary-standard desk comparison plus synthetic counterexamples. **Disposition:** qualified research **recommendation**, **not** owner approval, an admitted domain predicate, or a completed EX-PLD-10 model experiment. Scoped strictly to G–C; no C–K, K–K, material or implementation decision.

### Existing approaches and limits

| Primary source | Observed semantics | Boundary for Prep |
| --- | --- | --- |
| [CTDL-ASN, Credential Engine](https://www.credreg.org/ctdl/handbook) ([term definitions](https://www.credreg.org/ctdlasn/terms)) | Framework membership (`isPartOf`) is distinct from competency alignments and `prerequisiteAlignment`. | A user Goal is not inherently a competency framework, structural part-whole, or a prerequisite claim. |
| [1EdTech CASE 1.1](https://www.imsglobal.org/sites/default/files/spec/case/v1p1/information_model/caseservicev1p1_infomodelv1p0.html) ([guide](https://www.imsglobal.org/node/218298)) | `isPartOf` indicates containment; `isRelatedTo` is generic; extensible associations are allowed. | Neither establishes what it means for a personal Goal to select a C for preparation. |
| [ESCO, European Commission](https://esco.ec.europa.eu/en/about-esco/escopedia/escopedia/two-pillar-structure-esco) | Occupation–skill links expressly distinguish `essential` from `optional`. | Occupational requirement judgments cannot be inherited by user-authored Goal scope; optional capabilities must remain representable. |
| [CTDL targetCompetency usage](https://www.credreg.org/quickstart/ctdlexplorer) | In credential/learning-opportunity condition profiles, referenced competencies may be **required** for completion or attainment. | This is stronger than Prep's selection of a preparation target. |
| [Schema.org / LRMI AlignmentObject](https://schema.org/AlignmentObject) | `requires` is an alignment type between a learning resource/program context and a framework node. | Its domain is not Goal–C; prerequisite semantics should not transfer merely because the word matches. |

### Candidate predicate, contrasted with alternatives

**Candidate:** `Goal G targets CapabilityDescription C` iff an author explicitly designates C as an **intended subject/ability-description target of preparation within G's current scope**. This is a directional, contextual assertion; C keeps its independent identity and may be selected by other Goals. It does **not** assert necessity for external success, exhaustiveness of the scope, expected attainment, actual learner ability, or evaluation. Absence of the assertion means *unknown/not selected in this recorded scope*, not proven irrelevance.

- `requires`: entails necessity; false for elective or exploratory C. Reserve only if a genuine requirement meaning is separately established.
- `includes` / `contains` / `comprises`: ambiguous structural membership or part-whole; risk mistaking Goal for a complete competency framework.
- `focusesOn`: suggests emphasis/priority; not all selected C must be central.
- `addresses`: possible but weak: merely discussing a C need not mean selecting it as a preparation target.
- `alignsWith` / `relatesTo`: compatibility or generic relevance, not positive preparation intent.
- `covers` / `achieves` / `assesses`: imply coverage, achievement, or assessment absent from Prep's research contract.

### Desk scenarios and counterexamples

| Scenario | Correct G–C reading |
| --- | --- |
| Interview Goal targets “explain consistency trade-offs” and “design an API” | Multiple distinct selected C; no implied complete interview syllabus. |
| Interview Goal and architecture-review Goal both target “explain consistency trade-offs” | One reusable C identity, distinct contextual selections. |
| New Goal has zero associated C | Valid incomplete Goal; no negative knowledge inferred. |
| Interview Goal targets elective “explain CQRS” | Valid if deliberately selected; no claim CQRS is essential to the job or mandatory for Goal completion. |
| Author removes “explain CQRS” from scope, adds “evaluate caching choices” | G–C selection changes; reusable C meanings and identities need not change. |
| Vacancy merely mentions CQRS, or a topic seems generally relevant | **Do not assert** `targets` without deliberate inclusion in the Goal's preparation scope. |
| `G requires C` asserted from an optional target, or `G achieves C` inferred from selection | **Invalid inference**: neither necessity nor personal mastery follows. |

**Falsifier:** a legitimate Prep G–C use case where C is intentionally associated with G but *is not a selected preparation target*, or where selection has to encode mandatory status. Then `targets` alone is insufficient; capture the smallest additional semantic distinction only after such evidence.

**Still open for the owner:** (1) confirm/reject `targets` and its deliberate-selection criterion; (2) determine whether merely *candidate/relevant* C needs a separately assertable relation or can remain unasserted; (3) determine whether obligation/priority distinction is necessary for a concrete Goal use case. No predicate is admitted and the broader EX-PLD-10 corrected fixture remains undone.

## Universal-workspace candidate, not a product decision

The bounded read-only shell has four surfaces: **[1] collection**, **[2] related records with named roles and an inspectable source assertion**, **[3] own details and optional type-specific extension**, **[4] optional bounded graph of eligible *actual* binary assertions**.

Track selection, current kind, focus, graph scope, filters, origin/return navigation and panel layout separately; report selections outside a filtered view honestly. Reverse navigation does **not** invert the stored predicate. Neither any graph edge nor any visual route establishes a new subject fact.

Reproduction: `node experiments/universal_entity_workspace/ex-pld-11-interaction-check.mjs`. This is a pure assertion check of a synthetic projection contract, **not** a working browser prototype.

## Modeling stop condition

Do not reintroduce a direct Goal–Knowledge study-intent shortcut or declare material/depth relationships merely because they simplify an export, view, or fixture. Close EX-PLD-10 only after a revised versioned test corpus represents valid owner-chosen semantics faithfully, includes counterexamples, and the owner reviews unresolved alternatives.
