import { scopeKnowledge, contextsFor, materialsFor, toggleSelection, cardsForExport, makeTsv } from './model.mjs';

const arm = new URLSearchParams(location.search).get('arm');
const root = document.getElementById('app');
const supported = ['A', 'B', 'C'];
if (!supported.includes(arm)) {
  root.replaceChildren(element('main', 'error', 'Для открытия прототипа используйте адрес с параметром ?arm=A, ?arm=B или ?arm=C.'));
} else {
  boot().catch(() => root.replaceChildren(element('main', 'error', 'Не удалось загрузить учебные данные. Проверьте локальный сервер.')));
}

function element(tag, cls = '', text = '') {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  node.textContent = text;
  return node;
}
function append(parent, ...nodes) { for (const node of nodes) parent.append(node); return parent; }
function action(text, callback, cls = '') {
  const btn = element('button', cls, text);
  btn.type = 'button'; btn.addEventListener('click', callback);
  return btn;
}
function paragraph(text, cls = '') { return element('p', cls, text); }
function heading(text, tag = 'h2') { return element(tag, '', text); }
function identity(prefix, text) { return element('span', 'identity', `${prefix} · ${text}`); }

async function boot() {
  const response = await fetch('/participant.json', { cache: 'no-store' });
  if (!response.ok) throw new Error('Missing participant data');
  const data = await response.json();
  const selectable = arm !== 'A';
  const navigator = arm !== 'C';
  const state = { capability: null, knowledge: null, tab: 'knowledge', material: null,
    cardIds: new Set(), scenarioIds: new Set(), selectionContexts: new Map() };

  function chooseCapability(id) {
    state.capability = id;
    if (state.knowledge && !scopeKnowledge(data, id).some(k => k.id === state.knowledge)) state.knowledge = null;
    state.tab = 'knowledge'; render();
  }
  function chooseKnowledge(id) { state.knowledge = id; state.tab = 'knowledge'; render(); }
  function chooseMaterial(id) { state.material = id; state.tab = 'materials'; render(); }
  function toggle(m) {
    if (m.kind === 'card') {
      const selected = !state.cardIds.has(m.id);
      state.cardIds = toggleSelection(state.cardIds, m.id);
      if (selected) state.selectionContexts.set(m.id, state.capability);
      else state.selectionContexts.delete(m.id);
    } else {
      state.scenarioIds = toggleSelection(state.scenarioIds, m.id);
    }
    render();
  }
  function download() {
    const payload = makeTsv(data, state.cardIds, state.selectionContexts);
    const blob = new Blob(['\ufeff', payload], { type: 'text/tab-separated-values;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = `ex-pld-06-${arm.toLowerCase()}-cards.tsv`;
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }

  function renderHeader() {
    const header = element('header', 'header');
    const head = element('div');
    append(head, element('div', 'eyebrow', 'УЧЕБНЫЕ ДАННЫЕ · ИССЛЕДОВАТЕЛЬСКИЙ ПРОТОТИП'), heading(data.goal.title, 'h1'));
    append(head, paragraph('Этот набор предоставлен для проверки способа работы с данными. Он не претендует на полноту и не оценивает ваши знания.', 'subtle'));
    header.append(head);
    if (navigator) {
      const nav = element('nav', 'tabs'); nav.setAttribute('aria-label', 'Разделы данных');
      for (const [name, label] of [['knowledge', 'Область знаний'], ['materials', 'Материалы']]) {
        const b = action(label, () => { state.tab = name; render(); }, state.tab === name ? 'active' : '');
        b.setAttribute('aria-current', state.tab === name ? 'page' : 'false'); nav.append(b);
      }
      header.append(nav);
    }
    return header;
  }
  function renderContext() {
    const box = element('section', 'panel context');
    append(box, heading('Цель и границы', 'h2'), identity(data.goal.id, 'Контекст подготовки'),
      paragraph(data.goal.context), paragraph(data.goal.scope_claim, 'notice'));
    const a = element('a', 'source', 'Исходная ссылка на RFC 9111');
    a.href = data.source_reference; a.target = '_blank'; a.rel = 'noopener noreferrer'; box.append(a);
    append(box, heading('Допущения', 'h3'));
    const ul = element('ul', 'assumptions'); data.assumptions.forEach(x => ul.append(element('li', '', x))); box.append(ul);
    return box;
  }
  function renderNavigator() {
    const side = element('aside', 'sidebar');
    side.append(renderContext());
    const lenses = element('section', 'panel'); append(lenses, heading('Контекстные описания', 'h2'), paragraph('Необязательная перспектива для просмотра тем. Описания не означают измеренные способности.', 'subtle'));
    const all = action('Все темы без фильтра', () => chooseCapability(null), `lens ${!state.capability ? 'chosen' : ''}`);
    all.setAttribute('aria-pressed', String(!state.capability)); lenses.append(all);
    for (const c of data.capabilities) {
      const button = action(`${c.id} · ${c.title}`, () => chooseCapability(c.id), `lens ${c.id === state.capability ? 'chosen' : ''}`);
      button.setAttribute('aria-pressed', String(c.id === state.capability)); lenses.append(button);
      append(lenses, paragraph(c.boundary, 'hint'));
    }
    side.append(lenses);
    return side;
  }
  function renderKnowledge() {
    const area = element('section', 'workspace');
    const top = element('div', 'section-heading');
    append(top, heading('Темы знаний'), paragraph('Выберите любую тему напрямую. Связи с описаниями и учебные цели показаны в карточке темы.', 'subtle')); area.append(top);
    const columns = element('div', 'knowledge-layout');
    const list = element('div', 'topic-list');
    const listTitle = element('div', 'list-title', state.capability ? `Темы в ${state.capability} · ${scopeKnowledge(data, state.capability).length}` : `Все темы · ${data.knowledge.length}`);
    list.append(listTitle);
    for (const k of scopeKnowledge(data, state.capability)) {
      const btn = action(`${k.id}   ${k.title}`, () => chooseKnowledge(k.id), `topic ${state.knowledge === k.id ? 'chosen' : ''}`);
      btn.setAttribute('aria-pressed', String(state.knowledge === k.id)); list.append(btn);
    }
    const detail = element('article', 'panel detail');
    const k = data.knowledge.find(k => k.id === state.knowledge);
    if (!k) {
      append(detail, heading('Изучите состав набора', 'h2'), paragraph('Темы можно открывать без предварительного выбора контекстного описания.'),
        paragraph('Выберите тему слева или перейдите к материалам. Наличие связи показывает заявленную контекстную учебную цель, а не обязательность темы для профессии.', 'subtle'));
    } else {
      append(detail, identity(k.id, 'Знание'), heading(k.title, 'h2'), paragraph(k.summary));
      const ref = element('a', 'source', 'Источник описания'); ref.href = k.reference; ref.target = '_blank'; ref.rel = 'noopener noreferrer'; detail.append(ref);
      append(detail, heading('Контекстные учебные цели', 'h3'));
      for (const s of contextsFor(data, k.id)) {
        const c = data.capabilities.find(x => x.id === s.capability_id);
        const line = element('div', 'relation');
        append(line, action(`${c.id}: ${c.title}`, () => chooseCapability(c.id), 'link-action'), paragraph(s.study_objective), paragraph('Связь задана в предоставленном наборе, не является универсальным требованием.', 'hint'));
        detail.append(line);
      }
      append(detail, heading('Связанные материалы', 'h3'));
      const related = materialsFor(data, k.id);
      if (!related.length) detail.append(paragraph('Материалов с этой ссылкой нет.', 'subtle'));
      for (const m of related) detail.append(action(`${m.id} · ${m.kind === 'card' ? 'Карточка' : 'Сценарий'}: ${m.front}`, () => chooseMaterial(m.id), 'relation-link'));
    }
    append(columns, list, detail); area.append(columns); return area;
  }
  function renderMaterials() {
    const area = element('section', 'workspace');
    append(area, heading(navigator ? 'Предоставленные материалы' : 'Плоский список материалов'), paragraph('Материалы показаны полностью. Решение о пригодности каждого элемента принимает пользователь; отбор по правильным ответам не выполняется.', 'subtle'));
    const layout = element('div', selectable ? 'materials-layout' : 'materials-only');
    const collection = element('div', 'material-list');
    for (const m of data.materials) {
      const card = element('article', `material panel ${state.material === m.id ? 'highlight' : ''}`);
      append(card, identity(m.id, m.kind === 'card' ? 'Карточка для повторения' : 'Открытый теоретический сценарий'), heading(m.front, 'h3'));
      append(card, element('div', 'response-label', m.kind === 'card' ? 'Ответ' : 'Ориентир для разбора'), paragraph(m.back));
      const links = element('div', 'chips');
      if (!m.knowledge_ids.length) links.append(element('span', 'chip', 'Без указанных связей с темами'));
      for (const kid of m.knowledge_ids) {
        const k = data.knowledge.find(k => k.id === kid);
        if (navigator) links.append(action(`${kid} · ${k?.title ?? ''}`, () => chooseKnowledge(kid), 'chip clickable'));
        else links.append(element('span', 'chip', `${kid} · ${k?.title ?? ''}`));
      }
      card.append(links);
      if (selectable) {
        const checked = m.kind === 'card' ? state.cardIds.has(m.id) : state.scenarioIds.has(m.id);
        const pick = action(checked ? 'Убрать из выбранного' : (m.kind === 'card' ? 'Добавить карточку' : 'Отметить для внешнего разбора'), () => toggle(m), `select-btn ${checked ? 'selected' : ''}`);
        pick.setAttribute('aria-pressed', String(checked)); card.append(pick);
        if (m.kind !== 'card') card.append(paragraph('Сценарий остаётся вне TSV; его можно отметить отдельно для самостоятельной работы.', 'hint'));
      }
      collection.append(card);
    }
    layout.append(collection);
    if (selectable) layout.append(renderPacket());
    area.append(layout); return area;
  }
  function renderPacket() {
    const packet = element('aside', 'panel packet');
    append(packet, heading('Выбранное', 'h2'), paragraph('Карточки: ' + state.cardIds.size + ' · сценарии отдельно: ' + state.scenarioIds.size, 'subtle'));
    if (!state.cardIds.size && !state.scenarioIds.size) packet.append(paragraph('Пока ничего не выбрано. Нет предустановленной правильной подборки.', 'hint'));
    for (const item of data.materials.filter(x => state.cardIds.has(x.id) || state.scenarioIds.has(x.id))) {
      const line = element('div', 'selected-item');
      append(line, paragraph(`${item.id} · ${item.front}`), action('Убрать', () => toggle(item), 'remove-btn')); packet.append(line);
    }
    const exportBtn = action(`Скачать TSV (${cardsForExport(data, state.cardIds).length})`, download, 'primary');
    exportBtn.disabled = cardsForExport(data, state.cardIds).length === 0;
    packet.append(exportBtn);
    packet.append(paragraph('В TSV попадут только выбранные карточки: Front, Back, Tags. Отмеченные сценарии не преобразуются в карточки.', 'hint'));
    return packet;
  }
  function renderFlat() {
    const container = element('div', 'flat');
    container.append(renderMaterials());
    const reference = element('details', 'panel flat-reference');
    const summary = element('summary', '', 'Справочные данные: цель, темы, контексты, связи и неизвестное');
    reference.append(summary);
    reference.append(renderContext());
    append(reference, heading('Контекстные описания', 'h3'));
    for (const c of data.capabilities) append(reference, paragraph(`${c.id} · ${c.title} — ${c.boundary}`));
    append(reference, heading('Темы знаний', 'h3'));
    for (const k of data.knowledge) append(reference, paragraph(`${k.id} · ${k.title}: ${k.summary} (${k.reference})`));
    append(reference, heading('Связи и учебные цели', 'h3'));
    for (const s of data.scopes) append(reference, paragraph(`${s.capability_id} / ${s.knowledge_id}: ${s.study_objective} (${s.necessity})`));
    container.append(reference); return container;
  }
  function render() {
    const shell = element('div', 'shell'); shell.append(renderHeader());
    const main = element('main', navigator ? 'main-layout' : 'flat-layout');
    if (navigator) append(main, renderNavigator(), state.tab === 'knowledge' ? renderKnowledge() : renderMaterials());
    else main.append(renderFlat());
    shell.append(main);
    shell.append(element('footer', 'footer', 'Синтетический пользовательский набор · техническая подготовка эксперимента · без оценки результата обучения'));
    root.replaceChildren(shell);
  }
  render();
}
