/* Utilidades, ícones e a camada de dados.
   Hoje os dados ficam no navegador (localStorage). Para ligar a um servidor, basta trocar
   Banco.ler/gravar e Eu.ler/gravar por chamadas à API: o resto do site só usa essas funções. */
const PREVIA = !!window.ARPEN_PREVIA; // versão de prévia: YouTube e impressão não funcionam dentro dela
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const novoId = () => Math.random().toString(36).slice(2, 9);
const semAcento = s => String(s || '').toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[̀-ͯ]/g, '');
const contem = (texto, busca) => semAcento(texto).includes(semAcento(busca));
const dataBR = s => s ? new Date(s + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ de /g, ' ').replace('.', '') : '';
const linkSeguro = s => { try { const u = new URL(s, location.href); return ['https:', 'http:'].includes(u.protocol) || u.origin === location.origin ? u.href : ''; } catch { return ''; } };
const paragrafos = s => esc(s).split(/\n{2,}/).map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');

function tempo(seg) {
  seg = Math.max(0, Math.floor(seg || 0));
  const h = Math.floor(seg / 3600), m = Math.floor(seg % 3600 / 60), s = seg % 60;
  return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(s).padStart(2, '0');
}
function duracao(seg) {
  if (!seg) return '';
  const m = Math.round(seg / 60);
  return seg < 60 ? seg + ' s' : m < 60 ? m + ' min' : Math.floor(m / 60) + ' h ' + (m % 60 ? m % 60 + ' min' : '');
}
/* "1:02:03", "12:30" ou "90" → segundos */
function segundos(txt) {
  const p = String(txt).trim().split(':').map(Number);
  if (p.some(isNaN)) return null;
  return p.reduce((a, n) => a * 60 + n, 0);
}
/* Lê um índice colado (o mesmo formato da descrição do YouTube): linhas com 00:00 e um título. */
function lerIndice(texto) {
  const itens = [];
  for (const linha of String(texto || '').split('\n')) {
    const m = linha.match(/(?:^|[\s(\[])((?:\d{1,2}:)?\d{1,2}:\d{2})(?=$|[\s)\]\-–—:.])/);
    if (!m) continue;
    const titulo = (linha.slice(0, m.index) + ' ' + linha.slice(m.index + m[0].length)).replace(/^[\s\-–—:.)\]•*]+|[\s\-–—:(\[]+$/g, '').replace(/\s+/g, ' ').trim();
    itens.push({ t: segundos(m[1]), titulo: titulo || 'Trecho ' + (itens.length + 1) });
  }
  return itens.sort((a, b) => a.t - b.t);
}
const escreverIndice = indice => (indice || []).map(c => tempo(c.t).padStart(5, '0') + ' ' + c.titulo).join('\n');

/* Reconhece o link colado: YouTube (qualquer formato) ou arquivo de vídeo. */
function lerVideo(link) {
  link = String(link || '').trim();
  if (!link) return null;
  const yt = link.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|live\/|shorts\/|v\/))([\w-]{11})/) || link.match(/^([\w-]{11})$/);
  if (yt) {
    const t = link.match(/[?&#](?:t|start)=(\d+)/);
    return { tipo: 'youtube', id: yt[1], inicio: t ? +t[1] : 0 };
  }
  return linkSeguro(link) || /^[\w./-]+\.(mp4|webm|m4v|mov)$/i.test(link) ? { tipo: 'arquivo', url: link } : null;
}
const linkDoVideo = v => !v ? '' : v.tipo === 'youtube' ? 'https://www.youtube.com/watch?v=' + v.id : v.url;

const TRACOS = {
  seta: 'M5 12h14m-6-6 6 6-6 6', voltar: 'M19 12H5m6-6-6 6 6 6', fora: 'M7 17 17 7M8 7h9v9', baixar: 'M12 3v12m-5-5 5 5 5-5M5 20h14',
  ok: 'm5 12 4.5 4.5L19 7', x: 'm6 6 12 12M18 6 6 18', mais: 'M12 5v14M5 12h14', busca: 'M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14Zm9 16-4-4',
  play: 'M8 5.5v13l11-6.5Z', pausa: 'M8 5v14M16 5v14', pessoa: 'M16 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21a8 8 0 0 1 16 0', pessoas: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-7 9a7 7 0 0 1 14 0M16 4.5a3.5 3.5 0 0 1 0 6.5m2.5 3a7 7 0 0 1 3.5 6',
  livro: 'M4 5h6a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H4Zm16 0h-6a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h6Z', agenda: 'M5 6h14v15H5ZM5 11h14M9 3v5m6-5v5', sino: 'M6 17V10a6 6 0 0 1 12 0v7l2 2H4Zm4 5h4',
  casa: 'M4 11 12 4l8 7v9h-5v-6H9v6H4Z', pasta: 'M3 6h6l2 2.5h10V19H3Z', jornal: 'M5 4h12v16H5ZM17 9h3v9a2 2 0 0 1-2 2M8 8h6M8 12h6M8 16h4', bussola: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Zm3.5 5.5-2 5-5 2 2-5Z',
  lapis: 'M4 20h4L19 9l-4-4L4 16Zm9-13 4 4', lixo: 'M5 7h14M10 7V4h4v3m-7 0 1 13h8l1-13', copiar: 'M9 9h11v11H9ZM5 15H4V4h11v1', arrastar: 'M9 6h.01M9 12h.01M9 18h.01M15 6h.01M15 12h.01M15 18h.01',
  cima: 'm6 14 6-6 6 6', baixo: 'm6 10 6 6 6-6', lista: 'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01', nota: 'M5 4h14v11l-5 5H5Zm9 16v-5h5M8 9h8M8 13h5',
  volume: 'M4 10v4h4l5 4V6L8 10Zm12-1a4 4 0 0 1 0 6m2.5-9a8 8 0 0 1 0 12', mudo: 'M4 10v4h4l5 4V6L8 10Zm12 0 5 5m0-5-5 5', tela: 'M4 9V4h5m6 0h5v5m0 6v5h-5m-6 0H4v-5', pip: 'M3 5h18v14H3Zm9 6h7v6h-7Z',
  volta10: 'M4 5v5h5M4.6 10A8 8 0 1 1 4 13', avanca10: 'M20 5v5h-5m4.4 0A8 8 0 1 0 20 13', relogio: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Zm0 5v4l3 2', menu: 'M4 7h16M4 12h16M4 17h16',
  estrela: 'm12 3 2.6 5.6 6 .7-4.5 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6L3.4 9.3l6-.7Z', olho: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Zm10-3a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z', sair: 'M14 4h6v16h-6M4 12h11m-4-4 4 4-4 4',
  youtube: 'M3 7.5a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3Zm7 1.5v6l5-3Z', filme: 'M4 5h16v14H4ZM8 5v14M16 5v14M4 9.5h4m8 0h4M4 14.5h4m8 0h4', raio: 'M13 3 5 13h6l-1 8 8-10h-6Z', caixa: 'M4 8 12 4l8 4v8l-8 4-8-4Zm0 0 8 4 8-4m-8 4v8',
  nascimento: 'M12 4a8 8 0 1 1 0 16 8 8 0 0 1 0-16ZM9 11h.01M15 11h.01M9 14.5q3 2.5 6 0M10 4c0-2 4-2 3 1', casamento: 'M12 20 5 13C0 7.5 7 1.5 12 7c5-5.5 12 .5 7 6Z', certidao: 'M6 3h9l4 4v14H6Zm9 0v4h4M9 11h7M9 14.5h7M9 18h4',
  nome: 'm3 18 5-12 5 12M5 14h6m5-2.500c4-2 5.500.5 5 3.500-.500 3-4.500 3-5 .5-.5-2.500 5-2.500 5-2.500m0-2v6.500', obito: 'M12 21V10m0 5c-7 1-9-7-7.500-10C10 5.500 13 9 12 15Zm0-3c6.500.5 8.500-7 7-8.500C13.500 5 11.500 8 12 12Z',
};
const ico = (nome, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${TRACOS[nome] || TRACOS.seta}"/></svg>`;

/* ---------- Dados do portal (o que a equipe publica) ---------- */
const Banco = {
  chave: 'arpen-pe-conteudo-v1',
  dados: null,
  ler() {
    try { this.dados = JSON.parse(localStorage.getItem(this.chave)); } catch { this.dados = null; }
    if (!this.dados || !this.dados.cursos) this.dados = conteudoInicial();
    return this.dados;
  },
  gravar() {
    try { localStorage.setItem(this.chave, JSON.stringify(this.dados)); this.salvoEm = Date.now(); return true; }
    catch { aviso('O navegador não permitiu salvar. As alterações valem só até fechar a página.'); return false; }
  },
  restaurar() { this.dados = conteudoInicial(); this.gravar(); },
};
/* ---------- Dados de quem está usando (progresso, anotações, guias) ---------- */
const Eu = {
  chave: 'arpen-pe-eu-v1',
  d: null,
  ler() {
    try { this.d = JSON.parse(localStorage.getItem(this.chave)); } catch { this.d = null; }
    this.d = Object.assign({ perfil: null, nome: '', progresso: {}, notas: {}, lidos: [], guias: [], desafio: 0, desafioFeito: false, ultima: null, velocidade: 1, volume: 1 }, this.d || {});
    return this.d;
  },
  gravar() { try { localStorage.setItem(this.chave, JSON.stringify(this.d)); } catch { /* segue sem salvar */ } },
};

const publicados = lista => (lista || []).filter(x => x.status !== 'rascunho');
const todasAulas = curso => curso.modulos.flatMap(m => m.aulas);
const aulasNoAr = curso => todasAulas(curso).filter(a => a.status === 'publicado' && a.video);
function acharAula(id) {
  for (const curso of Banco.dados.cursos) for (const modulo of curso.modulos) { const aula = modulo.aulas.find(a => a.id === id); if (aula) return { curso, modulo, aula }; }
  return null;
}
function progressoCurso(curso) {
  const aulas = aulasNoAr(curso);
  const feitas = aulas.filter(a => Eu.d.progresso[a.id]?.feita).length;
  return { total: aulas.length, feitas, pct: aulas.length ? Math.round(feitas / aulas.length * 100) : 0 };
}

/* ---------- Avisos rápidos, janela e download ---------- */
let avisoTimer;
function aviso(texto, acao) {
  const el = $('#aviso');
  el.innerHTML = `<span>${esc(texto)}</span>${acao ? `<button type="button">${esc(acao.rotulo)}</button>` : ''}`;
  if (acao) $('button', el).onclick = () => { el.hidden = true; acao.fazer(); };
  el.hidden = false; el.classList.remove('entra'); void el.offsetWidth; el.classList.add('entra');
  clearTimeout(avisoTimer); avisoTimer = setTimeout(() => { el.hidden = true; }, acao ? 7000 : 3800);
}
function janela(html, cls = '') {
  const d = $('#janela');
  d.className = cls;
  $('#janela-corpo').innerHTML = html;
  if (!d.open) d.showModal();
}
const fecharJanela = () => $('#janela').open && $('#janela').close();

async function baixar(conteudo, nome, tipo) {
  const blob = new Blob([conteudo], { type: tipo });
  try {
    const cap = await window.claude?.use?.('downloads');
    if (cap) { await cap.save({ filename: nome, data: blob }); return; }
  } catch { /* cai no link comum */ }
  const url = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = url; a.download = nome; document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
async function copiar(texto) {
  try { await navigator.clipboard.writeText(texto); aviso('Copiado.'); } catch { aviso('Não foi possível copiar. Selecione o texto e copie.'); }
}
