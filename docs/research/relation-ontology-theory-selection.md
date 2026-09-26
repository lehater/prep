# Theory-backed relation model research

## Status

Research evidence. This document does **not** yet replace the canonical relation vocabulary in `docs/domain/knowledge-model.md`.

## Research question

Prep needs semantic edges that tell a reader *what exactly* connects two Knowledge objects.

The current flat vocabulary contains useful predicates (`addresses`, `realizes`, `specializes`, `part_of`) but also very broad predicates such as `uses`, `depends_on`, `derives_from` and `enables`. In the current corpus these broad predicates can produce opposite-looking edges whose labels fail to explain the actual relationship.

The question is whether a mature theory or standard already provides:

- relation families;
- precise relation meanings;
- direction and inverse semantics;
- admissible source/target roles;
- rules for extending the vocabulary;
- enough breadth for technical knowledge without inventing arbitrary verbs.

## Finding

There is no credible single universal finite list of predicates for every knowledge domain.

There **is**, however, a mature standards stack that solves the design problem without inventing a Prep-specific relation theory:

1. **ISO 704:2022** — primary methodology for concept systems and concept relations.
2. **ISO 24156-1:2014** — representation of terminological concept models using a UML profile.
3. **OWL 2 / RDF Schema** — formal machinery for property hierarchy, domain/range, inverse properties and logical characteristics.
4. **Relation Ontology (RO) methodology** — discipline for consistent, unambiguous definitions and reusable relation subsets.
5. **ArchiMate 3.2** — domain vocabulary for software/system/architecture relationships.
6. **PROV-O** — domain vocabulary for provenance, derivation, generation and communication.
7. **Concept-map theory (Novak & Cañas)** — human-facing quality rule: two concepts plus the linking phrase should form a meaningful proposition.

For Prep, **ISO 704 should be the conceptual-methodology anchor**, OWL/RO should define relation-engineering rules, and domain standards should supply precise predicates when the domain requires them.

## 1. ISO 704:2022 as the primary concept-relation methodology

ISO 704 is an international standard for terminology work in scientific, technological, industrial and other fields. It treats concepts as units in a concept system structured by relations.

It requires at least:

- hierarchical relations;
  - generic relations;
  - partitive relations;
- associative relations.

A generic relation is genus/species: the subordinate concept contains the characteristics of the superordinate plus at least one delimiting characteristic.

A partitive relation is whole/part.

Associative relations are derived from underlying relations between objects. ISO 704 explicitly describes multiple **types and subtypes** of associative relation rather than one catch-all predicate.

### ISO 704 associative relation taxonomy relevant to Prep

| Family | Relation/subtype | Roles/examples in the standard | Potential Prep interpretation |
|---|---|---|---|
| contiguity | enhancement | tool -> accessory | optional accessory/support relation |
| contiguity | attachment | tool -> connection | attached/connected structural relation |
| contiguity | locative | container -> contained | contains / located-in |
| contiguity | material | item -> material | made-of / material-of |
| contiguity | property | material -> state/property | has-property / exhibits |
| contiguity | ownership | object -> owner | owned-by |
| contiguity | rank | hierarchy level -> hierarchy level | rank/order relation |
| sequential | temporal | earlier occurrence -> later occurrence | precedes |
| sequential | spatial | object -> spatial counterpart | spatial relation if relevant |
| sequential | causal | cause -> effect | causes |
| sequential | developmental | process stage -> later stage | develops-into / evolves-to |
| activity | agent | action -> actor | performed-by / agent-of |
| activity | object | action -> object | acts-on / operates-on |
| activity | tool | action -> instrument | uses-tool / performed-with |
| activity | manner | action -> method | performed-by-method |
| activity | locational | action -> place | occurs-at |
| activity | purpose | action -> objective | has-purpose / aims-at |
| activity | result | action -> beneficiary/result-role | outcome/beneficiary relation |
| activity | patient | action -> patient | affects / patient-of |
| origination | originator | producer -> product | produces |
| origination | ingredient | raw material -> product | ingredient-of / made-from |
| origination | instrument-product | tool -> product | tool-produces |
| instrumental | agent-instrument | actor -> tool | operates/uses-instrument |
| instrumental | object-instrument | object -> handling tool | handled-by / instrument-for |
| instrumental | instrument-patient | instrument -> patient | acts-on |
| interactional | dependency | controlled <-> controller; agent <-> patient | requires explicit role pair; not a generic `depends_on` arrow |
| representational | representation | entity -> representative | represents / represented-by |
| transmission | sender-receiver | sender -> receiver | transmits-to |
| transmission | sender | sender -> transmitted object | sends / emits |
| transmission | receiver | transmitted object -> receiver | received-by |
| opposite | contrary | concept -> contrary concept | contrary-to |
| opposite | contradictory | concept -> negated/opposite concept | contradicts / negates |

The standard's important design lesson is not that Prep must copy every row. It is that "associative" is a **family**, and a meaningful model exposes a suitable subtype/role when the subtype matters.

ISO 704 also states that concept diagrams/models should be clear, intelligible, transparent and extensible; transparency includes making different types of concept relations explicit. It also states that associative relation type/subtype may be shown as a label and directionality may be represented graphically.

This is directly aligned with Prep's 3D graph.

## 2. Relation Ontology: formal-definition methodology

Smith et al. (2005), *Relations in biomedical ontologies*, was created precisely because relation labels in ontologies were often used informally and ambiguously. The authors propose a methodology for **consistent and unambiguous formal definitions** of relational expressions so that curation and reasoning do not silently mix meanings.

The modern OBO Relation Ontology (RO) contains generic and domain-specific relations and explicitly recommends using a **task/domain-specific subset**, not the entire ontology.

RO Core is a small domain-neutral subset grounded in Basic Formal Ontology (BFO); the full RO is deliberately much larger and hierarchical.

### Lesson for Prep

Do not ask for one tiny universal enum.

For every canonical relation, define:

- natural-language meaning;
- source role/domain;
- target role/range;
- direction;
- inverse, if useful;
- parent relation/family;
- logical properties (symmetric/asymmetric, transitive/non-transitive, etc.);
- positive examples;
- counterexamples;
- evidence/admission rule.

A relation is not admitted merely because a useful English verb exists.

## 3. OWL 2 / RDFS: relation hierarchy and inverse semantics

OWL/RDFS provide the formal mechanics Prep needs even if Prep never serializes its data as OWL:

- `subPropertyOf` / property hierarchy;
- domain and range;
- inverse properties;
- disjoint/equivalent properties;
- symmetric/asymmetric;
- reflexive/irreflexive;
- transitive;
- property chains.

### Critical implication for the current "opposite arrows" problem

An inverse presentation should normally be **derived from one canonical assertion** rather than stored as a second independent semantic edge.

Example:

```text
Async Runtime --executes--> Task
```

If the UI wants to read from the Task side, it can display the inverse phrase:

```text
Task --executed_by--> Async Runtime
```

That is one fact, not two edges.

The current pattern:

```text
Task --depends_on--> Async Runtime
Async Runtime --uses--> Task
```

does not describe two useful independent facts. It is usually evidence that the model lacks the precise predicate (`executes`, `schedules`, `hosts`, etc.).

## 4. BFO / foundational ontology

ISO/IEC 21838-2 standardizes Basic Formal Ontology as a top-level ontology. BFO/RO distinguish foundational relations such as parthood, participation, realization and tightly defined forms of dependence.

This is important because formal ontological **dependence** is far stricter than the software-engineering phrase "depends on".

It also exposes a naming trap: BFO's relation named `realizes` is not the same relation Prep means by `realizes`. In BFO/RO, realization is tied to a process realizing a realizable entity such as a role, disposition or function. Prep's implementation/abstraction relation is instead much closer to ArchiMate Realization. Relation identifiers therefore cannot be imported by lexical similarity alone.

For example, specific dependence in BFO concerns entities whose existence at a time requires another entity to exist at that time. This is not the semantics of "Task depends on Async Runtime".

### Decision

Do **not** use a naked `depends_on` as a general Prep predicate.

If a concrete dependency meaning is needed, name the actual relation. If true existential/prerequisite dependence is needed, define a narrow predicate with an explicit test.

## 5. ArchiMate 3.2 for software/system knowledge

ArchiMate is an Open Group standard for modeling enterprise and IT architecture. It deliberately differentiates relations that would otherwise collapse into "uses" or "depends on".

Its concrete relationship vocabulary includes:

- Composition
- Aggregation
- Assignment
- Realization
- Serving
- Access
- Influence
- Triggering
- Flow
- Specialization
- Association

Useful meanings for Prep include:

### Realization

Concrete behavior/structure realizes a more abstract service/element.

This supports retaining Prep `realizes`.

### Serving

A provider makes functionality available to a consumer.

This is more informative than "A uses B" because it states provider/consumer roles and canonical direction.

### Access

An active/behavioral element accesses a passive object, with access modes such as read/write/read-write.

This is substantially better than `uses` for data/storage knowledge.

### Flow

Transfer of information, goods or value from source to destination.

This is better than generic dependency for queues, APIs, streams and payment/data flow.

### Triggering

Temporal or causal precedence between behavior elements.

This is better than `depends_on` when one behavior starts/causes another.

### Assignment

An active structure element performs/is responsible for behavior.

This gives a precise role relation for component/process relationships.

### Specialization / Composition

These support precise taxonomic and structural relations.

### Limitation

ArchiMate is not a universal knowledge ontology. It should be a source of **technical-system predicates**, not the sole relation theory for Prep.

## 6. PROV-O for derivation and provenance

W3C PROV-O demonstrates why `derives_from` is meaningful only when its scope is defined.

PROV-O separates:

- `used`: Activity -> Entity consumed/used;
- `wasGeneratedBy`: Entity -> Activity that generated it;
- `wasDerivedFrom`: Entity -> Entity from which it was transformed/constructed/updated;
- `wasInformedBy`: Activity -> Activity communicated through generated/used information;
- more specific subproperties such as revision and quotation.

PROV-O explicitly recommends more specific subproperties of `wasDerivedFrom` when applicable.

### Decision

Prep should not use `derives_from` for arbitrary conceptual influence. If adopted, derivation needs provenance-like endpoint semantics and preferably more precise subtypes such as `revision_of`, `computed_from`, `transformed_from`, etc.

## 7. Concept-map theory as the visible-edge quality test

Novak & Cañas define a concept-map proposition as two or more concepts connected by linking words/phrases that form a **meaningful statement**.

This gives Prep a simple human-facing acceptance test:

> Read "Source — predicate → Target" as a sentence. Does it communicate a useful proposition without requiring the user to guess the missing mechanism?

Examples:

```text
PDP --evaluates--> Access Control Policy        PASS
Async Runtime --schedules--> Task               PASS
PEP --enforces--> Authorization Decision        PASS
Policy Set --depends_on--> Combining Algorithm  FAIL: how?
Async Runtime --uses--> Task                    FAIL: how?
PIP --enables--> PDP                            FAIL: how?
```

The explanation/provenance of an edge can add detail, but it should not be required to rescue an otherwise meaningless predicate.

## 8. SIO as supporting evidence for role-specialized relations

The Semanticscience Integrated Ontology (SIO) is another peer-reviewed ontology aimed at rich descriptions across objects, processes and information entities. It uses relation hierarchies and **role-specialized** relations such as participant, agent, input and output rather than forcing all process/entity interaction through a single generic verb.

This independently supports the same architecture: broad families are useful internally; specific role relations should carry the actual assertion.

## Proposed Prep relation architecture

### A. Separate relation family from leaf predicate

```text
RelationDefinition
  id
  family
  label
  inverse_label?
  definition
  source_role/domain
  target_role/range
  symmetric
  transitive
  provenance_standard
  examples
  counterexamples
```

An edge stores the **leaf predicate**, not a generic family.

```text
KnowledgeRelation
  id
  predicate
  source
  target
  explanation
  evidence/provenance
```

### B. Proposed top-level families

Derived primarily from ISO 704 and refined for Prep:

1. **taxonomic**
2. **partitive / structural**
3. **realization / abstraction**
4. **problem / response**
5. **causal / temporal / developmental**
6. **activity / participation / instrument**
7. **production / origination / transformation**
8. **interaction / control**
9. **transmission / information flow**
10. **representation / provenance**
11. **contrast / opposition**

Families are for grouping, filtering and governance. They are not necessarily valid visible edge labels.

### C. Predicates with strong current support

These can already be defended by standards/theory:

| Predicate | Status | Basis |
|---|---|---|
| `specializes` | strong | ISO 704 generic relation; ArchiMate Specialization |
| `part_of` | strong | ISO 704 partitive relation; BFO/RO parthood |
| `realizes` | strong, using Prep/ArchiMate semantics | ArchiMate Realization matches concrete/tangible -> abstract semantics; BFO's same-named `realizes` has different process -> realizable-entity semantics and must not be conflated |
| `addresses` | strong Prep-specific | explicit problem/response role; clear proposition and boundary |
| `produces` | strong when endpoint roles fit | ISO 704 originator/product; SIO output; PROV generation |
| `causes` | strong with evidence | ISO 704 causal relation |
| `precedes` | strong where ordering is intrinsic | ISO 704 temporal relation; BFO/RO temporal relations |
| `represents` | strong | ISO 704 representational relation; SIO referential relations |
| `transmits_to` / `flows_to` | strong in applicable domains | ISO 704 sender/receiver; ArchiMate Flow |
| `accesses` + mode | strong for data/storage | ArchiMate Access |
| `serves` | strong for provider/consumer systems | ArchiMate Serving |
| `triggers` | strong for behavioral causal/temporal start | ArchiMate Triggering |

### D. Predicates that should not remain canonical leaf relations without rework

- `uses`
- `depends_on`
- `enables`
- generic `derives_from`

They may exist as internal super-properties/families if useful, but they should not normally be the final visible semantic edge.

## Candidate leaf vocabulary for corpus validation

This is the concrete **20-predicate candidate set** to use in the next corpus audit. It is not yet canonical. A predicate survives only if representative real Knowledge Graph evidence passes the admission protocol below.

| # | Predicate | Meaning |
|---:|---|---|
| 1 | `addresses` | source solves, mitigates or handles the target problem |
| 2 | `realizes` | source is a concrete realization of the target abstraction |
| 3 | `specializes` | source is a narrower kind or specialization of target |
| 4 | `part_of` | source is a constituent part of target |
| 5 | `represents` | source represents, models or stands for target |
| 6 | `requires` | source cannot function or be valid in the asserted sense without target; strict prerequisite only |
| 7 | `causes` | source causally brings about target |
| 8 | `precedes` | source intrinsically occurs before target in a process/lifecycle |
| 9 | `triggers` | occurrence/completion of source initiates target behavior |
| 10 | `produces` | source creates target as an output/result |
| 11 | `serves` | source provides functionality/capability to target |
| 12 | `flows_to` | information/data/value is transferred from source to target |
| 13 | `reads_from` | source reads/obtains data from target |
| 14 | `writes_to` | source writes/sends data into target |
| 15 | `evaluates` | source determines a result/decision by evaluating target |
| 16 | `enforces` | source makes target policy/decision/rule effective in operation |
| 17 | `supplies` | source provides target with required information/input |
| 18 | `schedules` | source plans/queues target for execution |
| 19 | `executes` | source directly performs/runs target work |
| 20 | `organizes` | source structures a set of target units according to an organizing rule/model |

### Explicit non-goal

The candidate set is **not** a new flat universal ontology. It is a bounded first module for Prep. Additional predicates such as `propagates`, `wraps`, `invokes`, `transforms`, `computed_from` or `revision_of` may be admitted only when repeated corpus evidence and a standard/theory anchor justify them.

The current broad predicates `uses`, `depends_on`, `enables` and generic `derives_from` are not candidates for ordinary visible leaf edges. They may survive only as internal super-properties/families if that proves useful.

### Migration principle

Do not convert an existing edge by lexical substitution. Re-read the source assertion, choose the precise leaf predicate whose definition fits, and collapse inverse-looking duplicate edges into one canonical assertion plus a derived inverse label for presentation.

## Mapping the current problematic corpus

Examples to reclassify during the next corpus pass:

| Current edge | Current type | More precise question |
|---|---|---|
| Async Runtime -> Task | `uses` | schedules? executes? manages lifecycle? |
| Task -> Async Runtime | `depends_on` | executed_by? requires runtime for execution? |
| Task -> Coroutine | `uses` | wraps? schedules? represents execution of? |
| Structured Concurrency -> Task | `uses` | organizes? scopes? governs lifetime of? |
| Structured Concurrency -> Cancellation | `uses` | propagates? coordinates? |
| OPA -> Access Control Policy | `uses` | evaluates? executes policy? |
| PDP -> Access Control Policy | `uses` | evaluates |
| PEP -> PDP | `depends_on` | requests decision from? is served by? |
| PIP -> PDP | `enables` | supplies attributes/information to |
| Policy Set -> Combining Algorithm | `depends_on` | configured_with? combines_by? |

No replacement is canonical until the source cards prove the exact semantics.

## Admission protocol for Prep

A relation candidate is canonical only when all checks pass.

1. **Standard/theory anchor** — relation is defined by a credible standard/ontology, or is a clearly justified Prep-specific domain relation.
2. **Proposition test** — `A predicate B` is useful as a standalone statement.
3. **Role test** — source role and target role are explicit.
4. **Direction test** — canonical direction is defined.
5. **Inverse test** — inverse display can be derived if needed; do not store a second edge merely to reverse wording.
6. **Domain/range test** — admissible endpoint classes/semantic roles can be stated.
7. **Sibling contrast test** — relation can be distinguished from the nearest alternatives.
8. **Logical-characteristics test** — transitivity, symmetry, reflexivity and composition assumptions are stated or explicitly absent.
9. **Recurrence test** — repeated real corpus evidence exists unless the relation comes directly from an adopted standard and is needed immediately.
10. **Evidence test** — every instance has source prose/provenance that actually supports the assertion.

## Recommended normative decision

Do not adopt a new flat enum yet.

Adopt the **method** first:

- ISO 704:2022 = primary concept-system relation methodology;
- OWL 2 / RO = formal relation definition discipline;
- ArchiMate = technical/system relation module;
- PROV-O = provenance/derivation module;
- Prep `addresses` = explicit product-domain extension;
- Novak/Cañas proposition test = visible graph quality criterion.

Then re-audit a representative corpus and derive the actual Prep module from these standardized families/predicates.

This avoids both failure modes:

- an underspecified nine-verb vocabulary;
- an uncontrolled vocabulary with hundreds of arbitrary relations.

## Primary references

- ISO 704:2022, *Terminology work — Principles and methods*.
- ISO 24156-1:2014, *Graphic notations for concept modelling in terminology work and its relationship with UML — Part 1*.
- ISO/IEC 21838-2:2021, *Top-level ontologies — Basic Formal Ontology (BFO)*.
- Smith B. et al. (2005), *Relations in biomedical ontologies*, Genome Biology 6:R46.
- W3C, *OWL 2 Web Ontology Language Primer / Structural Specification*.
- OBO Relation Ontology documentation and RO Core.
- The Open Group, *ArchiMate 3.2 Specification / ArchiMate 101*.
- W3C, *PROV-O: The PROV Ontology*.
- Novak J.D. & Cañas A.J. (2008), *The Theory Underlying Concept Maps and How to Construct and Use Them*.
- Dumontier M. et al. (2014), *The Semanticscience Integrated Ontology (SIO) for biomedical research and knowledge discovery*.
