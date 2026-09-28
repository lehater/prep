#!/usr/bin/env python3
"""Run the semantic-completeness/Question-loop experiment on current Prep data."""
from __future__ import annotations

import copy
import os
import sys
from pathlib import Path
from typing import Any

import yaml

ROOT = Path(__file__).resolve().parents[2]
HARNESS_ROOT = Path(os.environ.get("HARNESS_ROOT", ROOT / ".harness-tool"))

if not (HARNESS_ROOT / "semantic_questions.py").exists():
    raise SystemExit(
        "Experimental Harness runtime not found. Run python tools/bootstrap_harness.py "
        "or set HARNESS_ROOT."
    )

sys.path.insert(0, str(HARNESS_ROOT))
sys.path.insert(0, str(ROOT / "tools"))

from engineering_graph import evaluate_engineering_target, production_index  # noqa: E402
from semantic_acceptance import evaluate_artifact  # noqa: E402
from semantic_admission import (  # noqa: E402
    effective_knowledge_contract,
    knowledge_contract_index,
)
from semantic_closure import evaluate_semantic_closure  # noqa: E402
from semantic_questions import questions_from_semantic_evaluation  # noqa: E402
from semantic_baseline import (  # noqa: E402
    build_strict_semantic_baseline,
    project_semantic_candidate,
)


def load_yaml(path: Path) -> dict[str, Any]:
    value = yaml.safe_load(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise SystemExit(f"{path} must contain a mapping")
    return value


def artifact_for(core: dict[str, Any], capability: str) -> dict[str, Any]:
    matches = [
        artifact
        for artifact in core.get("artifacts", []) or []
        if capability in (artifact.get("provides", []) or [])
    ]
    if len(matches) != 1:
        raise SystemExit(
            f"Expected one provider for {capability}, got {len(matches)}"
        )
    return matches[0]


def task_semantic_contract(
    graph: dict[str, Any],
    contracts: dict[str, Any],
) -> dict[str, Any]:
    kinds = knowledge_contract_index(contracts)
    kind_contract = effective_knowledge_contract(
        kinds["task-model"],
        "task-model",
        [],
    )
    production = production_index(graph)["prep.task-model"]
    return {
        "authority": "APPLICATION-DESIGN",
        "semantic_claims": [
            item["claim"] if isinstance(item, dict) else item
            for item in production.get("semantic_claims", []) or []
        ],
        "owned_assertion_kinds": list(
            kind_contract.get("owned_assertion_kinds", []) or []
        ),
        "obligations": list(kind_contract.get("obligations", []) or []),
        "compatibility_obligations": list(
            kind_contract.get("compatibility_obligations", []) or []
        ),
        "allowed_source_authorities": [],
        "requires_source_authority": bool(
            kind_contract.get("requires_source_authority", True)
        ),
        "requires_assertion_authority": bool(
            kind_contract.get("requires_assertion_authority", True)
        ),
        "requires_semantic_review": bool(
            kind_contract.get("requires_semantic_review", True)
        ),
        "required_semantic_review_checks": list(
            kind_contract.get("required_review_checks", []) or []
        ),
    }


def task_candidate(
    artifact: dict[str, Any],
    assertions: list[dict[str, Any]],
    dispositions: list[dict[str, Any]],
    semantic_contract: dict[str, Any],
) -> dict[str, Any]:
    return {
        "id": artifact["id"],
        "capability": "prep.task-model",
        "path": artifact["path"],
        "semantic_assertions": assertions,
        "semantic_dispositions": dispositions,
        "semantic_review": {
            "status": "ACCEPTED",
            "checks": semantic_contract["required_semantic_review_checks"],
        },
    }


def main() -> int:
    graph = load_yaml(ROOT / ".harness/engineering-graph.yaml")
    core = load_yaml(ROOT / ".harness/core.yaml")
    registry = load_yaml(HARNESS_ROOT / "skills/artifact-skill-registry-v0.yaml")
    contracts = load_yaml(
        HARNESS_ROOT / "spec/semantic-acceptance/knowledge-kind-contracts-v1.yaml"
    )

    before = evaluate_engineering_target(
        graph,
        "FRONTEND-IMPLEMENTATION",
        core,
    )
    evaluations, lifecycle = build_strict_semantic_baseline(graph, core)
    closure = evaluate_semantic_closure(
        graph=graph,
        model=core,
        target="FRONTEND-IMPLEMENTATION",
        skill_registry=registry,
        semantic_evaluations=evaluations,
        lifecycle=lifecycle,
    )

    problem_eval = next(
        item
        for item in evaluations["semantic_evaluations"]
        if item.get("capability") == "prep.problem-evidence"
    )
    problem_questions = problem_eval.get("question_proposals", [])

    task_artifact = artifact_for(core, "prep.task-model")
    task_assertions, task_dispositions = project_semantic_candidate(
        "task-model",
        task_artifact,
    )
    task_contract = task_semantic_contract(graph, contracts)
    current_task = task_candidate(
        task_artifact,
        task_assertions,
        task_dispositions,
        task_contract,
    )
    task_eval = evaluate_artifact(
        task_contract,
        {"semantic_assertions": []},
        current_task,
    )

    task_ids = [
        item["id"]
        for item in task_assertions
        if item.get("kind") == "task"
    ]
    if not task_ids:
        raise AssertionError("Prep Task Model projection produced no tasks")
    mutated_task_id = task_ids[0]
    mutated_assertions = [
        item
        for item in task_assertions
        if not (
            item.get("kind") == "task-recovery"
            and item.get("subject") == mutated_task_id
        )
    ]
    mutant = copy.deepcopy(current_task)
    mutant["semantic_assertions"] = mutated_assertions
    mutant_eval = evaluate_artifact(
        task_contract,
        {"semantic_assertions": []},
        mutant,
    )
    mutant_questions = questions_from_semantic_evaluation(
        graph=graph,
        capability="prep.task-model",
        evaluation=mutant_eval,
    )

    print(f"structural_before={before['status']}")
    print(f"semantic_closure={closure['status']}")
    print(
        "problem_gap="
        f"{problem_eval['status']} "
        f"findings={problem_eval.get('findings', [])} "
        f"questions={problem_questions}"
    )
    print(
        "task_model_current="
        f"{task_eval['status']} tasks={len(task_ids)} "
        f"findings={task_eval.get('findings', [])}"
    )
    print(
        "task_model_mutant="
        f"{mutant_eval['status']} removed_recovery={mutated_task_id} "
        f"questions={mutant_questions}"
    )

    assert before["status"] == "COMPLETE", before
    assert problem_eval["status"] == "REJECTED", problem_eval
    assert any(
        item.get("code") == "OBLIGATION_QUESTION"
        and item.get("obligation") == "representative-user-validation"
        for item in problem_eval.get("findings", [])
    ), problem_eval
    assert len(problem_questions) == 1, problem_questions
    assert problem_questions[0]["authority"] == "DISCOVERY", problem_questions
    assert problem_questions[0]["blocks_capabilities"] == [
        "prep.problem-evidence"
    ], problem_questions
    assert closure["status"] == "BLOCKED", closure
    assert any(
        item.get("authority") == "DISCOVERY"
        for item in closure.get("question_frontier", [])
    ), closure

    assert task_eval["status"] == "ACCEPTED", task_eval
    assert mutant_eval["status"] == "REJECTED", mutant_eval
    assert any(
        item.get("code") == "MISSING_SUBJECTS"
        and item.get("obligation") == "recovery-per-task"
        and mutated_task_id in (item.get("subjects") or [])
        for item in mutant_eval.get("findings", [])
    ), mutant_eval
    assert len(mutant_questions) == 1, mutant_questions
    assert mutant_questions[0]["authority"] == "APPLICATION-DESIGN", mutant_questions

    print(
        "EXPERIMENT PASS: real Prep structural COMPLETE is blocked by a real "
        "Discovery semantic gap; the current Task Model passes its reusable "
        "completeness contract, while a one-task recovery mutation is detected "
        "and routed to APPLICATION-DESIGN."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
