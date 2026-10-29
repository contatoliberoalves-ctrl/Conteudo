// Personagem detalhado no estilo "animação 3D" (cabeção, nariz grande, olhos grandes,
// pálpebras de verdade, mãos com dedos). Opções: pele, cabelo, roupa, forro, bone, calca,
// tenis, olhos, bigode (bool), boneVirado (bool).
import * as THREE from "three";
import { clamp, lerp, smooth, ruido } from "./util.js";

const cor = (c) => new THREE.Color(c);

function pele(c) {
  return new THREE.MeshPhysicalMaterial({ color: cor(c), roughness: 0.52, sheen: 0.35, sheenColor: cor("#ff8f7a"), sheenRoughness: 0.6, clearcoat: 0.08 });
}
function tecido(c, rough = 0.88) {
  return new THREE.MeshPhysicalMaterial({ color: cor(c), roughness: rough, sheen: 0.6, sheenColor: cor(c).lerp(cor("#ffffff"), 0.35), sheenRoughness: 0.8 });
}
function liso(c, extra = {}) {
  return new THREE.MeshStandardMaterial({ color: cor(c), roughness: 0.5, ...extra });
}

function m(geo, mat, x = 0, y = 0, z = 0, sx = 1, sy = 1, sz = 1) {
  const o = new THREE.Mesh(geo, mat);
  o.position.set(x, y, z);
  o.scale.set(sx, sy, sz);
  o.castShadow = true;
  o.receiveShadow = true;
  return o;
}
const esf = (r, a = 40, b = 28) => new THREE.SphereGeometry(r, a, b);
const caps = (r, l, a = 10, b = 24) => new THREE.CapsuleGeometry(r, l, a, b);

// Tubo fixo por uma curva (sobrancelhas, cordões, alças).
function tubo(pontos, r, mat, seg = 24) {
  const curva = new THREE.CatmullRomCurve3(pontos.map((p) => new THREE.Vector3(...p)));
  const o = new THREE.Mesh(new THREE.TubeGeometry(curva, seg, r, 12, false), mat);
  o.castShadow = true;
  return o;
}

// Torso por revolução: ombros arredondados, cintura reta e barra dobrada.
function torsoGeo() {
  const p = [
    [0.0, 0.0], [0.27, 0.0], [0.3, 0.03], [0.3, 0.09], [0.285, 0.12],
    [0.3, 0.3], [0.32, 0.46], [0.33, 0.55], [0.31, 0.62], [0.24, 0.68], [0.13, 0.71], [0.0, 0.72],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const g = new THREE.LatheGeometry(new THREE.SplineCurve(p).getPoints(48), 48);
  g.scale(1, 1, 0.72);
  return g;
}

function mao(matPele, lado) {
  const g = new THREE.Group();
  g.add(m(esf(0.062, 24, 18), matPele, 0, -0.04, 0, 1, 1.15, 0.6));
  const dedos = [];
  for (let i = 0; i < 4; i++) {
    const d = new THREE.Group();
    d.position.set((i - 1.5) * 0.026, -0.1, 0.005);
    d.add(m(caps(0.0135, 0.05, 6, 10), matPele, 0, -0.03, 0));
    d.rotation.z = (i - 1.5) * 0.06;
    g.add(d);
    dedos.push(d);
  }
  const pol = new THREE.Group();
  pol.position.set(0.045 * lado * -1, -0.06, 0.025);
  pol.add(m(caps(0.015, 0.04, 6, 10), matPele, 0, -0.025, 0));
  pol.rotation.set(0.4, 0, 0.7 * lado);
  g.add(pol);
  return { g, dedos };
}

export function garoto(op = {}) {
  const P = pele(op.pele || "#f1c3a1");
  const Pnariz = pele(op.peleNariz || "#f3b49a");
  const cabelo = tecido(op.cabelo || "#6b3f26", 0.7);
  const roupa = tecido(op.roupa || "#2f9a82");
  const forro = tecido(op.forro || "#b98d5e");
  const bone = tecido(op.bone || "#2c9c8a", 0.75);
  const calca = tecido(op.calca || "#3b4a63");
  const tenisM = liso(op.tenis || "#f4f1ea", { roughness: 0.6 });
  const sola = liso("#d9d4c7", { roughness: 0.8 });
  const preto = liso("#16181c", { roughness: 0.3 });

  const raiz = new THREE.Group();
  const corpo = new THREE.Group();
  raiz.add(corpo);

  // Pernas e tênis.
  const pernas = [-1, 1].map((s) => {
    const g = new THREE.Group();
    g.position.set(0.11 * s, 0.62, 0);
    g.add(m(caps(0.085, 0.42, 8, 20), calca, 0, -0.27, 0));
    const pe = new THREE.Group();
    pe.position.set(0, -0.56, 0.035);
    pe.add(m(esf(0.1, 32, 20), tenisM, 0, 0.0, 0.03, 0.95, 0.6, 1.55));
    pe.add(m(esf(0.1, 32, 16), sola, 0, -0.03, 0.03, 1.0, 0.25, 1.6));
    pe.add(m(new THREE.TorusGeometry(0.055, 0.012, 8, 24), liso("#c9c3b5"), 0, 0.045, -0.02, 1, 1, 1));
    g.add(pe);
    corpo.add(g);
    return g;
  });

  // Tronco (moletom com capuz).
  const torso = new THREE.Group();
  torso.position.y = 0.6;
  corpo.add(torso);
  const tronco = m(torsoGeo(), roupa);
  torso.add(tronco);
  const barra = m(new THREE.TorusGeometry(0.285, 0.035, 12, 48), roupa, 0, 0.06, 0, 1, 1, 1);
  barra.rotation.x = Math.PI / 2;
  barra.scale.set(1, 0.72, 1);
  torso.add(barra);
  // Bolso canguru.
  torso.add(m(esf(0.2, 32, 16), roupa, 0, 0.2, 0.17, 1.05, 0.5, 0.35));
  // Capuz: rolo atrás do pescoço com forro claro por dentro.
  const capuz = new THREE.Group();
  capuz.position.set(0, 0.69, -0.03);
  const rolo = m(new THREE.TorusGeometry(0.16, 0.075, 16, 48), forro, 0, 0, 0, 1.05, 1, 1);
  rolo.rotation.x = Math.PI / 2 - 0.25;
  capuz.add(rolo);
  capuz.add(m(esf(0.17, 32, 20), roupa, 0, 0.03, -0.12, 1.25, 0.75, 0.75));
  torso.add(capuz);
  // Cordões com ponteira metálica.
  [-1, 1].forEach((s) => {
    torso.add(tubo([[0.06 * s, 0.68, 0.2], [0.065 * s, 0.6, 0.235], [0.07 * s, 0.48, 0.245], [0.072 * s, 0.4, 0.24]], 0.007, liso("#2b2b2b")));
    torso.add(m(caps(0.01, 0.035, 4, 8), liso("#c0c4c8", { metalness: 0.8, roughness: 0.3 }), 0.072 * s, 0.375, 0.24));
  });

  // Braços com cotovelo e mão.
  const bracos = [-1, 1].map((s) => {
    const ombro = new THREE.Group();
    ombro.position.set(0.3 * s, 1.2, 0);
    ombro.add(m(caps(0.075, 0.24, 8, 20), roupa, 0, -0.15, 0));
    const cotovelo = new THREE.Group();
    cotovelo.position.y = -0.31;
    cotovelo.add(m(caps(0.068, 0.2, 8, 20), roupa, 0, -0.12, 0));
    const punhoRoupa = m(new THREE.TorusGeometry(0.055, 0.022, 10, 24), roupa, 0, -0.25, 0);
    punhoRoupa.rotation.x = Math.PI / 2;
    cotovelo.add(punhoRoupa);
    const punho = new THREE.Group();
    punho.position.y = -0.27;
    const h = mao(P, s);
    punho.add(h.g);
    cotovelo.add(punho);
    ombro.add(cotovelo);
    corpo.add(ombro);
    return { ombro, cotovelo, punho, dedos: h.dedos, lado: s };
  });

  // Pescoço e cabeça.
  corpo.add(m(new THREE.CylinderGeometry(0.075, 0.085, 0.16, 24), P, 0, 1.33, -0.01));
  const cabeca = new THREE.Group();
  cabeca.position.set(0, 1.4, 0);
  corpo.add(cabeca);
  const H = new THREE.Group();
  H.position.y = 0.3;
  cabeca.add(H);
  H.add(m(esf(0.34, 64, 48), P, 0, 0.04, -0.02, 1, 1.06, 0.98));
  H.add(m(esf(0.29, 56, 40), P, 0, -0.07, 0.04, 1.02, 0.9, 1)); // bochechas e queixo
  H.add(m(esf(0.085, 32, 24), Pnariz, 0, -0.04, 0.33, 0.95, 0.85, 1.05));
  H.add(m(esf(0.04, 20, 16), Pnariz, 0.05, -0.065, 0.31)); // narinas
  H.add(m(esf(0.04, 20, 16), Pnariz, -0.05, -0.065, 0.31));
  [-1, 1].forEach((s) => {
    const orelha = m(esf(0.085, 28, 20), P, 0.335 * s, -0.01, 0.0, 0.45, 1, 0.8);
    orelha.rotation.y = 0.35 * s;
    H.add(orelha);
    H.add(m(esf(0.05, 20, 16), pele("#e9a588"), 0.355 * s, -0.01, 0.02, 0.25, 0.7, 0.55));
    // Rubor.
    H.add(m(esf(0.06, 20, 14), new THREE.MeshStandardMaterial({ color: cor("#f08b7a"), transparent: true, opacity: 0.35, roughness: 0.9, depthWrite: false }), 0.19 * s, -0.08, 0.27, 1.2, 0.7, 0.4));
  });

  // Olhos com íris, pupila, brilho e pálpebras (casca que gira para fechar).
  const rO = 0.078;
  const olhos = [-1, 1].map((s) => {
    const g = new THREE.Group();
    g.position.set(0.125 * s, 0.06, 0.255);
    g.rotation.y = 0.12 * s;
    g.add(m(esf(rO, 40, 30), liso("#ffffff", { roughness: 0.15 })));
    const iris = new THREE.Group();
    iris.add(m(esf(rO * 0.62, 32, 24), liso(op.olhos || "#2a1a12", { roughness: 0.2 }), 0, 0, rO * 0.8, 1, 1, 0.42));
    iris.add(m(esf(rO * 0.42, 24, 18), preto, 0, 0, rO * 0.93, 1, 1, 0.35));
    iris.add(m(esf(rO * 0.13, 12, 10), new THREE.MeshBasicMaterial({ color: "#ffffff" }), rO * 0.2, rO * 0.22, rO * 1.04));
    g.add(iris);
    const palpSup = m(new THREE.SphereGeometry(rO * 1.07, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2), P);
    const palpInf = m(new THREE.SphereGeometry(rO * 1.05, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2), P);
    palpInf.rotation.x = Math.PI;
    g.add(palpSup, palpInf);
    H.add(g);
    return { g, iris, palpSup, palpInf, s };
  });

  // Sobrancelhas grossas (tubo curvo), giram e sobem com a expressão.
  const sobr = [-1, 1].map((s) => {
    const g = new THREE.Group();
    g.position.set(0.13 * s, 0.16, 0.3);
    g.add(tubo([[-0.07, -0.01, -0.01], [-0.02, 0.012, 0.008], [0.04, 0.008, 0.004], [0.075, -0.015, -0.02]], 0.022, cabelo, 16));
    g.scale.x = s;
    H.add(g);
    return g;
  });

  // Boca: cavidade escura com lábio em anel.
  const boca = new THREE.Group();
  boca.position.set(0, -0.17, 0.28);
  boca.rotation.x = -0.25;
  const cav = m(esf(0.04, 24, 18), liso("#4a1a1c", { roughness: 0.6 }), 0, 0, 0, 1, 1, 0.5);
  const labio = m(new THREE.TorusGeometry(0.042, 0.011, 10, 32), Pnariz);
  boca.add(cav, labio);
  H.add(boca);

  // Cabelo: mechas aparecendo embaixo do boné, atrás e nas têmporas.
  const mechas = [[-0.3, 0.06, -0.1], [0.3, 0.06, -0.1], [-0.26, 0.12, 0.08], [0.26, 0.12, 0.08], [-0.2, 0.05, -0.27], [0.2, 0.05, -0.27], [0, 0.04, -0.33], [-0.1, 0.0, -0.32], [0.1, 0.0, -0.32]];
  mechas.forEach(([x, y, z], i) => H.add(m(esf(0.085 + (i % 3) * 0.012, 20, 16), cabelo, x, y, z, 1, 0.8, 1)));

  // Boné virado para trás: copa, faixa, aba atrás e abertura com alça na testa.
  const B = new THREE.Group();
  B.position.set(0, 0.2, -0.03);
  B.rotation.x = -0.1;
  H.add(B);
  B.add(m(new THREE.SphereGeometry(0.355, 56, 28, 0, Math.PI * 2, 0, Math.PI * 0.52), bone, 0, 0, 0, 1.04, 0.72, 1.04));
  B.add(m(esf(0.025, 16, 12), bone, 0, 0.26, 0));
  const virado = op.boneVirado !== false;
  const aba = m(new THREE.CylinderGeometry(0.27, 0.27, 0.025, 48, 1, false, -Math.PI / 2, Math.PI), bone, 0, 0.0, 0, 1, 1, 0.95);
  aba.position.set(0, 0.0, virado ? -0.33 : 0.33);
  aba.rotation.y = virado ? Math.PI : 0;
  aba.rotation.x = virado ? -0.15 : 0.15;
  B.add(aba);
  if (virado) {
    // Abertura do snapback na testa: cabelo aparecendo e a alça preta.
    B.add(m(esf(0.1, 24, 16), cabelo, 0, 0.07, 0.31, 1.15, 0.6, 0.4));
    B.add(tubo([[-0.13, 0.0, 0.32], [-0.05, 0.012, 0.36], [0.05, 0.012, 0.36], [0.13, 0.0, 0.32]], 0.016, preto, 16));
  }

  function atualizar(ctx) {
    const { t, tl, acoes, boca: env } = ctx;
    const fala = acoes.has("falar") ? 1 : 0;
    const resp = Math.sin(t * 2.2) * 0.008;
    torso.scale.set(1 + resp, 1 + resp * 0.6, 1 + resp);

    // Cabeça lidera; tronco segue com atraso e menos amplitude.
    const acena = fala * Math.sin(t * 4.6) * 0.045 * (0.3 + env);
    cabeca.rotation.set(acena + ruido(t * 0.5, 3) * 0.04, (ctx.olharX || 0) * 0.4 + ruido(t * 0.35, 5) * 0.1, ruido(t * 0.4, 4) * 0.06 + fala * Math.sin(t * 1.9) * 0.035);
    torso.rotation.y = ruido(t * 0.35 - 0.3, 5) * 0.04;

    // Pálpebras: abertura pela expressão, piscada por cima.
    const fechado = clamp(ctx.piscar);
    const aberto = { surpreso: -0.65, feliz: -0.2, tedio: 0.28, bravo: 0.05 }[ctx.humor] ?? -0.38;
    const sup = lerp(aberto, Math.PI / 2 + 0.05, fechado);
    const inf = -(Math.PI - lerp(ctx.humor === "feliz" ? 0.45 : 0.95, 0.55, fechado));
    const ox = ruido(t * 0.6, 11) * 0.12 + (ctx.olharX || 0) * 0.3;
    const oy = ruido(t * 0.5, 12) * 0.08;
    olhos.forEach((o) => {
      o.palpSup.rotation.x = sup;
      o.palpInf.rotation.x = inf;
      o.iris.rotation.set(-oy, ox, 0);
    });

    // Sobrancelhas: sobem na surpresa, caem no tédio, mexem com a fala.
    const ergue = ctx.humor === "surpreso" ? 0.035 : ctx.humor === "tedio" ? -0.02 : 0;
    sobr.forEach((g, i) => {
      g.position.y = 0.16 + ergue + fala * env * 0.012 + Math.max(0, Math.sin(t * 3.1 + i)) * fala * 0.006;
      g.rotation.z = (i ? -1 : 1) * (ctx.humor === "surpreso" ? -0.12 : ctx.humor === "bravo" ? 0.3 : 0.04);
    });

    // Boca: "o" que abre com a voz; sorriso alarga.
    const ab = clamp(env * 1.25) * fala;
    const largura = ctx.humor === "feliz" ? 1.5 : 1;
    boca.scale.set(largura * (1 - ab * 0.15), 0.35 + ab * 1.1 + (ctx.humor === "surpreso" ? 0.5 : 0), 1);

    // Braços: repouso, gestos de fala alternados, aceno com o cotovelo.
    bracos.forEach((b, i) => {
      const s = b.lado;
      let zO = 0.12 * s, xO = 0, zC = 0, xC = -0.15;
      if (fala) {
        const fase = i ? 1.7 : 0;
        xO += -0.15 - Math.max(0, Math.sin(t * 2.4 + fase)) * 0.35 * (0.4 + env);
        xC += -0.6 - Math.sin(t * 3.1 + fase) * 0.25 * env;
        zO += 0.05 * s;
      }
      if (acoes.has("acenar") && s < 0) {
        const k = smooth(0, 0.4, tl);
        zO = lerp(zO, 2.35 * s, k);
        xO = lerp(xO, -0.1, k);
        zC = lerp(zC, (0.5 + Math.sin(tl * 9) * 0.45) * s * -1, k);
        xC = lerp(xC, -0.2, k);
      }
      b.ombro.rotation.set(xO, 0, zO);
      b.cotovelo.rotation.set(xC, 0, zC);
      b.punho.rotation.set(0, 0, 0.1 * s);
      b.dedos.forEach((d, k) => { d.rotation.x = -0.25 - k * 0.05; });
    });

    const passo = ctx.andando ? Math.sin(t * 10) * 0.45 : 0;
    pernas[0].rotation.x = passo;
    pernas[1].rotation.x = -passo;
  }

  return { grupo: raiz, altura: 1.75, atualizar };
}
