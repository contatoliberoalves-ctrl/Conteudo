// Direções gamificadas (Fases, Conquistas, Arcade) e didáticas (Passo a passo, Mapa, Vade Mecum) do livro.
// Várias citam as 4 habilidades do livro. Importado pelo gerar.mjs.
const AUTOR = 'Líbero Alves Rodrigues Filho';
export const FONTES2 = 'family=Bungee&family=Rubik:wght@500;700;800;900&family=Press+Start+2P&family=Silkscreen:wght@400;700&family=Instrument+Serif:ital@0;1&family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,800;1,9..144,600';

export const SK = [
  ['lupa', 'Interpretar o enunciado', 'Aprenda a interpretar o enunciado'],
  ['livro', 'Achar respostas no Vade Mecum', 'Ache as respostas no Vade Mecum'],
  ['lapis', 'Construir respostas', 'Construa respostas que pontuam'],
  ['alvo', 'Descobrir o modelo das bancas', 'Descubra o modelo das bancas'],
];
const IC = {
  lupa: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/>',
  livro: '<path d="M3.5 5h6a2.5 2.5 0 0 1 2.5 2.5V20a2 2 0 0 0-2-2H3.5z"/><path d="M20.5 5h-6A2.5 2.5 0 0 0 12 7.5V20a2 2 0 0 1 2-2h6.5z"/>',
  lapis: '<path d="M4 20l1.2-4.4L16 4.8l3.2 3.2L8.4 18.8z"/><path d="M14 6.8l3.2 3.2"/><path d="M4 20h7"/>',
  alvo: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
  trofeu: '<path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4v1.5A3.5 3.5 0 0 0 7.5 11M17 6h3v1.5A3.5 3.5 0 0 1 16.5 11"/><path d="M12 14v4M8 21h8M9.5 18h5"/>',
};
export const ic = (n, px, cor, w = 2) => `<svg viewBox="0 0 24 24" width="${px}" height="${px}" fill="none" stroke="${cor}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" style="display:block;flex:none;color:${cor}">${IC[n]}</svg>`;

export const V2 = (grao) => [
  // ---------- GAMIFICADAS ----------
  {
    id: 'fases', nome: 'Fases', grupo: 'Gamificada',
    conceito: 'O livro como um jogo de fases: cada habilidade é uma fase do mapa, com estrelas e barra de XP, até chegar no troféu da prova. Divertido sem perder a seriedade.',
    tit: 'Bungee,sans-serif', txt: 'Rubik,sans-serif', tipos: ['Bungee', 'Rubik'],
    cores: [['Mata', '#08331F'], ['Folha', '#11734A'], ['Lima', '#39C46F'], ['Estrela', '#FFD54A'], ['Branco', '#FFFFFF']],
    bg: 'linear-gradient(180deg,#08331F 0%,#0D5537 40%,#11734A 65%,#39C46F 100%)',
    ac: '#11734A', lt: '#FFD54A', dk: '#08331F', papel: '#FFFFFF',
    capa: v => {
      const N = [[120, 840], [360, 760], [150, 645], [400, 560]];
      const lado = [1, -1, 1, -1];
      return `<div style="position:absolute;inset:0;background:${v.bg}"></div>${grao(.14)}
      <div style="position:absolute;left:52px;right:52px;top:52px;display:flex;align-items:center;gap:14px;font-family:Rubik;font-weight:800;font-size:15px;color:#fff">
        <span style="background:#FFD54A;color:#08331F;border-radius:8px;padding:6px 12px">NÍVEL 1</span>
        <div style="flex:1;height:16px;border-radius:8px;background:rgba(255,255,255,.18);overflow:hidden"><div style="width:35%;height:100%;background:linear-gradient(90deg,#39C46F,#C8F57A)"></div></div><span>XP</span></div>
      <div style="position:absolute;left:52px;right:40px;top:112px;color:#fff">
        <div style="font-family:Bungee;font-size:96px;line-height:.92;text-shadow:0 7px 0 #04200F">O SEGREDO</div>
        <div style="font-family:Rubik;font-weight:800;font-size:30px;line-height:1.12;margin-top:18px">pra argumentar em<br>provas discursivas</div>
        <div style="font-family:Rubik;font-weight:600;font-size:16px;margin-top:14px;opacity:.85">OAB e Concursos · ${AUTOR}</div></div>
      <svg viewBox="0 0 640 920" style="position:absolute;inset:0"><path d="M120 840 C 250 840, 330 800, 360 760 S 170 700, 150 645 S 320 580, 400 560 S 520 500, 540 470" fill="none" stroke="#fff" stroke-width="7" stroke-dasharray="3 16" stroke-linecap="round" opacity=".8"/></svg>
      ${N.map(([x, y], i) => `<div style="position:absolute;left:${x - 40}px;top:${y - 40}px;width:80px;height:80px;border-radius:50%;background:#fff;box-shadow:0 7px 0 #04200F;display:flex;align-items:center;justify-content:center">${ic(SK[i][0], 40, '#11734A', 2.4)}</div>
        <div style="position:absolute;left:${x - 34}px;top:${y - 70}px;font-size:22px;color:#FFD54A;letter-spacing:2px">${'★'.repeat(3 - (i > 1 ? 1 : 0))}${i > 1 ? '<span style="opacity:.35">★</span>' : ''}</div>
        <div style="position:absolute;${lado[i] > 0 ? `left:${x + 50}px` : `right:${640 - x + 50}px;text-align:right`};top:${y - 30}px;width:200px;font-family:Rubik;color:#fff;background:rgba(4,32,15,.62);border-radius:12px;padding:7px 11px"><div style="font-weight:900;font-size:13px;letter-spacing:.14em;color:#FFD54A">FASE ${i + 1}</div><div style="font-weight:700;font-size:18px;line-height:1.15">${SK[i][1]}</div></div>`).join('')}
      <div style="position:absolute;left:496px;top:404px;width:92px;height:92px;border-radius:24px;background:#FFD54A;box-shadow:0 7px 0 #8A6A00;display:flex;align-items:center;justify-content:center;transform:rotate(-6deg)">${ic('trofeu', 54, '#08331F', 2.2)}</div>
      <div style="position:absolute;left:470px;top:506px;width:150px;text-align:center;font-family:Rubik;font-weight:900;font-size:14px;letter-spacing:.14em;color:#fff">PROVA</div>`;
    },
  },
  {
    id: 'conquistas', nome: 'Conquistas', grupo: 'Gamificada',
    conceito: 'Como as conquistas de videogame: a notificação "conquista desbloqueada" no topo e quatro medalhas, uma para cada habilidade. Dá vontade de "zerar" o livro.',
    tit: 'Rubik,sans-serif', txt: 'Rubik,sans-serif', tipos: ['Rubik Black', 'Rubik'],
    cores: [['Breu', '#04261A'], ['Floresta', '#0F6B45'], ['Neon', '#2FCB7A'], ['Ouro', '#FFCB45'], ['Gelo', '#E9FFF2']],
    bg: 'radial-gradient(90% 60% at 50% 30%,#2FCB7A 0%,#16955C 30%,#0F6B45 55%,#04261A 100%)',
    ac: '#16955C', lt: '#FFCB45', dk: '#04261A', papel: '#FFFFFF',
    capa: v => {
      const hex = 'polygon(25% 3%,75% 3%,100% 50%,75% 97%,25% 97%,0 50%)';
      return `<div style="position:absolute;inset:0;background:${v.bg}"></div>${grao(.16)}
      <div style="position:absolute;left:60px;right:60px;top:56px;display:flex;align-items:center;gap:18px;background:rgba(4,38,26,.78);border:1px solid rgba(255,255,255,.18);border-radius:60px;padding:14px 24px 14px 14px;box-shadow:0 12px 30px rgba(0,0,0,.3)">
        <span style="width:58px;height:58px;border-radius:50%;background:linear-gradient(135deg,#FFE18A,#FFB020);display:flex;align-items:center;justify-content:center">${ic('trofeu', 32, '#04261A', 2.2)}</span>
        <div style="font-family:Rubik;color:#fff"><div style="font-weight:800;font-size:13px;letter-spacing:.16em;color:#FFCB45">CONQUISTA DESBLOQUEADA</div><div style="font-weight:700;font-size:20px;margin-top:2px">Argumentação nível máximo</div></div></div>
      <div style="position:absolute;left:0;right:0;top:190px;text-align:center;color:#fff;font-family:Rubik">
        <div style="font-weight:900;font-size:112px;line-height:.9;letter-spacing:-.035em;text-shadow:0 8px 30px rgba(0,0,0,.25)">O segredo</div>
        <div style="font-weight:700;font-size:31px;line-height:1.12;margin-top:16px">pra argumentar em provas discursivas</div>
        <div style="display:inline-block;margin-top:18px;font-weight:800;font-size:15px;letter-spacing:.16em;background:#E9FFF2;color:#04261A;border-radius:999px;padding:7px 18px">OAB · CONCURSOS</div></div>
      <div style="position:absolute;left:48px;right:48px;top:500px;display:grid;grid-template-columns:1fr 1fr;gap:34px 26px">${SK.map(([n, t]) => `<div style="display:flex;align-items:center;gap:16px">
        <div style="flex:none;width:104px;height:96px;clip-path:${hex};background:linear-gradient(135deg,#FFE18A,#FFB020);display:flex;align-items:center;justify-content:center"><div style="width:90px;height:82px;clip-path:${hex};background:#04261A;display:flex;align-items:center;justify-content:center">${ic(n, 40, '#FFCB45', 2.2)}</div></div>
        <div style="font-family:Rubik;font-weight:700;font-size:19px;line-height:1.18;color:#fff">${t}<div style="font-weight:800;font-size:12px;letter-spacing:.14em;color:#B9FFD6;margin-top:4px">✓ DESBLOQUEADO</div></div></div>`).join('')}</div>
      <div style="position:absolute;left:0;right:0;bottom:62px;text-align:center;font-family:Rubik;font-weight:700;font-size:19px;color:#fff">${AUTOR}</div>`;
    },
  },
  {
    id: 'arcade', nome: 'Arcade', grupo: 'Gamificada',
    conceito: 'Fliperama 8 bits: placar, barra de vida do argumento, chave em pixel art e o "PRESS START". Nostálgico e muito chamativo no feed, perfeito para divulgação.',
    tit: "Silkscreen,monospace", txt: 'Rubik,sans-serif', tipos: ['Silkscreen · Press Start 2P', 'Rubik'],
    cores: [['Tela', '#031A11'], ['Fósforo', '#0B5E3B'], ['Pixel', '#3BD67C'], ['Neon', '#C8FF6A'], ['Moeda', '#FFD54A']],
    bg: 'linear-gradient(180deg,#031A11 0%,#063A25 40%,#0B5E3B 70%,#3BD67C 100%)',
    ac: '#0B5E3B', lt: '#C8FF6A', dk: '#031A11', papel: '#FFFFFF',
    capa: v => {
      const K = ['...XXXX..........', '..X....X.........', '.X......XXXXXXXXX', '.X......XXXXXXXXX', '..X....X......X.X', '...XXXX.......X.X'];
      const px = 18;
      return `<div style="position:absolute;inset:0;background:${v.bg}"></div>
      <div style="position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(0,0,0,.2) 0 2px,transparent 2px 5px)"></div>
      <div style="position:absolute;left:44px;right:44px;top:46px;display:flex;justify-content:space-between;font-family:'Press Start 2P';font-size:13px;line-height:1.8;color:#C8FF6A"><span>1P<br><span style="color:#fff">000000</span></span><span style="text-align:center">MODO<br><span style="color:#fff">OAB/CONCURSO</span></span><span style="text-align:right">HI<br><span style="color:#fff">100000</span></span></div>
      <div style="position:absolute;left:0;right:0;top:170px;display:flex;flex-direction:column;align-items:center">${K.map(l => `<div style="display:flex">${[...l].map(c => `<span style="width:${px}px;height:${px}px;background:${c === 'X' ? '#FFD54A' : 'transparent'};box-shadow:${c === 'X' ? 'inset -4px -4px 0 #C99A00' : 'none'}"></span>`).join('')}</div>`).join('')}</div>
      <div style="position:absolute;left:40px;right:40px;top:322px;text-align:center;color:#fff">
        <div style="font-family:Silkscreen;font-weight:700;font-size:92px;line-height:.95;text-shadow:6px 6px 0 #031A11,0 0 30px rgba(200,255,106,.35)">O SEGREDO</div>
        <div style="font-family:'Press Start 2P';font-size:17px;line-height:1.9;margin-top:26px;color:#C8FF6A">PRA ARGUMENTAR EM<br>PROVAS DISCURSIVAS</div></div>
      <div style="position:absolute;left:70px;right:70px;top:600px;font-family:'Press Start 2P';font-size:12px;color:#fff">ARGUMENTO
        <div style="display:flex;gap:6px;margin-top:12px">${Array.from({ length: 10 }, (_, i) => `<span style="flex:1;height:26px;background:${i < 8 ? '#C8FF6A' : 'rgba(255,255,255,.15)'};box-shadow:inset -3px -3px 0 rgba(0,0,0,.25)"></span>`).join('')}</div></div>
      <div style="position:absolute;left:0;right:0;top:720px;text-align:center;font-family:'Press Start 2P';font-size:22px;color:#031A11">▶ PRESS START</div>
      <div style="position:absolute;left:0;right:0;bottom:56px;text-align:center;font-family:'Press Start 2P';font-size:11px;line-height:1.9;color:#031A11">PLAYER 1<br>LÍBERO ALVES RODRIGUES FILHO</div>`;
    },
  },
  // ---------- DIDÁTICAS ----------
  {
    id: 'passo', nome: 'Passo a passo', grupo: 'Didática',
    conceito: 'Clara como um bom índice: o título e, logo abaixo, as quatro coisas que o leitor vai aprender, numeradas em cartões. Quem pega o livro sabe exatamente o que leva.',
    tit: 'Manrope,sans-serif', txt: 'Manrope,sans-serif', tipos: ['Manrope · Instrument Serif', 'Manrope'],
    cores: [['Pinho', '#0B4730'], ['Verde', '#1C8D5A'], ['Hortelã', '#7FD3A0'], ['Menta', '#E6F6EC'], ['Branco', '#FFFFFF']],
    bg: 'linear-gradient(160deg,#0B4730 0%,#13704A 40%,#1C8D5A 65%,#7FD3A0 100%)',
    ac: '#1C8D5A', lt: '#7FD3A0', dk: '#0B4730', papel: '#FFFFFF',
    capa: v => `<div style="position:absolute;inset:0;background:${v.bg}"></div>${grao(.14)}
      <div style="position:absolute;left:56px;top:58px;font-family:Manrope;font-weight:800;font-size:15px;letter-spacing:.2em;color:#B9F0CF">OAB · CONCURSOS</div>
      <div style="position:absolute;left:54px;right:50px;top:102px;color:#fff;font-family:Manrope;font-weight:800;font-size:58px;line-height:1.02;letter-spacing:-.03em">O <span style="font-family:'Instrument Serif';font-style:italic;font-weight:400;font-size:80px;letter-spacing:-.01em;color:#C8F5D8">segredo</span> pra argumentar em provas discursivas</div>
      <div style="position:absolute;left:56px;top:378px;font-family:Manrope;font-weight:800;font-size:15px;letter-spacing:.2em;color:#fff;opacity:.9">VOCÊ VAI APRENDER A</div>
      <div style="position:absolute;left:50px;right:50px;top:412px;display:flex;flex-direction:column;gap:14px">${SK.map(([n, , t], i) => `<div style="display:flex;align-items:center;gap:18px;background:#fff;border-radius:20px;padding:16px 20px;box-shadow:0 10px 24px rgba(0,0,0,.18)">
        <span style="flex:none;width:48px;height:48px;border-radius:50%;background:#0B4730;color:#fff;font-family:Manrope;font-weight:800;font-size:22px;display:flex;align-items:center;justify-content:center">${i + 1}</span>
        <span style="flex:1;font-family:Manrope;font-weight:700;font-size:22px;line-height:1.2;color:#0B2E20">${t}</span>${ic(n, 32, '#1C8D5A', 2.2)}</div>`).join('')}</div>
      <div style="position:absolute;left:56px;right:56px;bottom:60px;font-family:Manrope;font-weight:700;font-size:20px;color:#0B2E20">${AUTOR}</div>`,
  },
  {
    id: 'mapa', nome: 'Mapa mental', grupo: 'Didática',
    conceito: 'O método em um esquema: no centro, a resposta que pontua; em volta, as quatro habilidades que levam até ela. Parece o resumo que o aluno faria no caderno, só que bonito.',
    tit: 'Fraunces,serif', txt: 'Manrope,sans-serif', tipos: ['Fraunces', 'Manrope'],
    cores: [['Menta', '#E8F6EC'], ['Folha', '#A9DDBB'], ['Verde', '#2F9A62'], ['Profundo', '#0B4A32'], ['Tinta', '#0F2A1F']],
    bg: 'linear-gradient(180deg,#E8F6EC 0%,#CBEBD6 22%,#7CC79B 46%,#2F9A62 70%,#0B4A32 100%)',
    ac: '#2F9A62', lt: '#A9DDBB', dk: '#0B4A32', papel: '#FBFDFB',
    capa: v => {
      const cx = 320, cy = 610;
      const P = [[150, 470], [490, 470], [150, 760], [490, 760]];
      return `<div style="position:absolute;inset:0;background:${v.bg}"></div>${grao(.12)}
      <div style="position:absolute;left:56px;top:58px;font-family:Manrope;font-weight:800;font-size:15px;letter-spacing:.2em;color:#2F9A62">OAB · CONCURSOS</div>
      <div style="position:absolute;left:54px;right:50px;top:96px;font-family:Fraunces;color:#0B4A32">
        <div style="font-style:italic;font-weight:600;font-size:96px;line-height:.95;letter-spacing:-.02em">O segredo</div>
        <div style="font-weight:600;font-size:40px;line-height:1.08;margin-top:10px">pra argumentar em<br>provas discursivas</div></div>
      <svg viewBox="0 0 640 920" style="position:absolute;inset:0">${P.map(([x, y]) => `<path d="M${cx} ${cy} Q ${(cx + x) / 2} ${y} ${x} ${y}" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="1 9" stroke-linecap="round"/>`).join('')}</svg>
      <div style="position:absolute;left:${cx - 92}px;top:${cy - 92}px;width:184px;height:184px;border-radius:50%;background:#fff;box-shadow:0 0 0 10px rgba(255,255,255,.25),0 16px 30px rgba(0,0,0,.2);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;font-family:Manrope;font-weight:800;font-size:19px;line-height:1.15;color:#0B4A32">${ic('trofeu', 38, '#2F9A62', 2.2)}<div style="margin-top:6px">Resposta<br>que pontua</div></div>
      ${P.map(([x, y], i) => `<div style="position:absolute;left:${x - 118}px;top:${y - 44}px;width:236px;display:flex;align-items:center;gap:12px;background:#fff;border-radius:18px;padding:12px 14px;box-shadow:0 10px 22px rgba(0,0,0,.16)">${ic(SK[i][0], 30, '#2F9A62', 2.3)}<span style="font-family:Manrope;font-weight:700;font-size:16px;line-height:1.18;color:#0F2A1F">${SK[i][1]}</span></div>`).join('')}
      <div style="position:absolute;left:0;right:0;bottom:50px;text-align:center;font-family:Manrope;font-weight:700;font-size:19px;color:#fff">${AUTOR}</div>`;
    },
  },
  {
    id: 'vade', nome: 'Vade Mecum', grupo: 'Didática',
    conceito: 'O objeto que todo aluno conhece: um Vade Mecum cheio de marcadores coloridos, cada um com uma habilidade do livro. Prático, reconhecível e com cara de material de estudo.',
    tit: 'Fraunces,serif', txt: 'Inter,sans-serif', tipos: ['Fraunces', 'Inter'],
    cores: [['Pinho', '#0B3F2C'], ['Folha', '#168452'], ['Broto', '#4CC481'], ['Papel', '#F7F3E8'], ['Post-it', '#FFE36B']],
    bg: 'linear-gradient(155deg,#0B3F2C 0%,#0F5E3D 40%,#168452 70%,#4CC481 100%)',
    ac: '#168452', lt: '#FFE36B', dk: '#0B3F2C', papel: '#FBF9F3',
    capa: v => {
      const tabs = [['#FFE36B', '#5B4A00'], ['#FF9F80', '#5E1F0C'], ['#9FE3FF', '#08394D'], ['#D7B8FF', '#3A1660']];
      return `<div style="position:absolute;inset:0;background:${v.bg}"></div>${grao(.14)}
      <div style="position:absolute;left:56px;top:58px;font-family:Inter;font-weight:700;font-size:15px;letter-spacing:.2em;color:#FFE36B">OAB · CONCURSOS</div>
      <div style="position:absolute;left:54px;right:50px;top:96px;color:#fff;font-family:Fraunces">
        <div style="font-weight:800;font-size:92px;line-height:.92;letter-spacing:-.03em">O segredo</div>
        <div style="font-weight:600;font-size:38px;line-height:1.08;margin-top:12px">pra argumentar em<br>provas discursivas</div></div>
      <div style="position:absolute;left:40px;top:405px;width:330px;height:390px;transform:rotate(-4deg)">
        <div style="position:absolute;left:18px;top:14px;width:330px;height:390px;border-radius:10px;background:repeating-linear-gradient(90deg,#F7F3E8 0 2px,#DDD6C3 2px 3px);box-shadow:0 26px 50px rgba(0,0,0,.45)"></div>
        <div style="position:absolute;inset:0;border-radius:10px 14px 14px 10px;background:linear-gradient(135deg,#123826,#0A2318);box-shadow:inset 10px 0 0 rgba(255,255,255,.06);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px">
          <div style="width:220px;height:2px;background:#D7B56D"></div><div style="font-family:Fraunces;font-weight:800;font-size:46px;color:#D7B56D;letter-spacing:.04em">VADE</div><div style="font-family:Fraunces;font-weight:800;font-size:46px;color:#D7B56D;letter-spacing:.04em;margin-top:-14px">MECUM</div><div style="width:220px;height:2px;background:#D7B56D"></div></div></div>
      ${SK.map(([n, t], i) => `<div style="position:absolute;left:340px;top:${470 + i * 88}px;width:260px;height:70px;transform:rotate(${[-3, 2, -2, 3][i]}deg);background:${tabs[i][0]};border-radius:4px 12px 12px 4px;box-shadow:0 8px 16px rgba(0,0,0,.25);display:flex;align-items:center;gap:10px;padding:0 14px;font-family:Inter;font-weight:700;font-size:16px;line-height:1.15;color:${tabs[i][1]}">${ic(n, 26, tabs[i][1], 2.3)}${t}</div>`).join('')}
      <div style="position:absolute;left:56px;right:56px;bottom:44px;font-family:Inter;font-weight:600;font-size:19px;color:#fff;text-align:right">${AUTOR}</div>`;
    },
  },
];
