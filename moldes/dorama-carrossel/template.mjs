// Molde "Dorama · Carrossel" (@cristaodorameiro): slides 1080×1350 na identidade Cristão Dorameiro.
// Tipos: capa (estilos cartaz, nota, frase, meme), ficha, texto, lista, nota, curiosidade, versiculo, meme, cta.
// Cada slide escolhe o fundo (noite, creme, rosa); padrão: capa/versículo/cta na noite, o resto no creme.
import { C, SERIF, FUNDOS, fundo, rico, esc, lista, bokeh, petalas, logo, arroba, ep, kicker, hangul, estrelas, barra, cartaz, quadro, chip, foto, cena, legenda, enfeite } from '../dorama-comum/identidade.mjs';

const W = 1080, H = 1350, M = 96;
const PET1 = [[880, 150, 46, 20], [960, 260, 30, -30, .6], [30, 1010, 38, 60, .7], [120, 1100, 24, 10, .5]];
const PET2 = [[960, 170, 40, -20, .7], [950, 1130, 44, 40], [1000, 1040, 26, 0, .5]];
const tit = (s, f, px, extra = '') => s.titulo ? `<div style="${SERIF};font-weight:700;font-size:${s.ts || px}px;line-height:1.04;letter-spacing:-.015em;color:${f.tit};${f.sombra ? `text-shadow:${f.sombra};` : ''}${extra}">${rico(s.titulo, f)}</div>` : '';
const par = (s, f, px = 40) => lista(s.texto).map(p => `<p style="font-size:${s.corpo || px}px;font-weight:500;line-height:1.45;color:${f.txt}">${rico(p, f)}</p>`).join('');
const area = (html, extra = '') => `<div data-cabe style="position:absolute;left:${M}px;right:${M}px;top:180px;bottom:170px;display:flex;flex-direction:column;gap:34px;overflow:hidden;${extra}">${html}</div>`;
const topo = () => '';
const base = (i, n, f) => i === 1 && n > 1 ? `<div style="position:absolute;right:${M}px;bottom:70px;font-weight:700;font-size:24px;letter-spacing:.06em;color:${f.tit};opacity:.85">arrasta →</div>` : '';

const FN = fundo('noite');
// Foto de fundo do slide (ou de uma faixa de altura h): foto do dorama, ou a cena em degradê se faltar.
const bgFoto = (s, h = H) => { const src = foto(s.foto); return src
  ? `<img src="${src}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${s.fotoPos || 'center'};${s.fotoZoom ? `transform:scale(${s.fotoZoom});` : ''}">${s.escurecer ? `<div style="position:absolute;inset:0;background:rgba(8,24,22,${s.escurecer})"></div>` : ''}`
  : cena(s.cena || 'noite', W, h, 21); };
// Crédito da foto (cenas e fotos de terceiros), bem pequeno no canto.
const credito = (s, y = null, cor = 'rgba(255,255,255,.6)', lado = `right:${M}px`) => s.credito ? `<div style="position:absolute;${lado};${y == null ? 'bottom:44px' : `top:${y}px`};font-size:16px;font-weight:600;color:${cor};max-width:700px;">${esc(s.credito)}</div>` : '';

const CAPAS = {
  // Cartaz do dorama inclinado à direita, título embaixo.
  cartaz: (s, f) => `${petalas(PET1)}
    <div style="position:absolute;left:${M}px;top:96px">${logo(54, { cor: f.tit, dest: f.dest })}</div>
    <div style="position:absolute;right:${M}px;top:150px;transform:rotate(3.5deg)">${cartaz(s.dorama || {}, 470, 640)}</div>
    ${s.selo ? `<div style="position:absolute;right:520px;top:590px;width:190px;height:190px;border-radius:50%;background:${C.laranja};color:${C.noite};display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;transform:rotate(-10deg);box-shadow:0 18px 40px rgba(0,0,0,.3)"><span style="${SERIF};font-style:italic;font-weight:700;font-size:34px;line-height:1">${esc(s.selo)}</span></div>` : ''}
    <div data-cabe style="position:absolute;left:${M}px;right:${M}px;top:800px;bottom:150px;display:flex;flex-direction:column;justify-content:flex-end;gap:24px;overflow:hidden;padding-bottom:16px">${kicker(s.kicker, f)}${tit(s, f, 104)}${s.texto ? `<div style="font-size:36px;font-weight:500;line-height:1.4;color:${f.txt}">${rico(s.texto, f)}</div>` : ''}</div>`,
  // Nota em destaque: cartaz à esquerda, nota gigante e estrelas à direita.
  nota: (s, f) => `${petalas(PET2)}
    <div style="position:absolute;left:${M}px;top:96px">${logo(54, { cor: f.tit, dest: f.dest })}</div>
    <div style="position:absolute;left:${M}px;top:240px;transform:rotate(-3deg)">${cartaz(s.dorama || {}, 440, 600)}</div>
    <div style="position:absolute;left:600px;right:${M}px;top:300px;text-align:center;color:${f.tit}">
      <div style="font-weight:800;font-size:24px;letter-spacing:.22em;color:${f.kick}">MINHA NOTA</div>
      <div style="${SERIF};font-weight:900;font-size:230px;line-height:.9;letter-spacing:-.04em">${String(s.nota ?? '').replace('.', ',')}</div>
      <div style="margin-top:18px;font-weight:700;font-size:26px;opacity:.6;letter-spacing:.14em">DE 10</div>
      <div style="margin-top:28px">${estrelas((s.nota ?? 0) / 2, 50)}</div></div>
    <div data-cabe style="position:absolute;left:${M}px;right:${M}px;top:900px;bottom:150px;display:flex;flex-direction:column;justify-content:flex-end;gap:22px;overflow:hidden;padding-bottom:16px">${kicker(s.kicker, f)}${tit(s, f, 92)}</div>`,
  // Título grande (curiosidade, reflexão, listas): hangul gigante e suave ao fundo.
  frase: (s, f) => `${petalas(PET1)}
    <div style="position:absolute;right:-40px;top:160px;writing-mode:vertical-rl;opacity:.09">${hangul(s.hangul, 230, f.tit, 'letter-spacing:.05em')}</div>
    <div style="position:absolute;left:${M}px;top:96px">${logo(54, { cor: f.tit, dest: f.dest })}</div>
    ${s.emoji ? `<div style="position:absolute;left:${M}px;top:330px;font-size:130px;line-height:1">${s.emoji}</div>` : ''}
    <div data-cabe style="position:absolute;left:${M}px;right:${M}px;top:${s.emoji ? 510 : 300}px;bottom:170px;display:flex;flex-direction:column;justify-content:center;gap:34px;overflow:hidden">${kicker(s.kicker, f)}${tit(s, f, 124)}${s.texto ? `<div style="font-size:40px;font-weight:500;line-height:1.4;color:${f.txt}">${rico(s.texto, f)}</div>` : ''}</div>`,
  // ---- Capas com foto do dorama de fundo (campo foto; sem foto, a cena em degradê) ----
  // Foto em tela cheia, degradê escuro embaixo e título grande.
  foto: (s, f) => `${bgFoto(s)}<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(14,42,39,.55) 0%,rgba(14,42,39,0) 26%,rgba(14,42,39,0) 42%,rgba(14,42,39,.92) 74%,${C.noite} 100%)"></div>
    <div style="position:absolute;left:${M}px;top:96px">${logo(54, { cor: C.creme, dest: C.rosa })}</div>
    <div data-cabe style="position:absolute;left:${M}px;right:${M}px;top:640px;bottom:150px;display:flex;flex-direction:column;justify-content:flex-end;gap:22px;overflow:hidden;padding-bottom:16px">${hangul(s.hangul, 34, C.rosa, 'letter-spacing:.06em')}${kicker(s.kicker, FN)}${tit(s, FN, 110)}${s.texto ? `<div style="font-size:36px;font-weight:500;line-height:1.4;color:${FN.txt}">${rico(s.texto, FN)}</div>` : ''}</div>${credito(s)}`,
  // Cena de cinema: faixas pretas, a foto no meio com legenda de dorama e o título embaixo.
  cinema: (s, f) => `<div style="position:absolute;inset:0;background:#0B0810"></div>
    <div style="position:absolute;left:0;right:0;top:250px;height:600px;overflow:hidden">${bgFoto(s, 600)}<div style="position:absolute;inset:auto 0 0 0;height:50%;background:linear-gradient(transparent,rgba(0,0,0,.6))"></div>
      ${s.legenda ? `<div style="position:absolute;left:60px;right:60px;bottom:40px">${legenda(s.legenda, s.legendaTam || 44)}</div>` : ''}
      ${s.episodio ? `<div style="position:absolute;left:30px;top:26px;padding:8px 16px;border-radius:10px;background:rgba(8,24,22,.55);font-weight:800;font-size:22px;letter-spacing:.14em;color:#fff">${esc(s.episodio)}</div>` : ''}</div>
    <div style="position:absolute;left:${M}px;right:${M}px;top:100px;display:flex;justify-content:space-between;align-items:center">${logo(50, { cor: C.creme, dest: C.rosa })}${hangul(s.hangul, 30, C.rosa)}</div>
    <div data-cabe style="position:absolute;left:${M}px;right:${M}px;top:890px;bottom:150px;display:flex;flex-direction:column;justify-content:center;gap:20px;overflow:hidden;padding-bottom:12px">${kicker(s.kicker, FN)}${tit(s, FN, 84)}</div>${credito(s, 860)}`,
  // Moldura: papel creme, a foto num arco no alto e o título embaixo.
  moldura: (s, f) => `<div style="position:absolute;inset:0;background:${FUNDOS.creme.bg}"></div>${petalas(PET1)}
    <div style="position:absolute;left:${M}px;top:96px">${logo(50, { cor: C.tinta, dest: C.rosaForte })}</div>
    <div style="position:absolute;left:150px;right:150px;top:190px;height:690px;border-radius:390px 390px 30px 30px;overflow:hidden;box-shadow:0 30px 70px rgba(34,24,46,.25);border:12px solid #fff">${bgFoto(s, 666)}</div>
    ${s.selo ? `<div style="position:absolute;right:110px;top:760px;width:180px;height:180px;border-radius:50%;background:${C.rosaForte};color:${C.creme};display:flex;align-items:center;justify-content:center;text-align:center;transform:rotate(-10deg);box-shadow:0 18px 40px rgba(0,0,0,.25);${SERIF};font-style:italic;font-weight:700;font-size:32px;line-height:1.05;padding:18px">${esc(s.selo)}</div>` : ''}
    <div data-cabe style="position:absolute;left:${M}px;right:${M}px;top:910px;bottom:150px;display:flex;flex-direction:column;align-items:center;text-align:center;justify-content:center;gap:16px;overflow:hidden;padding-bottom:12px">${kicker(s.kicker, FUNDOS.creme)}${tit(s, FUNDOS.creme, 80)}</div>${credito(s, 888, 'rgba(34,24,46,.55)', 'left:160px')}`,
  // Vidro: foto em tela cheia e um cartão de vidro fosco com o título e as estrelas.
  vidro: (s, f) => `${bgFoto(s)}<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(14,42,39,.45),rgba(14,42,39,0) 30%,rgba(14,42,39,0) 70%,rgba(14,42,39,.75) 100%)"></div>
    <div style="position:absolute;left:${M}px;top:96px">${logo(54, { cor: C.creme, dest: C.rosa })}</div>
    <div data-cabe style="position:absolute;left:70px;right:70px;bottom:160px;max-height:600px;padding:46px 50px 50px;border-radius:40px;background:rgba(14,42,39,.42);backdrop-filter:blur(26px) saturate(1.3);-webkit-backdrop-filter:blur(26px) saturate(1.3);border:2px solid rgba(255,255,255,.22);display:flex;flex-direction:column;gap:20px;overflow:hidden">
      ${kicker(s.kicker, FN)}${tit(s, FN, 88)}${s.estrelas ? `<div style="display:flex;align-items:center;gap:18px">${estrelas(s.estrelas, 46)}<span style="font-weight:700;font-size:28px;color:${C.creme};opacity:.8">${esc(s.onde || '')}</span></div>` : ''}</div>${credito(s, 60)}`,
  // Foto com nota: selo redondo com a nota e as estrelas, título embaixo.
  fotonota: (s, f) => `${bgFoto(s)}<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(14,42,39,.5) 0%,rgba(14,42,39,0) 28%,rgba(14,42,39,0) 48%,rgba(14,42,39,.94) 80%,${C.noite} 100%)"></div>
    <div style="position:absolute;left:${M}px;top:96px">${logo(54, { cor: C.creme, dest: C.rosa })}</div>
    <div style="position:absolute;right:80px;top:200px;width:290px;height:290px;border-radius:50%;background:${C.creme};box-shadow:0 24px 60px rgba(0,0,0,.35);display:flex;flex-direction:column;align-items:center;justify-content:center;transform:rotate(6deg);border:8px solid ${C.rosa}">
      <div style="font-weight:800;font-size:20px;letter-spacing:.2em;color:${C.rosaForte}">MINHA NOTA</div>
      <div style="${SERIF};font-weight:900;font-size:118px;line-height:1;color:${C.tinta};letter-spacing:-.03em">${String(s.nota ?? '').replace('.', ',')}</div>
      <div style="margin-top:4px">${estrelas((s.nota ?? 0) / 2, 30)}</div></div>
    <div data-cabe style="position:absolute;left:${M}px;right:${M}px;top:760px;bottom:150px;display:flex;flex-direction:column;justify-content:flex-end;gap:22px;overflow:hidden;padding-bottom:16px">${kicker(s.kicker, FN)}${tit(s, FN, 96)}</div>${credito(s)}`,
  // Meme: texto de cima e a cena com legenda.
  meme: (s, f) => `<div style="position:absolute;left:${M}px;top:96px">${logo(50, { cor: f.tit, dest: f.dest })}</div>
    <div data-cabe style="position:absolute;left:${M}px;right:${M}px;top:210px;height:300px;display:flex;flex-direction:column;justify-content:flex-end;gap:18px;overflow:hidden;padding-bottom:16px">${kicker(s.kicker, f)}${tit(s, f, 72)}</div>
    <div style="position:absolute;left:${M}px;right:${M}px;top:550px;height:640px">${quadro(s, W - 2 * M, 640)}</div>`,
};

const TIPOS = {
  capa: (s, f, i, n) => `${(CAPAS[s.estilo] || CAPAS.cartaz)(s, f)}${base(i, n, f)}`,
  // Ficha técnica do dorama.
  ficha: (s, f, i, n) => {
    const d = s.dorama || {};
    const itens = lista(s.itens).map(([r, v]) => `<div style="padding:24px 26px;border-radius:22px;background:${f.card};border:2px solid ${f.cardBorda}"><div style="font-weight:800;font-size:20px;letter-spacing:.18em;color:${f.kick}">${esc(r).toUpperCase()}</div><div style="margin-top:8px;font-weight:700;font-size:32px;line-height:1.25;color:${f.tit}">${rico(v, f)}</div></div>`).join('');
    return `${topo(i, n, f)}${area(`${kicker(s.kicker, f)}
      <div style="display:flex;gap:40px;align-items:center">${cartaz(d, 280, 380, { raio: 22 })}<div style="display:flex;flex-direction:column;gap:14px">${hangul(d.hangul, 34, f.dest)}<div style="${SERIF};font-weight:700;font-size:${s.ts || 72}px;line-height:1.02;color:${f.tit}">${esc(s.titulo || d.titulo)}</div>${d.original ? `<div style="font-size:28px;font-weight:600;color:${f.txt};font-style:italic">${esc(d.original)}</div>` : ''}</div></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px">${itens}</div>${par(s, f, 36)}`, 'justify-content:center')}${base(i, n, f)}`;
  },
  texto: (s, f, i, n) => `${topo(i, n, f)}${area(`${kicker(s.kicker, f)}${tit(s, f, 84)}${par(s, f)}`, 'justify-content:center')}${base(i, n, f)}`,
  lista: (s, f, i, n) => `${topo(i, n, f)}${area(`${kicker(s.kicker, f)}${tit(s, f, 80)}<div style="display:flex;flex-direction:column;gap:22px">${lista(s.itens).map((t, k) => `<div style="display:flex;gap:26px;align-items:flex-start;padding:24px 28px;border-radius:24px;background:${f.card};border:2px solid ${f.cardBorda}"><span style="flex:none;width:64px;height:64px;border-radius:50%;background:${C.rosaForte};color:${C.creme};display:flex;align-items:center;justify-content:center;${SERIF};font-style:italic;font-weight:700;font-size:36px">${k + 1}</span><span style="padding-top:8px;font-size:${s.corpo || 34}px;font-weight:500;line-height:1.4;color:${f.txt}">${rico(t, f)}</span></div>`).join('')}</div>`, 'justify-content:center')}${base(i, n, f)}`,
  // Boletim: barras por critério, nota final e o que saber antes de assistir.
  nota: (s, f, i, n) => `${topo(i, n, f)}${area(`${kicker(s.kicker, f)}${tit(s, f, 66)}
    <div style="display:flex;flex-direction:column;gap:20px">${lista(s.criterios).map(([r, v]) => barra(r, v, f, 32)).join('')}</div>
    ${s.final != null ? `<div style="display:flex;align-items:center;justify-content:space-between;padding:26px 34px;border-radius:26px;background:${C.noite};color:${C.creme}"><div><div style="font-weight:800;font-size:22px;letter-spacing:.2em;color:${C.rosa}">NOTA FINAL</div><div style="margin-top:10px">${estrelas(s.final / 2, 44)}</div></div><div style="${SERIF};font-weight:900;font-size:110px;line-height:1">${String(s.final).replace('.', ',')}</div></div>` : ''}
    ${s.alertas ? `<div><div style="font-weight:800;font-size:22px;letter-spacing:.2em;color:${f.kick};margin-bottom:14px">ANTES DE DAR O PLAY</div><div style="display:flex;flex-wrap:wrap;gap:12px">${lista(s.alertas).map(a => chip(a, f, 24)).join('')}</div></div>` : ''}`, 'justify-content:center;gap:28px')}${base(i, n, f)}`,
  // Curiosidade: número gigante em itálico, título e texto; fonte pequena no fim.
  curiosidade: (s, f, i, n) => `${topo(i, n, f)}${area(`<div style="display:flex;align-items:flex-end;gap:26px"><span style="${SERIF};font-style:italic;font-weight:700;font-size:200px;line-height:.8;color:${f.dest}">${esc(s.numero ?? '?')}</span><span style="padding-bottom:12px">${kicker(s.kicker || 'Você sabia?', f)}</span></div>${tit(s, f, 72)}${par(s, f)}${s.fonte ? `<div style="font-size:24px;font-weight:600;color:${f.txt};opacity:.7">Fonte: ${esc(s.fonte)}</div>` : ''}`, 'justify-content:center')}${base(i, n, f)}`,
  // Versículo: aspas grandes, texto em serifa itálica, referência e a ponte com o dorama.
  versiculo: (s, f, i, n) => `${petalas(PET2)}${topo(i, n, f)}${area(`${kicker(s.kicker, f)}<div style="${SERIF};font-weight:900;font-size:190px;line-height:.85;color:${f.dest};height:70px;margin-top:10px">“</div><div style="${SERIF};font-style:italic;font-weight:500;font-size:${s.ts || 62}px;line-height:1.22;color:${f.tit}">${rico(s.versiculo, f)}</div><div style="font-weight:800;font-size:28px;letter-spacing:.16em;color:${f.dest}">${esc(s.ref).toUpperCase()}</div>${s.texto ? `<div style="height:2px;background:${f.linha}"></div>${par(s, f, 36)}` : ''}`, 'justify-content:center')}${base(i, n, f)}`,
  meme: (s, f, i, n) => `${topo(i, n, f)}<div data-cabe style="position:absolute;left:${M}px;right:${M}px;top:170px;height:${s.titulo ? 300 : 0}px;display:flex;flex-direction:column;justify-content:flex-end;gap:16px;overflow:hidden;padding-bottom:16px">${kicker(s.kicker, f)}${tit(s, f, 64)}</div>
    <div style="position:absolute;left:${M}px;right:${M}px;top:${s.titulo ? 510 : 200}px">${quadro(s, W - 2 * M, s.titulo ? 650 : 960)}</div>${base(i, n, f)}`,
  cta: (s, f, i, n) => `${petalas(PET1)}${area(`<div>${logo(80, { cor: f.tit, dest: f.dest })}</div>${tit(s, f, 92)}${par({ ...s, texto: s.texto || 'Então curte, comenta e compartilha com os amigos.' }, f)}
    ${s.acoes ? `<div style="display:flex;gap:18px">` : ''}${lista(s.acoes).map((a, k) => `<div style="flex:1;padding:26px 22px;border-radius:24px;background:${f.card};border:2px solid ${f.cardBorda};color:${f.escuro ? f.tit : C.tinta}"><div style="font-size:44px;line-height:1">${['🔖', '💌', '🙏'][k] || '✨'}</div><div style="margin-top:14px;font-weight:700;font-size:27px;line-height:1.3">${esc(a)}</div></div>`).join('')}${s.acoes ? '</div>' : ''}
    ${s.pergunta ? `<div style="padding:28px 34px;border-radius:26px;background:${f.escuro ? C.rosaForte : C.noite};color:#FFFFFF;font-weight:700;font-size:36px;line-height:1.35">${rico(s.pergunta, { dest: C.laranja })}</div>` : ''}`, 'top:130px;justify-content:center')}${base(i, n, f)}`,
};
const FOTO = new Set(['foto', 'cinema', 'moldura', 'vidro', 'fotonota']);
const PADRAO = { capa: 'turquesa', versiculo: 'noite', cta: 'turquesa' };

export const slides = post => {
  const n = post.slides.length;
  return { w: W, h: H, slides: post.slides.map((s, k) => { const f = fundo(s.fundo || (s.estilo === 'moldura' ? 'creme' : PADRAO[s.tipo]) || 'creme'); return `<div style="position:absolute;inset:0;background:${f.bg}"></div>${s.tipo === 'capa' && FOTO.has(s.estilo) ? '' : enfeite(f, W, H)}${(TIPOS[s.tipo] || TIPOS.texto)(s, f, k + 1, n)}`; }) };
};
