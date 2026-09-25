# Machine Interface Design

## Purpose

Define supported machine-consumed representation and interaction contracts for prepared-data import and the first external learning runtime. These contracts preserve accepted domain/application semantics without becoming domain, persistence or component design.

## Prepared-data exchange

Prep supports bulk intake of prepared canonical data through a versioned document representation.

### Envelope

The initial interchange format is UTF-8 JSON. A document declares:

```text
schema_version
data_kind
items[]
```

Supported data kinds:

- `knowledge`
- `requirements`
- `questions`
- `targets`

A document is homogeneous by data kind. This keeps validation and recovery understandable and does not prevent later multi-document packaging.

### Identity and references

Canonical Prep IDs may be supplied for updates/re-import when already known. New objects may use import-local stable keys so relationships inside the same prepared dataset can reference one another without database identifiers.

External source URLs, filenames or row numbers are not canonical identity by themselves.

### Knowledge representation

A knowledge item can represent:

- KnowledgeNode: import key/id, semantic kind, content;
- KnowledgeRelation: relation type plus source and target references.

The representation exposes only accepted Knowledge Model semantics. Visualization coordinates and persistence fields are not part of the contract.

### Requirement representation

A requirements document can represent:

- Requirement identity/key and accepted definition/content;
- RequirementSet identity/key and members;
- Requirement-to-Knowledge alignments.

RequirementSet membership must preserve the domain acyclicity invariant. Knowledge references must resolve to canonical or import-resolvable KnowledgeNodes.

### Question representation

A question item represents:

- Question identity/key when available;
- question text;
- direct answer text;
- zero or more KnowledgeNode references.

Knowledge alignment is optional at initial import because alignment may be completed later through application/human-interface flows.

### Target representation

A target item represents:

- LearningTarget identity/key when available;
- accepted target definition/content;
- selected Requirement/RequirementSet references.

### Bulk import processing and outcomes

The bulk document is a transport container. Each item in `items[]` is an independent import unit.

Processing semantics:

1. Decode and validate the document envelope. If the envelope cannot be interpreted, reject the request.
2. Validate each item independently against representation, reference and accepted domain/application rules.
3. Apply every item that passes validation.
4. Reject an invalid item without rolling back other valid items in the same bulk request.
5. Return aggregate statistics and item-level failure information sufficient to identify rejected units.

The response reports at least total items received, successfully applied items, rejected items, rejected item identity/import-local key or position, and rejection reason/category.

Item rejection categories include representation/schema rejection, unresolved reference, domain-invariant rejection, and conflict with existing canonical identity.

A failed item does not make the whole bulk request fail after the envelope has been accepted. The bulk container has no cross-item atomicity guarantee. References must still resolve; failure of a referenced peer cannot silently make a dependent item valid.

### Import identity and technical deduplication

Bulk import is idempotent at item level.

Identity resolution is attempted in this order:

1. canonical Prep ID, when supplied;
2. stable import key, when supplied by a producer;
3. deterministic technical fingerprint when neither stable identity is available.

A stable import key identifies the logical import unit independently of mutable content. Re-importing the same key updates/reconciles that unit rather than creating a duplicate.

The fingerprint fallback detects syntactically equivalent content only. It is computed from a documented canonicalized representation of identity-bearing fields and a stable hash algorithm. For Questions, the current minimum identity-bearing content is normalized `question_text`; normalization may include Unicode normalization, trimming and whitespace normalization. The fingerprint is not semantic identity and does not claim that differently worded questions are equivalent.

Changing fingerprint-bearing content without a canonical ID or stable import key creates a distinct import unit. Corrected re-imports should therefore provide stable import keys.

Import outcomes distinguish `created`, `updated`, `duplicate_skipped`, and `rejected`.

Semantic duplicate detection is outside bulk import. Similar/paraphrased Questions may coexist and can later be inspected through corpus-maintenance tooling and knowledge alignments.

## External learning runtime: Anki

Anki is the first supported external learning runtime. Its contract is an adapter-facing machine boundary; Anki concepts do not become Prep domain concepts.

### Export intent

Input to the boundary is a Prep Study Set containing canonical Question identities and question/answer content.

For the first integration, one exported Prep Question materializes to one Anki study note/card representation sufficient to present the question and direct answer.

The external representation must carry a stable Prep Question reference so later review results can be resolved back to the canonical Question.

Deck names, note type names, fields, tags and Anki identifiers are integration representation concerns, not Prep domain identity.

### Export operations

The supported interaction must be able to:

1. ensure the required external study representation exists;
2. create or reconcile exported items for Study Set Questions;
3. preserve the stable Prep Question reference across repeated export;
4. report per-question success/rejection sufficiently for the application to avoid silently losing study material.

Repeated export of the same Prep Question must not intentionally create duplicate logical study items. The exact idempotency/concurrency mechanism belongs downstream, but duplicate-safe external identity is part of the supported boundary.

### Review import

The supported interaction must retrieve review-history facts needed by the accepted Learner Model and resolve them to Prep Question identities.

For each supported review event the boundary supplies, when available from Anki:

- Prep Question reference;
- occurred-at time;
- rating mapped to Again | Hard | Good | Easy;
- previous interval;
- next interval;
- duration;
- review phase mapped to Learning | Review | Relearning | Early.

The interface does not import Anki scheduler state as mastery, proficiency or retention.

### External mapping

The integration may retain external note/card/review identifiers required for reconciliation. Those identifiers are boundary/technical identities and never replace canonical Prep Question identity.

### Failure/outcome semantics

The boundary distinguishes at least:

- external runtime unavailable;
- unsupported/incompatible external representation;
- Prep Question reference missing or unresolved;
- export item rejected;
- review record malformed or unmappable;
- successful export/import.

Transport-specific codes remain implementation details unless required for interoperability.

## Anki transport profile

The external-learning-runtime contract is transport-independent. The first automated integration profile uses AnkiConnect because development and repeated testing require low-friction bidirectional exchange without manual file transfer.

For the AnkiConnect profile:

- the Prep backend is the API client; the browser does not call AnkiConnect directly;
- the endpoint and optional API key are deployment configuration, not domain/application data;
- the adapter targets AnkiConnect API version 6 and must surface runtime/API incompatibility rather than silently reinterpret responses;
- export/reconciliation uses stable Prep Question references in the Anki representation;
- review ingestion may use AnkiConnect review-history operations such as card-scoped review retrieval or deck review retrieval after a cursor/time boundary, while translating Anki fields into the accepted ReviewObservation contract;
- AnkiConnect availability depends on a running Anki Desktop process with the add-on loaded.

For local Docker development, the backend container may reach AnkiConnect on the host through a host-gateway address such as `host.docker.internal`. Because AnkiConnect binds to `127.0.0.1` by default, a bridge-network deployment requires AnkiConnect to bind to an address reachable from the container. Network exposure and API-key configuration are deployment/security concerns and must not be hidden inside the adapter contract.

File exchange remains a compatible future/manual transport profile rather than the primary v1 development path. A future remote deployment may introduce another adapter/bridge without changing Prep domain semantics.

## Compatibility

Both prepared-data documents and the Anki representation require explicit contract/version compatibility. A newer producer must not silently reinterpret an older field with different semantics.

## Not part of this contract

- database tables;
- UI forms or upload widgets;
- HTTP routes internal to Prep;
- component boundaries;
- Anki scheduling policy;
- FSRS interpretation;
- inferred learner state;
- automatic source extraction/generation.
