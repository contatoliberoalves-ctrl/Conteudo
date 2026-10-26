// Monta colecao/dados-colecao.json a partir de colecao/mapas.json (importado dos .docx): um material por mapa
// (capa tipográfica + página do mapa), com o desenho escolhido pela "composição" indicada no texto do autor e
// sem repetir o mesmo desenho em mapas seguidos. Uso: node colecao/montar.mjs
import fs from 'node:fs';
import path from 'node:path';
const dir = path.dirname(new URL(import.meta.url).pathname);
const mapas = JSON.parse(fs.readFileSync(path.join(dir, 'mapas.json'), 'utf8'));
const slug = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
// Ordem importa: a primeira regra que bater decide.
const REGRAS = [
  ['etapas', /linha|fluxo|sequ[eê]ncia|→|iniciativa vota|percurso|cria[cç][aã]o funcionamento|caso concreto [oó]rg[aã]o|requisitos em sequ/i],
  ['perguntas', /pergunta|sele[cç][aã]o|quem [eé]|dever omitido|classificar|les[aã]o objeto|objeto par[aâ]metro|objeto controv|tj par[aâ]metro|separar comunica/i],
  ['regra', /regra|exce[cç]|n[uú]cleo|direito condi|cinco hip[oó]teses e veda/i],
  ['colunas', /compar|colunas|pares|tr[eê]s [aá]reas|privados servidores|dois quadros|dois instrumentos|dois blocos|absolutas relativas|tr[eê]s modalidades|origin[aá]ria recurso|formal material|material formal|crimes comuns/i],
  ['arvore', /n[ií]veis|[oó]rg[aã]os|centros|institui[cç][oõ]es|grupos|eixos|cinco ramos|bicameral|chefias|tr[eê]s pilares|tr[eê]s hip[oó]teses|quatro verbos|quatro categorias|agrupamento/i],
];
const ALTERNA = ['radial', 'arvore', 'radial', 'perguntas'];
let ant = '', k = 0;
const saida = mapas.map((m, i) => {
  let layout = m.layout || (REGRAS.find(([, re]) => re.test(m.composicao || '')) || [])[0] || ALTERNA[k++ % ALTERNA.length];
  // colunas com mais de 5 ramos ficam apertadas; etapas com 6 também
  if (layout === 'colunas' && m.ramos.length > 4) layout = 'arvore';
  // desenho fixado no mapas.json ("layout") não muda; os outros evitam repetir o anterior e o próximo fixado
  const prox = mapas[i + 1]?.layout;
  if (!m.layout && (layout === ant || layout === prox)) layout = ['radial', 'arvore', 'perguntas'].find(l => l !== ant && l !== prox);
  ant = layout;
  const n = String(m.numero).padStart(2, '0');
  return {
    id: `${n}-${slug(m.titulo)}`, titulo: `Mapa ${n} · ${m.titulo}`, perfil: '@liberofilho',
    capa: { estilo: 'tipografica', pre: `Constitucional com Líbero · Mapa ${n}`, tema: m.titulo, tt: m.titulo.length > 40 ? 56 : 68 },
    mapas: [{ numero: m.numero, titulo: m.titulo, layout, referencia: m.referencia, ramos: m.ramos, aplicacao: m.aplicacao, pergunta: m.pergunta, resposta: m.resposta
    }],
  };
});
fs.writeFileSync(path.join(dir, 'dados-colecao.json'), JSON.stringify(saida, null, 1));
const cont = {}; saida.forEach(s => { cont[s.mapas[0].layout] = (cont[s.mapas[0].layout] || 0) + 1; });
console.log(saida.length, 'mapas', cont);
