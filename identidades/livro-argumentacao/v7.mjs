// Variações a partir das preferidas do autor, Rasura e Hábito (v6): mesma tipografia pesada, papel fosco,
// grifo amarelo e caneta vermelha, trocando cor de fundo e combinando os dois gestos. Importado pelo gerar.mjs.
const AUTOR_CURTO = 'Líbero Filho';
const LF = "font-family:'Libre Franklin'";
const papel = (cor, grao) => `<div style="position:absolute;inset:0;background:${cor}"></div>
  <div style="position:absolute;inset:0;background:radial-gradient(120% 90% at 50% 40%,rgba(255,255,255,.05),rgba(0,0,0,.12))"></div>${grao(.22)}`;
const grifado = (t, cor, txt) => `<span style="background:linear-gradient(transparent 52%,${cor} 52%,${cor} 90%,transparent 90%);color:${txt};padding:0 4px">${t}</span>`;
const riscado = (t, caneta, op = .85) => `<span style="position:relative;display:inline-block;opacity:${op}">${t}<svg viewBox="0 0 300 40" preserveAspectRatio="none" style="position:absolute;left:-10px;top:38%;width:110%;height:34px"><path d="M4 26 C80 14 170 22 296 8" fill="none" stroke="${caneta}" stroke-width="9" stroke-linecap="round"/><path d="M10 34 C100 24 200 28 290 18" fill="none" stroke="${caneta}" stroke-width="5" stroke-linecap="round" opacity=".8"/></svg></span>`;
const mao = (t, cor, px = 74, ml = 70) => `<span style="display:inline-block;font-family:'Permanent Marker';font-weight:400;font-size:${px}px;line-height:1.15;letter-spacing:0;color:${cor};transform:rotate(-4deg);margin:4px 0 8px ${ml}px">${t}</span>`;
const base = (o) => ({ tit: "'Libre Franklin',sans-serif", txt: "'Libre Franklin',sans-serif", tipos: ['Libre Franklin · Permanent Marker', 'Libre Franklin'], ...o });
const rodape = (cor, sub) => `<div style="position:absolute;left:56px;right:56px;bottom:140px;height:2px;background:${sub};opacity:.5"></div>
  <div style="position:absolute;left:56px;bottom:74px;${LF};font-weight:800;font-size:32px;color:${cor};text-transform:uppercase;letter-spacing:.02em">${AUTOR_CURTO}</div>
  <div style="position:absolute;right:56px;bottom:82px;${LF};font-weight:700;font-size:13px;letter-spacing:.22em;color:${sub}">OAB · CONCURSOS</div>`;
const titulo = (cor, meio, top = 170, px = 92) => `<div style="position:absolute;left:52px;right:40px;top:${top}px;color:${cor};${LF};font-weight:900;font-size:${px}px;line-height:.95;letter-spacing:-.04em">O segredo<br>${meio}<br>em provas<br>discursivas</div>`;

export const V7 = grao => [
  base({
    id: 'rasura-verde', nome: 'Rasura verde', grupo: 'Variação de Rasura',
    conceito: 'A Rasura no verde-garrafa da Hábito: “decorar” riscado e “argumentar” escrito à mão em amarelo-marca-texto, a cor do grifo. Une as duas preferidas.',
    cores: [['Garrafa', '#123D2E'], ['Garrafa escuro', '#0C2C21'], ['Amarelo', '#F2C94C'], ['Papel', '#F5F1E6'], ['Branco', '#FFFFFF']],
    bg: '#123D2E', ac: '#123D2E', lt: '#F2C94C', dk: '#0C2C21', papel: '#F7F4EC',
    capa: v => `${papel('#123D2E', grao)}
      <div style="position:absolute;left:56px;right:56px;top:60px;${LF};font-weight:700;font-size:15px;letter-spacing:.24em;color:#E9E4D4">PARA A 2ª FASE DA OAB E CONCURSOS</div>
      ${titulo('#fff', `pra ${riscado('decorar', '#F2C94C')}<br>${mao('argumentar', '#F2C94C')}`)}
      <div style="position:absolute;left:56px;right:56px;top:740px;${LF};font-weight:500;font-size:20px;line-height:1.45;color:#E9E4D4">Não basta saber a lei. É preciso convencer quem corrige.</div>
      ${rodape('#fff', '#E9E4D4')}`,
  }),
  base({
    id: 'rasura-grifo', nome: 'Rasura + grifo', grupo: 'Rasura + Hábito',
    conceito: 'Os dois gestos juntos, no azul da Rasura: “decorar” riscado à caneta vermelha e “argumentar” impresso, firme, com o grifo amarelo da Hábito. Menos manuscrito, mais livro de vitrine.',
    cores: [['Royal', '#1F4AA8'], ['Marinho', '#152F6E'], ['Caneta', '#E63B2E'], ['Grifo', '#F2C94C'], ['Branco', '#FFFFFF']],
    bg: '#1F4AA8', ac: '#1F4AA8', lt: '#F2C94C', dk: '#152F6E', papel: '#F8F6F0',
    capa: v => `${papel('#1F4AA8', grao)}
      <div style="position:absolute;left:56px;right:56px;top:58px;${LF};font-weight:500;font-size:17px;line-height:1.4;color:#F6F2E8;text-align:center">O método simples para transformar o que você sabe em respostas que pontuam</div>
      <div style="position:absolute;left:52px;right:40px;top:180px;color:#fff;${LF};font-weight:900;font-size:90px;line-height:.98;letter-spacing:-.04em">O segredo<br>pra ${riscado('decorar', '#FF5A4A', .75)}<br>${grifado('argumentar', '#F2C94C', '#152F6E')}<br>em provas<br>discursivas</div>
      ${rodape('#fff', '#F6F2E8')}`,
  }),
  base({
    id: 'rasura-creme', nome: 'Rasura creme', grupo: 'Variação de Rasura',
    conceito: 'A Rasura como uma folha de prova corrigida: papel creme, título em azul-marinho e a correção em caneta vermelha. Clara e muito reconhecível na vitrine.',
    cores: [['Papel', '#F3EDE0'], ['Marinho', '#13274F'], ['Caneta', '#D8362A'], ['Grafite', '#2B2B2B'], ['Branco', '#FFFFFF']],
    bg: '#13274F', ac: '#13274F', lt: '#D8362A', dk: '#13274F', papel: '#FBF8F2',
    capa: v => `${papel('#F3EDE0', grao)}
      <div style="position:absolute;left:56px;right:56px;top:60px;${LF};font-weight:700;font-size:15px;letter-spacing:.24em;color:#13274F">PARA A 2ª FASE DA OAB E CONCURSOS</div>
      ${titulo('#13274F', `pra ${riscado('decorar', '#D8362A', .8)}<br>${mao('argumentar', '#D8362A')}`)}
      <div style="position:absolute;left:56px;right:56px;top:740px;${LF};font-weight:500;font-size:20px;line-height:1.45;color:#2B2B2B">Não basta saber a lei. É preciso convencer quem corrige.</div>
      ${rodape('#13274F', '#13274F')}`,
  }),
  base({
    id: 'habito-azul', nome: 'Hábito azul', grupo: 'Variação de Hábito',
    conceito: 'A Hábito em azul-marinho fosco: mesma chamada, título pesado e o grifo amarelo em “argumentar”. Mais séria que a verde.',
    cores: [['Marinho', '#152B57'], ['Noite', '#0E1E3F'], ['Grifo', '#F2C94C'], ['Papel', '#F5F1E6'], ['Branco', '#FFFFFF']],
    bg: '#152B57', ac: '#152B57', lt: '#F2C94C', dk: '#0E1E3F', papel: '#F8F6F0',
    capa: v => `${papel('#152B57', grao)}
      <div style="position:absolute;left:56px;right:56px;top:58px;${LF};font-weight:500;font-size:17px;line-height:1.4;color:#E6E9F2;text-align:center">O método simples para transformar o que você sabe em respostas que pontuam</div>
      ${titulo('#fff', `pra ${grifado('argumentar', '#F2C94C', '#fff')}`, 190, 88)}
      ${rodape('#fff', '#E6E9F2')}`,
  }),
  base({
    id: 'habito-caneta', nome: 'Hábito corrigida', grupo: 'Hábito + Rasura',
    conceito: 'A Hábito verde com a mão do corretor: “argumentar” circulado em vermelho e um “nota 10 ✓” escrito à margem. O grifo vira correção, e a promessa do livro aparece sem precisar de texto.',
    cores: [['Garrafa', '#123D2E'], ['Garrafa escuro', '#0C2C21'], ['Caneta', '#FF5A4A'], ['Papel', '#F5F1E6'], ['Branco', '#FFFFFF']],
    bg: '#123D2E', ac: '#123D2E', lt: '#FF5A4A', dk: '#0C2C21', papel: '#F7F4EC',
    capa: v => `${papel('#123D2E', grao)}
      <div style="position:absolute;left:56px;right:56px;top:58px;${LF};font-weight:500;font-size:17px;line-height:1.4;color:#E9E4D4;text-align:center">O método simples para transformar o que você sabe em respostas que pontuam</div>
      ${titulo('#fff', `pra <span style="position:relative;display:inline-block">argumentar<svg viewBox="0 0 500 140" preserveAspectRatio="none" style="position:absolute;left:-26px;top:-22px;width:calc(100% + 52px);height:calc(100% + 40px)"><path d="M30 80 C20 30 140 12 260 14 S490 30 484 72 S380 128 240 126 S20 118 34 70" fill="none" stroke="#FF5A4A" stroke-width="6" stroke-linecap="round"/></svg></span>`, 190, 88)}
      <div style="position:absolute;right:60px;top:660px;font-family:'Permanent Marker';font-size:50px;color:#FF5A4A;transform:rotate(-8deg)">nota 10 ✓</div>
      ${rodape('#fff', '#E9E4D4')}`,
  }),
  base({
    id: 'habito-creme', nome: 'Hábito creme', grupo: 'Variação de Hábito',
    conceito: 'A Hábito invertida: papel creme, título em verde-garrafa e o grifo amarelo. Fica leve, de livraria, e ainda mais parecida com os best-sellers de capa clara.',
    cores: [['Papel', '#F3EDE0'], ['Garrafa', '#123D2E'], ['Grifo', '#F2C94C'], ['Grafite', '#2B2B2B'], ['Branco', '#FFFFFF']],
    bg: '#123D2E', ac: '#123D2E', lt: '#F2C94C', dk: '#0C2C21', papel: '#FBF8F2',
    capa: v => `${papel('#F3EDE0', grao)}
      <div style="position:absolute;left:56px;right:56px;top:58px;${LF};font-weight:500;font-size:17px;line-height:1.4;color:#2B2B2B;text-align:center">O método simples para transformar o que você sabe em respostas que pontuam</div>
      ${titulo('#123D2E', `pra ${grifado('argumentar', '#F2C94C', '#123D2E')}`, 190, 88)}
      ${rodape('#123D2E', '#123D2E')}`,
  }),
];
