#!/usr/bin/env python3
"""Non-mutating preview of omitting conditional MODEL-CONTEXT-STRATEGY.

This is an Engineering Graph/Core/Publicaton *technical feasibility* test,
not a routed Authority decision or permission to migrate accepted semantics.
"""
from __future__ import annotations

import copy
import os
import sys
import tempfile
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
PACK = Path(os.environ.get("HARNESS_ROOT", ROOT / ".harness-tool"))
if not PACK.is_absolute():
    PACK = (ROOT / PACK).resolve()
sys.path.insert(0, str(PACK / "src"))

from harness.application.project_publication import (
    build_project_publication,
    publish_project_publication,
    read_project_publication,
)
from harness.application.semantic_admission import derive_acceptance_policy_fingerprints
from harness.assurance.capability_lifecycle import lifecycle_states, obsolete_lifecycle_rows
from harness.project_model.engineering_graph import validate_engineering_graph, validate_realization
from harness.project_model.core import CoreError

RETIRED_AUTHORITY = "MODEL-CONTEXT-STRATEGY"
RETIRED_CAPABILITY = "prep.model-context-strategy"
RETIRED_ARTIFACT = "MODEL-CONTEXT-MAP"
RETIRED_QUESTION = "Q-PREP-MODEL-CONTEXT-INDEPENDENT-LANGUAGES"
TACTICAL_CAPS = {"prep.preparation-information-model", "prep.recorded-activity-history-model"}
NEW_PREREQUISITE = "prep.domain-strategy"
UPSTREAM_CURRENT = {
    "prep.problem-evidence", "prep.user-needs", "prep.product-intent",
    "prep.product-capabilities", "prep.domain-strategy",
}


def load(path: Path) -> dict:
    return yaml.safe_load(path.read_text(encoding="utf-8"))


def main() -> None:
    graph = load(ROOT / ".harness/engineering-graph.yaml")
    core = load(ROOT / ".harness/core.yaml")
    current = read_project_publication(ROOT / ".harness/project-publication.yaml", graph=graph)
    assert current["state"]["core_model"] == core
    current_providers = current["state"]["lifecycle"]["providers"]
    assert len(current_providers) == 6

    # All modifications stay in memory, never in the working Graph/Core/Publication.
    target = copy.deepcopy(graph)
    target["authorities"] = [
        row for row in target["authorities"] if row["id"] != RETIRED_AUTHORITY
    ]
    tactical = next(row for row in target["authorities"] if row["id"] == "TACTICAL-DOMAIN-DESIGN")
    boundary = tactical["boundary"]
    assert "accepted cross-context relationship boundary" in boundary["semantic_cohesion"]
    boundary["semantic_cohesion"] = (
        "Preparation information and recorded activity/result meanings in one coherent "
        "model language, including the internal IR-01 subject-of-activity interpretation."
    )
    rewired = set()
    for row in tactical["produces"]:
        if row["capability"] not in TACTICAL_CAPS:
            continue
        requirements = row["requires"]
        prior = [r for r in requirements if r["capability"] == RETIRED_CAPABILITY]
        assert len(prior) == 1, row["capability"]
        assert any(r["capability"] == "prep.product-capabilities" for r in requirements)
        for requirement in requirements:
            if requirement["capability"] == RETIRED_CAPABILITY:
                requirement["capability"] = NEW_PREREQUISITE
        rewired.add(row["capability"])
    assert rewired == TACTICAL_CAPS
    validate_engineering_graph(target)

    # Graph evolution must retain the *old* publication as a valid CAS base.
    # It is still an historical accepted snapshot, not an acceptance for the new graph.
    read_under_target = read_project_publication(
        ROOT / ".harness/project-publication.yaml", graph=target
    )
    assert read_under_target["revision"] == current["revision"]
    obsolete = obsolete_lifecycle_rows(target, current["state"]["lifecycle"])
    assert len(obsolete) == 1 and obsolete[0]["capability"] == RETIRED_CAPABILITY

    new_core = copy.deepcopy(core)
    new_core["authorities"] = [
        row for row in new_core["authorities"] if row["id"] != RETIRED_AUTHORITY
    ]
    new_core["artifacts"] = [
        row for row in new_core["artifacts"] if row["id"] != RETIRED_ARTIFACT
    ]
    # This resolved Question is preserved *in historical Publication*; keeping
    # it in target Core without the retired owning Artifact/Authority is invalid.
    archived = [row for row in new_core["questions"] if row["id"] == RETIRED_QUESTION]
    assert len(archived) == 1 and archived[0]["resolution"]["artifact"] == RETIRED_ARTIFACT
    new_core["questions"] = [
        row for row in new_core["questions"] if row["id"] != RETIRED_QUESTION
    ]
    assert len(new_core["artifacts"]) == len(core["artifacts"]) - 1
    validate_realization(target, new_core)

    ev = copy.deepcopy(current["state"]["semantic_evaluations"])
    ev["semantic_evaluations"] = [
        row for row in ev["semantic_evaluations"]
        if row["capability"] != RETIRED_CAPABILITY
    ]
    lc = copy.deepcopy(current["state"]["lifecycle"])
    lc["providers"] = [
        row for row in lc["providers"] if row["capability"] != RETIRED_CAPABILITY
    ]
    assert {row["capability"] for row in lc["providers"]} == UPSTREAM_CURRENT

    next_publication = build_project_publication(
        graph=target, core_model=new_core, semantic_evaluations=ev, lifecycle=lc,
        decision_failures=current["state"]["decision_failures"],
        parent_revision=current["revision"],
    )
    assert next_publication["parent_revision"] == current["revision"]
    assert next_publication["state"]["core_model"] == new_core
    assert next_publication["revision"] != current["revision"]

    policies = derive_acceptance_policy_fingerprints(
        graph=target,
        knowledge_contracts=load(PACK / "spec/semantic-acceptance/knowledge-kind-contracts-v1.yaml"),
    )
    states = lifecycle_states(
        target, new_core, lc, current_acceptance_policy_fingerprints=policies
    )
    assert {cap for cap, row in states.items() if row["state"] == "CURRENT"} == UPSTREAM_CURRENT
    for cap in TACTICAL_CAPS:
        assert states[cap]["state"] != "CURRENT"

    with tempfile.TemporaryDirectory() as temp:
        path = Path(temp) / "publication.yaml"
        path.write_bytes((ROOT / ".harness/project-publication.yaml").read_bytes())
        result = publish_project_publication(
            path, graph=target, publication=next_publication,
            expected_revision=current["revision"],
        )
        assert result == next_publication
        assert read_project_publication(path, graph=target) == next_publication
        try:
            publish_project_publication(
                path, graph=target, publication=next_publication,
                expected_revision=current["revision"],
            )
        except CoreError:
            pass
        else:
            raise AssertionError("Stale migration CAS must be rejected")

    # Negative: if the retired Question stays but its owner is removed,
    # Core cannot validate the dangling resolved-Question reference.
    invalid = copy.deepcopy(new_core)
    invalid["questions"].append(archived[0])
    try:
        validate_realization(target, invalid)
    except CoreError:
        pass
    else:
        raise AssertionError("Dangling legacy Question unexpectedly passed validation")

    print(
        "MIGRATION PREVIEW PASS (NO FILES MUTATED): old publication validates under target "
        "graph; one obsolete provider; two direct tactical prerequisites rewired; "
        "one archived resolved Question; five baseline capabilities remain CURRENT; "
        "no downstream accepted; child CAS to temp file succeeds and stale CAS rejects."
    )
    print(
        "NOT AUTHORIZATION: requires routed Authority decision, history preservation, "
        "atomic publication/graph/Core transition, CI frontier-policy update, and "
        "fresh tactical admission before downstream readiness."
    )


if __name__ == "__main__":
    from verify_model_context_omission_history import run_scenario
    run_scenario("preview_model_context_authority_omission")
