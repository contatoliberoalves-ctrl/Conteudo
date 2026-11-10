// Molde "Dorama · Logo" (@cristaodorameiro): propostas de logo inspiradas na bandeira da Coreia do Sul
// (taegeuk vermelho e azul, trigramas) com a cruz, nas cores do perfil. Cada conceito vira uma prancha
// 1080×1350 (marca grande, foto de perfil em círculo e versões de cor) e um avatar 1080×1080 (saida/<id>/avatar.png).
import { C, esc } from '../dorama-comum/identidade.mjs';

const W = 1080, H = 1350;
const PET = C.noite, TQ = C.turquesa, LJ = C.laranja, VM = C.vermelho, AZ = C.azul;

// Taegeuk (o círculo vermelho e azul da bandeira), inclinado como lá. r = raio, em coordenadas do SVG.
const taegeuk = (r, rot = -33) => `<g transform="rotate(${rot})"><circle r="${r}" fill="${AZ}"/><path d="M ${-r} 0 A ${r} ${r} 0 0 1 ${r} 0 A ${r / 2} ${r / 2} 0 0 1 0 0 A ${r / 2} ${r / 2} 0 0 0 ${-r} 0 Z" fill="${VM}"/></g>`;
// Cruz de braços arredondados centrada em (0,0): altura h, largura do braço b, braço horizontal mais alto.
const cruz = (h, b, cor, contorno = null, k = .62) => { const w = h * k, y = -h * .18;
  return `<g fill="${cor}" ${contorno ? `stroke="${contorno.cor}" stroke-width="${contorno.w}" paint-order="stroke"` : ''}><rect x="${-b / 2}" y="${-h / 2}" width="${b}" height="${h}" rx="${b * .22}"/><rect x="${-w / 2}" y="${y - b / 2}" width="${w}" height="${b}" rx="${b * .22}"/></g>`; };
// Trigrama (3 linhas, inteiras ou partidas) como na bandeira: linhas = [1,0,1] (1 inteira, 0 partida).
const trigrama = (linhas, w, e, g, cor) => linhas.map((l, i) => { const y = i * (e + g);
  return l ? `<rect x="${-w / 2}" y="${y}" width="${w}" height="${e}" rx="${e * .2}" fill="${cor}"/>` : `<rect x="${-w / 2}" y="${y}" width="${w * .45}" height="${e}" rx="${e * .2}" fill="${cor}"/><rect x="${w * .05}" y="${y}" width="${w * .45}" height="${e}" rx="${e * .2}" fill="${cor}"/>`; }).join('');

// ---- As marcas (símbolo), desenhadas num quadrado de -500..500 ----
const MARCAS = {
  // A. Taegeuk com a cruz branca vazada no meio e um anel turquesa: a bandeira e a fé num símbolo só.
  taegeuk: ({ fundo = TQ } = {}) => `${taegeuk(330)}${cruz(430, 92, '#FFFFFF')}<circle r="372" fill="none" stroke="#FFFFFF" stroke-width="22"/>`,
  // B. Cruz feita de trigramas: cada braço é um trigrama da bandeira, o centro é o taegeuk.
  trigramas: ({ cor = PET } = {}) => `<g transform="translate(0,-400)">${trigrama([1, 1, 1], 230, 50, 26, cor)}</g><g transform="translate(0,198)">${trigrama([0, 0, 0], 230, 50, 26, cor)}</g>
    <g transform="translate(-198,0) rotate(90)">${trigrama([1, 0, 1], 230, 50, 26, cor)}</g><g transform="translate(400,0) rotate(90)">${trigrama([0, 1, 0], 230, 50, 26, cor)}</g>${taegeuk(125)}<circle r="125" fill="none" stroke="#FFFFFF" stroke-width="18"/>`,
  // E. Coração: o amor por dorama em forma de coração com o taegeuk, e a cruz branca no meio.
  coracao: () => `<defs><clipPath id="cor"><path d="M 0 380 C -470 90 -420 -330 -150 -330 C -60 -330 0 -270 0 -210 C 0 -270 60 -330 150 -330 C 420 -330 470 90 0 380 Z"/></clipPath></defs>
    <path d="M 0 380 C -470 90 -420 -330 -150 -330 C -60 -330 0 -270 0 -210 C 0 -270 60 -330 150 -330 C 420 -330 470 90 0 380 Z" fill="none" stroke="#FFFFFF" stroke-width="40" stroke-linejoin="round"/>
    <g clip-path="url(#cor)">${taegeuk(520, -33)}</g><g transform="translate(0,10)">${cruz(330, 74, '#FFFFFF')}</g>`,
  // C. Botão de play (a tela do dorama) com a cruz dentro e o taegeuk como "bolinha de gravando".
  play: () => `<rect x="-380" y="-300" width="760" height="600" rx="150" fill="${PET}"/><rect x="-380" y="-300" width="760" height="600" rx="150" fill="none" stroke="#FFFFFF" stroke-width="18"/>
    <g transform="translate(-20,10)">${cruz(400, 86, LJ, { cor: PET, w: 0 })}</g><g transform="translate(300,-226)">${taegeuk(78)}<circle r="78" fill="none" stroke="#FFFFFF" stroke-width="14"/></g>
    <path d="M 190 230 l 0 -70 l 60 35 z" fill="#FFFFFF" opacity=".9"/>`,
  // D. Selo redondo: nome em volta, coreano embaixo, cruz e taegeuk no centro (bom de foto de perfil).
  selo: () => `<circle r="470" fill="${PET}"/><circle r="440" fill="none" stroke="${TQ}" stroke-width="10"/><circle r="300" fill="${TQ}"/>
    <defs><path id="arcoTopo" d="M -372 0 A 372 372 0 0 1 372 0"/><path id="arcoBase" d="M -392 0 A 392 392 0 0 0 392 0"/></defs>
    <text font-family="Lilita One" font-size="104" letter-spacing="10" fill="${LJ}"><textPath href="#arcoTopo" startOffset="50%" text-anchor="middle">CRISTÃO</textPath></text>
    <text font-family="Audiowide" font-size="64" letter-spacing="8" fill="#FFFFFF"><textPath href="#arcoBase" startOffset="50%" text-anchor="middle" dominant-baseline="hanging">DORAMEIRO</textPath></text>
    <circle cx="-405" cy="0" r="14" fill="${VM}"/><circle cx="405" cy="0" r="14" fill="${AZ}"/>
    ${taegeuk(190)}${cruz(250, 56, '#FFFFFF')}`,
};
const svg = (marca, px, opts) => `<svg viewBox="-500 -500 1000 1000" width="${px}" height="${px}" style="display:block;overflow:visible">${MARCAS[marca](opts)}</svg>`;

// Logotipo (marca + nome) em linha, nas cores do perfil.
const nome = (px, claro) => `<div style="line-height:.95"><div style="font-family:'Lilita One';font-size:${px}px;letter-spacing:.04em;color:${LJ};-webkit-text-stroke:${px * .08}px ${PET};paint-order:stroke fill">CRISTÃO</div>
  <div style="font-family:Audiowide;font-size:${px * .7}px;letter-spacing:.08em;color:${claro ? PET : '#FFFFFF'};text-shadow:${px * .05}px ${px * .05}px 0 ${VM},-${px * .035}px -${px * .03}px 0 ${AZ}">DORAMEIRO</div></div>`;
const FUNDO = { turquesa: `radial-gradient(120% 90% at 80% 0%,#2FE0C6 0%,${TQ} 55%,#00B59A 100%)`, branco: '#FFFFFF', petroleo: `radial-gradient(120% 90% at 80% 0%,#14453F 0%,${PET} 60%)` };
const avatarFundo = (c) => FUNDO[c.fundo || 'turquesa'];

// Avatar redondo (como o Instagram mostra), com o símbolo centralizado.
const avatar = (c, px) => { const opts = { ...(c.opts || {}), ...(c.fundo === 'petroleo' ? { cor: '#FFFFFF' } : {}) }; return `<div style="width:${px}px;height:${px}px;border-radius:50%;overflow:hidden;background:${avatarFundo(c)};display:flex;align-items:center;justify-content:center;box-shadow:0 12px 36px rgba(0,0,0,.18)">${svg(c.marca, px * (c.escala || .72), opts)}</div>`; };

export const prancha = c => `<div style="position:absolute;inset:0;background:#F4F7F6"></div>
  <div style="position:absolute;left:70px;right:70px;top:60px;display:flex;justify-content:space-between;align-items:baseline;font-family:'Plus Jakarta Sans';font-weight:800;font-size:26px;letter-spacing:.18em;color:${PET}"><span>PROPOSTA ${esc(c.letra)} · ${esc(c.nome).toUpperCase()}</span><span style="opacity:.5">@cristaodorameiro</span></div>
  <div style="position:absolute;left:70px;right:70px;top:120px;height:600px;border-radius:40px;background:${avatarFundo(c)};display:flex;align-items:center;justify-content:center;gap:40px;overflow:hidden">${svg(c.marca, 400, c.opts)}${nome(92, c.fundo === 'branco')}</div>
  <div style="position:absolute;left:70px;right:70px;top:750px;display:flex;gap:44px;align-items:center">
    ${avatar(c, 320)}
    <div style="display:flex;flex-direction:column;gap:22px">
      <div style="font-family:'Plus Jakarta Sans';font-size:30px;line-height:1.4;font-weight:500;color:#33504B;max-width:560px">${esc(c.ideia)}</div>
      <div style="display:flex;gap:18px;align-items:center">${avatar(c, 110)}${avatar({ ...c, fundo: 'branco' }, 110)}${avatar({ ...c, fundo: 'petroleo' }, 110)}<span style="font-family:'Plus Jakarta Sans';font-size:22px;font-weight:700;color:#6B7A78">no feed</span></div>
    </div></div>
  <div style="position:absolute;left:70px;right:70px;bottom:60px;display:flex;gap:14px">${[TQ, LJ, PET, '#FFFFFF', VM, AZ].map(k => `<div style="flex:1;height:70px;border-radius:16px;background:${k};border:2px solid rgba(0,0,0,.08);display:flex;align-items:flex-end;padding:8px 12px;font:700 18px 'Plus Jakarta Sans';color:${k === '#FFFFFF' || k === LJ || k === TQ ? PET : '#fff'}">${k}</div>`).join('')}</div>`;
export const avatarSolo = c => `<div style="position:absolute;inset:0;background:${avatarFundo(c)};display:flex;align-items:center;justify-content:center">${svg(c.marca, 1080 * (c.escala || .72), c.opts)}</div>`;
export const slides = c => ({ w: W, h: H, slides: [prancha(c)] });
