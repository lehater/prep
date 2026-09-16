from __future__ import annotations

import hashlib
import html
import json
from dataclasses import dataclass
from typing import Any, Sequence
from urllib.parse import urlparse

from prep.infrastructure.anki import (
    CardTemplateSpec,
    NoteTypeSpec,
    ensure_deck,
    ensure_note_type,
    find_note_by_external_id,
    upsert_note,
)

from .model import PrototypeLearningObject

NOTE_TYPE_NAME = "Prep Learning Object v2"
DEFAULT_DECK = "Prep::Prototype v2"
EXTERNAL_ID_FIELD = "PrototypeId"
GENERATED_TAG_PREFIXES = (
    "prep-v2::concept::",
    "prep-v2::knowledge-kind::",
    "prep-v2::learning-task::",
    "prep-v2::question-type::",
    "prep-v2::guidance::",
    "prep-v2::stimulus::",
    "prep-v2::response::",
)

FIELDS = (
    "PrototypeId",
    "Concept",
    "KnowledgeKind",
    "LearningTask",
    "QuestionType",
    "GuidanceLevel",
    "StimulusFormat",
    "ResponseFormat",
    "Context",
    "Prompt",
    "Stimulus",
    "ShortAnswer",
    "Explanation",
    "ReasoningSteps",
    "KeyPoints",
    "CorrectArtifact",
    "Pitfall",
    "Alternatives",
    "Sources",
    "ContentVersion",
)

FRONT_TEMPLATE = r"""
<div class="prep-lo">
  <header class="prep-header">
    <div class="prep-concept">{{Concept}}</div>
    <div class="prep-meta">
      <span>{{LearningTask}}</span>
      <span>{{StimulusFormat}}</span>
      <span>{{GuidanceLevel}}</span>
    </div>
  </header>
  {{#Context}}<div class="prep-context">{{Context}}</div>{{/Context}}
  <main>
    <div class="prep-prompt">{{Prompt}}</div>
    {{#Stimulus}}<div class="prep-stimulus">{{Stimulus}}</div>{{/Stimulus}}
  </main>
  <footer class="prep-response">Ответ: {{ResponseFormat}}</footer>
</div>
""".strip()

BACK_TEMPLATE = r"""
{{FrontSide}}
<div class="prep-lo prep-feedback">
  <div class="prep-divider"><span>Разбор</span></div>
  {{#ShortAnswer}}
  <section class="prep-section prep-short-answer">
    <h3>Краткий ответ</h3>
    <div>{{ShortAnswer}}</div>
  </section>
  {{/ShortAnswer}}
  {{#Explanation}}
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
  {{#KeyPoints}}
  <section class="prep-section prep-key-points">
    <h3>Ключевые пункты</h3>
    <div>{{KeyPoints}}</div>
  </section>
  {{/KeyPoints}}
  {{#CorrectArtifact}}
  <section class="prep-section">
    <h3>Эталонный вариант</h3>
    <div>{{CorrectArtifact}}</div>
  </section>
  {{/CorrectArtifact}}
  {{#Pitfall}}
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
  <div class="prep-debug-meta">{{KnowledgeKind}} · {{QuestionType}} · {{PrototypeId}}</div>
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
  padding: 24px 26px;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--surface);
  box-shadow: 0 6px 24px rgba(17, 24, 39, 0.06);
}

.prep-feedback { margin-top: 14px; }
.prep-header { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; margin-bottom: 16px; }
.prep-concept { font-weight: 700; letter-spacing: 0.01em; color: var(--accent); }
.prep-meta { display: flex; flex-wrap: wrap; gap: 6px; justify-content: flex-end; }
.prep-meta span { padding: 2px 8px; border-radius: 999px; background: var(--surface-soft); color: var(--muted); font-size: 0.72em; }
.prep-context { margin: 0 0 12px; color: var(--muted); font-size: 0.86em; font-weight: 600; }
.prep-prompt { margin: 4px 0 18px; font-size: 1.22em; line-height: 1.45; font-weight: 650; }
.prep-stimulus { margin: 16px 0 4px; }
.prep-response { margin-top: 18px; padding-top: 12px; border-top: 1px solid var(--border); color: var(--muted); font-size: 0.76em; }
.prep-divider { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; color: var(--muted); font-size: 0.76em; text-transform: uppercase; letter-spacing: 0.12em; }
.prep-divider::before, .prep-divider::after { content: ""; height: 1px; flex: 1; background: var(--border); }
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
.prep-prose-stimulus { padding: 13px 15px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface-soft); }
.prep-sources { color: var(--muted); font-size: 0.78em; }
.prep-sources a { color: var(--accent); word-break: break-all; }
.prep-debug-meta { margin-top: 22px; padding-top: 10px; border-top: 1px solid var(--border); color: var(--muted); font-size: 0.66em; opacity: 0.8; }

@media (max-width: 600px) {
  .card { padding: 10px 6px 24px; font-size: 17px; }
  .prep-lo { padding: 18px 16px; border-radius: 12px; }
  .prep-header { display: block; }
  .prep-meta { justify-content: flex-start; margin-top: 7px; }
  .prep-prompt { font-size: 1.12em; }
}
""".strip()

NOTE_TYPE_SPEC = NoteTypeSpec(
    name=NOTE_TYPE_NAME,
    fields=FIELDS,
    templates=(CardTemplateSpec(name="Learning Object", front=FRONT_TEMPLATE, back=BACK_TEMPLATE),),
    css=CSS,
)


@dataclass(frozen=True)
class PrototypeSyncResult:
    prototype_id: str
    status: str
    external_ref: str | None = None
    message: str | None = None


class PrototypeAnkiStudySystem:
    def __init__(self, anki: Any, *, deck_name: str = DEFAULT_DECK) -> None:
        self._anki = anki
        self._deck_name = deck_name

    def reconcile(self, objects: Sequence[PrototypeLearningObject], *, dry_run: bool) -> tuple[PrototypeSyncResult, ...]:
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
            return tuple(PrototypeSyncResult(obj.prototype_id, "error", message=f"Anki setup failed: {exc}") for obj in objects)

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
                        results.append(PrototypeSyncResult(obj.prototype_id, "created", str(created.note_id)))
                    continue

                info = self._note_info(note_id)
                if self._matches(info, fields, tags):
                    results.append(PrototypeSyncResult(obj.prototype_id, "unchanged", str(note_id)))
                    continue
                if dry_run:
                    results.append(PrototypeSyncResult(obj.prototype_id, "updated", str(note_id)))
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
                results.append(PrototypeSyncResult(obj.prototype_id, "updated", str(updated.note_id)))
            except RuntimeError as exc:
                status = "conflict" if "Duplicate Anki notes" in str(exc) else "error"
                results.append(PrototypeSyncResult(obj.prototype_id, status, message=str(exc)))
            except Exception as exc:
                results.append(PrototypeSyncResult(obj.prototype_id, "error", message=str(exc)))
        return tuple(results)

    def _note_info(self, note_id: int) -> dict[str, Any]:
        infos = self._anki.invoke("notesInfo", notes=[note_id])
        if len(infos) != 1:
            raise RuntimeError(f"Expected one Anki note for id {note_id}; got {len(infos)}")
        return infos[0]

    @staticmethod
    def _matches(info: dict[str, Any], desired_fields: dict[str, str], desired_tags: list[str]) -> bool:
        current_fields = info.get("fields", {})
        for name, desired in desired_fields.items():
            raw = current_fields.get(name, "")
            current = raw.get("value", "") if isinstance(raw, dict) else str(raw)
            if current != desired:
                return False
        current_tags = set(info.get("tags", []))
        if not set(desired_tags).issubset(current_tags):
            return False
        stale = {tag for tag in current_tags if tag.startswith(GENERATED_TAG_PREFIXES) and tag not in desired_tags}
        return not stale

    def _remove_stale_generated_tags(self, note_id: int, desired_tags: list[str]) -> None:
        current_tags = set(self._note_info(note_id).get("tags", []))
        stale = sorted(tag for tag in current_tags if tag.startswith(GENERATED_TAG_PREFIXES) and tag not in desired_tags)
        if stale:
            self._anki.invoke("removeTags", notes=[note_id], tags=" ".join(stale))


def render_fields(obj: PrototypeLearningObject) -> dict[str, str]:
    feedback = obj.feedback
    fields = {
        "PrototypeId": obj.prototype_id,
        "Concept": _text_html(obj.concept_title),
        "KnowledgeKind": obj.knowledge_kind,
        "LearningTask": obj.learning_task,
        "QuestionType": obj.question_type,
        "GuidanceLevel": obj.guidance_level,
        "StimulusFormat": obj.stimulus_format,
        "ResponseFormat": obj.response_format,
        "Context": _text_html(obj.context),
        "Prompt": _text_html(obj.prompt),
        "Stimulus": _render_stimulus(obj.stimulus, obj.stimulus_format, obj.stimulus_language),
        "ShortAnswer": _text_html(feedback.short_answer),
        "Explanation": _text_html(feedback.explanation),
        "ReasoningSteps": _ordered_list_html(feedback.reasoning_steps),
        "KeyPoints": _list_html(feedback.key_points),
        "CorrectArtifact": _render_artifact(feedback.correct_artifact, feedback.correct_artifact_format, feedback.correct_artifact_language),
        "Pitfall": _text_html(feedback.pitfall),
        "Alternatives": _list_html(feedback.alternatives),
        "Sources": _sources_html(feedback.sources),
    }
    canonical = json.dumps(fields, ensure_ascii=False, sort_keys=True).encode("utf-8")
    fields["ContentVersion"] = hashlib.sha256(canonical).hexdigest()[:16]
    return fields


def render_tags(obj: PrototypeLearningObject) -> list[str]:
    return [
        "prep",
        "prep-v2",
        f"prep-v2::concept::{obj.concept_id}",
        f"prep-v2::knowledge-kind::{obj.knowledge_kind}",
        f"prep-v2::learning-task::{obj.learning_task}",
        f"prep-v2::question-type::{obj.question_type}",
        f"prep-v2::guidance::{obj.guidance_level}",
        f"prep-v2::stimulus::{obj.stimulus_format}",
        f"prep-v2::response::{obj.response_format}",
    ]


def _text_html(value: str) -> str:
    return html.escape(value).replace("\n", "<br>")


def _pre_html(value: str, *, css_class: str) -> str:
    return f'<pre class="{css_class}"><code>{html.escape(value)}</code></pre>'


def _render_stimulus(value: str, format_name: str, language: str) -> str:
    if not value:
        return ""
    if format_name in {"code", "log", "mixed", "diagram"}:
        return _pre_html(value, css_class="prep-code")
    return f'<div class="prep-prose-stimulus">{_text_html(value)}</div>'


def _render_artifact(value: str, format_name: str, language: str) -> str:
    if not value:
        return ""
    if format_name in {"code", "diagram", "query"}:
        return _pre_html(value, css_class="prep-artifact")
    return _text_html(value)


def _list_html(values: Sequence[str]) -> str:
    if not values:
        return ""
    return "<ul>" + "".join(f"<li>{_text_html(value)}</li>" for value in values) + "</ul>"


def _ordered_list_html(values: Sequence[str]) -> str:
    if not values:
        return ""
    return "<ol>" + "".join(f"<li>{_text_html(value)}</li>" for value in values) + "</ol>"


def _sources_html(values: Sequence[str]) -> str:
    if not values:
        return ""
    items: list[str] = []
    for value in values:
        parsed = urlparse(value)
        escaped = html.escape(value)
        if parsed.scheme in {"http", "https"} and parsed.netloc:
            items.append(f'<li><a href="{html.escape(value, quote=True)}">{escaped}</a></li>')
        else:
            items.append(f"<li>{escaped}</li>")
    return "<ul>" + "".join(items) + "</ul>"
