"""Cartelas PNG transparentes nas cores e fontes do estilo, prontas para o EDL.

Tipos: gancho (título grande dos 1os segundos), nome (lower third: nome +
cargo), selo (pílula pequena: "Art. 5º, LXIX"), cta ("Comenta MS…").
Imprime a entrada pronta para "sobreposicoes" do edl.json. Animações mais
ricas: HyperFrames/Remotion (ver SKILL), com o PNG ou .webm no mesmo lugar.
"""
import json
from pathlib import Path

from .comum import FONTES, FORMATOS, carregar_estilo, pasta_edit


def fonte(nome_arquivo, tam):
    from PIL import ImageFont
    return ImageFont.truetype(str(FONTES / nome_arquivo), tam)


def quebra(d, texto, f, largura_max):
    linhas, atual = [], ""
    for p in texto.split():
        t = (atual + " " + p).strip()
        if d.textlength(t, font=f) <= largura_max or not atual:
            atual = t
        else:
            linhas.append(atual)
            atual = p
    return linhas + [atual]


def hex_rgb(h, a=255):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4)) + (a,)


def desenhar(tipo, texto, sub, estilo, W):
    from PIL import Image, ImageDraw
    C = estilo["cartela"]
    titulo = C.get("arquivo_titulo", "BebasNeue-Regular.ttf")
    corpo = C.get("arquivo_corpo", "Poppins-Bold.ttf")
    fundo, cor, acento = hex_rgb(C["fundo"]), hex_rgb(C["texto"]), hex_rgb(C["acento"])
    raio = C.get("raio", 28)
    tam = {"gancho": 120, "nome": 64, "selo": 44, "cta": 78}[tipo] * W // 1080
    f = fonte(titulo if tipo in ("gancho", "cta") else corpo, tam)
    fs = fonte(corpo, max(28, tam * 9 // 20)) if sub else None
    larg_max = int(W * (0.84 if tipo != "selo" else 0.7))
    rasc = ImageDraw.Draw(Image.new("RGBA", (10, 10)))
    txt = texto.upper() if C.get("caixa_alta", True) and tipo != "nome" else texto
    linhas = quebra(rasc, txt, f, larg_max - 2 * tam // 2)
    asc, desc = f.getmetrics()
    lh = int((asc + desc) * (0.92 if tipo in ("gancho", "cta") else 1.1))
    pad = tam // 2 if tipo != "selo" else tam // 3
    tw = max(rasc.textlength(l, font=f) for l in linhas)
    sh = 0
    if sub:
        sa, sd = fs.getmetrics()
        sh = sa + sd + pad // 2
        tw = max(tw, rasc.textlength(sub, font=fs))
    bw, bh = int(tw + 2 * pad), int(lh * len(linhas) + sh + 2 * pad * (0.8 if tipo == "gancho" else 1))
    barra = tam // 5 if tipo == "nome" else 0
    im = Image.new("RGBA", (bw + barra + 20, bh + 20), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([10, 10, 10 + bw + barra, 10 + bh], radius=raio if tipo != "selo" else bh // 2,
                        fill=fundo)
    if barra:
        d.rounded_rectangle([10, 10, 10 + barra * 2, 10 + bh], radius=raio, fill=acento)
        d.rectangle([10 + barra, 10, 10 + barra * 2, 10 + bh], fill=fundo)
    y = 10 + pad * (0.8 if tipo == "gancho" else 1)
    for i, l in enumerate(linhas):
        x = 10 + barra + (bw - rasc.textlength(l, font=f)) / 2 if tipo != "nome" else 10 + barra + pad
        c = acento if (tipo == "gancho" and i == len(linhas) - 1 and len(linhas) > 1) else cor
        d.text((x, y), l, font=f, fill=c)
        y += lh
    if sub:
        x = 10 + barra + (pad if tipo == "nome" else (bw - rasc.textlength(sub, font=fs)) / 2)
        d.text((x, y + pad // 4), sub, font=fs, fill=acento if tipo == "nome" else cor)
    return im


def main(args):
    estilo = carregar_estilo(args.estilo)
    W, H = FORMATOS[args.formato]
    im = desenhar(args.tipo, args.texto, args.sub, estilo, W)
    edit = pasta_edit(args.pasta)
    (edit / "cartelas").mkdir(exist_ok=True)
    nome = args.nome or f"{args.tipo}-{abs(hash(args.texto)) % 10000}"
    arq = edit / "cartelas" / f"{nome}.png"
    im.save(arq)
    y_pad = {"gancho": 0.16, "nome": 0.62, "selo": 0.12, "cta": 0.55}[args.tipo]
    entrada = {"arquivo": f"cartelas/{nome}.png", "inicio": args.inicio, "fim": args.fim,
               "x": "centro" if args.tipo != "nome" else 60, "y": round(H * y_pad), "largura": im.width,
               "fade": 0.2}
    print(f"✓ {arq} ({im.width}x{im.height})")
    print("para o edl.json → sobreposicoes:", json.dumps(entrada, ensure_ascii=False))
