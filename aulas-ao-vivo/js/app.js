import { html, render, useState, useEffect } from '../vendor/preact-htm.mjs';
import { Entrar, SalaAluno } from './aluno.js';
import { Tela } from './prof.js';
import { Admin } from './admin.js';
import { GavetaIndice } from './ui.js';

// rotas: #/entrar/COD · #/sala/COD · #/tela/COD · #/admin[/aulas|salas|alunos|aula/ID|sala/COD] · #/indice
function rotaAtual() {
  const q = new URLSearchParams(location.search).get('sala');
  if (q && (!location.hash || location.hash === '#/')) return ['#', 'entrar', q.toUpperCase()];
  return (location.hash || '#/').split('/');
}
function App() {
  const [rota, setRota] = useState(rotaAtual());
  useEffect(() => { const f = () => { setRota(rotaAtual()); scrollTo(0, 0); }; addEventListener('hashchange', f); return () => removeEventListener('hashchange', f); }, []);
  const ir = (h) => { if (location.hash === h) setRota(rotaAtual()); else location.hash = h; };
  const [, pag, arg] = rota;
  document.body.style.overflow = pag === 'tela' ? 'hidden' : '';
  if (pag === 'sala' && arg) return html`<${SalaAluno} key=${arg} codigo=${arg.toUpperCase()} ir=${ir} />`;
  if (pag === 'tela' && arg) return html`<${TelaProtegida} codigo=${arg.toUpperCase()} ir=${ir} />`;
  if (pag === 'admin') return html`<${Admin} rota=${rota} ir=${ir} />`;
  if (pag === 'indice') return html`<${GavetaIndice} aberto=${true} fechar=${() => ir('#/')} />`;
  return html`<${Entrar} key=${arg || ''} codigo=${(arg || '').toUpperCase()} ir=${ir} />`;
}
import { useSessao, Login } from './prof.js';
function TelaProtegida({ codigo }) {
  const s = useSessao();
  if (s.carregando) return null;
  if (!s.user || !s.admin) return html`<${Login} sessao=${s} />`;
  return html`<${Tela} codigo=${codigo} />`;
}
render(html`<${App} />`, document.getElementById('app'));
