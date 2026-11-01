"""Cartoon narrado: personagens desenhados (Lex, Martelo, Ana, Beto) conversando em cenários
desenhados, boca sincronizada à voz de cada um, balões, objetos de cena que entram na palavra
certa, câmera, efeitos sonoros e legenda.

  ev.py cartoon roteiro.json [--formato reels|youtube] [--rascunho] [--sem-legenda]

roteiro.json:
{"estilo": "constitucionalgabaritado", "formato": "reels",
 "vozes": {"ana": "pt-BR-FranciscaNeural", "lex": "pt-BR-AntonioNeural"},
 "elenco": {"ana": "ana", "lex": "lex"},                      # id → desenho (lex, martelo, ana, beto)
 "cenas": [
  {"cenario": "estudo", "camera": "zoom-in", "titulo": "Mandado de segurança",
   "personagens": [{"id": "ana", "x": 0.3, "pose": "pensando"}, {"id": "lex", "x": 0.72, "entra_na_fala": 1}],
   "falas": [{"quem": "ana", "texto": "Qual o prazo do mandado de segurança?", "expressao": "surpreso", "balao": "Qual o prazo?"},
             {"quem": "lex", "texto": "Cento e vinte dias, contados da ciência do ato.", "pose": "explica"}],
   "objetos": [{"tipo": "calendario", "numero": 120, "rotulo": "dias", "x": 0.5, "y": 0.3, "gatilho": "cento", "fala": 1}]}]}
"""
import json
import os
import shutil
import subprocess
from pathlib import Path

import numpy as np

from .comum import FONTES, FORMATOS, carregar_estilo, ler_json, pasta_edit, rodar, sonda
from .explicativo import edge_com_tempos, norm
from .motion import NAVEGADOR, PROJETO, garantir_projeto
from .sfx import Mix, cama, pop, whoosh

FPS = 30
VOZ_PADRAO = {"ana": "pt-BR-FranciscaNeural", "beto": "pt-BR-AntonioNeural", "lex": "pt-BR-AntonioNeural",
              "martelo": "pt-BR-AntonioNeural"}


def decodificar(mp3, sr=48000):
    pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", str(mp3), "-ac", "1", "-ar", str(sr), "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(pcm, np.float32)


def envelope(audio, sr=48000):
    """Abertura da boca por quadro (0–1): RMS por quadro, normalizado, com ataque rápido."""
    n = int(len(audio) / sr * FPS) + 1
    passo = sr // FPS
    rms = np.array([np.sqrt(np.mean(audio[i * passo:(i + 1) * passo] ** 2) + 1e-12) if len(audio[i * passo:(i + 1) * passo]) else 0.0
                    for i in range(n)])
    ref = np.percentile(rms, 95) + 1e-9
    v = np.clip((rms / ref - 0.12) / 0.88, 0, 1) ** 0.7
    out = np.zeros_like(v)
    for i in range(len(v)):                      # abre rápido, fecha um pouco mais devagar
        prev = out[i - 1] if i else 0
        out[i] = v[i] if v[i] > prev else prev * 0.55 + v[i] * 0.45
    return [round(float(x), 3) for x in out]


def montar(rot, edit, W, H):
    vozes = {**VOZ_PADRAO, **rot.get("vozes", {})}
    elenco = rot.get("elenco", {})
    cache = edit / "cartoon-voz"
    cache.mkdir(exist_ok=True)
    cenas, t, faixas, palavras = [], 0, [], []
    for ci, c in enumerate(rot["cenas"]):
        pad_ini = round(0.55 * FPS)
        cursor = pad_ini
        falas = []
        for fi, fl in enumerate(c.get("falas", [])):
            voz = vozes.get(fl["quem"], vozes.get(elenco.get(fl["quem"], ""), "pt-BR-AntonioNeural"))
            import hashlib
            k = hashlib.sha1(json.dumps([fl["texto"], voz, rot.get("velocidade", "+0%")]).encode()).hexdigest()[:10]
            mp3, js = cache / f"{k}.mp3", cache / f"{k}.json"
            if not js.exists():
                ws = edge_com_tempos(fl["texto"], voz, mp3, rot.get("velocidade", "+0%"))
                js.write_text(json.dumps(ws, ensure_ascii=False))
            ws = json.loads(js.read_text())
            audio = decodificar(mp3)
            dur = int(np.ceil(len(audio) / 48000 * FPS))
            falas.append({"quem": fl["quem"], "inicio": cursor, "fim": cursor + dur, "envelope": envelope(audio),
                          "pose": fl.get("pose"), "expressao": fl.get("expressao"), "balao": fl.get("balao"), "_ws": ws})
            faixas.append(((t + cursor) / FPS, audio))
            palavras += [{"w": w["w"], "s": (t + cursor) / FPS + w["s"], "e": (t + cursor) / FPS + w["e"]} for w in ws]
            cursor += dur + round(fl.get("pausa", 0.28) * FPS)
        dur_cena = max(cursor + round(c.get("segura", 0.5) * FPS), round(c.get("duracao_min", 2.5) * FPS))
        pers = []
        for pe in c.get("personagens", []):
            entra = 0
            if pe.get("entra_na_fala") is not None and pe["entra_na_fala"] < len(falas):
                entra = max(0, falas[pe["entra_na_fala"]]["inicio"] - 10)
            elif pe.get("entra") is not None:
                entra = round(pe["entra"] * FPS)
            pers.append({"id": pe["id"], "tipo": elenco.get(pe["id"], pe.get("tipo", pe["id"])), "x": pe["x"],
                         "escala": pe.get("escala", 1), "pose": pe.get("pose"), "expressao": pe.get("expressao"),
                         "entra": entra, "virado": pe.get("virado", False)})
        objs = []
        for o in c.get("objetos", []):
            ini = 0
            fl = falas[o.get("fala", 0)] if falas else None
            if o.get("gatilho") and fl:
                alvo = norm(o["gatilho"])
                w = next((w for w in fl["_ws"] if norm(w["w"]).startswith(alvo[:5])), None)
                ini = fl["inicio"] + (round(w["s"] * FPS) if w else 0)
            elif o.get("inicio") is not None:
                ini = round(o["inicio"] * FPS)
            elif fl:
                ini = fl["inicio"]
            fim = round(o["fim"] * FPS) if o.get("fim") is not None else None
            objs.append({**{k: v for k, v in o.items() if k not in ("gatilho", "fala", "inicio", "fim")}, "inicio": ini,
                         **({"fim": fim} if fim is not None else {})})
            faixas.append(("pop", (t + ini) / FPS))
        for fl in falas:
            fl.pop("_ws")
        tit = None
        if c.get("titulo"):
            tit = {"texto": c["titulo"], "inicio": 4, "fim": min(dur_cena - 10, round(2.6 * FPS))}
        cenas.append({"inicio": t, "duracao": dur_cena, "cenario": c.get("cenario", "palco"), "quadro": c.get("quadro"),
                      "camera": c.get("camera", "parada"), "personagens": pers, "falas": falas, "objetos": objs,
                      **({"titulo": tit} if tit else {})})
        faixas.append(("whoosh", t / FPS))
        t += dur_cena
    return cenas, t, faixas, palavras


def main(args):
    rot_path = Path(args.roteiro).resolve()
    rot = ler_json(rot_path)
    estilo = carregar_estilo(rot.get("estilo", "padrao"))
    formato = args.formato or rot.get("formato", "reels")
    W, H = FORMATOS[formato]
    edit = pasta_edit(rot_path)
    cenas, total, faixas, palavras = montar(rot, edit, W, H)
    E, C = estilo.get("explicativo", {}), estilo["cartela"]
    pal = {"fundo": E.get("fundo", C["fundo"]), "fundo2": E.get("fundo2", C["fundo"]), "texto": E.get("texto", C["texto"]),
           "acento": E.get("acento", C["acento"]), "apagado": "#8A9099"}
    titulo = E.get("fonte_titulo", C.get("arquivo_titulo", "BebasNeue-Regular.ttf"))
    corpo = E.get("fonte_corpo", C.get("arquivo_corpo", "Poppins-Bold.ttf"))
    (PROJETO / "public" / "fonts").mkdir(parents=True, exist_ok=True)
    for f in (titulo, corpo):
        shutil.copy(FONTES / f, PROJETO / "public" / "fonts" / f)
    props = {"largura": W, "altura": H, "fps": FPS, "total": total, "paleta": pal,
             "fontes": {"titulo": f"fonts/{titulo}", "corpo": f"fonts/{corpo}"}, "cenas": cenas}
    pj = edit / "cartoon-props.json"
    pj.write_text(json.dumps(props, ensure_ascii=False))
    garantir_projeto()
    video = edit / f"cartoon-video{'-rascunho' if args.rascunho else ''}.mp4"
    env = {**os.environ, **({"REMOTION_BROWSER": NAVEGADOR} if Path(NAVEGADOR).exists() else {})}
    cmd = ["npx", "remotion", "render", "src/index.ts", "Cartoon", str(video), f"--props={pj}", "--log=error", "--codec=h264",
           "--crf=26" if args.rascunho else "--crf=17"] + (["--scale=0.5"] if args.rascunho else [])
    r = subprocess.run(cmd, cwd=PROJETO, env=env, capture_output=True, text=True)
    if r.returncode or not video.exists():
        print(r.stdout[-3000:], r.stderr[-3000:])
        raise SystemExit("render do cartoon falhou")

    # som: vozes + cama + efeitos
    m = Mix(total / FPS)
    m.put(0, cama(total / FPS, 196.0), 0.07)
    rng = 0
    for item in faixas:
        if item[0] == "pop":
            m.put(item[1], pop(820), 0.16)
        elif item[0] == "whoosh":
            rng += 1
            m.put(max(0, item[1] - 0.1), whoosh(0.45, 400, 2600, np.random.default_rng(rng)), 0.18)
        else:
            m.put(item[0], item[1], 0.9)
    wav = edit / "cartoon-som.wav"
    m.salvar(wav)

    fc, v = [], "0:v"
    if not args.sem_legenda and rot.get("legenda", True):
        from .legendas import gerar_ass
        est = json.loads(json.dumps(estilo))
        est["legenda"]["tamanho"] = round(est["legenda"]["tamanho"] * 0.72)
        est["legenda"]["max_caracteres"] = 20
        est["legenda"]["posicao_y"] = rot.get("legenda_y", 0.965 if H > W else 0.95)   # no chão, abaixo dos pés
        Wl, Hl = (W // 2, H // 2) if args.rascunho else (W, H)
        (edit / "cartoon.ass").write_text(gerar_ass(palavras, est, Wl, Hl))
        fdir = str(FONTES).replace(":", r"\:")
        fc.append(f"[0:v]subtitles=cartoon.ass:fontsdir='{fdir}'[vv]")
        v = "[vv]"
    saida = edit / (args.saida or f"cartoon-{formato}{'-rascunho' if args.rascunho else ''}.mp4")
    cmd = ["ffmpeg", "-y", "-v", "error", "-i", str(video), "-i", str(wav)]
    if fc:
        cmd += ["-filter_complex", ";".join(fc), "-map", v, "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-pix_fmt", "yuv420p"]
    else:
        cmd += ["-map", "0:v", "-c:v", "copy"]
    cmd += ["-map", "1:a", "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", "-shortest", str(saida)]
    r = subprocess.run(cmd, capture_output=True, text=True, cwd=edit)
    if r.returncode:
        print(r.stderr[-2000:])
        raise SystemExit("mixagem falhou")
    print(f"✓ {saida} ({sonda(saida)['duracao']:.1f}s, {len(cenas)} cenas)")
