# Application Process — Activity Evidence Cycle

## Purpose

Define one bounded occurrence that coordinates selected preparation support, an actual learning/practice/diagnostic attempt, capture of attributable facts, evidence evaluation and review of resulting change.

The process references accepted Application operations; it does not redefine those operations, domain evidence meaning, runtime transport or UI flow.

## Boundary with learning progression

This process is an evidence-oriented Application Process occurrence, not the canonical pedagogical learning progression.

Learning Design may justify adaptive guidance, feedback/correction, repetition, delay, condition variation, or other progression before or between evidence-bearing performances. Those choices do not become mandatory steps of this process.

A selected support/runtime may realize multiple instructional interactions. Materially distinct learner executions remain distinct historical Performance semantics and must not be collapsed merely because they occurred within one instructional session. How multiple such performances are grouped or correlated by Application Design remains downstream of the Learning Design semantics.

## Occurrence boundary

One occurrence starts when an active target/focus exists and the learner requests support for that focus.

It ends when the resulting activity/evidence outcome has been reviewed against the current semantic basis, including valid no-change, unresolved or challenged outcomes.

Target establishment, general Knowledge exploration and later repeated preparation cycles are outside this occurrence.

## Referenced work

The occurrence references:

- `APP-SELECT-SUPPORT`;
- `APP-PERFORM-ACTIVITY`;
- `APP-CAPTURE-PERFORMANCE`;
- `APP-EVALUATE-EVIDENCE`;
- `APP-REVIEW-CHANGE`.

Missing support may branch to `prep.application-process.prepare-support`; that neighboring process remains independently bounded.

## Composition

Material enabling constraints are:

1. suitable selected support enables one activity attempt;
2. actual attributable activity facts enable Performance/Observation capture;
3. accepted attributable Observations enable evidence evaluation;
4. completed evidence evaluation enables change review.

The contract is a semantic partial order, not a transport sequence. It does not require synchronous execution, prohibit instructional interactions that are not evidence-process steps, or prescribe the internal learning progression of selected support.

## Continuation and correlation

If execution pauses or moves to an external runtime, continuation is permitted only for the same semantic activity attempt and a still-valid target/focus basis.

Correlation is semantic: selected support + attempt context + semantic basis. Broker ids, HTTP ids, queue ids and workflow-engine tokens are not canonical process meaning.

If the basis becomes materially stale before a dependent continuation, the occurrence does not silently continue against changed meaning; it refreshes/reconsiders or terminates with the corresponding application outcome.

## Recovery

`DEPENDENCY_UNAVAILABLE` may suspend the occurrence while the same attempt/basis remains usable. `UNRESOLVED` or `REJECTED` evidence inference does not roll back historical Performance/Observations and does not fabricate capability progress.

There is no process-level automatic retry or compensation of accepted historical evidence.

## Progress

No independent ProcessState is required. Progress is derivable from accepted operation outcomes and the attributable activity-attempt context.

## Completion

The occurrence completes when `APP-REVIEW-CHANGE` produces an inspectable result for the attempt's evidence/target basis and the learner can choose a continuation.

Completion does not require positive capability change. Valid completion includes no change, increased uncertainty, challenged evidence or an unresolved inference, provided the result is explicit and reviewable.
