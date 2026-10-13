// EX-PLD-11: provisional model-to-view compatibility probe. Research-only, no domain admission.
// Usage after fetching BOTH branches (from EX-PLD-11 checkout):
// git show research/ex-pld-10-adversarial-fixture-2026-10-13:docs/research/product-learning-direction/ex-pld-10-adversarial-fixture-2026-10-13.json > /tmp/ex-pld-10-fixture.json
// node experiments/universal_entity_workspace/ex-pld-11-compatibility-check.mjs /tmp/ex-pld-10-fixture.json
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

function checkFixture(f, verify, graphPolicy) {
  const expectedKinds = [
    ['Goal', 'goals'], ['CapabilityDescription', 'capability_descriptions'],
    ['Knowledge', 'knowledge'], ['StudyMaterial', 'study_materials']
  ];
  const objects = expectedKinds.flatMap(([kind, key]) =>
    f[key].map(item => ({ ...item, kind, subtype: item.type ?? null })));
  const byId = new Map(objects.map(item => [item.id, item]));
  const predicates = new Map(f.provisional_predicates.map(d => [d.id, d]));
  const binary = f.assertions.map(a => {
    const descriptor = predicates.get(a.predicate);
    verify.ok(descriptor, 'unrecognized predicate ' + a.predicate);
    verify.equal(byId.get(a.subject)?.kind, descriptor.subject_kind);
    verify.equal(byId.get(a.object)?.kind, descriptor.object_kind);
    return { recordId: a.id, recordKind: 'binary-assertion',
      predicateId: a.predicate, meaning: descriptor.meaning,
      roles: [{ role: 'subject', objectId: a.subject }, { role: 'object', objectId: a.object }],
      conditions: a.conditions ?? null };
  });
  const intents = f.scoped_study_intents.map(s => ({
    recordId: s.id, recordKind: 'scoped-study-intent',
    roles: [{ role: 'goal', objectId: s.goal },
      ...(s.capability === null ? [] : [{ role: 'capability', objectId: s.capability }]),
      { role: 'knowledge', objectId: s.knowledge }],
    objective: s.objective, qualification: s.qualification ?? null
  }));
  for (const record of intents) {
    for (const role of record.roles) verify.ok(byId.has(role.objectId), 'unknown intent reference');
  }
  const entries = [...binary, ...intents];
  const related = objectId => entries.filter(entry => entry.roles.some(r => r.objectId === objectId));
  const roleId = (entry, role) => entry.roles.find(r => r.role === role)?.objectId ?? null;
  // Graph eligibility is a test view-policy input, not an implicit all-relations rule.
  const graph = (kind, workingSet) => ({
    nodes: workingSet.filter(id => byId.get(id)?.kind === kind),
    edges: binary.filter(r => graphPolicy.eligiblePredicates.has(r.predicateId)
      && byId.get(roleId(r, 'subject'))?.kind === kind
      && byId.get(roleId(r, 'object'))?.kind === kind
      && workingSet.includes(roleId(r, 'subject'))
      && workingSet.includes(roleId(r, 'object'))).map(r => r.recordId)
  });
  // Navigation from a record *role*: preserve the actual source record; do not infer edges.
  const navigate = (state, record, targetRole) => {
    const targetId = roleId(record, targetRole);
    verify.ok(targetId && byId.has(targetId));
    const targetKind = byId.get(targetId).kind;
    const visibleIds = state.filtersByKind[targetKind] ?? null;
    return { ...state, activeKind: targetKind, selectedId: targetId,
      navigationOrigin: { recordId: record.recordId, recordKind: record.recordKind, role: targetRole },
      visibility: visibleIds !== null && !visibleIds.includes(targetId) ? 'outside-table-filter' : 'visible' };
  };
  const tests = [
    ['fixture corpus counts', () => {
      verify.equal(f.fixture_id, 'EX-PLD-10-FIXTURE-01');
      verify.deepEqual(expectedKinds.map(([,key]) => f[key].length), [2,4,12,8]);
      verify.equal(binary.length, 23); verify.equal(intents.length, 10);
    }],
    ['stable distinct IDs even for equal titles', () => {
      verify.equal(byId.get('K04').title, byId.get('K05').title);
      verify.notEqual(byId.get('K04').meaning, byId.get('K05').meaning);
      verify.equal(byId.size, objects.length);
    }],
    ['all 23 relation instances retain identity, predicate and directional roles', () => {
      verify.equal(new Set(binary.map(r => r.recordId)).size, 23);
      verify.ok(binary.every(r => r.roles.length === 2 && r.meaning));
    }],
    ['all 10 study-intent records have role-bound identity and objective', () => {
      verify.equal(new Set(intents.map(s => s.recordId)).size, 10);
      verify.ok(intents.every(s => s.objective && s.roles.length >= 2));
    }],
    ['G02 has zero binary assertions but four real scoped intentions', () => {
      verify.equal(binary.filter(r => r.roles.some(x => x.objectId === 'G02')).length, 0);
      verify.deepEqual(related('G02').map(r => r.recordId), ['S02','S05','S06','S08']);
    }],
    ['G02-C02 assertion not manufactured from S02', () => {
      verify.ok(!binary.some(r => r.roles.some(x => x.objectId === 'G02')
        && r.roles.some(x => x.objectId === 'C02')));
      verify.deepEqual(intents.find(r => r.recordId === 'S02').roles.map(x => x.objectId), ['G02','C02','K04']);
    }],
    ['K04 reused by two context-specific objectives', () => {
      const found = related('K04').filter(r => r.recordKind === 'scoped-study-intent');
      verify.deepEqual(found.map(r => r.recordId), ['S01','S02']);
      verify.notEqual(found[0].objective, found[1].objective);
    }],
    ['optional Capability role absent rather than invented', () => {
      const s04 = intents.find(r => r.recordId === 'S04');
      verify.deepEqual(s04.roles.map(x => x.role), ['goal','knowledge']);
      verify.equal(roleId(s04, 'knowledge'), 'K10');
    }],
    ['bounded Knowledge graph 12 actual nodes / 6 direct edges', () => {
      const allK = f.knowledge.map(x => x.id), proj = graph('Knowledge', allK);
      verify.equal(proj.nodes.length,12); verify.equal(proj.edges.length,6);
      verify.ok(!proj.edges.some(id => id.startsWith('S')));
    }],
    ['binary conditional edge inspectability retained', () => {
      const r = binary.find(x => x.recordId === 'R-KK-05');
      verify.equal(roleId(r,'subject'),'K04'); verify.equal(roleId(r,'object'),'K03');
      verify.ok(r.conditions.includes('Ключ один'));
      verify.equal(r.predicateId,'may_mitigate_under');
    }],
    ['reverse navigation does not invert assertion', () => {
      const r = related('K03').find(x => x.recordId === 'R-KK-05');
      verify.equal(roleId(r,'subject'),'K04'); verify.equal(roleId(r,'object'),'K03');
    }],
    ['M04 has four associations but no implied Capability relation', () => {
      verify.equal(related('M04').filter(r => r.recordKind === 'binary-assertion').length,4);
      verify.ok(!related('M04').some(r => r.roles.some(x => byId.get(x.objectId)?.kind === 'CapabilityDescription')));
    }],
    ['M07 remains an isolated valid record, no fabricated relations', () =>
      verify.equal(related('M07').length,0)],
    ['no transitive K01-to-K03 edge from K01-K02-K03 path', () =>
      verify.ok(!binary.some(r => roleId(r,'subject') === 'K01' && roleId(r,'object') === 'K03'))],
    ['activity subjects cannot imply Goal-Capability assertion', () => {
      verify.equal(f.activity_result_boundary.length, 2);
      verify.ok(f.activity_result_boundary.some(a => a.goal_context === 'G01' && a.capability_subject === 'C02'));
      verify.ok(!binary.some(r => roleId(r,'subject') === 'G01' && roleId(r,'object') === 'C02'));
    }],
    ['navigate S02 to K04 with conflicting saved filter, do not change filter/focus/context', () => {
      const initial = { activeKind:'CapabilityDescription', selectedId:'C02', focus:'C02', explicitGoal:'G02',
        filtersByKind:{Knowledge:['K05']}, graphWorkingSet:['K05'], navigationOrigin:null };
      const moved = navigate(initial, intents.find(x => x.recordId === 'S02'), 'knowledge');
      verify.equal(moved.activeKind,'Knowledge'); verify.equal(moved.selectedId,'K04');
      verify.equal(moved.visibility,'outside-table-filter');
      verify.deepEqual(moved.filtersByKind, initial.filtersByKind);
      verify.equal(moved.explicitGoal,'G02'); verify.equal(moved.focus,'C02');
      verify.deepEqual(moved.navigationOrigin,
        {recordId:'S02',recordKind:'scoped-study-intent',role:'knowledge'});
      verify.equal(initial.selectedId,'C02');
    }],
    ['selected node excluded by bounded graph stays absent', () => {
      const proj = graph('Knowledge',f.knowledge.map(k=>k.id).filter(id=>id!=='K04'));
      verify.ok(!proj.nodes.includes('K04'));
      verify.ok(!proj.edges.includes('R-KK-05'));
    }],
    ['removing one edge record preserves objects and other edges', () => {
      const allK=f.knowledge.map(x=>x.id), current=graph('Knowledge',allK);
      verify.ok(current.edges.includes('R-KK-04'));
      const without=current.edges.filter(x=>x!=='R-KK-04');
      verify.equal(without.length,5); verify.equal(current.nodes.length,12);
    }]
  ];
  for(const [name, check] of tests) check();
  return { checks:tests.map(([name])=>name), objects:objects.length,
    binary:binary.length, scopedIntents:intents.length,
    categories:expectedKinds.map(([kind])=>kind), graph:graph('Knowledge',f.knowledge.map(k=>k.id)) };
}
const path = process.argv[2];
if (!path) { console.error('Pass the independent EX-PLD-10 JSON fixture path as first argument.'); process.exitCode=2; }
else {
  const raw=readFileSync(path);
  const blobSha=createHash('sha1').update('blob '+raw.length+'\0').update(raw).digest('hex');
  assert.equal(blobSha,'b1a4cb69d59ae75aabc5f7da9b92564c32eb1218', 'EX-PLD-10 fixture changed: preserve baseline and create another checkpoint');
  const f=JSON.parse(raw.toString('utf8'));
  const graphPolicy = { eligiblePredicates: new Set(['may_cause_under', 'may_mitigate_under']) };
  const out=checkFixture(f,assert,graphPolicy);
  for(const name of out.checks) console.log('PASS '+name);
  console.log('EX-PLD-11 provisional compatibility: '+out.checks.length+'/'+out.checks.length+
    ', objects='+out.objects+', binary='+out.binary+', intents='+out.scopedIntents);
}
