// Gera o kit de sons do molde (WAV 16 bits, 48 kHz, mono) sem baixar nada.
// Uso: node scripts/sons.mjs  → public/sfx/*.wav
import fs from "node:fs";
import path from "node:path";

const SR = 48000;
const OUT = path.join(path.dirname(new URL(import.meta.url).pathname), "..", "public", "sfx");
fs.mkdirSync(OUT, { recursive: true });

// Ruído determinístico (mesmo arquivo a cada execução)
let seed = 12345;
const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff) * 2 - 1;

function salvar(nome, amostras) {
  let pico = 0;
  for (const s of amostras) pico = Math.max(pico, Math.abs(s));
  const ganho = pico > 0 ? 0.89 / pico : 1;
  const buf = Buffer.alloc(44 + amostras.length * 2);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + amostras.length * 2, 4); buf.write("WAVE", 8);
  buf.write("fmt ", 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
  buf.write("data", 36); buf.writeUInt32LE(amostras.length * 2, 40);
  amostras.forEach((s, i) => buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, s * ganho)) * 32767), 44 + i * 2));
  fs.writeFileSync(path.join(OUT, nome), buf);
  console.log("sfx/" + nome, (amostras.length / SR).toFixed(2) + "s");
}

const vazio = (seg) => new Float32Array(Math.round(seg * SR));
// filtro passa-baixa de um polo
function lp(x, corte) { const a = Math.exp(-2 * Math.PI * corte / SR); let y = 0; return x.map((v) => (y = (1 - a) * v + a * y)); }

// Grave: impacto de baixo, para revelações (placar, número)
{
  const x = vazio(1.6); let fase = 0;
  for (let i = 0; i < x.length; i++) {
    const t = i / SR, f = 38 + 62 * Math.exp(-t * 9);
    fase += 2 * Math.PI * f / SR;
    x[i] = Math.sin(fase) * Math.exp(-t * 2.6) + 0.25 * Math.sin(fase * 2) * Math.exp(-t * 6);
  }
  const ru = lp(vazio(1.6).map((_, i) => rnd() * Math.exp(-i / SR * 30)), 900);
  salvar("grave.wav", x.map((v, i) => v + ru[i] * 0.5));
}
// Carimbo: batida seca de madeira e papel
{
  const x = vazio(0.5);
  const ru = lp(x.map((_, i) => rnd() * Math.exp(-i / SR * 55)), 2500);
  let fase = 0;
  for (let i = 0; i < x.length; i++) {
    const t = i / SR; fase += 2 * Math.PI * (95 + 80 * Math.exp(-t * 40)) / SR;
    x[i] = ru[i] * 1.2 + Math.sin(fase) * Math.exp(-t * 18) * 0.9;
  }
  salvar("carimbo.wav", x);
}
// Whoosh: passagem de cena
{
  const n = vazio(0.55); let y = 0;
  for (let i = 0; i < n.length; i++) {
    const t = i / n.length, env = Math.sin(Math.PI * t) ** 2;
    const corte = 300 + 4200 * Math.sin(Math.PI * t);
    const a = Math.exp(-2 * Math.PI * corte / SR);
    y = (1 - a) * rnd() + a * y; n[i] = y * env;
  }
  salvar("whoosh.wav", n);
}
// Tique: relógio / contador
{
  const x = vazio(0.08);
  for (let i = 0; i < x.length; i++) { const t = i / SR; x[i] = (rnd() * 0.6 + Math.sin(2 * Math.PI * 2400 * t)) * Math.exp(-t * 160); }
  salvar("tique.wav", x);
}
// Máquina de escrever: uma tecla
{
  const x = vazio(0.12);
  const ru = lp(x.map((_, i) => rnd() * Math.exp(-i / SR * 90)), 5200);
  for (let i = 0; i < x.length; i++) { const t = i / SR; x[i] = ru[i] + Math.sin(2 * Math.PI * 1700 * t) * Math.exp(-t * 120) * 0.4; }
  salvar("tecla.wav", x);
}
// Subida: tensão antes da virada
{
  const x = vazio(1.4); let y = 0, fase = 0;
  for (let i = 0; i < x.length; i++) {
    const t = i / x.length, corte = 200 + 5000 * t * t, a = Math.exp(-2 * Math.PI * corte / SR);
    y = (1 - a) * rnd() + a * y; fase += 2 * Math.PI * (80 + 300 * t * t) / SR;
    x[i] = (y * 0.8 + Math.sin(fase) * 0.35) * t * t;
  }
  salvar("subida.wav", x);
}
// Trilha: pad grave e escuro, 64 s, fecha em loop
{
  const seg = 64, x = vazio(seg);
  const notas = [55, 82.41, 110, 130.81]; // Lá, Mi, Lá, Dó (Lá menor)
  const fases = notas.map(() => [0, 0]);
  const ru = lp(lp(x.map(() => rnd()), 400), 400);
  for (let i = 0; i < x.length; i++) {
    const t = i / SR; let v = 0;
    notas.forEach((f, k) => {
      const lfo = 0.6 + 0.4 * Math.sin(2 * Math.PI * t / (16 + k * 4) + k);
      fases[k][0] += 2 * Math.PI * f / SR; fases[k][1] += 2 * Math.PI * f * 1.004 / SR;
      v += (Math.sin(fases[k][0]) + Math.sin(fases[k][1])) * lfo * (k === 0 ? 0.9 : 0.35);
    });
    const borda = Math.min(1, t / 2, (seg - t) / 2);
    x[i] = (v + ru[i] * 6) * borda;
  }
  salvar("trilha.wav", x);
}
