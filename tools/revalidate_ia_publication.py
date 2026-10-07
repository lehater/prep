#!/usr/bin/env python3
from __future__ import annotations

import copy
import os
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
from harness.application.semantic_admission import admit_artifact, derive_acceptance_policy_fingerprints
from harness.assurance.capability_lifecycle import lifecycle_states
from harness.assurance.semantic_derivation import evaluate_derivation
from harness.assurance.semantic_fingerprint import semantic_assertion_fingerprints
from harness.project_model.engineering_graph import production_index

CAPABILITY = "prep.information-architecture"
ACCEPTANCE_ID = "PREP-INFORMATION-ARCHITECTURE-STRICT-7"
CANDIDATE_PATH = ".harness/candidates/information-architecture-admission.yaml"
CANONICAL_PATH = "docs/interface/information-architecture.yaml"

SOURCES = {
    "prep.conceptual-interface-model": {
        "candidate": ".harness/candidates/conceptual-interface-model-admission.yaml",
        "contract": ".harness/candidates/information-architecture-conceptual-contract.yaml",
        "evidence": ".harness/candidates/process-migration-information-architecture-conceptual-evidence.yaml",
    },
    "prep.task-model": {
        "candidate": ".harness/candidates/task-model-admission.yaml",
        "contract": ".harness/candidates/process-migration-information-architecture-task-contract.yaml",
        "evidence": ".harness/candidates/process-migration-information-architecture-task-evidence.yaml",
    },
    "prep.user-journeys": {
        "candidate": ".harness/candidates/process-migration-user-journeys-admission.yaml",
        "contract": ".harness/candidates/process-migration-information-architecture-journey-contract.yaml",
        "evidence": ".harness/candidates/process-migration-information-architecture-journey-evidence.yaml",
    },
}


def load(path: str | Path) -> dict[str, Any]:
    path = Path(path)
    if not path.is_absolute():
        path = ROOT / path
    value = yaml.safe_load(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise SystemExit(f"{path} must contain a mapping")
    return value


def lifecycle_index(lifecycle: dict[str, Any]) -> dict[str, dict[str, Any]]:
    return {
        row["capability"]: row
        for row in lifecycle.get("providers", []) or []
        if isinstance(row, dict) and isinstance(row.get("capability"), str)
    }


def derivation_index(bundle: dict[str, Any]) -> dict[tuple[str, str], dict[str, Any]]:
    result: dict[tuple[str, str], dict[str, Any]] = {}
    for item in bundle.get("derivation_evaluations", []) or []:
        key = (item.get("source_capability"), item.get("target_capability"))
        if all(isinstance(x, str) for x in key):
            result[key] = item
    return result


def artifact_for_capability(core: dict[str, Any], capability: str) -> str:
    matches = [
        item["id"]
        for item in core.get("artifacts", []) or []
        if isinstance(item, dict) and capability in (item.get("provides", []) or [])
    ]
    if len(matches) != 1:
        raise SystemExit(f"{capability} must have one Core artifact, got {matches}")
    return matches[0]


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


def unresolved(evaluation: dict[str, Any]) -> list[str]:
    required = set(evaluation.get("required_sources", []) or [])
    covered = set(evaluation.get("covered_sources", []) or [])
    disposed = {
        item.get("source")
        for item in evaluation.get("dispositions", []) or []
        if isinstance(item, dict)
    }
    return sorted(required - covered - disposed)


def main() -> int:
    graph = load(".harness/engineering-graph.yaml")
    core = load(".harness/core.yaml")
    publication = read_project_publication(
        ROOT / ".harness/project-publication.yaml",
        graph=graph,
    )
    semantic_set = copy.deepcopy(publication["state"]["semantic_evaluations"])
    lifecycle = copy.deepcopy(publication["state"]["lifecycle"])
    failures = copy.deepcopy(publication["state"]["decision_failures"])
    lifecycle_rows = lifecycle_index(lifecycle)
    derivations = derivation_index(semantic_set)
    productions = production_index(graph)

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
    before_ia = before_states.get(CAPABILITY, {})
    if before_ia.get("state") == "CURRENT":
        raise SystemExit("Expected stale IA before revalidation, got CURRENT")

    old_provider = lifecycle_rows[CAPABILITY]
    if old_provider.get("acceptance_id") != "PREP-INFORMATION-ARCHITECTURE-STRICT-6":
        raise SystemExit(f"Unexpected old IA acceptance: {old_provider.get('acceptance_id')}")
    accepted_prereqs = old_provider.get("accepted_prerequisites", {}) or {}
    if accepted_prereqs.get("prep.user-journeys") != "PREP-USER-JOURNEYS-STRICT-5":
        raise SystemExit("Old IA does not record Journey STRICT-5 as expected")
    if accepted_prereqs.get("prep.conceptual-interface-model") != "PREP-CONCEPTUAL-INTERFACE-MODEL-STRICT-5":
        raise SystemExit("Old IA does not record CIM STRICT-5 as expected")

    expected_current = {
        "prep.user-journeys": "PREP-USER-JOURNEYS-STRICT-6",
        "prep.conceptual-interface-model": "PREP-CONCEPTUAL-INTERFACE-MODEL-STRICT-6",
    }
    for capability, acceptance in expected_current.items():
        if lifecycle_rows[capability].get("acceptance_id") != acceptance:
            raise SystemExit(
                f"{capability} expected {acceptance}, got {lifecycle_rows[capability].get('acceptance_id')}"
            )

    target_candidate = load(CANDIDATE_PATH)
    source_bundle = {"semantic_assertions": []}
    source_docs: dict[str, dict[str, Any]] = {}
    incoming: list[dict[str, Any]] = []

    for source_capability, paths in SOURCES.items():
        state = before_states.get(source_capability, {})
        if state.get("state") != "CURRENT":
            raise SystemExit(f"Prerequisite {source_capability} is not CURRENT: {state}")

        source_doc = load(paths["candidate"])
        source_docs[source_capability] = source_doc
        current_fp = semantic_assertion_fingerprints(source_doc)
        provider_fp = lifecycle_rows[source_capability].get("semantic_atom_fingerprints")
        if current_fp != provider_fp:
            raise SystemExit(
                f"Source candidate surface differs from current provider for {source_capability}"
            )

        source_artifact = artifact_for_capability(core, source_capability)
        for assertion in source_doc.get("semantic_assertions", []) or []:
            copied = copy.deepcopy(assertion)
            copied["source_artifact"] = source_artifact
            source_bundle["semantic_assertions"].append(copied)

        evaluated = evaluate_derivation(
            graph=graph,
            contract=load(paths["contract"]),
            source=source_doc,
            candidate=target_candidate,
            evidence=load(paths["evidence"]),
        )
        if evaluated.get("status") != "ACCEPTED":
            raise SystemExit(
                f"{source_capability} -> IA derivation rejected:\n"
                + yaml.safe_dump(
                    {
                        "findings": evaluated.get("findings"),
                        "coverage": evaluated.get("coverage"),
                        "required_sources": evaluated.get("required_sources"),
                        "covered_sources": evaluated.get("covered_sources"),
                        "dispositions": evaluated.get("dispositions"),
                        "unresolved": unresolved(evaluated),
                    },
                    sort_keys=False,
                    allow_unicode=True,
                )
            )
        incoming.append(evaluated)

    admitted = admit_artifact(
        graph=graph,
        model=core,
        skill_registry=registry,
        knowledge_contracts=semantic_contracts,
        derivation_evaluations=incoming,
        capability=CAPABILITY,
        sources=source_bundle,
        candidate=target_candidate,
        acceptance_id=ACCEPTANCE_ID,
        lifecycle=lifecycle,
        decision_request_mode="REVISION",
    )
    if admitted.get("status") != "ACCEPTED":
        raise SystemExit(
            "IA admission rejected:\n"
            + yaml.safe_dump(admitted.get("findings"), allow_unicode=True)
        )

    old_ids = {cap: row.get("acceptance_id") for cap, row in lifecycle_rows.items()}

    replace_artifact_evaluation(semantic_set, admitted)
    for item in incoming:
        replace_derivation_evaluation(semantic_set, item)
    replace_lifecycle_provider(lifecycle, admitted["lifecycle_assertion"])

    next_publication = build_project_publication(
        graph=graph,
        core_model=core,
        semantic_evaluations=semantic_set,
        lifecycle=lifecycle,
        decision_failures=failures,
        parent_revision=publication["revision"],
    )

    after_rows = lifecycle_index(lifecycle)
    reaccepted = [
        cap
        for cap, row in after_rows.items()
        if cap != CAPABILITY and row.get("acceptance_id") != old_ids.get(cap)
    ]
    if reaccepted:
        raise SystemExit(f"Artifacts reaccepted unexpectedly: {reaccepted}")

    after_states = lifecycle_states(
        graph,
        core,
        lifecycle,
        current_acceptance_policy_fingerprints=policy_fingerprints,
    )
    after_ia = after_states.get(CAPABILITY, {})
    if after_ia.get("state") != "CURRENT":
        raise SystemExit(f"IA did not become CURRENT: {after_ia}")

    direct_downstream: dict[str, Any] = {}
    for capability, production in productions.items():
        requires = [
            item.get("capability")
            for item in production.get("requires", []) or []
            if isinstance(item, dict)
        ]
        if CAPABILITY in requires:
            direct_downstream[capability] = after_states.get(capability)

    ordered = list(productions)
    ia_index = ordered.index(CAPABILITY)
    actionable = []
    for capability in ordered[ia_index + 1 :]:
        state = after_states.get(capability, {})
        if state.get("state") == "CURRENT":
            continue
        production = productions[capability]
        prereqs = [
            item.get("capability")
            for item in production.get("requires", []) or []
            if isinstance(item, dict)
        ]
        if all(after_states.get(p, {}).get("state") == "CURRENT" for p in prereqs):
            actionable.append(
                {
                    "capability": capability,
                    "authority": state.get("authority"),
                    "state": state.get("state"),
                    "details": state,
                }
            )

    derivation_report = {}
    for item in incoming:
        derivation_report[item["source_capability"]] = {
            "status": item.get("status"),
            "coverage": item.get("coverage"),
            "required_source_count": len(item.get("required_sources", []) or []),
            "covered_source_count": len(item.get("covered_sources", []) or []),
            "disposition_count": len(item.get("dispositions", []) or []),
            "unresolved_sources": unresolved(item),
        }

    canonical = (ROOT / CANONICAL_PATH).read_text(encoding="utf-8")
    if "selected: parent-with-distinct-sublocations" not in canonical:
        raise SystemExit("Target grouping decision is not recorded in canonical IA")
    if "whether Target sublocations share one view or use multiple views" not in canonical:
        raise SystemExit("IA/view boundary is not explicitly preserved in canonical IA")

    report = {
        "version": 1,
        "kind": "prep-ia-revalidation-report",
        "stage": "STAGE-P1-IA",
        "parent_revision": publication["revision"],
        "next_revision": next_publication["revision"],
        "old_acceptance": old_provider.get("acceptance_id"),
        "old_accepted_prerequisites": accepted_prereqs,
        "before_ia_state": before_ia,
        "target_grouping": {
            "selected": "parent-with-distinct-sublocations",
            "responsibility_decomposition_used_as_proof": False,
            "canonical_changed": True,
        },
        "derivations": derivation_report,
        "prerequisites": {
            cap: {
                "acceptance_id": lifecycle_rows[cap].get("acceptance_id"),
                "state": before_states.get(cap, {}).get("state"),
            }
            for cap in SOURCES
        },
        "new_acceptance": admitted["lifecycle_assertion"].get("acceptance_id"),
        "after_ia_state": after_ia,
        "direct_downstream": direct_downstream,
        "actionable_frontier": actionable,
        "reaccepted_artifacts": reaccepted,
    }

    (ROOT / ".harness/project-publication.next.yaml").write_text(
        yaml.safe_dump(next_publication, sort_keys=False, allow_unicode=True),
        encoding="utf-8",
    )
    (ROOT / ".harness/ia-revalidation-report.yaml").write_text(
        yaml.safe_dump(report, sort_keys=False, allow_unicode=True),
        encoding="utf-8",
    )
    print(yaml.safe_dump(report, sort_keys=False, allow_unicode=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
