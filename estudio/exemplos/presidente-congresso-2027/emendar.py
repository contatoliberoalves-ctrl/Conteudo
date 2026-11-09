# Troca trechos de uma narração por frases refeitas: emendar.py <entrada.wav> <transcript.json> <saida.wav> "<palavra-ini>|<palavra-fim-exclusiva>|<fix.wav>" ...
# O trecho vai do início da palavra-ini até o início da palavra-fim (exclusiva); "FIM" = até o fim do áudio.
import sys, json, subprocess
from comum import Palavras
ent, tr, sai, *subs = sys.argv[1:]
P = Palavras(tr); W = P.W
dur = float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',ent],capture_output=True,text=True).stdout)
cortes = []
for s in subs:
    a, b, f = s.split('|')
    ta = max(0, P.t(a) - 0.05); tb = dur if b == 'FIM' else P.t(b, ta + 1.5) - 0.12
    cortes.append((ta, tb, f))
cortes.sort(); pedacos = []; cur = 0.0
for ta, tb, f in cortes:
    pedacos += [('orig', cur, ta), ('fix', f)]; cur = tb
pedacos.append(('orig', cur, dur))
pedacos = [p for p in pedacos if p[0] == 'fix' or p[2] - p[1] > 0.05]
inp, fil = [], []
for i, p in enumerate(pedacos):
    if p[0] == 'orig':
        inp += ['-ss', f'{p[1]:.3f}', '-to', f'{p[2]:.3f}', '-i', ent]
    else:
        inp += ['-i', p[1]]
    fil.append(f'[{i}:a]aresample=48000,aformat=channel_layouts=mono,loudnorm=I=-16:TP=-1.5,apad=pad_dur=0.12[a{i}]' if p[0]=='fix' else f'[{i}:a]aresample=48000,aformat=channel_layouts=mono[a{i}]')
fil.append(''.join(f'[a{i}]' for i in range(len(pedacos))) + f'concat=n={len(pedacos)}:v=0:a=1[o]')
subprocess.run(['ffmpeg','-y','-loglevel','error'] + inp + ['-filter_complex', ';'.join(fil), '-map', '[o]', sai], check=True)
print('ok', sai, [(round(a,2), round(b,2)) for a, b, _ in cortes])
