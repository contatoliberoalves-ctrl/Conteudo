// index.html do vídeo "Presença confirmada": fundo animado, cartaz de abertura,
// corpo com a pregação numa janela de papel rasgado e volta ao cartaz no fim.
// Toda a animação está numa timeline GSAP pausada (o HyperFrames busca quadro a quadro).

const W = 1080, H = 1920;

// Ruído determinístico para as bordas rasgadas e partículas.
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), a | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Borda de papel rasgado: retângulo do topo até ~yBase com a borda de baixo irregular.
function rasgado(yBase, seed, amp = 22) {
  const r = rng(seed);
  const pts = [`M0,0`, `L${W},0`];
  for (let x = W; x >= 0; x -= 18) {
    const pico = r() < 0.12 ? (r() - 0.5) * amp * 3 : 0;
    pts.push(`L${x},${(yBase + Math.sin(x / 70 + seed) * amp * 0.6 + (r() - 0.5) * amp + pico).toFixed(1)}`);
  }
  pts.push("Z");
  return pts.join(" ");
}
const svgUrl = (corpo) => `url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${W}' height='${H}' viewBox='0 0 ${W} ${H}'>${corpo}</svg>`)}")`;

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const letras = (s, cls) => [...s].map((c) => `<span class="${cls}">${c === " " ? "&nbsp;" : esc(c)}</span>`).join("");

export function pagina(r, dur, t) {
  const c = r.cores;
  const ev = r.evento, pg = r.pregador;
  const yJanela = 1185;
  const mascara = svgUrl(`<path d='${rasgado(yJanela, 7)}' fill='white'/>`);
  const papel = svgUrl(`<path d='${rasgado(yJanela + 16, 11, 26)}' fill='white'/>`);
  const ra = rng(3);
  const bokeh = Array.from({ length: 26 }, (_, i) => {
    const s = 15 + ra() * 75;
    return `<circle class="bk" id="bk${i}" cx="${(ra() * W).toFixed(0)}" cy="${(ra() * H).toFixed(0)}" r="${s.toFixed(0)}" fill="url(#gbk)" opacity="${(0.15 + ra() * 0.35).toFixed(2)}"/>`;
  }).join("");
  const brilhos = Array.from({ length: 22 }, (_, i) => {
    const s = 16 + ra() * 34;
    return `<svg class="br" id="br${i}" viewBox="-10 -10 20 20" style="left:${(ra() * W).toFixed(0)}px;top:${(ra() * H).toFixed(0)}px;width:${s.toFixed(0)}px;height:${s.toFixed(0)}px"><circle r="4" fill="#fff" opacity="0.35"/><path d="M0,-10 C1,-2 2,-1 10,0 C2,1 1,2 0,10 C-1,2 -2,1 -10,0 C-2,-1 -1,-2 0,-10Z" fill="#fff"/></svg>`;
  }).join("");
  const lideres = (r.lideres || []).map((l, i) => `
    <div class="lider" id="lider${i + 1}" style="${i ? "right" : "left"}:8px">
      <div class="foto-lider"><img src="assets/img/lider-${i + 1}.png" alt=""></div>
      ${l.linhas.map(([n, cargo]) => `<div class="lider-nome">${esc(n)}</div><div class="lider-cargo">${esc(cargo)}</div>`).join("")}
    </div>`).join("");
  const logos = (p) => r.logos.map((_, i) => `<img class="logo" id="${p}logo${i + 1}" src="assets/img/logo-${i + 1}.png" alt="">`).join("");
  const dataLinha = [ev.data, ev.horario].filter(Boolean).join(" · ");

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>${esc(r.selo)} · ${esc(pg.titulo)} ${esc(pg.nome)} ${esc(pg.sobrenome)}</title>
<script src="lib/gsap.min.js"></script>
<style>
  @font-face { font-family: "Great Vibes"; src: url("assets/fonts/great-vibes.woff2") format("woff2"); }
  @font-face { font-family: "Cinzel"; font-weight: 700; src: url("assets/fonts/cinzel-700.woff2") format("woff2"); }
  :root { --pink: ${c.pink}; --vinho: ${c.vinho}; --escuro: ${c.escuro}; --claro: ${c.claro}; --branco: ${c.branco}; }
  html, body { margin: 0; width: ${W}px; height: ${H}px; overflow: hidden; background: var(--vinho); }
  #root { position: relative; width: ${W}px; height: ${H}px; overflow: hidden; font-family: Montserrat; color: var(--branco); }
  .cheio { position: absolute; inset: 0; }

  /* Fundo: degradê pink → vinho, raios girando, curvas claras, granulado. */
  #fundo { background: radial-gradient(120% 80% at 50% 38%, var(--pink) 0%, #d1037a 38%, var(--vinho) 75%, var(--escuro) 100%); }
  #raios { left: -40%; top: -20%; width: 180%; height: 140%; position: absolute; opacity: 0.22;
    background: repeating-conic-gradient(from 0deg at 50% 45%, rgba(255,255,255,0.55) 0deg 5deg, transparent 5deg 18deg);
    -webkit-mask-image: radial-gradient(circle at 50% 45%, #000 0%, transparent 62%); mask-image: radial-gradient(circle at 50% 45%, #000 0%, transparent 62%); }
  #curvas { position: absolute; inset: 0; }
  #grao { opacity: 0.16; mix-blend-mode: overlay; }
  .br { position: absolute; opacity: 0; }

  /* Janela da pregação com borda de papel rasgado. */
  #papel { background: var(--claro); -webkit-mask-image: ${papel}; mask-image: ${papel}; -webkit-mask-size: 100% 100%; mask-size: 100% 100%; opacity: 0; }
  #janela { -webkit-mask-image: ${mascara}; mask-image: ${mascara}; -webkit-mask-size: 100% 100%; mask-size: 100% 100%; overflow: hidden; opacity: 0; }
  #camera { position: absolute; left: 0; top: 0; width: ${W}px; height: ${yJanela + 40}px; transform-origin: 50% 40%; }
  #pregacao { position: absolute; left: 0; top: -40px; width: ${W}px; height: ${Math.round((W * 940) / 720)}px; object-fit: cover; }
  #tinta-janela { background: linear-gradient(180deg, rgba(79,2,48,0.55) 0%, transparent 22%, transparent 70%, rgba(147,6,83,0.55) 100%); }

  /* Cartaz de abertura e fim. */
  .logos { position: absolute; left: 0; right: 0; display: flex; justify-content: center; gap: 34px; }
  #logos-cartaz { top: 92px; }
  #logos-cartaz .logo { height: 150px; }
  #logos-corpo { top: 64px; left: 44px; right: auto; gap: 20px; }
  #logos-corpo .logo { height: 86px; filter: drop-shadow(0 4px 14px rgba(79,2,48,0.6)); }
  .lider { position: absolute; top: 74px; width: 290px; text-align: center; }
  .foto-lider { width: 168px; height: 168px; margin: 0 auto 10px; border-radius: 50%; overflow: hidden; border: 5px solid var(--claro); box-shadow: 0 8px 24px rgba(79,2,48,0.45); background: #fff; }
  .foto-lider img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 30%; }
  .lider-nome { font: 800 21px/1.15 Montserrat; white-space: nowrap; }
  .lider-cargo { font: 600 17px/1.2 Montserrat; color: var(--claro); margin-bottom: 6px; }
  #pregador-cartaz { position: absolute; left: 50px; top: 410px; width: 980px;
    -webkit-mask-image: linear-gradient(180deg, #000 72%, transparent 96%); mask-image: linear-gradient(180deg, #000 72%, transparent 96%);
    filter: drop-shadow(0 18px 40px rgba(79,2,48,0.55)); transform-origin: 50% 30%; }
  #titulo { position: absolute; left: 0; right: 0; top: 1190px; text-align: center; }
  #linha1 { display: flex; justify-content: center; align-items: center; gap: 22px; }
  #edicao { font: 700 150px/1 Cinzel; color: var(--claro); -webkit-text-stroke: 3px var(--branco); text-shadow: 0 8px 0 var(--vinho); display: inline-block; }
  #encontro { font: 900 92px/1 Montserrat; letter-spacing: 0.1em; text-shadow: 0 6px 0 var(--vinho); display: inline-block; }
  #mulheres { font: 400 205px/1 "Great Vibes"; margin-top: -42px; text-shadow: 0 7px 0 var(--vinho), 0 0 38px rgba(255,255,255,0.45); display: inline-block; padding: 0 30px; }
  #faixa { display: inline-block; margin-top: 4px; padding: 16px 36px 14px; background: var(--vinho); border: 3px solid var(--claro); border-radius: 8px;
    font: 800 38px/1 Montserrat; letter-spacing: 0.05em; transform: rotate(-2deg); box-shadow: 0 10px 0 var(--escuro); }
  #selo-cartaz { margin-top: 44px; font: 700 30px/1 Montserrat; letter-spacing: 0.32em; color: var(--claro); }
  #data-cartaz { margin-top: 16px; font: 700 34px/1 Montserrat; letter-spacing: 0.08em; color: var(--claro); }
  #nome-cartaz { margin-top: 12px; font: 900 76px/1 Montserrat; letter-spacing: 0.01em; text-shadow: 0 6px 0 var(--vinho); }
  #nome-cartaz .sob, #nome-corpo .sob { color: var(--claro); }
  .le { display: inline-block; }
  #local-cartaz { position: absolute; left: 0; right: 0; top: 1812px; text-align: center; font: 700 28px/1 Montserrat; letter-spacing: 0.28em; color: rgba(255,255,255,0.85); }

  /* Corpo: pregador menor à direita, nome à esquerda, faixa do evento embaixo. */
  #pregador-corpo { position: absolute; left: 545px; top: 1060px; width: 600px;
    -webkit-mask-image: linear-gradient(180deg, #000 70%, transparent 95%); mask-image: linear-gradient(180deg, #000 70%, transparent 95%);
    filter: drop-shadow(-12px 16px 30px rgba(79,2,48,0.6)); }
  #bloco-nome { position: absolute; left: 56px; top: 1250px; width: 560px; }
  #selo-corpo { display: inline-block; padding: 14px 22px 12px; background: var(--pink); border-radius: 8px; font: 800 27px/1 Montserrat; letter-spacing: 0.12em; box-shadow: 0 8px 0 var(--escuro); }
  #nome-corpo { margin-top: 26px; font: 900 70px/0.98 Montserrat; text-shadow: 0 6px 0 var(--vinho); }
  #nome-corpo .sob { font-size: 84px; }
  #data-corpo { margin-top: 22px; font: 700 30px/1.2 Montserrat; color: var(--claro); letter-spacing: 0.06em; }
  #faixa-evento { position: absolute; left: 0; right: 0; top: 1668px; height: 252px; text-align: center;
    background: linear-gradient(180deg, transparent 0%, rgba(79,2,48,0.92) 26%, var(--escuro) 100%); }
  #faixa-evento .l1 { margin-top: 62px; display: flex; justify-content: center; align-items: baseline; gap: 16px; }
  #faixa-evento .ed { font: 700 70px/1 Cinzel; color: var(--claro); }
  #faixa-evento .en { font: 900 50px/1 Montserrat; letter-spacing: 0.1em; }
  #faixa-evento .mu { font: 400 96px/0.8 "Great Vibes"; }
  #faixa-evento .fx { margin-top: 18px; font: 800 28px/1 Montserrat; letter-spacing: 0.12em; color: var(--claro); }

  /* Viradas: clarão, faixas de falha e vazamento de luz. */
  #flash { background: #fff; opacity: 0; }
  #vazamento { opacity: 0; mix-blend-mode: screen; background: radial-gradient(40% 30% at 30% 40%, rgba(255,255,255,0.95), transparent 70%), radial-gradient(50% 40% at 70% 60%, rgba(255,120,190,0.9), transparent 70%); }
  .falha { position: absolute; left: 0; width: ${W}px; opacity: 0; mix-blend-mode: screen; }
</style>
</head>
<body>
<div id="root" data-composition-id="${r.id}" data-width="${W}" data-height="${H}" data-start="0" data-duration="${dur}">
  <div id="fundo" class="cheio"></div>
  <div id="raios"></div>
  <svg id="curvas" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
    <path id="curva1" d="M-120,520 C240,300 520,760 1200,380" stroke="${c.claro}" stroke-width="46" fill="none" stroke-linecap="round" opacity="0.55"/>
    <path id="curva2" d="M-100,1580 C300,1380 700,1760 1180,1480" stroke="${c.claro}" stroke-width="30" fill="none" stroke-linecap="round" opacity="0.35"/>
    <path id="curva3" d="M-80,980 C360,1120 640,840 1160,1040" stroke="#ffffff" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.4"/>
  </svg>
  <svg id="grao" class="cheio" viewBox="0 0 ${W} ${H}"><filter id="ruido"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#ruido)"/></svg>
  <svg id="bokeh" class="cheio" viewBox="0 0 ${W} ${H}"><defs><radialGradient id="gbk"><stop offset="0" stop-color="#ffe6f0" stop-opacity="0.95"/><stop offset="0.55" stop-color="#ffbedc" stop-opacity="0.35"/><stop offset="1" stop-color="#ffbedc" stop-opacity="0"/></radialGradient></defs>${bokeh}</svg>

  <div id="papel" class="cheio"></div>
  <div id="janela" class="cheio">
    <div id="camera">
      <video id="pregacao" class="clip" src="assets/pregacao.mp4" data-start="0" data-duration="${dur}" data-track-index="0" muted playsinline></video>
    </div>
    <div id="tinta-janela" class="cheio"></div>
  </div>

  <div id="corpo" class="cheio" style="opacity:0">
    <div id="logos-corpo" class="logos">${logos("c")}</div>
    <img id="pregador-corpo" src="assets/img/pregador.png" alt="">
    <div id="bloco-nome">
      <div id="selo-corpo">${esc(r.selo)}</div>
      <div id="nome-corpo">${esc(pg.titulo)} ${esc(pg.nome)}<br><span class="sob">${esc(pg.sobrenome)}</span></div>
      ${dataLinha ? `<div id="data-corpo">${esc(dataLinha)}</div>` : ""}
    </div>
    <div id="faixa-evento">
      <div class="l1"><span class="ed">${esc(ev.edicao)}</span><span class="en">${esc(ev.linha1)}</span><span class="mu">${esc(ev.linha2)}</span></div>
      <div class="fx">${esc(ev.faixa)}</div>
    </div>
  </div>

  <div id="cartaz" class="cheio">
    <div id="logos-cartaz" class="logos">${logos("k")}</div>
    ${lideres}
    <img id="pregador-cartaz" src="assets/img/pregador.png" alt="">
    <div id="titulo">
      <div id="linha1"><span id="edicao">${esc(ev.edicao)}</span><span id="encontro">${esc(ev.linha1)}</span></div>
      <div><span id="mulheres">${esc(ev.linha2)}</span></div>
      <div><span id="faixa">${esc(ev.faixa)}</span></div>
      <div id="selo-cartaz">${esc(r.selo)}</div>
      <div id="nome-cartaz">${letras(`${pg.titulo} ${pg.nome} `, "le")}<span class="sob">${letras(pg.sobrenome, "le")}</span></div>
      ${dataLinha ? `<div id="data-cartaz">${esc(dataLinha)}</div>` : ""}
    </div>
    <div id="local-cartaz">${esc(ev.local)}</div>
  </div>

  <div id="brilhos" class="cheio">${brilhos}</div>
  <div id="vazamento" class="cheio"></div>
  ${[0, 1, 2, 3, 4, 5].map((i) => `<div class="falha" id="falha${i}"></div>`).join("")}
  <div id="flash" class="cheio"></div>
  <audio id="trilha" class="clip" src="assets/audio.wav" data-start="0" data-duration="${dur}" data-track-index="1" data-volume="1"></audio>
</div>
<script>
(function () {
  const D = ${dur}, VIRADA = ${t.virada}, FINAL = ${t.final};
  const tl = gsap.timeline({ paused: true });
  const q = (s) => document.querySelectorAll(s);
  let semente = 9;
  const rnd = () => { semente = (semente * 16807) % 2147483647; return semente / 2147483647; };

  // ---- Fundo contínuo
  tl.fromTo("#raios", { rotation: 0 }, { rotation: 38, duration: D, ease: "none" }, 0);
  tl.fromTo("#curva1", { x: -40, y: 0 }, { x: 40, y: -30, duration: D, ease: "sine.inOut" }, 0);
  tl.fromTo("#curva2", { x: 30 }, { x: -50, duration: D, ease: "sine.inOut" }, 0);
  tl.fromTo("#curva3", { x: -20, y: 10 }, { x: 30, y: -20, duration: D, ease: "sine.inOut" }, 0);
  q(".bk").forEach((el, i) => {
    tl.fromTo(el, { y: 0, x: 0 }, { y: -120 - rnd() * 160, x: (rnd() - 0.5) * 120, duration: D, ease: "sine.inOut" }, 0);
  });
  q(".br").forEach((el, i) => {
    const per = 1.6 + rnd() * 2.2, ini = rnd() * per;
    const n = Math.max(1, Math.floor((D - ini) / per));
    tl.fromTo(el, { opacity: 0, scale: 0.3, rotation: 0 }, { opacity: 1, scale: 1, rotation: 45, duration: per / 2, ease: "sine.inOut", repeat: n * 2 - 1, yoyo: true }, ini);
  });

  // ---- Abertura: clarão e rosto gigante assentando no cartaz
  tl.set("#flash", { opacity: 1 }, 0);
  tl.to("#flash", { opacity: 0, duration: 0.55, ease: "power2.out" }, 0.05);
  tl.fromTo("#pregador-cartaz", { scale: 1.9, y: 260, filter: "blur(16px) drop-shadow(0 18px 40px rgba(79,2,48,0.55))" },
    { scale: 1, y: 0, filter: "blur(0px) drop-shadow(0 18px 40px rgba(79,2,48,0.55))", duration: 1.4, ease: "power3.out" }, 0);
  tl.to("#pregador-cartaz", { scale: 1.04, duration: VIRADA - 1.4, ease: "none" }, 1.4);
  tl.fromTo("#logos-cartaz .logo", { y: -90, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "back.out(2)" }, 0.75);
  tl.fromTo(".lider", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, stagger: 0.15, ease: "back.out(1.8)" }, 1.0);
  tl.fromTo("#edicao", { scale: 2.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.6)" }, 1.35);
  tl.fromTo("#encontro", { scaleX: 1.7, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.8, ease: "power3.out" }, 1.5);
  tl.fromTo("#mulheres", { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.0, ease: "power2.inOut" }, 1.9);
  tl.fromTo("#faixa", { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "power3.out" }, 2.7);
  tl.fromTo("#selo-cartaz", { opacity: 0, scaleX: 1.4 }, { opacity: 1, scaleX: 1, duration: 0.6, ease: "power2.out" }, 3.1);
  tl.fromTo("#nome-cartaz .le", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.12, stagger: 0.045, ease: "power1.out" }, 3.35);
  tl.fromTo("#local-cartaz", { opacity: 0 }, { opacity: 1, duration: 0.5 }, 4.1);

  // ---- Virada para o corpo: falha digital + clarão
  function falha(t0) {
    q(".falha").forEach((el, i) => {
      const top = Math.floor(rnd() * 1800), alt = 30 + Math.floor(rnd() * 120);
      tl.set(el, { top, height: alt, opacity: 0.85, x: (rnd() - 0.5) * 260, background: i % 2 ? "${c.claro}" : "rgba(255,255,255,0.9)" }, t0 + i * 0.03);
      tl.set(el, { opacity: 0 }, t0 + 0.18 + i * 0.03);
    });
    tl.fromTo("#flash", { opacity: 0 }, { opacity: 0.9, duration: 0.08, yoyo: true, repeat: 1, ease: "power1.inOut" }, t0 + 0.1);
  }
  falha(VIRADA - 0.25);
  tl.to("#cartaz", { opacity: 0, scale: 1.08, filter: "blur(8px)", duration: 0.3, ease: "power2.in" }, VIRADA - 0.2);
  tl.set("#cartaz", { opacity: 0 }, VIRADA + 0.1);
  tl.fromTo(["#janela", "#papel"], { opacity: 0 }, { opacity: 1, duration: 0.25 }, VIRADA);
  tl.fromTo("#corpo", { opacity: 0 }, { opacity: 1, duration: 0.25 }, VIRADA);
  tl.fromTo("#pregador-corpo", { x: 260, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, VIRADA + 0.1);
  tl.fromTo("#logos-corpo .logo", { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "back.out(2)" }, VIRADA + 0.3);
  tl.fromTo("#selo-corpo", { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: 0.45, ease: "power3.out" }, VIRADA + 0.35);
  tl.fromTo("#nome-corpo", { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" }, VIRADA + 0.55);
  tl.fromTo("#faixa-evento", { y: 260 }, { y: 0, duration: 0.7, ease: "power3.out" }, VIRADA + 0.45);

  // ---- Corpo: "cortes" na janela (zoom e enquadramento mudam de repente) + vazamento de luz
  const cortes = [];
  for (let t0 = VIRADA; t0 < FINAL - 0.5; t0 += 3.4) cortes.push(t0);
  cortes.forEach((t0, i) => {
    const s0 = [1.06, 1.28, 1.14, 1.36, 1.1][i % 5], dx = [0, -90, 60, -40, 80][i % 5], dy = [0, 60, -20, 90, 30][i % 5];
    const fim = Math.min(t0 + 3.4, FINAL);
    tl.fromTo("#camera", { scale: s0, x: dx, y: dy }, { scale: s0 + 0.06, x: dx * 0.8, y: dy - 10, duration: fim - t0, ease: "none", immediateRender: false }, t0);
    if (i > 0) {
      tl.fromTo("#vazamento", { opacity: 0, x: -300 }, { opacity: 0.85, x: 0, duration: 0.18, ease: "power1.out", immediateRender: false }, t0 - 0.08);
      tl.to("#vazamento", { opacity: 0, x: 300, duration: 0.45, ease: "power1.in" }, t0 + 0.1);
    }
  });
  tl.fromTo("#pregador-corpo", { scale: 1 }, { scale: 1.05, duration: FINAL - VIRADA - 1, ease: "none", immediateRender: false }, VIRADA + 1);

  // ---- Fim: volta ao cartaz
  falha(FINAL - 0.25);
  tl.to(["#corpo", "#janela", "#papel"], { opacity: 0, duration: 0.3, ease: "power2.in" }, FINAL - 0.15);
  tl.fromTo("#cartaz", { opacity: 0, scale: 1.08, filter: "blur(8px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.6, ease: "power3.out", immediateRender: false }, FINAL);
  tl.fromTo("#pregador-cartaz", { scale: 1.04 }, { scale: 1.0, duration: D - FINAL, ease: "none", immediateRender: false }, FINAL);

  window.__timelines = window.__timelines || {};
  window.__timelines["${r.id}"] = tl;
})();
</script>
</body>
</html>
`;
}
