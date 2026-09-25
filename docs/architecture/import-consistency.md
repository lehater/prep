# Import Consistency

## Scope

Define the minimum correctness semantics required by repeated and partially successful prepared-data imports.

## Protected constraints

- repeated delivery of one logical import unit must not create duplicate canonical objects;
- valid peer items survive rejection of invalid items;
- unresolved references cannot be accepted as valid relationships or alignments;
- canonical domain invariants remain authoritative.

## Atomicity

The bulk container is not an atomic transaction. Each item is an independent application unit.

An individual item is applied atomically: it is accepted as one unit or rejected without leaving a partially applied form of that item.

## Idempotency

Item identity is resolved in priority order:

1. explicit canonical Prep ID;
2. stable producer/import key;
3. deterministic technical fingerprint fallback.

Repeated delivery resolving to the same canonical/import identity reconciles with the existing unit rather than creating another logical object.

A stable import key survives content correction. A fingerprint does not: changing identity-bearing content changes the fingerprint and may create a new unit.

## Technical fingerprints

Fingerprints are technical duplicate guards, not semantic comparison.

They derive from versioned deterministic canonicalization of identity-bearing representation fields followed by a stable hash algorithm.

For Question fallback identity, normalized question text is sufficient for the current contract. Unicode normalization, leading/trailing whitespace removal and whitespace normalization are permitted. Case folding, punctuation removal, stemming, embeddings, LLM similarity or fuzzy transformations are not implied.

The fingerprint algorithm/canonicalization version must be recoverable when changing it could alter duplicate recognition.

## Concurrent and repeated import

Two executions attempting to create the same resolved import identity must not both create canonical duplicates. Downstream persistence/architecture must provide atomic uniqueness at that technical identity boundary.

If two executions target the same stable identity with different content, silent last-writer-wins is not accepted. The operation surfaces a conflict unless a later reconciliation/version rule explicitly replaces this policy.

## Outcome accounting

Every accepted bulk request accounts for each item as created, updated, duplicate-skipped or rejected. Counts reconcile with received items.

Rejected items retain a machine-visible reason and item reference sufficient for correction and retry.

## Reopening conditions

Revisit this contract if imports gain cross-item transactions, asynchronous delivery, accepted merge semantics for concurrent writers, semantic deduplication, or source synchronization beyond repeated prepared-data import.
