// Simulado autoral (Libero PDF): prova da 2ª fase no modelo da FGV, em dois PDFs separados.
// parte "prova": capa azul com @liberofilho, instruções, peça, 2 folhas de rascunho numeradas, uma página por
//   questão (itens A e B com o valor e linhas para responder) e CTA para seguir (gabarito em breve).
// parte "gabarito": capa escura, gabarito comentado e distribuição dos pontos da peça e de cada questão
//   (paginado no navegador: um bloco que não cabe vai para a página seguinte) e CTA.
// O conteúdo fica em simulados/<conteudo>.json, usado pelas duas partes.
import fs from 'node:fs';
import path from 'node:path';
import { COR, FONTES, TITULO, TEXTO, PERFIL, esc, lista, rico, linhas, textura, anel } from '../libero-comum/identidade.mjs';

export const W = 794, H = 1122;
const M = 58, TOPO = 100, BASE = 78;
const dir = path.dirname(new URL(import.meta.url).pathname);
const par = (t, px = 13.4, extra = '') => `<p style="${TEXTO};font-size:${px}px;font-weight:500;line-height:1.55;color:${COR.navy};text-align:justify;hyphens:auto;margin:0 0 .75em;${extra}">${rico(t)}</p>`;
const kick = (t, cor = COR.azul) => `<div style="${TEXTO};font-size:11px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:${cor}">${esc(t)}</div>`;
const chip = (t, bg = '#E4ECFF', cor = COR.azul) => `<span style="display:inline-block;background:${bg};color:${cor};${TEXTO};font-size:10.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;padding:3px 9px;border-radius:5px">${esc(t)}</span>`;
// Linhas para escrever, numeradas (como o caderno da FGV); ocupam o resto da página.
const pauta = (de = 1, n = 40) => `<div style="flex:1;min-height:0;overflow:hidden;margin-top:14px;border-top:2px solid ${COR.navy}">${Array.from({ length: n }, (_, i) => `<div style="display:flex;align-items:flex-end;height:25px;border-bottom:1px solid #C9CFDB"><span style="width:26px;${TEXTO};font-size:9px;font-weight:700;color:#8A93A6;padding-bottom:3px">${de + i}</span></div>`).join('')}</div>`;

function papel(corpo, secao, n) {
  return `<section class="pagina" style="background:${COR.papel}">
    <div style="position:absolute;left:${M}px;right:${M}px;top:40px;display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid ${COR.navy};padding-bottom:10px;${TEXTO};font-size:10.5px;font-weight:800;letter-spacing:.16em;text-transform:uppercase"><span style="color:${COR.azul}">Simulado autoral · 2ª fase OAB</span><span style="color:${COR.navy}">${esc(secao)}</span></div>
    <div class="cabe" style="position:absolute;left:${M}px;right:${M}px;top:${TOPO}px;bottom:${BASE}px;display:flex;flex-direction:column;overflow:hidden">${corpo}</div>
    ${rodapePag(n)}${textura(false)}
  </section>`;
}
const rodapePag = n => `<div style="position:absolute;left:${M}px;right:${M}px;bottom:34px;display:flex;justify-content:space-between;align-items:baseline;${TEXTO};font-size:11px;font-weight:700;letter-spacing:.08em;color:${COR.navy}"><span>${PERFIL}</span><span class="num" style="font-family:'Big Shoulders Display';font-weight:900;font-size:16px;color:${COR.azul}">${String(n).padStart(2, '0')}</span></div>`;

function capa(c, escura, numeros) {
  const bg = escura ? `radial-gradient(120% 90% at 100% 0%,#1d3566 0%,${COR.navyFundo} 60%)` : `linear-gradient(170deg,${COR.azul} 0%,${COR.azulFundo} 100%)`;
  return `<section class="pagina" style="background:${bg}">
    ${anel(470, -190, 460, 52)}
    <div style="position:absolute;left:${M}px;top:66px;${TEXTO};font-size:13px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:#fff;background:${escura ? COR.azul : COR.navyFundo};padding:8px 14px;border-radius:6px;z-index:3">${esc(c.rotulo)}</div>
    <div style="position:absolute;left:${M}px;right:${M}px;top:300px;z-index:3">
      <div style="${TITULO};font-size:${c.ts || 140}px;line-height:.95;color:#fff">${linhas(c.titulo, escura ? COR.azul : COR.navyFundo)}</div>
      <p style="${TEXTO};font-size:19px;font-weight:500;line-height:1.42;color:${COR.off};margin-top:30px;max-width:540px">${esc(c.sub)}</p>
    </div>
    <div style="position:absolute;left:${M}px;right:${M}px;bottom:150px;display:flex;gap:26px;z-index:3">
      ${numeros.map(([n, r]) => `<div style="flex:1;border-top:3px solid rgba(255,255,255,.35);padding-top:14px"><div style="${TITULO};font-size:58px;line-height:.9;color:#fff">${n}</div><div style="${TEXTO};font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${COR.off};margin-top:6px">${r}</div></div>`).join('')}
    </div>
    <div style="position:absolute;left:${M}px;right:${M}px;bottom:52px;display:flex;justify-content:space-between;align-items:center;z-index:3">
      <span style="${TEXTO};font-size:13px;font-weight:600;color:${COR.off}">Por</span>
      <span style="flex:1;margin-left:10px;${TITULO};font-size:44px;line-height:1;color:#fff;letter-spacing:.01em;text-transform:none">${PERFIL}</span>
      <span style="${TEXTO};font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${COR.off}">Direito Constitucional</span>
    </div>
    ${textura(true)}
  </section>`;
}

function cta(c, escura) {
  const bg = escura ? `radial-gradient(120% 90% at 100% 0%,#1d3566 0%,${COR.navyFundo} 60%)` : `linear-gradient(170deg,${COR.azul} 0%,${COR.azulFundo} 100%)`;
  return `<section class="pagina" style="background:${bg}">
    ${anel(-180, 760, 420, 50)}
    <div style="position:absolute;left:${M}px;right:${M}px;top:50%;transform:translateY(-55%);text-align:center;z-index:3">
      ${c.selo ? `<span style="display:inline-block;${TEXTO};font-size:13px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:#fff;background:${COR.vermelho};padding:8px 16px;border-radius:6px;transform:rotate(-2deg)">${esc(c.selo)}</span>` : ''}
      <div style="${TITULO};font-size:120px;line-height:.95;color:#fff;margin-top:26px">${linhas(c.titulo, escura ? COR.azul : COR.navyFundo)}</div>
      <p style="${TEXTO};font-size:20px;font-weight:500;line-height:1.45;color:${COR.off};margin:30px auto 0;max-width:520px">${rico(c.texto, COR.navyFundo)}</p>
      <div style="display:inline-block;margin-top:44px;background:#fff;color:${COR.azul};border-radius:999px;padding:14px 34px;${TITULO};font-size:40px;line-height:1;text-transform:none">Seguir ${PERFIL}</div>
    </div>
    ${textura(true)}
  </section>`;
}

function prova(s) {
  const pags = [];
  let n = 1;
  pags.push(capa(s.capa, false, [['1', 'peça'], ['4', 'questões'], ['5h', 'de prova'], ['10', 'pontos']]));
  pags.push(papel(`${kick('Antes de começar')}
    <div style="${TITULO};font-size:64px;line-height:.92;color:${COR.azul};margin-top:8px">Instruções</div>
    <div style="display:flex;flex-direction:column;gap:14px;margin-top:26px">${lista(s.instrucoes).map((t, i) => `<div style="display:grid;grid-template-columns:40px 1fr;gap:12px;align-items:start"><span style="${TITULO};font-size:32px;line-height:.9;color:transparent;-webkit-text-stroke:1.4px ${COR.azul}">${String(i + 1).padStart(2, '0')}</span><span style="${TEXTO};font-size:14px;font-weight:500;line-height:1.5;color:${COR.navy}">${rico(t)}</span></div>`).join('')}</div>
    <div style="margin-top:30px;border:2px solid ${COR.navy};border-radius:14px;padding:18px 20px;background:#fff">
      ${kick('Sua prova')}
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:12px">${[['Peça', '5,00'], ['Questões 1 a 4', '1,25 cada'], ['Aprovação', '6,00']].map(([a, b]) => `<div><div style="${TEXTO};font-size:11px;font-weight:700;color:#5B6478;text-transform:uppercase;letter-spacing:.08em">${a}</div><div style="${TITULO};font-size:38px;color:${COR.navy};line-height:1">${b}</div></div>`).join('')}</div>
    </div>
    <div style="margin-top:22px;display:grid;grid-template-columns:1fr 1fr;gap:14px">
      <div style="background:#E4ECFF;border-radius:12px;padding:14px 16px">${kick('Tempo sugerido')}<p style="${TEXTO};font-size:13px;line-height:1.5;color:${COR.navy};margin-top:6px">Peça: até 3 horas (rascunho + texto final). Questões: cerca de 25 minutos cada.</p></div>
      <div style="background:#FFE3EA;border-radius:12px;padding:14px 16px">${kick('Não pode', COR.vermelho)}<p style="${TEXTO};font-size:13px;line-height:1.5;color:${COR.navy};margin-top:6px">Assinar, inventar nome, data ou dado que não está no enunciado. Isso é marca de identificação.</p></div>
    </div>
    <p style="${TEXTO};font-size:10.5px;line-height:1.45;color:#5B6478;margin-top:auto">${esc(s.aviso)}</p>`, 'Instruções', ++n));
  pags.push(papel(`<div style="display:flex;justify-content:space-between;align-items:flex-end"><div>${kick('Peça prático-profissional')}<div style="${TITULO};font-size:56px;line-height:.9;color:${COR.azul};margin-top:6px">A peça</div></div>${chip(s.peca.inspirado)}</div>
    <div style="height:2px;background:#D5DAE4;margin:16px 0 18px"></div>
    ${lista(s.peca.enunciado).map(t => par(t, 13.2)).join('')}
    <p style="${TEXTO};font-size:11.5px;font-style:italic;line-height:1.45;color:#5B6478;margin-top:4px">${esc(s.peca.obs)}</p>`, 'Peça · valor 5,00', ++n));
  pags.push(papel(`${kick('Rascunho da peça')}${pauta(1, 36)}`, 'Peça · rascunho', ++n));
  pags.push(papel(`${kick('Rascunho da peça (continuação)')}${pauta(37, 36)}`, 'Peça · rascunho', ++n));
  s.questoes.forEach((q, i) => pags.push(papel(`<div>${kick('Questão discursiva')}<div style="${TITULO};font-size:56px;line-height:.9;color:${COR.azul};margin-top:6px">Questão ${i + 1}</div></div>
    <div style="height:2px;background:#D5DAE4;margin:14px 0 16px"></div>
    ${lista(q.enunciado).map(t => par(t, 13.2)).join('')}
    <div style="display:flex;flex-direction:column;gap:8px">${q.itens.map(it => `<div style="display:grid;grid-template-columns:26px 1fr;gap:8px;align-items:start"><span style="${TITULO};font-size:22px;line-height:1;color:${COR.vermelho}">${it.letra})</span><span style="${TEXTO};font-size:13.2px;font-weight:700;line-height:1.5;color:${COR.navy}">${esc(it.texto)} <span style="font-weight:800;color:${COR.azul};white-space:nowrap">(Valor: ${it.valor})</span></span></div>`).join('')}</div>
    <p style="${TEXTO};font-size:11px;font-style:italic;color:#5B6478;margin-top:8px">Obs.: o(a) examinando(a) deve fundamentar suas respostas. A mera citação do dispositivo legal não confere pontuação.</p>
    ${pauta(1, 30)}`, `Questão ${i + 1} · valor 1,25`, ++n)));
  pags.push(cta(s.cta, false));
  return pags;
}

// Blocos do gabarito (paginados no navegador). data-nova: começa página nova; data-secao: texto do cabeçalho.
function gabaritoBlocos(s) {
  const titulo = (k, t, sub) => `<div class="bloco" data-nova="1" data-secao="${esc(k)}" style="margin-bottom:14px"><div style="display:flex;justify-content:space-between;align-items:flex-end;gap:16px"><div>${kick(k)}<div style="${TITULO};font-size:50px;line-height:.9;color:${COR.azul};margin-top:6px">${esc(t)}</div></div>${sub ? chip(sub) : ''}</div><div style="height:2px;background:#D5DAE4;margin-top:14px"></div></div>`;
  const sub = t => `<div class="bloco" style="margin:10px 0 8px">${kick(t, COR.navy)}</div>`;
  const texto = t => `<div class="bloco">${par(t, 12.8)}</div>`;
  const cab = `<div class="bloco" style="display:grid;grid-template-columns:1fr 112px;background:${COR.navy};color:#fff;border-radius:8px 8px 0 0;padding:7px 12px;${TEXTO};font-size:10.5px;font-weight:800;letter-spacing:.12em;text-transform:uppercase"><span>Item</span><span style="text-align:right">Pontuação</span></div>`;
  const linha = p => p.grupo ? `<div class="bloco" style="background:#E4ECFF;padding:6px 12px;${TEXTO};font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:${COR.azul};border-left:1px solid #D5DAE4;border-right:1px solid #D5DAE4">${esc(p.grupo)}</div>`
    : `<div class="bloco" style="display:grid;grid-template-columns:1fr 112px;gap:12px;padding:7px 12px;background:#fff;border:1px solid #D5DAE4;border-top:none"><span style="${TEXTO};font-size:12px;font-weight:500;line-height:1.45;color:${COR.navy}">${rico(p.item)}</span><span style="${TEXTO};font-size:11px;font-weight:800;color:${COR.azul};text-align:right;line-height:1.45">${esc(p.valor).replace(/\//g, '/<wbr>')}</span></div>`;
  let h = titulo('Padrão de resposta · peça', 'A peça', 'Valor: 5,00') + sub('Gabarito comentado') + lista(s.peca.gabarito).map(texto).join('');
  h += `<div class="bloco" data-nova="1" data-secao="Padrão de resposta · peça"></div>` + sub('Distribuição dos pontos') + cab + s.peca.pontos.map(linha).join('');
  s.questoes.forEach((q, i) => {
    h += titulo(`Padrão de resposta · questão ${i + 1}`, `Questão ${i + 1}`, q.tema);
    h += `<div class="bloco" style="margin-bottom:6px">${q.itens.map(it => `<p style="${TEXTO};font-size:11.5px;line-height:1.45;color:#5B6478;margin:0 0 4px"><b style="color:${COR.navy}">${it.letra})</b> ${esc(it.texto)} (Valor: ${it.valor})</p>`).join('')}</div>`;
    h += sub('Gabarito comentado') + lista(q.gabarito).map(texto).join('') + sub('Distribuição dos pontos') + cab + q.pontos.map(linha).join('');
  });
  return h;
}

export function renderSimulado(p) {
  const s = JSON.parse(fs.readFileSync(path.join(dir, 'simulados', `${p.conteudo}.json`), 'utf8'));
  const gab = p.parte === 'gabarito';
  const pags = gab ? [capa(s.capaGabarito, true, [['1', 'peça'], ['4', 'questões'], ['10', 'pontos']])] : prova(s);
  const fimGab = gab ? cta(s.ctaGabarito, true) : '';
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet">
<style>@page{size:210mm 297mm;margin:0}*{box-sizing:border-box}body{margin:0;${TEXTO};-webkit-font-smoothing:antialiased;-webkit-print-color-adjust:exact;print-color-adjust:exact}
p{margin:0}.pagina{position:relative;width:${W}px;height:${H}px;overflow:hidden;break-after:page}.pagina:last-child{break-after:auto}
#fluxo{position:absolute;left:-9999px;top:0;width:${W - 2 * M}px}</style></head><body>
${pags.join('\n')}<div id="paginas"></div>${fimGab}
${gab ? `<div id="fluxo">${gabaritoBlocos(s)}</div>` : ''}
<script>
document.fonts.ready.then(() => {
  const avisos = [];
  const fluxo = document.getElementById('fluxo');
  if (fluxo) {
    const ALT = ${H - TOPO - BASE}, molde = ${JSON.stringify(papel('', '', 0))};
    const paginas = document.getElementById('paginas');
    let pag = null, usado = 0;
    const nova = secao => { const d = document.createElement('div'); d.innerHTML = molde; pag = d.firstElementChild; pag.querySelector('.cabe').style.display = 'block'; pag.children[0].children[1].textContent = secao; paginas.appendChild(pag); usado = 0; };
    const alt = el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.height + parseFloat(cs.marginTop) + parseFloat(cs.marginBottom); };
    let secao = '';
    for (const b of [...fluxo.querySelectorAll('.bloco')]) {
      if (b.dataset.secao) secao = b.dataset.secao;
      const h = alt(b);
      if (!pag || (b.dataset.nova && usado > 0) || usado + h > ALT) nova(secao);
      pag.querySelector('.cabe').appendChild(b); usado += h;
    }
    fluxo.remove();
  }
  const todas = [...document.querySelectorAll('.pagina')];
  todas.forEach((s, i) => { const r = s.querySelector('.num'); if (r) r.textContent = String(i + 1).padStart(2, '0');
    const c = s.querySelector('.cabe'); if (c && c.scrollHeight > c.clientHeight + 1) avisos.push('página ' + (i + 1) + ': conteúdo passa do espaço (' + (c.scrollHeight - c.clientHeight) + ' px)'); });
  window.__avisos = avisos; window.__pronto = true;
});
</script></body></html>`;
  return { html, avisos: [], largura: W, altura: H };
}
