// Opções de logo do podcast "Entre notas e registros" (ANOREG/PE): seis caminhos de símbolo + logotipo,
// cada um com paleta e tipografia próprias, e um PDF de apresentação (capa, uma página por opção, comparativo).
// Uso: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node opcoes.mjs
// Saída: saida/opcoes/ (Entre-notas-e-registros-opcoes-de-logo.pdf, paginas/*.png, logos/*.png sem fundo)
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const root = path.dirname(new URL(import.meta.url).pathname);
const { chromium } = createRequire(path.join(root, '../../moldes/treino-de-pecas/package.json'))('playwright');
const OUT = path.join(root, 'saida', 'opcoes');
fs.rmSync(OUT, { recursive: true, force: true });
for (const d of ['paginas', 'logos']) fs.mkdirSync(path.join(OUT, d), { recursive: true });

const HEAD = `<meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=DM+Serif+Display:ital@0;1&family=Sora:wght@400;600;800&family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=Oswald:wght@500;700&family=IBM+Plex+Mono:wght@500;700&family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"><style>*{box-sizing:border-box;margin:0}body{font-family:Inter,sans-serif;-webkit-font-smoothing:antialiased}</style>`;
let uid = 0;
const svg = (px, corpo, extra = '') => `<svg viewBox="0 0 200 200" width="${px}" height="${px}" style="display:block;flex:none;${extra}">${corpo}</svg>`;
const rot = (px, cor, txt = 'PODCAST · ANOREG/PE', fam = 'Inter') => `<span style="font-family:${fam};font-weight:700;font-size:${px}px;letter-spacing:.32em;color:${cor};white-space:nowrap">${txt}</span>`;

// ---------- 1. Selo sonoro ----------
const SELO = (() => {
  const pts = [];
  for (let i = 0; i <= 360; i++) { const t = i / 360 * Math.PI * 2, r = 94 + 4.2 * Math.cos(28 * t); pts.push(`${(100 + r * Math.sin(t)).toFixed(2)},${(100 - r * Math.cos(t)).toFixed(2)}`); }
  const c = r => `M${100 - r},100a${r},${r} 0 1,0 ${2 * r},0a${r},${r} 0 1,0 ${-2 * r},0Z`;
  return `M${pts.join('L')}Z ${c(84)} ${c(79)} ${c(75)}`;
})();
const PENA = 'M86,48 Q86,44 90,44 L110,44 Q114,44 114,48 L114,80 C114,103 107,124 100,154 C93,124 86,103 86,80 Z M100,79 m-5.5,0 a5.5,5.5 0 1,0 11,0 a5.5,5.5 0 1,0 -11,0 Z M98.8,90 L101.2,90 L101.2,138 L98.8,138 Z';
const barrasSelo = [[-58, 22], [-44, 42], [-30, 66], [30, 66], [44, 42], [58, 22]].map(([x, h]) => `<rect x="${95 + x}" y="${100 - h / 2}" width="10" height="${h}" rx="5"/>`).join('');

// ---------- 2. Microfone pautado: cápsula com as pautas do livro, margem vermelha e a pena como pedestal ----------
const microfone = (px, cor, acento, fundo) => {
  const id = 'm' + (++uid);
  const linhas = Array.from({ length: 6 }, (_, i) => `<rect x="60" y="${38 + i * 13}" width="80" height="4.5" fill="#000"/>`).join('');
  return svg(px, `<defs><mask id="${id}"><rect width="200" height="200" fill="#fff"/>${linhas}</mask></defs>
    <rect x="68" y="18" width="64" height="104" rx="32" fill="${cor}" mask="url(#${id})"/>
    <rect x="84" y="30" width="4" height="82" fill="${acento}"/>
    <path d="M48,88 a52,52 0 0 0 104,0" fill="none" stroke="${cor}" stroke-width="9" stroke-linecap="round"/>
    <path d="M90,140 L110,140 L110,152 C110,166 105,176 100,192 C95,176 90,166 90,152 Z" fill="${acento}"/>
    <circle cx="100" cy="155" r="3.6" fill="${fundo}"/><rect x="99" y="160" width="2" height="22" fill="${fundo}"/>`);
};

// ---------- 3. Diálogo: dois balões de conversa, n e r ----------
const dialogo = (px, cor, acento, fundo) => svg(px, `
  <path d="M18,40 Q18,20 38,20 L112,20 Q132,20 132,40 L132,92 Q132,112 112,112 L58,112 L30,136 L36,112 Q18,110 18,92 Z" fill="${cor}"/>
  <path d="M74,86 Q74,68 92,68 L164,68 Q182,68 182,86 L182,138 Q182,156 164,156 L158,156 L164,180 L138,156 L92,156 Q74,156 74,138 Z" fill="${acento}" stroke="${fundo}" stroke-width="7"/>
  <text x="46" y="84" font-family="Sora" font-weight="800" font-size="56" fill="${fundo}" text-anchor="middle">n</text>
  <text x="128" y="134" font-family="Sora" font-weight="800" font-size="62" fill="${fundo}" text-anchor="middle">r</text>`);

// ---------- 4. Livro sonoro: o livro aberto desenhado com barras de onda ----------
const livro = (px, cor, acento) => {
  const xs = [15, 32, 49, 66, 83], amp = [4, 26, 10, 32, 14];
  const barra = (x, i, lado) => { const dx = x; const topo = 66 - dx * dx * .0025 - amp[i] * .9; const base = 150 - dx * dx * .0016; return `<rect x="${100 + lado * dx - 5.5}" y="${topo.toFixed(1)}" width="11" height="${(base - topo).toFixed(1)}" rx="5.5" fill="${cor}"/>`; };
  return svg(px, `${xs.map((x, i) => barra(x, i, -1) + barra(x, i, 1)).join('')}
    <rect x="96" y="58" width="8" height="98" rx="4" fill="${acento}"/>
    <path d="M10,156 Q55,176 100,166 Q145,176 190,156" fill="none" stroke="${acento}" stroke-width="8" stroke-linecap="round"/>`);
};

// ---------- 5. Carimbo: o próprio carimbo de cartório é o logo ----------
const carimbo = (s, cor, papel) => `<div style="display:inline-block;transform:rotate(-4deg);padding:${s * .06}px">
  <div style="border:${s * .05}px solid ${cor};padding:${s * .035}px;border-radius:${s * .04}px">
  <div style="border:${s * .015}px solid ${cor};border-radius:${s * .02}px;padding:${s * .12}px ${s * .22}px;text-align:center;color:${cor};font-family:Oswald;font-weight:700;line-height:.95">
    <div style="font-size:${s * .42}px;letter-spacing:.04em">ENTRE NOTAS</div>
    <div style="display:flex;align-items:center;gap:${s * .1}px;justify-content:center;margin:${s * .1}px 0;font-family:'IBM Plex Mono';font-size:${s * .16}px;letter-spacing:.3em;font-weight:700">
      <span style="flex:1;height:${s * .02}px;background:${cor}"></span>— PODCAST —<span style="flex:1;height:${s * .02}px;background:${cor}"></span></div>
    <div style="font-size:${s * .42}px;letter-spacing:.04em">E REGISTROS</div>
    <div style="font-family:'IBM Plex Mono';font-size:${s * .13}px;letter-spacing:.34em;margin-top:${s * .12}px">ANOREG · PE</div></div></div></div>`;
const carimboSimb = (px, cor) => svg(px, `<g transform="rotate(-6 100 100)">
  <rect x="22" y="22" width="156" height="156" rx="10" fill="none" stroke="${cor}" stroke-width="10"/>
  <rect x="36" y="36" width="128" height="128" rx="5" fill="none" stroke="${cor}" stroke-width="3.5"/>
  <text x="100" y="100" font-family="Oswald" font-weight="700" font-size="58" fill="${cor}" text-anchor="middle">N·R</text>
  ${[10, 22, 34, 18, 28, 12, 24, 8].map((h, i) => `<rect x="${58 + i * 11}" y="${132 - h / 2}" width="6" height="${h}" rx="3" fill="${cor}"/>`).join('')}</g>`);

// ---------- 6. Nota-pena: colcheia cuja haste é uma pena e a bandeira são ondas de som ----------
const notaPena = (px, cor, acento) => svg(px, `
  <ellipse cx="72" cy="152" rx="34" ry="25" transform="rotate(-22 72 152)" fill="${cor}"/>
  <path d="M96,20 L112,20 L112,104 C112,120 108,132 104,146 L101,146 C98,132 96,120 96,104 Z" fill="${cor}"/>
  <circle cx="104" cy="98" r="4" fill="${acento}"/>
  ${[0, 1, 2].map(i => `<path d="M${124 + i * 18},${38 - i * 4} q${16 + i * 6},${24 + i * 6} 0,${48 + i * 12}" fill="none" stroke="${acento}" stroke-width="9" stroke-linecap="round" opacity="${1 - i * .22}"/>`).join('')}`);

// ---------- As opções ----------
const OP = [
  {
    nome: 'Selo sonoro', fam: "'Fraunces'", escuro: '#0F1E36', claro: '#F5EFE4', luz: '#F5EFE4', tinta: '#0F1E36', acento: '#E2A63B', acentoClaro: '#B9801C', extra: '#B8432F',
    fundo: 'radial-gradient(130% 110% at 80% 10%,#1B3357 0%,#0F1E36 45%,#0A1527 100%)',
    conceito: 'O selo dos carimbos de cartório guarda uma onda sonora; a barra do meio é a pena de escrever. Institucional, confiável, com cara de fé pública.',
    tom: 'Clássico · institucional', fontes: 'Fraunces + Inter',
    simb: (px, m, o) => svg(px, `<path d="${SELO}" fill="${m === 'escuro' ? o.luz : o.tinta}" fill-rule="evenodd"/><g fill="${m === 'escuro' ? o.luz : o.tinta}">${barrasSelo}</g><path d="${PENA}" fill="${o.acento}" fill-rule="evenodd"/>`),
    marca: (s, m, o) => { const c = m === 'escuro' ? o.luz : o.tinta, a = m === 'escuro' ? o.acento : o.acentoClaro; return `<div style="font-family:Fraunces;color:${c};line-height:.86;font-variation-settings:'SOFT' 50,'WONK' 1">
      <div style="font-style:italic;font-size:${s * .52}px;color:${a}">entre</div><div style="font-weight:800;font-size:${s}px;letter-spacing:-.02em">NOTAS</div>
      <div style="font-weight:800;font-size:${s}px;letter-spacing:-.02em;white-space:nowrap"><i style="font-weight:400;color:${a};font-size:${s * .78}px;margin-right:${s * .1}px">e</i>REGISTROS</div>
      <div style="margin-top:${s * .28}px">${rot(s * .17, a)}</div></div>`; },
    titulo: (px, o) => `<span style="font-family:Fraunces;font-weight:800;font-size:${px}px;line-height:1;color:${o.luz}">Usucapião <i style="font-weight:400;color:${o.acento}">no</i> cartório</span>`,
  },
  {
    nome: 'Microfone pautado', fam: "'DM Serif Display'", escuro: '#3D0F1F', claro: '#F7EFE6', luz: '#F7EFE6', tinta: '#3D0F1F', acento: '#D9895B', acentoClaro: '#B8653A', extra: '#E9C7A8',
    fundo: 'linear-gradient(160deg,#5A1A2E 0%,#3D0F1F 55%,#2A0914 100%)',
    conceito: 'Um microfone cuja cápsula tem as pautas e a margem de uma folha de registro, apoiado numa pena. Diz “podcast” à primeira vista, sem perder o cartório.',
    tom: 'Elegante · caloroso', fontes: 'DM Serif Display + Inter',
    simb: (px, m, o) => microfone(px, m === 'escuro' ? o.luz : o.tinta, o.acento, m === 'escuro' ? o.escuro : o.claro),
    marca: (s, m, o) => { const c = m === 'escuro' ? o.luz : o.tinta, a = m === 'escuro' ? o.acento : o.acentoClaro; return `<div style="font-family:'DM Serif Display';color:${c};line-height:.95">
      <div style="font-size:${s}px;white-space:nowrap">Entre notas</div><div style="font-size:${s}px;white-space:nowrap"><i style="color:${a}">e</i> registros</div>
      <div style="margin-top:${s * .32}px">${rot(s * .17, a)}</div></div>`; },
    titulo: (px, o) => `<span style="font-family:'DM Serif Display';font-size:${px}px;line-height:1;color:${o.luz}">Usucapião <i style="color:${o.acento}">no</i> cartório</span>`,
  },
  {
    nome: 'Diálogo', fam: "'Sora'", escuro: '#1F2FA8', claro: '#F8F6F1', luz: '#FFFFFF', tinta: '#121633', acento: '#FF6B57', acentoClaro: '#E8513D', extra: '#2340C8',
    fundo: 'linear-gradient(150deg,#2B44D6 0%,#1F2FA8 60%,#16207A 100%)',
    conceito: 'Dois balões de conversa: notas (n) e registros (r) em diálogo. É o formato do programa, uma conversa entre os dois mundos do extrajudicial. Moderno e jovem.',
    tom: 'Moderno · descontraído', fontes: 'Sora + Inter',
    simb: (px, m, o) => dialogo(px, m === 'escuro' ? o.luz : o.tinta, o.acento, m === 'escuro' ? o.escuro : o.claro),
    marca: (s, m, o) => { const c = m === 'escuro' ? o.luz : o.tinta, a = m === 'escuro' ? o.acento : o.acentoClaro; return `<div style="font-family:Sora;font-weight:800;color:${c};line-height:.95;letter-spacing:-.045em">
      <div style="font-size:${s}px;white-space:nowrap">entre notas</div><div style="font-size:${s}px;white-space:nowrap"><span style="color:${a}">e</span> registros<span style="color:${a}">.</span></div>
      <div style="margin-top:${s * .3}px;letter-spacing:0">${rot(s * .16, m === 'escuro' ? 'rgba(255,255,255,.8)' : o.tinta, 'PODCAST · ANOREG/PE', 'Sora')}</div></div>`; },
    titulo: (px, o) => `<span style="font-family:Sora;font-weight:800;letter-spacing:-.04em;font-size:${px}px;line-height:1;color:${o.luz}">usucapião <span style="color:${o.acento}">no</span> cartório</span>`,
  },
  {
    nome: 'Livro sonoro', fam: "'Playfair Display'", escuro: '#0F3B33', claro: '#F3EEDF', luz: '#F3EEDF', tinta: '#0F3B33', acento: '#D8B25A', acentoClaro: '#A9812B', extra: '#1E5A4E',
    fundo: 'radial-gradient(120% 120% at 20% 0%,#1A5246 0%,#0F3B33 50%,#0A2924 100%)',
    conceito: 'O livro de registro aberto, desenhado com as barras de uma onda sonora; a lombada dourada é a linha que une as páginas. Tradição e voz no mesmo desenho.',
    tom: 'Sóbrio · tradicional', fontes: 'Playfair Display + Inter',
    simb: (px, m, o) => livro(px, m === 'escuro' ? o.luz : o.tinta, m === 'escuro' ? o.acento : o.acentoClaro),
    marca: (s, m, o) => { const c = m === 'escuro' ? o.luz : o.tinta, a = m === 'escuro' ? o.acento : o.acentoClaro; return `<div style="font-family:'Playfair Display';color:${c};line-height:1;text-align:left">
      <div style="font-weight:500;font-size:${s * .26}px;letter-spacing:.5em;color:${a};margin-bottom:${s * .12}px">PODCAST</div>
      <div style="font-weight:700;font-size:${s}px;white-space:nowrap">Entre Notas</div><div style="font-weight:700;font-size:${s}px;white-space:nowrap"><i style="font-weight:500;color:${a}">e</i> Registros</div>
      <div style="height:${Math.max(2, s * .03)}px;background:${a};width:${s * 1.2}px;margin:${s * .26}px 0 ${s * .2}px"></div>${rot(s * .16, c, 'ANOREG/PE')}</div>`; },
    titulo: (px, o) => `<span style="font-family:'Playfair Display';font-weight:700;font-size:${px}px;line-height:1.02;color:${o.luz}">Usucapião <i style="font-weight:500;color:${o.acento}">no</i> cartório</span>`,
  },
  {
    nome: 'Carimbo', fam: "'Oswald'", escuro: '#1B1B1B', claro: '#F2EBDD', luz: '#F2EBDD', tinta: '#B3312A', acento: '#D9433A', acentoClaro: '#B3312A', extra: '#7A1E19',
    fundo: 'linear-gradient(160deg,#262626 0%,#1B1B1B 60%,#111 100%)', papelClaro: true,
    conceito: 'O logo é o próprio carimbo de cartório, com borda dupla e levemente torto, como batido à mão no papel. Direto, memorável e com humor sutil.',
    tom: 'Ousado · documental', fontes: 'Oswald + IBM Plex Mono',
    simb: (px, m, o) => carimboSimb(px, m === 'escuro' ? o.acento : o.tinta),
    marca: (s, m, o) => carimbo(s * 2, m === 'escuro' ? o.acento : o.tinta, o.claro),
    soMarca: true,
    titulo: (px, o) => `<span style="font-family:Oswald;font-weight:700;font-size:${px}px;line-height:1;color:${o.luz};text-transform:uppercase">Usucapião <span style="color:${o.acento}">no</span> cartório</span>`,
  },
  {
    nome: 'Nota-pena', fam: "'Instrument Serif'", escuro: '#151515', claro: '#F5F2EA', luz: '#F5F2EA', tinta: '#151515', acento: '#F2C230', acentoClaro: '#C99A0E', extra: '#2A2A2A',
    fundo: 'radial-gradient(120% 120% at 85% 10%,#2B2B2B 0%,#151515 55%,#0B0B0B 100%)',
    conceito: 'A nota musical cuja haste é uma pena e a bandeira são ondas de som: o trocadilho das “notas” em um desenho só. Leve, editorial e muito fácil de reconhecer.',
    tom: 'Editorial · minimalista', fontes: 'Instrument Serif + Inter',
    simb: (px, m, o) => notaPena(px, m === 'escuro' ? o.luz : o.tinta, m === 'escuro' ? o.acento : o.acentoClaro),
    marca: (s, m, o) => { const c = m === 'escuro' ? o.luz : o.tinta, a = m === 'escuro' ? o.acento : o.acentoClaro; return `<div style="font-family:'Instrument Serif';color:${c};line-height:.9">
      <div style="font-size:${s * 1.1}px;white-space:nowrap;letter-spacing:-.01em">entre notas</div><div style="font-size:${s * 1.1}px;white-space:nowrap"><i style="color:${a}">e</i> registros</div>
      <div style="margin-top:${s * .3}px">${rot(s * .16, a)}</div></div>`; },
    titulo: (px, o) => `<span style="font-family:'Instrument Serif';font-size:${px * 1.15}px;line-height:.95;color:${o.luz}">Usucapião <i style="color:${o.acento}">no</i> cartório</span>`,
  },
];

// ---------- Blocos da página ----------
const lockup = (o, s, m) => o.soMarca ? o.marca(s, m, o) : `<div style="display:inline-flex;align-items:center;gap:${s * .5}px">${o.simb(s * 2.6, m, o)}${o.marca(s, m, o)}</div>`;
const avatar = (o, px) => `<div style="width:${px}px;height:${px}px;border-radius:50%;background:${o.fundo};display:flex;align-items:center;justify-content:center;flex:none;box-shadow:0 10px 26px rgba(0,0,0,.18)">${o.simb(px * .66, 'escuro', o)}</div>`;
const mini = (o, w) => { const k = w / 1080; return `<div style="position:relative;width:${w}px;height:${w * 1.25}px;flex:none;border-radius:8px;overflow:hidden;background:${o.fundo};box-shadow:0 10px 26px rgba(0,0,0,.18)">
  <div style="position:absolute;left:${90 * k}px;top:${90 * k}px">${o.simb(150 * k, 'escuro', o)}</div>
  <div style="position:absolute;left:${90 * k}px;top:${330 * k}px;font-weight:800;font-size:${26 * k}px;letter-spacing:.3em;color:${o.acento}">EPISÓDIO 01</div>
  <div style="position:absolute;left:${90 * k}px;right:${90 * k}px;top:${390 * k}px">${o.titulo(150 * k, o)}</div>
  <div style="position:absolute;left:${90 * k}px;right:${90 * k}px;bottom:${90 * k}px;padding-top:${30 * k}px;border-top:${2 * k}px solid ${o.acento};font-size:${30 * k}px;color:${o.luz};opacity:.85">com <b>Nome do Convidado</b></div></div>`; };
const amostras = o => [o.escuro, o.acento, o.claro, o.extra].map(c => `<div style="width:62px;height:62px;border-radius:50%;background:${c};border:2px solid rgba(0,0,0,.08)" title="${c}"></div>`).join('');

const pagina = (o, i) => `<section style="position:relative;width:1920px;height:1080px;overflow:hidden;background:#F4F1EA;display:flex;break-after:page">
  <div style="position:relative;width:1100px;height:1080px;background:${o.fundo};display:flex;align-items:center;justify-content:center;flex:none">
    <div style="position:absolute;left:70px;top:60px;font-weight:800;font-size:20px;letter-spacing:.3em;color:${o.luz};opacity:.7">OPÇÃO ${i + 1}</div>
    ${lockup(o, 76, 'escuro')}</div>
  <div style="flex:1;padding:70px 70px 60px;display:flex;flex-direction:column;gap:26px;color:#1a1a1a">
    <div><div style="font-weight:800;font-size:18px;letter-spacing:.28em;color:#8a857b">${String(i + 1).padStart(2, '0')} · ${o.tom.toUpperCase()}</div>
      <div style="font-family:${o.fam};font-weight:700;font-size:62px;line-height:1;margin-top:10px">${o.nome}</div>
      <p style="font-size:21px;line-height:1.5;color:#4a4740;margin-top:14px">${o.conceito}</p></div>
    <div style="height:210px;border-radius:14px;background:${o.claro};border:2px solid #e2ddd2;display:flex;align-items:center;justify-content:center;overflow:hidden">${lockup(o, o.soMarca ? 36 : 38, 'claro')}</div>
    <div style="display:flex;gap:26px;align-items:flex-end">${mini(o, 230)}
      <div style="display:flex;flex-direction:column;gap:22px">${avatar(o, 150)}
        <div style="display:flex;gap:10px">${amostras(o)}</div>
        <div style="font-size:16px;color:#6b665c;line-height:1.5">${o.fontes}<br>Foto de perfil · post de episódio</div></div></div>
  </div></section>`;

const capa = `<section style="position:relative;width:1920px;height:1080px;overflow:hidden;background:#141414;color:#F4F1EA;break-after:page;padding:110px 130px;display:flex;flex-direction:column;justify-content:space-between">
  <div style="font-weight:800;font-size:20px;letter-spacing:.34em;color:#E2A63B">PODCAST · ANOREG/PE</div>
  <div><div style="font-family:Fraunces;font-size:150px;font-weight:800;line-height:.9;letter-spacing:-.03em">Entre notas<br><i style="font-weight:400;color:#E2A63B">e</i> registros</div>
    <div style="font-size:34px;margin-top:40px;color:rgba(244,241,234,.8)">Opções de logo · ${OP.length} caminhos para escolher</div></div>
  <div style="display:flex;gap:28px;align-items:center">${OP.map(o => avatar(o, 120)).join('')}</div></section>`;

const compara = `<section style="position:relative;width:1920px;height:1080px;overflow:hidden;background:#F4F1EA;break-after:page;padding:70px 90px">
  <div style="font-weight:800;font-size:18px;letter-spacing:.28em;color:#8a857b">COMPARATIVO</div>
  <div style="font-family:Fraunces;font-weight:800;font-size:62px;line-height:1;margin-top:10px;color:#1a1a1a">Qual caminho seguimos?</div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:40px">
  ${OP.map((o, i) => `<div style="height:390px;border-radius:16px;overflow:hidden;background:${o.fundo};position:relative;display:flex;flex-direction:column">
    <div style="flex:1;display:flex;align-items:center;justify-content:center;transform:scale(.78)">${lockup(o, 40, 'escuro')}</div>
    <div style="background:rgba(0,0,0,.28);padding:16px 22px;display:flex;justify-content:space-between;align-items:center;color:${o.luz}">
      <span style="font-weight:800;font-size:22px">${i + 1} · ${o.nome}</span><span style="font-size:15px;letter-spacing:.14em;opacity:.8">${o.tom.toUpperCase()}</span></div></div>`).join('')}</div>
  <p style="font-size:19px;color:#6b665c;margin-top:26px">Dá para combinar: o símbolo de uma opção com a paleta ou a tipografia de outra. Escolhida a direção, a identidade completa (redes, YouTube, Spotify e gravação) é refeita nela.</p></section>`;

const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const pronto = async () => { await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(400); };

// Logos sem fundo de cada opção (versões para fundo escuro e claro)
const slug = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
for (const [i, o] of OP.entries()) for (const m of ['escuro', 'claro']) {
  await page.setViewportSize({ width: 2600, height: 1400 });
  await page.setContent(`<!doctype html><html><head>${HEAD}<style>body{background:transparent}</style></head><body><div id="l" style="display:inline-block;padding:50px">${lockup(o, 120, m)}</div></body></html>`); await pronto();
  await page.locator('#l').screenshot({ path: path.join(OUT, 'logos', `${i + 1}-${slug(o.nome)}-fundo-${m}.png`), omitBackground: true });
}

const doc = `<!doctype html><html><head>${HEAD}<style>@page{size:1920px 1080px;margin:0}body{width:1920px}</style></head><body>${capa}${OP.map(pagina).join('')}${compara}</body></html>`;
fs.mkdirSync(path.join(root, 'build'), { recursive: true });
fs.writeFileSync(path.join(root, 'build', 'opcoes.html'), doc);
await page.setViewportSize({ width: 1920, height: 1080 });
await page.goto('file://' + path.join(root, 'build', 'opcoes.html')); await pronto();
const secs = await page.locator('section').all();
for (const [i, s] of secs.entries()) await s.screenshot({ path: path.join(OUT, 'paginas', `${String(i + 1).padStart(2, '0')}.png`) });
await page.pdf({ path: path.join(OUT, 'Entre-notas-e-registros-opcoes-de-logo.pdf'), width: '1920px', height: '1080px', printBackground: true });
await browser.close();
console.log('✓', OP.length, 'opções,', secs.length, 'páginas e o PDF em', path.relative(process.cwd(), OUT));
