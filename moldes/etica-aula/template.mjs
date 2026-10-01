// Molde "Ética Aula" (@eticagabaritadanaoba), slides de AULA 1920×1080 na identidade do Carrossel Ética:
// degradê rosa → vinho, fundo branco (com a faixa em degradê no topo) e rosa clarinho; títulos em Big Shoulders,
// kicker com ✦, pílulas, cards de missão, anel de progresso e anéis rosa. Gerado por libero-comum/render-base.mjs.
import { COR, TEMAS, TITULO, PERFIL, esc, lista, textura } from '../carrossel-etica/template.mjs';

const W = 1920, H = 1080;
const TEXTO = "font-family:'Schibsted Grotesk','Noto Color Emoji',sans-serif";
// **negrito** e [[caixa]] (palavra com fundo, nos títulos).
const rico = (s, t) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b style="font-weight:800">$1</b>')
  .replace(/\[\[(.+?)\]\]/g, `<span style="background:${t.caixaBg};color:${t.caixaFg};padding:0 .12em;border-radius:.12em;box-decoration-break:clone;-webkit-box-decoration-break:clone">$1</span>`);
const linhas = (v, t) => lista(v).map(l => rico(l, t)).join('<br>');
const kick = (txt, t) => txt ? `<div style="${TEXTO};font-size:28px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:${t.kicker}">✦ ${esc(txt)}</div>` : '';
const barra = t => `<span style="display:block;width:110px;height:12px;border-radius:6px;background:${t.acento}"></span>`;
const pilula = (txt, t) => txt ? `<span style="align-self:flex-start;background:${t.escuro ? 'rgba(255,255,255,.16)' : COR.rosaClaro};color:${t.escuro ? '#fff' : COR.vinho};border-radius:999px;padding:14px 32px;${TEXTO};font-size:30px;font-weight:700">${esc(txt)}</span>` : '';
// Título que encolhe até caber na caixa (data-fit); "alt" é a altura máxima.
const tit = (s, t, px, alt, extra = '') => lista(s.titulo).length ? `<div data-fit="${esc(lista(s.titulo).join(' '))}" data-min="60" style="${TITULO};font-size:${s.ts || px}px;line-height:${lista(s.titulo).some(l => l.includes('[[')) ? 1.06 : .88};padding-top:.06em;color:${t.tit};max-height:${alt}px;overflow:hidden${extra}">${linhas(s.titulo, t)}</div>` : '';
const par = (v, t, px) => lista(v).map(p => `<p style="margin:0 0 .7em;${TEXTO};font-weight:500;line-height:1.32;color:${t.txt};text-wrap:pretty">${rico(p, t)}</p>`).join('');
const faixa = t => t.escuro ? '' : `<div style="position:absolute;left:0;right:0;top:0;height:16px;background:linear-gradient(90deg,${COR.rosa},${COR.vinho});z-index:4"></div>`;
const rodape = t => `<div style="position:absolute;left:120px;bottom:50px;${TEXTO};font-size:26px;font-weight:600;letter-spacing:.08em;color:${t.txt};z-index:6">${PERFIL}</div>
  <div style="position:absolute;right:120px;bottom:50px;${TEXTO};font-size:26px;font-weight:600;letter-spacing:.08em;color:${t.kicker};z-index:6">✦ Ética Gabaritada</div>`;
const selo = t => `<div style="position:absolute;left:120px;bottom:56px;background:${t.caixaBg};color:${t.caixaFg};border-radius:999px;${TEXTO};font-size:28px;font-weight:700;padding:10px 26px;z-index:6">${PERFIL}</div>`;
const anel = (x, y, d, borda, cor) => `<div style="position:absolute;left:${x}px;top:${y}px;width:${d}px;height:${d}px;border:${borda}px solid ${cor};border-radius:50%;z-index:1"></div>`;
function progresso(p, t, tam) {
  if (!p) return '';
  const v = Math.max(0, Math.min(100, Number(p.valor) || 0)), r = tam / 2 - 20, circ = 2 * Math.PI * r;
  return `<div style="position:relative;width:${tam}px;height:${tam}px;flex:none">
    <svg width="${tam}" height="${tam}" style="position:absolute;inset:0;transform:rotate(-90deg)"><circle cx="${tam / 2}" cy="${tam / 2}" r="${r}" fill="none" stroke="${t.escuro ? 'rgba(255,255,255,.22)' : COR.rosaClaro}" stroke-width="28"/>
    <circle cx="${tam / 2}" cy="${tam / 2}" r="${r}" fill="none" stroke="${t.escuro ? '#fff' : COR.magenta}" stroke-width="28" stroke-linecap="round" stroke-dasharray="${circ * v / 100} ${circ}"/></svg>
    <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;color:${t.tit};text-align:center">
      <div style="${TITULO};font-size:${Math.round(tam * .3)}px;line-height:.9">${esc(p.texto ?? v + '%')}</div>
      ${p.rotulo ? `<div style="${TEXTO};font-size:${Math.round(tam * .07)}px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${t.kicker};max-width:${tam - 80}px">${esc(p.rotulo)}</div>` : ''}
    </div></div>`;
}
// Cabeçalho padrão das páginas internas: kicker e título no alto, à esquerda.
const topo = (s, t, px = 110) => `<div style="position:absolute;left:120px;right:120px;top:96px;display:flex;flex-direction:column;gap:14px;z-index:3">${kick(s.kicker, t)}${tit(s, t, px, 220)}</div>`;
const card = (k, t, vertical) => `<div style="display:flex;${vertical ? 'flex-direction:column;align-items:flex-start;padding:40px 40px 46px !important;' : 'align-items:center;'}gap:30px;background:${t.cartao};border:2px solid ${t.escuro ? 'rgba(255,255,255,.18)' : '#F3D9E4'};border-left:12px solid ${t.escuro ? COR.rosaSuave : COR.magenta};border-radius:28px;padding:30px 36px">
    ${k.icone ? `<span style="flex:none;width:110px;height:110px;border-radius:28px;background:${t.escuro ? 'rgba(255,255,255,.16)' : COR.rosaClaro};display:flex;align-items:center;justify-content:center;font-size:58px">${esc(k.icone)}</span>` : ''}
    <div style="display:flex;flex-direction:column;gap:6px">
      ${k.rotulo ? `<span style="font-size:.6em;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${t.kicker}">${esc(k.rotulo)}</span>` : ''}
      <span style="font-weight:800;line-height:1.15;color:${t.tit}">${rico(k.titulo, t)}</span>
      ${k.texto ? `<span style="font-size:.78em;font-weight:500;line-height:1.3;color:${t.escuro ? t.txt : COR.cinza}">${rico(k.texto, t)}</span>` : ''}
    </div></div>`;

const TIPOS = {
  // Capa: título enorme à esquerda, subtítulo e pílula; anel de progresso (ou anéis) à direita.
  capa(s, t) {
    return `${anel(1560, -260, 560, 90, t.anel)}${anel(-260, 760, 420, 70, t.anel)}
    <div style="position:absolute;left:120px;top:120px;bottom:170px;width:${s.progresso ? 1180 : 1500}px;display:flex;flex-direction:column;justify-content:center;gap:30px;z-index:3">
      ${kick(s.kicker, t)}${tit(s, t, 230, 560)}
      ${s.texto ? `<div style="font-size:44px;max-width:1100px">${par(s.texto, t)}</div>` : ''}${pilula(s.pilula, t)}
    </div>
    ${s.progresso ? `<div style="position:absolute;right:170px;top:50%;transform:translateY(-50%);z-index:3">${progresso(s.progresso, t, 440)}</div>` : ''}
    ${selo(t)}`;
  },
  // Divisor de parte: número vazado gigante à esquerda, título à direita.
  secao(s, t) {
    return `<div style="position:absolute;left:60px;top:50%;transform:translateY(-50%);${TITULO};font-size:${s.tn || 720}px;line-height:.8;color:transparent;-webkit-text-stroke:8px ${t.escuro ? 'rgba(255,255,255,.55)' : COR.magenta};z-index:2">${esc(s.numero)}</div>
    <div style="position:absolute;left:${s.recuo || 120 + Math.round(String(s.numero ?? '').length * (s.tn || 720) * .47) + 60}px;right:120px;top:150px;bottom:170px;display:flex;flex-direction:column;justify-content:center;gap:28px;z-index:3">
      ${kick(s.kicker, t)}${tit(s, t, 170, 520)}${s.texto ? `<div style="font-size:40px">${par(s.texto, t)}</div>` : ''}${pilula(s.pilula, t)}
    </div>${rodape(t)}`;
  },
  // Duas colunas: título à esquerda (com barra), texto à direita.
  texto(s, t) {
    return `<div style="position:absolute;left:120px;top:150px;bottom:170px;width:680px;display:flex;flex-direction:column;justify-content:center;gap:26px;z-index:3">
      ${kick(s.kicker, t)}${tit(s, t, 150, 520)}${barra(t)}${pilula(s.pilula, t)}
    </div>
    <div data-fit="texto" data-min="28" style="position:absolute;left:920px;right:120px;top:150px;bottom:170px;display:flex;flex-direction:column;justify-content:center;font-size:${s.corpo || 44}px;overflow:hidden;z-index:3">${par(s.texto, t)}</div>${rodape(t)}`;
  },
  // Cards de missão (ícone, rótulo, título, texto) em grade.
  missao(s, t) {
    const cards = lista(s.cards), cols = s.colunas || (cards.length > 3 ? 2 : cards.length);
    return `${topo(s, t)}
    <div data-fit="cards" data-min="24" style="position:absolute;left:120px;right:120px;top:${s.titulo ? 360 : 200}px;bottom:150px;display:grid;grid-template-columns:repeat(${cols},1fr);gap:30px;align-content:center;${TEXTO};font-size:${s.corpo || (cols > 2 ? 44 : 48)}px;overflow:hidden;z-index:3">${cards.map(k => card(k, t, cols > 2)).join('')}</div>${rodape(t)}`;
  },
  // Lei literal num quadro à direita, título e tradução à esquerda.
  lei(s, t) {
    const quadro = t.escuro ? 'rgba(255,255,255,.1)' : COR.rosaClaro;
    return `<div style="position:absolute;left:120px;top:150px;bottom:170px;width:700px;display:flex;flex-direction:column;justify-content:center;gap:26px;z-index:3">
      ${kick(s.kicker, t)}${tit(s, t, 140, 440)}${barra(t)}
      ${s.traducao ? `<div data-fit="tradução" data-min="26" style="font-size:38px;max-height:300px;overflow:hidden">${par(s.traducao, t)}</div>` : ''}
    </div>
    <div style="position:absolute;left:900px;right:120px;top:150px;bottom:170px;display:flex;align-items:center;z-index:3">
      <div data-fit="citação" data-min="28" style="position:relative;max-height:100%;overflow:hidden;background:${quadro};border-left:14px solid ${t.acento};border-radius:0 36px 36px 0;padding:60px 64px;${TEXTO};font-size:${s.corpo || 44}px;font-weight:700;line-height:1.35;color:${t.txt}">
        <div style="${TITULO};font-size:200px;line-height:.6;height:70px;color:${t.acento};opacity:.6">“</div>${rico(s.citacao, t)}
        ${s.fonte ? `<div style="margin-top:24px;font-size:.62em;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${t.kicker}">${esc(s.fonte)}</div>` : ''}
      </div></div>${rodape(t)}`;
  },
  // Lista numerada: título à esquerda, itens à direita (ou em duas colunas com "colunas": 2).
  lista(s, t) {
    const romano = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const marca = k => s.marcador === 'romano' ? romano[k] : s.marcador === 'letra' ? 'abcdefghij'[k] + ')' : String(k + 1).padStart(2, '0');
    const itens = lista(s.itens).map((it, i) => `<div style="display:flex;gap:30px;align-items:baseline;padding-bottom:22px;border-bottom:2px solid ${t.linha};break-inside:avoid">
      <span style="flex:none;min-width:56px;font-size:.72em;font-weight:800;color:${t.num}">${marca(i + (s.inicio || 0))}</span>
      <span style="font-weight:500;line-height:1.3;color:${t.txt}">${rico(it, t)}</span></div>`).join('');
    return `<div style="position:absolute;left:120px;top:150px;bottom:170px;width:620px;display:flex;flex-direction:column;justify-content:center;gap:26px;z-index:3">
      ${kick(s.kicker, t)}${tit(s, t, 140, 520)}${barra(t)}
    </div>
    <div data-fit="lista" data-min="24" style="position:absolute;left:840px;right:120px;top:130px;bottom:150px;display:flex;flex-direction:column;justify-content:center;gap:24px;${TEXTO};font-size:${s.corpo || 40}px;overflow:hidden;z-index:3">${itens}</div>${rodape(t)}`;
  },
  // Comparação em dois cartões com o selo VS no meio.
  comparar(s, t) {
    const lado = (l, i) => {
      const escuro = i === 0;
      const [bg, cor, sub] = escuro ? [`linear-gradient(160deg,${COR.magenta},${COR.vinho})`, '#fff', COR.rosaSuave] : ['#fff', COR.vinho, COR.magenta];
      return `<div style="background:${bg};border-radius:40px;padding:50px 56px;display:flex;flex-direction:column;gap:20px;${escuro ? '' : `border:3px solid #F1D2DF`};box-shadow:0 24px 50px rgba(58,13,33,.18)">
        ${l.rotulo ? `<div style="font-size:.62em;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${sub}">${esc(l.rotulo)}</div>` : ''}
        <div style="${TITULO};font-size:2.2em;line-height:.9;color:${cor}">${esc(l.titulo)}</div>
        ${lista(l.itens).map(x => `<div style="display:flex;gap:18px;align-items:baseline;color:${escuro ? '#FDEEF4' : COR.tinta};line-height:1.3;font-weight:500"><span style="color:${sub};font-weight:800">✦</span><span>${rico(x, escuro ? TEMAS.degrade : TEMAS.branco)}</span></div>`).join('')}
      </div>`;
    };
    return `${topo(s, t)}
    <div data-fit="comparação" data-min="24" style="position:absolute;left:120px;right:120px;top:${s.titulo ? 350 : 180}px;bottom:150px;display:grid;grid-template-columns:1fr 1fr;gap:90px;align-items:center;${TEXTO};font-size:${s.corpo || 38}px;overflow:hidden;z-index:3">${lista(s.lados).slice(0, 2).map(lado).join('')}</div>
    <div style="position:absolute;left:50%;top:${s.titulo ? 650 : 560}px;transform:translate(-50%,-50%) rotate(-8deg);width:170px;height:170px;border-radius:50%;background:${COR.vinho};border:10px solid ${COR.rosaSuave};display:flex;align-items:center;justify-content:center;${TITULO};font-size:84px;color:#fff;box-shadow:0 16px 40px rgba(58,13,33,.35);z-index:5">VS</div>${rodape(t)}`;
  },
  // Tabela: "colunas" (cabeçalho) e "linhas" (listas de células). Primeira coluna em destaque.
  tabela(s, t) {
    const cols = lista(s.colunas);
    const cab = escuro => escuro ? ['#fff', COR.vinho] : [COR.vinho, '#fff'];
    const [cbg, cfg] = cab(t.escuro);
    return `${topo(s, t)}
    <div data-fit="tabela" data-min="22" style="position:absolute;left:120px;right:120px;top:${s.titulo ? 340 : 180}px;bottom:140px;display:flex;align-items:center;${TEXTO};font-size:${s.corpo || 34}px;overflow:hidden;z-index:3">
      <table style="width:100%;border-collapse:separate;border-spacing:0 12px">
        <tr>${cols.map((c, i) => `<th style="background:${cbg};color:${cfg};text-align:left;padding:18px 28px;font-size:.78em;letter-spacing:.1em;text-transform:uppercase;${i === 0 ? 'border-radius:18px 0 0 18px;' : ''}${i === cols.length - 1 ? 'border-radius:0 18px 18px 0;' : ''}">${esc(c)}</th>`).join('')}</tr>
        ${lista(s.linhas).map(l => `<tr>${lista(l).map((c, i) => `<td style="background:${t.escuro ? 'rgba(255,255,255,.1)' : COR.rosaClaro};color:${i === 0 ? t.tit : t.txt};padding:20px 28px;line-height:1.28;vertical-align:top;${i === 0 ? `font-weight:800;border-radius:18px 0 0 18px;` : 'font-weight:500;'}${i === l.length - 1 ? 'border-radius:0 18px 18px 0;' : ''}">${rico(c, t)}</td>`).join('')}</tr>`).join('')}
      </table></div>${rodape(t)}`;
  },
  // Teste rápido: enunciado e alternativas; com "gabarito": true, a "correta" (0 = A) fica marcada.
  questao(s, t) {
    const alts = lista(s.alternativas);
    return `${topo(s, t, 90)}
    <div data-fit="questão" data-min="24" style="position:absolute;left:120px;right:120px;top:${s.titulo ? 300 : 200}px;bottom:150px;display:flex;flex-direction:column;justify-content:center;gap:22px;${TEXTO};font-size:${s.corpo || 38}px;overflow:hidden;z-index:3">
      <div style="font-weight:600;line-height:1.32;color:${t.txt};margin-bottom:10px">${rico(s.enunciado, t)}</div>
      ${alts.map((a, i) => {
        const certa = s.gabarito && i === s.correta, errada = s.gabarito && i !== s.correta;
        const bg = certa ? COR.vinho : t.escuro ? 'rgba(255,255,255,.1)' : '#fff';
        return `<div style="display:flex;gap:26px;align-items:center;background:${bg};border:3px solid ${certa ? COR.vinho : t.escuro ? 'rgba(255,255,255,.2)' : '#F1D2DF'};border-radius:24px;padding:18px 28px;opacity:${errada ? .5 : 1}">
          <span style="flex:none;width:64px;height:64px;border-radius:18px;background:${certa ? '#fff' : t.escuro ? 'rgba(255,255,255,.16)' : COR.rosaClaro};color:${COR.vinho};display:flex;align-items:center;justify-content:center;font-weight:800">${certa ? '✓' : 'ABCDE'[i]}</span>
          <span style="font-weight:500;line-height:1.3;color:${certa ? '#fff' : t.txt}">${rico(a, t)}</span></div>`;
      }).join('')}
    </div>${rodape(t)}`;
  },
  // Pegadinha: balão de mensagem grande.
  balao(s, t) {
    const [bg, fg, ponto] = t.escuro ? ['#fff', COR.tinta, COR.magenta] : [COR.vinho, '#fff', COR.rosaSuave];
    return `<div style="position:absolute;left:120px;top:150px;bottom:170px;width:560px;display:flex;flex-direction:column;justify-content:center;gap:26px;z-index:3">${kick(s.kicker, t)}${tit(s, t, 150, 480)}${barra(t)}</div>
    <div style="position:absolute;left:780px;right:140px;top:170px;bottom:190px;display:flex;align-items:center;z-index:3">
      <div data-fit="balão" data-min="28" style="position:relative;max-height:100%;overflow:hidden;background:${bg};border-radius:64px 64px 64px 0;padding:90px 76px 70px;${TEXTO};font-size:${s.corpo || 48}px">
        <div style="position:absolute;top:36px;right:52px;display:flex;gap:14px">${`<span style="width:24px;height:24px;border-radius:50%;background:${ponto}"></span>`.repeat(3)}</div>
        ${lista(s.texto).map(p => `<p style="margin:0 0 .5em;font-weight:500;line-height:1.3;color:${fg}">${rico(p, t)}</p>`).join('')}
      </div></div>${rodape(t)}`;
  },
  // Fechamento: título, texto, botão e anel de progresso.
  fim(s, t) {
    const [bg, fg] = t.escuro ? ['#fff', COR.vinho] : [COR.vinho, '#fff'];
    return `${anel(1500, 620, 620, 90, t.anel)}
    <div style="position:absolute;left:120px;top:150px;bottom:170px;width:1150px;display:flex;flex-direction:column;justify-content:center;gap:30px;z-index:3">
      ${kick(s.kicker, t)}${tit(s, t, 190, 460)}${barra(t)}${s.texto ? `<div style="font-size:44px">${par(s.texto, t)}</div>` : ''}
      ${s.botao ? `<span style="align-self:flex-start;background:${bg};color:${fg};border-radius:44px 44px 44px 0;padding:24px 44px;${TEXTO};font-size:40px;font-weight:800">${esc(s.botao)}</span>` : ''}
    </div>
    ${s.progresso ? `<div style="position:absolute;right:220px;top:140px;z-index:3">${progresso(s.progresso, t, 380)}</div>` : ''}${selo(t)}`;
  },
};

export function renderCarrossel(c) {
  const slides = lista(c.slides), avisos = [];
  slides.forEach((s, i) => {
    if (!TEMAS[s.tema]) avisos.push(`slide ${i + 1}: tema "${s.tema}" não existe (use ${Object.keys(TEMAS).join(', ')})`);
    if (!TIPOS[s.tipo]) avisos.push(`slide ${i + 1}: tipo "${s.tipo}" não existe (${Object.keys(TIPOS).join(', ')})`);
  });
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@900&family=Schibsted+Grotesk:wght@500;600;700;800&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box}body{margin:0;${TEXTO};-webkit-font-smoothing:antialiased}section{position:relative;width:${W}px;height:${H}px;overflow:hidden}</style></head><body>
${slides.map((s, i) => {
    const t = TEMAS[s.tema] || TEMAS.degrade;
    return `<section id="slide-${i + 1}" style="background:${t.bg}">${faixa(t)}${(TIPOS[s.tipo] || TIPOS.texto)(s, t)}${textura(t)}</section>`;
  }).join('\n')}
</body></html>`;
  return { html, total: slides.length, avisos, largura: W, altura: H };
}
