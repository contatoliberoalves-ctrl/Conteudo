// Projeto 02 · "Lilás Studio": a identidade nasce do estúdio real da Eduarda (cortina roxa, parede laranja
// de painéis acústicos e o neon "Decisão Dedicação Consistência"). Roxo profundo + lavanda + âmbar;
// Tilt Neon (letreiro com brilho) + Outfit (texto).
import fs from 'node:fs';
import { render, CONTEUDO as C, PERFIL, foto as fotoUrl, recorte as recorteUrl, esc } from './base.mjs';
// O Chromium não carrega file:// numa página about:blank: as fotos entram como data URI.
const dataUri = u => { const f = new URL(u).pathname; return `data:image/${f.endsWith('.png') ? 'png' : 'jpeg'};base64,${fs.readFileSync(f).toString('base64')}`; };
const memo = new Map(); const cache = u => memo.get(u) || (memo.set(u, dataUri(u)), memo.get(u));
const foto = n => cache(fotoUrl(n)); const recorte = n => cache(recorteUrl(n));

const ID = 'id02-lilas-studio';
const fontes = 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Tilt+Neon&display=swap';
const K = { noite: '#1C0A42', roxo: '#4A22A6', lavanda: '#C9B8FF', ambar: '#F4A53A', laranja: '#D9772A', neon: '#FFF8EE', erro: '#FF4F5E' };

const css = `
:root{--noite:${K.noite};--roxo:${K.roxo};--lav:${K.lavanda};--ambar:${K.ambar};--lar:${K.laranja};--neon:${K.neon};--erro:${K.erro}}
body{background:var(--noite);color:var(--neon);font-family:'Outfit',sans-serif;-webkit-font-smoothing:antialiased}
.pg{position:absolute;inset:0;overflow:hidden}
.abs{position:absolute}
.n{font-family:'Tilt Neon',sans-serif;color:#fff;text-shadow:0 0 4px #fff,0 0 14px #c6a8ff,0 0 32px #9b6bff,0 0 70px #7a3cff}
.na{font-family:'Tilt Neon',sans-serif;color:#fff4dc;text-shadow:0 0 4px #fff,0 0 14px #ffc46b,0 0 34px #ff9a1f,0 0 70px #ff7a00}
.h{font-weight:800;letter-spacing:-.02em;line-height:1}
.pill{display:inline-block;border-radius:999px;font-weight:600;font-size:28px;padding:12px 26px}
.cortina{background:
  repeating-linear-gradient(90deg,#2d1172 0,#4a22a6 28px,#5d33c4 46px,#4a22a6 62px,#2d1172 90px)}
.parede{background:
  repeating-linear-gradient(90deg,#0000 0 14px,#00000014 14px 18px),
  conic-gradient(#E58A30 25%,#C96D1F 0 50%,#E58A30 0 75%,#C96D1F 0) 0 0/360px 360px}
.ripa{background:repeating-linear-gradient(90deg,#2a1068 0 16px,#3b1890 16px 30px)}
.ph{background-repeat:no-repeat;background-size:cover}
`;
const ph = (n, pos = '50% 40%') => `background-image:url('${foto(n)}');background-position:${pos}`;
const marca = (cor = '#fff', cls = 'n') => `<div class="abs" style="left:60px;top:52px;display:flex;align-items:baseline;gap:14px"><span class="${cls}" style="font-size:46px">eduarda</span><span style="font-size:24px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:${cor};opacity:.85">studio</span></div>`;
const tag = (t, bg = 'var(--ambar)', cor = 'var(--noite)') => `<div class="abs" style="right:60px;top:50px"><span class="pill" style="background:${bg};color:${cor};font-size:26px">${t}</span></div>`;
const arroba = (cor = 'var(--lav)') => `<div class="abs" style="left:60px;bottom:50px;font-size:28px;font-weight:600;color:${cor}">${PERFIL.arroba}</div>`;
const pag = (t, cor = 'var(--lav)') => `<div class="abs" style="right:60px;bottom:50px;font-size:28px;font-weight:600;color:${cor}">${t}</div>`;

const P = [];
const add = (nome, html, w = 1080, h = 1350) => P.push({ nome, w, h, html: `<div class="pg">${html}</div>` });

// ───────────── 00 · identidade
add('00-identidade', `
  <div class="abs" style="left:60px;top:48px;font-size:24px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--lav)">Manual de identidade · Projeto 02</div>
  <div class="abs cortina" style="left:60px;right:60px;top:100px;height:330px;border-radius:28px;overflow:hidden">
    <div class="abs" style="inset:0;background:#1c0a4299"></div>
    <div class="abs" style="left:50px;top:60px"><div class="n" style="font-size:170px;line-height:1">eduarda</div>
      <div style="font-size:30px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;margin-top:18px">studio · Civil e ECA</div></div>
    <div class="abs" style="right:50px;top:75px;width:180px;height:180px;border-radius:40px;background:var(--noite);display:flex;align-items:center;justify-content:center"><span class="na" style="font-size:110px;line-height:1">ec</span></div>
  </div>
  <div class="abs" style="left:60px;top:460px;font-size:26px;font-weight:700;color:var(--lav)">Paleta</div>
  <div class="abs" style="left:60px;right:60px;top:500px;display:grid;grid-template-columns:repeat(6,1fr);gap:12px">
    ${[['Noite', K.noite, 0], ['Cortina', K.roxo, 0], ['Lavanda', K.lavanda, 1], ['Âmbar', K.ambar, 1], ['Parede', K.laranja, 1], ['Só erro', K.erro, 1]].map(([n, h, cl]) => `
    <div style="height:170px;border-radius:18px;background:${h};${n === 'Noite' ? 'box-shadow:inset 0 0 0 2px #ffffff40;' : ''}color:${cl ? K.noite : K.neon};padding:14px;display:flex;flex-direction:column;justify-content:flex-end">
      <div style="font-weight:700;font-size:25px">${n}</div><div style="font-size:21px;opacity:.85">${h}</div></div>`).join('')}
  </div>
  <div class="abs" style="left:60px;top:700px;font-size:26px;font-weight:700;color:var(--lav)">Tipografia</div>
  <div class="abs" style="left:60px;top:740px;width:470px;height:230px;border-radius:22px;background:#2b1463;padding:22px 28px">
    <div class="n" style="font-size:96px;line-height:1">Aa</div>
    <div style="font-size:27px;font-weight:700;margin-top:14px">Tilt Neon</div><div style="font-size:23px;opacity:.8">letreiro: títulos com brilho</div></div>
  <div class="abs" style="left:550px;top:740px;width:470px;height:230px;border-radius:22px;background:var(--lav);color:var(--noite);padding:22px 28px">
    <div class="h" style="font-size:96px;font-weight:900">Aa</div>
    <div style="font-size:27px;font-weight:700;margin-top:14px">Outfit</div><div style="font-size:23px;opacity:.8">títulos fortes e texto corrido</div></div>
  <div class="abs" style="left:60px;top:1000px;font-size:26px;font-weight:700;color:var(--lav)">Elementos do estúdio</div>
  <div class="abs" style="left:60px;right:60px;top:1040px;display:grid;grid-template-columns:repeat(4,1fr);gap:12px">
    <div><div class="cortina" style="height:110px;border-radius:16px"></div><div style="font-size:22px;margin-top:8px">cortina</div></div>
    <div><div class="parede" style="height:110px;border-radius:16px"></div><div style="font-size:22px;margin-top:8px">parede acústica</div></div>
    <div><div style="height:110px;border-radius:16px;background:#12052e;display:flex;align-items:center;justify-content:center"><span class="na" style="font-size:44px">neon</span></div><div style="font-size:22px;margin-top:8px">letreiro</div></div>
    <div><div style="height:110px;border-radius:16px;background:#2b1463;display:flex;align-items:center;justify-content:center"><span class="pill" style="background:var(--ambar);color:var(--noite);font-size:24px">ECA, art. 42</span></div><div style="font-size:22px;margin-top:8px">selo da lei</div></div>
  </div>
  <div class="abs" style="left:0;right:0;bottom:0;height:150px;background:var(--ambar);color:var(--noite);padding:24px 60px">
    <div style="font-size:22px;font-weight:700;letter-spacing:.16em;text-transform:uppercase">Tom de voz</div>
    <div style="font-size:33px;font-weight:600;line-height:1.2;margin-top:6px">De estúdio pra você: animada, direta e próxima. Decisão, dedicação e consistência.</div></div>
`);

// ───────────── C1 · explicativo
const c1 = C.c1;
add('c1-1', `
  <div class="abs cortina" style="inset:0"></div>
  <div class="abs parede" style="left:520px;top:0;right:0;height:820px;border-radius:0 0 0 60px"></div>
  <img class="abs" src="${recorte('empolgada')}" style="left:400px;top:230px;width:640px">
  ${marca()}
  <div class="abs" style="left:60px;top:170px"><span class="pill" style="background:var(--noite);color:var(--lav)">Civil · explicado</span></div>
  <div class="abs" style="left:0;right:0;top:780px;bottom:0;background:var(--noite);border-radius:60px 60px 0 0;padding:70px 60px 0">
    <div class="n" style="font-size:132px;line-height:.98">Prescrição</div>
    <div class="na" style="font-size:132px;line-height:.98">x decadência</div>
    <div style="font-size:40px;font-weight:500;color:var(--lav);margin-top:26px">${esc(c1.sub)}</div>
  </div>
  ${pag('arrasta &rarr;')}
`);
add('c1-2', `
  <div class="abs" style="left:0;right:0;top:0;height:675px;background:var(--lav);color:var(--noite);padding:56px 60px 0">
    <div style="display:flex;justify-content:space-between;align-items:center"><div class="h" style="font-size:84px">${c1.itens[0].nome}</div><span class="pill" style="background:var(--noite);color:var(--lav)">${c1.itens[0].base}</span></div>
    <div style="font-size:52px;font-weight:700;line-height:1.15;margin-top:40px">${esc(c1.itens[0].txt)}</div>
    <div style="font-size:38px;font-weight:500;line-height:1.35;margin-top:20px;width:820px">${esc(c1.itens[0].det)}</div>
  </div>
  <div class="abs" style="left:0;right:0;top:675px;bottom:0;padding:90px 60px 0">
    <div style="display:flex;justify-content:space-between;align-items:center"><div class="h" style="font-size:84px;color:var(--ambar)">${c1.itens[1].nome}</div><span class="pill" style="background:var(--ambar);color:var(--noite)">${c1.itens[1].base}</span></div>
    <div style="font-size:46px;font-weight:700;line-height:1.15;margin-top:30px">${esc(c1.itens[1].txt)}</div>
    <div style="font-size:34px;font-weight:500;line-height:1.35;margin-top:20px;width:880px;color:var(--lav)">${esc(c1.itens[1].det)}</div>
  </div>
  <div class="abs" style="left:60px;right:60px;bottom:60px;background:#2b1463;border-radius:36px;padding:34px 40px">
    <div style="font-size:24px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--lav)">Em uma frase</div>
    <div class="n" style="font-size:50px;line-height:1.15;margin-top:12px">Na prescrição, some a pretensão. Na decadência, o próprio direito.</div>
  </div>
  <div class="abs" style="left:870px;top:612px;width:130px;height:130px;border-radius:50%;background:var(--noite);display:flex;align-items:center;justify-content:center"><span class="na" style="font-size:80px;line-height:1">x</span></div>
`);
add('c1-3', `
  <div class="abs parede" style="inset:0"></div>
  <img class="abs" src="${recorte('joinha')}" style="right:-60px;bottom:-140px;width:620px">
  <div class="abs" style="left:60px;top:150px;width:700px;background:var(--noite);border-radius:40px;padding:56px 50px 60px;box-shadow:0 30px 80px #3a0f0055">
    <div class="n" style="font-size:96px;line-height:1.02">Salva</div>
    <div class="n" style="font-size:96px;line-height:1.02">pra revisar</div>
    <div style="font-size:46px;font-weight:600;line-height:1.2;margin-top:30px">e manda pra quem vai fazer a <span style="color:var(--ambar)">OAB.</span></div>
  </div>
  <div class="abs" style="left:60px;bottom:60px"><span class="pill" style="background:var(--noite);color:var(--neon);font-size:32px;padding:18px 32px">${PERFIL.arroba}</span></div>
`);

// ───────────── C2 · lista
const c2 = C.c2;
add('c2-1', `
  <div class="abs" style="inset:0;background:var(--noite)"></div>
  <div class="abs ripa" style="left:0;right:0;bottom:0;height:300px"></div>
  <img class="abs" src="${recorte('joinha')}" style="right:-30px;bottom:-60px;width:600px">
  ${marca()}${tag('OAB · 2ª fase')}
  <div class="abs na" style="left:30px;top:110px;font-size:760px;line-height:1">4</div>
  <div class="abs" style="left:470px;top:200px;right:50px">
    <div class="h" style="font-size:80px">erros que derrubam a peça de <span style="color:var(--ambar)">Civil</span></div>
    <div style="font-size:40px;font-weight:500;color:var(--lav);margin-top:22px">${c2.sub}</div>
  </div>
  <div class="abs" style="left:60px;top:1030px"><span class="pill" style="background:var(--lav);color:var(--noite);font-size:32px;padding:18px 32px">arrasta pra ver &rarr;</span></div>
`);
add('c2-2', `
  <div class="abs cortina" style="inset:0"></div>
  <div class="abs" style="inset:0;background:#1c0a42b3"></div>
  <div class="abs h" style="left:60px;top:70px;font-size:76px">Os <span class="na">4</span> erros</div>
  <div class="abs" style="left:60px;right:60px;top:210px;display:flex;flex-direction:column;gap:22px">
    ${c2.itens.map((t, i) => `<div style="display:flex;align-items:center;gap:30px;background:${i % 2 ? 'var(--ambar)' : 'var(--lav)'};color:var(--noite);border-radius:999px;padding:22px 44px 22px 22px">
      <div style="width:130px;height:130px;flex:none;border-radius:50%;background:var(--noite);display:flex;align-items:center;justify-content:center"><span class="${i % 2 ? 'na' : 'n'}" style="font-size:80px;line-height:1">${i + 1}</span></div>
      <div style="font-size:42px;font-weight:700;line-height:1.12">${esc(t)}</div></div>`).join('')}
  </div>
  <div class="abs" style="left:60px;bottom:60px;display:flex;gap:16px;align-items:center"><span style="font-size:28px;color:var(--lav)">Base:</span><span class="pill" style="background:var(--noite);color:var(--ambar)">${c2.base}</span></div>
  ${pag('2/3', 'var(--neon)')}
`);
add('c2-3', `
  <div class="abs" style="inset:0;background:var(--lav)"></div>
  <img class="abs" src="${recorte('surpresa')}" style="left:-60px;bottom:-400px;width:680px">
  <div class="abs h" style="left:60px;top:100px;right:60px;font-size:112px;color:var(--noite)">Qual desses você <span style="color:var(--roxo)">já cometeu?</span></div>
  <div class="abs" style="left:520px;right:60px;top:610px;background:var(--noite);border-radius:36px;padding:44px 40px">
    <div class="n" style="font-size:64px;line-height:1.05">Conta nos comentários</div>
    <div style="margin-top:30px;background:#ffffff1a;border-radius:999px;padding:22px 28px;font-size:30px;color:var(--lav)">Adicione um comentário…</div>
  </div>
  <div class="abs" style="right:60px;bottom:60px;font-size:30px;font-weight:700;color:var(--noite)">${PERFIL.arroba}</div>
`);

// ───────────── C3 · questão (figurinha de quiz)
const c3 = C.c3;
const quiz = (resp) => `
  <div style="background:#fff;border-radius:40px;overflow:hidden;color:var(--noite);box-shadow:0 30px 80px #1c0a4266">
    <div style="background:var(--roxo);padding:30px 40px;display:flex;justify-content:space-between;align-items:center"><span class="n" style="font-size:54px">certo ou errado?</span><span style="font-size:26px;font-weight:700;color:var(--lav)">ECA · família</span></div>
    <div style="padding:34px 40px 40px">
      <div style="font-size:52px;font-weight:800;line-height:1.12;letter-spacing:-.01em">${esc(c3.pergunta)}</div>
      <div style="display:flex;flex-direction:column;gap:16px;margin-top:30px">
        ${c3.opcoes.map((o, i) => { const ok = resp && i === c3.certa; const off = resp && i !== c3.certa;
          return `<div style="border-radius:999px;padding:22px 32px;font-size:40px;font-weight:700;display:flex;justify-content:space-between;align-items:center;background:${ok ? 'var(--erro)' : '#efe9ff'};color:${ok ? '#fff' : 'var(--noite)'};opacity:${off ? .4 : 1}"><span>${o}</span>${ok ? '<span style="font-size:32px">resposta</span>' : ''}</div>`; }).join('')}
      </div>
    </div>
  </div>`;
add('c3-1', `
  <div class="abs parede" style="inset:0"></div>
  <img class="abs" src="${recorte('surpresa')}" style="right:50px;top:150px;width:520px">
  ${marca('var(--noite)', 'n')}
  <div class="abs" style="left:60px;top:200px;width:470px;background:var(--noite);border-radius:30px;padding:30px 34px">
    <div class="na" style="font-size:66px;line-height:1.05">Valendo!</div>
    <div style="font-size:30px;font-weight:500;color:var(--lav);margin-top:10px">Responde antes de arrastar.</div>
  </div>
  <div class="abs" style="left:60px;right:60px;top:610px">${quiz(false)}</div>
`);
add('c3-2', `
  <div class="abs" style="inset:0;background:var(--noite)"></div>
  ${marca()}${tag('Resposta')}
  <div class="abs" style="left:60px;right:60px;top:150px;display:flex;align-items:baseline;gap:24px"><span class="h" style="font-size:150px;color:var(--erro)">Errado.</span></div>
  <div class="abs" style="left:60px;right:60px;top:340px;font-size:46px;font-weight:600;line-height:1.28">A maioridade <span style="color:var(--ambar)">não encerra</span> a pensão sozinha: a exoneração depende de decisão judicial, com contraditório.</div>
  <div class="abs" style="left:60px;right:60px;top:720px;display:flex;gap:18px">
    ${c3.opcoes.map((o, i) => `<div style="flex:1;border-radius:999px;padding:26px;text-align:center;font-size:42px;font-weight:700;background:${i === c3.certa ? 'var(--erro)' : '#ffffff14'};color:#fff;opacity:${i === c3.certa ? 1 : .45}">${o}</div>`).join('')}
  </div>
  <div class="abs" style="left:60px;right:60px;top:900px;background:var(--lav);color:var(--noite);border-radius:36px;padding:40px 44px;display:flex;justify-content:space-between;align-items:center">
    <div><div style="font-size:26px;font-weight:700;letter-spacing:.12em;text-transform:uppercase">Fundamento</div><div class="h" style="font-size:66px;margin-top:10px">${c3.base}</div></div>
    <div style="width:130px;height:130px;border-radius:36px;background:var(--noite);display:flex;align-items:center;justify-content:center"><span class="na" style="font-size:76px;line-height:1">§</span></div>
  </div>
  ${arroba()}${pag('2/3')}
`);
add('c3-3', `
  <div class="abs cortina" style="inset:0"></div>
  <img class="abs" src="${recorte('joinha')}" style="left:240px;top:520px;width:860px">
  <div class="abs" style="left:60px;top:90px;right:60px">
    <div class="n" style="font-size:150px;line-height:1">Acertou?</div>
    <div style="font-size:52px;font-weight:700;line-height:1.15;margin-top:24px;width:820px">Comenta <span class="pill" style="background:var(--ambar);color:var(--noite);font-size:48px;padding:6px 28px">acertei</span> e marca quem precisa saber disso.</div>
  </div>
  <div class="abs" style="left:0;right:0;bottom:0;height:200px;background:var(--noite);display:flex;align-items:center;justify-content:space-between;padding:0 60px">
    <span class="n" style="font-size:56px">eduarda</span><span style="font-size:30px;font-weight:600;color:var(--lav)">${PERFIL.arroba}</span></div>
`);

// ───────────── C4 · mito ou verdade (letreiro duplo)
const c4 = C.c4;
add('c4-1', `
  <div class="abs" style="inset:0;background:var(--noite)"></div>
  <div class="abs ph" style="left:60px;top:150px;width:960px;height:700px;border-radius:40px;${ph('pensando', '40% 42%')}"></div>
  ${marca()}${tag('ECA · adoção', 'var(--lav)')}
  <div class="abs" style="left:60px;top:780px;background:var(--noite);border-radius:40px;padding:30px 44px 34px;display:flex;align-items:baseline;gap:30px">
    <span class="n" style="font-size:120px;line-height:1">mito</span><span style="font-size:48px;font-weight:600;color:var(--lav)">ou</span><span class="na" style="font-size:120px;line-height:1">verdade?</span></div>
  <div class="abs h" style="left:60px;top:1010px;font-size:120px">Adoção</div>
  <div class="abs" style="left:60px;top:1150px;font-size:38px;font-weight:500;color:var(--lav)">2 frases que todo mundo repete. Quais valem?</div>
  ${pag('arrasta &rarr;')}
`);
add('c4-2', `
  <div class="abs" style="inset:0;background:var(--noite)"></div>
  ${c4.itens.map((it, i) => `
  <div class="abs" style="left:${i ? 60 : 60}px;right:60px;top:${70 + i * 620}px;height:590px;border-radius:44px;padding:44px 48px;background:${it.v ? 'var(--lav)' : '#2b1463'};color:${it.v ? 'var(--noite)' : 'var(--neon)'}">
    <div style="display:flex;justify-content:space-between;align-items:center">
      <span class="pill" style="font-size:34px;padding:14px 34px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;background:${it.v ? 'var(--noite)' : 'var(--erro)'};color:${it.v ? 'var(--ambar)' : '#fff'}">${it.v ? 'Verdade' : 'Mito'}</span>
      <span style="font-size:28px;font-weight:700;opacity:.8">${it.base}</span></div>
    <div class="h" style="font-size:72px;line-height:1.05;margin-top:34px">${esc(it.frase)}</div>
    <div style="font-size:38px;font-weight:500;line-height:1.3;margin-top:28px;${it.v ? '' : 'color:var(--lav)'}">${esc(it.txt)}</div>
  </div>`).join('')}
`);
add('c4-3', `
  <div class="abs parede" style="inset:0"></div>
  <img class="abs" src="${recorte('empolgada')}" style="right:-80px;top:380px;width:640px">
  <div class="abs" style="left:60px;top:120px;width:620px;background:var(--noite);border-radius:40px;padding:50px 46px">
    <div class="h" style="font-size:72px">Quer mais mito ou verdade de <span style="color:var(--ambar)">ECA?</span></div>
    <div style="font-size:40px;font-weight:500;margin-top:30px;color:var(--lav)">Comenta a palavra:</div>
    <div class="na" style="font-size:170px;line-height:1;margin-top:10px">ECA</div>
  </div>
  <div class="abs" style="left:0;right:0;bottom:0;height:240px;background:var(--noite);display:flex;align-items:center;padding:0 60px;justify-content:space-between">
    <span class="n" style="font-size:56px">eduarda</span><span style="font-size:30px;font-weight:600;color:var(--lav)">${PERFIL.arroba}</span></div>
`);

// ───────────── C5 · apresentação
const c5 = C.c5;
add('c5-1', `
  <div class="abs ph" style="inset:0;background-size:auto 2000px;${ph('falando-neon', '60% 66%')}"></div>
  <div class="abs" style="left:0;right:0;bottom:0;height:500px;background:var(--noite);border-radius:60px 60px 0 0;padding:60px 60px 0">
    <div style="display:flex;align-items:baseline;gap:30px"><span class="h" style="font-size:120px">Prazer,</span><span class="n" style="font-size:140px;line-height:1">Eduarda</span></div>
    <div style="font-size:40px;font-weight:500;line-height:1.3;margin-top:30px;color:var(--lav);width:900px">${esc(c5.sub)}</div>
  </div>
  ${marca()}
  ${pag('arrasta &rarr;')}
`);
add('c5-2', `
  <div class="abs" style="inset:0;background:var(--noite)"></div>
  <div class="abs h" style="left:60px;top:70px;font-size:78px">Aqui você <span class="n" style="font-weight:400">encontra</span></div>
  <div class="abs" style="left:60px;right:60px;top:210px;bottom:60px;display:grid;grid-template-columns:1fr 1fr;gap:22px">
    ${c5.itens.map((t, i) => { const bg = ['var(--lav)', 'var(--ambar)', '', '#2b1463'][i]; const cor = i < 2 ? 'var(--noite)' : 'var(--neon)';
      return `<div class="${i === 2 ? 'cortina' : ''}" style="border-radius:40px;padding:40px 40px;${bg ? `background:${bg};` : ''}color:${cor};display:flex;flex-direction:column;justify-content:space-between">
        <span class="${i === 1 ? 'n' : 'na'}" style="font-size:120px;line-height:1;${i < 2 ? 'color:#fff;' : ''}">${i + 1}</span>
        <span class="h" style="font-size:54px;line-height:1.08">${esc(t)}</span></div>`; }).join('')}
  </div>
`);
add('c5-3', `
  <div class="abs parede" style="inset:0"></div>
  <img class="abs" src="${recorte('empolgada')}" style="left:-40px;top:280px;width:700px">
  <div class="abs" style="left:0;right:0;bottom:0;height:520px;background:var(--noite);border-radius:60px 60px 0 0;padding:64px 60px 0">
    <div class="h" style="font-size:88px">Me segue pra estudar</div>
    <div class="n" style="font-size:130px;line-height:1.1">Civil comigo.</div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:30px">
      <span style="font-size:36px;font-weight:600;color:var(--lav)">${PERFIL.arroba}</span>
      <span class="pill" style="background:var(--ambar);color:var(--noite);font-size:32px;padding:16px 40px">Seguir</span></div>
  </div>
  <div class="abs" style="right:60px;top:120px;width:400px;background:var(--noite);border-radius:30px;padding:30px 32px">
    <div class="na" style="font-size:44px;line-height:1.15">Decisão Dedicação Consistência</div>
    <div style="font-size:26px;color:var(--lav);margin-top:14px">o neon do estúdio</div></div>
`);

// ───────────── Posts
add('p1', `
  <div class="abs" style="inset:0;background:var(--noite)"></div>
  ${marca()}
  <div class="abs" style="left:60px;right:60px;top:300px;text-align:center">
    <div class="n" style="font-size:132px;line-height:1.08">Peça boa não se decora.</div>
    <div class="na" style="font-size:180px;line-height:1.1;margin-top:60px">Se entende.</div>
  </div>
  <div class="abs ripa" style="left:0;right:0;bottom:0;height:200px"></div>
  <div class="abs" style="left:60px;bottom:64px;font-size:32px;font-weight:600">${PERFIL.arroba}</div>
`);
const p2 = C.p2;
add('p2', `
  <div class="abs parede" style="inset:0"></div>
  <img class="abs" src="${recorte('surpresa')}" style="left:-30px;top:520px;width:640px">
  <div class="abs" style="left:60px;right:60px;top:90px;background:var(--noite);border-radius:44px;padding:50px 50px 54px">
    <div class="h" style="font-size:96px">Qual tema de Civil mais <span class="n" style="font-weight:400">te trava?</span></div>
  </div>
  <div class="abs" style="left:520px;right:60px;top:720px;background:#fff;color:var(--noite);border-radius:40px;padding:40px">
    <div style="font-size:40px;font-weight:700;line-height:1.2">${esc(p2.txt)}</div>
    <div style="margin-top:28px;background:#efe9ff;border-radius:999px;padding:20px 26px;font-size:28px;color:#6b5aa6">Adicione um comentário…</div>
  </div>
  <div class="abs" style="right:60px;bottom:60px"><span class="pill" style="background:var(--noite);color:var(--neon);font-size:30px">${PERFIL.arroba}</span></div>
`);
const p3 = C.p3;
add('p3', `
  <div class="abs" style="inset:0;background:var(--noite)"></div>
  ${marca()}${tag('Dica · sucessões', 'var(--lav)')}
  <div class="abs h" style="left:60px;top:170px;right:60px;font-size:88px">Ordem da vocação <span class="na" style="font-weight:400">hereditária</span></div>
  <div class="abs" style="left:60px;right:60px;top:420px;display:flex;flex-direction:column;gap:18px">
    ${p3.itens.map((t, i) => `<div style="margin-left:${i * 40}px;display:flex;align-items:center;gap:26px;border-radius:32px;padding:24px 30px;background:${i ? '#2b1463' : 'var(--lav)'};color:${i ? 'var(--neon)' : 'var(--noite)'}">
      <span class="${i ? 'na' : 'n'}" style="font-size:76px;line-height:1;width:90px;flex:none">${i + 1}º</span>
      <span style="font-size:35px;font-weight:600;line-height:1.25">${esc(t)}</span></div>`).join('')}
  </div>
  <div class="abs" style="left:60px;bottom:60px;display:flex;gap:16px;align-items:center"><span style="font-size:28px;color:var(--lav)">Base:</span><span class="pill" style="background:var(--ambar);color:var(--noite)">${p3.base}</span></div>
  <div class="abs" style="right:60px;bottom:66px;font-size:28px;color:var(--lav);width:380px;text-align:right">uma classe exclui a seguinte</div>
`);

// ───────────── Stories
add('s1', `
  <div class="abs cortina" style="inset:0"></div>
  ${marca()}
  <div class="abs n" style="left:60px;right:60px;top:180px;text-align:center;font-size:110px;line-height:1">caixinha aberta</div>
  <img class="abs" src="${recorte('joinha')}" style="left:60px;top:380px;width:1000px">
  <div class="abs" style="left:90px;right:90px;top:1260px;background:#fff;border-radius:44px;overflow:hidden;color:var(--noite);box-shadow:0 30px 80px #0006">
    <div style="background:var(--roxo);padding:40px 44px;text-align:center"><div style="font-size:58px;font-weight:800;line-height:1.1;color:#fff">Me pergunta qualquer coisa sobre <span class="na" style="font-weight:400">ECA</span></div></div>
    <div style="padding:34px 44px 40px"><div style="background:#efe9ff;border-radius:24px;padding:30px;text-align:center;font-size:34px;color:#6b5aa6">Digite sua pergunta</div></div>
  </div>
  <div class="abs" style="left:0;right:0;bottom:110px;text-align:center;font-size:32px;font-weight:600">${PERFIL.arroba}</div>
`, 1080, 1920);
add('s2', `
  <div class="abs" style="inset:0;background:var(--lav)"></div>
  ${marca('var(--noite)')}
  <div class="abs" style="left:60px;right:60px;top:170px;background:var(--noite);border-radius:44px;padding:40px 44px">
    <div class="n" style="font-size:118px;line-height:1">post novo</div>
    <div style="font-size:46px;font-weight:700;margin-top:10px;color:var(--ambar)">no feed</div>
  </div>
  <div class="abs" style="left:180px;top:560px;width:720px;height:900px;border-radius:28px;overflow:hidden;box-shadow:0 30px 80px #1c0a4277">
    <div class="abs cortina" style="inset:0"></div>
    <div class="abs parede" style="left:346px;top:0;right:0;height:547px;border-radius:0 0 0 40px"></div>
    <img class="abs" src="${recorte('empolgada')}" style="left:266px;top:153px;width:427px">
    <div class="abs" style="left:0;right:0;top:520px;bottom:0;background:var(--noite);border-radius:40px 40px 0 0;padding:46px 40px 0">
      <div class="n" style="font-size:86px;line-height:.98">Prescrição</div>
      <div class="na" style="font-size:86px;line-height:.98">x decadência</div>
      <div style="font-size:30px;color:var(--lav);margin-top:18px">${esc(c1.sub)}</div>
    </div>
  </div>
  <div class="abs" style="left:240px;right:240px;top:1540px;text-align:center"><span class="pill" style="background:var(--noite);color:#fff;font-size:38px;padding:24px 50px">toca pra ver</span></div>
`, 1080, 1920);

// ───────────── Destaques e avatar
const dest = [['Civil', 'civil', 'var(--roxo)', 'n'], ['ECA', 'eca', 'var(--noite)', 'na'], ['OAB', 'oab', 'var(--lar)', 'n'], ['Dicas', 'dicas', 'var(--noite)', 'n'], ['Sobre', 'oi!', 'var(--roxo)', 'na']];
add('destaques', `
  <div class="abs" style="inset:0;background:#12052e"></div>
  <div class="abs" style="left:60px;top:60px;display:flex;align-items:baseline;gap:14px"><span class="n" style="font-size:46px">eduarda</span><span style="font-size:24px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--lav)">capas de destaque</span></div>
  <div class="abs" style="left:0;right:0;top:210px;display:flex;flex-wrap:wrap;justify-content:center;gap:60px 70px;padding:0 90px">
    ${dest.map(([n, g, bg, cl]) => `<div style="display:flex;flex-direction:column;align-items:center;gap:22px">
      <div class="${bg === 'var(--lar)' ? 'parede' : ''}" style="width:250px;height:250px;border-radius:50%;${bg === 'var(--lar)' ? '' : `background:${bg};`}display:flex;align-items:center;justify-content:center;overflow:hidden">
        <span class="${cl}" style="font-size:${g.length > 4 ? 72 : 88}px;line-height:1">${g}</span></div>
      <div style="font-size:32px;font-weight:600">${n}</div></div>`).join('')}
  </div>
`, 1080, 1080);
add('avatar', `
  <div class="abs parede" style="inset:0"></div>
  <div class="abs cortina" style="left:0;top:0;width:300px;bottom:0"></div>
  <img class="abs" src="${recorte('empolgada')}" style="left:-110px;top:100px;width:1150px">
`, 1080, 1080);

await render(ID, P, { fontes, css });
