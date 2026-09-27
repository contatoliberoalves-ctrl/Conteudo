// Carrossel Eduarda Pop: estilos de carrossel "de Instagram de agora" para a Eduarda Caraciolo
// (Advogada · Direito Civil e ECA), a partir das referências que ela separou.
//   "trend"  (moderno)      papel quadriculado, títulos condensados (Anton), rosa-choque + roxo, caixas tracejadas, brilhos ✦
//   "studio" (moderno)      fundo grafite granulado, serifa (Gloock) com palavra em letra cursiva rosé, microtexto nas bordas
//   "scrap"  (descontraído) papel, grotesca pesada minúscula, balões de fala pretos, estrelas, papel rasgado, legenda rosa em foto
//   "blocos" (descontraído) fundo de cor chapada por slide, título em faixas, caixinhas brancas, print/foto embaixo
// Cada post escolhe um "estilo"; cada slide, um "tipo" (ver README). Sem contador de páginas.
// Marcação no texto: **negrito**, *palavra de destaque* (cursiva/itálico), ==caixa de destaque==, {cor}, \n quebra a linha.

const ARROBA = '@eduardacaraciolo';
const FONTES = 'https://fonts.googleapis.com/css2?family=Anton&family=Figtree:wght@400;500;600;700;800&family=Inter+Tight:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400&family=Gloock&family=Monsieur+La+Doulaise&family=Noto+Color+Emoji&display=swap';
const W = 1080, H = 1350;
const CLONE = 'box-decoration-break:clone;-webkit-box-decoration-break:clone';
const ANTON = "font-family:'Anton',sans-serif;font-weight:400";
const FIG = "font-family:'Figtree','Noto Color Emoji',sans-serif";
const TIGHT = "font-family:'Inter Tight','Noto Color Emoji',sans-serif";
const SERIF = "font-family:'Gloock',serif;font-weight:400";
const SCRIPT = "font-family:'Monsieur La Doulaise',cursive;font-weight:400";

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const lista = v => (v == null ? [] : Array.isArray(v) ? v : [v]);
const dois = n => String(n).padStart(2, '0');
// m = { b: estilo do **negrito**, i: do *destaque*, hl: da ==caixa==, acc: do {cor} }
function fmt(t, m = {}) {
  return esc(t)
    .replace(/\*\*(.+?)\*\*/g, `<b style="${m.b || 'font-weight:700'}">$1</b>`)
    .replace(/==(.+?)==/g, `<span style="${m.hl || ''};${CLONE}">$1</span>`)
    .replace(/\{(.+?)\}/g, `<span style="${m.acc || ''}">$1</span>`)
    .replace(/\*(.+?)\*/g, `<span style="${m.i || 'font-style:italic'}">$1</span>`)
    .replace(/\n/g, '<br>');
}

// ---------- imagens ----------
function img(ctx, nome, { pos = 'center', estilo = '' } = {}) {
  const src = nome && ctx.imgs[nome];
  if (src) return `<img data-foto src="${src}" style="width:100%;height:100%;object-fit:cover;object-position:${esc(pos)};display:block;${estilo}">`;
  if (nome) ctx.faltando.add(nome);
  return `<div data-foto style="width:100%;height:100%;background:linear-gradient(160deg,#E9D6D6,#D7B9BB);display:flex;align-items:center;justify-content:center;${estilo}"><span style="${SERIF};font-size:150px;color:#fff;opacity:.7">EC</span></div>`;
}

// ---------- enfeites ----------
const brilho = (x, y, px, cor, rot = 0) => `<svg style="position:absolute;left:${x}px;top:${y}px;width:${px}px;height:${px}px;transform:rotate(${rot}deg);z-index:4" viewBox="0 0 100 100"><path d="M50 0 C54 36 64 46 100 50 C64 54 54 64 50 100 C46 64 36 54 0 50 C36 46 46 36 50 0Z" fill="${cor}"/></svg>`;
const estrela = (x, y, px, cor, rot = 0) => `<svg style="position:absolute;left:${x}px;top:${y}px;width:${px}px;height:${px}px;transform:rotate(${rot}deg);z-index:4" viewBox="0 0 100 100"><path d="M50 4 L62 36 L96 38 L69 59 L79 94 L50 73 L21 94 L31 59 L4 38 L38 36Z" fill="${cor}" stroke="#111" stroke-width="${cor === '#111' ? 0 : 5}" stroke-linejoin="round"/></svg>`;
const cantos = cor => `
  <svg style="position:absolute;left:44px;top:44px;width:60px;height:60px" viewBox="0 0 60 60"><path d="M8 56 V8 H56" fill="none" stroke="${cor}" stroke-width="2"/><rect x="3" y="3" width="10" height="10" fill="#fff" stroke="${cor}" stroke-width="2"/></svg>
  <svg style="position:absolute;right:44px;bottom:44px;width:60px;height:60px" viewBox="0 0 60 60"><path d="M52 4 V52 H4" fill="none" stroke="${cor}" stroke-width="2"/><rect x="47" y="47" width="10" height="10" fill="#fff" stroke="${cor}" stroke-width="2"/></svg>`;
// Barra de abas do perfil do Instagram (grade, reels, repost, marcados).
const abas = (y, cor = '#111') => {
  const ic = [
    `<rect x="4" y="4" width="7" height="7"/><rect x="14.5" y="4" width="7" height="7"/><rect x="25" y="4" width="7" height="7"/><rect x="4" y="14.5" width="7" height="7"/><rect x="14.5" y="14.5" width="7" height="7"/><rect x="25" y="14.5" width="7" height="7"/><rect x="4" y="25" width="7" height="7"/><rect x="14.5" y="25" width="7" height="7"/><rect x="25" y="25" width="7" height="7"/>`,
    `<rect x="4" y="4" width="28" height="28" rx="7" fill="none" stroke="${cor}" stroke-width="2.4"/><path d="M15 12 L24 18 L15 24Z"/>`,
    `<path d="M9 14 H26 L22 10 M27 22 H10 L14 26" fill="none" stroke="${cor}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`,
    `<rect x="4" y="4" width="28" height="28" rx="6" fill="none" stroke="${cor}" stroke-width="2.4"/><circle cx="18" cy="15" r="4.5" fill="none" stroke="${cor}" stroke-width="2.4"/><path d="M9 29 C11 22 25 22 27 29" fill="none" stroke="${cor}" stroke-width="2.4"/>`,
  ];
  return `<div style="position:absolute;left:110px;right:110px;top:${y}px;display:flex;justify-content:space-between;align-items:center;border-top:1.5px solid rgba(0,0,0,.18);padding-top:28px">
    ${ic.map((p, i) => `<div style="width:120px;display:flex;flex-direction:column;align-items:center;gap:10px"><svg width="40" height="40" viewBox="0 0 36 36" fill="${cor}">${p}</svg><div style="width:70px;height:3px;background:${i ? 'transparent' : cor}"></div></div>`).join('')}</div>`;
};
// Papel rasgado: borda de cima irregular (sempre igual para o mesmo "semente").
function rasgo(topo, cor, semente = 7) {
  let s = semente, pts = [];
  const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  for (let x = 0; x <= 100; x += 2.5) pts.push(`${x}% ${Math.round(r() * 38)}px`);
  return `<div style="position:absolute;left:-10px;right:-10px;top:${topo}px;bottom:0;background:${cor};clip-path:polygon(${pts.join(',')},100% 100%,0 100%);z-index:1"></div>`;
}
// Balão de fala com rabinho (lado: esq/dir, em cima ou embaixo).
const balao = (html, { bg = '#111', cor = '#fff', rot = 0, rabo = 'baixo-esq', tam = 34, extra = '' } = {}) => {
  const [v, h] = rabo.split('-');
  const pos = `${h === 'esq' ? 'left:64px' : 'right:64px'};${v === 'baixo' ? 'bottom:-38px' : 'top:-38px'}`;
  const tri = v === 'baixo' ? `border-top:44px solid ${bg};${h === 'esq' ? 'border-right' : 'border-left'}:40px solid transparent` : `border-bottom:44px solid ${bg};${h === 'esq' ? 'border-right' : 'border-left'}:40px solid transparent`;
  return `<div style="position:relative;background:${bg};color:${cor};border-radius:38px;padding:30px 42px;${TIGHT};font-weight:500;font-size:${tam}px;line-height:1.14;letter-spacing:-.02em;text-align:center;transform:rotate(${rot}deg);${extra}"><div data-corpo>${html}</div><div style="position:absolute;${pos};width:0;height:0;${tri}"></div></div>`;
};

// ================= TREND =================
const T = { bg: '#F5F2EE', ink: '#141414', pink: '#FF1F8E', roxo: '#7A2CC7' };
const tM = { acc: `color:${T.pink}`, i: `color:${T.pink}`, hl: `background:linear-gradient(transparent 17%,${T.roxo} 17%,${T.roxo} 90%,transparent 90%);color:#fff;padding:0 .1em`, b: 'font-weight:700' };
const tTit = (t, px, m = tM, cor = T.ink) => `<div data-titulo style="${ANTON};font-size:${px}px;line-height:1.08;text-transform:uppercase;color:${cor};letter-spacing:.003em">${fmt(t, m)}</div>`;
const tCorpo = (t, px = 33, cor = '#1c1c1c', al = 'center') => `<div data-corpo style="${FIG};font-size:${px}px;line-height:1.42;color:${cor};text-align:${al}">${fmt(t, tM)}</div>`;
const tFundo = `background-color:${T.bg};background-image:linear-gradient(rgba(0,0,0,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.05) 1px,transparent 1px);background-size:36px 36px`;
const tTopo = `<div style="position:absolute;left:70px;right:70px;top:54px;display:flex;justify-content:space-between;${ANTON};font-size:24px;letter-spacing:.06em;color:#4a4a4a"><span>EDUARDA CARACIOLO</span><span>DIREITO CIVIL &amp; ECA</span></div>`;
const tRodape = `<div style="position:absolute;left:70px;right:70px;bottom:50px;display:flex;align-items:center;gap:16px;${FIG};font-size:22px;color:#333;z-index:5"><div style="width:44px;height:44px;border-radius:50%;background:${T.pink};color:#fff;display:flex;align-items:center;justify-content:center;${ANTON};font-size:18px">EC</div>${ARROBA}<div style="flex:1;height:1.5px;background:#333"></div><span style="${ANTON};letter-spacing:.06em">ADVOGADA</span></div>`;

const TREND = {
  capa(s, ctx) {
    const f = s.foto ? `<div style="position:absolute;right:0;top:130px;bottom:120px;width:500px">${img(ctx, s.foto, { pos: s.fotoPos || 'center' })}</div>` : '';
    return `<div style="position:absolute;inset:0;${tFundo}">${tTopo}${f}
      <div data-area style="position:absolute;left:70px;${s.foto ? 'width:640px' : 'right:70px'};top:170px;bottom:150px;display:flex;flex-direction:column;justify-content:center;gap:34px;z-index:3">
        ${tTit(s.titulo, s.ts || (s.foto ? 122 : 150))}
        ${s.texto ? `<div style="max-width:${s.foto ? 470 : 820}px">${tCorpo(s.texto, 32, '#222', 'left')}</div>` : ''}
      </div>${brilho(s.foto ? 600 : 880, 1060, 90, T.roxo, 8)}${tRodape}</div>`;
  },
  texto(s) {
    const caixa = s.caixa ? (s.destaque
      ? `<div style="position:relative;background:${T.pink};outline:2.5px dashed rgba(0,0,0,.45);outline-offset:-12px;padding:44px 52px;margin-top:48px">${tCorpo(s.caixa, 33, '#fff')}</div>`
      : `<div style="position:relative;border:2.5px dashed #2a2a2a;padding:40px 50px;margin-top:48px">${tCorpo(s.caixa, 31)}</div>`) : '';
    return `<div style="position:absolute;inset:0;${tFundo}">${cantos('#222')}
      <div data-area style="position:absolute;left:100px;right:100px;top:150px;bottom:150px;display:flex;flex-direction:column;justify-content:center;text-align:center;gap:34px">
        ${s.kicker ? tCorpo(s.kicker, 34, '#222') : ''}
        ${tTit(s.titulo, s.ts || 96)}
        ${caixa}
      </div>${s.caixa && !s.destaque ? brilho(850, 1030, 110, T.roxo, 0) + brilho(800, 1120, 50, T.roxo, 0) : ''}</div>`;
  },
  lista(s) {
    const m = { ...tM, hl: `background:linear-gradient(transparent 17%,${T.pink} 17%,${T.pink} 90%,transparent 90%);color:#fff;padding:0 .12em`, acc: 'color:#FFB3DA', i: 'color:#FFB3DA' };
    return `<div style="position:absolute;inset:0;background:${T.roxo}">
      <div data-area style="position:absolute;left:100px;right:100px;top:130px;bottom:130px;display:flex;flex-direction:column;justify-content:center;gap:26px">
        ${s.kicker ? `<div data-corpo style="${FIG};font-size:33px;line-height:1.3;color:#fff">${fmt(s.kicker, m)}</div>` : ''}
        ${tTit(s.titulo, s.ts || 88, m, '#fff')}
        ${s.subtitulo ? `<div data-corpo style="${FIG};font-size:31px;color:#fff;margin-top:22px">${fmt(s.subtitulo, m)}</div>` : ''}
        <div style="border-top:1.5px solid rgba(255,255,255,.55)">
          ${lista(s.itens).map(t => `<div style="display:flex;align-items:center;gap:30px;padding:24px 4px;border-bottom:1.5px solid rgba(255,255,255,.55)"><svg width="44" height="44" viewBox="0 0 100 100" style="flex:none"><path d="M50 0 C54 36 64 46 100 50 C64 54 54 64 50 100 C46 64 36 54 0 50 C36 46 46 36 50 0Z" fill="${T.pink}"/></svg><div data-corpo style="${FIG};font-size:31px;line-height:1.3;color:#fff">${fmt(t, m)}</div></div>`).join('')}
        </div>
      </div></div>`;
  },
  item(s) {
    return `<div style="position:absolute;inset:0;${tFundo}">${cantos('#222')}
      <div data-area style="position:absolute;left:100px;right:100px;top:140px;bottom:140px;display:flex;flex-direction:column;justify-content:center;gap:32px">
        <div style="${ANTON};font-size:150px;line-height:.9;color:${T.pink}">${dois(s.numero)}</div>
        ${tTit(s.titulo, s.ts || 92)}
        ${s.fala ? `<div style="background:${T.pink};outline:2.5px dashed rgba(0,0,0,.4);outline-offset:-12px;padding:36px 46px;align-self:flex-start;max-width:860px">${tCorpo(s.fala, 32, '#fff', 'left')}</div>` : ''}
        ${s.texto ? tCorpo(s.texto, 32, '#222', 'left') : ''}
      </div></div>`;
  },
  cta(s) {
    return `<div style="position:absolute;inset:0;${tFundo}">${tTopo}
      <div data-area style="position:absolute;left:100px;right:100px;top:170px;bottom:170px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;gap:40px">
        ${s.kicker ? tCorpo(s.kicker, 34, '#222') : ''}
        ${tTit(s.titulo, s.ts || 120)}
        ${s.texto ? `<div style="max-width:780px">${tCorpo(s.texto, 33)}</div>` : ''}
        ${s.botao ? `<div style="background:${T.ink};color:#fff;${ANTON};font-size:40px;letter-spacing:.04em;padding:22px 54px;border-radius:999px;text-transform:uppercase">${fmt(s.botao, { acc: `color:${T.pink}`, i: `color:${T.pink}` })}</div>` : ''}
      </div>${brilho(130, 1020, 100, T.pink, 0)}${brilho(215, 1110, 46, T.roxo, 0)}${brilho(860, 230, 80, T.roxo, 0)}${tRodape}</div>`;
  },
};

// ================= STUDIO =================
const S = { bg: '#1C1C1F', ink: '#F3F0EC', mut: '#A9A5A2', acc: '#EEA2B8', chip: '#E4E1DC' };
const sM = (acc = S.acc) => ({ i: `${SCRIPT};color:${acc};font-size:1.32em;line-height:0;position:relative;top:.06em;letter-spacing:0;padding:0 .08em`, acc: `color:${acc}`, b: 'font-weight:700;color:#fff', hl: `background:${S.chip};color:#222;padding:0 .14em` });
const sTit = (t, px, cor = S.ink, al = 'center', m = sM()) => `<div data-titulo style="${SERIF};font-size:${px}px;line-height:.98;letter-spacing:-.02em;color:${cor};text-align:${al}">${fmt(t, m)}</div>`;
const sCorpo = (t, px = 30, cor = '#DAD6D2', al = 'center', m = sM()) => `<div data-corpo style="${FIG};font-size:${px}px;line-height:1.28;letter-spacing:-.01em;color:${cor};text-align:${al}">${fmt(t, m)}</div>`;
const sMicro = (cor = '#77736F') => [48, H - 64].map(y => `<div style="position:absolute;left:60px;right:60px;top:${y}px;display:flex;justify-content:space-between;${FIG};font-size:15px;font-weight:500;color:${cor};z-index:6">${'<span>eduarda caraciolo · <b>advogada</b></span>'.repeat(3)}</div>`).join('');
const sFundo = `background:${S.bg}`;

const STUDIO = {
  capa(s, ctx) {
    return `<div class="ruido" style="position:absolute;inset:0;${sFundo}">
      <div style="position:absolute;left:0;right:0;top:0;height:${s.fotoAltura || 930}px">${img(ctx, s.foto, { pos: s.fotoPos || 'center 30%' })}<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(28,28,31,.25) 0%,rgba(28,28,31,0) 35%,rgba(28,28,31,.35) 62%,${S.bg} 100%)"></div></div>
      ${sMicro('#cfcac5')}
      <div data-area style="position:absolute;left:80px;right:80px;top:560px;bottom:120px;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:26px;z-index:3">
        ${s.kicker ? `<div style="background:#F3F0EC;color:#1C1C1F;${FIG};font-weight:500;font-size:34px;letter-spacing:.02em;padding:4px 18px;text-transform:uppercase">${fmt(s.kicker)}</div>` : ''}
        ${sTit(s.titulo, s.ts || 132)}
        ${s.texto ? `<div style="max-width:700px">${sCorpo(s.texto, 29)}</div>` : ''}
      </div></div>`;
  },
  texto(s) {
    const dias = ['SEG', 'TER', 'QUA', 'QUI', 'SEX'], pontos = [[0, 1], [1, 0], [2, 1], [3, 0], [4, 2], [1, 2], [3, 2]];
    const grade = s.grade === false ? '' : `<div style="position:absolute;left:10px;right:-120px;top:${H - 410}px;height:560px;transform:rotate(-8deg);transform-origin:center;display:grid;grid-template-columns:repeat(5,1fr);border-top:1.5px solid ${S.acc}99">
      ${dias.map((d, i) => `<div style="position:relative;border-left:1.5px solid ${S.acc}99;${FIG};font-size:28px;color:${S.acc};padding:18px 26px">${d}${pontos.filter(p => p[0] === i).map(p => `<div style="position:absolute;left:50%;top:${110 + p[1] * 110}px;width:30px;height:30px;border-radius:50%;background:${S.acc}"></div>`).join('')}</div>`).join('')}
      <div style="position:absolute;left:0;right:0;top:82px;border-top:1.5px solid ${S.acc}99"></div></div>`;
    return `<div class="ruido" style="position:absolute;inset:0;${sFundo}">${sMicro()}
      <div style="position:absolute;left:0;right:0;top:120px;height:120px;display:flex;justify-content:center"><svg width="110" height="52" viewBox="0 0 110 52" fill="none" stroke="#F3F0EC" stroke-width="2.2"><ellipse cx="24" cy="26" rx="21" ry="23"/><ellipse cx="55" cy="26" rx="21" ry="23"/><ellipse cx="86" cy="26" rx="21" ry="23"/></svg></div>
      <div data-area style="position:absolute;left:110px;right:110px;top:250px;bottom:${s.grade === false ? 150 : 470}px;display:flex;flex-direction:column;justify-content:center;gap:40px">
        ${s.kicker ? sCorpo(s.kicker, 31) : ''}
        ${sTit(s.titulo, s.ts || 118)}
        ${s.texto ? sCorpo(s.texto, 30) : ''}
      </div>${grade}</div>`;
  },
  lista(s) {
    const itens = lista(s.itens);
    return `<div class="ruido" style="position:absolute;inset:0;${sFundo}">${sMicro()}
      <div data-area style="position:absolute;left:110px;right:110px;top:150px;bottom:140px;display:flex;flex-direction:column;justify-content:center;gap:48px">
        ${sTit(s.titulo, s.ts || 100, S.ink, 'left')}
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px 22px">
          ${itens.map(t => `<div style="background:${S.chip};color:#26262a;padding:14px 22px;text-align:center"><div data-corpo style="${FIG};font-size:27px;line-height:1.1;letter-spacing:-.01em">${fmt(t, sM('#B04E6D'))}</div></div>`).join('')}
        </div>
        ${s.texto ? `<div style="display:flex;justify-content:flex-end"><div style="width:520px;border-top:1.5px solid ${S.ink};border-right:1.5px solid ${S.ink};height:56px;margin-right:70px"></div></div><div style="margin-top:-30px">${sCorpo(s.texto, 34, S.ink, 'right')}</div>` : ''}
      </div></div>`;
  },
  item(s) {
    return `<div class="ruido" style="position:absolute;inset:0;${sFundo}">${sMicro()}
      <div data-area style="position:absolute;left:110px;right:110px;top:140px;bottom:140px;display:flex;flex-direction:column;justify-content:center;gap:34px">
        <div style="${SCRIPT};font-size:190px;line-height:.7;color:${S.acc}">${s.numero}</div>
        ${sTit(s.titulo, s.ts || 104, S.ink, 'left')}
        ${s.texto ? sCorpo(s.texto, 31, '#DAD6D2', 'left') : ''}
      </div></div>`;
  },
  faixa(s, ctx) {
    const acc = '#C2557A', m = sM(acc);
    return `<div style="position:absolute;inset:0;background:#ECEAE6">
      <div style="position:absolute;left:0;right:0;top:0;height:330px;filter:grayscale(.85) contrast(1.05)">${img(ctx, s.foto, { pos: s.fotoPos || 'center 20%' })}</div>
      <div style="position:absolute;left:0;right:0;bottom:0;height:300px;filter:grayscale(.85) contrast(1.05)">${img(ctx, s.foto2 || s.foto, { pos: s.foto2Pos || 'center 85%' })}</div>
      ${sMicro('#8d8985')}
      <div data-area style="position:absolute;left:110px;right:110px;top:380px;bottom:350px;display:flex;flex-direction:column;justify-content:center;gap:36px">
        <div data-titulo style="${TIGHT};font-weight:800;font-size:${s.ts || 96}px;line-height:.95;letter-spacing:-.05em;color:#111">${fmt(s.titulo, m)}</div>
        ${s.texto ? `<div style="display:flex;gap:26px;align-items:stretch;padding-left:10px"><div style="width:26px;flex:none;border:2px solid #111;border-right:none;border-radius:40px 0 0 40px"></div><div data-corpo style="${FIG};font-size:30px;line-height:1.25;letter-spacing:-.01em;color:#222">${fmt(s.texto, { ...m, b: 'font-weight:800;color:#111' })}</div></div>` : ''}
      </div></div>`;
  },
  cta(s) {
    return `<div class="ruido" style="position:absolute;inset:0;${sFundo}">${sMicro()}
      <div data-area style="position:absolute;left:110px;right:110px;top:150px;bottom:150px;display:flex;flex-direction:column;justify-content:center;gap:30px">
        ${s.kicker ? `<div style="width:380px;align-self:flex-start;margin-left:40px">${sCorpo(s.kicker, 29, S.ink, 'right')}</div>` : ''}
        ${sTit(s.titulo, s.ts || 116)}
        ${s.texto ? `<div style="position:relative;border:2px solid ${S.ink};padding:34px 44px 62px;margin:20px 30px 0">${sCorpo(s.texto, 31, S.ink)}
          ${s.botao ? `<div style="position:absolute;left:50%;bottom:-30px;transform:translateX(-50%);background:${S.ink};color:#1C1C1F;${FIG};font-weight:500;font-size:30px;padding:8px 26px;white-space:nowrap">${fmt(s.botao)}</div>` : ''}</div>` : ''}
      </div></div>`;
  },
};

// ================= SCRAP =================
const P = { bg: '#EAE8E3', ink: '#111', amarelo: '#FFE45E', rosa: '#EF6FA3', legenda: '#E27497' };
const pM = { i: "font-weight:300;font-style:italic;letter-spacing:-.04em", hl: `background:${P.amarelo};padding:0 .12em`, acc: 'text-decoration:underline;text-decoration-thickness:.07em;text-underline-offset:.08em', b: 'font-weight:800' };
const pBal = { ...pM, b: `font-weight:800;color:${P.amarelo}`, i: 'font-style:italic;font-weight:300' };
const pTit = (t, px, cor = P.ink, al = 'left') => `<div data-titulo style="${TIGHT};font-weight:800;font-size:${px}px;line-height:.94;letter-spacing:-.05em;word-spacing:.06em;color:${cor};text-align:${al}">${fmt(t, pM)}</div>`;
const pCorpo = (t, px = 34, cor = '#1a1a1a', al = 'left', m = pM) => `<div data-corpo style="${TIGHT};font-weight:400;font-size:${px}px;line-height:1.2;letter-spacing:-.035em;color:${cor};text-align:${al}">${fmt(t, m)}</div>`;
const pFundo = (bg = P.bg) => `background-color:${bg};background-image:linear-gradient(rgba(0,0,0,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.035) 1px,transparent 1px);background-size:54px 54px`;
const pTopo = (cor = '#111') => `<div style="position:absolute;left:70px;right:70px;top:50px;display:flex;justify-content:space-between;${TIGHT};font-size:21px;letter-spacing:.01em;color:${cor};z-index:6"><span style="font-weight:500">EDUARDA CARACIOLO</span><span style="font-weight:800">ADVOGADA · CIVIL E ECA</span></div>`;
const pAssina = (y, x = 120, cor = '#111') => `<div style="position:absolute;left:${x}px;top:${y}px;${TIGHT};font-size:22px;line-height:1.15;color:${cor};z-index:6"><div style="font-weight:500;letter-spacing:.06em">EDUARDA CARACIOLO</div><div style="font-weight:800">ADVOGADA · DIREITO CIVIL E ECA</div></div>`;

const SCRAP = {
  capa(s, ctx) {
    const dias = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'], hoje = s.dia ?? 7, nums = [6, 7, 8, 9, 10, 11, 12].map(n => n + (hoje - 7));
    const horas = ['13:00', '14:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
    return `<div class="ruido" style="position:absolute;inset:0;${pFundo('#EEEDEA')}">
      <div style="position:absolute;left:60px;right:60px;top:40px;display:grid;grid-template-columns:repeat(7,1fr);text-align:center;${TIGHT};color:#555;font-size:26px;gap:4px">
        ${dias.map(d => `<div>${d}</div>`).join('')}${nums.map((n, i) => `<div style="margin-top:14px;font-size:36px;color:#333"><span style="display:inline-block;width:70px;height:70px;line-height:70px;border-radius:50%;${i === 1 ? `background:${P.amarelo}` : ''}">${n}</span></div>`).join('')}
      </div>
      ${horas.map((h, i) => `<div style="position:absolute;left:30px;right:0;top:${330 + i * 132}px;display:flex;align-items:center;gap:24px;${TIGHT};font-size:24px;color:#777"><span style="width:80px">${h}</span><div style="flex:1;height:1.5px;background:rgba(0,0,0,.12)"></div></div>`).join('')}
      ${s.foto ? `<div style="position:absolute;right:70px;top:190px;width:330px;height:330px;border-radius:50%;overflow:hidden;border:10px solid #fff;box-shadow:0 14px 30px rgba(0,0,0,.25);transform:rotate(6deg);z-index:3">${img(ctx, s.foto, { pos: s.fotoPos || 'center 30%' })}</div>` : ''}
      ${estrela(s.foto ? 140 : 820, 470, 70, P.amarelo, -12)}${estrela(930, 1000, 54, P.amarelo, 10)}
      <div data-area style="position:absolute;left:80px;right:80px;top:${s.foto ? 540 : 360}px;bottom:300px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:30px;z-index:3">
        ${pTit(s.titulo, s.ts || 104, P.ink, 'center')}
        ${s.texto ? `<div style="max-width:800px">${pCorpo(s.texto, 34, '#222', 'center')}</div>` : ''}
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="#111" stroke-width="2.5"><circle cx="32" cy="32" r="29"/><path d="M18 32 H45 M36 23 L45 32 L36 41" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      ${abas(H - 250)}${pAssina(H - 110)}</div>`;
  },
  item(s) {
    return `<div class="ruido" style="position:absolute;inset:0;${pFundo()}">${pTopo()}
      <div data-area style="position:absolute;left:80px;right:80px;top:130px;bottom:560px;display:flex;flex-direction:column;justify-content:center;gap:56px;z-index:3">
        ${pTit(`${dois(s.numero)}. ${s.titulo}`, s.ts || 108)}
        ${s.fala ? balao(fmt(s.fala, pBal), { rot: -1.2, rabo: 'baixo-esq', tam: 34, extra: 'margin-right:30px' }) : ''}
      </div>
      ${estrela(930, 170, 60, P.amarelo, 12)}${estrela(70, 770, 50, P.amarelo, -8)}${brilho(900, 700, 70, '#111', 0)}
      ${rasgo(H - 520, '#111', s.numero * 13 + 5)}
      <div data-area style="position:absolute;left:110px;right:110px;top:${H - 450}px;bottom:110px;display:flex;flex-direction:column;justify-content:center;z-index:3">
        ${pCorpo(s.texto || '', 38, '#fff', 'center', { ...pM, b: 'font-weight:800', hl: 'background:#FFE45E;color:#111;padding:0 .12em' })}
      </div>
      ${pAssina(H - 84, 80, '#bbb')}</div>`;
  },
  janela(s) {
    return `<div class="ruido" style="position:absolute;inset:0;background:#141414">
      <div style="position:absolute;left:70px;right:90px;top:140px;bottom:120px;background:#E7E6E3;transform:rotate(-2deg);box-shadow:0 20px 50px rgba(0,0,0,.5);z-index:2">
        <div style="position:absolute;left:50%;top:-34px;width:190px;height:62px;margin-left:-95px;background:rgba(235,220,190,.85);transform:rotate(3deg)"></div>
        <div style="position:absolute;right:40px;top:34px;display:flex;gap:14px">${['#2BC255', '#F6B92F', '#EE5A52'].map(c => `<div style="width:26px;height:26px;border-radius:50%;background:${c}"></div>`).join('')}</div>
        <div style="position:absolute;left:60px;top:40px;${TIGHT};font-size:19px;line-height:1.15;color:#111"><div style="font-weight:500">EDUARDA CARACIOLO</div><div style="font-weight:800">ADVOGADA · CIVIL E ECA</div></div>
        <div data-area style="position:absolute;left:60px;right:60px;top:130px;bottom:60px;display:flex;flex-direction:column;justify-content:center;gap:56px">
          ${pTit(s.titulo, s.ts || 96)}
          ${s.fala ? balao(fmt(s.fala, pBal), { rot: -3, rabo: 'baixo-esq', tam: 32 }) : ''}
          ${s.texto ? pCorpo(s.texto, 33, '#161616', 'center') : ''}
        </div>
      </div>
      ${estrela(900, 90, 64, P.amarelo, 10)}${estrela(60, 1180, 56, P.amarelo, -10)}</div>`;
  },
  lista(s) {
    return `<div style="position:absolute;inset:0;background:#F7E7A6">
      <div class="ruido" style="position:absolute;left:66px;right:66px;top:48px;bottom:0;background:#F1E4CC"></div>
      ${estrela(20, 330, 60, '#111', 0)}
      <div data-area style="position:absolute;left:130px;right:130px;top:130px;bottom:300px;display:flex;flex-direction:column;justify-content:center;gap:40px;z-index:3">
        ${pTit(s.titulo, s.ts || 100)}
        ${s.kicker ? pCorpo(s.kicker, 34) : ''}
        <div style="display:flex;flex-direction:column;gap:24px">
          ${lista(s.itens).map(t => `<div style="display:flex;gap:22px;align-items:flex-start"><svg width="34" height="34" viewBox="0 0 100 100" style="flex:none;margin-top:6px"><path d="M50 4 L62 36 L96 38 L69 59 L79 94 L50 73 L21 94 L31 59 L4 38 L38 36Z" fill="#111"/></svg>${pCorpo(t, 36)}</div>`).join('')}
        </div>
      </div>
      <div style="position:absolute;left:0;right:0;top:0;bottom:0;z-index:2">${abas(H - 260)}</div>${pAssina(H - 110, 0, '#111').replace('left:0px', 'left:0;right:0;text-align:center')}</div>`;
  },
  legenda(s, ctx) {
    const y = typeof s.y === 'number' ? s.y : { topo: 200, meio: 620, base: 860 }[s.y || 'base'];
    const [e1, e2] = s.emojis || ['🥴', '😵'];
    const linhas = String(s.texto || '').split('\n');
    return `<div style="position:absolute;inset:0;background:#222">${img(ctx, s.foto, { pos: s.fotoPos || 'center' })}
      <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.28) 0%,rgba(0,0,0,0) 16%,rgba(0,0,0,0) 60%,rgba(0,0,0,.25) 100%)"></div>
      <div style="position:absolute;left:60px;right:60px;top:52px;display:flex;justify-content:space-between;${TIGHT};font-size:24px;color:#fff;letter-spacing:-.01em"><span style="font-weight:300">${ARROBA}</span><span style="font-weight:700">Advogada</span></div>
      <div data-area style="position:absolute;left:70px;right:70px;top:${y}px;display:flex;justify-content:center">
        <div style="position:relative;text-align:center">
          <div data-corpo style="${TIGHT};font-size:${s.tam || 46}px;line-height:1.18;letter-spacing:-.045em;color:#fff">${linhas.map(l => `<span style="background:${P.legenda};padding:.02em .28em;${CLONE}">${fmt(l, { b: 'font-weight:800', i: 'font-style:italic;font-weight:300' })}</span>`).join('<br>')}</div>
          <div data-livre style="position:absolute;right:-50px;top:-40px;font-family:'Noto Color Emoji';font-size:58px">${e1}</div>
          <div data-livre style="position:absolute;left:-66px;bottom:-44px;font-family:'Noto Color Emoji';font-size:58px">${e2}</div>
        </div>
      </div></div>`;
  },
  pergunta(s) {
    return `<div class="ruido" style="position:absolute;inset:0;${pFundo('#EFEEEA')}">
      <div style="position:absolute;left:0;right:0;top:58px;text-align:center;${TIGHT};font-weight:500;font-size:24px;letter-spacing:.02em;color:#222">${ARROBA.toUpperCase()}</div>
      ${estrela(880, 200, 60, '#111', 10)}${estrela(840, 690, 52, '#111', -6)}${brilho(120, 1000, 70, '#111', 0)}
      <div data-area style="position:absolute;left:110px;right:110px;top:180px;bottom:280px;display:flex;flex-direction:column;justify-content:center;gap:70px">
        ${pTit(s.titulo, s.ts || 118)}
        ${s.texto ? balao(fmt(s.texto, { ...pM, b: 'font-weight:800' }), { bg: '#FFE97A', cor: '#111', rabo: 'baixo-esq', tam: 36, extra: 'margin-right:60px' }) : ''}
      </div>
      ${pAssina(H - 190, 110)}</div>`;
  },
};
SCRAP.texto = SCRAP.janela;
SCRAP.cta = SCRAP.pergunta;

// ================= BLOCOS =================
const B = {
  marrom: ['#6E4A2F', 'rgba(255,255,255,.2)'], verde: ['#17A34A', 'rgba(255,255,255,.2)'], agua: ['#23977A', 'rgba(255,255,255,.2)'],
  roxo: ['#5847D3', 'rgba(255,255,255,.2)'], rosa: ['#D2557D', 'rgba(255,255,255,.22)'], grafite: ['#262629', 'rgba(255,255,255,.14)'], claro: ['#F1F0EE', '#111'],
};
const BLOCOS = {};
BLOCOS.capa = BLOCOS.dica = BLOCOS.lista = BLOCOS.cta = BLOCOS.texto = function (s, ctx, c) {
  const [bg, barra] = B[s.cor || c.cor] || B.marrom, claro = bg === B.claro[0];
  const tinta = claro ? '#111' : '#fff';
  const tit = s.titulo ? `<div data-titulo style="${TIGHT};font-weight:600;font-size:${s.ts || (s.tipo === 'capa' ? 100 : 86)}px;line-height:1.13;letter-spacing:-.05em;color:#fff;text-align:center">${String(s.titulo).split('\n').map(l => `<span style="background:${barra};padding:0 .14em;${CLONE}">${fmt(l, { i: "font-style:italic;font-weight:400", acc: 'color:#FFE08A', b: 'font-weight:800' })}</span>`).join('<br>')}</div>` : '';
  const sub = s.sub ? `<div data-corpo style="${ANTON};font-size:30px;letter-spacing:.03em;text-transform:uppercase;color:${tinta};text-align:center">${fmt(s.sub)}</div>` : '';
  const caixas = lista(s.caixas).length ? `<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:16px">${lista(s.caixas).map(t => `<div style="background:#fff;color:#111;padding:8px 18px;border:${claro ? '1.5px solid #111' : 'none'}"><div data-corpo style="${FIG};font-size:28px;line-height:1.1;letter-spacing:-.01em;text-align:center">${fmt(t)}</div></div>`).join('')}</div>` : '';
  const txt = s.texto ? `<div data-corpo style="${TIGHT};font-weight:400;font-size:30px;line-height:1.2;letter-spacing:-.03em;color:#fff;text-align:center">${String(s.texto).split('\n').map(l => `<span style="background:${claro ? '#111' : 'rgba(255,255,255,.14)'};padding:.03em .3em;${CLONE}">${fmt(l, { b: 'font-weight:700' })}</span>`).join('<br>')}</div>` : '';
  const cols = lista(s.colunas).length ? `<div style="display:flex;justify-content:center;gap:120px">${lista(s.colunas).map(k => `<div style="text-align:center;color:${tinta}"><div style="font-family:'Noto Color Emoji';font-size:44px">${k.sim === false ? '❌' : '✅'}</div><div style="${ANTON};font-size:30px;letter-spacing:.02em;margin-top:8px">${esc(k.titulo)}</div><div data-corpo style="${ANTON};font-size:22px;letter-spacing:.02em;opacity:.9;margin-top:6px">${esc(k.texto || '')}</div></div>`).join('')}</div>` : '';
  const alt = s.foto ? s.fotoAltura || 420 : 0;
  return `<div style="position:absolute;inset:0;background:${bg}">
    <div style="position:absolute;left:0;right:0;top:56px;text-align:center;${TIGHT};font-size:22px;color:${tinta};opacity:.85;letter-spacing:-.01em">Eduarda <i style="font-weight:600">Caraciolo</i></div>
    <div data-area style="position:absolute;left:70px;right:70px;top:120px;bottom:${s.foto ? alt + 120 : 110}px;display:flex;flex-direction:column;justify-content:center;gap:26px">
      ${tit}${sub}${caixas}${txt}${cols}
    </div>
    ${s.foto ? `<div style="position:absolute;left:80px;right:80px;bottom:90px;height:${alt}px;border-radius:26px;overflow:hidden;box-shadow:0 12px 30px rgba(0,0,0,.25)">${img(ctx, s.foto, { pos: s.fotoPos || 'center' })}</div>` : ''}
  </div>`;
};

const ESTILOS = { trend: TREND, studio: STUDIO, scrap: SCRAP, blocos: BLOCOS };

export function renderCarrossel(c) {
  const estilo = ESTILOS[c.estilo] || TREND;
  const ctx = { imgs: c._imgs || {}, faltando: new Set() };
  const avisos = [];
  if (!ESTILOS[c.estilo]) avisos.push(`estilo "${c.estilo}" não existe (${Object.keys(ESTILOS).join(', ')}); usei trend`);
  let n = 0;
  const slides = (c.slides || []).map((s, i) => {
    const f = estilo[s.tipo];
    if (!f) { avisos.push(`slide ${i + 1}: tipo "${s.tipo}" não existe no estilo ${c.estilo} (${Object.keys(estilo).join(', ')})`); return ''; }
    if (s.tipo === 'item' && s.numero == null) s = { ...s, numero: ++n };
    return `<div id="slide-${i + 1}" style="position:absolute;left:${i * W}px;top:0;width:${W}px;height:${H}px;overflow:hidden">${f(s, ctx, c)}</div>`;
  });
  ctx.faltando.forEach(nome => avisos.push(`foto não encontrada: ${nome} (coloque em fotos/ ou imagens/)`));
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<link href="${FONTES}" rel="stylesheet">
<style>*{box-sizing:border-box}body{margin:0;-webkit-font-smoothing:antialiased}
.ruido::after{content:"";position:absolute;inset:0;pointer-events:none;z-index:5;opacity:.5;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 .22 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}</style>
</head><body><div id="painel" style="position:relative;width:${slides.length * W}px;height:${H}px">${slides.join('\n')}</div></body></html>`;
  return { html, total: slides.length, avisos };
}
