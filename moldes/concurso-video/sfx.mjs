// Gera o kit de efeitos sonoros (WAV 16-bit, 44,1 kHz) em public/sfx/, sem baixar nada.
// whoosh (troca de cena), pop (elemento entrando), hit (gancho), tick (contagem), ding (resposta certa), erro.
import fs from 'node:fs';

const SR = 44100;
const dir = new URL('./public/sfx/', import.meta.url);
fs.mkdirSync(dir, { recursive: true });

function wav(nome, dur, fn) {
  const n = Math.floor(SR * dur);
  const buf = Buffer.alloc(44 + n * 2);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 2, 4); buf.write('WAVE', 8);
  buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
  buf.write('data', 36); buf.writeUInt32LE(n * 2, 40);
  let semente = 12345;
  const ruido = () => { semente = (semente * 1103515245 + 12345) & 0x7fffffff; return semente / 0x3fffffff - 1; };
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    let v = fn(t, ruido);
    v = Math.max(-1, Math.min(1, v));
    buf.writeInt16LE(Math.round(v * 32000), 44 + i * 2);
  }
  fs.writeFileSync(new URL(nome, dir), buf);
}

// whoosh: ruído filtrado com envelope em sino e filtro abrindo
{ let y = 0; wav('whoosh.wav', 0.42, (t, r) => {
  const env = Math.sin(Math.PI * Math.min(1, t / 0.42)) ** 2;
  const a = 0.04 + 0.5 * (t / 0.42);            // coeficiente do passa-baixa abrindo
  y += a * (r() - y);
  return y * env * 0.9;
}); }
// pop: seno com queda de afinação rápida
wav('pop.wav', 0.12, t => Math.sin(2 * Math.PI * (900 * t - 2600 * t * t)) * Math.exp(-t * 38) * 0.55);
// hit: bumbo grave + estalo
{ let y = 0; wav('hit.wav', 0.6, (t, r) => {
  const f = 45 + 120 * Math.exp(-t * 22);
  y += 0.2 * (r() - y);
  return Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 6) * 0.95 + y * Math.exp(-t * 40) * 0.5;
}); }
// tick: clique curto agudo
wav('tick.wav', 0.05, (t, r) => (Math.sin(2 * Math.PI * 2400 * t) * 0.5 + r() * 0.2) * Math.exp(-t * 120));
// ding: dois parciais de sino
wav('ding.wav', 0.9, t => (Math.sin(2 * Math.PI * 1318 * t) * 0.5 + Math.sin(2 * Math.PI * 1976 * t) * 0.25 + Math.sin(2 * Math.PI * 2637 * t) * 0.1) * Math.exp(-t * 5) * 0.6);
// erro: dois tons graves descendo
wav('erro.wav', 0.35, t => Math.sin(2 * Math.PI * (t < 0.15 ? 330 : 247) * t) * Math.exp(-((t % 0.17) * 10)) * 0.4);
console.log('✓ sfx em public/sfx/');
