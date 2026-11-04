// index.html do vídeo "Presença confirmada", na linha da arte de referência:
// topo rosado claro, arco vinho com textura de nuvem, laterais rosa em diagonal,
// "PRESENÇA" condensado em vinho e "confirmada" em pincel branco.
// O arco vira a janela da pregação no meio do vídeo. Toda a animação está numa
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
  const letras = [...r.selo[0]].map((l, i) => `<span class="mascara"><span class="le" id="le${i}">${esc(l)}</span></span>`).join("");
  const dataLinha = [ev.data, ev.horario].filter(Boolean).join(" · ");

  // Arco: x 172–908, topo em 640, cantos de cima bem arredondados.
  const A = { x: 172, y: 640, w: 736, h: 1000, raio: 120 };

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>${esc(r.selo.join(" "))} · ${esc(pg.titulo)} ${esc(pg.nome)} ${esc(pg.sobrenome)}</title>
<script src="lib/gsap.min.js"></script>
<style>
  @font-face { font-family: "Mr Dafoe"; src: url("assets/fonts/mr-dafoe.woff2") format("woff2"); }
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
  #janela { position: absolute; inset: 0; opacity: 0; }
  #camera { position: absolute; left: 0; top: 0; width: ${A.w}px; height: ${A.h}px; transform-origin: 50% 35%; }
  #pregacao { position: absolute; left: 0; top: -10px; width: ${A.w}px; height: ${Math.round((A.w * 940) / 720)}px; object-fit: cover; }
  #tinta { background: linear-gradient(180deg, rgba(78,7,22,0.35) 0%, transparent 18%, transparent 52%, rgba(126,13,35,0.85) 100%); }
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

  /* Título. */
  #presenca { position: absolute; z-index: 2; left: 0; right: 0; top: 1112px; text-align: center; font: 400 330px/0.86 "League Gothic"; letter-spacing: 0.005em;
    color: var(--titulo); text-shadow: 0 10px 30px rgba(78,7,22,0.25); }
  .mascara { display: inline-block; overflow: hidden; vertical-align: top; padding: 14px 0 70px; margin-bottom: -70px; }
  .le { display: inline-block; background: linear-gradient(180deg, ${c.titulo} 0%, ${c.vinho} 55%, ${c.vinhoEscuro} 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
  #confirmada { position: absolute; left: 96px; top: 1462px; z-index: 3; font: 400 196px/1 "Mr Dafoe"; color: var(--branco); transform: rotate(-6deg); transform-origin: 0% 50%;
    text-shadow: 0 8px 24px rgba(78,7,22,0.35); padding: 0 40px; }

  /* Nome, cidade e líderes. */
  #nome { position: absolute; left: 0; right: 0; top: 1668px; text-align: center; font: 800 46px/1 Montserrat; letter-spacing: 0.08em; color: var(--branco); }
  #nome .sob { color: #ffe1ea; }
  .traco { display: inline-block; width: 70px; height: 3px; background: rgba(255,255,255,0.7); vertical-align: middle; margin: 0 22px; }
  #cidade { position: absolute; left: 0; right: 0; top: 1734px; text-align: center; font: 700 25px/1 Montserrat; letter-spacing: 0.24em; color: #ffe1ea; }
  #data { position: absolute; left: 0; right: 0; top: 1622px; text-align: center; font: 800 34px/1 Montserrat; letter-spacing: 0.1em; color: var(--branco); }
  .lider { position: absolute; top: 1784px; display: flex; align-items: center; gap: 14px; }
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
    <div id="janela">
      <div id="camera">
        <video id="pregacao" class="clip" src="assets/pregacao.mp4" data-start="${t.voz}" data-duration="${t.fala}" data-track-index="0" muted playsinline></video>
      </div>
      <div id="tinta" class="cheio"></div>
    </div>
    <div id="brilho-arco"></div>
  </div>
  <div id="base"><div class="tex" id="base-tex"></div></div>
  <div id="nevoa"></div>
  ${r.arquivos.flores ? `<img class="flores" id="flores-esq" src="assets/img/flores.png" alt=""><img class="flores" id="flores-dir" src="assets/img/flores.png" alt="">` : ""}
  <svg class="cheio" id="poeira" viewBox="0 0 ${W} ${H}">${poeira}</svg>

  <img id="pregador" src="assets/img/pregador.png" alt="">

  <div id="logos">${logos}</div>
  <img id="logo-evento" src="assets/img/logo-evento.png" alt="">
  <div id="faixa">${esc(ev.faixa)}</div>

  <div id="presenca">${letras}</div>
  <div id="confirmada">${esc(r.selo[1])}</div>
  ${dataLinha ? `<div id="data">${esc(dataLinha)}</div>` : ""}
  <div id="nome"><span class="traco" id="traco1"></span>${esc(pg.titulo)} ${esc(pg.nome)} <span class="sob">${esc(pg.sobrenome)}</span><span class="traco" id="traco2"></span></div>
  <div id="cidade">${esc(ev.local)}</div>
  ${lideres}

  <div id="luz"></div>
  <div id="clarao" class="cheio"></div>
  <audio id="trilha" class="clip" src="assets/audio.wav" data-start="0" data-duration="${D}" data-track-index="1" data-volume="1"></audio>
</div>
<script>
(function () {
  const D = ${D}, VIRADA = ${t.virada}, FINAL = ${t.final};
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
  tl.fromTo("#presenca .le", { yPercent: 105, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.06, ease: "power4.out" }, 2.0);
  tl.fromTo("#confirmada", { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(-20% -10% -20% 0%)", duration: 1.1, ease: "power1.inOut" }, 2.6);
  tl.fromTo("#nome", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 3.4);
  tl.fromTo(["#traco1", "#traco2"], { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: "power3.out" }, 3.6);
  tl.fromTo("#cidade", { opacity: 0 }, { opacity: 1, duration: 0.6 }, 3.8);
  ${dataLinha ? `tl.fromTo("#data", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6 }, 3.2);` : ""}
  tl.fromTo(".lider", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: "power3.out" }, 4.0);
  tl.fromTo("#luz", { left: "-50%", opacity: 0.9 }, { left: "120%", opacity: 0.9, duration: 1.4, ease: "power2.inOut" }, 2.2);

  // ---- Virada: o pregador desce, o arco acende e vira a janela da pregação
  function virada(t0) {
    tl.fromTo("#brilho-arco", { left: "-60%", opacity: 1 }, { left: "130%", opacity: 1, duration: 0.7, ease: "power2.inOut", immediateRender: false }, t0 - 0.3);
    tl.fromTo("#clarao", { opacity: 0 }, { opacity: 0.35, duration: 0.15, yoyo: true, repeat: 1, ease: "power1.inOut", immediateRender: false }, t0 - 0.1);
  }
  virada(VIRADA);
  tl.to("#pregador", { y: 240, opacity: 0, duration: 0.7, ease: "power2.in" }, VIRADA - 0.4);
  tl.to(".lider", { opacity: 0, y: 30, duration: 0.4, ease: "power2.in" }, VIRADA - 0.4);
  tl.fromTo("#janela", { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.out" }, VIRADA);

  // "Cortes" na janela: enquadramento muda de repente e segue num zoom lento.
  const cortes = [];
  for (let t0 = VIRADA; t0 < FINAL - 0.5; t0 += 3.6) cortes.push(t0);
  cortes.forEach((t0, i) => {
    const s0 = [1.05, 1.24, 1.12, 1.32, 1.08][i % 5], dx = [0, -60, 40, -30, 60][i % 5], dy = [0, 40, -10, 70, 20][i % 5];
    const fim = Math.min(t0 + 3.6, FINAL + 0.6);
    tl.fromTo("#camera", { scale: s0, x: dx, y: dy }, { scale: s0 + 0.05, x: dx * 0.8, y: dy - 8, duration: fim - t0, ease: "none", immediateRender: false }, t0);
    if (i > 0) tl.fromTo("#brilho-arco", { left: "-60%", opacity: 0.8 }, { left: "130%", opacity: 0.8, duration: 0.5, ease: "power2.inOut", immediateRender: false }, t0 - 0.2);
  });
  tl.fromTo(["#presenca", "#confirmada"], { scale: 1 }, { scale: 0.985, duration: FINAL - VIRADA, ease: "sine.inOut", immediateRender: false }, VIRADA);

  // ---- Fim: a janela apaga, o pregador volta e os líderes reaparecem
  virada(FINAL);
  tl.to("#janela", { opacity: 0, duration: 0.6, ease: "power2.inOut" }, FINAL - 0.1);
  tl.fromTo("#pregador", { y: 160, opacity: 0, scale: 1.04 }, { y: 0, opacity: 1, scale: 1, duration: 1.0, ease: "power3.out", immediateRender: false }, FINAL);
  tl.fromTo(".lider", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: "power3.out", immediateRender: false }, FINAL + 0.4);
  tl.fromTo("#luz", { left: "-50%", opacity: 0.9 }, { left: "120%", opacity: 0.9, duration: 1.4, ease: "power2.inOut", immediateRender: false }, FINAL + 0.8);

  window.__timelines = window.__timelines || {};
  window.__timelines["${r.id}"] = tl;
})();
</script>
</body>
</html>
`;
}
