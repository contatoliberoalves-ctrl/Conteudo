"""Trilha sintetizada (sem direitos autorais) para ficar por baixo da pregação,
no estilo trailer épico:

  introdução  piano em arpejo + pad; coro entra nos 2 compassos antes da virada
  crescendo   ruído subindo e glissando até a virada
  explosão    BRAAAM de metais + impacto; cordas longas e ostinato em semicolcheias,
              coro, taikos, bumbo em todo tempo, palmas no 2 e no 4; a segunda
              metade ganha chimbal e cordas mais agudas; virada de tambores no fim
  final       outro BRAAAM + impacto, volta ao piano e pad, fade

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


def passa_baixa(x, corte):
    """Filtro de 1 polo (suaviza ruído para tambor/palma)."""
    a = np.exp(-2 * np.pi * corte / SR)
    y = np.empty_like(x)
    acc = 0.0
    for k in range(len(x)):
        acc = (1 - a) * x[k] + a * acc
        y[k] = acc
    return y


def taiko(rng, grave=1.0):
    n = int(1.2 * SR)
    t = np.arange(n) / SR
    corpo = np.sin(2 * np.pi * np.cumsum((58 + 60 * np.exp(-t * 18)) * grave) / SR) * np.exp(-t * 4.5)
    pele = passa_baixa(rng.standard_normal(int(0.08 * SR)), 900) * 2.5
    corpo[: len(pele)] += pele * np.exp(-np.arange(len(pele)) / SR * 40)
    return corpo


def palma(rng):
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    r = rng.standard_normal(n)
    r = r - passa_baixa(r, 900)  # tira o grave
    env_ = np.zeros(n)
    for d in (0, 0.012, 0.024):
        i = int(d * SR)
        env_[i:] += np.exp(-(t[: n - i]) * 28)
    return r * env_ * 0.6


def chimbal(rng):
    n = int(0.09 * SR)
    r = np.diff(np.diff(rng.standard_normal(n + 2)))
    return r * np.exp(-np.arange(n) / SR * 60) * 0.25


def braaam(notas, dur=3.4):
    """Metais graves com o filtro abrindo: o 'BRAAAM' de trailer."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    abre = np.clip(t / 0.5, 0, 1)
    x = np.zeros(n)
    for m in (notas[0] - 24, notas[0] - 12, notas[2] - 12):
        f = hz(m)
        for h in range(1, 28):
            peso = np.clip(abre * 26 - h, 0, 1) * (1 / h ** 0.9)
            x += np.sin(2 * np.pi * f * h * t + h) * peso
    return x * np.exp(-t * 0.9) * (1 - np.exp(-t * 30)) / 12


def coro(freq, n, fase=0.0):
    """'Ahh' de coro: harmônicos pesados por formantes da vogal A."""
    t = np.arange(n) / SR
    f = freq * (1 + 0.006 * np.sin(2 * np.pi * 5.0 * t + fase))
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.zeros(n)
    for h in range(1, 40):
        fh = freq * h
        if fh > 5000:
            break
        peso = sum(a * np.exp(-((fh - F) / bw) ** 2) for F, bw, a in ((750, 130, 1.0), (1200, 160, 0.55), (2600, 260, 0.25)))
        x += np.sin(ph * h + fase * h) * peso
    return x


def gerar(dur, virada, final, tom="D", bpm=72):
    total = int(dur * SR)
    L, R = np.zeros(total), np.zeros(total)
    rng = np.random.default_rng(3)
    ac = acordes(tom)
    batida = 60 / bpm
    compasso = 4 * batida
    meio = virada + (final - virada) * 0.5  # a segunda metade cresce ainda mais

    def acorde(t):
        return ac[int(t // compasso) % 4]

    # Pad (sempre), um acorde por compasso.
    t0 = 0.0
    while t0 < dur - 0.2:
        notas = acorde(t0 + 0.01)
        d = min(compasso + 1.8, dur - t0)
        n = int(d * SR)
        e = env(n, 1.0, 1.8)
        for j, m in enumerate(notas + [notas[0] + 12]):
            somar(L, R, rica(hz(m), n, harm=8, queda=2.0, fase=j) * e, t0, 0.3 + 0.13 * j, 0.09)
        # Coro entra nos 2 compassos antes da virada e fica na explosão.
        if virada - 2 * compasso <= t0 < final + 0.5:
            forte = 1.0 if t0 >= virada else 0.5
            for j, m in enumerate([notas[0] + 12, notas[1] + 12, notas[2] + 12]):
                somar(L, R, coro(hz(m), n, fase=j * 2.1) * e, t0, 0.25 + 0.25 * j, 0.05 * forte)
        # Cordas longas, baixo e ostinato só na explosão.
        if virada - 0.01 <= t0 < final:
            fim = min(t0 + d, final + 1.2)
            nn = int((fim - t0) * SR)
            ee = env(nn, 0.25, 1.2)
            topo = [notas[1] + 12, notas[2] + 12, notas[0] + 24, notas[1] + 24] + ([notas[2] + 24, notas[0] + 36] if t0 >= meio else [])
            for j, m in enumerate(topo):
                somar(L, R, rica(hz(m), nn, harm=12, queda=1.2, vibrato=0.005, fase=j * 1.3) * ee, t0, 0.15 + 0.14 * j, 0.085)
            somar(L, R, rica(hz(notas[0] - 12), nn, harm=4, queda=1.5) * ee, t0, 0.5, 0.3)
        t0 += compasso

    # Ostinato de cordas em semicolcheias (empurra o ritmo) na explosão.
    padrao = [0, 2, 3, 2, 0, 2, 3, 2, 1, 2, 3, 2, 1, 2, 3, 2]
    t0, k = virada, 0
    while t0 < final - 0.05:
        notas = acorde(t0 + 0.01)
        escala = [notas[0], notas[1], notas[2], notas[0] + 12]
        m = escala[padrao[k % 16]] + 12
        n = int(0.2 * SR)
        nota = rica(hz(m), n, harm=10, queda=1.3) * env(n, 0.005, 0.15)
        acento = 1.4 if k % 4 == 0 else 1.0
        somar(L, R, nota, t0, 0.3 if k % 2 else 0.7, 0.07 * acento * (1.2 if t0 >= meio else 1))
        k += 1
        t0 += batida / 4

    # Piano em arpejo de colcheias: na introdução e no fim.
    padrao_p = [0, 2, 3, 1, 2, 3, 1, 2]
    t0, k = 0.15, 0
    while t0 < dur - 1.2:
        if not (virada <= t0 < final):
            notas = acorde(t0)
            escala = [notas[0] + 12, notas[1] + 12, notas[2] + 12, notas[0] + 24]
            g = 0.08 * (1.35 if k % 8 == 0 else 1)
            somar(L, R, piano(hz(escala[padrao_p[k % 8]])), t0, 0.35 + 0.3 * rng.random(), g)
        k += 1
        t0 += batida / 2

    # Percussão de trailer na explosão: taikos, bumbo em todo tempo, palmas no 2 e no 4,
    # chimbal em semicolcheias na segunda metade e virada de tambores antes do fim.
    t0 = virada
    while t0 < final - 0.05:
        b = round((t0 - virada) / batida)
        somar(L, R, bumbo(), t0, 0.5, 0.5)
        if b % 2 == 1:
            somar(L, R, palma(rng), t0, 0.5, 0.55)
        pos = b % 4
        if pos in (0, 2):
            somar(L, R, taiko(rng), t0, 0.4 + 0.2 * rng.random(), 0.55)
        if pos == 3:
            somar(L, R, taiko(rng, 1.3), t0 + batida / 2, 0.65, 0.35)
        if t0 >= meio:
            for q in range(4):
                somar(L, R, chimbal(rng), t0 + q * batida / 4, 0.7, 0.9 if q % 2 == 0 else 0.5)
        t0 += batida
    t0 = final - compasso / 2  # virada de tambores
    for q in range(8):
        somar(L, R, taiko(rng, 1.0 + q * 0.08), t0 + q * batida / 4, 0.3 + q * 0.05, 0.3 + q * 0.06)

    # Crescendo até a virada, BRAAAM e impacto na virada e no final.
    for alvo in (virada, final):
        d = 2.6
        somar(L, R, subida(d, rng), max(0, alvo - d), 0.5, 1.4)
        somar(L, R, impacto(rng), alvo, 0.5, 1.0)
        somar(L, R, braaam(acorde(alvo + 0.01)), alvo, 0.5, 0.9)

    L = L * 0.72 + reverb(L, semente=1) * 0.45
    R = R * 0.72 + reverb(R, semente=2) * 0.45
    fade = np.ones(total)
    fi, fo = int(0.4 * SR), int(2.2 * SR)
    fade[:fi] = np.linspace(0, 1, fi)
    fade[-fo:] = np.linspace(1, 0, fo) ** 2
    x = np.stack([L * fade, R * fade], axis=1)
    # Volume por RMS da explosão + saturação suave (mais "pancada" sem estourar).
    a, b = int(virada * SR), int(final * SR)
    rms = np.sqrt(np.mean(x[a:b] ** 2)) + 1e-9
    x = x / rms * 0.22
    return np.tanh(x * 1.6) / np.tanh(1.6) * 0.95


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
