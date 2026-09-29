// Molde "Quiz Stories" (@constitucionalgabaritado): stories 1080×1920 de certo ou errado, na identidade do
// Carrossel Infinito (verde-escuro, gelo e menta; Antonio nos títulos e Poppins no texto; trilho com nó e
// seta; selo @CONSTITUCIONALGABARITADO). Cada quiz tem 2 stories: a afirmação com os botões CERTO/ERRADO e,
// no seguinte, o gabarito com a explicação e o fundamento. O trilho continua de um story para o outro.

const TEMAS = {
  dark:  { bg: '#0b2619', title: '#e8eeee', fg: '#b9cbc3', accent: '#5fbf8e', cardBg: '#143a29', cardFg: '#e8eeee', pillBg: '#5fbf8e', pillFg: '#0b2619', vazado: 'rgba(95,191,142,.22)', no: '#0b2619' },
  light: { bg: '#e8eeee', title: '#0b2619', fg: '#1f3a2e', accent: '#2f8a5e', cardBg: '#0b2619', cardFg: '#e8eeee', pillBg: '#0b2619', pillFg: '#e8eeee', vazado: 'rgba(47,138,94,.20)', no: '#e8eeee' },
  mint:  { bg: '#5fbf8e', title: '#0b2619', fg: '#0b2619', accent: '#0b2619', cardBg: '#0b2619', cardFg: '#e8eeee', pillBg: '#0b2619', pillFg: '#e8eeee', vazado: 'rgba(11,38,25,.16)', no: '#5fbf8e' },
};
const VERDE = '#2f8a5e', MENTA = '#5fbf8e', ESCURO = '#0b2619', GELO = '#e8eeee', ERRO = '#e2574c';
// Pergunta e gabarito em temas diferentes, alternando entre os quizzes.
const PARES = [['dark', 'light'], ['mint', 'dark'], ['light', 'dark']];
const W = 1080, H = 1920;

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
const pad2 = n => String(n).padStart(2, '0');

const selo = t => `<div class="selo" style="background:${t.pillBg};color:${t.pillFg}"><b>@CONSTITUCIONAL</b>GABARITADO</div>`;
const kicker = (txt, t) => `<div class="kicker" style="color:${t.accent}"><i style="background:${t.accent}"></i>${esc(txt)}</div>`;
// Trilho do Carrossel Infinito: na pergunta termina num nó na borda direita; no gabarito sai desse nó e acaba na seta.
const trilho = (lado) => lado === 'sai'
  ? `<div class="trilho" style="left:96px;right:-2px"></div><div class="no" style="right:-17px"></div>`
  : `<div class="trilho" style="left:-2px;right:120px"></div><div class="no" style="left:-17px"></div><div class="seta" style="right:96px"></div>`;

function pergunta(q, t) {
  return `<section style="background:${t.bg}">
    <div class="numero" style="-webkit-text-stroke:5px ${t.vazado}">${pad2(q.n)}</div>
    <div class="topo">${kicker(`Quiz ${pad2(q.n)} · ${q.tema}`, t)}
      <h1 style="color:${t.title}">Certo ou<br>errado?</h1></div>
    <div class="cartao" data-fit="afirmação ${q.n}" data-min="30" style="background:${t.cardBg};color:${t.cardFg}">
      <span class="aspas" style="color:${MENTA}">“</span><div>${md(q.afirmacao)}</div></div>
    <div class="botoes">
      <div class="botao" style="background:${t.bg === MENTA ? ESCURO : MENTA};color:${t.bg === MENTA ? MENTA : ESCURO}"><span>✔</span>Certo</div>
      <div class="botao" style="border:5px solid ${t.title};color:${t.title}"><span>✘</span>Errado</div>
    </div>
    <div class="dica" style="color:${t.fg}">Responde antes de passar: <b>o gabarito está no próximo story</b> ➜</div>
    ${trilho('sai')}${selo(t)}
  </section>`;
}

function gabarito(q, t) {
  const certo = q.gabarito === 'certo';
  const cor = certo ? MENTA : ERRO;
  return `<section style="background:${t.bg}">
    <div class="topo">${kicker(`Gabarito · Quiz ${pad2(q.n)}`, t)}</div>
    <div class="veredito">
      <div class="marca" style="background:${cor};color:${certo ? ESCURO : '#fff'}">${certo ? '✔' : '✘'}</div>
      <h2 style="color:${t.title}">${certo ? 'Certo' : 'Errado'}</h2>
    </div>
    <div class="relembra" style="color:${t.fg};border-color:${cor}">${md(q.afirmacao)}</div>
    <div class="cartao explica" data-fit="gabarito ${q.n}" data-min="28" style="background:${t.cardBg};color:${t.cardFg}">
      <div class="porque" style="color:${MENTA}">Por quê?</div>
      <div>${md(q.explicacao)}</div>
      ${q.fundamento ? `<div class="fundamento" style="background:${MENTA};color:${ESCURO}">${esc(q.fundamento)}</div>` : ''}
    </div>
    <div class="dica" style="color:${t.fg}">Acertou? <b>Manda pra quem vai fazer a OAB.</b></div>
    ${trilho('chega')}${selo(t)}
  </section>`;
}

export function renderCarrossel(c) {
  const q = c.quiz, avisos = [];
  if (!q || !q.afirmacao || !['certo', 'errado'].includes(q.gabarito)) avisos.push('quiz sem afirmacao ou com gabarito diferente de "certo"/"errado"');
  const [tp, tg] = (PARES[(q?.n - 1) % PARES.length] || PARES[0]).map(k => TEMAS[k]);
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Antonio:wght@700&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Poppins,sans-serif;-webkit-font-smoothing:antialiased}
section{position:relative;width:${W}px;height:${H}px;overflow:hidden}
h1,h2,.numero,.botao{font-family:Antonio,sans-serif;font-weight:700;text-transform:uppercase}
.topo{position:absolute;left:96px;right:96px;top:250px;z-index:3}
.kicker{display:flex;align-items:center;gap:16px;font:600 26px Poppins;letter-spacing:4px;text-transform:uppercase}
.kicker i{display:block;width:48px;height:3px;flex:none}
h1{font-size:176px;line-height:.94;margin-top:26px}
.numero{position:absolute;right:40px;top:150px;font-size:560px;line-height:.8;color:transparent;z-index:1}
.cartao{position:absolute;left:96px;right:96px;border-radius:28px;padding:60px 60px 56px;font-size:50px;font-weight:500;line-height:1.3;text-wrap:pretty;overflow:hidden;z-index:3}
.cartao b{font-weight:700}
section > .cartao:not(.explica){top:720px;height:560px;display:flex;flex-direction:column;justify-content:center}
.aspas{display:block;font:700 130px/0.6 Antonio;height:56px}
.botoes{position:absolute;left:96px;right:96px;top:1340px;display:flex;gap:32px;z-index:3}
.botao{flex:1;height:150px;border-radius:75px;display:flex;align-items:center;justify-content:center;gap:22px;font-size:84px;line-height:1}
.botao span{font-family:Poppins;font-size:56px;font-weight:700}
.dica{position:absolute;left:96px;right:96px;top:1535px;font-size:32px;line-height:1.4;text-align:center;z-index:3}
.dica b{font-weight:700}
.veredito{position:absolute;left:96px;right:96px;top:320px;display:flex;align-items:center;gap:40px;z-index:3}
.marca{width:210px;height:210px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:120px;font-weight:700;flex:none}
h2{font-size:250px;line-height:.9}
.relembra{position:absolute;left:96px;right:96px;top:600px;border-left:10px solid;padding:6px 0 6px 32px;font-size:32px;line-height:1.4;font-style:italic;opacity:.9;max-height:190px;overflow:hidden;z-index:3}
.explica{top:830px;height:640px;display:flex;flex-direction:column;gap:26px;font-size:44px}
.porque{font:700 64px/1 Antonio;text-transform:uppercase}
.fundamento{align-self:flex-start;margin-top:auto;padding:12px 26px;border-radius:14px;font-size:32px;font-weight:700;line-height:1.25}
.trilho{position:absolute;top:1672px;border-top:3px dashed ${VERDE};z-index:2}
.no{position:absolute;top:1657px;width:30px;height:30px;border-radius:50%;background:${GELO};border:3px solid ${VERDE};z-index:3}
.seta{position:absolute;top:1661.5px;width:0;height:0;border-left:24px solid ${VERDE};border-top:12px solid transparent;border-bottom:12px solid transparent;z-index:3}
.selo{position:absolute;top:1740px;left:50%;transform:translateX(-50%);padding:8px 18px;border-radius:8px;font:400 24px Poppins;white-space:nowrap;z-index:3}
.selo b{font-weight:700}
</style></head><body>${q ? pergunta(q, tp) + gabarito(q, tg) : ''}</body></html>`;
  return { html, total: 2, avisos, largura: W, altura: H };
}
