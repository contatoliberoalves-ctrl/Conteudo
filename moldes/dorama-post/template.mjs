// Molde "Dorama · Tela única" (@cristaodorameiro): uma peça 1080×1350 na identidade Cristão Dorameiro.
// Layouts: indicacao, nota, meme, curiosidade, reflexao. Cada post escolhe o fundo (noite, creme, rosa).
import { C, SERIF, fundo, rico, esc, lista, bokeh, petalas, logo, arroba, kicker, hangul, estrelas, barra, cartaz, quadro, chip } from '../dorama-comum/identidade.mjs';

const W = 1080, H = 1350, M = 90;
const tit = (p, f, px, extra = '') => p.titulo ? `<div style="${SERIF};font-weight:700;font-size:${p.ts || px}px;line-height:1.04;letter-spacing:-.015em;color:${f.tit};${f.sombra ? `text-shadow:${f.sombra};` : ''}${extra}">${rico(p.titulo, f)}</div>` : '';
const cab = f => `<div style="position:absolute;left:${M}px;right:${M}px;top:80px;display:flex;justify-content:space-between;align-items:center">${logo(50, { cor: f.tit, dest: f.dest })}${arroba(f, 22)}</div>`;
const pe = (p, f) => p.rodape ? `<div style="position:absolute;left:${M}px;right:${M}px;bottom:70px;text-align:center;font-weight:700;font-size:28px;color:${f.tit}">${rico(p.rodape, f)}</div>` : '';
const caixa = (html, top, bottom, extra = '') => `<div data-cabe style="position:absolute;left:${M}px;right:${M}px;top:${top}px;bottom:${bottom}px;display:flex;flex-direction:column;gap:28px;overflow:hidden;padding-bottom:12px;${extra}">${html}</div>`;
const fichaLinha = (d, f) => [d.onde && '📺 ' + d.onde, d.eps && d.eps + ' episódios', d.genero, d.ano].filter(Boolean).map(t => chip(String(t), f, 24)).join('');

const LAYOUTS = {
  // Indicação: manchete, cartaz, motivos e a ficha em etiquetas.
  indicacao: (p, f) => { const d = p.dorama || {}; return `${f.escuro ? bokeh(W, H, 4) : ''}${petalas([[930, 300, 40, 20], [990, 400, 24, -20, .6]])}${cab(f)}
    ${caixa(`${kicker(p.kicker || 'Indicação', f)}${tit(p, f, 80)}`, 190, 900, 'justify-content:flex-end')}
    <div style="position:absolute;left:${M}px;top:490px;transform:rotate(-3deg)">${cartaz(d, 400, 560)}</div>
    ${caixa(`<div>${hangul(d.hangul, 30, f.dest)}<div style="margin-top:10px;${SERIF};font-weight:700;font-size:44px;line-height:1.05;color:${f.tit}">${esc(d.titulo)}</div>${p.estrelas ? `<div style="margin-top:14px">${estrelas(p.estrelas, 40)}</div>` : ''}</div>
      <div style="display:flex;flex-direction:column;gap:20px">${lista(p.motivos).map(t => `<div style="display:flex;gap:16px;align-items:flex-start;font-size:${p.corpo || 30}px;font-weight:500;line-height:1.38;color:${f.txt}"><span style="flex:none;width:34px;height:34px;margin-top:4px;border-radius:50%;background:${f.escuro ? C.rosaForte : C.noite};color:#fff;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:800">✓</span><span>${rico(t, f)}</span></div>`).join('')}</div>`, 500, 250, 'left:550px;justify-content:center')}
    <div style="position:absolute;left:${M}px;right:${M}px;bottom:${p.rodape ? 140 : 96}px;display:flex;flex-wrap:wrap;gap:12px;justify-content:center">${fichaLinha(d, f)}</div>${pe(p, f)}`; },
  // Nota: cartaz e nota gigante, barras por critério e alertas.
  nota: (p, f) => { const d = p.dorama || {}; return `${f.escuro ? bokeh(W, H, 6) : ''}${cab(f)}
    ${caixa(`${kicker(p.kicker || 'Dei nota', f)}${tit(p, f, 68)}`, 170, 970, 'justify-content:flex-end')}
    <div style="position:absolute;left:${M}px;top:410px;transform:rotate(-2.5deg)">${cartaz(d, 280, 380, { raio: 22 })}</div>
    <div style="position:absolute;left:440px;right:${M}px;top:430px;text-align:center;color:${f.tit}">
      <div style="${SERIF};font-weight:900;font-size:220px;line-height:.9;letter-spacing:-.04em">${String(p.nota ?? '').replace('.', ',')}</div>
      <div style="margin-top:14px;font-weight:700;font-size:24px;letter-spacing:.16em;opacity:.6">DE 10</div>
      <div style="margin-top:20px">${estrelas((p.nota ?? 0) / 2, 52)}</div></div>
    ${caixa(`<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px 44px">${lista(p.criterios).map(([r, v]) => barra(r, v, f, 26)).join('')}</div>
      ${p.alertas ? `<div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center"><span style="font-weight:800;font-size:20px;letter-spacing:.18em;color:${f.kick};margin-right:6px">ANTES DO PLAY</span>${lista(p.alertas).map(a => chip(a, f, 20)).join('')}</div>` : ''}`, 815, p.rodape ? 130 : 80, 'justify-content:center;gap:26px')}${pe(p, f)}`; },
  // Meme: texto de cima e cena com legenda de dorama.
  meme: (p, f) => `${cab(f)}${caixa(`${kicker(p.kicker, f)}${tit(p, f, 66)}`, 170, 1350 - 470, 'justify-content:flex-end')}
    <div style="position:absolute;left:${M}px;right:${M}px;top:500px">${quadro(p, W - 2 * M, p.rodape ? 640 : 700)}</div>${pe(p, f)}`,
  // Curiosidade: "Você sabia?" com hangul gigante ao fundo.
  curiosidade: (p, f) => `${f.escuro ? bokeh(W, H, 8) : ''}<div style="position:absolute;right:-30px;top:170px;writing-mode:vertical-rl;opacity:.08">${hangul(p.hangul, 240, f.tit)}</div>${petalas([[940, 1080, 40, 30], [880, 1160, 24, -10, .6]])}${cab(f)}
    ${caixa(`<div style="display:flex;align-items:center;gap:24px">${p.emoji ? `<span style="font-size:110px;line-height:1">${p.emoji}</span>` : ''}<span style="${SERIF};font-style:italic;font-weight:700;font-size:96px;line-height:1;color:${f.dest}">Você sabia?</span></div>
      ${tit(p, f, 76)}${lista(p.texto).map(t => `<p style="font-size:${p.corpo || 36}px;font-weight:500;line-height:1.45;color:${f.txt}">${rico(t, f)}</p>`).join('')}
      ${p.fonte ? `<div style="font-size:22px;font-weight:600;color:${f.txt};opacity:.7">Fonte: ${esc(p.fonte)}</div>` : ''}`, 200, p.rodape ? 150 : 100, 'justify-content:center')}${pe(p, f)}`,
  // Reflexão: versículo grande no centro e a ponte com o dorama.
  reflexao: (p, f) => `${f.escuro ? bokeh(W, H, 12, 12) : ''}${petalas([[120, 230, 44, -20, .8], [60, 320, 26, 30, .5], [930, 1060, 48, 40], [990, 980, 28, 0, .5]])}${cab(f)}
    ${caixa(`${kicker(p.kicker || 'Reflexão', f)}<div style="${SERIF};font-style:italic;font-weight:500;font-size:${p.ts || 80}px;line-height:1.18;color:${f.tit}">“${rico(p.versiculo, f)}”</div>
      <div style="font-weight:800;font-size:28px;letter-spacing:.16em;color:${f.dest}">${esc(p.ref).toUpperCase()}</div>
      ${p.texto ? `<div style="display:flex;gap:26px;align-items:center;padding:26px 30px;border-radius:26px;background:${f.card};border:2px solid ${f.cardBorda}">${p.dorama ? cartaz(p.dorama, 150, 205, { raio: 16, sombra: false }) : ''}<div style="font-size:${p.corpo || 32}px;font-weight:500;line-height:1.45;color:${f.txt}">${rico(p.texto, f)}</div></div>` : ''}`, 210, p.rodape ? 150 : 100, 'justify-content:center;align-items:flex-start')}${pe(p, f)}`,
};
const PADRAO = { indicacao: 'turquesa', nota: 'creme', meme: 'laranja', curiosidade: 'turquesa', reflexao: 'noite' };

export const slides = p => { const f = fundo(p.fundo || PADRAO[p.layout] || 'creme'); return { w: W, h: H, slides: [`<div style="position:absolute;inset:0;background:${f.bg}"></div>${(LAYOUTS[p.layout] || LAYOUTS.indicacao)(p, f)}`] }; };
