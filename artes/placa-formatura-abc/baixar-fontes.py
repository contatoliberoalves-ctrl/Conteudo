"""Baixa famílias do Google Fonts (subconjunto latin, woff2) para fontes/ e escreve fontes/fontes.css."""
import re, subprocess, sys, os
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
fams = sys.argv[1:]
css_out = open("fontes/fontes.css", "a")
for fam in fams:
    url = "https://fonts.googleapis.com/css2?family=" + fam.replace(" ", "+") + "&display=swap"
    r = subprocess.run(["curl", "-sS", "-m", "30", "-A", UA, url], capture_output=True, text=True)
    css = r.stdout
    blocks = re.findall(r"/\* latin \*/\s*@font-face \{(.*?)\}", css, re.S)
    if not blocks:
        print("FALHOU", fam, css[:80].replace("\n", " ")); continue
    for b in blocks:
        u = re.search(r"url\((https[^)]+)\)", b).group(1)
        nome = re.search(r"font-family: '([^']+)'", b).group(1)
        peso = re.search(r"font-weight: (\d+)", b).group(1)
        estilo = re.search(r"font-style: (\w+)", b).group(1)
        fn = f"{nome.replace(' ', '')}-{peso}{'i' if estilo == 'italic' else ''}.woff2"
        if not os.path.exists("fontes/" + fn):
            subprocess.run(["curl", "-sSfL", "-m", "60", "-o", "fontes/" + fn, u], check=True)
        css_out.write("@font-face{" + re.sub(r"url\(https[^)]+\)", f"url({fn})", b).strip() + "}\n")
    print("ok", fam, len(blocks))
