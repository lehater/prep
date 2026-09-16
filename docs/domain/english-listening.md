# English Listening domain

## Bounded-context purpose

Build listening-comprehension practice from authentic English film/TV audio while preserving source provenance and stable acoustic segments.

The bounded context decides what material is educationally meaningful. ffmpeg, ASR engines, and Anki are external mechanisms.

## Origin

This use case is based on the supplied `anki_codex_pipeline_v09` project. Its behavioral baseline before extraction was 43 passing unit tests.

## Core flow

```text
MediaSource
  -> authoritative transcript scope
  -> lexical candidate/target selection
  -> ASR hypothesis + alignment
  -> stable ListeningSegment
  -> normalized audio
  -> application publication use case
  -> study-system port
```

## Domain vocabulary

### MediaSource

Identifies the source material and its durable provenance.

### TranscriptOccurrence

A source-backed occurrence in the authoritative transcript. Source coordinates are deterministic provenance and must not be invented by an LLM.

### LexicalTarget

A semantic learning target selected from contextual material. Selection/normalization can involve an agent/LLM, but identity remains tied to deterministic source provenance rather than mutable wording.

### ASR / alignment result

Evidence used to locate a target occurrence acoustically. Provider-specific data belongs behind an ASR adapter; the domain owns the meaning of alignment confidence/policy that affects a segment.

### ListeningSegment

A stable acoustic learning object derived from source provenance and alignment policy.

The legacy project established the useful identity rule:

```text
learning-object identity = source provenance + persisted segment identity
```

Changing semantic wording should update the same learning object rather than silently create another one.

### Playback/audio policy

Rules for padding, normalization, clipping, playback presentation, and acceptable segment boundaries when those rules affect learning behavior.

## Agent boundary

Use the proven split:

```text
LLM/agent -> semantic interpretation/selection
code      -> stable IDs, coordinates, validation, media operations, persistence
```

An agent must not fabricate `source_ref`, timestamps, persisted segment IDs, or external mappings.

## External ports

Likely application capabilities include:

- media extraction/normalization;
- transcription/alignment;
- publication to a study system;
- source/transcript persistence.

Concrete ffmpeg, Whisper, filesystem, and Anki implementations remain infrastructure adapters.

## Anki boundary

A `ListeningSegment` is not an Anki Note and not an Interview `Question`.

Application code chooses how a listening exercise is projected to a study-system port. The Anki adapter materializes fields/templates/media while preserving Anki review history.

## Migration strategy

Migrate the legacy pipeline in vertical slices rather than copying it wholesale:

1. shared Anki transport/reconciliation — completed;
2. source registration/transcript scope;
3. lexical Generator/Critic harness;
4. ASR/alignment and stable `ListeningSegment` registry;
5. media normalization/materialization;
6. listening-specific study-system projection;
7. equivalent tests before retiring legacy behavior.

## Shared-domain caution

Do not reuse Interview `Question`, `Assessment`, or other entities just because Anki ultimately presents both workflows. Shared domain abstractions require equivalent semantics demonstrated by both bounded contexts.
