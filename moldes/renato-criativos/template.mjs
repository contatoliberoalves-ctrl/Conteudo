// Molde "Renato · Criativos": criativos de anúncio da plataforma Ponto do Verbum (Formação Bíblica, Pr. Renato Torres)
// na identidade Brasa, em feed (1080×1350) e stories (1080×1920, com as faixas de cima e de baixo livres).
// Cada post do dados.json é uma peça; "de": "<id>" herda os campos de outro post (o mesmo criativo no outro formato).
// Layouts: manchete, tipo, lista, cursos, nota, versiculo, numeros, passos, etiquetas, comparativo, busca,
// notificacao, aula, foto. Imagens (prints da plataforma, capas, foto) ficam em fotos/, fora do git.
import fs from 'node:fs';
import path from 'node:path';
import { C, G, FUNDOS, T, agua, esc, lista, pill, sim, rico as ricoBase } from '../renato-comum/brasa.mjs';

const aqui = path.dirname(new URL(import.meta.url).pathname);
const dados = JSON.parse(fs.readFileSync(path.join(aqui, 'dados.json'), 'utf8'));
const porId = Object.fromEntries(dados.map(c => [c.id, c]));
const foto = n => 'file://' + path.join(aqui, 'fotos', n);
export const fotosDe = c => [c.print, c.foto, c.capa, ...lista(c.cursos).map(x => x.capa)].filter(Boolean);
const rico = (s, f) => ricoBase(s, f).replace(/\n/g, '<br>');
const B = "font-family:'Bricolage Grotesque',sans-serif;letter-spacing:-.03em";

// Marca: símbolo + "Ponto do Verbum" + selo do autor.
const marca = (f, k) => `<div style="display:flex;align-items:center;gap:${18 * k}px;flex:none">${sim(f.sim, 62 * k)}
  <div style="${B};font-weight:700;font-size:${38 * k}px;color:${f.tit};line-height:1">Ponto do Verbum</div>
  <div style="margin-left:auto">${pill('RENATO TORRES', 19 * k, f === FUNDOS.degrade ? C.carvao : C.brasa, f === FUNDOS.degrade ? C.creme : '#fff')}</div></div>`;
// CTA: aponta para o botão do anúncio (fica logo abaixo da peça).
const cta = (c, f, k) => `<div style="display:flex;align-items:center;gap:${20 * k}px;flex:none">
  <span style="display:inline-flex;align-items:center;gap:${16 * k}px;background:${f === FUNDOS.degrade ? C.carvao : G};color:#fff;font-weight:700;font-size:${34 * k}px;padding:${22 * k}px ${40 * k}px;border-radius:999px;white-space:nowrap">${esc(c.cta || 'Toque em Saiba mais')}
  <svg width="${30 * k}" height="${30 * k}" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v15M5 13l7 7 7-7"/></svg></span>
  <span style="font-size:${24 * k}px;font-weight:500;color:${f.txt};opacity:.8;line-height:1.25">${esc(c.ctaSub || 'pontodoverbum.com.br')}</span></div>`;
const kicker = (t, f, k) => t ? `<div style="font-weight:700;font-size:${24 * k}px;letter-spacing:.2em;text-transform:uppercase;color:${f.kick};opacity:${f === FUNDOS.degrade ? .9 : 1}">${esc(t)}</div>` : '';
const titulo = (c, f, px) => `<div style="${T};font-size:${c.ts || px}px;line-height:1;color:${f.tit}">${rico(c.tituloPeca, f)}</div>`;
const sub = (t, f, px) => t ? `<div style="font-size:${px}px;font-weight:500;line-height:1.38;color:${f.txt};opacity:.92">${rico(t, f)}</div>` : '';
// Celular com um print da plataforma (a imagem começa no topo e é cortada embaixo).
const celular = (img, w, h) => `<div style="width:${w}px;height:${h}px;flex:none;border-radius:${w * .13}px;background:#160700;padding:${w * .028}px;box-shadow:0 40px 80px rgba(43,14,0,.35)">
  <div style="width:100%;height:100%;border-radius:${w * .105}px;overflow:hidden;background:#f6f5f3"><img src="${foto(img)}" style="width:100%;display:block"></div></div>`;
const cartao = (f, html, extra = '') => `<div style="background:${f === FUNDOS.creme ? '#fff' : f === FUNDOS.carvao ? 'rgba(255,244,232,.07)' : 'rgba(255,255,255,.16)'};border:2px solid ${f.linha};border-radius:28px;${extra}">${html}</div>`;
const check = (cor, px) => `<svg width="${px}" height="${px}" viewBox="0 0 24 24" fill="none" stroke="${cor}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="flex:none"><path d="M4 12.5l5.2 5.2L20 7"/></svg>`;

const L = {
  // Título grande + texto de um lado, celular com print do outro (feed) ou embaixo (stories).
  manchete: (c, f, k, st) => st
    ? `<div style="display:flex;flex-direction:column;gap:26px;height:100%">${kicker(c.kicker, f, 1.1)}${titulo(c, f, 104)}${sub(c.sub, f, 40)}
       <div style="flex:1;min-height:0;overflow:hidden;display:flex;justify-content:center;margin-top:10px">${celular(c.print, 620, 1342)}</div></div>`
    : `<div style="display:flex;gap:40px;height:100%"><div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:28px">${kicker(c.kicker, f, k)}${titulo(c, f, 92)}${sub(c.sub, f, 36)}</div>
       <div style="width:380px;overflow:hidden;display:flex;align-items:flex-start;padding-top:10px">${celular(c.print, 380, 822)}</div></div>`,
  // Só tipografia: frase grande e uma linha de apoio.
  tipo: (c, f, k) => `<div style="display:flex;flex-direction:column;justify-content:center;gap:${40 * k}px;height:100%">${kicker(c.kicker, f, k)}${titulo(c, f, 118 * k)}
    <div style="width:${120 * k}px;height:8px;background:${f === FUNDOS.degrade ? C.carvao : G};border-radius:8px"></div>${sub(c.sub, f, 44 * k)}</div>`,
  // Título + itens com visto.
  lista: (c, f, k) => `<div style="display:flex;flex-direction:column;justify-content:center;gap:${36 * k}px;height:100%">${kicker(c.kicker, f, k)}${titulo(c, f, 96 * k)}
    <div style="display:flex;flex-direction:column">${lista(c.itens).map(t => `<div style="display:flex;gap:${24 * k}px;align-items:center;padding:${27 * k}px 0;border-bottom:2px solid ${f.linha}">${check(f.num, 46 * k)}<span style="font-size:${43 * k}px;font-weight:500;line-height:1.28;color:${f.txt}">${rico(t, f)}</span></div>`).join('')}</div></div>`,
  // Os cursos da formação, cada um com a capa.
  cursos: (c, f, k, st) => `<div style="display:flex;flex-direction:column;justify-content:center;gap:${34 * k}px;height:100%">${kicker(c.kicker, f, k)}${titulo(c, f, 86 * k)}${sub(c.sub, f, 34 * k)}
    <div style="display:flex;flex-direction:column;gap:${22 * k}px">${lista(c.cursos).map(x => cartao(f, `<img src="${foto(x.capa)}" style="width:${st ? 360 : 290}px;aspect-ratio:16/9;object-fit:cover;border-radius:16px;flex:none">
      <div><div style="${B};font-weight:800;font-size:${42 * k}px;line-height:1.05;color:${f.tit}">${esc(x.nome)}</div><div style="font-size:${27 * k}px;font-weight:500;color:${f.txt};opacity:.8;margin-top:8px">${esc(x.info)}</div></div>`, `display:flex;align-items:center;gap:${30 * k}px;padding:${18 * k}px`)).join('')}</div></div>`,
  // Nota do celular (papel branco, título e linhas com visto).
  nota: (c, f, k) => `<div style="display:flex;flex-direction:column;justify-content:center;height:100%"><div style="background:#fffdf8;border-radius:36px;padding:${50 * k}px ${54 * k}px;box-shadow:0 30px 70px rgba(43,14,0,.28);color:#1c1c1e">
    <div style="display:flex;justify-content:space-between;font-size:${27 * k}px;font-weight:600;color:#e0a100"><span>‹ Notas</span><span>Concluído</span></div>
    <div style="font-size:${22 * k}px;color:#8a8a8e;text-align:center;margin:${16 * k}px 0 ${24 * k}px">${esc(c.data || 'hoje')}</div>
    <div style="font-size:${60 * k}px;font-weight:700;line-height:1.12;letter-spacing:-.02em">${esc(c.tituloPeca)}</div>
    <div style="display:flex;flex-direction:column;gap:${20 * k}px;margin-top:${30 * k}px">${lista(c.itens).map(t => `<div style="display:flex;gap:${20 * k}px;align-items:flex-start"><span style="width:${40 * k}px;height:${40 * k}px;border-radius:50%;background:#e0a100;display:flex;align-items:center;justify-content:center;flex:none;margin-top:4px">${check('#fff', 24 * k)}</span><span style="font-size:${41 * k}px;line-height:1.3">${esc(t)}</span></div>`).join('')}</div>
    ${c.fecho ? `<div style="font-size:${41 * k}px;line-height:1.3;margin-top:${30 * k}px;font-weight:600">${rico(c.fecho, FUNDOS.creme)}</div>` : ''}</div></div>`,
  // Versículo com referência e uma linha de apoio.
  versiculo: (c, f, k) => `<div style="display:flex;flex-direction:column;justify-content:center;gap:${36 * k}px;height:100%">
    <div style="${B};font-weight:800;font-size:${170 * k}px;line-height:.6;color:${f.num};height:${70 * k}px">“</div>
    <div style="${B};font-weight:700;font-size:${(c.ts || 68) * k}px;line-height:1.2;color:${f.tit}">${rico(c.texto, f)}</div>
    <div style="font-weight:700;font-size:${26 * k}px;letter-spacing:.2em;text-transform:uppercase;color:${f.kick}">${esc(c.ref)}</div>
    <div style="height:2px;background:${f.linha}"></div>${sub(c.sub, f, 40 * k)}</div>`,
  // Números grandes lado a lado.
  numeros: (c, f, k, st) => `<div style="display:flex;flex-direction:column;justify-content:center;gap:${44 * k}px;height:100%">${kicker(c.kicker, f, k)}${titulo(c, f, 96 * k)}
    <div style="display:flex;flex-direction:${st ? 'column' : 'row'};gap:${22 * k}px">${lista(c.numeros).map(n => cartao(f, `<div style="${B};font-weight:800;font-size:${(st ? 150 : 140)}px;min-width:${st ? 200 : 0}px;line-height:.9;color:${f.num}">${esc(n.n)}</div><div style="font-size:${32 * k}px;font-weight:600;line-height:1.25;color:${f.txt}">${esc(n.t)}</div>`, `flex:1;padding:${30 * k}px;display:flex;${st ? 'align-items:center;gap:36px' : 'flex-direction:column;gap:18px'}`)).join('')}</div>${sub(c.sub, f, 40 * k)}</div>`,
  // Passo a passo numerado.
  passos: (c, f, k) => `<div style="display:flex;flex-direction:column;justify-content:center;gap:${40 * k}px;height:100%">${kicker(c.kicker, f, k)}${titulo(c, f, 92 * k)}
    <div style="display:flex;flex-direction:column;gap:${38 * k}px">${lista(c.itens).map((t, i) => `<div style="display:flex;gap:${30 * k}px;align-items:center"><span style="width:${92 * k}px;height:${92 * k}px;border-radius:50%;background:${f === FUNDOS.degrade ? C.carvao : G};color:#fff;${B};font-weight:800;font-size:${46 * k}px;display:flex;align-items:center;justify-content:center;flex:none">${i + 1}</span>
      <span style="font-size:${44 * k}px;font-weight:500;line-height:1.28;color:${f.txt}">${rico(t, f)}</span></div>`).join('')}</div></div>`,
  // Etiquetas de texto no estilo dos stories, com o celular ao fundo.
  etiquetas: (c, f, k, st) => `<div style="position:relative;height:100%"><div style="position:absolute;inset:0;overflow:hidden"><div style="position:absolute;right:${st ? -60 : -50}px;top:${st ? 150 : 40}px;transform:rotate(7deg)">${celular(c.print, st ? 600 : 430, st ? 1298 : 930)}</div></div>
    <div style="position:relative;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:${30 * k}px;height:100%">${lista(c.etiquetas).map((e, i) => `<div style="transform:rotate(${[-2, 1.2, -1, 1.5][i % 4]}deg);display:flex;flex-direction:column;align-items:flex-start">${lista(e).map(l => `<span style="background:${i % 2 ? '#fff' : C.carvao};color:${i % 2 ? C.carvao : '#fff'};font-weight:800;font-size:${50 * k}px;line-height:1.18;padding:${8 * k}px ${22 * k}px;border-radius:12px;white-space:nowrap">${esc(l)}</span>`).join('')}</div>`).join('')}</div></div>`,
  // Duas colunas: sem a plataforma × com a plataforma.
  comparativo: (c, f, k) => `<div style="display:flex;flex-direction:column;justify-content:center;gap:${36 * k}px;height:100%">${kicker(c.kicker, f, k)}${titulo(c, f, 80 * k)}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:${18 * k}px">${[['a', c.a, false], ['b', c.b, true]].map(([, col, bom]) => `<div style="border-radius:28px;padding:${30 * k}px ${28 * k}px;background:${bom ? G : (f === FUNDOS.creme ? '#fff' : 'rgba(255,244,232,.07)')};border:2px solid ${bom ? 'transparent' : f.linha};color:${bom ? '#fff' : f.txt}">
      <div style="${B};font-weight:800;font-size:${42 * k}px;line-height:1.05;margin-bottom:${24 * k}px">${esc(col.titulo)}</div>
      ${lista(col.itens).map(t => `<div style="font-size:${33 * k}px;font-weight:500;line-height:1.28;padding:${22 * k}px 0;border-top:2px solid ${bom ? 'rgba(255,255,255,.3)' : f.linha};opacity:${bom ? 1 : .78}">${esc(t)}</div>`).join('')}</div>`).join('')}</div></div>`,
  // Barra de busca e um resultado.
  busca: (c, f, k) => `<div style="display:flex;flex-direction:column;justify-content:center;gap:${34 * k}px;height:100%">
    <div style="background:#fff;border-radius:999px;padding:${26 * k}px ${40 * k}px;display:flex;align-items:center;gap:${22 * k}px;box-shadow:0 16px 40px rgba(43,14,0,.16)"><svg width="${40 * k}" height="${40 * k}" viewBox="0 0 24 24" fill="none" stroke="#8a8078" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6"/></svg>
      <span style="font-size:${37 * k}px;color:#2b2b2b;white-space:nowrap">${esc(c.busca)}</span><span style="width:3px;height:${44 * k}px;background:${C.brasa}"></span></div>
    <div style="background:#fff;border-radius:32px;padding:${44 * k}px;box-shadow:0 16px 40px rgba(43,14,0,.16)">
      <div style="display:flex;align-items:center;gap:${18 * k}px">${sim(C.brasa, 54 * k)}<div><div style="font-size:${27 * k}px;font-weight:600;color:#2b2b2b">Ponto do Verbum</div><div style="font-size:${22 * k}px;color:#8a8078">pontodoverbum.com.br</div></div></div>
      <div style="${B};font-weight:800;font-size:${56 * k}px;line-height:1.08;color:${C.brasa};margin:${24 * k}px 0 ${18 * k}px">${esc(c.tituloPeca)}</div>
      <div style="font-size:${35 * k}px;line-height:1.4;color:#4a4039">${rico(c.sub, FUNDOS.creme)}</div>
      ${c.itens ? `<div style="display:flex;flex-wrap:wrap;gap:${12 * k}px;margin-top:${26 * k}px">${lista(c.itens).map(t => `<span style="border:2px solid #eadfd3;border-radius:999px;padding:${10 * k}px ${22 * k}px;font-size:${27 * k}px;font-weight:600;color:${C.carvao}">${esc(t)}</span>`).join('')}</div>` : ''}</div></div>`,
  // Título + notificações do celular.
  notificacao: (c, f, k) => `<div style="display:flex;flex-direction:column;justify-content:center;gap:${40 * k}px;height:100%">${kicker(c.kicker, f, k)}${titulo(c, f, 96 * k)}
    <div style="display:flex;flex-direction:column;gap:${18 * k}px">${lista(c.avisos).map(n => `<div style="background:rgba(255,255,255,.93);border-radius:30px;padding:${26 * k}px ${30 * k}px;display:flex;gap:${24 * k}px;align-items:center;box-shadow:0 14px 34px rgba(43,14,0,.18)">
      <span style="width:${80 * k}px;height:${80 * k}px;border-radius:20px;background:${G};display:flex;align-items:center;justify-content:center;flex:none">${sim('#fff', 50 * k)}</span>
      <div style="flex:1"><div style="display:flex;justify-content:space-between;font-size:${23 * k}px;color:#6f655d"><b style="font-weight:700;color:#1c1c1e">${esc(n.app || 'Ponto do Verbum')}</b><span>${esc(n.hora || 'agora')}</span></div>
      <div style="font-size:${34 * k}px;font-weight:700;color:#1c1c1e;margin-top:4px">${esc(n.t)}</div><div style="font-size:${30 * k}px;color:#3a3a3c;line-height:1.3">${esc(n.d)}</div></div></div>`).join('')}</div>${sub(c.sub, f, 35 * k)}</div>`,
  // Capa de uma aula em destaque + as aulas do módulo.
  aula: (c, f, k) => `<div style="display:flex;flex-direction:column;justify-content:center;gap:${32 * k}px;height:100%">${kicker(c.kicker, f, k)}${titulo(c, f, 84 * k)}
    <div style="position:relative;border-radius:28px;overflow:hidden;box-shadow:0 30px 60px rgba(43,14,0,.3)"><img src="${foto(c.capa)}" style="width:100%;display:block">
      <span style="position:absolute;left:28px;bottom:28px;width:${96 * k}px;height:${96 * k}px;border-radius:50%;background:rgba(43,14,0,.85);display:flex;align-items:center;justify-content:center"><svg width="${40 * k}" height="${40 * k}" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg></span></div>
    <div style="display:flex;flex-wrap:wrap;gap:${14 * k}px">${lista(c.itens).map(t => `<span style="border:2px solid ${f.linha};border-radius:999px;padding:${12 * k}px ${26 * k}px;font-size:${28 * k}px;font-weight:600;color:${f.txt}">${esc(t)}</span>`).join('')}</div>${sub(c.sub, f, 34 * k)}</div>`,
  // Foto do professor em um quadro + texto.
  foto: (c, f, k, st) => `<div style="display:flex;flex-direction:column;gap:${34 * k}px;height:100%">
    <div style="border-radius:32px;overflow:hidden;flex:1;min-height:0;box-shadow:0 30px 60px rgba(43,14,0,.3)"><img src="${foto(c.foto)}" style="width:100%;height:100%;object-fit:cover;object-position:${c.pos || '50% 25%'}"></div>
    ${kicker(c.kicker, f, k)}${titulo(c, f, 82 * k)}${sub(c.sub, f, 35 * k)}</div>`,
};
const PADRAO = { manchete: 'degrade', tipo: 'carvao', lista: 'creme', cursos: 'creme', nota: 'degrade', versiculo: 'creme', numeros: 'carvao', passos: 'creme', etiquetas: 'degrade', comparativo: 'creme', busca: 'creme', notificacao: 'degrade', aula: 'creme', foto: 'carvao' };

// Escala dos textos nos stories (1.3 por padrão; os layouts com mais conteúdo usam menos). "escala" no post troca.
const DENSO = { cursos: 1.04, lista: 1.06, nota: 1.04, versiculo: 1.12, numeros: 1, comparativo: 1.1, notificacao: 1.1, etiquetas: 1.22, busca: 1.15, aula: 1.12, passos: 1.2 };
export function slides(bruto) {
  const c = bruto.de ? { ...porId[bruto.de], ...bruto } : bruto;
  const st = c.formato === 'story', w = 1080, h = st ? 1920 : 1350, k = c.escala || (st ? (DENSO[c.layout] || 1.3) : 1);
  const f = FUNDOS[c.fundo] || FUNDOS[PADRAO[c.layout] || 'degrade'];
  // Nos stories, 250 px em cima e 330 px embaixo ficam livres (nome do perfil e botão do anúncio).
  const m = st ? { t: 250, b: 330, x: 76 } : { t: 70, b: 70, x: 76 };
  const corpo = (L[c.layout] || L.tipo)(c, f, k, st);
  return { w, h, slides: [`<div style="position:absolute;inset:0;background:${f.bg}"></div>${agua(st ? 1500 : 1200, st ? -520 : -420, st ? -300 : -330, f.agua)}
    <div style="position:absolute;left:${m.x}px;right:${m.x}px;top:${m.t}px;bottom:${m.b}px;display:flex;flex-direction:column;gap:${st ? 44 : 34}px">
      ${marca(f, Math.min(k, 1.12))}<div data-cabe style="flex:1;min-height:0;overflow:hidden">${corpo}</div>${cta(c, f, Math.min(k, 1.12))}</div>`] };
}
