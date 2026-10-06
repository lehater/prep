# PREP Representative Usability Validation

## Purpose

This experiment is the current execution package for representative-user validation
after frontend implementation slices FI-00 through FI-09 were merged.

It does not define Product, Task, Interface or Presentation truth. Current semantic
authority remains in Harness-registered artifacts. Findings from sessions must be routed
to the owning canonical artifact before implementation is changed.

The earlier `experiments/frontend_design_assurance_audit/` package is historical
evidence from the pre-replacement frontend. Its old PV identifiers, legacy view names and
`web/` implementation references must not be used as the current session protocol.

## Prototype baseline

Use a build from PREP `main` at or after:

- FI-09 merge: `d7965013f6589db53999adb22cd01eab0570b4c5`
- PR: #65, `Close FI-09 prototype verification`

The current prototype is intentionally:

- mock-backed and deterministic;
- non-spatial for the task-complete Knowledge path;
- not production UX authority;
- not evidence that representative users understand the model.

## Current evidence state

Automated prototype closure is complete for the current implementation package:

- deterministic frontend fast checks;
- production build and supply-chain checks;
- wide / compact / narrow responsive checks;
- keyboard-only representative flow;
- reduced-motion non-spatial flow;
- composition-variant checks;
- strict Harness semantic/currentness closure.

Human evidence remains open for:

- `PV-06` — preparation-support bootstrap usability;
- `PV-09` — assistive-technology/accessibility evidence not established by automation;
- `PV-11` — related-target purpose comprehension;
- `PV-12` — core mental-model evidence gate;
- production-gate vocabulary/comprehension findings and retest of material fixes.

No production spatial renderer/default is currently selected. Spatial-vs-nonspatial human
comparison is therefore deferred, not silently passed.

## Files

- `protocol.md` — facilitator protocol and scenario order;
- `session-record-template.yaml` — pseudonymous evidence record;
- `related-target-purpose-fixture.yaml` — research stimulus for PV-11;
- `readiness.yaml` — current automated/human gate state.

## Execution rule

Run Round A before showing PREP. Use Round B only after the participant's natural
preparation behavior has been recorded. Do not teach PREP terminology before observing
whether the participant can infer the model.

Do not commit recordings, names, email addresses, employer-specific confidential
material or other direct identifiers. Session records in this directory should use
pseudonymous `USR-*` IDs and evidence references to an appropriately controlled
external store when recordings exist.
