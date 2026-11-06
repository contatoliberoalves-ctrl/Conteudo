// index.html do "Presença confirmada" na arte oficial da Festividade Unificada: o fundo da arte
// (cetim verde, rosas e fitas, sem o letreiro) se move devagar com brilhos; o letreiro volta
// em peças animadas (logos, título, "13 anos", "Ieadalpe Triunfo"), com a foto do pregador e
// o nome em prata. No meio, a pregação aparece inteira em tela cheia (sem corte nem zoom), com
// a faixa do nome embaixo cobrindo a marca d'água do vídeo.
import { tempos } from "./pagina.mjs";

export { tempos };

const W = 1080, H = 1920;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), a | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pagina(r, t) {
  const c = r.cores, D = t.duracao, pg = r.pregador;
  const L = { logos: [260, 56, 560], titulo: [60, 228, 960], treze: [220, 1290, 640], triunfo: [280, 1800, 520], ...(r.arquivos.layout || {}) };

  // Fundo da arte cobrindo o 9:16, com folga para o movimento.
  const [bw, bh] = r._fundo;
  const bs = Math.max(W / bw, H / bh) * 1.04;
  const B = { w: Math.round(bw * bs), h: Math.round(bh * bs) };
  B.x = Math.round((W - B.w) / 2);
  B.y = Math.round((H - B.h) / 2);

  // Pregação inteira, na largura da tela.
  const [vw, vh] = r.arquivos.videoRecorte;
  const V = { w: W, h: Math.round((vh * W) / vw) };
  V.y = Math.round((H - V.h) / 2);

  // Pregador: largura da área visível e alto da cabeça vindos de arquivos.foto.
  const fp = { largura: 980, topo: 690, centro: 540, ...(r.arquivos.foto || {}) };
  const [x0, y0, x1] = r._foto.caixa;
  const fs_ = fp.largura / (x1 - x0);
  const F = { w: Math.round(r._foto.w * fs_) };
  F.x = Math.round(fp.centro - ((x0 + x1) / 2) * fs_);
  F.y = Math.round(fp.topo - y0 * fs_);

  const peca = (nome) => {
    const [x, y, w] = L[nome];
    return `<div class="peca" id="p-${nome}" style="left:${x}px;top:${y}px;width:${w}px">
      <img src="assets/img/peca-${nome}.png" alt="">
      <div class="reflexo" style="-webkit-mask-image:url(assets/img/peca-${nome}.png);mask-image:url(assets/img/peca-${nome}.png)"><div class="faixa-luz"></div></div>
    </div>`;
  };
  const ra = rng(13);
  const faiscas = Array.from({ length: 18 }, (_, i) => {
    const s = 18 + ra() * 30;
    return `<svg class="fa" id="fa${i}" viewBox="-10 -10 20 20" style="left:${(40 + ra() * 1000).toFixed(0)}px;top:${(200 + ra() * 1500).toFixed(0)}px;width:${s.toFixed(0)}px;height:${s.toFixed(0)}px"><circle r="3.5" fill="#fff" opacity="0.5"/><path d="M0,-10 C1,-2 2,-1 10,0 C2,1 1,2 0,10 C-1,2 -2,1 -10,0 C-2,-1 -1,-2 0,-10Z" fill="#fff"/></svg>`;
  }).join("");
  const dataLinha = [r.evento.data, r.evento.horario].filter(Boolean).join(" · ");

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>${esc(r.selo.join(" "))} · ${esc(pg.titulo)} ${esc(pg.nome)} ${esc(pg.sobrenome)}</title>
<script src="lib/gsap.min.js"></script>
<style>
  @font-face { font-family: "Great Vibes"; src: url("assets/fonts/great-vibes.woff2") format("woff2"); }
  @font-face { font-family: "Cinzel"; font-weight: 700; src: url("assets/fonts/cinzel-700.woff2") format("woff2"); }
  :root { --rosa: ${c.rosa}; --verde-escuro: ${c.verdeEscuro}; }
  html, body { margin: 0; width: ${W}px; height: ${H}px; overflow: hidden; background: var(--verde-escuro); }
  #root { position: relative; width: ${W}px; height: ${H}px; overflow: hidden; font-family: Montserrat; }
  .cheio { position: absolute; inset: 0; }

  #fundo { position: absolute; left: ${B.x}px; top: ${B.y}px; width: ${B.w}px; height: ${B.h}px; transform-origin: 50% 45%; }
  /* Brilho do cetim: faixa clara larga atravessando o fundo. */
  #cetim { position: absolute; top: -20%; left: -70%; width: 60%; height: 140%; mix-blend-mode: soft-light; opacity: 0.9;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.75), transparent); transform: rotate(22deg); }
  .fa { position: absolute; opacity: 0; }

  .peca { position: absolute; }
  .peca img { display: block; width: 100%; filter: drop-shadow(0 8px 16px rgba(0,0,0,0.45)); }
  .reflexo { position: absolute; inset: 0; -webkit-mask-size: 100% 100%; mask-size: 100% 100%; overflow: hidden; pointer-events: none; }
  .faixa-luz { position: absolute; top: -30%; left: -60%; width: 35%; height: 160%; transform: rotate(20deg); mix-blend-mode: screen;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent); }

  #pregador { position: absolute; left: ${F.x}px; top: ${F.y}px; width: ${F.w}px; transform-origin: 50% 70%;
    filter: drop-shadow(0 22px 36px rgba(0,0,0,0.45)); }

  /* Pregação em tela cheia, inteira. */
  #tela { position: absolute; inset: 0; opacity: 0; background: #000; }
  #pregacao { position: absolute; left: 0; top: ${V.y}px; width: ${V.w}px; height: ${V.h}px; object-fit: contain; }
  #topo-tela { position: absolute; left: 0; right: 0; top: 0; height: 330px; background: linear-gradient(180deg, rgba(2,30,18,0.85), transparent); }

  /* Faixa de baixo (cobre a marca d'água do vídeo na pregação). */
  #faixa { position: absolute; left: 0; right: 0; top: 1380px; bottom: 0; opacity: 0;
    background: linear-gradient(180deg, rgba(2,30,18,0) 0%, rgba(2,30,18,0.93) 26%, rgba(2,30,18,0.97) 100%); }

  .prata { background: linear-gradient(180deg, #ffffff 0%, #e9ebef 38%, #a7abb3 52%, #f6f6f8 70%, #c9ccd2 100%);
    -webkit-background-clip: text; background-clip: text; color: transparent;
    filter: drop-shadow(0 3px 0 ${c.rosa}) drop-shadow(0 8px 14px rgba(0,0,0,0.55)); }
  #nome { position: absolute; left: 0; right: 0; top: 1556px; text-align: center; font: 700 70px/1 Cinzel; letter-spacing: 0.02em; white-space: nowrap; }
  #pc { position: absolute; left: 0; right: 0; top: 1640px; text-align: center; font: 400 104px/1.05 "Great Vibes"; padding: 0 30px; }
  #data { position: absolute; left: 0; right: 0; top: 1500px; text-align: center; font: 700 32px/1 Cinzel; letter-spacing: 0.08em; }

  #clarao { background: #fff; opacity: 0; }
</style>
</head>
<body>
<div id="root" data-composition-id="${r.id}" data-width="${W}" data-height="${H}" data-start="0" data-duration="${D}">
  <img id="fundo" src="assets/img/fundo.png" alt="">
  <div id="cetim"></div>

  <img id="pregador" src="assets/img/pregador.png" alt="">

  <div id="tela">
    <video id="pregacao" class="clip" src="assets/pregacao.mp4" data-start="${t.voz}" data-duration="${t.fala}" data-track-index="0" muted playsinline></video>
    <div id="topo-tela"></div>
  </div>
  <div id="faixa"></div>

  ${peca("logos")}
  ${peca("titulo")}
  ${peca("treze")}
  ${peca("triunfo")}
  ${dataLinha ? `<div id="data" class="prata">${esc(dataLinha)}</div>` : ""}
  <div id="nome" class="prata">${esc(pg.titulo)} ${esc(pg.nome)} ${esc(pg.sobrenome)}</div>
  <div id="pc" class="prata">${esc(r.selo.join(" "))}</div>

  ${faiscas}
  <div id="clarao" class="cheio"></div>
  <audio id="trilha" class="clip" src="assets/audio.wav" data-start="0" data-duration="${D}" data-track-index="1" data-volume="1"></audio>
</div>
<script>
(function () {
  const D = ${D}, VIRADA = ${t.virada}, FINAL = ${t.final};
  const tl = gsap.timeline({ paused: true });
  const q = (s) => document.querySelectorAll(s);
  let semente = 7;
  const rnd = () => { semente = (semente * 16807) % 2147483647; return semente / 2147483647; };

  // ---- Fundo vivo: zoom e deriva lentos, brilho de cetim passando, faíscas piscando.
  tl.fromTo("#fundo", { scale: 1.0, x: -14, y: 8, rotation: -0.4 }, { scale: 1.07, x: 14, y: -16, rotation: 0.4, duration: D, ease: "sine.inOut" }, 0);
  for (let t0 = 0.6; t0 < D - 1; t0 += 4.2) {
    tl.fromTo("#cetim", { xPercent: 0 }, { xPercent: 420, duration: 2.6, ease: "sine.inOut", immediateRender: false }, t0);
  }
  q(".fa").forEach((el) => {
    const per = 1.4 + rnd() * 2, ini = rnd() * per;
    const n = Math.max(1, Math.floor((D - ini) / per));
    tl.fromTo(el, { opacity: 0, scale: 0.2, rotation: 0 }, { opacity: 1, scale: 1, rotation: 45, duration: per / 2, ease: "sine.inOut", repeat: n * 2 - 1, yoyo: true }, ini);
  });
  // Reflexo percorrendo as letras prateadas a cada ~5 s.
  q(".faixa-luz").forEach((el, i) => {
    for (let t0 = 2.4 + i * 0.25; t0 < D - 1; t0 += 5.2) {
      tl.fromTo(el, { xPercent: 0 }, { xPercent: 470, duration: 1.1, ease: "power2.inOut", immediateRender: false }, t0);
    }
  });

  // ---- Abertura
  tl.fromTo("#clarao", { opacity: 0.85 }, { opacity: 0, duration: 0.6, ease: "power2.out" }, 0);
  tl.fromTo("#p-logos", { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "back.out(1.8)" }, 0.25);
  tl.fromTo("#p-titulo", { scale: 1.25, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9, ease: "power3.out" }, 0.5);
  tl.fromTo("#pregador", { y: 160, opacity: 0, scale: 1.05 }, { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" }, 0.9);
  tl.to("#pregador", { scale: 1.03, duration: VIRADA - 2.1, ease: "none" }, 2.1);
  tl.fromTo("#p-treze", { scale: 0, rotation: -8, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 0.8, ease: "back.out(1.9)" }, 1.6);
  tl.fromTo("#nome", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 2.3);
  tl.fromTo("#pc", { clipPath: "inset(-30% 100% -30% 0%)" }, { clipPath: "inset(-30% -5% -30% 0%)", duration: 1.1, ease: "power1.inOut" }, 2.7);
  tl.fromTo("#p-triunfo", { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.6, ease: "power3.out" }, 3.4);
  ${dataLinha ? `tl.fromTo("#data", { opacity: 0 }, { opacity: 1, duration: 0.6 }, 3.6);` : ""}

  // ---- Virada: a pregação inteira toma a tela; ficam logos, nome e "Presença confirmada".
  tl.fromTo("#clarao", { opacity: 0 }, { opacity: 0.4, duration: 0.15, yoyo: true, repeat: 1, immediateRender: false }, VIRADA - 0.1);
  tl.to(["#pregador", "#p-titulo", "#p-treze"], { opacity: 0, duration: 0.45, ease: "power2.in" }, VIRADA - 0.3);
  tl.fromTo("#tela", { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 0.7, ease: "power3.out" }, VIRADA - 0.1);
  tl.fromTo("#faixa", { opacity: 0 }, { opacity: 1, duration: 0.5 }, VIRADA);
  tl.to("#p-logos", { scale: 0.72, y: -12, duration: 0.6, ease: "power3.inOut" }, VIRADA - 0.1);

  // ---- Fim: volta a arte completa.
  tl.fromTo("#clarao", { opacity: 0 }, { opacity: 0.4, duration: 0.15, yoyo: true, repeat: 1, immediateRender: false }, FINAL - 0.1);
  tl.to(["#tela", "#faixa"], { opacity: 0, duration: 0.6, ease: "power2.inOut" }, FINAL - 0.1);
  tl.to("#p-logos", { scale: 1, y: 0, duration: 0.6, ease: "power3.out" }, FINAL);
  tl.to("#p-titulo", { opacity: 1, duration: 0.6 }, FINAL + 0.1);
  tl.fromTo("#pregador", { y: 140, opacity: 0, scale: 1.04 }, { y: 0, opacity: 1, scale: 1, duration: 1.0, ease: "power3.out", immediateRender: false }, FINAL);
  tl.fromTo("#p-treze", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: "back.out(1.9)", immediateRender: false }, FINAL + 0.4);

  window.__timelines = window.__timelines || {};
  window.__timelines["${r.id}"] = tl;
})();
</script>
</body>
</html>
`;
}
