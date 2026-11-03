// Linha "calma" do PodConst: mesma identidade (azul, navy, amarelo, magenta; Bebas Neue + Space Grotesk),
// mas com fundo claro na maior parte, o padrão geométrico do material original só em faixas,
// magenta só em detalhe e o logo oficial (marca/, fora do git; sem o arquivo, entra o logo em CSS).
// Grupos: 4a carrossel "4 erros que custam ponto na peça", 4b tela única MS x ação popular,
// 4c tela única com a dupla recortada (pergunta para comentários).
import fs from 'node:fs';
import path from 'node:path';
import { LOGO, TINTA, AMAR } from './posts.mjs';

const root = path.dirname(new URL(import.meta.url).pathname);
const GELO = '#f3f5f9';
const AZUL = '#0a3aa6';
const NAVY = '#0b1a4a';
const MAG = '#e224d6';
const CIANO = '#19c6dc';

// Logo oficial em PNG (marca/N-POD.png); sem ele, o logo em CSS.
const logo = (arq, alt, pos) => fs.existsSync(path.join(root, 'marca', arq))
  ? `<img src="../marca/${arq}" alt="" style="position:absolute;${pos};height:${alt}px;z-index:6">`
  : LOGO(Math.round(alt / 2.2), pos);

// Padrão geométrico (como o do material original): ladrilhos quadrados com círculo, meio círculo, triângulo, losango.
const CORES = [AZUL, AMAR, MAG, CIANO, NAVY, '#ffffff'];
function ladrilho(i, t) {
  const a = CORES[(i * 7) % 6], b = CORES[(i * 3 + 2) % 6] === a ? CORES[(i + 1) % 6] : CORES[(i * 3 + 2) % 6];
  const forma = [
    `<div style="position:absolute;inset:18%;border-radius:50%;background:${b}"></div>`,
    `<div style="position:absolute;left:0;right:0;bottom:0;height:50%;border-radius:${t}px ${t}px 0 0;background:${b}"></div>`,
    `<div style="position:absolute;inset:0;background:${b};clip-path:polygon(0 0,100% 100%,0 100%)"></div>`,
    `<div style="position:absolute;inset:14%;background:${b};transform:rotate(45deg) scale(.75)"></div>`,
    `<div style="position:absolute;left:0;top:0;width:100%;height:100%;border-radius:0 0 100% 0;background:${b}"></div>`,
    `<div style="position:absolute;inset:30%;border-radius:50%;background:${b};box-shadow:0 0 0 ${t * .12}px ${a},0 0 0 ${t * .2}px ${b}"></div>`,
  ][(i * 5 + 1) % 6];
  return `<div style="position:relative;width:${t}px;height:${t}px;background:${a};overflow:hidden;flex:none">${forma}</div>`;
}
const faixa = (n, t, dir = 'row', desloc = 0) => `<div style="display:flex;flex-direction:${dir}">${Array.from({ length: n }, (_, i) => ladrilho(i + desloc, t)).join('')}</div>`;

const css = `
*{box-sizing:border-box}body{margin:0;background:#141418;font-family:'Space Grotesk',sans-serif}
.tela{position:relative;width:1080px;height:1350px;overflow:hidden;margin-bottom:40px}
.bb{font-family:'Bebas Neue';font-weight:400}
.foto{position:absolute;overflow:hidden}.foto img{width:100%;height:100%;object-fit:cover;display:block}
.foto img:not([src]){visibility:hidden}
.kick{display:inline-block;font-weight:700;font-size:24px;letter-spacing:5px}
`;
const tela = (fundo, corpo, cor = TINTA) => `<div class="tela" data-tela style="background:${fundo};color:${cor}">${corpo}</div>`;
const arrobas = (cor, pos = 'bottom:64px;left:80px') => `<div style="position:absolute;${pos};font-size:26px;color:${cor};display:flex;gap:26px"><span><b>@libero</b>filho</span><span><b>@natalia</b>valenca</span></div>`;

const ERROS = [
  ['ENDEREÇAR PARA O JUÍZO ERRADO', 'A competência vem antes de tudo. Se o endereçamento erra, a peça já começa perdendo.', 'Identifique a autoridade ou o réu e confira a regra de competência na Constituição (arts. 102, 105, 108 e 109) antes de escrever.'],
  ['ESQUECER A LIMINAR', 'Quando o enunciado fala em urgência ou risco de dano, o pedido de liminar ou tutela de urgência costuma estar no espelho.', 'Mandado de segurança: art. 7º, III, da Lei 12.016/09. Nas demais ações: art. 300 do CPC.'],
  ['CITAR O ARTIGO SEM EXPLICAR', 'Os padrões de resposta da FGV repetem: a mera citação do dispositivo legal não confere pontuação.', 'Escreva a tese com suas palavras, explique por que ela se aplica ao caso e só então indique o artigo.'],
  ['IDENTIFICAR A PROVA', 'Nome, assinatura ou qualquer marca que identifique o candidato pode anular a prova.', 'Feche só com os dados genéricos: Local…, Data…, Advogado…, OAB…'],
];
const FUNDOS_ERRO = [[GELO, TINTA], ['#ffffff', TINTA], [NAVY, '#ffffff'], [GELO, TINTA]];

const g4a = [
  tela('#ffffff', `
<div class="foto" style="left:0;top:0;width:1080px;height:720px"><img data-foto="capa" alt="" style="object-position:center 30%"></div>
<div style="position:absolute;left:0;top:720px">${faixa(9, 120)}</div>
<div style="position:absolute;left:80px;right:80px;top:892px;display:flex;flex-direction:column;gap:16px">
<span class="kick" style="color:${AZUL}">2ª FASE · CONSTITUCIONAL</span>
<div class="bb" style="font-size:132px;line-height:.88;color:${NAVY};white-space:nowrap">4 ERROS QUE CUSTAM<br>PONTO NA <span style="color:${AZUL}">PEÇA</span></div>
</div>
<div style="position:absolute;top:40px;left:50px;display:flex;flex-direction:column;gap:6px;font-weight:700;font-size:26px;color:${NAVY}"><span style="background:#fff;padding:2px 12px">@LIBERO<span style="font-weight:400">FILHO</span></span><span style="background:#fff;padding:2px 12px">@NATALIA<span style="font-weight:400">VALENCA</span></span></div>
${logo('1-POD.png', 110, 'bottom:36px;right:70px')}`),
  ...ERROS.map(([tit, txt, como], i) => {
    const [fundo, cor] = FUNDOS_ERRO[i];
    const escuro = cor === '#ffffff';
    return tela(fundo, `
<div style="position:absolute;right:0;top:0">${faixa(11, 120, 'column', i * 3)}</div>
<div style="position:absolute;left:80px;top:90px;font-size:26px;color:${cor};opacity:.7"><b>Erro ${i + 1} de 4</b></div>
<div style="position:absolute;left:80px;right:200px;top:150px;bottom:130px;display:flex;flex-direction:column;justify-content:center;gap:30px">
<div class="bb" style="font-size:230px;line-height:.8;color:transparent;-webkit-text-stroke:3px ${escuro ? AMAR : AZUL}">0${i + 1}</div>
<div class="bb" style="font-size:112px;line-height:.9;color:${escuro ? '#fff' : NAVY}">${tit}</div>
<div style="font-weight:500;font-size:36px;line-height:1.35">${txt}</div>
<div style="background:${escuro ? 'rgba(255,255,255,.08)' : '#fff'};border-left:10px solid ${escuro ? AMAR : AZUL};padding:28px 32px;${escuro ? '' : 'box-shadow:0 14px 30px rgba(11,26,74,.08);'}">
<div class="kick" style="color:${escuro ? AMAR : AZUL};margin-bottom:12px">COMO EVITAR</div>
<div style="font-weight:600;font-size:32px;line-height:1.35">${como}</div></div>
</div>
${arrobas(cor)}`, cor);
  }),
  tela(GELO, `
<div style="position:absolute;left:0;bottom:0">${faixa(9, 120, 'row', 5)}</div>
<div style="position:absolute;left:0;right:0;top:170px;display:flex;justify-content:center;gap:40px">
<div class="foto" style="position:relative;width:300px;height:300px;border-radius:50%;border:8px solid #fff;box-shadow:0 16px 30px rgba(11,26,74,.15)"><img data-foto="natalia" alt="" style="object-position:center 15%"></div>
<div class="foto" style="position:relative;width:300px;height:300px;border-radius:50%;border:8px solid #fff;box-shadow:0 16px 30px rgba(11,26,74,.15)"><img data-foto="libero" alt="" style="object-position:center 15%"></div>
</div>
<div style="position:absolute;left:100px;right:100px;top:560px;display:flex;flex-direction:column;align-items:center;gap:28px;text-align:center;color:${NAVY}">
<div class="bb" style="font-size:120px;line-height:.9">SALVA PRA REVISAR<br>ANTES DA PROVA</div>
<div style="width:90px;height:12px;background:${AZUL}"></div>
<div style="font-weight:500;font-size:36px;line-height:1.35">E manda pra quem vai fazer a 2ª fase com você.</div>
<div style="font-size:28px"><b>@libero</b>filho · <b>@natalia</b>valenca</div>
</div>
${logo('1-POD.png', 120, 'bottom:180px;left:50%;transform:translateX(-50%)')}`),
];

// 4b · tela única: MS x ação popular, em duas fichas lado a lado e a pergunta-chave no fim
const fichaItem = (ic, rot, txt, cor) => `<div style="display:flex;gap:16px;align-items:flex-start"><span style="flex:none;width:52px;height:52px;border-radius:50%;background:${cor};display:flex;align-items:center;justify-content:center;font-size:26px">${ic}</span><div><div style="font-weight:700;font-size:20px;letter-spacing:3px;opacity:.7">${rot}</div><div style="font-weight:600;font-size:29px;line-height:1.25">${txt}</div></div></div>`;
const ficha = (nome, sub, cor, fundo, tinta, itens, rot) => `<div style="flex:1;background:${fundo};color:${tinta};border-radius:28px;padding:34px 30px;display:flex;flex-direction:column;gap:22px;transform:rotate(${rot}deg);box-shadow:0 20px 40px rgba(11,26,74,.14)">
<div><div class="bb" style="font-size:78px;line-height:.9">${nome}</div><div style="font-size:22px;font-weight:600;opacity:.75">${sub}</div></div>
${itens.map(([ic, r, t]) => fichaItem(ic, r, t, cor)).join('')}</div>`;
const g4b = [tela(GELO, `
<div style="position:absolute;left:0;top:0">${faixa(9, 120, 'row', 2)}</div>
<div style="position:absolute;left:80px;right:80px;top:170px;display:flex;align-items:baseline;gap:20px;color:${NAVY}">
<div class="bb" style="font-size:84px;line-height:1">MS OU AÇÃO POPULAR?</div><span class="kick" style="color:${AZUL}">EM 10 SEGUNDOS</span></div>
<div style="position:absolute;left:60px;right:60px;top:290px;display:flex;gap:26px;align-items:flex-start">
${ficha('MANDADO DE SEGURANÇA', 'Lei 12.016/09', 'rgba(255,255,255,.18)', AZUL, '#fff', [['👤', 'QUEM', 'O titular do direito violado'], ['🎯', 'CONTRA', 'Ato ilegal ou abusivo de autoridade'], ['⏳', 'PRAZO', '120 dias da ciência do ato'], ['📌', 'BASE', 'Art. 5º, LXIX, CF']], -1.2)}
${ficha('AÇÃO POPULAR', 'Lei 4.717/65', 'rgba(11,26,74,.1)', AMAR, NAVY, [['🗳️', 'QUEM', 'Qualquer cidadão (Súmula 365 do STF)'], ['🏛️', 'CONTRA', 'Ato lesivo ao patrimônio público ou à moralidade'], ['⏳', 'PRAZO', 'Prescreve em 5 anos'], ['📌', 'BASE', 'Art. 5º, LXXIII, CF']], 1.2)}
</div>
<div style="position:absolute;left:80px;right:80px;bottom:150px;background:${NAVY};color:#fff;border-radius:24px;padding:26px 32px;display:flex;flex-direction:column;gap:8px">
<span class="kick" style="color:${AMAR}">A PERGUNTA-CHAVE</span>
<div style="font-weight:600;font-size:30px;line-height:1.3">Direito <b>seu</b>, líquido e certo, violado por autoridade? <b style="color:${AMAR}">MS.</b> Dinheiro ou moralidade públicos lesados e você é cidadão? <b style="color:${AMAR}">Ação popular.</b></div>
</div>
${arrobas(TINTA, 'bottom:58px;left:80px')}
${logo('1-POD.png', 96, 'bottom:36px;right:70px')}`)];

// 4c · tela única com a dupla recortada sobre o arco amarelo do material original
const g4c = [tela(GELO, `
<div style="position:absolute;left:50%;bottom:0;width:820px;height:900px;transform:translateX(-50%);background:${AMAR};border-radius:410px 410px 0 0"></div>
<img data-foto="recorte" alt="" style="position:absolute;left:50%;bottom:0;height:880px;transform:translateX(-50%);z-index:2">
<div style="position:absolute;left:0;right:0;bottom:0;height:160px;background:linear-gradient(180deg,rgba(11,26,74,0),rgba(11,26,74,.55));z-index:3"></div>
<div style="position:absolute;left:80px;right:80px;top:110px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:20px;color:${NAVY}">
<span class="kick" style="color:${AZUL}">A GENTE QUER SABER</span>
<div class="bb" style="font-size:118px;line-height:.9">QUAL TEMA DE CONSTITUCIONAL<br>VOCÊ QUER VER AQUI?</div>
</div>
<div style="position:absolute;left:80px;bottom:56px;z-index:4;background:#fff;color:${NAVY};font-weight:700;font-size:30px;padding:14px 24px;border-radius:40px;box-shadow:0 10px 24px rgba(0,0,0,.2)">Comenta aqui embaixo 👇</div>
${logo('1-POD.png', 104, 'bottom:36px;right:70px')}`)];

// 4c v2 (proposta): caixinha de perguntas do Instagram em destaque, dupla recortada embaixo
const g4c2 = [tela(GELO, `
<div style="position:absolute;left:0;bottom:0">${faixa(9, 120, 'row', 4)}</div>
<img data-foto="recorte" alt="" style="position:absolute;left:50%;bottom:0;height:720px;transform:translateX(-50%);z-index:2;filter:drop-shadow(0 20px 30px rgba(11,26,74,.25))">
<div style="position:absolute;left:110px;right:110px;top:200px;background:#fff;border-radius:36px;box-shadow:0 24px 50px rgba(11,26,74,.16);overflow:hidden;z-index:3;transform:rotate(-2deg)">
<div style="background:linear-gradient(120deg,${AZUL},#0c4bbd);color:#fff;padding:40px 44px 34px;text-align:center">
<div style="font-weight:700;font-size:24px;letter-spacing:5px;opacity:.85;margin-bottom:12px">FAZ SEU PEDIDO</div>
<div class="bb" style="font-size:92px;line-height:.92">QUAL TEMA DE CONSTITUCIONAL VOCÊ QUER VER AQUI?</div></div>
<div style="padding:30px 40px;display:flex;align-items:center;justify-content:space-between;gap:20px">
<span style="font-size:32px;color:#8a93a8">Escreve nos comentários…</span><span style="background:${AMAR};color:${NAVY};font-weight:700;font-size:26px;padding:10px 20px;border-radius:30px">👇</span></div>
</div>
${logo('1-POD.png', 96, 'top:52px;right:70px')}`)];

export const GRUPOS_CALMO = { '4a': g4a, '4b': g4b, '4c': g4c, '4c2': g4c2 };
export function calmoHtml(grupo) {
  const telas = GRUPOS_CALMO[grupo];
  if (!telas) return null;
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Grotesk:wght@400;500;600;700&family=Unbounded:wght@900&display=swap" rel="stylesheet">
<style>${css}</style></head><body>${telas.join('\n')}</body></html>`;
}
export { faixa, logo };
