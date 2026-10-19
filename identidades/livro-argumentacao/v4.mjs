// Novas direções em verde (Tese, Balão, Camadas) e em degradê de azul-escuro (Constelação, Horizonte, Prisma).
// Importado pelo gerar.mjs.
const AUTOR = 'Líbero Alves Rodrigues Filho';
const W = 640, H = 920;
export const FONTES4 = 'family=Space+Grotesk:wght@500;700&family=Playfair+Display:ital,wght@0,700;0,900;1,700';

const rodapeAutor = (cor, fonte = 'Inter', px = 17, ls = '.26em') => `<div style="position:absolute;left:0;right:0;bottom:64px;text-align:center;font-family:${fonte};font-weight:600;font-size:${px}px;letter-spacing:${ls};color:${cor}">${AUTOR.toUpperCase()}</div>`;

export const V4 = grao => [
  // ---------- VERDES ----------
  {
    id: 'tese', nome: 'Tese', grupo: 'Verde',
    conceito: 'Argumentar é sustentar uma tese. Uma aspa gigante em dourado abre a capa, como se o livro começasse citando a sua melhor resposta. Verde floresta profundo, serifa clássica e muito respiro.',
    tit: "'Playfair Display',serif", txt: 'Inter,sans-serif', tipos: ['Playfair Display', 'Inter'],
    cores: [['Floresta', '#062A1E'], ['Pinho', '#0F4A34'], ['Sálvia', '#7FB89A'], ['Ouro', '#D9B566'], ['Marfim', '#F6F1E6']],
    bg: 'radial-gradient(90% 60% at 80% 10%,#145C41 0%,rgba(20,92,65,0) 70%),linear-gradient(180deg,#0B3D2B 0%,#062A1E 100%)',
    ac: '#0F4A34', lt: '#D9B566', dk: '#062A1E', papel: '#FBF8F1',
    capa: v => `<div style="position:absolute;inset:0;background:${v.bg}"></div>${grao(.18)}
      <div style="position:absolute;left:56px;top:40px;font-family:'Playfair Display';font-weight:900;font-size:440px;line-height:1;color:#D9B566;opacity:.95">“</div>
      <div style="position:absolute;left:62px;top:84px;font-family:Inter;font-weight:600;font-size:13px;letter-spacing:.36em;color:#D9B566;transform:translateX(330px)">OAB · CONCURSOS</div>
      <div style="position:absolute;left:62px;right:56px;top:390px;color:#F6F1E6">
        <div style="font-family:'Playfair Display';font-weight:900;font-size:98px;line-height:.9;letter-spacing:-.02em">O segredo</div>
        <div style="font-family:'Playfair Display';font-style:italic;font-weight:700;font-size:44px;line-height:1.1;margin-top:18px;color:#7FB89A">pra argumentar em<br>provas discursivas</div>
        <div style="width:80px;height:2px;background:#D9B566;margin-top:40px"></div></div>
      <div style="position:absolute;left:62px;bottom:64px;font-family:Inter;font-weight:600;font-size:16px;letter-spacing:.24em;color:#F6F1E6">${AUTOR.toUpperCase()}</div>`,
  },
  {
    id: 'balao', nome: 'Balão', grupo: 'Verde',
    conceito: 'Argumentação é diálogo com quem corrige. O título fica dentro de um grande balão de fala desenhado em linha, sobre um degradê verde vivo que vai do musgo ao lima. Moderno, jovem e direto.',
    tit: "'Space Grotesk',sans-serif", txt: 'Inter,sans-serif', tipos: ['Space Grotesk', 'Inter'],
    cores: [['Musgo', '#0B3B2A'], ['Esmeralda', '#0E7A52'], ['Menta', '#3DDC97'], ['Lima', '#C8F560'], ['Branco', '#FFFFFF']],
    bg: 'linear-gradient(160deg,#0B3B2A 0%,#0E7A52 55%,#3DDC97 100%)',
    ac: '#0E7A52', lt: '#C8F560', dk: '#0B3B2A', papel: '#FFFFFF',
    capa: v => `<div style="position:absolute;inset:0;background:${v.bg}"></div>${grao(.16)}
      <div style="position:absolute;right:-120px;bottom:-140px;width:520px;height:520px;border-radius:50%;background:radial-gradient(circle,rgba(200,245,96,.55),rgba(200,245,96,0) 65%)"></div>
      <div style="position:absolute;left:52px;top:62px;font-family:'Space Grotesk';font-weight:700;font-size:15px;letter-spacing:.3em;color:#C8F560">OAB · CONCURSOS</div>
      <svg viewBox="0 0 540 470" style="position:absolute;left:46px;top:150px;width:548px"><path d="M40 10 H500 a30 30 0 0 1 30 30 V340 a30 30 0 0 1 -30 30 H170 L80 450 L100 370 H40 a30 30 0 0 1 -30 -30 V40 a30 30 0 0 1 30 -30Z" fill="rgba(255,255,255,.06)" stroke="#fff" stroke-width="3"/></svg>
      <div style="position:absolute;left:96px;right:80px;top:210px;color:#fff">
        <div style="font-family:'Space Grotesk';font-weight:700;font-size:100px;line-height:.9;letter-spacing:-.045em">O segredo</div>
        <div style="font-family:'Space Grotesk';font-weight:500;font-size:38px;line-height:1.12;margin-top:22px;letter-spacing:-.02em">pra argumentar em <span style="background:#C8F560;color:#0B3B2A;padding:0 8px">provas discursivas</span></div></div>
      <div style="position:absolute;left:52px;bottom:64px;font-family:'Space Grotesk';font-weight:700;font-size:20px;color:#fff">${AUTOR}</div>`,
  },
  {
    id: 'camadas', nome: 'Camadas', grupo: 'Verde',
    conceito: 'Um bom argumento se constrói em camadas: fato, norma, aplicação e conclusão. Quatro lâminas de verde se sobrepõem na diagonal, do mais escuro ao mais claro, e o título fica firme no topo. Sóbrio, arquitetônico.',
    tit: 'Archivo,sans-serif', txt: 'Inter,sans-serif', tipos: ['Archivo (condensada)', 'Inter'],
    cores: [['Abismo', '#04201A'], ['Pinheiro', '#0B3F30'], ['Jade', '#167A5B'], ['Broto', '#5CC08F'], ['Névoa', '#E7F4EC']],
    bg: 'linear-gradient(180deg,#0B3F30 0%,#04201A 100%)',
    ac: '#167A5B', lt: '#5CC08F', dk: '#04201A', papel: '#FAFBF8',
    capa: v => `<div style="position:absolute;inset:0;background:${v.bg}"></div>
      ${[['#0B3F30', 0], ['#0F5A43', 1], ['#167A5B', 2], ['#5CC08F', 3]].map(([c, i]) => `<div style="position:absolute;left:-120px;right:-120px;top:${560 + i * 70}px;height:420px;background:${c};transform:rotate(-12deg);box-shadow:0 -10px 30px rgba(0,0,0,.25)"></div>`).join('')}${grao(.16)}
      ${['FATO', 'NORMA', 'APLICAÇÃO', 'CONCLUSÃO'].map((t, i) => `<div style="position:absolute;right:58px;top:${612 + i * 62}px;font-family:Archivo;font-stretch:80%;font-weight:700;font-size:15px;letter-spacing:.3em;color:${i === 3 ? '#04201A' : 'rgba(231,244,236,.8)'};transform:rotate(-12deg)">${String(i + 1).padStart(2, '0')} ${t}</div>`).join('')}
      <div style="position:absolute;left:54px;top:62px;font-family:Inter;font-weight:600;font-size:13px;letter-spacing:.34em;color:#5CC08F">OAB · CONCURSOS</div>
      <div style="position:absolute;left:50px;right:40px;top:120px;color:#E7F4EC">
        <div style="font-family:Archivo;font-stretch:72%;font-weight:900;font-size:136px;line-height:.84;text-transform:uppercase;letter-spacing:-.01em">O segredo</div>
        <div style="font-family:Archivo;font-stretch:85%;font-weight:600;font-size:36px;line-height:1.08;margin-top:18px;color:#5CC08F;text-transform:uppercase">pra argumentar em<br>provas discursivas</div>
        <div style="font-family:Inter;font-weight:600;font-size:15px;letter-spacing:.22em;margin-top:30px;opacity:.85">${AUTOR.toUpperCase()}</div></div>`,
  },
  // ---------- AZUL-ESCURO ----------
  {
    id: 'constelacao', nome: 'Constelação', grupo: 'Azul-escuro',
    conceito: 'Argumentar é ligar pontos: o fato, a norma e a conclusão viram estrelas unidas por uma linha, sobre um céu que vai do azul-marinho ao quase preto. Título em serifa elegante, clima de descoberta.',
    tit: "'Instrument Serif',serif", txt: 'Inter,sans-serif', tipos: ['Instrument Serif', 'Inter'],
    cores: [['Abismo', '#040B1F'], ['Marinho', '#0B1E4A'], ['Cobalto', '#1F4FB8'], ['Gelo', '#BFD3FF'], ['Estrela', '#F4D88A']],
    bg: 'radial-gradient(80% 55% at 70% 20%,#1F4FB8 0%,rgba(31,79,184,0) 70%),linear-gradient(180deg,#0B1E4A 0%,#040B1F 100%)',
    ac: '#1F4FB8', lt: '#F4D88A', dk: '#040B1F', papel: '#F8F9FC',
    capa: v => {
      const pts = [[120, 250], [250, 160], [400, 230], [520, 130]];
      const est = Array.from({ length: 60 }, (_, i) => [(i * 137) % W, (i * 89) % 520, (i % 3) + 1]);
      return `<div style="position:absolute;inset:0;background:${v.bg}"></div>${grao(.14)}
      <svg viewBox="0 0 ${W} ${H}" style="position:absolute;inset:0;width:100%;height:100%">${est.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r * .7}" fill="#BFD3FF" opacity="${.2 + r * .15}"/>`).join('')}
        <polyline points="${pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="#F4D88A" stroke-width="1.6" stroke-dasharray="4 6"/>
        ${pts.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i === 3 ? 9 : 6}" fill="#F4D88A"/><circle cx="${x}" cy="${y}" r="${i === 3 ? 22 : 15}" fill="none" stroke="#F4D88A" stroke-opacity=".4"/>`).join('')}</svg>
      <div style="position:absolute;left:0;right:0;top:62px;text-align:center;font-family:Inter;font-weight:600;font-size:13px;letter-spacing:.4em;color:#BFD3FF">OAB · CONCURSOS</div>
      <div style="position:absolute;left:0;right:0;top:400px;text-align:center;color:#fff">
        <div style="font-family:'Instrument Serif';font-style:italic;font-size:48px;line-height:1;color:#BFD3FF">O</div>
        <div style="font-family:'Instrument Serif';font-size:150px;line-height:.85;letter-spacing:-.02em">segredo</div>
        <div style="font-family:Inter;font-weight:500;font-size:18px;letter-spacing:.3em;margin-top:30px;line-height:1.75;color:#DCE6FF">PRA ARGUMENTAR EM<br>PROVAS DISCURSIVAS</div></div>
      <div style="position:absolute;left:0;right:0;bottom:64px;text-align:center;font-family:'Instrument Serif';font-size:28px;color:#fff">${AUTOR}</div>`;
    },
  },
  {
    id: 'horizonte', nome: 'Horizonte', grupo: 'Azul-escuro',
    conceito: 'A aprovação no horizonte: um grande círculo de luz nasce na base da capa, num degradê do azul profundo ao cobalto. Título enorme em grotesca, alinhado à esquerda. Minimalista e otimista.',
    tit: 'Manrope,sans-serif', txt: 'Inter,sans-serif', tipos: ['Manrope', 'Inter'],
    cores: [['Noite', '#050A1C'], ['Índigo', '#13235C'], ['Royal', '#2F5BEA'], ['Céu', '#8FB4FF'], ['Aurora', '#FFE3A3']],
    bg: 'linear-gradient(180deg,#050A1C 0%,#13235C 55%,#2F5BEA 100%)',
    ac: '#2F5BEA', lt: '#FFE3A3', dk: '#050A1C', papel: '#F7F8FC',
    capa: v => `<div style="position:absolute;inset:0;background:${v.bg}"></div>
      <div style="position:absolute;left:50%;bottom:-430px;width:860px;height:860px;margin-left:-430px;border-radius:50%;background:radial-gradient(circle at 50% 30%,#FFE3A3 0%,#8FB4FF 28%,rgba(47,91,234,.0) 62%)"></div>
      <div style="position:absolute;left:50%;bottom:-430px;width:860px;height:860px;margin-left:-430px;border-radius:50%;border:1.5px solid rgba(255,227,163,.55)"></div>
      <div style="position:absolute;left:50%;bottom:-330px;width:660px;height:660px;margin-left:-330px;border-radius:50%;border:1px solid rgba(255,227,163,.3)"></div>${grao(.16)}
      <div style="position:absolute;left:54px;top:62px;font-family:Manrope;font-weight:700;font-size:14px;letter-spacing:.32em;color:#8FB4FF">OAB · CONCURSOS</div>
      <div style="position:absolute;left:50px;right:40px;top:150px;color:#fff">
        <div style="font-family:Manrope;font-weight:800;font-size:112px;line-height:.88;letter-spacing:-.06em">O segredo</div>
        <div style="font-family:Manrope;font-weight:500;font-size:40px;line-height:1.1;margin-top:20px;letter-spacing:-.03em;color:#CFE0FF">pra argumentar em<br>provas discursivas</div></div>
      ${rodapeAutor('#050A1C', 'Manrope', 16, '.24em')}`,
  },
  {
    id: 'prisma', nome: 'Prisma', grupo: 'Azul-escuro',
    conceito: 'O livro decompõe a resposta como um prisma decompõe a luz: um feixe entra, atravessa o triângulo e sai em quatro faixas, as quatro habilidades. Azul-escuro intenso com brilho frio. Técnico e marcante.',
    tit: "'Space Grotesk',sans-serif", txt: 'Inter,sans-serif', tipos: ['Space Grotesk', 'Inter'],
    cores: [['Grafite azul', '#070D24'], ['Safira', '#0F2A6B'], ['Elétrico', '#3B82F6'], ['Ciano', '#67E8F9'], ['Branco', '#FFFFFF']],
    bg: 'radial-gradient(70% 50% at 50% 45%,#0F2A6B 0%,rgba(15,42,107,0) 75%),linear-gradient(180deg,#0B1636 0%,#070D24 100%)',
    ac: '#3B82F6', lt: '#67E8F9', dk: '#070D24', papel: '#F7F9FD',
    capa: v => {
      const fx = ['#67E8F9', '#3B82F6', '#818CF8', '#FFFFFF'];
      const nomes = ['INTERPRETAR', 'VADE MECUM', 'CONSTRUIR', 'MODELO DA BANCA'];
      return `<div style="position:absolute;inset:0;background:${v.bg}"></div>${grao(.14)}
      <svg viewBox="0 0 ${W} ${H}" style="position:absolute;inset:0;width:100%;height:100%"><defs><linearGradient id="pz" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".25"/><stop offset="1" stop-color="#67E8F9" stop-opacity=".08"/></linearGradient></defs>
        <line x1="0" y1="560" x2="250" y2="520" stroke="#fff" stroke-width="3" opacity=".9"/>
        ${fx.map((c, i) => `<line x1="330" y1="${522 + i * 4}" x2="${W}" y2="${450 + i * 48}" stroke="${c}" stroke-width="3" opacity=".9"/>`).join('')}
        <path d="M290 410 L370 560 L210 560 Z" fill="url(#pz)" stroke="#fff" stroke-opacity=".8" stroke-width="2"/></svg>
      ${nomes.map((t, i) => `<div style="position:absolute;right:30px;top:${430 + i * 49}px;font-family:'Space Grotesk';font-weight:700;font-size:11px;letter-spacing:.24em;color:${fx[i]}">${t}</div>`).join('')}
      <div style="position:absolute;left:54px;top:62px;font-family:'Space Grotesk';font-weight:700;font-size:14px;letter-spacing:.32em;color:#67E8F9">OAB · CONCURSOS</div>
      <div style="position:absolute;left:52px;right:40px;top:120px;color:#fff">
        <div style="font-family:'Space Grotesk';font-weight:700;font-size:104px;line-height:.88;letter-spacing:-.05em">O segredo</div>
        <div style="font-family:'Space Grotesk';font-weight:500;font-size:34px;line-height:1.12;margin-top:20px;color:#BFD3FF">pra argumentar em<br>provas discursivas</div></div>
      <div style="position:absolute;left:54px;bottom:64px;font-family:'Space Grotesk';font-weight:700;font-size:19px;color:#fff">${AUTOR}</div>`;
    },
  },
];
