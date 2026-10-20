// Dicas de revisão (Libero PDF, `tipo: "dicas"`): caderno de dicas por disciplina, como o "Dicas de revisão ENAM".
// Capa azul com anel, mapa das dicas (sumário com páginas e links), faixa azul abrindo cada disciplina, um cartão
// por dica (número vazado, tema, dica, explicação, fonte e questões em que caiu) e CTA no fim. A paginação é feita
// no navegador, como no template das teses: o cartão que não cabe vai inteiro para a página seguinte.
import { COR, FONTES, TITULO, TEXTO, PERFIL, esc, rico, linhas, textura, anel } from '../libero-comum/identidade.mjs';

const W = 794, H = 1122, M = 58;
const dois = n => String(n).padStart(2, '0');
const chip = (txt, bg, cor) => `<span style="display:inline-block;background:${bg};color:${cor};${TEXTO};font-size:10.5px;font-weight:700;line-height:1.35;padding:3px 9px;border-radius:5px">${esc(txt)}</span>`;
const gradAzul = `linear-gradient(170deg,${COR.azul} 0%,${COR.azulFundo} 100%)`;

function capa(p) {
  const c = p.capa, total = p.disciplinas.reduce((t, d) => t + d.dicas.length, 0);
  const edicoes = new Set(p.disciplinas.flatMap(d => d.dicas.flatMap(x => x.enam.match(/20\d\d\.\d/g) || []))).size;
  const num = (n, rot) => `<div style="flex:1;border-top:3px solid rgba(255,255,255,.35);padding-top:14px">
      <div style="${TITULO};font-size:64px;line-height:.9;color:#fff">${n}</div>
      <div style="${TEXTO};font-size:13px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${COR.off};margin-top:6px">${rot}</div></div>`;
  return `<section class="pagina" style="background:${gradAzul}">
    ${anel(480, -180, 460, 52)}
    <div style="position:absolute;left:${M}px;top:70px;${TEXTO};font-size:15px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:#fff;background:${COR.navyFundo};padding:9px 16px;border-radius:6px;z-index:3">${esc(c.rotulo)}</div>
    <div style="position:absolute;left:${M}px;right:${M}px;top:270px;z-index:3">
      <div style="${TITULO};font-size:${c.ts || 150}px;line-height:.98;color:#fff">${linhas(c.titulo, COR.navyFundo)}</div>
      <p style="${TEXTO};font-size:24px;font-weight:700;line-height:1.35;color:#fff;margin-top:30px;max-width:560px">${esc(c.sub)}</p>
    </div>
    <div style="position:absolute;left:${M}px;right:${M}px;bottom:170px;display:flex;gap:28px;z-index:3">
      ${num(total, 'dicas')}${num(p.disciplinas.length, 'disciplinas')}${num(edicoes, 'edições do ENAM')}
    </div>
    <div style="position:absolute;left:${M}px;right:${M}px;bottom:56px;display:flex;justify-content:space-between;align-items:flex-end;z-index:3">
      <span style="${TITULO};font-size:46px;line-height:1;color:#fff;text-transform:none">${esc(c.autor)}</span>
      <span style="${TEXTO};font-size:15px;font-weight:700;letter-spacing:.08em;color:${COR.off}">${PERFIL}</span>
    </div>
    ${textura(true)}
  </section>`;
}

// Mapa das dicas: uma coluna por disciplina, com o tema de cada dica e a página (preenchida após a paginação).
function mapa(p) {
  const col = (d, i) => `<div>
    <a href="#d-${d.id}" style="text-decoration:none;display:flex;align-items:baseline;gap:10px;border-bottom:3px solid ${COR.azul};padding-bottom:8px;margin-bottom:6px">
      <span style="${TITULO};font-size:30px;color:transparent;-webkit-text-stroke:1.4px ${COR.azul}">${dois(i + 1)}</span>
      <span style="${TITULO};font-size:27px;line-height:1;color:${COR.azul}">${esc(d.nome)}</span></a>
    ${d.dicas.map(x => `<a href="#d-${d.id}-${x.n}" style="text-decoration:none;display:grid;grid-template-columns:26px 1fr 34px;gap:6px;align-items:baseline;padding:5.5px 0;border-bottom:1px dashed #C9CFDB">
      <span style="${TITULO};font-size:16px;color:${COR.vermelho}">${dois(x.n)}</span>
      <span style="${TEXTO};font-size:12.4px;font-weight:600;line-height:1.3;color:${COR.navy}">${esc(x.tema)}</span>
      <span data-pag="d-${d.id}-${x.n}" style="${TEXTO};font-size:11px;font-weight:800;color:${COR.azul};text-align:right"></span></a>`).join('')}
  </div>`;
  return `<section class="pagina" style="background:${COR.off}">
    ${anel(640, 930, 300, 38)}
    <div style="position:absolute;left:${M}px;right:${M}px;top:66px;z-index:3">
      <div style="${TEXTO};font-size:13px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:${COR.azul}">Mapa da revisão</div>
      <div style="${TITULO};font-size:70px;line-height:.92;color:${COR.azul};margin-top:8px">As ${p.disciplinas.reduce((t, d) => t + d.dicas.length, 0)} <span style="background:${COR.azul};color:#fff;padding:0 .12em">dicas</span></div>
      <p style="${TEXTO};font-size:14px;line-height:1.45;color:${COR.navy};margin-top:14px;max-width:600px">Cada dica traz o ponto que a banca cobra, uma explicação curta, a fonte e as questões do ENAM em que o tema caiu. Clique no tema para ir direto à página.</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:30px;margin-top:26px">${p.disciplinas.map(col).join('')}</div>
      <div style="margin-top:22px;border:2px dashed #C9CFDB;border-radius:14px;padding:12px 16px;background:#fff;${TEXTO};font-size:12px;line-height:1.45;color:${COR.navy}"><b style="font-weight:800">Como ler:</b> no selo azul, a fonte (lei, tratado, resolução ou precedente); no selo vermelho, a edição e o número da questão. ${esc(p.fonte)}</div>
    </div>
    <div class="rodape"></div>
    ${textura(false)}
  </section>`;
}

function abertura(d, i) {
  return `<div class="bloco" data-sec="${esc(d.nome)}" data-alvo="d-${d.id}" data-junto="1" style="margin-bottom:16px">
    <div id="d-${d.id}" style="position:relative;overflow:hidden;background:${gradAzul};border-radius:18px;padding:26px 30px 24px;color:#fff">
      <div style="position:absolute;right:-110px;top:-120px;width:230px;height:230px;border:34px solid ${COR.vermelho};border-radius:50%"></div>
      <div style="position:relative;display:flex;align-items:flex-end;gap:18px">
        <span style="${TITULO};font-size:84px;line-height:.8;color:transparent;-webkit-text-stroke:2px rgba(255,255,255,.6)">${dois(i + 1)}</span>
        <span style="${TITULO};font-size:46px;line-height:.92;max-width:460px">${esc(d.nome)}</span>
      </div>
      <p style="position:relative;${TEXTO};font-size:13.5px;line-height:1.45;color:${COR.off};margin-top:14px;max-width:560px">${esc(d.descricao)}</p>
      <div style="position:relative;display:flex;gap:8px;margin-top:14px">${chip(`${d.dicas.length} dicas`, '#fff', COR.azul)}${chip('dica · explicação · fonte', COR.navyFundo, '#fff')}</div>
    </div>
  </div>`;
}

function cartao(d, x) {
  return `<div class="bloco" data-sec="${esc(d.nome)}" data-alvo="d-${d.id}-${x.n}" id="d-${d.id}-${x.n}" style="display:grid;grid-template-columns:74px 1fr;gap:14px;padding:16px 0;border-bottom:2px dashed #D5DAE4">
    <div style="${TITULO};font-size:62px;line-height:.82;color:transparent;-webkit-text-stroke:2px ${COR.azul}">${dois(x.n)}</div>
    <div>
      <div style="${TEXTO};font-size:10.5px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:${COR.vermelho}">${esc(x.tema)}</div>
      <p style="${TEXTO};font-size:16px;font-weight:800;line-height:1.32;color:${COR.navy};margin-top:5px">${esc(x.dica)}</p>
      <div style="margin-top:10px;background:#fff;border-left:4px solid ${COR.azul};border-radius:0 10px 10px 0;padding:10px 14px">
        <div style="${TEXTO};font-size:10px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:${COR.azul};margin-bottom:3px">Explicação</div>
        <p style="${TEXTO};font-size:13px;font-weight:500;line-height:1.5;color:${COR.navy}">${esc(x.explicacao)}</p>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:10px">${chip(x.fonte, '#E4ECFF', COR.azul)}${x.enam ? chip(x.enam, '#FFE6E3', COR.vermelho) : ''}</div>
    </div>
  </div>`;
}

function cta(c) {
  return `<section class="pagina" style="background:${gradAzul}">
    ${anel(-180, 760, 420, 50)}
    <div style="position:absolute;left:${M}px;right:${M}px;top:50%;transform:translateY(-55%);text-align:center;z-index:3">
      <div style="${TITULO};font-size:130px;line-height:.95;color:#fff">${linhas(c.titulo, COR.navyFundo)}</div>
      <p style="${TEXTO};font-size:20px;font-weight:500;line-height:1.45;color:${COR.off};margin:30px auto 0;max-width:520px">${rico(c.texto, COR.navyFundo)}</p>
      <div style="display:inline-block;margin-top:44px;background:#fff;color:${COR.azul};border-radius:999px;padding:14px 34px;${TITULO};font-size:40px;line-height:1;text-transform:none">Seguir ${PERFIL}</div>
    </div>
    ${textura(true)}
  </section>`;
}

export function renderDicas(p) {
  const blocos = p.disciplinas.map((d, i) => abertura(d, i) + d.dicas.map(x => cartao(d, x)).join('')).join('');
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet">
<style>@page{size:210mm 297mm;margin:0}*{box-sizing:border-box}body{margin:0;${TEXTO};-webkit-font-smoothing:antialiased;-webkit-print-color-adjust:exact;print-color-adjust:exact}
p{margin:0}.pagina{position:relative;width:${W}px;height:${H}px;overflow:hidden;break-after:page}
#fluxo{position:absolute;left:-9999px;top:0;width:${W - 2 * M}px}</style></head><body>
${capa(p)}${mapa(p)}<div id="paginas"></div>${cta(p.cta)}
<div id="fluxo">${blocos}</div>
<script>
document.fonts.ready.then(() => {
  const TOPO = 96, BASE = ${H} - 74, ALT = BASE - TOPO, M = ${M}, azul = '${COR.azul}', navy = '${COR.navy}';
  const blocos = [...document.querySelectorAll('#fluxo .bloco')];
  const paginas = document.getElementById('paginas');
  let pag = null, usado = 0;
  const nova = () => {
    pag = document.createElement('section'); pag.className = 'pagina'; pag.style.background = '${COR.papel}';
    pag.innerHTML = '<div style="position:absolute;left:' + M + 'px;right:' + M + 'px;top:40px;display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid ' + navy + ';padding-bottom:10px;font-size:10.5px;font-weight:800;letter-spacing:.16em;text-transform:uppercase"><span style="color:' + azul + '">${esc(p.cabecalho)}</span><span class="sec" style="color:' + navy + '"></span></div><div class="corpo" style="position:absolute;left:' + M + 'px;right:' + M + 'px;top:' + TOPO + 'px"></div><div class="rodape"></div>' + ${JSON.stringify(textura(false))};
    paginas.appendChild(pag); usado = 0;
  };
  const alt = el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.height + parseFloat(cs.marginTop) + parseFloat(cs.marginBottom); };
  nova();
  for (let i = 0; i < blocos.length; i++) {
    const b = blocos[i], h = alt(b);
    const hNec = b.dataset.junto ? h + alt(blocos[i + 1] || b) : h;
    if (usado > 0 && (usado + hNec > ALT || b.dataset.junto)) nova();
    const sec = pag.querySelector('.sec'); if (!sec.textContent) sec.textContent = b.dataset.sec;
    const alvo = document.querySelector('[data-pag="' + b.dataset.alvo + '"]'); if (alvo) alvo.dataset.n = 2 + paginas.children.length;
    pag.querySelector('.corpo').appendChild(b); usado += h;
    if (usado > ALT + 2) window.__avisos = (window.__avisos || []).concat('bloco maior que a página: ' + b.dataset.alvo);
  }
  const todas = [...document.querySelectorAll('.pagina')];
  todas.forEach((s, i) => { const r = s.querySelector('.rodape'); if (!r) return;
    r.outerHTML = '<div style="position:absolute;left:' + M + 'px;right:' + M + 'px;bottom:34px;display:flex;justify-content:space-between;font-size:11px;font-weight:700;letter-spacing:.08em;color:' + navy + '"><span>${PERFIL}</span><span style="font-family:\\'Big Shoulders Display\\';font-weight:900;font-size:16px;color:' + azul + '">' + String(i + 1).padStart(2, '0') + '</span></div>'; });
  document.querySelectorAll('[data-pag]').forEach(el => { el.textContent = 'p. ' + String(el.dataset.n || '').padStart(2, '0'); });
  document.getElementById('fluxo').remove();
  todas[todas.length - 1].style.breakAfter = 'auto';
  window.__pronto = true;
});
</script></body></html>`;
  return { html, avisos: [], largura: W, altura: H };
}
