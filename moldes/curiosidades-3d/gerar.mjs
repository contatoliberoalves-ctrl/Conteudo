// Gera vídeos curtos de curiosidades em 3D a partir do dados.json.
//
//   node gerar.mjs [id ...]          narração, projeto HyperFrames e MP4 (todos, se não passar id)
//   node gerar.mjs <id> --so-projeto  para antes do render (para abrir no preview)
//   node gerar.mjs <id> --rascunho    render rápido em qualidade de rascunho
//
// Saída em saida/<id>/ (projeto) e saida/<id>.mp4.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pagina } from "./pagina.mjs";

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const HF = "hyperframes@0.8.214";
const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("--")));
const ids = args.filter((a) => !a.startsWith("--"));

const roteiros = JSON.parse(fs.readFileSync(path.join(AQUI, "dados.json"), "utf8"));
const escolhidos = ids.length ? roteiros.filter((r) => ids.includes(r.id)) : roteiros;
if (!escolhidos.length) {
  console.error(`Nenhum roteiro com id: ${ids.join(", ")}`);
  process.exit(1);
}

const sh = (cmd, a, op = {}) => execFileSync(cmd, a, { stdio: ["ignore", "pipe", "pipe"], maxBuffer: 1 << 28, ...op });
const ffmpeg = (a) => sh("ffmpeg", ["-loglevel", "error", "-y", ...a]);
const duracao = (f) => parseFloat(sh("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString());

// ---------------------------------------------------------------- Narração

function narrar(texto, voz, velocidade, destino) {
  const chave = createHash("sha1").update(`${voz}|${velocidade}|${texto}`).digest("hex").slice(0, 12);
  const cache = path.join(AQUI, "saida", ".voz", `${chave}.wav`);
  if (!fs.existsSync(cache)) {
    fs.mkdirSync(path.dirname(cache), { recursive: true });
    const lang = voz.startsWith("p") ? ["--lang", "pt-br"] : [];
    sh("npx", ["-y", HF, "tts", texto, "--voice", voz, "--speed", String(velocidade), ...lang, "-o", cache, "--json"]);
  }
  fs.copyFileSync(cache, destino);
  return duracao(destino);
}

// Envelope de volume por quadro (0–1), para a boca do personagem que fala.
function envelopeDe(arquivo, fps, total) {
  const raw = sh("ffmpeg", ["-loglevel", "error", "-i", arquivo, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"]);
  const amostras = new Int16Array(raw.buffer, raw.byteOffset, raw.length >> 1);
  const porQuadro = 16000 / fps;
  const n = Math.ceil(total * fps) + 2;
  const rms = new Array(n).fill(0);
  for (let q = 0; q < n; q++) {
    const a = Math.floor(q * porQuadro), b = Math.min(amostras.length, Math.floor((q + 1) * porQuadro));
    let s = 0;
    for (let i = a; i < b; i++) s += (amostras[i] / 32768) ** 2;
    rms[q] = b > a ? Math.sqrt(s / (b - a)) : 0;
  }
  const ordenado = rms.filter((x) => x > 0.005).sort((x, y) => x - y);
  const ref = ordenado[Math.floor(ordenado.length * 0.92)] || 1;
  // Ataque rápido, soltura mais lenta: a boca não "treme".
  let v = 0;
  return rms.map((x) => {
    const alvo = Math.min(1, Math.sqrt(Math.max(0, x / ref - 0.06)));
    v = alvo > v ? v + (alvo - v) * 0.7 : v + (alvo - v) * 0.35;
    return Math.round(v * 1000) / 1000;
  });
}

// Palavras distribuídas no trecho em que há voz, com peso pelo tamanho e pela pontuação.
function cronometrarPalavras(cena, env, fps) {
  const q0 = Math.floor(cena.inicio * fps), q1 = Math.floor((cena.inicio + cena.dur) * fps);
  let a = q0, b = q1;
  while (a < q1 && env[a] < 0.08) a++;
  while (b > a && env[b] < 0.08) b--;
  const ini = a / fps - cena.inicio, fim = (b + 1) / fps - cena.inicio;
  const palavras = cena.fala.split(/\s+/).filter(Boolean);
  const pesos = palavras.map((w) => w.replace(/[^\p{L}\p{N}]/gu, "").length + 2 + (/[,;:]$/.test(w) ? 3 : /[.!?…]$/.test(w) ? 5 : 0));
  const soma = pesos.reduce((x, y) => x + y, 0);
  let t = ini;
  const out = palavras.map((w, i) => {
    const d = ((fim - ini) * pesos[i]) / soma;
    const p = { w: w.replace(/[<>&]/g, ""), a: t, b: t + d - (/[.!?,;:…]$/.test(w) ? d * 0.35 : 0) };
    t += d;
    return p;
  });
  // Blocos de até 3 palavras / 20 letras, quebrando na pontuação.
  const blocos = [];
  let atual = [];
  out.forEach((p, i) => {
    atual.push(i);
    const letras = atual.reduce((s, k) => s + out[k].w.length, 0);
    const prox = out[i + 1];
    if (!prox || atual.length >= 3 || letras >= 16 || /[.!?,;:…]$/.test(p.w) || (prox && letras + prox.w.length > 20)) {
      blocos.push(atual);
      atual = [];
    }
  });
  return {
    palavras: out,
    blocos: blocos.map((ks, i) => ({
      palavras: ks,
      a: Math.max(0, out[ks[0]].a - 0.06),
      b: blocos[i + 1] ? Math.max(out[ks.at(-1)].b + 0.05, out[blocos[i + 1][0]].a - 0.06) : Math.min(cena.dur, out[ks.at(-1)].b + 0.5),
    })),
  };
}

// ---------------------------------------------------------------- Efeitos sonoros (sintetizados, sem arquivos de terceiros)

function sons(dir) {
  const whoosh = path.join(dir, "whoosh.wav"), pop = path.join(dir, "pop.wav");
  if (!fs.existsSync(whoosh))
    ffmpeg(["-f", "lavfi", "-i", "anoisesrc=d=0.45:c=pink:a=0.5:r=48000", "-af", "highpass=f=400,lowpass=f=5000,afade=t=in:d=0.25:curve=exp,afade=t=out:st=0.25:d=0.2,volume=0.45", whoosh]);
  if (!fs.existsSync(pop))
    ffmpeg(["-f", "lavfi", "-i", "aevalsrc=0.6*sin(2*PI*(520+900*exp(-t*30))*t)*exp(-t*18):d=0.25:s=48000", "-af", "volume=0.6", pop]);
  return { whoosh, pop };
}

// ---------------------------------------------------------------- Projeto HyperFrames

function copiarMotor(dest) {
  const lib = path.join(dest, "lib", "addons");
  fs.mkdirSync(lib, { recursive: true });
  const three = path.join(AQUI, "node_modules", "three");
  if (!fs.existsSync(three)) throw new Error("Rode npm install em moldes/curiosidades-3d primeiro.");
  fs.copyFileSync(path.join(three, "build", "three.module.min.js"), path.join(dest, "lib", "three.module.min.js"));
  for (const f of ["geometries/TextGeometry.js", "loaders/FontLoader.js", "environments/RoomEnvironment.js"])
    fs.copyFileSync(path.join(three, "examples", "jsm", f), path.join(lib, path.basename(f)));
  fs.mkdirSync(path.join(dest, "motor"), { recursive: true });
  for (const f of fs.readdirSync(path.join(AQUI, "motor"))) fs.copyFileSync(path.join(AQUI, "motor", f), path.join(dest, "motor", f));
  return JSON.parse(fs.readFileSync(path.join(three, "examples", "fonts", "helvetiker_bold.typeface.json"), "utf8"));
}

function montar(r) {
  const fps = r.fps || 30;
  const dest = path.join(AQUI, "saida", r.id);
  const assets = path.join(dest, "assets");
  const voz = path.join(dest, "voz");
  fs.mkdirSync(assets, { recursive: true });
  fs.mkdirSync(voz, { recursive: true });

  console.log(`▸ ${r.id}: narração (${r.cenas.length} cenas)`);
  const vozId = r.voz || "pf_dora";
  let t = 0;
  const cenas = r.cenas.map((c, i) => {
    const arq = path.join(voz, `cena-${String(i + 1).padStart(2, "0")}.wav`);
    const d = c.fala ? narrar(c.fala, c.voz || vozId, c.velocidade || r.velocidade || 1.05, arq) : 0;
    const atraso = c.atraso ?? 0.12;
    const dur = Math.max(c.minimo || 1.6, atraso + d + (c.pausa ?? 0.22)) + (i === r.cenas.length - 1 ? (r.final ?? 0.8) : 0);
    const out = { ...c, inicio: t, dur, atraso, arquivo: c.fala ? arq : null };
    t += dur;
    return out;
  });
  const total = t;

  // Voz contínua: cada fala no início da sua cena.
  const narracao = path.join(dest, "voz", "narracao.wav");
  const entradas = cenas.filter((c) => c.arquivo);
  if (!entradas.length) ffmpeg(["-f", "lavfi", "-t", String(total), "-i", "anullsrc=r=48000:cl=mono", narracao]);
  else ffmpeg([
    "-f", "lavfi", "-t", String(total), "-i", "anullsrc=r=24000:cl=mono",
    ...entradas.flatMap((c) => ["-i", c.arquivo]),
    "-filter_complex",
    entradas.map((c, i) => `[${i + 1}]adelay=${Math.round((c.inicio + c.atraso) * 1000)}[v${i}]`).join(";") +
      `;[0]${entradas.map((_, i) => `[v${i}]`).join("")}amix=inputs=${entradas.length + 1}:normalize=0:duration=first[s]`,
    "-map", "[s]", "-ar", "48000", narracao,
  ]);
  const env = envelopeDe(narracao, fps, total);
  for (const c of cenas) Object.assign(c, c.fala ? cronometrarPalavras(c, env, fps) : { palavras: [], blocos: [] });

  // Mixagem final: voz + whoosh nos cortes + pop quando entra o texto + música opcional.
  const s = sons(path.join(AQUI, "saida", ".voz"));
  const ev = [];
  cenas.forEach((c, i) => {
    if (i > 0) ev.push([s.whoosh, c.inicio - 0.2]);
    if (c.texto) ev.push([s.pop, c.inicio + 0.2]);
  });
  const ins = ["-i", narracao, ...ev.flatMap(([f]) => ["-i", f])];
  const filtros = ev.map(([, at], i) => `[${i + 1}]adelay=${Math.max(0, Math.round(at * 1000))}:all=1[e${i}]`);
  let mix = `[0]${ev.map((_, i) => `[e${i}]`).join("")}`;
  let n = ev.length + 1;
  if (r.musica) {
    const m = path.join(AQUI, "musicas", r.musica);
    ins.push("-stream_loop", "-1", "-i", m);
    filtros.push(`[${n}]volume=${r.volumeMusica ?? 0.12},afade=t=out:st=${Math.max(0, total - 1.2)}:d=1.2[m]`);
    mix += "[m]";
    n++;
  }
  ffmpeg([...ins, "-filter_complex", [...filtros, `${mix}amix=inputs=${n}:normalize=0:duration=first,alimiter=limit=0.95[s]`].join(";"), "-map", "[s]", "-t", String(total), "-ar", "48000", path.join(assets, "audio.wav")]);

  const fonte = copiarMotor(dest);
  const R = {
    largura: r.largura || 1080,
    altura: r.altura || 1920,
    fps,
    duracao: Math.round(total * 1000) / 1000,
    selo: r.selo,
    narrador: r.narrador || "guia",
    fov: r.fov,
    descer: r.descer,
    estilo: r.estilo,
    exposicao: r.exposicao,
    elenco: r.elenco,
    envelope: env,
    cenas: cenas.map(({ arquivo, voz: _v, ...c }) => c),
  };
  fs.writeFileSync(path.join(dest, "index.html"), pagina(r, R, fonte));
  fs.writeFileSync(path.join(dest, "roteiro.json"), JSON.stringify(R, null, 1));
  fs.writeFileSync(path.join(dest, "hyperframes.json"), JSON.stringify({ $schema: "https://hyperframes.heygen.com/schema/hyperframes.json", paths: { blocks: "compositions", components: "compositions/components", assets: "assets" } }, null, 2));
  fs.writeFileSync(path.join(dest, "meta.json"), JSON.stringify({ id: r.id, name: r.titulo || r.id }, null, 2));
  console.log(`  ${cenas.length} cenas, ${total.toFixed(1)} s`);
  return { dest, total };
}

for (const r of escolhidos) {
  const { dest } = montar(r);
  if (flags.has("--so-projeto")) {
    console.log(`  projeto pronto: ${dest}\n  preview: npx ${HF} preview ${dest}`);
    continue;
  }
  const mp4 = path.join(AQUI, "saida", `${r.id}.mp4`);
  console.log(`  renderizando → ${mp4}`);
  execFileSync("npx", ["-y", HF, "render", dest, "-o", mp4, "--quiet", "-q", flags.has("--rascunho") ? "draft" : "looks", "--skill", "hyperframes"], { stdio: "inherit" });
  // Quadros de conferência: um no meio de cada cena.
  const quadros = path.join(AQUI, "saida", `${r.id}-quadros`);
  fs.mkdirSync(quadros, { recursive: true });
  const R = JSON.parse(fs.readFileSync(path.join(dest, "roteiro.json"), "utf8"));
  R.cenas.forEach((c, i) => ffmpeg(["-ss", String(c.inicio + c.dur * 0.6), "-i", mp4, "-frames:v", "1", "-vf", "scale=540:-1", path.join(quadros, `${String(i + 1).padStart(2, "0")}.jpg`)]));
  console.log(`  ✓ ${mp4}`);
}
