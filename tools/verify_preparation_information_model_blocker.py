#!/usr/bin/env python3
"""Reproduce the preparation-model exploration and published semantic blocker."""
import copy
import hashlib
import os
from pathlib import Path
import sys
import tempfile

import yaml

ROOT = Path(__file__).resolve().parents[1]
PACK = Path(os.environ["HARNESS_ROOT"]).resolve()
sys.path.insert(0, str(PACK / "src"))
from harness.application.decision_explorer_request import derive_decision_explorer_request
from harness.application.decision_pipeline import derive_decision_roadmap
from harness.application.project_publication import build_project_publication, read_project_publication, publish_project_publication
from harness.application.semantic_admission import derive_acceptance_policy_fingerprints
from harness.assurance.capability_lifecycle import lifecycle_states
from harness.decision.decision_exploration import evaluate_decision_exploration
from harness.decision.decision_governance import axis_policies, decision_contract_index
from harness.project_model.core import CoreError, capability_blockers
from verify_mvp_product_capabilities import verify_coverage

CAP = "prep.preparation-information-model"
PREFIX = "preparation-information-model-"


def load(path):
    return yaml.safe_load(path.read_text(encoding="utf-8"))


def evidence(name):
    return load(ROOT / f".harness/candidates/{PREFIX}{name}.yaml")


def rejects(operation):
    try:
        operation()
    except CoreError:
        return
    raise AssertionError("Expected Harness rejection")


def main():
    review = evidence("review")
    assert review["status"] == "BLOCKED" and review["acceptance_id"] is None
    assert review["new_acceptances"] == []
    for path, fingerprint in review["unchanged_files_sha256"].items():
        assert hashlib.sha256((ROOT / path).read_bytes()).hexdigest() == fingerprint
    graph = load(ROOT / ".harness/engineering-graph.yaml")
    previous = read_project_publication(ROOT / f".harness/candidates/{PREFIX}base-publication.yaml", graph=graph)
    current = read_project_publication(ROOT / ".harness/project-publication.yaml", graph=graph)
    old_core, core = previous["state"]["core_model"], current["state"]["core_model"]
    assert core == load(ROOT / ".harness/core.yaml")
    assert current["parent_revision"] == previous["revision"] == review["old_revision"]
    assert current["revision"] == review["publication_revision"]
    for component in ("semantic_evaluations", "lifecycle", "decision_failures"):
        assert current["state"][component] == previous["state"][component]
    added = core["questions"][len(old_core["questions"]):]
    expected_core = copy.deepcopy(old_core)
    expected_core["questions"].extend(added)
    assert core == expected_core
    assert [row["id"] for row in added] == review["questions"]
    assert all(row["authority"] == "TACTICAL-DOMAIN-DESIGN" and row["blocks_capabilities"] == [CAP] and "resolution" not in row for row in added)
    assert capability_blockers(core, CAP) == review["questions"]
    assert capability_blockers(core, "prep.recorded-activity-history-model") == []
    contracts = load(PACK / "spec/decision-governance/knowledge-kind-decision-contracts-v1.yaml")
    policy = evidence("execution-policy")
    assert policy["knowledge_kinds"] == [{"knowledge_kind": "domain-model", "exploration": "EXPLORE", "autonomy": "CONSERVATIVE"}]
    request = derive_decision_explorer_request(graph=graph, model=old_core, decision_contracts=contracts, decision_policy=policy, capability=CAP, lifecycle=previous["state"]["lifecycle"])
    assert request == evidence("explorer-request")
    assert request["mode"] == "CREATE" and request["request_id"] == review["explorer_request_id"]
    assert {row["id"] for row in request["canonical_inputs"]} == {"PRODUCT-VISION", "PRODUCT-CAPABILITIES", "CONTEXT-MAP"}
    contract = decision_contract_index(contracts)["domain-model"]
    policies = axis_policies(contract, policy)
    exploration = evidence("exploration")
    def evaluate(document):
        return evaluate_decision_exploration(contract=contract, axis_policies=policies, capability=CAP, knowledge_kind="domain-model", evidence=document, explorer_request=request, model=old_core)
    assert evaluate(exploration) == evidence("exploration-evaluation")
    assert evaluate(exploration)["status"] == "ACCEPTED"
    for modification in ("missing-axis", "preselected", "wrong-request", "open-gap"):
        invalid = copy.deepcopy(exploration)
        if modification == "missing-axis":
            invalid["axes"].pop()
        elif modification == "preselected":
            invalid["preferred"] = "INSTANCE"
        elif modification == "wrong-request":
            invalid["explorer_request_id"] = "wrong-baseline"
        else:
            invalid["decision_space_review"]["open_gaps"] = ["Undispositioned identity choice"]
        assert evaluate(invalid)["status"] == "REJECTED", modification
    def roadmap(model):
        return derive_decision_roadmap(graph=graph, model=model, target="FRONTEND-IMPLEMENTATION", lifecycle=current["state"]["lifecycle"], decision_contracts=contracts, decision_policy=policy, decision_failures=current["state"]["decision_failures"])
    initial, blocked = roadmap(old_core), roadmap(core)
    assert initial == evidence("initial-roadmap")
    assert blocked == evidence("blocked-roadmap")
    assert any(row["capability"] == CAP and row["reason"] == "CREATE_MISSING_PROVIDER" for row in initial["ready"])
    assert not any(row["capability"] == CAP for row in blocked["ready"])
    assert any(row["capability"] == CAP for row in blocked["blocked"])
    acceptance_policies = derive_acceptance_policy_fingerprints(graph=graph, knowledge_contracts=load(PACK / "spec/semantic-acceptance/knowledge-kind-contracts-v1.yaml"))
    states = lifecycle_states(graph, core, current["state"]["lifecycle"], current_acceptance_policy_fingerprints=acceptance_policies)
    accepted = {row["capability"] for row in previous["state"]["lifecycle"]["providers"]}
    assert len(accepted) == 5
    assert {cap for cap, row in states.items() if row["state"] == "CURRENT"} == accepted
    assert states[CAP]["state"] != "CURRENT"
    assert states["prep.recorded-activity-history-model"]["state"] != "CURRENT"
    rebuilt = build_project_publication(graph=graph, core_model=core, semantic_evaluations=current["state"]["semantic_evaluations"], lifecycle=current["state"]["lifecycle"], decision_failures=current["state"]["decision_failures"], parent_revision=previous["revision"])
    assert rebuilt == current
    with tempfile.TemporaryDirectory() as directory:
        path = Path(directory) / "publication.yaml"
        path.write_text(yaml.safe_dump(previous, sort_keys=False))
        assert publish_project_publication(path, graph=graph, publication=current, expected_revision=previous["revision"]) == current
        rejects(lambda: publish_project_publication(path, graph=graph, publication=current, expected_revision=previous["revision"]))
    verify_coverage(load(ROOT / ".harness/knowledge/product-capabilities.yaml")["content"], load(ROOT / ".harness/knowledge/product-intent.yaml")["content"])
    print("PASS: initial actionable CREATE, candidate-free exploration accepted, three scoped Questions/CAS reproduce, five unchanged policy-bound CURRENT, full CRUD/bulk and RETIRED preserved; no Tactical/downstream acceptance.")
    print("NEGATIVE PASS: missing axis, preselection, wrong baseline, open review gap and stale CAS rejected.")


if __name__ == "__main__":
    main()
