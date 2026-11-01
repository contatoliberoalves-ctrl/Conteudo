"""Estuda um vídeo de referência (arquivo ou link) para criar/ajustar um estilo:
ritmo de cortes, duração média de plano, palavras por minuto, e uma folha de
quadros para o Claude ver a legenda (fonte, cor, posição, tamanho), a cor e os
efeitos. Resultado em <pasta>/edit/referencia-<nome>.md + .jpg."""
import re
import subprocess
from pathlib import Path

from .comum import pasta_edit, sonda
from .verificar import folha


def baixar(url, pasta):
    pasta = Path(pasta)
    pasta.mkdir(parents=True, exist_ok=True)
    r = subprocess.run(["yt-dlp", "-f", "mp4/bv*+ba/b", "--merge-output-format", "mp4", "-o",
                        str(pasta / "%(id)s.%(ext)s"), "--print", "after_move:filepath", url],
                       capture_output=True, text=True)
    if r.returncode:
        raise SystemExit("yt-dlp falhou (Instagram/TikTok às vezes pedem login: baixe pelo celular e "
                         "coloque o arquivo na pasta):\n" + r.stderr[-1500:])
    return r.stdout.strip().splitlines()[-1]


def cortes_de_cena(video, limiar=0.3):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", video, "-vf",
                        f"scale=320:-2,select='gt(scene,{limiar})',showinfo", "-an", "-f", "null", "-"],
                       capture_output=True, text=True).stderr
    return [float(x) for x in re.findall(r"pts_time:([\d.]+)", r)]


def main(args):
    alvo = args.video
    if re.match(r"https?://", alvo):
        alvo = baixar(alvo, Path(args.pasta or ".") / "referencias")
    info = sonda(alvo)
    edit = pasta_edit(alvo)
    cortes = cortes_de_cena(alvo)
    dur = info["duracao"]
    planos = [b - a for a, b in zip([0] + cortes, cortes + [dur])]
    linhas = [f"# Referência: {Path(alvo).name}",
              f"- {dur:.1f}s · {info['largura']}x{info['altura']} · {info['fps']} fps",
              f"- {len(cortes)} cortes de cena · {60 * len(cortes) / dur:.1f} cortes/min · "
              f"plano médio {sum(planos) / len(planos):.2f}s (mín {min(planos):.2f}s, máx {max(planos):.2f}s)"]
    if info["audio"] and not args.sem_transcricao:
        from .transcrever import transcrever
        d = transcrever(alvo, args.modelo)
        ws = d["palavras"]
        if ws:
            fala = ws[-1]["e"] - ws[0]["s"]
            linhas.append(f"- fala: {len(ws)} palavras · {60 * len(ws) / max(fala, 1):.0f} palavras/min · "
                          f"primeira palavra em {ws[0]['s']:.2f}s (gancho)")
            linhas.append(f"- texto: {' '.join(w['w'] for w in ws)[:1500]}")
    n = 16
    tempos = [dur * (i + 0.5) / n for i in range(n)]
    img = edit / f"referencia-{Path(alvo).stem}.jpg"
    folha(alvo, tempos, img, colunas=8, largura=220)
    linhas += [f"- folha de quadros: {img}", "",
               "Olhe a folha e anote no estilo: fonte e caixa da legenda, palavras por bloco, cor de "
               "destaque, posição (fração da altura), zoom/punch-in, cor (quente/fria/contraste), "
               "cartelas, b-roll, emojis, música, ritmo."]
    md = edit / f"referencia-{Path(alvo).stem}.md"
    md.write_text("\n".join(linhas) + "\n")
    print("\n".join(linhas))
