// Direções no estilo de best-sellers de não ficção (pedido: "estilo livros best-sellers, está muito artificial"):
// cor chapada com textura de papel fosco (sem degradê digital nem brilho), tipografia grande e confiante,
// chamada curta no topo, autor em destaque e, no máximo, um gesto gráfico (traço de caneta, grifo, rasura).
// Importado pelo gerar.mjs.
const AUTOR = 'Líbero Alves Rodrigues Filho';
const AUTOR_CURTO = 'Líbero Filho';
const W = 640, H = 920;
export const FONTES6 = 'family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&family=Libre+Franklin:wght@500;700;800;900&family=Permanent+Marker';

// Papel fosco: ruído fino e uma leve variação de tom nas bordas (como impressão offset).
const papel = (cor, grao) => `<div style="position:absolute;inset:0;background:${cor}"></div>
  <div style="position:absolute;inset:0;background:radial-gradient(120% 90% at 50% 40%,rgba(255,255,255,.05),rgba(0,0,0,.12))"></div>${grao(.22)}`;
// Traço de marca-texto feito à mão (SVG irregular).
const grifo = (cor, w, h = 26) => `<svg viewBox="0 0 300 30" preserveAspectRatio="none" style="position:absolute;left:-6px;bottom:2px;width:${w}px;height:${h}px;z-index:-1"><path d="M3 17 C40 9 90 12 150 10 S260 8 297 13 L295 25 C240 22 170 27 110 25 S30 27 5 27Z" fill="${cor}" opacity=".9"/></svg>`;

export const V6 = grao => [
  {
    id: 'habito', nome: 'Hábito', grupo: 'Best-seller · verde',
    conceito: 'No espírito de “Hábitos Atômicos”: verde-garrafa chapado, chamada curta no topo, título enorme em grotesca pesada e um único grifo amarelo feito à mão em “argumentar”. O nome do autor grande no pé, como livro de livraria.',
    tit: "'Libre Franklin',sans-serif", txt: "'Libre Franklin',sans-serif", tipos: ['Libre Franklin', 'Libre Franklin'],
    cores: [['Garrafa', '#123D2E'], ['Garrafa escuro', '#0C2C21'], ['Grifo', '#F2C94C'], ['Papel', '#F5F1E6'], ['Branco', '#FFFFFF']],
    bg: '#123D2E', ac: '#123D2E', lt: '#F2C94C', dk: '#0C2C21', papel: '#F7F4EC',
    capa: v => `${papel('#123D2E', grao)}
      <div style="position:absolute;left:56px;right:56px;top:58px;font-family:'Libre Franklin';font-weight:500;font-size:17px;line-height:1.4;color:#E9E4D4;text-align:center">O método simples para transformar o que você sabe em respostas que pontuam</div>
      <div style="position:absolute;left:56px;right:40px;top:190px;color:#fff;font-family:'Libre Franklin';font-weight:900;font-size:88px;line-height:.92;letter-spacing:-.035em">O segredo<br>pra <span style="background:linear-gradient(transparent 52%,#F2C94C 52%,#F2C94C 90%,transparent 90%);color:#fff;padding:0 4px">argumentar</span><br>em provas<br>discursivas</div>
      <div style="position:absolute;left:56px;right:56px;bottom:150px;height:2px;background:#E9E4D4;opacity:.5"></div>
      <div style="position:absolute;left:56px;bottom:84px;font-family:'Libre Franklin';font-weight:800;font-size:34px;letter-spacing:.02em;color:#fff;text-transform:uppercase">${AUTOR_CURTO}</div>
      <div style="position:absolute;right:56px;bottom:92px;font-family:'Libre Franklin';font-weight:700;font-size:13px;letter-spacing:.22em;color:#E9E4D4">OAB · CONCURSOS</div>`,
  },
  {
    id: 'classico', nome: 'Clássico', grupo: 'Best-seller · azul',
    conceito: 'No espírito de “A Psicologia Financeira”: azul-marinho fosco, título centralizado em serifa de livro (Caslon), uma pena de caneta desenhada em traço fino e o autor em versalete. Sério, atemporal, cara de clássico de livraria.',
    tit: "'Libre Caslon Text',serif", txt: "'Libre Franklin',sans-serif", tipos: ['Libre Caslon Text', 'Libre Franklin'],
    cores: [['Marinho', '#13233F'], ['Noite', '#0C1830'], ['Creme', '#EFE6D2'], ['Latão', '#C9A86A'], ['Branco', '#FFFFFF']],
    bg: '#13233F', ac: '#13233F', lt: '#C9A86A', dk: '#0C1830', papel: '#F8F5EE',
    capa: v => `${papel('#13233F', grao)}
      <div style="position:absolute;left:0;right:0;top:66px;text-align:center;font-family:'Libre Franklin';font-weight:700;font-size:14px;letter-spacing:.34em;color:#C9A86A">OAB · CONCURSOS</div>
      <div style="position:absolute;left:40px;right:40px;top:170px;text-align:center;color:#EFE6D2">
        <div style="font-family:'Libre Caslon Text';font-size:86px;line-height:1;letter-spacing:-.01em">O segredo</div>
        <div style="font-family:'Libre Caslon Text';font-style:italic;font-size:36px;line-height:1.3;margin-top:22px">pra argumentar em<br>provas discursivas</div></div>
      <svg viewBox="0 0 120 220" style="position:absolute;left:50%;top:470px;width:96px;margin-left:-48px"><g fill="none" stroke="#C9A86A" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"><path d="M60 8 C84 40 96 86 92 128 L60 212 L28 128 C24 86 36 40 60 8Z"/><path d="M60 212 V120"/><circle cx="60" cy="112" r="8"/><path d="M40 150 H80"/></g></svg>
      <div style="position:absolute;left:0;right:0;top:720px;text-align:center;font-family:'Libre Franklin';font-weight:500;font-size:17px;line-height:1.5;color:#C9CCD6">O que ninguém te ensina sobre<br>convencer quem corrige a sua prova</div>
      <div style="position:absolute;left:0;right:0;bottom:62px;text-align:center;font-family:'Libre Caslon Text';font-size:26px;letter-spacing:.14em;color:#EFE6D2">LÍBERO FILHO</div>`,
  },
  {
    id: 'rasura', nome: 'Rasura', grupo: 'Best-seller · azul',
    conceito: 'Um truque tipográfico que vende o livro em um segundo: “decorar” riscado à caneta vermelha e, acima, “argumentar” escrito à mão. Fundo azul-royal fosco e grotesca pesada, como best-sellers de comportamento.',
    tit: "'Libre Franklin',sans-serif", txt: "'Libre Franklin',sans-serif", tipos: ['Libre Franklin · Permanent Marker', 'Libre Franklin'],
    cores: [['Royal', '#1F4AA8'], ['Marinho', '#152F6E'], ['Caneta', '#E63B2E'], ['Papel', '#F6F2E8'], ['Branco', '#FFFFFF']],
    bg: '#1F4AA8', ac: '#1F4AA8', lt: '#F6F2E8', dk: '#152F6E', papel: '#F8F6F0',
    capa: v => `${papel('#1F4AA8', grao)}
      <div style="position:absolute;left:56px;right:56px;top:60px;font-family:'Libre Franklin';font-weight:700;font-size:15px;letter-spacing:.24em;color:#F6F2E8;opacity:.9">PARA A 2ª FASE DA OAB E CONCURSOS</div>
      <div style="position:absolute;left:52px;right:40px;top:170px;color:#fff;font-family:'Libre Franklin';font-weight:900;font-size:92px;line-height:.95;letter-spacing:-.04em">
        O segredo<br>pra <span style="position:relative;display:inline-block;opacity:.85">decorar<svg viewBox="0 0 300 40" preserveAspectRatio="none" style="position:absolute;left:-10px;top:38%;width:110%;height:34px"><path d="M4 26 C80 14 170 22 296 8" fill="none" stroke="#E63B2E" stroke-width="9" stroke-linecap="round"/><path d="M10 34 C100 24 200 28 290 18" fill="none" stroke="#E63B2E" stroke-width="5" stroke-linecap="round" opacity=".8"/></svg></span><br>
          <span style="display:inline-block;font-family:'Permanent Marker';font-weight:400;font-size:74px;line-height:1.15;letter-spacing:0;color:#FF5A4A;transform:rotate(-4deg);margin:4px 0 8px 70px">argumentar</span><br>em provas<br>discursivas</div>
      <div style="position:absolute;left:56px;right:56px;top:740px;font-family:'Libre Franklin';font-weight:500;font-size:20px;line-height:1.45;color:#F6F2E8">Não basta saber a lei. É preciso convencer quem corrige.</div>
      <div style="position:absolute;left:56px;bottom:66px;font-family:'Libre Franklin';font-weight:800;font-size:32px;color:#fff;text-transform:uppercase;letter-spacing:.02em">${AUTOR_CURTO}</div>`,
  },
  {
    id: 'livraria', nome: 'Livraria', grupo: 'Best-seller · verde',
    conceito: 'Capa creme com tipografia verde-escura, como os livros de negócios que dominam a vitrine: autor no alto, título gigante empilhado e um pequeno selo verde. Clara, limpa e muito “de verdade”.',
    tit: "'Libre Franklin',sans-serif", txt: "'Libre Caslon Text',serif", tipos: ['Libre Franklin', 'Libre Caslon Text'],
    cores: [['Creme', '#F1EBDD'], ['Verde', '#1B4D38'], ['Verde escuro', '#123828'], ['Laranja', '#E2763A'], ['Tinta', '#1C1C1A']],
    bg: '#1B4D38', ac: '#1B4D38', lt: '#E2763A', dk: '#123828', papel: '#FBF8F1',
    capa: v => `${papel('#F1EBDD', grao)}
      <div style="position:absolute;left:56px;right:56px;top:60px;display:flex;justify-content:space-between;align-items:center;font-family:'Libre Franklin';font-weight:800;font-size:22px;letter-spacing:.06em;color:#1B4D38;text-transform:uppercase"><span>${AUTOR_CURTO}</span><span style="font-weight:700;font-size:13px;letter-spacing:.22em">OAB · CONCURSOS</span></div>
      <div style="position:absolute;left:56px;right:56px;top:96px;height:2px;background:#1B4D38"></div>
      <div style="position:absolute;left:52px;right:40px;top:170px;font-family:'Libre Franklin';font-weight:900;font-size:122px;line-height:.86;letter-spacing:-.05em;color:#1B4D38;text-transform:uppercase">O<br>segredo</div>
      <div style="position:absolute;left:56px;right:56px;top:440px;font-family:'Libre Caslon Text';font-style:italic;font-size:40px;line-height:1.2;color:#1C1C1A">pra argumentar em<br>provas discursivas</div>
      <div style="position:absolute;right:56px;bottom:180px;width:150px;height:150px;border-radius:50%;background:#E2763A;color:#fff;display:flex;align-items:center;justify-content:center;text-align:center;font-family:'Libre Franklin';font-weight:800;font-size:17px;line-height:1.2;transform:rotate(-10deg)">Da leitura<br>do enunciado<br>à nota máxima</div>
      <div style="position:absolute;left:56px;right:56px;bottom:64px;font-family:'Libre Caslon Text';font-size:19px;color:#1C1C1A">${AUTOR}</div>`,
  },
  {
    id: 'moderno', nome: 'Moderno', grupo: 'Best-seller · verde',
    conceito: 'Verde-musgo chapado e o título em caixa alta ocupando quase a capa inteira, justificado de margem a margem, como os best-sellers de comportamento mais recentes. Só tipografia, com uma palavra em creme.',
    tit: "'Libre Franklin',sans-serif", txt: "'Libre Franklin',sans-serif", tipos: ['Libre Franklin', 'Libre Franklin'],
    cores: [['Musgo', '#2F5D3A'], ['Musgo escuro', '#22462B'], ['Creme', '#F3E9CF'], ['Tinta', '#11241A'], ['Branco', '#FFFFFF']],
    bg: '#2F5D3A', ac: '#2F5D3A', lt: '#F3E9CF', dk: '#22462B', papel: '#FAF7EF',
    capa: v => `${papel('#2F5D3A', grao)}
      <div style="position:absolute;left:46px;right:46px;top:60px;font-family:'Libre Franklin';font-weight:900;text-transform:uppercase;letter-spacing:-.03em;line-height:.88;color:#11241A">
        <div style="font-size:96px">O segredo</div>
        <div style="font-size:150px;color:#F3E9CF">pra</div>
        <div style="font-size:72px;color:#F3E9CF">argumentar</div>
        <div style="font-size:74px;white-space:nowrap">em provas</div>
        <div style="font-size:72px">discursivas</div></div>
      <div style="position:absolute;left:50px;right:50px;bottom:130px;height:2px;background:#11241A;opacity:.6"></div>
      <div style="position:absolute;left:50px;bottom:70px;font-family:'Libre Franklin';font-weight:800;font-size:28px;color:#F3E9CF;text-transform:uppercase">${AUTOR_CURTO}</div>
      <div style="position:absolute;right:50px;bottom:76px;font-family:'Libre Franklin';font-weight:700;font-size:13px;letter-spacing:.2em;color:#11241A">OAB · CONCURSOS</div>`,
  },
  {
    id: 'noite', nome: 'Noite', grupo: 'Best-seller · azul',
    conceito: 'Azul-noite fosco com o título em serifa grande alinhado à esquerda e “argumentar” em itálico. No pé, uma linha de apoio e o autor. Elegante como best-seller de desenvolvimento pessoal, sem enfeites.',
    tit: "'Libre Caslon Text',serif", txt: "'Libre Franklin',sans-serif", tipos: ['Libre Caslon Text', 'Libre Franklin'],
    cores: [['Noite', '#0F1B33'], ['Ardósia', '#1B2B4D'], ['Areia', '#E8DCC0'], ['Céu', '#8FA8D8'], ['Branco', '#FFFFFF']],
    bg: '#0F1B33', ac: '#1B2B4D', lt: '#E8DCC0', dk: '#0F1B33', papel: '#F8F6F1',
    capa: v => `${papel('#0F1B33', grao)}
      <div style="position:absolute;left:56px;right:50px;top:150px;color:#E8DCC0;font-family:'Libre Caslon Text';font-size:84px;line-height:1.02;letter-spacing:-.015em">O segredo<br>pra <i style="color:#8FA8D8">argumentar</i><br>em provas<br>discursivas</div>
      <div style="position:absolute;left:58px;top:600px;width:60px;height:3px;background:#E8DCC0"></div>
      <div style="position:absolute;left:58px;right:56px;top:640px;font-family:'Libre Franklin';font-weight:500;font-size:20px;line-height:1.5;color:#C9D2E6">Como sair do “eu sei a resposta” para a resposta que o examinador não consegue deixar de pontuar.</div>
      <div style="position:absolute;left:58px;bottom:66px;font-family:'Libre Franklin';font-weight:700;font-size:20px;letter-spacing:.2em;color:#E8DCC0">LÍBERO FILHO</div>
      <div style="position:absolute;right:56px;bottom:68px;font-family:'Libre Franklin';font-weight:700;font-size:12px;letter-spacing:.22em;color:#8FA8D8">OAB · CONCURSOS</div>`,
  },
];
