#!/usr/bin/env python3
"""Reproduce bounded Discovery admission and verify its published baseline."""
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

from harness.application.project_publication import (
    build_project_publication,
    prepare_capability_transition,
    publish_project_publication,
    read_project_publication,
)
from harness.application.semantic_admission import admit_artifact, derive_acceptance_policy_fingerprints
from harness.assurance.capability_lifecycle import lifecycle_states
from harness.assurance.semantic_fingerprint import semantic_assertion_fingerprints
from harness.project_model.core import CoreError
from harness.project_model.engineering_graph import validate_engineering_graph


def load(path: Path) -> dict:
    return yaml.safe_load(path.read_text(encoding="utf-8"))


def main() -> None:
    graph = load(ROOT / ".harness/engineering-graph.yaml")
    core = load(ROOT / ".harness/core.yaml")
    validate_engineering_graph(graph)
    publication = read_project_publication(ROOT / ".harness/project-publication.yaml", graph=graph)
    state = publication["state"]
    assert state["core_model"] == core
    expected = {"prep.problem-evidence", "prep.user-needs"}
    providers = {row["capability"]: row for row in state["lifecycle"]["providers"]}
    evaluations = {row["capability"]: row for row in state["semantic_evaluations"]["semantic_evaluations"]}
    assert len(providers) == len(state["lifecycle"]["providers"]) == 2
    assert len(evaluations) == len(state["semantic_evaluations"]["semantic_evaluations"]) == 2
    assert set(providers) == set(evaluations) == expected
    assert state["semantic_evaluations"]["derivation_evaluations"] == []
    upstream = load(ROOT / ".harness/candidates/mvp-problem-evidence-admission.yaml")
    sources = load(ROOT / ".harness/candidates/mvp-user-needs-sources.yaml")
    assert sources["acceptance_id"] == providers["prep.problem-evidence"]["acceptance_id"]
    assert semantic_assertion_fingerprints(upstream) == providers["prep.problem-evidence"]["semantic_atom_fingerprints"]
    assert sources["semantic_assertions"] == [dict(row, source_artifact="PROBLEM-EVIDENCE") for row in upstream["semantic_assertions"]]
    assert evaluations["prep.problem-evidence"] == load(ROOT / ".harness/candidates/mvp-problem-evidence-evaluation.yaml")
    migration = load(ROOT / ".harness/candidates/mvp-publication-unaccepted.yaml")
    previous = build_project_publication(
        graph=graph, core_model=core,
        semantic_evaluations=dict(state["semantic_evaluations"], semantic_evaluations=[evaluations["prep.problem-evidence"]]),
        lifecycle=dict(state["lifecycle"], providers=[providers["prep.problem-evidence"]]),
        decision_failures=state["decision_failures"], parent_revision=migration["revision"],
    )
    assert previous["revision"] == publication["parent_revision"]
    candidate = load(ROOT / ".harness/candidates/mvp-user-needs-admission.yaml")
    doc = load(ROOT / "docs/discovery/user-needs.yaml")
    assertions = {row["id"]: row for row in candidate["semantic_assertions"]}
    assert assertions["USER"]["semantic_value"] == doc["actors"][0]
    assert assertions["CTX-01"]["semantic_value"] == {
        "context": doc["context_of_use"][0], "scope": doc["scope"],
        "observed_tasks": doc["observed_tasks"], "observed_task_evidence": doc["observed_task_evidence"],
        "unresolved_downstream_decisions": doc["unresolved_downstream_decisions"],
    }
    assert assertions["UG-01"]["semantic_value"] == {"goal": doc["goals"][0], "sufficiency_review": doc["sufficiency_review"][0]}
    actors = {row["id"] for row in doc["actors"]}
    contexts = {row["id"] for row in doc["context_of_use"]}
    goals = {row["id"] for row in doc["goals"]}
    need_ids = {row["id"] for row in doc["needs"]}
    evidence_doc = load(ROOT / "docs/discovery/problem-evidence.yaml")
    observations = {row["id"] for row in evidence_doc["observations"]}
    evidence = {row["id"]: row for row in evidence_doc["evidence"]}
    for need in doc["needs"]:
        assert need["actor"] in actors and need["context"] in contexts and need["goal"] in goals
        assertion = assertions[need["id"]]
        assert assertion["semantic_value"] == need
        assert assertion["derived_from"] == need["evidence"]
        assert len(need["evidence"]) == 2
        observation, statement = need["evidence"]
        assert observation in observations and observation in evidence[statement]["supports"]
        assert assertions[need["id"] + "-EVIDENCE"]["semantic_value"] == {"need": need["id"], "evidence": need["evidence"]}
    assert {row["goal"] for row in doc["sufficiency_review"]} == goals
    for review in doc["sufficiency_review"]:
        assert review["status"] == "covered" and review["rationale"]
        assert set(review["needs"]) == {row["id"] for row in doc["needs"] if row["goal"] == review["goal"]}
    assert len(candidate["semantic_review"]["need_derivations"]) == len(need_ids)
    assert {row["need"] for row in candidate["semantic_review"]["need_derivations"]} == need_ids
    assert "Product Requirements" in evidence["EV-03"]["interpretation_boundary"]
    contracts = load(PACK / "spec/semantic-acceptance/knowledge-kind-contracts-v1.yaml")
    decisions = load(PACK / "spec/decision-governance/knowledge-kind-decision-contracts-v1.yaml")
    inputs = dict(
        graph=graph, model=core, skill_registry=load(PACK / "skills/artifact-skill-registry-v0.yaml"),
        knowledge_contracts=contracts, decision_contracts=decisions, capability="prep.user-needs",
        sources=sources, acceptance_id=providers["prep.user-needs"]["acceptance_id"],
        lifecycle=previous["state"]["lifecycle"],
    )
    result = admit_artifact(candidate=candidate, **inputs)
    assert result == evaluations["prep.user-needs"] == load(ROOT / ".harness/candidates/mvp-user-needs-evaluation.yaml")
    assert result["status"] == "ACCEPTED" and result["findings"] == []
    assert result["admission"]["accepted_prerequisites"] == {"prep.problem-evidence": sources["acceptance_id"]}
    for need_id in need_ids:
        incomplete = copy.deepcopy(candidate)
        incomplete["semantic_assertions"] = [row for row in incomplete["semantic_assertions"] if row["id"] != need_id + "-EVIDENCE"]
        rejected = admit_artifact(candidate=incomplete, **inputs)
        assert rejected["status"] == "REJECTED"
        assert any(row["code"] == "MISSING_SUBJECTS" and need_id in row["subjects"] for row in rejected["findings"])
    try:
        admit_artifact(candidate=candidate, **dict(inputs, lifecycle={"version": 1, "kind": "harness-capability-lifecycle", "providers": []}))
    except CoreError as error:
        assert "not CURRENT" in str(error)
    else:
        raise AssertionError("Admission accepted an unaccepted prerequisite")
    policies = derive_acceptance_policy_fingerprints(graph=graph, knowledge_contracts=contracts, decision_contracts=decisions)
    states = lifecycle_states(graph, core, state["lifecycle"], current_acceptance_policy_fingerprints=policies)
    assert {cap for cap, row in states.items() if row["state"] == "CURRENT"} == expected
    prepared = prepare_capability_transition(
        graph=graph, current_publication=previous, expected_revision=previous["revision"],
        capability="prep.user-needs", outcome="CURRENT", core_model=core,
        semantic_evaluations=state["semantic_evaluations"], lifecycle=state["lifecycle"],
        decision_failures=state["decision_failures"],
    )
    assert prepared == publication
    with tempfile.TemporaryDirectory() as directory:
        path = Path(directory) / "publication.yaml"
        path.write_text(yaml.safe_dump(previous, sort_keys=False), encoding="utf-8")
        assert publish_project_publication(path, graph=graph, publication=prepared, expected_revision=previous["revision"]) == publication
        try:
            publish_project_publication(path, graph=graph, publication=prepared, expected_revision=previous["revision"])
        except CoreError as error:
            assert "compare-and-swap failed" in str(error)
        else:
            raise AssertionError("Publication accepted a stale CAS revision")
    print("PASS: per-need accepted provenance, scoped sufficiency, reproducible admission, prerequisite/evidence rejection, both policy-bound CURRENT, exact CAS transition, unchanged upstream acceptance, no other acceptances")


if __name__ == "__main__":
    main()
