// Molde "Libero PDF" (@liberofilho): material em PDF A4 (retrato) na identidade do Carrossel Libero
// (libero-comum/identidade.mjs): capa azul com anel vermelho, raio-x com sumário, páginas de conteúdo em
// papel com cabeçalho e número de página, faixa azul abrindo cada matéria e índice por exame no fim.
// Conteúdo: uma lista de teses {exame, peca, materia, tese, artigo}, agrupada por matéria e, dentro dela,
// por exame (do mais recente ao mais antigo). A paginação é feita no navegador: cada bloco (abertura de
// matéria ou grupo de um exame) vai para a página seguinte se não couber.
import { COR, FONTES, TITULO, TEXTO, PERFIL, esc, linhas, textura, anel } from '../libero-comum/identidade.mjs';

export const W = 794, H = 1122;  // A4 a 96 dpi (210 × 297 mm)
const M = 58;                     // margem lateral
// Peça-base para a contagem da capa (coletivo e reaplicação não contam como peça nova).
const BASE = { 'MS coletivo': 'Mandado de segurança', 'MI coletivo': 'Mandado de injunção', 'Procedimento comum ou MS': 'Procedimento comum' };
const dois = n => String(n).padStart(2, '0');
const chip = (txt, bg, cor, px = 10.5) => `<span style="display:inline-block;background:${bg};color:${cor};${TEXTO};font-size:${px}px;font-weight:700;padding:2px 8px;border-radius:5px;white-space:nowrap">${esc(txt)}</span>`;

function capa(p, total) {
  const c = p.capa || {};
  const exames = new Set(p.teses.map(t => t.exame)).size, pecas = new Set(p.teses.map(t => BASE[t.peca] || t.peca.replace(/ \(.*\)$/, ''))).size;
  const num = (n, rot) => `<div style="flex:1;border-top:3px solid rgba(255,255,255,.35);padding-top:14px">
      <div style="${TITULO};font-size:64px;line-height:.9;color:#fff">${n}</div>
      <div style="${TEXTO};font-size:13px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${COR.off};margin-top:6px">${rot}</div></div>`;
  return `<section class="pagina" style="background:linear-gradient(170deg,${COR.azul} 0%,${COR.azulFundo} 100%)">
    ${anel(500, -170, 440, 50)}
    <div style="position:absolute;left:${M}px;top:70px;${TEXTO};font-size:13px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:#fff;background:${COR.navyFundo};padding:8px 14px;border-radius:6px;z-index:3">${esc(c.rotulo)}</div>
    <div style="position:absolute;left:${M}px;right:${M}px;top:300px;z-index:3">
      <div style="${TITULO};font-size:${c.ts || 132}px;line-height:1.02;color:#fff">${linhas(c.titulo, COR.navyFundo)}</div>
      <p style="${TEXTO};font-size:20px;font-weight:500;line-height:1.4;color:${COR.off};margin-top:28px;max-width:520px">${esc(c.sub)}</p>
    </div>
    <div style="position:absolute;left:${M}px;right:${M}px;bottom:130px;display:flex;gap:28px;z-index:3">
      ${num(total, 'teses')}${num(exames, 'exames')}${num(pecas, 'peças')}${num(p.materias.length, 'matérias')}
    </div>
    <div style="position:absolute;left:${M}px;bottom:58px;${TEXTO};font-size:15px;font-weight:700;letter-spacing:.08em;color:#fff;z-index:3">${PERFIL}</div>
    ${textura(true)}
  </section>`;
}

// Raio-X: barras por matéria (a maior em vermelho), que servem de sumário (a página entra depois da paginação).
function raiox(p, grupos) {
  const max = Math.max(...grupos.map(g => g.teses.length));
  return `<section class="pagina" style="background:${COR.off}">
    ${anel(620, 900, 330, 40)}
    <div style="position:absolute;left:${M}px;right:${M}px;top:70px;z-index:3">
      <div style="${TEXTO};font-size:13px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:${COR.azul}">Raio-X · o que mais cai</div>
      <div style="${TITULO};font-size:76px;line-height:.92;color:${COR.azul};margin-top:10px">As teses por <span style="background:${COR.azul};color:#fff;padding:0 .12em">matéria</span></div>
      <p style="${TEXTO};font-size:14.5px;line-height:1.45;color:${COR.navy};margin-top:18px;max-width:560px">Cada tese aparece na matéria em que ela se apoia. Dentro de cada matéria, os exames vêm do mais recente ao mais antigo. Clique no nome para ir direto à página.</p>
      <div style="margin-top:40px;display:flex;flex-direction:column;gap:26px">
        ${grupos.map((g, i) => `<a href="#m-${g.id}" style="text-decoration:none;color:inherit;display:grid;grid-template-columns:44px 1fr 70px;gap:14px;align-items:center">
          <span style="${TITULO};font-size:34px;color:transparent;-webkit-text-stroke:1.5px ${COR.azul}">${dois(i + 1)}</span>
          <span style="display:flex;flex-direction:column;gap:6px">
            <span style="${TEXTO};font-size:15px;font-weight:800;color:${COR.navy}">${esc(g.nome)} <span style="font-weight:600;color:#5B6478">· ${g.teses.length} teses</span></span>
            <span style="height:14px;border-radius:7px;background:#DCE1EA;overflow:hidden"><span style="display:block;height:100%;width:${(100 * g.teses.length / max).toFixed(1)}%;background:${g.teses.length === max ? COR.vermelho : COR.azul};border-radius:6px"></span></span>
          </span>
          <span data-pag="${g.id}" style="${TITULO};font-size:26px;color:${COR.navy};text-align:right;white-space:nowrap"></span>
        </a>`).join('')}
      </div>
      <div style="margin-top:40px;border:2px dashed #C9CFDB;border-radius:14px;padding:16px 20px;display:grid;grid-template-columns:88px 1fr;gap:16px;align-items:start;background:#fff">
        <div><div style="${TEXTO};font-size:10px;font-weight:800;letter-spacing:.14em;color:${COR.azul}">OAB</div><div style="${TITULO};font-size:36px;line-height:.9;color:${COR.navy}">35</div><div style="${TEXTO};font-size:10px;font-weight:800;text-transform:uppercase;color:${COR.vermelho};margin-top:4px">ADI</div></div>
        <div style="${TEXTO};font-size:13px;line-height:1.4;color:${COR.navy}"><b style="font-weight:800">Como ler:</b> à esquerda, o exame e a peça em que a tese caiu. À direita, a tese e, no selo azul, o artigo que a fundamenta. ${chip('art. 30, I', '#E4ECFF', COR.azul)}</div>
      </div>
    </div>
    <div style="position:absolute;left:${M}px;right:${M}px;bottom:44px;max-width:520px;${TEXTO};font-size:10.5px;line-height:1.4;color:#5B6478;z-index:3">Fonte: ${esc(p.fonte)}</div>
    ${textura(false)}
  </section>`;
}

// Blocos do fluxo: abertura da matéria e um grupo por exame + peça.
function abertura(g, i) {
  const exames = new Set(g.teses.map(t => t.exame)).size;
  return `<div class="bloco" data-materia="${esc(g.nome)}" data-id="${g.id}" data-junto="1" style="margin-bottom:18px">
    <div id="m-${g.id}" style="position:relative;overflow:hidden;background:linear-gradient(170deg,${COR.azul} 0%,${COR.azulFundo} 100%);border-radius:18px;padding:26px 30px 24px;color:#fff">
      <div style="position:absolute;right:-110px;top:-120px;width:230px;height:230px;border:34px solid ${COR.vermelho};border-radius:50%"></div>
      <div style="position:relative;display:flex;align-items:flex-end;gap:18px">
        <span style="${TITULO};font-size:84px;line-height:.8;color:transparent;-webkit-text-stroke:2px rgba(255,255,255,.6)">${dois(i + 1)}</span>
        <span style="${TITULO};font-size:38px;line-height:.95;max-width:440px">${esc(g.nome)}</span>
      </div>
      <p style="position:relative;${TEXTO};font-size:13px;line-height:1.45;color:${COR.off};margin-top:14px;max-width:560px">${esc(g.descricao)}</p>
      <div style="position:relative;display:flex;gap:8px;margin-top:14px">${chip(`${g.teses.length} teses`, '#fff', COR.azul, 11.5)}${chip(`${exames} exames`, COR.navyFundo, '#fff', 11.5)}</div>
    </div>
  </div>`;
}
function grupo(g, exame, peca, teses) {
  return `<div class="bloco" data-materia="${esc(g.nome)}" style="display:grid;grid-template-columns:92px 1fr;gap:16px;padding:12px 0 12px;border-bottom:2px dashed #D5DAE4">
    <div>
      <div style="${TEXTO};font-size:10px;font-weight:800;letter-spacing:.16em;color:${COR.azul}">OAB</div>
      <div style="${TITULO};font-size:40px;line-height:.88;color:${COR.navy}">${exame}</div>
      <div style="${TEXTO};font-size:10px;font-weight:800;line-height:1.25;letter-spacing:.04em;text-transform:uppercase;color:${COR.vermelho};margin-top:5px">${esc(peca)}</div>
    </div>
    <div style="display:flex;flex-direction:column;gap:9px">
      ${teses.map(t => `<div style="display:grid;grid-template-columns:10px 1fr;gap:8px;align-items:start">
        <span style="width:7px;height:7px;background:${COR.azul};margin-top:6px"></span>
        <div style="${TEXTO};font-size:13.2px;font-weight:600;line-height:1.36;color:${COR.navy}">${esc(t.tese)}${t.artigo ? ` ${chip(t.artigo, '#E4ECFF', COR.azul)}` : ''}</div>
      </div>`).join('')}
    </div>
  </div>`;
}

// Índice por exame (duas colunas): exame, peça e quantas teses.
function indice(p) {
  const por = new Map();
  p.teses.forEach(t => { const k = `${t.exame}|${t.peca}`; por.set(k, (por.get(k) || 0) + 1); });
  const linhasIdx = [...por].map(([k, n]) => { const [e, pc] = k.split('|'); return { e: +e, pc, n }; }).sort((a, b) => b.e - a.e || a.pc.localeCompare(b.pc));
  const meio = Math.ceil(linhasIdx.length / 2);
  const col = arr => `<div style="display:flex;flex-direction:column">${arr.map(l => `<div style="display:grid;grid-template-columns:62px 1fr 40px;gap:8px;align-items:baseline;padding:2.5px 0;border-bottom:1px solid #D5DAE4">
      <span style="${TITULO};font-size:18px;color:${COR.navy}">OAB ${l.e}</span><span style="${TEXTO};font-size:12px;font-weight:600;color:${COR.navy}">${esc(l.pc)}</span><span style="${TEXTO};font-size:12px;font-weight:800;color:${COR.azul};text-align:right">${l.n}</span></div>`).join('')}</div>`;
  return `<section class="pagina" style="background:${COR.papel}">
    <div style="position:absolute;left:${M}px;right:${M}px;top:64px;z-index:3">
      <div style="${TEXTO};font-size:13px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:${COR.azul}">Índice por exame</div>
      <div style="${TITULO};font-size:52px;line-height:.92;color:${COR.azul};margin-top:8px">Qual peça caiu em cada exame</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:34px;margin-top:22px">${col(linhasIdx.slice(0, meio))}${col(linhasIdx.slice(meio))}</div>
      <p style="${TEXTO};font-size:11px;line-height:1.4;color:#5B6478;margin-top:16px">A coluna da direita diz quantas teses daquela prova estão neste PDF.</p>
    </div>
    <div class="rodape"></div>
    ${textura(false)}
  </section>`;
}

export function renderCarrossel(p) {
  const avisos = [];
  const grupos = p.materias.map(m => ({ ...m, teses: p.teses.filter(t => t.materia === m.id) }));
  p.teses.filter(t => !p.materias.some(m => m.id === t.materia)).forEach(t => avisos.push(`tese sem matéria válida (${t.materia}): ${t.tese.slice(0, 40)}`));
  const blocos = grupos.map((g, i) => {
    const chaves = [...new Set(g.teses.map(t => `${t.exame}|${t.peca}`))].map(k => k.split('|')).sort((a, b) => b[0] - a[0]);
    return abertura(g, i) + chaves.map(([e, pc]) => grupo(g, e, pc, g.teses.filter(t => t.exame == e && t.peca === pc))).join('');
  }).join('');

  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet">
<style>@page{size:210mm 297mm;margin:0}*{box-sizing:border-box}body{margin:0;${TEXTO};-webkit-font-smoothing:antialiased;-webkit-print-color-adjust:exact;print-color-adjust:exact}
p{margin:0}.pagina{position:relative;width:${W}px;height:${H}px;overflow:hidden;break-after:page}
#fluxo{position:absolute;left:-9999px;top:0;width:${W - 2 * M}px}</style></head><body>
${capa(p, p.teses.length)}${raiox(p, grupos)}<div id="paginas"></div>${indice(p)}
<div id="fluxo">${blocos}</div>
<script>
// Paginação: enche cada página com blocos; a abertura de matéria só fica se couber junto com o bloco seguinte.
document.fonts.ready.then(() => {
  const TOPO = 96, BASE = ${H} - 74, ALT = BASE - TOPO, M = ${M}, azul = '${COR.azul}', navy = '${COR.navy}';
  const blocos = [...document.querySelectorAll('#fluxo .bloco')];
  const paginas = document.getElementById('paginas');
  let pag = null, usado = 0, materia = '';
  const nova = () => {
    pag = document.createElement('section'); pag.className = 'pagina'; pag.style.background = '${COR.papel}';
    pag.innerHTML = '<div class="cab" style="position:absolute;left:' + M + 'px;right:' + M + 'px;top:40px;display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid ' + navy + ';padding-bottom:10px;font-size:10.5px;font-weight:800;letter-spacing:.16em;text-transform:uppercase"><span style="color:' + azul + '">Teses já cobradas · OAB</span><span class="mat" style="color:' + navy + '"></span></div><div class="corpo" style="position:absolute;left:' + M + 'px;right:' + M + 'px;top:' + TOPO + 'px"></div><div class="rodape"></div>' + ${JSON.stringify(textura(false))};
    paginas.appendChild(pag); usado = 0;
  };
  const alt = el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.height + parseFloat(cs.marginTop) + parseFloat(cs.marginBottom); };
  nova();
  for (let i = 0; i < blocos.length; i++) {
    const b = blocos[i];
    let h = alt(b);
    const hNec = b.dataset.junto ? h + alt(blocos[i + 1] || b) : h;
    if (usado > 0 && usado + hNec > ALT) nova();
    if (!pag.querySelector('.mat').textContent || b.dataset.id) pag.querySelector('.mat').textContent = b.dataset.materia;
    if (b.dataset.id) { const alvo = document.querySelector('[data-pag="' + b.dataset.id + '"]'); if (alvo) alvo.dataset.alvo = 2 + paginas.children.length; }
    pag.querySelector('.corpo').appendChild(b); usado += h;
    if (usado > ALT + 2) window.__avisos = (window.__avisos || []).concat('bloco maior que a página: ' + b.dataset.materia);
  }
  // Números de página (a capa não leva) e rodapé.
  const todas = [...document.querySelectorAll('.pagina')];
  todas.forEach((s, i) => { const r = s.querySelector('.rodape'); if (!r) return;
    r.outerHTML = '<div style="position:absolute;left:' + M + 'px;right:' + M + 'px;bottom:34px;display:flex;justify-content:space-between;font-size:11px;font-weight:700;letter-spacing:.08em;color:' + navy + '"><span>${PERFIL}</span><span style="font-family:\\'Big Shoulders Display\\';font-weight:900;font-size:16px;color:' + azul + '">' + String(i + 1).padStart(2, '0') + '</span></div>'; });
  document.querySelectorAll('[data-pag]').forEach(el => { el.textContent = 'p. ' + String(el.dataset.alvo || '').padStart(2, '0'); });
  document.getElementById('fluxo').remove();
  const ult = todas[todas.length - 1]; ult.style.breakAfter = 'auto';
  window.__pronto = true;
});
</script></body></html>`;
  return { html, avisos, largura: W, altura: H };
}
