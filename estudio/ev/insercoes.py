"""Inserções sobre o vídeo gravado: o que aparece além de você e da legenda.

No edl.json:
 "insercoes": [                                   # camada da frente (Remotion, fundo transparente)
   {"tipo": "personagem", "personagem": "lex", "pose": "acena", "expressao": "feliz", "balao": "Isso cai!",
    "posicao": "canto-dir", "gatilho": "constitucional", "duracao": 2.6},
   {"tipo": "icone", "icone": "calendar-days", "texto": "120 dias", "gatilho": "prazo", "duracao": 2},
   {"tipo": "imagem", "arquivo": "print.png", "rotulo": "STF, 2024", "posicao": "topo", "inicio": 3.0, "fim": 6.0},
   {"tipo": "video", "arquivo": "broll.mp4", "posicao": "metade-topo", "gatilho": "…", "duracao": 3},
   {"tipo": "card", "titulo": "Art. 5º, LXIX", "texto": "direito líquido e certo", "posicao": "topo", "gatilho": "…"},
   {"tipo": "lista", "titulo": "Você vai ver", "itens": ["…", "…"], "posicao": "centro", "gatilho": "…", "duracao": 3.5},
   {"tipo": "objeto", "objeto": {"tipo": "carimbo", "texto": "6/6", "x": 0.5, "y": 0.22}, "gatilho": "gabaritar"}],
 "layout": [                                      # mexe no próprio vídeo
   {"tipo": "dividida", "gatilho": "…", "duracao": 3},          # você na metade de baixo; em cima, as inserções "metade-topo"
   {"tipo": "recorte", "inicio": 4, "fim": 7, "cenario": "tribunal"},   # você recortado na frente de um cenário desenhado
   {"tipo": "recorte", "gatilho": "…", "duracao": 3, "arquivo": "foto.jpg"}]  # … ou de uma imagem

Tempo: "inicio"/"fim" em segundos do vídeo final, ou "gatilho" (palavra dita; "ocorrencia": 2 para a
segunda vez) + "duracao". Ícones: nomes do Lucide (lucide.dev/icons), baixados na hora.
"""
import json
import os
import re
import shutil
import subprocess
import urllib.request
from pathlib import Path

import numpy as np

from .comum import rodar, sonda
from .motion import NAVEGADOR, PROJETO, garantir_projeto

FPS = 30
LUCIDE = "https://cdn.jsdelivr.net/npm/lucide-static@0.460.0/icons/{}.svg"


def _norm(t):
    import unicodedata
    t = unicodedata.normalize("NFD", t.lower())
    return re.sub(r"[^a-z0-9]", "", "".join(c for c in t if unicodedata.category(c) != "Mn"))


def janela(item, ws, total):
    """(inicio, fim) em segundos no vídeo final."""
    if item.get("gatilho"):
        alvo = _norm(item["gatilho"].split()[0])
        achados = [w for w in ws if _norm(w["w"]).startswith(alvo[:6]) and w["s"] >= item.get("apos", 0)]
        if not achados:
            raise SystemExit(f"gatilho '{item['gatilho']}' não foi dito no vídeo final")
        w = achados[min(item.get("ocorrencia", 1), len(achados)) - 1]
        ini = max(0.0, w["s"] - item.get("antes", 0.12))
        return ini, min(total, ini + item.get("duracao", 2.5))
    ini = float(item.get("inicio", 0))
    return ini, min(total, float(item.get("fim", ini + item.get("duracao", 2.5))))


def icone(nome):
    pasta = PROJETO / "public" / "icones"
    pasta.mkdir(parents=True, exist_ok=True)
    arq = pasta / f"{nome}.svg"
    if not arq.exists():
        try:
            with urllib.request.urlopen(LUCIDE.format(nome), timeout=20) as r:
                arq.write_bytes(r.read())
        except Exception:
            r = subprocess.run(["curl", "-sfL", LUCIDE.format(nome)], capture_output=True)
            if r.returncode:
                raise SystemExit(f"ícone '{nome}' não existe no Lucide (veja lucide.dev/icons)")
            arq.write_bytes(r.stdout)
    svg = arq.read_text()
    return re.sub(r"(?s)^.*?<svg[^>]*>|</svg>\s*$", "", svg).strip()


def publicar(arquivo, edit):
    """Copia imagem/vídeo para o public/ do Remotion e devolve o caminho relativo."""
    src = Path(arquivo) if Path(arquivo).is_absolute() else edit / arquivo
    if not src.exists():
        raise SystemExit(f"arquivo da inserção não existe: {src}")
    pasta = PROJETO / "public" / "insercoes"
    pasta.mkdir(parents=True, exist_ok=True)
    shutil.copy(src, pasta / src.name)
    return f"insercoes/{src.name}"


def montar_itens(edl, ws, total, edit):
    itens = []
    for it in edl.get("insercoes", []):
        a, b = janela(it, ws, total)
        x = {k: v for k, v in it.items() if k not in ("gatilho", "duracao", "ocorrencia", "antes", "apos", "icone")}
        x.update(inicio=round(a * FPS), fim=round(b * FPS))
        if it["tipo"] == "icone":
            x["svg"] = icone(it.get("icone", "sparkles"))
        if it.get("arquivo"):
            x["arquivo"] = publicar(it["arquivo"], edit)
        itens.append(x)
    for lay in edl.get("layout", []):
        if lay["tipo"] == "recorte":
            a, b = janela(lay, ws, total)
            if lay.get("arquivo"):
                itens.append({"tipo": "fundo-imagem", "arquivo": publicar(lay["arquivo"], edit), "inicio": round(a * FPS), "fim": round(b * FPS)})
            else:
                itens.append({"tipo": "cenario", "cenario": lay.get("cenario", "palco"), "quadro": lay.get("quadro"),
                              "inicio": round(a * FPS), "fim": round(b * FPS)})
    return itens


def render_camada(itens, camada, total, CW, CH, preview, pal, fontes, edit):
    if not [i for i in itens if (i["tipo"] in ("cenario", "fundo-imagem")) == (camada == "fundo")]:
        return None
    garantir_projeto()
    W, H = (CW * 2, CH * 2) if preview else (CW, CH)
    props = {"largura": W, "altura": H, "fps": FPS, "total": int(np.ceil(total * FPS)) + 1, "paleta": pal,
             "fontes": fontes, "itens": itens, "camada": camada}
    pj = edit / f"camada-{camada}.json"
    pj.write_text(json.dumps(props, ensure_ascii=False))
    saida = edit / f"camada-{camada}{'-prev' if preview else ''}.webm"
    chave = edit / f"camada-{camada}.chave"
    ass = json.dumps(props, sort_keys=True)
    if saida.exists() and chave.exists() and chave.read_text() == ass:
        return saida
    env = {**os.environ, **({"REMOTION_BROWSER": NAVEGADOR} if Path(NAVEGADOR).exists() else {})}
    cmd = ["npx", "remotion", "render", "src/index.ts", "Camada", str(saida), f"--props={pj}", "--log=error",
           "--codec=vp9", "--image-format=png", "--pixel-format=yuva420p"] + (["--scale=0.5"] if preview else [])
    r = subprocess.run(cmd, cwd=PROJETO, env=env, capture_output=True, text=True)
    if r.returncode or not saida.exists():
        print(r.stdout[-2500:], r.stderr[-2500:])
        raise SystemExit("render da camada de inserções falhou")
    chave.write_text(ass)
    return saida


def recorte_pessoa(montagem, a, b, destino):
    """Você recortado (MODNet) entre a e b, em WebM com transparência."""
    if destino.exists():
        return destino
    from .palavra_atras import Recorte
    info = sonda(montagem)
    W, H, fps = info["largura"], info["altura"], info["fps"] or 30
    rec = Recorte(W, H, 512)
    import cv2
    ler = subprocess.Popen(["ffmpeg", "-v", "error", "-ss", f"{a:.3f}", "-t", f"{b - a:.3f}", "-i", str(montagem),
                            "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
    esc = subprocess.Popen(["ffmpeg", "-y", "-v", "error", "-f", "rawvideo", "-pix_fmt", "rgba", "-s", f"{W}x{H}", "-r", str(fps),
                            "-i", "-", "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "0", "-crf", "30", "-deadline", "realtime",
                            "-cpu-used", "8", str(destino)], stdin=subprocess.PIPE)
    m, k = None, 0
    while True:
        buf = ler.stdout.read(W * H * 3)
        if len(buf) < W * H * 3:
            break
        fr = np.frombuffer(buf, np.uint8).reshape(H, W, 3)
        if k % 2 == 0 or m is None:
            novo = rec(fr)
            m = novo if m is None else 0.65 * novo + 0.35 * m
        # só a maior mancha (você): tira pedaços soltos do fundo que o modelo achou que eram gente
        bin_ = (m > 0.5).astype(np.uint8)
        n, rot, est, _ = cv2.connectedComponentsWithStats(bin_)
        if n > 1:
            maior = 1 + int(np.argmax(est[1:, cv2.CC_STAT_AREA]))
            mascara = cv2.dilate((rot == maior).astype(np.uint8), np.ones((5, 5), np.uint8))
            m_limpo = m * mascara
        else:
            m_limpo = m
        alfa = cv2.resize(m_limpo, (W, H), interpolation=cv2.INTER_LINEAR)
        alfa = np.clip((alfa - 0.15) / 0.7, 0, 1)
        esc.stdin.write(np.dstack([fr, (alfa * 255).astype(np.uint8)]).tobytes())
        k += 1
    ler.wait()
    esc.stdin.close()
    esc.wait()
    return destino


def aplicar(edl, ws, dur, montagem, edit, CW, CH, preview, estilo, rostos_saida, entradas, fc, v, k):
    """Acrescenta as camadas ao filtro da passada final. Devolve (v, k, posicoes_fixas_da_legenda)."""
    if not edl.get("insercoes") and not edl.get("layout"):
        return v, k, []
    E, C = estilo.get("explicativo", {}), estilo["cartela"]
    pal = {"fundo": E.get("fundo", C["fundo"]), "fundo2": E.get("fundo2", C["fundo"]), "texto": E.get("texto", C["texto"]),
           "acento": E.get("acento", C["acento"]), "apagado": "#8A9099"}
    from .comum import FONTES
    tit = E.get("fonte_titulo", C.get("arquivo_titulo", "BebasNeue-Regular.ttf"))
    cor = E.get("fonte_corpo", C.get("arquivo_corpo", "Poppins-Bold.ttf"))
    (PROJETO / "public" / "fonts").mkdir(parents=True, exist_ok=True)
    for f in (tit, cor):
        shutil.copy(FONTES / f, PROJETO / "public" / "fonts" / f)
    fontes = {"titulo": f"fonts/{tit}", "corpo": f"fonts/{cor}"}
    itens = montar_itens(edl, ws, dur, edit)
    fixas = []

    # 1. tela dividida: você vai para a metade de baixo
    divs = [janela(l, ws, dur) for l in edl.get("layout", []) if l["tipo"] == "dividida"]
    if divs:
        ys = [fy for (a, b, fy, fh) in rostos_saida] or [0.4]
        fy = float(np.median(ys))
        y0 = int(min(max(fy * CH - CH / 4, 0), CH / 2)) // 2 * 2
        en = "+".join(f"between(t,{a:.3f},{b:.3f})" for a, b in divs)
        fc.append(f"{v}split[vd1][vd2];[vd2]crop={CW}:{CH // 2}:0:{y0},pad={CW}:{CH}:0:{CH // 2}:color={pal['fundo'].lstrip('#')}[vdiv];"
                  f"[vd1][vdiv]overlay=0:0:enable='{en}'[vdv]")
        v = "[vdv]"
        fixas += [(a, b, 0.53) for a, b in divs]

    # 2. recorte: cenário/imagem atrás de você
    fundo = render_camada(itens, "fundo", dur, CW, CH, preview, pal, fontes, edit)
    if fundo:
        entradas += ["-c:v", "libvpx-vp9", "-i", str(fundo)]
        fc.append(f"[{k}:v]format=rgba[cf];{v}[cf]overlay=0:0:eof_action=pass[vcf]")
        v, k = "[vcf]", k + 1
        for j, l in enumerate([l for l in edl.get("layout", []) if l["tipo"] == "recorte"]):
            a, b = janela(l, ws, dur)
            pessoa = recorte_pessoa(montagem, a, b, edit / f"pessoa-{j}-{a:.2f}-{b:.2f}{'-prev' if preview else ''}.webm")
            entradas += ["-c:v", "libvpx-vp9", "-i", str(pessoa)]
            e = l.get("escala", 0.84)       # menor que o quadro para o cenário aparecer
            fc.append(f"[{k}:v]format=rgba,scale=iw*{e}:-2,setpts=PTS-STARTPTS+{a:.3f}/TB[pp{j}];"
                      f"{v}[pp{j}]overlay=(W-w)/2:H-h:enable='between(t,{a:.3f},{b:.3f})':eof_action=pass[vp{j}]")
            v, k = f"[vp{j}]", k + 1

    # 3. camada da frente
    frente = render_camada(itens, "frente", dur, CW, CH, preview, pal, fontes, edit)
    if frente:
        entradas += ["-c:v", "libvpx-vp9", "-i", str(frente)]
        fc.append(f"[{k}:v]format=rgba[cfr];{v}[cfr]overlay=0:0:eof_action=pass[vfr]")
        v, k = "[vfr]", k + 1
    return v, k, fixas
