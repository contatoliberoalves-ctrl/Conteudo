// PTT "Cidadania digital e acessibilidade" (Mestrado Profissional em Direito e Inovação, UNICAP) na identidade do Líbero:
// azul #0B4FD8 → marinho, off-white, títulos em Playfair Display e texto em Poppins, como na apresentação da defesa.
// Logo da UNICAP em assets/unicap-branco.png (fora do git; baixado do portal.unicap.br).
// Uso: node gerar.mjs   (nuvem: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node gerar.mjs)
// Saída: saida/1.png … saida/7.png e saida/PTT-cidadania-digital-e-acessibilidade.pdf
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const req = createRequire(import.meta.url);
let chromium; try { ({ chromium } = req('playwright')); } catch { ({ chromium } = req('/opt/node-tools/node_modules/playwright')); }
const root = path.dirname(new URL(import.meta.url).pathname);

const AZUL = '#0B4FD8', AZUL2 = '#0839A8', NAVY = '#14213A', OFF = '#F4F5F8', CINZA = '#5B6478', LINHA = '#DCE1EA', CLARO = '#EAF0FD', ALERTA = '#D6344A';
const GRAD = `linear-gradient(135deg,#1A56E6 0%,${AZUL} 35%,${AZUL2} 70%,#0A2470 100%)`;
const FONTES = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,500&family=Poppins:wght@400;500;600&display=swap';
const T = "font-family:'Playfair Display',serif;font-weight:700;letter-spacing:-.01em";
const P = "font-family:'Poppins',sans-serif";
const LOGO = 'data:image/png;base64,' + fs.readFileSync(path.join(root, 'assets', 'unicap-branco.png')).toString('base64');
// Logo branco (fundo azul) ou pintado de marinho (fundo claro) por máscara.
const logo = (h, cor = '#fff') => cor === '#fff'
  ? `<img src="${LOGO}" style="height:${h}px;display:block">`
  : `<span style="display:block;height:${h}px;width:${h * 264 / 101}px;background:${cor};-webkit-mask:url(${LOGO}) left center/contain no-repeat;mask:url(${LOGO}) left center/contain no-repeat"></span>`;
const M = 130, W = 1920, H = 1080;
const kick = (s, cor = AZUL) => `<div style="${P};font-weight:600;font-size:20px;letter-spacing:.22em;text-transform:uppercase;color:${cor}">${s}</div>`;
const num = (n, px = 56) => `<span style="flex:none;width:${px}px;height:${px}px;border-radius:${px * .22}px;background:${AZUL};color:#fff;display:grid;place-items:center;${P};font-weight:600;font-size:${px * .38}px">${n}</span>`;
const AUTOR = 'Líbero Alves Rodrigues Filho <span style="opacity:.5;margin:0 10px">·</span> Orientação: Profa. Dra. Paloma Mendes Saldanha';
const rodape = (n, escuro = false) => `<div style="position:absolute;left:${M}px;right:${M}px;bottom:56px;display:flex;justify-content:space-between;align-items:center">
  <span style="${P};font-size:18px;color:${escuro ? 'rgba(255,255,255,.7)' : CINZA}">Cidadania digital e acessibilidade</span>
  <div style="display:flex;align-items:center;gap:28px">${logo(44, escuro ? '#fff' : NAVY)}<span style="${P};font-weight:500;font-size:18px;color:${escuro ? 'rgba(255,255,255,.7)' : CINZA}">${String(n).padStart(2, '0')}</span></div></div>`;
const tela = (bg, corpo) => `<div style="position:relative;width:${W}px;height:${H}px;overflow:hidden;background:${bg}">${corpo}</div>`;
const cabeca = (titulo, sub, kicker) => `<div style="position:absolute;left:${M}px;right:${M}px;top:110px">${kicker ? kick(kicker) : ''}
  <div style="${T};font-size:68px;line-height:1.08;color:${NAVY};margin-top:${kicker ? 18 : 0}px">${titulo}</div>
  <div style="${P};font-size:26px;color:${CINZA};margin-top:16px">${sub}</div></div>`;

const S = [];
// 0 · Capa, no molde da capa da defesa: centralizada, UNICAP no alto, nome e orientação embaixo
S.push(tela(GRAD, `
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:#fff">
    <div style="display:flex;align-items:center;gap:30px">${logo(78)}<span style="width:1px;height:60px;background:rgba(255,255,255,.35)"></span>
      <span style="${P};font-size:20px;line-height:1.5;color:rgba(255,255,255,.85);text-align:left">PPGDI<br>Mestrado Profissional em Direito e Inovação</span></div>
    <div style="margin-top:90px">${kick('Produto técnico-tecnológico', 'rgba(255,255,255,.75)')}</div>
    <div style="${T};font-size:128px;line-height:1.04;margin-top:30px">Cidadania digital<br>e acessibilidade</div>
    <div style="width:90px;height:2px;background:rgba(255,255,255,.5);margin:44px 0 36px"></div>
    <div style="${T};font-weight:500;font-style:italic;font-size:36px;color:rgba(255,255,255,.9)">Análise do aplicativo Cidadão PE a partir do modelo MAAD</div>
    <div style="${P};font-weight:600;font-size:30px;margin-top:90px">Líbero Alves Rodrigues Filho</div>
    <div style="${P};font-size:22px;color:rgba(255,255,255,.75);margin-top:12px">Orientação: Profa. Dra. Paloma Mendes Saldanha</div>
    <div style="${P};font-size:20px;color:rgba(255,255,255,.6);margin-top:8px">Linha de pesquisa: Instituições, Inovações de Mercado e Tecnologia</div></div>`));
// 1 · Resumo do produto
S.push(tela('#fff', `
  <div style="position:absolute;left:${M}px;top:96px;right:${M}px;display:flex;justify-content:space-between;align-items:flex-start">
    <div>${kick('Produto técnico-tecnológico')}<div style="${T};font-size:72px;line-height:1.05;color:${NAVY};margin-top:18px">Cidadania digital e acessibilidade</div>
      <div style="${P};font-size:26px;color:${CINZA};margin-top:14px">Análise do aplicativo Cidadão PE a partir do modelo MAAD</div></div>
    ${logo(64, NAVY)}</div>
  <div style="position:absolute;left:${M}px;top:340px;width:920px;display:flex;flex-direction:column;gap:36px">
    ${[['Problema', 'Uma pessoa com deficiência consegue localizar, solicitar e concluir um serviço público pelo Cidadão PE com autonomia?'],
      ['Produto desenvolvido', 'Relatório técnico com 32 critérios em seis dimensões. Cada nota de 0 a 3 é vinculada à evidência do teste. A auditoria usou o VoiceOver no iOS.'],
      ['Aplicação na advocacia', 'Documentar a barreira, relacioná-la ao critério de acessibilidade e fundamentar uma correção que permita concluir o serviço.']]
      .map(([t, s], i) => `<div style="display:flex;gap:28px">${num('0' + (i + 1), 52)}<div><div style="${P};font-weight:600;font-size:26px;color:${AZUL}">${t}</div><div style="${P};font-size:25px;line-height:1.48;color:${NAVY};margin-top:6px">${s}</div></div></div>`).join('')}</div>
  <div style="position:absolute;right:${M}px;top:330px;width:620px;height:600px;background:${GRAD};border-radius:28px;padding:60px 56px;color:#fff;display:flex;flex-direction:column">
    ${kick('Índice geral de conformidade', 'rgba(255,255,255,.75)')}
    <div style="${T};font-size:150px;line-height:1;margin-top:20px">47,9%</div>
    <div style="${P};font-weight:500;font-size:30px;margin-top:22px">46 de 96 pontos</div>
    <div style="margin-top:22px"><span style="${P};font-weight:600;font-size:22px;background:#fff;color:${ALERTA};padding:10px 22px;border-radius:999px">Faixa C · Baixa acessibilidade</span></div>
    <div style="${P};font-size:23px;line-height:1.5;color:rgba(255,255,255,.88);margin-top:auto;padding-top:28px">Ícones sem descrição, falhas sem orientação e serviços que dependiam de outros canais.</div></div>
  <div style="position:absolute;left:${M}px;right:${M}px;bottom:56px;${P};font-size:18px;line-height:1.7;color:${CINZA}">${AUTOR}<br>PPGDI/UNICAP <span style="opacity:.5;margin:0 10px">·</span> Linha de pesquisa: Instituições, Inovações de Mercado e Tecnologia</div>`));

// 2 · Capa
S.push(tela(GRAD, `
  <div style="position:absolute;right:-120px;bottom:-260px;${T};font-size:900px;line-height:1;color:rgba(255,255,255,.05)">?</div>
  <div style="position:absolute;left:${M}px;top:96px;display:flex;align-items:center;gap:30px">${logo(70)}<span style="width:1px;height:56px;background:rgba(255,255,255,.35)"></span>
    <span style="${P};font-size:20px;line-height:1.5;color:rgba(255,255,255,.85)">PPGDI<br>Mestrado Profissional em Direito e Inovação</span></div>
  <div style="position:absolute;left:${M}px;top:330px;width:1300px">${kick('Produto técnico-tecnológico', 'rgba(255,255,255,.75)')}
    <div style="${T};font-size:132px;line-height:1.02;color:#fff;margin-top:22px">Cidadania digital<br>e acessibilidade</div>
    <div style="${T};font-weight:500;font-style:italic;font-size:38px;color:rgba(255,255,255,.88);margin-top:26px">Avaliação do aplicativo Cidadão PE pelo modelo MAAD</div></div>
  <div style="position:absolute;left:${M}px;top:820px;width:1100px;${P};font-size:30px;line-height:1.45;color:#fff;padding-left:28px;border-left:3px solid rgba(255,255,255,.5)">Uma pessoa que usa leitor de tela consegue chegar ao fim de um serviço público pelo aplicativo?</div>
  <div style="position:absolute;left:${M}px;bottom:56px;${P};font-size:19px;color:rgba(255,255,255,.75)">${AUTOR}</div>`));

// 3 · Como o MAAD transforma testes em notas
S.push(tela(OFF, `${cabeca('Como o MAAD transforma testes em notas', 'Modelo de Avaliação de Acessibilidade Digital', 'Método')}
  <div style="position:absolute;left:${M}px;right:${M}px;top:400px;display:grid;grid-template-columns:repeat(4,1fr);gap:28px">
    ${[['Mapear', 'Telas, formulários e etapas dos serviços.'], ['Testar', 'Navegação, ordem do foco e anúncio de elementos com o VoiceOver.'], ['Registrar', 'Tela, etapa do serviço e comportamento observado.'], ['Pontuar', 'Atribuir de 0 a 3 por critério e consolidar o diagnóstico.']]
      .map(([t, s], i) => `<div style="background:#fff;border-radius:24px;padding:44px 38px;height:330px;box-shadow:0 20px 50px -30px rgba(20,33,58,.25)">${num('0' + (i + 1))}
        <div style="${T};font-size:40px;color:${NAVY};margin-top:34px">${t}</div><div style="${P};font-size:23px;line-height:1.5;color:${CINZA};margin-top:14px">${s}</div></div>`).join('')}</div>
  <div style="position:absolute;left:${M}px;right:${M}px;top:790px;background:${CLARO};border-radius:24px;padding:36px 44px;display:flex;align-items:center;gap:40px">
    <div style="${T};font-size:46px;color:${AZUL};white-space:nowrap">32 critérios em 6 dimensões</div>
    <div style="${P};font-size:23px;line-height:1.45;color:${NAVY}">Referências da matriz: WCAG 2.2, eMAG 3.1 e Lei Brasileira de Inclusão, entre outras.</div></div>
  ${rodape(4)}`));

// 4 · Resultado
const dims = [['Perceptiva', 2, 15], ['Operacional', 10, 15], ['Cognitiva', 9, 15], ['Informacional', 10, 18], ['Cidadania digital', 8, 18], ['Conformidade jurídica', 7, 15]];
S.push(tela('#fff', `${cabeca('Resultado da avaliação do Cidadão PE', 'Índice Geral de Conformidade na versão auditada', 'Resultado')}
  <div style="position:absolute;left:${M}px;top:390px;width:560px">
    <div style="${T};font-size:180px;line-height:1;color:${AZUL}">47,9%</div>
    <div style="margin-top:44px"><span style="${P};font-weight:600;font-size:22px;background:#FCE8EB;color:${ALERTA};padding:10px 22px;border-radius:999px">Faixa C · Baixa acessibilidade</span></div>
    <div style="${P};font-size:27px;color:${NAVY};margin-top:30px">46 pontos obtidos de 96 possíveis</div>
    <div style="${P};font-size:22px;color:${CINZA};margin-top:14px">Cálculo do índice: (46 ÷ 96) × 100</div></div>
  <div style="position:absolute;left:820px;right:${M}px;top:390px">
    <div style="${P};font-weight:600;font-size:22px;letter-spacing:.06em;color:${CINZA};margin-bottom:22px">Pontuação por dimensão</div>
    ${dims.map(([n, v, m]) => `<div style="display:grid;grid-template-columns:300px 1fr 110px;align-items:center;gap:26px;padding:16px 0">
      <span style="${P};font-weight:${v === 2 ? 600 : 500};font-size:24px;color:${NAVY}">${n}</span>
      <span style="height:18px;border-radius:9px;background:${OFF};overflow:hidden"><span style="display:block;height:100%;width:${v / m * 100}%;background:${v === 2 ? ALERTA : AZUL};border-radius:9px"></span></span>
      <span style="${P};font-weight:600;font-size:24px;color:${NAVY};text-align:right">${v} / ${m}</span></div>`).join('')}</div>
  <div style="position:absolute;left:${M}px;right:${M}px;bottom:120px;${P};font-size:19px;color:${CINZA}">As barras usam o máximo de cada dimensão. A versão auditada é o recorte do estudo.</div>
  ${rodape(5)}`));

// 5 · Barreiras
const barreiras = [['Leitura de ícones', 'O VoiceOver ignorava ícones sem descrição ou anunciava um rótulo genérico.', 'A pessoa pode ouvir um elemento sem saber qual ação ele executa.'],
  ['Falhas do sistema', 'Em erros e travamentos, o aplicativo nem sempre explicava o ocorrido.', 'Fica difícil decidir se é possível retomar a solicitação ou se é preciso reiniciá-la.'],
  ['Saída do aplicativo', 'Alguns serviços exigiam site externo ou atendimento presencial.', 'Quando não há aviso de saída, a mudança de ambiente dificulta seguir o atendimento.']];
S.push(tela(OFF, `${cabeca('Onde a navegação perde autonomia', 'Três barreiras registradas na auditoria', 'Diagnóstico')}
  <div style="position:absolute;left:${M}px;right:${M}px;top:390px">
    <div style="display:grid;grid-template-columns:420px 1fr 1fr;gap:40px;padding:0 40px 18px">${['Etapa', 'O que apareceu no teste', 'Efeito para quem usa o serviço'].map(s => `<span style="${P};font-weight:600;font-size:19px;letter-spacing:.14em;text-transform:uppercase;color:${AZUL}">${s}</span>`).join('')}</div>
    <div style="display:flex;flex-direction:column;gap:16px">${barreiras.map(([e, o, f], i) => `<div style="background:#fff;border-radius:22px;padding:36px 40px;display:grid;grid-template-columns:420px 1fr 1fr;gap:40px;align-items:start">
      <div style="display:flex;gap:22px;align-items:center">${num(['i', 'ii', 'iii'][i], 48)}<span style="${T};font-size:32px;color:${NAVY}">${e}</span></div>
      <span style="${P};font-size:23px;line-height:1.5;color:${NAVY}">${o}</span><span style="${P};font-size:23px;line-height:1.5;color:${CINZA}">${f}</span></div>`).join('')}</div></div>
  <div style="position:absolute;left:${M}px;right:${M}px;bottom:120px;${P};font-size:19px;color:${CINZA}">Em boa parte dos fluxos, o leitor de tela conseguia identificar textos, botões e campos.</div>
  ${rodape(6)}`));

// 6 · Aplicação na advocacia
const passos = [['Ocorrência', 'Ícone de ação em um fluxo de serviço, sem nome que indique sua função ao leitor de tela.'],
  ['Evidência', 'Identificar a tela e o passo do serviço. Registrar com captura ou vídeo o que o VoiceOver anuncia.'],
  ['Ajuste e verificação', 'Dar ao controle um nome que descreva a ação. Repetir a navegação e testar se a pessoa consegue prosseguir.']];
S.push(tela('#fff', `${cabeca('Aplicação na advocacia', 'Como documentar uma barreira de acessibilidade digital', 'Prática')}
  <div style="position:absolute;left:${M}px;right:${M}px;top:400px;display:grid;grid-template-columns:repeat(3,1fr);gap:28px">
    ${passos.map(([t, s], i) => `<div style="position:relative;background:${i === 2 ? GRAD : OFF};border-radius:24px;padding:46px 42px;height:400px">
      <div style="${P};font-weight:600;font-size:20px;letter-spacing:.2em;color:${i === 2 ? 'rgba(255,255,255,.75)' : AZUL}">PASSO 0${i + 1}</div>
      <div style="${T};font-size:42px;color:${i === 2 ? '#fff' : NAVY};margin-top:22px">${t}</div>
      <div style="${P};font-size:24px;line-height:1.5;color:${i === 2 ? 'rgba(255,255,255,.9)' : CINZA};margin-top:18px">${s}</div></div>`).join('')}</div>
  <div style="position:absolute;left:${M}px;right:${M}px;bottom:120px;${P};font-size:21px;color:${NAVY}">O registro pode instruir um parecer, um pedido de adequação ou o acompanhamento da correção.</div>
  ${rodape(7)}`));

// 7 · Plano de adequação progressiva
S.push(tela(GRAD, `
  <div style="position:absolute;left:${M}px;right:${M}px;top:110px">${kick('Plano de adequação progressiva', 'rgba(255,255,255,.75)')}
    <div style="${T};font-size:68px;line-height:1.08;color:#fff;margin-top:18px">Indicadores para acompanhar as correções</div></div>
  <div style="position:absolute;left:${M}px;right:${M}px;top:380px;display:grid;grid-template-columns:1fr 1fr;gap:40px">
    ${[['6 meses', '100%', 'dos elementos gráficos com texto alternativo'], ['24 meses', '75%', 'de conformidade global, a partir de uma linha de base de 47,9%']].map(([p, n, t]) => `<div style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.18);border-radius:28px;padding:48px 52px">
      <div style="${P};font-weight:600;font-size:22px;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.75)">${p}</div>
      <div style="${T};font-size:170px;line-height:.95;color:#fff;margin-top:18px">${n}</div>
      <div style="${P};font-size:27px;line-height:1.45;color:rgba(255,255,255,.9);margin-top:20px">${t}</div></div>`).join('')}</div>
  <div style="position:absolute;left:${M}px;right:${M}px;top:870px;${P};font-size:24px;color:#fff"><b style="font-weight:600">Prioridades:</b> descrever ícones, orientar em caso de erro e avisar antes de abrir um site externo.</div>
  ${rodape(8, true)}`));

const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
const saida = path.join(root, 'saida'); fs.mkdirSync(saida, { recursive: true });
const doc = s => `<!doctype html><html><head><meta charset="utf-8"><link href="${FONTES}" rel="stylesheet"><style>*{box-sizing:border-box;margin:0;padding:0;font-variant-numeric:lining-nums}@page{size:${W}px ${H}px;margin:0}body>div{page-break-after:always}</style></head><body>${s}</body></html>`;
for (const [i, s] of S.entries()) {
  const hp = path.join(saida, `.${i + 1}.html`); fs.writeFileSync(hp, doc(s));
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.goto('file://' + hp, { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(saida, `${i + 1}.png`) }); await page.close(); console.log('✓', i + 1);
}
const hp = path.join(saida, '.todos.html'); fs.writeFileSync(hp, doc(S.join('')));
const page = await browser.newPage(); await page.goto('file://' + hp, { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready);
await page.pdf({ path: path.join(saida, 'PTT-cidadania-digital-e-acessibilidade.pdf'), width: `${W}px`, height: `${H}px`, printBackground: true });
await browser.close(); console.log('✓ pdf');
