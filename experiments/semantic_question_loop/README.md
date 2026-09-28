# Semantic Question Loop experiment

Base: `fix/user-centered-product-flow`.

Harness pin:

`5aae5b14b6477bdb92e2564ae8d33b477d28e0f1`

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

No generated Question is persisted into `.harness/core.yaml`; the branch tests
the projection and routing mechanism first.
