---
name: roteiro-viral
description: Escreve roteiros de Reels, TikTok, Shorts e YouTube que as pessoas assistem até o fim, para os perfis do Líbero (@constitucionalgabaritado, @liberofilho, @eticagabaritadanaoba, @concursocomlibero, Eduarda, PodConst…). Regras de gancho (clareza + curiosidade, os 4 matadores de gancho, contraste), arco de história (o vilão, o fundo do poço, a virada, o callback), re-ganchos a cada 5–8 s, regras contra texto com cara de IA, checagens de engajamento e um corretor (scripts/score.py) que dá nota a cada rascunho. Escreve, corrige e reescreve até passar. Use quando pedirem roteiro, gancho, "escreve um reels sobre X", "melhora esse roteiro", "por que esse vídeo flopou", "destrincha esse vídeo viral", ou quando um pedido do Estúdio de Vídeo precisar de roteiro. Adaptação em português da skill viral-video-writing.
argument-hint: "[tema, história, link ou o seu próprio gancho]"
---

# Roteiro viral

Vídeo viral é escrito, não é sorte. Todo vídeo que funciona tem um gancho que para a rolagem,
uma história ou uma promessa que segura a pessoa e um motivo novo para ficar a cada poucos segundos.
Esta skill escreve esse roteiro, confere e reescreve até passar.

Arquivos ao lado (leia os que o trabalho pede):
- `ganchos.md`: as regras do gancho. Clareza + curiosidade, os 4 matadores, a fórmula de 2–3 linhas, contraste, o primeiro quadro, checklist.
- `historia.md`: o arco. As 7 batidas com um exemplo real de 103 mil views, formatos de história e como pôr história dentro de uma aula curta.
- `retencao.md`: re-ganchos, ritmo, loops abertos, a barriga do meio e o final.
- `escrita.md`: frases para falar em voz alta, as regras contra texto de IA e a chamada final (CTA).
- `checagens.md`: todas as checagens num lugar só (ideia, gancho, história, retenção, IA, os 3 testes de quem assiste e como ler os números depois de postar).
- `ferramentas.md`: ferramentas para ideia, escrita, gravação, edição, som e acompanhamento, grátis primeiro.
- `scripts/score.py`: o corretor. `python3 scripts/score.py rascunho.txt` dá nota de 0 a 100 e lista cada checagem que falhou (versão em português; `scripts/score_en.py` é o original em inglês).

## As partes de todo vídeo que funciona

| # | Parte | Tempo | Função |
|---|------|------|-----|
| 1 | **Gancho** | 0–3 s | Parar a rolagem. Tema claro + uma lacuna que a pessoa precisa fechar. Número específico ou coisa com nome ajuda. |
| 2 | **O que está em jogo** | 3–8 s | Por que isso importa PARA ELA, ou quem está contra o herói (a banca, a pegadinha, o prazo). |
| 3 | **Promessa** | dentro do 1 ou do 2 | O que ela leva no fim, para esperar por isso. |
| 4 | **Batidas** | o meio | Uma ideia ou uma cena por batida. Cada uma entrega um detalhe concreto (artigo, súmula, prazo, número). |
| 5 | **Re-ganchos** | a cada 5–8 s | Pergunta nova, número, virada ou salto no tempo antes da atenção cair. |
| 6 | **Prova** | perto do fim | Um número real, um resultado real, imagem real (print da questão, da aprovação, do artigo). |
| 7 | **Fechamento + CTA** | últimos 3–5 s | Fechar o loop do gancho e um pedido claro só. Terminar na última palavra. |

Se o vídeo flopou, confira nessa ordem. Quase sempre é o gancho, 3 primeiros segundos lentos ou um meio sem re-gancho.

## O ciclo (todo passo, toda vez)

1. **Ficha de fatos.** Liste todo fato que o roteiro vai usar e de onde veio (artigo da CF, súmula, tese, link, as palavras do próprio Líbero). Se uma frase precisa de um fato que você não tem, corte ou pergunte. Nunca invente resultado, número, aprovação, citação ou perrengue. Para conteúdo jurídico, confira o artigo e a jurisprudência antes (cf. `materiais/README.md`).
2. **Escolha o formato.**
   - História pessoal ou caso: as 7 batidas de `historia.md`.
   - Lição, dica ou passo a passo: o envelope de 3 batidas de `historia.md` (o problema como um momento, a solução em passos, o depois como prova).
3. **Lista de 5 ganchos.** Julgue cada um com o checklist de `ganchos.md`. Se o usuário mandou um gancho, ele é o nº 1 e as palavras dele ficam. Ordene por clareza, curiosidade e se é verdade.
4. **Escreva 3 rascunhos**, cada um com gancho e ângulo diferentes. Shorts: 30–60 s (umas 3 a 4 palavras faladas por segundo em português; 40 s ≈ 130–150 palavras). História pode ser mais longa se cada batida aumentar o que está em jogo. Uma ideia por frase.
5. **Confira cada rascunho** com todas as seções de `checagens.md`.
   - `python3 scripts/score.py <arquivo>`
   - Cronômetro de `retencao.md`: re-gancho pelo menos a cada 8 segundos?
   - História: alguém duvidando no começo, um fundo do poço, um callback no fim?
   - `escrita.md`: uma pessoa de verdade diria cada frase em voz alta? Alguma metáfora, floreio ou palavra de IA?
   - Todo número está na ficha de fatos? O gancho é a frase mais forte?
6. **Reescreva e confira de novo.** Pegue o melhor rascunho, corrija tudo o que falhou e a batida mais fraca, rode o corretor de novo. Repita até 90+ sem nenhuma falha grave (no máximo 5 voltas). Guarde um registro curto do que mudou e por quê.
7. **Entregue:**
   - O roteiro final, uma frase falada por linha, com o tempo de cada batida.
   - 2 ganchos alternativos.
   - Legenda do post: a frase do gancho, depois o CTA, depois 3 a 5 hashtags.
   - A ficha de fatos com as fontes.
   - O texto que vai na tela (gancho escrito, no máximo 8 palavras, para funcionar sem som).
   - Se pediram gravação ou edição, aponte `ferramentas.md` e a skill `editor-reels`.

## Integração com o Estúdio de Vídeo

O Estúdio (https://claude.ai/artifact/54aB1qgWLkk6ajNfJie6FY) guarda os pedidos de vídeo na coleção `solicitacoes` do banco dele (campos `modelo`, `perfil`, `formato`, `duracao`, `voz`, `tema`, `roteiro_pedido` = `escrever` | `meu` | `gravado`, `material`, `obs`, `status`). Quando o pedido é do modelo `reels-viral` com `roteiro_pedido: "escrever"` (ou de qualquer modelo narrado sem roteiro pronto: cartoon, explicativo, documentário, caminho de luz…), escreva o roteiro com esta skill ANTES de produzir:
- Rode o ciclo acima e o corretor (`scripts/score.py`).
- Grave no próprio pedido com `ArtifactData` (update): `roteiro` (uma frase falada por linha, com os 2 ganchos alternativos e o texto de tela no fim), `nota` (a nota do corretor) e `status: "roteiro"`. O Líbero vê o roteiro e a nota no "+ Novo vídeo" do Estúdio.
- Modelos narrados: o roteiro aprovado vira as falas do `roteiro.json` do modelo.
- Talking head (Reels viral, destaque, inserções, palavra-pop…): ele grava e manda o vídeo; edite com a skill `editor-reels`.

## Vídeo longo no YouTube
Mesmas regras, maiores. Diga o que o título prometeu nos primeiros 10 segundos, mostre o resultado primeiro e dê a cada capítulo (a cada 1–3 minutos) o seu próprio gancho, fechamento e re-gancho para o próximo.

## Destrinchando o vídeo viral de outra pessoa
Quando mandarem um vídeo ou transcrição perguntando por que funcionou:
1. Escreva a transcrição com tempos (ou peça).
2. Marque cada frase com a parte da tabela acima.
3. Escreva o formato do gancho como um molde com lacunas.
4. Ache os re-ganchos e meça o intervalo entre eles.
5. Se for história, marque as 7 batidas de `historia.md`.
6. Diga o que copiar (o formato, a ordem das batidas, o ritmo) e o que não copiar (as palavras, o tema, as alegações).
7. Ofereça escrever a versão do usuário com o ciclo acima.

## Regras
- **Só números reais.** Todo número diz de onde vem.
- **O gancho do usuário ganha.** Se ele te deu um, o roteiro é construído embaixo dele.
- **Nada de texto de IA.** Leia `escrita.md` antes de cada rascunho.
- **Um CTA só.** Uma palavra-chave, uma palavra ("Comenta MS", "Comenta PEC").
- **Mostre, não alegue.** Se o roteiro diz "eu testei" ou "caiu na prova", a prova tem que aparecer na tela.
- **Identidade:** o tom de cada perfil segue o molde dele (bem-humorado com analogias no @liberofilho, direto e técnico no @constitucionalgabaritado, etc.).
