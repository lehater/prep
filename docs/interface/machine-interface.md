# Machine Interface Design

## Purpose

Define the minimum machine-consumed contracts required by the frontend-first slice and supported external-study integration.

The contract is **transport-neutral**. It defines operation IDs, inputs, read-model meaning and observable outcomes. HTTP paths/verbs, FastAPI/controllers, persistence, deployment topology and generated clients are downstream backend realization and are intentionally deferred.

## Frontend application boundary

The frontend consumes accepted application behavior through consumer-facing ports. Mock and future HTTP adapters must preserve the same semantic contract.

### Common collection query

Where applicable:

```text
text_query?
cursor?
limit?
```

Collection result:

```text
items[]
next_cursor?
total_count
```

`total_count` is the exact count for the same semantic scope/query before pagination. Cursor representation is opaque and noncanonical.

Search semantics apply to the whole requested collection. An adapter must not pretend client-side filtering of an arbitrary partial page is equivalent.

### Common outcomes

Operations may return:

- `success`;
- `not_found`;
- `validation_rejected`;
- `conflict` when submitted continuation/current-state identity is stale;
- `external_runtime_unavailable`;
- `external_runtime_incompatible`;
- `partial_external_failure`;
- `operational_failure`.

Transport-specific status codes are adapter mappings, not frontend/domain semantics.

## Frontend read-model semantics

### LearningTarget summary/detail

A target detail exposes:

- stable target identity;
- human-readable definition;
- read-only `RequirementExpression<CapabilitySpecification>`;
- enough CapabilitySpecification detail to explain required scope without exposing persistence representation.

Learning mode never receives a target-local mutable override contract.

### Knowledge projection

Knowledge read models preserve the distinction between:

- `KnowledgeObject`;
- `KnowledgeProposition`.

A relational proposition exposes its predicate plus participants and conditions where applicable. A returned visual/projection edge is a frontend representation of that proposition and does not create a `KnowledgeRelation` domain entity.

Presentation coordinates, camera state and renderer-private fields never cross this boundary as canonical Knowledge.

### Study material and Study Set

The current supported profile is Question-compatible. A frontend study item may therefore expose question/direct-answer compatibility fields, but those fields are a projection over accepted learning/task/evaluation semantics rather than a universal domain type.

A Study Set preview exposes:

- target identity;
- supported study-profile identity;
- exact representable item subset;
- preparation diagnostics per relevant requirement fragment where applicable;
- opaque `materialization_token` binding subset and diagnostics to one current-state materialization.

A valid target may return an empty Study Set.

### Learning evidence

Frontend evidence read models expose factual `Observation` information plus relevant Performance/task/provenance context when available.

Question-compatible external-runtime review facts may be projected for usability, but a runtime rating is not itself a LearnerCapabilityClaim and the interface does not infer mastery/readiness/retention from raw observations.

### Runtime status

Runtime status exposes:

- reachable/unavailable;
- compatible/incompatible;
- non-secret configured profile summary where available.

Deployment secrets and low-level connectivity configuration are not browser product state.

## Learning-mode operations

| Operation ID | Intent | Minimum input | Result |
|---|---|---|---|
| `learning.targets.list` | Browse/search prepared targets | `text_query?, cursor?, limit?` | target summaries |
| `learning.targets.get` | Open prepared target | `target_id` | target detail with read-only RequirementExpression |
| `learning.target.knowledge.list` | Search/browse target-relevant Knowledge | `target_id, text_query?, cursor?, limit?` | Knowledge summaries |
| `learning.target.knowledge.projection` | Read target-scoped relational exploration projection | `target_id, filters?` | KnowledgeObject/KnowledgeProposition projection preserving proposition semantics |
| `learning.target.questions.list` | Browse current Question-compatible material | `target_id, text_query?, cursor?, limit?` | compatibility item summaries |
| `learning.target.study_set.build` | Build current Study Set preview | `target_id, study_profile?` | exact subset + diagnostics + `materialization_token` |
| `learning.target.study_set.export` | Export exactly inspected preview | `target_id, materialization_token` | per-item reconciliation/export outcomes |
| `learning.target.evidence.get` | Read factual target-context evidence | `target_id` | Observation facts/aggregates with bounded context |
| `learning.question.evidence.get` | Read factual evidence for a Question-compatible item | `question_id, cursor?, limit?` | attributable Observation/history projection |
| `learning.evidence.sync` | Pull supported external-runtime evidence | optional runtime cursor/time boundary | import summary and item-level failures |
| `integration.external_runtime.status.get` | Inspect runtime reachability/compatibility | none | RuntimeStatus |

`learning.target.study_set.build` resolves the selected target according to current Application/Learning Design semantics. It does not require complete support.

`learning.target.study_set.export` must reject stale materialization with `conflict` instead of exporting a silently changed subset.

## Curation-mode operations

### Learning targets

| Operation ID | Intent |
|---|---|
| `curation.targets.list` | Browse/search curated targets |
| `curation.targets.get` | Retrieve target definition and RequirementExpression |
| `curation.targets.create` | Create a LearningTarget with an accepted prepared expression |
| `curation.targets.update` | Edit target definition and/or replace its RequirementExpression through explicit Curation |

Target mutation works with complete `RequirementExpression<CapabilitySpecification>` semantics; the interface does not expose legacy Requirement/RequirementSet records as target scope.

### Capabilities

| Operation ID | Intent |
|---|---|
| `curation.capabilities.list` | Browse/search reusable Capability definitions |
| `curation.capabilities.get` | Retrieve one reusable Capability |
| `curation.capabilities.create` | Create a reusable Capability |
| `curation.capabilities.update` | Edit accepted Capability semantics |

The representation preserves PerformanceExpectation, material condition/criterion information and Knowledge focus where required by current domain semantics. Persistence-specific normalization is not part of this contract.

### Knowledge

| Operation ID | Intent |
|---|---|
| `curation.knowledge.list` | Browse/search reusable Knowledge |
| `curation.knowledge.get` | Retrieve one KnowledgeObject or KnowledgeProposition plus usable relational context |
| `curation.knowledge.create` | Create KnowledgeObject or KnowledgeProposition |
| `curation.knowledge.update` | Edit reusable Knowledge semantics |
| `curation.knowledge.delete` | Remove Knowledge only when accepted application/domain constraints allow it |
| `curation.knowledge.projection` | Retrieve a filtered exploration projection over canonical Knowledge identities |

Relational meaning is authored as a KnowledgeProposition. Predicate vocabulary is schema-level meaning, not an independently asserted Knowledge entity.

### Question-compatible study material

| Operation ID | Intent |
|---|---|
| `curation.questions.list` | Browse/search current Question-compatible material |
| `curation.questions.get` | Retrieve compatibility material and supported Knowledge mappings |
| `curation.questions.create` | Create compatibility material |
| `curation.questions.update` | Edit compatibility material |
| `curation.questions.knowledge.align` | Maintain supported Knowledge mapping where semantically justified |
| `curation.questions.knowledge.unalign` | Remove that mapping |

These operation names preserve the current application compatibility profile. They do not promote Question to the universal frontend/domain concept.

### Prepared import

`curation.import.apply` accepts a supported prepared document and returns:

- aggregate received/applied/rejected counts;
- per-item `created | updated | duplicate_skipped | rejected`;
- stable item reference/import key/position where available;
- rejection category/reason.

The frontend contract requires observable outcomes only. File decoding, transaction strategy, persistence and backend module design are deferred.

## External study runtime contract

The current external runtime is Anki-compatible.

### Export

The adapter must be able to materialize one supported runtime item for each Question-compatible Study Set item, preserve a stable Prep compatibility reference for reconciliation, and return per-item outcomes.

Repeated export of the same logical Prep item must not intentionally create duplicate logical runtime items.

### Evidence import

Supported review activity is translated into factual Prep evidence only when mapping is semantically justified.

Where available, the compatibility projection may carry:

- Prep Question-compatible reference;
- occurred-at time;
- runtime rating (Again/Hard/Good/Easy);
- previous/next interval;
- duration;
- runtime phase.

These are provenance-bearing runtime facts used to create or support `Performance`/`Observation` records. They are not imported as mastery, retention, Gap, LearningPriority or LearnerCapabilityClaim.

### External identities

External note/card/review IDs may be retained for reconciliation but never replace canonical Prep identity.

### External failures

Distinguish at least:

- runtime unavailable;
- runtime incompatible;
- Prep compatibility reference unresolved;
- export item rejected;
- review record malformed/unmappable;
- successful export/import.

## Prepared-data compatibility boundary

Prepared import remains a versioned interchange surface, but the frontend-first phase does not freeze backend schema.

Supported semantic kinds should correspond to current canonical meanings:

- `knowledge` — KnowledgeObject/KnowledgeProposition;
- `capabilities` — reusable Capability definitions;
- `questions` — current Question-compatible material;
- `targets` — LearningTarget plus RequirementExpression<CapabilitySpecification>.

A document may use canonical IDs or stable import-local keys. Storage IDs, visualization coordinates and backend persistence fields are excluded.

Exact JSON schema, cross-item transactional strategy and backend deduplication mechanics remain deferred until backend design, provided future realization preserves the observable import outcomes above.

## Compatibility

Frontend ports/read models, prepared-data documents and external-runtime mappings require explicit version compatibility when representation changes could alter meaning.

Mock adapters and future transport adapters must be substitutable at the semantic contract level.

## Not part of this contract

- HTTP paths/verbs/status-code mapping;
- backend framework/controller/service layout;
- database tables or persistence identifiers;
- frontend component structure;
- graph renderer coordinates/camera/physics state;
- Anki scheduling policy or FSRS interpretation;
- broad learner-state inference;
- automatic source extraction/generation.
