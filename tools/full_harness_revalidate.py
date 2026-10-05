#!/usr/bin/env python3
from __future__ import annotations

import os
import sys
from pathlib import Path
from typing import Any

import yaml

ROOT = Path(__file__).resolve().parents[1]
HARNESS_ROOT = Path(os.environ.get("HARNESS_ROOT", ROOT / ".harness-tool"))
if not HARNESS_ROOT.is_absolute():
    HARNESS_ROOT = (ROOT / HARNESS_ROOT).resolve()
HARNESS_SRC = HARNESS_ROOT / "src"

if not (HARNESS_SRC / "harness/project_model/engineering_graph.py").exists():
    raise SystemExit(
        "Pinned Harness package runtime not found. Run python tools/bootstrap_harness.py "
        "or set HARNESS_ROOT to a current Harness checkout."
    )

sys.path.insert(0, str(HARNESS_SRC))

from harness.project_model.engineering_graph import evaluate_engineering_target  # noqa: E402
from harness.coverage.engineering_coverage import evaluate_with_repository_policy  # noqa: E402
from harness.application.graph_doctor import diagnose_project  # noqa: E402
from harness.reference_model.project_status import (  # noqa: E402
    bootstrap_registry,
    status as project_status,
    validate_registry,
)
from harness.application.semantic_closure import evaluate_semantic_closure  # noqa: E402

from semantic_baseline import build_strict_semantic_baseline  # noqa: E402


def load(path: Path) -> dict[str, Any]:
    value = yaml.safe_load(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise SystemExit(f"{path} must contain a mapping")
    return value


def main() -> int:
    graph = load(ROOT / ".harness/engineering-graph.yaml")
    core = load(ROOT / ".harness/core.yaml")
    assessments = load(ROOT / ".harness/authority-assessments.yaml")
    coverage_overlay = load(ROOT / ".harness/engineering-coverage.yaml")
    catalog = load(HARNESS_ROOT / "catalogs/software-authorities-v0.yaml")
    skill_registry = load(HARNESS_ROOT / "skills/artifact-skill-registry-v0.yaml")
    decision_policy = load(
        ROOT / ".harness/candidates/application-design-decision-policy.yaml"
    )

    errors = validate_registry(catalog, assessments)
    if errors:
        raise SystemExit("Authority assessment registry invalid: " + "; ".join(errors))

    reconciled = bootstrap_registry(catalog, assessments, core)
    if reconciled.get("migration_conflicts"):
        raise SystemExit(
            "Authority reconciliation contains migration conflicts: "
            + repr(reconciled["migration_conflicts"])
        )
    if reconciled.get("assessments") != assessments.get("assessments"):
        raise SystemExit(
            "Authority assessment registry is not reconciled with the pinned Harness catalog."
        )

    consumers = [
        item["id"]
        for item in graph.get("consumers", [])
        if isinstance(item, dict) and item.get("id")
    ]
    semantic_evaluations, lifecycle = build_strict_semantic_baseline(graph, core)

    doctor_model = dict(core)
    doctor_model["authorities"] = [
        {"id": item["id"]}
        for item in graph.get("authorities", [])
        if isinstance(item, dict) and item.get("id")
    ]

    for consumer in consumers:
        doctor = diagnose_project(
            graph,
            model=doctor_model,
            target=consumer,
            source_root=ROOT,
        )
        if doctor["summary"]["ERROR"]:
            raise SystemExit(f"{consumer} Graph Doctor errors: {doctor['findings']}")

        structural = evaluate_engineering_target(graph, consumer, core)
        if structural["status"] != "COMPLETE":
            raise SystemExit(
                f"{consumer} structural closure is {structural['status']}: "
                f"create={structural.get('create')} wait={structural.get('wait')} "
                f"pending={structural.get('pending')}"
            )

        closure = evaluate_semantic_closure(
            graph=graph,
            model=core,
            target=consumer,
            skill_registry=skill_registry,
            semantic_evaluations=semantic_evaluations,
            lifecycle=lifecycle,
            decision_policy=decision_policy,
        )
        print(f"{consumer} strict semantic/currentness: {closure['status']}")
        if closure["status"] != "COMPLETE":
            raise SystemExit(
                f"{consumer} semantic closure incomplete: "
                f"semantic_gaps={closure['semantic_gaps']} "
                f"currentness_gaps={closure['currentness_gaps']}"
            )

        if structural.get("implementation_consumer"):
            scope = "frontend" if consumer == "FRONTEND-IMPLEMENTATION" else "default"
            coverage = evaluate_with_repository_policy(
                graph=graph,
                realization=core,
                consumer=consumer,
                scope=scope,
                project_overlay=coverage_overlay,
                semantic_evaluations=semantic_evaluations,
            )
            if (
                not coverage["completion_ready"]
                or coverage["remaining_work_count"]
                or coverage["question_frontier_count"]
            ):
                raise SystemExit(
                    f"{consumer} engineering coverage incomplete: "
                    f"{coverage['work_items']}"
                )

    status_doc = project_status(catalog, assessments, core)
    unassessed = [
        row["authority"]
        for row in status_doc["rows"]
        if row.get("applicability") == "UNASSESSED"
    ]
    if unassessed:
        raise SystemExit(
            "Full Harness revalidation requires every reference Authority to be assessed; "
            "UNASSESSED: " + ", ".join(sorted(unassessed))
        )

    print("FULL HARNESS REVALIDATION PASS (all selected consumers CURRENT)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
