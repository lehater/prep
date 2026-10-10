#!/usr/bin/env python3
"""Verify the strategic review, bounded admission and published currentness."""
from __future__ import annotations

import copy
import os
import re
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

CAPABILITY = "prep.domain-strategy"


def load(path: Path) -> dict:
    return yaml.safe_load(path.read_text(encoding="utf-8"))


def main() -> None:
    graph = load(ROOT / ".harness/engineering-graph.yaml")
    core = load(ROOT / ".harness/core.yaml")
    publication = read_project_publication(ROOT / ".harness/project-publication.yaml", graph=graph)
    state = publication["state"]
    assert state["core_model"] == core
    upstream_caps = {"prep.problem-evidence", "prep.user-needs", "prep.product-intent", "prep.product-capabilities"}
    expected = upstream_caps | {CAPABILITY}
    evaluations = {row["capability"]: row for row in state["semantic_evaluations"]["semantic_evaluations"]}
    providers = {row["capability"]: row for row in state["lifecycle"]["providers"]}
    assert set(evaluations) == set(providers) == expected
    assert len(state["lifecycle"]["providers"]) == len(state["semantic_evaluations"]["semantic_evaluations"]) == 5
    for cap in upstream_caps:
        accepted = load(ROOT / f".harness/candidates/mvp-{cap.removeprefix('prep.')}-evaluation.yaml")
        assert evaluations[cap] == accepted
        assert providers[cap] == accepted["lifecycle_assertion"]
    candidate = load(ROOT / ".harness/candidates/mvp-domain-strategy-admission.yaml")
    assertions = candidate["semantic_assertions"]
    text = (ROOT / "docs/architecture/context-map.md").read_text(encoding="utf-8")
    parts = re.split(r"(?m)^(#{2,3} .+)\n", text)
    sections = dict(zip(parts[1::2], parts[2::2]))
    assert len(sections) == len(assertions) == 9
    assert {row["semantic_value"]["heading"]: row["semantic_value"]["text"] for row in assertions} == sections
    assert len({row["id"] for row in assertions}) == len(assertions)
    classifications = candidate["semantic_review"]["classification_review"]
    assert len(classifications) == 2
    assert {row["responsibility"] for row in classifications} == {"DS-01", "DS-02"}
    for row in classifications:
        assert row["classification"] == "CORE" and row["consumer"] and row["rationale"]
        assertion = next(a for a in assertions if a["id"] == row["responsibility"])
        assert row["sources"] == assertion["derived_from"]
    upstream = load(ROOT / ".harness/candidates/mvp-product-capabilities-admission.yaml")
    sources = load(ROOT / ".harness/candidates/mvp-domain-strategy-sources.yaml")
    assert sources["acceptance_id"] == providers["prep.product-capabilities"]["acceptance_id"]
    assert sources["semantic_assertions"] == [dict(row, source_artifact="PRODUCT-CAPABILITIES") for row in upstream["semantic_assertions"]]
    assert semantic_assertion_fingerprints(upstream) == providers["prep.product-capabilities"]["semantic_atom_fingerprints"]
    source_ids = {row["id"] for row in sources["semantic_assertions"]}
    consumed = {ref for row in assertions for ref in row["derived_from"]}
    assert consumed == source_ids
    requirements = load(ROOT / ".harness/knowledge/product-capabilities.yaml")["content"]["requirements"]
    retired = {row["id"] for row in requirements if row["status"] == "RETIRED"}
    assert len(retired) == 4 and not consumed & retired
    operations = next(row for row in assertions if row["id"] == "DS-CROSS-CUTTING")
    assert {"REQ-CAP-INTRODUCE-INFORMATION", "REQ-CAP-RETAIN-INFORMATION", "REQ-CAP-CHANGE-INFORMATION", "REQ-CAP-REMOVE-INFORMATION", "REQ-CAP-BULK-LOAD-INFORMATION", "REQ-CAP-READ-INFORMATION", "REQ-CAP-SELECT-PART", "REQ-CAP-TRANSFER-SELECTION"} <= set(operations["derived_from"])
    prior_report = load(ROOT / ".harness/candidates/mvp-product-capabilities-verification.yaml")
    previous = build_project_publication(
        graph=graph, core_model=core, parent_revision=prior_report["parent_revision"],
        semantic_evaluations=dict(state["semantic_evaluations"], semantic_evaluations=[row for row in evaluations.values() if row["capability"] != CAPABILITY]),
        lifecycle=dict(state["lifecycle"], providers=[row for row in providers.values() if row["capability"] != CAPABILITY]),
        decision_failures=state["decision_failures"],
    )
    assert previous["revision"] == prior_report["publication_revision"] == publication["parent_revision"]
    contracts = load(PACK / "spec/semantic-acceptance/knowledge-kind-contracts-v1.yaml")
    inputs = dict(
        graph=graph, model=core, skill_registry=load(PACK / "skills/artifact-skill-registry-v0.yaml"),
        knowledge_contracts=contracts, capability=CAPABILITY, sources=sources,
        acceptance_id=providers[CAPABILITY]["acceptance_id"], lifecycle=previous["state"]["lifecycle"],
    )
    result = admit_artifact(candidate=candidate, **inputs)
    assert result == evaluations[CAPABILITY] == load(ROOT / ".harness/candidates/mvp-domain-strategy-evaluation.yaml")
    assert result["status"] == "ACCEPTED" and result["findings"] == []
    for retired_id in retired:
        invalid = copy.deepcopy(candidate)
        invalid["semantic_assertions"][2]["derived_from"] = [retired_id]
        rejected = admit_artifact(candidate=invalid, **inputs)
        assert rejected["status"] == "REJECTED"
        assert any(row["code"] == "UNKNOWN_PROVENANCE" for row in rejected["findings"])
    for authority in ["MODEL-CONTEXT-STRATEGY", "TACTICAL-DOMAIN-DESIGN"]:
        invalid = copy.deepcopy(candidate)
        invalid["semantic_assertions"][2]["decision_authority"] = authority
        rejected = admit_artifact(candidate=invalid, **inputs)
        assert rejected["status"] == "REJECTED"
        assert any(row["code"] == "WRONG_AUTHORITY_OWNERSHIP" for row in rejected["findings"])
    invalid = copy.deepcopy(candidate)
    invalid["semantic_review"]["checks"].remove("domain-strategy-not-model-context-or-tactical")
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
    print("PASS: complete strategy projection, two evidenced CORE classifications, consumers/reopening, accepted source fingerprints, CRUD dispositions, strict admission/CAS, five CURRENT only; retired sources, wrong model/tactical ownership, missing review, UNKNOWN dependency and stale policy/CAS rejected")


if __name__ == "__main__":
    main()
