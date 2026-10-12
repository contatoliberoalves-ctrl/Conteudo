---
name: molde-renato
description: Gera peças do curso Interpretação Bíblica, do Pastor Renato Torres, na identidade "Brasa" (degradê laranja, creme e carvão, Bricolage Grotesque, símbolo em V no canto inferior direito): carrossel 4:5 (renato-carrossel), stories (renato-stories), slides de aula 16:9 e miniaturas do YouTube (renato-aula), cabeçalhos de e-mail (renato-email) e o manual da identidade (renato-identidade). Use quando pedirem post, story, aula, e-mail ou material do Pastor Renato / Interpretação Bíblica.
---

# Moldes do Pastor Renato (Interpretação Bíblica · identidade Brasa)

Base comum: `moldes/renato-comum/` (`brasa.mjs`: cores, fontes, logo, símbolo; `render-base.mjs`). O símbolo fica em `moldes/renato-comum/assets/simbolo.png`, **fora do git**. Numa sessão nova, peça a imagem do símbolo em fundo branco e rode `python3 moldes/renato-comum/preparar_simbolo.py <imagem>`. Copie também o resultado para `identidades/interpretacao-biblica/assets/simbolo.png`, se for gerar o manual.

Só se edita o `dados.json` de cada molde. Nos textos, `**negrito**` e `[[destaque]]` (caixa carvão no degradê; caixa laranja no creme e no carvão). Cada slide aceita `fundo` (`degrade`, `creme`, `carvao`) e `ts` (tamanho do título).

| molde | tamanho | tipos de slide |
|---|---|---|
| `renato-carrossel` | 1080×1350 | `capa` (kicker, titulo, texto), `texto` (kicker, titulo, texto[]), `lista` (kicker, titulo, itens[]), `versiculo` (kicker, texto, ref), `cta` (titulo, texto, botao) |
| `renato-stories` | 1080×1920 | `logo` (texto, botao), `versiculo` (texto, ref, botao), `aviso` (titulo, texto, botao), `lista` (titulo, itens, botao) |
| `renato-aula` | 1920×1080 (ou 1280×720 com `"formato": "youtube"`) | `capa` (kicker, titulo), `conteudo` (kicker, titulo, texto, cartao {titulo, itens}), `lista` (kicker, titulo, itens: 2 colunas), `citacao` (kicker, texto, ref), `fim` (kicker, titulo, texto, botao); YouTube: `thumb` (kicker, titulo) |
| `renato-email` | 1200×400 (`faixa`) ou 1200×640 (`"estilo": "completo"`) | um por post: `titulo`, `fundo`, e no completo `texto` e `botao` |
| `renato-identidade` | 1920×1080 | gera o kit (`identidades/interpretacao-biblica/brasa.mjs`) e põe o manual na galeria |

Regras: versículos sempre com a referência e na tradução indicada pelo autor (os exemplos usam a Almeida Revista e Atualizada); não inventar preços ou datas da oferta.

Gerar: `cd moldes/<molde> && CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs [id]`. O script precisa terminar com ✓ (com `!`, encurte o texto ou diminua `ts`). Depois, atualize a galeria principal (seção "Pastor Renato") pelo `galeria/atualizar.py <molde>` e faça commit.
