# Videoteca do Arquivo (https://claude.ai/artifact/XhMebCsd4HmZKEfbChn8kv): página para assistir e baixar os vídeos.
#   python3 scripts/videoteca.py            → saida/videoteca/ (index.html, video/<id>.mp4 comprimido, capa/<id>.jpg)
# Comprime só os vídeos que faltam (CRF 24, ~7 MB; a página aceita até 15 MB por arquivo e 256 MB no total)
# e imprime os lotes de até 60 MB para o "files" do Artifact (publique com root saida/videoteca e capabilities {downloads: true} na 1ª vez).
import json, os, subprocess, sys
from pathlib import Path

MOLDE = Path(__file__).resolve().parent.parent
VG = MOLDE / 'saida' / 'videoteca'
(VG / 'video').mkdir(parents=True, exist_ok=True)
(VG / 'capa').mkdir(parents=True, exist_ok=True)
novos = []
for d in json.loads((MOLDE / 'dados.json').read_text('utf8')):
    i, s = d['id'], MOLDE / 'saida' / d['id']
    alvo = VG / 'video' / f'{i}.mp4'
    if (s / 'video.mp4').exists() and (not alvo.exists() or alvo.stat().st_mtime < (s / 'video.mp4').stat().st_mtime):
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(s / 'video.mp4'), '-c:v', 'libx264', '-preset', 'slow', '-crf', '24', '-pix_fmt', 'yuv420p',
                        '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', str(alvo)], check=True)
        subprocess.run(['cp', str(s / 'capa.jpg'), str(VG / 'capa' / f'{i}.jpg')], check=True)
        novos += [f'video/{i}.mp4', f'capa/{i}.jpg']
dados = [d for d in json.loads((MOLDE / 'dados.json').read_text('utf8')) if (VG / 'video' / f"{d['id']}.mp4").exists()]

def dur(p):
    out = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(p)], capture_output=True, text=True).stdout
    return float(out.strip() or 0)

itens = []
for d in reversed(dados):  # mais novo primeiro
    i = d['id']
    r = json.loads((MOLDE / 'roteiros' / f'{i}.json').read_text('utf8'))
    leg = (MOLDE / 'saida' / i / 'legenda.txt')
    legenda = leg.read_text('utf8').strip() if leg.exists() else ''
    mp4 = VG / 'video' / f'{i}.mp4'
    itens.append({
        'id': i,
        'titulo': r['titulo'],
        'serie': r.get('serie', ''),
        'seg': round(dur(mp4)),
        'mb': round(mp4.stat().st_size / 1e6, 1),
        'legenda': legenda,
    })

dados_js = json.dumps(itens, ensure_ascii=False).replace('</', '<\\/')

pagina = r'''<title>Videoteca do Arquivo</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Old+Standard+TT:wght@400;700&family=IBM+Plex+Sans+Condensed:wght@500;600;700&family=IBM+Plex+Mono:wght@500&display=swap">
<style>
/* Layout: arquivo à noite. Grade de fichas 9:16, cada uma com a capa do vídeo e três ações. Visual escuro de propósito (é a identidade do perfil). */
:root{
  --fundo:#0f0e0c; --painel:#1a1814; --linha:#33302b;
  --papel:#e9dfc8; --texto:#efe6d2; --apagado:#9a917f; --lacre:#c2453a; --lacre-escuro:#9e342b;
  --titulo:"Old Standard TT","Times New Roman",serif;
  --cond:"IBM Plex Sans Condensed","Arial Narrow",system-ui,sans-serif;
  --mono:"IBM Plex Mono",ui-monospace,monospace;
  color-scheme:dark;
}
body{background:var(--fundo);color:var(--texto);font-family:var(--cond);font-size:16px;line-height:1.45}
.wrap{max-width:1240px;margin:0 auto;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:36px 72px;display:flex;flex-direction:column;gap:28px}
header{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:16px 32px;border-bottom:1px solid var(--linha);padding-bottom:22px}
.marca{font-family:var(--mono);font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:var(--apagado)}
h1{font-family:var(--titulo);font-weight:700;font-size:clamp(36px,6vw,64px);line-height:1;margin:8px 0 0;text-wrap:balance}
h1 span{color:var(--lacre)}
.resumo{font-family:var(--mono);font-size:13px;color:var(--apagado);display:flex;gap:18px;flex-wrap:wrap;font-variant-numeric:tabular-nums}
.resumo b{color:var(--texto);font-weight:500}
.aviso{font-size:14px;color:var(--apagado);max-width:70ch;margin:0}
.grade{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:22px}
.ficha{background:var(--painel);border:1px solid var(--linha);display:flex;flex-direction:column;min-width:0}
.quadro{position:relative;aspect-ratio:9/16;background:#000;overflow:hidden}
.quadro img,.quadro video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.play{position:absolute;inset:0;border:0;background:transparent;cursor:pointer;display:grid;place-items:center}
.play span{width:58px;height:58px;border-radius:50%;background:rgba(15,14,12,.72);border:1px solid rgba(233,223,200,.4);display:grid;place-items:center;transition:transform .15s}
.play span::before{content:"";border-left:16px solid var(--papel);border-top:10px solid transparent;border-bottom:10px solid transparent;margin-left:4px}
.play:hover span,.play:focus-visible span{transform:scale(1.08)}
.dur{position:absolute;right:8px;top:8px;font-family:var(--mono);font-size:12px;background:rgba(15,14,12,.8);padding:2px 7px;color:var(--papel)}
.info{padding:12px 14px 6px;display:flex;flex-direction:column;gap:4px}
.serie{font-family:var(--mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--apagado)}
.titulo{font-weight:700;font-size:18px;line-height:1.2;margin:0;text-wrap:balance}
.acoes{padding:10px 14px 14px;display:flex;flex-direction:column;gap:8px;margin-top:auto}
button{font:inherit;cursor:pointer}
.btn{border:1px solid var(--linha);background:transparent;color:var(--texto);padding:9px 12px;font-weight:600;font-size:15px;text-align:left;display:flex;justify-content:space-between;align-items:center;gap:8px}
.btn small{font-family:var(--mono);font-weight:500;font-size:11px;color:var(--apagado)}
.btn.principal{background:var(--lacre);border-color:var(--lacre);color:#fff7ea}
.btn.principal small{color:#f5d9cf}
.btn:hover{border-color:var(--papel)}
.btn.principal:hover{background:var(--lacre-escuro)}
.btn:disabled{opacity:.6;cursor:progress}
.btn:focus-visible,.play:focus-visible{outline:2px solid var(--papel);outline-offset:2px}
.linha-btn{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.status{font-family:var(--mono);font-size:12px;color:var(--apagado);min-height:1.2em}
.sem-download .so-download{display:none}
@media (prefers-reduced-motion:reduce){.play span{transition:none}}
</style>

<div class="wrap" id="app">
  <header>
    <div>
      <div class="marca">Perfil dark · Direito Constitucional</div>
      <h1>Videoteca do <span>Arquivo</span></h1>
    </div>
    <div class="resumo" id="resumo"></div>
  </header>
  <p class="aviso" id="aviso">Toque em <b>Baixar vídeo</b> para salvar o MP4 (1080×1920, pronto para Reels e TikTok). A capa sai em JPG, e a legenda vem com fontes e hashtags.</p>
  <section class="grade" id="grade" aria-label="Vídeos"></section>
</div>

<script>
const VIDEOS = __DADOS__;
const $ = (s, el = document) => el.querySelector(s);
const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

$("#resumo").innerHTML = `<span><b>${VIDEOS.length}</b> vídeos</span><span><b>${fmt(VIDEOS.reduce((a, v) => a + v.seg, 0))}</b> no total</span>`;

const grade = $("#grade");
for (const v of VIDEOS) {
  const f = document.createElement("article");
  f.className = "ficha";
  f.innerHTML = `
    <div class="quadro">
      <img src="capa/${v.id}.jpg" alt="" loading="lazy">
      <button class="play" aria-label="Assistir: ${v.titulo.replace(/"/g, "&quot;")}"><span></span></button>
      <span class="dur">${fmt(v.seg)}</span>
    </div>
    <div class="info"><span class="serie"></span><p class="titulo"></p></div>
    <div class="acoes">
      <button class="btn principal so-download" data-acao="video">Baixar vídeo <small>MP4 · ${v.mb} MB</small></button>
      <div class="linha-btn">
        <button class="btn so-download" data-acao="capa">Baixar capa</button>
        <button class="btn" data-acao="legenda">Copiar legenda</button>
      </div>
      <span class="status" role="status"></span>
    </div>`;
  $(".serie", f).textContent = v.serie;
  $(".titulo", f).textContent = v.titulo;
  $(".play", f).addEventListener("click", () => {
    const q = $(".quadro", f);
    q.innerHTML = `<video src="video/${v.id}.mp4" controls autoplay playsinline poster="capa/${v.id}.jpg"></video>`;
  });
  f.addEventListener("click", e => {
    const b = e.target.closest("[data-acao]");
    if (b) acao(b, v, $(".status", f));
  });
  grade.appendChild(f);
}

let downloads = null;
document.body.classList.add("sem-download");
(async () => {
  try { downloads = await window.claude?.use?.("downloads"); } catch { downloads = null; }
  if (downloads) document.body.classList.remove("sem-download");
  else $("#aviso").textContent = "Para baixar, abra esta página no claude.ai. Aqui dá para assistir e copiar a legenda.";
})();

async function acao(btn, v, status) {
  const tipo = btn.dataset.acao;
  if (tipo === "legenda") {
    try { await navigator.clipboard.writeText(v.legenda); status.textContent = "Legenda copiada."; }
    catch {
      const t = document.createElement("textarea");
      t.value = v.legenda; t.style.position = "fixed"; t.style.opacity = "0";
      document.body.appendChild(t); t.select();
      let ok = false; try { ok = document.execCommand("copy"); } catch {}
      t.remove();
      status.textContent = ok ? "Legenda copiada." : "Não deu para copiar aqui. Abra a página no navegador.";
    }
    return;
  }
  if (!downloads) return;
  const url = tipo === "video" ? `video/${v.id}.mp4` : `capa/${v.id}.jpg`;
  const nome = tipo === "video" ? `${v.id}.mp4` : `${v.id}-capa.jpg`;
  btn.disabled = true;
  status.textContent = "Preparando o arquivo…";
  try {
    const r = await fetch(url);
    if (!r.ok) throw { code: "fetch" };
    const blob = await r.blob();
    status.textContent = "Confirme o download na janela.";
    await downloads.save({ filename: nome, data: blob });
    status.textContent = "Download iniciado.";
  } catch (e) {
    const c = e && e.code;
    status.textContent = c === "declined" ? "Download cancelado."
      : c === "rate_limited" ? "Já tem uma janela de download aberta. Termine aquela e tente de novo."
      : c === "fetch" ? "Não consegui carregar o arquivo. Recarregue a página."
      : "Download indisponível nesta tela.";
  } finally { btn.disabled = false; }
}
</script>
'''
(VG / 'index.html').write_text(pagina.replace('__DADOS__', dados_js), 'utf8')
print('videos na pagina:', len(itens))
lotes, tam = [[]], 0
for f in novos:
    t = (VG / f).stat().st_size
    if tam + t > 60e6 and lotes[-1]: lotes.append([]); tam = 0
    lotes[-1].append(f); tam += t
for n, l in enumerate(l for l in lotes if l):
    print(f'lote {n + 1}:', json.dumps({f: f for f in l}))
