// Projeto 01 · "Editorial Terracota": a Eduarda como revista impressa de Direito Civil.
// Papel creme, terracota, verde-oliva e tinta escura; Fraunces (títulos, capitulares, números) + Inter (texto e fólios).
import fs from 'node:fs';
import { render, CONTEUDO as C, PERFIL, foto as fotoUrl, recorte as recorteUrl, esc } from './base.mjs';
// O Chromium não carrega file:// numa página about:blank: as fotos entram como data URI.
const dataUri = u => { const f = new URL(u).pathname; return `data:image/${f.endsWith('.png') ? 'png' : 'jpeg'};base64,${fs.readFileSync(f).toString('base64')}`; };
const memo = new Map(); const cache = u => memo.get(u) || (memo.set(u, dataUri(u)), memo.get(u));
const foto = n => cache(fotoUrl(n)); const recorte = n => cache(recorteUrl(n));

const ID = 'id01-editorial';
const fontes = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300..900,0..100,0..1;1,9..144,300..900,0..100,0..1&family=Inter:wght@400;500;600;700&display=swap';

const K = { creme: '#F3EBDC', areia: '#E5D4B8', terra: '#B4532E', oliva: '#5E6A3A', tinta: '#271F1A', erro: '#B8231C' };

const css = `
:root{--creme:${K.creme};--areia:${K.areia};--terra:${K.terra};--oliva:${K.oliva};--tinta:${K.tinta};--erro:${K.erro}}
body{background:var(--creme);color:var(--tinta);font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased}
.pg{position:absolute;inset:0;overflow:hidden}
.f{font-family:'Fraunces',serif;font-variation-settings:'SOFT' 30,'WONK' 0;font-optical-sizing:auto}
.fi{font-family:'Fraunces',serif;font-style:italic;font-variation-settings:'SOFT' 60,'WONK' 1}
.abs{position:absolute}
.cap{font-family:'Inter';font-weight:600;font-size:24px;letter-spacing:.16em;text-transform:uppercase}
.leg{font-family:'Fraunces';font-style:italic;font-size:27px;line-height:1.3}
.ph{background-repeat:no-repeat;background-size:cover;filter:sepia(.22) saturate(.82) contrast(1.03)}
img{filter:sepia(.12) saturate(.9)}
.pill{display:inline-block;font-family:'Inter';font-weight:600;font-size:26px;letter-spacing:.06em;padding:12px 24px;border-radius:999px}
.drop::first-letter{font-family:'Fraunces';font-weight:700;color:var(--terra);float:left;font-size:2.7em;line-height:.8;padding:6px 8px 0 0}
`;

const ph = (n, pos = '50% 40%') => `background-image:url('${foto(n)}');background-position:${pos}`;
// Fólio de revista: nome da revista + seção + página. Escuro ou claro conforme o fundo.
const folio = (pag, secao, cor = 'var(--tinta)') => `
  <div class="abs" style="left:64px;right:64px;top:52px;display:flex;justify-content:space-between;align-items:baseline;color:${cor}">
    <span class="fi" style="font-size:34px;font-weight:600">Caraciolo</span>
    <span class="cap" style="opacity:.8">${secao} &nbsp;·&nbsp; ${pag}</span>
  </div>`;
const assina = (cor = 'var(--tinta)') => `<div class="abs cap" style="left:64px;bottom:52px;color:${cor};opacity:.8">${PERFIL.arroba}</div>`;
const swipe = (cor = 'var(--tinta)') => `<div class="abs fi" style="right:64px;bottom:44px;color:${cor};font-size:32px">continua &rarr;</div>`;

const P = [];
const add = (nome, html, w = 1080, h = 1350) => P.push({ nome, w, h, html: `<div class="pg">${html}</div>` });

// ───────────── 00 · prancha da identidade
add('00-identidade', `
  <div class="abs" style="left:64px;top:56px;right:64px;display:flex;justify-content:space-between" >
    <span class="cap">Manual de identidade</span><span class="cap">Projeto 01</span></div>
  <div class="abs" style="left:64px;top:118px;right:64px;display:flex;align-items:center;gap:40px">
    <div class="f" style="width:190px;height:190px;border-radius:50%;background:var(--terra);color:var(--creme);display:flex;align-items:center;justify-content:center;font-size:96px;font-weight:600;font-style:italic;font-variation-settings:'SOFT' 100,'WONK' 1;letter-spacing:-.04em">Ec</div>
    <div>
      <div class="fi" style="font-size:150px;font-weight:700;line-height:.9;letter-spacing:-.03em">Caraciolo</div>
      <div class="cap" style="margin-top:14px;color:var(--oliva)">Revista de Direito Civil &amp; ECA</div>
    </div>
  </div>
  <div class="abs cap" style="left:64px;top:372px">Paleta</div>
  <div class="abs" style="left:64px;right:64px;top:412px;display:grid;grid-template-columns:repeat(6,1fr);gap:12px">
    ${[['Papel', K.creme, 1], ['Areia', K.areia, 1], ['Terracota', K.terra, 0], ['Oliva', K.oliva, 0], ['Tinta', K.tinta, 0], ['Só erro', K.erro, 0]].map(([n, h, cl]) => `
      <div style="height:176px;border-radius:14px;background:${h};${n === 'Papel' ? 'box-shadow:inset 0 0 0 2px #d9ccb5;' : ''}color:${cl ? K.tinta : K.creme};padding:16px 14px;display:flex;flex-direction:column;justify-content:flex-end">
        <div style="font-weight:600;font-size:24px">${n}</div><div style="font-size:21px;opacity:.85">${h}</div></div>`).join('')}
  </div>
  <div class="abs cap" style="left:64px;top:630px">Tipografia</div>
  <div class="abs" style="left:64px;top:670px;width:470px;height:250px;background:var(--areia);border-radius:14px;padding:22px 26px">
    <div class="f" style="font-size:96px;line-height:1;font-weight:600">Aa <span class="fi" style="color:var(--terra)">Aa</span></div>
    <div style="font-size:26px;margin-top:14px;font-weight:600">Fraunces</div>
    <div style="font-size:23px;opacity:.8">títulos, capitulares, números e legendas em itálico</div>
  </div>
  <div class="abs" style="left:550px;top:670px;width:466px;height:250px;background:var(--tinta);color:var(--creme);border-radius:14px;padding:22px 26px">
    <div style="font-size:96px;line-height:1;font-weight:600;letter-spacing:-.03em">Aa</div>
    <div style="font-size:26px;margin-top:14px;font-weight:600">Inter</div>
    <div style="font-size:23px;opacity:.8">texto corrido, fólios, selos e bases legais</div>
  </div>
  <div class="abs cap" style="left:64px;top:956px">Elementos</div>
  <div class="abs" style="left:64px;top:996px;width:300px">
    <div class="drop" style="font-family:'Fraunces';font-size:30px;line-height:1.3">Capitular abre todo texto corrido.</div>
  </div>
  <div class="abs" style="left:400px;top:996px;width:300px">
    <div class="ph" style="height:118px;border-radius:10px;${ph('pensando', '40% 42%')}"></div>
    <div class="leg" style="font-size:23px;margin-top:8px">Legenda em itálico sob a foto.</div>
  </div>
  <div class="abs" style="left:736px;top:996px;width:280px;display:flex;flex-direction:column;gap:14px;align-items:flex-start">
    <span class="pill" style="background:var(--oliva);color:var(--creme)">CC, art. 189</span>
    <span class="fi" style="font-size:30px">Caraciolo · <span class="cap" style="font-size:20px;font-style:normal">Civil · 02</span></span>
    <span class="f" style="font-size:64px;line-height:.9;color:var(--terra);font-weight:700">01</span>
  </div>
  <div class="abs" style="left:0;right:0;bottom:0;height:150px;background:var(--terra);color:var(--creme);padding:26px 64px">
    <div class="cap" style="opacity:.85">Tom de voz</div>
    <div class="fi" style="font-size:34px;margin-top:8px;line-height:1.2">Culto sem juridiquês. Explica com calma, como uma boa revista, e chama o leitor pra conversa.</div>
  </div>
`);

// ───────────── C1 · explicativo: capa de revista
const c1 = C.c1;
add('c1-1', `
  <div class="abs ph" style="left:0;top:300px;width:1080px;height:1050px;${ph('pensando', '50% 60%')}"></div>
  <div class="abs" style="left:56px;right:56px;top:40px;display:flex;justify-content:space-between" ><span class="cap">Direito Civil &amp; ECA</span><span class="cap">Edição nº 01</span></div>
  <div class="abs fi" style="left:44px;top:62px;font-size:228px;font-weight:700;letter-spacing:-.045em;line-height:1">Caraciolo</div>
  <div class="abs" style="left:56px;top:350px;background:var(--creme);padding:14px 22px;border-radius:999px" ><span class="cap" style="color:var(--terra)">Matéria de capa</span></div>
  <div class="abs" style="left:0;right:0;bottom:0;background:var(--terra);color:var(--creme);padding:44px 56px 50px">
    <div class="f" style="font-size:108px;line-height:.95;font-weight:600;letter-spacing:-.02em">Prescrição <span class="fi" style="font-weight:400">x</span> decadência</div>
    <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:18px">
      <div class="fi" style="font-size:44px">${esc(c1.sub)}</div>
      <div class="cap" style="opacity:.85">arraste &rarr;</div>
    </div>
  </div>
`);
add('c1-2', `
  ${folio('02', 'Civil')}
  <div class="abs f" style="left:64px;top:128px;right:64px;font-size:70px;font-weight:600;line-height:1;letter-spacing:-.02em">Dois prazos, <span class="fi" style="color:var(--terra)">duas perdas</span></div>
  ${c1.itens.map((it, i) => `
  <div class="abs" style="left:${i ? 556 : 64}px;top:262px;width:${i ? 460 : 452}px;bottom:${i ? 0 : 230}px;${i ? 'background:var(--areia);padding:36px 40px 0;border-radius:18px 18px 0 0' : 'padding-top:36px'}">
    <div class="fi" style="font-size:44px;color:var(--terra)">${i ? 'II.' : 'I.'}</div>
    <div class="f" style="font-size:66px;font-weight:700;line-height:1;margin:6px 0 22px;letter-spacing:-.02em">${it.nome}</div>
    <div class="drop" style="font-family:'Fraunces';font-size:42px;line-height:1.2;font-weight:450">${esc(it.txt)}</div>
    <div style="font-size:32px;line-height:1.4;margin-top:24px;opacity:.88">${esc(it.det)}</div>
    <div style="margin-top:26px"><span class="pill" style="background:var(--oliva);color:var(--creme)">${it.base}</span></div>
  </div>`).join('')}
  <div class="abs" style="left:64px;width:452px;bottom:70px;background:var(--tinta);color:var(--creme);padding:26px 30px;border-radius:16px">
    <div class="cap" style="font-size:20px;opacity:.75">Em uma frase</div>
    <div class="fi" style="font-size:32px;line-height:1.2;margin-top:8px">Na prescrição, some a pretensão. Na decadência, o próprio direito.</div>
  </div>
`);
add('c1-3', `
  <div class="abs" style="inset:0;background:var(--terra)"></div>
  ${folio('03', 'Civil', 'var(--creme)')}
  <div class="abs fi" style="left:64px;top:150px;font-size:300px;line-height:.8;color:var(--areia);opacity:.55">“</div>
  <div class="abs f" style="left:64px;right:64px;top:330px;color:var(--creme);font-size:86px;line-height:1.04;font-weight:600;letter-spacing:-.015em">Salva pra revisar e manda pra quem vai <span class="fi" style="font-weight:400">fazer a OAB.</span></div>
  <div class="abs" style="left:64px;top:760px;width:380px">
    <div class="ph" style="height:500px;border-radius:12px;${ph('explicando', '42% 30%')};background-size:170%"></div>
  </div>
  <div class="abs" style="left:480px;top:1000px;right:64px;color:var(--creme)">
    <div class="cap" style="opacity:.8">Quem escreve</div>
    <div class="f" style="font-size:50px;font-weight:600;margin-top:10px;line-height:1.05">${PERFIL.nome}</div>
    <div class="leg" style="margin-top:12px;font-size:30px">${PERFIL.cargo}. ${PERFIL.prof}.</div>
    <div style="font-size:30px;font-weight:600;margin-top:26px">${PERFIL.arroba}</div>
  </div>
`);

// ───────────── C2 · lista: número gigante + sumário
const c2 = C.c2;
add('c2-1', `
  <div class="abs" style="left:56px;right:56px;top:52px;display:flex;justify-content:space-between"><span class="fi" style="font-size:36px;font-weight:600">Caraciolo</span><span class="cap" style="align-self:center">Especial 2ª fase</span></div>
  <div class="abs f" style="left:22px;top:60px;font-size:900px;line-height:1;font-weight:800;color:var(--terra);letter-spacing:-.06em">4</div>
  <div class="abs" style="left:560px;top:200px;right:56px">
    <div class="f" style="font-size:84px;line-height:.98;font-weight:600;letter-spacing:-.02em">erros que derrubam a peça de Civil</div>
    <div class="fi" style="font-size:44px;color:var(--oliva);margin-top:22px">${c2.sub}</div>
  </div>
  <div class="abs ph" style="left:560px;top:690px;width:464px;height:520px;border-radius:14px;${ph('joinha', '45% 38%')}"></div>
  <div class="abs leg" style="left:560px;top:1226px;width:464px;font-size:26px">Eduarda revisa, um por um, os deslizes mais comuns.</div>
  <div class="abs" style="left:56px;top:1010px;width:460px;background:var(--tinta);color:var(--creme);padding:28px 32px;border-radius:16px">
    <div class="cap" style="font-size:20px;opacity:.75">Nesta edição</div>
    <div class="fi" style="font-size:34px;line-height:1.2;margin-top:8px">Os pontos que a banca não perdoa na peça.</div>
  </div>
`);
add('c2-2', `
  ${folio('02', 'Sumário')}
  <div class="abs f" style="left:64px;top:130px;font-size:80px;font-weight:600;letter-spacing:-.02em;line-height:1">Os <span class="fi" style="color:var(--terra)">4</span> erros</div>
  <div class="abs" style="left:40px;right:40px;top:262px;display:flex;flex-direction:column;gap:14px">
    ${c2.itens.map((t, i) => `
    <div style="display:flex;align-items:center;gap:30px;padding:30px 34px;border-radius:18px;background:${i % 2 ? 'transparent' : 'var(--areia)'}">
      <div class="fi" style="font-size:104px;line-height:.85;color:var(--terra);font-weight:600;width:130px;flex:none">0${i + 1}</div>
      <div class="f" style="font-size:47px;line-height:1.12;font-weight:500">${esc(t)}</div>
    </div>`).join('')}
  </div>
  <div class="abs" style="left:64px;bottom:60px;display:flex;align-items:center;gap:18px"><span class="cap" style="font-size:22px">Base</span><span class="pill" style="background:var(--oliva);color:var(--creme)">${c2.base}</span></div>
  ${swipe()}
`);
add('c2-3', `
  <div class="abs" style="inset:0;background:var(--oliva)"></div>
  ${folio('03', 'Cartas', 'var(--creme)')}
  <div class="abs f" style="left:64px;top:170px;width:620px;color:var(--creme);font-size:104px;line-height:.98;font-weight:600;letter-spacing:-.02em">Qual desses você <span class="fi" style="font-weight:400;color:var(--areia)">já cometeu?</span></div>
  <img class="abs" src="${recorte('surpresa')}" style="right:-60px;bottom:-380px;width:640px">
  <div class="abs" style="left:64px;top:780px;width:500px;background:var(--creme);padding:34px 38px;border-radius:18px">
    <div class="cap" style="color:var(--terra);font-size:22px">Sua vez</div>
    <div class="f" style="font-size:46px;line-height:1.1;margin-top:10px;font-weight:600">Conta nos comentários.</div>
    <div style="font-size:28px;margin-top:14px;opacity:.85">As melhores respostas entram na próxima edição.</div>
  </div>
  ${assina('var(--creme)')}
`);

// ───────────── C3 · questão: teste do leitor
const c3 = C.c3;
const opc = (resp) => c3.opcoes.map((o, i) => {
  const certa = resp && i === c3.certa, apag = resp && i !== c3.certa;
  return `<div style="flex:1;display:flex;align-items:center;gap:22px;padding:26px 30px;border-radius:18px;background:${certa ? 'var(--erro)' : 'var(--tinta)'};color:var(--creme);opacity:${apag ? .28 : 1}">
    <span class="fi" style="font-size:44px;opacity:.7">${'ab'[i]})</span><span class="f" style="font-size:52px;font-weight:600">${o}</span></div>`;
}).join('');
add('c3-1', `
  <div class="abs" style="left:0;right:0;top:0;height:1030px;background:var(--areia)"></div>
  <div class="abs" style="left:64px;right:64px;top:52px;display:flex;justify-content:space-between"><span class="fi" style="font-size:36px;font-weight:600">Caraciolo</span><span class="cap" style="align-self:center">Teste do leitor · Família</span></div>
  <img class="abs" src="${recorte('surpresa')}" style="left:520px;top:600px;width:540px">
  <div class="abs leg" style="left:64px;top:720px;width:430px;font-size:40px;line-height:1.2">Responda antes de virar a página. A resposta está no próximo slide.</div>
  <div class="abs" style="left:64px;top:140px;width:952px">
    <div class="fi" style="font-size:40px;color:var(--terra)">Certo ou errado?</div>
    <div class="f" style="font-size:88px;line-height:1.02;font-weight:600;margin-top:16px;letter-spacing:-.015em">O filho fez 18 anos. A pensão acaba <span class="fi" style="color:var(--terra)">automaticamente?</span></div>
  </div>
  <div class="abs" style="left:0;right:0;top:1030px;bottom:0;background:var(--creme)"></div>
  <div class="abs" style="left:64px;right:64px;top:1080px;display:flex;gap:20px">${opc(false)}</div>
  <div class="abs" style="left:64px;right:64px;top:1250px;display:flex;justify-content:space-between;align-items:baseline">
    <div class="cap">${PERFIL.arroba}</div>
    <div class="cap">resposta &rarr;</div>
  </div>
`);
add('c3-2', `
  ${folio('02', 'Resposta')}
  <div class="abs fi" style="left:56px;top:110px;font-size:250px;line-height:1;color:var(--erro);font-weight:600;letter-spacing:-.03em">Errado.</div>
  <div class="abs" style="left:64px;right:64px;top:420px;display:flex;gap:20px">${opc(true)}</div>
  <div class="abs" style="left:64px;right:64px;top:600px">
    <div class="drop" style="font-family:'Fraunces';font-size:56px;line-height:1.24;font-weight:450">A maioridade não encerra a pensão sozinha: a exoneração depende de decisão judicial, com contraditório.</div>
  </div>
  <div class="abs" style="left:64px;right:64px;bottom:64px;background:var(--oliva);color:var(--creme);border-radius:18px;padding:30px 36px;display:flex;justify-content:space-between;align-items:center">
    <div><div class="cap" style="font-size:20px;opacity:.8">Fundamento</div><div class="f" style="font-size:48px;font-weight:600;margin-top:6px">${c3.base}</div></div>
    <div class="fi" style="font-size:30px;width:330px;text-align:right;line-height:1.2">o filho tem direito de se manifestar</div>
  </div>
`);
add('c3-3', `
  <div class="abs" style="inset:0;background:var(--tinta)"></div>
  ${folio('03', 'Teste do leitor', 'var(--creme)')}
  <div class="abs ph" style="left:64px;top:150px;width:952px;height:640px;border-radius:16px;${ph('joinha', '50% 36%')}"></div>
  <div class="abs leg" style="left:64px;top:806px;color:var(--areia);font-size:27px">Quem acertou ganha o joinha da professora.</div>
  <div class="abs f" style="left:64px;right:64px;top:900px;color:var(--creme);font-size:72px;line-height:1.05;font-weight:600">Acertou? Comenta <span class="fi" style="color:#E59A74">“acertei”</span> e marca quem precisa saber disso.</div>
  ${assina('var(--creme)')}
`);

// ───────────── C4 · mito ou verdade: recortes de jornal
const c4 = C.c4;
add('c4-1', `
  <div class="abs" style="inset:0;background:var(--oliva)"></div>
  <div class="abs" style="left:64px;right:64px;top:52px;display:flex;justify-content:space-between;color:var(--creme)"><span class="fi" style="font-size:36px;font-weight:600">Caraciolo</span><span class="cap" style="align-self:center">ECA · Adoção</span></div>
  <div class="abs ph" style="left:540px;top:140px;width:476px;height:900px;border-radius:240px 240px 16px 16px;${ph('explicando', '44% 34%')}"></div>
  <div class="abs leg" style="left:540px;top:1056px;width:476px;color:var(--areia)">Eduarda separa o que é lenda do que está no ECA.</div>
  <div class="abs f" style="left:64px;top:190px;width:460px;color:var(--creme);font-size:132px;line-height:.92;font-weight:700;letter-spacing:-.03em">Adoção:</div>
  <div class="abs fi" style="left:64px;top:340px;width:460px;color:var(--areia);font-size:104px;line-height:.98;font-weight:400">mito ou verdade?</div>
  <div class="abs" style="left:64px;top:700px;width:430px;display:flex;flex-direction:column;gap:16px">
    <div style="background:var(--creme);color:var(--oliva);border-radius:16px;padding:22px 28px;font-weight:700;font-size:34px;letter-spacing:.08em;text-transform:uppercase">Verdade</div>
    <div style="background:var(--erro);color:var(--creme);border-radius:16px;padding:22px 28px;font-weight:700;font-size:34px;letter-spacing:.08em;text-transform:uppercase">Mito</div>
  </div>
  <div class="abs cap" style="left:64px;bottom:60px;color:var(--creme)">arraste &rarr;</div>
`);
add('c4-2', `
  <div class="abs" style="inset:0;background:var(--areia)"></div>
  ${folio('02', 'ECA')}
  ${c4.itens.map((it, i) => `
  <div class="abs" style="left:64px;right:64px;top:${140 + i * 590}px;height:560px;background:var(--creme);border-radius:20px;padding:40px 46px">
    <div style="display:flex;justify-content:space-between;align-items:center">
      <span class="pill" style="font-size:30px;padding:12px 28px;background:${it.v ? 'var(--oliva)' : 'var(--erro)'};color:var(--creme);text-transform:uppercase;letter-spacing:.1em">${it.v ? 'Verdade' : 'Mito'}</span>
      <span class="fi" style="font-size:64px;color:var(--terra);font-weight:600">0${i + 1}</span>
    </div>
    <div class="f" style="font-size:72px;line-height:1.04;font-weight:600;margin-top:26px;letter-spacing:-.015em">“${esc(it.frase)}”</div>
    <div style="font-size:36px;line-height:1.38;margin-top:24px">${esc(it.txt)}</div>
    <div class="fi" style="font-size:34px;color:var(--oliva);margin-top:18px;font-weight:600">${it.base}</div>
  </div>`).join('')}
`);
add('c4-3', `
  ${folio('03', 'ECA')}
  <div class="abs fi" style="left:30px;top:120px;font-size:470px;line-height:1;color:var(--terra);font-weight:700;letter-spacing:-.05em">ECA</div>
  <div class="abs f" style="left:64px;right:64px;top:640px;font-size:80px;line-height:1.04;font-weight:600;letter-spacing:-.015em">Quer mais mito ou verdade de ECA?</div>
  <div class="abs" style="left:64px;top:900px;right:64px;display:flex;align-items:center;gap:30px">
    <div style="background:var(--tinta);color:var(--creme);border-radius:18px;padding:30px 40px" class="f"><span style="font-size:56px;font-weight:600">Comenta <span class="fi" style="color:#E59A74">“ECA”</span></span></div>
    <div class="leg" style="font-size:32px;width:360px">e a próxima edição sai com mais.</div>
  </div>
  <div class="abs ph" style="right:64px;bottom:64px;width:200px;height:200px;border-radius:50%;${ph('empolgada', '48% 30%')};background-size:240%"></div>
  ${assina()}
`);

// ───────────── C5 · apresentação: perfil de revista
const c5 = C.c5;
add('c5-1', `
  <div class="abs ph" style="left:56px;right:56px;top:130px;height:760px;border-radius:14px;${ph('empolgada', '50% 34%')}"></div>
  <div class="abs" style="left:56px;right:56px;top:52px;display:flex;justify-content:space-between"><span class="fi" style="font-size:40px;font-weight:600">Caraciolo</span><span class="cap" style="align-self:center">Perfil · Edição nº 01</span></div>
  <div class="abs" style="left:0;right:0;bottom:0;height:460px;background:var(--creme);padding:30px 56px">
    <div class="cap" style="color:var(--terra)">A autora</div>
    <div class="f" style="font-size:150px;line-height:.92;font-weight:700;letter-spacing:-.035em;margin-top:12px">Prazer, <span class="fi" style="font-weight:400;color:var(--terra)">Eduarda</span></div>
    <div class="f" style="font-size:38px;line-height:1.25;margin-top:26px;width:900px">${esc(c5.sub)}</div>
  </div>
`);
const cores5 = [['var(--terra)', 'var(--creme)'], ['var(--oliva)', 'var(--creme)'], ['var(--areia)', 'var(--tinta)'], ['var(--tinta)', 'var(--creme)']];
add('c5-2', `
  ${folio('02', 'Perfil')}
  <div class="abs f" style="left:64px;top:130px;right:64px;font-size:80px;line-height:1;font-weight:600;letter-spacing:-.02em">O que você <span class="fi" style="color:var(--terra)">encontra aqui</span></div>
  <div class="abs" style="left:64px;right:64px;top:290px;bottom:150px;display:grid;grid-template-columns:1fr 1fr;gap:20px">
    ${c5.itens.map((t, i) => `<div style="background:${cores5[i][0]};color:${cores5[i][1]};border-radius:20px;padding:34px 36px;display:flex;flex-direction:column;justify-content:space-between">
      <div class="fi" style="font-size:96px;line-height:.9;font-weight:600;opacity:.9">0${i + 1}</div>
      <div class="f" style="font-size:52px;line-height:1.06;font-weight:600">${esc(t)}</div></div>`).join('')}
  </div>
  <div class="abs leg" style="left:64px;bottom:62px;font-size:32px">Toda semana, uma seção nova.</div>
`);
add('c5-3', `
  <div class="abs" style="inset:0;background:var(--areia)"></div>
  ${folio('03', 'Perfil')}
  <div class="abs ph" style="right:64px;top:140px;width:470px;height:860px;border-radius:235px 235px 16px 16px;${ph('falando-neon', '52% 40%')};background-size:210%"></div>
  <div class="abs leg" style="right:64px;top:1016px;width:470px">Decisão, dedicação e consistência: o lema na parede do estúdio.</div>
  <div class="abs" style="left:64px;top:150px;width:440px">
    <div class="fi" style="font-size:44px;color:var(--terra)">Fica por aqui:</div>
    <div class="f" style="font-size:86px;line-height:1;font-weight:600;letter-spacing:-.02em;margin-top:20px">Me segue pra estudar <span class="fi" style="color:var(--terra);font-weight:500">Civil comigo.</span></div>
    <div class="leg" style="margin-top:34px;font-size:32px">${PERFIL.prof}.</div>
  </div>
  <div class="abs" style="left:64px;top:690px;width:440px;height:470px;background:var(--terra);color:var(--creme);border-radius:16px;padding:34px 34px">
    <div class="cap" style="font-size:20px;opacity:.85">Toda semana</div>
    ${c5.itens.map(t => `<div class="f" style="font-size:36px;line-height:1.15;font-weight:500;margin-top:20px">${esc(t)}</div>`).join('')}
  </div>
  <div class="abs" style="left:64px;right:64px;bottom:64px;background:var(--tinta);color:var(--creme);border-radius:999px;padding:24px 40px;display:flex;justify-content:space-between;align-items:center">
    <span style="font-size:36px;font-weight:600">${PERFIL.arroba}</span><span class="cap" style="font-size:22px;opacity:.8">Seguir</span></div>
`);
// ───────────── Posts únicos
add('p1', `
  ${folio('Frase', 'Caderno de peça')}
  <div class="abs fi" style="left:40px;top:110px;font-size:420px;line-height:.8;color:var(--terra);opacity:.9">“</div>
  <div class="abs f" style="left:64px;right:64px;top:420px;font-size:142px;line-height:.98;font-weight:600;letter-spacing:-.03em">Peça boa não se decora.</div>
  <div class="abs fi" style="left:64px;right:64px;top:770px;font-size:170px;line-height:1;color:var(--terra);font-weight:500">Se entende.</div>
  <div class="abs" style="left:64px;bottom:64px;display:flex;align-items:center;gap:24px">
    <div class="ph" style="width:110px;height:110px;border-radius:50%;${ph('explicando', '46% 28%')};background-size:260%"></div>
    <div><div class="f" style="font-size:36px;font-weight:600">${PERFIL.nome}</div><div style="font-size:26px;opacity:.75">${PERFIL.arroba}</div></div>
  </div>
`);
add('p2', `
  <div class="abs" style="inset:0;background:var(--terra)"></div>
  ${folio('Cartas do leitor', 'Pauta aberta', 'var(--creme)')}
  <div class="abs f" style="left:64px;top:150px;right:64px;color:var(--creme);font-size:120px;line-height:.95;font-weight:600;letter-spacing:-.03em">Qual tema de Civil mais <span class="fi" style="font-weight:400">te trava?</span></div>
  <div class="abs ph" style="left:64px;top:620px;width:420px;height:560px;border-radius:16px;${ph('pensando', '40% 42%')}"></div>
  <div class="abs leg" style="left:64px;top:1196px;width:420px;color:var(--areia);font-size:26px">A pauta da próxima edição é sua.</div>
  <div class="abs" style="left:520px;right:64px;top:620px;height:560px;background:var(--creme);border-radius:16px;padding:36px 36px;display:flex;flex-direction:column;justify-content:space-between">
    <div class="drop" style="font-family:'Fraunces';font-size:40px;line-height:1.2">Comenta aqui embaixo. O mais pedido vira o próximo post.</div>
    <div style="background:var(--areia);border-radius:999px;padding:18px 26px;font-size:28px;opacity:.85">Adicione um comentário…</div>
  </div>
`);
const p3 = C.p3;
add('p3', `
  ${folio('Dica', 'Sucessões')}
  <div class="abs" style="left:64px;top:130px;right:64px">
    <div class="fi" style="font-size:44px;color:var(--terra)">Ficha de estudo</div>
    <div class="f" style="font-size:96px;line-height:.98;font-weight:600;letter-spacing:-.025em;margin-top:8px">Ordem da vocação hereditária</div>
  </div>
  <div class="abs" style="left:64px;right:64px;top:470px;display:flex;flex-direction:column;gap:16px">
    ${p3.itens.map((t, i) => `<div style="display:flex;gap:28px;align-items:center;background:${['var(--terra)', 'var(--areia)', 'var(--areia)', 'var(--areia)'][i]};color:${i ? 'var(--tinta)' : 'var(--creme)'};border-radius:18px;padding:26px 32px">
      <div class="fi" style="font-size:80px;line-height:.9;font-weight:600;width:110px;flex:none;${i ? 'color:var(--terra)' : ''}">${i + 1}º</div>
      <div style="font-size:34px;line-height:1.28;font-weight:500">${esc(t)}</div></div>`).join('')}
  </div>
  <div class="abs" style="left:64px;bottom:64px;display:flex;align-items:center;gap:18px"><span class="cap" style="font-size:22px">Base</span><span class="pill" style="background:var(--oliva);color:var(--creme)">${p3.base}</span></div>
  <div class="abs leg" style="right:64px;bottom:72px;font-size:28px">uma classe só herda se faltar a anterior</div>
`);

// ───────────── Stories
add('s1', `
  <div class="abs" style="inset:0;background:var(--areia)"></div>
  <div class="abs" style="left:64px;right:64px;top:110px;display:flex;justify-content:space-between"><span class="fi" style="font-size:44px;font-weight:600">Caraciolo</span><span class="cap" style="align-self:center">Plantão ECA</span></div>
  <div class="abs ph" style="left:64px;top:220px;width:952px;height:860px;border-radius:20px;${ph('surpresa', '56% 40%')}"></div>
  <div class="abs" style="left:110px;right:110px;top:960px;background:var(--creme);border-radius:28px;padding:44px 44px 40px;box-shadow:0 24px 60px #0003;text-align:center">
    <div class="f" style="font-size:64px;line-height:1.04;font-weight:600;letter-spacing:-.015em">Me pergunta qualquer coisa sobre <span class="fi" style="color:var(--terra)">ECA</span></div>
    <div style="margin-top:30px;background:var(--areia);border-radius:18px;padding:30px;font-size:32px;color:#7a6c5d">Escreva sua dúvida aqui</div>
  </div>
  <div class="abs leg" style="left:110px;right:110px;top:1480px;text-align:center;font-size:34px">As respostas saem nos stories e as melhores viram post.</div>
  <div class="abs cap" style="left:0;right:0;bottom:130px;text-align:center">${PERFIL.arroba}</div>
`, 1080, 1920);
add('s2', `
  <div class="abs" style="inset:0;background:var(--oliva)"></div>
  <div class="abs" style="left:64px;right:64px;top:110px;display:flex;justify-content:space-between;color:var(--creme)"><span class="fi" style="font-size:44px;font-weight:600">Caraciolo</span><span class="cap" style="align-self:center">Nas bancas</span></div>
  <div class="abs f" style="left:64px;right:64px;top:210px;color:var(--creme);font-size:116px;line-height:.95;font-weight:600;letter-spacing:-.03em">Post novo <span class="fi" style="font-weight:400;color:var(--areia)">no feed</span></div>
  <div class="abs" style="left:150px;top:520px;width:780px;height:975px;background:var(--creme);border-radius:14px;box-shadow:0 30px 70px #0005;overflow:hidden">
    <div class="ph" style="position:absolute;left:0;top:216px;width:780px;height:760px;${ph('pensando', '50% 60%')}"></div>
    <div class="fi" style="position:absolute;left:30px;top:34px;font-size:166px;font-weight:700;letter-spacing:-.045em;line-height:1">Caraciolo</div>
    <div style="position:absolute;left:0;right:0;bottom:0;background:var(--terra);color:var(--creme);padding:30px 40px">
      <div class="f" style="font-size:76px;line-height:.95;font-weight:600">Prescrição <span class="fi" style="font-weight:400">x</span> decadência</div>
      <div class="fi" style="font-size:32px;margin-top:10px">${esc(c1.sub)}</div>
    </div>
  </div>
  <div class="abs" style="left:240px;right:240px;top:1590px;background:var(--creme);border-radius:999px;padding:30px;text-align:center;font-size:36px;font-weight:600">Toque pra ler a edição</div>
`, 1080, 1920);

// ───────────── Destaques e avatar
const dest = [['Civil', 'Cc', 'var(--terra)', 'var(--creme)'], ['ECA', 'Eca', 'var(--oliva)', 'var(--creme)'], ['OAB', 'Oab', 'var(--tinta)', 'var(--creme)'], ['Dicas', 'Nº', 'var(--areia)', 'var(--terra)'], ['Sobre', 'Ec', 'var(--terra)', 'var(--creme)']];
add('destaques', `
  <div class="abs" style="left:64px;right:64px;top:70px;display:flex;justify-content:space-between"><span class="fi" style="font-size:40px;font-weight:600">Caraciolo</span><span class="cap" style="align-self:center">Capas de destaque</span></div>
  <div class="abs" style="left:0;right:0;top:220px;display:flex;flex-wrap:wrap;justify-content:center;gap:56px 70px;padding:0 90px">
    ${dest.map(([n, g, bg, cor]) => `<div style="display:flex;flex-direction:column;align-items:center;gap:20px">
      <div style="width:250px;height:250px;border-radius:50%;background:${bg};display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 8px var(--creme),0 0 0 12px #d6c7ae">
        <span class="fi" style="font-size:${g.length > 2 ? 104 : 124}px;color:${cor};font-weight:600;letter-spacing:-.03em">${g}</span></div>
      <div style="font-size:32px;font-weight:600">${n}</div></div>`).join('')}
  </div>
`, 1080, 1080);
add('avatar', `
  <div class="abs" style="inset:0;background:var(--terra)"></div>
  <img class="abs" src="${recorte('empolgada')}" style="left:-110px;top:100px;width:1150px">
`, 1080, 1080);

await render(ID, P, { fontes, css });
