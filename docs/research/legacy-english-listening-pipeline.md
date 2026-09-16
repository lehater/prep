# Legacy English Listening Pipeline assessment

## Source

Assessment input: uploaded `anki_codex_pipeline_v09` project.

The project is a local Codex + Python + Anki pipeline for learning spoken English from film/TV material.

## Test health

Executed:

```text
python -m unittest discover -s tests -v
```

Result:

```text
43 tests passed
```

This is sufficiently healthy to treat the project as design input rather than disposable prototype code.

## Existing end-to-end flow

```text
Media source
  -> authoritative transcript
  -> optional time scope
  -> LLM lexical candidate generation
  -> LLM critic / KEEP-DROP selection
  -> authoritative learning plan
  -> audio extraction
  -> WhisperX ASR + word alignment
  -> target alignment
  -> stable ListeningSegments
  -> normalized audio
  -> AnkiConnect
  -> Listening note/card
```

## Important existing design decisions

### Stable learning-object identity

The pipeline deliberately excludes LLM-normalized lexical wording from card identity.

Current identity is based on source provenance and persisted acoustic segment identity:

```text
Listening ID = hash(source_id + source_ref + segment_uid)
```

This means semantic wording can improve without silently creating duplicate cards.

### Idempotent Anki reconciliation

The implementation already contains reusable patterns for:

- finding a note by stable repository-owned ID;
- creating a note when absent;
- updating fields when present;
- detecting duplicate notes;
- consolidating legacy duplicates;
- keeping the most-reviewed note when migration must choose one;
- preserving scheduler history by migrating existing notes in place.

### Note-type evolution

The pipeline can:

- create a note type;
- add missing fields;
- update templates and styling;
- remove unused templates;
- remove legacy fields only when they contain no data;
- preserve non-empty legacy fields rather than destructively migrating them.

This is stronger than the minimal Anki adapter design currently documented in `prep` and should inform the shared adapter implementation.

### Media support

The pipeline already uploads generated audio through AnkiConnect `storeMediaFile` and stores `[sound:...]` references in note fields.

### Agent / deterministic boundary

The existing harness draws a useful boundary:

```text
LLM/Codex owns semantic decisions.
Python owns structural truth and side effects.
```

Examples:

- LLM: lexical discovery, normalization, contextual meaning, KEEP/DROP;
- Python: timestamps, transcript coordinates, ASR alignment, stable IDs, files, Anki writes.

This is a valuable general harness rule for `prep`.

## What is reusable across learning use cases

The following are infrastructure or orchestration concerns, not English-specific domain concepts:

- AnkiConnect HTTP client;
- capability/version check;
- deck creation;
- note-type creation/migration;
- stable external identity;
- find/upsert/conflict handling;
- tag reconciliation;
- media upload;
- note/card count verification;
- preservation of review history during migration;
- test doubles for AnkiConnect behavior.

These should eventually move into a shared Anki adapter in `prep`.

## What is English-listening specific

These concepts should remain inside an English Listening bounded context:

- `MediaSource`;
- transcript / subtitle cue;
- lexical candidate;
- lexical target;
- `source_ref` provenance;
- ASR hypothesis;
- target-to-ASR alignment;
- `ListeningSegment`;
- playback bounds;
- audio normalization policy;
- B2 lexical Generator/Critic policies.

They must not leak into interview-question schemas or generic Anki infrastructure.

## Why `Question` should not be generalized yet

The interview use case currently has a meaningful domain entity `Question`.

An English Listening card is not naturally a question. Its front side may contain only audio and its task is closer to:

```text
hear stimulus
  -> recognize / understand utterance
  -> reveal reference
  -> self-assess
```

Renaming `Question` to a universal `Exercise` now would be speculative domain generalization. The two bounded contexts should coexist first. A shared abstraction should be extracted only after real overlap is demonstrated in behavior and analytics.

## Recommended unification strategy

Use one repository with two bounded contexts and shared technical adapters:

```text
prep
├── Interview Preparation
│   ├── Competency
│   ├── Concept
│   ├── LearningTask
│   ├── QuestionType
│   └── Question
│
├── English Listening
│   ├── MediaSource
│   ├── LexicalTarget
│   ├── ListeningSegment
│   └── ListeningCard materialization
│
└── Shared infrastructure
    └── AnkiConnect adapter
```

The repository may later discover a shared learning kernel around `Attempt`, `Assessment`, `ReviewObservation`, `Gap`, or scheduling evidence. That extraction should be evidence-driven rather than imposed now.

## Migration recommendation

Do not copy the old project wholesale into `prep` in one change.

Preferred sequence:

1. adopt multi-use-case repository boundaries;
2. extract and test reusable AnkiConnect infrastructure;
3. implement interview-question synchronization on that shared adapter;
4. move the English Listening use case in vertical slices while keeping its 43-test baseline green;
5. only then consider shared domain abstractions derived from both use cases.
