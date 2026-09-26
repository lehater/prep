# Relation vocabulary semantic audit

## Question

Are Prep's current KnowledgeRelation types sufficiently informative as final graph-edge predicates, or do broad predicates such as `uses`, `depends_on`, `derives_from` and `enables` hide materially different meanings?

## Conclusion

The current flat nine-type vocabulary is too coarse for a human-facing knowledge graph.

The problem is not that broad relations such as usage or dependency are invalid. They occur in established modeling systems. The problem is that they are better treated as **relation families / super-properties** unless their meaning is already narrow enough to answer the user's question "what exactly is the relationship between these two knowledge objects?"

Prep currently displays the relation type as the primary explanation of an edge. Under that UI contract, a leaf predicate such as `uses` or `depends_on` is often semantically under-specified.

A better model is a controlled **hierarchical relation vocabulary**:

1. broad relation family for grouping/filtering/reasoning;
2. precise leaf predicate used on an actual edge;
3. required human explanation/evidence for the edge when the predicate alone does not capture the full mechanism.

This matches mature ontology practice better than either extreme:
- one tiny flat vocabulary of generic verbs;
- hundreds of unrelated ad-hoc edge labels.

## External evidence

### SKOS

SKOS intentionally supplies only lightweight semantic relations such as broader, narrower and related. It is designed for knowledge organization, not for expressing every domain mechanism. Its vocabulary is explicitly extensible by communities.

Lesson for Prep: a broad relation such as `related` is useful for discovery but not enough as a semantic assertion where the graph is expected to explain *why* nodes are connected.

### RDF / OWL

RDF Schema and OWL support property hierarchies with `subPropertyOf`, plus domain and range restrictions. A specific property can therefore remain compatible with a broader family while carrying stronger meaning.

Lesson for Prep: `evaluates` may be a subrelation of a broad functional-interaction family without forcing the graph to label the edge merely `uses`.

### UML

UML treats generic Relationship as abstract. It distinguishes Association, Dependency, Flow and Generalization, and further distinguishes more specific dependency-like meanings such as Usage and Realization.

Lesson for Prep: a generic family is useful in the model, but a final relation should be as specific as the assertion requires.

### OBO Relation Ontology

RO standardizes hundreds of relations and expects consuming ontologies to use relevant subsets rather than the whole ontology.

Lesson for Prep: a global relation catalogue may be rich, while a concrete subject area should expose a bounded subset of meaningful predicates.

### CIDOC CRM

CIDOC CRM distinguishes broad usage from more specific forms such as use of a specific technique and permits a `mode of use` qualifier. It also defines separate production, composition, motivation and influence relations.

Lesson for Prep: "uses" commonly needs either a narrower predicate or an explicit role/mode.

### Wikidata

Wikidata separates `instance of`, `subclass of` and `part of` rather than collapsing them into a generic structural relation.

Lesson for Prep: structural relations with crisp tests are highly valuable and should remain explicit.

## Audit of current Prep predicates

| Current predicate | Audit | Reason |
|---|---|---|
| `addresses` | KEEP as leaf | Clear solution/response -> problem semantics. Directly answers why the edge exists. |
| `realizes` | KEEP as leaf | Clear concrete realization -> abstraction semantics. Strong and already central to Prep. |
| `specializes` | KEEP as leaf | Standard narrower-kind -> broader-kind relation; crisp test. |
| `part_of` | KEEP as leaf | Standard constituent -> whole relation; crisp test. |
| `produces` | KEEP as leaf with endpoint constraints | Clear when source is an activity/mechanism/producer and target is an output/result. |
| `uses` | REMOVE as ordinary leaf; retain only as abstract family if needed | Collapses scheduling, evaluating, wrapping, invoking, applying, enforcing, reading, writing and other materially different interactions. |
| `depends_on` | REPLACE as ordinary leaf with strict `requires` where necessity is proven; otherwise use a specific dependency predicate | "Depends on" often hides the reason for dependence. A strict prerequisite relation can be meaningful, but the current generic wording is too easy to misuse. |
| `derives_from` | DEFER / require subtype | Can mean computational derivation, transformation, historical lineage, inheritance of design, or conceptual derivation. These are not interchangeable. |
| `enables` | REMOVE as ordinary leaf or require a concrete subtype | Causal contribution without necessity is too broad for a final edge label; it should state what capability or mechanism is supplied. |

## Evidence from Prep's current imported graph

The ambiguity is visible in the current mock data itself. Several `uses` edges have clearly different semantics:

- asyncio -> Event Loop: runtime/framework architecture; closer to "is driven by / runs on / employs event loop".
- Task -> Coroutine: Task wraps/schedules a coroutine rather than merely "uses" it.
- Structured Concurrency -> Task: organizes tasks into a structured lifetime.
- Structured Concurrency -> Cancellation: governs/propagates cancellation.
- async/await -> Future: awaits/consumes completion state from a future-like abstraction.
- Async Runtime -> Task: schedules/executes tasks.
- Async Runtime -> Future: tracks/completes futures.
- Async Runtime -> Coroutine: drives/resumes coroutines.
- OPA -> Access Control Policy: evaluates policy.
- PDP -> Access Control Policy / Policy Set: evaluates policies to produce an authorization decision.

Those are different assertions and should not become identical edges in a knowledge graph whose purpose is explanation.

Current `depends_on` examples also mix different meanings:

- Task -> Async Runtime: execution/runtime requirement.
- PEP -> PDP: architectural decision dependency / request-response collaboration.
- ABAC -> PIP: information/attribute supply requirement.
- Policy Set -> Combining Algorithm: structural/configuration requirement.

A single `depends_on` edge hides the reason for all four.

## Proposed relation architecture

### 1. Keep a small set of stable cross-domain leaf predicates

Initial stable core:

- `addresses` — solution/response -> problem
- `realizes` — concrete realization -> abstraction
- `specializes` — narrower kind -> broader kind
- `part_of` — constituent -> whole
- `produces` — producer/process -> output
- `requires` — dependent -> *strict prerequisite*, admitted only when absence of the target prevents the source from functioning/being valid

### 2. Admit precise domain predicates when repeated evidence exists

Candidate predicates already suggested by the current corpus:

- `evaluates` — evaluator -> policy/rule/input being evaluated
- `schedules` — scheduler/runtime -> scheduled work
- `executes` — execution mechanism -> executable work
- `wraps` — wrapper/representation -> wrapped computation/object
- `organizes` — organizing model/strategy -> organized units
- `propagates` — mechanism -> signal/state propagated through a structure
- `enforces` — enforcement mechanism -> decision/policy/rule enforced
- `supplies` — provider -> information/input supplied to a consumer
- `reads_from` / `writes_to` — explicit data-access direction where useful
- `invokes` — caller -> callable/service invoked
- `transforms` — transformation -> input/output transformation relation when the transformed entity is explicit
- `computed_from` — derived value/result -> source inputs used in computation
- `evolves_from` — historical/design lineage, only where that lineage is actually relevant

These are **candidates**, not yet canonical. Each needs recurring evidence and a boundary test before admission.

### 3. Keep relation families for filtering, not for final edge meaning

Possible families:

- structural: `specializes`, `part_of`, `realizes`
- problem/solution: `addresses`
- prerequisite: `requires`
- execution/orchestration: `schedules`, `executes`, `invokes`, `organizes`
- evaluation/control: `evaluates`, `enforces`
- information/data flow: `supplies`, `reads_from`, `writes_to`, `produces`
- lineage/transformation: `computed_from`, `transforms`, `evolves_from`

A family may replace the current need for generic leaf labels such as `uses`.

## Edge evidence should remain first-class

Even a precise verb rarely explains the entire mechanism. Knowledge Graph V2's explanatory wikilinks are therefore a useful precedent.

Recommended relation shape:

```text
KnowledgeRelation
  id
  predicate
  family
  source
  target
  explanation
  evidence/provenance
```

Example:

```text
Async Runtime --schedules--> Task
family: execution/orchestration
explanation: "The runtime owns the scheduler that selects runnable Tasks and advances them when their awaited work becomes ready."
```

The graph can show `schedules` as the concise edge label; detail/hover can expose the explanation when needed.

## Admission rule for a new leaf predicate

A candidate should become canonical only if all are true:

1. **Paraphrase test** — a user can read “A <predicate> B” and learn a concrete fact.
2. **Contrast test** — it can be distinguished from its nearest sibling predicate with a short rule.
3. **Direction test** — source and target roles are unambiguous.
4. **Endpoint test** — plausible domain/range constraints can be stated.
5. **Recurrence test** — multiple independent real edges need the predicate.
6. **Inference-safety test** — the label does not imply stronger necessity/causality than the source evidence.
7. **Explanation test** — the predicate captures the relation category while the attached explanation can state the specific mechanism without changing the predicate's meaning.

## Recommended next step

Do not immediately rename the current enum one-for-one.

Instead:

1. take a representative sample across asynchronous programming, access control, Linux, databases/networking and payment processing;
2. extract the actual verb phrase/explanation for every link;
3. cluster those assertions by semantic equivalence;
4. derive candidate leaf predicates;
5. run the admission tests above;
6. then migrate the current broad edges to precise predicates and only after that change the canonical Prep registry.

This avoids designing the ontology from names alone.
