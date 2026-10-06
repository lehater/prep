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
- Task features may share stable presentation primitives and semantic value types, but must not depend on another task feature's private mutable state or provider-specific representation.
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

The accepted Quality Design contract is normative; a graph or specific renderer is conditional presentation realization.

- the frontend must not require rendering the full canonical Knowledge corpus merely because a provider can store or return it;
- bounded working sets, filtering, progressive disclosure, virtualization or reduced spatial richness may be used only while canonical Knowledge identity, relation meaning, selected semantic scope and task-complete query/result/detail access remain intact;
- if a spatial renderer is present, its optimization mechanics and diagnostics remain inside the renderer/provider boundary;
- renderer-specific settings, profiles, geometry and frame metrics are engineering/presentation state, not product/domain state;
- no 1k/2k/5k item target, FPS threshold, 2D/3D requirement or named rendering profile is normative until Quality Design accepts a representative workload/measurement boundary;
- headless/structural tests may verify semantic preservation and configuration but must not claim browser/GPU performance evidence.

### Testability

- Prefer public/consumer-owned contracts and observable behavior as test boundaries.
- Private implementation structure is not a test oracle by default.
- Replaceable adapters should be testable against the same consumer-facing contract where that contract has multiple implementations.

### Tiered CI validation

CI separates required pull-request feedback from broader regression evidence.

**Required PR fast validation** is the ordinary merge gate. The current Prep baseline runs the
frontend fast suite and repository fast suite on every pull request, in parallel.

The fast suites are intentionally always-on rather than selected by changed paths while their
measured cost remains small. At the time of this decision the representative GitHub-hosted
runner times are approximately 16 seconds for frontend fast validation and 13 seconds for
repository fast validation. Adding a change-classification runner and a final aggregation gate
saved only a few runner-seconds on single-area changes while increasing orchestration,
critical-path latency and the risk of maintaining a second dependency model in workflow YAML.

Rules:

- required fast checks run once per pull-request revision; the same suite must not also be
  triggered independently by the corresponding feature-branch push;
- frontend and repository fast checks run in parallel and remain directly understandable as
  merge-gate evidence;
- required fast checks do not use path filtering while they remain cheap enough to run
  unconditionally;
- isolated workloads whose ownership boundary is explicit may use changed-path detection
  inside an always-present required job; this preserves a stable merge-gate status while
  avoiding their cost on unrelated changes;
- unknown or cross-cutting changes must prefer broader validation rather than skipping a
  potentially relevant required check;
- concurrency cancels superseded work for the same pull request where a workflow can overlap.

**Heavy validation** proves broader integrated repository health. It runs after integration to
`main`, on a periodic schedule, and remains manually dispatchable for diagnosis or explicit
pre-merge investigation. It may include full Harness revalidation, browser E2E, dependency
audit, production build checks and maintained reference/experiment suites.

Heavy validation is not duplicated on every pull-request revision unless a future risk or
release process requires it. A green PR fast path is merge-gate evidence; the post-merge heavy
run verifies the resulting integrated `main` state, and the periodic run protects rarely
changed surfaces from silent decay.

**Environment reuse and caching** optimize setup cost without replacing verification:

- dependency/download caches may be reused when keyed by reproducible inputs;
- build artifacts may be reused when downstream jobs need the exact same built output;
- a previous successful test result is not treated as proof for a new revision;
- prefer reducing setup work before introducing persistent/custom runners;
- for Playwright headless E2E, install only the required browser payload when the hosted runner
  already supplies the necessary system libraries.

**Dependency-aware test selection is an evolution step, not the current default.** Revisit it
when measured required-fast cost becomes materially larger than orchestration overhead—for
example, when one ordinarily skippable suite consistently approaches a minute or the aggregate
required fast validation grows into multiple runner-minutes. At that point selection should be
derived from an authoritative project dependency/capability model where possible, with a
conservative fallback that runs all relevant suites for unknown paths. Do not create a
hand-maintained workflow dependency graph merely to save a few seconds.

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

Project-wide reusable presentation code should be created around stable repeated accepted patterns, not vendor widgets or backend-resource shapes.

Reuse should follow the current Presentation System and Screen/View Design, especially where the same responsibility recurs across views: context continuity, outcome/failure presentation, evidence-basis detail, query/result/detail behavior, action hierarchy, responsive disclosure and accessibility/focus treatment.

Do not predeclare generic catalogue, CRUD, editor, dashboard or modal frameworks unless current accepted views repeatedly require them. Exact component names, props and provider composition remain Component/Implementation Design decisions.

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
