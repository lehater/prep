#!/usr/bin/env python3
"""Verify bounded Product Capabilities against the accepted Product Intent."""
from __future__ import annotations

import copy
import os
import sys
import tempfile
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
PACK = Path(os.environ["HARNESS_ROOT"])
sys.path.insert(0, str(PACK / "src"))

from harness.application.project_publication import build_project_publication, prepare_capability_transition, publish_project_publication, read_project_publication
from harness.application.semantic_admission import admit_artifact, derive_acceptance_policy_fingerprints
from harness.assurance.capability_lifecycle import lifecycle_states
from harness.assurance.semantic_fingerprint import semantic_assertion_fingerprints
from harness.project_model.core import CoreError
from harness.workspace.workspace import validate_knowledge_document

CAPABILITY = "prep.product-capabilities"
RETIRED = {
    "REQ-CAP-KNOWLEDGE-KINDS", "REQ-CAP-RELATIONSHIP-MEANINGS",
    "REQ-CAP-CROSS-INFORMATION-RELATIONSHIPS", "REQ-CAP-PRESERVE-HISTORY-CONTEXT",
}
CRUD_AND_BULK = {
    "REQ-CAP-INTRODUCE-INFORMATION", "REQ-CAP-READ-INFORMATION",
    "REQ-CAP-CHANGE-INFORMATION", "REQ-CAP-REMOVE-INFORMATION",
    "REQ-CAP-BULK-LOAD-INFORMATION",
}


def load(path: Path) -> dict:
    return yaml.safe_load(path.read_text(encoding="utf-8"))


def verify_coverage(content: dict, intent: dict) -> None:
    requirements = {row["id"]: row for row in content["requirements"]}
    assert len(requirements) == len(content["requirements"])
    active = {key: row for key, row in requirements.items() if row["status"] == "ACCEPTED"}
    assert {key for key, row in requirements.items() if row["status"] == "RETIRED"} == RETIRED
    sources = {row["id"] for row in intent["requirements"] if row["status"] == "ACCEPTED"}
    coverage = {row["intent"]: row["capabilities"] for row in content["intent_coverage"]}
    assert len(coverage) == len(content["intent_coverage"]) == 12
    assert set(coverage) == sources
    for requirement in active.values():
        assert requirement["source_refs"] and set(requirement["source_refs"]) <= sources
        assert requirement["acceptance_examples"]
        assert all(isinstance(example, str) and example.strip() for example in requirement["acceptance_examples"])
    for source, targets in coverage.items():
        assert targets and set(targets) <= set(active)
        assert all(source in active[target]["source_refs"] for target in targets)
    assert {target for targets in coverage.values() for target in targets} == set(active)
    for identifier in CRUD_AND_BULK:
        statement = active[identifier]["statement"]
        assert "every entity and relationship" in statement
        assert "recorded activity and results" in statement
    for identifier in ["REQ-CAP-INTRODUCE-INFORMATION", "REQ-CAP-CHANGE-INFORMATION"]:
        assert "manually" in active[identifier]["statement"]
        assert "without bulk loading" in active[identifier]["statement"]
    assert "externally supplied information" in active["REQ-CAP-BULK-LOAD-INFORMATION"]["statement"]


def main() -> None:
    graph = load(ROOT / ".harness/engineering-graph.yaml")
    core = load(ROOT / ".harness/core.yaml")
    publication = read_project_publication(ROOT / ".harness/project-publication.yaml", graph=graph)
    state = publication["state"]
    assert state["core_model"] == core
    upstream_caps = {"prep.problem-evidence", "prep.user-needs", "prep.product-intent"}
    expected = upstream_caps | {CAPABILITY}
    providers = {row["capability"]: row for row in state["lifecycle"]["providers"]}
    evaluations = {row["capability"]: row for row in state["semantic_evaluations"]["semantic_evaluations"]}
    assert set(providers) == set(evaluations) == expected
    assert len(state["lifecycle"]["providers"]) == len(state["semantic_evaluations"]["semantic_evaluations"]) == 4
    for cap in upstream_caps:
        accepted = load(ROOT / f".harness/candidates/mvp-{cap.removeprefix('prep.')}-evaluation.yaml")
        assert evaluations[cap] == accepted
        assert providers[cap] == accepted["lifecycle_assertion"]
    document = load(ROOT / ".harness/knowledge/product-capabilities.yaml")
    validate_knowledge_document(document)
    content = document["content"]
    intent = load(ROOT / ".harness/knowledge/product-intent.yaml")["content"]
    verify_coverage(content, intent)
    invalid_variants = []
    missing_crud = copy.deepcopy(content)
    missing_crud["requirements"] = [row for row in missing_crud["requirements"] if row["id"] != "REQ-CAP-INTRODUCE-INFORMATION"]
    invalid_variants.append(missing_crud)
    invalid_source = copy.deepcopy(content)
    invalid_source["requirements"][0]["source_refs"] = ["REQ-INFORMATION-LIFECYCLE"]
    invalid_variants.append(invalid_source)
    partial_crud = copy.deepcopy(content)
    partial_crud["requirements"][0]["statement"] = partial_crud["requirements"][0]["statement"].replace("every entity", "some entity")
    invalid_variants.append(partial_crud)
    for identifier in RETIRED:
        unsupported = copy.deepcopy(content)
        next(row for row in unsupported["requirements"] if row["id"] == identifier)["status"] = "ACCEPTED"
        invalid_variants.append(unsupported)
    for invalid in invalid_variants:
        try:
            verify_coverage(invalid, intent)
        except (AssertionError, KeyError):
            pass
        else:
            raise AssertionError("Coverage review accepted a missing/unsupported obligation")
    candidate = load(ROOT / ".harness/candidates/mvp-product-capabilities-admission.yaml")
    assertions = {row["id"]: row for row in candidate["semantic_assertions"]}
    active = {row["id"]: row for row in content["requirements"] if row["status"] == "ACCEPTED"}
    assert {key for key, row in assertions.items() if row["kind"] == "product-capability"} == set(active)
    for key, row in active.items():
        assert assertions[key]["semantic_value"] == row
        assert assertions[key]["derived_from"] == row["source_refs"]
    assert assertions["PC-SCOPE"]["semantic_value"] == {
        "purpose": content["purpose"], "scope_boundaries": content["scope_boundaries"],
        "intent_coverage": content["intent_coverage"], "non_goals": content["non_goals"],
        "retired_requirements": [row for row in content["requirements"] if row["status"] == "RETIRED"],
    }
    retirements = candidate["semantic_review"]["retirement_review"]
    assert len(retirements) == 4 and {row["requirement"] for row in retirements} == RETIRED
    assert all(row["status"] == "RETIRED" and row["basis"] for row in retirements)
    upstream = load(ROOT / ".harness/candidates/mvp-product-intent-admission.yaml")
    sources = load(ROOT / ".harness/candidates/mvp-product-capabilities-sources.yaml")
    assert sources["acceptance_id"] == providers["prep.product-intent"]["acceptance_id"]
    assert sources["semantic_assertions"] == [dict(row, source_artifact="PRODUCT-VISION") for row in upstream["semantic_assertions"]]
    assert semantic_assertion_fingerprints(upstream) == providers["prep.product-intent"]["semantic_atom_fingerprints"]
    prior_review = load(ROOT / ".harness/candidates/mvp-product-intent-verification.yaml")
    previous = build_project_publication(
        graph=graph, core_model=core, parent_revision=prior_review["parent_revision"],
        semantic_evaluations=dict(state["semantic_evaluations"], semantic_evaluations=[row for row in evaluations.values() if row["capability"] != CAPABILITY]),
        lifecycle=dict(state["lifecycle"], providers=[row for row in providers.values() if row["capability"] != CAPABILITY]),
        decision_failures=state["decision_failures"],
    )
    assert previous["revision"] == prior_review["publication_revision"] == publication["parent_revision"]
    contracts = load(PACK / "spec/semantic-acceptance/knowledge-kind-contracts-v1.yaml")
    inputs = dict(
        graph=graph, model=core, skill_registry=load(PACK / "skills/artifact-skill-registry-v0.yaml"),
        knowledge_contracts=contracts, capability=CAPABILITY, sources=sources,
        acceptance_id=providers[CAPABILITY]["acceptance_id"], lifecycle=previous["state"]["lifecycle"],
    )
    result = admit_artifact(candidate=candidate, **inputs)
    assert result == evaluations[CAPABILITY] == load(ROOT / ".harness/candidates/mvp-product-capabilities-evaluation.yaml")
    assert result["status"] == "ACCEPTED" and result["findings"] == []
    invalid = copy.deepcopy(candidate)
    invalid["semantic_review"]["checks"].remove("source-discipline")
    assert admit_artifact(candidate=invalid, **inputs)["status"] == "REJECTED"
    invalid = copy.deepcopy(candidate)
    invalid["semantic_assertions"][0]["derived_from"] = ["UNKNOWN-SOURCE"]
    assert admit_artifact(candidate=invalid, **inputs)["status"] == "REJECTED"
    try:
        admit_artifact(candidate=candidate, **dict(inputs, lifecycle={"version": 1, "kind": "harness-capability-lifecycle", "providers": []}))
    except CoreError:
        pass
    else:
        raise AssertionError("Admission accepted an UNKNOWN prerequisite")
    policies = derive_acceptance_policy_fingerprints(graph=graph, knowledge_contracts=contracts)
    states = lifecycle_states(graph, core, state["lifecycle"], current_acceptance_policy_fingerprints=policies)
    assert {cap for cap, row in states.items() if row["state"] == "CURRENT"} == expected
    stale_policy = dict(policies, **{CAPABILITY: "different-policy"})
    assert lifecycle_states(graph, core, state["lifecycle"], current_acceptance_policy_fingerprints=stale_policy)[CAPABILITY]["state"] == "STALE"
    prepared = prepare_capability_transition(
        graph=graph, current_publication=previous, expected_revision=previous["revision"],
        capability=CAPABILITY, outcome="CURRENT", core_model=core,
        semantic_evaluations=state["semantic_evaluations"], lifecycle=state["lifecycle"], decision_failures=state["decision_failures"],
    )
    assert prepared == publication
    with tempfile.TemporaryDirectory() as directory:
        path = Path(directory) / "publication.yaml"
        path.write_text(yaml.safe_dump(previous, sort_keys=False))
        assert publish_project_publication(path, graph=graph, publication=prepared, expected_revision=previous["revision"]) == publication
        try:
            publish_project_publication(path, graph=graph, publication=prepared, expected_revision=previous["revision"])
        except CoreError:
            pass
        else:
            raise AssertionError("Publication accepted a stale CAS revision")
    print("PASS: full intent coverage, all-kind CRUD/bulk, accepted source fingerprints, four retirement reviews, strict admission, CAS, four CURRENT only; missing/partial CRUD, retired source/reactivation, missing review, unknown provenance/dependency, stale policy/CAS rejected")


if __name__ == "__main__":
    main()
