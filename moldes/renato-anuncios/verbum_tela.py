"""Gera a 'gravação de tela' da maquete do site (saida/verbum/site.png) rolando no ritmo da fala.
Uso: python3 verbum_tela.py <altura_px> <saida.mp4>   (largura 1080, 25 fps, 50,1 s)
O cabeçalho do site fica fixo no alto, como num celular."""
import json, subprocess, sys
from PIL import Image

H = int(sys.argv[1]); OUT = sys.argv[2]
base = 'saida/verbum/'
meta = json.load(open(base + 'site.json'))
k = meta['escala']; top = meta['tops']; cab = round(meta['cabecalho'] * k)
site = Image.open(base + 'site.png').convert('RGB')
cabec = site.crop((0, 0, 1080, cab))
vis = H - cab                     # altura visível abaixo do cabeçalho
maxy = site.height - vis
y = lambda nome, extra=0: min(maxy, max(cab, round((top[nome] + extra) * k)))
# (instante, posição) — o vídeo acompanha o que ele fala
K = [(0, y('inicio')), (6.0, y('inicio')), (7.9, y('interpretacao')), (10.2, y('interpretacao', 260)), (12.6, y('interpretacao', 520)),
     (13.4, y('sermoes')), (16.0, y('sermoes', 260)), (19.0, y('sermoes', 520)),
     (20.8, y('aluno')), (25.5, y('aluno', 230)), (31.0, y('aluno', 470)),
     (35.9, y('cursos')), (39.0, y('cursos', 300)), (42.0, y('cursos', 520)),
     (43.6, y('compra')), (50.2, y('compra'))]
ease = lambda u: u * u * (3 - 2 * u)
def pos(t):
    for (t0, y0), (t1, y1) in zip(K, K[1:]):
        if t0 <= t <= t1:
            dur = min(1.1, t1 - t0) if abs(y1 - y0) > 600 else (t1 - t0)   # salto rápido entre páginas, rolagem lenta dentro
            u = min(1, (t - t0) / dur) if dur > 0 else 1
            return round(y0 + (y1 - y0) * ease(u))
    return K[-1][1]
FPS, DUR = 25, 50.12
ff = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'1080x{H}', '-r', str(FPS), '-i', '-',
                       '-c:v', 'libx264', '-crf', '22', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', OUT], stdin=subprocess.PIPE)
for n in range(int(DUR * FPS)):
    yy = pos(n / FPS)
    fr = Image.new('RGB', (1080, H)); fr.paste(site.crop((0, yy, 1080, yy + vis)), (0, cab)); fr.paste(cabec, (0, 0))
    ff.stdin.write(fr.tobytes())
ff.stdin.close(); ff.wait(); print('✓', OUT)
