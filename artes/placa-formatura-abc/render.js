// node render.js [escala=2] [filtro]  → saida/<nome>.png (fundo transparente onde a arte não pinta)
const { chromium } = require("playwright");
const fs = require("fs");
const escala = +(process.argv[2] || 2), filtro = process.argv[3] || "";
(async () => {
  fs.mkdirSync("saida", { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1181, height: 886 }, deviceScaleFactor: escala });
  p.on("console", (m) => m.type() === "error" && console.log("[pagina]", m.text()));
  for (const arq of fs.readdirSync("html").filter((n) => n.endsWith(".html") && n.includes(filtro)).sort()) {
    await p.goto("file://" + process.cwd() + "/html/" + arq);
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(250);
    await (await p.$("#tela")).screenshot({ path: "saida/" + arq.replace(".html", ".png"), omitBackground: true });
  }
  await b.close();
})();
