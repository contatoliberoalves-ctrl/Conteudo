#!/usr/bin/env python3
"""Trilha sintetizada (sem amostras de terceiros) para os vídeos do Direito Aleatório.
Base "travessa" de marimba e baixo em 112 BPM, bem baixa para ficar por baixo da voz, mais os efeitos
sincronizados com o vídeo: sopro em cada troca de cena, "pop" quando o personagem entra e batida nos números.

Uso: python3 trilha.py eventos.json saida.wav
eventos.json: {"dur": segundos, "corte": [t...], "pop": [t...], "batida": [t...]}
"""
import json, sys, wave
import numpy as np

SR = 44100
BEAT = 60 / 112
rng = np.random.default_rng(11)
ev = json.load(open(sys.argv[1]))
N = int((ev['dur'] + 1) * SR)
mix = np.zeros(N)


def poe(x, t, g=1.0):
    i = int(t * SR)
    if i >= N or i < 0: return
    x = x[:N - i]
    mix[i:i + len(x)] += x * g


def nota(f, dur=.35, d=.09):
    t = np.arange(int(dur * SR)) / SR
    return (np.sin(2 * np.pi * f * t) + .35 * np.sin(2 * np.pi * 4 * f * t) * np.exp(-t / .03)) * np.exp(-t / d) * np.minimum(1, t / .003)


def baixo(f, dur=.3):
    t = np.arange(int(dur * SR)) / SR
    return np.tanh(2 * np.sin(2 * np.pi * f * t)) * np.exp(-t / .16) * np.minimum(1, t / .005)


def suave(x, n):
    return np.convolve(x, np.ones(n) / n, mode='same')


def sopro():
    n = int(.26 * SR); t = np.arange(n) / n
    return suave(rng.standard_normal(n), 30) * np.sin(np.pi * t) ** 2 * 4


def pop():
    n = int(.11 * SR); t = np.arange(n) / SR
    f = 320 + 900 * (t / t[-1])
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .04)


def batida():
    n = int(.4 * SR); t = np.arange(n) / SR
    f = 50 + 110 * np.exp(-t * 30)
    return np.tanh(1.8 * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .16))


# Lá menor "na ponta do pé": frase de 2 compassos em colcheias (0 = pausa) e baixo nos tempos 1 e 3.
A = 220.0
st = lambda s: A * 2 ** (s / 12)
FRASE = [0, 12, 0, 7, 3, 0, 7, 0, 0, 10, 0, 7, 2, 0, 5, 0,
         0, 12, 0, 8, 3, 0, 8, 0, 0, 7, 0, 5, 3, 2, 0, -2]
BAIXO = [-24, -24, -24, -17, -28, -28, -29, -29]
t, i = 0.0, 0
while t < ev['dur']:
    s = FRASE[i % len(FRASE)]
    if s or i % len(FRASE) == 0: poe(nota(st(s)), t + (BEAT / 2) * .08 * (i % 2), .16)
    if i % 4 == 0: poe(baixo(st(BAIXO[(i // 4) % len(BAIXO)])), t, .2)
    if i % 2 == 1: poe(suave(rng.standard_normal(int(.03 * SR)), 3) * np.exp(-np.arange(int(.03 * SR)) / (SR * .008)), t, .05)
    t += BEAT / 2; i += 1

for x in ev.get('corte', []): poe(sopro(), x - .1, .22)
for x in ev.get('pop', []): poe(pop(), x, .3)
for x in ev.get('batida', []): poe(batida(), x, .38)

# entra e sai suave
f = int(.4 * SR); mix[:f] *= np.linspace(0, 1, f); mix[-SR:] *= np.linspace(1, 0, SR)
mix = np.tanh(mix * 1.2) * .7
with wave.open(sys.argv[2], 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())
