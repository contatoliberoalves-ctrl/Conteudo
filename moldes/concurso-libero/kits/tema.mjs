// Identidade da linha "Do Edital à Prova" (kits de edital do Concurso com Líbero). A estrutura é a mesma em todos
// os concursos (Big Shoulders Display + Inter + Sora, capa escura, páginas em papel, símbolo verde da plataforma);
// cada concurso tem um tema: cores, textura e carimbo próprios. Não repita cor nem textura da Revisão em Dicas
// (ENAM marinho e dourado; TCE MA bordô e coral com azulejo; TJRS verde-mate e amarelo com guilhoché).
// unificado-ma = azul de lagoa, turquesa e areia, com as dunas dos Lençóis Maranhenses e carimbo cor de sol.
// pp-pe = grafite azulado, laranja de sinalização e concreto, com a muralha de blocos da unidade prisional e carimbo laranja.
// tj-pb = índigo, amarelo de sol e lilás, com o sol nascente da Ponta do Seixas (onde o sol nasce primeiro nas Américas) e carimbo amarelo.
// pc-pe = carvão, vermelho e papel de cordel, com cortes de xilogravura (a gravura do cordel nordestino) e carimbo creme.
// tj-sp = café torrado, azul cobalto e pedra, com o mosaico da calçada paulista (o mapa do estado em pedra portuguesa, de Mirthes Bernardes) e carimbo caramelo.
export const TEMAS = {
  'unificado-ma': {
    nome: 'Lagoa e areia', textura: 'dunas',
    escuro: '#082B45', escuro2: '#0C3A5C', escuro3: '#12507A', papel: '#F7F2E6', tinta: '#071E30',
    cor: '#0E9A94', corForte: '#0A6F6B', claro: '#B8ECE6', areia: '#F1DDB0', carimbo: '#F2A33A',
    cinza: '#5E6C78', corpo: '#22384A', borda: '#E3DAC4', fio: '#EDE6D4', trilho: '#EBE4D2', suave: '#8FCFC9',
    realce: '#D9F2EE', zebra: '#FBF8F0', sobre: '#F2FBFA', caixa: '#7C99A8', pauta: '#D2C9B2', fora: '#C3C6C2', neutro: '#ECE6D6',
    vazado: 'rgba(184,236,230,.26)', brilho: 'rgba(14,154,148,.30)',
  },
  'pc-pe': {
    nome: 'Cordel e distintivo', textura: 'xilo',
    escuro: '#141518', escuro2: '#1D1F24', escuro3: '#2E3038', papel: '#F6F0E4', tinta: '#141518',
    cor: '#D42A3C', corForte: '#A3192B', claro: '#F1DFC2', areia: '#F1DFC2', carimbo: '#F1DFC2',
    cinza: '#6B6660', corpo: '#2F2B28', borda: '#E4D8C2', fio: '#ECE2D0', trilho: '#EDE3D1', suave: '#E59AA2',
    realce: '#F9E1E3', zebra: '#FBF7EF', sobre: '#FFF6F2', caixa: '#A59C90', pauta: '#D6C9B2', fora: '#C9C2B8', neutro: '#EEE6D8',
    vazado: 'rgba(241,223,194,.22)', brilho: 'rgba(212,42,60,.26)',
  },
  'pp-pe': {
    nome: 'Muralha e sinal', textura: 'muralha',
    escuro: '#141C24', escuro2: '#1B2631', escuro3: '#2A3846', papel: '#F3F1EC', tinta: '#121A22',
    cor: '#E8742A', corForte: '#B9551A', claro: '#F6D2B4', areia: '#E2DDD3', carimbo: '#E8742A',
    cinza: '#66707A', corpo: '#26313B', borda: '#DDD8CE', fio: '#E8E4DC', trilho: '#E9E5DD', suave: '#F0AE80',
    realce: '#FCE6D6', zebra: '#F8F7F3', sobre: '#FFF5EE', caixa: '#98A1AA', pauta: '#CFC9BE', fora: '#C2C4C4', neutro: '#E8E5DE',
    vazado: 'rgba(246,210,180,.20)', brilho: 'rgba(232,116,42,.26)',
  },
  'tj-pb': {
    nome: 'Sol nascente', textura: 'sol',
    escuro: '#1C1838', escuro2: '#252046', escuro3: '#363062', papel: '#F6F3EC', tinta: '#17142E',
    cor: '#F2B230', corForte: '#B57A0C', claro: '#D9CFF6', areia: '#F1E4C4', carimbo: '#F2B230',
    cinza: '#686478', corpo: '#2A2640', borda: '#E2DDD0', fio: '#ECE8DE', trilho: '#EBE7DD', suave: '#F5CE7A',
    realce: '#FBEFCF', zebra: '#F9F7F1', sobre: '#FFF8E8', caixa: '#9893AA', pauta: '#D3CDBF', fora: '#C6C3C8', neutro: '#EAE6DC',
    vazado: 'rgba(217,207,246,.22)', brilho: 'rgba(242,178,48,.24)',
  },
  'tj-sp': {
    nome: 'Mosaico paulista', textura: 'mosaico',
    escuro: '#2A1B15', escuro2: '#36241C', escuro3: '#54372A', papel: '#F6F2EC', tinta: '#1E1511',
    cor: '#2F62D9', corForte: '#1D45A8', claro: '#C9D8FA', areia: '#EBD6BC', carimbo: '#E9B77F',
    cinza: '#6E655F', corpo: '#2E2520', borda: '#E3DCD2', fio: '#EDE7DE', trilho: '#ECE6DD', suave: '#93AEF0',
    realce: '#E1E9FC', zebra: '#FAF8F4', sobre: '#F4F7FF', caixa: '#A0968D', pauta: '#D6CDC0', fora: '#C7C2BE', neutro: '#EBE5DC',
    vazado: 'rgba(201,216,250,.20)', brilho: 'rgba(47,98,217,.26)',
  },
};
// Tema padrão (sem `tema` no JSON): o verde da plataforma, como no pdf.json.
export const PADRAO = { escuro: '#04312C', papel: '#F3F7F5', tinta: '#06201C', cor: '#0BA457', corForte: '#078A4A', claro: '#B9FFF1', cinza: '#5E7A74', corpo: '#1E3A35', borda: '#D7E6E2', fio: '#E1ECE8', trilho: '#E7F1EE', suave: '#9CC9B8', realce: '#DDF3E7', zebra: '#F6FAF8', sobre: '#EFFFF6', caixa: '#7FA59A', pauta: '#C9DAD5', fora: '#B9C9C4', neutro: '#E7EEEB' };

const uri = svg => `url(data:image/svg+xml,${encodeURIComponent(svg).replace(/'/g, '%27')})`;
// Dunas: cristas em arco, desencontradas de uma fileira para a outra, como as dunas vistas de cima.
export const dunas = (cor, op = .14, lado = 96) => {
  const w = lado, h = lado * .5, a = (x, y) => `<path d='M${x} ${y}Q${x + w / 4} ${y - h * .62} ${x + w / 2} ${y}'/><path d='M${x + w * .09} ${y}Q${x + w / 4} ${y - h * .34} ${x + w * .41} ${y}' stroke-opacity='${op * .55}'/>`;
  return uri(`<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h * 2}' viewBox='0 0 ${w} ${h * 2}' fill='none' stroke='${cor}' stroke-opacity='${op}' stroke-width='1.5' stroke-linecap='round'>${a(0, h)}${a(w / 2, h)}${a(-w / 4, h * 2)}${a(w / 4, h * 2)}${a(w * .75, h * 2)}</svg>`);
};
// Xilogravura: cortes curtos de goiva em faixas desencontradas, como o fundo das capas de cordel.
export const xilo = (cor, op = .16, lado = 96) => {
  const w = lado, h = lado * .75, cortes = [];
  const fila = (y, d) => { for (let x = -w * .2 + d; x < w * 1.2; x += w / 5) cortes.push(`<path d='M${x.toFixed(1)} ${(y + h * .1).toFixed(1)}l${(w * .11).toFixed(1)} ${(-h * .2).toFixed(1)}'/>`); };
  fila(h * .3, 0); fila(h * .7, w / 10); fila(h * 1.1, w / 20);
  return uri(`<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}' fill='none' stroke='${cor}' stroke-opacity='${op}' stroke-width='2.2' stroke-linecap='round'>${cortes.join('')}<circle cx='${w * .5}' cy='${h * .5}' r='1.6' fill='${cor}' fill-opacity='${op}' stroke='none'/></svg>`);
};
// Muralha: blocos de concreto em fiadas desencontradas, como o muro de uma unidade prisional.
export const muralha = (cor, op = .14, lado = 96) => {
  const w = lado, h = lado * .5, b = [];
  for (let f = 0; f < 2; f++) for (let x = f ? -w / 4 : 0; x < w; x += w / 2) b.push(`<rect x='${(x + 3).toFixed(1)}' y='${(f * h / 2 + 3).toFixed(1)}' width='${(w / 2 - 6).toFixed(1)}' height='${(h / 2 - 6).toFixed(1)}' rx='1.5'/>`);
  return uri(`<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}' fill='none' stroke='${cor}' stroke-opacity='${op}' stroke-width='1.6'>${b.join('')}</svg>`);
};
// Sol: meios-sóis nascendo, com dois arcos, em fileiras desencontradas.
export const sol = (cor, op = .14, lado = 96) => {
  const w = lado, h = lado * .6, s = (x, y) => `<path d='M${x - w * .2} ${y}a${w * .2} ${w * .2} 0 0 1 ${w * .4} 0'/><path d='M${x - w * .11} ${y}a${w * .11} ${w * .11} 0 0 1 ${w * .22} 0' stroke-opacity='${op * .6}'/>`;
  return uri(`<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}' fill='none' stroke='${cor}' stroke-opacity='${op}' stroke-width='1.6' stroke-linecap='round'>${s(w / 4, h * .45)}${s(w * .75, h)}${s(-w / 4, h)}${s(w * 1.25, h * .45)}</svg>`);
};
// Mosaico paulista: o contorno do estado de São Paulo repetido em fileiras desencontradas, como a calçada de pedra portuguesa.
export const mosaico = (cor, op = .14, lado = 96) => {
  const w = lado, h = lado * .62;
  const P = [[0, .5], [.2, .34], [.36, .2], [.58, .12], [.78, .16], [.92, .3], [1, .46], [.9, .58], [.74, .7], [.58, .86], [.46, .76], [.3, .66], [.12, .6]];
  const sp = (x, y, k) => `<path d='M${P.map(([a, b]) => `${(x + a * w * k).toFixed(1)} ${(y + b * h * k).toFixed(1)}`).join('L')}Z'/>`;
  return uri(`<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}' fill='none' stroke='${cor}' stroke-opacity='${op}' stroke-width='1.5' stroke-linejoin='round'>${sp(w * .04, -h * .04, .44)}${sp(w * .54, h * .46, .44)}${sp(-w * .46, h * .46, .44)}<circle cx='${w * .78}' cy='${h * .2}' r='1.5' fill='${cor}' fill-opacity='${op}' stroke='none'/><circle cx='${w * .28}' cy='${h * .72}' r='1.5' fill='${cor}' fill-opacity='${op}' stroke='none'/></svg>`);
};
export const tex = (c, cor, op, lado) => ({ dunas, xilo, muralha, sol, mosaico }[c.textura] || dunas)(cor, op, lado);
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Carimbo redondo com a data da prova (mesmo desenho da Revisão em Dicas).
export const carimbo = ({ px = 150, cor, topo, base, centro, sub, giro = -12, id = 'c' }) => `<svg width="${px}" height="${px}" viewBox="0 0 200 200" style="display:block;transform:rotate(${giro}deg)"><defs><path id="${id}a" d="M100 100m-74 0a74 74 0 1 1 148 0"/><path id="${id}b" d="M100 100m-82 0a82 82 0 0 0 164 0"/></defs><circle cx="100" cy="100" r="95" fill="none" stroke="${cor}" stroke-width="5"/><circle cx="100" cy="100" r="60" fill="none" stroke="${cor}" stroke-width="2.5"/><text font-family="Sora,sans-serif" font-weight="700" font-size="15.5" letter-spacing="3" fill="${cor}"><textPath href="#${id}a" startOffset="50%" text-anchor="middle">${esc(topo)}</textPath></text><text font-family="Sora,sans-serif" font-weight="700" font-size="15.5" letter-spacing="3" fill="${cor}"><textPath href="#${id}b" startOffset="50%" text-anchor="middle">${esc(base)}</textPath></text><text x="100" y="${sub ? 108 : 116}" text-anchor="middle" font-family="Big Shoulders Display,sans-serif" font-weight="900" font-size="50" fill="${cor}">${esc(centro)}</text>${sub ? `<text x="100" y="130" text-anchor="middle" font-family="Sora,sans-serif" font-weight="700" font-size="12.5" letter-spacing="2" fill="${cor}">${esc(sub)}</text>` : ''}</svg>`;
