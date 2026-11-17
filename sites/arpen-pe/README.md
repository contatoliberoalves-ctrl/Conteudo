# Site da ARPEN Pernambuco

Portal público (capa, espaço do cidadão, notícias, orientações, materiais), área do aluno (cursos, sala de aula com reprodutor, índice clicável e anotações) e painel da equipe.

- `src/`: código-fonte (`site.css`, `corpo.html` e os scripts `base`, `dados`, `publico`, `membros`, `painel`, `rota`).
- `python3 sites/arpen-pe/montar.py` gera `index.html` (site completo; hospede junto com a pasta `img/`) e `previa.html` (prévia no claude.ai, fora do git).
- Os dados ficam no navegador (`localStorage`). Para ligar a um servidor com login, troque `Banco.ler/gravar` e `Eu.ler/gravar` em `src/base.js`.
- Vídeo do YouTube: o painel aceita qualquer link; o índice é colado no formato `00:00 Assunto` (o mesmo da descrição do YouTube).
