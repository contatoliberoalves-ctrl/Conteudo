# Refaz frases até a transcrição (Whisper medium) bater com o esperado; grava audio/fix-<k>.wav
import sys, json, subprocess, numpy as np
sys.path.insert(0, '/home/user/Conteudo/estudio')
from ev import vozes
from faster_whisper import WhisperModel
p = vozes.perfil(); wm = WhisperModel('medium', device='cpu', compute_type='int8')
FR = json.load(open(sys.argv[1]))      # [{"k":..., "texto":..., "deve":"alcolumbre"}]
for f in FR:
    for tent in range(4):
        out = f'audio/fix-{f["k"]}.wav'
        vozes.gerar(f['texto'], p['motor'], p['ref'], p['ref_texto'], out, **p.get('parametros', {}))
        pcm = subprocess.run(['ffmpeg','-v','error','-i',out,'-ac','1','-ar','16000','-f','f32le','-'],capture_output=True).stdout
        segs, _ = wm.transcribe(np.frombuffer(pcm, np.float32), language='pt')
        txt = ' '.join(s.text for s in segs)
        ok = all(d.lower() in txt.lower() for d in f['deve'])
        print(f['k'], tent, ok, txt, flush=True)
        if ok: break
