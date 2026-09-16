from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass
from typing import Any, Sequence

from prep.infrastructure.anki import (
    CardTemplateSpec,
    NoteTypeSpec,
    ensure_deck,
    ensure_note_type,
    find_note_by_external_id,
    upsert_note,
)

from .anki import FIELDS as V2_FIELDS
from .anki import render_fields as render_v2_fields
from .model import PrototypeLearningObject

NOTE_TYPE_NAME = "Prep Learning Object v2.1"
DEFAULT_DECK = "Prep::Prototype v2.1"
EXTERNAL_ID_FIELD = "PrototypeId"
GENERATED_TAG_PREFIXES = (
    "prep-v21::concept::",
    "prep-v21::knowledge-kind::",
    "prep-v21::learning-task::",
    "prep-v21::question-type::",
    "prep-v21::guidance::",
    "prep-v21::stimulus::",
    "prep-v21::response::",
)

DISPLAY_FIELDS = (
    "ConceptDisplay",
    "ContextDisplay",
    "ResponseGuidance",
    "InteractionCue",
)
FIELDS = V2_FIELDS + DISPLAY_FIELDS

CONCEPT_DISPLAY_OVERRIDES = {
    "Idempotency": "Idempotency (идемпотентность)",
    "Coroutine": "Coroutine (корутина)",
}

NON_DOMAIN_CONTEXTS = {
    "Worked example",
    "Worked code example",
    "Faded example",
    "Code trace",
    "Bug diagnosis",
}

RESPONSE_GUIDANCE = {
    "free-recall": "свободный ответ своими словами",
    "self-explanation": "объяснение своими словами",
    "comparison": "сравнение с обоснованием",
    "trace-table": "порядок выполнения / trace",
    "code-completion": "дополните код",
    "code-repair": "найдите причину и исправьте код",
    "code-writing": "напишите код",
    "architecture-sketch": "предложите решение и объясните trade-offs",
}

FRONT_TEMPLATE = r"""
<div class="prep-lo prep-front">
  <header class="prep-header">
    <div class="prep-topic">
      <div class="prep-field-label">Тема</div>
      <div class="prep-concept">{{ConceptDisplay}}</div>
    </div>
    {{#InteractionCue}}<div class="prep-cue">{{InteractionCue}}</div>{{/InteractionCue}}
  </header>

  {{#ContextDisplay}}
  <div class="prep-context-row">
    <span class="prep-field-label">Контекст</span>
    <span class="prep-context-value">{{ContextDisplay}}</span>
  </div>
  {{/ContextDisplay}}

  <main class="prep-task">
    {{#Stimulus}}<div class="prep-stimulus">{{Stimulus}}</div>{{/Stimulus}}
    <div class="prep-prompt">{{Prompt}}</div>
  </main>

  {{#ResponseGuidance}}
  <footer class="prep-response">
    <span class="prep-field-label">Формат ответа</span>
    <span>{{ResponseGuidance}}</span>
  </footer>
  {{/ResponseGuidance}}
</div>
""".strip()

BACK_TEMPLATE = r"""
{{FrontSide}}
<div class="prep-lo prep-feedback">
  <div class="prep-layer-title">Быстрая проверка</div>

  {{#ShortAnswer}}
  <section class="prep-section prep-short-answer">
    <h3>Краткий ответ</h3>
    <div>{{ShortAnswer}}</div>
  </section>
  {{/ShortAnswer}}

  {{#KeyPoints}}
  <section class="prep-section prep-key-points">
    <h3>Ключевые пункты</h3>
    <div>{{KeyPoints}}</div>
  </section>
  {{/KeyPoints}}

  {{#Explanation}}
  <div class="prep-layer-title prep-layer-secondary">Разбор</div>
  <section class="prep-section">
    <h3>Объяснение</h3>
    <div>{{Explanation}}</div>
  </section>
  {{/Explanation}}

  {{#ReasoningSteps}}
  <section class="prep-section">
    <h3>Ход рассуждения</h3>
    <div>{{ReasoningSteps}}</div>
  </section>
  {{/ReasoningSteps}}

  {{#CorrectArtifact}}
  <section class="prep-section">
    <h3>Эталонный вариант</h3>
    <div>{{CorrectArtifact}}</div>
  </section>
  {{/CorrectArtifact}}

  {{#Pitfall}}
  <div class="prep-layer-title prep-layer-secondary">Дополнительно</div>
  <section class="prep-section prep-pitfall">
    <h3>Типичная ошибка</h3>
    <div>{{Pitfall}}</div>
  </section>
  {{/Pitfall}}

  {{#Alternatives}}
  <section class="prep-section">
    <h3>Альтернативы</h3>
    <div>{{Alternatives}}</div>
  </section>
  {{/Alternatives}}

  {{#Sources}}
  <section class="prep-section prep-sources">
    <h3>Источники</h3>
    <div>{{Sources}}</div>
  </section>
  {{/Sources}}
</div>
""".strip()

CSS = r"""
.card {
  --bg: #f4f6f8;
  --surface: #ffffff;
  --surface-soft: #f8fafc;
  --text: #20242b;
  --muted: #697386;
  --border: #dfe4ea;
  --accent: #3157d5;
  --accent-soft: #eef2ff;
  --code-bg: #111827;
  --code-text: #e5e7eb;
  --warning-bg: #fff8e6;
  --warning-border: #e4b84a;
  margin: 0;
  padding: 22px 14px 36px;
  background: var(--bg);
  color: var(--text);
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 18px;
  line-height: 1.55;
  text-align: left;
}

.nightMode.card, .nightMode .card {
  --bg: #111318;
  --surface: #1a1e25;
  --surface-soft: #20252e;
  --text: #edf0f4;
  --muted: #a8b0bd;
  --border: #343b46;
  --accent: #8da2fb;
  --accent-soft: #252d4b;
  --code-bg: #0b0e13;
  --code-text: #e6eaf0;
  --warning-bg: #312a18;
  --warning-border: #8f7536;
}

.prep-lo {
  box-sizing: border-box;
  max-width: 820px;
  margin: 0 auto;
  padding: 25px 28px;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--surface);
  box-shadow: 0 6px 24px rgba(17, 24, 39, 0.06);
}

.prep-feedback { margin-top: 14px; }
.prep-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; margin-bottom: 14px; }
.prep-topic { min-width: 0; }
.prep-field-label { color: var(--muted); font-size: 0.68em; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
.prep-concept { margin-top: 2px; color: var(--accent); font-size: 1.08em; font-weight: 750; letter-spacing: 0.005em; }
.prep-cue { flex: 0 0 auto; padding: 4px 9px; border: 1px solid var(--border); border-radius: 999px; color: var(--muted); font-size: 0.7em; }
.prep-context-row { display: flex; align-items: baseline; gap: 9px; margin: 3px 0 18px; }
.prep-context-value { color: var(--text); font-size: 0.88em; }
.prep-task { margin-top: 8px; }
.prep-stimulus { margin: 0 0 20px; }
.prep-prompt { margin: 0; font-size: 1.24em; line-height: 1.45; font-weight: 680; }
.prep-response { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 22px; padding-top: 13px; border-top: 1px solid var(--border); color: var(--muted); font-size: 0.78em; }

.prep-layer-title { margin: 0 0 14px; color: var(--text); font-size: 0.78em; font-weight: 800; letter-spacing: 0.07em; text-transform: uppercase; }
.prep-layer-secondary { margin-top: 28px; padding-top: 18px; border-top: 1px solid var(--border); color: var(--muted); }
.prep-section { margin: 0 0 18px; }
.prep-section:last-child { margin-bottom: 0; }
.prep-section h3 { margin: 0 0 7px; color: var(--muted); font-size: 0.76em; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
.prep-short-answer { padding: 15px 17px; border-left: 4px solid var(--accent); border-radius: 8px; background: var(--accent-soft); }
.prep-key-points ul { list-style: none; padding-left: 0; }
.prep-key-points li { position: relative; padding-left: 1.55em; }
.prep-key-points li::before { content: "✓"; position: absolute; left: 0; color: var(--accent); font-weight: 800; }
.prep-pitfall { padding: 13px 15px; border-left: 3px solid var(--warning-border); border-radius: 7px; background: var(--warning-bg); }
ul, ol { margin: 7px 0 0 1.2em; padding: 0; }
li + li { margin-top: 5px; }
pre.prep-code, pre.prep-artifact {
  box-sizing: border-box;
  overflow-x: auto;
  margin: 0;
  padding: 15px 17px;
  border-radius: 10px;
  background: var(--code-bg);
  color: var(--code-text);
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  font-size: 0.82em;
  line-height: 1.5;
  white-space: pre;
  tab-size: 4;
}
.prep-prose-stimulus { padding: 14px 16px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface-soft); }
.prep-sources { color: var(--muted); font-size: 0.78em; }
.prep-sources a { color: var(--accent); word-break: break-all; }

@media (max-width: 600px) {
  .card { padding: 10px 6px 24px; font-size: 17px; }
  .prep-lo { padding: 18px 16px; border-radius: 12px; }
  .prep-header { gap: 10px; }
  .prep-concept { font-size: 1em; }
  .prep-prompt { font-size: 1.14em; }
  .prep-context-row, .prep-response { display: block; }
  .prep-context-value, .prep-response span:last-child { display: block; margin-top: 2px; }
}
""".strip()

NOTE_TYPE_SPEC = NoteTypeSpec(
    name=NOTE_TYPE_NAME,
    fields=FIELDS,
    templates=(
        CardTemplateSpec(
            name="Learning Object v2.1",
            front=FRONT_TEMPLATE,
            back=BACK_TEMPLATE,
        ),
    ),
    css=CSS,
)


@dataclass(frozen=True)
class PrototypeSyncResult:
    prototype_id: str
    status: str
    external_ref: str | None = None
    message: str | None = None


class PrototypeAnkiStudySystemV21:
    def __init__(self, anki: Any, *, deck_name: str = DEFAULT_DECK) -> None:
        self._anki = anki
        self._deck_name = deck_name

    def reconcile(
        self,
        objects: Sequence[PrototypeLearningObject],
        *,
        dry_run: bool,
    ) -> tuple[PrototypeSyncResult, ...]:
        objects = tuple(objects)
        if not objects:
            return ()

        try:
            model_exists = NOTE_TYPE_NAME in set(self._anki.invoke("modelNames"))
            if not dry_run:
                ensure_deck(self._anki, self._deck_name)
                ensure_note_type(self._anki, NOTE_TYPE_SPEC)
                model_exists = True
        except Exception as exc:
            return tuple(
                PrototypeSyncResult(
                    obj.prototype_id,
                    "error",
                    message=f"Anki setup failed: {exc}",
                )
                for obj in objects
            )

        results: list[PrototypeSyncResult] = []
        for obj in objects:
            try:
                fields = render_fields(obj)
                tags = render_tags(obj)
                if not model_exists:
                    results.append(PrototypeSyncResult(obj.prototype_id, "created"))
                    continue

                note_id = find_note_by_external_id(
                    self._anki,
                    field_name=EXTERNAL_ID_FIELD,
                    external_id=obj.prototype_id,
                    model_name=NOTE_TYPE_NAME,
                )
                if note_id is None:
                    if dry_run:
                        results.append(PrototypeSyncResult(obj.prototype_id, "created"))
                    else:
                        created = upsert_note(
                            self._anki,
                            external_id_field=EXTERNAL_ID_FIELD,
                            external_id=obj.prototype_id,
                            deck_name=self._deck_name,
                            model_name=NOTE_TYPE_NAME,
                            fields=fields,
                            tags=tags,
                        )
                        results.append(
                            PrototypeSyncResult(
                                obj.prototype_id,
                                "created",
                                str(created.note_id),
                            )
                        )
                    continue

                info = self._note_info(note_id)
                if self._matches(info, fields, tags):
                    results.append(
                        PrototypeSyncResult(obj.prototype_id, "unchanged", str(note_id))
                    )
                    continue
                if dry_run:
                    results.append(
                        PrototypeSyncResult(obj.prototype_id, "updated", str(note_id))
                    )
                    continue

                updated = upsert_note(
                    self._anki,
                    external_id_field=EXTERNAL_ID_FIELD,
                    external_id=obj.prototype_id,
                    deck_name=self._deck_name,
                    model_name=NOTE_TYPE_NAME,
                    fields=fields,
                    tags=tags,
                )
                self._remove_stale_generated_tags(updated.note_id, tags)
                results.append(
                    PrototypeSyncResult(obj.prototype_id, "updated", str(updated.note_id))
                )
            except RuntimeError as exc:
                status = "conflict" if "Duplicate Anki notes" in str(exc) else "error"
                results.append(
                    PrototypeSyncResult(obj.prototype_id, status, message=str(exc))
                )
            except Exception as exc:
                results.append(
                    PrototypeSyncResult(obj.prototype_id, "error", message=str(exc))
                )
        return tuple(results)

    def _note_info(self, note_id: int) -> dict[str, Any]:
        infos = self._anki.invoke("notesInfo", notes=[note_id])
        if len(infos) != 1:
            raise RuntimeError(
                f"Expected one Anki note for id {note_id}; got {len(infos)}"
            )
        return infos[0]

    @staticmethod
    def _matches(
        info: dict[str, Any],
        desired_fields: dict[str, str],
        desired_tags: list[str],
    ) -> bool:
        current_fields = info.get("fields", {})
        for name, desired in desired_fields.items():
            raw = current_fields.get(name, "")
            current = raw.get("value", "") if isinstance(raw, dict) else str(raw)
            if current != desired:
                return False
        current_tags = set(info.get("tags", []))
        if not set(desired_tags).issubset(current_tags):
            return False
        stale = {
            tag
            for tag in current_tags
            if tag.startswith(GENERATED_TAG_PREFIXES) and tag not in desired_tags
        }
        return not stale

    def _remove_stale_generated_tags(
        self,
        note_id: int,
        desired_tags: list[str],
    ) -> None:
        current_tags = set(self._note_info(note_id).get("tags", []))
        stale = sorted(
            tag
            for tag in current_tags
            if tag.startswith(GENERATED_TAG_PREFIXES) and tag not in desired_tags
        )
        if stale:
            self._anki.invoke("removeTags", notes=[note_id], tags=" ".join(stale))


def render_fields(obj: PrototypeLearningObject) -> dict[str, str]:
    fields = render_v2_fields(obj)
    fields.update(
        {
            "ConceptDisplay": concept_display(obj),
            "ContextDisplay": context_display(obj),
            "ResponseGuidance": response_guidance(obj),
            "InteractionCue": interaction_cue(obj),
        }
    )
    canonical = json.dumps(
        {key: value for key, value in fields.items() if key != "ContentVersion"},
        ensure_ascii=False,
        sort_keys=True,
    ).encode("utf-8")
    fields["ContentVersion"] = hashlib.sha256(canonical).hexdigest()[:16]
    return fields


def render_tags(obj: PrototypeLearningObject) -> list[str]:
    return [
        "prep",
        "prep-v21",
        f"prep-v21::concept::{obj.concept_id}",
        f"prep-v21::knowledge-kind::{obj.knowledge_kind}",
        f"prep-v21::learning-task::{obj.learning_task}",
        f"prep-v21::question-type::{obj.question_type}",
        f"prep-v21::guidance::{obj.guidance_level}",
        f"prep-v21::stimulus::{obj.stimulus_format}",
        f"prep-v21::response::{obj.response_format}",
    ]


def concept_display(obj: PrototypeLearningObject) -> str:
    return CONCEPT_DISPLAY_OVERRIDES.get(obj.concept_title, obj.concept_title)


def context_display(obj: PrototypeLearningObject) -> str:
    if not obj.context or obj.context in NON_DOMAIN_CONTEXTS:
        return ""
    return obj.context


def response_guidance(obj: PrototypeLearningObject) -> str:
    return RESPONSE_GUIDANCE[obj.response_format]


def interaction_cue(obj: PrototypeLearningObject) -> str:
    if obj.guidance_level == "worked":
        return "Разобранный пример"
    if obj.question_type == "diagnose":
        return "Диагностика"
    if obj.question_type == "design":
        return "Проектирование"
    if obj.response_format == "trace-table":
        return "Анализ кода"
    return ""
