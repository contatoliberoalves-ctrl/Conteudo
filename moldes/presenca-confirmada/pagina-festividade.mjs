// index.html do "Presença confirmada" na arte da Festividade Unificada: fundo verde com fitas
// rosa (imagem do evento), letreiro creme recortado em peças (título, nome do pregador,
// "13 anos"), selo branco com os logos, foto do pregador e a pregação em tela cheia no meio.
// Mesma lógica do pagina.mjs: cartaz → pregação → cartaz, numa timeline GSAP pausada.
import { tempos } from "./pagina.mjs";

export { tempos };

const W = 1080, H = 1920;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

export function pagina(r, t) {
  const c = r.cores, D = t.duracao;
  const TELA = r.arquivos.alturaTela || 1180;

  // Fundo 4:5 cobrindo o 9:16.
  const [bw, bh] = r._fundo;
  const bs = Math.max(W / bw, H / bh) * 1.06;
  const B = { w: Math.round(bw * bs), h: Math.round(bh * bs) };
  B.x = Math.round((W - B.w) / 2);
  B.y = Math.round((H - B.h) / 2);

  // Vídeo da pregação cobrindo a tela cheia.
  const [vw, vh] = r.arquivos.videoRecorte;
  const vs = Math.max(W / vw, TELA / vh);
  const V = { w: Math.round(vw * vs), h: Math.round(vh * vs) };
  V.x = Math.round((W - V.w) / 2);

  // Pregador: largura da área visível e alto da cabeça vindos de arquivos.foto.
  const fp = { largura: 760, topo: 330, centro: 470, ...(r.arquivos.foto || {}) };
  const [x0, y0, x1] = r._foto.caixa;
  const fs_ = fp.largura / (x1 - x0);
  const F = { w: Math.round(r._foto.w * fs_) };
  F.x = Math.round(fp.centro - ((x0 + x1) / 2) * fs_);
  F.y = Math.round(fp.topo - y0 * fs_);

  const logos = r.logos.map((_, i) => `<img class="logo" id="logo${i + 1}" src="assets/img/logo-${i + 1}.png" alt="">`).join("");
  const dataLinha = [r.evento.data, r.evento.horario].filter(Boolean).join(" · ");

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>${esc(r.selo.join(" "))} · ${esc(r.pregador.titulo)} ${esc(r.pregador.nome)} ${esc(r.pregador.sobrenome)}</title>
<script src="lib/gsap.min.js"></script>
<style>
  @font-face { font-family: "Great Vibes"; src: url("assets/fonts/great-vibes.woff2") format("woff2"); }
  :root { --creme: ${c.creme}; --verde: ${c.verde}; --verde-escuro: ${c.verdeEscuro}; --rosa: ${c.rosa}; }
  html, body { margin: 0; width: ${W}px; height: ${H}px; overflow: hidden; background: var(--verde-escuro); }
  #root { position: relative; width: ${W}px; height: ${H}px; overflow: hidden; font-family: Montserrat; }
  .cheio { position: absolute; inset: 0; }

  #fundo { position: absolute; left: ${B.x}px; top: ${B.y}px; width: ${B.w}px; height: ${B.h}px; transform-origin: 50% 40%; }
  /* Escurece a base para o letreiro creme ler bem. */
  #sombra { background: linear-gradient(180deg, rgba(3,40,25,0.35) 0%, transparent 14%, transparent 48%, rgba(3,40,25,0.78) 70%, rgba(3,40,25,0.92) 100%); }

  #selo { position: absolute; left: 0; right: 0; margin: 0 auto; width: max-content; top: 48px; transform-origin: 50% 0%; display: flex; align-items: center; gap: 30px;
    padding: 14px 34px; background: rgba(255,255,255,0.94); border-radius: 60px; box-shadow: 0 10px 30px rgba(0,0,0,0.25); }
  #selo .logo { height: 92px; }
  #selo #logo2 { height: 104px; }

  #pregador { position: absolute; left: ${F.x}px; top: ${F.y}px; width: ${F.w}px; transform-origin: 50% 70%;
    -webkit-mask-image: linear-gradient(180deg, #000 ${1060 - F.y}px, transparent ${1380 - F.y}px); mask-image: linear-gradient(180deg, #000 ${1060 - F.y}px, transparent ${1380 - F.y}px);
    filter: drop-shadow(0 24px 40px rgba(0,0,0,0.35)); }
  #treze { position: absolute; left: 800px; top: 420px; width: 230px; filter: drop-shadow(0 6px 16px rgba(0,0,0,0.35)); transform-origin: 50% 50%; }

  #tela { position: absolute; left: 0; top: 0; width: ${W}px; height: ${TELA}px; overflow: hidden; opacity: 0; transform-origin: 50% 60%;
    -webkit-mask-image: linear-gradient(180deg, #000 72%, transparent 100%); mask-image: linear-gradient(180deg, #000 72%, transparent 100%); }
  #pulso { transform-origin: 50% 40%; }
  #camera { position: absolute; left: 0; top: 0; width: ${W}px; height: ${TELA}px; transform-origin: 50% 35%; }
  #pregacao { position: absolute; left: ${V.x}px; top: 0; width: ${V.w}px; height: ${V.h}px; object-fit: cover; }
  #tinta { background: linear-gradient(180deg, rgba(3,40,25,0.4) 0%, transparent 18%, transparent 60%, rgba(3,40,25,0.6) 100%); }
  #brilho-tela { position: absolute; top: -20%; left: -60%; width: 40%; height: 140%; opacity: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent); transform: rotate(18deg); }

  #titulo { position: absolute; left: 30px; top: 1150px; width: 1020px; filter: drop-shadow(0 6px 18px rgba(0,0,0,0.45)); }
  #nome { position: absolute; left: ${(W - 800) / 2}px; top: 1440px; width: 800px; filter: drop-shadow(0 6px 18px rgba(0,0,0,0.45)); }
  #pc { position: absolute; left: 0; right: 0; top: 1610px; text-align: center; font: 400 112px/1 "Great Vibes"; color: var(--creme);
    text-shadow: 0 6px 20px rgba(0,0,0,0.45); transform: rotate(-2deg); }
  #data { position: absolute; left: 0; right: 0; top: 1760px; text-align: center; font: 700 30px/1 Montserrat; letter-spacing: 0.16em; color: var(--creme); }

  #clarao { background: #fff; opacity: 0; }
</style>
</head>
<body>
<div id="root" data-composition-id="${r.id}" data-width="${W}" data-height="${H}" data-start="0" data-duration="${D}">
  <img id="fundo" src="assets/img/fundo.png" alt="">
  <div id="sombra" class="cheio"></div>

  <img id="pregador" src="assets/img/pregador.png" alt="">
  <img id="treze" src="assets/img/peca-destaque.png" alt="">

  <div id="tela">
    <div id="pulso" class="cheio"><div id="camera">
      <video id="pregacao" class="clip" src="assets/pregacao.mp4" data-start="${t.voz}" data-duration="${t.fala}" data-track-index="0" muted playsinline></video>
    </div></div>
    <div id="tinta" class="cheio"></div>
    <div id="brilho-tela"></div>
  </div>

  <div id="selo">${logos}</div>
  <img id="titulo" src="assets/img/peca-titulo.png" alt="">
  <img id="nome" src="assets/img/peca-nome.png" alt="">
  <div id="pc">${esc(r.selo.join(" "))}</div>
  ${dataLinha ? `<div id="data">${esc(dataLinha)}</div>` : ""}

  <div id="clarao" class="cheio"></div>
  <audio id="trilha" class="clip" src="assets/audio.wav" data-start="0" data-duration="${D}" data-track-index="1" data-volume="1"></audio>
</div>
<script>
(function () {
  const D = ${D}, VIRADA = ${t.virada}, FINAL = ${t.final}, ZOOM = ${r.arquivos.zoomCortes ?? 1};
  const BATIDA = 60 / 72, CORTE = 4 * BATIDA;
  const tl = gsap.timeline({ paused: true });

  // Fundo: as fitas andam devagar o vídeo todo.
  tl.fromTo("#fundo", { scale: 1.0, x: -20, y: 10 }, { scale: 1.08, x: 20, y: -20, duration: D, ease: "none" }, 0);

  // ---- Abertura
  tl.fromTo("#clarao", { opacity: 0.9 }, { opacity: 0, duration: 0.5, ease: "power2.out" }, 0);
  tl.fromTo("#selo", { y: -60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "back.out(1.8)" }, 0.3);
  tl.fromTo("#pregador", { y: 140, opacity: 0, scale: 1.05 }, { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" }, 0.4);
  tl.to("#pregador", { scale: 1.03, duration: VIRADA - 1.6, ease: "none" }, 1.6);
  tl.fromTo("#treze", { scale: 0, rotation: -12, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 0.8, ease: "back.out(2)" }, 1.0);
  tl.fromTo("#titulo", { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power2.inOut" }, 1.4);
  tl.fromTo("#nome", { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.0, ease: "power2.inOut" }, 2.4);
  tl.fromTo("#pc", { clipPath: "inset(-30% 100% -30% 0%)" }, { clipPath: "inset(-30% -5% -30% 0%)", duration: 1.0, ease: "power1.inOut" }, 3.2);
  ${dataLinha ? `tl.fromTo("#data", { opacity: 0 }, { opacity: 1, duration: 0.6 }, 3.9);` : ""}

  // ---- Virada: o pregador desce e a pregação toma a tela
  tl.fromTo("#clarao", { opacity: 0 }, { opacity: 0.35, duration: 0.15, yoyo: true, repeat: 1, immediateRender: false }, VIRADA - 0.1);
  tl.to("#pregador", { y: 240, opacity: 0, duration: 0.7, ease: "power2.in" }, VIRADA - 0.4);
  tl.to("#treze", { scale: 0.6, opacity: 0, duration: 0.4, ease: "power2.in" }, VIRADA - 0.4);
  tl.fromTo("#tela", { opacity: 0, scale: 0.72 }, { opacity: 1, scale: 1, duration: 0.85, ease: "power3.inOut" }, VIRADA - 0.25);
  tl.to("#selo", { scale: 0.78, y: -10, duration: 0.6, ease: "power3.inOut" }, VIRADA - 0.2);

  const cortes = [];
  for (let t0 = VIRADA; t0 < FINAL - 0.5; t0 += CORTE) cortes.push(t0);
  cortes.forEach((t0, i) => {
    const s0 = 1 + [0.05, 0.24, 0.12, 0.32, 0.08][i % 5] * ZOOM, dx = [0, -60, 40, -30, 60][i % 5], dy = [0, 40, -10, 70, 20][i % 5];
    const fim = Math.min(t0 + CORTE, FINAL + 0.6);
    tl.fromTo("#camera", { scale: s0, x: dx * ZOOM, y: dy * ZOOM }, { scale: s0 + 0.05 * ZOOM, x: dx * 0.8 * ZOOM, y: (dy - 8) * ZOOM, duration: fim - t0, ease: "none", immediateRender: false }, t0);
    if (i > 0) {
      tl.fromTo("#pulso", { scale: 1.02 }, { scale: 1, duration: 0.3, ease: "power2.out", immediateRender: false }, t0);
      tl.fromTo("#brilho-tela", { xPercent: 0, opacity: 0.8 }, { xPercent: 475, opacity: 0.8, duration: 0.5, ease: "power2.inOut", immediateRender: false }, t0 - 0.2);
    }
  });

  // ---- Fim: volta o cartaz
  tl.fromTo("#clarao", { opacity: 0 }, { opacity: 0.35, duration: 0.15, yoyo: true, repeat: 1, immediateRender: false }, FINAL - 0.1);
  tl.to("#tela", { opacity: 0, scale: 0.9, duration: 0.6, ease: "power2.inOut" }, FINAL - 0.1);
  tl.to("#selo", { scale: 1, y: 0, duration: 0.6, ease: "power3.out" }, FINAL);
  tl.fromTo("#pregador", { y: 140, opacity: 0, scale: 1.04 }, { y: 0, opacity: 1, scale: 1, duration: 1.0, ease: "power3.out", immediateRender: false }, FINAL);
  tl.fromTo("#treze", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: "back.out(2)", immediateRender: false }, FINAL + 0.4);

  window.__timelines = window.__timelines || {};
  window.__timelines["${r.id}"] = tl;
})();
</script>
</body>
</html>
`;
}
