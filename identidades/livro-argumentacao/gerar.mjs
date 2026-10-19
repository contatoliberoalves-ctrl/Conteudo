// Identidade visual do livro "O segredo pra argumentar em provas discursivas" (OAB e Concursos),
// de Líbero Alves Rodrigues Filho: 4 direções, todas com degradê verde na capa. Para cada uma: prancha 1920×1080
// (capa, livro em 3D, abertura de capítulo, página de texto, cores e fontes), capa em alta (16 × 23 cm a 300 dpi)
// e capa aberta com lombada e verso. Uso: CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node gerar.mjs
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { V2, FONTES2 } from './v2.mjs';
import { V3, FONTES3 } from './v3.mjs';
import { V4, FONTES4 } from './v4.mjs';
import { V5, FONTES5 } from './v5.mjs';
const root = path.dirname(new URL(import.meta.url).pathname);
const { chromium } = createRequire('/opt/node-tools/node_modules/')('playwright');

const W = 640, H = 920, LOMBADA = 100; // 16 × 23 cm (40 px/cm); lombada provisória de 2,5 cm
const AUTOR = 'Líbero Alves Rodrigues Filho';
// Grão de papel/impressão por cima do degradê.
const GRAO = `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .55 0"/></filter><rect width="300" height="300" filter="url(#n)"/></svg>')}")`;
const grao = (op = .16) => `<div style="position:absolute;inset:0;background:${GRAO};opacity:${op};mix-blend-mode:overlay;pointer-events:none"></div>`;
const chave = (cor, h) => `<svg viewBox="0 0 40 100" height="${h}" style="display:block;flex:none"><g fill="none" stroke="${cor}" stroke-width="2.2" stroke-linecap="round"><circle cx="20" cy="18" r="13"/><circle cx="20" cy="18" r="5.5"/><path d="M20 31 V92 M20 62 H30 M20 72 H27 M20 84 H31"/></g></svg>`;

const V = [
  {
    id: 'esmeralda', nome: 'Esmeralda',
    conceito: 'Premium e minimalista: degradê em malha (como luz atravessando uma pedra), grão de impressão, título enorme em serifa e uma chave em traço dourado. Cara de livro de editora grande.',
    tit: "'DM Serif Display',serif", txt: 'Inter,sans-serif', tipos: ['DM Serif Display', 'Inter'],
    cores: [['Noite', '#05241A'], ['Esmeralda', '#0E6B4A'], ['Jade', '#3FBF86'], ['Orvalho', '#B9F0CF'], ['Ouro', '#E3C77D']],
    bg: `radial-gradient(70% 45% at 18% 12%,#3FBF86 0%,rgba(63,191,134,0) 70%),radial-gradient(60% 40% at 92% 6%,#B9F0CF 0%,rgba(185,240,207,0) 65%),radial-gradient(90% 60% at 85% 85%,#0E6B4A 0%,rgba(14,107,74,0) 70%),linear-gradient(180deg,#0B4A35 0%,#05241A 100%)`,
    ac: '#1E9A66', lt: '#E3C77D', dk: '#05241A', papel: '#FAF8F2',
    capa: v => `<div style="position:absolute;inset:0;background:${v.bg}"></div>${grao(.2)}
      <div style="position:absolute;left:0;right:0;top:74px;display:flex;align-items:center;justify-content:center;gap:18px;font-family:Inter;font-weight:600;font-size:14px;letter-spacing:.42em;color:#E3EFE8"><span style="width:46px;height:1px;background:#E3C77D"></span>OAB · CONCURSOS<span style="width:46px;height:1px;background:#E3C77D"></span></div>
      <div style="position:absolute;left:0;right:0;top:232px;display:flex;justify-content:center">${chave('#E3C77D', 104)}</div>
      <div style="position:absolute;left:0;right:0;top:372px;text-align:center;color:#fff">
        <div style="font-family:'DM Serif Display';font-style:italic;font-size:52px;line-height:1;opacity:.9">O</div>
        <div style="font-family:'DM Serif Display';font-size:158px;line-height:.86;letter-spacing:-.025em;text-shadow:0 10px 40px rgba(0,0,0,.25)">segredo</div>
        <div style="font-family:Inter;font-weight:500;font-size:19px;letter-spacing:.3em;margin-top:34px;line-height:1.7;color:#E3EFE8">PRA ARGUMENTAR EM<br>PROVAS DISCURSIVAS</div></div>
      <div style="position:absolute;left:0;right:0;bottom:76px;text-align:center;font-family:'DM Serif Display';font-size:27px;color:#fff">${AUTOR}</div>`,
  },
  {
    id: 'folha', nome: 'Folha de prova',
    conceito: 'Concreta e direta: a folha de resposta corrigida, com a argumentação marcada em verde e o visto do examinador. O leitor entende na hora do que o livro trata e se imagina tirando a nota.',
    tit: 'Archivo,sans-serif', txt: "'Source Serif 4',serif", tipos: ['Archivo (condensada)', 'Source Serif 4 · Caveat'],
    cores: [['Pinho', '#0B3F2C'], ['Folha', '#168452'], ['Broto', '#5FD08E'], ['Marca-texto', '#C9F27A'], ['Papel', '#FBFAF4']],
    bg: 'linear-gradient(165deg,#0B3F2C 0%,#0F5E3D 45%,#168452 75%,#2FB06A 100%)',
    ac: '#168452', lt: '#C9F27A', dk: '#0B3F2C', papel: '#FFFFFF',
    capa: v => {
      const mt = t => `<span style="background:linear-gradient(transparent 38%,rgba(201,242,122,.95) 38%,rgba(201,242,122,.95) 88%,transparent 88%);padding:0 4px">${t}</span>`;
      return `<div style="position:absolute;inset:0;background:${v.bg}"></div>${grao(.14)}
      <div style="position:absolute;left:56px;top:60px;display:flex;align-items:center;gap:12px;font-family:Archivo;font-weight:700;font-size:15px;letter-spacing:.2em;color:#C9F27A"><span style="width:10px;height:10px;border-radius:50%;background:#C9F27A"></span>OAB E CONCURSOS</div>
      <div style="position:absolute;left:52px;right:40px;top:104px;color:#fff;font-family:Archivo">
        <div style="font-weight:900;font-stretch:75%;font-size:132px;line-height:.84;letter-spacing:-.02em;text-transform:uppercase">O segredo</div>
        <div style="font-weight:700;font-size:35px;line-height:1.08;margin-top:18px;color:#DDF8E6">pra argumentar em<br>provas discursivas</div>
        <div style="font-weight:600;font-size:18px;margin-top:22px;color:#fff;opacity:.85">${AUTOR}</div></div>
      <div style="position:absolute;left:70px;top:500px;width:560px;height:470px;transform:rotate(-5deg);background:#FBFAF4;border-radius:6px;box-shadow:0 30px 60px rgba(0,0,0,.4),0 2px 0 rgba(0,0,0,.05);overflow:hidden">
        <div style="position:absolute;inset:0;background:repeating-linear-gradient(transparent 0 37px,#CFE0EA 37px 38px);background-position:0 26px"></div>
        <div style="position:absolute;left:58px;top:0;bottom:0;width:2px;background:#E8A0A0"></div>
        <div style="position:absolute;left:74px;top:14px;font-family:Archivo;font-weight:700;font-size:11px;letter-spacing:.18em;color:#8AA0AC">FOLHA DE RESPOSTA · QUESTÃO 1</div>
        <div style="position:absolute;left:74px;right:30px;top:41px;font-family:Caveat;font-size:27px;line-height:38px;color:#1E3A6E">
          A conduta viola o ${mt('direito líquido e certo')}<br>do impetrante, comprovado por<br>documento, conforme o ${mt('art. 5º, LXIX, da CF')}.<br>Assim, ${mt('é cabível o mandado')} de segurança,<br>devendo a ordem ser concedida.</div>
        <div style="position:absolute;left:14px;top:46px;font-family:Caveat;font-weight:700;font-size:34px;line-height:38px;color:#168452">✓<br><br>✓<br><br>✓</div></div>`;
    },
  },
  {
    id: 'revelado', nome: 'Revelado',
    conceito: 'Provocativa: a palavra SEGREDO aparece meio escondida por uma tarja, como um documento sigiloso sendo aberto. Gera curiosidade de longe e fica forte em post, anúncio e miniatura.',
    tit: 'Archivo,sans-serif', txt: 'Inter,sans-serif', tipos: ['Anton · Archivo', 'Inter'],
    cores: [['Neon', '#D4F57A'], ['Viço', '#48C27C'], ['Floresta', '#0F6B47'], ['Breu', '#04261A'], ['Branco', '#FFFFFF']],
    bg: 'linear-gradient(150deg,#D4F57A 0%,#7ED87E 22%,#2FA866 45%,#0F6B47 72%,#04261A 100%)',
    ac: '#2FA866', lt: '#D4F57A', dk: '#04261A', papel: '#FFFFFF',
    capa: v => `<div style="position:absolute;inset:0;background:${v.bg}"></div>${grao(.18)}
      <div style="position:absolute;left:56px;top:62px;font-family:Archivo;font-weight:800;font-size:16px;letter-spacing:.24em;color:#04261A">OAB · CONCURSOS</div>
      <div style="position:absolute;right:52px;top:46px;width:86px;height:86px;border:3px solid #04261A;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:Archivo;font-weight:900;font-size:14px;letter-spacing:.06em;color:#04261A;transform:rotate(12deg);text-align:center;line-height:1.05">TOP<br>SECRET</div>
      <div style="position:absolute;left:48px;right:30px;top:300px;font-family:Archivo;color:#fff">
        <div style="font-weight:800;font-size:44px;line-height:1;letter-spacing:-.01em">O</div>
        <div style="position:relative;display:inline-block;margin-top:18px"><div style="font-family:Anton;font-size:158px;line-height:.92;letter-spacing:.005em;text-transform:uppercase">Segredo</div>
          <div style="position:absolute;left:-80px;right:-160px;top:112px;height:42px;background:#04261A;transform:rotate(-3deg);box-shadow:0 14px 28px rgba(0,0,0,.35)"></div>
          <div style="position:absolute;left:250px;top:121px;font-weight:800;font-size:15px;letter-spacing:.34em;color:#D4F57A;transform:rotate(-3deg);white-space:nowrap">CONFIDENCIAL</div></div>
        <div style="font-weight:800;font-size:40px;line-height:1.05;margin-top:30px;letter-spacing:-.015em">pra argumentar em<br>provas discursivas</div></div>
      <div style="position:absolute;left:56px;right:56px;bottom:66px;display:flex;align-items:center;justify-content:space-between;font-family:Archivo;color:#fff"><span style="font-weight:700;font-size:20px">${AUTOR}</span><span style="width:120px;height:3px;background:#D4F57A"></span></div>`,
  },
  {
    id: 'selo', nome: 'Selo',
    conceito: 'Clássica com assinatura: um selo circular (que vira o logo do livro e da marca) com aspas no centro, sobre um degradê profundo que acende no meio. Elegante, atemporal e fácil de reconhecer.',
    tit: "'Bodoni Moda',serif", txt: 'Manrope,sans-serif', tipos: ['Bodoni Moda', 'Manrope'],
    cores: [['Abismo', '#041E15'], ['Pinheiro', '#0F5C3E'], ['Clareira', '#36B37A'], ['Creme', '#F4EEDD'], ['Latão', '#D7B56D']],
    bg: 'radial-gradient(75% 55% at 50% 36%,#36B37A 0%,#178A57 28%,#0F5C3E 55%,#041E15 100%)',
    ac: '#178A57', lt: '#D7B56D', dk: '#041E15', papel: '#FBF9F3',
    capa: v => `<div style="position:absolute;inset:0;background:${v.bg}"></div>${grao(.18)}
      <svg viewBox="0 0 300 300" style="position:absolute;left:170px;top:120px;width:300px;height:300px">
        <defs><path id="circ-${Math.random().toString(36).slice(2)}" d="M150 150 m-118 0 a118 118 0 1 1 236 0 a118 118 0 1 1 -236 0"/></defs>
        <circle cx="150" cy="150" r="140" fill="none" stroke="#F4EEDD" stroke-width="1.5" opacity=".8"/><circle cx="150" cy="150" r="96" fill="none" stroke="#D7B56D" stroke-width="1.5"/>
        <text font-family="Manrope" font-weight="700" font-size="14.5" letter-spacing="5.7" fill="#F4EEDD"><textPath href="#CIRC">OAB · CONCURSOS · PROVAS DISCURSIVAS · ARGUMENTAÇÃO ·</textPath></text>
        </svg><div style="position:absolute;left:0;right:0;top:206px;display:flex;justify-content:center">${chave('#D7B56D', 128)}</div>
      <div style="position:absolute;left:0;right:0;top:470px;text-align:center;color:#F4EEDD">
        <div style="font-family:'Bodoni Moda';font-style:italic;font-weight:500;font-size:112px;line-height:.95;letter-spacing:-.01em">O segredo</div>
        <div style="font-family:'Bodoni Moda';font-weight:500;font-size:34px;line-height:1.2;margin-top:18px">pra argumentar em<br>provas discursivas</div></div>
      <div style="position:absolute;left:0;right:0;bottom:74px;text-align:center;font-family:Manrope;font-weight:700;font-size:16px;letter-spacing:.34em;color:#F4EEDD">LÍBERO ALVES RODRIGUES FILHO</div>`.replace(/id="circ-(\w+)"([\s\S]*?)#CIRC/, (m, id, meio) => `id="circ-${id}"${meio}#circ-${id}`),
  },
];
V.push(...V2(grao), ...V3(grao), ...V4(grao), ...V5(grao));

const FONTES = FONTES5 + '&' + FONTES4 + '&' + FONTES3 + '&' + FONTES2 + '&' + 'family=DM+Serif+Display:ital@0;1&family=Inter:wght@400;500;600;700&family=Archivo:wdth,wght@62..125,500..900&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&family=Caveat:wght@500;700&family=Bodoni+Moda:ital,opsz,wght@0,6..96,500;0,6..96,700;1,6..96,500&family=Manrope:wght@500;700;800&family=Anton';

const caixa = (w, h, html) => `<div style="position:relative;width:${w}px;height:${h}px;overflow:hidden;flex:none">${html}</div>`;
const fundo = v => `<div style="position:absolute;inset:0;background:${v.bg}"></div>${grao(.16)}`;
const verso = v => `${fundo(v)}<div style="position:absolute;inset:0;background:rgba(0,0,0,.22)"></div>
  <div style="position:absolute;left:64px;right:64px;top:96px;color:#fff;font-family:${v.txt}">
    <div style="font-family:${v.tit};font-weight:800;font-size:38px;line-height:1.12">Saber a lei não basta. É preciso convencer quem corrige.</div>
    <p style="font-size:19px;line-height:1.6;margin-top:28px;opacity:.92">[Sinopse provisória] Um método direto para transformar conhecimento em resposta que pontua: ler o que a banca pede, ligar o fato à norma e fechar com uma conclusão que não deixa dúvida.</p>
    <p style="font-size:19px;line-height:1.6;margin-top:16px;opacity:.92">Para a 2ª fase da OAB e para as provas discursivas de concursos.</p></div>
  <div style="position:absolute;left:64px;bottom:72px;width:200px;height:110px;background:#fff;border-radius:4px;display:flex;align-items:center;justify-content:center;font-family:monospace;font-size:13px;color:#333">ISBN / código de barras</div>`;
const lombada = v => `${fundo(v)}<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center"><div style="transform:rotate(90deg);white-space:nowrap;color:#fff;font-family:${v.tit};font-weight:800;font-size:25px">O segredo pra argumentar em provas discursivas<span style="font-family:${v.txt};font-weight:600;font-size:17px;opacity:.85;margin-left:28px;letter-spacing:.06em">LÍBERO FILHO</span></div></div>`;
const aberta = v => `<div style="display:flex">${caixa(W, H, verso(v))}${caixa(LOMBADA, H, lombada(v))}${caixa(W, H, v.capa(v))}</div>`;

// Livro em pé, em 3D: capa de frente, lombada à esquerda e o miolo (páginas) à direita.
const livro3d = v => `<div style="perspective:2400px;width:${W}px;height:${H}px;position:relative">
  <div style="position:absolute;left:10px;right:-30px;bottom:-46px;height:70px;background:radial-gradient(closest-side,rgba(0,0,0,.42),transparent);filter:blur(8px)"></div>
  <div style="position:absolute;inset:0;transform-style:preserve-3d;transform:rotateY(28deg) rotateX(3deg)">
    <div style="position:absolute;left:0;top:0;width:${W}px;height:${H}px;transform:translateZ(${LOMBADA / 2}px);border-radius:0 5px 5px 0;overflow:hidden">${v.capa(v)}<div style="position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,.3),rgba(255,255,255,.1) 3%,transparent 9%,transparent 75%,rgba(255,255,255,.1))"></div></div>
    <div style="position:absolute;left:0;top:0;width:${LOMBADA}px;height:${H}px;transform-origin:0 0;transform:translateZ(${LOMBADA / 2}px) rotateY(90deg)"><div style="position:absolute;inset:0;overflow:hidden;transform:scaleX(-1)">${lombada(v)}<div style="position:absolute;inset:0;background:rgba(0,0,0,.28)"></div></div></div></div></div>`;

// Miolo: abertura de capítulo e página de texto com o box "O segredo" e o exemplo antes × depois.
const abertura = v => `<div style="position:absolute;inset:0;background:${v.papel}"></div>
  <div style="position:absolute;left:0;right:0;top:0;height:380px;overflow:hidden">${fundo(v)}</div>
  <div style="position:absolute;left:70px;top:70px;font-family:${v.txt};font-weight:700;font-size:15px;letter-spacing:.3em;color:#fff;opacity:.85">CAPÍTULO</div>
  <div style="position:absolute;left:62px;top:96px;font-family:${v.tit};font-weight:800;font-size:230px;line-height:1;color:#fff;letter-spacing:-.04em">1</div>
  <div style="position:absolute;left:70px;right:70px;top:450px;font-family:${v.txt}">
    <div style="font-family:${v.tit};font-weight:800;font-size:54px;line-height:1.02;color:${v.dk}">O que a banca quer ler</div>
    <div style="width:70px;height:4px;background:${v.ac};margin:30px 0"></div>
    <p style="font-size:20px;line-height:1.62;color:#2b2b2b">Antes de escrever uma linha, descubra o que o enunciado pergunta de verdade. A maior parte dos pontos perdidos não vem de não saber o Direito, e sim de responder outra coisa.</p></div>`;
const texto = v => `<div style="position:absolute;inset:0;background:${v.papel}"></div>
  <div style="position:absolute;left:70px;right:70px;top:50px;display:flex;justify-content:space-between;font-family:${v.txt};font-size:13px;letter-spacing:.12em;color:#888;text-transform:uppercase"><span>O segredo pra argumentar</span><span>Capítulo 1</span></div>
  <div style="position:absolute;left:70px;right:70px;top:110px;font-family:${v.txt};color:#2b2b2b">
    <p style="font-size:18px;line-height:1.62">Toda resposta que pontua segue o mesmo caminho: identifica o fato relevante, aponta a norma aplicável, mostra como ela incide no caso e fecha com uma conclusão clara. Quando um desses passos falta, o examinador não tem como dar o ponto.</p>
    <div style="margin:28px 0;border-radius:16px;padding:26px 28px;position:relative;overflow:hidden;color:#fff">${fundo(v)}<div style="position:relative">
      <div style="display:flex;align-items:center;gap:10px;font-family:${v.txt};font-weight:800;font-size:14px;letter-spacing:.22em;color:${v.lt}">${chave(v.lt, 26)}O SEGREDO</div>
      <div style="font-family:${v.tit};font-weight:700;font-size:25px;line-height:1.25;margin-top:10px">Não basta citar o artigo: mostre por que ele resolve aquele caso.</div></div></div>
    <div style="display:flex;gap:16px">
      <div style="flex:1;border-left:6px solid #C0563F;background:#F7ECE9;padding:16px 18px;border-radius:0 10px 10px 0"><div style="font-weight:700;font-size:13px;letter-spacing:.12em;color:#C0563F">ANTES</div><div style="font-size:16px;line-height:1.45;margin-top:6px">"Cabe mandado de segurança, conforme a lei."</div></div>
      <div style="flex:1;border-left:6px solid ${v.ac};background:#EAF5EE;padding:16px 18px;border-radius:0 10px 10px 0"><div style="font-weight:700;font-size:13px;letter-spacing:.12em;color:${v.ac}">DEPOIS</div><div style="font-size:16px;line-height:1.45;margin-top:6px">"Há direito líquido e certo, provado por documento, violado por ato de autoridade: cabe MS (art. 5º, LXIX, CF)."</div></div></div>
    <p style="font-size:18px;line-height:1.62;margin-top:26px">Nos próximos capítulos, cada passo vira um exercício, com respostas reais comentadas.</p></div>
  <div style="position:absolute;bottom:44px;left:0;right:0;text-align:center;font-family:${v.txt};font-size:14px;color:#888">17</div>`;

const prancha = v => `<div style="width:1920px;height:1080px;background:linear-gradient(180deg,#F1F2EF,#E4E7E2);position:relative;overflow:hidden;font-family:Inter,sans-serif">
  <div style="position:absolute;left:60px;top:42px;right:60px;display:flex;align-items:baseline;gap:24px"><span style="font-family:${v.tit};font-weight:800;font-size:46px;color:${v.dk};white-space:nowrap">${v.nome}${v.grupo ? `<span style="display:block;font-family:Inter;font-weight:700;font-size:14px;letter-spacing:.2em;color:#777;margin-top:6px">${v.grupo.toUpperCase()}</span>` : ''}</span><span style="font-size:18px;color:#4a4a4a;max-width:1250px;line-height:1.45">${v.conceito}</span></div>
  <div style="position:absolute;left:60px;top:150px;transform:scale(.95);transform-origin:0 0;box-shadow:0 24px 50px rgba(0,0,0,.28)">${caixa(W, H, v.capa(v))}</div>
  <div style="position:absolute;left:800px;top:175px;transform:scale(.5);transform-origin:0 0">${livro3d(v)}</div>
  <div style="position:absolute;left:1180px;top:175px;transform:scale(.46);transform-origin:0 0;display:flex;gap:40px">${caixa(W, H, abertura(v))}${caixa(W, H, texto(v))}</div>
  <div style="position:absolute;left:770px;top:720px;width:1090px;display:flex;gap:50px">
    <div style="flex:1.2"><div style="font-weight:700;font-size:14px;letter-spacing:.16em;color:#666">CORES</div>
      <div style="display:flex;gap:10px;margin-top:12px">${v.cores.map(([n, c]) => `<div style="flex:1"><div style="height:84px;border-radius:12px;background:${c};border:1px solid rgba(0,0,0,.08)"></div><div style="font-size:13px;font-weight:600;margin-top:6px">${n}</div><div style="font-size:12px;color:#777">${c}</div></div>`).join('')}</div>
      <div style="height:70px;border-radius:12px;margin-top:16px;overflow:hidden;position:relative">${fundo(v)}</div></div>
    <div style="flex:1"><div style="font-weight:700;font-size:14px;letter-spacing:.16em;color:#666">FONTES</div>
      <div style="font-family:${v.tit};font-weight:800;font-size:46px;margin-top:10px;color:${v.dk};line-height:1.05">Aa · O segredo</div><div style="font-size:14px;color:#666;margin-top:4px">${v.tipos[0]} — títulos</div>
      <div style="font-family:${v.txt};font-size:21px;margin-top:16px;color:#333">Texto corrido e boxes</div><div style="font-size:14px;color:#666;margin-top:4px">${v.tipos[1]}</div></div></div>
</div>`;

const head = `<meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?${FONTES}&display=swap" rel="stylesheet"><style>*{box-sizing:border-box;margin:0}body{margin:0;-webkit-font-smoothing:antialiased}</style>`;
const launch = {};
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
if (process.env.RENDER_PROXY) Object.assign(launch, { proxy: { server: process.env.RENDER_PROXY }, args: ['--ignore-certificate-errors'] });
const browser = await chromium.launch(launch);
const out = path.join(root, 'saida'); fs.mkdirSync(out, { recursive: true });
const foto = async (html, w, h, arq, escala = 1) => {
  const f = path.join(out, 'tmp.html'); fs.writeFileSync(f, `<!doctype html><html><head>${head}</head><body>${html}</body></html>`);
  const p = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: escala });
  await p.goto('file://' + f); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
  await p.screenshot({ path: path.join(out, arq), clip: { x: 0, y: 0, width: w, height: h } }); await p.close();
};
const so = process.argv.slice(2);
for (const [i, v] of V.entries()) {
  if (so.length && !so.includes(v.id)) continue;
  await foto(prancha(v), 1920, 1080, `${i + 1}-${v.id}-prancha.png`);
  await foto(caixa(W, H, v.capa(v)), W, H, `${i + 1}-${v.id}-capa.png`, 1890 / W);
  await foto(aberta(v), W * 2 + LOMBADA, H, `${i + 1}-${v.id}-capa-aberta.png`, 2);
}
fs.rmSync(path.join(out, 'tmp.html'));
await browser.close();
console.log('ok');
