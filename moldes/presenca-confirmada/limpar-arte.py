"""Separa uma arte pronta em fundo + peças do letreiro, para animar as peças por cima.

Dentro de cada caixa, todo pixel que não é o verde do cetim (letras prateadas, faixas rosa,
logos) entra na máscara e é preenchido pelo OpenCV (inpainting); depois a área recebe um
desfoque leve para o cetim não ficar manchado. Cada caixa também sai como peça PNG com
transparência (só o letreiro, sem o cetim em volta).

    python3 limpar-arte.py <arte> <pasta_saida> '<{"nome": [x0,y0,x1,y1], ...}>' ['<[[x0,y0,x1,y1], ...]>']
    → <pasta_saida>/fundo.png e <pasta_saida>/peca-<nome>.png

O 4º argumento (opcional) lista áreas com peças verdes (ex.: o ícone do COADALPE): nelas
a separação é pelo brilho, não pela cor do cetim.
"""
import json
import sys

import cv2
import numpy as np


def main():
    arte, pasta, pecas = sys.argv[1], sys.argv[2], json.loads(sys.argv[3])
    caixas = list(pecas.values())
    claras = json.loads(sys.argv[4]) if len(sys.argv) > 4 else []
    img = cv2.imread(arte, cv2.IMREAD_COLOR)
    b, g, r = [img[:, :, i].astype(np.int16) for i in range(3)]
    cetim = (g > r + 12) & (g > b + 4) & (g < 200)
    for x0, y0, x1, y1 in claras:
        cetim[y0:y1, x0:x1] = np.maximum(np.maximum(r, g), b)[y0:y1, x0:x1] < 115
    mascara = np.zeros(img.shape[:2], np.uint8)
    area = np.zeros(img.shape[:2], np.uint8)
    for x0, y0, x1, y1 in caixas:
        mascara[y0:y1, x0:x1] = np.where(cetim[y0:y1, x0:x1], 0, 255)
        area[y0:y1, x0:x1] = 255
    for nome, (x0, y0, x1, y1) in pecas.items():
        alfa = cv2.dilate(mascara[y0:y1, x0:x1], np.ones((5, 5), np.uint8))
        alfa = cv2.GaussianBlur(alfa, (0, 0), 1.5)
        peca = np.dstack([img[y0:y1, x0:x1], alfa])
        cv2.imwrite(f"{pasta}/peca-{nome}.png", peca)
    mascara = cv2.dilate(mascara, np.ones((9, 9), np.uint8))
    limpo = cv2.inpaint(img, mascara, 9, cv2.INPAINT_TELEA)
    # Suaviza só onde havia letreiro, com borda esfumada.
    suave = cv2.GaussianBlur(limpo, (0, 0), 7)
    peso = cv2.GaussianBlur((mascara > 0).astype(np.float32), (0, 0), 12)[..., None]
    final = (limpo * (1 - peso) + suave * peso).astype(np.uint8)
    cv2.imwrite(f"{pasta}/fundo.png", final)


if __name__ == "__main__":
    main()
