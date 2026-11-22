// Criativos de anúncio da linha "Revisão em Dicas" (feed 1080×1350 e stories 1080×1920), sem foto do autor.
// Cada layout segue um formato estático que funciona em Meta Ads e é diferente dos outros na estrutura:
// educativo (infográfico do peso da prova), crenca (crença x virada), postit (bilhete "feio" de urgência),
// faq (objeção "dá tempo?"), grade (páginas do material + preço), pegadinha (certo ou errado), versus (dois jeitos
// de revisar), pagina (uma dica real ampliada, com marca-texto), os nativos de story: enquete, caixinha e lembrete,
// e os simples-* (fundo liso, uma frase e a página real do PDF: pagina, duas, capas, painel, zoom, celular).
// Os textos de cada concurso ficam em produtos.json > cr.<layout>; `**negrito**` e `[[marca-texto]]` valem neles.
// Todo texto de conteúdo vem das dicas e do edital (nada de depoimento, número ou conversa inventados).
import { FONTES, T, I, M, PERFIL, TEMAS, esc, marca, tex, visto } from './tema.mjs';

export const FONTES_CR = FONTES + '&family=Caveat:wght@600;700';
const MAO = "font-family:'Caveat',cursive;font-weight:700";
const n3 = n => String(n).padStart(3, '0');

export function renderCriativo(cr, prod, dicas, img) {
  const c = TEMAS[prod.tema];
  const x = (prod.cr || {})[cr.layout] || {};
  const story = cr.formato === 'story';
  const W = 1080, H = story ? 1920 : 1350;
  // área segura: nos stories, topo e pé ficam livres para a interface do Instagram
  const topo = story ? 250 : 70, pe = story ? 330 : 70, lado = 76;
  const d = n => dicas[n];
  const r = (s, hl = c.claro) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\[\[(.+?)\]\]/g, `<span style="color:${hl}">$1</span>`);
  const br = (a, hl) => (Array.isArray(a) ? a : [a]).map(s => r(s, hl)).join('<br>');
  const textura = (op = .16, l = 108) => `<div style="position:absolute;inset:0;background-image:${tex(c, c.claro, op, l)}"></div><div style="position:absolute;inset:0;background:radial-gradient(90% 50% at 0% 100%,${c.escuro3} 0%,transparent 70%),radial-gradient(70% 40% at 100% 0%,${c.brilho} 0%,transparent 70%)"></div>`;
  const area = (html, extra = '') => `<div style="position:absolute;left:${lado}px;right:${lado}px;top:${topo}px;bottom:${pe}px;display:flex;flex-direction:column;${extra}">${html}</div>`;
  const selo = t => `<span style="align-self:flex-start;${M};font-size:23px;letter-spacing:.1em;text-transform:uppercase;background:${c.cor};color:${c.sobreCor};padding:11px 18px;border-radius:9px">${esc(t)}</span>`;
  const assin = (cor = '#fff', sub = c.claro) => `<div style="display:flex;align-items:center;justify-content:space-between">${marca(62, cor, sub, 'm' + cr.id)}<span style="${M};font-size:21px;letter-spacing:.12em;color:${sub}">${PERFIL}</span></div>`;
  const rotuloProduto = t => `<div style="text-align:right"><div style="${T};font-size:44px;line-height:1;color:#fff">Revisão em Dicas</div><div style="${M};font-size:20px;letter-spacing:.1em;color:${c.claro};margin-top:6px">${esc(t)}</div></div>`;
  const cartaoDica = (dc, px = 1, marcada = false) => `<div style="background:#fff;border-radius:${22 * px}px;display:grid;grid-template-columns:${116 * px}px 1fr;padding:${22 * px}px ${30 * px}px ${22 * px}px 0;box-shadow:0 30px 60px -28px rgba(0,0,0,.55)"><div style="text-align:center;border-right:2px solid ${c.linha};margin-right:${26 * px}px"><div style="${T};font-size:${54 * px}px;line-height:1;color:${c.corForte}">${n3(dc.n)}</div><div style="display:flex;justify-content:center;margin-top:${10 * px}px">${marcada ? visto(34 * px, c.ok, 3.6) : `<span style="width:${28 * px}px;height:${28 * px}px;border:3px solid ${c.tinta};border-radius:7px"></span>`}</div></div><div><div style="${I};font-weight:800;font-size:${30 * px}px;line-height:1.3;color:${c.tinta}">${esc(dc.r)}</div><div style="${I};font-size:${25 * px}px;line-height:1.4;color:${c.corpo2};margin-top:${8 * px}px">${esc(dc.e)}</div></div></div>`;
  const tituloSimples = (t, extra = '') => `<div style="${I};font-weight:800;font-size:${x.px || (story ? 62 : 56)}px;line-height:1.12;letter-spacing:-.02em;color:#141414;${extra}">${br(t, '#141414')}</div>`;

  const L = {
    // 1. Infográfico educativo: o peso das matérias na prova
    educativo: () => `<div style="position:absolute;inset:0;background:${c.papel}"></div>${area(`
      <div style="${M};font-size:24px;letter-spacing:.2em;text-transform:uppercase;color:${c.corForte}">${esc(x.kicker)}</div>
      <div style="${T};font-size:${story ? 118 : 104}px;line-height:.9;color:${c.tinta};margin-top:14px">${br(x.titulo, c.corForte)}</div>
      <div style="display:grid;grid-template-columns:repeat(${x.cards.length},1fr);gap:20px;margin-top:${story ? 60 : 40}px">
        ${x.cards.map(([n, a, b, t, f]) => `<div style="background:${f ? c.escuro : '#fff'};border:2px solid ${f ? c.escuro : c.linha};border-radius:26px;padding:30px ${x.cards.length > 2 ? 24 : 32}px"><div style="${T};font-size:${x.cards.length > 2 ? 120 : 150}px;line-height:.82;color:${f ? c.claro : c.tinta}">${esc(n)}</div><div style="${I};font-weight:800;font-size:${x.cards.length > 2 ? 26 : 29}px;line-height:1.2;color:${f ? '#fff' : c.tinta};margin-top:16px">${esc(a)}</div><div style="${I};font-size:${x.cards.length > 2 ? 23 : 26}px;color:${f ? 'rgba(255,255,255,.8)' : c.cinza};margin-top:4px">${esc(b)}</div><div style="${M};font-size:${x.cards.length > 2 ? 21 : 24}px;letter-spacing:.06em;color:${f ? c.claro : c.corForte};margin-top:18px;padding-top:16px;border-top:2px dashed ${f ? c.vazado : c.linha}">${esc(t)}</div></div>`).join('')}</div>
      <div style="margin-top:22px;background:#fff;border:2px solid ${c.linha};border-radius:26px;padding:26px 32px"><div style="display:flex;height:44px;border-radius:12px;overflow:hidden"><div style="width:${100 - x.barra[0]}%;background:${c.escuro3}"></div><div style="width:${x.barra[0]}%;background:${c.cor}"></div></div><div style="display:flex;justify-content:space-between;${I};font-weight:700;font-size:26px;color:${c.tinta};margin-top:14px"><span>${esc(x.barra[1])}</span><span style="color:${c.corForte}">${esc(x.barra[2])}</span></div></div>
      <div style="margin-top:auto"><div style="${I};font-size:30px;line-height:1.4;color:${c.tinta};margin-bottom:26px">${r(x.rodape)}</div>${assin(c.tinta, c.corForte)}</div>`)}`,

    // 2. Crença x virada
    crenca: () => `<div style="position:absolute;inset:0;background:${c.escuro}"></div>${textura()}${area(`
      ${selo(x.selo)}
      <div style="${T};font-size:${story ? 132 : 118}px;line-height:.9;color:rgba(255,255,255,.42);margin-top:34px;text-decoration:line-through;text-decoration-color:${c.cor};text-decoration-thickness:8px">${br(x.riscado)}</div>
      <div style="${T};font-size:${story ? 132 : 118}px;line-height:.9;color:#fff;margin-top:26px">${br(x.virada)}</div>
      <div style="display:grid;gap:18px;margin-top:${story ? 70 : 46}px">${cartaoDica(d(x.dicas[0]), .92, true)}<div style="transform:translateX(34px) rotate(1deg)">${cartaoDica(d(x.dicas[1]), .92)}</div></div>
      <div style="margin-top:auto"><div style="${I};font-size:30px;line-height:1.4;color:rgba(255,255,255,.86);margin-bottom:26px">${r(x.rodape)}</div>${assin()}</div>`)}`,

    // 3. Bilhete "feio": post-it de urgência sobre a página do material
    postit: () => `<div style="position:absolute;inset:0;background:#D9D2CB"></div>
      <img src="${img.pagina}" style="position:absolute;left:50%;top:${story ? 300 : 90}px;width:900px;transform:translateX(-50%) rotate(-3deg);box-shadow:0 40px 80px -30px rgba(0,0,0,.5);border-radius:10px">
      <div style="position:absolute;left:${story ? 150 : 170}px;top:${story ? 760 : 420}px;width:700px;background:#FFE66B;padding:54px 56px 62px;transform:rotate(3.5deg);box-shadow:0 34px 50px -22px rgba(0,0,0,.55),inset 0 -40px 50px -40px rgba(0,0,0,.12)">
        <div style="position:absolute;left:50%;top:-28px;width:200px;height:58px;margin-left:-100px;background:rgba(255,255,255,.55);transform:rotate(-4deg);box-shadow:0 2px 6px rgba(0,0,0,.12)"></div>
        <div style="${MAO};font-size:${x.px1 || 88}px;line-height:1;color:#1B1B1B">${br(x.linha1)}</div>
        <div style="${MAO};font-size:66px;line-height:1.08;color:#1B1B1B;margin-top:26px">${br(x.linha2)} <span style="color:#C0392B">!!</span></div>
        <svg width="560" height="26" viewBox="0 0 560 26" style="display:block;margin-top:8px"><path d="M4 16C90 2 170 24 260 12S440 4 556 14" fill="none" stroke="#C0392B" stroke-width="6" stroke-linecap="round"/></svg></div>
      <div style="position:absolute;left:${lado}px;right:${lado}px;bottom:${pe}px;background:${c.escuro};border-radius:26px;padding:26px 32px;display:flex;align-items:center;justify-content:space-between">${marca(58, '#fff', c.claro, 'm' + cr.id)}${rotuloProduto(x.rotulo)}</div>`,

    // 4. Objeção respondida: dá tempo? (plano do próprio material)
    faq: () => `<div style="position:absolute;inset:0;background:${c.papel}"></div>${area(`
      <div style="${M};font-size:24px;letter-spacing:.2em;text-transform:uppercase;color:${c.corForte}">${esc(x.kicker)}</div>
      <div style="${T};font-size:${story ? 124 : 110}px;line-height:.9;color:${c.tinta};margin-top:14px">${br(x.titulo)}</div>
      <div style="${I};font-weight:800;font-size:38px;color:${c.corForte};margin-top:22px">${esc(x.sub)}</div>
      <div style="display:grid;gap:${story ? 14 : 10}px;margin-top:22px">${x.dias.map((t, i) => `<div style="display:grid;grid-template-columns:${x.rotuloLargo || 118}px 1fr;align-items:center;background:#fff;border:2px solid ${i === x.dias.length - 1 ? c.cor : c.linha};border-radius:18px;padding:${story ? 20 : 14}px 26px"><span style="${M};font-size:21px;letter-spacing:.12em;color:${c.corForte}">${esc((x.rotulos || [])[i] || 'DIA ' + (i + 1))}</span><span style="${I};font-weight:700;font-size:29px;color:${c.tinta}">${esc(t)}</span></div>`).join('')}</div>
      <div style="margin-top:auto">${assin(c.tinta, c.corForte)}</div>`)}`,

    // 5. Grade: o que vem no material + preço
    grade: () => `<div style="position:absolute;inset:0;background:${c.escuro}"></div>${textura(.13)}${area(`
      ${selo(prod.selo)}
      <div style="${T};font-size:${story ? 128 : 112}px;line-height:.88;color:#fff;margin-top:26px">${br(x.titulo)}</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:${story ? 60 : 38}px">${x.itens.map(([k, t]) => `<div><div style="height:${story ? 300 : 230}px;border-radius:14px;overflow:hidden;background:#fff"><img src="${img[k]}" style="width:100%;display:block"></div><div style="${I};font-weight:700;font-size:21px;color:${c.claro};margin-top:9px">${esc(t)}</div></div>`).join('')}</div>
      <div style="margin-top:auto;display:flex;align-items:flex-end;justify-content:space-between"><div><div style="${M};font-size:21px;letter-spacing:.14em;color:${c.claro}">${esc(x.rotuloPreco)}</div><div style="${T};font-size:120px;line-height:.9;color:#fff"><span style="font-size:52px">R$ </span>${esc(prod.preco)}</div></div>${marca(58, '#fff', c.claro, 'm' + cr.id)}</div>`)}`,

    // 6. Pegadinha: certo ou errado, com uma dica real
    pegadinha: () => `<div style="position:absolute;inset:0;background:${c.cor}"></div><div style="position:absolute;inset:0;background-image:${tex(c, c.sobreCor === '#FFFFFF' ? '#fff' : c.escuro, .14, 108)}"></div>${area(`
      <span style="align-self:flex-start;${M};font-size:23px;letter-spacing:.14em;text-transform:uppercase;background:${c.escuro};color:#fff;padding:11px 18px;border-radius:9px">${esc(x.selo)}</span>
      <div style="background:#fff;border-radius:30px;padding:${story ? 60 : 46}px 50px;margin-top:34px;box-shadow:0 40px 70px -34px rgba(0,0,0,.5)"><div style="${I};font-weight:800;font-size:${story ? 56 : 50}px;line-height:1.22;color:${c.tinta}">“${esc(x.frase)}”</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:38px">${['CERTO', 'ERRADO'].map(t => `<div style="border:3px solid ${c.tinta};border-radius:18px;padding:22px;text-align:center;${T};font-size:52px;color:${c.tinta}">${t}</div>`).join('')}</div></div>
      <div style="${T};font-size:${story ? 96 : 84}px;line-height:.92;color:${c.sobreCor};margin-top:${story ? 60 : 40}px">A resposta é<br>a dica <span style="background:${c.escuro};color:#fff;padding:0 .14em">${esc(x.dica)}</span></div>
      <div style="margin-top:auto"><div style="${I};font-weight:600;font-size:30px;line-height:1.4;color:${c.sobreCor};margin-bottom:26px">${r(x.rodape)}</div>${assin(c.sobreCor, c.escuro)}</div>`)}`,

    // 7. Dois jeitos de revisar
    versus: () => `<div style="position:absolute;inset:0;background:${c.papel}"></div><div style="position:absolute;left:0;right:0;top:50%;bottom:0;background:${c.escuro}"></div><div style="position:absolute;left:0;right:0;top:50%;bottom:0;background-image:${tex(c, c.claro, .13, 108)}"></div>
      <div style="position:absolute;left:${lado}px;right:${lado}px;top:${topo}px;height:${H / 2 - topo - 50}px;display:flex;flex-direction:column;justify-content:center">
        <div style="${M};font-size:23px;letter-spacing:.18em;color:${c.cinza}">${esc(x.kicker)} · JEITO 1</div><div style="${T};font-size:${story ? 112 : 98}px;line-height:.9;color:${c.cinza};margin-top:10px">${br(x.j1)}</div>
        <div style="display:grid;gap:10px;margin-top:22px">${x.j1itens.map(t => `<div style="${I};font-size:30px;color:${c.cinza};display:flex;gap:14px;align-items:center"><span style="${T};font-size:34px;color:${c.carimbo}">✕</span>${esc(t)}</div>`).join('')}</div></div>
      <div style="position:absolute;left:50%;top:50%;width:128px;height:128px;margin:-64px 0 0 -64px;border-radius:50%;background:${c.cor};display:flex;align-items:center;justify-content:center;${T};font-size:54px;color:${c.sobreCor};border:8px solid ${c.papel}">VS</div>
      <div style="position:absolute;left:${lado}px;right:${lado}px;top:${H / 2 + 80}px;bottom:${pe}px;display:flex;flex-direction:column">
        <div style="${M};font-size:23px;letter-spacing:.18em;color:${c.claro}">${esc(x.kicker)} · JEITO 2</div><div style="${T};font-size:${story ? 112 : 98}px;line-height:.9;color:#fff;margin-top:10px">${br(x.j2)}</div>
        <div style="display:grid;gap:10px;margin-top:22px">${x.j2itens.map(t => `<div style="${I};font-weight:600;font-size:30px;color:#fff;display:flex;gap:14px;align-items:center">${visto(34, c.claro, 3.6)}${esc(t)}</div>`).join('')}</div>
        <div style="margin-top:auto">${assin()}</div></div>`,

    // 8. Uma dica real ampliada, com marca-texto
    pagina: () => `<div style="position:absolute;inset:0;background:${c.papel}"></div><div style="position:absolute;left:0;top:0;bottom:0;width:22px;background:${c.cor}"></div>${area(`
      <div style="${M};font-size:24px;letter-spacing:.2em;text-transform:uppercase;color:${c.corForte}">${esc(x.kicker)}</div>
      <div style="${T};font-size:230px;line-height:.78;color:transparent;-webkit-text-stroke:4px ${c.cor === '#F2C230' ? c.corForte : c.cor};margin-top:${story ? 60 : 36}px">${esc(x.n)}</div>
      <div style="${I};font-weight:800;font-size:${x.px || (story ? 88 : 84)}px;line-height:1.12;color:${c.tinta};margin-top:34px;letter-spacing:-.02em">${esc(x.frase).replace(/\[\[(.+?)\]\]/g, `<span style="background:linear-gradient(transparent 52%,${c.marcaTexto} 52%)">$1</span>`)}</div>
      <div style="${I};font-size:${story ? 46 : 44}px;line-height:1.36;color:${c.corpo2};margin-top:28px">${esc(x.sub).replace(/\*\*(.+?)\*\*/g, `<b style="color:${c.tinta}">$1</b>`)}</div>
      <div style="${MAO};font-size:62px;color:${c.corForte};transform:rotate(-3deg);margin-top:30px;align-self:flex-end">${esc(x.nota)}</div>
      <div style="margin-top:auto"><div style="${I};font-size:30px;line-height:1.4;color:${c.tinta};margin-bottom:26px">${r(x.rodape, c.tinta)}</div>${assin(c.tinta, c.corForte)}</div>`)}`,

    // 9. Nativo de story: texto do Instagram + enquete
    enquete: () => `<div style="position:absolute;inset:0;background:linear-gradient(160deg,${c.escuro3},${c.escuro} 70%)"></div>
      <div style="position:absolute;left:${lado}px;right:${lado}px;top:${topo + 90}px;text-align:center">
        <span style="${I};font-weight:800;font-size:66px;line-height:1.5;color:${c.sobreCor};background:${c.cor};padding:8px 26px;border-radius:18px;box-decoration-break:clone;-webkit-box-decoration-break:clone">${esc(x.faixa)}</span>
        <div style="${I};font-weight:700;font-size:54px;line-height:1.3;color:#fff;margin-top:70px">${br(x.pergunta)}</div></div>
      <div style="position:absolute;left:140px;right:140px;top:${topo + 640}px;background:#fff;border-radius:34px;padding:44px 40px 40px;box-shadow:0 30px 60px -20px rgba(0,0,0,.5)"><div style="${I};font-weight:800;font-size:44px;text-align:center;color:#111">${esc(x.titulo)}</div><div style="display:grid;gap:16px;margin-top:30px">${x.opcoes.map(t => `<div style="border:3px solid #E3E3E3;border-radius:22px;padding:26px;text-align:center;${I};font-weight:700;font-size:40px;color:#111">${esc(t)}</div>`).join('')}</div></div>
      <div style="position:absolute;left:${lado}px;right:${lado}px;bottom:${pe + 20}px;text-align:center"><span style="${I};font-weight:700;font-size:40px;line-height:1.6;color:#111;background:#fff;padding:8px 22px;border-radius:14px;box-decoration-break:clone;-webkit-box-decoration-break:clone">${esc(x.rodape)}</span></div>`,

    // 10. Nativo de story: caixinha de perguntas respondida
    caixinha: () => `<div style="position:absolute;inset:0;background:${c.papel}"></div><div style="position:absolute;inset:0;background-image:${tex(c, c.corForte, .1, 108)}"></div>
      <div style="position:absolute;left:150px;right:150px;top:${topo + 60}px;border-radius:34px;overflow:hidden;box-shadow:0 30px 60px -24px rgba(0,0,0,.35)"><div style="background:${c.escuro};color:#fff;${I};font-weight:700;font-size:36px;text-align:center;padding:28px 30px">${esc(x.cab)}</div><div style="background:#fff;${I};font-weight:600;font-size:44px;line-height:1.3;text-align:center;color:#111;padding:44px 40px">${esc(x.pergunta)}</div></div>
      <div style="position:absolute;left:${lado}px;right:${lado}px;top:${topo + 520}px"><div style="${I};font-weight:800;font-size:58px;line-height:1.25;color:${c.tinta}">${esc(x.titulo)}</div>
        <div style="display:grid;gap:16px;margin-top:30px">${x.itens.map((t, i) => `<div style="display:grid;grid-template-columns:70px 1fr;align-items:center;background:#fff;border:2px solid ${c.linha};border-radius:22px;padding:24px 28px"><span style="${T};font-size:52px;line-height:1;color:${c.corForte}">${i + 1}</span><span style="${I};font-weight:700;font-size:35px;line-height:1.25;color:${c.tinta}">${esc(t)}</span></div>`).join('')}</div>
        <div style="${I};font-size:36px;line-height:1.4;color:${c.tinta};margin-top:34px">${r(x.fecho, c.tinta)}</div></div>`,

    // 11. Nativo de story: tela bloqueada com o lembrete da prova
    lembrete: () => `<div style="position:absolute;inset:0;background:linear-gradient(180deg,${c.escuroLembrete} 0%,${c.escuro} 60%,#050805 100%)"></div><div style="position:absolute;inset:0;background-image:${tex(c, c.claro, .07, 150)}"></div>
      <div style="position:absolute;left:0;right:0;top:${topo + 20}px;text-align:center;color:#fff"><div style="${I};font-weight:600;font-size:42px;opacity:.9">${esc(x.data)}</div><div style="${I};font-weight:700;font-size:250px;line-height:1;letter-spacing:-.04em">${esc(x.hora || '21:47')}</div></div>
      <div style="position:absolute;left:60px;right:60px;top:${topo + 500}px;display:grid;gap:18px">${x.notifs.map(([app, q, t, s]) => `<div style="background:rgba(255,255,255,.2);backdrop-filter:blur(20px);border-radius:38px;padding:30px 34px;display:grid;grid-template-columns:84px 1fr;gap:24px;align-items:center"><div style="width:84px;height:84px;border-radius:20px;background:#fff;display:flex;align-items:center;justify-content:center"><span style="width:44px;height:44px;border-radius:${app === 'Calendário' ? 8 : 50}%;background:${app === 'Calendário' ? '#FF3B30' : c.cor}"></span></div><div><div style="display:flex;justify-content:space-between;${I};font-size:27px;color:rgba(255,255,255,.7)"><span>${esc(app)}</span><span>${esc(q)}</span></div><div style="${I};font-weight:700;font-size:36px;color:#fff;margin-top:2px">${esc(t)}</div><div style="${I};font-size:31px;line-height:1.3;color:rgba(255,255,255,.88);margin-top:2px">${esc(s)}</div></div></div>`).join('')}</div>
      <div style="position:absolute;left:${lado}px;right:${lado}px;bottom:${pe + 10}px;display:flex;align-items:center;justify-content:space-between">${marca(58, '#fff', c.claro, 'm' + cr.id)}${rotuloProduto(x.rotulo)}</div>`,

    // ---------- Simples: pouco design, o material é a arte ----------
    'simples-pagina': () => `<div style="position:absolute;inset:0;background:#ECE9E6"></div>${area(`
      ${tituloSimples(x.titulo, 'white-space:nowrap')}
      <div style="flex:1;min-height:0;margin-top:34px;overflow:hidden;border-radius:14px 14px 0 0;box-shadow:0 30px 70px -30px rgba(0,0,0,.45)"><img src="${img[x.img || 'zoom']}" style="width:100%;display:block"></div>
      <div style="${I};font-weight:600;font-size:28px;color:#141414;padding-top:22px;display:flex;justify-content:space-between"><span>${esc(x.esq)}</span><span>${esc(x.dir)}</span></div>`)}`,
    'simples-duas': () => `<div style="position:absolute;inset:0;background:#fff"></div>${area(`
      ${tituloSimples(x.titulo)}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-top:${story ? 70 : 40}px">${x.itens.map(([k, t]) => `<div><div style="border:2px solid #DCDCDC;border-radius:10px;overflow:hidden;height:${story ? 800 : 640}px"><img src="${img[k]}" style="width:100%;display:block"></div><div style="${I};font-weight:700;font-size:25px;line-height:1.3;color:#141414;margin-top:14px">${esc(t)}</div></div>`).join('')}</div>
      <div style="margin-top:auto;${I};font-weight:600;font-size:28px;color:#141414">${esc(x.rodape)}</div>`)}`,
    'simples-capas': () => { const cs = x.capas || ['capa2', 'capa1']; const pos = cs.length === 3 ? [[600, 120, 7], [360, 160, -1], [110, 210, -6]] : [[480, 150, 6], [120, 190, -4]]; return `<div style="position:absolute;inset:0;background:#F3F1EE"></div>
      ${cs.map((k, i) => `<img src="${img[k]}" style="position:absolute;left:${pos[i][0]}px;top:${pos[i][1] + (story ? 270 : 0)}px;width:${cs.length === 3 ? 400 : story ? 500 : 480}px;transform:rotate(${pos[i][2]}deg);border-radius:8px;box-shadow:0 40px 70px -30px rgba(0,0,0,.5)">`).join('')}
      <div style="position:absolute;left:${lado}px;right:${lado}px;bottom:${pe}px">${tituloSimples(x.titulo)}<div style="${I};font-size:32px;line-height:1.35;color:#3A3A3A;margin-top:14px">${esc(x.sub)} <b style="color:#141414;white-space:nowrap">R$ ${esc(prod.preco)}</b></div></div>`; },
    'simples-painel': () => `<div style="position:absolute;inset:0;background:#ECE9E6"></div>${area(`
      <div style="flex:1;min-height:0;overflow:hidden;border-radius:14px;box-shadow:0 30px 70px -30px rgba(0,0,0,.45);background:${c.papel}"><img src="${img[x.img || 'painel']}" style="width:100%;display:block"></div>
      ${tituloSimples(x.titulo, 'margin-top:34px')}
      <div style="${I};font-weight:600;font-size:28px;color:#3A3A3A;margin-top:16px">${esc(x.rodape)}</div>`)}`,
    'simples-zoom': () => `<div style="position:absolute;inset:0;background:${c.papel}"></div>
      <img src="${img[x.img || 'zoom']}" style="position:absolute;left:-60px;top:${story ? 40 : -150}px;width:1900px;max-width:none">
      <div style="position:absolute;left:0;right:0;bottom:0;height:${pe + 380}px;background:linear-gradient(transparent,#141414 ${story ? 24 : 50}%)"></div>
      <div style="position:absolute;left:${lado}px;right:${lado}px;bottom:${pe}px"><div style="${I};font-weight:800;font-size:${story ? 60 : 54}px;line-height:1.12;letter-spacing:-.02em;color:#fff">${br(x.titulo, '#fff')}</div><div style="${I};font-weight:600;font-size:28px;color:rgba(255,255,255,.85);margin-top:10px">${esc(x.rodape)}</div></div>`,
    'simples-celular': () => `<div style="position:absolute;inset:0;background:#fff"></div>${area(`
      ${tituloSimples(x.titulo)}
      <div style="${I};font-size:32px;line-height:1.35;color:#3A3A3A;margin-top:12px">${esc(x.sub)}</div>
      <div style="flex:1;min-height:0;margin-top:34px;display:flex;justify-content:center;overflow:hidden"><div style="width:560px;border:14px solid #141414;border-bottom:0;border-radius:64px 64px 0 0;overflow:hidden;background:${c.papel};position:relative"><div style="position:absolute;left:50%;top:14px;width:150px;height:34px;margin-left:-75px;background:#141414;border-radius:20px;z-index:2"></div><img src="${img[x.img || 'pagina']}" style="width:1040px;max-width:none;margin:36px 0 0 -40px;display:block"></div></div>
      <div style="${I};font-weight:600;font-size:28px;color:#141414;border-top:2px solid #141414;padding-top:20px">${esc(x.rodape)} · R$ ${esc(prod.preco)}</div>`)}`,
  };
  const corpo = (L[cr.layout] || (() => { throw new Error('layout desconhecido: ' + cr.layout); }))();
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><link href="${FONTES_CR}" rel="stylesheet"><style>*{box-sizing:border-box}body{margin:0}p{margin:0}</style></head><body><div id="arte" style="position:relative;width:${W}px;height:${H}px;overflow:hidden">${corpo}</div><script>document.fonts.ready.then(() => { window.__pronto = true; });</script></body></html>`;
  return { html, W, H };
}
