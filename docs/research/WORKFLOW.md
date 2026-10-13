# Research workflow

This is the working procedure for **noncanonical, independent research** under `docs/research/`. Use [local AGENTS](AGENTS.md) for navigation and root [AGENTS](../../AGENTS.md) for repository-wide Git/file discipline. **Research does not invoke Harness, require Harness admission, or modify canonical engineering artifacts.** Harness is a separate future engineering integration step, after the owner has reviewed the product concept and the relevant checks.

The research workspace collects hypotheses, alternative models, falsifiers, test data, observations and owner inputs. It is not product acceptance, production design or an engineering implementation backlog.

## Ownership of research information

| Source | Owns | Must not duplicate |
| --- | --- | --- |
| Topic `README.md` | Navigation to current documents and dated evidence | Statuses, findings, procedure text |
| Topic `research-framing.md` (when designated) | Current owner-supplied research objective, scope and boundary | Experiment outcomes and decisions about implementation |
| Topic `open-questions.md` | Open/closed research questions, their priority and closure criteria | Detailed experiment protocols, separate project plan |
| Topic `open-experiments.md` | Experiment IDs, state, hypothesis, bounded checks, falsifiers, outputs and links | Full fixture/protocol documents or result narratives |
| Named protocol/hypothesis document | One topic-specific investigation method or candidate contract | Current status, cross-project workflow |
| Dated result/checkpoint | What was actually observed or explicitly stated at that point, limitations, counterexamples | A live status or next-step register |
| Topic `HANDOFF.md` | Minimal links and reading order needed to resume | Duplicated scope, protocol, priority or findings |

If information has an owner, change it there and update references elsewhere. Historical evidence remains dated and may be superseded by new owner input without rewriting the original observation.

## Find or start a bounded investigation

1. Read the topic framing, question and experiment registers, and the evidence directly relevant to the question. Check the task branch and any parallel work before editing.
2. Continue the nearest existing topic and ID; create a new document only for a distinct responsibility or an independently useful evidence record.
3. State the question, alternatives, comparable inputs, observable outcome and falsification criteria **before** a test. Keep unknown relation semantics explicit.
4. Use a diagram, Markdown fixture or small executable check according to the least costly method that exposes errors. Build code under `experiments/` only if it materially improves reproducibility or validity.
5. Run independent investigations in parallel when neither consumes the other's unfinished conclusions. Define an explicit compatibility/decision checkpoint before a downstream integrated experiment.
6. Stop when the bounded question can be reviewed with evidence, failures and limitations. New unknowns go to the existing question register; do not grow a test into a full product build.

## Record and hand off

- Distinguish **proposal**, **owner-confirmed research input**, **observed evidence**, **research recommendation**, and **future engineering acceptance**.
- Update question statuses only in the question register and experiment statuses only in the experiment register. Store results in dated reports, cross-link them and avoid repeated prose summaries.
- A test may disprove a model or leave the choice unresolved; do not silently replace the fixture or invent relations to force a pass.
- Commit coherent changes on the selected branch; do not merge into `main` without explicit owner authorization.
- After research yields a tested and owner-selected product/model/interface direction, prepare a concise evidence-and-decision handoff for **separate** Harness-governed engineering work. Until then, do not use Harness in research or edit its files.
