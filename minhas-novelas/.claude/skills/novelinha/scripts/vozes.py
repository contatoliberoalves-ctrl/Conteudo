#!/usr/bin/env python3
"""Troca de voz por personagem dentro de um clipe da novelinha. SÓ pra consertar uma fala que saiu com a voz errada.

A troca segue o tom da fala que entra: num episódio inteiro trocado (06/11) as duas mulheres foram pro mesmo tom
e ficaram parecidas. Por padrão a voz é a que o vídeo gerou; troque só a fala que estiver errada e ouça antes e depois.

O voice changer da Avatrix troca a voz de um áudio inteiro. Num clipe com 3 personagens isso viraria
3 falas na mesma voz. Então: corta a fala de cada um num WAV, a skill troca cada WAV pela voz do
personagem (change_voice) e este script põe as falas trocadas de volta no lugar, no mesmo tempo.

  cortar:  python3 vozes.py cortar clipes/01.mp4 falas/01.json --pasta vozes/01
           falas/01.json = [{"inicio": 0.0, "fim": 3.0, "personagem": "Seu Tonho"}, ...]
           grava vozes/01/fala-1.wav, fala-2.wav... (MP3/WAV é o que o change_voice aceita)
  juntar:  python3 vozes.py juntar clipes/01.mp4 falas/01.json --pasta vozes/01 --saida clipes-voz/01.mp4
           espera vozes/01/fala-1-nova.mp3 (ou .wav) de cada fala; o som do clipe fica embaixo, baixinho,
           durante cada fala trocada (a chuva continua), e volta inteiro fora delas.
  teste:   python3 vozes.py teste
"""
import argparse, json, pathlib, subprocess, sys, tempfile

# 06/11: com 0,12 a voz antiga ficava por baixo e soava como duas pessoas falando junto.
FUNDO_NA_FALA = 0.0  # som original durante a fala trocada: zero (fora das falas ele volta inteiro)


def ff(*a):
    r = subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *a], capture_output=True, text=True)
    if r.returncode:
        sys.exit(f"ffmpeg falhou:\n{r.stderr[-800:]}")


def falas_de(arquivo):
    falas = json.loads(pathlib.Path(arquivo).read_text())
    for i, f in enumerate(falas):
        assert f["fim"] > f["inicio"] >= 0, f"fala {i + 1}: fim tem que ser depois do início"
    return falas


def cortar(clipe, falas, pasta):
    pasta = pathlib.Path(pasta); pasta.mkdir(parents=True, exist_ok=True)
    saidas = []
    for i, f in enumerate(falas, 1):
        s = pasta / f"fala-{i}.wav"
        ff("-ss", str(f["inicio"]), "-to", str(f["fim"]), "-i", str(clipe), "-vn", "-ac", "1", "-ar", "44100", str(s))
        saidas.append(s)
    return saidas


def nova_de(pasta, i):
    for ext in ("mp3", "wav"):
        p = pathlib.Path(pasta) / f"fala-{i}-nova.{ext}"
        if p.exists():
            return p
    sys.exit(f"falta {pasta}/fala-{i}-nova.mp3 (a voz trocada da fala {i})")


def juntar(clipe, falas, pasta, saida):
    novas = [nova_de(pasta, i) for i in range(1, len(falas) + 1)]
    dentro = "+".join(f"between(t,{f['inicio']},{f['fim']})" for f in falas)
    partes = [f"[0:a]volume='if({dentro},{FUNDO_NA_FALA},1)':eval=frame[fundo]"]
    rotulos = ["[fundo]"]
    for i, f in enumerate(falas, 1):
        atraso = int(round(f["inicio"] * 1000))
        dur = f["fim"] - f["inicio"]
        partes.append(f"[{i}:a]atrim=0:{dur},aresample=44100,adelay={atraso}|{atraso}[v{i}]")
        rotulos.append(f"[v{i}]")
    partes.append(f"{''.join(rotulos)}amix=inputs={len(rotulos)}:duration=first:normalize=0[a]")
    entradas = ["-i", str(clipe)]
    for n in novas:
        entradas += ["-i", str(n)]
    pathlib.Path(saida).parent.mkdir(parents=True, exist_ok=True)
    ff(*entradas, "-filter_complex", ";".join(partes), "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-ar", "44100", str(saida))


def duracao(arquivo):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(arquivo)], capture_output=True, text=True)
    return float(r.stdout.strip())


def teste():
    with tempfile.TemporaryDirectory() as t:
        t = pathlib.Path(t); clipe = t / "c.mp4"
        ff("-f", "lavfi", "-i", "color=c=black:s=320x568:d=6", "-f", "lavfi", "-i", "sine=f=220:d=6", "-shortest", "-c:v", "libx264", "-c:a", "aac", str(clipe))
        falas = [{"inicio": 0.5, "fim": 2.0, "personagem": "A"}, {"inicio": 3.0, "fim": 5.5, "personagem": "B"}]
        (t / "f.json").write_text(json.dumps(falas))
        cortes = cortar(clipe, falas_de(t / "f.json"), t / "v")
        assert len(cortes) == 2 and abs(duracao(cortes[1]) - 2.5) < 0.1, "corte com tamanho errado"
        for i, c in enumerate(cortes, 1):  # finge a voz trocada: outro tom, mesmo tamanho
            ff("-f", "lavfi", "-i", f"sine=f={440 * i}:d={duracao(c)}", str(t / "v" / f"fala-{i}-nova.wav"))
        juntar(clipe, falas, t / "v", t / "s.mp4")
        assert abs(duracao(t / "s.mp4") - 6) < 0.15, "o clipe com a voz nova mudou de tamanho"
    print("teste ok: corta 2 falas, junta de volta e o clipe fica com 6 s")


def main():
    p = argparse.ArgumentParser(); sub = p.add_subparsers(dest="cmd", required=True)
    c = sub.add_parser("cortar"); c.add_argument("clipe"); c.add_argument("falas"); c.add_argument("--pasta", required=True)
    j = sub.add_parser("juntar"); j.add_argument("clipe"); j.add_argument("falas"); j.add_argument("--pasta", required=True); j.add_argument("--saida", required=True)
    sub.add_parser("teste")
    a = p.parse_args()
    if a.cmd == "cortar":
        for s in cortar(a.clipe, falas_de(a.falas), a.pasta):
            print(s)
    elif a.cmd == "juntar":
        juntar(a.clipe, falas_de(a.falas), a.pasta, a.saida); print(f"pronto: {a.saida}")
    else:
        teste()


if __name__ == "__main__":
    main()
