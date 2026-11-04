// Vídeo "Presença confirmada" (stories/reels 1080×1920) a partir do dados.json.
//
//   node gerar.mjs [id ...]            prepara o material, monta o projeto HyperFrames e renderiza
//   node gerar.mjs <id> --so-projeto   para antes do render (para conferir no preview/snapshot)
//
// Saída: saida/<id>/ (projeto) e saida/<id>.mp4.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pagina, tempos } from "./pagina.mjs";

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const HF = "hyperframes@0.8.214";
const FONTES = {
  "great-vibes.woff2": "https://fonts.gstatic.com/s/greatvibes/v21/RWmMoKWR9v4ksMfaWd_JN9XFiaQ.woff2",
};

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("--")));
const ids = args.filter((a) => !a.startsWith("--"));
const todos = JSON.parse(fs.readFileSync(path.join(AQUI, "dados.json"), "utf8"));
const escolhidos = ids.length ? todos.filter((r) => ids.includes(r.id)) : todos;
if (!escolhidos.length) {
  console.error(`Nenhum vídeo com id: ${ids.join(", ")}`);
  process.exit(1);
}

const sh = (cmd, a) => execFileSync(cmd, a, { stdio: ["ignore", "pipe", "pipe"], maxBuffer: 1 << 28 });
const ffmpeg = (a) => sh("ffmpeg", ["-loglevel", "error", "-y", ...a]);
const origem = (f) => {
  const p = path.join(AQUI, f);
  if (!fs.existsSync(p)) throw new Error(`Arquivo não encontrado: ${f} (veja fotos/LEIA.md)`);
  return p;
};
const cacheDir = path.join(AQUI, "saida", ".cache");
const chave = (...xs) => createHash("sha1").update(xs.join("|")).digest("hex").slice(0, 12);

// Recorte [x0, y0, x1, y1] de uma imagem, ampliado (ffmpeg preserva o alfa do PNG).
function recortar(arquivo, [x0, y0, x1, y1], destino, escala = 3) {
  ffmpeg(["-i", origem(arquivo), "-vf", `crop=${x1 - x0}:${y1 - y0}:${x0}:${y0},scale=iw*${escala}:ih*${escala}:flags=lanczos`, destino]);
}

// Pregador sem fundo: usa o PNG já recortado ou recorta com o modelo local do HyperFrames.
function pregador(a, destino) {
  if (a.fotoRecortada) return fs.copyFileSync(origem(a.fotoRecortada), destino);
  fs.mkdirSync(cacheDir, { recursive: true });
  const c = path.join(cacheDir, `semfundo-${chave(a.foto, fs.statSync(origem(a.foto)).size, a.fotoRecorte)}.png`);
  if (!fs.existsSync(c)) {
    const tmp = path.join(cacheDir, "recorte-tmp.png");
    recortar(a.foto, a.fotoRecorte, tmp, 1);
    sh("npx", ["-y", HF, "remove-background", tmp, "-o", c]);
  }
  fs.copyFileSync(c, destino);
}

function fontes(dir) {
  fs.mkdirSync(dir, { recursive: true });
  fs.mkdirSync(cacheDir, { recursive: true });
  for (const [nome, url] of Object.entries(FONTES)) {
    const c = path.join(cacheDir, nome);
    if (!fs.existsSync(c)) sh("curl", ["-sSfL", "-o", c, url]);
    fs.copyFileSync(c, path.join(dir, nome));
  }
}

// Música pronta (ex.: Kevin MacLeod, CC BY 4.0): baixa uma vez e recorta de modo que
// o ponto de explosão da música ("explosao", em s) caia na virada do vídeo.
function musicaPronta(m, t) {
  fs.mkdirSync(cacheDir, { recursive: true });
  const fonte = path.join(cacheDir, `musica-${chave(m.url)}${path.extname(new URL(m.url).pathname) || ".mp3"}`);
  if (!fs.existsSync(fonte)) sh("curl", ["-sSfL", "-o", fonte, m.url]);
  const ini = Math.max(0, m.explosao - t.virada);
  const saida = path.join(cacheDir, `trilha-${chave(m.url, ini, t.duracao)}.wav`);
  if (!fs.existsSync(saida))
    ffmpeg(["-ss", String(ini), "-t", String(t.duracao), "-i", fonte, "-af", `aformat=channel_layouts=stereo,afade=t=in:d=1.2,afade=t=out:st=${t.duracao - 2.5}:d=2.5`, "-ar", "48000", saida]);
  return saida;
}

// Trilha sintetizada por musica.py (sem direitos autorais).
function musicaSintetizada(m, t) {
  fs.mkdirSync(cacheDir, { recursive: true });
  const saida = path.join(cacheDir, `trilha-${chave(fs.statSync(path.join(AQUI, "musica.py")).mtimeMs, t.duracao, t.virada, t.final, m.tom || "D", m.bpm || 72)}.wav`);
  if (!fs.existsSync(saida)) sh("python3", ["-I", path.join(AQUI, "musica.py"), saida, String(t.duracao), String(t.virada), String(t.final), m.tom || "D", String(m.bpm || 72)]);
  return saida;
}

function montar(r) {
  const dest = path.join(AQUI, "saida", r.id);
  const assets = path.join(dest, "assets");
  const img = path.join(assets, "img");
  fs.mkdirSync(img, { recursive: true });
  const a = r.arquivos, c = r.cores;
  console.log(`▸ ${r.id}: preparando material`);

  pregador(a, path.join(img, "pregador.png"));
  fs.copyFileSync(origem(a.logoEvento), path.join(img, "logo-evento.png"));
  if (a.flores) fs.copyFileSync(origem(a.flores), path.join(img, "flores.png"));
  r.logos.forEach((l, i) => recortar(l.arquivo, l.recorte, path.join(img, `logo-${i + 1}.png`), 4));
  (r.lideres || []).forEach((l, i) => recortar(l.arquivo, l.recorte, path.join(img, `lider-${i + 1}.png`), 4));
  sh("python3", ["-I", path.join(AQUI, "texturas.py"), img, c.vinhoEscuro, c.vinho, c.rosaEscuro, c.rosa, c.rosaClaro]);
  fontes(path.join(assets, "fonts"));

  // Vídeo da pregação: tira as faixas gravadas por cima (recorte), mudo, 30 fps.
  const [w, h, x, y] = a.videoRecorte;
  const ini = a.audio.inicio, fala = Math.round((a.audio.fim - ini) * 1000) / 1000;
  const t = tempos(fala);
  ffmpeg(["-ss", String(ini), "-t", String(fala), "-i", origem(a.video), "-vf", `crop=${w}:${h}:${x}:${y},scale=1080:-2,fps=30`, "-an", "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", path.join(assets, "pregacao.mp4")]);

  // Trilha: pregação tratada (EQ + compressão) por cima da música, que abaixa um pouco
  // quando ele fala e cresce nas pausas e na virada.
  fs.mkdirSync(cacheDir, { recursive: true });
  const m = r.musica || {};
  const trilha = m.url ? musicaPronta(m, t) : musicaSintetizada(m, t);
  const atrasoVoz = Math.round(t.voz * 1000);
  ffmpeg([
    "-ss", String(ini), "-t", String(fala), "-i", origem(a.video),
    "-i", trilha,
    "-filter_complex", [
      `[0]aformat=channel_layouts=stereo,highpass=f=90,lowpass=f=11000,acompressor=threshold=-22dB:ratio=3:attack=8:release=180:makeup=2,afade=t=in:d=0.25,afade=t=out:st=${fala - 0.5}:d=0.5,adelay=${atrasoVoz}:all=1,apad[voz]`,
      `[voz]asplit=2[voz1][chave]`,
      `[1]volume=${m.volume ?? 0.42}[mus]`,
      `[mus][chave]sidechaincompress=threshold=0.06:ratio=2.5:attack=40:release=600:makeup=1[musica]`,
      `[voz1][musica]amix=inputs=2:normalize=0:duration=longest,atrim=0:${t.duracao},alimiter=limit=0.93[s]`,
    ].join(";"),
    "-map", "[s]", "-ar", "48000", path.join(assets, "audio.wav"),
  ]);

  fs.mkdirSync(path.join(dest, "lib"), { recursive: true });
  fs.copyFileSync(path.join(AQUI, "node_modules", "gsap", "dist", "gsap.min.js"), path.join(dest, "lib", "gsap.min.js"));
  fs.writeFileSync(path.join(dest, "index.html"), pagina(r, t));
  fs.writeFileSync(path.join(dest, "hyperframes.json"), JSON.stringify({ $schema: "https://hyperframes.heygen.com/schema/hyperframes.json", paths: { blocks: "compositions", components: "compositions/components", assets: "assets" } }, null, 2));
  fs.writeFileSync(path.join(dest, "meta.json"), JSON.stringify({ id: r.id, name: r.id }, null, 2));
  console.log(`  ${t.duracao.toFixed(1)} s`);
  return dest;
}

for (const r of escolhidos) {
  const dest = montar(r);
  if (flags.has("--so-projeto")) {
    console.log(`  projeto: ${dest}`);
    continue;
  }
  const mp4 = path.join(AQUI, "saida", `${r.id}.mp4`);
  console.log(`  renderizando → ${mp4}`);
  execFileSync("npx", ["-y", HF, "render", dest, "-o", mp4, "--quiet", "--skill", "hyperframes"], { stdio: "inherit" });
  console.log(`  ✓ ${mp4}`);
}
