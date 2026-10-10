#!/usr/bin/env python3
"""Verify the bounded MVP admission using the active Consumer Pack."""
from __future__ import annotations

import copy
import os
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
PACK = Path(os.environ["HARNESS_ROOT"])
sys.path.insert(0, str(PACK / "src"))

from harness.application.project_publication import (
    prepare_capability_transition,
    read_project_publication,
    validate_project_publication,
)
from harness.application.semantic_admission import (
    admit_artifact,
    derive_acceptance_policy_fingerprints,
)
from harness.assurance.capability_lifecycle import lifecycle_states
from harness.project_model.engineering_graph import validate_engineering_graph


def load(path: Path) -> dict:
    return yaml.safe_load(path.read_text(encoding="utf-8"))


def main() -> None:
    capability = "prep.problem-evidence"
    graph = load(ROOT / ".harness/engineering-graph.yaml")
    core = load(ROOT / ".harness/core.yaml")
    validate_engineering_graph(graph)
    publication = read_project_publication(
        ROOT / ".harness/project-publication.yaml", graph=graph
    )
    migration = load(ROOT / ".harness/candidates/mvp-publication-unaccepted.yaml")
    validate_project_publication(graph, migration)
    assert migration["parent_revision"] is not None
    assert publication["parent_revision"] == migration["revision"]
    state = publication["state"]
    assert state["core_model"] == migration["state"]["core_model"] == core
    assert migration["state"]["lifecycle"]["providers"] == []
    assert migration["state"]["semantic_evaluations"]["semantic_evaluations"] == []
    assert migration["state"]["semantic_evaluations"]["derivation_evaluations"] == []
    evaluations = state["semantic_evaluations"]["semantic_evaluations"]
    providers = state["lifecycle"]["providers"]
    assert len(evaluations) == len(providers) == 1
    assert providers[0]["capability"] == capability
    assert state["semantic_evaluations"]["derivation_evaluations"] == []
    candidate = load(ROOT / ".harness/candidates/mvp-problem-evidence-admission.yaml")
    doc = load(ROOT / "docs/discovery/problem-evidence.yaml")
    ev03 = next(row for row in doc["evidence"] if row["id"] == "EV-03")
    assert ev03["kind"] == "stakeholder-statement"
    assert ev03["supports"] == ["PE-03"]
    assert "Product Requirements" in ev03["interpretation_boundary"]
    assert next(a for a in candidate["semantic_assertions"] if a["id"] == "EV-03")["semantic_value"] == ev03
    contracts = load(PACK / "spec/semantic-acceptance/knowledge-kind-contracts-v1.yaml")
    decisions = load(PACK / "spec/decision-governance/knowledge-kind-decision-contracts-v1.yaml")
    admission_inputs = dict(
        graph=graph, model=core,
        skill_registry=load(PACK / "skills/artifact-skill-registry-v0.yaml"),
        knowledge_contracts=contracts, decision_contracts=decisions,
        capability=capability,
        sources=load(ROOT / ".harness/candidates/mvp-problem-evidence-sources.yaml"),
        acceptance_id=providers[0]["acceptance_id"],
        lifecycle=migration["state"]["lifecycle"],
    )
    evaluation = admit_artifact(candidate=candidate, **admission_inputs)
    assert evaluation == evaluations[0]
    assert evaluation["status"] == "ACCEPTED" and not evaluation["findings"]
    rejected = copy.deepcopy(candidate)
    rejected["semantic_review"]["checks"].remove("evidence-not-solution")
    assert admit_artifact(candidate=rejected, **admission_inputs)["status"] == "REJECTED"
    policies = derive_acceptance_policy_fingerprints(
        graph=graph, knowledge_contracts=contracts, decision_contracts=decisions
    )
    states = lifecycle_states(
        graph, core, state["lifecycle"],
        current_acceptance_policy_fingerprints=policies,
    )
    assert states[capability]["state"] == "CURRENT"
    assert {cap for cap, row in states.items() if row["state"] == "CURRENT"} == {capability}
    assert prepare_capability_transition(
        graph=graph, current_publication=publication,
        expected_revision=publication["revision"], capability=capability,
        outcome="CURRENT", core_model=core,
        semantic_evaluations=state["semantic_evaluations"], lifecycle=state["lifecycle"],
    ) == publication
    print("PASS: CAS history, MVP Core equality, reproducible ACCEPTED admission, EV-03 boundary, policy-bound CURRENT, sole acceptance, idempotent CURRENT transition, missing-review rejection")


if __name__ == "__main__":
    main()
