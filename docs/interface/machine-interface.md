# Machine Interface Design

## Purpose

Define transport-neutral machine-consumed contracts required by the frontend-first user-centered flow, curation and supported external integrations.

The contract defines operation IDs, semantic inputs/results and observable outcomes. HTTP paths/verbs, backend framework, persistence and deployment remain downstream.

## Common outcomes

Operations may return:

- `success`;
- `not_found`;
- `validation_rejected`;
- `conflict`;
- `external_runtime_unavailable`;
- `external_runtime_incompatible`;
- `partial_external_failure`;
- `operational_failure`.

Transport status codes are adapter mappings, not product semantics.

## Frontend read models

### Target detail

Exposes:

- target identity/context;
- human-readable target definition;
- RequirementExpression<CapabilitySpecification>;
- enough capability/standard/condition detail to understand what is expected.

### Target-relative learner state

Exposes, for one active target:

- satisfied requirement fragments;
- unresolved gaps;
- challenged gaps;
- material uncertainty/conflict;
- basis references to accepted claims/evidence;
- previous projection identity when progress comparison is requested.

No universal scalar proficiency score is implied.

### Learning focus

Exposes:

- target identity;
- focused gap(s) or uncertainty;
- rationale;
- intent kind: learning/practice or diagnostic;
- currently available support summary.

### Knowledge projection

Preserves canonical Knowledge identity and relational proposition semantics. Graph/list/detail are presentation projections only.

### Learning/practice/assessment support

Exposes currently available LearningMaterial/TaskSpecification-compatible opportunities for a target/focus and explicit preparation diagnostics.

### Evidence

Exposes accepted Performance/Observation facts plus provenance and accepted CapabilityEvidenceArgument/LearnerCapabilityClaim projections where applicable.

Raw runtime ratings remain distinguishable from inferred learner capability claims.

## Learning-mode operations

| Operation ID | Intent | Minimum input | Result |
|---|---|---|---|
| `learning.targets.list` | Browse/search prepared targets | `text_query?, cursor?, limit?` | target summaries |
| `learning.targets.get` | Open prepared target | `target_id` | target detail |
| `learning.target.state.get` | Read current target-relative learner state | `target_id` | satisfied/unresolved/challenged fragments + basis |
| `learning.target.diagnostics.list` | List supported diagnostic/assessment opportunities for unresolved target areas | `target_id, requirement_fragment?` | diagnostic opportunities |
| `learning.target.gaps.get` | Read explicit target-relative Gap projection | `target_id` | gaps + basis + uncertainty |
| `learning.target.focus.get` | Read current LearningPriority/LearningIntent context | `target_id` | current focus/intents |
| `learning.target.focus.set` | Choose/confirm next learning or diagnostic focus | `target_id, gap_refs, intent_kind, rationale?` | accepted focus |
| `learning.target.knowledge.list` | Search/browse target/focus-relevant Knowledge | `target_id, focus_id?, text_query?, cursor?, limit?` | Knowledge summaries |
| `learning.target.knowledge.projection` | Read relational Knowledge projection | `target_id, focus_id?, filters?` | Knowledge semantic projection |
| `learning.target.support.list` | Read learning/practice support for target/focus | `target_id, focus_id?` | support opportunities + diagnostics |
| `learning.target.activity.start` | Establish one supported learning/practice/diagnostic activity context | `target_id, focus_id, support_ref` | activity/task context |
| `learning.target.evidence.get` | Read factual and inferred evidence-backed target context | `target_id` | observations/claims/arguments projection |
| `learning.target.progress.get` | Compare current target-relative state with prior accepted projection | `target_id, since_projection_id?` | changed/unchanged requirement fragments and gaps |
| `learning.evidence.sync` | Pull supported external-runtime evidence | optional runtime cursor/time boundary | import summary and item-level failures |
| `integration.external_runtime.status.get` | Inspect runtime reachability/compatibility | none | RuntimeStatus |

### Question/Anki compatibility operations

| Operation ID | Intent |
|---|---|
| `learning.target.questions.list` | Browse current Question-compatible material |
| `learning.target.study_set.build` | Build exact current compatible Study Set preview |
| `learning.target.study_set.export` | Export exactly the inspected preview |
| `learning.question.evidence.get` | Read attributable evidence for one compatibility item |

These remain a compatibility path under learning/practice/evidence, not the primary product model.

## Curation-mode operations

### Targets

- `curation.targets.list`
- `curation.targets.get`
- `curation.targets.create`
- `curation.targets.update`

### Capabilities

- `curation.capabilities.list`
- `curation.capabilities.get`
- `curation.capabilities.create`
- `curation.capabilities.update`

### Knowledge

- `curation.knowledge.list`
- `curation.knowledge.get`
- `curation.knowledge.create`
- `curation.knowledge.update`
- `curation.knowledge.delete`
- `curation.knowledge.projection`

### Learning support

- `curation.learning_support.list`
- `curation.learning_support.get`
- `curation.learning_support.create`
- `curation.learning_support.update`

Current Question-compatible operations may coexist as adapter-level compatibility operations.

### Assessment/evidence design

- `curation.assessment_design.list`
- `curation.assessment_design.get`
- `curation.assessment_design.create`
- `curation.assessment_design.update`

The representation may include supported TaskSpecifications, ObservationSpecifications, EvidencePatterns, EvidentialWarrants and SamplingSpecifications required by the accepted design.

### Corpus diagnostics

- `curation.quality.get` — return supported structural/semantic preparation diagnostics without a universal quality score.

## Prepared import

### Contract discovery

`curation.import.contract.get` returns the supported import contract metadata sufficient for external preparation:

- schema/version identity;
- supported semantic data kinds;
- required/optional fields;
- reference/key rules;
- validation constraints;
- representative example payloads.

This permits a user to give the contract/example to an external agent or tool that prepares a compatible import document.

The first frontend prototype may expose a mock contract. A production serialization format need not be frozen yet.

### Validate

`curation.import.validate` accepts a prepared document and returns:

- envelope/schema compatibility;
- aggregate counts;
- item-level valid/rejected status;
- stable import key/position;
- rejection category/reason.

Validation does not apply data.

### Apply

`curation.import.apply` accepts a previously valid/current prepared document or validation identity and returns:

- created;
- updated;
- duplicate_skipped;
- rejected;
- aggregate and per-item outcomes.

Exact transaction/idempotency mechanics belong to Import Consistency Design.

## Supported prepared-data semantic kinds

The import contract may support:

- `targets`;
- `capabilities`;
- `knowledge`;
- `learning_support`;
- `assessment_design`;
- compatibility kinds such as `questions` where still required.

Storage IDs, graph coordinates and backend persistence fields are excluded.

## External runtime

The current compatibility runtime may be Anki-compatible.

External operations must preserve stable Prep correlation and distinguish runtime unavailable/incompatible, partial failure and unmappable records.

Returned runtime facts are translated into Performance/Observation semantics only when faithful mapping exists.

## Compatibility

Mock and future HTTP adapters must be substitutable at this semantic boundary.

Representation changes that can change meaning require explicit version compatibility.

## Not part of this contract

- HTTP endpoints/status-code mapping;
- backend/controller/service structure;
- database schema;
- graph camera/layout/physics;
- fixed UI routes/screens;
- Anki scheduler semantics;
- automatic arbitrary-source extraction/generation;
- universal proficiency scoring.
