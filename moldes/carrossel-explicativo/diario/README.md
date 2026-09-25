# Gerador do "Meu Diário Constitucional"

Transforma o documento do Diário (formato Dica de ouro · Explicação · Tabelinha · Questão · Gabarito) em carrosséis
`diario-<dia>-…` do molde Carrossel Explicativo. O texto do documento **não fica no repositório**: peça o .docx ao usuário.

Rodar numa pasta temporária (fora do repo), com o .docx:

1. `python3 docx2md.py Diario.docx > esboco.md` — texto com as tabelas preservadas.
2. `python3 parse_esboco.py esboco.md` — gera `esboco.json` (um item por dia).
3. Copie `ajustes.json` para a pasta; edite `CAPA` e `FOTOS` em `build_diario.py` para os dias novos.
   `python3 build_diario.py` — gera `diario_posts.json`.
4. `python3 fit.py` — junta ao `dados.json`, gera os PNGs e ajusta o que não cabe: primeiro deixa o slide compacto,
   depois corta parágrafos da Explicação/itens da Tabelinha (anota em `cortes.json`). Nunca corta a questão.
   O que ainda sobrar sai em "restam": use `ajustes.json` (`q3`: "enunciado" | "afirmativas" | "alternativas" dá
   um slide a mais para a questão e tira a Tabelinha).

Estrutura de cada carrossel: capa → Dica de ouro → Explicação → Tabelinha → Questão → Alternativas → CTA.
O gabarito vai para `saida/<id>/gabarito.txt` (não aparece nos slides).
