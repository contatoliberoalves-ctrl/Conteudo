"""Injeta no kit do PodConst as telas dos posts da Turma de Repescagem do Método VDE (grupos vr1…vr6). Uso: python3 moldes/podconst/gerar_vde_repescagem.py"""
import re
from pathlib import Path

KIT = Path('/home/user/Conteudo/moldes/podconst/kit/Moldes PodConst.dc.html')
INI, FIM = '<!-- VDE-REPESCAGEM:INICIO -->', '<!-- VDE-REPESCAGEM:FIM -->'
LINK = 'vdelinks.com.br/6GG8F6'

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

def tela(label, fundo, corpo, claro=False):
    return f'<div data-screen-label="{label}" style="position:relative;flex:none;width:1080px;height:1350px;overflow:hidden;color:{"#0b1a4a" if claro else "#fff"};{fundo}">{corpo}</div>\n'

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

def capa(label, kicker, l1, l2, l3, fundo=AZUL, ghost='VDE'):
    corpo = ((fantasma(ghost, 'rgba(255,255,255,.06)', top=200, left=-40, px=900) if ghost else '') + selos() +
             f'<div style="position:absolute;left:0;right:0;top:400px;display:flex;flex-direction:column;align-items:center;text-align:center;">'
             f'<div style="display:flex;align-items:center;gap:18px;font-weight:700;font-size:28px;letter-spacing:.3em;color:#f7f400;"><span style="width:56px;height:3px;background:#f7f400;"></span><span style="margin-right:-.3em;">{kicker}</span><span style="width:56px;height:3px;background:#f7f400;"></span></div>'
             f'<div style="background:#0b1a4a;font-weight:700;font-size:44px;padding:6px 18px;margin-top:40px;">{l1}</div>'
             f'<div style="background:#e224d6;{BB}font-size:150px;line-height:.9;padding:18px 26px 2px;margin-top:10px;max-width:960px;">{l2}</div>'
             f'<div style="background:#f7f400;color:#0b1a4a;font-weight:700;font-size:40px;padding:6px 18px;margin-top:10px;">{l3}</div></div>'
             f'<div style="position:absolute;bottom:70px;left:50%;margin-left:-120px;">{LOGO(50)}</div>')
    return tela(label, fundo, corpo)

def cta(label, titulo, linha, comente=True):
    pill = (f'<div style="background:#f7f400;color:#0b1a4a;border-radius:999px;padding:22px 44px;font-weight:700;font-size:38px;">Comente <span style="background:#e224d6;color:#fff;padding:0 12px;border-radius:4px;">#REPESCAGEM</span> pra receber o link</div>'
            if comente else '')
    corpo = (selos() + f'<div style="position:absolute;left:80px;right:80px;top:330px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:34px;">'
             f'{T(titulo, 150)}{BARRA("#e224d6")}{P(linha, 38)}{pill}'
             f'<div style="font-weight:700;font-size:34px;border:2px solid rgba(255,255,255,.5);border-radius:14px;padding:16px 28px;">Link da turma: <span style="color:#f7f400;">{LINK}</span></div>'
             f'<div style="font-weight:500;font-size:28px;opacity:.85;">Oferta Black válida até 16/11, às 23h59</div></div>'
             f'<div style="position:absolute;bottom:70px;left:50%;margin-left:-110px;">{LOGO(46)}</div>')
    return tela(label, AZUL, corpo)

def grupo(gid, nome, telas):
    return (f'<div id="{gid}" style="display:flex;flex-direction:column;gap:36px;">'
            f'<div style="display:flex;align-items:center;gap:18px;color:#fff;"><span style="background:#f7f400;color:#111;font-weight:700;font-size:30px;padding:6px 16px;border-radius:6px;">{gid}</span><span style="font-size:44px;font-weight:700;">{nome}</span></div>'
            f'<div style="display:flex;gap:56px;">\n{"".join(telas)}</div></div>\n')

AMARELO = 'background:#f7f400;'
PRETO = 'background:radial-gradient(110% 80% at 70% 10%,#1a1a2e 0%,#07070f 70%);'
def logo_em(bottom=70, px=46, left='50%', ml=-110):
    return f'<div style="position:absolute;bottom:{bottom}px;left:{left};margin-left:{ml}px;">{LOGO(px)}</div>'
ICONE = '<div style="flex:none;width:64px;height:64px;border-radius:16px;background:linear-gradient(135deg,#7b2ff7,#e224d6);display:flex;align-items:center;justify-content:center;font-family:Unbounded;font-weight:900;font-size:22px;color:#fff;">VDE</div>'
def notif(txt, rot, ml):
    return (f'<div style="display:flex;gap:20px;align-items:center;background:rgba(255,255,255,.96);color:#0b1a4a;border-radius:28px;padding:22px 26px;'
            f'box-shadow:0 24px 50px rgba(60,0,60,.35);transform:rotate({rot}deg);margin-left:{ml}px;width:820px;">{ICONE}'
            f'<div style="flex:1;"><div style="display:flex;justify-content:space-between;font-size:24px;opacity:.6;font-weight:600;"><span>Método VDE</span><span>agora</span></div>'
            f'<div style="font-weight:700;font-size:34px;line-height:1.2;margin-top:4px;">{txt}</div></div></div>')

# vr1 · notificações chegando
CAPA1 = tela('vr1-01', MAG, fantasma('NOVIDADE', 'rgba(247,244,0,.22)', top=40, left=-60, px=420).replace('color:rgba(247,244,0,.22)', 'color:rgba(247,244,0,.5);filter:blur(10px)') + selos() +
    f'<div style="position:absolute;left:80px;right:80px;top:250px;">{T("TURMA DE<br>REPESCAGEM", 120)}'
    f'<div style="display:inline-block;background:#f7f400;color:#0b1a4a;{BB}font-size:136px;line-height:.9;padding:16px 22px 0;margin-top:14px;transform:rotate(-2deg);white-space:nowrap;">NOVIDADE ABSURDA</div></div>'
    f'<div style="position:absolute;left:80px;top:760px;">' + notif('Chegou novidade na <b>Turma de Repescagem</b> 👀', -2, 0) + '</div>'
    f'<div style="position:absolute;right:80px;bottom:90px;display:flex;align-items:center;gap:16px;font-weight:700;font-size:40px;">arrasta pro lado <span style="background:#0b1a4a;color:#f7f400;border-radius:50%;width:70px;height:70px;display:flex;align-items:center;justify-content:center;">→</span></div>')

# vr2 · prova da OAB 2ª fase corrigida, com "REPROVADO"
LINHAS_PROVA = ''.join(
    f'<div style="display:flex;align-items:flex-end;height:44px;border-bottom:1.5px solid #c9d2e3;">'
    f'<span style="width:44px;font-size:18px;color:#8a97b5;font-weight:700;">{i:02d}</span>'
    f'<span style="font-family:\'Caveat\',cursive;font-size:30px;color:#1d3a8a;white-space:nowrap;overflow:hidden;">{t}</span></div>'
    for i, t in enumerate(['EXCELENTÍSSIMO SENHOR DOUTOR JUIZ FEDERAL DA ... VARA', 'FEDERAL DA SEÇÃO JUDICIÁRIA DE ...', '', 'Fulano de tal, nacionalidade..., estado civil..., profissão...,', 'vem, por seu advogado, impetrar MANDADO DE SEGURANÇA', 'com pedido liminar, com fundamento no art. 5º, LXIX, da CF', 'e na Lei 12.016/2009, contra ato do ... pelos fatos', 'e fundamentos a seguir expostos.', 'I. DOS FATOS', 'O impetrante ...'], 1))
CAPA2 = tela('vr2-01', NAVY, selos() +
    f'<div style="position:absolute;left:110px;top:240px;width:820px;height:900px;background:#fbfbf7;border-radius:10px;transform:rotate(-4deg);box-shadow:0 40px 80px rgba(0,0,0,.5);padding:44px 52px;color:#0b1a4a;overflow:hidden;">'
    f'<div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #0b1a4a;padding-bottom:14px;">'
    f'<div><div style="font-weight:700;font-size:22px;letter-spacing:.12em;">EXAME DE ORDEM UNIFICADO</div><div style="font-weight:700;font-size:30px;margin-top:4px;">2ª FASE · PROVA PRÁTICO-PROFISSIONAL</div>'
    f'<div style="font-size:22px;margin-top:6px;">Área: <b>Direito Constitucional</b></div></div>'
    f'<div style="border:2px solid #0b1a4a;border-radius:8px;padding:8px 12px;text-align:center;"><div style="font-size:16px;font-weight:700;letter-spacing:.1em;">NOTA</div><div style="font-family:\'Caveat\',cursive;font-size:56px;line-height:1;color:#e5484d;">5,4</div></div></div>'
    f'<div style="font-weight:700;font-size:20px;letter-spacing:.14em;margin:16px 0 6px;color:#5a6a8f;">CADERNO DE TEXTO DEFINITIVO · PEÇA PROFISSIONAL</div>'
    f'{LINHAS_PROVA}'
    f'<div style="position:absolute;left:150px;top:470px;border:12px solid #e5484d;color:#e5484d;{BB}font-size:150px;line-height:1;padding:12px 30px 0;transform:rotate(-16deg);border-radius:16px;background:rgba(251,251,247,.6);mix-blend-mode:multiply;">REPROVADO</div></div>'
    f'<div style="position:absolute;right:50px;top:960px;width:560px;background:#f7f400;color:#0b1a4a;transform:rotate(5deg);padding:28px 34px;box-shadow:0 30px 60px rgba(0,0,0,.45);">'
    f'<div style="font-weight:700;font-size:26px;letter-spacing:.2em;">NOVIDADE PRA QUEM</div>{T("REPROVOU", 150)}'
    f'<div style="background:#e224d6;color:#fff;display:inline-block;font-weight:700;font-size:30px;padding:6px 14px;margin-top:6px;">2 cursos novos, de graça</div></div>')

# vr3 · dois balões de pensamento
def balao(txt, cor, fundo, x, y, w, rot, cauda):
    return (f'<div style="position:absolute;left:{x}px;top:{y}px;width:{w}px;transform:rotate({rot}deg);">'
            f'<div style="background:{fundo};color:{cor};border:5px solid #0b1a4a;border-radius:60px;padding:40px 46px;font-weight:700;font-size:48px;line-height:1.15;box-shadow:12px 12px 0 #0b1a4a;">{txt}</div>'
            f'<div style="position:absolute;{cauda}:90px;bottom:-56px;width:60px;height:60px;background:{fundo};border-right:5px solid #0b1a4a;border-bottom:5px solid #0b1a4a;transform:rotate(45deg) skew(10deg,10deg);"></div></div>')
CAPA3 = tela('vr3-01', CLARO, selos() +
    balao('Continuo na mesma matéria?', '#0b1a4a', '#fff', 80, 250, 560, -4, 'left') +
    balao('Ou mudo pra <span style="background:#f7f400;color:#0b1a4a;padding:0 8px;">Constitucional</span>?', '#fff', '#e224d6', 440, 470, 560, 3, 'right') +
    f'<div style="position:absolute;left:80px;right:80px;bottom:170px;color:#0b1a4a;">'
    f'<div style="font-weight:700;font-size:34px;letter-spacing:.24em;color:#0a3aa6;">REPESCAGEM · 2ª FASE</div>'
    f'{T("DEVO MUDAR<br>A MATÉRIA?", 180)}</div>' + logo_em(60, 40, 'auto', 0).replace('left:auto;margin-left:0px;', 'right:80px;'), claro=True)

# vr4 · número gigante no amarelo
CAPA4 = tela('vr4-01', AMARELO,
    f'<div style="position:absolute;right:-230px;top:-120px;{BB}font-size:1500px;line-height:1;color:transparent;-webkit-text-stroke:8px #0b1a4a;">5</div>'
    f'<div style="position:absolute;top:56px;left:80px;display:flex;flex-direction:column;gap:6px;font-weight:700;font-size:30px;"><div style="background:#0b1a4a;color:#fff;padding:2px 12px;align-self:flex-start;">@LIBERO<span style="font-weight:400;">FILHO</span></div><div style="background:#e224d6;color:#fff;padding:2px 12px;align-self:flex-start;margin-left:60px;">@NATALIA<span style="font-weight:400;">VALENCA</span></div></div>'
    f'<div style="position:absolute;left:80px;top:430px;width:620px;color:#0b1a4a;">{T("MOTIVOS PRA<br>FAZER A<br>REPESCAGEM<br>EM", 150)}'
    f'<div style="display:inline-block;background:#e224d6;color:#fff;{BB}font-size:150px;line-height:.9;padding:16px 22px 0;margin-top:14px;">CONSTITUCIONAL</div>'
    f'<div style="font-weight:700;font-size:36px;margin-top:30px;">Arrasta pro lado →</div></div>' + logo_em(60, 44, 'auto', 0).replace('left:auto;margin-left:0px;', 'right:90px;'), claro=True)

# vr5 · calendário
dias = ''.join(f'<div style="aspect-ratio:1.35;border-radius:14px;background:{"#e224d6" if i < 20 else "rgba(255,255,255,.12)"};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:28px;color:{"#fff" if i < 20 else "rgba(255,255,255,.6)"};">{"✓" if i < 20 else i + 1}</div>' for i in range(28))
CAPA5 = tela('vr5-01', AZUL, selos() +
    f'<div style="position:absolute;left:80px;right:80px;top:250px;">{T("VOCÊ TEM", 120)}'
    f'<div style="display:inline-block;background:#f7f400;color:#0b1a4a;{BB}font-size:200px;line-height:.9;padding:16px 22px 0;">MAIS TEMPO.</div>'
    f'{T("SABE USAR?", 120, "margin-top:14px;")}</div>'
    f'<div style="position:absolute;left:80px;right:80px;top:700px;background:rgba(7,22,63,.55);border-radius:30px;padding:30px;">'
    f'<div style="display:flex;justify-content:space-between;font-weight:700;font-size:28px;letter-spacing:.2em;margin-bottom:20px;"><span>CRONOGRAMA DA REPESCAGEM</span><span style="color:#f7f400;">20/28 DIAS</span></div>'
    f'<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:12px;">{dias}</div></div>')

# vr6 · cupom Black
CAPA6 = tela('vr6', PRETO,
    f'<div style="position:absolute;top:120px;left:-40px;right:-40px;text-align:center;{BB}font-size:520px;line-height:.85;color:#f7f400;filter:blur(16px);opacity:.55;">BLACK</div>' + selos() +
    f'<div style="position:absolute;left:110px;right:110px;top:400px;background:#fff;color:#0b1a4a;border-radius:30px;padding:60px 60px 50px;box-shadow:0 40px 90px rgba(0,0,0,.6);">'
    f'<div style="position:absolute;left:-30px;top:330px;width:60px;height:60px;border-radius:50%;background:#07070f;"></div><div style="position:absolute;right:-30px;top:330px;width:60px;height:60px;border-radius:50%;background:#07070f;"></div>'
    f'<div style="font-weight:700;font-size:28px;letter-spacing:.3em;color:#e224d6;">MÉTODO VDE · OAB</div>{T("REPESCAGEM<br>CONSTITUCIONAL", 150, "margin-top:10px;")}'
    f'<div style="border-top:5px dashed #c9d2e3;margin:46px -10px 34px;"></div>'
    f'<div style="font-weight:700;font-size:34px;line-height:1.3;">10 simulados inéditos · encontros ao vivo · plano de recuperação · 2 minicursos extras</div>'
    f'<div style="display:flex;align-items:center;justify-content:space-between;margin-top:34px;"><div style="background:#0b1a4a;color:#fff;border-radius:999px;padding:16px 30px;font-weight:700;font-size:32px;">até <span style="color:#f7f400;">16/11, 23h59</span></div><div style="font-weight:700;font-size:28px;color:#0a3aa6;">{LINK}</div></div></div>'
    + logo_em(60, 44))

def cta2(label, fundo, titulo, linha, extra, claro=False):
    cor = '#0b1a4a' if claro else '#fff'
    corpo = (selos() + f'<div style="position:absolute;left:80px;right:80px;top:300px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:34px;color:{cor};">'
             f'{T(titulo, 150)}{BARRA("#e224d6" if not claro else "#0b1a4a")}{P(linha, 38)}{extra}'
             f'<div style="font-weight:700;font-size:32px;">{LINK}</div><div style="font-weight:500;font-size:28px;opacity:.8;">Oferta Black até 16/11, às 23h59</div></div>' + logo_em(70, 46))
    return tela(label, fundo, corpo, claro=claro)
PILL = lambda bg, fg, txt: f'<div style="background:{bg};color:{fg};border-radius:999px;padding:22px 44px;font-weight:700;font-size:38px;">{txt}</div>'

G = []

# ---------- 3a · Benefícios da Turma de Repescagem ----------
G.append(grupo('vr1', 'Carrossel · Benefícios da Turma de Repescagem (Método VDE)', [
    CAPA1,
    tela('vr1-02', MAG, fantasma('NOVO', 'rgba(120,0,120,.16)', top=-40, px=620) + arrobas() + bloco(
        KICK('O QUE CHEGOU AGORA') + T('5 NOVIDADES<br>DA REPESCAGEM', 128) + BARRA() +
        lista(['Maior tempo de acesso', '10 simulados inéditos', 'Novas questões', 'Plano de recuperação', 'Encontros exclusivos ao vivo'], px=44),
        top=230, gap=34)),
    tela('vr1-03', AZUL, arrobas() + bloco(
        KICK('E CONTINUA TENDO') + T(f'ALÉM DO QUE<br>VOCÊ {MARCA("JÁ CONHECE")}', 124) + BARRA('#e224d6') +
        lista(['Aulas completas de direito material e processo', 'Esqueletos de peças', 'Material de apoio pra cada aula', 'Treinos de peças e questões',
               'Aulas e materiais de revisão', 'Suporte para dúvidas na plataforma', 'Oficinas de peças e questões'], num=False, px=34, gap=20),
        top=210, gap=30)),
    tela('vr1-04', NAVY, fantasma('CRONOGRAMA', 'rgba(247,244,0,.07)', top=860, left=-40, px=470) + arrobas() + bloco(
        P('Além de muitos outros recursos.', 44) + T(f'E TUDO<br>ORGANIZADO<br>EM UM {MARCA("CRONOGRAMA")}<br>TOP.', 150) + BARRA() +
        P('Você abre a plataforma e já sabe o que estudar no dia. Sem perder tempo montando plano.', 36, 'max-width:780px;'),
        top=250, gap=34)),
    tela('vr1-05', MAG, arrobas() + bloco(
        f'<div style="align-self:flex-start;background:#f7f400;color:#0b1a4a;font-weight:700;font-size:30px;letter-spacing:.2em;padding:8px 18px;">MINICURSO EXTRA 01</div>' +
        T('APROFUNDAMENTO<br>NA REPESCAGEM', 134) + BARRA('#0b1a4a') + P('Aulas sobre:', 36) +
        lista(['Resolvendo a dificuldade na interpretação', 'Encontrando respostas com o índice remissivo', 'Resolução de questões difíceis', 'Guia de identificação de peças + casos difíceis pra identificar'], px=36, cor_num='#0b1a4a', gap=24),
        top=210, gap=30)),
    tela('vr1-06', AZUL, arrobas() + bloco(
        f'<div style="align-self:flex-start;background:#e224d6;color:#fff;font-weight:700;font-size:30px;letter-spacing:.2em;padding:8px 18px;">MINICURSO EXTRA 02</div>' +
        T(f'HACKEANDO<br>A {MARCA("REPESCAGEM", "#f7f400", "#0b1a4a")}', 140) + BARRA('#e224d6') + P('Aulas sobre:', 36) +
        lista(['Análise da banca: dados e estatísticas sobre o que mais cai', 'Teses mais cobradas na peça', 'Argumentos que mais aparecem nas questões', 'O modelo CORINGA das questões'], px=36, gap=24),
        top=210, gap=30)),
    tela('vr1-07', CLARO, arrobas(True) + bloco(
        P('Os dois minicursos vêm junto com a turma.', 44, 'color:#0a3aa6;') +
        T(f'E SEM PAGAR<br>{MARCA("A MAIS")} POR<br>ESSES DOIS<br>CURSOS.', 170, 'color:#0b1a4a;') + BARRA('#f7f400', 160) +
        P('Quem entra na Turma de Repescagem recebe o Aprofundamento e o Hackeando a Repescagem sem custo extra.', 36, 'color:#0b1a4a;max-width:820px;'),
        top=250, gap=34), claro=True),
    cta('vr1-08', 'QUER O LINK?', 'Garanta sua vaga na Turma de Repescagem do Método VDE com tudo isso incluído.'),
]))

# ---------- 3b · Novidade pra quem reprovou ----------
# Emblemas dos dois cursos novos (um símbolo por curso).
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

def mapa(linhas, cor_seta='#e224d6', claro=True):
    cor = '#0b1a4a' if claro else '#fff'
    fundo = '#fff' if claro else 'rgba(255,255,255,.08)'
    return '<div style="display:flex;flex-direction:column;gap:18px;">' + ''.join(
        f'<div style="display:grid;grid-template-columns:1fr 60px 1fr;align-items:center;gap:10px;background:{fundo};border-radius:20px;padding:22px 26px;box-shadow:0 10px 24px rgba(11,26,74,.08);color:{cor};">'
        f'<div style="font-size:31px;line-height:1.25;">{a}</div><div style="{BB}font-size:60px;color:{cor_seta};text-align:center;">→</div>'
        f'<div style="font-weight:700;font-size:31px;line-height:1.25;">{b}</div></div>' for a, b in linhas) + '</div>'

G.append(grupo('vr2', 'Carrossel · Novidade pra quem reprovou: novos cursos', [
    CAPA2,
    tela('vr2-02', NAVY, arrobas() + bloco(
        T(f'REPROVAR NÃO É<br>{MARCA("COMEÇAR DO ZERO")}', 130) + BARRA() +
        P('Você já estudou a matéria e já sabe montar uma peça. Na repescagem, o que falta é ajuste fino: ler melhor o enunciado, achar a resposta mais rápido e saber o que a banca mais cobra.', 38, 'max-width:840px;') +
        P('Foi pensando nisso que criamos dois cursos novos.', 38, 'color:#f7f400;'),
        top=290, gap=36)),
    tela('vr2-03', NAVY, arrobas() +
        f'<div style="position:absolute;left:80px;right:80px;top:200px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:26px;">'
        f'{KICK("SÓ NO MÉTODO VDE")}{T(f"ISSO VOCÊ NÃO<br>ENCONTRA EM<br>{MARCA('OUTRO CURSO')}", 140)}'
        f'<div style="display:flex;gap:70px;margin-top:30px;">{EMB1(250, -4)}{EMB2(250, 4)}</div>'
        f'{P("Dois cursos criados só pra repescagem: pra quem já fez a 2ª fase e precisa de ajuste fino, não de começar tudo de novo.", 34, "max-width:860px;margin-top:20px;")}</div>'),
    tela('vr2-04', MAG, arrobas() + f'<div style="position:absolute;right:60px;top:110px;">{EMB1(290, 6)}</div>' + bloco(
        KICK('CURSO NOVO 01', '#0b1a4a') + T('APROFUNDAMENTO<br>NA REPESCAGEM', 120) + BARRA('#0b1a4a') +
        P('Aulas sobre:', 36) +
        lista(['Resolvendo a dificuldade na interpretação', 'Encontrando respostas com o índice remissivo', 'Resolução de questões difíceis', 'Guia de identificação de peças + casos difíceis pra identificar'], num=True, px=34, cor_num='#f7f400', gap=20),
        top=400, gap=26)),
    tela('vr2-05', CLARO, arrobas(True) + bloco(
        KICK('APROFUNDAMENTO · POR QUE IMPORTA', '#e224d6') + T(f'CADA AULA RESOLVE<br>UM {MARCA("ERRO DE PROVA", "#f7f400", "#0b1a4a")}', 112, 'color:#0b1a4a;') +
        P('Se na prova você… → a aula que resolve:', 32, 'color:#0a3aa6;') +
        mapa([('Leu e não entendeu o que o enunciado pedia', 'Resolvendo a dificuldade na interpretação'),
              ('Sabia o assunto, mas não achou o artigo', 'Encontrando respostas com o índice remissivo'),
              ('Travou nas questões mais difíceis', 'Resolução de questões difíceis'),
              ('Errou ou ficou em dúvida na peça', 'Guia de identificação de peças')]),
        top=220, gap=26), claro=True),
    tela('vr2-06', AZUL, arrobas() + f'<div style="position:absolute;right:60px;top:110px;">{EMB2(290, -6)}</div>' + bloco(
        KICK('CURSO NOVO 02') + T(f'HACKEANDO<br>A {MARCA("REPESCAGEM")}', 136) + BARRA('#e224d6') +
        P('Aulas sobre:', 36) +
        lista(['Análise da banca: dados e estatísticas sobre o que mais cai', 'Teses mais cobradas na peça', 'Argumentos que mais aparecem nas questões', 'O modelo CORINGA das questões'], num=True, px=34, gap=20),
        top=400, gap=26)),
    tela('vr2-07', NAVY, arrobas() + bloco(
        KICK('HACKEANDO · POR QUE IMPORTA') + T(f'ESTUDAR PRIMEIRO<br>O QUE {MARCA("MAIS CAI")}', 124) +
        mapa([('Análise da banca', 'Você vê onde a prova costuma se concentrar'),
              ('Teses mais cobradas na peça', 'Você chega com as teses mais pedidas na cabeça'),
              ('Argumentos que mais aparecem', 'Respostas mais completas nas questões'),
              ('O modelo CORINGA', 'Um caminho pra montar a resposta das questões')], '#f7f400', claro=False),
        top=220, gap=34)),
    tela('vr2-08', CLARO, arrobas(True) + f'<div style="position:absolute;right:60px;bottom:150px;display:flex;gap:20px;">{EMB1(240, -6)}{EMB2(240, 6)}</div>' + bloco(
        P('E o melhor:', 48, 'color:#0a3aa6;') +
        T(f'É DE {MARCA("GRAÇA")}<br>E EXCLUSIVO.', 180, 'color:#0b1a4a;') + BARRA('#f7f400', 160) +
        P('Os dois cursos são só pra quem entrar no VDE Repescagem de Direito Constitucional. Sem pagar a mais.', 40, 'color:#0b1a4a;max-width:820px;'),
        top=230, gap=36), claro=True),
    cta2('vr2-09', MAG, 'SEGUNDA CHANCE,<br>NOVO PLANO.', 'Entre no VDE Repescagem Constitucional e leve os dois cursos novos de graça.', PILL('#0b1a4a', '#fff', 'Comente <span style="background:#f7f400;color:#0b1a4a;padding:0 12px;">#REPESCAGEM</span>')),
]))

# ---------- 3c · Devo mudar a matéria na repescagem? ----------
G.append(grupo('vr3', 'Carrossel · Devo mudar a matéria na repescagem?', [
    CAPA3,
    tela('vr3-02', NAVY, arrobas() + bloco(
        T(f'DEPENDE.<br>E TÁ TUDO {MARCA("BEM")}<br>MUDAR.', 150) + BARRA() +
        P('Se você não se identifica mais com a matéria, está cansado dela ou sente que travou, mudar pode ser uma ótima decisão.', 40, 'max-width:840px;'),
        top=320, gap=36)),
    tela('vr3-03', MAG, arrobas() + bloco(
        KICK('SINAIS DE QUE VALE MUDAR', '#0b1a4a') + T('VOCÊ SE<br>RECONHECE AQUI?', 140) + BARRA('#0b1a4a') +
        lista(['Abrir o material da matéria já dá desânimo', 'Você não se identifica mais com ela', 'Estuda, estuda e trava sempre nos mesmos pontos', 'O cansaço já pesa mais que a vontade de continuar'], px=40, cor_num='#f7f400', gap=30),
        top=250, gap=34)),
    tela('vr3-04', AZUL, fantasma('CF', 'rgba(255,255,255,.06)', top=-120, left=500, px=1100) + arrobas() + bloco(
        P('Se for mudar, olha essa opção:', 42, 'color:#f7f400;') + T(f'POR QUE<br>{MARCA("CONSTITUCIONAL")}?', 126) + BARRA('#e224d6') +
        lista(['É a matéria que menos muda: a Constituição é uma só', 'As peças seguem estruturas que se repetem', 'Os temas giram em torno do mesmo texto, a CF'], num=False, px=38, gap=26),
        top=270, gap=32)),
    tela('vr3-05', MAG, fantasma('40', 'rgba(120,0,120,.2)', top=-60, left=380, px=1300) + arrobas() + bloco(
        P('Um dado que anima:', 44) + T(f'MUITA GENTE<br>PASSA COM<br>{MARCA("40 DIAS", "#f7f400", "#0b1a4a")} DE<br>PREPARAÇÃO.', 150) + BARRA('#0b1a4a') +
        P('Em Constitucional, com método e foco no que cai, dá pra chegar pronto em pouco tempo.', 38, 'max-width:820px;'),
        top=250, gap=32)),
    tela('vr3-06', NAVY, arrobas() + bloco(
        T(f'AGORA IMAGINA<br>COM O {MARCA("DOBRO")}<br>DO TEMPO.', 160) + BARRA() +
        P('A repescagem tem mais tempo de estudo do que a preparação regular. É tempo pra aprender a matéria nova com calma, treinar peças e fazer simulados.', 38, 'max-width:840px;'),
        top=300, gap=36)),
    tela('vr3-07', CLARO, arrobas(True) + bloco(
        P('No VDE Repescagem Constitucional:', 42, 'color:#0a3aa6;') +
        lista(['Aulas completas de direito material e processo', 'Cronograma pronto pra todo o período', '10 simulados inéditos', 'Encontros exclusivos ao vivo', '2 minicursos extras sem pagar a mais'], num=False, px=40, cor_num='#e224d6', gap=26) +
        T(f'DÁ PRA {MARCA("MUDAR", "#f7f400", "#0b1a4a")} E<br>CHEGAR PRONTO.', 130, 'color:#0b1a4a;'),
        top=230, gap=40), claro=True),
    cta2('vr3-08', CLARO, 'E AÍ, VAI<br>MUDAR?', 'Comenta CONST se você vem pra Constitucional na repescagem.', '<div style="display:flex;gap:20px;">' + PILL('#e224d6', '#fff', 'CONST') + PILL('#fff', '#0b1a4a', 'Fico na minha') + '</div>', claro=True),
]))

# ---------- 3d · 5 motivos pra fazer a repescagem em Constitucional ----------
motivos = [
    ('A MATÉRIA QUE<br>MENOS MUDA', 'Enquanto outras matérias ganham lei nova todo ano, em Constitucional o texto-base é a Constituição. O que você estuda hoje continua valendo na prova.', MAG),
    ('PEÇAS COM<br>ESTRUTURA CLARA', 'Mandado de segurança, habeas corpus, ação popular, ADI… cada peça tem cabimento e estrutura bem definidos. Aprendeu o esqueleto, aplica em qualquer caso.', AZUL),
    ('TUDO GIRA EM<br>TORNO DA CF', 'Na prova, a resposta quase sempre está na Constituição ou em uma lei ligada a ela. Com o índice remissivo bem usado, você acha o artigo rápido.', NAVY),
    ('MAIS TEMPO<br>PRA SE PREPARAR', 'A repescagem dá mais tempo de estudo. Dá pra aprender a matéria nova, treinar peças e ainda revisar com calma.', MAG),
    ('UM MÉTODO QUE<br>JÁ APROVOU<br>+110 MIL', 'No Método VDE você tem cronograma pronto, simulados inéditos, encontros ao vivo e suporte pra dúvidas. Você só segue.', AZUL),
]
telas = [CAPA4]
for i, (t, txt, fundo) in enumerate(motivos, 2):
    telas.append(tela(f'vr4-{i:02d}', fundo, fantasma(f'{i - 1})', 'rgba(255,255,255,.07)' if fundo != MAG else 'rgba(120,0,120,.16)', top=-60, left=10, px=1400) + arrobas() + bloco(
        KICK(f'MOTIVO {i - 1:02d}', '#f7f400' if fundo != MAG else '#0b1a4a') + T(t, 150) + BARRA('#f7f400' if fundo != MAG else '#0b1a4a') + P(txt, 40, 'max-width:820px;'),
        top=340, left=150, right=110, gap=32)))
telas.append(cta2('vr4-07', AMARELO, 'QUAL MOTIVO<br>TE CONVENCEU?', 'Conta nos comentários e garanta a sua vaga na Turma de Repescagem do Método VDE.', PILL('#0b1a4a', '#fff', 'Comente <span style="background:#e224d6;padding:0 12px;">#REPESCAGEM</span>'), claro=True))
G.append(grupo('vr4', 'Carrossel · 5 motivos pra fazer a repescagem em Constitucional', telas))

# ---------- 3e · O que fazer com o tempo a mais da repescagem ----------
G.append(grupo('vr5', 'Carrossel · Como usar o tempo a mais da repescagem', [
    CAPA5,
    tela('vr5-02', NAVY, arrobas() + bloco(
        T(f'TEMPO A MAIS<br>SEM PLANO<br>VIRA {MARCA("TEMPO PERDIDO")}', 140) + BARRA() +
        P('O erro mais comum na repescagem é achar que dá pra deixar pra depois. Quando vê, a prova chegou e a matéria ficou pela metade.', 38, 'max-width:840px;'),
        top=300, gap=36)),
    tela('vr5-03', MAG, fantasma('1', 'rgba(120,0,120,.16)', top=-80, left=600, px=1500) + arrobas() + bloco(
        KICK('PASSO 01', '#0b1a4a') + T('ENTENDA ONDE<br>VOCÊ PERDEU<br>PONTOS', 150) + BARRA('#0b1a4a') +
        P('Peça errada? Fundamentação fraca? Tempo? O plano de recuperação começa olhando pra sua última prova.', 40, 'max-width:800px;'),
        top=380, gap=32)),
    tela('vr5-04', AZUL, fantasma('2', 'rgba(255,255,255,.06)', top=-80, left=600, px=1500) + arrobas() + bloco(
        KICK('PASSO 02') + T(f'SIGA UM<br>{MARCA("CRONOGRAMA")}', 160) + BARRA('#e224d6') +
        P('Aulas, treinos e revisão distribuídos semana a semana até a prova. Você não decide o que estudar, você estuda.', 40, 'max-width:800px;'),
        top=380, gap=32)),
    tela('vr5-05', NAVY, fantasma('3', 'rgba(247,244,0,.06)', top=-80, left=600, px=1500) + arrobas() + bloco(
        KICK('PASSO 03') + T('TREINE PEÇA<br>E QUESTÃO<br>TODA SEMANA', 150) + BARRA() +
        P('Treinos de peças e questões, oficinas e os 10 simulados inéditos da turma. Prova se aprende fazendo prova.', 40, 'max-width:800px;'),
        top=380, gap=32)),
    tela('vr5-06', MAG, fantasma('4', 'rgba(120,0,120,.16)', top=-80, left=600, px=1500) + arrobas() + bloco(
        KICK('PASSO 04', '#0b1a4a') + T('NÃO ESTUDE<br>SOZINHO', 170) + BARRA('#0b1a4a') +
        P('Encontros exclusivos ao vivo e suporte pra dúvidas na plataforma. Dúvida tirada na hora não vira erro no dia da prova.', 40, 'max-width:800px;'),
        top=380, gap=32)),
    cta2('vr5-07', NAVY, 'O PLANO JÁ<br>ESTÁ PRONTO.', 'A Turma de Repescagem do Método VDE já vem com o plano de recuperação, o cronograma e os simulados.', PILL('#f7f400', '#0b1a4a', 'Comente <span style="background:#e224d6;color:#fff;padding:0 12px;">#REPESCAGEM</span>')),
]))

# ---------- 3f · Tela única: oferta Black ----------
G.append(grupo('vr6', 'Tela única · Repescagem Constitucional, oferta Black', [
    CAPA6,
]))


bloco_html = INI + '\n<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap" rel="stylesheet">\n' + ''.join(G) + FIM
s = KIT.read_text()
if INI in s:
    s = re.sub(re.escape(INI) + '.*?' + re.escape(FIM), lambda m: bloco_html, s, flags=re.S)
else:
    s = s.replace('</section>\n</x-dc>', bloco_html + '\n</section>\n</x-dc>')
KIT.write_text(s)
print('ok', s.count('data-screen-label="vr'))
