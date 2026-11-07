// PratFlix · telas de prática (Biblioteca, Trilhas, Modelos de peça, Dicas)
// Ligado em app.js por initPratica(ctx). Usa os dados já carregados pelo app (courses, resources, tips).
import { MODELS } from './modelos.mjs';

const KIND = {
  'Roteiro': { key:'roteiro', icon:'route', plural:'Roteiros', hint:'Passo a passo para conduzir uma situação' },
  'Checklist': { key:'checklist', icon:'check', plural:'Checklists', hint:'Para conferir antes de agir' },
  'Modelo': { key:'modelo', icon:'edit', plural:'Modelos', hint:'Estruturas prontas para adaptar' },
  'Material complementar': { key:'extra', icon:'book', plural:'Complementares', hint:'Leituras e apoio às aulas' }
};
const kindOf = k => KIND[k] || KIND['Material complementar'];
const COVER_VARIANTS = { roteiro:['pv-v-grafite','pv-v-noite'], checklist:['pv-v-areia','pv-v-papel'], modelo:['pv-v-oliva','pv-v-papel'], extra:['pv-v-bronze','pv-v-noite'] };
const PHOTOS = ['office','desk','meeting','library','building'];
const hash = s => [...String(s)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
const minutesOf = t => Math.max(3, Math.round(String(t || '').split(/\s+/).length / 120) * 5 || 5);
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem('pf.v2.' + k)) ?? d } catch { return d } },
  set(k, v) { try { localStorage.setItem('pf.v2.' + k, JSON.stringify(v)) } catch {} }
};

// Trilhas: sequência sugerida por títulos de cursos (os que não existirem são ignorados).
const PATHS = [
  { id:'entrada', name:'Primeiros passos na advocacia', short:'Comece aqui', tone:'pv-v-areia', free:true,
    text:'A base para começar com clareza: conhecer a plataforma, conduzir o primeiro atendimento e organizar documentos, tarefas e comunicação.',
    outcome:'Atender, registrar e organizar um caso do início ao fim.',
    steps:['Boas-vindas ao PratFlix','O seu primeiro atendimento','Um escritório organizado desde o início'] },
  { id:'civel', name:'Prática cível e família', short:'Cível', tone:'pv-v-oliva',
    text:'Da demanda cível simples às questões de família e consumo, com a via extrajudicial como alternativa.',
    outcome:'Montar o mapa de atuação de uma demanda cível, da análise ao cumprimento.',
    steps:['Processo Civil','Direito de Família na prática','Direito do Consumidor na prática','Advocacia Notarial e Extrajudicial'] },
  { id:'criminal', name:'Criminal e audiências', short:'Criminal', tone:'pv-v-noite',
    text:'Atendimento criminal, preparo para audiência e uma fala clara diante do juiz.',
    outcome:'Organizar uma defesa inicial e conduzir uma audiência com roteiro.',
    steps:['Prática Criminal: delegacia e defesa','Atuação em Audiências','Oratória para a Advocacia'] },
  { id:'publico', name:'Público e constitucional', short:'Público', tone:'pv-v-grafite',
    text:'Do problema concreto à tutela constitucional, contra a Fazenda Pública e na via administrativa.',
    outcome:'Escolher a via adequada contra o poder público e organizar o caso.',
    steps:['Constitucional aplicado','Direito Público e Fazenda Pública na prática','Direito Administrativo na prática'] },
  { id:'trabalho', name:'Trabalho e previdência', short:'Trabalho', tone:'pv-v-papel',
    text:'Atendimento trabalhista e previdenciário, com análise documental e requerimentos.',
    outcome:'Analisar documentos e estruturar um pedido trabalhista ou previdenciário.',
    steps:['Prática trabalhista essencial','Direito Previdenciário na prática'] },
  { id:'escritorio', name:'Escritório, marketing e IA', short:'Negócio', tone:'pv-v-bronze',
    text:'Operação, preço, presença digital dentro da ética e inteligência artificial na rotina.',
    outcome:'Ter uma operação organizada, um preço justificado e uma presença profissional.',
    steps:['Gestão de Escritório','Marketing jurídico','Construindo o sistema do seu escritório','Produzindo vídeos com Claude','IA e Direito Digital'] },
  { id:'nichos', name:'Novas frentes de atuação', short:'Nichos', tone:'pv-v-noite',
    text:'Áreas com demanda crescente para quem quer se diferenciar no mercado.',
    outcome:'Conhecer quatro nichos e escolher um para aprofundar.',
    steps:['Direito Bancário na prática','Direito Médico e da Saúde na prática','Registro de Marcas','Compliance'] }
];

// Complementos das dicas já cadastradas. Dicas novas podem trazer as linhas
// "Em vez de:", "Prefira:" e "Faça hoje:" no próprio texto (admin > Dicas).
const TIP_EXTRAS = {
  'Troque “ver o caso” por uma próxima ação': { no:'Ver o caso da Maria', yes:'Montar a linha do tempo do caso da Maria até quinta', today:'Reescreva as três primeiras tarefas da sua lista começando por um verbo.' },
  'Antes de responder, confirme o que você entendeu': { no:'“Entendi, vou analisar.”', yes:'“Então o contrato venceu em março e o aviso chegou em abril. É isso?”', today:'No próximo atendimento, termine o relato com um resumo de três frases.' },
  'Dê nome às versões dos seus documentos': { no:'peticao_final_FINAL2.docx', yes:'2026-11-07_Silva_inicial_v3-revisada.docx', today:'Renomeie os arquivos de um processo ativo com um padrão único.' },
  'Termine a reunião com um combinado': { no:'“Qualquer coisa a gente se fala.”', yes:'“Você me envia o contrato até sexta e eu retorno na terça.”', today:'Na próxima reunião, encerre dizendo quem faz o quê e até quando.' }
};
const TIP_TONES = ['pv-v-areia', 'pv-v-noite', 'pv-v-oliva', 'pv-v-bronze', 'pv-v-papel', 'pv-v-grafite'];

export function initPratica(ctx) {
  const { E, I, toast, imageSrc } = ctx;
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const courseByTitle = t => ctx.courses().find(c => c.title === t && (ctx.canAdmin() || c.status !== 'draft'));
  const after = fn => setTimeout(fn, 0);
  async function copy(text, ok = 'Copiado.') { try { await navigator.clipboard.writeText(text); toast(ok) } catch { toast('Não foi possível copiar. Selecione o texto e copie.') } }
  const header = (eyebrow, h, p, side = '') => `<div class="pv-head"><div><span class="pv-eyebrow">${eyebrow}</span><h1 class="pv-h1">${h}</h1><p class="pv-lead">${p}</p></div>${side}</div>`;

  /* ================= BIBLIOTECA ================= */
  let libKind = 'Todos', libQuery = '';
  const locked = r => r.access === 'premium' && !ctx.canAdmin() && ctx.tier() !== 'premium';
  function cover(r, size = '') {
    const k = kindOf(r.kind), h = hash(r.id || r.title), variants = COVER_VARIANTS[k.key];
    const photo = k.key === 'roteiro' || (k.key === 'extra' && h % 2) ? PHOTOS[h % PHOTOS.length] : '';
    const v = photo ? 'pv-v-foto' : variants[h % variants.length];
    return `<div class="pv-cover ${v} ${size}">${photo ? `<img class="pv-cover-ph" src="${imageSrc(photo)}" alt="" loading="lazy"><span class="pv-cover-shade"></span>` : ''}
      <span class="pv-cover-mark" aria-hidden="true">${I(k.icon)}</span>
      <span class="pv-cover-top"><span>${I(k.icon)}${E(r.kind || 'Material')}</span><span>${minutesOf(r.body)} min</span></span>
      <span class="pv-cover-title${r.title.length > 26 ? ' is-long' : r.title.length > 16 ? ' is-mid' : ''}">${E(r.title)}</span>
      <span class="pv-cover-foot"><span>${E(r.area || '')}</span>${locked(r) ? `<span class="pv-tag pv-tag-lock">${I('lock')}Premium</span>` : r.access === 'premium' ? '<span class="pv-tag pv-tag-gold">Premium</span>' : '<span class="pv-tag pv-tag-free">Grátis</span>'}</span></div>`;
  }
  function bookCard(r) {
    return `<button class="pv-book" data-pf-res="${E(r.id)}" aria-label="Abrir ${E(r.title)}">${cover(r)}
      <span class="pv-book-name">${E(r.title)}</span><span class="pv-book-meta">${E(r.kind || 'Material')} · ${E(r.area || 'Prática')}</span></button>`;
  }
  function libList() {
    const q = libQuery.toLowerCase();
    return ctx.resources().filter(r => (libKind === 'Todos' || (libKind === 'Gratuitos' ? r.access !== 'premium' : r.kind === libKind)) && (!q || (r.title + ' ' + r.area + ' ' + r.kind + ' ' + r.body).toLowerCase().includes(q)));
  }
  function shelves() {
    const list = libList();
    if (!list.length) return `<div class="pv-empty">${I('search')}<strong>Nenhum material encontrado</strong><p>Tente outra palavra ou limpe os filtros.</p></div>`;
    if (libKind !== 'Todos' || libQuery) return `<div class="pv-shelf">${list.map(bookCard).join('')}</div>`;
    const groups = [...new Set(list.map(r => r.kind || 'Material complementar'))];
    return groups.map(g => { const items = list.filter(r => (r.kind || 'Material complementar') === g); const k = kindOf(g);
      return `<section class="pv-shelf-group"><div class="pv-shelf-head"><span class="pv-shelf-icon">${I(k.icon)}</span><div><h2>${E(k.plural)}</h2><p>${E(k.hint)}</p></div><span class="pv-count">${items.length} ${items.length === 1 ? 'material' : 'materiais'}</span></div><div class="pv-shelf">${items.map(bookCard).join('')}</div></section>` }).join('');
  }
  function library() {
    if (!ctx.user()) return header('Biblioteca de prática', 'Materiais para levar a aula <em>para a sua mesa.</em>', 'Roteiros, checklists e modelos para usar no dia a dia do escritório.') + `<div class="pv-empty">${I('book')}<strong>Sua biblioteca começa com uma conta gratuita</strong><p>Entre para abrir os primeiros materiais e acompanhar o que você já aplicou.</p><button class="btn" data-action="signup">Criar conta gratuita</button></div>`;
    const all = ctx.resources(), featured = all.find(r => !locked(r)) || all[0];
    const kinds = ['Todos', 'Gratuitos', ...new Set(all.map(r => r.kind).filter(Boolean))];
    const done = all.filter(r => resProgress(r).done && resProgress(r).total && resProgress(r).done === resProgress(r).total).length;
    const fan = all.filter(r => r !== featured).slice(0, 2);
    return `<section class="pv-lib-hero">
      <div class="pv-lib-copy"><span class="pv-eyebrow">Biblioteca de prática</span><h1 class="pv-h1">Materiais para levar a aula <em>para a sua mesa.</em></h1>
        <p class="pv-lead">Roteiros, checklists e modelos para usar antes, durante e depois de cada atendimento. Abra um material, marque cada etapa e baixe o PDF.</p>
        <div class="pv-stats"><div><strong>${all.length}</strong><span>materiais</span></div><div><strong>${all.filter(r => r.access !== 'premium').length}</strong><span>gratuitos</span></div><div><strong>${done}</strong><span>concluídos por você</span></div></div>
        ${featured ? `<div class="pv-actions"><button class="btn pv-btn-lg" data-pf-res="${E(featured.id)}">${I('play')}Começar por “${E(featured.title)}”</button></div>` : ''}</div>
      ${featured ? `<div class="pv-fan" aria-hidden="true">${fan.map((r, i) => `<div class="pv-fan-card pv-fan-${i + 1}">${cover(r)}</div>`).join('')}<div class="pv-fan-card pv-fan-0">${cover(featured)}</div></div>` : ''}
    </section>
    <div class="pv-toolbar"><div class="pv-chips" role="group" aria-label="Filtrar materiais">${kinds.map(k => `<button class="pv-chip" data-pf-kind="${E(k)}" aria-pressed="${k === libKind}">${E(k === 'Todos' ? 'Todos' : k === 'Gratuitos' ? 'Gratuitos' : kindOf(k).plural)}</button>`).join('')}</div>
      <label class="pv-search">${I('search')}<span class="sr-only">Buscar na biblioteca</span><input id="pv-lib-q" type="search" placeholder="Buscar material ou tema" value="${E(libQuery)}"></label></div>
    <div id="pv-shelves">${shelves()}</div>`;
  }

  /* ================= MATERIAL ABERTO ================= */
  function parseBody(text) {
    const blocks = String(text || '').trim().split(/\n\s*\n/).filter(Boolean);
    const out = { intro:'', steps:[], notes:[], task:null };
    blocks.forEach((block, i) => {
      const [first, ...rest] = block.split('\n').map(x => x.trim()).filter(Boolean);
      const numbered = first.match(/^(\d+)\s*[.)·-]\s*(.+)/);
      const bullets = [first, ...rest].filter(x => /^([-•*]|\[ ?\]|☐)\s*/.test(x));
      const task = first.match(/^(sua tarefa|sua missão|entrega|na prática|exercício|próximo passo|critério de conclusão|agora é com você)\s*:?\s*(.*)$/i);
      const note = first.match(/^(exemplo|caso fictício|caso para treinar|compare|confira depois|atenção|referência|antes de usar)\s*:\s*(.*)$/i);
      if (numbered) out.steps.push({ title: numbered[2], text: rest.filter(x => !/^([-•*]|\[ ?\]|☐)\s*/.test(x)), items: rest.filter(x => /^([-•*]|\[ ?\]|☐)\s*/.test(x)).map(x => x.replace(/^([-•*]|\[ ?\]|☐)\s*/, '')) });
      else if (task) out.task = { label: task[1], text: [task[2], ...rest].filter(Boolean) };
      else if (note) out.notes.push({ label: note[1], text: [note[2], ...rest].filter(Boolean) });
      else if (bullets.length === [first, ...rest].length) out.steps.push(...bullets.map(b => ({ title: b.replace(/^([-•*]|\[ ?\]|☐)\s*/, ''), text: [], items: [] })));
      else if (i === 0 && !out.intro) out.intro = [first, ...rest].join(' ');
      else out.notes.push({ label: '', text: [first, ...rest] });
    });
    return out;
  }
  const resKey = r => 'res.' + (r.id || r.title);
  function resProgress(r) { const p = parseBody(r.body); const total = p.steps.length + p.steps.reduce((a, s) => a + s.items.length, 0); const saved = store.get(resKey(r), {}); return { total, done: (saved.done || []).length } }
  const noteIcon = l => /caso/i.test(l) ? 'users' : /aten|antes/i.test(l) ? 'shield' : /exemplo|compare/i.test(l) ? 'spark' : 'book';
  function openResource(id) {
    const r = ctx.resources().find(x => x.id === id); if (!r) return;
    if (locked(r)) { ctx.close?.(); ctx.route('premium'); return }
    const p = parseBody(r.body), saved = store.get(resKey(r), {}), done = new Set(saved.done || []);
    const k = kindOf(r.kind), mins = minutesOf(r.body);
    const stepHTML = p.steps.map((s, i) => `<li class="pv-step" data-pf-step="${i}">
        <label class="pv-step-check"><input type="checkbox" data-pf-chk="s${i}" ${done.has('s' + i) ? 'checked' : ''}><span class="pv-box">${I('check')}</span><span class="sr-only">Marcar etapa ${i + 1} como feita</span></label>
        <div class="pv-step-body"><span class="pv-step-n">Etapa ${i + 1} de ${p.steps.length}</span><h3>${E(s.title)}</h3>${s.text.map(t => `<p>${E(t)}</p>`).join('')}
          ${s.items.length ? `<ul class="pv-sub">${s.items.map((t, j) => `<li><label><input type="checkbox" data-pf-chk="s${i}.${j}" ${done.has(`s${i}.${j}`) ? 'checked' : ''}><span class="pv-box pv-box-sm">${I('check')}</span><span>${E(t)}</span></label></li>`).join('')}</ul>` : ''}</div></li>`).join('');
    ctx.modal(`<div class="pv-res" data-pf-resid="${E(r.id)}">
      <div class="pv-res-head">${cover(r, 'pv-cover-sm')}
        <div class="pv-res-title"><span class="pv-eyebrow">Biblioteca · ${E(r.kind || 'Material')}</span><h2>${E(r.title)}</h2>${p.intro ? `<p class="pv-lead">${E(p.intro)}</p>` : ''}
          <div class="pv-res-meta"><span>${I(k.icon)}${E(r.kind || 'Material')}</span><span>${I('grid')}${E(r.area || 'Prática')}</span><span>${I('clock')}${mins} min</span>${p.steps.length ? `<span>${I('check')}${p.steps.length} etapas</span>` : ''}</div>
          <div class="pv-actions"><button class="btn" data-download="${E(r.id)}">${I('download')}${ctx.safeURL(r.file_url) ? 'Baixar o PDF' : 'Baixar o material'}</button><button class="btn secondary" data-print="${E(r.id)}">${I('file')}Imprimir</button><button class="btn secondary" data-pf-copyres="${E(r.id)}">${I('edit')}Copiar o passo a passo</button></div></div>
      </div>
      ${p.steps.length ? `<div class="pv-progress" id="pv-progress"><div class="pv-ring"><svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="27" class="pv-ring-bg"/><circle cx="32" cy="32" r="27" class="pv-ring-fg" stroke-dasharray="169.6" stroke-dashoffset="169.6"/></svg><span id="pv-pct">0%</span></div><div><strong id="pv-prog-t">Vamos começar</strong><p id="pv-prog-s"></p></div><button class="pv-link" data-pf-reset="${E(r.id)}">Recomeçar</button></div>` : ''}
      <div class="pv-res-grid">
        <ol class="pv-steps">${stepHTML || `<li class="pv-step"><div class="pv-step-body">${ctx.renderReading ? ctx.renderReading(r.body) : `<p>${E(r.body)}</p>`}</div></li>`}</ol>
        <div class="pv-res-side">
          ${p.notes.map(n => `<div class="pv-note"><span class="pv-note-icon">${I(noteIcon(n.label))}</span><div>${n.label ? `<strong>${E(n.label)}</strong>` : ''}${n.text.map(t => `<p>${E(t)}</p>`).join('')}</div></div>`).join('')}
          ${p.task ? `<div class="pv-task"><span class="pv-eyebrow">Agora é com você</span><h3>${E(p.task.label.charAt(0).toUpperCase() + p.task.label.slice(1))}</h3>${p.task.text.map(t => `<p>${E(t)}</p>`).join('')}
            <label class="pv-field"><span>Suas anotações (ficam salvas neste aparelho)</span><textarea id="pv-notes" rows="6" placeholder="Escreva aqui usando um caso fictício.">${E(saved.notes || '')}</textarea></label></div>` : ''}
        </div>
      </div>
      <div class="pv-done" id="pv-done" hidden>${I('check')}<div><strong>Material concluído.</strong><p>Bom trabalho. Que tal levar isso para a prática hoje?</p></div><button class="btn" data-action="library">Ver outros materiais</button></div>
    </div>`, true);
    $('.modal')?.classList.add('pv-modal');
    updateRes(r);
  }
  function updateRes(r) {
    const boxes = $$('[data-pf-chk]'); if (!boxes.length) return;
    const done = boxes.filter(b => b.checked).map(b => b.dataset.pfChk);
    const saved = store.get(resKey(r), {}); store.set(resKey(r), { ...saved, done });
    const pct = Math.round(done.length / boxes.length * 100);
    const fg = $('.pv-ring-fg'); if (fg) fg.style.strokeDashoffset = 169.6 * (1 - done.length / boxes.length);
    $('#pv-pct').textContent = pct + '%';
    $('#pv-prog-t').textContent = pct === 100 ? 'Tudo feito!' : pct >= 50 ? 'Mais da metade feita' : done.length ? 'Bom começo' : 'Vamos começar';
    $('#pv-prog-s').textContent = `${done.length} de ${boxes.length} ${boxes.length === 1 ? 'item concluído' : 'itens concluídos'}`;
    $('#pv-progress')?.classList.toggle('is-done', pct === 100);
    $$('.pv-step').forEach(li => { const own = li.querySelectorAll('[data-pf-chk]'); li.classList.toggle('is-done', own.length && [...own].every(b => b.checked)) });
    const d = $('#pv-done'); if (d) d.hidden = pct !== 100;
  }

  /* ================= TRILHAS ================= */
  let pathSel = store.get('path', 'entrada');
  const pathCourses = p => p.steps.map(courseByTitle).filter(Boolean);
  function paths() {
    const list = PATHS.map(p => ({ ...p, courses: pathCourses(p) })).filter(p => p.courses.length);
    const sel = list.find(p => p.id === pathSel) || list[0];
    if (!sel) return header('Trilhas práticas', 'Menos dúvida. <em>Mais próximo passo.</em>', 'As trilhas aparecem aqui assim que os cursos forem publicados.');
    const avail = sel.courses.filter(c => c.status === 'available').length;
    const totalCourses = list.reduce((a, p) => a + p.courses.length, 0);
    return header('Trilhas práticas', 'Menos dúvida. <em>Mais próximo passo.</em>', 'Cada trilha organiza os cursos numa sequência, do básico ao mais específico. Escolha uma área e siga o percurso no seu ritmo.',
      `<div class="pv-stats pv-stats-side"><div><strong>${list.length}</strong><span>trilhas</span></div><div><strong>${totalCourses}</strong><span>cursos</span></div></div>`) +
    `<div class="pv-path-picker" role="tablist" aria-label="Escolher trilha">${list.map(p => { const imgs = p.courses.slice(0, 3);
      return `<button class="pv-path-pick ${p.tone}" role="tab" data-pf-path="${p.id}" aria-selected="${p.id === sel.id}">
        <span class="pv-mosaic">${imgs.map(c => `<img src="${imageSrc(c.image)}" alt="" loading="lazy">`).join('')}</span>
        <span class="pv-path-pick-body"><span class="pv-tag ${p.free ? 'pv-tag-free' : 'pv-tag-gold'}">${p.free ? 'Gratuita' : 'Premium'}</span><strong>${E(p.name)}</strong><small>${p.courses.length} cursos · ${p.courses.filter(c => c.status === 'available').length ? p.courses.filter(c => c.status === 'available').length + ' liberados' : 'em produção'}</small></span></button>` }).join('')}</div>
    <section class="pv-route" aria-live="polite">
      <div class="pv-route-hero"><img src="${imageSrc(sel.courses[0].image)}" alt="" class="pv-route-bg">
        <div class="pv-route-copy"><span class="pv-tag ${sel.free ? 'pv-tag-free' : 'pv-tag-gold'}">${E(sel.short)} · ${sel.free ? 'Gratuita' : 'Premium'}</span><h2>${E(sel.name)}</h2><p>${E(sel.text)}</p>
          <div class="pv-outcome">${I('target')}<span><b>Ao final:</b> ${E(sel.outcome)}</span></div></div>
        <div class="pv-route-stats"><div><strong>${sel.courses.length}</strong><span>cursos</span></div><div><strong>${avail}</strong><span>liberados</span></div><div class="pv-route-bar" role="img" aria-label="${avail} de ${sel.courses.length} cursos liberados"><i style="width:${Math.round(avail / sel.courses.length * 100)}%"></i></div></div>
      </div>
      <ol class="pv-stations">${sel.courses.map((c, i) => { const ok = c.status === 'available', designed = String(c.image).endsWith('-capa.png'), prof = (String(c.subtitle).match(/^(Prof[a]?\.[^·]+)·/) || [])[1];
        const sub = String(c.subtitle).replace(/^Prof[a]?\.[^·]+·\s*/, '');
        return `<li class="pv-station ${ok ? 'is-ok' : ''}"><span class="pv-node">${ok ? I('check') : i + 1}</span>
          <button class="pv-station-img" data-course="${c.id}" aria-label="Conhecer ${E(c.title)}"><img src="${imageSrc(c.image)}" alt="" loading="lazy" ${designed ? 'class="is-designed"' : ''}>${designed ? '' : `<span class="pv-station-cover">${E(c.title)}</span>`}</button>
          <div class="pv-station-body"><span class="pv-step-n">Etapa ${i + 1} · ${E(c.area)}</span><h3>${E(c.title)}</h3>${prof ? `<span class="pv-prof">${E(prof.trim())}</span>` : ''}<p>${E(sub)}</p>
            <div class="pv-station-foot">${ok ? '<span class="pv-tag pv-tag-ok">Disponível</span>' : '<span class="pv-tag pv-tag-soon">Em produção</span>'}<span class="pv-tag">${c.access === 'free' ? 'Gratuito' : 'Premium'}</span>
              <button class="btn ${ok ? '' : 'secondary'}" data-course="${c.id}">${ok ? I('play') + 'Começar' : 'Ver detalhes'}</button><button class="pv-icon-btn" data-save="${c.id}" aria-label="Adicionar à minha lista">${I('plus')}</button></div></div></li>` }).join('')}</ol>
    </section>`;
  }

  /* ================= MODELOS DE PEÇA ================= */
  let modelArea = 'Todas', modelQ = '';
  const modelsCourse = () => courseByTitle('Modelos de peças');
  function docs() {
    const q = modelQ.toLowerCase(), list = MODELS.filter(m => (modelArea === 'Todas' || m.area === modelArea) && (!q || (m.t + m.area + m.when + m.base).toLowerCase().includes(q)));
    if (!list.length) return `<div class="pv-empty">${I('search')}<strong>Nenhuma peça encontrada</strong><p>Tente outra palavra ou outra área.</p></div>`;
    return list.map(m => `<button class="pv-doc" data-pf-model="${m.id}" aria-label="Ver a estrutura de ${E(m.t)}">
      <span class="pv-paper"><span class="pv-tag pv-tag-ink">${E(m.area)}</span><span class="pv-paper-addr">EXCELENTÍSSIMO(A) SENHOR(A) JUIZ(A)…</span><span class="pv-paper-t">${E(m.t)}</span>
        ${m.parts.slice(1, 4).map(p => `<span class="pv-paper-h">${E(p[0])}</span><span class="pv-ln"></span><span class="pv-ln pv-ln-s"></span>`).join('')}</span>
      <span class="pv-doc-name">${E(m.t)}</span><span class="pv-doc-when">${E(m.when)}</span><span class="pv-doc-base">${E(m.base)}</span></button>`).join('');
  }
  function models() {
    const c = modelsCourse(), ready = c?.status === 'available';
    const areas = ['Todas', ...new Set(MODELS.map(m => m.area))];
    return `<section class="pv-models-hero"><div><span class="pv-eyebrow">Novo · ${ready ? 'Disponível' : 'Em produção'}</span><h1 class="pv-h1">Modelos de peça <em>para entender, adaptar e revisar.</em></h1>
      <p class="pv-lead">Cada modelo mostra a estrutura da peça com a base legal, o que muda em cada caso e um checklist para conferir antes de protocolar.${ready ? '' : ' Os arquivos editáveis chegam com o módulo Modelos de peças, apresentado por Líbero Filho.'}</p>
      <div class="pv-actions">${c ? `<button class="btn pv-btn-lg" data-course="${c.id}">${I('play')}${ready ? 'Assistir à apresentação' : 'Conhecer o módulo'}</button>` : ''}<span class="pv-tag ${ready ? 'pv-tag-ok' : 'pv-tag-soon'}">${MODELS.length} estruturas · ${ready ? 'liberado' : 'em produção'}</span></div></div>
      <ol class="pv-method"><li><b>Entenda</b><span>Cada parte da peça explicada, com o artigo que a fundamenta.</span></li><li><b>Adapte</b><span>Os campos que mudam em cada caso aparecem destacados.</span></li><li><b>Revise</b><span>Um checklist final para conferir antes de protocolar.</span></li></ol></section>
    <div class="pv-toolbar"><div class="pv-chips" role="group" aria-label="Filtrar por área">${areas.map(a => `<button class="pv-chip" data-pf-area="${E(a)}" aria-pressed="${a === modelArea}">${E(a)}</button>`).join('')}</div>
      <label class="pv-search">${I('search')}<span class="sr-only">Buscar modelo</span><input id="pv-model-q" type="search" placeholder="Buscar peça, artigo ou área" value="${E(modelQ)}"></label></div>
    <div class="pv-docs" id="pv-docs">${docs()}</div>`;
  }
  function openModel(id) {
    const m = MODELS.find(x => x.id === id); if (!m) return; const c = modelsCourse();
    const rv = new Set(store.get('model.' + id, []));
    ctx.modal(`<div class="pv-model">
      <div class="pv-a4"><div class="pv-a4-top"><span>PRATFLIX · MODELOS DE PEÇA</span><span>PRÉVIA DA ESTRUTURA</span></div><h3>${E(m.t)}</h3>
        <ol>${m.parts.map(p => `<li><b>${E(p[0])}</b><span>${p[1]}</span></li>`).join('')}</ol>
        <p class="pv-a4-fine">Base: ${E(m.base)}. Estrutura de referência para estudo. Confira a legislação e a jurisprudência atualizadas e adapte ao caso concreto.</p></div>
      <div class="pv-model-side"><span class="pv-eyebrow">${E(m.area)} · ${E(m.base)}</span><h2>${E(m.t)}</h2><p class="pv-lead">${E(m.when)}</p>
        <div class="pv-seg" role="tablist"><button role="tab" aria-selected="true" data-pf-seg="adapt">Como adaptar</button><button role="tab" aria-selected="false" data-pf-seg="review">Revisão final</button></div>
        <ol class="pv-adapt" id="pv-seg-adapt">${m.adapt.map((a, i) => `<li><span>${i + 1}</span><div><b>${E(a[0])}</b><p>${E(a[1])}</p></div></li>`).join('')}</ol>
        <ul class="pv-review" id="pv-seg-review" hidden>${m.review.map((t, i) => `<li><label><input type="checkbox" data-pf-rev="${id}" value="${i}" ${rv.has(String(i)) ? 'checked' : ''}><span class="pv-box">${I('check')}</span><span>${E(t)}</span></label></li>`).join('')}</ul>
        ${c && c.status !== 'available' ? `<div class="pv-soon">${I('clock')}<span>O arquivo editável deste modelo entra no Premium quando o módulo Modelos de peças for publicado.</span></div>` : ''}
        <div class="pv-actions"><button class="btn" data-pf-copymodel="${id}">${I('edit')}Copiar a estrutura</button>${c ? `<button class="btn secondary" data-course="${c.id}">Ver o módulo</button>` : ''}</div></div></div>`, true);
    $('.modal')?.classList.add('pv-modal');
  }

  /* ================= DICAS ================= */
  let tipIdx = 0, tipArea = 'Todas', tipTimer = null, tipPaused = false, touchX = null;
  const savedTips = () => new Set(store.get('tips.saved', []));
  const applied = () => new Set(store.get('tips.applied', []));
  function tipData(t) {
    const lines = String(t.body || '').split('\n'), pick = re => { const l = lines.find(x => re.test(x)); return l ? l.replace(re, '').trim() : '' };
    const body = lines.filter(x => !/^(em vez de|prefira|faça hoje)\s*:/i.test(x)).join(' ').trim();
    const ex = TIP_EXTRAS[t.title] || {};
    return { ...t, text: body, no: pick(/^em vez de\s*:/i) || ex.no, yes: pick(/^prefira\s*:/i) || ex.yes, today: pick(/^faça hoje\s*:/i) || ex.today };
  }
  const tipList = () => ctx.tips().map((t, i) => ({ ...tipData(t), i, tone: TIP_TONES[i % TIP_TONES.length] })).filter(t => tipArea === 'Todas' || t.area === tipArea);
  function tips() {
    const all = ctx.tips(), areas = ['Todas', ...new Set(all.map(t => t.area))];
    return header('Dicas de prática', 'Uma dica por dia. <em>Uma mudança por vez.</em>', 'Ideias curtas sobre atendimento, organização e carreira, cada uma com um exemplo e uma tarefa para fazer hoje. Toque nas laterais do cartão ou deslize para passar.',
      `<div class="pv-stats pv-stats-side"><div><strong id="pv-applied-n">${applied().size}</strong><span>aplicadas por você</span></div><div><strong>${all.length}</strong><span>dicas</span></div></div>`) +
    `<div class="pv-chips" role="group" aria-label="Filtrar dicas" style="margin-bottom:26px">${areas.map(a => `<button class="pv-chip" data-pf-tiparea="${E(a)}" aria-pressed="${a === tipArea}">${E(a)}</button>`).join('')}</div>
    <div class="pv-tips"><div id="pv-story"></div><div class="pv-tips-side"><h2>Todas as dicas</h2><p>Salve as que você quer aplicar esta semana.</p><div class="pv-tip-list" id="pv-tip-list"></div></div></div>`;
  }
  function drawTip(dir = 0) {
    const host = $('#pv-story'); if (!host) return stopTip();
    const list = tipList(); if (!list.length) { host.innerHTML = ''; return }
    let pos = list.findIndex(t => t.i === tipIdx); if (pos < 0) pos = 0; const t = list[pos]; tipIdx = t.i;
    const sv = savedTips(), ap = applied();
    host.innerHTML = `<article class="pv-story ${t.tone} ${tipPaused ? 'is-paused' : ''} ${dir > 0 ? 'in-right' : dir < 0 ? 'in-left' : ''}" aria-roledescription="dica" aria-label="Dica ${pos + 1} de ${list.length}">
      <span class="pv-story-ring pv-r1"></span><span class="pv-story-ring pv-r2"></span>
      <div class="pv-bars">${list.map((x, k) => `<button class="${k < pos ? 'is-seen' : k === pos ? 'is-now' : ''}" data-pf-tip="${x.i}" aria-label="Ir para a dica ${k + 1}"><i></i></button>`).join('')}</div>
      <div class="pv-story-top"><span class="pv-story-who"><span class="pv-story-av">P▸</span><span>Dica PratFlix<small>${pos + 1} de ${list.length} · ${E(t.area)}</small></span></span>
        <span class="pv-story-tools"><button class="pv-round" data-pf-tippause aria-label="${tipPaused ? 'Continuar' : 'Pausar'}">${I(tipPaused ? 'play' : 'pause')}</button><button class="pv-round" data-pf-tipsave="${t.i}" aria-pressed="${sv.has(t.i)}" aria-label="${sv.has(t.i) ? 'Remover dos salvos' : 'Salvar dica'}">${I(sv.has(t.i) ? 'check' : 'bookmark')}</button></span></div>
      <button class="pv-tap pv-tap-l" data-pf-tipstep="-1" aria-label="Dica anterior"></button><button class="pv-tap pv-tap-r" data-pf-tipstep="1" aria-label="Próxima dica"></button>
      <div class="pv-story-body"><span class="pv-story-area">${E(t.area)}</span><h2>${E(t.title)}</h2><p>${E(t.text)}</p>
        ${t.no && t.yes ? `<div class="pv-swap"><div><small>Em vez de</small>${E(t.no)}</div><div class="pv-swap-yes"><small>Prefira</small>${E(t.yes)}</div></div>` : ''}</div>
      <div class="pv-story-foot">${t.today ? `<div class="pv-today">${I('target')}<span><b>Faça hoje:</b> ${E(t.today)}</span></div>` : ''}
        <button class="btn ${ap.has(t.i) ? 'secondary' : ''}" data-pf-tipapply="${t.i}">${I('check')}${ap.has(t.i) ? 'Aplicada' : 'Apliquei esta dica'}</button>
        <span class="pv-story-nav"><button class="pv-round" data-pf-tipcopy="${t.i}" aria-label="Copiar dica">${I('file')}</button><button class="pv-round" data-pf-tipstep="-1" aria-label="Anterior">${I('arrow')}</button><button class="pv-round pv-next" data-pf-tipstep="1" aria-label="Próxima">${I('arrow')}</button></span></div></article>`;
    $('#pv-tip-list').innerHTML = list.map(x => `<button class="pv-tip-item" data-pf-tip="${x.i}" aria-current="${x.i === tipIdx}"><span class="pv-tip-thumb ${x.tone}">${String(x.i + 1).padStart(2, '0')}</span><span class="pv-tip-txt"><small>${E(x.area)}</small><b>${E(x.title)}</b></span><span class="pv-tip-flags">${ap.has(x.i) ? I('check') : ''}${sv.has(x.i) ? I('bookmark') : ''}</span></button>`).join('');
    const story = host.firstElementChild;
    story.addEventListener('mouseenter', () => { if (!tipPaused) { clearTimeout(tipTimer); story.classList.add('is-paused') } });
    story.addEventListener('mouseleave', () => { if (!tipPaused) { story.classList.remove('is-paused'); armTip() } });
    story.addEventListener('touchstart', e => { touchX = e.touches[0].clientX }, { passive: true });
    story.addEventListener('touchend', e => { if (touchX == null) return; const dx = e.changedTouches[0].clientX - touchX; touchX = null; if (Math.abs(dx) > 50) stepTip(dx < 0 ? 1 : -1) });
    armTip();
  }
  function armTip() { clearTimeout(tipTimer); if (tipPaused || reduce()) { $('.pv-story')?.classList.add('is-paused'); return } tipTimer = setTimeout(() => $('#pv-story') && !$('.modal-overlay') ? stepTip(1) : stopTip(), 9000) }
  function stopTip() { clearTimeout(tipTimer) }
  function stepTip(d) { const list = tipList(); if (!list.length) return; const pos = Math.max(0, list.findIndex(t => t.i === tipIdx)); tipIdx = list[(pos + d + list.length) % list.length].i; drawTip(d) }

  /* ================= EVENTOS ================= */
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-pf-res],[data-pf-kind],[data-pf-reset],[data-pf-copyres],[data-pf-path],[data-pf-area],[data-pf-model],[data-pf-seg],[data-pf-copymodel],[data-pf-tip],[data-pf-tipstep],[data-pf-tippause],[data-pf-tipsave],[data-pf-tipapply],[data-pf-tipcopy],[data-pf-tiparea]');
    if (!el) return; const d = el.dataset;
    if (d.pfRes) openResource(d.pfRes);
    if (d.pfKind) { libKind = d.pfKind; $$('[data-pf-kind]').forEach(b => b.setAttribute('aria-pressed', b === el)); $('#pv-shelves').innerHTML = shelves() }
    if (d.pfReset) { $$('[data-pf-chk]').forEach(b => b.checked = false); updateRes(ctx.resources().find(r => r.id === d.pfReset)) }
    if (d.pfCopyres) { const r = ctx.resources().find(x => x.id === d.pfCopyres), p = parseBody(r.body); copy(`${r.title.toUpperCase()}\nPratFlix · Biblioteca\n\n` + p.steps.map((s, i) => `[ ] ${i + 1}. ${s.title}` + (s.items.length ? '\n' + s.items.map(x => `    [ ] ${x}`).join('\n') : '')).join('\n') + (p.task ? `\n\n${p.task.label.toUpperCase()}: ${p.task.text.join(' ')}` : ''), 'Passo a passo copiado.') }
    if (d.pfPath) { pathSel = d.pfPath; store.set('path', pathSel); const y = window.scrollY; Promise.resolve(ctx.route('paths')).then(() => { window.scrollTo({ top: y }); $('.pv-route')?.scrollIntoView({ behavior: reduce() ? 'auto' : 'smooth', block: 'nearest' }) }) }
    if (d.pfArea) { modelArea = d.pfArea; $$('[data-pf-area]').forEach(b => b.setAttribute('aria-pressed', b === el)); $('#pv-docs').innerHTML = docs() }
    if (d.pfModel) openModel(d.pfModel);
    if (d.pfSeg) { $$('[data-pf-seg]').forEach(b => b.setAttribute('aria-selected', b === el)); $('#pv-seg-adapt').hidden = d.pfSeg !== 'adapt'; $('#pv-seg-review').hidden = d.pfSeg !== 'review' }
    if (d.pfCopymodel) { const m = MODELS.find(x => x.id === d.pfCopymodel); copy(`${m.t.toUpperCase()}\n(${m.base})\n\n` + m.parts.map((p, i) => `${i + 1}. ${p[0].toUpperCase()}\n${p[1].replace(/<[^>]+>/g, '')}`).join('\n\n'), 'Estrutura copiada.') }
    if (d.pfTip) { const n = +d.pfTip; const dir = n > tipIdx ? 1 : -1; tipIdx = n; drawTip(dir) }
    if (d.pfTipstep) stepTip(+d.pfTipstep);
    if (d.pfTippause !== undefined) { tipPaused = !tipPaused; drawTip(); toast(tipPaused ? 'Dicas pausadas.' : 'Dicas em reprodução.') }
    if (d.pfTipsave) { const s = savedTips(), i = +d.pfTipsave; s.has(i) ? s.delete(i) : s.add(i); store.set('tips.saved', [...s]); toast(s.has(i) ? 'Dica salva.' : 'Dica removida dos salvos.'); drawTip() }
    if (d.pfTipapply) { const s = applied(), i = +d.pfTipapply; s.has(i) ? s.delete(i) : s.add(i); store.set('tips.applied', [...s]); const n = $('#pv-applied-n'); if (n) n.textContent = s.size; toast(s.has(i) ? 'Boa! Mais uma dica na prática.' : 'Marcação desfeita.'); drawTip() }
    if (d.pfTipcopy) { const t = tipData(ctx.tips()[+d.pfTipcopy]); copy(`${t.title}\n\n${t.text}${t.today ? `\n\nFaça hoje: ${t.today}` : ''}\n\nPratFlix · Dicas de prática`, 'Dica copiada.') }
    if (d.pfTiparea) { tipArea = d.pfTiparea; $$('[data-pf-tiparea]').forEach(b => b.setAttribute('aria-pressed', b === el)); tipIdx = tipList()[0]?.i ?? 0; drawTip() }
  });
  document.addEventListener('change', e => {
    if (e.target.matches('[data-pf-chk]')) { const id = e.target.closest('[data-pf-resid]')?.dataset.pfResid; updateRes(ctx.resources().find(r => r.id === id)) }
    if (e.target.matches('[data-pf-rev]')) store.set('model.' + e.target.dataset.pfRev, $$(`[data-pf-rev="${e.target.dataset.pfRev}"]`).filter(b => b.checked).map(b => b.value));
  });
  document.addEventListener('input', e => {
    if (e.target.id === 'pv-lib-q') { libQuery = e.target.value; $('#pv-shelves').innerHTML = shelves() }
    if (e.target.id === 'pv-model-q') { modelQ = e.target.value; $('#pv-docs').innerHTML = docs() }
    if (e.target.id === 'pv-notes') { const id = e.target.closest('[data-pf-resid]')?.dataset.pfResid, r = ctx.resources().find(x => x.id === id); if (r) store.set(resKey(r), { ...store.get(resKey(r), {}), notes: e.target.value }) }
  });
  document.addEventListener('keydown', e => {
    if (!$('#pv-story') || $('.modal-overlay') || /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName)) return;
    if (e.key === 'ArrowRight') stepTip(1); if (e.key === 'ArrowLeft') stepTip(-1);
  });

  return {
    library, paths, models, openResource, openModel,
    tips: () => { after(() => drawTip()); return tips() }
  };
}
