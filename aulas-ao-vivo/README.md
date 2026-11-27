# Jogos da Ordem · Arena ao vivo do Método VDE

Sistema de aula interativa: o professor apresenta os desafios numa tela 16:9 (transmitida pelo StreamYard), os alunos respondem pelo celular com nome + e-mail do VDE, e ao revelar o gabarito cada aluno vê na hora o que acertou, quanto acertou, os pontos e o ranking.

Site estático (sem etapa de build): Preact + htm, Supabase (banco, tempo real e login do professor). Os arquivos de `vendor/` são cópias fixas das bibliotecas.

## Telas

| Endereço | Quem usa | O que faz |
|---|---|---|
| `/#/entrar/CODIGO` (ou `/?sala=CODIGO`) | aluno | entrada: código, nome, e-mail do VDE |
| `/#/sala/CODIGO` | aluno | responde, vê o gabarito, pontos, sequência e ranking; botão do Índice Remissivo |
| `/#/tela/CODIGO` | professor | tela de transmissão 1920×1080: sala de espera com QR code, pergunta com cronômetro, revelação com % da turma, placar e pódio |
| `/#/admin` | professor | aulas, editor de desafios, salas e resultados (CSV), lista de alunos VDE |
| `/#/admin/sala/CODIGO` | professor | controle remoto (bom no celular) e resultados da sala |
| `/#/indice` | todos | Índice Remissivo Virtual (1.361 verbetes) |

Atalhos na tela de transmissão: **espaço / →** avança (abrir respostas → encerrar tempo → revelar → placar → próxima), **T** +15 s, **V** vinheta de abertura, **S** sons, **F** tela cheia, **L** volta à sala de espera. O tempo fecha sozinho quando acaba ou quando todos respondem.

## Jogos da Ordem (camada de jogo)

Temática autoral: o aluno é **convocado** pela sua **Seccional** (as 27 da OAB), enfrenta **provas** na arena e sobe de **patente** a cada prova gabaritada (Inscrito(a) → Examinando(a) → Aprovado(a) na 1ª fase → Combatente da 2ª fase → Advogado(a) da Ordem → Conselheiro(a) Seccional → Lenda da Ordem). Sequência de acertos = "em brasa". O placar traz a **Disputa das Seccionais** (média de pontos por examinando) e o pódio final anuncia a campeã ou campeão. Emblema próprio (balança com chama, `js/jogos.js`), brasas animadas nas telas escuras e o lema "Que o artigo certo esteja sempre ao seu alcance."

Sons (`sons/`, compostos por síntese para o projeto, `vinheta.mp3` 7 s e `revelar.mp3`):
- **Convocação**: na primeira entrada de cada aluno numa sala, a vinheta toca inteira (não dá para pular) com a cena "A Seccional X convoca: NOME". Liga/desliga por aula no editor.
- **Tela de transmissão**: V toca a abertura "Que comecem os Jogos da Ordem" (para a live, compartilhe a guia com áudio no StreamYard); o som de revelação toca a cada gabarito; S liga/desliga.

## Tipos de desafio

- `ce` certo ou errado · `multipla` múltipla escolha · `multi` marque todas as corretas · `ordenar` coloque em ordem
- `artigo` caça ao artigo (correção por artigo, inciso, parágrafo e alínea; só o artigo vale 50%)
- `texto` resposta curta (palavras-chave, sinônimos com `|`)
- `etapas` desafio em etapas, com qualquer um dos tipos acima em cada etapa. É a base da **construção do raciocínio** e da **identificação e estruturação da peça** (o painel já traz os modelos).

Pontos: proporcional ao acerto, mais até 25% de bônus de velocidade quando acerta 100%.

## Banco (Supabase)

Projeto `loqepvclohxogkvvnggs`, tabelas com prefixo `aovivo_` (SQL em `supabase/`). O gabarito fica numa coluna que só o professor lê; o aluno só recebe pela função `aovivo_estado` depois da revelação. Quem pode entrar no painel: tabela `aovivo_admins` (e-mail da conta do Supabase Auth do projeto).

Aulas de exemplo (OAB 47): `dados/exemplos.json`, importáveis pelo botão "Importar JSON" do painel.

## Publicar

Qualquer hospedagem estática serve. Na Vercel: New Project → este repositório → Root Directory `aulas-ao-vivo` → Framework "Other", sem build → Deploy.

Para o link de acesso por e-mail do painel funcionar, adicione o endereço publicado em Supabase → Authentication → URL Configuration → Redirect URLs.

## Testar localmente

```bash
cd aulas-ao-vivo && python3 -m http.server 8765
```
Abra http://localhost:8765/#/admin.
