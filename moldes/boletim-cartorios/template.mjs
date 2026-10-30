// Molde "Boletim Cartórios PE": uma peça 1080×1350 que resume um ofício/orientação para os cartórios.
// Três estilos ("layout"), cada um puxado de uma identidade do autor:
//   oficio   · papel e prata, Cormorant Garamond + Jost (identidade do Cartório)
//   manchete · azul e navy, Big Shoulders + Schibsted, anel vermelho e granulado (Carrossel Libero)
//   ficha    · grafite e areia, Big Shoulders + Manrope, pode x não pode (PratFlix)
import { C as CA, PRATA, DISPLAY, CAPS } from '../cartorio-comum/marca.mjs';
import { COR as LB, textura, anel } from '../libero-comum/identidade.mjs';

export const FONTES_EXTRA = '<link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;900&family=Schibsted+Grotesk:wght@500;600;700;800&family=Manrope:wght@500;600;700;800&display=swap" rel="stylesheet">';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const lista = v => (v == null ? [] : Array.isArray(v) ? v : [v]);
// **negrito** e [[destaque]] (o destaque muda conforme o estilo).
const rico = (s, dest) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\[\[(.+?)\]\]/g, dest);
const NOME = 'Boletim Cartórios PE';
const BS = "font-family:'Big Shoulders Display',sans-serif;font-weight:900;text-transform:uppercase";

// ---------- oficio: folha de papel com cabeçalho de ofício, resumo, citação da lei e rodapé ----------
function oficio(c) {
  const d = s => rico(s, '<span style="font-style:italic;background:linear-gradient(transparent 68%,#CFCFCF 68%,#EDEDED 92%,transparent 92%);padding:0 .05em">$1</span>');
  return `<div style="position:absolute;inset:0;background:${CA.carvao}"></div>
  <div style="position:absolute;left:60px;right:60px;top:56px;display:flex;justify-content:space-between;align-items:center">
    <div style="display:flex;align-items:center;gap:16px"><span style="width:46px;height:46px;border-radius:4px;background:${PRATA}"></span>
      <span style="${DISPLAY};font-size:40px;color:#fff;line-height:1">${NOME}</span></div>
    <span style="${CAPS};font-size:17px;color:#A9A7A0">${esc(c.data)}</span></div>
  <div style="position:absolute;left:60px;right:60px;top:140px;bottom:60px;background:${CA.papel};border-radius:6px;padding:56px 60px 46px;display:flex;flex-direction:column">
    <div style="${CAPS};font-size:19px;color:${CA.cinza}">${esc(c.origem)}</div>
    <div style="height:3px;width:120px;background:${PRATA};margin:20px 0 26px"></div>
    <div data-cabe style="${DISPLAY};font-size:${c.ts || 70}px;line-height:1.02;color:${CA.grafite};max-height:310px;overflow:hidden;padding-bottom:10px">${d(c.chamada)}</div>
    <div data-cabe style="font:400 31px/1.45 Jost;color:${CA.grafite};margin-top:30px;max-height:470px;overflow:hidden">${lista(c.resumo).map(p => `<p style="margin-bottom:14px">${d(p)}</p>`).join('')}</div>
    <div style="flex:1"></div>
    <div style="border-left:4px solid #B9B9B9;background:#E9E8E3;padding:20px 26px;border-radius:0 6px 6px 0">
      <div style="${CAPS};font-size:16px;color:${CA.cinza}">${esc(c.base.ref)}</div>
      <div data-cabe style="${DISPLAY};font-style:italic;font-weight:500;font-size:31px;line-height:1.25;color:${CA.grafite};margin-top:8px;max-height:160px;overflow:hidden">“${esc(c.base.texto)}”</div></div>
    <div style="display:flex;justify-content:space-between;margin-top:22px;${CAPS};font-size:15px;color:${CA.cinza}"><span>${esc(c.assinatura)}</span><span>Leia o ofício completo</span></div></div>`;
}

// ---------- manchete: azul com anel vermelho, manchete gigante, resumo e os dois selos ----------
function manchete(c) {
  const d = s => rico(s, `<span style="background:${LB.navyFundo};color:#fff;padding:0 .12em;box-decoration-break:clone;-webkit-box-decoration-break:clone">$1</span>`);
  const T = "font-family:'Schibsted Grotesk',sans-serif";
  return `<div style="position:absolute;inset:0;background:linear-gradient(170deg,${LB.azul} 0%,${LB.azulFundo} 100%)"></div>${anel(760, -170, 480, 60)}
  <div style="position:absolute;left:72px;right:72px;top:70px;display:flex;align-items:center;gap:14px;z-index:2">
    <span style="background:#fff;color:${LB.azul};${BS};font-size:30px;line-height:1;padding:9px 16px 7px">Boletim</span>
    <span style="${T};font-weight:800;font-size:26px;color:#fff;letter-spacing:.06em">CARTÓRIOS PE</span></div>
  <div style="position:absolute;left:72px;right:72px;top:190px;bottom:70px;display:flex;flex-direction:column;z-index:2">
    <div style="${T};font-weight:700;font-size:24px;letter-spacing:.14em;color:${LB.off};text-transform:uppercase">${esc(c.origem)} · ${esc(c.data)}</div>
    <div data-cabe style="${BS};font-size:${c.ts || 118}px;line-height:.94;color:#fff;margin-top:20px;max-height:470px;padding:6px 0 16px;overflow:hidden">${d(c.chamada)}</div>
    <div data-cabe style="${T};font-weight:500;font-size:29px;line-height:1.42;color:#fff;margin-top:30px;max-height:400px;overflow:hidden">${lista(c.resumo).map(p => `<p style="margin-bottom:16px">${d(p)}</p>`).join('')}</div>
    <div style="flex:1"></div>
    <div style="display:flex;flex-direction:column;gap:14px">
      ${lista(c.pode).slice(0, 1).map(x => `<div style="display:flex;gap:18px;align-items:center;background:#fff;border-radius:16px;padding:20px 24px"><span style="flex:none;width:52px;height:52px;border-radius:50%;background:${LB.azul};color:#fff;display:grid;place-items:center;font:800 30px sans-serif">✓</span><span style="${T};font-weight:600;font-size:27px;line-height:1.3;color:${LB.navy}">${d(x)}</span></div>`).join('')}
      ${lista(c.naoPode).slice(0, 1).map(x => `<div style="display:flex;gap:18px;align-items:center;background:${LB.navyFundo};border-radius:16px;padding:20px 24px"><span style="flex:none;width:52px;height:52px;border-radius:50%;background:${LB.vermelho};color:#fff;display:grid;place-items:center;font:800 30px sans-serif">✕</span><span style="${T};font-weight:600;font-size:27px;line-height:1.3;color:#fff">${d(x)}</span></div>`).join('')}</div>
    <div style="${T};font-weight:600;font-size:20px;color:${LB.off};margin-top:22px;opacity:.85">${esc(c.base.ref)}</div></div>${textura(true)}`;
}

// ---------- ficha: grafite, faixa areia com o assunto, duas colunas pode x não pode ----------
function ficha(c) {
  const A = { bg: '#121212', areia: '#E3D6B4', ouro: '#9A7B3A', txt: '#EDEAE3', mute: '#8E8A82', card: '#1C1C1B', linha: '#2E2D2B', verm: '#E0533D' };
  const d = s => rico(s, `<span style="color:${A.areia}">$1</span>`);
  const M = 'font-family:Manrope,sans-serif';
  const col = (tit, itens, cor, ic) => `<div style="flex:1;background:${A.card};border:1.5px solid ${A.linha};border-radius:18px;padding:26px 26px 22px">
    <div style="display:flex;align-items:center;gap:12px"><span style="width:40px;height:40px;border-radius:50%;background:${cor};color:${A.bg};display:grid;place-items:center;font:800 24px sans-serif">${ic}</span><span style="${BS};font-size:38px;color:${A.txt}">${tit}</span></div>
    ${itens.map(x => `<div style="${M};font-weight:600;font-size:27px;line-height:1.38;color:${A.txt};margin-top:16px;padding-top:16px;border-top:1px solid ${A.linha}">${d(x)}</div>`).join('')}</div>`;
  return `<div style="position:absolute;inset:0;background:${A.bg}"></div>
  <div style="position:absolute;left:64px;right:64px;top:62px;display:flex;justify-content:space-between;align-items:flex-end">
    <div><div style="${BS};font-size:58px;line-height:.9;color:${A.txt}">Boletim<br><span style="color:${A.areia}">Cartórios PE</span></div></div>
    <div style="text-align:right;${M};font-weight:700;font-size:19px;letter-spacing:.16em;color:${A.mute};text-transform:uppercase">${esc(c.origem)}<br>${esc(c.data)}</div></div>
  <div style="position:absolute;left:64px;right:64px;top:228px;bottom:60px;display:flex;flex-direction:column">
    <div style="background:${A.areia};border-radius:16px;padding:28px 32px">
      <div style="${M};font-weight:800;font-size:18px;letter-spacing:.2em;color:${A.ouro};text-transform:uppercase">${esc(c.kicker || 'Na prática')}</div>
      <div data-cabe style="${BS};font-size:${c.ts || 74}px;line-height:.92;color:#111;margin-top:10px;max-height:300px;overflow:hidden;padding-bottom:10px">${rico(c.chamada, '$1')}</div></div>
    <div data-cabe style="${M};font-weight:500;font-size:28px;line-height:1.45;color:${A.txt};margin-top:30px;max-height:380px;overflow:hidden">${lista(c.resumo).map(p => `<p style="margin-bottom:14px">${d(p)}</p>`).join('')}</div>
    <div style="display:flex;gap:18px;margin-top:30px">${col('Pode', lista(c.pode), A.areia, '✓')}${col('Não pode', lista(c.naoPode), A.verm, '✕')}</div>
    <div style="flex:1"></div>
    <div style="display:flex;justify-content:space-between;gap:20px;border-top:1px solid ${A.linha};padding-top:18px;${M};font-weight:600;font-size:19px;color:${A.mute}"><span>${esc(c.base.ref)}</span><span>${esc(c.assinatura)}</span></div></div>`;
}

const LAYOUTS = { oficio, manchete, ficha };
export function slides(c) {
  return { w: 1080, h: 1350, slides: [(LAYOUTS[c.layout] || oficio)(c)] };
}
