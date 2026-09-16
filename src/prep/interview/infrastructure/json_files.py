from __future__ import annotations

import json
from pathlib import Path

from prep.interview.domain import Concept, Question, QuestionAssessment, QuestionBank


def _load_json(path: Path) -> dict:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"Cannot load JSON from {path}: {exc}") from exc
    if not isinstance(data, dict):
        raise ValueError(f"Expected JSON object in {path}")
    return data


def load_question_bank(path: Path) -> QuestionBank:
    data = _load_json(path)
    concepts = tuple(
        Concept(
            id=str(item["id"]),
            title=str(item["title"]),
            sources=tuple(str(source) for source in item.get("sources", [])),
        )
        for item in data.get("concepts", [])
    )
    questions = tuple(
        Question(
            id=str(item["id"]),
            concept_id=str(item["concept_id"]),
            question_type=str(item["question_type"]),
            prompt=str(item["prompt"]),
            assessment=QuestionAssessment(
                reference_answer=str(item["assessment"]["reference_answer"]),
                required_points=tuple(
                    str(point) for point in item["assessment"].get("required_points", [])
                ),
            ),
        )
        for item in data.get("questions", [])
    )
    return QuestionBank(
        id=str(data["bank_id"]),
        title=str(data["title"]),
        concepts=concepts,
        questions=questions,
    )


def load_learning_task_mapping(path: Path) -> dict[str, str]:
    data = _load_json(path)
    question_types = data.get("question_types", {})
    if not isinstance(question_types, dict):
        raise ValueError(f"Expected question_types object in {path}")
    return {
        str(question_type): str(definition["learning_task"])
        for question_type, definition in question_types.items()
    }
