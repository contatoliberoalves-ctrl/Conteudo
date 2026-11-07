# PratFlix · apresentação da plataforma

Página única (HTML) que apresenta a PratFlix e simula, numa janela da plataforma, as abas
Biblioteca (capas e checklist interativo), Trilhas (mapa de percurso), Modelos de peça,
Dicas práticas (formato stories) e Comunidade. Identidade do molde `pratflix`: grafite,
areia, Big Shoulders Display nos títulos e Manrope no texto.

- Edite `fonte.html` (conteúdo nas constantes `COURSES`, `LIB`, `PATHS`, `MODELS`, `TIPS`, `POSTS` do script).
- `python3 montar.py` gera `PratFlix_Apresentacao.html` (arquivo único, imagens embutidas) e
  `saida/artifact.html` (versão para publicar como Artifact; fora do git).
- Cursos, professores e as 4 primeiras dicas vêm da plataforma real (Supabase `pf_courses` e `pf_tips`, nov/2026).
  Os modelos de peça estão marcados "Em produção" e as conversas da comunidade são exemplos de formato.
- Fotos em `img/` são as da própria plataforma (liberofilho.com/pratflix/assets).
