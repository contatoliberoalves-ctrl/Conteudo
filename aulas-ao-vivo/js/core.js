import { SUPABASE_URL, SUPABASE_KEY } from './config.js';

export const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, storageKey: 'arena-vde-auth' },
  realtime: { params: { eventsPerSecond: 20 } },
});

// ---------- utilidades ----------
export const semAcento = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
export const embaralhar = (arr) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
export const LETRAS = 'ABCDEFGHIJ';
export const iniciais = (nome) => String(nome || '?').trim().split(/\s+/).slice(0, 2).map((p) => p[0]).join('').toUpperCase();
export function corDoNome(nome) {
  const cores = ['#1D6FF2', '#6D3FF5', '#9B30E8', '#0EA5A4', '#E8590C', '#D6336C', '#2F9E44', '#3B5BDB'];
  let h = 0; for (const c of String(nome)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return cores[h % cores.length];
}
export const fmt = (n) => Number(n || 0).toLocaleString('pt-BR');
export function gerarCodigo() {
  const al = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 5 }, () => al[Math.floor(Math.random() * al.length)]).join('');
}
export function mensagemErro(e) {
  const m = String(e?.message || e || '');
  const mapa = {
    sala_nao_encontrada: 'Não encontrei essa sala. Confira o código.',
    sala_encerrada: 'Essa aula já foi encerrada.',
    nome_invalido: 'Digite seu nome.',
    email_invalido: 'Digite um e-mail válido.',
    email_nao_cadastrado: 'Esse e-mail não está na lista de alunos do VDE. Use o e-mail do seu cadastro na plataforma.',
    participante_invalido: 'Sua entrada expirou. Entre de novo.',
    pergunta_fechada: 'A pergunta já foi fechada.',
    tempo_esgotado: 'O tempo acabou antes do envio.',
    sem_permissao: 'Sua conta não tem acesso ao painel.',
    'Invalid login credentials': 'E-mail ou senha incorretos.',
  };
  for (const k in mapa) if (m.includes(k)) return mapa[k];
  return m || 'Algo deu errado. Tente de novo.';
}

// relógio do servidor (para o cronômetro bater em todas as telas)
let desvio = 0;
export const agoraServidor = () => Date.now() + desvio;
export function ajustarRelogio(isoServidor) { if (isoServidor) desvio = new Date(isoServidor).getTime() - Date.now(); }
export async function sincronizarRelogio() {
  const t0 = Date.now(); const { data } = await sb.rpc('aovivo_agora');
  if (data) desvio = new Date(data).getTime() - (t0 + Date.now()) / 2;
}

// ---------- tipos de desafio ----------
export const TIPOS = {
  ce: { nome: 'Certo ou errado', curto: 'C/E', icone: 'balanca' },
  multipla: { nome: 'Múltipla escolha', curto: 'Escolha', icone: 'alvo' },
  multi: { nome: 'Marque todas as corretas', curto: 'Marque', icone: 'check' },
  ordenar: { nome: 'Coloque em ordem', curto: 'Ordem', icone: 'escada' },
  artigo: { nome: 'Caça ao artigo', curto: 'Artigo', icone: 'livro' },
  texto: { nome: 'Resposta curta', curto: 'Escrita', icone: 'caneta' },
  etapas: { nome: 'Desafio em etapas', curto: 'Etapas', icone: 'trilha' },
};
export const SUBTIPOS = ['multipla', 'multi', 'ce', 'artigo', 'texto', 'ordenar'];

export const MODOS = {
  quiz: { nome: 'Quiz relâmpago', desc: 'Certo ou errado em sequência, com tempo curto e bônus por velocidade.' },
  raciocinio: { nome: 'Construção do raciocínio', desc: 'O aluno monta a resposta da questão em etapas: instituto, fundamento e conclusão.' },
  peca: { nome: 'Identificação e estruturação da peça', desc: 'Qual é a peça, competência, partes, fundamentos, estrutura e pedidos.' },
  artigo: { nome: 'Caça ao artigo', desc: 'O aluno acha o dispositivo usando o Índice Remissivo.' },
  misto: { nome: 'Aula mista', desc: 'Combine os tipos que quiser.' },
};

// Rascunho (o que o professor edita) <-> conteúdo público + gabarito secreto
export function dividir(tipo, r) {
  r = r || {};
  switch (tipo) {
    case 'ce': return { c: { afirmacao: r.afirmacao || '' }, g: { certo: !!r.certo, comentario: r.comentario || '' } };
    case 'multipla': return { c: { enunciado: r.enunciado || '', alternativas: r.alternativas || [] }, g: { correta: r.correta ?? 0, comentario: r.comentario || '' } };
    case 'multi': return { c: { enunciado: r.enunciado || '', opcoes: r.opcoes || [] }, g: { corretas: r.corretas || [], comentario: r.comentario || '' } };
    case 'ordenar': return { c: { enunciado: r.enunciado || '', itens: embaralharDiferente(r.itens || []) }, g: { ordem: r.itens || [], comentario: r.comentario || '' } };
    case 'artigo': return { c: { enunciado: r.enunciado || '', dica: r.dica || '' }, g: { aceitas: r.aceitas || [], resposta: r.resposta || '', comentario: r.comentario || '' } };
    case 'texto': return { c: { enunciado: r.enunciado || '' }, g: { palavras: r.palavras || [], modelo: r.modelo || '', comentario: r.comentario || '' } };
    case 'etapas': {
      const partes = (r.etapas || []).map((e) => ({ e, d: dividir(e.tipo, e) }));
      return {
        c: { enunciado: r.enunciado || '', etapas: partes.map(({ e, d }) => ({ titulo: e.titulo || '', tipo: e.tipo, ...d.c })) },
        g: { etapas: partes.map(({ d }) => d.g), comentario: r.comentario || '' },
      };
    }
  }
  return { c: {}, g: {} };
}
function embaralharDiferente(itens) {
  if (itens.length < 2) return [...itens];
  for (let k = 0; k < 8; k++) { const e = embaralhar(itens); if (e.some((x, i) => x !== itens[i])) return e; }
  return [...itens].reverse();
}
export function juntar(tipo, c, g) {
  c = c || {}; g = g || {};
  switch (tipo) {
    case 'ce': return { afirmacao: c.afirmacao, certo: g.certo, comentario: g.comentario };
    case 'multipla': return { enunciado: c.enunciado, alternativas: c.alternativas || [], correta: g.correta, comentario: g.comentario };
    case 'multi': return { enunciado: c.enunciado, opcoes: c.opcoes || [], corretas: g.corretas || [], comentario: g.comentario };
    case 'ordenar': return { enunciado: c.enunciado, itens: g.ordem || c.itens || [], comentario: g.comentario };
    case 'artigo': return { enunciado: c.enunciado, dica: c.dica, aceitas: g.aceitas || [], resposta: g.resposta, comentario: g.comentario };
    case 'texto': return { enunciado: c.enunciado, palavras: g.palavras || [], modelo: g.modelo, comentario: g.comentario };
    case 'etapas': return {
      enunciado: c.enunciado, comentario: g.comentario,
      etapas: (c.etapas || []).map((e, i) => ({ titulo: e.titulo, tipo: e.tipo, ...juntar(e.tipo, e, (g.etapas || [])[i]) })),
    };
  }
  return {};
}

// ---------- correção automática ----------
const ROMANOS = /^(?=[ivxlc]+$)c{0,3}(xc|xl|l?x{0,3})(ix|iv|v?i{0,3})$/;
export function tokensArtigo(s) {
  let t = semAcento(s).replace(/[ºª°]/g, '').replace(/\bn\.?\s*o\b/g, ' ');
  t = t.replace(/paragrafo\s+unico|par\.?\s*un(ico)?\.?|p\.\s*u\./g, ' pu ');
  t = t.replace(/§+\s*(\d+)/g, ' p$1 ').replace(/paragrafo\s+(\d+)/g, ' p$1 ');
  t = t.replace(/alinea\s+["'“]?([a-z])\b/g, ' al$1 ');
  t = t.replace(/inciso\s+/g, ' ').replace(/art(igo)?s?\.?\s*/g, ' ');
  const out = [];
  for (const w of t.split(/[^a-z0-9-]+/)) {
    if (!w) continue;
    if (/^\d+(-[a-z])?$/.test(w) || /^p\d+$/.test(w) || w === 'pu' || /^al[a-z]$/.test(w)) out.push(w);
    else if (ROMANOS.test(w)) out.push(w);
  }
  return out;
}
function contemEmOrdem(alvo, tokens) { let i = 0; for (const t of tokens) if (t === alvo[i]) i++; return i >= alvo.length; }
export function corrigirArtigo(aceitas, texto) {
  const st = tokensArtigo(texto); if (!st.length) return 0;
  let melhor = 0;
  for (const a of aceitas || []) {
    const at = tokensArtigo(a); if (!at.length) continue;
    if (contemEmOrdem(at, st)) return 1;
    if (st.includes(at[0])) melhor = Math.max(melhor, at.length > 1 ? 0.5 : 0);
  }
  return melhor;
}
export function corrigirTexto(palavras, texto) {
  const st = ' ' + semAcento(texto).replace(/\s+%/g, '%').replace(/[^a-z0-9%§ ]+/g, ' ').replace(/\s+/g, ' ') + ' ';
  const grupos = (palavras || []).filter((p) => String(p).trim());
  if (!grupos.length) return String(texto || '').trim() ? 1 : 0;
  let ok = 0;
  for (const g of grupos) {
    const alts = String(g).split('|').map((x) => semAcento(x).replace(/[^a-z0-9%§ ]+/g, ' ').replace(/\s+/g, ' ').trim()).filter(Boolean);
    if (alts.some((a) => st.includes(a.length <= 3 ? ` ${a} ` : a))) ok++;
  }
  return ok / grupos.length;
}
export function corrigir(tipo, c, g, v) {
  if (v == null) return 0;
  c = c || {}; g = g || {};
  switch (tipo) {
    case 'ce': return v.v === !!g.certo ? 1 : 0;
    case 'multipla': return v.i === g.correta ? 1 : 0;
    case 'multi': {
      const cor = new Set(g.corretas || []); const sel = new Set(v.sel || []);
      if (!cor.size) return sel.size ? 0 : 1;
      let a = 0, e = 0; sel.forEach((i) => (cor.has(i) ? a++ : e++));
      return Math.max(0, (a - e) / cor.size);
    }
    case 'ordenar': {
      const ord = g.ordem || []; const r = v.ordem || [];
      if (!ord.length) return 0;
      return ord.filter((x, i) => r[i] === x).length / ord.length;
    }
    case 'artigo': return corrigirArtigo(g.aceitas, v.t);
    case 'texto': return corrigirTexto(g.palavras, v.t);
    case 'etapas': {
      const et = c.etapas || []; if (!et.length) return 0;
      const notas = et.map((e, i) => corrigir(e.tipo, e, (g.etapas || [])[i], (v.etapas || [])[i]));
      return notas.reduce((s, x) => s + x, 0) / et.length;
    }
  }
  return 0;
}
export function notasEtapas(c, g, v) {
  return (c.etapas || []).map((e, i) => corrigir(e.tipo, e, (g.etapas || [])[i], (v?.etapas || [])[i]));
}
// pontos: proporcional ao acerto + até 25% de bônus de velocidade quando acerta tudo
export function calcularPontos(fracao, ms, tempo, base) {
  base = base || 1000;
  let p = Math.round(base * fracao);
  if (fracao >= 1 && tempo > 0) p += Math.round(base * 0.25 * Math.max(0, 1 - ms / (tempo * 1000)));
  return p;
}
export function respostaPronta(tipo, c, v) {
  if (!v) return false;
  switch (tipo) {
    case 'ce': return typeof v.v === 'boolean';
    case 'multipla': return Number.isInteger(v.i);
    case 'multi': return (v.sel || []).length > 0;
    case 'ordenar': return (v.ordem || []).length > 0;
    case 'artigo': case 'texto': return String(v.t || '').trim().length > 0;
    case 'etapas': return (c.etapas || []).every((e, i) => respostaPronta(e.tipo, e, (v.etapas || [])[i]));
  }
  return false;
}
export function valorInicial(tipo, c) {
  if (tipo === 'ordenar') return { ordem: [...(c.itens || [])] };
  if (tipo === 'etapas') return { etapas: (c.etapas || []).map((e) => valorInicial(e.tipo, e)) };
  return null;
}
// texto da resposta certa, para mostrar
export function textoGabarito(tipo, c, g) {
  c = c || {}; g = g || {};
  switch (tipo) {
    case 'ce': return g.certo ? 'CERTO' : 'ERRADO';
    case 'multipla': return `${LETRAS[g.correta] || '?'}) ${(c.alternativas || [])[g.correta] ?? ''}`;
    case 'multi': return (g.corretas || []).map((i) => (c.opcoes || [])[i]).join(' · ');
    case 'ordenar': return (g.ordem || []).map((x, i) => `${i + 1}. ${x}`).join('  ');
    case 'artigo': return g.resposta || (g.aceitas || [])[0] || '';
    case 'texto': return g.modelo || (g.palavras || []).join(', ');
  }
  return '';
}

// ---------- índice remissivo ----------
let _indice;
export async function carregarIndice() {
  if (!_indice) _indice = fetch(new URL('../dados/indice.json', import.meta.url)).then((r) => r.json()).then((l) => l.map((e) => ({ ...e, k: semAcento(`${e.t} ${e.a} ${e.d || ''}`) })));
  return _indice;
}
export function buscarIndice(lista, q, limite = 60) {
  const termos = semAcento(q).split(/\s+/).filter(Boolean);
  if (!termos.length) return [];
  const res = [];
  for (const e of lista) {
    if (termos.every((t) => e.k.includes(t))) {
      const nome = semAcento(e.t);
      const score = (nome.startsWith(termos[0]) ? 0 : nome.includes(termos[0]) ? 1 : 2) + (e.cf ? 0 : 0.5);
      res.push([score, e]);
    }
  }
  return res.sort((a, b) => a[0] - b[0] || a[1].t.localeCompare(b[1].t)).slice(0, limite).map((x) => x[1]);
}
export function linkPlanalto(arts) {
  return 'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm';
}
