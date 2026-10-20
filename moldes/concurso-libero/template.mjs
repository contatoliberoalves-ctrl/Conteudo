// Molde "Concurso com Líbero" (plataforma de cursos para concursos): identidade da plataforma (degradê verde →
// petróleo → ciano sobre preto, símbolo "L com visto", Sora) com o jeito do Carrossel Libero do insta pessoal
// (títulos em Big Shoulders caixa alta, [[palavra]] em caixa, granulado; rodapé só com o @).
// Três estilos de carrossel (`estilo`): "alternado" (páginas alternando verde e branco, como o Carrossel Libero),
// "claro" (capa e fim verdes, conteúdo em papel claro) e "ficha" (ficha branca do edital sobre fundo petróleo).
// Fundos em cores fixas (verde, petróleo, papel), no máximo um degradê leve entre dois verdes.
// `tipo: "post"` gera a tela única. Tipos de slide: capa, numeros, comparativo, datas, lista, blocos, texto, cta.

export const W = 1080, H = 1350;
const M = 90;
export const COR = { verde: '#00A651', ciano: '#00D2C8', petroleo: '#04312C', preto: '#020B0A', menta: '#B9FFF1', papel: '#F3F7F5', tinta: '#06201C', cinza: '#5E7A74', aviso: '#FFB511', erro: '#FF5A5F' };
export const DEG = `radial-gradient(60% 75% at 0% 0%,#00B85A 0%,rgba(0,150,80,.55) 40%,transparent 75%),radial-gradient(70% 70% at 62% 108%,#14F0E4 0%,#00C2BA 22%,rgba(0,140,135,.6) 50%,transparent 78%),radial-gradient(55% 55% at 100% 0%,#010807 0%,transparent 70%),linear-gradient(160deg,#03703F 0%,#035C4E 38%,#02443F 62%,#010D0C 100%)`;
const DEGH = `linear-gradient(100deg,${COR.verde},${COR.ciano})`;
// Fundos dos posts: cores fixas da marca, no máximo um degradê leve entre dois verdes (sem brilhos).
// O degradê cheio da plataforma (DEG) fica só para capas de curso e telas da plataforma.
const VERDE_BG = 'linear-gradient(165deg,#0BA457 0%,#078A4A 100%)';
const PETROLEO_BG = '#062A26';
export const FONTES = 'https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@800;900&family=Sora:wght@300;400;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap';
const T = "font-family:'Big Shoulders Display',sans-serif;font-weight:900;text-transform:uppercase;letter-spacing:-.005em";
const S = "font-family:'Sora',sans-serif", I = "font-family:'Inter',sans-serif";
export const PERFIL = '@concursocomlibero';
const RUIDO = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .35 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;
const textura = escuro => `<div style="position:absolute;inset:0;pointer-events:none;background-image:${RUIDO};opacity:${escuro ? .5 : .45};mix-blend-mode:${escuro ? 'overlay' : 'multiply'};z-index:20"></div>`;

export const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const lista = v => (v == null ? [] : Array.isArray(v) ? v : [v]);
const dois = n => String(n).padStart(2, '0');
// **negrito** e [[caixa]] (fundo sólido, como no insta pessoal).
const rico = (s, t) => esc(s).replace(/\*\*(.+?)\*\*/g, `<b style="font-weight:800;color:${t.forte}">$1</b>`)
  .replace(/\[\[(.+?)\]\]/g, `<span style="background:${t.caixaBg};color:${t.caixaTxt};padding:0 .12em;box-decoration-break:clone;-webkit-box-decoration-break:clone">$1</span>`);
const linhas = (v, t) => lista(v).map(l => rico(l, t)).join('<br>');

let gid = 0;
export const simbolo = (px, fundo = 'deg', traco = '#fff') => {
  const id = `s${++gid}`;
  return `<svg width="${px}" height="${px}" viewBox="0 0 100 100" style="flex:none;display:block"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#00B85A"/><stop offset=".55" stop-color="#009A8C"/><stop offset="1" stop-color="#14E6DA"/></linearGradient></defs>
    <rect x="2" y="2" width="96" height="96" rx="28" fill="${fundo === 'deg' ? `url(#${id})` : fundo}"/>
    <path d="M34 22 V66 H58 L76 34" fill="none" stroke="${traco}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/><circle cx="76" cy="20" r="5.5" fill="${traco}" opacity=".9"/></svg>`;
};
export const marca = (px = 30, cor = '#fff', sub = COR.menta) => `<div style="display:inline-flex;align-items:center;gap:${px * .3}px">${simbolo(px * 1.25)}
  <div style="display:flex;flex-direction:column;line-height:1"><span style="${S};font-weight:600;font-size:${px * .36}px;letter-spacing:.22em;text-transform:uppercase;color:${sub}">Concurso com</span><span style="${S};font-weight:800;font-size:${px}px;letter-spacing:-.035em;color:${cor};margin-top:${px * .08}px">Líbero</span></div></div>`;

// Temas: escuro (degradê), claro (papel) e ficha (cartão branco sobre petróleo).
const TEMA = {
  escuro: { bg: VERDE_BG, tit: '#fff', txt: '#EFFFF6', forte: '#fff', acento: '#CFFFE4', caixaBg: COR.petroleo, caixaTxt: '#fff', card: 'rgba(3,40,32,.22)', cardBorda: 'rgba(255,255,255,.2)', linha: 'rgba(255,255,255,.3)', mute: 'rgba(239,255,246,.75)', escuro: true, anel: COR.petroleo, cab: COR.petroleo, num1: COR.petroleo, num2: 'rgba(3,40,32,.35)', ponto: COR.petroleo, contorno: '#fff' },
  claro: { bg: COR.papel, tit: COR.tinta, txt: '#1E3A35', forte: COR.tinta, acento: '#078A4A', caixaBg: '#0BA457', caixaTxt: '#fff', card: '#fff', cardBorda: '#D7E6E2', linha: '#CFE0DB', mute: COR.cinza, escuro: false, anel: '#0BA457', cab: COR.tinta, num1: '#0BA457', num2: COR.tinta, ponto: '#0BA457', contorno: '#0BA457' },
};
TEMA.ficha = { ...TEMA.claro, bg: '#fff', card: COR.papel };

// ---------- Blocos de conteúdo (usados pelos três estilos) ----------
const kicker = (s, t) => s ? `<div style="${S};font-size:22px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:${t.acento}">${esc(s)}</div>` : '';
const titulo = (v, t, px = 92) => `<div style="${T};font-size:${px}px;line-height:1.02;color:${t.tit};margin-top:14px">${linhas(v, t)}</div>`;
const fonte = (s, t) => s ? `<div style="${I};font-size:21px;line-height:1.4;color:${t.mute};margin-top:26px">${esc(s)}</div>` : '';
const CONTEUDO = {
  numeros: (s, t) => `${kicker(s.kicker, t)}${titulo(s.titulo, t, s.ts || 92)}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-top:46px">${lista(s.itens).map(x => `<div style="background:${t.card};border:1px solid ${t.cardBorda};border-radius:24px;padding:34px 30px 30px">
      <div style="${T};font-size:${x.px || 100}px;line-height:.9;color:${t.tit}">${esc(x.n)}</div>
      <div style="${I};font-size:28px;font-weight:600;line-height:1.35;color:${t.txt};margin-top:12px">${rico(x.rot, t)}</div></div>`).join('')}</div>${fonte(s.fonte, t)}`,
  comparativo: (s, t) => `${kicker(s.kicker, t)}${titulo(s.titulo, t, s.ts || 84)}
    <div style="margin-top:34px;border-radius:24px;overflow:hidden;border:1px solid ${t.cardBorda}">
      <div style="display:grid;grid-template-columns:200px 1fr 1fr;background:${t.cab};${S};font-size:24px;font-weight:700;color:#fff">
        <span style="padding:18px 20px"></span>${lista(s.colunas).map((c, i) => `<span style="padding:18px 20px;border-left:1px solid rgba(255,255,255,.18);color:#fff">${esc(c)}</span>`).join('')}</div>
      ${lista(s.linhas).map((l, i) => `<div style="display:grid;grid-template-columns:200px 1fr 1fr;background:${i % 2 ? (t.escuro ? 'rgba(3,40,32,.14)' : t.card) : (t.escuro ? 'rgba(3,40,32,.26)' : (t === TEMA.claro ? '#E9F2EF' : '#fff'))};border-top:1px solid ${t.cardBorda}">
        <span style="padding:20px 20px;${S};font-size:18px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${t.acento}">${esc(l[0])}</span>
        ${l.slice(1).map(c => `<span style="padding:20px 20px;border-left:1px solid ${t.cardBorda};${I};font-size:26px;font-weight:600;line-height:1.3;color:${t.txt}">${rico(c, t)}</span>`).join('')}</div>`).join('')}
    </div>${fonte(s.fonte, t)}`,
  datas: (s, t) => `${kicker(s.kicker, t)}${titulo(s.titulo, t, s.ts || 92)}
    <div style="position:relative;margin-top:40px;padding-left:46px">
      <div style="position:absolute;left:13px;top:12px;bottom:12px;width:4px;border-radius:4px;background:${t.linha}"></div>
      ${lista(s.itens).map(x => `<div style="position:relative;margin-bottom:34px">
        <span style="position:absolute;left:-46px;top:6px;width:30px;height:30px;border-radius:50%;background:${x.destaque ? t.ponto : (t.escuro ? '#0BA457' : '#fff')};border:4px solid ${x.destaque ? '#fff' : t.ponto}"></span>
        <div style="${T};font-size:58px;line-height:1;color:${x.destaque ? t.tit : t.acento}">${esc(x.data)}</div>
        <div style="${I};font-size:29px;font-weight:600;line-height:1.35;color:${t.txt};margin-top:6px">${rico(x.t, t)}</div></div>`).join('')}
    </div>${fonte(s.fonte, t)}`,
  lista: (s, t) => `${kicker(s.kicker, t)}${titulo(s.titulo, t, s.ts || 92)}
    <div style="display:flex;flex-direction:column;gap:18px;margin-top:40px">${lista(s.itens).map((x, i) => `<div style="display:grid;grid-template-columns:84px 1fr;gap:20px;align-items:start;background:${t.card};border:1px solid ${t.cardBorda};border-radius:22px;padding:26px 28px">
      <span style="${T};font-size:64px;line-height:.85;color:transparent;-webkit-text-stroke:2px ${t.contorno}">${dois(i + 1)}</span>
      <div><div style="${S};font-size:32px;font-weight:700;line-height:1.25;color:${t.tit}">${rico(x.t, t)}</div>${x.d ? `<div style="${I};font-size:25px;line-height:1.4;color:${t.txt};margin-top:6px">${rico(x.d, t)}</div>` : ''}</div></div>`).join('')}</div>${fonte(s.fonte, t)}`,
  // Blocos da prova: cada bloco com o número de questões em destaque e as matérias.
  blocos: (s, t) => `${kicker(s.kicker, t)}${titulo(s.titulo, t, s.ts || 88)}
    <div style="display:flex;flex-direction:column;gap:16px;margin-top:34px">${lista(s.itens).map(x => `<div style="display:grid;grid-template-columns:150px 1fr;background:${t.card};border:1px solid ${t.cardBorda};border-radius:22px;overflow:hidden">
      <div style="background:${x.elim ? t.num1 : t.num2};display:flex;flex-direction:column;align-items:center;justify-content:center;padding:18px 0;color:#fff"><span style="${T};font-size:76px;line-height:.85">${esc(x.n)}</span><span style="${S};font-size:15px;font-weight:700;letter-spacing:.18em">QUESTÕES</span></div>
      <div style="padding:24px 26px"><div style="display:flex;justify-content:space-between;align-items:baseline;gap:12px"><span style="${S};font-size:31px;font-weight:800;color:${t.tit}">${esc(x.nome)}</span><span style="${S};font-size:15px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${x.elim ? t.acento : t.mute};white-space:nowrap">${x.elim ? 'eliminatório' : 'classificatório'}</span></div>
        <div style="${I};font-size:24px;line-height:1.42;color:${t.txt};margin-top:8px">${rico(x.d, t)}</div></div></div>`).join('')}</div>${fonte(s.fonte, t)}`,
  texto: (s, t) => `${kicker(s.kicker, t)}${titulo(s.titulo, t, s.ts || 96)}
    ${lista(s.paragrafos).map(p => `<p style="${I};font-size:33px;line-height:1.45;color:${t.txt};margin:32px 0 0">${rico(p, t)}</p>`).join('')}
    ${s.destaque ? `<div style="margin-top:36px;border-left:8px solid ${t.escuro ? COR.petroleo : '#0BA457'};background:${t.card};border-radius:0 22px 22px 0;padding:22px 28px;${S};font-size:31px;font-weight:700;line-height:1.35;color:${t.tit}">${rico(s.destaque, t)}</div>` : ''}${fonte(s.fonte, t)}`,
};

// ---------- Moldura de cada estilo ----------
// Cada página leva só um sinal da marca: o logo no topo (capa, CTA e tela única) ou o @ no rodapé (miolo).
const topo = t => `<div style="position:absolute;left:0;right:0;top:70px;display:flex;justify-content:center;z-index:5">${marca(30, t.escuro ? '#fff' : COR.tinta, t.escuro ? COR.menta : '#078A4A')}</div>`;
const rodape = t => `<div style="position:absolute;left:${M}px;bottom:62px;${I};font-size:24px;font-weight:600;letter-spacing:.06em;color:${t.escuro ? 'rgba(255,255,255,.8)' : COR.cinza};z-index:15">${PERFIL}</div>`;
const secao = (bg, corpo) => `<section style="background:${bg}">${corpo}</section>`;
// Relógio-despertador (elemento de urgência da capa).
const relogio = (px, cor, fundo) => `<svg width="${px}" height="${px}" viewBox="0 0 100 100" style="display:block"><path d="M16 26 L28 14 M84 26 L72 14" stroke="${cor}" stroke-width="8" stroke-linecap="round"/><circle cx="50" cy="55" r="34" fill="${fundo}" stroke="${cor}" stroke-width="8"/><path d="M50 36 V56 L64 64" fill="none" stroke="${cor}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><path d="M28 92 L34 84 M72 92 L66 84" stroke="${cor}" stroke-width="8" stroke-linecap="round"/></svg>`;
// Capa: só o título (centralizado) e, se houver, o alerta de prazo. Fundo verde (alternado), papel (claro) ou petróleo (ficha).
const CAPA_BG = { alternado: [VERDE_BG, TEMA.escuro], claro: [COR.papel, TEMA.claro], ficha: [PETROLEO_BG, { ...TEMA.escuro, caixaBg: '#0BA457' }] };
function capa(s, estilo) {
  const [bg, t] = CAPA_BG[estilo] || CAPA_BG.alternado;
  const alerta = s.alerta ? `<div style="display:inline-flex;align-items:center;gap:18px;margin-top:56px;background:${t.escuro ? '#fff' : COR.tinta};border-radius:20px;padding:14px 28px 14px 18px">
      ${relogio(64, t.escuro ? '#D93A30' : '#FFB511', t.escuro ? '#fff' : COR.tinta)}<span style="${S};font-size:32px;font-weight:800;color:${t.escuro ? COR.tinta : '#fff'}">${rico(s.alerta, t)}</span></div>` : '';
  return secao(bg, `${textura(t.escuro)}${topo(t)}
    <div style="position:absolute;left:${M}px;right:${M}px;top:50%;transform:translateY(-46%);text-align:center;z-index:5">
      ${s.pre ? `<div style="${S};font-size:36px;font-weight:600;color:${t.escuro ? '#DFFFEA' : '#078A4A'}">${esc(s.pre)}</div>` : ''}
      <div style="${T};font-size:${s.ts || 160}px;line-height:1;color:${t.tit};margin-top:22px">${linhas(s.titulo, t)}</div>
      ${s.sub ? `<p style="${S};font-size:34px;font-weight:600;line-height:1.35;color:${t.escuro ? '#fff' : COR.tinta};margin:36px auto 0;max-width:820px">${rico(s.sub, t)}</p>` : ''}
      ${alerta}
    </div>`);
}
function cta(s) {
  const t = TEMA.escuro;
  return secao(VERDE_BG, `${textura(true)}${topo(t)}
    <div style="position:absolute;left:${M}px;right:${M}px;top:50%;transform:translateY(-46%);text-align:center;z-index:5">
      <div style="${T};font-size:${s.ts || 140}px;line-height:1;color:#fff">${linhas(s.titulo, t)}</div>
      ${s.texto ? `<p style="${I};font-size:32px;line-height:1.45;color:#EFFFF6;margin:36px auto 0;max-width:820px">${rico(s.texto, t)}</p>` : ''}
      ${s.comenta ? `<div style="margin:50px auto 0;max-width:640px;display:flex;align-items:center;gap:20px;background:${COR.petroleo};border-radius:999px;padding:18px 26px">
        <span style="${S};font-size:34px;font-weight:700;color:#fff">Comenta <span style="color:#3DF0A0">${esc(s.comenta)}</span><span style="display:inline-block;width:3px;height:34px;background:#fff;margin-left:6px;vertical-align:-6px"></span></span>
        <span style="margin-left:auto;${S};font-size:24px;font-weight:800;color:#3DF0A0">Publicar</span></div>` : ''}
      ${s.botao ? `<div style="display:inline-block;margin-top:40px;background:#fff;color:${COR.tinta};border-radius:999px;padding:18px 38px;${S};font-size:28px;font-weight:800">${esc(s.botao)}</div>` : ''}
    </div>`);
}
function conteudo(s, estilo, i) {
  const corpo = t => `<div style="position:absolute;left:${M}px;right:${M}px;top:50%;transform:translateY(-54%);z-index:5">${CONTEUDO[s.tipo](s, t)}</div>${rodape(t)}`;
  // alternado: páginas alternando verde e branco, como o azul e o off-white do Carrossel Libero.
  if (estilo === 'alternado') return i % 2 ? secao(COR.papel, `${textura(false)}${corpo(TEMA.claro)}`) : secao(VERDE_BG, `${textura(true)}${corpo(TEMA.escuro)}`);
  if (estilo === 'claro') return secao(COR.papel, `${textura(false)}<div style="position:absolute;left:0;top:0;bottom:0;width:16px;background:#0BA457"></div>${corpo(TEMA.claro)}`);
  // ficha: cartão branco com aba sobre fundo petróleo com grade.
  const t = TEMA.ficha;
  return secao(PETROLEO_BG, `${textura(true)}
    <div style="position:absolute;inset:0;background-image:linear-gradient(rgba(185,255,241,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(185,255,241,.06) 1px,transparent 1px);background-size:54px 54px"></div>
    <div style="position:absolute;left:60px;right:60px;top:90px;bottom:120px;background:#fff;border-radius:30px;z-index:4;box-shadow:0 30px 70px rgba(0,0,0,.35)">
      ${s.aba ? `<div style="position:absolute;left:40px;top:-22px;${S};font-size:18px;font-weight:800;letter-spacing:.18em;color:#fff;background:#0BA457;padding:9px 18px;border-radius:10px">${esc(s.aba)}</div>` : ''}
      <div class="ficha-corpo" style="position:absolute;left:46px;right:46px;top:46px;zoom:.88">${CONTEUDO[s.tipo](s, t)}</div></div>${rodape(TEMA.escuro)}`);
}

// Tela única: manchete com números e CTA.
function post(p) {
  const t = TEMA.escuro;
  return secao(VERDE_BG, `${textura(true)}${topo(t)}
    <div style="position:absolute;left:${M}px;right:${M}px;top:${p.top || 230}px;z-index:5">
      ${p.selo ? `<span style="display:inline-block;${S};font-size:24px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#fff;background:${COR.petroleo};padding:10px 18px;border-radius:10px;transform:rotate(-2deg)">${esc(p.selo)}</span>` : ''}
      <div style="${T};font-size:${p.ts || 160}px;line-height:.98;color:#fff;margin-top:26px">${linhas(p.manchete, t)}</div>
      ${p.sub ? `<p style="${I};font-size:30px;font-weight:500;line-height:1.4;color:#E3FFF8;margin:26px 0 0">${rico(p.sub, t)}</p>` : ''}
      <div style="display:grid;grid-template-columns:repeat(${lista(p.numeros).length},1fr);gap:16px;margin-top:40px">${lista(p.numeros).map(x => `<div style="background:rgba(3,40,32,.25);border:1px solid rgba(255,255,255,.2);border-radius:22px;padding:22px 20px">
        <div style="${T};font-size:${x.px || 64}px;line-height:.9;color:#fff">${esc(x.n)}</div><div style="${I};font-size:20px;font-weight:600;line-height:1.3;color:#E3FFF8;margin-top:8px">${rico(x.rot, t)}</div></div>`).join('')}</div>
    </div>
    ${p.comenta ? `<div style="position:absolute;left:${M}px;right:${M}px;bottom:130px;display:flex;align-items:center;gap:20px;background:${COR.petroleo};border-radius:999px;padding:16px 22px;z-index:5">
      <span style="${S};font-size:32px;font-weight:700;color:#fff">Comenta <span style="color:#3DF0A0">${esc(p.comenta)}</span></span><span style="margin-left:auto;${I};font-size:22px;font-weight:600;color:#E3FFF8">${esc(p.comentaTexto || 'e receba o link')}</span></div>` : ''}`);
}

export function renderCarrossel(p) {
  const avisos = [];
  let secoes;
  if (p.tipo === 'post') secoes = [post(p)];
  else {
    const total = p.slides.length;
    secoes = p.slides.map((s, i) => s.tipo === 'capa' ? capa(s, p.estilo) : s.tipo === 'cta' ? cta(s) : conteudo(s, p.estilo, i));
    p.slides.forEach((s, i) => { if (!['capa', 'cta'].includes(s.tipo) && !CONTEUDO[s.tipo]) avisos.push(`slide ${i + 1}: tipo desconhecido ${s.tipo}`); });
  }
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet">
<style>*{box-sizing:border-box}body{margin:0;${I};-webkit-font-smoothing:antialiased}section{position:relative;width:${W}px;height:${H}px;overflow:hidden}p{margin:0}</style></head>
<body>${secoes.join('\n')}
<script>document.fonts.ready.then(()=>{const fichas=[...document.querySelectorAll('.ficha-corpo')].flatMap(c=>{const p=c.parentElement.getBoundingClientRect(),r=c.getBoundingClientRect();return r.bottom>p.bottom-24?['ficha passa do cartão: '+(c.closest('section').querySelector('[style*="letter-spacing:.18em"]')||{}).textContent]:[]});window.__avisos=fichas.concat([...document.querySelectorAll('section')].flatMap((s,i)=>{const r=s.getBoundingClientRect();return [...s.querySelectorAll('div,p,span')].some(e=>{const b=e.getBoundingClientRect();return b.width&&(b.bottom>r.bottom-40||b.right>r.right+1)&&getComputedStyle(e).position!=='absolute'})?['slide '+(i+1)+': conteúdo passa da página']:[]}));window.__pronto=true});</script></body></html>`;
  return { html, avisos, n: secoes.length };
}
