# Scope

## In scope now

### Interview Preparation

- target-role and competency modeling;
- concept/question taxonomy;
- canonical question banks;
- baseline assessment;
- retrieval/spaced practice through adapters;
- gap detection and targeted learning actions;
- future import of review/attempt evidence.

### English Listening

- staged migration of the proven legacy pipeline;
- source/media provenance;
- lexical target selection;
- ASR/alignment;
- stable listening segments;
- normalized audio materialization;
- Anki delivery through shared infrastructure.

### Shared platform/harness

- repository-centered project memory;
- DDD bounded-context boundaries;
- Clean/Hexagonal dependency rules;
- reusable technical adapters only when domain-independent;
- plans, research, ADRs, CI, validation, migration rules.

## Explicitly out of scope for now

- a generic LMS;
- universal `LearningItem`, `Exercise`, `Mastery`, or `Course` domain models;
- web/mobile UI before core workflows are proven;
- generalized plugin architecture for arbitrary learning domains;
- replacing Anki scheduling;
- automatic destructive reconciliation of user review history;
- bulk content generation before authoring/assessment semantics are validated.

## Expansion rule

A capability enters scope when at least one bounded context has a concrete end-to-end need for it.

A capability becomes shared only when two or more contexts demonstrate equivalent semantics, not merely similar field names or tool usage.
