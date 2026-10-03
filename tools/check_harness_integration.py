#!/usr/bin/env python3
from __future__ import annotations

import copy
import os
import re
import sys
from pathlib import Path

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

from harness.project_model.engineering_graph import (  # noqa: E402
    evaluate_engineering_target,
    validate_engineering_graph,
)
from harness.application.project_publication import read_project_publication  # noqa: E402
from harness.application.graph_doctor import diagnose_project  # noqa: E402
from harness.workspace.workspace import validate_knowledge_document  # noqa: E402
from harness.workspace.frontend_interface_knowledge import (  # noqa: E402
    evaluate_frontend_ux_closure,
    evaluate_topology_screen_subject_coverage,
)


def load(path: str) -> dict:
    value = yaml.safe_load((ROOT / path).read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise SystemExit(f"{path} must contain a mapping")
    return value


def extract_screen_subjects(path: str) -> list[str]:
    text = (ROOT / path).read_text(encoding="utf-8")

    # Current Prep Screen/View Design is a structured YAML contract even though
    # the canonical path retains its historical .md extension. Prefer structured
    # subjects; keep heading extraction only for older artifacts.
    try:
        document = yaml.safe_load(text)
    except yaml.YAMLError:
        document = None

    if isinstance(document, dict) and isinstance(document.get("views"), list):
        subjects = [
            row.get("id")
            for row in document["views"]
            if isinstance(row, dict)
            and isinstance(row.get("id"), str)
            and row["id"]
        ]
    else:
        subjects = re.findall(
            r"(?m)^#{2,3}\s+\[([A-Z0-9][A-Z0-9-]*)\]\s+",
            text,
        )

    duplicates = sorted({item for item in subjects if subjects.count(item) > 1})
    if duplicates:
        raise SystemExit(f"Duplicate Screen/View subject ids in {path}: {duplicates}")
    return subjects


def project_task_model_for_frontend_closure(task_model: dict) -> dict:
    """Shape-only projection from Prep's flat tasks to Harness goal.tasks."""
    projected = copy.deepcopy(task_model)
    top_level = projected.get("tasks")
    goals = projected.get("goals")
    if not isinstance(top_level, list) or not isinstance(goals, list):
        return projected

    by_goal = {
        goal.get("id"): goal
        for goal in goals
        if isinstance(goal, dict) and isinstance(goal.get("id"), str)
    }
    if not by_goal:
        return projected

    for goal in by_goal.values():
        if not isinstance(goal.get("tasks"), list):
            goal["tasks"] = []

    nested_ids = {
        row.get("id")
        for goal in by_goal.values()
        for row in goal.get("tasks", [])
        if isinstance(row, dict) and isinstance(row.get("id"), str)
    }
    for task in top_level:
        if not isinstance(task, dict):
            continue
        task_id = task.get("id")
        goal_ref = task.get("goal_ref")
        if (
            isinstance(task_id, str)
            and task_id not in nested_ids
            and goal_ref in by_goal
        ):
            by_goal[goal_ref]["tasks"].append(copy.deepcopy(task))
    return projected


def project_conceptual_model_for_frontend_closure(
    conceptual_model: dict,
) -> dict:
    """Map Prep's explicit NOT_REQUIRED mode disposition to evaluator [] form."""
    projected = copy.deepcopy(conceptual_model)
    modes = projected.get("modes")
    if isinstance(modes, dict) and modes.get("status") == "NOT_REQUIRED":
        projected["modes"] = []
    return projected


def project_information_architecture_for_frontend_closure(
    information_architecture: dict,
) -> dict:
    """Expose the canonical IA root as a closure location without changing IA."""
    projected = copy.deepcopy(information_architecture)
    locations = projected.get("locations")
    root = projected.get("root")
    if not isinstance(locations, list) or not isinstance(root, dict):
        return projected

    root_id = root.get("id")
    if (
        isinstance(root_id, str)
        and root_id
        and not any(
            isinstance(row, dict) and row.get("id") == root_id
            for row in locations
        )
    ):
        projected["locations"] = [
            {
                "id": root_id,
                "purpose": root.get("purpose"),
                "concept_refs": root.get(
                    "concept_refs",
                    root.get("conceptual_refs", []),
                ),
            },
            *locations,
        ]
    return projected


def project_topology_for_frontend_closure(topology: dict) -> dict:
    """Map Prep topology aliases/sentinel return to Harness closure form."""
    projected = copy.deepcopy(topology)
    views = projected.get("views")
    if not isinstance(views, list):
        return projected

    return_entry_to_view = {
        "contextual-entry-from-target": "VIEW-TARGET",
        "contextual-entry-from-current": "VIEW-CURRENT",
        "contextual-entry-from-knowledge": "VIEW-KNOWLEDGE",
        "contextual-entry-from-activity": "VIEW-ACTIVITY",
    }

    for view in views:
        if not isinstance(view, dict):
            continue

        if "location_ref" not in view and isinstance(
            view.get("ia_location_ref"), str
        ):
            view["location_ref"] = view["ia_location_ref"]

        exits = view.get("exits")
        if not isinstance(exits, list) or "originating-view" not in exits:
            continue

        concrete_returns = [
            return_entry_to_view[entry]
            for entry in view.get("entries", [])
            if entry in return_entry_to_view
        ]
        if concrete_returns:
            view["exits"] = [
                exit_ref
                for exit_ref in exits
                if exit_ref != "originating-view"
            ] + concrete_returns

    return projected


def main() -> int:
    graph = load(".harness/engineering-graph.yaml")
    core = load(".harness/core.yaml")
    validate_engineering_graph(graph)

    publication = read_project_publication(
        ROOT / ".harness/project-publication.yaml",
        graph=graph,
    )
    if publication["state"]["core_model"] != core:
        raise SystemExit(
            ".harness/core.yaml differs from the atomically published Core model"
        )

    for artifact in core.get("artifacts", []):
        path = artifact.get("path")
        if path and not (ROOT / path).is_file():
            raise SystemExit(f"Harness artifact path does not exist: {path}")

    current_capabilities = {
        item.get("capability")
        for item in publication["state"]["lifecycle"].get("providers", [])
        if isinstance(item, dict) and item.get("capability")
    }

    frontend_ux_capabilities = {
        "prep.task-model",
        "prep.conceptual-interface-model",
        "prep.information-architecture",
        "prep.interaction-design",
        "prep.interface-topology",
    }
    if frontend_ux_capabilities <= current_capabilities:
        ux = evaluate_frontend_ux_closure(
            project_task_model_for_frontend_closure(
                load("docs/application/task-model.yaml")
            ),
            project_conceptual_model_for_frontend_closure(
                load("docs/interface/conceptual-interface-model.yaml")
            ),
            project_information_architecture_for_frontend_closure(
                load("docs/interface/information-architecture.yaml")
            ),
            load("docs/interface/interaction-design.yaml"),
            project_topology_for_frontend_closure(
                load("docs/interface/interface-topology.yaml")
            ),
        )
        if ux.get("status") != "ACCEPTED":
            raise SystemExit(f"Frontend UX closure rejected: {ux.get('findings')}")
    else:
        missing = sorted(frontend_ux_capabilities - current_capabilities)
        print(
            "Frontend UX closure deferred until dependent capabilities are CURRENT: "
            + ", ".join(missing)
        )

    screen_coverage_capabilities = {
        "prep.interface-topology",
        "prep.screen-view-design",
    }
    if screen_coverage_capabilities <= current_capabilities:
        coverage = evaluate_topology_screen_subject_coverage(
            load("docs/interface/interface-topology.yaml"),
            extract_screen_subjects("docs/interface/screen-view-design.md"),
        )
        if coverage.get("status") != "ACCEPTED":
            raise SystemExit(
                "Screen/View subject coverage rejected: "
                f"{coverage.get('findings')}"
            )
    else:
        missing = sorted(screen_coverage_capabilities - current_capabilities)
        print(
            "Screen/View subject coverage deferred until dependent capabilities are CURRENT: "
            + ", ".join(missing)
        )

    if "prep.frontend-test-design" in current_capabilities:
        test_design = load("docs/verification/frontend-test-design.yaml")
        validate_knowledge_document(test_design)
    else:
        print(
            "Frontend test-design validation deferred until "
            "prep.frontend-test-design is CURRENT"
        )

    doctor_model = dict(core)
    doctor_model["authorities"] = [
        {"id": item["id"]}
        for item in graph.get("authorities", [])
        if isinstance(item, dict) and item.get("id")
    ]
    doctor = diagnose_project(
        graph,
        model=doctor_model,
        target="FRONTEND-PROTOTYPE",
        source_root=ROOT,
    )
    if doctor["summary"]["ERROR"]:
        raise SystemExit(f"Graph Doctor errors: {doctor['findings']}")

    for target in (
        "CURRENT-REVALIDATION",
        "FRONTEND-PROTOTYPE",
        "FRONTEND-IMPLEMENTATION",
    ):
        result = evaluate_engineering_target(graph, target, core)
        print(
            f"{target}: structural={result.get('status')} "
            f"implementation_consumer={result.get('implementation_consumer')}"
        )

    print(
        "Prep pinned Harness integration PASS "
        "(publication integrity + structural/frontend consistency; "
        "semantic currentness is enforced by lifecycle/full revalidation)"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
