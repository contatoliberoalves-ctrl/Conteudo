<title>Vídeos Claude</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;800&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap">
<style>
/* Layout: uma "mesa de edição": cabeçalho com totais e filtros por coleção; cada coleção é uma fileira de rolos (fichas 9:16 ou 16:9) com a cor da marca dela numa tarja fina. */
:root {
  --fundo: #F3F2EF; --painel: #FFFFFF; --linha: #DEDBD4; --texto: #1C1B19; --apagado: #6B675F;
  --verde: #0BA457; --lacre: #B8392F; --amarelo: #C9A800; --azul: #2457C5; --roxo: #7A3FC2; --foco: #1C1B19;
  --display: 'Archivo', 'Arial Narrow', system-ui, sans-serif; --corpo: 'Inter', system-ui, sans-serif; --mono: 'IBM Plex Mono', ui-monospace, monospace;
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --fundo: #121210; --painel: #1C1B18; --linha: #2F2D29; --texto: #F1EEE7; --apagado: #A29D92; --verde: #2FC373; --lacre: #E0574B; --amarelo: #F2D43A; --azul: #6E9BFF; --roxo: #B58CFF; --foco: #F1EEE7; color-scheme: dark } }
:root[data-theme="dark"] { --fundo: #121210; --painel: #1C1B18; --linha: #2F2D29; --texto: #F1EEE7; --apagado: #A29D92; --verde: #2FC373; --lacre: #E0574B; --amarelo: #F2D43A; --azul: #6E9BFF; --roxo: #B58CFF; --foco: #F1EEE7; color-scheme: dark }
body { background: var(--fundo); color: var(--texto); font-family: var(--corpo); font-size: 15px; line-height: 1.45 }
.wrap { max-width: 1280px; margin: 0 auto; padding-block: 32px 72px; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); display: flex; flex-direction: column; gap: 36px }
header { display: flex; flex-direction: column; gap: 18px; border-bottom: 1px solid var(--linha); padding-bottom: 22px }
h1 { font-family: var(--display); font-weight: 800; font-size: clamp(40px, 7vw, 76px); line-height: .95; letter-spacing: -.02em; margin: 0 }
.totais { font-family: var(--mono); font-size: 13px; color: var(--apagado); display: flex; gap: 18px; flex-wrap: wrap; font-variant-numeric: tabular-nums }
.totais b { color: var(--texto); font-weight: 500 }
.filtros { display: flex; gap: 8px; flex-wrap: wrap }
.filtros button { font: 600 14px var(--corpo); border: 1px solid var(--linha); background: var(--painel); color: var(--texto); padding: 8px 14px; border-radius: 999px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px }
.filtros button[aria-pressed="true"] { background: var(--texto); color: var(--fundo); border-color: var(--texto) }
.filtros i { width: 10px; height: 10px; border-radius: 50%; display: inline-block }
.aviso { margin: 0; color: var(--apagado); font-size: 14px; max-width: 70ch }
section.colecao { display: flex; flex-direction: column; gap: 16px }
.cab { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 6px 20px; border-left: 6px solid var(--cor); padding-left: 14px }
.cab h2 { font-family: var(--display); font-weight: 800; font-size: 30px; line-height: 1; margin: 0 }
.cab p { margin: 0; font-family: var(--mono); font-size: 12px; color: var(--apagado); letter-spacing: .04em }
.grade { display: grid; gap: 18px; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)) }
.grade.h { grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr)) }
.ficha { background: var(--painel); border: 1px solid var(--linha); border-top: 4px solid var(--cor); display: flex; flex-direction: column; min-width: 0 }
.quadro { position: relative; aspect-ratio: 9/16; background: #000; overflow: hidden }
.h .quadro { aspect-ratio: 16/9 }
.quadro img, .quadro video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block }
.quadro[data-cheio] img, .quadro[data-cheio] video { object-fit: contain }
.play { position: absolute; inset: 0; border: 0; background: transparent; cursor: pointer; display: grid; place-items: center }
.play span { width: 56px; height: 56px; border-radius: 50%; background: rgba(0,0,0,.6); border: 1px solid rgba(255,255,255,.45); display: grid; place-items: center; transition: transform .15s }
.play span::before { content: ""; border-left: 16px solid #fff; border-top: 10px solid transparent; border-bottom: 10px solid transparent; margin-left: 4px }
.play:hover span, .play:focus-visible span { transform: scale(1.08) }
.dur { position: absolute; right: 8px; top: 8px; font-family: var(--mono); font-size: 12px; background: rgba(0,0,0,.72); color: #fff; padding: 2px 7px }
.info { padding: 12px 14px 4px; display: flex; flex-direction: column; gap: 4px }
.serie { font-family: var(--mono); font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: var(--apagado) }
.titulo { font-weight: 700; font-size: 16px; line-height: 1.25; margin: 0; text-wrap: balance }
.acoes { padding: 10px 14px 14px; display: flex; flex-direction: column; gap: 8px; margin-top: auto }
.btn { font: 600 14px var(--corpo); cursor: pointer; border: 1px solid var(--linha); background: transparent; color: var(--texto); padding: 9px 12px; display: flex; justify-content: space-between; align-items: center; gap: 8px }
.btn small { font-family: var(--mono); font-weight: 500; font-size: 11px; color: var(--apagado) }
.btn.principal { background: var(--texto); color: var(--fundo); border-color: var(--texto) }
.btn.principal small { color: var(--fundo); opacity: .75 }
.btn:disabled { opacity: .55; cursor: progress }
.btn:focus-visible, .play:focus-visible, .filtros button:focus-visible { outline: 3px solid var(--cor, var(--foco)); outline-offset: 2px }
.status { font-family: var(--mono); font-size: 12px; color: var(--apagado); min-height: 1.2em }
.sem-download .so-download { display: none }
@media (prefers-reduced-motion: reduce) { .play span { transition: none } }
</style>
<div class="wrap">
  <header>
    <h1>Vídeos Claude</h1>
    <div class="totais" id="totais"></div>
    <div class="filtros" id="filtros" role="group" aria-label="Filtrar por coleção"></div>
    <p class="aviso" id="aviso">Toque no vídeo para assistir. <b>Baixar vídeo</b> salva o MP4; <b>Copiar legenda</b> copia o texto do post com as fontes.</p>
  </header>
  <div id="colecoes"></div>
</div>
<script>
const DADOS = __DADOS__;
const ASSETS = __ASSETS__;   // vídeos guardados no armazenamento da página (id do vídeo -> url)
const $ = (s, el = document) => el.querySelector(s);
const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
const COR = { verde: 'var(--verde)', lacre: 'var(--lacre)', amarelo: 'var(--amarelo)', azul: 'var(--azul)', roxo: 'var(--roxo)' };
const urlVideo = v => v.video || ASSETS[v.id] || null;

const todos = DADOS.colecoes.flatMap(c => c.itens);
$('#totais').innerHTML = `<span><b>${todos.length}</b> vídeos</span><span><b>${DADOS.colecoes.length}</b> coleções</span><span><b>${fmt(todos.reduce((a, v) => a + v.seg, 0))}</b> no total</span>`;

const filtros = $('#filtros');
const opcoes = [{ id: 'todos', nome: 'Todos' }, ...DADOS.colecoes];
let atual = 'todos';
try { const h = location.hash.slice(1); if (opcoes.some(o => o.id === h)) atual = h; } catch {}
for (const o of opcoes) {
  const b = document.createElement('button');
  b.type = 'button'; b.dataset.id = o.id;
  b.innerHTML = (o.cor ? `<i style="background:${COR[o.cor]}"></i>` : '') + `<span></span>`;
  $('span', b).textContent = o.nome + (o.itens ? ` · ${o.itens.length}` : '');
  b.addEventListener('click', () => { atual = o.id; aplicar(); try { history.replaceState(null, '', o.id === 'todos' ? location.pathname : '#' + o.id); } catch {} });
  filtros.appendChild(b);
}
function aplicar() {
  filtros.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.id === atual)));
  document.querySelectorAll('section.colecao').forEach(s => s.hidden = atual !== 'todos' && s.dataset.id !== atual);
}

const area = $('#colecoes');
area.style.cssText = 'display:flex;flex-direction:column;gap:44px';
for (const c of DADOS.colecoes) {
  const s = document.createElement('section');
  s.className = 'colecao'; s.dataset.id = c.id; s.style.setProperty('--cor', COR[c.cor]);
  s.innerHTML = `<div class="cab"><h2></h2><p></p></div><div class="grade${c.vertical ? '' : ' h'}"></div>`;
  $('h2', s).textContent = c.nome;
  $('p', s).textContent = `${c.perfil} · ${c.formato}`;
  const grade = $('.grade', s);
  for (const v of c.itens) grade.appendChild(ficha(v));
  area.appendChild(s);
}
aplicar();

function ficha(v) {
  const f = document.createElement('article');
  f.className = 'ficha';
  f.innerHTML = `
    <div class="quadro"${v.aspecto && v.aspecto !== '540/960' ? ' data-cheio' : ''}>
      ${v.capa ? `<img src="${v.capa}" alt="" loading="lazy">` : `<video preload="metadata" muted playsinline></video>`}
      <button class="play" type="button"><span></span></button>
      <span class="dur">${fmt(v.seg)}</span>
    </div>
    <div class="info"><span class="serie"></span><p class="titulo"></p></div>
    <div class="acoes">
      <button class="btn principal so-download" type="button" data-acao="video">Baixar vídeo <small>MP4${v.mb ? ' · ' + String(v.mb).replace('.', ',') + ' MB' : ''}</small></button>
      ${v.legenda ? `<button class="btn" type="button" data-acao="legenda">Copiar legenda</button>` : ''}
      <span class="status" role="status"></span>
    </div>`;
  $('.serie', f).textContent = v.serie;
  $('.titulo', f).textContent = v.titulo;
  $('.play', f).setAttribute('aria-label', 'Assistir: ' + v.titulo);
  const url = urlVideo(v);
  const prev = $('.quadro video', f);
  if (prev && url) prev.src = url + '#t=1.5';
  $('.play', f).addEventListener('click', () => {
    const u = urlVideo(v);
    if (!u) { $('.status', f).textContent = 'Este vídeo ainda está sendo enviado.'; return; }
    $('.quadro', f).innerHTML = `<video src="${u}" controls autoplay playsinline ${v.capa ? `poster="${v.capa}"` : ''}></video>`;
  });
  f.addEventListener('click', e => { const b = e.target.closest('[data-acao]'); if (b) acao(b, v, $('.status', f)); });
  return f;
}

let downloads = null;
document.body.classList.add('sem-download');
(async () => {
  try { downloads = await window.claude?.use?.('downloads'); } catch { downloads = null; }
  if (downloads) document.body.classList.remove('sem-download');
  else $('#aviso').textContent = 'Para baixar, abra esta página no claude.ai. Aqui dá para assistir e copiar a legenda.';
})();

async function acao(btn, v, status) {
  if (btn.dataset.acao === 'legenda') {
    try { await navigator.clipboard.writeText(v.legenda); status.textContent = 'Legenda copiada.'; }
    catch {
      const t = document.createElement('textarea'); t.value = v.legenda; t.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(t); t.select(); let ok = false; try { ok = document.execCommand('copy'); } catch {} t.remove();
      status.textContent = ok ? 'Legenda copiada.' : 'Não deu para copiar aqui. Abra a página no navegador.';
    }
    return;
  }
  if (!downloads) return;
  const u = urlVideo(v);
  if (!u) { status.textContent = 'Este vídeo ainda está sendo enviado.'; return; }
  btn.disabled = true; status.textContent = 'Preparando o arquivo…';
  try {
    const r = await fetch(u); if (!r.ok) throw { code: 'fetch' };
    const blob = await r.blob();
    status.textContent = 'Confirme o download na janela.';
    await downloads.save({ filename: v.arquivo, data: blob });
    status.textContent = 'Download iniciado.';
  } catch (e) {
    const c = e && e.code;
    status.textContent = c === 'declined' ? 'Download cancelado.' : c === 'rate_limited' ? 'Já tem uma janela de download aberta. Termine aquela e tente de novo.'
      : c === 'fetch' ? 'Não consegui carregar o arquivo. Recarregue a página.' : 'Download indisponível nesta tela.';
  } finally { btn.disabled = false; }
}
</script>
