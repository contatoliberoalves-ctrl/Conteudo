// Personagem de ilustração: cabeça oval branca, olhos pretos, sobrancelhas grossas,
// sem nariz nem orelhas, roupa com contorno e sombra chapada.
// Opções: cabeca, cabelo ("topete" | "gorro" | "nada"), corCabelo, gorro, listra,
// roupa ("moletom" | "jaqueta"), corRoupa, cachecol (cor ou false), calca, tenis,
// sola, pose ("parado" | "celular"), contorno (espessura).
import * as THREE from "three";
import { toon, contornar } from "./toon.js";
import { clamp, lerp, smooth, ruido } from "./util.js";

function m(geo, mat, x = 0, y = 0, z = 0, sx = 1, sy = 1, sz = 1) {
  const o = new THREE.Mesh(geo, mat);
  o.position.set(x, y, z);
  o.scale.set(sx, sy, sz);
  o.castShadow = true;
  o.receiveShadow = true;
  return o;
}
const esf = (r, a = 40, b = 28) => new THREE.SphereGeometry(r, a, b);
const caps = (r, l) => new THREE.CapsuleGeometry(r, l, 10, 24);
function tubo(pontos, r, mat, seg = 20) {
  const curva = new THREE.CatmullRomCurve3(pontos.map((p) => new THREE.Vector3(...p)));
  const o = new THREE.Mesh(new THREE.TubeGeometry(curva, seg, r, 12, false), mat);
  o.castShadow = true;
  return o;
}
// Tampa as pontas de um tubo com esferas (fica "desenhado à mão").
function tracinho(pontos, r, mat) {
  const g = new THREE.Group();
  g.add(tubo(pontos, r, mat));
  g.add(m(esf(r, 12, 10), mat, ...pontos[0]));
  g.add(m(esf(r, 12, 10), mat, ...pontos[pontos.length - 1]));
  return g;
}

export function cabecudo(op = {}) {
  const corPele = op.cabeca || "#f2eee6";
  const P = toon(corPele);
  const tinta = toon("#1d1d22");
  const roupaM = toon(op.corRoupa || "#d9a43f");
  const calcaM = toon(op.calca || "#3e4048");
  const tenisM = toon(op.tenis || "#b23a37");
  const solaM = toon(op.sola || "#efece4");
  const cabeloM = toon(op.corCabelo || "#5a3a26");

  const raiz = new THREE.Group();
  const corpo = new THREE.Group();
  raiz.add(corpo);

  // Pernas: calça folgada, tênis com sola clara.
  const pernas = [-1, 1].map((s) => {
    const g = new THREE.Group();
    g.position.set(0.12 * s, 0.78, 0);
    g.add(m(caps(0.1, 0.5), calcaM, 0, -0.33, 0));
    g.add(m(new THREE.CylinderGeometry(0.1, 0.095, 0.08, 24), calcaM, 0, -0.66, 0));
    const pe = new THREE.Group();
    pe.position.set(0, -0.72, 0.05);
    pe.add(m(esf(0.1, 32, 20), tenisM, 0, 0.0, 0.02, 1.0, 0.7, 1.55));
    pe.add(m(esf(0.1, 32, 16), solaM, 0, -0.045, 0.02, 1.05, 0.3, 1.62));
    g.add(pe);
    corpo.add(g);
    return g;
  });

  // Tronco: moletom (com bolso e cordões) ou jaqueta de gomos.
  const torso = new THREE.Group();
  torso.position.y = 0.74;
  corpo.add(torso);
  const perfil = [[0, 0], [0.26, 0], [0.29, 0.03], [0.29, 0.1], [0.3, 0.32], [0.32, 0.5], [0.31, 0.6], [0.24, 0.66], [0.12, 0.69], [0, 0.7]]
    .map(([x, y]) => new THREE.Vector2(x, y));
  const geoT = new THREE.LatheGeometry(new THREE.SplineCurve(perfil).getPoints(40), 40);
  geoT.scale(1, 1, 0.74);
  torso.add(m(geoT, roupaM));
  if ((op.roupa || "moletom") === "jaqueta") {
    // Costuras horizontais (gomos) e zíper.
    for (let i = 0; i < 4; i++) {
      const y = 0.14 + i * 0.13;
      const r = [0.297, 0.303, 0.315, 0.322][i];
      const c = m(new THREE.TorusGeometry(r, 0.006, 6, 48), toon("#8c9298"), 0, y, 0, 1, 1, 0.75);
      c.rotation.x = Math.PI / 2;
      c.userData.semContorno = true;
      torso.add(c);
    }
    const ziper = m(new THREE.BoxGeometry(0.012, 0.6, 0.02), toon("#6f757c"), 0, 0.34, 0.236);
    ziper.userData.semContorno = true;
    torso.add(ziper);
  } else {
    const barra = m(new THREE.TorusGeometry(0.275, 0.035, 10, 48), roupaM, 0, 0.04, 0, 1, 1, 0.74);
    barra.rotation.x = Math.PI / 2;
    torso.add(barra);
    torso.add(m(esf(0.19, 32, 16), roupaM, 0, 0.2, 0.17, 1.05, 0.45, 0.32));
    [-1, 1].forEach((s) => torso.add(tracinho([[0.06 * s, 0.66, 0.17], [0.065 * s, 0.56, 0.215], [0.07 * s, 0.46, 0.225]], 0.008, toon("#efe9dc"))));
  }
  // Gola / capuz enrolado atrás do pescoço.
  const gola = m(new THREE.TorusGeometry(0.14, 0.06, 14, 40), roupaM, 0, 0.69, -0.02, 1.05, 1, 1);
  gola.rotation.x = Math.PI / 2 - 0.2;
  torso.add(gola);
  if (op.cachecol) {
    const cc = toon(op.cachecol);
    const volta = m(new THREE.TorusGeometry(0.13, 0.065, 14, 40), cc, 0, 0.74, 0.0, 1.1, 1, 1);
    volta.rotation.x = Math.PI / 2 - 0.1;
    torso.add(volta);
    const ponta = m(caps(0.055, 0.3), cc, 0.11, 0.5, 0.245, 1.25, 1, 0.42);
    ponta.rotation.z = 0.08;
    torso.add(ponta);
  }

  // Braços: ombro, cotovelo, mão simples (palma + polegar), mangas com punho.
  const bracos = [-1, 1].map((s) => {
    const ombro = new THREE.Group();
    ombro.position.set(0.29 * s, 1.36, 0);
    ombro.add(m(caps(0.082, 0.26), roupaM, 0, -0.16, 0));
    const cot = new THREE.Group();
    cot.position.y = -0.33;
    cot.add(m(caps(0.075, 0.2), roupaM, 0, -0.12, 0));
    const punho = m(new THREE.CylinderGeometry(0.07, 0.068, 0.06, 24), roupaM, 0, -0.26, 0);
    cot.add(punho);
    const mao = new THREE.Group();
    mao.position.y = -0.3;
    mao.add(m(esf(0.06, 24, 18), P, 0, -0.04, 0, 0.9, 1.15, 0.7));
    const pol = m(caps(0.02, 0.04), P, -0.045 * s, -0.03, 0.03);
    pol.rotation.z = 0.6 * s;
    mao.add(pol);
    cot.add(mao);
    ombro.add(cot);
    corpo.add(ombro);
    return { ombro, cot, mao, s };
  });

  // Celular na mão (tela acende o rosto de baixo).
  let celular = null, luzTela = null;
  if (op.pose === "celular") {
    celular = new THREE.Group();
    celular.add(m(new THREE.BoxGeometry(0.085, 0.16, 0.012), toon("#2a2c33")));
    const tela = new THREE.Mesh(new THREE.PlaneGeometry(0.075, 0.145), new THREE.MeshBasicMaterial({ color: "#cfe6ff" }));
    tela.position.z = 0.007;
    tela.userData.semContorno = true;
    celular.add(tela);
    corpo.add(celular);
  }

  // Cabeça oval.
  const cabeca = new THREE.Group();
  cabeca.position.set(0, 1.5, 0);
  corpo.add(cabeca);
  const H = new THREE.Group();
  H.position.y = 0.3;
  cabeca.add(H);
  H.add(m(esf(0.31, 64, 48), P, 0, 0, 0, 1, 1.07, 0.97));
  H.add(m(new THREE.CylinderGeometry(0.065, 0.07, 0.14, 20), P, 0, -0.33, -0.01));

  // Olhos: ovais pretos com brilho; olho cansado = oval achatado com traço de pálpebra por cima.
  const olhos = [-1, 1].map((s) => {
    const g = new THREE.Group();
    g.position.set(0.105 * s, 0.0, 0.29);
    g.rotation.y = 0.33 * s;
    const bola = m(esf(0.042, 24, 18), tinta, 0, 0, 0, 0.78, 1.15, 0.35);
    bola.userData.semContorno = true;
    const brilho = new THREE.Mesh(esf(0.011, 10, 8), new THREE.MeshBasicMaterial({ color: "#ffffff" }));
    brilho.position.set(0.012, 0.018, 0.016);
    const palp = m(caps(0.0075, 0.06), tinta, 0, 0.03, 0.006);
    palp.rotation.z = Math.PI / 2;
    palp.userData.semContorno = true;
    g.add(bola, brilho, palp);
    H.add(g);
    return { g, bola, brilho, palp, s };
  });

  // Sobrancelhas grossas: pivô no meio, inclinação dá a expressão.
  const sobr = [-1, 1].map((s) => {
    const g = new THREE.Group();
    g.position.set(0.11 * s, 0.1, 0.285);
    g.rotation.y = 0.33 * s;
    const b = tracinho([[-0.055, 0, 0], [0, 0.01, 0.006], [0.055, 0, 0]], 0.017, tinta);
    b.traverse((o) => (o.userData.semContorno = true));
    g.add(b);
    H.add(g);
    return { g, s };
  });

  // Boca: traço que vira "o" quando fala.
  const boca = new THREE.Group();
  boca.position.set(0, -0.15, 0.295);
  boca.rotation.x = -0.3;
  const cav = m(esf(0.03, 20, 14), toon("#3a1c1f"), 0, 0, 0, 1, 1, 0.4);
  cav.userData.semContorno = true;
  boca.add(cav);
  H.add(boca);

  // Cabelo ou gorro.
  if ((op.cabelo || "topete") === "topete") {
    const pontas = [[0, 0.33, 0.02, 0.25, -0.3], [-0.08, 0.31, 0.06, 0.6, -0.1], [0.09, 0.31, 0.04, -0.55, -0.15], [0.02, 0.32, -0.09, 0.1, -0.7], [-0.1, 0.29, -0.06, 0.8, -0.5], [0.11, 0.29, -0.07, -0.8, -0.5]];
    pontas.forEach(([x, y, z, rz, rx], i) => {
      const c = m(new THREE.ConeGeometry(0.075 + (i % 2) * 0.012, 0.2 + (i === 0 ? 0.06 : 0), 16), cabeloM, x, y - 0.02, z);
      c.rotation.set(rx, 0, rz);
      H.add(c);
    });
    H.add(m(esf(0.13, 24, 16), cabeloM, 0, 0.27, -0.01, 1.2, 0.45, 1.1));
  } else if (op.cabelo === "gorro") {
    const gm = toon(op.gorro || "#3d4f61");
    const lm = toon(op.listra || "#c9ced6");
    H.add(m(new THREE.SphereGeometry(0.325, 56, 28, 0, Math.PI * 2, 0, Math.PI * 0.5), gm, 0, 0.245, -0.005, 1, 0.85, 1));
    const barra = m(new THREE.CylinderGeometry(0.335, 0.335, 0.15, 48), gm, 0, 0.245, -0.005);
    H.add(barra);
    [0.215, 0.27].forEach((y) => {
      const l = m(new THREE.TorusGeometry(0.336, 0.011, 8, 64), lm, 0, y, -0.005);
      l.rotation.x = Math.PI / 2;
      l.userData.semContorno = true;
      H.add(l);
    });
    H.add(m(esf(0.08, 24, 18), gm, 0, 0.545, -0.01));
  }

  contornar(raiz, op.contorno ?? 0.011);

  const v = new THREE.Vector3();
  function atualizar(ctx) {
    const { t, tl, acoes, boca: env } = ctx;
    const fala = acoes.has("falar") ? 1 : 0;
    const resp = Math.sin(t * 2.1) * 0.008;
    torso.scale.set(1 + resp, 1 + resp * 0.5, 1 + resp);
    const humor = ctx.humor || "normal";

    // Cabeça: olha o celular (desce) ou a câmera.
    const baixa = op.pose === "celular" ? 0.32 : 0;
    cabeca.rotation.set(baixa + ruido(t * 0.5, 3) * 0.03 + fala * Math.sin(t * 4.4) * 0.03 * env, (ctx.olharX || 0) * 0.4 + ruido(t * 0.3, 5) * 0.08, ruido(t * 0.4, 4) * 0.05 + (op.inclina || 0));

    // Olhos: abertura pela expressão; piscada achata o oval.
    const abre = { tedio: 0.5, desconfiado: 0.5, surpreso: 1.25, feliz: 0.7 }[humor] ?? 1;
    const fechar = clamp(ctx.piscar);
    olhos.forEach((o) => {
      const k = Math.max(0.07, abre * (1 - fechar));
      o.bola.scale.set(0.78, 1.15 * k, 0.35);
      o.bola.position.y = -0.042 * 1.15 * (1 - k) * 0.5;
      o.palp.visible = abre < 0.9 || fechar > 0.3;
      o.palp.position.y = o.bola.position.y + 0.042 * 1.15 * k + 0.002;
      o.brilho.visible = fechar < 0.4;
      o.brilho.position.y = o.bola.position.y + 0.018 * k;
    });

    // Sobrancelhas: preocupado (pontas internas sobem), bravo/desconfiado (descem), surpreso (sobem).
    const ang = { triste: 0.38, preocupado: 0.38, bravo: -0.35, desconfiado: -0.22, surpreso: 0.12, feliz: 0.05, tedio: -0.08 }[humor] ?? 0;
    const alt = { surpreso: 0.05, triste: 0.02, preocupado: 0.02, bravo: -0.02, desconfiado: -0.015, tedio: -0.02 }[humor] ?? 0;
    sobr.forEach(({ g, s }, i) => {
      // Desconfiado: uma sobe, a outra desce (como na referência).
      const assim = humor === "desconfiado" ? (i ? 0.45 : -0.1) : 1;
      g.rotation.z = ang * s * assim * -1;
      g.position.y = 0.1 + alt + (humor === "desconfiado" && i ? 0.03 : 0) + fala * env * 0.01;
    });

    const ab = clamp(env * 1.3) * fala;
    const base = { surpreso: [0.9, 1.1], triste: [1.3, 0.25], preocupado: [1.2, 0.3], desconfiado: [1.5, 0.35], tedio: [1.4, 0.22], feliz: [1.6, 0.4] }[humor] ?? [1.2, 0.3];
    boca.scale.set(base[0] * (1 - ab * 0.2), base[1] + ab * 1.0, 1);
    boca.position.x = humor === "desconfiado" ? 0.02 : 0;

    // Braços.
    bracos.forEach((b, i) => {
      const s = b.s;
      let xO = 0, zO = 0.1 * s, xC = -0.12, zC = 0;
      if (op.pose === "celular") {
        xO = -0.35; zO = 0.22 * s; xC = -1.75; zC = -0.55 * s;
      }
      if (fala && op.pose !== "celular") {
        xO += -0.12 - Math.max(0, Math.sin(t * 2.3 + i * 1.6)) * 0.3 * (0.4 + env);
        xC += -0.5 - Math.sin(t * 3 + i) * 0.2 * env;
      }
      if (acoes.has("acenar") && s < 0) {
        const k = smooth(0, 0.4, tl);
        zO = lerp(zO, 2.3 * s, k);
        zC = lerp(zC, (0.5 + Math.sin(tl * 9) * 0.45) * -s, k);
      }
      b.ombro.rotation.set(xO, 0, zO);
      b.cot.rotation.set(xC, 0, zC);
    });

    if (celular) {
      // Celular entre as mãos, inclinado para o rosto.
      bracos[0].mao.getWorldPosition(v);
      const w2 = bracos[1].mao.getWorldPosition(new THREE.Vector3());
      v.add(w2).multiplyScalar(0.5);
      corpo.worldToLocal(v);
      celular.position.copy(v).add(new THREE.Vector3(0, 0.02, 0.03));
      celular.rotation.set(-0.75, 0, 0);
    }

    const passo = ctx.andando ? Math.sin(t * 10) * 0.45 : 0;
    pernas[0].rotation.x = passo;
    pernas[1].rotation.x = -passo;
  }

  return { grupo: raiz, altura: 1.95, atualizar };
}
