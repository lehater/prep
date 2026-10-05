#!/usr/bin/env python3
from __future__ import annotations
import copy, os, sys
from pathlib import Path
from typing import Any
import yaml

ROOT=Path(__file__).resolve().parents[1]
HARNESS_ROOT=Path(os.environ["HARNESS_ROOT"]).resolve()
sys.path.insert(0,str(HARNESS_ROOT/"src"))

from harness.application.project_publication import read_project_publication, build_project_publication
from harness.application.semantic_admission import admit_artifact, derive_acceptance_policy_fingerprints
from harness.assurance.capability_lifecycle import lifecycle_states
from harness.assurance.semantic_fingerprint import semantic_assertion_fingerprints
from harness.project_model.engineering_graph import production_index

ORDER=[
 ("prep.frontend-system-architecture",".harness/candidates/frontend-system-architecture-admission.yaml","PREP-FRONTEND-SYSTEM-ARCHITECTURE-STRICT-1"),
 ("prep.interface-verification",".harness/candidates/interface-verification-admission.yaml","PREP-INTERFACE-VERIFICATION-STRICT-1"),
]

def load(p:Path)->dict[str,Any]:
    v=yaml.safe_load(p.read_text())
    if not isinstance(v,dict): raise RuntimeError(f"{p} must contain mapping")
    return v

def candidate_index():
    d={}
    for p in sorted((ROOT/".harness/candidates").glob("*-admission.yaml")):
        try:v=load(p)
        except Exception:continue
        if v.get("kind")=="harness-artifact-admission-candidate" and isinstance(v.get("capability"),str):
            d.setdefault(v["capability"],[]).append((p,v))
    return d

def choose_source(cap,cands,lifeidx):
    rows=cands.get(cap,[])
    expected=(lifeidx.get(cap) or {}).get("semantic_atom_fingerprints")
    if expected:
        m=[copy.deepcopy(v) for _,v in rows if semantic_assertion_fingerprints(v)==expected]
        if len(m)==1:return m[0]
    if len(rows)==1:return copy.deepcopy(rows[0][1])
    raise RuntimeError(f"cannot select accepted source candidate {cap}: {[str(p) for p,_ in rows]}")

def artifact_for(core,cap):
    m=[x["id"] for x in core["artifacts"] if cap in (x.get("provides") or [])]
    if len(m)!=1: raise RuntimeError((cap,m))
    return m[0]

def formal_exploration(cap,request_id):
    if cap!="prep.frontend-system-architecture": return None
    draft=load(ROOT/".harness/candidates/frontend-system-architecture-exploration-draft.yaml")
    review=draft["decision_space_review"]
    return {
      "version":1,
      "kind":"harness-decision-exploration",
      "capability":cap,
      "knowledge_kind":"system-architecture",
      "explorer_request_id":request_id,
      "research_sources":[],
      "axes":copy.deepcopy(draft["axes"]),
      "decision_space_review":{
        "status":"COMPLETE",
        "checks":copy.deepcopy(review["checks"]),
        "reviewed_decisions":copy.deepcopy(review["reviewed_decisions"]),
        "open_gaps":[],
      },
    }

def replace_eval(sem,e):
    sem["semantic_evaluations"].append(e)

def replace_life(life,row):
    life["providers"].append(row)

def main():
    graph=load(ROOT/".harness/engineering-graph.yaml")
    pub=read_project_publication(ROOT/".harness/project-publication.yaml",graph=graph)
    core=copy.deepcopy(pub["state"]["core_model"])
    sem=copy.deepcopy(pub["state"]["semantic_evaluations"])
    life=copy.deepcopy(pub["state"]["lifecycle"])
    failures=copy.deepcopy(pub["state"]["decision_failures"])
    prod=production_index(graph)
    lifeidx={x["capability"]:x for x in life.get("providers",[])}
    cands=candidate_index()
    registry=load(HARNESS_ROOT/"skills/artifact-skill-registry-v0.yaml")
    kcontracts=load(HARNESS_ROOT/"spec/semantic-acceptance/knowledge-kind-contracts-v1.yaml")
    dcontracts=load(HARNESS_ROOT/"spec/decision-governance/knowledge-kind-decision-contracts-v1.yaml")
    policy=load(ROOT/".harness/candidates/application-design-decision-policy.yaml")
    report=[]
    bound={}
    for cap,path,aid in ORDER:
        if cap in lifeidx:
            raise RuntimeError(f"{cap} already has lifecycle row")
        candidate=load(ROOT/path)
        sources={"semantic_assertions":[]}
        for req in prod[cap].get("requires",[]) or []:
            sc=req["capability"]
            source=choose_source(sc,cands,lifeidx)
            sa=artifact_for(core,sc)
            for a in source.get("semantic_assertions",[]) or []:
                z=copy.deepcopy(a); z["source_artifact"]=sa
                sources["semantic_assertions"].append(z)
        kwargs=dict(
          graph=graph,model=core,skill_registry=registry,knowledge_contracts=kcontracts,
          decision_contracts=dcontracts,decision_policy=policy,derivation_evaluations=[],
          capability=cap,sources=sources,candidate=candidate,acceptance_id=aid,
          lifecycle=life,decision_request_mode="CREATE",
        )
        probe=admit_artifact(**kwargs)
        req_id=(probe.get("admission") or {}).get("decision_explorer_request_id")
        exploration=formal_exploration(cap,req_id) if req_id else None
        admitted=admit_artifact(**kwargs,decision_exploration=exploration) if exploration else probe
        if admitted.get("status")!="ACCEPTED":
            raise RuntimeError(yaml.safe_dump({
              "capability":cap,"status":admitted.get("status"),
              "findings":admitted.get("findings"),"admission":admitted.get("admission")
            },sort_keys=False,allow_unicode=True))
        replace_eval(sem,admitted)
        replace_life(life,admitted["lifecycle_assertion"])
        lifeidx[cap]=admitted["lifecycle_assertion"]
        if exploration: bound[cap]=exploration
        report.append({"capability":cap,"acceptance_id":aid,
          "decision_exploration":admitted["admission"].get("decision_exploration"),
          "decision_governance":admitted["admission"].get("decision_governance")})
    next_pub=build_project_publication(graph=graph,core_model=core,semantic_evaluations=sem,
      lifecycle=life,decision_failures=failures,parent_revision=pub["revision"])
    policy_fp=derive_acceptance_policy_fingerprints(graph=graph,knowledge_contracts=kcontracts,
      decision_contracts=dcontracts,decision_policy=policy)
    states=lifecycle_states(graph,core,life,current_acceptance_policy_fingerprints=policy_fp)
    for cap,_,_ in ORDER:
        if states[cap].get("state")!="CURRENT":
            raise RuntimeError(f"{cap} not CURRENT: {states[cap]}")
    (ROOT/".harness/project-publication.next.yaml").write_text(
      yaml.safe_dump(next_pub,sort_keys=False,allow_unicode=True))
    for cap,e in bound.items():
        slug=cap.removeprefix("prep.").replace(".","-")
        (ROOT/".harness/candidates"/f"{slug}-exploration.yaml").write_text(
          yaml.safe_dump(e,sort_keys=False,allow_unicode=True))
    (ROOT/".harness/frontend-frontier-report.yaml").write_text(yaml.safe_dump({
      "version":1,"parent_revision":pub["revision"],"next_revision":next_pub["revision"],
      "results":report},sort_keys=False,allow_unicode=True))
    print(yaml.safe_dump({"next_revision":next_pub["revision"],"results":report},
      sort_keys=False,allow_unicode=True))

if __name__=="__main__":main()
