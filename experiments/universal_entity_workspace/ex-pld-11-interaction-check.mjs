// EX-PLD-11 final independent presentation-contract stress check.
// Self-contained neutral assertions: no canonical Prep predicate or other research fixture.
// Run: node experiments/universal_entity_workspace/ex-pld-11-interaction-check.mjs
import assert from 'node:assert/strict';

const kinds = {
  G: { label: 'Goals', ownFields: ['title','description'], detailSlots: {} },
  C: { label: 'Capabilities', ownFields: ['title'], detailSlots: {} },
  K: { label: 'Knowledge', ownFields: ['title','subtype'], detailSlots: {} },
  M: { label: 'Materials', ownFields: ['title','subtype'], detailSlots: {scenario:'scenario-reader',link:'link-reader'} },
  X: { label: 'Additional example kind', ownFields: ['title'], detailSlots: {} }
};
const objects = [
  {id:'G0',kind:'G',title:'Unspecified objective',description:null},
  {id:'G1',kind:'G',title:'Explore cache decisions'},
  {id:'C1',kind:'C',title:'Explain tradeoffs'},
  {id:'K1',kind:'K',title:'Caching',subtype:'concept'},
  {id:'K2',kind:'K',title:'TTL',subtype:'rule'},
  {id:'K3',kind:'K',title:'Stampede',subtype:'risk'},
  {id:'K4',kind:'K',title:'TTL',subtype:'distinct-concept'},
  {id:'M1',kind:'M',title:'Incident scenario',subtype:'scenario'},
  {id:'M2',kind:'M',title:'Reference URL',subtype:'link'},
  {id:'M3',kind:'M',title:'Unrecognized recording',subtype:'video'},
  {id:'X1',kind:'X',title:'Neutral extension'}
];
const records = [
  {id:'A01',form:'binary',predicate:'constrains',roles:{subject:'K2',object:'K1'},context:'scope-A',directed:true},
  {id:'A02',form:'binary',predicate:'constrains',roles:{subject:'K2',object:'K1'},context:'scope-B',directed:true},
  {id:'A03',form:'binary',predicate:'contrasts',roles:{subject:'K3',object:'K4'},context:null,directed:false},
  {id:'A04',form:'binary',predicate:'references',roles:{subject:'C1',object:'K3'},context:null,directed:true},
  {id:'A05',form:'binary',predicate:'covers',roles:{subject:'M1',object:'K3'},context:null,directed:true},
  {id:'A06',form:'binary',predicate:'covers',roles:{subject:'M2',object:'K2'},context:null,directed:true},
  {id:'T01',form:'multi-role',roles:{goal:'G1',capability:'C1',knowledge:'K2'},objective:'Explain the constraint in context G1'},
  {id:'T02',form:'multi-role',roles:{goal:'G1',knowledge:'K2'},objective:'Contrast alternative interpretations'}
];
const byId = new Map(objects.map(x=>[x.id,x]));
const byRecord = new Map(records.map(x=>[x.id,x]));
const graphPolicy = { K:new Set(['constrains','contrasts']) };
const related = id => records.filter(r=>Object.values(r.roles).includes(id)).map(r=>({...r,selectionRole:Object.entries(r.roles).filter(([,v])=>v===id).map(([role])=>role)}));
function graph(kind, workingSet) {
  const nodes=workingSet.filter(id=>byId.get(id)?.kind===kind);
  const nodeIds=new Set(nodes);
  const edges=records.filter(r=>r.form==='binary' && graphPolicy[kind]?.has(r.predicate)
    && nodeIds.has(r.roles.subject) && nodeIds.has(r.roles.object)).map(r=>r.id);
  return {nodes,edges};
}
const defaults={
  activeKind:'K',selectedId:'K1',selectedRecordId:null,hoverId:null,
  tableFilters:{K:['K1','K2']},graphWorkingSet:{K:['K1','K2','K3','K4']},
  focusId:'K2',explicitContext:'scope-A',navigationHistory:[],
  layout:{maximized:null,collapsed:{},widths:[65,35]}
};
function collection(s) {
  const all=objects.filter(o=>o.kind===s.activeKind);
  const visible=s.tableFilters[s.activeKind];
  return visible ? all.filter(o=>visible.includes(o.id)) : all;
}
function workspace(s) {
  const item=byId.get(s.selectedId);
  const g=graph(s.activeKind,s.graphWorkingSet[s.activeKind]??[]);
  const list=collection(s);
  const slot=kinds[item.kind].detailSlots[item.subtype]??null;
  return {
    collection:list.map(o=>o.id),
    related:related(s.selectedId).map(r=>r.id),
    details:{id:item.id,fields:Object.fromEntries(kinds[item.kind].ownFields.map(k=>[k,item[k]??null])),
      extension:item.kind==='M' && item.subtype && !slot ? 'requires-extension' : slot},
    graph:g,
    selectedOutsideTable:!list.some(o=>o.id===s.selectedId),
    selectedOutsideGraph:!g.nodes.includes(s.selectedId)
  };
}
function choose(s,id,source='table') {
  const o=byId.get(id);
  assert.ok(o && o.kind===s.activeKind);
  if(source==='graph') assert.ok(graph(s.activeKind,s.graphWorkingSet[s.activeKind]??[]).nodes.includes(id));
  return {...s,selectedId:id,selectedRecordId:null};
}
function selectRelation(s,recordId) {
  const g=graph(s.activeKind,s.graphWorkingSet[s.activeKind]??[]);
  assert.ok(g.edges.includes(recordId));
  return {...s,selectedRecordId:recordId};
}
function inspector(recordId) {
  const r=byRecord.get(recordId);
  assert.ok(r);
  return {...r,roleObjects:Object.fromEntries(Object.entries(r.roles).map(([role,id])=>[role,byId.get(id)?.title??null]))};
}
function navigate(s,recordId,targetRole) {
  const r=byRecord.get(recordId);
  assert.ok(r && related(s.selectedId).some(x=>x.id===recordId));
  const targetId=r.roles[targetRole];
  assert.ok(targetId && byId.has(targetId));
  return {...s,activeKind:byId.get(targetId).kind,selectedId:targetId,
    selectedRecordId:recordId,hoverId:null,
    navigationHistory:[...s.navigationHistory,{
      activeKind:s.activeKind,selectedId:s.selectedId,selectedRecordId:s.selectedRecordId,
      tableFilters:s.tableFilters,graphWorkingSet:s.graphWorkingSet,explicitContext:s.explicitContext,
      focusId:s.focusId,via:{recordId,targetRole}
    }]};
}
function back(s) {
  assert.ok(s.navigationHistory.length);
  const prior=s.navigationHistory.at(-1);
  return {...s,...{activeKind:prior.activeKind,selectedId:prior.selectedId,selectedRecordId:prior.selectedRecordId,
    tableFilters:prior.tableFilters,graphWorkingSet:prior.graphWorkingSet,explicitContext:prior.explicitContext,
    focusId:prior.focusId},navigationHistory:s.navigationHistory.slice(0,-1)};
}
function revealInTable(s) {
  return {...s,tableFilters:{...s.tableFilters,[s.activeKind]:null}};
}
function adjustLayout(s,operation,pane) {
  if(operation==='maximize') return {...s,layout:{...s.layout,maximized:pane}};
  if(operation==='restore') return {...s,layout:{...s.layout,maximized:null}};
  if(operation==='collapse') return {...s,layout:{...s.layout,collapsed:{...s.layout.collapsed,[pane]:true}}};
  throw Error('unknown layout action');
}
const checks = [
  ['initial four-pane projection',()=>{ const v=workspace(defaults); assert.deepEqual(v.collection,['K1','K2']);assert.deepEqual(v.related,['A01','A02']);assert.equal(v.details.id,'K1');assert.equal(v.graph.edges.length,3); }],
  ['parallel edges distinguished by record IDs and context',()=>{ assert.deepEqual(related('K1').map(x=>x.id),['A01','A02']);assert.notEqual(inspector('A01').context,inspector('A02').context); }],
  ['reverse lookup preserves original direction',()=>{ const r=inspector('A01');assert.equal(r.roles.subject,'K2');assert.equal(r.roles.object,'K1');assert.equal(related('K1')[0].selectionRole[0],'object'); }],
  ['symmetrical predicate has explicit non-directed semantics',()=>{ assert.equal(inspector('A03').directed,false);assert.ok(related('K4').some(x=>x.id==='A03')); }],
  ['graph maps only explicit eligible binary assertions',()=>{ assert.deepEqual(graph('K',['K1','K2','K3','K4']).edges,['A01','A02','A03']); }],
  ['no graph connection derived from heterogeneous contextual record',()=>{ assert.ok(!graph('K',['K1','K2','K3','K4']).edges.includes('T01')); }],
  ['same-kind table selection updates selected details without changing graph/filter/focus',()=>{const s=choose(defaults,'K2');assert.equal(workspace(s).details.id,'K2');assert.deepEqual(s.tableFilters,defaults.tableFilters);assert.equal(s.focusId,'K2');assert.deepEqual(s.graphWorkingSet,defaults.graphWorkingSet);}],
  ['graph selection outside table filter is explicit, no phantom table row',()=>{const s=choose(defaults,'K3','graph');assert.equal(workspace(s).selectedOutsideTable,true);assert.deepEqual(workspace(s).collection,['K1','K2']);}],
  ['selection outside graph set remains selected without fabricated graph node',()=>{const s={...defaults,graphWorkingSet:{K:['K2','K3']}};assert.equal(workspace(s).selectedOutsideGraph,true);assert.ok(!workspace(s).graph.nodes.includes('K1'));}],
  ['reveal changes table filter only by explicit action',()=>{const s=choose(defaults,'K3','graph');const r=revealInTable(s);assert.ok(workspace(r).collection.includes('K3'));assert.equal(r.explicitContext,defaults.explicitContext);assert.deepEqual(r.graphWorkingSet,defaults.graphWorkingSet);}],
  ['hover and focus do not replace selection',()=>{const s={...defaults,hoverId:'K4',focusId:'K3'};assert.equal(s.selectedId,'K1');assert.equal(workspace(s).details.id,'K1');}],
  ['graph edge selection opens selected record while retaining object',()=>{const s=selectRelation(defaults,'A02');assert.equal(s.selectedId,'K1');assert.equal(s.selectedRecordId,'A02');assert.equal(inspector(s.selectedRecordId).context,'scope-B');}],
  ['role-aware multi-role record preserves objective and nullable capability',()=>{assert.deepEqual(Object.keys(inspector('T01').roles),['goal','capability','knowledge']);assert.deepEqual(Object.keys(inspector('T02').roles),['goal','knowledge']);assert.notEqual(inspector('T01').objective,inspector('T02').objective);}],
  ['scope-only record does not invent G-C or C-K binary assertions',()=>{assert.ok(!records.some(r=>r.form==='binary'&&r.roles.subject==='G1'));assert.ok(!records.some(r=>r.form==='binary'&&r.roles.subject==='C1'&&r.roles.object==='K2'));}],
  ['G0 incomplete object has truthful empty related and graph',()=>{const s={...defaults,activeKind:'G',selectedId:'G0',tableFilters:{},graphWorkingSet:{G:['G0']}};const v=workspace(s);assert.equal(v.related.length,0);assert.equal(v.graph.edges.length,0);assert.equal(v.details.fields.description,null);}],
  ['cross-kind navigation retains record origin and explicit context',()=>{const s={...defaults,activeKind:'C',selectedId:'C1'};const r=navigate(s,'A04','object');assert.equal(r.activeKind,'K');assert.equal(r.selectedId,'K3');assert.equal(r.selectedRecordId,'A04');assert.equal(r.explicitContext,'scope-A');assert.deepEqual(r.navigationHistory[0].via,{recordId:'A04',targetRole:'object'});}],
  ['destination filter conflict is detected without implicit filter mutation',()=>{const s={...defaults,activeKind:'C',selectedId:'C1'};const r=navigate(s,'A04','object');assert.equal(workspace(r).selectedOutsideTable,true);assert.deepEqual(r.tableFilters.K,['K1','K2']);assert.equal(r.focusId,'K2');}],
  ['back restores original section and selection, not asserted relationships',()=>{const initial={...defaults,activeKind:'C',selectedId:'C1'};const after=navigate(initial,'A04','object');const returned=back(after);assert.equal(returned.activeKind,'C');assert.equal(returned.selectedId,'C1');assert.deepEqual(returned.tableFilters,initial.tableFilters);assert.equal(returned.navigationHistory.length,0);}],
  ['multi-role navigation opens requested role without constructing an edge',()=>{const s={...defaults,activeKind:'G',selectedId:'G1'};const moved=navigate(s,'T01','knowledge');assert.equal(moved.selectedId,'K2');assert.equal(moved.selectedRecordId,'T01');assert.equal(workspace(moved).related.includes('T01'),true);assert.ok(!graph('K',['K1','K2']).edges.includes('T01'));}],
  ['materials use descriptor-selected read-only extension slots',()=>{const s={...defaults,activeKind:'M',selectedId:'M1'};assert.equal(workspace(s).details.extension,'scenario-reader');assert.equal(workspace({...s,selectedId:'M2'}).details.extension,'link-reader');}],
  ['unknown specialized media reports extension needed rather than generic support',()=>{const s={...defaults,activeKind:'M',selectedId:'M3'};assert.equal(workspace(s).details.extension,'requires-extension');}],
  ['new kind X works with same collection/details/empty graph',()=>{const s={...defaults,activeKind:'X',selectedId:'X1',tableFilters:{},graphWorkingSet:{X:['X1']}};const v=workspace(s);assert.deepEqual(v.collection,['X1']);assert.equal(v.details.id,'X1');assert.equal(v.graph.edges.length,0);}],
  ['identical titles do not collapse object identity',()=>{assert.equal(byId.get('K2').title,byId.get('K4').title);assert.notEqual(byId.get('K2').id,byId.get('K4').id);}],
  ['collapse/maximize/restore retains unrelated interaction and original geometry',()=>{let s=adjustLayout(defaults,'collapse','2');s=adjustLayout(s,'maximize','4');assert.equal(s.layout.maximized,'4');assert.equal(s.layout.collapsed['2'],true);assert.deepEqual(s.layout.widths,[65,35]);s=adjustLayout(s,'restore','4');assert.equal(s.layout.maximized,null);assert.equal(s.layout.collapsed['2'],true);assert.equal(s.selectedId,defaults.selectedId);assert.equal(s.explicitContext,defaults.explicitContext);}],
  ['edge inspection does not change graph working set or corpus',()=>{const before=graph('K',['K1','K2','K3','K4']);const s=selectRelation(defaults,'A01');assert.deepEqual(graph('K',['K1','K2','K3','K4']),before);assert.equal(records.length,8);assert.equal(s.selectedRecordId,'A01');}]
];
for(const [name,fn] of checks){fn();console.log('PASS '+name);}
console.log('EX-PLD-11 independent closure check: '+checks.length+'/'+checks.length+' invariant assertions passed; static projections only');
