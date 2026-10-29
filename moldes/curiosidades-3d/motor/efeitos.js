// Efeitos de cena presos a um ator ("alvo"). Cada um devolve { grupo, atualizar(ctx) },
// com ctx = { tl, dur, t, alvo (ator), fonte }.
import * as THREE from "three";
import { TextGeometry } from "../lib/addons/TextGeometry.js";
import { material, mola, smooth, clamp, hash, cor } from "./util.js";

function coracaoGeo() {
  const s = new THREE.Shape();
  s.moveTo(0, -0.5);
  s.bezierCurveTo(-0.15, -0.35, -0.6, -0.05, -0.55, 0.22);
  s.bezierCurveTo(-0.5, 0.52, -0.12, 0.55, 0, 0.3);
  s.bezierCurveTo(0.12, 0.55, 0.5, 0.52, 0.55, 0.22);
  s.bezierCurveTo(0.6, -0.05, 0.15, -0.35, 0, -0.5);
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.18, bevelEnabled: true, bevelSize: 0.08, bevelThickness: 0.08, bevelSegments: 6, curveSegments: 24 });
  g.center();
  return g;
}

// Corações que aparecem um a um e batem no ritmo.
function coracoes(op) {
  const grupo = new THREE.Group();
  const n = op.quantidade || 3;
  const geo = coracaoGeo();
  const itens = [];
  for (let i = 0; i < n; i++) {
    const m = new THREE.Mesh(geo, material(op.cor || "#e63946", { roughness: 0.3 }));
    m.castShadow = true;
    grupo.add(m);
    itens.push(m);
  }
  return {
    grupo,
    atualizar({ tl, t, alvo }) {
      const p = alvo.grupo.position;
      itens.forEach((m, i) => {
        const x = (i - (n - 1) / 2) * 0.62;
        const entra = mola(tl - 0.3 - i * 0.35, 0.45, 1.6);
        const bate = 1 + Math.max(0, Math.sin(t * 7 - i * 0.6)) * 0.12;
        m.scale.setScalar(Math.max(0.001, entra * bate * (op.tamanho || 0.42)));
        m.position.set(p.x + x, p.y + 2.35 + Math.sin(t * 2 + i) * 0.05 + (1 - entra) * -0.5, p.z + 0.4);
        m.rotation.y = Math.sin(t * 1.5 + i) * 0.35;
      });
    },
  };
}

// Gota grande que cai e balança (sangue azul, água...).
function gota(op) {
  const pts = [];
  for (let i = 0; i <= 24; i++) {
    const a = (i / 24) * Math.PI;
    const r = Math.sin(a) * (1 - Math.cos(a)) * 0.5;
    pts.push(new THREE.Vector2(r * 0.9, Math.cos(a) * 0.9));
  }
  const geo = new THREE.LatheGeometry(pts, 48);
  const m = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ color: cor(op.cor || "#1e6bff"), roughness: 0.08, clearcoat: 1, clearcoatRoughness: 0.1 }));
  m.castShadow = true;
  const grupo = new THREE.Group();
  grupo.add(m);
  return {
    grupo,
    atualizar({ tl, t, alvo }) {
      const p = alvo.grupo.position;
      const cai = smooth(0.2, 0.75, tl);
      const quica = mola(tl - 0.75, 0.35, 2.4);
      const esm = tl > 0.75 ? (1 - quica) * 0.35 : 0;
      const s = (op.tamanho || 0.9) * (tl < 0.2 ? 0.001 : 1);
      m.scale.set(s * (1 + esm), s * (1 - esm), s * (1 + esm));
      grupo.position.set(p.x + (op.x ?? 1.25), 0.85 * s + (1 - cai) * 5, p.z + 0.6);
      m.rotation.y = t * 0.6;
    },
  };
}

// Número ou texto curto em 3D (só caracteres ASCII da fonte Helvetiker).
function numero(op, fonte) {
  const geo = new TextGeometry(String(op.valor ?? "3"), { font: fonte, size: 1, depth: 0.35, curveSegments: 10, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.04, bevelSegments: 5 });
  geo.center();
  const m = new THREE.Mesh(geo, material(op.cor || "#ffb703", { roughness: 0.3, metalness: 0.1 }));
  m.castShadow = true;
  const grupo = new THREE.Group();
  grupo.add(m);
  return {
    grupo,
    atualizar({ tl, t, alvo }) {
      const p = alvo.grupo.position;
      const e = mola(tl - 0.15, 0.45, 1.4);
      const s = Math.max(0.001, e * (op.tamanho || 1.6));
      m.scale.setScalar(s);
      grupo.position.set(p.x + (op.x ?? 0), p.y + (op.y ?? 3.2), p.z + (op.z ?? -1.2));
      m.rotation.y = Math.sin(t * 0.9) * 0.25 + (1 - e) * 1.5;
    },
  };
}

// Pulsos de luz correndo pelos tentáculos do polvo ("neurônios nos braços").
function neuronios(op) {
  const grupo = new THREE.Group();
  const geo = new THREE.SphereGeometry(0.075, 12, 8);
  const mat = new THREE.MeshBasicMaterial({ color: cor(op.cor || "#fff3b0") });
  const pulsos = [];
  for (let i = 0; i < 24; i++) {
    const m = new THREE.Mesh(geo, mat);
    grupo.add(m);
    pulsos.push({ m, tent: i % 8, fase: hash(i, 2), vel: 0.6 + hash(i, 3) * 0.5 });
  }
  const v = new THREE.Vector3();
  return {
    grupo,
    atualizar({ tl, alvo }) {
      const tents = alvo.tentaculos || [];
      const vis = smooth(0.2, 0.6, tl);
      for (const p of pulsos) {
        const tt = tents[p.tent];
        if (!tt) { p.m.visible = false; continue; }
        const s = (tl * p.vel + p.fase) % 1;
        const k = Math.min(21, Math.floor(s * 22));
        v.copy(tt.pts[k]).lerp(tt.pts[k + 1], s * 22 - k);
        alvo.grupo.localToWorld(v);
        p.m.position.copy(v);
        p.m.visible = vis > 0.01;
        p.m.scale.setScalar(vis * (1 - s * 0.6));
      }
    },
  };
}

// Símbolos flutuando em volta do alvo ("?", "!", "zZ").
function simbolos(op, fonte) {
  const grupo = new THREE.Group();
  const geo = new TextGeometry(op.texto || "?", { font: fonte, size: 0.5, depth: 0.12, curveSegments: 8, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.02, bevelSegments: 3 });
  geo.center();
  const itens = [0, 1, 2].map((i) => {
    const m = new THREE.Mesh(geo, material(op.cor || "#ffffff", { roughness: 0.3 }));
    grupo.add(m);
    return m;
  });
  return {
    grupo,
    atualizar({ tl, t, alvo }) {
      const p = alvo.grupo.position;
      itens.forEach((m, i) => {
        const e = mola(tl - 0.2 - i * 0.25, 0.5, 1.8);
        m.scale.setScalar(Math.max(0.001, e * (0.8 + i * 0.15)));
        const a = i * 2.1 + t * 0.4;
        m.position.set(p.x + Math.cos(a) * 1.1, p.y + 2.4 + i * 0.35 + Math.sin(t * 2 + i) * 0.08, p.z + Math.sin(a) * 0.4);
        m.rotation.z = Math.sin(t * 1.5 + i) * 0.2;
      });
    },
  };
}

export const EFEITOS = { coracoes, gota, numero, neuronios, simbolos };
