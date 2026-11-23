// Projeto 03 · "Caderno da Eduarda": papel de caderno, marca-texto, post-its, fita e polaroids.
// Gerar: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node id03-caderno.mjs
import fs from 'node:fs';
import path from 'node:path';
import { render, CONTEUDO as C, PERFIL, root, esc } from './base.mjs';
// Fotos embutidas (data URI): o Chromium não carrega file:// a partir de setContent.
const cache = {};
const dataUri = (arq, mime) => cache[arq] ??= `data:${mime};base64,${fs.readFileSync(path.join(root, 'fotos', arq)).toString('base64')}`;
const foto = n => dataUri(`${n}.jpg`, 'image/jpeg');
const recorte = n => dataUri(`${n}-recorte.png`, 'image/png');

const K = {
  papel: '#FBF8F1', pauta: '#C9DAEA', margem: '#F3B3C3', tinta: '#1F2A44', cinza: '#5B6478',
  amarelo: '#FFE45C', verde: '#A9E5A0', rosa: '#FFB8D2', azul: '#B9DCF5',
  postit: '#FFEB8F', erro: '#D93A3A', certo: '#2E9E5B', fita: 'rgba(233,222,190,.86)',
};

const fontes = 'https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap';

const css = `
body{font-family:'DM Sans',sans-serif;color:${K.tinta};background:${K.papel}}
.pg{position:relative;overflow:hidden;width:1080px;height:1350px;background:${K.papel}}
.pautado{background-color:${K.papel};background-image:linear-gradient(90deg,transparent 108px,${K.margem} 108px,${K.margem} 111px,transparent 111px),repeating-linear-gradient(180deg,transparent 0 62px,${K.pauta} 62px 64px)}
.quad{background-color:${K.papel};background-image:repeating-linear-gradient(90deg,transparent 0 53px,#DCE6EF 53px 54px),repeating-linear-gradient(180deg,transparent 0 53px,#DCE6EF 53px 54px)}
.abs{position:absolute}
.mao{font-family:'Caveat',cursive;font-weight:700;line-height:1}
.mk{--c:${K.amarelo};background:linear-gradient(176deg,transparent 30%,var(--c) 31%,var(--c) 90%,transparent 91%);padding:0 .12em;-webkit-box-decoration-break:clone;box-decoration-break:clone}
.mk.v{--c:${K.verde}}.mk.r{--c:${K.rosa}}.mk.a{--c:${K.azul}}
.postit{position:absolute;background:${K.postit};box-shadow:0 18px 30px -14px rgba(60,50,20,.45),0 2px 0 rgba(0,0,0,.04);padding:44px 46px}
.postit.r{background:#FFC6DA}.postit.v{background:#C3EDB9}.postit.a{background:#CDE6F8}
.fita{position:absolute;width:210px;height:58px;background:${K.fita};box-shadow:0 2px 6px rgba(0,0,0,.08);clip-path:polygon(0 8%,4% 0,8% 10%,12% 0,100% 0,96% 12%,100% 24%,96% 38%,100% 52%,96% 66%,100% 80%,96% 92%,100% 100%,0 100%,4% 88%,0 76%,4% 62%,0 48%,4% 34%,0 20%)}
.pol{position:absolute;background:#fff;padding:22px 22px 0;box-shadow:0 26px 40px -18px rgba(30,30,50,.5)}
.pol .ph{background-size:cover;background-repeat:no-repeat}
.pol .leg{font-family:'Caveat',cursive;font-weight:700;font-size:44px;text-align:center;padding:14px 0 18px;color:${K.tinta}}
.card{position:absolute;background:#fff;box-shadow:0 22px 40px -20px rgba(30,30,50,.45);background-image:linear-gradient(180deg,transparent 98px,${K.margem} 98px,${K.margem} 101px,transparent 101px),repeating-linear-gradient(180deg,transparent 0 55px,#DDE8F2 55px 57px);background-position:0 0,0 44px}
.chip{display:inline-block;font-family:'Caveat',cursive;font-weight:700;font-size:44px;background:#fff;border:3px solid ${K.tinta};border-radius:14px;padding:2px 18px 6px;line-height:1.1}
.rod{position:absolute;left:140px;right:70px;bottom:40px;display:flex;justify-content:space-between;font-family:'Caveat',cursive;font-weight:700;font-size:42px;color:${K.cinza}}
.t-cap{font-weight:800;letter-spacing:-.035em;line-height:1.02}
`;

const pg = (inner, cls = 'pautado', h = 1350, extra = '') => `<div class="pg ${cls}" style="height:${h}px;${extra}">${inner}</div>`;
const rod = (n, txt = PERFIL.arroba) => `<div class="rod"><span>${txt}</span><span>${n}/3</span></div>`;
const fita = (x, y, r = -6, w = 210) => `<div class="fita" style="left:${x}px;top:${y}px;width:${w}px;transform:rotate(${r}deg)"></div>`;
// Enquadramento: posição do rosto em cada foto (fração da largura/altura) para recortar sem perder a cara.
const ROSTO = { empolgada: [.52, .42], explicando: [.47, .40], 'falando-neon': [.45, .43], joinha: [.45, .45], pensando: [.40, .42], surpresa: [.62, .43] };
const enq = (n, w, h, z = 1.6, bx = .5, by = .42) => {
  const iw = z * w, ih = iw * 1.5, [fx, fy] = ROSTO[n];
  const X = Math.min(0, Math.max(w - iw, bx * w - fx * iw)), Y = Math.min(0, Math.max(h - ih, by * h - fy * ih));
  return `background-image:url('${foto(n)}');background-size:${iw}px ${ih}px;background-position:${X}px ${Y}px`;
};
const pol = ({ x, y, w, h, r = 0, n, z = 1.6, bx, by, leg = '' }) =>
  `<div class="pol" style="left:${x}px;top:${y}px;width:${w + 44}px;transform:rotate(${r}deg)"><div class="ph" style="width:${w}px;height:${h}px;${enq(n, w, h, z, bx, by)}"></div><div class="leg">${leg}</div></div>`;
const clipe = (x, y, r = 0, s = 1) => `<svg class="abs" style="left:${x}px;top:${y}px;transform:rotate(${r}deg) scale(${s});transform-origin:top left" width="70" height="190" viewBox="0 0 70 190"><path d="M24 50 V150 a17 17 0 0 0 34 0 V34 a24 24 0 0 0 -48 0 V158" fill="none" stroke="#8F99AB" stroke-width="7" stroke-linecap="round"/></svg>`;
const seta = (x, y, w, r = 0, cor = K.tinta) => `<svg class="abs" style="left:${x}px;top:${y}px;transform:rotate(${r}deg)" width="${w}" height="80" viewBox="0 0 200 80"><path d="M6 52 C60 20,120 18,180 40" fill="none" stroke="${cor}" stroke-width="6" stroke-linecap="round"/><path d="M156 20 L184 41 L152 58" fill="none" stroke="${cor}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const circulo = (x, y, w, h, cor, r = -3) => `<svg class="abs" style="left:${x}px;top:${y}px;transform:rotate(${r}deg)" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><path d="M${w * .52} ${h * .06} C${w * .9} ${h * .02},${w * .99} ${h * .45},${w * .93} ${h * .7} C${w * .84} ${h * .98},${w * .2} ${h * 1.0},${w * .06} ${h * .66} C${-w * .02} ${h * .35},${w * .2} ${h * .04},${w * .62} ${h * .1}" fill="none" stroke="${cor}" stroke-width="7" stroke-linecap="round"/></svg>`;
const xis = (x, y, s = 60, cor = K.erro) => `<svg class="abs" style="left:${x}px;top:${y}px" width="${s}" height="${s}" viewBox="0 0 60 60"><path d="M10 12 L50 50 M48 10 L12 48" stroke="${cor}" stroke-width="8" stroke-linecap="round"/></svg>`;
const visto = (x, y, s = 70, cor = K.certo) => `<svg class="abs" style="left:${x}px;top:${y}px" width="${s}" height="${s}" viewBox="0 0 60 60"><path d="M8 32 L24 48 L54 10" fill="none" stroke="${cor}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const carimbo = (txt, cor, x, y, r = -8, fs = 56) => `<div class="abs" style="left:${x}px;top:${y}px;transform:rotate(${r}deg);border:6px solid ${cor};color:${cor};border-radius:14px;padding:4px 22px 8px;font-weight:800;font-size:${fs}px;letter-spacing:.06em;opacity:.92">${txt}</div>`;

// Logo: "Eduarda" à mão com marca-texto + "Caraciolo" em caixa alta espaçada.
const logo = (s = 1) => `<div style="display:inline-block;transform-origin:left top;transform:scale(${s})"><div class="mao" style="font-size:130px"><span class="mk">Eduarda</span></div><div style="font-weight:800;font-size:40px;letter-spacing:.42em;margin:6px 0 0 8px">CARACIOLO</div><div class="mao" style="font-size:40px;color:${K.cinza};margin:10px 0 0 8px">caderno de Civil e ECA</div></div>`;
const mono = (d = 300, fundo = K.postit) => `<div style="width:${d}px;height:${d}px;background:${fundo};display:flex;align-items:center;justify-content:center;box-shadow:0 14px 24px -12px rgba(60,50,20,.45);transform:rotate(-4deg)"><span class="mao" style="font-size:${d * .52}px"><span class="mk r">EC</span></span></div>`;

const c1 = C.c1, c2 = C.c2, c3 = C.c3, c4 = C.c4, c5 = C.c5;

// ---------- C1 explicativo: fichas lado a lado ----------
const c1capa = () => pg(`
  ${pol({ x: 470, y: 60, w: 500, h: 580, r: 4, n: 'explicando', z: 1.9, leg: 'aula de Civil' })}
  ${fita(640, 40, -4)}
  <div class="abs mao" style="left:140px;top:120px;font-size:56px;color:${K.cinza};transform:rotate(-3deg)">anota aí:</div>
  <div class="abs t-cap" style="left:140px;top:770px;font-size:132px">
    <span class="mk">Prescrição</span><br><span class="mao" style="font-size:120px;color:${K.cinza};margin-left:10px">x</span> <span class="mk v">decadência</span></div>
  <div class="abs mao" style="left:146px;top:1090px;font-size:70px">${esc(c1.sub)}</div>
  ${seta(820, 1150, 160, 6)}
  ${rod(1)}`);

const ficha = (it, cor, r, x, y, w, h, tag) => `
  <div class="card" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;transform:rotate(${r}deg);padding:28px 52px">
    <div style="height:72px;display:flex;align-items:center;justify-content:space-between"><span class="t-cap" style="font-size:58px"><span class="mk ${cor}">${esc(it.nome)}</span></span><span class="mao" style="font-size:44px;color:${K.cinza}">${tag}</span></div>
    <div style="font-weight:700;font-size:42px;line-height:1.3;margin-top:40px">${esc(it.txt)}</div>
    <div style="font-size:33px;line-height:1.45;margin-top:18px;color:#3A4560">${esc(it.det)}</div>
    <div style="margin-top:24px"><span class="chip">${esc(it.base)}</span></div>
  </div>`;
const c1in = () => pg(`
  <div class="abs mao" style="left:80px;top:56px;font-size:70px">Não confunda mais:</div>
  ${ficha(c1.itens[0], '', -1.2, 70, 170, 940, 520, 'perde a pretensão')}
  ${fita(450, 150, -3)}
  ${ficha(c1.itens[1], 'v', 1, 70, 730, 940, 520, 'perde o direito')}
  ${fita(460, 708, 4)}
  <div class="rod" style="left:80px">${`<span>${PERFIL.arroba}</span><span>2/3</span>`}</div>`, 'quad');

const c1fim = () => pg(`
  <div class="postit" style="left:120px;top:110px;width:860px;transform:rotate(-2deg);padding:50px 56px">
    <div class="mao" style="font-size:66px;color:#6B6235">resumindo:</div>
    <div class="t-cap" style="font-size:66px;margin-top:30px;line-height:1.25"><span class="mk">Prescrição</span><br>perde a <u style="text-decoration-thickness:5px;text-underline-offset:10px">pretensão</u></div>
    <div class="t-cap" style="font-size:66px;margin-top:34px;line-height:1.25"><span class="mk v">Decadência</span><br>perde o <u style="text-decoration-thickness:5px;text-underline-offset:10px">direito</u></div>
    <div style="font-size:32px;margin-top:34px;color:#4A4636">CC, arts. 189, 207 e 210</div>
  </div>
  ${fita(440, 86, 2)}
  ${pol({ x: 120, y: 820, w: 330, h: 330, r: -5, n: 'empolgada', z: 2, leg: 'bora revisar' })}
  <div class="abs" style="left:540px;top:880px;width:460px">
    <div class="t-cap" style="font-size:64px;line-height:1.1">Salva pra revisar</div>
    <div style="font-size:40px;line-height:1.4;margin-top:20px">e manda pra quem vai fazer a <span class="mk r" style="font-weight:700">OAB</span>.</div>
  </div>
  ${rod(3)}`);

// ---------- C2 lista: número gigante + recorte ----------
const c2capa = () => pg(`
  <div class="abs mao" style="left:70px;top:-60px;font-size:620px;color:${K.tinta}"><span class="mk r" style="padding:0 .05em">4</span></div>
  <div class="abs t-cap" style="left:470px;top:110px;width:560px;font-size:88px">erros que derrubam a peça de Civil</div>
  <img class="abs" src="${recorte('surpresa')}" style="left:470px;top:560px;width:660px">
  <div class="abs mao" style="left:80px;top:640px;width:380px;font-size:60px;transform:rotate(-4deg);line-height:1.05">você comete algum deles?</div>
  ${seta(150, 830, 220, 18)}
  <div class="postit" style="left:420px;top:1030px;width:430px;padding:36px 40px;transform:rotate(3deg)"><div class="mao" style="font-size:58px">${esc(c2.sub)}</div></div>
  ${fita(530, 1008, -5, 190)}
  <div class="rod" style="left:80px;right:auto"><span>${PERFIL.arroba}</span></div>`, 'quad');

const c2in = () => pg(`
  <div class="abs mao" style="left:140px;top:58px;font-size:76px">Os 4 erros <span style="color:${K.erro}">(fuja deles)</span>:</div>
  ${c2.itens.map((t, i) => {
    const m = t.match(/^(.*?)( \(.*\)|, .*)?$/);
    const y = 230 + i * 236;
    return `<div class="abs mao" style="left:128px;top:${y - 6}px;font-size:96px;width:90px;text-align:center"><span class="mk ${['', 'v', 'r', 'a'][i]}">${i + 1}</span></div>
      <div class="abs" style="left:250px;top:${y + 4}px;width:680px"><div style="font-weight:800;font-size:50px;line-height:1.22;letter-spacing:-.02em">${esc(m[1])}</div>${m[2] ? `<div style="font-size:36px;color:${K.cinza};margin-top:8px">${esc(m[2].replace(/^[ ,]+/, '').replace(/[()]/g, ''))}</div>` : ''}</div>
      ${xis(950, y + 10, 64)}`;
  }).join('')}
  ${clipe(820, 1110, 8, .8)}
  <div class="abs" style="left:140px;top:1180px"><span class="chip">${esc(c2.base)}</span></div>
  <div class="rod" style="bottom:36px;left:auto;right:70px"><span>2/3</span></div>`);

const c2fim = () => pg(`
  ${pol({ x: 100, y: 90, w: 430, h: 520, r: -5, n: 'pensando', z: 1.9, leg: 'hmm, qual foi?' })}
  ${fita(250, 66, 6)}
  <div class="abs" style="left:600px;top:150px;display:grid;grid-template-columns:150px 150px;gap:26px">
    ${[1, 2, 3, 4].map((n, i) => `<div style="height:150px;background:${['#FFEB8F', '#C3EDB9', '#FFC6DA', '#CDE6F8'][i]};display:flex;align-items:center;justify-content:center;transform:rotate(${[-4, 3, 2, -3][i]}deg);box-shadow:0 12px 20px -10px rgba(0,0,0,.35)"><span class="mao" style="font-size:100px">${n}</span></div>`).join('')}
  </div>
  <div class="postit r" style="left:130px;top:800px;width:820px;transform:rotate(1.5deg)">
    <div class="t-cap" style="font-size:66px">Qual desses você já cometeu?</div>
    <div style="font-size:38px;margin-top:18px">Conta nos comentários.</div>
  </div>
  ${fita(460, 776, -3)}
  ${rod(3)}`, 'quad');

// ---------- C3 questão: folha de prova ----------
const folha = (corrigida) => `
  <div class="abs" style="left:70px;top:${corrigida ? 90 : 300}px;width:940px;${corrigida ? '' : 'height:900px;'}background:#fff;box-shadow:0 24px 44px -20px rgba(30,30,50,.5);padding:56px 64px">
    <div style="display:flex;justify-content:space-between;align-items:baseline"><span style="font-weight:800;font-size:32px;letter-spacing:.2em">QUESTÃO</span><span class="mao" style="font-size:42px;color:${K.cinza}">Direito de Família</span></div>
    <div style="height:3px;background:${K.tinta};margin:18px 0 44px"></div>
    <div style="font-weight:800;font-size:${corrigida ? 54 : 72}px;line-height:1.2;letter-spacing:-.02em">${esc(c3.pergunta)}</div>
    <div style="display:flex;gap:80px;margin-top:${corrigida ? 46 : 70}px;font-size:46px;font-weight:600;position:relative">
      ${c3.opcoes.map((o, i) => `<div style="display:flex;align-items:center;gap:20px;position:relative"><span style="width:56px;height:56px;border:4px solid ${K.tinta};border-radius:8px;display:inline-block;position:relative">${corrigida && i === c3.certa ? visto(-4, -18, 70) : ''}</span>${o}${corrigida && i === c3.certa ? circulo(-26, -30, 300, 120, K.certo) : ''}</div>`).join('')}
    </div>
    ${corrigida ? `<div style="height:3px;background:#E6E1D6;margin:46px 0 38px"></div>
      <div class="mao" style="font-size:54px;color:${K.certo}">gabarito comentado:</div>
      <div style="font-size:44px;line-height:1.42;margin-top:20px"><b>Errado.</b> A maioridade não encerra a pensão sozinha: a exoneração depende de <span class="mk v" style="font-weight:700">decisão judicial</span>, com contraditório.</div>` : ''}
    ${corrigida ? '' : `<div class="mao" style="font-size:48px;color:${K.cinza};margin-top:70px">justifique:</div>${[0, 1, 2].map(() => '<div style="height:2px;background:#DDE8F2;margin-top:62px"></div>').join('')}`}
  </div>`;
const c3capa = () => pg(`
  <div class="abs" style="left:80px;top:70px"><span class="mao" style="font-size:96px"><span class="mk">Certo ou errado?</span></span></div>
  <div class="abs mao" style="left:86px;top:190px;font-size:48px;color:${K.cinza}">responde antes de passar</div>
  ${folha(false)}
  ${pol({ x: 700, y: 30, w: 270, h: 300, r: 6, n: 'pensando', z: 2.2, leg: 'e aí?' })}
  ${fita(780, 14, -8, 170)}
  <div class="abs mao" style="left:620px;top:1236px;font-size:52px">resposta no próximo</div>
  ${seta(920, 1220, 120, 8)}`, 'quad');
const c3in = () => pg(`
  ${folha(true)}
  ${carimbo('GABARITO', K.certo, 110, 1110, -6, 52)}
  <div class="postit" style="left:520px;top:1060px;width:470px;padding:34px 36px;transform:rotate(-3deg)"><div class="mao" style="font-size:60px;white-space:nowrap">${esc(c3.base)}</div></div>
  ${fita(640, 1040, 4, 170)}
  <div class="rod" style="left:80px;right:auto"><span>2/3</span></div>`, 'quad');
const c3fim = () => pg(`
  <img class="abs" src="${recorte('joinha')}" style="left:150px;top:60px;width:840px">
  <div class="card" style="left:70px;top:800px;width:940px;height:470px;padding:120px 64px 40px;transform:rotate(-1deg)">
    <div class="t-cap" style="font-size:72px">Acertou?</div>
    <div style="font-size:40px;line-height:1.45;margin-top:18px">Comenta <span class="mk" style="font-weight:800">“acertei”</span> e marca quem precisa saber disso.</div>
  </div>
  ${fita(160, 780, -6)}${fita(760, 784, 5)}
  ${rod(3)}`);

// ---------- C4 mito ou verdade: post-its + fichas com carimbo ----------
const c4capa = () => pg(`
  <div class="abs t-cap" style="left:80px;top:80px;font-size:140px">Adoção:</div>
  <div class="abs mao" style="left:84px;top:250px;font-size:112px">mito ou <span class="mk v">verdade?</span></div>
  <img class="abs" src="${recorte('surpresa')}" style="left:450px;top:420px;width:700px">
  <div class="postit r" style="left:70px;top:610px;width:360px;height:280px;display:flex;align-items:center;justify-content:center;transform:rotate(-7deg)"><span class="mao" style="font-size:120px">mito</span></div>
  ${fita(160, 590, 4, 170)}
  <div class="postit v" style="left:300px;top:930px;width:460px;height:300px;display:flex;align-items:center;justify-content:center;transform:rotate(4deg)"><span class="mao" style="font-size:120px">verdade</span></div>
  ${fita(440, 910, -5, 180)}
  <div class="rod" style="left:80px;right:auto"><span>${PERFIL.arroba}</span></div>`, 'quad');
const flash = (it, i) => {
  const y = i ? 720 : 110;
  const cor = it.v ? K.certo : K.erro;
  return `<div class="card" style="left:70px;top:${y}px;width:940px;height:540px;padding:30px 56px;transform:rotate(${i ? 1 : -1}deg)">
    <div style="height:70px;display:flex;align-items:center"><span class="mao" style="font-size:46px;color:${K.cinza}">ficha ${i + 1}</span></div>
    <div style="font-weight:800;font-size:56px;line-height:1.18;letter-spacing:-.02em;margin-top:40px;width:560px">“${esc(it.frase)}”</div>
    <div style="font-size:38px;line-height:1.42;margin-top:28px">${esc(it.txt)}</div>
    <div style="margin-top:22px"><span class="chip">${esc(it.base)}</span></div>
  </div>${carimbo(it.v ? 'VERDADE' : 'MITO', cor, it.v ? 690 : 740, y + 120, i ? 8 : -8, 54)}`;
};
const c4in = () => pg(`${c4.itens.map(flash).join('')}${fita(460, 92, -2)}${fita(470, 700, 3)}
  <div class="rod" style="left:auto;right:70px;bottom:28px"><span>2/3</span></div>`, 'quad');
const c4fim = () => pg(`
  ${pol({ x: 600, y: 90, w: 340, h: 400, r: 5, n: 'empolgada', z: 2, leg: 'tem mais!' })}
  ${fita(700, 70, -6, 170)}
  <div class="abs t-cap" style="left:140px;top:150px;width:440px;font-size:76px">Quer mais mito ou verdade de ECA?</div>
  <div class="postit" style="left:140px;top:700px;width:800px;transform:rotate(-2deg);padding:50px 56px">
    <div style="font-size:42px;font-weight:600">É só comentar:</div>
    <div class="mao" style="font-size:230px;margin-top:10px;line-height:.9"><span class="mk r">ECA</span></div>
  </div>
  ${fita(440, 676, 3)}
  ${rod(3)}`);

// ---------- C5 apresentação: polaroid grande + sumário com abas ----------
const c5capa = () => pg(`
  ${pol({ x: 170, y: 60, w: 690, h: 760, r: -3, n: 'empolgada', z: 2, by: .46, leg: PERFIL.arroba })}
  ${fita(160, 70, -38, 230)}${fita(760, 60, 36, 230)}
  <div class="abs mao" style="left:120px;top:960px;font-size:150px;transform:rotate(-2deg)">Prazer, <span class="mk">Eduarda</span></div>
  <div class="abs" style="left:140px;top:1140px;width:820px;font-size:38px;line-height:1.4;font-weight:500">${esc(c5.sub)}</div>`);
const c5in = () => {
  const cores = [K.amarelo, K.verde, K.rosa, K.azul];
  return pg(`
  <div class="abs mao" style="left:140px;top:70px;font-size:96px">Neste caderno:</div>
  <div class="abs" style="left:146px;top:186px;font-size:34px;color:${K.cinza}">o que você encontra no meu perfil</div>
  ${c5.itens.map((t, i) => `
    <div class="abs" style="left:100px;top:${320 + i * 230}px;width:880px;height:190px;background:#fff;box-shadow:0 16px 30px -18px rgba(30,30,50,.45);display:flex;align-items:center;padding:0 40px;gap:36px">
      <span class="mao" style="font-size:96px;width:90px;text-align:center;color:${K.cinza}">${String(i + 1).padStart(2, '0')}</span>
      <span style="font-weight:800;font-size:52px;letter-spacing:-.02em">${esc(t)}</span>
    </div>
    <div class="abs" style="left:980px;top:${340 + i * 230}px;width:100px;height:150px;background:${cores[i]};box-shadow:4px 10px 18px -10px rgba(0,0,0,.3)"></div>`).join('')}
  ${rod(2)}`);
};
const c5fim = () => pg(`
  ${pol({ x: 110, y: 110, w: 460, h: 560, r: -4, n: 'joinha', z: 1.9, bx: .45, leg: 'te espero lá' })}
  ${fita(260, 86, 5)}
  <div class="abs t-cap" style="left:620px;top:200px;width:400px;font-size:80px">Me segue pra estudar Civil comigo.</div>
  <div class="postit" style="left:150px;top:880px;width:780px;padding:44px 50px;transform:rotate(1.5deg)">
    <div style="font-size:38px;font-weight:600">${esc(PERFIL.prof)}</div>
    <div class="mao" style="font-size:96px;margin-top:16px"><span class="mk r">${PERFIL.arroba}</span></div>
  </div>
  ${fita(460, 856, -3)}
  ${rod(3, '')}`);

// ---------- Posts únicos ----------
const p1 = () => pg(`
  ${pol({ x: 700, y: 70, w: 250, h: 280, r: 6, n: 'explicando', z: 2.2, leg: 'aula de hoje' })}
  ${fita(740, 54, -6, 160)}
  <div class="abs mao" style="left:140px;top:200px;font-size:56px;color:${K.cinza};transform:rotate(-3deg)">anota na primeira página:</div>
  <div class="abs t-cap" style="left:140px;top:480px;width:860px;font-size:140px">${esc(C.p1.frase)}</div>
  <div class="abs mao" style="left:120px;top:870px;font-size:210px;white-space:nowrap;transform:rotate(-3deg)"><span class="mk">${esc(C.p1.destaque)}</span></div>
  <div class="rod" style="right:auto"><span>${PERFIL.arroba}</span></div>`);

const p2 = () => pg(`
  <div class="postit" style="left:110px;top:120px;width:860px;padding:60px 64px;transform:rotate(-2deg)">
    <div class="mao" style="font-size:52px;color:#6B6235">pergunta pra você:</div>
    <div class="t-cap" style="font-size:96px;margin-top:20px">${esc(C.p2.titulo)}</div>
  </div>
  ${fita(440, 96, 3)}
  <div class="abs" style="left:140px;top:720px;width:520px;font-size:50px;line-height:1.35;font-weight:600">${esc(C.p2.txt)}</div>
  <div class="abs mao" style="left:140px;top:1040px;font-size:76px"><span class="mk r">escreve aqui</span></div>
  ${seta(170, 1140, 150, 75)}
  <img class="abs" src="${recorte('empolgada')}" style="left:640px;top:700px;width:520px">
  <div class="rod" style="right:auto"><span>${PERFIL.arroba}</span></div>`);

const p3 = () => pg(`
  <div class="abs mao" style="left:80px;top:60px;font-size:60px;color:${K.cinza}">dica de Sucessões</div>
  <div class="abs t-cap" style="left:80px;top:140px;width:900px;font-size:96px">Ordem da vocação hereditária</div>
  ${clipe(930, 40, 12, 1)}
  <div class="abs" style="left:84px;top:370px;transform:rotate(-2deg)"><span class="chip" style="font-size:44px">${esc(C.p3.base)}</span></div>
  ${C.p3.itens.map((t, i) => {
    const m = t.match(/^([^,(]+)(.*)$/);
    return `<div class="abs" style="left:80px;top:${480 + i * 200}px;width:920px;height:180px;display:flex;align-items:center;gap:34px">
      <div style="width:150px;height:150px;flex:none;background:${[K.amarelo, K.verde, K.rosa, K.azul][i]};display:flex;align-items:center;justify-content:center;transform:rotate(${[-3, 2, -2, 3][i]}deg)"><span class="mao" style="font-size:104px">${i + 1}º</span></div>
      <div><div style="font-weight:800;font-size:52px;letter-spacing:-.02em">${esc(m[1].trim())}</div><div style="font-size:33px;line-height:1.35;color:#3A4560;margin-top:6px">${esc(m[2].replace(/^[ ,]+/, '').replace(/^\((.*)\)$/, '$1'))}</div></div></div>`;
  }).join('')}
  <div class="rod" style="left:80px"><span>${PERFIL.arroba}</span><span>salva essa</span></div>`, 'quad');

// ---------- Stories ----------
const s1 = () => pg(`
  <img class="abs" src="${recorte('joinha')}" style="left:110px;top:220px;width:900px">
  <div class="postit" style="left:90px;top:1070px;width:900px;padding:56px 60px 60px;transform:rotate(-1.5deg)">
    <div class="t-cap" style="font-size:72px">${esc(C.s1.titulo)}</div>
    <div style="margin-top:40px;background:#fff;border-radius:22px;padding:34px 36px;font-size:40px;color:#9AA0AD;font-weight:500">Escreve sua dúvida aqui…</div>
  </div>
  ${fita(160, 1050, -7)}${fita(760, 1046, 6)}
  <div class="abs mao" style="left:120px;top:110px;font-size:64px">caixinha aberta!</div>
  <div class="abs mao" style="left:140px;top:1620px;font-size:54px;color:${K.cinza}">respondo as melhores aqui nos stories</div>`, 'pautado', 1920);

const s2 = () => pg(`
  <div class="abs mao" style="left:120px;top:150px;font-size:86px"><span class="mk">${esc(C.s2.titulo)}</span></div>
  <div class="abs" style="left:126px;top:270px;font-size:40px;font-weight:600">${esc(C.s2.post)}</div>
  <div class="pol" style="left:170px;top:420px;width:784px;transform:rotate(-3deg)"><div style="width:740px;height:925px;overflow:hidden;position:relative"><div style="transform:scale(${740 / 1080});transform-origin:0 0;width:1080px;height:1350px">${c1capa()}</div></div><div class="leg">corre lá ver</div></div>
  ${fita(480, 396, 3, 230)}
  <div class="postit r" style="left:300px;top:1540px;width:480px;padding:34px 40px;transform:rotate(3deg);text-align:center"><div style="font-weight:800;font-size:42px">toca pra ver o post</div></div>
  ${seta(570, 1700, 160, 90)}`, 'quad', 1920);

// ---------- Destaques e avatar ----------
const destaques = () => {
  const cor = [K.amarelo, K.verde, K.rosa, K.azul, K.postit];
  const pos = [[90, 140], [400, 140], [710, 140], [245, 560], [555, 560]];
  return pg(`${C.destaques.map((d, i) => `
    <div class="abs" style="left:${pos[i][0]}px;top:${pos[i][1]}px;width:280px;text-align:center">
      <div style="width:280px;height:280px;border-radius:50%;background:${cor[i]};background-image:repeating-linear-gradient(180deg,transparent 0 38px,rgba(31,42,68,.10) 38px 40px);display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 10px #fff,0 18px 30px -10px rgba(0,0,0,.25)">
        <span class="mao" style="font-size:${d.length > 4 ? 84 : 100}px">${esc(d)}</span></div>
      <div style="font-weight:700;font-size:32px;margin-top:34px">${esc(d)}</div></div>`).join('')}
    <div class="abs mao" style="left:0;right:0;bottom:40px;text-align:center;font-size:46px;color:${K.cinza}">capas dos destaques</div>`, 'quad', 1080);
};
const avatar = () => pg(`
  <div class="abs" style="inset:0;background:${K.postit};background-image:repeating-linear-gradient(180deg,transparent 0 62px,rgba(31,42,68,.08) 62px 64px)"></div>
  <img class="abs" src="${recorte('empolgada')}" style="left:-300px;top:-40px;width:1300px">`, '', 1080);

// ---------- Prancha da marca ----------
const identidade = () => pg(`
  <div class="abs" style="left:80px;top:60px">${logo(1)}</div>
  <div class="abs" style="left:800px;top:80px">${mono(190)}</div>
  <div class="abs mao" style="left:80px;top:400px;font-size:46px;color:${K.cinza}">paleta</div>
  <div class="abs" style="left:80px;top:460px;display:grid;grid-template-columns:repeat(4,220px);gap:20px 26px">
    ${[['Papel', K.papel], ['Tinta', K.tinta], ['Marca-texto', K.amarelo], ['Verde', K.verde], ['Rosa', K.rosa], ['Azul', K.azul], ['Pauta', K.pauta], ['Só p/ erro', K.erro]].map(([n, c]) => `
      <div style="display:flex;align-items:center;gap:14px"><span style="width:64px;height:64px;flex:none;background:${c};border:2px solid rgba(31,42,68,.18);transform:rotate(-3deg)"></span><span style="font-size:26px;line-height:1.15"><b>${n}</b><br>${c}</span></div>`).join('')}
  </div>
  <div class="abs mao" style="left:80px;top:660px;font-size:46px;color:${K.cinza}">tipografia</div>
  <div class="abs" style="left:80px;top:720px;width:440px">
    <div class="mao" style="font-size:86px">Caveat</div><div style="font-size:28px;margin-top:6px">anotações à mão, destaques e chamadas</div>
    <div style="font-weight:800;font-size:64px;margin-top:26px;letter-spacing:-.03em">DM Sans</div><div style="font-size:28px;margin-top:6px">títulos e texto de leitura</div>
  </div>
  <div class="abs mao" style="left:580px;top:660px;font-size:46px;color:${K.cinza}">elementos</div>
  <div class="postit" style="left:590px;top:730px;width:170px;height:150px;padding:20px;transform:rotate(-4deg)"><span class="mao" style="font-size:40px">post-it</span></div>
  ${pol({ x: 810, y: 712, w: 150, h: 150, r: 6, n: 'joinha', z: 2.4, leg: 'polaroid' })}
  ${fita(820, 696, -6, 140)}
  <div class="abs" style="left:594px;top:950px;font-size:34px;font-weight:700"><span class="mk">marca-texto</span></div>
  <div class="abs" style="left:594px;top:1010px"><span class="chip" style="font-size:36px">CC, art. 189</span></div>
  ${clipe(880, 960, -25, .6)}
  <div class="abs mao" style="left:80px;top:1090px;font-size:46px;color:${K.cinza}">tom de voz</div>
  <div class="abs" style="left:80px;top:1150px;width:930px;font-size:30px;line-height:1.45">Colega de estudo que explica no caderno: didática, próxima e organizada. Frases curtas, uma ideia por página, a lei sempre citada. Sem juridiquês e sem pressa.</div>`);

const pecas = [
  ['00-identidade', identidade], ['c1-1', c1capa], ['c1-2', c1in], ['c1-3', c1fim], ['c2-1', c2capa], ['c2-2', c2in], ['c2-3', c2fim],
  ['c3-1', c3capa], ['c3-2', c3in], ['c3-3', c3fim], ['c4-1', c4capa], ['c4-2', c4in], ['c4-3', c4fim], ['c5-1', c5capa], ['c5-2', c5in], ['c5-3', c5fim],
  ['p1', p1], ['p2', p2], ['p3', p3], ['s1', s1, 1920], ['s2', s2, 1920], ['destaques', destaques, 1080], ['avatar', avatar, 1080],
].map(([nome, f, h = 1350]) => ({ nome, w: 1080, h: nome === 'destaques' || nome === 'avatar' ? 1080 : h, html: f() }));

await render('id03-caderno', pecas, { fontes, css });
