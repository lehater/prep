# ADR-008 — Establish top-level design breadth before deep implementation slices

Status: Accepted

## Context

Early narrow vertical slices validated individual Prep behaviors but repeatedly left adjacent product, domain and architecture concerns undiscovered. For the graph-centered platform direction this creates high rework risk because semantic graph, learning coordination, multiple learning domains, UI overlays and external execution systems constrain one another.

## Decision

For the current platform-design phase, work breadth-first across the full top-level responsibility map before deepening any one implementation slice.

The required top-level surface is represented by the Harness `TOP-LEVEL-DESIGN` consumer:

```text
problem
-> product scope/capabilities
-> strategic context map
-> graph + learning domain boundaries
-> user journeys
-> quality drivers
-> graph-first interface concept
-> black-box system landscape
```

Detailed component, persistence, API, deployment, test and implementation design begins only after this broad model is coherent enough that downstream work is not inventing missing upstream decisions.

## Consequences

- Design tasks prefer horizontal coverage and explicit open questions over premature implementation detail.
- Existing working slices remain evidence and are not discarded.
- Once top-level closure is stable, implementation may again proceed in small coherent slices inside the established boundaries.
- Harness capability closure is structural guidance, not proof that document semantics are correct.
