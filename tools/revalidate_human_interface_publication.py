#!/usr/bin/env python3
from __future__ import annotations

import copy
import os
import re
import sys
from pathlib import Path
from typing import Any

import yaml

ROOT = Path(__file__).resolve().parents[1]
HARNESS_ROOT = Path(os.environ.get("HARNESS_ROOT", ROOT / ".harness-tool"))
if not HARNESS_ROOT.is_absolute():
    HARNESS_ROOT = (ROOT / HARNESS_ROOT).resolve()
sys.path.insert(0, str(HARNESS_ROOT / "src"))

from harness.application.project_publication import (  # noqa: E402
    build_project_publication,
    read_project_publication,
)
from harness.application.semantic_admission import admit_artifact  # noqa: E402
from harness.assurance.semantic_derivation import evaluate_derivation  # noqa: E402
from harness.assurance.semantic_fingerprint import semantic_assertion_fingerprints  # noqa: E402
from harness.project_model.engineering_graph import production_index  # noqa: E402


TARGET_CANDIDATES = {
    "prep.machine-interfaces": ".harness/candidates/frontend-boundary-machine-admission.yaml",
    "prep.information-architecture": ".harness/candidates/information-architecture-admission.yaml",
    "prep.interaction-design": ".harness/candidates/frontend-boundary-interaction-admission.yaml",
    "prep.interface-topology": ".harness/candidates/frontend-boundary-topology-admission.yaml",
    "prep.presentation-system": ".harness/candidates/presentation-screen-presentation-admission.yaml",
    "prep.screen-view-design": ".harness/candidates/presentation-screen-screen-admission.yaml",
}
ORDER = [
    "prep.machine-interfaces",
    "prep.information-architecture",
    "prep.interaction-design",
    "prep.interface-topology",
    "prep.presentation-system",
    "prep.screen-view-design",
]


def load(path: Path) -> dict[str, Any]:
    value = yaml.safe_load(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise SystemExit(f"{path} must contain a mapping")
    return value


def candidate_index() -> dict[str, list[tuple[Path, dict[str, Any]]]]:
    result: dict[str, list[tuple[Path, dict[str, Any]]]] = {}
    for path in sorted((ROOT / ".harness/candidates").glob("*-admission.yaml")):
        try:
            doc = load(path)
        except Exception:
            continue
        if doc.get("kind") != "harness-artifact-admission-candidate":
            continue
        capability = doc.get("capability")
        if isinstance(capability, str):
            result.setdefault(capability, []).append((path, doc))
    return result


def contract_index() -> dict[tuple[str, str], list[tuple[Path, dict[str, Any]]]]:
    result: dict[tuple[str, str], list[tuple[Path, dict[str, Any]]]] = {}
    for path in sorted((ROOT / ".harness/candidates").glob("*-contract.yaml")):
        try:
            doc = load(path)
        except Exception:
            continue
        if doc.get("kind") != "harness-semantic-derivation-contract":
            continue
        key = (doc.get("source_capability"), doc.get("target_capability"))
        if not all(isinstance(x, str) and x for x in key):
            continue
        result.setdefault(key, []).append((path, doc))
    return result


def derivation_index(bundle: dict[str, Any]) -> dict[tuple[str, str], dict[str, Any]]:
    result = {}
    for item in bundle.get("derivation_evaluations", []) or []:
        key = (item.get("source_capability"), item.get("target_capability"))
        if all(isinstance(x, str) for x in key):
            result[key] = item
    return result


def lifecycle_index(lifecycle: dict[str, Any]) -> dict[str, dict[str, Any]]:
    return {
        row["capability"]: row
        for row in lifecycle.get("providers", []) or []
        if isinstance(row, dict) and isinstance(row.get("capability"), str)
    }


def artifact_for_capability(core: dict[str, Any], capability: str) -> str:
    matches = [
        item["id"]
        for item in core.get("artifacts", []) or []
        if isinstance(item, dict) and capability in (item.get("provides", []) or [])
    ]
    if len(matches) != 1:
        raise SystemExit(f"{capability} must have exactly one Core artifact, got {matches}")
    return matches[0]


def current_surface_fingerprints(
    capability: str,
    derivations: dict[tuple[str, str], dict[str, Any]],
) -> dict[str, str] | None:
    for (source, _target), item in derivations.items():
        if source != capability:
            continue
        dep = item.get("lifecycle_dependency", {}) or {}
        surface = dep.get("source_surface_fingerprints")
        if isinstance(surface, dict) and surface:
            return surface
    return None


def choose_candidate(
    capability: str,
    candidates: dict[str, list[tuple[Path, dict[str, Any]]]],
    derivations: dict[tuple[str, str], dict[str, Any]],
) -> dict[str, Any]:
    override = TARGET_CANDIDATES.get(capability)
    if override:
        return load(ROOT / override)

    rows = candidates.get(capability, [])
    if len(rows) == 1:
        return copy.deepcopy(rows[0][1])

    expected = current_surface_fingerprints(capability, derivations)
    if expected is not None:
        matches = [
            doc
            for _path, doc in rows
            if semantic_assertion_fingerprints(doc) == expected
        ]
        if len(matches) == 1:
            return copy.deepcopy(matches[0])

    raise SystemExit(
        f"cannot select current candidate surface for {capability}; "
        f"candidates={[str(path) for path, _ in rows]}"
    )


def next_acceptance_id(old: str) -> str:
    match = re.match(r"^(.*-STRICT-)(\d+)$", old)
    if match:
        return f"{match.group(1)}{int(match.group(2)) + 1}"
    return old + "-UVSC-1"


def replace_artifact_evaluation(bundle: dict[str, Any], evaluation: dict[str, Any]) -> None:
    key = (evaluation["artifact"], evaluation["capability"])
    rows = bundle["semantic_evaluations"]
    for index, row in enumerate(rows):
        if (row.get("artifact"), row.get("capability")) == key:
            rows[index] = evaluation
            return
    raise SystemExit(f"artifact evaluation not found for {key}")


def replace_derivation_evaluation(bundle: dict[str, Any], evaluation: dict[str, Any]) -> None:
    key = (evaluation["source_capability"], evaluation["target_capability"])
    rows = bundle["derivation_evaluations"]
    for index, row in enumerate(rows):
        if (row.get("source_capability"), row.get("target_capability")) == key:
            rows[index] = evaluation
            return
    raise SystemExit(f"derivation evaluation not found for {key}")


def replace_lifecycle_provider(lifecycle: dict[str, Any], provider: dict[str, Any]) -> None:
    rows = lifecycle["providers"]
    for index, row in enumerate(rows):
        if row.get("capability") == provider["capability"]:
            rows[index] = provider
            return
    raise SystemExit(f"lifecycle provider not found for {provider['capability']}")


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

    contracts = contract_index()
    candidates = candidate_index()
    productions = production_index(graph)
    derivations = derivation_index(semantic_set)
    lifecycle_rows = lifecycle_index(lifecycle)

    registry = load(HARNESS_ROOT / "skills/artifact-skill-registry-v0.yaml")
    semantic_contracts = load(
        HARNESS_ROOT / "spec/semantic-acceptance/knowledge-kind-contracts-v1.yaml"
    )

    report: list[dict[str, Any]] = []

    for capability in ORDER:
        if capability not in lifecycle_rows:
            report.append({"capability": capability, "status": "NOT_CURRENT_SKIP"})
            continue

        candidate = choose_candidate(capability, candidates, derivations)
        production = productions[capability]
        prerequisites = [item["capability"] for item in production.get("requires", [])]

        sources = {"semantic_assertions": []}
        incoming: list[dict[str, Any]] = []

        for source_capability in prerequisites:
            source_candidate = choose_candidate(
                source_capability,
                candidates,
                derivations,
            )
            source_artifact = artifact_for_capability(core, source_capability)
            for assertion in source_candidate.get("semantic_assertions", []) or []:
                copied = copy.deepcopy(assertion)
                copied["source_artifact"] = source_artifact
                sources["semantic_assertions"].append(copied)

            key = (source_capability, capability)
            contract_rows = contracts.get(key, [])
            previous = derivations.get(key)
            if not contract_rows or previous is None:
                raise SystemExit(f"missing derivation contract/evidence for {key}")

            evidence = {
                "version": 1,
                "kind": "harness-semantic-derivation-evidence",
                "source_capability": source_capability,
                "target_capability": capability,
                "links": copy.deepcopy(previous.get("links", [])),
                "dispositions": copy.deepcopy(previous.get("dispositions", [])),
            }

            evaluated_candidates: list[tuple[Path, dict[str, Any]]] = []
            for contract_path, contract in contract_rows:
                evaluated_try = evaluate_derivation(
                    graph=graph,
                    contract=contract,
                    source=source_candidate,
                    candidate=candidate,
                    evidence=evidence,
                )
                if evaluated_try.get("status") == "ACCEPTED":
                    evaluated_candidates.append((contract_path, evaluated_try))

            previous_required = set(previous.get("required_sources", []) or [])
            compatible = [
                (contract_path, evaluation)
                for contract_path, evaluation in evaluated_candidates
                if set(evaluation.get("required_sources", []) or []) == previous_required
            ]
            if len(compatible) == 1:
                _selected_path, evaluated = compatible[0]
            elif len(compatible) > 1:
                normalized = {
                    yaml.safe_dump(evaluation, sort_keys=True, allow_unicode=True)
                    for _path, evaluation in compatible
                }
                if len(normalized) != 1:
                    raise SystemExit(
                        f"ambiguous current derivation contracts for {key}: "
                        f"{[str(path) for path, _ in compatible]}"
                    )
                _selected_path, evaluated = compatible[0]
            elif len(evaluated_candidates) == 1:
                _selected_path, evaluated = evaluated_candidates[0]
            else:
                raise SystemExit(
                    f"no unique current derivation contract for {key}; "
                    f"accepted={[str(path) for path, _ in evaluated_candidates]}"
                )

            incoming.append(evaluated)

        old_provider = lifecycle_rows[capability]
        acceptance_id = next_acceptance_id(old_provider["acceptance_id"])
        admitted = admit_artifact(
            graph=graph,
            model=core,
            skill_registry=registry,
            knowledge_contracts=semantic_contracts,
            derivation_evaluations=incoming,
            capability=capability,
            sources=sources,
            candidate=candidate,
            acceptance_id=acceptance_id,
            lifecycle=lifecycle,
            decision_request_mode="REVISION",
        )
        if admitted.get("status") != "ACCEPTED":
            raise SystemExit(
                f"admission rejected for {capability}: {admitted.get('findings')}"
            )

        replace_artifact_evaluation(semantic_set, admitted)
        for item in incoming:
            replace_derivation_evaluation(semantic_set, item)
            derivations[(item["source_capability"], item["target_capability"])] = item
        replace_lifecycle_provider(lifecycle, admitted["lifecycle_assertion"])
        lifecycle_rows[capability] = admitted["lifecycle_assertion"]

        report.append(
            {
                "capability": capability,
                "status": "ACCEPTED",
                "acceptance_id": acceptance_id,
                "derivations": len(incoming),
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

    out = ROOT / ".harness/project-publication.next.yaml"
    out.write_text(
        yaml.safe_dump(next_publication, sort_keys=False, allow_unicode=True),
        encoding="utf-8",
    )
    (ROOT / ".harness/revalidation-report.yaml").write_text(
        yaml.safe_dump(
            {
                "version": 1,
                "kind": "prep-human-interface-revalidation-report",
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
    print(next_publication["revision"])
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
