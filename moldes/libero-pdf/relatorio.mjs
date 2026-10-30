// Relatório individual de aluno da mentoria (Libero PDF, A4 retrato): capa com os números do período e o
// diagnóstico, aproveitamento por matéria em barras (linha dos 50% da 1ª fase da OAB), onde focar (prioridades,
// temas e hábitos) e o plano das próximas semanas. Os dados do aluno ficam em relatorios/<id>.json (fora do
// git: o repositório é público). Uso: node relatorio.mjs <id> -> saida/relatorios/<id>/<id>.pdf e <n>.png.
// Nuvem: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node relatorio.mjs <id>
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { COR, FONTES, TITULO, TEXTO, PERFIL, esc, rico, linhas, textura, anel } from '../libero-comum/identidade.mjs';

const W = 794, H = 1122, M = 56;
const root = path.dirname(new URL(import.meta.url).pathname);
const VERDE = '#16A34A', AMARELO = '#E8A200';
const corPct = p => (p < 50 ? COR.vermelho : p < 70 ? AMARELO : VERDE);
const pct = (a, t) => Math.round((100 * a) / t);

const kicker = (t, cor = COR.azul) => `<div style="${TEXTO};font-size:11px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:${cor}">${esc(t)}</div>`;
const titulo = (v, px = 46, cor = COR.navy) => `<div style="${TITULO};font-size:${px}px;line-height:1;color:${cor};margin-top:6px">${linhas(v, COR.azul)}</div>`;
const pe = (r, n) => `<div style="position:absolute;left:${M}px;right:${M}px;bottom:30px;display:flex;justify-content:space-between;${TEXTO};font-size:10.5px;font-weight:700;letter-spacing:.08em;color:#8A93A6"><span>Mentoria com Líbero · relatório de ${esc(r.aluna)}</span><span>${PERFIL} · ${String(n).padStart(2, '0')}</span></div>`;
const pagina = (bg, corpo) => `<section class="pagina" style="background:${bg}">${corpo}</section>`;

function capa(r) {
  const tot = r.materias.reduce((s, m) => s + m.total, 0), ac = r.materias.reduce((s, m) => s + m.acertos, 0);
  const num = (n, rot, sub, cor = '#fff') => `<div style="background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.22);border-radius:14px;padding:16px 16px 14px">
    <div style="${TITULO};font-size:46px;line-height:.9;color:${cor}">${esc(n)}</div>
    <div style="${TEXTO};font-size:12.5px;font-weight:800;color:#fff;margin-top:8px">${esc(rot)}</div>
    <div style="${TEXTO};font-size:11px;font-weight:500;line-height:1.35;color:${COR.off};opacity:.85;margin-top:3px">${esc(sub)}</div></div>`;
  return pagina(`linear-gradient(170deg,${COR.azul} 0%,${COR.azulFundo} 100%)`, `${anel(560, -170, 340, 46)}
    <div style="position:absolute;left:${M}px;top:52px;${TEXTO};font-size:11.5px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:#fff;background:${COR.navyFundo};padding:7px 13px;border-radius:6px;z-index:3">${esc(r.rotulo)}</div>
    <div style="position:absolute;left:${M}px;right:${M + 150}px;top:112px;z-index:3">
      <div style="${TITULO};font-size:84px;line-height:.95;color:#fff">${linhas(r.titulo, COR.navyFundo)}</div>
      <p style="${TEXTO};font-size:15px;font-weight:600;line-height:1.45;color:${COR.off};margin-top:16px">${esc(r.sub)}</p></div>
    <div style="position:absolute;left:${M}px;right:${M}px;top:420px;display:grid;grid-template-columns:repeat(4,1fr);gap:12px;z-index:3">
      ${num(String(tot), 'questões respondidas', `${ac} acertos no período`)}
      ${num(pct(ac, tot) + '%', 'de aproveitamento', 'em todas as matérias')}
      ${num(r.simulado.pct + '%', 'no simulado completo', r.simulado.sub, '#B7F5C8')}
      ${num(r.cronograma.pct + '%', 'do cronograma', r.cronograma.sub, '#FFC2CF')}</div>
    <div style="position:absolute;left:${M}px;right:${M}px;top:600px;background:#fff;border-radius:18px;padding:26px 28px;box-shadow:0 20px 44px rgba(5,20,60,.35);z-index:3">
      ${kicker('Diagnóstico')}
      ${titulo(r.diagnostico.titulo, 40)}
      ${r.diagnostico.texto.map(t => `<p style="${TEXTO};font-size:13.6px;font-weight:500;line-height:1.6;color:${COR.navy};margin-top:12px">${rico(t)}</p>`).join('')}</div>
    <div style="position:absolute;left:${M}px;right:${M}px;bottom:34px;display:flex;justify-content:space-between;${TEXTO};font-size:11px;font-weight:700;letter-spacing:.08em;color:#fff;z-index:3"><span>Por Líbero Filho · ${PERFIL}</span><span>${esc(r.data)}</span></div>
    ${textura(true)}`);
}

function materias(r) {
  const ms = [...r.materias].sort((a, b) => pct(a.acertos, a.total) - pct(b.acertos, b.total) || b.total - a.total);
  const barra = m => { const p = pct(m.acertos, m.total), c = corPct(p);
    return `<div style="display:grid;grid-template-columns:168px 1fr 92px;gap:12px;align-items:center;padding:5.5px 0;border-bottom:1px solid #E6E8EE">
      <span style="${TEXTO};font-size:12.5px;font-weight:700;color:${COR.navy}">${esc(m.nome)}</span>
      <span style="position:relative;height:14px;background:#EDEFF4;border-radius:7px">
        <span style="position:absolute;left:0;top:0;bottom:0;width:${Math.max(p, 1.5)}%;background:${c};border-radius:7px"></span>
        <span style="position:absolute;left:50%;top:-4px;bottom:-4px;width:2px;background:${COR.navy};opacity:.55"></span></span>
      <span style="${TEXTO};font-size:12px;font-weight:600;color:#6B7590;text-align:right;white-space:nowrap"><b style="${TITULO};font-size:20px;color:${c};margin-right:6px">${p}%</b>${m.acertos}/${m.total}</span></div>`; };
  const leg = (c, t) => `<span style="display:inline-flex;align-items:center;gap:6px"><span style="width:12px;height:12px;border-radius:3px;background:${c}"></span>${t}</span>`;
  return pagina(COR.papel, `
    <div style="position:absolute;left:${M}px;right:${M}px;top:52px">
      ${kicker('Por matéria')}${titulo(['Seu aproveitamento', 'em [[cada matéria]]'], 44)}
      <p style="${TEXTO};font-size:12.5px;font-weight:500;line-height:1.5;color:#4A5468;margin-top:10px">Da pior para a melhor. A linha no meio da barra marca os <b>50%</b>, o mínimo para passar na 1ª fase (40 de 80). O número ao lado mostra quantas questões você já fez em cada matéria: com poucas questões, o percentual ainda diz pouco.</p>
      <div style="display:flex;gap:18px;margin-top:10px;${TEXTO};font-size:11px;font-weight:700;color:${COR.navy}">${leg(COR.vermelho, 'abaixo de 50%')}${leg(AMARELO, '50% a 69%')}${leg(VERDE, '70% ou mais')}</div>
      <div style="margin-top:12px;border-top:2px solid ${COR.navy}">${ms.map(barra).join('')}</div></div>
    ${pe(r, 2)}${textura(false)}`);
}

function foco(r) {
  const prio = r.prioridades.map((p, i) => `<div style="display:grid;grid-template-columns:54px 1fr;gap:14px;background:#fff;border:1px solid #E1E4EC;border-left:6px solid ${[COR.vermelho, AMARELO, COR.azul, VERDE][i] || COR.azul};border-radius:12px;padding:13px 16px">
      <span style="${TITULO};font-size:40px;line-height:.9;color:${[COR.vermelho, AMARELO, COR.azul, VERDE][i] || COR.azul}">${esc(p.n)}</span>
      <div><div style="${TEXTO};font-size:10.5px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#6B7590">${esc(p.rotulo)}</div>
        <div style="${TITULO};font-size:24px;line-height:1.05;color:${COR.navy};margin-top:2px">${esc(p.titulo)}</div>
        <p style="${TEXTO};font-size:12.3px;font-weight:500;line-height:1.5;color:#36405A;margin-top:5px">${rico(p.texto)}</p></div></div>`).join('');
  const temas = r.temas.map(t => `<div style="display:flex;justify-content:space-between;gap:10px;padding:6px 0;border-bottom:1px solid #E6E8EE;${TEXTO};font-size:12px;color:${COR.navy}"><span style="font-weight:600">${esc(t.nome)}</span><b style="color:${corPct(pct(t.acertos, t.total))};white-space:nowrap">${t.acertos}/${t.total}</b></div>`).join('');
  return pagina(COR.papel, `
    <div style="position:absolute;left:${M}px;right:${M}px;top:52px">
      ${kicker('Onde focar')}${titulo(['Sua ordem de', '[[prioridades]]'], 44)}
      <div style="display:flex;flex-direction:column;gap:10px;margin-top:18px">${prio}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-top:20px">
        <div>${kicker('Temas para revisar primeiro', COR.vermelho)}<div style="margin-top:6px;border-top:2px solid ${COR.navy}">${temas}</div></div>
        <div>${kicker('Fique de olho')}<p style="${TEXTO};font-size:12.3px;font-weight:500;line-height:1.55;color:#36405A;margin-top:8px">${rico(r.olho)}</p></div></div></div>
    ${pe(r, 3)}${textura(false)}`);
}

function plano(r) {
  const habito = h => `<div style="background:#fff;border:1px solid #E1E4EC;border-radius:12px;padding:14px 16px">
      <div style="display:flex;align-items:baseline;gap:8px"><span style="${TITULO};font-size:34px;line-height:.9;color:${COR.vermelho}">${esc(h.n)}</span><span style="${TEXTO};font-size:11.5px;font-weight:700;color:#6B7590">${esc(h.rot)}</span></div>
      <p style="${TEXTO};font-size:12.3px;font-weight:500;line-height:1.5;color:#36405A;margin-top:6px">${rico(h.texto)}</p></div>`;
  const semana = s => `<div style="display:grid;grid-template-columns:118px 1fr;gap:14px;padding:11px 0;border-bottom:1px solid #E6E8EE">
      <span style="${TITULO};font-size:22px;line-height:1.05;color:${COR.azul}">${esc(s.quando)}</span>
      <ul style="margin:0;padding-left:16px;${TEXTO};font-size:12.3px;font-weight:500;line-height:1.55;color:${COR.navy}">${s.itens.map(i => `<li>${rico(i)}</li>`).join('')}</ul></div>`;
  return pagina(COR.papel, `
    <div style="position:absolute;left:${M}px;right:${M}px;top:52px">
      ${kicker('Rotina')}${titulo(['O que está', 'te [[segurando]]'], 44)}
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:16px">${r.habitos.map(habito).join('')}</div>
      <div style="margin-top:26px">${kicker('Plano')}${titulo(['Suas próximas', '[[4 semanas]]'], 40)}</div>
      <div style="margin-top:10px;border-top:2px solid ${COR.navy}">${r.semanas.map(semana).join('')}</div></div>
    <div style="position:absolute;left:${M}px;right:${M}px;bottom:66px;background:linear-gradient(170deg,${COR.azul} 0%,${COR.azulFundo} 100%);border-radius:16px;padding:20px 24px;overflow:hidden">
      ${anel(560, -60, 170, 26)}
      <div style="position:relative;z-index:2;${TITULO};font-size:26px;line-height:1.05;color:#fff">${esc(r.fecho.titulo)}</div>
      <p style="position:relative;z-index:2;${TEXTO};font-size:12.5px;font-weight:600;line-height:1.5;color:${COR.off};margin-top:6px;max-width:560px">${rico(r.fecho.texto)}</p>${textura(true)}</div>
    ${pe(r, 4)}${textura(false)}`);
}

const id = process.argv[2];
if (!id) { console.error('uso: node relatorio.mjs <id>'); process.exit(1); }
const r = JSON.parse(fs.readFileSync(path.join(root, 'relatorios', `${id}.json`), 'utf8'));
const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet">
<style>*{box-sizing:border-box}body{margin:0;${TEXTO};-webkit-font-smoothing:antialiased}p{margin:0}.pagina{position:relative;width:${W}px;height:${H}px;overflow:hidden}</style></head>
<body>${[capa(r), materias(r), foco(r), plano(r)].join('\n')}</body></html>`;
const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
fs.mkdirSync(path.join(root, 'build'), { recursive: true });
const arq = path.join(root, 'build', `relatorio-${id}.html`);
fs.writeFileSync(arq, html);
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
await page.goto('file://' + arq);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
// Conteúdo que encosta no rodapé de cada página.
const avisos = await page.evaluate(h => [...document.querySelectorAll('.pagina')].flatMap((s, i) => {
  const top = s.getBoundingClientRect().top;
  return [...s.children].some(e => { const b = e.getBoundingClientRect(); return getComputedStyle(e).position === 'absolute' && b.height < h * .95 && b.bottom - top > h - 52 && b.top - top < h - 60; }) ? [`página ${i + 1}: conteúdo encosta no rodapé`] : [];
}), H);
const out = path.join(root, 'saida', 'relatorios', id);
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
const secs = await page.$$('section.pagina');
for (let i = 0; i < secs.length; i++) await secs[i].screenshot({ path: path.join(out, `${i + 1}.png`) });
await page.close();
const pdf = await browser.newPage();
await pdf.setContent(`<style>@page{size:210mm 297mm;margin:0}body{margin:0}img{display:block;width:210mm;height:297mm;break-after:page}img:last-child{break-after:auto}</style>${secs.map((_, i) => `<img src="data:image/png;base64,${fs.readFileSync(path.join(out, `${i + 1}.png`)).toString('base64')}">`).join('')}`);
await pdf.pdf({ path: path.join(out, `${id}.pdf`), width: '210mm', height: '297mm', printBackground: true });
await browser.close();
console.log(avisos.length ? '!' : '✓', id, `(${secs.length} páginas A4 + PDF)`);
avisos.forEach(a => console.log('   ', a));
