// Núcleo: lê o roteiro já cronometrado (window.ROTEIRO), monta o mundo e desenha
// cada quadro como função pura de t no evento hf-seek do HyperFrames.
import * as THREE from "three";
import { RoomEnvironment } from "../lib/addons/RoomEnvironment.js";
import { Font } from "../lib/addons/FontLoader.js";
import { PERSONAGENS } from "./personagens.js";
import { CENARIOS } from "./cenarios.js";
import { EFEITOS } from "./efeitos.js";
import { clamp, lerp, smooth, ease, mola, ruido, hash, cor } from "./util.js";

const R = window.ROTEIRO;
const W = R.largura, H = R.altura;

const canvas = document.getElementById("cena3d");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true, powerPreference: "high-performance" });
renderer.setPixelRatio(1);
renderer.setSize(W, H, false);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = R.exposicao || 1.05;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const cena = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
cena.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
cena.environmentIntensity = 0.45;

const camera = new THREE.PerspectiveCamera(R.fov || 42, W / H, 0.1, 200);
const fonte = new Font(window.FONTE3D);

// Cenários usados no roteiro (um por nome+opções).
const cenarios = {};
for (const c of R.cenas) {
  const chave = c.cenario + JSON.stringify(c.cenarioOpcoes || {});
  if (!cenarios[chave]) {
    const f = CENARIOS[c.cenario];
    if (!f) throw new Error(`Cenário desconhecido: ${c.cenario}`);
    const cn = f(c.cenarioOpcoes || {});
    cn.grupo.visible = false;
    cena.add(cn.grupo);
    cenarios[chave] = cn;
  }
  c._cenario = cenarios[chave];
}

// Elenco: um objeto por ator, reaproveitado entre cenas.
const elenco = {};
for (const [id, def] of Object.entries(R.elenco)) {
  const f = PERSONAGENS[def.tipo];
  if (!f) throw new Error(`Personagem desconhecido: ${def.tipo}`);
  const a = f(def);
  a.def = def;
  a.corBase = cor(def.cor || "#ffffff");
  a.grupo.visible = false;
  a.grupo.scale.setScalar(def.escala || 1);
  cena.add(a.grupo);
  elenco[id] = a;
}

// Efeitos por cena.
for (const c of R.cenas) {
  c._efeitos = (c.efeitos || []).map((e) => {
    const f = EFEITOS[e.tipo];
    if (!f) throw new Error(`Efeito desconhecido: ${e.tipo}`);
    const ef = f(e, fonte);
    ef.op = e;
    ef.grupo.visible = false;
    cena.add(ef.grupo);
    return ef;
  });
}

const v3 = (a) => new THREE.Vector3(a[0], a.length === 3 ? a[1] : 0, a.length === 3 ? a[2] : a[1]);

function cenaEm(t) {
  for (let i = R.cenas.length - 1; i >= 0; i--) if (t >= R.cenas[i].inicio) return i;
  return 0;
}

function envelope(t) {
  const f = t * R.fps;
  const i = Math.floor(f);
  const a = R.envelope[i] || 0, b = R.envelope[i + 1] || 0;
  return lerp(a, b, f - i);
}

function piscar(t, semente) {
  const periodo = 2.6 + hash(semente, 1) * 1.8;
  const x = (t + hash(semente, 2) * periodo) % periodo;
  return x < 0.16 ? Math.sin((x / 0.16) * Math.PI) : 0;
}

// Posição de base do ator na cena (sem gestos), usada pela câmera.
function basePos(c, a) {
  return v3(a.pos || [0, 0]);
}

function alvoCamera(c, tl) {
  const cam = c.camera || {};
  if (Array.isArray(cam.alvo)) return v3(cam.alvo);
  const id = cam.alvo || (c.atores[0] && c.atores[0].id);
  const a = c.atores.find((x) => x.id === id);
  const p = a ? basePos(c, a) : new THREE.Vector3();
  const altura = elenco[id] ? elenco[id].altura * (elenco[id].def.escala || 1) : 1;
  p.y += altura * (cam.foco ?? 0.85);
  if (a && a.acao && a.acao.includes("nadar")) p.y += 0.4;
  return p;
}

function posicionarCamera(c, tl, t) {
  const cam = c.camera || {};
  const tipo = cam.tipo || "aproximar";
  const p = ease.inOut(clamp(tl / c.dur));
  const po = ease.out(clamp(tl / Math.min(c.dur, 2.2)));
  let d = cam.dist ?? 5.5;
  let h = cam.altura ?? 0.5;
  let ang = ((cam.angulo ?? 0) * Math.PI) / 180;
  let lado = 0;
  const T = alvoCamera(c, tl);
  if (tipo === "aproximar") d = lerp(d * 1.45, d, p);
  else if (tipo === "afastar") { d = lerp(d, d * 1.7, p); h = lerp(h, h + 1.2, p); }
  else if (tipo === "orbitar") ang += lerp(-0.45, 0.45, p);
  else if (tipo === "travelling") lado = lerp(-1.4, 1.4, p);
  else if (tipo === "mergulho") { h = lerp(h + 4.5, h, po); d = lerp(d * 1.5, d, po); }
  else if (tipo === "subida") { h = lerp(h - 0.6, h + 2.2, p); }
  const dir = new THREE.Vector3(Math.sin(ang), 0, Math.cos(ang));
  const dirLado = new THREE.Vector3(Math.cos(ang), 0, -Math.sin(ang));
  camera.position.copy(T).addScaledVector(dir, d).addScaledVector(dirLado, lado);
  camera.position.y = T.y + h;
  // Câmera na mão, bem leve.
  const amp = cam.tremor ?? 0.035;
  camera.position.x += ruido(t * 0.7, 21) * amp;
  camera.position.y += ruido(t * 0.6, 22) * amp;
  const olha = T.clone().addScaledVector(dirLado, lado * 0.35);
  olha.y += ruido(t * 0.5, 23) * amp * 0.5;
  camera.fov = cam.fov || R.fov || 42;
  // Centro óptico mais baixo: o personagem desce e sobra o alto do quadro para o texto.
  camera.setViewOffset(W, H, 0, -H * (R.descer ?? 0.07), W, H);
  camera.updateProjectionMatrix();
  camera.lookAt(olha);
}

function animarAtor(c, ia, tl, t) {
  const a = c.atores[ia];
  const ator = elenco[a.id];
  const acoes = new Set((a.acao || "parado").split("+"));
  const g = ator.grupo;
  const pos = basePos(c, a);
  let andando = false;
  let squash = 0;
  let humor = a.humor || (acoes.has("acenar") || acoes.has("comemorar") ? "feliz" : acoes.has("surpreso") ? "surpreso" : "normal");

  if (acoes.has("entrar")) {
    const lado = a.de === "esquerda" ? -1 : a.de === "cima" ? 0 : 1;
    const k = ease.back(clamp(tl / 0.9));
    if (a.de === "cima") pos.y += (1 - smooth(0, 0.6, tl)) * 6;
    else pos.x += (1 - k) * 6 * lado;
    andando = tl < 0.9;
    squash = a.de === "cima" ? (1 - mola(tl - 0.6, 0.35, 2.4)) * (tl > 0.6 ? 0.25 : 0) : 0;
    if (andando) pos.y += Math.abs(Math.sin(tl * 12)) * 0.08;
  }
  if (acoes.has("pular")) {
    const ciclo = (tl * 1.4) % 1;
    pos.y += Math.sin(ciclo * Math.PI) * 0.55;
    squash = ciclo < 0.12 ? (1 - ciclo / 0.12) * 0.18 : ciclo > 0.9 ? ((ciclo - 0.9) / 0.1) * 0.18 : -0.08;
  }
  if (acoes.has("surpreso")) {
    const s = smooth(0.05, 0.25, tl) * (1 - smooth(0.25, 0.55, tl));
    pos.y += s * 0.35;
    squash -= s * 0.12;
  }
  if (acoes.has("nadar")) {
    pos.y += 0.4 + Math.sin(t * 1.6) * 0.15;
    pos.x += Math.sin(t * 0.7) * 0.15;
  }
  g.position.copy(pos);
  const esc = (ator.def.escala || 1) * (a.escala || 1);
  g.scale.set(esc * (1 + squash * 0.6), esc * (1 - squash), esc * (1 + squash * 0.6));

  // Para onde olha: câmera (padrão) ou outro ator; o corpo vira só parte do caminho.
  let alvo = camera.position;
  if (a.olhar && a.olhar !== "camera") {
    const outro = c.atores.find((x) => x.id === a.olhar);
    if (outro) alvo = basePos(c, outro);
  }
  const yawAlvo = Math.atan2(alvo.x - pos.x, alvo.z - pos.z);
  const yawCam = Math.atan2(camera.position.x - pos.x, camera.position.z - pos.z);
  let yaw = (a.olhar && a.olhar !== "camera" ? lerp(yawCam * 0.6, yawAlvo, 0.4) : yawCam * 0.55) + ((a.giro || 0) * Math.PI) / 180;
  if (acoes.has("girar")) yaw += ease.inOut(smooth(0.2, 1.3, tl)) * Math.PI * 2;
  g.rotation.set(0, yaw, ruido(t * 0.4, ia + 40) * 0.03);
  const olharX = a.olhar && a.olhar !== "camera" ? clamp((yawAlvo - yaw) * 1.2, -1, 1) : 0;

  let corAtual = null;
  if (a.camuflar) {
    const k = smooth(a.camuflarEm ?? 0.8, (a.camuflarEm ?? 0.8) + 0.5, tl);
    corAtual = ator.corBase.clone().lerp(cor(a.camuflar), k);
  }

  const falante = (c.falante ?? R.narrador) === a.id;
  if (falante) acoes.add("falar");
  ator.atualizar({
    t, tl, acoes, humor, andando, olharX,
    boca: falante ? envelope(t) : 0,
    piscar: humor === "feliz" ? 0 : piscar(t, ia * 7 + a.id.length),
    cor: corAtual,
  });
}

// ---------------------------------------------------------------- Camada de texto (HTML)

const elFato = document.getElementById("fato");
const elLegenda = document.getElementById("legenda");
const elSelo = document.getElementById("selo");
const elBarra = document.getElementById("barra");
let ultimoBloco = null;

function atualizarTexto(t, c, tl) {
  // Fato em destaque: entra com mola, fica parado enquanto é lido, sai rápido.
  if (c.texto) {
    const e = c.i === 0 ? 1 : mola(tl - 0.2, 0.5, 1.6);
    const sai = smooth(c.dur - 0.18, c.dur, tl);
    elFato.style.opacity = String(clamp(e * 3) * (1 - sai));
    elFato.style.transform = `translateX(-50%) scale(${(0.6 + 0.4 * e) * (1 - sai * 0.2)}) rotate(${c.textoGiro ?? -2}deg)`;
    if (elFato.dataset.cena !== String(c.i)) {
      elFato.innerHTML = c.texto.replace(/\*(.+?)\*/g, "<em>$1</em>");
      elFato.dataset.cena = String(c.i);
    }
  } else elFato.style.opacity = "0";

  // Selo do topo só na primeira cena (gancho) e na última (chamada).
  const selo = R.cenas[0] === c ? R.selo : c.selo;
  if (selo) {
    const e = c.i === 0 ? 1 : mola(tl - 0.05, 0.5, 1.8);
    elSelo.style.opacity = String(clamp(e * 3) * (1 - smooth(c.dur - 0.15, c.dur, tl)));
    elSelo.style.transform = `translateX(-50%) scale(${0.7 + 0.3 * e})`;
    elSelo.textContent = selo;
  } else elSelo.style.opacity = "0";

  // Legenda palavra a palavra.
  const b = c.blocos.find((x) => tl >= x.a && tl < x.b);
  if (!b) { elLegenda.style.opacity = "0"; ultimoBloco = null; }
  else {
    if (ultimoBloco !== b) {
      elLegenda.innerHTML = b.palavras.map((k) => `<span>${c.palavras[k].w}</span>`).join(" ");
      ultimoBloco = b;
    }
    const e = clamp((tl - b.a) / 0.12);
    elLegenda.style.opacity = "1";
    elLegenda.style.transform = `translateX(-50%) scale(${0.92 + 0.08 * ease.out(e)})`;
    [...elLegenda.children].forEach((s, j) => {
      const p = c.palavras[b.palavras[j]];
      s.className = tl >= p.a && tl < p.b + 0.05 ? "ativa" : tl >= p.b ? "dita" : "";
    });
  }
  elBarra.style.transform = `scaleX(${clamp(t / R.duracao)})`;
}

// ---------------------------------------------------------------- Quadro

function renderAt(t) {
  t = clamp(t, 0, R.duracao - 1 / R.fps);
  const ic = cenaEm(t);
  const c = R.cenas[ic];
  const tl = t - c.inicio;

  for (const cn of Object.values(cenarios)) cn.grupo.visible = cn === c._cenario;
  cena.background = c._cenario.fundo;
  cena.fog = c._cenario.neblina;
  c._cenario.atualizar(t);

  const presentes = new Set(c.atores.map((a) => a.id));
  for (const [id, a] of Object.entries(elenco)) a.grupo.visible = presentes.has(id);

  posicionarCamera(c, tl, t);
  c.atores.forEach((_, i) => animarAtor(c, i, tl, t));

  for (const x of R.cenas) for (const ef of x._efeitos) ef.grupo.visible = x === c;
  for (const ef of c._efeitos) {
    const alvo = elenco[ef.op.alvo] || elenco[c.atores[0].id];
    ef.atualizar({ tl, dur: c.dur, t, alvo, fonte });
  }

  atualizarTexto(t, c, tl);
  renderer.render(cena, camera);
}

R.cenas.forEach((c, i) => { c.i = i; });
window.addEventListener("hf-seek", (e) => renderAt(e.detail.time));
window.__renderAt = renderAt;
renderAt(0);
window.__motorPronto && window.__motorPronto();
