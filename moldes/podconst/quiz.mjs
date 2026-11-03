// Quiz de stories do PodConst (1080×1920): story 1 = pergunta com espaço para a enquete SIM/NÃO do Instagram;
// story 2 = resposta com o fundamento e espaço para a enquete "Você acertou?".
// Visual mais sóbrio que os carrosséis: navy, azul e gelo; magenta e amarelo só em detalhes.
import { LOGO, TINTA, AMAR } from './posts.mjs';

const NAVY = 'linear-gradient(180deg,#0b1a4a 0%,#0a1e56 60%,#0b2470 100%)';
const AZUL = 'radial-gradient(120% 80% at 80% 0%,#0c4bbd 0%,#0a3aa0 45%,#0a2a7c 100%)';
const GELO = 'linear-gradient(180deg,#f6f7fb 0%,#eceff6 100%)';
const MAGENTA = '#e224d6';

export const QUIZ = [
  ['Cabe mandado de segurança contra ato de particular que exerce atribuição do poder público?', 'SIM', 'O agente privado no exercício de atribuição do poder público responde como autoridade coatora.', 'Art. 5º, LXIX, CF · art. 1º, § 1º, Lei 12.016/09'],
  ['Pessoa jurídica pode propor ação popular?', 'NÃO', 'A ação popular é do cidadão. Pessoa jurídica não tem legitimidade.', 'Art. 5º, LXXIII, CF · Súmula 365 do STF'],
  ['O habeas data serve para obter informações sobre outra pessoa?', 'NÃO', 'O habeas data protege informações relativas à pessoa do impetrante.', 'Art. 5º, LXXII, CF'],
  ['O prazo para impetrar mandado de segurança é de 120 dias?', 'SIM', 'O prazo decadencial conta da ciência do ato impugnado.', 'Art. 23, Lei 12.016/09'],
  ['Partido político com representação no Congresso pode impetrar mandado de segurança coletivo?', 'SIM', 'Basta ter representação no Congresso Nacional.', 'Art. 5º, LXX, “a”, CF'],
  ['Cabe ADI no STF contra lei municipal em face da Constituição Federal?', 'NÃO', 'A ADI no STF é contra lei ou ato normativo federal ou estadual. Lei municipal vai por ADPF.', 'Art. 102, I, “a”, CF · Lei 9.882/99'],
  ['A ADPF só cabe quando não houver outro meio eficaz para sanar a lesividade?', 'SIM', 'É a regra da subsidiariedade da ADPF.', 'Art. 4º, § 1º, Lei 9.882/99'],
  ['Governador de Estado pode propor ADI?', 'SIM', 'Está no rol dos legitimados (precisa demonstrar pertinência temática).', 'Art. 103, V, CF'],
  ['Cabe mandado de injunção quando a falta de norma regulamentadora inviabiliza um direito constitucional?', 'SIM', 'É exatamente a hipótese do mandado de injunção.', 'Art. 5º, LXXI, CF · Lei 13.300/16'],
  ['Senador pode ser preso em flagrante por crime afiançável?', 'NÃO', 'Desde a diplomação, só cabe prisão em flagrante de crime inafiançável.', 'Art. 53, § 2º, CF'],
  ['Brasileiro nato pode ser extraditado?', 'NÃO', 'Nenhum brasileiro nato será extraditado. O naturalizado, só nos casos da Constituição.', 'Art. 5º, LI, CF'],
  ['A idade mínima para ser Senador é 35 anos?', 'SIM', '35 anos para Presidente, Vice e Senador.', 'Art. 14, § 3º, VI, “a”, CF'],
  ['Lei estadual pode criar crime?', 'NÃO', 'Direito penal é competência privativa da União.', 'Art. 22, I, CF'],
  ['Mandado de segurança denegado em única instância pelo STJ vai ao STF por recurso ordinário?', 'SIM', 'É hipótese de recurso ordinário constitucional ao STF.', 'Art. 102, II, “a”, CF'],
  ['A Defensoria Pública pode propor ação civil pública?', 'SIM', 'A Defensoria está entre os legitimados da ação civil pública.', 'Art. 5º, II, Lei 7.347/85'],
];

const css = `
.st{position:relative;width:1080px;height:1920px;overflow:hidden;margin-bottom:40px;font-family:'Space Grotesk',sans-serif}
.st .bb{font-family:'Bebas Neue';font-weight:400}
.vaga{position:absolute;left:190px;right:190px;height:300px;border-radius:40px}
`;

const topo = (n, cor) => `<div style="position:absolute;top:150px;left:90px;right:90px;display:flex;align-items:center;gap:20px;color:${cor};font-size:30px">
<span style="font-weight:700;letter-spacing:4px">QUIZ PODCONST</span><span style="flex:1;height:2px;background:currentColor;opacity:.35"></span><span style="font-weight:700">${String(n).padStart(2, '0')}/${QUIZ.length}</span></div>`;
const rodape = cor => `<div style="position:absolute;bottom:150px;left:90px;right:90px;display:flex;justify-content:space-between;font-size:28px;color:${cor};opacity:.85"><span><b>@libero</b>filho</span><span><b>@natalia</b>valenca</span></div>`;

function pergunta([q], i) {
  const claro = i % 3 === 2;
  const fundo = claro ? GELO : i % 3 === 1 ? AZUL : NAVY;
  const cor = claro ? TINTA : '#fff';
  const tam = q.length > 80 ? 92 : q.length > 55 ? 104 : 120;
  return `<div class="st" data-tela style="background:${fundo};color:${cor}">
${topo(i + 1, cor)}
<div style="position:absolute;top:330px;left:90px;right:90px;display:flex;flex-direction:column;gap:34px">
<div style="align-self:flex-start;background:${claro ? TINTA : '#fff'};color:${claro ? '#fff' : TINTA};font-weight:700;font-size:28px;letter-spacing:4px;padding:8px 18px">SIM OU NÃO?</div>
<div class="bb" style="font-size:${tam}px;line-height:.96">${q}</div>
<div style="width:90px;height:12px;background:${MAGENTA}"></div>
</div>
<div class="vaga" style="top:1240px;background:${claro ? 'rgba(11,26,74,.05)' : 'rgba(255,255,255,.06)'}"></div>
<div style="position:absolute;top:1570px;left:0;right:0;text-align:center;font-size:30px;font-weight:600;opacity:.8">Vota e passa pro próximo story →</div>
${rodape(cor)}
</div>`;
}

function resposta([q, r, porque, fund], i) {
  const sim = r === 'SIM';
  return `<div class="st" data-tela style="background:${NAVY};color:#fff">
${topo(i + 1, '#fff')}
<div style="position:absolute;top:300px;left:90px;right:90px;display:flex;flex-direction:column;gap:30px">
<div style="font-size:30px;line-height:1.35;opacity:.75">${q}</div>
<div style="display:flex;align-items:center;gap:30px">
<div class="bb" style="font-size:300px;line-height:.82;color:${sim ? AMAR : '#fff'}">${r}</div>
<div style="width:120px;height:120px;border-radius:50%;border:6px solid ${sim ? AMAR : MAGENTA};display:flex;align-items:center;justify-content:center;font-size:70px;color:${sim ? AMAR : MAGENTA};font-weight:700">${sim ? '✓' : '✕'}</div>
</div>
<div style="font-weight:600;font-size:44px;line-height:1.28">${porque}</div>
<div style="align-self:flex-start;border-left:6px solid ${MAGENTA};padding:6px 0 6px 20px;font-weight:700;font-size:32px;line-height:1.3;color:#cfd6ee">${fund}</div>
</div>
<div class="vaga" style="top:1300px;background:rgba(255,255,255,.06)"></div>
${LOGO(40, 'bottom:240px;right:90px')}
${rodape('#fff')}
</div>`;
}

export const GRUPOS_QUIZ = Object.fromEntries(QUIZ.map((x, i) => [`qz${String(i + 1).padStart(2, '0')}`, [pergunta(x, i), resposta(x, i)]]));
export const CSS_QUIZ = css;

export function quizHtml(grupo) {
  const telas = GRUPOS_QUIZ[grupo];
  if (!telas) return null;
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Grotesk:wght@400;500;600;700&family=Unbounded:wght@900&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box}body{margin:0;background:#141418}${css}</style></head><body>${telas.join('\n')}</body></html>`;
}
