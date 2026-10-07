#!/usr/bin/env python3
from __future__ import annotations

import copy
import hashlib
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

CAPABILITY = "prep.conceptual-interface-model"
ACCEPTANCE_ID = "PREP-CONCEPTUAL-INTERFACE-MODEL-STRICT-6"
CANDIDATE_PATH = ".harness/candidates/conceptual-interface-model-admission.yaml"
CANONICAL_PATH = "docs/interface/conceptual-interface-model.yaml"

SOURCE_CANDIDATES = {
    "prep.task-model": ".harness/candidates/task-model-admission.yaml",
    "prep.user-journeys": ".harness/candidates/process-migration-user-journeys-admission.yaml",
    "prep.application-design": ".harness/candidates/process-migration-application-design-admission.yaml",
    "prep.knowledge-model": ".harness/candidates/knowledge-model-admission.yaml",
    "prep.learning-design": ".harness/candidates/learning-design-admission.yaml",
    "prep.learner-model": ".harness/candidates/learner-model-admission.yaml",
}

JOURNEY_CONTRACT = ".harness/candidates/conceptual-interface-journey-contract.yaml"
JOURNEY_EVIDENCE = ".harness/candidates/conceptual-interface-journey-evidence.yaml"


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
    before_cim = before_states.get(CAPABILITY, {})
    if before_cim.get("state") == "CURRENT":
        raise SystemExit("Expected stale CIM before revalidation, got CURRENT")

    old_provider = lifecycle_rows[CAPABILITY]
    if old_provider.get("acceptance_id") != "PREP-CONCEPTUAL-INTERFACE-MODEL-STRICT-5":
        raise SystemExit(f"Unexpected old CIM acceptance: {old_provider.get('acceptance_id')}")
    if old_provider.get("accepted_prerequisites", {}).get("prep.user-journeys") != "PREP-USER-JOURNEYS-STRICT-5":
        raise SystemExit("Old CIM does not record Journey STRICT-5 as expected")
    if lifecycle_rows["prep.user-journeys"].get("acceptance_id") != "PREP-USER-JOURNEYS-STRICT-6":
        raise SystemExit("Current Journey provider is not STRICT-6")

    target_candidate = load(CANDIDATE_PATH)
    target_fingerprints = semantic_assertion_fingerprints(target_candidate)
    if target_fingerprints != old_provider.get("semantic_atom_fingerprints"):
        raise SystemExit("Canonical CIM semantic candidate changed unexpectedly")

    sources = {"semantic_assertions": []}
    source_docs: dict[str, dict[str, Any]] = {}
    for source_capability, source_path in SOURCE_CANDIDATES.items():
        state = before_states.get(source_capability, {})
        if state.get("state") != "CURRENT":
            raise SystemExit(
                f"Prerequisite {source_capability} is not CURRENT: {state}"
            )
        doc = load(source_path)
        source_docs[source_capability] = doc
        current_fp = semantic_assertion_fingerprints(doc)
        provider_fp = lifecycle_rows[source_capability].get("semantic_atom_fingerprints")
        if current_fp != provider_fp:
            raise SystemExit(
                f"Source candidate surface differs from current provider for {source_capability}"
            )
        source_artifact = artifact_for_capability(core, source_capability)
        for assertion in doc.get("semantic_assertions", []) or []:
            copied = copy.deepcopy(assertion)
            copied["source_artifact"] = source_artifact
            sources["semantic_assertions"].append(copied)

    incoming: list[dict[str, Any]] = []
    for source_capability in SOURCE_CANDIDATES:
        key = (source_capability, CAPABILITY)
        previous = derivations.get(key)
        if previous is None or previous.get("status") != "ACCEPTED":
            raise SystemExit(f"Missing accepted published derivation for {key}")

        if source_capability == "prep.user-journeys":
            evaluated = evaluate_derivation(
                graph=graph,
                contract=load(JOURNEY_CONTRACT),
                source=source_docs[source_capability],
                candidate=target_candidate,
                evidence=load(JOURNEY_EVIDENCE),
            )
            if evaluated.get("status") != "ACCEPTED":
                raise SystemExit(
                    "Journey -> CIM exhaustive derivation rejected: "
                    + yaml.safe_dump(
                        {
                            "findings": evaluated.get("findings"),
                            "coverage": evaluated.get("coverage"),
                            "required_sources": evaluated.get("required_sources"),
                            "covered_sources": evaluated.get("covered_sources"),
                            "dispositions": evaluated.get("dispositions"),
                        },
                        sort_keys=False,
                        allow_unicode=True,
                    )
                )
            incoming.append(evaluated)
            continue

        dep = previous.get("lifecycle_dependency", {}) or {}
        if dep.get("source_surface_fingerprints") != lifecycle_rows[source_capability].get(
            "semantic_atom_fingerprints"
        ):
            raise SystemExit(
                f"Published derivation source surface is stale for {source_capability}"
            )
        incoming.append(copy.deepcopy(previous))

    admitted = admit_artifact(
        graph=graph,
        model=core,
        skill_registry=registry,
        knowledge_contracts=semantic_contracts,
        derivation_evaluations=incoming,
        capability=CAPABILITY,
        sources=sources,
        candidate=target_candidate,
        acceptance_id=ACCEPTANCE_ID,
        lifecycle=lifecycle,
        decision_request_mode="REVISION",
    )
    if admitted.get("status") != "ACCEPTED":
        raise SystemExit(
            "CIM admission rejected: "
            + yaml.safe_dump(admitted.get("findings"), allow_unicode=True)
        )

    old_ids = {
        cap: row.get("acceptance_id") for cap, row in lifecycle_rows.items()
    }

    replace_artifact_evaluation(semantic_set, admitted)
    journey_eval = next(
        item for item in incoming if item["source_capability"] == "prep.user-journeys"
    )
    replace_derivation_evaluation(semantic_set, journey_eval)
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
        raise SystemExit(f"Downstream/upstream artifacts were reaccepted unexpectedly: {reaccepted}")

    after_states = lifecycle_states(
        graph,
        core,
        lifecycle,
        current_acceptance_policy_fingerprints=policy_fingerprints,
    )
    after_cim = after_states.get(CAPABILITY, {})
    if after_cim.get("state") != "CURRENT":
        raise SystemExit(f"CIM did not become CURRENT: {after_cim}")

    direct_downstream: dict[str, Any] = {}
    for capability, production in productions.items():
        if capability == CAPABILITY:
            continue
        requires = [
            item.get("capability")
            for item in production.get("requires", []) or []
            if isinstance(item, dict)
        ]
        if CAPABILITY in requires:
            direct_downstream[capability] = after_states.get(capability)

    canonical_bytes = (ROOT / CANONICAL_PATH).read_bytes()
    report = {
        "version": 1,
        "kind": "prep-cim-revalidation-report",
        "stage": "STAGE-P0-CIM",
        "parent_revision": publication["revision"],
        "next_revision": next_publication["revision"],
        "old_acceptance": old_provider.get("acceptance_id"),
        "old_accepted_journey": old_provider.get("accepted_prerequisites", {}).get("prep.user-journeys"),
        "current_journey": lifecycle_rows["prep.user-journeys"].get("acceptance_id"),
        "before_cim_state": before_cim,
        "journey_derivation": {
            "status": journey_eval.get("status"),
            "coverage": journey_eval.get("coverage"),
            "required_source_count": len(journey_eval.get("required_sources", []) or []),
            "covered_source_count": len(journey_eval.get("covered_sources", []) or []),
            "disposition_count": len(journey_eval.get("dispositions", []) or []),
            "unresolved_sources": sorted(
                set(journey_eval.get("required_sources", []) or [])
                - set(journey_eval.get("covered_sources", []) or [])
                - {
                    item.get("source")
                    for item in journey_eval.get("dispositions", []) or []
                    if isinstance(item, dict)
                }
            ),
        },
        "prerequisites": {
            cap: {
                "acceptance_id": lifecycle_rows[cap].get("acceptance_id"),
                "state": before_states.get(cap, {}).get("state"),
            }
            for cap in SOURCE_CANDIDATES
        },
        "new_acceptance": admitted["lifecycle_assertion"].get("acceptance_id"),
        "after_cim_state": after_cim,
        "direct_downstream": direct_downstream,
        "reaccepted_artifacts": reaccepted,
        "canonical_cim_sha256": hashlib.sha256(canonical_bytes).hexdigest(),
    }

    (ROOT / ".harness/project-publication.next.yaml").write_text(
        yaml.safe_dump(next_publication, sort_keys=False, allow_unicode=True),
        encoding="utf-8",
    )
    (ROOT / ".harness/cim-revalidation-report.yaml").write_text(
        yaml.safe_dump(report, sort_keys=False, allow_unicode=True),
        encoding="utf-8",
    )
    print(yaml.safe_dump(report, sort_keys=False, allow_unicode=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
