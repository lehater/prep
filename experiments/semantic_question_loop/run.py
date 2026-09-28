#!/usr/bin/env python3
"""Real-data experiment for Harness semantic gap -> Question loop."""
from __future__ import annotations

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
        "or set HARNESS_ROOT to lehater/harness@experiment/semantic-question-loop."
    )

sys.path.insert(0, str(HARNESS_ROOT))

from engineering_graph import evaluate_engineering_target  # noqa: E402
from semantic_admission import admit_artifact  # noqa: E402
from semantic_questions import append_question_proposals  # noqa: E402


def load_yaml(path: Path) -> dict[str, Any]:
    value = yaml.safe_load(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise SystemExit(f"{path} must contain a mapping")
    return value


def main() -> int:
    graph = load_yaml(ROOT / ".harness/engineering-graph.yaml")
    core = load_yaml(ROOT / ".harness/core.yaml")
    registry = load_yaml(HARNESS_ROOT / "skills/artifact-skill-registry-v0.yaml")

    problem_path = ROOT / "docs/vision/problem-space.md"
    problem_text = problem_path.read_text(encoding="utf-8")

    provisional_marker = (
        "Current user-model gate: **PROVISIONAL-FOR-RESEARCH**"
    )
    representative_validated_marker = (
        "Current user-model gate: **REPRESENTATIVE-USER-VALIDATED**"
    )

    if representative_validated_marker in problem_text:
        assertions = [
            {
                "id": "REPRESENTATIVE-USER-VALIDATION",
                "kind": "representative-user-validation",
                "subject": "user-model",
                "semantic_value": "validated",
                "decision_authority": "DISCOVERY",
            }
        ]
    elif provisional_marker in problem_text:
        assertions = []
    else:
        raise SystemExit(
            "Experiment cannot classify current user-model validation gate."
        )

    contracts = {
        "version": 1,
        "kind": "harness-knowledge-kind-semantic-contracts",
        "defaults": {
            "requires_assertion_authority": True,
            "requires_source_authority": False,
            "requires_semantic_review": True,
            "required_review_checks": [
                "source-discipline",
                "authority-boundary",
                "no-invention",
            ],
        },
        "contracts": [
            {
                "knowledge_kind": "problem-evidence",
                "owned_assertion_kinds": [
                    "representative-user-validation",
                ],
                "obligations": [
                    {
                        "id": "representative-user-validation",
                        "kind": "representative-user-validation",
                    }
                ],
                "required_review_checks": ["evidence-not-solution"],
            }
        ],
    }

    candidate = {
        "id": "PROBLEM-SPACE",
        "capability": "prep.problem-evidence",
        "path": "docs/vision/problem-space.md",
        "changed_paths": [],
        "canonical_references": [],
        "semantic_assertions": assertions,
        "semantic_review": {
            "status": "ACCEPTED",
            "checks": [
                "source-discipline",
                "authority-boundary",
                "no-invention",
                "evidence-not-solution",
            ],
        },
    }

    evaluation = admit_artifact(
        graph=graph,
        model=core,
        skill_registry=registry,
        knowledge_contracts=contracts,
        capability="prep.problem-evidence",
        sources={"semantic_assertions": []},
        candidate=candidate,
        acceptance_id="PREP-SEMANTIC-QUESTION-EXPERIMENT",
    )

    before = evaluate_engineering_target(
        graph,
        "FRONTEND-IMPLEMENTATION",
        core,
    )
    questioned_core = append_question_proposals(
        core,
        evaluation.get("question_proposals", []),
    )
    after = evaluate_engineering_target(
        graph,
        "FRONTEND-IMPLEMENTATION",
        questioned_core,
    )

    print(f"Before semantic gap projection: {before['status']}")
    print(f"Problem evidence semantic admission: {evaluation['status']}")
    for question in evaluation.get("question_proposals", []):
        print(
            "Generated Question: "
            f"{question['id']} -> {question['authority']} "
            f"blocks={question['blocks_capabilities']}"
        )
    print(f"After Question projection: {after['status']}")

    assert before["status"] == "COMPLETE", before
    assert evaluation["status"] == "REJECTED", evaluation
    assert any(
        item.get("code") == "MISSING_OBLIGATION"
        and item.get("obligation") == "representative-user-validation"
        for item in evaluation.get("findings", [])
    ), evaluation
    proposals = evaluation.get("question_proposals", [])
    assert len(proposals) == 1, proposals
    assert proposals[0]["authority"] == "DISCOVERY", proposals[0]
    assert proposals[0]["blocks_capabilities"] == [
        "prep.problem-evidence"
    ], proposals[0]
    assert after["status"] == "BLOCKED", after

    print(
        "EXPERIMENT PASS: an explicit real upstream evidence gap that previously "
        "coexisted with structural COMPLETE becomes a routed blocking Question."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
