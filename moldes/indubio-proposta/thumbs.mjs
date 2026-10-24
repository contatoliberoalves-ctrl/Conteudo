// Miniaturas de YouTube (1280×720) usadas como bônus nas propostas. Uma série só: fundo escuro ou papel com
// granulado, título condensado (Anton) com uma palavra em vermelho, e à direita um objeto real do tema
// (folha de prova, cartão-resposta, texto de lei grifado). Com "foto" (recorte PNG sem fundo, em fotos/),
// a pessoa entra no lugar do objeto.
const FONTES = 'https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@500;600;700;800&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap';
const A = "font-family:'Anton',sans-serif;text-transform:uppercase;letter-spacing:-.005em";
const I = "font-family:'Inter',sans-serif";
const S = "font-family:'Source Serif 4',serif";
const COR = { tinta: '#101114', papel: '#EFEBE2', vermelho: '#E5352B', grifo: 'rgba(255,214,0,.55)' };
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const lista = v => (v == null ? [] : Array.isArray(v) ? v : [v]);
const rico = s => esc(s).replace(/\[\[(.+?)\]\]/g, `<span style="color:${COR.vermelho}">$1</span>`);
// ==texto== sai grifado (marca-texto), usado nos trechos de lei.
const grifa = s => esc(s).replace(/==(.+?)==/g, `<mark style="background:linear-gradient(transparent 12%,${COR.grifo} 12%,${COR.grifo} 88%,transparent 88%);color:inherit;padding:0 2px">$1</mark>`);

const fundo = escuro => escuro
  ? `<div style="position:absolute;inset:0;background:radial-gradient(70% 90% at 78% 40%,#262830 0%,${COR.tinta} 70%)"></div>
     <div style="position:absolute;inset:0;background-image:url(../assets/grao.png);background-size:400px;opacity:.45;mix-blend-mode:overlay"></div>`
  : `<div style="position:absolute;inset:0;background:radial-gradient(80% 90% at 75% 40%,#F7F4EE 0%,${COR.papel} 75%)"></div>
     <div style="position:absolute;inset:0;background-image:url(../assets/grao.png);background-size:400px;opacity:.22;mix-blend-mode:multiply"></div>`;
const kicker = (t, escuro) => `<div style="display:flex;align-items:center;gap:16px;${I};font-weight:700;font-size:24px;letter-spacing:.2em;text-transform:uppercase;color:${escuro ? '#B9BAC0' : '#55534E'}"><span style="width:44px;height:4px;background:${COR.vermelho}"></span>${esc(t)}</div>`;
const titulo = (linhas, escuro, px) => `<div style="${A};font-size:${px}px;line-height:1.02;color:${escuro ? '#fff' : COR.tinta};margin-top:26px">${lista(linhas).map(rico).join('<br>')}</div>`;
const texto = (t, escuro) => `<div style="position:absolute;left:72px;top:${t.top || 92}px;width:${t.foto ? 700 : t.largura || 640}px">${kicker(t.kicker, escuro)}${titulo(t.linhas, escuro, t.px || 118)}
  ${t.sub ? `<div style="display:inline-block;margin-top:26px;${I};font-weight:700;font-size:34px;color:${escuro ? COR.tinta : '#fff'};background:${escuro ? '#fff' : COR.tinta};padding:10px 22px;border-radius:6px">${esc(t.sub)}</div>` : ''}</div>`;
const pessoa = (src, escuro) => `${escuro ? `<div style="position:absolute;right:-80px;bottom:-200px;width:760px;height:760px;border-radius:50%;background:radial-gradient(circle,rgba(229,53,43,.28) 0%,transparent 65%)"></div>` : ''}
  <img src="${src}" style="position:absolute;right:10px;bottom:0;height:700px;filter:drop-shadow(0 20px 40px rgba(0,0,0,.35))">`;
// Folha branca com sombra, levemente girada.
const folha = (html, { w = 470, h = 560, r = 3, right = 70, top = 90 } = {}) => `<div style="position:absolute;right:${right}px;top:${top}px;width:${w}px;height:${h}px;background:#fff;border-radius:6px;transform:rotate(${r}deg);box-shadow:0 30px 60px rgba(0,0,0,.35),0 2px 6px rgba(0,0,0,.2);overflow:hidden">${html}</div>`;
const linhas = (n, cor = '#D9D6CF', larg = [92, 86, 95, 70, 90, 82, 94, 60]) => Array.from({ length: n }, (_, i) => `<div style="height:12px;width:${larg[i % larg.length]}%;background:${cor};border-radius:3px;margin-bottom:20px"></div>`).join('');
const lei = (ref, corpo) => `<div style="padding:40px 40px 0">
  <div style="${I};font-weight:700;font-size:15px;letter-spacing:.18em;text-transform:uppercase;color:#8A867D;margin-bottom:18px">${esc(ref)}</div>
  <div style="${S};font-size:27px;line-height:1.5;color:#1E1E22">${grifa(corpo)}</div></div>`;

const OBJETOS = {
  // Folha da peça corrigida: linhas de texto e a nota 0,00 de 5,00 circulada em caneta vermelha.
  zera: () => folha(`<div style="padding:38px 40px">
      <div style="display:flex;justify-content:space-between;${I};font-weight:700;font-size:15px;letter-spacing:.16em;text-transform:uppercase;color:#8A867D;margin-bottom:30px"><span>Peça profissional</span><span>Folha 1</span></div>
      ${linhas(9)}</div>
    <div style="position:absolute;right:34px;bottom:40px;width:260px;height:170px;display:flex;align-items:center;justify-content:center;transform:rotate(-7deg)">
      <svg viewBox="0 0 260 170" style="position:absolute;inset:0" fill="none" stroke="${COR.vermelho}" stroke-width="5" stroke-linecap="round"><path d="M40 92C30 40 120 18 190 30c60 12 62 82 10 112-50 28-150 22-168-26C25 94 50 60 92 50"/></svg>
      <span style="${A};font-size:92px;color:${COR.vermelho}">0,00</span></div>
`, { r: 4 }),
  // Cartão-resposta com alternativas A–D marcadas.
  gabaritar: () => folha(`<div style="padding:36px 44px">
      <div style="${I};font-weight:700;font-size:15px;letter-spacing:.16em;text-transform:uppercase;color:#8A867D;margin-bottom:26px">Folha de respostas</div>
      ${[1, 3, 0, 2, 1, 3, 2].map((m, i) => `<div style="display:flex;align-items:center;gap:22px;margin-bottom:20px"><span style="${I};font-weight:700;font-size:20px;color:#8A867D;width:34px">${String(i + 1).padStart(2, '0')}</span>
        ${'ABCD'.split('').map((l, j) => `<span style="width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;${I};font-weight:700;font-size:20px;${j === m ? `background:${COR.tinta};color:#fff` : 'border:2.5px solid #CFCBC2;color:#A5A199'}">${l}</span>`).join('')}
        <svg viewBox="0 0 24 24" width="36" fill="none" stroke="${COR.vermelho}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6"/></svg></div>`).join('')}</div>`, { r: -3, h: 600, top: 70 }),
  // Enunciado com as pistas grifadas.
  identificacao: () => folha(`<div style="padding:40px 40px">
      <div style="${I};font-weight:700;font-size:15px;letter-spacing:.16em;text-transform:uppercase;color:#8A867D;margin-bottom:28px">Enunciado</div>
      ${[[92], [40, 'rgba(255,214,0,.75)', 44], [95], [70], [30, 'rgba(255,214,0,.75)', 52], [86], [94], [55, 'rgba(255,214,0,.75)', 30], [80]].map(([w, g, gw]) => `<div style="position:relative;height:12px;width:${w + (gw || 0)}%;margin-bottom:22px"><div style="position:absolute;left:0;top:0;height:12px;width:${g ? w / (w + gw) * 100 : 100}%;background:#D9D6CF;border-radius:3px"></div>${g ? `<div style="position:absolute;right:0;top:-8px;height:28px;width:${gw / (w + gw) * 100 - 2}%;background:${g};border-radius:3px"></div><div style="position:absolute;right:6px;top:0;height:12px;width:${gw / (w + gw) * 100 - 6}%;background:#9C988F;border-radius:3px"></div>` : ''}</div>`).join('')}</div>`, { r: 3, h: 540, top: 100 }),
  adi: () => folha(lei('CF/88 · Art. 102, I, a', 'Compete ao Supremo Tribunal Federal (...) processar e julgar, originariamente: a) a ==ação direta de inconstitucionalidade== de ==lei ou ato normativo federal ou estadual== (...)'), { r: 3, h: 520, top: 100 }),
  ms: () => folha(lei('Lei 12.016/2009 · Art. 1º', 'Conceder-se-á mandado de segurança para proteger ==direito líquido e certo==, não amparado por habeas corpus ou habeas data, sempre que, ==ilegalmente ou com abuso de poder== (...) por parte de ==autoridade== (...)'), { r: -3, h: 540, top: 90 }),
  // A conta da nota da 2ª fase, como num quadro de resultado.
  pontuacao: () => folha(`<div style="padding:34px 40px">
      <div style="${I};font-weight:700;font-size:15px;letter-spacing:.16em;text-transform:uppercase;color:#8A867D;margin-bottom:10px">Nota final · 2ª fase</div>
      ${[['Peça profissional', '5,00'], ['4 questões × 1,25', '5,00']].map(([a, b]) => `<div style="display:flex;justify-content:space-between;align-items:baseline;padding:16px 0;border-bottom:2px solid #E6E2D9"><span style="${I};font-weight:600;font-size:26px;color:#3C3B38">${a}</span><span style="${A};font-size:58px;color:${COR.tinta}">${b}</span></div>`).join('')}
      <div style="display:flex;justify-content:space-between;align-items:baseline;padding:20px 0"><span style="${I};font-weight:800;font-size:26px;color:${COR.tinta}">Total</span><span style="${A};font-size:58px;color:${COR.tinta}">10,00</span></div>
      <div style="margin-top:10px;display:flex;justify-content:space-between;align-items:center;background:${COR.tinta};color:#fff;border-radius:8px;padding:18px 22px"><span style="${I};font-weight:700;font-size:22px;letter-spacing:.06em">Aprovação</span><span style="${A};font-size:52px;color:#fff">6,00</span></div></div>`, { r: -2, h: 580, top: 70 }),
};

export function htmlThumb(t) {
  const escuro = !!t.escuro;
  return `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="${FONTES}"><style>*{box-sizing:border-box}html,body{margin:0;width:1280px;height:720px;overflow:hidden}</style></head>
<body><div style="position:relative;width:1280px;height:720px;overflow:hidden">${fundo(escuro)}
  ${t.foto ? pessoa(t.foto, escuro) : OBJETOS[t.objeto]()}
  ${texto(t, escuro)}</div></body></html>`;
}
