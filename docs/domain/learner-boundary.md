# Learner and Personal State boundary

## Responsibility

Separate reusable/shared semantic knowledge from learner-specific plans, evidence and presentation state.

## Learner identity

`LearnerId` identifies the owner of learning intent/evidence inside Prep.

Authentication/account/provider identity is a later interface/security concern. Do not bake a specific identity provider into the learning domain.

The initial product may have one practical user, but the domain model must not require global singleton learner state.

## Learner-owned state

At minimum:

- LearningPlans;
- review/attempt evidence and derived learner state;
- saved views/selections when personal;
- runtime/device bindings needed to reconcile observations;
- learner preferences when they affect learning behavior.

## Shared state

Canonical Knowledge Graph nodes/relations/classification/evidence are not learner-owned merely because a learner studies them.

Reusable curricula may also be shared independently of learner progress.

## Device/runtime boundary

A learner may study through multiple devices or execution runtimes.

```text
Learner
  -> many RuntimeBindings
  -> evidence streams
  -> one reconciled learner-state projection
```

Device identity is evidence provenance, not a separate learner.

## Privacy invariant

Personal learning evidence and plans must be separable from globally reusable semantic knowledge. Publishing or sharing knowledge cannot implicitly publish personal learning history.

Authorization, retention and export/delete policy are later security/product design, but this separation is a top-level architectural constraint.
