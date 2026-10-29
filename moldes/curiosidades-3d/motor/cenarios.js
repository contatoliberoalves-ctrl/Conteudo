// Cenários: cada um devolve { grupo, fundo, neblina, atualizar(t) } com as próprias luzes.
import * as THREE from "three";
import { material, cor, rng, TuboVivo, ruido, hash } from "./util.js";
import { peixe, planeta } from "./personagens.js";
import { toon, contornar } from "./toon.js";

function degrade(cores, alto = 512) {
  const c = document.createElement("canvas");
  c.width = 4; c.height = alto;
  const g = c.getContext("2d");
  const lg = g.createLinearGradient(0, 0, 0, alto);
  cores.forEach(([p, k]) => lg.addColorStop(p, k));
  g.fillStyle = lg;
  g.fillRect(0, 0, 4, alto);
  const tx = new THREE.CanvasTexture(c);
  tx.colorSpace = THREE.SRGBColorSpace;
  return tx;
}

function luzChave(grupo, { corLuz = "#fff4e0", intensidade = 2.4, pos = [4, 9, 6], alcance = 9 } = {}) {
  const l = new THREE.DirectionalLight(cor(corLuz), intensidade);
  l.position.set(...pos);
  l.castShadow = true;
  l.shadow.mapSize.set(1024, 1024);
  l.shadow.camera.left = -alcance; l.shadow.camera.right = alcance;
  l.shadow.camera.top = alcance; l.shadow.camera.bottom = -alcance;
  l.shadow.camera.near = 1; l.shadow.camera.far = 40;
  l.shadow.bias = -0.0008;
  l.shadow.radius = 4;
  grupo.add(l, l.target);
  return l;
}

function rocha(r, raio, c) {
  const geo = new THREE.DodecahedronGeometry(raio, 1);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const k = 0.8 + r() * 0.35;
    p.setXYZ(i, p.getX(i) * k, p.getY(i) * k * 0.75, p.getZ(i) * k);
  }
  geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, material(c, { roughness: 0.9, flatShading: true }));
  m.castShadow = m.receiveShadow = true;
  return m;
}

// ---------------------------------------------------------------- Fundo do mar

export function fundoDoMar(op = {}) {
  const grupo = new THREE.Group();
  const r = rng(op.semente || 21);
  const uTempo = { value: 0 };

  // Areia com dunas e cáusticas animadas (shader injetado no material padrão).
  const geo = new THREE.PlaneGeometry(70, 70, 160, 160);
  geo.rotateX(-Math.PI / 2);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), z = p.getZ(i);
    const d = Math.sqrt(x * x + z * z);
    const h = Math.sin(x * 0.35 + z * 0.12) * 0.18 + ruido(x * 0.3, 1) * ruido(z * 0.3, 2) * 0.5;
    p.setY(i, d < 3.5 ? h * (d / 3.5) ** 2 : h);
  }
  geo.computeVertexNormals();
  const areia = material(op.corAreia || "#e8d5a3", { roughness: 0.95 });
  areia.onBeforeCompile = (sh) => {
    sh.uniforms.uTempo = uTempo;
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vMundo;")
      .replace("#include <worldpos_vertex>", "#include <worldpos_vertex>\nvMundo = (modelMatrix * vec4(transformed, 1.0)).xyz;");
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", `#include <common>
varying vec3 vMundo; uniform float uTempo;
float caustica(vec2 q, float t){
  vec2 p = mod(q, 6.28318) - 250.0; vec2 i = p; float c = 1.0; float inten = 0.005;
  for (int n = 0; n < 4; n++) {
    float tt = t * (1.0 - (3.5 / float(n + 1)));
    i = p + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
    c += 1.0 / length(vec2(p.x / (sin(i.x + tt) / inten), p.y / (cos(i.y + tt) / inten)));
  }
  c /= 4.0; c = 1.17 - pow(c, 1.4);
  return clamp(pow(abs(c), 8.0), 0.0, 1.0);
}`)
      .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\ntotalEmissiveRadiance += vec3(0.75, 0.95, 1.0) * caustica(vMundo.xz * 0.9, uTempo * 0.6) * 0.45;");
  };
  const chao = new THREE.Mesh(geo, areia);
  chao.receiveShadow = true;
  grupo.add(chao);

  // Rochas nas laterais e ao fundo, deixando o centro livre para os atores.
  const posRochas = [[-4.2, -2], [4.5, -1.5], [-2.8, -6], [3.2, -7], [0.5, -10], [-6.5, -4], [6.8, -5]];
  posRochas.forEach(([x, z], i) => {
    const m = rocha(r, 0.7 + r() * 1.1, i % 2 ? "#6c7a89" : "#57707c");
    m.position.set(x, 0.2, z);
    m.rotation.y = r() * 6;
    grupo.add(m);
  });

  // Algas: tubos que balançam.
  const algas = [];
  const mAlga = material("#2a9d8f", { roughness: 0.6 });
  const mAlga2 = material("#52b788", { roughness: 0.6 });
  [[-3.6, -1.2], [-3.2, -1.8], [-4.4, -0.6], [3.9, -0.9], [4.4, -2.2], [3.4, -2.6], [-1.6, -5.2], [1.8, -4.8], [-5.5, -3], [5.6, -3.4]].forEach(([x, z], i) => {
    const alt = 1.4 + r() * 1.6;
    const tubo = new TuboVivo(18, 8, (s) => 0.07 * (1 - s * 0.7), i % 2 ? mAlga : mAlga2);
    grupo.add(tubo.mesh);
    algas.push({ tubo, x, z, alt, fase: r() * 6, pts: Array.from({ length: 19 }, () => new THREE.Vector3()) });
  });

  // Corais: galhos com pontas redondas.
  const mCoral = [material("#ff8fab", { roughness: 0.7 }), material("#ffb4a2", { roughness: 0.7 }), material("#f77f00", { roughness: 0.7 })];
  [[-2.4, -2.6], [2.6, -3.2], [-5, -1.2], [5.2, -1.4]].forEach(([x, z], ci) => {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    const m = mCoral[ci % 3];
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * Math.PI * 2 + r();
      const inc = 0.3 + r() * 0.4, alt = 0.5 + r() * 0.6;
      const galho = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, alt, 8), m);
      galho.position.set(Math.cos(a) * Math.sin(inc) * alt * 0.5, alt * 0.5 * Math.cos(inc), Math.sin(a) * Math.sin(inc) * alt * 0.5);
      galho.rotation.set(Math.sin(a) * inc, 0, -Math.cos(a) * inc);
      galho.castShadow = true;
      const ponta = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 8), m);
      ponta.position.set(Math.cos(a) * Math.sin(inc) * alt, alt * Math.cos(inc), Math.sin(a) * Math.sin(inc) * alt);
      g.add(galho, ponta);
    }
    grupo.add(g);
  });

  // Bolhas sobem em laço determinístico.
  const bolhas = [];
  const mBolha = new THREE.MeshPhysicalMaterial({ color: "#e0fbfc", transparent: true, opacity: 0.45, roughness: 0.05 });
  const geoB = new THREE.SphereGeometry(1, 12, 8);
  for (let i = 0; i < 36; i++) {
    const b = new THREE.Mesh(geoB, mBolha);
    const s = 0.03 + hash(i, 9) * 0.05;
    b.scale.setScalar(s);
    grupo.add(b);
    bolhas.push({ b, x: (hash(i, 1) - 0.5) * 12, z: -1 - hash(i, 2) * 9, v: 0.5 + hash(i, 3) * 0.6, o: hash(i, 4) * 8 });
  }

  // Raios de luz vindos da superfície.
  const mRaio = new THREE.MeshBasicMaterial({ color: "#e0fbfc", transparent: true, opacity: 0.07, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
  const raios = [];
  for (let i = 0; i < 5; i++) {
    const c = new THREE.Mesh(new THREE.ConeGeometry(1.2 + hash(i, 5), 18, 24, 1, true), mRaio);
    c.position.set(-6 + i * 3.2, 9, -6 - hash(i, 6) * 5);
    c.rotation.z = 0.25;
    grupo.add(c);
    raios.push(c);
  }

  // Cardume ao fundo.
  const peixes = [];
  ["#ffd166", "#06d6a0", "#ffd166", "#ef476f", "#ffd166", "#118ab2"].forEach((c, i) => {
    const f = peixe({ cor: c, fase: i });
    f.grupo.scale.setScalar(0.8 + hash(i, 7) * 0.5);
    grupo.add(f.grupo);
    peixes.push({ f, raio: 5 + i * 0.8, alt: 2.2 + hash(i, 8) * 2.5, vel: 0.18 + hash(i, 9) * 0.12, fase: i * 1.3, sentido: i % 2 ? 1 : -1 });
  });

  grupo.add(new THREE.HemisphereLight(cor("#bde0fe"), cor("#0a4d68"), 1.3));
  luzChave(grupo, { corLuz: "#fff3d6", intensidade: 2.6, pos: [2, 12, 5] });
  const contra = new THREE.DirectionalLight(cor("#4cc9f0"), 1.4);
  contra.position.set(-4, 4, -8);
  grupo.add(contra);

  function atualizar(t) {
    uTempo.value = t;
    for (const a of algas) {
      for (let k = 0; k <= 18; k++) {
        const s = k / 18;
        const bal = Math.sin(t * 1.3 - s * 2.5 + a.fase) * 0.35 * s * s;
        a.pts[k].set(a.x + bal, s * a.alt, a.z + Math.cos(t * 0.9 + a.fase) * 0.15 * s * s);
      }
      a.tubo.atualizar(a.pts);
    }
    for (const b of bolhas) {
      const y = ((t * b.v + b.o) % 8);
      b.b.position.set(b.x + Math.sin(t * 2 + b.o) * 0.12, y, b.z);
    }
    raios.forEach((c, i) => { c.material.opacity = 0.06 + Math.sin(t * 0.8 + i) * 0.02; });
    for (const p of peixes) {
      const a = t * p.vel * p.sentido + p.fase;
      p.f.grupo.position.set(Math.cos(a) * p.raio, p.alt + Math.sin(t + p.fase) * 0.2, -6 + Math.sin(a) * p.raio * 0.5);
      p.f.grupo.rotation.y = -a * 1 - (p.sentido > 0 ? Math.PI / 2 : -Math.PI / 2);
      p.f.atualizar({ t });
    }
  }

  return {
    grupo,
    fundo: degrade([[0, "#4cc4d6"], [0.45, "#1d8aa8"], [1, "#0b4f6c"]]),
    neblina: new THREE.Fog(cor("#1f86a3"), 9, 32),
    atualizar,
  };
}

// ---------------------------------------------------------------- Espaço

export function espaco(op = {}) {
  const grupo = new THREE.Group();
  const r = rng(op.semente || 33);

  const geo = new THREE.PlaneGeometry(80, 80, 180, 180);
  geo.rotateX(-Math.PI / 2);
  const p = geo.attributes.position;
  const crateras = Array.from({ length: 26 }, () => ({ x: (r() - 0.5) * 40, z: -r() * 35 + 4, raio: 0.6 + r() * 2.2 }));
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), z = p.getZ(i);
    let h = ruido(x * 0.4, 1) * ruido(z * 0.4, 2) * 0.3;
    for (const c of crateras) {
      const d = Math.hypot(x - c.x, z - c.z) / c.raio;
      if (d < 1.3) h += d < 1 ? -(1 - d * d) * 0.35 * c.raio * 0.4 : Math.sin((d - 1) / 0.3 * Math.PI) * 0.12 * c.raio * 0.4;
    }
    const centro = Math.hypot(x, z);
    p.setY(i, centro < 3 ? h * (centro / 3) ** 2 : h);
  }
  geo.computeVertexNormals();
  const solo = new THREE.Mesh(geo, material(op.corSolo || "#c9c6d6", { roughness: 1 }));
  solo.receiveShadow = true;
  grupo.add(solo);

  // Estrelas numa esfera distante.
  const n = 1400, est = new Float32Array(n * 3), tam = [];
  for (let i = 0; i < n; i++) {
    const u = r() * 2 - 1, a = r() * Math.PI * 2, s = Math.sqrt(1 - u * u);
    est.set([Math.cos(a) * s * 90, Math.abs(u) * 90 - 5, Math.sin(a) * s * 90], i * 3);
  }
  const gEst = new THREE.BufferGeometry();
  gEst.setAttribute("position", new THREE.BufferAttribute(est, 3));
  const estrelas = new THREE.Points(gEst, new THREE.PointsMaterial({ color: "#ffffff", size: 0.22, sizeAttenuation: true, fog: false }));
  grupo.add(estrelas);

  const decor = planeta({ raio: 5, aneis: op.aneis ?? true, cor: op.corPlaneta || "#f4a261", cor2: "#e76f51", faixas: true, crateras: 0, giro: 0.05 });
  decor.grupo.position.set(-9, 7, -38);
  decor.grupo.rotation.z = 0.3;
  decor.grupo.traverse((m) => { if (m.material) m.material.fog = false; });
  grupo.add(decor.grupo);

  grupo.add(new THREE.HemisphereLight(cor("#9fa8ff"), cor("#2b2d42"), 0.8));
  luzChave(grupo, { corLuz: "#fff1db", intensidade: 3.2, pos: [7, 8, 4] });
  const contra = new THREE.DirectionalLight(cor("#7bdff2"), 1.6);
  contra.position.set(-5, 3, -6);
  grupo.add(contra);

  return {
    grupo,
    fundo: degrade([[0, "#05061a"], [0.7, "#141a3d"], [1, "#2a2f5c"]]),
    neblina: new THREE.Fog(cor("#1b1f45"), 25, 70),
    atualizar(t) {
      decor.atualizar({ t, acoes: new Set(), boca: 0, piscar: 0 });
      estrelas.rotation.y = t * 0.005;
    },
  };
}

// ---------------------------------------------------------------- Estúdio (fundo infinito colorido)

export function estudio(op = {}) {
  const grupo = new THREE.Group();
  const r = rng(op.semente || 44);
  const base = op.cor || "#8ecae6";

  // Perfil em L com curva, extrudado na largura.
  const s = new THREE.Shape();
  s.moveTo(14, -0.02);
  s.lineTo(-6, -0.02);
  s.quadraticCurveTo(-11, -0.02, -11, 5);
  s.lineTo(-11, 22);
  s.lineTo(-11.3, 22);
  s.lineTo(-11.3, -0.3);
  s.lineTo(14, -0.3);
  const geo = new THREE.ExtrudeGeometry(s, { depth: 60, bevelEnabled: false, curveSegments: 32 });
  geo.translate(0, 0, -30);
  const fundo = new THREE.Mesh(geo, material(base, { roughness: 0.95 }));
  fundo.rotation.y = -Math.PI / 2;
  fundo.receiveShadow = true;
  grupo.add(fundo);

  // Objetos de cena apoiados no chão, nas laterais.
  const paleta = op.paleta || ["#ffb703", "#fb8500", "#219ebc", "#ffffff", "#e63946"];
  const formas = [
    () => new THREE.SphereGeometry(0.7, 32, 24),
    () => new THREE.CylinderGeometry(0.6, 0.6, 1.6, 32),
    () => new THREE.TorusGeometry(0.7, 0.25, 16, 48),
    () => new THREE.BoxGeometry(1.1, 1.1, 1.1),
    () => new THREE.ConeGeometry(0.7, 1.5, 32),
  ];
  (op.objetos === false ? [] : [[-4.2, -2.5], [4.4, -2.8], [-6, -5.5], [6.2, -6], [-2.8, -7.5], [3.2, -8]]).forEach(([x, z], i) => {
    const g = formas[i % formas.length]();
    g.computeBoundingBox();
    const m = new THREE.Mesh(g, material(paleta[i % paleta.length], { roughness: 0.4 }));
    m.position.set(x, -g.boundingBox.min.y, z);
    if (i % formas.length === 2) { m.rotation.x = Math.PI / 2; m.position.y = 0.95; }
    m.rotation.y = r() * 6;
    m.castShadow = m.receiveShadow = true;
    grupo.add(m);
  });

  grupo.add(new THREE.HemisphereLight(cor("#ffffff"), cor(base), 1.4));
  luzChave(grupo, { corLuz: "#fff6e8", intensidade: 2.6, pos: [5, 10, 7] });
  const preenche = new THREE.DirectionalLight(cor("#cde7ff"), 0.9);
  preenche.position.set(-6, 4, 5);
  grupo.add(preenche);

  return {
    grupo,
    fundo: cor(base),
    neblina: new THREE.Fog(cor(base), 22, 60),
    atualizar() {},
  };
}



// ---------------------------------------------------------------- Quarto (ilustração, noite chuvosa)

export function quarto(op = {}) {
  const grupo = new THREE.Group();
  const parede = toon(op.parede || "#56606b");
  const piso = toon(op.piso || "#4a3d33");
  const madeira = toon("#6b4f3a");
  const tecidoSofa = toon(op.sofa || "#5e5650");
  const caixa = (w, h, d, mat, x, y, z) => {
    const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    o.position.set(x, y, z);
    o.castShadow = o.receiveShadow = true;
    grupo.add(o);
    return o;
  };

  // Piso de tábuas (faixas alternadas) e paredes.
  for (let i = -8; i <= 8; i++) caixa(0.5, 0.02, 9, i % 2 ? piso : toon("#43372e"), i * 0.5, -0.01, -0.5).userData.semContorno = true;
  caixa(9, 5, 0.1, parede, 0, 2.5, -3.2).userData.semContorno = true;
  caixa(0.1, 5, 9, toon("#4b545e"), -3.6, 2.5, 0).userData.semContorno = true;
  caixa(9, 0.12, 0.06, toon("#3c434b"), 0, 0.06, -3.13);

  // Janela com grade e chuva lá fora.
  const jx = 1.3, jy = 2.0;
  const vidro = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 1.9), new THREE.MeshBasicMaterial({ color: op.ceu || "#2d4763" }));
  vidro.position.set(jx, jy, -3.14);
  vidro.userData.semContorno = true;
  grupo.add(vidro);
  const moldura = toon("#c9cdd2");
  caixa(2.2, 0.1, 0.12, moldura, jx, jy + 1.0, -3.1);
  caixa(2.2, 0.14, 0.25, moldura, jx, jy - 1.0, -3.05);
  caixa(0.1, 2.0, 0.12, moldura, jx - 1.05, jy, -3.1);
  caixa(0.1, 2.0, 0.12, moldura, jx + 1.05, jy, -3.1);
  caixa(0.06, 1.9, 0.1, moldura, jx, jy, -3.1);
  for (let i = 1; i < 5; i++) caixa(0.025, 1.9, 0.05, toon("#8d939b"), jx - 1 + i * 0.4, jy, -3.07);
  caixa(2.0, 0.04, 0.08, moldura, jx, jy + 0.2, -3.08);
  // Prédios ao longe.
  const predio = new THREE.MeshBasicMaterial({ color: "#1f3048" });
  [[-0.7, 0.9, 0.35], [-0.25, 0.6, 0.3], [0.2, 1.1, 0.4], [0.65, 0.7, 0.3]].forEach(([x, h, w]) => {
    const o = new THREE.Mesh(new THREE.PlaneGeometry(w, h), predio);
    o.position.set(jx + x, jy - 0.95 + h / 2, -3.13);
    o.userData.semContorno = true;
    grupo.add(o);
  });
  const chuva = [];
  const mChuva = new THREE.MeshBasicMaterial({ color: "#8fb3d9", transparent: true, opacity: 0.55 });
  for (let i = 0; i < 40; i++) {
    const o = new THREE.Mesh(new THREE.PlaneGeometry(0.008, 0.12), mChuva);
    o.rotation.z = 0.15;
    grupo.add(o);
    chuva.push({ o, x: jx - 0.95 + hash(i, 1) * 1.9, v: 2.5 + hash(i, 2) * 1.5, f: hash(i, 3) * 2 });
  }

  // Sofá à direita, mesa lateral com abajur à esquerda, quadro na parede.
  const sofa = new THREE.Group();
  sofa.position.set(op.sofaX ?? 2.2, 0, -2.3);
  grupo.add(sofa);
  const add = (geo, mat, x, y, z) => { const o = new THREE.Mesh(geo, mat); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; sofa.add(o); return o; };
  add(new THREE.BoxGeometry(2.2, 0.42, 0.9), tecidoSofa, 0, 0.3, 0);
  add(new THREE.BoxGeometry(2.2, 0.7, 0.25), tecidoSofa, 0, 0.75, -0.35);
  add(new THREE.CapsuleGeometry(0.16, 0.6, 8, 16), tecidoSofa, -1.08, 0.62, 0.0).rotation.x = Math.PI / 2;
  add(new THREE.BoxGeometry(0.95, 0.14, 0.75), toon("#6a625b"), -0.5, 0.56, 0.05);
  add(new THREE.BoxGeometry(0.95, 0.14, 0.75), toon("#6a625b"), 0.5, 0.56, 0.05);

  const mesa = new THREE.Group();
  mesa.position.set(-2.3, 0, -2.4);
  grupo.add(mesa);
  const tampo = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.06, 0.5), madeira);
  tampo.position.y = 0.62;
  mesa.add(tampo);
  [[-0.3, -0.2], [0.3, -0.2], [-0.3, 0.2], [0.3, 0.2]].forEach(([x, z]) => {
    const p = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.6, 0.05), madeira);
    p.position.set(x, 0.3, z);
    mesa.add(p);
  });
  const haste = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.45, 12), toon("#2e3035"));
  haste.position.y = 0.88;
  mesa.add(haste);
  const cupula = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.22, 0.26, 32, 1, true), toon("#e8cf9f", { side: THREE.DoubleSide, emissive: new THREE.Color("#7a5a2a") }));
  cupula.position.y = 1.15;
  mesa.add(cupula);
  const luzAbajur = new THREE.PointLight("#ffb46b", 4.5, 6, 1.6);
  luzAbajur.position.set(0, 1.1, 0.1);
  luzAbajur.castShadow = true;
  luzAbajur.shadow.mapSize.set(512, 512);
  mesa.add(luzAbajur);

  const quadro = new THREE.Group();
  quadro.position.set(-1.2, 2.3, -3.12);
  grupo.add(quadro);
  quadro.add(new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.75, 0.05), toon("#2f2a26")));
  const arte = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.6), toon("#7d8a73"));
  arte.position.z = 0.03;
  quadro.add(arte);

  contornar(grupo, 0.012);

  // Luz: azul fria da janela + abajur quente + preenchimento fraco.
  grupo.add(new THREE.AmbientLight(new THREE.Color("#a9b8cc"), 1.0));
  const janela = new THREE.DirectionalLight(new THREE.Color("#a9c7ee"), 1.6);
  janela.position.set(jx + 1, 4, -6);
  janela.target.position.set(0, 0, 1);
  grupo.add(janela, janela.target);
  const frente = new THREE.DirectionalLight(new THREE.Color("#dfe6f0"), 2.0);
  frente.position.set(2, 4, 6);
  frente.castShadow = true;
  frente.shadow.mapSize.set(1024, 1024);
  frente.shadow.bias = -0.0006;
  frente.shadow.normalBias = 0.03;
  frente.shadow.camera.left = -5; frente.shadow.camera.right = 5; frente.shadow.camera.top = 5; frente.shadow.camera.bottom = -5;
  grupo.add(frente, frente.target);

  return {
    grupo,
    fundo: new THREE.Color("#1d2229"),
    neblina: null,
    atualizar(t) {
      for (const c of chuva) {
        const y = 1.9 - (((t + c.f) * c.v) % 1.9);
        c.o.position.set(c.x - (1.9 - y) * 0.15 + 0.15, jy - 0.95 + y, -3.12);
      }
    },
  };
}


export const CENARIOS = { "fundo-do-mar": fundoDoMar, espaco, estudio, quarto };
