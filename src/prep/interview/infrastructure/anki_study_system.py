from __future__ import annotations

import hashlib
import html
import json
from typing import Any, Sequence

from prep.infrastructure.anki import (
    CardTemplateSpec,
    NoteTypeSpec,
    ensure_deck,
    ensure_note_type,
    find_note_by_external_id,
    upsert_note,
)
from prep.interview.application.ports import StudyQuestion, StudySyncResult


NOTE_TYPE_NAME = "Prep Question v1"
EXTERNAL_ID_FIELD = "QuestionId"
GENERATED_TAG_PREFIXES = (
    "prep::concept::",
    "prep::question-type::",
    "prep::learning-task::",
)

NOTE_TYPE_SPEC = NoteTypeSpec(
    name=NOTE_TYPE_NAME,
    fields=(
        "QuestionId",
        "Prompt",
        "ReferenceAnswer",
        "RequiredPoints",
        "ConceptId",
        "QuestionType",
        "LearningTask",
        "Sources",
        "ContentVersion",
    ),
    templates=(
        CardTemplateSpec(
            name="Question",
            front='<div class="prep-prompt">{{Prompt}}</div>',
            back=(
                "{{FrontSide}}<hr id=answer>"
                '<div class="prep-answer">{{ReferenceAnswer}}</div>'
                '<div class="prep-points">{{RequiredPoints}}</div>'
                '<div class="prep-sources">{{Sources}}</div>'
            ),
        ),
    ),
    css=(
        ".card { font-family: Arial, sans-serif; font-size: 20px; text-align: left; }\n"
        ".prep-answer { margin-top: 1rem; }\n"
        ".prep-points { margin-top: 1rem; }\n"
        ".prep-sources { margin-top: 1rem; font-size: 0.75em; opacity: 0.7; }"
    ),
)


class InterviewAnkiStudySystem:
    """Anki implementation of the Interview Preparation StudySystem port."""

    def __init__(self, anki: Any, *, deck_name: str = "Prep") -> None:
        self._anki = anki
        self._deck_name = deck_name

    def reconcile_questions(
        self,
        questions: Sequence[StudyQuestion],
        *,
        dry_run: bool,
    ) -> Sequence[StudySyncResult]:
        questions = tuple(questions)
        if not questions:
            return ()

        try:
            model_exists = NOTE_TYPE_NAME in set(self._anki.invoke("modelNames"))
            if not dry_run:
                ensure_deck(self._anki, self._deck_name)
                ensure_note_type(self._anki, NOTE_TYPE_SPEC)
                model_exists = True
        except Exception as exc:  # external adapter boundary
            return tuple(
                StudySyncResult(
                    question_id=question.question_id,
                    status="error",
                    message=f"Anki setup failed: {exc}",
                )
                for question in questions
            )

        results: list[StudySyncResult] = []
        for question in questions:
            try:
                desired_fields = self._fields(question)
                desired_tags = self._tags(question)

                if not model_exists:
                    results.append(
                        StudySyncResult(question_id=question.question_id, status="created")
                    )
                    continue

                note_id = find_note_by_external_id(
                    self._anki,
                    field_name=EXTERNAL_ID_FIELD,
                    external_id=question.question_id,
                    model_name=NOTE_TYPE_NAME,
                )
                if note_id is None:
                    if dry_run:
                        results.append(
                            StudySyncResult(
                                question_id=question.question_id, status="created"
                            )
                        )
                        continue
                    created = upsert_note(
                        self._anki,
                        external_id_field=EXTERNAL_ID_FIELD,
                        external_id=question.question_id,
                        deck_name=self._deck_name,
                        model_name=NOTE_TYPE_NAME,
                        fields=desired_fields,
                        tags=desired_tags,
                    )
                    results.append(
                        StudySyncResult(
                            question_id=question.question_id,
                            status="created",
                            external_ref=str(created.note_id),
                        )
                    )
                    continue

                info = self._note_info(note_id)
                changed = not self._matches(info, desired_fields, desired_tags)
                if not changed:
                    results.append(
                        StudySyncResult(
                            question_id=question.question_id,
                            status="unchanged",
                            external_ref=str(note_id),
                        )
                    )
                    continue

                if dry_run:
                    results.append(
                        StudySyncResult(
                            question_id=question.question_id,
                            status="updated",
                            external_ref=str(note_id),
                        )
                    )
                    continue

                updated = upsert_note(
                    self._anki,
                    external_id_field=EXTERNAL_ID_FIELD,
                    external_id=question.question_id,
                    deck_name=self._deck_name,
                    model_name=NOTE_TYPE_NAME,
                    fields=desired_fields,
                    tags=desired_tags,
                )
                self._remove_stale_generated_tags(updated.note_id, desired_tags)
                results.append(
                    StudySyncResult(
                        question_id=question.question_id,
                        status="updated",
                        external_ref=str(updated.note_id),
                    )
                )
            except RuntimeError as exc:
                if "Duplicate Anki notes" in str(exc):
                    results.append(
                        StudySyncResult(
                            question_id=question.question_id,
                            status="conflict",
                            message=str(exc),
                        )
                    )
                else:
                    results.append(
                        StudySyncResult(
                            question_id=question.question_id,
                            status="error",
                            message=str(exc),
                        )
                    )
            except Exception as exc:  # external adapter boundary
                results.append(
                    StudySyncResult(
                        question_id=question.question_id,
                        status="error",
                        message=str(exc),
                    )
                )

        return tuple(results)

    def _fields(self, question: StudyQuestion) -> dict[str, str]:
        fields = {
            "QuestionId": question.question_id,
            "Prompt": _text_html(question.prompt),
            "ReferenceAnswer": _text_html(question.reference_answer),
            "RequiredPoints": _list_html(question.required_points),
            "ConceptId": question.concept_id,
            "QuestionType": question.question_type,
            "LearningTask": question.learning_task,
            "Sources": _list_html(question.sources),
        }
        canonical = json.dumps(fields, ensure_ascii=False, sort_keys=True).encode("utf-8")
        fields["ContentVersion"] = hashlib.sha256(canonical).hexdigest()[:16]
        return fields

    @staticmethod
    def _tags(question: StudyQuestion) -> list[str]:
        return [
            "prep",
            f"prep::concept::{question.concept_id}",
            f"prep::question-type::{question.question_type}",
            f"prep::learning-task::{question.learning_task}",
        ]

    def _note_info(self, note_id: int) -> dict[str, Any]:
        infos = self._anki.invoke("notesInfo", notes=[note_id])
        if len(infos) != 1:
            raise RuntimeError(f"Expected one Anki note for id {note_id}; got {len(infos)}")
        return infos[0]

    @staticmethod
    def _matches(
        info: dict[str, Any],
        desired_fields: dict[str, str],
        desired_tags: list[str],
    ) -> bool:
        current_fields = info.get("fields", {})
        for name, desired in desired_fields.items():
            value = current_fields.get(name, "")
            current = value.get("value", "") if isinstance(value, dict) else str(value)
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

    def _remove_stale_generated_tags(self, note_id: int, desired_tags: list[str]) -> None:
        info = self._note_info(note_id)
        current_tags = set(info.get("tags", []))
        stale = sorted(
            tag
            for tag in current_tags
            if tag.startswith(GENERATED_TAG_PREFIXES) and tag not in desired_tags
        )
        if stale:
            self._anki.invoke("removeTags", notes=[note_id], tags=" ".join(stale))


def _text_html(value: str) -> str:
    return html.escape(value).replace("\n", "<br>")


def _list_html(values: Sequence[str]) -> str:
    if not values:
        return ""
    items = "".join(f"<li>{_text_html(value)}</li>" for value in values)
    return f"<ul>{items}</ul>"
