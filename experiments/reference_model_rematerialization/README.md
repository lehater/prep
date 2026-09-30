# PREP Reference Model Rematerialization

This experiment starts from PREP commit `ac9d97af3357663207d7c063c415a84327ab71f7`
and frozen Harness Reference Model commit
`b172fd1c7519f88454d2135c1435dd0e45dbb403`.

## Independence boundary

The Project Facts and first materialization are derived only from project-owned canonical
knowledge. Existing `.harness/**` topology/state is excluded from the NEW materialization
input. OLD Harness files may be inspected only after the NEW graph has been materialized,
for A/B comparison.

## First-pass rule

Reference Model v0 is frozen for the first run. Any inability to express accepted PREP
semantics is recorded as a counterexample/model gap rather than repaired during materialization.
