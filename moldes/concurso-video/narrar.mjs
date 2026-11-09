// Gera a narração de um roteiro com a ElevenLabs (com marcação de tempo de cada caractere) e monta o índice
// usado pelo Remotion. Uso: node narrar.mjs <id> [--forcar]
// Saída: public/audio/<id>.mp3 e public/audio/<id>.json ({ duracao, palavras: [{w, ini, fim}], cenas: [{ini, fim, p0, p1}] }).
// Só chama a API quando o texto, a voz ou os ajustes mudam (o hash fica no .json), para não gastar créditos à toa.
import fs from 'node:fs';
import crypto from 'node:crypto';

const RAIZ = new URL('./', import.meta.url);
const [id, ...flags] = process.argv.slice(2);
if (!id) { console.error('uso: node narrar.mjs <id> [--forcar]'); process.exit(1); }
const roteiro = JSON.parse(fs.readFileSync(new URL(`roteiros/${id}.json`, RAIZ)));

// Vozes em PT-BR da conta (troque pelo id da voz clonada do Líbero quando houver).
// Da biblioteca pública (funcionam pelo id, sem adicionar à conta): fernando (urgente, informativo: notícia de edital),
// diego (locutor de anúncio), paulo (expressivo, educativo), carla (voz feminina clara e firme).
const VOZES = { adriano: 'hwnuNyWkl9DjdTFykrN6', marcelo: 'bJrNspxJVFovUxNBQ0wh', lucas: 'GIuLCSVfgJaUuh7hYOY8', victor: 'YNOujSUmHtgN6anjqXPf',
  fernando: '6pQlwCgfwffNdI3jjzM6', diego: 'rpNe0HOx7heUulPiOEaG', paulo: 'Qrdut83w0Cr152Yb4Xn3', carla: '7eUAxNOneHxqfyRS77mW' };
const voz = VOZES[roteiro.voz || 'adriano'] || roteiro.voz;
const ajustes = { stability: 0.38, similarity_boost: 0.8, style: 0.35, use_speaker_boost: true, speed: 1.12, ...(roteiro.ajustesVoz || {}) };
const modelo = roteiro.modelo || 'eleven_multilingual_v2';

// Texto falado = falas das cenas, na ordem, separadas por espaço. `pronuncia` troca grafias na fala só para a voz
// (ex.: "STF" → "STF" mesmo; "R$" etc. já devem vir por extenso na fala).
const falas = roteiro.cenas.map(c => (c.fala || '').trim());
const texto = falas.join(' ');
const hash = crypto.createHash('sha1').update(JSON.stringify({ texto, voz, ajustes, modelo })).digest('hex');
const jsonPath = new URL(`public/audio/${id}.json`, RAIZ), mp3Path = new URL(`public/audio/${id}.mp3`, RAIZ);
fs.mkdirSync(new URL('public/audio/', RAIZ), { recursive: true });

let alinhamento;
const antigo = fs.existsSync(jsonPath) ? JSON.parse(fs.readFileSync(jsonPath)) : null;
if (antigo?.hash === hash && antigo.alinhamento && fs.existsSync(mp3Path) && !flags.includes('--forcar')) {
  alinhamento = antigo.alinhamento;
  console.log('narração sem mudança (cache)');
} else {
  console.log(`narrando ${texto.length} caracteres…`);
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voz}/with-timestamps?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY || 'proxy', 'content-type': 'application/json' },
    body: JSON.stringify({ text: texto, model_id: modelo, language_code: modelo.includes('multilingual_v2') ? undefined : 'pt', voice_settings: ajustes }),
  });
  if (!r.ok) { console.error('ElevenLabs', r.status, await r.text()); process.exit(1); }
  const d = await r.json();
  fs.writeFileSync(mp3Path, Buffer.from(d.audio_base64, 'base64'));
  alinhamento = d.alignment;
}

// Palavras com tempo (início do 1º caractere, fim do último) e a cena de cada uma.
const { characters: ch, character_start_times_seconds: ini, character_end_times_seconds: fim } = alinhamento;
const palavras = [];
const limites = []; let pos = 0;
falas.forEach(f => { limites.push(pos); pos += f.length + 1; });
let i = 0;
while (i < ch.length) {
  if (/\s/.test(ch[i])) { i++; continue; }
  let j = i; while (j < ch.length && !/\s/.test(ch[j])) j++;
  let cena = 0; for (let k = 0; k < limites.length; k++) if (i >= limites[k]) cena = k;
  palavras.push({ w: ch.slice(i, j).join(''), ini: +ini[i].toFixed(3), fim: +fim[j - 1].toFixed(3), cena });
  i = j;
}
const duracao = +fim[fim.length - 1].toFixed(3);
const cenas = roteiro.cenas.map((_, k) => {
  const ps = palavras.map((p, n) => ({ ...p, n })).filter(p => p.cena === k);
  return { p0: ps[0]?.n ?? 0, p1: (ps.at(-1)?.n ?? -1) + 1, ini: ps[0]?.ini ?? 0, fimFala: ps.at(-1)?.fim ?? 0 };
});
fs.writeFileSync(jsonPath, JSON.stringify({ hash, duracao, palavras, cenas, alinhamento }));
console.log(`✓ public/audio/${id}.mp3 (${duracao.toFixed(1)} s, ${palavras.length} palavras)`);

await import('./indice.mjs');
