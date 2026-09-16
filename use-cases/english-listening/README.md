# English Listening

## Purpose

Build listening-comprehension training from authentic English film/TV audio and materialize stable Anki cards backed by source provenance and acoustic segments.

## Origin

This use case is based on the existing `anki_codex_pipeline_v09` project supplied for migration. Its current behavioral baseline is 43 passing unit tests.

## Domain vocabulary

This bounded context owns concepts such as:

- `MediaSource`;
- authoritative transcript occurrence / `source_ref`;
- lexical candidate and lexical target;
- ASR hypothesis and target alignment;
- `ListeningSegment`;
- playback/audio-normalization policy;
- listening-specific selection policy.

These concepts are intentionally not added to the interview-preparation question model.

## Existing pipeline behavior

```text
media
  -> transcript
  -> scoped occurrences
  -> lexical Generator
  -> lexical Critic
  -> learning plan
  -> ASR/alignment
  -> stable ListeningSegments
  -> normalized audio
  -> shared Anki adapter
  -> Listening cards
```

## Identity invariant

The legacy implementation established a useful identity rule:

```text
card identity = source provenance + persisted segment identity
```

LLM wording such as the normalized lexical expression is not part of identity. Semantic edits should update an existing learning object rather than silently create another one.

## Migration strategy

Do not copy the old repository wholesale.

Move it into `prep` in vertical slices:

1. extract shared AnkiConnect primitives and tests;
2. keep the legacy project as the behavioral reference while the shared adapter stabilizes;
3. migrate source registration/transcript scope;
4. migrate lexical Generator/Critic harness;
5. migrate ASR/alignment and stable `ListeningSegment` registry;
6. migrate card materialization/media handling;
7. rerun equivalent tests before retiring the old project.

The use case may reuse shared review observations and analytics later, but no generic learning-domain abstraction is required yet.
