# External Dependency Design

## Anki ecosystem

### AnkiConnect

Required external adapter for live Anki Desktop integration.

Contract assumptions:

- local HTTP API on the machine running Anki;
- API version negotiation/permission check;
- note/card/media operations;
- review-history retrieval;
- review observations are deduplicated using the scoped runtime/profile binding plus Anki review/revlog identity;
- Anki may be unavailable at any time.

Prep never exposes AnkiConnect directly to the network; the Local Bridge owns it.

### AnkiWeb

Used indirectly as Anki's native multi-device synchronization mechanism. Prep does not depend on a public AnkiWeb automation API.

## Semantic model provider

LLM/model access remains behind a `SemanticModelPort`.

No single provider owns persisted graph semantics. Provider/model/version/prompt metadata is recorded with candidate-generation provenance where relevant.

Provider replacement must not change NodeId or accepted graph identity.

## English media dependencies

ffmpeg and Whisper/compatible ASR remain adapters for English Listening. Their output is evidence for domain processing, not canonical graph identity by itself.

## Browser graph renderer

Initial renderer: `react-force-graph-3d` / Three.js, selected in ADR-014.

It receives bounded view DTOs and cannot become the source of graph topology.

## Dependency policy

- pin versions in implementation/deployment manifests;
- wrap nontrivial external APIs behind project-owned adapters;
- classify provider errors into retryable/permanent/conflict where application semantics need it;
- keep external identifiers mapped to Prep-owned stable identities.
