// index.html do vídeo "Presença confirmada", na linha da arte de referência:
// topo rosado claro, arco vinho com textura de nuvem, laterais rosa em diagonal,
// nome do pregador grande em letra condensada e "Presença confirmada" em pincel embaixo.
// No meio do vídeo a pregação ocupa a tela inteira, por cima do cenário. Toda a animação está numa
// timeline GSAP pausada (o HyperFrames busca quadro a quadro).

const W = 1080, H = 1920;

// Momentos do roteiro (s): música abre sozinha, a voz entra, o arco vira janela da
// pregação e no fim volta o cartaz.
export function tempos(fala) {
  const voz = 1.0;
  const duracao = Math.round((voz + fala + 1.6) * 1000) / 1000;
  return { voz, fala, duracao, virada: 6.4, final: duracao - 4.2 };
}

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), a | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

export function pagina(r, t) {
  const c = r.cores, ev = r.evento, pg = r.pregador;
  const D = t.duracao;
  const ra = rng(5);
  const poeira = Array.from({ length: 22 }, (_, i) =>
    `<circle class="po" id="po${i}" cx="${(ra() * W).toFixed(0)}" cy="${(600 + ra() * 1300).toFixed(0)}" r="${(1.5 + ra() * 3.5).toFixed(1)}" fill="#fff" opacity="${(0.25 + ra() * 0.45).toFixed(2)}"/>`).join("");
  const lideres = (r.lideres || []).map((l, i) => `
    <div class="lider ${i ? "dir" : "esq"}" id="lider${i + 1}">
      <div class="foto-lider"><img src="assets/img/lider-${i + 1}.png" alt=""></div>
      <div class="nomes">${l.linhas.map(([n, cargo]) => `<div class="lider-nome">${esc(n)}</div><div class="lider-cargo">${esc(cargo)}</div>`).join("")}</div>
    </div>`).join("");
  const logos = r.logos.map((_, i) => `<img class="logo" id="logo${i + 1}" src="assets/img/logo-${i + 1}.png" alt="">`).join("");
  const letras = (txt, cls) => [...txt].map((l) => `<span class="mascara"><span class="le ${cls}">${l === " " ? "&nbsp;" : esc(l)}</span></span>`).join("");
  const dataLinha = [ev.data, ev.horario].filter(Boolean).join(" · ");

  // Arco: x 172–908, topo em 640, cantos de cima bem arredondados.
  const A = { x: 172, y: 640, w: 736, h: 1000, raio: 120 };
  const TELA = 1260;

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>${esc(r.selo.join(" "))} · ${esc(pg.titulo)} ${esc(pg.nome)} ${esc(pg.sobrenome)}</title>
<script src="lib/gsap.min.js"></script>
<style>
  @font-face { font-family: "Great Vibes"; src: url("assets/fonts/great-vibes.woff2") format("woff2"); }
  :root { --vinho-escuro: ${c.vinhoEscuro}; --vinho: ${c.vinho}; --titulo: ${c.titulo}; --rosa-escuro: ${c.rosaEscuro}; --rosa: ${c.rosa}; --rosa-claro: ${c.rosaClaro}; --branco: ${c.branco}; }
  html, body { margin: 0; width: ${W}px; height: ${H}px; overflow: hidden; background: #fbeef4; }
  #root { position: relative; width: ${W}px; height: ${H}px; overflow: hidden; font-family: Montserrat; }
  .cheio { position: absolute; inset: 0; }
  .tex { position: absolute; background-size: cover; }

  #topo { background: url("assets/img/topo.png") center / cover; }
  /* Laterais em diagonal: faixa escura na borda e textura rosa. */
  .lateral { position: absolute; top: 0; width: 330px; height: ${H}px; overflow: hidden; }
  .lateral.esq { left: 0; clip-path: polygon(0 680px, 330px 820px, 330px 100%, 0 100%); }
  .lateral.dir { right: 0; clip-path: polygon(0 820px, 330px 680px, 330px 100%, 0 100%); }
  .lateral .tex { inset: -40px; background-image: url("assets/img/rosa.png"); }
  .borda { position: absolute; top: 0; width: 330px; height: ${H}px; background: var(--vinho); opacity: 0.9; }
  .borda.esq { left: 0; clip-path: polygon(0 632px, 330px 772px, 330px 820px, 0 680px); }
  .borda.dir { right: 0; clip-path: polygon(0 772px, 330px 632px, 330px 680px, 0 820px); }
  /* Base rosa que sobe com névoa. */
  #base { position: absolute; left: 0; top: 1080px; width: ${W}px; height: ${H - 1080}px; overflow: hidden;
    -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 30%); mask-image: linear-gradient(180deg, transparent 0%, #000 30%); }
  #base .tex { inset: -40px; background-image: url("assets/img/rosa.png"); background-position: center bottom; }
  #nevoa { position: absolute; left: -10%; top: 1180px; width: 120%; height: 700px; opacity: 0.55;
    background: radial-gradient(50% 45% at 50% 40%, rgba(255,230,238,0.85) 0%, rgba(255,214,228,0.35) 50%, transparent 75%); }
  .flores { position: absolute; top: 1430px; width: 760px; opacity: 0.22; mix-blend-mode: luminosity;
    -webkit-mask-image: radial-gradient(50% 50% at 50% 50%, #000 35%, transparent 75%); mask-image: radial-gradient(50% 50% at 50% 50%, #000 35%, transparent 75%); }
  #flores-esq { left: -260px; transform: rotate(-6deg); }
  #flores-dir { right: -300px; transform: scaleX(-1) rotate(-6deg); }

  /* Arco vinho (janela da pregação no meio do vídeo). */
  #arco { position: absolute; left: ${A.x}px; top: ${A.y}px; width: ${A.w}px; height: ${A.h}px; overflow: hidden;
    border-radius: ${A.raio}px ${A.raio}px 0 0; transform-origin: 50% 100%;
    -webkit-mask-image: linear-gradient(180deg, #000 55%, transparent 96%); mask-image: linear-gradient(180deg, #000 55%, transparent 96%);
    box-shadow: 0 0 0 1px rgba(0,0,0,0.05); }
  #arco .tex { inset: -50px; background-image: url("assets/img/arco.png"); }
  /* Pregação em tela cheia (largura toda, até o nome). */
  #tela { position: absolute; left: 0; top: 0; width: ${W}px; height: ${TELA}px; overflow: hidden; opacity: 0; transform-origin: 50% 62%;
    -webkit-mask-image: linear-gradient(180deg, #000 74%, transparent 100%); mask-image: linear-gradient(180deg, #000 74%, transparent 100%); }
  #camera { position: absolute; left: 0; top: 0; width: ${W}px; height: ${TELA}px; transform-origin: 50% 35%; }
  #pregacao { position: absolute; left: 0; top: 0; width: ${W}px; height: ${Math.round((W * 940) / 720)}px; object-fit: cover; }
  #pulso { transform-origin: 50% 40%; }
  #tinta { background: linear-gradient(180deg, rgba(78,7,22,0.45) 0%, transparent 16%, transparent 60%, rgba(126,13,35,0.55) 100%); }
  #brilho-tela { position: absolute; top: -20%; left: -60%; width: 40%; height: 140%; opacity: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent); transform: rotate(18deg); }
  #logos-tela { position: absolute; top: 44px; left: 44px; display: flex; gap: 18px; opacity: 0; }
  #logos-tela .logo { height: 84px; filter: drop-shadow(0 4px 12px rgba(78,7,22,0.5)); }
  #logo-rodape { position: absolute; left: ${(W - 215) / 2}px; top: 1772px; width: 215px; opacity: 0; filter: drop-shadow(0 0 10px rgba(255,255,255,0.85)) drop-shadow(0 0 3px #fff); }
  #brilho-arco { position: absolute; top: -20%; left: -60%; width: 40%; height: 140%; opacity: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent); transform: rotate(18deg); }

  /* Pregador recortado (já vem com as flores esmaecidas embaixo). */
  #pregador { position: absolute; left: -179px; top: 522px; width: 1480px; transform-origin: 50% 60%;
    filter: drop-shadow(0 24px 40px rgba(78,7,22,0.35)); }

  /* Topo: logos da igreja e logo do evento. */
  #logos { position: absolute; top: 46px; left: 0; right: 0; display: flex; justify-content: center; gap: 26px; }
  #logos .logo { height: 78px; }
  #logo-evento { position: absolute; left: 270px; top: 132px; width: 540px; }
  #faixa { position: absolute; left: 0; right: 0; top: 500px; text-align: center; font: 700 25px/1 Montserrat; letter-spacing: 0.26em; color: var(--titulo); }

  /* Título: nome grande e, embaixo, "Presença confirmada". */
  #ev { position: absolute; z-index: 2; left: 0; right: 0; top: 1192px; text-align: center; font: 800 40px/1 Montserrat; letter-spacing: 0.42em; color: var(--branco);
    text-shadow: 0 3px 12px rgba(78,7,22,0.6); }
  #nome-grande { position: absolute; z-index: 2; left: 0; right: 0; top: 1236px; text-align: center; font: 400 206px/0.84 "League Gothic"; letter-spacing: 0.01em; }
  #nome-grande .linha { display: block; white-space: nowrap; }
  .mascara { display: inline-block; overflow: hidden; vertical-align: top; padding: 46px 0 40px; margin: -46px 0 -40px; }
  .le { display: inline-block; filter: drop-shadow(0 8px 18px rgba(78,7,22,0.35)); }
  .le.vinho { background: linear-gradient(180deg, ${c.titulo} 0%, ${c.vinho} 55%, ${c.vinhoEscuro} 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .le.branca { color: var(--branco); }
  #pc { position: absolute; z-index: 3; left: 0; right: 0; top: 1590px; text-align: center; font: 400 128px/1 "Great Vibes"; color: var(--branco);
    transform: rotate(-2deg); text-shadow: 0 6px 20px rgba(78,7,22,0.4); }
  #cidade { position: absolute; left: 0; right: 0; top: 1738px; text-align: center; font: 700 25px/1 Montserrat; letter-spacing: 0.24em; color: #ffe1ea; }
  #data { position: absolute; left: 0; right: 0; top: 1150px; text-align: center; font: 800 34px/1 Montserrat; letter-spacing: 0.1em; color: var(--branco); }
  .lider { position: absolute; top: 1790px; display: flex; align-items: center; gap: 14px; }
  .lider.esq { left: 36px; }
  .lider.dir { right: 36px; flex-direction: row-reverse; text-align: right; }
  .foto-lider { width: 112px; height: 112px; border-radius: 50%; overflow: hidden; border: 4px solid #fff; background: #fff; flex: none; box-shadow: 0 6px 16px rgba(78,7,22,0.3); }
  .foto-lider img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 28%; }
  .lider-nome { font: 800 19px/1.15 Montserrat; color: #fff; white-space: nowrap; }
  .lider-cargo { font: 600 15px/1.2 Montserrat; color: #ffe1ea; margin-bottom: 6px; white-space: nowrap; }

  #luz { position: absolute; top: -10%; left: -50%; width: 35%; height: 120%; opacity: 0; mix-blend-mode: soft-light;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent); transform: rotate(14deg); }
  #clarao { background: #fff; opacity: 0; }
</style>
</head>
<body>
<div id="root" data-composition-id="${r.id}" data-width="${W}" data-height="${H}" data-start="0" data-duration="${D}">
  <div id="topo" class="cheio"></div>
  <div class="lateral esq" id="lat-esq"><div class="tex"></div></div>
  <div class="lateral dir" id="lat-dir"><div class="tex"></div></div>
  <div class="borda esq" id="borda-esq"></div>
  <div class="borda dir" id="borda-dir"></div>
  <div id="arco">
    <div class="tex" id="arco-tex"></div>
    <div id="brilho-arco"></div>
  </div>
  <div id="base"><div class="tex" id="base-tex"></div></div>
  <div id="nevoa"></div>
  ${r.arquivos.flores ? `<img class="flores" id="flores-esq" src="assets/img/flores.png" alt=""><img class="flores" id="flores-dir" src="assets/img/flores.png" alt="">` : ""}
  <svg class="cheio" id="poeira" viewBox="0 0 ${W} ${H}">${poeira}</svg>

  <img id="pregador" src="assets/img/pregador.png" alt="">

  <div id="tela">
    <div id="pulso" class="cheio"><div id="camera">
      <video id="pregacao" class="clip" src="assets/pregacao.mp4" data-start="${t.voz}" data-duration="${t.fala}" data-track-index="0" muted playsinline></video>
    </div></div>
    <div id="tinta" class="cheio"></div>
    <div id="brilho-tela"></div>
  </div>
  <div id="logos-tela">${r.logos.map((_, i) => `<img class="logo" id="tlogo${i + 1}" src="assets/img/logo-${i + 1}.png" alt="">`).join("")}</div>

  <div id="logos">${logos}</div>
  <img id="logo-evento" src="assets/img/logo-evento.png" alt="">
  <div id="faixa">${esc(ev.faixa)}</div>

  ${dataLinha ? `<div id="data">${esc(dataLinha)}</div>` : ""}
  <div id="ev">${esc(pg.titulo)}</div>
  <div id="nome-grande"><span class="linha">${letras(pg.nome, "vinho")}</span><span class="linha">${letras(pg.sobrenome, "branca")}</span></div>
  <div id="pc">${esc(r.selo.join(" "))}</div>
  <div id="cidade">${esc(ev.local)}</div>
  ${lideres}
  <img id="logo-rodape" src="assets/img/logo-evento.png" alt="">

  <div id="luz"></div>
  <div id="clarao" class="cheio"></div>
  <audio id="trilha" class="clip" src="assets/audio.wav" data-start="0" data-duration="${D}" data-track-index="1" data-volume="1"></audio>
</div>
<script>
(function () {
  const D = ${D}, VIRADA = ${t.virada}, FINAL = ${t.final};
  const BATIDA = ${60 / ((r.musica && r.musica.bpm) || 72)}, COMPASSO = 4 * BATIDA;
  const tl = gsap.timeline({ paused: true });
  const q = (s) => document.querySelectorAll(s);
  let semente = 11;
  const rnd = () => { semente = (semente * 16807) % 2147483647; return semente / 2147483647; };

  // ---- Movimento contínuo e discreto do fundo
  tl.fromTo("#arco-tex", { x: -20, y: 0, scale: 1.04 }, { x: 20, y: -30, scale: 1.08, duration: D, ease: "none" }, 0);
  tl.fromTo(["#lat-esq .tex", "#lat-dir .tex", "#base-tex"], { y: 0 }, { y: -36, duration: D, ease: "none" }, 0);
  tl.fromTo("#nevoa", { x: -30, opacity: 0.45 }, { x: 30, opacity: 0.6, duration: D, ease: "sine.inOut" }, 0);
  q(".po").forEach((el) => {
    tl.fromTo(el, { y: 0, x: 0 }, { y: -(80 + rnd() * 220), x: (rnd() - 0.5) * 60, duration: D, ease: "none" }, 0);
  });

  // ---- Abertura: o cenário se monta (arco sobe, laterais entram), o pregador surge
  tl.fromTo("#arco", { scaleY: 0.0 }, { scaleY: 1, duration: 1.1, ease: "power3.out" }, 0.1);
  tl.fromTo(["#lat-esq", "#borda-esq"], { x: -340 }, { x: 0, duration: 1.0, ease: "power3.out" }, 0.25);
  tl.fromTo(["#lat-dir", "#borda-dir"], { x: 340 }, { x: 0, duration: 1.0, ease: "power3.out" }, 0.25);
  tl.fromTo(["#base", "#nevoa"], { y: 220 }, { y: 0, duration: 1.2, ease: "power3.out" }, 0.2);
  tl.fromTo(".flores", { opacity: 0 }, { opacity: 0.22, duration: 1.2 }, 0.6);
  tl.fromTo("#pregador", { y: 160, opacity: 0, scale: 1.05 }, { y: 0, opacity: 1, scale: 1, duration: 1.3, ease: "power3.out" }, 0.5);
  tl.to("#pregador", { scale: 1.035, duration: VIRADA - 1.8, ease: "none" }, 1.8);
  tl.fromTo("#logos .logo", { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" }, 0.8);
  tl.fromTo("#logo-evento", { clipPath: "inset(0% 100% 0% 0%)", scale: 0.96 }, { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.3, ease: "power2.inOut" }, 1.0);
  tl.fromTo("#faixa", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 2.0);
  tl.fromTo("#ev", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 1.9);
  tl.fromTo("#nome-grande .le", { yPercent: 105, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.05, ease: "power4.out" }, 2.0);
  tl.fromTo("#pc", { clipPath: "inset(-30% 100% -30% 0%)" }, { clipPath: "inset(-30% -5% -30% 0%)", duration: 1.1, ease: "power1.inOut" }, 2.9);
  tl.fromTo("#cidade", { opacity: 0 }, { opacity: 1, duration: 0.6 }, 3.7);
  ${dataLinha ? `tl.fromTo("#data", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6 }, 3.2);` : ""}
  tl.fromTo(".lider", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: "power3.out" }, 4.0);
  tl.fromTo("#luz", { xPercent: 0, opacity: 0.9 }, { xPercent: 490, opacity: 0.9, duration: 1.4, ease: "power2.inOut" }, 2.2);

  // ---- Virada: o pregador desce, o arco acende e vira a janela da pregação
  function virada(t0) {
    tl.fromTo("#brilho-arco", { xPercent: 0, opacity: 1 }, { xPercent: 475, opacity: 1, duration: 0.7, ease: "power2.inOut", immediateRender: false }, t0 - 0.3);
    tl.fromTo("#clarao", { opacity: 0 }, { opacity: 0.35, duration: 0.15, yoyo: true, repeat: 1, ease: "power1.inOut", immediateRender: false }, t0 - 0.1);
  }
  virada(VIRADA);
  tl.to("#pregador", { y: 240, opacity: 0, duration: 0.7, ease: "power2.in" }, VIRADA - 0.4);
  tl.to(".lider", { opacity: 0, y: 30, duration: 0.4, ease: "power2.in" }, VIRADA - 0.4);
  tl.to(["#logos", "#logo-evento", "#faixa"], { opacity: 0, y: -30, duration: 0.45, ease: "power2.in" }, VIRADA - 0.35);
  tl.fromTo("#tela", { opacity: 0, scale: 0.72 }, { opacity: 1, scale: 1, duration: 0.85, ease: "power3.inOut" }, VIRADA - 0.25);
  tl.to("#arco", { opacity: 0, duration: 0.5 }, VIRADA + 0.5);
  tl.fromTo("#logos-tela", { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" }, VIRADA + 0.5);
  tl.fromTo("#logo-rodape", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, VIRADA + 0.6);

  // "Cortes" na janela: enquadramento muda de repente e segue num zoom lento.
  const cortes = [];
  for (let t0 = VIRADA; t0 < FINAL - 0.5; t0 += COMPASSO) cortes.push(t0);
  cortes.forEach((t0, i) => {
    const s0 = [1.05, 1.24, 1.12, 1.32, 1.08][i % 5], dx = [0, -60, 40, -30, 60][i % 5], dy = [0, 40, -10, 70, 20][i % 5];
    const fim = Math.min(t0 + COMPASSO, FINAL + 0.6);
    tl.fromTo("#camera", { scale: s0, x: dx, y: dy }, { scale: s0 + 0.05, x: dx * 0.8, y: dy - 8, duration: fim - t0, ease: "none", immediateRender: false }, t0);
    // Pulso da imagem nos tambores (1 e 3 de cada compasso).
    if (i > 0) for (const b of [0, 2]) {
      const tb = t0 + b * BATIDA;
      if (tb < FINAL - 0.3) tl.fromTo("#pulso", { scale: b ? 1.012 : 1.025 }, { scale: 1, duration: 0.32, ease: "power2.out", immediateRender: false }, tb);
    }
    if (i > 0) tl.fromTo("#clarao", { opacity: 0.18 }, { opacity: 0, duration: 0.25, ease: "power2.out", immediateRender: false }, t0);
    if (i > 0) tl.fromTo("#brilho-tela", { xPercent: 0, opacity: 0.8 }, { xPercent: 475, opacity: 0.8, duration: 0.5, ease: "power2.inOut", immediateRender: false }, t0 - 0.2);
  });

  // ---- Fim: a janela apaga, o pregador volta e os líderes reaparecem
  virada(FINAL);
  tl.to("#tela", { opacity: 0, scale: 0.9, duration: 0.6, ease: "power2.inOut" }, FINAL - 0.1);
  tl.to(["#logos-tela", "#logo-rodape"], { opacity: 0, duration: 0.4 }, FINAL - 0.1);
  tl.to(["#logos", "#logo-evento", "#faixa"], { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, FINAL + 0.2);
  tl.to("#arco", { opacity: 1, duration: 0.6 }, FINAL - 0.3);
  tl.fromTo("#pregador", { y: 160, opacity: 0, scale: 1.04 }, { y: 0, opacity: 1, scale: 1, duration: 1.0, ease: "power3.out", immediateRender: false }, FINAL);
  tl.fromTo(".lider", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: "power3.out", immediateRender: false }, FINAL + 0.4);
  tl.fromTo("#luz", { xPercent: 0, opacity: 0.9 }, { xPercent: 490, opacity: 0.9, duration: 1.4, ease: "power2.inOut", immediateRender: false }, FINAL + 0.8);

  window.__timelines = window.__timelines || {};
  window.__timelines["${r.id}"] = tl;
})();
</script>
</body>
</html>
`;
}
