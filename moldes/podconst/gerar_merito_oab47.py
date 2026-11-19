"""Carrossel PodConst (1080×1350, grupo mo1): quanto valeu o mérito da peça em cada matéria da 2ª fase da OAB 47.
Contas feitas nos padrões de resposta oficiais (s.oab.org.br). Os recortes das tabelas ficam em fotos/oab47-<matéria>.png
(fora do git; recrie com pdftoppm a partir dos PDFs). Uso: python3 moldes/podconst/gerar_merito_oab47.py e node render.mjs merito-oab47."""
import re
from pathlib import Path

KIT = Path(__file__).parent / 'kit' / 'Moldes PodConst.dc.html'
INI, FIM = '<!-- MERITO-OAB47:INICIO -->', '<!-- MERITO-OAB47:FIM -->'
AZUL = 'background:radial-gradient(130% 100% at 20% 0%,#0d44bd 0%,#0a3aa6 40%,#0a2a7c 100%);'
MAG = 'background:radial-gradient(120% 90% at 30% 20%,#ea2ee0 0%,#d61ccf 55%,#c515c2 100%);'
NAVY = 'background:radial-gradient(120% 90% at 80% 0%,#132a7a 0%,#0a1440 70%);'
CLARO = 'background:linear-gradient(165deg,#ffffff 0%,#f3f5f9 50%,#e2e8f2 100%);'
BB = "font-family:'Bebas Neue';"
TINTA, AMAR, ROSA, AZ = '#0b1a4a', '#f7f400', '#e224d6', '#0a3aa6'
MONO = "font-family:'JetBrains Mono',monospace;"

LOGO = lambda px, cor='#ff1ff0': f'''<div style="font-family:'Unbounded',sans-serif;font-weight:900;font-size:{px}px;line-height:.84;letter-spacing:-.02em;color:{cor};text-shadow:.05em .06em 0 #0b1a4a;display:flex;flex-direction:column;align-items:flex-start;transform:rotate(-9deg);"><div style="display:flex;align-items:center;margin-left:.62em;"><span>P</span><span style="width:.72em;height:.72em;border-radius:50%;background:{cor};box-shadow:.05em .06em 0 #0b1a4a;display:flex;align-items:center;justify-content:center;gap:.045em;margin:0 .01em;">{''.join(f'<span style="width:.05em;height:{h}em;border-radius:.03em;background:#fff;"></span>' for h in (.16, .3, .44, .3, .18))}</span><span>D</span></div><div>CONST</div></div>'''

def selos(top=56):
    return (f'<div style="position:absolute;top:{top}px;left:0;right:0;display:flex;flex-direction:column;align-items:center;gap:6px;font-weight:700;font-size:30px;color:{TINTA};">'
            f'<div style="background:{AMAR};padding:2px 12px;margin-right:100px;">@LIBERO<span style="font-weight:400;">FILHO</span></div>'
            f'<div style="background:{ROSA};color:#fff;padding:2px 12px;margin-left:100px;">@NATALIA<span style="font-weight:400;">VALENCA</span></div></div>')

def rodape(n, tot, claro=True):
    c = '#5a6a8f' if claro else 'rgba(255,255,255,.75)'
    return (f'<div style="position:absolute;left:70px;right:70px;bottom:46px;display:flex;align-items:center;gap:20px;font-size:24px;color:{c};">'
            f'<span><b>@libero</b>filho · <b>@natalia</b>valenca</span><span style="flex:1;height:2px;background:{c};opacity:.35;"></span>'
            f'<span style="font-weight:700;letter-spacing:.2em;">{n:02d}/{tot:02d}</span></div>')

def tela(label, fundo, corpo, claro=False):
    return f'<div data-screen-label="{label}" style="position:relative;flex:none;width:1080px;height:1350px;overflow:hidden;font-family:\'Space Grotesk\',sans-serif;color:{TINTA if claro else "#fff"};{fundo}">{corpo}</div>\n'

def kick(txt, cor):
    return f'<div style="display:flex;align-items:center;gap:16px;font-weight:700;font-size:26px;letter-spacing:.26em;color:{cor};"><span style="width:44px;height:6px;background:{cor};"></span>{txt.upper()}</div>'

def marca(txt, fundo=AMAR, cor=TINTA):
    return f'<span style="background:{fundo};color:{cor};padding:0 .12em;">{txt}</span>'

v = lambda x: f'{x:.2f}'.replace('.', ',')

# Dados conferidos nos padrões de resposta da OAB 47 (peça vale 5,00). Mérito = itens de fundamentação (teses);
# liminar/efeito suspensivo, endereçamento, partes, cabimento, pedidos e fechamento ficam fora.
MAT = [
    ('penal', 'Direito Penal', 'Razões de apelação (júri)', [0.55, 0.25, 0.80, 0.80, 0.80, 0.80], 'preliminar e mérito'),
    ('trabalho', 'Direito do Trabalho', 'Recurso ordinário', [0.50, 0.60, 1.00, 0.60, 0.60, 0.50], 'mérito recursal'),
    ('civil', 'Direito Civil', 'Petição inicial', [0.70, 0.70, 0.60, 0.50, 0.50, 0.50], 'fundamentação jurídica'),
    ('administrativo', 'Direito Administrativo', 'Apelação', [0.70, 0.80, 0.50, 0.50, 0.50], 'mérito'),
    ('tributario', 'Direito Tributário', 'Embargos à execução fiscal', [0.80, 0.40, 0.80], 'fundamentos dos embargos'),
    ('constitucional', 'Direito Constitucional', 'Ação popular', [0.50, 0.50, 0.40, 0.40], 'fundamentos de mérito'),
]
TOT = 12

def capa(label):
    corpo = (f'<div style="position:absolute;top:150px;left:-40px;{BB}font-size:760px;line-height:.85;color:rgba(255,255,255,.06);">5,0</div>' + selos() +
             f'<div style="position:absolute;left:0;right:0;top:360px;display:flex;flex-direction:column;align-items:center;text-align:center;">'
             f'<div style="display:flex;align-items:center;gap:18px;font-weight:700;font-size:28px;letter-spacing:.3em;color:{AMAR};"><span style="width:56px;height:3px;background:{AMAR};"></span><span style="margin-right:-.3em;">2ª FASE · OAB 47</span><span style="width:56px;height:3px;background:{AMAR};"></span></div>'
             f'<div style="background:{TINTA};font-weight:700;font-size:46px;padding:6px 18px;margin-top:40px;">Quanto valeu o</div>'
             f'<div style="background:{ROSA};{BB}font-size:200px;line-height:.9;padding:18px 30px 2px;margin-top:10px;">MÉRITO</div>'
             f'<div style="background:{AMAR};color:{TINTA};font-weight:700;font-size:42px;padding:6px 18px;margin-top:10px;">na peça de cada matéria?</div>'
             f'<div style="font-weight:600;font-size:32px;margin-top:46px;opacity:.9;">Fizemos a conta no padrão de resposta oficial</div></div>'
             f'<div style="position:absolute;bottom:70px;left:50%;margin-left:-120px;">{LOGO(50)}</div>')
    return tela(label, AZUL, corpo)

def metodo(label):
    linha = lambda t, d: f'<div style="display:flex;gap:22px;align-items:flex-start;"><span style="flex:none;width:22px;height:22px;margin-top:12px;border-radius:5px;background:{ROSA};"></span><div><b style="font-size:40px;">{t}</b><div style="font-size:32px;line-height:1.35;color:#33426b;margin-top:4px;">{d}</div></div></div>'
    corpo = (f'<div style="position:absolute;left:90px;right:90px;top:110px;">{kick("Como fizemos a conta", ROSA)}'
             f'<div style="{BB}font-size:120px;line-height:.92;margin-top:18px;">A PEÇA VALE {marca("5,00")}</div></div>'
             f'<div style="position:absolute;left:90px;right:90px;top:420px;display:flex;flex-direction:column;gap:40px;">'
             + linha('Mérito', 'Somamos os itens das teses: os fundamentos jurídicos que resolvem o caso.')
             + linha('Estrutura', 'Todo o resto: endereçamento, partes, legitimidade, cabimento, tempestividade, liminar, pedidos e fechamento.')
             + linha('Fonte', 'Distribuição dos pontos nos padrões de resposta da OAB 47, publicados pela OAB.') +
             '</div>' + rodape(2, TOT))
    return tela(label, CLARO, corpo, claro=True)

def materia(label, n, m, nome, peca, itens, rot):
    total = sum(itens); pct = round(total / 5 * 100); const = m == 'constitucional'
    destaque = ROSA if const else AZ
    conta = ' + '.join(v(x) for x in itens) + f' = <b style="color:{ROSA if const else AMAR};">{v(total)}</b>'
    corpo = (f'<div style="position:absolute;left:70px;right:70px;top:80px;">{kick(peca, ROSA)}'
             f'<div style="{BB}font-size:{100 if len(nome) > 18 else 112}px;line-height:.92;margin-top:14px;">{nome.upper()}</div></div>'
             f'<div style="position:absolute;left:70px;right:70px;top:300px;display:flex;align-items:flex-end;gap:26px;">'
             f'<div style="{BB}font-size:230px;line-height:.8;color:{destaque};">{v(total)}</div>'
             f'<div style="padding-bottom:14px;"><div style="font-weight:700;font-size:40px;line-height:1.1;">de 5,00 da peça</div><div style="font-size:32px;color:#33426b;margin-top:6px;">foram de mérito · {len(itens)} itens</div></div>'
             f'<div style="margin-left:auto;background:{destaque};color:#fff;{BB}font-size:84px;line-height:1;padding:12px 20px 2px;border-radius:14px;">{pct}%</div></div>'
             f'<div style="position:absolute;left:70px;right:70px;top:520px;height:22px;border-radius:11px;background:#d9e0ee;overflow:hidden;"><div style="width:{pct}%;height:100%;background:{destaque};"></div></div>'
             f'<div style="position:absolute;left:70px;right:70px;top:580px;background:#fff;border-radius:18px;padding:16px;box-shadow:0 20px 44px rgba(11,26,74,.16);">'
             f'<div style="font-weight:700;font-size:20px;letter-spacing:.18em;color:#5a6a8f;margin:2px 4px 10px;">PADRÃO DE RESPOSTA · {rot.upper()}</div>'
             f'<img src="../fotos/oab47-{m}.png" style="display:block;width:100%;max-height:{430 if not const else 330}px;object-fit:contain;object-position:top;"></div>'
             f'<div style="position:absolute;left:70px;right:70px;bottom:118px;background:{TINTA};color:#fff;border-radius:16px;padding:20px 26px;{MONO}font-size:{28 if len(itens) < 6 else 25}px;line-height:1.35;">'
             f'<span style="color:{AMAR};">conta:</span> {conta}</div>' + rodape(n, TOT))
    return tela(label, CLARO, corpo, claro=True)

def ranking(label):
    mx = 5.0
    linhas = ''.join(
        f'<div style="display:grid;grid-template-columns:330px 1fr 120px;align-items:center;gap:20px;">'
        f'<span style="font-weight:700;font-size:34px;">{nome.replace("Direito do ", "").replace("Direito ", "")}</span>'
        f'<span style="height:46px;border-radius:10px;background:rgba(255,255,255,.12);overflow:hidden;"><span style="display:block;height:100%;width:{sum(i) / mx * 100:.0f}%;background:{ROSA if m == "constitucional" else AMAR};"></span></span>'
        f'<span style="{BB}font-size:64px;line-height:1;text-align:right;color:{ROSA if m == "constitucional" else "#fff"};">{v(sum(i))}</span></div>'
        for m, nome, _, i, _ in MAT)
    corpo = (f'<div style="position:absolute;left:80px;right:80px;top:110px;">{kick("Ranking do mérito", AMAR)}'
             f'<div style="{BB}font-size:116px;line-height:.92;margin-top:18px;">CONSTITUCIONAL<br>FICOU {marca("POR ÚLTIMO", ROSA, "#fff")}</div></div>'
             f'<div style="position:absolute;left:80px;right:80px;top:470px;display:flex;flex-direction:column;gap:30px;">{linhas}</div>'
             f'<div style="position:absolute;left:80px;right:80px;top:1010px;font-size:30px;line-height:1.4;color:rgba(255,255,255,.85);">Pontos de mérito na peça, de 5,00. Constitucional: <b style="color:{AMAR};">36%</b>. Penal: <b style="color:{AMAR};">80%</b>.</div>'
             + rodape(9, TOT, False))
    return tela(label, NAVY, corpo)

def estrutura(label):
    partes = [('Endereçamento e partes', 0.50, 'itens 1 a 3'), ('Legitimidade ativa e passiva', 0.70, 'itens 4 a 8'), ('Cabimento da ação popular', 0.40, 'item 9'),
              ('Pedido liminar', 0.70, 'itens 14 a 16'), ('Pedidos', 0.60, 'item 17'), ('Fechamento', 0.30, 'itens 18 a 20')]
    linhas = ''.join(f'<div style="display:flex;align-items:center;gap:20px;background:#fff;border-radius:16px;padding:18px 26px;box-shadow:0 10px 24px rgba(11,26,74,.08);">'
                     f'<span style="flex:1;font-weight:700;font-size:34px;">{t}<span style="display:block;font-weight:400;font-size:24px;color:#5a6a8f;">{d}</span></span>'
                     f'<span style="{BB}font-size:64px;line-height:1;color:{AZ};">{v(x)}</span></div>' for t, x, d in partes)
    corpo = (f'<div style="position:absolute;left:80px;right:80px;top:100px;">{kick("Direito Constitucional", ROSA)}'
             f'<div style="{BB}font-size:112px;line-height:.92;margin-top:16px;">{marca("3,20", ROSA, "#fff")} DA PEÇA<br>FORAM ESTRUTURA</div></div>'
             f'<div style="position:absolute;left:80px;right:80px;top:430px;display:flex;flex-direction:column;gap:16px;">{linhas}</div>'
             f'<div style="position:absolute;left:80px;right:80px;top:1195px;font-weight:700;font-size:32px;">Mérito: 1,80 · Estrutura: 3,20 · Total: 5,00</div>'
             + rodape(10, TOT))
    return tela(label, CLARO, corpo, claro=True)

def frase(label):
    corpo = (f'<div style="position:absolute;right:-60px;bottom:-120px;{BB}font-size:700px;line-height:1;color:rgba(255,255,255,.08);">§</div>'
             f'<div style="position:absolute;left:90px;right:90px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;gap:36px;">{kick("O que isso mostra", AMAR)}'
             f'<div style="{BB}font-size:128px;line-height:.92;">MENOS TESES.<br>MAIS {marca("ESTRUTURA")}.</div>'
             f'<div style="width:150px;height:20px;background:{AMAR};"></div>'
             f'<div style="font-size:40px;line-height:1.4;">Em Constitucional, a banca pontuou muito a estrutura da peça. E estrutura é o ponto mais fácil de garantir: '
             f'<b>está no vade</b>, na CF e na lei da ação, marcada e grifada.</div></div>' + rodape(11, TOT, False))
    return tela(label, MAG, corpo)

def cta(label):
    corpo = (selos() + f'<div style="position:absolute;left:80px;right:80px;top:330px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:34px;">'
             f'<div style="{BB}font-size:150px;line-height:.9;">E NA SUA<br>{marca("MATÉRIA", ROSA, "#fff")}?</div>'
             f'<div style="width:116px;height:20px;background:{ROSA};"></div>'
             f'<div style="font-weight:700;font-size:40px;line-height:1.3;">Quanto do seu ponto veio do mérito<br>e quanto veio da estrutura?</div>'
             f'<div style="background:{AMAR};color:{TINTA};border-radius:999px;padding:22px 44px;font-weight:700;font-size:38px;">Conta nos comentários</div></div>'
             f'<div style="position:absolute;bottom:70px;left:50%;margin-left:-110px;">{LOGO(46)}</div>')
    return tela(label, AZUL, corpo)

telas = [capa('mo1-01'), metodo('mo1-02')]
for k, (m, nome, peca, itens, rot) in enumerate(MAT, 3):
    telas.append(materia(f'mo1-{k:02d}', k, m, nome, peca, itens, rot))
telas += [ranking('mo1-09'), estrutura('mo1-10'), frase('mo1-11'), cta('mo1-12')]
for m, nome, _, itens, _ in MAT:
    assert round(sum(itens), 2) == {'penal': 4.0, 'trabalho': 3.8, 'civil': 3.5, 'administrativo': 3.0, 'tributario': 2.0, 'constitucional': 1.8}[m]

bloco = (INI + '\n<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">\n'
         f'<div id="mo1" style="display:flex;flex-direction:column;gap:36px;"><div style="display:flex;align-items:center;gap:18px;color:#fff;"><span style="background:#f7f400;color:#111;font-weight:700;font-size:30px;padding:6px 16px;border-radius:6px;">mo1</span><span style="font-size:44px;font-weight:700;">Quanto valeu o mérito na peça, OAB 47</span></div>'
         f'<div style="display:flex;gap:56px;">\n{"".join(telas)}</div></div>\n' + FIM)
s = KIT.read_text()
s = re.sub(re.escape(INI) + '.*?' + re.escape(FIM), lambda _: bloco, s, flags=re.S) if INI in s else s.replace('</section>\n</x-dc>', bloco + '\n</section>\n</x-dc>')
KIT.write_text(s)
print('ok', s.count('data-screen-label="mo1'))
