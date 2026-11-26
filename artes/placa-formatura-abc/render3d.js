// Serve a pasta atual + o three do repositório, abre flores3d.html e grava cada sprite (PNG com transparência).
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const THREE_DIR = "/home/user/Conteudo/moldes/curiosidades-3d/node_modules/three";
const TIPOS = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".png": "image/png", ".jpg": "image/jpeg", ".json": "application/json" };
const srv = http.createServer((req, res) => {
  const u = decodeURIComponent(req.url.split("?")[0]);
  const f = u.startsWith("/three/") ? path.join(THREE_DIR, u.slice(7)) : path.join(process.cwd(), u);
  fs.readFile(f, (e, d) => {
    if (e) { res.writeHead(404); res.end("404"); return; }
    res.writeHead(200, { "content-type": TIPOS[path.extname(f)] || "application/octet-stream" }); res.end(d);
  });
});
srv.listen(0, async () => {
  const porta = srv.address().port;
  const b = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--enable-webgl"] });
  const p = await b.newPage({ viewport: { width: 1200, height: 1200 } });
  p.on("console", (m) => console.log("[pagina]", m.text()));
  p.on("pageerror", (e) => console.log("[erro]", e.message));
  await p.goto(`http://localhost:${porta}/${process.argv[2] || "flores3d.html"}`);
  await p.waitForFunction("window.__pronto === true", null, { timeout: 180000 });
  const sprites = await p.evaluate(() => Object.fromEntries(Object.entries(window.__sprites).map(([k, c]) => [k, c.toDataURL("image/png")])));
  fs.mkdirSync("blocos", { recursive: true });
  for (const [nome, url] of Object.entries(sprites)) {
    fs.writeFileSync(`blocos/${nome}.png`, Buffer.from(url.split(",")[1], "base64"));
    console.log("gravado", `blocos/${nome}.png`);
  }
  await b.close(); srv.close();
});
