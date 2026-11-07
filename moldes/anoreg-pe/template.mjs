// Identidade visual da ANOREG/PE (Associação dos Notários e Registradores de Pernambuco): 4 direções
// em azul, branco e um toque de vermelho. Cada direção monta as mesmas peças, para comparar lado a lado:
// feed (serviço, agenda, frase), carrossel de 5 slides, 6 capas de destaque, banner e perfil do YouTube.
// As marcas aqui são propostas desenhadas em código; troque pelo logo oficial quando houver.

const ARROBA = '@anoregpe';

// ---------- conteúdo comum (o mesmo em todas as direções) ----------
export const C = {
  servicos: ['Divórcio', 'Inventário', 'Usucapião', 'Mudança de nome'],
  agenda: { tag: 'Inscrições abertas', titulo: 'Encontro Estadual de Notários e Registradores', dias: '27—28', mes: 'Novembro 2026', local: 'Recife · Pernambuco' },
  frase: 'Segurança jurídica é o que dá tranquilidade a quem assina.',
  itens: [
    { n: '01', t: 'Inventário e partilha', txt: 'Com os herdeiros de acordo, a partilha sai por escritura pública no tabelionato de notas, com a assistência de advogado.', lei: 'Lei nº 11.441/2007' },
    { n: '02', t: 'Divórcio consensual', txt: 'O casal que está de acordo pode se divorciar por escritura pública, sem processo judicial, com advogado.', lei: 'Art. 733 do CPC' },
    { n: '03', t: 'Usucapião', txt: 'Reconhecimento da propriedade direto no Registro de Imóveis.', lei: 'Art. 216-A da Lei nº 6.015/1973' },
    { n: '04', t: 'Mudança de nome', txt: 'Maiores de 18 anos alteram o prenome direto no Registro Civil.', lei: 'Lei nº 14.382/2022' },
    { n: '05', t: 'Apostila de Haia', txt: 'Documento brasileiro válido nos países da Convenção.', lei: 'Resolução CNJ nº 228/2016' },
  ],
};
export const DESTAQUES = [['institucional', 'Institucional'], ['noticias', 'Notícias'], ['eventos', 'Eventos'], ['servicos', 'Serviços'], ['associados', 'Associados'], ['contato', 'Contato']];

const ICONES = {
  institucional: '<path d="M3 20.5h18M5 20.5v-9M9.7 20.5v-9M14.3 20.5v-9M19 20.5v-9M2.5 9h19L12 3.2z"/>',
  noticias: '<path d="M4 4.5h12.5v15H5.5A1.5 1.5 0 0 1 4 18z"/><path d="M16.5 8.5H20V18a1.5 1.5 0 0 1-3 0"/><path d="M7 8.5h6.5M7 12h6.5M7 15.5h4"/>',
  eventos: '<rect x="3.5" y="5" width="17" height="15.5" rx="1.2"/><path d="M3.5 10h17M8 3v4M16 3v4M8 14h2M14 14h2M8 17h2"/>',
  servicos: '<path d="M6 3h8.5L19 7.5V21H6z"/><path d="M14 3v5h5M9 12.5h7M9 16h4.5"/>',
  associados: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20.5c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.6"/><path d="M15.8 14.6c2.9.3 5.2 2.8 5.2 5.9"/>',
  contato: '<path d="M4 5h16v11.5H9.5L4 20.5z"/><path d="M8.5 11h.01M12 11h.01M15.5 11h.01"/>',
};
const icone = (k, px, cor, sw = 1.25) => `<svg width="${px}" height="${px}" viewBox="0 0 24 24" fill="none" stroke="${cor}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${ICONES[k]}</svg>`;
const fonte = q => `<link href="https://fonts.googleapis.com/css2?${q}&display=swap" rel="stylesheet">`;
const BASE = `*{box-sizing:border-box;margin:0;padding:0}body{margin:0}.p{position:relative;overflow:hidden;-webkit-font-smoothing:antialiased;text-rendering:geometricPrecision}.abs{position:absolute}`;

// guilhochê (desenho de papel de segurança): anéis ondulados concêntricos
function guilhoche(cx, cy, { r0 = 120, r1 = 900, passos = 22, amp = 18, k = 24, cor = '#fff', op = 0.1, sw = 1 } = {}) {
  let g = '';
  for (let j = 0; j < passos; j++) {
    const R = r0 + (r1 - r0) * j / (passos - 1), f = j * 0.42;
    let d = '';
    for (let i = 0; i <= 720; i++) {
      const a = i / 720 * Math.PI * 2, r = R + amp * Math.sin(k * a + f) + amp * 0.5 * Math.sin((k / 2) * a - f);
      d += `${i ? 'L' : 'M'}${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
    }
    g += `<path d="${d}Z"/>`;
  }
  return `<g fill="none" stroke="${cor}" stroke-opacity="${op}" stroke-width="${sw}">${g}</g>`;
}
const svgCheio = (w, h, dentro) => `<svg class="abs" style="inset:0" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${dentro}</svg>`;

// =====================================================================================
// A · SELO — institucional clássica: navy, marfim, Playfair Display, guilhochê, selo circular
// =====================================================================================
function opcaoA() {
  const NV = '#0B1F3A', AZ = '#1E4A8C', MF = '#F6F4EF', VM = '#B5121B', CL = '#C9D6E8';
  const head = fonte('family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Inter:wght@400;500;600;700') + `<style>${BASE}
  .p{font-family:Inter,sans-serif;color:#fff}
  .sf{font-family:'Playfair Display',serif}
  .caps{text-transform:uppercase;letter-spacing:.26em;font-weight:600}
  .nv{background:radial-gradient(130% 90% at 85% 0%,#17365F 0%,${NV} 55%,#081830 100%)}
  .mf{background:${MF};color:${NV}}
  .fio{height:3px;width:84px;background:${VM}}
  .moldura{position:absolute;inset:34px;border:1px solid rgba(255,255,255,.28)}
  .moldura:after{content:'';position:absolute;inset:8px;border:1px solid rgba(255,255,255,.14)}
  .mf .moldura{border-color:rgba(11,31,58,.22)}.mf .moldura:after{border-color:rgba(11,31,58,.1)}
  </style>`;
  const selo = (px, cor = '#fff', est = VM) => `<svg width="${px}" height="${px}" viewBox="0 0 200 200"><defs>
    <path id="aT${px}" d="M 100,100 m -75,0 a 75,75 0 1,1 150,0"/><path id="aB${px}" d="M 100,100 m -83,0 a 83,83 0 0,0 166,0"/></defs>
    <circle cx="100" cy="100" r="97" fill="none" stroke="${cor}" stroke-width="2"/><circle cx="100" cy="100" r="92" fill="none" stroke="${cor}" stroke-width=".8"/>
    <circle cx="100" cy="100" r="61" fill="none" stroke="${cor}" stroke-width="1.2"/>
    <text font-family="Inter" font-size="10.6" font-weight="600" letter-spacing="2.6" fill="${cor}"><textPath href="#aT${px}" startOffset="50%" text-anchor="middle">NOTÁRIOS E REGISTRADORES</textPath></text>
    <text font-family="Inter" font-size="10.6" font-weight="600" letter-spacing="4" fill="${cor}"><textPath href="#aB${px}" startOffset="50%" text-anchor="middle">PERNAMBUCO</textPath></text>
    <path d="M22 100l3 -2.2 3 2.2 -3 2.2zM172 100l3 -2.2 3 2.2 -3 2.2z" fill="${est}" transform="translate(-2 0)"/>
    <text x="100" y="92" text-anchor="middle" font-family="Inter" font-size="13" font-weight="600" letter-spacing="3.4" fill="${cor}">ANOREG</text>
    <line x1="80" y1="101" x2="120" y2="101" stroke="${est}" stroke-width="1.6"/>
    <text x="100" y="136" text-anchor="middle" font-family="Playfair Display" font-style="italic" font-size="36" font-weight="600" fill="${cor}">PE</text></svg>`;
  const marca = (cor = '#fff', sub = 'rgba(255,255,255,.7)') => `<div style="display:flex;align-items:center;gap:22px">${selo(92, cor)}
    <div><div style="font-size:24px;font-weight:700;letter-spacing:.2em;color:${cor}">ANOREG<span style="color:${VM}">/</span>PE</div>
    <div style="font-size:16px;letter-spacing:.06em;color:${sub};margin-top:6px">Notários e Registradores de Pernambuco</div></div></div>`;
  const gui = (w, h, x, y, op = .09, cor = '#fff') => svgCheio(w, h, guilhoche(x, y, { r1: Math.max(w, h) * .9, op, cor }));
  const rodape = (cor, pag) => `<div class="abs caps" style="left:96px;right:96px;bottom:92px;display:flex;justify-content:space-between;font-size:16px;color:${cor}"><span>${ARROBA}</span><span>${pag || 'Segurança jurídica'}</span></div>`;
  const W = 1080, H = 1350;

  const feedServico = `<div class="p nv" style="width:${W}px;height:${H}px">${gui(W, H, 1000, 120)}<div class="moldura"></div>
    <div class="abs" style="left:96px;top:96px">${marca()}</div>
    <div class="abs" style="left:96px;right:96px;top:420px">
      <div class="caps" style="font-size:18px;color:${CL};display:flex;align-items:center;gap:18px"><span class="fio" style="width:48px"></span>Serviços extrajudiciais</div>
      <div class="sf" style="font-size:138px;font-weight:600;line-height:.98;letter-spacing:-.015em;margin-top:34px">Resolva no<br><i style="font-weight:500">cartório.</i></div>
      <div style="font-size:31px;line-height:1.5;color:rgba(255,255,255,.82);margin-top:36px;max-width:820px">Sem processo judicial, com a segurança jurídica de quem tem fé pública.</div></div>
    <div class="abs" style="left:96px;right:96px;bottom:170px;display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid rgba(255,255,255,.3)">
      ${C.servicos.map((s, i) => `<div style="padding:26px 0 0 ${i ? 22 : 0}px;${i ? 'border-left:1px solid rgba(255,255,255,.18)' : ''}"><div class="sf" style="font-style:italic;font-size:22px;color:${CL}">0${i + 1}</div><div style="font-size:24px;font-weight:600;margin-top:8px;line-height:1.2">${s}</div></div>`).join('')}</div>
    ${rodape('rgba(255,255,255,.6)')}</div>`;

  const feedAgenda = `<div class="p mf" style="width:${W}px;height:${H}px">${gui(W, H, 1080, 1350, .07, NV)}<div class="moldura"></div>
    <div class="abs" style="left:96px;top:96px">${marca(NV, 'rgba(11,31,58,.6)')}</div>
    <div class="abs" style="left:96px;top:380px;display:inline-flex;align-items:center;gap:14px;background:${VM};color:#fff;padding:14px 22px;font-size:17px" ><span class="caps">${C.agenda.tag}</span></div>
    <div class="abs sf" style="left:90px;top:470px;font-size:250px;font-weight:500;line-height:1;color:${AZ};letter-spacing:-.03em">${C.agenda.dias}</div>
    <div class="abs caps" style="left:100px;top:750px;font-size:22px;color:${NV}">${C.agenda.mes}</div>
    <div class="abs" style="left:96px;right:120px;top:830px;border-top:1px solid rgba(11,31,58,.25);padding-top:40px">
      <div class="sf" style="font-size:66px;font-weight:600;line-height:1.08">${C.agenda.titulo}</div>
      <div style="font-size:26px;margin-top:26px;color:rgba(11,31,58,.75)">${C.agenda.local}</div></div>
    ${rodape('rgba(11,31,58,.55)', 'Link na bio')}</div>`;

  const feedFrase = `<div class="p nv" style="width:${W}px;height:${H}px">${gui(W, H, 540, 1250, .08)}<div class="moldura"></div>
    <div class="abs sf" style="left:96px;top:150px;font-size:280px;line-height:1;color:${VM}">“</div>
    <div class="abs sf" style="left:96px;right:110px;top:420px;font-size:84px;font-style:italic;font-weight:500;line-height:1.16">${C.frase}</div>
    <div class="abs" style="left:96px;top:930px" ><div class="fio"></div></div>
    <div class="abs" style="left:96px;bottom:150px">${marca()}</div></div>`;

  // carrossel
  const pag = i => `${i} / 5`;
  const capa = `<div class="p nv" style="width:${W}px;height:${H}px">${gui(W, H, 980, 200)}<div class="moldura"></div>
    <div class="abs" style="left:96px;top:96px">${marca()}</div>
    <div class="abs" style="left:96px;right:96px;top:470px">
      <div class="caps" style="font-size:18px;color:${CL};display:flex;align-items:center;gap:18px"><span class="fio" style="width:48px"></span>Guia prático</div>
      <div class="sf" style="font-size:112px;font-weight:600;line-height:1.02;margin-top:34px">O que você pode resolver <i style="font-weight:500">no cartório</i></div>
      <div style="font-size:31px;line-height:1.5;color:rgba(255,255,255,.8);margin-top:34px">5 serviços sem precisar de processo judicial.</div></div>
    <div class="abs caps" style="right:96px;bottom:92px;font-size:16px;color:#fff">Arraste &nbsp;→</div>
    <div class="abs caps" style="left:96px;bottom:92px;font-size:16px;color:rgba(255,255,255,.6)">${ARROBA}</div></div>`;
  const item = (it, p) => `<div class="p mf" style="width:${W}px;height:${H}px">${gui(W, H, 1080, 0, .06, NV)}<div class="moldura"></div>
    <div class="abs sf" style="left:84px;top:110px;font-size:340px;line-height:1;font-weight:500;color:transparent;-webkit-text-stroke:2px ${AZ}">${it.n}</div>
    <div class="abs" style="left:96px;right:120px;top:560px">
      <div class="fio"></div>
      <div class="sf" style="font-size:92px;font-weight:600;line-height:1.04;margin-top:34px">${it.t}</div>
      <div style="font-size:34px;line-height:1.5;color:rgba(11,31,58,.82);margin-top:34px">${it.txt}</div>
      <div class="caps" style="font-size:17px;color:${AZ};margin-top:44px">${it.lei}</div></div>
    ${rodape('rgba(11,31,58,.5)', pag(p))}</div>`;
  const lista = `<div class="p nv" style="width:${W}px;height:${H}px">${gui(W, H, 0, 1350, .08)}<div class="moldura"></div>
    <div class="abs caps" style="left:96px;top:130px;font-size:18px;color:${CL};display:flex;align-items:center;gap:18px"><span class="fio" style="width:48px"></span>E também</div>
    <div class="abs" style="left:96px;right:96px;top:220px">${C.itens.slice(2).map(it => `<div style="display:grid;grid-template-columns:150px 1fr;padding:58px 0;border-bottom:1px solid rgba(255,255,255,.2)">
      <div class="sf" style="font-size:80px;font-style:italic;font-weight:500;line-height:1;color:${CL}">${it.n}</div>
      <div><div class="sf" style="font-size:56px;font-weight:600;line-height:1.08">${it.t}</div><div style="font-size:27px;line-height:1.45;color:rgba(255,255,255,.8);margin-top:12px">${it.txt}</div>
      <div class="caps" style="font-size:14px;color:${CL};margin-top:16px">${it.lei}</div></div></div>`).join('')}</div>
    ${rodape('rgba(255,255,255,.6)', pag(4))}</div>`;
  const cta = `<div class="p mf" style="width:${W}px;height:${H}px">${gui(W, H, 540, 640, .07, NV)}<div class="moldura"></div>
    <div class="abs" style="left:0;right:0;top:250px;display:flex;flex-direction:column;align-items:center;text-align:center">${selo(260, NV)}
      <div class="sf" style="font-size:84px;font-weight:600;line-height:1.08;margin-top:70px">Cartório é<br><i style="font-weight:500;color:${AZ}">solução.</i></div>
      <div style="font-size:30px;line-height:1.5;color:rgba(11,31,58,.75);margin-top:30px;max-width:720px">Salve este post e envie para quem está precisando resolver um desses serviços.</div>
      <div class="caps" style="font-size:20px;margin-top:56px;padding:20px 34px;border:1.5px solid ${NV}">Siga ${ARROBA}</div></div>
    ${rodape('rgba(11,31,58,.5)', pag(5))}</div>`;

  const destaque = k => `<div class="p nv" style="width:1080px;height:1920px">${gui(1080, 1920, 540, 960, .08)}
    <div class="abs" style="left:240px;top:660px;width:600px;height:600px;border-radius:50%;border:2px solid rgba(255,255,255,.5);display:grid;place-items:center">
      <div class="abs" style="inset:16px;border-radius:50%;border:1px solid rgba(255,255,255,.22)"></div>${icone(k, 260, '#fff', 1)}
      <div class="abs" style="left:50%;top:-7px;width:14px;height:14px;background:${VM};transform:translateX(-50%) rotate(45deg)"></div></div></div>`;

  const yt = `<div class="p nv" style="width:2560px;height:1440px">${gui(2560, 1440, 2200, 720, .08)}${svgCheio(2560, 1440, guilhoche(300, 720, { r1: 900, op: .05 }))}
    <div class="abs" style="left:507px;top:508px;width:1546px;height:423px;display:flex;align-items:center;gap:56px">
      ${selo(300)}<div style="width:1px;align-self:stretch;margin:30px 0;background:rgba(255,255,255,.3)"></div>
      <div><div class="caps" style="font-size:22px;color:${CL};display:flex;align-items:center;gap:20px"><span class="fio" style="width:56px"></span>Notas · Registros · Protesto</div>
      <div class="sf" style="font-size:84px;font-weight:600;line-height:1.05;margin-top:22px">Notários e Registradores<br><i style="font-weight:500">de Pernambuco</i></div></div></div></div>`;
  const perfil = `<div class="p nv" style="width:800px;height:800px;display:grid;place-items:center">${gui(800, 800, 400, 400, .07)}${selo(640)}</div>`;

  return { id: 'A', nome: 'Selo', resumo: 'Institucional clássica. Navy e marfim, serifa Playfair Display, guilhochê de papel de segurança e um selo circular, como os de documento oficial. Passa tradição e fé pública.', head, cores: [[NV, 'Navy'], [AZ, 'Azul'], [MF, 'Marfim'], ['#FFFFFF', 'Branco'], [VM, 'Vermelho']], fontes: 'Playfair Display + Inter',
    feed: { servico: feedServico, agenda: feedAgenda, frase: feedFrase }, carrossel: [capa, item(C.itens[0], 2), item(C.itens[1], 3), lista, cta], destaque, yt, perfil };
}

// =====================================================================================
// B · GRADE — moderna, suíça: azul royal, navy, grade de linhas, Inter Tight pesada, quadrado vermelho
// =====================================================================================
function opcaoB() {
  const AZ = '#1340C8', NV = '#0A1633', CI = '#EEF2F8', VM = '#E10600';
  const head = fonte('family=Inter+Tight:wght@400;500;600;700;800;900&family=IBM+Plex+Mono:wght@400;500') + `<style>${BASE}
  .p{font-family:'Inter Tight',sans-serif;color:#fff}
  .mono{font-family:'IBM Plex Mono',monospace;letter-spacing:.02em}
  .az{background:${AZ}}.nv{background:${NV}}.ci{background:${CI};color:${NV}}
  .tit{font-weight:800;letter-spacing:-.045em;line-height:.9}
  .q{display:inline-block;background:${VM}}
  </style>`;
  const grade = (w, h, cor = 'rgba(255,255,255,.12)', col = 6) => `<div class="abs" style="inset:0;background-image:linear-gradient(90deg,${cor} 1px,transparent 1px);background-size:${w / col}px 100%"></div>
    <div class="abs" style="left:0;right:0;top:${Math.round(h * .5)}px;height:1px;background:${cor}"></div>`;
  const simbolo = (px, fundo = '#fff', letra = AZ) => `<svg width="${px}" height="${px}" viewBox="0 0 100 100"><rect width="100" height="100" fill="${fundo}"/>
    <path d="M18 82 L44 18 H56 L82 82 H68 L62 66 H38 L32 82Z M42.5 54 H57.5 L50 34.5Z" fill="${letra}"/><rect x="74" y="74" width="12" height="12" fill="${VM}"/></svg>`;
  const marca = (cor = '#fff', fundo = '#fff', letra = AZ) => `<div style="display:flex;align-items:center;gap:20px">${simbolo(78, fundo, letra)}<div style="line-height:1"><div style="font-size:34px;font-weight:900;letter-spacing:-.02em;color:${cor}">ANOREG<span style="color:${VM}">.</span>PE</div><div class="mono" style="font-size:15px;color:${cor};opacity:.7;margin-top:8px">Notários e Registradores</div></div></div>`;
  const rodape = (cor, dir) => `<div class="abs mono" style="left:72px;right:72px;bottom:64px;display:flex;justify-content:space-between;font-size:20px;color:${cor}"><span>${ARROBA}</span><span>${dir}</span></div>`;
  const W = 1080, H = 1350;

  const feedServico = `<div class="p az" style="width:${W}px;height:${H}px">${grade(W, H)}
    <div class="abs" style="left:72px;top:72px">${marca()}</div>
    <div class="abs mono" style="right:72px;top:96px;font-size:20px;text-align:right">Serviços<br>extrajudiciais</div>
    <div class="abs tit" style="left:66px;top:330px;font-size:176px">Resolva<br>no cartório<span class="q" style="width:34px;height:34px;margin-left:8px"></span></div>
    <div class="abs" style="left:72px;right:72px;top:770px;font-size:32px;line-height:1.4;font-weight:500;max-width:700px">Sem processo judicial. Com segurança jurídica.</div>
    <div class="abs" style="left:72px;right:72px;bottom:150px;display:grid;grid-template-columns:1fr 1fr;gap:12px">
      ${C.servicos.map((s, i) => `<div style="background:#fff;color:${NV};padding:24px 28px;display:flex;justify-content:space-between;align-items:center"><span style="font-size:34px;font-weight:700;letter-spacing:-.02em">${s}</span><span class="mono" style="font-size:20px;color:${AZ}">0${i + 1}</span></div>`).join('')}</div>
    ${rodape('rgba(255,255,255,.8)', 'anoregpe')}</div>`;

  const feedAgenda = `<div class="p ci" style="width:${W}px;height:${H}px">${grade(W, H, 'rgba(10,22,51,.08)')}
    <div class="abs" style="left:72px;top:72px">${marca(NV, AZ, '#fff')}</div>
    <div class="abs mono" style="right:72px;top:90px;background:${VM};color:#fff;padding:12px 18px;font-size:20px">${C.agenda.tag}</div>
    <div class="abs tit" style="left:60px;top:300px;font-size:330px;color:${AZ};letter-spacing:-.06em">27<span style="color:${NV}">/</span>28</div>
    <div class="abs mono" style="left:72px;top:640px;font-size:26px;color:${NV}">NOV 2026 — ${C.agenda.local}</div>
    <div class="abs az" style="left:0;right:0;bottom:0;height:560px"></div>
    <div class="abs tit" style="left:72px;right:72px;bottom:190px;font-size:96px;line-height:.96;color:#fff">${C.agenda.titulo}</div>
    ${rodape('rgba(255,255,255,.8)', 'Link na bio ↗')}</div>`;

  const feedFrase = `<div class="p nv" style="width:${W}px;height:${H}px">${grade(W, H, 'rgba(255,255,255,.08)')}
    <div class="abs" style="left:72px;top:72px"><span class="q" style="width:30px;height:30px"></span></div>
    <div class="abs tit" style="left:66px;right:80px;top:300px;font-size:112px;line-height:.98;letter-spacing:-.04em">Segurança jurídica é o que dá <span style="color:#6E95FF">tranquilidade</span> a quem assina.</div>
    <div class="abs" style="left:72px;bottom:150px">${marca()}</div>${rodape('rgba(255,255,255,.6)', '')}</div>`;

  const capa = `<div class="p az" style="width:${W}px;height:${H}px">${grade(W, H)}
    <div class="abs" style="left:72px;top:72px">${marca()}</div>
    <div class="abs mono" style="right:72px;top:96px;font-size:20px">Guia prático</div>
    <div class="abs tit" style="right:40px;top:130px;font-size:620px;color:transparent;-webkit-text-stroke:3px rgba(255,255,255,.35);letter-spacing:-.06em">5</div>
    <div class="abs tit" style="left:66px;right:72px;top:620px;font-size:132px">O que resolver no cartório<span class="q" style="width:28px;height:28px;margin-left:6px"></span></div>
    <div class="abs" style="left:72px;top:1060px;font-size:32px;font-weight:500">Sem precisar de processo judicial.</div>
    ${rodape('rgba(255,255,255,.85)', 'Arraste →')}</div>`;
  const item = (it, p) => `<div class="p ci" style="width:${W}px;height:${H}px">${grade(W, H, 'rgba(10,22,51,.07)')}
    <div class="abs az" style="left:0;top:0;width:${W}px;height:540px"></div>
    <div class="abs tit" style="left:52px;top:40px;font-size:470px;color:#fff;letter-spacing:-.07em">${it.n}</div>
    <div class="abs" style="left:72px;top:580px;width:30px;height:30px;background:${VM}"></div>
    <div class="abs tit" style="left:68px;right:72px;top:650px;font-size:104px;color:${NV}">${it.t}</div>
    <div class="abs" style="left:72px;right:110px;top:900px;font-size:34px;line-height:1.45;font-weight:500;color:${NV}">${it.txt}</div>
    <div class="abs mono" style="left:72px;bottom:150px;font-size:22px;color:${AZ};border-top:2px solid ${AZ};padding-top:16px">${it.lei}</div>
    ${rodape('rgba(10,22,51,.6)', `0${p}/05`)}</div>`;
  const lista = `<div class="p nv" style="width:${W}px;height:${H}px">${grade(W, H, 'rgba(255,255,255,.07)')}
    <div class="abs mono" style="left:72px;top:90px;font-size:22px;color:#6E95FF">E também ↓</div>
    <div class="abs" style="left:72px;right:72px;top:170px">${C.itens.slice(2).map(it => `<div style="border-top:2px solid rgba(255,255,255,.9);padding:30px 0 52px;display:grid;grid-template-columns:200px 1fr">
      <div class="tit" style="font-size:120px;color:#6E95FF;letter-spacing:-.06em">${it.n}</div>
      <div><div class="tit" style="font-size:66px;line-height:.98">${it.t}</div><div style="font-size:27px;line-height:1.4;margin-top:16px;opacity:.85">${it.txt}</div><div class="mono" style="font-size:18px;margin-top:14px;color:#6E95FF">${it.lei}</div></div></div>`).join('')}</div>
    ${rodape('rgba(255,255,255,.6)', '04/05')}</div>`;
  const cta = `<div class="p az" style="width:${W}px;height:${H}px">${grade(W, H)}
    <div class="abs" style="left:72px;top:150px">${simbolo(220)}</div>
    <div class="abs tit" style="left:66px;right:72px;top:470px;font-size:150px">Cartório é solução<span class="q" style="width:30px;height:30px;margin-left:6px"></span></div>
    <div class="abs" style="left:72px;right:200px;top:820px;font-size:32px;line-height:1.4;font-weight:500">Salve e envie para quem precisa resolver um desses serviços.</div>
    <div class="abs" style="left:72px;top:1010px;background:#fff;color:${NV};padding:26px 34px;font-size:36px;font-weight:800;letter-spacing:-.02em;display:flex;gap:30px;align-items:center">Siga ${ARROBA}<span style="color:${VM}">↗</span></div>
    ${rodape('rgba(255,255,255,.85)', '05/05')}</div>`;

  const destaque = k => `<div class="p az" style="width:1080px;height:1920px">${grade(1080, 1920, 'rgba(255,255,255,.1)', 4)}
    <div class="abs" style="left:290px;top:710px;width:500px;height:500px;background:#fff;display:grid;place-items:center">${icone(k, 300, AZ, 1.5)}
    <div class="abs" style="right:0;bottom:0;width:56px;height:56px;background:${VM}"></div></div></div>`;
  const yt = `<div class="p az" style="width:2560px;height:1440px">${grade(2560, 1440, 'rgba(255,255,255,.1)', 10)}
    <div class="abs tit" style="left:2080px;top:60px;font-size:1300px;color:transparent;-webkit-text-stroke:3px rgba(255,255,255,.14)">A</div>
    <div class="abs" style="left:507px;top:508px;width:1546px;height:423px;display:flex;align-items:center;gap:60px">
      ${simbolo(300)}<div><div class="tit" style="font-size:150px">ANOREG<span style="color:${VM}">.</span>PE</div>
      <div class="mono" style="font-size:30px;margin-top:22px;opacity:.9">Associação dos Notários e Registradores de Pernambuco</div></div></div></div>`;
  const perfil = `<div class="p az" style="width:800px;height:800px;display:grid;place-items:center">${simbolo(480, AZ, '#fff')}</div>`;

  return { id: 'B', nome: 'Grade', resumo: 'Moderna, de linha suíça. Azul royal em blocos, grade aparente, Inter Tight bem pesada, números enormes e o quadrado vermelho como assinatura. Passa agilidade e uma associação atual.', head, cores: [[AZ, 'Azul royal'], [NV, 'Navy'], [CI, 'Gelo'], ['#FFFFFF', 'Branco'], [VM, 'Vermelho']], fontes: 'Inter Tight + IBM Plex Mono',
    feed: { servico: feedServico, agenda: feedAgenda, frase: feedFrase }, carrossel: [capa, item(C.itens[0], 2), item(C.itens[1], 3), lista, cta], destaque, yt, perfil };
}

// =====================================================================================
// C · EDITORIAL — revista/jornal: papel branco, tinta navy, Fraunces itálica, filetes e índice
// =====================================================================================
function opcaoC() {
  const TI = '#101C33', AZ = '#2B59C3', PA = '#F8F7F3', VM = '#D7263D';
  const head = fonte('family=Fraunces:ital,opsz,wght@0,9..144,300..800;1,9..144,300..800&family=Inter:wght@400;500;600;700') + `<style>${BASE}
  .p{font-family:Inter,sans-serif;color:${TI};background:${PA}}
  .fr{font-family:Fraunces,serif;font-optical-sizing:auto}
  .caps{text-transform:uppercase;letter-spacing:.22em;font-weight:600}
  .esc{background:${TI};color:#fff}.azf{background:${AZ};color:#fff}
  .filete{height:0;border-top:1.5px solid currentColor}
  .ponto{color:${VM}}
  </style>`;
  const marca = (cor = TI, px = 46) => `<div style="color:${cor};line-height:1"><span class="fr" style="font-size:${px}px;font-style:italic;font-weight:500;letter-spacing:-.02em">Anoreg</span><span class="fr ponto" style="font-size:${px}px">.</span><span class="caps" style="font-size:${px * .3}px;margin-left:12px;vertical-align:.5em">Pernambuco</span></div>`;
  const cabeca = (cor, dir) => `<div class="abs" style="left:80px;right:80px;top:76px;color:${cor}"><div style="display:flex;justify-content:space-between;align-items:flex-end;padding-bottom:22px">${marca(cor)}<span class="caps" style="font-size:15px;opacity:.75">${dir}</span></div><div class="filete"></div><div class="filete" style="margin-top:5px;opacity:.4;border-top-width:1px"></div></div>`;
  const rodape = (cor, dir) => `<div class="abs caps" style="left:80px;right:80px;bottom:72px;color:${cor};font-size:15px;display:flex;justify-content:space-between;border-top:1px solid currentColor;padding-top:18px;opacity:.8"><span>${ARROBA}</span><span>${dir}</span></div>`;
  const W = 1080, H = 1350;

  const feedServico = `<div class="p" style="width:${W}px;height:${H}px">${cabeca(TI, 'Serviços extrajudiciais')}
    <div class="abs fr" style="left:72px;right:80px;top:250px;font-size:212px;font-weight:300;line-height:.9;letter-spacing:-.04em">Resolva<br><i style="font-weight:400">no cartório</i><span class="ponto">.</span></div>
    <div class="abs" style="left:80px;top:780px;width:440px;font-size:30px;line-height:1.55"><span class="fr" style="float:left;font-size:104px;line-height:.8;margin:6px 12px 0 0;color:${AZ};font-weight:500">D</span>ivórcio, inventário, usucapião e mudança de nome podem ser feitos fora do Judiciário, com a segurança de quem tem fé pública.</div>
    <div class="abs" style="left:580px;right:80px;top:780px">${C.itens.slice(0, 4).map(it => `<div style="display:flex;align-items:baseline;gap:10px;padding:20px 0;border-bottom:1px solid rgba(16,28,51,.2)"><span class="fr" style="font-style:italic;color:${AZ};font-size:28px">${it.n}</span><span style="font-size:26px;font-weight:600">${it.t}</span></div>`).join('')}</div>
    ${rodape(TI, 'Boletim nº 01')}</div>`;

  const feedAgenda = `<div class="p esc" style="width:${W}px;height:${H}px">${cabeca('#fff', 'Agenda')}
    <div class="abs caps" style="left:80px;top:250px;font-size:17px;color:#fff;display:flex;gap:16px;align-items:center"><span style="width:12px;height:12px;border-radius:50%;background:${VM}"></span>${C.agenda.tag}</div>
    <div class="abs fr" style="left:70px;top:300px;font-size:330px;font-weight:300;line-height:1;letter-spacing:-.05em">27<i style="color:#8FB0FF;font-weight:300">–</i>28</div>
    <div class="abs fr" style="left:80px;top:640px;font-size:44px;font-style:italic;color:#8FB0FF">de novembro de 2026</div>
    <div class="abs" style="left:80px;right:80px;top:760px"><div class="filete" style="opacity:.4"></div>
      <div class="fr" style="font-size:78px;font-weight:400;line-height:1.02;letter-spacing:-.02em;margin-top:40px">${C.agenda.titulo}</div>
      <div class="caps" style="font-size:18px;margin-top:30px;opacity:.75">${C.agenda.local}</div></div>
    ${rodape('#fff', 'Link na bio')}</div>`;

  const feedFrase = `<div class="p azf" style="width:${W}px;height:${H}px">${cabeca('#fff', 'Palavra')}
    <div class="abs fr" style="left:80px;right:90px;top:330px;font-size:100px;font-weight:300;font-style:italic;line-height:1.06;letter-spacing:-.02em">“Segurança jurídica é o que dá <span style="font-weight:600;font-style:normal">tranquilidade</span> a quem assina<span class="ponto" style="color:#fff">.</span>”</div>
    <div class="abs" style="left:80px;top:1040px;width:60px;height:4px;background:${VM}"></div>
    ${rodape('#fff', 'Anoreg/PE')}</div>`;

  const capa = `<div class="p" style="width:${W}px;height:${H}px">${cabeca(TI, 'Guia prático · 5 serviços')}
    <div class="abs fr" style="right:40px;top:180px;font-size:760px;font-weight:200;line-height:1;color:${AZ};opacity:.08;letter-spacing:-.06em">5</div>
    <div class="abs fr" style="left:72px;right:80px;top:470px;font-size:150px;font-weight:300;line-height:.92;letter-spacing:-.04em">O que você pode resolver <i style="font-weight:400;color:${AZ}">no cartório</i><span class="ponto">.</span></div>
    <div class="abs" style="left:80px;top:1060px;font-size:28px;line-height:1.5;max-width:640px">Cinco serviços que dispensam processo judicial.</div>
    ${rodape(TI, 'Arraste →')}</div>`;
  const item = (it, p) => `<div class="p" style="width:${W}px;height:${H}px">${cabeca(TI, `Guia prático · ${p}/5`)}
    <div class="abs fr" style="left:64px;top:240px;font-size:300px;font-weight:200;font-style:italic;line-height:1;color:${AZ}">${it.n}</div>
    <div class="abs" style="left:80px;right:80px;top:620px"><div class="fr" style="font-size:104px;font-weight:400;line-height:.98;letter-spacing:-.03em">${it.t}<span class="ponto">.</span></div>
      <div style="display:grid;grid-template-columns:1fr 280px;gap:50px;margin-top:50px;border-top:1.5px solid ${TI};padding-top:34px">
        <div style="font-size:31px;line-height:1.55">${it.txt}</div>
        <div style="border-left:1px solid rgba(16,28,51,.25);padding-left:28px"><div class="caps" style="font-size:13px;color:${VM}">Base legal</div><div class="fr" style="font-size:30px;font-style:italic;margin-top:12px;line-height:1.25">${it.lei}</div></div></div></div>
    ${rodape(TI, ARROBA.slice(1))}</div>`;
  const lista = `<div class="p esc" style="width:${W}px;height:${H}px">${cabeca('#fff', 'Guia prático · 4/5')}
    <div class="abs fr" style="left:80px;top:250px;font-size:64px;font-style:italic;font-weight:300">E também<span class="ponto">.</span></div>
    <div class="abs" style="left:80px;right:80px;top:380px">${C.itens.slice(2).map(it => `<div style="display:grid;grid-template-columns:140px 1fr;padding:36px 0;border-top:1px solid rgba(255,255,255,.3)">
      <div class="fr" style="font-size:70px;font-weight:200;font-style:italic;color:#8FB0FF;line-height:1">${it.n}</div>
      <div><div class="fr" style="font-size:56px;font-weight:400;line-height:1.02">${it.t}</div><div style="font-size:26px;line-height:1.5;margin-top:12px;opacity:.85">${it.txt} <span class="fr" style="font-style:italic;color:#8FB0FF">${it.lei}.</span></div></div></div>`).join('')}</div>
    ${rodape('#fff', ARROBA.slice(1))}</div>`;
  const cta = `<div class="p" style="width:${W}px;height:${H}px">${cabeca(TI, 'Guia prático · 5/5')}
    <div class="abs fr" style="left:72px;right:80px;top:330px;font-size:170px;font-weight:300;line-height:.92;letter-spacing:-.04em">Cartório<br>é <i style="color:${AZ};font-weight:400">solução</i><span class="ponto">.</span></div>
    <div class="abs" style="left:80px;right:300px;top:740px;font-size:31px;line-height:1.55">Salve este guia e envie para quem está precisando resolver um desses serviços.</div>
    <div class="abs" style="left:80px;right:80px;top:960px;display:flex;justify-content:space-between;align-items:center;border-top:1.5px solid ${TI};border-bottom:1.5px solid ${TI};padding:30px 0">
      <span class="fr" style="font-size:52px;font-style:italic">Siga ${ARROBA}</span><span class="fr" style="font-size:52px;color:${VM}">→</span></div>
    ${rodape(TI, 'Anoreg/PE')}</div>`;

  const destaque = k => `<div class="p" style="width:1080px;height:1920px;background:${PA}">
    <div class="abs" style="left:240px;top:660px;width:600px;height:600px;border-radius:50%;background:${TI};display:grid;place-items:center">${icone(k, 270, '#fff', 1)}
      <div class="abs" style="right:92px;bottom:92px;width:30px;height:30px;border-radius:50%;background:${VM}"></div></div></div>`;
  const yt = `<div class="p" style="width:2560px;height:1440px">
    <div class="abs fr" style="right:120px;top:-60px;font-size:1500px;font-weight:200;font-style:italic;line-height:1;color:${AZ};opacity:.08">A</div>
    <div class="abs" style="left:507px;top:508px;width:1546px;height:423px;display:flex;flex-direction:column;justify-content:center">
      <div class="caps" style="font-size:22px;color:${AZ}">Associação dos Notários e Registradores de Pernambuco</div>
      <div class="fr" style="font-size:190px;font-weight:300;line-height:.95;letter-spacing:-.04em;margin-top:20px"><i style="font-weight:400">Anoreg</i><span class="ponto">.</span> Pernambuco</div>
      <div style="height:2px;background:${TI};margin-top:34px"></div></div></div>`;
  const perfil = `<div class="p esc" style="width:800px;height:800px;display:grid;place-items:center"><div class="fr" style="font-size:520px;font-style:italic;font-weight:400;line-height:1;margin:-40px 0 0 -30px">A<span class="ponto">.</span></div></div>`;

  return { id: 'C', nome: 'Editorial', resumo: 'Revista de alto padrão. Papel claro, tinta navy, Fraunces itálica, filetes duplos, capitular, índice e o ponto vermelho como assinatura. Passa conhecimento e autoridade.', head, cores: [[TI, 'Tinta'], [AZ, 'Azul'], [PA, 'Papel'], ['#FFFFFF', 'Branco'], [VM, 'Vermelho']], fontes: 'Fraunces + Inter',
    feed: { servico: feedServico, agenda: feedAgenda, frase: feedFrase }, carrossel: [capa, item(C.itens[0], 2), item(C.itens[1], 3), lista, cta], destaque, yt, perfil };
}

// =====================================================================================
// D · AZULEJO — Pernambuco: cobalto, padrão de azulejo (Recife/Olinda), Sora, miolo vermelho
// =====================================================================================
function opcaoD() {
  const CO = '#0E3A8A', NV = '#081F4D', CE = '#D8E5FB', VM = '#D62F2F';
  // ladrilho 160×160: quartos de círculo nos cantos, losango e flor central
  const ladrilho = (linha, op = 1, cor2 = VM) => `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><g fill="none" stroke="${linha}" stroke-opacity="${op}" stroke-width="2">
    <circle cx="0" cy="0" r="56"/><circle cx="160" cy="0" r="56"/><circle cx="0" cy="160" r="56"/><circle cx="160" cy="160" r="56"/>
    <circle cx="0" cy="0" r="40"/><circle cx="160" cy="0" r="40"/><circle cx="0" cy="160" r="40"/><circle cx="160" cy="160" r="40"/>
    <path d="M80 26 L134 80 L80 134 L26 80Z"/>
    <path d="M80 44 C92 62 98 68 116 80 C98 92 92 98 80 116 C68 98 62 92 44 80 C62 68 68 62 80 44Z"/></g>
    <circle cx="80" cy="80" r="7" fill="${cor2}" fill-opacity="${op}"/></svg>`;
  const fundoLad = (linha, op, tam = 160, cor2) => `background-image:url('data:image/svg+xml,${encodeURIComponent(ladrilho(linha, op, cor2))}');background-size:${tam}px ${tam}px`;
  const head = fonte('family=Sora:wght@300;400;600;700;800&family=Inter:wght@400;500;600') + `<style>${BASE}
  .p{font-family:Sora,sans-serif;color:#fff}
  .co{background:${CO}}.br{background:#fff;color:${NV}}.ce{background:${CE};color:${NV}}
  .tit{font-weight:700;letter-spacing:-.035em;line-height:1}
  .rot{font-family:Inter;text-transform:uppercase;letter-spacing:.24em;font-weight:600}
  </style>`;
  const simbolo = (px, linha = '#fff', fundo = 'none') => `<svg width="${px}" height="${px}" viewBox="0 0 100 100"><rect width="100" height="100" fill="${fundo}"/><g fill="none" stroke="${linha}" stroke-width="4.5">
    <path d="M50 6 A44 44 0 0 1 94 50"/><path d="M94 50 A44 44 0 0 1 50 94"/><path d="M50 94 A44 44 0 0 1 6 50"/><path d="M6 50 A44 44 0 0 1 50 6"/>
    <path d="M50 22 C57 38 62 43 78 50 C62 57 57 62 50 78 C43 62 38 57 22 50 C38 43 43 38 50 22Z"/></g><circle cx="50" cy="50" r="6.5" fill="${VM}"/></svg>`;
  const marca = (cor = '#fff') => `<div style="display:flex;align-items:center;gap:20px">${simbolo(76, cor)}<div style="line-height:1"><div style="font-size:32px;font-weight:800;letter-spacing:.02em;color:${cor}">ANOREG<span style="font-weight:300">/PE</span></div><div class="rot" style="font-size:12.5px;color:${cor};opacity:.75;margin-top:9px">Notários e Registradores</div></div></div>`;
  const rodape = (cor, dir) => `<div class="abs rot" style="left:80px;right:80px;bottom:64px;display:flex;justify-content:space-between;font-size:15px;color:${cor}"><span>${ARROBA}</span><span>${dir}</span></div>`;
  const W = 1080, H = 1350;
  const faixa = (h, op = .28) => `<div class="abs" style="left:0;right:0;top:0;height:${h}px;${fundoLad('#fff', op)};-webkit-mask:linear-gradient(180deg,#000 40%,transparent)"></div>`;

  const feedServico = `<div class="p co" style="width:${W}px;height:${H}px">${faixa(620)}
    <div class="abs" style="left:80px;top:80px">${marca()}</div>
    <div class="abs br" style="left:56px;right:56px;bottom:56px;height:800px;padding:70px 64px">
      <div class="rot" style="font-size:16px;color:${CO};display:flex;align-items:center;gap:14px"><span style="width:12px;height:12px;background:${VM};transform:rotate(45deg)"></span>Serviços extrajudiciais</div>
      <div class="tit" style="font-size:128px;margin-top:26px">Resolva no <span style="color:${CO}">cartório.</span></div>
      <div style="font-size:28px;line-height:1.5;margin-top:26px;color:#3A4A6B;font-weight:400">Sem processo judicial, com segurança jurídica.</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:44px">${C.servicos.map(s => `<div class="ce" style="padding:22px 26px;font-size:28px;font-weight:600;display:flex;align-items:center;gap:16px"><span style="width:10px;height:10px;background:${VM};transform:rotate(45deg);flex:none"></span>${s}</div>`).join('')}</div>
      <div class="rot" style="position:absolute;left:64px;right:64px;bottom:44px;font-size:14px;color:#6B7A99;display:flex;justify-content:space-between"><span>${ARROBA}</span><span>Pernambuco</span></div></div></div>`;

  const feedAgenda = `<div class="p br" style="width:${W}px;height:${H}px">
    <div class="abs co" style="left:0;top:0;width:${W}px;height:700px"></div><div class="abs" style="left:0;top:0;width:${W}px;height:700px;${fundoLad('#fff', .22)}"></div>
    <div class="abs" style="left:80px;top:80px">${marca()}</div>
    <div class="abs br" style="left:80px;top:300px;width:400px;height:400px;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 30px 60px rgba(8,31,77,.25)">
      <div class="rot" style="font-size:16px;color:${VM}">Novembro</div><div class="tit" style="font-size:150px;color:${CO};letter-spacing:-.05em;margin-top:10px">27·28</div><div class="rot" style="font-size:16px;color:#6B7A99;margin-top:10px">2026</div></div>
    <div class="abs" style="left:540px;top:440px;background:${VM};color:#fff;padding:14px 20px" ><span class="rot" style="font-size:15px">${C.agenda.tag}</span></div>
    <div class="abs" style="left:80px;right:80px;top:790px"><div class="tit" style="font-size:80px;line-height:1.05">${C.agenda.titulo}</div>
    <div style="font-size:28px;color:#3A4A6B;margin-top:30px;display:flex;align-items:center;gap:14px"><span style="width:10px;height:10px;background:${VM};transform:rotate(45deg)"></span>${C.agenda.local}</div></div>
    ${rodape('#6B7A99', 'Link na bio')}</div>`;

  const feedFrase = `<div class="p co" style="width:${W}px;height:${H}px"><div class="abs" style="inset:0;${fundoLad('#fff', .1)}"></div>
    <div class="abs br" style="left:90px;right:90px;top:220px;bottom:220px;display:flex;flex-direction:column;justify-content:center;padding:0 80px">
      <div style="margin-bottom:40px">${simbolo(90, CO)}</div>
      <div class="tit" style="font-size:76px;font-weight:600;line-height:1.14;letter-spacing:-.025em">Segurança jurídica é o que dá <span style="color:${CO}">tranquilidade</span> a quem assina.</div></div>
    ${rodape('rgba(255,255,255,.85)', 'ANOREG/PE')}</div>`;

  const capa = `<div class="p co" style="width:${W}px;height:${H}px"><div class="abs" style="inset:0;${fundoLad('#fff', .18)};-webkit-mask:linear-gradient(200deg,#000 10%,transparent 65%)"></div>
    <div class="abs" style="left:80px;top:80px">${marca()}</div>
    <div class="abs" style="left:80px;right:80px;top:500px">
      <div class="rot" style="font-size:17px;display:flex;align-items:center;gap:14px"><span style="width:12px;height:12px;background:${VM};transform:rotate(45deg)"></span>Guia prático</div>
      <div class="tit" style="font-size:118px;margin-top:30px">O que você pode resolver no cartório</div>
      <div style="font-size:30px;line-height:1.5;margin-top:34px;color:${CE};font-weight:300">5 serviços sem processo judicial.</div></div>
    ${rodape('#fff', 'Arraste →')}</div>`;
  const item = (it, p) => `<div class="p br" style="width:${W}px;height:${H}px">
    <div class="abs co" style="right:0;top:0;width:420px;height:${H}px"></div><div class="abs" style="right:0;top:0;width:420px;height:${H}px;${fundoLad('#fff', .25)}"></div>
    <div class="abs co" style="left:80px;top:110px;width:220px;height:220px;display:grid;place-items:center"><span class="tit" style="font-size:110px;color:#fff">${it.n}</span></div>
    <div class="abs" style="left:80px;top:400px;width:540px">
      <div class="tit" style="font-size:86px;line-height:1.02">${it.t}</div>
      <div style="width:60px;height:6px;background:${VM};margin-top:40px"></div>
      <div style="font-size:31px;line-height:1.55;margin-top:40px;color:#3A4A6B;font-weight:400">${it.txt}</div>
      <div class="ce" style="display:inline-block;margin-top:44px;padding:16px 22px;font-family:Inter;font-weight:600;font-size:20px;color:${CO}">${it.lei}</div></div>
    <div class="abs rot" style="left:80px;bottom:64px;font-size:15px;color:#6B7A99">${ARROBA}</div><div class="abs rot" style="right:80px;bottom:64px;font-size:15px;color:#fff">${p} / 5</div></div>`;
  const lista = `<div class="p ce" style="width:${W}px;height:${H}px">
    <div class="abs rot" style="left:80px;top:110px;font-size:17px;color:${CO};display:flex;align-items:center;gap:14px"><span style="width:12px;height:12px;background:${VM};transform:rotate(45deg)"></span>E também</div>
    <div class="abs" style="left:80px;right:80px;top:190px;display:flex;flex-direction:column;gap:22px">${C.itens.slice(2).map(it => `<div class="br" style="display:grid;grid-template-columns:150px 1fr;align-items:start;padding:44px 44px 44px 0">
      <div class="tit" style="font-size:64px;color:${CO};text-align:center">${it.n}</div>
      <div><div class="tit" style="font-size:54px">${it.t}</div><div style="font-size:26px;line-height:1.45;margin-top:14px;color:#3A4A6B">${it.txt}</div><div style="font-family:Inter;font-weight:600;font-size:18px;margin-top:14px;color:${CO}">${it.lei}</div></div></div>`).join('')}</div>
    ${rodape('#6B7A99', '4 / 5')}</div>`;
  const cta = `<div class="p co" style="width:${W}px;height:${H}px"><div class="abs" style="inset:0;${fundoLad('#fff', .14)}"></div>
    <div class="abs br" style="left:90px;right:90px;top:180px;bottom:180px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 70px">
      ${simbolo(200, CO)}
      <div class="tit" style="font-size:96px;margin-top:56px">Cartório é <span style="color:${CO}">solução.</span></div>
      <div style="font-size:29px;line-height:1.5;margin-top:28px;color:#3A4A6B">Salve e envie para quem precisa resolver um desses serviços.</div>
      <div class="co" style="margin-top:50px;padding:24px 40px;font-size:30px;font-weight:700;color:#fff">Siga ${ARROBA}</div></div>
    ${rodape('#fff', '5 / 5')}</div>`;

  const destaque = k => `<div class="p co" style="width:1080px;height:1920px"><div class="abs" style="inset:0;${fundoLad('#fff', .12)}"></div>
    <div class="abs br" style="left:240px;top:660px;width:600px;height:600px;border-radius:50%;display:grid;place-items:center;box-shadow:0 0 0 18px ${CO},0 0 0 22px rgba(255,255,255,.6)">${icone(k, 270, CO, 1.3)}
      <div class="abs" style="left:50%;bottom:86px;width:22px;height:22px;background:${VM};transform:translateX(-50%) rotate(45deg)"></div></div></div>`;
  const yt = `<div class="p co" style="width:2560px;height:1440px"><div class="abs" style="inset:0;${fundoLad('#fff', .2, 240)};-webkit-mask:linear-gradient(90deg,transparent 15%,#000 60%)"></div>
    <div class="abs" style="left:507px;top:508px;width:1546px;height:423px;display:flex;align-items:center;gap:60px">
      <div class="br" style="width:330px;height:330px;display:grid;place-items:center;flex:none">${simbolo(250, CO)}</div>
      <div><div class="tit" style="font-size:136px;letter-spacing:-.02em">ANOREG<span style="font-weight:300">/PE</span></div>
      <div class="rot" style="font-size:24px;margin-top:26px;color:${CE}">Notários e Registradores de Pernambuco</div></div></div></div>`;
  const perfil = `<div class="p co" style="width:800px;height:800px;display:grid;place-items:center"><div class="abs" style="inset:0;${fundoLad('#fff', .1)}"></div>
    <div class="br" style="width:520px;height:520px;border-radius:50%;display:grid;place-items:center;position:relative">${simbolo(330, CO)}</div></div>`;

  return { id: 'D', nome: 'Azulejo', resumo: 'Pernambucana. Azul cobalto com o padrão de azulejo português de Recife e Olinda, cartões brancos, Sora e o miolo vermelho no centro do ladrilho. Tem raiz local e é a mais calorosa.', head, cores: [[CO, 'Cobalto'], [NV, 'Navy'], [CE, 'Céu'], ['#FFFFFF', 'Branco'], [VM, 'Vermelho']], fontes: 'Sora + Inter',
    feed: { servico: feedServico, agenda: feedAgenda, frase: feedFrase }, carrossel: [capa, item(C.itens[0], 2), item(C.itens[1], 3), lista, cta], destaque, yt, perfil };
}

export const OPCOES = [opcaoA(), opcaoB(), opcaoC(), opcaoD()];

// lista plana de peças: { opcao, nome, w, h, html }
export function pecas(o) {
  const l = [];
  for (const [k, html] of Object.entries(o.feed)) l.push({ nome: `feed-${k}`, w: 1080, h: 1350, html });
  o.carrossel.forEach((html, i) => l.push({ nome: `carrossel-${i + 1}`, w: 1080, h: 1350, html }));
  DESTAQUES.forEach(([k]) => l.push({ nome: `destaque-${k}`, w: 1080, h: 1920, html: o.destaque(k) }));
  l.push({ nome: 'youtube-banner', w: 2560, h: 1440, html: o.yt });
  l.push({ nome: 'perfil', w: 800, h: 800, html: o.perfil });
  return l;
}
