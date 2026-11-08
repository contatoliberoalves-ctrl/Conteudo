#!/usr/bin/env python3
"""Trilha sintetizada (sem voz e sem amostras de terceiros) para os vídeos da PratFlix.
Batida em 100 BPM com kick, palmas, chimbal, baixo e acordes (Lá menor, Fá, Dó, Sol), introdução só com
acordes e subida, e efeitos sincronizados com o vídeo: whoosh nas trocas de cena, tick nos itens e impacto
nos títulos.

Uso: python3 trilha.py eventos.json saida.wav
eventos.json: {"dur": segundos, "whoosh": [t...], "tick": [t...], "impacto": [t...]}
"""
import json, sys
import numpy as np
from scipy.signal import butter, sosfilt

SR = 44100
BPM = 100
BEAT = 60 / BPM
rng = np.random.default_rng(7)


def env(n, a=0.005, d=0.2):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)
    return e


def filt(x, kind, f, order=4):
    sos = butter(order, f, btype=kind, fs=SR, output='sos')
    return sosfilt(sos, x)


def kick():
    n = int(0.45 * SR); t = np.arange(n) / SR
    f = 45 + 95 * np.exp(-t * 28)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.22)
    click = filt(rng.standard_normal(n), 'highpass', 2000) * np.exp(-t / 0.004) * 0.3
    return np.tanh((x + click) * 1.6)


def clap():
    n = int(0.25 * SR); t = np.arange(n) / SR
    noise = filt(rng.standard_normal(n), 'bandpass', [900, 4000])
    e = np.zeros(n)
    for o in (0, 0.012, 0.024):
        e += np.where(t >= o, np.exp(-(t - o) / 0.03), 0)
    body = np.sin(2 * np.pi * 190 * t) * np.exp(-t / 0.05) * 0.4
    return (noise * e * 0.5 + body) * 0.8


def hat(open_=False):
    n = int((0.18 if open_ else 0.05) * SR); t = np.arange(n) / SR
    x = filt(rng.standard_normal(n), 'highpass', 7000)
    return x * np.exp(-t / (0.06 if open_ else 0.012)) * 0.35


def nota(freq, dur, harm=(1, .5, .3, .18), a=0.35, rel=0.6):
    n = int(dur * SR); t = np.arange(n) / SR
    x = sum(h * np.sin(2 * np.pi * freq * (k + 1) * t + rng.random()) for k, h in enumerate(harm))
    e = np.minimum(1, t / a) * np.minimum(1, (dur - t) / rel).clip(0, 1)
    return x * e


def baixo(freq, dur):
    n = int(dur * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * freq * t) + 0.25 * np.sin(2 * np.pi * freq * 2 * t)
    return np.tanh(1.8 * x * np.exp(-t / 0.35)) * 0.55


def whoosh():
    n = int(0.7 * SR); t = np.arange(n) / SR
    x = rng.standard_normal(n)
    # varredura do filtro: ruído passa-faixa subindo e descendo
    out = np.zeros(n); seg = 512
    for i in range(0, n, seg):
        p = i / n
        fc = 300 + 5000 * np.sin(np.pi * p) ** 2
        sos = butter(2, [max(80, fc * 0.6), min(18000, fc * 1.6)], btype='bandpass', fs=SR, output='sos')
        out[i:i + seg] = sosfilt(sos, x[i:i + seg])
    return out * np.sin(np.pi * t / t[-1]) ** 2 * 0.5


def tick():
    n = int(0.12 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 1320 * t) + 0.5 * np.sin(2 * np.pi * 1980 * t)) * np.exp(-t / 0.025) * 0.35


def impacto():
    n = int(1.4 * SR); t = np.arange(n) / SR
    boom = np.sin(2 * np.pi * (38 + 40 * np.exp(-t * 6)) * t) * np.exp(-t / 0.55)
    ar = filt(rng.standard_normal(n), 'lowpass', 1200) * np.exp(-t / 0.25) * 0.4
    return np.tanh((boom + ar) * 1.4) * 0.9


def subida(dur):
    n = int(dur * SR); t = np.arange(n) / SR
    x = filt(rng.standard_normal(n), 'highpass', 1500) * (t / dur) ** 2 * 0.25
    tom = np.sin(2 * np.pi * (200 + 600 * (t / dur) ** 2) * t) * (t / dur) ** 3 * 0.12
    return x + tom


def por(buf, x, t, g=1.0):
    i = int(t * SR)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(x))
    buf[i:j] += x[:j - i] * g


def trilha(ev):
    dur = ev['dur']
    n = int((dur + 1) * SR)
    batida = np.zeros(n); harm = np.zeros(n); fx = np.zeros(n)
    acordes = [(220.0, [220.0, 261.63, 329.63]), (174.61, [174.61, 220.0, 261.63]),
               (130.81, [261.63, 329.63, 392.0]), (196.0, [196.0, 246.94, 293.66])]
    compasso = 4 * BEAT
    n_comp = int(np.ceil(dur / compasso))
    intro = 2  # compassos só com acordes
    k, c, ho, ho2 = kick(), clap(), hat(), hat(True)
    for b in range(n_comp):
        t0 = b * compasso
        raiz, notas = acordes[b % 4]
        for f in notas:
            por(harm, nota(f, compasso + 0.3), t0, 0.11)
        if b == intro - 1:
            por(fx, subida(compasso), t0, 1.0)
        fim = b >= n_comp - 2
        if b < intro or fim:
            continue
        for beat in range(4):
            tb = t0 + beat * BEAT
            if beat in (0, 2):
                por(batida, k, tb, 0.9)
            if beat == 2 and b % 2 == 1:
                por(batida, k, tb + BEAT * 0.75, 0.6)
            if beat in (1, 3):
                por(batida, c, tb, 0.55)
            for meio in (0, 0.5):
                por(batida, ho2 if (beat == 3 and meio) else ho, tb + meio * BEAT, 0.5 if meio else 0.3)
        for i, off in enumerate((0, 0.75, 1.5, 2.5, 3.0)):
            por(harm, baixo(raiz / 2, BEAT * 0.7), t0 + off * BEAT, 0.9 if i == 0 else 0.6)
    for t in ev.get('whoosh', []):
        por(fx, whoosh(), max(0, t - 0.35), 0.8)
    for t in ev.get('tick', []):
        por(fx, tick(), t, 0.7)
    for t in ev.get('impacto', []):
        por(fx, impacto(), t, 0.8)
    harm = filt(harm, 'lowpass', 3200, 2)
    mix = batida * 0.8 + harm * 0.9 + fx
    # fade de entrada e saída
    tt = np.arange(n) / SR
    mix *= np.clip(tt / 0.8, 0, 1) * np.clip((dur - tt) / 2.0, 0, 1)
    mix = np.tanh(mix * 1.1)
    mix = mix[:int(dur * SR)]
    st = np.stack([mix, np.roll(mix, 220) * 0.98], axis=1)  # leve largura estéreo
    return (st / (np.abs(st).max() + 1e-9) * 0.9 * 32767).astype(np.int16)


if __name__ == '__main__':
    ev = json.load(open(sys.argv[1]))
    from scipy.io import wavfile
    wavfile.write(sys.argv[2], SR, trilha(ev))
    print('✓ trilha', sys.argv[2], f"{ev['dur']:.1f}s")
