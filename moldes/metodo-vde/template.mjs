// Molde "Método VDE" (Mentoria de Natália Valença e Líbero Filho): slides de AULA 1920×1080.
// Capa, divisores e fechamento no degradê roxo → índigo do caderno da mentoria; páginas internas quase sempre
// brancas (faixa fina em degradê no topo) ou lavanda clarinho. Poppins em tudo. Detalhes discretos: arcos finos
// no canto, números em quadradinhos com degradê e rodapé com os dois perfis. Gerado por libero-comum/render-base.mjs.

const W = 1920, H = 1080;
const COR = {
  roxo: '#2E0575', indigo: '#1937B1', meio: '#261C8C', lavanda: '#C9B8FF', lavandaClara: '#F2EEFF',
  borda: '#E4DDFB', tinta: '#1A1340', cinza: '#5B5875', vermelho: '#E5486A',
};
const DEGRADE = `linear-gradient(180deg,${COR.roxo} 0%,${COR.meio} 45%,${COR.indigo} 100%)`;
const DEG_H = `linear-gradient(90deg,${COR.roxo},${COR.indigo})`;
const TEMAS = {
  degrade: { bg: DEGRADE, tit: '#fff', txt: '#ECE8FF', kicker: COR.lavanda, acento: COR.lavanda, linha: 'rgba(255,255,255,.22)', cartao: 'rgba(255,255,255,.08)', escuro: true },
  branco: { bg: '#FFFFFF', tit: COR.tinta, txt: COR.tinta, kicker: COR.indigo, acento: COR.roxo, linha: COR.borda, cartao: '#fff', escuro: false },
  lavanda: { bg: COR.lavandaClara, tit: COR.tinta, txt: COR.tinta, kicker: COR.indigo, acento: COR.roxo, linha: '#D9D0F7', cartao: '#fff', escuro: false },
};
const PERFIS = '@nataliavalenca · @liberofilho';
const FONTE = "font-family:'Poppins','Noto Color Emoji',sans-serif";
const TITULO = `${FONTE};font-weight:800;letter-spacing:-.02em`;

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const lista = v => (v == null ? [] : Array.isArray(v) ? v : [v]);
// **negrito** e [[destaque]] (palavra em lavanda no degradê, em degradê de texto nas páginas claras).
const rico = (s, t) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b style="font-weight:700">$1</b>')
  .replace(/\[\[(.+?)\]\]/g, t.escuro ? `<span style="color:${COR.lavanda}">$1</span>`
    : `<span style="background:${DEG_H};-webkit-background-clip:text;background-clip:text;color:transparent">$1</span>`);
const linhas = (v, t) => lista(v).map(l => rico(l, t)).join('<br>');
const kick = (txt, t) => txt ? `<div style="${FONTE};font-size:26px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:${t.kicker}">${esc(txt)}</div>` : '';
const barra = t => `<span style="display:block;width:100px;height:8px;border-radius:4px;background:${t.escuro ? COR.lavanda : DEG_H};flex:none"></span>`;
const pilula = (txt, t) => txt ? `<span style="align-self:flex-start;background:${t.escuro ? 'rgba(255,255,255,.14)' : COR.lavandaClara};color:${t.escuro ? '#fff' : COR.roxo};border:2px solid ${t.escuro ? 'rgba(255,255,255,.28)' : COR.borda};border-radius:999px;padding:12px 30px;${FONTE};font-size:28px;font-weight:600">${esc(txt)}</span>` : '';
// Título que encolhe até caber (data-fit); "alt" é a altura máxima.
const tit = (s, t, px, alt) => lista(s.titulo).length ? `<div data-fit="${esc(lista(s.titulo).join(' '))}" data-min="56" style="${TITULO};font-size:${s.ts || px}px;line-height:1.05;color:${t.tit};max-height:${alt}px;overflow:hidden">${linhas(s.titulo, t)}</div>` : '';
const par = (v, t) => lista(v).map(p => `<p style="margin:0 0 .7em;${FONTE};font-weight:400;line-height:1.45;color:${t.txt};text-wrap:pretty">${rico(p, t)}</p>`).join('');
const faixa = t => t.escuro ? '' : `<div style="position:absolute;left:0;right:0;top:0;height:12px;background:${DEG_H};z-index:4"></div>`;
// Arcos finos concêntricos saindo de um canto (o detalhe da capa do caderno).
function arcos(t, lado = 'direita', y = 540, n = 6) {
  const cor = t.escuro ? 'rgba(201,184,255,.28)' : 'rgba(46,5,117,.10)';
  const cx = lado === 'direita' ? W + 260 : -260;
  return `<svg width="${W}" height="${H}" style="position:absolute;inset:0;z-index:1;pointer-events:none">${Array.from({ length: n }, (_, k) => `<circle cx="${cx}" cy="${y}" r="${420 + k * 46}" fill="none" stroke="${cor}" stroke-width="2"/>`).join('')}</svg>`;
}
const rodape = t => `<div style="position:absolute;left:120px;right:120px;bottom:44px;display:flex;justify-content:space-between;align-items:center;${FONTE};font-size:24px;font-weight:500;color:${t.escuro ? 'rgba(255,255,255,.75)' : COR.cinza};z-index:6">
    <span>${PERFIS}</span><span style="font-weight:700;letter-spacing:.14em;color:${t.kicker}">MÉTODO VDE</span></div>`;
// Número num quadradinho (degradê nas páginas claras, translúcido no degradê).
const numero = (n, t, tam = 84) => `<span style="flex:none;width:${tam}px;height:${tam}px;border-radius:${Math.round(tam * .26)}px;background:${t.escuro ? 'rgba(255,255,255,.14)' : DEG_H};color:#fff;display:flex;align-items:center;justify-content:center;${FONTE};font-weight:700;font-size:${Math.round(tam * .4)}px">${esc(n)}</span>`;
const topo = (s, t, px = 92) => `<div style="position:absolute;left:120px;right:120px;top:90px;display:flex;flex-direction:column;gap:12px;z-index:3">${kick(s.kicker, t)}${tit(s, t, px, 220)}</div>`;

const TIPOS = {
  // Capa: kicker, título grande, texto e pílula; arcos à direita.
  capa(s, t) {
    return `${arcos(t, 'direita', 560, 7)}
    <div style="position:absolute;left:120px;top:110px;bottom:150px;width:1300px;display:flex;flex-direction:column;justify-content:center;gap:30px;z-index:3">
      ${kick(s.kicker, t)}${tit(s, t, 150, 520)}${barra(t)}
      ${s.texto ? `<div style="font-size:40px;max-width:1150px">${par(s.texto, t)}</div>` : ''}${pilula(s.pilula, t)}
    </div>${rodape(t)}`;
  },
  // Divisor de parte: número grande em contorno e título.
  secao(s, t) {
    return `${arcos(t, 'direita', 540, 6)}
    <div style="position:absolute;left:120px;top:50%;transform:translateY(-50%);${TITULO};font-size:${s.tn || 420}px;line-height:.9;color:transparent;-webkit-text-stroke:4px ${t.escuro ? 'rgba(201,184,255,.7)' : COR.roxo};z-index:2">${esc(s.numero)}</div>
    <div style="position:absolute;left:${s.recuo || 120 + Math.round(String(s.numero ?? '').length * (s.tn || 420) * .62) + 60}px;right:160px;top:150px;bottom:150px;display:flex;flex-direction:column;justify-content:center;gap:26px;z-index:3">
      ${kick(s.kicker, t)}${tit(s, t, 120, 460)}${s.texto ? `<div style="font-size:38px">${par(s.texto, t)}</div>` : ''}${pilula(s.pilula, t)}
    </div>${rodape(t)}`;
  },
  // Duas colunas: título à esquerda, texto à direita.
  texto(s, t) {
    return `<div style="position:absolute;left:120px;top:140px;bottom:150px;width:680px;display:flex;flex-direction:column;justify-content:center;gap:26px;z-index:3">
      ${kick(s.kicker, t)}${tit(s, t, 100, 520)}${barra(t)}${pilula(s.pilula, t)}
    </div>
    <div data-fit="texto" data-min="26" style="position:absolute;left:900px;right:120px;top:140px;bottom:150px;display:flex;flex-direction:column;justify-content:center;font-size:${s.corpo || 40}px;overflow:hidden;z-index:3">${par(s.texto, t)}</div>${rodape(t)}`;
  },
  // Cards (número ou ícone, rótulo, título e texto) em grade.
  cards(s, t) {
    const cs = lista(s.cards), cols = s.colunas || (cs.length > 4 ? 3 : cs.length > 3 ? 2 : cs.length);
    const card = (k, i) => `<div style="display:flex;flex-direction:column;align-items:flex-start;gap:16px;background:${t.cartao};border:2px solid ${t.escuro ? 'rgba(255,255,255,.18)' : COR.borda};border-radius:28px;padding:34px 36px;box-shadow:${t.escuro ? 'none' : '0 14px 30px rgba(46,5,117,.07)'}">
        ${numero(k.icone || String(i + 1).padStart(2, '0'), t, 72)}
        ${k.rotulo ? `<span style="font-size:.58em;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:${t.kicker}">${esc(k.rotulo)}</span>` : ''}
        <span style="font-weight:700;line-height:1.2;color:${t.tit}">${rico(k.titulo, t)}</span>
        ${k.texto ? `<span style="font-size:.74em;font-weight:400;line-height:1.4;color:${t.escuro ? t.txt : COR.cinza}">${rico(k.texto, t)}</span>` : ''}</div>`;
    return `${topo(s, t)}
    <div data-fit="cards" data-min="22" style="position:absolute;left:120px;right:120px;top:${s.titulo ? 320 : 180}px;bottom:130px;display:grid;grid-template-columns:repeat(${cols},1fr);gap:28px;align-content:center;${FONTE};font-size:${s.corpo || 36}px;overflow:hidden;z-index:3">${cs.map(card).join('')}</div>${rodape(t)}`;
  },
  // Lei literal num quadro à direita; título e tradução à esquerda.
  lei(s, t) {
    return `<div style="position:absolute;left:120px;top:140px;bottom:150px;width:700px;display:flex;flex-direction:column;justify-content:center;gap:26px;z-index:3">
      ${kick(s.kicker, t)}${tit(s, t, 96, 420)}${barra(t)}
      ${s.traducao ? `<div data-fit="tradução" data-min="24" style="font-size:36px;max-height:320px;overflow:hidden">${par(s.traducao, t)}</div>` : ''}
    </div>
    <div style="position:absolute;left:900px;right:120px;top:140px;bottom:150px;display:flex;align-items:center;z-index:3">
      <div data-fit="citação" data-min="26" style="position:relative;max-height:100%;overflow:hidden;background:${t.escuro ? 'rgba(255,255,255,.08)' : COR.lavandaClara};border:2px solid ${t.escuro ? 'rgba(255,255,255,.2)' : COR.borda};border-radius:32px;padding:56px 60px;${FONTE};font-size:${s.corpo || 40}px;font-weight:500;line-height:1.45;color:${t.txt}">
        <div style="${TITULO};font-size:150px;line-height:.6;height:56px;color:${t.escuro ? COR.lavanda : COR.roxo};opacity:.5">“</div>${rico(s.citacao, t)}
        ${s.fonte ? `<div style="margin-top:22px;font-size:.6em;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${t.kicker}">${esc(s.fonte)}</div>` : ''}
      </div></div>${rodape(t)}`;
  },
  // Lista numerada: título à esquerda, itens à direita com o número no quadradinho.
  lista(s, t) {
    const itens = lista(s.itens).map((it, i) => `<div style="display:flex;gap:28px;align-items:center;padding-bottom:22px;border-bottom:2px solid ${t.linha}">
      ${numero(String(i + 1 + (s.inicio || 0)).padStart(2, '0'), t, 64)}<span style="font-weight:400;line-height:1.35;color:${t.txt}">${rico(it, t)}</span></div>`).join('');
    return `<div style="position:absolute;left:120px;top:140px;bottom:150px;width:620px;display:flex;flex-direction:column;justify-content:center;gap:26px;z-index:3">
      ${kick(s.kicker, t)}${tit(s, t, 100, 520)}${barra(t)}
    </div>
    <div data-fit="lista" data-min="24" style="position:absolute;left:840px;right:120px;top:130px;bottom:140px;display:flex;flex-direction:column;justify-content:center;gap:24px;${FONTE};font-size:${s.corpo || 38}px;overflow:hidden;z-index:3">${itens}</div>${rodape(t)}`;
  },
  // Comparação: dois cartões (o primeiro em degradê) com o selo VS.
  comparar(s, t) {
    const lado = (l, i) => {
      const forte = i === 0;
      return `<div style="background:${forte ? DEGRADE : '#fff'};border:${forte ? 0 : `2px solid ${COR.borda}`};border-radius:36px;padding:48px 52px;display:flex;flex-direction:column;gap:18px;box-shadow:0 20px 44px rgba(46,5,117,.14)">
        ${l.rotulo ? `<div style="font-size:.6em;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:${forte ? COR.lavanda : COR.indigo}">${esc(l.rotulo)}</div>` : ''}
        <div style="${TITULO};font-size:1.7em;line-height:1.05;color:${forte ? '#fff' : COR.tinta}">${esc(l.titulo)}</div>
        ${lista(l.itens).map(x => `<div style="display:flex;gap:16px;align-items:baseline;color:${forte ? '#ECE8FF' : COR.tinta};line-height:1.4"><span style="flex:none;width:12px;height:12px;border-radius:3px;background:${forte ? COR.lavanda : DEG_H};transform:translateY(-3px)"></span><span>${rico(x, forte ? TEMAS.degrade : TEMAS.branco)}</span></div>`).join('')}
      </div>`;
    };
    return `${topo(s, t)}
    <div data-fit="comparação" data-min="22" style="position:absolute;left:120px;right:120px;top:${s.titulo ? 320 : 170}px;bottom:130px;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;${FONTE};font-size:${s.corpo || 34}px;overflow:hidden;z-index:3">${lista(s.lados).slice(0, 2).map(lado).join('')}</div>
    <div style="position:absolute;left:50%;top:${s.titulo ? 615 : 540}px;transform:translate(-50%,-50%);width:120px;height:120px;border-radius:50%;background:#fff;border:6px solid ${COR.lavanda};display:flex;align-items:center;justify-content:center;${TITULO};font-size:42px;color:${COR.roxo};box-shadow:0 12px 30px rgba(46,5,117,.25);z-index:5">VS</div>${rodape(t)}`;
  },
  // Tabela: "colunas" (cabeçalho) e "linhas" (listas de células).
  tabela(s, t) {
    const cols = lista(s.colunas);
    return `${topo(s, t)}
    <div data-fit="tabela" data-min="20" style="position:absolute;left:120px;right:120px;top:${s.titulo ? 310 : 170}px;bottom:130px;display:flex;align-items:center;${FONTE};font-size:${s.corpo || 32}px;overflow:hidden;z-index:3">
      <table style="width:100%;border-collapse:separate;border-spacing:0 10px">
        <tr>${cols.map((c, i) => `<th style="background:${DEG_H};background-size:${cols.length * 100}% 100%;background-position:${cols.length > 1 ? i / (cols.length - 1) * 100 : 0}% 0;color:#fff;text-align:left;padding:18px 26px;font-size:.74em;font-weight:600;letter-spacing:.1em;text-transform:uppercase;${i === 0 ? 'border-radius:16px 0 0 16px;' : ''}${i === cols.length - 1 ? 'border-radius:0 16px 16px 0;' : ''}">${esc(c)}</th>`).join('')}</tr>
        ${lista(s.linhas).map(l => `<tr>${lista(l).map((c, i) => `<td style="background:${t.escuro ? 'rgba(255,255,255,.08)' : COR.lavandaClara};color:${t.txt};padding:18px 26px;line-height:1.35;vertical-align:top;font-weight:${i === 0 ? 700 : 400};${i === 0 ? 'border-radius:16px 0 0 16px;' : ''}${i === l.length - 1 ? 'border-radius:0 16px 16px 0;' : ''}">${rico(c, t)}</td>`).join('')}</tr>`).join('')}
      </table></div>${rodape(t)}`;
  },
  // Teste rápido: enunciado e alternativas; com "gabarito": true, a "correta" (0 = A) fica marcada.
  questao(s, t) {
    const alts = lista(s.alternativas);
    return `${topo(s, t, 80)}
    <div data-fit="questão" data-min="22" style="position:absolute;left:120px;right:120px;top:${s.titulo ? 270 : 180}px;bottom:130px;display:flex;flex-direction:column;justify-content:center;gap:18px;${FONTE};font-size:${s.corpo || 34}px;overflow:hidden;z-index:3">
      <div style="font-weight:500;line-height:1.45;color:${t.txt};margin-bottom:12px">${rico(s.enunciado, t)}</div>
      ${alts.map((a, i) => {
        const certa = s.gabarito && i === s.correta, errada = s.gabarito && i !== s.correta;
        return `<div style="display:flex;gap:24px;align-items:center;background:${certa ? DEG_H : t.escuro ? 'rgba(255,255,255,.08)' : '#fff'};border:2px solid ${certa ? 'transparent' : t.escuro ? 'rgba(255,255,255,.2)' : COR.borda};border-radius:22px;padding:16px 26px;opacity:${errada ? .45 : 1}">
          <span style="flex:none;width:58px;height:58px;border-radius:16px;background:${certa ? '#fff' : t.escuro ? 'rgba(255,255,255,.14)' : COR.lavandaClara};color:${COR.roxo};display:flex;align-items:center;justify-content:center;font-weight:700">${certa ? '✓' : 'ABCDE'[i]}</span>
          <span style="font-weight:500;line-height:1.35;color:${certa ? '#fff' : t.txt}">${rico(a, t)}</span></div>`;
      }).join('')}
    </div>${rodape(t)}`;
  },
  // Atenção / pegadinha: balão com a borda em degradê.
  balao(s, t) {
    return `<div style="position:absolute;left:120px;top:140px;bottom:150px;width:560px;display:flex;flex-direction:column;justify-content:center;gap:26px;z-index:3">${kick(s.kicker, t)}${tit(s, t, 100, 460)}${barra(t)}</div>
    <div style="position:absolute;left:780px;right:140px;top:160px;bottom:170px;display:flex;align-items:center;z-index:3">
      <div style="position:relative;max-height:100%;padding:6px;border-radius:56px 56px 56px 0;background:${DEG_H}">
        <div data-fit="balão" data-min="26" style="max-height:640px;overflow:hidden;background:#fff;border-radius:50px 50px 50px 0;padding:70px 70px 56px;${FONTE};font-size:${s.corpo || 42}px">
          ${lista(s.texto).map(p => `<p style="margin:0 0 .5em;font-weight:500;line-height:1.4;color:${COR.tinta}">${rico(p, TEMAS.branco)}</p>`).join('')}
        </div></div></div>${rodape(t)}`;
  },
  // Fechamento: título, texto e botão.
  fim(s, t) {
    return `${arcos(t, 'direita', 540, 7)}
    <div style="position:absolute;left:120px;top:140px;bottom:150px;width:1250px;display:flex;flex-direction:column;justify-content:center;gap:30px;z-index:3">
      ${kick(s.kicker, t)}${tit(s, t, 140, 440)}${barra(t)}${s.texto ? `<div style="font-size:40px">${par(s.texto, t)}</div>` : ''}
      ${s.botao ? `<span style="align-self:flex-start;background:${t.escuro ? '#fff' : DEG_H};color:${t.escuro ? COR.roxo : '#fff'};border-radius:999px;padding:22px 44px;${FONTE};font-size:34px;font-weight:700">${esc(s.botao)}</span>` : ''}
    </div>${rodape(t)}`;
  },
};

export function renderCarrossel(c) {
  const slides = lista(c.slides), avisos = [];
  slides.forEach((s, i) => {
    if (!TEMAS[s.tema]) avisos.push(`slide ${i + 1}: tema "${s.tema}" não existe (use ${Object.keys(TEMAS).join(', ')})`);
    if (!TIPOS[s.tipo]) avisos.push(`slide ${i + 1}: tipo "${s.tipo}" não existe (${Object.keys(TIPOS).join(', ')})`);
  });
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box}body{margin:0;${FONTE};-webkit-font-smoothing:antialiased}section{position:relative;width:${W}px;height:${H}px;overflow:hidden}</style></head><body>
${slides.map((s, i) => {
    const t = TEMAS[s.tema] || TEMAS.branco;
    return `<section id="slide-${i + 1}" style="background:${t.bg}">${faixa(t)}${(TIPOS[s.tipo] || TIPOS.texto)(s, t)}</section>`;
  }).join('\n')}
</body></html>`;
  return { html, total: slides.length, avisos, largura: W, altura: H };
}
