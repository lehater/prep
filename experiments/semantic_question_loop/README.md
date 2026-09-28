# Semantic Question Loop experiment

This branch is based on `fix/user-centered-product-flow` and pins the
experimental Harness commit:

`8c7c5c76f3cba43a1af677b36ddb17a01e7846bd`

The experiment does not delete or weaken any Prep artifact. It uses the current
canonical Discovery statement already present in
`docs/vision/problem-space.md`:

`Current user-model gate: PROVISIONAL-FOR-RESEARCH`

and asks whether Harness can turn that known semantic incompleteness into a
routed Core Question instead of allowing downstream work to treat structural
closure as sufficient.

Run:

```bash
python tools/bootstrap_harness.py
python experiments/semantic_question_loop/run.py
```

Expected shape:

```text
Before semantic gap projection: COMPLETE
Problem evidence semantic admission: REJECTED
Generated Question: ... -> DISCOVERY blocks=['prep.problem-evidence']
After Question projection: BLOCKED
EXPERIMENT PASS ...
```

The generated Question is kept in memory. The experiment intentionally does not
modify `.harness/core.yaml`; persistence is a separate decision after the
hypothesis is validated.
