#!/usr/bin/env python3
"""Materiais em PDF A4 da PratFlix: texto em Markdown (materiais/NN-*.md) → PDF com capa tipográfica,
sumário com links, páginas numeradas e marcadores. Texto selecionável (não é PDF de imagem).

Uso (nuvem): CHROMIUM_PATH=/opt/pw-browsers/chromium RENDER_PROXY=$HTTPS_PROXY python3 materiais/gerar.py [NN ...]
Saída: saida/materiais/<arquivo>.pdf

Marcações além do Markdown:
  ---  cabeçalho com numero, titulo, destaque, arquivo, resumo, uso (linhas) e rodape
  [[quebra]]            nova página
  [[linhas N]]          N linhas para escrever à mão
  [[caixa N]]           caixa em branco com N linhas de altura
  ::: tipo Título       bloco (quadro, atencao, exemplo, fala, ruim, melhor, resposta, pratica) até :::
  - [ ] item            item de checklist com quadradinho
  {.ficha} na linha antes de uma tabela: tabela com linhas altas para preencher
"""
import re, sys, json, subprocess, html, pathlib
import markdown
import fitz

RAIZ = pathlib.Path(__file__).resolve().parent
MOLDE = RAIZ.parent
SAIDA = MOLDE / 'saida' / 'materiais'
BUILD = MOLDE / 'build' / 'materiais'
FONTES = 'https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@800;900&family=Manrope:wght@400;500;600;700;800&display=swap'
LINK = 'https://liberofilho.com/pratflix/aulas.html'

CSS = """
:root{--preto:#151515;--marfim:#F7F4EB;--ouro:#B49A5B;--ouro2:#8E7840;--areia:#EFE8D6;--linha:#CFC6B0;--cinza:#5B564C}
@page{size:A4;margin:20mm 18mm 22mm 18mm}
html{background:transparent}
body{margin:0;font-family:Manrope,Helvetica,Arial,sans-serif;font-size:11.5pt;line-height:1.58;color:var(--preto);-webkit-print-color-adjust:exact;print-color-adjust:exact}
h1,h2,h3{break-after:avoid;page-break-after:avoid}
h1{font-family:'Big Shoulders Display',Impact,sans-serif;font-weight:900;text-transform:uppercase;font-size:30pt;line-height:.95;letter-spacing:-.005em;margin:0 0 4mm;padding-top:2mm}
h1 .n{display:block;font-family:Manrope,sans-serif;font-weight:800;font-size:8.5pt;letter-spacing:.3em;color:var(--ouro2);margin-bottom:2.5mm}
h1::after{content:"";display:block;width:16mm;height:1.4mm;background:var(--ouro);margin-top:4mm}
h1.sec{margin-top:9mm}
h1.sec:first-of-type{margin-top:0}
h2{font-size:14pt;font-weight:800;margin:7mm 0 2.5mm;line-height:1.25}
h3{font-size:12pt;font-weight:800;margin:5mm 0 1.5mm;color:var(--ouro2)}
p{margin:0 0 3mm}
ul,ol{margin:0 0 3.5mm;padding-left:6mm}
li{margin:0 0 1.4mm}
strong{font-weight:800}
a{color:var(--ouro2);text-decoration:underline}
table{width:100%;border-collapse:collapse;margin:2mm 0 5mm;font-size:10.5pt;line-height:1.4;break-inside:auto}
tr{break-inside:avoid}
th{background:var(--preto);color:var(--marfim);text-align:left;font-weight:700;padding:2.2mm 2.5mm;font-size:9.5pt;letter-spacing:.02em}
td{border-bottom:1px solid var(--linha);padding:2.2mm 2.5mm;vertical-align:top;background:#FBF9F3}
tr:nth-child(even) td{background:#F3EEE1}
.ficha td{height:11mm;background:#fff}
.ficha tr:nth-child(even) td{background:#fff}
.ficha td:first-child{background:#F3EEE1;font-weight:700;width:34%}
.grade td{height:11mm;background:#fff}
.grade tr:nth-child(even) td{background:#fff}
.linhas{margin:1mm 0 5mm}
.linhas div{height:8.5mm;border-bottom:1px solid #B9AF98}
.caixa{border:1.2px solid #B9AF98;background:#fff;border-radius:2mm;margin:1mm 0 5mm}
.bloco{break-inside:avoid;border-radius:2mm;padding:4mm 5mm;margin:2mm 0 5mm}
.bloco>.t{font-weight:800;font-size:8.5pt;letter-spacing:.2em;text-transform:uppercase;margin-bottom:2mm}
.bloco p:last-child,.bloco ul:last-child,.bloco ol:last-child,.bloco table:last-child{margin-bottom:0}
.quadro{background:var(--areia);border-left:1.6mm solid var(--ouro)}
.quadro>.t{color:var(--ouro2)}
.atencao{background:#fff;border:1.4px solid var(--preto)}
.exemplo{background:#fff;border:1px solid var(--linha)}
.exemplo>.t{color:var(--ouro2)}
.pratica{background:var(--preto);color:var(--marfim)}
.pratica>.t{color:var(--ouro)}
.pratica a{color:var(--ouro)}
.resposta{background:#EEF0E8;border-left:1.6mm solid #6D7B5A}
.resposta>.t{color:#4F5C3E}
.fala{background:#fff;border:1px solid var(--linha)}
.fala p{margin:0 0 2mm}
.ruim{background:#F6E9E4;border-left:1.6mm solid #A5523A;padding:3mm 4.5mm;margin:1mm 0 1.5mm}
.ruim>.t{color:#8A3F2B}
.melhor{background:#EAF0E2;border-left:1.6mm solid #5E7A3E;padding:3mm 4.5mm;margin:0 0 5mm}
.melhor>.t{color:#4A6331}
ul.check{list-style:none;padding-left:0}
ul.check li{padding-left:8mm;position:relative}
ul.check li::before{content:"";position:absolute;left:0;top:1.2mm;width:4mm;height:4mm;border:1.3px solid var(--preto);border-radius:.6mm;background:#fff}
.quebra{break-before:page}
.sumario{margin:2mm 0 6mm}
.sumario a{display:flex;align-items:baseline;gap:3mm;text-decoration:none;color:var(--preto);padding:2.2mm 0;border-bottom:1px solid var(--linha);font-weight:600}
.sumario a .num{font-weight:800;color:var(--ouro2);width:9mm;flex:none}
.sumario a .pt{margin-left:auto;color:var(--cinza);font-weight:500;font-size:10pt}
.pequeno{font-size:9.5pt;color:var(--cinza)}
.fontes{font-size:9.5pt;line-height:1.45}
.fontes li{margin-bottom:2mm;overflow-wrap:anywhere}
"""

CAPA_CSS = """
@page{size:A4;margin:0}
html,body{margin:0;background:#151515}
.capa{position:relative;width:210mm;height:297mm;overflow:hidden;color:#F7F4EB;font-family:Manrope,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.aneis{position:absolute;border-radius:50%;border:1px solid rgba(180,154,91,.45)}
.num{position:absolute;right:-6mm;top:40mm;font-family:'Big Shoulders Display';font-weight:900;font-size:330pt;line-height:.8;color:transparent;-webkit-text-stroke:1.2px rgba(180,154,91,.55)}
.logo{font-weight:800;font-size:27pt;letter-spacing:-.05em;line-height:1}
.logo span{font-size:.55em;vertical-align:.25em;margin-left:1mm}
.logo small{display:block;font-weight:600;font-size:6.6pt;letter-spacing:.42em;margin-top:2.2mm;opacity:.75}
.rot{display:inline-block;border:1px solid rgba(180,154,91,.7);border-radius:1.5mm;padding:2mm 3.5mm;font-weight:700;font-size:8.5pt;letter-spacing:.26em;color:#B49A5B}
.tit{font-family:'Big Shoulders Display';font-weight:900;text-transform:uppercase;font-size:58pt;line-height:.9;letter-spacing:-.005em;margin-top:7mm}
.tit em{font-style:normal;color:#B49A5B;display:block}
.res{font-size:12pt;line-height:1.5;opacity:.86;max-width:140mm;margin-top:8mm}
.traco{width:18mm;height:1.4mm;background:#B49A5B;margin-top:9mm}
.base{position:absolute;left:20mm;right:20mm;bottom:18mm;display:flex;justify-content:space-between;align-items:flex-end;border-top:1px solid rgba(247,244,235,.22);padding-top:5mm;font-size:9pt}
.base b{font-size:12pt;letter-spacing:.02em}
"""


def ler(md_path):
    txt = md_path.read_text(encoding='utf-8')
    meta = {}
    if txt.startswith('---'):
        cab, txt = txt[3:].split('\n---', 1)
        chave = None
        for linha in cab.strip('\n').splitlines():
            m = re.match(r'^(\w+):\s*(.*)$', linha)
            if m:
                chave = m.group(1); meta[chave] = m.group(2).strip()
            elif chave and linha.startswith('  '):
                meta[chave] = (meta[chave] + '\n' + linha.strip()).strip()
    return meta, txt


def pre(txt):
    """Marcações próprias → HTML/Markdown."""
    saida, i, linhas = [], 0, txt.splitlines()
    while i < len(linhas):
        l = linhas[i]
        m = re.match(r'^:::\s*(\w+)\s*(.*)$', l)
        if m:
            tipo, titulo = m.group(1), m.group(2).strip()
            j = i + 1; corpo = []
            while j < len(linhas) and linhas[j].strip() != ':::':
                corpo.append(linhas[j]); j += 1
            cls = tipo if tipo in ('ruim', 'melhor') else f'bloco {tipo}'
            t = f'<div class="t">{html.escape(titulo)}</div>' if titulo else ''
            saida.append(f'<div class="{cls}" markdown="1">\n{t}\n\n' + '\n'.join(pre('\n'.join(corpo)).splitlines()) + '\n\n</div>')
            i = j + 1; continue
        if l.strip() == '{.ficha}' or l.strip() == '{.grade}':
            cls = l.strip()[2:-1]
            j = i + 1; tab = []
            while j < len(linhas) and linhas[j].strip().startswith('|'):
                tab.append(linhas[j]); j += 1
            saida.append(f'<div class="{cls}" markdown="1">\n\n' + '\n'.join(tab) + '\n\n</div>')
            i = j; continue
        m = re.match(r'^\[\[linhas (\d+)\]\]$', l.strip())
        if m:
            saida.append('<div class="linhas">' + '<div></div>' * int(m.group(1)) + '</div>'); i += 1; continue
        m = re.match(r'^\[\[caixa (\d+)\]\]$', l.strip())
        if m:
            saida.append(f'<div class="caixa" style="height:{int(m.group(1)) * 8.5}mm"></div>'); i += 1; continue
        if l.strip() == '[[quebra]]':
            saida.append('<div class="quebra"></div>'); i += 1; continue
        # lista logo depois de um parágrafo (sem linha em branco) também vira lista
        if re.match(r'^(\s*[-*] |\s*\d+\. )', l) and saida and saida[-1].strip() and not re.match(r'^(\s*[-*] |\s*\d+\. |\|)', saida[-1]):
            saida.append('')
        saida.append(l); i += 1
    return '\n'.join(saida)


def checklists(h):
    def troca(m):
        bloco = m.group(0)
        if '<li>[ ]' not in bloco:
            return bloco
        return bloco.replace('<ul>', '<ul class="check">', 1).replace('<li>[ ] ', '<li>')
    return re.sub(r'<ul>.*?</ul>', troca, h, flags=re.S)


def corpo_html(meta, txt):
    h = markdown.markdown(pre(txt), extensions=['tables', 'md_in_html', 'sane_lists'])
    h = checklists(h)
    secoes = []
    def h1(m):
        n = len(secoes) + 1
        titulo = re.sub('<[^>]+>', '', m.group(1))
        secoes.append(titulo)
        return f'<h1 id="s{n}" class="sec"><span class="n">PARTE {n:02d}</span>{m.group(1)}</h1>'
    h = re.sub(r'<h1>(.*?)</h1>', h1, h)
    # título nunca sozinho no pé da página: prende h1/h2/h3 ao primeiro parágrafo que vem depois
    tit = r'<h[123][^>]*>(?:(?!</?h[123]).)*</h[123]>'
    h = re.sub(rf'({tit}\s*(?:{tit}\s*)?<p>(?:(?!</p>).)*</p>)', r'<div style="break-inside:avoid">\1</div>', h, flags=re.S)
    sumario = ''
    if meta.get('sumario', 'sim') == 'sim' and len(secoes) > 2:
        itens = ''.join(f'<a href="#s{i}"><span class="num">{i:02d}</span>{html.escape(t)}</a>' for i, t in enumerate(secoes, 1))
        uso = ''.join(f'<li>{html.escape(x)}</li>' for x in meta.get('uso', '').split('\n') if x.strip())
        sumario = f'''<h2 style="margin-top:0">O que tem neste material</h2><div class="sumario">{itens}</div>
        {f'<div class="bloco quadro"><div class="t">Como usar</div><ul>{uso}</ul></div>' if uso else ''}
        '''
    return f'''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><link href="{FONTES}" rel="stylesheet">
    <style>{CSS}</style></head><body>{sumario}{h}</body></html>''', secoes


def capa_html(meta):
    num = meta['numero']
    tit = html.escape(meta['titulo'])
    dest = html.escape(meta.get('destaque', ''))
    return f'''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><link href="{FONTES}" rel="stylesheet"><style>{CAPA_CSS}</style></head><body>
    <div class="capa">
      <div class="aneis" style="width:150mm;height:150mm;right:-55mm;top:-45mm"></div>
      <div class="aneis" style="width:110mm;height:110mm;right:-35mm;top:-25mm;opacity:.6"></div>
      <div class="num">{num}</div>
      <div style="position:absolute;left:20mm;top:20mm" class="logo">pratflix<span>▸</span><small>A ADVOCACIA NA PRÁTICA</small></div>
      <div style="position:absolute;left:20mm;right:20mm;top:118mm">
        <span class="rot">MATERIAL {num} · {html.escape(meta.get('tipo', 'GUIA PRÁTICO')).upper()}</span>
        <div class="tit">{tit}{f'<em>{dest}</em>' if dest else ''}</div>
        <div class="traco"></div>
        <div class="res">{html.escape(meta.get('resumo', ''))}</div>
      </div>
      <div class="base"><div><b>Líbero Filho</b><br><span style="opacity:.7">Biblioteca de materiais da PratFlix</span></div>
        <div style="text-align:right;opacity:.75">{LINK.replace('https://', '')}<br>Edição de novembro de 2026</div></div>
    </div></body></html>'''


def gerar(md_path):
    meta, txt = ler(md_path)
    BUILD.mkdir(parents=True, exist_ok=True); SAIDA.mkdir(parents=True, exist_ok=True)
    nome = meta['arquivo']
    c_html = BUILD / f'{md_path.stem}-capa.html'; c_pdf = BUILD / f'{md_path.stem}-capa.pdf'
    b_html = BUILD / f'{md_path.stem}-corpo.html'; b_pdf = BUILD / f'{md_path.stem}-corpo.pdf'
    c_html.write_text(capa_html(meta), encoding='utf-8')
    corpo, secoes = corpo_html(meta, txt)
    b_html.write_text(corpo, encoding='utf-8')
    (BUILD / f'{md_path.stem}-secoes.json').write_text(json.dumps(secoes, ensure_ascii=False), encoding='utf-8')
    imp = str(RAIZ / 'imprimir.mjs')
    subprocess.run(['node', imp, str(c_html), str(c_pdf), 'semrodape'], check=True)
    rod = meta.get('rodape', meta['titulo'])
    subprocess.run(['node', imp, str(b_html), str(b_pdf), 'rodape', rod], check=True)
    doc = fitz.open(c_pdf); corpo = fitz.open(b_pdf)
    for pg in corpo:  # fundo marfim em toda a página, por baixo do conteúdo
        pg.draw_rect(pg.rect, color=None, fill=(0xF7/255, 0xF4/255, 0xEB/255), overlay=False)
    toc = corpo.get_toc()
    secoes = json.loads((BUILD / f'{md_path.stem}-secoes.json').read_text(encoding='utf-8'))
    k = 0; limpo = []
    for lv, t, p in toc:
        if lv != 1 or not t.startswith('PARTE'):
            continue
        limpo.append([1, secoes[k] if k < len(secoes) else t, p]); k += 1
    toc = limpo
    doc.insert_pdf(corpo, links=True)
    # marcadores: só as partes (h1), deslocadas uma página por causa da capa
    novo = [[1, 'Capa', 1]] + [[lv, t, p + 1] for lv, t, p in toc]
    doc.set_toc(novo)
    doc.set_metadata({'title': f"{meta['titulo']}{(' · ' + meta['destaque']) if meta.get('destaque') else ''}", 'author': 'Líbero Filho · PratFlix', 'subject': meta.get('resumo', ''), 'creator': 'PratFlix'})
    destino = SAIDA / nome
    doc.save(destino, garbage=3, deflate=True)
    n = doc.page_count
    doc.close(); corpo.close()
    # confere: abre de novo, conta páginas e texto
    chk = fitz.open(destino)
    letras = sum(len(p.get_text()) for p in chk)
    print(f'✓ {nome}: {n} páginas, {letras} caracteres de texto')
    chk.close()
    return destino


if __name__ == '__main__':
    pedidos = sys.argv[1:]
    for md in sorted(RAIZ.glob('[0-9][0-9]-*.md')):
        if pedidos and md.name[:2] not in pedidos:
            continue
        gerar(md)
