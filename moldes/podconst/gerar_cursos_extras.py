"""Injeta no kit do PodConst as telas do carrossel "Programação · Cursos Extras da Repescagem" (grupo ce1).
Uso: python3 moldes/podconst/gerar_cursos_extras.py"""
import re
from pathlib import Path

KIT = Path(__file__).resolve().parent / 'kit' / 'Moldes PodConst.dc.html'
INI, FIM = '<!-- CURSOS-EXTRAS:INICIO -->', '<!-- CURSOS-EXTRAS:FIM -->'
LINK = 'vdelinks.com.br/70Qwj8'

AZUL = 'background:radial-gradient(130% 100% at 20% 0%,#0d44bd 0%,#0a3aa6 40%,#0a2a7c 100%);'
MAG = 'background:radial-gradient(120% 90% at 30% 20%,#ea2ee0 0%,#d61ccf 55%,#c515c2 100%);'
NAVY = 'background:radial-gradient(120% 90% at 80% 0%,#132a7a 0%,#0a1440 70%);'
CLARO = 'background:linear-gradient(165deg,#ffffff 0%,#f3f5f9 50%,#e2e8f2 100%);'
BB = "font-family:'Bebas Neue';"

LOGO = lambda px, cor='#ff1ff0': f'''<div style="font-family:'Unbounded',sans-serif;font-weight:900;font-size:{px}px;line-height:.84;letter-spacing:-.02em;color:{cor};text-shadow:.05em .06em 0 #0b1a4a;display:flex;flex-direction:column;align-items:flex-start;transform:rotate(-9deg);"><div style="display:flex;align-items:center;margin-left:.62em;"><span>P</span><span style="width:.72em;height:.72em;border-radius:50%;background:{cor};box-shadow:.05em .06em 0 #0b1a4a;display:flex;align-items:center;justify-content:center;gap:.045em;margin:0 .01em;">{''.join(f'<span style="width:.05em;height:{h}em;border-radius:.03em;background:#fff;"></span>' for h in (.16, .3, .44, .3, .18))}</span><span>D</span></div><div>CONST</div></div>'''

def arrobas(claro=False):
    linha = '#0b1a4a' if claro else '#fff'
    return (f'<div style="position:absolute;top:60px;left:78px;right:78px;display:flex;align-items:center;gap:22px;font-size:30px;color:{linha};"><span><b>@libero</b>filho</span><span style="flex:1;height:2px;background:{linha};"></span></div>'
            f'<div style="position:absolute;bottom:60px;left:78px;right:78px;display:flex;align-items:center;gap:22px;font-size:30px;color:{linha};"><span style="flex:1;height:2px;background:{linha};"></span><span><b>@natalia</b>valenca</span></div>')

def selos(top=56):
    return f'<div style="position:absolute;top:{top}px;left:0;right:0;display:flex;flex-direction:column;align-items:center;gap:6px;font-weight:700;font-size:30px;color:#0b1a4a;"><div style="background:#f7f400;padding:2px 12px;margin-right:100px;">@LIBERO<span style="font-weight:400;">FILHO</span></div><div style="background:#e224d6;color:#fff;padding:2px 12px;margin-left:100px;">@NATALIA<span style="font-weight:400;">VALENCA</span></div></div>'

def tela(label, fundo, corpo, claro=False, h=1350):
    return f'<div data-screen-label="{label}" style="position:relative;flex:none;width:1080px;height:{h}px;overflow:hidden;color:{"#0b1a4a" if claro else "#fff"};{fundo}">{corpo}</div>\n'

def fantasma(txt, cor='rgba(255,255,255,.07)', top=-80, left=-30, px=560):
    return f'<div style="position:absolute;top:{top}px;left:{left}px;{BB}font-size:{px}px;line-height:.85;color:{cor};white-space:nowrap;">{txt}</div>'

def bloco(html, top=300, left=110, right=110, gap=30):
    return f'<div style="position:absolute;top:{top}px;left:{left}px;right:{right}px;display:flex;flex-direction:column;gap:{gap}px;">{html}</div>'

T = lambda txt, px=140, extra='': f'<div style="{BB}font-size:{px}px;line-height:.9;{extra}">{txt}</div>'
P = lambda txt, px=38, extra='': f'<div style="font-weight:700;font-size:{px}px;line-height:1.2;{extra}">{txt}</div>'
BARRA = lambda cor='#f7f400', w=116: f'<div style="width:{w}px;height:20px;background:{cor};"></div>'
MARCA = lambda txt, fundo='#e224d6', cor='#fff': f'<span style="background:{fundo};color:{cor};padding:0 .12em;">{txt}</span>'
KICK = lambda txt, cor='#f7f400': f'<div style="font-weight:700;font-size:28px;letter-spacing:.3em;color:{cor};">{txt}</div>'

def lista(itens, num=True, px=40, cor_num='#f7f400', gap=26):
    out = []
    for i, it in enumerate(itens, 1):
        mk = f'<span style="{BB}font-size:{px * 1.9:.0f}px;line-height:.8;color:{cor_num};min-width:{px * 1.5:.0f}px;">{i:02d}</span>' if num else f'<span style="flex:none;width:{px * .8:.0f}px;height:{px * .8:.0f}px;border-radius:50%;background:{cor_num};color:#0b1a4a;display:flex;align-items:center;justify-content:center;font-size:{px * .55:.0f}px;font-weight:700;margin-top:{px * .12:.0f}px;">✓</span>'
        out.append(f'<div style="display:flex;gap:24px;align-items:{"center" if num else "flex-start"};font-weight:700;font-size:{px}px;line-height:1.18;">{mk}<span>{it}</span></div>')
    return f'<div style="display:flex;flex-direction:column;gap:{gap}px;">{"".join(out)}</div>'

def grupo(gid, nome, telas):
    return (f'<div id="{gid}" style="display:flex;flex-direction:column;gap:36px;">'
            f'<div style="display:flex;align-items:center;gap:18px;color:#fff;"><span style="background:#f7f400;color:#111;font-weight:700;font-size:30px;padding:6px 16px;border-radius:6px;">{gid}</span><span style="font-size:44px;font-weight:700;">{nome}</span></div>'
            f'<div style="display:flex;gap:56px;">\n{"".join(telas)}</div></div>\n')


ICONE_LUPA = '<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="42" cy="42" r="24" fill="none" stroke="#fff" stroke-width="10"/><line x1="60" y1="60" x2="82" y2="82" stroke="#fff" stroke-width="13" stroke-linecap="round"/><path d="M42 30v24M30 42h24" stroke="#f7f400" stroke-width="7" stroke-linecap="round"/></svg>'
ICONE_HACK = '<svg viewBox="0 0 100 100" width="100%" height="100%"><rect x="12" y="20" width="76" height="60" rx="12" fill="none" stroke="#fff" stroke-width="8"/><polyline points="28,40 42,50 28,60" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><line x1="48" y1="62" x2="66" y2="62" stroke="#f7f400" stroke-width="8" stroke-linecap="round"/><path d="M74 6 L62 30 H72 L64 50 L84 22 H74 Z" fill="#f7f400" stroke="#0b1a4a" stroke-width="3"/></svg>'
_SELO = [0]
def emblema(icone, nome, fundo, px=260, rot=0):
    """Selo circular: nome do curso no arco de cima, complemento no arco de baixo (os dois legíveis), ícone e VDE no centro."""
    _SELO[0] += 1
    i = _SELO[0]
    anel = '#f7f400'
    cima, baixo = nome
    corpo_icone = icone.replace('<svg viewBox="0 0 100 100" width="100%" height="100%">', '').replace('</svg>', '')
    svg = (f'<svg viewBox="0 0 300 300" width="{px}" height="{px}" style="display:block;overflow:visible;">'
           f'<defs><path id="sc{i}" d="M 40,150 A 110,110 0 0,1 260,150"/><path id="sb{i}" d="M 22,150 A 128,128 0 0,0 278,150"/>'
           f'<linearGradient id="sg{i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{fundo}"/><stop offset="1" stop-color="#0a1440"/></linearGradient></defs>'
           f'<circle cx="150" cy="150" r="146" fill="url(#sg{i})"/>'
           f'<circle cx="150" cy="150" r="140" fill="none" stroke="{anel}" stroke-width="4"/>'
           f'<circle cx="150" cy="150" r="90" fill="none" stroke="{anel}" stroke-width="2.5"/>'
           f'<text font-family="Bebas Neue" font-size="40" letter-spacing="3" fill="#fff" text-anchor="middle"><textPath href="#sc{i}" startOffset="50%">{cima}</textPath></text>'
           f'<text font-family="Space Grotesk" font-weight="700" font-size="19" letter-spacing="4" fill="{anel}" text-anchor="middle"><textPath href="#sb{i}" startOffset="50%">{baixo}</textPath></text>'
           f'<text x="26" y="157" font-size="20" fill="{anel}" text-anchor="middle">★</text><text x="274" y="157" font-size="20" fill="{anel}" text-anchor="middle">★</text>'
           f'<g transform="translate(112,88) scale(.76)">{corpo_icone}</g>'
           f'<text x="150" y="200" text-anchor="middle" font-family="Bebas Neue" font-size="22" letter-spacing="4" fill="{anel}">MÉTODO VDE</text>'
           f'</svg>')
    return f'<div style="display:flex;flex-direction:column;align-items:center;transform:rotate({rot}deg);filter:drop-shadow(0 24px 40px rgba(0,0,0,.35));">{svg}</div>'
EMB1 = lambda px=260, rot=0: emblema(ICONE_LUPA, ('APROFUNDAMENTO', 'NA REPESCAGEM'), '#1d3a9e', px, rot)
EMB2 = lambda px=260, rot=0: emblema(ICONE_HACK, ('HACKEANDO', 'A REPESCAGEM'), '#e224d6', px, rot)


EMB1 = lambda px=260, rot=0: emblema(ICONE_LUPA, ('APROFUNDAMENTO', 'NA REPESCAGEM'), '#1d3a9e', px, rot)
EMB2 = lambda px=260, rot=0: emblema(ICONE_HACK, ('HACKEANDO', 'A BANCA'), '#e224d6', px, rot)
LOGO_EM = lambda bottom=70, px=46: f'<div style="position:absolute;bottom:{bottom}px;left:50%;margin-left:-110px;">{LOGO(px)}</div>'

PROF = {'LÍBERO': ('#f7f400', '#0b1a4a'), 'NATÁLIA': ('#e224d6', '#fff')}
def aula(dia, data, num, titulo, prof, claro=False, mag=False):
    """Linha da agenda: bloco da data, número e título da aula e etiqueta do professor."""
    fp, cp = ('#0b1a4a', '#fff') if (mag and prof == 'NATÁLIA') else PROF[prof]
    cor = '#0b1a4a' if claro else '#fff'
    caixa = 'background:#0b1a4a;color:#fff;' if claro else 'background:#fff;color:#0b1a4a;'
    linha = 'rgba(11,26,74,.15)' if claro else 'rgba(255,255,255,.22)'
    return (f'<div style="display:flex;gap:30px;align-items:center;padding:17px 0;border-bottom:2px solid {linha};color:{cor};">'
            f'<div style="flex:none;width:150px;{caixa}border-radius:18px;text-align:center;padding:12px 0 8px;">'
            f'<div style="font-weight:700;font-size:24px;letter-spacing:.2em;">{dia}</div><div style="{BB}font-size:66px;line-height:.9;">{data}</div></div>'
            f'<div style="flex:1;"><div style="{BB}font-size:34px;letter-spacing:.06em;opacity:.7;">AULA {num}</div>'
            f'<div style="font-weight:700;font-size:33px;line-height:1.15;">{titulo}</div>'
            f'<div style="display:inline-block;margin-top:10px;background:{fp};color:{cp};font-weight:700;font-size:24px;letter-spacing:.14em;padding:4px 14px;">COM {prof}</div></div></div>')

AULAS1 = [('SEG', '23/11', '01', 'Resolvendo a dificuldade na interpretação', 'LÍBERO'),
          ('TER', '24/11', '02', 'Encontrando respostas com o índice remissivo', 'NATÁLIA'),
          ('QUI', '26/11', '03', 'Resolução de questões difíceis 01', 'NATÁLIA'),
          ('SEG', '30/11', '04', 'Guia de identificação de peças + casos difíceis pra identificar', 'LÍBERO')]
AULAS2 = [('TER', '01/12', '01', 'Análise da banca: dados e estatísticas sobre o que mais cai', 'LÍBERO'),
          ('SEG', '07/12', '02', 'Teses mais cobradas na peça', 'NATÁLIA'),
          ('TER', '08/12', '03', 'Argumentos que mais aparecem nas questões', 'NATÁLIA'),
          ('QUI', '10/12', '04', 'O modelo CORINGA das questões', 'LÍBERO')]

def calendario(mes, ano_dias, inicio, marcados, claro=True):
    """Mês em grade (D S T Q Q S S); marcados = {dia: cor}."""
    cor = '#0b1a4a' if claro else '#fff'
    cab = ''.join(f'<div style="font-weight:700;font-size:24px;text-align:center;opacity:.55;">{d}</div>' for d in 'DSTQQSS')
    cel = ['<div></div>'] * inicio
    for d in range(1, ano_dias + 1):
        if d in marcados:
            f, c = marcados[d]
            cel.append(f'<div style="height:66px;border-radius:14px;background:{f};color:{c};{BB}font-size:42px;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 18px rgba(11,26,74,.18);">{d}</div>')
        else:
            cel.append(f'<div style="height:66px;display:flex;align-items:center;justify-content:center;font-weight:500;font-size:28px;opacity:.45;">{d}</div>')
    return (f'<div style="color:{cor};"><div style="{BB}font-size:56px;margin-bottom:12px;">{mes}</div>'
            f'<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px;">{cab}{"".join(cel)}</div></div>')

M1, M2 = ('#1d3a9e', '#fff'), ('#e224d6', '#fff')
G = []
G.append(grupo('ce1', 'Carrossel · Programação dos cursos extras da repescagem (OAB 48)', [
    tela('ce1-01', MAG, fantasma('AGENDA', 'rgba(120,0,120,.18)', top=120, left=-40, px=470) + selos() +
         f'<div style="position:absolute;left:0;right:0;top:300px;display:flex;flex-direction:column;align-items:center;text-align:center;">'
         f'<div style="display:flex;align-items:center;gap:18px;font-weight:700;font-size:28px;letter-spacing:.3em;color:#0b1a4a;"><span style="width:56px;height:3px;background:#0b1a4a;"></span><span style="margin-right:-.3em;">REPESCAGEM OAB 48</span><span style="width:56px;height:3px;background:#0b1a4a;"></span></div>'
         f'<div style="background:#0b1a4a;font-weight:700;font-size:46px;padding:6px 20px;margin-top:36px;">PROGRAMAÇÃO</div>'
         f'<div style="background:#f7f400;color:#0b1a4a;{BB}font-size:168px;line-height:.9;padding:20px 28px 4px;margin-top:10px;transform:rotate(-2deg);">CURSOS EXTRAS</div>'
         f'<div style="background:#fff;color:#e224d6;font-weight:700;font-size:44px;padding:6px 20px;margin-top:14px;">NOVAS DATAS</div>'
         f'<div style="display:flex;gap:40px;margin-top:56px;">{EMB1(230, -6)}{EMB2(230, 6)}</div></div>' + LOGO_EM(60, 40)),
    tela('ce1-02', NAVY, arrobas() + bloco(
        KICK('2 CURSOS · 8 AULAS') + T(f'O QUE VEM AÍ NA<br>{MARCA("REPESCAGEM")}', 130) + BARRA() +
        f'<div style="display:grid;grid-template-columns:1fr 1fr;gap:26px;margin-top:20px;">'
        f'<div style="background:rgba(255,255,255,.07);border:2px solid rgba(255,255,255,.2);border-radius:30px;padding:34px 26px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:18px;">{EMB1(270)}'
        f'<div style="{BB}font-size:52px;line-height:.95;">APROFUNDAMENTO<br>NA REPESCAGEM</div><div style="font-weight:700;font-size:30px;color:#f7f400;">23/11 a 30/11</div><div style="font-size:28px;opacity:.8;">4 aulas</div></div>'
        f'<div style="background:rgba(255,255,255,.07);border:2px solid rgba(255,255,255,.2);border-radius:30px;padding:34px 26px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:18px;">{EMB2(270)}'
        f'<div style="{BB}font-size:52px;line-height:.95;">HACKEANDO<br>A BANCA</div><div style="font-weight:700;font-size:30px;color:#f7f400;">01/12 a 10/12</div><div style="font-size:28px;opacity:.8;">4 aulas</div></div></div>',
        top=230, gap=34)),
    tela('ce1-03', AZUL, arrobas() + f'<div style="position:absolute;right:56px;top:120px;">{EMB1(220, 8)}</div>' + bloco(
        KICK('CURSO EXTRA 01') + T('APROFUNDAMENTO<br>NA REPESCAGEM', 104) + BARRA('#e224d6') +
        '<div style="display:flex;flex-direction:column;">' + ''.join(aula(*a) for a in AULAS1) + '</div>',
        top=160, left=90, right=90, gap=20)),
    tela('ce1-04', MAG, arrobas() + f'<div style="position:absolute;right:56px;top:120px;">{EMB2(220, -8)}</div>' + bloco(
        KICK('CURSO EXTRA 02', '#0b1a4a') + T(f'HACKEANDO<br>A {MARCA("BANCA", "#0b1a4a")}', 112) + BARRA('#0b1a4a') +
        '<div style="display:flex;flex-direction:column;">' + ''.join(aula(*a, mag=True) for a in AULAS2) + '</div>',
        top=160, left=90, right=90, gap=20)),
    tela('ce1-05', CLARO, arrobas(True) + bloco(
        KICK('SALVA NA AGENDA', '#e224d6') + T(f'MARCA ESSAS<br>{MARCA("DATAS", "#f7f400", "#0b1a4a")}', 140, 'color:#0b1a4a;') +
        f'<div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:10px;">'
        f'{calendario("NOVEMBRO", 30, 0, {23: M1, 24: M1, 26: M1, 30: M1})}'
        f'{calendario("DEZEMBRO", 31, 2, {1: M2, 7: M2, 8: M2, 10: M2})}</div>'
        f'<div style="display:flex;gap:30px;font-weight:700;font-size:28px;color:#0b1a4a;margin-top:6px;">'
        f'<span style="display:flex;align-items:center;gap:12px;"><span style="width:30px;height:30px;border-radius:8px;background:#1d3a9e;"></span>Aprofundamento</span>'
        f'<span style="display:flex;align-items:center;gap:12px;"><span style="width:30px;height:30px;border-radius:8px;background:#e224d6;"></span>Hackeando a Banca</span></div>',
        top=180, left=90, right=90, gap=28), claro=True),
    tela('ce1-06', AZUL, selos() +
         f'<div style="position:absolute;left:80px;right:80px;top:300px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:34px;">'
         f'{T("AINDA DÁ<br>TEMPO!", 190)}{BARRA("#e224d6")}'
         + P('Entre no <span style="color:#f7f400;">VDE Repescagem</span> e assista aos dois cursos extras junto com a turma.', 42) +
         f'<div style="background:#f7f400;color:#0b1a4a;border-radius:999px;padding:22px 44px;font-weight:700;font-size:38px;">Garanta sua vaga no link ↓</div>'
         f'<div style="font-weight:700;font-size:40px;border:2px solid rgba(255,255,255,.55);border-radius:16px;padding:18px 30px;"><span style="color:#f7f400;">{LINK}</span></div></div>' + LOGO_EM(70, 46)),
]))

bloco_html = INI + '\n' + ''.join(G) + FIM
s = KIT.read_text()
if INI in s:
    s = re.sub(re.escape(INI) + '.*?' + re.escape(FIM), lambda m: bloco_html, s, flags=re.S)
else:
    s = s.replace('</section>\n</x-dc>', bloco_html + '\n</section>\n</x-dc>')
KIT.write_text(s)
print('ok', s.count('data-screen-label="ce1'))
