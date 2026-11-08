/* Pauta · estúdio de conteúdo jurídico (PratFlix) · v2
   App de página única, sem servidor. Várias contas (marcas), cada uma com plano de 6 meses,
   peças, métricas e identidade. Dados no navegador (localStorage), com exportação. */
(() => {
const P = window.PAUTA, AREAS = window.AREAS, TD = window.TENDENCIAS, COLS = { editorial:window.ESTUDIO, classica:window.MODELOS };
const AREA = Object.fromEntries(AREAS.map(a => [a.id, a]));
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const E = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const KEY0 = 'pauta.v2', KEY1 = 'pauta.v1', EMK = 'pauta.email';
let EMAIL = (() => { try { return localStorage.getItem(EMK) || '' } catch { return '' } })();
const chave = () => KEY0 + ':' + EMAIL.toLowerCase();
const STATUS = [
  { id:'ideia', nome:'Ideia', chip:'IDEIA' }, { id:'roteiro', nome:'Roteiro', chip:'ROTEIRO' }, { id:'producao', nome:'Gravar / criar', chip:'EM PRODUÇÃO' },
  { id:'edicao', nome:'Em revisão', chip:'EM REVISÃO' }, { id:'agendado', nome:'Programado', chip:'PROGRAMADO' }, { id:'publicado', nome:'Publicado', chip:'PUBLICADO' }
];
const STI = Object.fromEntries(STATUS.map((s, i) => [s.id, i]));
const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MESES = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
const CORES = ['#E0457B', '#1D5BF0', '#6D3FE0', '#E8590C', '#16A34A', '#0F766E', '#111827'];

/* ---------- ícones ---------- */
const IP = {
  home:'M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z', cal:'M3 5h18v16H3z M7 2v6 M17 2v6 M3 10h18', layers:'M12 3l9 5-9 5-9-5z M3 13l9 5 9-5',
  play:'M5 4h14v16H5z M10 9l5 3-5 3z', image:'M3 5h18v14H3z M3 16l5-5 4 4 3-3 6 6 M15 9h.01', board:'M3 4h5v16H3z M10 4h5v10h-5z M17 4h4v13h-4z', bulb:'M9 18h6 M9 21h6 M8 14a7 7 0 1 1 8 0l-1 2H9z',
  pen:'M14 4l6 6 M3 21l5-1L21 7l-5-5L3 15z', spark:'M12 2v5 M12 17v5 M2 12h5 M17 12h5 M5 5l3.5 3.5 M15.5 15.5L19 19 M19 5l-3.5 3.5 M8.5 15.5L5 19', chart:'M4 20V4 M4 20h17 M8 16v-4 M13 16V8 M18 16V3',
  trophy:'M8 21h8 M12 17v4 M7 4h10v5a5 5 0 0 1-10 0z M17 6h3v2a3 3 0 0 1-3 3 M7 6H4v2a3 3 0 0 0 3 3', send:'M22 2L11 13 M22 2l-7 20-4-9-9-4z', user:'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  palette:'M12 22a10 10 0 1 1 10-10c0 3-3 3-5 3h-2a2 2 0 0 0-1 3.7A2 2 0 0 1 12 22z M7.5 10.5h.01 M12 7h.01 M16.5 10.5h.01', cam:'M3 7h4l2-3h6l2 3h4v13H3z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  shield:'M12 2L3 6v6c0 5 9 10 9 10s9-5 9-10V6z M8 12l3 3 5-6', grid:'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z', users:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M22 21v-2a4 4 0 0 0-3-3.9 M16 3.1a4 4 0 0 1 0 7.8',
  gear:'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M4 12h2 M18 12h2 M12 4v2 M12 18v2 M6.3 6.3l1.4 1.4 M16.3 16.3l1.4 1.4 M6.3 17.7l1.4-1.4 M16.3 7.7l1.4-1.4',
  check:'M5 12l4 4L19 6', plus:'M12 4v16 M4 12h16', star:'M12 2l3 6 7 1-5 5 1 8-6-4-6 4 1-8-5-5 7-1z', copy:'M8 8h12v12H8z M16 8V4H4v12h4', close:'M6 6l12 12 M6 18L18 6',
  left:'M15 18l-6-6 6-6', right:'M9 18l6-6-6-6', search:'M21 21l-6-6 M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0', flame:'M12 22c4 0 7-3 7-7 0-4-3-6-4-10-2 2-3 4-3 6-1-1-2-2-2-4-2 2-5 5-5 8 0 4 3 7 7 7z',
  bolt:'M13 2L4 14h7l-1 8 9-12h-7z', target:'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0 M18 12a6 6 0 1 1-12 0 6 6 0 0 1 12 0 M12 12h.01', flag:'M5 21V4 M5 4h11l-2 4 2 4H5', eye:'M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
  download:'M12 3v12 M7 10l5 5 5-5 M3 16v5h18v-5', upload:'M12 21V9 M7 14l5-5 5 5 M3 8V3h18v5', trash:'M4 7h16 M9 7V4h6v3 M6 7l1 14h10l1-14', refresh:'M21 12a9 9 0 1 1-3-6.7L21 8 M21 3v5h-5',
  lock:'M5 11h14v10H5z M8 11V7a4 4 0 0 1 8 0v4', menu:'M3 6h18 M3 12h18 M3 18h18', history:'M3 12a9 9 0 1 0 3-6.7L3 8 M3 3v5h5 M12 7v5l3 2',
  heart:'M12 21s-8-5-8-11a5 5 0 0 1 8-3 5 5 0 0 1 8 3c0 6-8 11-8 11z', tree:'M12 22v-6 M12 16l-6-6h3L5 5h4L12 2l3 3h4l-4 5h3z', bag:'M5 8h14l-1 13H6z M9 8V6a3 3 0 0 1 6 0v2', briefcase:'M3 7h18v13H3z M9 7V4h6v3 M3 12h18',
  scale:'M12 3v18 M5 21h14 M4 8h16 M6 8l-3 6a3 3 0 0 0 6 0z M18 8l-3 6a3 3 0 0 0 6 0z', doc:'M5 2h9l5 5v15H5z M14 2v6h5 M8 13h8 M8 17h8', card:'M2 6h20v13H2z M2 10h20 M6 15h4',
  coin:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M15 9a3 3 0 0 0-3-1.5c-2 0-3 1-3 2s1 1.6 3 2 3 1 3 2-1 2-3 2a3 3 0 0 1-3-1.5 M12 6v1.5 M12 16.5V18', building:'M4 21V3h11v18 M15 9h5v12 M8 7h3 M8 11h3 M8 15h3',
  at:'M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-4 7.5', columns:'M3 21h18 M4 10h16 M12 3l9 5H3z M6 10v8 M10 10v8 M14 10v8 M18 10v8', stamp:'M9 3h6l-1 8h-4z M4 14h16v4H4z M6 21h12',
  cap:'M2 9l10-5 10 5-10 5z M6 11v5c3 2 9 2 12 0v-5 M22 9v6', mic:'M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3z M5 11a7 7 0 0 0 14 0 M12 18v3'
};
const I = (n, c = 'ic') => `<svg class="${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${IP[n] || IP.doc}"/></svg>`;

/* ---------- estado ---------- */
const uid = () => Math.random().toString(36).slice(2, 10);
const contaNova = (cor = CORES[0]) => ({ id:uid(), cor, perfil:null, posts:[], tarefas:{}, favoritas:[], metricas:[], identidade:{ paleta:'marca', fonte:'figtree' }, missoes:{}, passos:{}, nivelVisto:0, conqVistas:[], flags:{} });
function carregar() {
  try { const s = JSON.parse(localStorage.getItem(chave())); if (s && s.v === 2 && s.contas?.length) return s } catch {}
  try { const o = JSON.parse(localStorage.getItem(KEY1)); if (o?.perfil) { const c = { ...contaNova(), ...o, identidade:{ paleta:'marca', fonte:'figtree' } }; delete c.v; c.posts.forEach(p => p.versoes ||= []); return { v:2, contas:[c], atual:c.id } } } catch {}
  const c = contaNova(); return { v:2, contas:[c], atual:c.id };
}
let S = carregar(), C = S.contas.find(c => c.id === S.atual) || S.contas[0];
function salvar() { if (!EMAIL) return; try { localStorage.setItem(chave(), JSON.stringify(S)) } catch (e) { toast('O navegador está sem espaço. Remova fotos ou exporte um backup.', 'close') } }
let rota = 'inicio', toastT = null;
function toast(t, ic = 'check') { const el = $('#toast'); el.innerHTML = `${I(ic)}<span>${E(t)}</span>`; el.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('on'), 2800) }
async function copiar(t, ok = 'Copiado.') { try { await navigator.clipboard.writeText(t); toast(ok, 'copy') } catch { toast('Não foi possível copiar. Selecione o texto e copie.', 'close') } }
function aplicaCor() { document.documentElement.style.setProperty('--brand', C.cor || CORES[0]) }

/* ---------- datas ---------- */
const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const dataDe = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d) };
const somaDias = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x };
const segunda = d => { const x = new Date(d); const w = (x.getDay() + 6) % 7; x.setDate(x.getDate() - w); x.setHours(0, 0, 0, 0); return x };
const hoje = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d };
const fmt = (s, o = { day:'2-digit', month:'short' }) => new Intl.DateTimeFormat('pt-BR', o).format(typeof s === 'string' ? dataDe(s) : s).replace(/\./g, '');
const fmt2 = d => fmt(d, { day:'2-digit', month:'long' });
const num = n => Number(n || 0).toLocaleString('pt-BR');
const semanaDe = d => Math.max(0, Math.floor((dataDe(d) - segunda(dataDe(C.perfil.inicio))) / 864e5 / 7));
const semanaAtual = () => C.perfil ? Math.max(0, Math.min(25, Math.floor((hoje() - segunda(dataDe(C.perfil.inicio))) / 864e5 / 7))) : 0;

/* ---------- ideias ---------- */
const fillV = (s, a, x) => s.replace(/\{t\}/g, x.t).replace(/\{a\}/g, a.nome).replace(/\{q\}/g, x.q.replace(/\?$/, '') + '?');
function ideia(id) {
  if (id.startsWith('v:')) { const [, i, ar, ti] = id.split(':'), v = TD.VIRAIS[+i], a = AREA[ar] || AREA[C.perfil?.principal] || AREAS[0], x = a.temas[+ti || 0] || a.temas[0];
    return { id, titulo:fillV(v.titulo, a, x), formato:v.f, pilar:v.p, area:a.id, viral:v, ...x, gancho:fillV(v.titulo, a, x) } }
  if (id.startsWith('va:')) { const [, ar, i] = id.split(':'), a = AREA[ar], z = TD.AREA_VIRAIS[ar][+i];
    return { id, titulo:z[0], formato:z[1], pilar:z[2], area:ar, t:z[0].toLowerCase(), q:'', m:'', gancho:z[0] } }
  if (id.startsWith('g:')) { const g = P.IDEIAS_GERAIS[+id.slice(2)], a = AREA[C.perfil?.principal] || AREAS[0];
    return { id, titulo:g.t.replace('{area}', a.nome.toLowerCase()), formato:g.f, pilar:g.p, area:a.id, geral:true, t:a.nome.toLowerCase(), q:'', m:'' } }
  if (id.startsWith('d:')) { const [, i, ar] = id.split(':'), d = P.DATAS[+i], a = AREA[ar] || AREA[C.perfil?.principal] || AREAS[0];
    return { id, titulo:`${d.t}: o que você precisa saber`, formato:'carrossel', pilar:'educar', area:a.id, data:true, t:d.t.toLowerCase(), q:'', m:'' } }
  const [ar, ti, mi] = id.split(':'), a = AREA[ar], x = a.temas[+ti], mo = P.MODELOS_IDEIA.find(m => m.id === mi);
  return { id, titulo:mo.titulo(x), gancho:mo.gancho(x), formato:mo.formato, pilar:mo.pilar, area:ar, modelo:mi, ...x };
}
function todasIdeias(areas) {
  const out = [];
  areas.forEach(ar => (TD.AREA_VIRAIS[ar] || []).forEach((_, i) => out.push(`va:${ar}:${i}`)));
  areas.forEach(ar => AREA[ar].temas.forEach((x, ti) => P.MODELOS_IDEIA.forEach(mo => out.push(`${ar}:${ti}:${mo.id}`))));
  P.IDEIAS_GERAIS.forEach((g, i) => out.push('g:' + i));
  return out;
}

/* ---------- gerador do plano ---------- */
const DIAS_FREQ = { 2:[2, 4], 3:[1, 3, 5], 4:[1, 2, 4, 5], 5:[1, 2, 3, 4, 5] };
const novoPost = o => ({ id:'p' + uid(), status:'ideia', roteiro:'', legenda:'', notas:'', check:[], versoes:[], num:null, ...o });
function gerarPlano(pf, manter = []) {
  const ini = segunda(dataDe(pf.inicio)), areas = pf.areas, posts = [];
  const filas = Object.fromEntries(['carrossel', 'reels', 'post', 'stories', 'live', 'youtube'].map(f => [f, []]));
  const ordemAreas = areas.length > 1 ? [pf.principal, ...areas.filter(a => a !== pf.principal), pf.principal] : areas;
  const maxT = Math.max(...areas.map(a => AREA[a].temas.length));
  for (let ti = 0; ti < maxT; ti++) ordemAreas.forEach(ar => { if (!AREA[ar].temas[ti]) return;
    P.MODELOS_IDEIA.forEach(mo => { const k = `${ar}:${ti}:${mo.id}`; if (!filas[mo.formato].includes(k)) filas[mo.formato].push(k) }) });
  for (const f in filas) { const porModelo = {}; filas[f].forEach(k => { const m = k.split(':')[2]; (porModelo[m] ||= []).push(k) });
    const ms = Object.values(porModelo), r = []; for (let i = 0; r.length < filas[f].length; i++) ms.forEach(l => l[i] && r.push(l[i])); filas[f] = r }
  const usados = new Set(manter.map(p => p.ideia));
  const pega = f => { const fila = filas[f] || filas.carrossel; let k; while ((k = fila.shift()) && usados.has(k)); if (!k) k = filas.carrossel.shift() || `g:${(posts.length % (P.IDEIAS_GERAIS.length - 1)) + 1}`; usados.add(k); return k };
  const gerais = P.IDEIAS_GERAIS.map((g, i) => i).filter(i => i > 0); let gi = 0, nPost = 0, liveFeita = false;
  const dias = (pf.dias && pf.dias.length ? pf.dias : DIAS_FREQ[pf.freq]).slice().sort();
  for (let w = 0; w < 26; w++) {
    const sem = P.SEMANAS[w], fase = P.FASES[sem.f - 1], seg = somaDias(ini, w * 7);
    dias.forEach((dw, k) => {
      const data = iso(somaDias(seg, (dw + 6) % 7));
      if (manter.some(p => p.data === data)) return;
      let fmt = fase.mix[(k + w) % fase.mix.length], id;
      if (fmt === 'live') { if (liveFeita || sem.f !== 5) fmt = 'carrossel'; else liveFeita = true }
      if (w === 0 && k === 0) { id = 'g:0'; fmt = null }
      else if (fmt === 'post' && (nPost++ % 2)) { id = 'g:' + gerais[gi++ % gerais.length]; fmt = null }
      else if (k === dias.length - 1 && w % 3 === 1 && sem.f !== 4) { id = 'g:' + gerais[gi++ % gerais.length]; fmt = null }
      else id = pega(fmt);
      const dt = P.DATAS.findIndex(d => [new Date(seg.getFullYear(), d.m - 1, d.d), new Date(seg.getFullYear() + 1, d.m - 1, d.d)].some(x => x >= seg && x < somaDias(seg, 7)) && (!d.areas.length || d.areas.some(a => areas.includes(a))));
      if (dt >= 0 && k === 0 && w > 0) { const d = P.DATAS[dt]; id = `d:${dt}:${d.areas.find(a => areas.includes(a)) || pf.principal}` }
      const ide = ideia(id); let formato = fmt || ide.formato;
      if (id.startsWith('d:')) formato = 'carrossel';
      if (formato === 'reels' && pf.video === 'nao') formato = 'reels-texto';
      if (formato === 'reels' && pf.video === 'asvezes' && (w + k) % 2) formato = 'reels-texto';
      if (formato === 'live' && pf.video === 'nao') formato = 'carrossel';
      posts.push(novoPost({ data, semana:w, formato, pilar:ide.pilar, area:ide.area, ideia:id, titulo:ide.titulo }));
    });
  }
  return [...manter, ...posts].sort((a, b) => a.data.localeCompare(b.data));
}

/* ---------- roteiros ---------- */
const CTA = (a, i = 0) => P.CTAS[i % P.CTAS.length].replace('{area}', a.nome.toLowerCase()).replace('{palavra}', (a.destaques[0] || 'GUIA').toUpperCase());
function roteiro(post) {
  const x = ideia(post.ideia), a = AREA[post.area] || AREAS[0], t = x.t || x.titulo, f = post.formato, mod = x.modelo, gancho = x.gancho || x.titulo;
  if (x.viral) { const F = P.FORMATOS[f] || P.FORMATOS.carrossel, ex = x.viral.est.replace(/\[situação\]|\[procedimento\]|\[processo\]/g, t);
    return `${F.nome.toUpperCase()} · ${F.dur}\nFORMATO VIRAL · ${x.viral.nome}\n\nTEMA\n${x.titulo}\n\n${ex}\n\nPOR QUE FUNCIONA\n• ${x.viral.porque}\n• Sinal que este formato puxa: ${x.viral.sinal.toLowerCase()}.\n\nCUIDADO\n• Regra geral e caso fictício; nada de promessa de resultado.` }
  if (post.ideia === 'g:0') { const pf = C.perfil || {}, car = f === 'carrossel';
    return `${car ? 'CARROSSEL · 6 slides' : 'POST ÚNICO + LEGENDA'}\n\nSLIDE 1 · CAPA\nPrazer, ${pf.nome || '[seu nome]'}\n${pf.areas ? pf.areas.map(z => AREA[z].nome).join(', ') : '[suas áreas]'} em ${pf.cidade || '[cidade]'}\n\n${car ? 'SLIDE 2 · QUEM SOU\n' : ''}[Formação, tempo de advocacia e número da OAB]\n\n${car ? 'SLIDE 3 · COM O QUE TRABALHO\n' : ''}[As áreas e os assuntos que você mais atende, em linguagem simples]\n\n${car ? 'SLIDE 4 · PARA QUEM FALO\n' : ''}[Quem vai se beneficiar do perfil]\n\n${car ? 'SLIDE 5 · O QUE VOCÊ VAI ENCONTRAR AQUI\n' : ''}[As séries e os temas: dúvidas, mitos, passo a passo]\n\n${car ? 'SLIDE 6 · CONVITE\n' : ''}Siga para acompanhar e comente de onde você é.\n\nDEPOIS DE PUBLICAR\n• Fixe este post no topo do perfil.\n• Repita a apresentação nos stories e salve no destaque “Sobre mim”.` }
  if (f === 'carrossel') {
    let miolo;
    if (mod === 'passo') miolo = `SLIDE 2 · QUANDO ISSO ACONTECE\n[Quem passa por ${t} e por que precisa saber o caminho]\n\nSLIDE 3 · PASSO 1\n[Primeira ação] — [documento ou lugar]\n\nSLIDE 4 · PASSO 2\n[Segunda ação] — [prazo, se houver]\n\nSLIDE 5 · PASSO 3\n[Terceira ação] — [o que pode dar errado]\n\nSLIDE 6 · PASSO 4\n[Última ação e resultado esperado]\n\nSLIDE 7 · DOCUMENTOS\n[Lista curta dos documentos mais importantes]`;
    else if (mod === 'erros') miolo = `SLIDE 2 · POR QUE ISSO IMPORTA\n[O prejuízo de errar em ${t}]\n\nSLIDE 3 · ERRO 1\n[O erro] → Faça assim: [o certo]\n\nSLIDE 4 · ERRO 2\n[O erro] → Faça assim: [o certo]\n\nSLIDE 5 · ERRO 3\n[O erro] → Faça assim: [o certo]\n\nSLIDE 6 · BÔNUS\n[Uma dica prática que quase ninguém conhece]\n\nSLIDE 7 · O QUE DIZ A LEI\n[Artigo e lei, em linguagem simples]`;
    else if (mod === 'pergunta') miolo = `SLIDE 2 · A DÚVIDA\n“${x.q}”\n[Por que essa dúvida é tão comum]\n\nSLIDE 3 · A RESPOSTA CURTA\n[Responda em uma frase direta]\n\nSLIDE 4 · O QUE DIZ A LEI\n[Artigo, lei ou súmula, explicado]\n\nSLIDE 5 · NA PRÁTICA\n[Exemplo fictício: “Maria, 34 anos…”]\n\nSLIDE 6 · ATENÇÃO\n[Exceção ou cuidado importante]\n\nSLIDE 7 · RESUMO\n[3 linhas para salvar]`;
    else miolo = `SLIDE 2 · CONTEXTO\n[Por que esse assunto importa para quem segue]\n\nSLIDE 3 · PONTO 1\n[Ideia principal]\n\nSLIDE 4 · PONTO 2\n[Segunda ideia]\n\nSLIDE 5 · PONTO 3\n[Terceira ideia]\n\nSLIDE 6 · EXEMPLO\n[Situação fictícia ou fonte]\n\nSLIDE 7 · RESUMO\n[3 linhas para salvar]`;
    return `CARROSSEL · ${P.FORMATOS.carrossel.dur}\n\nSLIDE 1 · CAPA\n${x.titulo}\n[uma frase curta que gere curiosidade]\n\n${miolo}\n\nSLIDE 8 · CONVITE\n${CTA(a, 0)}\n${CTA(a, 1)}\n\nDESIGN\n• Uma ideia por slide, no máximo 40 palavras.\n• Título dos slides sempre na mesma posição.\n• Destaque uma palavra por slide com a cor de acento.\n• Foto sua ou elemento ligado ao tema na capa, com “arrasta →”.`;
  }
  if (f === 'reels' || f === 'reels-texto') {
    let conteudo;
    if (mod === 'mito') conteudo = `“Não é bem assim.” [A regra correta em 2 ou 3 frases, com a lei.]\n[Na prática, o que isso muda para quem assiste]`;
    else if (mod === 'caso') conteudo = `“Imagine: [personagem fictício] passou por ${t}.”\n“O que a lei diz: [regra].”\n“O que fazer: 1. [ação] 2. [ação] 3. [ação].”`;
    else conteudo = `“Primeiro: [ponto 1].”\n“Segundo: [ponto 2].”\n“Terceiro: [ponto 3].”`;
    if (f === 'reels-texto') return `REELS SEM ROSTO · 15 a 30 s · 1080×1920\n\nTELA 1 · GANCHO (0–3 s)\n${gancho}\n\nTELA 2 · CONTEXTO (3–8 s)\n[Contexto em uma frase]\n\nTELA 3 · CONTEÚDO (8–22 s)\n${conteudo.replace(/“|”/g, '')}\n\nTELA 4 · FECHAMENTO\n${CTA(a, 1)}\n\nEDIÇÃO\n• Texto grande no meio da tela, no máximo 12 palavras por tela.\n• Troca de tela a cada 3 a 4 segundos, imagem de fundo: [mãos escrevendo, mesa, cidade].\n• Música baixa e sem letra.\n• Nada nos 250 px de cima e nos 420 px de baixo.`;
    return `REELS · 30 a 45 s · 1080×1920\n\nCENA 1 · GANCHO (0–3 s)\n“${gancho}”\n[texto na tela: o gancho em letras grandes]\n\nCENA 2 · CONTEXTO (3–10 s)\n[Com quem isso acontece e por que importa]\n\nCENA 3 · CONTEÚDO (10–35 s)\n${conteudo}\n\nCENA 4 · FECHAMENTO (35–45 s)\n“${CTA(a, 0)}”\n\nEDIÇÃO\n• Corte as pausas: um corte a cada 2 a 4 s.\n• Legenda em 2 linhas, palavra-chave em destaque.\n• Zoom de 110% na frase mais importante.\n• Imagens de apoio: [mãos escrevendo, cidade, mesa].\n\nGRAVAÇÃO\n• Luz de frente, celular na altura dos olhos, microfone de lapela.\n• Grave 2 versões do gancho.`;
  }
  if (f === 'stories') return `STORIES · 5 telas\n\nTELA 1 · PERGUNTA\nVocê sabe o que fazer em caso de ${t}?\n[enquete Sim / Não]\n\nTELA 2 · CONTEXTO\n[Uma frase sobre por que isso importa]\n\nTELA 3 · CAIXA DE PERGUNTAS\nMe pergunte sobre ${t}\n\nTELA 4 · RESPOSTAS (no dia seguinte)\n[Responda 3 perguntas em vídeos curtos, sem mostrar quem perguntou]\n\nTELA 5 · CONVITE\nO conteúdo completo está no feed\n[figurinha de link ou menção]\n\nCUIDADO\n• Responda a regra geral, nunca o caso concreto de quem perguntou.`;
  if (f === 'post') return `POST ÚNICO · 1080×1350\n\nSLIDE 1 · FRASE PRINCIPAL\n${x.titulo}\n[apoio: complete a ideia em até 25 palavras]\n\nNA LEGENDA\n[Explique em 3 parágrafos curtos e termine com: ${CTA(a, 2)}]\n\nVISUAL\n• Foto sua em ambiente de trabalho ou fundo liso com a frase grande.`;
  if (f === 'live') return `LIVE · 30 a 40 min\n\nBLOCO 1 · ABERTURA (0–3 min)\n${x.titulo}\n[Apresente-se e peça para quem chegar comentar a cidade]\n\nBLOCO 2 · CONTEÚDO (3–15 min)\n1. [ponto]\n2. [ponto]\n3. [ponto]\n\nBLOCO 3 · PERGUNTAS (15–30 min)\n“Cada caso tem detalhes; aqui eu explico a regra.”\n\nBLOCO 4 · ENCERRAMENTO (30–35 min)\n[Resumo em 3 frases + próximo conteúdo da semana]\n\nANTES E DEPOIS\n• Divulgue 3 dias antes e no dia (contagem regressiva).\n• Salve a live e corte 3 trechos para reels.`;
  return `VÍDEO LONGO · 6 a 12 min · 16:9\n\nPARTE 1 · GANCHO (0:00)\n${gancho}\n\nPARTE 2 · O QUE VOCÊ VAI APRENDER (0:20)\n[3 tópicos]\n\nPARTE 3 · CONTEÚDO (1:00)\n[conteúdo em 3 blocos]\n\nPARTE 4 · EXEMPLO FICTÍCIO (7:00)\n[conteúdo]\n\nPARTE 5 · RESUMO E CONVITE (9:30)\n${CTA(a, 3)}\n\nMINIATURA\n• Rosto + 3 a 4 palavras grandes · 1280×720.`;
}
function legenda(post) {
  const x = ideia(post.ideia), a = AREA[post.area] || AREAS[0], cidade = (C.perfil?.cidade || '').split('/')[0].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z]/g, '');
  const tags = [...a.tags.slice(0, 3), '#advocacia', cidade ? '#' + cidade : ''].filter(Boolean).join(' ');
  return `${x.gancho || x.titulo}\n\n[Explique em 2 ou 3 parágrafos curtos, uma ideia por parágrafo.]\n\n[Se citar lei, coloque o artigo: “art. ___ da Lei ___”.]\n\n📌 ${CTA(a, 0)}\n\n${tags}`;
}
const checagem = txt => P.ETICA_REGRAS.filter(r => r.re.test(txt || ''));
// Transforma o roteiro em telas para a prévia (SLIDE, TELA, CENA, BLOCO, PARTE).
function telas(p) {
  const txt = p.roteiro || roteiro(p), blocos = txt.split(/\n\s*\n/), out = [], notas = [];
  blocos.forEach(b => { const [h, ...r] = b.split('\n'); const m = h.match(/^(SLIDE|TELA|TELAS|CENA|BLOCO|PARTE)\s*\d*[^·]*·\s*(.+)$/i);
    if (m) out.push({ rot:m[2].trim(), linhas:r.filter(Boolean) }); else if (/^(DESIGN|EDIÇÃO|GRAVAÇÃO|CUIDADO|NA LEGENDA|VISUAL|ANTES|DEPOIS|MINIATURA)/.test(h)) notas.push({ h, r }) });
  if (!out.length) out.push({ rot:'CAPA', linhas:[p.titulo] });
  return { out, notas };
}

/* ---------- gamificação ---------- */
const NIVEIS = [[0, 'Iniciante'], [150, 'Primeiros passos'], [400, 'Constante'], [800, 'Produtor'], [1400, 'Autoridade em formação'], [2200, 'Autoridade'], [3200, 'Referência local'], [4500, 'Referência'], [6000, 'Mestre da pauta'], [8000, 'Lenda']];
const PTS = { ideia:0, roteiro:10, producao:20, edicao:30, agendado:40, publicado:60 };
const semanaOk = w => { const l = C.posts.filter(p => p.semana === w); return l.length && l.every(p => p.status === 'publicado') };
function semanasCompletas() { let n = 0; for (let w = 0; w < 26; w++) if (semanaOk(w)) n++; return n }
function sequencia() { let s = 0, w = semanaAtual(); if (semanaOk(w)) s++; for (let i = w - 1; i >= 0; i--) { if (semanaOk(i)) s++; else break } return s }
function xp() {
  const pos = C.posts.reduce((a, p) => a + PTS[p.status], 0), tar = Object.values(C.tarefas).filter(Boolean).length * 15;
  const met = C.metricas.length * 30, sem = semanasCompletas() * 50, mis = Object.values(C.missoes).reduce((a, l) => a + l.length * 10, 0);
  const pas = [true, C.flags.identidade, C.flags.bio, C.posts.some(p => STI[p.status] >= 1), C.metricas.length > 0].filter(Boolean).length * 25;
  return pos + tar + met + sem + mis + pas;
}
function nivel(x = xp()) { let i = 0; NIVEIS.forEach((n, k) => { if (x >= n[0]) i = k }); const atual = NIVEIS[i], prox = NIVEIS[i + 1];
  return { n:i + 1, nome:atual[1], de:atual[0], ate:prox ? prox[0] : atual[0], pct:prox ? (x - atual[0]) / (prox[0] - atual[0]) : 1, prox:prox?.[1] } }
const pubF = f => C.posts.filter(p => p.status === 'publicado' && (f === 'reels' ? p.formato.startsWith('reels') : p.formato === f)).length;
const CONQ = [
  { id:'plano', ic:'flag', t:'Plano no ar', d:'Criou o plano de 6 meses.', ok:() => !!C.perfil },
  { id:'identidade', ic:'palette', t:'Cara própria', d:'Escolheu a identidade visual.', ok:() => !!C.flags.identidade },
  { id:'roteiro1', ic:'pen', t:'Primeiro roteiro', d:'Levou uma peça para a etapa Roteiro.', ok:() => C.posts.some(p => STI[p.status] >= 1) },
  { id:'pub1', ic:'send', t:'Primeira publicação', d:'Publicou a primeira peça.', ok:() => C.posts.some(p => p.status === 'publicado') },
  { id:'semana', ic:'check', t:'Semana fechada', d:'Publicou todas as peças de uma semana.', ok:() => semanasCompletas() >= 1 },
  { id:'seq3', ic:'flame', t:'Em chamas', d:'3 semanas seguidas completas.', ok:() => sequencia() >= 3 },
  { id:'reels1', ic:'play', t:'Diante da câmera', d:'Publicou o primeiro reels.', ok:() => pubF('reels') >= 1 },
  { id:'car5', ic:'layers', t:'Carrosséis em série', d:'5 carrosséis publicados.', ok:() => pubF('carrossel') >= 5 },
  { id:'rot10', ic:'doc', t:'Roteirista', d:'10 peças com roteiro em andamento.', ok:() => C.posts.filter(p => STI[p.status] >= 1).length >= 10 },
  { id:'tar20', ic:'target', t:'Mão na massa', d:'20 tarefas do cronograma concluídas.', ok:() => Object.values(C.tarefas).filter(Boolean).length >= 20 },
  { id:'met4', ic:'chart', t:'De olho nos números', d:'4 semanas de métricas registradas.', ok:() => C.metricas.length >= 4 },
  { id:'etica', ic:'shield', t:'Ética em dia', d:'Usou o verificador de ética.', ok:() => !!C.flags.etica },
  { id:'fav10', ic:'star', t:'Curadoria', d:'10 ideias favoritas.', ok:() => C.favoritas.length >= 10 },
  { id:'live', ic:'mic', t:'Ao vivo', d:'Publicou a primeira live.', ok:() => pubF('live') >= 1 },
  { id:'mes1', ic:'trophy', t:'Fundação completa', d:'Publicou tudo do mês 1.', ok:() => { const l = C.posts.filter(p => p.semana < 4); return l.length > 0 && l.every(p => p.status === 'publicado') } },
  { id:'meio', ic:'bolt', t:'Metade do caminho', d:'Metade do plano publicada.', ok:() => C.posts.length > 0 && C.posts.filter(p => p.status === 'publicado').length >= C.posts.length / 2 },
  { id:'fim', ic:'trophy', t:'Seis meses', d:'Plano inteiro publicado.', ok:() => C.posts.length > 0 && C.posts.every(p => p.status === 'publicado') }
];
function verificaGanhos() {
  if (!C.perfil) return;
  const nv = nivel(); if (nv.n > (C.nivelVisto || 0)) { if (C.nivelVisto) { confete(); toast(`Subiu para o nível ${nv.n}: ${nv.nome}!`, 'trophy') } C.nivelVisto = nv.n }
  const novas = CONQ.filter(c => c.ok() && !C.conqVistas.includes(c.id));
  if (novas.length) { if (C.conqVistas.length) { confete(); toast(`Conquista desbloqueada: ${novas[0].t}`, 'trophy') } C.conqVistas.push(...novas.map(c => c.id)) }
  salvar();
}
function missoesHoje() {
  const d = iso(hoje()), feitas = C.missoes[d] || [], w = semanaAtual(), out = [];
  const prox = C.posts.find(p => p.status !== 'publicado' && dataDe(p.data) >= hoje()) || C.posts.find(p => p.status !== 'publicado');
  if (prox) out.push({ k:'peca', t:STI[prox.status] < 1 ? `Escreva o roteiro de “${prox.titulo}”` : `Avance “${prox.titulo}” para ${STATUS[Math.min(5, STI[prox.status] + 1)].nome}`, xp:10, post:prox.id });
  const dw = new Date().getDay(), st = P.STORIES_SEMANA[(dw + 6) % 7];
  out.push({ k:'stories', t:`Stories de hoje: ${st.ideia}`, xp:10 });
  const tf = P.SEMANAS[w].tarefas.findIndex((_, i) => !C.tarefas[`${w}.${i}`]);
  if (tf >= 0) out.push({ k:'tarefa', t:P.SEMANAS[w].tarefas[tf], xp:10, tarefa:`${w}.${tf}` });
  else out.push({ k:'ideia', t:'Favorite 3 ideias novas no Banco de ideias', xp:10 });
  if (dw === 5 || dw === 6 || dw === 0) out.push({ k:'metricas', t:'Registre as métricas da semana em Analytics', xp:10 });
  return out.map(m => ({ ...m, feita:feitas.includes(m.k) }));
}

/* ---------- confete ---------- */
function confete() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cv = document.createElement('canvas'); cv.className = 'confete'; cv.width = innerWidth; cv.height = innerHeight; document.body.appendChild(cv);
  const x = cv.getContext('2d'), cores = [getComputedStyle(document.documentElement).getPropertyValue('--brand').trim() || '#1D5BF0', '#FFC53D', '#2BD47E', '#FF5C8A', '#FFFFFF'];
  const ps = Array.from({ length:140 }, () => ({ x:innerWidth / 2, y:innerHeight / 3, vx:(Math.random() - .5) * 16, vy:Math.random() * -14 - 4, r:Math.random() * 6 + 4, c:cores[Math.floor(Math.random() * cores.length)], a:Math.random() * 6 }));
  let t = 0; (function f() { x.clearRect(0, 0, cv.width, cv.height); ps.forEach(p => { p.vy += .45; p.x += p.vx; p.y += p.vy; p.a += .2; x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.fillStyle = p.c; x.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); x.restore() });
    if (++t < 110) requestAnimationFrame(f); else cv.remove() })();
}

/* ---------- capas (prévia visual das peças) ---------- */
const PAL_MARCA = () => ({ cores:['#FFFFFF', '#0E1424', C.cor, '#EEF3FF'] });
function paleta() { const id = C.identidade.paleta; return id === 'marca' ? PAL_MARCA() : (P.PALETAS.find(p => p.id === id) || PAL_MARCA()) }
function fonteT() { const f = P.FONTES.find(f => f.id === C.identidade.fonte); return f ? f.titulo : "'Figtree', sans-serif" }
const hashN = s => [...String(s)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
function destaca(t) { const w = String(t).replace(/[“”"]/g, '').split(' '); if (w.length < 3) return E(t); const k = w.length > 6 ? 2 : 1;
  return E(w.slice(0, -k).join(' ')) + ' <mark>' + E(w.slice(-k).join(' ')) + '</mark>' }
/* ---------- arte do estilo escolhido nas peças ---------- */
function partesTit(t) { t = String(t || '').replace(/[*_]/g, ''); const c = t.indexOf(':'); if (c > 3 && c < t.length - 3) return [t.slice(0, c).trim(), t.slice(c + 1).trim()];
  const w = t.split(' '); const k = Math.max(1, Math.min(3, Math.ceil(w.length * .4))); return [w.slice(0, -k).join(' ') || t, w.slice(-k).join(' ')] }
function capaSerie(s0, p) {
  const [a, b] = partesTit(p.titulo), ar = AREA[p.area]?.nome || '', pi = P.PILARES[p.pilar]?.nome || '', v = s0.v; s0.area = ar;
  if (v === 'foto') { const w = p.titulo.replace(/[*_]/g, '').split(' '), k = w.length > 4 ? 2 : 1; Object.assign(s0, { pill:w.slice(0, -k).join(' '), titulo:w.slice(-k).join(' '), nota:ar }) }
  else if (v === 'manchete') Object.assign(s0, { tag:ar, titulo:`${a}\n*${b}*`, pill:pi });
  else if (v === 'cartaz') Object.assign(s0, { sobre:a, titulo:`*${b}*`, linha:ar, creditos:`Um conteúdo de ${C.perfil?.nome || ''} sobre ${ar.toLowerCase()}.`, selo:'Salve para assistir de novo.' });
  else if (v === 'nativa') Object.assign(s0, { titulo:`${a}\n*${b}*`, caixa:'Arrasta para entender…' });
  else if (v === 'zine') Object.assign(s0, { tag1:ar, tag2:pi, titulo:a, baixo:`*${b}*` });
  else if (v === 'janela') Object.assign(s0, { lead:ar, titulo:`${a} *${b}*` });
  else if (v === 'caderno') Object.assign(s0, { titulo:`${a}\n*${b}*`, nota:pi, rodape:ar });
  else if (v === 'papel') Object.assign(s0, { titulo:a, script:b, assin:ar });
  else if (v === 'pop') Object.assign(s0, { titulo:`${a}\n*${b}*`, baixo:ar });
  else if (v === 'data') Object.assign(s0, { antes:a, titulo:b, depois:ar });
  else Object.assign(s0, { titulo:`${a} *${b}*` });
  return s0;
}
// Monta as telas da peça na arte escolhida (capa da série + uma tela por bloco do roteiro). Sem estilo escolhido: null.
function artePost(p, todas = false) {
  const k = C.perfil?.estilos?.[0], e = k && achaEst(k); if (!e) return null;
  const vert = p.formato.startsWith('reels') || p.formato === 'stories', [a, b] = partesTit(p.titulo), ar = AREA[p.area]?.nome || '', T = todas ? telas(p).out : [];
  const ctx = (d, col, idt) => ({ idt, d, handle:handle(), nome:C.perfil.nome, fotos:fotosEf() });
  const limpa = l => (l || '').replace(/^“|”$/g, '').replace(/^\[|\]$/g, '');
  if (e.col === 'editorial') {
    const idt = idtCol('editorial'), base = vert ? 'es3' : (e.serie && e.t.grupo === 'carrossel' && p.formato === 'carrossel') ? e.serie : (e.serie && e.t.grupo === 'unica' ? e.serie : (e.serie || 'ea2'));
    const pk = JSON.parse(JSON.stringify(COLS.editorial.PACKS[vert ? 'es3' : base])); pk.area = ar;
    let s0 = pk.s[0]; if (vert) Object.assign(s0, { pre:a, titulo:`*${b}*`, sub:ar }); else s0 = capaSerie(s0, p);
    const ss = [s0];
    if (todas) T.slice(1).forEach((t, i, l) => { const pr = t.linhas.find(x => !/^\[.*\]$/.test(x)) || t.linhas[0] || t.rot, resto = t.linhas.filter(x => x !== pr).map(limpa).join(' ');
      ss.push(i === l.length - 1 ? { t:'cta', tom:i % 2 ? 'cl' : 'es', titulo:limpa(pr), sub:resto || 'Salve e compartilhe.' } : { t:'texto', tom:i % 2 ? 'cl' : 'es', lead:t.rot, titulo:limpa(pr), nota:resto }) });
    pk.s = ss; return COLS.editorial.slides('x', ctx(pk, 'editorial', idt));
  }
  const idt = e.i, tid = vert ? (p.formato === 'stories' ? 's1' : 'e1') : p.formato === 'post' ? 't2' : 'c1', pk = JSON.parse(JSON.stringify(COLS.classica.PACKS[tid]));
  Object.assign(pk, { area:ar, tag:ar, titulo:`${a} *${b}*` });
  if (tid === 'c1') { const mid = T.slice(1, -1); pk.itens = (todas ? mid : pk.itens.slice(0, 1)).map(t => { const pr = t.linhas.find(x => !/^\[.*\]$/.test(x)) || t.linhas[0] || t.rot || ''; return { t:limpa(pr), d:t.linhas ? t.linhas.filter(x => x !== pr).map(limpa).join(' ') : '' } }); if (todas && T.length > 1) { const u = T[T.length - 1]; pk.fim = { titulo:limpa(u.linhas[0] || u.rot), sub:limpa(u.linhas.slice(1).join(' ')) } } }
  const sl = COLS.classica.slides(tid, ctx(pk, 'classica', idt));
  return tid === 'c1' && todas ? [sl[0], ...sl.slice(1, 1 + pk.itens.length), sl[sl.length - 1]] : sl;
}
const arteHTML = (h, cls = '') => `<span class="arte ${cls} ${h.includes(' story ') ? 'av' : ''}"><span class="arte-in">${h}</span></span>`;
function escalaArtes(raiz = document) { raiz.querySelectorAll('.arte').forEach(a => { const w = a.clientWidth, i = a.firstElementChild; if (w) i.style.transform = `scale(${w / 540})`; if (!i.dataset.fit) { i.dataset.fit = 1; ajustaTextos(i) } }) }
let escT = null; new MutationObserver(() => { cancelAnimationFrame(escT); escT = requestAnimationFrame(() => escalaArtes()) }).observe(document.documentElement, { childList:true, subtree:true });
window.addEventListener('resize', () => escalaArtes());
function capa(p, o = {}) {
  const arte = !o.generica && artePost(p);
  if (arte) { const st = STATUS[STI[p.status]]; return `<div class="capa capa-arte ${p.formato === 'carrossel' ? 'pilha' : ''} ${arte[0].includes(' story ') ? 'vert' : ''}">${arteHTML(arte[0])}${o.chips === false ? '' : `<div class="capa-chips"><span class="cchip c-${p.status}">${st.chip}</span></div>`}</div>` }

  const pal = paleta(), escuro = o.escuro ?? (hashN(p.id) % 3 === 1), bg = escuro ? pal.cores[2] : pal.cores[0], fg = escuro ? '#FFFFFF' : pal.cores[1], ac = escuro ? '#FFFFFF' : pal.cores[2];
  const vert = p.formato.startsWith('reels') || p.formato === 'stories', st = STATUS[STI[p.status]], v = (p.versoes || []).length;
  return `<div class="capa ${vert && !o.quad ? 'vert' : ''} ${o.quad ? 'quad' : ''} ${p.formato === 'carrossel' ? 'pilha' : ''} ${escuro ? 'escura' : ''}" style="--bg:${bg};--fg:${fg};--ac:${ac};--ft:${fonteT()}">
    ${o.chips === false ? '' : `<div class="capa-chips"><span class="cchip c-${p.status}">${st.chip}</span>${v ? `<span class="cchip">${v + 1} VERSÕES</span>` : ''}</div>`}
    <div class="capa-t">${destaca(o.titulo || p.titulo)}</div><div class="capa-sub">${E(AREA[p.area]?.nome || '')} · ${E(P.PILARES[p.pilar]?.nome || '')}</div>
    <div class="capa-deco"><span></span><span></span></div>
    ${vert ? `<span class="capa-tag">${I('play')}${p.formato === 'stories' ? 'STORIES' : 'REEL'}</span>` : p.formato === 'carrossel' ? '<span class="capa-arrasta">Arrasta →</span>' : ''}</div>`;
}

/* ---------- layout ---------- */
const cnt = f => C.posts.filter(p => f === 'reels' ? p.formato.startsWith('reels') : f === 'outros' ? ['post', 'stories', 'live', 'youtube'].includes(p.formato) : p.formato === f).filter(p => p.status !== 'publicado' && p.semana <= semanaAtual() + 4).length;
const NAV = () => [
  { id:'inicio', nome:'Início', ic:'home' }, { id:'cronograma', nome:'Cronograma', ic:'cal' },
  { sep:'Criação' }, { id:'carrosseis', nome:'Carrosséis', ic:'layers', n:cnt('carrossel') }, { id:'reels', nome:'Reels', ic:'play', n:cnt('reels') }, { id:'outros', nome:'Posts e stories', ic:'image', n:cnt('outros') },
  { id:'producao', nome:'Produção', ic:'board' }, { id:'ideias', nome:'Banco de ideias', ic:'bulb' }, { id:'roteiros', nome:'Roteiros', ic:'pen' }, { id:'tendencias', nome:'Tendências', ic:'flame', tag:'Novo' },
  ...(C.perfil?.modo === 'produzir' ? [] : [{ sep:'Desempenho' }, { id:'insights', nome:'Insights', ic:'spark' }]), { id:'publicados', nome:'Publicados', ic:'send', n:C.posts.filter(p => p.status === 'publicado').length }, ...(C.perfil?.modo === 'produzir' ? [] : [{ id:'analytics', nome:'Analytics', ic:'chart' }]), { id:'conquistas', nome:'Conquistas', ic:'trophy', n:CONQ.filter(c => c.ok()).length },
  { sep:'Marca' }, { id:'identidade', nome:'Identidade', ic:'palette' }, { id:'estudio', nome:'Estúdio', ic:'cam' }, { id:'etica', nome:'Ética', ic:'shield' }, { id:'modelos', nome:'Modelos', ic:'grid', n:COLS.editorial.TPL.length + COLS.classica.TPL.length }, { id:'contas', nome:'Contas', ic:'users' }, { id:'ajustes', nome:'Ajustes', ic:'gear' }
];
const MOBILE = ['inicio', 'cronograma', 'carrosseis', 'producao'];
const av = (c, cls = '') => `<span class="av ${cls}" style="--c:${c.cor}">${E(((c.perfil?.marca || c.perfil?.nome || '?').trim()[0] || '?').toUpperCase())}</span>`;
function shell(html) {
  const nv = nivel(), x = xp(), pf = C.perfil;
  $('#app').innerHTML = `<aside class="side">
    <div class="contas-sw">${S.contas.filter(c => c.perfil).map(c => `<button class="sw ${c.id === C.id ? 'on' : ''}" data-conta="${c.id}" title="${E(c.perfil.marca || c.perfil.nome)}" aria-label="Abrir ${E(c.perfil.marca || c.perfil.nome)}">${av(c)}</button>`).join('')}<button class="sw add" data-acao="novaconta" aria-label="Adicionar conta">${I('plus')}</button></div>
    <div class="side-id">${E(pf.arroba || '@seuperfil')} · ${E(pf.marca || 'Pauta')}</div>
    <nav>${NAV().map(n => n.sep ? `<div class="side-sep">${n.sep}</div>` : `<a href="#${n.id}" class="nav ${rota === n.id ? 'on' : ''}" ${rota === n.id ? 'aria-current="page"' : ''}>${I(n.ic)}<span>${n.nome}</span>${n.tag ? `<em>${n.tag}</em>` : n.n ? `<b>${n.n}</b>` : ''}</a>`).join('')}</nav>
    <a href="#conquistas" class="nivel-card"><div class="nivel-top"><span class="nivel-n">${nv.n}</span><div><small>Nível ${nv.n}</small><strong>${E(nv.nome)}</strong></div><span class="fogo" title="Semanas completas seguidas">${I('flame')}${sequencia()}</span></div>
      <i class="barra"><b style="width:${Math.round(nv.pct * 100)}%"></b></i><small class="nivel-xp">${num(x)} XP${nv.prox ? ` · faltam ${num(nv.ate - x)}` : ''}</small></a>
    <div class="side-conta"><span title="${E(EMAIL)}">${E(EMAIL)}</span><button data-acao="sair">${I('left')}Sair</button></div>
    <div class="side-marca">pauta<b>▸</b> <span>por PratFlix</span></div></aside>
  <main class="main"><div class="page">${html}</div></main>
  <nav class="tabbar">${MOBILE.map(id => { const n = NAV().find(x => x.id === id); return `<a href="#${id}" class="${rota === id ? 'on' : ''}">${I(n.ic)}<span>${n.nome.split(' ')[0]}</span></a>` }).join('')}<button data-acao="menu" aria-label="Mais seções">${I('menu')}<span>Mais</span></button></nav>`;
}
const marcaNome = () => (C.perfil.marca || C.perfil.nome).toUpperCase();
const cab = (sec, h, p = '', acoes = '') => `<header class="cab"><div><span class="eyebrow"><i></i>${E(marcaNome())} · ${sec}</span><h1>${h}<span class="ponto">.</span></h1>${p ? `<p class="lead">${p}</p>` : ''}</div>${acoes ? `<div class="cab-acoes">${acoes}</div>` : ''}</header>`;
const chipF = f => `<span class="fchip" style="--c:${P.FORMATOS[f]?.cor || '#888'}">${E(P.FORMATOS[f]?.curto || f)}</span>`;
const dot = ar => `<span class="adot" style="--c:${AREA[ar]?.cor || '#888'}" title="${E(AREA[ar]?.nome)}"></span>`;
const stTag = s => `<span class="st st-${s}">${STATUS[STI[s]].nome}</span>`;

/* ---------- onboarding (com prévia ao vivo) ---------- */
let wiz = { passo:0, d:{} };
const PASSOS = ['Você', 'Sua marca', 'Áreas', 'Rotina', 'Estilo', 'Artes'];
function onboarding(modo = 'novo') {
  wiz.modo = modo;
  wiz.d = modo === 'editar' ? { estilos:[], ...C.perfil, cor:C.cor } : { nome:'', marca:'', arroba:'', cidade:'', cor:modo === 'conta' ? CORES[S.contas.filter(c => c.perfil).length % CORES.length] : C.cor || CORES[0], tempo:'ate2', areas:[], principal:'', publico:['pessoas'], objetivo:'autoridade', redes:['instagram'], freq:3, dias:[], video:'sim', tom:'didatico', estilos:[], inicio:iso(segunda(somaDias(hoje(), 1))) };
  wiz.passo = modo === 'novo' && !wiz.vistoIntro ? -1 : 0; desenhaWiz();
}
function previa() {
  const d = wiz.d, h = new Date().getHours(), nome = (d.nome || 'você').split(' ')[0];
  return `<div class="prev" style="--brand:${d.cor}"><div class="prev-bar"><i></i><i></i><i></i></div><div class="prev-in"><div class="prev-side"><span class="prev-av">${E((d.marca || d.nome || 'P')[0].toUpperCase())}</span>${'<i></i>'.repeat(7)}</div>
    <div class="prev-main"><small>${E((d.marca || 'SUA MARCA').toUpperCase())} · INÍCIO</small><b>${h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'}, <em>${E(nome)}</em>.</b>
      <div class="prev-cards"><div class="pc-blue"><small>Seguidores</small><strong>2.940</strong><div class="pc-bars">${[30, 45, 38, 60, 72, 90].map(v => `<i style="height:${v}%"></i>`).join('')}</div></div><div class="pc"><small>Alcance</small><strong>14.210</strong><svg viewBox="0 0 100 30"><path d="M0 24 L25 22 L45 23 L60 12 L80 9 L100 4" fill="none" stroke="currentColor" stroke-width="2.5"/></svg></div><div class="pc"><small>Ideias</small><strong>${d.areas.length ? d.areas.length * 100 : '—'}</strong><span class="pc-chip">${d.areas.length ? 'prontas' : 'escolha as áreas'}</span></div></div>
      <div class="prev-capas">${(d.areas.length ? d.areas : ['familia', 'consumidor', 'trabalho']).concat(['previdenciario']).slice(0, 4).map((a, i) => `<div class="prev-capa ${i % 2 ? 'esc' : ''}"><span>${E(AREA[a].temas[i].q)}</span></div>`).join('')}</div></div></div></div>`;
}
function desenhaWiz() {
  const d = wiz.d, p = wiz.passo;
  document.documentElement.style.setProperty('--brand', d.cor || CORES[0]);
  if (p === -1) { $('#app').innerHTML = `<div class="wiz wiz-intro"><div class="wiz-topo"><span class="brand-w">pauta<b>▸</b></span></div><div class="intro"><span class="intro-ic">${I('spark')}</span><h1>Sua Pauta chegou.</h1><p>Em 3 minutos ela fica com a cara da sua marca e monta 6 meses de conteúdo para a sua área. Depois, é só criar.</p><button class="btn branco" data-wiz="1">Começar ${I('right')}</button></div></div>`; return }
  const op = (name, v, l, sub = '', multi = false) => { const on = multi ? (d[name] || []).includes(v) : d[name] === v;
    return `<button type="button" class="opt ${on ? 'on' : ''}" data-op="${name}" data-v="${v}" data-multi="${multi ? 1 : ''}" aria-pressed="${on}"><strong>${l}</strong>${sub ? `<small>${sub}</small>` : ''}</button>` };
  let corpo = '';
  if (p === 0) corpo = `<h2>Como você quer ser chamado?</h2><p class="sub">Aparece na saudação do Início.</p>
    <input id="w-nome" class="w-in" value="${E(d.nome)}" placeholder="Seu nome" autocomplete="name">
    <div class="grupo"><span class="grupo-t">Tempo de advocacia</span><div class="opts">${op('tempo', 'estudante', 'Estudante')}${op('tempo', 'ate2', 'Até 2 anos')}${op('tempo', '2a5', '2 a 5 anos')}${op('tempo', 'mais5', 'Mais de 5')}</div></div>`;
  if (p === 1) corpo = `<h2>Agora, a sua marca.</h2><p class="sub">A cor muda o painel inteiro. Dá para trocar depois.</p>
    <div class="w-marca"><span class="w-logo" style="background:${d.cor}">${E((d.marca || d.nome || 'P')[0].toUpperCase())}</span><div class="w-col"><input id="w-marca" class="w-in" value="${E(d.marca)}" placeholder="Nome do perfil (ex.: Ana Souza Advocacia)"><input id="w-arroba" class="w-in" value="${E(d.arroba)}" placeholder="@seuinstagram"><input id="w-cidade" class="w-in" value="${E(d.cidade)}" placeholder="Cidade/UF"></div></div>
    <div class="cores">${CORES.map(c => `<button class="cor ${d.cor === c ? 'on' : ''}" style="--c:${c}" data-cor="${c}" aria-label="Cor ${c}" aria-pressed="${d.cor === c}"></button>`).join('')}<label class="cor arco" aria-label="Outra cor"><input type="color" id="w-corlivre" value="${d.cor}"></label></div>`;
  if (p === 2) corpo = `<h2>Em quais áreas você atua?</h2><p class="sub">De 1 a 4. Cada área traz 100 ideias prontas. A principal aparece mais no calendário.</p>
    <div class="areas-w">${AREAS.map(a => { const on = d.areas.includes(a.id), pr = d.principal === a.id;
      return `<button type="button" class="aw ${on ? 'on' : ''}" data-area="${a.id}" style="--c:${a.cor}" aria-pressed="${on}"><span class="aw-ic">${I(a.ic)}</span><strong>${a.nome}</strong>${on ? `<span class="aw-pr ${pr ? 'is' : ''}" data-principal="${a.id}">${pr ? '★ Principal' : 'Tornar principal'}</span>` : ''}</button>` }).join('')}</div>`;
  if (p === 3) corpo = `<h2>Qual ritmo cabe na sua semana?</h2><p class="sub">Constância vale mais que volume.</p>
    <div class="grupo"><span class="grupo-t">Publicações por semana</span><div class="opts">${[2, 3, 4, 5].map(n => `<button type="button" class="opt ${d.freq === n ? 'on' : ''}" data-freq="${n}" aria-pressed="${d.freq === n}"><strong>${n}×</strong><small>cerca de ${n} h por semana</small></button>`).join('')}</div></div>
    <div class="grupo"><span class="grupo-t">Dias</span><div class="opts dias">${[1, 2, 3, 4, 5, 6, 0].map(n => { const on = (d.dias.length ? d.dias : DIAS_FREQ[d.freq]).includes(n); return `<button type="button" class="opt dia ${on ? 'on' : ''}" data-dia="${n}" aria-pressed="${on}"><strong>${DIAS[n]}</strong></button>` }).join('')}</div></div>
    <div class="grupo"><span class="grupo-t">Topa aparecer em vídeo?</span><div class="opts">${op('video', 'sim', 'Sim', 'reels falando para a câmera')}${op('video', 'asvezes', 'Às vezes', 'metade com rosto')}${op('video', 'nao', 'Prefiro não', 'reels com texto e imagens')}</div></div>
    <label class="grupo-t lbl-data">Começar na semana de<input id="w-inicio" class="w-in" type="date" value="${E(d.inicio)}"></label>`;
  if (p === 4) corpo = `<h2>Para quem você fala e como?</h2><p class="sub">Isso ajusta a linguagem dos roteiros.</p>
    <div class="grupo"><span class="grupo-t">Público</span><div class="opts">${op('publico', 'pessoas', 'Pessoas físicas', '', true)}${op('publico', 'empresas', 'Empresas', '', true)}${op('publico', 'colegas', 'Advogados e estudantes', '', true)}</div></div>
    <div class="grupo"><span class="grupo-t">Objetivo</span><div class="opts">${op('objetivo', 'autoridade', 'Ser referência')}${op('objetivo', 'clientes', 'Ser lembrado por quem precisa')}${op('objetivo', 'networking', 'Rede com colegas')}${op('objetivo', 'ensinar', 'Ensinar')}</div></div>
    <div class="grupo"><span class="grupo-t">Tom de voz</span><div class="opts">${op('tom', 'didatico', 'Didático')}${op('tom', 'proximo', 'Próximo')}${op('tom', 'tecnico', 'Técnico')}${op('tom', 'leve', 'Bem-humorado')}</div></div>
    ${wiz.modo === 'editar' ? `<label class="check-w"><input type="checkbox" id="w-manter" checked> Manter as peças que já saíram de “Ideia” e refazer só o restante</label>` : ''}`;
  if (p === 5) { if (!d.estilos?.length) d.estilos = [estilosRec(d.areas[0] || d.principal)[0]];
    corpo = `<h2>Escolha o estilo das suas artes.</h2><p class="sub">Até 2 estilos. Eles aparecem primeiro nos seus modelos de post, carrossel e stories. Os outros continuam disponíveis.</p>
    ${gradeEstilos(d.estilos, d, 'wz')}`; }
  const ok = p === 0 ? (d.nome || '').trim().length > 1 : p === 2 ? d.areas.length > 0 : p === 5 ? d.estilos.length > 0 : true;
  $('#app').innerHTML = `<div class="wiz"><div class="wiz-topo"><span class="brand-w">pauta<b>▸</b></span><i class="wiz-prog"><b style="width:${(p + 1) / 6 * 100}%"></b></i>${p > 0 ? `<button class="link-w" data-wiz="-1">${I('left')}Voltar</button>` : wiz.modo !== 'novo' ? `<button class="link-w" data-acao="cancelawiz">Cancelar</button>` : '<span></span>'}</div>
    <div class="wiz-grid ${p === 5 ? 'larga' : ''}"><section class="wiz-l"><span class="passo">${p + 1} DE 6 · ${PASSOS[p].toUpperCase()}</span>${corpo}
      <button class="btn branco" data-wiz="1" ${ok ? '' : 'disabled'}>${p === 5 ? 'Salvar e gerar meu plano' : 'Continuar'} ${I(p === 5 ? 'check' : 'right')}</button></section>
      ${p === 5 ? '' : `<div class="wiz-r" aria-hidden="true">${previa()}</div>`}</div></div>`;
  if (p === 5) ajustaTextos($('#app'));
}
function lerWiz() { const d = wiz.d; ['nome', 'marca', 'arroba', 'cidade', 'inicio'].forEach(k => { const el = $('#w-' + k); if (el) d[k] = el.value.trim() }) }
function concluirWiz() {
  const d = wiz.d; if (!d.principal || !d.areas.includes(d.principal)) d.principal = d.areas[0];
  if ((d.dias || []).length !== d.freq) d.dias = [];
  if (!d.marca) d.marca = d.nome; if (d.arroba && !d.arroba.startsWith('@')) d.arroba = '@' + d.arroba;
  if (wiz.modo === 'conta') { const c = contaNova(d.cor); S.contas.push(c); C = c; S.atual = c.id }
  const manter = wiz.modo === 'editar' && $('#w-manter')?.checked ? C.posts.filter(p => p.status !== 'ideia') : [];
  const { cor, ...pf } = d; C.cor = cor; C.perfil = pf; aplicaEstilo(pf.estilos?.[0]); C.posts = gerarPlano(pf, manter); if (wiz.modo !== 'editar') C.tarefas = {};
  salvar(); aplicaCor();
  $('#app').innerHTML = `<div class="wiz wiz-intro"><div class="intro"><span class="intro-ic ok">${I('check')}</span><h1>Sua marca está no ar.</h1><p>${C.posts.length} peças distribuídas em 26 semanas, ${todasIdeias(pf.areas).length} ideias no seu banco e a primeira missão esperando por você.</p><button class="btn branco" data-acao="abrirpauta">Abrir minha Pauta ${I('right')}</button></div></div>`;
  confete(); wiz = { passo:0, d:{}, vistoIntro:true };
}

/* ---------- estilos de arte escolhidos ---------- */
const TODOS_EST = () => [...COLS.editorial.IDT.map(i => ({ col:'editorial', i })), ...COLS.classica.IDT.map(i => ({ col:'classica', i }))];
const chEst = (col, id) => col + ':' + id;
const SERIE_IDT = { ea1:'vinho', ea2:'cafe', ea3:'tijolo', ea4:'nativa', ea5:'zine', ea6:'eletrico', ea7:'ferrugem', ea8:'areia', eu1:'magenta', eu2:'uva', eu3:'noir' };
const SERIES = () => COLS.editorial.TPL.filter(t => SERIE_IDT[t.id]);
const achaEst = k => { const [col, id] = (k || '').split(':');
  if (col === 'serie') { const t = COLS.editorial.TPL.find(x => x.id === id); if (!t) return null; const i = COLS.editorial.IDT.find(x => x.id === (mstate().idt.editorial || SERIE_IDT[id])) || COLS.editorial.IDT[0]; return { col:'editorial', serie:id, t, i } }
  const i = COLS[col]?.IDT.find(x => x.id === id); return i ? { col, i } : null };
const nomeEst = e => e.serie ? e.t.nome : e.i.nome;
function estilosRec(area) { const l = COLS.classica.IDT; return [...SERIES().map(t => 'serie:' + t.id), ...[...l.filter(i => i.ideal.includes(area)), ...l.filter(i => !i.ideal.includes(area))].map(i => 'classica:' + i.id)] }
let filtroEst = 'editorial';
function thumbEstilo(col, idt, d = {}, serie) {
  const C2 = COLS[col], tid = serie || (col === 'editorial' ? 'ea2' : 'c1'), pack = JSON.parse(JSON.stringify(C2.PACKS[tid]));
  if (serie) idt = COLS.editorial.IDT.find(x => x.id === SERIE_IDT[serie]) || idt;
  return C2.slides(tid, { idt, d:pack, handle:(d.arroba || C.perfil?.arroba || '@seuperfil'), nome:d.nome || C.perfil?.nome || '', fotos:fotosEf() })[0];
}
function gradeEstilos(sel, d, modo) {
  const area = d.principal || d.areas?.[0] || C.perfil?.principal, ord = estilosRec(area).map(achaEst).filter(e => e && e.col === filtroEst), recC = new Set(COLS.classica.IDT.filter(i => i.ideal.includes(area)).map(i => 'classica:' + i.id));
  return `<div class="est-top"><div class="seg">${[['editorial', 'Séries editoriais · com foto'], ['classica', 'Clássica']].map(([k, n]) => `<button data-festilo="${k}" data-modo="${modo}" aria-pressed="${filtroEst === k}">${n}</button>`).join('')}</div><span class="est-sel">${sel.length}/2 escolhidos${sel.map(k => { const e = achaEst(k); return e ? ` · <b>${E(nomeEst(e))}</b>` : '' }).join('')}</span></div>${filtroEst === 'editorial' ? '<p class="est-nota">Cada série tem um jeito próprio de contar: capa, miolo e fechamento. As cores você escolhe depois.</p>' : ''}
    <div class="est-grade ${filtroEst === 'editorial' ? 'series' : ''}">${ord.map(e => { const k = e.serie ? 'serie:' + e.serie : chEst(e.col, e.i.id), on = sel.includes(k);
      const tela = e.serie ? COLS.editorial.slides(e.serie, { idt:COLS.editorial.IDT.find(x => x.id === SERIE_IDT[e.serie]), d:JSON.parse(JSON.stringify(COLS.editorial.PACKS[e.serie])), handle:d.arroba || C.perfil?.arroba || '@seuperfil', nome:d.nome || C.perfil?.nome || '', fotos:fotosEf() }) : null;
      return `<button type="button" class="est ${on ? 'on' : ''}" data-estilo="${k}" data-modo="${modo}" aria-pressed="${on}">${e.serie ? `<span class="est-tira">${tela.slice(0, 3).map(h => `<span class="th ${h.includes(' story ') ? 'story' : ''}">${h}</span>`).join('')}</span>` : `<span class="th">${thumbEstilo(e.col, e.i, d)}</span>`}<span class="est-n"><strong>${E(nomeEst(e))}</strong>${e.serie ? `<small>${E(e.t.desc)}</small><em>${tela.length} ${tela.length > 1 ? 'telas' : 'tela'}</em>` : recC.has(k) ? '<em>para a sua área</em>' : ''}</span>${on ? `<span class="est-ok">${I('check')}</span>` : ''}</button>` }).join('')}</div>`;
}
function alternaEstilo(lista, k) { const l = lista.includes(k) ? lista.filter(x => x !== k) : [...lista, k]; return l.length > 2 ? l.slice(-2) : l }
function aplicaEstilo(k) { const e = achaEst(k); if (!e) return; const m = mstate(); m.col = e.col; if (e.serie) { m.idt.editorial ||= SERIE_IDT[e.serie]; abaMod = e.t.grupo } else m.idt[e.col] = e.i.id }
function modalEstilos() {
  const sel = C.perfil.estilos || [];
  modal(`<span class="eyebrow"><i></i>SEUS ESTILOS</span><h2 class="m-t">Escolha até 2 estilos de arte</h2><p class="muted">Eles ficam à mão na aba Modelos. Os outros continuam em “Ver todos os estilos”.</p><div class="est-modal">${gradeEstilos(sel, C.perfil, 'm')}</div><div class="acoes"><button class="btn" data-mfechar ${sel.length ? '' : 'disabled'}>${I('check')}Pronto</button></div>`);
  ajustaTextos($('#modal'));
}

/* ---------- componentes ---------- */
function linhaPost(p) {
  const atraso = p.status !== 'publicado' && dataDe(p.data) < hoje();
  return `<button class="lpost ${p.status === 'publicado' ? 'feito' : ''}" data-post="${p.id}"><span class="lp-capa">${capa(p, { chips:false })}</span><span class="lp-meio"><span class="lp-meta">${chipF(p.formato)}<small class="${atraso ? 'atraso' : ''}">${fmt(p.data, { weekday:'short', day:'2-digit', month:'short' })}</small></span><strong>${E(p.titulo)}</strong></span>${stTag(p.status)}</button>`;
}
function grafLinha(vals, o = {}) {
  const W = 320, H = 90, n = vals.length; if (n < 2) return `<div class="graf-vazio">${o.vazio || 'Registre 2 semanas para ver a linha.'}</div>`;
  const max = Math.max(...vals, 1), min = Math.min(...vals), y = v => H - 8 - ((v - min) / Math.max(max - min, 1)) * (H - 16), x = i => i * (W / (n - 1));
  const d = vals.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  return `<svg class="graf" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="${o.label || 'Evolução'}"><defs><linearGradient id="gA${o.id || ''}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--brand)" stop-opacity=".25"/><stop offset="1" stop-color="var(--brand)" stop-opacity="0"/></linearGradient></defs><path d="${d} L${W},${H} L0,${H} Z" fill="url(#gA${o.id || ''})"/><path d="${d}" fill="none" stroke="var(--brand)" stroke-width="2.5" vector-effect="non-scaling-stroke"/></svg>`;
}
const met = () => C.metricas.slice().sort((a, b) => a.data.localeCompare(b.data));
const delta = (a, b) => b ? Math.round((a - b) / b * 1000) / 10 : null;
const dChip = v => v === null ? '' : `<span class="dchip ${v >= 0 ? 'up' : 'down'}">${v >= 0 ? '▲' : '▼'} ${String(Math.abs(v)).replace('.', ',')}%</span>`;

/* ---------- páginas ---------- */
function inicio() {
  const pf = C.perfil, w = semanaAtual(), sem = P.SEMANAS[w], fase = P.FASES[sem.f - 1], ps = C.posts.filter(p => p.semana === w);
  const h = new Date().getHours(), hj = C.posts.filter(p => p.data === iso(hoje()) && p.status !== 'publicado'), rev = C.posts.filter(p => p.status === 'edicao').length;
  const sub = hj.length ? `${hj.length} ${hj.length === 1 ? 'peça marcada' : 'peças marcadas'} para hoje${rev ? ` e ${rev} em revisão` : ''}.` : `Nada marcado para hoje${rev ? `, ${rev} ${rev === 1 ? 'peça' : 'peças'} em revisão` : ' e nenhuma peça parada em revisão'}.`;
  const m = met(), u = m[m.length - 1], a = m[m.length - 2], mis = missoesHoje(), nv = nivel(), x = xp();
  const passos = [{ t:'Seu plano', d:'Criado no início.', ok:true }, { t:'Identidade visual', d:'Paleta e fontes das capas.', ok:!!C.flags.identidade, href:'#identidade' }, { t:'Bio do perfil', d:'Copie uma das 3 bios prontas.', ok:!!C.flags.bio, href:'#identidade' }, { t:'Primeiro roteiro', d:'Abra a primeira peça e avance.', ok:C.posts.some(p => STI[p.status] >= 1), post:C.posts[0]?.id }, { t:'Primeiros números', d:'Registre a semana em Analytics.', ok:C.metricas.length > 0, href:'#analytics' , oculto:C.perfil.modo === 'produzir' }];
  if (passos.some(z => z.oculto)) passos.splice(passos.findIndex(z => z.oculto), 1);
  const feitos = passos.filter(z => z.ok).length, iAt = passos.findIndex(z => !z.ok), prox = C.posts.filter(p => p.status !== 'publicado' && dataDe(p.data) >= hoje()).slice(0, 6), pub = ps.filter(p => p.status === 'publicado').length, conqs = CONQ.filter(c => c.ok()).slice(-3).reverse();
  const tag = s => s.href ? ['a', `href="${s.href}"`] : s.post ? ['button', `data-post="${s.post}"`] : ['div', ''];
  return cab('INÍCIO', `${h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'}, <em>${E(pf.nome.split(' ')[0])}</em>`, sub, `<span class="semana-pill" style="--c:${fase.cor}">Semana ${w + 1} de 26 · ${E(fase.nome)}</span><a class="btn so-metricas" href="#insights">${I('spark')}Pedir leitura</a>`) +
  (feitos < passos.length ? `<section class="card passos"><div class="card-h"><div><small class="muted">Primeiros passos · ${feitos} de ${passos.length}</small><h2>Deixe a Pauta com a sua cara.</h2></div><i class="barra"><b style="width:${feitos / passos.length * 100}%"></b></i></div>
    <div class="passos-l">${passos.map((s, i) => { const [tg, at] = tag(s); return `<${tg} ${at} class="passo-i ${s.ok ? 'ok' : ''} ${i === iAt ? 'atual' : ''}"><span class="passo-n">${s.ok ? I('check') : i + 1}</span><div><strong>${s.t}</strong><small>${s.d}</small></div>${s.ok ? '' : '<em>+25 XP</em>'}</${tg}>` }).join('')}</div></section>` : '') +
  `<div class="g3"><section class="card azul so-metricas"><div class="card-h"><h2>Seguidores</h2><span class="pill-b">${E(pf.arroba || '@seuperfil')}</span></div>
      ${u ? `<div class="big-row"><div><strong class="big">${num(u.seguidores)}</strong><small>TOTAL NA ÚLTIMA SEMANA</small></div><div><strong class="mid">${a ? (u.seguidores - a.seguidores >= 0 ? '+' : '') + num(u.seguidores - a.seguidores) : '—'}</strong><small>NOVOS NA SEMANA</small></div></div>` : `<div class="big-row"><div><strong class="big">—</strong><small>REGISTRE A PRIMEIRA SEMANA</small></div></div>`}
      <div class="barras">${(m.length ? m.slice(-8) : Array(8).fill({ alcance:0 })).map((r, i, l) => { const mx = Math.max(...l.map(z => +z.alcance), 1); return `<i class="${i === l.length - 1 ? 'ult' : ''}" style="height:${Math.max(4, +r.alcance / mx * 100)}%" title="${r.data ? fmt(r.data) + ': ' + num(r.alcance) : ''}"></i>` }).join('')}</div><div class="azul-f"><small class="cap-b">ALCANCE POR SEMANA · ${Math.min(8, m.length) || 8} SEMANAS</small>${u ? '' : `<button class="btn branco sm" data-acao="regmet">${I('plus')}Registrar</button>`}</div></section>
    <section class="card so-metricas"><div class="card-h"><div><h2>Alcance</h2><small class="muted">Última semana</small></div>${u && a ? dChip(delta(+u.alcance, +a.alcance)) : ''}</div><strong class="big ink">${u ? num(u.alcance) : '—'}</strong>
      ${grafLinha(m.slice(-8).map(r => +r.alcance), { id:'al', label:'Alcance por semana', vazio:'Registre 2 semanas para ver a curva.' })}
      <div class="mini3"><div><strong>${u ? num(u.salvos) : '—'}</strong><small>salvamentos</small></div><div><strong>${u ? num(u.compart) : '—'}</strong><small>compart.</small></div><div><strong>${u ? num(u.mensagens) : '—'}</strong><small>mensagens</small></div></div></section>
    <section class="card"><div class="card-h"><div><h2>Sua semana</h2><small class="muted">${E(sem.tema)}</small></div><span class="dchip up">${pub}/${ps.length}</span></div>
      <div class="semana-anel"><div class="anel" style="--p:${ps.length ? pub / ps.length : 0}"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42"/><circle cx="50" cy="50" r="42" class="fg"/></svg><div><strong>${pub}</strong><span>de ${ps.length}</span></div></div>
        <div class="semana-l">${ps.map(p => `<button class="sp ${p.status === 'publicado' ? 'ok' : ''}" data-post="${p.id}"><span>${p.status === 'publicado' ? I('check') : fmt(p.data, { weekday:'short' })}</span>${E(p.titulo)}</button>`).join('')}</div></div></section></div>
  <div class="g3"><section class="card"><div class="card-h"><div><h2>Missões de hoje</h2><small class="muted">${mis.filter(z => z.feita).length} de ${mis.length} · +10 XP cada</small></div><span class="ic-bola">${I('target')}</span></div>
      <ul class="missoes">${mis.map(z => `<li class="${z.feita ? 'ok' : ''}"><button class="mis-ck" data-missao="${z.k}" aria-pressed="${z.feita}" aria-label="Marcar missão como feita">${I('check')}</button><div>${z.post ? `<button class="link-t" data-post="${z.post}">${E(z.t)}</button>` : `<span>${E(z.t)}</span>`}</div><em>+${z.xp}</em></li>`).join('')}</ul></section>
    <section class="card nivel"><div class="card-h"><div><h2>Nível ${nv.n} · ${E(nv.nome)}</h2><small class="muted">${num(x)} XP${nv.prox ? ` · ${num(nv.ate - x)} para ${E(nv.prox)}` : ''}</small></div><span class="fogo grande" title="Semanas completas seguidas">${I('flame')}${sequencia()}</span></div>
      <i class="barra grossa"><b style="width:${Math.round(nv.pct * 100)}%"></b></i>
      <div class="conq-mini">${conqs.map(c => `<div class="cm">${I(c.ic)}<span>${E(c.t)}</span></div>`).join('')}<a class="cm mais" href="#conquistas"><b>${CONQ.filter(c => c.ok()).length}/${CONQ.length}</b><span>conquistas</span></a></div></section>
    <section class="card"><div class="card-h"><h2>Próximas peças</h2><a href="#cronograma" class="link">Cronograma ${I('right')}</a></div><div class="prox-capas">${prox.map(p => `<button class="pc-item" data-post="${p.id}">${capa(p, { chips:false, quad:true })}<small>${fmt(p.data, { weekday:'short', day:'2-digit' })}</small></button>`).join('')}</div></section></div>
  <div class="g2"><section class="card"><div class="card-h"><h2>Tarefas da semana ${w + 1}</h2><span class="muted">${sem.tarefas.filter((_, i) => C.tarefas[`${w}.${i}`]).length}/${sem.tarefas.length} · +15 XP cada</span></div>
      <ul class="tarefas">${sem.tarefas.map((t, i) => `<li><label><input type="checkbox" data-tarefa="${w}.${i}" ${C.tarefas[`${w}.${i}`] ? 'checked' : ''}><span class="box-ck">${I('check')}</span><span>${E(t)}</span></label></li>`).join('')}</ul></section>
    <section class="card"><div class="card-h"><h2>Stories da semana</h2></div><ul class="stories-sem">${P.STORIES_SEMANA.slice(0, 6).map((s, i) => `<li class="${(new Date().getDay() + 6) % 7 === i ? 'hoje' : ''}"><b>${s.d}</b><span>${E(s.ideia)}</span></li>`).join('')}</ul></section></div>`;
}
let vistaCron = 'mes', mesCal = null;
function cronograma() {
  const tabs = `<div class="seg">${[['mes', 'Calendário'], ['plano', '6 meses']].map(([k, l]) => `<button data-vcron="${k}" aria-pressed="${vistaCron === k}">${l}</button>`).join('')}</div>`;
  if (vistaCron === 'plano') return cab('PLANEJAMENTO', 'Cronograma', 'Uma fase por mês, com metas, tarefas e peças já distribuídas.', tabs) + plano6();
  if (!mesCal) { const d = hoje(); mesCal = new Date(d.getFullYear(), d.getMonth(), 1) }
  const y = mesCal.getFullYear(), m = mesCal.getMonth(), ini = segunda(new Date(y, m, 1)), cel = [];
  for (let i = 0; i < 42; i++) { const d = somaDias(ini, i); if (i >= 35 && d.getMonth() !== m) break; cel.push(d) }
  const datas = P.DATAS.filter(d => d.m === m + 1);
  return cab('PLANEJAMENTO', 'Cronograma', 'Arraste uma peça para mudar o dia. Clique para abrir a prévia, o roteiro e a legenda.', tabs) +
  `<div class="cal-top"><div class="cal-mes"><h2>${MESES[m]} <span>${y}</span></h2><button class="btn ghost sq" data-mes="-1" aria-label="Mês anterior">${I('left')}</button><button class="btn ghost sq" data-mes="1" aria-label="Próximo mês">${I('right')}</button><button class="btn ghost sm" data-mes="0">Hoje</button></div>
    <div class="legenda">${STATUS.map(s => `<span><i class="lg-${s.id}"></i>${s.nome}</span>`).join('')}<span><i class="lg-data"></i>Data comemorativa</span></div></div>
  <div class="cal"><div class="cal-sem">${['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(d => `<span>${d}</span>`).join('')}</div><div class="cal-grade">${cel.map(d => { const s = iso(d), ps = C.posts.filter(p => p.data === s), fora = d.getMonth() !== m, hjd = s === iso(hoje()), dt = datas.find(x => x.d === d.getDate() && !fora);
      return `<div class="cal-dia ${fora ? 'fora' : ''} ${hjd ? 'hoje' : ''}" data-drop="${s}"><span class="cal-n">${d.getDate()}</span>${dt ? `<span class="cal-data" title="${E(dt.t)}">${E(dt.t)}</span>` : ''}
        ${ps.map(p => `<button class="cal-post s-${p.status}" draggable="true" data-drag="${p.id}" data-post="${p.id}"><span class="cp-mini">${capa(p, { chips:false })}</span><span class="cp-t"><b>${E(P.FORMATOS[p.formato].curto)}</b>${E(p.titulo)}</span></button>`).join('')}
        <button class="cal-add" data-novo="${s}" aria-label="Nova peça em ${fmt(s)}">${I('plus')}</button></div>` }).join('')}</div></div>`;
}
function plano6() {
  const w0 = semanaAtual();
  return `<div class="mapa">${P.FASES.map(f => { const ps = C.posts.filter(p => P.SEMANAS[p.semana]?.f === f.n), pub = ps.filter(p => p.status === 'publicado').length, at = P.SEMANAS[w0].f === f.n, feito = ps.length && pub === ps.length;
      return `<a href="#cronograma" data-irfase="${f.n}" class="mapa-n ${at ? 'at' : ''} ${feito ? 'ok' : ''}" style="--c:${f.cor}"><span class="mn-bola">${feito ? I('check') : f.n}</span><strong>${f.nome}</strong><small>${pub}/${ps.length} peças</small></a>` }).join('')}</div>
  <div class="fases">${P.FASES.map(f => { const sems = P.SEMANAS.map((s, i) => ({ ...s, i })).filter(s => s.f === f.n), ps = C.posts.filter(p => sems.some(s => s.i === p.semana)), pub = ps.filter(p => p.status === 'publicado').length, at = sems.some(s => s.i === w0);
    return `<section class="card fase ${at ? 'atual' : ''}" id="fase-${f.n}" style="--c:${f.cor}"><div class="fase-cab"><span class="fase-n">${String(f.n).padStart(2, '0')}</span><div><span class="eyebrow"><i></i>MÊS ${f.n}${at ? ' · VOCÊ ESTÁ AQUI' : ''}</span><h2>${f.nome}</h2><p class="muted">${E(f.obj)}</p></div><div class="fase-prog"><strong>${pub}/${ps.length}</strong><small>publicadas</small><i class="barra"><b style="width:${ps.length ? pub / ps.length * 100 : 0}%"></b></i></div></div>
      <ul class="kpis">${f.kpis.map(k => `<li>${I('flag')}${E(k)}</li>`).join('')}</ul>
      <div class="semanas">${sems.map(s => { const lp = C.posts.filter(p => p.semana === s.i), tf = s.tarefas.filter((_, j) => C.tarefas[`${s.i}.${j}`]).length;
        return `<details class="semana" ${s.i === w0 ? 'open' : ''}><summary><span class="sem-n">S${s.i + 1}</span><strong>${E(s.tema)}</strong><span class="muted">${fmt(somaDias(segunda(dataDe(C.perfil.inicio)), s.i * 7))} · ${lp.filter(p => p.status === 'publicado').length}/${lp.length} peças · ${tf}/${s.tarefas.length} tarefas</span>${I('right', 'ic chev')}</summary>
          <div class="sem-corpo"><div class="plist">${lp.map(linhaPost).join('')}</div><ul class="tarefas">${s.tarefas.map((t, j) => `<li><label><input type="checkbox" data-tarefa="${s.i}.${j}" ${C.tarefas[`${s.i}.${j}`] ? 'checked' : ''}><span class="box-ck">${I('check')}</span><span>${E(t)}</span></label></li>`).join('')}</ul></div></details>` }).join('')}</div></section>` }).join('')}</div>`;
}
let filtroP = { st:'todos', q:'', dens:4 };
function pecas(tipo) {
  const nome = { carrosseis:'Carrosséis', reels:'Reels', outros:'Posts e stories' }[tipo];
  const base = C.posts.filter(p => tipo === 'reels' ? p.formato.startsWith('reels') : tipo === 'outros' ? ['post', 'stories', 'live', 'youtube'].includes(p.formato) : p.formato === 'carrossel');
  const grupos = [['todos', 'Todas', () => true], ['ideia', 'Ideias', p => p.status === 'ideia'], ['prod', 'Em produção', p => ['roteiro', 'producao', 'edicao'].includes(p.status)], ['agendado', 'Programadas', p => p.status === 'agendado'], ['publicado', 'Publicadas', p => p.status === 'publicado']];
  const g = grupos.find(x => x[0] === filtroP.st), q = filtroP.q.toLowerCase();
  const lista = base.filter(g[2]).filter(p => !q || (p.titulo + ' ' + p.legenda).toLowerCase().includes(q));
  return cab('CRIAÇÃO', nome, `${base.length} peças no plano · da próxima para a mais distante.`, `<button class="btn" data-novo="${iso(somaDias(hoje(), 1))}" data-fmt="${tipo === 'reels' ? 'reels' : tipo === 'outros' ? 'post' : 'carrossel'}">${I('plus')}Nova peça</button>`) +
  `<div class="barra-f"><div class="seg">${grupos.map(([k, l, f]) => `<button data-fst="${k}" aria-pressed="${filtroP.st === k}">${l} <span>${base.filter(f).length}</span></button>`).join('')}</div>
    <label class="busca">${I('search')}<input id="fpq" type="search" placeholder="Buscar por título ou legenda" value="${E(filtroP.q)}" aria-label="Buscar peças"></label>
    <div class="seg dens">${[3, 4, 5, 6].map(n => `<button data-dens="${n}" aria-pressed="${filtroP.dens === n}" aria-label="${n} colunas">${'<i></i>'.repeat(n)}</button>`).join('')}</div></div>
  <div class="grade" style="--cols:${filtroP.dens}">${lista.map(p => `<button class="gcard" data-post="${p.id}">${capa(p)}<span class="gc-info"><small>${fmt(p.data, { weekday:'short', day:'2-digit', month:'short' })} · semana ${p.semana + 1}</small><strong>${E(p.titulo)}</strong>${p.num ? `<span class="gc-num"><b>${num(p.num.alcance)}</b> alcance · <b>${num(p.num.salvos)}</b> salvos</span>` : ''}</span></button>`).join('') || '<p class="muted">Nenhuma peça neste filtro.</p>'}</div>`;
}
function producao() {
  const w = semanaAtual(), f = window.__pf || 'proximas';
  const lista = C.posts.filter(p => f === 'todas' ? true : f === 'proximas' ? p.semana >= w && p.semana <= w + 2 : p.semana === w);
  return cab('CRIAÇÃO', 'Produção', 'Arraste os cartões entre as etapas. Cada avanço rende XP.', `<div class="seg">${[['semana', 'Esta semana'], ['proximas', '3 semanas'], ['todas', 'Tudo']].map(([v, l]) => `<button data-prodf="${v}" aria-pressed="${f === v}">${l}</button>`).join('')}</div>`) +
  `<div class="kanban">${STATUS.map(s => { const l = lista.filter(p => p.status === s.id);
    return `<section class="col" data-dropst="${s.id}"><div class="col-h"><span class="st st-${s.id}">${s.nome}</span><b>${l.length}</b>${PTS[s.id] ? `<em>+${PTS[s.id]} XP</em>` : ''}</div>
      <div class="col-l">${l.map(p => `<article class="kcard" draggable="true" data-drag="${p.id}"><button class="kc-b" data-post="${p.id}"><span class="kc-capa">${capa(p, { chips:false })}</span><span class="kc-t"><span class="lp-meta">${chipF(p.formato)}<small>${fmt(p.data)}</small></span><strong>${E(p.titulo)}</strong></span></button>
        <div class="kc-nav">${STI[p.status] > 0 ? `<button data-mover="${p.id}" data-d="-1" aria-label="Voltar etapa">${I('left')}</button>` : '<span></span>'}${STI[p.status] < 5 ? `<button data-mover="${p.id}" data-d="1">${STATUS[STI[p.status] + 1].nome} ${I('right')}</button>` : ''}</div></article>`).join('') || '<p class="muted vazio-c">Arraste uma peça para cá.</p>'}</div></section>` }).join('')}</div>`;
}
let fId = { area:'todas', formato:'todos', pilar:'todos', q:'', fav:false };
function ideias() {
  const areas = C.perfil.areas, todas = todasIdeias(areas).map(ideia), usadas = new Set(C.posts.map(p => p.ideia)), q = fId.q.toLowerCase();
  const lista = todas.filter(x => (fId.area === 'todas' || x.area === fId.area) && (fId.formato === 'todos' || x.formato === fId.formato) && (fId.pilar === 'todos' || x.pilar === fId.pilar) && (!fId.fav || C.favoritas.includes(x.id)) && (!q || (x.titulo + ' ' + (x.t || '')).toLowerCase().includes(q)));
  const sel = (k, v, l) => `<button class="chip" data-fid="${k}" data-v="${v}" aria-pressed="${fId[k] === v}">${l}</button>`;
  return cab('CRIAÇÃO', 'Banco de ideias', `${todas.length} ideias para as suas áreas. Favorite e coloque no cronograma com um clique.`) +
  `<div class="filtros"><label class="busca">${I('search')}<input id="fq" type="search" placeholder="Buscar tema ou palavra" value="${E(fId.q)}" aria-label="Buscar ideias"></label>
    <div class="chips">${sel('area', 'todas', 'Todas as áreas')}${areas.map(a => sel('area', a, AREA[a].nome)).join('')}<button class="chip" data-favf aria-pressed="${fId.fav}">${I('star')}Favoritas</button></div>
    <div class="chips">${sel('formato', 'todos', 'Todos os formatos')}${['carrossel', 'reels', 'post', 'stories', 'live', 'youtube'].map(f => sel('formato', f, P.FORMATOS[f].curto)).join('')}</div>
    <div class="chips">${sel('pilar', 'todos', 'Todos os pilares')}${Object.entries(P.PILARES).map(([k, p]) => sel('pilar', k, p.nome)).join('')}</div></div>
  <p class="muted contagem">${lista.length} ideias</p>
  <div class="ideias">${lista.slice(0, 120).map(x => { const fav = C.favoritas.includes(x.id), us = usadas.has(x.id);
    return `<article class="icard" style="--c:${AREA[x.area].cor}"><div class="ic-top"><span class="lp-meta">${chipF(x.formato)}<small>${P.PILARES[x.pilar].nome}</small></span><button class="fav ${fav ? 'on' : ''}" data-fav="${x.id}" aria-pressed="${fav}" aria-label="Favoritar">${I('star')}</button></div>
      <h3>${E(x.titulo)}</h3><p class="ic-area">${dot(x.area)}${E(AREA[x.area].nome)}${us ? ' · no cronograma' : ''}</p>
      <div class="acoes"><button class="btn sm" data-addideia="${x.id}">${I('plus')}Cronograma</button><button class="btn sm ghost" data-verideia="${x.id}">Roteiro</button></div></article>` }).join('')}</div>`;
}
let abaRot = 'ganchos', temaG = '';
function roteiros() {
  const pf = C.perfil, a = AREA[pf.principal], tema = temaG || a.temas[0].t, abas = [['ganchos', 'Ganchos'], ['ctas', 'Chamadas finais'], ['estruturas', 'Estruturas'], ['meus', 'Próximos roteiros']];
  let c = '';
  if (abaRot === 'meus') { const w = semanaAtual(); c = `<div class="plist">${C.posts.filter(p => p.semana >= w && p.semana <= w + 3).map(linhaPost).join('')}</div>` }
  if (abaRot === 'ganchos') c = `<label class="campo" style="max-width:420px;margin-bottom:16px">Tema para testar<select id="gt">${pf.areas.flatMap(ar => AREA[ar].temas.map(x => `<option ${x.t === tema ? 'selected' : ''}>${E(x.t)}</option>`)).join('')}</select></label>
    <ol class="glist">${P.GANCHOS.map(g => { const t = g.replace('{t}', tema); return `<li><span>${E(t)}</span><button class="btn sm ghost" data-copy="${E(t)}">${I('copy')}Copiar</button></li>` }).join('')}</ol>`;
  if (abaRot === 'ctas') c = `<ol class="glist">${P.CTAS.map((x, i) => { const t = CTA(a, i); return `<li><span>${E(t)}</span><button class="btn sm ghost" data-copy="${E(t)}">${I('copy')}Copiar</button></li>` }).join('')}</ol><div class="nota">${I('shield')}<span>Convide a salvar, compartilhar e comentar. “Me chame para contratar” soa como captação: veja a aba Ética.</span></div>`;
  if (abaRot === 'estruturas') c = `<div class="estr">${Object.entries(P.FORMATOS).map(([k, f]) => `<button class="card estr-c" style="--c:${f.cor}" data-estr="${k}">${chipF(k)}<h3>${f.nome}</h3><p class="muted">${f.dur} · cerca de ${f.tempo} min</p></button>`).join('')}</div>`;
  return cab('CRIAÇÃO', 'Roteiros', '20 fórmulas de gancho, chamadas finais dentro da ética e a estrutura de cada formato.') + `<div class="tabs">${abas.map(([k, l]) => `<button data-abarot="${k}" aria-selected="${abaRot === k}">${l}</button>`).join('')}</div>${c}`;
}
function leitura() {
  const pubs = C.posts.filter(p => p.status === 'publicado'), comN = pubs.filter(p => p.num && +p.num.alcance), m = met(), u = m[m.length - 1], a = m[m.length - 2];
  const media = (l, k) => l.length ? l.reduce((s, p) => s + (+p.num[k] || 0), 0) / l.length : 0, nomeF = f => (P.FORMATOS[f]?.nome || f).toLowerCase();
  const porF = {}; comN.forEach(p => { const f = p.formato.startsWith('reels') ? 'reels' : p.formato; (porF[f] ||= []).push(p) });
  const fs = Object.keys(porF), melhorAl = fs.slice().sort((x, y) => media(porF[y], 'alcance') - media(porF[x], 'alcance'))[0], melhorSa = fs.slice().sort((x, y) => media(porF[y], 'salvos') - media(porF[x], 'salvos'))[0];
  let titulo, texto;
  if (comN.length >= 3 && melhorAl && melhorSa) { titulo = melhorAl === melhorSa ? `${P.cap(nomeF(melhorAl))} lidera em alcance e em salvamentos.` : `${P.cap(nomeF(melhorAl))} puxa alcance; ${nomeF(melhorSa)} puxa salvamento.`;
    texto = `Com ${comN.length} peças medidas, ${nomeF(melhorAl)} teve alcance médio de ${num(Math.round(media(porF[melhorAl], 'alcance')))} e ${nomeF(melhorSa)} teve ${num(Math.round(media(porF[melhorSa], 'salvos')))} salvamentos por peça.${u && a ? ` Na última semana, o alcance da conta ${+u.alcance >= +a.alcance ? 'subiu' : 'caiu'} ${String(Math.abs(delta(+u.alcance, +a.alcance))).replace('.', ',')}%.` : ''}` }
  else if (u && a) { const d = delta(+u.alcance, +a.alcance); titulo = d >= 0 ? `Alcance subiu ${String(d).replace('.', ',')}% na última semana.` : `Alcance caiu ${String(Math.abs(d)).replace('.', ',')}%: hora de testar ganchos.`;
    texto = `A conta alcançou ${num(u.alcance)} pessoas, com ${num(u.salvos)} salvamentos e ${num(u.compart)} compartilhamentos. Registre os números de cada peça publicada para a leitura comparar formatos.` }
  else { titulo = 'Sua primeira leitura começa com os primeiros números.'; texto = 'Registre a semana em Analytics e os números de cada peça publicada (no visualizador da peça). Com 2 semanas e 3 peças medidas, a Pauta compara formatos e pilares e sugere o próximo passo.' }
  const w = semanaAtual(), fase = P.FASES[P.SEMANAS[w].f - 1], seq = sequencia(), func = [], exp = [], temas = [];
  if (seq) func.push(`Constância: ${seq} ${seq === 1 ? 'semana completa' : 'semanas completas seguidas'}.`);
  if (melhorSa) func.push(`${P.cap(nomeF(melhorSa))} é o formato mais salvo: guarde esse molde.`);
  if (u && a && +u.compart > +a.compart) func.push(`Compartilhamentos subiram de ${num(a.compart)} para ${num(u.compart)}.`);
  const pubP = {}; pubs.forEach(p => pubP[p.pilar] = (pubP[p.pilar] || 0) + 1); const topP = Object.entries(pubP).sort((x, y) => y[1] - x[1])[0];
  if (topP) func.push(`Pilar mais publicado: ${P.PILARES[topP[0]].nome} (${topP[1]} ${topP[1] === 1 ? 'peça' : 'peças'}).`);
  if (!func.length) func.push('Ainda sem dados suficientes. Publique as peças da semana e registre os números.');
  if (!pubF('reels')) exp.push('Publique o primeiro reels nesta semana: é o formato que mais leva o perfil a quem não te segue.');
  if (melhorSa && melhorAl && melhorSa !== melhorAl) exp.push(`Transforme o ${nomeF(melhorSa)} mais salvo em ${nomeF(melhorAl)}, com o mesmo tema.`);
  exp.push(`Foco do mês ${fase.n} (${fase.nome}): ${fase.kpis[0].toLowerCase()}.`);
  if (C.metricas.length < 2) exp.push('Registre as métricas por 2 semanas seguidas, sempre no mesmo dia.');
  const usados = new Set(C.posts.map(p => p.ideia)); C.favoritas.filter(f => !usados.has(f)).slice(0, 3).forEach(f => temas.push(ideia(f).titulo));
  todasIdeias([C.perfil.principal]).filter(i => !usados.has(i) && !i.startsWith('g:')).slice(0, Math.max(0, 3 - temas.length)).forEach(i => temas.push(ideia(i).titulo));
  return { titulo, texto, func:func.slice(0, 3), exp:exp.slice(0, 3), temas };
}
const PROMPT_PRINT = `Vou te mandar prints do Instagram (Painel profissional > Insights) da última semana.
Leia os números e me devolva SÓ estas linhas, sem texto extra:
data: AAAA-MM-DD (o último dia da semana)
seguidores: total de seguidores hoje
alcance: contas alcançadas na semana
salvos: salvamentos na semana
compart: compartilhamentos na semana
visitas: visitas ao perfil na semana
mensagens: conversas iniciadas na semana
Se um número não aparecer, escreva 0.`;
const promptAnalise = () => `Sou advogado(a) de ${(C.perfil.areas || []).map(a => AREA[a].nome).join(', ')} e publico no Instagram ${C.perfil.arroba || ''}.
Estes são os meus números por semana (data; seguidores; alcance; salvos; compartilhamentos; visitas; mensagens):
${met().map(r => [r.data, r.seguidores, r.alcance, r.salvos, r.compart, r.visitas, r.mensagens].join('; ')).join('\n') || '(ainda não registrei)'}
E estas foram as últimas peças publicadas:
${C.posts.filter(p => p.status === 'publicado').slice(-8).map(p => `- ${p.data} · ${P.FORMATOS[p.formato]?.curto || p.formato} · ${p.titulo}${p.num ? ` · alcance ${p.num.alcance || 0}, salvos ${p.num.salvos || 0}` : ''}`).join('\n') || '(nenhuma ainda)'}
Analise: 1) o que está crescendo e o que caiu; 2) quais formatos e temas funcionaram melhor; 3) três ações para a próxima semana, respeitando o Provimento 205/2021 da OAB (sem promessa de resultado nem captação).`;
function comoConectar() {
  return `<section class="card conectar"><div class="card-h"><div><span class="eyebrow"><i></i>COMO ALIMENTAR OS NÚMEROS</span><h2>Seus dados, do jeito que for mais fácil</h2></div><button class="btn ghost sm" data-acao="modoproduzir">${I('pen')}Usar só para produzir e organizar</button></div>
    <div class="cx3"><div class="cx"><span class="cx-n">1</span><b>À mão, 2 minutos por semana</b><p class="muted">No Instagram: perfil › Painel profissional › Insights › últimos 7 dias. Copie os 6 números e toque em “Registrar semana”, sempre no mesmo dia.</p><button class="btn sm" data-acao="regmet">${I('plus')}Registrar semana</button></div>
      <div class="cx"><span class="cx-n">2</span><b>Com IA, a partir de prints</b><p class="muted">Tire prints da tela de Insights, mande no ChatGPT ou no Claude com o texto abaixo e cole a resposta aqui. A Pauta preenche sozinha.</p><div class="acoes"><button class="btn sm ghost" data-copy="${E(PROMPT_PRINT)}">${I('copy')}Copiar o pedido</button><button class="btn sm" data-acao="colarmet">${I('upload')}Colar a resposta</button></div></div>
      <div class="cx"><span class="cx-n">3</span><b>Pedir uma análise à IA</b><p class="muted">Copie este pedido já com os seus números e as suas peças publicadas e cole no ChatGPT ou no Claude para receber uma leitura completa.</p><button class="btn sm ghost" data-copy="${E(promptAnalise())}">${I('copy')}Copiar o pedido de análise</button></div></div>
    <p class="muted small">A ligação automática com o Instagram precisa de uma conta comercial e da API da Meta; quando a Pauta estiver no servidor da PratFlix, ela pode ser ativada. Enquanto isso, os caminhos acima funcionam sem conectar nada.</p></section>`;
}
function insights() {
  const l = leitura(), ini = somaDias(hoje(), -30);
  return cab('DESEMPENHO', 'Insights', 'Leitura automática dos seus números e do seu cronograma. Atualiza sempre que você registra dados.', `<button class="btn branco-b" data-acao="leitura">${I('spark')}Pedir leitura agora</button>`) + comoConectar() +
  `<section class="card azul leitura"><div class="lt-top"><span class="pill-l">${I('spark')}Leitura da Pauta</span><span class="lt-data">${fmt(ini, { day:'2-digit', month:'2-digit', year:'numeric' })} a ${fmt(hoje(), { day:'2-digit', month:'2-digit', year:'numeric' })}</span></div>
    <h2>${E(l.titulo)}</h2><p>${E(l.texto)}</p>
    <div class="lt-cols"><div><h3 class="verde">O que está funcionando</h3><ul>${l.func.map(x => `<li>${E(x)}</li>`).join('')}</ul></div><div><h3>Experimentos para as próximas semanas</h3><ul>${l.exp.map(x => `<li>${E(x)}</li>`).join('')}</ul></div><div><h3>Próximos temas</h3><ul>${l.temas.map(x => `<li>${E(x)}</li>`).join('')}</ul></div></div></section>
  <div class="g3">${[['Peças publicadas', C.posts.filter(p => p.status === 'publicado').length, `de ${C.posts.length} no plano`], ['Em produção', C.posts.filter(p => ['roteiro', 'producao', 'edicao'].includes(p.status)).length, 'roteiro, gravação ou revisão'], ['Atrasadas', C.posts.filter(p => p.status !== 'publicado' && dataDe(p.data) < hoje()).length, 'a data passou sem publicar']].map(([t, v, s]) => `<section class="card kpi"><small class="muted">${t}</small><strong class="big ink">${v}</strong><small class="muted">${s}</small></section>`).join('')}</div>`;
}
function publicados() {
  const l = C.posts.filter(p => p.status === 'publicado').sort((a, b) => b.data.localeCompare(a.data)), ord = window.__ord || 'recentes';
  const ls = ord === 'recentes' ? l : l.slice().sort((a, b) => (+b.num?.[ord] || 0) - (+a.num?.[ord] || 0)), comN = l.filter(p => p.num && +p.num.alcance), md = comN.length ? Math.round(comN.reduce((s, p) => s + +p.num.alcance, 0) / comN.length) : 0;
  return cab('DESEMPENHO', 'Publicados', `${l.length} ${l.length === 1 ? 'peça publicada' : 'peças publicadas'}${comN.length ? ` · alcance médio ${num(md)}` : ''}. Abra uma peça para registrar os números dela.`, `<div class="seg">${[['recentes', 'Recentes'], ['alcance', 'Alcance'], ['salvos', 'Salvos'], ['compart', 'Compart.']].map(([k, n]) => `<button data-ord="${k}" aria-pressed="${ord === k}">${n}</button>`).join('')}</div>`) +
  (l.length ? `<div class="grade" style="--cols:4">${ls.map(p => `<button class="gcard" data-post="${p.id}">${capa(p)}${p.num && md && +p.num.alcance > md ? '<span class="acima">ACIMA DA MÉDIA</span>' : ''}<span class="gc-info"><small>${fmt(p.data, { day:'2-digit', month:'short', year:'2-digit' })} · ${E(P.FORMATOS[p.formato].curto)}</small><strong>${E(p.titulo)}</strong>${p.num ? `<span class="gc-nums"><span><b>${num(p.num.alcance)}</b>alcance</span><span><b>${num(p.num.curtidas)}</b>curtidas</span><span><b>${num(p.num.salvos)}</b>salvos</span><span><b>${num(p.num.compart)}</b>compart.</span></span>` : '<span class="muted">Sem números ainda</span>'}</span></button>`).join('')}</div>` : `<section class="card vazio-g"><span class="ic-bola grande">${I('send')}</span><h2>Nenhuma peça publicada ainda.</h2><p class="muted">Quando uma peça chegar em “Publicado”, ela aparece aqui com os números.</p><a class="btn" href="#producao">Ir para a produção</a></section>`);
}
let perA = 8;
function analytics() {
  const m = met(), cur = m.slice(-perA), prev = m.slice(-perA * 2, -perA), soma = (l, k) => l.reduce((s, r) => s + (+r[k] || 0), 0);
  const novos = l => l.length > 1 ? (+l[l.length - 1].seguidores) - (+l[0].seguidores) : 0;
  const kpis = [['Alcance', soma(cur, 'alcance'), prev.length ? soma(prev, 'alcance') : null], ['Salvamentos', soma(cur, 'salvos'), prev.length ? soma(prev, 'salvos') : null], ['Compartilhamentos', soma(cur, 'compart'), prev.length ? soma(prev, 'compart') : null], ['Seguidores novos', novos(cur), prev.length > 1 ? novos(prev) : null]];
  const u = m[m.length - 1];
  if (!C.metricas.length) return cab('DESEMPENHO', 'Analytics', 'Gráficos dos seus números semana a semana.') + comoConectar();
  return cab('DESEMPENHO', 'Analytics', `${E(C.perfil.arroba || '')}${u ? ` · ${num(u.seguidores)} seguidores` : ''} · ${m.length} ${m.length === 1 ? 'semana registrada' : 'semanas registradas'}`, `<div class="seg">${[4, 8, 12, 26].map(n => `<button data-per="${n}" aria-pressed="${perA === n}">${n} sem.</button>`).join('')}</div><button class="btn" data-acao="regmet">${I('plus')}Registrar semana</button>`) +
  `<div class="g4">${kpis.map(([t, v, p]) => `<section class="card kpi"><small class="muted">${t}</small><div class="kpi-v"><strong class="big ink">${num(v)}</strong>${p !== null ? dChip(delta(v, p)) : ''}</div><small class="muted">${p !== null ? `vs. período anterior: ${num(p)}` : 'compara quando houver o período anterior'}</small></section>`).join('')}</div>
  <section class="card"><div class="card-h"><div><h2>Alcance e visitas ao perfil</h2><small class="muted">Por semana · linha cheia: alcance · tracejada: visitas ao perfil</small></div></div>${grafDuplo(cur)}</section>
  ${m.length ? `<section class="card"><h2>Semanas registradas</h2><div class="tab-w"><table><thead><tr><th>Semana</th><th>Seguidores</th><th>Alcance</th><th>Salvos</th><th>Compart.</th><th>Visitas</th><th>Mensagens</th><th></th></tr></thead><tbody>${m.slice().reverse().map(r => `<tr><td>${fmt(r.data)}</td>${['seguidores', 'alcance', 'salvos', 'compart', 'visitas', 'mensagens'].map(k => `<td>${num(r[k])}</td>`).join('')}<td><button class="btn ghost sq sm" data-delmet="${r.data}" aria-label="Apagar semana">${I('trash')}</button></td></tr>`).join('')}</tbody></table></div></section>` : ''}
  <section class="card"><h2>Perguntas para a revisão do mês</h2><ol class="fix"><li><b>O que mais foi salvo?</b><span>Repita o formato e o tema com outra abordagem.</span></li><li><b>O que mais foi compartilhado?</b><span>Esse assunto conversa com quem ainda não te segue.</span></li><li><b>De onde vieram as mensagens?</b><span>É o assunto que gera confiança.</span></li><li><b>O que não funcionou?</b><span>Troque o gancho e a capa antes de desistir do tema.</span></li></ol></section>`;
}
function grafDuplo(l) {
  if (l.length < 2) return `<div class="graf-vazio alto">${I('chart')}<span>Registre pelo menos 2 semanas para ver o gráfico.</span></div>`;
  const W = 900, H = 260, pl = 54, pb = 28, max = Math.max(...l.map(r => Math.max(+r.alcance, +r.visitas)), 1), x = i => pl + i * ((W - pl - 14) / (l.length - 1)), y = v => H - pb - (v / max) * (H - pb - 14);
  const path = k => l.map((r, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(+r[k]).toFixed(1)}`).join(' ');
  const ticks = [0, .5, 1].map(t => Math.round(max * t));
  return `<svg class="graf2" viewBox="0 0 ${W} ${H}" role="img" aria-label="Alcance e visitas por semana">${ticks.map(t => `<line x1="${pl}" x2="${W - 10}" y1="${y(t)}" y2="${y(t)}" class="g-grid"/><text x="${pl - 8}" y="${y(t) + 4}" text-anchor="end" class="g-tx">${t >= 1000 ? (t / 1000).toFixed(1).replace('.', ',') + ' mil' : t}</text>`).join('')}
    ${l.map((r, i) => `<text x="${x(i)}" y="${H - 8}" text-anchor="middle" class="g-tx">${fmt(r.data)}</text>`).join('')}
    <path d="${path('alcance')} L${x(l.length - 1)},${H - pb} L${pl},${H - pb} Z" class="g-area"/><path d="${path('alcance')}" class="g-l1"/><path d="${path('visitas')}" class="g-l2"/>
    ${l.map((r, i) => `<circle cx="${x(i)}" cy="${y(+r.alcance)}" r="${i === l.length - 1 ? 5 : 3.5}" class="g-pt"><title>${fmt(r.data)}: ${num(r.alcance)} de alcance, ${num(r.visitas)} visitas</title></circle>`).join('')}</svg>`;
}
function conquistas() {
  const nv = nivel(), x = xp();
  return cab('DESEMPENHO', 'Conquistas', 'Cada etapa vale XP: roteiros, publicações, tarefas, métricas e missões do dia.') +
  `<section class="card azul nivel-g"><div class="ng-l"><span class="ng-n">${nv.n}</span><div><small>NÍVEL ${nv.n}</small><h2>${E(nv.nome)}</h2><p>${num(x)} XP${nv.prox ? ` · faltam ${num(nv.ate - x)} XP para ${E(nv.prox)}` : ' · nível máximo'}</p></div></div><span class="fogo grande branco">${I('flame')}${sequencia()} <small>semanas seguidas</small></span><i class="barra grossa clara"><b style="width:${Math.round(nv.pct * 100)}%"></b></i></section>
  <div class="niveis">${NIVEIS.map((n, i) => `<div class="nv ${i + 1 < nv.n ? 'ok' : i + 1 === nv.n ? 'at' : ''}"><span>${i + 1 < nv.n ? I('check') : i + 1}</span><strong>${n[1]}</strong><small>${num(n[0])} XP</small></div>`).join('')}</div>
  <section class="card"><div class="card-h"><h2>Conquistas</h2><span class="muted">${CONQ.filter(c => c.ok()).length} de ${CONQ.length}</span></div><div class="badges">${CONQ.map(c => { const ok = c.ok(); return `<div class="badge ${ok ? 'ok' : ''}"><span class="bd-ic">${I(ok ? c.ic : 'lock')}</span><strong>${c.t}</strong><small>${c.d}</small></div>` }).join('')}</div></section>
  <section class="card"><h2>Como ganhar XP</h2><div class="xp-tab">${[['Peça em Roteiro', 10], ['Em gravação/criação', 20], ['Em revisão', 30], ['Programada', 40], ['Publicada', 60], ['Tarefa do cronograma', 15], ['Missão do dia', 10], ['Primeiro passo', 25], ['Semana de métricas', 30], ['Semana completa', 50]].map(([t, v]) => `<div><span>${t}</span><b>+${v}</b></div>`).join('')}</div></section>`;
}
function contas() {
  return cab('MARCA', 'Contas', 'Cada perfil vira uma marca na barra lateral, com cronograma, métricas e identidade próprios. Troque de perfil num clique.') +
  `<div class="g3 contas-g">${S.contas.filter(c => c.perfil).map(c => { const m = c.metricas.slice().sort((a, b) => a.data.localeCompare(b.data)), u = m[m.length - 1], pub = c.posts.filter(p => p.status === 'publicado').length;
    return `<section class="card conta" style="--c:${c.cor}"><div class="ct-top">${av(c, 'grande')}<div><strong>${E(c.perfil.marca || c.perfil.nome)}</strong><small>${E(c.perfil.arroba || '')}</small></div><span class="on-dot ${c.id === C.id ? 'on' : ''}" title="${c.id === C.id ? 'Conta aberta' : 'Conta fechada'}"></span></div>
      <strong class="big ink">${u ? num(u.seguidores) : '—'}</strong><small class="muted cap">SEGUIDORES</small>
      <div class="mini3"><div><strong>${c.posts.length}</strong><small>peças</small></div><div><strong>${pub}</strong><small>publicadas</small></div><div><strong>${c.perfil.areas.length}</strong><small>áreas</small></div></div>
      <div class="ct-f"><div class="cores mini">${CORES.map(k => `<button class="cor ${c.cor === k ? 'on' : ''}" style="--c:${k}" data-corconta="${c.id}" data-k="${k}" aria-label="Cor ${k}"></button>`).join('')}</div>
        <div class="ct-b" id="ct-${c.id}">${S.contas.filter(z => z.perfil).length > 1 ? `<button class="btn ghost sq sm" data-delconta="${c.id}" aria-label="Remover conta">${I('close')}</button>` : ''}<button class="btn sm" data-conta="${c.id}" style="background:${c.cor};border-color:${c.cor}">Abrir ${I('right')}</button></div></div></section>` }).join('')}
    <button class="card conta add" data-acao="novaconta"><span class="ic-bola grande">${I('plus')}</span><strong>Adicionar conta</strong><small class="muted">Outro perfil, com plano e identidade próprios</small></button></div>`;
}
function bios() {
  const pf = C.perfil, a = AREA[pf.principal], outras = pf.areas.filter(x => x !== pf.principal).map(x => AREA[x].nome), cid = pf.cidade || 'Sua cidade/UF', areasTxt = [a.nome, ...outras].join(' e '), prof = pf.tempo === 'estudante' ? 'Estudante de Direito' : 'Advogado(a)';
  return [`${prof} | ${areasTxt}\nExplico seus direitos em linguagem simples\n📍 ${cid} · OAB/UF 000000\nConteúdos e contato ↓`, `${a.nome} sem juridiquês ⚖️\n${prof} em ${cid}\nToda semana: dúvidas, passos e mitos sobre ${a.nome.toLowerCase()}\nOAB/UF 000000`, `${pf.nome} · ${prof}\n${areasTxt} para ${pf.publico.includes('empresas') ? 'empresas e empreendedores' : 'pessoas e famílias'}\n📍 ${cid} · presencial e online\nOAB/UF 000000 · materiais gratuitos ↓`];
}
function identidade() {
  const pf = C.perfil, idt = C.identidade, pals = [{ id:'marca', nome:'Cor da marca', cores:PAL_MARCA().cores }, ...P.PALETAS];
  const dest = ['Sobre mim', ...pf.areas.flatMap(a => AREA[a].destaques.slice(0, pf.areas.length > 2 ? 1 : 2)), 'Dúvidas', 'Conteúdos'].slice(0, 7), pal = paleta();
  return cab('MARCA', 'Identidade', 'Cor, paleta e fontes das capas. Tudo o que você cria na Pauta usa estas escolhas.') +
  `<div class="g2 idt"><section class="card"><h2>Cor da marca</h2><p class="muted">Muda a barra lateral, os botões e os destaques.</p><div class="cores">${CORES.map(c => `<button class="cor ${C.cor === c ? 'on' : ''}" style="--c:${c}" data-corconta="${C.id}" data-k="${c}" aria-label="Cor ${c}"></button>`).join('')}<label class="cor arco" aria-label="Outra cor"><input type="color" id="corlivre" value="${C.cor}"></label></div>
      <h3>Paleta das capas</h3><div class="pals">${pals.map(p => `<button class="pal ${p.id === idt.paleta ? 'on' : ''}" data-pal="${p.id}" aria-pressed="${p.id === idt.paleta}">${p.cores.map(c => `<i style="background:${c}"></i>`).join('')}<span>${p.nome}</span></button>`).join('')}</div>
      <h3>Fontes dos títulos</h3><div class="fons">${[{ id:'figtree', nome:'Figtree', titulo:"'Figtree', sans-serif" }, ...P.FONTES].map(f => `<button class="fon ${f.id === idt.fonte ? 'on' : ''}" data-fon="${f.id}" aria-pressed="${f.id === idt.fonte}"><b style="font-family:${f.titulo}">Aa</b><span>${f.nome}</span></button>`).join('')}</div></section>
    <section class="card"><h2>Prévia das capas</h2><div class="prev-grade">${C.posts.slice(1, 5).map(p => capa(p, { chips:false })).join('')}</div></section></div>
  <div class="g2"><section class="card"><h2>Bio pronta para usar</h2><p class="muted">Troque “OAB/UF 000000” pelo seu número. Até 150 caracteres.</p>${bios().map(b => `<div class="bio"><pre>${E(b)}</pre><div class="bio-f"><small class="muted">${b.length} caracteres</small><button class="btn sm ghost" data-copybio="${E(b)}">${I('copy')}Copiar</button></div></div>`).join('')}</section>
    <section class="card"><h2>Destaques sugeridos</h2><div class="dest">${dest.map(d => `<div class="dest-i"><span style="background:${pal.cores[2]};color:#fff;font-family:${fonteT()}">${E(d.slice(0, 2).toUpperCase())}</span><small>${E(d)}</small></div>`).join('')}</div>
      <h3>3 posts para fixar</h3><ol class="fix"><li><b>Apresentação</b><span>Quem você é, para quem fala e o que publica.</span></li><li><b>O conteúdo mais salvo</b><span>Um carrossel educativo da área principal.</span></li><li><b>Um passo a passo</b><span>O procedimento que mais gera dúvidas.</span></li></ol></section></div>`;
}
let abaEst = 'design';
function estudio() {
  const g = P.GUIAS[abaEst];
  const fig = abaEst === 'video' ? `<figure class="card safe"><svg viewBox="0 0 270 480" role="img" aria-label="Zona segura de um vídeo 9:16"><rect x="1" y="1" width="268" height="478" rx="16" class="sz-out"/><rect x="1" y="1" width="268" height="62" class="sz-no"/><rect x="1" y="374" width="268" height="105" class="sz-no"/><rect x="238" y="63" width="31" height="311" class="sz-no"/><rect x="24" y="80" width="200" height="280" rx="10" class="sz-ok"/><text x="124" y="215" text-anchor="middle" class="sz-t">área segura</text><text x="124" y="233" text-anchor="middle" class="sz-s">título e legendas aqui</text><text x="135" y="36" text-anchor="middle" class="sz-s">250 px · nome e botões</text><text x="135" y="430" text-anchor="middle" class="sz-s">420 px · legenda do app</text></svg><figcaption class="muted">Vídeo 1080×1920: deixe livres o topo, a base e a lateral direita.</figcaption></figure>` : '';
  return cab('MARCA', 'Estúdio', 'Guias práticos de design, gravação, edição e rotina, com medidas e checklists.') + `<div class="tabs">${Object.entries(P.GUIAS).map(([k, x]) => `<button data-abaest="${k}" aria-selected="${abaEst === k}">${x.titulo}</button>`).join('')}</div>
  <div class="guia ${fig ? 'com-fig' : ''}"><div class="guia-l">${g.secoes.map(s => `<section class="card"><h2>${E(s.h)}</h2><ul class="lista-ok">${s.itens.map(i => `<li>${I('check')}<span>${E(i)}</span></li>`).join('')}</ul></section>`).join('')}</div>${fig}</div>`;
}
function etica() {
  return cab('MARCA', 'Ética', 'Cole o texto do post, roteiro ou legenda. A Pauta aponta trechos que costumam contrariar o Provimento 205/2021 e o Código de Ética e Disciplina da OAB.') +
  `<div class="g2"><section class="card"><h2>Verificador de texto</h2><textarea id="etx" rows="9" placeholder="Cole aqui a legenda, o roteiro ou o texto do post."></textarea><div id="eres" class="eres"><p class="muted">O resultado aparece enquanto você digita.</p></div><p class="muted small">O verificador procura padrões comuns e não substitui a sua leitura das normas da OAB.</p></section>
    <div class="coluna"><section class="card"><h2>Pode</h2><ul class="lista-ok">${P.ETICA_PODE.map(x => `<li>${I('check')}<span>${E(x)}</span></li>`).join('')}</ul></section><section class="card"><h2>Não pode</h2><ul class="lista-no">${P.ETICA_NAO.map(x => `<li>${I('close')}<span>${E(x)}</span></li>`).join('')}</ul></section></div></div>`;
}
/* ---------- modelos de posts (15 identidades) ---------- */
const GRUPOS = [['carrossel', 'Carrosséis', 'layers'], ['unica', 'Tela única', 'image'], ['stories', 'Stories e destaques', 'cam'], ['extras', 'Mais ideias', 'spark']];
let abaMod = 'carrossel', ed = null, verTodos = false;
const mstate = () => { const m = (C.modelos ||= { col:'editorial', idt:{}, txt:{}, fotos:{} }); if (typeof m.idt !== 'object' || !m.idt) m.idt = m.idt ? { classica:m.idt } : {}; m.col ||= 'classica'; m.fotos ||= {}; m.txt ||= {}; return m };
const MC = () => COLS[mstate().col] || COLS.editorial;
const PADRAO = window.FOTOS_PADRAO || {};
const fotosEf = () => { const F = mstate().fotos; return { f1:F.f1 || PADRAO.f1, f2:F.f2 || F.f1 || PADRAO.f2 || PADRAO.f1, f3:F.f3 || F.f1 || PADRAO.f3 || PADRAO.f1 } };
const estDe = tid => ({ cores:{}, tk:1, fz:1, fx:50, fy:50, grao:true, ...(mstate().estilo?.[tid] || {}) });
const lum = h => { const n = parseInt(h.slice(1), 16), [r, g, b] = [n >> 16, n >> 8 & 255, n & 255].map(v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4 }); return .2126 * r + .7152 * g + .0722 * b };
function comCores(idt, ov) {
  if (!ov || !Object.keys(ov).length) return idt; const c = { ...idt.c, ...ov };
  if (mstate().col === 'editorial') {
    if (ov.cl) c.ink = lum(c.cl) > .4 ? (lum(idt.c.ink) < .2 ? idt.c.ink : '#1A1A1A') : '#FFFFFF';
    if (ov.es) c.on = lum(c.es) > .45 ? '#1A1A1A' : '#FFFFFF';
    if (ov.ac) { c.aon = lum(c.ac) > .45 ? '#1A1A1A' : '#FFFFFF'; c.hcl = lum(c.ac) > .6 ? c.ink : c.ac; c.hca = c.aon }
    if (ov.ac2 || ov.es || ov.ac) c.hce = lum(c.es) < .3 ? (lum(c.ac2) > .25 ? c.ac2 : '#FFFFFF') : c.ac;
  } else {
    if (ov.bg) { c.ink = lum(c.bg) > .4 ? '#141414' : '#F5F5F5'; c.mu = lum(c.bg) > .4 ? '#555555' : '#BBBBBB'; c.sf = lum(c.bg) > .4 ? '#FFFFFF' : '#1E1E1E' }
    if (ov.cbg) c.cink = lum(c.cbg) > .4 ? '#141414' : '#F5F5F5';
    if (ov.ac) c.on = lum(c.ac) > .45 ? '#141414' : '#FFFFFF';
  }
  return { ...idt, c };
}
const idtRec = () => MC().IDT.find(i => i.ideal.includes(C.perfil.principal)) || MC().IDT[0];
const idtAtual = () => MC().IDT.find(i => i.id === mstate().idt[mstate().col]) || idtRec();
const idtCol = col => COLS[col].IDT.find(i => i.id === mstate().idt[col]) || COLS[col].IDT.find(i => i.ideal.includes(C.perfil?.principal)) || COLS[col].IDT[0];
const handle = () => { const a = (C.perfil.arroba || '').trim(); return a ? (a.startsWith('@') ? a : '@' + a) : '@seuperfil' };
function setK(o, k, v) { const ks = k.split('.'); let x = o; ks.slice(0, -1).forEach((z, i) => { x = x[z] ??= (/^\d+$/.test(ks[i + 1]) ? [] : {}) }); x[ks.at(-1)] = v }
function dadosMod(tid) { const m = mstate(); if (m.dados?.[tid]) return JSON.parse(JSON.stringify(m.dados[tid])); const base = JSON.parse(JSON.stringify(MC().PACKS[tid])), ov = m.txt[tid] || {}; Object.entries(ov).forEach(([k, v]) => setK(base, k, v)); return base }
const materializa = tid => { const m = mstate(); m.dados ||= {}; if (!m.dados[tid]) { m.dados[tid] = dadosMod(tid); delete m.txt[tid] } return m.dados[tid] };
function slidesDe(tid, idt, edit = false) {
  const st = estDe(tid), aj = `--tk:${st.tk};--fx:${st.fx}%;--fy:${st.fy}%;--fz:${st.fz};`;
  return MC().slides(tid, { idt:comCores(idt, st.cores), d:dadosMod(tid), edit, handle:handle(), nome:C.perfil.nome, fotos:fotosEf() })
    .map(h => h.replace('style="', 'style="' + aj).replace('class="mx ', `class="mx ${st.grao ? '' : 'sem-grao '}`));
}
const tipoTh = h => h.includes(' story ') ? 'story' : h.includes(' quad ') ? 'quad' : '';
function modelos() {
  const idt = idtAtual(), rec = idtRec(), minhasS = (C.perfil.estilos || []).filter(k => k.startsWith('serie:')).map(k => k.slice(6)), lista = MC().TPL.filter(t => t.grupo === abaMod).sort((a, b) => minhasS.includes(b.id) - minhasS.includes(a.id));
  const ed2 = mstate().col === 'editorial', m = mstate(), F = m.fotos, meus = (C.perfil.estilos || []).map(achaEst).filter(Boolean);
  const fotosBox = ed2 ? `<div class="fotos-box">${['f1', 'f2', 'f3'].map((k, i) => { const u = F[k] || (i && F.f1) || PADRAO[k]; return `<label class="fb ${F[k] ? 'sua' : ''}" style="${u ? `background-image:url(${u})` : ''}" title="Foto ${i + 1}">${u ? '' : I('cam')}<span>${i + 1}</span><input type="file" accept="image/*" data-upfoto="${k}" hidden></label>` }).join('')}<div><b>${F.f1 ? 'Suas fotos estão nos modelos' : 'Troque pelas suas fotos'}</b><p class="muted small">${F.f1 ? 'A foto 1 entra onde não houver a 2 ou a 3. ' : 'Os modelos vêm com fotos de exemplo. Toque em 1, 2 ou 3 para pôr as suas. '}Ficam só neste navegador.${Object.keys(F).length ? ' <button class="link" data-delfoto="todas">Voltar às fotos de exemplo</button>' : ''}</p></div></div>` : '';
  const atual = chEst(m.col, idt.id), chE = e => e.serie ? 'serie:' + e.serie : chEst(e.col, e.i.id), ativo = e => e.serie ? m.col === 'editorial' : chE(e) === atual, foraDosMeus = meus.length && !meus.some(ativo);
  const am = i => ed2 ? `<span class="idt-am" style="background:${i.c.es};color:${i.c.on}"><b style="font-family:${i.f.d};font-weight:${i.f.dw};letter-spacing:${i.f.dl}">Aa<em style="font-family:${i.f.s};font-style:${i.f.it ? 'italic' : 'normal'};font-weight:400;color:${i.c.hce};margin-left:4px">a</em></b><i>${[i.c.cl, i.c.ac, i.c.ac2].map(c => `<span style="background:${c}"></span>`).join('')}</i></span>`
    : `<span class="idt-am" style="background:${i.c.cbg};color:${i.c.cink}"><b style="font-family:${i.f.t};font-weight:${i.f.tw};font-style:${i.f.it ? 'italic' : 'normal'}">Aa</b><i>${[i.c.bg, i.c.ac, i.c.ac2].map(c => `<span style="background:${c}"></span>`).join('')}</i></span>`;
  const fontes = ed2 ? [idt.f.d, idt.f.s, idt.f.b] : [idt.f.t, idt.f.b];
  return cab('MARCA', 'Modelos', `Duas coleções: a <b>Editorial</b>, com colagem, papel, manuscrita e a sua foto, e a <b>Clássica</b>. Edite o texto direto no slide e baixe em PNG 1080 px.`, `<a class="btn ghost" href="#tendencias">${I('flame')}O que está engajando</a>`) +
  `<section class="card meus-est"><div class="card-h"><h2>${meus.length ? 'Seus estilos' : 'Escolha os seus estilos de arte'}</h2><div class="acoes"><button class="btn ghost sm" data-acao="trocaestilos">${I('palette')}${meus.length ? 'Trocar meus estilos' : 'Escolher estilos'}</button><button class="btn ghost sm" data-acao="vertodos">${I('grid')}${verTodos ? 'Esconder os outros estilos' : 'Ver todos os estilos'}</button></div></div>
    ${meus.length ? `<div class="meus">${meus.map(e => { const k = chE(e), on = ativo(e); return `<button class="meu ${on ? 'on' : ''}" ${e.serie ? `data-abreserie="${e.serie}"` : `data-meuestilo="${k}"`} aria-pressed="${on}"><span class="th">${e.serie ? COLS.editorial.slides(e.serie, { idt:comCores(idtCol('editorial'), estDe(e.serie).cores), d:mstate().col === 'editorial' ? dadosMod(e.serie) : JSON.parse(JSON.stringify(COLS.editorial.PACKS[e.serie])), handle:handle(), nome:C.perfil.nome, fotos:fotosEf() })[0] : thumbEstilo(e.col, e.i)}</span><span><strong>${E(nomeEst(e))}</strong><small>${E(e.serie ? e.t.desc : e.i.desc)}</small><em>${e.serie ? `Série editorial · cores: ${E(idtCol('editorial').nome)} · toque para editar` : `Coleção Clássica${on ? ' · aberta abaixo' : ''}`}</em></span></button>` }).join('')}${foraDosMeus ? `<p class="muted small">Você está vendo <b>${E(idt.nome)}</b>, que não está entre os seus estilos.</p>` : ''}</div>` : '<p class="muted">Escolha 1 ou 2 estilos para eles aparecerem aqui, prontos para usar.</p>'}${fotosBox}</section>` +
  (verTodos || !meus.length ? `<div class="col-sw">${[['editorial', 'Coleção Editorial', `${COLS.editorial.IDT.length} identidades · ${COLS.editorial.TPL.length} modelos com foto`, true], ['classica', 'Coleção Clássica', `${COLS.classica.IDT.length} identidades · ${COLS.classica.TPL.length} modelos`]].map(([k, n, d, nv]) => `<button data-col="${k}" aria-pressed="${m.col === k}"><b>${n}${nv ? '<span class="novo">NOVA</span>' : ''}</b><small>${d}</small></button>`).join('')}</div>` +
  `<section class="card"><div class="card-h"><h2>Escolha a identidade</h2><span class="muted small">Recomendada para ${E(AREA[C.perfil.principal].nome)}: <b>${E(rec.nome)}</b></span></div>
    <div class="idts">${MC().IDT.map(i => `<button class="idt ${i.id === idt.id ? 'on' : ''}" data-idt="${i.id}" aria-pressed="${i.id === idt.id}">${am(i)}<strong>${E(i.nome)}</strong><small>${E(i.desc)}</small>${i.id === rec.id ? '<span class="rec">Recomendada</span>' : ''}</button>`).join('')}</div>
    <div class="idt-info"><span class="muted">Combina com: ${idt.ideal.map(a => `${dot(a)} ${E(AREA[a]?.nome || a)}`).join(' · ')}</span><span class="muted small">Fontes: ${fontes.map(f => E(f.split(',')[0].replace(/'/g, ''))).filter((x, i, l) => l.indexOf(x) === i).join(' + ')}</span></div>
</section>
  ` : '') + `<section class="card"><div class="tabs" role="tablist">${GRUPOS.filter(([k]) => MC().TPL.some(t => t.grupo === k)).map(([k, n, ic]) => `<button class="tab ${abaMod === k ? 'on' : ''}" data-mtab="${k}" role="tab" aria-selected="${abaMod === k}">${I(ic)}${n} <span class="muted">${MC().TPL.filter(t => t.grupo === k).length}</span></button>`).join('')}</div>
    <div class="mods">${lista.map(t => { const sl = slidesDe(t.id, idt), tp = tipoTh(sl[0]);
      const th = t.id === 's3' ? `<span class="dests">${sl.slice(0, 6).map(h => `<span class="th quad">${h}</span>`).join('')}</span>` : `<span class="th ${tp} ${sl.length > 1 ? 'pilha' : ''}">${sl[0]}</span>`;
      return `<button class="mod" data-mod="${t.id}">${th}<span class="mod-n">${minhasS.includes(t.id) && mstate().col === 'editorial' ? '<span class="st st-seu">Seu estilo</span>' : ''}<strong>${E(t.nome)}</strong><span class="st">${sl.length} ${sl.length > 1 ? 'telas' : 'tela'}</span></span><small>${E(t.desc)}</small></button>` }).join('')}</div></section>`;
}
function abrirMod(tid) { ed = { tid }; let el = $('#ed'); if (!el) { el = document.createElement('div'); el.id = 'ed'; document.body.append(el) } document.body.classList.add('travado'); desenhaEd() }
const CAMPOS_COR = { editorial:[['cl', 'Fundo claro'], ['es', 'Fundo escuro'], ['ac', 'Destaque'], ['ac2', 'Destaque 2']], classica:[['bg', 'Fundo'], ['cbg', 'Fundo da capa'], ['ac', 'Destaque'], ['ac2', 'Destaque 2']] };
function desenhaEd() {
  const el = $('#ed'); if (!el || !ed) return; const t = MC().TPL.find(x => x.id === ed.tid), idt = idtAtual(), st = estDe(ed.tid), cor = comCores(idt, st.cores).c, ed2 = mstate().col === 'editorial', F = mstate().fotos, FE = fotosEf();
  const prox = C.posts.filter(p => p.status !== 'publicado').slice(0, 40), n = dadosMod(ed.tid).s?.length || slidesDe(ed.tid, idt).length;
  const rg = (k, rot, min, max, passo, v, suf) => `<label class="ed-rg"><span>${rot}<b data-v="${k}">${Math.round(v * (suf === '%' && max <= 3 ? 100 : 1))}${suf}</b></span><input type="range" min="${min}" max="${max}" step="${passo}" value="${v}" data-est="${k}"></label>`;
  el.innerHTML = `<div class="ed" role="dialog" aria-modal="true" aria-label="Editor do modelo ${E(t.nome)}"><div class="ed-h"><h2>${E(t.nome)}<small>${E(t.desc)}</small></h2>
    <select id="ed-idt" aria-label="Identidade">${MC().IDT.map(i => `<option value="${i.id}" ${i.id === idt.id ? 'selected' : ''}>${E(i.nome)}</option>`).join('')}</select>
    ${prox.length ? `<select id="ed-post" aria-label="Preencher com uma peça do cronograma"><option value="">Preencher com uma peça…</option>${prox.map(p => `<option value="${p.id}">${fmt(p.data)} · ${E(p.titulo.slice(0, 60))}</option>`).join('')}</select>` : ''}
    <button class="btn ghost" data-edreset>${I('refresh')}Restaurar</button><button class="btn" data-edbaixa>${I('download')}<span id="ed-bx">${n > 1 ? 'Baixar tudo (.zip)' : 'Baixar PNG'}</span></button><button class="ed-x" data-edx aria-label="Fechar">${I('close')}</button></div>
    <div class="ed-aj">
      <div class="ed-g"><small>Cores</small><div class="ed-cores">${CAMPOS_COR[mstate().col].map(([k, r]) => `<label title="${r}"><input type="color" value="${cor[k]}" data-cor-ed="${k}"><span>${r}</span></label>`).join('')}${Object.keys(st.cores).length ? '<button class="link" data-edcores>Cores da identidade</button>' : ''}</div></div>
      <div class="ed-g"><small>Texto</small>${rg('tk', 'Tamanho do título ', .7, 1.4, .05, st.tk, '%')}</div>
      ${ed2 ? `<div class="ed-g"><small>Foto</small>${rg('fz', 'Zoom ', 1, 2.5, .05, st.fz, '%')}${rg('fx', 'Horizontal ', 0, 100, 1, st.fx, '%')}${rg('fy', 'Vertical ', 0, 100, 1, st.fy, '%')}</div>
      <div class="ed-g"><small>Suas fotos</small><div class="ed-fotos">${['f1', 'f2', 'f3'].map((k, i) => `<label style="background-image:url(${FE[k] || ''})" title="Trocar a foto ${i + 1}"><span>${i + 1}</span><input type="file" accept="image/*" data-upfoto="${k}" hidden></label>`).join('')}</div></div>` : ''}
      <div class="ed-g"><small>Acabamento</small><label class="ed-ck"><input type="checkbox" data-est="grao" ${st.grao ? 'checked' : ''}> Textura de papel</label></div>
    </div>
    <p class="ed-dica">${I('pen')}<span>Clique no texto para editar. <b>*asteriscos*</b> destacam${ed2 ? ', <b>_sublinhados_</b> põem em negrito. Toque na foto para trocar. Em cada slide: mudar o fundo, duplicar, mover ou apagar' : ''}.</span><input type="file" id="ed-foto" accept="image/*" data-upfoto="f1" hidden></p>
    <div class="ed-sl"></div></div>`;
  desenhaSlides();
}
function desenhaSlides(manterScroll = true) {
  const box = $('.ed-sl'); if (!box || !ed) return; const sx = manterScroll ? box.scrollLeft : 0, sl = slidesDe(ed.tid, idtAtual(), true), ed2 = mstate().col === 'editorial' && dadosMod(ed.tid).s;
  box.innerHTML = sl.map((h, i) => `<div class="ed-it"><span class="th ${tipoTh(h)}" data-sli="${i}">${h}</span><footer><span>${String(i + 1).padStart(2, '0')} / ${String(sl.length).padStart(2, '0')}</span><span class="ed-ops">${ed2 ? `<button data-sop="tom" data-i="${i}" title="Mudar o fundo (claro, escuro, destaque)" aria-label="Mudar o fundo">◐</button><button data-sop="dup" data-i="${i}" title="Duplicar" aria-label="Duplicar slide">${I('copy')}</button>${i ? `<button data-sop="esq" data-i="${i}" title="Mover para a esquerda" aria-label="Mover para a esquerda">${I('left')}</button>` : ''}${i < sl.length - 1 ? `<button data-sop="dir" data-i="${i}" title="Mover para a direita" aria-label="Mover para a direita">${I('right')}</button>` : ''}${sl.length > 1 ? `<button data-sop="del" data-i="${i}" title="Apagar slide" aria-label="Apagar slide">${I('trash')}</button>` : ''}` : ''}<button data-edpng="${i}">${I('download')}PNG</button></span></footer></div>`).join('');
  ajustaTextos(box); box.scrollLeft = sx; const bx = $('#ed-bx'); if (bx) bx.textContent = sl.length > 1 ? 'Baixar tudo (.zip)' : 'Baixar PNG';
}
function opSlide(op, i) {
  const d = materializa(ed.tid), s = d.s, TOM = ['cl', 'es', 'ac'];
  if (op === 'tom') s[i].tom = TOM[(TOM.indexOf(s[i].tom || 'cl') + 1) % 3];
  if (op === 'dup') s.splice(i + 1, 0, JSON.parse(JSON.stringify(s[i])));
  if (op === 'esq' && i) [s[i - 1], s[i]] = [s[i], s[i - 1]];
  if (op === 'dir' && i < s.length - 1) [s[i + 1], s[i]] = [s[i], s[i + 1]];
  if (op === 'del' && s.length > 1) s.splice(i, 1);
  salvar(); desenhaSlides(); if (op === 'dup') toast('Slide duplicado. Edite o texto da cópia.', 'copy');
}
function setEst(k, v) { const m = mstate(); (m.estilo ||= {})[ed.tid] = { ...estDe(ed.tid), [k]:v }; salvar() }
// Reduz a foto para no máximo 1100 px (JPEG) antes de salvar no navegador.
function fotoDe(f) { return new Promise((ok, erro) => { const r = new FileReader(); r.onload = () => { const im = new Image(); im.onload = () => { const k = Math.min(1, 1100 / Math.max(im.width, im.height)), cv = document.createElement('canvas'); cv.width = Math.round(im.width * k); cv.height = Math.round(im.height * k); cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height); ok(cv.toDataURL('image/jpeg', .84)) }; im.onerror = erro; im.src = r.result }; r.onerror = erro; r.readAsDataURL(f) }) }
function fecharEd() { ed = null; $('#ed')?.remove(); document.body.classList.remove('travado'); render(false) }
// Diminui o título quando o texto passa do tamanho do slide.
function ajustaTextos(raiz) { raiz.querySelectorAll('.mx').forEach(sl => {
  const tk = parseFloat(sl.style.getPropertyValue('--tk')) || 1; if (tk !== 1) sl.querySelectorAll('.mx-t').forEach(t => t.style.fontSize = parseFloat(getComputedStyle(t).fontSize) * tk + 'px');
  const largo = () => [...sl.querySelectorAll('.mx-t')].find(t => t.scrollWidth > t.clientWidth + 1);
  for (let n = 0, l; n < 18 && (l = largo()); n++) l.style.fontSize = parseFloat(getComputedStyle(l).fontSize) * .92 + 'px';
  for (let n = 0; n < 10 && sl.scrollHeight > sl.clientHeight + 1; n++) sl.querySelectorAll('.mx-t, .mx-p, .mx-tw-t').forEach(t => t.style.fontSize = parseFloat(getComputedStyle(t).fontSize) * .93 + 'px') }) }
function carregaScript(src, global) { return window[global] ? Promise.resolve() : new Promise((ok, erro) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = erro; document.head.append(s) }) }
async function pngsDe(idxs) {
  await carregaScript('https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/dist/html-to-image.js', 'htmlToImage');
  const off = document.createElement('div'); off.className = 'ed-off'; off.innerHTML = slidesDe(ed.tid, idtAtual()).filter((_, i) => idxs.includes(i)).join(''); document.body.append(off); ajustaTextos(off);
  await document.fonts.ready; const out = [];
  try { const fontCSS = await cssFontes(idtAtual());
    for (const n of off.children) out.push(await htmlToImage.toBlob(n, { pixelRatio:2, width:n.offsetWidth, height:n.offsetHeight, ...(fontCSS ? { fontEmbedCSS:fontCSS } : { skipFonts:true }), cacheBust:false })) }
  finally { off.remove() }
  return out;
}
// Embute só as fontes da identidade (subconjunto latino) para o PNG sair com a tipografia certa.
const cacheF = {};
async function cssFontes(idt) {
  const ck = mstate().col + ':' + idt.id; if (cacheF[ck]) return cacheF[ck];
  const fams = [idt.f.t, idt.f.d, idt.f.s, idt.f.b, idt.f.n, idt.motivo === 'tech' ? "'IBM Plex Mono'" : ''].filter(Boolean).map(f => f.split(',')[0].replace(/'/g, '').trim());
  try { const css = await (await fetch(MC().FONTES_URL)).text(), out = [];
    for (const m of css.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*(@font-face\s*\{[^}]+\})/g)) { if (m[1] !== 'latin') continue; const bloco = m[2], fam = (bloco.match(/font-family:\s*'([^']+)'/) || [])[1]; if (!fams.includes(fam)) continue;
      const url = (bloco.match(/url\(([^)]+)\)/) || [])[1]; if (!url) continue;
      const b = await (await fetch(url)).blob(), d = await new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(b) });
      out.push(bloco.replace(url, d)) }
    return cacheF[ck] = out.join('\n') } catch { return '' }
}
// No Artifact do claude.ai o download passa pela capacidade "downloads"; fora dele, link comum.
async function baixaBlob(b, nome) {
  const dl = window.claude?.use ? await Promise.race([window.claude.use('downloads'), new Promise(r => setTimeout(() => r(null), 1500))]).catch(() => null) : null;
  if (dl) { try { await dl.save({ filename:nome, data:b }) } catch (er) { if (er?.code !== 'declined') toast('O download não foi liberado nesta visualização.', 'close') } return }
  baixaLink(b, nome) }
function baixaLink(b, nome) { const u = URL.createObjectURL(b), a = document.createElement('a'); a.href = u; a.download = nome; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 4000) }
async function exporta(i) {
  const t = MC().TPL.find(x => x.id === ed.tid), nome = `${t.nome}-${idtAtual().nome}`.toLowerCase().normalize('NFD').replace(/[^\w]+/g, '-').replace(/^-|-$/g, ''), n = slidesDe(ed.tid, idtAtual()).length;
  toast('Gerando as imagens…', 'download');
  try {
    if (i !== undefined || n === 1) { const [b] = await pngsDe([i ?? 0]); await baixaBlob(b, `${nome}-${String((i ?? 0) + 1).padStart(2, '0')}.png`) }
    else { await carregaScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js', 'JSZip'); const bs = await pngsDe([...Array(n).keys()]), z = new JSZip();
      bs.forEach((b, k) => z.file(`${String(k + 1).padStart(2, '0')}.png`, b)); await baixaBlob(await z.generateAsync({ type:'blob' }), `${nome}.zip`) }
    C.flags.modelo = true; salvar(); toast('Pronto! Imagens em 1080 px.', 'check');
  } catch (er) { console.error(er); toast('Não foi possível gerar as imagens neste navegador.', 'close') }
}

/* ---------- tendências ---------- */
let fVir = 'todos', areaVir = '';
function tendencias() {
  const pf = C.perfil, a = AREA[pf.principal], av = areaVir && pf.areas.includes(areaVir) ? areaVir : pf.principal, sinais = ['todos', ...new Set(TD.VIRAIS.map(v => v.sinal))];
  const lista = TD.VIRAIS.map((v, i) => ({ v, i })).filter(({ v }) => fVir === 'todos' || v.sinal === fVir), usadas = new Set(C.posts.map(p => p.ideia));
  return cab('CRIAÇÃO', 'Tendências', 'O que mais aparece, engaja e viraliza nos perfis de advocacia, em formatos prontos para o seu cronograma.') +
  `<section class="card tend-hero"><h2>O que a análise mostrou</h2><p>${E(TD.ANALISE.resumo)}</p></section>
  <section class="card"><h2>8 padrões dos posts que mais circulam</h2><div class="achados" style="margin-top:16px">${TD.ANALISE.achados.map((x, i) => `<div class="achado"><i>${String(i + 1).padStart(2, '0')}</i><b>${E(x.t)}</b><span>${E(x.d)}</span></div>`).join('')}</div></section>
  <section class="card"><h2>Escolha o formato pelo resultado que você quer</h2><div class="sinais" style="margin-top:16px">${TD.ANALISE.sinais.map(x => `<button class="sinal" data-fvir="${x.k}"><b>Mais ${E(x.k.toLowerCase())}s</b><span>${E(x.d)}</span></button>`).join('')}</div></section>
  <section class="card"><div class="card-h"><h2>${TD.VIRAIS.length} formatos virais</h2><span class="muted small">Exemplos com temas de ${E(a.nome)}</span></div>
    <div class="chips" style="margin:14px 0 18px">${sinais.map(k => `<button class="chip" data-fvir="${k}" aria-pressed="${fVir === k}">${k === 'todos' ? 'Todos' : E(k)}</button>`).join('')}</div>
    <div class="virais">${lista.map(({ v, i }) => { const ti = i % a.temas.length, id = `v:${i}:${a.id}:${ti}`, x = ideia(id);
      return `<article class="viral"><span class="lp-meta">${chipF(v.f)}<span class="sinal-chip">${E(v.sinal)}</span></span><h3>${E(v.nome)}</h3><div class="ex">${E(x.titulo)}</div><p>${E(v.porque)}</p>
        <div class="acoes"><button class="btn sm" data-addideia="${id}">${I('plus')}${usadas.has(id) ? 'De novo' : 'Cronograma'}</button><button class="btn sm ghost" data-verideia="${id}">Estrutura</button></div></article>` }).join('')}</div></section>
  <section class="card"><div class="card-h"><h2>Ideias com potencial de viralizar por área</h2></div>
    <div class="chips" style="margin:14px 0 16px">${pf.areas.map(z => `<button class="chip" data-varea="${z}" aria-pressed="${z === av}">${dot(z)}${E(AREA[z].nome)}</button>`).join('')}</div>
    <div class="av-lista">${(TD.AREA_VIRAIS[av] || []).map((z, i) => { const id = `va:${av}:${i}`; return `<div class="av-it"><span class="num-i">${i + 1}</span><b>${E(z[0])}</b>${chipF(z[1])}<small class="muted">${P.PILARES[z[2]].nome}</small><button class="btn sm" data-addideia="${id}">${I('plus')}Cronograma</button><button class="btn sm ghost" data-verideia="${id}">Roteiro</button></div>` }).join('')}</div>
    <p class="muted small" style="margin-top:12px">Estas ideias também aparecem no Banco de ideias.</p></section>
  <section class="card"><h2>Ritmo que faz crescer</h2><ul class="ritmo" style="margin-top:14px">${TD.ANALISE.ritmo.map(x => `<li>${I('check')}<span>${E(x)}</span></li>`).join('')}</ul></section>`;
}
function ajustes() {
  const pf = C.perfil;
  return cab('MARCA', 'Ajustes', 'Os dados ficam salvos neste navegador. Exporte uma cópia para usar em outro aparelho.') +
  `<div class="g2"><section class="card"><h2>Plano de ${E(pf.marca || pf.nome)}</h2><dl class="dl"><dt>Áreas</dt><dd>${pf.areas.map(a => AREA[a].nome + (a === pf.principal ? ' (principal)' : '')).join(', ')}</dd><dt>Ritmo</dt><dd>${pf.freq} por semana · vídeo: ${{ sim:'sim', asvezes:'às vezes', nao:'não' }[pf.video]}</dd><dt>Início</dt><dd>${fmt(pf.inicio, { day:'2-digit', month:'long', year:'numeric' })}</dd></dl>
    <div class="acoes"><button class="btn" data-acao="editar">${I('pen')}Editar respostas e refazer o plano</button></div></section>
    <div class="coluna"><section class="card"><h2>Backup e calendário</h2><div class="acoes vert"><button class="btn ghost" data-acao="exportar">${I('download')}Exportar todas as contas (.json)</button><label class="btn ghost">${I('upload')}Importar dados<input type="file" id="imp" accept="application/json" hidden></label><button class="btn ghost" data-acao="ics">${I('cal')}Baixar o calendário (.ics)</button></div><p class="muted small">O .ics abre no Google Agenda, no Outlook e no celular.</p></section>
    <section class="card"><h2>Tema</h2><div class="seg">${[['auto', 'Automático'], ['light', 'Claro'], ['dark', 'Escuro']].map(([k, l]) => `<button data-tema="${k}" aria-pressed="${(S.tema || 'auto') === k}">${l}</button>`).join('')}</div></section>
    <section class="card"><h2>Modo de uso</h2><p class="muted">${C.perfil.modo === 'produzir' ? 'Você está no modo <b>produzir e organizar</b>: sem as telas de números.' : 'Você está no modo <b>completo</b>, com Insights e Analytics.'}</p><div class="acoes">${C.perfil.modo === 'produzir' ? `<button class="btn" data-acao="modocompleto">${I('chart')}Ativar os números</button>` : `<button class="btn ghost" data-acao="modoproduzir">${I('pen')}Usar só para produzir e organizar</button>`}</div></section>
    <section class="card"><h2>Sua conta</h2><p class="muted">Conectado como <b>${E(EMAIL)}</b> (e-mail da PratFlix).</p><div class="acoes"><button class="btn ghost" data-acao="sair">${I('left')}Sair</button></div></section>
    <section class="card perigo"><h2>Recomeçar do zero</h2><p class="muted">Apaga todas as contas, planos e métricas deste navegador.</p><div id="zerar"><button class="btn ghost" data-acao="zerar1">${I('trash')}Apagar tudo</button></div></section></div></div>`;
}

/* ---------- visualizador de peça ---------- */
let vw = null;
function abrirPost(id, modo = 'ver') {
  const p = C.posts.find(x => x.id === id); if (!p) return;
  if (!p.roteiro) p.roteiro = roteiro(p); if (!p.legenda) p.legenda = legenda(p); p.versoes ||= [];
  vw = { id, slide:0, modo, orig:p.roteiro }; salvar(); desenhaVw();
}
function desenhaVw() {
  const p = C.posts.find(x => x.id === vw.id); if (!p) return; const { out, notas } = telas(p), pal = paleta(), vert = p.formato.startsWith('reels') || p.formato === 'stories';
  vw.slide = Math.max(0, Math.min(vw.slide, out.length - 1)); const s = out[vw.slide], ultimo = vw.slide === out.length - 1;
  const alerta = checagem(p.legenda + '\n' + p.roteiro), st = STI[p.status];
  const artes = artePost(p, true), usaArte = artes && artes.length === out.length;
  const slideHTML = (t, i, mini) => { if (usaArte) return `<div class="slide-arte ${mini ? 'mini' : ''}">${arteHTML(artes[i])}</div>`; const ponta = i === 0 || i === out.length - 1, princ = t.linhas.find(l => !/^\[.*\]$/.test(l)) || t.linhas[0] || '', resto = t.linhas.filter(l => l !== princ);
    return `<div class="slide ${vert ? 'vert' : ''} ${mini ? 'mini' : ''} ${ponta ? 'ponta' : ''}" style="--bg:${ponta ? pal.cores[2] : pal.cores[0]};--fg:${ponta ? '#FFF' : pal.cores[1]};--ac:${ponta ? '#FFF' : pal.cores[2]};--ft:${fonteT()}">
      <span class="sl-rot">${E(t.rot)}</span><div class="sl-t">${i === 0 ? destaca(princ.replace(/^“|”$/g, '')) : E(princ.replace(/^“|”$/g, ''))}</div>${mini ? '' : `<div class="sl-r">${resto.map(l => `<p class="${/^\[.*\]$/.test(l) ? 'ph' : ''}">${E(l)}</p>`).join('')}</div>`}
      <span class="sl-pg">${i + 1}/${out.length}</span>${i === 0 && p.formato === 'carrossel' && !mini ? '<span class="sl-arr">Arrasta →</span>' : ''}</div>` };
  $('#modal').innerHTML = `<div class="vw" role="dialog" aria-modal="true" aria-label="Peça: ${E(p.titulo)}">
    <div class="vw-palco"><div class="vw-top"><div class="seg">${[['ver', 'Visualizar', 'eye'], ['editar', 'Editar roteiro', 'pen']].map(([k, l, ic]) => `<button data-vmodo="${k}" aria-pressed="${vw.modo === k}">${I(ic)}${l}</button>`).join('')}</div>${chipF(p.formato)}</div>
      ${vw.modo === 'editar' ? `<div class="vw-edit"><textarea id="vw-rot" class="mono" aria-label="Roteiro">${E(p.roteiro)}</textarea><div class="acoes"><button class="btn sm ghost" data-copyel="vw-rot">${I('copy')}Copiar roteiro</button><button class="btn sm ghost" data-regen>${I('refresh')}Refazer a partir do modelo</button></div></div>` :
      `<div class="vw-slide"><button class="vw-arr" data-sl="-1" aria-label="Tela anterior" ${vw.slide ? '' : 'disabled'}>${I('left')}</button>${slideHTML(s, vw.slide)}<button class="vw-arr" data-sl="1" aria-label="Próxima tela" ${ultimo ? 'disabled' : ''}>${I('right')}</button></div>
      <div class="vw-thumbs">${out.map((t, i) => `<button class="vw-th ${i === vw.slide ? 'on' : ''} ${vert ? 'vert' : ''}" data-slg="${i}" aria-label="Tela ${i + 1}">${slideHTML(t, i, true)}</button>`).join('')}</div>`}</div>
    <aside class="vw-painel"><div class="vw-p-top"><div class="chips-st">${STATUS.map(x => `<button class="cchip c-${x.id} ${x.id === p.status ? 'on' : ''}" data-setst="${x.id}" aria-pressed="${x.id === p.status}">${x.chip}</button>`).join('')}</div><button class="vw-x" data-vfechar aria-label="Fechar">${I('close')}</button></div>
      <input class="vw-tit" id="vw-tit" value="${E(p.titulo)}" aria-label="Título">
      <p class="muted small">${E(AREA[p.area]?.nome)} · ${P.PILARES[p.pilar]?.nome} · semana ${p.semana + 1}${p.versoes.length ? ` · ${p.versoes.length + 1} versões` : ''}</p>
      <div class="vw-sec"><span class="sec-t">Legenda</span><textarea id="vw-leg" rows="7" aria-label="Legenda">${E(p.legenda)}</textarea><div class="leg-f"><small class="muted">${p.legenda.length} caracteres · ${(p.legenda.match(/#/g) || []).length} hashtags</small><button class="btn sm ghost" data-copyel="vw-leg">${I('copy')}Copiar</button></div>
        <div class="eres" id="vw-et">${alerta.length ? alerta.map(r => `<div class="eitem ${r.nivel}">${I(r.nivel === 'proibido' ? 'close' : 'eye')}<span>${E(r.msg)}</span></div>`).join('') : `<div class="eitem ok">${I('shield')}<span>Nenhum alerta de ética.</span></div>`}</div></div>
      <div class="vw-sec"><span class="sec-t">Programar</span><div class="vw-data"><input type="date" id="vw-data" value="${p.data}" aria-label="Data"><select id="vw-fmt" aria-label="Formato">${Object.entries(P.FORMATOS).map(([k, f]) => `<option value="${k}" ${k === p.formato ? 'selected' : ''}>${f.nome}</option>`).join('')}</select></div></div>
      ${p.status === 'publicado' ? `<div class="vw-sec"><span class="sec-t">Números do post</span><div class="vw-nums">${[['alcance', 'Alcance'], ['curtidas', 'Curtidas'], ['salvos', 'Salvos'], ['compart', 'Compart.']].map(([k, l]) => `<label>${l}<input type="number" min="0" inputmode="numeric" data-num="${k}" value="${p.num?.[k] ?? ''}"></label>`).join('')}</div></div>` : ''}
      <details class="vw-sec dt"><summary><span class="sec-t">Checklist antes de publicar</span><small class="muted">${p.check.length}/${P.ETICA_CHECK.length + 3}</small></summary><ul class="tarefas">${[...P.ETICA_CHECK, 'Capa ou gancho testados no celular', 'Legenda revisada', 'Texto dentro da zona segura (vídeo)'].map((t, i) => `<li><label><input type="checkbox" data-pchk="${i}" ${p.check.includes(i) ? 'checked' : ''}><span class="box-ck">${I('check')}</span><span>${E(t)}</span></label></li>`).join('')}</ul></details>
      ${notas.length ? `<details class="vw-sec dt"><summary><span class="sec-t">Dicas de produção</span></summary>${notas.map(n => `<p class="small"><b>${E(n.h)}</b><br>${n.r.map(E).join('<br>')}</p>`).join('')}</details>` : ''}
      ${p.versoes.length ? `<details class="vw-sec dt"><summary><span class="sec-t">Versões</span><small class="muted">${p.versoes.length}</small></summary>${p.versoes.slice().reverse().map((v, i) => `<div class="versao"><span>${I('history')}${fmt(v.data.slice(0, 10), { day:'2-digit', month:'short' })} ${v.data.slice(11, 16)}</span><button class="btn sm ghost" data-restaura="${p.versoes.length - 1 - i}">Restaurar</button></div>`).join('')}</details>` : ''}
      <details class="vw-sec dt"><summary><span class="sec-t">Anotações</span></summary><textarea id="vw-not" rows="4" placeholder="Fontes, links, ideias de imagem.">${E(p.notas)}</textarea></details>
      <div class="vw-acoes">${st < 5 ? `<button class="btn escuro" data-avanca>${I(st === 3 ? 'cal' : 'check')}${st === 3 ? 'Programar no cronograma' : `Avançar para ${STATUS[st + 1].nome}`} <em>+${PTS[STATUS[st + 1].id] - PTS[p.status]} XP</em></button>` : `<span class="st st-publicado">${I('check')}Publicado</span>`}<button class="btn ghost sq" data-delpost aria-label="Apagar peça">${I('trash')}</button></div></aside></div>`;
  document.body.classList.add('travado');
}
function lerVw() {
  const p = C.posts.find(x => x.id === vw?.id); if (!p) return; const g = k => $('#vw-' + k)?.value;
  if (g('tit') !== undefined) p.titulo = g('tit') || p.titulo; if (g('leg') !== undefined) p.legenda = g('leg'); if (g('not') !== undefined) p.notas = g('not');
  if (g('rot') !== undefined) p.roteiro = g('rot'); if (g('data')) { p.data = g('data'); p.semana = semanaDe(p.data) } if (g('fmt')) p.formato = g('fmt');
  $$('[data-num]').forEach(i => { p.num ||= {}; p.num[i.dataset.num] = i.value === '' ? 0 : +i.value });
  salvar();
}
function fecharVw() {
  lerVw(); const p = C.posts.find(x => x.id === vw?.id);
  if (p && vw.orig && p.roteiro !== vw.orig) { p.versoes.push({ data:new Date().toISOString(), roteiro:vw.orig }); p.versoes = p.versoes.slice(-8) }
  vw = null; $('#modal').innerHTML = ''; document.body.classList.remove('travado'); C.posts.sort((a, b) => a.data.localeCompare(b.data)); salvar(); render(false);
}
function modal(html) { $('#modal').innerHTML = `<div class="ov" data-ov><div class="mbox" role="dialog" aria-modal="true" aria-label="Detalhes"><button class="vw-x mbox-x" data-mfechar aria-label="Fechar">${I('close')}</button>${html}</div></div>`; document.body.classList.add('travado') }
function fecharModal() { $('#modal').innerHTML = ''; document.body.classList.remove('travado'); render(false) }
function addIdeia(id, data, fm) {
  const x = ideia(id); let d = data;
  if (!d) { const oc = new Set(C.posts.map(p => p.data)); let c = somaDias(hoje(), 1); for (let i = 0; i < 60 && oc.has(iso(c)); i++) c = somaDias(c, 1); d = iso(c) }
  let formato = fm || x.formato; if (formato === 'reels' && C.perfil.video === 'nao') formato = 'reels-texto';
  const p = novoPost({ data:d, semana:semanaDe(d), formato, pilar:x.pilar, area:x.area, ideia:id, titulo:x.titulo });
  C.posts.push(p); C.posts.sort((a, b) => a.data.localeCompare(b.data)); salvar(); toast(`No cronograma em ${fmt2(d)}.`, 'cal'); return p;
}
function mostrarEtica(txt, alvo) {
  const r = checagem(txt), el = $(alvo); if (!el) return; if (txt.trim() && !C.flags.etica) { C.flags.etica = true; salvar() }
  el.innerHTML = !txt.trim() ? '<p class="muted">O resultado aparece enquanto você digita.</p>' : r.length ? r.map(x => `<div class="eitem ${x.nivel}">${I(x.nivel === 'proibido' ? 'close' : 'eye')}<div><b>${x.nivel === 'proibido' ? 'Revise antes de publicar' : 'Atenção'}</b><span>${E(x.msg)}</span><small>Trecho: “${E((txt.match(x.re) || [''])[0])}”</small></div></div>`).join('') : `<div class="eitem ok">${I('check')}<div><b>Nenhum alerta encontrado</b><span>Confira também o checklist antes de publicar.</span></div></div>`;
}
function regMet() {
  modal(`<span class="eyebrow"><i></i>ANALYTICS</span><h2 class="m-t">Registrar semana</h2><p class="muted">Copie os números dos insights do Instagram, sempre no mesmo dia da semana.</p>
    <form id="fmet" class="fmet"><label class="campo">Data<input type="date" name="data" value="${iso(hoje())}" required></label>${[['seguidores', 'Seguidores'], ['alcance', 'Alcance da semana'], ['salvos', 'Salvamentos'], ['compart', 'Compartilhamentos'], ['visitas', 'Visitas ao perfil'], ['mensagens', 'Mensagens recebidas']].map(([k, l]) => `<label class="campo">${l}<input type="number" min="0" name="${k}" inputmode="numeric" required></label>`).join('')}<button class="btn">${I('check')}Salvar semana <em>+30 XP</em></button></form>`);
}

/* ---------- arquivos ---------- */
function baixar(nome, txt, tipo) { const b = new Blob([txt], { type:tipo }), a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = nome; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove() }, 500) }
function ics() { const esc = s => String(s).replace(/[\\,;]/g, m => '\\' + m).replace(/\n/g, '\\n');
  return `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Pauta PratFlix//PT\n${C.posts.map(p => { const d = p.data.replace(/-/g, ''); return `BEGIN:VEVENT\nUID:${p.id}@pauta\nDTSTAMP:${d}T090000\nDTSTART;VALUE=DATE:${d}\nSUMMARY:${esc(`[${P.FORMATOS[p.formato].curto}] ${p.titulo}`)}\nEND:VEVENT` }).join('\n')}\nEND:VCALENDAR`.replace(/\n/g, '\r\n') }

/* ---------- roteamento ---------- */
const PAGS = { inicio, cronograma, carrosseis:() => pecas('carrosseis'), reels:() => pecas('reels'), outros:() => pecas('outros'), producao, ideias, roteiros, insights, publicados, analytics, conquistas, contas, identidade, estudio, etica, modelos, tendencias, ajustes };
const TIT = { inicio:'Início', cronograma:'Cronograma', carrosseis:'Carrosséis', reels:'Reels', outros:'Posts e stories', producao:'Produção', ideias:'Banco de ideias', roteiros:'Roteiros', insights:'Insights', publicados:'Publicados', analytics:'Analytics', conquistas:'Conquistas', contas:'Contas', identidade:'Identidade', estudio:'Estúdio', etica:'Ética', modelos:'Modelos', tendencias:'Tendências', ajustes:'Ajustes' };
function aplicaTema() { const t = S.tema || 'auto'; if (t === 'auto') document.documentElement.removeAttribute('data-theme'); else document.documentElement.dataset.theme = t }
function telaEntrar(msg = '') {
  document.documentElement.style.setProperty('--brand', CORES[0]);
  $('#app').innerHTML = `<div class="wiz wiz-intro entrar"><div class="intro"><span class="brand-w grande">pauta<b>▸</b></span><h1>Entre com o seu e-mail da PratFlix</h1><p>Use o mesmo e-mail com que você acessa a PratFlix. É ele que guarda o seu cronograma, as suas ideias e os seus modelos.</p>
    <form id="fentrar" class="entrar-f" novalidate><input id="w-email" type="email" inputmode="email" autocomplete="email" placeholder="seuemail@exemplo.com" aria-label="E-mail da PratFlix" required><button class="btn branco" type="submit">Entrar ${I('right')}</button></form>
    <p class="entrar-msg" role="alert">${E(msg)}</p><small class="entrar-ps">Ainda não é aluno da PratFlix? A Pauta faz parte da plataforma.</small></div></div>`;
  setTimeout(() => $('#w-email')?.focus(), 50);
}
async function entrar(email) {
  email = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return telaEntrar('Confira o e-mail: parece incompleto.');
  // No servidor, window.PAUTA_AUTH.verificar(email) confere se o e-mail é de um aluno da PratFlix (true/false).
  if (window.PAUTA_AUTH?.verificar) { try { if (!(await window.PAUTA_AUTH.verificar(email))) return telaEntrar('Não encontramos esse e-mail na PratFlix. Use o e-mail da sua conta de aluno.') } catch { return telaEntrar('Não foi possível conferir agora. Tente de novo em instantes.') } }
  EMAIL = email; try { localStorage.setItem(EMK, email) } catch {}
  S = carregar(); C = S.contas.find(c => c.id === S.atual) || S.contas[0]; salvar(); $('#app').innerHTML = ''; render();
}
function render(topo = true) {
  aplicaTema();
  if (!EMAIL) return telaEntrar();
  if (!C.perfil) { if (!$('.wiz')) onboarding(S.contas.some(c => c.perfil) ? 'conta' : 'novo'); return }
  aplicaCor(); document.body.classList.toggle('modo-produzir', C.perfil.modo === 'produzir'); const h = location.hash.slice(1); rota = PAGS[h] ? h : 'inicio';
  const y = window.scrollY; shell(PAGS[rota]()); document.title = `${TIT[rota]} · Pauta`; window.scrollTo(0, topo ? 0 : y);
  document.body.classList.remove('menu-aberto'); verificaGanhos();
}
window.addEventListener('hashchange', () => { if (ed) { ed = null; $('#ed')?.remove(); document.body.classList.remove('travado') } if (vw) fecharVw(); else if ($('#modal').innerHTML) { $('#modal').innerHTML = ''; document.body.classList.remove('travado') } render() });

/* ---------- eventos ---------- */
document.addEventListener('click', e => { const f = ed && e.target.closest('.ed .ex [data-foto]'); if (f) { const inp = $('#ed-foto'); inp.dataset.upfoto = f.dataset.foto; inp.click() } });
document.addEventListener('click', e => {
  const t = e.target.closest('[data-principal], button, a, label, [data-ov]'); if (!t) return; const d = t.dataset;
  if (d.ov !== undefined && e.target === t) return fecharModal();
  if (d.mfechar !== undefined) return fecharModal();
  // onboarding
  if (d.op) { lerWiz(); const k = d.op, v = d.v; if (d.multi) { const l = wiz.d[k] || []; wiz.d[k] = l.includes(v) ? l.filter(x => x !== v) : [...l, v]; if (!wiz.d[k].length) wiz.d[k] = [v] } else wiz.d[k] = v; desenhaWiz(); return }
  if (d.principal) { e.stopPropagation(); lerWiz(); wiz.d.principal = d.principal; desenhaWiz(); return }
  if (d.area) { lerWiz(); const l = wiz.d.areas; if (l.includes(d.area)) { wiz.d.areas = l.filter(x => x !== d.area); if (wiz.d.principal === d.area) wiz.d.principal = wiz.d.areas[0] || '' } else if (l.length < 4) { l.push(d.area); if (!wiz.d.principal) wiz.d.principal = d.area } else toast('Escolha até 4 áreas.', 'close'); desenhaWiz(); return }
  if (d.cor) { lerWiz(); wiz.d.cor = d.cor; desenhaWiz(); return }
  if (d.freq) { lerWiz(); wiz.d.freq = +d.freq; wiz.d.dias = []; desenhaWiz(); return }
  if (d.dia) { lerWiz(); let l = wiz.d.dias.length ? wiz.d.dias : DIAS_FREQ[wiz.d.freq].slice(); const n = +d.dia; l = l.includes(n) ? l.filter(x => x !== n) : [...l, n]; wiz.d.dias = l; desenhaWiz(); return }
  if (d.wiz) { lerWiz(); if (+d.wiz > 0 && wiz.passo === 5) return concluirWiz(); if (wiz.passo === -1) { wiz.vistoIntro = true; wiz.passo = 0 } else wiz.passo = Math.max(0, Math.min(5, wiz.passo + +d.wiz)); desenhaWiz(); window.scrollTo(0, 0); return }
  if (d.acao === 'abrirpauta') { location.hash = 'inicio'; render(); return }
  if (d.acao === 'cancelawiz') { wiz = { passo:0, d:{}, vistoIntro:true }; render(); return }
  if (d.acao === 'menu') { document.body.classList.toggle('menu-aberto'); return }
  // visualizador
  if (d.vfechar !== undefined) return fecharVw();
  if (d.vmodo) { lerVw(); vw.modo = d.vmodo; desenhaVw(); return }
  if (d.sl) { vw.slide += +d.sl; desenhaVw(); return }
  if (d.slg) { vw.slide = +d.slg; desenhaVw(); return }
  if (d.setst) { lerVw(); C.posts.find(x => x.id === vw.id).status = d.setst; salvar(); desenhaVw(); verificaGanhos(); return }
  if (d.avanca !== undefined) { lerVw(); const p = C.posts.find(x => x.id === vw.id), i = Math.min(5, STI[p.status] + 1); p.status = STATUS[i].id; salvar(); toast(`${STATUS[i].nome}! +${PTS[p.status] - PTS[STATUS[i - 1].id]} XP`, 'bolt'); if (i === 5) confete(); desenhaVw(); verificaGanhos(); return }
  if (d.regen !== undefined) { const p = C.posts.find(x => x.id === vw.id); $('#vw-rot').value = roteiro({ ...p, formato:$('#vw-fmt').value }); toast('Roteiro refeito a partir do modelo.', 'refresh'); return }
  if (d.restaura) { lerVw(); const p = C.posts.find(x => x.id === vw.id), v = p.versoes[+d.restaura]; p.versoes.push({ data:new Date().toISOString(), roteiro:p.roteiro }); p.roteiro = v.roteiro; vw.orig = p.roteiro; salvar(); desenhaVw(); toast('Versão restaurada.', 'history'); return }
  if (d.delpost !== undefined) { if (!t.classList.contains('conf')) { t.classList.add('conf'); t.textContent = 'Apagar?'; return } C.posts = C.posts.filter(x => x.id !== vw.id); vw = null; $('#modal').innerHTML = ''; document.body.classList.remove('travado'); salvar(); render(false); toast('Peça apagada.', 'trash'); return }
  if (d.copyel) return copiar($('#' + d.copyel).value);
  if (d.copy) return copiar(d.copy);
  if (d.copybio) { C.flags.bio = true; salvar(); copiar(d.copybio, 'Bio copiada.'); return }
  // modelos e tendências
  if (d.estilo) { if (d.modo === 'wz') { lerWiz(); wiz.d.estilos = alternaEstilo(wiz.d.estilos || [], d.estilo); desenhaWiz(); return }
    C.perfil.estilos = alternaEstilo(C.perfil.estilos || [], d.estilo); if (C.perfil.estilos.length) aplicaEstilo(C.perfil.estilos.includes(d.estilo) ? d.estilo : C.perfil.estilos[0]); salvar(); return modalEstilos() }
  if (d.festilo) { filtroEst = d.festilo; if (d.modo === 'wz') { lerWiz(); desenhaWiz() } else modalEstilos(); return }
  if (d.abreserie) { aplicaEstilo('serie:' + d.abreserie); salvar(); render(false); return abrirMod(d.abreserie) }
  if (d.meuestilo) { aplicaEstilo(d.meuestilo); if (!MC().TPL.some(t => t.grupo === abaMod)) abaMod = 'carrossel'; salvar(); render(false); return }
  if (d.acao === 'trocaestilos') { filtroEst = mstate().col; return modalEstilos() }
  if (d.acao === 'vertodos') { verTodos = !verTodos; render(false); return }
  if (d.col) { mstate().col = d.col; if (!MC().TPL.some(t => t.grupo === abaMod)) abaMod = 'carrossel'; salvar(); render(false); return }
  if (d.delfoto) { if (d.delfoto === 'todas') mstate().fotos = {}; else delete mstate().fotos[d.delfoto]; salvar(); render(false); toast('Foto removida.', 'trash'); return }
  if (d.idt) { mstate().idt[mstate().col] = d.idt; C.flags.idtmod = true; salvar(); render(false); return }
  if (d.mtab) { abaMod = d.mtab; render(false); return }
  if (d.mod) return abrirMod(d.mod);
  if (d.edx !== undefined) return fecharEd();
  if (d.edbaixa !== undefined) return exporta();
  if (d.edpng !== undefined) return exporta(+d.edpng);
  if (d.edreset !== undefined) { const m = mstate(); delete m.txt[ed.tid]; if (m.dados) delete m.dados[ed.tid]; if (m.estilo) delete m.estilo[ed.tid]; salvar(); desenhaEd(); toast('Modelo restaurado: texto, slides e ajustes originais.', 'refresh'); return }
  if (d.sop) return opSlide(d.sop, +d.i);
  if (d.edcores !== undefined) { setEst('cores', {}); desenhaEd(); return }
  if (d.fvir) { fVir = d.fvir; render(false); return }
  if (d.varea) { areaVir = d.varea; render(false); return }
  // app
  if (d.post) { if ($('#modal').innerHTML && !vw) { $('#modal').innerHTML = '' } abrirPost(d.post); return }
  if (d.conta) { if (vw) fecharVw(); C = S.contas.find(c => c.id === d.conta); S.atual = C.id; salvar(); location.hash = 'inicio'; render(); toast(`Conta: ${C.perfil.marca || C.perfil.nome}`, 'users'); return }
  if (d.acao === 'novaconta') { wiz = { passo:0, d:{}, vistoIntro:true }; onboarding('conta'); return }
  if (d.corconta) { const c = S.contas.find(x => x.id === d.corconta); c.cor = d.k; if (c === C) C.flags.identidade = true; salvar(); render(false); return }
  if (d.delconta) { const box = $('#ct-' + d.delconta); if (!t.classList.contains('conf')) { box.innerHTML = `<span class="small">Remover?</span><button class="btn sm perigo-b conf" data-delconta="${d.delconta}">Sim</button><button class="btn sm ghost" data-acao="cancelar">Não</button>`; return }
    S.contas = S.contas.filter(c => c.id !== d.delconta); if (C.id === d.delconta) { C = S.contas.find(c => c.perfil) || S.contas[0]; S.atual = C.id } salvar(); render(false); toast('Conta removida.', 'trash'); return }
  if (d.acao === 'cancelar') return render(false);
  if (d.mover) { const p = C.posts.find(x => x.id === d.mover), i = Math.max(0, Math.min(5, STI[p.status] + +d.d)); p.status = STATUS[i].id; salvar(); if (+d.d > 0) toast(`${STATUS[i].nome}! +${PTS[STATUS[i].id] - PTS[STATUS[i - 1].id]} XP`, 'bolt'); if (i === 5 && +d.d > 0) confete(); render(false); return }
  if (d.missao) { const k = iso(hoje()), l = C.missoes[k] || []; C.missoes[k] = l.includes(d.missao) ? l.filter(x => x !== d.missao) : [...l, d.missao]; const ms = missoesHoje().find(z => z.k === d.missao); if (ms?.tarefa && C.missoes[k].includes(d.missao)) C.tarefas[ms.tarefa] = true; salvar(); if (C.missoes[k].includes(d.missao)) toast('Missão cumprida! +10 XP', 'target'); render(false); return }
  if (d.addideia) { addIdeia(d.addideia); if ($('#modal').innerHTML) fecharModal(); else render(false); return }
  if (d.verideia) { const x = ideia(d.verideia), fake = novoPost({ ideia:d.verideia, area:x.area, formato:x.formato === 'reels' && C.perfil.video === 'nao' ? 'reels-texto' : x.formato, titulo:x.titulo, pilar:x.pilar });
    return modal(`<span class="lp-meta">${chipF(fake.formato)}${dot(x.area)}<small>${E(AREA[x.area].nome)} · ${P.PILARES[x.pilar].nome}</small></span><h2 class="m-t">${E(x.titulo)}</h2><pre class="mono pre">${E(roteiro(fake))}</pre><div class="acoes"><button class="btn" data-addideia="${d.verideia}">${I('plus')}Pôr no cronograma</button><button class="btn ghost" data-copy="${E(roteiro(fake))}">${I('copy')}Copiar</button></div>`) }
  if (d.fav) { const l = C.favoritas; C.favoritas = l.includes(d.fav) ? l.filter(x => x !== d.fav) : [...l, d.fav]; salvar(); render(false); return }
  if (d.fid) { fId[d.fid] = d.v; render(false); return }
  if (d.favf !== undefined) { fId.fav = !fId.fav; render(false); return }
  if (d.mes) { const n = +d.mes; mesCal = n ? new Date(mesCal.getFullYear(), mesCal.getMonth() + n, 1) : new Date(hoje().getFullYear(), hoje().getMonth(), 1); render(false); return }
  if (d.vcron) { vistaCron = d.vcron; render(false); return }
  if (d.irfase) { e.preventDefault(); $('#fase-' + d.irfase)?.scrollIntoView({ behavior:'smooth', block:'start' }); return }
  if (d.novo) { const f = d.fmt || 'carrossel', ar = C.perfil.principal, mo = { carrossel:'pergunta', reels:'mito', post:'quando' }[f] || 'pergunta'; const p = addIdeia(`${ar}:${Math.floor(Math.random() * 10)}:${mo}`, d.novo, f); abrirPost(p.id); return }
  if (d.fst) { filtroP.st = d.fst; render(false); return }
  if (d.dens) { filtroP.dens = +d.dens; render(false); return }
  if (d.prodf) { window.__pf = d.prodf; render(false); return }
  if (d.ord) { window.__ord = d.ord; render(false); return }
  if (d.per) { perA = +d.per; render(false); return }
  if (d.abarot) { abaRot = d.abarot; render(false); return }
  if (d.estr) { const fake = novoPost({ ideia:`${C.perfil.principal}:0:${{ carrossel:'passo', reels:'mito', 'reels-texto':'mito', post:'quando', stories:'caixa', live:'live', youtube:'longo' }[d.estr]}`, area:C.perfil.principal, formato:d.estr, titulo:'', pilar:'educar' });
    return modal(`<span class="eyebrow"><i></i>ESTRUTURA</span><h2 class="m-t">${P.FORMATOS[d.estr].nome}</h2><p class="muted">${P.FORMATOS[d.estr].dur}</p><pre class="mono pre">${E(roteiro(fake))}</pre>`) }
  if (d.abaest) { abaEst = d.abaest; render(false); return }
  if (d.pal) { C.identidade.paleta = d.pal; C.flags.identidade = true; salvar(); render(false); return }
  if (d.fon) { C.identidade.fonte = d.fon; C.flags.identidade = true; salvar(); render(false); return }
  if (d.delmet) { C.metricas = C.metricas.filter(m => m.data !== d.delmet); salvar(); render(false); return }
  if (d.tema) { S.tema = d.tema; salvar(); render(false); return }
  if (d.acao === 'regmet') return regMet();
  if (d.acao === 'leitura') { render(false); toast('Leitura atualizada com os dados mais recentes.', 'spark'); return }
  if (d.acao === 'editar') { wiz = { passo:0, d:{}, vistoIntro:true }; onboarding('editar'); return }
  if (d.acao === 'exportar') return baixar(`pauta-${iso(hoje())}.json`, JSON.stringify(S, null, 2), 'application/json');
  if (d.acao === 'ics') return baixar('pauta-calendario.ics', ics(), 'text/calendar');
  if (d.acao === 'modoproduzir') { C.perfil.modo = 'produzir'; salvar(); location.hash = 'inicio'; render(); toast('Modo produzir e organizar: as telas de números ficaram escondidas. Dá para voltar em Ajustes.', 'pen'); return }
  if (d.acao === 'modocompleto') { C.perfil.modo = 'completo'; salvar(); render(false); toast('Insights e Analytics de volta ao menu.', 'chart'); return }
  if (d.acao === 'colarmet') return modal(`<span class="eyebrow"><i></i>ANALYTICS</span><h2 class="m-t">Colar a resposta da IA</h2><p class="muted">Cole aqui as linhas que a IA devolveu (data, seguidores, alcance…).</p><textarea id="colamet" rows="9" placeholder="data: 2026-11-08&#10;seguidores: 548&#10;alcance: 5200&#10;…"></textarea><div class="acoes"><button class="btn" data-acao="lercolado">${I('check')}Preencher e salvar</button></div>`);
  if (d.acao === 'lercolado') { const txt = $('#colamet').value, r = {}; txt.split(/\n/).forEach(l => { const m = l.match(/^\s*([a-zçã]+)\s*[:=]\s*([\d.,\-]+)/i); if (m) r[m[1].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')] = m[2] });
    const n = k => +(String(r[k] || '0').replace(/\./g, '').replace(',', '.')) || 0, data = /\d{4}-\d{2}-\d{2}/.test(r.data || '') ? r.data : (txt.match(/\d{4}-\d{2}-\d{2}/) || [iso(hoje())])[0];
    if (!Object.keys(r).length) return toast('Não encontrei os números. Confira o texto colado.', 'close');
    const reg = { data, seguidores:n('seguidores'), alcance:n('alcance'), salvos:n('salvos'), compart:n('compart') || n('compartilhamentos'), visitas:n('visitas'), mensagens:n('mensagens') };
    C.metricas = C.metricas.filter(m => m.data !== reg.data).concat(reg); salvar(); fecharModal(); toast('Semana registrada a partir da IA! +30 XP', 'chart'); return }
  if (d.acao === 'sair') { EMAIL = ''; try { localStorage.removeItem(EMK) } catch {} history.replaceState(null, '', location.pathname); render(); return }
  if (d.acao === 'zerar1') { $('#zerar').innerHTML = `<p><b>Tem certeza?</b> Isso não pode ser desfeito.</p><div class="acoes"><button class="btn perigo-b" data-acao="zerar2">Sim, apagar tudo</button><button class="btn ghost" data-acao="cancelar">Cancelar</button></div>`; return }
  if (d.acao === 'zerar2') { try { localStorage.removeItem(chave()); localStorage.removeItem(KEY1) } catch {} S = carregar(); C = S.contas[0]; wiz = { passo:0, d:{} }; history.replaceState(null, '', location.pathname); onboarding('novo'); return }
});
document.addEventListener('change', e => {
  const t = e.target;
  if (t.dataset.tarefa) { C.tarefas[t.dataset.tarefa] = t.checked; salvar(); if (t.checked) toast('Tarefa concluída! +15 XP', 'target'); render(false); return }
  if (t.dataset.pchk && vw) { const p = C.posts.find(x => x.id === vw.id), i = +t.dataset.pchk; p.check = t.checked ? [...new Set([...p.check, i])] : p.check.filter(x => x !== i); salvar(); return }
  if (t.dataset.num && vw) { lerVw(); return }
  if (t.id === 'vw-data' || t.id === 'vw-fmt') { lerVw(); desenhaVw(); return }
  if (t.id === 'gt') { temaG = t.value; render(false); return }
  if (t.dataset.upfoto) { const f = t.files[0]; if (f) fotoDe(f).then(u => { mstate().fotos[t.dataset.upfoto] = u; try { salvar(); toast('Foto aplicada nos modelos.', 'cam') } catch { toast('A foto é grande demais para salvar.', 'close') } ed ? desenhaEd() : render(false) }); return }
  if (ed && t.dataset?.est === 'grao') { setEst('grao', t.checked); desenhaSlides(); return }
  if (ed && t.dataset?.corEd) { desenhaEd(); return }
  if (t.id === 'ed-idt') { mstate().idt[mstate().col] = t.value; salvar(); desenhaEd(); return }
  if (t.id === 'ed-post') { const p = C.posts.find(x => x.id === t.value); if (!p) return; const o = mstate().txt[ed.tid] ||= {}; if (mstate().col === 'editorial') { if (mstate().dados?.[ed.tid]) { mstate().dados[ed.tid].s[0].titulo = p.titulo; mstate().dados[ed.tid].area = AREA[p.area]?.nome || '' } else { o['s.0.titulo'] = p.titulo; o.area = AREA[p.area]?.nome || '' } } else { o.titulo = p.titulo; o.tag = AREA[p.area]?.nome || ''; o.area = AREA[p.area]?.nome || '' } salvar(); desenhaEd(); toast('Título e área da peça aplicados. Ajuste o resto no slide.', 'pen'); return }
  if (t.id === 'w-corlivre') { lerWiz(); wiz.d.cor = t.value; desenhaWiz(); return }
  if (t.id === 'corlivre') { C.cor = t.value; C.flags.identidade = true; salvar(); render(false); return }
  if (t.id === 'imp') { const f = t.files[0]; if (!f) return; f.text().then(txt => { try { const s = JSON.parse(txt); if (s.v === 2 && s.contas) S = s; else if (s.perfil) { const c = { ...contaNova(), ...s }; S.contas.push(c); S.atual = c.id } else throw 0; C = S.contas.find(c => c.id === S.atual) || S.contas[0]; salvar(); toast('Dados importados.', 'upload'); render() } catch { toast('Arquivo inválido. Use um arquivo exportado pela Pauta.', 'close') } }) }
});
document.addEventListener('input', e => {
  const t = e.target;
  if (ed && t.dataset?.k) { const v = t.innerText.replace(/\n{3,}/g, '\n\n').replace(/\n$/, ''), m = mstate(); if (m.dados?.[ed.tid]) setK(m.dados[ed.tid], t.dataset.k, v); else (m.txt[ed.tid] ||= {})[t.dataset.k] = v; salvar(); return }
  if (ed && t.dataset?.est && t.type === 'range') { setEst(t.dataset.est, +t.value); const b = $(`[data-v="${t.dataset.est}"]`); if (b) b.textContent = (t.max <= 3 ? Math.round(t.value * 100) : t.value) + '%'; clearTimeout(t.__t); t.__t = setTimeout(desenhaSlides, 60); return }
  if (ed && t.dataset?.corEd) { const st = estDe(ed.tid); setEst('cores', { ...st.cores, [t.dataset.corEd]:t.value }); clearTimeout(t.__t); t.__t = setTimeout(desenhaSlides, 80); return }
  if (t.id === 'fq' || t.id === 'fpq') { if (t.id === 'fq') fId.q = t.value; else filtroP.q = t.value; clearTimeout(t.__t); const id = t.id; t.__t = setTimeout(() => { const pos = t.selectionStart; render(false); const n = $('#' + id); n.focus(); n.setSelectionRange(pos, pos) }, 250); return }
  if (t.id === 'etx') return mostrarEtica(t.value, '#eres');
  if (t.id === 'w-nome' || t.id === 'w-marca') { lerWiz(); const b = $('[data-wiz="1"]'); if (t.id === 'w-nome' && b) b.disabled = t.value.trim().length < 2; const r = $('.wiz-r'); if (r) r.innerHTML = previa(); const lg = $('.w-logo'); if (lg) lg.textContent = (wiz.d.marca || wiz.d.nome || 'P')[0].toUpperCase(); return }
  if (t.id === 'vw-leg') { const p = C.posts.find(x => x.id === vw.id); p.legenda = t.value; const r = checagem(t.value + '\n' + p.roteiro); $('#vw-et').innerHTML = r.length ? r.map(x => `<div class="eitem ${x.nivel}">${I(x.nivel === 'proibido' ? 'close' : 'eye')}<span>${E(x.msg)}</span></div>`).join('') : `<div class="eitem ok">${I('shield')}<span>Nenhum alerta de ética.</span></div>`; $('.leg-f small').textContent = `${t.value.length} caracteres · ${(t.value.match(/#/g) || []).length} hashtags`; salvar() }
});
document.addEventListener('focusin', e => { const t = e.target; if (ed && t.dataset?.k && !t.dataset.cru) { const v = t.dataset.k.split('.').reduce((o, z) => o?.[z], dadosMod(ed.tid)); t.dataset.cru = '1'; t.textContent = String(v ?? ''); const r = document.createRange(); r.selectNodeContents(t); r.collapse(false); const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r) } });
document.addEventListener('focusout', e => { if (ed && e.target.dataset?.k && !e.relatedTarget?.dataset?.k) setTimeout(() => { if (ed && !document.activeElement?.dataset?.k) desenhaSlides() }, 0) });
document.addEventListener('submit', e => {
  if (e.target.id === 'fentrar') { e.preventDefault(); return entrar($('#w-email').value) }
  if (e.target.id !== 'fmet') return; e.preventDefault(); const r = Object.fromEntries(new FormData(e.target).entries());
  ['seguidores', 'alcance', 'salvos', 'compart', 'visitas', 'mensagens'].forEach(k => r[k] = +r[k] || 0);
  C.metricas = C.metricas.filter(m => m.data !== r.data).concat(r); salvar(); toast('Semana registrada! +30 XP', 'chart'); fecharModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { if (ed) return fecharEd(); if (vw) fecharVw(); else if ($('#modal').innerHTML) fecharModal() }
  if (vw && vw.modo === 'ver' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName)) { if (e.key === 'ArrowRight') { vw.slide++; desenhaVw() } if (e.key === 'ArrowLeft' && vw.slide) { vw.slide--; desenhaVw() } }
});
document.addEventListener('dragstart', e => { const c = e.target.closest?.('[data-drag]'); if (c) { e.dataTransfer.setData('text/plain', c.dataset.drag); c.classList.add('arrastando') } });
document.addEventListener('dragend', e => e.target.classList?.remove('arrastando'));
document.addEventListener('dragover', e => { const z = e.target.closest?.('[data-drop],[data-dropst]'); if (z) { e.preventDefault(); z.classList.add('alvo') } });
document.addEventListener('dragleave', e => e.target.closest?.('[data-drop],[data-dropst]')?.classList.remove('alvo'));
document.addEventListener('drop', e => {
  const z = e.target.closest?.('[data-drop],[data-dropst]'); if (!z) return; e.preventDefault(); const p = C.posts.find(x => x.id === e.dataTransfer.getData('text/plain')); if (!p) return;
  if (z.dataset.drop) { p.data = z.dataset.drop; p.semana = semanaDe(p.data); C.posts.sort((a, b) => a.data.localeCompare(b.data)); toast(`Remarcado para ${fmt2(p.data)}.`, 'cal') }
  else { p.status = z.dataset.dropst; toast(`${STATUS[STI[p.status]].nome}!`, 'bolt'); if (p.status === 'publicado') confete() }
  salvar(); render(false);
});

render();
})();
