# PratFlix · telas novas da plataforma (07/11/2026)

Arquivos para subir na pasta `/pratflix/` do servidor (liberofilho.com). Faça backup do `app.js` e do `aulas.html` atuais antes.

| arquivo | o que é |
|---|---|
| `aulas.html` | substitui o atual: carrega `pratica.css`, a fonte Big Shoulders e o `app.js` com versão nova (limpa o cache) |
| `app.js` | substitui o atual: mesmas funções, com Biblioteca, Trilhas, Dicas e o material aberto ligados ao módulo novo e a aba **Modelos de peça** no menu (Premium e gratuito) |
| `pratica.mjs` | novo: telas de Biblioteca (capas), material aberto (etapas marcáveis, progresso, anotações), Trilhas (mapa com as capas dos cursos), Modelos de peça e Dicas (formato stories) |
| `modelos.mjs` | novo: as 11 estruturas de peça (edite aqui para incluir ou corrigir modelos) |
| `pratica.css` | novo: estilos dessas telas e **aumento dos textos em toda a plataforma** (antes havia textos de 7 a 12px) |

Nada muda no Supabase. O progresso dos checklists, as anotações e as dicas salvas ficam no navegador do aluno.

## Dicas com exemplo e tarefa
As 4 dicas atuais já aparecem com "Em vez de / Prefira / Faça hoje". Para dicas novas, escreva no texto da dica (Admin › Dicas), em linhas separadas:

    Em vez de: Ver o caso da Maria
    Prefira: Montar a linha do tempo do caso da Maria até quinta
    Faça hoje: Reescreva as três primeiras tarefas da sua lista começando por um verbo.

## Materiais da biblioteca
O material aberto transforma o texto em etapas marcáveis: blocos que começam com `1. Título`, linhas com `- item` (subitens marcáveis), `Caso fictício:`, `Atenção:`, `Exemplo:` (quadros laterais) e `Sua tarefa:` (quadro com campo de anotações).
