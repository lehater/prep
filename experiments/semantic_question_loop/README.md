# Semantic Question Loop experiment

Base: `fix/user-centered-product-flow`.

Harness experiment ref:

`experiment/semantic-question-loop`

The experiment uses the current Prep canonical data without deleting or
weakening it.

It checks three things:

1. Prep is structurally `COMPLETE` before semantic-gap projection.
2. The existing canonical Discovery state
   `PROVISIONAL-FOR-RESEARCH` becomes a blocking Question to `DISCOVERY`.
3. The current real `task-model.yaml` passes the reusable Task Model
   completeness contract, while removing one task's recovery semantics in
   memory is detected and routed to `APPLICATION-DESIGN`.

Run:

```bash
python tools/bootstrap_harness.py
python experiments/semantic_question_loop/run.py
```

The experiment intentionally tracks the Harness experiment branch rather than a
mainline SHA. No generated Question is persisted into `.harness/core.yaml`; the branch tests
the projection and routing mechanism first.
