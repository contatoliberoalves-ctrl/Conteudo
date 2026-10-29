// Visual de ilustração: sombra chapada em 3 tons e contorno preto (casca invertida
// empurrada pela normal em espaço de mundo, então a linha não engorda com a escala).
import * as THREE from "three";

let rampa = null;
function gradiente() {
  if (rampa) return rampa;
  const d = new Uint8Array([105, 105, 105, 255, 185, 185, 185, 255, 255, 255, 255, 255]);
  rampa = new THREE.DataTexture(d, 3, 1, THREE.RGBAFormat);
  rampa.minFilter = rampa.magFilter = THREE.NearestFilter;
  rampa.needsUpdate = true;
  return rampa;
}

export function toon(c, extra = {}) {
  return new THREE.MeshToonMaterial({ color: new THREE.Color(c), gradientMap: gradiente(), ...extra });
}

const cache = new Map();
function materialContorno(cor, espessura) {
  const k = `${cor}|${espessura}`;
  if (!cache.has(k))
    cache.set(k, new THREE.ShaderMaterial({
      uniforms: { cor: { value: new THREE.Color(cor) }, e: { value: espessura } },
      vertexShader: `uniform float e;
        void main() {
          vec4 w = modelMatrix * vec4(position, 1.0);
          vec3 n = normalize(mat3(modelMatrix) * normal);
          w.xyz += n * e;
          gl_Position = projectionMatrix * viewMatrix * w;
        }`,
      fragmentShader: `uniform vec3 cor; void main() { gl_FragColor = vec4(cor, 1.0); }`,
      side: THREE.BackSide,
    }));
  return cache.get(k);
}

// Põe contorno em toda malha opaca do grupo (marque obj.userData.semContorno para pular).
export function contornar(grupo, espessura = 0.012, cor = "#17171c") {
  const malhas = [];
  grupo.traverse((o) => {
    if (o.isMesh && !o.userData.contorno && !o.userData.semContorno && !(o.material && o.material.transparent)) malhas.push(o);
  });
  for (const o of malhas) {
    const c = new THREE.Mesh(o.geometry, materialContorno(cor, o.userData.espessura ?? espessura));
    c.userData.contorno = true;
    c.frustumCulled = false;
    o.add(c);
  }
  return grupo;
}
