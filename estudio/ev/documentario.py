"""Documentário estilo Vox (Reels de 20–45 s): papel, recortes em colagem, palavras grandes
no instante em que a voz as diz, marcas à mão (círculo, sublinhado, seta, risco) e movimento
em passos de stop motion. Método (guia da Naomi Metzger, só as ideias): história com início
surpreendente, virada e final que paga; fatos checados; ÁUDIO PRIMEIRO (cada cena dura a fala
dela); uma ideia visual por frase; mesma luz e tom em todas as imagens; pessoas e objetos
recortados à parte; rosto real só de foto real.

  ev.py documentario roteiro.json [--rascunho]

{"formato": "reels", "voz": "pt-BR-AntonioNeural" | "perfil", "velocidade": "-4%", "tom": "pb" | "sepia" | "cor",
 "musica": "trilha.mp3",                       # opcional (sua, com licença); sem ela, cama sintetizada
 "cenas": [{
   "fala": "Em 5 de outubro de 1988, um homem ergueu um livro.",
   "fundo": {"img": "imgs/plenario.jpg", "papel": false, "zoom": [1, 1.08], "escurecer": 0.2},
   "camadas": [{"img": "imgs/ulysses.jpg", "recorte": "pessoa" | "verde" | "rasgado" | false,
                "x": 0.5, "y": 0.62, "w": 0.7, "rot": -2, "moldura": "foto" | "quadro",
                "gatilho": "homem", "de": {"dy": 0.3}, "para": {"dy": 0}, "passo": 3, "legenda": "…"}],
   "palavras": [{"texto": "1988", "gatilho": "1988", "x": 0.5, "y": 0.2, "tam": 0.2, "cor": "#fff"}],
   "marcas": [{"tipo": "circulo", "palavra": 0, "gatilho": "1988"}],   # ou x, y, w, h (0–1)
   "rodape": {"texto": "Ulysses Guimarães (1916–1992)", "gatilho": "Ulysses"}}]}
Caminhos de imagem relativos ao roteiro. Imagens de terceiros: só com licença (Wikimedia Commons
CC BY/domínio público, Agência Brasil CC BY) e crédito na legenda do post.
"""
import hashlib
import json
import shutil
from pathlib import Path

import numpy as np

from .comum import FORMATOS, ler_json, pasta_edit, sonda, voz_padrao
from .explicativo import quando
from .motion import PROJETO
from .remotion_util import FPS, decodificar, fontes_public, mixar, narrar, render
from .sfx import Mix, cama, clique, impacto, whoosh

ATRASO = 4          # quadros de respiro antes da fala em cada cena
SOBRA = 0.35        # segundos depois da fala


def _publicar(src, recorte, edit):
    """Prepara a imagem (recorte de pessoa, fundo verde, papel rasgado) e copia para o public/."""
    src = Path(src) if Path(src).is_absolute() else edit / src
    if not src.exists():
        raise SystemExit(f"imagem não existe: {src}")
    chave = hashlib.sha1(f"{src.resolve()}|{src.stat().st_mtime}|{recorte}|v1".encode()).hexdigest()[:12]
    pasta = PROJETO / "public" / "doc"
    pasta.mkdir(parents=True, exist_ok=True)
    if not recorte:
        dst = pasta / f"{chave}{src.suffix.lower()}"
        if not dst.exists():
            shutil.copy(src, dst)
        return f"doc/{dst.name}"
    dst = pasta / f"{chave}.png"
    if dst.exists():
        return f"doc/{dst.name}"
    import cv2
    bgr = cv2.imread(str(src), cv2.IMREAD_COLOR)
    if bgr is None:
        raise SystemExit(f"não consegui abrir {src}")
    H, W = bgr.shape[:2]
    if recorte == "pessoa":
        from .palavra_atras import Recorte
        m = Recorte(W, H, lado=512)(cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB))
        a = cv2.resize(np.clip(m, 0, 1), (W, H), interpolation=cv2.INTER_LINEAR)
        a = cv2.GaussianBlur(a, (0, 0), 1.2)
    elif recorte == "verde":
        hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV).astype(np.float32)
        verde = ((hsv[..., 0] > 35) & (hsv[..., 0] < 90) & (hsv[..., 1] > 80) & (hsv[..., 2] > 60)).astype(np.float32)
        a = cv2.GaussianBlur(1 - verde, (0, 0), 1.5)
        g = bgr.astype(np.float32)                    # tira o verde que vaza na borda
        g[..., 1] = np.minimum(g[..., 1], (g[..., 0] + g[..., 2]) / 2 + 10)
        bgr = g.clip(0, 255).astype(np.uint8)
    elif recorte == "rasgado":
        # papel rasgado: borda irregular + margem branca, como recorte de revista
        rng = np.random.default_rng(int(chave[:6], 16))
        m = int(0.035 * min(W, H))
        tela = np.full((H + 2 * m, W + 2 * m, 3), (236, 240, 243), np.uint8)
        tela[m:m + H, m:m + W] = bgr
        bgr, H, W = tela, H + 2 * m, W + 2 * m
        a = np.zeros((H, W), np.float32)
        def borda(n, amp):
            x = np.cumsum(rng.normal(0, 1, n)); x = (x - np.linspace(x[0], x[-1], n))
            return (x / (np.abs(x).max() + 1e-6) * amp + rng.uniform(-amp * .3, amp * .3, n)).astype(int)
        top, bot, esq, dir_ = borda(W, m * .45), borda(W, m * .45), borda(H, m * .45), borda(H, m * .45)
        yy, xx = np.mgrid[0:H, 0:W]
        a = ((yy > m * .5 + top[xx]) & (yy < H - m * .5 + bot[xx]) & (xx > m * .5 + esq[yy]) & (xx < W - m * .5 + dir_[yy])).astype(np.float32)
    else:
        raise SystemExit(f"recorte desconhecido: {recorte}")
    ys, xs = np.where(a > 0.05)
    if len(xs):
        x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
        bgr, a = bgr[y0:y1, x0:x1], a[y0:y1, x0:x1]
    cv2.imwrite(str(dst), np.dstack([bgr, (a * 255).clip(0, 255).astype(np.uint8)]))
    return f"doc/{dst.name}"


def _q(ws, gatilho, padrao):
    return ATRASO + round(quando(ws, gatilho, padrao) * FPS)


def main(args):
    rot_path = Path(args.roteiro).resolve()
    rot = ler_json(rot_path)
    base = rot_path.parent
    W, H = FORMATOS[args.formato or rot.get("formato", "reels")]
    edit = pasta_edit(rot_path)
    cenas = rot["cenas"]
    falas = narrar([c["fala"] for c in cenas], rot.get("voz", voz_padrao()), edit / "voz-doc", rot.get("velocidade", "-4%"))
    t, out = 0, []
    for i, (c, (mp3, ws, d)) in enumerate(zip(cenas, falas)):
        dur = ATRASO + int((d + c.get("sobra", SOBRA)) * FPS)
        q = {"inicio": t, "duracao": dur, "_mp3": str(mp3), "_ws": ws}
        if c.get("fundo"):
            fu = dict(c["fundo"])
            if fu.get("img"):
                fu["img"] = _publicar(base / fu["img"], fu.pop("recorte", False), edit)
            q["fundo"] = fu
        q["camadas"] = []
        for k in c.get("camadas", []):
            k = dict(k)
            k["img"] = _publicar(base / k["img"], k.pop("recorte", False), edit)
            k["t"] = _q(ws, k.pop("gatilho", None), 0) if k.get("t") is None else round(k["t"] * FPS)
            if k.get("sai"):
                k["ate"] = _q(ws, k.pop("sai"), d)
            q["camadas"].append(k)
        q["palavras"] = []
        for k, w in enumerate(c.get("palavras", [])):
            w = dict(w)
            w["t"] = _q(ws, w.pop("gatilho", None) or w["texto"].split("\n")[0], 0.2 + 0.3 * k)
            w.setdefault("x", 0.5); w.setdefault("y", 0.2); w.setdefault("tam", 0.12)
            if w.get("sai"):
                w["ate"] = _q(ws, w.pop("sai"), d)
            q["palavras"].append(w)
        q["marcas"] = []
        for m in c.get("marcas", []):
            m = dict(m)
            if "palavra" in m:                     # em volta de uma palavra da cena
                w = q["palavras"][m.pop("palavra")]
                linhas = w["texto"].split("\n")
                larg = max(len(s) for s in linhas) * w["tam"] * 0.43 + w["tam"] * 0.5
                alt = len(linhas) * w["tam"] * 1.05 * W / H + w["tam"] * 0.35 * W / H
                m.update(x=w["x"], y=w["y"] + w["tam"] * 0.06 * W / H, w=m.get("w", larg), h=m.get("h", alt))
                m["t"] = _q(ws, m.pop("gatilho", None), 0) if m.get("gatilho") else w["t"] + 6
            else:
                m["t"] = _q(ws, m.pop("gatilho", None), 0.4)
            q["marcas"].append(m)
        if c.get("rodape"):
            q["rodape"] = {"texto": c["rodape"]["texto"], "t": _q(ws, c["rodape"].get("gatilho"), 0.3),
                           **{k: c["rodape"][k] for k in ("y", "cor") if k in c["rodape"]}}
        out.append(q)
        t += dur
    serif, reto = rot.get("fonte_serif", "InstrumentSerif-Italic.ttf"), rot.get("fonte_reta", "InstrumentSerif-Regular.ttf")
    fontes_public(serif, reto)
    props = {"largura": W, "altura": H, "fps": FPS, "total": t, "tom": rot.get("tom", "pb"), "papel": rot.get("papel", "#e9e4d8"),
             "fontes": {"serif": f"fonts/{serif}", "reto": f"fonts/{reto}"},
             "cenas": [{k: v for k, v in q.items() if not k.startswith("_")} for q in out]}
    video = render("Documentario", props, edit / f"doc-video{'-rascunho' if args.rascunho else ''}.mp4", args.rascunho, edit)
    total = t / FPS
    m = Mix(total)
    if rot.get("musica"):
        mus = decodificar(base / rot["musica"])[: int(total * 48000)]
        env = np.ones(len(mus), np.float32)
        for q in out:                               # ducking sob a voz
            a, b = int((q["inicio"] + ATRASO) / FPS * 48000), int((q["inicio"] + q["duracao"]) / FPS * 48000)
            env[a:b] = 0.35
        env = np.convolve(env, np.ones(4800) / 4800, "same")
        m.put(0, mus * env, rot.get("volume_musica", 0.5))
    else:
        m.put(0, cama(total, 98.0), 0.12)
    for k, q in enumerate(out):
        t0 = q["inicio"] / FPS
        if k:
            m.put(max(0, t0 - 0.05), whoosh(0.3, 300, 2200, np.random.default_rng(k)), 0.12)
        for w in q["palavras"]:
            m.put(t0 + w["t"] / FPS, clique(0.03, np.random.default_rng(k * 7)), 0.18)
        for mk in q["marcas"]:
            m.put(t0 + mk["t"] / FPS, whoosh(0.25, 1800, 5000, np.random.default_rng(k * 11)), 0.08)
        if q.get("impacto") or k == len(out) - 1:
            m.put(t0, impacto(0.8), 0.18)
        m.put(t0 + ATRASO / FPS, decodificar(q["_mp3"]), 0.95)
    saida = edit / (args.saida or f"documentario-{args.formato or rot.get('formato', 'reels')}{'-rascunho' if args.rascunho else ''}.mp4")
    mixar(video, m, saida)
    (edit / "documentario-tempos.json").write_text(json.dumps([{"inicio_s": round(q["inicio"] / FPS, 2), "fala": c["fala"]} for q, c in zip(out, cenas)], ensure_ascii=False, indent=1))
    print(f"✓ {saida} ({sonda(saida)['duracao']:.1f}s, {len(out)} cenas)")
