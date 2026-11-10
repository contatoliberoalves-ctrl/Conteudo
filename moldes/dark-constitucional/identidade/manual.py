# Manual da identidade do perfil dark → saida/identidade/index.html (publicado como "Identidade do Arquivo").
# Rode depois de: node identidade/identidade.mjs
import json
from pathlib import Path

AQUI = Path(__file__).resolve().parent
OUT = AQUI.parent / 'saida' / 'identidade'
ID = json.loads((AQUI / 'identidade.json').read_text('utf8'))

dados = {
    'nome': ID['nome'], 'arroba': ID['arroba'],
    'bios': ID['bios'], 'destaques': ID['destaques'],
    'tiktok': ID.get('tiktok', ''),
}
js = json.dumps(dados, ensure_ascii=False).replace('</', '<\\/')

html = r'''<title>Identidade do Arquivo</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Old+Standard+TT:wght@400;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Sans+Condensed:wght@600;700&family=IBM+Plex+Mono:wght@500;600&display=swap">
<style>
/* Layout: manual em uma coluna, cada seção é uma ficha de arquivo. Visual escuro de propósito: é a identidade do perfil. */
:root{
  --fundo:#0f0e0c; --painel:#1a1814; --linha:#33302b;
  --papel:#e9dfc8; --texto:#efe6d2; --apagado:#9a917f; --lacre:#c2453a; --lacre-escuro:#9e342b;
  --titulo:"Old Standard TT","Times New Roman",serif;
  --texto-f:"IBM Plex Sans",system-ui,sans-serif;
  --cond:"IBM Plex Sans Condensed","Arial Narrow",sans-serif;
  --mono:"IBM Plex Mono",ui-monospace,monospace;
  color-scheme:dark;
}
body{background:var(--fundo);color:var(--texto);font-family:var(--texto-f);font-size:16px;line-height:1.55}
.wrap{max-width:1000px;margin:0 auto;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:40px 80px;display:flex;flex-direction:column;gap:56px}
header{display:grid;grid-template-columns:auto 1fr;gap:28px;align-items:center}
header img{width:132px;height:132px;border-radius:50%}
.rot{font-family:var(--mono);font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--apagado)}
h1{font-family:var(--titulo);font-weight:700;font-size:clamp(34px,6vw,58px);line-height:1.02;margin:6px 0 8px;text-wrap:balance}
h1 span{color:var(--lacre)}
.lead{color:var(--apagado);max-width:62ch;margin:0}
section{display:flex;flex-direction:column;gap:18px}
h2{font-family:var(--titulo);font-weight:700;font-size:30px;line-height:1.1;margin:0;display:flex;align-items:baseline;gap:14px}
h2 small{font-family:var(--mono);font-size:13px;font-weight:500;color:var(--lacre);letter-spacing:.1em}
p{margin:0;max-width:68ch}
.ficha{background:var(--painel);border:1px solid var(--linha);padding:20px;display:flex;flex-direction:column;gap:12px;min-width:0}
.grid2{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px}
.par{display:flex;justify-content:space-between;align-items:baseline;gap:12px;flex-wrap:wrap}
.valor{font-family:var(--cond);font-weight:700;font-size:26px;overflow-wrap:anywhere}
.mono{font-family:var(--mono);font-size:13px;color:var(--apagado)}
.bio{white-space:pre-line;font-size:17px;line-height:1.5}
button{font:inherit;cursor:pointer}
.btn{border:1px solid var(--linha);background:transparent;color:var(--texto);padding:8px 14px;font-weight:600;font-size:14px;font-family:var(--cond)}
.btn:hover{border-color:var(--papel)}
.btn.principal{background:var(--lacre);border-color:var(--lacre);color:#fff7ea}
.btn.principal:hover{background:var(--lacre-escuro)}
.btn:focus-visible{outline:2px solid var(--papel);outline-offset:2px}
.btns{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.status{font-family:var(--mono);font-size:12px;color:var(--apagado);min-height:1.2em}
.avatares{display:flex;gap:24px;flex-wrap:wrap;align-items:flex-end}
.avatares figure{margin:0;display:flex;flex-direction:column;gap:8px;align-items:center}
.avatares img{border-radius:50%;display:block}
.destaques{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:16px}
.dest{display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center}
.dest .circ{width:110px;height:110px;border-radius:50%;overflow:hidden;border:2px solid var(--linha)}
.dest .circ img{width:100%;height:100%;object-fit:cover;object-position:50% 50%}
.dest b{font-family:var(--cond);font-size:17px}
.dest span{font-size:13px;color:var(--apagado);line-height:1.35}
.dest button{font-size:12px;padding:5px 10px}
.grade-wrap{display:grid;grid-template-columns:minmax(0,360px) minmax(0,1fr);gap:28px;align-items:start}
.grade-wrap img{width:100%;border:1px solid var(--linha);display:block}
@media (max-width:720px){.grade-wrap{grid-template-columns:1fr}header{grid-template-columns:1fr}}
ul,ol{margin:0;padding-left:1.2em;display:flex;flex-direction:column;gap:6px}
li::marker{color:var(--lacre)}
.paleta{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}
.cor{border:1px solid var(--linha);display:flex;flex-direction:column}
.cor i{display:block;height:84px}
.cor div{padding:10px 12px;display:flex;flex-direction:column;gap:2px}
.cor b{font-family:var(--cond);font-size:17px}
.tipos{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px}
.amostra{font-size:40px;line-height:1.05}
.tarja{background:var(--lacre);color:var(--papel);padding:0 .14em}
.modelo{white-space:pre-line;font-family:var(--mono);font-size:13px;line-height:1.6;color:var(--texto);background:#13110f;border:1px solid var(--linha);padding:16px;overflow-x:auto}
.sem-download .so-download{display:none}
</style>

<div class="wrap">
  <header>
    <img src="img/avatar.png" alt="Foto de perfil: carimbo vermelho com o símbolo de parágrafo">
    <div>
      <div class="rot">Instagram e TikTok · perfil dark de Constitucional</div>
      <h1>Identidade do <span>Arquivo</span></h1>
      <p class="lead">Tudo para montar o perfil e postar os vídeos: nome, foto, bio, destaques, cores, fontes, capa e legenda. O visual é o mesmo dos vídeos: um arquivo à noite, papel envelhecido e um vermelho de lacre.</p>
    </div>
  </header>

  <section>
    <h2><small>01</small>Nome e @</h2>
    <div class="grid2">
      <div class="ficha"><span class="rot">Nome do perfil</span><div class="par"><span class="valor" id="nome"></span><button class="btn" data-copiar="nome">Copiar</button></div><span class="mono">22 caracteres (o Instagram aceita 30). É o que entra na busca.</span></div>
      <div class="ficha"><span class="rot">Usuário</span><div class="par"><span class="valor" id="arroba"></span><button class="btn" data-copiar="arroba">Copiar</button></div><span class="mono">Se estiver ocupado: @arquivo.constitucional ou @oarquivoconstitucional. Use o mesmo no TikTok.</span></div>
    </div>
    <p>Categoria do perfil: <b>Educação</b>. Perfil profissional (criador de conteúdo), para ver as métricas de cada vídeo.</p>
  </section>

  <section>
    <h2><small>02</small>Foto de perfil</h2>
    <p>Um carimbo de lacre com o nome em volta e o <b>§</b> no centro, o símbolo de parágrafo das leis. O Instagram corta em círculo, e o carimbo já está dentro do corte. No tamanho pequeno da tela, o que se lê é o § dentro do anel vermelho.</p>
    <div class="avatares">
      <figure><img src="img/avatar.png" width="180" height="180" alt="Versão escura"><span class="mono">Escura (principal)</span></figure>
      <figure><img src="img/avatar-claro.png" width="180" height="180" alt="Versão clara"><span class="mono">Clara (alternativa)</span></figure>
      <figure><img src="img/avatar.png" width="56" height="56" alt="Tamanho real no feed"><span class="mono">Tamanho real</span></figure>
    </div>
    <div class="btns so-download"><button class="btn principal" data-baixar="img/avatar.png" data-nome="arquivo-avatar.png">Baixar foto escura</button><button class="btn" data-baixar="img/avatar-claro.png" data-nome="arquivo-avatar-claro.png">Baixar foto clara</button><span class="status" role="status"></span></div>
  </section>

  <section>
    <h2><small>03</small>Bio</h2>
    <p>Três opções. Todas dizem o tema, o formato e onde começar. Recomendo a <b>Direta</b> no início, quando o perfil precisa explicar o que é.</p>
    <div class="grid2" id="bios"></div>
    <div class="ficha"><span class="rot">TikTok (até 80 caracteres)</span><div class="par"><span class="bio" id="tiktok"></span><button class="btn" data-copiar="tiktok">Copiar</button></div></div>
  </section>

  <section>
    <h2><small>04</small>Destaques</h2>
    <p>Seis destaques, um por série dos vídeos. Em cada um, guarde os stories que divulgam os vídeos daquela série. As capas são ícones em traço de papel com um detalhe vermelho.</p>
    <div class="destaques" id="destaques"></div>
  </section>

  <section>
    <h2><small>05</small>Como o perfil fica</h2>
    <div class="grade-wrap">
      <img src="img/grade.png" alt="Prévia do perfil com foto, bio, destaques e a grade dos 9 vídeos mais novos">
      <div class="ficha">
        <span class="rot">Regras da capa</span>
        <ul>
          <li>Foto de arquivo em sépia, tela cheia. Nunca imagem que finja ser registro real.</li>
          <li>Título em 3 ou 4 linhas, caixa alta condensada, com <b>uma</b> palavra-chave na tarja vermelha.</li>
          <li>O título fica no meio da tela: dentro do corte 3:4 da grade e longe da interface do Reels.</li>
          <li>Crédito da foto no rodapé, pequeno.</li>
          <li>Capa sem legenda falada. Use o <span class="mono">capa.jpg</span> da Videoteca como capa do Reel.</li>
        </ul>
        <span class="rot" style="margin-top:8px">Fixados</span>
        <p>Fixe os três vídeos com mais compartilhamentos depois da primeira semana. Para começar: <b>pena de morte</b>, <b>113 deputados faltaram</b> e <b>Vargas derrubou o STF</b>.</p>
        <div class="btns so-download"><button class="btn" data-baixar="img/grade.png" data-nome="arquivo-previa-perfil.png">Baixar prévia</button><span class="status" role="status"></span></div>
      </div>
    </div>
  </section>

  <section>
    <h2><small>06</small>Cores</h2>
    <div class="paleta">
      <div class="cor"><i style="background:#0f0e0c;border-bottom:1px solid #33302b"></i><div><b>Arquivo</b><span class="mono">#0F0E0C · fundo</span></div></div>
      <div class="cor"><i style="background:#1a1814"></i><div><b>Gaveta</b><span class="mono">#1A1814 · luz no fundo</span></div></div>
      <div class="cor"><i style="background:#e9dfc8"></i><div><b>Papel</b><span class="mono">#E9DFC8 · documentos</span></div></div>
      <div class="cor"><i style="background:#8f8676"></i><div><b>Poeira</b><span class="mono">#8F8676 · rótulos</span></div></div>
      <div class="cor"><i style="background:#c2453a"></i><div><b>Lacre</b><span class="mono">#C2453A · um destaque por tela</span></div></div>
    </div>
    <p>O vermelho é raro de propósito: uma palavra, um carimbo ou uma linha por tela. É ele que leva o olho ao ponto da história.</p>
  </section>

  <section>
    <h2><small>07</small>Fontes</h2>
    <div class="tipos">
      <div class="ficha"><span class="rot">Capa e legenda</span><div class="amostra" style="font-family:var(--cond);font-weight:700;text-transform:uppercase">O Brasil <span class="tarja">votou</span></div><span class="mono">IBM Plex Sans Condensed, 700</span></div>
      <div class="ficha"><span class="rot">Títulos dentro do vídeo</span><div class="amostra" style="font-family:var(--titulo);font-weight:700">Faltaram 22.</div><span class="mono">Old Standard TT, 700</span></div>
      <div class="ficha"><span class="rot">Datas, artigos, rótulos</span><div class="amostra" style="font-family:var(--mono);font-size:26px;letter-spacing:.08em">CF/88 · ART. 5º</div><span class="mono">IBM Plex Mono, 600</span></div>
    </div>
    <p>As três são gratuitas, do Google Fonts.</p>
  </section>

  <section>
    <h2><small>08</small>Voz e legenda</h2>
    <div class="grid2">
      <div class="ficha">
        <span class="rot">Como o perfil fala</span>
        <ul>
          <li>Narrador de documentário, sem rosto: a voz é sempre a do Victor.</li>
          <li>Gancho com tema, Brasil e uma pegadinha verdadeira.</li>
          <li>Opina sobre a regra, nunca sobre pessoas ou partidos.</li>
          <li>Todo vídeo termina numa pergunta que se responde em uma palavra.</li>
          <li>Fonte em todo post.</li>
        </ul>
      </div>
      <div class="ficha">
        <span class="rot">Legenda padrão</span>
        <div class="modelo">Gancho reescrito em uma linha.

2 a 4 linhas com o que não coube no vídeo: datas, artigo, decisão.

Pergunta do fim do vídeo?

Fontes: artigo · decisão · órgão

#direitoconstitucional #historiadobrasil + 3 do tema</div>
        <span class="mono">Cada vídeo da Videoteca já tem a legenda pronta (botão "Copiar legenda").</span>
      </div>
    </div>
  </section>
</div>

<script>
const ID = __DADOS__;
const $ = (s, el = document) => el.querySelector(s);
$("#nome").textContent = ID.nome;
$("#arroba").textContent = ID.arroba;
$("#tiktok").textContent = ID.tiktok;
const textos = { nome: ID.nome, arroba: ID.arroba, tiktok: ID.tiktok };

$("#bios").innerHTML = ID.bios.map((b, i) => `<div class="ficha"><div class="par"><span class="rot">${b.nome}</span><span class="mono">${[...b.texto].length} de 150</span></div><div class="bio"></div><div class="btns"><button class="btn" data-copiar="bio${i}">Copiar bio</button><span class="status" role="status"></span></div></div>`).join("");
ID.bios.forEach((b, i) => { textos["bio" + i] = b.texto; $("#bios").children[i].querySelector(".bio").textContent = b.texto; });

const usos = { comece: "Apresentação do perfil e os 3 vídeos fixados", imperio: "Dom Pedro, Poder Moderador, monarquia", golpes: "Deodoro, Vargas, AI-5, senador biônico", urna: "Diretas Já, plebiscitos, voto do analfabeto", stf: "Decisões do Supremo que viraram notícia", casos: "Casos reais: prisões, dados, esquecimento" };
$("#destaques").innerHTML = ID.destaques.map((d, i) => {
  const arq = `img/destaques/${String(i + 1).padStart(2, "0")}-${d.icone}.png`;
  return `<div class="dest"><div class="circ"><img src="${arq}" alt=""></div><b>${d.rotulo}</b><span>${usos[d.icone] || ""}</span><button class="btn so-download" data-baixar="${arq}" data-nome="destaque-${String(i + 1).padStart(2, "0")}-${d.icone}.png">Baixar</button></div>`;
}).join("");

let downloads = null;
document.body.classList.add("sem-download");
(async () => {
  try { downloads = await window.claude?.use?.("downloads"); } catch { downloads = null; }
  if (downloads) document.body.classList.remove("sem-download");
})();

function avisa(btn, msg) {
  const s = btn.parentElement.querySelector(".status");
  if (s) s.textContent = msg; else btn.textContent = msg;
}
document.addEventListener("click", async (e) => {
  const c = e.target.closest("[data-copiar]");
  if (c) {
    const t = textos[c.dataset.copiar] || "";
    try { await navigator.clipboard.writeText(t); avisa(c, "Copiado."); }
    catch {
      const a = document.createElement("textarea"); a.value = t; a.style.position = "fixed"; a.style.opacity = "0";
      document.body.appendChild(a); a.select(); let ok = false; try { ok = document.execCommand("copy"); } catch {} a.remove();
      avisa(c, ok ? "Copiado." : "Não deu para copiar aqui.");
    }
    return;
  }
  const b = e.target.closest("[data-baixar]");
  if (b && downloads) {
    b.disabled = true;
    try {
      const r = await fetch(b.dataset.baixar); if (!r.ok) throw { code: "fetch" };
      await downloads.save({ filename: b.dataset.nome, data: await r.blob() });
      avisa(b, "Download iniciado.");
    } catch (err) {
      const k = err && err.code;
      avisa(b, k === "declined" ? "Download cancelado." : k === "rate_limited" ? "Termine o download aberto e tente de novo." : "Download indisponível aqui.");
    } finally { b.disabled = false; }
  }
});
</script>
'''
(OUT / 'index.html').write_text(html.replace('__DADOS__', js), 'utf8')
print('ok', OUT / 'index.html')
