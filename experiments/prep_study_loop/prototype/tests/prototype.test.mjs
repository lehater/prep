import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { loadPublicData, makeHandout } from '../data.mjs';
import { scopeKnowledge, contextsFor, materialsFor, makeTsv, cardsForExport, toggleSelection } from '../model.mjs';

const full = JSON.parse(await readFile(new URL('../../fixture.json', import.meta.url), 'utf8'));
const publicData = await loadPublicData();

test('public projection never sends research answer keys or relevance', () => {
  const json = JSON.stringify(publicData);
  for (const key of ['expected_cards','expected_knowledge','expected_shared_knowledge','exclude','relevance','tasks']) {
    assert.ok(!json.includes(`"${key}"`), key);
  }
  assert.equal(publicData.materials.length, full.materials.length);
  assert.equal(publicData.scopes.length, full.scopes.length);
  assert.equal(publicData.knowledge.length, full.knowledge.length);
  assert.equal(publicData.materials[3].back, full.materials[3].back);
});

test('direct Knowledge, both contexts, and different objectives remain available', () => {
  assert.equal(scopeKnowledge(publicData, null).length, 10);
  assert.equal(scopeKnowledge(publicData, 'C02').length, 7);
  const objectives = contextsFor(publicData, 'K04');
  assert.deepEqual(objectives.map(x => x.capability_id), ['C01','C02']);
  assert.notEqual(objectives[0].study_objective, objectives[1].study_objective);
  assert.ok(materialsFor(publicData, 'K04').some(x => x.id === 'M10'));
});

test('manual inclusion, removal and scenario separation', () => {
  let ids = new Set();
  ids = toggleSelection(ids, 'M11');
  assert.equal(cardsForExport(publicData, ids).length, 1); // off-goal not prefiltered
  ids = toggleSelection(ids, 'M11');
  ids = toggleSelection(ids, 'M10');
  assert.equal(cardsForExport(publicData, ids).length, 0);
  ids = toggleSelection(ids, 'M04');
  assert.deepEqual(cardsForExport(publicData, ids).map(x => x.id), ['M04']);
  assert.equal(toggleSelection(ids, 'M04').has('M04'), false);
});

test('controlled user-selected TSV agrees exactly with candidate fields', async () => {
  const ids = new Set(['M04','M05','M07','M08','M10']);
  const contexts = new Map([...ids].map(id => [id, 'C02']));
  const tsv = makeTsv(publicData, ids, contexts);
  assert.equal(tsv, await readFile(new URL('../../sample-anki.tsv', import.meta.url), 'utf8'));
  assert.equal(tsv.trim().split('\n').length, 7);
  assert.ok(!tsv.includes('M10'));
});

test('flat handout preserves source fields and scope objectives without answer keys', () => {
  const html = makeHandout(publicData);
  assert.ok(html.includes(publicData.materials[11].back));
  assert.ok(html.includes(publicData.scopes[8].study_objective));
  assert.ok(!html.includes('expected_cards'));
  assert.ok(!html.includes('off-goal'));
});
