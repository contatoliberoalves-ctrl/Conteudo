"""Transcrição local e gratuita (faster-whisper) com tempo de cada palavra.

Gera, por vídeo, edit/transcricoes/<nome>.json (palavras com início/fim) e
edit/falas.md: as falas em frases com [início-fim], as pausas e os vícios
marcados. O falas.md é o que o Claude lê para decidir os cortes: dá a precisão
da palavra lendo só texto (bem menos tokens que o JSON).
"""
import re
import subprocess
from pathlib import Path

from .comum import RAIZ, assinatura, gravar_json, ler_json, pasta_edit, sonda

# Hesitações puras: sempre candidatas a corte. "é"/"tipo"/"né" só quando
# viram muleta (decide-se lendo o falas.md, não aqui).
VICIOS = {"hã", "hãa", "ã", "ãh", "ah", "ahn", "aham", "hum", "hmm", "hm", "uhm", "um",
          "eh", "éh", "éé", "ééé", "ehh", "mmm"}
MULETAS = {"tipo", "né", "então", "assim", "enfim", "basicamente", "vamos", "beleza"}


def limpa(w):
    return re.sub(r"[^\wÀ-ú]", "", w.lower())


def e_vicio(w):
    t = w.strip().lower()
    if limpa(t) in VICIOS:
        return True
    return t.startswith("é") and t.endswith("...") and len(limpa(t)) <= 2   # "É..."


def modelo_padrao():
    try:
        import ctranslate2
        if ctranslate2.get_cuda_device_count() > 0:
            return "large-v3", "cuda", "float16"
    except Exception:
        pass
    return "small", "cpu", "int8"


def transcrever(video, modelo=None, forcar=False, lingua="pt"):
    edit = pasta_edit(video)
    (edit / "transcricoes").mkdir(exist_ok=True)
    nome = Path(video).stem
    saida = edit / "transcricoes" / f"{nome}.json"
    sig = assinatura(video)
    if saida.exists() and not forcar:
        d = ler_json(saida)
        if d.get("assinatura") == sig:
            return d

    from faster_whisper import WhisperModel
    m_nome, dispositivo, tipo = modelo_padrao()
    m_nome = modelo or m_nome
    vocab = (RAIZ / "vocabulario.txt").read_text().strip() if (RAIZ / "vocabulario.txt").exists() else ""
    # O prompt inicial com hesitações faz o Whisper transcrevê-las em vez de limpar.
    prompt = "Hã, é... então, tipo, né. Ahn, hum. " + vocab

    # decodifica com o ffmpeg (evita depender da versão do PyAV)
    import numpy as np
    pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", str(video), "-vn", "-ac", "1", "-ar", "16000",
                          "-f", "f32le", "-"], capture_output=True, check=True).stdout
    audio = np.frombuffer(pcm, dtype=np.float32)
    if True:
        m = WhisperModel(m_nome, device=dispositivo, compute_type=tipo)
        segs, info = m.transcribe(audio, language=lingua, word_timestamps=True,
                                  vad_filter=True, vad_parameters={"min_silence_duration_ms": 300},
                                  initial_prompt=prompt[:800], condition_on_previous_text=False,
                                  beam_size=5)
        palavras = []
        for s in segs:
            for w in s.words or []:
                t = w.word.strip()
                if not t:
                    continue
                palavras.append({"w": t, "s": round(w.start, 3), "e": round(w.end, 3),
                                 "p": round(w.probability, 2)})
    d = {"fonte": str(Path(video).resolve()), "assinatura": sig, "modelo": m_nome,
         "info": sonda(video), "palavras": palavras}
    gravar_json(saida, d)
    return d


def frases(palavras, pausa=0.5):
    """Agrupa palavras em frases que quebram em pausas >= `pausa` s."""
    grupos, atual = [], []
    for w in palavras:
        if atual and w["s"] - atual[-1]["e"] >= pausa:
            grupos.append(atual)
            atual = []
        atual.append(w)
    if atual:
        grupos.append(atual)
    return grupos


def empacotar(edit):
    """Escreve edit/falas.md com todas as transcrições da pasta."""
    linhas = ["# Falas (tempo em segundos no arquivo original)",
              "Legenda: {hã} = hesitação (corta sempre) · ⟨tipo⟩ = possível muleta · "
              "(pausa 1.2s) = silêncio entre frases · ?palavra = baixa confiança", ""]
    for arq in sorted((Path(edit) / "transcricoes").glob("*.json")):
        d = ler_json(arq)
        ws = d["palavras"]
        dur = d["info"]["duracao"]
        fr = frases(ws)
        linhas.append(f"## {arq.stem}  ({dur:.1f}s, {len(ws)} palavras, {len(fr)} frases)")
        ant = 0.0
        for g in fr:
            gap = g[0]["s"] - ant
            if gap >= 1.0:
                linhas.append(f"  (pausa {gap:.1f}s)")
            txt = []
            for w in g:
                t = w["w"]
                if e_vicio(t):
                    t = "{" + t + "}"
                elif limpa(t) in MULETAS:
                    t = "⟨" + t + "⟩"
                if w["p"] < 0.45:
                    t = "?" + t
                txt.append(t)
            linhas.append(f"  [{g[0]['s']:07.2f}-{g[-1]['e']:07.2f}] {' '.join(txt)}")
            ant = g[-1]["e"]
        if dur - ant >= 1.0:
            linhas.append(f"  (pausa final {dur - ant:.1f}s)")
        linhas.append("")
    (Path(edit) / "falas.md").write_text("\n".join(linhas))
    return Path(edit) / "falas.md"


def main(args):
    videos = []
    for a in args.videos:
        p = Path(a)
        if p.is_dir():
            videos += sorted(x for x in p.iterdir()
                             if x.suffix.lower() in {".mp4", ".mov", ".mkv", ".m4v", ".webm", ".mp3", ".wav", ".m4a"})
        else:
            videos.append(p)
    if not videos:
        raise SystemExit("nenhum vídeo encontrado")
    for v in videos:
        d = transcrever(str(v), args.modelo, args.forcar)
        print(f"✓ {v.name}: {len(d['palavras'])} palavras ({d['modelo']})")
    f = empacotar(pasta_edit(videos[0]))
    print(f"→ {f}")
