# Frontend Engineering Policy

## Purpose

Define project-wide frontend engineering obligations that must remain stable across feature slices and implementation agents.

This policy does not own product, domain, interface or architecture semantics. It constrains how accepted Prep frontend knowledge is realized in code.

## Applicability

This policy applies to:

- frontend System Architecture refinements;
- frontend Component Design;
- reusable presentation/provider realization;
- frontend Implementation Design;
- production frontend code and structurally significant prototype code intended for reuse.

Pure throwaway visual experiments may use narrower local structure only when their code is explicitly noncanonical and is not promoted into production without revalidation.

## Core obligations

### Explicit ownership and high cohesion

- Every public module/component/port must have one coherent responsibility and an identifiable owner.
- Shared modules must not become catch-all locations for unrelated feature behavior.
- Feature-owned mutable state remains with the owning feature unless multiple architectural consumers require a shared lifetime.

Rationale: shared ownership and low-cohesion utility layers make later change and provider replacement ambiguous.

### Reviewable dependency direction

- Source dependencies must follow accepted frontend architecture.
- Feature modules depend on frontend-owned contracts, not concrete transport or renderer implementations.
- Learning and Curation may share stable frontend models/presentation assets but must not depend on each other's feature internals.
- Dependency rules that protect architectural boundaries should be mechanically enforceable when implementation tooling permits it.

### Consumer-owned contracts and dependency inversion

- Introduce a port/abstraction when it isolates an accepted external/provider dependency, supports a known substitution requirement, or protects a meaningful architectural boundary.
- Shape the contract from consumer needs rather than mirroring the provider API.
- Do not introduce interfaces/wrappers around every concrete dependency merely to satisfy DIP ceremonially.

### Composition and substitutability

- Prefer composition when behavior is assembled from independent responsibilities.
- Use inheritance only when a real substitutable subtype relationship exists and its behavioral contract is stable.
- Do not use inheritance primarily for code reuse.

### Evidence-based reuse

Promote code into a reusable/public component only when at least one is true:

- multiple current consumers need the same stable responsibility;
- it represents a repeated accepted presentation/product pattern;
- it isolates a meaningful replaceable dependency;
- independent evolution behind a stable contract is already expected.

Do not build speculative generic frameworks for hypothetical future reuse.

### Provider isolation

External UI/rendering/framework providers are implementation dependencies, not owners of Prep presentation semantics.

- Public feature contracts and shared product-pattern contracts must not expose provider-specific types when doing so would couple multiple features to the provider.
- Provider primitives may be used locally inside provider/presentation implementation where no stable project contract is created.
- Do not create one-to-one wrappers for every provider primitive.
- Replacement of a UI provider should primarily affect provider mapping/theme/presentation implementation rather than product semantics, machine contracts or feature data models.
- Concrete provider selection/version is recorded by downstream Component/Implementation Design when selected.

### Styling and presentation consistency

Cross-feature visual decisions must be expressed through shared presentation roles/patterns rather than independently re-invented in each feature.

When implementation selects a concrete provider/theme mechanism:

- shared semantic color, typography, spacing, density, surface, focus and feedback roles should map through a centralized theme/token boundary when those roles are reused;
- provider-specific theme/token names must not become product/domain semantics;
- local one-off layout values may remain local when they do not create a reusable presentation rule;
- feature code must not introduce competing global theme systems.

Exact palette, font family, spacing values and provider token syntax remain downstream until accepted Presentation System/Implementation Design selects them.

### Mock-first substitutability

- Frontend features must be executable against deterministic mock adapters before backend transport exists.
- Mock and future transport adapters implement the same consumer-owned semantic ports.
- Feature behavior, view models and tests must not branch on adapter kind.
- Mock fixture shapes cannot become product/domain contracts merely because they are convenient.

### Representation boundaries

- Transport DTOs terminate at transport adapters; mock adapters implement the same consumer-owned ports without becoming a second semantic contract.
- Renderer/library objects terminate at renderer adapters.
- Frontend semantic/read models preserve canonical Prep identity and accepted distinctions without becoming a duplicate domain model.
- Mapping code is explicit at representation boundaries rather than distributed implicitly across views.

### State discipline

- No global mutable store by default.
- State is promoted to a wider owner only when its lifecycle is shared by multiple architectural consumers.
- Canonical domain/application truth remains outside frontend presentation state and is consumed through accepted ports; the current mock realization is not canonical truth.
- Renderer geometry/camera/physics state remains presentation state.

### Error handling discipline

- Preserve accepted failure/outcome distinctions across boundaries; do not collapse validation, conflict, unavailability and unexpected operational faults into one generic success/failure shape.
- Provider/transport-specific exceptions or error payloads terminate at their adapters and are translated into frontend-owned outcomes before reaching feature contracts.
- Recoverable failures must retain enough context for the accepted retry/correction path; do not silently discard user input or current task context.
- Do not swallow unexpected failures to keep the UI apparently successful. Surface them through the owning feature's failure state and preserve diagnostic context for downstream operability when such evidence is available.
- Shared error helpers may normalize representation, but they must not become owners of product/domain failure semantics.

### Performance degradation preserves semantics

The accepted graph quality contract is normative for production realization.

- visible graph work is bounded; the frontend must not require rendering the full canonical corpus merely because the backend can store it;
- Auto / Quality / Performance are presentation profiles, not domain/application state;
- user-visible degradation may reduce labels, arrowheads, decorative particles, pixel ratio, node detail or live-physics work only while canonical Knowledge identity, KnowledgeProposition predicate/direction, current semantic scope, selection/focus and readable list/search/detail access remain intact;
- relational proposition direction/predicate may not become unknowable merely because arrowheads or another visual encoding are disabled;
- renderer optimization mechanics such as instancing, batching, buffer layout and shader/object choices stay inside the renderer adapter;
- the renderer must become demand-driven when idle rather than consuming continuous RAF/CPU solely to preserve a static scene;
- performance evidence must use representative hardware-accelerated 1k/2k/5k stress workloads; headless tests may verify semantics/configuration but must not claim GPU/frame-rate performance;
- developer diagnostics may expose RAF/FPS, settle time, draw calls, triangles, buffer size and pixel ratio as engineering evidence without becoming product semantics.

### Testability

- Prefer public/consumer-owned contracts and observable behavior as test boundaries.
- Private implementation structure is not a test oracle by default.
- Replaceable adapters should be testable against the same consumer-facing contract where that contract has multiple implementations.

### Tiered CI validation

CI separates fast feedback from expensive release-grade evidence.

**Fast validation** is the default development loop and must be independently runnable. It contains deterministic checks whose feedback is useful on ordinary branch pushes: frontend typecheck/lint/boundary/unit checks and lightweight Harness/document closure checks.

**Heavy validation** is reserved for explicit end-of-branch/full-validation checkpoints and is manually dispatched on the branch being finalized. It may include full Harness revalidation, browser E2E, dependency audit, graph stress evidence, production build/container verification and maintained reference-suite execution.

Rules:

- expensive browser/performance/container jobs must not run automatically on every ordinary feature-branch push;
- fast and heavy workflows remain separately dispatchable;
- heavy validation runs fast deterministic checks first so failure is reported before expensive stages;
- a green fast path is development feedback, not a substitute for required heavy evidence before a large branch is considered fully validated;
- run the final heavy workflow manually on a large branch before treating that branch as fully validated; ordinary pushes, PR updates and main pushes do not trigger it implicitly.

## Explicit non-rules

This policy does **not** require:

- one wrapper for every MUI/provider primitive;
- a custom UI framework;
- one class/interface per component;
- inheritance-free code;
- a global state library;
- generic repositories;
- CQRS, mediator/event-bus patterns or dependency-injection frameworks;
- abstraction before a concrete current need exists;
- reuse of old experimental code merely because it already works.

KISS and YAGNI take precedence over ceremonial abstraction.

## Reusable frontend presentation contracts

Project-wide reusable presentation code should be created around stable repeated patterns, not vendor widgets.

Current justified reusable pattern families include:

- application/shell framing and mode context;
- collection search/filter controls used across reusable-data catalogues;
- entity/detail presentation framing;
- loading/empty/failure feedback states;
- form completion/cancel/action framing;
- confirmation for destructive or irreversible user actions when such actions are accepted;
- consistent focus/accessibility treatment.

These describe project responsibilities. Exact component names, props and provider composition remain Component/Implementation Design decisions.

## Provider replacement acceptance

A future UI-provider replacement is considered structurally healthy when it does not require changes to:

- Product Requirements;
- Domain/Application semantics;
- Machine Interface contracts;
- frontend semantic/read models;
- feature-owned query/command ports;
- Screen/View meaning.

Changes to provider mapping, theme, reusable presentation implementation and rendered verification evidence are expected.

## Harness semantic acceptance

This policy satisfies the reusable Engineering Policy intent:

- **policy-not-product-domain-owner** — it constrains realization without redefining Prep semantics;
- **obligations-concrete-and-reviewable** — obligations are stated as inspectable dependency, ownership, provider, reuse, state and representation rules;
- **optional-patterns-not-defaults** — abstractions/patterns require current evidence, and explicit non-rules prevent SOLID/provider isolation from becoming ceremonial layers.
