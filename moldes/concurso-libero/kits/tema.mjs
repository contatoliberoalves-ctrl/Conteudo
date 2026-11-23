// Identidade da linha "Do Edital à Prova" (kits de edital do Concurso com Líbero). A estrutura é a mesma em todos
// os concursos (Big Shoulders Display + Inter + Sora, capa escura, páginas em papel, símbolo verde da plataforma);
// cada concurso tem um tema: cores, textura e carimbo próprios. Não repita cor nem textura da Revisão em Dicas
// (ENAM marinho e dourado; TCE MA bordô e coral com azulejo; TJRS verde-mate e amarelo com guilhoché).
// unificado-ma = azul de lagoa, turquesa e areia, com as dunas dos Lençóis Maranhenses e carimbo cor de sol.
// pc-pe = carvão, vermelho e papel de cordel, com cortes de xilogravura (a gravura do cordel nordestino) e carimbo creme.
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
export const tex = (c, cor, op, lado) => ({ dunas, xilo }[c.textura] || dunas)(cor, op, lado);
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Carimbo redondo com a data da prova (mesmo desenho da Revisão em Dicas).
export const carimbo = ({ px = 150, cor, topo, base, centro, sub, giro = -12, id = 'c' }) => `<svg width="${px}" height="${px}" viewBox="0 0 200 200" style="display:block;transform:rotate(${giro}deg)"><defs><path id="${id}a" d="M100 100m-74 0a74 74 0 1 1 148 0"/><path id="${id}b" d="M100 100m-82 0a82 82 0 0 0 164 0"/></defs><circle cx="100" cy="100" r="95" fill="none" stroke="${cor}" stroke-width="5"/><circle cx="100" cy="100" r="60" fill="none" stroke="${cor}" stroke-width="2.5"/><text font-family="Sora,sans-serif" font-weight="700" font-size="15.5" letter-spacing="3" fill="${cor}"><textPath href="#${id}a" startOffset="50%" text-anchor="middle">${esc(topo)}</textPath></text><text font-family="Sora,sans-serif" font-weight="700" font-size="15.5" letter-spacing="3" fill="${cor}"><textPath href="#${id}b" startOffset="50%" text-anchor="middle">${esc(base)}</textPath></text><text x="100" y="${sub ? 108 : 116}" text-anchor="middle" font-family="Big Shoulders Display,sans-serif" font-weight="900" font-size="50" fill="${cor}">${esc(centro)}</text>${sub ? `<text x="100" y="130" text-anchor="middle" font-family="Sora,sans-serif" font-weight="700" font-size="12.5" letter-spacing="2" fill="${cor}">${esc(sub)}</text>` : ''}</svg>`;
