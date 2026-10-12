import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { participantProjection } from './model.mjs';

const fixtureFile = fileURLToPath(new URL('../fixture.json', import.meta.url));
export async function loadPublicData() {
  return participantProjection(JSON.parse(await readFile(fixtureFile, 'utf8')));
}
const escape = x => String(x ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;').replaceAll('"', '&quot;');
export function makeHandout(data) {
  const items = (xs, fn) => `<ol>${xs.map(x => `<li>${fn(x)}</li>`).join('')}</ol>`;
  const contexts = items(data.scopes, s => `${escape(s.capability_id)} / ${escape(s.knowledge_id)}: ${escape(s.study_objective)} (${escape(s.necessity)})`);
  const notes = items(data.materials, m => `<strong>${escape(m.id)} · ${m.kind === 'card' ? 'Карточка' : 'Открытый сценарий'}</strong> — ${escape(m.knowledge_ids.join(', ') || 'Без связей')}<p>${escape(m.front)}</p><p><em>Ответ / ориентир:</em> ${escape(m.back)}</p>`);
  return `<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>Исходные учебные данные</title><style>body{font:16px/1.55 system-ui;max-width:920px;margin:3rem auto;padding:0 1rem;color:#202938}li{margin:1rem 0}h2{margin-top:2rem}a{color:#2159a2}@media print{body{margin:0}}</style></head><body><h1>Исходные учебные данные</h1><p>Материал предоставлен для исследования; полнота и правильность не гарантированы. Это справочный лист для работы обычными инструментами.</p><h2>Цель</h2><p>${escape(data.goal.id)} — ${escape(data.goal.title)}</p><p>${escape(data.goal.context)}</p><p>${escape(data.goal.scope_claim)}</p><p>Источник: <a href="${escape(data.source_reference)}">${escape(data.source_reference)}</a></p><h2>Контекстные описания</h2>${items(data.capabilities, c => `<strong>${escape(c.id)} — ${escape(c.title)}</strong>: ${escape(c.boundary)}`)}<h2>Темы и описания</h2>${items(data.knowledge, k => `<strong>${escape(k.id)} — ${escape(k.title)}</strong>: ${escape(k.summary)} (источник: ${escape(k.reference)})`)}<h2>Контекстные учебные цели</h2>${contexts}<h2>Предоставленные материалы</h2>${notes}<h2>Допущения и неизвестное</h2>${items(data.assumptions, escape)}</body></html>`;
}
