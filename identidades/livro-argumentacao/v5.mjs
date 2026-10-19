// Direções minimalistas (pedido: "menos elementos"): só degradê, título e autor, com no máximo um detalhe.
// 3 em verde (Mata, Linha, Clareira) e 3 em azul-escuro (Noturno, Bloco, Aurora). Importado pelo gerar.mjs.
export const FONTES5 = 'family=Inter+Tight:wght@300;400;500;700;800;900';
const AUTOR = 'Líbero Alves Rodrigues Filho';

const verde = { tit: "'Inter Tight',sans-serif", txt: 'Inter,sans-serif', papel: '#FAFAF7' };
export const V5 = grao => [
  {
    ...verde, id: 'mata', nome: 'Mata', grupo: 'Minimalista · verde',
    conceito: 'Só o degradê verde, do quase preto ao esmeralda, e o título centralizado em serifa. Nenhum outro elemento: o silêncio da capa é o que dá peso.',
    tit: "'DM Serif Display',serif", tipos: ['DM Serif Display', 'Inter'],
    cores: [['Breu', '#03160F'], ['Mata', '#0A3B29'], ['Esmeralda', '#167A53'], ['Folha', '#8FD3AE'], ['Branco', '#FFFFFF']],
    bg: 'linear-gradient(180deg,#03160F 0%,#0A3B29 55%,#167A53 100%)', ac: '#167A53', lt: '#8FD3AE', dk: '#03160F',
    capa: v => `<div style="position:absolute;inset:0;background:${v.bg}"></div>${grao(.12)}
      <div style="position:absolute;left:0;right:0;top:330px;text-align:center;color:#fff">
        <div style="font-family:'DM Serif Display';font-size:112px;line-height:.9;letter-spacing:-.02em">O segredo</div>
        <div style="font-family:'DM Serif Display';font-style:italic;font-size:31px;line-height:1.2;margin-top:22px;color:#BFE6CF">pra argumentar em provas discursivas</div></div>
      <div style="position:absolute;left:0;right:0;bottom:70px;text-align:center;font-family:'Inter Tight';font-weight:500;font-size:15px;letter-spacing:.3em;color:rgba(255,255,255,.8)">${AUTOR.toUpperCase()}</div>`,
  },
  {
    ...verde, id: 'linha', nome: 'Linha', grupo: 'Minimalista · verde',
    conceito: 'Verde profundo quase liso, título grande alinhado à esquerda e um único fio dourado separando título e autor. Editorial e direto.',
    tipos: ['Inter Tight', 'Inter'],
    cores: [['Pinho', '#072E21'], ['Floresta', '#0D4532'], ['Ouro', '#D8B56A'], ['Névoa', '#DDEBE3'], ['Branco', '#FFFFFF']],
    bg: 'linear-gradient(170deg,#0D4532 0%,#072E21 100%)', ac: '#0D4532', lt: '#D8B56A', dk: '#072E21',
    capa: v => `<div style="position:absolute;inset:0;background:${v.bg}"></div>${grao(.12)}
      <div style="position:absolute;left:60px;right:50px;top:150px;color:#fff">
        <div style="font-family:'Inter Tight';font-weight:800;font-size:108px;line-height:.9;letter-spacing:-.055em">O segredo</div>
        <div style="font-family:'Inter Tight';font-weight:400;font-size:36px;line-height:1.15;margin-top:22px;letter-spacing:-.02em;color:#DDEBE3">pra argumentar em<br>provas discursivas</div></div>
      <div style="position:absolute;left:60px;right:60px;bottom:120px;height:1.5px;background:#D8B56A"></div>
      <div style="position:absolute;left:60px;bottom:72px;font-family:'Inter Tight';font-weight:500;font-size:18px;color:#fff">${AUTOR}</div>`,
  },
  {
    ...verde, id: 'clareira', nome: 'Clareira', grupo: 'Minimalista · verde',
    conceito: 'Um único brilho suave no alto, como luz entrando na mata, sobre o verde-escuro. O título fica embaixo, pequeno e firme. Calmo e sofisticado.',
    tipos: ['Inter Tight', 'Inter'],
    cores: [['Noite', '#04241A'], ['Musgo', '#0B4A35'], ['Luz', '#7FE0A8'], ['Creme', '#F3F1E8'], ['Branco', '#FFFFFF']],
    bg: 'radial-gradient(70% 45% at 50% 0%,#2E9E6C 0%,rgba(46,158,108,0) 75%),linear-gradient(180deg,#0B4A35 0%,#04241A 100%)', ac: '#0B4A35', lt: '#7FE0A8', dk: '#04241A',
    capa: v => `<div style="position:absolute;inset:0;background:${v.bg}"></div>${grao(.12)}
      <div style="position:absolute;left:60px;right:60px;bottom:150px;color:#fff">
        <div style="font-family:'Inter Tight';font-weight:700;font-size:82px;line-height:.92;letter-spacing:-.05em">O segredo</div>
        <div style="font-family:'Inter Tight';font-weight:400;font-size:28px;line-height:1.2;margin-top:16px;color:#CFEBDB">pra argumentar em provas discursivas</div></div>
      <div style="position:absolute;left:60px;bottom:72px;font-family:'Inter Tight';font-weight:500;font-size:15px;letter-spacing:.26em;color:rgba(255,255,255,.75)">${AUTOR.toUpperCase()}</div>`,
  },
  {
    ...verde, id: 'noturno', nome: 'Noturno', grupo: 'Minimalista · azul-escuro',
    conceito: 'Degradê do azul-marinho ao quase preto e o título centralizado em serifa. A versão azul da capa mais limpa possível.',
    tit: "'Instrument Serif',serif", tipos: ['Instrument Serif', 'Inter'], papel: '#F8F9FC',
    cores: [['Breu', '#030817'], ['Marinho', '#0A1A45'], ['Cobalto', '#1E47A8'], ['Gelo', '#C9D8FF'], ['Branco', '#FFFFFF']],
    bg: 'linear-gradient(180deg,#1E47A8 0%,#0A1A45 45%,#030817 100%)', ac: '#1E47A8', lt: '#C9D8FF', dk: '#030817',
    capa: v => `<div style="position:absolute;inset:0;background:${v.bg}"></div>${grao(.12)}
      <div style="position:absolute;left:0;right:0;top:340px;text-align:center;color:#fff">
        <div style="font-family:'Instrument Serif';font-size:126px;line-height:.88;letter-spacing:-.02em">O segredo</div>
        <div style="font-family:'Instrument Serif';font-style:italic;font-size:34px;line-height:1.2;margin-top:20px;color:#C9D8FF">pra argumentar em provas discursivas</div></div>
      <div style="position:absolute;left:0;right:0;bottom:70px;text-align:center;font-family:'Instrument Serif';font-size:26px;color:#fff">${AUTOR}</div>`,
  },
  {
    ...verde, id: 'bloco', nome: 'Bloco', grupo: 'Minimalista · azul-escuro',
    conceito: 'Azul profundo em degradê diagonal e o título gigante ocupando o alto da capa, alinhado à esquerda. Só tipografia, com força.',
    tipos: ['Inter Tight', 'Inter'], papel: '#F8F9FC',
    cores: [['Abismo', '#050B24'], ['Índigo', '#12226B'], ['Royal', '#2C56D6'], ['Céu', '#A9C2FF'], ['Branco', '#FFFFFF']],
    bg: 'linear-gradient(150deg,#2C56D6 0%,#12226B 45%,#050B24 100%)', ac: '#2C56D6', lt: '#A9C2FF', dk: '#050B24',
    capa: v => `<div style="position:absolute;inset:0;background:${v.bg}"></div>${grao(.12)}
      <div style="position:absolute;left:54px;right:40px;top:90px;color:#fff">
        <div style="font-family:'Inter Tight';font-weight:900;font-size:128px;line-height:.86;letter-spacing:-.065em">O<br>segredo</div>
        <div style="font-family:'Inter Tight';font-weight:400;font-size:34px;line-height:1.15;margin-top:30px;letter-spacing:-.02em;color:#CFDCFF">pra argumentar em<br>provas discursivas</div></div>
      <div style="position:absolute;left:58px;bottom:72px;font-family:'Inter Tight';font-weight:500;font-size:18px;color:#fff">${AUTOR}</div>`,
  },
  {
    ...verde, id: 'aurora', nome: 'Aurora', grupo: 'Minimalista · azul-escuro',
    conceito: 'Azul-noite com um único brilho frio vindo de baixo, como o céu antes de amanhecer. Título centralizado, pequeno e espaçado. A mais delicada.',
    tipos: ['Inter Tight', 'Inter'], papel: '#F8F9FC',
    cores: [['Noite', '#040919'], ['Marinho', '#0C1B4D'], ['Azul', '#3366E0'], ['Bruma', '#BCD0FF'], ['Branco', '#FFFFFF']],
    bg: 'radial-gradient(90% 50% at 50% 100%,#3366E0 0%,rgba(51,102,224,0) 75%),linear-gradient(180deg,#040919 0%,#0C1B4D 100%)', ac: '#3366E0', lt: '#BCD0FF', dk: '#040919',
    capa: v => `<div style="position:absolute;inset:0;background:${v.bg}"></div>${grao(.12)}
      <div style="position:absolute;left:0;right:0;top:260px;text-align:center;color:#fff">
        <div style="font-family:'Inter Tight';font-weight:300;font-size:22px;letter-spacing:.5em;margin-right:-.5em;color:#BCD0FF">O SEGREDO</div>
        <div style="font-family:'Inter Tight';font-weight:700;font-size:58px;line-height:1.05;letter-spacing:-.035em;margin-top:26px">pra argumentar<br>em provas<br>discursivas</div></div>
      <div style="position:absolute;left:0;right:0;bottom:72px;text-align:center;font-family:'Inter Tight';font-weight:500;font-size:15px;letter-spacing:.3em;color:rgba(255,255,255,.85)">${AUTOR.toUpperCase()}</div>`,
  },
];
