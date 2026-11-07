// PDF de apresentação da identidade das redes da ANOREG/PE (16:9, 1920×1080 por página), nas cores e no azulejo do sistema.
// Usa as peças já geradas (node render.mjs) reduzidas em saida/pdf-img/. Saída: saida/ANOREG-PE-identidade-redes.pdf
// Precisa de: pip install img2pdf. Uso: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node apresentacao-pdf.mjs
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { abrirNavegador } from '../cartorio-comum/render-base.mjs';
import { COR, painel, trama, logo, ladrilho } from './template.mjs';
import { olinda, sombrinha } from './extras.mjs';

const R = path.dirname(new URL(import.meta.url).pathname);
const I = COR.indigo, AM = COR.amarelo, VM = COR.vermelho;
const im = (n, css = '') => { const f = path.join(R, 'saida', 'pdf-img', n + '.jpg'); if (!fs.existsSync(f)) throw new Error('falta ' + f); return `<img src="data:image/jpeg;base64,${fs.readFileSync(f).toString('base64')}" style="display:block;${css}">`; };
const sombra = 'box-shadow:0 2px 4px rgba(6,8,69,.12),0 18px 40px rgba(6,8,69,.16)';
const post = (n, w) => im(n, `width:${w}px;height:auto;${sombra}`);

let pag = 0;
const TOTAL = 17;
// página clara padrão: título à esquerda, conteúdo, rodapé discreto
const pagina = (titulo, sub, corpo, fundo = '#F5F6FB') => { pag++; return `<section class="pg" style="background:${fundo}">
  <div class="cab"><div class="num">${String(pag).padStart(2, '0')}</div><div><h2>${titulo}</h2>${sub ? `<p class="sub">${sub}</p>` : ''}</div></div>
  <div class="corpo">${corpo}</div>
  <div class="rod"><span>ANOREG/PE · Identidade visual para as redes</span><span>${pag} / ${TOTAL}</span></div></section>`; };

const css = `
*{box-sizing:border-box;margin:0;padding:0}
@page{size:1920px 1080px;margin:0}
body{font-family:Lexend,sans-serif;color:${I};-webkit-font-smoothing:antialiased}
.pg{width:1920px;height:1080px;position:relative;overflow:hidden;page-break-after:always;break-after:page}
.cab{position:absolute;left:120px;top:96px;right:120px;display:flex;gap:36px;align-items:flex-start}
.num{width:84px;height:84px;flex:none;${painel(84)};display:grid;place-items:center;position:relative}
.num:after{content:'';position:absolute;inset:22px;border-radius:50%;background:${I}}
.num{font-size:0}
h2{font-size:58px;font-weight:700;letter-spacing:-.03em;line-height:1.05}
.sub{font-size:24px;font-weight:300;color:${COR.texto};margin-top:12px;max-width:1300px;line-height:1.45}
.corpo{position:absolute;left:120px;right:120px;top:270px;bottom:120px}
.rod{position:absolute;left:120px;right:120px;bottom:52px;display:flex;justify-content:space-between;font-size:16px;font-weight:300;color:#8A8DB5;border-top:1px solid #DADCEB;padding-top:18px}
.lin{display:flex;gap:40px;align-items:flex-start}
.leg{font-size:18px;font-weight:300;color:${COR.texto};margin-top:16px}
.leg b{font-weight:600;color:${I}}
.abs{position:absolute}
`;

// números das páginas: o azulejo do cabeçalho recebe o número por cima
const numCss = Array.from({ length: TOTAL }, (_, i) => `.pg:nth-of-type(${i + 1}) .num:before{content:'${i + 1}';position:absolute;z-index:1;inset:0;display:grid;place-items:center;font:700 22px Lexend;color:#fff}`).join('');

const paginas = [];

// 1 capa
pag++;
paginas.push(`<section class="pg" style="background:radial-gradient(120% 90% at 85% 0%,#2A2FA8 0%,${I} 45%,${COR.fundo} 100%);color:#fff">
  <div class="abs" style="right:0;top:0;width:560px;height:1080px;${painel(280)}"></div>
  <div class="abs" style="left:120px;top:120px">${logo('branco', 520)}</div>
  <div class="abs" style="left:120px;top:430px;right:720px">
    <div style="font-size:30px;font-weight:300;opacity:.85">Proposta de identidade visual</div>
    <div style="font-size:104px;font-weight:700;letter-spacing:-.035em;line-height:1;margin-top:20px">Redes sociais da ANOREG/PE</div>
    <div style="width:80px;height:6px;background:${AM};margin:44px 0 34px"></div>
    <div style="font-size:26px;font-weight:300;line-height:1.5;opacity:.9">Instagram e YouTube · Novembro de 2026</div></div></section>`);

// 2 conceito
paginas.push(pagina('O conceito', 'Azulejo pernambucano no azul da ANOREG/PE.', `
  <div class="lin" style="gap:90px">
    <div style="width:520px;height:520px;${painel(260)};flex:none;${sombra}"></div>
    <div style="font-size:30px;font-weight:300;line-height:1.6;max-width:880px;color:${I}">
      <p>O azulejo português pintado à mão está nas fachadas do Recife e de Olinda. É um padrão que todo pernambucano reconhece e que fala de tradição, de cuidado e de permanência: o mesmo que se espera de um cartório.</p>
      <p style="margin-top:30px">A identidade junta esse azulejo ao índigo do logo oficial, a um degradê escuro para as capas e a uma tipografia limpa. O resultado é institucional sem ser frio e local sem ser caricato.</p>
      <div style="display:flex;gap:16px;margin-top:44px;flex-wrap:wrap">${['Tradição', 'Fé pública', 'Pernambuco', 'Proximidade com o cidadão'].map(t => `<span style="border:1.5px solid ${I};padding:12px 22px;font-size:20px;font-weight:500">${t}</span>`).join('')}</div>
    </div></div>`));

// 3 logo
const caixaLogo = (fundo, tipo, leg, w = 520) => `<div style="flex:1"><div style="height:330px;background:${fundo};display:grid;place-items:center;${fundo === '#fff' ? 'border:1px solid #DADCEB' : ''}">${logo(tipo, w)}</div><div class="leg">${leg}</div></div>`;
paginas.push(pagina('Logo', 'O logo oficial da associação, sem alterações. Muda só a cor de acordo com o fundo.', `
  <div class="lin" style="gap:28px">${caixaLogo('#fff', 'cor', '<b>Colorido</b> · fundos claros')}${caixaLogo(I, 'branco', '<b>Branco</b> · fundos índigo e fotos')}${caixaLogo('#0B0B0D', 'mono', '<b>Monocromático</b> · nota de pesar')}</div>
  <div class="lin" style="gap:28px;margin-top:40px">${caixaLogo('#fff', 'letreiroCor', '<b>Letreiro</b> · quando a assinatura ficaria pequena', 400)}${caixaLogo(`radial-gradient(120% 90% at 85% 0%,#2A2FA8,${I} 45%,${COR.fundo})`, 'letreiroBranco', '<b>Letreiro branco</b> · foto de perfil e capas', 400)}<div style="flex:1;font-size:22px;font-weight:300;line-height:1.55;color:${COR.texto};padding-top:20px">Área de respiro em volta do logo: no mínimo a altura da letra A.<br><br>Não distorcer, não aplicar sombra e não trocar as cores do “PE” e da barra vermelha.</div></div>`));

// 4 cores
const cor = (c, n, hex, uso, txt = '#fff') => `<div style="flex:1"><div style="height:330px;background:${c};${c === '#FFFFFF' ? 'border:1px solid #DADCEB' : ''};padding:28px;display:flex;flex-direction:column;justify-content:flex-end;color:${txt}"><div style="font-size:30px;font-weight:600">${n}</div><div style="font-size:20px;font-weight:300;margin-top:6px">${hex}</div></div><div class="leg">${uso}</div></div>`;
paginas.push(pagina('Cores', 'Tiradas do arquivo do logo oficial. Índigo e branco fazem quase tudo; vermelho e amarelo aparecem só dentro do logo e em detalhes pontuais.', `
  <div class="lin" style="gap:24px">${cor(I, 'Índigo', '#0E1170', 'Cor principal: fundos, títulos, azulejo')}${cor('#FFFFFF', 'Branco', '#FFFFFF', 'Fundos claros e textos sobre índigo', I)}${cor(`radial-gradient(120% 90% at 85% 0%,#2A2FA8,${I} 45%,${COR.fundo})`, 'Degradê', '#2A2FA8 → #060845', 'Capas, slides alternados, YouTube')}</div>
  <div class="lin" style="gap:24px;margin-top:40px">${cor('#E9EAF6', 'Gelo', '#E9EAF6', 'Apoio em fundos claros', I)}${cor(VM, 'Vermelho', '#E0070F', 'Barra do logo e “AO VIVO”')}${cor(AM, 'Amarelo', '#FCF10C', '“PE” do logo e pequenos detalhes', I)}</div>`));

// 5 tipografia
paginas.push(pagina('Tipografia', 'Lexend, da mesma família da assinatura do logo. Uma fonte só, em pesos diferentes.', `
  <div class="lin" style="gap:100px">
    <div style="font-size:300px;font-weight:700;letter-spacing:-.04em;line-height:.9">Aa</div>
    <div style="flex:1">
      <div style="font-size:84px;font-weight:700;letter-spacing:-.03em;line-height:1">Resolva no cartório.</div><div class="leg">Títulos · Lexend Bold, espaçamento levemente fechado</div>
      <div style="font-size:44px;font-weight:600;margin-top:44px">Inventário extrajudicial com herdeiros menores</div><div class="leg">Subtítulos · Lexend SemiBold</div>
      <div style="font-size:30px;font-weight:300;line-height:1.5;margin-top:44px;color:${COR.texto}">Herdeiros de acordo fazem a partilha por escritura pública, no tabelionato de notas.</div><div class="leg">Textos · Lexend Light</div>
    </div></div>`));

// 6 elementos de Pernambuco
const elem = (desenho, nome, txt) => `<div style="flex:1 1 0;min-width:0"><div style="height:480px;display:grid;place-items:center;overflow:hidden;position:relative">${desenho}</div><div style="font-size:26px;font-weight:600;margin-top:20px">${nome}</div><div style="font-size:19px;font-weight:300;line-height:1.5;color:${COR.texto};margin-top:8px">${txt}</div></div>`;
paginas.push(pagina('Elementos de Pernambuco', 'Detalhes que deixam claro de onde a associação é, sem virar enfeite.', `
  <div class="lin" style="gap:34px">
    ${elem(`<div style="width:100%;height:100%;${painel(200)}"></div>`, 'Azulejo', 'Ladrilho pintado em índigo. Painel inteiro, faixa ou um único ladrilho com número.')}
    ${elem(`<div style="width:100%;height:100%;background:${I};display:grid;place-items:center"><div style="width:280px;height:370px;border-radius:140px 140px 0 0;border:10px solid #fff;overflow:hidden"><img src="data:image/jpeg;base64,${fs.readFileSync(path.join(R, 'fotos', 'fontes', '7641906.jpg')).toString('base64')}" style="width:100%;height:100%;object-fit:cover;object-position:45% 40%"></div></div>`, 'Janela em arco', 'Moldura das fotos inspirada nas janelas dos casarões coloniais.')}
    ${elem(`<div style="width:100%;height:100%;background:radial-gradient(120% 90% at 85% 0%,#2A2FA8,${I} 45%,${COR.fundo});position:relative"><div style="position:absolute;bottom:0;left:50%;width:760px;margin-left:-380px">${olinda('#fff', I, 211)}</div></div>`, 'Olinda', 'Silhueta da Sé, do casario, do farol e dos coqueiros.')}
    ${elem(`<div style="width:100%;height:100%;background:radial-gradient(120% 90% at 85% 0%,#3A40C0,#2A2FA8 60%,#1C2090);display:grid;place-items:center">${sombrinha(320, -10)}</div>`, 'Sombrinha de frevo', 'Nas cores do logo, para datas festivas e aniversários.')}
  </div>`));

// 7 perfil do Instagram
const circ = (n, px) => `<div style="width:${px}px;height:${px}px;border-radius:50%;overflow:hidden;box-shadow:0 0 0 3px #fff,0 0 0 5px #DADCEB;flex:none">${im(n, `width:${px}px;height:${px * 1920 / 1080}px;margin-top:${-px * 420 / 1080}px`)}</div>`;
paginas.push(pagina('Perfil no Instagram', 'Foto de perfil com o letreiro, capas de destaque com ícones sobre o azulejo e um feed que alterna degradê, branco e foto.', `
  <div class="lin" style="gap:80px">
    <div style="width:470px;background:#fff;border:1px solid #DADCEB;border-radius:24px;padding:24px 20px 0;flex:none;${sombra};overflow:hidden">
      <div style="display:flex;gap:20px;align-items:center"><div style="width:110px;height:110px;border-radius:50%;overflow:hidden;flex:none">${im('perfil', 'width:110px')}</div>
        <div><div style="font-size:22px;font-weight:600">ANOREG/PE</div><div style="font-size:16px;font-weight:300;color:${COR.texto};line-height:1.4;margin-top:4px">Associação dos Notários e Registradores do Estado de Pernambuco</div></div></div>
      <div style="display:flex;gap:10px;margin:20px 0 18px">${['institucional', 'noticias', 'eventos', 'servicos', 'associados', 'contato'].map(k => circ("destaque-" + k, 62)).join('')}</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:3px;margin:0 -20px">${['carrossel-1', 'cidadao-casamento', 'feed-agenda', 'aula-feed', 'feed-servico', 'cidadao-imovel'].map(n => `<div style="aspect-ratio:3/4;overflow:hidden">${im(n, 'width:100%;height:100%;object-fit:cover')}</div>`).join('')}</div></div>
    <div style="font-size:26px;font-weight:300;line-height:1.6;color:${COR.texto};padding-top:30px;max-width:640px">
      <p><b style="color:${I};font-weight:600">Grade com ritmo.</b> Peças escuras, claras e com foto se alternam, então o perfil não fica todo azul nem todo branco.</p>
      <p style="margin-top:28px"><b style="color:${I};font-weight:600">Títulos curtos.</b> Uma ideia por peça, sem setas de “arraste”, sem selos e sem rodapés repetidos.</p>
      <p style="margin-top:28px"><b style="color:${I};font-weight:600">Destaques.</b> Institucional, Notícias, Eventos, Serviços, Associados e Contato.</p></div></div>`));

// páginas de peças
const faixa = (ns, gap = 16) => { const w = Math.floor((1680 - gap * (ns.length - 1)) / ns.length); return `<div style="height:100%;display:flex;align-items:center"><div style="display:flex;gap:${gap}px">${ns.map(n => post(n, w)).join('')}</div></div>`; };
const grade = (itens, w, gap = 30) => `<div class="lin" style="gap:${gap}px;justify-content:flex-start">${itens.map(([n, l]) => `<div>${post(n, w)}${l ? `<div class="leg">${l}</div>` : ''}</div>`).join('')}</div>`;
paginas.push(pagina('Feed · tela única', 'Formato 1080×1350. Serviço, agenda e frase.', grade([['feed-servico', 'Serviço'], ['feed-agenda', 'Agenda'], ['feed-frase', 'Frase']], 440, 70)));
paginas.push(pagina('Capas com foto para o cidadão', 'Fotos de situações do dia a dia, com o título em cima do índigo, para chamar quem não conhece o cartório.', faixa(['cidadao-casamento', 'cidadao-nascimento', 'cidadao-imovel', 'cidadao-recife', 'pe-olinda'], 24)));
paginas.push(pagina('Carrossel para o cidadão', 'Seis slides: capa só com o título, um serviço por slide, número dentro do azulejo e fecho com o logo.', faixa([1, 2, 3, 4, 5, 6].map(i => 'carrossel-' + i))));
paginas.push(pagina('Carrossel para cartorários', 'Conteúdo técnico no mesmo visual. Exemplo: Provimento nº 149/2023 do CNJ.', faixa([1, 2, 3, 4, 5, 6, 7].map(i => 'provimento-' + i), 14)));
paginas.push(pagina('Aula semanal · Cartórios na Prática', 'Feed e story com número da aula, tema, convidado, data, Zoom, inscrições e o rodapé com o logo da ANOREG/PE e os parceiros.', `
  <div class="lin" style="gap:70px;align-items:flex-start">${post('aula-feed', 500)}${post('aula-story', 355)}
  <div style="font-size:22px;font-weight:300;line-height:1.6;color:${COR.texto};max-width:520px;padding-top:10px">
    ${['Cartórios na Prática · Programa de Aulas Práticas da ANOREG/PE', 'Aula Nº no azulejo', 'Tema, foto do convidado, nome e currículo', 'Data, horário e “Ao vivo pelo Zoom”', 'Inscrições: Suporte ANOREG/PE (81) 99256-9785', 'Rodapé: ANOREG/PE em destaque; ARPEN-PE, Colégio Notarial do Brasil, Cartórios de Protesto PE e Registro de Imóveis do Brasil'].map(t => `<div style="display:flex;gap:16px;margin-bottom:18px"><span style="width:10px;height:10px;background:${I};margin-top:12px;flex:none"></span><span>${t}</span></div>`).join('')}</div></div>`));
paginas.push(pagina('Notícia, aviso, aniversário e nota de pesar', 'Comunicação do dia a dia da associação. A nota de pesar usa preto e o logo todo branco.', grade([['noticia', 'Notícia'], ['aviso', 'Aviso'], ['aniversario', 'Aniversário'], ['luto', 'Nota de pesar']], 380, 40)));
paginas.push(pagina('Capas de reels e de live', 'Formato 1080×1920. O texto fica no miolo, que é o que aparece na grade do perfil.', grade([['reels-1', 'Reels'], ['reels-2', 'Reels'], ['reels-3', 'Reels'], ['live-1', 'Live'], ['live-2', 'Live']], 300, 36)));
paginas.push(pagina('Capas de destaque', 'Ícone branco num círculo índigo sobre o painel de azulejo. Recorte circular no perfil.', `
  <div class="lin" style="gap:46px;padding-top:40px">${[['institucional', 'Institucional'], ['noticias', 'Notícias'], ['eventos', 'Eventos'], ['servicos', 'Serviços'], ['associados', 'Associados'], ['contato', 'Contato']].map(([k, l]) => `<div style="text-align:center">${circ('destaque-' + k, 230)}<div style="font-size:22px;margin-top:24px">${l}</div></div>`).join('')}</div>`));
paginas.push(pagina('YouTube', 'Banner 2560×1440 com o logo na faixa central, que aparece em todos os aparelhos, e foto de perfil.', `
  <div class="lin" style="gap:50px">${post('youtube-banner', 1100)}<div>${im('perfil', `width:300px;border-radius:50%;${sombra}`)}<div class="leg" style="text-align:center">Foto de perfil</div></div></div>`));

// 17 fecho
pag++;
paginas.push(`<section class="pg" style="${painel(270)}">
  <div class="abs" style="left:360px;right:360px;top:240px;bottom:240px;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:50px;${sombra}">
    ${logo('cor', 640)}
    <div style="font-size:30px;font-weight:300;color:${COR.texto};text-align:center;line-height:1.5">Identidade visual para as redes sociais<br>Instagram e YouTube</div></div></section>`);

const html = `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap" rel="stylesheet"><style>${css}${numCss}</style></head><body>${paginas.join('')}</body></html>`;
if (pag !== TOTAL) console.log(`! ${pag} páginas, TOTAL diz ${TOTAL}`);
// as páginas viram imagens (o azulejo em vetor deixaria o PDF com dezenas de MB) e o PDF é montado com img2pdf
const browser = await abrirNavegador();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1.5 });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(400);
const dir = path.join(R, 'saida', 'pdf-paginas'); fs.mkdirSync(dir, { recursive: true });
const secs = await page.$$('section.pg');
const jpgs = [];
for (const [i, s] of secs.entries()) { const f = path.join(dir, `${String(i + 1).padStart(2, '0')}.jpg`); jpgs.push(f); await s.screenshot({ path: f, type: 'jpeg', quality: 88 }); }
await browser.close();
const out = path.join(R, 'saida', 'ANOREG-PE-identidade-redes.pdf');
execFileSync('python3', ['-c', 'import img2pdf,sys;open(sys.argv[1],"wb").write(img2pdf.convert(sys.argv[2:],layout_fun=img2pdf.get_fixed_dpi_layout_fun((144,144))))', out, ...jpgs]);
console.log('✓', out, (fs.statSync(out).size / 1e6).toFixed(1) + ' MB,', secs.length, 'páginas');
