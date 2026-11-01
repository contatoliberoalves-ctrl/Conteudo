"""Legenda "palavra gigante atrás da cabeça".

Uma palavra por vez (as curtas, como É/O/DE, juntam com a seguinte), em fonte
extra larga, com a base encostada no topo da cabeça e a pessoa NA FRENTE
(recorte de pessoa quadro a quadro com MODNet, ONNX, roda na CPU). O
preenchimento da letra é o próprio fundo invertido e desfocado, puxado para um
tom (bronze por padrão). Se a cabeça cobrir mais que o limite da palavra, a
palavra sobe. Gera um relatório com a cobertura de cada palavra.
"""
import subprocess
from pathlib import Path

import numpy as np

from .comum import FONTES, RAIZ, sonda

MODELO = RAIZ / "modelos" / "modnet.onnx"
URL = "https://huggingface.co/Xenova/modnet/resolve/main/onnx/model.onnx"
CURTAS = {"é", "o", "a", "e", "de", "da", "do", "em", "no", "na", "um", "os", "as", "se", "ao", "à",
          "eu", "me", "te", "já", "só", "tá", "pra", "pro", "que", "com", "por", "dos", "das", "nos",
          "nas", "uma", "mas", "nem", "seu", "sua", "meu", "lhe", "é,"}


def tokens(ws, hold=0.7):
    """[(inicio, fim, TEXTO)]: uma palavra por vez; curtas grudam na seguinte."""
    out, i = [], 0
    while i < len(ws):
        grupo = [ws[i]]
        while (grupo[-1]["w"].lower().strip(".,!?;:") in CURTAS and i + 1 < len(ws)
               and ws[i + 1]["s"] - grupo[-1]["e"] < 0.35 and len(grupo) < 3):
            i += 1
            grupo.append(ws[i])
        txt = " ".join(w["w"] for w in grupo).upper()
        txt = txt.strip(".,;:!?…\"'").replace(",", "")
        out.append([grupo[0]["s"], grupo[-1]["e"], txt])
        i += 1
    for k in range(len(out)):
        prox = out[k + 1][0] if k + 1 < len(out) else out[k][1] + 0.4
        out[k][1] = prox if prox - out[k][1] < hold else out[k][1] + 0.3
    return out


class Recorte:
    def __init__(self, W, H, lado=384):
        import onnxruntime as ort
        if not MODELO.exists():
            import urllib.request
            MODELO.parent.mkdir(exist_ok=True)
            urllib.request.urlretrieve(URL, MODELO)
        self.s = ort.InferenceSession(str(MODELO), providers=["CPUExecutionProvider"])
        self.nome = self.s.get_inputs()[0].name
        self.h = lado
        self.w = max(32, round(lado * W / H / 32) * 32)

    def __call__(self, rgb):
        import cv2
        x = cv2.resize(rgb, (self.w, self.h), interpolation=cv2.INTER_AREA).astype(np.float32) / 127.5 - 1
        return self.s.run(None, {self.nome: x.transpose(2, 0, 1)[None]})[0][0, 0]


def hex_rgb(h):
    h = h.lstrip("#")
    return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], np.float32)


def processar(entrada, ws, cfg, saida, preview=False):
    import cv2
    from PIL import Image, ImageDraw, ImageFont
    info = sonda(entrada)
    W, H, fps = info["largura"], info["altura"], info["fps"] or 30
    n_total = int(info["duracao"] * fps + 0.5)
    toks = tokens(ws)
    fonte = str(FONTES / cfg.get("arquivo_fonte", "ArchivoExpanded-Black.ttf"))
    cap_alvo = cfg.get("altura_maiuscula", 0.13) * H
    larg_max = cfg.get("largura_max", 0.95) * W
    encosta = cfg.get("encosta", 0.12)          # fração da maiúscula que fica atrás da cabeça
    limite = cfg.get("cobertura_max", 0.5)
    tom_esc, tom_cla = hex_rgb(cfg.get("tom_escuro", "#4A321C")), hex_rgb(cfg.get("tom_claro", "#E7C89A"))
    mistura = cfg.get("mistura_tom", 0.55)
    margem = int(0.03 * H)

    cache = {}

    def mascara_texto(txt):
        if txt in cache:
            return cache[txt]
        f = ImageFont.truetype(fonte, 100)
        cap = f.getbbox("H")[3] - f.getbbox("H")[1]
        tam = 100 * cap_alvo / cap
        f = ImageFont.truetype(fonte, int(tam))
        bb = f.getbbox(txt)
        if bb[2] - bb[0] > larg_max:
            f = ImageFont.truetype(fonte, int(tam * larg_max / (bb[2] - bb[0])))
            bb = f.getbbox(txt)
        img = Image.new("L", (bb[2] - bb[0] + 4, bb[3] - bb[1] + 4), 0)
        ImageDraw.Draw(img).text((2 - bb[0], 2 - bb[1]), txt, font=f, fill=255)
        hb = f.getbbox("H")
        base = hb[3] - bb[1] + 2          # linha de base dentro da imagem
        cache[txt] = (np.asarray(img, np.float32) / 255.0, base, hb[3] - hb[1])
        return cache[txt]

    rec = Recorte(W, H, 512)   # abaixo de 512 o MODNet perde a pessoa em close
    passo = 3 if preview else 2
    ler = subprocess.Popen(["ffmpeg", "-v", "error", "-i", str(entrada), "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                           stdout=subprocess.PIPE)
    escrever = subprocess.Popen(["ffmpeg", "-y", "-v", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
                                 "-s", f"{W}x{H}", "-r", str(fps), "-i", "-", "-c:v", "libx264",
                                 "-preset", "ultrafast" if preview else "medium", "-crf", "28" if preview else "15",
                                 "-pix_fmt", "yuv420p", str(saida)], stdin=subprocess.PIPE)
    tam = W * H * 3
    m_peq = None
    topo_suave = None
    relatorio = {}
    k = 0
    tk = 0
    while True:
        buf = ler.stdout.read(tam)
        if len(buf) < tam:
            break
        fr = np.frombuffer(buf, np.uint8).reshape(H, W, 3)
        t = k / fps
        if k % passo == 0 or m_peq is None:
            novo = rec(fr)
            m_peq = novo if m_peq is None else 0.65 * novo + 0.35 * m_peq
        while tk < len(toks) and toks[tk][1] <= t:
            tk += 1
        out = fr
        if tk < len(toks) and toks[tk][0] <= t < toks[tk][1]:
            txt = toks[tk][2]
            a_txt, base, cap = mascara_texto(txt)
            mh, mw = m_peq.shape
            # topo da cabeça: primeira linha com pessoa na faixa do centro da pessoa
            col = m_peq.sum(0)
            cx = int((col * np.arange(mw)).sum() / max(col.sum(), 1e-6)) if col.sum() > 1 else mw // 2
            faixa = m_peq[:, max(0, cx - mw // 10):cx + mw // 10]
            linhas = np.where(faixa.max(1) > 0.5)[0]
            topo = (linhas[0] / mh * H) if len(linhas) else H * 0.45
            topo_suave = topo if topo_suave is None else 0.8 * topo_suave + 0.2 * topo
            th, tw = a_txt.shape
            x0 = (W - tw) // 2
            y_base = int(topo_suave + encosta * cap)
            y0 = max(margem, y_base - base)
            pm = cv2.resize(m_peq, (W, H), interpolation=cv2.INTER_LINEAR)
            cob = 1.0
            while True:
                y1 = min(H, y0 + th)
                a = a_txt[:y1 - y0]
                cob = float((a * pm[y0:y1, x0:x0 + tw]).sum() / max(a.sum(), 1))
                if cob <= limite or y0 <= margem:
                    break
                y0 = max(margem, y0 - int(0.05 * cap))
            relatorio[txt] = max(relatorio.get(txt, 0), round(cob, 2))
            # preenchimento: fundo invertido, desfocado e puxado para o tom
            reg = fr[y0:y1, x0:x0 + tw].astype(np.float32)
            peq = cv2.resize(reg, (max(1, tw // 16), max(1, (y1 - y0) // 16)), interpolation=cv2.INTER_AREA)
            peq = cv2.GaussianBlur(peq, (0, 0), 2)
            borr = cv2.resize(peq, (tw, y1 - y0), interpolation=cv2.INTER_CUBIC)
            inv = 255 - borr
            lum = (inv @ np.array([0.299, 0.587, 0.114], np.float32))[..., None] / 255
            tom = tom_esc + (tom_cla - tom_esc) * lum
            fill = (1 - mistura) * inv + mistura * tom
            pr = pm[y0:y1, x0:x0 + tw, None]
            at = a[..., None] * (1 - pr)
            out = fr.copy()
            out[y0:y1, x0:x0 + tw] = (reg * (1 - at) + fill * at).clip(0, 255).astype(np.uint8)
        escrever.stdin.write(out.tobytes())
        k += 1
        if k % 30 == 0:
            print(f"\r  palavra atrás: {k}/{n_total} quadros", end="", flush=True)
    print()
    ler.wait()
    escrever.stdin.close()
    escrever.wait()
    ruins = {p: c for p, c in relatorio.items() if c > limite}
    return {"palavras": len(relatorio), "cobertas_demais": ruins}
