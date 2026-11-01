"""Som escrito em código: efeitos sintetizados (sem amostras, sem licença) e colocados
no quadro exato dos eventos da animação. Ideia do claude-motion (MIT), código próprio.

Geradores: whoosh (ar), pop (chegada), clique, impacto, subida (riser) e cama (pad).
Regra: poucos efeitos, cada um ligado a algo que aparece na tela.
"""
import wave
from pathlib import Path

import numpy as np

SR = 48000


def _env(n, ataque, queda):
    t = np.arange(n) / SR
    a = np.clip(t / max(ataque, 1e-4), 0, 1)
    return a * np.exp(-np.maximum(t - ataque, 0) / max(queda, 1e-4))


def _banda(x, f_lo, f_hi):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X[(f < f_lo) | (f > f_hi)] = 0
    return np.fft.irfft(X, len(x))


def whoosh(dur=0.45, f0=400, f1=3200, rng=None):
    rng = rng or np.random.default_rng(1)
    n = int(dur * SR)
    ruido = rng.standard_normal(n)
    partes, passos = [], 12
    for i in range(passos):   # varre a banda ao longo do tempo
        seg = ruido[i * n // passos:(i + 1) * n // passos]
        fc = f0 * (f1 / f0) ** (i / (passos - 1))
        partes.append(_banda(seg, fc * 0.6, fc * 1.6))
    y = np.concatenate(partes)
    t = np.linspace(0, 1, len(y))
    y *= np.sin(np.pi * t) ** 1.5
    return y / (np.abs(y).max() + 1e-9)


def pop(freq=900, dur=0.12):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = freq * (1 + 0.6 * np.exp(-t / 0.012))
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * _env(n, 0.002, 0.035)
    return y / (np.abs(y).max() + 1e-9)


def clique(dur=0.03, rng=None):
    rng = rng or np.random.default_rng(2)
    n = int(dur * SR)
    y = _banda(rng.standard_normal(n), 2000, 9000) * _env(n, 0.0005, 0.006)
    return y / (np.abs(y).max() + 1e-9)


def impacto(dur=0.7, rng=None):
    rng = rng or np.random.default_rng(3)
    n = int(dur * SR)
    t = np.arange(n) / SR
    grave = np.sin(2 * np.pi * (55 + 40 * np.exp(-t / 0.05)) * t) * _env(n, 0.003, 0.22)
    estalo = _banda(rng.standard_normal(n), 200, 4000) * _env(n, 0.001, 0.04)
    y = grave + 0.5 * estalo
    return y / (np.abs(y).max() + 1e-9)


def subida(dur=1.2, rng=None):
    rng = rng or np.random.default_rng(4)
    n = int(dur * SR)
    t = np.arange(n) / SR
    tom = np.sin(2 * np.pi * np.cumsum(200 + 900 * (t / dur) ** 2) / SR)
    ar = _banda(rng.standard_normal(n), 1500, 8000)
    y = (0.5 * tom + 0.3 * ar / (np.abs(ar).max() + 1e-9)) * (t / dur) ** 2
    return y / (np.abs(y).max() + 1e-9)


def cama(dur, tom=220.0):
    """Pad suave (acorde aberto) que segura o loudness entre os efeitos."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = sum(np.sin(2 * np.pi * tom * r * t + k) for k, r in enumerate((1, 1.5, 2, 3)))
    y *= 0.6 + 0.4 * np.sin(2 * np.pi * 0.15 * t)
    fade = np.minimum(1, np.minimum(t / 1.0, (dur - t) / 1.2))
    y = y * np.clip(fade, 0, 1)
    return y / (np.abs(y).max() + 1e-9)


class Mix:
    def __init__(self, dur):
        self.L = np.zeros(int((dur + 1) * SR))
        self.R = np.zeros_like(self.L)

    def put(self, t, y, ganho=0.3, pan=0.0):
        i = int(max(t, 0) * SR)
        y = y[: max(0, len(self.L) - i)]
        self.L[i:i + len(y)] += y * ganho * (1 - max(pan, 0))
        self.R[i:i + len(y)] += y * ganho * (1 + min(pan, 0))

    def salvar(self, caminho):
        st = np.stack([self.L, self.R], 1)
        st = np.tanh(st * 1.2) / np.tanh(1.2)
        st = (st / (np.abs(st).max() + 1e-9) * 0.89 * 32767).astype(np.int16)
        with wave.open(str(caminho), "wb") as w:
            w.setnchannels(2)
            w.setsampwidth(2)
            w.setframerate(SR)
            w.writeframes(st.tobytes())


def trilha_motion(p, caminho, volume=1.0):
    """Efeitos nos eventos da agenda do motion: whoosh no recuo/arranque, pop no pouso."""
    fps = p["fps"]
    m = Mix(p["total"] / fps)
    m.put(0, cama(p["total"] / fps), 0.10 * volume)
    for i, c in enumerate(p["cenas"]):
        C = c["controles"]
        a, d = C["antecipacao"]["frames"], C["easing"]["duracao_entrada"]
        ft = C["followthrough"]["atraso_cauda"]
        n = len(c.get("palavras", [])) if c["tipo"] == "sequencia" else 1
        cada = c["duracao"] / n
        for k in range(n):
            t0 = (c["inicio"] + k * cada) / fps
            pan = -0.3 + 0.6 * ((i + k) % 3) / 2
            m.put(t0 + a / fps - 0.12, whoosh(0.4, 500, 2800, np.random.default_rng(i * 10 + k)), 0.32 * volume, pan)
            m.put(t0 + (a + d * 0.35 + ft) / fps, pop(700 + 120 * ((i + k) % 4)), 0.22 * volume, pan)
        if c["tipo"] == "cta":
            m.put((c["inicio"] + 6 + a) / fps, impacto(), 0.35 * volume)
        if c["tipo"] == "numero":
            for q in range(a, a + d * 2, 3):
                m.put((c["inicio"] + q) / fps, clique(), 0.08 * volume)
    m.salvar(caminho)
    return Path(caminho)
