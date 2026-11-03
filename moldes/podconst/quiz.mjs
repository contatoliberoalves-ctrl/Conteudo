// Quiz de stories do PodConst (1080×1920): story 1 = pergunta com espaço para a enquete SIM/NÃO do Instagram;
// story 2 = resposta com o fundamento e espaço para a enquete "Você acertou?".
// Visual mais sóbrio que os carrosséis: navy, azul e gelo; magenta e amarelo só em detalhes.
import { TINTA, AMAR } from './posts.mjs';
import { faixa, logo } from './calmo.mjs';

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
.vaga{position:absolute;left:170px;right:170px;}
.vaga2{align-self:center;width:740px;height:330px;border-radius:44px;border:3px dashed currentColor;opacity:.18}
`;

// Topo comum: faixa do padrão geométrico e o selo "QUIZ PODCONST" (sem numeração).
const topo = (cor, desloc) => `<div style="position:absolute;left:0;top:0">${faixa(9, 120, 'row', desloc)}</div>
<div style="position:absolute;top:190px;left:80px;right:80px;display:flex;align-items:center;justify-content:space-between;color:${cor}">
<span style="font-weight:700;font-size:30px;letter-spacing:6px">QUIZ · CONSTITUCIONAL</span>${logo('1-POD.png', 92, 'top:-28px;right:0')}</div>`;
const rodape = cor => `<div style="position:absolute;bottom:120px;left:80px;right:80px;display:flex;justify-content:space-between;font-size:28px;color:${cor};opacity:.85"><span><b>@libero</b>filho</span><span><b>@natalia</b>valenca</span></div>`;

function pergunta([q], i) {
  const v = i % 3;  // 0 navy, 1 azul, 2 gelo
  const fundo = [NAVY, AZUL, GELO][v];
  const cor = v === 2 ? TINTA : '#fff';
  const tam = q.length > 85 ? 104 : q.length > 60 ? 116 : q.length > 40 ? 132 : 150;
  return `<div class="st" data-tela style="background:${fundo};color:${cor}">
<div class="bb" style="position:absolute;right:-90px;top:250px;font-size:1500px;line-height:.8;color:transparent;-webkit-text-stroke:5px ${v === 2 ? 'rgba(11,26,74,.07)' : 'rgba(255,255,255,.08)'}">?</div>
${topo(cor, i * 2)}
<div class="bb" style="position:absolute;left:80px;top:330px;background:${AMAR};color:${TINTA};font-size:84px;line-height:1;padding:10px 26px 0;transform:rotate(-4deg);z-index:3;box-shadow:0 14px 28px rgba(0,0,0,.18)">SIM OU NÃO?</div>
<div style="position:absolute;left:60px;right:60px;top:410px;display:flex;flex-direction:column;gap:40px">
<div style="min-height:640px;background:#fff;color:${TINTA};border-radius:44px;padding:110px 64px 60px;display:flex;flex-direction:column;justify-content:center;gap:34px;box-shadow:0 30px 60px rgba(5,15,50,.28);transform:rotate(1deg)">
<div class="bb" style="font-size:${tam}px;line-height:.95">${q}</div>
<div style="display:flex;gap:12px"><span style="width:70px;height:12px;background:${MAGENTA}"></span><span style="width:24px;height:12px;background:${AMAR}"></span><span style="width:12px;height:12px;background:#19c6dc"></span></div>
</div>
<div style="text-align:center;font-weight:700;font-size:34px;margin-top:20px">👇 Vota antes de passar</div>
<div class="vaga2" style="height:330px;border-radius:44px;border:3px dashed currentColor;opacity:.18"></div>
</div>
${rodape(cor)}
</div>`;
}

function resposta([q, r, porque, fund], i) {
  const sim = r === 'SIM';
  const tinta = sim ? AMAR : '#ffffff';
  return `<div class="st" data-tela style="background:${sim ? AZUL : NAVY};color:#fff">
${topo('#fff', i * 2 + 5)}
<div style="position:absolute;left:80px;right:80px;top:300px;font-size:32px;line-height:1.35;opacity:.8">${q}</div>
<div style="position:absolute;left:60px;top:470px;display:flex;align-items:center;gap:20px">
<div style="position:relative;transform:rotate(-6deg)">
<div class="bb" style="font-size:400px;line-height:.78;color:${tinta};padding:24px 40px 0;border:12px solid ${tinta};border-radius:30px">${r}</div>
</div>
${sim ? `<img src="../elementos/check_mark_button_3d.png" alt="" style="width:220px;transform:rotate(10deg);filter:drop-shadow(0 20px 30px rgba(0,0,0,.35))">` : `<div style="width:200px;height:200px;border-radius:50%;background:${MAGENTA};display:flex;align-items:center;justify-content:center;font-size:120px;font-weight:700;color:#fff;transform:rotate(8deg);box-shadow:0 20px 30px rgba(0,0,0,.3)">✕</div>`}
</div>
<div style="position:absolute;left:60px;right:60px;top:920px;background:#fff;color:${TINTA};border-radius:36px;padding:44px 48px;display:flex;flex-direction:column;gap:22px;box-shadow:0 30px 60px rgba(5,15,50,.3)">
<div style="font-weight:700;font-size:48px;line-height:1.22">${porque}</div>
<div style="align-self:flex-start;background:${TINTA};color:#fff;font-weight:700;font-size:28px;line-height:1.3;padding:10px 18px;border-radius:12px">${fund}</div>
</div>
<div style="position:absolute;top:1360px;left:0;right:0;text-align:center;font-weight:700;font-size:34px">E aí, acertou? 👇</div>
<div class="vaga" style="top:1430px"></div>
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
