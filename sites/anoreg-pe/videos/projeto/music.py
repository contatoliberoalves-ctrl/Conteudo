"""Trilha instrumental original (sintetizada): 100 BPM, Ré maior, 25 compassos = 60 s.
Gera public/music.wav (estéreo, 48 kHz)."""
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
import wave, sys

SR = 48000
BPM = 100
BEAT = 60 / BPM            # 0.6 s
BAR = 4 * BEAT             # 2.4 s
BARS = 25
DUR = BARS * BAR + 0.0
N = int(DUR * SR)
rng = np.random.default_rng(7)

L = np.zeros(N); R = np.zeros(N)
busses = {k: (np.zeros(N), np.zeros(N)) for k in ['pad', 'keys', 'bass', 'drums', 'fx']}

def hz(m): return 440 * 2 ** ((m - 69) / 12)

def add(bus, sig, t, pan=0.0, gain=1.0):
    i = int(t * SR)
    if i >= N: return
    sig = sig[: N - i] * gain
    l, r = busses[bus]
    l[i:i + len(sig)] += sig * np.sqrt((1 - pan) / 2)
    r[i:i + len(sig)] += sig * np.sqrt((1 + pan) / 2)

def env_adsr(n, a, d, s, rel):
    t = np.arange(n) / SR
    e = np.ones(n) * s
    na = int(a * SR); nd = int(d * SR); nr = int(rel * SR)
    e[:na] = np.linspace(0, 1, na) ** 1.5 if na else e[:na]
    if nd: e[na:na + nd] = np.linspace(1, s, len(e[na:na + nd]))
    if nr: e[-nr:] *= np.linspace(1, 0, nr) ** 2
    return e

# Acordes (MIDI), um por compasso: D maj9, Bm9, G maj7(#11 suave), A sus -> A
CH = [
    [50, 57, 61, 64, 66],   # D A C# E F#
    [47, 54, 57, 61, 62],   # B F# A C# D
    [43, 50, 54, 57, 59],   # G D F# A B
    [45, 52, 57, 59, 61],   # A E A B C#
]
ROOT = [38, 35, 31, 33]

def chord(b): return CH[b % 4]

# ---------- Pad: dentes de serra desafinados, filtrados ----------
def pad_note(m, dur):
    n = int(dur * SR); t = np.arange(n) / SR
    s = np.zeros(n)
    for det in (-0.09, 0.0, 0.11):
        f = hz(m + det)
        ph = (t * f + rng.random()) % 1.0
        s += (2 * ph - 1)
    sos = butter(2, 1500, 'low', fs=SR, output='sos')
    s = sosfilt(sos, s) / 3
    return s * env_adsr(n, 0.9, 0.4, 0.8, 1.2)

for b in range(BARS):
    if b == 11: continue  # pausa antes da área de membros (só riser)
    dur = BAR + 1.0 if b < BARS - 1 else BAR + 0.2
    g = 0.11 if b not in (0, 1) else 0.13
    if b >= BARS - 1:
        notes = [50, 57, 61, 64, 66, 69]
    else:
        notes = chord(b)
    for k, m in enumerate(notes[1:] if b < BARS - 1 else notes):
        add('pad', pad_note(m, dur), b * BAR, pan=(k - 2) * 0.25, gain=g)

# ---------- Teclado elétrico (FM) em arpejo ----------
def epiano(m, dur, vel=1.0):
    n = int(dur * SR); t = np.arange(n) / SR; f = hz(m)
    idx = 2.2 * np.exp(-t * 6) + 0.25
    s = np.sin(2 * np.pi * f * t + idx * np.sin(2 * np.pi * f * t))
    s += 0.35 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 9)
    s += 0.12 * np.sin(2 * np.pi * 7.02 * f * t) * np.exp(-t * 30)   # brilho do martelo
    e = np.exp(-t * 2.4) * (1 - np.exp(-t * 400))
    return s * e * vel

ARP = [0, 2, 1, 3, 2, 4, 3, 1]  # índices nas notas do acorde (+12)
for b in range(BARS):
    if b in (11,): continue
    if b >= 23: pat_len = 4
    else: pat_len = 8
    ch = chord(b)
    for k in range(pat_len):
        t0 = b * BAR + k * BEAT / 2 * (8 / pat_len)
        m = ch[1:][ARP[k] % 4] + 12
        vel = 0.9 if k % 2 == 0 else 0.62
        add('keys', epiano(m, 1.6), t0, pan=-0.35 if k % 2 else 0.35, gain=0.16 * vel)
    if b >= 12 and b < 22:  # contracanto agudo na segunda metade
        for k, beat in enumerate([0, 1.5, 3]):
            m = ch[[4, 3, 2][k]] + 12
            add('keys', epiano(m, 2.0), b * BAR + beat * BEAT, pan=0.1, gain=0.08)
# acorde final
for k, m in enumerate([62, 69, 73, 76, 78]):
    add('keys', epiano(m, 4.0), 24 * BAR + k * 0.04, pan=(k - 2) * 0.2, gain=0.13)

# ---------- Baixo ----------
def bass(m, dur):
    n = int(dur * SR); t = np.arange(n) / SR; f = hz(m)
    s = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * 2 * f * t) + 0.08 * np.sin(2 * np.pi * 3 * f * t)
    return s * env_adsr(n, 0.008, 0.15, 0.7, 0.08)

for b in range(2, 23):
    if b == 11: continue
    r = ROOT[b % 4]
    pattern = [(0, 0.55, r), (1.5, 0.3, r), (2, 0.55, r), (3.5, 0.3, r + 7 if b % 2 else r + 12)] if b >= 4 else [(0, 1.1, r), (2, 1.1, r)]
    for beat, d, m in pattern:
        add('bass', bass(m, d * 1.0), b * BAR + beat * BEAT, gain=0.30)
add('bass', bass(38, 3.0), 24 * BAR, gain=0.26)

# ---------- Bateria ----------
def kick():
    n = int(0.45 * SR); t = np.arange(n) / SR
    f = 46 + 110 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.sin(ph) * np.exp(-t * 7.5)
    s += 0.07 * rng.standard_normal(n) * np.exp(-t * 300)
    return s

def clap():
    n = int(0.35 * SR); t = np.arange(n) / SR
    nz = rng.standard_normal(n)
    sos = butter(2, [900, 4200], 'band', fs=SR, output='sos')
    nz = sosfilt(sos, nz)
    e = np.exp(-t * 18)
    for d in (0.011, 0.022):
        i = int(d * SR); e[i:] += np.exp(-(t[i:] - d) * 22) * 0.7
    return nz * e * 0.9

def hat(open_=False):
    n = int((0.25 if open_ else 0.06) * SR); t = np.arange(n) / SR
    nz = rng.standard_normal(n)
    sos = butter(2, 7500, 'high', fs=SR, output='sos')
    return sosfilt(sos, nz) * np.exp(-t * (14 if open_ else 70))

def shaker():
    n = int(0.09 * SR); t = np.arange(n) / SR
    sos = butter(2, [5000, 11000], 'band', fs=SR, output='sos')
    return sosfilt(sos, rng.standard_normal(n)) * np.sin(np.pi * t / t[-1]) ** 2

K, C = kick(), clap()
for b in range(2, 23):
    if b == 11: continue
    t0 = b * BAR
    if b < 4:
        for beat in (0, 2): add('drums', K, t0 + beat * BEAT, gain=0.42)
        for k in range(8): add('drums', shaker(), t0 + k * BEAT / 2, pan=0.3, gain=0.10)
        continue
    for beat in (0, 2, 2.75 if b % 4 == 3 else None):
        if beat is not None: add('drums', K, t0 + beat * BEAT, gain=0.55)
    for beat in (1, 3): add('drums', C, t0 + beat * BEAT, pan=-0.05, gain=0.16)
    for k in range(8):
        sw = 0.025 if k % 2 else 0
        add('drums', hat(open_=(k == 7 and b % 2)), t0 + k * BEAT / 2 + sw, pan=0.35, gain=0.045 if k % 2 else 0.07)
    for k in range(16):
        add('drums', shaker(), t0 + k * BEAT / 4, pan=-0.4, gain=0.02 + 0.012 * (k % 4 == 2))
    if b == 10:  # virada para a pausa
        for k in range(4): add('drums', C, t0 + (3 + k / 4) * BEAT, gain=0.12 + 0.03 * k)

# ---------- Efeitos: whoosh nas trocas de cena, riser e impacto ----------
def whoosh(dur=0.55, rev=False):
    n = int(dur * SR); t = np.arange(n) / SR
    nz = rng.standard_normal(n)
    out = np.zeros(n)
    seg = 2048
    for i in range(0, n, seg):
        x = i / n
        fc = 400 + 5200 * (x ** 2)
        sos = butter(2, [fc * 0.6, min(fc * 1.6, 20000)], 'band', fs=SR, output='sos')
        out[i:i + seg] = sosfilt(sos, nz[i:i + seg])
    e = np.sin(np.pi * (t / dur) ** 1.3) ** 2
    s = out * e
    return s[::-1] if rev else s

def riser(dur):
    n = int(dur * SR); t = np.arange(n) / SR
    s = np.zeros(n)
    f = 180 * 2 ** (3.2 * (t / dur) ** 2)
    ph = 2 * np.pi * np.cumsum(f) / SR
    s += 0.5 * np.sin(ph) + 0.25 * np.sin(2.01 * ph)
    nz = sosfilt(butter(2, 3000, 'high', fs=SR, output='sos'), rng.standard_normal(n))
    s += nz * 0.5 * (t / dur) ** 2
    return s * (t / dur) ** 2.2

def impact():
    n = int(2.2 * SR); t = np.arange(n) / SR
    f = 38 + 60 * np.exp(-t * 10)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.2)
    s += sosfilt(butter(2, 2500, 'low', fs=SR, output='sos'), rng.standard_normal(n)) * np.exp(-t * 6) * 0.5
    return s

CUTS = [2, 4, 7, 9, 11, 15, 18, 20, 22]   # compassos onde a cena muda
for c in CUTS:
    if c == 11: continue
    add('fx', whoosh(0.5), c * BAR - 0.42, pan=0, gain=0.13)
add('fx', riser(BAR), 11 * BAR, gain=0.20)
add('fx', impact(), 12 * BAR, gain=0.55)
add('fx', impact(), 0.0, gain=0.25)

# ---------- Mix ----------
def bus(k): return busses[k]
dl, dr = busses['drums']; _lp = butter(2, 11000, 'low', fs=SR, output='sos'); busses['drums'] = (sosfilt(_lp, dl), sosfilt(_lp, dr))
# compressão "sidechain" do pad e do baixo pelo bumbo
duck = np.ones(N)
for b in range(4, 23):
    if b == 11: continue
    for beat in (0, 1, 2, 3):
        i = int((b * BAR + beat * BEAT) * SR); n = int(0.35 * SR)
        seg = 1 - 0.35 * np.exp(-np.arange(n) / SR * 12)
        duck[i:i + n] = np.minimum(duck[i:i + n], seg[: len(duck[i:i + n])])
for k in ('pad', 'bass'):
    l, r = busses[k]; l *= duck; r *= duck

def reverb(l, r, sec=2.6, wet=0.28):
    n = int(sec * SR); t = np.arange(n) / SR
    irl = rng.standard_normal(n) * np.exp(-t * 3.2); irr = rng.standard_normal(n) * np.exp(-t * 3.2)
    sos = butter(1, 5000, 'low', fs=SR, output='sos')
    irl, irr = sosfilt(sos, irl), sosfilt(sos, irr)
    irl /= np.sqrt(np.sum(irl ** 2)); irr /= np.sqrt(np.sum(irr ** 2))
    pre = int(0.02 * SR)
    wl = np.concatenate([np.zeros(pre), fftconvolve(l + r, irl)[: N - pre]])
    wr = np.concatenate([np.zeros(pre), fftconvolve(l + r, irr)[: N - pre]])
    return l + wet * wl * 0.5, r + wet * wr * 0.5

sends = {'pad': 0.35, 'keys': 0.45, 'bass': 0.0, 'drums': 0.10, 'fx': 0.30}
mixL = np.zeros(N); mixR = np.zeros(N); revL = np.zeros(N); revR = np.zeros(N)
for k, (l, r) in busses.items():
    mixL += l; mixR += r; revL += l * sends[k]; revR += r * sends[k]
wl, wr = reverb(revL, revR, wet=1.0)
mixL += (wl - revL) * 0.6; mixR += (wr - revR) * 0.6

# leve realce de graves/agudos e limitador suave
hp = butter(2, 30, 'high', fs=SR, output='sos')
mixL, mixR = sosfilt(hp, mixL), sosfilt(hp, mixR)
peak = max(np.abs(mixL).max(), np.abs(mixR).max())
mixL, mixR = mixL / peak * 1.25, mixR / peak * 1.25
mixL, mixR = np.tanh(mixL) / np.tanh(1.25), np.tanh(mixR) / np.tanh(1.25)
# fades
fi = int(0.05 * SR); fo = int(3.0 * SR)
for x in (mixL, mixR):
    x[:fi] *= np.linspace(0, 1, fi)
    x[-fo:] *= np.linspace(1, 0, fo) ** 1.6
st = np.stack([mixL, mixR], 1) * 0.89
data = (np.clip(st, -1, 1) * 32767).astype('<i2')
with wave.open(sys.argv[1] if len(sys.argv) > 1 else 'public/music.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(data.tobytes())
print('ok', DUR)
