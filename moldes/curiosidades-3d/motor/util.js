// Funções puras de tempo: tudo o que aparece no vídeo é função de t.
import * as THREE from "three";

export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = (a, b, x) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export const ease = {
  linear: (t) => t,
  in: (t) => t * t * t,
  out: (t) => 1 - Math.pow(1 - t, 3),
  inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  back: (t) => {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
};

// Mola subamortecida de 0 → 1 (amortecimento ~0.45–0.6 = "brincalhão").
export function mola(t, amort = 0.5, freq = 2.2) {
  if (t <= 0) return 0;
  const w = freq * 2 * Math.PI;
  const wd = w * Math.sqrt(1 - amort * amort);
  return 1 - Math.exp(-amort * w * t) * (Math.cos(wd * t) + ((amort * w) / wd) * Math.sin(wd * t));
}

// Ruído determinístico: hash de inteiro → [0,1).
export function hash(n, s = 0) {
  let x = Math.imul((n | 0) ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(s | 0, 0xc2b2ae35);
  x ^= x >>> 16; x = Math.imul(x, 0x7feb352d); x ^= x >>> 15; x = Math.imul(x, 0x846ca68b); x ^= x >>> 16;
  return (x >>> 0) / 4294967296;
}

export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Ruído 1D suave (valor interpolado), para "câmera na mão" e balanços.
export function ruido(x, s = 0) {
  const i = Math.floor(x), f = x - i;
  const u = f * f * (3 - 2 * f);
  return lerp(hash(i, s), hash(i + 1, s), u) * 2 - 1;
}

export const cor = (c) => new THREE.Color(c);

export function material(c, extra = {}) {
  return new THREE.MeshStandardMaterial({ color: cor(c), roughness: 0.55, metalness: 0, ...extra });
}

// Tubo com raio variável cujos vértices são reescritos a cada quadro
// (tentáculos, algas): pontos(t) devolve a espinha atual.
export class TuboVivo {
  constructor(segmentos, lados, raio, mat) {
    this.n = segmentos; this.l = lados; this.raio = raio;
    const pos = new Float32Array((segmentos + 1) * (lados + 1) * 3 + 6);
    const idx = [];
    for (let i = 0; i < segmentos; i++)
      for (let j = 0; j < lados; j++) {
        const a = i * (lados + 1) + j, b = a + lados + 1;
        idx.push(a, b, a + 1, b, b + 1, a + 1);
      }
    const ponta = (segmentos + 1) * (lados + 1);
    for (let j = 0; j < lados; j++) idx.push(segmentos * (lados + 1) + j, ponta, segmentos * (lados + 1) + j + 1);
    this.geo = new THREE.BufferGeometry();
    this.geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    this.geo.setIndex(idx);
    this.mesh = new THREE.Mesh(this.geo, mat);
    this.mesh.castShadow = true;
    this.mesh.frustumCulled = false;
    this._t = new THREE.Vector3(); this._n = new THREE.Vector3(); this._b = new THREE.Vector3();
  }
  atualizar(pts) {
    const p = this.geo.attributes.position.array;
    const up = new THREE.Vector3(0, 0, 1);
    let k = 0;
    for (let i = 0; i <= this.n; i++) {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(this.n, i + 1)];
      this._t.subVectors(b, a).normalize();
      if (Math.abs(this._t.dot(up)) > 0.95) up.set(1, 0, 0);
      this._n.crossVectors(this._t, up).normalize();
      this._b.crossVectors(this._t, this._n).normalize();
      const r = this.raio(i / this.n);
      for (let j = 0; j <= this.l; j++) {
        const ang = (j / this.l) * Math.PI * 2;
        const c = Math.cos(ang) * r, s = Math.sin(ang) * r;
        p[k++] = pts[i].x + this._n.x * c + this._b.x * s;
        p[k++] = pts[i].y + this._n.y * c + this._b.y * s;
        p[k++] = pts[i].z + this._n.z * c + this._b.z * s;
      }
    }
    const fim = pts[this.n];
    p[k++] = fim.x + this._t.x * 0.02; p[k++] = fim.y + this._t.y * 0.02; p[k++] = fim.z + this._t.z * 0.02;
    this.geo.attributes.position.needsUpdate = true;
    this.geo.computeVertexNormals();
  }
}
