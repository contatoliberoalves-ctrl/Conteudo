// Aula "Resolução de Questões Difíceis" (Curso de Aprofundamento na Repescagem · Método VDE) com questões novas,
// no mesmo visual e na mesma dinâmica da aula 01: capa + 4 slides por questão (enunciado, perguntas, gabarito
// comentado, palavras no índice). Slides 720 × 405 pt (16:9), texto em Poppins.
// Fundo e capa (base/capa.jpg, base/fundo.jpg) foram tirados do PDF da aula 01 e ficam fora do git (têm fotos).
// Uso: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node gerar.mjs
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const req = createRequire(import.meta.url);
let chromium; try { ({ chromium } = req('playwright')); } catch { ({ chromium } = req('/opt/node-tools/node_modules/playwright')); }
const root = path.dirname(new URL(import.meta.url).pathname);
const B = n => 'file://' + path.join(root, 'base', n);
const OUT = path.join(root, 'saida'); fs.mkdirSync(OUT, { recursive: true });

const Q = [
  {
    enun: `O Deputado Federal João, no exercício do mandato, foi preso em flagrante pela Polícia Federal pela prática de crime afiançável, sendo imediatamente recolhido à carceragem. A autoridade policial deixou de comunicar a prisão à Câmara dos Deputados, sob o argumento de que a Casa não teria competência para rever atos de natureza policial.
Na mesma semana, Pedro, vereador do Município Alfa, concedeu entrevista a uma rádio do Município Beta, onde estava em viagem particular, e, sem qualquer relação com o seu mandato, imputou fatos ofensivos a um empresário local, que ajuizou ação de reparação de danos.
Pedro e o partido de João procuraram você, como advogado(a), e formularam os questionamentos a seguir.`,
    perg: [`A) A prisão do Deputado Federal João, nas circunstâncias narradas, está de acordo com a Constituição da República? Justifique.`,
      `B) Pedro pode invocar a imunidade parlamentar material para afastar sua responsabilidade pelas declarações feitas no Município Beta? Justifique.`],
    gab: [`A) Não. Desde a expedição do diploma, os membros do Congresso Nacional não poderão ser presos, salvo em flagrante de crime inafiançável, nos termos do Art. 53, §2º, da CRFB/88. Mesmo nesse caso, os autos devem ser remetidos em 24 horas à Casa respectiva, que, pelo voto da maioria de seus membros, resolverá sobre a prisão. Como o crime é afiançável, a prisão é inconstitucional.`,
      `B) Não. A inviolabilidade dos vereadores por suas opiniões, palavras e votos alcança apenas o exercício do mandato e a circunscrição do Município, nos termos do Art. 29, inciso VIII, da CRFB/88. As declarações foram feitas em outro Município e sem relação com o mandato.`],
    indice: ['Imunidade Parlamentar', 'Deputados e Senadores', 'Prisão', 'Vereador', 'Município'],
    leva: 'Isso leva ao Art. 53, §2º e ao Art. 29, inciso VIII.',
  },
  {
    enun: `Diante do aumento de crimes praticados em ambiente virtual, o Presidente da República editou medida provisória que tipificava novas condutas criminosas e aumentava as penas de crimes já existentes no Código Penal, com vigência imediata.
Meses depois, outra medida provisória, que tratava da reorganização de um órgão federal, foi expressamente rejeitada pelo Congresso Nacional. Ainda na mesma sessão legislativa, o Presidente da República editou nova medida provisória com conteúdo idêntico ao da que havia sido rejeitada.
Um partido político com representação no Congresso Nacional procurou você, como advogado(a), e formulou os questionamentos a seguir.`,
    perg: [`A) É constitucional a medida provisória que tipifica novas condutas criminosas e aumenta penas? Justifique.`,
      `B) O Presidente da República pode reeditar, na mesma sessão legislativa, medida provisória que foi rejeitada pelo Congresso Nacional? Justifique.`],
    gab: [`A) Não. É vedada a edição de medidas provisórias sobre matéria relativa a direito penal, processual penal e processual civil, nos termos do Art. 62, §1º, inciso I, alínea b, da CRFB/88. Por isso, a medida provisória é formalmente inconstitucional.`,
      `B) Não. É vedada a reedição, na mesma sessão legislativa, de medida provisória que tenha sido rejeitada ou que tenha perdido sua eficácia por decurso de prazo, nos termos do Art. 62, §10, da CRFB/88.`],
    indice: ['Medida Provisória', 'Direito Penal', 'Sessão Legislativa', 'Presidente da República', 'Processo Legislativo'],
    leva: 'Isso leva ao Art. 62, §1º, inciso I, alínea b, e ao Art. 62, §10.',
  },
  {
    enun: `Os servidores públicos civis do Estado Alfa pretendem deflagrar greve por reajuste salarial, mas o Estado sustenta que o movimento seria ilegal, pois até hoje não foi editada a lei específica que regulamenta o exercício do direito de greve no serviço público. Diante disso, o sindicato que representa a categoria pretende buscar, no Poder Judiciário, uma solução para a falta da norma.
Ao mesmo tempo, policiais militares do mesmo Estado anunciaram que aderirão ao movimento, paralisando suas atividades até o atendimento das reivindicações.
O sindicato procurou você, como advogado(a), e formulou os questionamentos a seguir.`,
    perg: [`A) Qual é a medida judicial adequada para suprir a ausência da lei que regulamenta a greve dos servidores públicos, e o sindicato tem legitimidade para propô-la? Justifique.`,
      `B) Os policiais militares podem aderir à greve? Justifique.`],
    gab: [`A) O mandado de injunção, cabível sempre que a falta de norma regulamentadora tornar inviável o exercício de direitos e liberdades constitucionais, nos termos do Art. 5º, inciso LXXI, da CRFB/88. O direito de greve dos servidores será exercido nos termos e limites definidos em lei específica (Art. 37, inciso VII). O sindicato tem legitimidade para impetrar mandado de injunção coletivo, conforme o Art. 12, inciso III, da Lei nº 13.300/16.`,
      `B) Não. Ao militar são proibidas a sindicalização e a greve, nos termos do Art. 142, §3º, inciso IV, da CRFB/88, aplicável aos militares dos Estados por força do Art. 42, §1º.`],
    indice: ['Mandado de Injunção', 'Greve', 'Servidor Público', 'Militares', 'Sindicato'],
    leva: 'Isso leva ao Art. 5º, inciso LXXI, ao Art. 37, inciso VII, e ao Art. 142, §3º, inciso IV.',
  },
  {
    enun: `Carlos, nascido em Portugal, naturalizou-se brasileiro em 2015 e construiu carreira jurídica de destaque no Brasil. Em 2026, o Presidente da República anunciou a intenção de nomeá-lo Ministro do Supremo Tribunal Federal.
Pouco depois, o Governo de Portugal formulou pedido de extradição de Carlos, imputando-lhe crime de estelionato que teria sido praticado em Lisboa em 2019, quando ele já era brasileiro naturalizado. Não há qualquer imputação relacionada ao tráfico ilícito de entorpecentes.
Carlos procurou você, como advogado(a), e formulou os questionamentos a seguir.`,
    perg: [`A) Carlos pode ser nomeado Ministro do Supremo Tribunal Federal? Justifique.`,
      `B) O Brasil pode conceder a extradição de Carlos pelo crime narrado? Justifique.`],
    gab: [`A) Não. O cargo de Ministro do Supremo Tribunal Federal é privativo de brasileiro nato, nos termos do Art. 12, §3º, inciso IV, da CRFB/88. Por ser naturalizado, Carlos não pode ocupá-lo.`,
      `B) Não. Nenhum brasileiro será extraditado, salvo o naturalizado, em caso de crime comum praticado antes da naturalização, ou de comprovado envolvimento em tráfico ilícito de entorpecentes, nos termos do Art. 5º, inciso LI, da CRFB/88. O crime foi praticado depois da naturalização e não envolve tráfico, de modo que a extradição não é possível.`],
    indice: ['Nacionalidade', 'Brasileiro Nato', 'Brasileiro Naturalizado', 'Extradição', 'Supremo Tribunal Federal'],
    leva: 'Isso leva ao Art. 12, §3º, inciso IV, e ao Art. 5º, inciso LI.',
  },
  {
    enun: `A Assembleia Legislativa do Estado Alfa instaurou Comissão Parlamentar de Inquérito para apurar desvios de recursos em contratos de obras públicas. No curso das investigações, a CPI determinou, por decisão fundamentada e aprovada pela maioria de seus membros, a quebra do sigilo bancário de empresários investigados.
Em seguida, a mesma CPI expediu mandado de busca e apreensão a ser cumprido no domicílio de um dos investigados, sem qualquer autorização judicial, alegando que possui poderes de investigação próprios das autoridades judiciais.
O investigado procurou você, como advogado(a), e formulou os questionamentos a seguir.`,
    perg: [`A) A CPI estadual pode determinar, por ato próprio, a quebra do sigilo bancário dos investigados? Justifique.`,
      `B) A CPI pode determinar a busca e apreensão domiciliar sem autorização judicial? Justifique.`],
    gab: [`A) Sim. As comissões parlamentares de inquérito têm poderes de investigação próprios das autoridades judiciais, nos termos do Art. 58, §3º, da CRFB/88, o que inclui a quebra de sigilo bancário por decisão fundamentada. Por simetria, o Supremo Tribunal Federal reconhece esse poder também às CPIs estaduais.`,
      `B) Não. A busca e apreensão domiciliar está submetida à reserva de jurisdição, pois a casa é asilo inviolável do indivíduo e só se pode nela penetrar, durante o dia, por determinação judicial, nos termos do Art. 5º, inciso XI, da CRFB/88. A CPI não pode praticar esse ato.`],
    indice: ['Comissão Parlamentar de Inquérito', 'Sigilo', 'Domicílio', 'Casa', 'Assembleia Legislativa'],
    leva: 'Isso leva ao Art. 58, §3º, e ao Art. 5º, inciso XI.',
  },
];

const P = "font-family:'Poppins',sans-serif";
const quadro = html => `<section style="position:relative;width:960px;height:540px;overflow:hidden;background:url('${B('fundo.jpg')}') center/cover;page-break-after:always">
  <div style="position:absolute;left:50px;right:50px;top:72px;bottom:40px;display:flex;flex-direction:column;justify-content:flex-start;color:#3d3d3d">${html}</div></section>`;
const par = (t, ex = '') => t.split('\n').map(l => `<p style="margin:0;${P};text-align:justify;${ex}">${l}</p>`).join('');
const slides = [`<section style="width:960px;height:540px;background:url('${B('capa.jpg')}') center/cover;page-break-after:always"></section>`];
Q.forEach((q, i) => {
  const n = String(i + 1).padStart(2, '0');
  const [l1, ...resto] = q.enun.split('\n');
  slides.push(quadro(par(`QUESTÃO ${n} - ${l1}\n${resto.join('\n')}`, `font-weight:700;font-size:${q.enun.length > 820 ? 19.5 : 21}px;line-height:1.36`)));
  slides.push(quadro(q.perg.map(p => par(p, 'font-weight:400;font-size:22px;line-height:1.4')).join('<div style="height:22px"></div>')));
  slides.push(quadro(`<div style="${P};font-weight:800;font-size:33px;color:#5A169F;margin-bottom:4px">GABARITO COMENTADO</div>` +
    q.gab.map(g => par(g, `font-weight:400;font-size:${q.gab.join('').length > 650 ? 18.5 : 20}px;line-height:1.42`)).join('<div style="height:18px"></div>')));
  slides.push(quadro(`<div style="${P};font-weight:800;font-size:33px;color:#5A169F;margin-bottom:10px">PALAVRAS NO ÍNDICE</div>
    <ul style="margin:0 0 0 22px;padding:0;${P};font-size:20px;line-height:1.55">${q.indice.map(t => `<li>${t}</li>`).join('')}</ul>
    <p style="margin:28px 0 0;${P};font-size:20px">${q.leva}</p>`));
});
const html = `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;800&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box}body{margin:0}@page{size:960px 540px;margin:0}section:last-child{page-break-after:auto}</style></head><body>${slides.join('')}</body></html>`;
const arq = path.join(OUT, 'aula.html'); fs.writeFileSync(arq, html);
const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors', '--allow-file-access-from-files'] });
const browser = await chromium.launch(launch);
const page = await browser.newPage({ viewport: { width: 960, height: 540 }, deviceScaleFactor: 2 });
await page.goto('file://' + arq); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(500);
// confere se algum texto passou do quadro branco
const estouro = await page.evaluate(() => [...document.querySelectorAll('section > div')].map((d, i) => d.scrollHeight > d.clientHeight + 2 ? i : -1).filter(i => i >= 0));
if (estouro.length) console.log('! texto passou do quadro nos slides', estouro.map(i => i + 2).join(', '));
await page.pdf({ path: path.join(OUT, 'Resolucao-de-Questoes-Dificeis-02.pdf'), width: '960px', height: '540px', printBackground: true });
const secs = await page.$$('section');
for (let i = 0; i < secs.length; i++) await secs[i].screenshot({ path: path.join(OUT, `${String(i + 1).padStart(2, '0')}.png`) });
await browser.close();
console.log('✓', secs.length, 'slides');
