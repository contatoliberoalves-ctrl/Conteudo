# Junta o áudio do vídeo 3: mensagens da Ana (só texto + som de mensagem, tempo de leitura) e falas do Líbero (voz clonada).
import json, subprocess
linhas = [l.split(': ', 1) for l in open('3-tres-erros.txt').read().strip().split('\n')]
dur = lambda f: float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f],capture_output=True,text=True).stdout)
subprocess.run(['ffmpeg','-y','-loglevel','error','-f','lavfi','-i','sine=f=1320:d=0.07','-f','lavfi','-i','sine=f=1760:d=0.09',
  '-filter_complex','[0]afade=t=out:st=0.03:d=0.04[a];[1]adelay=70|70,afade=t=out:st=0.12:d=0.04[b];[a][b]amix=2:normalize=0,volume=0.35','-ar','48000','-ac','1','audio/pop.wav'],check=True)
seq, t, inp, fil = [], 0.4, [], []
for i, (quem, txt) in enumerate(linhas):
    if quem == 'ANA':
        d = 0.9 + 0.32 * len(txt.split())                     # tempo de leitura da mensagem
        seq.append({'quem': 'ANA', 'texto': txt, 'ini': round(t, 2), 'fim': round(t + d, 2)})
        inp += ['-i', 'audio/pop.wav']; fil.append(f'[{len(inp)//2-1}:a]adelay={int((t+0.45)*1000)}:all=1[s{i}]')
    else:
        w = f'audio/v3-{i:02d}.n.wav'
        subprocess.run(['ffmpeg','-y','-loglevel','error','-i',f'audio/fix-v3-{i:02d}.wav','-af','loudnorm=I=-16:TP=-1.5','-ar','48000','-ac','1',w],check=True)
        d = dur(w)
        seq.append({'quem': 'LIBERO', 'texto': txt, 'ini': round(t, 2), 'fim': round(t + d, 2)})
        inp += ['-i', w]; fil.append(f'[{len(inp)//2-1}:a]adelay={int(t*1000)}:all=1[s{i}]')
    t = seq[-1]['fim'] + 0.25
fil.append(''.join(f'[s{i}]' for i in range(len(linhas))) + f'amix=inputs={len(linhas)}:normalize=0,apad=pad_dur=1[o]')
subprocess.run(['ffmpeg','-y','-loglevel','error'] + inp + ['-filter_complex', ';'.join(fil), '-map', '[o]', '-ar', '48000', 'v3/voz.wav'], check=True)
json.dump(seq, open('v3/falas.json', 'w'), ensure_ascii=False, indent=1); print('ok', round(t, 1))
