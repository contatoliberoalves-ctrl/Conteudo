// Junta roteiros/*.json com a marcação de tempo de public/audio/<id>.json em src/videos.gerado.json,
// que o Remotion lê para registrar uma composição por vídeo. Roda sozinho no fim do narrar.mjs.
import fs from 'node:fs';

const RAIZ = new URL('./', import.meta.url);
const videos = [];
for (const f of fs.readdirSync(new URL('roteiros/', RAIZ)).filter(f => f.endsWith('.json')).sort()) {
  const r = JSON.parse(fs.readFileSync(new URL(`roteiros/${f}`, RAIZ)));
  const a = new URL(`public/audio/${r.id}.json`, RAIZ);
  if (!fs.existsSync(a)) continue;
  const { duracao, palavras, cenas } = JSON.parse(fs.readFileSync(a));
  videos.push({ ...r, tempo: { duracao, palavras, cenas } });
}
fs.writeFileSync(new URL('src/videos.gerado.json', RAIZ), JSON.stringify(videos));
console.log(`✓ src/videos.gerado.json (${videos.map(v => v.id).join(', ') || 'nenhum vídeo narrado'})`);
