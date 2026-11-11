# Conteúdo do app Concurso com Líbero

Esta pasta é da **sessão de conteúdo**. O `index.html` e o `android/` são da **sessão do app**: não edite esses arquivos daqui (se o conteúdo pedir mudança de tela, anote na aba **App** do painel e avise o dono).

Painel: https://claude.ai/artifact/MFCNtHCctkoSsZpvMFW2hA. A aba **Conteúdo** registra o andamento, as fontes e as tarefas do Cowork; atualize-a a cada entrega.

## Como funciona
- Um arquivo por concurso (`tjsp.js`, depois `pppe.js`…), carregado pelo `index.html` antes do script principal (`<script src="conteudo/tjsp.js">`). Concurso novo: crie o arquivo e peça à sessão do app para incluir a tag.
- Cada arquivo registra uma função: `(window.CONTEUDO=window.CONTEUDO||[]).push(function(){ ... })`. Ela roda quando os dados de exemplo já existem e pode usar `C('tjsp')`, `QUESTOES` e `S`.
- Estrutura de cada matéria: `{id, nome, curto, peso (nº de questões no edital), freq (% na prova), assuntos:[{id, nome, freq (% dentro da matéria; soma 100), pontos:['Termo: explicação', ...], lei:[['Ref.', 'texto literal com <mark>grifo</mark>'], ...]}]}`. Pontos no formato "Termo: explicação" (termo com até 44 caracteres) viram flashcards.
- Questões: `{id, mat, ass, dif:'fácil'|'média'|'difícil', enun, alts:[5], gab:0-4, com:'comentário geral', coms:['por que A', ...]}`; o arquivo marca `ano:'autoral'`. Ids de assunto que mudarem precisam entrar no mapa de migração do fim do arquivo.

## Regras
- Fato de edital, salário, data: só do edital oficial, com a fonte na aba Conteúdo.
- Lei seca: texto literal baixado (`ferramentas/baixar_leis.sh` + `ferramentas/artigos.py`), nunca de memória. O Planalto bloqueia robôs; leis que faltarem viram tarefa do Cowork.
- Questões e resumos escritos pela IA são autorais e precisam da revisão do Líbero: registre o que está pendente de revisão na aba Conteúdo.
- O repositório é **público**: materiais do Líbero (Drive) entram só como adaptações curtas; volume grande ou texto integral, pergunte antes. Provas e PDFs baixados ficam fora do git.
- Antes de publicar: abra o app no navegador (Playwright, `/opt/pw-browsers/chromium`) e confira que não há erro de JavaScript e que as somas de `freq` dão 100.

## Publicar
Publique o artifact https://claude.ai/artifact/JcRDQvjc3rQzAqfLYVXSm8 com `file_path` = `app/concurso-com-libero/index.html` e `files` = `{"conteudo/tjsp.js": "app/concurso-com-libero/conteudo/tjsp.js"}` (um par por arquivo de conteúdo). Omita `capabilities` (mantém as do app) e não passe a Coleção PPPE (os arquivos já publicados continuam). Antes de dar push: `git pull --rebase` (as duas sessões usam o mesmo branch).
