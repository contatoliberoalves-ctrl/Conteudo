# Pauta · estúdio de conteúdo jurídico (PratFlix)

Plataforma de produção de conteúdo com cronograma de 6 meses para advogados e estudantes, com várias contas (marcas), visualizador de peças, Insights, Analytics e gamificação (XP, níveis, missões e conquistas). App de página única, sem servidor: os dados ficam no navegador (localStorage) e podem ser exportados/importados em JSON; o calendário sai em .ics.

- `src/areas.js`: 16 áreas de atuação, 10 temas cada (tema, dúvida comum e mito). **É aqui que se acrescentam temas.**
- `src/conteudo.js`: formatos, pilares, 10 modelos de ideia, ideias gerais, datas, 6 fases e 26 semanas com tarefas, ganchos, CTAs, guias do Estúdio, regras de ética (Provimento 205/2021), paletas e fontes.
- `src/app.js`: cadastro inicial, gerador do plano, roteiros e legendas, telas (Painel, Cronograma, Calendário, Produção, Banco de ideias, Roteiros, Estúdio, Ética, Perfil, Métricas, Modelos, Ajustes).
- `python3 montar.py` → `dist/pauta.html` (arquivo único para subir no servidor, ex.: `/pratflix/pauta/index.html`) e `dist/artifact.html` (prévia).

Próximas etapas previstas: modelos de posts, capas de destaque e stories na seção Modelos (já usam a paleta e as fontes escolhidas em Perfil); login com a conta da PratFlix (Supabase) para salvar na nuvem.
