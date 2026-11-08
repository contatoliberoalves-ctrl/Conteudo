/* Pauta · estúdio de conteúdo jurídico (PratFlix)
   App de página única, sem servidor: os dados ficam no navegador (localStorage) e podem ser exportados. */
(() => {
const P = window.PAUTA, AREAS = window.AREAS;
const AREA = Object.fromEntries(AREAS.map(a => [a.id, a]));
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const E = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const KEY = 'pauta.v1';
const STATUS = [
  { id:'ideia', nome:'Ideia' }, { id:'roteiro', nome:'Roteiro' }, { id:'producao', nome:'Gravar / criar' },
  { id:'edicao', nome:'Edição' }, { id:'agendado', nome:'Agendado' }, { id:'publicado', nome:'Publicado' }
];
const STI = Object.fromEntries(STATUS.map((s, i) => [s.id, i]));
const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MESES = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];

/* ---------- ícones ---------- */
const IP = {
  home:'M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z', route:'M5 5h12a4 4 0 0 1 0 8H7a4 4 0 0 0 0 8h12 M5 2v6 M19 18v6',
  cal:'M3 5h18v16H3z M7 2v6 M17 2v6 M3 10h18', board:'M3 4h5v16H3z M10 4h5v10h-5z M17 4h4v13h-4z', bulb:'M9 18h6 M9 21h6 M8 14a7 7 0 1 1 8 0l-1 2H9z',
  pen:'M14 4l6 6 M3 21l5-1L21 7l-5-5L3 15z', cam:'M3 7h4l2-3h6l2 3h4v13H3z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', shield:'M12 2L3 6v6c0 5 9 10 9 10s9-5 9-10V6z M8 12l3 3 5-6',
  user:'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', chart:'M4 20V4 M4 20h17 M8 16v-4 M13 16V8 M18 16V3', grid:'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  gear:'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19 12l2-1-1-3-2 .3-1.4-1.4L17 5l-3-1-1 2h-2L10 4 7 5l.4 2-1.4 1.4L4 8 3 11l2 1v0l-2 1 1 3 2-.3 1.4 1.4L7 19l3 1 1-2h2l1 2 3-1-.4-2 1.4-1.4 2 .4 1-3z',
  check:'M5 12l4 4L19 6', plus:'M12 4v16 M4 12h16', star:'M12 2l3 6 7 1-5 5 1 8-6-4-6 4 1-8-5-5 7-1z', copy:'M8 8h12v12H8z M16 8V4H4v12h4',
  close:'M6 6l12 12 M6 18L18 6', left:'M15 18l-6-6 6-6', right:'M9 18l6-6-6-6', search:'M21 21l-6-6 M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0',
  play:'M8 4l13 8-13 8z', clock:'M12 8v5l3 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0', flag:'M5 21V4 M5 4h11l-2 4 2 4H5', download:'M12 3v12 M7 10l5 5 5-5 M3 16v5h18v-5',
  upload:'M12 21V9 M7 14l5-5 5 5 M3 8V3h18v5', trash:'M4 7h16 M9 7V4h6v3 M6 7l1 14h10l1-14', spark:'M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z', menu:'M3 6h18 M3 12h18 M3 18h18',
  heart:'M12 21s-8-5-8-11a5 5 0 0 1 8-3 5 5 0 0 1 8 3c0 6-8 11-8 11z', tree:'M12 22v-6 M12 16l-6-6h3L5 5h4L12 2l3 3h4l-4 5h3z', bag:'M5 8h14l-1 13H6z M9 8V6a3 3 0 0 1 6 0v2',
  briefcase:'M3 7h18v13H3z M9 7V4h6v3 M3 12h18', scale:'M12 3v18 M5 21h14 M4 8h16 M6 8l-3 6a3 3 0 0 0 6 0z M18 8l-3 6a3 3 0 0 0 6 0z', doc:'M5 2h9l5 5v15H5z M14 2v6h5 M8 13h8 M8 17h8',
  card:'M2 6h20v13H2z M2 10h20 M6 15h4', coin:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M15 9a3 3 0 0 0-3-1.5c-2 0-3 1-3 2s1 1.6 3 2 3 1 3 2-1 2-3 2a3 3 0 0 1-3-1.5 M12 6v1.5 M12 16.5V18',
  building:'M4 21V3h11v18 M15 9h5v12 M8 7h3 M8 11h3 M8 15h3', at:'M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-4 7.5', columns:'M3 21h18 M4 10h16 M12 3l9 5H3z M6 10v8 M10 10v8 M14 10v8 M18 10v8',
  stamp:'M9 3h6l-1 8h-4z M4 14h16v4H4z M6 21h12', cap:'M2 9l10-5 10 5-10 5z M6 11v5c3 2 9 2 12 0v-5 M22 9v6', mic:'M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3z M5 11a7 7 0 0 0 14 0 M12 18v3',
  layers:'M12 3l9 5-9 5-9-5z M3 13l9 5 9-5', eye:'M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z', bolt:'M13 2L4 14h7l-1 8 9-12h-7z'
};
const I = (n, c = 'ic') => `<svg class="${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${IP[n] || IP.doc}"/></svg>`;

/* ---------- estado ---------- */
const novo = () => ({ v:1, perfil:null, posts:[], tarefas:{}, favoritas:[], metricas:[], identidade:{ paleta:'grafite', fonte:'manrope' }, criado:new Date().toISOString() });
let S = carregar();
function carregar() { try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.v === 1) return { ...novo(), ...s } } catch {} return novo() }
function salvar() { try { localStorage.setItem(KEY, JSON.stringify(S)) } catch {} }
let rota = 'painel', toastT = null;
function toast(t) { const el = $('#toast'); el.textContent = t; el.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('on'), 2600) }
async function copiar(t, ok = 'Copiado.') { try { await navigator.clipboard.writeText(t); toast(ok) } catch { toast('Não foi possível copiar. Selecione o texto e copie.') } }

/* ---------- datas ---------- */
const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const dataDe = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d) };
const somaDias = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x };
const segunda = d => { const x = new Date(d); const w = (x.getDay() + 6) % 7; x.setDate(x.getDate() - w); x.setHours(0, 0, 0, 0); return x };
const hoje = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d };
const fmt = (s, o = { day:'2-digit', month:'short' }) => new Intl.DateTimeFormat('pt-BR', o).format(typeof s === 'string' ? dataDe(s) : s).replace('.', '');
const semanaAtual = () => { if (!S.perfil) return 0; const n = Math.floor((hoje() - dataDe(S.perfil.inicio)) / 864e5 / 7); return Math.max(0, Math.min(25, n)) };

/* ---------- ideias ---------- */
function ideia(id) {
  if (id.startsWith('g:')) { const g = P.IDEIAS_GERAIS[+id.slice(2)], a = AREA[S.perfil?.principal] || AREAS[0];
    return { id, titulo:g.t.replace('{area}', a.nome.toLowerCase()), formato:g.f, pilar:g.p, area:a.id, geral:true, t:a.nome.toLowerCase(), q:'', m:'' } }
  if (id.startsWith('d:')) { const [, i, ar] = id.split(':'), d = P.DATAS[+i], a = AREA[ar] || AREA[S.perfil?.principal] || AREAS[0];
    return { id, titulo:`${d.t}: o que você precisa saber`, formato:'carrossel', pilar:'educar', area:a.id, data:true, t:d.t.toLowerCase(), q:'', m:'' } }
  const [ar, ti, mi] = id.split(':'), a = AREA[ar], x = a.temas[+ti], mo = P.MODELOS_IDEIA.find(m => m.id === mi);
  return { id, titulo:mo.titulo(x), gancho:mo.gancho(x), formato:mo.formato, pilar:mo.pilar, area:ar, modelo:mi, ...x };
}
function todasIdeias(areas) {
  const out = [];
  areas.forEach(ar => AREA[ar].temas.forEach((x, ti) => P.MODELOS_IDEIA.forEach(mo => out.push(`${ar}:${ti}:${mo.id}`))));
  P.IDEIAS_GERAIS.forEach((g, i) => out.push('g:' + i));
  return out;
}

/* ---------- gerador do plano ---------- */
const DIAS_FREQ = { 2:[2, 4], 3:[1, 3, 5], 4:[1, 2, 4, 5], 5:[1, 2, 3, 4, 5] };
function gerarPlano(pf, manter = []) {
  const ini = segunda(dataDe(pf.inicio)), areas = pf.areas, posts = [];
  const filas = Object.fromEntries(['carrossel', 'reels', 'post', 'stories', 'live', 'youtube'].map(f => [f, []]));
  // Fila de temas por formato, intercalando as áreas (área principal aparece com mais frequência).
  const ordemAreas = areas.length > 1 ? [pf.principal, ...areas.filter(a => a !== pf.principal), pf.principal] : areas;
  const maxT = Math.max(...areas.map(a => AREA[a].temas.length));
  for (let ti = 0; ti < maxT; ti++) ordemAreas.forEach(ar => { if (!AREA[ar].temas[ti]) return;
    P.MODELOS_IDEIA.forEach(mo => { const k = `${ar}:${ti}:${mo.id}`; if (!filas[mo.formato].includes(k)) filas[mo.formato].push(k) }) });
  // Embaralha levemente mantendo a alternância (rotação por modelo dentro do formato).
  for (const f in filas) { const porModelo = {}; filas[f].forEach(k => { const m = k.split(':')[2]; (porModelo[m] ||= []).push(k) });
    const ms = Object.values(porModelo), r = []; for (let i = 0; r.length < filas[f].length; i++) ms.forEach(l => l[i] && r.push(l[i])); filas[f] = r }
  const usados = new Set(manter.map(p => p.ideia));
  const pega = f => { const fila = filas[f] || filas.carrossel; let k; while ((k = fila.shift()) && usados.has(k)); if (!k) k = filas.carrossel.shift() || `g:${(posts.length % (P.IDEIAS_GERAIS.length - 1)) + 1}`; usados.add(k); return k };
  const gerais = P.IDEIAS_GERAIS.map((g, i) => i).filter(i => i > 0); let gi = 0;
  const dias = (pf.dias && pf.dias.length ? pf.dias : DIAS_FREQ[pf.freq]).slice().sort();
  let liveFeita = false, nPost = 0;
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
      // datas comemorativas da semana
      const dt = P.DATAS.findIndex(d => { const dd = new Date(seg.getFullYear(), d.m - 1, d.d); const dd2 = new Date(seg.getFullYear() + 1, d.m - 1, d.d);
        return [dd, dd2].some(x => x >= seg && x < somaDias(seg, 7)) && (!d.areas.length || d.areas.some(a => areas.includes(a))) });
      if (dt >= 0 && k === 0 && w > 0) { const d = P.DATAS[dt]; id = `d:${dt}:${d.areas.find(a => areas.includes(a)) || pf.principal}` }
      const ide = ideia(id); let formato = fmt || ide.formato;
      if (id.startsWith('d:')) formato = 'carrossel';
      if (formato === 'reels' && pf.video === 'nao') formato = 'reels-texto';
      if (formato === 'reels' && pf.video === 'asvezes' && (w + k) % 2) formato = 'reels-texto';
      if (formato === 'live' && pf.video === 'nao') formato = 'carrossel';
      posts.push({ id:'p' + Math.random().toString(36).slice(2, 9), data, semana:w, formato, pilar:ide.pilar, area:ide.area, ideia:id, titulo:ide.titulo, status:'ideia', roteiro:'', legenda:'', notas:'', check:[] });
    });
  }
  return [...manter, ...posts].sort((a, b) => a.data.localeCompare(b.data));
}

/* ---------- roteiros ---------- */
const CTA = (a, i = 0) => P.CTAS[i % P.CTAS.length].replace('{area}', a.nome.toLowerCase()).replace('{palavra}', (a.destaques[0] || 'GUIA').toUpperCase());
function roteiro(post) {
  const x = ideia(post.ideia), a = AREA[post.area] || AREAS[0], t = x.t || x.titulo, f = post.formato, mod = x.modelo;
  const gancho = x.gancho || x.titulo;
  if (post.ideia === 'g:0') { const pf = S.perfil || {}; return `${f === 'carrossel' ? 'CARROSSEL · 6 slides' : 'POST ÚNICO + LEGENDA'}\n\n${f === 'carrossel' ? 'SLIDE 1 · CAPA\n' : ''}Foto sua, sorrindo, em ambiente de trabalho.\nTítulo: “Prazer, ${pf.nome || '[seu nome]'}”\nApoio: ${pf.areas ? pf.areas.map(x => AREA[x].nome).join(', ') : '[suas áreas]'} em ${pf.cidade || '[cidade]'}\n\n${f === 'carrossel' ? 'SLIDE 2 · QUEM SOU\n' : ''}[Formação, tempo de advocacia e número da OAB]\n\n${f === 'carrossel' ? 'SLIDE 3 · COM O QUE TRABALHO\n' : ''}[As áreas e os assuntos que você mais atende, em linguagem simples]\n\n${f === 'carrossel' ? 'SLIDE 4 · PARA QUEM FALO\n' : ''}[O público: quem vai se beneficiar do perfil]\n\n${f === 'carrossel' ? 'SLIDE 5 · O QUE VOCÊ VAI ENCONTRAR AQUI\n' : ''}[As séries e os temas: dúvidas, mitos, passo a passo]\n\n${f === 'carrossel' ? 'SLIDE 6 · CONVITE\n' : ''}Siga para acompanhar e comente de onde você é.\n\nDEPOIS DE PUBLICAR\n• Fixe este post no topo do perfil.\n• Repita a apresentação nos stories e salve no destaque “Sobre mim”.` }
  if (f === 'carrossel') {
    let miolo;
    if (mod === 'passo') miolo = `SLIDE 2 · QUANDO ISSO ACONTECE\n[Descreva a situação em 2 frases: quem passa por ${t} e por que precisa saber o caminho.]\n\nSLIDE 3 · PASSO 1\n[Primeira ação] — [documento ou lugar]\n\nSLIDE 4 · PASSO 2\n[Segunda ação] — [prazo, se houver]\n\nSLIDE 5 · PASSO 3\n[Terceira ação] — [o que pode dar errado]\n\nSLIDE 6 · PASSO 4\n[Última ação e resultado esperado]\n\nSLIDE 7 · DOCUMENTOS\n[Lista curta dos documentos mais importantes]`;
    else if (mod === 'erros') miolo = `SLIDE 2 · POR QUE ISSO IMPORTA\n[Uma frase sobre o prejuízo de errar em ${t}.]\n\nSLIDE 3 · ERRO 1\n[O erro] → Faça assim: [o certo]\n\nSLIDE 4 · ERRO 2\n[O erro] → Faça assim: [o certo]\n\nSLIDE 5 · ERRO 3\n[O erro] → Faça assim: [o certo]\n\nSLIDE 6 · BÔNUS\n[Uma dica prática que quase ninguém conhece]\n\nSLIDE 7 · O QUE DIZ A LEI\n[Artigo e lei, em linguagem simples]`;
    else if (mod === 'pergunta') miolo = `SLIDE 2 · A DÚVIDA\n“${x.q}”\n[Por que essa dúvida é tão comum]\n\nSLIDE 3 · A RESPOSTA CURTA\n[Responda em uma frase direta]\n\nSLIDE 4 · O QUE DIZ A LEI\n[Artigo, lei ou súmula, explicado]\n\nSLIDE 5 · NA PRÁTICA\n[Exemplo fictício: “Maria, 34 anos…”]\n\nSLIDE 6 · ATENÇÃO\n[Exceção ou cuidado importante]\n\nSLIDE 7 · RESUMO\n[3 linhas para salvar]`;
    else miolo = `SLIDE 2 · CONTEXTO\n[Por que esse assunto importa para quem segue]\n\nSLIDE 3 · PONTO 1\n[Ideia principal]\n\nSLIDE 4 · PONTO 2\n[Segunda ideia]\n\nSLIDE 5 · PONTO 3\n[Terceira ideia]\n\nSLIDE 6 · EXEMPLO\n[Situação fictícia ou fonte]\n\nSLIDE 7 · RESUMO\n[3 linhas para salvar]`;
    return `CARROSSEL · ${P.FORMATOS.carrossel.dur}\n\nSLIDE 1 · CAPA\nTítulo: ${x.titulo}\nApoio: [uma frase curta que gere curiosidade]\nVisual: foto sua ou elemento ligado ao tema · “arrasta →” no canto\n\n${miolo}\n\nSLIDE 8 · CONVITE\n${CTA(a, 0)}\n${CTA(a, 1)}\n\nDESIGN\n• Uma ideia por slide, no máximo 40 palavras.\n• Título dos slides sempre na mesma posição.\n• Destaque uma palavra por slide com a cor de acento.\n• Numere os slides se for passo a passo.`;
  }
  if (f === 'reels' || f === 'reels-texto') {
    let conteudo;
    if (mod === 'mito') conteudo = `Fala: “Não é bem assim.” [Explique a regra correta em 2 ou 3 frases e cite a lei.]\nTela: “MITO” riscado → “VERDADE”\n\nFala: “Na prática, isso significa que…” [consequência para quem assiste]`;
    else if (mod === 'caso') conteudo = `Fala: “Imagine: [personagem fictício] passou por ${t}. [situação em 2 frases].”\nTela: “CASO FICTÍCIO”\n\nFala: “O que a lei diz: [regra].”\nFala: “O que fazer: 1. [ação] 2. [ação] 3. [ação].”`;
    else conteudo = `Fala: “Primeiro: [ponto 1].”\nFala: “Segundo: [ponto 2].”\nFala: “Terceiro: [ponto 3].”\nTela: números 1, 2, 3 aparecendo junto com a fala`;
    if (f === 'reels-texto') return `REELS SEM ROSTO · 15 a 30 s · 1080×1920\n\nTELA 1 (0–3 s) · GANCHO\n“${gancho}”\nImagem de fundo: [mãos escrevendo, mesa, cidade, documento genérico]\n\nTELA 2 (3–8 s)\n[Contexto em uma frase]\n\nTELAS 3 a 5 (8–22 s)\n${conteudo.replace(/Fala: /g, '').replace(/Tela: .*/g, '').trim()}\n\nTELA FINAL\n${CTA(a, 1)}\n\nEDIÇÃO\n• Texto grande no meio da tela, no máximo 12 palavras por tela.\n• Troca de tela a cada 3 a 4 segundos.\n• Música baixa e sem letra.\n• Respeite a zona segura: nada nos 250 px de cima e nos 420 px de baixo.`;
    return `REELS · 30 a 45 s · 1080×1920\n\n[0–3 s] GANCHO\nFala: “${gancho}”\nTela: o gancho em texto grande\n\n[3–10 s] CONTEXTO\nFala: [com quem isso acontece e por que importa]\n\n[10–35 s] CONTEÚDO\n${conteudo}\n\n[35–45 s] FECHAMENTO\nFala: “${CTA(a, 0)}”\n\nEDIÇÃO\n• Corte as pausas: um corte a cada 2 a 4 s.\n• Legenda em 2 linhas, palavra-chave em destaque.\n• Zoom de 110% na frase mais importante.\n• Imagens de apoio: [mãos escrevendo, cidade, mesa].\n• Música bem baixa ou nenhuma.\n\nGRAVAÇÃO\n• Luz de frente, celular na altura dos olhos, microfone de lapela.\n• Grave 2 versões do gancho.`;
  }
  if (f === 'stories') return `SEQUÊNCIA DE STORIES · 5 telas\n\nTELA 1 · PERGUNTA\n“Você sabe o que fazer em caso de ${t}?” + enquete Sim / Não\n\nTELA 2 · CONTEXTO\n[Uma frase sobre por que isso importa]\n\nTELA 3 · CAIXA DE PERGUNTAS\n“${x.titulo.replace('Caixa de perguntas: ', 'Me pergunte sobre ')}”\n\nTELA 4 · RESPOSTA (no dia seguinte)\n[Responda 3 perguntas em vídeos curtos, escondendo o nome de quem perguntou]\n\nTELA 5 · CONVITE\n“O conteúdo completo está no feed” + figurinha de link ou menção\n\nCUIDADO\n• Responda a regra geral, nunca o caso concreto de quem perguntou.`;
  if (f === 'post') return `POST ÚNICO · 1080×1350\n\nFRASE PRINCIPAL (até 12 palavras)\n${x.titulo}\n\nAPOIO (até 25 palavras)\n[Complete a ideia em uma frase]\n\nVISUAL\nFoto sua em ambiente de trabalho ou fundo liso com a frase grande.\n\nNA LEGENDA\n[Explique em 3 parágrafos curtos e termine com: ${CTA(a, 2)}]`;
  if (f === 'live') return `LIVE · 30 a 40 min\n\n00–03 min · ABERTURA\nApresente-se e o tema: ${x.titulo}. Peça para quem chegar comentar a cidade.\n\n03–15 min · CONTEÚDO\nTrês pontos principais sobre ${t}:\n1. [ponto]\n2. [ponto]\n3. [ponto]\n\n15–30 min · PERGUNTAS\nResponda em regra geral. “Cada caso tem detalhes; aqui eu explico a regra.”\n\n30–35 min · ENCERRAMENTO\nResumo em 3 frases + próximo conteúdo da semana.\n\nANTES\n• Divulgue 3 dias antes e no dia (contagem regressiva).\n• Convidado? Combine os tópicos antes.\nDEPOIS\n• Salve a live e corte 3 trechos para reels.`;
  return `VÍDEO LONGO · 6 a 12 min · 16:9\n\n0:00 GANCHO\n“${gancho}”\n\n0:20 O QUE VOCÊ VAI APRENDER\n[3 tópicos]\n\n1:00 PARTE 1\n[conteúdo]\n\n4:00 PARTE 2\n[conteúdo]\n\n7:00 PARTE 3 · EXEMPLO FICTÍCIO\n[conteúdo]\n\n9:30 RESUMO E CONVITE\n${CTA(a, 3)}\n\nMINIATURA\nRosto + 3 a 4 palavras grandes · 1280×720`;
}
function legenda(post) {
  const x = ideia(post.ideia), a = AREA[post.area] || AREAS[0], cidade = (S.perfil?.cidade || '').split('/')[0].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z]/g, '');
  const tags = [...a.tags.slice(0, 3), '#advocacia', cidade ? '#' + cidade : ''].filter(Boolean).join(' ');
  return `${x.gancho || x.titulo}\n\n[Explique em 2 ou 3 parágrafos curtos, uma ideia por parágrafo.]\n\n[Se citar lei, coloque o artigo: “art. ___ da Lei ___”.]\n\n📌 ${CTA(a, 0)}\n\n${tags}`;
}
const checagem = txt => P.ETICA_REGRAS.filter(r => r.re.test(txt || ''));

/* ---------- layout ---------- */
const NAV = [
  { id:'painel', nome:'Painel', ic:'home' }, { id:'cronograma', nome:'Cronograma', ic:'route' }, { id:'calendario', nome:'Calendário', ic:'cal' },
  { id:'producao', nome:'Produção', ic:'board' }, { id:'ideias', nome:'Banco de ideias', ic:'bulb' }, { id:'roteiros', nome:'Roteiros', ic:'pen' },
  { sep:'Aprender e cuidar' }, { id:'estudio', nome:'Estúdio', ic:'cam' }, { id:'etica', nome:'Ética', ic:'shield' },
  { sep:'Seu perfil' }, { id:'perfil', nome:'Perfil e identidade', ic:'user' }, { id:'metricas', nome:'Métricas', ic:'chart' }, { id:'modelos', nome:'Modelos', ic:'grid', tag:'Em breve' }, { id:'ajustes', nome:'Ajustes', ic:'gear' }
];
const MOBILE = ['painel', 'calendario', 'producao', 'ideias'];
const brand = `<span class="brand">pauta<b>▸</b></span>`;
function shell(html) {
  const pf = S.perfil, w = semanaAtual(), fase = P.FASES[P.SEMANAS[w].f - 1];
  $('#app').innerHTML = `<aside class="side"><a href="#painel" class="side-brand">${brand}<small>Estúdio de conteúdo · PratFlix</small></a>
    <nav>${NAV.map(n => n.sep ? `<div class="side-sep">${n.sep}</div>` : `<a href="#${n.id}" class="nav ${rota === n.id ? 'on' : ''}" ${rota === n.id ? 'aria-current="page"' : ''}>${I(n.ic)}<span>${n.nome}</span>${n.tag ? `<em>${n.tag}</em>` : ''}</a>`).join('')}</nav>
    <div class="side-foot"><div class="side-fase" style="--c:${fase.cor}"><small>Mês ${fase.n} de 6 · semana ${w + 1}</small><strong>${fase.nome}</strong><i><b style="width:${Math.round((w + 1) / 26 * 100)}%"></b></i></div>
      <div class="side-user"><span class="av">${E((pf.nome || '?').slice(0, 2).toUpperCase())}</span><div><strong>${E(pf.nome)}</strong><small>${pf.areas.map(a => AREA[a].nome).join(' · ')}</small></div></div></div></aside>
  <main class="main"><div class="page">${html}</div></main>
  <nav class="tabbar">${MOBILE.map(id => { const n = NAV.find(x => x.id === id); return `<a href="#${id}" class="${rota === id ? 'on' : ''}">${I(n.ic)}<span>${n.nome.split(' ')[0]}</span></a>` }).join('')}<button id="mais" aria-label="Mais seções">${I('menu')}<span>Mais</span></button></nav>`;
}
const cab = (eyebrow, h, p = '', acoes = '') => `<header class="cab"><div><span class="eyebrow">${eyebrow}</span><h1>${h}</h1>${p ? `<p class="lead">${p}</p>` : ''}</div>${acoes ? `<div class="cab-acoes">${acoes}</div>` : ''}</header>`;
const chipF = f => `<span class="fchip" style="--c:${P.FORMATOS[f]?.cor || '#888'}">${E(P.FORMATOS[f]?.curto || f)}</span>`;
const dot = ar => `<span class="adot" style="--c:${AREA[ar]?.cor || '#888'}" title="${E(AREA[ar]?.nome)}"></span>`;
const stTag = s => `<span class="st st-${s}">${STATUS[STI[s]].nome}</span>`;

/* ---------- onboarding ---------- */
let wiz = { passo:0, d:{} };
function onboarding(editar = false) {
  const d = wiz.d = editar ? { ...S.perfil } : (Object.keys(wiz.d).length ? wiz.d : { nome:'', arroba:'', cidade:'', tempo:'ate2', areas:[], principal:'', publico:['pessoas'], objetivo:'autoridade', redes:['instagram'], freq:3, dias:[], video:'sim', horas:4, tom:'didatico', inicio:iso(segunda(somaDias(hoje(), 1))) });
  wiz.editar = editar; desenhaWiz();
}
const PASSOS = ['Você', 'Áreas', 'Público', 'Rotina', 'Seu plano'];
function desenhaWiz() {
  const d = wiz.d, p = wiz.passo;
  const op = (name, v, l, sub = '', multi = false) => { const on = multi ? (d[name] || []).includes(v) : d[name] === v;
    return `<button type="button" class="opt ${on ? 'on' : ''}" data-op="${name}" data-v="${v}" data-multi="${multi ? 1 : ''}" aria-pressed="${on}"><strong>${l}</strong>${sub ? `<small>${sub}</small>` : ''}</button>` };
  let corpo = '';
  if (p === 0) corpo = `<h2>Vamos montar seus 6 meses de conteúdo.</h2><p class="lead">Leva 3 minutos. Com estas respostas, a Pauta monta um cronograma semana a semana, com ideias e roteiros da sua área.</p>
    <div class="campos"><label class="campo">Seu nome profissional<input id="w-nome" value="${E(d.nome)}" placeholder="Ex.: Ana Souza" autocomplete="name"></label>
    <label class="campo">Seu @ no Instagram<input id="w-arroba" value="${E(d.arroba)}" placeholder="@anasouza.adv"></label>
    <label class="campo">Cidade / UF<input id="w-cidade" value="${E(d.cidade)}" placeholder="Ex.: Recife/PE"></label></div>
    <div class="grupo"><span class="grupo-t">Tempo de advocacia</span><div class="opts">${op('tempo', 'estudante', 'Ainda estudante')}${op('tempo', 'ate2', 'Até 2 anos')}${op('tempo', '2a5', '2 a 5 anos')}${op('tempo', 'mais5', 'Mais de 5 anos')}</div></div>`;
  if (p === 1) corpo = `<h2>Em quais áreas você quer atuar?</h2><p class="lead">Escolha de 1 a 4. Cada área tem 10 temas e 100 ideias prontas. Depois, marque a principal: ela aparece mais no seu calendário.</p>
    <div class="areas-grid">${AREAS.map(a => { const on = d.areas.includes(a.id), pr = d.principal === a.id;
      return `<button type="button" class="area ${on ? 'on' : ''}" data-area="${a.id}" style="--c:${a.cor}" aria-pressed="${on}"><span class="area-ic">${I(a.ic)}</span><strong>${a.nome}</strong><small>${E(a.publico)}</small>${on ? `<span class="area-pr ${pr ? 'is' : ''}" data-principal="${a.id}">${pr ? '★ Principal' : 'Tornar principal'}</span>` : ''}</button>` }).join('')}</div>`;
  if (p === 2) corpo = `<h2>Para quem você vai falar?</h2><p class="lead">Isso muda a linguagem dos roteiros e o tipo de conteúdo sugerido.</p>
    <div class="grupo"><span class="grupo-t">Público (pode marcar mais de um)</span><div class="opts">${op('publico', 'pessoas', 'Pessoas físicas', 'quem precisa entender um direito', true)}${op('publico', 'empresas', 'Empresas', 'donos e gestores', true)}${op('publico', 'colegas', 'Advogados e estudantes', 'conteúdo técnico e de carreira', true)}</div></div>
    <div class="grupo"><span class="grupo-t">Objetivo principal</span><div class="opts">${op('objetivo', 'autoridade', 'Ser referência na área', 'autoridade e confiança')}${op('objetivo', 'clientes', 'Ser lembrado por quem precisa', 'atrair contatos com ética')}${op('objetivo', 'networking', 'Rede com colegas', 'indicações e parcerias')}${op('objetivo', 'ensinar', 'Ensinar', 'professor, cursos e materiais')}</div></div>
    <div class="grupo"><span class="grupo-t">Tom de voz</span><div class="opts">${op('tom', 'didatico', 'Didático', 'explica passo a passo')}${op('tom', 'proximo', 'Próximo', 'conversa, exemplos do dia a dia')}${op('tom', 'tecnico', 'Técnico', 'precisão e fontes')}${op('tom', 'leve', 'Bem-humorado', 'analogias e leveza')}</div></div>`;
  if (p === 3) corpo = `<h2>Como vai ser a sua rotina?</h2><p class="lead">Um ritmo que você consegue manter vale mais que um ritmo alto que dura duas semanas.</p>
    <div class="grupo"><span class="grupo-t">Publicações no feed por semana</span><div class="opts">${[2, 3, 4, 5].map(n => `<button type="button" class="opt ${d.freq === n ? 'on' : ''}" data-freq="${n}" aria-pressed="${d.freq === n}"><strong>${n} por semana</strong><small>${{ 2:'cerca de 2 h por semana', 3:'cerca de 3 h por semana', 4:'cerca de 4 h por semana', 5:'cerca de 5 h por semana' }[n]}</small></button>`).join('')}</div></div>
    <div class="grupo"><span class="grupo-t">Dias de publicação</span><div class="opts dias">${[1, 2, 3, 4, 5, 6, 0].map(n => { const on = (d.dias.length ? d.dias : DIAS_FREQ[d.freq]).includes(n); return `<button type="button" class="opt dia ${on ? 'on' : ''}" data-dia="${n}" aria-pressed="${on}"><strong>${DIAS[n]}</strong></button>` }).join('')}</div><small class="hint">Marque ${d.freq} dias. Se não marcar, usamos os dias sugeridos.</small></div>
    <div class="grupo"><span class="grupo-t">Você topa aparecer em vídeo?</span><div class="opts">${op('video', 'sim', 'Sim', 'reels falando para a câmera')}${op('video', 'asvezes', 'Às vezes', 'metade com rosto, metade com texto')}${op('video', 'nao', 'Prefiro não', 'reels só com texto e imagens')}</div></div>
    <div class="grupo"><span class="grupo-t">Redes</span><div class="opts">${op('redes', 'instagram', 'Instagram', '', true)}${op('redes', 'tiktok', 'TikTok', '', true)}${op('redes', 'youtube', 'YouTube', '', true)}${op('redes', 'linkedin', 'LinkedIn', '', true)}</div></div>
    <label class="campo" style="max-width:280px">Começar na semana de<input id="w-inicio" type="date" value="${E(d.inicio)}"></label>`;
  if (p === 4) { const n = d.freq * 26;
    corpo = `<h2>Seu plano está pronto para ser gerado.</h2><p class="lead">${E(d.nome || 'Você')}, estes são os seus próximos 6 meses.</p>
    <div class="resumo"><div><strong>${n}</strong><span>publicações no feed</span></div><div><strong>26</strong><span>semanas com tarefas</span></div><div><strong>${d.areas.length * 100 + P.IDEIAS_GERAIS.length}</strong><span>ideias no seu banco</span></div><div><strong>6</strong><span>fases</span></div></div>
    <ol class="fases-mini">${P.FASES.map(f => `<li style="--c:${f.cor}"><b>Mês ${f.n} · ${f.nome}</b><span>${E(f.obj)}</span></li>`).join('')}</ol>
    ${wiz.editar ? `<label class="check-line"><input type="checkbox" id="w-manter" checked> Manter as publicações que já saíram do status “Ideia” e refazer só o restante</label>` : ''}`; }
  const ok = p === 0 ? (d.nome || '').trim().length > 1 : p === 1 ? d.areas.length > 0 : true;
  $('#app').innerHTML = `<div class="wiz"><div class="wiz-top">${brand}<span>Estúdio de conteúdo jurídico · PratFlix</span>${wiz.editar ? '<a href="#ajustes" class="link">Cancelar</a>' : ''}</div>
    <ol class="wiz-passos">${PASSOS.map((n, i) => `<li class="${i < p ? 'feito' : i === p ? 'atual' : ''}"><span>${i < p ? I('check') : i + 1}</span>${n}</li>`).join('')}</ol>
    <section class="wiz-corpo">${corpo}</section>
    <div class="wiz-nav">${p ? '<button class="btn ghost" data-wiz="-1">Voltar</button>' : '<span></span>'}<button class="btn" data-wiz="1" ${ok ? '' : 'disabled'}>${p === 4 ? I('spark') + 'Gerar meu plano de 6 meses' : 'Continuar'}</button></div></div>`;
}
function lerWiz() { const d = wiz.d; ['nome', 'arroba', 'cidade', 'inicio'].forEach(k => { const el = $('#w-' + k); if (el) d[k] = el.value.trim() }) }
function concluirWiz() {
  const d = wiz.d; if (!d.principal || !d.areas.includes(d.principal)) d.principal = d.areas[0];
  if ((d.dias || []).length !== d.freq) d.dias = [];
  const manter = wiz.editar && $('#w-manter')?.checked ? S.posts.filter(p => p.status !== 'ideia') : [];
  S.perfil = { ...d }; S.posts = gerarPlano(S.perfil, manter); if (!wiz.editar) S.tarefas = {};
  salvar(); wiz = { passo:0, d:{} }; location.hash = 'painel'; render(); toast('Plano de 6 meses criado.');
}

/* ---------- páginas ---------- */
function postsDaSemana(w) { return S.posts.filter(p => p.semana === w).sort((a, b) => a.data.localeCompare(b.data)) }
function cardPost(p, compacto = false) {
  const atrasado = p.status !== 'publicado' && dataDe(p.data) < hoje();
  return `<button class="pcard ${p.status === 'publicado' ? 'feito' : ''}" data-post="${p.id}"><span class="pcard-data ${atrasado ? 'atraso' : ''}"><b>${fmt(p.data, { day:'2-digit' })}</b>${fmt(p.data, { weekday:'short' }).replace('.', '')}</span>
    <span class="pcard-meio"><span class="pcard-meta">${chipF(p.formato)}${dot(p.area)}<small>${P.PILARES[p.pilar]?.nome || ''}</small></span><strong>${E(p.titulo)}</strong></span>${compacto ? '' : stTag(p.status)}</button>`;
}
function painel() {
  const pf = S.perfil, w = semanaAtual(), sem = P.SEMANAS[w], fase = P.FASES[sem.f - 1], ps = postsDaSemana(w);
  const pub = S.posts.filter(p => p.status === 'publicado').length, rot = S.posts.filter(p => STI[p.status] >= 1).length, tot = S.posts.length;
  const prox = S.posts.find(p => p.status !== 'publicado' && dataDe(p.data) >= hoje()) || S.posts.find(p => p.status !== 'publicado');
  const tarefas = sem.tarefas.map((t, i) => ({ t, k:`${w}.${i}` }));
  let seq = 0; for (let i = w - 1; i >= 0; i--) { const l = postsDaSemana(i); if (l.length && l.every(p => p.status === 'publicado')) seq++; else break }
  const ideias = todasIdeias(pf.areas), dia = Math.floor(hoje() / 864e5), idd = ideia(ideias[dia % ideias.length]);
  const pct = Math.round(pub / tot * 100), h = new Date().getHours();
  return `<section class="hero-painel" style="--c:${fase.cor}"><div><span class="eyebrow">${h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'}, ${E(pf.nome.split(' ')[0])}</span>
      <h1>Semana ${w + 1} de 26 · <em>${E(sem.tema)}</em></h1><p class="lead">Mês ${fase.n}, ${fase.nome}: ${E(fase.obj)}</p>
      <div class="acoes">${prox ? `<button class="btn" data-post="${prox.id}">${I('pen')}Abrir o próximo roteiro</button>` : ''}<a class="btn ghost" href="#cronograma">${I('route')}Ver os 6 meses</a></div></div>
    <div class="anel" style="--p:${pct}"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52"/><circle cx="60" cy="60" r="52" class="fg" style="stroke-dashoffset:${326.7 * (1 - pub / tot)}"/></svg><div><strong>${pub}</strong><span>de ${tot} publicados</span></div></div></section>
  <div class="stats"><div><strong>${ps.filter(p => p.status === 'publicado').length}/${ps.length}</strong><span>posts desta semana</span></div><div><strong>${rot}</strong><span>com roteiro em andamento</span></div><div><strong>${seq}</strong><span>${seq === 1 ? 'semana completa seguida' : 'semanas completas seguidas'}</span></div><div><strong>${S.favoritas.length}</strong><span>ideias favoritas</span></div></div>
  <div class="cols"><section class="box"><div class="box-h"><h2>Esta semana</h2><a href="#calendario" class="link">Calendário ${I('right')}</a></div><div class="plist">${ps.map(p => cardPost(p)).join('') || '<p class="vazio">Sem publicações nesta semana.</p>'}</div>
      <div class="box-h" style="margin-top:22px"><h3>Stories da semana</h3></div><ul class="stories-sem">${P.STORIES_SEMANA.slice(0, 6).map(s => `<li><b>${s.d}</b><span>${E(s.ideia)}</span></li>`).join('')}</ul></section>
    <div class="col-side"><section class="box"><div class="box-h"><h2>Tarefas da semana</h2><span class="contador">${tarefas.filter(t => S.tarefas[t.k]).length}/${tarefas.length}</span></div>
      <ul class="tarefas">${tarefas.map(t => `<li><label><input type="checkbox" data-tarefa="${t.k}" ${S.tarefas[t.k] ? 'checked' : ''}><span class="box-ck">${I('check')}</span><span>${E(t.t)}</span></label></li>`).join('')}</ul></section>
      <section class="box ideia-dia" style="--c:${AREA[idd.area].cor}"><span class="eyebrow">Ideia do dia · ${E(AREA[idd.area].nome)}</span><h3>${E(idd.titulo)}</h3><div class="pcard-meta">${chipF(idd.formato)}<small>${P.PILARES[idd.pilar].nome}</small></div>
        <div class="acoes"><button class="btn sm" data-addideia="${idd.id}">${I('plus')}Pôr no calendário</button><button class="btn sm ghost" data-verideia="${idd.id}">Ver roteiro</button></div></section></div></div>`;
}
function cronograma() {
  const w0 = semanaAtual();
  return cab('Seu plano de 6 meses', 'Uma fase por mês, <em>uma tarefa por vez.</em>', 'Cada fase tem um objetivo, metas para conferir e as publicações já distribuídas no calendário. Abra uma semana para ver tudo.') +
  `<div class="fases">${P.FASES.map(f => { const sems = P.SEMANAS.map((s, i) => ({ ...s, i })).filter(s => s.f === f.n), ps = S.posts.filter(p => sems.some(s => s.i === p.semana)), pub = ps.filter(p => p.status === 'publicado').length;
    const atual = sems.some(s => s.i === w0);
    return `<section class="fase ${atual ? 'atual' : ''}" style="--c:${f.cor}"><div class="fase-cab"><span class="fase-n">${String(f.n).padStart(2, '0')}</span><div><span class="eyebrow">Mês ${f.n}${atual ? ' · você está aqui' : ''}</span><h2>${f.nome}</h2><p>${E(f.obj)}</p></div>
      <div class="fase-prog"><strong>${pub}/${ps.length}</strong><span>publicados</span><i><b style="width:${ps.length ? pub / ps.length * 100 : 0}%"></b></i></div></div>
      <ul class="kpis">${f.kpis.map(k => `<li>${I('flag')}${E(k)}</li>`).join('')}</ul>
      <div class="semanas">${sems.map(s => { const lp = postsDaSemana(s.i), tf = s.tarefas.filter((_, j) => S.tarefas[`${s.i}.${j}`]).length;
        return `<details class="semana" ${s.i === w0 ? 'open' : ''}><summary><span class="sem-n">S${s.i + 1}</span><strong>${E(s.tema)}</strong><span class="sem-meta">${fmt(somaDias(segunda(dataDe(S.perfil.inicio)), s.i * 7))} · ${lp.length} posts · ${tf}/${s.tarefas.length} tarefas</span>${I('right', 'ic chev')}</summary>
          <div class="sem-corpo"><div><h4>Publicações</h4><div class="plist">${lp.map(p => cardPost(p)).join('')}</div></div>
          <div><h4>Tarefas</h4><ul class="tarefas">${s.tarefas.map((t, j) => `<li><label><input type="checkbox" data-tarefa="${s.i}.${j}" ${S.tarefas[`${s.i}.${j}`] ? 'checked' : ''}><span class="box-ck">${I('check')}</span><span>${E(t)}</span></label></li>`).join('')}</ul></div></div></details>` }).join('')}</div></section>` }).join('')}</div>`;
}
let mesCal = null;
function calendario() {
  if (!mesCal) { const d = hoje(); mesCal = new Date(d.getFullYear(), d.getMonth(), 1) }
  const y = mesCal.getFullYear(), m = mesCal.getMonth(), ini = segunda(new Date(y, m, 1)), cel = [];
  for (let i = 0; i < 42; i++) { const d = somaDias(ini, i); if (i >= 35 && d.getMonth() !== m) break; cel.push(d) }
  const datas = P.DATAS.filter(d => d.m === m + 1);
  return cab('Calendário', `${MESES[m]} <em>${y}</em>`, 'Clique numa publicação para abrir o roteiro. Arraste para outro dia para remarcar.',
    `<button class="btn ghost sq" data-mes="-1" aria-label="Mês anterior">${I('left')}</button><button class="btn ghost" data-mes="0">Hoje</button><button class="btn ghost sq" data-mes="1" aria-label="Próximo mês">${I('right')}</button>`) +
  `<div class="legenda-f">${Object.entries(P.FORMATOS).map(([k, f]) => chipF(k)).join('')}</div>
  <div class="cal"><div class="cal-sem">${['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(d => `<span>${d}</span>`).join('')}</div><div class="cal-grade">${cel.map(d => { const s = iso(d), ps = S.posts.filter(p => p.data === s), fora = d.getMonth() !== m, hj = s === iso(hoje());
      const dt = datas.find(x => x.d === d.getDate() && !fora);
      return `<div class="cal-dia ${fora ? 'fora' : ''} ${hj ? 'hoje' : ''}" data-drop="${s}"><span class="cal-n">${d.getDate()}</span>${dt ? `<span class="cal-data" title="${E(dt.t)}">${I('flag')}${E(dt.t)}</span>` : ''}
        ${ps.map(p => `<button class="cal-post st-b-${p.status}" draggable="true" data-drag="${p.id}" data-post="${p.id}" style="--c:${P.FORMATOS[p.formato].cor}"><b>${E(P.FORMATOS[p.formato].curto)}</b><span>${E(p.titulo)}</span></button>`).join('')}
        <button class="cal-add" data-novo="${s}" aria-label="Nova publicação em ${fmt(s)}">${I('plus')}</button></div>` }).join('')}</div></div>`;
}
function producao() {
  const w = semanaAtual(), filtro = window.__prodFiltro || 'proximas';
  const lista = S.posts.filter(p => filtro === 'todas' ? true : filtro === 'proximas' ? p.semana >= w && p.semana <= w + 2 : p.semana === w);
  return cab('Produção', 'Do roteiro <em>ao publicado.</em>', 'Arraste os cartões entre as colunas ou use as setas. Cada coluna é uma etapa da produção.',
    `<div class="seg" role="group">${[['semana', 'Esta semana'], ['proximas', 'Próximas 3 semanas'], ['todas', 'Tudo']].map(([v, l]) => `<button data-prodf="${v}" aria-pressed="${filtro === v}">${l}</button>`).join('')}</div>`) +
  `<div class="kanban">${STATUS.map(s => { const l = lista.filter(p => p.status === s.id);
    return `<section class="col" data-dropst="${s.id}"><div class="col-h"><span class="st st-${s.id}">${s.nome}</span><b>${l.length}</b></div>
      <div class="col-l">${l.map(p => `<article class="kcard" draggable="true" data-drag="${p.id}"><button class="kcard-b" data-post="${p.id}"><span class="pcard-meta">${chipF(p.formato)}${dot(p.area)}<small>${fmt(p.data)}</small></span><strong>${E(p.titulo)}</strong></button>
        <div class="kcard-nav">${STI[p.status] > 0 ? `<button data-mover="${p.id}" data-d="-1" aria-label="Voltar etapa">${I('left')}</button>` : '<span></span>'}${STI[p.status] < 5 ? `<button data-mover="${p.id}" data-d="1" aria-label="Avançar etapa">${STATUS[STI[p.status] + 1].nome} ${I('right')}</button>` : ''}</div></article>`).join('') || '<p class="vazio">Nada aqui.</p>'}</div></section>` }).join('')}</div>`;
}
let fId = { area:'todas', formato:'todos', pilar:'todos', q:'', fav:false };
function ideias() {
  const areas = S.perfil.areas, todas = todasIdeias(areas).map(ideia), usadas = new Set(S.posts.map(p => p.ideia));
  const q = fId.q.toLowerCase(), lista = todas.filter(x => (fId.area === 'todas' || x.area === fId.area) && (fId.formato === 'todos' || x.formato === fId.formato) && (fId.pilar === 'todos' || x.pilar === fId.pilar) && (!fId.fav || S.favoritas.includes(x.id)) && (!q || (x.titulo + ' ' + (x.t || '')).toLowerCase().includes(q)));
  const sel = (k, v, l) => `<button class="chip" data-fid="${k}" data-v="${v}" aria-pressed="${fId[k] === v}">${l}</button>`;
  return cab('Banco de ideias', `${todas.length} ideias <em>para as suas áreas.</em>`, 'Cada tema da sua área vira 10 formatos de conteúdo. Favorite as melhores e coloque no calendário com um clique.') +
  `<div class="filtros"><label class="busca">${I('search')}<input id="fq" type="search" placeholder="Buscar tema ou palavra" value="${E(fId.q)}" aria-label="Buscar ideias"></label>
    <div class="chips">${sel('area', 'todas', 'Todas as áreas')}${areas.map(a => sel('area', a, AREA[a].nome)).join('')}</div>
    <div class="chips">${sel('formato', 'todos', 'Todos os formatos')}${['carrossel', 'reels', 'post', 'stories', 'live', 'youtube'].map(f => sel('formato', f, P.FORMATOS[f].curto)).join('')}</div>
    <div class="chips">${sel('pilar', 'todos', 'Todos os pilares')}${Object.entries(P.PILARES).map(([k, p]) => sel('pilar', k, p.nome)).join('')}<button class="chip" data-favf aria-pressed="${fId.fav}">${I('star')}Favoritas</button></div></div>
  <p class="contagem">${lista.length} ideias</p>
  <div class="ideias">${lista.slice(0, 120).map(x => { const fav = S.favoritas.includes(x.id), us = usadas.has(x.id);
    return `<article class="icard" style="--c:${AREA[x.area].cor}"><div class="icard-top"><span class="pcard-meta">${chipF(x.formato)}<small>${P.PILARES[x.pilar].nome}</small></span><button class="fav ${fav ? 'on' : ''}" data-fav="${x.id}" aria-pressed="${fav}" aria-label="Favoritar">${I('star')}</button></div>
      <h3>${E(x.titulo)}</h3><p class="icard-area">${dot(x.area)}${E(AREA[x.area].nome)}${us ? ' · já no calendário' : ''}</p>
      <div class="acoes"><button class="btn sm" data-addideia="${x.id}">${I('plus')}Calendário</button><button class="btn sm ghost" data-verideia="${x.id}">Roteiro</button></div></article>` }).join('')}</div>
  ${lista.length > 120 ? `<p class="contagem">Mostrando 120 de ${lista.length}. Use os filtros para encontrar o restante.</p>` : ''}`;
}
let abaRot = 'meus', temaG = '';
function roteiros() {
  const pf = S.perfil, a = AREA[pf.principal], tema = temaG || a.temas[0].t;
  const abas = [['meus', 'Meus roteiros'], ['ganchos', 'Ganchos'], ['ctas', 'Chamadas finais'], ['estruturas', 'Estruturas']];
  let c = '';
  if (abaRot === 'meus') { const w = semanaAtual(), l = S.posts.filter(p => p.semana >= w && p.semana <= w + 3);
    c = `<p class="lead" style="margin-bottom:18px">Roteiros das próximas 4 semanas. Abra para gerar, editar e copiar.</p><div class="plist">${l.map(p => cardPost(p)).join('')}</div>` }
  if (abaRot === 'ganchos') c = `<div class="gtema"><label class="campo">Tema para testar os ganchos<select id="gt">${pf.areas.flatMap(ar => AREA[ar].temas.map(x => `<option ${x.t === tema ? 'selected' : ''}>${E(x.t)}</option>`)).join('')}</select></label></div>
    <ol class="glist">${P.GANCHOS.map(g => { const t = g.replace('{t}', tema); return `<li><span>${E(t)}</span><button class="btn sm ghost" data-copy="${E(t)}">${I('copy')}Copiar</button></li>` }).join('')}</ol>`;
  if (abaRot === 'ctas') c = `<ol class="glist">${P.CTAS.map((x, i) => { const t = CTA(a, i); return `<li><span>${E(t)}</span><button class="btn sm ghost" data-copy="${E(t)}">${I('copy')}Copiar</button></li>` }).join('')}</ol>
    <div class="nota">${I('shield')}<span>Chamadas finais convidam a salvar, compartilhar e comentar. Evite “me chame para contratar”: veja a aba Ética.</span></div>`;
  if (abaRot === 'estruturas') c = `<div class="estr">${Object.entries(P.FORMATOS).map(([k, f]) => `<article class="estr-c" style="--c:${f.cor}"><span class="pcard-meta">${chipF(k)}</span><h3>${f.nome}</h3><p>${f.dur} · cerca de ${f.tempo} min para produzir</p><button class="btn sm ghost" data-estr="${k}">Ver estrutura</button></article>`).join('')}</div>`;
  return cab('Roteiros', 'Escreva rápido, <em>grave melhor.</em>', 'Roteiros prontos para preencher, 20 fórmulas de gancho e chamadas finais dentro da ética.') +
    `<div class="tabs" role="tablist">${abas.map(([k, l]) => `<button role="tab" data-abarot="${k}" aria-selected="${abaRot === k}">${l}</button>`).join('')}</div>${c}`;
}
let abaEst = 'design';
function safeZone() {
  return `<figure class="safe"><svg viewBox="0 0 270 480" role="img" aria-label="Zona segura de um vídeo 9:16"><rect x="1" y="1" width="268" height="478" rx="14" class="sz-out"/>
    <rect x="1" y="1" width="268" height="62" class="sz-no"/><rect x="1" y="374" width="268" height="105" class="sz-no"/><rect x="238" y="63" width="31" height="311" class="sz-no"/>
    <rect x="24" y="80" width="200" height="280" rx="8" class="sz-ok"/><text x="124" y="215" text-anchor="middle" class="sz-t">área segura</text><text x="124" y="232" text-anchor="middle" class="sz-s">título e legendas aqui</text>
    <text x="135" y="36" text-anchor="middle" class="sz-s">250 px · nome e botões</text><text x="135" y="430" text-anchor="middle" class="sz-s">420 px · legenda do app</text></svg>
    <figcaption>Vídeo 1080×1920: deixe livres o topo, a base e a lateral direita.</figcaption></figure>`;
}
function estudio() {
  const g = P.GUIAS[abaEst];
  const equip = abaEst === 'video' ? `<section class="box"><h2>Equipamento por fase</h2><div class="equip"><div><b>Para começar</b><ul><li>Celular com câmera traseira</li><li>Microfone de lapela com fio ou sem fio</li><li>Tripé de mesa</li><li>Luz da janela</li></ul></div><div><b>Para crescer</b><ul><li>Painel de LED com difusor</li><li>Microfone sem fio duplo</li><li>Tripé de chão</li><li>App de teleprompter</li></ul></div><div><b>Para escalar</b><ul><li>Câmera com saída limpa</li><li>Duas luzes (principal e fundo)</li><li>Fundo montado no escritório</li><li>Editor ou assistente</li></ul></div></div></section>` : '';
  return cab('Estúdio', 'Design, vídeo e rotina <em>de quem produz toda semana.</em>', 'Guias práticos com medidas, ritmos e checklists. Use antes de criar cada peça.') +
  `<div class="tabs" role="tablist">${Object.entries(P.GUIAS).map(([k, x]) => `<button role="tab" data-abaest="${k}" aria-selected="${abaEst === k}">${x.titulo}</button>`).join('')}</div>
  <div class="guia ${abaEst === 'video' ? 'com-fig' : ''}"><div class="guia-l">${g.secoes.map(s => `<section class="box"><h2>${E(s.h)}</h2><ul class="lista-ok">${s.itens.map(i => `<li>${I('check')}<span>${E(i)}</span></li>`).join('')}</ul></section>`).join('')}${equip}</div>${abaEst === 'video' ? `<div class="guia-fig">${safeZone()}</div>` : ''}</div>`;
}
function etica() {
  return cab('Ética', 'Conteúdo forte, <em>dentro das regras.</em>', 'Cole o texto do post, roteiro ou legenda. A Pauta aponta trechos que costumam contrariar o Provimento 205/2021 e o Código de Ética e Disciplina da OAB.') +
  `<div class="cols"><section class="box"><h2>Verificador de texto</h2><textarea id="etx" rows="9" placeholder="Cole aqui a legenda, o roteiro ou o texto do post."></textarea><div id="eres" class="eres"><p class="vazio">O resultado aparece enquanto você digita.</p></div>
    <p class="hint">O verificador procura padrões comuns. Ele não substitui a sua leitura das normas da OAB.</p></section>
    <div class="col-side"><section class="box"><h2>Pode</h2><ul class="lista-ok">${P.ETICA_PODE.map(x => `<li>${I('check')}<span>${E(x)}</span></li>`).join('')}</ul></section>
    <section class="box"><h2>Não pode</h2><ul class="lista-no">${P.ETICA_NAO.map(x => `<li>${I('close')}<span>${E(x)}</span></li>`).join('')}</ul></section></div></div>`;
}
function bios() {
  const pf = S.perfil, a = AREA[pf.principal], outras = pf.areas.filter(x => x !== pf.principal).map(x => AREA[x].nome), cid = pf.cidade || 'Sua cidade/UF';
  const areasTxt = [a.nome, ...outras].join(' e '), prof = pf.tempo === 'estudante' ? 'Estudante de Direito' : 'Advogado(a)';
  return [
    `${prof} | ${areasTxt}\nExplico seus direitos em linguagem simples\n📍 ${cid} · OAB/UF 000000\nConteúdos e contato ↓`,
    `${a.nome} sem juridiquês ⚖️\n${prof} em ${cid}\nToda semana: dúvidas, passos e mitos sobre ${a.nome.toLowerCase()}\nOAB/UF 000000`,
    `${pf.nome} · ${prof}\n${areasTxt} para ${pf.publico.includes('empresas') ? 'empresas e empreendedores' : 'pessoas e famílias'}\n📍 ${cid} · atendimento presencial e online\nOAB/UF 000000 · materiais gratuitos ↓`
  ];
}
function perfil() {
  const pf = S.perfil, idt = S.identidade, pal = P.PALETAS.find(p => p.id === idt.paleta), fon = P.FONTES.find(f => f.id === idt.fonte);
  const dest = ['Sobre mim', ...pf.areas.flatMap(a => AREA[a].destaques.slice(0, pf.areas.length > 2 ? 1 : 2)), 'Dúvidas', 'Conteúdos'].slice(0, 7);
  return cab('Perfil e identidade', 'Um perfil que <em>explica em 3 segundos</em> o que você faz.', 'Bio, destaques, posts fixados e a identidade visual que os modelos de posts vão usar.') +
  `<div class="cols"><section class="box"><h2>Bio pronta para usar</h2><p class="hint">Troque “OAB/UF 000000” pelo seu número. Até 150 caracteres.</p>${bios().map((b, i) => `<div class="bio"><pre>${E(b)}</pre><div class="bio-f"><small>${b.length} caracteres</small><button class="btn sm ghost" data-copy="${E(b)}">${I('copy')}Copiar</button></div></div>`).join('')}</section>
    <div class="col-side"><section class="box"><h2>Destaques sugeridos</h2><div class="dest">${dest.map(d => `<div class="dest-i"><span style="background:${pal.cores[0]};color:${pal.cores[2]};font-family:${fon.titulo}">${E(d.slice(0, 2).toUpperCase())}</span><small>${E(d)}</small></div>`).join('')}</div><p class="hint">As capas de destaque prontas entram na seção Modelos.</p></section>
    <section class="box"><h2>3 posts para fixar</h2><ol class="fix"><li><b>Apresentação</b><span>Quem você é, para quem fala e o que publica.</span></li><li><b>O conteúdo mais salvo</b><span>Um carrossel educativo da área principal.</span></li><li><b>Um passo a passo</b><span>O procedimento que mais gera dúvidas.</span></li></ol></section></div></div>
  <section class="box"><h2>Identidade visual</h2><p class="hint">Escolha uma paleta e um par de fontes. A prévia mostra uma capa de carrossel com a sua área.</p>
    <div class="idt"><div><h3>Paleta</h3><div class="pals">${P.PALETAS.map(p => `<button class="pal ${p.id === idt.paleta ? 'on' : ''}" data-pal="${p.id}" aria-pressed="${p.id === idt.paleta}">${p.cores.map(c => `<i style="background:${c}"></i>`).join('')}<span>${p.nome}</span></button>`).join('')}</div>
      <h3>Fontes</h3><div class="fons">${P.FONTES.map(f => `<button class="fon ${f.id === idt.fonte ? 'on' : ''}" data-fon="${f.id}" aria-pressed="${f.id === idt.fonte}"><b style="font-family:${f.titulo}">Aa</b><span>${f.nome}</span></button>`).join('')}</div></div>
    <div class="previa"><div class="capa-prev" style="background:${pal.cores[0]};color:${pal.cores[1]}"><small style="color:${pal.cores[2]};font-family:${fon.texto}">${E(AREA[pf.principal].nome.toUpperCase())}</small><b style="font-family:${fon.titulo}">${E(AREA[pf.principal].temas[0].q)}</b><span style="font-family:${fon.texto}">${E(pf.arroba || '@seuperfil')} · arrasta →</span><i style="background:${pal.cores[2]}"></i></div></div></div></section>`;
}
function metricas() {
  const m = S.metricas.slice().sort((a, b) => a.data.localeCompare(b.data)), ult = m[m.length - 1], ant = m[m.length - 2];
  const campos = [['seguidores', 'Seguidores'], ['alcance', 'Alcance da semana'], ['salvos', 'Salvamentos'], ['compart', 'Compartilhamentos'], ['visitas', 'Visitas ao perfil'], ['mensagens', 'Mensagens recebidas']];
  const delta = k => ult && ant ? ult[k] - ant[k] : null;
  return cab('Métricas', 'O que mostra <em>se está funcionando.</em>', 'Registre uma vez por semana, sempre no mesmo dia. Salvamentos e compartilhamentos dizem mais sobre conteúdo útil do que curtidas.') +
  `<div class="cols"><section class="box"><h2>Registrar a semana</h2><form id="fmet" class="fmet"><label class="campo">Data<input type="date" name="data" value="${iso(hoje())}" required></label>${campos.map(([k, l]) => `<label class="campo">${l}<input type="number" min="0" name="${k}" inputmode="numeric" required></label>`).join('')}<button class="btn">${I('plus')}Salvar semana</button></form></section>
    <div class="col-side"><section class="box"><h2>Última semana</h2>${ult ? `<div class="mgrid">${campos.map(([k, l]) => { const dl = delta(k); return `<div><small>${l}</small><strong>${Number(ult[k]).toLocaleString('pt-BR')}</strong>${dl === null ? '' : `<em class="${dl >= 0 ? 'up' : 'down'}">${dl >= 0 ? '+' : ''}${dl.toLocaleString('pt-BR')}</em>`}</div>` }).join('')}</div>` : '<p class="vazio">Registre a primeira semana para ver a evolução.</p>'}</section></div></div>
  ${m.length ? `<section class="box"><h2>Evolução</h2>${grafico(m)}<div class="mtab"><table><thead><tr><th>Semana</th>${campos.map(([, l]) => `<th>${l}</th>`).join('')}<th></th></tr></thead><tbody>${m.slice().reverse().map(r => `<tr><td>${fmt(r.data)}</td>${campos.map(([k]) => `<td>${Number(r[k]).toLocaleString('pt-BR')}</td>`).join('')}<td><button class="btn sm ghost sq" data-delmet="${r.data}" aria-label="Apagar">${I('trash')}</button></td></tr>`).join('')}</tbody></table></div></section>` : ''}
  <section class="box"><h2>Perguntas para a revisão do mês</h2><ol class="fix"><li><b>O que mais foi salvo?</b><span>Repita o formato e o tema com outra abordagem.</span></li><li><b>O que mais foi compartilhado?</b><span>Esse assunto conversa com quem ainda não te segue.</span></li><li><b>De onde vieram as mensagens?</b><span>Anote o post: é o assunto que gera confiança.</span></li><li><b>O que não funcionou?</b><span>Troque o gancho e a capa antes de desistir do tema.</span></li></ol></section>`;
}
function grafico(m) {
  const W = 640, H = 200, pad = 28, xs = i => pad + (m.length === 1 ? (W - 2 * pad) / 2 : i * (W - 2 * pad) / (m.length - 1));
  const max = Math.max(...m.map(r => +r.seguidores), 1), min = Math.min(...m.map(r => +r.seguidores)), y = v => H - pad - ((v - min) / Math.max(max - min, 1)) * (H - 2 * pad);
  const maxB = Math.max(...m.map(r => +r.salvos + +r.compart), 1), bw = Math.min(26, (W - 2 * pad) / m.length * .5);
  const linha = m.map((r, i) => `${i ? 'L' : 'M'}${xs(i).toFixed(1)},${y(+r.seguidores).toFixed(1)}`).join(' ');
  return `<div class="graf"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Seguidores e salvamentos por semana"><line x1="${pad}" x2="${W - pad}" y1="${H - pad}" y2="${H - pad}" class="g-eixo"/>
    ${m.map((r, i) => { const h = (+r.salvos + +r.compart) / maxB * (H - 2 * pad) * .6; return `<rect x="${xs(i) - bw / 2}" y="${H - pad - h}" width="${bw}" height="${h}" rx="3" class="g-bar"><title>${fmt(r.data)}: ${+r.salvos + +r.compart} salvamentos e compartilhamentos</title></rect>` }).join('')}
    <path d="${linha}" class="g-lin"/>${m.map((r, i) => `<circle cx="${xs(i)}" cy="${y(+r.seguidores)}" r="${i === m.length - 1 ? 5 : 3}" class="g-pt"><title>${fmt(r.data)}: ${r.seguidores} seguidores</title></circle>`).join('')}
    <text x="${pad}" y="16" class="g-t">${Number(max).toLocaleString('pt-BR')} seguidores</text></svg><div class="g-leg"><span><i class="l"></i>Seguidores</span><span><i class="b"></i>Salvamentos + compartilhamentos</span></div></div>`;
}
function modelos() {
  const idt = S.identidade, pal = P.PALETAS.find(p => p.id === idt.paleta), fon = P.FONTES.find(f => f.id === idt.fonte), a = AREA[S.perfil.principal];
  const amostra = (g, i, n) => { const t = g === 0 ? ['Capa', 'Mito ou verdade', 'Passo a passo', 'Pergunta', 'Frase', 'Data', 'Decisão', 'Checklist'][i] : n;
    if (g === 1) return `<div class="mod-dest"><span style="background:${pal.cores[i % 2 ? 2 : 0]};color:${pal.cores[i % 2 ? 0 : 2]};font-family:${fon.titulo}">${E(n.slice(0, 2).toUpperCase())}</span><small>${E(n)}</small></div>`;
    const bg = pal.cores[i % 3 === 1 ? 1 : 0], fg = i % 3 === 1 ? pal.cores[0] : pal.cores[1];
    return `<div class="mod ${g === 2 ? 'mod-story' : ''}" style="background:${bg};color:${fg}"><small style="color:${pal.cores[2]};font-family:${fon.texto}">${E(a.nome.toUpperCase())}</small><b style="font-family:${fon.titulo}">${E(g === 0 && i === 0 ? a.temas[1].q : n)}</b><i style="background:${pal.cores[2]}"></i></div>` };
  return cab('Modelos', 'Posts, destaques e stories <em>prontos para editar.</em>', 'A próxima etapa da Pauta: modelos na sua paleta e nas suas fontes, ligados ao calendário. Abaixo, uma prévia do que vem com a identidade que você escolheu em Perfil.',
    `<a class="btn ghost" href="#perfil">${I('user')}Trocar a identidade</a>`) +
  P.MODELOS_FUTUROS.map((g, gi) => `<section class="box"><div class="box-h"><h2>${g.grupo}</h2><span class="st st-producao">Em breve · ${g.itens.length} modelos</span></div><div class="mods ${gi === 1 ? 'mods-dest' : gi === 2 ? 'mods-story' : ''}">${g.itens.map((n, i) => amostra(gi, i, n)).join('')}</div></section>`).join('');
}
function ajustes() {
  const pf = S.perfil;
  return cab('Ajustes', 'Seu plano, <em>seus dados.</em>', 'Os dados ficam salvos neste navegador. Exporte uma cópia para usar em outro aparelho.') +
  `<div class="cols"><section class="box"><h2>Plano</h2><dl class="dl"><dt>Áreas</dt><dd>${pf.areas.map(a => AREA[a].nome + (a === pf.principal ? ' (principal)' : '')).join(', ')}</dd><dt>Ritmo</dt><dd>${pf.freq} publicações por semana · vídeo: ${{ sim:'sim', asvezes:'às vezes', nao:'não' }[pf.video]}</dd><dt>Início</dt><dd>${fmt(pf.inicio, { day:'2-digit', month:'long', year:'numeric' })}</dd></dl>
    <div class="acoes"><button class="btn" data-acao="editar">${I('pen')}Editar respostas e refazer o plano</button></div></section>
    <div class="col-side"><section class="box"><h2>Backup e calendário</h2><div class="acoes col"><button class="btn ghost" data-acao="exportar">${I('download')}Exportar meus dados (.json)</button><label class="btn ghost">${I('upload')}Importar dados<input type="file" id="imp" accept="application/json" hidden></label><button class="btn ghost" data-acao="ics">${I('cal')}Baixar o calendário (.ics)</button></div><p class="hint">O arquivo .ics abre no Google Agenda, Outlook ou Calendário do celular.</p></section>
    <section class="box perigo"><h2>Recomeçar do zero</h2><p class="hint">Apaga o plano, as métricas e as anotações deste navegador.</p><div id="zerar"><button class="btn ghost" data-acao="zerar1">${I('trash')}Apagar tudo</button></div></section></div></div>`;
}

/* ---------- modal de publicação ---------- */
function abrirPost(id) {
  const p = S.posts.find(x => x.id === id); if (!p) return;
  if (!p.roteiro) p.roteiro = roteiro(p); if (!p.legenda) p.legenda = legenda(p); salvar();
  modal(`<div class="mp"><div class="mp-cab"><div class="pcard-meta">${chipF(p.formato)}${dot(p.area)}<small>${E(AREA[p.area]?.nome)} · ${P.PILARES[p.pilar]?.nome} · semana ${p.semana + 1}</small></div>
      <input class="mp-titulo" id="mp-titulo" value="${E(p.titulo)}" aria-label="Título da publicação">
      <div class="mp-linha"><label>Data<input type="date" id="mp-data" value="${p.data}"></label><label>Formato<select id="mp-formato">${Object.entries(P.FORMATOS).map(([k, f]) => `<option value="${k}" ${k === p.formato ? 'selected' : ''}>${f.nome}</option>`).join('')}</select></label>
        <label>Etapa<select id="mp-status">${STATUS.map(s => `<option value="${s.id}" ${s.id === p.status ? 'selected' : ''}>${s.nome}</option>`).join('')}</select></label></div></div>
    <div class="tabs" role="tablist">${[['rot', 'Roteiro'], ['leg', 'Legenda'], ['chk', 'Checklist'], ['not', 'Anotações']].map(([k, l], i) => `<button role="tab" data-mpt="${k}" aria-selected="${!i}">${l}</button>`).join('')}</div>
    <div data-mpp="rot"><textarea id="mp-roteiro" class="mono" rows="18">${E(p.roteiro)}</textarea><div class="acoes"><button class="btn sm ghost" data-copyel="mp-roteiro">${I('copy')}Copiar roteiro</button><button class="btn sm ghost" data-regen="${p.id}">${I('spark')}Refazer a partir do modelo</button></div></div>
    <div data-mpp="leg" hidden><textarea id="mp-legenda" rows="12">${E(p.legenda)}</textarea><div id="mp-etica" class="eres"></div><div class="acoes"><button class="btn sm ghost" data-copyel="mp-legenda">${I('copy')}Copiar legenda</button></div></div>
    <div data-mpp="chk" hidden><h3 class="mp-h">Antes de publicar</h3><ul class="tarefas">${[...P.ETICA_CHECK, 'Capa ou gancho testados no celular', 'Legenda revisada e sem erros', 'Texto dentro da zona segura (vídeo)', 'Agendado no Meta Business Suite'].map((t, i) => `<li><label><input type="checkbox" data-pchk="${i}" ${p.check.includes(i) ? 'checked' : ''}><span class="box-ck">${I('check')}</span><span>${E(t)}</span></label></li>`).join('')}</ul></div>
    <div data-mpp="not" hidden><textarea id="mp-notas" rows="10" placeholder="Fontes, links, ideias de imagem, o que funcionou.">${E(p.notas)}</textarea></div>
    <div class="mp-rodape"><button class="btn ghost sq" data-delpost="${p.id}" aria-label="Apagar publicação">${I('trash')}</button>${STI[p.status] < 5 ? `<button class="btn" data-mover="${p.id}" data-d="1" data-fechar="1">${I('check')}Avançar para “${STATUS[STI[p.status] + 1].nome}”</button>` : '<span class="st st-publicado">Publicado</span>'}</div></div>`, () => {
    const g = k => $('#mp-' + k)?.value; Object.assign(p, { titulo:g('titulo') || p.titulo, data:g('data') || p.data, formato:g('formato'), status:g('status'), roteiro:g('roteiro'), legenda:g('legenda'), notas:g('notas') });
    p.semana = Math.max(0, Math.floor((dataDe(p.data) - segunda(dataDe(S.perfil.inicio))) / 864e5 / 7)); salvar();
  }, p.id);
  mostrarEtica($('#mp-legenda').value + '\n' + $('#mp-roteiro').value, '#mp-etica');
}
function verIdeia(id) {
  const x = ideia(id), fake = { ideia:id, area:x.area, formato:x.formato === 'reels' && S.perfil.video === 'nao' ? 'reels-texto' : x.formato };
  modal(`<div class="mp"><div class="pcard-meta">${chipF(fake.formato)}${dot(x.area)}<small>${E(AREA[x.area].nome)} · ${P.PILARES[x.pilar].nome}</small></div><h2 class="mp-t2">${E(x.titulo)}</h2>
    <pre class="mono pre">${E(roteiro(fake))}</pre><div class="acoes"><button class="btn" data-addideia="${id}" data-fechar="1">${I('plus')}Pôr no calendário</button><button class="btn ghost" data-copy="${E(roteiro(fake))}">${I('copy')}Copiar</button></div></div>`);
}
function addIdeia(id, data) {
  const x = ideia(id); let d = data;
  if (!d) { const ocup = new Set(S.posts.map(p => p.data)); let c = somaDias(hoje(), 1); for (let i = 0; i < 60 && ocup.has(iso(c)); i++) c = somaDias(c, 1); d = iso(c) }
  const formato = x.formato === 'reels' && S.perfil.video === 'nao' ? 'reels-texto' : x.formato;
  const p = { id:'p' + Math.random().toString(36).slice(2, 9), data:d, semana:Math.max(0, Math.floor((dataDe(d) - segunda(dataDe(S.perfil.inicio))) / 864e5 / 7)), formato, pilar:x.pilar, area:x.area, ideia:id, titulo:x.titulo, status:'ideia', roteiro:'', legenda:'', notas:'', check:[] };
  S.posts.push(p); S.posts.sort((a, b) => a.data.localeCompare(b.data)); salvar(); toast(`Adicionado em ${fmt(d, { day:'2-digit', month:'long' })}.`); return p;
}
let fecharCb = null;
function modal(html, onClose = null) {
  fecharCb = onClose; const ult = document.activeElement;
  $('#modal').innerHTML = `<div class="ov" data-ov><div class="mbox" role="dialog" aria-modal="true" aria-label="Detalhes"><button class="mfechar" data-mfechar aria-label="Fechar">${I('close')}</button>${html}</div></div>`;
  document.body.classList.add('travado'); $('#modal .mfechar').focus(); $('#modal').__ult = ult;
}
function fechar() { if (fecharCb) fecharCb(); fecharCb = null; $('#modal').innerHTML = ''; document.body.classList.remove('travado'); $('#modal').__ult?.focus?.(); render(false) }
function mostrarEtica(txt, alvo) {
  const r = checagem(txt), el = $(alvo); if (!el) return;
  el.innerHTML = !txt.trim() ? '<p class="vazio">O resultado aparece enquanto você digita.</p>' : r.length ? r.map(x => `<div class="eitem ${x.nivel}">${I(x.nivel === 'proibido' ? 'close' : 'eye')}<div><b>${x.nivel === 'proibido' ? 'Revise antes de publicar' : 'Atenção'}</b><span>${E(x.msg)}</span><small>Trecho: “${E((txt.match(x.re) || [''])[0])}”</small></div></div>`).join('') : `<div class="eitem ok">${I('check')}<div><b>Nenhum alerta encontrado</b><span>Confira também o checklist antes de publicar.</span></div></div>`;
}

/* ---------- arquivos ---------- */
function baixar(nome, txt, tipo) { const b = new Blob([txt], { type:tipo }), a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = nome; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove() }, 500) }
function ics() {
  const esc = s => String(s).replace(/[\\,;]/g, m => '\\' + m).replace(/\n/g, '\\n');
  const ev = S.posts.map(p => { const d = p.data.replace(/-/g, ''); return `BEGIN:VEVENT\nUID:${p.id}@pauta\nDTSTAMP:${d}T090000\nDTSTART;VALUE=DATE:${d}\nSUMMARY:${esc(`[${P.FORMATOS[p.formato].curto}] ${p.titulo}`)}\nDESCRIPTION:${esc(`${AREA[p.area]?.nome} · ${P.PILARES[p.pilar]?.nome}`)}\nEND:VEVENT` }).join('\n');
  return `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Pauta PratFlix//PT\n${ev}\nEND:VCALENDAR`.replace(/\n/g, '\r\n');
}

/* ---------- roteamento ---------- */
const PAGS = { painel, cronograma, calendario, producao, ideias, roteiros, estudio, etica, perfil, metricas, modelos, ajustes };
const TITULOS = { painel:'Painel', cronograma:'Cronograma', calendario:'Calendário', producao:'Produção', ideias:'Banco de ideias', roteiros:'Roteiros', estudio:'Estúdio', etica:'Ética', perfil:'Perfil', metricas:'Métricas', modelos:'Modelos', ajustes:'Ajustes' };
function render(topo = true) {
  if (!S.perfil) { if (!$('.wiz')) onboarding(); return }
  const h = location.hash.slice(1); rota = PAGS[h] ? h : 'painel';
  const y = window.scrollY; shell(PAGS[rota]()); document.title = `${TITULOS[rota]} · Pauta`;
  window.scrollTo(0, topo ? 0 : y);
}
window.addEventListener('hashchange', () => { if ($('#modal').innerHTML) { fecharCb = null; $('#modal').innerHTML = ''; document.body.classList.remove('travado') } render() });

/* ---------- eventos ---------- */
document.addEventListener('click', e => {
  const t = e.target.closest('[data-principal], button, a, label, [data-ov]'); if (!t) return; const d = t.dataset;
  if (d.ov !== undefined && e.target === t) return fechar();
  if (d.mfechar !== undefined) return fechar();
  // onboarding
  if (d.op) { const k = d.op, v = d.v; if (d.multi) { const l = wiz.d[k] || []; wiz.d[k] = l.includes(v) ? l.filter(x => x !== v) : [...l, v]; if (!wiz.d[k].length) wiz.d[k] = [v] } else wiz.d[k] = v; lerWiz(); desenhaWiz(); return }
  if (d.principal) { e.stopPropagation(); lerWiz(); wiz.d.principal = d.principal; desenhaWiz(); return }
  if (d.area) { lerWiz(); const l = wiz.d.areas; if (l.includes(d.area)) { wiz.d.areas = l.filter(x => x !== d.area); if (wiz.d.principal === d.area) wiz.d.principal = wiz.d.areas[0] || '' } else if (l.length < 4) { l.push(d.area); if (!wiz.d.principal) wiz.d.principal = d.area } else toast('Escolha até 4 áreas.'); desenhaWiz(); return }
  if (d.freq) { lerWiz(); wiz.d.freq = +d.freq; wiz.d.dias = []; desenhaWiz(); return }
  if (d.dia) { lerWiz(); let l = wiz.d.dias.length ? wiz.d.dias : DIAS_FREQ[wiz.d.freq].slice(); const n = +d.dia; l = l.includes(n) ? l.filter(x => x !== n) : [...l, n]; wiz.d.dias = l; desenhaWiz(); return }
  if (d.wiz) { lerWiz(); if (+d.wiz > 0 && wiz.passo === 4) return concluirWiz(); wiz.passo = Math.max(0, Math.min(4, wiz.passo + +d.wiz)); desenhaWiz(); window.scrollTo(0, 0); return }
  if (t.id === 'mais') { document.body.classList.toggle('menu-aberto'); return }
  // app
  if (d.post) { abrirPost(d.post); return }
  if (d.mpt) { $$('[data-mpt]').forEach(b => b.setAttribute('aria-selected', b === t)); $$('[data-mpp]').forEach(p => p.hidden = p.dataset.mpp !== d.mpt); return }
  if (d.regen) { const p = S.posts.find(x => x.id === d.regen); $('#mp-roteiro').value = roteiro({ ...p, formato:$('#mp-formato').value }); toast('Roteiro refeito a partir do modelo.'); return }
  if (d.copyel) return copiar($('#' + d.copyel).value);
  if (d.copy) return copiar(d.copy);
  if (d.mover) { const p = S.posts.find(x => x.id === d.mover), i = Math.max(0, Math.min(5, STI[p.status] + +d.d)); if (d.fechar) { const s = $('#mp-status'); if (s) s.value = STATUS[i].id; fechar(); p.status = STATUS[i].id } else p.status = STATUS[i].id; salvar(); if (!d.fechar) render(false); toast(`Movido para “${STATUS[i].nome}”.`); return }
  if (d.delpost) { const p = S.posts.find(x => x.id === d.delpost); fecharCb = null; S.posts = S.posts.filter(x => x !== p); salvar(); fechar(); toast('Publicação apagada.'); return }
  if (d.addideia) { addIdeia(d.addideia); if (d.fechar) fechar(); else render(false); return }
  if (d.verideia) return verIdeia(d.verideia);
  if (d.fav) { const l = S.favoritas; S.favoritas = l.includes(d.fav) ? l.filter(x => x !== d.fav) : [...l, d.fav]; salvar(); render(false); return }
  if (d.fid) { fId[d.fid] = d.v; render(false); return }
  if (d.favf !== undefined) { fId.fav = !fId.fav; render(false); return }
  if (d.mes) { const n = +d.mes; mesCal = n ? new Date(mesCal.getFullYear(), mesCal.getMonth() + n, 1) : new Date(hoje().getFullYear(), hoje().getMonth(), 1); render(false); return }
  if (d.novo) { const p = addIdeia('g:' + (1 + Math.floor(Math.random() * (P.IDEIAS_GERAIS.length - 1))), d.novo); abrirPost(p.id); return }
  if (d.prodf) { window.__prodFiltro = d.prodf; render(false); return }
  if (d.abarot) { abaRot = d.abarot; render(false); return }
  if (d.estr) { const fake = { ideia:`${S.perfil.principal}:0:${{ carrossel:'passo', reels:'mito', 'reels-texto':'mito', post:'quando', stories:'caixa', live:'live', youtube:'longo' }[d.estr]}`, area:S.perfil.principal, formato:d.estr };
    return modal(`<div class="mp"><span class="eyebrow">Estrutura · ${P.FORMATOS[d.estr].nome}</span><h2 class="mp-t2">${P.FORMATOS[d.estr].dur}</h2><pre class="mono pre">${E(roteiro(fake))}</pre></div>`) }
  if (d.abaest) { abaEst = d.abaest; render(false); return }
  if (d.pal) { S.identidade.paleta = d.pal; salvar(); render(false); return }
  if (d.fon) { S.identidade.fonte = d.fon; salvar(); render(false); return }
  if (d.delmet) { S.metricas = S.metricas.filter(m => m.data !== d.delmet); salvar(); render(false); return }
  if (d.acao === 'editar') { wiz.passo = 0; onboarding(true); return }
  if (d.acao === 'exportar') return baixar(`pauta-${iso(hoje())}.json`, JSON.stringify(S, null, 2), 'application/json');
  if (d.acao === 'ics') return baixar('pauta-calendario.ics', ics(), 'text/calendar');
  if (d.acao === 'zerar1') { $('#zerar').innerHTML = `<p><b>Tem certeza?</b> Isso não pode ser desfeito.</p><div class="acoes"><button class="btn perigo-b" data-acao="zerar2">Sim, apagar tudo</button><button class="btn ghost" data-acao="zerar0">Cancelar</button></div>`; return }
  if (d.acao === 'zerar0') return render(false);
  if (d.acao === 'zerar2') { S = novo(); salvar(); wiz = { passo:0, d:{} }; location.hash = ''; onboarding(); return }
});
document.addEventListener('change', e => {
  const t = e.target;
  if (t.dataset.tarefa) { S.tarefas[t.dataset.tarefa] = t.checked; salvar(); if (t.checked) toast('Tarefa concluída.'); return }
  if (t.id === 'gt') { temaG = t.value; render(false); return }
  if (t.id === 'imp') { const f = t.files[0]; if (!f) return; f.text().then(txt => { try { const s = JSON.parse(txt); if (!s.perfil || !Array.isArray(s.posts)) throw 0; S = { ...novo(), ...s }; salvar(); toast('Dados importados.'); render() } catch { toast('Arquivo inválido. Use um arquivo exportado pela Pauta.') } }) }
});
document.addEventListener('change', e => { // checklist dentro do modal
  if (!e.target.dataset.pchk) return; const id = $('[data-delpost]')?.dataset.delpost, p = S.posts.find(x => x.id === id); if (!p) return;
  const i = +e.target.dataset.pchk; p.check = e.target.checked ? [...new Set([...p.check, i])] : p.check.filter(x => x !== i); salvar();
});
document.addEventListener('input', e => {
  const t = e.target;
  if (t.id === 'fq') { fId.q = t.value; clearTimeout(t.__t); t.__t = setTimeout(() => { const pos = t.selectionStart; render(false); const n = $('#fq'); n.focus(); n.setSelectionRange(pos, pos) }, 250); return }
  if (t.id === 'etx') return mostrarEtica(t.value, '#eres');
  if (t.id === 'mp-legenda' || t.id === 'mp-roteiro') return mostrarEtica($('#mp-legenda').value + '\n' + $('#mp-roteiro').value, '#mp-etica');
  if (t.id === 'w-nome') { wiz.d.nome = t.value; const b = $('[data-wiz="1"]'); if (b) b.disabled = t.value.trim().length < 2 }
});
document.addEventListener('submit', e => {
  if (e.target.id !== 'fmet') return; e.preventDefault(); const f = new FormData(e.target), r = Object.fromEntries(f.entries());
  ['seguidores', 'alcance', 'salvos', 'compart', 'visitas', 'mensagens'].forEach(k => r[k] = +r[k] || 0);
  S.metricas = S.metricas.filter(m => m.data !== r.data).concat(r); salvar(); toast('Semana registrada.'); render(false);
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('#modal').innerHTML) fechar() });
// arrastar e soltar (calendário e produção)
document.addEventListener('dragstart', e => { const c = e.target.closest?.('[data-drag]'); if (c) { e.dataTransfer.setData('text/plain', c.dataset.drag); c.classList.add('arrastando') } });
document.addEventListener('dragend', e => e.target.classList?.remove('arrastando'));
document.addEventListener('dragover', e => { const z = e.target.closest?.('[data-drop],[data-dropst]'); if (z) { e.preventDefault(); z.classList.add('alvo') } });
document.addEventListener('dragleave', e => e.target.closest?.('[data-drop],[data-dropst]')?.classList.remove('alvo'));
document.addEventListener('drop', e => {
  const z = e.target.closest?.('[data-drop],[data-dropst]'); if (!z) return; e.preventDefault(); const p = S.posts.find(x => x.id === e.dataTransfer.getData('text/plain')); if (!p) return;
  if (z.dataset.drop) { p.data = z.dataset.drop; p.semana = Math.max(0, Math.floor((dataDe(p.data) - segunda(dataDe(S.perfil.inicio))) / 864e5 / 7)); S.posts.sort((a, b) => a.data.localeCompare(b.data)); toast(`Remarcado para ${fmt(p.data, { day:'2-digit', month:'long' })}.`) }
  else { p.status = z.dataset.dropst; toast(`Movido para “${STATUS[STI[p.status]].nome}”.`) }
  salvar(); render(false);
});

render();
})();
