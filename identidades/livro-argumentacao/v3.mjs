// Didáticas sóbrias (Índice, Faixa, Moldura), cada uma em verde e em marrom. Tipografia editorial (Cormorant
// Garamond + Inter), poucos elementos e as 4 habilidades citadas com discrição. Importado pelo gerar.mjs.
const AUTOR = 'Líbero Alves Rodrigues Filho';
export const FONTES3 = 'family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600';
const SK = ['Interpretar o enunciado', 'Achar respostas no Vade Mecum', 'Construir respostas', 'Descobrir o modelo das bancas'];

const PAL = {
  verde: { nome: 'verde', bg: 'linear-gradient(170deg,#0A2E22 0%,#0F3F2F 45%,#1B5A42 100%)', fundo: '#0A2E22', meio: '#1B5A42', claro: '#F2EFE6', ac: '#B9A36E', suave: 'rgba(242,239,230,.72)', linha: 'rgba(185,163,110,.55)', papel: '#F4F1E8', tinta: '#0F2A20',
    cores: [['Floresta', '#0A2E22'], ['Musgo', '#1B5A42'], ['Papel', '#F2EFE6'], ['Latão', '#B9A36E'], ['Grafite', '#2B2B28']] },
  marrom: { nome: 'marrom', bg: 'linear-gradient(170deg,#24150E 0%,#3A2418 45%,#6A4630 100%)', fundo: '#24150E', meio: '#6A4630', claro: '#F3EBDD', ac: '#C9A36A', suave: 'rgba(243,235,221,.72)', linha: 'rgba(201,163,106,.55)', papel: '#F6F0E4', tinta: '#2A1A12',
    cores: [['Café', '#24150E'], ['Nogueira', '#6A4630'], ['Linho', '#F3EBDD'], ['Caramelo', '#C9A36A'], ['Tabaco', '#3A2418']] },
};
const T = "font-family:'Cormorant Garamond',serif";
const S = 'font-family:Inter,sans-serif';

const base = (id, nome, conceito, p, capa) => ({
  id: `${id}-${p.nome}`, nome: `${nome} · ${p.nome}`, grupo: 'Didática sóbria', conceito,
  tit: "'Cormorant Garamond',serif", txt: 'Inter,sans-serif', tipos: ['Cormorant Garamond', 'Inter'],
  cores: p.cores, bg: p.bg, ac: p.meio, lt: p.ac, dk: p.fundo, papel: p.papel, capa: v => capa(v, p),
});

export const V3 = grao => ['verde', 'marrom'].flatMap(k => {
  const p = PAL[k];
  return [
    base('indice', 'Índice', 'Sóbria e editorial: título em serifa no alto e, embaixo, as quatro habilidades como um sumário, com números e fios finos. Parece livro de editora jurídica tradicional.', p, (v, p) => `
      <div style="position:absolute;inset:0;background:${p.bg}"></div>${grao(.12)}
      <div style="position:absolute;left:64px;right:64px;top:70px;display:flex;justify-content:space-between;${S};font-weight:600;font-size:13px;letter-spacing:.3em;color:${p.ac}"><span>OAB · CONCURSOS</span><span>PROVAS DISCURSIVAS</span></div>
      <div style="position:absolute;left:64px;right:64px;top:96px;height:1px;background:${p.linha}"></div>
      <div style="position:absolute;left:62px;right:50px;top:170px;color:${p.claro}">
        <div style="${T};font-style:italic;font-weight:500;font-size:44px;line-height:1">O</div>
        <div style="${T};font-weight:600;font-size:118px;line-height:.86;letter-spacing:-.01em">segredo</div>
        <div style="${T};font-weight:500;font-size:40px;line-height:1.12;margin-top:20px">pra argumentar em<br>provas discursivas</div></div>
      <div style="position:absolute;left:64px;right:64px;top:560px">
        <div style="${S};font-weight:600;font-size:12px;letter-spacing:.3em;color:${p.ac};margin-bottom:14px">NESTE LIVRO</div>
        ${SK.map((t, i) => `<div style="display:flex;align-items:baseline;gap:20px;padding:12px 0;border-top:1px solid ${p.linha}"><span style="${T};font-weight:600;font-size:24px;color:${p.ac};width:30px">${String(i + 1).padStart(2, '0')}</span><span style="${S};font-weight:500;font-size:18px;color:${p.claro}">${t}</span></div>`).join('')}
        <div style="height:1px;background:${p.linha}"></div></div>
      <div style="position:absolute;left:64px;right:64px;bottom:62px;${S};font-weight:600;font-size:14px;letter-spacing:.26em;color:${p.claro}">${AUTOR.toUpperCase()}</div>`),
    base('faixa', 'Faixa', 'O formato clássico de livro didático: o degradê em cima com o título e uma faixa de papel embaixo com as quatro habilidades em duas colunas. Claro, organizado e sem excessos.', p, (v, p) => `
      <div style="position:absolute;inset:0;background:${p.bg}"></div>${grao(.12)}
      <div style="position:absolute;left:0;right:0;bottom:0;height:300px;background:${p.papel}"></div>
      <div style="position:absolute;left:0;right:0;bottom:300px;height:6px;background:${p.ac}"></div>
      <div style="position:absolute;left:64px;top:72px;${S};font-weight:600;font-size:13px;letter-spacing:.3em;color:${p.ac}">OAB · CONCURSOS</div>
      <div style="position:absolute;left:62px;right:50px;top:150px;color:${p.claro}">
        <div style="${T};font-weight:600;font-size:100px;line-height:.9;letter-spacing:-.01em">O segredo</div>
        <div style="${T};font-style:italic;font-weight:500;font-size:42px;line-height:1.1;margin-top:18px">pra argumentar em<br>provas discursivas</div>
        <div style="width:70px;height:2px;background:${p.ac};margin-top:34px"></div>
        <div style="${S};font-weight:500;font-size:17px;margin-top:22px;color:${p.suave}">${AUTOR}</div></div>
      <div style="position:absolute;left:64px;right:64px;bottom:58px;height:200px;display:grid;grid-template-columns:1fr 1fr;gap:22px 34px;align-content:center">
        ${SK.map((t, i) => `<div style="display:flex;gap:14px;align-items:flex-start"><span style="${T};font-weight:700;font-size:30px;line-height:.9;color:${p.meio}">${i + 1}</span><span style="${S};font-weight:600;font-size:16px;line-height:1.3;color:${p.tinta}">${t}</span></div>`).join('')}</div>
      <div style="position:absolute;left:64px;right:64px;bottom:262px;${S};font-weight:600;font-size:11px;letter-spacing:.3em;color:${p.meio}">VOCÊ VAI APRENDER A</div>`),
    base('moldura', 'Moldura', 'A mais contida: degradê profundo com um fio fino de moldura, tudo centralizado, título em serifa e as habilidades numa única linha de versalete. Elegante e atemporal.', p, (v, p) => `
      <div style="position:absolute;inset:0;background:${p.bg}"></div>${grao(.12)}
      <div style="position:absolute;inset:34px;border:1px solid ${p.linha}"></div><div style="position:absolute;inset:42px;border:1px solid ${p.linha};opacity:.5"></div>
      <div style="position:absolute;left:0;right:0;top:110px;text-align:center;${S};font-weight:600;font-size:13px;letter-spacing:.34em;color:${p.ac}">OAB · CONCURSOS</div>
      <div style="position:absolute;left:60px;right:60px;top:250px;text-align:center;color:${p.claro}">
        <div style="${T};font-style:italic;font-weight:500;font-size:46px;line-height:1">O</div>
        <div style="${T};font-weight:600;font-size:122px;line-height:.86;letter-spacing:-.01em">segredo</div>
        <div style="display:flex;align-items:center;justify-content:center;gap:16px;margin:28px 0 22px"><span style="width:60px;height:1px;background:${p.ac}"></span><span style="width:7px;height:7px;transform:rotate(45deg);background:${p.ac}"></span><span style="width:60px;height:1px;background:${p.ac}"></span></div>
        <div style="${T};font-weight:500;font-size:38px;line-height:1.15">pra argumentar em<br>provas discursivas</div>
        <div style="${S};font-weight:500;font-size:13.5px;letter-spacing:.2em;line-height:2;margin-top:50px;color:${p.suave}">INTERPRETAR O ENUNCIADO · ACHAR NO VADE MECUM<br>CONSTRUIR A RESPOSTA · O MODELO DAS BANCAS</div></div>
      <div style="position:absolute;left:0;right:0;bottom:92px;text-align:center;${T};font-weight:600;font-size:26px;color:${p.claro}">${AUTOR}</div>`),
  ];
});
