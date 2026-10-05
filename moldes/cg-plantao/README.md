# Plantão Constitucional (@constitucionalgabaritado)

Direito Constitucional no noticiário (quem escolhe o Presidente do Senado, quem assume, CPI, MP, impeachment…).

Base comum em `../cg-comum/base.mjs` (cores e fontes do @constitucionalgabaritado: base `#1c1f1e`, verde `#3b4c49`, verde-claro `#9be0a3`, gelo `#f6f7f6`; Bebas Neue + Poppins; fundo de colmeia; textura). Gerado por `../libero-comum/render-base.mjs`: `node render.mjs [id]` (nuvem: `CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]`). Saída em `saida/<id>/`.

Em todo slide: `tipo`, `tema` (`verde`, `base` ou `gelo`; nunca 3 iguais seguidos), `kicker`, `titulo` (linhas; `**negrito**`, `{{verde}}`, `[[caixa]]`; `ts` = px).

Slides comuns (cg-comum): `texto` (texto, artigo) · `destaque` (`grande`: número ou palavra gigante, titulo, texto, artigo) · `lei` (citacao literal, fonte, traducao) · `lista` (itens, `numerada`) · `pegadinha` (`selo`, texto, artigo) · `cta` (texto, botao).

Fotos do autor (fora do git): `fotos/` do molde, `../carrossel-libero/fotos` ou `../carrossel-explicativo/fotos`.

## Tipos próprios
- `capa`: `selo` (padrão "PLANTÃO CONSTITUCIONAL"), `titulo` (cada linha numa faixa verde), `pergunta` (pílula), `fotos` (1 ou 2 recortes PNG sem fundo das autoridades, em `fotos/`: saem em preto e branco; `alturaFotos`) ou `icone` (`congresso`, `stf`, `planalto`) quando não houver foto.
- `linha`: passos ligados por uma linha (`itens`: [{`titulo`, `texto`, `artigo`, `n`}], `atual` acende um passo).
