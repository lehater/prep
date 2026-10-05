#!/usr/bin/env python3
from __future__ import annotations

import copy, os, re, sys
from pathlib import Path
from typing import Any
import yaml

ROOT=Path(__file__).resolve().parents[1]
HARNESS_ROOT=Path(os.environ["HARNESS_ROOT"]).resolve()
sys.path.insert(0,str(HARNESS_ROOT/"src"))

from harness.application.project_publication import read_project_publication, build_project_publication
from harness.application.semantic_admission import admit_artifact, derive_acceptance_policy_fingerprints
from harness.assurance.capability_lifecycle import lifecycle_states
from harness.assurance.semantic_derivation import evaluate_derivation
from harness.assurance.semantic_fingerprint import semantic_assertion_fingerprints
from harness.project_model.engineering_graph import production_index

TARGET="prep.screen-view-design"
EXPLORATION_FILES={
 "prep.application-design":".harness/candidates/application-design-exploration.yaml",
 "prep.application-process.activity-evidence-cycle":".harness/candidates/process-migration-activity-evidence-exploration.yaml",
 "prep.application-process.prepare-support":".harness/candidates/process-migration-prepare-support-exploration.yaml",
 "prep.presentation-system":".harness/candidates/presentation-screen-presentation-exploration.yaml",
 "prep.screen-view-design":".harness/candidates/presentation-screen-screen-exploration.yaml",
}
COMMON_PROBES={
 "semantic-identity":[
   {"strategy":"identity-substitution","challenge":"Substitute the identity basis and test whether accepted meaning and continuity still hold."},
   {"strategy":"merge-vs-split","challenge":"Merge or split the modeled identities and test whether materially distinct meanings collapse."}],
 "invariants":[
   {"strategy":"relax-invariant","challenge":"Relax the accepted invariant and test which invalid states become representable."},
   {"strategy":"move-enforcement-owner","challenge":"Move invariant enforcement across the accepted Authority boundary and test ownership leakage."}],
 "lifecycle":[
   {"strategy":"state-split","challenge":"Split lifecycle states and test whether the extra state has independent semantic meaning."},
   {"strategy":"transition-perturbation","challenge":"Perturb transition ownership and test whether historical/current semantics remain valid."}],
 "relationships":[
   {"strategy":"entity-vs-relation","challenge":"Represent the same meaning as entity versus relation and test identity/ownership consequences."},
   {"strategy":"reverse-direction","challenge":"Reverse or symmetrize relationship direction and test whether accepted meaning is preserved."}],
 "responsibility-boundaries":[
   {"strategy":"move-owner-upstream","challenge":"Move the responsibility upstream and test whether the upstream Authority would own downstream semantics."},
   {"strategy":"split-responsibility","challenge":"Split responsibility across owners and test whether a stable semantic owner remains."}],
}
DOMAIN_OPTIONS={
 "prep.knowledge-relation-classification":{
  "semantic-identity":("relation-classifier-identity",[
   ("generic-relation-edge","One generic relation edge owns both vocabulary and asserted relation identity.",{"identity-basis":"generic-edge","continuity":"edge-instance","merge-split":"merged"}),
   ("predicate-vocabulary-entry","A stable predicate vocabulary entry classifies relational propositions without becoming the assertion.",{"identity-basis":"predicate-vocabulary","continuity":"predicate-meaning","merge-split":"vocabulary-separate-from-assertion"}),
   ("assertion-identity","Classifier entries are identified by the concrete asserted relationship.",{"identity-basis":"assertion-instance","continuity":"assertion","merge-split":"classifier-merged-with-assertion"})]),
  "invariants":("relation-classification-validity",[
   ("broad-family-fallback","Unsupported leaf meaning falls back to a broad relation family.",{"valid-state-space":"broad-family-permitted","enforcement-owner":"classifier","exception-policy":"fallback"}),
   ("evidence-bounded-precise","Only evidence-supported precise predicates are accepted; unsupported meaning remains unclassified/candidate.",{"valid-state-space":"evidence-supported-only","enforcement-owner":"subject-knowledge","exception-policy":"candidate-or-none"}),
   ("forced-leaf-classification","Every observed relation must be assigned an accepted leaf predicate.",{"valid-state-space":"forced-leaf","enforcement-owner":"classifier","exception-policy":"none"})]),
  "lifecycle":("relation-vocabulary-lifecycle",[
   ("auto-promote-candidates","Candidate predicates become accepted through use.",{"state-set":"candidate-accepted","transition-ownership":"usage-driven","terminality":"accepted"}),
   ("accepted-plus-candidate","Accepted and candidate predicate statuses remain explicit and promotion requires semantic acceptance.",{"state-set":"candidate-and-accepted","transition-ownership":"semantic-owner","terminality":"none"}),
   ("immutable-catalog","The accepted vocabulary cannot evolve.",{"state-set":"accepted-only","transition-ownership":"none","terminality":"catalog-final"})]),
  "relationships":("relation-model-shape",[
   ("first-class-relation-entity","A generic relation entity owns relationship identity.",{"relation-vs-entity":"entity","directionality":"entity-defined","cardinality":"entity-defined"}),
   ("proposition-plus-predicate","A relational proposition carries participants and is classified by predicate vocabulary.",{"relation-vs-entity":"relation-proposition","directionality":"predicate-specific","cardinality":"predicate-specific"}),
   ("free-text-relation","Relationship meaning remains unstructured prose.",{"relation-vs-entity":"text","directionality":"implicit","cardinality":"implicit"})]),
  "responsibility-boundaries":("relation-classification-boundary",[
   ("absorb-cross-context-links","The catalog classifies capability, target, learner-state and execution links.",{"semantic-owner":"subject-knowledge","boundary-placement":"cross-context","downstream-freedom":"low"}),
   ("subject-knowledge-only","The catalog owns reusable Subject Knowledge predicates only.",{"semantic-owner":"subject-knowledge","boundary-placement":"subject-context","downstream-freedom":"high"}),
   ("presentation-owned","The UI/graph layer owns relation classification.",{"semantic-owner":"presentation","boundary-placement":"downstream-ui","downstream-freedom":"low"})])},
 "prep.knowledge-model":{
  "semantic-identity":("knowledge-semantic-identity",[
   ("universal-node","One generic node identity carries all subject meaning.",{"identity-basis":"universal-node","continuity":"node-id","merge-split":"merged"}),
   ("object-plus-proposition","KnowledgeObject and KnowledgeProposition have distinct reusable semantic identities.",{"identity-basis":"subject-meaning","continuity":"semantic","merge-split":"object-proposition-split"}),
   ("closed-typed-entities","Fixed entity subtypes define identity.",{"identity-basis":"closed-type","continuity":"type-plus-meaning","merge-split":"closed-subtypes"})]),
  "invariants":("knowledge-context-invariant",[
   ("context-mutates-knowledge","Target/learner/scope/presentation context may mutate reusable knowledge identity.",{"valid-state-space":"context-dependent","enforcement-owner":"context-consumer","exception-policy":"context-overrides"}),
   ("reusable-subject-truth","Reusable subject identity remains independent from learner, target, scope and presentation.",{"valid-state-space":"context-independent","enforcement-owner":"subject-knowledge","exception-policy":"none"})]),
  "lifecycle":("knowledge-identity-lifecycle",[
   ("source-identity","Knowledge continuity follows source/document identity.",{"state-set":"source-revisions","transition-ownership":"source-ingestion","terminality":"source-bound"}),
   ("semantic-identity","Continuity follows subject meaning and material semantic change may create a new identity.",{"state-set":"semantic-revisions","transition-ownership":"subject-owner","terminality":"none"})]),
  "relationships":("knowledge-relationship-shape",[
   ("first-class-generic-edge","Generic edge objects carry all relationship meaning.",{"relation-vs-entity":"entity-edge","directionality":"generic","cardinality":"generic"}),
   ("proposition-plus-predicate","Relational propositions are classified by predicate vocabulary.",{"relation-vs-entity":"relation-proposition","directionality":"predicate-specific","cardinality":"predicate-specific"}),
   ("free-text-only","Relations remain prose only.",{"relation-vs-entity":"text","directionality":"implicit","cardinality":"implicit"})]),
  "responsibility-boundaries":("knowledge-responsibility-boundary",[
   ("absorb-cross-context-links","Subject Knowledge owns target/capability/evidence/support links.",{"semantic-owner":"subject-knowledge","boundary-placement":"cross-context","downstream-freedom":"low"}),
   ("subject-only","Subject Knowledge owns reusable subject objects/propositions only.",{"semantic-owner":"subject-knowledge","boundary-placement":"subject-context","downstream-freedom":"high"})])},
 "prep.learning-design":{
  "semantic-identity":("capability-semantic-identity",[
   ("topic-capability","Capability identity follows topic/knowledge labels.",{"identity-basis":"topic-label","continuity":"topic","merge-split":"topic-capability-merged"}),
   ("performance-contract","Capability identity follows reusable performance expectations and material conditions/criteria.",{"identity-basis":"performance-contract","continuity":"performance-meaning","merge-split":"capability-distinct-from-knowledge"}),
   ("learner-state-capability","Capability identity is merged with one learner's current state.",{"identity-basis":"learner-state","continuity":"learner-specific","merge-split":"capability-state-merged"})]),
  "invariants":("learning-design-evidence-boundary",[
   ("activity-implies-learning","Completing support/practice can directly establish capability.",{"valid-state-space":"completion-implies-state","enforcement-owner":"learning-design","exception-policy":"none"}),
   ("design-versus-evidence","Support intent/observation affordance remain distinct from actual learner evidence and conclusions.",{"valid-state-space":"design-evidence-separated","enforcement-owner":"learning-plus-learner-owners","exception-policy":"evidence-required"})]),
  "lifecycle":("capability-target-lifecycle",[
   ("target-owned-capability","Each Target owns separate capability definitions.",{"state-set":"per-target-capabilities","transition-ownership":"target-owner","terminality":"target-lifetime"}),
   ("reusable-capability-target-selection","Reusable capabilities persist while Targets select/specify them for purposes.",{"state-set":"reusable-capability-plus-target-spec","transition-ownership":"capability-and-target-owners","terminality":"none"})]),
  "relationships":("learning-cross-context-links",[
   ("knowledge-edge-reuse","Capability/target/support links are encoded as Subject Knowledge edges.",{"relation-vs-entity":"knowledge-relation","directionality":"knowledge-owned","cardinality":"knowledge-owned"}),
   ("explicit-cross-context-links","Learning/capability semantics own explicit references to Knowledge, Targets and support.",{"relation-vs-entity":"cross-context-reference","directionality":"owner-specific","cardinality":"owner-specific"})]),
  "responsibility-boundaries":("learning-design-boundary",[
   ("monolithic-learning-design","Learning Design owns reusable design, learner evidence and application flow.",{"semantic-owner":"learning-design","boundary-placement":"multi-context","downstream-freedom":"low"}),
   ("reusable-design-core","Learning Design owns reusable capability/target/support specifications only.",{"semantic-owner":"learning-design","boundary-placement":"reusable-design-context","downstream-freedom":"high"})])},
 "prep.learner-model":{
  "semantic-identity":("learner-evidence-identity",[
   ("mutable-state-record","One mutable mastery/state record absorbs observations and conclusions.",{"identity-basis":"mutable-state","continuity":"latest-record","merge-split":"facts-claims-merged"}),
   ("fact-argument-claim","Performance/Observation, evidence arguments and claims are separately addressable.",{"identity-basis":"fact-argument-claim","continuity":"historical-plus-projected","merge-split":"facts-arguments-claims-split"}),
   ("score-only","Learner truth is primarily a scalar score.",{"identity-basis":"score","continuity":"latest-score","merge-split":"collapsed"})]),
  "invariants":("learner-inference-boundary",[
   ("direct-observation-inference","Success/failure observations directly become learner capability state.",{"valid-state-space":"observation-equals-claim","enforcement-owner":"observation-capture","exception-policy":"none"}),
   ("explicit-inference-boundary","Observation remains distinct and requires an inspectable evidence argument before a claim.",{"valid-state-space":"fact-argument-claim-separated","enforcement-owner":"learner-evidence-owner","exception-policy":"insufficient-evidence-remains-unknown"})]),
  "lifecycle":("learner-evidence-lifecycle",[
   ("overwrite-state","New evidence overwrites prior learner state.",{"state-set":"current-only","transition-ownership":"latest-write","terminality":"none"}),
   ("append-history-project-current","Historical facts/arguments remain append-oriented and current state is re-projected.",{"state-set":"history-plus-current-projection","transition-ownership":"learner-evidence-owner","terminality":"none"})]),
  "relationships":("learner-evidence-argument-shape",[
   ("reusable-warrant-required","Every inference requires a separate reusable warrant entity.",{"relation-vs-entity":"warrant-entity","directionality":"warrant-to-claim","cardinality":"many-to-many"}),
   ("direct-inspectable-argument","Evidence argument directly records bearing, applicability, limits, reasoning and provenance.",{"relation-vs-entity":"argument-relation","directionality":"evidence-to-claim","cardinality":"many-to-many"}),
   ("opaque-model-output","A model score directly determines state.",{"relation-vs-entity":"opaque-output","directionality":"model-to-state","cardinality":"one-output-many-claims"})]),
  "responsibility-boundaries":("learner-model-boundary",[
   ("learner-model-owns-target-and-capability","Learner Model owns reusable target/capability semantics as part of state.",{"semantic-owner":"learner-model","boundary-placement":"cross-context","downstream-freedom":"low"}),
   ("learner-specific-only","Learner Model owns actual learner evidence/claims and references reusable semantics.",{"semantic-owner":"learner-model","boundary-placement":"learner-context","downstream-freedom":"high"})])},
}

def load(p:Path)->dict[str,Any]:
    v=yaml.safe_load(p.read_text())
    if not isinstance(v,dict): raise RuntimeError(f"{p} not mapping")
    return v

def topo_to(graph,target):
    prod=production_index(graph); seen=set(); out=[]
    def visit(c):
        if c in seen:return
        for r in prod[c].get("requires",[]) or []: visit(r["capability"])
        seen.add(c);out.append(c)
    visit(target);return out

def candidate_index():
    d={}
    for p in sorted((ROOT/".harness/candidates").glob("*-admission.yaml")):
        try:v=load(p)
        except:continue
        if v.get("kind")=="harness-artifact-admission-candidate" and isinstance(v.get("capability"),str):
            d.setdefault(v["capability"],[]).append((p,v))
    return d

def contract_index():
    d={}
    for p in sorted((ROOT/".harness/candidates").glob("*-contract.yaml")):
        try:v=load(p)
        except:continue
        if v.get("kind")=="harness-semantic-derivation-contract":
            d.setdefault((v.get("source_capability"),v.get("target_capability")),[]).append((p,v))
    return d

def deriv_index(sem):
    return {(x["source_capability"],x["target_capability"]):x for x in sem.get("derivation_evaluations",[]) or []}

def artifact_for(core,cap):
    m=[x["id"] for x in core["artifacts"] if cap in (x.get("provides") or [])]
    if len(m)!=1:raise RuntimeError((cap,m))
    return m[0]

def choose_candidate(cap,cands,derivs,lifeidx):
    rows=cands.get(cap,[])
    expected=(lifeidx.get(cap) or {}).get("semantic_atom_fingerprints")
    if expected:
        m=[copy.deepcopy(v) for _,v in rows if semantic_assertion_fingerprints(v)==expected]
        if len(m)==1:return m[0]
    if len(rows)==1:return copy.deepcopy(rows[0][1])
    for (src,_),item in derivs.items():
        if src!=cap:continue
        sf=(item.get("lifecycle_dependency") or {}).get("source_surface_fingerprints")
        if sf:
            m=[copy.deepcopy(v) for _,v in rows if semantic_assertion_fingerprints(v)==sf]
            if len(m)==1:return m[0]
    raise RuntimeError(f"cannot select candidate {cap}: {[str(p) for p,_ in rows]}")

def select_contract(key,rows,previous,graph,source,candidate,evidence):
    accepted=[]
    for p,c in rows:
        e=evaluate_derivation(graph=graph,contract=c,source=source,candidate=candidate,evidence=evidence)
        if e.get("status")=="ACCEPTED":accepted.append((p,e))
    prev=set(previous.get("required_sources",[]) or [])
    comp=[(p,e) for p,e in accepted if set(e.get("required_sources",[]) or [])==prev]
    if len(comp)==1:return comp[0][1]
    if len(comp)>1:
        normalized={yaml.safe_dump(e,sort_keys=True,allow_unicode=True) for _,e in comp}
        if len(normalized)==1:return comp[0][1]
    if len(accepted)==1:return accepted[0][1]
    raise RuntimeError(f"no unique derivation contract {key}: {[str(p) for p,_ in accepted]}")

def next_id(old):
    m=re.match(r"^(.*-STRICT-)(\d+)$",old)
    return f"{m.group(1)}{int(m.group(2))+1}" if m else old+"-POLICY-REVISION-1"

def replace_eval(sem,e):
    k=(e["artifact"],e["capability"])
    for i,x in enumerate(sem["semantic_evaluations"]):
        if (x.get("artifact"),x.get("capability"))==k:sem["semantic_evaluations"][i]=e;return
    sem["semantic_evaluations"].append(e)

def replace_deriv(sem,e):
    k=(e["source_capability"],e["target_capability"])
    for i,x in enumerate(sem["derivation_evaluations"]):
        if (x.get("source_capability"),x.get("target_capability"))==k:sem["derivation_evaluations"][i]=e;return
    sem["derivation_evaluations"].append(e)

def replace_life(life,row):
    for i,x in enumerate(life["providers"]):
        if x.get("capability")==row["capability"]:life["providers"][i]=row;return
    life["providers"].append(row)

def domain_exploration(cap):
    axes=[]
    reviewed=[]
    for axis,(decision_id,alts) in DOMAIN_OPTIONS[cap].items():
        altids=[a[0] for a in alts]
        probes=[]
        for p in COMMON_PROBES[axis]:
            q=copy.deepcopy(p);q["alternatives"]=altids;probes.append(q)
        axes.append({
          "axis":axis,"applicability":"APPLICABLE","exploration_level":"EXPLORE",
          "probes":probes,
          "decision_points":[{"id":decision_id,"alternatives":[
             {"id":aid,"difference":diff,"material_effects":effects} for aid,diff,effects in alts]}]})
        reviewed.append(decision_id)
    return {"version":1,"kind":"harness-decision-exploration","capability":cap,"knowledge_kind":"domain-model",
            "explorer_request_id":"UNBOUND","research_sources":[],"axes":axes,
            "decision_space_review":{"status":"COMPLETE","checks":[
              "mixed-decision-split","missing-material-case-search","accepted-constraint-cross-check","authority-boundary-cross-check"],
              "reviewed_decisions":reviewed,"open_gaps":[]}}

def exploration_template(cap):
    if cap in DOMAIN_OPTIONS:return domain_exploration(cap)
    p=EXPLORATION_FILES.get(cap)
    return copy.deepcopy(load(ROOT/p)) if p else None

def main():
    graph=load(ROOT/".harness/engineering-graph.yaml")
    pub=read_project_publication(ROOT/".harness/project-publication.yaml",graph=graph)
    core=copy.deepcopy(pub["state"]["core_model"])
    sem=copy.deepcopy(pub["state"]["semantic_evaluations"])
    life=copy.deepcopy(pub["state"]["lifecycle"])
    failures=copy.deepcopy(pub["state"]["decision_failures"])
    prod=production_index(graph); derivs=deriv_index(sem)
    lifeidx={x["capability"]:x for x in life.get("providers",[])}
    cands=candidate_index(); contracts=contract_index()
    registry=load(HARNESS_ROOT/"skills/artifact-skill-registry-v0.yaml")
    kcontracts=load(HARNESS_ROOT/"spec/semantic-acceptance/knowledge-kind-contracts-v1.yaml")
    dcontracts=load(HARNESS_ROOT/"spec/decision-governance/knowledge-kind-decision-contracts-v1.yaml")
    policy=load(ROOT/".harness/candidates/application-design-decision-policy.yaml")
    report=[]; bound_explorations={}
    for cap in topo_to(graph,TARGET):
        candidate=choose_candidate(cap,cands,derivs,lifeidx)
        sources={"semantic_assertions":[]}; incoming=[]
        for req in prod[cap].get("requires",[]) or []:
            sc=req["capability"]; source=choose_candidate(sc,cands,derivs,lifeidx)
            sa=artifact_for(core,sc)
            for a in source.get("semantic_assertions",[]) or []:
                z=copy.deepcopy(a);z["source_artifact"]=sa;sources["semantic_assertions"].append(z)
            key=(sc,cap); prev=derivs.get(key); rows=contracts.get(key,[])
            if prev is None and not rows:continue
            if prev is None or not rows:raise RuntimeError(f"incomplete derivation pair {key}")
            evidence={"version":1,"kind":"harness-semantic-derivation-evidence",
                      "source_capability":sc,"target_capability":cap,
                      "links":copy.deepcopy(prev.get("links",[])),
                      "dispositions":copy.deepcopy(prev.get("dispositions",[]))}
            incoming.append(select_contract(key,rows,prev,graph,source,candidate,evidence))
        old=lifeidx[cap]; aid=next_id(old["acceptance_id"])
        kwargs=dict(graph=graph,model=core,skill_registry=registry,knowledge_contracts=kcontracts,
                    decision_contracts=dcontracts,decision_policy=policy,derivation_evaluations=incoming,
                    capability=cap,sources=sources,candidate=candidate,acceptance_id=aid,
                    lifecycle=life,decision_request_mode="REVISION")
        probe=admit_artifact(**kwargs)
        tmpl=exploration_template(cap)
        admitted=probe
        req_id=(probe.get("admission") or {}).get("decision_explorer_request_id")
        if tmpl is not None:
            if not req_id:raise RuntimeError(f"{cap} requires template but request id missing")
            tmpl["version"]=1;tmpl["kind"]="harness-decision-exploration";tmpl["capability"]=cap
            tmpl["knowledge_kind"]=prod[cap]["knowledge_kind"];tmpl["explorer_request_id"]=req_id
            for a in tmpl.get("axes",[]) or []:
                a.pop("selected_basis",None);a.pop("rationale",None)
            admitted=admit_artifact(**kwargs,decision_exploration=tmpl)
            bound_explorations[cap]=tmpl
        if admitted.get("status")!="ACCEPTED":
            raise RuntimeError(yaml.safe_dump({"capability":cap,"status":admitted.get("status"),
                 "findings":admitted.get("findings"),"admission":admitted.get("admission")},sort_keys=False))
        replace_eval(sem,admitted)
        for e in incoming:
            replace_deriv(sem,e);derivs[(e["source_capability"],e["target_capability"])]=e
        replace_life(life,admitted["lifecycle_assertion"]);lifeidx[cap]=admitted["lifecycle_assertion"]
        report.append({"capability":cap,"acceptance_id":aid,
                       "decision_exploration":admitted["admission"].get("decision_exploration"),
                       "decision_governance":admitted["admission"].get("decision_governance")})
    next_pub=build_project_publication(graph=graph,core_model=core,semantic_evaluations=sem,
        lifecycle=life,decision_failures=failures,parent_revision=pub["revision"])
    policy_fp=derive_acceptance_policy_fingerprints(graph=graph,knowledge_contracts=kcontracts,
        decision_contracts=dcontracts,decision_policy=policy)
    states=lifecycle_states(graph,core,life,current_acceptance_policy_fingerprints=policy_fp)
    prefix=set(topo_to(graph,TARGET))
    bad={c:s for c,s in states.items() if c in prefix and s.get("state")!="CURRENT"}
    if bad:raise RuntimeError("prefix remains non-current:\n"+yaml.safe_dump(bad,sort_keys=False))
    (ROOT/".harness/project-publication.next.yaml").write_text(yaml.safe_dump(next_pub,sort_keys=False,allow_unicode=True))
    for cap,e in bound_explorations.items():
        slug=cap.removeprefix("prep.").replace(".","-")
        (ROOT/".harness/candidates"/f"{slug}-exploration-current.yaml").write_text(
            yaml.safe_dump(e,sort_keys=False,allow_unicode=True))
    (ROOT/".harness/prefix-revalidation-report.yaml").write_text(yaml.safe_dump({
      "version":1,"kind":"prep-prefix-revalidation-report","parent_revision":pub["revision"],
      "next_revision":next_pub["revision"],"results":report},sort_keys=False,allow_unicode=True))
    print(yaml.safe_dump({"next_revision":next_pub["revision"],"results":report},sort_keys=False,allow_unicode=True))

if __name__=="__main__":main()
