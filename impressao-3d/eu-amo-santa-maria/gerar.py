"""Placa "EU ❤ SANTA MARIA DA BOA VISTA" para impressora 3D.

Cada peça imprime deitada (sem suporte) e encaixa numa base marrom por uma aba
escondida. Peças e cores:
  base.stl            marrom
  eu.stl              amarelo
  coracao.stl         vermelho
  texto-azul.stl      azul     (SANTA e BOA VISTA)
  texto-amarelo.stl   amarelo  (MARIA DA)
Os dois "texto-*" formam um bloco só: com AMS, carregue os dois juntos como um
objeto de duas partes; sem AMS, imprima separado e cole a linha amarela entre as azuis.

Fonte: Archivo Black (SIL Open Font License), ArchivoBlack.ttf nesta pasta.
Uso: pip install trimesh shapely manifold3d mapbox_earcut matplotlib
     python3 gerar.py
"""
import json
from pathlib import Path

import numpy as np
import trimesh
from matplotlib.font_manager import FontProperties
from matplotlib.textpath import TextPath
from shapely import affinity
from shapely.geometry import Point, Polygon, box
from shapely.ops import unary_union

PASTA = Path(__file__).parent
FONTE = FontProperties(fname=str(PASTA / "ArchivoBlack.ttf"))

# ---------- parâmetros (mm) ----------
COMPRIMENTO = 240     # base
FUNDO = 30            # profundidade da base
ALTURA_BASE = 8
CHANFRO = 1.2         # quina de cima da base
ESPESSURA = 8         # profundidade das letras e do coração
ABA = 3               # aba escondida que entra na base
FOLGA = 0.2           # folga de cada lado no rasgo
EU_ALTURA = 31        # altura das letras EU
EU_LARGURA = 48       # largura do EU (a fonte é estreitada para caber, como na arte)
CORACAO = 41          # lado do quadrado do coração (fica com ~62 × 62 mm)
CORACAO_TRACO = 13
LINHA = 14.4          # altura das letras do bloco de texto
LARGURA_TEXTO = 99    # largura da linha mais longa (BOA VISTA)
ENTRELINHA = -0.6     # negativo: as linhas se encostam e viram um bloco só
ESPACO_LETRAS = -0.4  # letras de cada palavra encostadas


def contorno(texto):
    tp = TextPath((0, 0), texto, size=100, prop=FONTE)
    g = Polygon()
    for v in tp.to_polygons():
        if len(v) >= 3:
            g = g.symmetric_difference(Polygon(v).buffer(0))
    return g


def palavra(texto, altura, espaco=None):
    """letras uma a uma, encostadas, com a altura da maiúscula = altura"""
    cap = contorno("H").bounds[3]
    k = altura / cap
    x, partes = 0.0, []
    for ch in texto:
        if ch == " ":
            x += 0.28 * altura
            continue
        g = affinity.scale(contorno(ch), k, k, origin=(0, 0))
        g = affinity.translate(g, x - g.bounds[0], 0)
        partes.append(g)
        x = g.bounds[2] + (ESPACO_LETRAS if espaco is None else espaco)
    return unary_union(partes)


def coracao(s):
    """coração com a ponta no canto de baixo à direita (como na arte)"""
    h = unary_union([box(0, 0, s, s), Point(0, s / 2).buffer(s / 2, 128),
                     Point(s / 2, s).buffer(s / 2, 128)])
    h = affinity.translate(h, -h.bounds[0], 0)
    return h.difference(h.buffer(-CORACAO_TRACO, join_style=1))


def com_aba(g):
    """aba retangular abaixo da linha da base (y < 0), escondida no rasgo"""
    minx, _, maxx, _ = g.bounds
    return unary_union([g.buffer(0), box(minx + 1, -ABA, maxx - 1, 0.5)])


def extrudar(g, h):
    partes = getattr(g, "geoms", [g])
    m = trimesh.util.concatenate([trimesh.creation.extrude_polygon(p.simplify(0.02), h) for p in partes])
    m.merge_vertices()
    return m


def main():
    # ---------- frente (x para a direita, y para cima, y = 0 no topo da base) ----------
    eu = palavra("EU", EU_ALTURA, espaco=2)
    eu = affinity.scale(eu, EU_LARGURA / (eu.bounds[2] - eu.bounds[0]), 1, origin=(0, 0))
    cor = coracao(CORACAO)
    linhas = [palavra(t, LINHA) for t in ("SANTA", "MARIA DA", "BOA VISTA")]
    k = LARGURA_TEXTO / (linhas[2].bounds[2] - linhas[2].bounds[0])
    linhas = [affinity.scale(l, k, k, origin=(0, 0)) for l in linhas]
    passo = LINHA * k + ENTRELINHA
    linhas = [affinity.translate(l, -l.bounds[0], (2 - i) * passo) for i, l in enumerate(linhas)]
    azul = unary_union([linhas[0], linhas[2]])
    amarelo = linhas[1].difference(azul)   # onde encostam, fica o azul

    # posições ao longo da base (da arte original)
    x_eu, x_cor, x_txt = 23.7, 73.3, 136.0
    eu = affinity.translate(eu, x_eu, 0)
    cor = affinity.translate(cor, x_cor - cor.bounds[0], 0)
    bloco = unary_union([azul, amarelo])
    dx = x_txt - bloco.bounds[0]
    azul, amarelo = (affinity.translate(g, dx, 0) for g in (azul, amarelo))
    bloco = unary_union([azul, amarelo])

    pecas = {"eu": com_aba(eu), "coracao": com_aba(cor)}
    aba_txt = box(bloco.bounds[0] + 1, -ABA, bloco.bounds[2] - 1, 0.5)
    pecas["texto-azul"] = unary_union([azul, aba_txt])
    pecas["texto-amarelo"] = amarelo.difference(aba_txt)

    # ---------- base com rasgos ----------
    base = trimesh.creation.box((COMPRIMENTO, FUNDO, ALTURA_BASE))
    base.apply_translation((COMPRIMENTO / 2, FUNDO / 2, ALTURA_BASE / 2))
    perfil = Polygon([(0, 0), (FUNDO, 0), (FUNDO, ALTURA_BASE - CHANFRO), (FUNDO - CHANFRO, ALTURA_BASE),
                      (CHANFRO, ALTURA_BASE), (0, ALTURA_BASE - CHANFRO)])
    base = extrudar(perfil, COMPRIMENTO)           # perfil no plano (y, z), comprimento em x
    base.apply_transform(np.array([[0, 0, 1, 0], [1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 1]]))
    y0 = (FUNDO - ESPESSURA) / 2
    rasgos = []
    for nome in ("eu", "coracao"):
        minx, _, maxx, _ = pecas[nome].bounds
        rasgos.append((minx + 1, maxx - 1))
    rasgos.append((aba_txt.bounds[0], aba_txt.bounds[2]))
    for a, b in rasgos:
        r = trimesh.creation.box((b - a + 2 * FOLGA, ESPESSURA + 2 * FOLGA, ABA + 1))
        r.apply_translation(((a + b) / 2, FUNDO / 2, ALTURA_BASE - ABA / 2 + 0.5))
        base = base.difference(r)
    base.export(PASTA / "base.stl")

    info = {"comprimento": COMPRIMENTO, "fundo": FUNDO, "altura_base": ALTURA_BASE, "espessura": ESPESSURA, "aba": ABA, "y0": y0}
    print(f"base: {base.extents.round(1)} mm, {base.volume / 1000:.1f} cm³, estanque={base.is_watertight}")
    for nome, g in pecas.items():
        m = extrudar(g, ESPESSURA)
        m.export(PASTA / f"{nome}.stl")
        e = m.extents
        print(f"{nome}: {e[0]:.0f} × {e[1]:.0f} × {e[2]:.0f} mm, {m.volume / 1000:.1f} cm³, estanque={m.is_watertight}")
        info[nome] = {"x": g.bounds[0], "y": g.bounds[1]}
    (PASTA / "montagem.json").write_text(json.dumps(info, indent=1))

    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    fig, ax = plt.subplots(figsize=(12, 3.6))
    ax.add_patch(plt.Rectangle((0, -ALTURA_BASE), COMPRIMENTO, ALTURA_BASE, color="#9a6b3f"))
    for g, c in ((pecas["eu"], "#e39a1f"), (pecas["coracao"], "#c3202b"), (pecas["texto-azul"], "#1f3a8a"), (pecas["texto-amarelo"], "#e39a1f")):
        for p in getattr(g, "geoms", [g]):
            ax.fill(*p.exterior.xy, color=c)
            for i in p.interiors:
                ax.fill(*i.xy, color="white")
    ax.set_aspect("equal"); ax.axis("off")
    fig.savefig(PASTA / "frente.png", dpi=130, bbox_inches="tight")


if __name__ == "__main__":
    main()
