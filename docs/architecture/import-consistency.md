# Import Consistency

## Purpose

Define the consistency, conflict and retry/idempotency semantics required by the currently accepted Prep application and machine operations.

The artifact and CapabilityId retain the historical name `IMPORT-CONSISTENCY` / `prep.import-consistency` for repository compatibility. The current contract does **not** establish a production import subsystem, bulk-import product behavior, a curator workflow, or import-specific domain identity.

## Scope

This contract applies where repeated, concurrent, partial or resumed execution can otherwise change accepted meaning incorrectly:

- owner-scoped acceptance during preparation-support work;
- dependent mutations guarded by a semantic currentness basis;
- activity-attempt completion and capture/evidence continuation;
- supported external-runtime continuation or replay;
- any later machine operation that explicitly adopts this contract.

Read-only projections do not require consistency machinery beyond preserving the accepted semantic basis they report.

## Protected constraints

- A semantic write is accepted only by the Authority that owns the affected meaning.
- Independently accepted owner-scoped preparation results are not rolled back because another candidate remains unresolved or rejected.
- A command whose material target/evidence/focus basis is stale must not silently apply to different meaning.
- Replay of the same semantic operation must not create duplicate accepted effects merely because transport or dependency delivery was repeated.
- A genuinely new learner execution is a new `Performance`; retry/idempotency must never collapse distinct executions into one event.
- Historical facts already accepted as `Performance`/`Observation` are not compensated away merely because later evidence inference is unresolved or rejected.

## Atomicity

Atomicity is owner-scoped.

One accepted mutation of one semantic owner is applied as one logical unit or rejected without a partially accepted form of that mutation.

`APP-PREPARE-SUPPORT` may coordinate several semantic owners. The accepted contract is partial-result semantics, not one global transaction:

- accepted owner-scoped results remain accepted;
- rejected/unresolved candidates remain explicit;
- failure of one owner does not imply rollback of valid peer-owner results.

No cross-owner distributed transaction is established.

## Currentness and conflict

Commands that depend on target/evidence/focus meaning use the accepted semantic basis exposed by the Application/Machine Interface contracts.

If material basis changed before mutation:

- return `STALE_BASIS`;
- preserve the user's pending intent/context where possible;
- require refresh/reconsideration before applying to new meaning.

Concurrent commands that propose incompatible changes to the same owner-controlled meaning must not silently become last-writer-wins. The owning semantic contract decides whether one proposal is rejected, unresolved, or requires a later explicit reconciliation policy.

## Retry and idempotency

Prep defines semantic retry behavior, not transport retry machinery.

- There is no accepted application-level automatic retry policy.
- `DEPENDENCY_UNAVAILABLE` may be retried/continued only while the semantic operation identity and its required basis remain valid.
- Where a command already carries semantic identity such as an activity-attempt reference or preparation-request reference, replay of the same command identity must not fabricate an additional accepted semantic event.
- Technical request/job/delivery identifiers may support realization but never become domain identity.
- If an implementation cannot prove that an incoming operation is a replay rather than a new semantic action, it must not silently deduplicate a potentially distinct learner execution.

## External runtime boundary

A supported external runtime may pause, resume or repeat delivery. Translation into canonical `Performance`/`Observation` remains governed by the Learner Model: attribution, actual conditions, time, provenance and semantic meaning must be preserved.

External provider identifiers may assist correlation inside an adapter. They do not replace Prep semantic identities and do not establish provider-specific domain entities.

## Deliberately not established

This contract does not establish:

- Question/card identity;
- normalized-question-text fingerprints;
- generic semantic fingerprint deduplication;
- bulk import schemas or per-item import outcome taxonomies;
- a production corpus-curation/import subsystem;
- storage uniqueness/index/locking mechanisms;
- queue/job topology;
- automatic retry schedules;
- cross-owner rollback or compensation.

Physical realization belongs to Data Design / Implementation Design where required by this contract.

## Reopening conditions

Revisit this contract if accepted capabilities introduce a real import/synchronization product surface, cross-owner atomic transactions, asynchronous delivery with independent lifecycle, merge/reconciliation semantics, offline synchronization, or new concurrent-write correctness constraints.
