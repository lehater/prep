#!/usr/bin/env python3
"""Verify current single-language admission separately from BLOCKED history."""
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

from harness.application.project_publication import prepare_capability_transition, publish_project_publication, read_project_publication
from harness.application.semantic_admission import admit_artifact, derive_acceptance_policy_fingerprints
from harness.assurance.capability_lifecycle import lifecycle_states
from harness.assurance.semantic_fingerprint import semantic_assertion_fingerprints
from harness.project_model.core import CoreError, capability_blockers, resolve_question

CAPABILITY = "prep.model-context-strategy"
QUESTION = "Q-PREP-MODEL-CONTEXT-INDEPENDENT-LANGUAGES"


def load(path: Path) -> dict:
    return yaml.safe_load(path.read_text(encoding="utf-8"))


def verify_product_table(text: str, expected: set[str]) -> None:
    table_ids = re.findall(r"(?m)^\| `(REQ-CAP-[A-Z-]+)` \|", text)
    assert len(table_ids) == len(set(table_ids)) == 15
    assert set(table_ids) == expected


def main() -> None:
    graph = load(ROOT / ".harness/engineering-graph.yaml")
    core = load(ROOT / ".harness/core.yaml")
    publication = read_project_publication(ROOT / ".harness/project-publication.yaml", graph=graph)
    previous = read_project_publication(ROOT / ".harness/candidates/mvp-model-context-blocked-publication.yaml", graph=graph)
    state = publication["state"]
    assert state["core_model"] == core
    assert publication["parent_revision"] == previous["revision"]
    history = load(ROOT / ".harness/candidates/mvp-model-context-strategy-review.yaml")
    assert history["status"] == "BLOCKED" and previous["revision"] == history["publication_revision"]
    providers = {row["capability"]: row for row in state["lifecycle"]["providers"]}
    evaluations = {row["capability"]: row for row in state["semantic_evaluations"]["semantic_evaluations"]}
    upstream_caps = {"prep.problem-evidence", "prep.user-needs", "prep.product-intent", "prep.product-capabilities", "prep.domain-strategy"}
    assert set(providers) == set(evaluations) == upstream_caps | {CAPABILITY}
    assert len(state["lifecycle"]["providers"]) == len(state["semantic_evaluations"]["semantic_evaluations"]) == 6
    assert [row for row in state["lifecycle"]["providers"] if row["capability"] != CAPABILITY] == previous["state"]["lifecycle"]["providers"]
    assert [row for row in state["semantic_evaluations"]["semantic_evaluations"] if row["capability"] != CAPABILITY] == previous["state"]["semantic_evaluations"]["semantic_evaluations"]
    for cap in upstream_caps:
        accepted = load(ROOT / f".harness/candidates/mvp-{cap.removeprefix('prep.')}-evaluation.yaml")
        assert evaluations[cap] == accepted and providers[cap] == accepted["lifecycle_assertion"]
    candidate = load(ROOT / ".harness/candidates/mvp-model-context-strategy-admission.yaml")
    text = (ROOT / "docs/architecture/model-context-map.md").read_text(encoding="utf-8")
    parts = re.split(r"(?m)^(#{2,3} .+)\n", text)
    sections = dict(zip(parts[1::2], parts[2::2]))
    assertions = {row["id"]: row for row in candidate["semantic_assertions"]}
    assert len(sections) == len(assertions) == 10
    assert {row["semantic_value"]["heading"]: row["semantic_value"]["text"] for row in assertions.values()} == sections
    assert candidate["semantic_review"]["alternative_review"]["selected"] == "one coherent language MC-01"
    assert candidate["semantic_review"]["relationship_review"]["id"] == "IR-01"
    requirements = load(ROOT / ".harness/knowledge/product-capabilities.yaml")["content"]["requirements"]
    active = {row["id"] for row in requirements if row["status"] == "ACCEPTED"}
    retired = {row["id"] for row in requirements if row["status"] == "RETIRED"}
    table = sections["## Complete product capability applicability"]
    verify_product_table(table, active)
    assert active <= set(assertions["MC-PRODUCT-COVERAGE"]["derived_from"])
    for missing in active:
        invalid = re.sub(r"(?m)^\| `" + re.escape(missing) + r"` \|.*\n", "", table)
        try:
            verify_product_table(invalid, active)
        except AssertionError:
            pass
        else:
            raise AssertionError("Applicability review accepted a missing capability")
    sources = load(ROOT / ".harness/candidates/mvp-model-context-strategy-sources.yaml")
    expected_sources = []
    for name, artifact in [("product-capabilities", "PRODUCT-CAPABILITIES"), ("domain-strategy", "CONTEXT-MAP")]:
        upstream = load(ROOT / f".harness/candidates/mvp-{name}-admission.yaml")
        assert semantic_assertion_fingerprints(upstream) == providers["prep." + name]["semantic_atom_fingerprints"]
        expected_sources.extend(dict(row, source_artifact=artifact) for row in upstream["semantic_assertions"])
    assert sources["semantic_assertions"] == expected_sources
    assert sources["accepted_prerequisites"] == {cap: providers[cap]["acceptance_id"] for cap in ["prep.product-capabilities", "prep.domain-strategy"]}
    contracts = load(PACK / "spec/semantic-acceptance/knowledge-kind-contracts-v1.yaml")
    inputs = dict(
        graph=graph, model=previous["state"]["core_model"], skill_registry=load(PACK / "skills/artifact-skill-registry-v0.yaml"),
        knowledge_contracts=contracts, capability=CAPABILITY, sources=sources,
        acceptance_id=providers[CAPABILITY]["acceptance_id"], lifecycle=previous["state"]["lifecycle"],
    )
    result = admit_artifact(candidate=candidate, **inputs)
    assert result == evaluations[CAPABILITY] == load(ROOT / ".harness/candidates/mvp-model-context-strategy-evaluation.yaml")
    assert result["status"] == "ACCEPTED" and result["findings"] == []
    assert result["admission"]["accepted_prerequisites"] == sources["accepted_prerequisites"]
    for missing in sources["accepted_prerequisites"]:
        lifecycle = copy.deepcopy(previous["state"]["lifecycle"])
        lifecycle["providers"] = [row for row in lifecycle["providers"] if row["capability"] != missing]
        try:
            admit_artifact(candidate=candidate, **dict(inputs, lifecycle=lifecycle))
        except CoreError:
            pass
        else:
            raise AssertionError("Admission accepted a non-current prerequisite")
    invalid = copy.deepcopy(candidate)
    invalid["semantic_review"]["checks"].remove("model-context-not-domain-investment-or-tactical")
    assert admit_artifact(candidate=invalid, **inputs)["status"] == "REJECTED"
    for source in retired:
        invalid = copy.deepcopy(candidate)
        invalid["semantic_assertions"][1]["derived_from"] = [source]
        assert admit_artifact(candidate=invalid, **inputs)["status"] == "REJECTED"
    for authority in ["DOMAIN-STRATEGY", "TACTICAL-DOMAIN-DESIGN", "SYSTEM-ARCHITECTURE"]:
        invalid = copy.deepcopy(candidate)
        invalid["semantic_assertions"][1]["decision_authority"] = authority
        assert admit_artifact(candidate=invalid, **inputs)["status"] == "REJECTED"
    assert resolve_question(previous["state"]["core_model"], QUESTION, "MODEL-CONTEXT-MAP", providers[CAPABILITY]["acceptance_id"], "ABSENT") == core
    assert capability_blockers(core, CAPABILITY) == []
    transition = dict(
        graph=graph, current_publication=previous, expected_revision=previous["revision"], capability=CAPABILITY,
        outcome="CURRENT", core_model=core, semantic_evaluations=state["semantic_evaluations"], lifecycle=state["lifecycle"], decision_failures=state["decision_failures"],
    )
    assert prepare_capability_transition(**transition) == publication
    try:
        prepare_capability_transition(**dict(transition, core_model=previous["state"]["core_model"]))
    except CoreError:
        pass
    else:
        raise AssertionError("CURRENT accepted an unresolved Question")
    policies = derive_acceptance_policy_fingerprints(graph=graph, knowledge_contracts=contracts)
    states = lifecycle_states(graph, core, state["lifecycle"], current_acceptance_policy_fingerprints=policies)
    assert {cap for cap, row in states.items() if row["state"] == "CURRENT"} == upstream_caps | {CAPABILITY}
    invalid_policy = dict(policies, **{CAPABILITY: "changed-policy"})
    assert lifecycle_states(graph, core, state["lifecycle"], current_acceptance_policy_fingerprints=invalid_policy)[CAPABILITY]["state"] == "STALE"
    with tempfile.TemporaryDirectory() as directory:
        path = Path(directory) / "publication.yaml"
        path.write_text(yaml.safe_dump(previous, sort_keys=False))
        assert publish_project_publication(path, graph=graph, publication=publication, expected_revision=previous["revision"]) == publication
        try:
            publish_project_publication(path, graph=graph, publication=publication, expected_revision=previous["revision"])
        except CoreError:
            pass
        else:
            raise AssertionError("Publication accepted stale CAS")
    print("CURRENT CHECK PASS: one language/IR-01 and all 15 capabilities, strict admission, resolved Question/CAS, six policy-bound CURRENT, five unchanged acceptances; missing capability/prerequisite/review, retired provenance, wrong Authority, open Question and stale policy/CAS rejected")


if __name__ == "__main__":
    from verify_model_context_omission_history import run_scenario
    run_scenario("verify_mvp_model_context_strategy")
