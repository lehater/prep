#!/usr/bin/env python3
"""EX-PLD-06 nonproduct fixture/transport check; no real Anki or user testing."""
import csv
import json
from pathlib import Path

folder = Path(__file__).resolve().parent
fixture = json.loads((folder / "fixture.json").read_text(encoding="utf-8"))
raw = (folder / "sample-anki.tsv").read_text(encoding="utf-8")
assert len(fixture["knowledge"]) == 10
assert len(fixture["capabilities"]) == 2
assert len(fixture["materials"]) == 12
ks = {x["id"] for x in fixture["knowledge"]}
cs = {x["id"] for x in fixture["capabilities"]}
materials = {x["id"]: x for x in fixture["materials"]}
assert len(ks) == 10 and len(cs) == 2 and len(materials) == 12
for scope in fixture["scopes"]:
    assert scope["knowledge_id"] in ks and scope["capability_id"] in cs
for item in materials.values():
    assert set(item["knowledge_ids"]) <= ks
by_scope = {(x["capability_id"], x["knowledge_id"]): x["study_objective"]
            for x in fixture["scopes"]}
assert by_scope[("C01", "K04")] != by_scope[("C02", "K04")]
task = fixture["tasks"][0]
assert len(set(task["expected_cards"]) & set(task["exclude"])) == 0
assert sum(x["relevance"] == "off-goal" for x in materials.values()) == 2
assert all(materials[x]["kind"] == "scenario" for x in task["expected_external_scenarios"])
assert all(materials[x]["kind"] == "card" and materials[x]["relevance"] == "within"
           for x in task["expected_cards"])
assert raw.startswith("#separator:Tab\n#columns:Front\tBack\tTags\n#tags:ex_pld_06\n")
rows = list(csv.reader((x for x in raw.splitlines() if x and not x.startswith("#")),
                       delimiter="\t"))
assert len(rows) == len(task["expected_cards"]) == 4
for row, item_id in zip(rows, task["expected_cards"]):
    item = materials[item_id]
    expected_tags = " ".join([item["id"].lower(), *[k.lower() for k in item["knowledge_ids"]], "c02", "g01"])
    assert row == [item["front"], item["back"], expected_tags]
assert not set(task["expected_cards"]) & set(task["expected_external_scenarios"])
print("PASS: 2 capabilities, 10 topics, 12 items, distinct K04 objectives, 2 off-goal controls")
print("PASS: 4 Anki-compatible TSV candidate records, exact UTF-8 front/back/tags round-trip")
print("NOT TESTED: real Anki import, usability, effort, study, learner value, source authority")
