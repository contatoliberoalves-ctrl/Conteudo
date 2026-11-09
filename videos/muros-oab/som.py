"""Mixa os efeitos e a trilha do vídeo e junta com o vídeo mudo.

Uso: python3 -I som.py <pasta_dos_sons> [saida/video-mudo.mp4]
Os sons (todos CC0, OpenGameArt) são baixados por baixar_sons.sh.
Cada efeito é colocado de modo que o PICO dele caia exatamente no tempo do quadro.
"""
import subprocess, sys, os
import numpy as np

SR = 48000
DUR = 16.0
SONS = sys.argv[1]
AQUI = os.path.dirname(os.path.abspath(__file__))
VIDEO = sys.argv[2] if len(sys.argv) > 2 else os.path.join(AQUI, 'saida', 'video-mudo.mp4')
SAIDA = os.path.join(AQUI, 'saida')


def load(nome, filtro=None, ini=0.0, dur=None):
    args = ['ffmpeg', '-v', 'error']
    if ini: args += ['-ss', str(ini)]
    if dur: args += ['-t', str(dur)]
    args += ['-i', os.path.join(SONS, nome)]
    if filtro: args += ['-af', filtro]
    args += ['-ac', '2', '-ar', str(SR), '-f', 'f32le', '-']
    b = subprocess.run(args, capture_output=True, check=True).stdout
    return np.frombuffer(b, np.float32).reshape(-1, 2).copy()


mix_fx = np.zeros((int(SR * DUR), 2), np.float32)
mix_mu = np.zeros_like(mix_fx)


def db(g): return 10 ** (g / 20)


def place(buf, x, t, gain_db=0.0, align='peak', fade=0.0):
    """align='peak': o pico do som cai em t; 'start': começa em t; 'end': termina em t."""
    x = x * db(gain_db)
    if fade:
        n = min(len(x), int(fade * SR)); x[-n:] *= np.linspace(1, 0, n)[:, None]
    if align == 'peak': off = int(np.argmax(np.abs(x).max(axis=1)))
    elif align == 'end': off = len(x)
    else: off = 0
    s = int(round(t * SR)) - off
    a, b = max(0, s), min(len(buf), s + len(x))
    if b > a: buf[a:b] += x[a - s:b - s]


B = 'x_sfx_breaking_and_falling/'
V2 = 'x_sfx_100_v2/'
V1 = 'x_100-CC0-SFX_0/'
HITS = [0.5, 2.5, 4.5]
QUEBRA = [(B + 'bfh1_wood_breaking_03.ogg', B + 'bfh1_wood_falling_01.ogg'),
          (B + 'bfh1_rock_breaking_01.ogg', V2 + 'sfx100v2_stones_01.ogg'),
          (B + 'bfh1_glass_breaking_01.ogg', B + 'bfh1_glass_falling_02.ogg')]
trovao = load(V2 + 'sfx100v2_thunder_01.ogg')
woosh = load(V2 + 'sfx100v2_air_02.ogg')
for h, (q1, q2) in zip(HITS, QUEBRA):
    place(mix_fx, woosh, h - 0.16, -4)                       # balanço do martelo
    place(mix_fx, trovao[: int(SR * 2.2)], h, -1, fade=0.8)  # estalo do raio
    place(mix_fx, load(q1), h + 0.02, 0)                     # madeira / tijolo / vidro
    place(mix_fx, load(q2), h + 0.30, -5)

place(mix_fx, load(V1 + 'slam_02.ogg', 'asetrate=48000*0.7,aresample=48000'), 6.55, 0)   # baque da laje
place(mix_fx, load('groundhit.wav', 'asetrate=48000*0.6,aresample=48000'), 6.55, -2)
place(mix_fx, load(V2 + 'sfx100v2_metal_hit_01.ogg'), 6.6, 0)                              # clangor
place(mix_fx, load(V1 + 'metal_04.ogg'), 6.6, -6)
place(mix_fx, load('crackleelectricityloop.wav'), 6.45, -12, align='start')
place(mix_fx, load(B + 'bfh1_hit_02.ogg', 'asetrate=48000*0.8,aresample=48000'), 7.35, -1)  # queda do corpo
place(mix_fx, load(V1 + 'slam_06.ogg', 'lowpass=f=1500'), 7.35, -6)

# 9.0–9.9: crepitar elétrico crescendo
crep = load('snaploop.wav', dur=0.95)
crep *= np.linspace(0.15, 1.0, len(crep))[:, None]
place(mix_fx, crep, 8.97, -3, align='start')
place(mix_fx, load('charge.wav', dur=0.95, ini=3.0), 9.9, -5, align='end')
# 9.9: trovão grande + desmoronamento
place(mix_fx, trovao, 9.9, 2, fade=1.5)
place(mix_fx, load(V1 + 'explosion.ogg'), 9.9, -1)
place(mix_fx, load('cave_in_-_starninjas_0.ogg', dur=2.0), 10.15, -2, align='start', fade=0.5)
place(mix_fx, load('rock_break_0.ogg'), 10.2, -3)
place(mix_fx, load('whoosh2_0.wav', 'atrim=0:1.2'), 10.45, -6)                             # volta a correr
place(mix_fx, load('powerup.wav', 'lowpass=f=2500,afade=t=in:d=1.2'), 12.6, -12, align='start', fade=0.6)  # riser
for z in (13.9, 15.0):
    place(mix_fx, load('shieldhit.wav', dur=0.45), z, -7, fade=0.2)                          # zaps

# ---- trilha: tensa e abafada à noite, abre no amanhecer ----
noite_escura = load('music_boss.wav', 'lowpass=f=700', ini=21.0, dur=DUR)
noite_aberta = load('music_boss.wav', 'lowpass=f=2400', ini=21.0, dur=DUR)
dia = load('music_adv.wav', ini=21.6 - 12.6, dur=DUR)
t = np.arange(len(mix_mu)) / SR
def env(pts):
    xs, ys = zip(*pts); return np.interp(t, xs, ys)[:, None].astype(np.float32)
abre = env([(0, 0), (8.8, 0), (9.9, 1), (10.4, 1), (11.2, 0.4), (12.4, 0.4), (13.0, 1)])
g_noite = env([(0, -6), (6.6, -6), (7.0, -15), (7.9, -15), (8.8, -8), (9.9, -4), (12.4, -4), (13.4, -60)])
g_dia = env([(0, -60), (12.4, -60), (13.2, 0), (16, 0)])
n = len(mix_mu)
noite = noite_escura[:n] * (1 - abre[: len(noite_escura)]) + noite_aberta[:n] * abre[: len(noite_aberta)]
mix_mu[: len(noite)] += noite * (10 ** (g_noite[: len(noite)] / 20))
mix_mu[: len(dia)] += dia[:n] * db(6) * (10 ** (g_dia[: len(dia)] / 20))   # o tema tem gravação mais baixa que a trilha da noite
mix_mu[-int(SR * 0.6):] *= np.linspace(1, 0, int(SR * 0.6))[:, None]

# trilha 6 dB abaixo dos golpes
pk = lambda x: np.sqrt(np.mean(x ** 2))
fx_hits = np.concatenate([mix_fx[int((h - .05) * SR):int((h + .35) * SR)] for h in HITS + [6.55, 9.9]])
mus_rms = pk(mix_mu[int(1 * SR):int(6 * SR)])
mix_mu *= (pk(fx_hits) * db(-6) * 0.8) / mus_rms
final = mix_fx + mix_mu

os.makedirs(SAIDA, exist_ok=True)
bruto = os.path.join(SAIDA, 'som-bruto.wav')
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', bruto],
               input=final.astype(np.float32).tobytes(), check=True)
# masterização: -14 LUFS, pico real -1,5 dB
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', bruto, '-af',
                'alimiter=limit=0.5:attack=2:release=60:level=false,loudnorm=I=-14:TP=-1.5:LRA=11:linear=false,'
                'alimiter=limit=0.83:attack=1:release=50:level=false,aresample=48000',
                '-ar', '48000', os.path.join(SAIDA, 'som.wav')], check=True)
saida = os.path.join(SAIDA, 'muros-da-aprovacao.mp4')
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', VIDEO, '-i', os.path.join(SAIDA, 'som.wav'),
                '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-t', '16',
                '-movflags', '+faststart', saida], check=True)
print(saida)
