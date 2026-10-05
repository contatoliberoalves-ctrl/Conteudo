// Molde "Constitucional Criativos" (@constitucionalgabaritado): criativos de anúncio/divulgação em tela única,
// para feed (1080×1350) e stories (1080×1920), nas cores do perfil (base quase preta, verde, verde-claro,
// gelo; Bebas Neue + Poppins). Layouts inspirados em formatos que convertem: manchete com foto, etiquetas de
// story nativo, nota do iPhone, tweet, oferta com "Saiba mais" e lista de benefícios com preço.
// Fotos do autor (1080×1350) vêm de fotos/ ou de ../carrossel-explicativo/fotos (fora do git).

const COR = { base: '#1c1f1e', verde: '#3b4c49', cartao: '#2f3d3a', claro: '#9be0a3', medio: '#3f9a4d', gelo: '#f6f7f6', texto: '#1f2a28' };
const W = 1080;
const ALTURA = { feed: 1350, story: 1920 };
const TITULO = "font-family:'Bebas Neue',sans-serif;font-weight:400;text-transform:uppercase;letter-spacing:.01em";
const TEXTO = "font-family:'Poppins','Noto Color Emoji',sans-serif";
const IOS = "font-family:'Inter','Noto Color Emoji',sans-serif";
const PERFIL = '@constitucionalgabaritado';
const RUIDO = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .35 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;
const ESCURO = `radial-gradient(90% 55% at 50% 28%,${COR.verde} 0%,#26302e 55%,#141716 100%)`;
const GRADE = `linear-gradient(rgba(155,224,163,.07) 2px,transparent 2px) 0 0/54px 54px,linear-gradient(90deg,rgba(155,224,163,.07) 2px,transparent 2px) 0 0/54px 54px`;

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const lista = v => (v == null ? [] : Array.isArray(v) ? v : [v]);
// **negrito**, {{destaque}} (cor do layout) e ~~riscado~~ (preço "de").
const rico = (s, cor) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b style="font-weight:800">$1</b>').replace(/\{\{(.+?)\}\}/g, `<span style="color:${cor}">$1</span>`)
  .replace(/~~(.+?)~~/g, '<s style="opacity:.7;text-decoration-thickness:4px">$1</s>');
const textura = (op = .35, modo = 'overlay') => `<div style="position:absolute;inset:0;pointer-events:none;background-image:${RUIDO};opacity:${op};mix-blend-mode:${modo};z-index:30"></div>`;
const foto = (c, n) => (c._fotos || {})[n] || '';
// Foto do autor no topo (1080×1350), escurecendo para a base embaixo. "fotoY" desloca (px), "fotoEscala" amplia.
const fotoTopo = (p, c, H, ate = .55) => {
  const src = foto(c, p.foto);
  if (!src) return `<div style="position:absolute;left:0;right:0;top:0;height:1350px;display:flex;align-items:center;justify-content:center;color:${COR.claro};${TEXTO};font-size:28px">foto em fotos/${esc(p.foto || '')}</div>`;
  return `<img src="${src}" style="position:absolute;left:0;top:${p.fotoY ?? 0}px;width:1080px;height:1350px;object-fit:cover;transform:scale(${p.fotoEscala || 1});transform-origin:50% 20%;filter:saturate(.92)">
    <div style="position:absolute;left:0;right:0;top:0;height:${H}px;background:linear-gradient(180deg,rgba(20,23,22,0) ${Math.round(ate * 100 - 25)}%,rgba(20,23,22,.86) ${Math.round(ate * 100)}%,#141716 ${Math.min(100, Math.round(ate * 100 + 18))}%);z-index:1"></div>`;
};
const marca = (cor = '#fff') => `<div style="display:flex;align-items:center;gap:16px">
    <span style="width:78px;height:78px;border-radius:20px;background:linear-gradient(150deg,${COR.claro},${COR.medio});display:flex;align-items:center;justify-content:center;${TITULO};font-size:46px;color:${COR.base}">CG</span>
    <span style="${TEXTO};font-size:34px;font-weight:700;line-height:1;color:${cor}">constitucional<br><span style="color:${COR.claro}">gabaritado</span></span></div>`;
const arroba = (cor, baixo) => `<div style="position:absolute;left:0;right:0;bottom:${baixo}px;text-align:center;${TEXTO};font-size:24px;font-weight:600;letter-spacing:.08em;color:${cor};z-index:20">${PERFIL}</div>`;

const LAYOUTS = {
  // Ref. "Como criar um produto digital lucrativo do zero": foto no alto, título empilhado com uma linha em
  // degradê verde, acento manuscrito e linha de apoio.
  manchete(p, c, H, story) {
    const t = lista(p.linhas);
    return `<div style="position:absolute;inset:0;background:#141716"></div>${fotoTopo(p, c, H, story ? .62 : .55)}
      <div data-area style="position:absolute;left:60px;right:60px;bottom:${story ? 330 : 110}px;display:flex;flex-direction:column;align-items:center;text-align:center;z-index:4">
        ${t.map((l, i) => i === p.destaque ? `<div style="${TITULO};font-size:${p.td || 190}px;line-height:.86;background:linear-gradient(180deg,#d6f8d9,${COR.claro} 50%,${COR.medio});-webkit-background-clip:text;background-clip:text;color:transparent">${esc(l)}</div>`
          : `<div style="${TITULO};font-size:${p.ts || 104}px;line-height:.92;color:#fff">${esc(l)}</div>`).join('')}
        ${p.acento ? `<div style="align-self:flex-end;margin:-4px 30px 0 0;font-family:'Caveat',cursive;font-weight:700;font-size:66px;line-height:1;color:#fff;transform:rotate(-6deg)">${esc(p.acento)}</div>` : ''}
        ${p.sub ? `<div style="${TEXTO};font-size:34px;font-weight:500;line-height:1.3;color:#DDE7E2;margin-top:18px;max-width:880px">${rico(p.sub, COR.claro)}</div>` : ''}
      </div>${p.semArroba ? '' : arroba('rgba(155,224,163,.85)', story ? 230 : 44)}${textura()}`;
  },
  // Ref. "Rápido antes que saia do ar": etiquetas do texto nativo do story (máquina de escrever), brancas e a
  // última em verde, sobre a foto.
  etiquetas(p, c, H, story) {
    const src = foto(c, p.foto);
    const fundo = src ? `<img src="${src}" style="position:absolute;left:0;top:0;width:1080px;height:${H}px;object-fit:cover;object-position:${esc(p.fotoPos || 'center top')}"><div style="position:absolute;inset:0;background:rgba(20,23,22,.28)"></div>` : `<div style="position:absolute;inset:0;background:${ESCURO}"></div>`;
    const blocos = lista(p.etiquetas).map((b, i, arr) => {
      const ultimo = i === arr.length - 1;
      return `<div style="display:flex;flex-direction:column;align-items:center">${lista(b).map(l => `<span style="display:inline-block;background:${ultimo ? COR.medio : '#fff'};color:${ultimo ? '#fff' : '#000'};font-family:'Courier Prime','Noto Color Emoji',monospace;font-weight:700;font-size:${p.tl || 44}px;line-height:1.18;padding:4px 16px;border-radius:6px;text-align:center">${esc(l)}</span>`).join('')}</div>`;
    }).join('');
    return `${fundo}<div data-area style="position:absolute;left:60px;right:60px;top:${p.etqTopo ?? (story ? 620 : 470)}px;bottom:${story ? 360 : 90}px;display:flex;flex-direction:column;justify-content:${p.etqJust || 'center'};align-items:center;gap:${story ? 40 : 26}px;z-index:4">${blocos}</div>`;
  },
  // Ref. nota do iPhone: barra de ícones, frase grande com o fim em verde e o fecho.
  nota(p, c, H, story) {
    const tr = 'stroke="#111" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"';
    const bola = (svg, bg = '#fff') => `<span style="width:76px;height:76px;border-radius:50%;background:${bg};display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.06)">${svg}</span>`;
    const topo = story ? 300 : 110;
    return `<div style="position:absolute;inset:0;background:#F2F2F7"></div>
      <div style="position:absolute;left:70px;right:70px;top:${topo}px;display:flex;justify-content:space-between;align-items:center;z-index:3">
        ${bola(`<svg width="30" height="30" viewBox="0 0 30 30"><path d="M19 5 9 15l10 10" ${tr}/></svg>`)}
        <div style="display:flex;gap:16px;align-items:center">
          <div style="display:flex;gap:6px;background:#fff;border-radius:40px;padding:0 10px;box-shadow:0 2px 8px rgba(0,0,0,.06)">
            ${['<path d="M10 8 5 13l5 5M5 13h13a7 7 0 0 1 0 14h-3" ' + tr + '/>', '<path d="M15 4v15M9 10l6-6 6 6M7 15v10h16V15" ' + tr + '/>', '<circle cx="7" cy="15" r="2" fill="#111"/><circle cx="15" cy="15" r="2" fill="#111"/><circle cx="23" cy="15" r="2" fill="#111"/>'].map(d => `<span style="width:72px;height:76px;display:flex;align-items:center;justify-content:center"><svg width="30" height="30" viewBox="0 0 30 30">${d}</svg></span>`).join('')}
          </div>
          ${bola(`<svg width="34" height="34" viewBox="0 0 30 30"><path d="M7 15.5 12.5 21 23 9" stroke="#fff" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`, COR.medio)}
        </div>
      </div>
      <div data-area style="position:absolute;left:80px;right:80px;top:${topo + 150}px;bottom:${story ? 520 : 260}px;display:flex;flex-direction:column;justify-content:center;gap:40px;z-index:3">
        <div style="${IOS};font-size:${p.tf || (story ? 88 : 80)}px;font-weight:800;line-height:1.13;letter-spacing:-.025em;color:#111">${rico(p.frase, COR.medio)}</div>
        ${p.fecho ? `<div style="${IOS};font-size:${story ? 56 : 52}px;font-weight:400;color:#111;letter-spacing:-.01em">${rico(p.fecho, COR.medio)}</div>` : ''}
      </div>
      <div style="position:absolute;left:80px;right:80px;bottom:${story ? 330 : 90}px;height:96px;background:#fff;border-radius:48px;display:flex;justify-content:space-around;align-items:center;box-shadow:0 2px 10px rgba(0,0,0,.05);z-index:3">
        <span style="${IOS};font-size:34px;color:#111">Aa</span>
        <svg width="40" height="40" viewBox="0 0 30 30"><circle cx="6" cy="9" r="2.4" ${tr}/><circle cx="6" cy="21" r="2.4" ${tr}/><path d="M12 9h13M12 21h13" ${tr}/></svg>
        <svg width="40" height="40" viewBox="0 0 30 30"><rect x="4" y="6" width="22" height="18" rx="3" ${tr}/><path d="M4 12h22M4 18h22M12 6v18" ${tr}/></svg>
        <svg width="40" height="40" viewBox="0 0 30 30"><path d="M20 9 11 18a3 3 0 0 0 4 4l9-9a5 5 0 0 0-7-7l-9 9a7 7 0 0 0 10 10l7-7" ${tr}/></svg>
        <svg width="40" height="40" viewBox="0 0 30 30"><circle cx="15" cy="15" r="11" ${tr}/><path d="M11 20l4-10 4 10M12.5 16.5h5" ${tr}/></svg>
      </div>`;
  },
  // Ref. tweet: avatar (foto do autor recortada no rosto), nome com selo, @, frase com destaque e fecho.
  tweet(p, c, H, story) {
    const src = foto(c, p.avatar);
    const av = src ? `<img src="${src}" style="width:100%;height:100%;object-fit:cover;object-position:${esc(p.avatarPos || '50% 18%')};transform:scale(${p.avatarZoom || 2.2});transform-origin:${esc(p.avatarPos || '50% 18%')}">`
      : `<div style="width:100%;height:100%;background:${COR.verde};display:flex;align-items:center;justify-content:center;${TITULO};font-size:50px;color:${COR.claro}">CG</div>`;
    return `<div style="position:absolute;inset:0;background:#fff"></div>
      <div data-area style="position:absolute;left:80px;right:80px;top:${story ? 300 : 110}px;bottom:${story ? 360 : 110}px;display:flex;flex-direction:column;justify-content:center;gap:52px;z-index:3">
        <div style="display:flex;align-items:center;gap:22px">
          <div style="width:112px;height:112px;border-radius:50%;overflow:hidden;flex:none">${av}</div>
          <div style="flex:1;${IOS}"><div style="display:flex;align-items:center;gap:10px;font-size:38px;font-weight:700;color:#111">${esc(p.nome || 'Líbero Filho')}
            <svg width="36" height="36" viewBox="0 0 24 24"><path d="M12 1.5l2.6 1.9 3.2-.2 1 3 2.7 1.8-1 3.1 1 3-2.7 1.9-1 3-3.2-.2L12 22.5l-2.6-1.9-3.2.2-1-3-2.7-1.9 1-3-1-3.1L5.2 6.2l1-3 3.2.2z" fill="${COR.medio}"/><path d="M7.8 12.2l2.8 2.8 5.6-5.8" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
            ${p.semArroba ? '' : `<div style="font-size:32px;color:#6B6B70;margin-top:2px">${esc(p.arroba || PERFIL)}</div>`}</div>
          <span style="font-size:44px;color:#6B6B70;letter-spacing:2px;align-self:flex-start">•••</span>
        </div>
        <div style="${IOS};font-size:${p.tf || (story ? 84 : 76)}px;font-weight:800;line-height:1.12;letter-spacing:-.03em;color:#111">${rico(p.frase, COR.medio)}</div>
        ${p.fecho ? `<div style="${IOS};font-size:52px;font-weight:400;color:#111;letter-spacing:-.01em">${rico(p.fecho, COR.medio)}</div>` : ''}
      </div>`;
  },
  // Ref. "Inscrições abertas": foto à esquerda, marca e chamada gigante à direita, caixa com o preço, linha de
  // apoio e o painel de ação na base.
  oferta(p, c, H, story) {
    const src = foto(c, p.foto);
    const painel = story ? 380 : 250;
    return `<div style="position:absolute;inset:0;background:${ESCURO}"></div>
      ${src ? `<img src="${src}" style="position:absolute;left:${story ? -300 : -330}px;top:${story ? 330 : 120}px;width:${story ? 1000 : 900}px;height:${story ? 1250 : 1125}px;object-fit:cover;z-index:1;-webkit-mask-image:linear-gradient(90deg,#000 55%,transparent 82%),linear-gradient(180deg,#000 70%,transparent 95%);-webkit-mask-composite:source-in;mask-composite:intersect">` : ''}
      <div data-area style="position:absolute;left:${story ? 400 : 430}px;right:60px;top:${story ? 290 : 90}px;display:flex;flex-direction:column;align-items:flex-start;gap:${story ? 26 : 18}px;z-index:4">
        ${marca()}
        <div style="${TITULO};font-size:${p.ts || (story ? 190 : 170)}px;line-height:.86;color:#fff;margin-top:12px">${lista(p.linhas).map(l => rico(l, COR.claro)).join('<br>')}</div>
        ${p.caixa ? `<div style="border:4px solid ${COR.claro};border-radius:14px;padding:8px 20px 4px;${TITULO};font-size:${story ? 66 : 58}px;line-height:1;color:${COR.claro}">${rico(p.caixa, '#fff')}</div>` : ''}
        ${p.sub ? `<div style="${TEXTO};font-size:30px;font-style:italic;font-weight:500;color:#DDE7E2">${esc(p.sub)}</div>` : ''}
        ${p.prova ? `<div style="${TITULO};font-size:${story ? 60 : 50}px;line-height:1;color:#fff;margin-top:${story ? 30 : 12}px">${lista(p.prova).map(l => rico(l, COR.claro)).join('<br>')}</div>` : ''}
      </div>
      <div style="position:absolute;left:${story ? 120 : 70}px;right:${story ? 120 : 70}px;bottom:0;height:${painel}px;background:linear-gradient(160deg,${COR.claro},${COR.medio});border-radius:40px 40px 0 0;padding:${story ? 60 : 44}px 56px;z-index:5;${TEXTO};font-size:${story ? 46 : 40}px;font-weight:700;line-height:1.2;color:${COR.base};text-align:center">${rico(p.acao || 'Toque em “Saiba mais” e garanta sua vaga.', '#fff')}</div>
      ${textura(.3)}`;
  },
  // Lista de benefícios (✅) com título, preço e botão; foto opcional no canto.
  lista(p, c, H, story) {
    const src = foto(c, p.foto);
    const itens = lista(p.itens);
    return `<div style="position:absolute;inset:0;background:#141716"></div><div style="position:absolute;inset:0;background:${GRADE}"></div>
      ${src ? `<img src="${src}" style="position:absolute;right:${story ? -170 : -60}px;top:${story ? 250 : 0}px;width:${story ? 640 : 560}px;height:${story ? 800 : 700}px;object-fit:cover;z-index:1;-webkit-mask-image:linear-gradient(270deg,#000 35%,transparent 80%),linear-gradient(180deg,#000 50%,transparent 88%);-webkit-mask-composite:source-in;mask-composite:intersect">` : ''}
      <div data-area style="position:absolute;left:70px;right:70px;top:${story ? 290 : 80}px;bottom:${story ? 340 : 70}px;display:flex;flex-direction:column;gap:${story ? 24 : 16}px;z-index:4">
        <div style="${TEXTO};font-size:26px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:${COR.claro}">${esc(p.kicker || 'Vagas abertas')}</div>
        <div style="${TITULO};font-size:${p.ts || (story ? 150 : 128)}px;line-height:.86;color:#fff">${lista(p.linhas).map(l => rico(l, COR.claro)).join('<br>')}</div>
        <div style="display:flex;flex-direction:column;gap:${story ? 14 : 8}px;margin-top:${story ? 30 : 10}px;max-width:${src && !story ? 660 : 940}px">
          ${itens.map(it => `<div style="display:flex;gap:16px;align-items:center;background:rgba(47,61,58,.82);border:1px solid rgba(155,224,163,.18);border-radius:16px;padding:${story ? '16px 22px' : '10px 18px'}">
            <span style="flex:none;width:${story ? 40 : 34}px;height:${story ? 40 : 34}px;border-radius:10px;background:${COR.medio};color:#fff;display:flex;align-items:center;justify-content:center;font-size:${story ? 26 : 22}px;font-weight:800">✓</span>
            <span style="${TEXTO};font-size:${p.ti || (story ? 32 : 28)}px;font-weight:500;line-height:1.2;color:#fff">${rico(it, COR.claro)}</span></div>`).join('')}
        </div>
        <div style="margin-top:auto;display:flex;align-items:center;justify-content:space-between;gap:20px">
          ${p.preco ? `<div style="${TITULO};font-size:${story ? 72 : 60}px;line-height:1;color:#fff">${rico(p.preco, COR.claro)}</div>` : ''}
          <span style="background:${COR.claro};color:${COR.base};${TEXTO};font-size:${story ? 34 : 30}px;font-weight:800;border-radius:44px 44px 44px 0;padding:18px 34px;white-space:nowrap">${esc(p.botao || 'Quero minha vaga')}</span>
        </div>
      </div>${textura(.3)}`;
  },
};

export function renderCriativo(c) {
  const story = c.formato === 'story';
  const H = ALTURA[c.formato] || ALTURA.feed;
  const avisos = [];
  if (!LAYOUTS[c.layout]) avisos.push(`layout "${c.layout}" não existe (${Object.keys(LAYOUTS).join(', ')})`);
  const corpo = (LAYOUTS[c.layout] || LAYOUTS.manchete)(c, c, H, story);
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Poppins:ital,wght@0,500;0,600;0,700;0,800;1,500&family=Inter:wght@400;700;800&family=Caveat:wght@700&family=Courier+Prime:wght@700&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box}body{margin:0}</style></head><body>
<div id="slide-1" style="position:relative;width:${W}px;height:${H}px;overflow:hidden">${corpo}</div></body></html>`;
  return { html, largura: W, altura: H, avisos };
}
