"""Acha o rosto ao longo do vídeo (OpenCV + YuNet, modelo de 230 KB) para o
reenquadramento 16:9 → 9:16 seguir quem fala. Resultado em cache:
edit/rostos/<nome>.json com [t, cx, cy, tamanho] normalizados (0–1)."""
import statistics
from pathlib import Path

from .comum import RAIZ, assinatura, gravar_json, ler_json, pasta_edit

MODELO = RAIZ / "modelos" / "yunet.onnx"
URL = ("https://media.githubusercontent.com/media/opencv/opencv_zoo/main/models/"
       "face_detection_yunet/face_detection_yunet_2023mar.onnx")


def detector():
    import cv2
    if not MODELO.exists():
        import urllib.request
        MODELO.parent.mkdir(exist_ok=True)
        urllib.request.urlretrieve(URL, MODELO)
    cv2.setLogLevel(0) if hasattr(cv2, "setLogLevel") else None
    return cv2.FaceDetectorYN.create(str(MODELO), "", (320, 320), 0.6)


def detectar(video, fps_amostra=2.0):
    edit = pasta_edit(video)
    (edit / "rostos").mkdir(exist_ok=True)
    saida = edit / "rostos" / f"{Path(video).stem}.json"
    sig = assinatura(video)
    if saida.exists():
        d = ler_json(saida)
        if d.get("assinatura") == sig:
            return d
    import cv2
    cap = cv2.VideoCapture(str(video))
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    passo = max(1, round(fps / fps_amostra))
    det = detector()
    pts, n = [], 0
    while True:
        ok = cap.grab()
        if not ok:
            break
        if n % passo == 0:
            ok, fr = cap.retrieve()
            if ok:
                h, w = fr.shape[:2]
                esc = 480 / max(w, h)
                peq = cv2.resize(fr, (int(w * esc), int(h * esc)))
                gh, gw = peq.shape[:2]
                det.setInputSize((gw, gh))
                fs = det.detect(peq)[1]
                if fs is not None and len(fs):
                    x, y, fw, fh = (float(v) for v in max(fs, key=lambda f: f[2] * f[3] * f[-1])[:4])
                    pts.append([round(n / fps, 2), round((x + fw / 2) / gw, 4),
                                round((y + fh / 2) / gh, 4), round(fh / gh, 4)])
        n += 1
    cap.release()
    d = {"assinatura": sig, "pontos": pts}
    gravar_json(saida, d)
    return d


def centro(dados, ini, fim):
    """Mediana do rosto no trecho (estável: sem tremer). None se não achou."""
    ps = [p for p in dados["pontos"] if ini - 0.5 <= p[0] <= fim + 0.5]
    if len(ps) < 1:
        return None
    return (statistics.median(p[1] for p in ps), statistics.median(p[2] for p in ps),
            statistics.median(p[3] for p in ps))
