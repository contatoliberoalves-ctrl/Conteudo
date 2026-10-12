// Identidade "Brasa" do curso Interpretação Bíblica (Renato Torres): logos (PNG sem fundo), peças em tamanho
// real (redes, aula, YouTube, cabeçalhos de e-mail), pranchas 1920×1080 e o manual em PDF.
// Uso: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node brasa.mjs
// Precisa de assets/simbolo.png (máscara do V, fora do git).
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const root = path.dirname(new URL(import.meta.url).pathname);
const { chromium } = createRequire(path.join(root, '../../moldes/treino-de-pecas/package.json'))('playwright');
const OUT = path.join(root, 'saida', 'brasa');
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'logos'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'pecas'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'pranchas'), { recursive: true });

const SIMB = 'data:image/png;base64,' + fs.readFileSync(path.join(root, 'assets/simbolo.png')).toString('base64');
const C = { brasa: '#FF4D00', laranja: '#FF8A00', creme: '#FFF4E8', carvao: '#2B0E00', branco: '#FFFFFF' };
const G = `linear-gradient(90deg,${C.brasa} 0%,${C.laranja} 100%)`;
const T = "font-family:'Bricolage Grotesque',sans-serif;font-weight:800;letter-spacing:-.035em;text-transform:uppercase";
const HEAD = `<meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"><style>*{box-sizing:border-box;margin:0}body{font-family:Inter,sans-serif;-webkit-font-smoothing:antialiased}</style>`;

const sim = (cor, px, extra = '') => `<span style="display:block;width:${px}px;height:${px}px;background:${cor};-webkit-mask:url(${SIMB}) center/contain no-repeat;mask:url(${SIMB}) center/contain no-repeat;${extra}"></span>`;
// Símbolo-assinatura: no canto inferior direito, maior que antes, mas ainda discreto.
const canto = (cor, px, m) => sim(cor, px, `position:absolute;right:${m}px;bottom:${m}px;z-index:4`);
// Marca-d'água bem suave (o V gigante saindo pelo canto inferior direito).
const agua = (px, dx, dy, cor = 'rgba(255,255,255,.09)') => sim(cor, px, `position:absolute;right:${dx}px;bottom:${dy}px`);
const pill = (txt, px, bg = C.carvao, fg = C.creme) => `<span style="display:inline-block;background:${bg};color:${fg};font-family:Inter;font-weight:700;font-size:${px}px;letter-spacing:.14em;padding:${px * .34}px ${px * .8}px;border-radius:999px;white-space:nowrap">${txt}</span>`;

// Logo principal: INTERPRETAÇÃO / BÍBLICA + selo RENATO TORRES; o símbolo fica no canto inferior direito do bloco.
const logo = (s, { cor = C.branco, pBg = C.carvao, pFg = C.creme, simb = cor, semSimbolo = false } = {}) => `<div style="position:relative;display:inline-flex;flex-direction:column;align-items:flex-start;color:${cor}">
  <div style="${T};font-size:${s}px;line-height:.98">Interpretação<br>Bíblica</div>
  <div style="margin-top:${s * .16}px">${pill('RENATO TORRES', s * .17, pBg, pFg)}</div>
  ${semSimbolo ? '' : sim(simb, s * .55, 'position:absolute;right:0;bottom:0')}</div>`;
// Assinatura horizontal (uma linha).
const logoH = (s, { cor = C.branco, pBg = C.carvao, pFg = C.creme, simb = cor } = {}) => `<div style="display:inline-flex;align-items:flex-end;gap:${s * .35}px;color:${cor}">
  <div style="${T};font-size:${s}px;line-height:.9;white-space:nowrap">Interpretação Bíblica</div>
  <div style="padding-bottom:${s * .06}px">${pill('RENATO TORRES', s * .26, pBg, pFg)}</div>${sim(simb, s * .75, 'margin-left:' + s * .1 + 'px')}</div>`;
// Rodapé das peças: logo pequeno sem símbolo (o símbolo já está no canto).
const assinatura = (s, cor = C.branco, pBg = C.carvao, pFg = C.creme) => logo(s, { cor, pBg, pFg, semSimbolo: true });
const box = (w, h, bg, html) => `<div style="position:relative;width:${w}px;height:${h}px;overflow:hidden;background:${bg}">${html}</div>`;
const destaque = t => `<span style="background:${C.carvao};color:${C.creme};padding:0 .12em;box-decoration-break:clone;-webkit-box-decoration-break:clone">${t}</span>`;
const realce = t => `<span style="background:${G};color:#fff;padding:0 .12em;box-decoration-break:clone;-webkit-box-decoration-break:clone">${t}</span>`;
const VERSO = 'Procura apresentar-te a Deus aprovado, como obreiro que não tem de que se envergonhar, que maneja bem a palavra da verdade.';

// ---------- Peças (tamanho real) ----------
const P = {
  'post-capa': [1080, 1350, box(1080, 1350, G, `${agua(1300, -380, -420)}
    <div style="position:absolute;left:110px;top:120px;font-weight:700;font-size:30px;letter-spacing:.2em;color:#fff">AULA 01</div>
    <div style="position:absolute;left:110px;right:110px;top:300px;font-family:'Bricolage Grotesque';font-weight:800;font-size:132px;line-height:1.02;letter-spacing:-.035em;color:#fff">Ler a Bíblia é simples. ${destaque('Interpretar')} exige método.</div>
    <div style="position:absolute;left:110px;bottom:110px">${assinatura(72)}</div>${canto('#fff', 130, 90)}`)],
  'post-interno': [1080, 1350, box(1080, 1350, C.creme, `${agua(1300, -380, -420, 'rgba(255,77,0,.06)')}
    <div style="position:absolute;left:110px;top:120px;font-weight:700;font-size:30px;letter-spacing:.2em;color:${C.brasa}">PRINCÍPIO 1</div>
    <div style="position:absolute;left:110px;right:110px;top:220px;font-family:'Bricolage Grotesque';font-weight:800;font-size:110px;line-height:1;letter-spacing:-.035em;color:${C.carvao}">Todo texto tem um ${realce('contexto')}</div>
    <div style="position:absolute;left:110px;right:110px;top:600px;display:flex;flex-direction:column;gap:30px">${['Leia o capítulo inteiro, não só o versículo.', 'Pergunte: quem escreveu, e para quem?', 'Veja o que vem antes e o que vem depois.'].map((t, i) => `<div style="display:flex;gap:28px;align-items:baseline;padding-bottom:26px;border-bottom:2px solid rgba(43,14,0,.12)"><span style="font-family:'Bricolage Grotesque';font-weight:800;font-size:40px;color:${C.brasa}">0${i + 1}</span><span style="font-size:44px;font-weight:500;line-height:1.3;color:${C.carvao}">${t}</span></div>`).join('')}</div>
    <div style="position:absolute;left:110px;bottom:110px;font-weight:700;font-size:24px;letter-spacing:.2em;color:${C.carvao};opacity:.6">INTERPRETAÇÃO BÍBLICA</div>${canto(C.brasa, 130, 90)}`)],
  'post-cta': [1080, 1350, box(1080, 1350, C.carvao, `${agua(1300, -380, -420, 'rgba(255,138,0,.08)')}
    <div style="position:absolute;left:110px;right:110px;top:300px;font-family:'Bricolage Grotesque';font-weight:800;font-size:120px;line-height:1.02;letter-spacing:-.035em;color:#fff">Quer aprender o ${realce('método')} completo?</div>
    <div style="position:absolute;left:110px;right:110px;top:760px;font-size:44px;font-weight:500;line-height:1.35;color:${C.creme};opacity:.9">Salve este post e conheça o curso no link da bio.</div>
    <div style="position:absolute;left:110px;top:920px"><span style="display:inline-block;background:${G};color:#fff;font-weight:700;font-size:40px;padding:26px 54px;border-radius:999px">Quero me inscrever</span></div>
    <div style="position:absolute;left:110px;bottom:110px">${assinatura(72, '#fff', C.brasa, '#fff')}</div>${canto(C.laranja, 130, 90)}`)],
  'story': [1080, 1920, box(1080, 1920, G, `${agua(1500, -500, -380)}
    <div style="position:absolute;left:110px;top:300px">${logo(118, { semSimbolo: true })}</div>
    <div style="position:absolute;left:110px;right:110px;top:1000px;font-family:'Bricolage Grotesque';font-weight:700;font-size:62px;line-height:1.2;color:#fff">“${VERSO}”<div style="font-family:Inter;font-weight:700;font-size:30px;letter-spacing:.2em;margin-top:34px;opacity:.85">2 TIMÓTEO 2.15</div></div>
    <div style="position:absolute;left:110px;bottom:200px"><span style="display:inline-block;background:${C.carvao};color:${C.creme};font-weight:700;font-size:44px;padding:30px 60px;border-radius:999px">Inscrições abertas</span></div>${canto('#fff', 140, 100)}`)],
  'story-renovacao': [1080, 1920, box(1080, 1920, C.carvao, `${agua(1500, -500, -380, 'rgba(255,138,0,.08)')}
    <div style="position:absolute;left:110px;top:220px">${pill('INTERPRETAÇÃO BÍBLICA · RENATO TORRES', 26, G, '#fff')}</div>
    <div style="position:absolute;left:110px;right:110px;top:420px;font-family:'Bricolage Grotesque';font-weight:800;font-size:138px;line-height:1;letter-spacing:-.035em;color:#fff;text-transform:uppercase">Renovação com ${realce('valor promocional')}</div>
    <div style="position:absolute;left:110px;right:110px;top:1240px;font-size:50px;font-weight:500;line-height:1.35;color:${C.creme}">Continue estudando a Palavra com método, com condição especial para quem já é aluno.</div>
    <div style="position:absolute;left:110px;bottom:200px"><span style="display:inline-block;background:${G};color:#fff;font-weight:700;font-size:46px;padding:30px 60px;border-radius:999px">Quero renovar</span></div>${canto(C.laranja, 140, 100)}`)],
  'avatar-monograma': [1080, 1080, box(1080, 1080, G, `${agua(1100, -300, -330)}
    <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;${T};font-size:560px;line-height:1;color:#fff;padding-bottom:40px">IB</div>${canto('#fff', 150, 150)}`)],
  'avatar-logo': [1080, 1080, box(1080, 1080, G, `${agua(1100, -300, -330)}
    <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">${logo(118)}</div>`)],
  'slide-capa': [1920, 1080, box(1920, 1080, G, `${agua(1300, -300, -420)}
    <div style="position:absolute;left:150px;top:130px">${pill('MÓDULO 2 · AULA 3', 30)}</div>
    <div style="position:absolute;left:150px;top:280px;width:1400px;font-family:'Bricolage Grotesque';font-weight:800;font-size:170px;line-height:.98;letter-spacing:-.035em;color:#fff;text-transform:uppercase">Contexto histórico e ${destaque('literário')}</div>
    <div style="position:absolute;left:150px;bottom:110px">${assinatura(56)}</div>${canto('#fff', 140, 100)}`)],
  'slide-interno': [1920, 1080, box(1920, 1080, C.creme, `${agua(1300, -300, -420, 'rgba(255,77,0,.06)')}
    <div style="position:absolute;left:150px;top:120px;font-weight:700;font-size:30px;letter-spacing:.2em;color:${C.brasa}">MÓDULO 2 · CONTEXTO</div>
    <div style="position:absolute;left:150px;top:220px;width:980px;font-family:'Bricolage Grotesque';font-weight:800;font-size:110px;line-height:1;letter-spacing:-.035em;color:${C.carvao}">Quem escreveu, para quem e ${realce('por quê?')}</div>
    <div style="position:absolute;left:150px;top:720px;width:900px;font-size:38px;line-height:1.4;color:${C.carvao};opacity:.85">Antes de perguntar “o que isso significa pra mim?”, pergunte o que significou para os primeiros leitores.</div>
    <div style="position:absolute;right:170px;top:200px;width:540px;background:#fff;border-radius:28px;padding:50px;box-shadow:0 20px 50px rgba(43,14,0,.08)">
      <div style="font-weight:700;font-size:26px;letter-spacing:.18em;color:${C.brasa}">PERGUNTAS DO TEXTO</div>
      ${['Autor', 'Destinatários', 'Época e lugar', 'Gênero literário', 'Propósito'].map((q, i) => `<div style="display:flex;gap:20px;align-items:baseline;font-size:36px;font-weight:500;color:${C.carvao};padding:18px 0;border-bottom:2px solid rgba(43,14,0,.1)"><span style="font-family:'Bricolage Grotesque';font-weight:800;font-size:28px;color:${C.brasa}">0${i + 1}</span>${q}</div>`).join('')}</div>
    <div style="position:absolute;left:150px;bottom:90px;font-weight:700;font-size:24px;letter-spacing:.2em;color:${C.carvao};opacity:.6">INTERPRETAÇÃO BÍBLICA · RENATO TORRES</div>${canto(C.brasa, 110, 80)}`)],
  'thumb-youtube': [1280, 720, box(1280, 720, G, `${agua(900, -220, -300)}
    <div style="position:absolute;left:80px;top:80px">${pill('AULA 05', 30)}</div>
    <div style="position:absolute;left:80px;top:190px;width:1140px;${T};font-size:116px;line-height:.98;color:#fff">Como interpretar ${destaque('parábolas')}</div>
    <div style="position:absolute;left:80px;bottom:60px;font-weight:700;font-size:26px;letter-spacing:.16em;color:#fff">INTERPRETAÇÃO BÍBLICA · RENATO TORRES</div>${canto('#fff', 110, 56)}`)],
  // Cabeçalhos de e-mail em 1200 px de largura (aparecem com 600 px no e-mail, nítidos em telas retina).
  'email-1-degrade': [1200, 400, box(1200, 400, G, `${agua(760, -170, -300)}
    <div style="position:absolute;left:70px;top:58px;font-weight:700;font-size:20px;letter-spacing:.2em;color:#fff">INTERPRETAÇÃO BÍBLICA <span style="opacity:.75">· RENATO TORRES</span></div>
    <div style="position:absolute;left:70px;top:110px;width:960px;${T};font-size:96px;line-height:.98;color:#fff">Renovação com ${destaque('valor promocional')}</div>${canto('#fff', 84, 44)}`)],
  'email-2-creme': [1200, 400, box(1200, 400, C.creme, `${agua(760, -170, -300, 'rgba(255,77,0,.07)')}
    <div style="position:absolute;left:70px;top:58px">${pill('INTERPRETAÇÃO BÍBLICA · RENATO TORRES', 18, G, '#fff')}</div>
    <div style="position:absolute;left:70px;top:122px;width:980px;${T};font-size:96px;line-height:.98;color:${C.carvao}">Renovação com ${realce('valor promocional')}</div>${canto(C.brasa, 84, 44)}`)],
  'email-3-completo': [1200, 640, box(1200, 640, C.carvao, `${agua(900, -200, -330, 'rgba(255,138,0,.08)')}
    <div style="position:absolute;left:0;right:0;top:0;height:14px;background:${G}"></div>
    <div style="position:absolute;left:80px;top:80px">${logoH(40, { simb: C.laranja, pBg: C.brasa, pFg: '#fff' })}</div>
    <div style="position:absolute;left:80px;top:170px;width:960px;${T};font-size:96px;line-height:.98;color:#fff">Renovação com ${realce('valor promocional')}</div>
    <div style="position:absolute;left:80px;top:400px;width:800px;font-size:30px;font-weight:500;line-height:1.4;color:${C.creme};opacity:.9">Continue sua jornada no curso com uma condição especial para quem já é aluno.</div>
    <div style="position:absolute;left:80px;bottom:56px"><span style="display:inline-block;background:${G};color:#fff;font-weight:700;font-size:30px;padding:20px 44px;border-radius:999px">Renovar agora</span></div>${canto(C.laranja, 90, 50)}`)],
};

// ---------- Logos (PNG sem fundo) ----------
const L = {
  'logo-branco': logo(200), 'logo-carvao': logo(200, { cor: C.carvao, pBg: C.brasa, pFg: '#fff', simb: C.brasa }),
  'logo-laranja': logo(200, { cor: C.brasa, simb: C.brasa }),
  'logo-horizontal-branco': logoH(110), 'logo-horizontal-carvao': logoH(110, { cor: C.carvao, pBg: C.brasa, pFg: '#fff', simb: C.brasa }),
  'simbolo-branco': sim('#fff', 800), 'simbolo-laranja': sim(G, 800), 'simbolo-carvao': sim(C.carvao, 800),
};

const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
const pronto = async () => { await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(250); };

for (const [nome, [w, h, html]] of Object.entries(P)) {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(`<!doctype html><html><head>${HEAD}</head><body>${html}</body></html>`); await pronto();
  await page.screenshot({ path: path.join(OUT, 'pecas', `${nome}.png`) });
}
for (const [nome, html] of Object.entries(L)) {
  await page.setViewportSize({ width: 2400, height: 1200 });
  await page.setContent(`<!doctype html><html><head>${HEAD}<style>body{background:transparent}</style></head><body><div id="l" style="display:inline-block;padding:40px">${html}</div></body></html>`); await pronto();
  await page.locator('#l').screenshot({ path: path.join(OUT, 'logos', `${nome}.png`), omitBackground: true });
}

// ---------- Pranchas ----------
const img = (dir, n, w, extra = '') => `<img src="file://${path.join(OUT, dir, n + '.png')}" style="display:block;width:${w}px;border-radius:12px;box-shadow:0 14px 34px rgba(43,14,0,.16);${extra}">`;
const cab = (n, t, sub) => `<div style="font-weight:700;font-size:20px;letter-spacing:.24em;color:${C.brasa}">${n}</div><div style="${T};font-size:64px;line-height:1;color:${C.carvao};margin-top:6px">${t}</div>${sub ? `<p style="font-size:20px;line-height:1.45;color:#5a4a40;margin-top:10px;max-width:1100px">${sub}</p>` : ''}`;
const prancha = corpo => `<section style="position:relative;width:1920px;height:1080px;overflow:hidden;background:#F6F2EC;padding:60px 70px;break-after:page">${corpo}
  <div style="position:absolute;right:70px;bottom:40px;display:flex;align-items:center;gap:14px;font-weight:600;font-size:16px;letter-spacing:.16em;color:#9a8a80">INTERPRETAÇÃO BÍBLICA · IDENTIDADE VISUAL ${sim(C.brasa, 30)}</div></section>`;
const tile = (bg, html, w, h, rot = '') => `<div style="width:${w}px;height:${h}px;border-radius:16px;background:${bg};display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;${rot}">${html}</div>`;
const PR = [
  prancha(`${cab('01', 'Logo e variações', 'O logo é tipográfico: INTERPRETAÇÃO BÍBLICA em caixa alta pesada, o selo RENATO TORRES e o símbolo assinando no canto inferior direito. Use a versão branca sobre o degradê ou o carvão, a carvão sobre o creme e a laranja sobre o branco.')}
    <div style="display:grid;grid-template-columns:repeat(3,580px);gap:20px;margin-top:26px">
      ${tile(G, logo(66), 580, 290)}${tile(C.creme, logo(66, { cor: C.carvao, pBg: C.brasa, pFg: '#fff', simb: C.brasa }), 580, 290)}${tile(C.carvao, logo(66, { simb: C.laranja, pBg: C.brasa, pFg: '#fff' }), 580, 290)}
      ${tile('#fff', logo(66, { cor: C.brasa, simb: C.brasa }), 580, 290, 'border:1px solid #eadfd5')}${tile(G, logoH(32), 580, 290)}${tile(C.creme, logoH(32, { cor: C.carvao, pBg: C.brasa, pFg: '#fff', simb: C.brasa }), 580, 290)}
    </div>
    <div style="display:flex;gap:20px;margin-top:20px;align-items:center">
      ${img('pecas', 'avatar-monograma', 130)}${img('pecas', 'avatar-logo', 130)}
      <div style="font-size:18px;color:#5a4a40;line-height:1.5;width:300px">Foto de perfil: monograma IB ou o logo inteiro, sempre no degradê.</div>
      ${[['#fff', C.carvao], [G, '#fff'], [C.carvao, C.creme]].map(([c, bg]) => tile(bg, sim(c, 84), 130, 130, 'border:1px solid #eadfd5')).join('')}
      <div style="font-size:18px;color:#5a4a40;line-height:1.5;width:330px">Símbolo: sempre pequeno, no canto inferior direito das peças (cerca de 12% da largura), ou como marca-d’água bem suave.</div>
    </div>`),
  prancha(`${cab('02', 'Cores e tipografia')}
    <div style="display:flex;gap:22px;margin-top:34px">${[['Brasa', C.brasa, '255 77 0', '#fff'], ['Laranja', C.laranja, '255 138 0', '#fff'], ['Creme', C.creme, '255 244 232', C.carvao], ['Carvão', C.carvao, '43 14 0', '#fff'], ['Branco', C.branco, '255 255 255', C.carvao]].map(([n, h, rgb, fg]) => `<div style="flex:1;height:260px;border-radius:16px;background:${h};color:${fg};padding:26px;display:flex;flex-direction:column;justify-content:flex-end;border:1px solid #eadfd5"><div style="${T};font-size:40px">${n}</div><div style="font-size:18px;font-weight:600;margin-top:6px">${h} · RGB ${rgb}</div></div>`).join('')}</div>
    <div style="margin-top:22px;height:90px;border-radius:16px;background:${G};display:flex;align-items:center;justify-content:space-between;padding:0 30px;color:#fff;font-weight:700;font-size:20px;letter-spacing:.1em"><span>DEGRADÊ PRINCIPAL · 90°</span><span>${C.brasa} → ${C.laranja}</span></div>
    <div style="display:flex;gap:60px;margin-top:40px;color:${C.carvao}">
      <div style="flex:1.3"><div style="font-size:18px;font-weight:700;letter-spacing:.2em;color:${C.brasa}">TÍTULOS · BRICOLAGE GROTESQUE 800</div><div style="${T};font-size:110px;line-height:.95;margin-top:10px">Interpretar exige método</div></div>
      <div style="flex:1"><div style="font-size:18px;font-weight:700;letter-spacing:.2em;color:${C.brasa}">SUBTÍTULOS · BRICOLAGE GROTESQUE 700</div><div style="font-family:'Bricolage Grotesque';font-weight:700;font-size:44px;line-height:1.15;margin-top:10px">Todo texto tem um contexto</div>
        <div style="font-size:18px;font-weight:700;letter-spacing:.2em;color:${C.brasa};margin-top:34px">TEXTO · INTER 400–700</div><div style="font-size:24px;line-height:1.5;margin-top:10px">Leia o capítulo inteiro, não só o versículo. Pergunte quem escreveu, para quem e por quê.</div>
        <div style="margin-top:26px;display:flex;gap:16px;align-items:center">${pill('SELO', 18)}<span style="font-size:24px;font-weight:700"><span style="background:${C.carvao};color:${C.creme};padding:0 8px">destaque</span> e <span style="background:${G};color:#fff;padding:0 8px">realce</span></span></div></div>
    </div>`),
  prancha(`${cab('03', 'Redes sociais', 'Capa no degradê, páginas internas no creme e fechamento no carvão. Stories no mesmo ritmo.')}
    <div style="display:flex;gap:22px;margin-top:30px;align-items:flex-start">${img('pecas', 'post-capa', 400)}${img('pecas', 'post-interno', 400)}${img('pecas', 'post-cta', 400)}${img('pecas', 'story', 281)}${img('pecas', 'story-renovacao', 281)}</div>`),
  prancha(`${cab('04', 'Aula e YouTube')}
    <div style="display:grid;grid-template-columns:700px 700px;grid-template-rows:auto auto;grid-auto-flow:column;gap:26px;margin-top:30px">${img('pecas', 'slide-capa', 700)}${img('pecas', 'slide-interno', 700)}${img('pecas', 'thumb-youtube', 700)}
      <div style="font-size:20px;line-height:1.55;color:#5a4a40;padding:20px">Slides 16:9 (1920×1080): capa no degradê com o selo do módulo, conteúdo no creme com o cartão branco.<br><br>Miniatura do YouTube (1280×720): título curto em caixa alta, uma palavra em destaque, selo da aula.</div></div>`),
  prancha(`${cab('05', 'Cabeçalhos de e-mail', 'Renovação com valor promocional. Arquivos em 1200 px de largura: use com 600 px no corpo do e-mail para ficarem nítidos.')}
    <div style="display:grid;grid-template-columns:900px 840px;gap:28px;margin-top:30px;align-items:start">
      <div style="display:flex;flex-direction:column;gap:28px">${img('pecas', 'email-1-degrade', 900)}${img('pecas', 'email-2-creme', 900)}</div>${img('pecas', 'email-3-completo', 840)}</div>`),
];
const docPr = `<!doctype html><html><head>${HEAD}<style>@page{size:1920px 1080px;margin:0}body{width:1920px}</style></head><body>${PR.join('')}</body></html>`;
fs.mkdirSync(path.join(root, 'build'), { recursive: true });
fs.writeFileSync(path.join(root, 'build', 'brasa-pranchas.html'), docPr);
await page.setViewportSize({ width: 1920, height: 1080 });
await page.goto('file://' + path.join(root, 'build', 'brasa-pranchas.html')); await pronto();
await page.evaluate(() => Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => (i.onload = i.onerror = r)))));
const secs = await page.locator('section').all();
for (const [i, s] of secs.entries()) await s.screenshot({ path: path.join(OUT, 'pranchas', `0${i + 1}.png`) });
await page.pdf({ path: path.join(OUT, 'Interpretacao-Biblica-identidade-visual.pdf'), width: '1920px', height: '1080px', printBackground: true });
await browser.close();
console.log('✓', Object.keys(P).length, 'peças,', Object.keys(L).length, 'logos,', secs.length, 'pranchas e o PDF em', path.relative(root, OUT));
