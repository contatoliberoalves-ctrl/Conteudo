// Trilha "motivacional" sintetizada (sem baixar nada): Lá menor, Am–F–C–G a 72 BPM. Pad suave com ataque lento,
// baixo, bumbo a partir do 2º ciclo e arpejo crescendo no fim (a virada). Saída: public/sfx/trilha-motivacional.wav (mono).
import fs from 'node:fs';
const SR = 44100, BPM = 72, BEAT = 60 / BPM, BAR = BEAT * 4, CHORD = BAR * 2, CICLO = CHORD * 4, DUR = CICLO * 2;
const hz = n => 440 * 2 ** ((n - 69) / 12);
const ACORDES = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]];   // Am F C G
const BAIXO = [45, 41, 36, 43];
const n = Math.floor(SR * DUR), out = new Float32Array(n);
for (let i = 0; i < n; i++) {
  const t = i / SR, ci = Math.floor(t / CHORD) % 4, tc = t % CHORD, ciclo = Math.floor(t / CICLO);
  // envelope do pad: ataque de 1,2 s, sobreposição suave no fim do acorde
  const env = Math.min(1, tc / 1.2) * Math.min(1, (CHORD - tc) / 0.6 + 0.25);
  let pad = 0;
  for (const nota of ACORDES[ci]) for (const d of [-0.12, 0, 0.12]) {
    const f = hz(nota + 12) * (1 + d / 100);
    pad += Math.sin(2 * Math.PI * f * t) * 0.6 + Math.sin(4 * Math.PI * f * t) * 0.12;
  }
  pad *= env * 0.045;
  const baixo = Math.sin(2 * Math.PI * hz(BAIXO[ci]) * t) * 0.22 * Math.min(1, tc / 0.3) * Math.exp(-((tc % BAR) / BAR) * 1.2);
  // bumbo nos tempos 1 e 3, só no 2º ciclo
  const tb = t % (BEAT * 2);
  const bumbo = ciclo >= 1 ? Math.sin(2 * Math.PI * (48 + 90 * Math.exp(-tb * 30)) * tb) * Math.exp(-tb * 9) * 0.5 : 0;
  // arpejo em colcheias, crescendo ao longo do 2º ciclo
  let arp = 0;
  if (ciclo >= 1) {
    const te = t % (BEAT / 2), passo = Math.floor(t / (BEAT / 2)) % 3;
    const nota = ACORDES[ci][passo] + 24;
    const cresc = ((t - CICLO) / CICLO);
    arp = Math.sin(2 * Math.PI * hz(nota) * te) * Math.exp(-te * 10) * 0.09 * cresc;
  }
  out[i] = pad + baixo + bumbo + arp;
}
// limitador simples + fade nas pontas para o loop
let pico = 0; for (const x of out) pico = Math.max(pico, Math.abs(x));
const ganho = 0.9 / pico;
const buf = Buffer.alloc(44 + n * 2);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 2, 4); buf.write('WAVE', 8); buf.write('fmt ', 12); buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
buf.write('data', 36); buf.writeUInt32LE(n * 2, 40);
for (let i = 0; i < n; i++) {
  const fade = Math.min(1, i / (SR * 0.05), (n - i) / (SR * 0.05));
  buf.writeInt16LE(Math.round(Math.tanh(out[i] * ganho) * 30000 * fade), 44 + i * 2);
}
import { execFileSync } from 'node:child_process';
const wav = new URL('./public/sfx/trilha-motivacional.wav', import.meta.url).pathname;
fs.writeFileSync(wav, buf);
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', wav, '-b:a', '160k', wav.replace(/\.wav$/, '.mp3')]);
fs.unlinkSync(wav);
console.log(`✓ public/sfx/trilha-motivacional.mp3 (${DUR.toFixed(1)} s)`);
