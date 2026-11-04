"""Fundo musical sintetizado (sem direitos autorais): pad de louvor para ficar
por baixo da pregação. Acordes longos I–V–vi–IV, baixo suave, brilho agudo,
notas de piano esparsas e reverb longo.

    python3 musica.py <saida.wav> <duracao_s> [tom=D] [bpm=70]
"""
import sys
import wave

import numpy as np

SR = 48000
NOTAS = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11}


def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


def tom_para_acordes(tom):
    """I, V/7, vi, IV do tom maior, em MIDI (raiz na oitava 3)."""
    r = 48 + NOTAS[tom]
    tri_maior = [0, 4, 7]
    tri_menor = [0, 3, 7]
    return [
        [r + i for i in tri_maior],          # I
        [r + 7 + i for i in tri_maior],      # V
        [r + 9 + i for i in tri_menor],      # vi
        [r + 5 + i for i in tri_maior],      # IV
    ]


def envelope(n, ataque, soltura):
    e = np.ones(n)
    a, s = min(int(ataque * SR), n // 2), min(int(soltura * SR), n // 2)
    e[:a] = np.linspace(0, 1, a) ** 2
    e[-s:] *= np.linspace(1, 0, s) ** 1.5
    return e


def pad(freq, dur, detune=(-6, 0, 6), harm=10, inclinacao=1.7, fase=0.0):
    """Onda rica (soma de harmônicos com queda) com 3 vozes desafinadas: calor sem aspereza."""
    t = np.arange(int(dur * SR)) / SR
    l = np.zeros_like(t)
    r = np.zeros_like(t)
    for k, cents in enumerate(detune):
        f = freq * 2 ** (cents / 1200)
        onda = np.zeros_like(t)
        for h in range(1, harm + 1):
            onda += np.sin(2 * np.pi * f * h * t + fase * h + k) / h ** inclinacao
        pan = 0.5 + (k - 1) * 0.35
        l += onda * (1 - pan)
        r += onda * pan
    return l, r


def reverb(sinal, segundos=3.2, semente=1):
    """Convolução com ruído de decaimento exponencial (sala grande)."""
    rng = np.random.default_rng(semente)
    n = int(segundos * SR)
    ir = rng.standard_normal(n) * np.exp(-np.arange(n) / SR * (6.9 / segundos))
    ir[: int(0.012 * SR)] = 0  # pré-atraso
    ir /= np.sqrt(np.sum(ir ** 2))
    tam = 1 << int(np.ceil(np.log2(len(sinal) + n)))
    y = np.fft.irfft(np.fft.rfft(sinal, tam) * np.fft.rfft(ir, tam), tam)[: len(sinal)]
    return y


def gerar(dur, tom="D", bpm=70):
    total = int(dur * SR)
    L = np.zeros(total)
    R = np.zeros(total)
    compasso = 4 * 60 / bpm
    acordes = tom_para_acordes(tom)

    # Pad: cada acorde dura um compasso e sobrepõe 1,6 s com o próximo.
    i, t0 = 0, 0.0
    while t0 < dur:
        notas = acordes[i % 4]
        d = min(compasso + 1.6, dur - t0)
        if d < 0.2:
            break
        n = int(d * SR)
        ini = int(t0 * SR)
        env = envelope(n, 1.3, 1.6)
        for j, m in enumerate(notas + [notas[0] + 12]):
            l, r = pad(hz(m), d, fase=j * 0.7)
            L[ini:ini + n] += l * env * 0.16
            R[ini:ini + n] += r * env * 0.16
        # Baixo: raiz uma oitava abaixo, senoidal.
        tb = np.arange(n) / SR
        baixo = np.sin(2 * np.pi * hz(notas[0] - 12) * tb) * env * 0.22
        L[ini:ini + n] += baixo
        R[ini:ini + n] += baixo
        # Brilho: terça e quinta duas oitavas acima, com tremolo lento.
        for m, p in ((notas[1] + 24, 0.3), (notas[2] + 24, 0.7)):
            br = np.sin(2 * np.pi * hz(m) * tb) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.25 * tb + p * 6)) * env * 0.035
            L[ini:ini + n] += br * (1 - p)
            R[ini:ini + n] += br * p
        i += 1
        t0 += compasso

    # Piano esparso: uma nota do acorde a cada tempo, oitava 5, decaimento rápido.
    batida = 60 / bpm
    k = 0
    rng = np.random.default_rng(7)
    t0 = compasso  # entra depois do primeiro compasso
    while t0 < dur - 1:
        notas = acordes[int(t0 // compasso) % 4]
        m = notas[[0, 2, 1, 2][k % 4]] + 24
        n = int(min(2.5, dur - t0) * SR)
        tt = np.arange(n) / SR
        nota = (np.sin(2 * np.pi * hz(m) * tt) + 0.35 * np.sin(4 * np.pi * hz(m) * tt) + 0.1 * np.sin(6 * np.pi * hz(m) * tt))
        nota *= np.exp(-tt * 2.2) * (1 - np.exp(-tt * 300)) * (0.055 + rng.random() * 0.02)
        ini = int(t0 * SR)
        pan = 0.35 + 0.3 * rng.random()
        L[ini:ini + n] += nota * (1 - pan)
        R[ini:ini + n] += nota * pan
        k += 1
        t0 += batida

    # Reverb e fades.
    L = L * 0.65 + reverb(L, semente=1) * 0.55
    R = R * 0.65 + reverb(R, semente=2) * 0.55
    fade = np.ones(total)
    fi, fo = int(2.5 * SR), int(2.5 * SR)
    fade[:fi] = np.linspace(0, 1, fi) ** 2
    fade[-fo:] = np.linspace(1, 0, fo) ** 2
    L *= fade
    R *= fade
    pico = max(np.abs(L).max(), np.abs(R).max(), 1e-9)
    return np.stack([L, R], axis=1) / pico * 0.8


def main():
    saida, dur = sys.argv[1], float(sys.argv[2])
    tom = sys.argv[3] if len(sys.argv) > 3 else "D"
    bpm = float(sys.argv[4]) if len(sys.argv) > 4 else 70
    x = gerar(dur, tom, bpm)
    pcm = (np.clip(x, -1, 1) * 32767).astype("<i2")
    with wave.open(saida, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


if __name__ == "__main__":
    main()
