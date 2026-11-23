// Base comum dos 10 projetos de identidade visual (rebranding do Instagram da Eduarda Caraciolo).
// Cada projeto é um arquivo idNN-<nome>.mjs que monta as peças em HTML e chama render().
// Saída: saida/<id>/<peça>.png e saida/<id>/_painel.jpg (prancha de contato).
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const req = createRequire(import.meta.url);
let chromium; try { ({ chromium } = req('playwright')); } catch { ({ chromium } = req('/opt/node-tools/node_modules/playwright')); }
export const root = path.dirname(new URL(import.meta.url).pathname);

// Fotos (fora do git). Inteiras: 1067×1600, retrato, fundo do estúdio roxo com parede laranja.
// Recortes sem fundo (PNG): bons em surpresa, joinha, empolgada; a base deles é irregular,
// então deixe a borda de baixo sair da tela ou ficar atrás de um card.
export const FOTOS = ['surpresa', 'falando-neon', 'pensando', 'joinha', 'empolgada', 'explicando'];
export const RECORTES = ['surpresa', 'joinha', 'empolgada'];
export const foto = n => 'file://' + path.join(root, 'fotos', `${n}.jpg`);
export const recorte = n => 'file://' + path.join(root, 'fotos', `${n}-recorte.png`);
export const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const PERFIL = { nome: 'Eduarda Caraciolo', arroba: '@eduardacaraciolo', cargo: 'Advogada · Direito Civil e ECA', prof: 'Professora de Civil para a 2ª fase da OAB' };

// Conteúdo igual em todos os projetos, para comparar as identidades lado a lado. Não altere o sentido jurídico.
export const CONTEUDO = {
  c1: { tipo: 'explicativo', titulo: 'Prescrição x decadência', sub: 'o jeito fácil de não confundir',
    itens: [
      { nome: 'Prescrição', txt: 'Você perde a pretensão: o direito de exigir em juízo.', det: 'Prazos nos arts. 205 e 206 do CC. Pode ser suspensa ou interrompida.', base: 'CC, art. 189' },
      { nome: 'Decadência', txt: 'Você perde o próprio direito (potestativo).', det: 'A legal, em regra, não se suspende nem se interrompe, e o juiz reconhece de ofício.', base: 'CC, arts. 207 e 210' }],
    fim: 'Salva pra revisar e manda pra quem vai fazer a OAB.' },
  c2: { tipo: 'lista', titulo: '4 erros que derrubam a peça de Civil', sub: 'na 2ª fase da OAB',
    itens: ['Errar o endereçamento (juízo competente)', 'Qualificar as partes pela metade', 'Fazer pedido genérico, sem especificar', 'Esquecer o valor da causa'],
    base: 'CPC, arts. 292 e 319', fim: 'Qual desses você já cometeu? Conta nos comentários.' },
  c3: { tipo: 'questao', pergunta: 'O filho fez 18 anos. A pensão acaba automaticamente?', opcoes: ['Certo', 'Errado'], certa: 1,
    resposta: 'Errado. A maioridade não encerra a pensão sozinha: a exoneração depende de decisão judicial, com contraditório.', base: 'Súmula 358 do STJ',
    fim: 'Acertou? Comenta “acertei” e marca quem precisa saber disso.' },
  c4: { tipo: 'mito-verdade', titulo: 'Adoção: mito ou verdade?',
    itens: [
      { frase: 'Pessoa solteira pode adotar.', v: true, txt: 'Podem adotar os maiores de 18 anos, independentemente do estado civil.', base: 'ECA, art. 42' },
      { frase: 'Os avós podem adotar o neto.', v: false, txt: 'Não podem adotar os ascendentes e os irmãos do adotando.', base: 'ECA, art. 42, § 1º' }],
    fim: 'Quer mais mito ou verdade de ECA? Comenta “ECA”.' },
  c5: { tipo: 'apresentacao', titulo: 'Prazer, Eduarda', sub: 'Advogada de Direito Civil e ECA e professora de Civil para a OAB.',
    itens: ['Dicas de peça pra 2ª fase', 'Questões comentadas', 'ECA sem juridiquês', 'Bastidores das aulas'],
    fim: 'Me segue pra estudar Civil comigo.' },
  p1: { tipo: 'frase', frase: 'Peça boa não se decora.', destaque: 'Se entende.' },
  p2: { tipo: 'convite', titulo: 'Qual tema de Civil mais te trava?', txt: 'Comenta aqui embaixo. O mais pedido vira o próximo post.' },
  p3: { tipo: 'dica', titulo: 'Ordem da vocação hereditária', base: 'CC, art. 1.829',
    itens: ['Descendentes, em concorrência com o cônjuge (conforme o regime de bens)', 'Ascendentes, em concorrência com o cônjuge', 'Cônjuge sobrevivente', 'Colaterais (até o 4º grau, art. 1.839)'] },
  s1: { tipo: 'story-caixinha', titulo: 'Me pergunta qualquer coisa sobre ECA' },
  s2: { tipo: 'story-divulga', titulo: 'Post novo no feed', post: 'Prescrição x decadência' },
  destaques: ['Civil', 'ECA', 'OAB', 'Dicas', 'Sobre'],
};

// Peças obrigatórias de cada projeto (nome do arquivo → tamanho):
// 00-identidade (1080×1350: nome/logo, paleta com hex, tipografia, elementos, tom de voz)
// c1-1..c1-3, c2-1..c2-3, c3-1..c3-3, c4-1..c4-3, c5-1..c5-3 (1080×1350: capa, interna, fecho)
// p1, p2, p3 (1080×1350) · s1, s2 (1080×1920) · destaques (1080×1080, as 5 capas de destaque) · avatar (1080×1080)
export const PECAS = ['00-identidade', ...[1, 2, 3, 4, 5].flatMap(c => [1, 2, 3].map(s => `c${c}-${s}`)), 'p1', 'p2', 'p3', 's1', 's2', 'destaques', 'avatar'];

// pecas: [{ nome, w, h, html }]; fontes: URL do Google Fonts; css: estilos comuns do projeto.
export async function render(id, pecas, { fontes = '', css = '', filtro = process.argv[2] || '' } = {}) {
  const launch = {};
  if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
  if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
  const browser = await chromium.launch(launch);
  const saida = path.join(root, 'saida', id); fs.mkdirSync(saida, { recursive: true });
  const faltam = PECAS.filter(n => !pecas.some(p => p.nome === n));
  if (faltam.length) console.log(`! faltam peças: ${faltam.join(', ')}`);
  for (const p of pecas) {
    if (filtro && !p.nome.includes(filtro)) continue;
    const page = await browser.newPage({ viewport: { width: p.w, height: p.h } });
    await page.setContent(`<!doctype html><html><head><meta charset="utf-8">${fontes ? `<link href="${fontes}" rel="stylesheet">` : ''}<style>*{box-sizing:border-box;margin:0;padding:0}body{width:${p.w}px;height:${p.h}px;overflow:hidden}${css}</style></head><body>${p.html}</body></html>`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(250);
    const largos = await page.evaluate(() => [...document.querySelectorAll('body *')].filter(e => e.children.length === 0 && e.textContent.trim() && (e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).overflow === 'visible')).map(e => e.textContent.trim().slice(0, 30)));
    const fora = await page.evaluate(([w, h]) => [...document.querySelectorAll('body *')].filter(e => { if (!e.textContent.trim() || e.children.length) return false; const r = e.getBoundingClientRect(); return r.width && (r.right > w + 1 || r.bottom > h + 1 || r.left < -1 || r.top < -1); }).map(e => e.textContent.trim().slice(0, 30)), [p.w, p.h]);
    await page.screenshot({ path: path.join(saida, `${p.nome}.png`) });
    await page.close();
    console.log(`✓ ${p.nome}${largos.length ? `  (texto largo: ${largos.join(' | ')})` : ''}${fora.length ? `  (texto fora da tela: ${fora.join(' | ')})` : ''}`);
  }
  await browser.close();
  if (!filtro) painel(id);
}

// Prancha de contato: identidade + os carrosséis em linhas + posts e cards.
export function painel(id) {
  const py = `
from PIL import Image
import os
d=${JSON.stringify(path.join(root, 'saida', id))}
L=[['00-identidade','p1','p2','p3'],*[[f'c{c}-{s}' for s in (1,2,3)] for c in range(1,6)],['s1','s2','destaques','avatar']]
W=360
rows=[]
for r in L:
  ims=[Image.open(f'{d}/{n}.png').convert('RGB') for n in r if os.path.exists(f'{d}/{n}.png')]
  ims=[i.resize((W,int(i.height*W/i.width))) for i in ims]
  if ims: rows.append(ims)
H=sum(max(i.height for i in r)+16 for r in rows)+16
out=Image.new('RGB',(16+4*(W+16),H),(235,235,235));y=16
for r in rows:
  x=16
  for i in r: out.paste(i,(x,y)); x+=W+16
  y+=max(i.height for i in r)+16
out.save(f'{d}/_painel.jpg',quality=82)`;
  try { execFileSync('python3', ['-c', py]); } catch (e) { console.log('painel não gerado:', e.message); }
}
