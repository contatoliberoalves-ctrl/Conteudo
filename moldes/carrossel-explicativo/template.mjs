// Modelo visual do "Carrossel Explicativo": capa com foto, 4 ou 5 slides de conteúdo e CTA.
// Gera um painel com todos os slides lado a lado (N × 1080 por 1350). Regras em README.md.
const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const lista = v => (v == null ? [] : Array.isArray(v) ? v : [v]);

const COR = {
  verde: '#3b4c49', cartao: '#2f3d3a', base: '#1c1f1e', gelo: '#f6f7f6',
  texto: '#1f2a28', claro: '#9be0a3', medio: '#3f9a4d',
};
const bebas = `font-family:'Bebas Neue',sans-serif;font-weight:400`;
const HANDLE = '@CONSTITUCIONALGABARITADO';
// Ritmo de fundos dos slides de conteúdo: 2 claros, 2 verdes, 1 claro.
const RITMO = ['claro', 'claro', 'verde', 'verde', 'claro'];

// **negrito** → <b>, depois de escapar o texto.
const rico = (s, corNegrito) => esc(s).replace(/\*\*(.+?)\*\*/g, `<b style="font-weight:700;color:${corNegrito}">$1</b>`);

// Tamanho de fonte Bebas para caber na largura útil (888px), dentro de [min, max].
const caber = (linhas, max, min, largura = 888) => {
  const n = Math.max(...linhas.map(l => l.length), 1);
  return Math.max(min, Math.min(max, Math.floor(largura / (n * 0.42))));
};

function handle(cor, posicao) {
  return `<div style="position:absolute;left:0;right:0;${posicao};text-align:center;font-size:24px;font-weight:500;letter-spacing:1px;color:${cor}">${HANDLE}</div>`;
}

function capa(c) {
  const destaque = lista(c.destaque).map(l => l.toUpperCase());
  const tam = caber(destaque, 300, 120, 836);
  const apoio = lista(c.apoio);
  return `
  <img src="${esc(c.foto)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${esc(c.fotoPos || 'center top')}">
  <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(28,31,30,0) 45%,rgba(28,31,30,.85) 68%,${COR.base} 82%)"></div>
  ${c.elemento ? `<div style="position:absolute;top:130px;right:96px;${bebas};font-size:120px;line-height:.9;color:${COR.claro}">${esc(c.elemento)}</div>` : ''}
  <div data-bloco style="position:absolute;left:96px;right:96px;bottom:150px;display:flex;flex-direction:column;align-items:flex-start;gap:26px">
    ${c.etiqueta ? `<span style="background:#fff;color:${COR.verde};padding:12px 24px;border-radius:999px;font-size:24px;font-weight:700;letter-spacing:2px;text-transform:uppercase">${esc(c.etiqueta)}</span>` : ''}
    ${apoio.length ? `<div style="${bebas};font-size:${caber(apoio, 112, 90)}px;line-height:.9;color:#fff;margin-top:6px;text-shadow:0 2px 18px rgba(20,22,21,.55)">${apoio.map(esc).join('<br>')}</div>` : ''}
    <div style="display:flex;flex-direction:column;align-items:flex-start;gap:14px;margin-top:4px">
      ${destaque.map(l => `<span style="display:inline-block;${bebas};font-size:${tam}px;line-height:.9;color:${COR.base};background:${COR.claro};padding:16px 26px 0;border-radius:10px;transform:rotate(-2deg)">${esc(l)}</span>`).join('')}
    </div>
    ${c.subtitulo ? `<div style="display:flex;flex-direction:column;gap:18px;margin-top:10px"><span style="width:96px;height:6px;background:${COR.claro}"></span><span style="font-size:52px;font-weight:500;line-height:1.2;color:#fff;text-wrap:pretty;text-shadow:0 2px 14px rgba(20,22,21,.55)">${esc(c.subtitulo)}</span></div>` : ''}
  </div>
  ${handle('rgba(255,255,255,.85)', 'bottom:64px')}`;
}

function conteudo(s, k) {
  const fundo = s.fundo || RITMO[k % RITMO.length];
  const escuro = fundo === 'verde';
  const direita = (s.alinhamento || (k % 2 ? 'direita' : 'esquerda')) === 'direita';
  const T = escuro
    ? { bg: COR.verde, txt: 'rgba(255,255,255,.92)', tit: '#fff', acento: COR.claro, negrito: COR.claro, marca: 'rgba(155,224,163,.16)', handle: 'rgba(255,255,255,.85)' }
    : { bg: COR.gelo, txt: COR.texto, tit: COR.verde, acento: COR.verde, negrito: COR.texto, marca: 'rgba(59,76,73,.08)', handle: COR.verde };
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
  const rotulo = texto => `<span style="flex:0 0 auto;${bebas};font-size:64px;line-height:.9;color:${escuro ? COR.claro : COR.verde};min-width:44px;margin-top:2px">${texto}</span>`;
  const numero = i => rotulo(String(i + 1).padStart(2, '0'));
  // "inicio": continua a contagem de letras/romanos quando a lista segue de um slide anterior.
  const letra = i => rotulo('ABCDEFGH'[i + (s.inicio || 0)]);
  const romano = i => rotulo(['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][i + (s.inicio || 0)]);
  const paragrafos = arr => arr.map(p => `<p style="margin:0;font-size:${cp ? 42 : 46}px;line-height:${cp ? 1.35 : 1.4};color:${T.txt};max-width:888px;text-wrap:pretty">${rico(p, T.negrito)}</p>`).join('');

  return {
    bg: T.bg,
    html: `
  ${s.marca ? `<div style="position:absolute;${direita ? 'left:-40px' : 'right:-40px'};bottom:40px;${bebas};font-size:300px;line-height:.8;white-space:nowrap;color:${T.marca}">${esc(s.marca)}</div>` : ''}
  ${s.figura ? `<img src="${esc(s.figura)}" style="position:absolute;${direita ? 'left:-60px' : 'right:-60px'};bottom:80px;height:560px;object-fit:contain">` : ''}
  ${handle(T.handle, 'top:64px')}
  <div data-bloco style="position:absolute;left:96px;right:96px;top:${cp ? 130 : 150}px;bottom:${cp ? 110 : 130}px;display:flex;flex-direction:column;justify-content:center;gap:${cp ? 28 : 40}px;${alinhar}">
    ${s.barra === false ? '' : `<span style="width:80px;height:6px;background:${T.acento};flex:0 0 auto"></span>`}
    ${titulo.length ? `<div style="${bebas};font-size:${caber(titulo, cp ? 150 : 200, 110)}px;line-height:.88;color:${T.tit}">${titulo.map(esc).join('<br>')}</div>` : ''}
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

function cta(c) {
  const branco = c.cartao === 'branco';
  return `
  ${handle('rgba(255,255,255,.85)', 'top:64px')}
  <div data-bloco style="position:absolute;left:140px;right:140px;top:300px;border-radius:36px;padding:72px 64px;background:${branco ? '#fff' : COR.cartao};box-shadow:0 30px 80px rgba(20,26,24,.35);display:flex;flex-direction:column;align-items:center;gap:36px;text-align:center">
    <span style="width:80px;height:6px;background:${branco ? COR.medio : COR.claro}"></span>
    <div style="${bebas};font-size:${caber([c.pergunta || ''], 120, 96, 660)}px;line-height:.9;color:${branco ? COR.verde : '#fff'};text-wrap:balance">${esc((c.pergunta || 'Gostou da explicação?').toUpperCase())}</div>
    <div style="font-size:38px;font-weight:700;line-height:1.3;color:${branco ? COR.medio : COR.claro};text-wrap:balance">${esc(c.chamada || 'Salva pra revisar depois')}</div>
  </div>
  <div style="position:absolute;left:50%;bottom:130px;width:140px;height:140px;margin-left:-70px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 16px 40px rgba(20,26,24,.3)">
    <img src="../assets/logo.png" style="width:118px;height:118px;object-fit:contain">
  </div>`;
}

export function renderCarrossel(c) {
  const slides = [
    { bg: COR.base, html: capa(c) },
    ...lista(c.slides).map(conteudo),
    { bg: c.cta?.fundo || COR.verde, html: cta(c.cta || {}) },
  ];
  const total = slides.length;
  const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box}body{margin:0;font-family:Poppins,sans-serif}</style></head><body>
<div id="painel" style="position:relative;width:${total * 1080}px;height:1350px;overflow:hidden">
${slides.map((s, i) => `<div id="slide-${i + 1}" style="position:absolute;left:${i * 1080}px;top:0;width:1080px;height:1350px;overflow:hidden;background:${s.bg}">${s.html}</div>`).join('\n')}
</div></body></html>`;
  return { html, total };
}
