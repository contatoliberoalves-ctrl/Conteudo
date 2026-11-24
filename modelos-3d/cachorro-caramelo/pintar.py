#!/usr/bin/env python3
"""Pinta em até 4 cores o modelo do MakerLab (3MF da Bambu que veio todo numa cor só) e grava um 3MF
pronto para imprimir com 4 filamentos (ACE Pro ou AMS), sem mexer na forma.

  python3 pintar.py --vistas      só as imagens de conferência (rápido)
  python3 pintar.py               imagens + saida/cachorro-4-cores.3mf

Entrada: entrada/makerlab.3mf (fora do git). As cores vão por triângulo no atributo paint_color, o mesmo
que a ferramenta de pintura do fatiador usa: dá para retocar lá depois.
"""
import argparse
import json
import re
import time
import zipfile
from pathlib import Path

import numpy as np

AQUI = Path(__file__).resolve().parent
ENTRADA = AQUI / "entrada" / "makerlab.3mf"
SAIDA = AQUI / "saida"
# Filamentos na ordem dos espaços do ACE Pro / AMS.
CORES = [("Marrom", "#8A5A33"), ("Branco", "#F2EFE9"), ("Preto", "#1C1A19"), ("Bege", "#D9BC94")]
CODIGO = {1: "4", 2: "8", 3: "0C", 4: "1C"}  # paint_color de cada filamento (formato do fatiador)


def carregar():
    z = zipfile.ZipFile(ENTRADA)
    txt = z.read("3D/Objects/object_1.model").decode()
    V = np.array(re.findall(r'<vertex x="([^"]+)" y="([^"]+)" z="([^"]+)"', txt), float)
    F = np.array(re.findall(r'<triangle v1="(\d+)" v2="(\d+)" v3="(\d+)"', txt), np.int64)
    return z, txt, V, F


# ---------------------------------------------------------------- imagem (pontos com z-buffer)
def unit(v):
    v = np.asarray(v, float)
    return v / np.linalg.norm(v)


class Camera:
    """Câmera ortográfica: `olho` (direção de onde se olha), `alvo` (centro), `mm` (largura vista em mm)."""

    def __init__(self, direcao, alvo, mm, W=560, H=560):
        self.f = -unit(direcao)
        self.r = unit(np.cross(self.f, [0, 0, 1]))
        self.u = np.cross(self.r, self.f)
        self.alvo, self.W, self.H = np.asarray(alvo, float), W, H
        self.k = W / mm

    def projetar(self, P):
        rel = P - self.alvo
        return self.W / 2 + (rel @ self.r) * self.k, self.H / 2 - (rel @ self.u) * self.k, rel @ self.f


def geometria(V, F):
    tri = V[F]
    C = tri.mean(1)
    N = np.cross(tri[:, 1] - tri[:, 0], tri[:, 2] - tri[:, 0])
    A = np.linalg.norm(N, axis=1)
    return C, N / np.maximum(A, 1e-12)[:, None], A / 2


def render(cam, C, N, A, cores, luz=(0.35, -0.55, 0.75)):
    """Devolve (imagem, id do triângulo em cada pixel ou -1)."""
    W, H = cam.W, cam.H
    x, y, d = cam.projetar(C)
    px, py = np.round(x).astype(int), np.round(y).astype(int)
    ok = (N @ cam.f < 0.08) & (px >= -2) & (px < W + 2) & (py >= -2) & (py < H + 2)
    raio = np.clip(np.sqrt(A) * cam.k * 0.6, 1.0, 3.0)
    zbuf = np.full(H * W, np.inf)
    alvos = []
    for dx in (-2, -1, 0, 1, 2):
        for dy in (-2, -1, 0, 1, 2):
            if max(abs(dx), abs(dy)) > 2:
                continue
            qx, qy = px + dx, py + dy
            sel = ok & (raio >= max(abs(dx), abs(dy))) & (qx >= 0) & (qx < W) & (qy >= 0) & (qy < H)
            q = qy * W + qx
            np.minimum.at(zbuf, q[sel], d[sel])
            alvos.append((sel, q))
    ids = np.full(H * W, -1)
    melhor = np.full(H * W, np.inf)
    for sel, q in alvos:
        s2 = np.flatnonzero(sel)
        bom = d[s2] <= zbuf[q[s2]] + 1e-6
        s2 = s2[bom]
        ids[q[s2]] = s2
    L = unit(luz)
    luzv = 0.38 + 0.62 * np.clip(N @ L, 0, 1)
    img = np.full((H * W, 3), 240.0)
    tem = ids >= 0
    img[tem] = cores[ids[tem]] * luzv[ids[tem], None]
    return np.clip(img, 0, 255).astype(np.uint8).reshape(H, W, 3), ids.reshape(H, W)


def tapar_furos(img, ids):
    """Pixels vazios dentro da silhueta (entre pontos) ganham a cor do vizinho mais próximo."""
    from scipy import ndimage as ndi

    cheio = ids >= 0
    furos = ndi.binary_closing(cheio, iterations=2) & ~cheio
    if furos.any():
        _, (iy, ix) = ndi.distance_transform_edt(~cheio, return_indices=True)
        img = img.copy()
        img[furos] = img[iy[furos], ix[furos]]
    return img, cheio | furos


def imagem(cam, C, N, A, rgb, fundo=(240, 240, 240), transparente=False):
    from PIL import Image

    grande = Camera.__new__(Camera)
    grande.__dict__.update(cam.__dict__)
    grande.W, grande.H, grande.k = cam.W * 2, cam.H * 2, cam.k * 2
    img, ids = render(grande, C, N, A, rgb)
    img, cheio = tapar_furos(img, ids)
    if transparente:
        rgba = np.dstack([img, (cheio * 255).astype(np.uint8)])
        return Image.fromarray(rgba, "RGBA").resize((cam.W, cam.H), Image.LANCZOS)
    img[~cheio] = fundo
    return Image.fromarray(img).resize((cam.W, cam.H), Image.LANCZOS)


def com_grade(img, passo=40):
    from PIL import Image, ImageDraw

    im = Image.fromarray(img)
    dr = ImageDraw.Draw(im)
    for v in range(0, im.width, passo):
        dr.line([(v, 0), (v, im.height)], fill=(255, 80, 80) if v % (passo * 5) == 0 else (255, 190, 190))
        if v % (passo * 5) == 0:
            dr.text((v + 2, 2), str(v), fill=(200, 0, 0))
    for v in range(0, im.height, passo):
        dr.line([(0, v), (im.width, v)], fill=(80, 80, 255) if v % (passo * 5) == 0 else (190, 190, 255))
        if v % (passo * 5) == 0:
            dr.text((2, v + 2), str(v), fill=(0, 0, 200))
    return im


# ---------------------------------------------------------------- regiões (coordenadas do modelo, mm)
OLHOS = [np.array([2.96, -18.55, 18.96]), np.array([9.01, -22.27, 18.52])]
NARIZ = np.array([1.2, -26.3, 12.2])
ORELHAS = [np.array([3.03, -6.14, 23.84]), np.array([20.72, -13.57, 21.74])]
PATAS = [np.array(p) for p in ((49.2, -9.2, -17.2), (31.2, -17.4, -20.7), (-27.5, -25.7, -22.7))]
PATA_DOBRADA = np.array([-1.5, -1.4, -17.8])  # pata de trás encolhida junto da barriga
BARRIGA = np.array([-3.0, 3.0, -14.0])
PEITO = np.array([13.0, -10.5, -1.5])


def pintar(V, C, N):
    """Filamento de cada triângulo: 1 marrom, 2 branco, 3 preto, 4 bege."""
    cor = np.ones(len(C), np.int8)
    meio_olhos = (OLHOS[0] + OLHOS[1]) / 2
    focinho = unit(NARIZ - meio_olhos)
    cima = (ORELHAS[0] + ORELHAS[1]) / 2 - meio_olhos
    cima = unit(cima - (cima @ focinho) * focinho)
    centro_cab = meio_olhos - 6.0 * focinho + 2.0 * cima
    eixo_pesc = unit(PEITO - centro_cab)
    corpo = V.mean(0)

    def dist(p):
        return np.linalg.norm(C - p, axis=1)

    # bege: barriga (a parte que aparece entre as patas)
    rb = (C - BARRIGA) / np.array([15.0, 9.0, 6.5])
    cor[((rb**2).sum(1) < 1) & (N[:, 1] < 0.35)] = 4
    for o in ORELHAS:  # dentro da orelha
        r = C - o
        cor[(np.linalg.norm(r, axis=1) < 5.5) & (np.einsum("ij,j->i", N, unit(-focinho)) < -0.2)] = 4

    # branco: focinho e queixo, colar, peito e patas
    rel = C - NARIZ
    proj = rel @ focinho
    do_eixo = np.linalg.norm(np.cross(rel, focinho), axis=1)
    nariz = (proj > -2.2) & (do_eixo < 3.0) & (dist(NARIZ) < 4.5)  # a ponta do focinho inteira, com as narinas
    muzzle = ((dist(NARIZ) < 3.8) | ((dist(NARIZ) < 7.5) & (rel @ cima < -1.6))) & ~nariz  # volta do nariz, lábios e queixo
    t = (C - centro_cab) @ eixo_pesc
    radial = np.linalg.norm((C - centro_cab) - np.outer(t, eixo_pesc), axis=1)
    colar = (t > 9.0) & (t < 14.5) & (radial < 17)
    peito = (dist(PEITO) < 9.5) & (N[:, 1] < 0.2)
    patas = np.zeros(len(C), bool)
    for pt in PATAS:
        perto = np.linalg.norm(V - pt, axis=1) < 9
        ponta = V[perto][np.argmax(np.linalg.norm(V[perto] - corpo, axis=1))]
        patas |= dist(ponta) < 6.0
    patas |= dist(PATA_DOBRADA) < 4.5
    cor[muzzle | colar | peito | patas] = 2

    # preto: olhos e nariz
    for o in OLHOS:
        cor[dist(o) < 1.45] = 3
    cor[nariz] = 3
    return cor


CAMERAS = {
    "frente": Camera((0.0, -1.0, 0.25), (0, 0, 0), 112),
    "cima": Camera((0.001, -0.02, 1.0), (0, 0, 0), 112),
    "tras": Camera((0.0, 1.0, 0.25), (0, 0, 0), 112),
    "baixo": Camera((0.001, -0.02, -1.0), (0, 0, 0), 112),
    "rosto": Camera((-0.45, -1.0, 0.25), (8.0, -20.0, 15.0), 36),
    "rosto-lado": Camera((-1.0, -0.35, 0.2), (8.0, -20.0, 15.0), 36),
    "nariz": Camera((-0.45, -1.0, 0.45), (1.6, -25.0, 12.5), 14),
}


# ---------------------------------------------------------------- gravação
FLUXO = [  # mm³ de purga na troca (de cada linha para cada coluna): marrom, branco, preto, bege
    [0, 560, 160, 360],
    [220, 0, 180, 160],
    [280, 700, 0, 560],
    [200, 300, 160, 0],
]


def projeto(cfg_txt, por_filamento):
    """Passa a configuração do projeto de 1 para 4 filamentos. No Bambu Studio novo cada filamento tem
    uma entrada por tipo de bico (padrão e alto fluxo), em ordem: f1, f1, f2, f2..."""
    cfg = json.loads(cfg_txt)
    n = len(CORES)
    variantes = len(cfg.get("filament_extruder_variant") or [None])
    chaves = set(por_filamento) | {k for k in cfg if k.startswith("filament_")}
    for k in chaves:
        v = cfg.get(k)
        if isinstance(v, list) and (len(v) == 1 or (variantes > 1 and len(v) == variantes)):
            cfg[k] = v * n
    if "filament_self_index" in cfg:
        cfg["filament_self_index"] = [str(i + 1) for i in range(n) for _ in range(variantes)]
    cfg["filament_colour"] = [h + "FF" for _, h in CORES]
    cfg["flush_volumes_matrix"] = [str(x) for linha in FLUXO for x in linha]
    for k in ("different_settings_to_system", "inherits_group"):
        v = cfg.get(k)
        if isinstance(v, list) and len(v) >= 3:
            cfg[k] = [v[0]] + [v[1]] * n + v[2:]
    return json.dumps(cfg, indent=4, ensure_ascii=False)


def gravar(z, txt, F, cor, destino, miniaturas):
    i0 = txt.index("<triangles>") + len("<triangles>")
    i1 = txt.index("</triangles>")
    cod = np.array(["4"] + [CODIGO[i] for i in range(1, 5)])[cor]
    linhas = "\n".join(f'     <triangle v1="{a}" v2="{b}" v3="{c}" paint_color="{k}"/>' for (a, b, c), k in zip(F.tolist(), cod.tolist()))
    modelo = txt[:i0] + "\n" + linhas + "\n    " + txt[i1:]
    por_fil = json.loads((AQUI / "filamento_chaves.json").read_text())
    with zipfile.ZipFile(destino, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as out:
        for info in z.infolist():
            nome = info.filename
            if nome == "3D/Objects/object_1.model":
                dados = modelo.encode()
            elif nome == "Metadata/project_settings.config":
                dados = projeto(z.read(nome).decode(), por_fil).encode()
            elif nome in miniaturas:
                dados = miniaturas[nome]
            else:
                dados = z.read(nome)
            out.writestr(info, dados, compress_type=zipfile.ZIP_DEFLATED)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--mapa", nargs="*", help="imagens com grade para marcar pontos (nomes das câmeras)")
    ap.add_argument("--vistas", action="store_true")
    ap.add_argument("--nomes", nargs="*")
    ap.add_argument("--ponto", nargs="*", help="camera,px,py: coordenada 3D do pixel")
    a = ap.parse_args()
    t0 = time.time()
    z, txt, V, F = carregar()
    C, N, A = geometria(V, F)
    print(f"{len(V)} vértices, {len(F)} triângulos em {time.time() - t0:.0f}s")
    SAIDA.mkdir(exist_ok=True)
    cinza = np.full((len(F), 3), 205.0)
    if a.ponto:
        for item in a.ponto:
            nome, px, py = item.split(",")
            _, ids = render(CAMERAS[nome], C, N, A, cinza)
            i = ids[int(py), int(px)]
            print(f"{nome} ({px},{py}) -> " + ("nada" if i < 0 else f"{np.round(C[i], 2).tolist()} normal {np.round(N[i], 2).tolist()}"))
        return
    cor = pintar(V, C, N)
    tabela = np.array([[0, 0, 0]] + [[int(h[i : i + 2], 16) for i in (1, 3, 5)] for _, h in CORES], float)
    rgb = tabela[cor]
    print("triângulos por cor:", {CORES[i - 1][0]: int((cor == i).sum()) for i in range(1, 5)})
    if a.vistas:
        from PIL import Image

        nomes = a.nomes or ["rosto", "rosto-lado", "frente", "cima", "tras", "baixo"]
        imgs = [Image.fromarray(render(CAMERAS[n], C, N, A, rgb)[0]) for n in nomes]
        out = Image.new("RGB", (560 * min(3, len(imgs)), 560 * ((len(imgs) + 2) // 3)), "white")
        for i, im in enumerate(imgs):
            out.paste(im, ((i % 3) * 560, (i // 3) * 560))
        out.save(SAIDA / "pintura-vistas.png")
        print("vistas em", round(time.time() - t0))
        return
    if a.mapa is None:
        import io

        def png(im):
            b = io.BytesIO()
            im.save(b, "PNG")
            return b.getvalue()

        heroi = Camera((0.35, -1.0, 0.45), (2.0, 0.0, -2.0), 110, 512, 512)
        mini = imagem(heroi, C, N, A, rgb, transparente=True)
        miniaturas = {"Metadata/plate_1.png": png(mini), "Metadata/plate_1_small.png": png(mini.resize((128, 128)))}
        destino = SAIDA / "cachorro-4-cores.3mf"
        gravar(z, txt, F, cor, destino, miniaturas)
        print(f"3MF em {time.time() - t0:.0f}s: {destino.stat().st_size / 1048576:.1f} MB")
        from PIL import Image

        cena = Image.new("RGB", (1200, 760), "white")
        cena.paste(imagem(Camera((0.35, -1.0, 0.45), (2.0, 0.0, -2.0), 108, 760, 760), C, N, A, rgb), (0, 0))
        cena.paste(imagem(Camera((-0.45, -1.0, 0.25), (7.0, -19.0, 13.0), 34, 440, 380), C, N, A, rgb), (760, 0))
        cena.paste(imagem(Camera((0.0, 1.0, 0.5), (0.0, 0.0, -2.0), 112, 440, 380), C, N, A, rgb), (760, 380))
        cena.save(SAIDA / "cachorro-4-cores.jpg", quality=92)
        return
    if a.mapa is not None:
        for nome in a.mapa or CAMERAS:
            img, _ = render(CAMERAS[nome], C, N, A, cinza)
            com_grade(img).save(SAIDA / f"mapa-{nome}.png")
        print("mapas em", time.time() - t0)
        return


if __name__ == "__main__":
    main()
