// Identidade "Cartório em Pauta": a linha de posts do Cartório de Curral Queimado para o Instagram.
// Moderna e editorial: papel, tinta (carvão do logo) e o azul de carimbo; Archivo (grotesca larga e
// condensada), Instrument Serif em itálico para o destaque e JetBrains Mono nas etiquetas de protocolo.
// Assuntos: notícia, caso de famoso, fato da região e meme com fundo didático (sempre com a base legal).
import fs from 'node:fs';
import path from 'node:path';
import { esc, lista, CONTATO, EMB, EMB_PROP, PRATA } from './marca.mjs';

export const P = { tinta: '#14130F', papel: '#F3F2EE', azul: '#2B44FF', azulClaro: '#8C9BFF', cinza: '#77756E', linha: '#D9D7D0', branco: '#FFFFFF' };

export const HEAD_PAUTA = `<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet"><style>
body{font-family:Archivo,sans-serif}
.tit{font-family:Archivo,sans-serif;font-weight:850;font-stretch:72%;text-transform:uppercase;line-height:.92;letter-spacing:-.005em}
.ser{font-family:'Instrument Serif',serif;font-style:italic;font-weight:400;text-transform:none;letter-spacing:0;font-stretch:100%}
.mono{font-family:'JetBrains Mono',monospace;letter-spacing:.04em;text-transform:uppercase}
.txt{font-family:Archivo,sans-serif;font-weight:420;font-stretch:96%;line-height:1.36}
.txt b{font-weight:700}
.meme{display:inline;background:#fff;color:#000;font-family:Archivo,sans-serif;font-weight:700;font-stretch:100%;box-decoration-break:clone;-webkit-box-decoration-break:clone;padding:.06em .3em;border-radius:.22em;line-height:1.42}
.carimbo{display:inline-flex;flex-direction:column;align-items:center;border:6px solid currentColor;border-radius:10px;padding:10px 22px 12px;font-family:Archivo,sans-serif;font-weight:900;font-stretch:80%;text-transform:uppercase;line-height:1;mix-blend-mode:multiply}
</style>`;

// Fundos: cada um diz a cor do texto, do destaque e das linhas.
export const FUNDOS = {
  papel: { bg: P.papel, tit: P.tinta, txt: '#2A2924', sub: P.cinza, ac: P.azul, linha: P.linha, card: '#fff' },
  tinta: { bg: P.tinta, tit: '#fff', txt: '#E6E4DE', sub: '#9C9A92', ac: P.azulClaro, linha: 'rgba(255,255,255,.16)', card: '#22211C' },
  azul: { bg: P.azul, tit: '#fff', txt: '#EEF0FF', sub: '#C9CFFF', ac: P.tinta, linha: 'rgba(255,255,255,.3)', card: 'rgba(255,255,255,.12)' },
};

// **negrito** e [[destaque]] (serifa itálica na cor de destaque).
export const rico = (s, f) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
  .replace(/\*(.+?)\*/g, '<i>$1</i>')
  .replace(/\[\[(.+?)\]\]/g, `<span class="ser" style="color:${f.ac}">$1</span>`);
const linhas = (v, f, st = '') => lista(v).map(t => `<p style="${st}">${rico(t, f)}</p>`).join('');

export function foto(root, arq) {
  const p = path.join(root, arq);
  if (!fs.existsSync(p)) return null;
  const ext = path.extname(p).slice(1).toLowerCase().replace('jpg', 'jpeg');
  return `data:image/${ext};base64,` + fs.readFileSync(p).toString('base64');
}

// Marca em texto: quadradinho prateado (ou o emblema) + nome curto.
const marca = (f, s = 22) => `<div style="display:flex;align-items:center;gap:${s * .55}px">
  ${EMB ? `<img src="${EMB}" style="height:${s * 1.7}px;width:${Math.round(s * 1.7 * EMB_PROP)}px">` : `<span style="width:${s * .8}px;height:${s * .8}px;background:${PRATA};display:block"></span>`}
  <span class="mono" style="font-size:${s}px;color:${f.tit};font-weight:600;letter-spacing:.08em">Cartório · Curral Queimado</span></div>`;

// Moldura de todos os slides: marca e contador em cima; cidade e "arraste" embaixo.
function moldura(f, i, n, miolo, { semTopo = false, semBase = false } = {}) {
  const num = String(i).padStart(2, '0') + ' / ' + String(n).padStart(2, '0');
  return `<div style="position:absolute;inset:0;background:${f.bg};color:${f.txt}">
  ${miolo}
  ${semTopo ? '' : `<div style="position:absolute;left:72px;right:72px;top:56px;display:flex;justify-content:space-between;align-items:center">${marca(f)}<span class="mono" style="font-size:22px;color:${f.sub}">${n > 1 ? num : 'Registro Civil'}</span></div>`}
  ${semBase ? '' : `<div style="position:absolute;left:72px;right:72px;bottom:52px;display:flex;justify-content:space-between;align-items:center;border-top:2px solid ${f.linha};padding-top:20px">
    <span class="mono" style="font-size:20px;color:${f.sub}">Petrolina · PE</span>
    <span class="mono" style="font-size:20px;color:${f.sub}">${i < n ? 'Arraste →' : 'Registro Civil das Pessoas Naturais'}</span></div>`}
</div>`;
}

const kick = (t, f, st = '') => t ? `<div class="mono" style="font-size:24px;color:${f.ac};font-weight:600;margin-bottom:26px;${st}">${esc(t)}</div>` : '';
const fonte = (t, f) => t ? `<div class="mono" style="font-size:18px;color:${f.sub};line-height:1.45;margin-top:auto;padding-top:26px;text-transform:none;letter-spacing:.01em">Fonte: ${esc(t)}</div>` : '';
const carimbo = (c, cor, st = '') => c ? `<div class="carimbo" style="color:${cor};${st}"><span style="font-size:${c.ts || 64}px">${esc(c.texto)}</span>${c.sub ? `<span class="mono" style="font-size:19px;font-weight:600;margin-top:8px;letter-spacing:.06em">${esc(c.sub)}</span>` : ''}</div>` : '';
const area = (f, conteudo, { top = 150, bottom = 140 } = {}) => `<div data-cabe style="position:absolute;left:72px;right:72px;top:${top}px;bottom:${bottom}px;display:flex;flex-direction:column;overflow:hidden">${conteudo}</div>`;

const PECAS = {
  // Meme: foto em cima com a legenda branca do Insta, carimbo na foto e o gancho didático embaixo.
  meme(s, f, ctx) {
    const img = foto(ctx.root, s.foto);
    const h = s.alturaFoto || 820;
    return moldura(f, ctx.i, ctx.n, `
      <div style="position:absolute;left:0;right:0;top:0;height:${h}px;background:#333 ${img ? `url(${img})` : ''} center ${s.focoY || '50%'}/cover"></div>
      <div style="position:absolute;left:0;right:0;top:0;height:200px;background:linear-gradient(rgba(0,0,0,.55),transparent)"></div>
      <div style="position:absolute;left:70px;right:70px;top:${h - (s.legendaY || 250)}px;text-align:center;font-size:${s.tl || 50}px">${esc(s.legenda).split('\n').map(l => `<span class="meme">${l}</span>`).join('<br>')}</div>
      ${carimbo(s.carimbo, s.corCarimbo || '#E8322B', `position:absolute;right:66px;top:${s.carimboY || 170}px;transform:rotate(-8deg);background:rgba(255,255,255,.9);mix-blend-mode:normal`)}
      <div data-cabe style="position:absolute;left:72px;right:72px;top:${h + 46}px;bottom:130px;display:flex;flex-direction:column;justify-content:center">
        ${kick(s.kicker, f, 'margin-bottom:18px')}
        <div class="tit" style="font-size:${s.ts || 92}px;color:${f.tit}">${rico(s.titulo, f)}</div>
      </div>`, { semTopo: false });
  },

  // Fofoca: foto do famoso em tela cheia, etiqueta de plantão, título embaixo e a ficha de registro
  // como figurinha inclinada. "credito" (autor e licença da foto) sai pequeno na lateral.
  fofoca(s, f, ctx) {
    const img = foto(ctx.root, s.foto);
    const c = s.campo;
    const ficha = c ? `<div style="position:absolute;${s.fichaPos || 'right:56px;top:170px'};transform:rotate(${s.fichaGiro ?? 5}deg);background:#fff;color:${P.tinta};padding:20px 26px 24px;width:${s.fichaL || 430}px;box-shadow:0 18px 40px rgba(0,0,0,.35)">
        <div class="mono" style="font-size:16px;color:${P.cinza}">${esc(c.livro || 'Livro A · Nascimento')}</div>
        <div style="border-top:2px dashed ${P.linha};margin:10px 0"></div>
        <div class="mono" style="font-size:17px;color:${P.cinza}">${esc(c.rotulo || 'Prenome')}</div>
        <div class="tit" style="font-size:${c.tv || 70}px;margin-top:4px;${c.riscado ? 'text-decoration:line-through;text-decoration-color:#E8322B;text-decoration-thickness:.09em' : ''}">${esc(c.valor)}</div>
        ${carimbo(c.carimbo, c.corCarimbo || P.azul, 'position:absolute;right:-30px;bottom:-34px;transform:rotate(-12deg);background:rgba(255,255,255,.92);mix-blend-mode:normal;border-width:5px;padding:8px 16px 10px')}</div>` : '';
    return moldura(f, ctx.i, ctx.n, `
      <div style="position:absolute;inset:0;background:#333 ${img ? `url(${img})` : ''} ${s.focoX || '50%'} ${s.focoY || '30%'}/${s.zoom ? s.zoom * 100 + '%' : 'cover'} no-repeat"></div>
      <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.62) 0%,rgba(0,0,0,0) 20%,rgba(0,0,0,0) 42%,rgba(10,10,8,.82) 66%,#0D0C0A 100%)"></div>
      ${ficha}
      ${s.credito ? `<div class="mono" style="position:absolute;left:30px;top:50%;transform:translateY(-50%) rotate(-90deg);transform-origin:left top;font-size:14px;color:rgba(255,255,255,.7);text-transform:none;white-space:nowrap">Foto: ${esc(s.credito)}</div>` : ''}
      <div data-cabe style="position:absolute;left:72px;right:72px;bottom:104px;top:${s.topoTexto || 600}px;padding-bottom:26px;display:flex;flex-direction:column;justify-content:flex-end">
        <div style="align-self:flex-start;background:${P.azul};color:#fff;padding:10px 18px;margin-bottom:24px" class="mono"><span style="font-size:24px;font-weight:600">${esc(s.kicker || 'Plantão do cartório')}</span></div>
        <div class="tit" style="font-size:${s.ts || 112}px;color:#fff">${rico(s.titulo, f)}</div>
        ${s.texto ? `<div class="txt" style="font-size:${s.corpo || 34}px;color:#E6E4DE;margin-top:22px">${linhas(s.texto, f, 'margin-top:12px')}</div>` : ''}
        ${s.fonte ? `<div class="mono" style="font-size:17px;color:#A9A7A0;margin-top:22px;text-transform:none;letter-spacing:.01em">Fonte: ${esc(s.fonte)}</div>` : ''}
      </div>`);
  },

  // Manchete: título grande, ficha de registro com carimbo (ex.: PRENOME: CAEVI · DEFERIDO).
  manchete(s, f) {
    const c = s.campo;
    return area(f, `
      ${kick(s.kicker, f)}
      <div class="tit" style="font-size:${s.ts || 128}px;color:${f.tit}">${rico(s.titulo, f)}</div>
      ${s.texto ? `<div class="txt" style="font-size:${s.corpo || 34}px;margin-top:30px;max-width:860px">${linhas(s.texto, f)}</div>` : ''}
      ${c ? `<div style="margin-top:auto;position:relative;background:#fff;border:2px solid ${f.tit};padding:30px 36px 34px;color:${P.tinta}">
        <div class="mono" style="font-size:20px;color:${P.cinza};display:flex;justify-content:space-between"><span>${esc(c.livro || 'Livro A · Registro de nascimento')}</span><span>${esc(c.folha || 'Fls. ___')}</span></div>
        <div style="border-top:2px dashed ${P.linha};margin:18px 0 16px"></div>
        <div class="mono" style="font-size:22px;color:${P.cinza}">${esc(c.rotulo || 'Prenome')}</div>
        <div class="tit" style="font-size:${c.tv || 110}px;color:${P.tinta};margin-top:6px;${c.riscado ? `text-decoration:line-through;text-decoration-color:#E8322B;text-decoration-thickness:.09em` : ''}">${esc(c.valor)}</div>
        ${carimbo(c.carimbo, c.corCarimbo || P.azul, 'position:absolute;right:34px;bottom:30px;transform:rotate(-9deg)')}
      </div>` : ''}`);
  },

  // Número gigante (dado com fonte).
  numero(s, f) {
    return area(f, `
      ${kick(s.kicker, f)}
      <div class="tit" style="font-size:${s.tv || 400}px;color:${f.tit};letter-spacing:-.02em;line-height:.85">${esc(s.valor)}</div>
      <div class="mono" style="font-size:24px;color:${f.sub};margin-top:22px">${esc(s.rotulo || '')}</div>
      <div class="tit" style="font-size:${s.ts || 104}px;color:${f.tit};margin-top:auto">${rico(s.titulo, f)}</div>
      ${s.texto ? `<div class="txt" style="font-size:${s.corpo || 32}px;margin-top:24px">${linhas(s.texto, f, 'margin-top:10px')}</div>` : ''}
      ${fonte(s.fonte, f)}`);
  },

  // Texto: título + parágrafos + caixa de destaque opcional.
  texto(s, f, ctx) {
    const img = s.foto && foto(ctx.root, s.foto);
    return area(f, `
      ${img ? `<div style="height:${s.alturaFoto || 400}px;flex:none;margin-bottom:34px;background:#333 url(${img}) ${s.focoX || '50%'} ${s.focoY || '30%'}/cover no-repeat;position:relative">${s.credito ? `<span class="mono" style="position:absolute;right:12px;bottom:10px;font-size:13px;color:#fff;text-transform:none;text-shadow:0 1px 3px #000">Foto: ${esc(s.credito)}</span>` : ''}</div>` : ''}
      ${kick(s.kicker, f)}
      <div class="tit" style="font-size:${s.ts || 104}px;color:${f.tit}">${rico(s.titulo, f)}</div>
      <div class="txt" style="font-size:${s.corpo || 40}px;margin-top:44px">${linhas(s.texto, f, 'margin-bottom:20px')}</div>
      ${s.destaque ? `<div class="txt" style="font-size:${s.corpo ? s.corpo - 2 : 38}px;border-left:8px solid ${f.ac};background:${f.card};padding:30px 36px;margin-top:12px;color:${f.tit}">${rico(s.destaque, f)}</div>` : ''}
      ${fonte(s.fonte, f)}`);
  },

  // Lista como ficha de protocolo: 01, 02… com título e detalhe.
  lista(s, f) {
    const itens = lista(s.itens).map((it, k) => {
      const o = typeof it === 'string' ? { t: it } : it;
      return `<div style="display:flex;gap:28px;padding:${s.gap ?? 30}px 0;border-top:2px solid ${f.linha}">
        <span class="mono" style="font-size:26px;color:${f.ac};font-weight:600;padding-top:6px;flex:none">${String(k + 1).padStart(2, '0')}</span>
        <div><div class="txt" style="font-size:${s.corpo || 42}px;color:${f.tit};font-weight:650;line-height:1.24">${rico(o.t, f)}</div>
        ${o.d ? `<div class="txt" style="font-size:${(s.corpo || 42) - 9}px;color:${f.sub};margin-top:6px;line-height:1.3">${rico(o.d, f)}</div>` : ''}</div></div>`;
    }).join('');
    return area(f, `
      ${kick(s.kicker, f)}
      <div class="tit" style="font-size:${s.ts || 104}px;color:${f.tit};margin-bottom:34px">${rico(s.titulo, f)}</div>
      <div>${itens}</div>
      ${fonte(s.fonte, f)}`);
  },

  // Ranking em barras (nome, número). "destaque": índices em azul.
  ranking(s, f) {
    const its = lista(s.itens); const max = Math.max(...its.map(i => i.n));
    const dest = lista(s.destaque);
    const rows = its.map((it, k) => `<div style="display:grid;grid-template-columns:50px 330px 1fr;align-items:center;gap:18px;height:${s.alt || 62}px">
      <span class="mono" style="font-size:24px;color:${f.sub}">${String(k + 1).padStart(2, '0')}</span>
      <span class="txt" style="font-size:${s.fn || 36}px;font-weight:650;color:${f.tit};white-space:nowrap">${esc(it.nome)}</span>
      <div style="display:flex;align-items:center;gap:14px"><div style="height:${s.barra || 36}px;width:${Math.round(it.n / max * 78)}%;background:${dest.includes(k) ? f.ac : f.tit};opacity:${dest.includes(k) ? 1 : .85}"></div><span class="mono" style="font-size:24px;color:${f.sub}">${it.n.toLocaleString('pt-BR')}</span></div></div>`).join('');
    return area(f, `
      ${kick(s.kicker, f)}
      <div class="tit" style="font-size:${s.ts || 100}px;color:${f.tit};margin-bottom:36px">${rico(s.titulo, f)}</div>
      ${rows}
      ${fonte(s.fonte, f)}`);
  },

  // Pode ou não pode: perguntas com carimbo de resposta.
  pode(s, f) {
    const cor = { pode: '#1E9E5A', 'não pode': '#E8322B', depende: '#E0A100' };
    const cards = lista(s.itens).map(it => `<div style="position:relative;background:${f.card};padding:30px 34px 32px;padding-right:280px;border:2px solid ${f.linha}">
      <div class="txt" style="font-size:${s.corpo || 36}px;font-weight:700;color:${f.tit};line-height:1.2">${rico(it.q, f)}</div>
      <div class="txt" style="font-size:${(s.corpo || 36) - 7}px;color:${f.sub};margin-top:8px;line-height:1.3">${rico(it.d, f)}</div>
      ${carimbo({ texto: it.r, ts: 46 }, cor[it.r.toLowerCase()] || f.ac, 'position:absolute;right:26px;top:50%;transform:translateY(-50%) rotate(-7deg);border-width:5px;padding:8px 16px 10px')}</div>`).join('');
    return area(f, `
      ${kick(s.kicker, f)}
      <div class="tit" style="font-size:${s.ts || 100}px;color:${f.tit};margin-bottom:38px">${rico(s.titulo, f)}</div>
      <div style="display:flex;flex-direction:column;gap:${s.gap ?? 22}px">${cards}</div>
      ${fonte(s.fonte, f)}`);
  },

  // Fechamento: chamada e contatos do cartório.
  fim(s, f) {
    const linha = (r, v) => `<div style="display:flex;gap:26px;padding:20px 0;border-top:2px solid ${f.linha}"><span class="mono" style="font-size:21px;color:${f.sub};width:200px;flex:none;padding-top:8px">${r}</span><span class="txt" style="font-size:34px;color:${f.tit};font-weight:550;line-height:1.3">${v}</span></div>`;
    return area(f, `
      ${kick(s.kicker, f)}
      <div class="tit" style="font-size:${s.ts || 124}px;color:${f.tit}">${rico(s.titulo || 'Ficou com [[dúvida]]? Chama a gente.', f)}</div>
      ${s.texto ? `<div class="txt" style="font-size:${s.corpo || 40}px;margin-top:36px">${linhas(s.texto, f, 'margin-bottom:12px')}</div>` : ''}
      <div style="margin-top:auto">
        ${linha('WhatsApp', esc(CONTATO.telefone))}
        ${linha('Endereço', CONTATO.endereco.map(esc).join('<br>'))}
        ${linha('Agende', esc(CONTATO.site))}
      </div>`);
  },
};

// Um slide: { tipo, fundo, ... }. ctx = { root, i, n }.
export function slide(s, ctx) {
  const f = FUNDOS[s.fundo || (s.tipo === 'meme' || s.tipo === 'fofoca' ? 'tinta' : 'papel')];
  const p = PECAS[s.tipo];
  if (!p) throw new Error('tipo desconhecido: ' + s.tipo);
  const html = p(s, f, ctx);
  return s.tipo === 'meme' || s.tipo === 'fofoca' ? html : moldura(f, ctx.i, ctx.n, html);
}

export function slides(c, root) {
  const ss = lista(c.slides);
  return { w: 1080, h: 1350, slides: ss.map((s, k) => slide(s, { root, i: k + 1, n: ss.length })) };
}
