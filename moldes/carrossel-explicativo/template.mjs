// Modelo visual do "Carrossel Explicativo": capa com foto (layouts A–D, F e G, campo "capa"), 4 ou 5 slides de
// conteúdo (3 estilos, campo "estilo") e CTA.
// Gera um painel com todos os slides lado a lado (N × 1080 por 1350). Regras em README.md.
const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const lista = v => (v == null ? [] : Array.isArray(v) ? v : [v]);

import { CG, DEGRADE, FONTES_CG, TIT_CG } from '../cg-comum/identidade.mjs';
// Identidade única do @constitucionalgabaritado (cg-comum/identidade.mjs).
const COR = {
  verde: CG.verde, cartao: CG.escuro2, base: CG.escuro, gelo: CG.branco,
  texto: CG.tinta, claro: CG.claro, medio: CG.verde,
};
const bebas = TIT_CG;
const HANDLE = '@CONSTITUCIONALGABARITADO';
// Ritmo de fundos dos slides de conteúdo: 2 claros, 2 verdes, 1 claro.
const RITMO = ['claro', 'claro', 'verde', 'verde', 'claro'];

// **negrito** → <b>, depois de escapar o texto.
const rico = (s, corNegrito) => esc(s).replace(/\*\*(.+?)\*\*/g, `<b style="font-weight:700;color:${corNegrito}">$1</b>`);

// Tamanho de fonte Bebas para caber na largura útil (888px), dentro de [min, max].
const caber = (linhas, max, min, largura = 888) => {
  const n = Math.max(...linhas.map(l => l.length), 1);
  return Math.max(min, Math.min(max, Math.floor(largura / (n * 0.46))));
};

function handle(cor, posicao) {
  return `<div style="position:absolute;left:0;right:0;${posicao};text-align:center;font-size:24px;font-weight:500;letter-spacing:1px;color:${cor}">${HANDLE}</div>`;
}

// Posição da foto da capa. O recorte (1080×1350, rosto a 24% da altura) cobre a caixa da foto; "foco"
// (0–1) põe a linha do rosto nessa altura da caixa (sem foco: recorte alinhado em cima). Com `fotoAjuste`
// {dx, dy, z}: usa a foto com margem (fotos/fontes/), na mesma escala, movida dx/dy px e ampliada z vezes
// a partir do centro da caixa — a mesma conta do editor de capa da galeria (galeria/modelo.html), que
// recebe a geometria pronta em saida/<id>/capa.json.
const ROSTO = 0.24;
function recorteNaCaixa(W, H, foco) {
  const k = Math.max(W / 1080, H / 1350), w = 1080 * k, h = 1350 * k;
  const top = foco == null ? 0 : Math.min(0, Math.max(H - h, foco * H - ROSTO * h));
  return { k, w, h, left: (W - w) / 2, top };
}
// Foto com margem (fotos/fontes.json: w, h e a posição ox/oy do recorte dentro dela) na escala da caixa.
export function geometriaFonte(f, W, H, foco) {
  const r = recorteNaCaixa(W, H, foco);
  return { fw: f.w * r.k, fh: f.h * r.k, ox: f.ox * r.k - r.left, oy: f.oy * r.k - r.top };
}
// Caixa da foto: o render lê data-caixa/data-foco para o editor; tudo o que não é data-foto vira a "camada".
function caixaFoto(c, x0, y0, W, H, foco = null) {
  const f = c._fonte, a = c.fotoAjuste;
  let img;
  if (f && a) {
    const g = geometriaFonte(f, W, H, foco), z = a.z || 1, cx = x0 + W / 2, cy = y0 + H / 2;
    const left = cx + (x0 - g.ox - cx) * z + (a.dx || 0), top = cy + (y0 - g.oy - cy) * z + (a.dy || 0);
    img = `<img src="${f.src}" style="position:absolute;left:${left - x0}px;top:${top - y0}px;width:${g.fw * z}px;height:${g.fh * z}px;max-width:none">`;
  } else {
    const r = recorteNaCaixa(W, H, foco);
    img = `<img src="${c.foto}" style="position:absolute;left:${r.left}px;top:${r.top}px;width:${r.w}px;height:${r.h}px;max-width:none">`;
  }
  return `<div data-foto data-caixa="${x0},${y0},${W},${H}"${foco == null ? '' : ` data-foco="${foco}"`} style="position:absolute;left:${x0}px;top:${y0}px;width:${W}px;height:${H}px;overflow:hidden">${img}</div>`;
}
const linhasDe = c => lista(c.destaque).map(l => l.toUpperCase());
// Tamanho do destaque limitado pela largura e pela altura disponível.
const tamanho = (linhas, max, min, largura, altura) => Math.max(min, Math.min(caber(linhas, max, min, largura), Math.floor(altura / (linhas.length * 0.9))));

// ——— Capas ——— (campo "capa": A, B, C, D ou F; todas usam os mesmos campos: etiqueta, apoio, destaque, subtitulo, elemento)

// A · Marca-texto: foto em tela cheia, destaque no marca-texto verde.
function capaA(c) {
  const destaque = linhasDe(c);
  const tam = caber(destaque, 300, 120, 836);
  const apoio = lista(c.apoio);
  return `
  ${caixaFoto(c, 0, 0, 1080, 1350)}
  <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,38,25,0) 42%,rgba(11,38,25,.85) 66%,${COR.base} 82%)"></div>
  ${c.elemento ? `<div style="position:absolute;top:130px;right:96px;${bebas};font-size:120px;line-height:.9;color:${COR.claro}">${esc(c.elemento)}</div>` : ''}
  <div data-bloco data-rosto style="position:absolute;left:96px;right:96px;bottom:150px;display:flex;flex-direction:column;align-items:flex-start;gap:26px">
    ${c.etiqueta ? `<span style="background:#fff;color:${COR.base};padding:12px 22px;font-size:24px;font-weight:700;letter-spacing:3px;text-transform:uppercase;border-left:8px solid ${COR.claro}">${esc(c.etiqueta)}</span>` : ''}
    ${apoio.length ? `<div style="${bebas};font-size:${caber(apoio, 112, 90)}px;line-height:.9;color:#fff;margin-top:6px;text-shadow:0 2px 18px rgba(20,22,21,.55)">${apoio.map(esc).join('<br>')}</div>` : ''}
    <div style="display:flex;flex-direction:column;align-items:flex-start;gap:14px;margin-top:4px">
      ${destaque.map(l => `<span style="display:inline-block;${bebas};font-size:${tam}px;line-height:.9;color:${COR.base};background:${COR.claro};padding:14px 24px 6px">${esc(l)}</span>`).join('')}
    </div>
    ${c.subtitulo ? `<div style="display:flex;flex-direction:column;gap:18px;margin-top:10px"><span style="width:96px;height:6px;background:${COR.claro}"></span><span style="font-size:52px;font-weight:500;line-height:1.2;color:#fff;text-wrap:pretty;text-shadow:0 2px 14px rgba(20,22,21,.55)">${esc(c.subtitulo)}</span></div>` : ''}
  </div>
  ${handle('rgba(255,255,255,.85)', 'bottom:64px')}`;
}


// B · Revista: foto no alto, faixa clara embaixo com o título em verde.
function capaB(c) {
  const d = linhasDe(c), apoio = lista(c.apoio).join(' ');
  const tam = tamanho(d, 190, 96, 888, 360 - (apoio ? 64 : 0) - (c.subtitulo ? 70 : 0));
  return `
  ${caixaFoto(c, 0, 0, 1080, 800)}
  <div style="position:absolute;left:0;right:0;top:800px;height:14px;background:${COR.claro}"></div>
  ${c.elemento ? `<div style="position:absolute;top:120px;right:96px;${bebas};font-size:120px;line-height:.9;color:${COR.claro}">${esc(c.elemento)}</div>` : ''}
  ${c.etiqueta ? `<span style="position:absolute;left:96px;top:780px;background:${COR.base};color:#fff;padding:14px 26px;border-left:8px solid ${COR.claro};font-size:24px;font-weight:700;letter-spacing:2px;text-transform:uppercase">${esc(c.etiqueta)}</span>` : ''}
  <div data-bloco style="position:absolute;left:96px;right:96px;top:870px;bottom:120px;display:flex;flex-direction:column;justify-content:center;gap:14px">
    ${apoio ? `<div style="font-size:34px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:${COR.medio}">${esc(apoio)}</div>` : ''}
    <div data-destaque style="${bebas};font-size:${tam}px;line-height:.9;color:${COR.verde}">${d.map(esc).join('<br>')}</div>
    ${c.subtitulo ? `<div style="font-size:34px;font-weight:500;line-height:1.25;color:${COR.texto}">${esc(c.subtitulo)}</div>` : ''}
  </div>
  ${handle(COR.verde, 'bottom:56px')}`;
}

// C · Moldura: fundo claro pontilhado, foto emoldurada com sombra verde e fita com a etiqueta.
function capaC(c) {
  const d = linhasDe(c), apoio = lista(c.apoio).join(' ');
  const tam = tamanho(d, 180, 90, 860, 330 - (apoio ? 60 : 0) - (c.subtitulo ? 60 : 0));
  const x = 150, y = 110, w = 780, h = 720, o = 26;
  return `
  <div style="position:absolute;inset:0;background-image:radial-gradient(rgba(31,138,85,.16) 2px,transparent 2.6px);background-size:30px 30px"></div>
  <div style="position:absolute;left:${x + w}px;top:${y + o}px;width:${o}px;height:${h}px;background:${COR.claro}"></div>
  <div style="position:absolute;left:${x + o}px;top:${y + h}px;width:${w}px;height:${o}px;background:${COR.claro}"></div>
  ${caixaFoto(c, x, y, w, h)}
  ${c.etiqueta ? `<span style="position:absolute;left:${x - 50}px;top:${y + 34}px;transform:rotate(-8deg);background:${COR.claro};color:${COR.base};padding:14px 30px;font-size:24px;font-weight:700;letter-spacing:2px;text-transform:uppercase;box-shadow:0 8px 20px rgba(20,26,24,.18)">${esc(c.etiqueta)}</span>` : ''}
  <div data-bloco style="position:absolute;left:110px;right:110px;top:890px;bottom:110px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:12px;text-align:center">
    ${apoio ? `<div style="font-size:40px;font-weight:500;font-style:italic;color:${COR.texto}">${esc(apoio)}</div>` : ''}
    <div data-destaque style="${bebas};font-size:${tam}px;line-height:.92;color:${COR.verde}">${d.map(l => `<span style="background:linear-gradient(transparent 58%,${COR.claro} 58%);padding:0 10px">${esc(l)}</span>`).join('<br>')}</div>
    ${c.subtitulo ? `<div style="font-size:32px;font-weight:500;color:${COR.medio}">${esc(c.subtitulo)}</div>` : ''}
  </div>
  ${handle(COR.verde, 'bottom:50px')}`;
}

// D · Painel: foto no alto e um painel em degradê (escuro → verde) com o título, de borda reta.
function capaD(c) {
  const d = linhasDe(c), apoio = lista(c.apoio).join(' ');
  const tam = tamanho(d, 200, 96, 888, 330 - (apoio ? 56 : 0) - (c.subtitulo ? 60 : 0));
  return `
  ${caixaFoto(c, 0, 0, 1080, 860, 0.36)}
  <div style="position:absolute;left:0;right:0;top:800px;bottom:0;background:${DEGRADE}"></div>
  <div style="position:absolute;left:96px;top:784px;width:180px;height:32px;background:${COR.claro}"></div>
  ${c.elemento ? `<div style="position:absolute;top:130px;right:96px;${bebas};font-size:120px;line-height:.9;color:${COR.claro}">${esc(c.elemento)}</div>` : ''}
  <div data-bloco style="position:absolute;left:96px;right:96px;top:850px;bottom:130px;display:flex;flex-direction:column;justify-content:center;gap:14px">
    ${c.etiqueta ? `<div style="font-size:24px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:${COR.claro}">${esc(c.etiqueta)}</div>` : ''}
    ${apoio ? `<div style="font-size:38px;font-weight:600;color:#fff">${esc(apoio)}</div>` : ''}
    <div data-destaque style="${bebas};font-size:${tam}px;line-height:.92;color:#fff">${d.map(esc).join('<br>')}</div>
    ${c.subtitulo ? `<div style="font-size:32px;font-weight:500;color:${CG.nevoa}">${esc(c.subtitulo)}</div>` : ''}
  </div>
  ${handle('rgba(255,255,255,.8)', 'bottom:56px')}`;
}

// F · Manchete: página de jornal, título em preto e a foto como imagem da matéria.
function capaF(c) {
  const d = linhasDe(c), apoio = lista(c.apoio).join(' ');
  const tam = tamanho(d, 340, 90, 888, 440 - (apoio ? 60 : 0));
  const x = 96, y = 740, w = 888, h = 460;
  return `
  <div style="position:absolute;left:96px;right:96px;top:70px;height:8px;background:${COR.base}"></div>
  <div style="position:absolute;left:96px;right:96px;top:90px;text-align:center;${bebas};font-size:76px;line-height:1;white-space:nowrap;color:${COR.base}">CONSTITUCIONAL GABARITADO</div>
  <div style="position:absolute;left:96px;right:96px;top:186px;height:2px;background:${COR.base}"></div>
  <div style="position:absolute;left:96px;right:96px;top:196px;display:flex;justify-content:space-between;font-size:22px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:${COR.texto}"><span>${esc(c.etiqueta || '')}</span><span>Direito Constitucional</span></div>
  <div style="position:absolute;left:96px;right:96px;top:238px;height:2px;background:${COR.base}"></div>
  <div data-bloco style="position:absolute;left:96px;right:96px;top:262px;height:450px;display:flex;flex-direction:column;justify-content:center;gap:10px">
    ${apoio ? `<div style="font-size:38px;font-weight:600;font-style:italic;color:${COR.medio}">${esc(apoio)}</div>` : ''}
    <div data-destaque style="${bebas};font-size:${tam}px;line-height:.9;color:${COR.base}">${d.map(esc).join('<br>')}</div>
  </div>
  ${caixaFoto(c, x, y, w, h, 0.4)}
  <div style="position:absolute;left:${x + w - 250}px;top:${y - 40}px;transform:rotate(-8deg);background:${COR.claro};color:${COR.base};${bebas};font-size:54px;line-height:1;padding:12px 26px 8px">ENTENDA</div>
  <div style="position:absolute;left:96px;right:96px;top:${y + h + 16}px;display:flex;justify-content:space-between;font-size:22px;color:${COR.texto}"><i>${esc(c.subtitulo || '')}</i><span style="font-weight:600">${HANDLE}</span></div>`;
}


// G · Documento: fundo escuro com grade, título no alto, uma folha (ex.: padrão de resposta) inclinada com
// trechos riscados (~~x~~) e corrigidos à mão ({{x}}), carimbo e o autor recortado (PNG sem fundo) à direita.
// Campos extras: doc {rotulo, linhas[]}, carimbo, recorte (PNG em fotos/), recorteH.
function capaG(c) {
  const d = linhasDe(c), apoio = lista(c.apoio).join(' '), doc = c.doc || {};
  const tam = caber(d, 170, 90, 940);
  const linha = t => esc(t).replace(/~~(.+?)~~/g, `<s style="color:#d64545;text-decoration-thickness:5px">$1</s>`)
    .replace(/\{\{(.+?)\}\}/g, `<span style="font-family:Caveat,cursive;font-weight:700;font-size:1.7em;line-height:.6;color:${COR.medio};margin:0 4px">$1</span>`)
    .replace(/\*\*(.+?)\*\*/g, '<b style="font-weight:700">$1</b>');
  return `
  <div style="position:absolute;inset:0;background:linear-gradient(rgba(111,211,155,.06) 2px,transparent 2px) 0 0/54px 54px,linear-gradient(90deg,rgba(111,211,155,.06) 2px,transparent 2px) 0 0/54px 54px,${DEGRADE}"></div>
  ${c.recorte ? `<img src="../fotos/${esc(c.recorte)}" style="position:absolute;right:-70px;bottom:0;height:${c.recorteH || 800}px;filter:drop-shadow(0 20px 40px rgba(0,0,0,.45));z-index:2">` : ''}
  <div style="position:absolute;left:70px;top:80px;z-index:4">${c.etiqueta ? `<span style="background:${COR.claro};color:${COR.base};font-size:24px;font-weight:700;letter-spacing:3px;text-transform:uppercase;padding:10px 22px">${esc(c.etiqueta)}</span>` : ''}</div>
  <div data-bloco style="position:absolute;left:70px;right:70px;top:150px;z-index:4">
    ${apoio ? `<div style="font-size:38px;font-weight:600;color:${COR.claro}">${esc(apoio)}</div>` : ''}
    <div data-destaque style="${bebas};font-size:${tam}px;line-height:.9;color:#fff">${d.map((l, i) => i === d.length - 1 ? `<span style="color:${COR.claro}">${esc(l)}</span>` : esc(l)).join('<br>')}</div>
  </div>
  <div style="position:absolute;left:60px;top:${c.docY || 600}px;width:${c.docW || 620}px;transform:rotate(-4deg);background:#fbfaf6;border-radius:10px;padding:34px 38px 40px;box-shadow:0 30px 60px rgba(0,0,0,.45);z-index:3">
    <div style="font-size:19px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:${COR.medio};border-bottom:2px solid #e2e6e3;padding-bottom:12px;margin-bottom:16px">${esc(doc.rotulo || 'Padrão de resposta')}</div>
    ${lista(doc.linhas).map(t => `<div style="font-size:${doc.tl || 29}px;line-height:1.5;color:${COR.texto};font-weight:500">${linha(t)}</div>`).join('')}
    ${[86, 70, 92].map(w => `<div style="height:12px;border-radius:6px;background:#e6e9e7;width:${w}%;margin-top:18px"></div>`).join('')}
  </div>
  ${c.carimbo ? `<div style="position:absolute;left:${c.carimboX ?? 420}px;top:${c.carimboY ?? 980}px;transform:rotate(-12deg);border:8px solid #d64545;color:#d64545;${bebas};font-size:${c.carimboT || 86}px;line-height:1;padding:12px 26px 4px;border-radius:12px;background:rgba(251,250,246,.9);z-index:5">${esc(c.carimbo)}</div>` : ''}
  <div style="position:absolute;left:70px;bottom:44px;font-size:24px;font-weight:500;letter-spacing:1px;color:rgba(111,211,155,.9);z-index:6">${HANDLE}</div>`;
}

const CAPAS = { G: [capaG, COR.base], A: [capaA, COR.base], B: [capaB, COR.gelo], C: [capaC, CG.papel], D: [capaD, COR.base], F: [capaF, CG.papel] };

function conteudo(s, k, estilo) {
  const fundo = s.fundo || RITMO[k % RITMO.length];
  const escuro = fundo === 'verde';
  const direita = (s.alinhamento || (k % 2 ? 'direita' : 'esquerda')) === 'direita';
  const T = TEMA[estilo][fundo];
  const titulo = lista(s.titulo).map(l => l.toUpperCase());
  const alinhar = direita ? 'text-align:right;align-items:flex-end' : 'text-align:left;align-items:flex-start';
  const linha = direita ? 'row-reverse' : 'row';
  // "compacto": true encolhe texto e espaçamentos para slides mais cheios (questões, tabelas longas).
  const cp = !!s.compacto;
  const itens = (arr, marcador) => `<div style="display:flex;flex-direction:column;gap:${cp ? 22 : 34}px;width:100%;${alinhar}">${arr.map((t, i) =>
    `<div style="display:flex;flex-direction:${linha};gap:24px;align-items:flex-start;max-width:888px">
      ${marcador(i)}
      <span style="font-size:${cp ? 34 : 38}px;line-height:${cp ? 1.35 : 1.4};color:${T.txt};text-wrap:pretty">${rico(t, T.negrito)}</span></div>`).join('')}</div>`;
  const quadrado = () => `<span style="flex:0 0 18px;width:18px;height:18px;border-radius:4px;background:${T.acento};margin-top:17px"></span>`;
  const rotulo = texto => `<span style="flex:0 0 auto;${bebas};font-size:64px;line-height:.9;color:${T.rotulo};min-width:44px;margin-top:2px">${texto}</span>`;
  const numero = i => rotulo(String(i + 1).padStart(2, '0'));
  // "inicio": continua a contagem de letras/romanos quando a lista segue de um slide anterior.
  const letra = i => rotulo('ABCDEFGH'[i + (s.inicio || 0)]);
  const romano = i => rotulo(['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][i + (s.inicio || 0)]);
  const paragrafos = arr => arr.map(p => `<p style="margin:0;font-size:${cp ? 42 : 46}px;line-height:${cp ? 1.35 : 1.4};color:${T.txt};max-width:888px;text-wrap:pretty">${rico(p, T.negrito)}</p>`).join('');

  return {
    bg: T.bg,
    html: `
  ${T.decor || ''}
  ${s.marca ? `<div style="position:absolute;${direita ? 'left:-40px' : 'right:-40px'};bottom:40px;${bebas};font-size:300px;line-height:.8;white-space:nowrap;color:${T.marca}">${esc(s.marca)}</div>` : ''}
  ${s.figura ? `<img src="${esc(s.figura)}" style="position:absolute;${direita ? 'left:-60px' : 'right:-60px'};bottom:80px;height:560px;object-fit:contain">` : ''}
  ${handle(T.handle, 'top:64px')}
  <div data-bloco style="position:absolute;left:96px;right:96px;top:${cp ? 130 : 150}px;bottom:${cp ? 110 : 130}px;display:flex;flex-direction:column;justify-content:center;gap:${cp ? 28 : 40}px;${alinhar}">
    ${s.barra === false ? '' : `<span style="width:80px;height:6px;background:${T.acento};flex:0 0 auto"></span>`}
    ${titulo.length ? `<div style="${bebas};font-size:${caber(titulo, cp ? 150 : 200, 110)}px;line-height:.88;color:${T.tit}">${titulo.map(l => T.grifo ? `<span style="background:linear-gradient(transparent 60%,${T.grifo} 60%);padding:0 8px">${esc(l)}</span>` : esc(l)).join('<br>')}</div>` : ''}
    ${paragrafos(lista(s.texto))}
    ${s.lista ? itens(s.lista, quadrado) : ''}
    ${s.numerada ? itens(s.numerada, numero) : ''}
    ${s.afirmativas ? itens(s.afirmativas, romano) : ''}
    ${paragrafos(lista(s.textoMeio))}
    ${s.alternativas ? itens(s.alternativas, letra) : ''}
    ${paragrafos(lista(s.textoFinal))}
  </div>`,
  };
}


// ——— Estilos do miolo ——— (campo "estilo": classico, caderno ou noturno). Cada um define as cores
// dos slides "claro" e "verde" do ritmo e a decoração de fundo.
// Uma família só: branco (ou papel), degradê e escuro. O "estilo" muda só a ordem dos fundos.
const CLARO = { bg: COR.gelo, txt: COR.texto, tit: COR.base, acento: COR.verde, negrito: COR.base, marca: 'rgba(31,138,85,.07)', handle: COR.verde, rotulo: COR.verde };
const PAPEL = { ...CLARO, bg: CG.papel };
const DEG = { bg: DEGRADE, txt: 'rgba(255,255,255,.93)', tit: '#fff', acento: COR.claro, negrito: COR.claro, marca: 'rgba(111,211,155,.12)', handle: 'rgba(255,255,255,.8)', rotulo: COR.claro };
const ESC = { ...DEG, bg: COR.base };
const TEMA = {
  classico: { claro: CLARO, verde: DEG },
  caderno: { claro: PAPEL, verde: ESC },
  noturno: { claro: ESC, verde: CLARO },
};

// CTA: tela cheia em degradê, tudo centralizado: rótulo, pergunta grande, chamada e as 3 ações do Instagram.
const ICONE = {
  comentar: '<path d="M8 10h32v22H20l-8 7v-7H8z"/>',
  salvar: '<path d="M13 7h22v34l-11-8-11 8z"/>',
  enviar: '<path d="M6 22 42 7 30 42l-7-14z"/><path d="M23 28 42 7"/>',
};
function cta(c) {
  const acoes = [['comentar', c.acao1 || 'Comente'], ['salvar', 'Salve'], ['enviar', 'Envie pra alguém']];
  return `
  <div style="position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px);background-size:90px 90px"></div>
  <div data-bloco style="position:absolute;left:96px;right:96px;top:120px;bottom:120px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:44px;text-align:center">
    <span style="display:inline-flex;align-items:center;gap:16px;font-size:24px;font-weight:700;letter-spacing:5px;color:${COR.claro}"><i style="display:block;width:48px;height:4px;background:${COR.claro}"></i>${esc(c.rotulo || 'ANTES DE SAIR')}<i style="display:block;width:48px;height:4px;background:${COR.claro}"></i></span>
    <div style="${bebas};font-size:${caber([c.pergunta || ''], 170, 110, 860)}px;line-height:.95;color:#fff;text-wrap:balance">${esc((c.pergunta || 'Gostou da explicação?').toUpperCase())}</div>
    <div style="font-size:40px;font-weight:600;line-height:1.3;color:${CG.nevoa};text-wrap:balance;max-width:820px">${esc(c.chamada || 'Salva pra revisar depois')}</div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:18px;width:100%;margin-top:10px">${acoes.map(([ic, t]) => `<div style="display:flex;flex-direction:column;align-items:center;gap:16px;padding:40px 10px;background:rgba(11,38,25,.45);border-top:4px solid ${COR.claro}"><svg viewBox="0 0 48 48" width="84" height="84" fill="none" stroke="#fff" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round">${ICONE[ic]}</svg><span style="font-size:30px;font-weight:600;color:#fff">${esc(t)}</span></div>`).join('')}</div>
  </div>
  ${handle('rgba(255,255,255,.85)', 'bottom:64px')}`;
}

export function renderCarrossel(c) {
  const [fazCapa, fundoCapa] = CAPAS[c.capa] || CAPAS.A;
  const estilo = TEMA[c.estilo] ? c.estilo : 'classico';
  const slides = [
    { bg: fundoCapa, html: fazCapa(c) },
    ...lista(c.slides).map((s, k) => conteudo(s, k, estilo)),
    { bg: DEGRADE, html: cta({ ...(c.cta || {}) }) },
  ];
  const total = slides.length;
  const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="${FONTES_CG}" rel="stylesheet"><link href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box}body{margin:0;font-family:Poppins,sans-serif}</style></head><body>
<div id="painel" style="position:relative;width:${total * 1080}px;height:1350px;overflow:hidden">
${slides.map((s, i) => `<div id="slide-${i + 1}" style="position:absolute;left:${i * 1080}px;top:0;width:1080px;height:1350px;overflow:hidden;background:${s.bg}">${s.html}</div>`).join('\n')}
</div></body></html>`;
  return { html, total };
}
