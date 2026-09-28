# Prep Harness Scenario Suite experiment

This branch consumes the Harness `experiment/scenario-suite` protocol as a
target repository.

Prep owns:

- its scenario catalog;
- real-project scenarios;
- the project-native semantic projection driver.

Harness owns only the generic runner, invariant oracles and built-in drivers.

Run locally after bootstrapping the Harness checkout:

```bash
python tools/bootstrap_harness.py
PYTHONPATH=. HARNESS_ROOT=.harness-tool \
  python .harness-tool/scenario_suite.py \
  experiments/harness_scenarios/scenarios \
  --catalog experiments/harness_scenarios/catalog.yaml \
  --driver-module experiments.harness_scenarios.drivers
```

The initial pool deliberately uses current Prep data:

1. structural `FRONTEND-IMPLEMENTATION` closure;
2. the existing `PROVISIONAL-FOR-RESEARCH` Discovery gap;
3. the current 19-task Task Model;
4. an in-memory mutation removing recovery semantics from one real task.

No scenario mutates Prep canonical files.
