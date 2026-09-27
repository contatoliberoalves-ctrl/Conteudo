// Molde "Post Libero" (@liberofilho): post de tela única (1080×1350) no visual do Carrossel Libero.
// Layouts ("layout" no post):
//   dados    — título + gráfico de barras horizontais (ranking, estatística), com a fonte no pé;
//   material — "Material gratuito": título grande, apostila em pé na direita e o balão "Comente #X";
//   pdf      — página do PDF inclinada no centro, com os tópicos, e a caixa de comentário "Comente #X";
//   estrutura — estrutura da peça numa folha de petição (endereçamento, qualificação, tópicos em romanos);
//   esqueleto — estrutura da peça em trilha numerada, com o endereçamento em destaque.
// "linhas" é o título na imagem (lista de linhas); "titulo" é o nome do post na galeria.
// Marcação: **negrito** e [[caixa]] (palavra com fundo sólido, só nos títulos), como no Carrossel Libero.
import { COR, TEMAS, TITULO, PERFIL, esc, rico, lista, textura } from '../carrossel-libero/template.mjs';

const selo = (t, fundo) => `<div style="position:absolute;left:110px;bottom:72px;background:${fundo || (t === TEMAS.blue ? COR.navyFundo : COR.azul)};color:#fff;font-size:30px;font-weight:700;padding:8px 18px;z-index:6">${PERFIL}</div>`;
const ttl = (linhas, t, px, extra = '') => `<h1 data-titulo style="${TITULO};margin:0;font-size:${px}px;line-height:${lista(linhas).some(l => l.includes('[[')) ? 1.06 : .9};color:${t.tit}${extra}">${lista(linhas).map(l => rico(l, t)).join('<br>')}</h1>`;
const kicker = (txt, t) => txt ? `<div style="font-size:28px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:${t.kicker}">${esc(txt)}</div>` : '';
// Tamanho do título pela linha mais longa (Big Shoulders 900 ≈ 0,46 em por letra).
const tam = (linhas, base, largura) => Math.min(base, Math.floor(largura / (Math.max(...lista(linhas).map(l => l.replace(/\[\[|\]\]|\*\*/g, '').length), 1) * 0.46)));

const LAYOUTS = {
  dados(p, t) {
    const barras = lista(p.barras), max = Math.max(...barras.map(b => +b.valor), 1);
    const alto = Math.min(78, Math.floor(600 / Math.max(barras.length, 1)));
    const linhas = barras.map((b, i) => {
      const topo = +b.valor === max, cor = topo ? COR.vermelho : t.escuro ? COR.azulClaro : COR.azul;
      return `<div style="display:grid;grid-template-columns:330px 1fr;align-items:center;gap:22px;height:${alto}px">
        <span data-corpo style="font-size:${Math.min(34, alto * .46)}px;font-weight:700;line-height:1.05;color:${t.txt};text-align:right">${rico(b.rotulo, t)}</span>
        <div style="display:flex;align-items:center;gap:16px"><span style="display:block;height:${Math.round(alto * .62)}px;width:${Math.round(b.valor / max * 100) * 4.4}px;background:${cor}"></span>
        <span style="${TITULO};font-size:${Math.round(alto * .7)}px;line-height:1;color:${topo ? COR.vermelho : t.tit}">${esc(b.valor)}${esc(p.unidade ?? '×')}</span></div></div>`;
    }).join('');
    return `<div data-area style="position:absolute;left:110px;right:110px;top:130px;bottom:160px;display:flex;flex-direction:column;gap:20px;z-index:3">
        ${kicker(p.kicker, t)}${ttl((p.linhas || p.titulo), t, p.ts || tam((p.linhas || p.titulo), 130, 860))}
        ${p.sub ? `<div data-corpo style="font-size:36px;font-weight:600;color:${t.txt};opacity:.9">${rico(p.sub, t)}</div>` : ''}
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:18px;border-top:3px solid ${t.linha};padding-top:26px">${linhas}</div>
      </div>
      ${p.fonte ? `<div style="position:absolute;right:110px;bottom:70px;width:560px;text-align:right;font-size:21px;font-weight:600;line-height:1.3;color:${t.txt};opacity:.7;z-index:6">${rico(p.fonte, t)}</div>` : ''}${selo(t)}`;
  },
  material(p, t) {
    const capa = p.apostila || {};
    return `<div style="position:absolute;left:110px;top:130px;transform:rotate(-3deg);background:${COR.vermelho};color:#fff;font-size:34px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;padding:14px 26px;z-index:4">${esc(p.selo || 'Material gratuito')}</div>
      <div data-area style="position:absolute;left:110px;right:110px;top:230px;bottom:740px;display:flex;flex-direction:column;justify-content:center;gap:18px;z-index:3">
        ${ttl((p.linhas || p.titulo), t, p.ts || tam((p.linhas || p.titulo), 125, 860))}
        ${p.sub ? `<div data-corpo style="font-size:38px;font-weight:600;color:${t.txt}">${rico(p.sub, t)}</div>` : ''}
      </div>
      <div data-objeto style="position:absolute;right:90px;top:690px;width:410px;height:520px;transform:rotate(7deg);z-index:2">
        <div style="position:absolute;inset:0;transform:translate(26px,18px) rotate(3deg);background:#D9DEE8;box-shadow:0 20px 40px rgba(8,16,40,.3)"></div>
        <div style="position:absolute;inset:0;transform:translate(13px,9px) rotate(1.5deg);background:#E8EBF1"></div>
        <div style="position:absolute;inset:0;background:#fff;box-shadow:0 30px 60px rgba(8,16,40,.35);padding:44px 40px;display:flex;flex-direction:column;gap:22px">
          <div style="font-size:20px;font-weight:700;letter-spacing:.12em;color:${COR.azul}">${PERFIL}</div>
          <div style="height:10px;width:90px;background:${COR.azul}"></div>
          <div style="${TITULO};font-size:${capa.ts || 64}px;line-height:.92;color:${COR.navy}">${lista(capa.titulo || (p.linhas || p.titulo)).map(l => esc(l.replace(/\[\[|\]\]/g, ''))).join('<br>')}</div>
          <div style="margin-top:auto;display:flex;justify-content:space-between;align-items:flex-end"><span style="font-size:20px;font-weight:700;color:${COR.navy};opacity:.6">${esc(capa.rodape || '2ª fase OAB · Constitucional')}</span><span style="background:${COR.vermelho};color:#fff;font-size:22px;font-weight:800;padding:6px 12px">PDF</span></div>
        </div>
      </div>
      <div style="position:absolute;left:110px;top:900px;width:470px;background:${COR.navyFundo};border-radius:48px 48px 48px 0;padding:40px 44px;z-index:4">
        <div style="font-size:36px;font-weight:600;line-height:1.2;color:#fff">Comente</div>
        <div style="${TITULO};font-size:${Math.min(96, Math.floor(390 / (String(p.hashtag).length * .5)))}px;line-height:1;color:${COR.azulClaro};margin:6px 0 10px">${esc(p.hashtag)}</div>
        <div style="font-size:32px;font-weight:600;line-height:1.2;color:#fff">${esc(p.chamada || 'pra receber no direct')}</div>
      </div>${selo(t)}`;
  },
  pdf(p, t) {
    const itens = lista(p.itens);
    return `<div data-area style="position:absolute;left:110px;right:110px;top:120px;bottom:840px;display:flex;flex-direction:column;justify-content:flex-start;gap:16px;z-index:3">
        <div style="display:flex;gap:16px;align-items:center">${p.selo ? `<span style="background:${COR.vermelho};color:#fff;font-size:28px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;padding:10px 18px">${esc(p.selo)}</span>` : ''}${kicker(p.kicker, t)}</div>
        ${ttl((p.linhas || p.titulo), t, p.ts || tam((p.linhas || p.titulo), 128, 860))}
        ${p.sub ? `<div data-corpo style="font-size:40px;font-weight:700;color:${COR.navy}">${rico(p.sub, t)}</div>` : ''}
      </div>
      <div data-objeto style="position:absolute;left:170px;right:170px;top:560px;height:470px;transform:rotate(-3deg);background:#fff;box-shadow:0 30px 70px rgba(8,16,40,.28);padding:44px 48px;z-index:2;overflow:hidden">
        <span style="position:absolute;right:0;top:0;background:${COR.vermelho};color:#fff;font-size:24px;font-weight:800;padding:10px 18px">PDF</span>
        <div style="${TITULO};font-size:48px;line-height:1;color:${COR.azul};margin-bottom:24px">${esc(p.pagina || lista((p.linhas || p.titulo)).join(' ').replace(/\[\[|\]\]/g, ''))}</div>
        ${itens.map(it => `<div style="display:flex;align-items:center;gap:18px;padding:11px 0;border-top:2px solid #E4E7EE"><span style="flex:none;width:320px;font-size:23px;font-weight:800;color:${COR.navy}">${esc(it)}</span><span style="flex:1;display:flex;flex-direction:column;gap:8px"><span style="height:9px;width:100%;background:#DCE1EA;border-radius:5px"></span><span style="height:9px;width:70%;background:#E7EAF0;border-radius:5px"></span></span></div>`).join('')}
        <div style="position:absolute;left:0;right:0;bottom:0;height:160px;background:linear-gradient(180deg,rgba(255,255,255,0),#fff)"></div>
      </div>
      <div style="position:absolute;left:110px;right:110px;top:1080px;display:flex;align-items:center;gap:18px;background:#fff;border:3px solid ${COR.navy};border-radius:60px;padding:14px 16px 14px 34px;z-index:4">
        <span style="flex:1;font-size:36px;font-weight:600;color:${COR.navy}">Comente <b style="font-weight:800;color:${COR.azul}">${esc(p.hashtag)}</b></span>
        <span style="background:${COR.azul};color:#fff;font-size:28px;font-weight:800;border-radius:40px;padding:14px 26px;white-space:nowrap">${esc(p.botao || 'Enviar ➤')}</span>
      </div>
      <div style="position:absolute;right:110px;bottom:80px;font-size:28px;font-weight:700;color:${t.txt};z-index:6">${esc(p.chamada || 'e receba o PDF no direct')}</div>${selo(t)}`;
  },
};

// Estrutura das peças (dados puxados do molde Estrutura de Peças pelo render: enderecamento, qualificacao,
// topicos, valor). "Dos Fatos (art. X)" vira título + detalhe menor.
const partes = tp => { const i = tp.indexOf(' ('); return i > 0 ? [tp.slice(0, i), tp.slice(i + 2).replace(/\)$/, '')] : [tp, '']; };
const ROMANO = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
Object.assign(LAYOUTS, {
  // Folha de petição: endereçamento, qualificação, tópicos em romanos e fechamento.
  estrutura(p, t) {
    const tops = lista(p.topicos), px = tops.length > 7 ? 30 : 33;
    const linha = (rot, txt) => `<div style="display:flex;flex-direction:column;gap:4px"><span style="font-size:19px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:${COR.vermelho}">${esc(rot)}</span><span data-corpo style="font-size:25px;font-weight:600;line-height:1.25;color:${COR.navy}">${rico(txt, t)}</span></div>`;
    return `<div data-area style="position:absolute;left:110px;right:110px;top:70px;bottom:1015px;padding-bottom:16px;display:flex;flex-direction:column;justify-content:flex-end;gap:12px;z-index:3">
        <span style="align-self:flex-start;background:${COR.navy};color:#fff;font-size:26px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;padding:8px 16px">${esc(p.selo || 'Estrutura da peça')}</span>
        ${(l => ttl(l, t, p.ts || tam(l, 120, 860)))([lista(p.linhas || p.titulo).join(' ')])}
      </div>
      <div data-area style="position:absolute;left:90px;right:90px;top:345px;bottom:150px;background:#fff;box-shadow:0 30px 70px rgba(8,16,40,.22);padding:40px 48px 36px 76px;display:flex;flex-direction:column;gap:18px;z-index:2">
        <span style="position:absolute;left:46px;top:0;bottom:0;width:3px;background:${COR.vermelho};opacity:.55"></span>
        ${linha('Endereçamento', p.enderecamento)}
        ${linha('Qualificação', p.qualificacao)}
        <div style="display:flex;flex-direction:column;gap:${tops.length > 7 ? 10 : 14}px;border-top:2px solid #E4E7EE;padding-top:16px">
          ${tops.map((tp, i) => { const [a, b] = partes(tp); return `<div style="display:flex;gap:16px;align-items:baseline"><span style="flex:none;width:52px;${TITULO};font-size:${px + 4}px;color:${COR.azul}">${ROMANO[i] || i + 1}</span><div><span data-corpo style="font-size:${px}px;font-weight:800;line-height:1.15;color:${COR.navy}">${rico(a, t)}</span>${b ? `<span data-corpo style="display:block;font-size:${px - 9}px;font-weight:600;line-height:1.2;color:${COR.azul}">${rico(b, t)}</span>` : ''}</div></div>`; }).join('')}
        </div>
        ${p.valor ? `<div style="margin-top:auto;border-top:2px solid #E4E7EE;padding-top:14px;display:flex;justify-content:space-between;font-size:22px;font-weight:700;color:${COR.navy}"><span>${esc(p.valor)}</span><span style="opacity:.6">Local, data · Advogado · OAB</span></div>` : ''}
      </div>${selo(t)}`;
  },
  // Esqueleto em trilha: endereçamento em destaque e os tópicos como paradas numeradas.
  esqueleto(p, t) {
    const tops = lista(p.topicos), n = tops.length + (p.valor ? 1 : 0);
    const alto = Math.min(110, Math.floor(700 / Math.max(n, 1)));
    const paradas = [...tops, ...(p.valor ? [p.valor] : [])].map((tp, i) => {
      const [a, b] = partes(tp), fim = i === tops.length;
      return `<div style="position:relative;display:flex;gap:28px;align-items:center;min-height:${alto}px">
        <span style="flex:none;width:64px;height:64px;border-radius:50%;background:${fim ? COR.vermelho : COR.azul};color:#fff;display:flex;align-items:center;justify-content:center;${TITULO};font-size:36px;z-index:1">${fim ? '✓' : String(i + 1).padStart(2, '0')}</span>
        <div><span data-corpo style="font-size:${n > 8 ? 32 : 36}px;font-weight:800;line-height:1.1;color:#fff">${rico(a, t)}</span>${b ? `<span data-corpo style="display:block;font-size:${n > 8 ? 23 : 26}px;font-weight:600;line-height:1.2;color:${COR.azulClaro}">${rico(b, t)}</span>` : ''}</div></div>`;
    }).join('');
    return `<div data-area style="position:absolute;left:110px;right:110px;top:110px;bottom:190px;display:flex;flex-direction:column;gap:22px;z-index:3">
        ${kicker(p.kicker || 'Esqueleto da peça', t)}
        ${ttl(p.linhas || p.titulo, t, p.ts || tam(p.linhas || p.titulo, 130, 860))}
        <div style="background:${COR.azul};padding:18px 24px;display:flex;flex-direction:column;gap:4px"><span style="font-size:20px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:${COR.off}">Endereçamento</span><span data-corpo style="font-size:28px;font-weight:700;line-height:1.2;color:#fff">${rico(p.enderecamento, t)}</span></div>
        <div style="position:relative;display:flex;flex-direction:column;gap:6px;margin-top:6px">
          <span style="position:absolute;left:31px;top:30px;bottom:30px;width:3px;background:rgba(255,255,255,.25)"></span>
          ${paradas}
        </div>
      </div>${selo(t)}`;
  },
});

export function renderCarrossel(p) {
  const avisos = [];
  const t = TEMAS[p.tema] || TEMAS.blue;
  const f = LAYOUTS[p.layout];
  if (!f) avisos.push(`layout "${p.layout}" não existe (use ${Object.keys(LAYOUTS).join(', ')})`);
  if (!TEMAS[p.tema]) avisos.push(`tema "${p.tema}" não existe (use blue, light ou dark)`);
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@900&family=Schibsted+Grotesk:wght@500;600;700;800&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box}body{margin:0;font-family:'Schibsted Grotesk',sans-serif;-webkit-font-smoothing:antialiased}</style></head><body>
<div id="painel" style="position:relative;width:1080px;height:1350px">
<div id="slide-1" style="position:absolute;left:0;top:0;width:1080px;height:1350px;overflow:hidden;background:${t.bg}">${f ? f(p, t) : ''}${textura(t)}</div>
</div></body></html>`;
  return { html, total: 1, avisos };
}
