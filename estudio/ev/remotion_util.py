"""Comum aos modelos feitos no Remotion: fontes no public/, render de uma composição,
narração por trecho (com tempo de cada palavra) e mixagem voz + cama + efeitos."""
import json
import os
import shutil
import subprocess
from pathlib import Path

import numpy as np

from .comum import FONTES, rodar, sonda
from .motion import NAVEGADOR, PROJETO, garantir_projeto

FPS = 30


def fontes_public(*nomes):
    (PROJETO / "public" / "fonts").mkdir(parents=True, exist_ok=True)
    for n in nomes:
        shutil.copy(FONTES / n, PROJETO / "public" / "fonts" / n)


def render(comp, props, saida, rascunho=False, edit=None):
    garantir_projeto()
    pj = Path(edit or Path(saida).parent) / f"{comp.lower()}-props.json"
    pj.write_text(json.dumps(props, ensure_ascii=False))
    env = {**os.environ, **({"REMOTION_BROWSER": NAVEGADOR} if Path(NAVEGADOR).exists() else {})}
    cmd = ["npx", "remotion", "render", "src/index.ts", comp, str(saida), f"--props={pj}", "--log=error", "--codec=h264",
           "--crf=26" if rascunho else "--crf=17"] + (["--scale=0.5"] if rascunho else [])
    r = subprocess.run(cmd, cwd=PROJETO, env=env, capture_output=True, text=True)
    if r.returncode or not Path(saida).exists():
        print(r.stdout[-3000:], r.stderr[-3000:])
        raise SystemExit(f"render do Remotion ({comp}) falhou")
    return Path(saida)


def narrar(textos, voz, pasta, velocidade="+0%"):
    """Lista de (mp3, palavras[s,e em segundos], duração) por texto, com cache."""
    import hashlib
    from .explicativo import sintetizar
    pasta = Path(pasta)
    pasta.mkdir(parents=True, exist_ok=True)
    out = []
    for t in textos:
        k = hashlib.sha1(json.dumps([t, voz, velocidade], ensure_ascii=False).encode()).hexdigest()[:10]
        mp3, js = pasta / f"{k}.mp3", pasta / f"{k}.json"
        if not js.exists():
            ws = sintetizar(t, voz, mp3, velocidade)
            js.write_text(json.dumps(ws, ensure_ascii=False))
        out.append((mp3, json.loads(js.read_text()), sonda(mp3)["duracao"]))
    return out


def decodificar(arq, sr=48000):
    pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", str(arq), "-ac", "1", "-ar", str(sr), "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(pcm, np.float32)


def mixar(video, mix, saida, lufs=-14):
    wav = Path(saida).with_suffix(".wav")
    mix.salvar(wav)
    rodar(["ffmpeg", "-y", "-v", "error", "-i", video, "-i", wav, "-map", "0:v", "-map", "1:a", "-c:v", "copy",
           "-af", f"loudnorm=I={lufs}:TP=-1.5:LRA=11", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart",
           "-shortest", saida])
    wav.unlink()
    return Path(saida)
