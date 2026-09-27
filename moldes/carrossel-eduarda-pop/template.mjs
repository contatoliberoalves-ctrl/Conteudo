// Carrossel Eduarda Pop: estilos de carrossel "de Instagram de agora" para a Eduarda Caraciolo
// (Advogada · Direito Civil e ECA), a partir das referências que ela separou.
// Regra da marca (vale para todos os estilos e para o Post Eduarda): só as 5 cores da paleta + branco como
// contracor, e 3 fontes: Inter Tight (títulos e texto), Gloock (serifa) e Yellowtail (cursiva do *destaque*).
// Em comum: cabeçalho EDUARDA CARACIOLO · ADVOGADA, palavra em cursiva, brilho ✦ e formas em pílula.
//   "trend"  (moderno)      capa blush quadriculada e páginas brancas, títulos pesados em caixa-alta, caixas tracejadas, disco de vinil (era)
//   "studio" (moderno)      fundo branco (ou rosa-escuro), títulos em serifa, etiquetas em pílula, enfeite de morcegos opcional
//   "scrap"  (descontraído) papel branco, grotesca pesada minúscula, balões de fala, estrelas, papel rasgado, legenda sobre foto
//   "blocos" (descontraído) fundo de uma cor da paleta por slide, título em faixas, pílulas brancas, foto embaixo
// Marcação no texto: **negrito**, *palavra em cursiva*, ==caixa de destaque==, {cor}, \n quebra a linha.

const ARROBA = '@eduardacaraciolo';
const FONTES = 'https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400&family=Gloock&family=Yellowtail&family=Noto+Color+Emoji&display=swap';
const W = 1080, H = 1350;
// Paleta (dopely.colors) + branco.
const C = { blush: '#FFEBED', claro: '#FEBAC5', escuro: '#F4789A', pink: '#FC79AB', pessego: '#FEA9AC', branco: '#FFFFFF' };
const CLONE = 'box-decoration-break:clone;-webkit-box-decoration-break:clone';
const TIGHT = "font-family:'Inter Tight','Noto Color Emoji',sans-serif";
const SERIF = "font-family:'Gloock',serif;font-weight:400";
const CURSIVA = "font-family:'Yellowtail',cursive;font-weight:400;letter-spacing:0;text-transform:none";

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const lista = v => (v == null ? [] : Array.isArray(v) ? v : [v]);
const dois = n => String(n).padStart(2, '0');
// m = { b: estilo do **negrito**, i: cor da *cursiva*, hl: estilo da ==caixa==, acc: do {cor}, cursiva: tamanho relativo }
function fmt(t, m = {}) {
  return esc(t)
    .replace(/\*\*(.+?)\*\*/g, `<b style="${m.b || 'font-weight:700'}">$1</b>`)
    .replace(/==(.+?)==/g, `<span style="${m.hl || ''};${CLONE}">$1</span>`)
    .replace(/\{(.+?)\}/g, `<span style="${m.acc || ''}">$1</span>`)
    .replace(/\*(.+?)\*/g, `<span style="${CURSIVA};font-size:${m.cursiva || 1.12}em;line-height:0;${m.i ? 'color:' + m.i : ''}">$1</span>`)
    .replace(/\n/g, '<br>');
}

// ---------- imagens ----------
function img(ctx, nome, { pos = 'center', estilo = '' } = {}) {
  const src = nome && ctx.imgs[nome];
  // Véu rosa (soft-light) para as fotos ornarem com a paleta.
  if (src) return `<div data-foto style="position:relative;width:100%;height:100%;${estilo}"><img src="${src}" style="width:100%;height:100%;object-fit:cover;object-position:${esc(pos)};display:block;filter:saturate(.85)"><div style="position:absolute;inset:0;background:${C.pink};mix-blend-mode:color;opacity:.16"></div><div style="position:absolute;inset:0;background:${C.claro};mix-blend-mode:soft-light;opacity:.6"></div></div>`;
  if (nome) ctx.faltando.add(nome);
  return `<div data-foto style="width:100%;height:100%;background:linear-gradient(160deg,${C.claro},${C.pessego});display:flex;align-items:center;justify-content:center;${estilo}"><span style="${SERIF};font-size:150px;color:#fff">EC</span></div>`;
}

// ---------- elementos da marca ----------
const brilho = (x, y, px, cor, rot = 0) => `<svg style="position:absolute;left:${x}px;top:${y}px;width:${px}px;height:${px}px;transform:rotate(${rot}deg);z-index:4" viewBox="0 0 100 100"><path d="M50 0 C54 36 64 46 100 50 C64 54 54 64 50 100 C46 64 36 54 0 50 C36 46 46 36 50 0Z" fill="${cor}"/></svg>`;
const estrela = (x, y, px, cor, rot = 0) => `<svg style="position:absolute;left:${x}px;top:${y}px;width:${px}px;height:${px}px;transform:rotate(${rot}deg);z-index:4" viewBox="0 0 100 100"><path d="M50 4 L62 36 L96 38 L69 59 L79 94 L50 73 L21 94 L31 59 L4 38 L38 36Z" fill="${cor}" stroke-linejoin="round"/></svg>`;
const cantos = cor => `
  <svg style="position:absolute;left:44px;top:44px;width:60px;height:60px" viewBox="0 0 60 60"><path d="M8 56 V8 H56" fill="none" stroke="${cor}" stroke-width="2"/><rect x="3" y="3" width="10" height="10" fill="#fff" stroke="${cor}" stroke-width="2"/></svg>
  <svg style="position:absolute;right:44px;bottom:44px;width:60px;height:60px" viewBox="0 0 60 60"><path d="M52 4 V52 H4" fill="none" stroke="${cor}" stroke-width="2"/><rect x="47" y="47" width="10" height="10" fill="#fff" stroke="${cor}" stroke-width="2"/></svg>`;
// Cabeçalho comum a todos os estilos.
const topo = (cor, y = 54) => `<div style="position:absolute;left:70px;right:70px;top:${y}px;display:flex;justify-content:space-between;${TIGHT};font-size:20px;letter-spacing:.14em;color:${cor};z-index:6"><span style="font-weight:600">EDUARDA CARACIOLO</span><span style="font-weight:800">ADVOGADA · CIVIL E ECA</span></div>`;
const arroba = (cor, y = H - 80) => `<div style="position:absolute;left:0;right:0;top:${y}px;display:flex;justify-content:center;z-index:6"><div style="${TIGHT};font-weight:600;font-size:22px;letter-spacing:.02em;color:${cor};border:1.5px solid ${cor};border-radius:999px;padding:6px 22px">${ARROBA}</div></div>`;
const pilula = (html, bg, cor, extra = '') => `<div style="background:${bg};color:${cor};border-radius:999px;padding:16px 44px;${TIGHT};font-weight:800;font-size:34px;letter-spacing:-.01em;${extra}">${html}</div>`;
// Barra de abas do perfil do Instagram (grade, reels, repost, marcados).
const abas = (y, cor) => {
  const ic = [
    `<rect x="4" y="4" width="7" height="7"/><rect x="14.5" y="4" width="7" height="7"/><rect x="25" y="4" width="7" height="7"/><rect x="4" y="14.5" width="7" height="7"/><rect x="14.5" y="14.5" width="7" height="7"/><rect x="25" y="14.5" width="7" height="7"/><rect x="4" y="25" width="7" height="7"/><rect x="14.5" y="25" width="7" height="7"/><rect x="25" y="25" width="7" height="7"/>`,
    `<rect x="4" y="4" width="28" height="28" rx="7" fill="none" stroke="${cor}" stroke-width="2.4"/><path d="M15 12 L24 18 L15 24Z"/>`,
    `<path d="M9 14 H26 L22 10 M27 22 H10 L14 26" fill="none" stroke="${cor}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`,
    `<rect x="4" y="4" width="28" height="28" rx="6" fill="none" stroke="${cor}" stroke-width="2.4"/><circle cx="18" cy="15" r="4.5" fill="none" stroke="${cor}" stroke-width="2.4"/><path d="M9 29 C11 22 25 22 27 29" fill="none" stroke="${cor}" stroke-width="2.4"/>`,
  ];
  return `<div style="position:absolute;left:110px;right:110px;top:${y}px;display:flex;justify-content:space-between;align-items:center;border-top:1.5px solid ${cor}66;padding-top:28px">
    ${ic.map((p, i) => `<div style="width:120px;display:flex;flex-direction:column;align-items:center;gap:10px"><svg width="40" height="40" viewBox="0 0 36 36" fill="${cor}">${p}</svg><div style="width:70px;height:3px;background:${i ? 'transparent' : cor}"></div></div>`).join('')}</div>`;
};
// Papel rasgado: borda de cima irregular (sempre igual para a mesma "semente").
function rasgo(topo, cor, semente = 7) {
  let s = semente;
  const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280), pts = [];
  for (let x = 0; x <= 100; x += 2.5) pts.push(`${x}% ${Math.round(r() * 38)}px`);
  return `<div style="position:absolute;left:-10px;right:-10px;top:${topo}px;bottom:0;background:${cor};clip-path:polygon(${pts.join(',')},100% 100%,0 100%);z-index:1"></div>`;
}
// Balão de fala com rabinho.
const balao = (html, { bg, cor = '#fff', rot = 0, rabo = 'baixo-esq', tam = 34, extra = '' } = {}) => {
  const [v, h] = rabo.split('-');
  const pos = `${h === 'esq' ? 'left:64px' : 'right:64px'};${v === 'baixo' ? 'bottom:-38px' : 'top:-38px'}`;
  const tri = `${v === 'baixo' ? 'border-top' : 'border-bottom'}:44px solid ${bg};${h === 'esq' ? 'border-right' : 'border-left'}:40px solid transparent`;
  return `<div style="position:relative;background:${bg};color:${cor};border-radius:38px;padding:30px 42px;${TIGHT};font-weight:500;font-size:${tam}px;line-height:1.16;letter-spacing:-.02em;text-align:center;transform:rotate(${rot}deg);${extra}"><div data-corpo>${html}</div><div style="position:absolute;${pos};width:0;height:0;${tri}"></div></div>`;
};
const grade = (bg, linha, px) => `background-color:${bg};background-image:linear-gradient(${linha} 1.5px,transparent 1.5px),linear-gradient(90deg,${linha} 1.5px,transparent 1.5px);background-size:${px}px ${px}px`;

// ================= TREND =================
// Blush quadriculado, títulos pesados em rosa-escuro, caixa de destaque pink com texto branco.
const tM = { acc: `color:${C.pink}`, i: C.pink, hl: `background:${C.pink};color:#fff;padding:0 .12em;border-radius:.12em`, b: 'font-weight:800' };
const tTit = (t, px, m = tM, cor = C.escuro) => `<div data-titulo style="${TIGHT};font-weight:900;font-size:${px}px;line-height:1;text-transform:uppercase;letter-spacing:-.045em;color:${cor}">${fmt(t, m)}</div>`;
const tCorpo = (t, px = 32, cor = C.escuro, al = 'center', m = tM) => `<div data-corpo style="${TIGHT};font-weight:500;font-size:${px}px;line-height:1.36;letter-spacing:-.015em;color:${cor};text-align:${al}">${fmt(t, m)}</div>`;
// Capa em blush quadriculado; as páginas seguintes em branco quadriculado (mais leve no feed).
const tFundoCapa = grade(C.blush, `${C.claro}88`, 36);
const tFundo = grade('#fff', C.blush, 36);

const TREND = {
  capa(s, ctx) {
    const f = s.foto ? `<div style="position:absolute;right:0;top:130px;bottom:130px;width:440px;border-radius:220px 0 0 220px;overflow:hidden">${img(ctx, s.foto, { pos: s.fotoPos || 'center' })}</div>` : '';
    const al = s.foto ? 'left' : 'center';
    return `<div style="position:absolute;inset:0;${tFundoCapa}">${topo(C.escuro)}${f}
      <div data-area style="position:absolute;left:${s.foto ? 70 : 90}px;${s.foto ? 'width:540px' : 'right:90px'};top:170px;bottom:170px;display:flex;flex-direction:column;justify-content:center;align-items:${s.foto ? 'flex-start' : 'center'};text-align:${al};gap:40px;z-index:3">
        ${s.kicker ? pilula(fmt(s.kicker, tM), '#fff', C.escuro, 'font-size:28px;padding:10px 32px;text-transform:uppercase;letter-spacing:.08em;border:2px dashed ' + C.escuro) : ''}
        ${tTit(s.titulo, s.ts || (s.foto ? 90 : 124)).replace('color:', `text-align:${al};color:`)}
        ${s.texto ? `<div style="max-width:${s.foto ? 520 : 800}px">${tCorpo(s.texto, 33, C.escuro, al)}</div>` : ''}
      </div>${s.foto ? brilho(560, 1050, 90, C.pink, 8) : brilho(120, 190, 80, C.pink, -8) + brilho(870, 1020, 100, C.pink, 8) + brilho(820, 1110, 44, C.pessego, 0)}${arroba(C.escuro)}</div>`;
  },
  texto(s) {
    const caixa = !s.caixa ? '' : s.destaque
      ? `<div style="background:${C.pink};border-radius:40px;outline:2.5px dashed #fff;outline-offset:-14px;padding:46px 56px;margin-top:40px">${tCorpo(s.caixa, 33, '#fff', 'center', { ...tM, b: 'font-weight:800' })}</div>`
      : `<div style="border:2.5px dashed ${C.escuro};border-radius:40px;background:#fff;padding:40px 52px;margin-top:40px">${tCorpo(s.caixa, 31)}</div>`;
    return `<div style="position:absolute;inset:0;${tFundo}">${cantos(C.escuro)}
      <div data-area style="position:absolute;left:100px;right:100px;top:150px;bottom:150px;display:flex;flex-direction:column;justify-content:center;text-align:center;gap:34px">
        ${s.kicker ? tCorpo(s.kicker, 34) : ''}
        ${tTit(s.titulo, s.ts || 92)}
        ${caixa}
      </div>${s.caixa ? brilho(850, 1030, 110, C.pink, 0) + brilho(800, 1120, 50, C.pessego, 0) : ''}</div>`;
  },
  lista(s) {
    const m = { ...tM, hl: `background:#fff;color:${C.pink};padding:0 .12em;border-radius:.12em`, acc: `color:${C.blush}`, i: C.blush };
    return `<div style="position:absolute;inset:0;background:${C.pink}">${topo('#fff')}
      <div data-area style="position:absolute;left:100px;right:100px;top:140px;bottom:130px;display:flex;flex-direction:column;justify-content:center;gap:26px">
        ${s.kicker ? tCorpo(s.kicker, 33, '#fff', 'left', m) : ''}
        ${tTit(s.titulo, s.ts || 88, m, '#fff')}
        ${s.subtitulo ? `<div style="margin-top:22px">${tCorpo(s.subtitulo, 31, '#fff', 'left', m)}</div>` : ''}
        <div style="border-top:1.5px solid rgba(255,255,255,.6)">
          ${lista(s.itens).map(t => `<div style="display:flex;align-items:center;gap:30px;padding:24px 4px;border-bottom:1.5px solid rgba(255,255,255,.6)"><svg width="44" height="44" viewBox="0 0 100 100" style="flex:none"><path d="M50 0 C54 36 64 46 100 50 C64 54 54 64 50 100 C46 64 36 54 0 50 C36 46 46 36 50 0Z" fill="${C.blush}"/></svg>${tCorpo(t, 31, '#fff', 'left', m)}</div>`).join('')}
        </div>
      </div></div>`;
  },
  item(s) {
    return `<div style="position:absolute;inset:0;${tFundo}">${cantos(C.escuro)}
      <div data-area style="position:absolute;left:100px;right:100px;top:140px;bottom:140px;display:flex;flex-direction:column;justify-content:center;gap:32px">
        <div style="${TIGHT};font-weight:900;font-size:160px;line-height:.85;letter-spacing:-.06em;color:${C.pink}">${dois(s.numero)}</div>
        ${tTit(s.titulo, s.ts || 88)}
        ${s.fala ? `<div style="background:${C.pink};border-radius:40px;outline:2.5px dashed #fff;outline-offset:-14px;padding:38px 50px;align-self:flex-start;max-width:860px">${tCorpo(s.fala, 32, '#fff', 'left')}</div>` : ''}
        ${s.texto ? tCorpo(s.texto, 32, C.escuro, 'left') : ''}
      </div></div>`;
  },
  // Disco de vinil com o rótulo da "era" (posts de cultura pop, ex.: fases como álbuns).
  era(s) {
    const cor = s.cor === 'pessego' ? C.pessego : s.cor === 'escuro' ? C.escuro : C.pink;
    return `<div style="position:absolute;inset:0;${tFundo}">${topo(C.escuro)}
      <div style="position:absolute;left:50%;top:150px;width:560px;height:560px;margin-left:-280px;border-radius:50%;background:repeating-radial-gradient(circle,${C.escuro} 0 3px,#F58AA8 3px 6px);box-shadow:0 20px 40px rgba(244,120,154,.35)">
        <div style="position:absolute;left:50%;top:50%;width:250px;height:250px;margin:-125px 0 0 -125px;border-radius:50%;background:${cor};border:6px solid #fff;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;text-align:center">
          <div style="${TIGHT};font-weight:800;font-size:22px;letter-spacing:.2em">ERA</div>
          <div style="${TIGHT};font-weight:900;font-size:86px;line-height:.9;letter-spacing:-.05em">${dois(s.numero ?? 1)}</div>
          <div style="position:absolute;width:26px;height:26px;border-radius:50%;background:#fff;bottom:44px"></div>
        </div></div>
      ${brilho(160, 220, 70, C.pink, -8)}${brilho(850, 560, 56, C.pessego, 10)}
      <div data-area style="position:absolute;left:100px;right:100px;top:760px;bottom:150px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;gap:26px">
        ${s.kicker ? pilula(fmt(s.kicker, tM), cor, '#fff', 'font-size:26px;padding:8px 28px;text-transform:uppercase;letter-spacing:.1em') : ''}
        ${tTit(s.titulo, s.ts || 80).replace('color:', 'text-align:center;color:')}
        ${s.texto ? tCorpo(s.texto, 31) : ''}
      </div>${arroba(C.escuro)}</div>`;
  },
  cta(s) {
    return `<div style="position:absolute;inset:0;${tFundo}">${topo(C.escuro)}
      <div data-area style="position:absolute;left:100px;right:100px;top:170px;bottom:180px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;gap:40px">
        ${s.kicker ? tCorpo(s.kicker, 34) : ''}
        ${tTit(s.titulo, s.ts || 116)}
        ${s.texto ? `<div style="max-width:780px">${tCorpo(s.texto, 33)}</div>` : ''}
        ${s.botao ? pilula(fmt(s.botao), C.escuro, '#fff', 'text-transform:uppercase;letter-spacing:.04em') : ''}
      </div>${brilho(130, 1010, 100, C.pink, 0)}${brilho(215, 1100, 46, C.pessego, 0)}${brilho(860, 210, 80, C.pink, 0)}${arroba(C.escuro)}</div>`;
  },
};

// ================= STUDIO =================
// Fundo branco (ou rosa-escuro com fundo: "rosa"), serifa rosa-escuro, cursiva pink, etiquetas blush.
// enfeite: "morcegos" espalha morcegos e lua (posts de cultura pop, ex.: vampiros).
const sM = (cur = C.pink) => ({ i: cur, cursiva: 1.25, acc: `color:${C.pink}`, b: `font-weight:800`, hl: `background:${C.blush};padding:0 .14em` });
const sPal = s => (s.fundo === 'rosa'
  ? { bg: C.escuro, tit: '#fff', txt: '#fff', cur: C.blush, linha: C.claro, chip: '#fff', chipTxt: C.escuro, ruido: true }
  : { bg: '#fff', tit: C.escuro, txt: C.escuro, cur: C.pink, linha: C.claro, chip: C.blush, chipTxt: C.escuro, ruido: false });
const sTit = (t, px, p, al = 'center') => `<div data-titulo style="${SERIF};font-size:${px}px;line-height:1;letter-spacing:-.02em;color:${p.tit};text-align:${al}">${fmt(t, sM(p.cur))}</div>`;
const sCorpo = (t, px, p, al = 'center', cor = p.txt) => `<div data-corpo style="${TIGHT};font-weight:500;font-size:${px}px;line-height:1.3;letter-spacing:-.015em;color:${cor};text-align:${al}">${fmt(t, { ...sM(p.cur), b: `font-weight:800;color:${cor}` })}</div>`;
const morcego = (x, y, px, cor, rot = 0) => `<svg style="position:absolute;left:${x}px;top:${y}px;width:${px}px;height:${Math.round(px * .5)}px;transform:rotate(${rot}deg);z-index:1" viewBox="0 0 100 50"><path d="M50 14 C47 8 44 7 42 10 C38 4 30 0 18 2 C24 8 24 14 20 18 C14 14 6 15 0 20 C12 22 18 30 20 40 C26 34 34 34 40 38 C42 30 46 26 50 26 C54 26 58 30 60 38 C66 34 74 34 80 40 C82 30 88 22 100 20 C94 15 86 14 80 18 C76 14 76 8 82 2 C70 0 62 4 58 10 C56 7 53 8 50 14Z" fill="${cor}"/></svg>`;
const sEnfeite = (s, p) => s.enfeite !== 'morcegos' ? '' : `
  <div style="position:absolute;right:90px;top:120px;width:170px;height:170px;border-radius:50%;background:${p.bg === '#fff' ? C.blush : 'rgba(255,255,255,.18)'};z-index:1"></div>
  ${morcego(760, 250, 120, p.linha, -12)}${morcego(880, 330, 80, p.linha, 10)}${morcego(90, 1080, 100, p.linha, 8)}${morcego(200, 1150, 64, p.linha, -14)}`;
const sCaixa = (s, p, ruido = p.ruido) => `class="${ruido ? 'ruido' : ''}" style="position:absolute;inset:0;background:${p.bg}"`;

const STUDIO = {
  capa(s, ctx) {
    const p = sPal(s);
    return `<div ${sCaixa(s, p)}>
      <div style="position:absolute;left:0;right:0;top:0;height:${s.fotoAltura || 900}px">${img(ctx, s.foto, { pos: s.fotoPos || 'center 30%' })}<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,255,255,0) 50%,${p.bg} 97%)"></div></div>
      ${topo('#fff')}
      <div data-area style="position:absolute;left:80px;right:80px;top:600px;bottom:140px;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:24px;z-index:3">
        ${s.kicker ? pilula(fmt(s.kicker), C.escuro, '#fff', 'font-size:26px;padding:8px 30px;text-transform:uppercase;letter-spacing:.1em') : ''}
        ${sTit(s.titulo, s.ts || 118, p)}
        ${s.texto ? `<div style="max-width:720px">${sCorpo(s.texto, 29, p)}</div>` : ''}
      </div>${arroba(p.tit)}</div>`;
  },
  texto(s) {
    const p = sPal(s), dias = ['SEG', 'TER', 'QUA', 'QUI', 'SEX'], pontos = [[0, 1], [1, 0], [2, 1], [3, 0], [4, 2], [1, 2], [3, 2]];
    const g = !s.grade ? '' : `<div style="position:absolute;left:10px;right:-120px;top:${H - 410}px;height:560px;transform:rotate(-8deg);display:grid;grid-template-columns:repeat(5,1fr);border-top:1.5px solid ${p.linha}">
      ${dias.map((d, i) => `<div style="position:relative;border-left:1.5px solid ${p.linha};${TIGHT};font-weight:600;font-size:26px;letter-spacing:.1em;color:${p.cur};padding:18px 26px">${d}${pontos.filter(q => q[0] === i).map(q => `<div style="position:absolute;left:50%;top:${110 + q[1] * 110}px;width:30px;height:30px;border-radius:50%;background:${p.cur}"></div>`).join('')}</div>`).join('')}
      <div style="position:absolute;left:0;right:0;top:82px;border-top:1.5px solid ${p.linha}"></div></div>`;
    return `<div ${sCaixa(s, p)}>${topo(p.tit)}${sEnfeite(s, p)}
      <div data-area style="position:absolute;left:110px;right:110px;top:180px;bottom:${s.grade ? 470 : 170}px;display:flex;flex-direction:column;justify-content:center;gap:40px;z-index:3">
        ${s.kicker ? sCorpo(s.kicker, 31, p) : ''}
        ${sTit(s.titulo, s.ts || 106, p)}
        ${s.texto ? sCorpo(s.texto, 31, p) : ''}
      </div>${g}${arroba(p.tit)}</div>`;
  },
  lista(s) {
    const p = sPal(s);
    return `<div ${sCaixa(s, p)}>${topo(p.tit)}${sEnfeite(s, p)}
      <div data-area style="position:absolute;left:100px;right:100px;top:150px;bottom:150px;display:flex;flex-direction:column;justify-content:center;gap:44px;z-index:3">
        ${sTit(s.titulo, s.ts || 92, p, 'left')}
        <div style="display:flex;flex-direction:column;gap:18px">
          ${lista(s.itens).map((t, i) => `<div style="display:flex;align-items:center;gap:24px;background:${p.chip};border-radius:999px;padding:18px 34px"><span style="${SERIF};font-size:40px;color:${C.pink};flex:none">${i + 1}</span>${sCorpo(t, 29, p, 'left', p.chipTxt)}</div>`).join('')}
        </div>
        ${s.texto ? sCorpo(s.texto, 30, p, 'right') : ''}
      </div>${arroba(p.tit)}</div>`;
  },
  item(s) {
    const p = sPal(s);
    return `<div ${sCaixa(s, p)}>${topo(p.tit)}${sEnfeite(s, p)}
      <div data-area style="position:absolute;left:110px;right:110px;top:150px;bottom:150px;display:flex;flex-direction:column;justify-content:center;gap:34px;z-index:3">
        <div style="${CURSIVA};font-size:180px;line-height:.8;color:${p.cur}">${s.numero}</div>
        ${sTit(s.titulo, s.ts || 96, p, 'left')}
        ${s.texto ? sCorpo(s.texto, 31, p, 'left') : ''}
      </div>${arroba(p.tit)}</div>`;
  },
  faixa(s, ctx) {
    const p = sPal({});
    return `<div style="position:absolute;inset:0;background:#fff">
      <div style="position:absolute;left:0;right:0;top:0;height:330px">${img(ctx, s.foto, { pos: s.fotoPos || 'center 20%' })}</div>
      <div style="position:absolute;left:0;right:0;bottom:0;height:300px">${img(ctx, s.foto2 || s.foto, { pos: s.foto2Pos || 'center 85%' })}</div>
      <div data-area style="position:absolute;left:110px;right:110px;top:380px;bottom:350px;display:flex;flex-direction:column;justify-content:center;gap:36px">
        ${sTit(s.titulo, s.ts || 92, p, 'left')}
        ${s.texto ? `<div style="display:flex;gap:26px;align-items:stretch;padding-left:10px"><div style="width:26px;flex:none;border:2px solid ${C.escuro};border-right:none;border-radius:40px 0 0 40px"></div>${sCorpo(s.texto, 30, p, 'left')}</div>` : ''}
      </div></div>`;
  },
  cta(s) {
    const p = sPal(s);
    return `<div ${sCaixa(s, p)}>${topo(p.tit)}${sEnfeite(s, p)}
      <div data-area style="position:absolute;left:110px;right:110px;top:150px;bottom:180px;display:flex;flex-direction:column;justify-content:center;gap:30px;z-index:3">
        ${s.kicker ? sCorpo(s.kicker, 30, p) : ''}
        ${sTit(s.titulo, s.ts || 108, p)}
        ${s.texto ? `<div style="position:relative;border:2px solid ${p.tit};border-radius:40px;padding:34px 44px 64px;margin:20px 30px 0">${sCorpo(s.texto, 31, p)}
          ${s.botao ? `<div style="position:absolute;left:50%;bottom:-32px;transform:translateX(-50%);white-space:nowrap">${pilula(fmt(s.botao), p.tit, p.bg, 'font-size:30px;padding:12px 36px')}</div>` : ''}</div>` : ''}
      </div>${arroba(p.tit)}</div>`;
  },
};

// ================= SCRAP =================
// Papel branco, grotesca pesada minúscula em rosa-escuro, balões pink, estrelas pêssego, papel rasgado rosa-escuro.
const pM = { i: C.pink, cursiva: 1.18, hl: `background:linear-gradient(transparent 14%,${C.claro} 14%,${C.claro} 92%,transparent 92%);padding:0 .12em`, acc: `text-decoration:underline;text-decoration-color:${C.pink};text-decoration-thickness:.07em;text-underline-offset:.08em`, b: 'font-weight:800' };
const pBal = { ...pM, b: `font-weight:800;color:${C.blush}`, i: C.blush };
const pTit = (t, px, cor = C.escuro, al = 'left') => `<div data-titulo style="${TIGHT};font-weight:800;font-size:${px}px;line-height:.95;letter-spacing:-.05em;word-spacing:.06em;color:${cor};text-align:${al}">${fmt(t, pM)}</div>`;
const pCorpo = (t, px = 34, cor = C.escuro, al = 'left', m = pM) => `<div data-corpo style="${TIGHT};font-weight:500;font-size:${px}px;line-height:1.22;letter-spacing:-.03em;color:${cor};text-align:${al}">${fmt(t, m)}</div>`;
const pFundo = (bg = '#fff') => grade(bg, C.blush, 54);

const SCRAP = {
  capa(s, ctx) {
    const dias = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'], hoje = s.dia ?? 7, nums = [6, 7, 8, 9, 10, 11, 12].map(n => n + (hoje - 7));
    const horas = ['13:00', '14:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
    if (!s.agenda) return `<div class="ruido" style="position:absolute;inset:0;${pFundo(C.blush)}">${topo(C.escuro)}
      ${estrela(120, 250, 70, C.pink, -12)}${estrela(880, 1000, 60, C.pessego, 10)}${brilho(860, 220, 60, C.pink, 0)}
      <div data-area style="position:absolute;left:90px;right:90px;top:200px;bottom:220px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:40px;z-index:3">
        ${pTit(s.titulo, s.ts || 112, C.escuro, 'center')}
        ${s.texto ? `<div style="max-width:780px">${pCorpo(s.texto, 34, C.escuro, 'center')}</div>` : ''}
        <svg width="70" height="70" viewBox="0 0 64 64" fill="none" stroke="${C.escuro}" stroke-width="2.5"><circle cx="32" cy="32" r="29"/><path d="M18 32 H45 M36 23 L45 32 L36 41" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>${arroba(C.escuro, H - 100)}</div>`;
    return `<div class="ruido" style="position:absolute;inset:0;${pFundo()}">
      <div style="position:absolute;left:60px;right:60px;top:40px;display:grid;grid-template-columns:repeat(7,1fr);text-align:center;${TIGHT};font-weight:500;color:${C.escuro};font-size:26px;gap:4px">
        ${dias.map(d => `<div>${d}</div>`).join('')}${nums.map((n, i) => `<div style="margin-top:14px;font-size:36px"><span style="display:inline-block;width:70px;height:70px;line-height:70px;border-radius:50%;${i === 1 ? `background:${C.pink};color:#fff` : ''}">${n}</span></div>`).join('')}
      </div>
      ${horas.map((h, i) => `<div style="position:absolute;left:30px;right:0;top:${330 + i * 132}px;display:flex;align-items:center;gap:24px;${TIGHT};font-size:24px;color:${C.pessego}"><span style="width:80px">${h}</span><div style="flex:1;height:1.5px;background:${C.blush}"></div></div>`).join('')}
      ${s.foto ? `<div style="position:absolute;right:70px;top:190px;width:330px;height:330px;border-radius:50%;overflow:hidden;border:10px solid #fff;box-shadow:0 14px 30px rgba(244,120,154,.35);transform:rotate(6deg);z-index:3">${img(ctx, s.foto, { pos: s.fotoPos || 'center 30%' })}</div>` : ''}
      ${estrela(s.foto ? 140 : 820, 470, 70, C.pessego, -12)}${estrela(930, 1000, 54, C.pink, 10)}
      <div data-area style="position:absolute;left:80px;right:80px;top:${s.foto ? 540 : 360}px;bottom:300px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:30px;z-index:3">
        ${pTit(s.titulo, s.ts || 104, C.escuro, 'center')}
        ${s.texto ? `<div style="max-width:800px">${pCorpo(s.texto, 34, C.escuro, 'center')}</div>` : ''}
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="${C.escuro}" stroke-width="2.5"><circle cx="32" cy="32" r="29"/><path d="M18 32 H45 M36 23 L45 32 L36 41" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      ${abas(H - 250, C.escuro)}${arroba(C.escuro, H - 100)}</div>`;
  },
  item(s) {
    return `<div class="ruido" style="position:absolute;inset:0;${pFundo()}">${topo(C.escuro)}
      <div data-area style="position:absolute;left:80px;right:80px;top:130px;bottom:560px;display:flex;flex-direction:column;justify-content:center;gap:56px;z-index:3">
        ${pTit(`${dois(s.numero)}. ${s.titulo}`, s.ts || 108)}
        ${s.fala ? balao(fmt(s.fala, pBal), { bg: C.pink, rot: -1.2, tam: 34, extra: 'margin-right:30px' }) : ''}
      </div>
      ${estrela(930, 170, 60, C.pessego, 12)}${estrela(70, 770, 50, C.claro, -8)}${brilho(900, 700, 70, C.pink, 0)}
      ${rasgo(H - 520, C.blush, s.numero * 13 + 5)}
      <div data-area style="position:absolute;left:110px;right:110px;top:${H - 450}px;bottom:130px;display:flex;flex-direction:column;justify-content:center;z-index:3">
        ${pCorpo(s.texto || '', 38, C.escuro, 'center', { ...pM, b: 'font-weight:800' })}
      </div>
      ${arroba(C.escuro, H - 90)}</div>`;
  },
  janela(s) {
    return `<div class="ruido" style="position:absolute;inset:0;${pFundo(C.blush)}">
      <div style="position:absolute;left:70px;right:90px;top:140px;bottom:130px;background:#fff;border-radius:28px;transform:rotate(-2deg);border:2px solid ${C.claro};box-shadow:0 20px 50px rgba(244,120,154,.25);z-index:2">
        <div style="position:absolute;left:50%;top:-34px;width:190px;height:62px;margin-left:-95px;background:${C.claro}cc;transform:rotate(3deg)"></div>
        <div style="position:absolute;right:40px;top:34px;display:flex;gap:14px">${[C.claro, C.pessego, C.escuro].map(c => `<div style="width:26px;height:26px;border-radius:50%;background:${c}"></div>`).join('')}</div>
        <div style="position:absolute;left:60px;top:40px;${TIGHT};font-size:19px;line-height:1.2;letter-spacing:.12em;color:${C.escuro}"><div style="font-weight:600">EDUARDA CARACIOLO</div><div style="font-weight:800">ADVOGADA · CIVIL E ECA</div></div>
        <div data-area style="position:absolute;left:60px;right:60px;top:130px;bottom:60px;display:flex;flex-direction:column;justify-content:center;gap:56px">
          ${pTit(s.titulo, s.ts || 96)}
          ${s.fala ? balao(fmt(s.fala, pBal), { bg: C.pink, rot: -3, tam: 32 }) : ''}
          ${s.texto ? pCorpo(s.texto, 33, C.escuro, 'center') : ''}
        </div>
      </div>
      ${estrela(900, 90, 64, C.pink, 10)}${estrela(60, 1170, 56, C.pessego, -10)}${arroba(C.escuro, H - 84)}</div>`;
  },
  lista(s) {
    return `<div style="position:absolute;inset:0;background:#fff">
      <div class="ruido" style="position:absolute;left:66px;right:66px;top:48px;bottom:0;background:${C.blush};border-radius:40px 40px 0 0"></div>
      ${estrela(22, 330, 60, C.pink, 0)}
      <div data-area style="position:absolute;left:130px;right:130px;top:130px;bottom:300px;display:flex;flex-direction:column;justify-content:center;gap:40px;z-index:3">
        ${pTit(s.titulo, s.ts || 100)}
        ${s.kicker ? pCorpo(s.kicker, 34) : ''}
        <div style="display:flex;flex-direction:column;gap:24px">
          ${lista(s.itens).map(t => `<div style="display:flex;gap:22px;align-items:flex-start"><svg width="34" height="34" viewBox="0 0 100 100" style="flex:none;margin-top:6px"><path d="M50 4 L62 36 L96 38 L69 59 L79 94 L50 73 L21 94 L31 59 L4 38 L38 36Z" fill="${C.pink}"/></svg>${pCorpo(t, 36)}</div>`).join('')}
        </div>
      </div>
      <div style="position:absolute;inset:0;z-index:2">${abas(H - 260, C.escuro)}</div>${arroba(C.escuro, H - 100)}</div>`;
  },
  legenda(s, ctx) {
    const y = typeof s.y === 'number' ? s.y : { topo: 200, meio: 620, base: 860 }[s.y || 'base'];
    const [e1, e2] = s.emojis || ['🥴', '😵'];
    const linhas = String(s.texto || '').split('\n');
    return `<div style="position:absolute;inset:0;background:${C.escuro}">${img(ctx, s.foto, { pos: s.fotoPos || 'center' })}
      <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.25) 0%,rgba(0,0,0,0) 16%)"></div>
      ${topo('#fff', 52)}
      <div data-area style="position:absolute;left:70px;right:70px;top:${y}px;display:flex;justify-content:center">
        <div style="position:relative;text-align:center">
          <div data-corpo style="${TIGHT};font-weight:400;font-size:${s.tam || 46}px;line-height:1.2;letter-spacing:-.04em;color:#fff">${linhas.map(l => `<span style="background:${C.escuro};padding:.02em .3em;border-radius:.2em;${CLONE}">${fmt(l, { b: 'font-weight:800', i: C.blush })}</span>`).join('<br>')}</div>
          <div data-livre style="position:absolute;right:-50px;top:-40px;font-family:'Noto Color Emoji';font-size:58px">${e1}</div>
          <div data-livre style="position:absolute;left:-66px;bottom:-44px;font-family:'Noto Color Emoji';font-size:58px">${e2}</div>
        </div>
      </div></div>`;
  },
  pergunta(s) {
    return `<div class="ruido" style="position:absolute;inset:0;${pFundo()}">${topo(C.escuro)}
      ${estrela(880, 200, 60, C.pink, 10)}${estrela(840, 690, 52, C.pessego, -6)}${brilho(120, 1000, 70, C.pink, 0)}
      <div data-area style="position:absolute;left:110px;right:110px;top:180px;bottom:260px;display:flex;flex-direction:column;justify-content:center;gap:70px">
        ${pTit(s.titulo, s.ts || 118)}
        ${s.texto ? balao(fmt(s.texto, { ...pM, b: 'font-weight:800', i: C.blush }), { bg: C.pink, tam: 36, extra: 'margin-right:60px' }) : ''}
      </div>
      ${arroba(C.escuro, H - 110)}</div>`;
  },
};
SCRAP.texto = SCRAP.janela;
SCRAP.cta = SCRAP.pergunta;

// ================= BLOCOS =================
// Cada slide com uma cor da paleta. Nos fundos fortes, texto branco em faixas translúcidas;
// nos claros, faixas brancas com texto rosa-escuro.
const B = { branco: ['#fff', false], escuro: [C.escuro, true], pink: [C.pink, true], pessego: [C.pessego, false], claro: [C.claro, false], blush: [C.blush, false] };
const BLOCOS = {};
BLOCOS.capa = BLOCOS.dica = BLOCOS.lista = BLOCOS.cta = BLOCOS.texto = function (s, ctx, c) {
  const [bg, forte] = B[s.cor || c.cor] || B.escuro;
  const tinta = forte ? '#fff' : C.escuro, barra = forte ? 'rgba(255,255,255,.2)' : bg === '#fff' ? C.blush : '#fff';
  const m = { i: forte ? C.blush : C.pink, acc: `color:${forte ? C.blush : C.pink}`, b: 'font-weight:800' };
  const tit = s.titulo ? `<div data-titulo style="${TIGHT};font-weight:700;font-size:${s.ts || (s.tipo === 'capa' ? 98 : 84)}px;line-height:1.14;letter-spacing:-.05em;color:${tinta};text-align:center">${String(s.titulo).split('\n').map(l => `<span style="background:${barra};padding:0 .16em;border-radius:.14em;${CLONE}">${fmt(l, m)}</span>`).join('<br>')}</div>` : '';
  const sub = s.sub ? `<div style="display:flex;justify-content:center"><div data-corpo style="${TIGHT};font-weight:800;font-size:26px;letter-spacing:.12em;text-transform:uppercase;text-align:center;${forte ? 'color:#fff' : `color:#fff;background:${C.escuro};border-radius:999px;padding:8px 26px`}">${fmt(s.sub, m)}</div></div>` : '';
  const caixas = lista(s.caixas).length ? `<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:14px">${lista(s.caixas).map(t => `<div style="background:${bg === '#fff' ? C.blush : '#fff'};color:${C.escuro};border-radius:999px;padding:10px 26px"><div data-corpo style="${TIGHT};font-weight:600;font-size:28px;line-height:1.1;letter-spacing:-.02em;text-align:center">${fmt(t, m)}</div></div>`).join('')}</div>` : '';
  const txt = s.texto ? `<div data-corpo style="${TIGHT};font-weight:500;font-size:30px;line-height:1.24;letter-spacing:-.03em;color:${tinta};text-align:center">${String(s.texto).split('\n').map(l => `<span style="background:${forte ? 'rgba(255,255,255,.14)' : bg === '#fff' ? C.blush : '#fff'};padding:.03em .3em;${CLONE}">${fmt(l, m)}</span>`).join('<br>')}</div>` : '';
  const cols = lista(s.colunas).length ? `<div style="display:flex;justify-content:center;gap:40px">${lista(s.colunas).map(k => `<div style="text-align:center;color:${tinta};background:${barra};border-radius:30px;padding:22px 36px;min-width:300px"><div style="font-family:'Noto Color Emoji';font-size:44px">${k.sim === false ? '❌' : '✅'}</div><div style="${TIGHT};font-weight:800;font-size:30px;letter-spacing:-.02em;margin-top:8px">${esc(k.titulo)}</div><div data-corpo style="${TIGHT};font-weight:500;font-size:24px;margin-top:6px">${esc(k.texto || '')}</div></div>`).join('')}</div>` : '';
  const alt = s.foto ? s.fotoAltura || 420 : 0;
  return `<div style="position:absolute;inset:0;background:${bg}">${topo(tinta)}
    <div data-area style="position:absolute;left:70px;right:70px;top:120px;bottom:${s.foto ? alt + 130 : 140}px;display:flex;flex-direction:column;justify-content:center;gap:26px">
      ${tit}${sub}${caixas}${txt}${cols}
    </div>
    ${s.foto ? `<div style="position:absolute;left:80px;right:80px;bottom:100px;height:${alt}px;border-radius:${Math.round(alt / 2)}px;overflow:hidden;border:8px solid #fff">${img(ctx, s.foto, { pos: s.fotoPos || 'center' })}</div>` : ''}
    ${brilho(940, 150, 56, forte ? '#fff' : C.pink, 0)}${arroba(tinta, H - 76)}
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
.ruido::after{content:"";position:absolute;inset:0;pointer-events:none;z-index:5;opacity:.45;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .25 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}</style>
</head><body><div id="painel" style="position:relative;width:${slides.length * W}px;height:${H}px">${slides.join('\n')}</div></body></html>`;
  return { html, total: slides.length, avisos };
}
