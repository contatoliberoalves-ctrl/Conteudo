// Gera os Reels do molde Dark Constitucional.
//   node render.mjs                 → todos os roteiros de roteiros/*.json
//   node render.mjs 15-diretas ...  → só esses
//   node render.mjs --rapido 15-diretas → só os quadros de conferência (sem MP4)
// Saída: saida/<id>/video.mp4, saida/<id>/<n>.png (um quadro por cena, para a galeria) e saida/<id>/legenda.txt
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";

const AQUI = path.dirname(new URL(import.meta.url).pathname);
const cfg = JSON.parse(fs.readFileSync(path.join(AQUI, "config.json"), "utf8"));
const FPS = cfg.fps;

const args = process.argv.slice(2);
const rapido = args.includes("--rapido");
const soCapas = args.includes("--capas"); // só refaz saida/<id>/capa.jpg
const yt = args.includes("--yt"); // versão 16:9: saida/<id>/youtube.mp4 e youtube-capa.jpg (1280×720)
const semVoz = args.includes("--sem-voz");
let ids = args.filter((a) => !a.startsWith("--"));
if (!ids.length) ids = fs.readdirSync(path.join(AQUI, "roteiros")).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, ""));

if (!fs.existsSync(path.join(AQUI, "public/sfx/trilha.wav"))) execFileSync("node", [path.join(AQUI, "scripts/sons.mjs")], { stdio: "inherit" });

function navegador() {
  if (process.env.CHROMIUM_PATH && /headless_shell/.test(process.env.CHROMIUM_PATH)) return process.env.CHROMIUM_PATH;
  const base = "/opt/pw-browsers";
  if (fs.existsSync(base)) {
    for (const d of fs.readdirSync(base).filter((d) => d.startsWith("chromium_headless_shell"))) {
      for (const sub of ["chrome-linux/headless_shell", "chrome-headless-shell-linux64/chrome-headless-shell"]) {
        const p = path.join(base, d, sub);
        if (fs.existsSync(p)) return p;
      }
    }
  }
  return process.env.CHROMIUM_PATH || null; // null: o Remotion baixa o dele
}

// Tempo de cada palavra: pela voz (alinhamento do ElevenLabs) ou estimado pelo tamanho da palavra
function palavrasDaVoz(al) {
  const out = [];
  let w = "", ini = null, fim = 0;
  al.characters.forEach((ch, i) => {
    if (/\s/.test(ch)) { if (w) out.push({ w, ini, fim }); w = ""; ini = null; return; }
    if (ini === null) ini = al.character_start_times_seconds[i];
    w += ch; fim = al.character_end_times_seconds[i];
  });
  if (w) out.push({ w, ini, fim });
  return out;
}

function palavrasEstimadas(fala, durSeg) {
  const ws = fala.split(/\s+/).filter(Boolean);
  const pesos = ws.map((w) => w.length + 2 + (/[.,;:!?]$/.test(w) ? 4 : 0));
  const soma = pesos.reduce((a, b) => a + b, 0);
  const ini0 = 0.3, fim0 = Math.max(ini0 + 0.5, durSeg - 0.6);
  let t = ini0;
  return ws.map((w, i) => { const d = (fim0 - ini0) * pesos[i] / soma; const r = { w, ini: t, fim: t + d }; t += d; return r; });
}

const MINIMO = { capitulo: 2.6, foto: 4, gancho: 3, frase: 3.5, placar: 7, cedula: 7, documentos: 7, cartas: 6, pausa: 3.5, linha: 6, pergunta: 4.5 };

function preparar(id) {
  const r = JSON.parse(fs.readFileSync(path.join(AQUI, "roteiros", id + ".json"), "utf8"));
  const usarVoz = !semVoz && r.voz !== false;
  let inicio = 0, comVoz = false;
  const cenas = r.cenas.map((c, n) => {
    const fala = c.fala ?? "";
    const vozJson = path.join(AQUI, "public/voz", id, `${n + 1}.json`);
    let palavras, durSeg, audio;
    if (usarVoz && fala && fs.existsSync(vozJson)) {
      const v = JSON.parse(fs.readFileSync(vozJson, "utf8"));
      palavras = palavrasDaVoz(v.alignment);
      durSeg = Math.max(c.seg ?? 0, v.duracao + 0.45, MINIMO[c.tipo] ?? 3);
      audio = `voz/${id}/${n + 1}.mp3`;
      comVoz = true;
    } else {
      const nPal = fala.split(/\s+/).filter(Boolean).length;
      durSeg = Math.max(c.seg ?? 0, nPal / cfg.palavrasPorSegundoSemVoz + 1.0, MINIMO[c.tipo] ?? 3);
      palavras = fala ? palavrasEstimadas(fala, durSeg) : [];
    }
    if (c.tipo === "cedula" && c.vencedor != null && c.revelaEm == null) durSeg += c.contagem === false ? 2.2 : 4.6; // 3-2-1 e resultado depois da fala
    const dur = Math.round(durSeg * FPS);
    const pronta = { ...c, inicio, dur, audio, palavras: palavras.map((p) => ({ w: p.w, ini: Math.round(p.ini * FPS), fim: Math.round(p.fim * FPS) })) };
    inicio += dur;
    return pronta;
  });
  return { roteiro: r, props: { id, pauta: r.pauta, serie: r.serie, marca: r.marca ?? cfg.marca, cenas, total: inicio, comVoz } };
}

function legenda(r) {
  const partes = [r.legenda?.trim(), r.fontes?.length ? "Fontes: " + r.fontes.join(" · ") : "", (r.hashtags ?? []).map((h) => "#" + h.replace(/^#/, "")).join(" ")];
  return partes.filter(Boolean).join("\n\n") + "\n";
}

if (args.includes("--props")) { // só grava as props calculadas (para depurar)
  for (const id of ids) { const { props } = preparar(id); fs.mkdirSync(path.join(AQUI, "saida", id), { recursive: true }); fs.writeFileSync(path.join(AQUI, "saida", id, "props.json"), JSON.stringify(props)); }
  process.exit(0);
}

console.log("Empacotando o projeto…");
const servir = await bundle({ entryPoint: path.join(AQUI, "src/index.ts"), publicDir: path.join(AQUI, "public") });
const browserExecutable = navegador();
const chromiumOptions = {}; // gl "swangle" deixa 5× mais lento aqui

// dados.json é o índice da galeria (id e título, na ordem em que os vídeos foram feitos; novos no fim)
function indexar(id, r) {
  const arq = path.join(AQUI, "dados.json");
  const lista = fs.existsSync(arq) ? JSON.parse(fs.readFileSync(arq, "utf8")) : [];
  const item = lista.find((x) => x.id === id);
  if (item) item.titulo = r.titulo; else lista.push({ id, titulo: r.titulo });
  fs.writeFileSync(arq, JSON.stringify(lista, null, 2) + "\n");
}

// Descrição do YouTube: legenda do post + capítulos (a partir das cenas "capitulo")
function descricaoYoutube(id, dir, props) {
  const r = JSON.parse(fs.readFileSync(path.join(AQUI, "roteiros", id + ".json"), "utf8"));
  const caps = props.cenas.filter((c) => c.tipo === "capitulo");
  const mmss = (q) => { const s = Math.round(q / FPS); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };
  const capitulos = caps.length >= 2 ? "\n\nCapítulos\n0:00 Abertura\n" + caps.map((c) => `${mmss(c.inicio)} ${c.titulo}`).join("\n") : "";
  fs.writeFileSync(path.join(dir, "youtube-descricao.txt"), legenda(r).trim() + capitulos + "\n");
}

// Versão do YouTube (16:9): miniatura sem legenda e, sem --rapido, o vídeo
async function versaoYoutube(id, dir, comp, props) {
  console.log(`${id} (YouTube 16:9): ${(props.total / FPS).toFixed(1)} s`);
  const g = props.cenas[0], png = path.join(dir, "youtube-capa.png");
  await renderStill({ composition: { ...comp, props: { ...comp.props, capa: true } }, serveUrl: servir, output: png, frame: g.inicio + g.dur - 10, browserExecutable, chromiumOptions, overwrite: true });
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", png, "-vf", "scale=1280:720:flags=lanczos", "-q:v", "2", path.join(dir, "youtube-capa.jpg")]);
  fs.rmSync(png);
  if (rapido) {
    const outras = props.cenas.filter((c) => ["placar", "cedula", "documentos", "cartas", "linha"].includes(c.tipo)).slice(0, 2);
    for (const [n, c] of outras.entries())
      await renderStill({ composition: comp, serveUrl: servir, output: path.join(dir, `yt-${n + 1}.png`), frame: c.inicio + c.dur - 10, browserExecutable, chromiumOptions, overwrite: true });
    return;
  }
  const mp4 = path.join(dir, "youtube.mp4"), tmp = path.join(dir, "youtube-tmp.mp4");
  let ult = -1;
  await renderMedia({
    composition: comp, serveUrl: servir, codec: "h264", crf: 18, outputLocation: mp4, inputProps: props,
    browserExecutable, chromiumOptions, audioBitrate: "192k", concurrency: Math.max(1, (await import("node:os")).cpus().length),
    onProgress: ({ progress }) => { const p = Math.floor(progress * 10); if (p !== ult) { ult = p; process.stdout.write(` ${p * 10}%`); } },
  });
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", mp4, "-c:v", "copy", "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", "48000", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", tmp]);
  fs.renameSync(tmp, mp4);
  console.log(`\n  → saida/${id}/youtube.mp4`);
  descricaoYoutube(id, dir, props);
}

for (const id of ids) {
  const { roteiro, props } = preparar(id);
  if (!roteiro.longo) indexar(id, roteiro);
  const dir = path.join(AQUI, "saida", id);
  fs.mkdirSync(dir, { recursive: true });
  if (!soCapas && !yt) for (const f of fs.readdirSync(dir)) if (/^\d+\.png$/.test(f)) fs.rmSync(path.join(dir, f));
  const comp = await selectComposition({ serveUrl: servir, id: yt ? "Video169" : "Reel", inputProps: props, browserExecutable, chromiumOptions });
  if (yt) { await versaoYoutube(id, dir, comp, props); continue; }
  console.log(`${id}: ${props.cenas.length} cenas, ${(props.total / FPS).toFixed(1)} s${props.comVoz ? ", com voz" : ", sem voz"}`);
  // 3 quadros para conferir e para a galeria: a capa (gancho) e as duas primeiras cenas gráficas
  const graficas = props.cenas.map((c, n) => ({ c, n })).filter(({ c }) => ["placar", "cedula", "documentos", "cartas", "linha", "pausa"].includes(c.tipo));
  const escolhidas = [props.cenas[0], ...graficas.slice(0, 2).map((g) => g.c)];
  for (const c of props.cenas.slice(1)) if (escolhidas.length < 3 && !escolhidas.includes(c)) escolhidas.push(c);
  escolhidas.sort((a, b) => a.inicio - b.inicio);
  // Capa para subir no Instagram/TikTok: o gancho já montado, sem a legenda queimada
  const g = props.cenas[0], capaPng = path.join(dir, "capa.png");
  await renderStill({ composition: { ...comp, props: { ...comp.props, capa: true } }, serveUrl: servir, output: capaPng, frame: g.inicio + g.dur - 10, inputProps: { ...props, capa: true }, browserExecutable, chromiumOptions, overwrite: true });
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", capaPng, "-q:v", "2", path.join(dir, "capa.jpg")]);
  fs.rmSync(capaPng);
  if (soCapas) continue;
  for (const [n, c] of escolhidas.entries()) {
    const quadro = c.inicio + (c.tipo === "pergunta" ? Math.round(c.dur * 0.6) : c.dur - 10);
    await renderStill({ composition: comp, serveUrl: servir, output: path.join(dir, `${n + 1}.png`), frame: quadro, inputProps: props, browserExecutable, chromiumOptions, overwrite: true });
  }
  fs.writeFileSync(path.join(dir, "legenda.txt"), legenda(roteiro));
  if (rapido) continue;
  let ult = -1;
  await renderMedia({
    composition: comp, serveUrl: servir, codec: "h264", crf: 18, outputLocation: path.join(dir, "video.mp4"), inputProps: props,
    browserExecutable, chromiumOptions, audioBitrate: "192k", concurrency: Math.max(1, (await import("node:os")).cpus().length),
    onProgress: ({ progress }) => { const p = Math.floor(progress * 10); if (p !== ult) { ult = p; process.stdout.write(` ${p * 10}%`); } },
  });
  // Volume no padrão dos Reels (-14 LUFS), sem mexer na imagem
  const mp4 = path.join(dir, "video.mp4"), tmp = path.join(dir, "video-tmp.mp4");
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", mp4, "-c:v", "copy", "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", "48000", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", tmp]);
  fs.renameSync(tmp, mp4);
  console.log(`\n  → saida/${id}/video.mp4`);
}
