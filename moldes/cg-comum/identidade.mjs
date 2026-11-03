// Identidade visual única do @constitucionalgabaritado. Todos os moldes do perfil (Carrossel Explicativo,
// Carrossel Infinito, Plantão, Macete, Treino de Peças, Estrutura de Peças, Quiz Stories, Criativos)
// usam estas cores e fontes. As capas podem ter layouts diferentes; a paleta e a tipografia são sempre estas.
//
// Paleta (4 cores + o degradê):
//   escuro  #0B2619  verde mais escuro (fundos escuros, texto sobre claro)
//   verde   #1F8A55  o verde da marca (destaques, botões, barras)
//   claro   #6FD39B  verde claro (destaques sobre fundo escuro, fim do degradê)
//   branco  #FFFFFF  e o papel #F2F6F3 (fundos claros)
//   degradê suave, numa faixa estreita de verde-escuro (capas e slides de destaque)
// Fotos do autor nunca levam véu ou filtro verde: só escurecimento neutro onde há texto.
// Tipografia: Antonio (títulos, caixa alta, condensada) + Poppins (texto). Sem serifas arredondadas,
// sem títulos dentro de balões/pílulas arredondadas: títulos sempre soltos, com barra ou faixa reta.

export const CG = {
  escuro: '#0B2619',
  escuro2: '#123A27',     // cartões sobre o escuro
  verde: '#1F8A55',
  claro: '#6FD39B',
  menta: '#DDF3E5',       // fundo de caixas sobre o branco
  branco: '#FFFFFF',
  papel: '#F2F6F3',
  tinta: '#0B2619',       // texto sobre claro
  cinza: '#4F6359',       // texto secundário sobre claro
  nevoa: '#C9DCD1',       // texto secundário sobre escuro
  alerta: '#E2574C',      // só para pegadinha/erro
};
// Degradê suave: só uma variação leve do verde-escuro, sem chegar ao verde claro.
export const DEGRADE = `linear-gradient(160deg, #173F2D 0%, #1B4F37 55%, #225F40 100%)`;
export const DEGRADE_H = `linear-gradient(90deg, ${CG.escuro}, ${CG.verde})`;
export const FONTES_CG = 'https://fonts.googleapis.com/css2?family=Antonio:wght@500;600;700&family=Poppins:ital,wght@0,400;0,500;0,600;0,700;0,800;1,500&display=swap';
export const TIT_CG = "font-family:'Antonio',sans-serif;font-weight:700;text-transform:uppercase;letter-spacing:.005em";
export const TXT_CG = "font-family:'Poppins',sans-serif";
// Assinatura usada em todos os posts.
export const ARROBA = '@CONSTITUCIONAL<b style="font-weight:800">GABARITADO</b>';
