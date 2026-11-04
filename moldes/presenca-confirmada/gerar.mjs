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
import { pagina } from "./pagina.mjs";

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const HF = "hyperframes@0.8.214";
const FONTES = {
  "great-vibes.woff2": "https://fonts.gstatic.com/s/greatvibes/v21/RWmMoKWR9v4ksMfaWd_JN9XFiaQ.woff2",
  "cinzel-700.woff2": "https://fonts.gstatic.com/s/cinzel/v26/8vIU7ww63mVu7gtR-kwKxNvkNOjw-jHgfY3lDQ.woff2",
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

// Pregador sem fundo (modelo local do HyperFrames), com cache.
function semFundo(arquivo, recorte, destino) {
  fs.mkdirSync(cacheDir, { recursive: true });
  const c = path.join(cacheDir, `semfundo-${chave(arquivo, fs.statSync(origem(arquivo)).size, recorte)}.png`);
  if (!fs.existsSync(c)) {
    const tmp = path.join(cacheDir, "recorte-tmp.png");
    recortar(arquivo, recorte, tmp, 1);
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

// Sons sintetizados: impacto na abertura e "whoosh" nas viradas.
function sons() {
  const whoosh = path.join(cacheDir, "whoosh.wav"), impacto = path.join(cacheDir, "impacto.wav");
  if (!fs.existsSync(whoosh))
    ffmpeg(["-f", "lavfi", "-i", "anoisesrc=d=0.6:c=pink:a=0.6:r=48000", "-af", "highpass=f=300,lowpass=f=6000,afade=t=in:d=0.35:curve=exp,afade=t=out:st=0.35:d=0.25,volume=0.35", whoosh]);
  if (!fs.existsSync(impacto))
    ffmpeg(["-f", "lavfi", "-i", "aevalsrc=0.9*sin(2*PI*(45+120*exp(-t*9))*t)*exp(-t*3.5):d=1.4:s=48000", "-af", "lowpass=f=400,volume=0.7", impacto]);
  return { whoosh, impacto };
}

function montar(r) {
  const dest = path.join(AQUI, "saida", r.id);
  const assets = path.join(dest, "assets");
  fs.mkdirSync(path.join(assets, "img"), { recursive: true });
  const a = r.arquivos;
  console.log(`▸ ${r.id}: preparando material`);

  semFundo(a.foto, a.fotoRecorte, path.join(assets, "img", "pregador.png"));
  r.logos.forEach((l, i) => recortar(l.arquivo, l.recorte, path.join(assets, "img", `logo-${i + 1}.png`), 4));
  (r.lideres || []).forEach((l, i) => recortar(l.arquivo, l.recorte, path.join(assets, "img", `lider-${i + 1}.png`), 4));
  fontes(path.join(assets, "fonts"));

  // Vídeo da pregação: tira as faixas gravadas por cima (recorte), mudo, 30 fps.
  const [w, h, x, y] = a.videoRecorte;
  const ini = a.audio.inicio, fim = a.audio.fim, dur = Math.round((fim - ini) * 1000) / 1000;
  ffmpeg(["-ss", String(ini), "-t", String(dur), "-i", origem(a.video), "-vf", `crop=${w}:${h}:${x}:${y},scale=1080:-2,fps=30`, "-an", "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", path.join(assets, "pregacao.mp4")]);

  // Áudio: a própria pregação + impacto na abertura + whoosh nas viradas.
  const t = tempos(dur);
  const s = sons();
  const ev = [[s.impacto, 0], [s.whoosh, t.virada - 0.3], [s.whoosh, t.final - 0.3]];
  ffmpeg([
    "-ss", String(ini), "-t", String(dur), "-i", origem(a.video),
    ...ev.flatMap(([f]) => ["-i", f]),
    "-filter_complex",
    ev.map(([, at], i) => `[${i + 1}]adelay=${Math.round(at * 1000)}:all=1[e${i}]`).join(";") +
      `;[0]aformat=channel_layouts=stereo,afade=t=in:d=0.3,afade=t=out:st=${dur - 0.6}:d=0.6[v];[v]${ev.map((_, i) => `[e${i}]`).join("")}amix=inputs=${ev.length + 1}:normalize=0:duration=first,alimiter=limit=0.95[s]`,
    "-map", "[s]", "-ar", "48000", path.join(assets, "audio.wav"),
  ]);

  fs.mkdirSync(path.join(dest, "lib"), { recursive: true });
  fs.copyFileSync(path.join(AQUI, "node_modules", "gsap", "dist", "gsap.min.js"), path.join(dest, "lib", "gsap.min.js"));
  fs.writeFileSync(path.join(dest, "index.html"), pagina(r, dur, t));
  fs.writeFileSync(path.join(dest, "hyperframes.json"), JSON.stringify({ $schema: "https://hyperframes.heygen.com/schema/hyperframes.json", paths: { blocks: "compositions", components: "compositions/components", assets: "assets" } }, null, 2));
  fs.writeFileSync(path.join(dest, "meta.json"), JSON.stringify({ id: r.id, name: r.id }, null, 2));
  console.log(`  ${dur.toFixed(1)} s`);
  return dest;
}

// Momentos do roteiro: abertura com o cartaz, virada para o corpo (janela com a pregação)
// e volta ao cartaz no fim.
export function tempos(dur) {
  return { virada: 5.6, final: Math.max(8, dur - 3.2) };
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
