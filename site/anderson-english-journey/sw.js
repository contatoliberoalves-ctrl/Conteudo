// English Journey: guarda a página e as imagens para abrir sem internet.
// Ao publicar uma versão nova, troque o número de VERSAO para os aparelhos buscarem os arquivos novos.
const VERSAO = 'ej-1';
const ARQUIVOS = ['./', 'index.html', 'manifest.webmanifest', 'icone-192.png', 'icone-512.png', 'anderson.webp',
  'img/rota.webp', 'img/rio.webp', 'img/nyc.webp', 'img/sf.webp', 'img/boston.webp', 'img/mapa-nyc.webp', 'img/mapa-sf.webp', 'img/mapa-boston.webp'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSAO).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSAO).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const url = new URL(r.url); const fonte = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (url.origin !== location.origin && !fonte) return;
  // página: tenta a rede primeiro (para pegar atualizações) e cai no que está guardado; o resto: guardado primeiro
  if (r.mode === 'navigate') { e.respondWith(fetch(r).then(resp => { const c = resp.clone(); caches.open(VERSAO).then(k => k.put('index.html', c)); return resp; }).catch(() => caches.match('index.html'))); return; }
  e.respondWith(caches.match(r).then(g => g || fetch(r).then(resp => { if (resp.ok || resp.type === 'opaque') { const c = resp.clone(); caches.open(VERSAO).then(k => k.put(r, c)); } return resp; })));
});
