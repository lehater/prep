# VIEW-KNOWLEDGE UI Design Convergence Experiment

This experiment applies the pinned Harness UI Design Convergence evaluator to the current accepted Prep `VIEW-KNOWLEDGE` slice.

It is evidence, not canonical Product/Task/Interface truth.

Expected result:

- semantic/task coverage is structurally closed for the examined slice;
- executable prototype evidence exists;
- `KD-01`, `KD-04` and `KD-05` are determined at the declared level;
- `KD-02` and `KD-03` remain blocked on representative-user E3 evidence;
- therefore `UI DESIGN READY` for production is false.

Run after materializing the pinned Consumer Pack:

```bash
PACK="$(python .harness/harnessw.py sync)"
python experiments/ui_design_convergence/evaluate.py "$PACK"
```

The expected `NOT_READY` result is a successful experiment outcome. It means the evaluator stops at the known empirical boundary instead of converting prototype preference into production authority.
