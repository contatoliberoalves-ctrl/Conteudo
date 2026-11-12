// Stories (1080×1920) dos Recursos VDE para a Eduarda, na identidade do Carrossel Eduarda Pop (estilo trend).
// Uso: CHROMIUM_PATH=… RENDER_PROXY=$HTTPS_PROXY node stories_recursos.mjs -> saida/stories-recursos-vde/1..5.png
// A capa usa fotos/story-recursos-topo.png (recorte da foto dela; fora do git).
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const root = path.dirname(new URL(import.meta.url).pathname);
const PAPEL = '#F6F2EE', PINK = '#EE2A8A', CLARO = '#F29AD8', BLUSH = '#FDEAF4', PESS = '#F7B9E0', TINTA = '#2A1020';
const QUAD = `background-color:${PAPEL};background-image:linear-gradient(rgba(0,0,0,.06) 1.5px,transparent 1.5px),linear-gradient(90deg,rgba(0,0,0,.06) 1.5px,transparent 1.5px);background-size:40px 40px`;
const BLUSHQ = `background-color:${BLUSH};background-image:linear-gradient(${CLARO}88 1.5px,transparent 1.5px),linear-gradient(90deg,${CLARO}88 1.5px,transparent 1.5px);background-size:36px 36px`;
const T = "font-family:'Inter Tight','Noto Color Emoji',sans-serif";
const SERIF = "font-family:'Gloock',serif;font-weight:400";
const CUR = "font-family:'Yellowtail',cursive;font-weight:400";
const brilho = (x, y, px, cor, rot = 0) => `<svg style="position:absolute;left:${x}px;top:${y}px;width:${px}px;height:${px}px;transform:rotate(${rot}deg)" viewBox="0 0 100 100"><path d="M50 0 C54 36 64 46 100 50 C64 54 54 64 50 100 C46 64 36 54 0 50 C36 46 46 36 50 0Z" fill="${cor}"/></svg>`;
const arroba = (cor = PINK) => `<div style="position:absolute;left:0;right:0;bottom:120px;display:flex;justify-content:center"><div style="${T};font-weight:600;font-size:28px;color:${cor};border:2px solid ${cor};border-radius:999px;padding:8px 28px">@eduardacaraciolo</div></div>`;
const barras = (n, cor = PINK) => `<div style="position:absolute;top:230px;left:90px;right:90px;display:flex;gap:12px">${[1, 2, 3, 4, 5].map(i => `<span style="flex:1;height:8px;border-radius:4px;background:${cor};opacity:${i <= n ? 1 : .22}"></span>`).join('')}</div>`;
const kicker = (t, bg = '#fff', cor = PINK) => `<div style="align-self:flex-start;background:${bg};color:${cor};border:2.5px dashed ${cor};border-radius:999px;padding:12px 34px;${T};font-weight:800;font-size:30px;letter-spacing:.1em;text-transform:uppercase">${t}</div>`;
const tit = (t, px = 130, cor = PINK) => `<div style="${T};font-weight:900;font-size:${px}px;line-height:.98;letter-spacing:-.045em;text-transform:uppercase;color:${cor}">${t}</div>`;
const hl = t => `<span style="background:${PINK};color:#fff;padding:0 .12em;border-radius:.12em">${t}</span>`;
const corpo = (t, px = 42, cor = TINTA) => `<div style="${T};font-weight:500;font-size:${px}px;line-height:1.32;letter-spacing:-.015em;color:${cor}">${t}</div>`;
const preco = (v, r) => `<div style="display:flex;align-items:center;gap:34px;background:#fff;border:2.5px dashed ${PINK};border-radius:40px;padding:26px 40px"><div style="${SERIF};font-size:118px;line-height:1;color:${PINK};white-space:nowrap">${v}</div><div style="${T};font-weight:700;font-size:38px;line-height:1.2;color:${TINTA}">${r}</div></div>`;
const itens = (arr, cor = TINTA, est = PINK) => `<div style="display:flex;flex-direction:column;gap:24px">${arr.map(t => `<div style="display:flex;gap:22px;align-items:flex-start"><svg width="40" height="40" viewBox="0 0 100 100" style="flex:none;margin-top:6px"><path d="M50 0 C54 36 64 46 100 50 C64 54 54 64 50 100 C46 64 36 54 0 50 C36 46 46 36 50 0Z" fill="${est}"/></svg>${corpo(t, 38, cor)}</div>`).join('')}</div>`;
const area = (html, top = 360, gap = 40) => `<div style="position:absolute;left:90px;right:90px;top:${top}px;display:flex;flex-direction:column;gap:${gap}px">${html}</div>`;
const dm = msgs => `<div style="background:#fff;border-radius:44px;box-shadow:0 20px 50px rgba(180,20,100,.16);padding:30px 30px 34px;display:flex;flex-direction:column;gap:10px;transform:rotate(-1deg)">${msgs.map(m => `<div style="align-self:flex-start;background:#EFEFF2;border-radius:34px;padding:18px 28px;${T};font-size:32px;line-height:1.3;color:#111">${m}</div>`).join('')}</div>`;

const foto = fs.existsSync(path.join(root, 'fotos/story-recursos-topo.png')) ? 'file://' + path.join(root, 'fotos/story-recursos-topo.png') : '';
const S = [
  // 1 · capa com a foto
  `<div style="position:absolute;inset:0;${BLUSHQ}">
    <div style="position:absolute;left:0;right:0;top:0;height:1060px;overflow:hidden;border-radius:0 0 80px 80px">${foto ? `<img src="${foto}" style="width:100%;height:100%;object-fit:cover;object-position:center 30%">` : ''}</div>
    ${barras(1, '#fff')}
    <div style="position:absolute;left:90px;right:90px;top:960px;background:#fff;border-radius:48px;padding:56px 50px 60px;text-align:center;box-shadow:0 24px 60px rgba(180,20,100,.18)">
      <div style="${T};font-weight:800;font-size:28px;letter-spacing:.2em;color:${PINK}">RECURSOS · 2ª FASE OAB</div>
      <div style="${SERIF};font-size:118px;line-height:1.02;color:${PINK};margin-top:26px">Sua correção</div>
      <div style="${CUR};font-size:150px;line-height:.9;color:${PINK}">foi injusta?</div>
      <div style="${T};font-weight:600;font-size:40px;color:${TINTA};margin-top:26px">O Time VDE faz o seu recurso.<br>Aluno VDE ou não 💗</div>
    </div>${brilho(880, 900, 110, PINK, 8)}${brilho(70, 1700, 60, PESS)}${arroba()}</div>`,
  // 2 · 1ª etapa
  `<div style="position:absolute;inset:0;${QUAD}">${barras(2)}${area(
    kicker('1ª etapa') + tit(`Análise de<br>${hl('viabilidade')}`, 118) +
    corpo('A equipe do Método VDE analisa a sua <b>prova completa</b> e te diz se dá pra entrar com recurso.') +
    preco('R$ 120', 'pela análise da<br>prova completa') +
    itens(['Pedidos até <b>12h de 13/11</b>', 'Resposta por <b>e-mail</b> em até <b>24h</b> depois do formulário']), 380, 46)}
    ${brilho(860, 330, 90, PINK, 8)}${arroba()}</div>`,
  // 3 · 2ª etapa
  `<div style="position:absolute;inset:0;background:${PINK}">${barras(3, '#fff')}${area(
    kicker('2ª etapa', PINK, '#fff') + tit(`Elaboração<br>do recurso`, 118, '#fff') +
    corpo('Se houver viabilidade, você pode pedir o recurso redigido pelo Time VDE.', 42, '#fff') +
    preco('R$ 260', 'aluno da turma<br>VDE 47') + preco('R$ 310', 'demais<br>interessados') +
    itens(['Pedidos até <b>18h de 14/11</b>, pelo 2º formulário enviado por e-mail', 'Recurso pronto no seu e-mail até <b>18h de 15/11</b>', 'Você protocola na FGV/OAB até <b>23h59 de 15/11</b>'], '#fff', BLUSH), 360, 34)}
    ${arroba('#fff')}</div>`,
  // 4 · prova social (mensagens reais, sem nome nem foto)
  `<div style="position:absolute;inset:0;${QUAD}">${barras(4)}${area(
    kicker('Deu certo pra elas') + tit(`De 5,40<br>pra ${hl('7,00')}`, 130) +
    dm(['… e realmente!! de 5,40 para 7,00 💗💗 fiquei agoniada esperando, mas valeu a pena demais!']) +
    dm(['Prof!!!! Deu certo o recursoooooooo', 'Eu passei', 'De 4,95 para 6,45 ❤️❤️❤️😭😭']) +
    `<div style="${T};font-weight:600;font-size:26px;letter-spacing:.08em;text-transform:uppercase;color:#999;text-align:center">mensagens de alunas · nome e foto ocultos</div>`, 380, 40)}
    ${brilho(870, 360, 90, PINK, 8)}${arroba()}</div>`,
  // 5 · antes de pedir + espaço do link
  `<div style="position:absolute;inset:0;${BLUSHQ}">${barras(5)}${area(
    kicker('Antes de pedir') + tit(`Leia ${hl('isto')}`, 130) +
    itens(['Tudo é <b>só por e-mail</b>: confira o e-mail do pagamento', '<b>Vagas limitadas</b>, por ordem de chegada dos pedidos pagos', '<b>Pix ou cartão</b>, em até 12x com juros', 'Sem garantia de provimento: <b>não há reembolso</b>']), 360, 36)}
    <div style="position:absolute;left:90px;right:90px;top:1270px;height:340px;background:#fff;border:5px dashed ${PINK};border-radius:48px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;text-align:center">
      <div style="${T};font-weight:800;font-size:30px;letter-spacing:.2em;color:${PINK}">TOCA NO LINK ↓</div>
      <div style="${SERIF};font-size:84px;line-height:1;color:${PINK}">Formulário <span style="${CUR};font-size:1.2em">do recurso</span></div>
      <div style="${T};font-size:26px;color:#999">(espaço da figurinha de link)</div></div>
    ${brilho(880, 1200, 100, PINK, 8)}${arroba()}</div>`,
];

const html = `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700;800;900&family=Gloock&family=Yellowtail&family=Noto+Color+Emoji&display=swap" rel="stylesheet">
<style>*{margin:0;padding:0;box-sizing:border-box}body{background:#ccc}.s{position:relative;width:1080px;height:1920px;overflow:hidden;margin-bottom:20px}b{font-weight:800}</style></head><body>
${S.map(s => `<div class="s">${s}</div>`).join('\n')}</body></html>`;
const out = path.join(root, 'saida', 'stories-recursos-vde');
fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'stories.html'), html);
const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors', '--allow-file-access-from-files'] });
const browser = await chromium.launch(launch);
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.goto('file://' + path.join(out, 'stories.html'), { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(600);
const els = await page.$$('.s');
for (let i = 0; i < els.length; i++) await els[i].screenshot({ path: path.join(out, `${i + 1}.png`) });
await browser.close();
console.log('✓', els.length, 'stories em', out);
