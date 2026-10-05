# Passo a passo (@constitucionalgabaritado)

Um rito em etapas (PEC, impeachment, lei ordinária, veto, ADI no STF…).

Base comum em `../cg-comum/base.mjs` (cores e fontes do @constitucionalgabaritado: base `#1c1f1e`, verde `#3b4c49`, verde-claro `#9be0a3`, gelo `#f6f7f6`; Bebas Neue + Poppins; fundo de colmeia; textura). Gerado por `../libero-comum/render-base.mjs`: `node render.mjs [id]` (nuvem: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]`). Saída em `saida/<id>/`.

Em todo slide: `tipo`, `tema` (`verde`, `base` ou `gelo`; nunca 3 iguais seguidos), `kicker`, `titulo` (linhas; `**negrito**`, `{{verde}}`, `[[caixa]]`; `ts` = px).

Slides comuns (cg-comum): `texto` (texto, artigo) · `destaque` (`grande`: número ou palavra gigante, titulo, texto, artigo) · `lei` (citacao literal, fonte, traducao) · `lista` (itens, `numerada`) · `pegadinha` (`selo`, texto, artigo) · `cta` (texto, botao).

Fotos do autor (fora do git): `fotos/` do molde, `../carrossel-libero/fotos` ou `../carrossel-explicativo/fotos`.

## Campos do carrossel
- `etapas`: [{`nome`, `quorum`, `resumo`}] (alimentam a trilha da capa, dos slides de etapa e do resumo).

## Tipos próprios
- `capa`: `selo` (padrão "Passo a passo"), `titulo`, `sub`, `foto` (círculo com o rosto; `fotoPos`, `fotoZoom`).
- `etapa`: `etapa` (nº, 1 = primeira), `titulo`, `quorum` (gigante, ex.: "3/5"), `quorumTexto`, `texto`, `artigo`.
- `trilha`: o rito inteiro com o resumo de cada etapa.
