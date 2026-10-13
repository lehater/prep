# Experimental external-study prototype

**Status: preserved technical prototype, not the current Prep interface or an accepted data model.**

This standalone, dependency-free Node.js prototype demonstrates three comparison surfaces against one synthetic fixture:
- `?arm=A` — Goal/Capability/Knowledge browsing without material export;
- `?arm=B` — contextual browsing plus selected theoretical material export (TSV);
- `?arm=C` — flat material selection and export without the contextual navigator.

`/handout.html` provides a neutral source-data view for an external-tools comparison. The application does **not** estimate learner mastery, validate corpus completeness or run external learning systems.

## Run

Requirements: Node.js 20+ and Python 3.

```sh
python experiments/prep_study_loop/check.py
cd experiments/prep_study_loop/prototype
npm test
npm run build
npm run dev
```

Open `http://127.0.0.1:4173/?arm=A` (or `B`/`C`). `npm run preview` serves the built files.

The adjacent `fixture.json`, `check.py`, and `sample-anki.tsv` are required reproducible inputs; `OPERATOR.md` provides controlled-task handling guidance. No npm packages need installation. Generated `dist/` is ignored.

## Research boundary

This code is **kept as executable donor evidence only**. Its original fixture and interactions predate the corrected Goal → CapabilityDescription → Knowledge subject-topology constraint, so they do **not** validate EX-PLD-10, the new integrated interface, or actual user value. The 2026-10-13 independent EX-PLD-11 read-only view study is recorded separately in `docs/research/product-learning-direction/`.

For current decisions use [the research framing](../../../docs/research/product-learning-direction/research-framing.md), [open experiments](../../../docs/research/product-learning-direction/open-experiments.md) and [current findings](../../../docs/research/product-learning-direction/findings.md). Do not treat this example as a production implementation.
