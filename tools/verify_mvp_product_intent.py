#!/usr/bin/env python3
"""Verify owner provenance, strict admission and the bounded CAS publication."""
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
from harness.project_model.core import CoreError, resolve_question
from harness.workspace.workspace import validate_knowledge_document

QUESTION = "Q-PREP-PRODUCT-INTENT-INFORMATION-LIFECYCLE"
CAPABILITY = "prep.product-intent"


def load(path: Path) -> dict:
    return yaml.safe_load(path.read_text(encoding="utf-8"))


def verify_owner_provenance(content: dict, record: dict) -> None:
    assert record["author"] == "lehater"
    assert record["source_url"] == "https://github.com/lehater/prep/pull/93"
    assert record["head_revision"] == "a074ab34bc3e31d1104dd6050b5345e1bf0d47a8"
    assert content["scope_boundaries"] == record["scope_boundaries"]
    assert content["non_goals"] == record["non_goals"]
    assert len(content["product_decisions"]) == len(record["product_decisions"]) == 2
    for decision, original in zip(content["product_decisions"], record["product_decisions"]):
        assert decision["decision_status"] == "OWNER_CONFIRMED"
        assert decision["authority"] == "PRODUCT-REQUIREMENTS" and decision["source"] == "project-owner"
        expected_record = dict(url=record["source_url"], author=record["author"], revision=record["head_revision"])
        assert decision == dict(original, source_record=expected_record)
    owner_ids = {row["id"] for row in content["product_decisions"]}
    for requirement in content["requirements"]:
        if requirement["status"] == "ACCEPTED" and requirement["id"] in {
            "REQ-INFORMATION-BULK-LOAD", "REQ-INFORMATION-CREATE", "REQ-INFORMATION-READ",
            "REQ-INFORMATION-UPDATE", "REQ-INFORMATION-DELETE", "REQ-RECORDED-ACTIVITY-INTAKE",
        }:
            assert set(requirement["source_refs"]) & owner_ids


def main() -> None:
    graph = load(ROOT / ".harness/engineering-graph.yaml")
    core = load(ROOT / ".harness/core.yaml")
    publication = read_project_publication(ROOT / ".harness/project-publication.yaml", graph=graph)
    state = publication["state"]
    assert state["core_model"] == core
    providers = {row["capability"]: row for row in state["lifecycle"]["providers"]}
    evaluations = {row["capability"]: row for row in state["semantic_evaluations"]["semantic_evaluations"]}
    expected = {"prep.problem-evidence", "prep.user-needs", CAPABILITY}
    assert set(providers) == set(evaluations) == expected
    assert len(state["lifecycle"]["providers"]) == len(state["semantic_evaluations"]["semantic_evaluations"]) == 3
    for name in ["problem-evidence", "user-needs"]:
        accepted = load(ROOT / f".harness/candidates/mvp-{name}-evaluation.yaml")
        assert evaluations[f"prep.{name}"] == accepted
        assert providers[f"prep.{name}"] == accepted["lifecycle_assertion"]
    document = load(ROOT / ".harness/knowledge/product-intent.yaml")
    validate_knowledge_document(document)
    content = document["content"]
    owner_record = load(ROOT / ".harness/candidates/mvp-product-intent-owner-record.yaml")
    verify_owner_provenance(content, owner_record)
    for field, value in [("decision_status", "UNCONFIRMED"), ("source", "inferred-from-user-needs")]:
        invalid = copy.deepcopy(content)
        invalid["product_decisions"][0][field] = value
        try:
            verify_owner_provenance(invalid, owner_record)
        except AssertionError:
            pass
        else:
            raise AssertionError("Owner provenance validation accepted an unsupported decision")
    candidate = load(ROOT / ".harness/candidates/mvp-product-intent-admission.yaml")
    assertions = {row["id"]: row for row in candidate["semantic_assertions"]}
    requirements = {row["id"]: row for row in content["requirements"]}
    assert len(requirements) == len(content["requirements"])
    active = {key for key, row in requirements.items() if row["status"] == "ACCEPTED"}
    assert {key for key, row in assertions.items() if row["kind"] == "product-requirement"} == active
    assert requirements["REQ-INFORMATION-LIFECYCLE"]["status"] == "RETIRED"
    for requirement in requirements.values():
        if requirement["status"] != "ACCEPTED":
            continue
        assertion = assertions[requirement["id"]]
        assert assertion["semantic_value"] == requirement and requirement["acceptance_examples"]
        assert assertion["derived_from"] == [ref for ref in requirement["source_refs"] if not ref.startswith("PD-")]
        assert assertion["product_decision_refs"] == [ref for ref in requirement["source_refs"] if ref.startswith("PD-")]
    for decision in content["product_decisions"]:
        assert assertions[decision["id"]]["semantic_value"] == decision
    assert assertions["PI-SCOPE"]["semantic_value"] == {
        "purpose": content["purpose"], "scope_boundaries": content["scope_boundaries"],
        "non_goals": content["non_goals"], "retired_requirements": [row for row in content["requirements"] if row["status"] == "RETIRED"],
    }
    for key in ["REQ-INFORMATION-CREATE", "REQ-INFORMATION-UPDATE"]:
        assert "manually" in requirements[key]["statement"]
        assert "independently of bulk loading" in requirements[key]["statement"]
    upstream = load(ROOT / ".harness/candidates/mvp-user-needs-admission.yaml")
    sources = load(ROOT / ".harness/candidates/mvp-product-intent-sources.yaml")
    assert sources["semantic_assertions"] == [dict(row, source_artifact="USER-NEEDS") for row in upstream["semantic_assertions"]]
    assert sources["acceptance_id"] == providers["prep.user-needs"]["acceptance_id"]
    assert semantic_assertion_fingerprints(upstream) == providers["prep.user-needs"]["semantic_atom_fingerprints"]
    blocked_core = copy.deepcopy(core)
    question = next(row for row in blocked_core["questions"] if row["id"] == QUESTION)
    assert question.pop("resolution") == {
        "artifact": "PRODUCT-VISION", "acceptance_id": providers[CAPABILITY]["acceptance_id"], "supersedes_acceptance_id": "ABSENT",
    }
    prior_review = load(ROOT / ".harness/candidates/mvp-product-intent-review.yaml")
    previous = build_project_publication(
        graph=graph, core_model=blocked_core, parent_revision=prior_review["parent_revision"],
        semantic_evaluations=dict(state["semantic_evaluations"], semantic_evaluations=[row for row in evaluations.values() if row["capability"] != CAPABILITY]),
        lifecycle=dict(state["lifecycle"], providers=[row for row in providers.values() if row["capability"] != CAPABILITY]),
        decision_failures=state["decision_failures"],
    )
    assert previous["revision"] == prior_review["publication_revision"] == publication["parent_revision"]
    contracts = load(PACK / "spec/semantic-acceptance/knowledge-kind-contracts-v1.yaml")
    inputs = dict(
        graph=graph, model=blocked_core, skill_registry=load(PACK / "skills/artifact-skill-registry-v0.yaml"),
        knowledge_contracts=contracts, capability=CAPABILITY, sources=sources,
        acceptance_id=providers[CAPABILITY]["acceptance_id"], lifecycle=previous["state"]["lifecycle"],
    )
    result = admit_artifact(candidate=candidate, **inputs)
    assert result == evaluations[CAPABILITY] == load(ROOT / ".harness/candidates/mvp-product-intent-evaluation.yaml")
    assert result["status"] == "ACCEPTED" and not result["findings"]
    invalid = copy.deepcopy(candidate)
    invalid["semantic_review"]["checks"].remove("source-discipline")
    assert admit_artifact(candidate=invalid, **inputs)["status"] == "REJECTED"
    try:
        admit_artifact(candidate=candidate, **dict(inputs, lifecycle={"version": 1, "kind": "harness-capability-lifecycle", "providers": []}))
    except CoreError:
        pass
    else:
        raise AssertionError("Admission accepted a non-current prerequisite")
    assert resolve_question(blocked_core, QUESTION, "PRODUCT-VISION", result["admission"]["acceptance_id"], "ABSENT") == core
    transition = dict(
        graph=graph, current_publication=previous, expected_revision=previous["revision"],
        capability=CAPABILITY, outcome="CURRENT", core_model=core,
        semantic_evaluations=state["semantic_evaluations"], lifecycle=state["lifecycle"], decision_failures=state["decision_failures"],
    )
    assert prepare_capability_transition(**transition) == publication
    try:
        prepare_capability_transition(**dict(transition, core_model=blocked_core))
    except CoreError:
        pass
    else:
        raise AssertionError("CURRENT publication accepted an unresolved Question")
    policies = derive_acceptance_policy_fingerprints(graph=graph, knowledge_contracts=contracts)
    states = lifecycle_states(graph, core, state["lifecycle"], current_acceptance_policy_fingerprints=policies)
    assert {cap for cap, row in states.items() if row["state"] == "CURRENT"} == expected
    with tempfile.TemporaryDirectory() as directory:
        path = Path(directory) / "publication.yaml"
        path.write_text(yaml.safe_dump(previous, sort_keys=False))
        assert publish_project_publication(path, graph=graph, publication=publication, expected_revision=previous["revision"]) == publication
        try:
            publish_project_publication(path, graph=graph, publication=publication, expected_revision=previous["revision"])
        except CoreError:
            pass
        else:
            raise AssertionError("Publication accepted a stale CAS revision")
    print("PASS: owner provenance, atomic requirement/source projection, strict admission, Question resolution, exact CAS, three CURRENT only, unchanged upstream; unsupported owner provenance, missing review, non-current dependency, unresolved Question and stale CAS rejected")


if __name__ == "__main__":
    main()
