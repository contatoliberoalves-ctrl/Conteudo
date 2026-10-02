// Molde "Ética Criativos" (@eticagabaritadanaoba): criativos de anúncio/divulgação em tela única, para feed
// (1080×1350) e stories (1080×1920), na identidade do Carrossel Ética (vinho, rosa, branco). Layouts inspirados
// em formatos que convertem: manchete com o app no celular, etiquetas de story "nativo", nota do iPhone, tweet,
// oferta com "Saiba mais" e plano do dia com as missões do app. No lugar de foto de pessoa, o celular com a tela
// do app Ética Gabaritada (desenhada aqui); com "foto" (em fotos/, fora do git) a foto entra no fundo.
import { COR } from '../carrossel-etica/template.mjs';

const W = 1080;
const ALTURA = { feed: 1350, story: 1920 };
const TITULO = "font-family:'Big Shoulders Display',sans-serif;font-weight:900;text-transform:uppercase";
const TEXTO = "font-family:'Schibsted Grotesk','Noto Color Emoji',sans-serif";
const IOS = "font-family:'Inter','Noto Color Emoji',sans-serif";
const PERFIL = '@eticagabaritadanaoba';
const RUIDO = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .35 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;
const ESCURO = `radial-gradient(90% 55% at 50% 28%,${COR.vinhoMedio} 0%,${COR.vinhoEscuro} 55%,#1A0610 100%)`;
const DEGRADE = `radial-gradient(135% 95% at 100% 0%,${COR.rosa} 0%,#C94A82 26%,${COR.vinhoMedio} 56%,${COR.vinhoEscuro} 100%)`;

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const lista = v => (v == null ? [] : Array.isArray(v) ? v : [v]);
// **negrito** e {{destaque}} (cor de destaque do layout).
const rico = (s, cor) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b style="font-weight:800">$1</b>').replace(/\{\{(.+?)\}\}/g, `<span style="color:${cor}">$1</span>`);
const textura = (op = .4, modo = 'overlay') => `<div style="position:absolute;inset:0;pointer-events:none;background-image:${RUIDO};opacity:${op};mix-blend-mode:${modo};z-index:30"></div>`;
const foto = (c, n) => (c._fotos || {})[n] || '';

// Tela do app Ética Gabaritada (390×844, como um iPhone), reproduzindo o card do desafio e as missões.
function telaApp(a = {}) {
  const v = a.progresso ?? 60, r = 34, circ = 2 * Math.PI * r;
  const missoes = lista(a.missoes || [['📖', 'Estatuto + Código de Ética', 'Leia os artigos'], ['📝', 'Banco de questões', 'Resolva 56 questões'], ['⚡', 'Revisão', 'Revise 10 dicas']]);
  return `<div style="width:390px;height:844px;background:#FBF7F9;${TEXTO};overflow:hidden;position:relative">
    <div style="height:150px;background:linear-gradient(160deg,${COR.vinho},${COR.vinhoEscuro});padding:62px 22px 0;color:#fff">
      <div style="font-size:13px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${COR.rosaSuave}">Desafio · OAB</div>
      <div style="font-size:24px;font-weight:800;margin-top:4px">Ética Gabaritada</div>
    </div>
    <div style="margin:-22px 14px 0;background:linear-gradient(160deg,${COR.rosaClaro},#fff 70%);border-radius:22px;padding:20px;box-shadow:0 10px 26px rgba(90,20,48,.14);position:relative">
      <div style="display:flex;justify-content:space-between;gap:10px">
        <div style="flex:1">
          <div style="font-size:12px;font-weight:800;letter-spacing:.14em;color:${COR.magenta}">✦ ${esc(a.dia || 'DIA 5 DE 5')}</div>
          <div style="font-size:21px;font-weight:800;line-height:1.15;color:${COR.tinta};margin-top:8px">${esc(a.tema || 'Sanções, processo disciplinar e OAB')}</div>
          <div style="font-size:13px;color:${COR.cinza};margin-top:6px">Estatuto + Código de Ética</div>
        </div>
        <div style="position:relative;width:84px;height:84px;flex:none"><svg width="84" height="84" style="transform:rotate(-90deg)"><circle cx="42" cy="42" r="${r}" fill="none" stroke="${COR.rosaClaro}" stroke-width="9"/><circle cx="42" cy="42" r="${r}" fill="none" stroke="${COR.magenta}" stroke-width="9" stroke-linecap="round" stroke-dasharray="${circ * v / 100} ${circ}"/></svg>
          <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:17px;font-weight:800;color:${COR.vinho}">${v}%</div></div>
      </div>
      <div style="display:inline-block;margin-top:14px;background:${COR.rosaClaro};color:${COR.vinho};border-radius:999px;padding:6px 14px;font-size:12px;font-weight:700">Rota 5 dias · 56 questões/dia</div>
    </div>
    <div style="padding:20px 14px 0;font-size:13px;font-weight:800;letter-spacing:.12em;color:${COR.vinho}">MISSÕES DE HOJE</div>
    ${missoes.map(([ic, rot, tit], i) => `<div style="margin:12px 14px 0;display:flex;gap:14px;align-items:center;background:#fff;border:1px solid #F3D9E4;border-left:6px solid ${COR.magenta};border-radius:16px;padding:14px">
      <span style="width:46px;height:46px;border-radius:13px;background:${COR.rosaClaro};display:flex;align-items:center;justify-content:center;font-size:24px">${ic}</span>
      <div style="flex:1"><div style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${COR.magenta}">${esc(rot)}</div><div style="font-size:17px;font-weight:800;color:${COR.tinta}">${esc(tit)}</div></div>
      <span style="width:24px;height:24px;border-radius:50%;border:2px solid ${i < (a.feitas ?? 1) ? COR.magenta : '#E6C9D6'};background:${i < (a.feitas ?? 1) ? COR.magenta : 'transparent'};color:#fff;font-size:14px;display:flex;align-items:center;justify-content:center">${i < (a.feitas ?? 1) ? '✓' : ''}</span></div>`).join('')}
  </div>`;
}
// Celular (moldura preta com ilha) com a tela do app, na largura w.
function celular(w, a, extra = '') {
  const k = w / 430;
  return `<div style="width:${w}px;height:${Math.round(924 * k)}px;${extra}"><div style="width:430px;height:924px;transform:scale(${k});transform-origin:0 0;background:#111;border-radius:68px;padding:20px;box-shadow:0 40px 90px rgba(10,2,6,.55),inset 0 0 0 3px #333">
    <div style="position:relative;border-radius:50px;overflow:hidden;width:390px;height:884px;background:#FBF7F9">${telaApp(a)}
      <div style="position:absolute;top:14px;left:50%;margin-left:-62px;width:124px;height:36px;border-radius:20px;background:#000"></div></div></div></div>`;
}
const arroba = (cor, baixo) => `<div style="position:absolute;left:0;right:0;bottom:${baixo}px;text-align:center;${TEXTO};font-size:26px;font-weight:700;letter-spacing:.08em;color:${cor};z-index:20">${PERFIL}</div>`;

const LAYOUTS = {
  // Ref. "Como criar um produto digital lucrativo do zero": celular (ou foto) no alto, título empilhado com uma
  // palavra em degradê rosa, acento manuscrito e linha de apoio.
  manchete(p, c, H, story) {
    const fundoFoto = p.foto && foto(c, p.foto);
    const cel = fundoFoto ? `<img src="${fundoFoto}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${esc(p.fotoPos || 'center top')}">`
      : `<div style="position:absolute;left:50%;top:${story ? 210 : 70}px;transform:translateX(-50%) rotate(-7deg);z-index:2">${celular(story ? 560 : 470, p.app)}</div>
        <div style="position:absolute;left:50%;top:${story ? 430 : 260}px;width:820px;height:820px;margin-left:-410px;border-radius:50%;background:radial-gradient(circle,rgba(240,139,180,.45),rgba(240,139,180,0) 65%);z-index:1"></div>`;
    const t = lista(p.linhas);
    return `<div style="position:absolute;inset:0;background:${ESCURO}"></div>${cel}
      <div style="position:absolute;left:0;right:0;bottom:0;height:${story ? 1000 : 720}px;background:linear-gradient(180deg,rgba(26,6,16,0) 0%,rgba(26,6,16,.85) 40%,#1A0610 70%);z-index:3"></div>
      <div data-area style="position:absolute;left:70px;right:70px;bottom:${story ? 330 : 120}px;display:flex;flex-direction:column;align-items:center;text-align:center;z-index:4">
        ${t.map((l, i) => i === p.destaque ? `<div style="${TITULO};font-size:${p.td || 210}px;line-height:.88;background:linear-gradient(180deg,${COR.rosaSuave},${COR.rosa} 55%,${COR.magenta});-webkit-background-clip:text;background-clip:text;color:transparent">${esc(l)}</div>`
          : `<div style="${TITULO};font-size:${p.ts || 100}px;line-height:.92;color:#fff">${esc(l)}</div>`).join('')}
        ${p.acento ? `<div style="align-self:flex-end;margin:-6px 40px 0 0;font-family:'Caveat',cursive;font-weight:700;font-size:68px;line-height:1;color:#fff;transform:rotate(-6deg)">${esc(p.acento)}</div>` : ''}
        ${p.sub ? `<div style="${TEXTO};font-size:38px;font-weight:600;line-height:1.25;color:#F6DCE7;margin-top:20px;max-width:860px">${rico(p.sub, COR.rosaSuave)}</div>` : ''}
      </div>${arroba('rgba(247,182,207,.85)', story ? 230 : 46)}${textura(.35)}`;
  },
  // Ref. "Rápido antes que saia do ar": etiquetas do texto nativo do story (máquina de escrever), brancas e a
  // última em magenta, sobre o celular inclinado num fundo degradê (ou foto).
  etiquetas(p, c, H, story) {
    const fundoFoto = p.foto && foto(c, p.foto);
    const fundo = fundoFoto ? `<img src="${fundoFoto}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"><div style="position:absolute;inset:0;background:rgba(26,6,16,.25)"></div>`
      : `<div style="position:absolute;inset:0;background:${DEGRADE}"></div><div style="position:absolute;left:${story ? -170 : -150}px;top:${story ? 300 : 120}px;transform:rotate(-14deg);filter:blur(3px)">${celular(story ? 720 : 600, p.app)}</div><div style="position:absolute;inset:0;background:linear-gradient(90deg,rgba(58,13,33,.55),rgba(58,13,33,.15))"></div>`;
    const blocos = lista(p.etiquetas).map((b, i, arr) => {
      const ultimo = i === arr.length - 1;
      return `<div style="display:flex;flex-direction:column;align-items:center;gap:0">${lista(b).map(l => `<span style="display:inline-block;background:${ultimo ? COR.magenta : '#fff'};color:${ultimo ? '#fff' : '#000'};font-family:'Courier Prime','Noto Color Emoji',monospace;font-weight:700;font-size:${p.tl || 46}px;line-height:1.18;padding:4px 16px;border-radius:6px;text-align:center">${esc(l)}</span>`).join('')}</div>`;
    }).join('');
    return `${fundo}<div data-area style="position:absolute;left:70px;right:70px;top:${story ? 300 : 120}px;bottom:${story ? 380 : 130}px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:${story ? 46 : 34}px;z-index:4">${blocos}</div>
      ${arroba('#fff', story ? 250 : 46)}`;
  },
  // Ref. nota do iPhone: barra de ícones, frase grande com o fim em magenta e o "Corre pro…".
  nota(p, c, H, story) {
    const ic = (svg, bg = '#fff') => `<span style="width:76px;height:76px;border-radius:50%;background:${bg};display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.06)">${svg}</span>`;
    const tr = 'stroke="#111" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"';
    const topo = story ? 300 : 110;
    return `<div style="position:absolute;inset:0;background:#F2F2F7"></div>
      <div style="position:absolute;left:70px;right:70px;top:${topo}px;display:flex;justify-content:space-between;align-items:center;z-index:3">
        ${ic(`<svg width="30" height="30" viewBox="0 0 30 30"><path d="M19 5 9 15l10 10" ${tr}/></svg>`)}
        <div style="display:flex;gap:16px;align-items:center">
          <div style="display:flex;gap:6px;background:#fff;border-radius:40px;padding:0 10px;box-shadow:0 2px 8px rgba(0,0,0,.06)">
            ${['<path d="M10 8 5 13l5 5M5 13h13a7 7 0 0 1 0 14h-3" ' + tr + '/>', '<path d="M15 4v15M9 10l6-6 6 6M7 15v10h16V15" ' + tr + '/>', '<circle cx="7" cy="15" r="2" fill="#111"/><circle cx="15" cy="15" r="2" fill="#111"/><circle cx="23" cy="15" r="2" fill="#111"/>'].map(d => `<span style="width:72px;height:76px;display:flex;align-items:center;justify-content:center"><svg width="30" height="30" viewBox="0 0 30 30">${d}</svg></span>`).join('')}
          </div>
          ${ic(`<svg width="34" height="34" viewBox="0 0 30 30"><path d="M7 15.5 12.5 21 23 9" stroke="#fff" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`, COR.magenta)}
        </div>
      </div>
      <div data-area style="position:absolute;left:80px;right:80px;top:${topo + 150}px;bottom:${story ? 520 : 260}px;display:flex;flex-direction:column;justify-content:center;gap:40px;z-index:3">
        <div style="${IOS};font-size:${p.tf || (story ? 88 : 80)}px;font-weight:800;line-height:1.13;letter-spacing:-.025em;color:#111">${rico(p.frase, COR.magenta)}</div>
        ${p.fecho ? `<div style="${IOS};font-size:${story ? 56 : 52}px;font-weight:400;color:#111;letter-spacing:-.01em">${rico(p.fecho, COR.magenta)}</div>` : ''}
      </div>
      <div style="position:absolute;left:80px;right:80px;bottom:${story ? 330 : 90}px;height:96px;background:#fff;border-radius:48px;display:flex;justify-content:space-around;align-items:center;box-shadow:0 2px 10px rgba(0,0,0,.05);z-index:3">
        <span style="${IOS};font-size:34px;color:#111">Aa</span>
        <svg width="40" height="40" viewBox="0 0 30 30"><circle cx="6" cy="9" r="2.4" ${tr}/><circle cx="6" cy="21" r="2.4" ${tr}/><path d="M12 9h13M12 21h13" ${tr}/></svg>
        <svg width="40" height="40" viewBox="0 0 30 30"><rect x="4" y="6" width="22" height="18" rx="3" ${tr}/><path d="M4 12h22M4 18h22M12 6v18" ${tr}/></svg>
        <svg width="40" height="40" viewBox="0 0 30 30"><path d="M20 9 11 18a3 3 0 0 0 4 4l9-9a5 5 0 0 0-7-7l-9 9a7 7 0 0 0 10 10l7-7" ${tr}/></svg>
        <svg width="40" height="40" viewBox="0 0 30 30"><circle cx="15" cy="15" r="11" ${tr}/><path d="M11 20l4-10 4 10M12.5 16.5h5" ${tr}/></svg>
      </div>`;
  },
  // Ref. tweet: avatar com a marca, nome com selo, @, frase grande com destaque e o "Corre pro…".
  tweet(p, c, H, story) {
    const avatar = p.avatar && foto(c, p.avatar) ? `<img src="${foto(c, p.avatar)}" style="width:100%;height:100%;object-fit:cover">`
      : `<div style="width:100%;height:100%;background:${DEGRADE};display:flex;align-items:center;justify-content:center;${TITULO};font-size:46px;color:#fff">ÉG</div>`;
    return `<div style="position:absolute;inset:0;background:#fff"></div>
      <div data-area style="position:absolute;left:80px;right:80px;top:${story ? 300 : 120}px;bottom:${story ? 360 : 120}px;display:flex;flex-direction:column;justify-content:center;gap:56px;z-index:3">
        <div style="display:flex;align-items:center;gap:22px">
          <div style="width:112px;height:112px;border-radius:50%;overflow:hidden;flex:none">${avatar}</div>
          <div style="flex:1;${IOS}"><div style="display:flex;align-items:center;gap:10px;font-size:38px;font-weight:700;color:#111">${esc(p.nome || 'Ética Gabaritada')}
            <svg width="36" height="36" viewBox="0 0 24 24"><path d="M12 1.5l2.6 1.9 3.2-.2 1 3 2.7 1.8-1 3.1 1 3-2.7 1.9-1 3-3.2-.2L12 22.5l-2.6-1.9-3.2.2-1-3-2.7-1.9 1-3-1-3.1L5.2 6.2l1-3 3.2.2z" fill="${COR.magenta}"/><path d="M7.8 12.2l2.8 2.8 5.6-5.8" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
            <div style="font-size:32px;color:#6B6B70;margin-top:2px">${esc(p.arroba || PERFIL)}</div></div>
          <span style="font-size:44px;color:#6B6B70;letter-spacing:2px;align-self:flex-start">•••</span>
        </div>
        <div style="${IOS};font-size:${p.tf || (story ? 96 : 88)}px;font-weight:800;line-height:1.12;letter-spacing:-.03em;color:#111">${rico(p.frase, COR.magenta)}</div>
        ${p.fecho ? `<div style="${IOS};font-size:56px;font-weight:400;color:#111;letter-spacing:-.01em">${rico(p.fecho, COR.magenta)}</div>` : ''}
      </div>`;
  },
  // Ref. "Inscrições abertas": marca no alto, chamada gigante, caixa contornada, linha de prova e o painel de
  // ação na base (com o celular espiando atrás).
  oferta(p, c, H, story) {
    const painel = story ? 520 : 300;
    return `<div style="position:absolute;inset:0;background:${ESCURO}"></div>
      <div style="position:absolute;right:${story ? 60 : -30}px;bottom:${story ? -170 : painel - 330}px;transform:rotate(10deg);z-index:2">${celular(story ? 460 : 440, p.app)}</div>
      <div data-area style="position:absolute;left:80px;right:${story ? 80 : 360}px;top:${story ? 280 : 110}px;display:flex;flex-direction:column;align-items:flex-start;gap:${story ? 30 : 22}px;z-index:4">
        <div style="display:flex;align-items:center;gap:18px">
          <span style="width:84px;height:84px;border-radius:22px;background:linear-gradient(150deg,${COR.rosa},${COR.magenta});display:flex;align-items:center;justify-content:center;font-size:46px;color:#fff">✦</span>
          <span style="${TEXTO};font-size:50px;font-weight:800;letter-spacing:-.02em;color:#fff;line-height:.95">ética<br><span style="color:${COR.rosaSuave}">gabaritada</span></span>
        </div>
        <div style="${TITULO};font-size:${p.ts || (story ? 200 : 170)}px;line-height:.86;color:#fff;margin-top:10px">${lista(p.linhas).map(l => rico(l, COR.rosa)).join('<br>')}</div>
        ${p.caixa ? `<div style="border:4px solid ${COR.rosa};border-radius:16px;padding:10px 24px;${TEXTO};font-size:${story ? 42 : 36}px;font-weight:800;color:${COR.rosaSuave};text-transform:uppercase;letter-spacing:.02em">${esc(p.caixa)}</div>` : ''}
        ${p.sub ? `<div style="${TEXTO};font-size:30px;font-style:italic;font-weight:500;color:#F6DCE7">${esc(p.sub)}</div>` : ''}
        ${p.prova ? `<div style="${TITULO};font-size:${story ? 64 : 54}px;line-height:1;color:#fff;margin-top:${story ? 30 : 14}px">${lista(p.prova).map(l => rico(l, COR.rosa)).join('<br>')}</div>` : ''}
      </div>
      <div style="position:absolute;left:${story ? 120 : 80}px;right:${story ? 120 : 80}px;bottom:0;height:${painel}px;background:linear-gradient(160deg,${COR.rosa},${COR.magenta});border-radius:40px 40px 0 0;padding:${story ? 64 : 44}px 56px;z-index:5;${TEXTO};font-size:${story ? 48 : 42}px;font-weight:800;line-height:1.2;color:#fff;text-align:center">${rico(p.acao || 'Toque em “Saiba mais” e comece hoje.', COR.vinhoEscuro)}</div>
      ${textura(.3)}`;
  },
  // Plano do dia: título, celular com as missões do app e o botão.
  plano(p, c, H, story) {
    return `<div style="position:absolute;inset:0;background:linear-gradient(165deg,${COR.rosaClaro} 0%,#FFF6FA 50%,#fff 100%)"></div>
      <div style="position:absolute;left:0;right:0;top:0;height:16px;background:linear-gradient(90deg,${COR.rosa},${COR.vinho});z-index:5"></div>
      <div data-area style="position:absolute;left:80px;right:80px;top:${story ? 290 : 100}px;display:flex;flex-direction:column;gap:18px;z-index:4">
        <div style="${TEXTO};font-size:28px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:${COR.magenta}">✦ ${esc(p.kicker || 'Seu plano de hoje')}</div>
        <div style="${TITULO};font-size:${p.ts || (story ? 150 : 118)}px;line-height:.88;color:${COR.vinho}">${lista(p.linhas).map(l => rico(l, COR.magenta)).join('<br>')}</div>
        ${p.sub ? `<div style="${TEXTO};font-size:36px;font-weight:500;line-height:1.3;color:${COR.tinta};max-width:${story ? 920 : 520}px">${rico(p.sub, COR.magenta)}</div>` : ''}
        ${story ? `<span style="align-self:flex-start;margin-top:14px;background:${COR.vinho};color:#fff;${TEXTO};font-size:42px;font-weight:800;border-radius:48px 48px 48px 0;padding:24px 44px;box-shadow:0 18px 36px rgba(90,20,48,.3)">${esc(p.botao || 'Comece o desafio')}</span>` : ''}
      </div>
      <div style="position:absolute;${story ? 'left:50%;margin-left:-300px;top:1020px' : 'right:-30px;top:300px'};transform:rotate(${story ? -3 : 6}deg);z-index:3">${celular(story ? 600 : 470, p.app)}</div>
      <div style="position:absolute;left:80px;bottom:110px;z-index:6;${story ? 'display:none' : ''}"><span style="display:inline-block;background:${COR.vinho};color:#fff;${TEXTO};font-size:${story ? 42 : 38}px;font-weight:800;border-radius:48px 48px 48px 0;padding:24px 44px;box-shadow:0 18px 36px rgba(90,20,48,.3)">${esc(p.botao || 'Comece o desafio')}</span></div>
      ${story ? '' : `<div style="position:absolute;left:80px;bottom:56px;${TEXTO};font-size:24px;font-weight:700;letter-spacing:.08em;color:${COR.vinho};z-index:6">${PERFIL}</div>`}
      ${textura(.25, 'multiply')}`;
  },
};

export function renderCriativo(c) {
  const story = c.formato === 'story';
  const H = ALTURA[c.formato] || ALTURA.feed;
  const avisos = [];
  if (!LAYOUTS[c.layout]) avisos.push(`layout "${c.layout}" não existe (${Object.keys(LAYOUTS).join(', ')})`);
  const corpo = (LAYOUTS[c.layout] || LAYOUTS.manchete)(c, c, H, story);
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@900&family=Schibsted+Grotesk:ital,wght@0,500;0,600;0,700;0,800;1,500&family=Inter:wght@400;700;800&family=Caveat:wght@700&family=Courier+Prime:wght@700&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box}body{margin:0}</style></head><body>
<div id="slide-1" style="position:relative;width:${W}px;height:${H}px;overflow:hidden">${corpo}</div></body></html>`;
  return { html, largura: W, altura: H, avisos };
}
