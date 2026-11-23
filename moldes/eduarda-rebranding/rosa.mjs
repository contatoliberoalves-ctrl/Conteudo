// Rebranding Eduarda · rodada 2: 5 identidades em tons de rosa, no padrão das referências do Behance
// (paleta curta, serifa elegante com itálico de destaque, foto grande tratada, muito respiro, nada de adesivos).
// Uso: node rosa.mjs [tema] [peça]   (nuvem: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node rosa.mjs)
// Fotos: fotos/<nome>.jpg + fotos/<nome>-mask.png (fora do git); o fundo de cada foto é recolorido no tom do tema (tonal.py).
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { render, root, CONTEUDO as C, PERFIL } from './base.mjs';

const TEMAS = {
  vinho: { nome: 'Vinho Editorial', fontes: ['Instrument+Serif:ital@0;1', 'Inter:wght@400;500;600'], T: "'Instrument Serif'", S: "'Inter'", tw: 400, ls: '-0.01em',
    bg: '#F6EDE9', bg2: '#EAD3D1', ink: '#3B1120', inkSoft: '#7A5560', ac: '#B04A64', esc: '#3B1120', escTxt: '#F6E6E4', escAc: '#E7A9B6',
    tint: ['#2A0A15', '#E8BCC3'], motivo: 'marca', capa: 'cheia' },
  blush: { nome: 'Blush Clean', fontes: ['Playfair+Display:ital,wght@0,500;0,600;1,500', 'DM+Sans:wght@400;500;700'], T: "'Playfair Display'", S: "'DM Sans'", tw: 500, ls: '-0.02em',
    bg: '#FCF6F4', bg2: '#F4DADA', ink: '#2F1F1F', inkSoft: '#7B6464', ac: '#C2456A', esc: '#F2CFD1', escTxt: '#2F1F1F', escAc: '#B23A5E',
    tint: ['#6A3542', '#F8DFE0'], motivo: 'arco', capa: 'abaixo' },
  bordo: { nome: 'Bordô & Pêssego', fontes: ['Bodoni+Moda:ital,opsz,wght@0,6..96,500;1,6..96,500', 'Jost:wght@400;500'], T: "'Bodoni Moda'", S: "'Jost'", tw: 500, ls: '-0.015em',
    bg: '#2C0915', bg2: '#45101F', ink: '#F8E8E2', inkSoft: '#D9B3B3', ac: '#F2A39B', esc: '#F6E2DC', escTxt: '#2C0915', escAc: '#A3344C',
    tint: ['#1A040C', '#D98A92'], motivo: 'numero', escuro: true, capa: 'acima', num: "font-family:'Jost';font-weight:300;font-style:normal" },
  pink: { nome: 'Pink Moderno', fontes: ['Fraunces:ital,opsz,wght@0,9..144,500;1,9..144,500', 'Manrope:wght@400;600;700'], T: "'Fraunces'", S: "'Manrope'", tw: 500, ls: '-0.03em',
    bg: '#FFF4F7', bg2: '#FBD3E0', ink: '#22141A', inkSoft: '#6F5A62', ac: '#E0457B', esc: '#E0457B', escTxt: '#FFF4F7', escAc: '#22141A',
    tint: ['#4E0E27', '#F7B3CB'], motivo: 'bloco', capa: 'cheia' },
  nude: { nome: 'Nude Rosé Atelier', fontes: ['Cormorant+Garamond:ital,wght@0,500;0,600;1,500', 'Montserrat:wght@400;500;600'], T: "'Cormorant Garamond'", S: "'Montserrat'", tw: 600, ls: '-0.01em',
    bg: '#F1E6DF', bg2: '#E3CBC4', ink: '#4A3534', inkSoft: '#866C69', ac: '#B9787A', esc: '#B9787A', escTxt: '#FBF3EF', escAc: '#4A3534',
    tint: ['#4A2F33', '#EED3CE'], motivo: 'oval', capa: 'abaixo' },
};
const FOTOS = ['explicando2', 'joinha2', 'falando', 'pensativa', 'sorrindo', 'escrevendo', 'surpresa', 'empolgada'];

// Foto tratada no tom do tema (cache em fotos/t-<tema>-<nome>.jpg).
function tratar(id, t) {
  for (const n of FOTOS) {
    const dst = path.join(root, 'fotos', `t-${id}-${n}.jpg`);
    if (!fs.existsSync(dst)) execFileSync('python3', [path.join(root, 'tonal.py'), path.join(root, 'fotos', `${n}.jpg`), dst, t.tint[0], t.tint[1]]);
  }
}

function tema(id) {
  const t = TEMAS[id]; tratar(id, t);
  const F = n => 'file://' + path.join(root, 'fotos', `t-${id}-${n}.jpg`);
  const W = 1080, H = 1350, M = 92;
  const tit = (px, cor = t.ink) => `font-family:${t.T};font-weight:${t.tw};font-size:${px}px;line-height:1.02;letter-spacing:${t.ls};color:${cor}`;
  const txt = (px, cor = t.ink, w = 400) => `font-family:${t.S};font-weight:${w};font-size:${px}px;line-height:1.42;color:${cor}`;
  const rot = (s, cor = t.inkSoft) => `<div style="font-family:${t.S};font-weight:600;font-size:21px;letter-spacing:.2em;text-transform:uppercase;color:${cor}">${s}</div>`;
  const N = s => t.num ? `<span style="${t.num}">${s}</span>` : s;
  const it = (s, cor = t.ac) => `<em style="font-style:italic;color:${cor}">${s}</em>`;
  // Foto enquadrada pelo ponto focal (rosto): z = zoom, (fx, fy) = onde o rosto fica na caixa.
  const ROSTO = { explicando2: [.42, .45, 1.5], joinha2: [.5, .45, 1.5], falando: [.43, .46, 1.5], pensativa: [.5, .49, 1.5], sorrindo: [.48, .44, 1.5], escrevendo: [.42, .3, .6665], surpresa: [.62, .43, 1.5], empolgada: [.6, .4, 1.5] };
  const foto = (n, { x = 0, y = 0, w = W, h = H, z = 1, fx = .5, fy = .4, raio = 0, extra = '' } = {}) => {
    const [px, py, r] = ROSTO[n]; const sw = Math.max(w, h / r) * z, sh = sw * r;
    const l = Math.min(0, Math.max(w - sw, fx * w - px * sw)), tp = Math.min(0, Math.max(h - sh, fy * h - py * sh));
    return `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:${raio};background:url('${F(n)}') ${l.toFixed(0)}px ${tp.toFixed(0)}px/${sw.toFixed(0)}px ${sh.toFixed(0)}px no-repeat;${extra}"></div>`; };
  // Topo e rodapé discretos, como nas referências.
  const topo = (dir, cor = t.inkSoft) => `<div style="position:absolute;left:${M}px;right:${M}px;top:70px;display:flex;justify-content:space-between">${rot('Eduarda Caraciolo', cor)}${rot(dir, cor)}</div>`;
  const rodape = (dir, cor = t.inkSoft) => `<div style="position:absolute;left:${M}px;right:${M}px;bottom:66px;display:flex;justify-content:space-between;align-items:center">${rot('@eduardacaraciolo', cor)}${dir ? `<div style="font-family:${t.S};font-weight:500;font-size:24px;color:${cor};display:flex;align-items:center;gap:12px">${dir}</div>` : ''}</div>`;
  const seta = (s = 'arrasta', cor = t.inkSoft) => `${s} <svg width="34" height="14" viewBox="0 0 34 14"><path d="M0 7h31M25 1l6 6-6 6" fill="none" stroke="${cor}" stroke-width="1.6"/></svg>`;
  const marcaDagua = (s, cor, est = '') => `<div style="position:absolute;${est};font-family:${t.T};font-style:italic;font-weight:${t.tw};font-size:420px;line-height:.8;color:${cor};white-space:nowrap;pointer-events:none">${s}</div>`;
  const pg = (html, bg = t.bg, h = H) => ({ html: `<div style="position:relative;width:${W}px;height:${h}px;overflow:hidden;background:${bg}">${html}</div>`, h });
  const claro = t.escuro ? t.esc : t.bg, escuro = t.escuro ? t.bg : t.esc; // fundo claro e fundo de contraste do tema
  const tc = t.escuro ? t.escTxt : t.ink, tcSoft = t.escuro ? '#7B5560' : t.inkSoft; // texto sobre o fundo claro
  const te = t.escuro ? t.ink : t.escTxt, teAc = t.escuro ? t.ac : t.escAc; // texto sobre o fundo de contraste
  const acClaro = t.escuro ? t.escAc : t.ac;
  const moldura = (n, x, y, w, h, o = {}) => {
    const raio = { arco: `${w / 2}px ${w / 2}px 0 0`, oval: '50%', bloco: '36px', marca: '0', numero: `${w / 2}px ${w / 2}px 0 0` }[t.motivo];
    return foto(n, { x, y, w, h, raio, ...o });
  };

  // Capa com foto em 3 formatos: cheia (foto inteira, texto sobre degradê), abaixo (foto na moldura, texto embaixo), acima (título em cima, foto embaixo).
  const capa = (n, o, titulo, sub, dir) => {
    if (t.capa === 'cheia') return pg(`${foto(n, o.cheia)}
    <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 40%,${t.tint[0]}EE 82%)"></div>
    ${topo(dir, '#F5E6E6')}
    <div style="position:absolute;left:${M}px;right:${M}px;bottom:150px"><div style="${tit(128, '#FFF6F4')}">${titulo(t.tint[1])}</div>
      <div style="${txt(34, '#F3DEDE')};margin-top:22px">${sub}</div></div>${rodape(seta('arrasta', '#F3DEDE'), '#F3DEDE')}`);
    if (t.capa === 'abaixo') return pg(`${t.motivo === 'oval' ? moldura(n, (W - 600) / 2, 140, 600, 790, o.moldura) : moldura(n, M, 150, W - 2 * M, 760, o.moldura)}
    ${topo(dir, tcSoft)}
    <div style="position:absolute;left:${M}px;right:${M}px;top:960px"><div style="${tit(100, tc)}">${titulo(acClaro)}</div>
      <div style="${txt(32, tcSoft)};margin-top:18px">${sub}</div></div>${rodape(seta('arrasta', tcSoft), tcSoft)}`, claro);
    return pg(`${topo(dir, te + 'B3')}
    <div style="position:absolute;left:${M}px;right:${M}px;top:160px"><div style="${tit(108, te)}">${titulo(teAc)}</div>
      <div style="${txt(32, te)};opacity:.8;margin-top:18px">${sub}</div></div>
    ${foto(n, { x: M, y: 560, w: W - 2 * M, h: 640, ...o.moldura })}${rodape(seta('arrasta', te + 'B3'), te + 'B3')}`, escuro);
  };
  const P = {};
  // ---------- 00 · identidade ----------
  const sw = (c, n) => `<div><div style="width:150px;height:150px;border-radius:${t.motivo === 'bloco' ? 28 : t.motivo === 'oval' || t.motivo === 'arco' ? '75px 75px 12px 12px' : 0}px;background:${c};box-shadow:inset 0 0 0 1px rgba(0,0,0,.08)"></div><div style="${txt(20, tcSoft, 500)};margin-top:12px">${n}<br>${c}</div></div>`;
  P['00-identidade'] = pg(`${topo('Identidade visual', tcSoft)}
    <div style="position:absolute;left:${M}px;top:170px">
      <div style="${tit(124, tc)}">Eduarda<br>${it('Caraciolo', acClaro)}</div>
      <div style="${txt(28, tcSoft, 500)};margin-top:22px;letter-spacing:.04em">Advogada · Direito Civil e ECA</div></div>
    <div style="position:absolute;left:${M}px;top:610px;display:flex;gap:26px">${sw(t.bg, 'Fundo')}${sw(t.bg2, 'Apoio')}${sw(t.ac, 'Acento')}${sw(t.esc, 'Contraste')}${sw(t.ink, 'Texto')}</div>
    <div style="position:absolute;left:${M}px;right:${M}px;top:900px;display:grid;grid-template-columns:1fr 1fr;gap:40px">
      <div>${rot('Títulos', tcSoft)}<div style="${tit(76, tc)};margin-top:14px">Aa ${it('Aa', acClaro)}</div><div style="${txt(22, tcSoft)}">${t.T.replace(/'/g, '')}</div></div>
      <div>${rot('Texto', tcSoft)}<div style="font-family:${t.S};font-size:76px;font-weight:500;color:${tc};line-height:1.02;margin-top:14px">Aa</div><div style="${txt(22, tcSoft)}">${t.S.replace(/'/g, '')}</div></div></div>
    ${moldura('explicando2', 730, 150, 258, 340, { z: 2.2, fy: .45 })}
    <div style="position:absolute;left:${M}px;right:${M}px;top:1080px">${rot('Tom de voz', tcSoft)}<div style="${tit(40, tc)};margin-top:14px">Próxima, didática e precisa. ${it('Direito sem juridiquês.', acClaro)}</div></div>
    ${rodape(t.nome, tcSoft)}`, claro);

  // ---------- c1 · explicativo ----------
  P['c1-1'] = capa('explicando2', { cheia: { z: 1.55, fx: .55, fy: .36 }, moldura: { z: 1.5, fx: .5, fy: .42 } },
    c => `Prescrição<br>${it('ou decadência?', c)}`, 'O jeito fácil de não confundir.', 'Direito Civil');
  const coluna = (x, i) => `<div style="flex:1">
      <div style="${tit(36, tcSoft)};font-style:italic">${i ? 'II.' : 'I.'}</div>
      <div style="${tit(84, i ? acClaro : tc)};margin:6px 0 26px">${x.nome}</div>
      <div style="${txt(40, tc, 500)}">${x.txt}</div>
      <div style="${txt(32, tcSoft)};margin-top:26px">${x.det}</div>
      <div style="${txt(24, acClaro, 600)};letter-spacing:.06em;margin-top:26px;text-transform:uppercase">${x.base}</div></div>`;
  P['c1-2'] = pg(`${topo('2 / 3', tcSoft)}
    ${marcaDagua('prazo', t.escuro ? 'rgba(44,9,21,.06)' : 'rgba(0,0,0,.035)', 'right:-60px;bottom:40px')}
    <div style="position:absolute;left:${M}px;right:${M}px;top:190px">
      <div style="${tit(92, tc)}">Dois prazos, ${it('duas perdas', acClaro)}</div>
      <div style="display:flex;gap:64px;margin-top:70px">${coluna(C.c1.itens[0], 0)}${coluna(C.c1.itens[1], 1)}</div></div>
    ${rodape('', tcSoft)}`, claro);
  P['c1-3'] = pg(`${topo('3 / 3', te + 'B3')}
    <div style="position:absolute;left:${M}px;right:${M}px;top:300px">
      ${rot('Para não esquecer', teAc)}
      <div style="${tit(104, te)};margin-top:30px">Prescrição perde a ${it('pretensão.', teAc)}<br><br>Decadência perde o ${it('direito.', teAc)}</div></div>
    <div style="position:absolute;left:${M}px;right:${M}px;bottom:150px;${txt(32, te)}">${C.c1.fim}</div>
    ${rodape(seta('salvar', te + 'B3'), te + 'B3')}`, escuro);

  // ---------- c2 · lista ----------
  P['c2-1'] = pg(`${moldura('falando', 560, 0, 520, 1350, { z: 1.25, fx: .5, fy: .34 })}
    ${topo('2ª fase OAB', tcSoft)}
    <div style="position:absolute;left:${M}px;top:250px;width:420px">
      <div style="${tit(300, acClaro)};line-height:.8">${N('4')}</div>
      <div style="${tit(72, tc)};margin-top:34px">erros que derrubam a ${it('peça de Civil', acClaro)}</div>
      <div style="${txt(30, tcSoft)};margin-top:28px">na 2ª fase da OAB</div></div>
    ${rodape('', tcSoft)}`, claro);
  P['c2-2'] = pg(`${topo('2 / 3', tcSoft)}
    <div style="position:absolute;left:${M}px;right:${M}px;top:190px">
      <div style="${tit(96, tc)}">Os ${N('4')} ${it('erros', acClaro)}</div>
      <div style="margin-top:50px">${C.c2.itens.map((s, i) => `<div style="display:flex;gap:40px;align-items:baseline;padding:38px 0;${i ? `border-top:1px solid ${t.escuro ? 'rgba(44,9,21,.15)' : 'rgba(0,0,0,.1)'}` : ''}">
        <div style="${tit(96, acClaro)};font-style:italic;width:110px">${N(i + 1)}</div><div style="${txt(46, tc, 500)};line-height:1.22">${s}</div></div>`).join('')}</div>
      <div style="${txt(26, tcSoft, 500)};letter-spacing:.06em;text-transform:uppercase;margin-top:30px">${C.c2.base}</div></div>
    ${rodape('', tcSoft)}`, claro);
  P['c2-3'] = pg(`${moldura('joinha2', M, 170, 896, 640, { z: 1.3, fx: .45, fy: .42 })}
    <div style="position:absolute;left:${M}px;right:${M}px;top:880px">
      <div style="${tit(84, te)}">Qual desses você ${it('já cometeu?', teAc)}</div>
      <div style="${txt(34, te)};margin-top:22px;opacity:.85">Conta nos comentários.</div></div>
    ${topo('3 / 3', te + 'B3')}${rodape('', te + 'B3')}`, escuro);

  // ---------- c3 · certo ou errado ----------
  const opcao = (s, cor, borda, bg = 'transparent') => `<div style="flex:1;border:1.5px solid ${borda};background:${bg};border-radius:999px;padding:26px 0;text-align:center;${txt(34, cor, 600)}">${s}</div>`;
  P['c3-1'] = pg(`${foto('surpresa', { h: 660, z: 1.35, fx: .55, fy: .5 })}
    ${topo('Certo ou errado?', '#F5E6E6')}
    <div style="position:absolute;left:${M}px;right:${M}px;top:720px">
      ${rot('Teste rápido · Família', tcSoft)}
      <div style="${tit(78, tc)};margin-top:24px">${C.c3.pergunta.replace('automaticamente?', it('automaticamente?', acClaro))}</div>
      <div style="display:flex;gap:22px;margin-top:50px">${opcao('Certo', tc, tc + '55')}${opcao('Errado', tc, tc + '55')}</div></div>
    ${rodape(seta('resposta', tcSoft), tcSoft)}`, claro);
  P['c3-2'] = pg(`${topo('Resposta', te + 'B3')}
    ${t.num ? '' : marcaDagua('358', t.escuro ? 'rgba(248,232,226,.06)' : 'rgba(255,255,255,.08)', 'right:-40px;top:520px')}
    <div style="position:absolute;left:${M}px;right:${M}px;top:230px">
      <div style="${tit(210, te)};font-style:italic">Errado.</div>
      <div style="${txt(40, te, 500)};margin-top:50px;line-height:1.35">A maioridade não encerra a pensão sozinha: a exoneração depende de decisão judicial, com contraditório.</div>
      <div style="display:inline-block;margin-top:56px;border:1.5px solid ${te}66;border-radius:999px;padding:16px 30px;${txt(28, te, 500)}">${C.c3.base}</div></div>
    ${rodape('', te + 'B3')}`, escuro);
  P['c3-3'] = pg(`${moldura('joinha2', M, 150, 520, 700, { z: 1.6, fx: .45, fy: .42 })}
    <div style="position:absolute;left:660px;right:${M}px;top:520px">${rot('Acertou?', acClaro)}</div>
    <div style="position:absolute;left:${M}px;right:${M}px;top:920px">
      <div style="${tit(78, tc)}">Comenta ${it('“acertei”', acClaro)} e marca quem precisa saber disso.</div></div>
    ${topo('3 / 3', tcSoft)}${rodape('', tcSoft)}`, claro);

  // ---------- c4 · mito ou verdade ----------
  P['c4-1'] = t.capa === 'cheia' ? pg(`${foto('escrevendo', { z: 1.05, fx: .68, fy: .34 })}
    <div style="position:absolute;inset:0;background:linear-gradient(90deg,${t.tint[0]}F2 0%,${t.tint[0]}CC 38%,rgba(0,0,0,0) 72%)"></div>
    ${topo('ECA · Adoção', '#F5E6E6')}
    <div style="position:absolute;left:${M}px;top:430px;width:560px">
      <div style="${tit(124, '#FFF6F4')}">Adoção:<br>${it('mito', t.tint[1])} ou<br>${it('verdade?', t.tint[1])}</div>
      <div style="${txt(32, '#F3DEDE')};margin-top:34px">Duas frases que todo mundo repete.</div></div>
    ${rodape(seta('arrasta', '#F3DEDE'), '#F3DEDE')}`) : capa('escrevendo', { moldura: { z: 1.1, fx: .5, fy: .4 } },
    c => `Adoção: ${it('mito', c)} ou ${it('verdade?', c)}`, 'Duas frases que todo mundo repete.', 'ECA · Adoção');
  const mv = (x) => `<div style="padding:60px 0;border-top:1px solid ${t.escuro ? 'rgba(44,9,21,.15)' : 'rgba(0,0,0,.1)'}">
      <div style="display:flex;align-items:center;gap:18px">${rot(x.v ? 'Verdade' : 'Mito', x.v ? acClaro : tc)}<div style="${txt(22, tcSoft, 500)};letter-spacing:.06em;text-transform:uppercase">· ${x.base}</div></div>
      <div style="${tit(76, tc)};margin-top:20px">“${x.frase}”</div>
      <div style="${txt(36, tcSoft)};margin-top:22px">${x.txt}</div></div>`;
  P['c4-2'] = pg(`${topo('2 / 3', tcSoft)}
    <div style="position:absolute;left:${M}px;right:${M}px;top:200px">
      <div style="${tit(96, tc)};margin-bottom:56px">E a resposta ${it('é…', acClaro)}</div>${C.c4.itens.map(mv).join('')}</div>
    ${rodape('', tcSoft)}`, claro);
  P['c4-3'] = pg(`${topo('3 / 3', te + 'B3')}
    <div style="position:absolute;left:${M}px;right:${M}px;top:330px;text-align:center">
      <div style="${txt(34, te)};opacity:.85">Quer mais mito ou verdade de ECA?</div>
      <div style="${tit(70, te)};margin-top:30px">Comenta a palavra</div>
      <div style="${tit(300, teAc)};font-style:italic;line-height:1;margin-top:10px">ECA</div></div>
    ${rodape('', te + 'B3')}`, escuro);

  // ---------- c5 · apresentação ----------
  P['c5-1'] = capa('falando', { cheia: { z: 1.45, fx: .5, fy: .34 }, moldura: { z: 1.6, fx: .5, fy: .45 } },
    c => `Prazer, ${it('Eduarda', c)}`, C.c5.sub, 'Sobre mim');
  P['c5-2'] = pg(`${topo('2 / 3', tcSoft)}
    <div style="position:absolute;left:${M}px;right:${M}px;top:200px">
      <div style="${tit(84, tc)}">O que você ${it('encontra aqui', acClaro)}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:26px;margin-top:64px">${C.c5.itens.map((s, i) => `<div style="background:${i % 3 ? (t.escuro ? '#EBD0C9' : t.bg2) : (t.escuro ? '#FFFFFF66' : '#FFFFFF')};border-radius:${t.motivo === 'marca' || t.motivo === 'numero' ? 4 : 30}px;padding:40px 36px;height:330px;display:flex;flex-direction:column;justify-content:space-between">
        <div style="${tit(62, acClaro)};font-style:italic">${N('0' + (i + 1))}</div><div style="${tit(48, tc)}">${s}</div></div>`).join('')}</div></div>
    ${rodape('', tcSoft)}`, claro);
  P['c5-3'] = pg(`${moldura('explicando2', 290, 150, 500, 620, { z: 2, fx: .5, fy: .42 })}
    <div style="position:absolute;left:${M}px;right:${M}px;top:850px;text-align:center">
      <div style="${tit(84, te)}">Me segue pra estudar ${it('Civil comigo.', teAc)}</div>
      <div style="display:inline-block;margin-top:40px;background:${teAc};color:${escuro};border-radius:999px;padding:20px 44px;${txt(30, escuro, 600)}">${PERFIL.arroba}</div></div>
    ${topo('3 / 3', te + 'B3')}`, escuro);

  // ---------- posts únicos ----------
  P['p1'] = pg(`${topo('Frase', tcSoft)}
    ${marcaDagua('“', t.escuro ? 'rgba(44,9,21,.08)' : t.bg2, `left:60px;top:120px;font-size:520px`)}
    <div style="position:absolute;left:${M}px;right:${M}px;top:420px">
      <div style="${tit(126, tc)}">Peça boa não se decora.</div>
      <div style="${tit(126, acClaro)};font-style:italic;margin-top:20px">Se entende.</div></div>
    ${rodape('', tcSoft)}`, claro);
  P['p2'] = pg(`${moldura('empolgada', 560, 300, 430, 600, { z: 1.7, fx: .42, fy: .4 })}
    ${topo('Pergunta', te + 'B3')}
    <div style="position:absolute;left:${M}px;top:330px;width:440px">
      <div style="${tit(88, te)}">Qual tema de Civil mais ${it('te trava?', teAc)}</div></div>
    <div style="position:absolute;left:${M}px;right:${M}px;top:990px;${txt(34, te)};opacity:.9">${C.p2.txt}</div>
    ${rodape('', te + 'B3')}`, escuro);
  P['p3'] = pg(`${topo('Sucessões', tcSoft)}
    <div style="position:absolute;left:${M}px;right:${M}px;top:190px">
      <div style="${tit(96, tc)}">Ordem da ${it('vocação hereditária', acClaro)}</div>
      <div style="margin-top:56px">${C.p3.itens.map((s, i) => `<div style="display:flex;gap:36px;align-items:baseline;padding:38px 0;${i ? `border-top:1px solid ${t.escuro ? 'rgba(44,9,21,.15)' : 'rgba(0,0,0,.1)'}` : ''}">
        <div style="${tit(80, acClaro)};font-style:italic;width:110px">${N(i + 1 + 'º')}</div><div style="${txt(40, tc, 500)};line-height:1.28">${s}</div></div>`).join('')}</div>
      <div style="${txt(26, tcSoft, 500)};letter-spacing:.06em;text-transform:uppercase;margin-top:26px">${C.p3.base}</div></div>
    ${rodape('', tcSoft)}`, claro);

  // ---------- stories ----------
  P['s1'] = pg(`${foto('joinha2', { h: 1150, z: 1.35, fx: .5, fy: .42 })}
    <div style="position:absolute;left:0;right:0;top:700px;height:450px;background:linear-gradient(180deg,rgba(0,0,0,0),${claro})"></div>
    <div style="position:absolute;left:${M}px;right:${M}px;top:1120px">
      <div style="${tit(92, tc)};text-align:center">Me pergunta qualquer coisa sobre ${it('ECA', acClaro)}</div>
      <div style="margin-top:56px;background:#FFFFFF;border-radius:34px;padding:44px 40px;box-shadow:0 20px 50px -20px rgba(60,20,30,.25)">
        <div style="${txt(26, '#9A8588', 500)};text-align:center">Escreva sua dúvida…</div></div>
      <div style="${txt(28, tcSoft)};text-align:center;margin-top:44px">${PERFIL.arroba}</div></div>`, claro, 1920);
  P['s2'] = pg(`<div style="position:absolute;left:${M}px;right:${M}px;top:200px;text-align:center">
      ${rot('Post novo no feed', teAc)}
      <div style="${tit(96, te)};margin-top:26px">Prescrição ${it('ou decadência?', teAc)}</div></div>
    <div style="position:absolute;left:190px;top:560px;width:700px;height:875px;overflow:hidden;border-radius:${t.motivo === 'bloco' ? 32 : 6}px;box-shadow:0 40px 90px -30px rgba(0,0,0,.5)">
      <div style="transform:scale(${700 / 1080});transform-origin:0 0;width:1080px;height:1350px">${P['c1-1'].html}</div></div>
    <div style="position:absolute;left:0;right:0;top:1560px;text-align:center"><span style="display:inline-block;background:${teAc};border-radius:999px;padding:24px 50px;${txt(30, escuro, 600)}">Toca pra ver</span></div>`, escuro, 1920);

  // ---------- destaques e avatar ----------
  const cl2 = t.escuro ? '#EBCFC8' : t.bg2;
  const circ = (s, bg, cor) => `<div style="text-align:center"><div style="width:250px;height:250px;border-radius:50%;background:${bg};display:flex;align-items:center;justify-content:center;${tit(70, cor)};font-style:italic">${s}</div><div style="${txt(24, tcSoft, 500)};margin-top:16px">${s}</div></div>`;
  P['destaques'] = pg(`<div style="position:absolute;left:0;right:0;top:110px;text-align:center">${rot('Capas de destaque', tcSoft)}</div>
    <div style="position:absolute;left:0;right:0;top:240px;display:flex;justify-content:center;gap:50px">${circ('Civil', cl2, tc)}${circ('ECA', escuro, te)}${circ('OAB', cl2, tc)}</div>
    <div style="position:absolute;left:0;right:0;top:620px;display:flex;justify-content:center;gap:50px">${circ('Dicas', escuro, te)}${circ('Sobre', cl2, tc)}</div>`, claro, 1080);
  P['avatar'] = pg(`${foto('joinha2', { w: 1080, h: 1080, z: 1.7, fx: .48, fy: .5 })}`, t.tint[1], 1080);

  return Object.entries(P).map(([nome, p]) => ({ nome, w: W, h: p.h, html: p.html }));
}

const so = process.argv[2] && TEMAS[process.argv[2]] ? [process.argv[2]] : Object.keys(TEMAS);
const filtro = process.argv[3] || '';
for (const id of so) {
  const t = TEMAS[id];
  const fontes = `https://fonts.googleapis.com/css2?${t.fontes.map(f => 'family=' + f).join('&')}&display=swap`;
  console.log(`== ${id}`);
  await render(`rosa-${id}`, tema(id), { fontes, filtro });
}
