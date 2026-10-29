// Personagens montados com primitivas. Cada um devolve
// { grupo, altura, atualizar(ctx) }, onde ctx traz:
//   tl (s desde o início da cena), t (s do vídeo), acoes (Set), boca (0–1, envelope da voz),
//   piscar (0–1), humor ("normal" | "feliz" | "surpreso"), cor (cor de camuflagem ou null).
import * as THREE from "three";
import { garoto } from "./garoto.js";
import { material, cor, lerp, clamp, smooth, ruido, rng, TuboVivo, hash } from "./util.js";

const esfera = (r, seg = 32) => new THREE.SphereGeometry(r, seg, Math.round(seg * 0.75));

function malha(geo, mat, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

// Olho de desenho: branco, pupila, brilho e pálpebra (escala em y).
function olho(raio, { pupila = "redonda", corPupila = "#1b1b1f" } = {}) {
  const g = new THREE.Group();
  const branco = malha(esfera(raio), material("#ffffff", { roughness: 0.25 }));
  g.add(branco);
  const geoP = esfera(raio * 0.55, 24);
  const p = malha(geoP, material(corPupila, { roughness: 0.2 }), 0, 0, raio * 0.62);
  if (pupila === "barra") p.scale.set(1.5, 0.45, 0.5);
  else p.scale.set(1, 1, 0.5);
  g.add(p);
  const brilho = malha(esfera(raio * 0.16, 12), new THREE.MeshBasicMaterial({ color: "#ffffff" }), raio * 0.22, raio * 0.25, raio * 0.92);
  g.add(brilho);
  return { g, pupila: p, brilho };
}

function atualizarOlho(o, raio, ctx, lado) {
  const pisca = ctx.piscar;
  const abertura = ctx.humor === "surpreso" ? 1.18 : ctx.humor === "feliz" ? 0.55 : 1;
  o.g.scale.set(1, Math.max(0.06, abertura * (1 - pisca)), 1);
  // Olhar: pequenos desvios da pupila, com ruído lento.
  const ox = ruido(ctx.t * 0.7, 11) * 0.18 + (ctx.olharX || 0) * 0.35;
  const oy = ruido(ctx.t * 0.6, 12) * 0.12;
  o.pupila.position.set(ox * raio, oy * raio, raio * 0.62);
  o.brilho.position.set(ox * raio + raio * 0.22, oy * raio + raio * 0.25, raio * 0.92);
}

// ---------------------------------------------------------------- Guia (mascote)

export function guia(op = {}) {
  const pele = op.pele || "#f2c29b";
  const roupa = op.cor || "#ffb703";
  const calca = op.calca || "#264653";
  const cabelo = op.cabelo || "#3d2314";
  const raiz = new THREE.Group();
  const corpo = new THREE.Group();
  raiz.add(corpo);

  const mRoupa = material(roupa), mPele = material(pele, { roughness: 0.6 });
  const tronco = malha(new THREE.CapsuleGeometry(0.34, 0.42, 8, 24), mRoupa, 0, 0.78, 0);
  corpo.add(tronco);
  const mCalca = material(calca);
  const pernas = [-1, 1].map((s) => {
    const g = new THREE.Group();
    g.position.set(0.15 * s, 0.42, 0);
    g.add(malha(new THREE.CapsuleGeometry(0.11, 0.24, 6, 16), mCalca, 0, -0.18, 0));
    const pe = malha(esfera(0.14, 20), material("#f1faee"), 0, -0.36, 0.06);
    pe.scale.set(1, 0.6, 1.4);
    g.add(pe);
    corpo.add(g);
    return g;
  });

  const cabeca = new THREE.Group();
  cabeca.position.set(0, 1.5, 0);
  corpo.add(cabeca);
  cabeca.add(malha(esfera(0.48, 48), mPele));
  const topo = malha(new THREE.SphereGeometry(0.505, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.42), material(cabelo, { roughness: 0.8 }), 0, 0.02, -0.02);
  topo.rotation.x = -0.25;
  cabeca.add(topo);
  const topete = malha(new THREE.ConeGeometry(0.12, 0.3, 16), material(cabelo, { roughness: 0.8 }), 0.06, 0.5, 0.18);
  topete.rotation.set(0.6, 0, -0.4);
  cabeca.add(topete);

  const raioOlho = 0.115;
  const olhos = [-1, 1].map((s) => {
    const o = olho(raioOlho);
    o.g.position.set(0.17 * s, 0.06, 0.4);
    cabeca.add(o.g);
    return o;
  });
  const sobrancelhas = [-1, 1].map((s) => {
    const b = malha(new THREE.CapsuleGeometry(0.025, 0.1, 4, 8), material(cabelo), 0.17 * s, 0.22, 0.45);
    b.rotation.z = Math.PI / 2;
    cabeca.add(b);
    return b;
  });
  [-1, 1].forEach((s) => {
    const b = malha(esfera(0.07, 16), material("#f28482", { roughness: 0.9, transparent: true, opacity: 0.75 }), 0.29 * s, -0.08, 0.36);
    b.scale.set(1, 0.6, 0.4);
    cabeca.add(b);
  });
  const boca = malha(esfera(0.1, 24), material("#7a1f2b", { roughness: 0.4 }), 0, -0.16, 0.43);
  cabeca.add(boca);
  const lingua = malha(esfera(0.06, 16), material("#e5646e"), 0, -0.2, 0.44);
  cabeca.add(lingua);

  if (op.acessorio === "mascara") {
    const faixa = malha(new THREE.TorusGeometry(0.49, 0.03, 8, 48), material("#1d3557"), 0, 0.08, 0);
    faixa.rotation.x = Math.PI / 2;
    cabeca.add(faixa);
    const vidro = malha(new THREE.CapsuleGeometry(0.13, 0.28, 6, 24), new THREE.MeshPhysicalMaterial({ color: "#bde0fe", transparent: true, opacity: 0.28, roughness: 0.05, transmission: 0.3 }), 0, 0.07, 0.42);
    vidro.rotation.z = Math.PI / 2;
    vidro.scale.set(1, 1, 0.55);
    cabeca.add(vidro);
    const snorkel = malha(new THREE.CapsuleGeometry(0.035, 0.5, 6, 12), material("#e63946"), 0.5, 0.25, 0.05);
    cabeca.add(snorkel);
  } else if (op.acessorio === "capacete") {
    const vidro = malha(esfera(0.68, 48), new THREE.MeshPhysicalMaterial({ color: "#e0fbfc", transparent: true, opacity: 0.18, roughness: 0.05, metalness: 0.1 }), 0, 0.02, 0);
    vidro.castShadow = false;
    cabeca.add(vidro);
    const gola = malha(new THREE.TorusGeometry(0.42, 0.07, 12, 48), material("#dee2e6", { metalness: 0.3, roughness: 0.4 }), 0, -0.52, 0);
    gola.rotation.x = Math.PI / 2;
    cabeca.add(gola);
  } else if (op.acessorio === "bone") {
    const bone = malha(new THREE.SphereGeometry(0.51, 40, 20, 0, Math.PI * 2, 0, Math.PI * 0.45), material(op.corBone || "#e63946"), 0, 0.05, 0);
    cabeca.add(bone);
    const aba = malha(new THREE.CylinderGeometry(0.3, 0.3, 0.03, 32, 1, false, -Math.PI / 2, Math.PI), material(op.corBone || "#e63946"), 0, 0.16, 0.38);
    aba.scale.set(1, 1, 0.9);
    cabeca.add(aba);
  }

  const bracos = [-1, 1].map((s) => {
    const ombro = new THREE.Group();
    ombro.position.set(0.36 * s, 1.0, 0);
    ombro.add(malha(new THREE.CapsuleGeometry(0.085, 0.36, 6, 16), mRoupa, 0, -0.24, 0));
    ombro.add(malha(esfera(0.1, 20), mPele, 0, -0.5, 0));
    corpo.add(ombro);
    return ombro;
  });

  function atualizar(ctx) {
    const { tl, t, acoes, boca: env } = ctx;
    // Respiração e peso.
    const resp = Math.sin(t * 2.4) * 0.012;
    tronco.scale.set(1 + resp, 1 - resp, 1 + resp);
    cabeca.position.y = 1.5 + resp * 2 + (acoes.has("falar") ? env * 0.025 : 0);
    // Cabeça acompanha a fala: pequenos acenos, cabeça lidera os braços.
    const fala = acoes.has("falar") ? 1 : 0;
    cabeca.rotation.x = fala * (Math.sin(t * 5.1) * 0.05 * env) + ruido(t * 0.5, 3) * 0.04;
    cabeca.rotation.z = ruido(t * 0.4, 4) * 0.06 + fala * Math.sin(t * 2.3) * 0.04;
    cabeca.rotation.y = (ctx.olharX || 0) * 0.5 + ruido(t * 0.3, 5) * 0.08;

    olhos.forEach((o, i) => atualizarOlho(o, raioOlho, ctx, i));
    const ergue = ctx.humor === "surpreso" ? 0.07 : ctx.humor === "feliz" ? 0.03 : 0;
    sobrancelhas.forEach((b, i) => {
      b.position.y = 0.22 + ergue + env * 0.02 * fala;
      b.rotation.z = Math.PI / 2 + (i ? -1 : 1) * (ctx.humor === "surpreso" ? -0.15 : 0.05);
    });

    const aberta = clamp(env * 1.3) * fala;
    const sorriso = ctx.humor === "feliz" ? 1 : 0.5;
    boca.scale.set(1.3 + sorriso * 0.3 - aberta * 0.35, 0.18 + aberta * 0.95 + (ctx.humor === "surpreso" ? 0.7 : 0), 0.5);
    lingua.visible = aberta > 0.35;

    // Braços: repouso levemente aberto, gestos de fala desencontrados.
    const [esq, dir] = bracos;
    let zE = 0.22, zD = -0.22, xE = 0, xD = 0;
    if (fala) {
      zE += Math.sin(t * 3.3 + 0.7) * 0.18 * (0.4 + env);
      xE += Math.sin(t * 2.1) * 0.25 * env;
      zD -= Math.sin(t * 2.7 + 2.1) * 0.12 * (0.4 + env);
      xD -= Math.sin(t * 2.6 + 1) * 0.3 * env;
    }
    if (acoes.has("acenar")) {
      const sobe = smooth(0, 0.35, tl);
      zD = lerp(zD, -2.5 + Math.sin(tl * 9) * 0.35, sobe);
      xD = lerp(xD, -0.2, sobe);
    }
    if (acoes.has("apontar")) {
      const sobe = smooth(0.1, 0.45, tl);
      zE = lerp(zE, 1.45, sobe);
      xE = lerp(xE, -0.35, sobe);
    }
    if (acoes.has("comemorar")) {
      const sobe = smooth(0, 0.3, tl);
      zE = lerp(zE, 2.6 + Math.sin(tl * 8) * 0.2, sobe);
      zD = lerp(zD, -2.6 - Math.sin(tl * 8 + 1) * 0.2, sobe);
    }
    esq.rotation.set(xE, 0, zE);
    dir.rotation.set(xD, 0, zD);

    // Pernas: caminhada quando entra.
    const passo = ctx.andando ? Math.sin(t * 12) * 0.5 : 0;
    pernas[0].rotation.x = passo;
    pernas[1].rotation.x = -passo;
  }

  return { grupo: raiz, altura: 1.55, atualizar };
}

// ---------------------------------------------------------------- Polvo

export function polvo(op = {}) {
  const base = cor(op.cor || "#e76f51");
  const raiz = new THREE.Group();
  const corpo = new THREE.Group();
  raiz.add(corpo);
  const mPele = material(base, { roughness: 0.42 });
  const mManchas = material(base.clone().multiplyScalar(0.7), { roughness: 0.5 });

  const manto = malha(esfera(0.55, 48), mPele, 0, 1.25, -0.05);
  manto.scale.set(1, 1.28, 1);
  corpo.add(manto);
  const r = rng(7);
  for (let i = 0; i < 14; i++) {
    const a = -Math.PI * 0.1 - r() * Math.PI * 0.8 + Math.PI, y = 0.15 + r() * 0.75;
    const m = malha(esfera(0.05 + r() * 0.05, 12), mManchas);
    const v = new THREE.Vector3(Math.cos(a) * Math.sqrt(1 - y * y), y, Math.sin(a) * Math.sqrt(1 - y * y));
    m.position.set(v.x * 0.54, 1.25 + v.y * 0.54 * 1.28, -0.05 + v.z * 0.54);
    m.scale.set(1, 1, 0.35);
    m.lookAt(m.position.clone().multiplyScalar(2));
    corpo.add(m);
  }

  const raioOlho = 0.14;
  const olhos = [-1, 1].map((s) => {
    const o = olho(raioOlho, { pupila: "barra" });
    o.g.position.set(0.23 * s, 0.95, 0.4);
    corpo.add(o.g);
    return o;
  });
  const boca = malha(esfera(0.06, 20), material("#5c1a1b"), 0, 0.74, 0.47);
  corpo.add(boca);

  const mTent = material(base, { roughness: 0.42 });
  const tentaculos = [];
  for (let i = 0; i < 8; i++) {
    const tubo = new TuboVivo(22, 12, (s) => 0.13 * Math.pow(1 - s, 1.1) + 0.01, mTent);
    corpo.add(tubo.mesh);
    tentaculos.push({ tubo, ang: (i / 8) * Math.PI * 2 + Math.PI / 8, fase: hash(i, 3) * 6, pts: Array.from({ length: 23 }, () => new THREE.Vector3()) });
  }

  function atualizar(ctx) {
    const { t, tl, acoes, boca: env } = ctx;
    const nadar = acoes.has("nadar") ? 1 : 0;
    const pensar = acoes.has("pensar") ? 1 : 0;
    const pulso = Math.sin(t * 2.2);
    manto.scale.set(1 + pulso * 0.03, 1.28 - pulso * 0.04, 1 + pulso * 0.03);
    manto.rotation.x = -0.15 + Math.sin(t * 1.1) * 0.06;

    for (const [i, tt] of tentaculos.entries()) {
      const dx = Math.cos(tt.ang), dz = Math.sin(tt.ang);
      const L = 1.25;
      const amp = 0.12 + nadar * 0.1 + pensar * 0.22 * (0.5 + 0.5 * Math.sin(t * 3 + i));
      for (let k = 0; k <= 22; k++) {
        const s = k / 22;
        const onda = Math.sin(t * (2.4 + pensar * 2) - s * 5 + tt.fase) * amp * s;
        const lado = Math.cos(t * 1.7 - s * 4 + tt.fase) * amp * s;
        const raio = 0.32 + s * L * 0.85;
        // Desce até o chão e enrola na ponta.
        let y = 0.85 - Math.min(1, s * 1.6) * 0.78 + Math.max(0, s - 0.7) * (0.6 + nadar * 0.4) + onda;
        if (nadar) y += Math.sin(t * 3 + s * 2) * 0.08 * s;
        const curl = Math.max(0, s - 0.75) * 4;
        tt.pts[k].set(
          dx * raio - dz * lado - dx * curl * 0.12,
          Math.max(0.035, y),
          dz * raio + dx * lado - dz * curl * 0.12,
        );
      }
      tt.tubo.atualizar(tt.pts);
    }

    olhos.forEach((o) => atualizarOlho(o, raioOlho, ctx));
    const fala = acoes.has("falar") ? 1 : 0;
    boca.scale.set(1.2 - env * fala * 0.3, 0.4 + env * fala * 1.2, 0.6);

    if (ctx.cor) {
      mPele.color.copy(ctx.cor); mTent.color.copy(ctx.cor);
      mManchas.color.copy(ctx.cor).multiplyScalar(0.7);
    } else {
      mPele.color.copy(base); mTent.color.copy(base);
      mManchas.color.copy(base).multiplyScalar(0.7);
    }
  }

  return { grupo: raiz, altura: 1.2, atualizar, tentaculos };
}

// ---------------------------------------------------------------- Planeta (com ou sem rosto)

export function planeta(op = {}) {
  const raiz = new THREE.Group();
  const corpo = new THREE.Group();
  raiz.add(corpo);
  const R = op.raio || 1;
  const geo = esfera(R, 64);
  // Relevo: crateras e faixas por deslocamento de vértices (semente fixa).
  const pos = geo.attributes.position, v = new THREE.Vector3();
  const cores = [];
  const c1 = cor(op.cor || "#e9c46a"), c2 = cor(op.cor2 || "#f4a261");
  const r = rng(op.semente || 5);
  const crateras = Array.from({ length: op.crateras ?? 10 }, () => new THREE.Vector3(r() * 2 - 1, r() * 2 - 1, r() * 2 - 1).normalize());
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).normalize();
    let d = 0;
    for (const c of crateras) {
      const a = v.angleTo(c);
      if (a < 0.28) d -= Math.cos((a / 0.28) * Math.PI * 0.5) * 0.04;
    }
    const faixa = 0.5 + 0.5 * Math.sin(v.y * 9 + Math.sin(v.x * 3) * 1.5);
    const k = op.faixas ? faixa : 0.5 + d * 8;
    const c = c1.clone().lerp(c2, clamp(k));
    cores.push(c.r, c.g, c.b);
    v.multiplyScalar(R * (1 + d));
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.setAttribute("color", new THREE.Float32BufferAttribute(cores, 3));
  geo.computeVertexNormals();
  const bola = malha(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85 }), 0, R, 0);
  corpo.add(bola);
  if (op.aneis) {
    const anel = malha(new THREE.RingGeometry(R * 1.35, R * 2, 96), new THREE.MeshStandardMaterial({ color: cor(op.corAnel || "#e9d8a6"), side: THREE.DoubleSide, transparent: true, opacity: 0.85, roughness: 0.7 }), 0, R, 0);
    anel.rotation.x = Math.PI / 2.4;
    anel.receiveShadow = false;
    corpo.add(anel);
  }
  let olhos = [], boca = null;
  if (op.rosto) {
    olhos = [-1, 1].map((s) => {
      const o = olho(R * 0.17);
      o.g.position.set(R * 0.3 * s, R * 1.15, R * 0.86);
      corpo.add(o.g);
      return o;
    });
    boca = malha(esfera(R * 0.12, 24), material("#5c1a1b"), 0, R * 0.78, R * 0.93);
    corpo.add(boca);
  }
  function atualizar(ctx) {
    bola.rotation.y = ctx.t * (op.giro ?? 0.25);
    olhos.forEach((o) => atualizarOlho(o, R * 0.17, ctx));
    if (boca) {
      const fala = ctx.acoes.has("falar") ? 1 : 0;
      boca.scale.set(1.4 - ctx.boca * fala * 0.3, 0.3 + ctx.boca * fala * 1.1 + (ctx.humor === "surpreso" ? 0.8 : 0), 0.4);
    }
  }
  return { grupo: raiz, altura: R, atualizar };
}

// ---------------------------------------------------------------- Peixe (figurante)

export function peixe(op = {}) {
  const raiz = new THREE.Group();
  const corpo = new THREE.Group();
  raiz.add(corpo);
  const m = material(op.cor || "#ffd166", { roughness: 0.35 });
  const tronco = malha(esfera(0.25, 24), m);
  tronco.scale.set(1.5, 1, 0.6);
  corpo.add(tronco);
  const cauda = new THREE.Group();
  cauda.position.x = -0.34;
  const barb = malha(new THREE.ConeGeometry(0.17, 0.3, 4), m, -0.1, 0, 0);
  barb.rotation.z = Math.PI / 2;
  barb.scale.set(1, 1, 0.25);
  cauda.add(barb);
  corpo.add(cauda);
  [-1, 1].forEach((s) => {
    const o = olho(0.06);
    o.g.position.set(0.22, 0.06, 0.12 * s);
    o.g.rotation.y = s > 0 ? 0 : Math.PI;
    corpo.add(o.g);
  });
  return {
    grupo: raiz, altura: 0.2,
    atualizar(ctx) { cauda.rotation.y = Math.sin(ctx.t * 12 + (op.fase || 0)) * 0.5; },
  };
}

export const PERSONAGENS = { guia, polvo, planeta, peixe, garoto };
