# Python Asynchronous Programming — Topic Blueprint

Date: 2026-09-17
Status: candidate topic design; human review required before card generation

## 1. Topic intent

This topic is **asynchronous programming as implemented and used in Python**, not a catalogue of the `asyncio` module.

The learner should leave the topic able to answer four classes of questions:

1. **mental model** — what asynchronous/concurrent execution means and when it helps;
2. **Python semantics** — what `async def`, coroutine objects, `await`, `async for`, `async with`, Tasks and Futures actually mean;
3. **runtime reasoning** — how the event loop schedules work, how cancellation/failure/backpressure behave, and why apparently valid async code can fail;
4. **backend engineering** — how to compose concurrent operations, bound concurrency, integrate blocking code, manage resources and diagnose production-style problems.

Primary target: practical Python backend interview / engineering competence.

Version baseline: Python **3.10–3.14**. Version-specific behavior is called out explicitly.

## 2. Boundary

### In scope

```text
Asynchronous programming concepts
  + Python coroutine language model
  + asyncio event-loop/runtime model
  + Task/Future lifecycle
  + structured concurrency
  + cancellation/timeouts/failure propagation
  + synchronization and logical races
  + queues / flow control / backpressure
  + blocking-code boundaries
  + threads/processes/GIL interaction
  + high-level async network streams
  + debugging / observability / performance failure modes
  + important version evolution 3.10–3.14
```

### Deliberately not the core of this topic

- FastAPI/Starlette/ASGI-specific request lifecycle;
- AnyIO/Trio API details;
- third-party HTTP/database clients;
- `uvloop` internals;
- deep OS kernel implementation details (`epoll`, `kqueue`, IOCP) beyond the conceptual boundary needed to understand event loops;
- complete low-level `asyncio` transports/protocols API;
- distributed-system retries/idempotency except where used as an async example.

These may become adjacent topics or extension cards.

## 3. Structural model

The topic should not be represented as one hierarchy of API names. It has three complementary layers:

```text
Layer A — concepts
  concurrency, suspension, backpressure, cancellation, ownership, race condition...

Layer B — Python language/runtime mechanisms
  coroutine, awaitable, Task, Future, event loop, async iterator...

Layer C — engineering patterns/problems
  fan-out/fan-in, bounded concurrency, producer-consumer,
  blocking boundary, graceful cleanup, diagnostics...
```

A card may connect all three. Example:

```text
Concept: cooperative scheduling
Mechanism: asyncio.Task + await
Problem: blocking synchronous call freezes unrelated requests
Interaction: diagnose code
```

This avoids the false model `asyncio API method = one knowledge unit`.

## 4. Concept map

```text
Python asynchronous programming
│
├── 1. Mental model of asynchronous concurrency
│   ├── synchronous vs asynchronous
│   ├── blocking vs non-blocking
│   ├── concurrency vs parallelism
│   ├── I/O-bound vs CPU-bound
│   ├── cooperative scheduling
│   └── suspension / resumption points
│
├── 2. Python coroutine language model
│   ├── coroutine function (`async def`)
│   ├── coroutine object
│   ├── awaitable / `__await__`
│   ├── `await`
│   ├── asynchronous context manager (`async with`)
│   ├── asynchronous iterator (`async for`)
│   ├── asynchronous generator
│   └── asynchronous comprehension
│
├── 3. asyncio runtime model
│   ├── event loop
│   ├── runner (`asyncio.run`, `asyncio.Runner`)
│   ├── Task
│   ├── Future
│   ├── task scheduling / yield points
│   ├── task ownership / lifetime
│   └── task-local context (`contextvars`)
│
├── 4. Concurrency composition
│   ├── sequential await
│   ├── explicit Task creation
│   ├── `gather`
│   ├── `TaskGroup`
│   ├── structured concurrency
│   ├── fan-out / fan-in
│   └── background-task ownership
│
├── 5. Cancellation, timeout and failure
│   ├── `Task.cancel()` / `CancelledError`
│   ├── cancellation propagation
│   ├── cleanup with `try/finally`
│   ├── `timeout` / `wait_for`
│   ├── `shield`
│   ├── sibling cancellation in `TaskGroup`
│   └── `ExceptionGroup` / `except*`
│
├── 6. Shared state, synchronization and pressure
│   ├── logical race conditions across `await`
│   ├── Lock
│   ├── Event / Condition
│   ├── Semaphore / bounded concurrency
│   ├── Queue / producer-consumer
│   ├── bounded queue backpressure
│   └── stream flow control / `drain`
│
├── 7. Blocking and concurrency boundaries
│   ├── blocking synchronous calls
│   ├── `asyncio.to_thread`
│   ├── `run_in_executor`
│   ├── ThreadPool vs ProcessPool
│   ├── GIL / CPU-bound work
│   └── scheduling from other threads
│
├── 8. I/O and resource lifecycle
│   ├── Streams: reader/writer
│   ├── connection lifecycle
│   ├── regular-file limitation
│   ├── subprocesses
│   └── platform/event-loop implementation differences
│
└── 9. Diagnostics and performance
    ├── coroutine never awaited
    ├── Task exception never retrieved
    ├── debug mode / slow callbacks
    ├── task introspection
    ├── unbounded task creation
    ├── eager task execution
    └── version-sensitive API evolution
```

## 5. Pedagogical strategy

Do not generate all QuestionTypes for each concept. Select the interaction that exposes the important misunderstanding.

### Conceptual foundations

Prefer:

```text
explain -> compare -> scenario
```

### Scheduling semantics

Prefer:

```text
worked trace -> predict -> diagnose
```

### Programming mechanics

Prefer:

```text
worked example -> faded completion -> independent repair/write
```

### Engineering decisions

Prefer:

```text
scenario -> choose/justify -> design
```

### Failure semantics

Prefer diagnosis over definition recall:

```text
broken code / warning / timeout / race
  -> explain cause
  -> repair while preserving required semantics
```

This follows the existing project research: retrieval plus application/diagnosis, structured feedback, programming-specific tracing/explaining/writing, and guidance fading rather than recognition-only cards.

## 6. Core learning-object plan — 36 cards

The first usable bank should target **36 core learning objects**. This is intentionally smaller than the full Concept Map. Extension material can be added after real use.

Legend:

- `DR` = direct-recall
- `EX` = explain
- `CP` = compare
- `SA` = scenario-apply
- `PR` = predict / trace
- `DG` = diagnose
- `CJ` = choose-justify
- `DS` = design

### Module 1 — Mental model (4)

| # | Focus | LearningTask / type | Planned interaction |
|---|---|---|---|
| M01 | async vs sync; blocking vs non-blocking; concurrency vs parallelism | compare / `CP` | classify and contrast terms using one backend example |
| M02 | I/O-bound vs CPU-bound and when `asyncio` helps | explain / `EX` | explain why waiting on network I/O is different from CPU work |
| M03 | cooperative scheduling and suspension points | explain / `EX` | explain when another Task can run and why `await` is central |
| M04 | event-loop starvation by blocking synchronous code | analyze / `DG` | diagnose `time.sleep()` / blocking library call inside coroutine |

### Module 2 — Python coroutine language model (6)

| # | Focus | LearningTask / type | Planned interaction |
|---|---|---|---|
| L01 | `async def`: coroutine function vs coroutine object | explain / `EX` | explain what calling an async function returns and what has not happened yet |
| L02 | awaitable model: coroutine, Task, Future, `__await__` | compare / `CP` | distinguish the three common awaitable forms |
| L03 | `await` does not mean “always switch tasks immediately” | analyze / `PR` | trace code where awaited operation is already complete vs suspends |
| L04 | asynchronous context manager | explain / `EX` | expand `async with` conceptually into `__aenter__` / `__aexit__` awaits |
| L05 | asynchronous iterator / `async for` | analyze / `PR` | trace `__aiter__` / `__anext__` and `StopAsyncIteration` |
| L06 | async generator + asynchronous comprehension | apply / `SA` | choose/use async iteration for streamed values rather than materializing them eagerly |

### Module 3 — asyncio runtime and task model (4)

| # | Focus | LearningTask / type | Planned interaction |
|---|---|---|---|
| R01 | event loop responsibility | explain / `EX` | explain scheduling/readiness role without treating the loop as a CPU worker pool |
| R02 | `asyncio.run()` / `Runner` lifecycle | apply / `SA` | choose correct top-level entry point; diagnose nested `asyncio.run()` |
| R03 | coroutine vs Task vs Future | compare / `CP` | map each object to execution/scheduling/result responsibility |
| R04 | `create_task()`: scheduling, ownership and lifetime | analyze / `DG` | diagnose orphan/background Task and missing strong ownership/exception handling |

### Module 4 — composing concurrency (5)

| # | Focus | LearningTask / type | Planned interaction |
|---|---|---|---|
| C01 | sequential awaits vs concurrent Tasks | analyze / `PR` | predict timeline of two I/O operations in sequential and concurrent versions |
| C02 | `asyncio.gather()` result and failure semantics | apply / `SA` | reason about result ordering and an exception in one child |
| C03 | `TaskGroup` and structured lifetime | explain / `EX` | explain why leaving the context waits for children and owns their lifetime |
| C04 | `gather()` vs `TaskGroup` | evaluate / `CJ` | choose between them for independent aggregation vs structured failure handling |
| C05 | background-task ownership (“fire-and-forget”) | analyze / `DG` | diagnose lost exception / lifetime problem and propose explicit ownership |

### Module 5 — cancellation, timeouts and failure (5)

| # | Focus | LearningTask / type | Planned interaction |
|---|---|---|---|
| E01 | cancellation semantics / `CancelledError` | explain / `EX` | explain cancellation request and delivery at a suspension opportunity |
| E02 | cleanup and swallowed cancellation | analyze / `DG` | repair `except CancelledError` code using cleanup + propagation |
| E03 | `TaskGroup` child failure, sibling cancellation, `ExceptionGroup` | analyze / `PR` | predict what happens when one child fails |
| E04 | timeout boundary: `asyncio.timeout()` vs `wait_for()` | compare / `CP` | choose a timeout shape for a multi-step operation |
| E05 | `shield()` and cancellation boundaries | evaluate / `CJ` | decide whether shielding actually preserves the intended operation semantics |

### Module 6 — races, synchronization and backpressure (5)

| # | Focus | LearningTask / type | Planned interaction |
|---|---|---|---|
| S01 | logical race condition in single-threaded async code | analyze / `DG` | diagnose read/await/write lost-update style interleaving |
| S02 | `asyncio.Lock` and critical-section boundaries | apply / `SA` | place synchronization around the invariant rather than around arbitrary code |
| S03 | Semaphore and bounded concurrency | design / `DS` | limit simultaneous outbound requests / DB operations |
| S04 | Queue producer-consumer and bounded backlog | design / `DS` | design worker pipeline with `Queue(maxsize=...)`, `task_done`, `join` |
| S05 | flow control / backpressure via `StreamWriter.drain()` | explain / `EX` | explain why writes need flow-control cooperation |

### Module 7 — blocking code, threads, processes, GIL (4)

| # | Focus | LearningTask / type | Planned interaction |
|---|---|---|---|
| B01 | blocking call inside event-loop thread | analyze / `DG` | diagnose latency affecting unrelated Tasks |
| B02 | `asyncio.to_thread()` | apply / `SA` | move unavoidable blocking I/O behind a thread boundary |
| B03 | ThreadPool vs ProcessPool and the GIL | evaluate / `CJ` | choose execution boundary for blocking I/O vs CPU-bound pure Python work |
| B04 | interaction from another OS thread | apply / `SA` | choose `call_soon_threadsafe()` / `run_coroutine_threadsafe()` correctly |

### Module 8 — I/O and resource boundaries (3)

| # | Focus | LearningTask / type | Planned interaction |
|---|---|---|---|
| I01 | high-level streams (`open_connection`, reader/writer) | apply / `SA` | reason through connection/read/write lifecycle |
| I02 | close / `wait_closed()` and asynchronous resource cleanup | analyze / `DG` | diagnose leaked or prematurely closed network resource |
| I03 | regular file I/O is not directly monitored as socket readiness by asyncio loops | explain / `EX` | explain why “make function async” does not make ordinary file operations non-blocking |

### Module 9 — diagnostics (4)

| # | Focus | LearningTask / type | Planned interaction |
|---|---|---|---|
| D01 | `coroutine was never awaited` | analyze / `DG` | identify coroutine object created but neither awaited nor scheduled |
| D02 | `Task exception was never retrieved` | analyze / `DG` | find missing task ownership/result handling |
| D03 | debug mode and slow callbacks | apply / `SA` | use debug information to diagnose event-loop stalls |
| D04 | unbounded Task creation / concurrency explosion | evaluate / `CJ` | recognize why “more Tasks” can reduce reliability and apply a bound |

Core total: **36**.

## 7. Extension plan — 14 cards

These are useful but should not block the first usable topic.

| # | Extension | Why deferred |
|---|---|---|
| X01 | custom awaitables and `__await__` in depth | library/framework author concern |
| X02 | `contextvars` and Task-local request context | important backend mechanism but separable after core scheduling model |
| X03 | async comprehensions as a separate syntax/mechanics card | lower interview value than async iteration itself |
| X04 | low-level callback scheduling: `call_soon`, `call_later`, handles | mostly library/framework level |
| X05 | `wait()` and `as_completed()` selection | useful composition variants after `gather`/`TaskGroup` |
| X06 | graceful application shutdown across many owned Tasks | system-level synthesis after cancellation core |
| X07 | `Event`, `Condition`, `Barrier` | lower frequency than Lock/Semaphore/Queue |
| X08 | `Queue.shutdown()` (3.13+) | explicitly version-sensitive |
| X09 | asyncio subprocess API | useful but not primary web-backend path |
| X10 | selector/proactor and platform differences | implementation/platform depth |
| X11 | task introspection (`current_task`, `all_tasks`, names/stacks) | operations/debug extension |
| X12 | eager task factory / `eager_start` | semantic/performance optimization; 3.12+/3.14 changes |
| X13 | low-level transports/protocols | framework-author concern |
| X14 | explicit 3.10→3.14 evolution card | synthesis/reference after individual mechanisms are learned |

## 8. Core coverage by learning operation

The proposed set intentionally biases away from definition-only recall.

Approximate distribution:

```text
explain                 10
compare                   4
apply / scenario          8
analyze: predict/trace     5
analyze: diagnose          7
evaluate / justify         4
design                     2
```

Some cards can shift category during authoring; the invariant is more important than the exact count:

> Most interview evidence should require explanation, execution reasoning, diagnosis, application or choice — not recognition.

There is intentionally no requirement for one card of every QuestionType per Concept.

## 9. Cross-module “capstone” scenarios

After individual cards work, three capstones can test transfer across clusters. They should be generated **after** the 36 core objects, not counted as foundational coverage.

### Capstone A — concurrent service aggregation

```text
HTTP request
  -> call profile service
  -> call orders service
  -> call recommendation service
  -> one service fails / one is slow
```

Required reasoning:

- TaskGroup/gather choice;
- timeout boundary;
- cancellation;
- bounded concurrency if fan-out grows;
- cleanup/error semantics.

### Capstone B — async worker pipeline

```text
producer -> bounded Queue -> N workers -> external I/O
```

Required reasoning:

- backpressure;
- Queue lifecycle;
- Semaphore/resource limit;
- graceful cancellation;
- task ownership.

### Capstone C — “async endpoint is slow” diagnosis

Evidence may include:

```text
async handler
  -> blocking sync client
  -> CPU-heavy transformation
  -> orphan background Task
  -> event-loop slow-callback log
```

Required reasoning:

- identify each blocking/lifecycle problem;
- choose thread/process/async-native boundary;
- preserve cancellation/resource ownership.

## 10. Version-sensitive knowledge

Do not teach all APIs as if they existed throughout the version baseline.

Important anchors:

- `asyncio.to_thread()` exists in the target baseline (added in 3.9);
- `TaskGroup`, `asyncio.timeout()` and `Runner` arrive in Python 3.11;
- eager task factory arrives in 3.12;
- `Queue.shutdown()` arrives in 3.13;
- 3.14 adds `eager_start` plumbing to task creation and deprecates the event-loop policy system for future removal.

Cards should put version notes on the back unless the version distinction is itself the thing being tested.

## 11. Source map

Primary technical sources for card authoring:

### Language semantics

- PEP 492 — native coroutines and `async`/`await`;
- Python language reference — coroutine functions, `async for`, `async with`;
- PEP 525 — asynchronous generators;
- PEP 530 — asynchronous comprehensions.

### Runtime / structured concurrency

- Python `asyncio` overview;
- Coroutines and Tasks documentation;
- Runners documentation;
- PEP 3156 for design background.

### Coordination / pressure

- asyncio synchronization primitives;
- asyncio queues;
- asyncio streams.

### Context / interoperability / debugging

- PEP 567 — `contextvars`;
- event-loop / executor documentation;
- Developing with asyncio;
- platform support documentation.

## 12. Acceptance criteria for the topic structure

Before generating cards, review the blueprint against these questions:

1. Does the scope teach **asynchronous programming in Python**, not merely `asyncio` function names?
2. Is the conceptual model sufficient to explain *why* code behaves as it does?
3. Are Python language semantics separated from library/runtime APIs?
4. Are cancellation, ownership, failure and backpressure treated as first-class rather than advanced footnotes?
5. Does the plan test code reading/diagnosis and design, not only definitions?
6. Is the core small enough to study, while extensions preserve depth?
7. Is any major backend-relevant async failure mode missing?
8. Is anything in the 36-card core too low-value for a Middle Python Backend interview?

## 13. Human gate

**Stop here.**

Do not generate the full question bank or Anki learning objects until the user reviews:

- topic boundary;
- module structure;
- the 36-card core;
- extension set;
- capstone scenarios.
