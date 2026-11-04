"""Trilha sintetizada (sem direitos autorais) para ficar por baixo da pregação,
em três partes como trilha de louvor/cinema:

  introdução  piano em arpejo + pad suave
  crescendo   ruído subindo e glissando até a virada
  explosão    impacto + prato, cordas, baixo e pulso grave (bumbo) no 1 e no 3
  final       outro impacto, volta ao piano e pad, fade

Progressão vi–IV–I–V (Si menor – Sol – Ré – Lá em Ré), que soa mais emocionante.

    python3 musica.py <saida.wav> <duracao_s> <virada_s> <final_s> [tom=D] [bpm=72]
"""
import sys
import wave

import numpy as np

SR = 48000
NOTAS = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11}


def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


def acordes(tom):
    """vi, IV, I, V do tom maior, em MIDI (raiz na oitava 3)."""
    r = 48 + NOTAS[tom]
    maior, menor = [0, 4, 7], [0, 3, 7]
    return [[r + 9 + i - 12 for i in menor], [r + 5 + i for i in maior], [r + i for i in maior], [r + 7 + i - 12 for i in maior]]


def env(n, ataque, soltura):
    e = np.ones(n)
    a, s = min(int(ataque * SR), n // 2), min(int(soltura * SR), n // 2)
    if a:
        e[:a] = np.linspace(0, 1, a) ** 2
    if s:
        e[-s:] *= np.linspace(1, 0, s) ** 1.5
    return e


def somar(L, R, x, t0, pan=0.5, ganho=1.0):
    i = int(t0 * SR)
    if i >= len(L):
        return
    x = x[: len(L) - i] * ganho
    L[i:i + len(x)] += x * np.sqrt(1 - pan)
    R[i:i + len(x)] += x * np.sqrt(pan)


def rica(freq, n, harm=10, queda=1.7, vibrato=0.0, fase=0.0):
    t = np.arange(n) / SR
    f = freq * (1 + vibrato * np.sin(2 * np.pi * 5.2 * t + fase))
    ph = 2 * np.pi * np.cumsum(f) / SR
    return sum(np.sin(ph * h + fase * h) / h ** queda for h in range(1, harm + 1))


def piano(freq, dur=2.2):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * freq * t) + 0.45 * np.sin(4 * np.pi * freq * t) * np.exp(-t * 3) + 0.15 * np.sin(6 * np.pi * freq * t) * np.exp(-t * 5)
    return x * np.exp(-t * 1.8) * (1 - np.exp(-t * 400))


def bumbo():
    n = int(0.6 * SR)
    t = np.arange(n) / SR
    f = 45 + 90 * np.exp(-t * 28)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7)


def impacto(rng):
    n = int(4.0 * SR)
    t = np.arange(n) / SR
    sub = np.sin(2 * np.pi * np.cumsum(35 + 70 * np.exp(-t * 5)) / SR) * np.exp(-t * 1.3)
    prato = rng.standard_normal(n) * np.exp(-t * 1.6)
    prato = np.diff(prato, prepend=0)  # tira o grave (fica "chiado" de prato)
    return sub * 0.9 + prato * 0.18


def subida(dur, rng):
    n = int(dur * SR)
    t = np.arange(n) / SR
    k = (t / dur) ** 2.2
    ruido = np.diff(rng.standard_normal(n), prepend=0) * k * 0.25
    tom = np.sin(2 * np.pi * np.cumsum(200 + 900 * k) / SR) * k * 0.08
    return ruido + tom


def reverb(x, seg=3.0, semente=1):
    rng = np.random.default_rng(semente)
    n = int(seg * SR)
    ir = rng.standard_normal(n) * np.exp(-np.arange(n) / SR * (6.9 / seg))
    ir[: int(0.015 * SR)] = 0
    ir /= np.sqrt(np.sum(ir ** 2))
    tam = 1 << int(np.ceil(np.log2(len(x) + n)))
    return np.fft.irfft(np.fft.rfft(x, tam) * np.fft.rfft(ir, tam), tam)[: len(x)]


def gerar(dur, virada, final, tom="D", bpm=72):
    total = int(dur * SR)
    L, R = np.zeros(total), np.zeros(total)
    rng = np.random.default_rng(3)
    ac = acordes(tom)
    batida = 60 / bpm
    compasso = 4 * batida

    def parte(t):
        return "intro" if t < virada else ("explosao" if t < final else "fim")

    # Pad (sempre) e cordas (só na explosão), um acorde por compasso.
    t0, i = 0.0, 0
    while t0 < dur - 0.2:
        notas = ac[i % 4]
        d = min(compasso + 1.8, dur - t0)
        n = int(d * SR)
        e = env(n, 1.0, 1.8)
        for j, m in enumerate(notas + [notas[0] + 12]):
            somar(L, R, rica(hz(m), n, harm=8, queda=2.0, fase=j) * e, t0, 0.3 + 0.13 * j, 0.10)
        if parte(t0) == "explosao" or parte(t0 + compasso) == "explosao":
            ini = max(t0, virada)
            fim = min(t0 + d, final + 1.5)
            if fim > ini:
                nn = int((fim - ini) * SR)
                ee = env(nn, 0.9, 1.4)
                for j, m in enumerate([notas[1] + 12, notas[2] + 12, notas[0] + 24, notas[1] + 24]):
                    somar(L, R, rica(hz(m), nn, harm=12, queda=1.25, vibrato=0.004, fase=j * 1.3) * ee, ini, 0.2 + 0.2 * j, 0.1)
                # Baixo.
                somar(L, R, np.sin(2 * np.pi * hz(notas[0] - 12) * np.arange(nn) / SR) * ee, ini, 0.5, 0.34)
        i += 1
        t0 += compasso

    # Piano em arpejo de colcheias (mais forte na introdução e no fim).
    padrao = [0, 2, 3, 1, 2, 3, 1, 2]
    t0, k = 0.15, 0
    while t0 < dur - 1.2:
        notas = ac[int(t0 // compasso) % 4]
        escala = [notas[0] + 12, notas[1] + 12, notas[2] + 12, notas[0] + 24]
        m = escala[padrao[k % 8]]
        g = 0.07 if parte(t0) != "explosao" else 0.045
        if k % 8 == 0:
            g *= 1.35
        somar(L, R, piano(hz(m)), t0, 0.35 + 0.3 * rng.random(), g)
        k += 1
        t0 += batida / 2

    # Pulso grave no 1 e no 3 durante a explosão.
    t0 = virada
    while t0 < final - 0.1:
        somar(L, R, bumbo(), t0, 0.5, 0.42)
        t0 += batida * 2

    # Crescendo até a virada e impactos na virada e no final.
    for alvo in (virada, final):
        d = 2.2
        somar(L, R, subida(d, rng), max(0, alvo - d), 0.5, 1.0)
        somar(L, R, impacto(rng), alvo, 0.5, 0.75)

    L = L * 0.7 + reverb(L, semente=1) * 0.5
    R = R * 0.7 + reverb(R, semente=2) * 0.5
    fade = np.ones(total)
    fi, fo = int(0.6 * SR), int(2.2 * SR)
    fade[:fi] = np.linspace(0, 1, fi)
    fade[-fo:] = np.linspace(1, 0, fo) ** 2
    L, R = L * fade, R * fade
    pico = max(np.abs(L).max(), np.abs(R).max(), 1e-9)
    return np.stack([L, R], axis=1) / pico * 0.85


def main():
    saida, dur, virada, final = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), float(sys.argv[4])
    tom = sys.argv[5] if len(sys.argv) > 5 else "D"
    bpm = float(sys.argv[6]) if len(sys.argv) > 6 else 72
    x = gerar(dur, virada, final, tom, bpm)
    with wave.open(saida, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype("<i2").tobytes())


if __name__ == "__main__":
    main()
