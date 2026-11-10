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

G = []

# ---------- 3a · Benefícios da Turma de Repescagem ----------
G.append(grupo('vr1', 'Carrossel · Benefícios da Turma de Repescagem (Método VDE)', [
    capa('vr1-01', 'MÉTODO VDE · OAB', 'Turma de Repescagem', 'NOVIDADE ABSURDA', 'Tudo o que vem nessa turma'),
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
G.append(grupo('vr2', 'Carrossel · Novidade pra quem reprovou: novos cursos', [
    capa('vr2-01', 'REPESCAGEM · CONSTITUCIONAL', 'Reprovou na 2ª fase?', 'NOVIDADE PRA QUEM REPROVOU', '2 cursos novos pra você'),
    tela('vr2-02', NAVY, arrobas() + bloco(
        T(f'REPROVAR NÃO É<br>{MARCA("COMEÇAR DO ZERO")}', 130) + BARRA() +
        P('Você já estudou a matéria e já sabe montar uma peça. Na repescagem, o que falta é ajuste fino: ler melhor o enunciado, achar a resposta mais rápido e saber o que a banca mais cobra.', 38, 'max-width:840px;') +
        P('Foi pensando nisso que criamos dois cursos novos.', 38, 'color:#f7f400;'),
        top=290, gap=36)),
    tela('vr2-03', MAG, fantasma('01', 'rgba(120,0,120,.18)', top=-60, left=560, px=900) + arrobas() + bloco(
        KICK('CURSO NOVO 01', '#0b1a4a') + T('APROFUNDAMENTO<br>NA REPESCAGEM', 128) + BARRA('#0b1a4a') +
        P('Ataca os pontos em que mais se perde nota:', 36) +
        lista(['Interpretação do enunciado', 'Uso do índice remissivo pra achar a resposta', 'Questões difíceis resolvidas passo a passo', 'Identificação de peças, com os casos mais difíceis'], num=False, px=40, cor_num='#f7f400', gap=26),
        top=300, gap=32)),
    tela('vr2-04', AZUL, fantasma('02', 'rgba(255,255,255,.06)', top=-60, left=560, px=900) + arrobas() + bloco(
        KICK('CURSO NOVO 02') + T(f'HACKEANDO<br>A {MARCA("REPESCAGEM")}', 136) + BARRA('#e224d6') +
        P('Pra estudar primeiro o que mais aparece na prova:', 36) +
        lista(['Análise da banca com dados e estatísticas', 'Teses mais cobradas na peça', 'Argumentos que mais aparecem nas questões', 'O modelo CORINGA das questões'], num=False, px=40, gap=26),
        top=300, gap=32)),
    tela('vr2-05', CLARO, arrobas(True) + bloco(
        P('E o melhor:', 48, 'color:#0a3aa6;') +
        T(f'É DE {MARCA("GRAÇA")}<br>E EXCLUSIVO.', 180, 'color:#0b1a4a;') + BARRA('#f7f400', 160) +
        P('Os dois cursos são só pra quem entrar no VDE Repescagem de Direito Constitucional.', 40, 'color:#0b1a4a;max-width:820px;'),
        top=300, gap=36), claro=True),
    cta('vr2-06', 'BORA PRA APROVAÇÃO?', 'Entre no VDE Repescagem Constitucional e leve os dois cursos novos de graça.'),
]))

# ---------- 3c · Devo mudar a matéria na repescagem? ----------
G.append(grupo('vr3', 'Carrossel · Devo mudar a matéria na repescagem?', [
    capa('vr3-01', 'REPESCAGEM · 2ª FASE', 'A pergunta que todo mundo faz:', 'DEVO MUDAR A MATÉRIA?', 'Na repescagem'),
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
    cta('vr3-08', 'VEM PRA CONSTITUCIONAL', 'Mudar de matéria na repescagem pode ser a virada que faltava.'),
]))

# ---------- 3d · 5 motivos pra fazer a repescagem em Constitucional ----------
motivos = [
    ('A MATÉRIA QUE<br>MENOS MUDA', 'Enquanto outras matérias ganham lei nova todo ano, em Constitucional o texto-base é a Constituição. O que você estuda hoje continua valendo na prova.', MAG),
    ('PEÇAS COM<br>ESTRUTURA CLARA', 'Mandado de segurança, habeas corpus, ação popular, ADI… cada peça tem cabimento e estrutura bem definidos. Aprendeu o esqueleto, aplica em qualquer caso.', AZUL),
    ('TUDO GIRA EM<br>TORNO DA CF', 'Na prova, a resposta quase sempre está na Constituição ou em uma lei ligada a ela. Com o índice remissivo bem usado, você acha o artigo rápido.', NAVY),
    ('MAIS TEMPO<br>PRA SE PREPARAR', 'A repescagem dá mais tempo de estudo. Dá pra aprender a matéria nova, treinar peças e ainda revisar com calma.', MAG),
    ('UM MÉTODO QUE<br>JÁ APROVOU<br>+110 MIL', 'No Método VDE você tem cronograma pronto, simulados inéditos, encontros ao vivo e suporte pra dúvidas. Você só segue.', AZUL),
]
telas = [capa('vr4-01', 'REPESCAGEM · CONSTITUCIONAL', 'Ainda em dúvida?', '5 MOTIVOS PRA IR DE CONSTITUCIONAL', 'Na repescagem da 2ª fase')]
for i, (t, txt, fundo) in enumerate(motivos, 2):
    telas.append(tela(f'vr4-{i:02d}', fundo, fantasma(f'{i - 1})', 'rgba(255,255,255,.07)' if fundo != MAG else 'rgba(120,0,120,.16)', top=-60, left=10, px=1400) + arrobas() + bloco(
        KICK(f'MOTIVO {i - 1:02d}', '#f7f400' if fundo != MAG else '#0b1a4a') + T(t, 150) + BARRA('#f7f400' if fundo != MAG else '#0b1a4a') + P(txt, 40, 'max-width:820px;'),
        top=340, left=150, right=110, gap=32)))
telas.append(cta('vr4-07', 'BORA DE CONSTITUCIONAL?', 'Turma de Repescagem do Método VDE com 2 minicursos extras sem pagar a mais.'))
G.append(grupo('vr4', 'Carrossel · 5 motivos pra fazer a repescagem em Constitucional', telas))

# ---------- 3e · O que fazer com o tempo a mais da repescagem ----------
G.append(grupo('vr5', 'Carrossel · Como usar o tempo a mais da repescagem', [
    capa('vr5-01', 'REPESCAGEM · 2ª FASE', 'Você tem mais tempo agora.', 'COMO USAR O TEMPO A MAIS', 'Sem desperdiçar nenhuma semana'),
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
    cta('vr5-07', 'TUDO ISSO NO VDE', 'A Turma de Repescagem do Método VDE já vem com o plano, o cronograma e os simulados.'),
]))

# ---------- 3f · Tela única: oferta Black ----------
G.append(grupo('vr6', 'Tela única · Repescagem Constitucional, oferta Black', [
    tela('vr6', CLARO, selos() +
         f'<div style="position:absolute;left:0;right:0;top:330px;display:flex;flex-direction:column;align-items:center;text-align:center;color:#0b1a4a;">'
         f'<div style="display:flex;align-items:center;gap:18px;font-weight:700;font-size:28px;letter-spacing:.32em;color:#0a3aa0;"><span style="width:56px;height:3px;background:#0a3aa0;"></span><span style="margin-right:-.32em;">MÉTODO VDE · OAB</span><span style="width:56px;height:3px;background:#0a3aa0;"></span></div>'
         f'<div style="position:relative;{BB}font-size:196px;line-height:.9;margin-top:22px;"><span style="position:absolute;left:-14px;right:-14px;bottom:.14em;height:.24em;background:#f7f400;"></span><span style="position:relative;">REPESCAGEM</span></div>'
         f'<div style="background:#e224d6;color:#fff;{BB}font-size:80px;line-height:1;padding:12px 26px 2px;margin-top:22px;border-radius:6px;">DIREITO CONSTITUCIONAL</div>'
         f'<div style="font-weight:700;font-size:38px;line-height:1.3;margin-top:40px;max-width:820px;">10 simulados inéditos, encontros ao vivo, plano de recuperação e 2 minicursos extras sem pagar a mais</div>'
         f'<div style="background:#0b1a4a;color:#fff;border-radius:999px;padding:22px 44px;font-weight:700;font-size:38px;margin-top:50px;box-shadow:0 18px 40px rgba(11,26,74,.22);">Oferta Black até <span style="background:#f7f400;color:#0b1a4a;padding:0 12px;border-radius:4px;">16/11, às 23h59</span></div>'
         f'<div style="font-weight:700;font-size:32px;margin-top:28px;color:#0a3aa0;">{LINK}</div></div>'
         f'<div style="position:absolute;bottom:60px;left:50%;margin-left:-110px;">{LOGO(46)}</div>', claro=True),
]))

# ---------- vr7 · Vai fazer a repescagem? Primeiro descubra o que deu errado ----------
diag = [
    ('ERROU A<br>PEÇA?', 'Peça inadequada leva <b>nota zero</b> na peça. Se foi isso, o seu foco é identificação: treinar casos e saber o cabimento de cada ação.', MAG),
    ('PERDEU PONTOS<br>NA ESTRUTURA?', 'Acertou a peça, mas faltou endereçamento, qualificação, cabimento ou algum pedido. Isso se resolve com <b>esqueleto treinado</b> até sair no automático.', AZUL),
    ('FUNDAMENTOU<br>POUCO?', 'Citou o artigo e não explicou como ele resolve o caso. A banca pontua a <b>aplicação ao caso concreto</b>, não só a menção à lei.', NAVY),
    ('AS QUESTÕES<br>TE DERRUBARAM?', 'Resposta curta, sem fundamento ou sem responder o que foi perguntado. Cada item tem a sua pontuação: resposta direta + fundamento + aplicação.', MAG),
    ('FALTOU TEMPO<br>OU VADE?', 'Não terminou a prova ou demorou pra achar o artigo. Aqui o treino é de <b>simulado cronometrado</b> e de índice remissivo.', AZUL),
]
telas = [capa('vr7-01', 'REPESCAGEM · 2ª FASE', 'Vai fazer a repescagem?', 'PRIMEIRO, DESCUBRA O QUE DEU ERRADO', 'Antes de estudar de novo')]
telas.append(tela('vr7-02', NAVY, arrobas() + bloco(
    T(f'ESTUDAR TUDO<br>DE NOVO {MARCA("NÃO")}<br>É O PLANO.', 150) + BARRA() +
    P('Se você repetir a mesma preparação, a chance é de repetir o mesmo resultado. O primeiro passo é abrir a sua prova e entender onde a nota ficou.', 38, 'max-width:840px;') +
    P('Separe: a sua prova, o padrão de resposta da FGV e a sua nota em cada item.', 38, 'color:#f7f400;max-width:840px;'),
    top=280, gap=36)))
for i, (t, txt, fundo) in enumerate(diag, 3):
    k = i - 2
    telas.append(tela(f'vr7-{i:02d}', fundo, fantasma(f'{k}', 'rgba(255,255,255,.07)' if fundo != MAG else 'rgba(120,0,120,.16)', top=-80, left=600, px=1500) + arrobas() + bloco(
        KICK(f'DIAGNÓSTICO {k:02d}', '#f7f400' if fundo != MAG else '#0b1a4a') + T(t, 150) + BARRA('#f7f400' if fundo != MAG else '#0b1a4a') + P(txt, 40, 'max-width:820px;'),
        top=340, gap=32)))
tab = ''.join(f'<div style="display:grid;grid-template-columns:1.4fr 1fr 1fr;border-top:2px solid rgba(11,26,74,.15);font-weight:700;font-size:36px;padding:16px 0;"><span>{a}</span><span style="color:#0a3aa6;">{b}</span><span style="border-bottom:3px solid #0b1a4a;margin:0 30px 6px 0;"></span></div>' for a, b in [('Peça', '5,00'), ('Questão 1', '1,25'), ('Questão 2', '1,25'), ('Questão 3', '1,25'), ('Questão 4', '1,25')])
telas.append(tela('vr7-08', CLARO, arrobas(True) + bloco(
    KICK('FAÇA ESSA CONTA', '#0a3aa6') + T(f'ONDE FICOU<br>{MARCA("A SUA NOTA")}?', 130, 'color:#0b1a4a;') +
    f'<div style="display:grid;grid-template-columns:1.4fr 1fr 1fr;font-weight:700;font-size:26px;letter-spacing:.14em;color:#e224d6;"><span>PARTE</span><span>VALE</span><span>VOCÊ FEZ</span></div>{tab}' +
    P('Pra aprovar: <b>6,00</b> de 10. O que tirou mais pontos de você é por onde o estudo começa.', 36, 'color:#0b1a4a;max-width:860px;'),
    top=220, gap=26), claro=True))
telas.append(cta('vr7-09', 'DIAGNÓSTICO FEITO?', 'Na Turma de Repescagem do Método VDE tem plano de recuperação, cronograma e 10 simulados inéditos.'))
G.append(grupo('vr7', 'Carrossel · Vai fazer a repescagem? Primeiro descubra o que deu errado', telas))

# ---------- vr8 · Voto distrital misto: o que mudaria na eleição pro Congresso ----------
def selo_fonte(txt):
    return f'<div style="position:absolute;left:110px;right:110px;bottom:120px;font-weight:500;font-size:24px;opacity:.75;">{txt}</div>'
G.append(grupo('vr8', 'Carrossel · Voto distrital misto: o que mudaria na eleição pro Congresso', [
    capa('vr8-01', 'REFORMA ELEITORAL · PEC', 'Proposta de Hugo Motta', 'VOTO DISTRITAL MISTO', 'O que mudaria na eleição pro Congresso', ghost='PEC'),
    tela('vr8-02', NAVY, arrobas() + bloco(
        KICK('COMO É HOJE') + T(f'VOCÊ VOTA EM<br>{MARCA("UM NOME")}', 150) + BARRA() +
        P('Pra deputado, o Brasil usa o <b>sistema proporcional de lista aberta</b> (art. 45 da CF).', 40, 'max-width:840px;') +
        P('Os votos de todos os candidatos de um partido são somados, as cadeiras são divididas entre os partidos e entram os mais votados de cada um. Por isso existe o "puxador de votos".', 36, 'max-width:840px;'),
        top=280, gap=34)),
    tela('vr8-03', MAG, fantasma('MAPA', 'rgba(120,0,120,.16)', top=860, px=560) + arrobas() + bloco(
        KICK('O QUE É DISTRITAL', '#0b1a4a') + T('O ESTADO VIRA<br>VÁRIOS DISTRITOS', 140) + BARRA('#0b1a4a') +
        P('Cada distrito é uma região com população parecida. Em cada um, <b>quem tiver mais votos leva a vaga</b>, como numa eleição de prefeito.', 40, 'max-width:820px;') +
        P('Você passa a saber exatamente quem é o deputado da sua região.', 38, 'max-width:820px;'),
        top=280, gap=34)),
    tela('vr8-04', AZUL, arrobas() + bloco(
        KICK('E O "MISTO"?') + T(f'METADE DISTRITO,<br>METADE {MARCA("LISTA")}', 136) + BARRA('#e224d6') +
        lista(['<b>50%</b> das cadeiras: os mais votados em cada distrito', '<b>50%</b> das cadeiras: divididas pelos votos dos partidos', 'Nessa metade, entra quem está no topo da <b>lista</b> que o partido montou antes da eleição'], num=False, px=40, gap=28),
        top=280, gap=34)),
    tela('vr8-05', NAVY, arrobas() + bloco(
        KICK('A PROPOSTA') + T(f'O QUE {MARCA("HUGO MOTTA")}<br>ESTÁ ARTICULANDO', 128) + BARRA() +
        lista(['28/10: Motta anuncia que quer votar uma PEC do distrital misto ainda em 2026', '9/11: o PSD apresenta o esboço da PEC, relatada por Domingos Neto (PSD-CE)', 'Meta: levar ao plenário da Câmara até o fim de novembro'], num=False, px=38, gap=26),
        top=260, gap=34)),
    tela('vr8-06', MAG, arrobas() + bloco(
        KICK('O QUE DIZ O ESBOÇO', '#0b1a4a') + T('OS DETALHES', 160) + BARRA('#0b1a4a') +
        lista(['<b>Voto único</b>: o voto no candidato do distrito também conta pra lista do partido (o texto do Senado de 2017 previa dois votos)', 'Distritos com população parecida e território contínuo, com base no IBGE e revistos a cada censo', 'Cada distrito elege <b>1 deputado federal e 2 estaduais</b>', 'Lista com <b>pelo menos 1 mulher a cada 3 nomes</b>'], num=False, px=36, cor_num='#f7f400', gap=24),
        top=230, gap=30)),
    tela('vr8-07', AZUL, arrobas() + bloco(
        KICK('QUEM MUDA E QUEM NÃO') + T(f'SÓ MUDA O<br>{MARCA("LEGISLATIVO")}', 150) + BARRA('#e224d6') +
        lista(['Muda: deputados federais, estaduais e distritais', 'Vereadores também entram na discussão', 'Não muda: presidente, governador, senador e prefeito'], num=False, px=40, gap=28) +
        f'<div style="display:flex;gap:20px;margin-top:10px;">{"".join(f"<div style=\"flex:1;background:{bg};color:{c};border-radius:14px;padding:18px 22px;\"><div style=\"{BB}font-size:96px;line-height:.9;\">{a}</div><div style=\"font-weight:700;font-size:30px;\">{b}</div></div>" for a, b, bg, c in [("2030", "eleição de transição", "#f7f400", "#0b1a4a"), ("2034", "distrital misto completo", "#e224d6", "#fff")])}</div>',
        top=230, gap=30)),
    tela('vr8-08', NAVY, fantasma('3/5', 'rgba(247,244,0,.07)', top=760, left=-20, px=700) + arrobas() + bloco(
        KICK('POR QUE PRECISA DE PEC') + T(f'TÁ NA<br>{MARCA("CONSTITUIÇÃO")}', 150) + BARRA() +
        P('O art. 45 da CF diz que a Câmara é eleita pelo <b>sistema proporcional</b>. Pra trocar, só emenda constitucional (art. 60, § 2º):', 38, 'max-width:840px;') +
        lista(['3/5 dos votos, em 2 turnos, em cada Casa', 'Na Câmara: 308 de 513 deputados', 'No Senado: 49 de 81 senadores'], num=False, px=38, gap=22),
        top=240, gap=30)),
    tela('vr8-09', CLARO, arrobas(True) + bloco(
        KICK('O DEBATE', '#0a3aa6') + T(f'PRÓS E {MARCA("CONTRAS")}', 150, 'color:#0b1a4a;') +
        f'<div style="display:grid;grid-template-columns:1fr 1fr;gap:22px;color:#0b1a4a;">'
        f'<div style="background:#fff;border-radius:16px;padding:22px;box-shadow:0 10px 30px rgba(11,26,74,.1);"><div style="{BB}font-size:60px;color:#0a3aa6;">A FAVOR</div>{lista(["Deputado mais perto do eleitor", "Fim do puxador de votos", "Campanha em área menor, mais barata"], num=False, px=30, cor_num="#0a3aa6", gap=16)}</div>'
        f'<div style="background:#fff;border-radius:16px;padding:22px;box-shadow:0 10px 30px rgba(11,26,74,.1);"><div style="{BB}font-size:60px;color:#e224d6;">CONTRA</div>{lista(["Mais difícil pra minorias", "Risco de desenhar distritos a favor de alguém", "Mais poder pros dirigentes nas listas"], num=False, px=30, cor_num="#e224d6", gap=16)}</div></div>' +
        P('Status: <b>ainda não foi votado</b>. Centrão apoia; PT e PL resistem.', 34, 'color:#0b1a4a;'),
        top=220, gap=30), claro=True),
    tela('vr8-10', AZUL, selos() + f'<div style="position:absolute;left:80px;right:80px;top:340px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:34px;">'
         f'{T(f"E VOCÊ,<br>{MARCA("PREFERE")}?", 170)}{BARRA("#e224d6")}{P("Votar no candidato da sua região ou continuar com o sistema de hoje?", 40)}'
         f'<div style="background:#f7f400;color:#0b1a4a;border-radius:999px;padding:22px 44px;font-weight:700;font-size:38px;">Comenta: <span style="background:#e224d6;color:#fff;padding:0 12px;border-radius:4px;">DISTRITAL</span> ou <span style="background:#0b1a4a;color:#fff;padding:0 12px;border-radius:4px;">ATUAL</span></div>'
         f'<div style="font-weight:500;font-size:26px;opacity:.8;max-width:820px;">Fontes: CF, arts. 45 e 60; Câmara dos Deputados; Jovem Pan e Tribuna do Sertão (esboço do PSD, 9/11/2026).</div></div>'
         f'<div style="position:absolute;bottom:70px;left:50%;margin-left:-110px;">{LOGO(46)}</div>'),
]))

bloco_html = INI + '\n' + ''.join(G) + FIM
s = KIT.read_text()
if INI in s:
    s = re.sub(re.escape(INI) + '.*?' + re.escape(FIM), lambda m: bloco_html, s, flags=re.S)
else:
    s = s.replace('</section>\n</x-dc>', bloco_html + '\n</section>\n</x-dc>')
KIT.write_text(s)
print('ok', s.count('data-screen-label="vr'))
