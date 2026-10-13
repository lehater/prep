// EX-PLD-11 independent neutral presentation fixture and read-projection sanity check.
// These are stipulated synthetic assertions, NOT accepted Prep domain predicates.
// Execute from repo root: node experiments/universal_entity_workspace/ex-pld-11-neutral-check.mjs
import assert from 'node:assert/strict';

const makeObject = (id, kind, subtype, title) => ({ id, kind, subtype, title });
const objects = [
  makeObject('G01', 'G', null, 'Target scope not specified'),
  makeObject('C01', 'C', 'conceptual', 'Explain caching choices'),
  makeObject('C02', 'C', 'diagnostic', 'Investigate cache stampede'),
  makeObject('C03', 'C', null, 'Review operational notes'),
  makeObject('K01', 'K', 'concept', 'HTTP caching'),
  makeObject('K02', 'K', 'rule', 'TTL'),
  makeObject('K03', 'K', 'procedure', 'Conditional requests'),
  makeObject('K04', 'K', 'artifact', 'ETag'),
  makeObject('K05', 'K', 'risk', 'Cache stampede'),
  makeObject('K06', 'K', 'mitigation', 'Request coalescing'),
  makeObject('K07', 'K', 'procedure', 'Invalidation'),
  makeObject('K08', 'K', 'principle', 'Cache freshness'),
  makeObject('M01', 'M', 'card', 'TTL comparison card'),
  makeObject('M02', 'M', 'scenario', 'Cache incident scenario'),
  makeObject('M03', 'M', 'external-link', 'Independent external notes')
];
const makeRelation = (id, predicate, from, to, context = null, directed = true, graphable = false) =>
  ({ id, predicate, from, to, context, directed, graphable });
const relations = [
  makeRelation('R01', 'constrains', 'K02', 'K08', 'scope-A', true, true),
  makeRelation('R02', 'constrains', 'K02', 'K08', 'scope-B', true, true),
  makeRelation('R03', 'enables', 'K04', 'K03', null, true, true),
  makeRelation('R04', 'supports', 'K03', 'K08', null, true, true),
  makeRelation('R05', 'changes', 'K07', 'K08', null, true, true),
  makeRelation('R06', 'mitigated-by', 'K05', 'K06', null, true, true),
  makeRelation('R07', 'risk-of', 'K05', 'K01', null, true, true),
  makeRelation('R08', 'uses', 'K01', 'K02', null, true, true),
  makeRelation('R09', 'property-of', 'K08', 'K01', null, true, true),
  makeRelation('R10', 'contrasts-with', 'K07', 'K02', null, false, true),
  makeRelation('R11', 'references', 'C01', 'K02'),
  makeRelation('R12', 'references', 'C02', 'K05'),
  makeRelation('R13', 'covers', 'M01', 'K02'),
  makeRelation('R14', 'covers', 'M02', 'K01'),
  makeRelation('R15', 'covers', 'M02', 'K05')
];
const byId = new Map(objects.map(object => [object.id, object]));
const related = id => relations
  .filter(r => r.from === id || r.to === id)
  .map(r => ({
    id: r.id, predicate: r.predicate, from: r.from, to: r.to,
    role: r.from === id ? 'source' : 'target',
    other: r.from === id ? r.to : r.from,
    context: r.context, directed: r.directed
  }));
const graph = (kind, workingSet) => ({
  nodes: workingSet.filter(id => byId.get(id)?.kind === kind),
  edges: relations
    .filter(r => r.graphable && workingSet.includes(r.from) && workingSet.includes(r.to)
      && byId.get(r.from)?.kind === kind && byId.get(r.to)?.kind === kind)
    .map(r => r.id)
});
const select = (state, id) => ({ ...state, selectedId: id });
const kindIds = kind => objects.filter(o => o.kind === kind).map(o => o.id);
const kIds = kindIds('K');
const k08Rows = related('K08');
const selected = select({
  activeKind: 'K', selectedId: 'K08', filter: 'exclude:K02',
  graphFocus: 'K03', explicitContext: 'scope-X', workingSet: kIds
}, 'K02');
const checks = [
  ['distinct relation instances', () => assert.deepEqual(
    k08Rows.filter(r => r.from === 'K02' && r.to === 'K08').map(r => r.id), ['R01', 'R02'])],
  ['reverse navigation retains source / target', () => assert.ok(
    k08Rows.some(r => r.id === 'R01' && r.role === 'target' && r.from === 'K02' && r.to === 'K08'))],
  ['8 knowledge nodes and 10 knowledge edges', () => {
    assert.equal(graph('K', kIds).nodes.length, 8);
    assert.equal(graph('K', kIds).edges.length, 10);
  }],
  ['cross-kind reference is not K-K edge', () => assert.ok(!graph('K', kIds).edges.includes('R11'))],
  ['no invented Goal relations', () => assert.equal(related('G01').length, 0)],
  ['no invented Goal graph edges', () => assert.equal(graph('G', ['G01']).edges.length, 0)],
  ['cross-kind related target available with relation identity', () => assert.ok(
    related('C01').some(r => r.id === 'R11' && byId.get(r.other).kind === 'K'))],
  ['material has two K links but no C link', () => {
    assert.equal(related('M02').filter(r => r.predicate === 'covers').length, 2);
    assert.ok(!related('M02').some(r => byId.get(r.other).kind === 'C'));
  }],
  ['selection outside graph does not create node', () =>
    assert.ok(!graph('K', kIds.filter(id => id !== 'K08')).nodes.includes('K08'))],
  ['subtypes do not split base kind mechanics', () => {
    assert.ok(graph('K', kIds).nodes.includes('K02'));
    assert.ok(graph('K', kIds).nodes.includes('K05'));
  }],
  ['selection does not mutate independent filter / context / focus', () => {
    assert.equal(selected.filter, 'exclude:K02');
    assert.equal(selected.graphFocus, 'K03');
    assert.equal(selected.explicitContext, 'scope-X');
    assert.equal(selected.selectedId, 'K02');
    assert.equal(related('C03').length, 0);
  }]
];
for (const [name, check] of checks) { check(); console.log('PASS ' + name); }
console.log('EX-PLD-11: ' + checks.length + '/' + checks.length + ' projection assertions passed; not a UI or semantic-validity test');
