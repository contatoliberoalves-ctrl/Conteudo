// Identidade das redes da ANOREG/PE, estilo Azulejo: índigo oficial do logo (#0E1170), branco, azulejo português
// (Recife/Olinda) e degradê índigo de fundo. Vermelho e amarelo só os do próprio logo.
// O logo oficial fica em assets/ (fora do git; recrie com preparar_logo.py).
import fs from 'node:fs';
import path from 'node:path';

const R = path.dirname(new URL(import.meta.url).pathname);
const png = n => { const f = path.join(R, 'assets', n + '.png'); return fs.existsSync(f) ? 'data:image/png;base64,' + fs.readFileSync(f).toString('base64') : ''; };
export const LOGO = { cor: png('logo-cor'), branco: png('logo-branco'), letreiroCor: png('letreiro-cor'), letreiroBranco: png('letreiro-branco'), mono: png('logo-mono'), letreiroMono: png('letreiro-mono') };
export const SEM_LOGO = !LOGO.cor;

// cores oficiais (tiradas do logo)
export const COR = { indigo: '#0E1170', amarelo: '#FCF10C', vermelho: '#E0070F', branco: '#FFFFFF', fundo: '#060845', claro: '#E9EAF6', texto: '#4A4E86' };
const I = COR.indigo;

export const head = `<link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"><style>
*{box-sizing:border-box;margin:0;padding:0}body{margin:0}
.p{position:relative;overflow:hidden;font-family:Lexend,sans-serif;color:#fff;-webkit-font-smoothing:antialiased}
.abs{position:absolute}
.deg{background:radial-gradient(120% 85% at 80% 0%,#2A2FA8 0%,${I} 45%,${COR.fundo} 100%)}
.ind{background:${I}}.br{background:#fff;color:${I}}
.tit{font-weight:700;letter-spacing:-.03em;line-height:1.02;text-wrap:balance}
.txt{font-weight:300;line-height:1.45}
</style>`;

// ---------- azulejo ----------
// ladrilho 200×200 pintado: flor central, rosáceas nos cantos (fecham ao repetir) e meias-luas nas bordas
export function ladrilho(c, op = 1) {
  const p = (d) => `<path d="${d}"/>`;
  const petala = (ang, L, W) => `<ellipse cx="100" cy="${100 - L / 2 - 12}" rx="${W / 2}" ry="${L / 2}" transform="rotate(${ang} 100 100)"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><g fill="${c}" fill-opacity="${op}" stroke="none">
    ${[0, 90, 180, 270].map(a => petala(a, 46, 22)).join('')}
    <g fill-opacity=".55">${[45, 135, 225, 315].map(a => petala(a, 30, 14)).join('')}</g>
    <circle cx="100" cy="100" r="13"/>
    ${[[0, 0], [200, 0], [0, 200], [200, 200]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="20"/>`).join('')}
    ${[[100, 0], [0, 100], [200, 100], [100, 200]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9"/>`).join('')}
  </g><g fill="none" stroke="${c}" stroke-opacity="${op}" stroke-width="5">
    ${[[0, 0], [200, 0], [0, 200], [200, 200]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="40"/><circle cx="${x}" cy="${y}" r="54" stroke-width="2.5"/>`).join('')}
    <circle cx="100" cy="100" r="74" stroke-width="2.5"/>
    ${p('M100 0 L100 26 M0 100 L26 100 M200 100 L174 100 M100 200 L100 174')}
  </g><circle cx="100" cy="100" r="5" fill="#fff" fill-opacity="${op >= 1 ? 1 : 0}"/></svg>`;
}
export const uri = svg => `url('data:image/svg+xml,${encodeURIComponent(svg)}')`;
// painel de azulejos pintados (fundo branco, desenho índigo, rejunte)
export const painel = (tam = 270) => `background-color:#fff;background-image:linear-gradient(90deg,rgba(14,17,112,.10) 2px,transparent 2px),linear-gradient(0deg,rgba(14,17,112,.10) 2px,transparent 2px),${uri(ladrilho(I))};background-size:${tam}px ${tam}px;background-position:-1px -1px`;
// trama discreta de azulejo sobre o índigo
export const trama = (op = .14, tam = 220) => `background-image:${uri(ladrilho('#fff', op))};background-size:${tam}px ${tam}px`;

export const logo = (tipo, w, extra = '') => LOGO[tipo] ? `<img src="${LOGO[tipo]}" style="width:${w}px;display:block;${extra}">` : `<div style="font:800 ${w / 6}px Lexend;color:${tipo.includes('ranco') ? '#fff' : I}">ANOREG|PE</div>`;

const W = 1080, H = 1350;
export const C = {
  itens: [
    { n: 1, t: 'Inventário', txt: 'Herdeiros de acordo fazem a partilha por escritura pública, no tabelionato de notas.', lei: 'Lei nº 11.441/2007' },
    { n: 2, t: 'Divórcio', txt: 'O casal que está de acordo pode se divorciar no cartório, sem processo judicial.', lei: 'Art. 733 do CPC' },
    { n: 3, t: 'Usucapião', txt: 'O reconhecimento da propriedade pode ser pedido direto no Registro de Imóveis.', lei: 'Art. 216-A da Lei nº 6.015/1973' },
    { n: 4, t: 'Mudança de nome', txt: 'Maiores de 18 anos alteram o prenome direto no Registro Civil.', lei: 'Lei nº 14.382/2022' },
  ],
};

// ---------- feed ----------
const feedServico = `<div class="p ind" style="width:${W}px;height:${H}px">
  <div class="abs" style="left:0;top:0;width:${W}px;height:810px;${painel(270)}"></div>
  <div class="abs" style="left:0;top:810px;width:${W}px;height:${H - 810}px;background:${I}"></div>
  <div class="abs" style="left:84px;right:84px;top:880px"><div class="tit" style="font-size:118px">Resolva no cartório.</div></div>
  <div class="abs" style="left:84px;bottom:84px">${logo('letreiroBranco', 250)}</div></div>`;

const feedAgenda = `<div class="p deg" style="width:${W}px;height:${H}px">
  <div class="abs" style="right:0;top:0;width:270px;height:${H}px;${painel(270)}"></div>
  <div class="abs" style="left:84px;top:96px">${logo('letreiroBranco', 230)}</div>
  <div class="abs" style="left:78px;right:330px;top:330px">
    <div class="tit" style="font-size:210px;letter-spacing:-.05em;line-height:.9">27 e 28</div>
    <div style="font-size:52px;font-weight:300;margin-top:20px">de novembro</div></div>
  <div class="abs" style="left:84px;right:330px;bottom:110px">
    <div class="tit" style="font-size:70px;font-weight:600">Encontro Estadual de Notários e Registradores</div>
    <div style="font-size:34px;font-weight:300;margin-top:28px;opacity:.85">Recife</div></div></div>`;

const feedFrase = `<div class="p" style="width:${W}px;height:${H}px;${painel(270)}">
  <div class="abs ind" style="left:135px;top:270px;width:810px;height:810px;display:flex;flex-direction:column;justify-content:space-between;padding:84px">
    <div class="tit" style="font-size:72px;font-weight:600;line-height:1.12">Segurança jurídica é o que dá tranquilidade a quem assina.</div>
    ${logo('letreiroBranco', 220)}</div></div>`;

// ---------- carrossel ----------
const capa = `<div class="p deg" style="width:${W}px;height:${H}px">
  <div class="abs" style="left:0;right:0;bottom:0;height:620px;${trama(.16)};-webkit-mask:linear-gradient(0deg,#000 20%,transparent)"></div>
  <div class="abs" style="left:84px;top:96px">${logo('letreiroBranco', 230)}</div>
  <div class="abs" style="left:84px;right:84px;top:400px"><div class="tit" style="font-size:136px">O que dá pra resolver no cartório</div></div></div>`;

// ladrilho com o número no lugar da flor
const ladrilhoNum = (n, px, claro) => `<div style="position:relative;width:${px}px;height:${px}px;${claro ? `background:${I}` : painel(px)};${claro ? trama(.22, px) : ''}">
  <div style="position:absolute;inset:${px * .3}px;border-radius:50%;background:${claro ? '#fff' : I};display:grid;place-items:center;font:700 ${px * .26}px Lexend;color:${claro ? I : '#fff'}">${n}</div></div>`;
const item = (it, escuro) => escuro
  ? `<div class="p deg" style="width:${W}px;height:${H}px">
    <div class="abs" style="left:84px;top:120px">${ladrilhoNum(it.n, 360, true)}</div>
    <div class="abs" style="left:84px;right:84px;top:620px">
      <div class="tit" style="font-size:124px">${it.t}</div>
      <div class="txt" style="font-size:44px;margin-top:44px;opacity:.9">${it.txt}</div>
      <div style="font-size:24px;margin-top:48px;opacity:.6">${it.lei}</div></div></div>`
  : `<div class="p br" style="width:${W}px;height:${H}px">
    <div class="abs" style="left:84px;top:120px">${ladrilhoNum(it.n, 360)}</div>
    <div class="abs" style="left:84px;right:84px;top:620px">
      <div class="tit" style="font-size:124px">${it.t}</div>
      <div class="txt" style="font-size:44px;margin-top:44px;color:${COR.texto}">${it.txt}</div>
      <div style="font-size:24px;margin-top:48px;color:${I};opacity:.6">${it.lei}</div></div></div>`;
const fecho = `<div class="p" style="width:${W}px;height:${H}px;${painel(270)}">
  <div class="abs br" style="left:135px;top:405px;width:810px;height:540px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:56px">
    ${logo('cor', 600)}<div style="font-size:36px;font-weight:400;color:${I}">Salve e envie para quem precisa.</div></div></div>`;

// ---------- destaques, YouTube e perfil ----------
export const ICONES = {
  institucional: '<path d="M3 20.5h18M5 20.5v-9M9.7 20.5v-9M14.3 20.5v-9M19 20.5v-9M2.5 9h19L12 3.2z"/>',
  noticias: '<path d="M4 4.5h12.5v15H5.5A1.5 1.5 0 0 1 4 18z"/><path d="M16.5 8.5H20V18a1.5 1.5 0 0 1-3 0"/><path d="M7 8.5h6.5M7 12h6.5M7 15.5h4"/>',
  eventos: '<rect x="3.5" y="5" width="17" height="15.5" rx="1.2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  servicos: '<path d="M6 3h8.5L19 7.5V21H6z"/><path d="M14 3v5h5M9 12.5h7M9 16h4.5"/>',
  associados: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20.5c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.6"/><path d="M15.8 14.6c2.9.3 5.2 2.8 5.2 5.9"/>',
  contato: '<path d="M4 5h16v11.5H9.5L4 20.5z"/>',
};
export const DESTAQUES = [['institucional', 'Institucional'], ['noticias', 'Notícias'], ['eventos', 'Eventos'], ['servicos', 'Serviços'], ['associados', 'Associados'], ['contato', 'Contato']];
const destaque = k => `<div class="p" style="width:1080px;height:1920px;${painel(360)}">
  <div class="abs ind" style="left:240px;top:660px;width:600px;height:600px;border-radius:50%;display:grid;place-items:center;box-shadow:0 0 0 14px #fff">
    <svg width="280" height="280" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">${ICONES[k]}</svg></div></div>`;

const yt = `<div class="p deg" style="width:2560px;height:1440px">
  <div class="abs" style="left:0;top:0;width:420px;height:1440px;${painel(210)}"></div>
  <div class="abs" style="right:0;top:0;width:420px;height:1440px;${painel(210)}"></div>
  <div class="abs" style="left:507px;top:508px;width:1546px;height:423px;display:grid;place-items:center">${logo('branco', 1100)}</div></div>`;
const perfil = `<div class="p deg" style="width:800px;height:800px;display:grid;place-items:center">${logo('letreiroBranco', 600)}</div>`;

// lista de peças: { nome, w, h, html }
export const PECAS = [
  { nome: 'feed-servico', w: W, h: H, html: feedServico },
  { nome: 'feed-agenda', w: W, h: H, html: feedAgenda },
  { nome: 'feed-frase', w: W, h: H, html: feedFrase },
  { nome: 'carrossel-1', w: W, h: H, html: capa },
  ...C.itens.map((it, i) => ({ nome: `carrossel-${i + 2}`, w: W, h: H, html: item(it, i % 2 === 1) })),
  { nome: 'carrossel-6', w: W, h: H, html: fecho },
  ...DESTAQUES.map(([k]) => ({ nome: `destaque-${k}`, w: 1080, h: 1920, html: destaque(k) })),
  { nome: 'youtube-banner', w: 2560, h: 1440, html: yt },
  { nome: 'perfil', w: 800, h: 800, html: perfil },
];
