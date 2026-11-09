"""Efeitos, tom e velocidade de voz (ffmpeg). Usados nas narrações com a voz clonada, no áudio do
vídeo editado e no `ev.py voz falar`. Os nomes são os mesmos do editor da galeria (EFEITOS_VOZ).

  cadeia("radio", tom=2, vel=1.1) → "rubberband=pitch=1.1225,atempo=1.1000,highpass=…"
"""
from pathlib import Path

from .comum import rodar

EFEITOS = {
    "nenhum": "",
    "podcast": "highpass=f=80,equalizer=f=180:t=q:w=1:g=2,equalizer=f=3200:t=q:w=1.2:g=3,deesser,acompressor=threshold=-18dB:ratio=3:attack=5:release=90:makeup=2",
    "radio": "highpass=f=300,lowpass=f=3400,acompressor=threshold=-20dB:ratio=4:makeup=3,asoftclip=type=tanh",
    "telefone": "highpass=f=450,lowpass=f=2800,acrusher=bits=10:mode=log:aa=1:mix=0.6,volume=1.6",
    "megafone": "highpass=f=700,lowpass=f=4200,volume=3,asoftclip=type=hard,acompressor=threshold=-24dB:ratio=8:makeup=2,alimiter=limit=0.9",
    "eco": "aecho=0.8:0.6:180|360:0.35|0.15",
    "sala": "aecho=0.85:0.55:40|70|110|160|230:0.28|0.22|0.16|0.11|0.07",
    "robo": "afftfilt=real='hypot(re,im)*cos(0)':imag='hypot(re,im)*sin(0)':win_size=512:overlap=0.75,volume=1.4",
    "sussurro": "highpass=f=900,afftfilt=real='hypot(re,im)*cos((random(0)*2-1)*3.14)':imag='hypot(re,im)*sin((random(1)*2-1)*3.14)':win_size=256:overlap=0.6,volume=2.2",
}
NOMES = {"nenhum": "Sem efeito", "podcast": "Podcast (encorpada)", "radio": "Rádio", "telefone": "Telefone", "megafone": "Megafone",
         "eco": "Eco", "sala": "Sala / auditório", "robo": "Robô", "sussurro": "Sussurro"}


def _atempo(v):
    out = []
    while v > 2.0:
        out.append("atempo=2.0"); v /= 2.0
    while v < 0.5:
        out.append("atempo=0.5"); v /= 0.5
    if abs(v - 1) > 1e-3:
        out.append(f"atempo={v:.4f}")
    return out


def cadeia(efeito="nenhum", tom=0, vel=1.0):
    """Filtro de áudio do ffmpeg para tom (semitons, mantém a duração), velocidade (mantém o tom) e efeito."""
    f = []
    if abs(tom) > 0.01:
        f.append(f"rubberband=pitch={2 ** (tom / 12):.4f}:formant=preserved")
    f += _atempo(vel or 1.0)
    if EFEITOS.get(efeito or "nenhum"):
        f.append(EFEITOS[efeito])
    return ",".join(f)


def aplicar(entrada, saida, efeito="nenhum", tom=0, vel=1.0):
    af = cadeia(efeito, tom, vel)
    rodar(["ffmpeg", "-y", "-v", "error", "-i", entrada] + (["-af", af] if af else []) + [saida])
    return Path(saida)
