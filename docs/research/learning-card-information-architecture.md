# Learning Card Information Architecture and Visual Hierarchy

Date: 2026-09-17
Status: research candidate; not an accepted template/schema decision

## Research question

What should an Interview Preparation learner actually see on a card, in what order, and with what visual prominence?

This is deliberately narrower than [`learning-card-architecture.md`](learning-card-architecture.md). The earlier research asks what semantic dimensions and content blocks a learning object may contain. This research asks which of those data should enter the learner-facing surface at all.

The motivating prototype exposed a useful failure mode:

```text
Idempotency                       apply  scenario  independent
Payment API

Как сделать retry безопасным в этой ситуации?

[scenario stimulus]

Ответ: free-recall
```

The data is structurally correct, but the UI creates three misleading impressions:

1. `Payment API` visually resembles a subtitle/subtopic of `Idempotency`, while it is actually context;
2. `apply / scenario / independent` looks important even though it is mostly machine/instructional metadata;
3. `Ответ: free-recall` can be read as answer content rather than an instruction describing the expected response.

The problem is therefore information architecture, not CSS polish.

## Executive finding

Use the principle:

```text
available card data != visible card UI
```

A field is shown only when its visibility helps the learner understand **what is being asked, what information is relevant, or how to respond**.

Recommended default front surface:

```text
Тема: <Concept display label>        Контекст: <Context>   # context optional

<Stimulus / artifact, when required to understand the task>

<Prompt>

<Response instruction, only when the expected action is not already obvious>
```

The current taxonomy dimensions should normally stay hidden:

```text
KnowledgeKind
LearningTask
QuestionType
GuidanceLevel
StimulusFormat
ResponseFormat machine value
PrototypeId
```

A human-facing interaction cue such as `Сценарий`, `Анализ кода`, or `Разобранный пример` may be shown only when it genuinely orients the learner. It is a presentation cue derived from the learning object, not a dump of taxonomy values.

The strongest candidate back hierarchy is not one flat sequence of equally prominent sections. It is three layers:

```text
FAST CHECK
  ShortAnswer
  KeyPoints

DEEP FEEDBACK
  Explanation
  ReasoningSteps
  CorrectArtifact

EXTENSION / PROVENANCE
  Pitfall
  Alternatives
  Sources
```

This supports both a fast Anki self-check and deeper learning without forcing every block into equal visual importance.

## Evidence base

### 1. Coherence: remove information that is not required for the learning goal

The coherence principle in multimedia learning states that learners generally perform better when extraneous material is excluded. The 2021 Cambridge Handbook chapter groups coherence with signaling, redundancy, and spatial/temporal contiguity as principles for reducing extraneous processing.

Source:

- Fiorella & Mayer, 2021, *Principles for Reducing Extraneous Processing in Multimedia Learning*: https://doi.org/10.1017/9781108894333.019

Project implication:

`LearningTask`, `StimulusFormat`, and `GuidanceLevel` should not be displayed merely because they exist in the model. If the learner does not need to decode them to perform the task, they are candidates for removal from the card surface.

This directly argues against the current three badges:

```text
apply  scenario  independent
```

Their metadata value can remain in fields/tags and author/debug tooling.

### 2. Signaling helps when it highlights meaningful organization

A meta-analysis of 103 studies (`N = 12,201`) found positive effects of signaling on retention and transfer and reported reduced cognitive load. A separate meta-analysis of text-picture signaling also found a positive small-to-medium effect on comprehension/transfer.

Sources:

- Schneider et al., 2018, *A meta-analysis of how signaling affects learning with media*: https://www.sciencedirect.com/science/article/pii/S1747938X17300581
- Richter, Scheiter & Eitel, 2016: https://doi.org/10.1016/j.edurev.2015.12.003

Project implication:

Visual hierarchy should signal **semantic structure**, not internal taxonomy.

Useful signals:

```text
Тема:
Контекст:
Краткий ответ
Ключевые пункты
Объяснение
Типичная ошибка
```

Weak signals:

```text
property
scenario-apply
independent
mixed
free-recall
```

unless one of these is translated into a learner-relevant instruction.

### 3. Headings affect how readers represent topic structure

Experiments on expository text found that headings influence what readers treat as topics and how they represent a text's organization. Headings improved memory for topic structure, but signaling can also change which information receives attention.

Sources:

- Lorch et al., 2001, *Effects of Headings on Text Summarization*: https://pubmed.ncbi.nlm.nih.gov/11273655/
- Sanchez, Lorch & Lorch, 2001, *Effects of Headings on Text Processing Strategies*: https://pubmed.ncbi.nlm.nih.gov/11414729/
- Lorch, Lemarié & Chen, 2013, *Signaling topic structure via headings or preview sentences*: https://doi.org/10.1016/S1135-755X(13)70011-3

Project implication:

The current visual treatment:

```text
Idempotency
Payment API
```

implicitly signals a hierarchy. If `Payment API` is context rather than a child topic, the UI should state the relation rather than rely on vertical typography.

Recommended:

```text
Тема: Idempotency (идемпотентность)
Контекст: Payment API
```

or, on wide screens:

```text
Тема: Idempotency (идемпотентность)  ·  Контекст: Payment API
```

The labels are deliberately explicit because they prevent the learner from inferring a false semantic relation from typography alone.

### 4. Split attention: related information should be spatially integrated

Cognitive Load Theory research shows a split-attention cost when mutually dependent information sources are spatially separated and the learner must mentally integrate them. Reviews recommend integrating related information where practical.

Sources:

- Sweller, van Merriënboer & Paas, 2019: https://doi.org/10.1007/s10648-019-09465-5
- Paas & van Merriënboer, 2020: https://doi.org/10.1177/0963721420922183
- Chandler & Sweller, 1992: https://doi.org/10.1111/j.2044-8279.1992.tb01017.x

Project implication:

- a question referring to `эта ситуация` should be adjacent to the scenario it refers to;
- an explanation of a code fragment should be close to that artifact rather than separated by unrelated metadata;
- code/log/diagram stimuli should form one visual task unit with their prompt;
- do not place learner instructions in a remote footer if they control how the main prompt should be interpreted.

### 5. Expected response should be clear, but machine response codes are not learner instructions

Constructed-response assessment guidance consistently emphasizes that the task should communicate what kind of response is expected. If instructions are underspecified, learners can answer different interpretations of the task, introducing construct-irrelevant difficulty.

Sources:

- TIMSS/PIRLS Item Writing Guidelines: https://timssandpirls.bc.edu/methods/pdf/T11_Item_writing_guidelines.pdf
- ETS, *Guidelines for Constructed-Response and Other Performance Assessments*: https://www.tr.ets.org/pdfs/about/constructed-response-guidelines.pdf
- UK Standards and Testing Agency, Test Development Handbook (construct-irrelevant variance): https://www.gov.uk/government/publications/national-curriculum-test-development-handbook/test-development-handbook-2023

Project implication:

Do not render:

```text
Ответ: free-recall
```

Render a learner instruction when necessary, for example:

```text
Ответьте своими словами.
```

or:

```text
Формат ответа: кратко объясните причину и предложите исправление.
```

Better still, when the prompt itself already makes the response clear, omit the separate instruction entirely.

### 6. Color may reinforce category, but must not carry essential meaning alone

WCAG 2.2 explicitly requires that color not be the only visual means of conveying information.

Source:

- W3C WAI, WCAG 2.2 Understanding 1.4.1: https://www.w3.org/WAI/WCAG22/Understanding/use-of-color

Project implication:

A scenario, diagnosis, or worked example may use subtle color differences as secondary orientation, but the card must remain understandable in grayscale. Structure, labels, borders, typography, and wording carry the primary meaning.

## Visibility policy

### Learner-facing by default

| Field/block | Visibility | Rationale |
| --- | --- | --- |
| `Concept` | yes | anchors the learning object in subject knowledge |
| localized concept alias | optional | helps Russian explanatory reading while preserving English-first terminology |
| `Context` | when present | changes interpretation of the concept/task |
| `Stimulus` | when present | contains task evidence/input |
| `Prompt` | yes for retrieval/assessment objects | states the learner task |
| human response instruction | when non-obvious | prevents response ambiguity |
| feedback semantic blocks | after reveal | instructional/self-assessment value |

### Hidden by default

| Field | Why hidden |
| --- | --- |
| `KnowledgeKind` | classifies the referent; usually no learner action depends on seeing it |
| `LearningTask` | useful to generation/coverage/analytics; prompt should embody it |
| `QuestionType` | internal evidence taxonomy |
| `GuidanceLevel` | should be embodied by what support is actually shown |
| `StimulusFormat` | normally obvious from the stimulus itself |
| raw `ResponseFormat` | machine value is not learner language |
| `PrototypeId` / stable IDs | identity/provenance only |

All hidden fields remain available in Anki note fields/tags, repository data, authoring tools, and optional debug mode.

## Concept presentation

### Underlying model

Keep canonical identity English-first:

```text
Concept = Idempotency
```

### Learner display

A presentation helper may produce:

```text
Idempotency (идемпотентность)
```

when a conventional Russian translation is useful.

Do not mechanically translate technologies/products/API names:

```text
asyncio
FastAPI
PostgreSQL
Kafka
```

should normally remain as-is.

### Label

Prefer the human-facing label:

```text
Тема:
```

over exposing the domain word `Concept`/`Концепт` on every card. The persisted/domain entity remains `Concept`; UI terminology does not have to mirror the domain model literally.

## Context presentation

`Context` is a modifier of the current task, not a hierarchy level.

Bad:

```text
Idempotency
Payment API
```

Good:

```text
Тема: Idempotency (идемпотентность)
Контекст: Payment API
```

Context should be:

- visually quieter than the prompt;
- explicitly labeled;
- omitted when it adds no interpretive value;
- allowed to contain conventional English technical names.

## Response instruction policy

The model may keep a machine-readable `ResponseFormat`, but the front card should use a derived human instruction only when needed.

Candidate mapping:

| Machine value | Human instruction candidate |
| --- | --- |
| `free-recall` | `Ответьте своими словами.` |
| `self-explanation` | `Объясните ход рассуждения.` |
| `trace-table` | `Проследите выполнение и укажите результат.` |
| `code-completion` | `Допишите недостающий код.` |
| `code-repair` | `Найдите причину ошибки и предложите исправление.` |
| `code-writing` | `Напишите фрагмент кода.` |
| `ordering` | `Расположите шаги в правильном порядке.` |
| `comparison` | `Сравните варианты по ключевым различиям.` |
| `architecture-sketch` | `Предложите решение и обоснуйте ключевые решения.` |

This mapping is a UI/presentation concern, not evidence that these strings belong in the domain.

### Omission rule

If the prompt already says exactly what to do, do not repeat the same instruction.

Example:

```text
Prompt: Объясните, почему повторный POST может создать duplicate payment,
и назовите два способа защиты.
```

A footer saying `Ответьте своими словами` adds little value and should be omitted.

## Card-type / interaction labels

### Default

Do **not** display:

```text
apply | scenario | independent
```

The learner should normally infer interaction semantics from the actual composition:

- scenario card contains a scenario;
- code-trace card contains code and a trace/prediction prompt;
- diagnose card presents a defect/log and asks for cause/fix;
- worked example visibly includes solution/reasoning support.

### Optional presentation cue

A single learner-facing cue is allowed when it lowers orientation cost:

```text
Сценарий
Анализ кода
Диагностика
Разобранный пример
Проектирование
```

Rules:

1. at most one such cue on the front;
2. it is derived from the presentation preset/task, not persisted as a new semantic taxonomy by default;
3. it is visually secondary;
4. color may reinforce it but cannot be the only signal;
5. omit it if the card is self-explanatory without it.

## Information priority

### Front

```text
P0  Prompt + information required to answer it
P1  Concept/topic anchor + Context
P2  Response instruction when ambiguity exists
P3  Optional human interaction cue
P4  machine metadata (hidden)
```

Visual size should not mechanically follow model importance. The prompt is the primary visual target because it is the learner's immediate action, even though `Concept` is semantically the stable knowledge anchor.

### Back

```text
P0  ShortAnswer
P0  KeyPoints for self-check
P1  Explanation / ReasoningSteps / CorrectArtifact
P2  Pitfall / Alternatives
P3  Sources
P4  debug/provenance metadata (hidden)
```

## Candidate universal skeleton

The skeleton is semantic; exact order of `Stimulus` and `Prompt` may vary when dependency requires it.

```text
┌────────────────────────────────────────────┐
│ Тема: Idempotency (идемпотентность)       │
│ Контекст: Payment API                     │
│                                            │
│ [stimulus / code / scenario if needed]    │
│                                            │
│ MAIN PROMPT                                │
│                                            │
│ [human response instruction if needed]    │
└────────────────────────────────────────────┘
```

For a stimulus-dependent question, prefer presenting the facts before a prompt that refers to them:

```text
Context -> Stimulus -> Prompt
```

For an instruction that changes how an artifact should be inspected, a short task cue may precede the artifact:

```text
Task cue -> Stimulus -> precise Prompt
```

The key rule is not one fixed DOM order; it is to avoid forcing the learner to jump between semantically dependent regions.

## Five candidate layouts

### 1. Concept recall

```text
Тема: Idempotency (идемпотентность)

Что означает idempotency применительно к API operation?
```

No card-type badge. No `independent`. No `free-recall` label because the prompt is sufficient.

### 2. Scenario

```text
Тема: Idempotency (идемпотентность)
Контекст: Payment API

┌ Ситуация ────────────────────────────────┐
│ Client отправил POST /payments.         │
│ Server создал payment и сделал commit,  │
│ но response потерялся...                │
└─────────────────────────────────────────┘

Как сделать retry безопасным в этой ситуации?

Ответьте своими словами и назовите ключевой механизм защиты.
```

`Ситуация` is a semantic block label, not the raw `StimulusFormat=scenario` value.

### 3. Code trace

```text
Тема: asyncio.create_task
Контекст: event loop

┌ Код ────────────────────────────────────┐
│ async def main():                       │
│     task = asyncio.create_task(foo())   │
│     print("A")                          │
│     await task                          │
│     print("B")                          │
└────────────────────────────────────────┘

Как изменится порядок выполнения по сравнению с `await foo()`?
```

The code is the obvious interaction signal; a `code` badge adds little.

### 4. Diagnose

```text
Тема: asyncio
Контекст: coroutine execution

┌ Код / traceback ────────────────────────┐
│ ...                                     │
└────────────────────────────────────────┘

Почему возникает проблема и как её исправить?

Найдите причину и предложите исправление.
```

An optional single cue `Диагностика` may be tested, but should not be mandatory if the prompt is already clear.

### 5. Worked example

```text
Тема: Idempotency (идемпотентность)
Контекст: concurrent requests

Разобранный пример

[problem + solution steps / artifact]

Почему именно этот шаг предотвращает race condition?
```

Here the interaction cue `Разобранный пример` is useful because the learner must understand that the visible solution is intentional scaffolding, not an accidentally revealed answer.

## Back-side hierarchy

### Layer 1 — fast self-check

```text
Краткий ответ
<2–4 sentences>

Ключевые пункты
✓ ...
✓ ...
✓ ...
```

This is the first screenful after reveal where possible.

### Layer 2 — deeper feedback

```text
Объяснение
...

Ход рассуждения            only when process matters
...

Эталонный вариант          only when an artifact has a useful reference form
...
```

### Layer 3 — extension

```text
Типичная ошибка            optional
Альтернативы               optional
Источники                  visually quiet
```

Do not force all headings to render. Empty or low-value sections are omitted.

## Consequence for the current prototype

The existing v2 prototype should be treated as having deliberately exposed metadata for evaluation, not as the desired final UI.

Candidate next visual experiment:

1. remove `LearningTask`, `StimulusFormat`, and `GuidanceLevel` badges from the learner front;
2. change the Concept area to explicit `Тема:` plus optional translation;
3. change `Context` to explicit `Контекст:` and place it on the same metadata line when space allows;
4. replace raw `Ответ: <ResponseFormat>` with a Russian response instruction or omit it when redundant;
5. hide `KnowledgeKind · QuestionType · PrototypeId` debug metadata from the learner back;
6. reorder back feedback for fast checking: `ShortAnswer -> KeyPoints -> deeper explanation`;
7. retain semantic block differences for scenario/code/worked-example instead of representing them with multiple taxonomy chips;
8. test at most one human-facing interaction cue per card family.

## What is evidence vs project hypothesis

### Strongly evidence-informed

- reduce irrelevant information;
- use meaningful signaling/headings;
- spatially integrate mutually dependent information;
- state response expectations clearly when ambiguity exists;
- do not rely on color alone.

### Project hypotheses requiring Anki use

- `Тема:` and `Контекст:` are the best exact Russian labels;
- concept translation should appear on every isolated card rather than only some cards;
- `ShortAnswer -> KeyPoints -> Explanation` is the best back ordering for this user/workflow;
- a single human interaction cue is useful for worked/scenario/diagnose cards;
- response instructions should usually be integrated into the prompt instead of rendered as a separate line.

These should be tested on the existing 14-card prototype before acceptance into a permanent card schema.

## Recommended next experiment

Create a **presentation-only v2.1** over the same 14 learning objects. Do not change semantic data.

A/B comparison target:

```text
v2.0: metadata-exposing prototype
v2.1: learner-first information architecture
```

Evaluate:

- time to understand what the card asks;
- false hierarchy between Concept and Context;
- whether response expectations are immediately clear;
- whether any hidden metadata is actually missed;
- front visual noise;
- first-screen usefulness after reveal;
- desktop/mobile and light/dark readability.

Only after that comparison should UI choices be promoted into the permanent `Prep Card` template.
