#!/usr/bin/env python3
from __future__ import annotations

import copy
import os
import sys
from pathlib import Path
from typing import Any

import yaml

ROOT = Path(__file__).resolve().parents[1]
HARNESS_ROOT = Path(os.environ["HARNESS_ROOT"]).resolve()
sys.path.insert(0, str(HARNESS_ROOT / "src"))

from harness.application.decision_explorer_request import derive_decision_explorer_request
from harness.application.project_publication import build_project_publication, read_project_publication
from harness.application.semantic_admission import admit_artifact
from harness.assurance.semantic_derivation import evaluate_derivation
from harness.project_model.engineering_graph import production_index


ORDER = [
    "prep.import-consistency",
    "prep.interface-verification",
    "prep.system-architecture",
    "prep.presentation-verification",
    "prep.data-design",
]

CANDIDATES = {
    "prep.application-design": ".harness/candidates/process-migration-application-design-admission.yaml",
    "prep.machine-interfaces": ".harness/candidates/frontend-boundary-machine-admission.yaml",
    "prep.task-model": ".harness/candidates/task-model-admission.yaml",
    "prep.information-architecture": ".harness/candidates/information-architecture-admission.yaml",
    "prep.interaction-design": ".harness/candidates/frontend-boundary-interaction-admission.yaml",
    "prep.interface-topology": ".harness/candidates/frontend-boundary-topology-admission.yaml",
    "prep.presentation-system": ".harness/candidates/presentation-screen-presentation-admission.yaml",
    "prep.screen-view-design": ".harness/candidates/presentation-screen-screen-admission.yaml",
    "prep.frontend-performance-capacity": ".harness/candidates/frontend-performance-capacity-admission.yaml",
    "prep.knowledge-model": ".harness/candidates/knowledge-model-admission.yaml",
    "prep.learning-design": ".harness/candidates/learning-design-admission.yaml",
    "prep.learner-model": ".harness/candidates/learner-model-admission.yaml",
    "prep.import-consistency": ".harness/candidates/import-consistency-admission.yaml",
    "prep.interface-verification": ".harness/candidates/interface-verification-admission.yaml",
    "prep.presentation-verification": ".harness/candidates/presentation-verification-admission.yaml",
    "prep.system-architecture": ".harness/candidates/system-architecture-admission.yaml",
    "prep.data-design": ".harness/candidates/data-design-admission.yaml",
}

ACCEPTANCE_IDS = {
    "prep.import-consistency": "PREP-IMPORT-CONSISTENCY-STRICT-1",
    "prep.interface-verification": "PREP-INTERFACE-VERIFICATION-STRICT-1",
    "prep.system-architecture": "PREP-SYSTEM-ARCHITECTURE-STRICT-1",
    "prep.presentation-verification": "PREP-PRESENTATION-VERIFICATION-STRICT-1",
    "prep.data-design": "PREP-DATA-DESIGN-STRICT-1",
}


def load(path: Path) -> dict[str, Any]:
    value = yaml.safe_load(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise SystemExit(f"{path} must contain a mapping")
    return value


def index_derivation_files(suffix: str) -> dict[tuple[str, str], Path]:
    result: dict[tuple[str, str], Path] = {}
    for path in sorted((ROOT / ".harness/candidates").glob("baseline-*-" + suffix + ".yaml")):
        doc = load(path)
        expected_kind = (
            "harness-semantic-derivation-contract"
            if suffix == "contract"
            else "harness-semantic-derivation-evidence"
        )
        if doc.get("kind") != expected_kind:
            continue
        key = (doc.get("source_capability"), doc.get("target_capability"))
        if not all(isinstance(x, str) and x for x in key):
            continue
        if key in result:
            raise SystemExit(f"duplicate baseline {suffix} for {key}")
        result[key] = path
    return result


def artifact_for_capability(core: dict[str, Any], capability: str) -> str:
    rows = [
        item["id"]
        for item in core.get("artifacts", []) or []
        if isinstance(item, dict) and capability in (item.get("provides", []) or [])
    ]
    if len(rows) != 1:
        raise SystemExit(f"{capability}: expected one Core provider, got {rows}")
    return rows[0]


def replace_or_append_evaluation(bundle: dict[str, Any], evaluation: dict[str, Any]) -> None:
    key = (evaluation["artifact"], evaluation["capability"])
    rows = bundle["semantic_evaluations"]
    for index, row in enumerate(rows):
        if (row.get("artifact"), row.get("capability")) == key:
            rows[index] = evaluation
            return
    rows.append(evaluation)


def replace_or_append_derivation(bundle: dict[str, Any], evaluation: dict[str, Any]) -> None:
    key = (evaluation["source_capability"], evaluation["target_capability"])
    rows = bundle["derivation_evaluations"]
    for index, row in enumerate(rows):
        if (row.get("source_capability"), row.get("target_capability")) == key:
            rows[index] = evaluation
            return
    rows.append(evaluation)


def replace_or_append_lifecycle(lifecycle: dict[str, Any], provider: dict[str, Any]) -> None:
    rows = lifecycle["providers"]
    for index, row in enumerate(rows):
        if row.get("capability") == provider["capability"]:
            rows[index] = provider
            return
    rows.append(provider)


def main() -> int:
    graph = load(ROOT / ".harness/engineering-graph.yaml")
    core = load(ROOT / ".harness/core.yaml")
    publication = read_project_publication(
        ROOT / ".harness/project-publication.yaml",
        graph=graph,
    )
    semantic_set = copy.deepcopy(publication["state"]["semantic_evaluations"])
    lifecycle = copy.deepcopy(publication["state"]["lifecycle"])
    failures = copy.deepcopy(publication["state"]["decision_failures"])

    registry = load(HARNESS_ROOT / "skills/artifact-skill-registry-v0.yaml")
    semantic_contracts = load(
        HARNESS_ROOT / "spec/semantic-acceptance/knowledge-kind-contracts-v1.yaml"
    )
    decision_contracts = load(
        HARNESS_ROOT / "spec/decision-governance/knowledge-kind-decision-contracts-v1.yaml"
    )
    productions = production_index(graph)
    contract_files = index_derivation_files("contract")
    evidence_files = index_derivation_files("evidence")

    report: list[dict[str, Any]] = []

    for capability in ORDER:
        candidate = load(ROOT / CANDIDATES[capability])
        prerequisites = [
            item["capability"]
            for item in productions[capability].get("requires", []) or []
        ]

        sources = {"semantic_assertions": []}
        incoming: list[dict[str, Any]] = []

        for source_capability in prerequisites:
            source_candidate = load(ROOT / CANDIDATES[source_capability])
            source_artifact = artifact_for_capability(core, source_capability)
            for assertion in source_candidate.get("semantic_assertions", []) or []:
                copied = copy.deepcopy(assertion)
                copied["source_artifact"] = source_artifact
                sources["semantic_assertions"].append(copied)

            key = (source_capability, capability)
            if key not in contract_files or key not in evidence_files:
                raise SystemExit(f"missing retained derivation contract/evidence for {key}")
            evaluated = evaluate_derivation(
                graph=graph,
                contract=load(contract_files[key]),
                source=source_candidate,
                candidate=candidate,
                evidence=load(evidence_files[key]),
            )
            if evaluated.get("status") != "ACCEPTED":
                raise SystemExit(
                    f"derivation rejected for {key}: {evaluated.get('findings')}"
                )
            incoming.append(evaluated)

        decision_exploration = None
        if capability == "prep.system-architecture":
            request = derive_decision_explorer_request(
                graph=graph,
                model=core,
                decision_contracts=decision_contracts,
                decision_policy=None,
                capability=capability,
                lifecycle=lifecycle,
                mode="CREATE",
            )
            if request is not None:
                exploration_path = ROOT / ".harness/candidates/system-architecture-exploration.yaml"
                if not exploration_path.exists():
                    raise SystemExit("active decision policy requires system architecture exploration evidence")
                decision_exploration = load(exploration_path)
                decision_exploration["explorer_request_id"] = request["request_id"]

        admitted = admit_artifact(
            graph=graph,
            model=core,
            skill_registry=registry,
            knowledge_contracts=semantic_contracts,
            decision_contracts=decision_contracts,
            decision_policy=None,
            decision_exploration=decision_exploration,
            derivation_evaluations=incoming,
            capability=capability,
            sources=sources,
            candidate=candidate,
            acceptance_id=ACCEPTANCE_IDS[capability],
            lifecycle=lifecycle,
            decision_request_mode="CREATE",
        )
        if admitted.get("status") != "ACCEPTED":
            raise SystemExit(
                f"admission rejected for {capability}: {admitted.get('findings')}"
            )

        replace_or_append_evaluation(semantic_set, admitted)
        for derivation in incoming:
            replace_or_append_derivation(semantic_set, derivation)
        replace_or_append_lifecycle(lifecycle, admitted["lifecycle_assertion"])

        report.append(
            {
                "capability": capability,
                "status": admitted["status"],
                "acceptance_id": ACCEPTANCE_IDS[capability],
                "derivations": len(incoming),
                "decision_exploration": admitted["admission"].get("decision_exploration"),
                "decision_governance": admitted["admission"].get("decision_governance"),
            }
        )

    next_publication = build_project_publication(
        graph=graph,
        core_model=core,
        semantic_evaluations=semantic_set,
        lifecycle=lifecycle,
        decision_failures=failures,
        parent_revision=publication["revision"],
    )

    (ROOT / ".harness/project-publication.next.yaml").write_text(
        yaml.safe_dump(next_publication, sort_keys=False, allow_unicode=True),
        encoding="utf-8",
    )
    (ROOT / ".harness/baseline-revalidation-report.yaml").write_text(
        yaml.safe_dump(
            {
                "version": 1,
                "kind": "prep-baseline-revalidation-report",
                "parent_revision": publication["revision"],
                "next_revision": next_publication["revision"],
                "results": report,
            },
            sort_keys=False,
            allow_unicode=True,
        ),
        encoding="utf-8",
    )
    print(yaml.safe_dump(report, sort_keys=False, allow_unicode=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
