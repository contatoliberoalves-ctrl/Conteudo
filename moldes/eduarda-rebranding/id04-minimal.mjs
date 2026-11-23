// Projeto 04 · "Minimal Suíço": off-white, azul-marinho e um único acento (azul elétrico), grid de 6 colunas.
// Gerar: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node id04-minimal.mjs
import fs from 'node:fs';
import path from 'node:path';
import { render, CONTEUDO as C, PERFIL, root, esc } from './base.mjs';

// Fotos embutidas (data URI): o Chromium não carrega file:// a partir de setContent.
const cache = {};
const dataUri = (arq, mime) => cache[arq] ??= `data:${mime};base64,${fs.readFileSync(path.join(root, 'fotos', arq)).toString('base64')}`;
const foto = n => dataUri(`${n}.jpg`, 'image/jpeg');
const recorte = n => dataUri(`${n}-recorte.png`, 'image/png');
const ROSTO = { empolgada: [.52, .42], explicando: [.47, .40], 'falando-neon': [.45, .43], joinha: [.45, .45], pensando: [.40, .42], surpresa: [.62, .43] };
const enq = (n, w, h, z = 1.4, bx = .5, by = .42) => {
  const iw = z * w, ih = iw * 1.5, [fx, fy] = ROSTO[n];
  const X = Math.min(0, Math.max(w - iw, bx * w - fx * iw)), Y = Math.min(0, Math.max(h - ih, by * h - fy * ih));
  return `background-image:url('${foto(n)}');background-size:${iw}px ${ih}px;background-position:${X}px ${Y}px`;
};
const img = (n, x, y, w, h, z, bx, by, extra = '') => `<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;${enq(n, w, h, z, bx, by)};${extra}"></div>`;

const K = { papel: '#F3F1EA', marinho: '#0B1A38', acento: '#2B50FF', cinza: '#6E7385', linha: '#D9D6CC', erro: '#E0363B' };
const fontes = 'https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap';

// Grid: margens de 72px, 6 colunas de 136px com 24px de calha.
const col = i => 72 + i * 160;
const larg = n => n * 136 + (n - 1) * 24;

const css = `
body{font-family:'Instrument Sans',sans-serif;color:${K.marinho};background:${K.papel}}
.pg{position:relative;overflow:hidden;width:1080px;height:1350px;background:${K.papel};color:${K.marinho}}
.pg.esc{background:${K.marinho};color:${K.papel}}
.pg.ac{background:${K.acento};color:#fff}
.abs{position:absolute}
.serif{font-family:'Instrument Serif',serif;font-weight:400}
.it{font-family:'Instrument Serif',serif;font-style:italic;font-weight:400}
.meta{font-size:28px;font-weight:500;letter-spacing:.01em}
.tit{font-weight:600;letter-spacing:-.045em;line-height:.95}
.num{font-weight:500;letter-spacing:-.06em;line-height:.8}
.hr{position:absolute;height:2px;background:currentColor;opacity:.18}
`;

const pg = (inner, cls = '', h = 1350) => `<div class="pg ${cls}" style="height:${h}px">${inner}</div>`;
// Cabeçalho e rodapé fixos do grid.
const topo = (n, tema = 'Direito Civil', cor = 'inherit') => `<div class="abs meta" style="left:72px;right:72px;top:56px;display:flex;justify-content:space-between;color:${cor}"><span>${n ? `${String(n).padStart(2, '0')} / 03` : 'Eduarda Caraciolo'}</span><span>${tema}</span></div>`;
const pe = (cor = 'inherit', dir = '') => `<div class="abs meta" style="left:72px;right:72px;bottom:52px;display:flex;justify-content:space-between;color:${cor}"><span>${PERFIL.arroba}</span><span>${dir}</span></div>`;
const marca = (cor = K.marinho, s = 1) => `<div style="display:inline-flex;align-items:center;gap:${22 * s}px;color:${cor}"><div style="width:${96 * s}px;height:${96 * s}px;background:${K.acento};display:flex;align-items:flex-end;justify-content:flex-start;padding:${8 * s}px ${12 * s}px;color:#fff"><span style="font-weight:600;font-size:${62 * s}px;letter-spacing:-.06em;line-height:.8">E</span><span class="it" style="font-size:${66 * s}px;line-height:.7">c</span></div><div style="line-height:.95"><div style="font-weight:600;font-size:${46 * s}px;letter-spacing:-.04em">Eduarda</div><div class="it" style="font-size:${52 * s}px">Caraciolo</div></div></div>`;

const c1 = C.c1, c2 = C.c2, c3 = C.c3, c4 = C.c4, c5 = C.c5;

// ---------- C1 explicativo: foto em cima, título embaixo / duas colunas com artigo gigante ----------
const c1capa = () => pg(`
  ${img('explicando', 0, 0, 1080, 760, 1.25, .62, .45)}
  ${topo(1, 'Direito Civil', '#fff')}
  <div class="abs tit" style="left:72px;top:820px;font-size:150px">Prescrição</div>
  <div class="abs it" style="left:72px;top:975px;font-size:160px;line-height:.9;color:${K.acento}">x decadência</div>
  <div class="abs" style="left:${col(3)}px;top:1170px;width:${larg(3)}px;font-size:34px;line-height:1.3">${esc(c1.sub)}</div>
  <div class="abs meta" style="left:72px;top:1184px;color:${K.cinza}">${PERFIL.arroba}</div>`);

const coluna = (it, x, w, art, escuro) => `
  <div class="abs" style="left:${x}px;top:0;width:${w}px;height:1350px;${escuro ? `background:${K.marinho};color:${K.papel}` : ''}"></div>
  <div class="abs" style="left:${x + 56}px;top:170px;width:${w - 104}px;color:${escuro ? K.papel : K.marinho}">
    <div class="meta" style="color:${escuro ? '#8E9BBE' : K.cinza}">art.</div>
    <div class="num" style="font-size:250px;margin-top:14px;color:${escuro ? '#fff' : K.acento}">${art}</div>
    <div class="it" style="font-size:92px;margin-top:80px;line-height:1">${esc(it.nome)}</div>
    <div style="font-size:42px;font-weight:600;line-height:1.22;margin-top:32px;letter-spacing:-.01em">${esc(it.txt)}</div>
    <div style="font-size:33px;line-height:1.4;margin-top:28px;opacity:.8">${esc(it.det)}</div>
    <div class="meta" style="margin-top:34px;color:${escuro ? '#8E9BBE' : K.cinza}">${esc(it.base)}</div>
  </div>`;
const c1in = () => pg(`${coluna(c1.itens[0], 0, 540, '189', false)}${coluna(c1.itens[1], 540, 540, '207', true)}
  <div class="abs meta" style="left:72px;top:56px">02 / 03</div><div class="abs meta" style="left:596px;top:56px;color:#8E9BBE">Direito Civil</div>
  <div class="abs meta" style="left:72px;bottom:52px">${PERFIL.arroba}</div>`);

const c1fim = () => pg(`
  ${topo(3)}
  <div class="abs" style="left:72px;top:200px;width:936px">
    <div class="meta" style="color:#8E9BBE">Em uma linha</div>
    <div class="tit" style="font-size:96px;margin-top:40px;line-height:1.02">Prescrição perde a <span class="it" style="color:#7D95FF;letter-spacing:0">pretensão.</span></div>
    <div class="tit" style="font-size:96px;margin-top:40px;line-height:1.02">Decadência perde o <span class="it" style="color:#7D95FF;letter-spacing:0">direito.</span></div>
  </div>
  <div class="abs" style="left:${col(0)}px;top:900px;width:${larg(3)}px;font-size:40px;line-height:1.3;font-weight:500">${esc(c1.fim)}</div>
  <div class="abs" style="left:${col(4)}px;top:900px;width:${larg(2)}px;height:${larg(2)}px;background:${K.acento};display:flex;flex-direction:column;justify-content:space-between;padding:26px 28px">
    <span class="meta">Salvar</span><span class="num" style="font-size:150px;align-self:flex-end">↓</span></div>
  ${pe()}`, 'esc');

// ---------- C2 lista: número gigante + recorte sobre faixa / tabela numerada ----------
const c2capa = () => pg(`
  ${topo(0, '2ª fase OAB')}
  <div class="abs num" style="left:40px;top:120px;font-size:880px;color:${K.acento}">4</div>
  <div class="abs tit" style="left:${col(3)}px;top:170px;width:${larg(3)}px;font-size:84px;line-height:1">erros que derrubam a peça de <span class="it" style="letter-spacing:0">Civil</span></div>
  <img class="abs" src="${recorte('surpresa')}" style="left:500px;top:560px;width:620px">
  <div class="abs" style="left:0;top:1070px;width:1080px;height:280px;background:${K.marinho}"></div>
  <div class="abs it" style="left:72px;top:1120px;font-size:72px;color:${K.papel}">${esc(c2.sub)}</div>
  <div class="abs meta" style="left:72px;bottom:52px;color:#8E9BBE">${PERFIL.arroba}</div>
  <div class="abs meta" style="right:72px;bottom:52px;color:#8E9BBE">Arraste</div>`);

const c2in = () => pg(`
  ${topo(2, '2ª fase OAB')}
  <div class="abs tit" style="left:72px;top:150px;font-size:72px">Os 4 erros</div>
  ${c2.itens.map((t, i) => {
    const m = t.match(/^(.*?)( \(.*\)|, .*)?$/);
    const y = 300 + i * 220;
    return `<div class="hr" style="left:72px;right:72px;top:${y}px"></div>
      <div class="abs num" style="left:72px;top:${y + 38}px;font-size:120px;color:${K.acento}">${String(i + 1).padStart(2, '0')}</div>
      <div class="abs" style="left:${col(2)}px;top:${y + 40}px;width:${larg(4)}px"><div style="font-size:46px;font-weight:600;line-height:1.15;letter-spacing:-.02em">${esc(m[1])}</div>${m[2] ? `<div class="it" style="font-size:40px;margin-top:8px;color:${K.cinza}">${esc(m[2].replace(/^[ ,]+/, '').replace(/[()]/g, ''))}</div>` : ''}</div>`;
  }).join('')}
  <div class="hr" style="left:72px;right:72px;top:1180px"></div>
  ${pe(K.marinho, esc(c2.base))}`);

const c2fim = () => pg(`
  ${topo(3, '2ª fase OAB', '#fff')}
  <div class="abs it" style="left:72px;top:200px;width:936px;font-size:150px;line-height:.95">Qual desses você já cometeu?</div>
  <div class="abs" style="left:72px;top:820px;display:grid;grid-template-columns:repeat(4,${larg(1) + 60}px);gap:24px">
    ${[1, 2, 3, 4].map(n => `<div style="height:200px;background:#fff;color:${K.acento};display:flex;align-items:flex-end;padding:20px 24px"><span class="num" style="font-size:150px">0${n}</span></div>`).join('')}
  </div>
  <div class="abs" style="left:72px;top:1080px;font-size:44px;font-weight:500">Conta nos comentários.</div>
  `, 'ac');

// ---------- C3 questão: escuro com opções / gabarito claro ----------
const c3capa = () => pg(`
  ${topo(1, 'Questão', '#fff')}
  ${img('pensando', col(3), 150, larg(3), 520, 1.35, .45, .45)}
  <div class="abs" style="left:72px;top:170px;width:${larg(3)}px">
    <div class="it" style="font-size:96px;line-height:.95;color:#7D95FF">Certo ou errado?</div>
  </div>
  <div class="abs tit" style="left:72px;top:740px;width:936px;font-size:80px;line-height:1.05;letter-spacing:-.035em">${esc(c3.pergunta)}</div>
  <div class="abs" style="left:72px;top:1060px;display:flex;gap:24px">
    ${c3.opcoes.map(o => `<div style="width:${larg(3)}px;height:130px;border:3px solid ${K.papel};display:flex;align-items:center;padding:0 36px;font-size:48px;font-weight:600">${o}</div>`).join('')}
  </div>
  ${pe('#8E9BBE', 'Resposta no próximo')}`, 'esc');

const c3in = () => pg(`
  ${topo(2, 'Gabarito')}
  <div class="abs meta" style="left:72px;top:180px;color:${K.acento}">Resposta</div>
  <div class="abs" style="left:66px;top:230px;display:flex;align-items:baseline;gap:30px">
    <span class="it" style="font-size:300px;line-height:.9">Errado.</span>
    <span style="width:90px;height:90px;background:${K.erro};color:#fff;display:flex;align-items:center;justify-content:center;font-size:62px;font-weight:600">✕</span></div>
  <div class="hr" style="left:72px;right:72px;top:590px"></div>
  <div class="abs" style="left:72px;top:640px;width:${larg(5)}px;font-size:50px;line-height:1.25;font-weight:500;letter-spacing:-.015em">A maioridade não encerra a pensão sozinha: a exoneração depende de <span style="color:${K.acento}">decisão judicial</span>, com contraditório.</div>
  <div class="abs" style="left:72px;top:1000px;width:${larg(3)}px;height:180px;background:${K.marinho};color:${K.papel};padding:26px 30px;display:flex;flex-direction:column;justify-content:space-between">
    <span class="meta" style="color:#8E9BBE">Base</span><span class="it" style="font-size:56px">${esc(c3.base)}</span></div>
  ${pe()}`);

const c3fim = () => pg(`
  ${topo(3, 'Questão')}
  <div class="abs it" style="left:66px;top:150px;font-size:230px;line-height:.9">Acertou?</div>
  <div class="abs" style="left:${col(2)}px;top:400px;width:${larg(4)}px;font-size:46px;line-height:1.25;font-weight:500">Comenta <span class="it" style="font-size:58px;color:${K.acento}">“acertei”</span> e marca quem precisa saber disso.</div>
  ${img('joinha', 0, 640, 1080, 710, 1.15, .45, .5)}
  <div class="abs meta" style="left:72px;bottom:52px;color:#fff">${PERFIL.arroba}</div>`);

// ---------- C4 mito ou verdade: metades / duas linhas com selo ----------
const c4capa = () => pg(`
  ${topo(1, 'ECA')}
  <div class="abs tit" style="left:72px;top:170px;font-size:110px">Adoção:</div>
  <div class="abs it" style="left:72px;top:330px;font-size:250px;line-height:.85">mito</div>
  <div class="abs it" style="left:80px;top:548px;font-size:100px;line-height:1;color:${K.cinza}">ou</div>
  <img class="abs" src="${recorte('surpresa')}" style="left:560px;top:240px;width:500px">
  <div class="abs" style="left:0;top:675px;width:1080px;height:675px;background:${K.marinho}"></div>
  <div class="abs it" style="left:72px;top:740px;font-size:250px;line-height:.85;color:#7D95FF">verdade?</div>
  <div class="abs" style="left:72px;top:1090px;width:${larg(4)}px;font-size:38px;line-height:1.3;color:${K.papel}">Duas afirmações sobre adoção no ECA. Qual é a verdadeira?</div>
  <div class="abs meta" style="left:72px;bottom:52px;color:#8E9BBE">${PERFIL.arroba}</div>
  <div class="abs meta" style="right:72px;bottom:52px;color:#8E9BBE">Arraste</div>`);

const linhaMV = (it, i) => {
  const y = i ? 675 : 0, esc_ = i === 1;
  return `<div class="abs" style="left:0;top:${y}px;width:1080px;height:675px;${esc_ ? `background:${K.marinho};color:${K.papel}` : ''}"></div>
    <div class="abs" style="left:72px;top:${y + 130}px;height:84px;padding:0 30px;background:${it.v ? K.acento : K.erro};color:#fff;display:flex;align-items:center;font-size:44px;font-weight:600">${it.v ? 'Verdade' : 'Mito'}</div>
    <div class="abs meta" style="left:${col(3)}px;top:${y + 148}px;color:${esc_ ? '#8E9BBE' : K.cinza}">${esc(it.base)}</div>
    <div class="abs it" style="left:72px;top:${y + 250}px;width:936px;font-size:96px;line-height:1;${esc_ ? 'color:#fff' : ''}">“${esc(it.frase)}”</div>
    <div class="abs" style="left:${col(1)}px;top:${y + 480}px;width:${larg(5)}px;font-size:38px;line-height:1.3;font-weight:500;color:${esc_ ? K.papel : K.marinho}">${esc(it.txt)}</div>`;
};
const c4in = () => pg(`${c4.itens.map(linhaMV).join('')}<div class="abs meta" style="right:72px;top:56px">02 / 03</div>`);

const c4fim = () => pg(`
  ${topo(3, 'ECA')}
  <div class="abs tit" style="left:72px;top:170px;width:${larg(4)}px;font-size:80px;line-height:1">Quer mais mito ou verdade de <span class="it" style="letter-spacing:0">ECA?</span></div>
  ${img('empolgada', col(4), 170, larg(2), 380, 1.9, .5, .45)}
  <div class="abs meta" style="left:72px;top:700px;color:${K.cinza}">Comenta</div>
  <div class="abs num" style="left:52px;top:760px;font-size:440px;color:${K.acento}">ECA</div>
  ${pe()}`);

// ---------- C5 apresentação: foto sangrada / grid 2×2 / fecho ----------
const c5capa = () => pg(`
  ${img('empolgada', 0, 0, 1080, 900, 1.35, .55, .42)}
  ${topo(0, 'Apresentação', '#fff')}
  <div class="abs" style="left:0;top:830px;width:1080px;height:520px;background:${K.papel}"></div>
  <div class="abs tit" style="left:72px;top:880px;font-size:120px">Prazer,</div>
  <div class="abs it" style="left:66px;top:990px;font-size:220px;line-height:.9;color:${K.acento}">Eduarda</div>
  <div class="abs" style="left:${col(0)}px;top:1220px;width:${larg(4)}px;font-size:30px;line-height:1.3">${esc(c5.sub)}</div>`);

const c5in = () => pg(`
  ${topo(2, 'Apresentação')}
  <div class="abs tit" style="left:72px;top:150px;font-size:72px">O que tem <span class="it" style="letter-spacing:0">aqui</span></div>
  ${c5.itens.map((t, i) => {
    const x = i % 2 ? col(3) : col(0), y = 300 + Math.floor(i / 2) * 480;
    const est = [`background:${K.marinho};color:${K.papel}`, `background:${K.acento};color:#fff`, `background:#fff;color:${K.marinho}`, `background:#E6E3D9;color:${K.marinho}`][i];
    return `<div class="abs" style="left:${x}px;top:${y}px;width:${larg(3)}px;height:456px;${est};padding:34px;display:flex;flex-direction:column;justify-content:space-between">
      <span class="num" style="font-size:140px">0${i + 1}</span><span style="font-size:48px;font-weight:600;line-height:1.1;letter-spacing:-.02em">${esc(t)}</span></div>`;
  }).join('')}`);

const c5fim = () => pg(`
  ${img('joinha', col(3), 0, 1080 - col(3), 1350, 2.2, .45, .4)}
  ${topo(3, '', '#fff')}
  <div class="abs it" style="left:72px;top:200px;width:${larg(3)}px;font-size:110px;line-height:.95">Me segue pra estudar Civil comigo.</div>
  <div class="abs" style="left:72px;top:800px;width:${larg(3)}px;font-size:30px;line-height:1.35;color:#B9C2DA">${esc(PERFIL.prof)}</div>
  <div class="abs" style="left:72px;top:1060px;height:110px;padding:0 34px;background:${K.acento};color:#fff;display:flex;align-items:center;font-size:42px;font-weight:600">${PERFIL.arroba}</div>`, 'esc');

// ---------- Posts únicos ----------
const p1 = () => pg(`
  ${topo(0, 'Frase')}
  <div class="abs tit" style="left:72px;top:330px;width:936px;font-size:150px">${esc(C.p1.frase)}</div>
  <div class="abs it" style="left:66px;top:720px;font-size:250px;line-height:.9;color:${K.acento}">${esc(C.p1.destaque)}</div>
  ${pe()}`);

const p2 = () => pg(`
  <div class="abs it" style="left:560px;top:-10px;font-size:1200px;line-height:1;color:${K.acento}">?</div>
  ${topo(0, 'Pergunta', K.papel)}
  <div class="abs tit" style="left:72px;top:520px;width:${larg(4)}px;font-size:110px">${esc(C.p2.titulo)}</div>
  <div class="abs" style="left:72px;top:1050px;width:${larg(4)}px;font-size:40px;line-height:1.3;font-weight:500">${esc(C.p2.txt)}</div>
  ${pe('#8E9BBE')}`, 'esc');

const p3 = () => pg(`
  ${topo(0, 'Sucessões')}
  <div class="abs tit" style="left:72px;top:150px;width:${larg(5)}px;font-size:84px;line-height:1">Ordem da vocação <span class="it" style="letter-spacing:0">hereditária</span></div>
  ${C.p3.itens.map((t, i) => {
    const m = t.match(/^([^,(]+)(.*)$/);
    const y = 400 + i * 205;
    return `<div class="hr" style="left:72px;right:72px;top:${y}px"></div>
      <div class="abs num" style="left:72px;top:${y + 34}px;font-size:130px;color:${K.acento}">${i + 1}º</div>
      <div class="abs" style="left:${col(2)}px;top:${y + 34}px;width:${larg(4)}px"><div style="font-size:48px;font-weight:600;letter-spacing:-.02em">${esc(m[1].trim())}</div><div style="font-size:32px;line-height:1.3;color:${K.cinza};margin-top:8px">${esc(m[2].replace(/^[ ,]+/, '').replace(/^\((.*)\)$/, '$1'))}</div></div>`;
  }).join('')}
  ${pe(K.marinho, esc(C.p3.base))}`);

// ---------- Stories ----------
const s1 = () => pg(`
  <div class="abs meta" style="left:72px;top:120px">Caixinha de perguntas</div>
  <div class="abs tit" style="left:72px;top:190px;width:936px;font-size:100px">Me pergunta qualquer coisa sobre <span class="it" style="letter-spacing:0;color:${K.acento}">ECA</span></div>
  <img class="abs" src="${recorte('empolgada')}" style="left:200px;top:540px;width:860px">
  <div class="abs" style="left:0;top:1290px;width:1080px;height:630px;background:${K.marinho};color:${K.papel};padding:64px 72px">
    <div class="meta" style="color:#8E9BBE">Sua pergunta</div>
    <div style="margin-top:30px;background:${K.papel};color:#9A9CA6;padding:40px 36px;font-size:42px">Escreve aqui</div>
    <div style="margin-top:56px;font-size:40px;line-height:1.3;font-weight:500">Respondo nos stories.</div>
    <div class="meta" style="margin-top:150px;color:#8E9BBE">${PERFIL.arroba}</div>
  </div>`, '', 1920);

const s2 = () => pg(`
  <div class="abs meta" style="left:72px;top:120px;color:#8E9BBE">Novo no feed</div>
  <div class="abs it" style="left:72px;top:180px;font-size:150px;line-height:.9">Post novo</div>
  <div class="abs" style="left:126px;top:440px;width:828px;height:1035px;overflow:hidden;outline:3px solid ${K.papel}"><div style="transform:scale(${828 / 1080});transform-origin:0 0;width:1080px;height:1350px">${c1capa()}</div></div>
  <div class="abs" style="left:72px;top:1560px;width:${larg(4)}px;font-size:44px;font-weight:600">${esc(C.s2.post)}</div>
  <div class="abs" style="left:72px;top:1640px;height:100px;padding:0 34px;background:${K.acento};color:#fff;display:flex;align-items:center;font-size:38px;font-weight:600">Toque para ver</div>`, 'esc', 1920);

// ---------- Destaques e avatar ----------
const destaques = () => {
  const pos = [[72, 150], [400, 150], [728, 150], [236, 560], [564, 560]];
  const est = [K.marinho, K.acento, K.marinho, K.acento, K.marinho];
  return pg(`${C.destaques.map((d, i) => `
    <div class="abs" style="left:${pos[i][0]}px;top:${pos[i][1]}px;width:280px;text-align:center">
      <div style="width:280px;height:280px;border-radius:50%;background:${est[i]};color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px">
        <span class="meta" style="opacity:.6">0${i + 1}</span><span class="it" style="font-size:${d.length > 4 ? 76 : 88}px;line-height:.9">${esc(d)}</span></div>
      <div style="font-size:30px;font-weight:500;margin-top:26px">${esc(d)}</div></div>`).join('')}
    <div class="abs meta" style="left:72px;bottom:52px;color:${K.cinza}">Capas dos destaques</div>`, '', 1080);
};
const avatar = () => pg(`
  <div class="abs" style="inset:0;background:${K.acento}"></div>
  <img class="abs" src="${recorte('empolgada')}" style="left:-300px;top:-40px;width:1300px">`, '', 1080);

// ---------- Prancha da marca ----------
const identidade = () => pg(`
  ${topo(0, 'Identidade 04 · Minimal Suíço')}
  <div class="abs" style="left:72px;top:150px">${marca(K.marinho, 1.5)}</div>
  <div class="abs meta" style="left:72px;top:370px;color:${K.cinza}">Paleta</div>
  ${[['Papel', K.papel, K.marinho], ['Marinho', K.marinho, '#fff'], ['Acento', K.acento, '#fff'], ['Cinza', K.cinza, '#fff'], ['Só erro', K.erro, '#fff']].map(([n, c, t], i) => `
    <div class="abs" style="left:${72 + i * 190}px;top:420px;width:174px;height:210px;background:${c};color:${t};padding:18px;display:flex;flex-direction:column;justify-content:space-between;${i === 0 ? `outline:2px solid ${K.linha};outline-offset:-2px` : ''}"><span style="font-size:28px;font-weight:600">${n}</span><span style="font-size:26px">${c}</span></div>`).join('')}
  <div class="abs meta" style="left:72px;top:680px;color:${K.cinza}">Tipografia</div>
  <div class="abs" style="left:72px;top:730px;width:${larg(3)}px">
    <div class="tit" style="font-size:92px">Aa Sans</div><div style="font-size:28px;margin-top:10px">Instrument Sans · títulos e leitura</div>
    <div class="it" style="font-size:104px;margin-top:30px;line-height:.9">Aa Serif</div><div style="font-size:28px;margin-top:10px">Instrument Serif itálico · destaques</div>
  </div>
  <div class="abs meta" style="left:${col(3)}px;top:680px;color:${K.cinza}">Elementos</div>
  <div class="abs num" style="left:${col(3)}px;top:740px;font-size:200px;color:${K.acento}">01</div>
  <div class="abs" style="left:${col(3)}px;top:930px;width:${larg(3)}px;font-size:28px;line-height:1.35">Grid de 6 colunas, número gigante, blocos chapados, foto sem moldura, fio fino só para separar.</div>
  <div class="hr" style="left:72px;right:72px;top:1080px"></div>
  <div class="abs meta" style="left:72px;top:1110px;color:${K.cinza}">Tom de voz</div>
  <div class="abs" style="left:${col(2)}px;top:1106px;width:${larg(4)}px;font-size:32px;line-height:1.35">Direto e preciso. Uma ideia por página, a lei citada sem rodeio, nenhum enfeite. Elegante sem ser distante.</div>`);

const pecas = [
  ['00-identidade', identidade], ['c1-1', c1capa], ['c1-2', c1in], ['c1-3', c1fim], ['c2-1', c2capa], ['c2-2', c2in], ['c2-3', c2fim],
  ['c3-1', c3capa], ['c3-2', c3in], ['c3-3', c3fim], ['c4-1', c4capa], ['c4-2', c4in], ['c4-3', c4fim], ['c5-1', c5capa], ['c5-2', c5in], ['c5-3', c5fim],
  ['p1', p1], ['p2', p2], ['p3', p3], ['s1', s1, 1920], ['s2', s2, 1920], ['destaques', destaques, 1080], ['avatar', avatar, 1080],
].map(([nome, f, h = 1350]) => ({ nome, w: 1080, h, html: f() }));

await render('id04-minimal', pecas, { fontes, css });
