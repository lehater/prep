# ADR-007 — Use the pinned universal Harness for engineering-knowledge control

Status: Accepted

## Context

`prep` already had a local agent-harness baseline describing one-agent operation and context minimization. A separate `lehater/harness` project now provides repository-independent Authority/Capability/Consumer semantics and has been exercised by other repositories such as NAPMS.

Maintaining a second Prep-specific evaluator would duplicate engineering-control semantics and diverge from the reusable Harness.

## Decision

- Pin one immutable `lehater/harness` commit in `.harness-version`.
- Use Harness Integration Contract v0.
- Because Prep has no independent canonical machine-readable artifact graph, integrate through direct declaration in `.harness/engineering-graph.yaml` and `.harness/core.yaml`.
- Keep Prep product/domain/architecture documents authoritative; Harness owns structural evaluation only.
- Keep the existing single-chat-agent operating decision from ADR-006; it is complementary to, not replaced by, Harness engineering-knowledge control.
- Add project-owned validation that evaluates the `TOP-LEVEL-DESIGN` consumer through the pinned Harness runtime.

## Consequences

- General Harness evaluator behavior is changed in `lehater/harness`, then adopted by updating the immutable pin.
- Prep owns only its Authority/Capability topology, artifact bindings and project-specific assertions.
- `.harness-tool/` is a disposable local checkout and never canonical project state.
- A future Prep canonical artifact graph may replace direct declaration with an adapter projection without changing Harness semantics.
