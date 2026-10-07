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

from harness.application.project_publication import build_project_publication, read_project_publication, publish_project_publication
from harness.application.semantic_admission import admit_artifact, derive_acceptance_policy_fingerprints
from harness.assurance.capability_lifecycle import lifecycle_states
from harness.assurance.semantic_derivation import evaluate_derivation
from harness.assurance.semantic_fingerprint import semantic_assertion_fingerprints
from harness.project_model.engineering_graph import production_index

TARGET_CANDIDATES = {
    "prep.task-model": ".harness/candidates/task-model-admission.yaml",
    "prep.application-design": ".harness/candidates/process-migration-application-design-admission.yaml",
    "prep.application-process.activity-evidence-cycle": ".harness/candidates/process-migration-activity-evidence-admission.yaml",
    "prep.application-process.prepare-support": ".harness/candidates/process-migration-prepare-support-admission.yaml",
    "prep.user-journeys": ".harness/candidates/process-migration-user-journeys-admission.yaml",
}

ORDER = ["prep.user-journeys"]
PREP_BASELINE = "a3eed460b81f50ee299f45751168d1932a97f99e"

def baseline_user_journey_candidate() -> dict[str, Any]:
    import subprocess
    result = subprocess.run(
        ["git", "show", f"{PREP_BASELINE}:.harness/candidates/process-migration-user-journeys-admission.yaml"],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    value = yaml.safe_load(result.stdout)
    if not isinstance(value, dict):
        raise SystemExit("baseline user-journey candidate must contain a mapping")
    return value


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
            doc for _path, doc in rows
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
    return old + "-LEARNING-REVALIDATION-1"


def replace_artifact_evaluation(bundle: dict[str, Any], evaluation: dict[str, Any]) -> None:
    key = (evaluation["artifact"], evaluation["capability"])
    for index, row in enumerate(bundle["semantic_evaluations"]):
        if (row.get("artifact"), row.get("capability")) == key:
            bundle["semantic_evaluations"][index] = evaluation
            return
    raise SystemExit(f"artifact evaluation not found for {key}")


def replace_derivation_evaluation(bundle: dict[str, Any], evaluation: dict[str, Any]) -> None:
    key = (evaluation["source_capability"], evaluation["target_capability"])
    for index, row in enumerate(bundle["derivation_evaluations"]):
        if (row.get("source_capability"), row.get("target_capability")) == key:
            bundle["derivation_evaluations"][index] = evaluation
            return
    raise SystemExit(f"derivation evaluation not found for {key}")


def replace_lifecycle_provider(lifecycle: dict[str, Any], provider: dict[str, Any]) -> None:
    for index, row in enumerate(lifecycle["providers"]):
        if row.get("capability") == provider["capability"]:
            lifecycle["providers"][index] = provider
            return
    raise SystemExit(f"lifecycle provider not found for {provider['capability']}")


def select_contract(
    key: tuple[str, str],
    rows: list[tuple[Path, dict[str, Any]]],
    previous: dict[str, Any],
    *,
    graph: dict[str, Any],
    source: dict[str, Any],
    candidate: dict[str, Any],
    evidence: dict[str, Any],
) -> dict[str, Any]:
    accepted: list[tuple[Path, dict[str, Any]]] = []
    for path, contract in rows:
        evaluated = evaluate_derivation(
            graph=graph,
            contract=contract,
            source=source,
            candidate=candidate,
            evidence=evidence,
        )
        if evaluated.get("status") == "ACCEPTED":
            accepted.append((path, evaluated))

    previous_required = set(previous.get("required_sources", []) or [])
    compatible = [
        (path, evaluation)
        for path, evaluation in accepted
        if set(evaluation.get("required_sources", []) or []) == previous_required
    ]
    if len(compatible) == 1:
        return compatible[0][1]
    if len(compatible) > 1:
        normalized = {
            yaml.safe_dump(evaluation, sort_keys=True, allow_unicode=True)
            for _path, evaluation in compatible
        }
        if len(normalized) == 1:
            return compatible[0][1]
    if len(accepted) == 1:
        return accepted[0][1]
    raise SystemExit(
        f"no unique current derivation contract for {key}; "
        f"accepted={[str(path) for path, _ in accepted]}"
    )


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

    policy_fingerprints = derive_acceptance_policy_fingerprints(
        graph=graph,
        knowledge_contracts=semantic_contracts,
    )
    before_states = lifecycle_states(
        graph,
        core,
        lifecycle,
        current_acceptance_policy_fingerprints=policy_fingerprints,
    )
    before_user_journeys = copy.deepcopy(before_states["prep.user-journeys"])
    if before_user_journeys.get("state") != "STALE":
        raise SystemExit(f"expected prep.user-journeys STALE before P0, got {before_user_journeys}")

    report: list[dict[str, Any]] = []
    old_probe_findings: list[dict[str, Any]] = []

    for capability in ORDER:
        if capability not in lifecycle_rows:
            raise SystemExit(f"{capability} has no current lifecycle row")

        candidate = choose_candidate(capability, candidates, derivations)
        production = productions[capability]
        prerequisites = [item["capability"] for item in production.get("requires", [])]

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
            evaluated = select_contract(
                key, contract_rows, previous,
                graph=graph,
                source=source_candidate,
                candidate=candidate,
                evidence=evidence,
            )
            incoming.append(evaluated)

        old_provider = lifecycle_rows[capability]

        old_candidate = baseline_user_journey_candidate()
        old_incoming = [derivations[(source_capability, capability)] for source_capability in prerequisites]
        old_probe = admit_artifact(
            graph=graph,
            model=core,
            skill_registry=registry,
            knowledge_contracts=semantic_contracts,
            derivation_evaluations=old_incoming,
            capability=capability,
            sources=sources,
            candidate=old_candidate,
            acceptance_id="PREP-USER-JOURNEYS-STALE-PROBE",
            lifecycle=lifecycle,
            decision_request_mode="REVISION",
        )
        if old_probe.get("status") != "REJECTED":
            raise SystemExit(f"old user-journey candidate unexpectedly accepted: {old_probe}")
        old_probe_findings = copy.deepcopy(old_probe.get("findings", []))
        if not any(item.get("code") == "INDEPENDENT_OBLIGATION_REVIEW_REQUIRED" for item in old_probe_findings):
            raise SystemExit(f"old candidate rejection did not reproduce H1 granularity finding: {old_probe_findings}")

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

    published = publish_project_publication(
        ROOT / ".harness/project-publication.yaml",
        graph=graph,
        publication=next_publication,
        expected_revision=publication["revision"],
    )

    states = lifecycle_states(
        graph,
        core,
        lifecycle,
        current_acceptance_policy_fingerprints=policy_fingerprints,
    )
    stale = {
        capability: state
        for capability, state in states.items()
        if state.get("state") != "CURRENT"
    }

    if states["prep.user-journeys"].get("state") != "CURRENT":
        raise SystemExit(f"prep.user-journeys did not become CURRENT: {states['prep.user-journeys']}")

    stage_report = {
        "version": 1,
        "kind": "prep-stage-p0-user-journeys-revalidation-report",
        "prep_baseline": PREP_BASELINE,
        "parent_revision": publication["revision"],
        "next_revision": published["revision"],
        "old_currentness": before_user_journeys,
        "old_probe_findings": old_probe_findings,
        "results": report,
        "user_journeys_currentness": states["prep.user-journeys"],
        "remaining_noncurrent": stale,
    }
    (ROOT / ".harness/revalidation-report.yaml").write_text(
        yaml.safe_dump(stage_report, sort_keys=False, allow_unicode=True),
        encoding="utf-8",
    )
    print(yaml.safe_dump(stage_report, sort_keys=False, allow_unicode=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
