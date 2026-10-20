// Caderno de questões discursivas (Método VDE · PDF, `tipo: "questoes"`): capa, como usar, sumário com links
// e páginas, Parte I (enunciados por área), Parte II (gabaritos e espelhos), referências e fechamento.
// O conteúdo fica em questoes/<conteudo>.json: { areas: [{nome, q: [{n, enun[], itens[[letra, texto, valor]],
// titulo, tag, ref, resp{A,B}, fund{A,B}, esp[[letra, conteudo, fundamento, total]]}]}], refs: [[url, nome]] }.
// A paginação é feita no navegador: cada questão ou gabarito vai inteiro para a página seguinte se não couber,
// e cada área começa em página nova.
import fs from 'node:fs';
import path from 'node:path';
import { W, H, M, COR, DEGRADE, DEG_H, FONTES, F, TIT, PERFIS, esc, lista, dois, rico, arcos, kick, quadro, chip } from './template.mjs';

const dir = path.dirname(new URL(import.meta.url).pathname);
const slug = s => s.normalize('NFD').replace(/[^\w]+/g, '-').toLowerCase();
const curto = n => n.replace('Direito do ', '').replace('Direito ', '');
const rodapeEscuro = () => `<div style="position:absolute;left:${M}px;right:${M}px;bottom:40px;display:flex;justify-content:space-between;${F};font-size:10px;font-weight:500;color:rgba(255,255,255,.75)"><span>${PERFIS}</span><span class="num" style="font-weight:700"></span></div>`;
// Moldura das páginas brancas (igual à do template): faixa, cabeçalho, área de conteúdo e rodapé numerado.
const branca = (corpo, cab, bg = '#fff') => `<section class="pagina" style="background:${bg}">
    <div style="position:absolute;left:0;right:0;top:0;height:7px;background:${DEG_H}"></div>
    <div style="position:absolute;left:${M}px;right:${M}px;top:30px;display:flex;justify-content:space-between;${F};font-size:9.5px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:${COR.indigo}"><span>Método VDE · Mentoria 2ª fase</span><span class="cab" style="color:${COR.cinza}">${esc(cab)}</span></div>
    <div class="cabe corpo" style="position:absolute;left:${M}px;right:${M}px;top:72px;bottom:74px;overflow:hidden">${corpo}</div>
    <div style="position:absolute;left:${M}px;right:${M}px;bottom:30px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid ${COR.borda};padding-top:10px;${F};font-size:10px;font-weight:500;color:${COR.cinza}"><span>${PERFIS}</span><span class="num" style="font-weight:700;color:${COR.roxo}"></span></div>
  </section>`;
const titulo = (k, t) => `${kick(k)}<div style="${TIT};font-size:30px;line-height:1.05;color:${COR.tinta};margin:5px 0 14px">${t}</div>`;
const par = (t, px = 12.4) => `<p style="${F};font-size:${px}px;line-height:1.58;color:${COR.tinta};margin:0 0 9px;text-align:justify">${rico(t)}</p>`;
const tag = (aposta, longa) => `<span style="display:inline-block;${F};font-size:8.5px;font-weight:700;letter-spacing:.14em;border-radius:5px;padding:2px 8px;${aposta ? `background:${DEG_H};color:#fff` : `background:${COR.lavandaClara};color:${COR.roxo};border:1px solid ${COR.lavanda}`}">${aposta ? (longa ? 'APOSTA TEMÁTICA · TREINO PROSPECTIVO' : 'APOSTA') : (longa ? 'TEMA JÁ COBRADO · VARIAÇÃO AUTORAL' : 'VARIAÇÃO')}</span>`;

function capa(p, D) {
  const c = p.capa || {};
  return `<section class="pagina" style="background:${DEGRADE};color:#fff">
    ${arcos(W + 120, 640, 260, 9, 'rgba(201,184,255,.26)')}
    <div style="position:absolute;left:${M}px;top:64px;display:flex;align-items:center;gap:12px"><span style="width:34px;height:3px;border-radius:2px;background:#C9B8FF"></span>${kick('Método VDE', '#fff')}</div>
    <div style="position:absolute;left:${M}px;top:92px;${F};font-size:11px;font-weight:500;letter-spacing:.12em;color:#ECE8FF">MENTORIA · 2ª FASE OAB</div>
    <div style="position:absolute;left:${M}px;right:${M}px;top:130px;height:1px;background:rgba(255,255,255,.22)"></div>
    <div style="position:absolute;left:${M}px;right:${M + 40}px;top:270px">
      ${kick(c.rotulo, COR.lavanda)}
      <div style="${TIT};font-size:${c.ts || 76}px;line-height:1.02;margin-top:16px">${lista(c.titulo).map(l => rico(l, true)).join('<br>')}</div>
      <span style="display:block;width:70px;height:5px;border-radius:3px;background:${COR.lavanda};margin-top:26px"></span>
      <p style="${F};font-size:16px;line-height:1.5;color:#ECE8FF;margin:24px 0 0;max-width:470px">${rico(c.sub, true)}</p>
      <div style="display:flex;flex-wrap:wrap;gap:7px;margin-top:22px">${D.areas.map(a => `<span style="border:1px solid rgba(201,184,255,.5);background:rgba(255,255,255,.08);border-radius:999px;padding:4px 12px;${F};font-size:10.5px;font-weight:600">${esc(curto(a.nome))}</span>`).join('')}</div>
    </div>
    <div style="position:absolute;left:${M}px;right:${M}px;bottom:170px;display:flex;gap:26px">
      ${[[D.areas.reduce((t, a) => t + a.q.length, 0), 'questões'], [D.areas.length, 'áreas'], ['20 + 10', 'variações + apostas por área']].map(([n, r]) => `<div style="flex:1;border-top:2px solid rgba(255,255,255,.3);padding-top:12px"><div style="${TIT};font-size:42px;line-height:1">${n}</div><div style="${F};font-size:10.5px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:${COR.lavanda};margin-top:6px">${r}</div></div>`).join('')}
    </div>
    <div style="position:absolute;left:${M}px;right:${M}px;bottom:96px;height:1px;background:rgba(255,255,255,.22)"></div>
    <div style="position:absolute;left:${M}px;right:${M}px;bottom:44px;display:flex;justify-content:space-between;align-items:flex-end;gap:30px">
      <div><div style="${F};font-size:13px;font-weight:700">${esc(c.edicao)}</div><div style="${F};font-size:9.5px;line-height:1.45;color:#ECE8FF;margin-top:4px;max-width:420px">${esc(p.aviso)}</div></div>
      <span style="${F};font-size:11px;font-weight:500;color:#ECE8FF;white-space:nowrap">${PERFIS}</span></div>
  </section>`;
}

function comoUsar(p) {
  return branca(`${titulo('Antes de começar', 'Como usar este caderno')}
    ${lista(p.comoUsar).map(t => par(t)).join('')}
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:6px 0 16px">${lista(p.passos).map((t, i) => `<div style="border:1px solid ${COR.borda};border-radius:12px;padding:11px 13px;${F};font-size:11px;line-height:1.45;color:${COR.tinta}">${quadro(i + 1, 26)}<div style="margin-top:7px">${rico(t)}</div></div>`).join('')}</div>
    ${kick('Pontuação editorial')}
    <div style="border:1px solid ${COR.borda};border-radius:12px;overflow:hidden;margin:7px 0 10px;${F};font-size:11.5px;color:${COR.tinta}">
      ${[['Critério', 'Item A', 'Item B'], ['Conclusão e aplicação jurídica ao caso', '0,55', '0,50'], ['Fundamento pertinente vinculado à resposta', '0,10', '0,10'], ['Total por item', '0,65', '0,60']].map((l, i) => `<div style="display:grid;grid-template-columns:1fr 80px 80px;padding:7px 14px;${i === 0 ? `background:${COR.lavandaClara};font-size:9.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${COR.roxo};border-bottom:2px solid ${COR.roxo}` : i === 3 ? `background:${COR.lavandaClara};font-weight:800;color:${COR.roxo};border-top:1px solid ${COR.borda}` : `border-top:1px solid ${COR.borda}`}"><span>${l[0]}</span><span style="text-align:center">${l[1]}</span><span style="text-align:center">${l[2]}</span></div>`).join('')}
    </div>
    ${par(p.pontuacao, 11)}
    <div style="margin-top:6px">${kick('Base e limites das apostas')}</div>
    <div style="margin-top:7px">${lista(p.limites).map(t => par(t, 11)).join('')}</div>`, 'Como usar');
}

function sumario(p, D) {
  return branca(`${titulo('Navegação', 'Neste caderno')}
    ${par('Clique na área para ir aos enunciados ou aos gabaritos. O número é a página.')}
    <div style="display:grid;grid-template-columns:40px 1fr 128px 128px;gap:12px;${F};font-size:9.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${COR.cinza};padding-bottom:7px;border-bottom:2px solid ${COR.roxo};margin-top:6px"><span></span><span>Área</span><span>Parte I</span><span>Parte II</span></div>
    ${D.areas.map((a, i) => `<div style="display:grid;grid-template-columns:40px 1fr 128px 128px;gap:12px;align-items:center;padding:12px 0;border-bottom:1px dashed ${COR.borda}">
      ${quadro(dois(i + 1), 34)}<span style="${F};font-size:15px;font-weight:600;color:${COR.tinta}">${esc(a.nome)}</span>
      <a href="#e-${slug(a.nome)}" style="text-decoration:none;text-align:center;background:${COR.lavandaClara};color:${COR.roxo};border-radius:999px;padding:6px 10px;${F};font-size:11px;font-weight:600;white-space:nowrap">30 questões · p. <span data-pag="e-${slug(a.nome)}"></span></a>
      <a href="#g-${slug(a.nome)}" style="text-decoration:none;text-align:center;background:${DEG_H};color:#fff;border-radius:999px;padding:6px 10px;${F};font-size:11px;font-weight:600;white-space:nowrap">gabaritos · p. <span data-pag="g-${slug(a.nome)}"></span></a></div>`).join('')}
    <div style="margin-top:22px;display:flex;flex-direction:column;gap:9px;${F};font-size:11.5px;color:${COR.tinta}">
      <div>${tag(false)}&nbsp; Questões 01 a 20: tema já cobrado, com situação jurídica alterada ou ponto de cobrança acrescentado.</div>
      <div>${tag(true)}&nbsp; Questões 21 a 30: apostas temáticas para treino prospectivo.</div></div>
    <div style="margin-top:22px;background:${COR.lavandaClara};border-left:4px solid ${COR.indigo};border-radius:0 12px 12px 0;padding:12px 16px;${F};font-size:11.5px;line-height:1.5;color:${COR.tinta}"><b>Fontes.</b> As referências normativas estão no fim do caderno (p. <span data-pag="referencias"></span>), com links para o texto oficial.</div>`, 'Sumário');
}

const divisor = (k, t, texto) => `<section class="pagina" style="background:${DEGRADE};color:#fff">
    ${arcos(-140, 560, 240, 9, 'rgba(201,184,255,.24)')}
    <div style="position:absolute;left:${M + 60}px;right:${M}px;top:50%;transform:translateY(-50%)">
      ${kick(k, COR.lavanda)}
      <div style="${TIT};font-size:72px;line-height:1;margin-top:14px">${t}</div>
      <span style="display:block;width:70px;height:5px;border-radius:3px;background:${COR.lavanda};margin-top:24px"></span>
      <p style="${F};font-size:15px;line-height:1.55;color:#ECE8FF;margin:22px 0 0;max-width:470px">${esc(texto)}</p>
    </div>${rodapeEscuro()}
  </section>`;

// Blocos do fluxo. data-novo: começa página nova; data-cab: texto do cabeçalho; data-id: alvo do sumário.
const abertura = (a, i, parte, id) => `<div class="bloco" data-novo="1" data-cab="${esc(parte)} · ${esc(curto(a.nome))}" data-id="${id}" id="${id}" style="margin-bottom:16px">
  <div style="position:relative;overflow:hidden;background:${DEGRADE};border-radius:16px;padding:18px 22px;color:#fff;display:flex;align-items:center;gap:16px">
    ${arcos(700, -20, 60, 6, 'rgba(201,184,255,.25)')}
    <span style="position:relative;${TIT};font-size:42px;line-height:1;color:${COR.lavanda}">${dois(i + 1)}</span>
    <div style="position:relative">${kick(parte, COR.lavanda)}<div style="${TIT};font-size:24px;line-height:1.1;margin-top:3px">${esc(a.nome)}</div></div>
    <span style="position:relative;margin-left:auto;border:1px solid rgba(201,184,255,.6);border-radius:999px;padding:4px 12px;${F};font-size:11px;font-weight:700">${a.q.length} questões</span></div></div>`;

const questao = (a, q) => `<div class="bloco" data-cab="Parte I · ${esc(curto(a.nome))}" style="border:1px solid ${COR.borda};border-radius:14px;padding:11px 16px 9px;margin-bottom:12px">
  <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:6px;margin-bottom:7px;border-bottom:2px solid ${COR.roxo}">
    <span style="${F};font-size:11px;font-weight:800;letter-spacing:.14em;color:${COR.roxo}">QUESTÃO ${dois(q.n)}</span>
    <span style="${F};font-size:9.5px;font-weight:600;color:#fff;background:${DEG_H};border-radius:999px;padding:2px 10px">1,25 ponto</span></div>
  ${q.enun.map(t => `<p style="${F};font-size:11.6px;line-height:1.55;color:${COR.tinta};margin:0 0 7px;text-align:justify">${esc(t)}</p>`).join('')}
  ${q.itens.map(([l, t, v]) => `<div style="display:flex;gap:10px;margin:0 0 5px;padding:6px 11px;background:${COR.lavandaClara};border-radius:10px">${quadro(l, 22)}<div style="${F};font-size:11.4px;line-height:1.5;color:${COR.tinta}">${esc(t)} <span style="color:${COR.indigo};font-weight:700;white-space:nowrap">(${v})</span></div></div>`).join('')}
  <div style="${F};font-size:9.6px;font-style:italic;color:${COR.cinza};margin-top:5px">Responda de forma fundamentada, aplicando o direito aos fatos narrados.</div></div>`;

const gabarito = (a, q) => {
  const aposta = q.tag.startsWith('APOSTA');
  return `<div class="bloco" data-cab="Parte II · ${esc(curto(a.nome))}" style="padding:0 0 12px;margin-bottom:12px;border-bottom:1.5px dashed ${COR.borda}">
  <div style="display:grid;grid-template-columns:auto 1fr;gap:12px;align-items:start">
    <span style="${TIT};font-size:30px;line-height:1;color:transparent;-webkit-text-stroke:1.3px ${COR.indigo}">${dois(q.n)}</span>
    <div>${tag(aposta, true)}<div style="${F};font-size:14.5px;font-weight:700;line-height:1.3;color:${COR.tinta};margin-top:4px">${esc(q.titulo)}</div>
      <div style="${F};font-size:10.4px;line-height:1.45;color:${COR.cinza};margin-top:3px">${esc(q.ref)}</div></div></div>
  ${['A', 'B'].map(l => `<div style="display:grid;grid-template-columns:24px 1fr;gap:10px;margin-top:8px">${quadro(l, 22)}<div>
    <div style="${F};font-size:11.6px;line-height:1.5;color:${COR.tinta}">${esc(q.resp[l])}</div>
    <div style="margin-top:4px;background:${COR.lavandaClara};border-radius:8px;padding:5px 10px;${F};font-size:10.6px;color:${COR.tinta}"><span style="font-size:8.5px;font-weight:700;letter-spacing:.14em;color:${COR.indigo};margin-right:8px">FUNDAMENTO</span>${esc(q.fund[l])}</div></div></div>`).join('')}
  <div style="display:flex;flex-wrap:wrap;align-items:center;gap:4px 14px;margin:9px 0 0 34px;border:1px solid ${COR.borda};border-radius:10px;padding:6px 12px;${F};font-size:10.2px;color:${COR.cinza}">
    <span style="font-size:8.5px;font-weight:700;letter-spacing:.16em;color:${COR.roxo}">ESPELHO</span>
    ${q.esp.map(([l, c, f, t]) => `<span><b style="color:${COR.tinta}">${l}</b> conteúdo ${c} + fundamento ${f} = <b style="color:${COR.tinta}">${t}</b></span>`).join('')}
    <span style="margin-left:auto;background:${COR.roxo};color:#fff;border-radius:999px;padding:1px 10px;font-weight:700">Total 1,25</span></div></div>`;
};

const referencias = (p, D) => `<div class="bloco" data-novo="1" data-cab="Referências" data-id="referencias" id="referencias">
  ${titulo('Fontes · consulta', 'Referências para conferência')}${par(p.refsIntro, 11.5)}
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px">${D.refs.map(([u, t]) => `<a href="${esc(u)}" style="display:block;text-decoration:none;border:1px solid ${COR.borda};border-radius:10px;padding:7px 11px"><div style="${F};font-size:11.2px;font-weight:600;line-height:1.35;color:${COR.tinta}">${esc(t)}</div><div style="${F};font-size:8.6px;color:${COR.indigo};margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(u.replace(/^https:\/\/(www\.)?/, ''))}</div></a>`).join('')}</div></div>`;

function fim(p) {
  const f = p.fim || {};
  return `<section class="pagina" style="background:${DEGRADE};color:#fff">
    ${arcos(W + 120, 560, 240, 9, 'rgba(201,184,255,.24)')}
    <div style="position:absolute;left:${M}px;right:${M}px;top:50%;transform:translateY(-50%);text-align:center">
      ${kick('Método VDE', COR.lavanda)}
      <div style="${TIT};font-size:64px;line-height:1.05;margin-top:16px">${lista(f.titulo).map(l => rico(l, true)).join('<br>')}</div>
      <span style="display:block;width:70px;height:5px;border-radius:3px;background:${COR.lavanda};margin:26px auto 0"></span>
      ${f.texto ? `<p style="${F};font-size:15px;line-height:1.55;color:#ECE8FF;margin:22px auto 0;max-width:470px">${rico(f.texto, true)}</p>` : ''}
    </div>
    <div style="position:absolute;left:${M}px;right:${M}px;bottom:52px;text-align:center;${F};font-size:13px;font-weight:600">${PERFIS}</div>
  </section>`;
}

export function renderQuestoes(p) {
  const D = JSON.parse(fs.readFileSync(path.join(dir, 'questoes', `${p.conteudo}.json`), 'utf8'));
  const avisos = [];
  D.areas.forEach(a => a.q.forEach(q => { if (q.itens.length !== 2 || !q.resp.A || !q.resp.B || !q.fund.A || !q.fund.B) avisos.push(`${a.nome} ${q.n}: questão ou gabarito incompleto`); }));
  const fluxo = (blocos) => `<div class="fluxo">${blocos}</div>`;
  const pags = [
    capa(p, D), comoUsar(p), sumario(p, D),
    divisor('Parte I', 'Caderno do aluno', `${D.areas.reduce((t, a) => t + a.q.length, 0)} casos com itens A e B. Numeração reiniciada em cada área. Resolva antes de consultar a Parte II.`),
    fluxo(D.areas.map((a, i) => abertura(a, i, 'Parte I · Enunciados', `e-${slug(a.nome)}`) + a.q.map(q => questao(a, q)).join('')).join('')),
    divisor('Parte II', 'Gabaritos e espelhos', 'Resposta esperada, fundamento, origem temática e alteração proposta para cada questão.'),
    fluxo(D.areas.map((a, i) => abertura(a, i, 'Parte II · Gabaritos', `g-${slug(a.nome)}`) + a.q.map(q => gabarito(a, q)).join('')).join('') + referencias(p, D)),
    fim(p),
  ];
  const molde = JSON.stringify(branca('', ''));
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet">
<style>@page{size:210mm 297mm;margin:0}*{box-sizing:border-box}body{margin:0;${F};-webkit-font-smoothing:antialiased;-webkit-print-color-adjust:exact;print-color-adjust:exact}
p{margin:0}.pagina{position:relative;width:${W}px;height:${H}px;overflow:hidden;break-after:page}.pagina:last-child{break-after:auto}
.fluxo{position:absolute;left:-9999px;top:0;width:${W - 2 * M}px}</style></head><body>
${pags.join('\n')}
<script>
// Paginação: cada .fluxo vira páginas brancas; um bloco que não cabe vai inteiro para a página seguinte.
document.fonts.ready.then(() => {
  const ALT = ${H} - 72 - 74, tpl = document.createElement('template'); tpl.innerHTML = ${molde};
  const alt = el => { const r = el.getBoundingClientRect(), cs = getComputedStyle(el); return r.height + parseFloat(cs.marginTop) + parseFloat(cs.marginBottom); };
  for (const fl of [...document.querySelectorAll('.fluxo')]) {
    const blocos = [...fl.querySelectorAll(':scope > .bloco')].map(b => [b, alt(b)]);
    let pag = null, usado = 0, ancora = fl;
    const nova = cab => { pag = tpl.content.firstElementChild.cloneNode(true); pag.querySelector('.cab').textContent = cab; ancora.after(pag); ancora = pag; usado = 0; };
    for (const [b, h] of blocos) {
      if (!pag || b.dataset.novo || usado + h > ALT) nova(b.dataset.cab);
      pag.querySelector('.corpo').appendChild(b); usado += h;
      if (usado > ALT + 1) window.__avisos = (window.__avisos || []).concat('bloco maior que a página: ' + b.dataset.cab);
    }
    fl.remove();
  }
  const todas = [...document.querySelectorAll('.pagina')];
  todas.forEach((s, i) => { const n = s.querySelector('.num'); if (n) n.textContent = String(i + 1).padStart(2, '0'); });
  document.querySelectorAll('[data-pag]').forEach(el => { const alvo = document.getElementById(el.dataset.pag); el.textContent = alvo ? String(todas.indexOf(alvo.closest('.pagina')) + 1).padStart(2, '0') : '?'; });
  window.__avisos = (window.__avisos || []).concat(todas.flatMap((s, i) => { const c = s.querySelector('.cabe'); return c && c.scrollHeight > c.clientHeight + 1 ? ['página ' + (i + 1) + ': conteúdo passa do espaço'] : []; }));
  window.__pronto = true;
});
</script></body></html>`;
  return { html, avisos, largura: W, altura: H };
}
