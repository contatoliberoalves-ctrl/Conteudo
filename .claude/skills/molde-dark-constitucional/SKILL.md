---
name: molde-dark-constitucional
description: Roteiriza e gera Reels/Shorts 9:16 (1080×1920, MP4 com legenda, trilha e efeitos, voz opcional do ElevenLabs) no molde "Dark Constitucional", do perfil dark de Direito Constitucional do Líbero (história, curiosidades, polêmicas e julgamentos contados como mistério, identidade "arquivo à noite"). Use quando pedirem vídeo, reel, short ou roteiro do perfil dark / Arquivo Constitucional, ou "faz o vídeo da pauta N".
---

# Dark Constitucional: do tema ao MP4

Perfil sem rosto. Promessa: **"a história do Brasil que só a Constituição explica"**. Cada vídeo é um mistério de 40 a 65 s que termina na regra jurídica. Plano editorial completo (42 pautas do dossiê reescritas, 22 novas, formatos, calendário): https://claude.ai/artifact/EshZgJrAYR72ZZRbXTR798. O dossiê original (`Dossie_Constitucional_42_Pautas.docx`) fica com o usuário, fora do git: peça quando precisar dos fatos de uma pauta.

O molde fica em `moldes/dark-constitucional/` (Remotion). Os roteiros são `roteiros/<nº>-<slug>.json`.

## Fluxo de um vídeo

1. **Fatos.** Junte data, número, artigo e decisão da pauta numa lista com fonte (dossiê, Planalto, STF, Senado, Câmara, TSE). Nada aparece na tela ou na fala sem fonte. Leia `referencias/checagem.md`.
2. **Roteiro.** Escreva primeiro a última frase (a que volta para o gancho) e o gancho; depois o meio com "mas" e "então". Leia `referencias/ganchos.md`, `referencias/historia.md` e `referencias/texto-ptbr.md`. Orçamento: ~2,5 palavras por segundo de fala, 110 a 160 palavras no total.
3. **Mostre o roteiro ao usuário antes de gerar voz** (a voz custa crédito). Formato: tabela cena · tela · fala.
4. **Voz** (se houver chave): `node scripts/voz.mjs <id>` (veja "Voz").
5. **Gerar:** `node render.mjs <id>` (ou `--rapido` para só os quadros de conferência, sem MP4; `--sem-voz` ignora a voz gravada).
6. **Conferir** os quadros `saida/<id>/<n>.png` (um por cena) e pelo menos 2 quadros do meio de cenas animadas (`ffmpeg -v error -ss <seg> -i saida/<id>/video.mp4 -frames:v 1 x.png`). Texto cortado, legenda tapando gráfico ou número errado: corrija e gere de novo.
7. **Entregar:** envie `saida/<id>/video.mp4` ao usuário (SendUserFile) com o texto de `saida/<id>/legenda.txt` pronto para colar.

Comando no ambiente em nuvem: o `render.mjs` acha sozinho o `headless_shell` em `/opt/pw-browsers`. Um vídeo de 60 s leva uns 3 a 4 minutos (4 núcleos): rode em segundo plano. Não use `gl: "swangle"`, que deixa 5× mais lento.

## O roteiro (`roteiros/<id>.json`)

```json
{
  "pauta": 15, "serie": "Na urna", "titulo": "298 a 65. E perdeu.",
  "cenas": [ { "tipo": "gancho", "texto": "298 a 65.\nE **perdeu.**", "fala": "Duzentos e noventa e oito a favor…" } ],
  "legenda": "texto do post", "fontes": ["STF · ADI 939"], "hashtags": ["direitoconstitucional"],
  "voz": false
}
```

- `fala` é o que a voz diz e vira a legenda queimada. Sem voz, a legenda sozinha conta a história (por isso escreva a fala completa mesmo assim). Escreva números como se fala ("trezentos e vinte", "oitenta e quatro") para a voz não errar.
- `texto` e demais campos aparecem na tela. `\n` quebra linha; `**trecho**` pinta de vermelho lacre. **Um trecho vermelho por cena, no máximo.**
- `seg` (opcional) força a duração mínima da cena sem voz. Sem `seg`, a duração sai do tamanho da fala.
- `"voz": false` no roteiro gera sem voz mesmo com áudio gravado.

### Tipos de cena (os formatos do plano)

| tipo | campos | uso |
|---|---|---|
| `gancho` | `texto` (até 3 linhas curtas), `selo?` (carimbo, ex. ano), `imagem?` = `{arquivo, credito, foco?, zoom?}` | sempre a 1ª cena. **Com `imagem` vira a capa**: foto em tela cheia (sépia, zoom lento), título condensado em caixa alta e o trecho `**…**` numa tarja vermelha. `foco` é o `object-position` (para foto deitada, só o X muda o corte; com `zoom` > 1 a imagem amplia a partir do `foco` e o Y também passa a valer) |
| `frase` | `texto`, `data?` (rótulo acima), `nota?` (texto menor abaixo) | contexto, virada, conclusão |
| `placar` | `a`, `b`, `rotuloA`, `rotuloB`, `titulo?`, `linha?` (corte), `rotuloLinha?`, `linhaEm?`, `carimbo?` | "Placar": número que parece decidido e a linha que muda tudo |
| `cedula` | `titulo?`, `pergunta`, `opcoes` (2–3), `vencedor?`, `resultados?`, `revelaEm?`, `contagem?` (false tira o 3-2-1) | "Cédula": o público vota antes do resultado |
| `documentos` | `a` e `b` = `{cabecalho, texto}`, `ponte?` (rótulo entre as folhas), `segundoEm?` | "Dois documentos": texto datilografado, `**trecho**` vira marca-texto |
| `cartas` | `cartas: [{titulo, sub?, marcada?}]` (2–4), `dono?` (carimbo), `marcaEm?` | "Cartas na mesa": quem fica com qual poder |
| `pausa` | `texto` (a pergunta), `rotulo?` | "Porta congelada": para tudo antes da decisão |
| `linha` | `marcos: [{data, texto}]` (2–4), `virada?` (índice em vermelho) | "Linha do tempo" |
| `pergunta` | `texto`, `rotulo?` ("Comenta"), `loop?` (false desliga) | sempre a última; no fim volta ao gancho para o vídeo rodar em loop |

**Momentos** (`linhaEm`, `revelaEm`, `segundoEm`, `marcaEm`): prefira a **palavra da fala** em que o evento acontece (`"linhaEm": "trezentos"`): a animação cai na palavra, com voz ou sem. Número = segundos desde o início da cena. Sem nada: a cédula faz o 3-2-1 depois da última palavra e então revela (a cena ganha 4,6 s; com `"contagem": false`, revela logo e ganha 2,2 s); os outros usam uma fração da cena.

Limites que cabem: gancho até ~14 caracteres por linha para ficar enorme (passa disso, a fonte diminui); `documentos` até ~170 caracteres por folha; `linha` até 4 marcos com texto de 1–2 linhas; cartas `titulo` até ~12 caracteres.

## Capa e imagens

Todo vídeo novo leva capa com foto (`imagem` no gancho). O `render.mjs` grava `saida/<id>/capa.jpg` (o gancho montado), para escolher como capa no Instagram e no TikTok. O título fica entre y 760 e 1250, dentro do corte 3:4 da grade do Instagram.

- Use foto real de arquivo: retrato de época, foto histórica, prédio, documento. Nada de imagem inventada que pareça registro real.
- Só domínio público, CC0, CC BY ou CC BY-SA, com o crédito em `credito` (aparece no rodapé da capa). Pessoa viva identificável só se for figura pública no exercício do cargo.
- Onde achar: Openverse (`api.openverse.org/v1/images/?q=...&license_type=commercial,modification`, filtre `&source=flickr` quando o Wikimedia bloquear o IP), Arquivo Nacional e Senado Federal no Flickr, Agência Brasil. O Wikimedia (API e arquivos) costuma responder 429 neste ambiente; o Flickr também bloqueia depois de muitos downloads seguidos, então baixe pouco e espaçado.
- Guarde em `public/imagens/<nome>.jpg` (até 1400 px) e confira o corte em `--rapido` antes de gerar.

## Voz (ElevenLabs)

`node scripts/voz.mjs <id> [--custo] [--refazer]` gera `public/voz/<id>/<n>.mp3` e o alinhamento por caractere (fora do git), uma cena por chamada, com cache: só regrava cena cuja fala mudou. `--custo` só conta os caracteres. `node scripts/voz.mjs --vozes` lista as vozes da conta.

- A chave vai como segredo de rede para `api.elevenlabs.io` (peça com `request_credential`; nunca no chat). O script manda `xi-api-key` com a variável `ELEVENLABS_API_KEY` ou um valor de mentira, que o proxy troca pela chave.
- Voz e modelo ficam em `config.json` (`voz.vozId`, `voz.modelo`): hoje Victor Power (pt-BR) com `eleven_multilingual_v2`, velocidade 1,12; o plano é o Creator (131 mil caracteres/mês, ~800 por vídeo). `eleven_flash_v2_5` custa 0,5 crédito por caractere; `eleven_multilingual_v2`, 1. Um Reel de 60 s tem ~900 caracteres.
- Só grave depois do roteiro aprovado.

## Identidade

"Arquivo à noite" (`src/theme.ts`): fundo quase preto com pautas de papel e grão, papel envelhecido nos documentos e cédulas, **um** vermelho lacre (carimbos, linha de corte, palavra-chave), Old Standard TT nos títulos, IBM Plex Sans Condensed na legenda, IBM Plex Mono em rótulos. Marca no topo vem de `config.json` (`marca`) ou do campo `marca` do roteiro. Trilha e efeitos são sintetizados por `scripts/sons.mjs` (o `render.mjs` cria na primeira vez).

Nada de foto de pessoa com direito autoral. O perfil não se identifica com o Líbero.

## Galeria

O molde entra na Galeria do Líbero (`galeria/galerias.json`). Os quadros `saida/<id>/<n>.png` fazem o papel dos slides; o MP4 vai ao usuário por arquivo.
