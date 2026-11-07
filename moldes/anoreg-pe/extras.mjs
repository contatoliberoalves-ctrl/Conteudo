// Peças a mais da identidade Azulejo da ANOREG/PE: capas com foto para o cidadão, elementos de Pernambuco
// (Olinda, farol, coqueiros, sombrinha de frevo, janela em arco colonial), aula semanal "Cartórios na Prática",
// notícia, aviso, aniversário, luto, capas de reels e de live e carrossel para cartorários (Provimento 149/2023).
// Fotos: fotos/fontes/<id>.jpg (baixar_fotos.sh). Logos de parceiros: assets/parceiros/ (fora do git).
import fs from 'node:fs';
import path from 'node:path';
import { COR, painel, trama, logo, ICONES } from './template.mjs';

const R = path.dirname(new URL(import.meta.url).pathname);
const I = COR.indigo, AM = COR.amarelo, VM = COR.vermelho;
const W = 1080, H = 1350, HS = 1920;
const foto = id => { const f = path.join(R, 'fotos', 'fontes', id + '.jpg'); return fs.existsSync(f) ? 'data:image/jpeg;base64,' + fs.readFileSync(f).toString('base64') : ''; };
const img = (id, css = '') => `<img src="${foto(id)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;${css}">`;
const arq = (n, tipo) => { const f = path.join(R, 'assets', 'parceiros', n); return fs.existsSync(f) ? `data:${tipo};base64,` + fs.readFileSync(f).toString('base64') : ''; };

// ---------- Pernambuco ----------
// silhueta de Olinda: Sé, Carmo, casario, farol e coqueiros (cor = desenho, rec = recortes de janelas)
function olinda(cor = '#fff', rec = I, h = 300) {
  const casas = [62, 48, 72, 54, 66, 46, 60, 52].map((a, i) => {
    const x = 520 + i * 50, top = 150 - a + i * 4;
    return `<rect x="${x}" y="${top}" width="46" height="${300 - top}" fill="${cor}"/>${i % 2 ? `<path d="M${x - 3} ${top} L${x + 23} ${top - 18} L${x + 49} ${top}Z" fill="${cor}"/>` : `<path d="M${x} ${top} h46 v-10 h-12 a11 11 0 0 0 -22 0 h-12z" fill="${cor}"/>`}
      <rect x="${x + 9}" y="${top + 14}" width="9" height="13" fill="${rec}"/><rect x="${x + 28}" y="${top + 14}" width="9" height="13" fill="${rec}"/><path d="M${x + 17} ${top + 58} v-12 a6 6 0 0 1 12 0 v12z" fill="${rec}"/>`;
  }).join('');
  const coqueiro = (x, alt, inc) => { const cx = x + inc, cy = 300 - alt;
    const folha = (dx, dy) => { const mx = cx + dx * .5, my = cy + dy * .5 - 14, L = Math.hypot(dx, dy), px = -dy / L * 9, py = dx / L * 9;
      return `<path d="M${cx} ${cy} Q${mx + px} ${my + py} ${cx + dx} ${cy + dy} Q${mx - px * .3} ${my - py * .3 + 6} ${cx} ${cy}Z" fill="${cor}"/>`; };
    return `<path d="M${x - 5} 300 Q${x + inc * .3} ${300 - alt * .55} ${cx - 3} ${cy} L${cx + 3} ${cy} Q${x + inc * .3 + 6} ${300 - alt * .55} ${x + 5} 300Z" fill="${cor}"/>
      ${[[-78, 16], [-62, 40], [-26, 52], [24, 54], [60, 40], [80, 14], [-40, -12], [42, -14]].map(([dx, dy]) => folha(dx, dy)).join('')}<circle cx="${cx}" cy="${cy}" r="7" fill="${cor}"/>`; };
  return `<svg width="100%" height="${h}" viewBox="0 0 1080 300" preserveAspectRatio="xMidYMax meet" style="display:block">
    ${casas}
    <rect x="150" y="160" width="58" height="140" fill="${cor}"/><path d="M146 160 L179 132 L212 160Z" fill="${cor}"/><rect x="206" y="118" width="26" height="182" fill="${cor}"/><path d="M204 118 L219 96 L234 118Z" fill="${cor}"/>
    <path d="M171 300 v-30 a8 8 0 0 1 16 0 v30z" fill="${rec}"/><rect x="214" y="132" width="10" height="16" fill="${rec}"/>
    <rect x="328" y="70" width="36" height="230" fill="${cor}"/><rect x="436" y="70" width="36" height="230" fill="${cor}"/>
    <path d="M326 70 L346 42 L366 70Z M434 70 L454 42 L474 70Z" fill="${cor}"/><rect x="364" y="98" width="72" height="202" fill="${cor}"/>
    <path d="M360 98 L400 64 L440 98Z" fill="${cor}"/><rect x="398" y="40" width="4" height="26" fill="${cor}"/><rect x="391" y="48" width="18" height="4" fill="${cor}"/>
    <path d="M388 300 v-36 a12 12 0 0 1 24 0 v36z" fill="${rec}"/><circle cx="400" cy="122" r="9" fill="${rec}"/>
    <rect x="340" y="88" width="12" height="18" fill="${rec}"/><rect x="448" y="88" width="12" height="18" fill="${rec}"/>
    <rect x="978" y="74" width="26" height="226" fill="${cor}"/><rect x="972" y="66" width="38" height="10" fill="${cor}"/><rect x="982" y="44" width="18" height="22" fill="${cor}"/><path d="M980 44 L991 32 L1002 44Z" fill="${cor}"/>
    ${[110, 160, 210].map(y => `<rect x="978" y="${y}" width="26" height="16" fill="${rec}"/>`).join('')}
    ${coqueiro(60, 190, 24)}${coqueiro(268, 150, -20)}${coqueiro(910, 170, 18)}${coqueiro(1050, 140, -16)}
    <path d="M0 300 L0 262 C160 244 280 226 420 228 C560 230 700 246 840 252 C960 256 1020 252 1080 248 L1080 300Z" fill="${cor}"/></svg>`;
}
// sombrinha de frevo nas cores do logo
function sombrinha(px, giro = 0) {
  const cores = [AM, VM, '#fff', I, AM, VM, '#fff', I];
  const fatias = cores.map((c, i) => {
    const a0 = Math.PI + i * Math.PI / 8, a1 = a0 + Math.PI / 8, r = 90;
    return `<path d="M100 100 L${100 + r * Math.cos(a0)} ${100 + r * Math.sin(a0)} A${r} ${r} 0 0 1 ${100 + r * Math.cos(a1)} ${100 + r * Math.sin(a1)}Z" fill="${c}" stroke="#fff" stroke-width="1.5"/>`;
  }).join('');
  const babado = Array.from({ length: 9 }, (_, i) => { const a = Math.PI + i * Math.PI / 8; return `<circle cx="${100 + 90 * Math.cos(a)}" cy="${100 + 90 * Math.sin(a)}" r="5" fill="#fff"/>`; }).join('');
  return `<svg width="${px}" height="${px * .75}" viewBox="0 0 200 150" style="transform:rotate(${giro}deg);display:block">${fatias}${babado}
    <path d="M100 100 V138 a8 8 0 0 1 -16 0" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/><circle cx="100" cy="12" r="5" fill="#fff"/></svg>`;
}
// janela em arco colonial com foto (moldura branca)
const arco = (id, w, h, borda = 12, css = '', pos = 'center') => `<div style="width:${w}px;height:${h}px;border-radius:${w / 2}px ${w / 2}px 0 0;border:${borda}px solid #fff;overflow:hidden;position:relative;flex:none;${css}">${img(id, `object-position:${pos}`)}</div>`;
const faixaAzulejo = (h, tam) => `<div style="height:${h}px;${painel(tam || h)}"></div>`;
const ico = (k, px, cor = '#fff', sw = 1.6) => `<svg width="${px}" height="${px}" viewBox="0 0 24 24" fill="none" stroke="${cor}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" style="flex:none">${k}</svg>`;
const IC = {
  cal: ICONES.eventos, rel: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  cam: '<rect x="3" y="6.5" width="12.5" height="11" rx="2"/><path d="M15.5 10.5l5-3v9l-5-3"/>',
  fone: '<path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5.5a2 2 0 0 1 2-2z"/>',
  ok: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
};
const confete = (n, w, h, sem = 7) => { let s = sem, o = ''; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < n; i++) { const c = [AM, VM, '#fff'][i % 3], x = r() * w, y = r() * h, a = r() * 180, t = 10 + r() * 14;
    o += `<div style="position:absolute;left:${x}px;top:${y}px;width:${t}px;height:${t * .45}px;background:${c};transform:rotate(${a}deg);opacity:.9"></div>`; } return o; };

// rodapé com o logo da ANOREG/PE em destaque e os parceiros embaixo (todos em branco)
function rodapeParceiros(w, h) {
  const cnb = arq('cnb-pe.png', 'image/png'), rib = arq('registro-imoveis-brasil.svg', 'image/svg+xml');
  const branco = 'filter:brightness(0) invert(1)';
  const texto = (a, b) => `<div style="color:#fff;line-height:1.05;text-align:center"><div style="font-weight:700;font-size:30px;letter-spacing:.02em">${a}</div><div style="font-weight:300;font-size:15px;margin-top:5px;letter-spacing:.04em">${b}</div></div>`;
  const parceiros = [
    texto('ARPEN·PE', 'Registro Civil'),
    cnb ? `<img src="${cnb}" style="height:78px;${branco}">` : texto('CNB·PE', 'Colégio Notarial'),
    texto('PROTESTO·PE', 'Cartórios de Protesto'),
    rib ? `<img src="${rib}" style="height:50px;${branco}">` : texto('RIB', 'Registro de Imóveis'),
  ];
  return `<div class="abs" style="left:0;right:0;bottom:0;height:${h}px;background:${COR.fundo};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:30px">
    ${logo('branco', w)}
    <div style="width:${W - 160}px;height:1px;background:rgba(255,255,255,.22)"></div>
    <div style="display:flex;align-items:center;justify-content:space-between;width:${W - 160}px">${parceiros.join('')}</div></div>`;
}

// ---------- capas para o cidadão (com foto) ----------
const cidCasamento = `<div class="p ind" style="width:${W}px;height:${H}px">${img('20091878', 'object-position:50% 30%')}
  <div class="abs" style="inset:0;background:linear-gradient(180deg,rgba(14,17,112,0) 30%,rgba(14,17,112,.85) 62%,${I} 80%)"></div>
  <div class="abs" style="left:84px;right:84px;bottom:250px"><div class="tit" style="font-size:150px">Vai casar?</div>
    <div style="font-size:56px;font-weight:300;margin-top:22px;line-height:1.2">O primeiro passo é no cartório.</div></div>
  <div class="abs" style="left:84px;bottom:150px">${logo('letreiroBranco', 230)}</div>
  <div class="abs" style="left:0;right:0;bottom:0">${faixaAzulejo(90)}</div></div>`;

const cidNascimento = `<div class="p br" style="width:${W}px;height:${H}px">
  <div class="abs" style="left:0;top:0;width:${W}px;height:820px">${img('325690', 'object-position:50% 60%')}</div>
  <div class="abs" style="left:0;right:0;top:820px">${faixaAzulejo(70)}</div>
  <div class="abs" style="left:84px;right:84px;top:950px"><div class="tit" style="font-size:88px">O registro de nascimento é gratuito.</div>
    <div style="font-size:40px;font-weight:300;margin-top:20px;color:${COR.texto}">E a primeira certidão também.</div></div>
  <div class="abs" style="right:84px;top:105px;background:#fff;padding:22px 26px">${logo('letreiroCor', 210)}</div></div>`;

const cidImovel = `<div class="p" style="width:${W}px;height:${H}px;${painel(270)}">
  <div class="abs" style="left:150px;top:90px">${arco('7641906', 780, 760, 16, 'box-shadow:0 30px 60px rgba(6,8,69,.3)', '50% 45%')}</div>
  <div class="abs ind" style="left:0;right:0;bottom:0;height:470px"></div>
  <div class="abs" style="left:84px;right:84px;top:930px"><div class="tit" style="font-size:104px">Comprou um imóvel?</div>
    <div style="font-size:50px;font-weight:300;margin-top:18px">Só é dono quem registra.</div></div>
  <div class="abs" style="right:84px;bottom:80px">${logo('letreiroBranco', 200)}</div></div>`;

const cidRecife = `<div class="p ind" style="width:${W}px;height:${H}px">${img('17488159', 'object-position:50% 40%')}
  <div class="abs" style="inset:0;background:linear-gradient(180deg,rgba(6,8,69,.55) 0%,rgba(6,8,69,0) 26%,rgba(14,17,112,0) 45%,rgba(14,17,112,.9) 70%,${I} 88%)"></div>
  <div class="abs" style="left:84px;top:84px">${logo('letreiroBranco', 230)}</div>
  <div class="abs" style="left:84px;right:84px;bottom:110px"><div class="tit" style="font-size:104px">Do Recife ao Sertão, tem cartório perto de você.</div></div></div>`;

const peOlinda = `<div class="p deg" style="width:${W}px;height:${H}px">
  <div class="abs" style="left:84px;top:96px">${logo('letreiroBranco', 230)}</div>
  <div class="abs" style="left:84px;right:84px;top:300px"><div class="tit" style="font-size:118px">Pernambuco registra a sua história.</div></div>
  <div class="abs" style="left:0;right:0;bottom:0">${olinda('#fff', I, 300)}</div></div>`;

// ---------- aula semanal: Cartórios na Prática ----------
const AULA = { n: 71, data: 'Quinta, 19 de novembro', hora: '19h', tema: 'Inventário extrajudicial com herdeiros menores',
  nome: 'Dra. Mariana Albuquerque', cv: 'Tabeliã de Notas em Caruaru · Mestra em Direito Civil', foto: '34381970', fone: '(81) 99256-9785' };
const tileAula = px => `<div style="width:${px}px;height:${px}px;${painel(px)};position:relative;box-shadow:0 18px 40px rgba(0,0,0,.25)">
  <div style="position:absolute;inset:${px * .2}px;border-radius:50%;background:${I};display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;line-height:1">
    <div style="font-size:${px * .085}px;font-weight:400;letter-spacing:.08em">AULA Nº</div><div style="font-size:${px * .27}px;font-weight:700;margin-top:${px * .02}px">${AULA.n}</div></div></div>`;
const infoAula = (fs, gap, col) => `<div style="display:flex;${col ? 'flex-direction:column;align-items:center' : 'flex-wrap:wrap'};gap:${gap}px;font-size:${fs}px;font-weight:400">
  <span style="display:flex;gap:14px;align-items:center">${ico(IC.cal, fs * 1.2)}${AULA.data}</span>
  <span style="display:flex;gap:14px;align-items:center">${ico(IC.rel, fs * 1.2)}${AULA.hora}</span>
  <span style="display:flex;gap:14px;align-items:center">${ico(IC.cam, fs * 1.2)}Ao vivo pelo Zoom</span></div>`;
const inscricao = fs => `<div style="background:#fff;color:${I};display:flex;align-items:center;gap:16px;padding:22px 30px;font-size:${fs}px;font-weight:400">${ico(IC.fone, fs * 1.3, I, 1.8)}
  <span>Inscrições: Suporte ANOREG/PE <b style="font-weight:700;white-space:nowrap">${AULA.fone}</b></span></div>`;
const tituloPrograma = fs => `<div class="tit" style="font-size:${fs}px">Cartórios na Prática</div><div style="font-size:${fs * .34}px;font-weight:300;margin-top:12px;opacity:.85">Programa de Aulas Práticas da ANOREG/PE</div>`;

const aulaFeed = `<div class="p deg" style="width:${W}px;height:${H}px">
  <div class="abs" style="left:72px;top:70px;right:260px">${tituloPrograma(78)}</div>
  <div class="abs" style="right:72px;top:70px">${tileAula(150)}</div>
  <div class="abs" style="left:72px;top:330px;display:flex;gap:44px;align-items:flex-end;right:72px">
    ${arco(AULA.foto, 330, 420, 10, '', '50% 20%')}
    <div style="min-width:0"><div class="tit" style="font-size:54px;font-weight:600;line-height:1.08">${AULA.tema}</div>
      <div style="width:60px;height:5px;background:${AM};margin:30px 0 26px"></div>
      <div style="font-size:34px;font-weight:600">${AULA.nome}</div><div style="font-size:24px;font-weight:300;margin-top:8px;line-height:1.4;opacity:.9">${AULA.cv}</div></div></div>
  <div class="abs" style="left:72px;right:72px;top:800px">${infoAula(27, 34)}</div>
  <div class="abs" style="left:72px;top:880px">${inscricao(28)}</div>
  ${rodapeParceiros(400, 300)}</div>`;

const aulaStory = `<div class="p deg" style="width:${W}px;height:${HS}px">
  <div class="abs" style="left:80px;right:80px;top:150px;text-align:center">${tituloPrograma(96)}</div>
  <div class="abs" style="left:0;right:0;top:420px;display:flex;justify-content:center;align-items:flex-end;gap:40px">
    ${arco(AULA.foto, 440, 560, 12, '', '50% 20%')}<div style="margin-bottom:-10px">${tileAula(170)}</div></div>
  <div class="abs" style="left:90px;right:90px;top:1030px;text-align:center"><div class="tit" style="font-size:60px;font-weight:600;line-height:1.1">${AULA.tema}</div>
    <div style="font-size:38px;font-weight:600;margin-top:34px">${AULA.nome}</div><div style="font-size:26px;font-weight:300;margin-top:8px;opacity:.9">${AULA.cv}</div></div>
  <div class="abs" style="left:0;right:0;top:1320px;display:flex;justify-content:center">${infoAula(30, 40)}</div>
  <div class="abs" style="left:0;right:0;top:1405px;display:flex;justify-content:center">${inscricao(30)}</div>
  ${rodapeParceiros(440, 360)}</div>`;

// ---------- notícia, aviso, aniversário, luto ----------
const noticia = `<div class="p br" style="width:${W}px;height:${H}px">
  <div class="abs" style="left:0;top:0;width:${W}px;height:720px">${img('17298658', 'object-position:50% 50%')}</div>
  <div class="abs" style="left:0;right:0;top:720px">${faixaAzulejo(56)}</div>
  <div class="abs" style="left:84px;right:84px;top:850px"><div class="tit" style="font-size:66px;font-weight:600;line-height:1.1">ANOREG/PE reúne cartórios de todo o estado em encontro no Recife</div>
    <div style="font-size:26px;font-weight:300;margin-top:26px;color:${COR.texto}">6 de novembro de 2026</div></div>
  <div class="abs" style="right:84px;bottom:76px">${logo('letreiroCor', 190)}</div></div>`;

const aviso = `<div class="p" style="width:${W}px;height:${H}px;${painel(270)}">
  <div class="abs ind" style="left:110px;right:110px;top:150px;bottom:150px;padding:80px 76px;display:flex;flex-direction:column">
    <div style="font-size:40px;font-weight:300;color:${AM}">Aviso</div>
    <div class="tit" style="font-size:84px;margin-top:22px">Feriado de 20 de novembro</div>
    <div style="font-size:34px;font-weight:300;line-height:1.5;margin-top:40px;opacity:.92">Dia da Consciência Negra. Os cartórios funcionam em regime de plantão: confira o atendimento com o cartório da sua cidade.</div>
    <div style="margin-top:auto">${logo('letreiroBranco', 210)}</div></div></div>`;

// foto quadrada com moldura branca e um azulejo deslocado atrás
const quadro = (src, px, cinza) => `<div style="position:relative;width:${px}px;height:${px}px">
  <div style="position:absolute;left:28px;top:28px;width:${px}px;height:${px}px;${cinza ? `background:#1C1C20;${trama(.12, px / 2)}` : painel(px / 2)}"></div>
  <div style="position:absolute;inset:0;border:12px solid ${cinza ? '#E8E8EA' : '#fff'};overflow:hidden;background:#2A2A30">${src
    ? `<img src="${src}" style="width:100%;height:100%;object-fit:cover;object-position:50% 25%;${cinza ? 'filter:grayscale(1)' : ''}">`
    : `<div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;color:#77777F;font-size:24px"><svg width="${px * .32}" height="${px * .32}" viewBox="0 0 24 24" fill="#55555C"><circle cx="12" cy="8.5" r="4.5"/><path d="M3.5 22c0-4.7 3.8-8.5 8.5-8.5s8.5 3.8 8.5 8.5z"/></svg>Foto</div>`}</div></div>`;

const aniversario = `<div class="p deg" style="width:${W}px;height:${H}px">${confete(52, W, 420)}
  <div class="abs" style="left:56px;top:70px">${sombrinha(190, -16)}</div>
  <div class="abs" style="left:0;right:0;top:130px;display:flex;justify-content:center"><div style="margin-right:28px">${quadro(foto('30781747'), 470)}</div></div>
  <div class="abs" style="left:84px;right:84px;top:690px;text-align:center">
    <div style="font-size:50px;font-weight:300">Feliz aniversário,</div>
    <div class="tit" style="font-size:92px;margin-top:6px">Ana Paula Ferreira</div>
    <div style="font-size:30px;font-weight:300;margin-top:16px;opacity:.85">Oficiala do Registro Civil de Caruaru</div>
    <div style="width:60px;height:5px;background:${AM};margin:38px auto"></div>
    <div style="font-size:32px;font-weight:300;line-height:1.45">Que o novo ciclo seja de saúde, alegria e muitas conquistas.</div></div>
  <div class="abs" style="left:0;right:0;bottom:70px;display:flex;justify-content:center">${logo('letreiroBranco', 200)}</div></div>`;

const laco = (w = 90) => `<svg width="${w}" height="${w * 130 / 90}" viewBox="0 0 90 130" fill="none" stroke="#E8E8EA" stroke-width="5" stroke-linejoin="round"><path d="M45 52 C30 30 18 14 30 6 C42 -2 52 18 45 52 C38 18 48 -2 60 6 C72 14 60 30 45 52Z"/><path d="M45 52 L18 124 L34 116 L45 128 M45 52 L72 124 L56 116 L45 128"/></svg>`;
const LUTO = { foto: '', nome: 'José Carlos de Albuquerque', cargo: 'Tabelião do 2º Ofício de Notas de Garanhuns' };
const luto = `<div class="p" style="width:${W}px;height:${H}px;background:#0B0B0D">
  <div class="abs" style="left:84px;top:84px">${laco(54)}</div>
  <div class="abs" style="left:0;right:0;top:110px;display:flex;justify-content:center"><div style="margin-right:28px">${quadro(LUTO.foto && foto(LUTO.foto), 400, true)}</div></div>
  <div class="abs" style="left:0;right:0;top:590px;display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 110px;color:#E8E8EA">
    <div style="font-size:30px;font-weight:300;letter-spacing:.06em;color:#A9A9B0">Nota de pesar</div>
    <div class="tit" style="font-size:70px;font-weight:600;margin-top:22px">${LUTO.nome}</div>
    <div style="font-size:28px;font-weight:300;margin-top:16px;color:#A9A9B0">${LUTO.cargo}</div>
    <div style="width:80px;height:1px;background:#55555C;margin:40px 0"></div>
    <div style="font-size:31px;font-weight:300;line-height:1.55">A ANOREG/PE lamenta profundamente o falecimento e se solidariza com a família, os amigos e os colegas de serviço.</div></div>
  <div class="abs" style="left:0;right:0;bottom:70px;display:flex;justify-content:center">${logo('mono', 260, 'opacity:.85')}</div></div>`;

// ---------- capas de reels (1080×1920; texto no miolo que aparece no grid) ----------
const reels1 = `<div class="p ind" style="width:${W}px;height:${HS}px">${img('35810442', 'object-position:50% 50%')}
  <div class="abs" style="inset:0;background:linear-gradient(180deg,rgba(6,8,69,.2) 0%,rgba(14,17,112,.35) 40%,rgba(14,17,112,.92) 66%,${I} 100%)"></div>
  <div class="abs" style="left:84px;right:84px;top:960px"><div class="tit" style="font-size:132px">O que é apostila de Haia?</div></div>
  <div class="abs" style="left:84px;top:1540px">${logo('letreiroBranco', 230)}</div></div>`;
const reels2 = `<div class="p" style="width:${W}px;height:${HS}px;${painel(270)}">
  <div class="abs ind" style="left:90px;right:90px;top:420px;height:1080px;padding:90px 80px;display:flex;flex-direction:column;justify-content:space-between">
    <div class="tit" style="font-size:118px">Divórcio no cartório precisa de advogado?</div>${logo('letreiroBranco', 230)}</div></div>`;
const reels3 = `<div class="p deg" style="width:${W}px;height:${HS}px">
  <div class="abs" style="left:0;top:0;width:${W}px;height:900px">${img('58890', 'object-position:50% 50%')}</div>
  <div class="abs" style="left:0;top:600px;width:${W}px;height:300px;background:linear-gradient(180deg,rgba(14,17,112,0),#151A8C)"></div>
  <div class="abs" style="left:84px;right:84px;top:930px"><div class="tit" style="font-size:150px">Usucapião em 1 minuto</div></div>
  <div class="abs" style="left:84px;top:1480px">${logo('letreiroBranco', 230)}</div></div>`;

// ---------- capas de live ----------
const aoVivo = px => `<div style="display:inline-flex;align-items:center;gap:${px * .5}px;background:${VM};padding:${px * .55}px ${px * .9}px;font-size:${px}px;font-weight:700;letter-spacing:.08em;color:#fff"><span style="width:${px * .6}px;height:${px * .6}px;border-radius:50%;background:#fff"></span>AO VIVO</div>`;
const live1 = `<div class="p deg" style="width:${W}px;height:${HS}px"><div class="abs" style="inset:0;${trama(.07)};-webkit-mask:linear-gradient(180deg,#000 0%,transparent 45%,transparent 75%,#000 100%)"></div>
  <div class="abs" style="left:84px;top:200px">${aoVivo(30)}</div>
  <div class="abs" style="left:84px;right:84px;top:310px"><div class="tit" style="font-size:120px">Live no Instagram</div></div>
  <div class="abs" style="left:0;right:0;top:640px;display:flex;justify-content:center">${arco(AULA.foto, 520, 640, 12, '', '50% 20%')}</div>
  <div class="abs" style="left:84px;right:84px;top:1330px;text-align:center"><div class="tit" style="font-size:62px;font-weight:600;line-height:1.1">Inventário com herdeiros menores: o que mudou</div>
    <div style="font-size:34px;font-weight:300;margin-top:26px">com ${AULA.nome} · quinta, 19h</div></div>
  <div class="abs" style="left:0;right:0;bottom:170px;display:flex;justify-content:center">${logo('letreiroBranco', 230)}</div></div>`;
const live2 = `<div class="p ind" style="width:${W}px;height:${HS}px">
  <div class="abs" style="left:0;top:0;width:${W}px;height:1100px">${img('17298658', 'object-position:40% 50%')}</div>
  <div class="abs" style="left:0;top:700px;width:${W}px;height:400px;background:linear-gradient(180deg,rgba(14,17,112,0),${I})"></div>
  <div class="abs" style="left:84px;top:200px">${aoVivo(30)}</div>
  <div class="abs" style="left:84px;right:84px;top:1080px"><div class="tit" style="font-size:110px">Tire suas dúvidas sobre registro de imóveis</div>
    <div style="font-size:40px;font-weight:300;margin-top:34px">Terça, 24 de novembro · 18h</div></div>
  <div class="abs" style="left:84px;bottom:170px">${logo('letreiroBranco', 230)}</div></div>`;

// ---------- carrossel para cartorários: Provimento 149/2023 ----------
const numTile = (n, px, escuro) => `<div style="position:relative;width:${px}px;height:${px}px;${escuro ? `background:${I};${trama(.22, px)}` : painel(px)}">
  <div style="position:absolute;inset:${px * .3}px;border-radius:50%;background:${escuro ? '#fff' : I};display:grid;place-items:center;font:700 ${px * .26}px Lexend;color:${escuro ? I : '#fff'}">${n}</div></div>`;
const PV = [
  { t: 'Um código para tudo', txt: 'O Provimento nº 149, de 30 de agosto de 2023, instituiu o Código Nacional de Normas da Corregedoria Nacional de Justiça para o foro extrajudicial.' },
  { t: 'Normas num texto só', txt: 'As regras da Corregedoria Nacional para notas e registros foram reunidas e organizadas por assunto.' },
  { t: 'Cite o Código', txt: 'Em notas devolutivas, requerimentos e atos, a referência passa a ser o artigo do Código Nacional de Normas.' },
  { t: 'Acompanhe as alterações', txt: 'Os provimentos seguintes alteram o próprio Código. Consulte sempre a versão atualizada no site do CNJ.' },
];
const pvItem = (it, n, escuro) => `<div class="p ${escuro ? 'deg' : 'br'}" style="width:${W}px;height:${H}px">
  <div class="abs" style="left:84px;top:120px">${numTile(n, 300, escuro)}</div>
  <div class="abs" style="left:84px;right:84px;top:540px"><div class="tit" style="font-size:108px">${it.t}</div>
    <div class="txt" style="font-size:42px;margin-top:44px;${escuro ? 'opacity:.9' : `color:${COR.texto}`}">${it.txt}</div></div></div>`;
const pvCapa = `<div class="p deg" style="width:${W}px;height:${H}px">
  <div class="abs" style="left:0;right:0;bottom:0;height:560px;${trama(.16)};-webkit-mask:linear-gradient(0deg,#000 20%,transparent)"></div>
  <div class="abs" style="left:84px;top:96px">${logo('letreiroBranco', 230)}</div>
  <div class="abs" style="left:84px;right:84px;top:360px"><div class="tit" style="font-size:150px;letter-spacing:-.04em">Provimento 149</div>
    <div style="font-size:62px;font-weight:300;margin-top:30px;line-height:1.2">O que muda na rotina do cartório</div></div></div>`;
const pvPratica = `<div class="p br" style="width:${W}px;height:${H}px">
  <div class="abs" style="left:84px;right:84px;top:150px"><div class="tit" style="font-size:108px">Na prática</div></div>
  <div class="abs" style="left:84px;right:84px;top:400px;display:flex;flex-direction:column;gap:56px">
    ${['Revise os modelos de atos e certidões', 'Atualize os checklists de qualificação', 'Treine a equipe com a nova numeração'].map(t => `<div style="display:flex;gap:36px;align-items:center">
      <div style="width:110px;height:110px;flex:none;${painel(110)};display:grid;place-items:center"><div style="width:58px;height:58px;border-radius:50%;background:${I};display:grid;place-items:center">${ico(IC.ok, 36, '#fff', 2.4)}</div></div>
      <div style="font-size:46px;font-weight:400;line-height:1.25">${t}</div></div>`).join('')}</div></div>`;
const pvFecho = `<div class="p" style="width:${W}px;height:${H}px;${painel(270)}">
  <div class="abs br" style="left:135px;top:405px;width:810px;height:540px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:56px">
    ${logo('cor', 600)}<div style="font-size:36px;font-weight:400;color:${I}">Dúvidas? Fale com a ANOREG/PE.</div></div></div>`;

export const EXTRAS = [
  ['cidadao-casamento', W, H, cidCasamento], ['cidadao-nascimento', W, H, cidNascimento], ['cidadao-imovel', W, H, cidImovel],
  ['cidadao-recife', W, H, cidRecife], ['pe-olinda', W, H, peOlinda],
  ['aula-feed', W, H, aulaFeed], ['aula-story', W, HS, aulaStory],
  ['noticia', W, H, noticia], ['aviso', W, H, aviso], ['aniversario', W, H, aniversario], ['luto', W, H, luto],
  ['reels-1', W, HS, reels1], ['reels-2', W, HS, reels2], ['reels-3', W, HS, reels3],
  ['live-1', W, HS, live1], ['live-2', W, HS, live2],
  ['provimento-1', W, H, pvCapa], ...PV.map((it, i) => [`provimento-${i + 2}`, W, H, pvItem(it, i + 1, i % 2 === 1)]),
  ['provimento-6', W, H, pvPratica], ['provimento-7', W, H, pvFecho],
].map(([nome, w, h, html]) => ({ nome, w, h, html }));
