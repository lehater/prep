#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
TAXONOMY_PATH = ROOT / "model" / "question-taxonomy.json"
QUESTIONS_DIR = ROOT / "questions"


class ValidationError(Exception):
    pass


def load_json(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise ValidationError(f"missing file: {path.relative_to(ROOT)}") from exc
    except json.JSONDecodeError as exc:
        raise ValidationError(
            f"invalid JSON in {path.relative_to(ROOT)}: "
            f"line {exc.lineno}, column {exc.colno}: {exc.msg}"
        ) from exc


def require(condition: bool, message: str) -> None:
    if not condition:
        raise ValidationError(message)


def non_empty_string(value: Any) -> bool:
    return isinstance(value, str) and bool(value.strip())


def validate_taxonomy(data: Any) -> tuple[set[str], dict[str, str]]:
    require(isinstance(data, dict), "taxonomy root must be an object")
    require(data.get("version") == "0.1", "taxonomy version must be '0.1'")

    learning_tasks = data.get("learning_tasks")
    question_types = data.get("question_types")
    require(
        isinstance(learning_tasks, dict) and learning_tasks,
        "learning_tasks must be a non-empty object",
    )
    require(
        isinstance(question_types, dict) and question_types,
        "question_types must be a non-empty object",
    )

    task_ids = set(learning_tasks)
    for task_id, spec in learning_tasks.items():
        require(non_empty_string(task_id), "learning task id must be non-empty")
        require(isinstance(spec, dict), f"learning task {task_id!r} must be an object")
        require(
            non_empty_string(spec.get("description")),
            f"learning task {task_id!r} needs description",
        )

    type_to_task: dict[str, str] = {}
    for question_type, spec in question_types.items():
        require(non_empty_string(question_type), "question type id must be non-empty")
        require(
            isinstance(spec, dict),
            f"question type {question_type!r} must be an object",
        )
        task_id = spec.get("learning_task")
        require(
            task_id in task_ids,
            f"question type {question_type!r} references unknown learning task {task_id!r}",
        )
        require(
            non_empty_string(spec.get("answer_evidence")),
            f"question type {question_type!r} needs answer_evidence",
        )
        type_to_task[question_type] = task_id

    return task_ids, type_to_task


def validate_bank(path: Path, data: Any, known_question_types: set[str]) -> set[str]:
    rel = path.relative_to(ROOT)
    require(isinstance(data, dict), f"{rel}: root must be an object")
    require(data.get("version") == "0.1", f"{rel}: version must be '0.1'")
    require(non_empty_string(data.get("bank_id")), f"{rel}: bank_id is required")
    require(non_empty_string(data.get("title")), f"{rel}: title is required")

    concepts = data.get("concepts")
    questions = data.get("questions")
    require(
        isinstance(concepts, list) and concepts,
        f"{rel}: concepts must be a non-empty list",
    )
    require(
        isinstance(questions, list) and questions,
        f"{rel}: questions must be a non-empty list",
    )

    concept_ids: set[str] = set()
    for concept in concepts:
        require(isinstance(concept, dict), f"{rel}: each concept must be an object")
        concept_id = concept.get("id")
        require(non_empty_string(concept_id), f"{rel}: concept id is required")
        require(
            concept_id not in concept_ids,
            f"{rel}: duplicate concept id {concept_id!r}",
        )
        require(
            non_empty_string(concept.get("title")),
            f"{rel}: concept {concept_id!r} needs title",
        )
        concept_ids.add(concept_id)

    question_ids: set[str] = set()
    covered_types: set[str] = set()
    for question in questions:
        require(isinstance(question, dict), f"{rel}: each question must be an object")
        question_id = question.get("id")
        concept_id = question.get("concept_id")
        question_type = question.get("question_type")

        require(non_empty_string(question_id), f"{rel}: question id is required")
        require(
            question_id not in question_ids,
            f"{rel}: duplicate question id {question_id!r}",
        )
        require(
            concept_id in concept_ids,
            f"{rel}: question {question_id!r} references unknown concept {concept_id!r}",
        )
        require(
            question_type in known_question_types,
            f"{rel}: question {question_id!r} uses unknown question type {question_type!r}",
        )
        require(
            non_empty_string(question.get("prompt")),
            f"{rel}: question {question_id!r} needs prompt",
        )

        assessment = question.get("assessment")
        require(
            isinstance(assessment, dict),
            f"{rel}: question {question_id!r} needs assessment object",
        )
        require(
            non_empty_string(assessment.get("reference_answer")),
            f"{rel}: question {question_id!r} needs reference_answer",
        )
        required_points = assessment.get("required_points")
        require(
            isinstance(required_points, list)
            and required_points
            and all(non_empty_string(point) for point in required_points),
            f"{rel}: question {question_id!r} needs non-empty required_points",
        )

        question_ids.add(question_id)
        covered_types.add(question_type)

    return covered_types


def main() -> int:
    try:
        taxonomy = load_json(TAXONOMY_PATH)
        _, type_to_task = validate_taxonomy(taxonomy)
        known_question_types = set(type_to_task)

        bank_paths = sorted(QUESTIONS_DIR.glob("*.json"))
        require(bank_paths, "questions directory contains no .json banks")

        all_question_ids: set[str] = set()
        covered_types: set[str] = set()

        for path in bank_paths:
            bank = load_json(path)
            covered_types.update(validate_bank(path, bank, known_question_types))

            for question in bank["questions"]:
                question_id = question["id"]
                require(
                    question_id not in all_question_ids,
                    f"duplicate question id across banks: {question_id!r}",
                )
                all_question_ids.add(question_id)

        missing_types = known_question_types - covered_types
        require(
            not missing_types,
            f"sample question banks do not cover question types: {sorted(missing_types)}",
        )

        print(
            f"OK: {len(type_to_task)} question types, "
            f"{len(bank_paths)} bank(s), {len(all_question_ids)} question(s)"
        )
        return 0
    except ValidationError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
