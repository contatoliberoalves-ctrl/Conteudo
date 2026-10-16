// Ordem "por artigo" do Libero PDF: as mesmas teses, agora na sequência dos dispositivos (CF, depois leis,
// CPC, súmulas vinculantes e, por último, as que a fonte não liga a artigo). Uma tese que cita mais de um
// dispositivo aparece em cada um deles. Devolve os grupos (para o raio-x) e os blocos do fluxo paginado.
import { COR, TITULO, TEXTO, esc } from '../libero-comum/identidade.mjs';

const chip = (txt, bg, cor, px = 10.5) => `<span style="display:inline-block;background:${bg};color:${cor};${TEXTO};font-size:${px}px;font-weight:700;padding:2px 8px;border-radius:5px;white-space:nowrap">${esc(txt)}</span>`;
const ord = n => (n >= 1 && n <= 9 ? `${n}º` : String(n));
const ROMANO = { I: 1, V: 5, X: 10, L: 50, C: 100 };
const romano = s => { let t = 0; for (let i = 0; i < s.length; i++) { const v = ROMANO[s[i]], w = ROMANO[s[i + 1]] || 0; t += v < w ? -v : v; } return t; };

// Seções da CF (títulos da Constituição) e das demais fontes, na ordem do PDF.
const CF = [
  [1, 4, 'cf-principios', 'CF · Princípios fundamentais', 'Arts. 1º a 4º: fundamentos, separação de Poderes e objetivos da República.'],
  [5, 17, 'cf-direitos', 'CF · Direitos e garantias fundamentais', 'Arts. 5º a 17: direitos individuais, remédios, direitos sociais, nacionalidade e direitos políticos.'],
  [18, 43, 'cf-estado', 'CF · Organização do Estado', 'Arts. 18 a 43: União, Estados, Municípios, competências e Administração Pública.'],
  [44, 135, 'cf-poderes', 'CF · Organização dos Poderes', 'Arts. 44 a 135: Legislativo, processo legislativo, Executivo e Judiciário.'],
  [136, 169, 'cf-tributacao', 'CF · Defesa do Estado, tributação e orçamento', 'Arts. 136 a 169.'],
  [170, 192, 'cf-economica', 'CF · Ordem econômica e financeira', 'Arts. 170 a 192: livre iniciativa, serviços públicos e recursos minerais.'],
  [193, 250, 'cf-social', 'CF · Ordem social', 'Arts. 193 a 232: saúde, cultura, ciência, comunicação, meio ambiente e grupos protegidos.'],
];
const OUTRAS = [
  ['leis', 'Leis e códigos', 'Leis do processo constitucional e demais diplomas citados nos padrões de resposta, na ordem cronológica.'],
  ['sumulas', 'Súmulas vinculantes', 'Súmulas citadas pela FGV no padrão de resposta.'],
  ['sem', 'Sem artigo na fonte', 'Teses que o padrão de resposta pontua sem indicar dispositivo (ou com “controle difuso”).'],
];

// Quebra o texto do artigo em referências {dip, num, letra, sub}. dip: 'CF', 'Lei 4.717/65', 'CPC', 'SV', 'Estatuto do Idoso' ou 'SEM'.
export function referencias(artigo) {
  const a = String(artigo || '').trim();
  if (!a || a === 'controle difuso') return [{ dip: 'SEM', num: 0, letra: '', sub: a }];
  const refs = [];
  for (const seg of a.split(/;|\s+ou\s+|\s+c\/c\s+/)) {
    let s = seg.trim().replace(/^,\s*/, ''), dip = 'CF', m;
    if ((m = s.match(/^(?:SV|Súmula Vinculante)\s+(\d+)/))) { refs.push({ dip: 'SV', num: +m[1], letra: '', sub: '' }); continue; }
    if (/^Estatuto do Idoso/.test(s)) { refs.push({ dip: 'Estatuto do Idoso', num: 0, letra: '', sub: '' }); continue; }
    if ((m = s.match(/^(Lei \d[\d.]*\/\d+|CPC)\s*,?\s*/))) { dip = m[1]; s = s.slice(m[0].length); }
    if (!s) { refs.push({ dip, num: 0, letra: '', sub: '' }); continue; }
    // "art. 1º, par. único, I, e art. 4º, § 1º": vários artigos do mesmo diploma no mesmo trecho.
    for (const parte of s.split(/,?\s+e\s+(?=arts?\.)/)) {
      const r = parte.match(/arts?\.\s*(\d+)(-[A-Z])?º?((?:\s+e\s+\d+º?)*)\s*,?\s*(.*)$/);
      if (!r) { refs.push({ dip, num: 0, letra: '', sub: parte }); continue; }
      const nums = [+r[1], ...(r[3].match(/\d+/g) || []).map(Number)];
      nums.forEach((n, i) => refs.push({ dip, num: n, letra: i === 0 ? (r[2] || '') : '', sub: i === nums.length - 1 ? r[4].trim().replace(/,$/, '').trim() : '' }));
    }
  }
  return refs;
}
// Ordem dentro do artigo: caput e incisos primeiro, depois parágrafos.
const peso = sub => {
  const s = sub.replace(/^caput\s*(e\s*)?/, '').trim();
  if (!s) return 0;
  let m;
  if ((m = s.match(/^§\s*(\d+)/))) return 1000 + +m[1];
  if (/^(parágrafo|par\.)\s*único/.test(s)) return 1000;
  if ((m = s.match(/^([IVXLC]+)\b/))) return romano(m[1]);
  return 500;
};
const anoLei = d => { const m = d.match(/\/(\d+)$/); if (!m) return d === 'CPC' ? 2015 : 9999; const y = +m[1]; return y < 50 ? 2000 + y : 1900 + y; };

export function porArtigo(p) {
  const linhas = [];  // uma por (tese, referência)
  p.teses.forEach(t => {
    const vistos = new Set();
    referencias(t.artigo).forEach(r => { const k = `${r.dip}|${r.num}|${r.letra}|${r.sub}`; if (!vistos.has(k)) { vistos.add(k); linhas.push({ t, r }); } });
  });
  const secao = ({ r }) => {
    if (r.dip === 'CF') { const s = CF.find(([a, b]) => r.num >= a && r.num <= b); return s ? s[2] : 'cf-social'; }
    if (r.dip === 'SV') return 'sumulas';
    if (r.dip === 'SEM') return 'sem';
    return 'leis';
  };
  const defs = [...CF.map(([, , id, nome, descricao]) => ({ id, nome, descricao })), ...OUTRAS.map(([id, nome, descricao]) => ({ id, nome, descricao }))];
  const grupos = defs.map(d => ({ ...d, linhas: linhas.filter(l => secao(l) === d.id) })).filter(g => g.linhas.length);
  grupos.forEach(g => { g.teses = [...new Set(g.linhas.map(l => l.t))]; });

  const chaveArt = r => r.dip === 'SEM' ? `SEM|${r.sub}` : `${r.dip}|${r.num}|${r.letra}`;
  const rotuloArt = r => {
    const art = r.num ? `Art. ${ord(r.num)}${r.letra}` : '';
    if (r.dip === 'CF') return art;
    if (r.dip === 'SV') return `Súmula Vinculante ${r.num}`;
    if (r.dip === 'SEM') return r.sub ? 'Controle difuso' : 'Sem dispositivo';
    return art ? `${r.dip} · ${art}` : r.dip;
  };
  const cabecalho = (g, rot, n) => `<div class="bloco" data-materia="${esc(g.nome)}" data-junto="1" style="display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin-top:14px;padding-bottom:6px;border-bottom:3px solid ${COR.azul}">
      <span style="${TITULO};font-size:30px;line-height:.95;color:${COR.azul}">${esc(rot)}</span>
      <span style="${TEXTO};font-size:10.5px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:${COR.vermelho}">${n} ${n === 1 ? 'tese' : 'teses'}</span>
    </div>`;
  const linha = (g, { t, r }) => {
    const disp = r.dip === 'SEM' ? '—' : (r.sub || (r.num ? 'caput' : '—'));
    return `<div class="bloco" data-materia="${esc(g.nome)}" style="display:grid;grid-template-columns:92px 1fr;gap:14px;padding:8px 0;border-bottom:1.5px dashed #D5DAE4">
      <div style="${TEXTO};font-size:12px;font-weight:800;line-height:1.25;color:${COR.navy};padding-top:2px">${esc(disp)}</div>
      <div style="${TEXTO};font-size:12.8px;font-weight:600;line-height:1.36;color:${COR.navy}">${esc(t.tese)}
        <div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:5px">${chip(`OAB ${t.exame} · ${t.peca}`, COR.navy, '#fff', 10)}${t.artigo ? chip(t.artigo, '#E4ECFF', COR.azul, 10) : ''}</div>
      </div>
    </div>`;
  };
  const blocos = (abertura) => grupos.map((g, i) => {
    let ls = g.linhas;
    if (g.id === 'leis') ls = [...ls].sort((a, b) => anoLei(a.r.dip) - anoLei(b.r.dip) || a.r.dip.localeCompare(b.r.dip) || a.r.num - b.r.num || peso(a.r.sub) - peso(b.r.sub) || b.t.exame - a.t.exame);
    else ls = [...ls].sort((a, b) => a.r.num - b.r.num || a.r.letra.localeCompare(b.r.letra) || peso(a.r.sub) - peso(b.r.sub) || b.t.exame - a.t.exame);
    const arts = [];
    ls.forEach(l => { const k = chaveArt(l.r); if (!arts.length || arts[arts.length - 1].k !== k) arts.push({ k, r: l.r, ls: [] }); arts[arts.length - 1].ls.push(l); });
    return abertura(g, i) + arts.map(a => cabecalho(g, rotuloArt(a.r), a.ls.length) + a.ls.map(l => linha(g, l)).join('')).join('');
  }).join('');
  const artigos = new Set(linhas.filter(l => l.r.dip !== 'SEM').map(l => chaveArt(l.r))).size;
  return { grupos, blocos, artigos };
}
