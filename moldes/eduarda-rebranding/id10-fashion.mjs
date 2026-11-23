// id10 · Revista Fashion: o feed da Eduarda como uma revista de moda. Preto e branco de alto contraste,
// fotos em P&B, masthead "EDUARDA" em didone enorme (Bodoni Moda) atrás da cabeça dela, chamadas laterais
// em Jost e um único acento: o pink #E6007E (o rosa que já é dela; deixa o vermelho livre e o "errado" vira um X preto).
import fs from 'node:fs';
import { render, CONTEUDO as C, PERFIL, foto as fotoUrl, recorte as recorteUrl, esc } from './base.mjs';
// A página é montada com setContent (about:blank), que não lê file://: as fotos vão embutidas em data URI.
const dataUri = (u, tipo) => `data:${tipo};base64,${fs.readFileSync(new URL(u)).toString('base64')}`;
const foto = n => dataUri(fotoUrl(n), 'image/jpeg');
const recorte = n => dataUri(recorteUrl(n), 'image/png');

const ID = 'id10-fashion';
const fontes = 'https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Jost:wght@300;400;500;600&display=swap';
const P = { k: '#0B0B0B', w: '#FFFFFF', papel: '#F2EFEA', cinza: '#6E6E6E', pink: '#E6007E' };

const css = `
:root{--k:${P.k};--w:${P.w};--papel:${P.papel};--cinza:${P.cinza};--pink:${P.pink}}
body{background:#fff;color:var(--k);font-family:Jost,sans-serif}
.pg{position:relative;width:1080px;height:1350px;overflow:hidden;background:#fff}
.bk{background:var(--k);color:#fff}
.b{font-family:'Bodoni Moda',serif;font-optical-sizing:auto;line-height:.98;letter-spacing:-.01em}
.i{font-style:italic}
.mast{font-family:'Bodoni Moda',serif;font-weight:600;font-optical-sizing:auto;line-height:.8;letter-spacing:-.02em;width:max-content;white-space:nowrap}
.k{font-family:Jost;font-weight:500;font-size:28px;letter-spacing:.22em;text-transform:uppercase}
.pk{color:var(--pink)}
.t{font-family:Jost;font-weight:400;font-size:34px;line-height:1.4}
.gray{filter:grayscale(1) contrast(1.12) brightness(1.02)}
.ph{background-repeat:no-repeat}
.folio{position:absolute;left:56px;right:56px;bottom:40px;display:flex;justify-content:space-between;font-family:Jost;font-weight:500;font-size:24px;letter-spacing:.2em;text-transform:uppercase}
.xm{display:inline-flex;align-items:center;justify-content:center;background:var(--k);flex:none}
.stamp{position:absolute;border-radius:50%;background:var(--pink);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
`;
const FIT = `<script>document.fonts.ready.then(()=>{document.querySelectorAll('[data-fit]').forEach(e=>{const w=+e.dataset.fit;let f=parseFloat(getComputedStyle(e).fontSize);for(let i=0;i<4;i++){f=f*w/e.scrollWidth;e.style.fontSize=f+'px'}})})</script>`;

const mast = (w, extra = '', txt = 'EDUARDA') => `<div class="mast" data-fit="${w}" style="font-size:200px;${extra}">${txt}</div>`;
const xmark = (s = 72, cor = '#fff', bg = 'var(--k)') => `<span class="xm" style="width:${s}px;height:${s}px;background:${bg}"><svg width="${s * .5}" height="${s * .5}" viewBox="0 0 10 10"><path d="M1 1l8 8M9 1L1 9" stroke="${cor}" stroke-width="1.6"/></svg></span>`;
const folio = (pag, cor = 'var(--k)') => `<div class="folio" style="color:${cor}"><span>Eduarda · Civil &amp; ECA</span><span>${pag}</span></div>`;
const bgf = (n, size, pos) => `background-image:url('${foto(n)}');background-size:${size};background-position:${pos}`;
const pg = (inner, cls = '', st = '') => `<div class="pg ${cls}" style="${st}">${inner}</div>${FIT}`;

// ---------- C1 · explicativo (capa: foto sangrada) ----------
const c1 = C.c1;
const c1_1 = pg(`<div class="ph gray" style="position:absolute;inset:0;${bgf('joinha', '100% auto', '50% 36%')}"></div>
  <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.35) 0%,rgba(0,0,0,0) 26%,rgba(0,0,0,0) 46%,rgba(0,0,0,.88) 78%)"></div>
  <div style="position:absolute;left:40px;top:44px;color:#fff">${mast(1000)}</div>
  <div style="position:absolute;left:46px;top:262px;color:#fff;display:flex;gap:28px" class="k"><span>Nº 01</span><span class="pk" style="color:#fff">Edição OAB 2ª fase</span></div>
  <div style="position:absolute;left:56px;right:56px;bottom:96px;color:#fff">
    <div class="k pk">Direito Civil</div>
    <div class="b" style="font-size:132px;font-weight:500;margin-top:20px">Prescrição</div>
    <div class="b i" style="font-size:132px;font-weight:400"><span class="pk">x</span> decadência</div>
    <div class="t" style="font-size:36px;margin-top:22px;font-weight:300">${esc(c1.sub)}</div>
  </div>${folio('1/3', '#fff')}`);

const sec = (it, n) => `<div style="display:flex;gap:36px">
  <div class="b pk" style="font-size:130px;font-weight:500;width:150px;flex:none;line-height:.85">${n}</div>
  <div><div class="b" style="font-size:100px;font-weight:600">${esc(it.nome)}</div>
  <div class="b i" style="font-size:52px;line-height:1.18;margin-top:22px">${esc(it.txt)}</div>
  <div class="t" style="margin-top:22px;font-size:37px">${esc(it.det)}</div>
  <div class="k pk" style="margin-top:20px;font-size:26px">${esc(it.base)}</div></div></div>`;
const c1_2 = pg(`<div style="position:absolute;inset:64px 64px 100px;display:flex;flex-direction:column;gap:72px">
  <div><div class="k pk">O guia</div><div class="b i" style="font-size:64px;margin-top:14px">Prescrição x decadência</div></div>
  ${sec(c1.itens[0], 'I')}${sec(c1.itens[1], 'II')}</div>${folio('2/3')}`);

const c1_3 = pg(`<div class="b pk" style="position:absolute;left:44px;top:30px;font-size:360px;line-height:1">“</div>
  <div style="position:absolute;left:64px;right:64px;top:330px">
    <div class="b i" style="font-size:96px;line-height:1.06">Salva pra revisar e manda pra quem vai fazer a OAB.</div>
    <div style="display:flex;flex-direction:column;gap:14px;margin-top:70px">
      <div class="t" style="font-weight:300"><b style="font-weight:500">Prescrição:</b> perde a pretensão.</div>
      <div class="t" style="font-weight:300"><b style="font-weight:500">Decadência:</b> perde o próprio direito.</div></div>
    <div class="b i pk" style="font-size:52px;margin-top:70px">Eduarda Caraciolo</div>
  </div>${folio('3/3', '#fff')}`, 'bk');

// ---------- C2 · lista (capa: numeral gigante + recorte) ----------
const c2 = C.c2;
const LBL = ['Endereçamento', 'Qualificação', 'Pedido', 'Valor da causa'];
const c2_1 = pg(`<div style="position:absolute;left:40px;top:44px">${mast(1000)}</div>
  <div class="b pk" style="position:absolute;left:-20px;top:190px;font-size:1000px;font-weight:900;font-variation-settings:'opsz' 18;line-height:1">4</div>
  <img class="gray" src="${recorte('surpresa')}" style="position:absolute;left:250px;top:227px;width:820px">
  <div style="position:absolute;left:0;right:0;bottom:0;height:400px;background:#fff;padding:44px 56px 0">
    <div style="display:flex;justify-content:space-between"><div class="k pk">${esc(c2.sub)}</div><div class="k">Especial peça prática</div></div>
    <div class="b" style="font-size:100px;font-weight:500;margin-top:18px"><span class="i">erros</span> que derrubam a peça de Civil</div>
  </div>
  `);

const c2_2 = pg(`<div style="position:absolute;inset:64px 64px 100px;display:flex;flex-direction:column">
  <div class="k pk">Sumário</div><div class="b i" style="font-size:100px;margin-top:10px">Os 4 erros</div>
  <div style="display:flex;flex-direction:column;justify-content:space-around;flex:1;margin-top:20px">
  ${c2.itens.map((t, i) => `<div style="display:flex;gap:40px;align-items:center">
    <div class="b pk" style="font-size:140px;font-weight:500;width:190px;flex:none">0${i + 1}</div>
    <div><div class="k" style="color:var(--cinza);font-size:26px">${LBL[i]}</div><div class="b" style="font-size:52px;line-height:1.1;margin-top:10px">${esc(t)}</div></div></div>`).join('')}
  </div></div>${folio('2/3')}`);

const c2_3 = pg(`<div style="position:absolute;inset:80px 64px 100px;display:flex;flex-direction:column">
  <div class="k pk">Sua vez</div>
  <div class="b" style="font-size:136px;font-weight:500;margin-top:24px">Qual desses você já cometeu?</div>
  <div class="b i pk" style="font-size:84px;margin-top:30px">Conta nos comentários.</div>
  <div style="display:flex;gap:22px;margin-top:auto">${LBL.map((l, i) => `<div style="flex:1"><div class="b" style="width:120px;height:120px;border-radius:50%;background:var(--k);color:#fff;display:flex;align-items:center;justify-content:center;font-size:64px">${i + 1}</div><div style="font-size:28px;font-weight:500;margin-top:16px;line-height:1.2">${l}</div></div>`).join('')}</div>
  <div class="k" style="margin-top:56px;font-size:26px;color:var(--cinza)">${esc(c2.base)}</div>
  </div>${folio('3/3')}`, '', `background:${P.papel}`);

// ---------- C3 · questão (capa: entrevista em tela dividida) ----------
const c3 = C.c3;
const c3_1 = pg(`<div class="ph gray" style="position:absolute;right:0;top:0;width:500px;height:1350px;${bgf('pensando', 'auto 150%', '29% 55%')}"></div>
  <div style="position:absolute;left:0;top:0;width:580px;height:1350px;padding:56px 48px 56px 56px;display:flex;flex-direction:column">
    ${mast(476)}
    <div class="k pk" style="margin-top:60px">Certo ou errado?</div>
    <div class="b i" style="font-size:58px;line-height:1.1;margin-top:28px">${esc(c3.pergunta)}</div>
    <div style="margin-top:auto;display:flex;align-items:baseline;gap:22px"><span class="k" style="font-size:34px">Certo</span><span class="b i pk" style="font-size:52px">ou</span><span class="k" style="font-size:34px">Errado</span></div>
    <div style="font-size:28px;font-weight:300;margin-top:22px;opacity:.8">Resposta no próximo slide</div>
  </div>`, 'bk');

const c3_2 = pg(`<div style="position:absolute;inset:64px 64px 100px;display:flex;flex-direction:column">
  <div style="display:flex;gap:28px"><div class="b pk" style="font-size:96px;width:110px;flex:none">P.</div><div class="b i" style="font-size:50px;line-height:1.15;padding-top:14px">${esc(c3.pergunta)}</div></div>
  <div style="display:flex;gap:28px;margin-top:54px"><div class="b pk" style="font-size:96px;width:110px;flex:none">R.</div>
  <div><div style="display:flex;align-items:center;gap:30px">${xmark(120)}<div class="b" style="font-size:190px;font-weight:600;line-height:.9">Errado.</div></div>
    <div class="t" style="font-size:40px;margin-top:40px">A maioridade não encerra a pensão sozinha: a exoneração depende de <b style="font-weight:600">decisão judicial</b>, com contraditório.</div>
    <div class="k pk" style="margin-top:34px">${esc(c3.base)}</div>
    <div class="b i" style="font-size:36px;line-height:1.3;margin-top:18px;color:#333">“O cancelamento de pensão alimentícia de filho que atingiu a maioridade está sujeito à decisão judicial, mediante contraditório, ainda que nos próprios autos.”</div>
  </div></div></div>${folio('2/3')}`);

const c3_3 = pg(`<div class="ph gray" style="position:absolute;inset:0;${bgf('explicando', '112% auto', '0% 30%')}"></div>
  <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 40%,rgba(0,0,0,.9) 80%)"></div>
  <div style="position:absolute;left:56px;right:56px;bottom:100px;color:#fff">
    <div class="b i" style="font-size:190px;font-weight:500">Acertou?</div>
    <div class="t" style="font-size:42px;margin-top:26px;font-weight:300">Comenta <b class="pk" style="font-weight:500">“acertei”</b> e marca quem precisa saber disso.</div>
  </div>${folio('3/3', '#fff')}`);

// ---------- C4 · mito ou verdade (capa: tipográfica dividida) ----------
const c4 = C.c4;
const c4_1 = pg(`<div class="bk" style="position:absolute;left:0;right:0;top:0;height:675px"></div>
  <div style="position:absolute;left:56px;top:60px;color:#fff"><div class="k pk">ECA · Adoção</div><div class="b i" style="font-size:140px;margin-top:18px">Adoção:</div></div>
  <div style="position:absolute;left:40px;bottom:712px;color:#fff">${mast(800, '', 'MITO')}</div>
  <div style="position:absolute;left:40px;top:718px">${mast(1000, '', 'VERDADE')}</div>
  <div class="stamp" style="width:180px;height:180px;right:56px;top:470px"><span class="b i" style="font-size:100px;line-height:.8">ou</span></div>
  <div style="position:absolute;left:56px;right:56px;bottom:56px;display:flex;justify-content:space-between;align-items:flex-end">
    <div class="b i" style="font-size:64px;line-height:1.08">2 frases que todo<br>mundo repete.</div><div class="k" style="text-align:right">Arrasta<br>e confere</div></div>`);

const c4_2 = pg(`<div style="position:absolute;left:0;right:0;top:0;height:675px;padding:60px 64px">
    <div style="display:flex;align-items:baseline;gap:24px"><div class="b pk" style="font-size:180px;font-weight:600;line-height:.8">IN</div><div class="k">Verdade</div></div>
    <div class="b" style="font-size:66px;font-weight:500;margin-top:34px">${esc(c4.itens[0].frase)}</div>
    <div class="t" style="margin-top:20px">${esc(c4.itens[0].txt)}</div>
    <div class="k pk" style="margin-top:20px;font-size:26px">${esc(c4.itens[0].base)}</div></div>
  <div class="bk" style="position:absolute;left:0;right:0;bottom:0;height:675px;padding:60px 64px">
    <div style="display:flex;align-items:center;gap:24px"><div class="b" style="font-size:180px;font-weight:600;line-height:.8">OUT</div>${xmark(90, P.k, '#fff')}<div class="k">Mito</div></div>
    <div class="b" style="font-size:66px;font-weight:500;margin-top:34px"><s style="text-decoration-thickness:4px">${esc(c4.itens[1].frase)}</s></div>
    <div class="t" style="margin-top:20px;font-weight:300">${esc(c4.itens[1].txt)}</div>
    <div class="k pk" style="margin-top:20px;font-size:26px">${esc(c4.itens[1].base)}</div></div>
  ${folio('2/3', '#fff')}`);

const c4_3 = pg(`<div style="position:absolute;inset:80px 64px 100px;display:flex;flex-direction:column">
  <div class="k" style="color:#fff">Próxima edição</div>
  <div class="b" style="font-size:118px;font-weight:500;margin-top:30px">Quer mais mito ou verdade de ECA?</div>
  <div style="margin-top:auto;color:#fff"><div class="k">Comenta</div><div class="b i" style="font-size:300px;line-height:.9;margin-top:10px">“ECA”</div></div>
  </div>${folio('3/3')}`, '', `background:${P.pink}`);

// ---------- C5 · apresentação (capa: masthead atrás da cabeça) ----------
const c5 = C.c5;
const c5_1 = pg(`<div style="position:absolute;left:40px;top:50px">${mast(1000)}</div>
  <img class="gray" src="${recorte('empolgada')}" style="position:absolute;left:60px;top:120px;width:900px">
  <div class="k" style="position:absolute;left:56px;top:300px;color:var(--cinza)">Nº 01 · Perfil</div>
  <div style="position:absolute;left:56px;top:370px;width:250px;display:flex;flex-direction:column;gap:30px">
    <div class="b i" style="font-size:44px;line-height:1.05"><span class="pk">Dicas</span> de peça pra 2ª fase</div>
    <div class="b i" style="font-size:44px;line-height:1.05"><span class="pk">Questões</span> comentadas</div></div>
  <div style="position:absolute;right:46px;top:370px;width:230px;display:flex;flex-direction:column;gap:30px;text-align:right">
    <div class="b i" style="font-size:44px;line-height:1.05"><span class="pk">ECA</span> sem juridiquês</div>
    <div class="b i" style="font-size:44px;line-height:1.05"><span class="pk">Bastidores</span> das aulas</div></div>
  <div style="position:absolute;left:0;right:0;bottom:0;height:450px;background:#fff;padding:40px 56px 0">
    <div class="b i pk" style="font-size:118px;font-weight:500">Prazer, Eduarda</div>
    <div class="t" style="margin-top:26px;font-size:38px">${esc(c5.sub)}</div></div>`);

const c5_2 = pg(`<div class="ph gray" style="position:absolute;left:0;top:0;width:540px;height:1350px;${bgf('empolgada', 'auto 140%', '53% 45%')}"></div>
  <div style="position:absolute;left:600px;right:56px;top:70px;bottom:110px;display:flex;flex-direction:column">
    <div class="k pk">Nesta edição</div>
    <div class="b i" style="font-size:76px;margin-top:16px;line-height:1.02">O que você encontra aqui</div>
    <div style="display:flex;flex-direction:column;justify-content:space-around;flex:1;margin-top:20px">
    ${c5.itens.map((t, i) => `<div><div class="b pk" style="font-size:72px;font-weight:500">0${i + 1}</div><div class="b" style="font-size:44px;line-height:1.1;margin-top:6px">${esc(t)}</div></div>`).join('')}</div>
  </div>${folio('2/3').replace('left:56px', 'left:600px')}`);

const c5_3 = pg(`<div style="position:absolute;left:0;right:0;top:110px;display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 70px">
    <div class="ph gray" style="width:360px;height:360px;border-radius:50%;${bgf('empolgada', '300% auto', '53% 36%')}"></div>
    <div class="k pk" style="margin-top:56px">Assine</div>
    <div class="b i" style="font-size:104px;line-height:1.04;margin-top:26px">Me segue pra estudar Civil comigo.</div>
    <div style="margin-top:60px;background:#fff;color:var(--k);border-radius:999px;padding:30px 120px" class="k">Seguir</div>
    <div style="font-size:36px;font-weight:300;margin-top:34px">${esc(PERFIL.arroba)}</div>
  </div>${folio('3/3', '#fff')}`, 'bk');

// ---------- Posts únicos ----------
const p1 = pg(`<div style="position:absolute;left:40px;top:50px">${mast(1000)}</div>
  <div style="position:absolute;left:64px;right:64px;top:380px">
    <div class="b" style="font-size:150px;font-weight:500;line-height:.98">Peça boa não se decora.</div>
    <div class="b i pk" style="font-size:190px;margin-top:40px">Se entende.</div></div>
  ${folio('Frase da edição')}`);

const p2 = pg(`<img class="gray" src="${recorte('surpresa')}" style="position:absolute;right:-70px;top:820px;width:600px">
  <div style="position:absolute;left:64px;right:64px;top:80px">
    <div class="k pk">Cartas da leitora</div>
    <div class="b" style="font-size:128px;font-weight:500;margin-top:26px">Qual tema de Civil mais te trava?</div>
    <div class="t" style="font-weight:300;margin-top:44px;font-size:40px;max-width:560px">Comenta aqui embaixo.</div>
    <div class="b i pk" style="font-size:64px;line-height:1.08;margin-top:26px;max-width:520px">O mais pedido vira o próximo post.</div></div>
  ${folio('').replace('<span></span>', '')}`, 'bk');

const p3c = C.p3;
const p3 = pg(`<div style="position:absolute;inset:64px 64px 100px;display:flex;flex-direction:column">
  <div class="k pk">A lista · Sucessões</div>
  <div class="b" style="font-size:96px;font-weight:500;margin-top:18px">Ordem da <span class="i">vocação hereditária</span></div>
  <div style="display:flex;flex-direction:column;justify-content:space-around;flex:1;margin-top:20px">
  ${p3c.itens.map((t, i) => { const [a, b] = t.split(' ('); return `<div style="display:flex;gap:36px;align-items:center">
    <div class="b pk" style="font-size:120px;font-weight:500;width:110px;flex:none;text-align:center">${i + 1}</div>
    <div><div class="b" style="font-size:50px;line-height:1.1">${esc(a)}</div>${b ? `<div class="t" style="font-size:30px;color:var(--cinza);margin-top:8px">${esc(b.replace(/\)$/, ''))}</div>` : ''}</div></div>`; }).join('')}
  </div><div class="k pk" style="font-size:26px">${esc(p3c.base)}</div></div>${folio('Guia de bolso')}`);

// ---------- Stories ----------
const s1 = pg(`<div style="position:absolute;left:40px;top:210px">${mast(1000)}</div>
  <img class="gray" src="${recorte('empolgada')}" style="position:absolute;left:60px;top:242px;width:920px">
  <div class="bk" style="position:absolute;left:56px;right:56px;top:1060px;padding:56px 52px">
    <div class="k pk">Caixinha de perguntas</div>
    <div class="b i" style="font-size:88px;line-height:1.04;margin-top:24px">Me pergunta qualquer coisa sobre ECA</div>
    <div style="background:#fff;color:var(--cinza);font-size:34px;padding:34px 36px;margin-top:44px">Escreva aqui sua dúvida…</div></div>
  <div class="k" style="position:absolute;left:56px;right:56px;top:1640px;text-align:center;color:var(--cinza)">${esc(PERFIL.arroba)}</div>`, '', 'height:1920px');

const s2 = pg(`<div style="position:absolute;left:56px;right:56px;top:170px;text-align:center">
    <div class="k pk">Nova edição</div><div class="b" style="font-size:120px;font-weight:500;margin-top:20px">Post novo <span class="i">no feed</span></div></div>
  <div style="position:absolute;left:162px;top:520px;width:756px;height:945px;overflow:hidden"><div style="transform:scale(.7);transform-origin:0 0">${c1_1.replace(FIT, '')}</div></div>
  <div style="position:absolute;left:56px;right:56px;top:1510px;text-align:center"><div class="b i pk" style="font-size:64px">Prescrição x decadência</div>
  <div class="k" style="margin-top:26px">Toca no post pra ler</div></div>`, 'bk', 'height:1920px');

// ---------- Destaques e avatar ----------
const DC = ['var(--k)', 'var(--pink)', 'var(--k)', 'var(--pink)', 'var(--k)'];
const bola = i => `<div style="width:290px;height:290px;border-radius:50%;background:${DC[i]};display:flex;align-items:center;justify-content:center;color:#fff">
  <div class="b i" data-fit="${C.destaques[i].length > 3 ? 210 : 180}" style="font-size:80px;width:max-content;font-weight:500">${C.destaques[i]}</div></div>`;
const destaques = pg(`<div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;gap:60px">
  <div style="display:flex;justify-content:center;gap:60px">${[0, 1, 2].map(bola).join('')}</div>
  <div style="display:flex;justify-content:center;gap:60px">${[3, 4].map(bola).join('')}</div></div>`, '', `height:1080px;background:${P.papel}`);

const avatar = pg(`<div style="position:absolute;left:0;right:0;top:120px;display:flex;justify-content:center;color:#fff">${mast(900, '', 'EC')}</div>
  <img class="gray" src="${recorte('empolgada')}" style="position:absolute;left:-75px;top:200px;width:1100px">`, '', `height:1080px;background:${P.pink}`);

// ---------- 00 · identidade ----------
const sw = (n, hex, borda) => `<div style="flex:1"><div style="height:150px;background:${hex};${borda ? 'box-shadow:inset 0 0 0 2px #ddd' : ''}"></div><div style="font-size:26px;font-weight:500;margin-top:12px;line-height:1.25">${n}<br><span style="color:var(--cinza);font-weight:400">${hex}</span></div></div>`;
const ident = pg(`<div style="position:absolute;inset:48px 56px 48px;display:flex;flex-direction:column;gap:40px">
  <div>${mast(968)}<div style="display:flex;justify-content:space-between;align-items:center;margin-top:22px">
    <div class="k">Revista Fashion · Projeto 10</div>
    <div style="width:110px;height:110px;border-radius:50%;background:var(--k);color:#fff;display:flex;align-items:center;justify-content:center" class="b"><span style="font-size:52px;font-weight:600;letter-spacing:-.04em">E<span class="i pk">C</span></span></div></div></div>
  <div style="display:flex;gap:16px">${sw('Preto', P.k)}${sw('Branco', P.w, 1)}${sw('Papel', P.papel)}${sw('Cinza', P.cinza)}${sw('Pink', P.pink)}</div>
  <div style="display:flex;gap:40px">
    <div style="flex:1"><div class="k" style="font-size:24px;color:var(--cinza)">Títulos · Bodoni Moda</div><div class="b" style="font-size:130px;margin-top:8px">Aa <span class="i pk">Aa</span></div></div>
    <div style="flex:1"><div class="k" style="font-size:24px;color:var(--cinza)">Texto · Jost</div><div style="font-size:130px;font-weight:300;line-height:1;margin-top:8px">Aa <span style="font-weight:500">Aa</span></div></div></div>
  <div style="display:flex;gap:40px;align-items:center">
    <div style="flex:1.2"><div class="k pk" style="font-size:24px">Direito Civil</div><div class="b i" style="font-size:54px;margin-top:8px">Chamada de capa</div></div>
    <div style="display:flex;align-items:center;gap:16px">${xmark(76)}<span class="k" style="font-size:24px">errado<br>e mito</span></div>
    <div style="position:relative;width:120px;height:120px"><div class="stamp" style="inset:0"><span class="b i" style="font-size:60px;line-height:.8">ou</span></div></div></div>
  <div style="background:var(--k);color:#fff;padding:36px 40px;margin-top:auto">
    <div class="k pk" style="font-size:24px">Tom de voz</div>
    <div class="b i" style="font-size:46px;margin-top:14px;line-height:1.1">Confiante, elegante e direta.</div>
    <div style="font-size:28px;font-weight:300;line-height:1.4;margin-top:12px">Títulos curtos como chamada de capa. Pink como único acento: é o rosa dela e deixa o vermelho livre para o erro.</div></div>
</div>`);

const F = (nome, html, h = 1350) => ({ nome, w: 1080, h, html });
await render(ID, [
  F('00-identidade', ident),
  F('c1-1', c1_1), F('c1-2', c1_2), F('c1-3', c1_3),
  F('c2-1', c2_1), F('c2-2', c2_2), F('c2-3', c2_3),
  F('c3-1', c3_1), F('c3-2', c3_2), F('c3-3', c3_3),
  F('c4-1', c4_1), F('c4-2', c4_2), F('c4-3', c4_3),
  F('c5-1', c5_1), F('c5-2', c5_2), F('c5-3', c5_3),
  F('p1', p1), F('p2', p2), F('p3', p3),
  F('s1', s1, 1920), F('s2', s2, 1920),
  F('destaques', destaques, 1080), F('avatar', avatar, 1080),
], { fontes, css });
