# English Listening

Purpose: build listening-comprehension practice from authentic English film/TV audio with stable source provenance and acoustic segments.

## Canonical documentation

- domain model and migration direction: [`../../docs/domain/english-listening.md`](../../docs/domain/english-listening.md)
- shared Anki infrastructure: [`../../docs/guides/anki-infrastructure.md`](../../docs/guides/anki-infrastructure.md)
- legacy-pipeline assessment: [`../../docs/research/legacy-english-listening-pipeline.md`](../../docs/research/legacy-english-listening-pipeline.md)

## Domain ownership

This bounded context owns media provenance, transcript occurrences, lexical targets, ASR/alignment policy, `ListeningSegment`, and listening-specific playback/audio policy.

It does not reuse Interview `Question` semantics merely because both workflows ultimately use Anki.

## Migration principle

Keep the supplied legacy pipeline as a behavioral reference and migrate one vertical slice at a time. Equivalent tests should pass before legacy behavior is retired.
