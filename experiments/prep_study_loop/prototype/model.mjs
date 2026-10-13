// Only allowlisted public fields cross the browser boundary. Task keys and relevance stay on disk.
const copy = (source, keys) => Object.fromEntries(keys.filter(k => Object.hasOwn(source, k)).map(k => [k, source[k]]));
export function participantProjection(fixture) {
  return {
    goal: copy(fixture.goal, ['id', 'title', 'context', 'scope_claim']),
    source_reference: fixture.source_reference,
    capabilities: fixture.capabilities.map(x => copy(x, ['id', 'title', 'boundary'])),
    knowledge: fixture.knowledge.map(x => copy(x, ['id', 'title', 'summary', 'reference'])),
    scopes: fixture.scopes.map(x => copy(x, ['capability_id', 'knowledge_id', 'study_objective', 'necessity'])),
    materials: fixture.materials.map(x => copy(x, ['id', 'kind', 'knowledge_ids', 'front', 'back'])),
    assumptions: [...fixture.assumptions]
  };
}

export const scopeKnowledge = (data, capabilityId) => capabilityId
  ? data.knowledge.filter(k => data.scopes.some(s => s.capability_id === capabilityId && s.knowledge_id === k.id))
  : data.knowledge;
export const contextsFor = (data, knowledgeId) => data.scopes.filter(s => s.knowledge_id === knowledgeId);
export const materialsFor = (data, knowledgeId) => data.materials.filter(m => m.knowledge_ids.includes(knowledgeId));
export function toggleSelection(ids, id) {
  const next = new Set(ids);
  if (next.has(id)) next.delete(id); else next.add(id);
  return next;
}
export function cardsForExport(data, ids) {
  return data.materials.filter(m => ids.has(m.id) && m.kind === 'card');
}
export function makeTsv(data, ids, contexts = new Map()) {
  const cards = cardsForExport(data, ids);
  if (!cards.length) throw new Error('Не выбраны карточки для экспорта');
  const field = value => {
    if (/[\t\r\n]/.test(value)) throw new Error('В поле встретился перенос строки или табуляция');
    return value;
  };
  const rows = cards.map(item => {
    const tags = [item.id.toLowerCase(), ...item.knowledge_ids.map(k => k.toLowerCase())];
    const capability = contexts.get(item.id);
    if (capability) tags.push(capability.toLowerCase());
    tags.push(data.goal.id.toLowerCase());
    return [field(item.front), field(item.back), field(tags.join(' '))].join('\t');
  });
  return ['#separator:Tab', '#columns:Front\tBack\tTags', '#tags:ex_pld_06', ...rows, ''].join('\n');
}
