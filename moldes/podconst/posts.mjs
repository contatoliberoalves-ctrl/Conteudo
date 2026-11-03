// Telas novas do PodConst, escritas em código (as do kit/ continuam como vieram).
// Mesma identidade do kit: fundo azul radial, magenta, amarelo, navy e branco; Bebas Neue + Space Grotesk;
// logo PODCONST em Unbounded; @ da dupla em etiquetas amarela e magenta.
// Cada grupo ("3a", "3b"…) é uma lista de telas 1080×1350. Fotos: <img data-foto="nome"> recebe
// fotos/<arquivo> pelo campo "fotos" do dados.json; sem arquivo, a moldura mostra o @ no lugar da foto.

const AZUL = 'radial-gradient(120% 90% at 70% 10%,#0c4bbd 0%,#0a3aa0 45%,#0a2a7c 100%)';
const AZUL2 = 'linear-gradient(180deg,#0a3aa6,#0a2c86)';
const MAG = 'radial-gradient(120% 90% at 30% 20%,#ea2ee0 0%,#d61ccf 55%,#c515c2 100%)';
const NAVY = '#0a1e56';
const AMAR = '#f7f400';
const BRANCO = '#f4f4f2';
const TINTA = '#0b1a4a';

const css = `
*{box-sizing:border-box}
body{margin:0;background:#141418;font-family:'Space Grotesk',sans-serif}
.tela{position:relative;width:1080px;height:1350px;overflow:hidden;color:#fff;margin-bottom:40px}
.bb{font-family:'Bebas Neue',sans-serif;font-weight:400}
.ab{position:absolute}
.blur{position:absolute;font-family:'Bebas Neue';line-height:1;filter:blur(13px);white-space:nowrap;pointer-events:none}
.marca{position:absolute;font-family:'Bebas Neue';line-height:1;white-space:nowrap;pointer-events:none}
.barra{width:86px;height:16px;background:${AMAR}}
.kick{display:inline-block;align-self:flex-start;background:${TINTA};color:${AMAR};font-weight:700;font-size:26px;letter-spacing:4px;padding:6px 16px}
.txt{font-weight:600;font-size:36px;line-height:1.28}
.foto{position:absolute;overflow:hidden}
.foto img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.foto img:not([src]){display:none}
.meio{position:absolute;top:140px;bottom:140px;display:flex;flex-direction:column;justify-content:center}
.vazio{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:6px}
`;

const LOGO = (px = 44, pos = 'bottom:44px;right:70px') => `<div style="position:absolute;${pos};transform:rotate(-9deg);font-family:'Unbounded',sans-serif;font-weight:900;font-size:${px}px;line-height:.84;letter-spacing:-.02em;color:#ff1ff0;text-shadow:.05em .06em 0 ${TINTA};display:flex;flex-direction:column;align-items:flex-start;z-index:6"><div style="display:flex;align-items:center;margin-left:.62em;"><span>P</span><span style="width:.72em;height:.72em;border-radius:50%;background:#ff1ff0;box-shadow:.05em .06em 0 ${TINTA};display:flex;align-items:center;justify-content:center;gap:.045em;margin:0 .01em;"><span style="width:.05em;height:0.16em;border-radius:.03em;background:#fff;"></span><span style="width:.05em;height:0.3em;border-radius:.03em;background:#fff;"></span><span style="width:.05em;height:0.44em;border-radius:.03em;background:#fff;"></span><span style="width:.05em;height:0.3em;border-radius:.03em;background:#fff;"></span><span style="width:.05em;height:0.18em;border-radius:.03em;background:#fff;"></span></span><span>D</span></div><div>CONST</div></div>`;

// @ da dupla em etiquetas (capas)
const ETIQ = (pos = 'top:56px;left:0;right:0', alinhar = 'center', desloc = 100) => `<div style="position:absolute;${pos};display:flex;flex-direction:column;align-items:${alinhar};gap:6px;font-weight:700;font-size:30px;color:${TINTA};z-index:6"><div style="background:${AMAR};padding:2px 12px;margin-right:${desloc}px;">@LIBERO<span style="font-weight:400;">FILHO</span></div><div style="background:#e224d6;padding:2px 12px;margin-left:${desloc}px;">@NATALIA<span style="font-weight:400;">VALENCA</span></div></div>`;

// @ da dupla em linhas (páginas internas, como no post do Vadão)
const LINHAS = (cor = '#fff') => `<div style="position:absolute;top:60px;left:78px;right:78px;display:flex;align-items:center;gap:22px;font-size:30px;z-index:5;color:${cor}"><span><b>@libero</b>filho</span><span style="flex:1;height:2px;background:${cor};"></span></div><div style="position:absolute;bottom:60px;left:78px;right:78px;display:flex;align-items:center;gap:22px;font-size:30px;z-index:5;color:${cor}"><span style="flex:1;height:2px;background:${cor};"></span><span><b>@natalia</b>valenca</span></div>`;

const tela = (fundo, corpo, cor = '#fff') => `<div class="tela" data-tela style="background:${fundo};color:${cor}">${corpo}</div>`;

// Moldura de foto. "quem" aparece no lugar se a foto não vier.
const FOTO = (nome, estilo, quem = '', posImg = 'center top', borda = '') => `<div class="foto" style="${estilo}${borda}">${quem ? `<div class="vazio" style="background:${MAG}"><img src="../elementos/headphone_3d.png" alt="" style="width:62%;filter:drop-shadow(0 14px 20px rgba(60,0,60,.35))"></div>` : ''}<img data-foto="${nome}" alt="" style="object-position:${posImg}"></div>`;
const RECORTE = (nome, estilo) => `<img data-foto="${nome}" alt="" style="position:absolute;${estilo};object-fit:contain;object-position:bottom;filter:drop-shadow(0 30px 40px rgba(5,15,50,.45))">`;

// Polaroide da dupla (CTA com foto)
const POLA = (nome, quem, rot, pos) => `<div style="position:absolute;${pos};width:380px;height:470px;background:#fff;padding:18px 18px 70px;transform:rotate(${rot}deg);box-shadow:0 30px 50px rgba(5,15,50,.4);z-index:3">${FOTO(nome, 'left:18px;top:18px;right:18px;bottom:70px;', quem.split(' ')[0])}<div style="position:absolute;left:0;right:0;bottom:14px;text-align:center;color:${TINTA};font-weight:700;font-size:28px">@${quem.replace(' ', '').toLowerCase()}</div></div>`;

const ITEM = (n, titulo, sub, corN = AMAR) => `<div style="display:flex;gap:22px;align-items:flex-start"><span class="bb" style="flex:none;font-size:72px;line-height:.9;color:${corN};width:84px">${n}</span><div style="display:flex;flex-direction:column;gap:6px"><div style="font-weight:700;font-size:38px;line-height:1.12">${titulo}</div>${sub ? `<div style="font-size:29px;line-height:1.3;opacity:.92">${sub}</div>` : ''}</div></div>`;

// ---------------------------------------------------------------- 3a · Storytelling com foto
const g3a = [
  // capa: foto cheia
  tela('#0a1e56', `
${FOTO('capa', 'inset:0;', '', 'center 20%')}
<div class="ab" style="inset:0;background:linear-gradient(180deg,rgba(10,30,86,0) 38%,rgba(10,30,86,.82) 64%,#0a1e56 84%)"></div>
${ETIQ('top:56px;right:60px', 'flex-end', 0)}
<div class="ab" style="left:80px;right:80px;bottom:190px;display:flex;flex-direction:column;align-items:flex-start;gap:4px;z-index:3">
<div style="background:${TINTA};color:${AMAR};font-weight:700;font-size:28px;letter-spacing:4px;padding:6px 16px;margin-bottom:14px">UMA HISTÓRIA DE TODA 2ª FASE</div>
<div class="bb" style="font-size:150px;line-height:.9">VOCÊ SABIA TUDO.</div>
<div class="bb" style="background:#e224d6;font-size:150px;line-height:1;padding:12px 26px 0;transform:rotate(-2deg);margin-top:8px">E TRAVOU NA PEÇA.</div>
</div>
<div class="ab" style="left:80px;bottom:72px;font-weight:700;font-size:30px;z-index:3">Arrasta →</div>
${LOGO(44)}`),

  tela(AZUL, `
<div class="blur" style="bottom:-120px;right:-80px;font-size:460px;color:#e224d6">ERA</div>
${LINHAS()}
<div class="meio" style="left:110px;right:130px;gap:40px">
<div class="bb" style="font-size:140px;line-height:.88">ERA ASSIM:</div>
<div style="display:flex;flex-direction:column;gap:26px;font-weight:700;font-size:44px;line-height:1.12">
<div style="display:flex;gap:18px"><span style="color:${AMAR}">•</span><span>Leu a doutrina inteira.</span></div>
<div style="display:flex;gap:18px"><span style="color:${AMAR}">•</span><span>Fez resumo de tudo.</span></div>
<div style="display:flex;gap:18px"><span style="color:${AMAR}">•</span><span>Viu as aulas em 2x, algumas duas vezes.</span></div>
</div>
<div class="barra"></div>
<div class="txt" style="font-size:40px">No dia da prova, abriu o caderno e…</div>
</div>`),

  tela(AMAR, `
<div class="marca" style="top:-120px;right:-40px;font-size:1100px;color:rgba(0,0,0,.07)">5</div>
${LINHAS(TINTA)}
<div class="meio" style="left:100px;right:100px;gap:30px">
<div class="bb" style="font-size:120px;line-height:.9">5 HORAS DE PROVA<br>E UMA DÚVIDA SÓ:</div>
<div class="bb" style="align-self:flex-start;background:#e224d6;color:#fff;font-size:170px;line-height:1;padding:14px 30px 0;transform:rotate(-2deg)">QUAL É A PEÇA?</div>
<div class="txt" style="font-size:40px;max-width:780px;margin-top:20px">Mandado de segurança ou ação popular? O relógio andando e o Vade Mecum ainda fechado.</div>
</div>`, TINTA),

  tela(NAVY, `
<div class="blur" style="top:-80px;left:-60px;font-size:400px;color:#e224d6">MÉTODO</div>
${RECORTE('recorte', 'right:-40px;bottom:0;width:520px;height:1150px')}
<div class="meio" style="left:96px;width:560px;gap:30px;z-index:3">
<div class="bb" style="font-size:124px;line-height:.9">O PROBLEMA<br>NÃO ERA<br><span style="background:#e224d6;padding:0 12px">ESTUDO.</span></div>
<div class="barra"></div>
<div class="txt">Era método. O conteúdo estava na cabeça; faltava saber <b style="color:${AMAR}">achar no Vade Mecum</b> na hora da prova.</div>
</div>
${LINHAS()}`),

  tela(MAG, `
<div class="marca" style="top:-160px;left:-40px;font-size:900px;color:rgba(120,0,120,.16)">“</div>
<div class="blur" style="bottom:-90px;right:-60px;font-size:380px;color:${AMAR}">VIRADA</div>
${LINHAS()}
<div class="meio" style="left:110px;right:110px;gap:36px">
<div class="kick">A VIRADA</div>
<div class="bb" style="font-size:132px;line-height:.92">NA 2ª FASE NÃO PASSA QUEM SABE MAIS.</div>
<div class="bb" style="align-self:flex-start;background:${TINTA};color:${AMAR};font-size:132px;line-height:1;padding:12px 24px 0;transform:rotate(-2deg)">PASSA QUEM ACHA.</div>
</div>`),

  tela(BRANCO, `
<div class="marca" style="bottom:-200px;right:-60px;font-size:900px;color:rgba(11,42,140,.06)">3</div>
${LINHAS(TINTA)}
<div class="meio" style="left:100px;right:110px;gap:44px;color:${TINTA}">
<div class="bb" style="font-size:130px;line-height:.9;color:#0b2a8c">O QUE MUDOU:</div>
${ITEM('01', 'Identificar a peça pelo pedido', 'Quem pede, contra qual ato, querendo o quê.', '#e224d6')}
${ITEM('02', 'Achar o artigo pelo índice', 'O índice remissivo do Vade Mecum faz o caminho por você.', '#e224d6')}
${ITEM('03', 'Treinar com o relógio ligado', 'Peça inteira no tempo de prova, toda semana.', '#e224d6')}
</div>`, TINTA),

  tela(AZUL, `
${ETIQ()}
${POLA('libero', 'Libero Filho', -5, 'left:110px;top:200px')}
${POLA('natalia', 'Natalia Valenca', 4, 'right:110px;top:240px')}
<div class="ab" style="left:80px;right:80px;top:790px;display:flex;flex-direction:column;align-items:center;gap:26px;text-align:center;z-index:4">
<div class="bb" style="font-size:96px;line-height:.92">SE ESSA HISTÓRIA É A SUA,</div>
<div class="bb" style="background:#e224d6;font-size:110px;line-height:1;padding:10px 26px 0;transform:rotate(-2deg)">DÁ PRA MUDAR O FINAL.</div>
<div class="txt" style="font-size:36px;margin-top:10px">Salva e manda pra quem vai fazer a 2ª fase.</div>
</div>
${LOGO(40)}`),
];

// ---------------------------------------------------------------- 3b · Storytelling sem foto (5 horas)
const HORAS = [
  ['LER ANTES DE ESCREVER', 'Peça e as 4 questões, do começo ao fim. No caderno, marcar quem pede, contra quem e qual ato.', NAVY, '#fff', AMAR],
  ['IDENTIFICAR E ACHAR', 'Com a peça definida, o índice do Vade Mecum leva aos artigos. Esqueleto pronto antes da primeira linha.', MAG, '#fff', AMAR],
  ['ESCREVER A PEÇA', 'Endereçamento, qualificação, cabimento, fatos, mérito e pedidos. Sem pular etapa.', AMAR, TINTA, '#e224d6'],
  ['AS 4 QUESTÕES', 'Cada uma responde direto, explica e fundamenta. Nada de deixar em branco.', AZUL, '#fff', AMAR],
  ['REVISAR', 'Pedidos conferidos, artigos certos, letra legível. É aqui que ponto perdido volta.', BRANCO, TINTA, '#e224d6'],
];
const progresso = (h, cor) => `<div class="ab" style="top:150px;left:100px;right:100px;display:flex;gap:12px">${[1, 2, 3, 4, 5].map(i => `<div style="flex:1;height:14px;background:${i <= h ? cor : 'currentColor'};opacity:${i <= h ? 1 : .22}"></div>`).join('')}</div>`;
const g3b = [
  tela(AZUL, `
${ETIQ()}
<div class="ab" style="left:0;right:0;top:190px;display:flex;flex-direction:column;align-items:center;text-align:center;z-index:3">
<div class="bb" style="font-size:120px;line-height:.9">A 2ª FASE EM</div>
<div class="bb" style="background:#e224d6;font-size:250px;line-height:1;padding:16px 40px 0;transform:rotate(-2deg);margin:10px 0">5 HORAS</div>
<div class="bb" style="font-size:96px;line-height:.95">CONTADA HORA A HORA</div>
</div>
<div class="ab" style="left:50%;top:700px;width:560px;height:560px;transform:translateX(-50%);border-radius:50%;background:radial-gradient(circle,rgba(247,244,0,.35) 0%,rgba(247,244,0,0) 65%)"></div>
<img src="../elementos/alarm_clock_3d.png" alt="" style="position:absolute;left:50%;top:740px;width:400px;transform:translateX(-50%) rotate(-8deg);filter:drop-shadow(0 30px 40px rgba(5,15,50,.55));z-index:2">
<div class="ab" style="left:70px;top:820px;display:flex;flex-direction:column;gap:12px;z-index:4">${['LER', 'ACHAR', 'ESCREVER'].map((t, i) => `<div class="bb" style="align-self:flex-start;background:${i % 2 ? AMAR : TINTA};color:${i % 2 ? TINTA : AMAR};font-size:52px;line-height:1;padding:8px 16px 0;transform:rotate(-4deg)">${i + 1}. ${t}</div>`).join('')}</div>
<div class="ab" style="right:70px;top:880px;display:flex;flex-direction:column;align-items:flex-end;gap:12px;z-index:4">${['QUESTÕES', 'REVISAR'].map((t, i) => `<div class="bb" style="background:${i % 2 ? TINTA : AMAR};color:${i % 2 ? AMAR : TINTA};font-size:52px;line-height:1;padding:8px 16px 0;transform:rotate(4deg)">${i + 4}. ${t}</div>`).join('')}</div>
<div class="ab" style="left:70px;bottom:72px;font-weight:700;font-size:30px;z-index:4">Arrasta →</div>
${LOGO(44)}`),
  ...HORAS.map(([tit, txt, fundo, cor, dest], i) => tela(fundo, `
<div class="marca" style="top:120px;right:-30px;font-size:1250px;line-height:.85;color:transparent;-webkit-text-stroke:4px ${cor === TINTA ? 'rgba(11,26,74,.12)' : 'rgba(255,255,255,.14)'}">${i + 1}</div>
${LINHAS(cor)}
<div style="color:${cor}">${progresso(i + 1, dest)}</div>
<div class="meio" style="left:100px;right:200px;gap:34px">
<div class="kick" style="${cor === TINTA ? '' : ''}">HORA ${i + 1} DE 5</div>
<div class="bb" style="font-size:150px;line-height:.88">${tit}</div>
<div style="width:86px;height:16px;background:${dest}"></div>
<div class="txt" style="font-size:40px">${txt}</div>
</div>`, cor)),
  tela(MAG, `
<div class="blur" style="top:-60px;right:-60px;font-size:420px;color:${AMAR}">6,0</div>
${LINHAS()}
<div class="meio" style="left:100px;right:100px;gap:30px">
<div class="bb" style="font-size:120px;line-height:.9">NO FIM DAS 5 HORAS:</div>
<div style="display:flex;gap:24px;margin-top:10px">
<div style="flex:1;background:${TINTA};padding:30px 30px 24px"><div class="bb" style="font-size:120px;line-height:.9;color:${AMAR}">5,0</div><div style="font-weight:700;font-size:32px">a peça</div></div>
<div style="flex:1;background:${TINTA};padding:30px 30px 24px"><div class="bb" style="font-size:120px;line-height:.9;color:${AMAR}">5,0</div><div style="font-weight:700;font-size:32px">as 4 questões</div></div>
</div>
<div class="bb" style="align-self:flex-start;background:${AMAR};color:${TINTA};font-size:110px;line-height:1;padding:12px 24px 0;transform:rotate(-2deg);margin-top:16px">APROVA COM 6,0.</div>
<div class="txt" style="font-size:38px;margin-top:10px">Salva pra ler na véspera e manda pra sua dupla de estudo.</div>
</div>
${LOGO(40, 'bottom:120px;right:80px')}`),
];

// ---------------------------------------------------------------- 3c · Método com foto
const g3c = [
  tela(NAVY, `
${FOTO('capa', 'top:0;right:0;width:700px;height:1350px;', '', '62% top')}
<div class="ab" style="top:0;left:0;width:400px;height:1350px;background:${MAG}"></div>
<div class="ab" style="top:0;left:390px;width:80px;height:1350px;background:linear-gradient(90deg,#c515c2,rgba(197,21,194,0))"></div>
${ETIQ('top:56px;left:70px', 'flex-start', 0)}
<div class="ab" style="left:70px;top:330px;width:760px;display:flex;flex-direction:column;align-items:flex-start;z-index:3">
<div class="bb" style="font-size:130px;line-height:.88">O MÉTODO<br>PRA PEÇA DE</div>
<div class="bb" style="background:${TINTA};color:${AMAR};font-size:150px;line-height:1;padding:12px 24px 0;transform:rotate(-2deg);margin:12px 0 18px">CONSTITUCIONAL</div>
<div class="bb" style="background:${AMAR};color:${TINTA};font-size:90px;line-height:1;padding:8px 20px 0">EM 3 PASSOS</div>
</div>
${LOGO(44, 'bottom:60px;left:110px')}`),

  tela(AZUL2, `
<div class="blur" style="bottom:-110px;left:-60px;font-size:420px;color:#e224d6">MÉTODO</div>
${LINHAS()}
<div class="meio" style="left:120px;right:150px;gap:40px">
<div class="bb" style="font-size:136px;line-height:.88">SIM, DÁ PRA TER MÉTODO PRA PEÇA.</div>
<div class="barra"></div>
<div class="txt" style="font-size:40px">Não é decorar modelo. É uma ordem de perguntas que você faz ao enunciado, sempre a mesma.</div>
</div>`),

  tela(MAG, `
${RECORTE('recorte', 'left:-60px;bottom:0;width:470px;height:1100px')}
<div class="marca" style="top:-60px;right:-30px;font-size:700px;color:rgba(120,0,120,.18)">01</div>
${LINHAS()}
<div class="meio" style="left:440px;right:80px;gap:30px;z-index:3">
<div class="kick">PASSO 1</div>
<div class="bb" style="font-size:150px;line-height:.88">IDENTIFICA.</div>
<div class="barra"></div>
<div class="txt">Quem pede? Contra qual ato? O que quer?<br><br>As três respostas, juntas, apontam a peça.</div>
</div>`),

  tela(AMAR, `
<div class="marca" style="top:-60px;right:-30px;font-size:700px;color:rgba(0,0,0,.07)">02</div>
${LINHAS(TINTA)}
<div class="meio" style="left:110px;right:140px;gap:30px">
<div class="kick">PASSO 2</div>
<div class="bb" style="font-size:150px;line-height:.88">ACHA NO VADE.</div>
<div style="width:86px;height:16px;background:#e224d6"></div>
<div class="txt" style="font-size:40px">Pelo índice remissivo, não pela memória. Na prova, a lei está na sua mesa: o trabalho é saber o caminho até ela.</div>
</div>`, TINTA),

  tela(NAVY, `
<div class="marca" style="top:-60px;right:-30px;font-size:700px;color:rgba(255,255,255,.06)">03</div>
${LINHAS()}
<div class="meio" style="left:110px;right:110px;gap:26px">
<div class="kick" style="background:#e224d6;color:#fff">PASSO 3</div>
<div class="bb" style="font-size:150px;line-height:.88">ESTRUTURA.</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:18px 30px;margin-top:16px">
${['Endereçamento', 'Qualificação', 'Cabimento', 'Fatos', 'Mérito', 'Tutela, se couber', 'Pedidos', 'Valor da causa'].map(t => `<div style="display:flex;gap:14px;align-items:center;font-weight:700;font-size:36px"><span style="flex:none;width:34px;height:34px;background:${AMAR};color:${TINTA};display:flex;align-items:center;justify-content:center;font-size:26px">✓</span>${t}</div>`).join('')}
</div>
<div class="txt" style="font-size:32px;opacity:.85;margin-top:10px">A ordem é a mesma; o que muda de uma peça para outra são os artigos.</div>
</div>`),

  tela(BRANCO, `
${LINHAS(TINTA)}
<div class="ab" style="top:170px;left:0;right:0;text-align:center" ><div class="bb" style="font-size:150px;line-height:.86;color:#0b2a8c">TÁ VENDO<br>QUE FUNCIONA?</div></div>
<div class="ab" style="left:90px;top:540px;right:90px;display:flex;flex-direction:column;gap:30px;color:#fff">
<div style="background:${AZUL};padding:36px 40px;display:flex;gap:30px;align-items:center;transform:rotate(-1.5deg)"><div class="bb" style="font-size:150px;line-height:.85;color:${AMAR}">14/14</div><div style="font-weight:700;font-size:34px;line-height:1.2">itens da OAB 47 (peça + 4 questões) achados no índice do Vadão de Constitucional.</div></div>
<div style="background:${MAG};padding:36px 40px;display:flex;gap:30px;align-items:center;transform:rotate(1.2deg)"><div class="bb" style="font-size:150px;line-height:.85;color:${AMAR}">1º</div><div style="font-weight:700;font-size:34px;line-height:1.2">Constitucional em 1º lugar no aproveitamento médio da 2ª fase: 29,6%, nos dados da FGV.</div></div>
</div>
<div class="ab" style="left:90px;right:90px;bottom:140px;text-align:center;font-weight:700;font-size:32px;color:${TINTA}">Passou com o método? Manda o print que a gente reposta.</div>`, TINTA),

  tela(AZUL, `
${ETIQ()}
${POLA('libero', 'Libero Filho', -5, 'left:110px;top:200px')}
${POLA('natalia', 'Natalia Valenca', 4, 'right:110px;top:240px')}
<div class="ab" style="left:80px;right:80px;top:800px;display:flex;flex-direction:column;align-items:center;gap:24px;text-align:center;z-index:4">
<div class="bb" style="font-size:100px;line-height:.92">IDENTIFICA, ACHA, ESTRUTURA.</div>
<div class="txt" style="font-size:36px">Quer treinar o método com a gente?</div>
<div class="bb" style="background:${AMAR};color:${TINTA};font-size:90px;line-height:1;padding:12px 26px 2px;transform:rotate(-2deg)">COMENTA “MÉTODO” 👇</div>
</div>
${LOGO(40)}`),
];

// ---------------------------------------------------------------- 3d · Método sem foto (questões)
const g3d = [
  tela(AZUL, `
<div class="blur" style="bottom:-120px;right:-60px;font-size:460px;color:#e224d6">FGV</div>
${ETIQ('top:56px;left:80px', 'flex-start', 0)}
<div class="ab" style="left:80px;right:80px;top:220px;display:flex;flex-direction:column;align-items:flex-start;z-index:3">
<div class="bb" style="font-size:132px;line-height:.88">COMO RESPONDER</div>
<div class="bb" style="background:#e224d6;font-size:178px;line-height:1;padding:12px 30px 0;transform:rotate(-2deg);margin:10px 0 6px">QUESTÃO DISCURSIVA</div>
<div class="bb" style="background:${AMAR};color:${TINTA};font-size:72px;line-height:1;padding:10px 20px 0;margin-top:10px">SEM PERDER PONTO</div>
</div>
<div class="ab" style="left:150px;top:830px;width:740px;height:440px;background:#fff;transform:rotate(-4deg);box-shadow:0 30px 60px rgba(5,15,50,.45);padding:40px 70px 40px 46px;color:${TINTA};z-index:2;background-image:repeating-linear-gradient(180deg,transparent 0 58px,rgba(11,42,140,.14) 58px 60px);background-position:0 96px">
<div style="font-weight:700;font-size:22px;letter-spacing:4px;color:#0b2a8c;margin-bottom:22px">CADERNO DE RESPOSTAS · QUESTÃO 1</div>
<div style="font-family:'Caveat',cursive;font-size:44px;line-height:60px"><span style="position:relative;display:inline-block;padding:0 10px">Não.<span style="position:absolute;inset:-8px -12px;border:5px solid #e224d6;border-radius:50%;transform:rotate(-6deg)"></span></span> Legislar sobre direito penal é competência privativa da União, conforme o art. 22, I, da CF…</div>
</div>
<div class="ab" style="left:790px;top:760px;width:220px;height:220px;border-radius:50%;border:8px solid #e224d6;color:#e224d6;background:rgba(255,255,255,.92);display:flex;flex-direction:column;align-items:center;justify-content:center;transform:rotate(12deg);z-index:4;box-shadow:0 14px 30px rgba(5,15,50,.3)"><div class="bb" style="font-size:96px;line-height:.85">1,25</div><div style="font-weight:700;font-size:20px;letter-spacing:3px">NOTA CHEIA</div></div>
<img src="../elementos/check_mark_button_3d.png" alt="" style="position:absolute;left:70px;top:1100px;width:160px;transform:rotate(-10deg);z-index:5;filter:drop-shadow(0 16px 24px rgba(5,15,50,.4))">
${LOGO(42, 'bottom:44px;right:70px')}`),

  tela(NAVY, `
<div class="blur" style="top:-80px;right:-60px;font-size:400px;color:#e224d6">ERRO</div>
${LINHAS()}
<div class="meio" style="left:110px;right:130px;gap:34px">
<div class="kick">O ERRO MAIS CARO</div>
<div class="bb" style="font-size:132px;line-height:.9">RESPONDER SÓ COM O NÚMERO DO ARTIGO.</div>
<div class="barra"></div>
<div class="txt">Os padrões de resposta da FGV repetem o aviso: <b style="color:${AMAR}">a mera citação do dispositivo legal não confere pontuação.</b></div>
</div>`),

  tela(AZUL, `
${LINHAS()}
<div class="meio" style="left:100px;right:100px;gap:40px">
<div class="bb" style="font-size:136px;line-height:.88">A RESPOSTA<br>EM 3 PARTES</div>
${ITEM('01', 'Responde direto', 'Sim ou não, cabe ou não cabe, logo na primeira linha.')}
${ITEM('02', 'Explica o porquê', 'Uma ou duas frases com o raciocínio.')}
${ITEM('03', 'Fundamenta', 'Artigo, súmula ou lei que sustentam a explicação.')}
</div>`),

  tela(BRANCO, `
${LINHAS(TINTA)}
<div class="meio" style="left:100px;right:100px;gap:30px;color:${TINTA}">
<div class="kick" style="background:#e224d6;color:#fff">NA PRÁTICA</div>
<div style="font-weight:700;font-size:40px;line-height:1.2">Um estado pode criar, por lei estadual, um crime novo?</div>
<div style="background:#fff;border-left:16px solid #0b2a8c;padding:36px 40px;box-shadow:0 20px 40px rgba(11,26,74,.12);font-size:38px;line-height:1.35">
<span style="background:${AMAR};padding:0 6px"><b>Não.</b></span>
<span style="background:rgba(226,36,214,.18);padding:0 6px">Legislar sobre direito penal é competência privativa da União,</span>
<span style="background:rgba(11,42,140,.14);padding:0 6px">nos termos do art. 22, I, da CF.</span>
</div>
<div style="display:flex;gap:16px;flex-wrap:wrap;font-weight:700;font-size:28px">
<span style="background:${AMAR};padding:6px 14px">1 · RESPONDE</span><span style="background:rgba(226,36,214,.25);padding:6px 14px">2 · EXPLICA</span><span style="background:rgba(11,42,140,.2);padding:6px 14px">3 · FUNDAMENTA</span>
</div>
</div>`, TINTA),

  tela(MAG, `
<div class="blur" style="bottom:-100px;left:-60px;font-size:420px;color:${AMAR}">BRANCO</div>
${LINHAS()}
<div class="meio" style="left:110px;right:130px;gap:34px">
<div class="bb" style="font-size:150px;line-height:.88">E SE NÃO SOUBER?</div>
<div style="width:86px;height:16px;background:${AMAR}"></div>
<div class="txt" style="font-size:40px">Responde o que sabe, com fundamento. Uma parte certa ainda pontua.</div>
<div class="bb" style="align-self:flex-start;background:${TINTA};color:${AMAR};font-size:96px;line-height:1;padding:12px 24px 0;transform:rotate(-2deg)">EM BRANCO É ZERO.</div>
</div>`),

  tela(AMAR, `
${LINHAS(TINTA)}
<div class="meio" style="left:100px;right:100px;gap:36px">
<div class="bb" style="font-size:130px;line-height:.88">POR QUE VALE TREINAR CONSTITUCIONAL?</div>
<div style="display:flex;gap:30px;align-items:center;border-top:4px solid ${TINTA};padding-top:30px"><div class="bb" style="font-size:180px;line-height:.8;color:#e224d6">1º</div><div style="font-weight:700;font-size:36px;line-height:1.2">lugar no aproveitamento médio da 2ª fase: 29,6%, nos dados da FGV.</div></div>
<div style="display:flex;gap:30px;align-items:center;border-top:4px solid ${TINTA};padding-top:30px"><div class="bb" style="font-size:180px;line-height:.8;color:#e224d6">14</div><div style="font-weight:700;font-size:36px;line-height:1.2">itens da OAB 47, e todos estavam no índice do Vadão de Constitucional.</div></div>
</div>`, TINTA),

  tela(AZUL, `
${ETIQ()}
<div class="ab" style="left:90px;right:90px;top:300px;display:flex;flex-direction:column;align-items:center;gap:34px;text-align:center">
<div class="bb" style="font-size:130px;line-height:.9">RESPONDE.<br>EXPLICA.<br><span style="background:#e224d6;padding:0 16px">FUNDAMENTA.</span></div>
<div class="barra"></div>
<div class="txt" style="font-size:40px">Usa na próxima questão que você treinar e manda pra quem vai fazer a 2ª fase.</div>
<div class="bb" style="background:${AMAR};color:${TINTA};font-size:80px;line-height:1;padding:12px 26px 2px;transform:rotate(-2deg)">SALVA PRA REVISAR 📌</div>
</div>
${LOGO(44)}`),
];

// ---------------------------------------------------------------- 3e · Tela única sem foto: certo ou errado
const g3e = [tela(AZUL, `
<div class="blur" style="top:-100px;left:-60px;font-size:400px;color:#e224d6">CERTO</div>
<div class="blur" style="bottom:-120px;right:-60px;font-size:400px;color:#e224d6">ERRADO</div>
${ETIQ()}
<div class="ab" style="top:230px;left:0;right:0;text-align:center"><div class="bb" style="display:inline-block;background:#e224d6;font-size:140px;line-height:1;padding:12px 30px 0;transform:rotate(-2deg)">CERTO OU ERRADO?</div></div>
<div class="ab" style="top:470px;left:110px;right:110px;background:#fff;color:${TINTA};padding:60px 64px;box-shadow:0 30px 60px rgba(5,15,50,.35)">
<div class="kick" style="margin-bottom:26px">2ª FASE · QUESTÃO</div>
<div style="font-weight:700;font-size:50px;line-height:1.2">Na resposta da questão, citar o artigo certo já garante a pontuação.</div>
</div>
<div class="ab" style="top:1040px;left:0;right:0;display:flex;justify-content:center;gap:40px">
<div class="bb" style="background:${AMAR};color:${TINTA};font-size:80px;line-height:1;padding:10px 40px 0">✓ CERTO</div>
<div class="bb" style="background:${TINTA};color:#fff;font-size:80px;line-height:1;padding:10px 40px 0">✗ ERRADO</div>
</div>
<div class="ab" style="left:0;right:0;bottom:70px;text-align:center;font-weight:700;font-size:32px">Responde nos comentários 👇</div>
${LOGO(36, 'bottom:44px;right:60px')}`)];

// ---------------------------------------------------------------- 3f · Tela única com foto: checklist da véspera
const g3f = [tela(MAG, `
<div class="marca" style="top:-60px;left:-40px;font-size:620px;color:rgba(120,0,120,.16)">VÉSPERA</div>
${RECORTE('recorte', 'right:-70px;bottom:0;width:470px;height:1080px')}
${ETIQ('top:56px;left:80px', 'flex-start', 0)}
<div class="meio" style="left:80px;width:640px;gap:22px;z-index:3">
<div class="bb" style="font-size:118px;line-height:.88">CHECKLIST DA VÉSPERA</div>
<div class="bb" style="align-self:flex-start;background:${TINTA};color:${AMAR};font-size:72px;line-height:1;padding:10px 20px 0;transform:rotate(-2deg);margin-bottom:14px">2ª FASE DA OAB</div>
${['Documento oficial com foto', 'Caneta azul ou preta, de corpo transparente', 'Vade Mecum dentro das regras do edital', 'Horário dos portões conferido', 'Dormir. Sério.'].map(t => `<div style="display:flex;gap:18px;align-items:center;font-weight:700;font-size:36px;line-height:1.15"><span style="flex:none;width:46px;height:46px;border:4px solid #fff;display:flex;align-items:center;justify-content:center;color:${AMAR};font-size:34px">✓</span>${t}</div>`).join('')}
<div style="font-weight:600;font-size:28px;opacity:.9;margin-top:8px">Confira tudo no edital do seu exame.</div>
</div>
<div class="ab" style="left:80px;bottom:70px;background:${AMAR};color:${TINTA};font-weight:700;font-size:30px;padding:10px 20px;z-index:3">Marca quem vai fazer a prova 👇</div>
${LOGO(40, 'bottom:60px;right:300px')}`)];

export const GRUPOS = { '3a': g3a, '3b': g3b, '3c': g3c, '3d': g3d, '3e': g3e, '3f': g3f };

export function paginaHtml(grupo) {
  const telas = GRUPOS[grupo];
  if (!telas) return null;
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Grotesk:wght@400;500;600;700&family=Unbounded:wght@900&family=Caveat:wght@600&display=swap" rel="stylesheet">
<style>${css}</style></head><body>${telas.join('\n')}</body></html>`;
}
export { LOGO, ETIQ, LINHAS, AZUL, MAG, NAVY, AMAR, BRANCO, TINTA };
