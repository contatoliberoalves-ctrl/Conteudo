// Molde "Mapas Mentais · Constitucional com Líbero": A4 horizontal (1123×794 px = 297×210 mm).
// Capa em degradê verde leve, em 4 estilos (capa.estilo): tipografica, caderno, topografico e marcatexto.
// Página do mapa moderna, em seis desenhos (ver LAYOUTS). As ligações são desenhadas no navegador depois do
// layout (ver ligar()).
export const W = 1123, H = 794;
const COR = { floresta: '#0B4A30', verde: '#16804F', tinta: '#1C2B24', texto: '#2E3B35', cinza: '#7A8A82', papel: '#FCFDFB' };
// Canetas dos ramos e o marca-texto que combina com cada uma.
const CANETAS = [
  ['#1E8E5A', '#B9F2CF'], ['#2B6CB0', '#C7E2FF'], ['#E07B24', '#FFE08A'],
  ['#C2417A', '#FFC9DF'], ['#0F8C8C', '#BDF0EC'], ['#6B4FBB', '#DCD2FF'],
];
export const FONTES = 'https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@800;900&family=Inter:wght@400;500;600;700;800&family=Kalam:wght@300;400;700&family=Plus+Jakarta+Sans:wght@700;800&display=swap';
const T = "font-family:'Big Shoulders Display',sans-serif;font-weight:900;text-transform:uppercase";
const I = "font-family:'Inter',sans-serif";
const K = "font-family:'Kalam',cursive";
const J = "font-family:'Plus Jakarta Sans',sans-serif";
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const lista = v => (v == null ? [] : Array.isArray(v) ? v : [v]);
// **negrito** com marca-texto (cor do ramo) e [[sublinhado]] de caneta.
const marca = (s, cor = '#FFE08A', tinta = COR.tinta) => esc(s)
  .replace(/\*\*(.+?)\*\*/g, `<b style="font-weight:700;color:${tinta};background:linear-gradient(transparent 52%,${cor} 52%,${cor} 92%,transparent 92%);padding:0 2px">$1</b>`)
  .replace(/\[\[(.+?)\]\]/g, `<span style="text-decoration:underline;text-decoration-color:${tinta};text-decoration-thickness:2px;text-underline-offset:3px">$1</span>`);

// **negrito** na cor do ramo (com fundo bem claro) e [[texto]] sublinhado: usado no mapa moderno.
const destaque = (s, cor) => esc(s).replace(/\*\*(.+?)\*\*/g, `<b style="font-weight:700;color:${cor};background:${cor}12;border-radius:3px;padding:0 2px">$1</b>`)
  .replace(/\[\[(.+?)\]\]/g, `<span style="text-decoration:underline;text-decoration-color:${cor};text-decoration-thickness:2px;text-underline-offset:2px">$1</span>`);

// ---------- Capas ----------
// Curvas de nível (o "mapa") geradas de forma determinística.
function curvas(cx, cy, n, cor, op = .25, passo = 26, seed = 3) {
  let o = '';
  for (let k = 1; k <= n; k++) {
    const r = k * passo, pts = [];
    for (let a = 0; a <= 360; a += 10) {
      const t = a * Math.PI / 180, d = r * (1 + .12 * Math.sin(3 * t + seed + k * .3) + .07 * Math.cos(5 * t + seed * 2));
      pts.push([cx + d * Math.cos(t) * 1.25, cy + d * Math.sin(t)]);
    }
    o += `<path d="M${pts.map(p => p.map(v => v.toFixed(1)).join(' ')).join(' L')} Z" fill="none" stroke="${cor}" stroke-width="${k % 4 ? 1.2 : 2.2}" opacity="${op}"/>`;
  }
  return o;
}
const rodapeCapa = (c, m, cor) => `<div style="position:absolute;left:70px;right:70px;bottom:56px;display:flex;justify-content:space-between;align-items:flex-end">
    ${c.volume ? `<div><div style="${I};font-size:11px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:${cor};opacity:.75">Tema deste volume</div><div style="${I};font-size:20px;font-weight:700;color:${cor};margin-top:4px">${esc(c.volume)}</div></div>` : '<div></div>'}
    <div style="${I};font-size:14px;font-weight:700;color:${cor}">${esc(m.perfil || '@liberofilho')}</div></div>`;

const CAPAS = {
  // Só tipografia: degradê verde bem claro, título grande em verde-escuro e o número do volume vazado.
  tipografica: (c, m) => `<section class="pagina" style="background:linear-gradient(120deg,#EEF8F1 0%,#D3EEDD 55%,#B4E0C5 100%)">
    <div style="position:absolute;left:70px;top:0;bottom:0;right:70px;display:flex;flex-direction:column;justify-content:center">
      <div style="${I};font-size:15px;font-weight:700;letter-spacing:.26em;text-transform:uppercase;color:${COR.verde}">${esc(c.pre || 'Constitucional com Líbero')}</div>
      <div style="width:70px;height:4px;background:${COR.verde};margin:18px 0 22px"></div>
      <div style="${T};font-size:${c.ts || 150}px;line-height:.84;color:${COR.floresta}">Mapas<br>Mentais</div>
      ${c.tema ? `<div style="${J};font-weight:800;font-size:${c.tt || 54}px;line-height:1.05;letter-spacing:-.02em;color:${COR.verde};margin-top:34px;max-width:900px">${lista(c.tema).map(esc).join('<br>')}</div>` : ''}</div>
    <div style="position:absolute;right:70px;bottom:56px;${I};font-size:14px;font-weight:700;color:${COR.floresta}">${esc(m.perfil || '@liberofilho')}</div></section>`,

  // Caderno: capa verde com espiral na lateral e etiqueta branca colada, preenchida à mão.
  caderno: (c, m) => `<section class="pagina" style="background:linear-gradient(135deg,#2C8C5A 0%,#1E7149 100%)">
    <div style="position:absolute;inset:0;background:repeating-linear-gradient(90deg,rgba(255,255,255,.025) 0 2px,transparent 2px 6px)"></div>
    <div style="position:absolute;left:0;top:0;bottom:0;width:70px;background:rgba(0,0,0,.12)"></div>
    ${Array.from({ length: 17 }, (_, i) => `<div style="position:absolute;left:18px;top:${40 + i * 43}px;width:46px;height:20px;border-radius:10px;border:4px solid #D9DEDA;border-left-color:#9AA39E;box-shadow:0 2px 3px rgba(0,0,0,.3)"></div><div style="position:absolute;left:52px;top:${46 + i * 43}px;width:10px;height:10px;border-radius:50%;background:#0F3D27"></div>`).join('')}
    <div style="position:absolute;left:300px;top:190px;width:600px;background:#FBFBF6;border-radius:14px;padding:30px 40px 34px;box-shadow:0 10px 24px rgba(0,0,0,.22);transform:rotate(-1.2deg)">
      <div style="position:absolute;inset:10px;border:1.5px solid #1E7149;border-radius:8px"></div>
      <div style="position:relative;${I};font-size:13px;font-weight:700;letter-spacing:.24em;text-transform:uppercase;color:${COR.verde};text-align:center">${esc(c.pre || 'Constitucional com Líbero')}</div>
      <div style="position:relative;${T};font-size:96px;line-height:.9;color:${COR.floresta};text-align:center;margin-top:12px">Mapas Mentais</div>
      ${c.volume ? `<div style="position:relative;margin-top:22px;display:flex;align-items:flex-end;gap:12px"><span style="${I};font-size:13px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${COR.cinza}">Tema:</span><span style="flex:1;border-bottom:1.5px solid #9DB3A6;${K};font-size:30px;line-height:1.1;color:#1B3FA0;padding:0 6px">${esc(c.volume)}</span></div>` : ''}</div>
    <div style="position:absolute;right:70px;bottom:56px;${I};font-size:14px;font-weight:700;color:#fff">${esc(m.perfil || '@liberofilho')}</div></section>`,

  // Topográfico: curvas de nível claras sobre o degradê, o "mapa" no sentido literal.
  topografico: (c, m) => `<section class="pagina" style="background:linear-gradient(135deg,#1B7A4C 0%,#2F9A64 55%,#5DBB86 100%)">
    <svg width="${W}" height="${H}" style="position:absolute;inset:0">${curvas(860, 330, 16, '#fff', .22)}${curvas(180, 760, 8, '#fff', .16, 30, 7)}</svg>
    <div style="position:absolute;left:70px;top:170px">
      <div style="${I};font-size:15px;font-weight:700;letter-spacing:.26em;text-transform:uppercase;color:#DFF5E8">${esc(c.pre || 'Constitucional com Líbero')}</div>
      <div style="${T};font-size:160px;line-height:.85;color:#fff;margin-top:18px">Mapas<br>Mentais</div></div>
    ${rodapeCapa(c, m, '#fff')}</section>`,

  // Marca-texto: papel quase branco com um degradê verde leve, título grifado e uma anotação à caneta.
  marcatexto: (c, m) => `<section class="pagina" style="background:linear-gradient(160deg,#FFFFFF 0%,#EAF6EE 60%,#CDEBD8 100%)">
    <div style="position:absolute;inset:0;background-image:radial-gradient(#B9CCBF 1.2px,transparent 1.2px);background-size:26px 26px;opacity:.6"></div>
    <div style="position:absolute;left:90px;top:150px">
      <div style="${I};font-size:15px;font-weight:700;letter-spacing:.26em;text-transform:uppercase;color:${COR.verde}">${esc(c.pre || 'Constitucional com Líbero')}</div>
      <div style="${T};font-size:170px;line-height:.92;color:${COR.tinta};margin-top:20px">
        <span style="background:linear-gradient(transparent 38%,#9FE3B8 38%,#9FE3B8 88%,transparent 88%);padding:0 10px">Mapas</span><br>
        <span style="background:linear-gradient(transparent 38%,#9FE3B8 38%,#9FE3B8 88%,transparent 88%);padding:0 10px">Mentais</span></div></div>
    ${c.nota ? `<div style="position:absolute;left:680px;top:200px;width:300px;${K};font-size:30px;line-height:1.15;color:#1B3FA0;transform:rotate(-4deg)">${esc(c.nota)}</div>
    <svg viewBox="0 0 200 120" style="position:absolute;left:560px;top:270px;width:170px;transform:rotate(-6deg)"><path d="M190 20 C 140 30, 90 50, 30 100" fill="none" stroke="#1B3FA0" stroke-width="4" stroke-linecap="round"/><path d="M30 100 L 46 76 M30 100 L 58 98" stroke="#1B3FA0" stroke-width="4" stroke-linecap="round"/></svg>` : ''}
    ${rodapeCapa(c, m, COR.floresta)}</section>`,
};
const capa = (c, m) => (CAPAS[c.estilo] || CAPAS.tipografica)(c, m);

// ---------- Página do mapa ----------
// Identidade aprovada: fundo branco com brilho verde nos cantos, verde no nó do tema, cartões com cabeçalho
// colorido. Seis desenhos (p.layout), para os mapas não ficarem iguais:
//   radial    tema no centro, ramos em cartões dos dois lados, ligados por curvas
//   arvore    tema no alto, ramos numa fileira embaixo, ligados em chave (organograma)
//   colunas   tema num painel verde à esquerda e ramos como colunas de um quadro comparativo
//   etapas    ramos como passos numerados numa linha, com setas (procedimentos, sequências)
//   perguntas cada ramo é uma linha "rótulo → resposta" (escolha de instrumento, quem/quando/o quê)
//   regra     o 1º ramo é a regra, num quadro largo; os demais são condições/exceções ligados a ela
// Ramo: {titulo, texto} (1ª frase vira o resumo e as demais, tópicos) ou {titulo, resumo, itens, dica, artigo}.
// Rótulos de exceção/atenção/limite saem em ocre. Rodapé: "Na prova" (aplicação), "Confira" (pergunta e
// resposta) e a referência normativa. O tamanho do texto se ajusta para caber (variável --f).
const PALETA = ['#138A55', '#0E7C86', '#2563EB', '#0B5C3B', '#7C3AED', '#D97706'];
const OCRE = '#B58032';
const frases = t => String(t || '').match(/[^.!?]+(?:[.!?]+|$)(?:\s+|$)/g)?.map(s => s.trim()).filter(Boolean) || [];
function normalizar(p) {
  return lista(p.ramos).map((r, i) => {
    const cor = r.cor || (/exce|aten|cuidado|limite|ressalv|veda|proib|não |nao |sanç|perda|cassa/i.test(r.titulo) ? OCRE : PALETA[i % PALETA.length]);
    if (r.texto != null) { const f = frases(r.texto); return { ...r, cor, resumo: f[0] || '', itens: f.slice(1) }; }
    return { ...r, cor };
  });
}
const fs = (k = 1) => `font-size:calc(var(--f) * ${k})`;
// Corpo de um ramo (resumo em destaque e tópicos numerados ou com marcador).
const corpoRamo = (r, num = true) => (num = num && lista(r.itens).length > 1, `${r.resumo ? `<div style="${I};${fs(1.04)};font-weight:600;line-height:1.36;color:${COR.tinta}">${destaque(r.resumo, r.cor)}</div>` : ''}
  ${lista(r.itens).length ? `<div style="display:flex;flex-direction:column;gap:4px;margin-top:6px">${lista(r.itens).map((it, k) => `<div style="display:flex;gap:7px;${I};${fs()};line-height:1.38;color:${COR.texto}">
    ${num ? `<span style="flex:none;width:1.45em;height:1.45em;border-radius:5px;background:${r.cor}1A;color:${r.cor};font-size:.82em;font-weight:800;display:flex;align-items:center;justify-content:center;margin-top:.05em">${k + 1}</span>` : `<span style="flex:none;width:6px;height:6px;border-radius:50%;background:${r.cor};margin-top:.5em"></span>`}<span>${destaque(it, r.cor)}</span></div>`).join('')}</div>` : ''}
  ${r.dica ? `<div style="margin-top:7px;display:flex;gap:7px;background:#FFF7E6;border-radius:8px;padding:6px 9px;${I};${fs(.95)};line-height:1.36;color:#5A4210"><b style="color:#B45309">Pegadinha:</b><span>${destaque(r.dica, '#B45309')}</span></div>` : ''}`);
const pilula = (t, cor, inv = false) => t ? `<span style="flex:none;${I};font-size:10px;font-weight:800;letter-spacing:.04em;color:${inv ? '#fff' : cor};background:${inv ? cor : '#fff'};padding:3px 8px;border-radius:999px">${esc(t)}</span>` : '';
// Cartão padrão (cabeçalho colorido + corpo branco).
const cartao = (r, extra = '', attrs = '') => `<div class="ramo" ${attrs} data-cor="${r.cor}" style="position:relative;background:#fff;border-radius:16px;box-shadow:0 1px 0 rgba(15,42,30,.04),0 10px 26px rgba(15,42,30,.08);border:1px solid #E3ECE7;overflow:hidden;${extra}">
    <div class="cab" style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 14px;background:${r.cor}">
      <span style="${J};font-weight:800;${fs(1.35)};letter-spacing:-.01em;line-height:1.1;color:#fff">${esc(r.titulo)}</span>${pilula(r.artigo, r.cor)}</div>
    <div style="padding:9px 14px 11px">${corpoRamo(r)}</div></div>`;
const noTema = (p, w = 230, extra = '') => `<div class="centro" style="position:relative;width:${w}px;padding:22px 18px;text-align:center;border-radius:28px;background:linear-gradient(150deg,${COR.floresta} 0%,#138A55 100%);box-shadow:0 0 0 8px #E6F5EC,0 18px 40px rgba(11,74,48,.28);${extra}">
    ${p.artigo ? `<div style="${I};font-size:10px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:#A7E8C3">${esc(p.artigo)}</div>` : ''}
    <div style="${J};font-weight:800;font-size:${p.ts ? p.ts + 'px' : 'calc(var(--f) * 1.65)'};line-height:1.08;letter-spacing:-.02em;color:#fff;margin-top:4px">${lista(p.titulo).map(esc).join('<br>')}</div>
    ${p.sub ? `<div style="${I};font-size:11.5px;line-height:1.45;color:#D7F0E1;margin-top:10px">${esc(p.sub).replace(/\*\*(.+?)\*\*/g, '<b style="color:#fff">$1</b>')}</div>` : ''}</div>`;
const tituloTopo = p => `<div style="display:flex;align-items:baseline;gap:14px">${p.numero ? `<span style="${T};font-size:46px;line-height:.8;color:#BFE3CD">${String(p.numero).padStart(2, '0')}</span>` : ''}
    <span style="${J};font-weight:800;font-size:${p.ts || 28}px;line-height:1.05;letter-spacing:-.02em;color:${COR.floresta}">${lista(p.titulo).map(esc).join(' ')}</span></div>`;

const LAYOUTS = {
  radial: (p, rs) => {
    const metade = Math.ceil(rs.length / 2), col = (x, lado) => `<div style="width:${p.largura || 370}px;display:flex;flex-direction:column;justify-content:center;gap:12px">${x.map(r => cartao(r, '', `data-lado="${lado}"`)).join('')}</div>`;
    return `<div class="corpo" style="display:flex;align-items:center;justify-content:space-between;height:100%">
      ${col(rs.slice(0, metade), 'e')}<div style="flex:1;display:flex;align-items:center;justify-content:center">${noTema(p)}</div>${col(rs.slice(metade), 'd')}</div>`;
  },
  arvore: (p, rs) => {
    const linhas = rs.length > 5 ? [rs.slice(0, Math.ceil(rs.length / 2)), rs.slice(Math.ceil(rs.length / 2))] : [rs];
    return `<div class="corpo" style="display:flex;flex-direction:column;align-items:center;gap:26px;height:100%">
      ${noTema(p, 420, 'padding:14px 22px;border-radius:20px')}
      <div style="flex:1;width:100%;display:flex;flex-direction:column;gap:16px;justify-content:center">${linhas.map(l => `<div style="display:grid;grid-template-columns:repeat(${l.length},1fr);gap:14px;align-items:start">${l.map(r => cartao(r, '', 'data-lado="b"')).join('')}</div>`).join('')}</div></div>`;
  },
  colunas: (p, rs) => `<div class="corpo" style="display:flex;gap:18px;height:100%">
      <div class="centro" style="flex:none;width:200px;border-radius:22px;background:linear-gradient(170deg,${COR.floresta} 0%,#138A55 100%);padding:24px 20px;display:flex;flex-direction:column;justify-content:flex-end">
        ${p.numero ? `<div style="${T};font-size:80px;line-height:.8;color:rgba(255,255,255,.22)">${String(p.numero).padStart(2, '0')}</div>` : ''}
        <div style="${J};font-weight:800;font-size:${p.ts || 25}px;line-height:1.1;letter-spacing:-.02em;color:#fff;margin-top:10px">${lista(p.titulo).map(esc).join('<br>')}</div>
        <div style="width:40px;height:4px;border-radius:2px;background:#A7E8C3;margin-top:16px"></div></div>
      <div style="flex:1;display:grid;grid-template-columns:repeat(${rs.length},1fr);border-radius:18px;overflow:hidden;border:1px solid #E3ECE7;background:#fff">
        ${rs.map((r, i) => `<div class="ramo" data-cor="${r.cor}" style="display:flex;flex-direction:column;background:${i % 2 ? '#F6FBF8' : '#fff'};${i ? 'border-left:1px solid #E3ECE7' : ''}">
          <div class="cab" style="padding:14px 14px 12px;border-top:6px solid ${r.cor}">
            <div style="${I};font-size:10px;font-weight:800;letter-spacing:.16em;color:${r.cor}">${String(i + 1).padStart(2, '0')}</div>
            <div style="${J};font-weight:800;${fs(1.4)};line-height:1.1;color:${COR.tinta};margin-top:3px">${esc(r.titulo)}</div></div>
          <div style="padding:0 14px 14px">${corpoRamo(r, false)}</div></div>`).join('')}</div></div>`,
  etapas: (p, rs) => `<div class="corpo" style="display:flex;flex-direction:column;gap:18px;height:100%">
      ${tituloTopo(p)}
      <div style="position:relative;flex:1;display:grid;grid-template-columns:repeat(${rs.length},1fr);gap:16px;align-items:start;padding-top:8px">
        <div style="position:absolute;left:4%;right:4%;top:30px;height:3px;background:linear-gradient(90deg,${rs.map(r => r.cor).join(',')});border-radius:2px"></div>
        ${rs.map((r, i) => `<div class="ramo" data-cor="${r.cor}" style="position:relative;display:flex;flex-direction:column;align-items:center">
          <div style="width:46px;height:46px;border-radius:50%;background:#fff;border:3px solid ${r.cor};display:flex;align-items:center;justify-content:center;${T};font-size:24px;color:${r.cor};box-shadow:0 0 0 6px #fff">${i + 1}</div>
          ${i < rs.length - 1 ? `<svg viewBox="0 0 20 20" width="18" style="position:absolute;right:-17px;top:14px"><path d="M4 3l9 7-9 7" fill="none" stroke="${COR.cinza}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>` : ''}
          <div class="cab" style="${J};font-weight:800;${fs(1.3)};line-height:1.12;color:${r.cor};text-align:center;margin:12px 0 8px">${esc(r.titulo)}</div>
          <div style="width:100%;background:#fff;border:1px solid #E3ECE7;border-top:4px solid ${r.cor};border-radius:14px;padding:10px 12px;box-shadow:0 8px 20px rgba(15,42,30,.06)">${corpoRamo(r, false)}</div></div>`).join('')}</div></div>`,
  perguntas: (p, rs) => `<div class="corpo" style="display:flex;flex-direction:column;gap:14px;height:100%">
      ${tituloTopo(p)}
      <div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:10px">
        ${rs.map(r => `<div class="ramo" data-cor="${r.cor}" style="display:flex;align-items:stretch;gap:0">
          <div class="cab" style="flex:none;width:230px;background:${r.cor};border-radius:14px 0 0 14px;padding:10px 16px;display:flex;align-items:center;${J};font-weight:800;${fs(1.3)};line-height:1.12;color:#fff;position:relative">${esc(r.titulo)}
            <span style="position:absolute;right:-12px;top:50%;margin-top:-12px;width:0;height:0;border-top:12px solid transparent;border-bottom:12px solid transparent;border-left:12px solid ${r.cor}"></span></div>
          <div style="flex:1;background:#fff;border:1px solid #E3ECE7;border-left:none;border-radius:0 14px 14px 0;padding:9px 16px 10px 24px;box-shadow:0 6px 16px rgba(15,42,30,.05)">${corpoRamo(r, false)}</div></div>`).join('')}</div></div>`,
  regra: (p, rs) => {
    const [base, ...resto] = rs;
    return `<div class="corpo" style="display:flex;flex-direction:column;gap:12px;height:100%">
      ${tituloTopo(p)}
      <div class="centro" style="background:linear-gradient(150deg,${COR.floresta} 0%,#138A55 100%);border-radius:20px;padding:16px 22px;box-shadow:0 14px 30px rgba(11,74,48,.22);display:flex;gap:18px;align-items:flex-start">
        <span style="flex:none;${I};font-size:10px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:${COR.floresta};background:#A7E8C3;padding:5px 10px;border-radius:999px;margin-top:3px">Regra</span>
        <div><div style="${J};font-weight:800;${fs(1.5)};color:#fff">${esc(base.titulo)}</div>
          <div style="${I};${fs(1.08)};line-height:1.42;color:#E3F5EA;margin-top:4px">${esc([base.resumo, ...lista(base.itens)].join(' '))}</div></div></div>
      <div style="flex:1;display:grid;grid-template-columns:repeat(${Math.min(resto.length, 4)},1fr);gap:14px;align-content:center;padding-top:14px">${resto.map(r => cartao(r, '', 'data-lado="b"')).join('')}</div></div>`;
  },
};

function mapa(m, p, n) {
  const rs = normalizar(p), layout = LAYOUTS[p.layout] ? p.layout : 'radial';
  const temRodape = p.aplicacao || p.pergunta;
  return `<section class="pagina mapa" data-layout="${layout}" data-fmax="${p.corpo || 22}" style="background:#fff;--f:${p.corpo || 11.5}px">
    <div style="position:absolute;left:-180px;top:-200px;width:520px;height:520px;border-radius:50%;background:radial-gradient(circle,#DDF3E6 0%,rgba(221,243,230,0) 70%)"></div>
    <div style="position:absolute;right:-200px;bottom:-240px;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,#DDF3E6 0%,rgba(221,243,230,0) 70%)"></div>
    <svg class="ligacoes" width="${W}" height="${H}" style="position:absolute;inset:0;z-index:1"></svg>
    <div style="position:absolute;inset:0;padding:20px 32px 14px;display:flex;flex-direction:column;gap:12px;z-index:2">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="${I};font-size:10px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:${COR.verde}">Constitucional com Líbero · Mapas Mentais</span>
        <span style="${I};font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${COR.cinza}">${esc(p.tema || (p.numero ? `Mapa ${String(p.numero).padStart(2, '0')}` : ''))}</span></div>
      <div class="area" style="flex:1;min-height:0">${LAYOUTS[layout](p, rs)}</div>
      ${temRodape ? `<div style="display:grid;grid-template-columns:${p.aplicacao && p.pergunta ? '1.35fr 1fr' : '1fr'};gap:12px">
        ${p.aplicacao ? `<div style="display:flex;gap:10px;align-items:flex-start;background:#FFF7E6;border:1px solid #F7E2B5;border-radius:12px;padding:8px 12px;${I};font-size:min(calc(var(--f) * .9),13px);line-height:1.38;color:#4A3A12">
          <span style="flex:none;font-size:9.5px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#fff;background:#D97706;padding:4px 8px;border-radius:999px">Na prova</span><span>${destaque(p.aplicacao, '#B45309')}</span></div>` : ''}
        ${p.pergunta ? `<div style="display:flex;gap:10px;align-items:flex-start;background:#EEF8F2;border:1px solid #D2EBDD;border-radius:12px;padding:8px 12px;${I};font-size:min(calc(var(--f) * .9),13px);line-height:1.38;color:${COR.tinta}">
          <span style="flex:none;font-size:9.5px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#fff;background:${COR.verde};padding:4px 8px;border-radius:999px">Confira</span><span>${esc(p.pergunta)} <b style="color:${COR.verde}">${esc(p.resposta || '')}</b></span></div>` : ''}</div>` : ''}
      ${p.rodape ? `<div style="display:flex;align-items:center;gap:10px"><span style="flex:none;${I};font-size:10px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#fff;background:${COR.verde};padding:5px 10px;border-radius:999px">Pra fixar</span><span style="${I};font-size:11px;line-height:1.35;color:${COR.tinta}">${destaque(p.rodape, COR.verde)}</span></div>` : ''}
      <div class="rodape" style="display:flex;justify-content:space-between;align-items:center;${I};font-size:9.5px;color:${COR.cinza}">
        <span>${p.referencia ? `<b style="font-weight:700">Referência:</b> ${esc(p.referencia)}` : ''}</span><span style="font-weight:700">${String(n).padStart(2, '0')}</span></div></div>
  </section>`;
}

// Liga o tema aos ramos (radial: curvas laterais; arvore/regra: chaves de cima para baixo) e ajusta o texto:
// diminui --f até tudo caber na área (mínimo 8,5 px).
const LIGAR = `<script>
function ajustar(pg) {
  // Começa grande e diminui --f até nada passar da área (nem dos cartões de altura fixa).
  const area = pg.querySelector('.area');
  const fora = () => { const b = area.getBoundingClientRect();
    return [...area.querySelectorAll('*')].some(e => e.getBoundingClientRect().bottom > b.bottom + 1)
      || [...area.querySelectorAll('.ramo')].some(r => r.scrollHeight > r.clientHeight + 1 || r.scrollWidth > r.clientWidth + 1)
      || pg.querySelector('.rodape').getBoundingClientRect().bottom > pg.getBoundingClientRect().bottom - 8; };
  let f = parseFloat(pg.dataset.fmax || 22);
  pg.style.setProperty('--f', f + 'px');
  while (fora() && f > 8.5) { f -= .25; pg.style.setProperty('--f', f + 'px'); }
  return fora() ? ['não coube (fonte mínima)'] : [];
}
function ligar() {
  window.__avisos = [];
  [...document.querySelectorAll('.pagina.mapa')].forEach((pg, i) => {
    ajustar(pg).forEach(a => window.__avisos.push('mapa ' + (i + 1) + ': ' + a));
    const svg = pg.querySelector('.ligacoes'), base = pg.getBoundingClientRect(), centro = pg.querySelector('.centro'), lay = pg.dataset.layout;
    if (!centro || !['radial', 'arvore', 'regra'].includes(lay)) return;
    const c = centro.getBoundingClientRect();
    let out = '';
    for (const r of pg.querySelectorAll('.ramo')) {
      const b = r.getBoundingClientRect(), h = r.querySelector('.cab').getBoundingClientRect(), cor = r.dataset.cor;
      if (r.dataset.lado === 'b') {
        const x1 = c.left + c.width / 2 - base.left, y1 = c.bottom - base.top, x2 = b.left + b.width / 2 - base.left, y2 = b.top - base.top, ym = (y1 + y2) / 2;
        out += '<path d="M' + x1 + ' ' + y1 + ' L ' + x1 + ' ' + ym + ' L ' + x2 + ' ' + ym + ' L ' + x2 + ' ' + y2 + '" stroke="' + cor + '" stroke-width="2.5" fill="none" stroke-linejoin="round"/>'
          + '<circle cx="' + x2 + '" cy="' + y2 + '" r="4.5" fill="#fff" stroke="' + cor + '" stroke-width="2.5"/>';
      } else {
        const esq = r.dataset.lado === 'e', x1 = (esq ? c.left : c.right) - base.left, y1 = c.top + c.height / 2 - base.top;
        const x2 = (esq ? b.right : b.left) - base.left, y2 = h.top + h.height / 2 - base.top, mx = (x1 + x2) / 2;
        out += '<path d="M' + x1 + ' ' + y1 + ' C ' + mx + ' ' + y1 + ', ' + mx + ' ' + y2 + ', ' + x2 + ' ' + y2 + '" stroke="' + cor + '" stroke-width="2.5" fill="none" stroke-linecap="round"/>'
          + '<circle cx="' + x2 + '" cy="' + y2 + '" r="5" fill="#fff" stroke="' + cor + '" stroke-width="2.5"/>';
      }
    }
    svg.innerHTML = out;
  });
  window.__pronto = true;
}
document.fonts.ready.then(() => setTimeout(ligar, 50));
</script>`;

export function renderMapas(m) {
  const pags = [];
  for (const c of lista(m.capas || m.capa)) pags.push(capa(c, m));
  lista(m.mapas).forEach(p => pags.push(mapa(m, p, pags.length + 1)));
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet">
<style>@page{size:297mm 210mm;margin:0}*{box-sizing:border-box}body{margin:0;background:#888}.pagina{position:relative;width:${W}px;height:${H}px;overflow:hidden}</style></head>
<body>${pags.join('')}${LIGAR}</body></html>`;
}
