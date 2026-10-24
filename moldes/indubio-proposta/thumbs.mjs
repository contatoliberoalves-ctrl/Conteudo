// Miniaturas de YouTube (1280×720) usadas como bônus nas propostas. Cada estilo é uma composição pronta;
// "foto" (recorte PNG sem fundo, em fotos/) põe a pessoa à direita e o texto à esquerda.
const F = "font-family:'Bricolage Grotesque',sans-serif;font-weight:800;letter-spacing:-.04em;text-transform:uppercase";
const I = "font-family:'Inter',sans-serif";
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const lista = v => (v == null ? [] : Array.isArray(v) ? v : [v]);
const tag = (t, bg, fg) => `<span style="display:inline-block;background:${bg};color:${fg};${I};font-weight:800;font-size:30px;letter-spacing:.12em;text-transform:uppercase;padding:12px 24px;border-radius:10px">${esc(t)}</span>`;
const grao = `<div style="position:absolute;inset:0;background-image:url(../assets/grao.png);background-size:400px;opacity:.35;mix-blend-mode:overlay"></div>`;
const pessoa = (src, h = 760, r = -40) => src ? `<img src="${src}" style="position:absolute;right:${r}px;bottom:-40px;height:${h}px;filter:drop-shadow(-20px 10px 40px rgba(0,0,0,.45))">` : '';

export const ESTILOS = {
  // Fundo escuro, palavra-chave gigante em vermelho com carimbo, nota 0,00 num círculo.
  zera: t => `<div style="position:absolute;inset:0;background:radial-gradient(90% 90% at 20% 30%,#2A1414 0%,#0D0B0B 70%)"></div>${grao}
    ${t.foto ? '' : `<div style="position:absolute;right:70px;top:120px;width:420px;height:420px;border-radius:50%;border:16px solid #FF2E3A;display:flex;align-items:center;justify-content:center;transform:rotate(-10deg)"><span style="${F};font-size:190px;color:#FF2E3A">0,00</span></div>`}
    ${pessoa(t.foto, 760, -30)}
    <div style="position:absolute;left:70px;top:70px;${t.foto ? 'width:720px' : 'width:700px'}">${tag('OAB', '#FF2E3A', '#fff')}
      <div style="${F};font-size:118px;line-height:.92;color:#fff;margin-top:34px">O que</div>
      <div style="${F};font-size:250px;line-height:.82;color:#FF2E3A;text-shadow:0 10px 0 #5A0B10">zera</div>
      <div style="${F};font-size:110px;line-height:.95;color:#fff">na 2ª fase?</div></div>`,
  // Amarelo vivo, texto preto, coluna de vistos.
  gabaritar: t => `<div style="position:absolute;inset:0;background:#FFD43B"></div>${grao}
    ${t.foto ? '' : `<div style="position:absolute;right:60px;top:110px;display:grid;grid-template-columns:repeat(3,100px);gap:16px">${Array.from({ length: 9 }, () => `<div style="width:100px;height:100px;border-radius:20px;background:#111;display:flex;align-items:center;justify-content:center"><svg viewBox="0 0 24 24" width="64"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#FFD43B" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`).join('')}</div>`}
    ${pessoa(t.foto, 780, -20)}
    <div style="position:absolute;left:70px;top:80px;width:${t.foto ? 740 : 700}px">${tag('1ª fase OAB', '#111', '#FFD43B')}
      <div style="${F};font-size:104px;line-height:.92;color:#111;margin-top:30px">Como</div>
      <div style="${F};font-size:150px;line-height:.86;color:#111;background:#fff;display:inline-block;padding:4px 18px 0;transform:rotate(-2deg);margin:6px 0 10px">gabaritar</div>
      <div style="${F};font-size:96px;line-height:.95;color:#111">constitucional</div></div>`,
  // Azul profundo com lupa e etiqueta "Qual é a peça?".
  identificacao: t => `<div style="position:absolute;inset:0;background:linear-gradient(135deg,#0B2A6F 0%,#0B4FD8 100%)"></div>${grao}
    <svg viewBox="0 0 24 24" style="position:absolute;right:30px;top:150px;width:380px" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"><circle cx="10" cy="10" r="6.5" stroke-width="1.8"/><path d="M15 15l6 6" stroke-width="2.6"/></svg>
    <div style="position:absolute;right:130px;top:250px;${F};font-size:120px;color:#FFD43B;transform:rotate(-8deg)">?</div>
    <div style="position:absolute;left:70px;top:80px;width:760px">${tag('Constitucional', '#FFD43B', '#0B2A6F')}
      <div style="${F};font-size:100px;line-height:.92;color:#fff;margin-top:30px">Técnicas de</div>
      <div style="${F};font-size:118px;line-height:.95;color:#FFD43B">identificação</div>
      <div style="display:inline-block;margin-top:24px;background:#fff;color:#0B2A6F;${F};font-size:62px;padding:10px 24px 4px;border-radius:14px;transform:rotate(-2deg)">Qual é a peça?</div></div>`,
  // Roxo, sigla gigante e etiquetas de palavras-chave (as "pistas" do enunciado).
  sigla: t => `<div style="position:absolute;inset:0;background:${t.fundo || 'linear-gradient(135deg,#2E0575 0%,#6A1FD0 100%)'}"></div>${grao}
    <div style="position:absolute;right:-30px;top:-60px;${F};font-size:${t.ts || 520}px;line-height:.8;color:rgba(255,255,255,.12)">${esc(t.sigla)}</div>
    <div style="position:absolute;left:70px;top:70px;width:1140px">${tag('Palavras-chave', '#fff', t.cor || '#2E0575')}
      <div style="${F};font-size:${t.tt || 150}px;line-height:.9;color:#fff;margin-top:30px">${lista(t.texto || t.titulo).map(esc).join('<br>')}</div>
      <div style="display:flex;flex-wrap:wrap;gap:16px;margin-top:34px;max-width:1000px">${lista(t.chips).map((c, i) => `<span style="background:${i % 2 ? '#fff' : t.destaque || '#FFD43B'};color:#111;${I};font-weight:800;font-size:36px;padding:12px 26px;border-radius:999px;transform:rotate(${i % 2 ? 2 : -2}deg)">${esc(c)}</span>`).join('')}</div></div>`,
  // Placar: a conta da nota da 2ª fase.
  pontuacao: t => `<div style="position:absolute;inset:0;background:#0F1A2E"></div>${grao}
    <div style="position:absolute;left:70px;top:70px">${tag('2ª fase OAB', '#22C55E', '#0F1A2E')}</div>
    <div style="position:absolute;left:70px;top:170px;${F};font-size:110px;line-height:.92;color:#fff">Como funciona<br>a <span style="color:#22C55E">pontuação</span></div>
    <div style="position:absolute;left:70px;right:70px;bottom:70px;display:flex;align-items:center;gap:22px">
      ${[['Peça', '5,0'], ['+', ''], ['4 questões', '4 × 1,25'], ['=', ''], ['Total', '10,0']].map(([a, b]) => b ? `<div style="flex:1;background:#fff;border-radius:22px;padding:18px 20px;text-align:center"><div style="${I};font-weight:800;font-size:26px;letter-spacing:.1em;text-transform:uppercase;color:#64748B">${a}</div><div style="${F};font-size:78px;line-height:1;color:#0F1A2E">${b}</div></div>` : `<div style="${F};font-size:80px;color:#22C55E">${a}</div>`).join('')}
      <div style="flex:none;background:#22C55E;border-radius:22px;padding:18px 26px;text-align:center;transform:rotate(-4deg)"><div style="${I};font-weight:800;font-size:26px;letter-spacing:.1em;color:#0F1A2E">PRA PASSAR</div><div style="${F};font-size:78px;line-height:1;color:#0F1A2E">6,0</div></div></div>`,
};

export function htmlThumb(t, HEAD) {
  return `<!doctype html><html><head>${HEAD}<style>*{box-sizing:border-box}html,body{margin:0;width:1280px;height:720px;overflow:hidden}</style></head>
<body><div style="position:relative;width:1280px;height:720px;overflow:hidden">${ESTILOS[t.estilo](t)}</div></body></html>`;
}
