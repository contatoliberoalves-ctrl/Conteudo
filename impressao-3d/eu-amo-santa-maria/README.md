# Placa "EU ❤ SANTA MARIA DA BOA VISTA" (impressão 3D)

Réplica da arte em miniatura para mesa, sem a plaquinha do lado e com a base inteira em marrom. 240 × 30 mm de base, ~72 mm de altura (coração).

![placa montada](render/placa.png)

| Arquivo | Cor | Filamento | Tempo* |
|---|---|---|---|
| `base.stl` | marrom | ~26 g | ~45 min |
| `eu.stl` | amarelo | ~6 g | ~12 min |
| `coracao.stl` | vermelho | ~10 g | ~18 min |
| `texto-azul.stl` (SANTA e BOA VISTA) | azul | ~12 g | ~48 min |
| `texto-amarelo.stl` (MARIA DA) | amarelo | ~7 g | ~28 min |
| **Total** | 4 cores | **~61 g** | **~2,5–3 h** |

\* PrusaSlicer com velocidades de impressora rápida (Bambu A1 / Kobra X), camada 0,2 mm, 2 paredes, 15% giroide. Em impressora comum, ~2× mais.

## Imprimir
Tudo deitado, como o STL vem, sem suporte. Cada peça numa cor só, então não precisa de AMS: dá para imprimir uma cor por vez em qualquer impressora com mesa de 240 mm (numa de 220 × 220, a base vai na diagonal).

## Montar
1. Encaixe a aba de baixo do EU, do coração e do BOA VISTA nos rasgos da base (uma gota de cola em cada).
2. Cole o MARIA DA em cima do BOA VISTA e o SANTA em cima do MARIA DA, alinhados à esquerda.

## Ajustar
Medidas no topo do `gerar.py` (comprimento, espessura das letras, altura do EU, tamanho do coração, folga dos rasgos). `python3 gerar.py` refaz os STLs e `frente.png`. Imagem 3D: `python3 -m http.server 8766` nesta pasta e `node render/fotos.mjs`.

Fonte: Archivo Black (SIL Open Font License 1.1), `ArchivoBlack.ttf`.
