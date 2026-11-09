// Narração pelo ElevenLabs, uma cena por chamada, com alinhamento por caractere e cache.
//   node scripts/voz.mjs <id> [--custo] [--refazer]
//   node scripts/voz.mjs --vozes
// Saída (fora do git): public/voz/<id>/<n>.mp3 e <n>.json ({ texto, hash, duracao, alignment })
// A chave: segredo de rede do ambiente para api.elevenlabs.io (o proxy injeta) ou ELEVENLABS_API_KEY.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

const AQUI = path.join(path.dirname(new URL(import.meta.url).pathname), "..");
const cfg = JSON.parse(fs.readFileSync(path.join(AQUI, "config.json"), "utf8")).voz;
const CHAVE = process.env.ELEVENLABS_API_KEY || "chave-injetada-pelo-proxy";
const args = process.argv.slice(2);

function api(metodo, rota, corpo) {
  const a = ["-sS", "--fail-with-body", "-X", metodo, `https://api.elevenlabs.io${rota}`, "-H", `xi-api-key: ${CHAVE}`, "-H", "Content-Type: application/json"];
  if (corpo) a.push("--data-binary", "@-");
  const out = execFileSync("curl", a, { input: corpo ? JSON.stringify(corpo) : undefined, maxBuffer: 200 * 1024 * 1024 });
  return JSON.parse(out.toString());
}

if (args.includes("--vozes")) {
  const r = api("GET", "/v1/voices");
  for (const v of r.voices) console.log(`${v.voice_id}  ${v.name}  ${JSON.stringify(v.labels ?? {})}`);
  process.exit(0);
}

const id = args.find((a) => !a.startsWith("--"));
if (!id) { console.error("Uso: node scripts/voz.mjs <id> [--custo] [--refazer] | --vozes"); process.exit(1); }
const roteiro = JSON.parse(fs.readFileSync(path.join(AQUI, "roteiros", id + ".json"), "utf8"));
const falas = roteiro.cenas.map((c) => (c.fala ?? "").trim());
const custoPorChar = /flash|turbo/.test(cfg.modelo) ? 0.5 : 1;
const total = falas.reduce((a, f) => a + f.length, 0);
console.log(`${id}: ${total} caracteres ≈ ${Math.round(total * custoPorChar)} créditos (${cfg.modelo})`);
if (args.includes("--custo")) process.exit(0);
if (!cfg.vozId) { console.error("Defina voz.vozId em config.json (veja node scripts/voz.mjs --vozes)."); process.exit(1); }

const dir = path.join(AQUI, "public/voz", id);
fs.mkdirSync(dir, { recursive: true });
for (const [i, texto] of falas.entries()) {
  if (!texto) continue;
  const n = i + 1;
  const hash = crypto.createHash("sha1").update(JSON.stringify([texto, cfg])).digest("hex").slice(0, 12);
  const jsonP = path.join(dir, `${n}.json`);
  if (!args.includes("--refazer") && fs.existsSync(jsonP) && JSON.parse(fs.readFileSync(jsonP, "utf8")).hash === hash) { console.log(`  cena ${n}: já gravada`); continue; }
  const r = api("POST", `/v1/text-to-speech/${cfg.vozId}/with-timestamps?output_format=mp3_44100_128`, {
    text: texto,
    model_id: cfg.modelo,
    language_code: "pt",
    previous_text: falas.slice(0, i).filter(Boolean).slice(-1)[0],
    next_text: falas.slice(i + 1).filter(Boolean)[0],
    voice_settings: { stability: cfg.estabilidade, similarity_boost: cfg.similaridade, style: cfg.estilo, speed: cfg.velocidade, use_speaker_boost: true },
  });
  const mp3 = path.join(dir, `${n}.mp3`);
  fs.writeFileSync(mp3, Buffer.from(r.audio_base64, "base64"));
  const duracao = parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp3]).toString());
  fs.writeFileSync(jsonP, JSON.stringify({ texto, hash, duracao, alignment: r.alignment }, null, 0));
  console.log(`  cena ${n}: ${duracao.toFixed(1)} s`);
}
console.log(`Pronto. Gere o vídeo: node render.mjs ${id}`);
