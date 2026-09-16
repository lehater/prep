from __future__ import annotations

import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any

ID_RE = re.compile(r"^[a-z0-9]+(?:[.-][a-z0-9]+)*$")
CYRILLIC_RE = re.compile(r"[А-Яа-яЁё]")

KNOWLEDGE_KINDS = {
    "artifact", "construct", "mechanism", "model", "pattern", "practice",
    "problem", "property", "result", "structure", "technology",
}
GUIDANCE_LEVELS = {"worked", "faded", "independent"}
STIMULUS_FORMATS = {"none", "prose", "scenario", "code", "log", "mixed", "diagram"}
RESPONSE_FORMATS = {
    "free-recall", "self-explanation", "comparison", "trace-table",
    "code-completion", "code-repair", "code-writing", "architecture-sketch",
}
ARTIFACT_FORMATS = {"none", "prose", "code", "diagram", "query"}


class PrototypeValidationError(ValueError):
    pass


@dataclass(frozen=True)
class FeedbackBlocks:
    short_answer: str
    explanation: str
    reasoning_steps: tuple[str, ...] = ()
    key_points: tuple[str, ...] = ()
    correct_artifact: str = ""
    correct_artifact_format: str = "none"
    correct_artifact_language: str = ""
    pitfall: str = ""
    alternatives: tuple[str, ...] = ()
    sources: tuple[str, ...] = ()


@dataclass(frozen=True)
class PrototypeLearningObject:
    prototype_id: str
    concept_id: str
    concept_title: str
    knowledge_kind: str
    learning_task: str
    question_type: str
    guidance_level: str
    stimulus_format: str
    response_format: str
    prompt: str
    context: str = ""
    stimulus: str = ""
    stimulus_language: str = ""
    feedback: FeedbackBlocks = FeedbackBlocks("", "")


def _require(condition: bool, message: str) -> None:
    if not condition:
        raise PrototypeValidationError(message)


def _text(value: Any, field: str, *, allow_empty: bool = False) -> str:
    _require(isinstance(value, str), f"{field} must be a string")
    value = value.strip()
    if not allow_empty:
        _require(bool(value), f"{field} must be non-empty")
    return value


def _strings(value: Any, field: str) -> tuple[str, ...]:
    _require(isinstance(value, list), f"{field} must be a list")
    result = tuple(_text(item, field) for item in value)
    return result


def _load_taxonomy(path: Path) -> dict[str, str]:
    data = json.loads(path.read_text(encoding="utf-8"))
    return {
        question_type: spec["learning_task"]
        for question_type, spec in data["question_types"].items()
    }


def load_prototypes(path: Path, taxonomy_path: Path) -> tuple[PrototypeLearningObject, ...]:
    data = json.loads(path.read_text(encoding="utf-8"))
    _require(data.get("version") == "0.1", "prototype dataset version must be 0.1")
    objects = data.get("objects")
    _require(isinstance(objects, list) and objects, "objects must be a non-empty list")
    type_to_task = _load_taxonomy(taxonomy_path)

    seen: set[str] = set()
    result: list[PrototypeLearningObject] = []
    for index, raw in enumerate(objects):
        prefix = f"objects[{index}]"
        _require(isinstance(raw, dict), f"{prefix} must be an object")
        prototype_id = _text(raw.get("prototype_id"), f"{prefix}.prototype_id")
        concept_id = _text(raw.get("concept_id"), f"{prefix}.concept_id")
        _require(ID_RE.fullmatch(prototype_id) is not None, f"invalid prototype_id {prototype_id!r}")
        _require(ID_RE.fullmatch(concept_id) is not None, f"invalid concept_id {concept_id!r}")
        _require(prototype_id not in seen, f"duplicate prototype_id {prototype_id!r}")
        seen.add(prototype_id)

        knowledge_kind = _text(raw.get("knowledge_kind"), f"{prefix}.knowledge_kind")
        guidance_level = _text(raw.get("guidance_level"), f"{prefix}.guidance_level")
        stimulus_format = _text(raw.get("stimulus_format"), f"{prefix}.stimulus_format")
        response_format = _text(raw.get("response_format"), f"{prefix}.response_format")
        question_type = _text(raw.get("question_type"), f"{prefix}.question_type")
        learning_task = _text(raw.get("learning_task"), f"{prefix}.learning_task")

        _require(knowledge_kind in KNOWLEDGE_KINDS, f"unknown KnowledgeKind {knowledge_kind!r}")
        _require(guidance_level in GUIDANCE_LEVELS, f"unknown GuidanceLevel {guidance_level!r}")
        _require(stimulus_format in STIMULUS_FORMATS, f"unknown StimulusFormat {stimulus_format!r}")
        _require(response_format in RESPONSE_FORMATS, f"unknown ResponseFormat {response_format!r}")
        _require(question_type in type_to_task, f"unknown QuestionType {question_type!r}")
        _require(type_to_task[question_type] == learning_task, f"{question_type!r} maps to {type_to_task[question_type]!r}, not {learning_task!r}")

        prompt = _text(raw.get("prompt"), f"{prefix}.prompt")
        _require(CYRILLIC_RE.search(prompt) is not None, f"{prototype_id}: prompt needs Russian explanatory prose")
        feedback_raw = raw.get("feedback")
        _require(isinstance(feedback_raw, dict), f"{prefix}.feedback must be an object")
        short_answer = _text(feedback_raw.get("short_answer"), f"{prefix}.feedback.short_answer")
        explanation = _text(feedback_raw.get("explanation"), f"{prefix}.feedback.explanation")
        _require(CYRILLIC_RE.search(short_answer) is not None, f"{prototype_id}: short_answer needs Russian explanatory prose")
        _require(CYRILLIC_RE.search(explanation) is not None, f"{prototype_id}: explanation needs Russian explanatory prose")

        artifact_format = _text(
            feedback_raw.get("correct_artifact_format", "none"),
            f"{prefix}.feedback.correct_artifact_format",
        )
        _require(artifact_format in ARTIFACT_FORMATS, f"unknown CorrectArtifact format {artifact_format!r}")

        feedback = FeedbackBlocks(
            short_answer=short_answer,
            explanation=explanation,
            reasoning_steps=_strings(feedback_raw.get("reasoning_steps", []), f"{prefix}.feedback.reasoning_steps"),
            key_points=_strings(feedback_raw.get("key_points", []), f"{prefix}.feedback.key_points"),
            correct_artifact=_text(feedback_raw.get("correct_artifact", ""), f"{prefix}.feedback.correct_artifact", allow_empty=True),
            correct_artifact_format=artifact_format,
            correct_artifact_language=_text(feedback_raw.get("correct_artifact_language", ""), f"{prefix}.feedback.correct_artifact_language", allow_empty=True),
            pitfall=_text(feedback_raw.get("pitfall", ""), f"{prefix}.feedback.pitfall", allow_empty=True),
            alternatives=_strings(feedback_raw.get("alternatives", []), f"{prefix}.feedback.alternatives"),
            sources=_strings(feedback_raw.get("sources", []), f"{prefix}.feedback.sources"),
        )

        stimulus = _text(raw.get("stimulus", ""), f"{prefix}.stimulus", allow_empty=True)
        if stimulus_format == "none":
            _require(not stimulus, f"{prototype_id}: stimulus must be empty when format is none")
        else:
            _require(bool(stimulus), f"{prototype_id}: stimulus is required for {stimulus_format}")

        result.append(
            PrototypeLearningObject(
                prototype_id=prototype_id,
                concept_id=concept_id,
                concept_title=_text(raw.get("concept_title"), f"{prefix}.concept_title"),
                knowledge_kind=knowledge_kind,
                learning_task=learning_task,
                question_type=question_type,
                guidance_level=guidance_level,
                stimulus_format=stimulus_format,
                response_format=response_format,
                prompt=prompt,
                context=_text(raw.get("context", ""), f"{prefix}.context", allow_empty=True),
                stimulus=stimulus,
                stimulus_language=_text(raw.get("stimulus_language", ""), f"{prefix}.stimulus_language", allow_empty=True),
                feedback=feedback,
            )
        )

    return tuple(result)
