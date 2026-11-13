# Troféu "Terra da Serenata" (impressão 3D, Anycubic Kobra X)

Lua com violão sobre pedestal creme e letreiro na frente, a partir da arte enviada. ~195 mm de altura, base de 160 × 100 mm.

![troféu montado](render/trofeu.png)

| Arquivo | Cor | Como imprimir | Filamento | Tempo* |
|---|---|---|---|---|
| `lua-violao.stl` | amarelo | deitado, violão para cima | ~35 g | ~1h10 |
| `letreiro.stl` | amarelo | deitado | ~16 g | ~1h10 |
| `haste.stl` | amarelo | em pé | ~2 g | ~5 min |
| `pedestal.stl` | creme | em pé (base + cilindro + disco) | ~93 g | ~2h50 |
| **Total** | 2 cores | sem suporte | **~146 g** | **~5h–6h** |

\* PrusaSlicer com velocidades da Kobra X (camada 0,2 mm, 2 paredes, 12% giroide). As 3 peças amarelas cabem juntas na mesa.

O violão fica 4 mm à frente da lua, com cavalete, roseta, trastes e cordas em relevo e a boca rebaixada (as cordas descem até o fundo da boca, então nada fica no ar).

## Montar
1. Encaixe a haste no rasgo do disco do pedestal.
2. Encaixe a aba da lua na haste (o violão para a frente).
3. Encaixe a aba do letreiro no rasgo da frente da base.
Uma gota de cola em gel em cada encaixe.

## Ajustar
`desenho.py`: contorno da lua (traçado sobre a arte) e medidas do violão, em pixels da arte. `gerar.py`: medidas em mm (base, cilindro, espessuras, texto, folgas). `python3 gerar.py` refaz os STLs. Imagens: `python3 -m http.server 8767` nesta pasta e `node render/fotos.mjs`.

Fonte do letreiro: Archivo Black (SIL Open Font License 1.1), `ArchivoBlack.ttf`.
