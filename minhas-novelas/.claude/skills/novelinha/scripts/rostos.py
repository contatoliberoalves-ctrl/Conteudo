#!/usr/bin/env python3
"""Folha de rostos: o rosto de cada personagem em cada plano do vídeo, recortado e ampliado, ao lado da ficha dele.
Quadro pequeno engana: num plano médio o rosto tem 30 pontos de largura e "outra pessoa" passa como "varia um pouco".

Uso, em 3 passos (depois de cada clipe e, no fim, na parte inteira):
  1) python3 rostos.py quadros <video> [--saida rostos]
       -> rostos/quadro-NN.jpg (um quadro do meio de cada plano, com a grade A1..F8) e rostos/marcas.json
  2) Olhe cada quadro-NN.jpg e preencha rostos/marcas.json: a casa da grade onde está o rosto de cada personagem.
       {"01": {"Ana": "B2", "Rosa": "D2:E3"}, "02": {}}     ("D2:E3" = do D2 ao E3; {} = ninguém de rosto visível)
  3) python3 rostos.py folha <video> --ficha Ana=fichas/ana.png --ficha Rosa=fichas/rosa.png [--saida rostos]
       -> rostos/folha-<Personagem>-N.jpg: a ficha em cima e os recortes embaixo, na ordem, com o número do quadro e o segundo
  Cada recorte recebe um veredito: BATE ou NÃO BATE com a ficha. "Varia" não vale. Não bate = refazer o clipe.
     python3 rostos.py --teste
Precisa de ffmpeg no PATH.
"""
import argparse, json, pathlib, re, subprocess, sys, tempfile

COLS, LINS = "ABCDEF", 8          # grade de 6 x 8 casas
RW, RH, POR_FOLHA = 300, 400, 12  # recorte ampliado (3:4) e quantos cabem numa folha (2 fileiras de 6)


def roda(args, **kw):
    return subprocess.run(args, capture_output=True, text=True, **kw)


def medidas(video):
    r = roda(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height:format=duration",
              "-of", "json", video])
    j = json.loads(r.stdout)
    return j["streams"][0]["width"], j["streams"][0]["height"], float(j["format"]["duration"])


def tempos(video, dur):
    """Um quadro do meio de cada plano; plano com mais de 8 s ganha um quadro a cada ~4 s (corte que o medidor não viu)."""
    r = roda(["ffmpeg", "-hide_banner", "-i", video, "-an", "-vf", "scale=270:-2,fps=10,select='gt(scene,0.2)',showinfo",
              "-f", "null", "-"])
    cortes = [float(x) for x in re.findall(r"pts_time:([0-9.]+)", r.stderr)]
    bordas = [0.0] + cortes + [dur]
    out = []
    for a, b in zip(bordas, bordas[1:]):
        if b - a < 0.4:  # corte duplo na emenda
            continue
        n = max(1, int((b - a) // 4))
        out += [round(a + (b - a) * (i + 0.5) / n, 2) for i in range(n)]
    return out


def caixa(marca, w, h):
    """'B2' ou 'B2:C3' -> recorte 3:4 em volta dessas casas, com folga, dentro do quadro: (cw, ch, x, y)."""
    casas = marca.upper().split(":")
    if not all(re.fullmatch(rf"[{COLS}][1-{LINS}]", c) for c in casas) or len(casas) > 2:
        raise ValueError(f"marca '{marca}' fora do formato (ex.: B2 ou B2:C3)")
    cs = [COLS.index(c[0]) for c in casas]; ls = [int(c[1]) - 1 for c in casas]
    cw, ch = w / len(COLS), h / LINS
    x0, x1 = min(cs) * cw - 0.4 * cw, (max(cs) + 1) * cw + 0.4 * cw
    y0, y1 = min(ls) * ch - 0.4 * ch, (max(ls) + 1) * ch + 0.4 * ch
    bw, bh = x1 - x0, y1 - y0
    if bw / bh < RW / RH: bw = bh * RW / RH
    else: bh = bw * RH / RW
    if bw > w: bw, bh = w, w * RH / RW
    if bh > h: bw, bh = h * RW / RH, h
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    x = min(max(cx - bw / 2, 0), w - bw); y = min(max(cy - bh / 2, 0), h - bh)
    return int(bw), int(bh), int(x), int(y)


def quadros(video, saida):
    saida.mkdir(parents=True, exist_ok=True)
    w, h, dur = medidas(video)
    ts = tempos(video, dur)
    # shortcut: fonte padrão do sistema; se o drawtext reclamar de fonte, ponha fontfile=<caminho de um .ttf> no filtro
    grade = [f"scale=720:-2,drawgrid=w=iw/{len(COLS)}:h=ih/{LINS}:t=1:c=white@0.6"]
    for ci, c in enumerate(COLS):
        for li in range(LINS):
            grade.append(f"drawtext=text='{c}{li + 1}':x=w*{ci}/{len(COLS)}+4:y=h*{li}/{LINS}+4:fontsize=20:fontcolor=white:box=1:boxcolor=black@0.6")
    for i, t in enumerate(ts, 1):
        r = roda(["ffmpeg", "-v", "error", "-y", "-ss", str(t), "-i", video, "-frames:v", "1", "-vf", ",".join(grade),
                  "-q:v", "3", str(saida / f"quadro-{i:02d}.jpg")])
        if r.returncode: sys.exit(f"ffmpeg falhou no quadro {i}: {r.stderr[-300:]}")
    (saida / "quadros.json").write_text(json.dumps({f"{i:02d}": t for i, t in enumerate(ts, 1)}, indent=1))
    arq = saida / "marcas.json"
    velhas = json.loads(arq.read_text()) if arq.exists() else {}
    marcas = {f"{i:02d}": velhas.get(f"{i:02d}") for i in range(1, len(ts) + 1)}
    arq.write_text(json.dumps(marcas, ensure_ascii=False, indent=1))
    print(f"{len(ts)} quadros em {saida}/quadro-NN.jpg. Olhe cada um e preencha {arq} (casa da grade de cada rosto; {{}} = sem rosto).")
    return ts


def folha(video, saida, fichas):
    w, h, _ = medidas(video)
    ts = json.loads((saida / "quadros.json").read_text())
    marcas = json.loads((saida / "marcas.json").read_text())
    faltam = [n for n in ts if marcas.get(n) is None]
    if faltam:
        sys.exit(f"FALTA olhar {len(faltam)} quadro(s): {' '.join(faltam)}. Preencha o marcas.json ({{}} se ninguém aparece de rosto).")
    sem_ficha = sorted({p for m in marcas.values() for p in m} - set(fichas))
    if sem_ficha:
        sys.exit(f"Personagem sem --ficha: {', '.join(sem_ficha)}")
    feitas = []
    for nome, ficha in fichas.items():
        itens = [(n, ts[n], m[nome]) for n, m in sorted(marcas.items()) if nome in m]
        if not itens:
            print(f"aviso: {nome} não foi marcado em nenhum quadro"); continue
        for f in range(0, len(itens), POR_FOLHA):
            with tempfile.TemporaryDirectory() as tmp:
                for k, (n, t, marca) in enumerate(itens[f:f + POR_FOLHA], 1):
                    cw, ch, x, y = caixa(marca, w, h)
                    vf = (f"crop={cw}:{ch}:{x}:{y},scale={RW}:{RH},drawtext=text='{n}  {t:.1f}s':x=6:y=6:fontsize=22:"
                          "fontcolor=white:box=1:boxcolor=black@0.7")
                    r = roda(["ffmpeg", "-v", "error", "-y", "-ss", str(t), "-i", video, "-frames:v", "1", "-vf", vf,
                              "-q:v", "2", f"{tmp}/c-{k:03d}.jpg"])
                    if r.returncode: sys.exit(f"ffmpeg falhou no recorte do quadro {n}: {r.stderr[-300:]}")
                n_rec = len(itens[f:f + POR_FOLHA]); cols = min(n_rec, 6); lins = -(-n_rec // 6)
                larg = max(cols * RW + (cols - 1) * 6, 900)  # a ficha nunca fica menor que 900 de largura
                out = saida / f"folha-{nome}-{f // POR_FOLHA + 1}.jpg"
                fc = (f"[0:v]scale=w={larg}:h=480:force_original_aspect_ratio=decrease,pad={larg}:480:0:0[f];"
                      f"[1:v]tile={cols}x{lins}:padding=6:color=black,pad={larg}:ih:0:0[c];[f][c]vstack")
                r = roda(["ffmpeg", "-v", "error", "-y", "-i", str(ficha), "-start_number", "1", "-i", f"{tmp}/c-%03d.jpg",
                          "-filter_complex", fc, "-frames:v", "1", "-q:v", "2", str(out)])
                if r.returncode: sys.exit(f"ffmpeg falhou na folha de {nome}: {r.stderr[-300:]}")
                feitas.append(out)
        print(f"{nome}: {len(itens)} recorte(s)")
    print("Folhas: " + " ".join(str(f) for f in feitas))
    print("Veredito de CADA recorte contra a ficha: BATE ou NÃO BATE. Não bate = refazer o clipe antes do próximo.")
    return feitas


def teste():
    assert caixa("B2", 1080, 1920)[0] / caixa("B2", 1080, 1920)[1] == RW / RH or abs(caixa("B2", 1080, 1920)[0] * RH - caixa("B2", 1080, 1920)[1] * RW) < RH
    cw, ch, x, y = caixa("A1:F8", 1080, 1920); assert x >= 0 and y >= 0 and x + cw <= 1080 and y + ch <= 1920
    try: caixa("Z9", 1080, 1920); raise SystemExit("teste: marca inválida passou")
    except ValueError: pass
    with tempfile.TemporaryDirectory() as tmp:
        t = pathlib.Path(tmp); v = str(t / "v.mp4")
        roda(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", "color=red:s=360x640:d=2:r=30", "-f", "lavfi", "-i",
              "testsrc=s=360x640:d=2:r=30", "-filter_complex", "[0:v][1:v]concat=n=2:v=1", "-pix_fmt", "yuv420p", v], check=True)
        roda(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", "color=blue:s=400x300:d=1", "-frames:v", "1", str(t / "ficha.png")], check=True)
        ts = quadros(v, t / "r")
        assert len(ts) == 2, f"teste: esperava 2 planos, vieram {len(ts)}"
        r = roda([sys.executable, __file__, "folha", v, "--ficha", f"X={t / 'ficha.png'}", "--saida", str(t / "r")])
        assert r.returncode != 0 and "FALTA olhar" in r.stderr, "teste: folha passou com quadro sem olhar"
        (t / "r" / "marcas.json").write_text(json.dumps({"01": {"X": "B2"}, "02": {}}))
        fs = folha(v, t / "r", {"X": t / "ficha.png"})
        assert len(fs) == 1 and fs[0].stat().st_size > 1000
    print("teste ok")


if __name__ == "__main__":
    if "--teste" in sys.argv:
        teste(); sys.exit(0)
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("passo", choices=["quadros", "folha"]); ap.add_argument("video")
    ap.add_argument("--saida", default="rostos"); ap.add_argument("--ficha", action="append", default=[], metavar="Nome=arquivo")
    a = ap.parse_args()
    if a.passo == "quadros":
        quadros(a.video, pathlib.Path(a.saida))
    else:
        fichas = dict(f.split("=", 1) for f in a.ficha)
        if not fichas: sys.exit("folha precisa de --ficha Nome=arquivo pra cada personagem")
        folha(a.video, pathlib.Path(a.saida), {n: pathlib.Path(p) for n, p in fichas.items()})
