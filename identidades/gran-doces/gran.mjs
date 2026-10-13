// Identidade visual da confeitaria Gran Doces: logos (com e sem a galinha), paletas (ano todo e Natal),
// posts de produto, stories, embalagens, cardápio de Natal (PDF A4) e pranchas do manual.
// Uso: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node gran.mjs
// Precisa de assets/galinha.png (máscara da mascote) e assets/fotos/*.jpg (fotos de exemplo, CREDITOS.md): fora do git.
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const root = path.dirname(new URL(import.meta.url).pathname);
const { chromium } = createRequire(path.join(root, '../../moldes/treino-de-pecas/package.json'))('playwright');
const OUT = path.join(root, 'saida'), BUILD = path.join(root, 'build');
fs.rmSync(OUT, { recursive: true, force: true });
for (const d of ['logos', 'pecas', 'cardapio', 'pranchas']) fs.mkdirSync(path.join(OUT, d), { recursive: true });
fs.mkdirSync(BUILD, { recursive: true });

const GAL = 'data:image/png;base64,' + fs.readFileSync(path.join(root, 'assets/galinha.png')).toString('base64');
const FOTO = n => 'file://' + path.join(root, 'assets/fotos', n + '.jpg');
const C = {
  azul: '#0A62E8', noite: '#0B2B6E', creme: '#FCEEDF', caramelo: '#C9853E', rosa: '#F4B6C6', cacau: '#3B2418',
  vermelho: '#B5172E', vinho: '#6D0F1E', verde: '#114E3B', pinheiro: '#0A3328', dourado: '#C9A35B', ouro: '#E8CF95',
};
const HEAD = `<meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT@9..144,500..900,100&family=DM+Sans:wght@400;500;700&family=Pinyon+Script&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box;margin:0}body{font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased}.f{font-family:Fraunces,serif;font-variation-settings:'SOFT' 100}.s{font-family:'Pinyon Script',cursive;font-weight:400}</style>`;
const gal = (cor, px, extra = '') => `<span style="display:block;flex:none;width:${px * .876}px;height:${px}px;background:${cor};-webkit-mask:url(${GAL}) center/contain no-repeat;mask:url(${GAL}) center/contain no-repeat;${extra}"></span>`;
let uid = 0;
// Selo circular: texto em volta e, no meio, o monograma GD ou a galinha.
const selo = (px, cor, fundo, { meio = 'gd', texto = 'CONFEITARIA ARTESANAL · GRAN DOCES · ' } = {}) => {
  const id = 'c' + (++uid);
  return `<div style="position:relative;width:${px}px;height:${px}px;border-radius:50%;background:${fundo};flex:none">
    <svg viewBox="0 0 400 400" style="position:absolute;inset:0;width:100%;height:100%"><defs><path id="${id}" d="M200,200 m-150,0 a150,150 0 1,1 300,0 a150,150 0 1,1 -300,0"/></defs>
      <circle cx="200" cy="200" r="188" fill="none" stroke="${cor}" stroke-width="4"/><circle cx="200" cy="200" r="112" fill="none" stroke="${cor}" stroke-width="2"/>
      <text fill="${cor}" font-family="DM Sans" font-weight="700" font-size="27" letter-spacing="7.4"><textPath href="#${id}">${texto}</textPath></text></svg>
    <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">${meio === 'gd'
      ? `<span class="f" style="font-weight:900;font-size:${px * .27}px;line-height:1;color:${cor};letter-spacing:-.04em">GD</span>`
      : gal(cor, px * .4)}</div></div>`;
};
// Logotipo: "Gran Doces" em Fraunces macia + "confeitaria" espaçado. Com ou sem a galinha.
const marca = (s, cor, { sub = 'CONFEITARIA', subCor = cor } = {}) => `<div style="display:inline-flex;flex-direction:column;align-items:center;color:${cor};line-height:1">
  <div class="f" style="font-weight:900;font-size:${s}px;letter-spacing:-.035em;line-height:.9;white-space:nowrap">Gran Doces</div>
  ${sub ? `<div style="font-weight:700;font-size:${s * .17}px;letter-spacing:.42em;margin:${s * .16}px -.42em 0 0;color:${subCor}">${sub}</div>` : ''}</div>`;
const logoH = (s, cor, galCor = cor, sub) => `<div style="display:inline-flex;align-items:center;gap:${s * .32}px">${gal(galCor, s * 1.7)}${marca(s, cor, { sub })}</div>`;
const logoV = (s, cor, galCor = cor, sub) => `<div style="display:inline-flex;flex-direction:column;align-items:center;gap:${s * .3}px">${gal(galCor, s * 2.1)}${marca(s, cor, { sub })}</div>`;
const estrela = (px, cor, extra = '') => `<svg viewBox="0 0 24 24" style="width:${px}px;height:${px}px;flex:none;${extra}"><path d="M12 1l2.6 7.9H23l-6.8 4.9 2.6 8-6.8-5-6.8 5 2.6-8L1 8.9h8.4z" fill="${cor}"/></svg>`;
const ceu = (cor, n = 26, w = 1080, h = 1350, seed = 7) => { let r = seed, o = ''; const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280; for (let i = 0; i < n; i++) o += estrela(10 + rnd() * 22, cor, `position:absolute;left:${rnd() * w}px;top:${rnd() * h}px;opacity:${.25 + rnd() * .5}`); return o; };
const preco = 'R$ 00,00';
const box = (w, h, bg, html) => `<div style="position:relative;width:${w}px;height:${h}px;overflow:hidden;background:${bg}">${html}</div>`;

// ---------- Produtos (textos da Gran Doces; preços para preencher) ----------
const PROD = {
  brownietone: { nome: 'Brownietone Clássico', foto: 'brownietone', peso: '1,2 kg', desc: 'Brownie molhadinho em formato de panetone, recheado com brigadeiro cremoso e finalizado com chocolate crocante.' },
  pistache: { nome: 'Brownietone de Pistache', foto: 'fatia', peso: '1,2 kg', desc: 'Nosso brownie com creme de pistache crocante, brigadeiro branco e pistaches por cima.' },
  panetone: { nome: 'Mini Panetone Artesanal', foto: 'panetone', peso: '150 g', desc: 'Massa macia de fermentação natural, em dois sabores: pistache com chocolate branco ou chocolate com avelã.' },
  bombons: { nome: 'Caixa de Bombons', foto: 'bombons', peso: '12 unidades', desc: 'Bombons sortidos de chocolate ao leite, meio amargo e branco, com recheios da casa.' },
  biscoitos: { nome: 'Lata de Biscoitos Natalinos', foto: 'biscoitos', peso: '15 biscoitos', desc: 'Amanteigados em formato de estrela, pinheiro e boneco de gengibre, que derretem na boca.' },
  cesta: { nome: 'Cesta Noite Feliz', foto: 'presente', peso: 'presente pronto', desc: '1 mini brownietone, 1 lata de biscoitos natalinos, 4 bombons e cartão personalizado.' },
  torta: { nome: 'Torta Brownie', foto: 'brownies', peso: '10 fatias', desc: 'Brownie úmido coberto com brigadeiro cremoso. Pode levar topo de Feliz Natal.' },
  bolo: { nome: 'Bolo Chocolate & Frutas Vermelhas', foto: 'bolo', peso: '15 fatias', desc: 'Massa de cacau, recheio de creme leve e frutas vermelhas frescas.' },
};
const fotoBg = (n, extra = '') => `<div style="position:absolute;${extra};background:url(${FOTO(n)}) center/cover"></div>`;

// ---------- Posts de produto (1080×1350), em 4 estilos ----------
const postAzul = p => box(1080, 1350, C.azul, `
  <div style="position:absolute;left:70px;right:70px;top:70px;height:760px;border-radius:44px;overflow:hidden;border:10px solid ${C.creme}">${fotoBg(p.foto, 'inset:0')}</div>
  ${selo(190, C.creme, C.azul, { meio: 'gal' }).replace('position:relative', 'position:absolute;right:46px;top:700px')}
  <div style="position:absolute;left:80px;right:80px;top:880px;color:${C.creme}">
    <div class="f" style="font-weight:900;font-size:92px;line-height:.95;letter-spacing:-.03em">${p.nome}</div>
    <div style="display:flex;gap:18px;align-items:center;margin-top:26px;font-weight:700;font-size:34px;letter-spacing:.06em"><span>${p.peso.toUpperCase()}</span><span style="opacity:.5">|</span><span style="background:${C.creme};color:${C.azul};padding:8px 22px;border-radius:999px">${preco}</span></div>
    <p style="font-size:30px;line-height:1.4;margin-top:24px;opacity:.9;max-width:900px">${p.desc}</p></div>`);
const postNatal = p => box(1080, 1350, C.vermelho, `${ceu(C.ouro, 22)}
  <div style="position:absolute;left:0;right:0;top:0;height:720px">${fotoBg(p.foto, 'inset:0')}<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 55%,${C.vermelho} 100%)"></div></div>
  <div style="position:absolute;left:0;right:0;top:640px;text-align:center;color:${C.ouro}">
    <div class="s" style="font-size:120px;line-height:1">Natal</div>
    <div class="f" style="font-weight:800;font-size:84px;line-height:1;color:${C.creme};margin-top:6px;padding:0 60px">${p.nome}</div>
    <div style="display:flex;justify-content:center;gap:16px;align-items:center;margin-top:30px;font-weight:700;font-size:32px;letter-spacing:.12em;color:${C.ouro}">${estrela(26, C.ouro)}<span>${p.peso.toUpperCase()} · ${preco}</span>${estrela(26, C.ouro)}</div>
    <p style="font-size:30px;line-height:1.4;margin:26px auto 0;max-width:820px;color:${C.creme};opacity:.92">${p.desc}</p></div>
  <div style="position:absolute;left:0;right:0;bottom:56px;display:flex;justify-content:center">${marca(34, C.ouro, { sub: 'CONFEITARIA' })}</div>`);
const postVerde = p => box(1080, 1350, C.verde, `${ceu(C.dourado, 18, 1080, 1350, 3)}
  <div style="position:absolute;left:190px;right:190px;top:110px;height:760px;border-radius:350px 350px 30px 30px;overflow:hidden;outline:4px solid ${C.dourado};outline-offset:14px">${fotoBg(p.foto, 'inset:0')}</div>
  <div style="position:absolute;left:80px;right:80px;top:930px;text-align:center;color:${C.creme}">
    <div style="font-weight:700;font-size:26px;letter-spacing:.38em;color:${C.dourado}">EDIÇÃO DE NATAL</div>
    <div class="f" style="font-weight:700;font-size:80px;line-height:1;margin-top:18px">${p.nome}</div>
    <div style="margin-top:22px;font-size:30px;opacity:.88">${p.peso} · <b style="color:${C.ouro}">${preco}</b></div></div>
  <div style="position:absolute;left:0;right:0;bottom:50px;display:flex;justify-content:center">${marca(30, C.dourado, { sub: '' })}</div>`);
const postCreme = p => box(1080, 1350, C.creme, `
  <div style="position:absolute;left:0;top:0;bottom:0;width:520px">${fotoBg(p.foto, 'inset:0')}</div>
  <div style="position:absolute;left:580px;right:70px;top:120px;bottom:120px;display:flex;flex-direction:column;color:${C.noite}">
    ${gal(C.azul, 150)}
    <div style="font-weight:700;font-size:24px;letter-spacing:.32em;color:${C.azul};margin-top:50px">FEITO À MÃO</div>
    <div class="f" style="font-weight:900;font-size:76px;line-height:.98;letter-spacing:-.03em;margin-top:16px">${p.nome}</div>
    <p style="font-size:28px;line-height:1.45;margin-top:26px;color:${C.cacau}">${p.desc}</p>
    <div style="margin-top:auto"><div style="font-size:24px;letter-spacing:.14em;font-weight:700;color:${C.caramelo}">${p.peso.toUpperCase()}</div>
      <div class="f" style="font-weight:900;font-size:64px;color:${C.azul};margin-top:6px">${preco}</div></div></div>`);

// ---------- Stories (1080×1920) ----------
const storyNatal = box(1080, 1920, `radial-gradient(120% 80% at 50% 0%,${C.vermelho} 0%,${C.vinho} 75%)`, `${ceu(C.ouro, 40, 1080, 1920, 11)}
  <div style="position:absolute;left:0;right:0;top:260px;display:flex;flex-direction:column;align-items:center;text-align:center;color:${C.creme}">
    ${selo(240, C.ouro, 'transparent', { meio: 'gd' })}
    <div class="s" style="font-size:190px;line-height:1;color:${C.ouro};margin-top:70px">Natal 2026</div>
    <div class="f" style="font-weight:800;font-size:110px;line-height:1;margin-top:20px">Encomendas<br>abertas</div>
    <p style="font-size:40px;line-height:1.4;margin-top:50px;max-width:800px;opacity:.92">Brownietones, panetones, cestas e caixas de presente feitos à mão.</p></div>
  <div style="position:absolute;left:0;right:0;bottom:220px;display:flex;justify-content:center"><span style="background:${C.ouro};color:${C.vinho};font-weight:700;font-size:44px;padding:30px 70px;border-radius:999px">Ver o cardápio</span></div>`);
const storyAzul = box(1080, 1920, C.azul, `
  <div style="position:absolute;left:0;right:0;top:200px;display:flex;justify-content:center">${gal(C.creme, 520)}</div>
  <div style="position:absolute;left:90px;right:90px;top:840px;text-align:center;color:${C.creme}">
    <div class="f" style="font-weight:900;font-size:130px;line-height:.95;letter-spacing:-.03em">Saiu do forno!</div>
    <div style="margin:60px auto 0;width:820px;height:620px;border-radius:40px;overflow:hidden;border:10px solid ${C.creme}">${`<div style="width:100%;height:100%;background:url(${FOTO('brownies')}) center/cover"></div>`}</div>
    <p style="font-size:42px;margin-top:40px;font-weight:500">Torta Brownie · peça já a sua</p></div>
  <div style="position:absolute;left:0;right:0;bottom:80px;display:flex;justify-content:center">${marca(40, C.creme, { sub: '' })}</div>`);
const storyVerde = box(1080, 1920, C.verde, `${ceu(C.dourado, 30, 1080, 1920, 5)}
  <div style="position:absolute;left:90px;right:90px;top:220px;color:${C.creme}">
    <div style="font-weight:700;font-size:30px;letter-spacing:.36em;color:${C.dourado}">PRESENTES DE NATAL</div>
    <div class="f" style="font-weight:800;font-size:120px;line-height:1;margin-top:26px">Quem você quer adoçar este Natal?</div></div>
  <div style="position:absolute;left:90px;right:90px;top:900px;display:grid;grid-template-columns:1fr 1fr;gap:30px">
    ${['cesta', 'bombons', 'biscoitos', 'panetone'].map(k => `<div style="border-radius:28px;overflow:hidden;background:${C.creme}"><div style="height:300px;background:url(${FOTO(PROD[k].foto)}) center/cover"></div><div class="f" style="font-weight:700;font-size:34px;color:${C.verde};padding:20px 24px">${PROD[k].nome}</div></div>`).join('')}</div>
  <div style="position:absolute;left:0;right:0;bottom:80px;display:flex;justify-content:center">${marca(36, C.dourado, { sub: '' })}</div>`);

// ---------- Embalagem: tag de presente, adesivo, cartão ----------
const tag = box(700, 1100, C.vermelho, `${ceu(C.ouro, 12, 700, 1100, 9)}
  <div style="position:absolute;left:50%;top:70px;transform:translateX(-50%);width:90px;height:90px;border-radius:50%;background:${C.creme};box-shadow:inset 0 0 0 12px ${C.dourado}"></div>
  <div style="position:absolute;inset:220px 60px 70px;display:flex;flex-direction:column;align-items:center;text-align:center;color:${C.creme}">
    <div class="s" style="font-size:110px;color:${C.ouro};line-height:1">Feliz Natal</div>
    <div style="margin-top:50px;width:100%;border-top:2px solid ${C.ouro};padding-top:30px;font-size:28px;letter-spacing:.2em;color:${C.ouro}">PARA</div>
    <div style="width:100%;border-bottom:2px dashed rgba(252,238,223,.6);height:70px"></div>
    <div style="margin-top:30px;font-size:28px;letter-spacing:.2em;color:${C.ouro}">DE</div>
    <div style="width:100%;border-bottom:2px dashed rgba(252,238,223,.6);height:70px"></div>
    <div style="margin-top:auto">${marca(36, C.ouro, { sub: '' })}</div></div>`);
const adesivo = box(900, 900, 'transparent', `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">${selo(860, C.creme, C.azul, { meio: 'gal' })}</div>`);
const adesivoNatal = box(900, 900, 'transparent', `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">${selo(860, C.ouro, C.verde, { meio: 'gd', texto: 'FELIZ NATAL · GRAN DOCES · FEITO À MÃO · ' })}</div>`);
const cartao = box(1500, 1050, C.creme, `
  <div style="position:absolute;left:0;top:0;bottom:0;width:540px;background:${C.azul};display:flex;align-items:center;justify-content:center">${gal(C.creme, 420)}</div>
  <div style="position:absolute;left:620px;right:90px;top:140px;color:${C.noite}">
    <div class="f" style="font-weight:900;font-size:92px;line-height:1;letter-spacing:-.03em">Obrigada por escolher a gente!</div>
    <p style="font-size:34px;line-height:1.5;margin-top:40px;color:${C.cacau}">Cada doce saiu da nossa cozinha feito com calma e carinho. Conta pra gente o que achou e marca a Gran Doces nas suas fotos.</p>
    <div style="margin-top:60px">${marca(44, C.azul)}</div></div>`);

// ---------- Cardápio de Natal (A4 a 150 dpi: 1240×1754) ----------
const W = 1240, H = 1754;
const capa = box(W, H, `radial-gradient(110% 70% at 50% 0%,${C.vermelho} 0%,${C.vinho} 80%)`, `${ceu(C.ouro, 40, W, H, 21)}
  <div style="position:absolute;inset:60px;border:3px solid ${C.ouro};border-radius:30px"></div><div style="position:absolute;inset:78px;border:1px solid rgba(232,207,149,.5);border-radius:22px"></div>
  <div style="position:absolute;left:0;right:0;top:300px;display:flex;flex-direction:column;align-items:center;text-align:center;color:${C.creme}">
    ${gal(C.creme, 380)}
    <div style="font-weight:700;font-size:40px;letter-spacing:.5em;margin:90px -.5em 0 0;color:${C.ouro}">CARDÁPIO</div>
    <div class="s" style="font-size:200px;line-height:1.1;color:${C.ouro};margin-top:20px">Natal 2026</div>
    <div style="margin-top:110px">${marca(80, C.creme)}</div></div>`);
const carta = box(W, H, C.creme, `
  <div style="position:absolute;left:150px;right:150px;top:0;bottom:0;color:${C.noite};text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center">
    ${estrela(60, C.vermelho)}
    <div class="s" style="font-size:150px;color:${C.vermelho};line-height:1;margin-top:40px">Querido cliente,</div>
    <div class="f" style="font-weight:500;font-size:44px;line-height:1.5;margin-top:60px">O Natal tem gosto de casa: de mesa cheia, de abraço apertado e de doce feito com calma.</div>
    <p style="font-size:36px;line-height:1.6;margin-top:50px;color:${C.cacau}">Preparamos este cardápio com as receitas que a gente mais ama, para adoçar os seus encontros e virar presente para quem você quer bem.</p>
    <div class="s" style="font-size:100px;color:${C.verde};margin-top:80px">Feliz Natal!</div>
    <div style="margin-top:40px">${logoH(46, C.azul)}</div></div>`);
const pagProd = (p, tema) => {
  const t = { vermelho: [C.vermelho, C.creme, C.ouro], verde: [C.verde, C.creme, C.dourado], creme: [C.creme, C.noite, C.vermelho] }[tema];
  return box(W, H, t[0], `${tema === 'creme' ? '' : ceu(t[2], 20, W, H, p.nome.length)}
    <div style="position:absolute;left:90px;right:90px;top:90px;height:1000px;border-radius:40px;overflow:hidden">${fotoBg(p.foto, 'inset:0')}</div>
    <div style="position:absolute;left:110px;top:130px;background:${t[2]};color:${tema === 'creme' ? '#fff' : t[0]};font-weight:700;font-size:26px;letter-spacing:.2em;padding:12px 26px;border-radius:999px">NATAL 2026</div>
    <div style="position:absolute;left:110px;right:110px;top:1150px;color:${t[1]}">
      <div class="f" style="font-weight:800;font-size:96px;line-height:1">${p.nome}</div>
      <div style="display:flex;gap:20px;align-items:center;margin-top:30px;font-weight:700;font-size:36px;letter-spacing:.1em;color:${t[2]}">${p.peso.toUpperCase()} ${estrela(24, t[2])} ${preco}</div>
      <p style="font-size:36px;line-height:1.5;margin-top:30px;opacity:.92">${p.desc}</p>
      <div style="margin-top:26px;font-size:28px;letter-spacing:.06em;color:${t[2]}">Acima de 10 unidades: consulte valor especial.</div></div>
    <div style="position:absolute;right:90px;bottom:70px">${marca(30, t[2], { sub: '' })}</div>`);
};
const contato = box(W, H, C.azul, `
  <div style="position:absolute;left:0;right:0;top:330px;display:flex;flex-direction:column;align-items:center;text-align:center;color:${C.creme}">
    ${gal(C.creme, 460)}
    <div class="f" style="font-weight:900;font-size:110px;line-height:1;margin-top:80px;letter-spacing:-.03em">Faça sua encomenda</div>
    <div style="margin-top:70px;display:flex;flex-direction:column;gap:26px;font-size:42px;font-weight:500">
      <span>WhatsApp (00) 00000-0000</span><span>@grandoces</span><span>Endereço da loja</span></div>
    <div style="margin-top:80px;font-size:30px;opacity:.8;max-width:900px">Pedidos até 20/12 · retirada ou entrega</div></div>`);

const CARD = [['01-capa', capa], ['02-carta', carta], ['03-brownietone', pagProd(PROD.brownietone, 'vermelho')], ['04-pistache', pagProd(PROD.pistache, 'verde')],
  ['05-panetone', pagProd(PROD.panetone, 'creme')], ['06-bombons', pagProd(PROD.bombons, 'vermelho')], ['07-biscoitos', pagProd(PROD.biscoitos, 'verde')],
  ['08-cesta', pagProd(PROD.cesta, 'vermelho')], ['09-torta', pagProd(PROD.torta, 'creme')], ['10-contato', contato]];
const PECAS = {
  'post-azul-brownietone': [1080, 1350, postAzul(PROD.brownietone)], 'post-azul-torta': [1080, 1350, postAzul(PROD.torta)],
  'post-natal-panetone': [1080, 1350, postNatal(PROD.panetone)], 'post-natal-cesta': [1080, 1350, postNatal(PROD.cesta)],
  'post-verde-pistache': [1080, 1350, postVerde(PROD.pistache)], 'post-verde-biscoitos': [1080, 1350, postVerde(PROD.biscoitos)],
  'post-creme-bombons': [1080, 1350, postCreme(PROD.bombons)], 'post-creme-bolo': [1080, 1350, postCreme(PROD.bolo)],
  'story-natal-encomendas': [1080, 1920, storyNatal], 'story-azul-saiu-do-forno': [1080, 1920, storyAzul], 'story-verde-presentes': [1080, 1920, storyVerde],
  'tag-presente': [700, 1100, tag], 'adesivo-azul': [900, 900, adesivo], 'adesivo-natal': [900, 900, adesivoNatal], 'cartao-agradecimento': [1500, 1050, cartao],
};
const LOGOS = {
  'logo-horizontal-azul': logoH(110, C.azul), 'logo-horizontal-creme': logoH(110, C.creme), 'logo-vertical-azul': logoV(110, C.azul),
  'marca-sem-galinha-azul': marca(150, C.azul), 'marca-sem-galinha-dourado': marca(150, C.dourado), 'galinha-azul': gal(C.azul, 700), 'galinha-creme': gal(C.creme, 700),
  'selo-gd-azul': selo(700, C.azul, 'transparent'), 'selo-galinha-creme-azul': selo(700, C.creme, C.azul, { meio: 'gal' }),
};

const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors', '--allow-file-access-from-files'] });
const browser = await chromium.launch(launch);
const page = await browser.newPage();
const abrir = async (nome, html, w, h, transparente = false) => {
  const arq = path.join(BUILD, nome + '.html');
  fs.writeFileSync(arq, `<!doctype html><html><head>${HEAD}${transparente ? '<style>body{background:transparent}</style>' : ''}</head><body>${html}</body></html>`);
  await page.setViewportSize({ width: w, height: h });
  await page.goto('file://' + arq); await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => (i.onload = i.onerror = r)))));
  await page.waitForTimeout(400);
};
for (const [n, [w, h, html]] of Object.entries(PECAS)) { await abrir(n, html, w, h, n.startsWith('adesivo')); await page.screenshot({ path: path.join(OUT, 'pecas', n + '.png'), omitBackground: n.startsWith('adesivo') }); }
for (const [n, html] of Object.entries(LOGOS)) { await abrir(n, `<div id="l" style="display:inline-block;padding:40px">${html}</div>`, 2400, 1400, true); await page.locator('#l').screenshot({ path: path.join(OUT, 'logos', n + '.png'), omitBackground: true }); }
for (const [n, html] of CARD) { await abrir('card-' + n, html, W, H); await page.screenshot({ path: path.join(OUT, 'cardapio', n + '.png') }); }
// Cardápio em PDF A4
const pdfHtml = CARD.map(([, h]) => `<div style="width:${W}px;height:${H}px;break-after:page;overflow:hidden">${h}</div>`).join('');
fs.writeFileSync(path.join(BUILD, 'cardapio.html'), `<!doctype html><html><head>${HEAD}<style>@page{size:${W}px ${H}px;margin:0}</style></head><body>${pdfHtml}</body></html>`);
await page.goto('file://' + path.join(BUILD, 'cardapio.html')); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(800);
await page.pdf({ path: path.join(OUT, 'Cardapio-Natal-2026-Gran-Doces.pdf'), width: W + 'px', height: H + 'px', printBackground: true });

// ---------- Pranchas (1920×1080) ----------
const im = (dir, n, w, extra = '') => `<img src="file://${path.join(OUT, dir, n + '.png')}" style="display:block;width:${w}px;border-radius:12px;box-shadow:0 14px 34px rgba(11,43,110,.16);${extra}">`;
const cab = (n, t, sub) => `<div style="font-weight:700;font-size:20px;letter-spacing:.24em;color:${C.azul}">${n}</div><div class="f" style="font-weight:900;font-size:64px;line-height:1;color:${C.noite};margin-top:6px;letter-spacing:-.03em">${t}</div>${sub ? `<p style="font-size:20px;line-height:1.45;color:#4a4f63;margin-top:10px;max-width:1300px">${sub}</p>` : ''}`;
const prancha = corpo => `<section style="position:relative;width:1920px;height:1080px;overflow:hidden;background:#F7F2EA;padding:60px 70px;break-after:page">${corpo}
  <div style="position:absolute;right:70px;bottom:36px;display:flex;align-items:center;gap:14px;font-weight:700;font-size:16px;letter-spacing:.16em;color:#9a8f86">GRAN DOCES · IDENTIDADE VISUAL ${gal(C.azul, 34)}</div></section>`;
const tile = (bg, html, w, h, extra = '') => `<div style="width:${w}px;height:${h}px;border-radius:18px;background:${bg};display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;${extra}">${html}</div>`;
const sw = (n, h, fg = '#fff') => `<div style="flex:1;height:200px;border-radius:16px;background:${h};color:${fg};padding:20px;display:flex;flex-direction:column;justify-content:flex-end;border:1px solid #e8dfd3"><div class="f" style="font-weight:800;font-size:30px">${n}</div><div style="font-size:17px;font-weight:700;margin-top:4px">${h}</div></div>`;
const PR = [
  prancha(`${cab('01', 'Logo e variações', 'A galinha é a assinatura da casa: alegre, artesanal e fácil de reconhecer. Nas peças mais elegantes (Natal, presentes), use a marca sem a galinha ou o selo GD.')}
    <div style="display:grid;grid-template-columns:repeat(3,580px);gap:20px;margin-top:26px">
      ${tile(C.azul, logoH(70, C.creme), 580, 290)}${tile(C.creme, logoV(48, C.azul), 580, 290, 'border:1px solid #eadfd3')}${tile(C.noite, marca(96, C.creme), 580, 290)}
      ${tile(C.vermelho, `<div style="display:flex;flex-direction:column;align-items:center;gap:6px">${gal(C.creme, 120)}<div class="s" style="font-size:64px;color:${C.ouro};line-height:1">Natal</div>${marca(44, C.creme, { sub: '' })}</div>`, 580, 290)}
      ${tile(C.verde, selo(240, C.ouro, 'transparent'), 580, 290)}${tile('#fff', selo(240, C.creme, C.azul, { meio: 'gal' }), 580, 290, 'border:1px solid #eadfd3')}</div>
    <div style="display:flex;gap:20px;margin-top:20px;align-items:center">${[[C.azul, C.creme], [C.creme, C.azul], [C.vermelho, C.ouro], [C.verde, C.creme], ['#fff', C.cacau]].map(([bg, c]) => tile(bg, gal(c, 120), 150, 150, 'border:1px solid #eadfd3')).join('')}
      <p style="font-size:19px;line-height:1.5;color:#4a4f63;width:620px;margin-left:20px">A galinha pode ser pintada de qualquer cor da paleta. Fotos de perfil: galinha creme no azul (ano todo) ou o selo dourado no verde (Natal).</p></div>`),
  prancha(`${cab('02', 'Cores e tipografia')}
    <div style="font-weight:700;font-size:18px;letter-spacing:.2em;color:${C.azul};margin-top:26px">ANO TODO</div>
    <div style="display:flex;gap:16px;margin-top:10px">${sw('Azul Gran', C.azul)}${sw('Azul Noite', C.noite)}${sw('Creme', C.creme, C.noite)}${sw('Caramelo', C.caramelo)}${sw('Cacau', C.cacau)}${sw('Rosa Açúcar', C.rosa, C.noite)}</div>
    <div style="font-weight:700;font-size:18px;letter-spacing:.2em;color:${C.vermelho};margin-top:22px">NATAL</div>
    <div style="display:flex;gap:16px;margin-top:10px">${sw('Vermelho Natal', C.vermelho)}${sw('Vinho', C.vinho)}${sw('Verde Pinheiro', C.verde)}${sw('Pinheiro Noite', C.pinheiro)}${sw('Dourado', C.dourado)}${sw('Ouro Claro', C.ouro, C.vinho)}</div>
    <div style="display:flex;gap:60px;margin-top:30px;color:${C.noite};align-items:flex-end">
      <div><div style="font-size:16px;font-weight:700;letter-spacing:.2em;color:${C.azul}">TÍTULOS · FRAUNCES (SOFT)</div><div class="f" style="font-weight:900;font-size:84px;line-height:1;letter-spacing:-.03em">Brownietone</div></div>
      <div><div style="font-size:16px;font-weight:700;letter-spacing:.2em;color:${C.vermelho}">NATAL · PINYON SCRIPT</div><div class="s" style="font-size:100px;line-height:1;color:${C.vermelho}">Feliz Natal</div></div>
      <div style="max-width:520px"><div style="font-size:16px;font-weight:700;letter-spacing:.2em;color:${C.azul}">TEXTO · DM SANS</div><div style="font-size:24px;line-height:1.5">Brownie molhadinho, recheado com brigadeiro cremoso. Feito à mão, todos os dias.</div></div></div>`),
  prancha(`${cab('03', 'Posts de produto', 'Quatro estilos: azul com a galinha (dia a dia), vermelho e verde de Natal (sem a galinha) e creme editorial (com a galinha pequena).')}
    <div style="display:flex;gap:20px;margin-top:26px">${['post-azul-brownietone', 'post-natal-panetone', 'post-verde-pistache', 'post-creme-bombons'].map(n => im('pecas', n, 425)).join('')}</div>`),
  prancha(`${cab('04', 'Stories e embalagem')}
    <div style="display:flex;gap:22px;margin-top:26px;align-items:flex-start">${['story-natal-encomendas', 'story-azul-saiu-do-forno', 'story-verde-presentes'].map(n => im('pecas', n, 300)).join('')}
      ${im('pecas', 'tag-presente', 220)}</div>
    <div style="position:absolute;right:70px;top:200px">${im('pecas', 'cartao-agradecimento', 500)}</div>
    <div style="position:absolute;right:90px;top:590px;display:flex;gap:30px">${im('pecas', 'adesivo-azul', 220, 'box-shadow:none')}${im('pecas', 'adesivo-natal', 220, 'box-shadow:none')}</div>`),
  prancha(`${cab('05', 'Cardápio de Natal (A4)', 'Capa vermelha, carta de abertura, uma página por produto alternando vermelho, verde e creme, e a página de pedidos. Preços em R$ 00,00 para preencher.')}
    <div style="display:grid;grid-template-columns:repeat(5,262px);gap:16px 24px;margin-top:22px">${CARD.map(([n]) => im('cardapio', n, 262)).join('')}</div>`),
];
fs.writeFileSync(path.join(BUILD, 'pranchas.html'), `<!doctype html><html><head>${HEAD}<style>@page{size:1920px 1080px;margin:0}</style></head><body>${PR.join('')}</body></html>`);
await page.setViewportSize({ width: 1920, height: 1080 });
await page.goto('file://' + path.join(BUILD, 'pranchas.html')); await page.evaluate(() => document.fonts.ready);
await page.evaluate(() => Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => (i.onload = i.onerror = r))))); await page.waitForTimeout(500);
const secs = await page.locator('section').all();
for (const [i, s] of secs.entries()) await s.screenshot({ path: path.join(OUT, 'pranchas', `0${i + 1}.png`) });
await page.pdf({ path: path.join(OUT, 'Gran-Doces-identidade-visual.pdf'), width: '1920px', height: '1080px', printBackground: true });
await browser.close();
console.log('✓', Object.keys(PECAS).length, 'peças,', Object.keys(LOGOS).length, 'logos,', CARD.length, 'páginas de cardápio,', secs.length, 'pranchas');
