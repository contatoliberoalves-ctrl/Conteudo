// Identidade do perfil dark (Instagram e TikTok): foto de perfil, capas dos destaques e prévia da grade.
//   node identidade/identidade.mjs   → saida/identidade/ (avatar.png, avatar-claro.png, destaques/*.png, grade.png)
// Usa as mesmas cores e fontes dos vídeos (src/theme.ts, public/fonts). A grade usa saida/<id>/capa.jpg dos vídeos mais novos.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require("playwright"); } catch { playwright = require("/opt/node-tools/node_modules/playwright"); }

const AQUI = path.dirname(new URL(import.meta.url).pathname);
const MOLDE = path.join(AQUI, "..");
const OUT = path.join(MOLDE, "saida", "identidade");
const cfg = JSON.parse(fs.readFileSync(path.join(MOLDE, "config.json"), "utf8"));
const ID = JSON.parse(fs.readFileSync(path.join(AQUI, "identidade.json"), "utf8"));
fs.mkdirSync(path.join(OUT, "destaques"), { recursive: true });

const COR = { fundo: "#0f0e0c", fundo2: "#1a1814", papel: "#e9dfc8", texto: "#efe6d2", apagado: "#8f8676", linha: "#3a352d", lacre: "#c2453a" };
const fonte = (arq) => `data:font/ttf;base64,${fs.readFileSync(path.join(MOLDE, "public/fonts", arq)).toString("base64")}`;
const FONTES = `
@font-face{font-family:'Old Standard TT';font-weight:700;src:url(${fonte("OldStandardTT-700.ttf")})}
@font-face{font-family:'Old Standard TT';font-weight:400;src:url(${fonte("OldStandardTT-400.ttf")})}
@font-face{font-family:'Plex Cond';font-weight:700;src:url(${fonte("IBMPlexSansCondensed-700.ttf")})}
@font-face{font-family:'Plex Cond';font-weight:600;src:url(${fonte("IBMPlexSansCondensed-600.ttf")})}
@font-face{font-family:'Plex Sans';font-weight:500;src:url(${fonte("IBMPlexSans-500.ttf")})}
@font-face{font-family:'Plex Mono';font-weight:600;src:url(${fonte("IBMPlexMono-600.ttf")})}
@font-face{font-family:'Plex Mono';font-weight:500;src:url(${fonte("IBMPlexMono-500.ttf")})}`;
const GRAO = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")`;
const base = (w, h, corpo, fundo = COR.fundo) => `<!doctype html><html><head><meta charset="utf8"><style>${FONTES}
*{box-sizing:border-box;margin:0;padding:0}
body{width:${w}px;height:${h}px;background:${fundo};overflow:hidden;position:relative}
.grao{position:absolute;inset:0;background-image:${GRAO};background-size:240px;opacity:.10;mix-blend-mode:overlay;pointer-events:none}
.luz{position:absolute;inset:0;background:radial-gradient(circle at 50% 42%, ${COR.fundo2} 0%, transparent 62%)}
.vinheta{position:absolute;inset:0;background:radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.55) 100%);pointer-events:none}
</style></head><body>${corpo}</body></html>`;

// Carimbo de lacre: anel duplo, nome em volta e § no centro
const carimbo = (tam, { tinta = COR.lacre, centro = COR.papel, texto = ID.nome } = {}) => {
  const r = 500, txt = `${texto.toUpperCase()} · `.repeat(2);
  return `<svg width="${tam}" height="${tam}" viewBox="0 0 1000 1000" style="display:block">
  <defs><path id="volta" d="M500,500 m-372,0 a372,372 0 1,1 744,0 a372,372 0 1,1 -744,0"/></defs>
  <circle cx="500" cy="500" r="${r - 24}" fill="none" stroke="${tinta}" stroke-width="26"/>
  <circle cx="500" cy="500" r="${r - 158}" fill="none" stroke="${tinta}" stroke-width="7"/>
  <text font-family="Plex Mono" font-weight="600" font-size="64" letter-spacing="9" fill="${tinta}">
    <textPath href="#volta" startOffset="0" textLength="2300" lengthAdjust="spacing">${txt}</textPath></text>
  <text x="500" y="655" text-anchor="middle" font-family="Old Standard TT" font-weight="700" font-size="470" fill="${centro}">§</text>
</svg>`;
};

// Ícones dos destaques (traço de papel, um detalhe em lacre), viewBox 0 0 100 100
const ICONES = {
  comece: `<path d="M30 12 H62 L74 24 V88 H30 Z" /><path d="M62 12 V24 H74" /><path d="M38 40 H66 M38 52 H66 M38 64 H56" /><circle cx="64" cy="76" r="6" class="l" />`,
  imperio: `<path d="M20 70 L16 34 L34 50 L50 24 L66 50 L84 34 L80 70 Z" /><path d="M20 80 H80" /><circle cx="50" cy="24" r="4.5" class="l" />`,
  golpes: `<rect x="26" y="46" width="48" height="40" rx="3" /><path d="M36 46 V34 A14 14 0 0 1 64 34 V46" /><circle cx="50" cy="62" r="5" class="l" /><path d="M50 66 V75" class="ls" />`,
  urna: `<path d="M40 44 V18 H60 V44" /><path d="M45 25 L55 35 M55 25 L45 35" class="ls" /><rect x="22" y="44" width="56" height="40" rx="2" /><path d="M36 44 H64" />`,
  stf: `<path d="M14 34 L50 14 L86 34 Z" /><path d="M26 40 V76 M42 40 V76 M58 40 V76 M74 40 V76" /><path d="M18 80 H82 M14 87 H86" /><circle cx="50" cy="27" r="3.5" class="l" />`,
  casos: `<path d="M50 20 V82" /><path d="M36 86 H64" /><path d="M22 30 H78" /><path d="M22 30 L12 54 H32 Z M78 30 L68 54 H88 Z" /><circle cx="50" cy="18" r="4.5" class="l" />`,
};
const icone = (nome, tam) => `<svg width="${tam}" height="${tam}" viewBox="0 0 100 100" style="display:block;overflow:visible">
  <style>path,rect,circle{fill:none;stroke:${COR.papel};stroke-width:3.6;stroke-linejoin:round;stroke-linecap:round}.l{fill:${COR.lacre};stroke:none}.ls{stroke:${COR.lacre}}</style>${ICONES[nome]}</svg>`;

const browser = await playwright.chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ deviceScaleFactor: 1 });
async function foto(html, w, h, arq, tipo = "png") {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(OUT, arq), type: tipo, ...(tipo === "jpeg" ? { quality: 90 } : {}) });
  console.log("✓", arq);
}

// 1. Foto de perfil (o Instagram corta em círculo: o carimbo fica dentro dele)
await foto(base(1080, 1080, `<div class="luz"></div><div style="position:absolute;inset:0;display:grid;place-items:center">
  <div style="transform:rotate(-8deg)">${carimbo(860)}</div></div><div class="grao"></div><div class="vinheta"></div>`), 1080, 1080, "avatar.png");
// Variante clara (papel), para fundos escuros ou capa de canal
await foto(base(1080, 1080, `<div style="position:absolute;inset:0;display:grid;place-items:center">
  <div style="transform:rotate(-8deg)">${carimbo(860, { centro: COR.fundo })}</div></div><div class="grao" style="mix-blend-mode:multiply;opacity:.18"></div>`, COR.papel), 1080, 1080, "avatar-claro.png");

// 2. Capas dos destaques (1080×1920; o Instagram mostra o centro em círculo)
for (const [i, d] of ID.destaques.entries()) {
  await foto(base(1080, 1920, `<div class="luz"></div>
    <div style="position:absolute;left:0;right:0;top:420px;height:1080px;display:grid;place-items:center">
      <div style="width:820px;height:820px;border-radius:50%;border:6px solid ${COR.linha};display:grid;place-items:center">${icone(d.icone, 470)}</div></div>
    <div class="grao"></div><div class="vinheta"></div>`), 1080, 1920, `destaques/${String(i + 1).padStart(2, "0")}-${d.icone}.png`);
}

// 3. YouTube: banner do canal (2560×1440; a faixa segura de 1546×423 no centro aparece em todas as telas) e marca d'água (150×150, fundo transparente)
const SEG = { x: (2560 - 1546) / 2, y: (1440 - 423) / 2, w: 1546, h: 423 };
await foto(base(2560, 1440, `<div class="luz" style="background:radial-gradient(ellipse at 50% 50%, ${COR.fundo2} 0%, transparent 60%)"></div>
  <div style="position:absolute;inset:0;background-image:repeating-linear-gradient(0deg, transparent 0 79px, ${COR.linha}55 79px 80px);opacity:.6"></div>
  <div style="position:absolute;right:-120px;top:-200px;font-family:'Old Standard TT';font-weight:700;font-size:1700px;line-height:1;color:${COR.papel};opacity:.035">§</div>
  <div style="position:absolute;left:${SEG.x}px;top:${SEG.y}px;width:${SEG.w}px;height:${SEG.h}px;display:flex;align-items:center;gap:70px;padding:0 40px">
    <div style="transform:rotate(-8deg);flex:none">${carimbo(330)}</div>
    <div style="display:flex;flex-direction:column;gap:22px">
      <div style="font-family:'Plex Cond';font-weight:700;font-size:118px;line-height:.95;color:${COR.texto};text-transform:uppercase;letter-spacing:-1px">${ID.nome}</div>
      <div style="height:5px;width:180px;background:${COR.lacre}"></div>
      <div style="font-family:'Plex Mono';font-weight:500;font-size:34px;letter-spacing:5px;color:${COR.apagado};text-transform:uppercase">${ID.youtube.slogan}</div>
    </div></div>
  <div class="grao"></div><div class="vinheta"></div>`), 2560, 1440, "youtube-banner.png");
// Prévia da faixa segura (o que aparece no celular)
await foto(base(2560, 1440, `<img src="data:image/png;base64,${fs.readFileSync(path.join(OUT, "youtube-banner.png")).toString("base64")}" style="position:absolute;inset:0">
  <div style="position:absolute;left:${SEG.x}px;top:${SEG.y}px;width:${SEG.w}px;height:${SEG.h}px;outline:6px dashed ${COR.lacre}"></div>`), 2560, 1440, "youtube-banner-area-segura.png");
await page.setViewportSize({ width: 150, height: 150 });
await page.setContent(`<!doctype html><html><head><meta charset="utf8"><style>${FONTES}*{margin:0}body{width:150px;height:150px;background:transparent}</style></head><body>${carimbo(150)}</body></html>`, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: path.join(OUT, "youtube-marca-dagua.png"), omitBackground: true });
console.log("✓ youtube-marca-dagua.png");

// 4. Prévia do perfil: topo, bio, destaques e a grade 3:4 com as capas mais novas
const dados = JSON.parse(fs.readFileSync(path.join(MOLDE, "dados.json"), "utf8"));
const capas = dados.slice().reverse().map((d) => path.join(MOLDE, "saida", d.id, "capa.jpg")).filter((p) => fs.existsSync(p)).slice(0, 9);
const b64 = (p) => `data:image/jpeg;base64,${fs.readFileSync(p).toString("base64")}`;
const avatarSrc = `data:image/png;base64,${fs.readFileSync(path.join(OUT, "avatar.png")).toString("base64")}`;
const bio = ID.bios[0].texto.split("\n").map((l) => `<div>${l}</div>`).join("");
const grade = capas.map((p) => `<div style="aspect-ratio:3/4;background:url(${b64(p)}) center/cover"></div>`).join("");
const destaquesHtml = ID.destaques.map((d) => `<div style="display:flex;flex-direction:column;align-items:center;gap:14px;width:150px">
  <div style="width:132px;height:132px;border-radius:50%;border:3px solid ${COR.linha};padding:6px"><div style="width:100%;height:100%;border-radius:50%;background:${COR.fundo2};display:grid;place-items:center">${icone(d.icone, 70)}</div></div>
  <div style="font-family:'Plex Sans';font-weight:500;font-size:24px;color:${COR.texto};white-space:nowrap">${d.rotulo}</div></div>`).join("");
const linhas = Math.ceil(capas.length / 3);
const H = 760 + linhas * 484;
await foto(base(1080, H, `
  <div style="padding:60px 48px 0;display:flex;flex-direction:column;gap:34px;font-family:'Plex Sans';color:${COR.texto}">
    <div style="font-family:'Plex Mono';font-weight:600;font-size:34px;letter-spacing:1px">${ID.arroba}</div>
    <div style="display:flex;align-items:center;gap:44px">
      <img src="${avatarSrc}" style="width:200px;height:200px;border-radius:50%">
      <div style="display:flex;flex-direction:column;gap:6px">
        <div style="font-family:'Plex Cond';font-weight:700;font-size:44px">${ID.nome}</div>
        <div style="font-size:26px;color:${COR.apagado}">${ID.categoria}</div></div></div>
    <div style="font-size:28px;line-height:1.45">${bio}</div>
    <div style="display:flex;gap:12px">${destaquesHtml}</div>
  </div>
  <div style="position:absolute;left:0;right:0;top:760px;display:grid;grid-template-columns:repeat(3,1fr);gap:4px">${grade}</div>`), 1080, H, "grade.png");

await browser.close();
