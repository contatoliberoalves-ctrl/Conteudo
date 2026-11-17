"""Encosto para o suporte leve (laterais pretas já impressas).

Placa que deita sobre as duas rampas e cobre o vão entre as laterais, para o meio do
livro aberto (a lombada) não afundar para trás. Nervuras atrás deixam a placa rígida e
duas delas encostam por dentro das laterais, travando a placa no lugar. Não precisa de cola.

Imprime deitada, com a face lisa (a que encosta no livro) na mesa.
Uso: python3 encosto.py   (lê as medidas de montagem.json, gerado por gerar.py)
"""
import json
from pathlib import Path

import trimesh
from shapely.geometry import box

PASTA = Path(__file__).parent
M = json.loads((PASTA / "montagem.json").read_text())

ALTURA = 150      # ao longo da rampa
INICIO = 4        # começa 4 mm acima do canto do aparador (por causa do arredondado)
PLACA = 1.6       # espessura da placa
NERVURA = (2.4, 5)  # espessura e profundidade das nervuras
PASSO = 30        # distância entre as nervuras horizontais
FOLGA = 0.3


def ext(g, z0, z1):
    ms = [trimesh.creation.extrude_polygon(p, z1 - z0) for p in getattr(g, "geoms", [g])]
    m = trimesh.util.concatenate(ms)
    m.merge_vertices()
    m.apply_translation((0, 0, z0))
    return m


def main():
    W = M["comp"]                      # largura total do suporte
    e = M["largura"]                   # espessura de cada lateral
    t, d = NERVURA
    # x ao longo da largura, y ao longo da rampa (para cima), z para trás (face lisa em z = 0)
    placa = box(0, 0, W, ALTURA)
    xi0, xi1 = e + FOLGA, W - e - FOLGA                  # faces de dentro das laterais
    partes = [ext(placa.buffer(-1).buffer(1), 0, PLACA)]
    caixas = [(xi0, 0, xi0 + t, ALTURA), (xi1 - t, 0, xi1, ALTURA), (W / 2 - t / 2, 0, W / 2 + t / 2, ALTURA)]
    caixas += [(xi0, y, xi1, y + t) for y in list(range(0, ALTURA - 1, PASSO)) + [ALTURA - t]]
    for x0, y0, x1, y1 in caixas:
        b = trimesh.creation.box((x1 - x0, y1 - y0, d))
        b.apply_translation(((x0 + x1) / 2, (y0 + y1) / 2, PLACA + d / 2 - 0.01))
        partes.append(b)
    m = trimesh.boolean.union(partes)
    m.export(PASTA / "encosto.stl")
    print(f"encosto: {m.extents.round(0)} mm, {m.volume / 1000:.1f} cm³, estanque={m.is_watertight}")
    M["encosto"] = {"inicio": INICIO, "altura": ALTURA, "placa": PLACA}
    (PASTA / "montagem.json").write_text(json.dumps(M, indent=1))


if __name__ == "__main__":
    main()
