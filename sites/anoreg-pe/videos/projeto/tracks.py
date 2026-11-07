"""Trilhas instrumentais originais para os estilos B (dinâmico), C (cinematográfico) e D (motion).
Uso: python3 tracks.py b|c|d public/music-b.wav"""
import numpy as np, wave, sys
from scipy.signal import butter, sosfilt, fftconvolve

SR = 48000
rng = np.random.default_rng(11)


class Mix:
    def __init__(s, dur):
        s.N = int(dur * SR)
        s.b = {}
        s.send = {}

    def add(s, bus, sig, t, pan=0.0, gain=1.0):
        if bus not in s.b: s.b[bus] = [np.zeros(s.N), np.zeros(s.N)]
        i = int(t * SR)
        if i >= s.N or i < 0: return
        sig = sig[: s.N - i] * gain
        s.b[bus][0][i:i + len(sig)] += sig * np.sqrt((1 - pan) / 2)
        s.b[bus][1][i:i + len(sig)] += sig * np.sqrt((1 + pan) / 2)

    def render(s, sends, duck_times=(), duck_buses=(), duck_amt=0.4, fade_out=2.5, verb=2.4):
        N = s.N
        duck = np.ones(N)
        for t in duck_times:
            i = int(t * SR); n = int(0.3 * SR)
            seg = 1 - duck_amt * np.exp(-np.arange(n) / SR * 13)
            duck[i:i + n] = np.minimum(duck[i:i + n], seg[: len(duck[i:i + n])])
        L = np.zeros(N); R = np.zeros(N); rl = np.zeros(N); rr = np.zeros(N)
        for k, (l, r) in s.b.items():
            if k in duck_buses: l = l * duck; r = r * duck
            L += l; R += r; rl += l * sends.get(k, 0); rr += r * sends.get(k, 0)
        n = int(verb * SR); t = np.arange(n) / SR
        lp = butter(1, 5500, 'low', fs=SR, output='sos')
        for src, dst in ((rl, L), (rr, R)):
            ir = sosfilt(lp, rng.standard_normal(n) * np.exp(-t * 3.0)); ir /= np.sqrt((ir ** 2).sum())
            dst += fftconvolve(src, ir)[:N] * 0.35
        hp = butter(2, 28, 'high', fs=SR, output='sos')
        L, R = sosfilt(hp, L), sosfilt(hp, R)
        pk = max(abs(L).max(), abs(R).max())
        L, R = np.tanh(L / pk * 1.3) / np.tanh(1.3), np.tanh(R / pk * 1.3) / np.tanh(1.3)
        fo = int(fade_out * SR); fi = int(0.03 * SR)
        for x in (L, R):
            x[:fi] *= np.linspace(0, 1, fi); x[-fo:] *= np.linspace(1, 0, fo) ** 1.6
        return np.stack([L, R], 1) * 0.89


def hz(m): return 440 * 2 ** ((m - 69) / 12)
def T(n): return np.arange(int(n * SR)) / SR
def lp(x, fc, o=2): return sosfilt(butter(o, fc, 'low', fs=SR, output='sos'), x)
def hpf(x, fc, o=2): return sosfilt(butter(o, fc, 'high', fs=SR, output='sos'), x)
def bp(x, a, b): return sosfilt(butter(2, [a, b], 'band', fs=SR, output='sos'), x)


def saw(f, t, det=(-0.08, 0, 0.09)):
    s = 0
    for d in det:
        ph = (t * f * 2 ** (d / 12) + rng.random()) % 1; s = s + (2 * ph - 1)
    return s / len(det)


def env(n, a, d, sus, r):
    e = np.full(n, float(sus)); na, nd, nr = int(a * SR), int(d * SR), int(r * SR)
    if na: e[:na] = np.linspace(0, 1, na)
    if nd: e[na:na + nd] = np.linspace(1, sus, len(e[na:na + nd]))
    if nr: e[-nr:] *= np.linspace(1, 0, nr) ** 2
    return e


# --- instrumentos ---
def kick(punch=1.0, dec=7.0):
    t = T(0.5); f = 44 + 120 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * dec) * punch + 0.05 * rng.standard_normal(len(t)) * np.exp(-t * 400)
def clap(g=1.0):
    t = T(0.35); x = bp(rng.standard_normal(len(t)), 900, 4500); e = np.exp(-t * 18)
    for d in (0.011, 0.021): i = int(d * SR); e[i:] += np.exp(-(t[i:] - d) * 24) * 0.7
    return x * e * g
def snap():
    t = T(0.18); return bp(rng.standard_normal(len(t)), 1800, 6000) * np.exp(-t * 55) + 0.4 * np.sin(2 * np.pi * 1900 * t) * np.exp(-t * 90)
def hat(op=False):
    t = T(0.3 if op else 0.06); return hpf(rng.standard_normal(len(t)), 7500) * np.exp(-t * (12 if op else 75))
def tom(f0=70, dec=5):
    t = T(0.9); f = f0 + f0 * 1.2 * np.exp(-t * 18)
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.3 * lp(rng.standard_normal(len(t)), 800) * np.exp(-t * 20)) * np.exp(-t * dec)
def sub(m, d):
    t = T(d); f = hz(m); return (np.sin(2 * np.pi * f * t) + 0.2 * np.sin(4 * np.pi * f * t)) * env(len(t), 0.006, 0.1, 0.8, 0.06)
def pluck(m, d=0.5, bright=3500):
    t = T(d); x = saw(hz(m), t, (-0.05, 0.06)); x = lp(x, bright) ; return x * np.exp(-t * 7) * (1 - np.exp(-t * 600))
def stab(ms, d=0.25):
    t = T(d); x = sum(saw(hz(m), t) for m in ms) / len(ms); x = lp(x, 2600); return x * env(len(t), 0.003, 0.08, 0.5, 0.06)
def pad(ms, d, fc=1400, a=0.8):
    t = T(d); x = sum(saw(hz(m), t) for m in ms) / len(ms); return lp(x, fc) * env(len(t), a, 0.3, 0.85, 1.0)
def epiano(m, d=1.6):
    t = T(d); f = hz(m); idx = 2.0 * np.exp(-t * 6) + 0.2
    s = np.sin(2 * np.pi * f * t + idx * np.sin(2 * np.pi * f * t)) + 0.3 * np.sin(4 * np.pi * f * t) * np.exp(-t * 9)
    return s * np.exp(-t * 2.4) * (1 - np.exp(-t * 400))
def marimba(m, d=0.8):
    t = T(d); f = hz(m)
    s = np.sin(2 * np.pi * f * t) * np.exp(-t * 6) + 0.35 * np.sin(2 * np.pi * 4 * f * t) * np.exp(-t * 22) + 0.15 * np.sin(2 * np.pi * 9.2 * f * t) * np.exp(-t * 50)
    return s * (1 - np.exp(-t * 900))
def glock(m, d=1.4):
    t = T(d); f = hz(m)
    return (np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * 2.76 * f * t) * np.exp(-t * 4) + 0.2 * np.sin(2 * np.pi * 5.4 * f * t) * np.exp(-t * 8)) * np.exp(-t * 3) * (1 - np.exp(-t * 2000))
def strings(ms, d, a=1.2):
    t = T(d); x = 0
    for m in ms:
        vib = 1 + 0.003 * np.sin(2 * np.pi * 5.2 * t + rng.random() * 6)
        ph = np.cumsum(hz(m) * vib) / SR
        for dd in (0.997, 1.0, 1.004): x = x + (2 * ((ph * dd + rng.random()) % 1) - 1)
    return lp(x / (3 * len(ms)), 2200) * env(len(t), a, 0.5, 0.9, 1.4)
def whoosh(d=0.45):
    t = T(d); nz = rng.standard_normal(len(t)); out = np.zeros(len(t)); seg = 2048
    for i in range(0, len(t), seg):
        x = i / len(t); fc = 500 + 5500 * x ** 2
        out[i:i + seg] = bp(nz[i:i + seg], fc * 0.6, min(fc * 1.6, 20000))
    return out * np.sin(np.pi * (t / d) ** 1.3) ** 2
def riser(d):
    t = T(d); f = 160 * 2 ** (3.4 * (t / d) ** 2); ph = 2 * np.pi * np.cumsum(f) / SR
    return (0.5 * np.sin(ph) + 0.25 * np.sin(2.01 * ph) + 0.5 * hpf(rng.standard_normal(len(t)), 3000) * (t / d) ** 2) * (t / d) ** 2.2
def impact(g=1.0, d=2.2):
    t = T(d); f = 36 + 64 * np.exp(-t * 10)
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.2) + 0.5 * lp(rng.standard_normal(len(t)), 2500) * np.exp(-t * 6)) * g
def braam(ms, d=3.0):
    t = T(d); x = sum(saw(hz(m), t, (-0.15, 0, 0.17)) for m in ms) / len(ms)
    fc = 300 + 1600 * np.exp(-t * 1.6)
    out = np.zeros(len(t)); seg = 4096
    for i in range(0, len(t), seg): out[i:i + seg] = lp(x[i:i + seg], fc[i])
    return out * env(len(t), 0.02, 0.6, 0.6, 1.5)
def pop(m=84):
    t = T(0.12); f = hz(m) * (1 + 1.5 * np.exp(-t * 60)); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 35)
def stamp():
    t = T(0.5); return (np.sin(2 * np.pi * np.cumsum(55 + 80 * np.exp(-t * 40)) / SR) * np.exp(-t * 14) + 0.6 * bp(rng.standard_normal(len(t)), 400, 2500) * np.exp(-t * 40))


# ======================= ESTILO B · dinâmico (120 BPM, 22 compassos) =======================
def style_b():
    BPM = 120; B = 60 / BPM; BAR = 4 * B; NB = 22; m = Mix(NB * BAR + 0.3)
    CH = [[57, 60, 64, 67], [53, 57, 60, 64], [48, 52, 55, 59], [55, 59, 62, 65]]  # Am7 Fmaj7 Cmaj7 G7
    RT = [33, 29, 36, 31]
    CUTS = [2, 4, 6, 8, 10, 11, 14, 16, 18, 20]
    kicks = []
    for b in range(NB):
        c = CH[b % 4]; r = RT[b % 4]; t0 = b * BAR
        full = 2 <= b < 21 and b != 10
        if b < 2:  # abertura: batidas secas a cada tempo (palavras)
            for k in range(4):
                m.add('drums', kick(1.0, 9), t0 + k * B, gain=0.5); m.add('fx', impact(0.25, 0.8), t0 + k * B, gain=0.6); kicks.append(t0 + k * B)
            m.add('pad', pad([x + 12 for x in c], BAR + 0.5, 900), t0, gain=0.10)
            continue
        if b == 10:  # quebra
            m.add('fx', riser(BAR), t0, gain=0.24); m.add('pad', pad([x + 12 for x in c], BAR, 1800, 0.2), t0, gain=0.08)
            for k in range(8): m.add('drums', clap(0.5 + k * 0.06), t0 + BAR * 0.5 + k * B / 4, gain=0.14)
            continue
        if b >= 21:
            m.add('keys', stab([x + 12 for x in CH[0]], 1.8), t0, gain=0.25); m.add('bass', sub(33, 1.6), t0, gain=0.35)
            m.add('fx', impact(0.6), t0, gain=0.5); continue
        for k in range(4):
            m.add('drums', kick(), t0 + k * B, gain=0.55); kicks.append(t0 + k * B)
            m.add('drums', hat(True), t0 + k * B + B / 2, pan=0.3, gain=0.07)
        for k in (1, 3): m.add('drums', clap(), t0 + k * B, gain=0.18)
        for k in range(16): m.add('drums', hat(), t0 + k * B / 4, pan=-0.3, gain=0.03 + 0.02 * (k % 2 == 0))
        for k in range(4): m.add('bass', sub(r + (12 if k % 2 else 0), B * 0.45), t0 + k * B + B / 2, gain=0.33)
        for k in (0.5, 1.5, 2.5, 3.25): m.add('keys', stab([x + 12 for x in c]), t0 + k * B, pan=0.15, gain=0.13)
        arp = [c[0] + 24, c[2] + 12, c[1] + 24, c[3] + 12]
        for k in range(8): m.add('lead', pluck(arp[k % 4], 0.4, 4500), t0 + k * B / 2, pan=-0.3 if k % 2 else 0.3, gain=0.10)
        m.add('pad', pad(c, BAR + 0.4, 1600), t0, gain=0.07)
    for c in CUTS:
        if c != 10: m.add('fx', whoosh(0.4), c * BAR - 0.36, gain=0.15)
    m.add('fx', impact(0.9), 11 * BAR, gain=0.6)
    return m.render({'pad': .35, 'keys': .2, 'lead': .35, 'fx': .25, 'drums': .05}, kicks, ('pad', 'bass', 'keys', 'lead'), 0.45, fade_out=1.6)


# ======================= ESTILO C · cinematográfico (90 BPM, 22 compassos) =======================
def style_c():
    BPM = 90; B = 60 / BPM; BAR = 4 * B; NB = 22; m = Mix(NB * BAR + 0.2)
    CH = [[50, 53, 57, 62], [46, 50, 53, 58], [53, 57, 60, 65], [48, 52, 55, 60]]  # Dm Bb F C
    RT = [26, 22, 29, 24]
    CUTS = [3, 6, 9, 11, 12, 15, 18, 20]
    kicks = []
    for b in range(NB):
        c = CH[b % 4]; t0 = b * BAR
        if b == 11:
            m.add('fx', riser(BAR), t0, gain=0.26); continue
        m.add('str', strings(c, BAR + 0.8, 1.0 if b else 2.0), t0, gain=0.12)
        if b >= 21:
            m.add('str', strings([50, 57, 62, 65, 69], 4.0, 0.3), t0, gain=0.14); m.add('fx', braam([26, 38, 45]), t0, gain=0.25); continue
        if b >= 3:  # ostinato em semicolcheias
            for k in range(16):
                note = c[[0, 2, 3, 2][k % 4]] + 12
                m.add('ost', pluck(note, 0.22, 1200 + 1800 * (b / NB)), t0 + k * B / 4, pan=0.25 if k % 2 else -0.25, gain=0.07)
        if b >= 6:
            for k in (0, 2.5): m.add('drums', kick(1.1, 5), t0 + k * B, gain=0.5); kicks.append(t0 + k * B)
            for k in (1, 3): m.add('drums', clap(0.8), t0 + k * B, gain=0.12)
            for k in range(8): m.add('drums', hat(), t0 + k * B / 2, pan=0.3, gain=0.03)
        if b in (5, 8, 14, 17, 19):
            for k, tt in enumerate([0, 0.5, 1, 1.5, 2, 2.5, 3, 3.25, 3.5, 3.75]): m.add('drums', tom(60 + (k % 3) * 18), t0 + tt * B, pan=(k % 3 - 1) * 0.4, gain=0.22)
        m.add('bass', sub(RT[b % 4], BAR * 0.95), t0, gain=0.28 if b >= 3 else 0.18)
    for c in CUTS:
        if c not in (11, 12): m.add('fx', whoosh(0.6), c * BAR - 0.5, gain=0.15)
    for c in (0, 12, 15):
        m.add('fx', braam([26, 38, 45] if c != 15 else [22, 34, 41]), c * BAR, gain=0.30)
        m.add('fx', impact(1.0, 3.0), c * BAR, gain=0.5)
    return m.render({'str': .45, 'ost': .3, 'fx': .35, 'drums': .12}, kicks, ('str', 'bass', 'ost'), 0.3, fade_out=3.5, verb=3.2)


# ======================= ESTILO D · motion (112,5 BPM, 25 compassos) =======================
def style_d(pops=()):
    BPM = 112.5; B = 60 / BPM; BAR = 4 * B; NB = 25; m = Mix(NB * BAR + 0.3)
    CH = [[53, 57, 60, 64], [50, 53, 57, 60], [46, 50, 53, 57], [48, 52, 55, 58]]  # Fmaj7 Dm7 Bbmaj7 C7
    RT = [41, 38, 34, 36]
    RIFF = [0, 2, 1, 3, 2, 1, 3, 2]
    CUTS = [2, 4, 7, 9, 11, 14, 17, 20, 22]
    kicks = []
    for b in range(NB):
        c = CH[b % 4]; t0 = b * BAR
        if b >= 24:
            for k, n in enumerate([65, 69, 72, 76]): m.add('mal', marimba(n, 2.0), t0 + k * 0.06, gain=0.2)
            m.add('mal', glock(84, 2.5), t0, gain=0.12); continue
        if b == 9:  # pausa antes da área de membros (compasso 9-10 é a abertura da área)
            pass
        for k in range(8):
            n = c[RIFF[k]] + 12 + (12 if (b % 2 and k in (5, 6)) else 0)
            m.add('mal', marimba(n), t0 + k * B / 2, pan=0.3 if k % 2 else -0.3, gain=0.17 if k % 2 == 0 else 0.12)
        if b >= 2:
            for k in (0, 2): m.add('drums', kick(0.9, 8), t0 + k * B, gain=0.45); kicks.append(t0 + k * B)
            if b % 4 == 3: m.add('drums', kick(0.7, 9), t0 + 2.5 * B, gain=0.3)
            for k in (1, 3): m.add('drums', snap(), t0 + k * B, pan=-0.15, gain=0.22)
            for k in range(8): m.add('drums', hat(k == 7), t0 + k * B / 2 + (0.02 if k % 2 else 0), pan=0.35, gain=0.035)
            for k, (bt, d) in enumerate([(0, 0.7), (1.5, 0.35), (2, 0.6), (3, 0.3), (3.5, 0.3)]):
                m.add('bass', sub(RT[b % 4] + (7 if k == 4 else 0), d), t0 + bt * B, gain=0.30)
        if b >= 11 and b < 22:
            mel = [c[3] + 24, c[2] + 24, c[1] + 24]
            for k, bt in enumerate([0, 1.5, 3]): m.add('lead', glock(mel[k]), t0 + bt * B, pan=0.1, gain=0.06)
        m.add('pad', pad([x + 12 for x in c], BAR + 0.5, 1300, 0.5), t0, gain=0.05)
    for c in CUTS: m.add('fx', whoosh(0.35), c * BAR - 0.3, gain=0.13)
    for t, kind in pops:
        if kind == 'pop': m.add('fx', pop(80 + int(rng.integers(0, 8))), t, gain=0.16)
        else: m.add('fx', stamp(), t, gain=0.45)
    return m.render({'mal': .35, 'lead': .45, 'pad': .3, 'fx': .2, 'drums': .05}, kicks, ('pad', 'bass', 'mal'), 0.3, fade_out=2.0)


if __name__ == '__main__':
    st, out = sys.argv[1], sys.argv[2]
    if st == 'd':
        # pops e carimbos sincronizados com o vídeo (segundos), lidos de um arquivo opcional
        import json, os
        ev = json.load(open('d_events.json')) if os.path.exists('d_events.json') else []
        data = style_d([(e[0], e[1]) for e in ev])
    else:
        data = {'b': style_b, 'c': style_c}[st]()
    d = (np.clip(data, -1, 1) * 32767).astype('<i2')
    with wave.open(out, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(d.tobytes())
    print('ok', st, len(d) / SR)
