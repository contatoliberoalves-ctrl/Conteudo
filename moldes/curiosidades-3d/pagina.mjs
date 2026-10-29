// index.html do projeto HyperFrames: canvas 3D + camada de texto + áudio.
export function pagina(r, R, fonte) {
  const W = R.largura, H = R.altura;
  const cores = { destaque: "#ffd60a", texto: "#ffffff", contorno: "#101418", ...(r.cores || {}) };
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>${r.titulo || r.id}</title>
<style>
  html, body { margin: 0; width: ${W}px; height: ${H}px; overflow: hidden; background: #000; }
  #root { position: relative; width: ${W}px; height: ${H}px; overflow: hidden; }
  #cena3d { position: absolute; inset: 0; width: ${W}px; height: ${H}px; }
  .camada { position: absolute; left: 50%; text-align: center; pointer-events: none; will-change: transform, opacity; }
  #selo {
    top: 210px; padding: 16px 34px 12px; background: ${cores.destaque}; color: ${cores.contorno};
    font: 400 50px/1 "Archivo Black"; letter-spacing: 1px; border-radius: 10px;
    box-shadow: 0 8px 0 ${cores.contorno}; opacity: 0; white-space: nowrap;
  }
  #fato {
    top: 330px; width: 940px; color: ${cores.texto}; font: 400 98px/1.02 "Archivo Black";
    -webkit-text-stroke: 18px ${cores.contorno}; paint-order: stroke fill;
    text-shadow: 0 10px 0 ${cores.contorno}; opacity: 0; transform-origin: 50% 50%;
  }
  #fato em { font-style: normal; color: ${cores.destaque}; }
  #legenda {
    top: 1215px; width: 920px; color: ${cores.texto}; font: 900 70px/1.12 Montserrat;
    -webkit-text-stroke: 14px ${cores.contorno}; paint-order: stroke fill; text-transform: uppercase;
    text-shadow: 0 7px 0 ${cores.contorno}; opacity: 0;
  }
  #legenda span { display: inline-block; opacity: 0.92; margin: 0 0.13em; }
  #legenda span.ativa { color: ${cores.destaque}; opacity: 1; transform: scale(1.08); }
  #legenda span.dita { opacity: 1; }
  #vinheta { position: absolute; inset: 0; pointer-events: none; background: radial-gradient(ellipse at 50% 45%, transparent 60%, rgba(0,0,0,0.28) 100%); }
  #barra { position: absolute; left: 0; bottom: 0; width: ${W}px; height: 12px; background: ${cores.destaque}; transform-origin: 0 50%; transform: scaleX(0); }
</style>
<script type="importmap">{ "imports": { "three": "./lib/three.module.min.js" } }</script>
<script>
  window.__hf = window.__hf || {};
  window.__hf.buildReady = window.__hf.buildReady || {};
  window.__hf.buildReady.motor3d = new Promise((ok) => { window.__motorPronto = ok; });
  window.ROTEIRO = ${JSON.stringify(R)};
  window.FONTE3D = ${JSON.stringify(fonte)};
</script>
</head>
<body>
<div id="root" data-composition-id="${r.id}" data-width="${W}" data-height="${H}" data-start="0" data-duration="${R.duracao}" data-fps="${R.fps}" data-no-timeline>
  <canvas id="cena3d" width="${W}" height="${H}"></canvas>
  <div id="vinheta"></div>
  <div id="selo" class="camada"></div>
  <div id="fato" class="camada"></div>
  <div id="legenda" class="camada"></div>
  <div id="barra"></div>
  <audio id="trilha" class="clip" src="assets/audio.wav" data-start="0" data-duration="${R.duracao}" data-track-index="1"></audio>
</div>
<script type="module" src="motor/motor.js"></script>
</body>
</html>
`;
}
