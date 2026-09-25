// Modelo visual do "Treino de Peças": capa + enunciado (2 slides, ou 3 com "quebra"), 1080×1350 cada.
// tipo "treino" (verde/claro, enunciado longo da OAB) ou "autoral" (preto, caso curto); capa "A" (Editorial) ou "B" (Folha de prova).
import { createRequire } from 'node:module';
// Hifenização em português (hífens invisíveis \u00AD): o Chromium não hifeniza pt-BR sozinho em todo sistema.
const { hyphenateSync } = createRequire(import.meta.url)('hyphen/pt');
const hifen = s => hyphenateSync(String(s), { minWordLength: 6 });
const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const lista = v => (v == null ? [] : Array.isArray(v) ? v : [v]);
// **negrito** e *itálico* (nomes fictícios: *Alfa*, *XX*), depois de escapar.
const rico = s => esc(hifen(s)).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\*(.+?)\*/g, '<i>$1</i>');

const COR = { verde: '#33443D', lima: '#8DBA4C', off: '#F6F6F2', capaClara: '#F4F3EE', cartao: '#FBFBF8', preto: '#1B1C1B', corpo: '#1F2623' };
const F = {
  serif: "font-family:'Young Serif',Georgia,serif;font-weight:400",
  slab: "font-family:'Alfa Slab One',Georgia,serif;font-weight:400",
  anton: "font-family:Anton,Impact,sans-serif;font-weight:400",
};
const handle = (px, cor) => `<span style="font-size:${px}px;color:${cor};font-weight:400"><b style="font-weight:700">@CONSTITUCIONAL</b>GABARITADO</span>`;
const rotulo = (texto, cor) => `<span style="font-size:22px;font-weight:500;letter-spacing:3px;text-transform:uppercase;color:${cor}">${texto}</span>`;
const selo = (px, pad, extra = '') => `<span style="${F.slab};font-size:${px}px;line-height:1;background:${COR.lima};color:${COR.off};border-radius:6px;padding:${pad};${extra}">de</span>`;

function capaA(c, autoral) {
  const T = autoral ? { bg: COR.preto, tinta: COR.off, circ: COR.lima, seta: COR.preto } : { bg: COR.capaClara, tinta: COR.verde, circ: COR.verde, seta: COR.off };
  return {
    bg: T.bg,
    html: `<div style="position:absolute;inset:0;display:flex;flex-direction:column;padding:80px 90px;color:${T.tinta}">
      <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:28px;border-bottom:3px solid ${T.tinta}">
        ${handle(24, T.tinta)}
        ${autoral ? `<span style="${F.slab};font-size:24px;letter-spacing:6px;color:${COR.lima}">AUTORAL</span>` : ''}
      </div>
      <div data-titulo style="margin-top:auto;display:flex;flex-direction:column">
        <div style="font-size:26px;font-weight:500;letter-spacing:6px;margin-bottom:36px">DIREITO CONSTITUCIONAL · 2ª FASE</div>
        <div style="${F.serif};font-size:300px;line-height:.82;letter-spacing:-10px">treino</div>
        <div style="display:flex;gap:26px;align-items:center;margin-top:18px">
          ${selo(56, '16px 30px 20px', 'margin-top:-30px')}
          <span style="${F.serif};font-size:280px;line-height:.82;letter-spacing:-10px">peças</span>
        </div>
        <div style="height:3px;background:${T.tinta};margin-top:90px"></div>
      </div>
      <div style="margin-top:70px;display:flex;justify-content:space-between;align-items:center">
        ${rotulo('Enunciado + desafio', T.tinta)}
        <span style="width:84px;height:84px;border-radius:50%;background:${T.circ};color:${T.seta};display:flex;align-items:center;justify-content:center;font-size:34px">→</span>
      </div>
    </div>`,
  };
}

function capaB(c, autoral) {
  const T = autoral ? { bg: COR.preto, ponto: '#262826', tras: '#3A3C3A', tinta: COR.preto, aba: 'AUTORAL', abaTxt: COR.preto }
                    : { bg: COR.verde, ponto: '#3B4D46', tras: '#4B5C55', tinta: COR.verde, aba: '2ª FASE', abaTxt: COR.off };
  const linha = (h, op, w = '100%') => `<span style="display:block;height:${h}px;width:${w};background:${T.tinta};opacity:${op}"></span>`;
  return {
    bg: T.bg,
    html: `<div style="position:absolute;inset:0;background-image:radial-gradient(${T.ponto} 2px,transparent 2.6px);background-size:26px 26px"></div>
      <div style="position:absolute;left:150px;top:250px;width:800px;height:900px;border-radius:24px;background:${T.tras};transform:rotate(5deg)"></div>
      <div style="position:absolute;left:200px;top:172px;${F.slab};font-size:26px;letter-spacing:8px;background:${COR.lima};color:${T.abaTxt};padding:18px 30px 32px;border-radius:14px 14px 0 0">${T.aba}</div>
      <div data-titulo style="position:absolute;left:130px;top:230px;width:820px;height:900px;background:${COR.off};border-radius:24px;box-shadow:0 30px 80px rgba(0,0,0,.45);display:flex;flex-direction:column;padding:70px;color:${T.tinta}">
        <div style="display:flex;flex-direction:column;gap:22px">${linha(3, 1)}${linha(2, .12)}${linha(2, .12, '70%')}</div>
        <div style="margin-top:auto;${F.serif};font-size:210px;line-height:.86;letter-spacing:-7px">treino</div>
        <div style="display:flex;gap:22px;align-items:center;margin-top:10px">
          ${selo(52, '14px 28px 18px')}
          <span style="${F.serif};font-size:210px;line-height:.86;letter-spacing:-7px">peças</span>
        </div>
        <div style="margin-top:70px;display:flex;justify-content:space-between">${rotulo('Qual é a peça?', T.tinta)}${rotulo('Arraste →', T.tinta)}</div>
      </div>
      <div style="position:absolute;left:0;right:0;bottom:80px;text-align:center">${handle(28, COR.off)}</div>`,
  };
}

// Enunciado longo, estilo OAB (tipo "treino"). Com "quebra", o enunciado segue em mais de um slide:
// paras = parágrafos deste slide, ultimo = se é o slide que fecha com o comando e "QUAL É A PEÇA?".
function enunciadoTreino(c, paras = lista(c.enunciado), n = 2, total = 2, ultimo = true) {
  const base = total > 2 ? 24 : 19;
  const comando = ultimo && c.comando ? `<div style="border-top:2px solid #E3E6E1;padding-top:12px"><b>${rico(c.comando)}</b>${c.valor ? ` ${esc(c.valor)}` : ''}</div>` : '';
  return {
    bg: COR.verde,
    html: `<div style="position:absolute;inset:0;display:flex;flex-direction:column;padding:60px 56px">
      <div style="display:flex;justify-content:space-between;align-items:center;padding:0 8px">${handle(22, COR.off)}<span style="font-size:20px;font-weight:500;letter-spacing:3px;color:${COR.off}">0${n} / 0${total}</span></div>
      <div style="margin-top:34px;background:${COR.cartao};border-radius:24px;padding:36px 40px;display:flex;flex-direction:column;gap:22px">
        <div style="display:flex;align-items:center;gap:18px">
          <span style="${F.slab};font-size:19px;letter-spacing:3px;background:${COR.lima};color:${COR.cartao};padding:9px 16px 11px;border-radius:6px">ENUNCIADO</span>
          <span style="flex:1;height:2px;background:${COR.verde};opacity:.15"></span>
        </div>
        <div data-texto data-base="${base}" lang="pt-BR" style="font-size:${base}px;line-height:1.42;color:${COR.corpo};text-align:justify;hyphens:auto;display:flex;flex-direction:column;gap:12px">
          ${paras.map(p => `<p style="margin:0">${rico(p)}</p>`).join('')}
          ${comando}
        </div>
      </div>
      <div style="margin-top:auto;padding-top:30px;text-align:center;${F.anton};font-size:92px;line-height:1;color:${COR.off}">${ultimo ? 'QUAL É A PEÇA?' : 'CONTINUA →'}</div>
    </div>`,
  };
}

// Caso curto (tipo "autoral").
function casoAutoral(c) {
  return {
    bg: COR.off,
    html: `<div style="position:absolute;inset:0;background-image:radial-gradient(#E9E9E3 2px,transparent 2.6px);background-size:26px 26px"></div>
      <div style="position:absolute;inset:0;display:flex;flex-direction:column;padding:90px 96px 100px;color:${COR.preto}">
        <div style="display:flex;justify-content:space-between;align-items:center">${handle(24, COR.preto)}<span style="font-size:20px;font-weight:500;letter-spacing:3px">02 / 02</span></div>
        <div style="margin-top:90px;display:flex;align-items:center;gap:20px">
          <span style="${F.slab};font-size:24px;background:${COR.lima};color:${COR.off};padding:10px 18px 12px;border-radius:6px">CASO</span>
          <span style="flex:1;height:2px;background:${COR.preto};opacity:.15"></span>
        </div>
        <div data-texto lang="pt-BR" style="margin-top:44px;font-size:38px;line-height:1.5;text-align:justify;hyphens:auto;display:flex;flex-direction:column;gap:24px">
          ${lista(c.enunciado).map(p => `<p style="margin:0">${rico(p)}</p>`).join('')}
          ${c.comando ? `<p style="margin:0"><b>${rico(c.comando)}</b></p>` : ''}
        </div>
        <div style="margin-top:auto;padding-top:40px;text-align:center;${F.anton};font-size:110px;line-height:1">QUAL É A PEÇA?</div>
      </div>`,
  };
}

export function renderCarrossel(c) {
  const autoral = c.tipo === 'autoral';
  const capa = (c.capa === 'B' ? capaB : capaA)(c, autoral);
  let slides;
  if (autoral) slides = [capa, casoAutoral(c)];
  else if (c.quebra) {  // enunciado longo demais para um slide: parágrafos [0, quebra) no 2º, o resto no 3º
    const ps = lista(c.enunciado);
    slides = [capa, enunciadoTreino(c, ps.slice(0, c.quebra), 2, 3, false), enunciadoTreino(c, ps.slice(c.quebra), 3, 3, true)];
  } else slides = [capa, enunciadoTreino(c)];
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Young+Serif&family=Alfa+Slab+One&family=Anton&family=Poppins:ital,wght@0,400;0,500;0,700;1,400&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box}body{margin:0;font-family:Poppins,sans-serif}</style></head><body>
<div id="painel" style="position:relative;width:${slides.length * 1080}px;height:1350px;overflow:hidden">
${slides.map((s, i) => `<div id="slide-${i + 1}" style="position:absolute;left:${i * 1080}px;top:0;width:1080px;height:1350px;overflow:hidden;background:${s.bg}">${s.html}</div>`).join('\n')}
</div></body></html>`;
  return { html, total: slides.length };
}
