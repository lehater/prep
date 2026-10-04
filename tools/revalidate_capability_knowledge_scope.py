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

from harness.application.project_publication import build_project_publication, read_project_publication
from harness.application.semantic_admission import admit_artifact
from harness.assurance.semantic_derivation import evaluate_derivation
from harness.assurance.semantic_fingerprint import semantic_assertion_fingerprints
from harness.project_model.engineering_graph import production_index

TARGET_CANDIDATES = {
    "prep.task-model": ".harness/candidates/task-model-admission.yaml",
    "prep.application-design": ".harness/candidates/process-migration-application-design-admission.yaml",
    "prep.application-process.activity-evidence-cycle": ".harness/candidates/process-migration-activity-evidence-admission.yaml",
    "prep.application-process.prepare-support": ".harness/candidates/process-migration-prepare-support-admission.yaml",
    "prep.user-journeys": ".harness/candidates/process-migration-user-journeys-admission.yaml",
    "prep.conceptual-interface-model": ".harness/candidates/conceptual-interface-model-admission.yaml",
    "prep.information-architecture": ".harness/candidates/information-architecture-admission.yaml",
    "prep.machine-interfaces": ".harness/candidates/frontend-boundary-machine-admission.yaml",
    "prep.interaction-design": ".harness/candidates/frontend-boundary-interaction-admission.yaml",
    "prep.interface-topology": ".harness/candidates/frontend-boundary-topology-admission.yaml",
    "prep.presentation-system": ".harness/candidates/presentation-screen-presentation-admission.yaml",
    "prep.screen-view-design": ".harness/candidates/presentation-screen-screen-admission.yaml",
}
ORDER = list(TARGET_CANDIDATES)

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
        if all(isinstance(x, str) and x for x in key):
            result.setdefault(key, []).append((path, doc))
    return result

def derivation_index(bundle: dict[str, Any]) -> dict[tuple[str, str], dict[str, Any]]:
    return {
        (row["source_capability"], row["target_capability"]): row
        for row in bundle.get("derivation_evaluations", []) or []
        if isinstance(row, dict)
        and isinstance(row.get("source_capability"), str)
        and isinstance(row.get("target_capability"), str)
    }

def lifecycle_index(lifecycle: dict[str, Any]) -> dict[str, dict[str, Any]]:
    return {
        row["capability"]: row
        for row in lifecycle.get("providers", []) or []
        if isinstance(row, dict) and isinstance(row.get("capability"), str)
    }

def artifact_for_capability(core: dict[str, Any], capability: str) -> str:
    matches = [
        row["id"] for row in core.get("artifacts", []) or []
        if isinstance(row, dict) and capability in (row.get("provides", []) or [])
    ]
    if len(matches) != 1:
        raise SystemExit(f"{capability}: expected one Core artifact, got {matches}")
    return matches[0]

def current_surface(capability: str, derivations: dict[tuple[str, str], dict[str, Any]]) -> dict[str, str] | None:
    for (source, _target), row in derivations.items():
        if source != capability:
            continue
        dep = row.get("lifecycle_dependency", {}) or {}
        surface = dep.get("source_surface_fingerprints")
        if isinstance(surface, dict) and surface:
            return surface
    return None

def choose_candidate(
    capability: str,
    candidates: dict[str, list[tuple[Path, dict[str, Any]]]],
    derivations: dict[tuple[str, str], dict[str, Any]],
) -> dict[str, Any]:
    explicit = TARGET_CANDIDATES.get(capability)
    if explicit:
        return load(ROOT / explicit)

    rows = candidates.get(capability, [])
    if len(rows) == 1:
        return copy.deepcopy(rows[0][1])

    expected = current_surface(capability, derivations)
    if expected is not None:
        matches = [
            doc for _path, doc in rows
            if semantic_assertion_fingerprints(doc) == expected
        ]
        if len(matches) == 1:
            return copy.deepcopy(matches[0])

    raise SystemExit(
        f"cannot select current candidate for {capability}; "
        f"candidates={[str(path) for path, _ in rows]}"
    )

def next_acceptance_id(old: str) -> str:
    m = re.match(r"^(.*-STRICT-)(\d+)$", old)
    if m:
        return f"{m.group(1)}{int(m.group(2)) + 1}"
    return old + "-CAP-SCOPE-1"

def replace_artifact(bundle: dict[str, Any], evaluation: dict[str, Any]) -> None:
    key = (evaluation["artifact"], evaluation["capability"])
    for i, row in enumerate(bundle["semantic_evaluations"]):
        if (row.get("artifact"), row.get("capability")) == key:
            bundle["semantic_evaluations"][i] = evaluation
            return
    raise SystemExit(f"artifact evaluation missing: {key}")

def replace_derivation(bundle: dict[str, Any], evaluation: dict[str, Any]) -> None:
    key = (evaluation["source_capability"], evaluation["target_capability"])
    for i, row in enumerate(bundle["derivation_evaluations"]):
        if (row.get("source_capability"), row.get("target_capability")) == key:
            bundle["derivation_evaluations"][i] = evaluation
            return
    raise SystemExit(f"derivation evaluation missing: {key}")

def replace_provider(lifecycle: dict[str, Any], provider: dict[str, Any]) -> None:
    for i, row in enumerate(lifecycle["providers"]):
        if row.get("capability") == provider["capability"]:
            lifecycle["providers"][i] = provider
            return
    raise SystemExit(f"lifecycle provider missing: {provider['capability']}")

def main() -> int:
    graph = load(ROOT / ".harness/engineering-graph.yaml")
    core = load(ROOT / ".harness/core.yaml")
    publication = read_project_publication(ROOT / ".harness/project-publication.yaml", graph=graph)
    semantic_set = copy.deepcopy(publication["state"]["semantic_evaluations"])
    lifecycle = copy.deepcopy(publication["state"]["lifecycle"])
    failures = copy.deepcopy(publication["state"]["decision_failures"])

    contracts = contract_index()
    candidates = candidate_index()
    productions = production_index(graph)
    derivations = derivation_index(semantic_set)
    lifecycle_rows = lifecycle_index(lifecycle)

    registry = load(HARNESS_ROOT / "skills/artifact-skill-registry-v0.yaml")
    knowledge_contracts = load(HARNESS_ROOT / "spec/semantic-acceptance/knowledge-kind-contracts-v1.yaml")

    report: list[dict[str, Any]] = []

    for capability in ORDER:
        if capability not in lifecycle_rows:
            raise SystemExit(f"expected CURRENT capability missing from publication: {capability}")

        candidate = choose_candidate(capability, candidates, derivations)
        prerequisites = [row["capability"] for row in productions[capability].get("requires", [])]

        sources = {"semantic_assertions": []}
        incoming: list[dict[str, Any]] = []

        for source_capability in prerequisites:
            source_candidate = choose_candidate(source_capability, candidates, derivations)
            source_artifact = artifact_for_capability(core, source_capability)
            for assertion in source_candidate.get("semantic_assertions", []) or []:
                copied = copy.deepcopy(assertion)
                copied["source_artifact"] = source_artifact
                sources["semantic_assertions"].append(copied)

            key = (source_capability, capability)
            previous = derivations.get(key)
            rows = contracts.get(key, [])
            if previous is None or not rows:
                raise SystemExit(f"missing derivation contract/evidence: {key}")

            evidence = {
                "version": 1,
                "kind": "harness-semantic-derivation-evidence",
                "source_capability": source_capability,
                "target_capability": capability,
                "links": copy.deepcopy(previous.get("links", [])),
                "dispositions": copy.deepcopy(previous.get("dispositions", [])),
            }

            accepted: list[tuple[Path, dict[str, Any]]] = []
            for contract_path, contract in rows:
                attempt = evaluate_derivation(
                    graph=graph,
                    contract=contract,
                    source=source_candidate,
                    candidate=candidate,
                    evidence=evidence,
                )
                if attempt.get("status") == "ACCEPTED":
                    accepted.append((contract_path, attempt))

            old_required = set(previous.get("required_sources", []) or [])
            compatible = [
                item for item in accepted
                if set(item[1].get("required_sources", []) or []) == old_required
            ]
            if len(compatible) == 1:
                _path, evaluated = compatible[0]
            elif len(compatible) > 1:
                normalized = {
                    yaml.safe_dump(item[1], sort_keys=True, allow_unicode=True)
                    for item in compatible
                }
                if len(normalized) != 1:
                    raise SystemExit(f"ambiguous derivation contracts: {key}")
                _path, evaluated = compatible[0]
            elif len(accepted) == 1:
                _path, evaluated = accepted[0]
            else:
                raise SystemExit(
                    f"no unique accepted derivation contract for {key}; "
                    f"accepted={[str(path) for path, _ in accepted]}"
                )
            incoming.append(evaluated)

        old_provider = lifecycle_rows[capability]
        acceptance_id = next_acceptance_id(old_provider["acceptance_id"])
        admitted = admit_artifact(
            graph=graph,
            model=core,
            skill_registry=registry,
            knowledge_contracts=knowledge_contracts,
            derivation_evaluations=incoming,
            capability=capability,
            sources=sources,
            candidate=candidate,
            acceptance_id=acceptance_id,
            lifecycle=lifecycle,
            decision_request_mode="REVISION",
        )
        if admitted.get("status") != "ACCEPTED":
            raise SystemExit(f"admission rejected for {capability}: {admitted.get('findings')}")

        replace_artifact(semantic_set, admitted)
        for edge in incoming:
            replace_derivation(semantic_set, edge)
            derivations[(edge["source_capability"], edge["target_capability"])] = edge
        replace_provider(lifecycle, admitted["lifecycle_assertion"])
        lifecycle_rows[capability] = admitted["lifecycle_assertion"]

        report.append({
            "capability": capability,
            "status": "ACCEPTED",
            "acceptance_id": acceptance_id,
            "derivations": len(incoming),
        })

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
    (ROOT / ".harness/revalidation-report.yaml").write_text(
        yaml.safe_dump({
            "version": 1,
            "kind": "prep-capability-knowledge-scope-revalidation",
            "parent_revision": publication["revision"],
            "next_revision": next_publication["revision"],
            "results": report,
        }, sort_keys=False, allow_unicode=True),
        encoding="utf-8",
    )
    print(yaml.safe_dump(report, sort_keys=False, allow_unicode=True))
    print(next_publication["revision"])
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
