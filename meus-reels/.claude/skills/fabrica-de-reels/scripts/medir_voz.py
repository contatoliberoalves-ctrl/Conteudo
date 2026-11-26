#!/usr/bin/env python3
"""Mede a voz de uma fala (MP3, WAV ou o som de um MP4): tom (frequência mediana da voz, em Hz). Só precisa do ffmpeg.

  reel:   python3 medir_voz.py reel cenas/01.mp4 cenas/02.mp4 ...   a RÉGUA: cada cena contra a mediana das cenas do próprio
          reel. Até 2,5 semitons passa; de 2,5 a 4 avisa (o aluno ouve); acima de 4 refaz. Sai com 1 se alguma pede refazer.
          A mesma voz varia de uma fala pra outra (a entonação muda): comparar com uma fala de teste só reprova cena boa.
  tom:    python3 medir_voz.py tom fala.mp3 [--ref 158]     só imprime o tom (e a distância de uma referência, se der; --ref 0 ou negativo para com erro: meça antes o tom da voz-alvo)
  (palavras por segundo: python3 conferir_fala.py ritmo <arquivo> "<fala>", a régua única do ritmo)
  teste:  python3 medir_voz.py teste
"""
import argparse, array, math, subprocess, sys, tempfile, pathlib

SR = 8000          # 8 kHz basta pra voz falada e deixa o cálculo rápido sem numpy
QUADRO = 0.04      # janela de 40 ms
PASSO = 0.05       # um quadro a cada 50 ms
PASSA_ST, AVISA_ST = 2.5, 4.0  # contra a mediana do reel: até 2,5 passa; até 4 avisa; acima refaz


def amostras(arquivo):
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", str(arquivo), "-vn", "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"],
                       capture_output=True)
    if r.returncode:
        sys.exit(f"não consegui ler {arquivo}: {r.stderr.decode()[-300:]}")
    return array.array("h", r.stdout)


def tom(arquivo):
    x = amostras(arquivo)
    n, hop = int(SR * QUADRO), int(SR * PASSO)
    lag_min, lag_max = SR // 400, SR // 60  # voz entre 60 e 400 Hz
    energias = [sum(v * v for v in x[i:i + n]) for i in range(0, len(x) - n - lag_max, hop)]
    if not energias:
        return None
    corte = sorted(energias)[len(energias) // 2]  # só os quadros da mediana pra cima (onde tem fala)
    f0s = []
    for k, i in enumerate(range(0, len(x) - n - lag_max, hop)):
        if energias[k] < corte or energias[k] == 0:  # "<": som contínuo (todos iguais à mediana) não pode sumir inteiro
            continue
        q = x[i:i + n + lag_max]
        e0 = energias[k]
        cor = [sum(q[j] * q[j + lag] for j in range(0, n, 2)) for lag in range(lag_min, lag_max)]  # metade das amostras
        topo = max(cor)
        if topo <= 0 or topo / (e0 / 2) <= 0.5:  # quadro sem voz periódica
            continue
        # erro de oitava: o pico do dobro do período às vezes empata com o certo; pega o PRIMEIRO atraso perto do máximo
        k0 = next(i for i, c in enumerate(cor) if c >= 0.9 * topo)
        while k0 + 1 < len(cor) and cor[k0 + 1] > cor[k0]:
            k0 += 1
        f0s.append(SR / (lag_min + k0))
    if not f0s:
        return None
    f0s.sort()
    return f0s[len(f0s) // 2]


def semitons(f, ref):
    return 12 * math.log2(f / ref)


def duracao(arquivo):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(arquivo)], capture_output=True, text=True)
    return float(r.stdout.strip())


def regua(arquivos):
    """[(arquivo, tom, semitons da mediana, veredito)] e a mediana."""
    tons = [(a, tom(a)) for a in arquivos]
    validos = sorted(f for _, f in tons if f)
    if not validos:
        return [], None
    med = validos[len(validos) // 2] if len(validos) % 2 else (validos[len(validos) // 2 - 1] + validos[len(validos) // 2]) / 2
    out = []
    for a, f in tons:
        if not f:
            out.append((a, None, None, "SEM VOZ")); continue
        st = semitons(f, med)
        out.append((a, f, st, "passa" if abs(st) <= PASSA_ST else "AVISA: o aluno ouve" if abs(st) <= AVISA_ST else "REFAZ"))
    return out, med


def teste():
    with tempfile.TemporaryDirectory() as t:
        a = pathlib.Path(t) / "a.wav"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", "sine=f=150:d=2", str(a)], check=True)
        f = tom(a)
        assert f and abs(f - 150) < 6, f"esperava ~150 Hz, saiu {f}"
        assert abs(semitons(f, 150 * 2 ** (3 / 12)) + 3) < 0.4, "conta de semitons errada"
        h = pathlib.Path(t) / "h.wav"  # voz com harmônicos: 200 + 400 + 600 Hz tem que dar 200, não 100 nem 400
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", "sine=f=200:d=2", "-f", "lavfi", "-i", "sine=f=400:d=2",
                        "-f", "lavfi", "-i", "sine=f=600:d=2", "-filter_complex", "amix=inputs=3:normalize=0", str(h)], check=True)
        g = tom(h)
        assert g and abs(g - 200) < 8, f"harmônicos: esperava ~200 Hz, saiu {g}"
        cenas = []  # 5 cenas da mesma voz variando pouco, 1 uns 3 semitons acima e 1 uns 5 acima
        for i, hz in enumerate((148, 149, 150, 151, 152, 150 * 2 ** (3 / 12), 150 * 2 ** (5 / 12))):
            c = pathlib.Path(t) / f"c{i}.wav"
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", f"sine=f={hz:.1f}:d=1.5", str(c)], check=True)
            cenas.append(c)
        v = [x[3] for x in regua(cenas)[0]]
        assert v[:5] == ["passa"] * 5 and v[5].startswith("AVISA") and v[6] == "REFAZ", f"régua do reel errada: {v}"
    print(f"teste ok: tom de 150 Hz medido como {f:.1f} Hz; 200+400+600 Hz medido como {g:.1f} Hz; "
          f"régua do reel: 5 cenas perto da mediana passam, +3 semitons avisa, +5 refaz")


def main():
    p = argparse.ArgumentParser(); s = p.add_subparsers(dest="c", required=True)
    a = s.add_parser("tom"); a.add_argument("arquivo"); a.add_argument("--ref", type=float)
    rl = s.add_parser("reel"); rl.add_argument("arquivos", nargs="+")
    s.add_parser("teste")
    o = p.parse_args()
    if o.c == "teste":
        return teste()
    if o.c == "reel":
        linhas, med = regua(o.arquivos)
        if med is None:
            sys.exit("não achei voz em nenhum arquivo")
        for a, f, st, v in linhas:
            print(f"{pathlib.Path(a).name}: " + (f"tom {f:.1f} Hz · {st:+.1f} semitons da mediana · {v}" if f else v))
        print(f"mediana do reel: {med:.1f} Hz")
        sys.exit(1 if any(v == "REFAZ" for *_, v in linhas) else 0)
    if o.ref is not None and o.ref <= 0:
        sys.exit("ERRO: --ref <= 0: a referência do tom está vazia. Meça antes o tom da voz-alvo e grave em tom_hz")
    f = tom(o.arquivo)
    if f is None:
        sys.exit("não achei voz nesse arquivo")
    if o.ref:
        st = semitons(f, o.ref)
        print(f"tom {f:.1f} Hz · {st:+.1f} semitons de {o.ref:.0f} Hz")
        return
    print(f"tom {f:.1f} Hz")


if __name__ == "__main__":
    main()
