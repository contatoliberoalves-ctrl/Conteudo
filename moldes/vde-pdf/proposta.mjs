// Documento de propostas da Mentoria Método VDE (para professores e coordenação), PDF A4 retrato,
// na identidade do molde (degradê roxo → índigo, páginas brancas com faixa fina, Poppins).
// Conteúdo em proposta.json. Uso: node proposta.mjs [id]  -> saida/<id>/<id>.pdf, 1.png … N.png e painel.png.
// Nuvem: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node proposta.mjs
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { W, H, pecaAluno } from './template.mjs';

const M = 60;
const COR = {
  roxo: '#2E0575', indigo: '#1937B1', meio: '#261C8C', lavanda: '#C9B8FF', lavandaClara: '#F2EEFF',
  borda: '#E4DDFB', tinta: '#1A1340', cinza: '#5B5875', verde: '#16794B', verdeClaro: '#E3F6EC',
};
const DEGRADE = `linear-gradient(170deg,${COR.roxo} 0%,${COR.meio} 45%,${COR.indigo} 100%)`;
const DEG_H = `linear-gradient(90deg,${COR.roxo},${COR.indigo})`;
const FONTES = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap';
const F = "font-family:'Poppins',sans-serif";
const TIT = `${F};font-weight:800;letter-spacing:-.02em`;
const PERFIS = '@nataliavalenca · @liberofilho';

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const lista = v => (v == null ? [] : Array.isArray(v) ? v : [v]);
const dois = n => String(n).padStart(2, '0');
const grad = t => `<span style="background:${DEG_H};-webkit-background-clip:text;background-clip:text;color:transparent">${t}</span>`;
const rico = (s, escuro) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b style="font-weight:700">$1</b>')
  .replace(/\[\[(.+?)\]\]/g, (_, t) => escuro ? `<span style="color:${COR.lavanda}">${t}</span>` : grad(t));
const arcos = (cx, cy, r0, n, cor) => `<svg width="${W}" height="${H}" style="position:absolute;inset:0;pointer-events:none">${Array.from({ length: n }, (_, k) => `<circle cx="${cx}" cy="${cy}" r="${r0 + k * 22}" fill="none" stroke="${cor}" stroke-width="1.2"/>`).join('')}</svg>`;
const kick = (txt, cor = COR.indigo) => `<div style="${F};font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:${cor}">${esc(txt)}</div>`;
const quadro = (n, tam = 38, escuro = false) => `<span style="flex:none;width:${tam}px;height:${tam}px;border-radius:${Math.round(tam * .27)}px;background:${escuro ? 'rgba(255,255,255,.16)' : DEG_H};color:#fff;display:inline-flex;align-items:center;justify-content:center;${F};font-weight:700;font-size:${Math.round(tam * .42)}px">${esc(n)}</span>`;
const titulo = (k, t, ts = 36) => `${kick(k)}<div style="${TIT};font-size:${ts}px;line-height:1.06;color:${COR.tinta};margin-top:8px">${rico(t)}</div>`;
const par = (t, tam = 13.4) => `<p style="${F};font-size:${tam}px;line-height:1.6;color:${COR.tinta};margin:0 0 8px">${rico(t)}</p>`;
const ponto = (t, cor = COR.roxo) => `<div style="display:flex;gap:10px;${F};font-size:12.6px;line-height:1.5;color:${COR.tinta};margin-top:6px"><span style="flex:none;width:6px;height:6px;border-radius:2px;background:${cor};margin-top:7px"></span><span>${rico(t)}</span></div>`;
const preco = v => { const [r, c] = String(v).split(','); return `R$ <span style="font-size:1.55em">${esc(r.replace(/^R\$\s*/, ''))}</span>${c ? `,${esc(c)}` : ''}`; };

function branca(corpo, cab, n, bg = '#fff') {
  return `<section class="pagina" style="background:${bg}">
    <div style="position:absolute;left:0;right:0;top:0;height:7px;background:${DEG_H}"></div>
    <div style="position:absolute;left:${M}px;right:${M}px;top:30px;display:flex;justify-content:space-between;${F};font-size:9.5px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:${COR.indigo}"><span>Método VDE · Propostas de mentoria</span><span style="color:${COR.cinza}">${esc(cab)}</span></div>
    <div class="cabe" style="position:absolute;left:${M}px;right:${M}px;top:72px;bottom:74px;overflow:hidden;display:flex;flex-direction:column">${corpo}</div>
    <div style="position:absolute;left:${M}px;right:${M}px;bottom:30px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid ${COR.borda};padding-top:10px;${F};font-size:10px;font-weight:500;color:${COR.cinza}"><span>${PERFIS}</span><span style="font-weight:700;color:${COR.roxo}">${dois(n)}</span></div>
  </section>`;
}

function capa(p) {
  const c = p.capa;
  return `<section class="pagina" style="background:${DEGRADE};color:#fff">
    ${arcos(W + 120, 640, 260, 9, 'rgba(201,184,255,.26)')}
    <div style="position:absolute;left:${M}px;top:64px;display:flex;align-items:center;gap:12px"><span style="width:34px;height:3px;border-radius:2px;background:#C9B8FF"></span>${kick('Método VDE', '#fff')}</div>
    <div style="position:absolute;left:${M}px;top:92px;${F};font-size:11px;font-weight:500;letter-spacing:.12em;color:#ECE8FF">MENTORIA · 2ª FASE OAB</div>
    <div style="position:absolute;left:${M}px;right:${M}px;top:130px;height:1px;background:rgba(255,255,255,.22)"></div>
    <div style="position:absolute;left:${M}px;right:${M + 40}px;top:270px">
      ${kick(c.rotulo, COR.lavanda)}
      <div style="${TIT};font-size:${c.ts || 74}px;line-height:1.02;margin-top:16px">${lista(c.titulo).map(l => rico(l, true)).join('<br>')}</div>
      <span style="display:block;width:70px;height:5px;border-radius:3px;background:${COR.lavanda};margin-top:26px"></span>
      <p style="${F};font-size:16px;line-height:1.5;color:#ECE8FF;margin:24px 0 0;max-width:500px">${rico(c.sub, true)}</p>
    </div>
    <div style="position:absolute;left:${M}px;right:${M}px;bottom:150px;display:flex;gap:18px">
      ${p.propostas.map((q, i) => `<div style="flex:1;border-top:2px solid rgba(255,255,255,.3);padding-top:12px"><div style="${F};font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${COR.lavanda}">Proposta ${dois(i + 1)}</div><div style="${TIT};font-size:21px;line-height:1.1;margin-top:6px">${esc(q.curto)}</div><div style="${F};font-size:13px;font-weight:600;color:#ECE8FF;margin-top:6px">${preco(q.valor)}</div></div>`).join('')}
    </div>
    <div style="position:absolute;left:${M}px;right:${M}px;bottom:96px;height:1px;background:rgba(255,255,255,.22)"></div>
    <div style="position:absolute;left:${M}px;right:${M}px;bottom:52px;display:flex;justify-content:space-between;align-items:baseline">
      <span style="${F};font-size:22px;font-weight:700">Natália e Líbero</span><span style="${F};font-size:11px;font-weight:500;color:#ECE8FF">${PERFIS}</span></div>
  </section>`;
}

// Visão geral: as três propostas lado a lado + o que vale para todas.
function visao(p, n) {
  const v = p.visao;
  const cards = p.propostas.map((q, i) => `<div style="flex:1;display:flex;flex-direction:column;border:1px solid ${COR.borda};border-radius:16px;overflow:hidden;background:#fff">
      <div style="background:${DEGRADE};color:#fff;padding:14px 16px 14px">
        <div style="${F};font-size:9.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${COR.lavanda}">Proposta ${dois(i + 1)}</div>
        <div style="${TIT};font-size:20px;line-height:1.1;margin-top:5px;min-height:44px">${esc(q.nome)}</div>
        <div style="${F};font-size:14px;font-weight:700;margin-top:8px">${preco(q.valor)}</div>
      </div>
      <div style="padding:10px 16px 14px;flex:1">
        <div style="${F};font-size:11.5px;line-height:1.45;color:${COR.cinza}">${rico(q.para)}</div>
        ${lista(q.resumo).map(t => ponto(t)).join('')}
      </div></div>`).join('');
  return branca(`${titulo(v.kicker, v.titulo)}
    <div style="margin-top:14px">${lista(v.intro).map(t => par(t)).join('')}</div>
    <div style="display:flex;gap:12px;margin-top:10px">${cards}</div>
    <div style="margin-top:20px;background:${COR.lavandaClara};border-radius:18px;padding:18px 22px 20px">
      ${kick(v.comum.kicker, COR.roxo)}
      <div style="${TIT};font-size:20px;color:${COR.tinta};margin:6px 0 4px">${rico(v.comum.titulo)}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:2px 20px">${lista(v.comum.itens).map(t => ponto(t)).join('')}</div>
    </div>`, 'Visão geral', n);
}

// Abertura de uma proposta: faixa em degradê com nome, valor e a ideia central; depois o que entra.
function abertura(q, i, n, extra = '') {
  const itens = lista(q.itens).map((it, k) => `<div style="display:flex;gap:14px;align-items:flex-start;padding:14px 0;border-bottom:1px dashed ${COR.borda}">
      ${quadro(k + 1, 34)}
      <div><div style="${F};font-size:15.5px;font-weight:700;color:${COR.tinta}">${rico(it.titulo)}</div>
      ${lista(it.texto).map(t => `<div style="${F};font-size:12.8px;line-height:1.5;color:${COR.cinza};margin-top:3px">${rico(t)}</div>`).join('')}
      ${it.nota ? `<div style="display:inline-block;margin-top:6px;background:${COR.verdeClaro};color:${COR.verde};${F};font-size:10px;font-weight:700;padding:2px 10px;border-radius:999px">${esc(it.nota)}</div>` : ''}</div></div>`).join('');
  return branca(`<div style="background:${DEGRADE};border-radius:20px;color:#fff;padding:22px 26px 22px;position:relative;overflow:hidden">
      <svg width="300" height="200" style="position:absolute;right:-60px;top:-40px">${Array.from({ length: 6 }, (_, k) => `<circle cx="220" cy="100" r="${50 + k * 20}" fill="none" stroke="rgba(201,184,255,.22)" stroke-width="1.2"/>`).join('')}</svg>
      <div style="position:relative;display:flex;justify-content:space-between;align-items:flex-start;gap:20px">
        <div>${kick(`Proposta ${dois(i + 1)}`, COR.lavanda)}
          <div style="${TIT};font-size:38px;line-height:1.02;margin-top:8px">${String(q.titulo).split('<br>').map(l => rico(l, true)).join('<br>')}</div></div>
        <div style="flex:none;text-align:right;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.25);border-radius:14px;padding:10px 16px">
          <div style="${F};font-size:9.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${COR.lavanda}">Valor</div>
          <div style="${TIT};font-size:20px;margin-top:2px;white-space:nowrap">${preco(q.valor)}</div></div>
      </div>
      <p style="position:relative;${F};font-size:13.4px;line-height:1.55;color:#ECE8FF;margin:14px 0 0;max-width:560px">${rico(q.ideia, true)}</p>
    </div>
    ${q.missao ? `<div style="margin-top:16px;display:flex;gap:14px;align-items:center;border:1.5px solid ${COR.roxo};border-radius:14px;padding:12px 18px"><div style="flex:none;${F};font-size:10px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:${COR.roxo}">Nossa<br>missão</div><div style="width:1px;align-self:stretch;background:${COR.borda}"></div><div style="${F};font-size:13.6px;font-weight:600;line-height:1.45;color:${COR.tinta}">${rico(q.missao)}</div></div>` : ''}
    <div style="margin-top:14px">${kick(q.kickerItens || 'O que entra', COR.indigo)}</div>
    <div style="margin-top:2px">${itens}</div>
    ${q.jornada ? jornada(q.jornada) : ''}
    ${extra}`, q.curto, n);
}

// Jornada do aluno: 4 etapas em linha, no pé da página da proposta.
function jornada(j) {
  return `<div style="margin-top:auto;padding-top:18px">${kick(j.kicker || 'Na prática', COR.indigo)}
    <div style="display:grid;grid-template-columns:repeat(${lista(j.etapas).length},1fr);gap:10px;margin-top:10px;position:relative">
      ${lista(j.etapas).map(([q, o], k) => `<div style="background:${k % 2 ? '#fff' : COR.lavandaClara};border:1px solid ${COR.borda};border-radius:14px;padding:12px 14px 14px;position:relative">
        <div style="height:4px;width:34px;border-radius:2px;background:${DEG_H};margin-bottom:10px"></div>
        <div style="${F};font-size:9.5px;font-weight:800;letter-spacing:.13em;text-transform:uppercase;color:${COR.indigo}">${esc(q)}</div>
        <div style="${F};font-size:12.6px;font-weight:600;line-height:1.4;color:${COR.tinta};margin-top:4px">${rico(o)}</div></div>`).join('')}
    </div></div>`;
}

// Trilha de encontros sugeridos (Repescagem).
function encontros(q, n) {
  const e = q.encontros;
  const linhas = lista(e.lista).map((t, k, arr) => `<div style="display:grid;grid-template-columns:54px 1fr;gap:16px;align-items:stretch">
      <div style="display:flex;flex-direction:column;align-items:center">${quadro(dois(k + 1), 46)}${k < arr.length - 1 ? `<div style="flex:1;width:3px;background:${COR.borda};margin-top:4px;border-radius:2px"></div>` : ''}</div>
      <div style="background:${k % 2 ? '#fff' : COR.lavandaClara};border:1px solid ${COR.borda};border-radius:14px;padding:12px 18px;margin-bottom:12px">
        <div style="${F};font-size:9.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${COR.indigo}">Encontro ${dois(k + 1)}</div>
        <div style="${F};font-size:15px;font-weight:700;color:${COR.tinta};margin-top:2px">${rico(t.titulo)}</div>
        ${t.texto ? `<div style="${F};font-size:11.8px;line-height:1.5;color:${COR.cinza};margin-top:3px">${rico(t.texto)}</div>` : ''}
      </div></div>`).join('');
  return branca(`${titulo(e.kicker, e.titulo)}
    <div style="margin-top:12px">${lista(e.intro).map(t => par(t)).join('')}</div>
    <div style="margin-top:8px">${linhas}</div>
    ${e.nota ? `<p style="${F};font-size:10.8px;line-height:1.5;color:${COR.cinza};margin:4px 0 0">${rico(e.nota)}</p>` : ''}`, `${q.curto} · encontros`, n, '#FBFAFF');
}

// Relatório da correção: explicação + trecho de uma página real do template de análise.
function relatorio(q, n) {
  const r = q.relatorio;
  const e = .6, lw = Math.round(W * e), lh = Math.round(H * e * .6);
  const pagina = pecaAluno(r.exemplo, 3);
  const passos = lista(r.passos).map((t, k) => `<div style="display:flex;gap:12px;align-items:flex-start;margin-top:14px">${quadro(k + 1, 30)}<div style="${F};font-size:12.8px;line-height:1.5;color:${COR.tinta};padding-top:4px">${rico(t)}</div></div>`).join('');
  return branca(`${titulo(r.kicker, r.titulo, 32)}
    <div style="margin-top:12px">${lista(r.intro).map(t => par(t, 13)).join('')}</div>
    <div style="display:grid;grid-template-columns:1fr ${lw}px;gap:24px;margin-top:10px">
      <div>${kick('Como funciona', COR.indigo)}${passos}</div>
      <div>
        <div style="width:${lw}px;height:${lh}px;overflow:hidden;border-radius:12px;box-shadow:0 14px 34px rgba(46,5,117,.22),0 0 0 1px ${COR.borda};position:relative">
          <div style="width:${W}px;height:${H}px;transform:scale(${e});transform-origin:0 0">${pagina}</div>
          <div style="position:absolute;left:0;right:0;bottom:0;height:60px;background:linear-gradient(180deg,rgba(255,255,255,0),#fff 85%)"></div>
        </div>
        <div style="${F};font-size:10px;line-height:1.45;color:${COR.cinza};text-align:center;margin-top:10px">${rico(r.legenda)}</div>
      </div>
    </div>
    <div style="margin-top:auto;background:${DEGRADE};border-radius:18px;color:#fff;padding:18px 22px 20px">
      ${kick('Por que isso convence o aluno', COR.lavanda)}
      <div style="display:grid;grid-template-columns:repeat(${lista(r.porque).length},1fr);gap:14px;margin-top:10px">${lista(r.porque).map((t, k) => `<div style="border-top:2px solid rgba(255,255,255,.3);padding-top:10px"><div style="${TIT};font-size:22px;color:${COR.lavanda}">${dois(k + 1)}</div><div style="${F};font-size:12.6px;line-height:1.45;margin-top:4px">${rico(t, true)}</div></div>`).join('')}</div>
    </div>`, `${q.curto} · correção`, n);
}

// Caixa de decisão do professor (Individual).
function decisao(d) {
  return `<div style="margin-top:18px;background:${DEGRADE};border-radius:18px;color:#fff;padding:18px 22px">
    ${kick(d.kicker, COR.lavanda)}
    <div style="${TIT};font-size:22px;line-height:1.15;margin-top:6px">${rico(d.titulo, true)}</div>
    <div style="display:flex;gap:12px;margin-top:14px">${lista(d.opcoes).map(o => `<div style="flex:1;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.22);border-radius:12px;padding:10px 12px;display:flex;gap:10px;align-items:flex-start"><span style="flex:none;width:14px;height:14px;border:1.8px solid #fff;border-radius:4px;margin-top:2px"></span><span style="${F};font-size:12px;line-height:1.4">${rico(o, true)}</span></div>`).join('')}</div>
  </div>`;
}

// Mockups dos formulários.
function telaCheckup(f) {
  const m = f.missoes || 5;
  return `<div style="width:230px;flex:none;background:#fff;border-radius:26px;padding:10px;box-shadow:0 16px 36px rgba(46,5,117,.2),0 0 0 1px ${COR.borda}">
    <div style="background:${DEGRADE};border-radius:18px;color:#fff;padding:14px 14px 16px">
      <div style="${F};font-size:8.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${COR.lavanda}">Checkup</div>
      <div style="${TIT};font-size:17px;line-height:1.1;margin-top:3px">O que te reprovou?</div>
      <div style="display:flex;gap:4px;margin-top:12px">${Array.from({ length: m }, (_, k) => `<span style="flex:1;height:7px;border-radius:4px;background:${k < 2 ? COR.lavanda : 'rgba(255,255,255,.22)'}"></span>`).join('')}</div>
      <div style="${F};font-size:9px;font-weight:600;color:#ECE8FF;margin-top:6px">Missão 3 de ${m}</div>
    </div>
    <div style="padding:12px 6px 4px">
      ${Array.from({ length: m }, (_, k) => `<div style="display:flex;align-items:center;gap:8px;padding:6px 4px;border-bottom:1px solid ${COR.borda}">
        <span style="flex:none;width:20px;height:20px;border-radius:6px;display:inline-flex;align-items:center;justify-content:center;${F};font-size:9px;font-weight:700;${k < 2 ? `background:${COR.verdeClaro};color:${COR.verde}` : k === 2 ? `background:${DEG_H};color:#fff` : `background:${COR.lavandaClara};color:${COR.cinza}`}">${k < 2 ? '✓' : k + 1}</span>
        <span style="${F};font-size:10.5px;font-weight:${k === 2 ? 700 : 500};color:${k > 2 ? COR.cinza : COR.tinta}">Missão ${k + 1}</span>
        <span style="margin-left:auto;${F};font-size:8.5px;color:${COR.cinza}">${k < 2 ? 'feita' : k === 2 ? 'agora' : ''}</span></div>`).join('')}
      <div style="margin-top:10px;background:${COR.lavandaClara};border-radius:10px;padding:8px 10px">
        <div style="${F};font-size:8.5px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:${COR.roxo}">No fim</div>
        <div style="${F};font-size:10px;line-height:1.4;color:${COR.tinta};margin-top:2px">Diagnóstico inicial + plano de treino individual</div></div>
    </div></div>`;
}
function telaAula(f) {
  const q = f.questoes || 4;
  const etapas = ['Palavras-chave', 'Índice remissivo', 'Construção da resposta'];
  return `<div style="width:230px;flex:none;background:#fff;border-radius:26px;padding:10px;box-shadow:0 16px 36px rgba(46,5,117,.2),0 0 0 1px ${COR.borda}">
    <div style="background:${DEGRADE};border-radius:18px;color:#fff;padding:14px 14px 16px">
      <div style="${F};font-size:8.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${COR.lavanda}">Aula ao vivo</div>
      <div style="${TIT};font-size:17px;line-height:1.1;margin-top:3px">Da leitura à resposta</div>
      <div style="display:flex;gap:5px;margin-top:12px">${Array.from({ length: q }, (_, k) => `<span style="flex:1;text-align:center;${F};font-size:9px;font-weight:700;padding:3px 0;border-radius:6px;${k === 0 ? `background:#fff;color:${COR.roxo}` : 'background:rgba(255,255,255,.16);color:#ECE8FF'}">Q${k + 1}</span>`).join('')}</div>
    </div>
    <div style="padding:12px 6px 4px">
      ${etapas.map((e, k) => `<div style="border:1px solid ${k === 1 ? COR.roxo : COR.borda};border-radius:10px;padding:7px 10px;margin-top:${k ? 7 : 0}px;${k === 2 ? 'opacity:.55' : ''}">
        <div style="display:flex;align-items:center;gap:6px"><span style="${F};font-size:8.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:${COR.indigo}">Etapa ${k + 1}</span>${k === 0 ? `<span style="margin-left:auto;${F};font-size:9px;color:${COR.verde};font-weight:700">✓</span>` : k === 2 ? `<span style="margin-left:auto;${F};font-size:8px;color:${COR.cinza}">aguardando professor</span>` : ''}</div>
        <div style="${F};font-size:10.5px;font-weight:600;color:${COR.tinta};margin-top:1px">${e}</div>
        ${k < 2 ? `<div style="height:14px;border-bottom:1px solid #CFC6EE;margin-top:2px"></div>` : ''}</div>`).join('')}
      <div style="margin-top:10px;background:${COR.lavandaClara};border-radius:10px;padding:8px 10px">
        <div style="${F};font-size:8.5px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:${COR.roxo}">No fim</div>
        <div style="${F};font-size:10px;line-height:1.4;color:${COR.tinta};margin-top:2px">Resultado + correção comentada</div></div>
    </div></div>`;
}
function formularios(p, n) {
  const f = p.formularios;
  const bloco = (x, tela, k) => `<div style="display:flex;gap:26px;align-items:center;${k ? `padding-top:22px;border-top:1px solid ${COR.borda};margin-top:22px` : ''}">
      ${k ? '' : tela}
      <div style="flex:1">
        ${kick(`Formulário ${dois(k + 1)}`)}
        <div style="${TIT};font-size:25px;line-height:1.1;color:${COR.tinta};margin-top:5px">${rico(x.nome)}</div>
        <p style="${F};font-size:12.6px;line-height:1.55;color:${COR.cinza};margin:8px 0 4px">${rico(x.texto)}</p>
        ${lista(x.itens).map(t => ponto(t)).join('')}
        ${x.uso ? `<div style="margin-top:10px;display:inline-block;background:${COR.lavandaClara};color:${COR.roxo};${F};font-size:10.5px;font-weight:700;padding:4px 12px;border-radius:999px">${esc(x.uso)}</div>` : ''}
      </div>
      ${k ? tela : ''}</div>`;
  return branca(`${titulo(f.kicker, f.titulo)}
    <div style="margin-top:10px">${lista(f.intro).map(t => par(t, 12.8)).join('')}</div>
    <div style="margin-top:14px">${bloco(f.checkup, telaCheckup(f.checkup), 0)}${bloco(f.aula, telaAula(f.aula), 1)}</div>`, 'Formulários', n, '#FBFAFF');
}

// Comparativo das três propostas.
function comparativo(p, n) {
  const c = p.comparativo;
  const col = '170px repeat(3,1fr)';
  const cab = `<div style="display:grid;grid-template-columns:${col};gap:8px">
      <span></span>${p.propostas.map((q, i) => `<div style="background:${DEGRADE};color:#fff;border-radius:12px;padding:10px 12px"><div style="${F};font-size:8.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${COR.lavanda}">Proposta ${dois(i + 1)}</div><div style="${TIT};font-size:15px;line-height:1.1;margin-top:3px">${esc(q.curto)}</div></div>`).join('')}</div>`;
  const marca = v => v === true ? `<span style="display:inline-flex;width:22px;height:22px;border-radius:7px;background:${COR.verdeClaro};color:${COR.verde};align-items:center;justify-content:center;font-weight:800;font-size:12px">✓</span>`
    : v === false || v === '' ? `<span style="color:#B9B3D6;font-size:16px">–</span>` : rico(v);
  const linhas = lista(c.linhas).map(([rot, ...vs], k) => `<div style="display:grid;grid-template-columns:${col};gap:8px;align-items:center;padding:12px 0;border-bottom:1px solid ${COR.borda};${k % 2 ? '' : `background:linear-gradient(90deg,${COR.lavandaClara},rgba(242,238,255,0))`}">
      <div style="${F};font-size:11.5px;font-weight:700;color:${COR.tinta};padding-left:10px">${rico(rot)}</div>
      ${vs.map(v => `<div style="${F};font-size:11.2px;line-height:1.4;color:${COR.tinta};padding:0 6px">${marca(v)}</div>`).join('')}</div>`).join('');
  const valores = `<div style="display:grid;grid-template-columns:${col};gap:8px;margin-top:12px;align-items:center">
      <div style="${F};font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:${COR.roxo};padding-left:10px">Valor</div>
      ${p.propostas.map(q => `<div style="border:1.5px solid ${COR.roxo};border-radius:12px;padding:8px 12px;${TIT};font-size:15px;color:${COR.roxo};white-space:nowrap">${preco(q.valor)}</div>`).join('')}</div>`;
  return branca(`${titulo(c.kicker, c.titulo)}
    ${c.intro ? `<div style="margin-top:10px">${par(c.intro, 12.8)}</div>` : ''}
    <div style="margin-top:14px">${cab}${linhas}${valores}</div>`, 'Comparativo', n);
}

function fim(p, n) {
  const f = p.fim;
  return `<section class="pagina" style="background:${DEGRADE};color:#fff">
    ${arcos(-140, 560, 240, 9, 'rgba(201,184,255,.24)')}
    <div style="position:absolute;left:${M + 40}px;right:${M}px;top:200px">
      ${kick(f.kicker, COR.lavanda)}
      <div style="${TIT};font-size:58px;line-height:1.02;margin-top:14px">${lista(f.titulo).map(l => rico(l, true)).join('<br>')}</div>
      <span style="display:block;width:70px;height:5px;border-radius:3px;background:${COR.lavanda};margin-top:24px"></span>
      <div style="margin-top:26px;display:flex;flex-direction:column;gap:12px;max-width:560px">
        ${lista(f.passos).map((t, k) => `<div style="display:flex;gap:14px;align-items:flex-start">${quadro(k + 1, 32, true)}<p style="${F};font-size:14px;line-height:1.5;color:#fff;margin:4px 0 0">${rico(t, true)}</p></div>`).join('')}
      </div>
      ${f.texto ? `<p style="${F};font-size:14px;line-height:1.55;color:#ECE8FF;margin:30px 0 0;max-width:520px">${rico(f.texto, true)}</p>` : ''}
    </div>
    <div style="position:absolute;left:${M}px;right:${M}px;bottom:96px;height:1px;background:rgba(255,255,255,.22)"></div>
    <div style="position:absolute;left:${M}px;right:${M}px;bottom:52px;display:flex;justify-content:space-between;align-items:baseline">
      <span style="${F};font-size:22px;font-weight:700">Natália e Líbero</span><span style="${F};font-size:11px;font-weight:500;color:#ECE8FF">${PERFIS} · ${dois(n)}</span></div>
  </section>`;
}

export function renderProposta(p) {
  let n = 1;
  const [rep, m48, ind] = p.propostas;
  const pags = [capa(p), visao(p, ++n)];
  pags.push(abertura(rep, 0, ++n));
  pags.push(encontros(rep, ++n));
  pags.push(abertura(m48, 1, ++n));
  pags.push(relatorio(m48, ++n));
  pags.push(abertura(ind, 2, ++n, ind.decisao ? decisao(ind.decisao) : ''));
  pags.push(formularios(p, ++n));
  pags.push(comparativo(p, ++n));
  pags.push(fim(p, ++n));
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet">
<style>@page{size:210mm 297mm;margin:0}*{box-sizing:border-box}body{margin:0;${F};-webkit-font-smoothing:antialiased;-webkit-print-color-adjust:exact;print-color-adjust:exact}
p{margin:0}.pagina{position:relative;width:${W}px;height:${H}px;overflow:hidden;break-after:page}body>.pagina:last-of-type{break-after:auto}</style></head><body>
${pags.join('\n')}
<script>document.fonts.ready.then(() => {
  window.__avisos = [...document.querySelectorAll('body > .pagina')].flatMap((s, i) => { const c = s.querySelector(':scope > .cabe'); return c && c.scrollHeight > c.clientHeight + 1 ? ['página ' + (i + 1) + ': conteúdo passa do espaço (' + (c.scrollHeight - c.clientHeight) + ' px)'] : []; });
  window.__pronto = true; });</script></body></html>`;
}

if (process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]))) {
  const root = path.dirname(new URL(import.meta.url).pathname);
  const docs = JSON.parse(fs.readFileSync(path.join(root, 'proposta.json'), 'utf8')).filter(d => !process.argv[2] || d.id === process.argv[2]);
  const launch = {};
  if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
  if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
  const browser = await chromium.launch(launch);
  fs.mkdirSync(path.join(root, 'build'), { recursive: true });
  const escala = 1080 / W;
  for (const d of docs) {
    const htmlPath = path.join(root, 'build', `${d.id}.html`);
    fs.writeFileSync(htmlPath, renderProposta(d));
    const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: escala });
    await page.goto('file://' + htmlPath);
    await page.waitForFunction(() => window.__pronto === true, null, { timeout: 30000 });
    const avisos = await page.evaluate(() => window.__avisos || []);
    const outDir = path.join(root, 'saida', d.id);
    fs.rmSync(outDir, { recursive: true, force: true });
    fs.mkdirSync(outDir, { recursive: true });
    const secoes = await page.$$('body > section.pagina');
    for (let i = 0; i < secoes.length; i++) await secoes[i].screenshot({ path: path.join(outDir, `${i + 1}.png`) });
    // PDF a partir dos PNGs (sem faixas cinzas nas bordas).
    const pdfHtml = path.join(root, 'build', `${d.id}-pdf.html`);
    fs.writeFileSync(pdfHtml, `<style>@page{size:210mm 297mm;margin:0}body{margin:0}img{display:block;width:210mm;height:297mm;break-after:page}img:last-child{break-after:auto}</style>${secoes.map((_, i) => `<img src="file://${path.join(outDir, `${i + 1}.png`)}">`).join('')}`);
    const pp = await browser.newPage();
    await pp.goto('file://' + pdfHtml);
    await pp.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth));
    await pp.pdf({ path: path.join(outDir, `${d.id}.pdf`), width: '210mm', height: '297mm', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
    await pp.close();
    await page.close();
    const nP = Math.min(3, secoes.length), w = 1080, h = Math.round(H * escala);
    const painel = await browser.newPage({ viewport: { width: w * nP, height: h } });
    const painelHtml = path.join(root, 'build', `${d.id}-painel.html`);
    fs.writeFileSync(painelHtml, `<body style="margin:0;display:flex">${Array.from({ length: nP }, (_, i) => `<img src="file://${path.join(outDir, `${i + 1}.png`)}" style="width:${w}px">`).join('')}</body>`);
    await painel.goto('file://' + painelHtml);
    await painel.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth));
    await painel.screenshot({ path: path.join(outDir, 'painel.png') });
    await painel.close();
    console.log(avisos.length ? '!' : '✓', d.id, `(${secoes.length} páginas)`);
    avisos.forEach(a => console.log('   ', a));
    if (avisos.length) process.exitCode = 1;
  }
  await browser.close();
}
