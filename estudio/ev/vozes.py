"""Estúdio de voz: clona a voz do autor com motores abertos (Apache-2.0) e um perfil salvo.

Motores (instalados com `bash estudio/instalar.sh --voz`):
  omnivoice  k2-fsa/OmniVoice: clone com 3–10 s de referência + transcrição, 600+ línguas, 24 kHz
  voxcpm     openbmb/VoxCPM2: clone por continuação (referência + transcrição), português, 48 kHz
  chatterbox Resemble Chatterbox multilíngue: só a referência (sem transcrição)

O segredo da semelhança (aprendido no VoiceStudio): referência LIMPA de 6–12 s com a transcrição
EXATA do trecho. O perfil guarda isso em estudio/projetos/voz/perfil.json (fora do git):
  {"nome": "libero", "motor": "voxcpm", "ref": ".../amostras/03.wav", "ref_texto": "…", "parametros": {…}}
"""
import json
import re
from pathlib import Path

import numpy as np

from .comum import RAIZ, rodar

PASTA = RAIZ / "projetos" / "voz"
PERFIL = PASTA / "perfil.json"
_modelos = {}

# como cada sigla deve ser lida (os modelos leem letra por letra mal)
SIGLAS = {"OAB": "Ó A BÊ", "STF": "ÉSSE TÊ ÉFE", "STJ": "ÉSSE TÊ JÓTA", "PEC": "PÉC", "CF": "CÊ ÉFE", "FGV": "ÉFE GÊ VÊ",
          "ADI": "A DÊ Í", "ADPF": "A DÊ PÊ ÉFE", "TSE": "TÊ ÉSSE Ê", "CPI": "CÊ PÊ Í", "AI-5": "A Í cinco"}


def normalizar(texto):
    for s, f in SIGLAS.items():
        texto = re.sub(rf"\b{re.escape(s)}\b", f, texto)
    return texto


def frases(texto):
    return [p.strip() for p in re.split(r"(?<=[.!?])\s+", texto.replace("\n", " ")) if p.strip()]


def _omnivoice():
    if "omnivoice" not in _modelos:
        import torch
        from omnivoice import OmniVoice
        dev = "cuda" if torch.cuda.is_available() else "cpu"
        _modelos["omnivoice"] = OmniVoice.from_pretrained("k2-fsa/OmniVoice", device_map=dev,
                                                          dtype=torch.float16 if dev == "cuda" else torch.float32)
    return _modelos["omnivoice"]


def _voxcpm():
    if "voxcpm" not in _modelos:
        from voxcpm import VoxCPM
        _modelos["voxcpm"] = VoxCPM.from_pretrained("openbmb/VoxCPM2", load_denoiser=False, optimize=False)
    return _modelos["voxcpm"]


def _chatterbox():
    if "chatterbox" not in _modelos:
        import torch
        from chatterbox.mtl_tts import ChatterboxMultilingualTTS
        _modelos["chatterbox"] = ChatterboxMultilingualTTS.from_pretrained(device="cuda" if torch.cuda.is_available() else "cpu")
    return _modelos["chatterbox"]


def gerar(texto, motor, ref, ref_texto, saida, **par):
    """Gera `texto` com a voz da referência e grava WAV em `saida`. Frase a frase (mais estável)."""
    import soundfile as sf
    pedacos, sr = [], 24000
    for fr in frases(normalizar(texto)):
        if motor == "omnivoice":
            m = _omnivoice()
            a = m.generate(text=fr, language="pt", ref_audio=str(ref), ref_text=ref_texto,
                           num_step=par.get("passos", 32), guidance_scale=par.get("guia", 2.0), speed=par.get("velocidade", 1.0))[0]
            sr = m.sampling_rate
        elif motor == "voxcpm":
            m = _voxcpm()
            a = m.generate(text=fr, prompt_wav_path=str(ref), prompt_text=ref_texto, reference_wav_path=str(ref),
                           cfg_value=par.get("guia", 2.0), inference_timesteps=par.get("passos", 10))
            sr = m.tts_model.sample_rate
        elif motor == "chatterbox":
            m = _chatterbox()
            a = m.generate(fr, language_id="pt", audio_prompt_path=str(ref), exaggeration=par.get("expressao", 0.5),
                           cfg_weight=par.get("guia", 0.5)).squeeze().cpu().numpy()
            sr = m.sr
        else:
            raise SystemExit(f"motor desconhecido: {motor}")
        a = np.asarray(a, dtype=np.float32).reshape(-1)
        pedacos += [a, np.zeros(int(sr * 0.18), np.float32)]      # respiro entre frases
    sf.write(str(saida), np.concatenate(pedacos), sr)
    return Path(saida)


def melhores_refs(pasta=PASTA, n=3, min_s=6.0, max_s=12.5):
    """Trechos de referência candidatos (amostras.txt do `voz preparar`): duração boa e mais longos primeiro."""
    lst = []
    for linha in (Path(pasta) / "amostras.txt").read_text().splitlines():
        nome, dur, _, txt = linha.split("\t", 3)
        d = float(dur.rstrip("s"))
        if min_s <= d <= max_s and len(txt.split()) >= 8:
            lst.append((Path(pasta) / "amostras" / nome, txt.strip(), d))
    return [(w, transcrever_ref(w), d) for w, _, d in lst[:n]]


def transcrever_ref(wav, modelo="medium"):
    """Transcrição exata do trecho de referência (os motores dependem dela)."""
    cache = Path(wav).with_suffix(".txt")
    if cache.exists():
        return cache.read_text().strip()
    import subprocess
    from faster_whisper import WhisperModel
    pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", str(wav), "-ac", "1", "-ar", "16000", "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    if "_whisper" not in _modelos:
        _modelos["_whisper"] = WhisperModel(modelo, device="cpu", compute_type="int8")
    segs, _ = _modelos["_whisper"].transcribe(np.frombuffer(pcm, np.float32), language="pt", beam_size=5,
                                               initial_prompt=(RAIZ / "vocabulario.txt").read_text()[:600])
    txt = " ".join(s.text.strip() for s in segs).strip()
    cache.write_text(txt)
    return txt


def perfil():
    if not PERFIL.exists():
        raise SystemExit("sem perfil de voz: rode `ev.py voz preparar <vídeos>` e `ev.py voz comparar \"frase\"`, depois `ev.py voz escolher`")
    return json.loads(PERFIL.read_text())


def falar(texto, saida, perfil_=None):
    p = perfil_ or perfil()
    return gerar(texto, p["motor"], p["ref"], p["ref_texto"], saida, **p.get("parametros", {}))


def mp3(wav):
    out = Path(wav).with_suffix(".mp3")
    rodar(["ffmpeg", "-y", "-v", "error", "-i", wav, "-c:a", "libmp3lame", "-q:a", "3", out])
    return out
