---
name: molde-entre-notas
description: Gera a identidade visual e as peças do podcast "Entre notas e registros", da ANOREG/PE (Notários e Registradores de Pernambuco): símbolo (selo notarial com onda sonora e pena), logotipo, avatar, capa do podcast 3000×3000, posts e stories de episódio, citação, capa de Reels, miniatura e banner do YouTube, fundo de gravação, tarja de convidado e o manual em PDF. Use quando pedirem algo do podcast Entre notas e registros ou do podcast da ANOREG/PE.
---

# Entre notas e registros (podcast da ANOREG/PE)

Tudo sai de um arquivo só: `identidades/entre-notas-e-registros/kit.mjs`. O molde `moldes/entre-notas-identidade/` roda o kit e põe as pranchas do manual na galeria principal (seção "ANOREG/PE").

## Identidade
- **Símbolo:** selo de cartório (borda recortada de 28 pontas, aro duplo) com seis barras de onda sonora e a pena de escrever no centro, em ouro. Desenhado em SVG no próprio kit (função `simbolo(px, {cor, pena, aro})`), não depende de arquivo externo.
- **Logotipo:** `entre` / `NOTAS` / `e REGISTROS` em Fraunces (800 caixa alta + itálico 400 dourado nos conectivos) e a assinatura `PODCAST · ANOREG/PE`. Versões `logo` (vertical), `logoH` (horizontal) e `linha` (uma linha).
- **Cores:** tinta `#0F1E36`, noite `#0A1527`, ouro `#E2A63B`, papel `#F5EFE4`, lacre `#B8432F` (só detalhes: margem do livro, assinatura de citação).
- **Texturas:** pautas finas do livro de registro e a margem vermelha à esquerda; barras de onda sonora como ornamento.
- **Texto:** Inter.

## Peças (`P` no kit)
`avatar-instagram`, `avatar-claro`, `capa-podcast` (+ `capa-podcast-3000.png`), `post-episodio`, `post-frase`, `post-novo-ep`, `story-episodio`, `reels-capa`, `thumb-youtube`, `banner-youtube` (2560×1440, conteúdo na área segura 1546×423), `fundo-gravacao`, `tarja-convidado` (fundo transparente). As peças de episódio usam o marcador "FOTO DO CONVIDADO": para um episódio real, troque `foto(...)` por um `<img>` recortado da foto enviada (fotos de terceiros não vão para o git).

## Gerar
```
cd moldes/entre-notas-identidade && CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY node render.mjs
```
Saída (fora do git): `identidades/entre-notas-e-registros/saida/` com `logos/` (PNG sem fundo), `pecas/`, `pranchas/` e o PDF do manual. Depois: `python3 galeria/atualizar.py entre-notas-identidade`, publique a galeria e faça commit.

## Opções de logo
`identidades/entre-notas-e-registros/opcoes.mjs` gera o PDF de apresentação com 6 caminhos (1 Selo sonoro, 2 Microfone pautado, 3 Diálogo, 4 Livro sonoro, 5 Carimbo, 6 Nota-pena), cada um com paleta e fontes próprias, mais os logos sem fundo em `saida/opcoes/logos/`. Escolhido um caminho, leve símbolo, cores e fontes dele para o `kit.mjs` e gere a identidade completa de novo.
