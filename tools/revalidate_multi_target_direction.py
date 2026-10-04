#!/usr/bin/env python3
# Re-run after completing User Needs evidence trace.
from __future__ import annotations
import copy, os, re, sys
from collections import deque
from pathlib import Path
from typing import Any
import yaml

ROOT = Path(__file__).resolve().parents[1]
HARNESS_ROOT = Path(os.environ.get("HARNESS_ROOT", ROOT / ".harness-tool"))
if not HARNESS_ROOT.is_absolute():
    HARNESS_ROOT = (ROOT / HARNESS_ROOT).resolve()
sys.path.insert(0, str(HARNESS_ROOT / "src"))

from harness.application.project_publication import build_project_publication, read_project_publication
from harness.application.semantic_admission import admit_artifact
from harness.assurance.semantic_derivation import evaluate_derivation
from harness.assurance.semantic_fingerprint import semantic_assertion_fingerprints
from harness.project_model.engineering_graph import production_index

EXPLICIT = {
 "prep.problem-evidence": ".harness/candidates/problem-evidence-capability-repair-admission.yaml",
 "prep.user-needs": ".harness/candidates/user-needs-capability-repair-admission.yaml",
 "prep.product-intent": ".harness/candidates/product-intent-capability-repair-admission.yaml",
 "prep.product-capabilities": ".harness/candidates/product-capabilities-capability-repair-admission.yaml",
 "prep.domain-strategy": ".harness/candidates/domain-strategy-capability-repair-admission.yaml",
 "prep.model-context-strategy": ".harness/candidates/model-context-capability-repair-admission.yaml",
 "prep.task-model": ".harness/candidates/task-model-admission.yaml",
 "prep.application-design": ".harness/candidates/process-migration-application-design-admission.yaml",
 "prep.application-process.activity-evidence-cycle": ".harness/candidates/process-migration-activity-evidence-admission.yaml",
 "prep.application-process.prepare-support": ".harness/candidates/process-migration-prepare-support-admission.yaml",
 "prep.user-journeys": ".harness/candidates/process-migration-user-journeys-admission.yaml",
 "prep.conceptual-interface-model": ".harness/candidates/conceptual-interface-model-admission.yaml",
 "prep.information-architecture": ".harness/candidates/information-architecture-admission.yaml",
 "prep.machine-interfaces": ".harness/candidates/frontend-boundary-machine-admission.yaml",
 "prep.interaction-design": ".harness/candidates/frontend-boundary-interaction-admission.yaml",
 "prep.interface-topology": ".harness/candidates/frontend-boundary-topology-admission.yaml",
 "prep.presentation-system": ".harness/candidates/presentation-screen-presentation-admission.yaml",
 "prep.screen-view-design": ".harness/candidates/presentation-screen-screen-admission.yaml",
}
SPECIAL_NA = {
 ("prep.application-design","prep.application-process.activity-evidence-cycle","AD-COMPARE-TARGETS"):
   "Target-direction comparison occurs before commitment to one active target and is outside the bounded activity/evidence occurrence.",
 ("prep.application-design","prep.application-process.prepare-support","AD-COMPARE-TARGETS"):
   "Target-direction comparison may motivate missing support but is not work owned by the bounded prepare-support occurrence.",
}

def load(path):
    value=yaml.safe_load(path.read_text(encoding="utf-8"))
    if not isinstance(value,dict): raise SystemExit("%s must contain a mapping" % path)
    return value

def candidate_index():
    result={}
    for path in sorted((ROOT/".harness/candidates").glob("*-admission.yaml")):
        try: doc=load(path)
        except Exception: continue
        if doc.get("kind")!="harness-artifact-admission-candidate": continue
        cap=doc.get("capability")
        if isinstance(cap,str): result.setdefault(cap,[]).append((path,doc))
    return result

def contract_index():
    result={}
    for path in sorted((ROOT/".harness/candidates").glob("*-contract.yaml")):
        try: doc=load(path)
        except Exception: continue
        if doc.get("kind")!="harness-semantic-derivation-contract": continue
        a,b=doc.get("source_capability"),doc.get("target_capability")
        if isinstance(a,str) and isinstance(b,str): result.setdefault((a,b),[]).append((path,doc))
    return result

def derivation_index(bundle):
    return {(r["source_capability"],r["target_capability"]):r for r in bundle.get("derivation_evaluations",[]) or []
            if isinstance(r,dict) and isinstance(r.get("source_capability"),str) and isinstance(r.get("target_capability"),str)}

def lifecycle_index(lifecycle):
    return {r["capability"]:r for r in lifecycle.get("providers",[]) or [] if isinstance(r,dict) and isinstance(r.get("capability"),str)}

def artifact_for_capability(core,cap):
    matches=[r["id"] for r in core.get("artifacts",[]) or [] if isinstance(r,dict) and cap in (r.get("provides",[]) or [])]
    if len(matches)!=1: raise SystemExit("%s: expected one Core artifact, got %r" % (cap,matches))
    return matches[0]

def choose_candidate(cap,candidates,lifecycle_rows):
    if cap in EXPLICIT: return load(ROOT/EXPLICIT[cap])
    rows=candidates.get(cap,[])
    if len(rows)==1: return copy.deepcopy(rows[0][1])
    expected=(lifecycle_rows.get(cap,{}) or {}).get("semantic_atom_fingerprints")
    if isinstance(expected,dict) and expected:
        matches=[doc for _path,doc in rows if semantic_assertion_fingerprints(doc)==expected]
        if len(matches)==1: return copy.deepcopy(matches[0])
    raise SystemExit("cannot select current candidate for %s; candidates=%r" % (cap,[str(p) for p,_ in rows]))

def topo_order(graph,current_caps):
    prod=production_index(graph); indegree={c:0 for c in current_caps}; children={c:set() for c in current_caps}
    for cap in current_caps:
        if cap not in prod: raise SystemExit("missing production for %s" % cap)
        for req in prod[cap].get("requires",[]) or []:
            dep=req.get("capability") if isinstance(req,dict) else None
            if dep in current_caps:
                indegree[cap]+=1; children[dep].add(cap)
    q=deque(sorted(c for c,d in indegree.items() if d==0)); order=[]
    while q:
        cap=q.popleft(); order.append(cap)
        for child in sorted(children[cap]):
            indegree[child]-=1
            if indegree[child]==0: q.append(child)
    if len(order)!=len(current_caps): raise SystemExit("cycle/current mismatch")
    return order

def next_acceptance_id(old):
    m=re.match(r"^(.*-STRICT-)(\d+)$",old)
    return ("%s%d" % (m.group(1),int(m.group(2))+1)) if m else old+"-REV-1"

def replace_artifact(bundle,evaluation):
    key=(evaluation["artifact"],evaluation["capability"])
    for i,row in enumerate(bundle["semantic_evaluations"]):
        if (row.get("artifact"),row.get("capability"))==key: bundle["semantic_evaluations"][i]=evaluation; return
    raise SystemExit("artifact evaluation missing: %r" % (key,))

def replace_derivation(bundle,evaluation):
    key=(evaluation["source_capability"],evaluation["target_capability"])
    for i,row in enumerate(bundle["derivation_evaluations"]):
        if (row.get("source_capability"),row.get("target_capability"))==key: bundle["derivation_evaluations"][i]=evaluation; return
    raise SystemExit("derivation evaluation missing: %r" % (key,))

def replace_provider(lifecycle,provider):
    for i,row in enumerate(lifecycle["providers"]):
        if row.get("capability")==provider["capability"]: lifecycle["providers"][i]=provider; return
    raise SystemExit("provider missing: %s" % provider["capability"])

def mentioned_sources(evidence):
    result=set()
    for row in evidence.get("links",[]) or []:
        for source in row.get("sources",[]) or []:
            if isinstance(source,str): result.add(source)
    for row in evidence.get("dispositions",[]) or []:
        source=row.get("source")
        if isinstance(source,str): result.add(source)
    return result

def enrich_evidence(source_capability,target_capability,source_candidate,target_candidate,previous):
    evidence={"version":1,"kind":"harness-semantic-derivation-evidence",
              "source_capability":source_capability,"target_capability":target_capability,
              "links":copy.deepcopy(previous.get("links",[])),
              "dispositions":copy.deepcopy(previous.get("dispositions",[]))}
    already=mentioned_sources(evidence)
    targets=[r for r in target_candidate.get("semantic_assertions",[]) or [] if isinstance(r,dict) and isinstance(r.get("id"),str)]
    for source in source_candidate.get("semantic_assertions",[]) or []:
        if not isinstance(source,dict): continue
        sid=source.get("id")
        if not isinstance(sid,str) or sid in already: continue
        target_ids=[r["id"] for r in targets if sid in (r.get("derived_from",[]) or [])]
        if target_ids:
            evidence["links"].append({"relation":"TRANSFORMS","sources":[sid],"targets":target_ids})
        else:
            rationale=SPECIAL_NA.get((source_capability,target_capability,sid))
            if rationale is None:
                rationale=("%s introduces meaning outside the responsibility of %s; no target assertion derives from it, "
                           "so the capability boundary preserves it as not applicable rather than inventing downstream semantics.") % (sid,target_capability)
            evidence["dispositions"].append({"source":sid,"status":"NOT_APPLICABLE","rationale":rationale})
    return evidence

def main():
    graph=load(ROOT/".harness/engineering-graph.yaml"); core=load(ROOT/".harness/core.yaml")
    publication=read_project_publication(ROOT/".harness/project-publication.yaml",graph=graph)
    semantic_set=copy.deepcopy(publication["state"]["semantic_evaluations"])
    lifecycle=copy.deepcopy(publication["state"]["lifecycle"]); failures=copy.deepcopy(publication["state"]["decision_failures"])
    contracts=contract_index(); candidates=candidate_index(); productions=production_index(graph)
    derivations=derivation_index(semantic_set); lifecycle_rows=lifecycle_index(lifecycle)
    current_caps=set(lifecycle_rows); order=topo_order(graph,current_caps)
    registry=load(HARNESS_ROOT/"skills/artifact-skill-registry-v0.yaml")
    knowledge_contracts=load(HARNESS_ROOT/"spec/semantic-acceptance/knowledge-kind-contracts-v1.yaml")
    report=[]

    for capability in order:
        candidate=choose_candidate(capability,candidates,lifecycle_rows)
        prerequisites=[r["capability"] for r in productions[capability].get("requires",[]) or [] if r.get("capability") in current_caps]
        sources={"semantic_assertions":[]}; incoming=[]
        for source_capability in prerequisites:
            source_candidate=choose_candidate(source_capability,candidates,lifecycle_rows)
            source_artifact=artifact_for_capability(core,source_capability)
            for assertion in source_candidate.get("semantic_assertions",[]) or []:
                copied=copy.deepcopy(assertion); copied["source_artifact"]=source_artifact; sources["semantic_assertions"].append(copied)
            key=(source_capability,capability); previous=derivations.get(key); rows=contracts.get(key,[])
            if previous is None and not rows:
                continue
            if previous is None or not rows:
                raise SystemExit("incomplete derivation contract/evidence pair: %r" % (key,))
            evidence=enrich_evidence(source_capability,capability,source_candidate,candidate,previous)
            accepted=[]; rejected=[]
            for contract_path,contract in rows:
                attempt=evaluate_derivation(graph=graph,contract=contract,source=source_candidate,candidate=candidate,evidence=evidence)
                if attempt.get("status")=="ACCEPTED": accepted.append((contract_path,attempt))
                else: rejected.append((str(contract_path),attempt.get("findings")))
            if not accepted: raise SystemExit("no accepted derivation contract for %r; rejected=%r" % (key,rejected))
            old_required=set(previous.get("required_sources",[]) or [])
            compatible=[item for item in accepted if old_required <= set(item[1].get("required_sources",[]) or [])]
            pool=compatible or accepted
            if len(pool)>1:
                normalized={yaml.safe_dump(item[1],sort_keys=True,allow_unicode=True) for item in pool}
                if len(normalized)!=1: raise SystemExit("ambiguous contracts for %r: %r" % (key,[str(p) for p,_ in pool]))
            incoming.append(pool[0][1])

        old_provider=lifecycle_rows[capability]; acceptance_id=next_acceptance_id(old_provider["acceptance_id"])
        admitted=admit_artifact(graph=graph,model=core,skill_registry=registry,knowledge_contracts=knowledge_contracts,
                                derivation_evaluations=incoming,capability=capability,sources=sources,candidate=candidate,
                                acceptance_id=acceptance_id,lifecycle=lifecycle,decision_request_mode="REVISION")
        if admitted.get("status")!="ACCEPTED": raise SystemExit("admission rejected for %s: %r" % (capability,admitted.get("findings")))
        replace_artifact(semantic_set,admitted)
        for edge in incoming:
            replace_derivation(semantic_set,edge); derivations[(edge["source_capability"],edge["target_capability"])]=edge
        replace_provider(lifecycle,admitted["lifecycle_assertion"]); lifecycle_rows[capability]=admitted["lifecycle_assertion"]
        report.append({"capability":capability,"status":"ACCEPTED","acceptance_id":acceptance_id,"derivations":len(incoming)})

    next_publication=build_project_publication(graph=graph,core_model=core,semantic_evaluations=semantic_set,lifecycle=lifecycle,
                                              decision_failures=failures,parent_revision=publication["revision"])
    (ROOT/".harness/project-publication.next.yaml").write_text(yaml.safe_dump(next_publication,sort_keys=False,allow_unicode=True),encoding="utf-8")
    (ROOT/".harness/revalidation-report.yaml").write_text(yaml.safe_dump(
        {"version":1,"kind":"prep-multi-target-direction-full-revalidation","parent_revision":publication["revision"],
         "next_revision":next_publication["revision"],"results":report},sort_keys=False,allow_unicode=True),encoding="utf-8")
    print(yaml.safe_dump(report,sort_keys=False,allow_unicode=True)); print(next_publication["revision"])
    return 0

if __name__=="__main__": raise SystemExit(main())
