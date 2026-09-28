#!/usr/bin/env python3
"""Prep-specific Scenario Suite drivers.

Loaded explicitly by CI through --driver-module. Harness itself does not know
Prep semantics or artifact formats.
"""
from __future__ import annotations

import os
import sys
from pathlib import Path
from typing import Any

import yaml

ROOT = Path(__file__).resolve().parents[2]
HARNESS_ROOT = Path(os.environ.get("HARNESS_ROOT", ROOT / ".harness-tool"))

sys.path.insert(0, str(HARNESS_ROOT))
sys.path.insert(0, str(ROOT / "tools"))

from engineering_graph import production_index  # noqa: E402
from scenario_drivers import scenario_driver  # noqa: E402
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


def _load(path: Path) -> dict[str, Any]:
    value = yaml.safe_load(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise ValueError(f"{path} must contain a mapping")
    return value


@scenario_driver("prep.semantic_baseline")
def prep_semantic_baseline(
    *,
    graph: dict[str, Any],
    core: dict[str, Any],
    target: str,
) -> dict[str, Any]:
    evaluations, lifecycle = build_strict_semantic_baseline(graph, core)
    registry = _load(HARNESS_ROOT / "skills/artifact-skill-registry-v0.yaml")
    closure = evaluate_semantic_closure(
        graph=graph,
        model=core,
        target=target,
        skill_registry=registry,
        semantic_evaluations=evaluations,
        lifecycle=lifecycle,
    )
    rejected = [
        item
        for item in evaluations.get("semantic_evaluations", []) or []
        if item.get("status") != "ACCEPTED"
    ]
    proposals = [
        proposal
        for item in rejected
        for proposal in item.get("question_proposals", []) or []
    ]
    return {
        "closure": closure,
        "rejected": rejected,
        "question_proposals": proposals,
        "evaluated_count": len(
            evaluations.get("semantic_evaluations", []) or []
        ),
        "current_count": len(lifecycle.get("providers", []) or []),
    }


def _task_contract(graph: dict[str, Any]) -> dict[str, Any]:
    contracts = _load(
        HARNESS_ROOT / "spec/semantic-acceptance/knowledge-kind-contracts-v1.yaml"
    )
    by_kind = knowledge_contract_index(contracts)
    overlay_path = ROOT / ".harness/semantic-obligations.yaml"
    overlays = [_load(overlay_path)] if overlay_path.is_file() else []
    contract = effective_knowledge_contract(
        by_kind["task-model"],
        "task-model",
        overlays,
    )
    production = production_index(graph)["prep.task-model"]
    return {
        "authority": "APPLICATION-DESIGN",
        "semantic_claims": [
            item["claim"] if isinstance(item, dict) else item
            for item in production.get("semantic_claims", []) or []
        ],
        "owned_assertion_kinds": list(
            contract.get("owned_assertion_kinds", []) or []
        ),
        "obligations": list(contract.get("obligations", []) or []),
        "compatibility_obligations": list(
            contract.get("compatibility_obligations", []) or []
        ),
        "allowed_source_authorities": [],
        "requires_source_authority": False,
        "requires_assertion_authority": bool(
            contract.get("requires_assertion_authority", True)
        ),
        "requires_semantic_review": bool(
            contract.get("requires_semantic_review", True)
        ),
        "required_semantic_review_checks": list(
            contract.get("required_review_checks", []) or []
        ),
    }


@scenario_driver("prep.task_model_probe")
def prep_task_model_probe(
    *,
    graph: dict[str, Any],
    core: dict[str, Any],
    remove_recovery_from: str | None = None,
) -> dict[str, Any]:
    providers = [
        artifact
        for artifact in core.get("artifacts", []) or []
        if "prep.task-model" in (artifact.get("provides", []) or [])
    ]
    if len(providers) != 1:
        raise ValueError("Prep requires exactly one prep.task-model provider")
    artifact = providers[0]
    assertions, dispositions = project_semantic_candidate("task-model", artifact)
    if remove_recovery_from is not None:
        assertions = [
            item
            for item in assertions
            if not (
                item.get("kind") == "task-recovery"
                and item.get("subject") == remove_recovery_from
            )
        ]

    contract = _task_contract(graph)
    candidate = {
        "id": artifact["id"],
        "capability": "prep.task-model",
        "path": artifact["path"],
        "semantic_assertions": assertions,
        "semantic_dispositions": dispositions,
        "semantic_review": {
            "status": "ACCEPTED",
            "checks": contract["required_semantic_review_checks"],
        },
    }
    evaluation = evaluate_artifact(
        contract,
        {"semantic_assertions": []},
        candidate,
    )
    questions = questions_from_semantic_evaluation(
        graph=graph,
        capability="prep.task-model",
        evaluation=evaluation,
    )
    task_ids = [
        item["id"]
        for item in assertions
        if item.get("kind") == "task"
    ]
    return {
        "status": evaluation["status"],
        "findings": evaluation.get("findings", []),
        "questions": questions,
        "task_count": len(task_ids),
        "mutated_task": remove_recovery_from,
    }
