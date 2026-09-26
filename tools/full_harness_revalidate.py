#!/usr/bin/env python3
from __future__ import annotations

import os
import sys
from pathlib import Path
from typing import Any

import yaml

ROOT = Path(__file__).resolve().parents[1]
HARNESS_ROOT = Path(os.environ.get("HARNESS_ROOT", ROOT / ".harness-tool"))

if not (HARNESS_ROOT / "engineering_graph.py").exists():
    raise SystemExit(
        "Pinned Harness runtime not found. Run python tools/bootstrap_harness.py "
        "or set HARNESS_ROOT."
    )

sys.path.insert(0, str(HARNESS_ROOT))

from engineering_graph import evaluate_engineering_target  # noqa: E402
from engineering_coverage import evaluate_with_repository_policy  # noqa: E402
from graph_doctor import diagnose_project  # noqa: E402
from project_status import (  # noqa: E402
    bootstrap_registry,
    status as project_status,
    validate_registry,
)
from semantic_closure import evaluate_semantic_closure  # noqa: E402

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
            "Authority assessment registry is not reconciled with the pinned "
            "Harness catalog. Run project bootstrap/reconcile."
        )
    print(
        f"Authority registry: RECONCILED "
        f"({len(assessments.get('assessments', []))} reference Authorities)"
    )

    consumers = [
        item["id"]
        for item in graph.get("consumers", []) or []
        if isinstance(item, dict) and item.get("id")
    ]
    semantic_evaluations, lifecycle = build_strict_semantic_baseline(graph, core)

    doctor_warnings = []
    for consumer in consumers:
        doctor = diagnose_project(
            graph,
            model=core,
            target=consumer,
            source_root=ROOT,
        )
        summary = doctor["summary"]
        print(
            f"{consumer} Graph Doctor: "
            f"errors={summary['ERROR']} warnings={summary['WARN']} info={summary['INFO']}"
        )
        if summary["ERROR"]:
            raise SystemExit(
                f"{consumer} Graph Doctor errors: {doctor['findings']}"
            )
        doctor_warnings.extend(
            row for row in doctor["findings"] if row["severity"] == "WARN"
        )

        structural = evaluate_engineering_target(graph, consumer, core)
        print(f"{consumer} structural: {structural['status']}")
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
            print(
                f"{consumer} Engineering Coverage[{scope}]: "
                f"completion_ready={coverage['completion_ready']} "
                f"remaining_work={coverage['remaining_work_count']} "
                f"questions={coverage['question_frontier_count']}"
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

    if doctor_warnings:
        print("Graph Doctor warnings:")
        for row in doctor_warnings:
            print(f"  {row['code']}: {row['message']}")
    else:
        print("Graph Doctor: no warnings across declared Consumers")

    status_doc = project_status(catalog, assessments, core)
    states: dict[str, int] = {}
    blocked = []
    for row in status_doc["rows"]:
        key = row["applicability"]
        states[key] = states.get(key, 0) + 1
        if row.get("operational_status") == "BLOCKED":
            blocked.append(
                {
                    "authority": row["authority"],
                    "questions": row.get("blocking", []),
                }
            )
    print(
        "Project Engineering Status applicability: "
        + ", ".join(f"{k}={v}" for k, v in sorted(states.items()))
    )
    if blocked:
        print("Project-wide unresolved Authority questions (may be outside selected Consumer closure):")
        for row in blocked:
            print(f"  {row['authority']}: {', '.join(row['questions'])}")

    unresolved = [
        q
        for q in core.get("questions", []) or []
        if isinstance(q, dict) and q.get("resolution") is None
    ]
    print(
        f"Core unresolved semantic frontier: {len(unresolved)} "
        f"question(s): {', '.join(q['id'] for q in unresolved) if unresolved else '-'}"
    )

    print("FULL HARNESS REVALIDATION PASS (machine-checkable closure)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
