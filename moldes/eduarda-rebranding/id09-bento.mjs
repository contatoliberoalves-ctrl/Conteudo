// id09 · Bento Pastel: a Eduarda como um app de estudo. Grade de cards arredondados (bento grid),
// sombras suaves, pastéis (pêssego, menta, céu, lilás) sobre off-white, texto grafite, ícones de traço feitos à mão.
// Marca: "civil em blocos", monograma "ec" numa grade 2×2 de quadradinhos pastel.
import fs from 'node:fs';
import { render, CONTEUDO as C, PERFIL, foto as fotoUrl, recorte as recorteUrl, esc } from './base.mjs';
// A página é montada com setContent (about:blank), que não lê file://: as fotos vão embutidas em data URI.
const dataUri = (u, tipo) => `data:${tipo};base64,${fs.readFileSync(new URL(u)).toString('base64')}`;
const foto = n => dataUri(fotoUrl(n), 'image/jpeg');
const recorte = n => dataUri(recorteUrl(n), 'image/png');

const ID = 'id09-bento';
const fontes = 'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap';

const P = { bg: '#F6F3EE', ink: '#2A2C32', ink2: '#5E616A', pes: '#FFD8C2', men: '#CBEBDB', ceu: '#CFE2F7', lil: '#E3D7F7', erro: '#D64B3F' };

const css = `
:root{--bg:${P.bg};--ink:${P.ink};--ink2:${P.ink2};--pes:${P.pes};--men:${P.men};--ceu:${P.ceu};--lil:${P.lil};--erro:${P.erro}}
body{background:var(--bg);color:var(--ink);font-family:'Plus Jakarta Sans',sans-serif}
.pg{position:relative;width:1080px;height:1350px;padding:44px 48px 48px;display:flex;flex-direction:column;gap:20px;overflow:hidden;background:var(--bg)}
.st{height:1920px;padding:150px 56px 200px}
.top{display:flex;align-items:center;gap:18px;height:72px;flex:none}
.top .nm{font-family:Fredoka;font-weight:600;font-size:32px;line-height:1}
.top .nm small{display:block;font-family:'Plus Jakarta Sans';font-weight:600;font-size:22px;color:var(--ink2);margin-top:4px}
.pill{display:inline-flex;align-items:center;gap:10px;border-radius:999px;padding:12px 24px;font-weight:700;font-size:26px;background:#fff;box-shadow:0 6px 18px -8px rgba(42,44,50,.25)}
.top .pill{margin-left:auto}
.c{position:relative;background:#fff;border-radius:40px;padding:40px;box-shadow:0 1px 0 rgba(42,44,50,.04),0 22px 44px -18px rgba(42,44,50,.22);overflow:hidden}
.pes{background:var(--pes)}.men{background:var(--men)}.ceu{background:var(--ceu)}.lil{background:var(--lil)}.dk{background:var(--ink);color:#fff}
.h{font-family:Fredoka;font-weight:600;line-height:1.02;letter-spacing:-.01em}
.chip{display:inline-flex;align-items:center;gap:10px;border-radius:999px;padding:10px 22px;font-weight:700;font-size:26px;background:rgba(255,255,255,.75);color:var(--ink)}
.chip.dk{background:var(--ink);color:#fff}
.ic{width:56px;height:56px;flex:none}
.ibox{width:96px;height:96px;border-radius:28px;background:rgba(255,255,255,.8);display:flex;align-items:center;justify-content:center;flex:none}
.ibox .ic{width:56px;height:56px}
.t{font-size:32px;line-height:1.35;font-weight:500}
.ph{background-repeat:no-repeat;background-color:#d9cdbd}
.grid{flex:1;display:grid;gap:20px;min-height:0}
.btn{display:flex;align-items:center;justify-content:center;gap:14px;border-radius:30px;font-weight:800;font-size:34px;height:110px}
.mark{display:grid;grid-template-columns:1fr 1fr;gap:4px;flex:none}
.mark i{display:flex;align-items:center;justify-content:center;font-style:normal;font-family:Fredoka;font-weight:700;color:var(--ink);line-height:1}
.num{width:64px;height:64px;border-radius:22px;display:flex;align-items:center;justify-content:center;font-family:Fredoka;font-weight:700;font-size:36px;background:#fff;flex:none}
`;

// Ícones de traço, desenhados à mão (viewBox 48).
const ICONES = {
  ampulheta: '<path d="M13 6h22M13 42h22M16 6c0 9 16 11 16 18s-16 9-16 18M32 6c0 9-16 11-16 18s16 9 16 18"/><path d="M19 37h10" stroke-width="5"/>',
  cadeado: '<rect x="11" y="21" width="26" height="21" rx="6"/><path d="M17 21v-5a7 7 0 0 1 14 0v5"/><path d="M24 29v5"/>',
  doc: '<path d="M12 10a4 4 0 0 1 4-4h12l8 8v24a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4z"/><path d="M28 6v8h8M18 24h12M18 31h8"/>',
  check: '<path d="M11 25l9 9 17-19"/>',
  x: '<path d="M14 14l20 20M34 14L14 34"/>',
  chat: '<path d="M8 13a6 6 0 0 1 6-6h20a6 6 0 0 1 6 6v13a6 6 0 0 1-6 6H21l-9 8v-8a4 4 0 0 1-4-4z"/><path d="M17 17h14M17 23h9"/>',
  lampada: '<path d="M18 35h12M20 41h8M24 6a12 12 0 0 0-7 21.7c1.3 1 2 2.3 2 3.8V35h10v-3.5c0-1.5.7-2.8 2-3.8A12 12 0 0 0 24 6z"/>',
  pin: '<path d="M24 43s-13-12-13-23a13 13 0 0 1 26 0c0 11-13 23-13 23z"/><circle cx="24" cy="20" r="5"/>',
  pessoas: '<circle cx="18" cy="17" r="6"/><path d="M6 39c0-7 5-11 12-11s12 4 12 11"/><circle cx="33" cy="19" r="5"/><path d="M31 28c6 0 11 3 11 10"/>',
  alvo: '<circle cx="24" cy="24" r="17"/><circle cx="24" cy="24" r="10"/><circle cx="24" cy="24" r="3"/>',
  moeda: '<circle cx="24" cy="24" r="17"/><path d="M24 13v22M29 18h-7a3.5 3.5 0 0 0 0 7h4a3.5 3.5 0 0 1 0 7h-8"/>',
  casa: '<path d="M7 22L24 8l17 14"/><path d="M12 19v21h24V19"/><path d="M24 35s-6-3.5-6-7.5a3 3 0 0 1 6-1 3 3 0 0 1 6 1c0 4-6 7.5-6 7.5z"/>',
  livro: '<path d="M24 12c-4-3-10-4-16-3v28c6-1 12 0 16 3 4-3 10-4 16-3V9c-6-1-12 0-16 3zM24 12v28"/>',
  salvar: '<path d="M14 6h20a2 2 0 0 1 2 2v34l-12-9-12 9V8a2 2 0 0 1 2-2z"/>',
  enviar: '<path d="M42 6L20 28M42 6L29 42l-9-14-14-9z"/>',
  camera: '<rect x="6" y="14" width="36" height="25" rx="6"/><path d="M17 14l3-5h8l3 5"/><circle cx="24" cy="26" r="6"/>',
  pergunta: '<circle cx="24" cy="24" r="17"/><path d="M19 19.5a5 5 0 1 1 7 4.6c-1.3.6-2 1.6-2 3V29"/><path d="M24 34.5v.5" stroke-width="4.5"/>',
  user: '<circle cx="24" cy="16" r="8"/><path d="M9 41c0-9 7-13 15-13s15 4 15 13"/>',
  capelo: '<path d="M4 18l20-9 20 9-20 9z"/><path d="M12 22v9c5 5 19 5 24 0v-9M44 18v10"/>',
  seta: '<path d="M9 24h28M28 14l10 10-10 10"/>',
  balanca: '<path d="M24 7v33M15 41h18M9 13h30"/><path d="M9 13l-5 12a5.5 5.5 0 0 0 10 0zM39 13l-5 12a5.5 5.5 0 0 0 10 0z"/>',
  estrela: '<path d="M24 6l5.4 11.3 12.3 1.6-9 8.6 2.3 12.2L24 33.8l-11 5.9 2.3-12.2-9-8.6 12.3-1.6z"/>',
  arroba: '<circle cx="24" cy="24" r="7"/><path d="M31 18v9a5 5 0 0 0 10 0v-3a17 17 0 1 0-7 13.7"/>',
  arvore: '<circle cx="24" cy="9" r="4.5"/><circle cx="12" cy="24" r="4.5"/><circle cx="36" cy="24" r="4.5"/><circle cx="24" cy="39" r="4.5"/><path d="M21 13l-6 7M27 13l6 7M15 28l6 7M33 28l-6 7"/>',
};
const ic = (n, { s = 56, c = 'currentColor', w = 3.4 } = {}) => `<svg class="ic" style="width:${s}px;height:${s}px" viewBox="0 0 48 48" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${ICONES[n]}</svg>`;

// Monograma: grade 2×2 com "e" e "c".
const mark = (s = 64) => { const q = (s - 4) / 2; const r = q * .32; return `<div class="mark" style="width:${s}px;height:${s}px">
  <i style="background:var(--pes);border-radius:${r}px;font-size:${q * .78}px;padding-bottom:${q * .08}px">e</i><i style="background:var(--men);border-radius:${r}px"></i>
  <i style="background:var(--ceu);border-radius:${r}px"></i><i style="background:var(--lil);border-radius:${r}px;font-size:${q * .78}px;padding-bottom:${q * .08}px">c</i></div>`; };
const top = (pag, sub = 'civil em blocos') => `<div class="top">${mark(68)}<div class="nm">eduarda caraciolo<small>${sub}</small></div>${pag ? `<div class="pill">${pag}</div>` : ''}</div>`;
const ph = (n, size, pos, extra = '') => `background-image:url('${foto(n)}');background-size:${size};background-position:${pos};${extra}`;
const pg = (inner, pag, cls = '') => `<div class="pg ${cls}">${top(pag)}${inner}</div>`;

// ---------- C1 · explicativo ----------
const c1 = C.c1;
const c1_1 = pg(`<div class="grid" style="grid-template-columns:560px 1fr;grid-template-rows:520px 1fr 128px">
  <div class="c ph" style="padding:0;${ph('explicando', '190%', '50% 26%')}"></div>
  <div style="display:grid;grid-template-rows:1fr 1fr;gap:20px">
    <div class="c lil" style="display:flex;flex-direction:column;justify-content:space-between">${ic('ampulheta', { s: 72 })}<div><div class="h" style="font-size:46px">Prescrição</div><div style="font-size:28px;font-weight:600;color:var(--ink2);margin-top:6px">perde a pretensão</div></div></div>
    <div class="c ceu" style="display:flex;flex-direction:column;justify-content:space-between">${ic('cadeado', { s: 72 })}<div><div class="h" style="font-size:46px">Decadência</div><div style="font-size:28px;font-weight:600;color:var(--ink2);margin-top:6px">perde o direito</div></div></div>
  </div>
  <div class="c pes" style="grid-column:1/3;display:flex;flex-direction:column;justify-content:center;padding:44px 52px">
    <span class="chip" style="align-self:flex-start">${ic('balanca', { s: 34 })}Direito Civil</span>
    <div class="h" style="font-size:112px;margin-top:22px">Prescrição <span style="color:#fff;-webkit-text-stroke:0">x</span><br>decadência</div>
    <div style="font-size:38px;font-weight:600;margin-top:18px">${esc(c1.sub)}</div>
  </div>
  <div class="c" style="grid-column:1/3;display:flex;align-items:center;justify-content:space-between;padding:0 40px">
    <span style="font-size:30px;font-weight:700">CC, arts. 189, 207 e 210</span>
    <span class="chip dk">arrasta ${ic('seta', { s: 32 })}</span>
  </div></div>`, '1/3');

const coluna = (it, cor, icone) => `<div class="c ${cor}" style="display:flex;flex-direction:column;gap:26px;padding:40px 36px">
  <div style="display:flex;align-items:center;gap:20px"><div class="ibox">${ic(icone)}</div><div class="h" style="font-size:48px">${esc(it.nome)}</div></div>
  <div style="font-size:44px;line-height:1.22;font-weight:700">${esc(it.txt)}</div>
  <div style="background:rgba(255,255,255,.7);border-radius:28px;padding:30px 28px;font-size:34px;line-height:1.36;font-weight:500">${esc(it.det)}</div>
  <span class="chip dk" style="align-self:flex-start;margin-top:auto">${ic('doc', { s: 30, w: 3.6 })}${esc(it.base)}</span></div>`;
const c1_2 = pg(`<div class="c dk" style="padding:30px 40px;display:flex;align-items:center;gap:22px">${ic('pergunta', { s: 60 })}<div class="h" style="font-size:50px">O que você perde em cada uma?</div></div>
  <div class="grid" style="grid-template-columns:1fr 1fr;grid-template-rows:1fr auto">${coluna(c1.itens[0], 'lil', 'ampulheta')}${coluna(c1.itens[1], 'ceu', 'cadeado')}
  <div class="c pes" style="grid-column:1/3;display:flex;align-items:center;gap:28px;padding:34px 40px"><div class="ibox">${ic('lampada', { s: 60 })}</div>
  <div style="font-size:32px;line-height:1.35;font-weight:600">Tem prazo pra <b style="font-weight:800">exigir</b> algo de alguém? Prescrição. Pra <b style="font-weight:800">exercer</b> um direito potestativo? Decadência.</div></div></div>`, '2/3');

const c1_3 = pg(`<div class="h" style="font-size:72px;padding:10px 4px 0">Pra não confundir</div>
  <div class="grid" style="grid-template-columns:1fr 1fr;grid-template-rows:1fr auto">
    <div class="c lil" style="padding:40px;display:flex;flex-direction:column"><div class="ibox">${ic('ampulheta', { s: 60 })}</div><div class="h" style="font-size:58px;margin:auto 0 14px">Prescrição</div><div style="font-size:38px;line-height:1.3;font-weight:500">perde a <b>pretensão</b> de exigir em juízo</div></div>
    <div class="c ceu" style="padding:40px;display:flex;flex-direction:column"><div class="ibox">${ic('cadeado', { s: 60 })}</div><div class="h" style="font-size:58px;margin:auto 0 14px">Decadência</div><div style="font-size:38px;line-height:1.3;font-weight:500">perde o <b>próprio direito</b> (potestativo)</div></div>
    <div class="c" style="grid-column:1/3;display:flex;flex-direction:column;gap:40px;padding:48px">
      <div class="h" style="font-size:72px">Salva pra revisar e manda pra quem vai fazer a OAB.</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
        <div class="btn pes">${ic('salvar', { s: 46 })}Salvar</div><div class="btn men">${ic('enviar', { s: 46 })}Enviar</div></div>
    </div></div>`, '3/3');

// ---------- C2 · lista ----------
const c2 = C.c2;
const ERROS = [['pin', 'pes', 'Endereçamento'], ['pessoas', 'men', 'Qualificação'], ['alvo', 'ceu', 'Pedido'], ['moeda', 'lil', 'Valor da causa']];
const c2_1 = pg(`<div class="c lil" style="flex:1;padding:0">
    <div class="h" style="position:absolute;left:30px;top:-40px;font-size:620px;line-height:1;color:#fff">4</div>
    <img src="${recorte('surpresa')}" style="position:absolute;right:10px;top:230px;width:760px">
    <span class="chip" style="position:absolute;left:40px;bottom:40px">${ic('capelo', { s: 34 })}${esc(c2.sub)}</span>
  </div>
  <div class="c" style="flex:none;padding:44px 48px;margin-top:-60px">
    <div class="h" style="font-size:90px">4 erros que derrubam a peça de Civil</div>
    <div style="display:flex;gap:14px;margin-top:26px">${ERROS.map(e => `<div class="ibox ${e[1]}" style="width:84px;height:84px;border-radius:24px">${ic(e[0], { s: 46 })}</div>`).join('')}<span class="chip dk" style="margin-left:auto;align-self:center">arrasta ${ic('seta', { s: 32 })}</span></div>
  </div>`, '1/3');

const c2_2 = pg(`<div class="h" style="font-size:66px;padding:6px 4px 0">Os 4 erros que mais derrubam</div>
  <div class="grid" style="grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr">
  ${c2.itens.map((t, i) => `<div class="c ${ERROS[i][1]}" style="display:flex;flex-direction:column;padding:36px">
    <div style="display:flex;justify-content:space-between;align-items:flex-start"><div class="num">${i + 1}</div><div class="ibox">${ic(ERROS[i][0], { s: 60 })}</div></div>
    <div style="margin-top:auto"><div style="font-size:26px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--ink2)">${ERROS[i][2]}</div>
    <div style="font-size:36px;line-height:1.25;font-weight:700;margin-top:10px">${esc(t)}</div></div></div>`).join('')}
  </div>`, '2/3');

const c2_3 = pg(`<div class="c dk" style="padding:44px 48px"><div class="h" style="font-size:80px">Qual desses você já cometeu?</div>
    <div style="font-size:32px;font-weight:500;margin-top:16px;opacity:.85">Toca no número e conta nos comentários.</div></div>
  <div class="grid" style="grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr auto">
    ${ERROS.map((e, i) => `<div class="c" style="display:flex;align-items:center;gap:22px;padding:30px"><div class="num ${e[1]}" style="width:84px;height:84px;font-size:46px;border-radius:26px">${i + 1}</div><div style="font-size:34px;font-weight:700;line-height:1.15">${e[2]}</div></div>`).join('')}
    <div class="c" style="grid-column:1/3;display:flex;align-items:center;gap:22px;padding:28px 36px">
      <div class="ibox men" style="width:84px;height:84px">${ic('doc', { s: 48 })}</div>
      <div><div style="font-size:26px;font-weight:700;color:var(--ink2)">Base legal</div><div style="font-size:34px;font-weight:800">${esc(c2.base)}</div></div>
    </div></div>
  <div class="c" style="padding:22px 26px 22px 34px;display:flex;align-items:center;gap:20px;border-radius:999px">
    ${ic('chat', { s: 50 })}<span style="font-size:32px;color:var(--ink2);font-weight:500">Adicione um comentário…</span><span class="chip dk" style="margin-left:auto">Publicar</span></div>`, '3/3');

// ---------- C3 · questão certo/errado ----------
const c3 = C.c3;
const opc = (txt, cor, icone, estado = '') => `<div class="c ${cor}" style="display:flex;align-items:center;gap:22px;padding:28px 34px;${estado}">
  <div class="ibox" style="width:84px;height:84px">${ic(icone, { s: 50 })}</div><div class="h" style="font-size:56px">${txt}</div></div>`;
const c3_1 = pg(`<div style="display:flex;align-items:center;gap:18px"><span class="chip dk">${ic('pergunta', { s: 32 })}Certo ou errado?</span>
    <div style="flex:1;height:18px;border-radius:9px;background:#fff;box-shadow:inset 0 0 0 2px rgba(42,44,50,.06)"><div style="width:35%;height:100%;border-radius:9px;background:var(--lil)"></div></div></div>
  <div style="flex:1;display:flex;flex-direction:column;min-height:0">
    <div class="c pes" style="flex:1;padding:0"><img src="${recorte('empolgada')}" style="position:absolute;left:50%;transform:translateX(-52%);top:0;width:580px"></div>
    <div class="c" style="flex:none;margin:-110px 0 0;padding:44px 48px">
      <div style="font-size:28px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--ink2)">Pensão alimentícia</div>
      <div class="h" style="font-size:70px;margin-top:14px">${esc(c3.pergunta)}</div></div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;flex:none">${opc('Certo', 'men', 'check')}${opc('Errado', 'ceu', 'x')}</div>`, '1/3');

const c3_2 = pg(`<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">${opc('Certo', '', 'check', 'opacity:.45;box-shadow:none')}
    <div class="c dk" style="display:flex;align-items:center;gap:22px;padding:28px 34px"><div class="ibox" style="width:84px;height:84px;color:var(--ink)">${ic('x', { s: 50 })}</div><div class="h" style="font-size:56px">Errado</div></div></div>
  <div class="c men" style="flex:1;display:flex;flex-direction:column;padding:52px">
    <span class="chip" style="align-self:flex-start">${ic('check', { s: 32, w: 4.5 })}Resposta certa: errado</span>
    <div class="h" style="font-size:82px;margin-top:30px">A maioridade não encerra a pensão sozinha.</div>
    <div style="font-size:42px;line-height:1.32;font-weight:600;margin-top:28px">A exoneração depende de <b style="font-weight:800">decisão judicial</b>, com contraditório.</div>
    <div style="background:rgba(255,255,255,.75);border-radius:30px;padding:32px 34px;margin-top:36px;font-size:31px;line-height:1.4;font-weight:500"><b style="font-weight:800">Súmula 358 do STJ:</b> o cancelamento de pensão alimentícia de filho que atingiu a maioridade está sujeito à decisão judicial, mediante contraditório, ainda que nos próprios autos.</div>
    <div style="margin-top:auto;display:flex;gap:14px;flex-wrap:wrap">
      <span class="chip" style="background:var(--erro);color:#fff">${ic('x', { s: 28, w: 4.5 })}pegadinha: “automaticamente”</span></div>
  </div>`, '2/3');

const c3_3 = pg(`<div class="grid" style="grid-template-rows:1fr auto auto">
  <div class="c lil" style="padding:48px;display:flex;flex-direction:column;justify-content:flex-end">
    <div class="ph" style="position:absolute;right:0;top:0;bottom:0;width:470px;${ph('joinha', '260%', '40% 40%')}"></div>
    <div class="h" style="font-size:108px;position:relative">Acertou?</div>
    <div style="font-size:38px;font-weight:600;margin-top:14px;position:relative;max-width:500px">Comenta e marca quem precisa saber disso.</div></div>
  <div class="c" style="display:flex;flex-direction:column;gap:24px;padding:40px 44px">
    <div style="font-size:28px;font-weight:800;color:var(--ink2);text-transform:uppercase;letter-spacing:.06em">Comentários</div>
    ${[['Você', 'acertei'], ['Você', '@amiga_da_oab olha isso']].map(([a, b], i) => `<div style="display:flex;gap:20px;align-items:center">
      <div style="width:96px;height:96px;border-radius:50%;flex:none;${i ? 'background:var(--ceu)' : 'background:var(--pes)'};display:flex;align-items:center;justify-content:center">${ic('user', { s: 44 })}</div>
      <div style="background:var(--bg);border-radius:30px;padding:26px 34px;font-size:40px;font-weight:700">${esc(b)}</div></div>`).join('')}
    <div style="border-radius:999px;background:var(--bg);padding:26px 34px;display:flex;align-items:center;gap:18px;font-size:32px;font-weight:500;color:var(--ink2)">${ic('chat', { s: 46 })}Adicione um comentário…</div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
    <div class="btn men">${ic('chat', { s: 46 })}“acertei”</div><div class="btn pes">${ic('arroba', { s: 46 })}Marcar</div></div></div>`, '3/3');

// ---------- C4 · mito ou verdade ----------
const c4 = C.c4;
const toggle = (on, w = 300) => `<div style="width:${w}px;height:${w * .5}px;border-radius:999px;background:${on ? 'var(--men)' : 'var(--ink)'};position:relative;box-shadow:inset 0 4px 10px rgba(0,0,0,.08)">
  <div style="position:absolute;top:${w * .05}px;${on ? 'right' : 'left'}:${w * .05}px;width:${w * .4}px;height:${w * .4}px;border-radius:50%;background:#fff;box-shadow:0 8px 18px -6px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center">${ic(on ? 'check' : 'x', { s: w * .2, w: 5 })}</div></div>`;
const c4_1 = pg(`<div class="grid" style="grid-template-columns:1fr 1fr;grid-template-rows:440px 1fr">
    <div class="c ph" style="padding:0;${ph('pensando', '230%', '33% 36%')}"></div>
    <div style="display:grid;grid-template-rows:1fr 1fr;gap:20px">
      <div class="c" style="display:flex;align-items:center;justify-content:space-between;padding:0 36px"><div class="h" style="font-size:54px">Mito</div>${toggle(false, 170)}</div>
      <div class="c" style="display:flex;align-items:center;justify-content:space-between;padding:0 36px"><div class="h" style="font-size:54px">Verdade</div>${toggle(true, 170)}</div>
    </div>
    <div class="c men" style="grid-column:1/3;display:flex;flex-direction:column;justify-content:flex-end;padding:52px">
      <span class="chip" style="align-self:flex-start">${ic('casa', { s: 36 })}ECA</span>
      <div class="h" style="font-size:150px;margin-top:24px">Adoção:</div>
      <div class="h" style="font-size:96px;margin-top:6px">mito ou verdade?</div>
      <div style="font-size:32px;font-weight:600;margin-top:24px;color:var(--ink2)">2 frases que todo mundo repete. Arrasta e confere.</div>
    </div></div>`, '1/3');

const flash = (it, i) => `<div class="c ${it.v ? 'men' : 'lil'}" style="flex:1;display:flex;flex-direction:column;padding:44px">
  <div style="display:flex;align-items:center;gap:24px"><div class="num">${i + 1}</div><div class="h" style="font-size:58px;flex:1">“${esc(it.frase)}”</div></div>
  <div style="display:flex;align-items:center;gap:22px;margin-top:28px">${toggle(it.v, 150)}<div class="h" style="font-size:52px">${it.v ? 'Verdade' : 'Mito'}</div></div>
  <div style="font-size:34px;line-height:1.35;font-weight:600;margin-top:24px">${esc(it.txt)}</div>
  <span class="chip dk" style="align-self:flex-start;margin-top:auto">${ic('doc', { s: 30, w: 3.6 })}${esc(it.base)}</span></div>`;
const c4_2 = pg(`${c4.itens.map(flash).join('')}`, '2/3');

const c4_3 = pg(`<div class="grid" style="grid-template-columns:1fr 1fr;grid-template-rows:auto 1fr">
    <div class="c men" style="display:flex;align-items:center;gap:22px;padding:30px 34px">${toggle(true, 150)}<div><div class="h" style="font-size:80px">1</div><div style="font-size:28px;font-weight:700">verdade</div></div></div>
    <div class="c lil" style="display:flex;align-items:center;gap:22px;padding:34px">${toggle(false, 150)}<div><div class="h" style="font-size:80px">1</div><div style="font-size:28px;font-weight:700">mito</div></div></div>
    <div class="c" style="grid-column:1/3;display:flex;flex-direction:column;padding:56px">
      <div class="ibox ceu">${ic('casa', { s: 60 })}</div>
      <div class="h" style="font-size:96px;margin-top:32px">Quer mais mito ou verdade de ECA?</div>
      <div style="display:flex;flex-direction:column;gap:18px;margin-top:40px">${c4.itens.map(it => `<div style="display:flex;align-items:center;gap:22px;background:var(--bg);border-radius:30px;padding:20px 26px">${toggle(it.v, 110)}<div style="font-size:34px;font-weight:700">${esc(it.frase)}</div></div>`).join('')}</div>
      <div class="btn dk" style="margin-top:auto;height:130px;font-size:44px;border-radius:36px">${ic('chat', { s: 54 })}Comenta “ECA”</div>
    </div></div>`, '3/3');

// ---------- C5 · apresentação ----------
const c5 = C.c5;
const c5_1 = pg(`<div style="position:relative;flex:1">
    <div class="c ph" style="position:absolute;inset:0 0 300px 0;padding:0;${ph('empolgada', '150%', '60% 30%')}"></div>
    <span class="chip" style="position:absolute;left:30px;top:30px;background:#fff">${ic('user', { s: 32 })}Sobre mim</span>
    <div class="c" style="position:absolute;left:0;right:0;bottom:0;padding:44px 48px">
      <div class="h" style="font-size:118px">Prazer, Eduarda</div>
      <div style="font-size:34px;line-height:1.35;font-weight:600;margin-top:16px">${esc(c5.sub)}</div>
      <div style="display:flex;gap:12px;margin-top:26px">
        <span class="chip pes">${ic('balanca', { s: 32 })}Direito Civil</span><span class="chip men">${ic('casa', { s: 32 })}ECA</span><span class="chip ceu">${ic('capelo', { s: 32 })}OAB 2ª fase</span></div>
    </div></div>`, '1/3');

const c5_2 = pg(`<div class="h" style="font-size:72px;padding:6px 4px 0">O que você encontra aqui</div>
  <div class="grid" style="grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr 300px">
    <div class="c pes" style="grid-row:1/3;display:flex;flex-direction:column;padding:44px"><div class="ibox">${ic('doc', { s: 60 })}</div><div class="h" style="font-size:76px;margin-top:auto">Dicas de peça</div><div class="t" style="margin-top:14px;font-weight:600">pra 2ª fase</div></div>
    <div class="c ceu" style="display:flex;flex-direction:column;padding:36px"><div class="ibox">${ic('pergunta', { s: 60 })}</div><div class="h" style="font-size:50px;margin-top:auto">Questões comentadas</div></div>
    <div class="c lil" style="display:flex;flex-direction:column;padding:36px"><div class="ibox">${ic('casa', { s: 60 })}</div><div class="h" style="font-size:50px;margin-top:auto">ECA sem juridiquês</div></div>
    <div class="c men" style="grid-column:1/3;display:flex;align-items:center;gap:36px;padding:0 0 0 44px">
      <div class="ibox">${ic('camera', { s: 60 })}</div><div class="h" style="font-size:60px">Bastidores das aulas</div>
      <div class="ph" style="margin-left:auto;align-self:stretch;width:300px;${ph('falando-neon', '330%', '46% 41%')}"></div></div>
  </div>`, '2/3');

const c5_3 = pg(`<div class="c" style="flex:1;display:flex;flex-direction:column;align-items:center;text-align:center;padding:60px 52px">
    <div style="width:330px;height:330px;border-radius:50%;padding:12px;background:conic-gradient(var(--pes) 0 25%,var(--men) 0 50%,var(--ceu) 0 75%,var(--lil) 0)">
      <div class="ph" style="width:100%;height:100%;border-radius:50%;border:10px solid #fff;${ph('empolgada', '320%', '58% 25%')}"></div></div>
    <div class="h" style="font-size:60px;margin-top:30px">${esc(PERFIL.nome)}</div>
    <div style="font-size:32px;font-weight:600;color:var(--ink2);margin-top:8px">${esc(PERFIL.arroba)}</div>
    <div class="h" style="font-size:80px;margin-top:auto">Me segue pra estudar Civil comigo.</div>
    <div class="btn dk" style="width:100%;margin-top:40px;height:126px;font-size:44px;border-radius:36px">Seguir</div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;flex:none">
    ${[['balanca', 'pes', 'Civil'], ['casa', 'men', 'ECA'], ['capelo', 'ceu', 'OAB']].map(([i, c, t]) => `<div class="c ${c}" style="display:flex;align-items:center;gap:16px;padding:26px 30px">${ic(i, { s: 52 })}<div class="h" style="font-size:44px">${t}</div></div>`).join('')}</div>`, '3/3');

// ---------- Posts únicos ----------
const p1 = pg(`<div class="grid" style="grid-template-columns:1fr 1fr;grid-template-rows:1fr 380px">
    <div class="c" style="grid-column:1/3;display:flex;flex-direction:column;justify-content:center;padding:64px">
      <div class="ibox lil">${ic('doc', { s: 60 })}</div>
      <div class="h" style="font-size:150px;margin-top:44px">Peça boa não se decora.</div></div>
    <div class="c men" style="grid-column:1/2;display:flex;flex-direction:column;justify-content:space-between;padding:48px">${ic('lampada', { s: 80 })}<div class="h" style="font-size:96px">Se entende.</div></div>
    <div class="c pes ph" style="padding:0;${ph('pensando', '260%', '34% 36%')}"></div>
  </div>`, '');

const p2 = pg(`<div class="c ceu" style="padding:52px"><span class="chip">${ic('chat', { s: 34 })}Enquete nos comentários</span>
    <div class="h" style="font-size:104px;margin-top:28px">Qual tema de Civil mais te trava?</div></div>
  <div class="grid" style="grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr auto">
    ${[['doc', 'pes', 'Contratos'], ['casa', 'lil', 'Família'], ['arvore', 'men', 'Sucessões'], ['balanca', 'ceu', 'Responsabilidade civil']].map(([i, c, t]) => `<div class="c" style="display:flex;align-items:center;gap:22px;padding:30px"><div class="ibox ${c}" style="width:88px;height:88px">${ic(i, { s: 50 })}</div><div class="h" style="font-size:42px">${t}</div></div>`).join('')}
    <div class="c dk" style="grid-column:1/3;display:flex;align-items:center;gap:26px;padding:34px 40px">${ic('estrela', { s: 64 })}<div style="font-size:34px;line-height:1.3;font-weight:600">Comenta aqui embaixo. <b style="font-weight:800">O mais pedido vira o próximo post.</b></div></div>
  </div>`, '');

const p3c = C.p3;
const ORD = ['pes', 'men', 'ceu', 'lil'];
const p3 = pg(`<div class="c dk" style="padding:44px 48px;display:flex;align-items:center;gap:30px">
    <div class="ibox" style="background:rgba(255,255,255,.12);color:#fff">${ic('arvore', { s: 62 })}</div>
    <div><div style="font-size:28px;font-weight:700;opacity:.75">Dica de Sucessões</div><div class="h" style="font-size:64px;margin-top:6px">Ordem da vocação hereditária</div></div></div>
  <div class="grid" style="grid-template-rows:repeat(4,1fr)">
    ${p3c.itens.map((t, i) => { const [a, b] = t.split(' ('); return `<div class="c ${ORD[i]}" style="display:flex;align-items:center;gap:30px;padding:26px 40px">
      <div class="num" style="width:96px;height:96px;font-size:56px;border-radius:30px">${i + 1}º</div>
      <div><div style="font-size:40px;font-weight:800;line-height:1.15">${esc(a)}</div>${b ? `<div style="font-size:29px;font-weight:600;margin-top:6px;color:var(--ink2)">${esc(b.replace(/\)$/, ''))}</div>` : ''}</div></div>`; }).join('')}
  </div>
  <div style="display:flex;justify-content:space-between;align-items:center;flex:none"><span class="chip dk">${ic('doc', { s: 30, w: 3.6 })}${esc(p3c.base)}</span><span style="font-size:28px;font-weight:700;color:var(--ink2)">Salva pra consultar</span></div>`, '');

// ---------- Stories ----------
const s1 = `<div class="pg st" style="gap:28px">${top('')}
  <div style="position:relative;flex:1">
    <div class="c lil" style="position:absolute;inset:0 0 auto 0;height:900px;padding:0"></div>
    <img src="${recorte('empolgada')}" style="position:absolute;left:50%;transform:translateX(-50%);top:40px;width:800px">
    <div class="c" style="position:absolute;left:0;right:0;top:760px;padding:0">
      <div class="pes" style="padding:50px 52px 46px;text-align:center"><div class="h" style="font-size:80px">Me pergunta qualquer coisa sobre ECA</div></div>
      <div style="padding:40px 44px 48px"><div style="background:var(--bg);border-radius:30px;padding:34px;font-size:36px;font-weight:600;color:var(--ink2);text-align:center">Escreva aqui sua dúvida…</div></div>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;flex:none">
    ${[['casa', 'men', 'Adoção'], ['user', 'ceu', 'Guarda'], ['moeda', 'pes', 'Alimentos']].map(([i, c, t]) => `<div class="c ${c}" style="display:flex;flex-direction:column;align-items:center;gap:12px;padding:28px">${ic(i, { s: 56 })}<div class="h" style="font-size:40px">${t}</div></div>`).join('')}</div>
</div>`;

const s2 = `<div class="pg st" style="gap:28px">${top('')}
  <div class="c pes" style="padding:44px 48px;display:flex;align-items:center;gap:26px;flex:none"><div class="ibox">${ic('estrela', { s: 60 })}</div><div class="h" style="font-size:84px">Post novo no feed</div></div>
  <div class="c" style="flex:1;padding:28px;display:flex;flex-direction:column;gap:22px">
    <div style="display:flex;align-items:center;gap:16px">${mark(60)}<div style="font-size:30px;font-weight:800">${esc(PERFIL.arroba)}</div></div>
    <div style="flex:1;display:flex;align-items:center;justify-content:center"><div style="width:778px;height:972px;border-radius:28px;overflow:hidden;position:relative;box-shadow:0 0 0 2px rgba(42,44,50,.06)"><div style="transform:scale(.7204);transform-origin:0 0;position:absolute;left:0;top:0">${c1_1}</div></div></div>
  </div>
  <div class="btn dk" style="flex:none;height:130px;font-size:44px;border-radius:36px">Toca pra ver ${ic('seta', { s: 50 })}</div>
</div>`;

// ---------- Destaques e avatar ----------
const DEST = [['balanca', 'pes'], ['casa', 'men'], ['capelo', 'ceu'], ['lampada', 'lil'], ['user', 'pes']];
const bola = (i) => `<div style="display:flex;flex-direction:column;align-items:center;gap:22px">
  <div style="width:270px;height:270px;border-radius:50%;background:var(--${DEST[i][1]});display:flex;align-items:center;justify-content:center;box-shadow:0 22px 44px -18px rgba(42,44,50,.3)">
    <div style="width:150px;height:150px;border-radius:46px;background:#fff;display:flex;align-items:center;justify-content:center">${ic(DEST[i][0], { s: 96, w: 3 })}</div></div>
  <div class="h" style="font-size:44px">${C.destaques[i]}</div></div>`;
const destaques = `<div class="pg" style="height:1080px;justify-content:center;gap:56px;padding:60px">
  <div style="display:flex;justify-content:center;gap:56px">${[0, 1, 2].map(bola).join('')}</div>
  <div style="display:flex;justify-content:center;gap:56px">${[3, 4].map(bola).join('')}</div></div>`;

const avatar = `<div class="pg" style="height:1080px;padding:0;background:var(--pes)">
  <div style="position:absolute;left:50%;top:50%;width:760px;height:760px;transform:translate(-50%,-50%);border-radius:50%;background:var(--lil)"></div>
  <img src="${recorte('empolgada')}" style="position:absolute;left:-92px;top:190px;width:1150px">
</div>`;

// ---------- 00 · identidade ----------
const sw = (nome, hex, cls, txt = 'var(--ink)') => `<div class="c" style="padding:0;display:flex;flex-direction:column"><div style="flex:1;background:${hex}"></div><div style="padding:16px 20px;font-size:24px;font-weight:700;line-height:1.25;color:${txt}">${nome}<br><span style="font-weight:500;color:var(--ink2)">${hex}</span></div></div>`;
const ident = `<div class="pg" style="gap:20px">
  <div class="grid" style="grid-template-columns:repeat(6,1fr);grid-template-rows:300px 230px 300px 1fr">
    <div class="c" style="grid-column:1/5;display:flex;align-items:center;gap:36px;padding:44px">${mark(200)}<div><div class="h" style="font-size:72px">eduarda<br>caraciolo</div><div style="font-size:30px;font-weight:700;color:var(--ink2);margin-top:12px">civil em blocos</div></div></div>
    <div class="c dk" style="grid-column:5/7;display:flex;flex-direction:column;justify-content:space-between;padding:36px"><div style="font-size:24px;font-weight:700;opacity:.7">Projeto 09</div><div class="h" style="font-size:58px">Bento<br>Pastel</div></div>
    ${sw('Off-white', P.bg, '')}${sw('Grafite', P.ink, '')}${sw('Pêssego', P.pes, '')}${sw('Menta', P.men, '')}${sw('Céu', P.ceu, '')}${sw('Lilás', P.lil, '')}
    <div class="c pes" style="grid-column:1/4;padding:36px"><div style="font-size:24px;font-weight:700;color:var(--ink2)">Títulos · Fredoka</div><div class="h" style="font-size:120px;margin-top:10px">Aa</div><div class="h" style="font-size:40px">Prescrição x decadência</div></div>
    <div class="c ceu" style="grid-column:4/7;padding:36px"><div style="font-size:24px;font-weight:700;color:var(--ink2)">Texto · Plus Jakarta Sans</div><div style="font-size:120px;font-weight:800;line-height:1.02;margin-top:10px">Aa</div><div style="font-size:30px;font-weight:600;line-height:1.3">Você perde a pretensão: o direito de exigir em juízo.</div></div>
    <div class="c" style="grid-column:1/4;display:flex;flex-direction:column;gap:20px;padding:36px">
      <div style="font-size:24px;font-weight:700;color:var(--ink2)">Elementos</div>
      <div style="display:flex;gap:14px">${['ampulheta', 'cadeado', 'casa', 'doc', 'chat'].map((n, i) => `<div class="ibox ${ORD[i % 4]}" style="width:76px;height:76px;border-radius:22px">${ic(n, { s: 44 })}</div>`).join('')}</div>
      <div style="display:flex;gap:16px;align-items:center">${toggle(true, 120)}${toggle(false, 120)}<span class="chip dk" style="font-size:24px">CC, art. 189</span></div>
      <span class="chip" style="align-self:flex-start;background:var(--erro);color:#fff;font-size:24px">vermelho só na pegadinha</span>
    </div>
    <div class="c lil" style="grid-column:4/7;display:flex;flex-direction:column;padding:36px">
      <div style="font-size:24px;font-weight:700;color:var(--ink2)">Tom de voz</div>
      <div class="h" style="font-size:46px;margin-top:14px">Organizado, didático e leve.</div>
      <div style="font-size:28px;line-height:1.38;font-weight:500;margin-top:14px">Uma ideia por card, frases curtas, sempre com a base legal. Parece um app de estudo, não um outdoor.</div>
    </div>
  </div></div>`;

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
